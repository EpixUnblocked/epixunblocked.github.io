// components/Layout.js
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

  const categories = ['About', 'All', ...new Set(games.flatMap((game) => game.tags))];
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');
  const [showInfo, setShowInfo] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowInfo(category === 'About');
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
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowInfo(false);
                setSelectedCategory('All');
              }}
            >
              ×
            </button>
            <h2>About Epix</h2>
            <p>
              Epix is a lightweight web platform to browse and play cool web games. Built using
              Next.js and deployed on GitHub Pages!
            </p>
          </div>
        )}

        {!isGamePage && !showInfo && children}
        {isGamePage && children}
      </main>
    </>
  );
}
