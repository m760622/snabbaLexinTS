import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, generateEducationalSentence } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '@/styles/hangman.css';

interface HangmanGameProps {
    onBack: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'.split('');
const MAX_LIVES = 6;
const HINT_COSTS = { first: 10, type: 5, example: 20 };

const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
    // Game State
    const [word, setWord] = useState<Word | null>(null);
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Stats & Inventory
    const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('hangman_coins') || '100'));
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('hangman_streak') || '0'));
    
    // UI State
    const [showHintType, setShowHintType] = useState(false);
    const [showHintExample, setShowHintExample] = useState(false);

    // Load Data and Start Game
    const startNewGame = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        // Filter for valid hangman words (A-Z only, reasonable length)
        const validWords = allWords.filter(w => 
            /^[a-zA-ZåäöÅÄÖ]+$/.test(w.swedish) && 
            w.swedish.length >= 4 && 
            w.swedish.length <= 10
        );

        const selected = SmartWordSelector.select(validWords.map(w => w.raw), 1)[0];
        const wordObj: Word = {
            id: selected[0],
            type: selected[1],
            swedish: selected[2].toUpperCase(),
            arabic: selected[3],
            example_swe: selected[7],
            example_arb: selected[8],
            raw: selected
        };

        setWord(wordObj);
        setGuessedLetters([]);
        setWrongGuesses(0);
        setGameOver(false);
        setGameWon(false);
        setShowHintType(false);
        setShowHintExample(false);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(wordObj.swedish.toLowerCase());
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    // Save persistent state
    useEffect(() => {
        localStorage.setItem('hangman_coins', coins.toString());
        localStorage.setItem('hangman_streak', streak.toString());
    }, [coins, streak]);

    const handleGuess = useCallback((letter: string) => {
        if (gameOver || guessedLetters.includes(letter) || !word) return;

        setGuessedLetters(prev => [...prev, letter]);

        if (word.swedish.includes(letter)) {
            HapticManager.light();
            const newGuessed = [...guessedLetters, letter];
            const isWon = word.swedish.split('').every(char => newGuessed.includes(char));
            if (isWon) {
                handleWin();
            }
        } else {
            HapticManager.error();
            const newWrong = wrongGuesses + 1;
            setWrongGuesses(newWrong);
            if (newWrong >= MAX_LIVES) {
                handleLose();
            }
        }
    }, [gameOver, guessedLetters, word, wrongGuesses]);

    const handleWin = () => {
        setGameOver(true);
        setGameWon(true);
        setStreak(s => s + 1);
        setCoins(c => c + 50);
        HapticManager.success();
        TTSManager.speak(word?.swedish || '', 'sv');
    };

    const handleLose = () => {
        setGameOver(true);
        setGameWon(false);
        setStreak(0);
        HapticManager.error();
    };

    const useHint = (type: 'first' | 'type' | 'example') => {
        const cost = HINT_COSTS[type];
        if (coins < cost || !word) return;

        if (type === 'first') {
            const first = word.swedish[0];
            if (!guessedLetters.includes(first)) {
                setCoins(c => c - cost);
                handleGuess(first);
            }
        } else if (type === 'type') {
            setCoins(c => c - cost);
            setShowHintType(true);
        } else if (type === 'example') {
            setCoins(c => c - cost);
            setShowHintExample(true);
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (ALPHABET.includes(key)) {
                handleGuess(key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleGuess]);

    if (loading || !word) return <div className="game-container">Laddar...</div>;

    const displayWord = word.swedish.split('').map(char => guessedLetters.includes(char) ? char : '_').join(' ');

    return (
        <div className="game-page-body" style={{ minHeight: '100vh', position: 'relative' }}>
            <div className="ambient-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <header>
                <button className="back-btn" onClick={onBack}>⬅️</button>
                <div className="header-stats">
                    <div className="stat-badge coins">🪙 {coins}</div>
                    <div className="stat-badge streak">🔥 {streak}</div>
                </div>
            </header>

            <div className="game-container">
                {/* Lives */}
                <div className="lives-bar">
                    {Array.from({ length: MAX_LIVES }).map((_, i) => (
                        <span key={i} className={`heart ${i >= (MAX_LIVES - wrongGuesses) ? 'lost' : ''}`}>❤️</span>
                    ))}
                </div>

                {/* Hangman SVG */}
                <div className="hangman-container">
                    <svg className="hangman-svg" viewBox="0 0 200 200">
                        <line x1="20" y1="190" x2="100" y2="190" stroke="white" strokeWidth="4" />
                        <line x1="60" y1="190" x2="60" y2="20" stroke="white" strokeWidth="4" />
                        <line x1="60" y1="20" x2="130" y2="20" stroke="white" strokeWidth="4" />
                        <line x1="130" y1="20" x2="130" y2="40" stroke="white" strokeWidth="4" />
                        
                        <circle className={`hangman-part ${wrongGuesses >= 1 ? 'visible' : ''}`} cx="130" cy="55" r="15" />
                        <line className={`hangman-part ${wrongGuesses >= 2 ? 'visible' : ''}`} x1="130" y1="70" x2="130" y2="120" />
                        <line className={`hangman-part ${wrongGuesses >= 3 ? 'visible' : ''}`} x1="130" y1="85" x2="100" y2="100" />
                        <line className={`hangman-part ${wrongGuesses >= 4 ? 'visible' : ''}`} x1="130" y1="85" x2="160" y2="100" />
                        <line className={`hangman-part ${wrongGuesses >= 5 ? 'visible' : ''}`} x1="130" y1="120" x2="100" y2="160" />
                        <line className={`hangman-part ${wrongGuesses >= 6 ? 'visible' : ''}`} x1="130" y1="120" x2="160" y2="160" />
                    </svg>
                </div>

                {/* Hint Area */}
                <div className="hint-area">
                    <div className="main-hint" style={{ direction: 'rtl', fontFamily: 'Tajawal' }}>
                        {word.arabic} {showHintType && `(${word.type})`}
                    </div>
                    {showHintExample && <div className="example-hint" style={{ fontSize: '0.9rem', color: '#aaa', textAlign: 'center' }}>{word.example_swe}</div>}
                    
                    <div className="extra-hints">
                        <button className="hint-chip" onClick={() => useHint('first')} disabled={coins < 10}>
                            Första (-10🪙)
                        </button>
                        <button className="hint-chip" onClick={() => useHint('type')} disabled={coins < 5 || showHintType}>
                            Typ (-5🪙)
                        </button>
                        <button className="hint-chip" onClick={() => useHint('example')} disabled={coins < 20 || showHintExample}>
                            Exempel (-20🪙)
                        </button>
                    </div>
                </div>

                {/* Word Display */}
                <div className="word-display" style={{ fontSize: '2rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}>
                    {displayWord}
                </div>

                {/* Keyboard */}
                {!gameOver && (
                    <div className="keyboard">
                        {ALPHABET.map(letter => {
                            const isUsed = guessedLetters.includes(letter);
                            const isCorrect = isUsed && word.swedish.includes(letter);
                            return (
                                <button 
                                    key={letter} 
                                    className={`key ${isUsed ? 'used' : ''} ${isCorrect ? 'correct' : isUsed ? 'wrong' : ''}`}
                                    onClick={() => handleGuess(letter)}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Result Overlay */}
                {gameOver && (
                    <div className="result-overlay visible">
                        <div className="result-emoji">{gameWon ? '🎉' : '😢'}</div>
                        <div className="result-text">{gameWon ? 'Bra jobbat!' : 'Förlust!'}</div>
                        <div className="result-word" style={{ fontSize: '2rem' }}>{word.swedish}</div>
                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-value">{gameWon ? '+50' : '0'}</div>
                                <div className="result-stat-label">Mynt</div>
                            </div>
                        </div>
                        <div className="result-actions">
                            <button className="action-btn primary" onClick={startNewGame}>Nästa ord</button>
                            <button className="action-btn secondary" onClick={onBack}>Meny</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HangmanGame;
