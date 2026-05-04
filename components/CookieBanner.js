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
  // mode: 'first' = bottom-left consent card (initial visit)
  //       'manage' = centered modal triggered by footer "Cookies" button
  const [mode, setMode] = useState('first');
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [current, setCurrent] = useState(null); // 'granted' | 'denied' | null

  // First mount: show consent card only if no choice has been made yet.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'granted' || saved === 'denied') {
        setCurrent(saved);
        applyConsent(saved);
      } else {
        setMode('first');
        setVisible(true);
      }
    } catch {
      setMode('first');
      setVisible(true);
    }
  }, []);

  // Footer "Cookies" button → open the manage modal.
  useEffect(() => {
    const open = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setCurrent(saved === 'granted' || saved === 'denied' ? saved : null);
      } catch {}
      setClosing(false);
      setMode('manage');
      setVisible(true);
    };
    window.addEventListener('epix:manage-cookies', open);
    return () => window.removeEventListener('epix:manage-cookies', open);
  }, []);

  // Esc closes the manage modal.
  useEffect(() => {
    if (!visible || mode !== 'manage') return;
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, mode]);

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
    setCurrent(state);
    dismiss();
  };

  if (!visible) return null;

  if (mode === 'manage') {
    return (
      <>
        <div
          className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`}
          onClick={dismiss}
          aria-hidden="true"
        />
        <div
          className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Manage cookies"
        >
          <div className={styles.modalHeader}>
            <span className={styles.stamp}>// MANAGE</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={dismiss}
              aria-label="Close"
            >×</button>
          </div>

          <div className={styles.body}>
            <h3 className={styles.title}>
              Cookie <em>preferences.</em>
            </h3>

            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Current</span>
              <span
                className={`${styles.statusValue} ${
                  current === 'granted' ? styles.statusGranted :
                  current === 'denied' ? styles.statusDenied :
                  styles.statusUnset
                }`}
              >
                {current === 'granted' ? 'ALLOWED'
                  : current === 'denied' ? 'DECLINED'
                  : 'NOT SET'}
              </span>
            </div>

            <p className={styles.text}>
              Analytics cookies (Google Analytics) help us see how Epix is used.
              No ads, no profile sales. Switch your choice anytime — it takes
              effect on the next page load. See our{' '}
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnAllow} ${current === 'granted' ? styles.btnActive : ''}`}
                onClick={() => choose('granted')}
                disabled={current === 'granted'}
              >
                {current === 'granted' ? '✓ ALLOWED' : 'ALLOW'}
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDecline} ${current === 'denied' ? styles.btnActive : ''}`}
                onClick={() => choose('denied')}
                disabled={current === 'denied'}
              >
                {current === 'denied' ? '✓ DECLINED' : 'DECLINE'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

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
