import React, { useState, useEffect, useMemo } from 'react';
import { quranData } from '../../../data/quranData';
import QuranCard from './components/QuranCard';
import QuranFlashcards from './components/QuranFlashcards';
import QuranQuiz from './components/QuranQuiz';
import { QuranEntry, QuranMode } from './types';
import '@/styles/quran.css';

const ITEMS_PER_BATCH = 20;

const QuranView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Data
    const allData = quranData as QuranEntry[];

    // State
    const [mode, setMode] = useState<QuranMode>('browse');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [surahFilter, setSurahFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_BATCH);

    // Initial Load
    useEffect(() => {
        const savedProgress = localStorage.getItem('quranUserProgress');
        if (savedProgress) {
            try {
                const parsed = JSON.parse(savedProgress);
                setFavorites(parsed.favorites || []);
            } catch (e) {
                console.error('Failed to load quran progress', e);
            }
        }
    }, []);

    // Persist State
    useEffect(() => {
        const existing = localStorage.getItem('quranUserProgress');
        let progress = existing ? JSON.parse(existing) : { xp: 0, streak: 0, srs: {}, theme: 'emerald' };
        progress.favorites = favorites;
        localStorage.setItem('quranUserProgress', JSON.stringify(progress));
    }, [favorites]);

    // Unique Surahs for Filter
    const uniqueSurahs = useMemo(() => {
        const cleanSurahName = (name: string) => name ? name.replace(/\s*\(\d+\)$/, '').trim() : '';
        return [...new Set(allData.map(item => cleanSurahName(item.surah)))].filter(Boolean).sort();
    }, [allData]);

    // Filtering
    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase();
        const cleanSurahName = (name: string) => name ? name.replace(/\s*\(\d+\)$/, '').trim() : '';

        return allData.filter(item => {
            const matchesSearch =
                item.word.includes(query) ||
                item.word_sv.toLowerCase().includes(query) ||
                item.meaning_ar.includes(query) ||
                item.ayah_full.includes(query) ||
                item.ayah_sv.toLowerCase().includes(query);

            let matchesSurah = true;
            if (surahFilter !== 'all') {
                if (surahFilter === 'favorites') {
                    matchesSurah = favorites.includes(item.id);
                } else {
                    matchesSurah = cleanSurahName(item.surah) === surahFilter;
                }
            }

            const matchesType = typeFilter === 'all' || item.type === typeFilter;

            return matchesSearch && matchesSurah && matchesType;
        });
    }, [allData, searchQuery, surahFilter, typeFilter, favorites]);

    // Handlers
    const toggleFavorite = (id: string) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fid => fid !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };

    const handleShare = async (item: QuranEntry) => {
        const text = `🔹 ${item.word} (${item.surah})\n\nMeaning: ${item.meaning_ar}\n\n📖 ${item.ayah_full}\n\n🇸🇪 "${item.ayah_sv}"\n\n- Snabbalexin Quran`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Koranord - SnabbaLexin', text });
            } catch (err) { console.warn('Share failed', err); }
        } else {
            await navigator.clipboard.writeText(text);
            alert('Text kopierad! / تم نسخ النص!');
        }
    };

    const handleLoadMore = () => {
        setDisplayedCount(prev => Math.min(prev + ITEMS_PER_BATCH, filteredData.length));
    };

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && displayedCount < filteredData.length) {
                handleLoadMore();
            }
        }, { threshold: 0.1 });

        const sentinel = document.getElementById('load-more-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [displayedCount, filteredData.length]);

    // Reset displayed count
    useEffect(() => {
        setDisplayedCount(ITEMS_PER_BATCH);
    }, [filteredData]);

    return (
        <div className="quran-view-container" style={{ padding: '1rem', paddingBottom: '5rem', minHeight: '100vh', background: '#064e3b', maxWidth: '800px', margin: '0 auto', overflowY: 'auto', maxHeight: '100vh', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain', willChange: 'scroll-position' }}>
            {/* Header */}
            <div className="quran-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                    ⬅️
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--quran-gold)', margin: 0, fontFamily: 'Amiri', fontSize: '1.8rem' }}>كلمات القرآن</h2>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Koranord</div>
                </div>
                <div style={{ color: 'white' }}>
                    <span title="Favorites">❤️ {favorites.length}</span>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mode-selection-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '16px' }}>
                <button className={`mode-btn ${mode === 'browse' ? 'active' : ''}`} onClick={() => setMode('browse')}>📜 Browse</button>
                <button className={`mode-btn ${mode === 'flashcard' ? 'active' : ''}`} onClick={() => setMode('flashcard')}>🗂️ Flashcards</button>
                <button className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`} onClick={() => setMode('quiz')}>❓ Quiz</button>
            </div>

            {mode === 'browse' && (
                <>
                    {/* Search & Filter */}
                    <div className="search-container" style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="Sök ord, surah..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }}
                        />
                    </div>

                    <div className="filter-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <select
                            className="glass-select"
                            value={surahFilter}
                            onChange={(e) => setSurahFilter(e.target.value)}
                            style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <option value="all">Alla Suror</option>
                            <option value="favorites">❤️ Favoriter</option>
                            {uniqueSurahs.map(surah => (
                                <option key={surah} value={surah}>{surah}</option>
                            ))}
                        </select>
                        <select
                            className="glass-select"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            style={{ width: '130px', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <option value="all">Alla Typer</option>
                            <option value="verb">Verb</option>
                            <option value="noun">Substantiv</option>
                            <option value="particle">Partikel</option>
                        </select>
                    </div>

                    {/* Content List */}
                    <div className="quran-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredData.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                                Inga resultat / لا توجد نتائج
                            </div>
                        ) : (
                            filteredData.slice(0, displayedCount).map(item => (
                                <QuranCard
                                    key={item.id}
                                    item={item}
                                    isFavorite={favorites.includes(item.id)}
                                    onToggleFavorite={toggleFavorite}
                                    onShare={handleShare}
                                />
                            ))
                        )}

                        {displayedCount < filteredData.length && (
                            <div id="load-more-sentinel" style={{ height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--quran-gold)' }}>
                                <span style={{ animation: 'pulse 1.5s infinite' }}>⏳ Laddar mer...</span>
                            </div>
                        )}
                    </div>
                </>
            )}

            {mode === 'flashcard' && (
                <QuranFlashcards
                    items={filteredData.length > 0 ? filteredData : allData}
                    onBack={() => setMode('browse')}
                />
            )}

            {mode === 'quiz' && (
                <QuranQuiz
                    items={allData}
                    onBack={() => setMode('browse')}
                />
            )}
        </div>
    );
};

export default QuranView;
