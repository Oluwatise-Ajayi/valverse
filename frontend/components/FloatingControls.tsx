"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, Music, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuthStore } from "@/stores/useAuthStore";
import SettingsModal from "./SettingsModal";
import Image from "next/image";

export default function FloatingControls() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isPlaying, togglePlay } = useMusicStore();
  const { user, fetchUser, isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (pathname === '/hub') return null;

  return (
    <>
      <div className="fixed bottom-6 right-8 sm:right-10 z-40 flex flex-col gap-4 items-end">
        {/* Music Toggle Button */}
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
            isPlaying 
              ? "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-500/30" 
              : "bg-white/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
          }`}
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Music className="w-6 h-6" />
          )}
        </motion.button>

        {/* Settings/Profile Button */}
        <motion.button
          onClick={() => setIsSettingsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative rounded-full shadow-lg backdrop-blur-sm transition-colors ${
             user?.profile?.avatarUrl 
             ? "p-0 w-12 h-12 overflow-hidden border-2 border-pink-500" 
             : "p-3 bg-white/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
          }`}
          aria-label="Open Settings"
        >
          {user?.profile?.avatarUrl ? (
             <img 
               src={user.profile.avatarUrl} 
               alt="Profile" 
               className="w-full h-full object-cover"
             />
          ) : (
            <Settings className={isSettingsOpen ? "w-6 h-6 animate-spin" : "w-6 h-6"} />
          )}
        </motion.button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
