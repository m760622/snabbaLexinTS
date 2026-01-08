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

// --- Sub-Component: DailyCyberTicker (Breaking News Design) ---
const DailyCyberTicker = React.memo(({ content, onClick: _onClick, onOpenSettings }: { content: DailyContent; onClick: (id: string | number) => void; onOpenSettings: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
      if (content) setIsFav(FavoritesManager.has(content.id.toString()));
  }, [content]);

  if (!content) return null;

  // Theme Colors for different types
  let themeColor = '#3b82f6'; // Blue (Word)
  if (content.type === 'proverb') themeColor = '#00ead3'; // Turquoise
  else if (content.type === 'idiom') themeColor = '#ff0'; // Yellow
  else if (content.type === 'quran') themeColor = '#fbbf24'; // Gold
  else if (content.type === 'asma') themeColor = '#10b981'; // Emerald Green
  else if (content.type === 'cognate') themeColor = '#f97316'; // Orange
  else if (content.type === 'joke') themeColor = '#d946ef'; // Pink/Magenta
  else if (content.type === 'fact') themeColor = '#ff0000'; // Pure Red
  else if (content.type === 'grammar') themeColor = '#ef4444'; // Soft Red
  else if (content.type === 'slang') themeColor = '#84cc16'; // Lime

  const handleSpeak = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isPlaying) return;
      setIsPlaying(true);
      try { await TTSManager.speak(content.swedish, 'sv'); } catch (err) { console.error(err); } finally { setIsPlaying(false); }
  };

  const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try { 
          await navigator.clipboard.writeText(`${content.swedish} - ${content.translation}`); 
          showToast('Kopierat / تم النسخ 📋'); 
      } catch { showToast('Fel / خطأ'); }
  };

  const handleFav = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newStatus = FavoritesManager.toggle(content.id.toString());
      setIsFav(newStatus);
  };

  return (
    <div style={styles.cyberContainer}>
        <style>
            {`
            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            @keyframes pulse-neon {
                0% { box-shadow: 0 0 5px ${themeColor}44; }
                50% { box-shadow: 0 0 20px ${themeColor}88; }
                100% { box-shadow: 0 0 5px ${themeColor}44; }
            }
            .ticker-bar {
                background: #000;
                border: 1px solid ${themeColor};
                height: 40px;
                display: flex;
                align-items: center;
                overflow: hidden;
                position: relative;
                cursor: pointer;
                animation: pulse-neon 3s infinite;
                border-radius: 4px;
            }
            .ticker-label {
                background: ${themeColor};
                color: #000;
                padding: 0 12px;
                height: 100%;
                display: flex;
                align-items: center;
                font-weight: 900;
                font-size: 0.75rem;
                z-index: 2;
                white-space: nowrap;
                letter-spacing: 1px;
            }
            .ticker-content {
                white-space: nowrap;
                animation: marquee 20s linear infinite;
                animation-delay: -10s; /* Start in the middle immediately */
                color: ${themeColor};
                font-family: 'Courier New', monospace;
                font-weight: bold;
                font-size: 0.95rem;
                padding-left: 20px;
            }
            .cyber-panel {
                background: rgba(10, 10, 10, 0.98);
                border: 1px solid ${themeColor}66;
                border-top: none;
                padding: 20px;
                animation: slideDown 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                position: relative;
            }
            .cyber-button {
                background: rgba(255,255,255,0.05);
                border: 1px solid ${themeColor}44;
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                flex: 1;
            }
            .cyber-button:hover {
                background: ${themeColor}22;
                border-color: ${themeColor};
                transform: translateY(-2px);
            }
            .cyber-button.active-fav {
                color: #f59e0b;
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
            }
            `}
        </style>

        {/* The Ticker Bar */}
        <div className="ticker-bar" onClick={() => setIsOpen(!isOpen)}>
            <div className="ticker-label">{content.tags?.[0]?.toUpperCase() || 'ORD'}</div>
            <div className="ticker-content">
                {"+++ " + content.swedish.toUpperCase() + " (" + (content.rawType || 'ORD') + ") >>> " + content.translation + " >>> KLICKA FÖR MER INFO +++"}
            </div>
        </div>

        {/* Detailed Command Center */}
        {isOpen && (
            <div className="cyber-panel">
                <div style={{ position: 'absolute', top: '10px', right: '15px', color: themeColor, fontSize: '0.6rem', opacity: 0.5, fontFamily: 'monospace' }}>
                    ID: {content.id} // SECURE_LINK
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ color: themeColor, fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '5px' }}>
                        {content.type === 'quran' ? '[ QURANIC_ROOT ]' : (content.type === 'asma' ? '[ DIVINE_NAME ]' : '[ SWEDISH_CORE ]')}
                    </div>
                    <h2 style={{ 
                        fontSize: content.swedish.length > 12 ? '1.8rem' : '2.5rem', 
                        margin: 0, 
                        color: '#fff', 
                        fontWeight: '900', 
                        lineHeight: 1.1,
                        textShadow: `0 0 15px ${themeColor}66`
                    }}>
                        {content.swedish}
                    </h2>
                    
                    {/* Arabic Translations directly under Swedish */}
                    <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '1.4rem', color: themeColor, fontFamily: '"Tajawal", sans-serif', fontWeight: '700' }}>
                            {content.translation}
                        </div>
                        {content.type === 'proverb' && content.literal && (
                            <div style={{ fontSize: '1rem', color: '#aaa', fontFamily: '"Tajawal", sans-serif', borderRight: `2px solid ${themeColor}`, paddingRight: '10px' }}>
                                <span style={{ fontSize: '0.6rem', color: '#666', display: 'block' }}>BOKSTAVLIGT / حرفياً:</span>
                                {content.literal}
                            </div>
                        )}
                        {content.type === 'asma' && content.explanation && (
                            <div style={{ fontSize: '1rem', color: '#ccc', fontFamily: '"Tajawal", sans-serif', borderRight: `2px solid ${themeColor}`, paddingRight: '10px' }}>
                                {content.explanation}
                            </div>
                        )}
                    </div>
                </div>

                {/* Example / Ayah Section */}
                {(content.example || content.ayah) && (
                    <div style={{ marginBottom: '25px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid ${themeColor}` }}>
                        <div style={{ color: themeColor, fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '8px' }}>
                            {content.type === 'quran' || content.type === 'asma' ? '[ HOLY_VERSE ]' : '[ USAGE_EXAMPLE ]'}
                        </div>
                        
                        {content.ayah && (
                            <div style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontFamily: '"Amiri", "Tajawal", serif', lineHeight: '1.6', direction: 'rtl' }}>
                                {content.ayah}
                            </div>
                        )}
                        
                        {content.example && (
                            <div style={{ fontSize: '1rem', color: '#bbb', fontStyle: 'italic', lineHeight: 1.4 }}>
                                "{content.example}"
                            </div>
                        )}
                        
                        {content.surah && (
                            <div style={{ fontSize: '0.75rem', color: themeColor, marginTop: '8px', textAlign: 'right' }}>
                                — {content.surah}
                            </div>
                        )}
                    </div>
                )}

                {/* All Buttons Row */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="cyber-button" onClick={handleSpeak} title="Lyssna">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                    <button className="cyber-button" onClick={handleCopy} title="Kopiera">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button className={`cyber-button ${isFav ? 'active-fav' : ''}`} onClick={handleFav} title="Spara">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                    <button className="cyber-button" onClick={(e) => { e.stopPropagation(); onOpenSettings(); }} title="Källor / المصادر">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                </div>
            </div>
        )}
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
  
  // Daily Content Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dailyConfig, setDailyConfig] = useState({
      words: true, proverbs: true, idioms: true, quran: true, asma: true, cognates: true,
      jokes: true, facts: true, grammar: true, slang: true
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const STORAGE_KEY = 'snabbaLexin_home_state_v4';
  const CONFIG_KEY = 'snabbaLexin_daily_config_v1';

  // 1. Initialize
  useEffect(() => {
    const savedStats = localStorage.getItem('snabbaLexin_stats_cache');
    if (savedStats) { try { setStats(JSON.parse(savedStats)); } catch {} }

    // Load Daily Config
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
        try { setDailyConfig(JSON.parse(savedConfig)); } catch {}
    }

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
        // Use current config or default if not yet loaded (useEffect runs after render)
        const config = savedConfig ? JSON.parse(savedConfig) : dailyConfig;
        setDailyContent(DailyContentService.getRandomContent(data, config));
      }
    };
    
    checkData();
    window.addEventListener('dictionaryLoaded', checkData);
    return () => window.removeEventListener('dictionaryLoaded', checkData);
  }, []);

  const toggleSource = (key: keyof typeof dailyConfig) => {
      const newConfig = { ...dailyConfig, [key]: !dailyConfig[key] };
      setDailyConfig(newConfig);
      localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
      
      // Refresh content immediately
      const data = (window as any).dictionaryData;
      if (data) {
          setDailyContent(DailyContentService.getRandomContent(data, newConfig));
      }
  };

  // 2. Persist State
  useEffect(() => {
      if (!initialRestoreDone) return;
      const stateToSave = { searchTerm, mode, type, sort, scrollY: window.scrollY };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [searchTerm, mode, type, sort, initialRestoreDone]);

  // ... (Search Logic remains same)

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
      {/* Settings Modal */}
      {isSettingsOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} onClick={() => setIsSettingsOpen(false)}>
              <div style={{ background: '#1c1c1e', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '350px', border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>Inställningar / الإعدادات</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                      <div style={{ color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Källor för Dagens Ord / المصادر</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.words} onChange={() => toggleSource('words')} /> Ord (كلمات)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.proverbs} onChange={() => toggleSource('proverbs')} /> Ordspråk (أمثال)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.idioms} onChange={() => toggleSource('idioms')} /> Idiom (عبارات)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.quran} onChange={() => toggleSource('quran')} /> Koran (قرآن)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.asma} onChange={() => toggleSource('asma')} /> Guds Namn (أسماء الله)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.cognates} onChange={() => toggleSource('cognates')} /> Liknelser (متشابهات)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.jokes} onChange={() => toggleSource('jokes')} /> Skämt (نكت)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.facts} onChange={() => toggleSource('facts')} /> Fakta (حقائق)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.grammar} onChange={() => toggleSource('grammar')} /> Grammatik (قواعد)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.slang} onChange={() => toggleSource('slang')} /> Slang (عامية)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.jokes} onChange={() => toggleSource('jokes')} /> Skämt (نكت)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.facts} onChange={() => toggleSource('facts')} /> Fakta (حقائق)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.grammar} onChange={() => toggleSource('grammar')} /> Grammatik (قواعد)
                          </label>
                          <label style={styles.checkboxLabel}>
                              <input type="checkbox" checked={dailyConfig.slang} onChange={() => toggleSource('slang')} /> Slang (عامية)
                          </label>
                      </div>
                  </div>

                  <button onClick={() => setIsSettingsOpen(false)} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                      Klar / تم
                  </button>
              </div>
          </div>
      )}

      <div style={styles.header}>
        <div style={styles.topBar}>
            <div style={styles.brandTitle}><span style={{color:'#3b82f6'}}>Snabba</span>Lexin</div>
            <button 
                style={styles.settingsBtn} 
                onClick={() => setIsSettingsOpen(true)}
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
                <DailyCyberTicker 
                    content={dailyContent} 
                    onClick={(id) => {
                         if (typeof id === 'number') handleResultClick(id);
                    }} 
                    onOpenSettings={() => setIsSettingsOpen(true)}
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
  cubeContainer: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', padding: '20px 0' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '0.9rem', cursor: 'pointer', padding: '8px', background: '#2c2c2e', borderRadius: '8px' }
};