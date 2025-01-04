"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "@clerk/clerk-react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Loader2, MapPin } from 'lucide-react';

interface Map {
  map_name: string;
  dimensions: { width: number; height: number };
}

interface Player {
  player_id: string;
  player_mail: string;
  x_coordinate: number;
  y_coordinate: number;
  img_url?: string;
}

export default function MapPage() {
  const { session } = useSession();
  const params = useParams();
  const mapId = params.id;
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  // Calculate map size based on screen dimensions
  useEffect(() => {
    const calculateMapSize = () => {
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      const maxSize = Math.min(screenHeight - 100, screenWidth - 400); // Account for margins and controls
      setMapSize({ width: maxSize, height: maxSize });
    };

    calculateMapSize();
    window.addEventListener('resize', calculateMapSize);
    return () => window.removeEventListener('resize', calculateMapSize);
  }, []);

  const map = useQuery(api.maps.getMap, { map_name: mapId as string });
  const email = session?.user?.emailAddresses[0]?.emailAddress || "";
  const currentPlayer = useQuery(api.players.getPlayerLocation, { player_mail: email });
  const movePlayer = useMutation(api.players.movePlayer);
  const players = useQuery(api.players.getAllPlayersLocation, { map_name: mapId as string });

  if (!email) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-purple-600 text-xl font-pixel animate-pulse">Please log in to play.</div>
      </div>
    );
  }

  const handlePlayerMove = async (direction: string) => {
    if (!currentPlayer || !email) return;
    try {
      await movePlayer({
        player_mail: email,
        direction,
      });
    } catch (error) {
      console.error("Error moving player:", error);
    }
  };

  if (!map || !players) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <div className="flex items-center gap-3 text-purple-600 font-pixel">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="animate-pulse">Loading map...</span>
        </div>
      </div>
    );
  }

  const { width, height } = map.dimensions;
  const blockSize = Math.floor(Math.min(mapSize.width / width, mapSize.height / height));

  return (
    <div className="h-screen flex items-center justify-center bg-white p-6 md:10">
      {/* Map Name */}
      <div className="absolute top-20 left-6 flex items-center gap-2 text-purple-600">
        <MapPin className="w-5 h-5" />
        <h1 className="text-lg font-pixel">{map.map_name}</h1>
      </div>

      {/* Game Area */}
      <div 
        className="relative bg-green-500/20 rounded-lg shadow-inner"
        style={{
          width: blockSize * width,
          height: blockSize * height,
        }}
      >
        {/* Players */}
        {players.map((player) => {
          // Calculate position ensuring players stay within bounds
          const xPos = Math.max(blockSize/2, Math.min((blockSize * player.x_coordinate), (blockSize * width) - blockSize/2));
          const yPos = Math.max(blockSize/2, Math.min((blockSize * player.y_coordinate), (blockSize * height) - blockSize/2));
          
          return (
            <div
              key={player.player_id}
              className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: xPos,
                top: yPos,
                width: blockSize * 0.8, // Slightly smaller than block size
                height: blockSize * 0.8,
              }}
            >
              <div className="w-full h-full animate-float">
                <img
                  src={player.img_url || "/default-avatar.png"}
                  alt={player.player_mail}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Controls */}
      {currentPlayer && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2">
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-start-2">
                <button
                  className="w-12 h-12 flex items-center justify-center bg-purple-100 hover:bg-purple-200 
                           rounded-xl border border-purple-200 shadow-sm transition-all duration-200 
                           active:scale-95 group"
                  onClick={() => handlePlayerMove("up")}
                >
                  <ArrowUp className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </button>
              </div>
              <div className="col-start-1 row-start-2">
                <button
                  className="w-12 h-12 flex items-center justify-center bg-purple-100 hover:bg-purple-200 
                           rounded-xl border border-purple-200 shadow-sm transition-all duration-200 
                           active:scale-95 group"
                  onClick={() => handlePlayerMove("left")}
                >
                  <ArrowLeft className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </button>
              </div>
              <div className="col-start-3 row-start-2">
                <button
                  className="w-12 h-12 flex items-center justify-center bg-purple-100 hover:bg-purple-200 
                           rounded-xl border border-purple-200 shadow-sm transition-all duration-200 
                           active:scale-95 group"
                  onClick={() => handlePlayerMove("right")}
                >
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </button>
              </div>
              <div className="col-start-2 row-start-3">
                <button
                  className="w-12 h-12 flex items-center justify-center bg-purple-100 hover:bg-purple-200 
                           rounded-xl border border-purple-200 shadow-sm transition-all duration-200 
                           active:scale-95 group"
                  onClick={() => handlePlayerMove("down")}
                >
                  <ArrowDown className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

