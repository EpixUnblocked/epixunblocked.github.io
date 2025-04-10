import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import games from '../../data/games';

export default function Game() {
  const router = useRouter();
  const { slug } = router.query;

  const game = games.find((g) => g.slug === slug);

  if (!game) return <p>Game not found</p>;

  return (
    <>
      <Head>
        <title>{game.title} | Epix</title>
      </Head>

      <Link href="/" style={{ color: '#fff', marginBottom: '12px', display: 'inline-block' }}>
        ← Back to Game List
      </Link>

      <h1>{game.title}</h1>
      <p style={{ color: '#ccc' }}>{game.description}</p>

      <iframe
        src={`/epix/games/${game.slug}/index.html`}
        style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '10px' }}
        title={game.title}
      />
    </>
  );
}
