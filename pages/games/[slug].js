// game slug
// @scriptedCoke

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import games from '../../data/games';
import styles from '../../styles/Game.module.css';

export default function Game() {
  const router = useRouter();
  const { slug } = router.query;
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const foundGame = games.find((g) => g.slug === slug);
    setGame(foundGame || null);
  }, [slug]);

  if (!game) return <p className={styles.notFound}>Game not found.</p>;

  return (
    <>
      <Head>
        <title>{game.title} | Epix</title>
      </Head>

      <div className={styles.container}>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          ← Back
        </button>

        <h1 className={styles.title}>{game.title}</h1>
        <p className={styles.description}>{game.description}</p>

        <div className={styles.iframeWrapper}>
          <iframe
            src={`/games/${game.slug}/index.html`}
            title={game.title}
            className={styles.iframe}
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}
