'use client';
import React, { useEffect, useState, ChangeEvent } from "react";
import { Star, Moon, Sun, Calendar, Clock, MapPin, AlertTriangle, Info, BookOpen } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ZodiacSign {
    name: string;
    symbol: string;
    element: string;
    quality: string;
    ruler: string;
    traits: string;
    description: string;
}

const zodiacSigns: ZodiacSign[] = [
    { name: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', traits: 'Bold, pioneering, energetic, impulsive, leadership-oriented', description: 'The Ram - First sign of the zodiac, representing new beginnings, courage, and initiative.' },
    { name: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed', ruler: 'Venus', traits: 'Stable, practical, sensual, stubborn, value-oriented', description: 'The Bull - Represents stability, material security, beauty, and persistence.' },
    { name: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable', ruler: 'Mercury', traits: 'Curious, communicative, versatile, restless, intellectual', description: 'The Twins - Embodies duality, communication, learning, and adaptability.' },
    { name: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon', traits: 'Nurturing, emotional, protective, intuitive, home-loving', description: 'The Crab - Represents emotions, family, intuition, and the need for security.' },
    { name: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed', ruler: 'Sun', traits: 'Confident, creative, dramatic, generous, attention-seeking', description: 'The Lion - Embodies self-expression, creativity, pride, and natural leadership.' },
    { name: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', traits: 'Analytical, perfectionist, helpful, practical, detail-oriented', description: 'The Virgin - Represents service, analysis, health, and attention to detail.' },
    { name: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal', ruler: 'Venus', traits: 'Diplomatic, harmonious, indecisive, relationship-focused, aesthetic', description: 'The Scales - Embodies balance, relationships, justice, and beauty.' },
    { name: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed', ruler: 'Mars/Pluto', traits: 'Intense, mysterious, transformative, passionate, investigative', description: 'The Scorpion - Represents transformation, depth, secrets, and regeneration.' },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', traits: 'Adventurous, philosophical, optimistic, freedom-loving, expansive', description: 'The Archer - Embodies exploration, higher learning, philosophy, and freedom.' },
    { name: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', traits: 'Ambitious, disciplined, responsible, practical, status-conscious', description: 'The Goat - Represents achievement, responsibility, structure, and ambition.' },
    { name: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed', ruler: 'Saturn/Uranus', traits: 'Independent, innovative, humanitarian, detached, progressive', description: 'The Water Bearer - Embodies innovation, friendship, ideals, and social consciousness.' },
    { name: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable', ruler: 'Jupiter/Neptune', traits: 'Compassionate, intuitive, dreamy, sensitive, spiritual', description: 'The Fish - Represents spirituality, compassion, dreams, and transcendence.' }
];

interface Planet {
    name: string;
    symbol: string;
    meaning: string;
    detailed: string;
}

const planets: Planet[] = [
    { name: 'Sun', symbol: '☉', meaning: 'Core identity, ego, vitality, life purpose, father figure', detailed: 'Represents your essential self, how you shine in the world, your creative life force, and your conscious will. The Sun shows what you are learning to become and your path to self-realization.' },
    { name: 'Moon', symbol: '☽', meaning: 'Emotions, instincts, subconscious, mother figure, home', detailed: 'Your emotional nature, instinctive responses, what makes you feel secure, and your relationship with the feminine. The Moon reveals your inner world and emotional needs.' },
    { name: 'Mercury', symbol: '☿', meaning: 'Communication, thinking, learning, short trips, siblings', detailed: 'How you think, communicate, learn, and process information. Mercury governs your mental patterns, communication style, and how you connect with your immediate environment.' },
    { name: 'Venus', symbol: '♀', meaning: 'Love, beauty, relationships, values, money, art', detailed: 'What you find beautiful, how you love and want to be loved, your aesthetic sense, and what you value. Venus shows your approach to relationships and material pleasures.' },
    { name: 'Mars', symbol: '♂', meaning: 'Action, drive, passion, anger, sexuality, competition', detailed: 'Your drive, ambition, how you assert yourself, and what motivates you to action. Mars represents your fighting spirit, sexuality, and how you pursue your desires.' },
    { name: 'Jupiter', symbol: '♃', meaning: 'Expansion, wisdom, luck, philosophy, higher education, travel', detailed: 'Your beliefs, where you seek meaning, how you grow and expand. Jupiter represents optimism, higher learning, philosophy, and where you find your greatest opportunities.' },
    { name: 'Saturn', symbol: '♄', meaning: 'Discipline, responsibility, limitations, lessons, authority', detailed: 'Your sense of responsibility, where you face challenges and restrictions, and what you must master. Saturn represents maturity, discipline, and life lessons.' },
    { name: 'Uranus', symbol: '♅', meaning: 'Innovation, rebellion, sudden change, freedom, originality', detailed: 'Where you seek freedom and originality, how you rebel and innovate. Uranus represents sudden changes, breakthroughs, and your unique contribution to the world.' },
    { name: 'Neptune', symbol: '♆', meaning: 'Dreams, spirituality, illusion, compassion, inspiration', detailed: 'Your spiritual ideals, imagination, and connection to the divine. Neptune represents dreams, illusions, compassion, and your transcendental experiences.' },
    { name: 'Pluto', symbol: '♇', meaning: 'Transformation, power, rebirth, the unconscious, regeneration', detailed: 'Where you experience deep transformation and regeneration. Pluto represents power, the unconscious, death and rebirth cycles, and profound change.' },
    { name: 'True Node', symbol: '☊', meaning: 'Karmic path, life purpose, destiny, spiritual growth', detailed: 'The True Node represents the lessons you are meant to learn and the direction your soul is evolving in this lifetime. It indicates your karmic path and areas of spiritual growth.' }
];

interface House {
    number: number;
    name: string;
    meaning: string;
    detailed: string;
    keywords: string[];
}

const houses: House[] = [
    { number: 1, name: 'Self & Identity', meaning: 'Your personality, physical appearance, first impressions, how you approach life', detailed: 'The Ascendant and 1st house represent your outer personality, physical body, and how others first perceive you. This is your mask to the world and your approach to new situations.', keywords: ['Identity', 'Appearance', 'First Impressions', 'Initiative'] },
    { number: 2, name: 'Values & Resources', meaning: 'Personal possessions, money, self-worth, values, material security', detailed: 'What you own, earn, and value. This house shows your relationship with money, possessions, self-worth, and what you consider valuable in life.', keywords: ['Money', 'Possessions', 'Self-Worth', 'Values'] },
    { number: 3, name: 'Communication & Learning', meaning: 'Communication, siblings, short trips, daily learning, local environment', detailed: 'How you communicate, learn, and interact with your immediate environment. Includes relationships with siblings, neighbors, and short-distance travel.', keywords: ['Communication', 'Learning', 'Siblings', 'Short Trips'] },
    { number: 4, name: 'Home & Roots', meaning: 'Home, family, roots, mother, emotional foundation, private life', detailed: 'Your family background, home environment, emotional foundation, and relationship with parents (especially mother). Represents your roots and private life.', keywords: ['Home', 'Family', 'Roots', 'Privacy'] },
    { number: 5, name: 'Creativity & Romance', meaning: 'Children, creativity, romance, self-expression, hobbies, speculation', detailed: 'Creative self-expression, romantic relationships, children, hobbies, and what brings you joy. This house governs play, creativity, and heart-centered activities.', keywords: ['Creativity', 'Romance', 'Children', 'Joy'] },
    { number: 6, name: 'Health & Service', meaning: 'Daily work, health, service, routines, pets, employees', detailed: 'Your daily work environment, health practices, service to others, and daily routines. This house governs practical service and maintaining your physical well-being.', keywords: ['Health', 'Work', 'Service', 'Routines'] },
    { number: 7, name: 'Relationships & Partnership', meaning: 'Marriage, business partnerships, open enemies, one-on-one relationships', detailed: 'Your approach to committed relationships, business partnerships, and open conflicts. This house shows what you seek in a partner and how you relate one-on-one.', keywords: ['Marriage', 'Partnerships', 'Relationships', 'Others'] },
    { number: 8, name: 'Transformation & Shared Resources', meaning: 'Shared money, investments, taxes, death, rebirth, occult, sexuality', detailed: 'Joint finances, investments, inheritance, taxes, and deep psychological transformation. This house governs intimacy, shared resources, and metaphysical interests.', keywords: ['Transformation', 'Shared Resources', 'Intimacy', 'Mystery'] },
    { number: 9, name: 'Philosophy & Higher Learning', meaning: 'Higher education, philosophy, religion, foreign travel, publishing, law', detailed: 'Your belief system, higher education, long-distance travel, and quest for meaning. This house governs philosophy, religion, law, and expanding your worldview.', keywords: ['Philosophy', 'Higher Education', 'Travel', 'Beliefs'] },
    { number: 10, name: 'Career & Public Image', meaning: 'Career, reputation, public image, authority, father, achievements', detailed: 'Your public reputation, career path, relationship with authority, and life achievements. This house shows how you want to be known in the world.', keywords: ['Career', 'Reputation', 'Achievement', 'Public Image'] },
    { number: 11, name: 'Friendships & Aspirations', meaning: 'Friends, hopes, wishes, groups, humanitarian causes, social networks', detailed: 'Your friendships, group associations, hopes and dreams for the future. This house governs your social network and humanitarian ideals.', keywords: ['Friends', 'Groups', 'Hopes', 'Social Causes'] },
    { number: 12, name: 'Spirituality & Hidden Realm', meaning: 'Subconscious, hidden enemies, spirituality, karma, self-undoing, sacrifice', detailed: 'Your subconscious mind, spiritual life, hidden strengths and weaknesses, and connection to the collective unconscious. This house governs what is hidden and spiritual transcendence.', keywords: ['Spirituality', 'Subconscious', 'Hidden', 'Sacrifice'] }
];

interface CityData {
    lat: number;
    lng: number;
    name: string;
    timezone: string;
}

const popularCities: { [key: string]: CityData } = {
    'new york': { lat: 40.7128, lng: -74.0060, name: 'New York, NY, USA', timezone: 'America/New_York' },
    'london': { lat: 51.5074, lng: -0.1278, name: 'London, UK', timezone: 'Europe/London' },
    'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France', timezone: 'Europe/Paris' },
    'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan', timezone: 'Asia/Tokyo' },
    'sydney': { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia', timezone: 'Australia/Sydney' },
    'los angeles': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA, USA', timezone: 'America/Los_Angeles' },
    'chicago': { lat: 41.8781, lng: -87.6298, name: 'Chicago, IL, USA', timezone: 'America/Chicago' },
    'miami': { lat: 25.7617, lng: -80.1918, name: 'Miami, FL, USA', timezone: 'America/New_York' },
    'berlin': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany', timezone: 'Europe/Berlin' },
    'rome': { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy', timezone: 'Europe/Rome' },
    'nairobi': { lat: -1.2921, lng: 36.8219, name: 'Nairobi, Kenya', timezone: 'Africa/Nairobi' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India', timezone: 'Asia/Kolkata' },
    'beijing': { lat: 39.9042, lng: 116.4074, name: 'Beijing, China', timezone: 'Asia/Shanghai' },
    'cairo': { lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt', timezone: 'Africa/Cairo' },
    'moscow': { lat: 55.7558, lng: 37.6176, name: 'Moscow, Russia', timezone: 'Europe/Moscow' },
    'sao paulo': { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil', timezone: 'America/Sao_Paulo' },
    'toronto': { lat: 43.6532, lng: -79.3832, name: 'Toronto, Canada', timezone: 'America/Toronto' },
    'dubai': { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE', timezone: 'Asia/Dubai' }
};
// --- End of Frontend Data Definitions ---

// Type for processed planet data
interface ProcessedPlanet extends Planet {
    longitude: number;
    speed: number;
    sign: ZodiacSign;
    degreeInSign: string; // Changed to string to match toFixed(2)
    house: number;
    displayDegree: string;
}

// Type for chart data
interface NatalChart {
    birthData: {
        date: string;
        time: string;
        location: string;
        latitude: string;
        longitude: string;
        timezone: string;
    };
    positions: { [key: string]: ProcessedPlanet };
    ascendant: {
        sign: ZodiacSign;
        degree: string;
        degreeInSign: string;
        displayDegree: string;
    };
    midheaven: {
        sign: ZodiacSign;
        degree: string;
        degreeInSign: string;
        displayDegree: string;
    };
    houseCusps: Array<{
        number: number;
        degree: string;
        sign: ZodiacSign;
        degreeInSign: string;
        displayDegree: string;
    }>;
}

// More accurate sign calculation
const getSignFromDegree = (degree: number) => {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedDegree / 30);
    const degreeInSign = normalizedDegree % 30;
    return {
        sign: zodiacSigns[signIndex],
        degreeInSign: degreeInSign
    };
};

const Home: React.FC = () => {
    const [birthData, setBirthData] = useState({
        date: '',
        time: '',
        location: '',
        latitude: '',
        longitude: '',
        timezone: ''
    });
    const [chart, setChart] = useState<NatalChart | null>(null);
    const [loading, setLoading] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [error, setError] = useState('');

    // Convex mutation hook
    const calculateChart = useMutation(api.charts.calculateNatalChart);

    // Using a ref for the timeout to prevent issues with state closure in useEffect/handlers
    const locationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const geocodeLocation = async (location: string) => {
        if (!location.trim()) return;

        setGeocoding(true);
        setError('');

        const searchKey = location.toLowerCase().trim();
        const cityMatch = Object.keys(popularCities).find(city =>
            searchKey.includes(city) || (searchKey.split(',')[0] && city.includes(searchKey.split(',')[0]))
        );

        if (cityMatch) {
            const cityData = popularCities[cityMatch];
            setBirthData(prev => ({
                ...prev,
                latitude: cityData.lat.toFixed(4),
                longitude: cityData.lng.toFixed(4),
                timezone: cityData.timezone
            }));
            setGeocoding(false);
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'Professional Natal Chart App (Next.js)' // Required by Nominatim
                    }
                }
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                setBirthData(prev => ({
                    ...prev,
                    latitude: parseFloat(result.lat).toFixed(4),
                    longitude: parseFloat(result.lon).toFixed(4),
                    timezone: 'UTC' // Fallback to UTC if Nominatim doesn't provide it directly
                }));
            } else {
                setError('Location not found. Please try a major city name or enter coordinates and timezone manually.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setError('Could not find location. Please enter coordinates and timezone manually.');
        }
        setGeocoding(false);
    };

    const handleGenerateChart = async () => {
        setError('');

        if (!birthData.date || !birthData.time) {
            setError('Please enter birth date and time');
            return;
        }

        if (!birthData.latitude || !birthData.longitude) {
            if (birthData.location) {
                await geocodeLocation(birthData.location);
                // After geocoding, the state update is asynchronous.
                // We need to wait for it to reflect or re-check.
                // A better approach would be to trigger the calculation in a useEffect
                // or ensure geocodeLocation *synchronously* returns coordinates.
                // For now, we'll just re-check the state in the next tick.
                if (!birthData.latitude || !birthData.longitude) {
                    setError('Geocoding in progress or failed. Please try generating the chart again after location fields are populated, or fill them manually.');
                    return;
                }
            } else {
                setError('Please enter a location or coordinates to generate your chart');
                return;
            }
        }

        // Final validation before sending to backend
        if (!birthData.latitude || !birthData.longitude || !birthData.timezone) {
            setError('Missing complete location details (latitude, longitude, and timezone). Please ensure they are filled or try another location search.');
            return;
        }

        setLoading(true);
        try {
            const userId = "demo_user_123"; // Replace with actual user ID from authentication

            const result = await calculateChart({
                userId,
                date: birthData.date,
                time: birthData.time,
                latitude: birthData.latitude,
                longitude: birthData.longitude,
                timezone: birthData.timezone,
                houseSystem: 'Placidus' // You can make this selectable in the UI
            });

            if (result && result.chart) {
                const processedPlanets: { [key: string]: ProcessedPlanet } = {};
                for (const planetName in result.chart.planets) {
                    const { longitude, speed } = result.chart.planets[planetName];
                    const signInfo = getSignFromDegree(longitude);

                    let houseNumber = 1;
                    const cusps = result.chart.houseCusps;
                    for (let i = 0; i < 12; i++) {
                        const currentCusp = cusps[i];
                        const nextCusp = cusps[(i + 1) % 12];

                        if (nextCusp > currentCusp) {
                            if (longitude >= currentCusp && longitude < nextCusp) {
                                houseNumber = i + 1;
                                break;
                            }
                        } else {
                            if (longitude >= currentCusp || longitude < nextCusp) {
                                houseNumber = i + 1;
                                break;
                            }
                        }
                    }
                    const detailedPlanet = planets.find(p => p.name.toLowerCase() === planetName.toLowerCase());

                    processedPlanets[planetName] = {
                        ...(detailedPlanet as Planet), // Cast to Planet, as some fields like 'symbol' might be missing without it
                        longitude: longitude,
                        speed: speed,
                        sign: signInfo.sign,
                        degreeInSign: signInfo.degreeInSign.toFixed(2),
                        house: houseNumber,
                        displayDegree: `${Math.floor(signInfo.degreeInSign)}°${Math.floor((signInfo.degreeInSign % 1) * 60)}'`
                    };
                }

                const ascendantSignInfo = getSignFromDegree(result.chart.ascendant);
                const midheavenSignInfo = getSignFromDegree(result.chart.midheaven);

                setChart({
                    birthData: { ...birthData, location: birthData.location },
                    positions: processedPlanets,
                    ascendant: {
                        sign: ascendantSignInfo.sign,
                        degree: result.chart.ascendant.toFixed(2),
                        degreeInSign: ascendantSignInfo.degreeInSign.toFixed(2),
                        displayDegree: `${Math.floor(ascendantSignInfo.degreeInSign)}°${Math.floor((ascendantSignInfo.degreeInSign % 1) * 60)}'`
                    },
                    midheaven: {
                        sign: midheavenSignInfo.sign,
                        degree: result.chart.midheaven.toFixed(2),
                        degreeInSign: midheavenSignInfo.degreeInSign.toFixed(2),
                        displayDegree: `${Math.floor(midheavenSignInfo.degreeInSign)}°${Math.floor((midheavenSignInfo.degreeInSign % 1) * 60)}'`
                    },
                    houseCusps: result.chart.houseCusps.map((cusp: number, index: number) => ({
                        number: index + 1,
                        degree: cusp.toFixed(2),
                        sign: getSignFromDegree(cusp).sign,
                        degreeInSign: getSignFromDegree(cusp).degreeInSign.toFixed(2),
                        displayDegree: `${Math.floor(getSignFromDegree(cusp).degreeInSign)}°${Math.floor((getSignFromDegree(cusp).degreeInSign % 1) * 60)}'`
                    }))
                });
            } else {
                setError('Failed to calculate chart: No chart data returned.');
            }
        } catch (e: any) {
            console.error("Error calculating chart:", e);
            setError(`Error calculating chart: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBirthData(prev => ({ ...prev, location: value }));

        if (locationTimeoutRef.current) {
            clearTimeout(locationTimeoutRef.current);
        }

        if (value.length > 3) {
            locationTimeoutRef.current = setTimeout(() => {
                geocodeLocation(value);
            }, 1000);
        }
    };

    interface ChartWheelProps {
        positions: { [key: string]: ProcessedPlanet };
        ascendant: NatalChart['ascendant'];
        houseCusps: NatalChart['houseCusps'];
    }

    const ChartWheel: React.FC<ChartWheelProps> = ({ positions, ascendant, houseCusps }) => {
        const radius = 160;
        const centerX = 200;
        const centerY = 200;

        return (
            <div className="relative">
                <svg width="400" height="400" className="border-2 border-purple-300 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50">
                    {/* Outer circle */}
                    <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#8B5CF6" strokeWidth="3" />

                    {/* Inner circle */}
                    <circle cx={centerX} cy={centerY} r={radius * 0.6} fill="none" stroke="#A78BFA" strokeWidth="2" />

                    {/* House divisions */}
                    {houseCusps.map((cusp, index) => {
                        const angle = (parseFloat(cusp.degree) - 90) * (Math.PI / 180); // Adjust for SVG's 0-degree at 3 o'clock
                        const x1 = centerX + (radius * 0.6) * Math.cos(angle);
                        const y1 = centerY + (radius * 0.6) * Math.sin(angle);
                        const x2 = centerX + radius * Math.cos(angle);
                        const y2 = centerY + radius * Math.sin(angle);

                        const nextCuspDegree = parseFloat(houseCusps[(index + 1) % 12].degree);
                        let midAngle = (parseFloat(cusp.degree) + nextCuspDegree) / 2;
                        if (nextCuspDegree < parseFloat(cusp.degree)) {
                            midAngle = (parseFloat(cusp.degree) + nextCuspDegree + 360) / 2;
                        }
                        midAngle = (midAngle - 90) * (Math.PI / 180);

                        const labelRadius = radius * 0.8;
                        const labelX = centerX + labelRadius * Math.cos(midAngle);
                        const labelY = centerY + labelRadius * Math.sin(midAngle);

                        return (
                            <g key={`house-cusp-${index}`}>
                                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8B5CF6" strokeWidth="1" />
                                <text
                                    x={labelX}
                                    y={labelY}
                                    fill="#6B21A8"
                                    fontSize="10"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="font-semibold"
                                >
                                    H{cusp.number}
                                </text>
                            </g>
                        );
                    })}

                    {/* Planet positions */}
                    {Object.values(positions).map((planet: ProcessedPlanet) => {
                        const angle = (planet.longitude - 90) * (Math.PI / 180);
                        const planetRadius = radius * 0.75;
                        const x = centerX + planetRadius * Math.cos(angle);
                        const y = centerY + planetRadius * Math.sin(angle);

                        return (
                            <g key={planet.name}>
                                <text
                                    x={x}
                                    y={y}
                                    fill="#3700B3"
                                    fontSize="16"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="font-bold"
                                    title={`${planet.name} in ${planet.sign.name} ${planet.displayDegree} in House ${planet.house}`}
                                >
                                    {planet.symbol}
                                </text>
                                <text
                                    x={x + 15}
                                    y={y - 10}
                                    fill="#5C00D8"
                                    fontSize="8"
                                >
                                    {Math.floor(parseFloat(planet.degreeInSign))}°
                                </text>
                            </g>
                        );
                    })}

                    {/* Ascendant and Midheaven Markers */}
                    {ascendant && (
                        <g>
                            <line
                                x1={centerX + (radius * 0.6) * Math.cos((parseFloat(ascendant.degree) - 90) * (Math.PI / 180))}
                                y1={centerY + (radius * 0.6) * Math.sin((parseFloat(ascendant.degree) - 90) * (Math.PI / 180))}
                                x2={centerX + radius * Math.cos((parseFloat(ascendant.degree) - 90) * (Math.PI / 180))}
                                y2={centerY + radius * Math.sin((parseFloat(ascendant.degree) - 90) * (Math.PI / 180))}
                                stroke="#FF0000"
                                strokeWidth="2"
                            />
                            <text
                                x={centerX + (radius * 0.9) * Math.cos((parseFloat(ascendant.degree) - 90) * (Math.PI / 180))}
                                y={centerY + (radius * 0.9) * Math.sin((parseFloat(ascendant.degree) - 90) * (Math.PI / 180))}
                                fill="#FF0000"
                                fontSize="18"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                AC
                            </text>
                        </g>
                    )}
                    {chart?.midheaven && (
                        <g>
                            <line
                                x1={centerX + (radius * 0.6) * Math.cos((parseFloat(chart.midheaven.degree) - 90) * (Math.PI / 180))}
                                y1={centerY + (radius * 0.6) * Math.sin((parseFloat(chart.midheaven.degree) - 90) * (Math.PI / 180))}
                                x2={centerX + radius * Math.cos((parseFloat(chart.midheaven.degree) - 90) * (Math.PI / 180))}
                                y2={centerY + radius * Math.sin((parseFloat(chart.midheaven.degree) - 90) * (Math.PI / 180))}
                                stroke="#0000FF"
                                strokeWidth="2"
                            />
                            <text
                                x={centerX + (radius * 0.9) * Math.cos((parseFloat(chart.midheaven.degree) - 90) * (Math.PI / 180))}
                                y={centerY + (radius * 0.9) * Math.sin((parseFloat(chart.midheaven.degree) - 90) * (Math.PI / 180))}
                                fill="#0000FF"
                                fontSize="18"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                MC
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        );
    };

    // Helper function for interpretation (can be expanded)
    const getInterpretation = (item: ProcessedPlanet | NatalChart['ascendant'] | NatalChart['midheaven'] | NatalChart['houseCusps'][number], type: 'planet' | 'house' | 'ascendant' | 'midheaven'): JSX.Element | null => {
        if (!item) return null;

        if (type === 'planet') {
            const planetItem = item as ProcessedPlanet;
            const planetDetails = planets.find(p => p.name === planetItem.name);
            const houseDetails = houses.find(h => h.number === planetItem.house);

            return (
                <div key={planetItem.name} className="mb-4 p-3 bg-purple-50 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg text-purple-700">{planetItem.name} in {planetItem.sign.name} ({planetItem.displayDegree}) in House {planetItem.house}</h3>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Meaning of {planetItem.name}:</span> {planetDetails?.detailed}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Meaning of House {planetItem.house} ({houseDetails?.name}):</span> {houseDetails?.detailed}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Combined Interpretation:</span> This placement suggests your {planetItem.name.toLowerCase()}ic energies are expressed through the traits of {planetItem.sign.name} and influence matters related to House {planetItem.house} (the house of {houseDetails?.name}). This combination often implies {item.sign.traits.toLowerCase()} qualities in areas of {houseDetails?.keywords.join(', ').toLowerCase()}.
                    </p>
                </div>
            );
        } else if (type === 'ascendant') {
            const ascendantItem = item as NatalChart['ascendant'];
            const firstHouseDetails = houses.find(h => h.number === 1);
            return (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg text-red-700">Ascendant (Rising Sign) in {ascendantItem.sign.name} ({ascendantItem.displayDegree})</h3>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Your Outer Personality:</span> The Ascendant represents your outward personality, your first impression, and how you approach the world.
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Interpretation:</span> With {ascendantItem.sign.name} as your rising sign, you are likely perceived as {ascendantItem.sign.traits.toLowerCase()}. This placement often defines your initial reactions and how you project yourself. It heavily influences your physical appearance and spontaneous responses.
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Associated House 1 ({firstHouseDetails?.name}):</span> {firstHouseDetails?.detailed}
                    </p>
                </div>
            );
        } else if (type === 'midheaven') {
            const midheavenItem = item as NatalChart['midheaven'];
            const tenthHouseDetails = houses.find(h => h.number === 10);
            return (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg text-blue-700">Midheaven (MC) in {midheavenItem.sign.name} ({midheavenItem.displayDegree})</h3>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Career & Public Image:</span> The Midheaven represents your public reputation, career path, and ultimate achievements.
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Interpretation:</span> With your Midheaven in {midheavenItem.sign.name}, you are likely to pursue a career that aligns with {midheavenItem.sign.traits.toLowerCase()} qualities. Your public image will often reflect traits associated with {midheavenItem.sign.name}.
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Associated House 10 ({tenthHouseDetails?.name}):</span> {tenthHouseDetails?.detailed}
                    </p>
                </div>
            );
        } else if (type === 'house') {
            const houseCuspItem = item as NatalChart['houseCusps'][number];
            const houseDetails = houses.find(h => h.number === houseCuspItem.number);
            return (
                <div key={`house-${houseCuspItem.number}`} className="mb-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-md text-gray-800">House {houseCuspItem.number} ({houseDetails?.name}) starts in {houseCuspItem.sign.name} ({houseCuspItem.displayDegree})</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">House Meaning:</span> {houseDetails?.meaning}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Detailed:</span> {houseDetails?.detailed}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Influence:</span> The energies of {houseCuspItem.sign.name} influence matters related to this house, suggesting {houseCuspItem.sign.traits.toLowerCase()} themes in this area of life.
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-purple-800 tracking-tight flex items-center justify-center gap-3">
                    <Star className="w-10 h-10 text-yellow-500" /> Professional Natal Chart
                </h1>
                <p className="text-xl text-purple-600 mt-2">Discover Your Cosmic Blueprint</p>
            </header>

            <main className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6" /> Your Birth Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                            <input
                                type="date"
                                id="birthDate"
                                value={birthData.date}
                                onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                            <input
                                type="time"
                                id="birthTime"
                                value={birthData.time}
                                onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="birthLocation" className="block text-sm font-medium text-gray-700 mb-1">Birth Location (City, Country)</label>
                            <input
                                type="text"
                                id="birthLocation"
                                value={birthData.location}
                                onChange={handleLocationInputChange}
                                placeholder="e.g., New York, USA"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            {geocoding && <p className="text-sm text-purple-500 mt-1">Geocoding location...</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2">
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                <input
                                    type="number"
                                    id="latitude"
                                    value={birthData.latitude}
                                    onChange={(e) => setBirthData({ ...birthData, latitude: e.target.value })}
                                    placeholder="e.g., 40.7128"
                                    step="0.0001"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    id="longitude"
                                    value={birthData.longitude}
                                    onChange={(e) => setBirthData({ ...birthData, longitude: e.target.value })}
                                    placeholder="e.g., -74.0060"
                                    step="0.0001"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone (e.g., America/New_York)</label>
                                <input
                                    type="text"
                                    id="timezone"
                                    value={birthData.timezone}
                                    onChange={(e) => setBirthData({ ...birthData, timezone: e.target.value })}
                                    placeholder="e.g., America/New_York"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <button
                        onClick={handleGenerateChart}
                        disabled={loading || geocoding}
                        className="mt-6 w-full bg-purple-600 text-white py-3 px-4 rounded-md shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Star className="animate-spin" /> Calculating Chart...
                            </>
                        ) : (
                            <>
                                <Star /> Generate Natal Chart
                            </>
                        )}
                    </button>
                </section>

                {chart && (
                    <section className="mt-12">
                        <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center justify-center gap-3">
                            <BookOpen className="w-8 h-8" /> Your Natal Chart
                        </h2>

                        <div className="bg-purple-50 p-6 rounded-xl shadow-inner mb-8">
                            <h3 className="text-xl font-semibold text-purple-700 mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5" /> Birth Details
                            </h3>
                            <p><strong>Date:</strong> {chart.birthData.date}</p>
                            <p><strong>Time:</strong> {chart.birthData.time}</p>
                            <p><strong>Location:</strong> {chart.birthData.location}</p>
                            <p><strong>Coordinates:</strong> Lat {chart.birthData.latitude}, Lng {chart.birthData.longitude}</p>
                            <p><strong>Timezone:</strong> {chart.birthData.timezone}</p>
                        </div>

                        <div className="flex justify-center mb-8">
                            <ChartWheel positions={chart.positions} ascendant={chart.ascendant} houseCusps={chart.houseCusps} />
                        </div>

                        <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <Sun className="w-6 h-6" /> Planet Positions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {Object.values(chart.positions).map((planet: ProcessedPlanet) => (
                                <div key={planet.name} className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                    <h4 className="font-semibold text-blue-700 text-lg flex items-center gap-2">
                                        {planet.symbol} {planet.name}
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        {planet.sign.symbol} {planet.sign.name} {planet.displayDegree} in House {planet.house}
                                    </p>
                                    <p className="text-xs text-gray-500">Speed: {planet.speed.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6" /> Angular Houses
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-red-700 text-lg flex items-center gap-2">
                                    AC <span className="text-base font-normal">(Ascendant)</span>
                                </h4>
                                <p className="text-sm text-gray-700">
                                    {chart.ascendant.sign.symbol} {chart.ascendant.sign.name} {chart.ascendant.displayDegree}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-blue-700 text-lg flex items-center gap-2">
                                    MC <span className="text-base font-normal">(Midheaven)</span>
                                </h4>
                                <p className="text-sm text-gray-700">
                                    {chart.midheaven.sign.symbol} {chart.midheaven.sign.name} {chart.midheaven.displayDegree}
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <MapPin className="w-6 h-6" /> House Cusps
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {chart.houseCusps.map((cusp) => (
                                <div key={`cusp-${cusp.number}`} className="bg-green-50 p-4 rounded-lg shadow-sm">
                                    <h4 className="font-semibold text-green-700 text-lg">
                                        House {cusp.number}
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Starts in {cusp.sign.symbol} {cusp.sign.name} {cusp.displayDegree}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <BookOpen className="w-6 h-6" /> Interpretations
                        </h3>
                        <div className="space-y-6">
                            {/* Ascendant Interpretation */}
                            {getInterpretation(chart.ascendant, 'ascendant')}

                            {/* Midheaven Interpretation */}
                            {getInterpretation(chart.midheaven, 'midheaven')}

                            {/* Planet Interpretations */}
                            {Object.values(chart.positions).map(planet => getInterpretation(planet, 'planet'))}

                            {/* House Interpretations */}
                            {chart.houseCusps.map(houseCusp => getInterpretation(houseCusp, 'house'))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;