import React, { useState, useEffect, useMemo } from 'react';
import asmaData from '../../../data/asmaUlHusna.json';
import AsmaCard from './components/AsmaCard';
import AsmaFlashcards from './components/AsmaFlashcards';
import AsmaQuiz from './components/AsmaQuiz';
import { AsmaName, AsmaMode, AsmaFilter } from './types';
import '../../../../assets/css/asma_ul_husna.css';

const ITEMS_PER_BATCH = 12;

// Categories Mapping
const NAME_CATEGORIES: Record<number, 'jalal' | 'jamal' | 'kamal'> = {
    1: 'jamal', 2: 'jamal', 3: 'jamal', 4: 'jalal', 5: 'jalal', // Allah, Rahman, Rahim, Malik, Quddus
    6: 'jalal', 7: 'jamal', 8: 'jalal', 9: 'jalal', 10: 'jalal', // Salam, Mumin, Muhaymin, Aziz, Jabbar
    11: 'jalal', 12: 'kamal', 13: 'kamal', 14: 'jamal', 15: 'jalal', // Mutakabbir, Khaliq, Bari, Musawwir, Ghaffar
    16: 'jalal', 17: 'jamal', 18: 'jamal', 19: 'kamal', 20: 'jalal', // Qahhar, Wahhab, Razzaq, Fattah, Alim
    21: 'jalal', 22: 'jalal', 23: 'jalal', 24: 'jalal', 25: 'jalal', // Qabid, Basit, Khafid, Rafi, Muizz, Mudhill
    26: 'jalal', 27: 'kamal', 28: 'kamal', 29: 'jalal', 30: 'jamal', // Sami, Basir, Hakam, Adl, Latif
    31: 'kamal', 32: 'jamal', 33: 'jalal', 34: 'jamal', 35: 'jamal', // Khabir, Halim, Azim, Ghafur, Shakur
    40: 'jalal', 41: 'jalal', 47: 'kamal', 48: 'jamal', // Hasib, Jalil, Haqq, Wadud
};

const getCategory = (nr: number): 'jalal' | 'jamal' | 'kamal' => {
    return NAME_CATEGORIES[nr] || 'kamal';
};

const normalizeArabic = (text: string): string => {
    return text.replace(/[\u064B-\u065F\u0670]/g, '');
};

const AsmaUlHusnaView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Data
    const allNames = asmaData as AsmaName[];

    // State
    const [mode, setMode] = useState<AsmaMode>('browse');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [memorized, setMemorized] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<AsmaFilter>('all');
    const [currentLang, setCurrentLang] = useState<'ar' | 'sv'>('ar');
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_BATCH);

    // Initial Load
    useEffect(() => {
        const savedFav = JSON.parse(localStorage.getItem('asma_favorites') || '[]');
        const savedMem = JSON.parse(localStorage.getItem('asma_memorized') || '[]');
        const savedLang = localStorage.getItem('asma_lang') as 'ar' | 'sv' || 'ar';
        
        setFavorites(savedFav);
        setMemorized(savedMem);
        setCurrentLang(savedLang);
    }, []);

    // Persist State
    useEffect(() => {
        localStorage.setItem('asma_favorites', JSON.stringify(favorites));
        localStorage.setItem('asma_memorized', JSON.stringify(memorized));
        localStorage.setItem('asma_lang', currentLang);
    }, [favorites, memorized, currentLang]);

    // Filtering
    const filteredNames = useMemo(() => {
        let result = allNames;

        if (filter === 'favorites') {
            result = result.filter(n => favorites.includes(n.nr));
        } else if (filter === 'memorized') {
            result = result.filter(n => memorized.includes(n.nr));
        } else if (filter === 'jalal' || filter === 'jamal' || filter === 'kamal') {
            result = result.filter(n => getCategory(n.nr) === filter);
        }

        if (searchQuery) {
            const query = normalizeArabic(searchQuery).toLowerCase();
            result = result.filter(n => 
                normalizeArabic(n.nameAr).includes(query) ||
                n.nameSv.toLowerCase().includes(query) ||
                normalizeArabic(n.meaningAr).includes(query) ||
                n.meaningSv.toLowerCase().includes(query) ||
                n.nr.toString() === query
            );
        }

        return result;
    }, [allNames, filter, favorites, memorized, searchQuery]);

    // Handlers
    const toggleFavorite = (nr: number) => {
        if (favorites.includes(nr)) {
            setFavorites(favorites.filter(id => id !== nr));
        } else {
            setFavorites([...favorites, nr]);
        }
    };

    const toggleMemorized = (nr: number) => {
        if (memorized.includes(nr)) {
            setMemorized(memorized.filter(id => id !== nr));
        } else {
            setMemorized([...memorized, nr]);
        }
    };

    const toggleLang = () => {
        setCurrentLang(prev => prev === 'ar' ? 'sv' : 'ar');
    };

    const handleLoadMore = () => {
        setDisplayedCount(prev => Math.min(prev + ITEMS_PER_BATCH, filteredNames.length));
    };

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && displayedCount < filteredNames.length) {
                handleLoadMore();
            }
        }, { threshold: 0.1 });

        const sentinel = document.getElementById('load-more-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [displayedCount, filteredNames.length]);

    // Reset displayed count
    useEffect(() => {
        setDisplayedCount(ITEMS_PER_BATCH);
    }, [filteredNames]);

    const handleFlashcardComplete = (newMemorized: number[]) => {
        const combined = new Set([...memorized, ...newMemorized]);
        setMemorized(Array.from(combined));
        setMode('browse');
    };

    return (
        <div className="asma-view-container" style={{ padding: '1rem', paddingBottom: '5rem', minHeight: '100vh', background: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
             {/* Header */}
             <div className="asma-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                        ⬅️
                    </button>
                    <button onClick={toggleLang} className="asma-nav-btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: 'white', cursor: 'pointer' }}>
                        {currentLang === 'ar' ? 'ع' : 'Sv'}
                    </button>
                </div>
                <div className="asma-title-wrapper" style={{ textAlign: 'center' }}>
                    <div className="asma-title-ar" style={{ fontSize: '1.2rem', color: '#fbbf24', fontFamily: 'Amiri' }}>أَسْمَاءُ اللَّهِ الْحُسْنَى</div>
                    <div className="asma-title-sv" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Guds Vackraste Namn</div>
                </div>
                <div style={{ color: 'white' }}>
                    <span title="Memorized">✓ {memorized.length}</span>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mode-selection-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '16px', justifyContent: 'center' }}>
                <button className={`mode-btn ${mode === 'browse' ? 'active' : ''}`} onClick={() => setMode('browse')}>🔍 Browse</button>
                <button className={`mode-btn ${mode === 'flashcard' ? 'active' : ''}`} onClick={() => setMode('flashcard')}>🃏 Flashcards</button>
                <button className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`} onClick={() => setMode('quiz')}>❓ Quiz</button>
            </div>

            {mode === 'browse' && (
                <>
                    {/* Search */}
                    <div className="nav-search-wrapper" style={{ marginBottom: '1.5rem' }}>
                        <input 
                            type="text" 
                            className="nav-search-input"
                            placeholder="🔍 Sök / ابحث..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }}
                        />
                    </div>

                    {/* Filter Bar */}
                    <div className="asma-filter-bar" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.8rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
                        <button className={`asma-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`asma-filter-btn ${filter === 'favorites' ? 'active' : ''}`} onClick={() => setFilter('favorites')}>❤️</button>
                        <button className={`asma-filter-btn ${filter === 'memorized' ? 'active' : ''}`} onClick={() => setFilter('memorized')}>✓</button>
                        <button className={`asma-filter-btn filter-btn--jalal ${filter === 'jalal' ? 'active' : ''}`} onClick={() => setFilter('jalal')}>Jalal</button>
                        <button className={`asma-filter-btn filter-btn--jamal ${filter === 'jamal' ? 'active' : ''}`} onClick={() => setFilter('jamal')}>Jamal</button>
                        <button className={`asma-filter-btn filter-btn--kamal ${filter === 'kamal' ? 'active' : ''}`} onClick={() => setFilter('kamal')}>Kamal</button>
                    </div>

                    {/* Grid */}
                    <div className="asma-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                         {filteredNames.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                                Inga resultat / لا توجد نتائج
                            </div>
                        ) : (
                            filteredNames.slice(0, displayedCount).map(name => (
                                <AsmaCard 
                                    key={name.nr}
                                    name={name}
                                    isFavorite={favorites.includes(name.nr)}
                                    isMemorized={memorized.includes(name.nr)}
                                    category={getCategory(name.nr)}
                                    currentLang={currentLang}
                                    onToggleFavorite={toggleFavorite}
                                    onToggleMemorized={toggleMemorized}
                                />
                            ))
                        )}
                    </div>

                    {displayedCount < filteredNames.length && (
                        <div id="load-more-sentinel" style={{ height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fbbf24' }}>
                            <span style={{ animation: 'pulse 1.5s infinite' }}>⏳ Laddar fler namn...</span>
                        </div>
                    )}
                </>
            )}

            {mode === 'flashcard' && (
                <AsmaFlashcards 
                    names={filteredNames.length > 0 ? filteredNames : allNames}
                    onComplete={handleFlashcardComplete}
                    onBack={() => setMode('browse')}
                />
            )}

            {mode === 'quiz' && (
                <AsmaQuiz 
                    names={allNames}
                    onBack={() => setMode('browse')}
                />
            )}
        </div>
    );
};

export default AsmaUlHusnaView;
