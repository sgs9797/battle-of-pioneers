let currentUser = null;
const GRID_SIZE = 6;
const TOTAL_SHIPS = 5;
const shipQueue = [
  "Carrier",
  "Battleship",
  "Destroyer",
  "Submarine",
  "Cruiser"
];

let currentShipIndex = 0;
let playerHits = 0;
let enemyHitsCount = 0;

let placedShips = [];
let shipsRemaining = TOTAL_SHIPS;
let placementMode = true;
let placementLocked = false;
let currentShip = null;
let currentShipSize = 0;
let playerShips = [];
let playerHits = [];
let enemyShipCount = TOTAL_SHIPS;
let enemyShips = [];
let enemyHits = [];
let enemyAttacks = [];
let playerTurn = true;

function selectShip(name, size) {
  currentShip = name;
  currentShipSize = size;

  document.getElementById("selectedShip").innerText =
    "Selected ship: " + name + " (" + size + ")";
}

async function loginWithPi() {
  try {
    const auth = await Pi.authenticate(
      ["username"],
      function (payment) {
        console.log("Incomplete payment found", payment);
      }
    );

    document.getElementById("username").innerText =
      auth.user.username;

    alert("Logged in as " + auth.user.username);
  } catch (err) {
    console.error(err);
    alert("Pi login failed. Please open via Pi Sandbox.");
  }
}

function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found", payment);
}


function payEntry() {
  // Placeholder for Pi payment
  document.getElementById("entry").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadGrid();
}

function loadGrid() {
  const grid = document.getElementById("grid");
    grid.innerHTML = "";

    document.getElementById("shipCount").innerText =
        "Ships remaining: " + shipsRemaining;

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        cell.onclick = () => handlePlacement(i, cell);
      cell.dataset.hasShip = placedShips.includes(i) ? "true" : "false";
        grid.appendChild(cell);
    }
}
function loadEnemyGrid() {
  const enemyGrid = document.getElementById("enemyGrid");
  enemyGrid.innerHTML = "";

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => attackEnemy(i, cell);
    enemyGrid.appendChild(cell);
  }
}
function placeEnemyShips() {
  enemyShips = [];

  while (enemyShips.length < TOTAL_SHIPS) {
    const pos = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
    if (!enemyShips.includes(pos)) {
      enemyShips.push(pos);
    }
  }

  console.log("Enemy ships (hidden):", enemyShips);
}
function attackEnemy(index, cell) {
  if (!playerTurn || placementMode) return;
  if (enemyHits.includes(index)) return;

  enemyHits.push(index);

  if (enemyShips.includes(index)) {
    cell.classList.add("hit");
    enemyHitsCount++;
    document.getElementById("statusMsg").innerText =
      "💥 Hit! Enemy ship damaged.";
  } else {
    cell.classList.add("miss");
    document.getElementById("statusMsg").innerText =
      "🌊 Miss! Empty waters.";
  }

  // ✅ WIN CHECK — EXACT PLACE
  if (enemyHitsCount === TOTAL_SHIPS) {
    document.getElementById("statusMsg").innerText =
      "🏆 Victory! Enemy fleet destroyed!";
    endGame();
    return;
  }

  playerTurn = false;
  setTimeout(enemyTurn, 800);
}
function enterWarzone() {
  placementMode = false;
  placementLocked = true;
  playerTurn = true;

  document.getElementById("statusMsg").innerText =
    "⚔️ Battle started! Attack enemy waters.";

  loadEnemyGrid();
  placeEnemyShips();
}
function enemyTurn() {
  if (playerTurn) return;

  let target;
  do {
    target = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
  } while (enemyAttacks.includes(target));

  enemyAttacks.push(target);

  const cells = document.querySelectorAll("#grid .cell");
  const cell = cells[target];

  if (cell.dataset.hasShip === "true") {
    cell.style.backgroundColor = "red";
    playerHits++;
    document.getElementById("statusMsg").innerText =
      "💥 Enemy HIT your ship!";
  } else {
    cell.style.backgroundColor = "#aaa";
    document.getElementById("statusMsg").innerText =
      "🌊 Enemy missed!";
  }

  // ✅ LOSE CHECK — EXACT PLACE
  if (playerHits === TOTAL_SHIPS) {
    document.getElementById("statusMsg").innerText =
      "💀 Defeat! Your fleet has been destroyed.";
    endGame();
    return;
  }

  playerTurn = true;
}
function endGame() {
  placementLocked = true;
  placementMode = false;
  playerTurn = false;

  // Disable enemy grid
  document.querySelectorAll("#enemyGrid .cell").forEach(cell => {
    cell.onclick = null;
    cell.style.cursor = "not-allowed";
  });

  // Disable player grid
  document.querySelectorAll("#grid .cell").forEach(cell => {
    cell.onclick = null;
  });
}
function handlePlacement(index, cell) {
  if (!placementMode || placementLocked) return;

  if (placedShips.includes(index)) {
    alert("A ship is already deployed here!");
    return;
  }

  if (currentShipIndex >= shipQueue.length) {
    alert("All ships deployed!");
    placementMode = false;
    return;
  }

  const shipName = shipQueue[currentShipIndex];

  placedShips.push(index);
cell.style.backgroundColor = "#ff7043";
cell.dataset.hasShip = "true";   // ✅ REQUIRED
  
  shipsRemaining--;
  currentShipIndex++;

  document.getElementById("shipCount").innerText =
    "Ships remaining: " + shipsRemaining;

  document.getElementById("statusMsg").innerText =
    `🛳️ Your ${shipName} is reporting for duty!`;

  if (shipsRemaining === 0) {
  placementMode = false;

  document.getElementById("statusMsg").innerText =
    "✅ All ships deployed! Enter the warzone.";

  document.getElementById("enterWarzoneBtn").style.display = "inline-block";
}
}
function resetGame() {
  // Reset core state
  placedShips = [];
  shipsRemaining = TOTAL_SHIPS;
  currentShipIndex = 0;   // ✅ CRITICAL FIX
  placementMode = true;
  placementLocked = false;
    // 🔁 FIX 5: Reset enemy & turn state
  enemyShips = [];
  enemyHits = [];
  enemyAttacks = [];
  playerTurn = true;

  playerHits = 0;
enemyHitsCount = 0;


  // Reset UI text
  document.getElementById("shipCount").innerText =
    "Ships remaining: " + shipsRemaining;
  document.getElementById("statusMsg").innerText =
    "Click on the grid to deploy ships";
  document.getElementById("enterWarzoneBtn").style.display = "none";
document.getElementById("boardTitle").innerText = "Placement Board";

  // Rebuild grid
  loadGrid();
  document.getElementById("enemyGrid").innerHTML = "";
}


























