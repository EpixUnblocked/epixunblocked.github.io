import styles from '../styles/Home.module.css';
import games from '../data/games';
import Link from 'next/link';
import { useGameContext } from '../context/GameContext';
import { useEffect, useMemo, useState } from 'react';

const PRIORITY_TAGS = ['featured', 'new', 'popular'];

function pickPriorityTag(tags) {
  if (!tags || !tags.length) return null;
  for (const t of PRIORITY_TAGS) {
    if (tags.map((x) => x.toLowerCase()).includes(t)) return t;
  }
  return tags[0].toLowerCase();
}

export default function Home() {
  const { searchTerm, selectedCategory } = useGameContext();
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [searchTerm, selectedCategory]);

  const filteredGames = useMemo(() => {
    if (selectedCategory === 'About') return [];
    const term = searchTerm.toLowerCase();
    return games.filter((g) => {
      const matchesSearch = g.title.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === 'All' ||
        g.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  if (filteredGames.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.empty}>
          <strong>NO SIGNAL.</strong>
          // We couldn&apos;t find <span>&quot;{searchTerm || selectedCategory}&quot;</span> on this frequency.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {filteredGames.map((game, index) => {
        const tag = pickPriorityTag(game.tags);
        return (
          <Link
            key={`${game.slug}-${animateKey}`}
            href={`/games/${game.slug}`}
            className={styles.card}
            style={{ '--animation-delay': `${Math.min(index, 18) * 50}ms` }}
          >
            <div className={styles.cardImageWrap}>
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${game.thumbnail})` }}
                role="img"
                aria-label={game.title}
              />
              <div className={styles.cardTopBar}>
                <span className={styles.cardNumber}>
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.cardTags}>
                  {tag && (
                    <span
                      className={`${styles.cardTag} ${styles[tag] || ''}`}
                    >
                      {tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{game.title}</h3>
              <div className={styles.cardCta}>
                <span>Press start</span>
                <span className={styles.cardCtaArrow}>▶▶</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
