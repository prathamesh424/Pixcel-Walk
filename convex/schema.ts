import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    maps: defineTable({
      map_name: v.string(),
      dimensions: v.object({
        width: v.number(),
        height: v.number(),
      }),
    }).index("map_name", ["map_name"]),
  
    players: defineTable({
      player_mail: v.string(),
      x_coordinate: v.number(),
      y_coordinate: v.number(),
      present_map_id: v.optional(v.id("maps")),
      img_url: v.string(),
    }).index("player_mail", ["player_mail"]) 
    .index("present_map_id" , ["present_map_id"]) ,

    chat: defineTable({
      sender: v.id("players"),
      receiver: v.id("players"),
      messages: v.array(v.string()),
    }).index("sender_receiver", ["sender" , "receiver"]),
  });
 