import { useEffect } from 'react';
import { useRouter } from 'next/router';

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

  return null;
}
