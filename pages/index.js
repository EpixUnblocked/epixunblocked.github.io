
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { FaSearch, FaGamepad } from 'react-icons/fa'

const games = [
  { title: "2048", slug: "2048", category: "puzzle" },
  { title: "Tetris", slug: "tetris", category: "classic" },
  { title: "Snake", slug: "snake", category: "arcade" }
];

export default function Home() {
  const [search, setSearch] = useState('');
  const filtered = games.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Epix Unblocked Games</title>
      </Head>
      <header className={styles.header}>
        <h1><FaGamepad /> Epix</h1>
        <div>
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      <main className={styles.grid}>
        {filtered.map((game, index) => (
          <Link href={"/games/" + game.slug} key={index} className={styles.card}>
            <div className={styles.card}>
              <h2>{game.title}</h2>
              <p>{game.category.charAt(0).toUpperCase() + game.category.slice(1)} Game</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
