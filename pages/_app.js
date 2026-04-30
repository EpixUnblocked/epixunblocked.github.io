// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import { GameProvider } from '../context/GameContext';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <GameProvider>
      <div className="page-wrapper">
        <Head>
          <title>Epix</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="Epix Unblocked" />
          <meta property="og:description" content="Epix Unblocked games has a wide range of games that bypasses your school or workplace internet restrictions and hides itself once you exit the tab." />
          <meta property="og:url" content="https://epixunblocked.github.io/" />
          <meta property="og:type" content="website" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Footer />
        <CookieBanner />
      </div>
    </GameProvider>
  );
}
