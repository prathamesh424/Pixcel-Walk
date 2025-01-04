"use client";

import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [hasUnread, setHasUnread] = useState<boolean>(true);

  const user = useUser();
  const createOrFindUser = useMutation(api.players.createPlayer);

  useEffect(() => {
    if (user && user.isSignedIn) {
      const { emailAddresses } = user.user;
      const email = emailAddresses[0].emailAddress;
      setUserEmail(email);  

       createOrFindUser({
        player_mail: email,
        x_coordinate: 0,
        y_coordinate: 0,
        present_map_id: "jh79rttce7jzevw4pgqsrk0sn977njtr" as Id<"maps">,
        img_url: "https://example.com/default_avatar.jpg",
      })
        .then(async (response) => {
          console.log("User response data:", response);
          router.push("/dashboard")
        })
        .catch((error) => {
          console.error("Error creating or finding user:", error);
        });
    }
  }, [user, createOrFindUser]);

  const handleNotificationsToggle = () => {
    setNotificationsOpen((prev) => !prev);
    setHasUnread(false);
  };

  return (
    <header className="border-b-2 border-blue flex justify-between items-center py-2 px-6 text-white">
      <h1 className="text-lg text-white">Pixel Walk</h1>
      <div className="flex gap-10 items-center">
        {user.isSignedIn && (
          <div className="relative">
            <button onClick={handleNotificationsToggle} className="relative">
              {hasUnread && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute top-12 right-0 z-50 bg-white shadow-lg w-80 rounded-lg"></div>
            )}
          </div>
        )}
        <div className="inline-block mr-2">
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
