import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Layout.module.css';
import games from '../data/games';

export default function Layout({ children, onSearch, onCategorySelect }) {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = new Set();
    games.forEach(game => {
      if (game.tags) {
        game.tags.forEach(tag => uniqueCategories.add(tag));
      }
    });
    setCategories(['all', ...Array.from(uniqueCategories)]);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) onSearch(value);
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) onCategorySelect(category);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topbar}>
          <Link href="/" className={styles.logo}>Epix</Link>
          <input
            className={styles.search}
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search games..."
          />
        </div>
        <div className={styles.categories}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={styles.categoryButton}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </>
  );
}
