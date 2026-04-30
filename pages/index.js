import styles from '../styles/Home.module.css';
import games from '../data/games';
import Link from 'next/link';
import { useGameContext } from '../context/GameContext';
import { useEffect, useMemo, useState } from 'react';
import HomeBanner from '../components/HomeBanner';
import GridToolbar from '../components/GridToolbar';

const PRIORITY_TAGS = ['featured', 'new', 'popular'];
const POPULAR_TAGS = new Set(['popular', 'featured']);

function pickPriorityTag(tags) {
  if (!tags || !tags.length) return null;
  for (const t of PRIORITY_TAGS) {
    if (tags.map((x) => x.toLowerCase()).includes(t)) return t;
  }
  return tags[0].toLowerCase();
}

function sortGames(list, mode) {
  const arr = [...list];
  switch (mode) {
    case 'az':
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case 'za':
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    case 'popular':
      return arr.sort((a, b) => {
        const ap = a.tags.some((t) => POPULAR_TAGS.has(t.toLowerCase())) ? 1 : 0;
        const bp = b.tags.some((t) => POPULAR_TAGS.has(t.toLowerCase())) ? 1 : 0;
        return bp - ap;
      });
    case 'newest':
      return arr.sort((a, b) => {
        const an = a.tags.some((t) => t.toLowerCase() === 'new') ? 1 : 0;
        const bn = b.tags.some((t) => t.toLowerCase() === 'new') ? 1 : 0;
        return bn - an;
      });
    default:
      return arr;
  }
}

export default function Home() {
  const { searchTerm, selectedCategory, sortMode, isFavorite, toggleFavorite, hydrated } =
    useGameContext();
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [searchTerm, selectedCategory, sortMode]);

  const filteredGames = useMemo(() => {
    if (selectedCategory === 'About') return [];
    const term = searchTerm.toLowerCase();
    const filtered = games.filter((g) => {
      const matchesSearch = g.title.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === 'All' ||
        g.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
    return sortGames(filtered, sortMode);
  }, [searchTerm, selectedCategory, sortMode]);

  const isUnfiltered = !searchTerm && (selectedCategory === 'All');

  if (filteredGames.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.empty}>
          <strong>NO SIGNAL.</strong>
          // We couldn&apos;t find <span>&quot;{searchTerm || selectedCategory}&quot;</span> on this frequency.
        </div>
      </div>
    );
  }

  const handleFav = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
  };

  return (
    <>
      {isUnfiltered && <HomeBanner />}
      <GridToolbar />
      <div className={styles.grid}>
        {filteredGames.map((game, index) => {
          const tag = pickPriorityTag(game.tags);
          const fav = hydrated && isFavorite(game.slug);
          return (
            <Link
              key={`${game.slug}-${animateKey}`}
              href={`/games/${game.slug}`}
              className={styles.card}
              style={{ '--animation-delay': `${Math.min(index, 18) * 50}ms` }}
            >
              <div className={styles.cardImageWrap}>
                <div
                  className={styles.cardImage}
                  style={{ backgroundImage: `url(${game.thumbnail})` }}
                  role="img"
                  aria-label={game.title}
                />
                <div className={styles.cardTopBar}>
                  <span className={styles.cardNumber}>
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.cardTags}>
                    {tag && (
                      <span className={`${styles.cardTag} ${styles[tag] || ''}`}>
                        {tag}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className={`${styles.cardFav} ${fav ? styles.cardFavActive : ''}`}
                  onClick={(e) => handleFav(e, game.slug)}
                  aria-label={fav ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                  aria-pressed={fav}
                >
                  {fav ? '★' : '☆'}
                </button>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{game.title}</h3>
                <div className={styles.cardCta}>
                  <span>Press start</span>
                  <span className={styles.cardCtaArrow}>▶▶</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
