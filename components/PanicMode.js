// components/PanicMode.js — Boss key
// Press ` (backtick) to instantly swap the page to a fake Google Classroom view.
// Press it again or click "Resume" to return.

import { useEffect, useState, useRef } from 'react';
import styles from '../styles/PanicMode.module.css';

const FAKE_CLASSES = [
  { name: 'Algebra II — Period 3', teacher: 'Ms. Hernandez', color: '#1976d2', new: 2 },
  { name: 'AP US History', teacher: 'Mr. Chen', color: '#d81b60', new: 0 },
  { name: 'English 11 Honors', teacher: 'Mrs. Patel', color: '#388e3c', new: 1 },
  { name: 'Biology — Section B', teacher: 'Dr. Owens', color: '#f9a825', new: 3 },
  { name: 'Spanish III', teacher: 'Sra. Ramos', color: '#5e35b1', new: 0 },
  { name: 'Health & PE', teacher: 'Coach Brown', color: '#00838f', new: 1 },
];

export default function PanicMode() {
  const [active, setActive] = useState(false);
  const savedTitleRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      const target = e.target;
      const tag = target?.tagName;
      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        target?.isContentEditable;

      // Backtick toggles panic; also Esc exits if active
      if (e.key === '`' && !isTyping) {
        e.preventDefault();
        setActive((prev) => !prev);
      } else if (e.key === 'Escape' && active) {
        setActive(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active]);

  // Swap document title while active
  useEffect(() => {
    if (active) {
      savedTitleRef.current = document.title;
      document.title = 'Classes';
    } else if (savedTitleRef.current !== null) {
      document.title = savedTitleRef.current;
      savedTitleRef.current = null;
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className={styles.shell} role="dialog" aria-label="Google Classroom">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className={styles.brand}>
            <span className={styles.brandIcon}>
              <svg viewBox="0 0 48 48" width="32" height="32">
                <rect x="4" y="8" width="40" height="32" rx="3" fill="#0F9D58" />
                <circle cx="24" cy="24" r="6" fill="#fff" />
                <rect x="14" y="32" width="20" height="3" fill="#fff" />
              </svg>
            </span>
            Classroom
          </span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} aria-label="Calendar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>
          <div className={styles.avatar}>S</div>
        </div>
      </header>

      <div className={styles.subBar}>
        <span className={styles.tab + ' ' + styles.tabActive}>Classes</span>
        <span className={styles.tab}>To-do</span>
        <span className={styles.tab}>Calendar</span>
      </div>

      <main className={styles.grid}>
        {FAKE_CLASSES.map((c, i) => (
          <article key={i} className={styles.card}>
            <div
              className={styles.cardBanner}
              style={{ backgroundColor: c.color }}
            >
              <h3 className={styles.cardTitle}>{c.name}</h3>
              <p className={styles.cardTeacher}>{c.teacher}</p>
            </div>
            <div className={styles.cardBody}>
              {c.new > 0 ? (
                <p className={styles.cardNotice}>
                  <strong>{c.new} new</strong> assignment{c.new > 1 ? 's' : ''}
                </p>
              ) : (
                <p className={styles.cardNoticeMuted}>No new posts</p>
              )}
            </div>
            <div className={styles.cardActions}>
              <button className={styles.cardActionBtn} aria-label="Open class">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </main>

      <button
        className={styles.resumeHint}
        onClick={() => setActive(false)}
        aria-label="Resume Epix"
      >
        Press <kbd>`</kbd> or <kbd>Esc</kbd> to resume
      </button>
    </div>
  );
}
