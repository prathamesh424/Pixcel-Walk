"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "@clerk/clerk-react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const map = useQuery(api.maps.getMap, { map_name: mapId as string });
  const email = session?.user?.emailAddresses[0]?.emailAddress || "atharva@gmail.com";
  const currentPlayer = useQuery(api.players.getPlayerLocation, { player_mail: email });
  const movePlayer = useMutation(api.players.movePlayer);
  const players = useQuery(api.players.getAllPlayersLocation, { map_name: mapId as string });

  if (!email) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-emerald-400 text-xl font-pixel animate-pulse">Please log in to play.</div>
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
      <div className="h-screen flex justify-center items-center bg-black text-emerald-400">
        <div className="animate-pulse text-2xl font-pixel">Loading map...</div>
      </div>
    );
  }

  const { width, height } = map.dimensions;

  return (
    <div className="h-screen flex flex-col bg-black text-emerald-400 overflow-hidden">
      {/* Header */}
      <div className="flex-none p-4 bg-black/50 backdrop-blur-sm border-b border-emerald-900/50">
        <h1 className="text-3xl font-pixel text-center text-emerald-400 animate-glow">
          {map.map_name}
        </h1>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {players.map((player) => (
                <div
                  key={player.player_id}
                  className="absolute transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${((player.x_coordinate + 0.5) / width) * 100}%`,
                    top: `${((player.y_coordinate + 0.5) / height) * 100}%`,
                    width: '80px',
                    height: '80px',
                  }}
                >
                  <div className="w-full h-full overflow-hidden animate-float">
                    <img
                      src={player.img_url || "/default-avatar.png"}
                      alt={player.player_mail}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Player Glow Effect */}
                  <div className="absolute inset-0 -z-10 animate-pulse-slow">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl transform scale-150" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {currentPlayer && (
        <div className="flex-none p-8 bg-black/30 backdrop-blur-md border-t border-emerald-900/50">
          <div className="max-w-xs mx-auto">
            <div className="grid grid-cols-3 gap-4 justify-items-center">
              <div className="col-start-2">
                <button
                  className="p-4 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-xl backdrop-blur-lg border border-emerald-400/20 shadow-lg transition-all duration-200 active:scale-95 group"
                  onClick={() => handlePlayerMove("up")}
                >
                  <ArrowUp className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </button>
              </div>
              <div className="col-start-1 row-start-2">
                <button
                  className="p-4 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-xl backdrop-blur-lg border border-emerald-400/20 shadow-lg transition-all duration-200 active:scale-95 group"
                  onClick={() => handlePlayerMove("left")}
                >
                  <ArrowLeft className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </button>
              </div>
              <div className="col-start-3 row-start-2">
                <button
                  className="p-4 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-xl backdrop-blur-lg border border-emerald-400/20 shadow-lg transition-all duration-200 active:scale-95 group"
                  onClick={() => handlePlayerMove("right")}
                >
                  <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </button>
              </div>
              <div className="col-start-2 row-start-3">
                <button
                  className="p-4 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-xl backdrop-blur-lg border border-emerald-400/20 shadow-lg transition-all duration-200 active:scale-95 group"
                  onClick={() => handlePlayerMove("down")}
                >
                  <ArrowDown className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

