// components/PanicMode.js — Boss key
// Press ` (backtick) to instantly redirect the tab to the real URL of the
// currently-selected cloak (Classroom / Drive / Gmail / etc).
// Uses location.replace so the back button doesn't show Epix.

import { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import cloaks from '../data/cloaks';

const FALLBACK_URL = 'https://classroom.google.com';

export default function PanicMode() {
  const { cloakKey } = useGameContext();

  useEffect(() => {
    const handleKey = (e) => {
      const target = e.target;
      const tag = target?.tagName;
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable;
      if (isTyping) return;
      if (e.key !== '`') return;

      e.preventDefault();
      const cloak = cloaks.find((c) => c.key === cloakKey);
      const url = cloak?.panicUrl || FALLBACK_URL;
      window.location.replace(url);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cloakKey]);

  return null;
}
