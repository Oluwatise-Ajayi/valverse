'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface Scene {
  id: string;
  text: string;
  background: string; // CSS color or image URL
  choices: { text: string; nextScene: string }[];
}

const SCENES: Record<string, Scene> = {
  start: {
    id: 'start',
    text: "It was a sunny afternoon when we first met. Do you remember where?",
    background: 'bg-yellow-100',
    choices: [
      { text: "At the coffee shop ☕", nextScene: 'coffee' },
      { text: "In the library 📚", nextScene: 'library' },
    ]
  },
  coffee: {
    id: 'coffee',
    text: "Yes! The smell of roasted beans was in the air. You bumped into me and spilled my drink.",
    background: 'bg-orange-100',
    choices: [
      { text: "I apologized profusely! 😓", nextScene: 'apology' },
      { text: "I offered to buy you a new one ☕", nextScene: 'offer' },
    ]
  },
  library: {
    id: 'library',
    text: "Hmm, I think you might be mixing up stories... but I do love books!",
    background: 'bg-blue-100',
    choices: [
      { text: "Let's try again 🔄", nextScene: 'start' },
    ]
  },
  apology: {
    id: 'apology',
    text: "You did! And you looked so cute being flustered. I knew right then...",
    background: 'bg-pink-100',
    choices: [
      { text: "That I was the one? 💍", nextScene: 'end' },
    ]
  },
  offer: {
    id: 'offer',
    text: "Smooth move. We sat down and talked for hours.",
    background: 'bg-pink-100',
    choices: [
      { text: "Best day ever ❤️", nextScene: 'end' },
    ]
  },
  end: {
    id: 'end',
    text: "And the rest is history. Happy Valentine's Day, my love!",
    background: 'bg-red-100',
    choices: [
      { text: "I love you! (Finish)", nextScene: 'finish' },
    ]
  }
};

export default function LoveStoryRPG() {
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const scene = SCENES[currentSceneId];

  const handleChoice = (nextScene: string) => {
    if (nextScene === 'finish') {
      // Trigger win state / unlock
      alert("Story Completed! You unlocked a memory.");
      window.location.href = '/hub';
    } else {
      setCurrentSceneId(nextScene);
    }
  };

  return (
    <div className={\`w-full h-full flex items-center justify-center p-8 transition-colors duration-500 \${scene.background}\`}>
      <div className="max-w-2xl w-full bg-white/90 p-8 rounded-2xl shadow-2xl space-y-8">
        <AnimatePresence mode='wait'>
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-gray-800 leading-relaxed">
              {scene.text}
            </h2>

            <div className="grid gap-4 pt-4">
              {scene.choices.map((choice, idx) => (
                <Button 
                  key={idx} 
                  onClick={() => handleChoice(choice.nextScene)}
                  className="w-full text-lg py-4"
                  variant="outline"
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
