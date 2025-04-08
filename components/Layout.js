import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.logo}>Epix</div>
        <nav className={styles.nav}>
          <input type="text" placeholder="Search games..." className={styles.search} />
          <div className={styles.categories}>
            <button data-tag="all">All</button>
            <button data-tag="arcade">Arcade</button>
            <button data-tag="puzzle">Puzzle</button>
            <button data-tag="action">Action</button>
            <button data-tag="strategy">Strategy</button>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
