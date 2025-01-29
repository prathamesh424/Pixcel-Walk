import { useState, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/lib/LanguageContext";

interface ChatWindowProps {
  sender: Id<"players">;
  receiver: Id<"players">;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  sender,
  receiver,
  onClose,
}) => {
  const [message, setMessage] = useState("");
  const [translatedMessages, setTranslatedMessages] = useState<Record<number, string>>({});
  const { selectedLanguage } = useLanguage(); 
  const chatMessages = useQuery(api.chat.getChat, { sender, receiver });
  const sendMessage = useMutation(api.chat.sendMessage);
  const receiverEmail = useQuery(api.players.getEmailByPlayerId, { player_id: receiver });

  // Function to handle message translation
  const translateMessage = async (text: string, idx: number) => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, targetLanguage: selectedLanguage }),
      });

      const data = await response.json();
      setTranslatedMessages((prev) => ({ ...prev, [idx]: data.translatedText }));
    } catch (error) {
      console.error("Error translating message:", error);
    }
  };

  // Send message function
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({ sender, receiver, message });
      setMessage(""); // Clear message input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // When the selected language changes, trigger translations for all existing messages
    if (chatMessages?.length) {
      chatMessages.forEach((msg, idx) => {
        if (selectedLanguage !== "en" && !translatedMessages[idx]) {
          translateMessage(msg.message, idx);
        }
      });
    }
  }, [selectedLanguage, chatMessages]);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg flex flex-col h-80">
      <div className="p-3 border-b border-purple-100 flex justify-between items-center">
        <span className="font-pixel text-purple-600">{receiverEmail}</span>
        <button onClick={onClose} className="text-purple-600 hover:text-purple-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        {chatMessages?.map((msg: any, idx: number) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg text-black max-w-[80%] ${msg.sender === sender ? "bg-purple-100 ml-auto" : "bg-gray-100"}`}
          >
            <div>{translatedMessages[idx] || msg.message}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(msg.timestamp), "HH:mm:ss")}
            </div>
          </div>
        )) || <div>No messages yet.</div>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-purple-100"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-400"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
