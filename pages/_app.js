// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import RequestModal from '../components/RequestModal';
import KeyboardHelp from '../components/KeyboardHelp';
import { GameProvider } from '../context/GameContext';
import Head from 'next/head';

const SITE_URL = 'https://epixunblocked.github.io';
const SITE_NAME = 'Epix Unblocked';
const DEFAULT_TITLE = 'Epix Unblocked';
const DEFAULT_DESCRIPTION =
  'Epix is a curated arcade of free unblocked browser games — instant-play, no signup, no ads. Includes Block Blast, Slope, Moto X3M, Slither.io, OvO, BitLife, FNAF, Geometry Dash and more.';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function App({ Component, pageProps }) {
  return (
    <GameProvider>
      <div className="page-wrapper">
        <Head>
          <title>{DEFAULT_TITLE}</title>
          <meta name="description" content={DEFAULT_DESCRIPTION} />
          {/* Favicon stack:
              - .ico: catch-all for older browsers / RSS readers / GitHub previews
              - SVG: modern browsers; scales crisp from 16px to OS app-icon size
              No apple-touch-icon yet — iOS doesn't render SVG touch icons; drop
              a 180x180 PNG at /apple-touch-icon.png to enable the iOS home-screen icon. */}
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="icon" type="image/svg+xml" href="/logo.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#0a0a09" />
          <meta name="robots" content="index, follow, max-image-preview:large" />
          <meta name="keywords" content="unblocked games, free games, browser games, school games, work games, html5 games, arcade games, epix, block blast, slope, moto x3m, slither.io, ovo, bitlife" />
          <meta name="application-name" content={SITE_NAME} />

          {/* Open Graph */}
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:title" content={DEFAULT_TITLE} />
          <meta property="og:description" content={DEFAULT_DESCRIPTION} />
          <meta property="og:url" content={`${SITE_URL}/`} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image" content={OG_IMAGE} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={DEFAULT_TITLE} />
          <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
          <meta name="twitter:image" content={OG_IMAGE} />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Footer />
        <CookieBanner />
        <RequestModal />
        <KeyboardHelp />
      </div>
    </GameProvider>
  );
}
