// pages/terms.js
import Head from 'next/head';
import styles from '../styles/Game.module.css'

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | Epix</title>
      </Head>
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#ddd' }}>
      <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <h1>Terms of Service</h1>
        <p>Last updated: May 5, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Epix, you agree to be bound by these Terms. If you do not agree, please do not use the site.</p>

        <h2>2. Use of the Site</h2>
        <p>Epix is provided for educational and entertainment purposes only. You agree not to use it for any unlawful purpose.</p>

        <h2>3. Intellectual Property</h2>
        <p>All content and materials on Epix, unless stated otherwise, are owned by their respective owners. You may not reproduce or redistribute without permission.</p>

        <h2>4. Disclaimer</h2>
        <p>Epix provides games as-is, with no warranties. We are not responsible for any damages or losses from using the site.</p>

        <h2>5. Changes to Terms</h2>
        <p>We may update these Terms from time to time. Your continued use of the site means you accept the revised terms.</p>
      </main>
    </>
  );
}
