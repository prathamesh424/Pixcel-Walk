"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Directly use useRouter
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

// Define the interface for Map
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
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
 // Directly use useRouter here

  // Get data from Convex (mapsData can be undefined)
  const mapsData = useQuery(api.maps.getMaps);

  useEffect(() => {
    if (mapsData) {
      setMaps(mapsData);
      setLoading(false);
    }
  }, [mapsData]);

  const handleMapClick = (mapId: string) => {
    if (mapId)  {
      router.push(`/map/${mapId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-800 text-white">
        <div className="text-xl">Loading maps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Maps Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {maps.map((map) => (
            <div
              key={map._id}
              className="bg-gray-700 p-6 rounded-lg cursor-pointer hover:bg-gray-600"
              onClick={() => handleMapClick(map.map_name)}
            >
              <h2 className="text-2xl">{map.map_name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
