'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/stores/useGameStore';
import { useMusicStore } from '@/stores/useMusicStore';
import { useAuthStore } from '@/stores/useAuthStore';
import SettingsModal from '@/components/SettingsModal';
import { 
  Flower2, 
  Heart, 
  BookOpen, 
  Bot, 
  Grid3X3, 
  Image as ImageIcon,
  Music,
  Settings,
  MessageCircle,
  Pause,
  Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const GAMES = [
  { 
    id: 'bouquet', 
    name: '3D Bouquet', 
    description: 'Arrange a digital bouquet of all your favorite flowers.',
    icon: Flower2, 
    color: 'bg-pink-100 text-pink-500', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Bloom Now'
  },
  { 
    id: 'catch-hearts', 
    name: 'Catch Hearts', 
    description: 'Test your reflexes and catch all the love falling from the sky.',
    icon: Heart, 
    color: 'bg-red-100 text-red-500', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Play Arcade'
  },
  { 
    id: 'rpg', 
    name: 'Love Story', 
    description: 'Relive our most precious moments through an interactive timeline.',
    icon: BookOpen, 
    color: 'bg-yellow-100 text-yellow-600', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Open Book'
  },
  { 
    id: 'compliment', 
    name: 'Compliment Bot', 
    description: 'Need a pick-me-up? My digital self has unlimited sweet words.',
    icon: Bot, 
    color: 'bg-blue-100 text-blue-500', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Get Love'
  },
  { 
    id: 'scratch', 
    name: 'Scratch Card', 
    description: 'Reveal a secret date idea or a special digital coupon just for you.',
    icon: Grid3X3, 
    color: 'bg-purple-100 text-purple-500', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Scratch Away'
  },
  { 
    id: 'snake-kiss', 
    name: 'Snake Kiss', 
    description: 'A classic game with a romantic twist. Collect hearts to grow our love.',
    icon: Gamepad2, 
    color: 'bg-emerald-100 text-emerald-500', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Start Playing'
  },
  { 
    id: 'vault', 
    name: 'Media Vault', 
    description: 'All our best photos and voice notes locked in one safe place.',
    icon: ImageIcon, 
    color: 'bg-rose-100 text-rose-500', 
    btnColor: 'bg-[#ff4d6d] hover:bg-[#ff758f]',
    btnText: 'Unlock Vault'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function GameHub() {
  const { progress } = useGameStore();
  const { isPlaying, togglePlay } = useMusicStore();
  const { user, fetchUser } = useAuthStore();
  const [daysLoved, setDaysLoved] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    const startDate = new Date('2025-10-02');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setDaysLoved(diffDays);
  }, [fetchUser]);

  return (
    <div className="min-h-screen bg-[#fff5f5] w-full font-outfit text-gray-800 pb-12">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 md:px-10 md:py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-200 overflow-hidden relative border-2 border-white shadow-sm">
             <img 
                src={user?.profile?.avatarUrl || "/assets/us_avatar.png"} 
                alt="Profile" 
                className="object-cover w-full h-full" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-emoji')?.classList.remove('hidden');
                }} 
             />
             <div className="fallback-emoji absolute inset-0 flex items-center justify-center text-xs hidden">👩‍❤️‍👨</div>
             {!user?.profile?.avatarUrl && <div className="absolute inset-0 flex items-center justify-center text-xs">👩‍❤️‍👨</div>}
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Welcome Home, <span className="text-[#ff4d6d]">{user?.profile?.nickname ? user.profile.nickname.split(' ')[0] : "Babe"}</span></h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Ready for our special day?</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-200 transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Music size={18} />}
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-200 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 mb-12 space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest mx-auto">
            <Heart size={12} fill="currentColor" /> 7 Mini Games Available
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Choose Your Adventure</h2>
          <p className="text-gray-500 text-lg">
            I've put together some of my favorite memories and games just for you. Which one should we visit first?
          </p>
        </motion.div>

        {/* Game Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-16"
        >
          {GAMES.map((game) => {
            const isVault = game.id === 'vault';
            return (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group border border-gray-100 relative overflow-hidden"
              >
                 {/* New badge for first item example or random */}
                 {game.id === 'bouquet' && (
                    <div className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">New</div>
                 )}

                <div className={`w-20 h-20 rounded-full ${game.color} flex items-center justify-center mb-6 text-3xl transition-transform group-hover:scale-110 duration-300`}>
                  <game.icon size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed h-10">
                  {game.description}
                </p>

                <Link href={game.id === 'rpg' ? '/story' : (isVault ? '/vault' : `/play/${game.id}`)} className="w-full">
                  <Button 
                    className={`w-full py-6 rounded-full ${game.btnColor} text-white font-bold text-md shadow-md hover:shadow-lg transition-all transform group-hover:scale-[1.02] border-none`}
                  >
                    {game.btnText}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-4xl bg-pink-50 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center text-center gap-8 mb-10"
        >
          <div className="flex-1">
            <div className="text-3xl font-bold text-red-500 mb-1">{daysLoved}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Days Loved</div>
          </div>
          <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-red-500 mb-1">1,420</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Photos Saved</div>
          </div>
           <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-red-500 mb-1">∞</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Memories to Go</div>
          </div>
        </motion.div>

      </main>

      {/* Floating Action Button / Chat */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className="fixed bottom-8 right-8 w-14 h-14 bg-[#ff4d6d] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-[#ff758f] transition-colors"
      >
        <MessageCircle size={24} />
      </motion.button>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
