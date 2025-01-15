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

        const timestamp = Date.now();

        if (existingChat) {
             return await db.patch(existingChat._id, {
                messages: [...existingChat.messages, { sender, receiver, message, timestamp }]
            });
        }
        
        const anotherChat = await db.query("chat").
            withIndex("sender_receiver", (q) => 
                q.eq("sender", receiver).eq("receiver", sender)
            ).
            first();

        if (anotherChat) {
            return await db.patch(anotherChat._id, {
                messages: [...anotherChat.messages, { sender, receiver, message, timestamp }]
            });
        }

        return await db.insert("chat", {
            sender,
            receiver,
            messages: [{ sender, receiver, message, timestamp }]
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
        if (chat) {
            return chat.messages.map(msg => ({
                sender: msg.sender,
                receiver: msg.receiver,
                message: msg.message,
                timestamp: msg.timestamp
            }))
        }

        const anotherChat = await db.query("chat").withIndex("sender_receiver", (q) => q.eq("sender", receiver).eq("receiver", sender)).first();
        if (anotherChat) {
            return anotherChat.messages.map(msg => ({
                sender: msg.sender,
                receiver: msg.receiver,
                message: msg.message,
                timestamp: msg.timestamp
            }))
        }
        return [];
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
