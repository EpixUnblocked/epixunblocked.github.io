// components/ResumeBanner.js
// Thin "▸ Resume {game}" strip shown above the home banner when the user
// has played at least one game. Uses recents[0] from GameContext.

import Link from 'next/link';
import { useGameContext } from '../context/GameContext';
import games from '../data/games';
import styles from '../styles/ResumeBanner.module.css';

export default function ResumeBanner() {
  const { recents, hydrated } = useGameContext();
  if (!hydrated || recents.length === 0) return null;

  const last = games.find((g) => g.slug === recents[0]);
  if (!last) return null;

  return (
    <Link href={`/games/${last.slug}`} className={styles.bar}>
      <span className={styles.tag}>// LAST PLAYED</span>
      <div
        className={styles.thumb}
        style={{ backgroundImage: `url(${last.thumbnail})` }}
        aria-hidden="true"
      />
      <span className={styles.title}>{last.title}</span>
      <span className={styles.cta}>
        RESUME <span className={styles.ctaArrow}>▸▸</span>
      </span>
    </Link>
  );
}
