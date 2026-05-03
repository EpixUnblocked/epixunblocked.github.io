import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const lastGame = localStorage.getItem('lastGameRoute');
    if (lastGame) {
      router.replace(lastGame);
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <Head>
      <title>404 — Epix Unblocked</title>
      <meta name="robots" content="noindex, follow" />
    </Head>
  );
}
