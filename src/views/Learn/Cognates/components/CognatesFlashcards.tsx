import React, { useState, useMemo } from 'react';
import { CognateEntry } from '../types';
import { TTSManager } from '../../../../tts';

interface CognatesFlashcardsProps {
    cognates: CognateEntry[];
    onComplete: (learnedWords: string[]) => void;
    onBack: () => void;
}

const CognatesFlashcards: React.FC<CognatesFlashcardsProps> = ({ cognates, onComplete, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learnedWords, setLearnedWords] = useState<string[]>([]);
    
    const deck = useMemo(() => {
        return [...cognates].sort(() => Math.random() - 0.5).slice(0, 20);
    }, [cognates]);

    const current = deck[currentIndex];

    const handleNext = (known: boolean) => {
        if (known) {
            setLearnedWords(prev => [...prev, current.swe]);
        }

        if (currentIndex < deck.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            onComplete([...learnedWords, ...(known ? [current.swe] : [])]);
        }
    };

    const handleFlip = () => {
        if (!isFlipped) {
            if (TTSManager) TTSManager.speak(current.swe, 'sv');
        }
        setIsFlipped(!isFlipped);
    };

    if (!current) return null;

    return (
        <div className="flashcard-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="flashcard-progress" style={{ marginBottom: '2rem' }}>
                <div className="progress-text" style={{ color: '#94a3b8', marginBottom: '0.5rem', textAlign: 'center' }}>
                    {currentIndex + 1} / {deck.length}
                </div>
                <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                        className="fill" 
                        style={{ 
                            height: '100%', 
                            background: '#3b82f6', 
                            width: `${((currentIndex + 1) / deck.length) * 100}%`,
                            transition: 'width 0.3s ease'
                        }} 
                    />
                </div>
            </div>

            <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
                onClick={handleFlip}
                style={{ 
                    height: '250px', 
                    perspective: '1000px', 
                    cursor: 'pointer',
                    position: 'relative'
                }}
            >
                <div className="flashcard-inner" style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'none'
                }}>
                    {/* Front */}
                    <div className="flashcard-front" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'rgba(30, 41, 59, 0.8)',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                        <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>
                            {current.swe}
                        </div>
                        {current.type && <div style={{ color: '#60a5fa', marginTop: '0.5rem' }}>{current.type}</div>}
                        <div style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                            Klicka för att vända / اضغط للقلب
                        </div>
                    </div>

                    {/* Back */}
                    <div className="flashcard-back" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'rgba(15, 23, 42, 0.9)',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        transform: 'rotateY(180deg)',
                        border: '1px solid #3b82f6'
                    }}>
                        <div style={{ fontSize: '2.2rem', color: '#3b82f6', fontWeight: 'bold', fontFamily: 'Tajawal' }}>
                            {current.arb}
                        </div>
                        <div style={{ marginTop: '1rem', color: '#94a3b8' }}>{current.category}</div>
                    </div>
                </div>
            </div>

            <div className="flashcard-controls" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                    onClick={() => handleNext(false)}
                    style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ❌ Inte än
                </button>
                <button 
                    onClick={() => handleNext(true)}
                    style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: '1px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ✅ Kan det!
                </button>
            </div>
            
            <button 
                onClick={onBack} 
                style={{ width: '100%', marginTop: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
                Avsluta session
            </button>
        </div>
    );
};

export default CognatesFlashcards;
