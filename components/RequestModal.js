// components/RequestModal.js
// Game request form. Builds a prefilled GitHub Issue URL and opens it in a
// new tab so the user can submit it from there. Triggered globally via the
// 'epix:open-request' window event (dispatched from the Footer link).

import { useEffect, useRef, useState } from 'react';
import styles from '../styles/RequestModal.module.css';

const REPO = 'EpixUnblocked/epixunblocked.github.io';

const GENRES = [
  'arcade',
  'driving',
  'horror',
  'idle',
  'platformer',
  'puzzle',
  'runner',
  'shooter',
  'simulator',
  'sport',
];

const formatGenre = (g) => g.charAt(0).toUpperCase() + g.slice(1);

const initialForm = {
  title: '',
  where: '',
  genre: '',
  genreOther: '',
  thumbnail: '',
  pitch: '',
  name: '',
};

function resolveGenre({ genre, genreOther }) {
  if (genre === 'other') return genreOther.trim() || 'Other';
  if (genre) return formatGenre(genre);
  return '—';
}

function buildIssueUrl({ title, where, genre, genreOther, thumbnail, pitch, name }) {
  const issueTitle = `[Game Request] ${title.trim()}`;
  const body = [
    `**Title:** ${title.trim()}`,
    `**Where to play:** ${where.trim()}`,
    `**Genre:** ${resolveGenre({ genre, genreOther })}`,
    `**Thumbnail:** ${thumbnail.trim() || '—'}`,
    `**Pitch:** ${pitch.trim() || '—'}`,
    `**Submitted by:** ${name.trim() || 'anonymous'}`,
    '',
    '—',
    '_Submitted via the Epix request form._',
  ].join('\n');

  const params = new URLSearchParams({
    title: issueTitle,
    labels: 'game-request',
    body,
  });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}

export default function RequestModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  // Listen for footer link (or anything else) opening the modal.
  useEffect(() => {
    const onOpen = () => {
      setClosing(false);
      setSubmitted(false);
      setErrors({});
      setOpen(true);
    };
    window.addEventListener('epix:open-request', onOpen);
    return () => window.removeEventListener('epix:open-request', onOpen);
  }, []);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus title field when opening.
  useEffect(() => {
    if (open && !submitted) {
      const t = setTimeout(() => titleRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open, submitted]);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      // Reset for next open
      setForm(initialForm);
      setSubmitted(false);
      setErrors({});
    }, 280);
  };

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = 'Required';
    if (!form.where.trim()) next.where = 'Required';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    const url = buildIssueUrl(form);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
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
          className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}
          role="dialog"
          aria-label="Request a game"
          aria-modal="true"
        >
        <span className={styles.stamp}>// REQUEST</span>
        <button
          type="button"
          className={styles.close}
          onClick={dismiss}
          aria-label="Close"
        >
          ×
        </button>

        {!submitted ? (
          <>
            <h2 className={styles.title}>
              Request a <em>game.</em>
            </h2>
            <p className={styles.lead}>
              Fill this in and we&apos;ll open it on GitHub for you to submit.
              No account? Make one in 30 seconds — it&apos;s how we track
              every request.
            </p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label className={styles.field}>
                <span className={styles.label}>
                  Game title <span className={styles.req}>*</span>
                </span>
                <input
                  ref={titleRef}
                  type="text"
                  className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                  value={form.title}
                  onChange={update('title')}
                  placeholder="e.g. Slope, Geometry Dash..."
                  spellCheck="false"
                  autoComplete="off"
                />
                {errors.title && (
                  <span className={styles.errorText}>{errors.title}</span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>
                  Where to find it <span className={styles.req}>*</span>
                </span>
                <input
                  type="text"
                  className={`${styles.input} ${errors.where ? styles.inputError : ''}`}
                  value={form.where}
                  onChange={update('where')}
                  placeholder="link to play, store, or just say where"
                  spellCheck="false"
                  autoComplete="off"
                />
                {errors.where && (
                  <span className={styles.errorText}>{errors.where}</span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Genre</span>
                <select
                  className={styles.input}
                  value={form.genre}
                  onChange={update('genre')}
                >
                  <option value="">— pick one —</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {formatGenre(g)}
                    </option>
                  ))}
                  <option value="other">Other (type below)</option>
                </select>
                {form.genre === 'other' && (
                  <input
                    type="text"
                    className={styles.input}
                    value={form.genreOther}
                    onChange={update('genreOther')}
                    placeholder="describe the genre..."
                    spellCheck="false"
                    autoComplete="off"
                    style={{ marginTop: '8px' }}
                  />
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Thumbnail (image URL)</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.thumbnail}
                  onChange={update('thumbnail')}
                  placeholder="optional — paste a link to a screenshot or icon"
                  spellCheck="false"
                  autoComplete="off"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Why this game?</span>
                <textarea
                  className={styles.textarea}
                  value={form.pitch}
                  onChange={update('pitch')}
                  placeholder="optional — short pitch"
                  rows={3}
                  spellCheck="false"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Your name / handle</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.name}
                  onChange={update('name')}
                  placeholder="optional"
                  spellCheck="false"
                  autoComplete="off"
                />
              </label>

              <div className={styles.actions}>
                <button type="submit" className={styles.submit}>
                  ▸ OPEN ON GITHUB
                </button>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={dismiss}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.confirm}>
            <span className={styles.confirmTag}>// SENT TO GITHUB</span>
            <h2 className={styles.title}>
              Almost <em>done.</em>
            </h2>
            <p className={styles.lead}>
              We opened your request on GitHub in a new tab. Hit the green{' '}
              <strong>Submit new issue</strong> button there to send it.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.submit}
                onClick={dismiss}
              >
                ▸ CLOSE
              </button>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => {
                  setSubmitted(false);
                  setForm(initialForm);
                }}
              >
                NEW REQUEST
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
