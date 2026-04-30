// components/CookieBanner.js — Cookie consent banner (GA4 Consent Mode v2)
// Stores result in localStorage as 'granted' | 'denied' under 'epix:consent'.
// Listens for 'epix:manage-cookies' window event so other parts of the UI
// (e.g. footer link) can re-open the banner.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/CookieBanner.module.css';

const STORAGE_KEY = 'epix:consent';

function applyConsent(state) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: state,
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // First mount: show only if no choice has been made yet.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== 'granted' && saved !== 'denied') {
        setVisible(true);
      } else {
        // Ensure GA gets the saved choice this session too.
        applyConsent(saved);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  // Allow other UI (footer link) to re-open the banner.
  useEffect(() => {
    const open = () => {
      setClosing(false);
      setVisible(true);
    };
    window.addEventListener('epix:manage-cookies', open);
    return () => window.removeEventListener('epix:manage-cookies', open);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  };

  const choose = (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, state);
    } catch {}
    applyConsent(state);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      className={`${styles.banner} ${closing ? styles.bannerClosing : ''}`}
      role="dialog"
      aria-label="Cookie preferences"
    >
      <span className={styles.stamp}>// COOKIES</span>

      <div className={styles.body}>
        <h3 className={styles.title}>
          Cookies <em>incoming.</em>
        </h3>
        <p className={styles.text}>
          We use Google Analytics to see how Epix is being used — that&apos;s
          it. No ads, no profile sales. Decline if you&apos;d rather not.
          Read more in our{' '}
          <Link href="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
          .
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnAllow}`}
            onClick={() => choose('granted')}
          >
            ALLOW ALL
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDecline}`}
            onClick={() => choose('denied')}
          >
            DECLINE
          </button>
        </div>
      </div>
    </div>
  );
}
