import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAllPlayersLocation } from "./players";

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



export const nearPlayer = query({
  args: {
    player_mail: v.string(),
    map_name: v.string(),
  },
  handler: async ({ db }, { player_mail, map_name }) => {
    const map = await db.query("maps")
      .withIndex("map_name", q => q.eq("map_name", map_name))
      .first();
    if (!map) {
      throw new Error("Map not found");
    }

    const player = await db.query("players")
      .withIndex("player_mail", q => q.eq("player_mail", player_mail))
      .first();
    if (!player) {
      throw new Error("Player not found");
    }

    const playersOnMap = await db.query("players")
      .withIndex("present_map_id", (q) => q.eq("present_map_id", map._id))
      .collect();

    const { x_coordinate, y_coordinate } = player;

    const nearbyPositions = [
      { dx: 0, dy: 0 }, 
      { dx: 1, dy: 0 },  
      { dx: -1, dy: 0 }, 
    ];

    const nearbyPlayers = playersOnMap.filter(otherPlayer => {
      if (otherPlayer._id === player._id) return false;

      return nearbyPositions.some(pos => {
        const targetX = x_coordinate + pos.dx;
        const targetY = y_coordinate + pos.dy;
        return otherPlayer.x_coordinate === targetX && otherPlayer.y_coordinate === targetY;
      });
    });

    return nearbyPlayers.map(player => ({
      _id: player._id,
      player_mail: player.player_mail,
      img_url: player.img_url
    }));
  },
});