import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    forms: defineTable({
        createdBy: v.string(),
        description: v.optional(v.string()),
        name: v.optional(v.string()),
        slug: v.string(),
      }).index("by_slug", ["slug"]),
    form_responses: defineTable({
      formId: v.id("forms"),
      slug: v.optional(v.string()),
      values: v.array(
        v.object({ name: v.string(), value: v.string() })
      ),
    }).index("by_formId", ["formId"]),
    form_fields: defineTable({
      formId: v.string(),
      name: v.string(),
      order: v.float64(),
      selectOptions: v.optional(v.array(v.string())),
      type: v.string(),
    }),

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
    }).index("player_mail", ["player_mail"]),
  });
 