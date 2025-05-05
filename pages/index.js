import styles from '../styles/Home.module.css';
import games from '../data/games';
import Link from 'next/link';
import { useGameContext } from '../context/GameContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { searchTerm, selectedCategory } = useGameContext();
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    // Trigger new animation key when filters change
    setAnimateKey((prev) => prev + 1);
  }, [searchTerm, selectedCategory]);

  const filteredGames = games.filter((game) => {
    if (selectedCategory === 'About') return false;

    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      game.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.grid}>
      {filteredGames.map((game, index) => (
        <Link
          key={`${game.slug}-${animateKey}`}
          href={`/games/${game.slug}`}
          className={`${styles.card} animate`}
          style={{ '--animation-delay': `${index * 60}ms` }}
        >
          <div
            className={styles.cardImage}
            style={{ backgroundImage: `url(${game.thumbnail})` }}
          >
            <div className={styles.cardOverlay}>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
