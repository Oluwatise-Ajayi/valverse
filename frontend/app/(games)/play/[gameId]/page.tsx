'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import AppShell from '@/components/layout/AppShell';
import Link from 'next/link';

// Lazy load game components
const BouquetScene = dynamic(() => import('@/components/games/bouquet/BouquetScene').then(mod => mod.default || (() => <div>Game Not Found</div>)), { 
  ssr: false,
  loading: () => <div className="text-center p-10">Loading 3D Scene...</div>
});

const PhaserGame = dynamic(() => import('@/components/games/phaser/PhaserGame').then(mod => mod.default || (() => <div>Game Not Found</div>)), {
  ssr: false,
  loading: () => <div className="text-center p-10">Loading Game Engine...</div>
});

const ScratchCard = dynamic(() => import('@/components/games/scratch/ScratchCard').then(mod => mod.default || (() => <div>Game Not Found</div>)), {
  ssr: false,
  loading: () => <div className="text-center p-10 font-bold text-[var(--accent)]">Loading Scratch Card...</div>
});

const LoveStoryRPG = dynamic(() => import('@/components/games/rpg/LoveStoryRPG').then(mod => mod.default || (() => <div>Game Not Found</div>)), {
  ssr: false
});

const ComplimentGenerator = dynamic(() => import('@/components/games/compliment/ComplimentGenerator').then(mod => mod.default || (() => <div>Game Not Found</div>)), {
  ssr: false
});

const SnakeGame = dynamic(() => import('@/components/games/snake/SnakeGame').then(mod => mod.default || (() => <div>Game Not Found</div>)), {
  ssr: false,
  loading: () => <div className="text-center p-10 font-bold text-[var(--accent)]">Loading Snake Kiss...</div>
});

const GAMES: Record<string, any> = {
  'bouquet': BouquetScene,
  'catch-hearts': PhaserGame,
  'scratch': ScratchCard,
  'rpg': LoveStoryRPG,
  'compliment': ComplimentGenerator,
  'snake-kiss': SnakeGame,
};

export default function GamePage() {
  const { gameId } = useParams();
  const GameComponent = GAMES[gameId as string];

  return (
    <AppShell>
      <div className="w-full h-screen flex flex-col">
        <div className="p-4 flex justify-between bg-white shadow-sm z-10 relative">
          <Link href="/hub" className="font-bold text-[var(--accent)]">
            ← Exit Game
          </Link>
          <div className="font-bold uppercase tracking-wider">
            {gameId}
          </div>
        </div>

        <div className="flex-1 relative bg-gray-50 overflow-hidden">
          {GameComponent ? (
            <GameComponent />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Game module not found or under construction. 🚧
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
