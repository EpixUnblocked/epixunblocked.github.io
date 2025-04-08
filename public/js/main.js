const games = [
  { title: "Dino Game", image: "assets/dino.png", url: "games/dino/index.html" },
  { title: "2048", image: "assets/2048.png", url: "games/2048/index.html" }
];

function loadGames() {
  const list = document.getElementById("game-list");
  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}" />
      <h3>${game.title}</h3>
      <a href="${game.url}" class="button">Play</a>
    `;
    list.appendChild(card);
  });
}

window.onload = loadGames;
