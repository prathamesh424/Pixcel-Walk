"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { MapIcon, Loader2 } from 'lucide-react';
import { useSession } from "@clerk/clerk-react";
import { Id } from "../../../convex/_generated/dataModel";


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

  const email = session?.user?.emailAddresses[0]?.emailAddress || "atharva@gmail.com";
  const currentPlayer = useQuery(api.players.getPlayerLocation, { player_mail: email });

  const selectMap = useMutation(api.players.updatePlayerMap)

  const mapsData = useQuery(api.maps.getMaps);

  useEffect(() => {
    if (mapsData) {
      setMaps(mapsData);
      setLoading(false);
    }
  }, [mapsData]);

  const handleMapClick =  async (map: Map) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-emerald-400">
        <div className="flex items-center gap-3 font-pixel">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="animate-pulse">Loading maps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-emerald-400 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
      
      <div className="relative container mx-auto p-6 z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-pixel mb-4 animate-glow">
            Maps Dashboard
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {maps.map((map) => (
            <div
              key={map._id}
              className="group relative"
              onMouseEnter={() => setHoveredMap(map._id)}
              onMouseLeave={() => setHoveredMap(null)}
            >
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-emerald-500/20 rounded-xl blur-xl transition-opacity duration-500 ${
                hoveredMap === map._id ? 'opacity-100' : 'opacity-0'
              }`} />

              {/* Card */}
              <div
                className="relative bg-emerald-400/5 backdrop-blur-sm border border-emerald-400/20 p-6 rounded-xl cursor-pointer 
                          transition-all duration-500 hover:scale-105 hover:bg-emerald-400/10"
                onClick={() => handleMapClick(map)}
              >
                {/* Map Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-emerald-400/10 group-hover:bg-emerald-400/20 transition-colors">
                    <MapIcon className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>

                {/* Map Details */}
                <div className="text-center">
                  <h2 className="text-xl font-pixel mb-2 group-hover:text-emerald-300 transition-colors">
                    {map.map_name}
                  </h2>
                  <p className="text-emerald-400/60 text-sm">
                    {map.dimensions.width}x{map.dimensions.height}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-emerald-400/20 rounded-tl-xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-emerald-400/20 rounded-br-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

