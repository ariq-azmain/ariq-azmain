
// === Countdown Timer for the Mission ===
let countdownTime = 5 * 60; // 5 minutes in seconds
let timerInterval;
const display = document.getElementById('countdownDisplay');
const startButton = document.getElementById('startButton');
const abortButton = document.getElementById('abortButton');
const missionLog = document.getElementById('missionLog');

function updateDisplay() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startButton.addEventListener('click', function() {
    if (timerInterval) {
clearInterval(timerInterval);
    }
    countdownTime = 5 * 60; // Reset to 5 minutes
    updateDisplay();
    missionLog.textContent = "Mission launched! Engines fired. Good luck, astronaut!";
    startButton.disabled = true;
    abortButton.disabled = false;

    timerInterval = setInterval(() => {
countdownTime--;
updateDisplay();

// Random mission events
if (countdownTime === 4 * 60) {
    missionLog.textContent = "Mission Control: You're passing the Moon. Wave hello!";
}
if (countdownTime === 3 * 60) {
    missionLog.textContent = "Alert: Minor turbulence in the asteroid belt. Space snacks spilled!";
}
if (countdownTime === 90) {
    missionLog.textContent = "Halfway there! Time to watch a movie. May we suggest 'Gravity'?";
}
if (countdownTime === 30) {
    missionLog.textContent = "Approaching Europa. Ice geysers detected. It's beautiful!";
}

if (countdownTime <= 0) {
    clearInterval(timerInterval);
    missionLog.textContent = "🎉 Mission Successful! You've landed on Europa. Now... how do we get back?";
    startButton.disabled = false;
    abortButton.disabled = true;
}
    }, 100); // Speed up for demo (100ms = 0.1s per second)
});

abortButton.addEventListener('click', function() {
    clearInterval(timerInterval);
    missionLog.textContent = "Mission aborted. Turning the ship around. Earth's Wi-Fi awaits.";
    display.textContent = "ABORT";
    startButton.disabled = false;
    abortButton.disabled = true;
});

// Initialize display
updateDisplay();
    </scrip>