// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { GameProvider } from '../context/GameContext';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-H1LHBQVY1T"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-H1LHBQVY1T');
</script>
        <title>Epix</title>
        <link rel="icon" href="/epix/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GameProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GameProvider>
    </>
  );
}
