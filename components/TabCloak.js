// TabCloak.js — Tab disguise on blur
// When the tab is focused, it shows the real title/favicon (Epix).
// When the user switches to another tab, the title and favicon swap to
// whatever cloak preset is selected. Off-mode disables the swap entirely.
// @scriptedCoke

import { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import cloaks from '../data/cloaks';

const DEFAULT_FAVICON = '/favicon.ico';

function getCurrentFaviconHref() {
  const link = document.querySelector("link[rel~='icon']");
  return link?.getAttribute('href') || DEFAULT_FAVICON;
}

function setFavicon(src) {
  const links = document.querySelectorAll("link[rel~='icon']");
  if (links.length === 0) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = src;
    document.head.appendChild(link);
    return;
  }
  links.forEach((l) => {
    if (l.getAttribute('href') !== src) l.setAttribute('href', src);
  });
}

export default function TabCloak() {
  const { cloakKey, hydrated } = useGameContext();

  useEffect(() => {
    if (!hydrated) return;

    const cloak = cloaks.find((c) => c.key === cloakKey) || cloaks[0];
    if (cloak.key === 'epix') return; // off — no cloaking

    let savedTitle = document.title;
    let savedFavicon = getCurrentFaviconHref();
    let cloaked = false;

    const cloakOn = () => {
      if (cloaked) return;
      savedTitle = document.title;
      savedFavicon = getCurrentFaviconHref();
      document.title = cloak.title;
      setFavicon(cloak.favicon);
      cloaked = true;
    };

    const cloakOff = () => {
      if (!cloaked) return;
      document.title = savedTitle;
      setFavicon(savedFavicon);
      cloaked = false;
    };

    const handleBlur = () => cloakOn();
    const handleFocus = () => cloakOff();
    const handleVisibility = () => {
      if (document.hidden) cloakOn();
      else cloakOff();
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // If the tab is already in the background when this mounts, cloak now.
    if (document.hidden || !document.hasFocus()) cloakOn();

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      cloakOff();
    };
  }, [cloakKey, hydrated]);

  return null;
}
