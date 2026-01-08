import React, { useState, useEffect } from 'react';

interface AIStoryFlashProps {
    swe: string;
    arb: string;
    type: string;
}

const templates = [
    {
        sv: "Det var en gång en person som använde ordet **{word}**. Hen märkte att **{word}** förändrade allt i rummet. Till slut blev **{word}** en del av hens vardag.",
        ar: "كان يا ما كان، شخص استخدم كلمة **{trans}**. لاحظ أن **{trans}** غيّر كل شيء في المكان. وفي النهاية، أصبح **{trans}** جزءاً من حياته اليومية."
    },
    {
        sv: "I en futuristisk stad betydده {word} frihet. Alla som sa **{word}** kände en inre styrka. Det var början på en ny era av **{word}**.",
        ar: "في مدينة مستقبلية، كانت **{trans}** تعني الحرية. كل من قال **{trans}** شعر بقوة داخلية. كانت تلك بداية عصر جديد من **{trans}**."
    },
    {
        sv: "När solen gick ner, viskade vinden **{word}**. Skogen svarade med ett eko av **{word}**. Hela världen tycktes förstå innebörden av **{word}**.",
        ar: "عندما غربت الشمس، همست الرياح بـ **{trans}**. أجابت الغابة بصدى **{trans}**. بدا وكأن العالم كله فهم معنى **{trans}**."
    },
    {
        sv: "Mästaren sa till sin elev: 'Lär dig **{word}** väl'. Eleven övade på **{word}** dag och natt. Nu är eleven en mästare på **{word}**.",
        ar: "قال المعلم لتلميذه: 'تعلم **{trans}** جيداً'. تدرب التلميذ على **{trans}** ليلاً ونهاراً. الآن أصبح التلميذ بارعاً في **{trans}**."
    }
];

export const AIStoryFlash: React.FC<AIStoryFlashProps> = ({ swe, arb, type }) => {
    const [status, setStatus] = useState<'idle' | 'busy' | 'ready' | 'error'>('idle');
    const [content, setContent] = useState<{ sv: string, ar: string } | null>(null);

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
        
        // Pick a random template
        const template = templates[Math.floor(Math.random() * templates.length)];
        const finalSv = template.sv.replace(/{word}/g, swe);
        const finalAr = template.ar.replace(/{trans}/g, arb);

        // Simulation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setContent({ sv: finalSv, ar: finalAr });
        setStatus('ready');
    };

    const formatText = (text: string, color: string) => {
        if (!text) return null;
        return text.split('**').map((part, i) => 
            i % 2 === 1 ? (
                <strong key={i} style={{ color: color, textShadow: `0 0 15px ${color}44`, fontWeight: '900' }}>
                    {part}
                </strong>
            ) : part
        );
    };

    if (status === 'error') return null;

    if (status === 'idle') {
        return (
            <div style={{ textAlign: 'center', margin: '25px 0' }}>
                <button 
                    onClick={handleGenerate}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        color: 'white', border: 'none', padding: '14px 32px',
                        borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold',
                        cursor: 'pointer', boxShadow: '0 10px 20px rgba(168, 85, 247, 0.3)',
                        display: 'inline-flex', alignItems: 'center', gap: '12px'
                    }}
                >
                    <span style={{ fontSize: '1.4rem' }}>✨</span>
                    <span>AI Story Flash</span>
                </button>
            </div>
        );
    }

    if (status === 'busy') {
        return (
            <div style={{ 
                padding: '40px', textAlign: 'center', background: '#1c1c1e', 
                borderRadius: '24px', border: '1px solid #333', margin: '25px 0' 
            }}>
                <div style={{
                    width: '50px', height: '50px', border: '4px solid #6366f1',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    margin: '0 auto 20px', animation: 'ai-spin 0.8s linear infinite'
                }}></div>
                <div style={{ color: '#888', fontWeight: 'bold' }}>
                    Generating {type} Story... <br/> 
                    <span dir="rtl" style={{ fontFamily: '"Tajawal", sans-serif', color: '#a855f7', display: 'block', marginTop: '10px' }}>
                        جاري تأليف قصة ({type})...
                    </span>
                </div>
                <style>{`@keyframes ai-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="ai-story-card" style={{
            background: '#1c1c1e', borderRadius: '24px', padding: '30px',
            margin: '25px 0', border: '1px solid #333', boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                background: 'linear-gradient(90deg, #6366f1, #a855f7)'
            }}></div>

            {/* Swedish Content - Always Visible */}
            <div style={{ 
                fontSize: '1.25rem', lineHeight: 1.7, color: '#fff', 
                marginBottom: '25px', textAlign: 'center' 
            }}>
                {formatText(content?.sv || '', '#818cf8')}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#333', margin: '25px 0' }}></div>

            {/* Arabic Content - Forced Visibility - Not using .ar-text class */}
            <div dir="rtl" style={{ 
                fontSize: '1.6rem', lineHeight: 2, color: '#fff', 
                fontFamily: '"Tajawal", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif', 
                textAlign: 'center',
                display: 'block', // Force display
                visibility: 'visible', // Force visibility
                opacity: 1 // Force opacity
            }}>
                {formatText(content?.ar || '', '#a855f7')}
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                <button 
                    onClick={handleGenerate}
                    style={{ 
                        background: 'rgba(255,255,255,0.05)', border: '1px solid #444', 
                        color: '#eee', padding: '8px 20px', borderRadius: '20px', 
                        fontSize: '0.85rem', cursor: 'pointer'
                    }}
                >
                    🔄 Try another / <span dir="rtl">تغيير القصة</span>
                </button>
                <button 
                    onClick={() => setStatus('idle')}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                    Close / إغلاق
                </button>
            </div>
        </div>
    );
};
