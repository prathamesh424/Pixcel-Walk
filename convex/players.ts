import { v } from 'convex/values';
import { mutation, query } from './_generated/server';


export const createPlayer = mutation({
    args: {
      player_mail: v.string(),
      x_coordinate: v.number(),
      y_coordinate: v.number(),
      present_map_id: v.id("maps"),
      img_url: v.string(),
    },
    handler: async (
      { db },
      { player_mail, x_coordinate, y_coordinate, present_map_id, img_url }
    ) => {
      return await db.insert("players", {
        player_mail,
        x_coordinate,
        y_coordinate,
        present_map_id,
        img_url,
      });
    },
  });



  export const updatePlayer = mutation({
    args: {
      player_id: v.id("players"),
      x_coordinate: v.optional(v.number()),
      y_coordinate: v.optional(v.number()),
      present_map_id: v.optional(v.id("maps")),
      img_url: v.optional(v.string()),
    },
    handler: async ({ db }, { player_id, ...fields }) => {
      return await db.patch(player_id, { ...fields });
    },
  });
  
  

  export const deletePlayer = mutation({
    args: { player_id: v.id("players") },
    handler: async ({ db }, { player_id }) => {
      await db.delete(player_id);
    },
  });
  


  export const getPlayerLocation = query({
    args: {
      player_mail: v.string(),
    },
    handler: async ({ db }, { player_mail }) => {
      const player = await db.query("players")
                .withIndex("player_mail" , q => q.eq("player_mail" , player_mail))
                .first();
      if (!player) {
        throw new Error("Player not found");
      }
      return {
        x_coordinate: player.x_coordinate,
        y_coordinate: player.y_coordinate,
      };
    },
  });

  
  export const movePlayer = mutation({
    args: {
      player_mail: v.string(),
      direction: v.string(), // The direction to move (up, down, left, right)
    },
    handler: async ({ db }, { player_mail, direction }) => {
      // Fetch the player from the database
      const player = await db.query("players") 
            .withIndex("player_mail" , q => q.eq("player_mail" , player_mail))
            .first();
      
      if (!player) {
        throw new Error("Player not found");
      }
  
      // Get the current x and y coordinates
      let { x_coordinate, y_coordinate } = player;
  
      // Move the player based on the direction
      switch (direction) {
        case "up":
          if (y_coordinate > 0) y_coordinate -= 1;
          break;
        case "down":
          if (y_coordinate < 9) y_coordinate += 1; // Ensure within 10x10 map range
          break;
        case "left":
          if (x_coordinate > 0) x_coordinate -= 1;
          break;
        case "right":
          if (x_coordinate < 9) x_coordinate += 1; // Ensure within 10x10 map range
          break;
        default:
          throw new Error("Invalid direction. Use 'up', 'down', 'left', or 'right'.");
      }
  
      // Update the player's position in the database
      await db.patch(player._id, {
        x_coordinate,
        y_coordinate,
      });
  
      return {
        x_coordinate,
        y_coordinate,
      };
    },
  });
  
  export const getAllPlayersLocation = query({
    args: {
      map_name: v.string(),  // The name of the map
    },
    handler: async ({ db }, { map_name }) => {
      // Query to find the map by name to get its ID (assuming you have a "maps" collection)
      const map = await db.query("maps")
        .withIndex("map_name", (q) => q.eq("map_name", map_name))
        .first();
  
      if (!map) {
        throw new Error("Map not found");
      }
  
      // Fetch all players that are associated with the map's ID
      const players = await db.query("players")
        .withIndex("present_map_id", (q) => q.eq("present_map_id", map._id))
        .collect();
  
      // Return players' data
      return players.map((player) => ({
        player_id: player._id,
        player_mail: player.player_mail,
        x_coordinate: player.x_coordinate,
        y_coordinate: player.y_coordinate,
        img_url: player.img_url,
      }));
    },
  });
