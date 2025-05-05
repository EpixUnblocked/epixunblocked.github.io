// components/Footer.js
import styles from '../styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
        <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
        <a href="https://github.com/EpixUnblocked/epixunblocked.github.io" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          GitHub
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} Epix. All rights reserved.</p>
    </footer>
  );
}
