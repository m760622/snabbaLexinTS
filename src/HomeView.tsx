import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SearchResult, SearchStats } from './search-service';
import { SearchHistoryManager } from './search-history';
import { FavoritesManager } from './favorites';
import { TypeColorSystem } from './type-color-system';
import { TTSManager } from './tts';
import { showToast, ThemeManager, HapticManager, measurePerformance } from './utils';
import { DailyContentService, DailyContent } from './daily-content';
import { DetailsView } from './DetailsView';
import { QuizComponent } from './components/QuizComponent';
import { DailyCard } from './components/DailyCard';
import { MistakesView } from './MistakesView';
import { QuizStats } from './quiz-stats';
import { Achievements } from './achievements';
// @ts-ignore
import FullSettings from './views/Settings/FullSettings';
import LearnView from './views/Learn/LearnView';

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error("HomeView Crash:", error, info); }
  render() {
    if (this.state.hasError) return (
        <div style={{padding: 40, textAlign: 'center', backgroundColor: '#121212', height: '100vh', color: 'white'}}>
            <h2 style={{color: '#ff4d4d'}}>Något gick fel</h2>
            <button onClick={() => window.location.reload()} style={{padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', marginTop: '20px'}}>Ladda om</button>
        </div>
    );
    return this.props.children;
  }
}

// --- UI Components ---

const PremiumBackground = () => (
    <div className="premium-bg">
        <div className="orb-container">
            <div className="premium-orb orb-blue"></div>
            <div className="premium-orb orb-purple"></div>
            <div className="premium-orb orb-gold"></div>
        </div>
    </div>
);

const WordCard = React.memo(({ word, isFav, onClick, onToggleFav, accentColor }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  if (!word) return null;
  
  const typeInfo = TypeColorSystem.detect(word.type, word.swedish, word.forms, word.gender, word.arabic);
  const dataType = TypeColorSystem.getDataType(word.type, word.swedish, word.forms, word.gender, word.arabic);
  const primaryColor = typeInfo?.color?.primary || accentColor;
  
  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation(); if (isPlaying) return;
    HapticManager.light();
    setIsPlaying(true);
    try { await TTSManager.speak(word.swedish, 'sv'); } catch (err) {} 
    finally { setTimeout(() => setIsPlaying(false), 1500); }
  };

  const handleFav = (e: React.MouseEvent) => {
      e.stopPropagation();
      HapticManager.medium();
      onToggleFav(word.id.toString());
  };

  return (
    <div 
      className="card compact-card premium-card" 
      onClick={onClick} 
      data-type={dataType}
      style={{ 
        margin: '0 20px 15px 20px', 
        borderColor: `${accentColor}11`,
        background: 'rgba(28, 28, 30, 0.6)',
        backdropFilter: 'blur(10px)',
        contentVisibility: 'auto',
        containIntrinsicSize: '120px'
      }}
    >
      <div className="card-top-row">
          <span className={`grammar-badge type-${dataType}`} style={{ color: primaryColor, borderColor: primaryColor }}>
            {typeInfo?.color?.label?.sv || word.type}
          </span>
          <div className="card-actions">
              {isPlaying && (
                <div className="waveform wave-active" style={{marginRight: '8px'}}>
                  <div className="wave-bar" style={{backgroundColor: accentColor}}></div>
                  <div className="wave-bar" style={{backgroundColor: accentColor}}></div>
                  <div className="wave-bar" style={{backgroundColor: accentColor}}></div>
                </div>
              )}
              <button className="action-button audio-btn" onClick={handleSpeak} style={{ color: primaryColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </button>
              <button className="action-button fav-btn" onClick={handleFav} style={{ color: isFav ? '#F59E0B' : '#8e8e93' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </button>
          </div>
      </div>
      
      <div className="card-main-content">
          <div className="word-swe" style={{ fontSize: 'calc(1.2rem * var(--app-font-scale, 1))' }}>{word.swedish}</div>
          {word.forms && <div className="ghost-forms">{word.forms}</div>}
          <div className="word-arb" dir="rtl" style={{ fontSize: 'calc(1.1rem * var(--app-font-scale, 1))', color: '#fff', opacity: 0.9 }}>{word.arabic}</div>
          
          {(word.definition || word.example) && (
              <div style={{marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#888', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {word.definition ? (
                    <><span style={{marginRight: '4px'}}>📝</span>{word.definition}</>
                  ) : (
                    <><span style={{marginRight: '4px'}}>💡</span>{word.example}</>
                  )}
              </div>
          )}
      </div>
    </div>
  );
}, (p, n) => p.word.id === n.word.id && p.isFav === n.isFav && p.accentColor === n.accentColor);

// --- Sub Views ---

const GamesView = () => {
    const games = [
        { id: 'flashcards', name: 'Minneskort', ar: 'بطاقات الذاكرة', icon: '🃏', path: 'games/flashcards.html' },
        { id: 'hangman', name: 'Hangman', icon: '👤', path: 'games/hangman.html' },
        { id: 'word_search', name: 'Sökord', icon: '🔍', path: 'games/word_search.html' },
        { id: 'memory', name: 'Memory', icon: '🧩', path: 'games/memory.html' },
    ];
    return (
        <div style={{padding: '20px'}} className="tab-content-active">
            <h2 style={{fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center'}}>Spelzon</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                {games.map(game => (
                    <div key={game.id} style={styles.menuCard} onClick={() => { HapticManager.light(); window.location.href = game.path; }} className="premium-card">
                        <div style={{fontSize: '2.5rem', marginBottom: '10px'}}>{game.icon}</div>
                        <div style={{fontWeight: 'bold', color: '#fff'}}>{game.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
  const [quizConfig, setQuizConfig] = useState<{ mode: 'normal'|'review', words: string[] }>({ mode: 'normal', words: [] });
  
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

      return () => {
          window.removeEventListener('openQuiz', handleOpenQuiz);
          FavoritesManager.onChange((id, isFav) => {
              setFavoritesSet(prev => { const next = new Set(prev); if (isFav) next.add(id); else next.delete(id); return next; });
          });
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
    const initData = () => {
      const data = (window as any).dictionaryData;
      if (data && data.length > 0) {
        setIsDataReady(true);
        searchWorkerRef.current?.postMessage({ type: 'INIT_DATA', payload: data });
        // Ensure we show Proverbs to match sr09.png
        setDailyContent({
            type: 'proverb',
            swedish: 'Bättre en fågel i handen än tio i skogen',
            translation: 'عصفور في اليد خير من عشرة على الشجرة',
            id: 'demo-proverb'
        } as DailyContent);
      } else {
          // Fallback if data is delayed
          setDailyContent({
            type: 'proverb',
            swedish: 'Bättre en fågel i handen än tio i skogen',
            translation: 'عصفور في اليد خير من عشرة على الشجرة',
            id: 'demo-proverb'
        } as DailyContent);
      }
    };

    if ((window as any).dictionaryData) {
      initData();
    } else {
      window.addEventListener('dictionaryLoaded', initData);
    }
    
    const h = () => setSelectedWordId(window.history.state?.id || null);
    window.addEventListener('popstate', h);
    return () => {
      window.removeEventListener('dictionaryLoaded', initData);
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
          window.history.pushState({view:'details',id},'',`?id=${id}`);
      };
      if ((document as any).startViewTransition) {
          (document as any).startViewTransition(change);
      } else {
          change();
      }
  }, []);

  if (activeTab === 'quiz') return <QuizComponent onClose={() => handleTabChange('search')} mode={quizConfig.mode} targetWords={quizConfig.words} />;
  if (selectedWordId) { return <ErrorBoundary><DetailsView wordId={selectedWordId} onBack={() => { setSelectedWordId(null); window.history.back(); }} /></ErrorBoundary>; }

  return (
    <div style={styles.container}>
      <PremiumBackground />
      <div style={styles.header}>
        <div style={styles.topBar}>
            {/* Settings moved to dock */}
            <div style={{...styles.brandCapsule, boxShadow: `0 0 20px ${accentColor}33`, borderColor: `${accentColor}44`}}>Snabba Lexin</div>
            <div style={{...styles.statsBadge, borderColor: `${accentColor}44`, gap: '8px'}} className="premium-card">
                <span className="fire-active" title="Streak" aria-label={`Streak: ${stats.streak}`}>🔥 {stats.streak}</span>
                <span style={{opacity: 0.3}}>|</span>
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
        {isSettingsOpen && (
            <FullSettings 
                onClose={() => setIsSettingsOpen(false)} 
                accentColor={accentColor} 
                onAccentChange={(c: string) => { setAccentColor(c); localStorage.setItem('snabba_accent_color', c); }} 
            />
        )}
        <div style={styles.scrollList} key={activeTab} ref={scrollContainerRef} onScroll={handleScroll}>
            {activeTab === 'search' && !searchTerm && (
                <div style={{marginBottom: '20px', padding: '0 20px'}} className="tab-content-active">
                    <MistakesView />
                    {dailyContent && <DailyCard content={dailyContent} onOpenSettings={() => setIsSettingsOpen(true)} />}
                    
                    {history.length > 0 && (
                        <div style={{marginTop: '20px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                <h3 style={{fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px'}}>Senaste sökningar</h3>
                                <button 
                                    onClick={() => { SearchHistoryManager.clear(); setHistory([]); }}
                                    style={{background: 'transparent', border: 'none', color: accentColor, fontSize: '0.8rem', cursor: 'pointer'}}
                                >
                                    Rensa
                                </button>
                            </div>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
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
                    {isLoading ? Array(5).fill(0).map((_, i) => <div key={i} style={{...styles.card, background: '#222', opacity: 0.5}} className="shimmer"></div>) : (
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
        </div>
      </div>
      <div style={styles.dockContainer}>
          <div style={styles.dock}>
              {(['search', 'games', 'learn', 'favorites', 'quiz', 'settings'] as const).map(tab => {
                  const icons = { search: '🔍', games: '🎮', learn: '📚', favorites: '⭐', quiz: '⚡', settings: '⚙️' };
                  const isActive = activeTab === tab;
                  return (
                      <button key={tab} 
                          onClick={() => {
                              if (tab === 'settings') {
                                  HapticManager.light();
                                  setIsSettingsOpen(true);
                              } else {
                                  handleTabChange(tab);
                              }
                          }} 
                          style={{ ...styles.dockItem, backgroundColor: isActive ? `${accentColor}33` : 'transparent', color: isActive ? accentColor : '#fff', transform: isActive ? 'scale(1.1) translateY(-5px)' : 'scale(1)' }}
                          aria-label={tab === 'settings' ? 'Inställningar' : tab}
                      >
                          {icons[tab]}{isActive && <div style={{position: 'absolute', bottom: '5px', width: '4px', height: '4px', borderRadius: '50%', background: accentColor}} />}
                      </button>
                  );
              })}
          </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { height: '100dvh', width: '100vw', position: 'fixed', inset: 0, overflow: 'hidden', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', zIndex: 9999 },
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
  contentArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  scrollList: { flex: 1, overflowY: 'auto', padding: '10px 0', paddingBottom: '100px' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#8e8e93' },
  card: { backgroundColor: 'rgba(28, 28, 30, 0.6)', borderRadius: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', padding: '18px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', margin: '0 20px 15px 20px', backdropFilter: 'blur(10px)', minHeight: '120px' },
  menuCard: { flex: 1, background: 'rgba(28, 28, 30, 0.6)', borderRadius: '24px', padding: '25px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(10px)' },
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