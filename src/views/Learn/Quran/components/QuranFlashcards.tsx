import React, { useState, useMemo } from 'react';
import { QuranEntry } from '../types';
import { TTSManager } from '../../../../services/tts.service';

interface QuranFlashcardsProps {
    items: QuranEntry[];
    onBack: () => void;
}

const QuranFlashcards: React.FC<QuranFlashcardsProps> = ({ items, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const deck = useMemo(() => {
        return [...items].sort(() => Math.random() - 0.5).slice(0, 20);
    }, [items]);

    const current = deck[currentIndex];

    const handleFlip = () => {
        if (!isFlipped) {
            if (TTSManager) TTSManager.speak(current.word, 'ar');
        }
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < deck.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            alert('Mål uppnått! / تم تحقيق الهدف! 🎉');
            onBack();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    if (!current) return null;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ color: 'var(--quran-gold)', textAlign: 'center', marginBottom: '0.5rem' }}>
                    {currentIndex + 1} / {deck.length}
                </div>
                <div style={{ height: '4px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: 'var(--quran-gold)', width: `${((currentIndex + 1) / deck.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div 
                className={`quran-flashcard ${isFlipped ? 'flipped' : ''}`} 
                onClick={handleFlip}
                style={{ height: '400px', perspective: '1000px', cursor: 'pointer' }}
            >
                <div className="fc-inner" style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'none'
                }}>
                    {/* Front */}
                    <div className="fc-front" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'rgba(6, 78, 59, 0.95)',
                        borderRadius: '30px',
                        padding: '2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px solid rgba(251, 191, 36, 0.3)'
                    }}>
                        <div style={{ fontSize: '1.1rem', color: 'var(--quran-gold)', position: 'absolute', top: '2rem' }}>{current.surah}</div>
                        <div style={{ fontSize: '4.5rem', color: 'white', fontWeight: 'bold', fontFamily: 'Amiri' }}>
                            {current.word}
                        </div>
                        <div style={{ marginTop: '3rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                            Klicka för att vända / اضغط للقلب
                        </div>
                    </div>

                    {/* Back */}
                    <div className="fc-back" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'rgba(15, 23, 42, 0.98)',
                        borderRadius: '30px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: 'rotateY(180deg)',
                        border: '2px solid var(--quran-gold)'
                    }}>
                        <div style={{ fontSize: '2.2rem', color: 'var(--quran-gold)', fontWeight: 'bold', marginBottom: '1.5rem', fontFamily: 'Amiri' }}>
                            {current.word}
                        </div>
                        <div style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>{current.word_sv}</div>
                        <div style={{ fontSize: '1.2rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' }}>{current.meaning_ar}</div>
                        
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', width: '100%', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', color: '#cbd5e1', fontStyle: 'italic', direction: 'rtl', fontFamily: 'Amiri' }}>{current.ayah_full}</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>{current.ayah_sv}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem' }}>
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    disabled={currentIndex === 0}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '60px', height: '60px', color: 'white', fontSize: '1.5rem', cursor: currentIndex === 0 ? 'default' : 'pointer', opacity: currentIndex === 0 ? 0.3 : 1 }}
                >
                    ❮
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    style={{ background: 'var(--quran-gold)', border: 'none', borderRadius: '50%', width: '60px', height: '60px', color: '#064e3b', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    ❯
                </button>
            </div>
            
            <button 
                onClick={onBack} 
                style={{ width: '100%', marginTop: '2rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
                Avsluta session
            </button>
        </div>
    );
};

export default QuranFlashcards;
