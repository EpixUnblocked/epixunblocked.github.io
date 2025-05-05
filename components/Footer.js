// components/Footer.js

import styles from '../styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.links}>
          <Link href="/terms"><span>Terms of Service</span></Link>
          <Link href="/privacy"><span>Privacy Policy</span></Link>
          <a href="https://github.com/EpixUnblocked/epixunblocked.github.io" target="_blank" rel="noopener noreferrer">
            <span>GitHub</span>
          </a>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} Epix. All rights reserved.</p>
      </div>
    </footer>
  );
}
