// ---------- STATE ----------
let html5QrCode = null;
let scannerRunning = false;
let scanLockUntil = 0;

let love = 50;
let currentPerson = null;

// ---------- DOM ----------
const screens = {
  start: document.getElementById("screen-start"),
  game: document.getElementById("screen-game"),
};

const startButton = document.getElementById("startButton");
const toastArea = document.getElementById("toastArea");

const topBar = document.getElementById("topBar");
const nameEl = document.getElementById("currentName");
const loveEl = document.getElementById("loveMeter");

const controlsPanel = document.getElementById("controlsPanel");
const ghostedPanel = document.getElementById("ghostedPanel");
const ghostOverlay = document.getElementById("ghostOverlay");

const loveUpBtn = document.getElementById("loveUp");
const loveDownBtn = document.getElementById("loveDown");
const ghostBtn = document.getElementById("ghostBtn");
const startOverBtn = document.getElementById("startOver");

// ---------- SCREEN ----------
function showScreen(name) {
  Object.values(screens).forEach(el =>
    el.classList.remove("screen--active")
  );
  screens[name].classList.add("screen--active");
}

// ---------- TOAST ----------
function showToast(text, time = 1500) {
  toastArea.innerHTML = `<div class="toast">${text}</div>`;
  setTimeout(() => toastArea.innerHTML = "", time);
}

// ---------- CAMERA ----------
function initScanner() {
  if (html5QrCode) return;
  html5QrCode = new Html5Qrcode("qr-reader");
}

function startScanner() {
  if (scannerRunning) return;
  initScanner();

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScan
  ).then(() => scannerRunning = true);
}

function stopScanner() {
  if (!scannerRunning) return;
  html5QrCode.stop().then(() => scannerRunning = false);
}

// ---------- QR ----------
function onScan(text) {
  const now = Date.now();
  if (now < scanLockUntil) return;
  scanLockUntil = now + 800;

  const [name, age] = text.split("|");

  currentPerson = name;
  nameEl.textContent = `${name}, ${age} y.o.`;
  showToast(`Age: ${age}`);

  topBar.classList.remove("hidden");
  controlsPanel.classList.remove("hidden");
}

// ---------- GAME ----------
function changeLove(v) {
  love = Math.max(0, Math.min(100, love + v));
  loveEl.textContent = love;
}

// ---------- GHOST ----------
function ghost() {
  stopScanner();
  ghostOverlay.classList.remove("hidden");
  controlsPanel.classList.add("hidden");
  topBar.classList.add("hidden");
  ghostedPanel.classList.remove("hidden");
}

// ---------- RESET ----------
function resetGame() {
  love = 50;
  loveEl.textContent = love;
  nameEl.textContent = "";
  currentPerson = null;

  ghostOverlay.classList.add("hidden");
  ghostedPanel.classList.add("hidden");
  controlsPanel.classList.add("hidden");
  topBar.classList.add("hidden");

  startScanner();
}

// ---------- EVENTS ----------
startButton.addEventListener("click", () => {
  showScreen("game");
  resetGame();
});

loveUpBtn.addEventListener("click", () => changeLove(10));
loveDownBtn.addEventListener("click", () => changeLove(-10));
ghostBtn.addEventListener("click", ghost);
startOverBtn.addEventListener("click", resetGame);
