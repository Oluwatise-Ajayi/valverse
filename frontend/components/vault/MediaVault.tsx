'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/lib/api';
import Link from 'next/link';

export default function MediaVault() {
  const { progress } = useGameStore();
  const { user } = useAuthStore();
  const [medias, setMedias] = useState<any[]>([]);

  // Mock list of all potential media to show locks
  // In real app, this might come from an API 'config' endpoint
  const ALL_MEDIA_SLOTS = [
    { id: '1', title: 'First Date', type: 'IMAGE' },
    { id: '2', title: 'Funny Video', type: 'VIDEO' },
    { id: '3', title: 'Love Letter', type: 'TEXT' },
    { id: '4', title: 'Secret Song', type: 'AUDIO' },
  ];

  return (
    <div className="w-full max-w-5xl p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--accent)]">Our Memories 📸</h1>
        <Link href="/hub" className="text-gray-500 hover:text-[var(--primary)]">
          ← Back to Hub
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {ALL_MEDIA_SLOTS.map((item) => {
          const isUnlocked = progress?.unlockedMedia?.some((u) => u.mediaId === item.id);
          
          return (
            <motion.div
              key={item.id}
              className={`aspect-square rounded-xl flex items-center justify-center p-4 text-center shadow-md transition-colors ${
                isUnlocked ? 'bg-white' : 'bg-gray-200'
              }`}
            >
              {isUnlocked ? (
                <div className="space-y-2">
                  <div className="text-4xl">
                    {item.type === 'IMAGE' ? '🖼️' : item.type === 'VIDEO' ? '🎥' : item.type === 'AUDIO' ? '🎵' : '💌'}
                  </div>
                  <div className="font-bold text-sm">{item.title}</div>
                  <button 
                    onClick={() => alert(`Opening ${item.title}...`)}
                    className="text-xs text-[var(--primary)] underline"
                  >
                    View
                  </button>
                </div>
              ) : (
                <div className="text-gray-400">
                  <div className="text-4xl mb-2">🔒</div>
                  <div className="text-xs">Locked</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
