"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // This is the hook to access route params
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "@clerk/clerk-react";

interface Map {
  map_name: string;
  dimensions: { width: number; height: number };
}

interface Player {
  player_id: string;
  player_mail: string;
  x_coordinate: number;
  y_coordinate: number;
}

export default function MapPage() {
   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { session } = useSession();
  const email = session?.user?.emailAddresses[0]?.emailAddress || "";

  const movePlayer = useMutation(api.players.movePlayer);
  const map = useQuery(api.maps.getMap, { map_name: "" });
  const players = useQuery(api.players.getAllPlayersLocation, { map_name: "lala" });

  const { id: mapId } = useParams(); // Get the dynamic route parameter (mapId)
     

  const handlePlayerMove = async (direction: string) => {
    if (!selectedPlayer || !email) return;

    let newX = selectedPlayer.x_coordinate;
    let newY = selectedPlayer.y_coordinate;

    switch (direction) {
      case "right":
        newX = selectedPlayer.x_coordinate + 1;
        break;
      case "left":
        newX = selectedPlayer.x_coordinate - 1;
        break;
      case "down":
        newY = selectedPlayer.y_coordinate + 1;
        break;
      case "up":
        newY = selectedPlayer.y_coordinate - 1;
        break;
      default:
        break;
    }

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
      <div className="min-h-screen flex justify-center items-center bg-gray-800 text-white">
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">{map.map_name}</h1>
        <div
          className="relative bg-gray-700 rounded-lg"
          style={{
            width: `${map.dimensions.width}px`,
            height: `${map.dimensions.height}px`,
          }}
        >
          {players.map((player) => (
            <div
              key={player.player_id}
              className="absolute bg-blue-500 p-2 rounded-full cursor-pointer"
              style={{
                left: `${player.x_coordinate}px`,
                top: `${player.y_coordinate}px`,
              }}
              onClick={() => setSelectedPlayer(player)}
            >
              {player.player_mail}
            </div>
          ))}
        </div>

        {selectedPlayer && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Move Player</h3>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() => handlePlayerMove("right")}
              >
                Move Right
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() => handlePlayerMove("left")}
              >
                Move Left
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() => handlePlayerMove("down")}
              >
                Move Down
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() => handlePlayerMove("up")}
              >
                Move Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
