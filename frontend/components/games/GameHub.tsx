'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/stores/useGameStore';

const GAMES = [
  { id: 'bouquet', name: '3D Bouquet 💐', color: 'bg-pink-400' },
  { id: 'catch-hearts', name: 'Catch Hearts 🎮', color: 'bg-red-400' },
  { id: 'scratch', name: 'Scratch Card 🎫', color: 'bg-indigo-400' },
  { id: 'rpg', name: 'Love Story 📖', color: 'bg-purple-400' },
  { id: 'compliment', name: 'Compliment Bot 🤖', color: 'bg-yellow-400' },
];

export default function GameHub() {
  const { progress } = useGameStore();

  return (
    <div className="w-full max-w-4xl p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-[var(--accent)]">The ValenVerse Hub</h1>
        <p className="text-lg text-gray-600">Choose an activity to unlock more love!</p>
        <div className="text-sm font-medium text-pink-500">
          Score: {progress?.quizScore || 0} Points
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES.map((game, index) => (
          <Link key={game.id} href={`/play/${game.id}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${game.color} text-white p-8 rounded-2xl shadow-lg cursor-pointer flex items-center justify-center min-h-[150px] text-center font-bold text-xl relative overflow-hidden group`}
            >
              <div className="z-10 relative">{game.name}</div>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/vault">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-bold shadow-xl"
          >
             Open Media Vault 🔐
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
