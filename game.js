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

let placedShips = [];
let shipsRemaining = TOTAL_SHIPS;
let placementMode = true;
let placementLocked = false;
let currentShip = null;
let currentShipSize = 0;

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
const grid = document.getElementById("grid");

function payEntry() {
  // Placeholder for Pi payment
  document.getElementById("entry").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadGrid();
}

function loadGrid() {
    grid.innerHTML = "";

    document.getElementById("shipCount").innerText =
        "Ships remaining: " + shipsRemaining;

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        cell.onclick = () => handlePlacement(i, cell);

        grid.appendChild(cell);
    }
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

  shipsRemaining--;
  currentShipIndex++;

  document.getElementById("shipCount").innerText =
    "Ships remaining: " + shipsRemaining;

  document.getElementById("statusMsg").innerText =
    `🛳️ Your ${shipName} is reporting for duty!`;

  if (shipsRemaining === 0) {
  placementMode = false;
  placementLocked = true;

  document.getElementById("statusMsg").innerText =
    "✅ All ships deployed! Ready for battle.";
}
}
function resetGame() {
  // Reset core state
  placedShips = [];
  shipsRemaining = TOTAL_SHIPS;
  currentShipIndex = 0;   // ✅ CRITICAL FIX
  placementMode = true;
  placementLocked = false;

  // Reset UI text
  document.getElementById("shipCount").innerText =
    "Ships remaining: " + shipsRemaining;
  document.getElementById("statusMsg").innerText =
    "Click on the grid to deploy ships";

  // Rebuild grid
  loadGrid();
}
















