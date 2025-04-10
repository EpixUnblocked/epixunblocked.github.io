// components/Layout.js
import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';
import { useState } from 'react';

export default function Layout({ children }) {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useGameContext();
  const [infoOpen, setInfoOpen] = useState(false);
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');

  const categories = ['All', ...new Set(games.flatMap((game) => game.tags))];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setInfoOpen(false);
    setSelectedCategory(category);
  };

  const handleInfoClick = () => {
    setSelectedCategory(null);
    setInfoOpen(true);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBarContent}>
          <Link href="/" className={styles.logo}>
            Epix
          </Link>

          {!isGamePage && (
            <>
              <input
                className={styles.search}
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={handleSearchChange}
              />

              <div className={styles.categories}>
                <button
                  className={`${styles.categoryBtn} ${infoOpen ? styles.active : ''}`}
                  onClick={handleInfoClick}
                >
                  Info
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.categoryBtn} ${
                      selectedCategory === cat && !infoOpen ? styles.active : ''
                    }`}
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
        {infoOpen ? (
          <div className={styles.infoBox}>
            <button
              className={styles.closeButton}
              onClick={() => setInfoOpen(false)}
              aria-label="Close Info"
            >
              ✕
            </button>
            <h2>About Epix</h2>
            <p>
              Epix is your go-to hub for fun and addictive web-based games. Discover new titles, filter
              by category, and enjoy fast, lightweight experiences directly in your browser.
            </p>
          </div>
        ) : (
          children
        )}
      </main>
    </>
  );
}
