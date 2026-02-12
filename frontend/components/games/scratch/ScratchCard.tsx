'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT' | 'COMPLIMENT';

interface Reward {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  url: string;
}

// Floating hearts component
const FloatingHeart = ({ delay, duration, startX, startY, size }: any) => (
  <motion.div
    className="absolute opacity-30"
    style={{ fontSize: size }}
    initial={{ x: startX, y: startY, rotate: 0, opacity: 0.3 }}
    animate={{
      x: startX + Math.random() * 80 - 40,
      y: startY - 100,
      rotate: Math.random() * 360,
      opacity: 0,
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  >
    💖
  </motion.div>
);

export default function ScratchCard() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const [scratched, setScratched] = useState(0);
  const isDrawing = useRef(false);
  const celebrationShown = useRef(false);


  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await api.get('/media/game/scratch');
        const rewards: Reward[] = response.data;
        if (rewards.length > 0) {
           const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
           setReward(randomReward);
        } else {
            // Fallback if no rewards in DB
            setReward({
                id: 'fallback',
                title: 'You won a special date night! 🌹',
                type: 'TEXT',
                url: '',
                description: 'Get ready for an amazing surprise!'
            });
        }
      } catch (error) {
        console.error("Failed to fetch rewards", error);
         setReward({
                id: 'fallback',
                title: 'You won a special date night! 🌹',
                type: 'TEXT',
                url: '',
                description: 'Get ready for an amazing surprise!'
            });
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);
  
  useEffect(() => {
    if (loading || !reward) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with pink/silver scratchable layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8b4d9');
    gradient.addColorStop(0.5, '#e89ac7');
    gradient.addColorStop(1, '#d88fb0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height
      };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fill();
      checkReveal();
    };

    const checkReveal = () => {
      // Sample pixels to see how much is cleared
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) transparent++;
      }
      const percentage = transparent / (pixels.length / 4);
      setScratched(Math.floor(percentage * 100));
      
      // Show celebration at 80% (only once)
      if (percentage > 0.8 && !celebrationShown.current) {
        celebrationShown.current = true;
        setShowCelebration(true);
        
        // Auto-reveal after celebration
        setTimeout(() => {
          setShowCelebration(false);
          setIsRevealed(true);
        }, 1500);
      }
      
      // Immediate reveal if user gets to 95%
      if (percentage > 0.95) {
        setIsRevealed(true);
        setShowCelebration(false);
      }
    };

    const startDraw = (e: MouseEvent | TouchEvent) => { 
      isDrawing.current = true;
      scratch(e); // Start scratching immediately
    };
    const endDraw = () => { isDrawing.current = false; };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', endDraw);
      canvas.removeEventListener('mouseleave', endDraw);
      
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', endDraw);
    };
  }, [loading, reward]);

  if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-pink-100 to-rose-50">
          <div className="text-[var(--accent)] font-bold text-2xl animate-pulse">Loading your surprise... 💝</div>
        </div>
      );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-pink-100 to-rose-50 p-6 overflow-hidden">
      {/* Floating Hearts Background */}
      <FloatingHeart delay={0} duration={4} startX="10%" startY="80%" size="2rem" />
      <FloatingHeart delay={0.5} duration={5} startX="85%" startY="75%" size="1.5rem" />
      <FloatingHeart delay={1} duration={6} startX="20%" startY="70%" size="1.8rem" />
      <FloatingHeart delay={1.5} duration={4.5} startX="75%" startY="85%" size="2.2rem" />
      <FloatingHeart delay={2} duration={5.5} startX="50%" startY="90%" size="1.6rem" />
      <FloatingHeart delay={0.3} duration={5.2} startX="30%" startY="82%" size="1.9rem" />
      <FloatingHeart delay={1.8} duration={4.8} startX="65%" startY="78%" size="1.7rem" />

      {/* Back to Hub Button */}
      <button
        onClick={() => router.push('/hub')}
        className="absolute top-6 left-6 text-pink-600 hover:text-pink-700 flex items-center gap-2 font-medium z-20 transition-colors"
      >
        ← Back to Hub
      </button>

      {/* Header */}
      <motion.h1 
        className="text-5xl md:text-6xl font-serif text-pink-600 mb-2 z-10"
        style={{ fontFamily: "'Dancing Script', cursive" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scratch for a Secret!
      </motion.h1>
      
      <motion.p 
        className="text-gray-600 text-sm md:text-base mb-8 z-10 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Use your heart (or cursor!) to reveal what's underneath...
      </motion.p>

      {/* Scratch Card Container */}
      <motion.div 
        className="relative w-full max-w-2xl aspect-[3/2] bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Hidden Content (Reward) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-white p-8">
            <AnimatePresence>
            {reward?.type === 'TEXT' && (
                <motion.div 
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                    <div className="text-7xl mb-4 animate-bounce">🎁</div>
                    <div 
                      className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {reward.title}
                    </div>
                    {reward.description && (
                      <p className="text-lg text-gray-600 mt-2">{reward.description}</p>
                    )}
                </motion.div>
            )}
            
            {reward?.type === 'COMPLIMENT' && (
                <motion.div 
                  className="text-center max-w-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                    <div className="text-7xl mb-6">💝</div>
                    <div 
                      className="text-2xl md:text-3xl font-handwriting text-gray-800 leading-relaxed"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      "{reward.description || reward.title}"
                    </div>
                </motion.div>
            )}
            
            {reward?.type === 'IMAGE' && (
                <motion.div 
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                    <img 
                      src={reward.url} 
                      alt={reward.title} 
                      className="max-h-96 object-contain rounded-2xl shadow-lg mb-4" 
                    />
                    <p className="text-2xl font-bold text-gray-700" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      {reward.title}
                    </p>
                    {reward.description && (
                      <p className="text-gray-600 mt-2">{reward.description}</p>
                    )}
                </motion.div>
            )}
            
            {reward?.type === 'AUDIO' && (
                 <motion.div 
                   className="text-center max-w-md"
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 0.5 }}
                 >
                    <div className="text-7xl mb-6">🎵</div>
                    <h3 
                      className="text-3xl font-bold mb-4 text-gray-800"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {reward.title}
                    </h3>
                    {reward.description && (
                      <p className="text-gray-600 mb-4">{reward.description}</p>
                    )}
                    <audio controls src={reward.url} className="w-full max-w-md rounded-xl shadow-md" />
                </motion.div>
            )}
            
            {reward?.type === 'VIDEO' && (
                 <motion.div 
                   className="w-full h-full flex flex-col items-center justify-center p-4"
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 0.5 }}
                 >
                    <video 
                      controls 
                      src={reward.url} 
                      className="max-h-96 w-full rounded-2xl shadow-lg mb-4"
                    />
                    <p className="text-2xl font-bold text-gray-700" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      {reward.title}
                    </p>
                    {reward.description && (
                      <p className="text-gray-600 mt-2">{reward.description}</p>
                    )}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
        
        {/* Scratch Layer */}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={533} 
          className={`absolute inset-0 w-full h-full z-10 cursor-pointer touch-none ${
            isRevealed ? 'pointer-events-none opacity-0 transition-opacity duration-1000' : ''
          }`}
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        {/* Scratch Progress Indicator */}
        {!isRevealed && scratched > 0 && (
          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-6 py-2 rounded-full shadow-lg z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-pink-600">{scratched}% Scratched</div>
              <div className="text-xl">✨</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Celebration Overlay at 80% */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            {/* Confetti/Sparkles Background */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1.5, 0],
                    rotate: [0, 360],
                    y: [0, -100],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.3,
                    ease: 'easeOut',
                  }}
                >
                  {['🎉', '✨', '💖', '🌟', '💝'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>

            {/* Success Message */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 text-white px-12 py-8 rounded-3xl shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-7xl mb-4"
                >
                  🎊
                </motion.div>
                <h2 
                  className="text-4xl font-bold mb-2"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Almost There!
                </h2>
                <p className="text-xl opacity-90">
                  Revealing your surprise... ✨
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Again Button */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 z-10"
          >
            <Button 
              onClick={() => window.location.reload()} 
              className="text-xl px-10 py-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-xl"
            >
              💖 Scratch Another!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
