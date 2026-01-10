import React, { useState, useMemo } from 'react';
import { Proverb } from '../types';

interface OrdsprakFlashcardsProps {
    proverbs: Proverb[];
    onComplete: (learnedIds: number[]) => void;
    onBack: () => void;
}

const OrdsprakFlashcards: React.FC<OrdsprakFlashcardsProps> = ({ proverbs, onComplete, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learnedIds, setLearnedIds] = useState<number[]>([]);
    
    const deck = useMemo(() => {
        return [...proverbs].sort(() => Math.random() - 0.5).slice(0, 20);
    }, [proverbs]);

    const currentProverb = deck[currentIndex];

    const handleNext = (known: boolean) => {
        if (known) {
            setLearnedIds(prev => [...prev, currentProverb.id]);
        }

        if (currentIndex < deck.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            onComplete([...learnedIds, ...(known ? [currentProverb.id] : [])]);
        }
    };

    if (!currentProverb) return null;

    return (
        <div className="flashcard-container">
            <div className="flashcard-progress" style={{ marginBottom: '2rem' }}>
                <div className="progress-text" style={{ color: '#94a3b8', marginBottom: '0.5rem', textAlign: 'center' }}>
                    {currentIndex + 1} / {deck.length}
                </div>
                <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                        className="fill" 
                        style={{ 
                            height: '100%', 
                            background: '#fbbf24', 
                            width: `${((currentIndex + 1) / deck.length) * 100}%`,
                            transition: 'width 0.3s ease'
                        }} 
                    />
                </div>
            </div>

            <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ 
                    height: '300px', 
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
                    transformStyle: 'preserve-3d'
                }}>
                    {/* Front */}
                    <div className="flashcard-front" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'rgba(30, 41, 59, 0.8)',
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}>
                        <div className="flashcard-word" style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>
                            {currentProverb.swedishProverb}
                        </div>
                        <div className="flashcard-hint" style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
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
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        transform: 'rotateY(180deg)',
                        border: '1px solid #fbbf24'
                    }}>
                        <div className="flashcard-translation" style={{ fontSize: '1.4rem', color: '#fbbf24', marginBottom: '1rem' }}>
                            {currentProverb.arabicEquivalent}
                        </div>
                        <div className="flashcard-literal" style={{ fontSize: '1rem', color: '#94a3b8' }}>
                            {currentProverb.literalMeaning}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flashcard-controls" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                    className="fc-btn wrong" 
                    onClick={() => handleNext(false)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                >
                    ❌ Inte än
                </button>
                <button 
                    className="fc-btn correct" 
                    onClick={() => handleNext(true)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', cursor: 'pointer' }}
                >
                    ✅ Kan det!
                </button>
            </div>
            
            <button 
                onClick={onBack} 
                style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
                Avbryt
            </button>
        </div>
    );
};

export default OrdsprakFlashcards;
