let currentUser = null;

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
  for (let i = 0; i < 36; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }
}




