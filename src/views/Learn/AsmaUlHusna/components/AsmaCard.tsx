import React from 'react';
import { AsmaName } from '../types';
import { TTSManager } from '../../../../tts';

interface AsmaCardProps {
    name: AsmaName;
    isFavorite: boolean;
    isMemorized: boolean;
    category: 'jalal' | 'jamal' | 'kamal';
    currentLang: 'ar' | 'sv';
    onToggleFavorite: (nr: number) => void;
    onToggleMemorized: (nr: number) => void;
}

const AsmaCard: React.FC<AsmaCardProps> = ({ 
    name, 
    isFavorite, 
    isMemorized, 
    category, 
    currentLang,
    onToggleFavorite, 
    onToggleMemorized 
}) => {
    
    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        const text = currentLang === 'ar' ? name.nameAr : name.nameSv;
        const lang = currentLang === 'ar' ? 'ar-SA' : 'sv-SE';
        
        if (TTSManager) {
            TTSManager.speak(text, lang === 'ar-SA' ? 'ar' : 'sv');
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            speechSynthesis.speak(utterance);
        }
    };

    const categoryLabel = category === 'jalal' ? 'الجلال' : category === 'jamal' ? 'الجمال' : 'الكمال';
    const hasConjugation = name.pastAr !== '-';

    return (
        <div className={`asma-card ${isMemorized ? 'memorized' : ''}`}>
            {isMemorized && <div className="memorized-badge">✓ محفوظ</div>}
            
            <div className={`category-badge ${category}`}>{categoryLabel}</div>

            <div className="asma-card-header">
                <div className="asma-number">{name.nr}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="asma-speak-btn" onClick={handleSpeak} title="Lyssna / استمع">
                        🔊
                    </button>
                    <button 
                        className={`asma-favorite-btn ${isFavorite ? 'favorited' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(name.nr); }} 
                        title="Spara / حفظ"
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
            
            <div className={`asma-name-ar ${currentLang === 'ar' ? 'lang-primary' : 'lang-secondary'}`}>{name.nameAr}</div>
            <div className={`asma-name-sv ${currentLang === 'sv' ? 'lang-primary' : 'lang-secondary'}`}>{name.nameSv}</div>
            
            <div className="asma-meaning">
                <div className={`asma-meaning-ar ${currentLang === 'ar' ? 'lang-primary' : 'lang-secondary'}`}>{name.meaningAr}</div>
                <div className={`asma-meaning-sv ${currentLang === 'sv' ? 'lang-primary' : 'lang-secondary'}`}>{name.meaningSv}</div>
            </div>
            
            {hasConjugation && (
                <div className="asma-conjugation">
                    <div className="conj-item">
                        <div className="conj-label">الماضي</div>
                        <div className="conj-ar">{name.pastAr}</div>
                        <div className="conj-sv">{name.pastSv}</div>
                    </div>
                    <div className="conj-item">
                        <div className="conj-label">المضارع</div>
                        <div className="conj-ar">{name.presentAr}</div>
                        <div className="conj-sv">{name.presentSv}</div>
                    </div>
                    <div className="conj-item">
                        <div className="conj-label">المصدر</div>
                        <div className="conj-ar">{name.masdarAr}</div>
                        <div className="conj-sv">{name.masdarSv}</div>
                    </div>
                </div>
            )}
            
            <div className="asma-verse">
                <div className="verse-icon">📖</div>
                <div className="verse-ar">{name.verseAr}</div>
                <div className="verse-sv">{name.verseSv}</div>
            </div>
            
            <div className="asma-card-actions">
                <button 
                    className={`asma-memorize-btn ${isMemorized ? 'active' : ''}`} 
                    onClick={(e) => { e.stopPropagation(); onToggleMemorized(name.nr); }}
                >
                    {isMemorized ? '✓ تم الحفظ' : '📝 تحديد كمحفوظ'}
                </button>
            </div>
        </div>
    );
};

export default AsmaCard;
