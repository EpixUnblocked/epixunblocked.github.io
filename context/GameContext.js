// context/GameContext.js
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import games from '../data/games';

const GameContext = createContext();

const RECENTS_LIMIT = 8;
const VALID_SLUGS = new Set(games.map((g) => g.slug));

const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
};

export function GameProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [sortMode, setSortMode] = useState('default');
  const [cloakKey, setCloakKeyState] = useState('drive');
  // Per-game seconds played, keyed by slug. Stale slugs are pruned on hydration.
  const [playtime, setPlaytime] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Drop slugs for games that no longer exist so the Continue/Favorites
    // strips stay tightly packed and don't silently lose entries downstream.
    const prune = (list) => list.filter((s) => VALID_SLUGS.has(s));
    const prunePlaytime = (obj) => {
      const out = {};
      for (const [slug, secs] of Object.entries(obj)) {
        if (VALID_SLUGS.has(slug) && typeof secs === 'number' && secs > 0) {
          out[slug] = secs;
        }
      }
      return out;
    };
    setFavorites(prune(safeParse(localStorage.getItem('epix:favorites'), [])));
    setRecents(prune(safeParse(localStorage.getItem('epix:recents'), [])));
    setSortMode(localStorage.getItem('epix:sortMode') || 'default');
    setCloakKeyState(localStorage.getItem('epix:cloak') || 'drive');
    setPlaytime(prunePlaytime(safeParse(localStorage.getItem('epix:playtime'), {})));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem('epix:favorites', JSON.stringify(favorites)); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('epix:recents', JSON.stringify(recents)); }, [recents, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('epix:sortMode', sortMode); }, [sortMode, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('epix:playtime', JSON.stringify(playtime)); }, [playtime, hydrated]);

  const setCloakKey = useCallback((key) => {
    setCloakKeyState(key);
    if (typeof window !== 'undefined') localStorage.setItem('epix:cloak', key);
  }, []);

  const toggleFavorite = useCallback((slug) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites]);

  const pushRecent = useCallback((slug) => {
    setRecents((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)];
      return next.slice(0, RECENTS_LIMIT);
    });
  }, []);

  const clearRecents = useCallback(() => setRecents([]), []);

  const addPlaytime = useCallback((slug, seconds) => {
    if (!slug || !seconds || seconds <= 0) return;
    setPlaytime((prev) => ({ ...prev, [slug]: (prev[slug] || 0) + seconds }));
  }, []);

  const getPlaytime = useCallback((slug) => playtime[slug] || 0, [playtime]);

  const totalPlaytime = useMemo(
    () => Object.values(playtime).reduce((a, b) => a + b, 0),
    [playtime]
  );

  return (
    <GameContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        favorites,
        toggleFavorite,
        isFavorite,
        recents,
        pushRecent,
        clearRecents,
        sortMode,
        setSortMode,
        cloakKey,
        setCloakKey,
        playtime,
        addPlaytime,
        getPlaytime,
        totalPlaytime,
        hydrated,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
