// game slug
// @scriptedCoke

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import games from '../../data/games';
import styles from '../../styles/Game.module.css';
import { useGameContext } from '../../context/GameContext';

export default function Game() {
  const router = useRouter();
  const { slug } = router.query;
  const [game, setGame] = useState(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { pushRecent, isFavorite, toggleFavorite, hydrated } = useGameContext();

  useEffect(() => {
    if (!slug) return;
    const foundGame = games.find((g) => g.slug === slug);
    setGame(foundGame || null);
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined' && game?.slug) {
      localStorage.setItem('lastGameRoute', `/games/${game.slug}`);
    }
  }, [game]);

  // Track recents once context is hydrated and game is loaded
  useEffect(() => {
    if (hydrated && game?.slug) {
      pushRecent(game.slug);
    }
  }, [hydrated, game?.slug, pushRecent]);

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
      } else if (iframeWrapper.msRequestFullscreen) {
        iframeWrapper.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // F shortcut for fullscreen
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
      if (isTyping) return;
      if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!game) return <p className={styles.notFound}>Game not found.</p>;

  const fav = hydrated && isFavorite(game.slug);

  return (
    <>
      <Head>
        <title>{game.title} | Epix</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.topRow}>
          <button onClick={() => router.push('/')} className={styles.backBtn}>
            ◀ BACK TO ARCADE
          </button>
          <div className={styles.topRowRight}>
            <button
              type="button"
              className={`${styles.favBtn} ${fav ? styles.favBtnActive : ''}`}
              onClick={() => toggleFavorite(game.slug)}
              aria-pressed={fav}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {fav ? '★ SAVED' : '☆ SAVE'}
            </button>
            <span className={styles.gameMeta}>
              <strong>NOW PLAYING</strong> // {game.tags?.[0] || 'arcade'}
            </span>
          </div>
        </div>

        <h1 className={styles.title}>
          <em>{game.title}</em>
        </h1>
        <p className={styles.description}>{game.description}</p>

        <div className={styles.iframeWrapper} ref={iframeRef}>
          <iframe
            src={`/html/${game.slug}/index.html`}
            title={game.title}
            className={styles.iframe}
            allowFullScreen
          />
          <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
            {isFullscreen ? '⛶ EXIT FULLSCREEN (F)' : '⛶ FULLSCREEN (F)'}
          </button>
        </div>
      </div>
    </>
  );
}
