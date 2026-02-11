'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const COMPLIMENTS = [
  "Your smile lights up my whole world 🌍",
  "You make every day an adventure 🚀",
  "I love how kind you are to everyone 💖",
  "You possess the most beautiful mind 🧠",
  "My heart beats faster whenever you're near 💓",
  "You are my favorite person in the universe ✨",
  "I love your laugh! 😂",
  "You are simply perfect to me 🌹",
];

export default function ComplimentGenerator() {
  const [index, setIndex] = useState<number | null>(null);

  const generate = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * COMPLIMENTS.length);
    } while (newIndex === index);
    setIndex(newIndex);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-50 p-4 space-y-12">
      <h2 className="text-3xl font-bold text-[var(--accent)] text-center">
        What I Love About You
      </h2>

      <div className="h-40 flex items-center justify-center w-full max-w-xl">
        <AnimatePresence mode='wait'>
          {index !== null ? (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0, rotate: 5 }}
              className="text-2xl md:text-4xl font-handwriting text-center text-gray-800 p-8 bg-white shadow-xl rounded-xl -rotate-2"
            >
              "{COMPLIMENTS[index]}"
            </motion.div>
          ) : (
             <div className="text-gray-400 italic">Click the button below...</div>
          )}
        </AnimatePresence>
      </div>

      <Button size="lg" onClick={generate} className="text-xl px-12 py-6 shadow-lg animate-bounce">
        Tell me! 👇
      </Button>
    </div>
  );
}
