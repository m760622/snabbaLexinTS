import React, { useState, useEffect } from 'react';
import '../../../assets/css/learn.css';
import QuickAccessRow from './components/QuickAccessRow';
import SearchFilter from './components/SearchFilter';
import DailyChallenge from './components/DailyChallenge';
import LessonCard from './components/LessonCard';
import LessonModal from './components/LessonModal';
import ExtraSections from './components/ExtraSections';
import { lessonsData } from '../../learn/lessonsData';
import { Lesson } from './components/types';

// Sub-Views
import OrdsprakView from './Ordsprak/OrdsprakView';
import CognatesView from './Cognates/CognatesView';
import AsmaUlHusnaView from './AsmaUlHusna/AsmaUlHusnaView';
import QuranView from './Quran/QuranView';

// Declare global types that might be on window from other modules
declare global {
    interface Window {
        openRandomQuiz: () => void;
        openDailyChallenge: () => void;
        setPathFilter: (filter: string) => void;
        dictionaryData: any[];
    }
}

type SubView = 'home' | 'ordsprak' | 'cognates' | 'asma' | 'quran';

const LearnView: React.FC = () => {
    // State
    const [activeView, setActiveView] = useState<SubView>('home');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);

    // Initial Load
    useEffect(() => {
        const savedCompleted = localStorage.getItem('learn_completed');
        if (savedCompleted) {
            try {
                setCompletedLessons(new Set(JSON.parse(savedCompleted)));
            } catch (e) {
                console.error("Failed to parse completed lessons", e);
            }
        }

        const savedXp = parseInt(localStorage.getItem('learn_xp') || '0');
        setXp(savedXp);
        
        const savedLevel = parseInt(localStorage.getItem('learn_level') || '1');
        setLevel(savedLevel);

        const savedStreak = parseInt(localStorage.getItem('learn_streak') || '0');
        setStreak(savedStreak);
        
        // Expose functions to window for legacy compatibility if needed
        window.setPathFilter = (filter: string) => setCurrentFilter(filter);
    }, []);

    // Save State
    useEffect(() => {
        localStorage.setItem('learn_completed', JSON.stringify([...completedLessons]));
        localStorage.setItem('learn_xp', xp.toString());
        localStorage.setItem('learn_level', level.toString());
    }, [completedLessons, xp, level]);

    // Filtering
    const filteredLessons = lessonsData.filter(lesson => {
        const matchesFilter = currentFilter === 'all' || lesson.level === currentFilter;
        const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              lesson.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Handlers
    const handleLessonComplete = (lessonId: string) => {
        if (!completedLessons.has(lessonId)) {
            const newCompleted = new Set(completedLessons);
            newCompleted.add(lessonId);
            setCompletedLessons(newCompleted);
            setXp(xp + 20); // Add XP
            
            // Check Level Up logic if needed
            if (Math.floor((xp + 20) / 100) + 1 > level) {
                setLevel(level + 1);
            }
        }
        setSelectedLesson(null);
    };

    const handleLessonOpen = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setXp(xp + 5); // XP for opening
    };

    const handleDailyChallenge = () => {
        // Simple implementation: open random lesson
        const randomLesson = lessonsData[Math.floor(Math.random() * lessonsData.length)];
        handleLessonOpen(randomLesson);
    };

    const handleNavigate = (view: SubView) => {
        setActiveView(view);
        window.scrollTo(0, 0);
    };

    // Render Sub-Views
    if (activeView === 'ordsprak') return <OrdsprakView onBack={() => setActiveView('home')} />;
    if (activeView === 'cognates') return <CognatesView onBack={() => setActiveView('home')} />;
    if (activeView === 'asma') return <AsmaUlHusnaView onBack={() => setActiveView('home')} />;
    if (activeView === 'quran') return <QuranView onBack={() => setActiveView('home')} />;

    // Render Main View
    return (
        <div className="learn-view-container">
            <QuickAccessRow onNavigate={(view) => handleNavigate(view as any)} />

            <SearchFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
            />

            <DailyChallenge onOpen={handleDailyChallenge} />

            <div className="section-title">
                📚 <span className="sv-text">Lektioner</span>
                <span className="ar-text">الدروس</span>
            </div>

            <div className="lessons-grid" id="lessonsGrid">
                {filteredLessons.map(lesson => (
                    <LessonCard 
                        key={lesson.id}
                        lesson={lesson}
                        isCompleted={completedLessons.has(lesson.id)}
                        onClick={handleLessonOpen}
                    />
                ))}
            </div>

            <LessonModal 
                lesson={selectedLesson}
                onClose={() => setSelectedLesson(null)}
                onComplete={handleLessonComplete}
            />
            
            <ExtraSections 
                currentFilter={currentFilter}
                onSetPathFilter={setCurrentFilter}
            />
        </div>
    );
};

export default LearnView;