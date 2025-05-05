// pages/privacy.js
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Game.module.css';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Epix</title>
      </Head>
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#ddd' }}>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          ← Back
        </button>
  <h1>Privacy Policy</h1>
        <p>Last updated: May 5, 2025</p>

        <h2>1. Information We Collect</h2>
        <p>We do not directly collect any personal data. However, analytics or embedded content may collect anonymized information such as IP address, device type, or usage patterns.</p>

        <h2>2. Cookies</h2>
        <p>We may use cookies for session management or to improve performance. You can disable cookies in your browser settings.</p>

        <h2>3. Third-Party Services</h2>
        <p>Epix may link to third-party services or host games from external developers. These third parties may collect their own data.</p>

        <h2>4. Your Consent</h2>
        <p>By using our site, you consent to our Privacy Policy.</p>

        <h2>5. Changes to This Policy</h2>
        <p>We may update our privacy practices. Check this page regularly for changes.</p>
      </main>
    </>
  );
}
