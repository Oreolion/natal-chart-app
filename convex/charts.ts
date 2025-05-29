import { v } from "convex/values";
import { action, query, mutation } from "./_generated/server";
import swisseph from 'swisseph';
import moment from 'moment-timezone';


// Helper to get Julian Day for UT (Universal Time)
function getJulianDayUT(year: number, month: number, day: number, hour: number, minute: number, second: number, timezone: string): number {
  // Create a moment object for the birth time in the given timezone
  const birthMoment = moment.tz(
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
    timezone
  );

  // Convert to UTC
  const utcMoment = birthMoment.utc();

  // Swiss Ephemeris requires UT for Julian Day
  const jd_ut = swisseph.swe_julday(
    utcMoment.year(),
    utcMoment.month() + 1, // moment.js months are 0-indexed, Swiss Ephemeris is 1-indexed
    utcMoment.date(),
    utcMoment.hour() + utcMoment.minute() / 60 + utcMoment.second() / 3600, // Fractional hour
    swisseph.SE_GREG_CAL // Calendar flag
  );
  return jd_ut;
}

// Define the planets to calculate using Moshier's Ephemeris (no data files needed)
const planetsToCalculate = [
  swisseph.SE_SUN,
  swisseph.SE_MOON,
  swisseph.SE_MERCURY,
  swisseph.SE_VENUS,
  swisseph.SE_MARS,
  swisseph.SE_JUPITER,
  swisseph.SE_SATURN,
  swisseph.SE_URANUS,
  swisseph.SE_NEPTUNE,
  swisseph.SE_PLUTO,
  swisseph.SE_TRUE_NODE, // Lunar North Node (True Node is generally preferred)
  // swisseph.SE_MEAN_NODE, // Mean Lunar Node
  // swisseph.SE_CHIRON, // Chiron
  // swisseph.SE_LILITH, // Lilith (Mean Apogee)
];

// House system mapping for Swiss Ephemeris constants
const houseSystems = {
  'Placidus': 'P',
  'Koch': 'K',
  'Regiomontanus': 'R',
  'Campanus': 'C',
  'Equal': 'E',
  'WholeSigns': 'W',
  // Add more if needed based on Swiss Ephemeris documentation
};

// --- Convex Actions and Queries ---

// Action to calculate the natal chart and store it
export const calculateNatalChart = action({
  args: {
    userId: v.string(), // Pass a user ID (e.g., from Clerk auth or a temp ID)
    date: v.string(),
    time: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    timezone: v.string(),
    houseSystem: v.optional(v.string()), // Optional house system preference
  },
  handler: async (ctx, args) => {
    const { userId, date, time, latitude, longitude, timezone, houseSystem = 'Placidus' } = args;

    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const second = 0; // Assuming seconds are not provided

    try {
      // Set ephemeris path (not strictly needed for Moshier, but good practice if you ever switch)
      // swisseph.swe_set_ephe_path('./ephe'); // This path would be relative to the Convex function's environment if files were used.

      const jd_ut = getJulianDayUT(year, month, day, hour, minute, second, timezone);

      const chartPositions: { [key: string]: { longitude: number; speed: number; } } = {};
      // Use SEFLG_MOSEPH for Moshier's ephemeris (no data files required)
      const flags = swisseph.SEFLG_SPEED | swisseph.SEFLG_MOSEPH;

      for (const planetId of planetsToCalculate) {
        const planetName = swisseph.swe_get_planet_name(planetId);
        const planetData = swisseph.swe_calc_ut(jd_ut, planetId, flags);

        if (planetData.error) {
          console.error(`Error calculating ${planetName}:`, planetData.error);
          continue;
        }
        const longitude = planetData.longitude;
        const speed = planetData.speed; // Degrees per day

        chartPositions[planetName] = {
          longitude: longitude,
          speed: speed,
        };
      }

      // Calculate House Cusps, Ascendant, and Midheaven
      const geo_lat = parseFloat(latitude);
      const geo_lon = parseFloat(longitude);
      const selectedHouseSystem = houseSystems[houseSystem as keyof typeof houseSystems] || 'P'; // Default to Placidus

      const housesResult = swisseph.swe_houses(jd_ut, geo_lat, geo_lon, selectedHouseSystem);

      if (housesResult.error) {
        console.error("Error calculating houses:", housesResult.error);
        throw new Error('Error calculating houses.');
      }

      const houseCusps = housesResult.cusps; // Array of 12 house cusps (0-indexed for house 1-12)
      const ascendant = housesResult.ascendant;
      const midheaven = housesResult.mc;

      // Store the birth data first
      const birthDataId = await ctx.db.insert("birthData", {
        userId,
        date,
        time,
        location: args.location, // Use original location string
        latitude,
        longitude,
        timezone,
        timestamp: Date.now(),
      });

      // Store the calculated chart results
      const chartId = await ctx.db.insert("natalCharts", {
        birthDataId,
        userId,
        planets: chartPositions,
        ascendant: ascendant,
        midheaven: midheaven,
        houseCusps: houseCusps,
        calculatedAt: Date.now(),
      });

      return { chartId, birthDataId, chart: { planets: chartPositions, ascendant, midheaven, houseCusps } };

    } catch (error: any) {
      console.error('Convex calculation error:', error);
      throw new Error(`Chart calculation failed: ${error.message}`);
    }
  },
});

// Query to get the latest chart for a user (or specific chart by ID)
export const getLatestChart = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Fetch the latest chart for the given user
    const chart = await ctx.db
      .query("natalCharts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc") // Order by creation time (implicitly by _creationTime)
      .first();

    // You might also want to fetch the corresponding birthData if needed
    // if (chart) {
    //   const birthData = await ctx.db.get(chart.birthDataId);
    //   return { chart, birthData };
    // }
    return chart;
  },
});

// Query to get a specific chart by its ID
export const getChartById = query({
  args: { chartId: v.id("natalCharts") },
  handler: async (ctx, args) => {
    const chart = await ctx.db.get(args.chartId);
    return chart;
  },
});

// Mutation to save birth data (if you want to save it without immediately calculating)
export const addBirthData = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("birthData", {
      userId: args.userId,
      date: args.date,
      time: args.time,
      location: args.location,
      latitude: args.latitude,
      longitude: args.longitude,
      timezone: args.timezone,
      timestamp: Date.now(),
    });
    return id;
  },
});