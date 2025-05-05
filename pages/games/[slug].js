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
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const foundGame = games.find((g) => g.slug === slug);
    setGame(foundGame || null);
  }, [slug]);

  // Only run if game is valid
  useEffect(() => {
    if (typeof window !== 'undefined' && game?.slug) {
      localStorage.setItem('lastGameRoute', `/games/${game.slug}`);
    }
  }, [game]);

  useEffect(() => {
    const handleChange = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const iframeWrapper = iframeRef.current;

    if (!iframeWrapper) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (iframeWrapper.requestFullscreen) {
        iframeWrapper.requestFullscreen();
      } else if (iframeWrapper.webkitRequestFullscreen) {
        iframeWrapper.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
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

        <div className={styles.iframeWrapper} ref={iframeRef}>
          <iframe
            src={`/html/${game.slug}/index.html`}
            title={game.title}
            className={styles.iframe}
            allowFullScreen
          />
          <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
            {isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>
    </>
  );
}
