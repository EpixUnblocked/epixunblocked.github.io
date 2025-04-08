
import Link from 'next/link';
import styles from '../styles/Layout.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import games from '../data/games';

export default function Layout({ children }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const tags = new Set();
    games.forEach(game => {
      game.tags.forEach(tag => tags.add(tag));
    });
    setCategories([...tags]);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const query = e.target.value.toLowerCase();
    router.push(`/?search=${query}`);
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Epix</Link>
        <input
          className={styles.search}
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={handleSearch}
        />
        <nav className={styles.nav}>
          <Link href="/">All</Link>
          {categories.map(category => (
            <Link key={category} href={`/?category=${category}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
