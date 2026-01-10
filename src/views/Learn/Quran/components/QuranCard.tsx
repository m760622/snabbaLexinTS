import React from 'react';
import { QuranEntry } from '../types';
import { TTSManager } from '../../../../services/tts.service';

interface QuranCardProps {
    item: QuranEntry;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    onShare: (item: QuranEntry) => void;
}

const QuranCard: React.FC<QuranCardProps> = ({ 
    item, 
    isFavorite, 
    onToggleFavorite,
    onShare
}) => {
    
    // Simple root extraction if not present
    const root = item.root || item.word.replace(/[^\u0621-\u064A]/g, '').substring(0, 3);
    
    // Highlight word in ayah
    const displayAyah = item.ayah_full.replace(item.word, `<span class="highlight-word">${item.word}</span>`);

    const handlePlayTTS = (e: React.MouseEvent, text: string, lang: string) => {
        e.stopPropagation();
        if (TTSManager) {
            TTSManager.speak(text, lang === 'ar-SA' ? 'ar' : 'sv');
        }
    };

    return (
        <div className="quran-card">
            <div className="card-header">
                <div className="left-actions">
                    <span className="badger surah-badge">{item.surah}</span>
                    <button className="badger root-badge">
                        <span className="badger-icon">🌱</span>
                        <span className="sv-text">Rot: {root}</span>
                        <span className="ar-text">جذر: {root}</span>
                    </button>
                </div>
                <div className="action-group">
                    <button className="share-btn" title="Dela" onClick={(e) => { e.stopPropagation(); onShare(item); }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-sm"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                    <button 
                        className={`fav-btn ${isFavorite ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }} 
                        title="Spara till favoriter"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-sm"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                </div>
            </div>
            
            <div className="main-word-section">
                <span className="target-word" data-auto-size>{item.word}</span>
                <span className="meaning-ar" data-auto-size>{item.meaning_ar}</span>
                <div className="word-sv-container">
                    <span className="word-sv-accent" data-auto-size>{item.word_sv}</span>
                    <div className="word-actions">
                        <button className="icon-btn" onClick={(e) => handlePlayTTS(e, item.word_sv, 'sv-SE')}>🔊</button> 
                        <button className="icon-btn" title="Tafsir/Info">ℹ️</button>
                    </div>
                </div>
             </div>

            <div className="ayah-section">
                <div className="ayah-full" data-auto-size dangerouslySetInnerHTML={{ __html: displayAyah }}></div>
                
                <div className="media-bar">
                    <button className="media-btn play-ayah-btn" onClick={(e) => handlePlayTTS(e, item.ayah_full, 'ar-SA')}>
                        <span className="icon-lg">🕌</span> <span className="btn-text">Tilaawah</span>
                    </button>
                    
                    <button className="media-btn mic-btn">
                        <span className="icon-lg">🎙️</span>
                    </button>
                </div>

                <div className="ayah-sv text-muted" data-auto-size>{item.ayah_sv}</div>
            </div>
        </div>
    );
};

export default QuranCard;
