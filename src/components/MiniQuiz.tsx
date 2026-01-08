import React, { useState, useEffect } from 'react';
import { showToast } from '../utils';
import { MasteryManager } from '../details_modules/MasteryManager';

interface MiniQuizProps {
    wordData: any[];
}

export const MiniQuiz: React.FC<MiniQuizProps> = ({ wordData }) => {
    const [options, setOptions] = useState<string[]>([]);
    const [correctAnswer, setCorrectAnswer] = useState<string>('');
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [streak, setStreak] = useState(0);

    const swe = wordData[2];
    const arb = wordData[3];
    const type = wordData[1];

    useEffect(() => {
        generateQuestion();
    }, [wordData]);

    const generateQuestion = () => {
        const allData = (window as any).dictionaryData as any[][];
        if (!allData) return;

        // Distractors: same type, different word
        const distractors = allData
            .filter(row => row[1] === type && row[3] !== arb)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(row => row[3]);

        const opts = [...distractors, arb].sort(() => Math.random() - 0.5);
        setOptions(opts);
        setCorrectAnswer(arb);
        setSelected(null);
        setFeedback(null);
    };

    const handleAnswer = (opt: string) => {
        if (selected) return; // Already answered
        setSelected(opt);

        const isCorrect = opt === correctAnswer;
        if (isCorrect) {
            setFeedback('Rätt! Correct! 🎉');
            setStreak(s => s + 1);
            showToast('✅ Rätt svar! +10 XP');
            MasteryManager.updateMastery(wordData[0], true);
        } else {
            setFeedback(`Fel. Rätt svar var: ${correctAnswer}`);
            setStreak(0);
            showToast('❌ Fel svar', { type: 'error' });
            MasteryManager.updateMastery(wordData[0], false);
        }
    };

    return (
        <div style={{ background: '#1c1c1e', padding: '16px', borderRadius: '12px', border: '1px solid #333', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>⚡ Snabbtest / اختبار سريع</h3>
                {streak > 0 && <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔥 {streak}</span>}
            </div>

            <div style={{ marginBottom: '20px', fontSize: '1.1rem', textAlign: 'center' }}>
                Vad betyder <span style={{ fontWeight: 'bold', color: '#fff' }}>"{swe}"</span>?
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {options.map((opt, i) => {
                    let bg = '#2c2c2e';
                    let borderColor = '#444';
                    
                    if (selected) {
                        if (opt === correctAnswer) {
                            bg = 'rgba(34, 197, 94, 0.2)'; // Green
                            borderColor = '#22c55e';
                        } else if (opt === selected) {
                            bg = 'rgba(239, 68, 68, 0.2)'; // Red
                            borderColor = '#ef4444';
                        } else {
                            bg = '#1c1c1e';
                            borderColor = '#333';
                        }
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt)}
                            disabled={!!selected}
                            style={{
                                padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`,
                                background: bg, color: '#fff', cursor: selected ? 'default' : 'pointer',
                                fontSize: '1rem', transition: 'all 0.2s'
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>

            {feedback && (
                <div style={{ marginTop: '16px', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                    <div style={{ marginBottom: '10px', color: selected === correctAnswer ? '#4ade80' : '#ef4444' }}>
                        {feedback}
                    </div>
                    <button 
                        onClick={generateQuestion}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}
                    >
                        Nästa fråga ➡️
                    </button>
                </div>
            )}
        </div>
    );
};
