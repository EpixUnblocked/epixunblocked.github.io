// Layout.js — EPIX // FORBIDDEN ARCADE
// @scriptedCoke

import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import TabCloak from '../components/TabCloak';
import PanicMode from '../components/PanicMode';
import CloakSwitcher from '../components/CloakSwitcher';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';
import { useState, useEffect, useMemo, useRef } from 'react';

export default function Layout({ children }) {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  } = useGameContext();

  const categories = useMemo(() => {
    const BADGE_ORDER = ['featured', 'popular', 'new'];
    const allTags = [...new Set(games.flatMap((g) => g.tags))];
    const badges = BADGE_ORDER.filter((b) => allTags.includes(b));
    const genres = allTags
      .filter((t) => !BADGE_ORDER.includes(t))
      .sort((a, b) => a.localeCompare(b));
    return ['All', ...badges, ...genres];
  }, []);
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');
  const [showInfo, setShowInfo] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const searchRef = useRef(null);
  const shellRef = useRef(null);

  // Mirror the shell's height into a CSS variable so mobile (where the shell
  // is `position: fixed`) can reserve exactly that much top padding on the
  // page wrapper. Updates on resize and when the shell's content reflows
  // (e.g. category bar appears/disappears between routes).
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty(
        '--shell-h',
        `${el.offsetHeight}px`
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [isGamePage]);

  const openChat = () => {
    setChatMounted(true);
    setChatOpen(true);
  };
  const closeChat = () => setChatOpen(false);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeChat(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatOpen]);

  // Global keyboard shortcuts: / focus search, R random
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
      if (isTyping) return;

      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'r' || e.key === 'R') {
        if (e.metaKey || e.ctrlKey) return;
        if (!games.length) return;
        const pick = games[Math.floor(Math.random() * games.length)];
        router.push(`/games/${pick.slug}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

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
      <PanicMode />

      <div className={styles.shell} ref={shellRef}>
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
                ref={searchRef}
                className={styles.search}
                type="text"
                placeholder="type a title... (press /)"
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

          <div className={styles.headerActions}>
            <CloakSwitcher />
            <button
              className={`${styles.chatBtn} ${chatOpen ? styles.chatBtnActive : ''}`}
              onClick={chatOpen ? closeChat : openChat}
              aria-label="Toggle chat"
              aria-expanded={chatOpen}
            >
            <svg
              className={styles.chatBtnIcon}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                d="M3 4h18v13H11l-5 4v-4H3z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle className={styles.chatBtnDot1} cx="8" cy="10.5" r="1.3" />
              <circle className={styles.chatBtnDot2} cx="12" cy="10.5" r="1.3" />
              <circle className={styles.chatBtnDot3} cx="16" cy="10.5" r="1.3" />
              </svg>
              <span className={styles.chatBtnLabel}>CHAT</span>
            </button>
          </div>
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
              {categories.map((cat, idx) => {
                const isBadge = ['featured', 'popular', 'new'].includes(cat);
                const prevCat = categories[idx - 1];
                const prevIsBadge =
                  prevCat && ['featured', 'popular', 'new'].includes(prevCat);
                const showDivider = !isBadge && prevIsBadge;
                return (
                  <span key={cat} className={styles.catWrap}>
                    {showDivider && (
                      <span className={styles.catDivider} aria-hidden="true" />
                    )}
                    <button
                      className={`${styles.categoryBtn} ${
                        isBadge ? styles.badgeBtn : ''
                      } ${selectedCategory === cat ? styles.active : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {formatCat(cat)}
                    </button>
                  </span>
                );
              })}
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
                  All <em>channels</em>
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
              {/* <span className={styles.stageMetaItem}>
                <strong>EST.</strong>2024
              </span> */}
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
              © {new Date().getFullYear()} EPIX. All rights reserved.
            </p>
          </div>
        )}

        {!isGamePage && !showInfo && children}
        {isGamePage && children}
      </main>

      {/* === CHAT DRAWER === */}
      {chatMounted && (
        <div
          className={`${styles.chatBackdrop} ${chatOpen ? styles.chatBackdropOpen : ''}`}
          onClick={closeChat}
          aria-hidden="true"
        />
      )}
      {chatMounted && (
        <aside
          className={`${styles.chatDrawer} ${chatOpen ? styles.chatDrawerOpen : ''}`}
          role="dialog"
          aria-label="Live chat"
          aria-hidden={!chatOpen}
        >
          <div className={styles.chatDrawerHeader}>
            <span className={styles.chatDrawerTag}>// LIVE</span>
            <span className={styles.chatDrawerTitle}>EPIX CHAT</span>
            <button
              className={styles.chatDrawerClose}
              onClick={closeChat}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <iframe
            src="/html/chat/index.html"
            className={styles.chatDrawerFrame}
            title="Epix live chat"
          />
        </aside>
      )}
    </>
  );
}
