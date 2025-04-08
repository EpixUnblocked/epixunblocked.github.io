
const games = [
  { title: "2048", url: "games/2048.html", category: "puzzle" },
  { title: "Tetris", url: "games/tetris.html", category: "classic" },
  { title: "Snake", url: "games/snake.html", category: "arcade" }
];

let currentUser = null;

function displayGames(filter = "") {
  const list = document.getElementById("games-list");
  const category = document.getElementById("category-select").value;
  list.innerHTML = "";
  games.filter(game => {
    const matchesTitle = game.title.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === "all" || game.category === category;
    return matchesTitle && matchesCategory;
  }).forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = \`
      <h3>\${game.title}</h3>
      <a href="\${game.url}" target="_blank">Play</a>
      <button onclick="likeGame('\${game.title}')">👍</button>
      <button onclick="favGame('\${game.title}')">⭐</button>
    \`;
    list.appendChild(div);
  });
}

function filterGames() {
  const search = document.getElementById("search-bar").value;
  displayGames(search);
}

function toggleLogin() {
  document.getElementById("auth-section").style.display = "block";
}

function toggleSignup() {
  document.getElementById("auth-section").style.display = "block";
}

function toggleAuth() {
  document.getElementById("auth-section").style.display = "none";
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  currentUser = { username: user };
  alert("Logged in as " + user);
  toggleAuth();
}

function signup() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  currentUser = { username: user };
  alert("Signed up and logged in as " + user);
  toggleAuth();
}

function likeGame(title) {
  if (!currentUser) return alert("Login required to like games.");
  alert(\`You liked \${title}\`);
}

function favGame(title) {
  if (!currentUser) return alert("Login required to favorite games.");
  alert(\`You favorited \${title}\`);
}

displayGames();
