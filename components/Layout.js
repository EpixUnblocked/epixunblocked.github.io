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
  const categories = ['All', ...new Set(games.flatMap((game) => game.tags))];
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setInfoOpen(false);
  };

  const handleInfoClick = () => {
    setSelectedCategory(null); // deselect all tags
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

                <button
                  className={`${styles.categoryBtn} ${
                    infoOpen ? styles.active : ''
                  }`}
                  onClick={handleInfoClick}
                >
                  Info
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {!isGamePage && infoOpen && (
        <div className={styles.infoBox}>
          <p><strong>Epix</strong> is a browser-based game hub built with ❤️ using Next.js. Enjoy free online games with zero setup.</p>
        </div>
      )}

      <main className={styles.main}>
        {!infoOpen && children}
      </main>
    </>
  );
}
