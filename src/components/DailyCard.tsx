import React, { useState, useEffect } from 'react';
import { DailyContent } from '../daily-content';
import { FavoritesManager } from '../favorites';
import { TTSManager } from '../tts';
import { showToast } from '../utils';

interface DailyCardProps {
    content: DailyContent;
    onOpenSettings: () => void;
}

export const DailyCard: React.FC<DailyCardProps> = ({ content, onOpenSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (content) setIsFav(FavoritesManager.has(content.id.toString()));
    }, [content]);

    if (!content) return null;

    // Theme Colors
    let themeColor = '#3b82f6';
    if (content.type === 'proverb') themeColor = '#00ead3';
    else if (content.type === 'idiom') themeColor = '#ff0';
    else if (content.type === 'quran') themeColor = '#fbbf24';
    else if (content.type === 'asma') themeColor = '#10b981';
    else if (content.type === 'cognate') themeColor = '#f97316';
    else if (content.type === 'joke') themeColor = '#d946ef';
    else if (content.type === 'fact') themeColor = '#ff0000';
    else if (content.type === 'grammar') themeColor = '#ef4444';
    else if (content.type === 'slang') themeColor = '#84cc16';

    const handleSpeak = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPlaying) return;
        setIsPlaying(true);
        try { await TTSManager.speak(content.swedish, 'sv'); } catch (err) { console.error(err); } finally { setIsPlaying(false); }
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(`${content.swedish} - ${content.translation}`);
            showToast('Kopierat / تم النسخ 📋');
        } catch { showToast('Fel / خطأ'); }
    };

    const handleFav = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = FavoritesManager.toggle(content.id.toString());
        setIsFav(newStatus);
    };

    return (
        <div className="daily-card-container">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes pulse-neon {
                    0% { box-shadow: 0 0 5px ${themeColor}44; }
                    50% { box-shadow: 0 0 20px ${themeColor}88; }
                    100% { box-shadow: 0 0 5px ${themeColor}44; }
                }
                .ticker-bar {
                    background: #000;
                    border: 1px solid ${themeColor};
                    height: 40px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;
                    animation: pulse-neon 3s infinite;
                    border-radius: 12px;
                    margin-bottom: 16px;
                }
                .ticker-label {
                    background: ${themeColor};
                    color: #000;
                    padding: 0 12px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    font-weight: 900;
                    font-size: 0.75rem;
                    z-index: 2;
                    white-space: nowrap;
                    letter-spacing: 1px;
                }
                .ticker-content {
                    white-space: nowrap;
                    animation: marquee 20s linear infinite;
                    animation-delay: -10s;
                    color: ${themeColor};
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    font-size: 0.95rem;
                    padding-left: 20px;
                }
                .cyber-panel {
                    background: rgba(20, 20, 25, 0.95);
                    border: 1px solid ${themeColor}66;
                    border-left: 8px solid ${themeColor};
                    border-radius: 16px;
                    padding: 20px;
                    animation: slideDown 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    margin-bottom: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .cyber-button {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid ${themeColor}44;
                    color: #fff;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex: 1;
                }
                .cyber-button:hover {
                    background: ${themeColor}22;
                    border-color: ${themeColor};
                    transform: translateY(-2px);
                }
                .cyber-button.active-fav {
                    color: #f59e0b;
                    border-color: #f59e0b;
                    background: rgba(245, 158, 11, 0.1);
                }
                `}
            </style>

            {!isOpen ? (
                <div className="ticker-bar" onClick={() => setIsOpen(true)}>
                    <div className="ticker-label">{content.tags?.[0]?.toUpperCase() || 'ORD'}</div>
                    <div className="ticker-content">
                        {`+++ ${content.swedish.toUpperCase()} (${content.rawType || 'ORD'}) >>> ${content.translation} >>> KLICKA FÖR MER INFO +++`}
                    </div>
                </div>
            ) : (
                <div className="cyber-panel" onClick={() => setIsOpen(false)}>
                    <div style={{ position: 'absolute', top: '10px', right: '15px', color: themeColor, fontSize: '0.6rem', opacity: 0.5, fontFamily: 'monospace' }}>
                        ID: {content.id}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ color: themeColor, fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '5px' }}>
                            {content.type === 'quran' ? '[ QURANIC_ROOT ]' : (content.type === 'asma' ? '[ DIVINE_NAME ]' : '[ SWEDISH_CORE ]')}
                        </div>
                        <h2 style={{
                            fontSize: content.swedish.length > 12 ? '1.8rem' : '2.5rem',
                            margin: 0,
                            color: '#fff',
                            fontWeight: '900',
                            lineHeight: 1.1,
                            textShadow: `0 0 15px ${themeColor}66`
                        }}>
                            {content.swedish}
                        </h2>

                        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '1.4rem', color: themeColor, fontFamily: '"Tajawal", sans-serif', fontWeight: '700' }}>
                                {content.translation}
                            </div>
                            {content.type === 'proverb' && content.literal && (
                                <div style={{ fontSize: '1rem', color: '#aaa', fontFamily: '"Tajawal", sans-serif', borderRight: `2px solid ${themeColor}`, paddingRight: '10px' }}>
                                    <span style={{ fontSize: '0.6rem', color: '#666', display: 'block' }}>BOKSTAVLIGT / حرفياً:</span>
                                    {content.literal}
                                </div>
                            )}
                            {content.type === 'asma' && content.explanation && (
                                <div style={{ fontSize: '1rem', color: '#ccc', fontFamily: '"Tajawal", sans-serif', borderRight: `2px solid ${themeColor}`, paddingRight: '10px' }}>
                                    {content.explanation}
                                </div>
                            )}
                        </div>
                    </div>

                    {(content.example || content.ayah) && (
                        <div style={{ marginBottom: '25px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid ${themeColor}` }} onClick={e => e.stopPropagation()}>
                            <div style={{ color: themeColor, fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '8px' }}>
                                {content.type === 'quran' || content.type === 'asma' ? '[ HOLY_VERSE ]' : '[ USAGE_EXAMPLE ]'}
                            </div>

                            {content.ayah && (
                                <div style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontFamily: '"Amiri", "Tajawal", serif', lineHeight: '1.6', direction: 'rtl' }}>
                                    {content.ayah}
                                </div>
                            )}

                            {content.example && (
                                <div style={{ fontSize: '1rem', color: '#bbb', fontStyle: 'italic', lineHeight: 1.4 }}>
                                    "{content.example}"
                                </div>
                            )}

                            {content.surah && (
                                <div style={{ fontSize: '0.75rem', color: themeColor, marginTop: '8px', textAlign: 'right' }}>
                                    — {content.surah}
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="cyber-button" onClick={handleSpeak} title="Lyssna">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </button>
                        <button className="cyber-button" onClick={handleCopy} title="Kopiera">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                        <button className={`cyber-button ${isFav ? 'active-fav' : ''}`} onClick={handleFav} title="Spara">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </button>
                        <button className="cyber-button" onClick={(e) => { e.stopPropagation(); onOpenSettings(); }} title="Källor / المصادر">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
