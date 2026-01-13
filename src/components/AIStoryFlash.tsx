import React, { useState, useEffect } from 'react';

interface AIStoryFlashProps {
    swe: string;
    arb: string;
    type: string;
    exampleSwe?: string;
    exampleArb?: string;
}

// 🧠 POS-Aware Templates (Fallback)
const posTemplates: Record<string, { sv: string, ar: string }[]> = {
    vb: [
        { sv: "Det krävs mod för att våga **{word}** i en osäker tid.", ar: "يتطلب الأمر شجاعة لـ **{trans}** في زمن غير مستقر." },
        { sv: "Hon bestämde sig för att **{word}** och aldrig se tillbaka.", ar: "قررت أن **{trans}** وألا تنظر للوراء أبداً." },
        { sv: "Om du vill lyckas måste du lära dig att **{word}** effektivt.", ar: "إذا أردت النجاح، عليك أن تتعلم كيف **{trans}** بفعالية." }
    ],
    nn: [
        { sv: "En enda **{word}** kan förändra hela historien.", ar: "يمكن لـ **{trans}** واحدة أن تغير مجرى التاريخ بأكمله." },
        { sv: "Utan **{word}** känns livet tomt och färglöst.", ar: "بدون **{trans}** تبدو الحياة فارغة وباهتة." },
        { sv: "Detta är ingen vanlig **{word}**, det är ett mästerverk.", ar: "هذه ليست مجرد **{trans}** عادية، إنها تحفة فنية." }
    ],
    jj: [
        { sv: "Världen såg plötsligt **{word}** ut genom hennes ögon.", ar: "بدا العالم فجأة **{trans}** من خلال عينيها." },
        { sv: "Det var en **{word}** känsla som spred sig i rummet.", ar: "كان شعوراً **{trans}** انتشر في الغرفة." }
    ],
    other: [
        { sv: "Det hände **{word}** och ingen var beredd.", ar: "حدث ذلك **{trans}** ولم يكن أحد مستعداً." },
        { sv: "Livet blir bättre när man lever **{word}**.", ar: "تصبح الحياة أفضل عندما يعيش المرء **{trans}**." }
    ]
};

export const AIStoryFlash: React.FC<AIStoryFlashProps> = ({ swe, arb, type, exampleSwe, exampleArb }) => {
    const [status, setStatus] = useState<'idle' | 'busy' | 'ready' | 'error'>('idle');
    const [content, setContent] = useState<{ sv: string, ar: string, tag: string, isReal: boolean } | null>(null);

    // Reset when word changes
    useEffect(() => {
        setStatus('idle');
        setContent(null);
    }, [swe, arb]);

    const handleGenerate = async () => {
        if (!swe || !arb) {
            setStatus('error');
            return;
        }

        setStatus('busy');

        // Priority 1: Check for Real Dictionary Examples
        if (exampleSwe && exampleArb) {
            // Emulate "Searching" delay for UX consistency
            await new Promise(resolve => setTimeout(resolve, 600));
            setContent({
                sv: exampleSwe,
                ar: exampleArb,
                tag: '📚 Dictionary Context',
                isReal: true
            });
            setStatus('ready');
            return;
        }

        // Priority 2: Fallback to POS Templates
        const cleanType = (type || '').toLowerCase().trim();
        let category = 'other';
        if (cleanType.includes('vb')) category = 'vb';
        else if (cleanType.includes('nn') || cleanType.includes('subst')) category = 'nn';
        else if (cleanType.includes('jj') || cleanType.includes('adj')) category = 'jj';

        const selectedTemplates = posTemplates[category] || posTemplates['other'];
        const template = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];

        const finalSv = template.sv.replace(/{word}/g, swe);
        const finalAr = template.ar.replace(/{trans}/g, arb);

        await new Promise(resolve => setTimeout(resolve, 800));

        const labels: Record<string, string> = {
            vb: 'Verb Action 🏃', nn: 'Noun Context 📦', jj: 'Descriptive 🎨', other: 'General Context 🌍'
        };

        setContent({
            sv: finalSv,
            ar: finalAr,
            tag: labels[category],
            isReal: false
        });
        setStatus('ready');
    };

    const formatText = (text: string, color: string, highlightWord: string) => {
        if (!text) return null;

        // If it's a real example, we try to highlight the word if possible, else just show text
        // If it's a template, we use ** markers.
        if (text.includes('**')) {
            return text.split('**').map((part, i) =>
                i % 2 === 1 ? (
                    <strong key={i} style={{ color: color, textShadow: `0 0 15px ${color}44`, fontWeight: '900' }}>
                        {part}
                    </strong>
                ) : part
            );
        } else {
            // Simple highlight for real examples if word exists case-insensitive
            const parts = text.split(new RegExp(`(${highlightWord})`, 'gi'));
            return parts.map((part, i) =>
                part.toLowerCase() === highlightWord.toLowerCase() ? (
                    <strong key={i} style={{ color: color, fontWeight: '900', textDecoration: 'underline decoration-dotted' }}>
                        {part}
                    </strong>
                ) : part
            );
        }
    };

    if (status === 'error') return null;

    if (status === 'idle') {
        const isRealAvailable = !!(exampleSwe && exampleArb);
        return (
            <div style={{ textAlign: 'center', margin: '25px 0' }}>
                <button
                    onClick={handleGenerate}
                    style={{
                        background: isRealAvailable
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // Green for Real Data
                            : 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)', // Blue for AI
                        color: 'white', border: 'none', padding: '14px 32px',
                        borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold',
                        cursor: 'pointer', boxShadow: isRealAvailable ? '0 10px 20px rgba(16, 185, 129, 0.3)' : '0 10px 20px rgba(30, 58, 138, 0.3)',
                        display: 'inline-flex', alignItems: 'center', gap: '12px',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={{ fontSize: '1.4rem' }}>{isRealAvailable ? '📖' : '✨'}</span>
                    <span>{isRealAvailable ? 'Visa Exempel' : 'AI Story Flash'}</span>
                </button>
            </div>
        );
    }

    if (status === 'busy') {
        return (
            <div style={{
                padding: '40px', textAlign: 'center', background: '#1c1c1e',
                borderRadius: '24px', border: '1px solid #333', margin: '25px 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${exampleSwe ? '#10b981' : '#3b82f6'}, transparent, ${exampleSwe ? '#10b981' : '#3b82f6'})`,
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <div style={{ color: '#aaa', fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {exampleSwe ? 'HÄMTAR KONTEXT...' : 'SKAPAR MENING...'}
                </div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{
            background: content?.isReal
                ? 'linear-gradient(160deg, #064e3b 0%, #022c22 100%)' // Deep Green for Real
                : 'linear-gradient(160deg, #1c1c1e 0%, #0f172a 100%)', // Blue/Dark for AI
            borderRadius: '24px', padding: '30px',
            margin: '25px 0', border: `1px solid ${content?.isReal ? '#059669' : '#333'}`,
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                background: content?.isReal
                    ? 'linear-gradient(90deg, #34d399, #10b981)'
                    : 'linear-gradient(90deg, #3b82f6, #818cf8)'
            }}></div>

            {/* Tag Badge */}
            <div style={{
                position: 'absolute', top: '15px', right: '15px',
                background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px',
                fontSize: '0.75rem', color: '#fff', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {content?.tag}
            </div>

            {/* Swedish Content */}
            <div style={{
                fontSize: '1.3rem', lineHeight: 1.6, color: '#e2e8f0',
                marginBottom: '25px', textAlign: 'center',
                fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em'
            }}>
                {formatText(content?.sv || '', content?.isReal ? '#34d399' : '#60a5fa', swe)}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', margin: '25px 0' }}></div>

            {/* Arabic Content */}
            <div dir="rtl" style={{
                fontSize: '1.6rem', lineHeight: 1.8, color: '#f8fafc',
                fontFamily: '"Tajawal", sans-serif',
                textAlign: 'center', fontWeight: '500'
            }}>
                {formatText(content?.ar || '', content?.isReal ? '#34d399' : '#3b82f6', arb)}
            </div>

            {/* Footer buttons - Only for AI generated content */}
            {!content?.isReal && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                    <button
                        onClick={handleGenerate}
                        style={{
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff', padding: '10px 24px', borderRadius: '20px',
                            fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        🔄 Ny Mening
                    </button>
                </div>
            )}
        </div>
    );
};
