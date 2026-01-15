import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { grammarDatabase } from '../../../data/grammarData';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import '@/styles/games.css';

interface GrammarGameProps {
    onBack: () => void;
}

interface GrammarRule {
    category: string;
    hint: string;
    words: string[];
    correct: string[];
    explanation: string;
    explanationAr?: string;
}

const GrammarGame: React.FC<GrammarGameProps> = ({ onBack }) => {
    const [rules, setRules] = useState<GrammarRule[]>([]);
    const [currentRule, setCurrentRule] = useState<GrammarRule | null>(null);
    const [category, setCategory] = useState('all');
    const [currentSentence, setCurrentSentence] = useState<string[]>([]);
    const [wordBank, setWordBank] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    // Initialize Rules
    useEffect(() => {
        const allRules: GrammarRule[] = [];
        for (const [cat, sentences] of Object.entries(grammarDatabase)) {
            (sentences as any[]).forEach(sent => {
                allRules.push({ category: cat, ...sent });
            });
        }
        setRules(allRules);
    }, []);

    const loadLevel = useCallback(() => {
        let pool = rules;
        if (category !== 'all') {
            pool = rules.filter(r => r.category === category);
        }

        if (pool.length === 0) return;

        const rule = pool[Math.floor(Math.random() * pool.length)];
        setCurrentRule(rule);
        setWordBank([...rule.words].sort(() => Math.random() - 0.5));
        setCurrentSentence([]);
        setFeedback(null);
        setShowExplanation(false);
        setIsAnswered(false);
    }, [rules, category]);

    useEffect(() => {
        if (rules.length > 0) loadLevel();
    }, [rules, category, loadLevel]);

    const handleWordClick = (word: string, fromBank: boolean) => {
        if (isAnswered) return;
        HapticManager.light();

        if (fromBank) {
            setCurrentSentence(prev => [...prev, word]);
            setWordBank(prev => prev.filter((_, i) => i !== prev.indexOf(word)));
        } else {
            setWordBank(prev => [...prev, word]);
            setCurrentSentence(prev => prev.filter((_, i) => i !== prev.indexOf(word)));
        }
    };

    const handleCheck = () => {
        if (!currentRule) return;

        const currentStr = currentSentence.join(' ');
        const targetStr = currentRule.correct.join(' ');

        if (currentStr === targetStr) {
            setFeedback({ type: 'success', text: 'Helt rätt! 🌟' });
            setScore(s => s + 20);
            setIsAnswered(true);
            setShowExplanation(true);
            HapticManager.success();
            TTSManager.speak(targetStr, 'sv');
        } else {
            setFeedback({ type: 'error', text: 'Inte riktigt... Försök igen!' });
            HapticManager.error();
        }
    };

    const handleShowAnswer = () => {
        if (!currentRule) return;
        setCurrentSentence(currentRule.correct);
        setWordBank([]);
        setFeedback({ type: 'info', text: 'Här är rätt svar!' });
        setIsAnswered(true);
        setShowExplanation(true);
    };

    if (!currentRule) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Grammatik</h2>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem' }}
                    >
                        <option value="all">Alla regler</option>
                        <option value="word-order">Ordföljd</option>
                        <option value="v2-rule">V2-regeln</option>
                        <option value="questions">Frågor</option>
                    </select>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>⚡ {score}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1.5rem' }}>
                <div className="gr-holo-hint" style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontFamily: 'Tajawal' }}>{currentRule.hint}</div>
                </div>

                <div className="gr-drop-zone" style={{ minHeight: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '2px dashed rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                    {currentSentence.length === 0 && <div style={{ color: '#64748b' }}>Tryck på orden nedan för att bygga meningen</div>}
                    {currentSentence.map((word, i) => (
                        <button key={i} onClick={() => handleWordClick(word, false)} className="gr-word-chip" style={{ padding: '8px 15px', background: '#38bdf8', border: 'none', borderRadius: '8px', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}>
                            {word}
                        </button>
                    ))}
                </div>

                <div className="gr-word-bank" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {wordBank.map((word, i) => (
                        <button key={i} onClick={() => handleWordClick(word, true)} className="quiz-option" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>
                            {word}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div style={{ textAlign: 'center', color: feedback.type === 'success' ? '#22c55e' : (feedback.type === 'error' ? '#ef4444' : '#38bdf8'), fontWeight: 'bold' }}>
                        {feedback.text}
                    </div>
                )}

                {showExplanation && (
                    <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#38bdf8' }}>Förklaring:</div>
                        <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{currentRule.explanation}</div>
                        {currentRule.explanationAr && <div dir="rtl" style={{ fontSize: '1rem', marginTop: '0.5rem', color: '#a7f3d0', fontFamily: 'Tajawal' }}>{currentRule.explanationAr}</div>}
                    </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                    {!isAnswered ? (
                        <>
                            <button onClick={handleShowAnswer} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold' }}>Visa svar</button>
                            <button onClick={handleCheck} disabled={currentSentence.length === 0} style={{ flex: 2, padding: '1rem', borderRadius: '12px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', opacity: currentSentence.length === 0 ? 0.5 : 1 }}>Kontrollera</button>
                        </>
                    ) : (
                        <button onClick={loadLevel} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#22c55e', border: 'none', color: 'white', fontWeight: 'bold' }}>Nästa ➜</button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GrammarGame;
