import React from 'react';
import { CognateEntry } from '../types';
import { TTSManager } from '../../../../tts';

interface CognateCardProps {
    cognate: CognateEntry;
    isSaved: boolean;
    isLearned: boolean;
    onToggleSave: (word: string) => void;
}

const CognateCard: React.FC<CognateCardProps> = ({ 
    cognate, 
    isSaved, 
    isLearned, 
    onToggleSave 
}) => {
    
    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (TTSManager) {
            TTSManager.speak(cognate.swe, 'sv');
        } else {
            const utterance = new SpeechSynthesisUtterance(cognate.swe);
            utterance.lang = 'sv-SE';
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className={`cognate-card ${isLearned ? 'learned' : ''} ${isSaved ? 'saved' : ''}`} onClick={handleSpeak}>
            <div>
                <span className="word-swe" data-auto-size>{cognate.swe}</span>
                <span className="speaker-icon">🔊</span>
                {cognate.type && <span className="word-type">{cognate.type}</span>}
            </div>
            <div className="flex-center-gap">
                <span className="word-arb" data-auto-size>{cognate.arb}</span>
                <button 
                    className={`mini-btn ${isSaved ? 'saved' : ''}`} 
                    onClick={(e) => { e.stopPropagation(); onToggleSave(cognate.swe); }}
                >
                    {isSaved ? '⭐' : '☆'}
                </button>
            </div>
        </div>
    );
};

export default CognateCard;
