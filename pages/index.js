import styles from '../styles/Home.module.css';
import games from '../data/games';
import Link from 'next/link';
import Head from 'next/head';
import { useGameContext } from '../context/GameContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import HomeBanner from '../components/HomeBanner';
import GridToolbar from '../components/GridToolbar';
import ResumeBanner from '../components/ResumeBanner';

function formatPlaytime(s) {
  if (!s || s < 60) return null;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60} min`;
}

const SITE_URL = 'https://epixunblocked.github.io';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Epix Unblocked',
      description:
        'Free unblocked browser games — instant-play, no signup, no ads.',
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/#collection`,
      url: `${SITE_URL}/`,
      name: 'Epix Unblocked Games',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: 'Curated unblocked browser games',
    },
  ],
};

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
  const { searchTerm, selectedCategory, sortMode, isFavorite, toggleFavorite, hydrated, getPlaytime } =
    useGameContext();
  const [animateKey, setAnimateKey] = useState(0);
  const gridRef = useRef(null);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [searchTerm, selectedCategory, sortMode]);

  // Arrow-key navigation across the grid. Listens at the window level so
  // a fresh page load can be navigated without tabbing into the grid first
  // — the first arrow press focuses the first card. Skips when the user
  // is typing (search input, textarea, contenteditable).
  useEffect(() => {
    const onKey = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const tag = e.target?.tagName;
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
      if (isTyping) return;

      const grid = gridRef.current;
      if (!grid) return;

      const cards = Array.from(grid.querySelectorAll('[data-grid-card]'));
      if (!cards.length) return;

      const idx = cards.indexOf(document.activeElement);

      // Nothing focused (or focus is outside the grid) — jump straight in.
      if (idx === -1) {
        e.preventDefault();
        cards[0].focus();
        cards[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }

      // Compute live column count from offsetTop layout pattern.
      let cols = 1;
      const firstTop = cards[0].offsetTop;
      for (let i = 1; i < cards.length; i++) {
        if (cards[i].offsetTop !== firstTop) { cols = i; break; }
        if (i === cards.length - 1) cols = cards.length; // single row
      }

      let next = idx;
      if (e.key === 'ArrowRight') next = idx + 1;
      else if (e.key === 'ArrowLeft') next = idx - 1;
      else if (e.key === 'ArrowDown') next = idx + cols;
      else if (e.key === 'ArrowUp') next = idx - cols;

      if (next >= 0 && next < cards.length) {
        e.preventDefault();
        cards[next].focus();
        cards[next].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
      <Head>
        <link rel="canonical" href={`${SITE_URL}/`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
        />
      </Head>
      {isUnfiltered && <ResumeBanner />}
      {isUnfiltered && <HomeBanner />}
      <GridToolbar />
      <div className={styles.grid} ref={gridRef}>
        {filteredGames.map((game, index) => {
          const tag = pickPriorityTag(game.tags);
          const fav = hydrated && isFavorite(game.slug);
          const playLabel = hydrated ? formatPlaytime(getPlaytime(game.slug)) : null;
          return (
            <Link
              key={`${game.slug}-${animateKey}`}
              href={`/games/${game.slug}`}
              className={styles.card}
              data-grid-card
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
                  <span>{playLabel ? `Resume ${playLabel}` : 'Press start'}</span>
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
