import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TypeColorSystem } from './utils/type-color.util';
import { TTSManager } from './services/tts.service';
import { FavoritesManager } from './services/favorites.service';
import { showToast, TextSizeManager, HapticManager } from './utils/utils';
import { PronunciationLab } from './components/PronunciationLab';
import { SentenceBuilder } from './components/SentenceBuilder';
import { MiniQuiz } from './components/MiniQuiz';
import { AIStoryFlash } from './components/AIStoryFlash';
import { AIAnalysis } from './components/AIAnalysis';
import { t } from './utils/i18n.util';
import { DictionaryDB } from './services/db.service';
import { getSwedishFontSize, getArabicFontSize } from './utils/font-size.util';

interface DetailsViewProps {
    wordId: number | string;
    onBack: () => void;
}



// Gas Bubbles Background
const BubblesBackground = ({ color, usePortal = true }: { color: string, usePortal?: boolean }) => {
    // Determine dynamic color for bubbles (lighter opacity)
    const bubbleColor = color;

    // Generate static random values to avoid re-renders causing jumps
    // Using a fixed seed-like approach or just useMemo with empty dep array
    const bubbles = React.useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 15 + 5}px`, // 5px to 20px
        duration: `${Math.random() * 8 + 4}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.3 // Brighter: 0.3 to 0.8
    })), []);

    // Style content
    const content = (
        <div style={{ position: usePortal ? 'fixed' : 'absolute', inset: 0, zIndex: usePortal ? 10 : 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <style>{`
                @keyframes heavyRise {
                    0% { transform: translateY(120vh) scale(0.5); opacity: 0; }
                    20% { opacity: var(--bubble-opacity); }
                    80% { opacity: var(--bubble-opacity); }
                    100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
                }
            `}</style>
            {bubbles.map(b => (
                <div key={b.id} style={{
                    position: 'absolute',
                    left: b.left,
                    bottom: '-20px',
                    width: b.size,
                    height: b.size,
                    borderRadius: '50%',
                    background: bubbleColor,
                    opacity: b.opacity,
                    '--bubble-opacity': b.opacity,
                    animation: `heavyRise ${b.duration} infinite linear`,
                    animationDelay: b.delay,
                    boxShadow: `0 0 10px ${bubbleColor}40`
                } as any} />
            ))}
        </div>
    );

    if (usePortal) return ReactDOM.createPortal(content, document.body);
    return content;
};

// Glass Card Component
const GlassCard = ({ title, icon, children, color, delay = 0 }: any) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(25px) saturate(180%)',
        padding: '20px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden',
        animation: `glassSlideIn 0.5s ease-out ${delay}s both`
    }}>
        {/* Glass reflection */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            borderRadius: '24px 24px 0 0', pointerEvents: 'none'
        }} />
        {/* Accent line */}
        <div style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px',
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            borderRadius: '0 3px 3px 0'
        }} />
        <h3 style={{
            fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase',
            letterSpacing: '1.5px', fontWeight: '600', position: 'relative'
        }}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span> {title}
        </h3>
        <div style={{ position: 'relative' }}>{children}</div>
    </div>
);

// Focus Mode Component
const FocusMode = ({ swe, arb, color, onClose }: { swe: string, arb: string, color: string, onClose: () => void }) => {
    useEffect(() => { TTSManager.speak(swe, 'sv'); }, [swe]);
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000 100%)', zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px'
        }}>
            <button onClick={onClose} style={{
                position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)',
                border: 'none', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer'
            }}>✕</button>
            <div style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', textAlign: 'center', textShadow: `0 0 80px ${color}55`, marginBottom: '25px' }}>{swe}</div>
            <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, borderRadius: '10px', marginBottom: '25px' }} />
            <div dir="rtl" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'rgba(255,255,255,0.85)', fontFamily: '"Tajawal", sans-serif', textAlign: 'center' }}>{arb}</div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
                <button onClick={() => TTSManager.speak(swe, 'sv')} style={{
                    background: `${color}25`, border: `2px solid ${color}60`, color: color,
                    padding: '15px 30px', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
                }}>🔊 Svenska</button>
                <button onClick={() => TTSManager.speak(arb, 'ar')} style={{
                    background: 'rgba(251,191,36,0.2)', border: '2px solid rgba(251,191,36,0.5)', color: '#fbbf24',
                    padding: '15px 30px', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
                }}>🔊 العربية</button>
            </div>
        </div>
    );
};

// Flip Card
const FlipCard = ({ swe, arb, color, onClose }: { swe: string, arb: string, color: string, onClose: () => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '25px', fontSize: '0.95rem' }}>اضغط على البطاقة لقلبها</p>
            <div onClick={() => { setIsFlipped(!isFlipped); HapticManager.medium(); }} style={{ width: '320px', height: '220px', perspective: '1000px', cursor: 'pointer' }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: `linear-gradient(145deg, ${color}35, ${color}10)`, borderRadius: '28px', border: `2px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: `0 25px 50px ${color}25` }}>
                        <span style={{ fontSize: getSwedishFontSize(swe), fontWeight: '800', color: '#fff' }}>{swe}</span>
                    </div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(145deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1))', borderRadius: '28px', border: '2px solid rgba(251,191,36,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg)', boxShadow: '0 25px 50px rgba(251,191,36,0.2)' }}>
                        <span dir="rtl" style={{ fontSize: getArabicFontSize(arb), fontWeight: '700', color: '#fff', fontFamily: '"Tajawal", sans-serif' }}>{arb}</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
                <button onClick={() => TTSManager.speak(swe, 'sv')} style={{ background: `${color}25`, border: `1px solid ${color}50`, color: color, padding: '14px 28px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer' }}>🔊 Svenska</button>
                <button onClick={() => TTSManager.speak(arb, 'ar')} style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.45)', color: '#fbbf24', padding: '14px 28px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer' }}>🔊 العربية</button>
            </div>
        </div>
    );
};

// Quick Quiz
const QuickQuiz = ({ swe, arb, options, color, onClose }: { swe: string, arb: string, options: string[], color: string, onClose: () => void }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const handleSelect = (opt: string) => { setSelected(opt); setIsCorrect(opt === arb); HapticManager.medium(); setTimeout(() => onClose(), 1800); };
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '15px' }}>⚡ تحدي سريع</div>
            <div style={{ fontSize: getSwedishFontSize(swe), fontWeight: '800', color: '#fff', marginBottom: '35px', textShadow: `0 0 40px ${color}40` }}>{swe}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px' }}>
                {options.map((opt, i) => (
                    <button key={i} onClick={() => !selected && handleSelect(opt)} disabled={!!selected}
                        style={{
                            background: selected === opt ? (isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') : 'rgba(255,255,255,0.04)',
                            border: `2px solid ${selected === opt ? (isCorrect ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.08)'}`,
                            color: '#fff', padding: '18px', borderRadius: '18px', fontSize: '1.1rem', fontWeight: '600', cursor: selected ? 'default' : 'pointer',
                            fontFamily: '"Tajawal", sans-serif', direction: 'rtl', transition: 'all 0.3s'
                        }}>{opt}</button>
                ))}
            </div>
            {isCorrect !== null && <div style={{ marginTop: '30px', fontSize: '2rem', color: isCorrect ? '#10b981' : '#ef4444' }}>{isCorrect ? '✅ أحسنت!' : '❌ حاول مرة أخرى'}</div>}
        </div>
    );
};

// Smart Link
const SmartLinkedText = ({ text, onLinkClick }: { text: string, onLinkClick: (word: string) => void }) => {
    if (!text) return null;
    const parts = text.split(/([ \t\n,.!?;:"]+|[أ-ي]+)/);
    return (<span>{parts.map((part, i) => {
        const isSwedish = part.match(/^[a-zåäöA-ZÅÄÖ]{3,}$/);
        const isArabic = part.match(/^[أ-ي]{2,}$/);
        if (isSwedish || isArabic) return (<span key={i} onClick={(e) => { e.stopPropagation(); onLinkClick(part); }}
            style={{ cursor: 'pointer', borderBottom: '1.5px dashed rgba(255,255,255,0.35)', color: isArabic ? '#fbbf24' : '#60a5fa', transition: 'all 0.2s' }}>{part}</span>);
        return <span key={i}>{part}</span>;
    })}</span>);
};

// Form Chip
const FormChip = ({ form, color }: { form: string, color: string }) => (
    <button onClick={(e) => { e.stopPropagation(); HapticManager.light(); TTSManager.speak(form.trim(), 'sv'); }}
        style={{ background: `${color}12`, border: `1px solid ${color}30`, color: color, padding: '10px 18px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.75rem' }}>🔊</span>{form.trim()}
    </button>
);

export const DetailsView: React.FC<DetailsViewProps> = ({ wordId, onBack }) => {
    const [wordData, setWordData] = useState<any[] | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'interact'>('info');
    const [isFav, setIsFav] = useState(false);
    const [isHeartPop, setIsHeartPop] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [relatedWords, setRelatedWords] = useState<any[]>([]);
    const [similarFavorites, setSimilarFavorites] = useState<any[]>([]);
    const [showFlipCard, setShowFlipCard] = useState(false);
    const [showQuickQuiz, setShowQuickQuiz] = useState(false);
    const [showFocusMode, setShowFocusMode] = useState(false);
    const [quizOptions, setQuizOptions] = useState<string[]>([]);
    const [knowledgeLevel, setKnowledgeLevel] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [hasSpoken, setHasSpoken] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const stopRepeatRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const allData = (window as any).dictionaryData as any[][];

    // Detect theme mode
    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDarkMode(theme !== 'light');
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const type = wordData?.[1] || '';
    const swe = wordData?.[2] || '';
    const arb = wordData?.[3] || '';
    const arbExt = wordData?.[4] || '';
    const def = wordData?.[5] || '';
    const forms = wordData?.[6] || '';
    const exSwe = wordData?.[7] || '';
    const exArb = wordData?.[8] || '';

    const toggleFavorite = () => {
        HapticManager.medium();
        const newState = FavoritesManager.toggle(wordId.toString());
        setIsFav(newState);
        if (newState) { setIsHeartPop(true); setTimeout(() => setIsHeartPop(false), 300); }
    };

    const handleRepeat = async () => {
        HapticManager.light();
        if (isRepeating) { stopRepeatRef.current = true; setIsRepeating(false); TTSManager.stop(); return; }
        setIsRepeating(true); stopRepeatRef.current = false;
        for (let i = 0; i < 3; i++) {
            if (stopRepeatRef.current) break;
            await TTSManager.speak(swe, 'sv', { speed: 0.9, pitch: 1.05 });
            if (i < 2 && !stopRepeatRef.current) await new Promise(r => setTimeout(r, 800));
        }
        setIsRepeating(false);
    };

    const handleScroll = () => {
        if (containerRef.current) setScrollY(containerRef.current.scrollTop);
    };

    useEffect(() => {
        if (allData) {
            const found = allData.find(row => row[0].toString() === wordId.toString());
            if (found) {
                setWordData(found);
                setIsFav(FavoritesManager.has(wordId.toString()));
                setKnowledgeLevel(FavoritesManager.has(wordId.toString()) ? 75 : Math.floor(Math.random() * 40) + 10);

                const sweWord = found[2];
                setRelatedWords(allData.filter(row => row[2] !== sweWord && (row[2].toLowerCase().includes(sweWord.toLowerCase().slice(0, 3)) || row[1] === found[1])).slice(0, 5));

                const favIds = FavoritesManager.getAll();
                setSimilarFavorites(allData.filter(row => favIds.includes(row[0].toString()) && row[0].toString() !== wordId.toString() && row[1] === found[1]).slice(0, 4));

                const wrongOptions = allData.filter(row => row[3] !== found[3] && row[3]).sort(() => Math.random() - 0.5).slice(0, 3).map(r => r[3]);
                setQuizOptions([...wrongOptions, found[3]].sort(() => Math.random() - 0.5));
            }
        }
        if (containerRef.current) containerRef.current.scrollTop = 0;
        setHasSpoken(false);
    }, [wordId, allData]);

    // Auto-speak on load (Smart Card feature)
    useEffect(() => {
        if (swe && !hasSpoken) {
            setTimeout(() => TTSManager.speak(swe, 'sv'), 500);
            setHasSpoken(true);
        }
    }, [swe, hasSpoken]);

    const handleSmartLink = (word: string) => {
        HapticManager.light();
        const found = allData?.find(row => row[2].toLowerCase() === word.toLowerCase());
        if (found) {
            window.history.pushState({ view: 'details', id: found[0] }, '', `?id=${found[0]}`);
            window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'details', id: found[0] } }));
        }
    };

    const [note, setNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);
    useEffect(() => { const loadNote = async () => { const n = await DictionaryDB.getNote(wordId.toString()); setNote(n || ''); }; loadNote(); }, [wordId]);
    const handleSaveNote = async () => { setIsSavingNote(true); await DictionaryDB.saveNote(wordId.toString(), note); setIsSavingNote(false); showToast('تم حفظ الملاحظة!'); };

    if (!wordData) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>{t('details.loading')}</div>;

    const typeInfo = TypeColorSystem.detect(type, swe, forms, '', arb);
    const primaryColor = typeInfo.color.primary;
    const formsList = forms ? forms.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [];

    // Dynamic background opacity based on scroll
    const headerOpacity = Math.min(0.98, 0.85 + scrollY / 500);



    return (
        <div ref={containerRef} onScroll={handleScroll} className="details-page-container" style={{
            height: '100%', width: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
            background: 'rgba(5, 16, 36, 0.25)', display: 'flex', flexDirection: 'column',
            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y' // Fix for mobile scrolling
        }}>
            <style>{`
                @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                @keyframes glassSlideIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes floatHero { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            `}</style>

            {/* Background Bubbles Effect - Premium Feel - Floating OVER content via Portal */}




            {/* Fluid Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100,
                background: `rgba(10,10,12,${headerOpacity})`, backdropFilter: 'blur(30px) saturate(180%)',
                borderBottom: `1px solid ${primaryColor}15`, transition: 'background 0.3s'
            }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => { HapticManager.light(); onBack(); }}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>Detaljer</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { HapticManager.light(); setShowFocusMode(true); }}
                        style={{ background: `${primaryColor}18`, border: `1px solid ${primaryColor}35`, color: primaryColor, padding: '8px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>🎯 تركيز</button>
                    <button onClick={toggleFavorite}
                        style={{
                            background: isFav ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)', border: 'none', color: isFav ? '#ef4444' : 'rgba(255,255,255,0.5)',
                            width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            transform: isHeartPop ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.2s'
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "currentColor"} strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    </button>
                </div>
            </div>

            {/* FLOATING CARD HERO */}
            <div style={{
                padding: '30px 16px 40px',
                background: `linear-gradient(180deg, ${primaryColor}08 0%, transparent 100%)`,
                zIndex: 1
            }}>
                {/* Main Floating Card */}
                <div style={{
                    background: 'rgba(25, 25, 30, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '28px',
                    padding: '30px 24px',
                    border: `1px solid ${primaryColor}25`,
                    boxShadow: `
                        0 20px 60px rgba(0,0,0,0.5),
                        0 8px 25px rgba(0,0,0,0.3),
                        0 0 0 1px rgba(255,255,255,0.05),
                        inset 0 1px 0 rgba(255,255,255,0.05)
                    `,
                    position: 'relative',
                    overflow: 'hidden',
                    transform: 'none !important',
                    animation: 'none !important'
                }}>
                    {/* Top gradient accent */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                        borderRadius: '0 0 10px 10px'
                    }} />

                    {/* Local Bubbles for Hero Card */}
                    <BubblesBackground color={primaryColor} usePortal={false} />

                    {/* Swedish Word - Option 3: BOLD HEADLINE (CLEAN) */}
                    <h2 style={{
                        color: '#FFFFFF', // Always white as requested
                        fontSize: getSwedishFontSize(swe), // Dynamic based on text length
                        fontWeight: '900', // Ultra Bold
                        textTransform: 'uppercase', // Uppercase for headline feel
                        letterSpacing: '4px', // Wide spacing
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: 1.1,

                        // Black shadow as requested
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                        background: 'none',
                        WebkitTextFillColor: 'initial',

                        // 🔒 FORCE STOP ALL MOVEMENTS & ALLOW SCROLL
                        animation: 'none',
                        transition: 'none',
                        transform: 'none',
                        pointerEvents: 'none', // Fix scrolling issue

                        maxWidth: '100%',
                        padding: '0 10px'
                    }}>{swe}</h2>

                    {/* Divider - White */}
                    <div style={{
                        width: '50px',
                        height: '2px',
                        background: 'white',
                        margin: '16px auto',
                        borderRadius: '10px'
                    }} />

                    {/* Arabic Word */}
                    <p dir="rtl" style={{
                        fontSize: getArabicFontSize(arb), // Dynamic based on text length
                        color: 'rgba(255,255,255,0.85)',
                        margin: 0,
                        textAlign: 'center',
                        fontFamily: '"Tajawal", sans-serif',
                        fontWeight: '700',
                        pointerEvents: 'none' // Fix scrolling issue
                    }}>{arb}</p>

                    {/* Type Badge + Progress */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '15px',
                        marginTop: '20px'
                    }}>
                        <span style={{
                            background: `${primaryColor}18`,
                            color: primaryColor,
                            border: `1px solid ${primaryColor}40`,
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            {type === 'verb' ? '⚡' : type === 'substantiv' ? '📦' : type === 'adjektiv' ? '🎨' : '✨'} {type}
                        </span>
                        <span style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.7)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {knowledgeLevel}% {knowledgeLevel >= 70 ? '⭐' : knowledgeLevel >= 40 ? '📚' : '🆕'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Tabs System (Moved Here) */}
            <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto', width: '100%', marginBottom: '0', marginTop: '-20px', position: 'sticky', top: '65px', zIndex: 90 }}>
                <div style={{ display: 'flex', background: 'rgba(20, 20, 25, 0.85)', backdropFilter: 'blur(15px)', borderRadius: '16px 16px 0 0', padding: '4px', border: `1px solid ${primaryColor}25`, borderBottom: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <button onClick={() => { HapticManager.light(); setActiveTab('info'); }}
                        style={{ flex: 1, padding: '12px', background: activeTab === 'info' ? `${primaryColor}25` : 'transparent', border: activeTab === 'info' ? `1px solid ${primaryColor}30` : 'none', color: activeTab === 'info' ? '#fff' : 'rgba(255,255,255,0.4)', borderRadius: '12px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s' }}>📋 معلومات</button>
                    <button onClick={() => { HapticManager.light(); setActiveTab('interact'); }}
                        style={{ flex: 1, padding: '12px', background: activeTab === 'interact' ? `${primaryColor}25` : 'transparent', border: activeTab === 'interact' ? `1px solid ${primaryColor}30` : 'none', color: activeTab === 'interact' ? '#fff' : 'rgba(255,255,255,0.4)', borderRadius: '12px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s' }}>🎯 تعلم</button>
                </div>
            </div>

            {/* Modals (Moved Here) */}
            {showFlipCard && <FlipCard swe={swe} arb={arb} color={primaryColor} onClose={() => setShowFlipCard(false)} />}
            {showQuickQuiz && <QuickQuiz swe={swe} arb={arb} options={quizOptions} color={primaryColor} onClose={() => setShowQuickQuiz(false)} />}
            {showFocusMode && <FocusMode swe={swe} arb={arb} color={primaryColor} onClose={() => setShowFocusMode(false)} />}

            {/* Content Container (Moved Here) */}
            {/* Content Container (Moved Here) */}
            <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, marginTop: '10px' }}>










                {activeTab === 'info' ? (
                    <>
                        {/* Smart Knowledge Bar (Inside Info Tab) */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
                            margin: '-16px -16px 16px -16px', // Full width relative to this tab container
                            background: `linear-gradient(90deg, ${primaryColor}12, transparent)`,
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                {/* Small Progress Ring */}
                                <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                                    <svg width="50" height="50" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                                        <circle cx="25" cy="25" r="20" fill="none" stroke={primaryColor} strokeWidth="4"
                                            strokeDasharray={2 * Math.PI * 20} strokeDashoffset={(2 * Math.PI * 20) - (knowledgeLevel / 100) * (2 * Math.PI * 20)}
                                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                                    </svg>
                                    <div style={{
                                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: '700', color: primaryColor
                                    }}>{knowledgeLevel}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>مستوى معرفتك</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                                        {knowledgeLevel >= 70 ? '⭐ متقن' : knowledgeLevel >= 40 ? '📚 تتعلم' : '🆕 جديد'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => { HapticManager.light(); TTSManager.speak(swe, 'sv'); }}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                                        padding: '9px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                                    }}>🔊 استمع</button>
                                <button onClick={() => { HapticManager.light(); setShowFlipCard(true); }}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                                        padding: '9px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                                    }}>🎴 بطاقة</button>
                                <button onClick={() => { HapticManager.light(); setShowQuickQuiz(true); }}
                                    style={{
                                        background: `${primaryColor}18`, border: `1px solid ${primaryColor}35`, color: primaryColor,
                                        padding: '9px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                                    }}>⚡ تحدي</button>
                            </div>
                        </div>

                        {(similarFavorites.length > 0) && (
                            <GlassCard title="كلمات مشابهة حفظتها" icon="⭐" color={primaryColor} delay={0}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingBottom: '0' }}>
                                    {similarFavorites.map(w => (
                                        <button key={w[0]} onClick={() => handleSmartLink(w[2])}
                                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 18px', borderRadius: '16px', flex: '1 1 30%', color: '#fff', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <span>{w[2]}</span><span style={{ fontSize: '0.75rem', color: primaryColor }}>{w[3]}</span>
                                        </button>
                                    ))}
                                </div>
                            </GlassCard>
                        )}
                        <AIAnalysis word={swe} type={type} forms={forms} />
                        <AIStoryFlash swe={swe} arb={arb} type={type} exampleSwe={exSwe} exampleArb={exArb} />
                        <GlassCard title={t('details.meaning')} icon="📝" color={primaryColor} delay={0.1}>
                            {arbExt && <div dir="rtl" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', fontFamily: '"Tajawal", sans-serif', lineHeight: 1.6, marginBottom: def ? '12px' : 0 }}>{arbExt}</div>}
                            {def && <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}><SmartLinkedText text={def} onLinkClick={handleSmartLink} /></div>}
                        </GlassCard>


                        {formsList.length > 0 && (
                            <GlassCard title={t('details.forms')} icon="🔗" color={primaryColor} delay={0.3}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {formsList.map((f: string, i: number) => <FormChip key={i} form={f} color={primaryColor} />)}
                                </div>
                            </GlassCard>
                        )}

                        <GlassCard title="كلمات ذات صلة" icon="✨" color={primaryColor}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingBottom: '0', paddingTop: '4px' }}>
                                {relatedWords.map(rw => (
                                    <button key={rw[0]} onClick={() => handleSmartLink(rw[2])}
                                        style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 20px', borderRadius: '18px', flex: '1 1 30%', minWidth: '135px', minHeight: '80px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem', marginBottom: '6px', whiteSpace: 'nowrap' }}>{rw[2]}</div>
                                        <div dir="rtl" style={{ fontSize: '0.85rem', color: primaryColor, fontFamily: '"Tajawal", sans-serif', opacity: 0.9 }}>{rw[3]}</div>
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                        <GlassCard title="ملاحظاتك" icon="✍️" color={primaryColor} delay={0.4}>
                            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="اكتب ملاحظة..."
                                style={{ width: '100%', minHeight: '85px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px', color: '#fff', fontSize: '0.9rem', resize: 'none', marginBottom: '12px' }} />
                            <button onClick={handleSaveNote} disabled={isSavingNote}
                                style={{ width: '100%', padding: '13px', borderRadius: '14px', background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}bb)`, border: 'none', color: '#fff', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', opacity: isSavingNote ? 0.6 : 1, boxShadow: `0 8px 25px ${primaryColor}30` }}>
                                {isSavingNote ? '⏳ جاري الحفظ...' : '💾 حفظ الملاحظة'}
                            </button>
                        </GlassCard>
                    </>
                ) : (
                    <>

                        <PronunciationLab word={swe} />
                        <div style={{ height: '14px' }} />
                        <MiniQuiz wordData={wordData} />
                        <div style={{ height: '14px' }} />
                        {exSwe && (
                            <SentenceBuilder sentence={exSwe} translation={exArb} color={primaryColor} />
                        )}

                    </>
                )}
            </div>





            <div style={{ height: '100px', flexShrink: 0 }} />
        </div>
    );
};
