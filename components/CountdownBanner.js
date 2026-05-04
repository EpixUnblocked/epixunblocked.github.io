// CountdownBanner.js

import { useEffect, useState } from 'react';
import styles from '../styles/CountdownBanner.module.css';

const TARGET_DATE = new Date('2026-05-04T01:00:00Z'); // May 4, 2026 11:00 AEST (UTC+10)

function getTimeRemaining(target) {
  const total = target.getTime() - Date.now();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

const pad = (n) => String(n).padStart(2, '0');

export default function CountdownBanner() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const update = () => setTime(getTimeRemaining(TARGET_DATE));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <div className={styles.banner} aria-live="polite">
        <span className={styles.label}>EPIX Unblocked v2 launches soon</span>
      </div>
    );
  }

  if (time.total <= 0) {
    return (
      <div className={styles.banner} aria-live="polite">
        <span className={styles.label}>EPIX Unblocked v2 is live!</span>
      </div>
    );
  }

  return (
    <div className={styles.banner} aria-live="polite">
      <span className={styles.label}>EPIX Unblocked v2 in</span>
      <span className={styles.clock}>
        <span className={styles.unit}>
          <span className={styles.value}>{time.days}</span>
          <span className={styles.unitLabel}>d</span>
        </span>
        <span className={styles.sep}>:</span>
        <span className={styles.unit}>
          <span className={styles.value}>{pad(time.hours)}</span>
          <span className={styles.unitLabel}>h</span>
        </span>
        <span className={styles.sep}>:</span>
        <span className={styles.unit}>
          <span className={styles.value}>{pad(time.minutes)}</span>
          <span className={styles.unitLabel}>m</span>
        </span>
        <span className={styles.sep}>:</span>
        <span className={styles.unit}>
          <span className={styles.value}>{pad(time.seconds)}</span>
          <span className={styles.unitLabel}>s</span>
        </span>
      </span>
    </div>
  );
}