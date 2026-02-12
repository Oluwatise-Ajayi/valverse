
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Sparkles, Lock, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { StoryState, StoryNode, PlayerStats } from './types';

export default function StoryGame() {
    const [storyState, setStoryState] = useState<StoryState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingChoice, setProcessingChoice] = useState(false);

    // Fetch initial state
    useEffect(() => {
        fetchCurrentScene();
    }, []);

    const fetchCurrentScene = async () => {
        try {
            setLoading(true);
            const res = await api.get('/story/current');
            setStoryState(res.data);
        } catch (err: any) {
            console.error('Failed to load story:', err);
            setError(err.response?.data?.message || 'Failed to load story.');
        } finally {
            setLoading(false);
        }
    };

    const handleChoice = async (choiceId: string) => {
        if (!storyState || processingChoice) return;

        try {
            setProcessingChoice(true);
            // Optimistic update or just wait? Better to wait for new state
            const res = await api.post('/story/choice', {
                nodeId: storyState.node.id,
                choiceId,
            });
            setStoryState(res.data);
        } catch (err: any) {
            console.error('Failed to make choice:', err);
            setError(err.response?.data?.message || 'Failed to process choice.');
        } finally {
            setProcessingChoice(false);
        }
    };
    
    const handleReset = async () => {
        try {
            setLoading(true);
            await api.post('/story/reset');
            await fetchCurrentScene();
        } catch (err) {
            console.error('Failed to reset story', err);
        }
    }

    if (loading && !storyState) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-pink-400">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <RefreshCw size={32} />
                </motion.div>
                <span className="ml-3">Loading your story...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-900/50 rounded-lg hover:bg-red-800 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!storyState) return null;

    const { node, state } = storyState;
    const isEnding = node.choices.length === 0;

    return (
        <div className="relative w-full max-w-4xl mx-auto min-h-[80vh] flex flex-col bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Header / HUD */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
                <div className="text-sm text-gray-400 font-mono tracking-wider">
                    CHAPTER {node.chapter} • SCENE {node.scene}
                </div>
                
                {/* Stats Bar */}
                <div className="flex gap-4 text-xs font-medium">
                    <StatItem icon={Heart} label="Love" value={state.closeness} color="text-pink-500" />
                    <StatItem icon={Shield} label="Trust" value={state.trust} color="text-blue-400" />
                    <StatItem icon={Lock} label="Security" value={state.security} color="text-emerald-400" />
                    <StatItem icon={Sparkles} label="Desire" value={state.desire} color="text-purple-400" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-start relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        {node.text.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-6 text-xl md:text-2xl leading-relaxed text-gray-100 font-light last:mb-0">
                                {paragraph}
                            </p>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Choices Area */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent pt-12">
                <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                    {isEnding ? (
                         <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleReset}
                            className="w-full py-4 px-6 bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/50 rounded-xl text-pink-200 transition-all flex items-center justify-center gap-2 group"
                        >
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span>Play Again (New Game+)</span>
                        </motion.button>
                    ) : (
                        node.choices.map((choice, idx) => (
                            <motion.button
                                key={choice.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 + 0.3 }}
                                onClick={() => handleChoice(choice.id)}
                                disabled={processingChoice}
                                className="w-full text-left py-4 px-6 bg-white/5 hover:bg-white/10 hover:border-pink-500/50 border border-white/10 rounded-xl text-gray-200 transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-mono text-gray-500 group-hover:border-pink-500 group-hover:text-pink-400 transition-colors">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{choice.label}</span>
                                </span>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    return (
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            <Icon size={14} className={color} />
            <span className="opacity-70 hidden sm:inline">{label}</span>
            <span className="font-mono text-white/90">{value}</span>
        </div>
    );
}
