/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useMemo } from 'react';
import { Id } from '../../convex/_generated/dataModel';
import { Loader2, MessageCircle, X, Users } from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ChatWindow from './ChatWindow';

interface ChatInterfaceProps {
  nearbyPlayers: any[];
  currentPlayer: any;
}

export default function ChatInterface({ nearbyPlayers, currentPlayer }: ChatInterfaceProps) {
  const [activeChats, setActiveChats] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const chatQueries = useMemo(() => {
    return Array.from(activeChats).map(playerId => ({
      sender: currentPlayer.player_Id as Id<"players">,
      receiver: playerId as Id<"players">
    }));
  }, [activeChats, currentPlayer.player_Id]);

  const allChats = useQuery(api.chat.getAllChats, { 
    sender: currentPlayer.player_Id as Id<"players">,
  });

  const sendMessage = useMutation(api.chat.sendMessage);

  if (!nearbyPlayers || nearbyPlayers.length === 0) {
    return (
      <div className="fixed left-6 top-32 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100">
        <p className="text-purple-600 font-pixel">No players nearby</p>
      </div>
    );
  }

  const handleSendMessage = async (playerId: string, message: string) => {
    if (!message.trim() || !currentPlayer) return;

    try {
      await sendMessage({
        sender: currentPlayer.player_Id,
        receiver: playerId as Id<"players">,
        message: message,
      });
      setMessages(prev => ({...prev, [playerId]: ''}));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const toggleChat = (playerId: string) => {
    setActiveChats(prev => {
      const newSet = new Set<string>();
      newSet.add(playerId);
      return newSet;
    });
  };

  return (
    <div className="fixed left-6 top-32 w-80 flex flex-col gap-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-pixel text-purple-600">Nearby Players</h3>
        </div>
        <div className="flex flex-col gap-2">
          {nearbyPlayers.map((player) => (
            <button
              key={player._id}
              onClick={() => toggleChat(player._id)}
              className={`w-full p-2 rounded-lg text-left transition-colors ${
                activeChats.has(player._id)
                  ? 'bg-purple-200 text-purple-700'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-600'
              }`}
            >
              {player.player_mail}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Array.from(activeChats).map((playerId) => (
          <ChatWindow
            key={playerId}
            sender={currentPlayer.player_Id as Id<"players">}
            receiver={playerId as Id<"players">}
            onClose={() => toggleChat(playerId)}
          />
        ))}
      </div>
    </div>
  );
} 