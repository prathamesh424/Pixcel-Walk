import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const sendMessage  = mutation({
    args: {
        sender: v.id("players"),
        receiver: v.id("players"),
        message: v.string()
    },

    handler: async ({ db }, { sender, receiver, message }) => {
         const existingChat = await db.query("chat")
            .withIndex("sender_receiver", (q) => 
                q.eq("sender", sender).eq("receiver", receiver)
            )
            .first();

        if (existingChat) {
             return await db.patch(existingChat._id, {
                messages: [...existingChat.messages, message]
            });
        }

        return await db.insert("chat", {
            sender,
            receiver,
            messages: [message]
        });
    },
})


export const getChat = query({
    args:{
        sender: v.id("players"),
        receiver: v.id("players"),
    },
    handler: async ({ db }, { sender, receiver }) => {
        const chat = await db.query("chat").withIndex("sender_receiver", (q) => q.eq("sender", sender).eq("receiver", receiver)).first();
        if (!chat) {
            return [];
        }

        return chat?.messages || [];
    },
})

export const getAllChats = query({
    args: {
        sender: v.id("players"),
    },
    handler: async ({ db }, { sender }) => {
        return db.query("chat").filter((q) => q.eq(q.field("sender"), sender)).collect();
    }
})
