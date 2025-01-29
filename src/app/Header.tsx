// Header.tsx
"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MapIcon, HomeIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function Header() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage(); // Access language state from context

  const handleLanguageChange = (event: { target: { value: any; }; }) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    // You can add your translation logic here
    console.log("Selected Language:", language);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-pixel text-purple-600 transition-colors hover:text-purple-700"
          >
            <MapIcon className="h-6 w-6" />
            <span className="hidden sm:inline-block">Pixel Walk</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
            >
              <MapIcon className="h-4 w-4" />
              Maps
            </Link>
          </nav>
        </div>

        {/* Language Dropdown */}
        <div className="flex items-center gap-4">
          <select 
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm text-purple-600 shadow-sm transition focus:border-purple-400 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>

          {/* Auth Buttons */}
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full border-2 border-purple-200",
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
