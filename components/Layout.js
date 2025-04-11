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

  const categories = ['About', 'All', ...new Set(games.flatMap((game) => game.tags))];
  const router = useRouter();
  const isGamePage = router.pathname.startsWith('/games/');
  const [showInfo, setShowInfo] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowInfo(category === 'About');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBarContent}>
          <Link href="/" className={styles.logo}>
            Epix Unblocked
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
                    className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat.replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {showInfo && (
          <div className={styles.infoBox}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowInfo(false);
                setSelectedCategory('All');
              }}
            >
              ×
            </button>
            <h1>Epix - Unblocked Games</h1>
            <p>Web games offer engaging entertainment, but many schools and workplaces restrict access to gaming websites and monitor online activity. Epix effectively bypasses these network limitations, offering a diverse range of games that cater to all age groups, ensuring uninterrupted fun.</p>
<h3>Having Trouble Loading the Game?</h3>
<p>If the game isn’t loading and you’re stuck with a blank page, don’t worry! This might be caused by your browser’s extensions. Try opening our website in Incognito Mode (or Private Browsing) to see if that fixes the issue. Incognito disables most extensions, so it’s a quick way to check if something like an adblocker is blocking the game from loading.
<h4>If that doesn’t work, try these solutions:</h4>
Refresh the Page: Sometimes, simply refreshing the page can resolve loading issues.
Clear Your Browser Cache: Cached data can sometimes interfere with loading. Clearing it might help.
Try a Different Browser: If the game still won’t load, try accessing it from another browser.
Check Your Internet Connection: Ensure that your connection is stable and working properly.
Disable Ad Blockers: Some ad blockers can prevent games from loading correctly. Temporarily disable them to see if that solves the issue.</p>
<h3>Links To Other Web Sites</h3>
<p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Unblocked games.
   Unblocked games however have no control or responsibility for the policies, contents or practices of any third party sites or their services. You agree that Unblocked games shall not be held responsible or liable in anyway directly or indirectly, for whatever damage or loss resulting from or alleged to be caused by any such third party contents. Carefully read the terms and conditions for any third party services before using them.
</p>
          </div>
        )}

        {!isGamePage && !showInfo && children}
        {isGamePage && children}
      </main>
    </>
  );
}
