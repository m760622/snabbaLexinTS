import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchService, SearchResult, SearchStats } from './search-service';
import { SearchHistoryManager } from './search-history';
import { FavoritesManager } from './favorites';
import { TypeColorSystem } from './type-color-system';
import { TTSManager } from './tts';
import { showToast, TextSizeManager } from './utils';
import { DailyContentService, DailyContent } from './daily-content';

// --- Constants & Types ---
interface FilterOption {
  value: string;
  labelSv: string;
  labelAr: string;
  countKey?: string;
}

const MODES: FilterOption[] = [
  { value: 'all', labelSv: 'Alla', labelAr: 'الكل' },
  { value: 'start', labelSv: 'Börjar med', labelAr: 'يبدأ بـ' },
  { value: 'end', labelSv: 'Slutar med', labelAr: 'ينتهي بـ' },
  { value: 'exact', labelSv: 'Exakt', labelAr: 'مطابق' },
  { value: 'favorites', labelSv: 'Favoriter', labelAr: 'المفضلة' },
];

const SORTS: FilterOption[] = [
  { value: 'relevance', labelSv: 'Relevans', labelAr: 'الأكثر صلة' },
  { value: 'richness', labelSv: 'Mest info', labelAr: 'الأغنى محتوى' },
  { value: 'alpha_asc', labelSv: 'A-Ö', labelAr: 'أ-ي' },
  { value: 'alpha_desc', labelSv: 'Ö-A', labelAr: 'ي-أ' },
  { value: 'last_char', labelSv: 'Sista bokstav', labelAr: 'الحرف الأخير' },
];

const TYPES: FilterOption[] = [
  { value: 'all', labelSv: 'Alla typer', labelAr: 'كل الأنواع', countKey: 'all' },
  { value: 'subst', labelSv: 'Substantiv', labelAr: 'اسم', countKey: 'subst' },
  { value: 'verb', labelSv: 'Verb', labelAr: 'فعل', countKey: 'verb' },
  { value: 'adj', labelSv: 'Adjektiv', labelAr: 'صفة', countKey: 'adj' },
  { value: 'adv', labelSv: 'Adverb', labelAr: 'حال', countKey: 'adv' },
  { value: 'prep', labelSv: 'Preposition', labelAr: 'حرف جر', countKey: 'prep' },
  { value: 'pron', labelSv: 'Pronomen', labelAr: 'ضمير', countKey: 'pron' },
  { value: 'konj', labelSv: 'Konjunktion', labelAr: 'أداة عطف', countKey: 'konj' },
  { value: 'fras', labelSv: 'Fras/Uttryck', labelAr: 'عبارة', countKey: 'fras' },
  { value: 'juridik', labelSv: '⚖️ Juridik', labelAr: 'قانون', countKey: 'juridik' },
  { value: 'medicin', labelSv: '🏥 Medicin', labelAr: 'طب', countKey: 'medicin' },
  { value: 'it', labelSv: '💻 IT/Teknik', labelAr: 'تقنية', countKey: 'it' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Sub-Component: DailyCubeCard (Interactive Swipe Cube) ---
const DailyCubeCard = React.memo(({ content, onClick }: { content: DailyContent; onClick: (id: string | number) => void }) => {
  const [faceIndex, setFaceIndex] = useState(0); 
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Drag State
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
      if (content) setIsFav(FavoritesManager.has(content.id.toString()));
  }, [content]);

  if (!content) return null;

  const rotateCube = (targetIndex: number) => {
      const current = ((faceIndex % 4) + 4) % 4; 
      const diff = targetIndex - current;
      setFaceIndex(prev => prev + diff);
  };

  // --- Drag/Swipe Handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
      dragStartX.current = e.clientX;
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDragging.current || dragStartX.current === null) return;
      
      const diff = dragStartX.current - e.clientX;
      const threshold = 50; 

      if (Math.abs(diff) > threshold) {
          if (diff > 0) setFaceIndex(prev => prev + 1);
          else setFaceIndex(prev => prev - 1);
      }
      
      isDragging.current = false;
      dragStartX.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // --- Actions ---
  const handleSpeak = async (e: React.PointerEvent) => {
      e.stopPropagation();
      if (isPlaying) return;
      setIsPlaying(true);
      try { await TTSManager.speak(content.swedish, 'sv'); } catch (err) { console.error(err); } finally { setIsPlaying(false); }
  };

  const handleCopy = async (e: React.PointerEvent) => {
      e.stopPropagation();
      try { 
          await navigator.clipboard.writeText(`${content.swedish} - ${content.translation}`); 
          showToast('Kopierat / تم النسخ 📋'); 
      } catch { 
          showToast('Fel / خطأ'); 
      }
  };

  const handleFav = (e: React.PointerEvent) => {
      e.stopPropagation();
      const newStatus = FavoritesManager.toggle(content.id.toString());
      setIsFav(newStatus);
  };

  const handleDetails = (e: React.PointerEvent) => {
      e.stopPropagation();
      onClick(content.id);
  };

  // Prevent drag when interacting with buttons
  const stopEvent = (e: React.PointerEvent) => {
      e.stopPropagation();
  };

  const isProverb = content.type === 'proverb';
  const themeColor = isProverb ? '#9C27B0' : (content.type === 'idiom' ? '#E65100' : '#2E7D32');
  const rotation = faceIndex * -90;
  const activeFace = ((faceIndex % 4) + 4) % 4;

  const Face = ({ children, style = {} }: any) => (
      <div style={{
          position: 'absolute',
          width: '300px',
          height: '220px',
          left: '10px',
          top: '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          background: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(25px)',
          border: `1.5px solid ${themeColor}88`,
          borderRadius: '28px',
          backfaceVisibility: 'hidden',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: `0 12px 40px rgba(0,0,0,0.4)`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
          ...style
      }}>
          {children}
      </div>
  );

  return (
    <div style={styles.cubeContainer}>
        <style>
            {`
            .cube-viewport { perspective: 1200px; width: 320px; height: 240px; margin: 0 auto 20px auto; position: relative; cursor: grab; }
            .cube-viewport:active { cursor: grabbing; }
            .cube { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
            .cube-dot { width: 6px; height: 6px; border-radius: 50%; background: #444; cursor: pointer; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.1); padding: 0; }
            .cube-dot.active { background: ${themeColor}; transform: scale(1.2); box-shadow: 0 0 8px ${themeColor}; }
            .cube-action-btn; { 
                background: rgba(255,255,255,0.12); 
                border: 1px solid rgba(255,255,255,0.1);
                color: #fff; 
                width: 44px; 
                height: 44px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                cursor: pointer; 
                transition: all 0.2s; 
                backdrop-filter: blur(5px);
                pointer-events: auto;
                padding: 0;
            }
            .cube-action-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.1); }
            .cube-action-btn:active { transform: scale(0.9); background: ${themeColor}44; }
            .cube-action-btn.fav-active { color: #F59E0B; background: rgba(245, 158, 11, 0.2); border-color: #F59E0B44; }
            `}
        </style>

        <div 
            className="cube-viewport"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <div className="cube" style={{ transform: `translateZ(-150px) rotateY(${rotation}deg)` }}>
                {/* Front Face: Swedish + Actions */}
                <Face style={{ transform: 'rotateY(0deg) translateZ(150px)' }}>
                    <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: themeColor, fontWeight: 'bold', border: `1px solid ${themeColor}`, padding: '2px 8px', borderRadius: '10px' }}>
                            {content.tags?.[0] || 'ORD'}
                        </span>
                        {content.rawType && (
                            <span style={{ fontSize: '0.65rem', color: '#888', textTransform: 'lowercase', letterSpacing: '0.5px' }}>
                                {content.rawType.replace('.', '')}
                            </span>
                        )}
                    </div>
                    
                    <h2 style={{ 
                        fontSize: content.swedish.length > 12 ? '1.5rem' : (content.swedish.length > 8 ? '1.8rem' : '2.2rem'), 
                        margin: '15px 0 5px 0', 
                        color: '#fff', 
                        fontWeight: '800', 
                        lineHeight: 1.1,
                        wordBreak: 'break-word',
                        maxWidth: '100%'
                    }}>
                        {content.swedish}
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#ccc', margin: '0 0 15px 0', fontFamily: '"Tajawal", sans-serif' }}>{content.translation}</p>
                    
                    {/* ALL Actions on Front Face */}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '5px', alignItems: 'center', zIndex: 10 }}>
                        <button className="cube-action-btn" onPointerDown={stopEvent} onPointerUp={handleSpeak} title="Lyssna">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </button>
                        <button className="cube-action-btn" onPointerDown={stopEvent} onPointerUp={handleCopy} title="Kopiera">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                        <button className={`cube-action-btn ${isFav ? 'fav-active' : ''}`} onPointerDown={stopEvent} onPointerUp={handleFav} title="Spara">
                            {isFav ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            )}
                        </button>
                        <button className="cube-action-btn" onPointerDown={stopEvent} onPointerUp={handleDetails} title="التفاصيل">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </button>
                    </div>
                </Face>

                {/* Right Face: Arabic (Big) */}
                <Face style={{ transform: 'rotateY(90deg) translateZ(150px)' }}>
                    <span style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '0.7rem', color: themeColor, fontWeight: 'bold', border: `1px solid ${themeColor}`, padding: '2px 8px', borderRadius: '10px' }}>
                        ÖVERS
                    </span>
                    <h2 style={{ fontSize: '2.4rem', margin: 0, color: themeColor, fontFamily: '"Tajawal", sans-serif', fontWeight: '700' }}>{content.translation}</h2>
                </Face>

                {/* Back Face: Example */}
                <Face style={{ transform: 'rotateY(180deg) translateZ(150px)' }}>
                    <span style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '0.7rem', color: themeColor, fontWeight: 'bold', border: `1px solid ${themeColor}`, padding: '2px 8px', borderRadius: '10px' }}>
                        EXEMPEL
                    </span>
                    <div style={{ fontStyle: 'italic', color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.5', padding: '0 10px' }}>
                        {content.example ? `"${content.example}"` : 'Inga exempel / لا يوجد مثال'}
                    </div>
                    <div style={{ width: '40px', height: '4px', background: themeColor, borderRadius: '2px', marginTop: '15px' }}></div>
                </Face>

                {/* Left Face: Info/Explanation */}
                <Face style={{ transform: 'rotateY(-90deg) translateZ(150px)' }}>
                    <span style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '0.7rem', color: themeColor, fontWeight: 'bold', border: `1px solid ${themeColor}`, padding: '2px 8px', borderRadius: '10px' }}>
                        INFO
                    </span>
                    <div style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.5' }}>
                        {content.explanation || content.literal || '...'}
                    </div>
                </Face>
            </div>
        </div>

        {/* Navigation Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '-10px', marginBottom: '25px' }}>
            {[0, 1, 2, 3].map(i => (
                <button 
                    key={i} 
                    className={`cube-dot ${activeFace === i ? 'active' : ''}`} 
                    onPointerDown={stopEvent}
                    onPointerUp={() => rotateCube(i)}
                    aria-label={`Rotera till sida ${i + 1}`}
                />
            ))}
        </div>
    </div>
  );
});

// --- WordCard (Memoized) ---
const WordCard = React.memo(({ word, onClick }: { word: SearchResult; onClick: () => void }) => {
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const typeInfo = TypeColorSystem.detect(word.type, word.swedish, word.forms, word.gender, word.arabic);
  const primaryColor = typeInfo.color.primary;
  const typeLabel = typeInfo.color.label.sv; 

  useEffect(() => {
    setIsFav(FavoritesManager.has(word.id.toString()));
    const unsub = FavoritesManager.onChange((id, status) => {
        if (id === word.id.toString()) setIsFav(status);
    });
    return unsub;
  }, [word.id]);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    try { await TTSManager.speak(word.swedish, 'sv'); } catch (err) { console.error("TTS Error", err); } finally { setIsPlaying(false); }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${word.swedish} - ${word.arabic}`;

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            showToast('Kopierat / تم النسخ 📋');
        } else {
            throw new Error('Clipboard API unavailable');
        }
    } catch (err) {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) showToast('Kopierat / تم النسخ 📋');
        } catch (fallbackErr) {
            showToast('Kunde inte kopiera / تعذر النسخ ❌');
        }
    }
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    FavoritesManager.toggle(word.id.toString());
  };

  return (
    <div 
        style={{ ...styles.card, borderLeft: `5px solid ${primaryColor}` }} 
        onClick={onClick}
    >
      <div style={styles.cardContent}>
        <div style={styles.cardTopRow}>
            <span style={{
                ...styles.wordTypeBadge, 
                color: primaryColor, 
                borderColor: primaryColor
            }}>
                {typeLabel}
            </span>

            <div style={styles.actionRow}>
                <button 
                    style={{
                        ...styles.actionBtn, 
                        color: isPlaying ? '#3b82f6' : '#8e8e93',
                        transform: isPlaying ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                    }} 
                    onClick={handleSpeak} 
                    aria-label="Lyssna"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
                <button style={styles.actionBtn} onClick={handleCopy} aria-label="Kopiera">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
                <button 
                    style={{...styles.actionBtn, color: isFav ? '#F59E0B' : '#8e8e93'}} 
                    onClick={handleFav} 
                    aria-label="Spara"
                >
                    {isFav ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    )}
                </button>
            </div>
        </div>

        <div style={styles.cardMainContent}>
            <div style={styles.swedish}>{word.swedish}</div>
            {word.forms && <div style={styles.forms}>{word.forms}</div>}
            <div style={styles.arabic}>{word.arabic}</div>
        </div>
      </div>
    </div>
  );
});

export const HomeView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [type, setType] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(50); // Infinite scroll limit
  const [isLoading, setIsLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [initialRestoreDone, setInitialRestoreDone] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const STORAGE_KEY = 'snabbaLexin_home_state_v2';

  // 1. Initialize
  useEffect(() => {
    const savedStats = localStorage.getItem('snabbaLexin_stats_cache');
    if (savedStats) { try { setStats(JSON.parse(savedStats)); } catch {} }

    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            setSearchTerm(parsed.searchTerm || '');
            setMode(parsed.mode || 'all');
            setType(parsed.type || 'all');
            setSort(parsed.sort || 'relevance');
            
            if (parsed.mode !== 'all' || parsed.type !== 'all') {
                setIsFiltersOpen(true);
            }

            if (parsed.scrollY) setTimeout(() => window.scrollTo(0, parsed.scrollY), 150);
        } catch {}
    }
    setInitialRestoreDone(true);
    setHistory(SearchHistoryManager.get());

    const checkData = () => {
      const data = (window as any).dictionaryData;
      if (data && data.length > 0) {
        setIsDataReady(true);
        setDailyContent(DailyContentService.getRandomContent(data));
      }
    };
    
    checkData();
    window.addEventListener('dictionaryLoaded', checkData);
    return () => window.removeEventListener('dictionaryLoaded', checkData);
  }, []);

  // 2. Persist State
  useEffect(() => {
      if (!initialRestoreDone) return;
      const stateToSave = { searchTerm, mode, type, sort, scrollY: window.scrollY };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [searchTerm, mode, type, sort, initialRestoreDone]);

  // 3. Search Logic
  useEffect(() => {
    if (!isDataReady) return;
    
    const isBrowsing = mode === 'favorites' || type !== 'all';
    const hasQuery = !!debouncedSearchTerm.trim();
    const data = (window as any).dictionaryData;
    
    if (!hasQuery && !isBrowsing) {
        if (data && !stats) {
            const { stats: globalStats } = SearchService.searchWithStats(data, {
                query: '', mode: 'all', type: 'all', sort: 'relevance'
            });
            setStats(globalStats);
            localStorage.setItem('snabbaLexin_stats_cache', JSON.stringify(globalStats));
        }
        setResults([]);
        return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
        const { results: newResults, stats: newStats } = SearchService.searchWithStats(data, {
            query: debouncedSearchTerm, mode, type, sort
        });
        setResults(newResults);
        setStats(newStats);
        setVisibleLimit(50);
        setIsLoading(false);
    }, 10);
    return () => clearTimeout(timer);

  }, [debouncedSearchTerm, mode, sort, type, isDataReady]);

  const handleResultClick = useCallback((id: number) => {
    if (searchTerm.trim()) {
      SearchHistoryManager.add(searchTerm.trim());
      setHistory(SearchHistoryManager.get());
    }
    const stateToSave = { searchTerm, mode, type, sort, scrollY: window.scrollY };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    window.location.href = `details.html?id=${id}`;
  }, [searchTerm, mode, type, sort]);

  const clearFilters = () => {
    setMode('all'); setType('all'); setSort('relevance');
  };
  const hasActiveFilters = mode !== 'all' || type !== 'all' || sort !== 'relevance';

  const FilterSelect = ({ label, value, options, onChange, icon, statsData }: any) => (
    <div style={styles.selectWrapper}>
      <div style={styles.selectLabel}>{icon} {label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{...styles.selectInput, ...(value !== 'all' && value !== 'relevance' ? styles.selectActive : {})}}>
        {options.map((opt: any) => {
            let countLabel = '';
            if (statsData && opt.countKey) {
                const count = statsData.types[opt.countKey];
                if (count > 0) countLabel = ` (${count.toLocaleString()})`;
            }
            return <option key={opt.value} value={opt.value}>{opt.labelSv}{countLabel}</option>
        })}
      </select>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.topBar}>
            <div style={styles.brandTitle}><span style={{color:'#3b82f6'}}>Snabba</span>Lexin</div>
            <button 
                style={styles.settingsBtn} 
                onClick={() => {
                    const settingsMenu = document.getElementById('settingsMenu');
                    const settingsBtn = document.getElementById('settingsBtn');
                    if (settingsMenu && settingsBtn) {
                        settingsMenu.classList.remove('hidden');
                        settingsBtn.classList.add('active');
                    }
                }}
                aria-label="Settings"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
        </div>

        <div style={styles.searchRow}>
            <div style={styles.searchContainer}>
                <span style={styles.searchIcon}>🔍</span>
                <input 
                    type="text" 
                    placeholder={isDataReady ? "Sök / بحث..." : "Laddar..."} 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={styles.input} 
                    disabled={!isDataReady} 
                />
                
                {isDataReady && (
                     <span style={styles.totalCountBadge}>
                        {(stats && stats.total > 0 ? stats.total : ((window as any).dictionaryData?.length || 0)).toLocaleString()}
                     </span>
                )}

                {isLoading && <div style={styles.spinner}></div>}
                {searchTerm && !isLoading && (
                    <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>✕</button>
                )}
            </div>
            <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} style={{...styles.filterToggleBtn, ...(isFiltersOpen || hasActiveFilters ? styles.filterToggleActive : {})}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </button>
        </div>
        
        {isFiltersOpen && (
            <div style={styles.filtersSection}>
                <div style={styles.filtersGrid}>
                    <FilterSelect label="Läge" icon="⚙️" value={mode} options={MODES} onChange={setMode} />
                    <FilterSelect label="Sortering" icon="🔃" value={sort} options={SORTS} onChange={setSort} />
                    <FilterSelect label="Typ" icon="📝" value={type} options={TYPES} onChange={setType} statsData={stats} />
                </div>
                {hasActiveFilters && <button onClick={clearFilters} style={styles.resetFiltersBtn}>Åترستال فيلتر / إعادة ضبط</button>}
            </div>
        )}
        
        {!isFiltersOpen && hasActiveFilters && (
             <div style={styles.activeFiltersRow}>
                 {mode !== 'all' && <span style={styles.activeChip}>Mode: {mode}</span>}
                 {type !== 'all' && <span style={styles.activeChip}>Typ: {type}</span>}
             </div>
        )}
      </div>
      
      <div style={styles.list}>
        {!isDataReady && <div style={styles.emptyState}><p>Laddار lexikon...</p></div>}
        
        {isDataReady && !searchTerm && !hasActiveFilters && dailyContent && (
            <div style={{ marginBottom: '16px', animation: 'fadeIn 0.5s' }}>
                <DailyCubeCard 
                    content={dailyContent} 
                    onClick={(id) => {
                         if (typeof id === 'number') handleResultClick(id);
                    }} 
                />
            </div>
        )}

        {isDataReady && results.length === 0 && !isLoading && !hasActiveFilters && !searchTerm && (
            <div style={styles.historySection}>
                {history.length > 0 ? (
                     <div style={styles.historyGrid}>
                        {history.map((item, idx) => (
                            <button key={idx} style={styles.historyChip} onClick={() => setSearchTerm(item)}>🕒 {item}</button>
                        ))}
                     </div>
                ) : (<div style={styles.emptyState}><p style={{opacity: 0.6}}>Sök efter ord...</p></div>)}
            </div>
        )}

        {isDataReady && results.length === 0 && !isLoading && (searchTerm || hasActiveFilters) && (
             <div style={styles.emptyState}><p>Ingا نتائج / لا توجد نتائج</p></div>
        )}

        {/* INFINITE SCROLL RENDER */}
        {results.slice(0, visibleLimit).map((word) => (
            <WordCard key={word.id} word={word} onClick={() => handleResultClick(word.id)} />
        ))}
        {results.length > visibleLimit && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Laddar fler...</div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' },
  header: { position: 'sticky', top: 0, backgroundColor: 'rgba(18, 18, 18, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #333', zIndex: 100, paddingBottom: '8px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 4px 16px', marginBottom: '4px' },
  brandTitle: { fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' },
  settingsBtn: { background: 'transparent', border: 'none', color: '#8e8e93', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  searchRow: { display: 'flex', alignItems: 'center', padding: '4px 16px 12px 16px', gap: '10px' },
  searchContainer: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' },
  input: { width: '100%', padding: '12px 90px 12px 40px', borderRadius: '12px', border: 'none', backgroundColor: '#2c2c2e', color: '#fff', fontSize: '16px', outline: 'none' },
  totalCountBadge: { position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', color: '#636366', fontSize: '12px', fontWeight: '600', pointerEvents: 'none' },
  spinner: { position: 'absolute', right: '12px', top: '50%', marginTop: '-8px', width: '16px', height: '16px', border: '2px solid #8e8e93', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  clearBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer', fontSize: '16px' },
  filterToggleBtn: { backgroundColor: '#2c2c2e', border: 'none', borderRadius: '12px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e8e93', cursor: 'pointer', transition: 'all 0.2s' },
  filterToggleActive: { backgroundColor: '#0A84FF', color: '#fff' },
  filtersSection: { padding: '0 16px 12px 16px', animation: 'fadeIn 0.2s' },
  filtersGrid: { display: 'flex', gap: '8px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' },
  selectWrapper: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px', flex: '1 0 0' },
  selectLabel: { fontSize: '11px', color: '#8e8e93', marginLeft: '4px' },
  selectInput: { width: '100%', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#2c2c2e', border: '1px solid transparent', color: '#fff', fontSize: '13px', outline: 'none', appearance: 'none' },
  selectActive: { borderColor: '#0A84FF', color: '#0A84FF', backgroundColor: 'rgba(10, 132, 255, 0.1)' },
  resetFiltersBtn: { width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px dashed #3a3a3c', color: '#8e8e93', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
  activeFiltersRow: { display: 'flex', gap: '8px', padding: '0 16px 8px 16px', overflowX: 'auto' },
  activeChip: { fontSize: '11px', backgroundColor: '#0A84FF', color: '#fff', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' },
  list: { padding: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  emptyState: { textAlign: 'center', color: '#8e8e93', marginTop: '40px' },
  historySection: { marginTop: '10px' },
  historyGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  historyChip: { backgroundColor: '#2c2c2e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  card: { position: 'relative', height: '120px', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#1c1c1e', border: '1px solid #333', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', marginBottom: '12px', boxSizing: 'border-box', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' },
  cardContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' },
  cardTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0px' },
  cardMainContent: { display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', paddingBottom: '2px' },
  swedish: { fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' },
  wordTypeBadge: { fontSize: '0.7rem', fontWeight: '700', padding: '2px 6px', borderRadius: '5px', letterSpacing: '0.02em', textTransform: 'uppercase', background: 'transparent', border: '1.2px solid' },
  actionRow: { display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' },
  actionBtn: { padding: '0', width: '30px', height: '30px', minWidth: '30px', minHeight: '30px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent', border: 'none', color: '#8e8e93', cursor: 'pointer' },
  forms: { fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', opacity: 0.8, marginTop: '-2px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  arabic: { fontSize: '1rem', color: '#8e8e93', margin: 0, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal', textAlign: 'right' },
  cubeContainer: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', padding: '20px 0' }
};