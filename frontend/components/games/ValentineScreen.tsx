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
      // Explode "No" button logic
      setShowExplosion(true);
      // Wait for animation then force Yes
      setTimeout(() => handleYes(), 1500);
    } else {
      setNoCount((prev) => prev + 1);
    }
  };

  const yesScale = 1 + noCount * 0.5; // Grow Yes button

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-[var(--accent)]"
      >
        Will you be my Valentine?
      </motion.h1>

      <div className="flex items-center gap-8">
        <motion.div
           animate={{ scale: yesScale }}
           transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <Button size="lg" onClick={handleYes} className="px-8 py-4 text-2xl">
            Yes! 💖
          </Button>
        </motion.div>

        <AnimatePresence>
          {!showExplosion && (
            <motion.div
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="secondary" 
                onClick={handleNo}
                className="px-6"
              >
                {noCount === 0 ? "No" : noCount === 1 ? "Are you sure?" : "Really? 💔"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showExplosion && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          className="absolute text-6xl"
        >
          💥❤️
        </motion.div>
      )}
    </div>
  );
}
