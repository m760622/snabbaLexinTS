import React from 'react';
import { Proverb } from '../types';
import { TTSManager } from '../../../../services/tts.service';

interface ProverbCardProps {
    proverb: Proverb;
    isSaved: boolean;
    isLearned: boolean;
    onToggleSave: (id: number) => void;
    onToggleLearned: (id: number) => void;
}

const ProverbCard: React.FC<ProverbCardProps> = ({ 
    proverb, 
    isSaved, 
    isLearned, 
    onToggleSave, 
    onToggleLearned 
}) => {
    
    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (TTSManager) {
            TTSManager.speak(proverb.swedishProverb, 'sv');
        } else {
            const utterance = new SpeechSynthesisUtterance(proverb.swedishProverb);
            utterance.lang = 'sv-SE';
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="proverb-card">
            <div className="proverb-header">
                <span className="proverb-number">{proverb.id}</span>
                <div className="proverb-actions">
                    <button className="speak-btn" onClick={handleSpeak} title="Lyssna / استمع">🔊</button>
                    <button 
                        className={`save-btn ${isSaved ? 'saved' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); onToggleSave(proverb.id); }} 
                        title="Spara / حفظ"
                    >
                        {isSaved ? '⭐' : '☆'}
                    </button>
                    <button 
                        className={`learn-btn ${isLearned ? 'learned' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); onToggleLearned(proverb.id); }} 
                        title="Lärt / تعلمت"
                    >
                        {isLearned ? '✅' : '⬜'}
                    </button>
                </div>
            </div>
            <div className="proverb-swedish">{proverb.swedishProverb}</div>
            <div className="proverb-literal">📝 {proverb.literalMeaning}</div>
            <div className="proverb-arabic">🌙 {proverb.arabicEquivalent}</div>
            
            {proverb.verb && (
                <div className="verb-conjugation">
                    <div className="verb-header">
                        <span className="verb-main">{proverb.verb}</span>
                        <span className="verb-translation">{proverb.verbTranslation}</span>
                    </div>
                    <div className="verb-forms">
                        <div className="verb-form"><span className="label">Infinitiv</span><span className="value">{proverb.verbInfinitive}</span></div>
                        <div className="verb-form"><span className="label">Presens</span><span className="value">{proverb.verbPresent}</span></div>
                        <div className="verb-form"><span className="label">Preteritum</span><span className="value">{proverb.verbPast}</span></div>
                        <div className="verb-form"><span className="label">Supinum</span><span className="value">{proverb.verbSupine}</span></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProverbCard;
