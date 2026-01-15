import React from 'react';

interface QuickAccessRowProps {
    onNavigate: (view: 'quran' | 'asma' | 'ordsprak' | 'cognates') => void;
}

const QuickAccessRow: React.FC<QuickAccessRowProps> = ({ onNavigate }) => {
    return (
        <div className="quick-access-row">
            <button className="quick-btn" onClick={() => onNavigate('quran')} title="Koranord / كلمات القرآن">
                <span className="quick-icon">📖</span>
                <span className="quick-label sv-text">Koranord</span>
                <span className="quick-label ar-text">كلمات القرآن</span>
            </button>
            <button className="quick-btn" onClick={() => onNavigate('asma')} title="Guds 99 Namn / أسماء الله الحسنى">
                <span className="quick-icon">📿</span>
                <span className="quick-label sv-text">99 Namn</span>
                <span className="quick-label ar-text">أسماء الله</span>
            </button>
            <button className="quick-btn" onClick={() => onNavigate('ordsprak')} title="Svenska Ordspråk / الأمثال السويدية">
                <span className="quick-icon">📜</span>
                <span className="quick-label sv-text">Ordspråk</span>
                <span className="quick-label ar-text">الأمثال</span>
            </button>
            <button className="quick-btn" onClick={() => onNavigate('cognates')} title="Liknande Ord / المتشابهات">
                <span className="quick-icon">🔤</span>
                <span className="quick-label sv-text">Liknande</span>
                <span className="quick-label ar-text">متشابهات</span>
            </button>
            <button className="quick-btn" onClick={() => (window as any).openRandomQuiz?.()} title="Slumpmässig Quiz / اختبار عشوائي">
                <span className="quick-icon">🎲</span>
                <span className="quick-label sv-text">Quiz</span>
                <span className="quick-label ar-text">اختبار</span>
            </button>
        </div>
    );
};

export default QuickAccessRow;
