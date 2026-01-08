import React, { useState, useEffect } from 'react';
import { mistakesManager, MistakeEntry } from './mistakes-review';
import { TTSManager } from './tts';

export const MistakesView: React.FC = () => {
    const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);

    const loadMistakes = () => {
        setMistakes(mistakesManager.getMistakes());
    };

    useEffect(() => {
        loadMistakes();
        
        // Listen for changes (mistakesManager might be updated from outside React)
        const interval = setInterval(loadMistakes, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkLearned = (word: string) => {
        mistakesManager.markAsLearned(word);
        loadMistakes();
    };

    const handleSpeak = (word: string) => {
        TTSManager.speak(word, 'sv');
    };

    if (mistakes.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.glassContainer}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))' }}>🏆</div>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', lineHeight: 1.2 }}>
                        Great job! <br/>
                        <span style={{ color: '#10b981' }}>You have cleared all your mistakes.</span>
                    </h2>
                    <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '300px', margin: '0 auto' }}>
                        Keep playing to learn more words and expand your vocabulary.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h2 style={styles.title}>
                        <span style={{ marginRight: '10px' }}>🎯</span>
                        Mina Fel / مراجعة أخطائي
                    </h2>
                    <button 
                        style={styles.practiceBtn}
                        onClick={() => window.location.href = '/games/flashcards.html?mode=review'}
                    >
                        Practice Mistakes 🎯 تمرن على أخطائك
                    </button>
                </div>
                <div style={styles.badge}>{mistakes.length} ord</div>
            </div>

            <div style={styles.grid}>
                {mistakes.map((m) => {
                    const priorityScore = m.attempts * 20;
                    return (
                        <div key={m.word} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.wordInfo}>
                                    <div style={styles.swedish} onClick={() => handleSpeak(m.word)}>
                                        {m.word} <span style={{ fontSize: '1rem', cursor: 'pointer' }}>🔊</span>
                                    </div>
                                    <div dir="rtl" style={styles.translation}>{m.translation}</div>
                                </div>
                                <div style={{
                                    ...styles.priorityBadge,
                                    backgroundColor: priorityScore > 50 ? '#ef4444' : '#f59e0b'
                                }}>
                                    {priorityScore} pts
                                </div>
                            </div>

                            <div style={styles.cardFooter}>
                                <div style={styles.meta}>
                                    <span>❌ {m.attempts} missar</span>
                                    <span style={{ margin: '0 8px' }}>•</span>
                                    <span>🎮 {m.game}</span>
                                </div>
                                <button 
                                    style={styles.learnedBtn}
                                    onClick={() => handleMarkLearned(m.word)}
                                >
                                    ✅ I know this
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #333',
        paddingBottom: '16px'
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center'
    },
    badge: {
        background: '#3b82f6',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 'bold'
    },
    practiceBtn: {
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
        transition: 'transform 0.2s',
        textAlign: 'center'
    },
    grid: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
    },
    card: {
        background: '#1c1c1e',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 0.2s',
        position: 'relative',
        overflow: 'hidden'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    wordInfo: {
        flex: 1
    },
    swedish: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '4px',
        cursor: 'pointer'
    },
    translation: {
        fontSize: '1.1rem',
        color: '#aaa',
        fontFamily: '"Tajawal", sans-serif'
    },
    priorityBadge: {
        padding: '4px 8px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid #2c2c2e'
    },
    meta: {
        fontSize: '0.8rem',
        color: '#666'
    },
    learnedBtn: {
        background: '#10b981',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '10px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.2s'
    },
    emptyContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#888'
    },
    glassContainer: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '60px 30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        marginTop: '20px',
        animation: 'fadeIn 0.6s ease-out'
    }
};
