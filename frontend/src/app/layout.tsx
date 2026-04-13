import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { GameProvider } from "@/context/GameContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScamShield — Learn to Spot Scams Safely",
  description: "An interactive educational app that teaches you how to identify online scams through realistic scenarios and AI-powered explanations.",
  keywords: ["scam detection", "cybersecurity", "education", "seniors", "online safety"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
