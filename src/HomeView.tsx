import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SearchResult, SearchStats } from './services/search.service';
import { SearchHistoryManager } from './services/search-history.service';
import { FavoritesManager } from './services/favorites.service';
import { TypeColorSystem } from './utils/type-color.util';
import { TTSManager } from './services/tts.service';
import { showToast, ThemeManager, HapticManager, measurePerformance } from './utils/utils';
import { DailyContentService, DailyContent } from './services/daily-content.service';
import { DetailsView } from './DetailsView';
import { QuizComponent } from './components/QuizComponent';
import { DailyCard } from './components/DailyCard';
import { MistakesView } from './MistakesView';
import { QuizStats } from './services/quiz-stats.service';
import { Achievements } from './services/achievements.service';
// @ts-ignore
import FullSettings from './views/Settings/FullSettings';
import LearnView from './views/Learn/LearnView';
import GamesView from './views/Games/GamesView';
import ProfileView from './views/Profile/ProfileView';
import AddWordView from './views/Add/AddWordView';
import ChangelogView from './views/Settings/ChangelogView';
import DeviceInfoView from './views/Settings/DeviceInfoView';
import SplashView from './views/Welcome/SplashView';

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any, info: any) { console.error("HomeView Crash:", error, info); }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 40, textAlign: 'center', backgroundColor: '#121212', height: '100vh', color: 'white' }}>
                <h2 style={{ color: '#ff4d4d' }}>Något gick fel</h2>
                <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', marginTop: '20px' }}>Ladda om</button>
            </div>
        );
        return this.props.children;
    }
}

// --- UI Components ---

const WordCard = React.memo(({ word, isFav, onClick, onToggleFav, accentColor }: any) => {
    const [isPlaying, setIsPlaying] = useState(false);
    if (!word) return null;

    const typeInfo = TypeColorSystem.detect(word.type, word.swedish, word.forms, word.gender, word.arabic);
    const primaryColor = typeInfo?.color?.primary || accentColor;

    const handleSpeak = async (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        if (isPlaying) return;
        HapticManager.light();
        setIsPlaying(true);
        try { await TTSManager.speak(word.swedish, 'sv'); } catch (err) { }
        finally { setTimeout(() => setIsPlaying(false), 1500); }
    };

    const handleFav = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        HapticManager.medium();
        onToggleFav(word.id.toString());
    };

    const handleCopy = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        HapticManager.light();
        navigator.clipboard.writeText(`${word.swedish} - ${word.arabic}`);
        showToast('Kopierat!', 'success');
    };

    return (
        <div
            className="smart-card"
            onClick={onClick}
            style={{ '--glow-color': primaryColor } as React.CSSProperties}
        >
            {/* Progress Bar */}
            <div className="progress-bar">
                <div className="progress-fill" style={{ background: primaryColor, width: isFav ? '100%' : '30%' }}></div>
            </div>

            <div className="smart-inner">
                {/* Header: Status + Type + Actions */}
                <div className="smart-header">
                    <div className="header-left">
                        <div className={`status-dot ${isFav ? 'mastered' : 'learning'}`}></div>
                        <span className="type-label" style={{ color: primaryColor }}>
                            {typeInfo?.color?.label?.sv || word.type}
                        </span>
                    </div>
                    <div className="smart-actions">
                        <button className={`smart-btn icon-only ${isPlaying ? 'active' : ''}`}
                            onClick={(e) => handleSpeak(e as any)}
                            onTouchEnd={(e) => { e.stopPropagation(); handleSpeak(e as any); }}
                            title="استمع">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        </button>
                        <button className="smart-btn icon-only"
                            onClick={(e) => handleCopy(e as any)}
                            onTouchEnd={(e) => { e.stopPropagation(); handleCopy(e as any); }}
                            title="نسخ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button className={`smart-btn icon-only ${isFav ? 'active' : ''}`}
                            onClick={(e) => handleFav(e as any)}
                            onTouchEnd={(e) => { e.stopPropagation(); handleFav(e as any); }}
                            title={isFav ? 'محفوظ' : 'حفظ'}
                            style={isFav ? { background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' } : {}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Content: Swedish + Forms */}
                <div className="smart-body">
                    <div className="swedish-text">
                        {word.swedish || 'Inget svenskt ord'}
                    </div>

                    {word.forms && (
                        <div className="forms-text">{word.forms}</div>
                    )}
                </div>

                {/* Divider */}
                <div className="smart-divider"></div>

                {/* Arabic Text */}
                <div className="arabic-text">
                    {word.arabic || 'لا توجد ترجمة'}
                </div>

                {/* Definition */}
                {(word.definition || word.example) && (
                    <div className="definition-text" style={{ borderLeftColor: primaryColor }}>
                        {word.definition || word.example}
                    </div>
                )}
            </div>
        </div>
    );
}, (p, n) => p.word.id === n.word.id && p.isFav === n.isFav && p.accentColor === n.accentColor);

// --- Sub Views ---

// --- Main Container ---

const HomeViewInner: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('search');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [visibleCount, setVisibleCount] = useState(20);
    const [history, setHistory] = useState<string[]>([]);
    const [isDataReady, setIsDataReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [favoritesSet, setFavoritesSet] = useState<Set<string>>(new Set());
    const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
    const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [accentColor, setAccentColor] = useState('#3b82f6');
    const [stats, setStats] = useState({ streak: 0, unlocked: 0, total: 0 });
    const [quizConfig, setQuizConfig] = useState<{ mode: 'normal' | 'review', words: string[] }>({ mode: 'normal', words: [] });

    const searchWorkerRef = useRef<Worker | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFavoritesSet(new Set(FavoritesManager.getAll()));

        // MOCK HISTORY for Visual Match (sr09.png)
        const realHistory = SearchHistoryManager.get();
        if (realHistory.length === 0) {
            setHistory(['Km', 'يعتر', 'يعترف', 'tata', 'يس', 'محمو', 'س', 'يكت', 'مح']);
        } else {
            setHistory(realHistory);
        }

        const savedColor = localStorage.getItem('snabba_accent_color');
        if (savedColor) setAccentColor(savedColor);

        const updateStats = () => {
            const s = QuizStats.getStats();
            const p = Achievements.getProgress();
            setStats({ streak: s.currentStreak || 0, unlocked: p.unlocked, total: p.total });
        };
        updateStats();

        const savedFontScale = localStorage.getItem('fontSizePercent');
        if (savedFontScale) {
            const scale = parseInt(savedFontScale) / 100;
            document.documentElement.style.setProperty('--app-font-scale', String(scale));
            document.documentElement.style.fontSize = `${16 * scale}px`;
        }

        const handleOpenQuiz = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail) {
                setQuizConfig({ mode: detail.mode || 'normal', words: detail.words || [] });
            } else {
                setQuizConfig({ mode: 'normal', words: [] });
            }
            handleTabChange('quiz');
        };
        window.addEventListener('openQuiz', handleOpenQuiz);

        const unsubscribeFavorites = FavoritesManager.onChange((id, isFav) => {
            setFavoritesSet(prev => { const next = new Set(prev); if (isFav) next.add(id); else next.delete(id); return next; });
        });

        return () => {
            window.removeEventListener('openQuiz', handleOpenQuiz);
            unsubscribeFavorites();
        };
    }, []);

    useEffect(() => {
        const worker = new Worker(new URL('./workers/search.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'SEARCH_RESULT') {
                setTimeout(() => {
                    setResults(payload.results);
                    setVisibleCount(20); // Reset count on new results
                    setIsLoading(false);
                }, 300);
            }
        };
        searchWorkerRef.current = worker;
        return () => worker.terminate();
    }, []);

    useEffect(() => {
        const h = () => setSelectedWordId(window.history.state?.id || null);
        window.addEventListener('popstate', h);
        return () => {
            window.removeEventListener('popstate', h);
        };
    }, []);

    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!isDataReady) return;
        const mode = activeTab === 'favorites' ? 'favorites' : 'all';
        if (!term && mode !== 'favorites') { setResults([]); return; }
        setIsLoading(true);
        searchWorkerRef.current?.postMessage({
            type: 'SEARCH',
            payload: { options: { query: term, mode: mode, type: 'all', sort: 'relevance' }, favIds: Array.from(favoritesSet) }
        });
    }, [searchTerm, activeTab, isDataReady, favoritesSet]);

    const handleTabChange = (tab: string) => {
        HapticManager.light();

        const update = () => {
            setActiveTab(tab);
            setSearchTerm('');
            setVisibleCount(50);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        if ((document as any).startViewTransition) {
            (document as any).startViewTransition(update);
        } else {
            update();
        }
    };

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 300) {
            if (visibleCount < results.length) {
                setVisibleCount(prev => prev + 20);
            }
        }
    }, [visibleCount, results.length]);

    const handleWordClick = useCallback((id: number, word?: string) => {
        HapticManager.light();
        if (word) {
            SearchHistoryManager.add(word);
            setHistory(SearchHistoryManager.get());
        }
        const change = () => {
            setSelectedWordId(id);
            window.history.pushState({ view: 'details', id }, '', `?id=${id}`);
        };
        if ((document as any).startViewTransition) {
            (document as any).startViewTransition(change);
        } else {
            change();
        }
    }, []);

    const handleDataReady = (data: any[][]) => {
        (window as any).dictionaryData = data;
        setIsDataReady(true);
        setDailyContent(DailyContentService.getDailyContent(data));
        searchWorkerRef.current?.postMessage({ type: 'INIT_DATA', payload: data });
    };

    if (!isDataReady) {
        return <SplashView onComplete={handleDataReady} />;
    }

    if (activeTab === 'quiz') return <QuizComponent onClose={() => handleTabChange('search')} mode={quizConfig.mode} targetWords={quizConfig.words} />;
    const renderContent = () => {
        if (selectedWordId) {
            return (
                <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                    <ErrorBoundary><DetailsView wordId={selectedWordId} onBack={() => { setSelectedWordId(null); window.history.back(); }} /></ErrorBoundary>
                </div>
            );
        }

        return (
            <>
                <div style={styles.header}>
                    <div style={styles.topBar}>
                        {/* Settings moved to dock */}
                        <div style={{ ...styles.brandCapsule, boxShadow: `0 0 20px ${accentColor}33`, borderColor: `${accentColor}44` }}>Snabba Lexin</div>
                        <div style={{ ...styles.statsBadge, borderColor: `${accentColor}44`, gap: '8px' }} className="premium-card">
                            <span className="fire-active" title="Streak" aria-label={`Streak: ${stats.streak}`}>🔥 {stats.streak}</span>
                            <span style={{ opacity: 0.3 }}>|</span>
                            <span title="Achievements" aria-label={`Achievements: ${stats.unlocked}/${stats.total}`}>🏆 {stats.unlocked}</span>
                        </div>
                    </div>
                    {(activeTab === 'search' || activeTab === 'favorites') && (
                        <div style={styles.searchRow}>
                            <div style={styles.searchBox}>
                                <span style={styles.searchIconInside}>🔍</span>
                                <input type="text" placeholder="Sök..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.premiumInput} />
                                {results.length > 0 && <span style={styles.resultCounterInside}>{results.length}x</span>}
                            </div>
                        </div>
                    )}
                </div>
                <div style={styles.contentArea}>
                    <div style={styles.scrollList} key={activeTab} ref={scrollContainerRef} onScroll={handleScroll}>
                        {activeTab === 'search' && !searchTerm && (
                            <div style={{ marginBottom: '20px', padding: '0 20px' }} className="tab-content-active">
                                <MistakesView />
                                {dailyContent && <DailyCard content={dailyContent} onOpenSettings={() => setIsSettingsOpen(true)} />}

                                {history.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Senaste sökningar</h3>
                                            <button
                                                onClick={() => { SearchHistoryManager.clear(); setHistory([]); }}
                                                style={{ background: 'transparent', border: 'none', color: accentColor, fontSize: '0.8rem', cursor: 'pointer' }}
                                            >
                                                Rensa
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {history.map((h, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSearchTerm(h)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        padding: '8px 15px',
                                                        borderRadius: '12px',
                                                        color: '#fff',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {(activeTab === 'search' || activeTab === 'favorites') && (
                            <div className="tab-content-active">
                                {isLoading ? Array(5).fill(0).map((_, i) => <div key={i} style={{ ...styles.card, background: '#222', opacity: 0.5 }} className="shimmer"></div>) : (
                                    <>
                                        {results.slice(0, visibleCount).map((word) => (
                                            <WordCard key={word.id} word={word} isFav={favoritesSet.has(word.id.toString())} onClick={() => handleWordClick(word.id, word.swedish)} onToggleFav={(id: string) => FavoritesManager.toggle(id)} accentColor={accentColor} />
                                        ))}
                                        {isDataReady && results.length === 0 && searchTerm && <div style={styles.emptyState}>Inga resultat</div>}
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === 'games' && <GamesView />}
                        {activeTab === 'learn' && <LearnView />}
                        {activeTab === 'profile' && <ProfileView />}
                        {activeTab === 'add' && <AddWordView onBack={() => setActiveTab('search')} />}
                        {activeTab === 'changelog' && <ChangelogView onBack={() => setActiveTab('settings' as any)} />}
                        {activeTab === 'device' && <DeviceInfoView onBack={() => setActiveTab('settings' as any)} />}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div style={styles.container}>
            {/* DEBUG: Yellow border - bottom aligns with Dock top */}
            <div style={{
                border: '3px solid yellow',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                marginBottom: '85px'  /* Dock: bottom 20px + height 65px = 85px */
            }}>
                {renderContent()}
            </div>

            {/* Dock - Always visible */}
            <div style={styles.dockContainer}>
                <div style={styles.dock}>
                    {(['search', 'games', 'learn', 'add', 'profile', 'settings'] as const).map(tab => {
                        const icons = { search: '🔍', games: '🎮', learn: '📚', add: '➕', profile: '👤', settings: '⚙️' };
                        const isActive = activeTab === tab && !selectedWordId;
                        return (
                            <button key={tab}
                                onClick={() => {
                                    if (selectedWordId) {
                                        // Coming from DetailsView - close it and go to the tab
                                        setSelectedWordId(null);
                                        window.history.back();
                                        if (tab !== 'settings' && tab !== activeTab) {
                                            handleTabChange(tab);
                                        }
                                    } else if (tab === 'settings') {
                                        HapticManager.light();
                                        setIsSettingsOpen(true);
                                    } else if (tab !== activeTab) {
                                        // Only change tab if different from current
                                        handleTabChange(tab);
                                    }
                                    // If same tab and not in DetailsView, do nothing (preserve search results)
                                }}
                                style={{ ...styles.dockItem, backgroundColor: isActive ? `${accentColor}33` : 'transparent', color: isActive ? accentColor : '#fff', transform: isActive ? 'scale(1.1) translateY(-5px)' : 'scale(1)' }}
                                aria-label={tab === 'settings' ? 'Inställningar' : tab}
                            >
                                {icons[tab]}{isActive && <div style={{ position: 'absolute', bottom: '5px', width: '4px', height: '4px', borderRadius: '50%', background: accentColor }} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isSettingsOpen && (
                <FullSettings
                    onClose={() => setIsSettingsOpen(false)}
                    accentColor={accentColor}
                    onAccentChange={(c: string) => { setAccentColor(c); localStorage.setItem('snabba_accent_color', c); }}
                    onOpenChangelog={() => { setIsSettingsOpen(false); setActiveTab('changelog' as any); }}
                    onOpenDeviceInfo={() => { setIsSettingsOpen(false); setActiveTab('device' as any); }}
                />
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { height: '100dvh', width: '100%', maxWidth: '414px', position: 'fixed', inset: 0, margin: '0 auto', overflow: 'hidden', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', zIndex: 9999, touchAction: 'pan-y' },
    header: { flexShrink: 0, paddingBottom: '10px' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' },
    brandCapsule: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 25px', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', backdropFilter: 'blur(10px)' },
    statsBadge: { background: 'rgba(28, 28, 30, 0.6)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center' },
    iconBtn: { background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer' },
    searchRow: { display: 'flex', padding: '0 20px', gap: '12px', alignItems: 'center' },
    searchBox: { position: 'relative', flex: 1, display: 'flex', alignItems: 'center' },
    premiumInput: { width: '100%', padding: '14px 15px 14px 45px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(28, 28, 30, 0.6)', color: '#fff', fontSize: '1rem', outline: 'none', backdropFilter: 'blur(15px)' },
    searchIconInside: { position: 'absolute', left: '15px', color: '#8e8e93', fontSize: '18px' },
    resultCounterInside: { position: 'absolute', right: '15px', color: '#636366', fontSize: '0.8rem' },
    contentArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
    scrollList: { flex: 1, overflowY: 'auto', padding: '10px 0', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', minHeight: 0 },
    emptyState: { textAlign: 'center', padding: '40px', color: '#8e8e93' },
    card: { backgroundColor: 'rgba(28, 28, 30, 0.6)', borderRadius: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', padding: '18px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', margin: '0 20px 15px 20px', backdropFilter: 'blur(10px)', minHeight: '120px', touchAction: 'pan-y' },
    menuCard: { flex: 1, background: 'rgba(28, 28, 30, 0.6)', borderRadius: '24px', padding: '25px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(10px)', touchAction: 'pan-y' },
    actionRow: { display: 'flex', gap: '12px', alignItems: 'center' },
    actionBtn: { background: 'transparent', border: 'none', color: '#8e8e93', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '20px' },
    cardMainContent: { display: 'flex', flexDirection: 'column', gap: '4px' },
    swedish: { fontWeight: '800', color: '#fff' },
    arabic: { color: '#eee', textAlign: 'right' },
    dockContainer: { position: 'fixed', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10000 },
    dock: { display: 'flex', background: 'rgba(28, 28, 30, 0.8)', backdropFilter: 'blur(20px)', padding: '10px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    dockItem: { width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', borderRadius: '15px', cursor: 'pointer', border: 'none', color: '#fff', background: 'transparent', position: 'relative', transition: 'all 0.3s' }
};

export const HomeView: React.FC = () => (<ErrorBoundary><HomeViewInner /></ErrorBoundary>);