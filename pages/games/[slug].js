// game slug
// @scriptedCoke

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import games from '../../data/games';
import styles from '../../styles/Game.module.css';

export default function Game() {
  const router = useRouter();
  const { slug } = router.query;
  const [game, setGame] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    const foundGame = games.find((g) => g.slug === slug);
    setGame(foundGame || null);
  }, [slug]);

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) iframe.requestFullscreen();
      else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
      else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
    }
  };

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
            ref={iframeRef}
            src={`/games/${game.slug}/index.html`}
            title={game.title}
            className={styles.iframe}
            allowFullScreen
          />
          <button onClick={handleFullscreen} className={styles.fullscreenBtn}>⛶ Fullscreen</button>
        </div>
      </div>
    </>
  );
}
