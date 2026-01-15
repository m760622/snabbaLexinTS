"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchResult } from '@/services/search.service';
import { SearchHistoryManager } from '@/services/search-history.service';
import { FavoritesManager } from '@/services/favorites.service';
import { TypeColorSystem } from '@/utils/type-color.util';
import { TTSManager } from '@/services/tts.service';
import { showToast, HapticManager } from '@/utils/utils';
import { DailyContentService, DailyContent } from '@/services/daily-content.service';
import { DailyCard } from '@/components/DailyCard';
import { MistakesView } from '@/MistakesView';
import { DetailsView } from '@/DetailsView'; // We might want to make this a page later
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/search-cards.css';

// --- Components ---
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
    try { await TTSManager.speak(word.swedish, 'sv'); } catch { /* Ignore */ }
    finally { setTimeout(() => setIsPlaying(false), 1500); }
  };

  const handleFav = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    HapticManager.medium();
    onToggleFav(word.id.toString());
  };

  return (
    <div
      className="smart-card"
      onClick={onClick}
      style={{ '--glow-color': primaryColor } as React.CSSProperties}
    >
      <div className="progress-bar">
        <div className="progress-fill" style={{ background: primaryColor, width: isFav ? '100%' : '30%' }}></div>
      </div>

      <div className="smart-inner">
        <div className="smart-header">
          <div className="header-left">
            <div className={`status-dot ${isFav ? 'mastered' : 'learning'}`}></div>
            <span className="type-label" style={{ color: primaryColor }}>
              {typeInfo?.color?.label?.sv || word.type}
            </span>
          </div>
          <div className="smart-actions">
            <button className={`smart-btn icon-only ${isPlaying ? 'active' : ''}`} onClick={handleSpeak}>🔊</button>
            <button className={`smart-btn icon-only ${isFav ? 'active' : ''}`} onClick={handleFav} style={isFav ? { color: '#f59e0b' } : {}}>
              {isFav ? '★' : '☆'}
            </button>
          </div>
        </div>

        <div className="smart-body">
          <div className="swedish-text">{word.swedish || 'Inget svenskt ord'}</div>
          {word.forms && <div className="forms-text">{word.forms}</div>}
        </div>
        <div className="smart-divider"></div>
        <div className="arabic-text">{word.arabic || 'لا توجد ترجمة'}</div>
        {(word.definition || word.example) && (
          <div className="definition-text" style={{ borderLeftColor: primaryColor }}>{word.definition || word.example}</div>
        )}
      </div>
    </div>
  );
}, (p, n) => p.word.id === n.word.id && p.isFav === n.isFav && p.accentColor === n.accentColor);

export default function SearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoritesSet, setFavoritesSet] = useState<Set<string>>(new Set());

  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);

  // Data Recovery State
  const [isDataMissing, setIsDataMissing] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // Using Ref for worker to persist across renders
  const searchWorkerRef = useRef<Worker | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const initEverything = useCallback((data: any[]) => {
    setDailyContent(DailyContentService.getDailyContent(data));

    // Initialize Worker
    if (!searchWorkerRef.current) {
      const worker = new Worker(new URL('../workers/search.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        const { type, payload } = e.data;
        if (type === 'SEARCH_RESULT') {
          setTimeout(() => {
            setResults(payload.results);
            setVisibleCount(20);
            setIsLoading(false);
          }, 100);
        }
      };
      worker.postMessage({ type: 'INIT_DATA', payload: data });
      searchWorkerRef.current = worker;
    } else {
      // Update worker if already exists
      searchWorkerRef.current.postMessage({ type: 'INIT_DATA', payload: data });
    }
  }, []);

  // Load initial data
  useEffect(() => {
    setFavoritesSet(new Set(FavoritesManager.getAll()));
    setHistory(SearchHistoryManager.get());

    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) setAccentColor(savedColor);

    const win = window as any;
    if (win.dictionaryData && win.dictionaryData.length > 0) {
      initEverything(win.dictionaryData);
    } else {
      setIsDataMissing(true);
    }

    const unsubscribe = FavoritesManager.onChange(() => {
      setFavoritesSet(new Set(FavoritesManager.getAll()));
    });

    const handleAccentChange = (e: any) => {
      if (e.detail) setAccentColor(e.detail);
    };
    window.addEventListener('accentColorChange', handleAccentChange);

    return () => {
      unsubscribe();
      window.removeEventListener('accentColorChange', handleAccentChange);
      searchWorkerRef.current?.terminate();
    };
  }, [initEverything]);

  const handleManualReload = async () => {
    setIsRecovering(true);
    try {
      // Dynamic import to avoid SSR issues if any, though we are client component
      const { DataLoader } = await import('@/services/db.service');
      const data = await DataLoader.loadDictionary((p) => console.log('Reload progress:', p));

      if (data && data.length > 0) {
        (window as any).dictionaryData = data;
        setIsDataMissing(false);
        initEverything(data);
      } else {
        showToast('Kunde inte ladda data / تعذر تحميل البيانات');
      }
    } catch (e) {
      console.error(e);
      showToast('Fel vid laddning / خطأ في التحميل');
    } finally {
      setIsRecovering(false);
    }
  };



  const handleWordClick = useCallback((id: number, word?: string) => {
    if (word) {
      SearchHistoryManager.add(word);
      setHistory(SearchHistoryManager.get());
    }
    setSelectedWordId(id);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Infinite scroll logic
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      if (visibleCount < results.length) {
        setVisibleCount(prev => prev + 20);
      }
    }
  };

  if (selectedWordId) {
    return (
      <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
        <DetailsView wordId={selectedWordId} onBack={() => setSelectedWordId(null)} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.topBar}>
          <div style={{ ...styles.brandCapsule, boxShadow: `0 0 20px ${accentColor}33` }}>Snabba Lexin</div>
        </div>
        <div style={styles.searchRow}>
          <div style={styles.searchBox}>
            <span style={styles.searchIconInside}>🔍</span>
            <input
              type="text"
              placeholder="Sök..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.premiumInput}
            />
            {results.length > 0 && <span style={styles.resultCounterInside}>{results.length}x</span>}
          </div>
        </div>
      </div>

      <div style={styles.contentArea}>
        <div style={styles.scrollList} ref={scrollContainerRef} onScroll={handleScroll}>
          {/* Missing Data State */}
          {isDataMissing && !searchTerm && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#ccc' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ marginBottom: '10px' }}>Data saknas / البيانات مفقودة</h3>
              <p style={{ marginBottom: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
                Kunde inte ladda ordboken korrekt.<br />
                تعذر تحميل القاموس بشكل صحيح.
              </p>
              <button
                onClick={handleManualReload}
                style={{
                  background: accentColor,
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: isRecovering ? 0.7 : 1
                }}
                disabled={isRecovering}
              >
                {isRecovering ? 'Laddar... / جاري التحميل...' : 'Ladda Data / تحميل البيانات'}
              </button>
            </div>
          )}

          {!isDataMissing && !searchTerm && (
            <div style={{ paddingBottom: '120px' }}>
              <MistakesView />
              {dailyContent ?
                <DailyCard content={dailyContent} onOpenSettings={() => router.push('/settings')} />
                :
                (!isDataMissing && <div style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>Laddar dagens innehåll...</div>)
              }

              {history.length > 0 && (
                <div style={{ padding: '0 20px' }}>
                  <h3 style={{ color: '#888', fontSize: '0.9rem' }}>Senaste</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {history.map((h, i) => (
                      <button key={i} onClick={() => setSearchTerm(h)} style={styles.historyBtn}>{h}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {searchTerm && (
            <div style={{ paddingBottom: '120px' }}>
              {isLoading && <div style={{ textAlign: 'center', padding: 20 }}>Laddar...</div>}
              {results.slice(0, visibleCount).map(word => (
                <WordCard
                  key={word.id}
                  word={word}
                  isFav={favoritesSet.has(word.id.toString())}
                  onClick={() => handleWordClick(word.id, word.swedish)}
                  onToggleFav={(id: string) => FavoritesManager.toggle(id)}
                  accentColor={accentColor}
                />
              ))}
              {!isLoading && results.length === 0 && <div style={{ textAlign: 'center', padding: 20 }}>Inga resultat</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  header: { paddingBottom: '10px', zIndex: 100 },
  topBar: { padding: '15px 20px' },
  brandCapsule: { background: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 25px', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', backdropFilter: 'blur(10px)', color: '#fff', width: 'fit-content' },
  searchRow: { padding: '0 20px' },
  searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
  premiumInput: { width: '100%', padding: '14px 15px 14px 45px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-glass)', color: '#fff', fontSize: '1rem', outline: 'none', backdropFilter: 'blur(15px)' },
  searchIconInside: { position: 'absolute', left: '15px', color: '#8e8e93', fontSize: '18px' },
  resultCounterInside: { position: 'absolute', right: '15px', color: '#636366', fontSize: '0.8rem' },
  contentArea: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  scrollList: { flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' },
  historyBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '12px', color: '#fff', cursor: 'pointer' }
};
