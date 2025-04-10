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

  const [infoOpen, setInfoOpen] = useState(false);
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');

  const categories = ['All', ...new Set(games.flatMap((game) => game.tags))];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setInfoOpen(false);
  };

  const handleInfoClick = () => {
    setSelectedCategory(null);
    setInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoOpen(false);
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
                      selectedCategory === cat ? styles.active : ''
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

      {!isGamePage && infoOpen && (
        <div className={styles.infoBox}>
          <button className={styles.closeButton} onClick={handleCloseInfo}>×</button>
          <p><strong>Epix</strong> is your go-to place for lightweight, free-to-play browser games. Built using Next.js and GitHub Pages for fast performance and easy deployment.</p>
          <p>Games are updated regularly — bookmark and check back often!</p>
        </div>
      )}

      <main className={styles.main}>
        {!infoOpen && children}
      </main>
    </>
  );
}
