import React, { useState, useEffect } from 'react';
import { SearchService, SearchResult } from './search-service';
import { SearchHistoryManager } from './search-history';
import { FavoritesManager } from './favorites';
import { TypeColorSystem } from './type-color-system';
import { TTSManager } from './tts';
import { showToast } from './utils';

// --- Constants & Types ---
interface FilterOption {
  value: string;
  labelSv: string;
  labelAr: string;
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
  { value: 'all', labelSv: 'Alla typer', labelAr: 'كل الأنواع' },
  { value: 'subst', labelSv: 'Substantiv', labelAr: 'اسم' },
  { value: 'verb', labelSv: 'Verb', labelAr: 'فعل' },
  { value: 'adj', labelSv: 'Adjektiv', labelAr: 'صفة' },
  { value: 'adv', labelSv: 'Adverb', labelAr: 'حال' },
  { value: 'prep', labelSv: 'Preposition', labelAr: 'حرف جر' },
  { value: 'pron', labelSv: 'Pronomen', labelAr: 'ضمير' },
  { value: 'konj', labelSv: 'Konjunktion', labelAr: 'أداة عطف' },
  { value: 'fras', labelSv: 'Fras/Uttryck', labelAr: 'عبارة' },
  { value: 'juridik', labelSv: '⚖️ Juridik', labelAr: 'قانون' },
  { value: 'medicin', labelSv: '🏥 Medicin', labelAr: 'طب' },
  { value: 'it', labelSv: '💻 IT/Teknik', labelAr: 'تقنية' },
];

const CATEGORIES: FilterOption[] = [
  { value: 'all', labelSv: 'Alla ämnen', labelAr: 'كل المواضيع' },
  { value: 'food', labelSv: '🍽️ Mat', labelAr: 'طعام' },
  { value: 'work', labelSv: '💼 Arbete', labelAr: 'عمل' },
  { value: 'health', labelSv: '🏥 Hälsa', labelAr: 'صحة' },
  { value: 'family', labelSv: '👨‍👩‍👧 Familj', labelAr: 'عائلة' },
  { value: 'travel', labelSv: '✈️ Resa', labelAr: 'سفر' },
  { value: 'school', labelSv: '📚 Skola', labelAr: 'مدرسة' },
  { value: 'home', labelSv: '🏠 Hem', labelAr: 'منزل' },
  { value: 'nature', labelSv: '🌳 Natur', labelAr: 'طبيعة' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Sub-Component: WordCard ---
const WordCard = ({ word, onClick }: { word: SearchResult; onClick: () => void }) => {
  const [isFav, setIsFav] = useState(false);
  
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

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    TTSManager.speak(word.swedish, 'sv');
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(word.swedish)
      .then(() => showToast('Kopierat / تم النسخ 📋'));
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
        {/* Top Row: Type (Left) --- Actions (Right) */}
        <div style={styles.cardTopRow}>
            <span style={{
                ...styles.wordTypeBadge, 
                color: primaryColor, 
                borderColor: primaryColor
            }}>
                {typeLabel}
            </span>

            <div style={styles.actionRow}>
                <button style={styles.actionBtn} onClick={handleSpeak} aria-label="Lyssna">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
                <button style={styles.actionBtn} onClick={handleCopy} aria-label="Kopiera">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
                <button 
                    style={{...styles.actionBtn, color: isFav ? '#F59E0B' : 'currentColor'}} 
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

        {/* Main Content Area: Word (Separate Line) + Forms + Arabic */}
        <div style={styles.cardMainContent}>
            <div style={styles.swedish}>{word.swedish}</div>
            {word.forms && <div style={styles.forms}>{word.forms}</div>}
            <div style={styles.arabic}>{word.arabic}</div>
        </div>
      </div>
    </div>
  );
};


// --- Main Component: HomeView ---

export const HomeView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters State
  const [mode, setMode] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Data State
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 1. Initialize
  useEffect(() => {
    const checkData = () => {
      const data = (window as any).dictionaryData;
      if (data && data.length > 0) setIsDataReady(true);
    };
    checkData();
    setHistory(SearchHistoryManager.get());

    const handleDataLoaded = () => checkData();
    window.addEventListener('dictionaryLoaded', handleDataLoaded);
    return () => window.removeEventListener('dictionaryLoaded', handleDataLoaded);
  }, []);

  // 2. Perform Search
  useEffect(() => {
    if (!isDataReady) return;

    const isBrowsing = mode === 'favorites' || type !== 'all' || category !== 'all';
    const hasQuery = !!debouncedSearchTerm.trim();

    if (!hasQuery && !isBrowsing) {
      setResults([]);
      setHistory(SearchHistoryManager.get());
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const data = (window as any).dictionaryData;
      const results = SearchService.search(data, {
        query: debouncedSearchTerm,
        mode,
        type,
        category,
        sort
      });
      setResults(results);
      setIsLoading(false);
    }, 10);
    return () => clearTimeout(timer);

  }, [debouncedSearchTerm, mode, sort, type, category, isDataReady]);

  // --- Handlers ---
  const handleResultClick = (id: number) => {
    if (searchTerm.trim()) {
      SearchHistoryManager.add(searchTerm.trim());
      setHistory(SearchHistoryManager.get());
    }
    window.location.href = `details.html?id=${id}`;
  };

  const clearFilters = () => {
    setMode('all');
    setType('all');
    setCategory('all');
    setSort('relevance');
  };

  const hasActiveFilters = mode !== 'all' || type !== 'all' || category !== 'all' || sort !== 'relevance';

  // --- Render Components ---

  const FilterSelect = ({ 
    label, 
    value, 
    options, 
    onChange,
    icon
  }: { 
    label: string, 
    value: string, 
    options: FilterOption[], 
    onChange: (val: string) => void,
    icon?: string
  }) => (
    <div style={styles.selectWrapper}>
      <div style={styles.selectLabel}>{icon} {label}</div>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{
            ...styles.selectInput,
            ...(value !== 'all' && value !== 'relevance' ? styles.selectActive : {})
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.labelSv}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {/* Search Input Row */}
        <div style={styles.searchRow}>
            <div style={styles.searchContainer}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder={isDataReady ? "Sök / بحث..." : "Laddar / جاري التحميل..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.input}
                    disabled={!isDataReady}
                />
                {isLoading && <div style={styles.spinner}></div>}
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>✕</button>
                )}
            </div>
            
            <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                style={{
                    ...styles.filterToggleBtn,
                    ...(isFiltersOpen || hasActiveFilters ? styles.filterToggleActive : {})
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
            </button>
        </div>

        {/* Expandable Filters Section */}
        {isFiltersOpen && (
            <div style={styles.filtersSection}>
                <div style={styles.filtersGrid}>
                    <FilterSelect label="Läge" icon="⚙️" value={mode} options={MODES} onChange={setMode} />
                    <FilterSelect label="Sortering" icon="🔃" value={sort} options={SORTS} onChange={setSort} />
                    <FilterSelect label="Typ" icon="📝" value={type} options={TYPES} onChange={setType} />
                    <FilterSelect label="Ämne" icon="🏷️" value={category} options={CATEGORIES} onChange={setCategory} />
                </div>
                {hasActiveFilters && (
                    <button onClick={clearFilters} style={styles.resetFiltersBtn}>
                        Återställ filter / إعادة ضبط
                    </button>
                )}
            </div>
        )}

        {/* Active Filters Summary */}
        {!isFiltersOpen && hasActiveFilters && (
             <div style={styles.activeFiltersRow}>
                 {mode !== 'all' && <span style={styles.activeChip}>Mode: {mode}</span>}
                 {type !== 'all' && <span style={styles.activeChip}>Typ: {type}</span>}
                 {category !== 'all' && <span style={styles.activeChip}>Ämne: {category}</span>}
             </div>
        )}
      </div>

      {/* Content List */}
      <div style={styles.list}>
        {!isDataReady && <div style={styles.emptyState}><p>Loading...</p></div>}

        {/* Empty State / History */}
        {isDataReady && results.length === 0 && !isLoading && !hasActiveFilters && !searchTerm && (
            <div style={styles.historySection}>
                {history.length > 0 ? (
                     <div style={styles.historyGrid}>
                        {history.map((item, idx) => (
                            <button key={idx} style={styles.historyChip} onClick={() => setSearchTerm(item)}>
                                🕒 {item}
                            </button>
                        ))}
                     </div>
                ) : (
                    <div style={styles.emptyState}>
                        <p style={{opacity: 0.6}}>Sök efter ord...</p>
                    </div>
                )}
            </div>
        )}

        {/* No Results */}
        {isDataReady && results.length === 0 && !isLoading && (searchTerm || hasActiveFilters) && (
             <div style={styles.emptyState}>
                 <p>Ingا resultat / لا توجد نتائج</p>
             </div>
        )}

        {/* Results */}
        {results.map((word) => (
          <WordCard 
            key={word.id} 
            word={word} 
            onClick={() => handleResultClick(word.id)} 
          />
        ))}
      </div>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #333',
    zIndex: 100,
    paddingBottom: '8px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '10px',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8e8e93',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 40px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#2c2c2e',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  spinner: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    marginTop: '-8px',
    width: '16px',
    height: '16px',
    border: '2px solid #8e8e93',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  clearBtn: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#8e8e93',
      cursor: 'pointer',
      fontSize: '16px',
  },
  filterToggleBtn: {
      backgroundColor: '#2c2c2e',
      border: 'none',
      borderRadius: '12px',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#8e8e93',
      cursor: 'pointer',
      transition: 'all 0.2s',
  },
  filterToggleActive: {
      backgroundColor: '#0A84FF',
      color: '#fff',
  },
  filtersSection: {
      padding: '0 16px 12px 16px',
      animation: 'fadeIn 0.2s',
  },
  filtersGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginBottom: '10px',
  },
  selectWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
  },
  selectLabel: {
      fontSize: '11px',
      color: '#8e8e93',
      marginLeft: '4px',
  },
  selectInput: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '8px',
      backgroundColor: '#2c2c2e',
      border: '1px solid transparent',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
      appearance: 'none',
  },
  selectActive: {
      borderColor: '#0A84FF',
      color: '#0A84FF',
      backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  resetFiltersBtn: {
      width: '100%',
      padding: '8px',
      backgroundColor: 'transparent',
      border: '1px dashed #3a3a3c',
      color: '#8e8e93',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
  },
  activeFiltersRow: {
      display: 'flex',
      gap: '8px',
      padding: '0 16px 8px 16px',
      overflowX: 'auto',
  },
  activeChip: {
      fontSize: '11px',
      backgroundColor: '#0A84FF',
      color: '#fff',
      padding: '2px 8px',
      borderRadius: '10px',
      whiteSpace: 'nowrap',
  },
  list: {
    padding: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
  emptyState: {
    textAlign: 'center',
    color: '#8e8e93',
    marginTop: '40px',
  },
  historySection: {
      marginTop: '10px',
  },
  historyGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
  },
  historyChip: {
      backgroundColor: '#2c2c2e',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
  },

  // --- WordCard Styles ---
  card: {
    position: 'relative',
    height: '120px', 
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: '#1c1c1e',
    border: '1px solid #333',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  cardContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
  },
  cardTopRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '0px',
  },
  cardMainContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      justifyContent: 'center',
      paddingBottom: '2px',
  },
  swedish: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#fff',
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.4',
  },
  wordTypeBadge: {
      fontSize: '0.7rem',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '5px',
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      background: 'transparent',
      border: '1.2px solid',
  },
  actionRow: {
      display: 'flex',
      gap: '8px',
      flexShrink: 0,
      alignItems: 'center',
  },
  actionBtn: {
      padding: '0',
      width: '30px',
      height: '30px',
      minWidth: '30px',
      minHeight: '30px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      border: 'none',
      color: '#8e8e93',
      cursor: 'pointer',
  },
  forms: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      fontStyle: 'italic',
      opacity: 0.8,
      marginTop: '-2px',
      marginBottom: '2px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
  },
  arabic: {
      fontSize: '1rem',
      color: '#8e8e93',
      margin: 0,
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      whiteSpace: 'normal',
      textAlign: 'right',
  }
};
