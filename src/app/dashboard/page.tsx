"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { MapIcon, Loader2 } from "lucide-react";
import { useSession } from "@clerk/clerk-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Dialog } from "@headlessui/react";

interface Map {
  _id: string;
  _creationTime: number;
  map_name: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { session } = useSession();

  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMap, setHoveredMap] = useState<string | null>(null);
  const [isAddMapOpen, setIsAddMapOpen] = useState(false);
  const [newMap, setNewMap] = useState({ map_name: "", dimensions: { width: 0, height: 0 } });

  const email = session?.user?.emailAddresses[0]?.emailAddress || "";
  const currentPlayer = useQuery(api.players.getPlayerLocation, { player_mail: email });
  const selectMap = useMutation(api.players.updatePlayerMap);
  const mapsData = useQuery(api.maps.getMaps);
  const addMap = useMutation(api.maps.createMap);

  useEffect(() => {
    if (mapsData) {
      setMaps(mapsData);
      setLoading(false);
    }
  }, [mapsData]);

  const handleMapClick = async (map: Map) => {
    if (map) {
      try {
        await selectMap({
          map_id: map._id as Id<"maps">,
          player_mail: email,
        });
      } catch (error) {
        console.error("Error moving player:", error);
      }
      router.push(`/map/${map.map_name}`);
    }
  };

  const handleAddMap = async () => {
    try {
      await addMap(newMap);
      setIsAddMapOpen(false);
      setNewMap({ map_name: "", dimensions: { width: 0, height: 0 } });
    } catch (error) {
      console.error("Error creating new map:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white text-purple-600">
        <div className="flex items-center gap-3 font-pixel">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="animate-pulse">Loading maps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1)_0%,transparent_70%)]" />

      <div className="relative container mx-auto p-6 z-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-pixel mb-4 animate-glow text-purple-600">Maps Dashboard</h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
        </div>

        <div className="flex items-end m-2">
          <b className="text-xl text-border text-purple-500 shadow-lg shadow-purple-300 p-2 rounded-md w-auto h-auto">
            Add Map{" "}
            <Button
              className="text-purple-500 hover:bg-gray-200 bg-white"
              onClick={() => setIsAddMapOpen(true)}
            >
              +
            </Button>
          </b>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {maps.map((map) => (
            <div
              key={map._id}
              className="group relative"
              onMouseEnter={() => setHoveredMap(map._id)}
              onMouseLeave={() => setHoveredMap(null)}
            >
              <div
                className={`absolute inset-0 bg-purple-500/20 rounded-xl blur-xl transition-opacity duration-500 ${
                  hoveredMap === map._id ? "opacity-100" : "opacity-0"
                }`}
              />

              <div
                className="relative bg-white/80 backdrop-blur-sm border border-purple-200 p-6 rounded-xl cursor-pointer 
                          transition-all duration-500 hover:scale-105 hover:bg-white shadow-lg hover:shadow-purple-200"
                onClick={() => handleMapClick(map)}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <MapIcon className="w-8 h-8 text-purple-600" />
                  </div>
                </div>


                <div className="text-center">
                  <h2 className="text-xl font-pixel mb-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                    {map.map_name}
                  </h2>
                  <p className="text-purple-500/60 text-sm">
                    {map.dimensions.width}x{map.dimensions.height}
                  </p>
                </div>

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-purple-200 rounded-tl-xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-purple-200 rounded-br-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isAddMapOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 flex items-center justify-center z-50"
            open={isAddMapOpen}
            onClose={() => setIsAddMapOpen(false)}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 text-purple-600">Add New Map</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddMap();
                }}
              >
                <div className="mb-4">
                  <label className="block mb-1 text-purple-600 font-bold">Map Name</label>
                  <input
                    type="text"
                    value={newMap.map_name}
                    onChange={(e) =>
                      setNewMap((prev) => ({ ...prev, map_name: e.target.value }))
                    }
                    className="w-full p-2 border border-purple-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4 flex gap-4">
                  <div>
                    <label className="block mb-1 text-purple-600 font-bold">Width</label>
                    <input
                      type="number"
                      value={newMap.dimensions.width}
                      onChange={(e) =>
                        setNewMap((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, width: Number(e.target.value) },
                        }))
                      }
                      className="w-full p-2 border border-purple-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-purple-600 font-bold">Height</label>
                    <input
                      type="number"
                      value={newMap.dimensions.height}
                      onChange={(e) =>
                        setNewMap((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, height: Number(e.target.value) },
                        }))
                      }
                      className="w-full p-2 border border-purple-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    className="bg-gray-200 text-purple-600 hover:bg-gray-300"
                    onClick={() => setIsAddMapOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                    Add Map
                  </Button>
                </div>
              </form>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}
