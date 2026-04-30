// context/GameContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();

const RECENTS_LIMIT = 8;

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setFavorites(safeParse(localStorage.getItem('epix:favorites'), []));
    setRecents(safeParse(localStorage.getItem('epix:recents'), []));
    setSortMode(localStorage.getItem('epix:sortMode') || 'default');
    setCloakKeyState(localStorage.getItem('epix:cloak') || 'drive');
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem('epix:favorites', JSON.stringify(favorites)); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('epix:recents', JSON.stringify(recents)); }, [recents, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('epix:sortMode', sortMode); }, [sortMode, hydrated]);

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
