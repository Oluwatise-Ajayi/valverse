'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with scratchable layer
    ctx.fillStyle = '#C0C0C0'; // Silver
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text "Scratch Me"
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('Scratch Here!', 100, 150);

    let isDrawing = false;

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
      if (!isDrawing) return;
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
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

    const startDraw = () => { isDrawing = true; };
    const endDraw = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', endDraw);
    
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', endDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', endDraw);
      // ... cleanup touch
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h2 className="text-2xl font-bold text-[var(--accent)]">Secret Message</h2>
      <div className="relative w-[300px] h-[300px] bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Hidden Content */}
        <div className="absolute inset-0 flex items-center justify-center bg-pink-100">
          <div className="text-center">
            <div className="text-6xl">🎁</div>
            <div className="text-xl font-bold mt-2">You won a Date!</div>
          </div>
        </div>
        {/* Scratch Layer */}
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          className={`absolute inset-0 z-10 cursor-pointer \${isRevealed ? 'pointer-events-none opacity-0 transition-opacity duration-1000' : ''}`}
        />
      </div>
      {isRevealed && <Button onClick={() => window.location.reload()}>Play Again</Button>}
    </div>
  );
}
