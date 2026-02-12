'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT';

interface Reward {
  id: string;
  title: string;
  type: MediaType;
  url: string;
}

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const isDrawing = useRef(false);

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
                title: 'You won a Date!',
                type: 'TEXT',
                url: ''
            });
        }
      } catch (error) {
        console.error("Failed to fetch rewards", error);
         setReward({
                id: 'fallback',
                title: 'You won a Date!',
                type: 'TEXT',
                url: ''
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

    // Fill with scratchable layer
    ctx.fillStyle = '#C0C0C0'; // Silver
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text "Scratch Me"
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.fillText('Scratch Here!', 200, 200);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
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
      if (transparent / (pixels.length / 4) > 0.5) {
        setIsRevealed(true);
      }
    };

    const startDraw = () => { isDrawing.current = true; };
    const endDraw = () => { isDrawing.current = false; };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', scratch);
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
      return <div className="text-[var(--accent)] font-bold text-xl">Loading your surprise...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h2 className="text-3xl font-bold text-[var(--accent)] font-serif">Secret Message</h2>
      <div className="relative w-[600px] h-[400px] bg-white rounded-xl shadow-2xl overflow-hidden frame-border">
        {/* Hidden Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-50 p-8">
            {reward?.type === 'TEXT' && (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="text-6xl mb-4">🎁</div>
                    <div className="text-3xl font-bold text-gray-800 font-serif">{reward.title}</div>
                </div>
            )}
            {reward?.type === 'IMAGE' && (
                <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <img src={reward.url} alt={reward.title} className="max-h-[300px] object-contain rounded-lg shadow-md mb-4" />
                    <p className="text-xl font-bold text-gray-700">{reward.title}</p>
                </div>
            )}
            {reward?.type === 'AUDIO' && (
                 <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-2xl font-bold mb-4">{reward.title}</h3>
                    <audio controls src={reward.url} className="w-full max-w-md" />
                </div>
            )}
             {/* Fallback for other types or missing data */}
             {reward?.type !== 'TEXT' && reward?.type !== 'IMAGE' && reward?.type !== 'AUDIO' && (
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{reward?.title}</div>
                </div>
             )}
        </div>
        {/* Scratch Layer */}
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className={`absolute inset-0 z-10 cursor-pointer ${isRevealed ? 'pointer-events-none opacity-0 transition-opacity duration-1000' : ''}`}
        />
      </div>
      {isRevealed && <Button onClick={() => window.location.reload()} className="text-xl px-8 py-6">Play Again</Button>}
    </div>
  );
}
