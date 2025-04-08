import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const gameData = {
  flappy: {
    title: 'Flappy Bird',
    slug: 'flappy',
    description: 'A fun clone of Flappy Bird.',
    embedPath: '/games/flappy/index.html',
  },
  // Add more games here using the same format
};

export default function GamePage() {
  const router = useRouter();
  const { slug } = router.query;

  const game = gameData[slug];

  if (!slug || !game) {
    return (
      <div style={{ color: '#fff', padding: '20px' }}>
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{game.title} | Epix</title>
      </Head>
      <div style={{ padding: '20px' }}>
        <Link href="/" style={{ color: '#fff', marginBottom: '12px', display: 'inline-block' }}>
          ← Back to Game List
        </Link>
        <h1 style={{ color: '#fff' }}>{game.title}</h1>
        <p style={{ color: '#ccc' }}>{game.description}</p>
        <iframe
          src={game.embedPath}
          style={{
            width: '100%',
            height: '80vh',
            border: 'none',
            borderRadius: '10px',
            marginTop: '20px',
          }}
          title={game.title}
        />
      </div>
    </>
  );
}
