import React, { useState, useMemo } from 'react';
import { AsmaName } from '../types';
import { TTSManager } from '../../../../tts';

interface AsmaFlashcardsProps {
    names: AsmaName[];
    onComplete: (memorizedIds: number[]) => void;
    onBack: () => void;
}

const AsmaFlashcards: React.FC<AsmaFlashcardsProps> = ({ names, onComplete, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [memorizedIds, setMemorizedIds] = useState<number[]>([]);
    
    const deck = useMemo(() => {
        return [...names].sort(() => Math.random() - 0.5);
    }, [names]);

    const current = deck[currentIndex];

    const handleNext = (known: boolean) => {
        if (known) {
            setMemorizedIds(prev => [...prev, current.nr]);
        }

        if (currentIndex < deck.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            onComplete([...memorizedIds, ...(known ? [current.nr] : [])]);
        }
    };

    const handleFlip = () => {
        if (!isFlipped) {
            if (TTSManager) TTSManager.speak(current.nameAr, 'ar');
        }
        setIsFlipped(!isFlipped);
    };

    if (!current) return null;

    return (
        <div className="flashcard-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="flashcard-progress" style={{ marginBottom: '2rem' }}>
                <div style={{ color: '#fbbf24', textAlign: 'center', marginBottom: '0.5rem' }}>
                    {currentIndex + 1} / {deck.length}
                </div>
                <div style={{ height: '4px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: '#fbbf24', width: `${((currentIndex + 1) / deck.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
                onClick={handleFlip}
                style={{ height: '350px', perspective: '1000px', cursor: 'pointer' }}
            >
                <div className="flashcard-inner" style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
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
                        background: 'rgba(30, 41, 59, 0.9)',
                        borderRadius: '30px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px solid rgba(251, 191, 36, 0.4)',
                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)'
                    }}>
                        <div style={{ fontSize: '1.2rem', color: '#fbbf24', position: 'absolute', top: '2rem' }}>{current.nr}</div>
                        <div style={{ fontSize: '4rem', color: 'white', fontWeight: 'bold', fontFamily: 'Amiri' }}>
                            {current.nameAr}
                        </div>
                        <div style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                            Klicka för att se betydelsen
                        </div>
                    </div>

                    {/* Back */}
                    <div className="flashcard-back" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '30px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: 'rotateY(180deg)',
                        border: '2px solid #fbbf24'
                    }}>
                        <div style={{ fontSize: '2.5rem', color: '#fbbf24', fontWeight: 'bold', marginBottom: '1rem' }}>
                            {current.nameAr}
                        </div>
                        <div style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>{current.nameSv}</div>
                        <div style={{ fontSize: '1.1rem', color: '#94a3b8', textAlign: 'center' }}>{current.meaningAr}</div>
                        <div style={{ fontSize: '1rem', color: '#cbd5e1', textAlign: 'center', marginTop: '0.5rem' }}>{current.meaningSv}</div>
                    </div>
                </div>
            </div>

            <div className="flashcard-controls" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                    onClick={() => handleNext(false)}
                    style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ❌ لا أعرف
                </button>
                <button 
                    onClick={() => handleNext(true)}
                    style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', border: '1px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ✅ أعرفها
                </button>
            </div>
            
            <button 
                onClick={onBack} 
                style={{ width: '100%', marginTop: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
                رجوع للقائمة
            </button>
        </div>
    );
};

export default AsmaFlashcards;
