// components/HomeBanner.js
// "Continue" strip + "Game of the Day" featured banner.
// Only shows on the homepage when no search/filter is active.

import Link from 'next/link';
import { useMemo } from 'react';
import games from '../data/games';
import { useGameContext } from '../context/GameContext';
import styles from '../styles/HomeBanner.module.css';

// Pick a deterministic "game of the day" based on the date.
function gameOfTheDay() {
  const featured = games.filter((g) =>
    g.tags.some((t) => t.toLowerCase() === 'featured')
  );
  const pool = featured.length ? featured : games;
  const today = new Date();
  // Days since epoch — same all day for everyone.
  const dayIdx = Math.floor(today.getTime() / 86400000);
  return pool[dayIdx % pool.length];
}

export default function HomeBanner() {
  const { recents, favorites, hydrated } = useGameContext();

  const gotd = useMemo(() => gameOfTheDay(), []);

  const recentGames = useMemo(() => {
    const slugs = new Set(recents);
    const found = recents
      .map((slug) => games.find((g) => g.slug === slug))
      .filter(Boolean);
    return found;
  }, [recents]);

  const favGames = useMemo(
    () => favorites.map((slug) => games.find((g) => g.slug === slug)).filter(Boolean),
    [favorites]
  );

  if (!gotd) return null;

  return (
    <section className={styles.banner} aria-label="Featured and recent">
      {/* === GAME OF THE DAY === */}
      <Link href={`/games/${gotd.slug}`} className={styles.gotd}>
        <div
          className={styles.gotdImage}
          style={{ backgroundImage: `url(${gotd.thumbnail})` }}
        />
        <div className={styles.gotdInner}>
          <span className={styles.gotdTag}>// GAME OF THE DAY</span>
          <h2 className={styles.gotdTitle}>{gotd.title}</h2>
          <p className={styles.gotdDescription}>{gotd.description}</p>
          <span className={styles.gotdCta}>
            PRESS START <span className={styles.gotdCtaArrow}>▶▶</span>
          </span>
        </div>
      </Link>

      {/* === CONTINUE STRIP === */}
      {hydrated && (recentGames.length > 0 || favGames.length > 0) && (
        <div className={styles.strip}>
          {recentGames.length > 0 && (
            <div
              className={styles.stripGroup}
              style={{ '--group-delay': '220ms' }}
            >
              <span className={styles.stripLabel}>
                <span className={styles.stripLabelDot} />
                Continue
              </span>
              <div className={styles.stripRail}>
                {recentGames.map((g, i) => (
                  <Link
                    href={`/games/${g.slug}`}
                    key={`r-${g.slug}`}
                    className={styles.stripCard}
                    style={{ '--card-delay': `${280 + i * 50}ms` }}
                  >
                    <div
                      className={styles.stripCardImg}
                      style={{ backgroundImage: `url(${g.thumbnail})` }}
                    />
                    <span className={styles.stripCardTitle}>{g.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favGames.length > 0 && (
            <div
              className={styles.stripGroup}
              style={{ '--group-delay': `${recentGames.length > 0 ? 320 : 220}ms` }}
            >
              <span className={styles.stripLabel + ' ' + styles.stripLabelHot}>
                <span className={styles.stripLabelStar}>★</span>
                Favorites
              </span>
              <div className={styles.stripRail}>
                {favGames.map((g, i) => (
                  <Link
                    href={`/games/${g.slug}`}
                    key={`f-${g.slug}`}
                    className={styles.stripCard}
                    style={{
                      '--card-delay': `${(recentGames.length > 0 ? 380 : 280) + i * 50}ms`,
                    }}
                  >
                    <div
                      className={styles.stripCardImg}
                      style={{ backgroundImage: `url(${g.thumbnail})` }}
                    />
                    <span className={styles.stripCardTitle}>{g.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
