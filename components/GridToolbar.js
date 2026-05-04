// components/GridToolbar.js
// Sort dropdown + Random / Surprise me buttons that sit above the grid.

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import games from '../data/games';
import { useGameContext } from '../context/GameContext';
import styles from '../styles/GridToolbar.module.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
];

export default function GridToolbar() {
  const router = useRouter();
  const { sortMode, setSortMode } = useGameContext();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const current = SORT_OPTIONS.find((o) => o.value === sortMode) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const goRandom = () => {
    if (!games.length) return;
    const pick = games[Math.floor(Math.random() * games.length)];
    router.push(`/games/${pick.slug}`);
  };

  return (
    <div className={styles.bar}>
      <div className={styles.sortWrap} ref={wrapRef}>
        <span className={styles.label}>Sort</span>
        <button
          className={`${styles.sortBtn} ${open ? styles.sortBtnOpen : ''}`}
          onClick={() => setOpen((p) => !p)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span>{current.label}</span>
          <span className={styles.caret}>▾</span>
        </button>
        {open && (
          <div className={styles.menu} role="menu">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                role="menuitemradio"
                aria-checked={opt.value === sortMode}
                className={`${styles.option} ${opt.value === sortMode ? styles.optionActive : ''}`}
                onClick={() => {
                  setSortMode(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className={styles.randomBtn}
        onClick={goRandom}
        aria-label="Random game"
        title="Random game (R)"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          <circle cx="16" cy="16" r="1.4" fill="currentColor" />
          <circle cx="16" cy="8" r="1.4" fill="currentColor" />
          <circle cx="8" cy="16" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        </svg>
        <span>Surprise me</span>
      </button>
    </div>
  );
}
