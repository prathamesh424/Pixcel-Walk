"use client";
 import { Authenticated, Unauthenticated } from "convex/react";
import dynamic from "next/dynamic";

// Dynamically import components for better performance
const Dashboard = dynamic(() => import("./dashboard/page"));
const MapPage = dynamic(() => import("./map/[id]/page"));

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <div className="grid place-content-center h-screen text-2xl text-center">
           <div className="mt-4">
           </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <MapPage />
        <Dashboard />
      </Authenticated>
    </>
  );
}
