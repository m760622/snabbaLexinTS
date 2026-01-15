import React, { useState, useEffect } from 'react';
import { TTSManager } from '../../../services/tts.service';

interface ExtraSectionsProps {
    currentFilter: string;
    onSetPathFilter: (filter: string) => void;
}

const ExtraSections: React.FC<ExtraSectionsProps> = ({ onSetPathFilter }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [wordOfDay, setWordOfDay] = useState<any>(null);

    useEffect(() => {
        // Try to load word of the day from global dictionaryData if available
        const loadWord = () => {
            if (typeof window !== 'undefined' && (window as any).dictionaryData && (window as any).dictionaryData.length > 0) {
                const data = (window as any).dictionaryData;
                const randomWord = data[Math.floor(Math.random() * data.length)];
                setWordOfDay(randomWord);
            } else {
                // Retry a few times if needed, or just stop
                // setTimeout(loadWord, 500); // Avoid infinite loops in React effect without proper cleanup/refs
            }
        };
        loadWord();
    }, []);

    const speakText = (text: string, lang: string) => {
         if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(text, lang);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'sv' ? 'sv-SE' : 'ar-SA';
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <details className="collapsible-section" id="extraSectionsToggle" open={isExpanded} onToggle={(e) => setIsExpanded((e.target as HTMLDetailsElement).open)}>
            <summary className="expand-toggle">
                <span className="sv-text">📌 Visa mer (Dagens ord, Aktivitet...)</span>
                <span className="ar-text">📌 عرض المزيد (كلمة اليوم، النشاط...)</span>
            </summary>

            {/* Word of the Day Section */}
            <div className="word-of-day-section" id="wordOfDaySection">
                <div className="section-title">
                    📝 <span className="sv-text">Dagens Ord</span><span className="ar-text">كلمة اليوم</span>
                </div>
                <div className="wod-card" onClick={() => wordOfDay && speakText(wordOfDay.swedish, 'sv')}>
                    <div className="wod-header">
                        <span className="wod-date" id="wodDate">
                            {new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}
                        </span>
                        <button className="wod-speak-btn">🔊</button>
                    </div>
                    {wordOfDay ? (
                        <div className="wod-content">
                            <div className="wod-word">{wordOfDay.swedish}</div>
                            <div className="wod-translation">{wordOfDay.arabic}</div>
                            <div className="wod-example">
                                <div className="wod-example-swe">{wordOfDay.example || `${wordOfDay.swedish} är ett bra ord.`}</div>
                                <div className="wod-example-arb">{wordOfDay.example_ar || `كلمة ${wordOfDay.arabic} كلمة جيدة.`}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="wod-content">
                            <div className="wod-word">Laddar...</div>
                        </div>
                    )}
                    <div className="wod-footer">
                        {wordOfDay && <span className="wod-category">🏷️ {wordOfDay.type || 'Ord'}</span>}
                    </div>
                </div>
            </div>

            {/* Learning Paths Section */}
            <div className="learning-paths-section">
                <div className="section-title">
                    🛤️ <span className="sv-text">Lärstigar</span><span className="ar-text">مسارات التعلم</span>
                </div>
                <div className="paths-container">
                    {[
                        { id: 'beginner', icon: '🌱', title: 'Nybörjare', desc: 'Grundläggande grammatik', arTitle: 'مبتدئ', arDesc: 'أساسيات القواعد', total: 6 },
                        { id: 'intermediate', icon: '📈', title: 'Medel', desc: 'Verb & tempus', arTitle: 'متوسط', arDesc: 'الأفعال والأزمنة', total: 6 },
                        { id: 'advanced', icon: '🎓', title: 'Avancerad', desc: 'Idiom & vardagsfraser', arTitle: 'متقدم', arDesc: 'التعبيرات والعبارات', total: 5 }
                    ].map(path => (
                        <div 
                            key={path.id} 
                            className={`learning-path ${path.id}-path`} 
                            onClick={() => onSetPathFilter(path.id)}
                        >
                            <div className="path-icon">{path.icon}</div>
                            <div className="path-info">
                                <div className="path-name">
                                    <span className="sv-text">{path.title}</span>
                                    <span className="ar-text">{path.arTitle}</span>
                                </div>
                                <div className="path-desc">
                                    <span className="sv-text">{path.desc}</span>
                                    <span className="ar-text">{path.arDesc}</span>
                                </div>
                                <div className="path-progress">
                                    <div className="path-progress-fill" id={`${path.id}Progress`}></div>
                                </div>
                                <div className="path-stats">0/{path.total}</div>
                            </div>
                            <div className="path-arrow">→</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Activity Chart - Simplified Static Version for now */}
            <div className="activity-section">
                <div className="section-title">
                    📊 <span className="sv-text">Veckoaktivitet</span><span className="ar-text">نشاط الأسبوع</span>
                </div>
                <div className="activity-chart" id="activityChart">
                    {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day, index) => (
                        <div key={day} className={`activity-bar ${index === 6 ? 'today' : ''}`} data-day={index}>
                            <div className="bar-fill" style={{ height: index === 6 ? '60%' : '0%' }}></div>
                            <span className="day-label">{day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </details>
    );
};

export default ExtraSections;
