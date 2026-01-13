import React, { useState, useEffect } from 'react';
import { HapticManager } from '../utils/utils';

interface SentenceBuilderProps {
    sentence: string;
    translation?: string;
    color: string;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ sentence, translation, color }) => {
    const [words, setWords] = useState<{ id: number, text: string }[]>([]);
    const [userOrder, setUserOrder] = useState<{ id: number, text: string }[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (sentence) {
            resetGame();
        }
    }, [sentence]);

    const resetGame = () => {
        // Remove punctuation for easier matching, but keep for display if needed? 
        // For simplicity, let's keep words as is but maybe strip trailing commas/periods for the logic if strict.
        // Actually, users usually expect to see the full sentence. Let's just split by space.
        const cleanSentence = sentence.replace(/[.,!?;:]/g, ''); // Simple strip for the parts
        const parts = sentence.split(' ').map((text, index) => ({ id: index, text }));

        // Fisher-Yates shuffle
        const shuffled = [...parts];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setWords(shuffled);
        setUserOrder([]);
        setIsSuccess(false);
    };

    const handleWordClick = (word: { id: number, text: string }, fromBank: boolean) => {
        HapticManager.light();
        if (isSuccess) return;

        if (fromBank) {
            setWords(prev => prev.filter(w => w.id !== word.id));
            setUserOrder(prev => [...prev, word]);
        } else {
            setUserOrder(prev => prev.filter(w => w.id !== word.id));
            setWords(prev => [...prev, word]);
        }
    };

    useEffect(() => {
        if (userOrder.length > 0 && words.length === 0) {
            checkAnswer();
        }
    }, [userOrder, words]);

    const checkAnswer = () => {
        const currentSentence = userOrder.map(w => w.text).join(' ');
        if (currentSentence === sentence) {
            setIsSuccess(true);
            HapticManager.success();
        } else {
            setIsShaking(true);
            HapticManager.error();
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    if (!sentence) return null;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '16px',
            border: `1px solid ${color}20`,
            marginTop: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>🧩</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>بناء الجمل (Mening Byggare)</span>
            </div>

            {/* Success Overlay */}
            {isSuccess && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    zIndex: 10, backdropFilter: 'blur(2px)', animation: 'fadeIn 0.3s'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
                    <div style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '1.2rem' }}>أحسنت! إجابة صحيحة</div>
                    <button onClick={resetGame} style={{
                        marginTop: '15px', padding: '8px 20px', borderRadius: '20px',
                        background: color, border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
                    }}>إعادة</button>
                </div>
            )}

            {/* Answer Area */}
            <div style={{
                minHeight: '60px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                padding: '10px',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                border: isShaking ? '1px solid #ff4444' : isSuccess ? '1px solid #4CAF50' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
                animation: isShaking ? 'shake 0.4s ease-in-out' : 'none'
            }}>
                {userOrder.length === 0 && (
                    <div style={{ width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', marginTop: '10px' }}>
                        اضغط على الكلمات لترتيبها...
                    </div>
                )}
                {userOrder.map(word => (
                    <button key={word.id} onClick={() => handleWordClick(word, false)}
                        style={{
                            background: color, color: '#fff', border: 'none',
                            padding: '8px 14px', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                        {word.text}
                    </button>
                ))}
            </div>

            {/* Word Bank */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {words.map(word => (
                    <button key={word.id} onClick={() => handleWordClick(word, true)}
                        style={{
                            background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                            padding: '8px 14px', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
                            transition: 'transform 0.1s'
                        }}>
                        {word.text}
                    </button>
                ))}
            </div>

            {translation && (
                <div dir="rtl" style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                    💡 {translation}
                </div>
            )}

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
