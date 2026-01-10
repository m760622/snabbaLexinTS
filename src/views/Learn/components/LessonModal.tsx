import React from 'react';
import { Lesson, ExampleItem } from './types';
import { TTSManager } from '../../../services/tts.service';

interface LessonModalProps {
    lesson: Lesson | null;
    onClose: () => void;
    onComplete: (lessonId: string) => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose, onComplete }) => {
    if (!lesson) return null;

    const speakText = (text: string, lang: string) => {
        if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(text, lang);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'sv' ? 'sv-SE' : 'ar-SA';
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div id="lessonModal" className="lesson-modal active">
            <div className="modal-header">
                <button className="close-lesson" onClick={onClose}>×</button>
                <h2>{lesson.title}</h2>
                <div className="w-44"></div>
            </div>

            <div id="lessonContent" className="lesson-content">
                <div className="lesson-sections">
                    {lesson.sections.map((section, index) => (
                        <div key={index} className="lesson-section" data-section={index}>
                            <h3 className="section-title">{section.title}</h3>
                            
                            {section.content.map((item, i) => (
                                <div 
                                    key={i} 
                                    className={`content-item ${item.type}`}
                                    dangerouslySetInnerHTML={{ __html: item.html }}
                                />
                            ))}
                            
                            {section.examples.length > 0 && (
                                <div className="examples-list">
                                    {section.examples.map((ex, i) => (
                                        <div key={i} className="example-item">
                                            <div className="example-swe">
                                                <button 
                                                    className="speak-btn" 
                                                    onClick={() => speakText(ex.swe, 'sv')}
                                                >
                                                    🔊
                                                </button>
                                                {ex.swe}
                                            </div>
                                            <div className="example-arb">{ex.arb}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="lesson-actions">
                        <button 
                            className="complete-lesson-btn" 
                            onClick={() => onComplete(lesson.id)}
                        >
                            ✅ <span className="sv-text">Markera som klar</span>
                            <span className="ar-text">اكتمل</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonModal;
