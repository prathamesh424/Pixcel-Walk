"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "@clerk/clerk-react";

// Define types for the map and player
interface Map {
  map_name: string;
  dimensions: { width: number; height: number };
}

interface Player {
  player_id: string; // This should match the correct field name from your data schema
  player_mail: string;
  x_coordinate: number;
  y_coordinate: number;
}

export default function MapPage() {
  const router = useRouter();
  const { mapId } = router.query; // Extract mapId from the URL query
  const [map, setMap] = useState<Map | null>(null); // Initialize map state
  const [players, setPlayers] = useState<Player[]>([]); // Initialize players state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // Initialize selected player state

  const { session } = useSession();

  const email = session?.user?.emailAddresses[0]?.emailAddress || "";

  const movePlayer = useMutation(api.players.movePlayer);
  const mapData = useQuery(api.maps.getMap, { map_name: mapId as string });
  const playersData  = useQuery(api.players.getPlayerLocation, { player_mail: email });

  useEffect(() => {
    if (mapId) {
      if (mapData) {
        setMap(mapData);
      }
      if (playersData) {
        setPlayers(playersData);
      }
    }
  }, [mapId, mapData, playersData]);

  // Function to move a player on the map
  const handlePlayerMove = async (playerId: string, newX: number, newY: number) => {
    try {
      await movePlayer({ }); // Call API to move player

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.player_id === playerId
            ? { ...player, x_coordinate: newX, y_coordinate: newY }
            : player
        )
      );
    } catch (error) {
      console.error("Error moving player:", error);
    }
  };

  if (!mapData || !playersData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-800 text-white">
        <div>Loading map...</div>
      </div>
    );
  }

  if (!map) {
    return <div>No map found</div>;
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
              key={player.player_id} // Use unique player ID as key
              className="absolute bg-blue-500 p-2 rounded-full cursor-pointer"
              style={{
                left: `${player.x_coordinate}px`,
                top: `${player.y_coordinate}px`,
              }}
              onClick={() => setSelectedPlayer(player)} // Set selected player on click
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
                onClick={() =>
                  handlePlayerMove(
                    selectedPlayer.player_id,
                    selectedPlayer.x_coordinate + 10,
                    selectedPlayer.y_coordinate
                  )
                }
              >
                Move Right
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() =>
                  handlePlayerMove(
                    selectedPlayer.player_id,
                    selectedPlayer.x_coordinate - 10,
                    selectedPlayer.y_coordinate
                  )
                }
              >
                Move Left
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() =>
                  handlePlayerMove(
                    selectedPlayer.player_id,
                    selectedPlayer.x_coordinate,
                    selectedPlayer.y_coordinate + 10
                  )
                }
              >
                Move Down
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={() =>
                  handlePlayerMove(
                    selectedPlayer.player_id,
                    selectedPlayer.x_coordinate,
                    selectedPlayer.y_coordinate - 10
                  )
                }
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
