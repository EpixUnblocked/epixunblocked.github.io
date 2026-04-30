// Layout.js — EPIX // FORBIDDEN ARCADE
// @scriptedCoke

import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import TabCloak from '../components/TabCloak';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';
import { useState, useEffect, useMemo } from 'react';

export default function Layout({ children }) {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  } = useGameContext();

  const categories = useMemo(
    () => ['All', ...new Set(games.flatMap((g) => g.tags))],
    []
  );
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');
  const [showInfo, setShowInfo] = useState(false);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm('');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowInfo(false);
  };

  const handleAboutClick = () => {
    setSelectedCategory('About');
    setShowInfo(true);
  };

  useEffect(() => {
    if (router.pathname === '/') {
      setSelectedCategory('All');
      setShowInfo(false);
    }
  }, [router.pathname]);

  // Compute filtered count for the stage meta
  const filteredCount = useMemo(() => {
    if (selectedCategory === 'About') return 0;
    return games.filter((g) => {
      const matchesSearch = g.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' ||
        g.tags.some(
          (t) => t.toLowerCase() === selectedCategory.toLowerCase()
        );
      return matchesSearch && matchesCategory;
    }).length;
  }, [searchTerm, selectedCategory]);

  const formatCat = (c) =>
    c
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <>
      <TabCloak />

      <div className={styles.shell}>
        {/* === MAIN HEADER === */}
        <div className={styles.header}>
          <div className={styles.logoLockup}>
            <Link href="/" className={styles.logo} aria-label="Epix home">
              EPIX
            </Link>
            <span className={styles.logoStamp}>UNBLOCKED</span>
            <span className={styles.logoSub}>// CH.404</span>
          </div>

          {!isGamePage && (
            <div className={styles.searchWrapper}>
              <span className={styles.searchPrompt}>&gt; FIND</span>
              <input
                className={styles.search}
                type="text"
                placeholder="type a title..."
                value={searchTerm}
                onChange={handleSearchChange}
                spellCheck="false"
                autoComplete="off"
              />
              {!searchTerm && <span className={styles.searchCaret} />}
              {searchTerm && (
                <button
                  className={styles.clearSearch}
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  CLR ×
                </button>
              )}
            </div>
          )}

        </div>

        {/* === CATEGORY BAR === */}
        {!isGamePage && (
          <div className={styles.subBar}>
            <span className={styles.subBarLabel}>Channels</span>
            <div className={styles.categories}>
              <button
                className={`${styles.categoryBtn} ${styles.aboutBtn} ${
                  selectedCategory === 'About' ? styles.active : ''
                }`}
                onClick={handleAboutClick}
              >
                About
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${
                    selectedCategory === cat ? styles.active : ''
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {formatCat(cat)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <main className={styles.main}>
        {/* === STAGE BANNER === */}
        {!isGamePage && !showInfo && (
          <div className={styles.stage}>
            <h1 className={styles.stageMark}>
              {searchTerm ? (
                <>
                  Hunting <em>{searchTerm}</em>
                </>
              ) : selectedCategory === 'All' ? (
                <>
                  All <em>signals</em>
                </>
              ) : (
                <>
                  Channel <em>{formatCat(selectedCategory)}</em>
                </>
              )}
            </h1>
            <div className={styles.stageMeta}>
              <span className={styles.stageMetaItem}>
                <strong>{String(filteredCount).padStart(2, '0')}</strong>
                {filteredCount === 1 ? 'GAME' : 'GAMES'}
              </span>
              <span className={styles.stageMetaItem}>
                <strong>{String(categories.length - 1).padStart(2, '0')}</strong>
                CHANNELS
              </span>
              <span className={styles.stageMetaItem}>
                <strong>EST.</strong>2024
              </span>
            </div>
          </div>
        )}

        {showInfo && (
          <div className={styles.infoBox}>
            <div className={styles.infoHeader}>
              <h1>EPIX // Unblocked Games</h1>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowInfo(false);
                  setSelectedCategory('All');
                }}
                aria-label="Close info"
              >
                CLOSE ×
              </button>
            </div>
            <p>
              Web games are pure, uncomplicated entertainment — but schools
              and offices love to wall them off behind firewalls and content
              filters. EPIX cuts through the noise. We host a curated stack
              of unblocked browser games that load fast, play instantly, and
              never ask for an account.
            </p>
            <h3>Game Won&apos;t Load?</h3>
            <p>
              If a title hangs on a blank page, the most common culprit is
              a browser extension. Open the page in Incognito / Private mode
              to disable extensions in one shot. If it loads there, an
              extension on your normal profile is the suspect — usually an
              ad blocker or privacy tool.
            </p>
            <h4>Other things to try:</h4>
            <ul>
              <li>Refresh the page — sometimes the assets just need another swing.</li>
              <li>Clear your browser cache. Stale data can poison new loads.</li>
              <li>Try a different browser. Chromium and Firefox behave differently.</li>
              <li>Check your network. School networks may throttle game CDNs.</li>
              <li>Disable ad blockers temporarily for the EPIX domain.</li>
            </ul>
            <h3>External Links</h3>
            <p>
              EPIX may link out to third-party sites. We don&apos;t control
              what happens beyond our walls — read the destination&apos;s
              terms before you trust it. EPIX is not liable for content,
              behavior, or damage caused by external services.
            </p>
            <p style={{ marginTop: '24px', fontSize: '0.85rem', opacity: 0.7 }}>
              © {new Date().getFullYear()} EPIX. All signals reserved.
            </p>
          </div>
        )}

        {!isGamePage && !showInfo && children}
        {isGamePage && children}
      </main>
    </>
  );
}
