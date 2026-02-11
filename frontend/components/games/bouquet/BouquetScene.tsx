'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { useState } from 'react';

function Flower({ position, color, onClick }: { position: [number, number, number], color: string, onClick: () => void }) {
  const [clicked, setClicked] = useState(false);

  return (
    <Float floatIntensity={2} speed={2}>
      <group position={position} onClick={() => { setClicked(true); onClick(); }}>
        {/* Stem */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="green" />
        </mesh>
        {/* Petals */}
        <mesh position={[0, 0.2, 0]}>
          <dodecahedronGeometry args={[0.5]} />
          <meshStandardMaterial color={clicked ? 'gold' : color} />
        </mesh>
        {clicked && (
          <Text position={[0, 1, 0]} fontSize={0.3} color="black">
            I Love You!
          </Text>
        )}
      </group>
    </Float>
  );
}

export default function BouquetScene() {
  const [count, setCount] = useState(0);

  const handleFlowerClick = () => {
    setCount(c => c + 1);
  };

  return (
    <div className="w-full h-full bg-sky-100 relative">
      <div className="absolute top-4 left-4 z-10 bg-white/50 p-2 rounded">
        Flowers collected: {count}
      </div>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Flower position={[-1, 0, 0]} color="red" onClick={handleFlowerClick} />
        <Flower position={[0, 0, 0]} color="pink" onClick={handleFlowerClick} />
        <Flower position={[1, 0, 0]} color="purple" onClick={handleFlowerClick} />
      </Canvas>
    </div>
  );
}
