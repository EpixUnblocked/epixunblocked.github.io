import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Layout.module.css';
import { FaBars } from 'react-icons/fa';

export default function Layout({ children, onSearch, onCategorySelect }) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>Epix</Link>
        </div>

        <div className={styles.center}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles.right}>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <FaBars />
          </button>
          <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
            <button onClick={() => handleCategoryClick('all')}>All</button>
            <button onClick={() => handleCategoryClick('action')}>Action</button>
            <button onClick={() => handleCategoryClick('puzzle')}>Puzzle</button>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </>
  );
}
