#!/usr/bin/env node
// scripts/generate-sitemap.js
//
// Emits public/sitemap.xml listing every public route on the site:
// home, privacy, terms, and one entry per game. Wired into prebuild
// alongside gen:thumbnails so the sitemap stays current with games.js.

const fs = require('node:fs');
const path = require('node:path');

const SITE_URL = 'https://epixunblocked.github.io';
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');
const GAMES_FILE = path.join(ROOT, 'data', 'games.js');

const text = fs.readFileSync(GAMES_FILE, 'utf8');
const start = text.indexOf('const rawGames = [');
const end = text.indexOf('];', start);
const body = start >= 0 && end > start ? text.slice(start, end) : text;
const slugs = [...body.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${SITE_URL}/privacy`, priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE_URL}/terms`, priority: '0.3', changefreq: 'yearly' },
  ...slugs.map((s) => ({
    loc: `${SITE_URL}/games/${s}`,
    priority: '0.8',
    changefreq: 'weekly',
  })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) =>
    [
      '  <url>',
      `    <loc>${u.loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(OUT, xml, 'utf8');
console.log(`sitemap: wrote ${urls.length} urls -> ${path.relative(ROOT, OUT)}`);
