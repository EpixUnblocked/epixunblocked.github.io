
import { useRouter } from 'next/router'
import Head from 'next/head'

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
