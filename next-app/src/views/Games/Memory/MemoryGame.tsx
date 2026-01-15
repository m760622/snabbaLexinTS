import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager } from '../../../utils/utils';
import '@/styles/memory.css';

interface MemoryGameProps {
    onBack: () => void;
}

interface Card {
    id: string;
    text: string;
    pairId: number;
    isArabic: boolean;
    isFlipped: boolean;
    isMatched: boolean;
    word: Word;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
    // Game State
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
    const [category, setCategory] = useState('all');
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(0);

    // Load Data and Start Game
    const startGame = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        let pool = allWords.filter(w => w.swedish && w.arabic);
        if (category !== 'all') {
            pool = pool.filter(w => w.type.toLowerCase().includes(category));
        }

        const count = difficulty === 'hard' ? 12 : 6;
        const selected = pool.sort(() => 0.5 - Math.random()).slice(0, count);

        const cardPairs: Card[] = [];
        selected.forEach((word, index) => {
            // Swedish Card
            cardPairs.push({
                id: `swe-${index}`,
                text: word.swedish,
                pairId: index,
                isArabic: false,
                isFlipped: false,
                isMatched: false,
                word
            });
            // Arabic Card
            cardPairs.push({
                id: `arb-${index}`,
                text: word.arabic,
                pairId: index,
                isArabic: true,
                isFlipped: false,
                isMatched: false,
                word
            });
        });

        setCards(cardPairs.sort(() => 0.5 - Math.random()));
        setFlippedIndices([]);
        setMoves(0);
        setScore(0);
        setTimer(0);
        setIsFinished(false);
        setLoading(false);
    }, [difficulty, category]);

    useEffect(() => {
        startGame();
    }, [startGame]);

    // Timer effect
    useEffect(() => {
        if (!loading && !isFinished) {
            const interval = setInterval(() => setTimer(t => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [loading, isFinished]);

    const handleCardClick = (index: number) => {
        if (loading || isFinished || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

        HapticManager.light();
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [idx1, idx2] = newFlipped;
            if (newCards[idx1].pairId === newCards[idx2].pairId) {
                // Match
                handleMatch(idx1, idx2);
            } else {
                // Mismatch
                setTimeout(() => {
                    const resetCards = [...newCards];
                    resetCards[idx1].isFlipped = false;
                    resetCards[idx2].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    const handleMatch = (idx1: number, idx2: number) => {
        HapticManager.success();
        const matchedCards = [...cards];
        matchedCards[idx1].isMatched = true;
        matchedCards[idx2].isMatched = true;
        setCards(matchedCards);
        setFlippedIndices([]);
        setScore(s => s + 100);
        
        TTSManager.speak(matchedCards[idx1].word.swedish, 'sv');

        if (matchedCards.every(c => c.isMatched)) {
            setIsFinished(true);
        }
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ minHeight: '100vh', position: 'relative', background: '#0f172a' }}>
            <header>
                <div className="header-nav">
                    <button className="back-btn" onClick={onBack}>⬅️</button>
                    <h1 className="game-title">Memory</h1>
                </div>
                <div className="stats-bar" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '1rem', display: 'flex', justifyContent: 'space-around', margin: '1rem' }}>
                    <div className="stat-item">
                        <div className="stat-label">Poäng</div>
                        <div className="stat-value">{score}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Drag</div>
                        <div className="stat-value">{moves}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Tid</div>
                        <div className="stat-value">{formatTime(timer)}</div>
                    </div>
                </div>
                <div className="controls-area" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
                    <div className="pill-group">
                        <button className={`pill ${difficulty === 'easy' ? 'active' : ''}`} onClick={() => setDifficulty('easy')}>Lätt</button>
                        <button className={`pill ${difficulty === 'hard' ? 'active' : ''}`} onClick={() => setDifficulty('hard')}>Svår</button>
                    </div>
                    <div className="pill-group">
                        <button className={`pill ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>Alla</button>
                        <button className={`pill ${category === 'substantiv' ? 'active' : ''}`} onClick={() => setCategory('substantiv')}>Namn</button>
                        <button className={`pill ${category === 'verb' ? 'active' : ''}`} onClick={() => setCategory('verb')}>Verb</button>
                    </div>
                </div>
            </header>

            <div className="game-board-container" style={{ padding: '1rem' }}>
                <div className="memory-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${difficulty === 'hard' ? 4 : 3}, 1fr)`,
                    gap: '10px'
                }}>
                    {cards.map((card, index) => (
                        <div 
                            key={card.id}
                            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                            onClick={() => handleCardClick(index)}
                            style={{ 
                                height: '100px',
                                perspective: '1000px',
                                cursor: 'pointer'
                            }}
                        >
                            <div className="face front" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
                            <div className="face back" style={{ 
                                background: card.isMatched ? 'rgba(34, 197, 94, 0.2)' : 'rgba(30, 41, 59, 0.9)',
                                border: card.isMatched ? '2px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '5px',
                                fontSize: card.text.length > 10 ? '0.8rem' : '1rem'
                            }}>
                                {card.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isFinished && (
                <div className="game-over-modal visible">
                    <div className="go-content">
                        <h2 className="go-title">Bra jobbat! 🎉</h2>
                        <div className="go-score">{score}</div>
                        <div className="go-stats">
                            <div className="go-stat">
                                <div className="go-stat-value">{moves}</div>
                                <div className="go-stat-label">Drag</div>
                            </div>
                            <div className="go-stat">
                                <div className="go-stat-value">{formatTime(timer)}</div>
                                <div className="go-stat-label">Tid</div>
                            </div>
                        </div>
                        <button className="restart-btn" onClick={startGame}>Spela igen</button>
                        <button className="restart-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={onBack}>Meny</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
