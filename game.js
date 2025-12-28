let currentUser = null;
const GRID_SIZE = 6;
const TOTAL_SHIPS = 5;

let placedShips = [];
let shipsRemaining = TOTAL_SHIPS;
let placementMode = true;

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

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    cell.onclick = () => handlePlacement(i, cell);

    grid.appendChild(cell);
  }
}

function handlePlacement(index, cell) {
  if (!placementMode) return;

  if (placedShips.includes(index)) {
    alert("Ship already placed here!");
    return;
  }

  if (shipsRemaining === 0) {
    alert("All ships placed!");
    placementMode = false;
    return;
  }

  placedShips.push(index);
  shipsRemaining--;

  cell.style.backgroundColor = "#ff7043";

  document.getElementById("shipCount").innerText =
    "Ships remaining: " + shipsRemaining;

  if (shipsRemaining === 0) {
    alert("All ships placed! Ready for battle.");
    placementMode = false;
  }
}






