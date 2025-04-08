// components/Layout.js
import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useGameContext } from '../context/GameContext';
import games from '../data/games';

export default function Layout({ children }) {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useGameContext();

  const categories = ['All', ...new Set(games.flatMap(game => game.tags))];

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Epix</Link>

        <input
          className={styles.search}
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
