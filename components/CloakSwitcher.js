// components/CloakSwitcher.js — Tab disguise switcher
// Header dropdown that lets users pick a tab cloak preset.

import { useEffect, useRef, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import cloaks from '../data/cloaks';
import styles from '../styles/CloakSwitcher.module.css';

export default function CloakSwitcher() {
  const { cloakKey, setCloakKey } = useGameContext();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const current = cloaks.find((c) => c.key === cloakKey) || cloaks[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-label="Tab disguise"
        aria-expanded={open}
        title={`Tab cloak: ${current.label}`}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          {/* domino mask */}
          <path d="M2 9c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v2c0 4-3 6-6 6-1.5 0-2.7-.6-4-2-1.3 1.4-2.5 2-4 2-3 0-6-2-6-6V9z" fill="currentColor" />
        </svg>
        <span className={styles.triggerLabel}>CLOAK</span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <span className={styles.menuTitle}>// TAB DISGUISE</span>
          {cloaks.map((c) => (
            <button
              key={c.key}
              role="menuitemradio"
              aria-checked={c.key === cloakKey}
              className={`${styles.option} ${c.key === cloakKey ? styles.optionActive : ''}`}
              onClick={() => {
                setCloakKey(c.key);
                setOpen(false);
              }}
            >
              <img
                src={c.favicon}
                alt=""
                className={styles.optionFavicon}
                width="16"
                height="16"
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              />
              <span className={styles.optionLabel}>{c.label}</span>
              {c.key === cloakKey && <span className={styles.optionCheck}>●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
