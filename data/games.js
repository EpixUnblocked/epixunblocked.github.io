import thumbnailMap from './thumbnails.generated';

const basePath = ''; // Required for GitHub Pages subpath

// === HOW TO ADD A GAME ==================================================
//
// Easiest path: run `npm run new:game` and answer the prompts. It scaffolds
// the folder, copies your thumbnail, and appends the entry below for you.
//
// Manual path — minimal entry, only `title` and `slug` are required:
//   { title: 'My New Game', slug: 'mynewgame' }
//
// Defaults applied automatically:
//   • thumbnail   → auto-detected from public/html/{slug}/ (any image works;
//                   thumb.png/jpg/jpeg/webp wins, otherwise first image
//                   alphabetically). Run `npm run gen:thumbnails` after adding
//                   art to refresh the map.
//   • description → ''                       (you should still write one)
//   • tags        → []
//   • new badge   → injected automatically for the LAST NEW_COUNT entries
//
// Override any default by setting the field explicitly.
//
// === TAGS ================================================================
//   Badges (status):  featured · popular · new (auto)
//   Genres:           arcade · driving · horror · idle · platformer · puzzle ·
//                     runner · shooter · simulator · sport
//
// Convention: list badges first, then genres. Add fresh games to the END.
// =========================================================================

const NEW_COUNT = 10;

const rawGames = [
  {
    title: 'Block Blast',
    slug: 'blockblast',
    description: 'Block Blast involves in matching blocks together to make specific patterns that explode with points, the more points you earn, the higher your score.',
    tags: ['featured', 'puzzle'],
  },
  {
    title: 'Poly Track',
    slug: 'polytrack',
    description: 'Polytrack is a driving game where you drive around.',
    tags: ['featured', 'driving'],
  },
  {
    title: 'Ultrakill',
    slug: 'ultrakill',
    description: 'Shoot things.',
    tags: ['featured', 'shooter'],
  },
  {
    title: 'Moto X3M',
    slug: 'motox3m',
    description: 'Moto X3M consists of multiple levels and stages where you have you get by on a motorbike, there is also a point system where you can do cool flips and tricks.',
    tags: ['popular', 'driving'],
  },
  {
    title: 'Police Chase Drifter',
    slug: 'policechasedrift',
    description: 'Drift away from the cops while collecting moneybags, the more you progress, the bigger and stronger the cop cars become, preform sick slides and drifts but just dont crash into any walls',
    tags: ['popular', 'driving'],
  },
  {
    title: 'Tiny Fishing',
    slug: 'tinyfishing',
    description: 'Hold down the middle button and release at the perfect time to reach maximum depth to catch bigger, better, cooler and more expensive fish.',
    tags: ['popular', 'arcade'],
  },
  {
    title: 'Basketball Random',
    slug: 'basketballrandom',
    description: 'You play 2d basketball where you take control of the ball, you then jump high and shoot it, there are multiple mods and features to take the experience to its highest.',
    tags: ['sport'],
  },
  {
    title: 'Soccer Random',
    slug: 'soccerrandom',
    description: 'A cool game about soccer.',
    tags: ['sport'],
  },
  {
    title: 'Wonder Rocket',
    slug: 'wonderrocket',
    description: 'A game about shooting for the stars.',
    tags: ['popular', 'idle'],
  },
  {
    title: 'Drift Boss 3D',
    slug: 'driftboss',
    description: 'A game about perfect drifts.',
    tags: ['driving'],
  },
  {
    title: 'OvO Dimensions',
    slug: 'ovo',
    description: 'The best OvO game out there.',
    tags: ['popular', 'platformer'],
  },
  {
    title: 'BitLife',
    slug: 'bitlife',
    description: 'Its Bitlife!',
    tags: ['popular', 'simulator'],
  },
  {
    title: 'Neon Swing',
    slug: 'neonswing',
    description: 'A cool swinging game where you doge obsticals.',
    tags: ['popular', 'arcade'],
  },
  {
    title: 'Fnaf Ultimate Custom Night',
    slug: 'fnafcustom',
    description: 'Survive the night!',
    tags: ['popular', 'horror'],
  },
  {
    title: 'Fireboy and Watergirl',
    slug: 'fbwg',
    description: 'A classic 2 player game.',
    tags: ['popular', 'platformer'],
  },
  {
    title: 'Fall Guys',
    slug: 'fallguys',
    description: 'Beat everyone and win the crown!',
    tags: ['platformer'],
  },
  {
    title: 'Idle Mining Tycoon',
    slug: 'idlemining',
    description: 'Become rich!',
    tags: ['popular', 'idle'],
  },
  {
    title: 'Stickman Hook',
    slug: 'stickmanhook',
    description: 'Swing to the finish line.',
    tags: ['featured', 'arcade'],
  },
  {
    title: 'Jetpack Joyride',
    slug: 'jetpack',
    description: 'Pls play me.',
    tags: ['featured', 'runner'],
  },
  {
    title: 'Level Devil',
    slug: 'leveldevil',
    description: 'Try not to rage.',
    tags: ['featured', 'puzzle'],
  },
  {
    title: 'Subway Surfers: Tokyo',
    slug: 'subwaysurf',
    description: 'Race through tokyo.',
    tags: ['featured', 'runner'],
  },
  {
    title: 'Icey Purple Head 3',
    slug: 'iceypurplehead3',
    description: 'Cool game!',
    tags: ['platformer'],
  },
  {
    title: 'We Become What We Behold',
    slug: 'wbwwb',
    description: 'A minigame about the news.',
    tags: ['puzzle'],
  },
  {
    title: 'Backrooms',
    slug: 'backrooms',
    description: 'You need to hide from a monster, and you\'re trapped in the backrooms.',
    tags: ['horror'],
  },
  {
    title: 'Super Mario Kart',
    slug: 'mariokart',
    description: 'Join multiple races!',
    tags: ['featured', 'driving'],
  },
  {
    title: 'Steal a Brainrot',
    slug: 'stealbrainrot',
    description: 'Rob brainrots from others!',
    tags: ['simulator'],
  },
  {
    title: 'Run 3',
    slug: 'run3',
    description: 'Run until the end.',
    tags: ['popular', 'runner'],
  },
  {
    title: 'Rooftop Snipers',
    slug: 'rooftopsnipers',
    description: 'Snipe people from the roof',
    tags: ['shooter'],
  },
  {
    title: 'Friday Night Funkin',
    slug: 'fnf',
    description: 'A rhythm game.',
    tags: ['popular', 'arcade'],
  },
  {
    title: 'Baldi\'s Basics',
    slug: 'baldibasic',
    description: 'Escape baldi.',
    tags: ['popular', 'horror'],
  },
  {
    title: 'Five Nights at Epsteins',
    slug: 'fnae',
    description: 'Survive the nights on Little Saint James.',
    tags: ['featured', 'popular', 'horror'],
  },
  {
    title: 'Bridge Race',
    slug: 'bridgerace',
    description: 'Gather your bricks and be the first to build your bridge.',
    tags: ['popular', 'runner'],
  },
  {
    title: 'Geometry Dash SubZero',
    slug: 'gdsubzero',
    description: 'Reach the end!',
    tags: ['platformer'],
  },
  {
    title: 'Gorilla Tag',
    slug: 'gorillatag',
    description: 'Tag other people and climb.',
    tags: ['popular', 'arcade'],
  },
  {
    title: 'Effing Zombies',
    slug: 'effingzombies',
    description: 'Kill the zombies with guns and grenades.',
    tags: ['shooter'],
  },
  {
    title: 'Eggy Car',
    slug: 'eggycar',
    description: 'Make sure the egg doesn\'t crack.',
    tags: ['featured', 'popular', 'driving'],
  },
  {
    title: 'Pokemon Emerald',
    slug: 'pokemonemerald',
    description: 'Play in trainer battles and upgrade your pokemon!',
    tags: ['popular', 'simulator'],
  },
  {
    title: 'GachaVerse',
    slug: 'gachaverse',
    description: 'GachaVerse is a gacha game where you can collect characters and items, there are also multiple game modes to play in.',
    tags: ['simulator'],
  },
  {
    title: 'Airline Tycoon Idle',
    slug: 'airlineidle',
    description: 'Build and manage your own airline!',
    tags: ['idle'],
  },
  {
    title: 'Grow a Garden',
    slug: 'growagarden',
    description: 'Grow your garden and watch it flourish!',
    tags: ['idle'],
  },
  {
    title: 'Granny',
    slug: 'granny',
    description: 'Survive Grannys house',
    tags: ['horror', 'popular'],
  },
  {
    title: 'Slope',
    slug: 'slope3',
    description: 'Survive the slopes',
    tags: ['popular', 'runner'],
  },
  {
    title: 'Slither.io',
    slug: 'slitherio',
    description: 'Eat pellets, grow big, and avoid other snakes in this addictive multiplayer game.',
    tags: ['popular', 'arcade'],
  },
  {
    title: "Grand Shift Auto",
    slug: "grandshiftauto",
    description: "A game about granding and shifting",
    tags: ['arcade'],
  },
  {
    title: "Half Life",
    slug: "halflife",
    description: "It's half life, a FPS shooter developed by Valve.",
    tags: ['popular', 'shooter'],
  },
  {
    title: "Hole io",
    slug: "holeio",
    description: "Suck everything into your hole!",
    tags: ['arcade'],
  },
  {
    title: "Idle Football Manager",
    slug: "idlefootballmanager",
    description: "Manage your own football club!",
    tags: ['idle'],
  },
  {
    title: "Indian Truck Simulator",
    slug: "indiantrucksimulator",
    description: "Drive trucks in india!",
    tags: ['driving', 'simulator'],
  },
];

// Build the final games list:
//   1. Apply field defaults (thumbnail, description, tags) for any entry
//      that omits them.
//   2. Inject the 'new' badge for the last NEW_COUNT entries.
const newSlugs = new Set(rawGames.slice(-NEW_COUNT).map((g) => g.slug));
const BADGES = new Set(['featured', 'popular']);

const games = rawGames.map((raw) => {
  const autoThumb = thumbnailMap[raw.slug];
  const g = {
    description: '',
    tags: [],
    thumbnail: autoThumb
      ? `${basePath}${autoThumb}`
      : `${basePath}/html/${raw.slug}/thumb.png`,
    ...raw,
  };
  if (!newSlugs.has(g.slug)) return g;
  const existingBadges = g.tags.filter((t) => BADGES.has(t));
  const genres = g.tags.filter((t) => !BADGES.has(t) && t !== 'new');
  return { ...g, tags: [...existingBadges, 'new', ...genres] };
});

export default games;
