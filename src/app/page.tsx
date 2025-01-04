"use client";

import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Loader2, MapPin } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUser();
  const createOrFindUser = useMutation(api.players.createPlayer);

  const imageLinks = Array.from({ length: 28 }, (_, index) =>
    `https://raw.githubusercontent.com/prathamesh424/Realtime-game/main/output_cropped_images/box_${index + 1}.png`
  );

  useEffect(() => {
    if (user && user.isSignedIn) {
      const { emailAddresses } = user.user;
      const email = emailAddresses[0].emailAddress;
      setUserEmail(email);

      if (selectedCharacter) {
        setLoading(true);
        createOrFindUser({
          player_mail: email,
          x_coordinate: 0,
          y_coordinate: 0,
          present_map_id: "jh79rttce7jzevw4pgqsrk0sn977njtr" as Id<"maps">,
          img_url: selectedCharacter,
        })
          .then(() => {
            router.push("/dashboard");
          })
          .catch((error) => {
            console.error("Error creating or finding user:", error);
            setLoading(false);
          });
      }
    }
  }, [user, selectedCharacter, createOrFindUser, router]);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1)_0%,transparent_70%)]" />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl font-pixel text-purple-600 animate-glow mb-4">
            Pixel Walk
          </h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            Embark on a journey with personalized characters in a fun-filled world!
          </p>
        </div>

        {!selectedCharacter ? (
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-2 text-lg text-purple-600">
              <MapPin className="w-5 h-5" />
              <h2 className="font-medium">Select Your Character</h2>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-xl">
              {imageLinks.map((link, index) => (
                <div
                  key={index}
                  className={`group relative aspect-square transition-transform duration-200 ${
                    selectedCharacter === link ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                  <button
                    onClick={() => setSelectedCharacter(link)}
                    className={`relative w-full h-full rounded-xl overflow-hidden transition-all duration-200 ${
                      selectedCharacter === link
                        ? 'ring-4 ring-purple-500 ring-offset-2'
                        : 'ring-1 ring-purple-100 hover:ring-purple-300'
                    }`}
                  >
                    <img
                      src={link}
                      alt={`Character ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {user.isSignedIn ? (
              <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-xl">
                <div className="flex flex-col items-center gap-6">
                  <img
                    src={selectedCharacter}
                    alt="Selected character"
                    className="w-24 h-24 rounded-xl ring-4 ring-purple-500 ring-offset-2"
                  />
                  <h2 className="text-2xl font-pixel text-purple-600">
                    Welcome, {user.user.firstName}!
                  </h2>
                  <button
                    onClick={() => router.push("/dashboard")}
                    disabled={loading}
                    className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium
                             hover:bg-purple-700 transition-colors disabled:opacity-50
                             disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Setting Up...
                      </>
                    ) : (
                      'Enter the World'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <Unauthenticated>
                <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-xl">
                  <div className="flex flex-col items-center gap-6">
                    <img
                      src={selectedCharacter}
                      alt="Selected character"
                      className="w-24 h-24 rounded-xl ring-4 ring-purple-500 ring-offset-2"
                    />
                    <p className="text-lg text-purple-600">Sign in to continue your journey</p>
                    <SignInButton mode="modal">
                      <button className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </Unauthenticated>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
