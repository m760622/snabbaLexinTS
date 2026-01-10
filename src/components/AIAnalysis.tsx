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
        let tips: string[] = [];
        
        if (cleanType.includes('verb')) {
            tips.push("Använd 'att' framför ordet i grundform.");
            if (forms.includes('ade')) tips.push("Detta verkar vara ett regelbundet verb (Grupp 1).");
        } else if (cleanType.includes('subst')) {
            if (forms.includes('en ') || forms.endsWith('en')) tips.push("Detta är ett utrum (en-ord).");
            else if (forms.includes('ett ') || forms.endsWith('et')) tips.push("Detta är ett neutrum (ett-ord).");
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
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#aaa' }}>GRAMMATIK-ANALYS</span>
                <div dangerouslySetInnerHTML={{ __html: badgeHtml }} />
            </div>
            
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#ddd', fontSize: '0.85rem' }}>
                {tips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>{tip}</li>
                ))}
                {tips.length === 0 && <li>Ingen specifik analys tillgänglig för denna ordtyp.</li>}
            </ul>
        </div>
    );
};
