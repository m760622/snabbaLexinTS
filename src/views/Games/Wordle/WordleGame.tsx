import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '../../../../assets/css/games.css';

interface WordleGameProps {
    onBack: () => void;
}

const MAX_GUESSES = 6;
const KEYBOARD_ROWS = [
    'QWERTYUIOPÅ'.split(''),
    'ASDFGHJKLÖÄ'.split(''),
    ['ENTER', ...'ZXCVBNM'.split(''), '⌫']
];

const WordleGame: React.FC<WordleGameProps> = ({ onBack }) => {
    const [difficulty, setDifficulty] = useState<4 | 5 | 6>(5);
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('wordle_streak') || '0'));

    const startNewGame = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        const validWords = allWords.filter(w => 
            w.swedish.length === difficulty && 
            /^[a-zA-ZåäöÅÄÖ]+$/.test(w.swedish) &&
            !w.swedish.includes(' ') &&
            !w.swedish.includes('-')
        );

        const selected = SmartWordSelector.select(validWords.map(w => w.raw), 1)[0];
        setTargetWord(selected[2].toUpperCase());
        setGuesses([]);
        setCurrentGuess('');
        setGameOver(false);
        setGameWon(false);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(selected[2].toLowerCase());
    }, [difficulty]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        localStorage.setItem('wordle_streak', streak.toString());
    }, [streak]);

    const handleSubmit = useCallback(() => {
        if (currentGuess.length !== difficulty || gameOver) return;

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === targetWord) {
            setGameOver(true);
            setGameWon(true);
            setStreak(s => s + 1);
            HapticManager.success();
            showToast('Grattis! 🎉 / تهانينا!');
            TTSManager.speak(targetWord, 'sv');
        } else if (newGuesses.length >= MAX_GUESSES) {
            setGameOver(true);
            setGameWon(false);
            setStreak(0);
            HapticManager.error();
            showToast(`Ordet var: ${targetWord}`, 'error');
        } else {
            HapticManager.light();
        }
    }, [currentGuess, difficulty, gameOver, guesses, targetWord]);

    const handleInput = useCallback((key: string) => {
        if (gameOver) return;

        if (key === 'ENTER') {
            handleSubmit();
        } else if (key === '⌫' || key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < difficulty && /^[A-ZÅÄÖ]$/.test(key)) {
            setCurrentGuess(prev => prev + key);
        }
    }, [currentGuess, difficulty, gameOver, handleSubmit]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (key === 'ENTER') handleInput('ENTER');
            else if (key === 'BACKSPACE') handleInput('⌫');
            else if (/^[A-ZÅÄÖ]$/.test(key)) handleInput(key);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleInput]);

    // Letter feedback logic
    const getLetterState = (letter: string) => {
        let state: 'correct' | 'present' | 'absent' | 'none' = 'none';
        
        guesses.forEach(guess => {
            guess.split('').forEach((char, i) => {
                if (char !== letter) return;
                
                if (targetWord[i] === char) {
                    state = 'correct';
                } else if (targetWord.includes(char) && state !== 'correct') {
                    state = 'present';
                } else if (state === 'none') {
                    state = 'absent';
                }
            });
        });
        
        return state;
    };

    if (loading) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ minHeight: '100vh', background: '#0f172a', padding: '1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#fbbf24', margin: 0 }}>Ordpussel</h2>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Streak: 🔥 {streak}</div>
                </div>
                <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(parseInt(e.target.value) as any)}
                    style={{ background: '#1e293b', color: 'white', border: '1px solid #333', borderRadius: '8px', padding: '5px' }}
                >
                    <option value={4}>Lätt (4)</option>
                    <option value={5}>Medel (5)</option>
                    <option value={6}>Svår (6)</option>
                </select>
            </header>

            <div className="wordle-grid" style={{ 
                display: 'grid', 
                gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)`, 
                gap: '5px',
                maxWidth: '300px',
                margin: '0 auto 2rem auto'
            }}>
                {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${difficulty}, 1fr)`, gap: '5px' }}>
                        {Array.from({ length: difficulty }).map((_, colIndex) => {
                            const guess = guesses[rowIndex];
                            const char = guess ? guess[colIndex] : (rowIndex === guesses.length ? currentGuess[colIndex] : '');
                            
                            let bgColor = 'rgba(255,255,255,0.05)';
                            let borderColor = 'rgba(255,255,255,0.1)';
                            
                            if (guess) {
                                if (targetWord[colIndex] === char) {
                                    bgColor = '#22c55e'; // correct
                                } else if (targetWord.includes(char)) {
                                    bgColor = '#eab308'; // present
                                } else {
                                    bgColor = '#334155'; // absent
                                }
                                borderColor = 'transparent';
                            } else if (rowIndex === guesses.length && char) {
                                borderColor = '#60a5fa';
                            }

                            return (
                                <div key={colIndex} style={{
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: '4px',
                                    transition: 'all 0.2s'
                                }}>
                                    {char}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="wordle-keyboard" style={{ display: 'grid', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
                {KEYBOARD_ROWS.map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                        {row.map(key => {
                            const state = getLetterState(key);
                            let bg = '#1e293b';
                            if ((state as any) === 'correct') bg = '#22c55e';
                            else if ((state as any) === 'present') bg = '#eab308';
                            else if ((state as any) === 'absent') bg = '#334155';

                            return (
                                <button 
                                    key={key}
                                    onClick={() => handleInput(key)}
                                    style={{
                                        minWidth: key.length > 1 ? '50px' : '30px',
                                        height: '45px',
                                        padding: '0 5px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: bg,
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        fontSize: key.length > 1 ? '0.7rem' : '1rem'
                                    }}
                                >
                                    {key}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {gameOver && (
                <div className="modal-overlay active" style={{ zIndex: 1000 }}>
                    <div className="modal-content" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3rem', margin: '0' }}>{gameWon ? '🎉' : '😢'}</h2>
                        <h3>{gameWon ? 'Snyggt jobbat!' : 'Bättre lycka nästa gång'}</h3>
                        <div style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#fbbf24', fontWeight: 'bold' }}>{targetWord}</div>
                        <button className="modal-btn" onClick={startNewGame}>Spela igen</button>
                        <button className="modal-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={onBack}>Meny</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordleGame;
