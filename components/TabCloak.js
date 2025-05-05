// TabCloak.js
// @scriptedCoke

import { useEffect } from 'react';

export default function TabCloak() {
  useEffect(() => {
    const originalTitle = document.title;
    const originalFavicon = document.querySelector("link[rel='icon']")?.href;

    const cloakTitle = 'Google Drive';
    const cloakFavicon = 'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico';

    const changeFavicon = (src) => {
      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = src;
    };

    const handleBlur = () => {
      document.title = cloakTitle;
      changeFavicon(cloakFavicon);
    };

    const handleFocus = () => {
      document.title = originalTitle;
      if (originalFavicon) changeFavicon(originalFavicon);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null;
}
