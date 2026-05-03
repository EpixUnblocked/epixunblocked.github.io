import { Html, Head, Main, NextScript } from 'next/document';

const GA_ID = 'G-H1LHBQVY1T';

// Inline script: runs before React hydrates so GA's first pageview already
// carries the right consent signal for returning users.
const consentScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;

  var saved = 'denied';
  try {
    if (localStorage.getItem('epix:consent') === 'granted') saved = 'granted';
  } catch (e) {}

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: saved,
    wait_for_update: 500,
  });

  gtag('js', new Date());
  gtag('config', '${GA_ID}', { anonymize_ip: true });
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Google Analytics 4 — consent-gated via Consent Mode v2 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: consentScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
