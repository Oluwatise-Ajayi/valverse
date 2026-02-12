'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Fallback compliments (20 items)
const FALLBACK_COMPLIMENTS = [
  "Your smile lights up my whole world 🌍",
  "You make every day an adventure 🚀",
  "I love how kind you are to everyone 💖",
  "You possess the most beautiful mind 🧠",
  "My heart beats faster whenever you're near 💓",
  "You are my favorite person in the universe ✨",
  "I love your laugh! 😂",
  "You are simply perfect to me 🌹",
  "You make my world brighter every single day ☀️",
  "Your energy is absolutely contagious 💫",
  "I'm so lucky to have you in my life 🍀",
  "You inspire me to be better every day 🌟",
  "Your hugs are my favorite place to be 🤗",
  "You have the kindest heart I've ever known 💝",
  "Every moment with you is a treasure 💎",
  "You're more beautiful than any sunset 🌅",
  "Your voice is my favorite sound 🎵",
  "You make even ordinary moments magical ✨",
  "I fall for you more every single day 🍂",
  "You are the best thing that ever happened to me 💕"
];

// Animated background elements
const FloatingElement = ({ emoji, delay, duration, startX, startY }: any) => (
  <motion.div
    className="absolute text-4xl opacity-20"
    initial={{ x: startX, y: startY, rotate: 0 }}
    animate={{
      x: startX + Math.random() * 100 - 50,
      y: startY + Math.random() * 100 - 50,
      rotate: 360,
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  >
    {emoji}
  </motion.div>
);

// CSS Robot Component
const RobotBot = () => (
  <div className="relative flex flex-col items-center">
    {/* Robot Body */}
    <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl p-6 shadow-lg border-4 border-gray-300 w-40 h-48">
      {/* Eyes (Hearts) */}
      <div className="flex justify-center gap-4 mb-4 mt-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-4xl"
        >
          ❤️
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          className="text-4xl"
        >
          ❤️
        </motion.div>
      </div>

      {/* Smile */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-8 border-b-4 border-gray-700 rounded-full"></div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-2 mt-4">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
      </div>

      {/* Antenna */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gray-400">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    {/* Arms */}
    <div className="absolute top-20 -left-8 w-8 h-3 bg-gray-300 rounded-full border-2 border-gray-400"></div>
    <div className="absolute top-20 -right-8 w-8 h-3 bg-gray-300 rounded-full border-2 border-gray-400"></div>
  </div>
);

export default function ComplimentGenerator() {
  const [complimentsBatch, setComplimentsBatch] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a batch of 10 compliments
  const fetchCompliments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/compliments/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interest: 'everything about you',
          count: 10,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch compliments');
      }

      const compliments = await response.json();
      
      if (Array.isArray(compliments) && compliments.length > 0) {
        setComplimentsBatch(compliments);
        setCurrentIndex(-1); // Reset index for new batch
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching compliments:', err);
      setError('Oops! Using my built-in memory instead 🤖');
      // Use 20 fallback compliments
      setComplimentsBatch(FALLBACK_COMPLIMENTS);
      setCurrentIndex(-1);
    } finally {
      setLoading(false);
    }
  };

  // Load first batch on mount
  useEffect(() => {
    fetchCompliments();
  }, []);

  const generate = () => {
    if (complimentsBatch.length === 0) {
      fetchCompliments();
      return;
    }

    // Move to next compliment in the batch
    const nextIndex = currentIndex + 1;

    // If we've reached the end of the batch, fetch a new one
    if (nextIndex >= complimentsBatch.length) {
      fetchCompliments();
      return;
    }

    setCurrentIndex(nextIndex);
    setDisplayedIndex(nextIndex);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-yellow-50 p-4 space-y-8 overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingElement emoji="❤️" delay={0} duration={8} startX="10%" startY="10%" />
      <FloatingElement emoji="💖" delay={1} duration={10} startX="80%" startY="20%" />
      <FloatingElement emoji="⚙️" delay={2} duration={12} startX="15%" startY="70%" />
      <FloatingElement emoji="🔩" delay={1.5} duration={9} startX="85%" startY="75%" />
      <FloatingElement emoji="💕" delay={0.5} duration={11} startX="50%" startY="5%" />
      <FloatingElement emoji="🔧" delay={2.5} duration={10} startX="25%" startY="85%" />
      <FloatingElement emoji="💝" delay={1.8} duration={13} startX="70%" startY="60%" />
      <FloatingElement emoji="⚡" delay={0.8} duration={8} startX="90%" startY="40%" />

      <h2 className="text-3xl font-bold text-[var(--accent)] text-center z-10">
        Compliment Bot
      </h2>
      <p className="text-sm text-gray-600 text-center -mt-6 z-10">
        Here words of comfort, but be brave! I have a heart of gold
      </p>

      {/* Robot Character */}
      <div className="z-10">
        <RobotBot />
      </div>

      {/* Compliment Display */}
      <div className="h-32 flex items-center justify-center w-full max-w-xl z-10">
        <AnimatePresence mode='wait'>
          {displayedIndex !== null && complimentsBatch[displayedIndex] ? (
            <motion.div
              key={`${currentIndex}-${complimentsBatch[displayedIndex]}`}
              initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0, rotate: 3 }}
              className="text-xl md:text-2xl font-handwriting text-center text-gray-800 p-6 bg-white shadow-xl rounded-2xl border-2 border-pink-200"
            >
              "{complimentsBatch[displayedIndex]}"
            </motion.div>
          ) : (
             <div className="text-gray-400 italic text-center">
               {loading ? '🤖 Generating compliments...' : 'Click the button below...'}
             </div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="text-pink-600 text-sm text-center bg-pink-100 px-4 py-2 rounded-full z-10">
          {error}
        </div>
      )}

      <Button 
        size="lg" 
        onClick={generate} 
        disabled={loading}
        className="text-lg px-10 py-5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
      >
        {loading ? '🔄 Loading...' : '💌 Get Compliment'}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={fetchCompliments}
        disabled={loading}
        className="text-sm px-6 py-3 z-10 border-green-500 text-green-600 hover:bg-green-50"
      >
        ♻️ New Batch
      </Button>

      <div className="text-xs text-gray-500 z-10">
        {complimentsBatch.length > 0 && currentIndex >= 0 && (
          <span>Compliment {currentIndex + 1} of {complimentsBatch.length}</span>
        )}
      </div>
    </div>
  );
}
