// components/Footer.js — END OF BROADCAST

import styles from '../styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>EPIX</span>
          <span className={styles.brandTag}>
            Pirate broadcast <em>//</em> always unblocked
          </span>
        </div>

        <nav className={styles.links}>
          <Link href="/terms"><span>Terms</span></Link>
          <Link href="/privacy"><span>Privacy</span></Link>
          <a
            href="https://github.com/EpixUnblocked/epixunblocked.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Source</span>
          </a>
        </nav>

        <p className={styles.copyright}>
          <em>© {year} EPIX</em> &nbsp; All signals reserved
        </p>
      </div>

      <p className={styles.signoff}>
        // <strong>END OF BROADCAST</strong> // STAY UNBLOCKED // PRESS START //
      </p>
    </footer>
  );
}
