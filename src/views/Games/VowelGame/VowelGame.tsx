import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { minimalPairsData, MinimalPair } from '../../../data/vowelGameData';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager } from '../../../utils/utils';
import '../../../../assets/css/vowel_game.css';

interface VowelGameProps {
    onBack: () => void;
}

const VOWELS = ['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö'];
const LEVELS_PER_STAGE = 7;

const VowelGame: React.FC<VowelGameProps> = ({ onBack }) => {
    const [view, setView] = useState<'start' | 'play' | 'end'>('start');
    const [currentStage, setCurrentStage] = useState(() => parseInt(localStorage.getItem('vowelGameStage') || '1'));
    const [currentLevel, setCurrentLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [currentPair, setCurrentPair] = useState<MinimalPair | null>(null);
    const [currentTarget, setCurrentTarget] = useState<1 | 2>(1);
    const [solvedStatus, setSolvedStatus] = useState({ 1: false, 2: false });
    const [isFlipped, setIsFlipped] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const getNextPair = useCallback(() => {
        const available = minimalPairsData;
        return available[Math.floor(Math.random() * available.length)];
    }, []);

    const loadLevel = useCallback(() => {
        const pair = getNextPair();
        setCurrentPair(pair);
        setCurrentTarget(1);
        setSolvedStatus({ 1: false, 2: false });
        setIsFlipped(false);
        setIsProcessing(false);
        setCountdown(null);
    }, [getNextPair]);

    const startGame = () => {
        setView('play');
        setLives(3);
        setScore(0);
        setStreak(0);
        setCurrentLevel(1);
        loadLevel();
    };

    const handleAnswer = (selectedVowel: string) => {
        if (isProcessing || !currentPair) return;

        const expectedVowel = currentTarget === 1 ? currentPair.pair[0] : currentPair.pair[1];

        if (selectedVowel.toUpperCase() === expectedVowel.toUpperCase()) {
            HapticManager.success();
            const newStatus = { ...solvedStatus, [currentTarget]: true };
            setSolvedStatus(newStatus);
            
            const word = currentTarget === 1 ? currentPair.w1 : currentPair.w2;
            TTSManager.speak(word, 'sv');

            if (newStatus[1] && newStatus[2]) {
                handleLevelComplete();
            } else {
                setCurrentTarget(currentTarget === 1 ? 2 : 1);
            }
            setStreak(s => s + 1);
            setScore(s => s + 100);
        } else {
            HapticManager.error();
            setLives(l => l - 1);
            setStreak(0);
            if (lives <= 1) {
                setView('end');
            }
        }
    };

    const handleLevelComplete = () => {
        setIsProcessing(true);
        setTimeout(() => setIsFlipped(true), 500);
        
        setTimeout(() => {
            setCountdown(3);
        }, 1500);
    };

    useEffect(() => {
        if (countdown !== null) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                if (currentLevel < LEVELS_PER_STAGE) {
                    setCurrentLevel(l => l + 1);
                } else {
                    setCurrentStage(s => {
                        const next = s + 1;
                        localStorage.setItem('vowelGameStage', next.toString());
                        return next;
                    });
                    setCurrentLevel(1);
                }
                loadLevel();
            }
        }
    }, [countdown, currentLevel, loadLevel]);

    const options = useMemo(() => {
        if (!currentPair) return [];
        const correct = currentPair.pair;
        const distractors = VOWELS.filter(v => !correct.includes(v))
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        return [...correct, ...distractors].sort(() => 0.5 - Math.random());
    }, [currentPair]);

    if (view === 'start') {
        return (
            <div className="game-page-body" style={{ background: '#0f172a', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: '2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#38bdf8' }}>Svenska Vokaler</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Lär dig skillnaden mellan svenska vokaler</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
                    {['A', 'O', 'U', 'Å', 'Ä', 'Ö'].map(v => (
                        <button key={v} onClick={() => TTSManager.speak(v, 'sv')} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #38bdf8', background: 'transparent', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer' }}>{v}</button>
                    ))}
                </div>
                <button className="start-btn" onClick={startGame} style={{ padding: '1rem 3rem', fontSize: '1.5rem', borderRadius: '50px', background: '#38bdf8', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Börja Spela ▶</button>
                <button onClick={onBack} style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    if (view === 'end') {
        return (
            <div className="game-page-body" style={{ background: '#0f172a', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem' }}>💀</h1>
                <h2>Game Over</h2>
                <p style={{ fontSize: '1.5rem', color: '#fbbf24', margin: '1rem 0' }}>Score: {score}</p>
                <button className="start-btn" onClick={startGame} style={{ padding: '1rem 2rem', borderRadius: '12px', background: '#38bdf8', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Försök igen</button>
                <button onClick={onBack} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Meny</button>
            </div>
        );
    }

    const renderWord = (pair: MinimalPair, slot: 1 | 2) => {
        const isSolved = solvedStatus[slot];
        const isActive = currentTarget === slot && !isSolved;
        const text = isSolved ? (slot === 1 ? pair.w1 : pair.w2) : (slot === 1 ? pair.w1 : pair.w2).replace(new RegExp(pair.pair[slot-1], 'i'), '_');
        
        return (
            <div className={`word-item ${isActive ? 'active-target' : ''} ${isSolved ? 'solved' : ''}`} style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: isActive ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{slot === 1 ? pair.e1 : pair.e2}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{text}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>{slot === 1 ? pair.d1 : pair.d2}</div>
                <button onClick={() => TTSManager.speak(slot === 1 ? pair.w1 : pair.w2, 'sv')} style={{ background: 'none', border: 'none', color: '#38bdf8', marginTop: '1rem', cursor: 'pointer' }}>🔊</button>
            </div>
        );
    };

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.9)' }}>
                <button onClick={() => setView('start')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white' }}>⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Stage {currentStage} • Level {currentLevel}/7</div>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '5px' }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                        ))}
                    </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{score}</div>
            </header>

            <div className="progress-container" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ height: '100%', background: '#38bdf8', width: `${((currentLevel-1)/7 + (currentStage-1)/10)*100}%`, transition: 'width 0.3s' }} />
            </div>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', justifyContent: 'center' }}>
                {currentPair && (
                    <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`} style={{ perspective: '1000px', height: '300px' }}>
                        <div className="flipper-inner" style={{ position: 'relative', width: '100%', height: '100%', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
                            {/* Front */}
                            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', gap: '1rem' }}>
                                {renderWord(currentPair, 1)}
                                {renderWord(currentPair, 2)}
                            </div>
                            {/* Back */}
                            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(30, 41, 59, 0.95)', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>"{currentPair.s1}"</div>
                                <div style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>"{currentPair.s2}"</div>
                            </div>
                        </div>
                    </div>
                )}

                {!isProcessing && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '2rem', flexWrap: 'wrap' }}>
                        {options.map(v => (
                            <button 
                                key={v}
                                onClick={() => handleAnswer(v)}
                                style={{
                                    width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold',
                                    cursor: 'pointer', transition: 'transform 0.1s'
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                )}

                {countdown !== null && (
                    <div className="inline-countdown" style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#38bdf8', marginTop: '2rem' }}>
                        {countdown > 0 ? countdown : 'GO!'}
                    </div>
                )}
            </main>
        </div>
    );
};

export default VowelGame;
