// components/Layout.js
import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useGameContext } from '../context/GameContext';
import { useRouter } from 'next/router';
import games from '../data/games';

export default function Layout({ children }) {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useGameContext();
  const categories = ['All', ...new Set(games.flatMap(game => game.tags))];
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const isGamePage = router.pathname.startsWith('/games/');

  return (
    <>
      <header className={styles.header}>
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
            <div className={styles.categories}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
      </header>

      <main style={{ padding: '1rem' }}>{children}</main>
    </>
  );
}
