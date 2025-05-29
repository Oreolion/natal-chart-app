// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // users table
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),

  // Table to store user's birth data (input)
  birthData: defineTable({
    userId: v.string(), // To link data to a user (if you implement authentication)
    date: v.string(),
    time: v.string(),
    location: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    timezone: v.string(),
    timestamp: v.number(), // When the data was submitted
  }).index("by_userId", ["userId"]), // Index for efficient lookup by user

  // Table to store the calculated chart results
  natalCharts: defineTable({
    birthDataId: v.id("birthData"), // Link to the birthData entry
    userId: v.string(),
    planets: v.any(), // Store the processed planet data
    ascendant: v.any(), // Store Ascendant data
    midheaven: v.any(), // Store Midheaven data
    houseCusps: v.array(v.any()), // Store house cusps
    calculatedAt: v.number(), // When the chart was calculated
  })
    .index("by_birthDataId", ["birthDataId"])
    .index("by_userId", ["userId"]),
});
