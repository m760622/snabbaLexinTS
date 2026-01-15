import React, { useRef } from 'react';
import { Lesson, LessonCardProps } from './types';

const levelEmoji: Record<string, string> = {
    'beginner': '🟢',
    'intermediate': '🟡',
    'advanced': '🔴'
};

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    const sectionsText = `${lesson.sections.length} avsnitt`;
    const timeText = `${Math.max(3, lesson.sections.length * 2)} min`;

    // Hardcoded subtitles mapping from original code
    const subTitle = lesson.id === 'wordOrder' ? 'ترتيب الكلمات - قاعدة V2' :
        lesson.id === 'verbs' ? 'الأفعال والأزمنة' :
            lesson.id === 'pronouns' ? 'الضمائر الشخصية' :
                lesson.id === 'adjectives' ? 'الصفات - التذكير والتأنيث' : 'درس قواعد';

    return (
        <div 
            ref={cardRef}
            className={`lesson-card search-result-style ${isCompleted ? 'completed' : ''}`}
            onClick={() => onClick(lesson)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-level={lesson.level}
        >
            <div className="lesson-card-header">
                <div className="lesson-text-group">
                    <h2 className="lesson-title search-result-title">{lesson.title}</h2>
                    <span className={`lesson-level-badge ${lesson.level}`}>
                        {levelEmoji[lesson.level] || '📚'} {lesson.level}
                    </span>
                </div>
                {isCompleted && <span className="check-icon">✓</span>}
            </div>

            <p className="lesson-subtitle-arb" dir="rtl">{subTitle}</p>

            <div className="lesson-meta-row">
                <span className="meta-item"><span className="icon">📄</span> {sectionsText}</span>
                <span className="meta-item"><span className="icon">⚡</span> {timeText}</span>
            </div>

            {isCompleted && (
                <div className="mastery-stars">
                    <span className="star active">★</span>
                    <span className="star active">★</span>
                    <span className="star active">★</span>
                </div>
            )}

            <div className="lesson-progress-bar">
                <div 
                    className="lesson-progress-fill" 
                    style={{ width: isCompleted ? '100%' : '0%' }}
                />
            </div>
        </div>
    );
};

export default LessonCard;
