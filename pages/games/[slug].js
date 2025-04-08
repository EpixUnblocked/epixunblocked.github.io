
import { useRouter } from 'next/router'
import Head from 'next/head'

import Link from 'next/link';

...

return (
  <>
    <Link href="/" style={{ color: '#fff', marginBottom: '12px', display: 'inline-block' }}>← Back to Game List</Link>

    <h1>{game.title}</h1>
    <iframe
      src={`/games/${game.slug}/index.html`}
      style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '10px' }}
    />
  </>
);

export default function Game() {
  const router = useRouter()
  const { slug } = router.query

  return (
    <>
      <Head>
        <title>{slug} | Epix</title>
      </Head>
      <iframe
        src={`/games/${slug}.html`}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title={slug}
      ></iframe>
    </>
  );
}
