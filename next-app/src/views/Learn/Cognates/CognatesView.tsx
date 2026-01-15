import React, { useState, useEffect, useMemo } from 'react';
import { cognatesData } from '../../../data/cognatesData';
import CognateCard from './components/CognateCard';
import CognatesFlashcards from './components/CognatesFlashcards';
import CognatesQuiz from './components/CognatesQuiz';
import { CognateEntry, CognatesMode } from './types';
import '@/styles/cognates.css';

const ITEMS_PER_BATCH = 20;

const categoryIcons: Record<string, string> = {
    'Substantiv': '📦', 'Adjektiv': '🎨', 'Verb': '🏃', 'Geografi': '🌍',
    'Medicin & Vetenskap': '🔬', 'Musik & Konst': '🎵', 'Mat & Dryck': '🍽️',
    'Teknik': '💻', 'Övrigt': '📌'
};

const CognatesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Data
    const cognates = cognatesData as CognateEntry[];

    // State
    const [mode, setMode] = useState<CognatesMode>('browse');
    const [savedWords, setSavedWords] = useState<string[]>([]);
    const [learnedWords, setLearnedWords] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Lazy Loading State
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_BATCH);

    // Initialize State from LocalStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cognates_saved') || '[]');
        const learned = JSON.parse(localStorage.getItem('cognates_learned') || '[]');
        setSavedWords(saved);
        setLearnedWords(learned);
    }, []);

    // Persist State
    useEffect(() => {
        localStorage.setItem('cognates_saved', JSON.stringify(savedWords));
        localStorage.setItem('cognates_learned', JSON.stringify(learnedWords));
    }, [savedWords, learnedWords]);

    // Filtering
    const filteredCognates = useMemo(() => {
        let result = cognates;

        // Category Filter
        if (categoryFilter !== 'all') {
            result = result.filter(c => c.category === categoryFilter);
        }

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.swe.toLowerCase().includes(lowerQuery) ||
                c.arb.includes(lowerQuery)
            );
        }

        return result;
    }, [cognates, categoryFilter, searchQuery]);

    // Handlers
    const toggleSave = (word: string) => {
        if (savedWords.includes(word)) {
            setSavedWords(savedWords.filter(w => w !== word));
        } else {
            setSavedWords([...savedWords, word]);
        }
    };

    const handleLoadMore = () => {
        setDisplayedCount(prev => Math.min(prev + ITEMS_PER_BATCH, filteredCognates.length));
    };

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && displayedCount < filteredCognates.length) {
                handleLoadMore();
            }
        }, { threshold: 0.1 });

        const sentinel = document.getElementById('load-more-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [displayedCount, filteredCognates.length]);

    // Reset displayed count on filter change
    useEffect(() => {
        setDisplayedCount(ITEMS_PER_BATCH);
    }, [filteredCognates]);

    const handleFlashcardComplete = (newLearned: string[]) => {
        const combined = new Set([...learnedWords, ...newLearned]);
        setLearnedWords(Array.from(combined));
        setMode('browse');
    };

    // Get unique categories for filter
    const categories = useMemo(() => {
        const cats = new Set(cognates.map(c => c.category || 'Övrigt'));
        return ['all', ...Array.from(cats)];
    }, [cognates]);

    return (
        <div className="cognates-view-container" style={{ padding: '1rem', paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto', overflowY: 'auto', maxHeight: '100vh', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain', willChange: 'scroll-position' }}>
            {/* Header / Nav */}
            <div className="cognates-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                    ⬅️ Tillbaka
                </button>
                <h2 style={{ color: '#3b82f6', margin: 0, fontFamily: 'Tajawal' }}>Liknande Ord</h2>
                <div style={{ color: 'white' }}>
                    <span title="Lärt">✅ {learnedWords.length}</span>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mode-selection-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '16px', justifyContent: 'center' }}>
                <button className={`mode-btn ${mode === 'browse' ? 'active' : ''}`} onClick={() => setMode('browse')}>📖 Browse</button>
                <button className={`mode-btn ${mode === 'flashcard' ? 'active' : ''}`} onClick={() => setMode('flashcard')}>🂴 Flashcards</button>
                <button className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`} onClick={() => setMode('quiz')}>✏️ Quiz</button>
            </div>

            {mode === 'browse' && (
                <>
                    {/* Search & Filter */}
                    <div className="search-filter-row" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Sök ord..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }}
                        />
                    </div>

                    {/* Category Chips */}
                    <div className="filter-chips" style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', paddingBottom: '0.8rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`chip ${categoryFilter === cat ? 'active' : ''}`}
                                onClick={() => setCategoryFilter(cat)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: categoryFilter === cat ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat === 'all' ? '🌐 Alla' : `${categoryIcons[cat] || '📌'} ${cat}`}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="cognates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {filteredCognates.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                                Inga resultat hittades
                            </div>
                        ) : (
                            filteredCognates.slice(0, displayedCount).map((cognate, idx) => (
                                <CognateCard
                                    key={`${cognate.swe}-${idx}`}
                                    cognate={cognate}
                                    isSaved={savedWords.includes(cognate.swe)}
                                    isLearned={learnedWords.includes(cognate.swe)}
                                    onToggleSave={toggleSave}
                                />
                            ))
                        )}
                    </div>

                    {displayedCount < filteredCognates.length && (
                        <div id="load-more-sentinel" style={{ height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                            <span style={{ animation: 'pulse 1.5s infinite' }}>Laddar fler ord...</span>
                        </div>
                    )}
                </>
            )}

            {mode === 'flashcard' && (
                <CognatesFlashcards
                    cognates={filteredCognates.length > 0 ? filteredCognates : cognates}
                    onComplete={handleFlashcardComplete}
                    onBack={() => setMode('browse')}
                />
            )}

            {mode === 'quiz' && (
                <CognatesQuiz
                    cognates={filteredCognates.length > 0 ? filteredCognates : cognates}
                    onBack={() => setMode('browse')}
                />
            )}
        </div>
    );
};

export default CognatesView;
