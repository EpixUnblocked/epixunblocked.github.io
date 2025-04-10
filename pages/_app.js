// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { GameProvider } from '../context/GameContext';

export default function App({ Component, pageProps }) {
  return (
    <Head>
        <title>Epix</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <GameProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GameProvider>
  );
}
