// components/LegalPage.js — shared chrome for Privacy / Terms pages

import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/LegalPage.module.css';

export default function LegalPage({
  pageTitle,
  docTitle,
  docTitleAccent,
  stamp,
  fileLabel,
  lastUpdated,
  sections,
  description,
  canonicalPath,
}) {
  const SITE_URL = 'https://epixunblocked.github.io';
  const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  const desc =
    description ||
    `${docTitle} for Epix Unblocked — last updated ${lastUpdated}.`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={desc} />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={desc} />
        {canonical && <meta property="og:url" content={canonical} />}
      </Head>

      <div className={styles.shell}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backBtn} aria-label="Back to Epix">
            ◀ BACK TO EPIX
          </Link>
          <span className={styles.meta}>
            <strong>EPIX</strong> // {fileLabel}
          </span>
        </div>

        <article className={styles.doc}>
          <span className={styles.docStamp}>{stamp}</span>
          <span className={styles.docFile}>{fileLabel}</span>

          <h1 className={styles.docTitle}>
            {docTitleAccent ? (
              <>
                {docTitle.replace(docTitleAccent, '').trim()}{' '}
                <em>{docTitleAccent}</em>
              </>
            ) : (
              docTitle
            )}
          </h1>

          <p className={styles.docLead}>
            <strong>Last updated</strong> // {lastUpdated}
          </p>

          {sections.map((s, i) => (
            <section className={styles.section} key={i}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
              </div>
              {s.body.map((b, j) =>
                Array.isArray(b) ? (
                  <ul key={j}>
                    {b.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j}>{b}</p>
                )
              )}
            </section>
          ))}

          <div className={styles.signoff}>
            <span>
              // <strong>END OF DOCUMENT</strong> // FILED UNDER {fileLabel}
            </span>
            <span>© {new Date().getFullYear()} EPIX</span>
          </div>
        </article>
      </div>
    </>
  );
}
