// components/Layout.js
import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';
import { useState } from 'react';

export default function Layout({ children }) {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useGameContext();
  const [infoVisible, setInfoVisible] = useState(false);
  const router = useRouter();

  const isGamePage = router.pathname.startsWith('/games/');

  const categories = ['All', ...new Set(games.flatMap((game) => game.tags))];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setInfoVisible(false); // Hide info when changing tag
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBarContent}>
          <Link href="/" className={styles.logo}>Epix</Link>

          {!isGamePage && (
            <>
              <input
                className={styles.search}
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={handleSearchChange}
              />

              <button
                className={`${styles.categoryBtn} ${infoVisible ? styles.active : ''}`}
                onClick={() => setInfoVisible(!infoVisible)}
              >
                Info
              </button>

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

      {infoVisible && (
        <div className={styles.infoBox}>
          <span className={styles.infoClose} onClick={() => setInfoVisible(false)}>×</span>
          <p>
            <strong>Epix</strong> is a lightweight game hub for browser-based games. Search, filter, and enjoy your favorites!
          </p>
        </div>
      )}

      {!infoVisible && <main className={styles.main}>{children}</main>}
    </>
  );
}
