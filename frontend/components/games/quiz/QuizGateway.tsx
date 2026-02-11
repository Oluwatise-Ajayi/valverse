'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/stores/useGameStore';

const QUESTIONS = [
  { q: "Where did we first meet?", a: ["School", "Park", "Online", "Cafe"], correct: 2 },
  { q: "What is my favorite color?", a: ["Red", "Blue", "Green", "Pink"], correct: 3 },
  { q: "What is our anniversary?", a: ["Feb 14", "Dec 25", "Jan 1", "Aug 15"], correct: 0 },
  { q: "What food do I love most?", a: ["Pizza", "Sushi", "Tacos", "Burgers"], correct: 1 },
  { q: "Which movie did we watch first?", a: ["Titanic", "Notebook", "Avengers", "Shrek"], correct: 3 },
];

export default function QuizGateway() {
  const router = useRouter();
  const { updateQuiz } = useGameStore();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [skips, setSkips] = useState(4);
  const [failed, setFailed] = useState(false);

  const handleAnswer = async (index: number) => {
    const isCorrect = QUESTIONS[currentQ].correct === index;
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      // If at least 1 correct, we can technically pass, but let's finish the quiz
    }

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      finishQuiz(score + (isCorrect ? 1 : 0));
    }
  };

  const handleSkip = () => {
    if (skips > 0) {
      setSkips(prev => prev - 1);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        finishQuiz(score);
      }
    }
  };

  const finishQuiz = async (finalScore: number) => {
    if (finalScore > 0) {
      await updateQuiz(finalScore);
      router.push('/hub');
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <h2 className="text-2xl font-bold text-red-500">Oh no! 😢</h2>
        <p>You need to get at least one right to enter the ValenVerse!</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg p-6 bg-white/90 rounded-2xl shadow-xl text-center space-y-6">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Question {currentQ + 1}/{QUESTIONS.length}</span>
        <span>Skips left: {skips}</span>
      </div>

      <motion.div
        key={currentQ}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-[var(--accent)]">
          {QUESTIONS[currentQ].q}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUESTIONS[currentQ].a.map((ans, idx) => (
            <Button 
              key={idx} 
              variant="outline" 
              onClick={() => handleAnswer(idx)}
              className="w-full"
            >
              {ans}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="mt-4">
        <button 
          onClick={handleSkip}
          disabled={skips === 0}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50 text-sm"
        >
          Skip Question ⏭️
        </button>
      </div>
    </div>
  );
}
