import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Play, RotateCcw, Pause, Settings, Activity, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';

// --- Constants ---
const CELL_SIZE = 20;
const GRID_WIDTH = 30; // 600px
const GRID_HEIGHT = 20; // 400px
const INITIAL_SPEED = 100;
const POWERUP_DURATION = 7000;

type Point = { x: number; y: number };
type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
type PowerUpType = 'GHOST' | 'WRAP' | null;
type FoodType = 'NORMAL' | 'GHOST' | 'WRAP';

// Mock Leaderboard Data
const MOCK_LEADER_BOARD = [
    { name: 'ULTRA_SNK', score: 4850 },
    { name: 'COLD_BLOOD', score: 3200 },
];

const SnakeGame: React.FC = () => {
    const { progress, updateGameState: updateBackendState } = useGameStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>('START');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [activePowerUp, setActivePowerUp] = useState<PowerUpType>(null);

    // Initialize High Score from Backend
    useEffect(() => {
        if (progress?.gameStates) {
            const snakeState = (progress.gameStates as any)['snake-kiss'];
            if (snakeState?.highScore) {
                setHighScore(snakeState.highScore);
            }
        }
    }, [progress]);
    
    // Game Mutable State
    const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
    const directionRef = useRef<Point>({ x: 1, y: 0 });
    const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
    const foodRef = useRef<{ x: number; y: number; type: FoodType }>({ x: 15, y: 10, type: 'NORMAL' });
    const speedRef = useRef(INITIAL_SPEED);
    const lastRenderTimeRef = useRef(0);
    const powerUpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const powerUpEndTimeRef = useRef<number>(0);

    // Touch Handling State
    const touchStartRef = useRef<Point | null>(null);
    const bgImageRef = useRef<HTMLImageElement | null>(null);

    // Load Background Image
    useEffect(() => {
        const img = new Image();
        img.src = '/images/mybbygirl.jpeg';
        img.onload = () => {
            bgImageRef.current = img;
        };
    }, []);

    // --- Audio ---
    const playSound = useCallback((type: 'eat' | 'die' | 'powerup' | 'click') => {
        // Only run on client
        if (typeof window === 'undefined') return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'eat') {
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1600, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'die') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.5);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'powerup') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    }, []);

    // --- Game Logic ---
    const spawnFood = () => {
        let type: FoodType = 'NORMAL';
        const rand = Math.random();
        // 20% Chance for GHOST, 20% Chance for WRAP
        if (rand > 0.80) type = 'GHOST';
        else if (rand > 0.60) type = 'WRAP';
        
        const newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT),
            type
        };
        foodRef.current = newFood;
    };

    const activatePowerUp = (type: PowerUpType) => {
        if (!type) return;
        setActivePowerUp(type);
        playSound('powerup');
        powerUpEndTimeRef.current = Date.now() + POWERUP_DURATION;
        if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current);
        powerUpTimeoutRef.current = setTimeout(() => setActivePowerUp(null), POWERUP_DURATION);
    };

    const resetGame = () => {
        snakeRef.current = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]; // Head + Tail
        directionRef.current = { x: 1, y: 0 };
        nextDirectionRef.current = { x: 1, y: 0 };
        setScore(0);
        setGameState('PLAYING');
        speedRef.current = INITIAL_SPEED;
        setActivePowerUp(null);
        spawnFood();
        playSound('click');
        if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current);
    };

    const gameOver = () => {
        playSound('die');
        setGameState('GAME_OVER');
        if (score > highScore) {
            setHighScore(score);
            // Save to Backend
            updateBackendState('snake-kiss', { highScore: score });
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff4d6d', '#ff758f', '#ffffff'] });
        }
    };

    const togglePause = () => {
        if (gameState === 'PLAYING') setGameState('PAUSED');
        else if (gameState === 'PAUSED') setGameState('PLAYING');
        playSound('click');
    };

    const handleDirectionChange = (newDir: Point) => {
        const currentDir = directionRef.current;
        // Prevent 180 degree turns
        if (newDir.x !== 0 && currentDir.x !== 0) return;
        if (newDir.y !== 0 && currentDir.y !== 0) return;
        
        nextDirectionRef.current = newDir;
    };

    // --- Controls ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent scrolling with arrows
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
               e.preventDefault();
            }

            if (e.code === 'Space') {
                if (gameState === 'GAME_OVER' || gameState === 'START') resetGame();
                else togglePause();
                return;
            }

            if (gameState !== 'PLAYING') return;
            
            const { key } = e;
            
            if (key === 'ArrowUp') handleDirectionChange({ x: 0, y: -1 });
            if (key === 'ArrowDown') handleDirectionChange({ x: 0, y: 1 });
            if (key === 'ArrowLeft') handleDirectionChange({ x: -1, y: 0 });
            if (key === 'ArrowRight') handleDirectionChange({ x: 1, y: 0 });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // --- Touch Controls ---
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        
        // Minimum swipe distance
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal
            if (dx > 0) handleDirectionChange({ x: 1, y: 0 }); // Right
            else handleDirectionChange({ x: -1, y: 0 }); // Left
        } else {
            // Vertical
            if (dy > 0) handleDirectionChange({ x: 0, y: 1 }); // Down
            else handleDirectionChange({ x: 0, y: -1 }); // Up
        }
        touchStartRef.current = null;
    };

    // --- Game Loop ---
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        let animationFrameId: number;

        const loop = (time: number) => {
            const timeSinceLastRender = time - lastRenderTimeRef.current;
            
            if (timeSinceLastRender > speedRef.current) {
                lastRenderTimeRef.current = time;
                directionRef.current = nextDirectionRef.current;
                
                const head = snakeRef.current[0];
                let newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

                // Walls
                if (activePowerUp === 'WRAP') {
                    if (newHead.x < 0) newHead.x = GRID_WIDTH - 1;
                    if (newHead.x >= GRID_WIDTH) newHead.x = 0;
                    if (newHead.y < 0) newHead.y = GRID_HEIGHT - 1;
                    if (newHead.y >= GRID_HEIGHT) newHead.y = 0;
                } else {
                    if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
                        gameOver();
                        return;
                    }
                }

                // Self Collision
                if (activePowerUp !== 'GHOST') {
                    for (let part of snakeRef.current) {
                        if (newHead.x === part.x && newHead.y === part.y) {
                            gameOver();
                            return;
                        }
                    }
                }

                const newSnake = [newHead, ...snakeRef.current];
                
                if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
                    playSound('eat');
                    setScore(s => s + 50);
                    if (foodRef.current.type === 'GHOST') activatePowerUp('GHOST');
                    if (foodRef.current.type === 'WRAP') activatePowerUp('WRAP');
                    spawnFood();
                } else {
                    newSnake.pop();
                }

                snakeRef.current = newSnake;
            }

            // --- Render ---
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                // Background
                if (bgImageRef.current) {
                    ctx.drawImage(bgImageRef.current, 0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
                    // Add a semi-transparent overlay to ensure game elements are visible
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Lighter overlay for better visibility of the photo
                    ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
                } else {
                    ctx.fillStyle = '#fff0f3'; // Fallback Light Pink Background
                    ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
                }

                // Grid Lines
                ctx.strokeStyle = 'rgba(255, 77, 109, 0.2)'; // More visible Soft Pink
                ctx.lineWidth = 1;
                for (let i = 1; i < GRID_WIDTH; i++) {
                    ctx.beginPath();
                    ctx.moveTo(i * CELL_SIZE, 0);
                    ctx.lineTo(i * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
                    ctx.stroke();
                }
                for (let j = 1; j < GRID_HEIGHT; j++) {
                    ctx.beginPath();
                    ctx.moveTo(0, j * CELL_SIZE);
                    ctx.lineTo(GRID_WIDTH * CELL_SIZE, j * CELL_SIZE);
                    ctx.stroke();
                }

                // Border Highlight
                const borderColor = activePowerUp === 'WRAP' ? '#ec4899' : '#ff4d6d';
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.strokeRect(1, 1, GRID_WIDTH * CELL_SIZE - 2, GRID_HEIGHT * CELL_SIZE - 2);

                // Snake
                snakeRef.current.forEach((part, index) => {
                    let color = index === 0 ? '#ff4d6d' : '#ff8fa3'; // Bright Pink Head, Light Pink Body
                    if (activePowerUp === 'GHOST') color = index === 0 ? '#60a5fa' : '#93c5fd';
                    if (activePowerUp === 'WRAP') color = index === 0 ? '#d946ef' : '#e879f9';

                    ctx.fillStyle = color;
                    ctx.shadowBlur = index === 0 ? 10 : 0;
                    ctx.shadowColor = color;
                    
                    // Slightly rounded segments
                    const padding = 1;
                    ctx.fillRect(part.x * CELL_SIZE + padding, part.y * CELL_SIZE + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);
                    ctx.shadowBlur = 0;
                });

                // Food
                // Food - Render as Egg (Ellipse)
                let foodColor = '#fbbf24'; // Yellow/Gold
                let glowColor = '#fbbf24';
                if (foodRef.current.type === 'GHOST') { foodColor = '#3b82f6'; glowColor = '#60a5fa'; } // Blue (Ghost)
                if (foodRef.current.type === 'WRAP') { foodColor = '#a855f7'; glowColor = '#d8b4fe'; } // Purple (Wrap)
                
                ctx.fillStyle = foodColor;
                ctx.shadowBlur = 15;
                ctx.shadowColor = glowColor;
                ctx.beginPath();
                ctx.ellipse(
                    foodRef.current.x * CELL_SIZE + CELL_SIZE / 2,
                    foodRef.current.y * CELL_SIZE + CELL_SIZE / 2,
                    CELL_SIZE / 2.5, // Radius X
                    CELL_SIZE / 3,   // Radius Y (Egg shape)
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                ctx.shadowBlur = 0;

                // Power-up Timer Bar (if active)
                if (activePowerUp) {
                    const timeLeft = Math.max(0, (powerUpEndTimeRef.current - Date.now()) / POWERUP_DURATION);
                    const barWidth = 200;
                    const barHeight = 6;
                    const x = (GRID_WIDTH * CELL_SIZE - barWidth) / 2;
                    const y = 10;

                    // Bar Background
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x, y, barWidth, barHeight);

                    // Bar Fill
                    ctx.fillStyle = activePowerUp === 'GHOST' ? '#3b82f6' : '#a855f7';
                    ctx.fillRect(x, y, barWidth * timeLeft, barHeight);
                    
                    // Label
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 10px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(activePowerUp === 'GHOST' ? 'GHOST MODE' : 'PORTAL MODE', GRID_WIDTH * CELL_SIZE / 2, y + 16);
                }
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState, activePowerUp]);

    // Helpers for UI
    const getDifficultyLevel = () => Math.min(Math.floor(score / 500) + 1, 10);
    const difficultyPercentage = (getDifficultyLevel() / 10) * 100;

    return (
        <div className="w-full h-full bg-white font-outfit p-4 lg:p-8 flex flex-col items-center justify-center overflow-y-auto">
            
            {/* Main Dashboard Grid */}
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Game Display (colspan 2) */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Header Info */}
                    <div className="flex justify-between items-end border-b border-pink-200 pb-2">
                        <div>
                            <div className="flex items-center gap-2 text-pink-500 mb-1">
                                <Activity className="w-4 h-4" />
                                <span className="text-xs tracking-widest text-pink-600 font-bold">SESSION ACTIVE | LEVEL {getDifficultyLevel().toString().padStart(2, '0')}</span>
                            </div>
                            <h1 className="text-3xl font-black italic tracking-tighter text-[#ff4d6d] drop-shadow-sm">
                                SNAKE KISS 🐍
                            </h1>
                        </div>
                    </div>

                    {/* Canvas Container */}
                    <div className="flex justify-center">
                        <div 
                            className="relative group rounded-xl overflow-hidden border-4 border-pink-200 bg-[#fff0f3] shadow-lg touch-none"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <canvas
                                ref={canvasRef}
                                width={GRID_WIDTH * CELL_SIZE}
                                height={GRID_HEIGHT * CELL_SIZE}
                                className="block"
                                style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
                            />
                            
                            {/* Start/Paused Screen Overlay */}
                            {(gameState === 'START' || gameState === 'PAUSED') && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[2px]">
                                    <button 
                                        onClick={gameState === 'START' ? resetGame : togglePause}
                                        className="group relative px-8 py-4 bg-[#ff4d6d] hover:bg-[#ff758f] text-white font-black uppercase tracking-wider text-xl transition-all skew-x-[-10deg] hover:scale-105 shadow-lg shadow-pink-500/30 rounded-xl"
                                    >
                                        <div className="skew-x-[10deg] flex items-center gap-3">
                                            <Play className="fill-current w-6 h-6" />
                                            {gameState === 'START' ? 'START GAME' : 'RESUME'}
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Controls (Visible on small screens) */}
                    <div className="lg:hidden flex justify-center py-4">
                        <div className="grid grid-cols-3 gap-2">
                             <div />
                             <button
                                className="w-14 h-14 bg-pink-100 border border-pink-300 rounded-xl flex items-center justify-center active:bg-pink-200 transition-colors shadow-sm"
                                onPointerDown={(e) => { e.preventDefault(); handleDirectionChange({ x: 0, y: -1 }); }}
                             >
                                <ChevronUp className="text-pink-500" />
                             </button>
                             <div />
                             <button
                                className="w-14 h-14 bg-pink-100 border border-pink-300 rounded-xl flex items-center justify-center active:bg-pink-200 transition-colors shadow-sm"
                                onPointerDown={(e) => { e.preventDefault(); handleDirectionChange({ x: -1, y: 0 }); }}
                             >
                                <ChevronLeft className="text-pink-500" />
                             </button>
                             <button
                                className="w-14 h-14 bg-pink-100 border border-pink-300 rounded-xl flex items-center justify-center active:bg-pink-200 transition-colors shadow-sm"
                                onPointerDown={(e) => { e.preventDefault(); handleDirectionChange({ x: 0, y: 1 }); }}
                             >
                                <ChevronDown className="text-pink-500" />
                             </button>
                             <button
                                className="w-14 h-14 bg-pink-100 border border-pink-300 rounded-xl flex items-center justify-center active:bg-pink-200 transition-colors shadow-sm"
                                onPointerDown={(e) => { e.preventDefault(); handleDirectionChange({ x: 1, y: 0 }); }}
                             >
                                <ChevronRight className="text-pink-500" />
                             </button>
                        </div>
                    </div>

                    {/* Controls Hint */}
                    <div className="flex justify-between text-xs text-pink-400 uppercase font-bold tracking-widest px-2">
                        <div className="flex gap-4">
                            <span className="hidden lg:inline">↹ ARROWS TO MOVE</span>
                            <span className="lg:hidden">SWIPE TO MOVE</span>
                            <span>␣ SPACE TO PAUSE</span>
                        </div>
                        <div className="flex gap-4">
                             <span className={activePowerUp === 'GHOST' ? 'text-blue-500 animate-pulse font-black' : 'opacity-20'}>GHOST EGG</span>
                             <span className={activePowerUp === 'WRAP' ? 'text-purple-500 animate-pulse font-black' : 'opacity-20'}>PORTAL EGG</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Stats Dashboard (colspan 1) */}
                <div className="flex flex-col gap-4">
                    
                    {/* Score Card */}
                    <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <span className="text-xs font-bold text-pink-400 tracking-widest uppercase mb-2 block">Current Score</span>
                        <div className="text-5xl font-black text-[#ff4d6d] tabular-nums tracking-tight">
                            {score.toLocaleString()}
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-pink-500">
                            <Activity size={64} />
                        </div>
                    </div>

                    {/* High Score & Level */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white border border-pink-100 p-4 rounded-2xl shadow-sm flex justify-between items-center">
                            <div>
                                <span className="text-xs font-bold text-pink-400 tracking-widest uppercase mb-1 block">Best Record</span>
                                <div className="text-2xl font-bold text-gray-700 tabular-nums">{highScore.toLocaleString()}</div>
                            </div>
                            <Trophy className="text-[#ffccd5]" size={24} />
                        </div>

                        {/* Level Progress */}
                        <div className="bg-white border border-pink-100 p-4 rounded-2xl shadow-sm">
                            <div className="flex justify-between text-xs font-bold text-pink-400 mb-2">
                                <span>LEVEL DIFFICULTY</span>
                                <span>LVL.{getDifficultyLevel().toString().padStart(2, '0')}</span>
                            </div>
                            <div className="h-2 bg-pink-50 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#ff4d6d] shadow-sm transition-all duration-500 ease-out"
                                    style={{ width: `${difficultyPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-3">
                         <button 
                            onClick={gameState === 'PLAYING' ? togglePause : resetGame}
                            className="w-full py-4 bg-[#ff4d6d] hover:bg-[#ff758f] text-white font-black uppercase rounded-xl text-sm tracking-widest transition-all shadow-md shadow-pink-500/20 flex items-center justify-center gap-2"
                        >
                            {gameState === 'PLAYING' ? <Pause size={16} /> : <Play size={16} />}
                            {gameState === 'PLAYING' ? 'PAUSE GAME' : 'START GAME'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Game Over Modal Overlay */}
            {gameState === 'GAME_OVER' && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white border-2 border-pink-200 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                        
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-black italic text-[#ff4d6d] mb-2">
                                GAME OVER
                            </h2>
                            <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">Your snake hit a wall!</p>
                        </div>

                        {/* Score Comparison */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl text-center">
                                <div className="text-xs text-pink-400 font-bold uppercase mb-1">Final Score</div>
                                <div className="text-3xl font-black text-[#ff4d6d]">{score}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">
                                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Your Rank</div>
                                <div className="text-3xl font-black text-gray-600">#04</div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={resetGame}
                                className="py-3 bg-[#ff4d6d] hover:bg-[#ff758f] text-white font-bold uppercase rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30"
                            >
                                <RotateCcw size={16} /> Play Again
                            </button>
                            <button 
                                onClick={() => setGameState('START')} // Just reset to menu state really
                                className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold uppercase rounded-xl text-sm transition-colors"
                            >
                                Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SnakeGame;
