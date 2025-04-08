import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import games from '../data/games';

export default function Home() {
  return (
    <>
      <Head>
        <title>Epix - Unblocked Games</title>
      </Head>
      <div className={styles.header}>
        <h1>Epix</h1>
        <input
          type="text"
          placeholder="Search games..."
          className={styles.search}
        />
      </div>

      <div className={styles.grid}>
        {games.map((game) => (
          <Link key={game.slug} href={`/games/${game.slug}`} className={styles.card}>
            <img
              src={game.thumbnail}
              alt={`${game.title} Thumbnail`}
              className={styles.thumbnail}
            />
            <h3>{game.title}</h3>
            <p className={styles.description}>{game.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
