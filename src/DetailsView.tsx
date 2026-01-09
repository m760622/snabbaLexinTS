import React, { useEffect, useState, useRef } from 'react';
import { TypeColorSystem } from './type-color-system';
import { TTSManager } from './tts';
import { FavoritesManager } from './favorites';
import { showToast, TextSizeManager, HapticManager } from './utils';
import { PronunciationLab } from './components/PronunciationLab';
import { MiniQuiz } from './components/MiniQuiz';
import { AIStoryFlash } from './components/AIStoryFlash';
import { t } from './i18n';

interface DetailsViewProps {
    wordId: number | string;
    onBack: () => void;
}

const PremiumBackground = () => (
    <div className="premium-bg">
        <div className="orb-container">
            <div className="premium-orb orb-blue" style={{opacity: 0.2}}></div>
            <div className="premium-orb orb-purple" style={{opacity: 0.2}}></div>
        </div>
    </div>
);

const SmartLinkedText = ({ text, onLinkClick }: { text: string, onLinkClick: (word: string) => void }) => {
    if (!text) return null;
    const parts = text.split(/([ \t\n,.!?;:"]+)/);
    return (        <span>
            {parts.map((part, i) => {
                if (part.match(/^[a-zåäöA-ZÅÄÖ]{4,}$/)) {
                    return (
                        <span 
                            key={i} 
                            onClick={(e) => { e.stopPropagation(); onLinkClick(part); }}
                            style={{ cursor: 'pointer', borderBottom: '1px dotted currentColor', color: 'var(--accent-blue, #3b82f6)' }}
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
    const [accentColor, setAccentColor] = useState('#3b82f6');

    const stopRepeatRef = useRef(false);
    const heroSweRef = useRef<HTMLHeadingElement>(null);
    const heroArbRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const allData = (window as any).dictionaryData as any[][];

    useEffect(() => {
        const savedColor = localStorage.getItem('snabba_accent_color');
        if (savedColor) setAccentColor(savedColor);
    }, []);

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
        HapticManager.medium();
        const idStr = wordId.toString();
        const newState = FavoritesManager.toggle(idStr);
        setIsFav(newState);
        if (newState) {
            setIsHeartPop(true);
            setTimeout(() => setIsHeartPop(false), 300);
        }
    };

    const handleRepeat = async () => {
        HapticManager.light();
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
        HapticManager.light();
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
        <div className="premium-card" style={{ 
            background: 'rgba(28, 28, 30, 0.6)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', 
            marginBottom: '15px', borderLeft: `6px solid ${primaryColor}`, backdropFilter: 'blur(15px)'
        }}>
            <h3 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span> {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div ref={containerRef} className="details-page-container" style={{ 
            height: '100dvh', 
            overflowY: 'auto', 
            WebkitOverflowScrolling: 'touch',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000,
            position: 'fixed',
            inset: 0
        }}>
            <PremiumBackground />

            {/* Nav Header */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '15px 20px', position: 'sticky', top: 0, 
                zIndex: 100, background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => {
                        HapticManager.light();
                        window.history.pushState({ view: 'home' }, '', '/');
                        window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'home' } }));
                    }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </button>
                    <button onClick={() => { HapticManager.light(); onBack(); }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => { HapticManager.light(); TTSManager.stop(); stopRepeatRef.current = true; TTSManager.speak(swe, 'sv'); }} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔊</button>
                    <button onClick={handleRepeat} style={{ background: isRepeating ? `${accentColor}33` : 'rgba(255,255,255,0.05)', border: 'none', color: isRepeating ? accentColor : '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    <button onClick={toggleFavorite} style={{ 
                        background: isFav ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', border: 'none', color: isFav ? '#ef4444' : '#888', 
                        width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: isHeartPop ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.2s'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "currentColor"} strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '50px 20px', background: `linear-gradient(180deg, ${primaryColor}15 0%, transparent 100%)` }}>
                <h1 ref={heroSweRef} style={{ fontSize: '3rem', fontWeight: '900', margin: 0, color: '#fff', letterSpacing: '-1px', viewTransitionName: `word-swe-${wordId}` as any }}>{swe}</h1>
                <div style={{ width: '50px', height: '5px', background: primaryColor, margin: '20px auto', borderRadius: '10px', boxShadow: `0 0 15px ${primaryColor}66` }}></div>
                <p ref={heroArbRef} dir="rtl" style={{ fontSize: '2rem', color: '#fff', marginTop: '10px', fontFamily: '"Tajawal", sans-serif', fontWeight: '700', viewTransitionName: `word-arb-${wordId}` as any }}>{arb}</p>
                <div style={{ marginTop: '20px' }}>
                    <span style={{ background: `${primaryColor}22`, color: primaryColor, border: `1.5px solid ${primaryColor}`, padding: '6px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{type}</span>
                </div>
            </div>

            <div style={{ padding: '0 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <AIStoryFlash swe={swe} arb={arb} type={type} />
                
                {/* Tabs */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', padding: '5px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => { HapticManager.light(); setActiveTab('info'); }} style={{ flex: 1, padding: '12px', background: activeTab === 'info' ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: activeTab === 'info' ? '#fff' : '#888', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        {t('common.info')}
                    </button>
                    <button onClick={() => { HapticManager.light(); setActiveTab('interact'); }} style={{ flex: 1, padding: '12px', background: activeTab === 'interact' ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: activeTab === 'interact' ? '#fff' : '#888', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        {t('nav.learn')}
                    </button>
                </div>

                {activeTab === 'info' ? (
                    <div className="tab-content-active">
                        {(def || arbExt || arb) && (
                            <Card title={t('details.meaning')} icon="📝">
                                <div style={{ marginBottom: '20px' }}>
                                    <div dir="rtl" style={{ fontSize: '1.5rem', color: primaryColor, fontWeight: 'bold', fontFamily: '"Tajawal", sans-serif', marginBottom: '8px' }}>
                                        {arb}
                                    </div>
                                    {arbExt && <div dir="rtl" style={{ fontSize: '1.1rem', color: '#fff', opacity: 0.85, fontFamily: '"Tajawal", sans-serif', lineHeight: 1.5 }}>
                                        {arbExt}
                                    </div>}
                                </div>
                                {def && (
                                    <div style={{ 
                                        fontSize: '1.1rem', lineHeight: 1.7, color: '#ccc', 
                                        padding: '15px', background: 'rgba(255,255,255,0.03)', 
                                        borderRadius: '16px', borderLeft: `3px solid ${primaryColor}66` 
                                    }}>
                                        <SmartLinkedText text={def} onLinkClick={handleSmartLink} />
                                    </div>
                                )}
                            </Card>
                        )}

                        {(exSwe || exArb) && (
                            <Card title={t('learn.examples')} icon="💡">
                                {exSwe && <div style={{ fontStyle: 'italic', marginBottom: '12px', color: '#fff', fontSize: '1.15rem', lineHeight: 1.5 }}>
                                    <SmartLinkedText text={exSwe} onLinkClick={handleSmartLink} />
                                </div>}
                                {exArb && <div dir="rtl" style={{ color: primaryColor, opacity: 0.9, fontFamily: '"Tajawal", sans-serif', fontSize: '1.15rem' }}>
                                    {exArb}
                                </div>}
                            </Card>
                        )}

                        {forms && (
                            <Card title={t('details.forms')} icon="🔗">
                                <div style={{ 
                                    color: '#888', fontSize: '0.9rem', lineHeight: 1.6,
                                    fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)',
                                    padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {forms}
                                </div>
                            </Card>
                        )}
                    </div>
                ) : (
                    <div className="tab-content-active">
                        <PronunciationLab word={swe} />
                        <div style={{ height: '20px' }}></div>
                        <MiniQuiz wordData={wordData} />
                        <div style={{ height: '20px' }}></div>
                        <Card title={t('details.related')} icon="✨">
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                                {relatedWords.map(rw => (
                                    <div key={rw[0]} onClick={() => handleSmartLink(rw[2])} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '18px', minWidth: '150px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>{rw[2]}</div>
                                        <div dir="rtl" style={{ fontSize: '0.9rem', color: primaryColor, fontFamily: '"Tajawal", sans-serif' }}>{rw[3]}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <div style={{ height: '150px', flexShrink: 0 }}></div>
        </div>
    );
};
