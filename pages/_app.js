// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { GameProvider } from '../context/GameContext';

export default function App({ Component, pageProps }) {
  return (
    <GameProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GameProvider>
  );
}
