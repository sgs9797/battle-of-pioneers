const grid = document.getElementById("grid");

function payEntry() {
  // Placeholder for Pi payment
  document.getElementById("entry").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadGrid();
}

function loadGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 36; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }
}
