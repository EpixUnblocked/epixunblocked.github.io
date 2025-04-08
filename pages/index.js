import styles from '../styles/Home.module.css';
import games from '../data/games';
import Link from 'next/link';
import { useGameContext } from '../context/GameContext';

export default function Home() {
  const { searchTerm, selectedCategory } = useGameContext();

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || game.tags.includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`${styles.grid} ${styles.gridEnter}`} key={searchTerm + selectedCategory}>
      {filteredGames.map((game) => (
        <Link key={game.slug} href={`/games/${game.slug}`} className={styles.card}>
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
