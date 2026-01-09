import React, { useEffect, useState, useRef } from 'react';
import { TypeColorSystem } from './type-color-system';
import { TTSManager } from './tts';
import { FavoritesManager } from './favorites';
import { showToast, TextSizeManager } from './utils';
import { PronunciationLab } from './components/PronunciationLab';
import { MiniQuiz } from './components/MiniQuiz';
import { AIStoryFlash } from './components/AIStoryFlash';
import { t } from './i18n';

interface DetailsViewProps {
    wordId: number | string;
    onBack: () => void;
}

const SmartLinkedText = ({ text, onLinkClick }: { text: string, onLinkClick: (word: string) => void }) => {
    if (!text) return null;
    const parts = text.split(/([ \t\n\r,.!?;:"]+)/);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.match(/^[a-zåäöA-ZÅÄÖ]{4,}$/)) {
                    return (
                        <span 
                            key={i} 
                            onClick={(e) => { e.stopPropagation(); onLinkClick(part); }}
                            style={{ cursor: 'pointer', borderBottom: '1px dotted currentColor' }}
                        >
                            {part}
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

export const DetailsView: React.FC<DetailsViewProps> = ({ wordId, onBack }) => {
    const [wordData, setWordData] = useState<any[] | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'interact'>('info');
    const [isFav, setIsFav] = useState(false);
    const [isHeartPop, setIsHeartPop] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [relatedWords, setRelatedWords] = useState<any[]>([]);

    const stopRepeatRef = useRef(false);
    const heroSweRef = useRef<HTMLHeadingElement>(null);
    const heroArbRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const allData = (window as any).dictionaryData as any[][];

    const id = wordData?.[0];
    const type = wordData?.[1] || '';
    const swe = wordData?.[2] || '';
    const arb = wordData?.[3] || '';
    const arbExt = wordData?.[4] || '';
    const def = wordData?.[5] || '';
    const forms = wordData?.[6] || '';
    const exSwe = wordData?.[7] || '';
    const exArb = wordData?.[8] || '';
    const idiomSwe = wordData?.[9] || '';
    const idiomArb = wordData?.[10] || '';

    const toggleFavorite = () => {
        const idStr = wordId.toString();
        const newState = FavoritesManager.toggle(idStr);
        setIsFav(newState);
        if (newState) {
            setIsHeartPop(true);
            setTimeout(() => setIsHeartPop(false), 300);
        }
    };

    const handleRepeat = async () => {
        if (isRepeating) {
            stopRepeatRef.current = true;
            setIsRepeating(false);
            TTSManager.stop();
            return;
        }

        setIsRepeating(true);
        stopRepeatRef.current = false;

        for (let i = 0; i < 3; i++) {
            if (stopRepeatRef.current) break;
            await TTSManager.speak(swe, 'sv', { speed: 0.9, pitch: 1.05 });
            if (i < 2 && !stopRepeatRef.current) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
        setIsRepeating(false);
    };

    useEffect(() => {
        if (allData) {
            const found = allData.find(row => row[0].toString() === wordId.toString());
            if (found) {
                setWordData(found);
                setIsFav(FavoritesManager.has(wordId.toString()));
                
                // Related Words logic
                const sweWord = found[2];
                const currentType = found[1];
                const related = allData.filter(row => 
                    row[2] !== sweWord && (row[2].toLowerCase().includes(sweWord.toLowerCase()) || row[1] === currentType)
                ).slice(0, 5);
                setRelatedWords(related);
            }
        }
        if (containerRef.current) containerRef.current.scrollTop = 0;
    }, [wordId, allData]);

    useEffect(() => {
        if (wordData) {
            if (heroSweRef.current) TextSizeManager.apply(heroSweRef.current, swe, 1, 2.8);
            if (heroArbRef.current) TextSizeManager.apply(heroArbRef.current, arb, 1, 1.8);
        }
    }, [wordData, swe, arb]);

    const handleSmartLink = (word: string) => {
        const found = allData?.find(row => row[2].toLowerCase() === word.toLowerCase());
        if (found) {
            const newId = found[0];
            window.history.pushState({ view: 'details', id: newId }, '', `?id=${newId}`);
            window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'details', id: newId } }));
        }
    };

    if (!wordData) return <div style={{padding: '40px', textAlign: 'center', color: '#fff'}}>{t('details.loading')}</div>;

    const typeInfo = TypeColorSystem.detect(type, swe, forms, '', arb);
    const primaryColor = typeInfo.color.primary;

    const Card = ({ title, icon, children }: any) => (
        <div style={{ 
            background: '#1c1c1e', padding: '16px', borderRadius: '12px', border: '1px solid #333', 
            marginBottom: '12px', borderLeft: `4px solid ${primaryColor}` 
        }}>
            <h3 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span> {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div ref={containerRef} className="details-page-container" style={{ 
            height: '100%', 
            overflowY: 'auto', 
            WebkitOverflowScrolling: 'touch',
            background: '#121212',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Nav Header */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '12px 16px', position: 'sticky', top: 0, 
                zIndex: 100, background: 'rgba(18,18,18,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #333'
            }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button onClick={() => {
                        window.history.pushState({ view: 'home' }, '', '/');
                        window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'home' } }));
                    }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' }} title="Hem / الرئيسية">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </button>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button onClick={() => { TTSManager.stop(); stopRepeatRef.current = true; TTSManager.speak(swe, 'sv', { speed: 0.9, pitch: 1.05 }); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }} title="Lyssna / استمع">🔊</button>
                    <button onClick={() => { TTSManager.stop(); stopRepeatRef.current = true; TTSManager.speak(swe, 'sv', { speed: 0.45, pitch: 1.05, slow: true }); }} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }} title="Lyssna långsamt / استمع ببطء">🐢</button>
                    <button onClick={handleRepeat} style={{ background: 'none', border: 'none', color: isRepeating ? '#f59e0b' : '#3b82f6', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} title="Upprepa 3x / تكرار ٣ مرات">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    <button onClick={toggleFavorite} style={{ 
                        background: 'none', border: 'none', color: isFav ? '#ef4444' : '#888', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        transform: isHeartPop ? 'scale(1.3)' : 'scale(1)',
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "currentColor"} strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '40px 20px', background: `linear-gradient(180deg, ${primaryColor}11 0%, transparent 100%)` }}>
                <h1 ref={heroSweRef} style={{ fontSize: '2.8rem', fontWeight: '900', margin: 0, color: '#fff' }}>{swe}</h1>
                <div style={{ width: '40px', height: '4px', background: primaryColor, margin: '15px auto', borderRadius: '2px' }}></div>
                <p ref={heroArbRef} dir="rtl" style={{ fontSize: '1.8rem', color: '#fff', marginTop: '10px', fontFamily: '"Tajawal", sans-serif', fontWeight: '700' }}>{arb}</p>
                {arbExt && <p dir="rtl" style={{ fontSize: '1.1rem', color: '#999', marginTop: '5px', fontFamily: '"Tajawal", sans-serif' }}>{arbExt}</p>}
                <div style={{ marginTop: '15px' }}>
                    <span style={{ border: `1px solid ${primaryColor}`, color: primaryColor, padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{type}</span>
                </div>
            </div>

            {/* AI Story Flash - Creative Feature */}
            <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>
                <AIStoryFlash swe={swe} arb={arb} type={type} />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('info')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'info' ? '#fff' : '#666', borderBottom: activeTab === 'info' ? `2px solid ${primaryColor}` : 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t('common.info')}
                </button>
                <button onClick={() => setActiveTab('interact')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'interact' ? '#fff' : '#666', borderBottom: activeTab === 'interact' ? `2px solid ${primaryColor}` : 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t('nav.learn')}
                </button>
            </div>

            <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>
                {activeTab === 'info' ? (
                    <>
                        {(def || arbExt || arb) && (
                            <Card title={t('details.meaning')} icon="📝">
                                <div style={{ marginBottom: '16px' }}>
                                    <div dir="rtl" style={{ fontSize: '1.4rem', color: primaryColor, fontWeight: 'bold', fontFamily: '"Tajawal", sans-serif', marginBottom: '4px' }}>
                                        {arb}
                                    </div>
                                    {arbExt && <div dir="rtl" style={{ fontSize: '1.1rem', color: '#fff', opacity: 0.9, fontFamily: '"Tajawal", sans-serif' }}>
                                        {arbExt}
                                    </div>}
                                </div>
                                
                                {def && (
                                    <div style={{ 
                                        fontSize: '1.05rem', lineHeight: 1.6, color: '#ccc', 
                                        padding: '12px', background: 'rgba(255,255,255,0.03)', 
                                        borderRadius: '8px', borderLeft: `2px solid ${primaryColor}44` 
                                    }}>
                                        <SmartLinkedText text={def} onLinkClick={handleSmartLink} />
                                    </div>
                                )}
                            </Card>
                        )}

                        {(exSwe || exArb) && (
                            <Card title={t('learn.examples')} icon="💡">
                                {exSwe && <div style={{ fontStyle: 'italic', marginBottom: '8px', color: '#eee', fontSize: '1.1rem' }}>
                                    <SmartLinkedText text={exSwe} onLinkClick={handleSmartLink} />
                                </div>}
                                {exArb && <div dir="rtl" style={{ color: primaryColor, opacity: 0.9, fontFamily: '"Tajawal", sans-serif', fontSize: '1.1rem' }}>
                                    {exArb}
                                </div>}
                            </Card>
                        )}

                        {(idiomSwe || idiomArb) && (
                            <Card title={t('details.idiom')} icon="💬">
                                {idiomSwe && <div style={{ marginBottom: '10px', color: '#fff', fontSize: '1.1rem', fontWeight: '500' }}>
                                    <SmartLinkedText text={idiomSwe} onLinkClick={handleSmartLink} />
                                </div>}
                                {idiomArb && <div dir="rtl" style={{ 
                                    color: primaryColor, 
                                    fontFamily: '"Tajawal", sans-serif', 
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    padding: '8px 12px',
                                    background: `${primaryColor}11`,
                                    borderRadius: '8px',
                                    borderRight: `3px solid ${primaryColor}`
                                }}>
                                    {idiomArb}
                                </div>}
                            </Card>
                        )}

                        {forms && (
                            <Card title={t('details.forms')} icon="🔗">
                                <div style={{ 
                                    color: '#aaa', 
                                    fontSize: '0.95rem', 
                                    lineHeight: 1.6,
                                    fontFamily: 'monospace',
                                    background: '#121212',
                                    padding: '10px',
                                    borderRadius: '6px'
                                }}>
                                    {forms}
                                </div>
                            </Card>
                        )}
                    </>
                ) : (
                    <>
                        <PronunciationLab word={swe} />
                        <div style={{ height: '16px' }}></div>
                        <MiniQuiz wordData={wordData} />
                        
                        <div style={{ height: '16px' }}></div>
                        
                        <Card title={t('details.related')} icon="✨">
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                                {relatedWords.map(rw => (
                                    <div 
                                        key={rw[0]} 
                                        onClick={() => handleSmartLink(rw[2])} 
                                        style={{ 
                                            background: '#2c2c2e', 
                                            padding: '12px', 
                                            borderRadius: '12px', 
                                            minWidth: '140px', 
                                            cursor: 'pointer', 
                                            border: '1px solid #3d3d3d',
                                            transition: 'transform 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>{rw[2]}</div>
                                        <div dir="rtl" style={{ 
                                            fontSize: '0.9rem', 
                                            color: primaryColor, 
                                            fontFamily: '"Tajawal", sans-serif',
                                            fontWeight: '600'
                                        }}>{rw[3]}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Physical spacer for dock */}
            <div className='safe-area-spacer' style={{ height: '220px', width: '100%', flexShrink: 0 }}></div>

            {/* Glass Dock Menu (Fixed Bottom) - Injected directly into Component */}
            <div className='glass-dock-container'>
                <a href='/' className='dock-item' data-tooltip='Sök' onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({ view: 'home' }, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'home' } }));
                }}><span className='dock-icon'>🔍</span></a>
                <a href='games/games.html' className='dock-item' data-tooltip='Spel'><span className='dock-icon'>🎮</span></a>
                <a href='learn/learn.html' className='dock-item' data-tooltip='Lär'><span className='dock-icon'>📚</span></a>
                <a href='/?s=favorites' className='dock-item' data-tooltip='Favoriter'><span className='dock-icon'>⭐️</span></a>
                <a href='#' className='dock-item' data-tooltip='Quiz' onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('openQuiz'));
                }}><span className='dock-icon'>⚡️</span></a>
            </div>
        </div>
    );
};