// TabCloak.js — Multi-cloak tab disguise
// @scriptedCoke

import { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import cloaks from '../data/cloaks';

export default function TabCloak() {
  const { cloakKey, hydrated } = useGameContext();

  useEffect(() => {
    if (!hydrated) return;

    const cloak = cloaks.find((c) => c.key === cloakKey) || cloaks[0];
    const isOff = cloak.key === 'epix';

    const setFavicon = (src) => {
      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = src;
    };

    // For "epix" preset (off), no cloak — title and favicon stay native.
    if (isOff) {
      setFavicon('/favicon.ico');
      return;
    }

    // Otherwise: apply cloak immediately (persistent disguise)
    document.title = cloak.title;
    setFavicon(cloak.favicon);
  }, [cloakKey, hydrated]);

  return null;
}
