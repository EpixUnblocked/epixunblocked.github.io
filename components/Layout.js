import Link from 'next/link';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Epix</Link>
        <input className={styles.search} type="text" placeholder="Search games..." />
        <nav className={styles.nav}>
          <Link href="/">All</Link>
          <Link href="/category/action">Action</Link>
          <Link href="/category/puzzle">Puzzle</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
