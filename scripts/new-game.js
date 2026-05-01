#!/usr/bin/env node
// scripts/new-game.js
//
// Scaffolds a new game in one shot:
//   • Creates public/html/<slug>/
//   • Copies a thumbnail in (any image filename works — auto-discovered later)
//   • Optionally copies a source HTML file or a whole build folder
//   • Appends an entry to data/games.js
//   • Refreshes data/thumbnails.generated.js
//
// Interactive: `npm run new:game`
// Flag mode:   node scripts/new-game.js --title "Foo" --slug foo \
//                --description "..." --tags featured,puzzle \
//                --thumb ./foo.png --from ./foo-build/

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { spawnSync } = require('node:child_process');
const { parseArgs } = require('node:util');

const ROOT = path.resolve(__dirname, '..');
const HTML_DIR = path.join(ROOT, 'public', 'html');
const GAMES_FILE = path.join(ROOT, 'data', 'games.js');
const TAGS_FILE = path.join(ROOT, 'data', 'tags.js');
const GEN_SCRIPT = path.join(__dirname, 'generate-thumbnail-map.js');

// Pulls the suggested-tag list out of data/tags.js by reading the source.
// Avoids ESM/CJS interop (the project doesn't declare "type": "module").
function loadSuggestedTags() {
  const text = fs.readFileSync(TAGS_FILE, 'utf8');
  const pull = (name) => {
    const m = text.match(new RegExp(`export const ${name}\\s*=\\s*\\[([^\\]]*)\\]`));
    if (!m) return [];
    return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  };
  return [...pull('BADGES'), ...pull('GENRES')];
}

const { values: flags } = parseArgs({
  options: {
    title:       { type: 'string' },
    slug:        { type: 'string' },
    description: { type: 'string' },
    tags:        { type: 'string' },
    thumb:       { type: 'string' },
    from:        { type: 'string' },
    help:        { type: 'boolean', short: 'h' },
  },
  strict: true,
});

if (flags.help) {
  console.log(`
Usage: node scripts/new-game.js [flags]

  --title         Game title (required, prompted if omitted)
  --slug          URL slug (default: derived from title)
  --description   Short description
  --tags          Comma-separated tags (e.g. featured,puzzle)
  --thumb         Path to a local image to copy in as the thumbnail
  --from          Path to a file or directory to copy into the slug folder
  -h, --help      Show this help

Run with no flags for interactive mode.
`);
  process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a.trim())));
const has = (v) => typeof v === 'string' && v.length > 0;

function deriveSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function readGamesFile() {
  return fs.readFileSync(GAMES_FILE, 'utf8');
}

function existingSlugs(text) {
  // Pull slugs only from object literals inside `rawGames` so the example
  // in the comment block doesn't count.
  const start = text.indexOf('const rawGames = [');
  const end = text.indexOf('];', start);
  const body = start >= 0 && end > start ? text.slice(start, end) : text;
  return new Set([...body.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]));
}

function copyThumbnail(srcPath, slugDir) {
  const ext = path.extname(srcPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    throw new Error(`thumbnail must be .png/.jpg/.jpeg/.webp (got "${ext}")`);
  }
  const dest = path.join(slugDir, `thumb${ext}`);
  fs.copyFileSync(srcPath, dest);
  return dest;
}

function copySource(srcPath, slugDir) {
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    fs.cpSync(srcPath, slugDir, { recursive: true });
  } else {
    // single file — assume it's the game's index.html unless named otherwise
    const destName = path.basename(srcPath);
    fs.copyFileSync(srcPath, path.join(slugDir, destName));
  }
}

function formatEntry({ title, slug, description, tags }) {
  const lines = [`    title: ${JSON.stringify(title)}`];
  lines.push(`    slug: ${JSON.stringify(slug)}`);
  if (has(description)) lines.push(`    description: ${JSON.stringify(description)}`);
  if (tags && tags.length) {
    lines.push(`    tags: [${tags.map((t) => `'${t}'`).join(', ')}]`);
  }
  return `  {\n${lines.join(',\n')},\n  },`;
}

function appendEntry(text, entry) {
  const start = text.indexOf('const rawGames = [');
  if (start < 0) throw new Error('could not locate rawGames in data/games.js');
  const end = text.indexOf('];', start);
  if (end < 0) throw new Error('could not locate end of rawGames in data/games.js');
  // Insert just before the closing `];`. Trim trailing whitespace so the
  // file stays tidy.
  const before = text.slice(0, end).replace(/\s*$/, '\n');
  const after = text.slice(end);
  return `${before}${entry}\n${after}`;
}

async function main() {
  console.log('\n→ new game\n');

  const SUGGESTED_TAGS = loadSuggestedTags();
  const text = readGamesFile();
  const existing = existingSlugs(text);

  // 1. title
  let title = flags.title;
  if (!has(title)) title = await ask('title: ');
  if (!has(title)) throw new Error('title is required');

  // 2. slug
  let slug = flags.slug;
  if (!has(slug)) {
    const suggested = deriveSlug(title);
    const ans = await ask(`slug [${suggested}]: `);
    slug = has(ans) ? ans : suggested;
  }
  if (!/^[a-z0-9]+$/.test(slug)) {
    throw new Error(`slug must be lowercase alphanumeric only — got "${slug}"`);
  }
  if (existing.has(slug)) {
    throw new Error(`slug "${slug}" already exists in data/games.js`);
  }

  const slugDir = path.join(HTML_DIR, slug);
  if (fs.existsSync(slugDir)) {
    throw new Error(`folder already exists: public/html/${slug}/`);
  }

  // 3. description
  let description = flags.description;
  if (description === undefined) {
    description = await ask('description (optional): ');
  }

  // 4. tags
  let tagsInput = flags.tags;
  if (tagsInput === undefined) {
    console.log(`  suggested: ${SUGGESTED_TAGS.join(', ')}`);
    tagsInput = await ask('tags (comma-separated, optional): ');
  }
  const tags = (tagsInput || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((t) => t !== 'new'); // 'new' badge is auto-injected

  const unknown = tags.filter((t) => !SUGGESTED_TAGS.includes(t));
  if (unknown.length) {
    console.log(`  note: unknown tags will create new categories — ${unknown.join(', ')}`);
  }

  // 5. thumbnail
  let thumbPath = flags.thumb;
  if (thumbPath === undefined) {
    thumbPath = await ask('path to thumbnail image (optional): ');
  }

  // 6. source files
  let sourcePath = flags.from;
  if (sourcePath === undefined) {
    sourcePath = await ask('path to game file or build folder (optional): ');
  }

  rl.close();

  // === act ===
  fs.mkdirSync(slugDir, { recursive: true });
  console.log(`  ✓ created public/html/${slug}/`);

  if (has(thumbPath)) {
    const resolved = path.resolve(thumbPath);
    if (!fs.existsSync(resolved)) throw new Error(`thumbnail not found: ${thumbPath}`);
    const dest = copyThumbnail(resolved, slugDir);
    console.log(`  ✓ copied thumbnail → ${path.relative(ROOT, dest)}`);
  }

  if (has(sourcePath)) {
    const resolved = path.resolve(sourcePath);
    if (!fs.existsSync(resolved)) throw new Error(`source not found: ${sourcePath}`);
    copySource(resolved, slugDir);
    console.log(`  ✓ copied source → public/html/${slug}/`);
  }

  const entry = formatEntry({ title, slug, description, tags });
  fs.writeFileSync(GAMES_FILE, appendEntry(text, entry), 'utf8');
  console.log(`  ✓ appended entry to data/games.js`);

  const gen = spawnSync(process.execPath, [GEN_SCRIPT], { stdio: 'inherit' });
  if (gen.status !== 0) {
    console.warn('  ! gen:thumbnails failed; run `npm run gen:thumbnails` manually');
  }

  console.log(`\nNext:`);
  if (!has(sourcePath)) {
    console.log(`  • drop your index.html into public/html/${slug}/`);
  }
  console.log(`  • npm run dev → visit /games/${slug}\n`);
}

main().catch((err) => {
  rl.close();
  console.error(`\n✗ ${err.message}\n`);
  process.exit(1);
});
