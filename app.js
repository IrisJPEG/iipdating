let html5QrCode = null;
let scannerRunning = false;
let scanLockUntil = 0;

const screens = {
  start: document.getElementById("screen-start"),
  camera: document.getElementById("screen-camera"),
  ghost: document.getElementById("screen-ghost"),
};

const startButton = document.getElementById("startButton");
const startOverButton = document.getElementById("startOverButton");

const personInfo = document.getElementById("personInfo");
const personName = document.getElementById("personName");
const personAge = document.getElementById("personAge");

const heartMeter = document.getElementById("heartMeter");
const heartUp = document.getElementById("heartUp");
const heartDown = document.getElementById("heartDown");
const ghostButton = document.getElementById("ghostButton");

// ----------------- UI -----------------
function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
}

// ----------------- QR Scanner -----------------
function initScanner() {
  if (html5QrCode) return;
  html5QrCode = new Html5Qrcode("qr-reader");
}

function startScanner() {
  if (!html5QrCode) initScanner();
  if (scannerRunning) return;

  html5QrCode
    .start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, onScanSuccess)
    .then(() => {
      scannerRunning = true;
    })
    .catch((err) => {
      console.error(err);
      alert("Could not start camera. Check permissions.");
    });
}

function stopScanner() {
  if (!html5QrCode || !scannerRunning) return;
  html5QrCode.stop().then(() => {
    scannerRunning = false;
  });
}

function onScanSuccess(decodedText) {
  const now = Date.now();
  if (now < scanLockUntil) return;
  scanLockUntil = now + 900;

  try {
    const data = JSON.parse(decodedText);
    if (!data.name || !data.age) throw "Invalid QR";
    showPerson(data.name, data.age);
  } catch {
    alert("QR does not contain valid person info!");
  }
}

// ----------------- Person & Heart -----------------
function showPerson(name, age) {
  stopScanner();
  personName.textContent = name;
  personAge.textContent = `Age: ${age}`;
  heartMeter.value = 50;
  personInfo.classList.remove("hidden");
}

heartUp.addEventListener("click", () => {
  heartMeter.value = Math.min(100, heartMeter.value + 10);
});

heartDown.addEventListener("click", () => {
  heartMeter.value = Math.max(0, heartMeter.value - 10);
});

ghostButton.addEventListener("click", () => {
  personInfo.classList.add("hidden");
  showScreen("ghost");
});

// ----------------- Navigation -----------------
startButton.addEventListener("click", () => {
  showScreen("camera");
  startScanner();
});

startOverButton.addEventListener("click", () => {
  showScreen("camera");
  startScanner();
});
