// components/Layout.js
import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';

export default function Layout({ children }) {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useGameContext();
  const [infoVisible, setInfoVisible] = useState(false);
  const categories = ['All', ...new Set(games.flatMap(game => game.tags))];
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setInfoVisible(false);
  };

  const isGamePage = router.pathname.startsWith('/games/');

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
            </>
          )}
        </div>

        {!isGamePage && (
          <div className={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        )}
      </header>

      {infoVisible && (
        <div className={styles.infoBox}>
          <p><strong>Epix</strong> is a lightweight game hub for browser-based games. Browse by category, search your favorites, and have fun!</p>
        </div>
      )}

      <main className={styles.main}>{children}</main>
    </>
  );
}
