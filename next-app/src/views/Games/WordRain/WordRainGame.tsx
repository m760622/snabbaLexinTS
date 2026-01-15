import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager } from '../../../utils/utils';
import '@/styles/games.css';

interface WordRainGameProps {
    onBack: () => void;
}

interface RainWord {
    swedish: string;
    arabic: string;
    x: number;
    y: number;
    speed: number;
    color: string;
}

const WordRainGame: React.FC<WordRainGameProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState<'start' | 'play' | 'end'>('start');
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(true);

    const wordsRef = useRef<RainWord[]>([]);
    const lastSpawnTimeRef = useRef(0);
    const spawnIntervalRef = useRef(2000);
    const allWordsRef = useRef<Word[]>([]);
    const animationIdRef = useRef<number | null>(null);

    // Initialize Data
    useEffect(() => {
        const loadData = async () => {
            const dataService = DataService.getInstance();
            await dataService.initialize();
            allWordsRef.current = await dataService.getAllWords();
            setLoading(false);
        };
        loadData();
    }, []);

    const spawnWord = useCallback(() => {
        const pool = allWordsRef.current.filter(w => w.swedish.length <= 10);
        if (pool.length === 0) return;

        const word = pool[Math.floor(Math.random() * pool.length)];
        const canvas = canvasRef.current;
        if (!canvas) return;

        const newRainWord: RainWord = {
            swedish: word.swedish,
            arabic: word.arabic,
            x: Math.random() * (canvas.width - 150) + 75,
            y: -40,
            speed: 1 + Math.random() * 1.5,
            color: `hsl(${Math.random() * 60 + 200}, 80%, 70%)`
        };
        wordsRef.current.push(newRainWord);
    }, []);

    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const now = Date.now();

        // Spawn logic
        if (now - lastSpawnTimeRef.current > spawnIntervalRef.current) {
            spawnWord();
            lastSpawnTimeRef.current = now;
            spawnIntervalRef.current = Math.max(800, spawnIntervalRef.current - 20);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and Draw words
        wordsRef.current = wordsRef.current.filter(word => {
            word.y += word.speed;
            word.x += Math.sin(word.y * 0.05) * 0.5;

            // Draw word
            ctx.font = 'bold 20px "Tajawal", sans-serif';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText(word.arabic, word.x, word.y);

            // Check if missed
            if (word.y > canvas.height + 20) {
                setLives(l => {
                    const next = l - 1;
                    if (next <= 0) setGameState('end');
                    return next;
                });
                HapticManager.error();
                return false;
            }
            return true;
        });

        if (gameState === 'play') {
            animationIdRef.current = requestAnimationFrame(gameLoop);
        }
    }, [spawnWord, gameState]);

    useEffect(() => {
        if (gameState === 'play') {
            animationIdRef.current = requestAnimationFrame(gameLoop);
        } else {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        }
        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        };
    }, [gameState, gameLoop]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase().trim();
        setUserInput(e.target.value);

        const matchIdx = wordsRef.current.findIndex(w => w.swedish.toLowerCase() === val);
        if (matchIdx !== -1) {
            const matchedWord = wordsRef.current[matchIdx];
            wordsRef.current.splice(matchIdx, 1);
            setScore(s => s + 10);
            setUserInput("");
            HapticManager.success();
            TTSManager.speak(matchedWord.swedish, 'sv');
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setGameState('play');
        wordsRef.current = [];
        lastSpawnTimeRef.current = Date.now();
        spawnIntervalRef.current = 2000;
    };

    if (loading) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', height: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ord-Regn</h2>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '5px' }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                        ))}
                    </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{score}</div>
            </header>

            <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={400} 
                    style={{ width: '100%', height: '100%', display: gameState === 'play' ? 'block' : 'none' }} 
                />

                {gameState === 'start' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                        <h1 style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }}>Ord-Regn</h1>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Skriv de svenska orden innan de faller ner!</p>
                        <button className="start-btn" onClick={startGame} style={{ padding: '1rem 3rem', fontSize: '1.5rem', borderRadius: '50px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Starta ▶</button>
                    </div>
                )}

                {gameState === 'play' && (
                    <div className="rain-input-container" style={{ position: 'absolute', bottom: '2rem', left: '1rem', right: '1rem' }}>
                        <input 
                            type="text" 
                            value={userInput}
                            onChange={handleInput}
                            placeholder="Skriv här..."
                            autoFocus
                            style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #3b82f6', background: 'rgba(30, 41, 59, 0.9)', color: 'white', fontSize: '1.5rem', textAlign: 'center', backdropFilter: 'blur(10px)' }}
                        />
                    </div>
                )}

                {gameState === 'end' && (
                    <div className="modal-overlay active">
                        <div className="modal-content" style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '3rem' }}>💀</h2>
                            <h3>Game Over</h3>
                            <div style={{ fontSize: '2rem', color: '#fbbf24', margin: '1rem 0' }}>Score: {score}</div>
                            <button className="modal-btn" onClick={startGame}>Spela igen</button>
                            <button className="modal-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={onBack}>Stäng</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WordRainGame;
