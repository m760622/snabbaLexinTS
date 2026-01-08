import React, { useEffect, useState } from 'react';
import { TypeColorSystem } from './type-color-system';
import { TTSManager } from './tts';
import { FavoritesManager } from './favorites';
import { showToast, TextSizeManager } from './utils';
import { PronunciationLab } from './components/PronunciationLab';
import { MiniQuiz } from './components/MiniQuiz';
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
    const [relatedWords, setRelatedWords] = useState<any[]>([]);
    
    const allData = (window as any).dictionaryData as any[][];
    
    const heroSweRef = React.useRef<HTMLHeadingElement>(null);
    const heroArbRef = React.useRef<HTMLParagraphElement>(null);

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
        window.scrollTo(0, 0);
    }, [wordId, allData]);

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
        <div style={{ paddingBottom: '100px', minHeight: '100vh', background: '#121212' }}>
            {/* Nav Header */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '12px 16px', position: 'sticky', top: 0, 
                zIndex: 100, background: 'rgba(18,18,18,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #333'
            }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => TTSManager.speak(swe, 'sv')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>🔊</button>
                    <button onClick={() => { FavoritesManager.toggle(id.toString()); setIsFav(!isFav); }} style={{ background: 'none', border: 'none', color: isFav ? '#F59E0B' : '#888', cursor: 'pointer' }}>⭐</button>
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
                        {forms && <Card title={t('details.forms')} icon="🔗">{forms}</Card>}
                        {(def || arbExt) && (
                            <Card title={t('details.meaning')} icon="📝">
                                {def && <div style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#fff', marginBottom: arbExt ? '12px' : 0 }}>
                                    <SmartLinkedText text={def} onLinkClick={handleSmartLink} />
                                </div>}
                                {arbExt && <div dir="rtl" style={{ fontSize: '1.1rem', color: '#bbb', borderTop: def ? '1px solid #333' : 'none', paddingTop: def ? '12px' : 0, fontFamily: '"Tajawal", sans-serif' }}>
                                    {arbExt}
                                </div>}
                            </Card>
                        )}
                        {(exSwe || exArb) && (
                            <Card title={t('learn.examples')} icon="💡">
                                {exSwe && <div style={{ fontStyle: 'italic', marginBottom: '8px', color: '#eee' }}><SmartLinkedText text={exSwe} onLinkClick={handleSmartLink} /></div>}
                                {exArb && <div dir="rtl" style={{ color: '#aaa', fontFamily: '"Tajawal", sans-serif' }}>{exArb}</div>}
                            </Card>
                        )}
                        {(idiomSwe || idiomArb) && (
                            <Card title={t('details.idiom')} icon="💬">
                                {idiomSwe && <div style={{ marginBottom: '8px', color: '#fff' }}><SmartLinkedText text={idiomSwe} onLinkClick={handleSmartLink} /></div>}
                                {idiomArb && <div dir="rtl" style={{ color: '#bbb', fontFamily: '"Tajawal", sans-serif' }}>{idiomArb}</div>}
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
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {relatedWords.map(rw => (
                                    <div key={rw[0]} onClick={() => handleSmartLink(rw[2])} style={{ background: '#2c2c2e', padding: '10px', borderRadius: '8px', minWidth: '120px', cursor: 'pointer', border: '1px solid #333' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{rw[2]}</div>
                                        <div dir="rtl" style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px', fontFamily: '"Tajawal", sans-serif' }}>{rw[3]}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};