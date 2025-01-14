import { useState, useEffect } from 'react';
import { Id } from '../../convex/_generated/dataModel';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X } from 'lucide-react';

interface ChatWindowProps {
  sender: Id<"players">;
  receiver: Id<"players">;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sender, receiver, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  
  const chatMessages = useQuery(api.chat.getChat, { sender, receiver });
  const sendMessage = useMutation(api.chat.sendMessage);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({ sender, receiver, message });
      setMessages(prev => ({ ...prev, [receiver]: '' }));
      setMessage('');  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg flex flex-col h-80">
      <div className="p-3 border-b border-purple-100 flex justify-between items-center">
        <span className="font-pixel text-purple-600">{receiver}</span>
        <button onClick={onClose} className="text-purple-600 hover:text-purple-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        {chatMessages?.map((msg: any, idx: number) => (
            //${msg.sender === sender ? 'bg-purple-100 ml-auto' : 'bg-gray-100'}
          <div key={idx} className={`mb-2 p-2 rounded-lg  text-black max-w-[80%]`}>
            {msg}
          </div>
        )) || <div>No messages yet.</div>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 border-t border-purple-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-400"
            placeholder="Type a message..."
          />
          <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
