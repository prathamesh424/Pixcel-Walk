// layout.tsx
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Header } from "./Header";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixel Walk",
  description: "Embark on a journey with personalized characters in a fun-filled world!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="https://zany.sh/favicon.svg?emoji=📋"></link>
      </head>
      <body className={inter.className}>
        <LanguageProvider> {/* Wrap the app with LanguageProvider */}
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-purple-50">
            <ConvexClientProvider>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Toaster />
            </ConvexClientProvider>
            <footer className="py-6 text-center border-t border-purple-100 bg-white/80 backdrop-blur-sm">
              <p className="text-sm text-purple-600">
               
              </p>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
