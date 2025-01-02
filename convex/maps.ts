import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMap = mutation({
  args: {
    map_name: v.string(),
    dimensions: v.object({
      width: v.number(),
      height: v.number(),
    }),
  },
  handler: async ({ db }, { map_name, dimensions }) => {
    return await db.insert("maps", {
        map_name,
        dimensions,
    });
  },
});


export const updateMap = mutation({
    args: {
      map_id: v.id("maps"),
      map_name: v.optional(v.string()),
      dimensions: v.optional(
        v.object({
          width: v.number(),
          height: v.number(),
        })
      ),
    },
    handler: async ({ db }, { map_id, ...fields }) => {
      return await db.patch(map_id, { ...fields });
    },
});


export const deleteMap = mutation({
    args: { map_id: v.id("maps") },
    handler: async ({ db }, { map_id }) => {
      await db.delete(map_id);
    },
 });

 export const getMap = query({
    args: {
      map_name : v.string(),
    },
    handler: async ({ db }, { map_name }) => {
      return await db.query("maps")
            .withIndex("map_name" , q => q.eq("map_name" , map_name)) 
            .first();
    },
  });


export const getMaps = query({
    handler: async ({ db }) => {
      return await db.query("maps").collect();
    },
  });