'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/stores/useGameStore';

const QUESTIONS = [
  { q: "Where did we first meet?", a: ["School", "Park", "Online", "my place"], correct: 3, hint: "Think about where you feel most at home." },
  { q: "What is my favorite color?", a: ["Red", "Blue", "Green", "Pink"], correct: 0, hint: "It's the color of passion!" },
  { q: "What is our anniversary?", a: ["Feb 14", "Sept 25", "Oct 2", "Aug 15"], correct: 2, hint: "It's in the fall." },
  { q: "What food do I love most?", a: ["Amala and gbegs", "Ofada rice", "Fried Rice", "Burgers"], correct: 1, hint: "It's a local delicacy wrapped in leaves." },
  { q: "Which is our song!", a: ["Man i Need", "Love me jeje", "Best Part", "Wait for you"], correct: 0, hint: "the dean of my school." },
];

const COLORS = [
  "bg-pink-400 hover:bg-pink-500",
  "bg-teal-400 hover:bg-teal-500",
  "bg-indigo-400 hover:bg-indigo-500",
  "bg-orange-400 hover:bg-orange-500",
];

export default function QuizGateway() {
  const router = useRouter();
  const { updateQuiz } = useGameStore();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [skips, setSkips] = useState(4);
  const [failed, setFailed] = useState(false);
  const [showHeartbreak, setShowHeartbreak] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAnswer = async (index: number) => {
    const isCorrect = QUESTIONS[currentQ].correct === index;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000); 
    } else {
      setShowHeartbreak(true);
      setTimeout(() => setShowHeartbreak(false), 1000);
    }

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0));
      }
    }, 1000);
  };

  const finishQuiz = async (finalScore: number) => {
    if (finalScore >= 3) {
      await updateQuiz(finalScore);
      router.push('/hub');
    } else {
      setFailed(true);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQ(0);
    setSkips(4);
    setFailed(false);
    setShowHeartbreak(false);
    setShowCelebration(false);
  };

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border-4 border-red-100"
        >
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-3xl font-bold text-red-500 mb-2 font-outfit">Oh no!</h2>
          <p className="text-gray-600 mb-6 font-outfit">You need at least 3 correct answers to enter the ValenVerse!</p>
          <Button onClick={resetQuiz} className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-lg transition-transform hover:scale-105">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 min-h-[60vh] font-outfit">
      
      {/* Animations Overlay */}
      <AnimatePresence>
        {showHeartbreak && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 text-8xl pointer-events-none"
          >
            💔
          </motion.div>
        )}
        {showCelebration && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 text-8xl pointer-events-none"
          >
            🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="flex flex-col items-center w-full mb-8 space-y-2">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm text-pink-500 font-bold text-xs tracking-widest uppercase">
          ❤️ Level {currentQ + 1} of {QUESTIONS.length}
        </div>
        <div className="w-24 h-1 bg-pink-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <motion.div
        key={currentQ}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 w-full relative overflow-hidden"
      >
        {/* Question */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            {QUESTIONS[currentQ].q.split(' ').map((word, i) => {
               // Highlight key words logic (simple heuristic: longest word or specific indices)
               const isHighlight = word.length > 5 || i === QUESTIONS[currentQ].q.split(' ').length - 1;
               return isHighlight ? <span key={i} className="text-pink-500">{word} </span> : word + ' ';
            })}
          </h2>
        </div>

        {/* Answers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {QUESTIONS[currentQ].a.map((ans, idx) => (
            <motion.button 
              key={idx} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(idx)}
              disabled={showHeartbreak || showCelebration}
              className={`${COLORS[idx % COLORS.length]} text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all border-b-4 border-black/10 active:border-b-0 active:translate-y-1 block w-full`}
            >
              {ans}
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        <div className="text-center">
          <p className="text-gray-400 text-sm italic">
            💡 Hint: {QUESTIONS[currentQ].hint}
          </p>
        </div>

      </motion.div>
    </div>
  );
}
