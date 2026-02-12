'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ValentineScreen() {
  const router = useRouter();
  const { updateValentine } = useGameStore();
  const { isAuthenticated } = useAuthStore();
  const [noCount, setNoCount] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);

  const handleYes = async () => {
    if (isAuthenticated) {
      await updateValentine(true);
    }
    router.push('/gateway'); // Go to Quiz
  };

  const handleNo = () => {
    if (noCount >= 2) {
      setShowExplosion(true);
      setTimeout(() => handleYes(), 1500);
    } else {
      setNoCount((prev) => prev + 1);
    }
  };

  const yesScale = 1 + noCount * 0.2;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 font-outfit">
      
      {/* Floating Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 text-4xl opacity-50"
        >
          💌
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 text-4xl opacity-50"
        >
          💖
        </motion.div>
        {/* Add more decorative elements as needed */}
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 flex flex-col items-center space-y-8 max-w-lg w-full"
      >
        {/* Image Container */}
        <div className="relative mb-6">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 flex items-center justify-center bg-pink-100">
             <img 
               src="/assets/flowers.png" 
               alt="Valentine Roses" 
               className="w-full h-full object-cover"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.parentElement!.innerText = '🌹';
                 e.currentTarget.parentElement!.style.fontSize = '4rem'; 
               }}
             />
          </div>
          <div className="absolute inset-0 rounded-full bg-pink-500 blur-3xl opacity-30 transform scale-110"></div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <p className="text-sm tracking-[0.2em] text-red-400 font-bold uppercase font-outfit">For My Favorite Person</p>
          <h1 className="text-6xl md:text-8xl font-great-vibes text-red-500 leading-none drop-shadow-sm">
            Would you be my <br/>
            <span className="text-red-600 block mt-2">Valentine?</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-lg max-w-md mx-auto pt-4 font-outfit leading-relaxed">
            Life is so much sweeter with you by my side. Say yes to another year of love and laughter?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-6 pt-8 w-full">
          <motion.div
             animate={{ scale: yesScale }}
             transition={{ type: 'spring', stiffness: 200, damping: 10 }}
             className="w-auto"
          >
            <Button 
              size="lg" 
              onClick={handleYes} 
              className="px-8 py-6 text-xl rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#c9184a] hover:from-[#ff758f] hover:to-[#ff4d6d] shadow-xl border-none text-white transition-all transform hover:scale-105 font-outfit font-bold tracking-wide"
            >
              YES! ❤️
            </Button>
          </motion.div>

          <AnimatePresence>
            {!showExplosion && (
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button 
                  onClick={handleNo}
                  className="text-gray-400 hover:text-gray-600 text-sm bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-sm hover:shadow transition-colors font-outfit whitespace-nowrap"
                >
                  {noCount === 0 ? "No, thanks" : noCount === 1 ? "Are you sure?" : "Really? 💔"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Explosion Animation */}
      {showExplosion && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          className="absolute text-6xl z-50 pointer-events-none"
        >
          💥❤️
        </motion.div>
      )}
    </div>
  );
}
