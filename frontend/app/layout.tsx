import type { Metadata } from "next";
import { Great_Vibes, Outfit } from "next/font/google"; // Google Fonts
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import FloatingControls from "@/components/FloatingControls";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ValenVerse",
  description: "A romantic interactive journey",
  manifest: "/manifest.json",

};

export const viewport = {
  themeColor: "#ff4d6d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <MusicPlayer />
        <FloatingControls />
      </body>
    </html>
  );
}
