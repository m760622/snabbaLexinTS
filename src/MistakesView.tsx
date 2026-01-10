import React, { useState, useEffect } from 'react';
import { mistakesManager, MistakeEntry } from './mistakes-review';
import { TTSManager } from './tts';
import { HapticManager } from './utils';

const MistakeCard = ({ entry, onLearned, onSpeak }: { entry: MistakeEntry, onLearned: (w: string) => void, onSpeak: (w: string) => void }) => {
    return (
        <div className="card compact-card premium-card" style={{ 
            marginBottom: '12px', 
            borderLeft: '7px solid #ef4444',
            background: 'rgba(28, 28, 30, 0.6)',
            backdropFilter: 'blur(10px)',
            padding: '12px 16px',
            minHeight: 'auto',
            height: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="grammar-badge" style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.65rem' }}>
                    MISSTAG ({entry.attempts}x)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-button audio-btn" onClick={() => onSpeak(entry.word)} style={{ color: '#ef4444', width: '28px', height: '28px', minWidth: '28px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                    <button className="action-button learned-btn" onClick={() => onLearned(entry.word)} style={{ color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', width: '28px', height: '28px', minWidth: '28px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div className="word-swe" style={{ fontSize: '1.1rem', color: '#fff' }}>{entry.word}</div>
                <div className="word-arb" dir="rtl" style={{ fontSize: '1rem', color: '#fff', opacity: 0.9 }}>{entry.translation}</div>
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>Från: {entry.game}</div>
            </div>
        </div>
    );
};

export const MistakesView: React.FC = () => {
    const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const loadMistakes = () => {
        const realMistakes = mistakesManager.getMistakes();
        // DEMO MODE: If empty, show one mock mistake to match design
        if (realMistakes.length === 0) {
            setMistakes([{
                word: 'Snabba Lexin',
                translation: 'القاموس السريع',
                game: 'Demo',
                attempts: 1,
                timestamp: Date.now()
            }]);
        } else {
            setMistakes(realMistakes);
        }
    };

    useEffect(() => {
        loadMistakes();
        // Removed interval for better performance
    }, []);

    const handleMarkLearned = (word: string) => {
        HapticManager.medium();
        if (word === 'Snabba Lexin') return; // Don't delete demo
        mistakesManager.markAsLearned(word);
        loadMistakes();
    };

    const handleSpeak = (word: string) => {
        HapticManager.light();
        TTSManager.speak(word, 'sv');
    };

    // Removed the early return null
    // if (mistakes.length === 0) return null;

    if (!isExpanded) {
        return (
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => { HapticManager.light(); setIsExpanded(true); }}
                    style={{
                        width: '100%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '18px',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#fff',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>🎯</span>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '800', fontSize: '1rem' }}>Mina Fel ({mistakes.length})</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Öva på ord du missat</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#ef4444' }}>Visa</span>
                </button>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '25px', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Mina Fel</h3>
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{mistakes.length}</span>
                </div>
                <button 
                    onClick={() => { HapticManager.light(); setIsExpanded(false); }}
                    style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    Dölj
                </button>
            </div>

            <button 
                onClick={() => { HapticManager.medium(); window.location.href = 'games/flashcards.html?mode=review'; }}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                }}
            >
                Starta Snabb-Repetition 🎯
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mistakes.slice(0, 5).map(m => (
                    <MistakeCard key={m.word} entry={m} onLearned={handleMarkLearned} onSpeak={handleSpeak} />
                ))}
                {mistakes.length > 5 && (
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                        + {mistakes.length - 5} fler misstag...
                    </div>
                )}
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
    expandToggleBtn: {
        width: '100%',
        background: 'rgba(251, 191, 36, 0.1)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    collapseBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#8e8e93',
        border: 'none',
        padding: '4px 12px',
        borderRadius: '8px',
        fontSize: '0.75rem',
        cursor: 'pointer'
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
