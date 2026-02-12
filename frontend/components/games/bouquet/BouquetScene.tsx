'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sparkles, Html } from '@react-three/drei';
import { useState, useEffect, useMemo, Suspense } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Configuration ---
const PARTNER_INTERESTS = "love, romance, gossip, fashion, makeup, skincare, shopping,music, dancing, singing, cooking, baking, traveling, photography, art, drawing, painting, writing, reading, her boyfriend";

// --- Types ---
interface FlowerProps {
  position: [number, number, number];
  color: string;
  compliment: string;
  isCollected: boolean;
  onClick: () => void;
}

// --- Fallback Compliments ---
const FALLBACK_COMPLIMENTS = [
  "You light up every room you enter! ✨",
  "Your smile is contagious! 😊",
  "You're incredibly thoughtful! 💭",
  "Your kindness knows no bounds! 🌟",
  "You make the world better! 🌍",
  "You're absolutely amazing! 🎉",
  "Your energy is infectious! ⚡",
  "You're one of a kind! 💎",
  "You inspire others daily! 🌈",
  "Your heart is pure gold! 💛",
  "You're beautifully authentic! 🦋",
  "You radiate positivity! ☀️",
  "You're stronger than you know! 💪",
  "Your creativity is boundless! 🎨",
  "I Love you Baby girl 💝",
  "You make life more beautiful! 🌺",
  "Your laugh is music! 🎵",
  "You're absolutely wonderful! 🌸",
  "You deserve all the love! 💗",
  "You're genuinely special! ⭐"
];

// ... (existing code) ...

function Flower({ position, color, compliment, isCollected, onClick }: FlowerProps) {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}>
      <Float 
        floatIntensity={isCollected ? 0.5 : 2} 
        rotationIntensity={1} 
        speed={isCollected ? 0.5 : 2}
      >
        <group 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          scale={hovered && !isCollected ? 1.2 : 1}
        >
          {/* Stem */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2]} />
            <meshStandardMaterial color="#86efac" toneMapped={false} />
          </mesh>

          {/* Leaves */}
          <mesh position={[0.2, -0.8, 0]} rotation={[0, 0, -0.5]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#4ade80" toneMapped={false} />
          </mesh>
          <mesh position={[-0.2, -1.2, 0]} rotation={[0, 0, 0.5]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#4ade80" toneMapped={false} />
          </mesh>

          {/* Flower Center */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24"
              emissiveIntensity={0.5}
              toneMapped={false}
            />
          </mesh>

          {/* Petals - arranged in a circle */}
          {[...Array(5)].map((_, i) => (
            <group key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
              <mesh position={[0, 0.4, 0]} scale={[1, 1, 0.1]}>
                <dodecahedronGeometry args={[0.3]} />
                <meshStandardMaterial 
                  color={isCollected ? '#fb7185' : color} 
                  emissive={isCollected ? '#fb7185' : color}
                  emissiveIntensity={0.4}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Compliment Text (HTML Overlay) */}
        {isCollected && (
          <Html position={[0, 1.8, 0]} center distanceFactor={12} className="pointer-events-none w-48">
             <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.8 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border-2 border-pink-200 text-center relative"
             >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-200 rotate-45 transform"></div>
                <p className="text-pink-600 font-bold text-sm leading-tight drop-shadow-sm font-outfit">
                  {compliment}
                </p>
             </motion.div>
          </Html>
        )}
      </Float>
    </group>
  );
}

// --- Main Scene Component ---

export default function BouquetScene() {
  const [compliments, setCompliments] = useState<string[]>(FALLBACK_COMPLIMENTS);
  const [collectedIndices, setCollectedIndices] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refilling, setRefilling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Position grid generation (5 columns x 4 rows = 20 total)
  const flowers = useMemo(() => {
    const cols = 5;
    const rows = 4;
    const positions: [number, number, number][] = [];
    // Bright, vibrant Valentine colors
    const colors = [
      '#ff007f', // Rose
      '#ff4d6d', // Hot Pink
      '#ff758f', // Soft Pink
      '#a855f7', // Purple
      '#fb7185', // Coral
      '#f43f5e'  // Red-Pink
    ]; 

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Center the grid
        const x = (c - (cols - 1) / 2) * 2; 
        const y = (rows - 1 - r - (rows - 1) / 2) * 2.5; 
        positions.push([x, y, 0]);
      }
    }
    return positions.map((pos) => ({
        pos,
        color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);

  const fetchCompliments = async () => {
    try {
      setRefilling(true);
      
      // Try to fetch from API
      const response = await axios.post('http://localhost:4000/compliments/generate', {
        interest: PARTNER_INTERESTS,
        count: 20
      }, {
        timeout: 3000 // 3 second timeout
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length === 20) {
        setCompliments(response.data);
      } else {
        // Use fallback if response is invalid
        setCompliments(FALLBACK_COMPLIMENTS);
      }
      
      setCollectedIndices(new Set()); // Reset collection
    } catch (error) {
      console.log("Using fallback compliments (API unavailable)");
      // Always use fallback on error - this prevents the stuck loading screen
      setCompliments(FALLBACK_COMPLIMENTS);
      setCollectedIndices(new Set());
    } finally {
      // Always set loading to false, even if there's an error
      setLoading(false);
      setRefilling(false);
    }
  };

  useEffect(() => {
    fetchCompliments();
  }, []);

  const handleFlowerClick = (index: number) => {
    if (collectedIndices.has(index)) return;

    const newSet = new Set(collectedIndices);
    newSet.add(index);
    setCollectedIndices(newSet);

    // Check if all collected
    if (newSet.size === 20) {
      setTimeout(() => {
        fetchCompliments();
      }, 3000); // 3s delay to read last one
    }
  };

  return (
    <div className="w-full h-full bg-[#fff0f5] relative font-outfit">
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#be185d] drop-shadow-sm">3D Bouquet Garden</h1>
          <p className="text-pink-600 font-medium text-sm md:text-base">Tap a flower to find a hidden message</p>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-pink-500 font-bold border border-pink-200 pointer-events-auto text-sm md:text-base">
          Collected: {collectedIndices.size} / 20
        </div>
      </div>

      {/* Loading / Refilling Overlay */}
      <AnimatePresence>
        {(loading || refilling) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#fff0f5]/95 backdrop-blur-sm"
          >
             <div className="text-6xl animate-bounce mb-6">🌷</div>
             <h2 className="text-3xl font-bold text-pink-600 mb-2">Growing new flowers...</h2>
             <p className="text-gray-500 font-medium">Sprinkling some love magic ✨</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {collectedIndices.size === 20 && !refilling && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-4 border-pink-400 max-w-sm w-full">
              <p className="text-3xl md:text-4xl font-bold text-pink-500 text-center mb-2">
                🎉 All Bloom! 🎉
              </p>
              <p className="text-lg md:text-xl text-pink-400 text-center">
                New flowers growing soon...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas camera={{ position: [0, 0, isMobile ? 22 : 12], fov: 50 }}>
        <color attach="background" args={['#fff0f5']} />
        
        {/* Lighting */}
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#fff1f2" />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.3} penumbra={1} color="#ffe4e6" />
        
        {/* Environment */}
        <Sparkles count={150} scale={15} size={8} speed={0.6} opacity={0.8} color="#fca5a5" />
        
        <OrbitControls 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={30} 
          enablePan={true}
          maxPolarAngle={Math.PI / 1.5} // Don't go below ground
        />

        {/* Flowers Grid - Always render after initial load */}
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
             {!loading && flowers.map((flowerData, index) => (
               <Flower 
                 key={index}
                 position={flowerData.pos} 
                 color={flowerData.color}
                 compliment={compliments[index] || "You are special!"}
                 isCollected={collectedIndices.has(index)}
                 onClick={() => handleFlowerClick(index)}
               />
             ))}
          </group>
        </Suspense>

      </Canvas>
    </div>
  );
}