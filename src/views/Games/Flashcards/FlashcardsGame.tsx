import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LeitnerService } from '../../../services/leitner.service';
import { TTSManager } from '../../../services/tts.service';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { HapticManager } from '../../../utils/utils';

interface FlashcardsGameProps {
    onBack: () => void;
    mode?: 'normal' | 'review';
}

const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ onBack, mode = 'normal' }) => {
    const [cards, setCards] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [autoplay, setAutoplay] = useState(localStorage.getItem('fc_autoplay') !== 'false');
    const [swipeDiff, setSwipeDiff] = useState(0);
    const [animating, setAnimating] = useState<'left' | 'right' | null>(null);

    const touchStartX = useRef(0);

    // Initialize Game
    useEffect(() => {
        const initGame = async () => {
            const dataService = DataService.getInstance();
            await dataService.initialize();
            let allWords = await dataService.getAllWords();

            let pool: Word[] = [];

            if (mode === 'review') {
                // Implement review logic (fetching from mistakesManager if needed, or due Leitner items)
                // For now, let's fetch Leitner due items
                const dueIds = new Set(LeitnerService.getDueWords());
                pool = allWords.filter(w => dueIds.has(w.id.toString()));
                if (pool.length === 0) {
                    alert("Inga ord att repetera just nu! / لا توجد كلمات للمراجعة الآن!");
                    onBack();
                    return;
                }
            } else {
                // Normal mode: Sort by Leitner box (lowest first)
                pool = [...allWords].sort((a, b) => {
                    const boxA = LeitnerService.getWordBox(a.id.toString());
                    const boxB = LeitnerService.getWordBox(b.id.toString());
                    return boxA - boxB;
                });
            }

            // Pick top 20
            setCards(pool.slice(0, 20));
            setLoading(false);
        };

        initGame();
    }, [mode, onBack]);

    // Autoplay effect
    useEffect(() => {
        if (!loading && cards[currentIndex] && autoplay && !isFinished && !isFlipped) {
            const timer = setTimeout(() => {
                TTSManager.speak(cards[currentIndex].swedish, 'sv');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, loading, autoplay, isFinished, isFlipped, cards]);

    const currentCard = cards[currentIndex];
    const progress = Math.round(((currentIndex) / cards.length) * 100);

    const handleRating = (rating: number) => {
        if (!currentCard) return;

        // Animate
        setAnimating(rating >= 3 ? 'right' : 'left');
        if (rating >= 3) HapticManager.success();
        else HapticManager.error();

        setTimeout(() => {
            // Process Logic
            if (rating >= 3) {
                LeitnerService.promoteWord(currentCard.id.toString());
                setScore(s => s + 1);
            } else {
                LeitnerService.demoteWord(currentCard.id.toString());
            }

            // Next Card
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(i => i + 1);
                setIsFlipped(false);
                setAnimating(null);
            } else {
                setIsFinished(true);
            }
        }, 300);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        HapticManager.selection();
    };

    // Touch Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const diff = e.touches[0].clientX - touchStartX.current;
        setSwipeDiff(diff);
    };

    const handleTouchEnd = () => {
        if (swipeDiff > 100) handleRating(4); // Right swipe (Know)
        else if (swipeDiff < -100) handleRating(0); // Left swipe (Don't Know)
        setSwipeDiff(0);
    };

    const toggleAutoplay = () => {
        const newVal = !autoplay;
        setAutoplay(newVal);
        localStorage.setItem('fc_autoplay', String(newVal));
        HapticManager.light();
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>Laddar...</div>;

    if (isFinished) {
        const percent = Math.round((score / cards.length) * 100);
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '💪'}</div>
                <h2>Session Slutförd!</h2>
                <p style={{ fontSize: '1.2rem', color: '#ccc' }}>Du klarade {score} av {cards.length} ord.</p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={onBack} style={styles.actionBtn}>Meny</button>
                    <button onClick={() => window.location.reload()} style={{...styles.actionBtn, background: '#3b82f6'}}>Spela igen</button>
                </div>
            </div>
        );
    }

    const box = LeitnerService.getWordBox(currentCard.id.toString());
    const boxIcon = LeitnerService.getBoxIcon(box);

    const cardStyle: React.CSSProperties = {
        ...styles.card,
        transform: `translateX(${swipeDiff}px) rotate(${swipeDiff * 0.05}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`,
        opacity: Math.max(0.5, 1 - Math.abs(swipeDiff) / 500),
        transition: swipeDiff === 0 ? 'transform 0.3s ease, opacity 0.3s' : 'none'
    };

    if (animating === 'right') cardStyle.transform = 'translateX(500px) rotate(30deg)';
    if (animating === 'left') cardStyle.transform = 'translateX(-500px) rotate(-30deg)';

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <button onClick={onBack} style={styles.iconBtn}>⬅️</button>
                <div style={styles.progressRing}>
                    <span>{currentIndex + 1}/{cards.length}</span>
                </div>
                <button onClick={toggleAutoplay} style={styles.iconBtn}>{autoplay ? '🔊' : '🔇'}</button>
            </div>

            {/* Mastery Badge */}
            <div style={styles.masteryBadge}>{boxIcon} Box {box}</div>

            {/* Card Area */}
            <div style={styles.cardArea}>
                <div 
                    style={cardStyle}
                    onClick={handleFlip}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div style={styles.cardFront}>
                        <span style={styles.typeBadge}>{currentCard.type}</span>
                        <h1 style={styles.word}>{currentCard.swedish}</h1>
                        <p style={styles.hint}>Tryck för att vända / اضغط للقلب</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); TTSManager.speak(currentCard.swedish, 'sv'); }}
                            style={styles.speakerBtn}
                        >🔊</button>
                    </div>
                    <div style={styles.cardBack}>
                        <h2 style={styles.wordBack}>{currentCard.swedish}</h2>
                        <div style={styles.divider}></div>
                        <h2 style={styles.translation}>{currentCard.arabic}</h2>
                        {currentCard.example_swe && <p style={styles.example}>{currentCard.example_swe}</p>}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={styles.controls}>
                <button style={styles.wrongBtn} onClick={() => handleRating(0)}>
                    ❌ Inte än
                </button>
                <button style={styles.correctBtn} onClick={() => handleRating(4)}>
                    ✅ Kan det
                </button>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', boxSizing: 'border-box', color: 'white' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    iconBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', fontSize: '1.2rem', cursor: 'pointer' },
    progressRing: { fontSize: '0.9rem', color: '#aaa' },
    masteryBadge: { textAlign: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.1)', alignSelf: 'center', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem' },
    cardArea: { flex: 1, position: 'relative', perspective: '1000px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    card: {
        width: '100%',
        maxWidth: '350px',
        height: '400px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        cursor: 'pointer'
    },
    cardFront: {
        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
        background: 'rgba(30, 41, 59, 0.9)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box'
    },
    cardBack: {
        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
        background: 'rgba(15, 23, 42, 0.95)', borderRadius: '24px', border: '1px solid #3b82f6',
        transform: 'rotateY(180deg)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box'
    },
    typeBadge: { position: 'absolute', top: '1.5rem', fontSize: '0.8rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px' },
    word: { fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' },
    hint: { color: '#64748b', fontSize: '0.9rem', marginTop: '2rem' },
    speakerBtn: { position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
    wordBack: { fontSize: '1.5rem', color: '#ccc' },
    translation: { fontSize: '2rem', color: '#3b82f6', margin: '1rem 0' },
    example: { fontSize: '0.9rem', color: '#888', fontStyle: 'italic', textAlign: 'center' },
    divider: { width: '50px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' },
    controls: { display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '1rem' },
    wrongBtn: { flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 'bold', fontSize: '1rem' },
    correctBtn: { flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: 'bold', fontSize: '1rem' },
    actionBtn: { padding: '0.8rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }
};

export default FlashcardsGame;
