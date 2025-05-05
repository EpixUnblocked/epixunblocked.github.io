import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';
import { useState } from 'react';

export default function Layout({ children }) {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  } = useGameContext();

  const categories = ['All', ...new Set(games.flatMap((game) => game.tags))];
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

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBarContent}>
          <div className={styles.logoRow}>
            <Link href="/" className={styles.logo}>
              Epix Unblocked
            </Link>
            <button
              className={`${styles.categoryBtn} ${selectedCategory === 'About' ? styles.active : ''}`}
              onClick={handleAboutClick}
            >
              About
            </button>
          </div>

          {!isGamePage && (
            <>
              <div className={styles.searchWrapper}>
                <input
                  className={styles.search}
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button className={styles.clearButton} onClick={handleClearSearch}>
                    ×
                  </button>
                )}
              </div>

              <div className={styles.categories}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat.replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {showInfo && (
          <div className={styles.infoBox}>
            <div className={styles.infoHeader}>
              <h2>About Epix</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowInfo(false);
                  setSelectedCategory('All');
                }}
              >
                ×
              </button>
            </div>
            <p>
              Web games offer engaging entertainment, but many schools and workplaces restrict access to gaming websites. Epix bypasses these network limitations, offering a wide range of games for all age groups.
            </p>
            <h3>Having Trouble Loading the Game?</h3>
            <p>
              Try Incognito Mode to disable extensions, or follow these tips:
            </p>
            <ul>
              <li>Refresh the page</li>
              <li>Clear your browser cache</li>
              <li>Use a different browser</li>
              <li>Check your internet connection</li>
              <li>Disable ad blockers</li>
            </ul>
            <h3>External Links Disclaimer</h3>
            <p>
              Epix may link to external sites we don’t control. We’re not responsible for their content or policies. Use third-party services at your own risk.
            </p>
          </div>
        )}

        {!isGamePage && !showInfo && children}
        {isGamePage && children}
      </main>
    </>
  );
}
