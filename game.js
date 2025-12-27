let currentUser = null;

async function loginWithPi() {
  try {
    const auth = await Pi.authenticate(
      ["username", "payments"],
      onIncompletePaymentFound
    );

    currentUser = auth.user;
    document.getElementById("username").innerText = currentUser.username;

  } catch (err) {
    alert("Pi login failed");
    console.error(err);
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
window.onload = () => {
  loginWithPi();
};

