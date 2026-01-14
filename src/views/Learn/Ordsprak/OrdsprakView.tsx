import React, { useState, useEffect, useMemo } from 'react';
import ordsprakData from '../../../data/ordsprak.json';
import ProverbCard from './components/ProverbCard';
import OrdsprakFlashcards from './components/OrdsprakFlashcards';
import OrdsprakQuiz from './components/OrdsprakQuiz';
import { Proverb, OrdsprakMode } from './types';
import '../../../../assets/css/ordsprak.css';

const ITEMS_PER_BATCH = 15;

const OrdsprakView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Data
    const proverbs = ordsprakData as Proverb[];

    // State
    const [mode, setMode] = useState<OrdsprakMode>('browse');
    const [savedProverbs, setSavedProverbs] = useState<number[]>([]);
    const [learnedProverbs, setLearnedProverbs] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'saved' | 'learned' | 'notLearned'>('all');

    // Lazy Loading State
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_BATCH);

    // Initialize State from LocalStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('ordsprak_saved') || '[]');
        const learned = JSON.parse(localStorage.getItem('ordsprak_learned') || '[]');
        setSavedProverbs(saved);
        setLearnedProverbs(learned);
    }, []);

    // Persist State
    useEffect(() => {
        localStorage.setItem('ordsprak_saved', JSON.stringify(savedProverbs));
        localStorage.setItem('ordsprak_learned', JSON.stringify(learnedProverbs));
    }, [savedProverbs, learnedProverbs]);

    // Filtering
    const filteredProverbs = useMemo(() => {
        let result = proverbs;

        // Status Filter
        if (statusFilter === 'saved') {
            result = result.filter(p => savedProverbs.includes(p.id));
        } else if (statusFilter === 'learned') {
            result = result.filter(p => learnedProverbs.includes(p.id));
        } else if (statusFilter === 'notLearned') {
            result = result.filter(p => !learnedProverbs.includes(p.id));
        }

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.swedishProverb.toLowerCase().includes(lowerQuery) ||
                p.arabicEquivalent.includes(lowerQuery) ||
                p.literalMeaning.toLowerCase().includes(lowerQuery) ||
                (p.verb && p.verb.toLowerCase().includes(lowerQuery))
            );
        }

        return result;
    }, [proverbs, savedProverbs, learnedProverbs, statusFilter, searchQuery]);

    // Handlers
    const toggleSave = (id: number) => {
        if (savedProverbs.includes(id)) {
            setSavedProverbs(savedProverbs.filter(sid => sid !== id));
        } else {
            setSavedProverbs([...savedProverbs, id]);
        }
    };

    const toggleLearned = (id: number) => {
        if (learnedProverbs.includes(id)) {
            setLearnedProverbs(learnedProverbs.filter(lid => lid !== id));
        } else {
            setLearnedProverbs([...learnedProverbs, id]);
        }
    };

    const handleLoadMore = () => {
        setDisplayedCount(prev => Math.min(prev + ITEMS_PER_BATCH, filteredProverbs.length));
    };

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && displayedCount < filteredProverbs.length) {
                handleLoadMore();
            }
        }, { threshold: 0.1 });

        const sentinel = document.getElementById('load-more-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [displayedCount, filteredProverbs.length]);

    // Reset displayed count on filter change
    useEffect(() => {
        setDisplayedCount(ITEMS_PER_BATCH);
    }, [filteredProverbs]);

    const handleFlashcardComplete = (newLearnedIds: number[]) => {
        // Add new unique learned IDs
        const combined = new Set([...learnedProverbs, ...newLearnedIds]);
        setLearnedProverbs(Array.from(combined));
        setMode('browse');
    };

    return (
        <div className="ordsprak-view-container" style={{ padding: '1rem', paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto', overflowY: 'auto', maxHeight: '100vh', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain', willChange: 'scroll-position' }}>
            {/* Header / Nav */}
            <div className="ordsprak-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                    ⬅️ Tillbaka
                </button>
                <h2 style={{ color: '#fbbf24', margin: 0, fontFamily: 'Tajawal' }}>Svenska Ordspråk</h2>
                <div style={{ color: 'white' }}>
                    <span title="Lärt">✅ {learnedProverbs.length}</span>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mode-selection-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '16px' }}>
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
                            placeholder="Sök ordspråk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: 'white', fontSize: '1rem' }}
                        >
                            <option value="all">Alla</option>
                            <option value="saved">Sparade (⭐ {savedProverbs.length})</option>
                            <option value="learned">Lärt (✅)</option>
                            <option value="notLearned">Ej lärt</option>
                        </select>
                    </div>

                    {/* Content Grid */}
                    <div className="content-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredProverbs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                                Inga resultat hittades
                            </div>
                        ) : (
                            filteredProverbs.slice(0, displayedCount).map(proverb => (
                                <ProverbCard
                                    key={proverb.id}
                                    proverb={proverb}
                                    isSaved={savedProverbs.includes(proverb.id)}
                                    isLearned={learnedProverbs.includes(proverb.id)}
                                    onToggleSave={toggleSave}
                                    onToggleLearned={toggleLearned}
                                />
                            ))
                        )}

                        {displayedCount < filteredProverbs.length && (
                            <div id="load-more-sentinel" style={{ height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                                <span style={{ animation: 'pulse 1.5s infinite' }}>Laddar fler ordspråk...</span>
                            </div>
                        )}
                    </div>
                </>
            )}

            {mode === 'flashcard' && (
                <OrdsprakFlashcards
                    proverbs={filteredProverbs.length > 0 ? filteredProverbs : proverbs}
                    onComplete={handleFlashcardComplete}
                    onBack={() => setMode('browse')}
                />
            )}

            {mode === 'quiz' && (
                <OrdsprakQuiz
                    proverbs={proverbs}
                    onBack={() => setMode('browse')}
                />
            )}
        </div>
    );
};

export default OrdsprakView;
