// data/tags.js
// Shared tag vocabulary used by the request form and the new-game CLI.
// Two categories:
//   • BADGES — status flags styled distinctly on the grid (`new` is auto-injected
//     for the most-recent NEW_COUNT entries; do not set it by hand).
//   • GENRES — content categories. The system accepts any string as a tag, but
//     keep new ones intentional so the dynamic category bar stays clean.

export const BADGES = ['featured', 'popular'];

export const GENRES = [
  'arcade',
  'driving',
  'horror',
  'idle',
  'platformer',
  'puzzle',
  'rhythm',
  'runner',
  'shooter',
  'simulator',
  'sport',
];

export const ALL_SUGGESTED_TAGS = [...BADGES, ...GENRES];
