// components/KeyboardHelp.js
// Press ? anywhere (when not typing) to surface a cheatsheet of every
// keyboard shortcut. Esc / backdrop / button to dismiss.

import { useEffect, useState } from 'react';
import styles from '../styles/KeyboardHelp.module.css';

const SHORTCUTS = [
  { keys: ['/'], desc: 'Focus the search bar' },
  { keys: ['R'], desc: 'Jump to a random game' },
  { keys: ['F'], desc: 'Toggle fullscreen (on a game page)' },
  { keys: ['`'], desc: 'Panic — redirect to your selected cloak' },
  { keys: ['?'], desc: 'Show this help' },
  { keys: ['Esc'], desc: 'Close drawers, modals, and overlays' },
];

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;

      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        setClosing(false);
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  };

  if (!open) return null;

  const onScrollerClick = (e) => {
    if (e.target === e.currentTarget) dismiss();
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`}
        onClick={dismiss}
        aria-hidden="true"
      />
      <div className={styles.scroller} onClick={onScrollerClick}>
        <div
          className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}
          role="dialog"
          aria-label="Keyboard shortcuts"
        >
        <span className={styles.stamp}>// SHORTCUTS</span>
        <button
          type="button"
          className={styles.close}
          onClick={dismiss}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className={styles.title}>
          Press <em>any.</em>
        </h2>
        <p className={styles.lead}>
          A handful of keyboard shortcuts to fly through Epix.
        </p>
        <ul className={styles.list}>
          {SHORTCUTS.map((s, i) => (
            <li key={i} className={styles.row}>
              <span className={styles.keys}>
                {s.keys.map((k, j) => (
                  <kbd key={j} className={styles.kbd}>
                    {k}
                  </kbd>
                ))}
              </span>
              <span className={styles.desc}>{s.desc}</span>
            </li>
          ))}
        </ul>
        <p className={styles.foot}>
          // TYPE <kbd className={styles.kbd}>?</kbd> AGAIN ANYTIME
        </p>
        </div>
      </div>
    </>
  );
}
