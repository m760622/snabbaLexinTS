import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '../../../../assets/css/games.css';

interface MissingWordGameProps {
    onBack: () => void;
}

const MissingWordGame: React.FC<MissingWordGameProps> = ({ onBack }) => {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [sentence, setSentence] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadQuestion = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        // Find a word with an example sentence where the word is included
        let pool = allWords.filter(w => 
            w.swedish && w.arabic && w.example_swe && 
            w.example_swe.toLowerCase().includes(w.swedish.toLowerCase()) &&
            w.swedish.length > 2
        );

        if (pool.length === 0) {
            // Fallback: just words with examples
            pool = allWords.filter(w => w.swedish && w.arabic && w.example_swe);
        }

        const selected = SmartWordSelector.select(pool.map(w => w.raw), 1)[0];
        const wordObj: Word = {
            id: selected[0],
            type: selected[1],
            swedish: selected[2],
            arabic: selected[3],
            example_swe: selected[7],
            example_arb: selected[8],
            raw: selected
        };

        setCurrentWord(wordObj);
        
        // Create sentence with blank
        const regex = new RegExp(wordObj.swedish, 'i');
        setSentence(wordObj.example_swe!.replace(regex, '______'));

        // Generate options
        const opts = [wordObj.swedish];
        while (opts.length < 4) {
            const rand = allWords[Math.floor(Math.random() * allWords.length)].swedish;
            if (!opts.includes(rand) && rand.length > 2) opts.push(rand);
        }
        setOptions(opts.sort(() => Math.random() - 0.5));
        
        setIsAnswered(false);
        setSelectedAnswer(null);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(wordObj.swedish.toLowerCase());
    }, []);

    useEffect(() => {
        loadQuestion();
    }, [loadQuestion]);

    const handleAnswer = (option: string) => {
        if (isAnswered || !currentWord) return;

        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === currentWord.swedish) {
            setScore(s => s + 10);
            HapticManager.success();
            TTSManager.speak(currentWord.swedish, 'sv');
        } else {
            HapticManager.error();
        }
    };

    if (loading || !currentWord) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Gissa Ordet</h2>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>💠 {score}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="mw-holo-hud" style={{ width: '100%', maxWidth: '500px', background: 'rgba(56, 189, 248, 0.1)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
                    <div style={{ color: '#38bdf8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Mening:</div>
                    <p style={{ fontSize: '1.5rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>{sentence}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '20px', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        <span>💡</span>
                        <span style={{ fontFamily: 'Tajawal' }}>{currentWord.arabic}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '500px' }}>
                    {options.map((opt, i) => {
                        const isCorrect = opt === currentWord.swedish;
                        const isSelected = opt === selectedOption;
                        
                        let bgColor = 'rgba(255,255,255,0.05)';
                        let borderColor = 'rgba(255,255,255,0.1)';
                        
                        if (isAnswered) {
                            if (isCorrect) { bgColor = '#22c55e'; borderColor = 'transparent'; }
                            else if (isSelected) { bgColor = '#ef4444'; borderColor = 'transparent'; }
                        }

                        return (
                            <button 
                                key={i} 
                                onClick={() => handleAnswer(opt)}
                                disabled={isAnswered}
                                style={{ padding: '1rem', borderRadius: '12px', background: bgColor, border: `1px solid ${borderColor}`, color: 'white', fontWeight: 'bold', cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.2s' }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: selectedOption === currentWord.swedish ? '#22c55e' : '#ef4444', fontWeight: 'bold', marginBottom: '1rem' }}>
                            {selectedOption === currentWord.swedish ? '✅ Rätt!' : `❌ Fel! Rätt svar: ${currentWord.swedish}`}
                        </div>
                        <button 
                            onClick={loadQuestion} 
                            style={{ padding: '1rem 3rem', borderRadius: '12px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Nästa Nivå ➜
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MissingWordGame;
