import React from 'react';
import { GrammarHelper } from '../utils/utils';

interface AIAnalysisProps {
    word: string;
    type: string;
    forms: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ word, type, forms }) => {
    const badgeHtml = GrammarHelper.getBadge(type, forms, word);

    // Simple analysis logic
    const analyze = () => {
        const cleanType = type.toLowerCase();
        let tips: { sv: string, ar: string }[] = [];

        if (cleanType.includes('verb')) {
            tips.push({
                sv: "Använd 'att' framför ordet i grundform.",
                ar: "استخدم 'att' قبل الفعل في صيغته الأساسية (المصدر)."
            });
            if (forms.includes('ade')) {
                tips.push({
                    sv: "Detta verkar vara ett regelbundet verb (Grupp 1).",
                    ar: "يبدو أن هذا فعل منتظم (المجموعة 1 - ينتهي بـ ar)."
                });
            } else if (forms.includes('er, de, t') || forms.includes('er, te, t')) {
                tips.push({
                    sv: "Detta verkar vara ett verb i Grupp 2.",
                    ar: "يبدو أن هذا فعل من المجموعة 2 (ينتهي بـ er)."
                });
            } else if (forms.includes(', , ')) {
                tips.push({
                    sv: "Detta kan vara ett oregelbundet verb (Grupp 4).",
                    ar: "قد يكون هذا فعلاً شاذًا/قويًا (المجموعة 4)."
                });
            }
        } else if (cleanType.includes('subst')) {
            if (forms.includes('en ') || forms.endsWith('en')) {
                tips.push({
                    sv: "Detta är ett utrum (en-ord).",
                    ar: "هذه الكلمة من نوع 'En' (مشترك للجنس)."
                });
            } else if (forms.includes('ett ') || forms.endsWith('et')) {
                tips.push({
                    sv: "Detta är ett neutrum (ett-ord).",
                    ar: "هذه الكلمة من نوع 'Ett' (محايد)."
                });
            }

            if (forms.includes('ar') || forms.includes('or') || forms.includes('er')) {
                tips.push({
                    sv: "Pluralformen ändras med ändelser.",
                    ar: "صيغة الجمع تتغير بإضافة لواحق محددة."
                });
            } else if (forms.includes('=')) {
                tips.push({
                    sv: "Ordet har samma form i singular och plural.",
                    ar: "الكلمة لها نفس الشكل في المفرد والجمع."
                });
            }
        } else if (cleanType.includes('adj')) {
            tips.push({
                sv: "Adjektivet böjs efter substantivets kön (en/ett).",
                ar: "يتم تصريف الصفة حسب جنس الاسم (en/ett)."
            });
        }

        return tips;
    };

    const tips = analyze();

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '15px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🧠</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#aaa' }}>GRAMMATIK-ANALYS / تحليل القواعد</span>
                <div dangerouslySetInnerHTML={{ __html: badgeHtml }} />
            </div>

            <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                {tips.map((tip, i) => (
                    <li key={i} style={{
                        marginBottom: '10px',
                        padding: '10px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #60a5fa'
                    }}>
                        <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '4px', fontWeight: '500' }}>{tip.sv}</div>
                        <div dir="rtl" style={{ color: '#94a3b8', fontSize: '0.9rem', fontFamily: '"Tajawal", sans-serif' }}>{tip.ar}</div>
                    </li>
                ))}
                {tips.length === 0 && (
                    <li style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '10px' }}>
                        Ingen specifik analys tillgänglig. / لا يوجد تحليل محدد.
                    </li>
                )}
            </ul>
        </div>
    );
};
