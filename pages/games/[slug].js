// game slug
// @scriptedCoke

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import games from '../../data/games';
import styles from '../../styles/Game.module.css';
import { useGameContext } from '../../context/GameContext';

const SITE_URL = 'https://epixunblocked.github.io';

export async function getStaticPaths() {
  return {
    paths: games.map((g) => ({ params: { slug: g.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const game = games.find((g) => g.slug === params.slug) || null;
  return { props: { game } };
}

export default function Game({ game }) {
  const router = useRouter();
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { pushRecent, isFavorite, toggleFavorite, hydrated } = useGameContext();

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

  const pageUrl = `${SITE_URL}/games/${game.slug}`;
  const pageTitle = `Play ${game.title} Unblocked — Epix`;
  const rawDesc = (game.description || '').trim();
  const pageDesc = rawDesc
    ? `${rawDesc} Play ${game.title} free in your browser, no downloads, no signup.`
    : `Play ${game.title} unblocked free in your browser. Instant load, no signup, no ads.`;
  const imageUrl = game.thumbnail?.startsWith('http')
    ? game.thumbnail
    : `${SITE_URL}${game.thumbnail || `/html/${game.slug}/thumb.png`}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: pageDesc,
    url: pageUrl,
    image: imageUrl,
    genre: (game.tags || []).filter(
      (t) => !['featured', 'popular', 'new'].includes(t)
    ),
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    inLanguage: 'en',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Epix Unblocked',
      url: SITE_URL,
    },
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Epix Unblocked" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={imageUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
              <span className={styles.favStar}>{fav ? '★' : '☆'}</span>
              {fav ? 'SAVED' : 'SAVE'}
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
