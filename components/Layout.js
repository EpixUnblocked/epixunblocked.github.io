import styles from '../styles/Layout.module.css';

export default function Layout({ children, onSearch, onFilter }) {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.logo}>Epix</div>
        <input
          type="text"
          placeholder="Search games..."
          className={styles.search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className={styles.categories}>
          {['all', 'arcade', 'puzzle', 'action', 'strategy'].map(tag => (
            <button key={tag} data-tag={tag} onClick={() => onFilter(tag)}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
