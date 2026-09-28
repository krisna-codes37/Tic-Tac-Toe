const cells = document.querySelectorAll(".cell");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let aiThinking = false;
let aiTimer = null;

let scoreX = Number(localStorage.getItem("scoreX")) || 0;
let scoreO = Number(localStorage.getItem("scoreO")) || 0;
let roundNo = Number(localStorage.getItem("roundNo")) || 1;
let startingPlayer = localStorage.getItem("startingPlayer") || "X";
let lastWinners = loadLastWinners();

const wins = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6],
];

function loadLastWinners() {
const raw = localStorage.getItem("lastWinners");
try {
const parsed = JSON.parse(raw || "[]");
return Array.isArray(parsed) ? parsed : [];
} catch {
return [];
}
}

function saveState() {
localStorage.setItem("scoreX", scoreX);
localStorage.setItem("scoreO", scoreO);
localStorage.setItem("roundNo", roundNo);
localStorage.setItem("startingPlayer", startingPlayer);
localStorage.setItem("lastWinners", JSON.stringify(lastWinners));
}

function updateUI() {
document.getElementById("scoreX").textContent = scoreX;
document.getElementById("scoreO").textContent = scoreO;
document.getElementById("roundNo").textContent = roundNo;
}

function updateStatus(text) {
const status = document.getElementById("status");
if (text) status.textContent = text;
else status.textContent = gameActive ? `${currentPlayer}'s turn` : 'Press Start';
}

function playTone(frequency = 440, length = 0.12) {
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gain = audioContext.createGain();

oscillator.type = 'triangle';
oscillator.frequency.value = frequency;
gain.gain.setValueAtTime(0.12, audioContext.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + length);

oscillator.connect(gain);
gain.connect(audioContext.destination);
oscillator.start();
oscillator.stop(audioContext.currentTime + length);
}

function playSound(elementId, fallbackFreq) {
const audio = document.getElementById(elementId);
if (audio && audio.src) {
audio.currentTime = 0;
audio.play().catch(() => playTone(fallbackFreq));
} else {
playTone(fallbackFreq);
}
}

function showPopup(id) {
document.getElementById(id).classList.remove('hidden');
}

function hidePopup(id) {
document.getElementById(id).classList.add('hidden');
}

function appendWinnerHistory(name) {
const entry = { name, date: new Date().toLocaleDateString() };
lastWinners.unshift(entry);
lastWinners = lastWinners.slice(0, 5);
saveState();
}

function renderHistory() {
const list = document.getElementById('winnerList');
list.innerHTML = '';
if (lastWinners.length === 0) {
list.innerHTML = '<li>No winners yet</li>';
return;
}
lastWinners.forEach((item) => {
const li = document.createElement('li');
li.textContent = `${item.name} — ${item.date}`;
list.appendChild(li);
});
}

function finishTournament(winnerMark) {
const winnerName = winnerMark === 'X' ? document.getElementById('nameX').textContent : document.getElementById('nameO').textContent;
appendWinnerHistory(winnerName);
saveState();
updateStatus(`${winnerName} wins the tournament!`);
document.getElementById('winnerMessage').textContent = `${winnerName} is the tournament champion! Congratulations!`;
showPopup('winnerPopup');
}

function checkTournamentEnd() {
const target = Number(document.getElementById('tournament').value) || 3;
const threshold = Math.ceil(target / 2);
if (scoreX >= threshold) {
gameActive = false;
finishTournament('X');
return true;
}
if (scoreO >= threshold) {
gameActive = false;
finishTournament('O');
return true;
}
return false;
}

function switchTurn() {
currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function resetBoard(keepActive = true) {
clearTimeout(aiTimer);
aiTimer = null;
aiThinking = false;
board = Array(9).fill("");
cells.forEach((c) => {
c.textContent = "";
c.classList.remove("x", "o", "winner");
});
currentPlayer = startingPlayer;
gameActive = !!keepActive;
updateStatus(gameActive ? `${currentPlayer} starts` : 'Press Start');

if (gameActive && document.getElementById("gameMode").value === "ai" && currentPlayer === "O") {
setTimeout(aiMove, 300);
}
}

function aiMove() {
if (!gameActive || currentPlayer !== "O" || aiThinking) return;
const move = chooseAiMove();
if (move === null) return;
aiThinking = true;
aiTimer = setTimeout(() => {
aiThinking = false;
aiTimer = null;
if (gameActive && currentPlayer === "O") playMove(move, true);
}, 260);
}

function findWinningMove(mark) {
for (let index = 0; index < board.length; index += 1) {
if (board[index] !== "") continue;
board[index] = mark;
const winsHere = checkWinner() !== null;
board[index] = "";
if (winsHere) return index;
}
return null;
}

function minimax(mark, depth) {
const winner = checkWinner();
if (winner) return board[winner[0]] === "O" ? 10 - depth : depth - 10;
if (!board.includes("")) return 0;

const scores = [];
for (let index = 0; index < board.length; index += 1) {
if (board[index] !== "") continue;
board[index] = mark;
scores.push(minimax(mark === "O" ? "X" : "O", depth + 1));
board[index] = "";
}
return mark === "O" ? Math.max(...scores) : Math.min(...scores);
}

function chooseAiMove() {
const difficulty = document.getElementById("difficulty").value;
const empty = board.map((value, index) => value === "" ? index : null).filter((index) => index !== null);
if (empty.length === 0) return null;
if (difficulty === "easy") return empty[Math.floor(Math.random() * empty.length)];

const winningMove = findWinningMove("O");
if (winningMove !== null) return winningMove;
const blockingMove = findWinningMove("X");
if (blockingMove !== null) return blockingMove;
if (difficulty === "hard") return empty[Math.floor(Math.random() * empty.length)];

let bestScore = -Infinity;
let bestMoves = [];
empty.forEach((index) => {
board[index] = "O";
const score = minimax("X", 1);
board[index] = "";
if (score > bestScore) {
bestScore = score;
bestMoves = [index];
} else if (score === bestScore) {
bestMoves.push(index);
}
});
return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function checkWinner() {
for (let combo of wins) {
const [a, b, c] = combo;
if (board[a] && board[a] === board[b] && board[b] === board[c]) {
return combo;
}
}
return null;
}

function playMove(index, isAiMove = false) {
index = Number(index);
if (isNaN(index) || board[index] !== "" || !gameActive || aiThinking && !isAiMove) return;
if (document.getElementById("gameMode").value === "ai" && currentPlayer === "O" && !isAiMove) return;

board[index] = currentPlayer;
cells[index].textContent = currentPlayer;
cells[index].classList.add(currentPlayer.toLowerCase());
playSound('clickSound', currentPlayer === 'X' ? 520 : 360);

const win = checkWinner();
if (win) {
gameActive = false;
win.forEach((i) => cells[i].classList.add("winner"));

const winnerMark = board[win[0]];
if (winnerMark === "X") scoreX += 1;
else if (winnerMark === "O") scoreO += 1;

saveState();
updateUI();
playSound('winSound', 780);

if (!checkTournamentEnd()) {
updateStatus(`${winnerMark} wins this round!`);
}
return;
}

if (!board.includes("")) {
gameActive = false;
playSound('drawSound', 280);
updateStatus("Match Draw!");
return;
}

switchTurn();
updateStatus();
if (document.getElementById("gameMode").value === "ai" && currentPlayer === "O") {
aiMove();
}
}

function applyNames() {
const px = document.getElementById("playerX").value.trim() || "Player X";
const po = document.getElementById("playerO").value.trim() || "Player O";
document.getElementById("nameX").textContent = px;
document.getElementById("nameO").textContent = po;
}

document.getElementById("startGame").addEventListener("click", () => {
applyNames();
roundNo = 1;
scoreX = 0;
scoreO = 0;
startingPlayer = startingPlayer || 'X';
saveState();
updateUI();
resetBoard(true);
updateStatus(`${currentPlayer} starts`);
});

document.getElementById("newRound").addEventListener("click", () => {
const target = Number(document.getElementById("tournament").value) || 3;
const tournamentComplete = Math.max(scoreX, scoreO) >= Math.ceil(target / 2);
if (!gameActive && !tournamentComplete && (scoreX > 0 || scoreO > 0 || !board.includes('')) ) {
startingPlayer = startingPlayer === "X" ? "O" : "X";
roundNo += 1;
saveState();
updateUI();
resetBoard(true);
updateStatus(`${currentPlayer} starts`);
}
});

document.getElementById("resetTournament").addEventListener("click", () => {
scoreX = 0;
scoreO = 0;
roundNo = 1;
startingPlayer = "X";
saveState();
updateUI();
resetBoard(false);
updateStatus('Tournament reset');
});

document.getElementById("showHistory").addEventListener("click", () => {
renderHistory();
showPopup('historyPopup');
});

document.getElementById("closeWinner").addEventListener("click", () => {
hidePopup('winnerPopup');
});

document.getElementById("closeHistory").addEventListener("click", () => {
hidePopup('historyPopup');
});

cells.forEach((cell) => {
cell.addEventListener("click", (e) => {
const idx = e.currentTarget.dataset.index;
playMove(idx);
});
});

document.addEventListener("DOMContentLoaded", () => {
applyNames();
updateUI();
updateStatus('Press Start');

if (window.tsParticles && typeof window.tsParticles.load === 'function') {
tsParticles.load("tsparticles", {
fpsLimit: 60,
particles: {
number: { value: 70, density: { enable: true, area: 900 } },
color: { value: ["#38bdf8", "#7c3aed", "#f472b6"] },
shape: { type: "circle" },
opacity: { value: 0.5 },
size: { value: { min: 1, max: 4 } },
move: { enable: true, speed: 1.2, outModes: { default: "bounce" } }
},
interactivity: {
detectsOn: "canvas",
events: {
onHover: { enable: true, mode: "repulse" },
onClick: { enable: true, mode: "push" }
},
modes: { repulse: { distance: 110, duration: 0.4 }, push: { quantity: 3 } }
},
detectRetina: true
});
}

document.documentElement.style.setProperty('--mouse-x', '50%');
document.documentElement.style.setProperty('--mouse-y', '50%');
document.addEventListener('mousemove', (ev) => {
const x = (ev.clientX / window.innerWidth) * 100;
const y = (ev.clientY / window.innerHeight) * 100;
document.documentElement.style.setProperty('--mouse-x', `${x}%`);
document.documentElement.style.setProperty('--mouse-y', `${y}%`);
const cont = document.querySelector('.container');
if (cont) cont.style.transform = `translate(${(x - 50) / 45}%, ${(y - 50) / 45}%)`;
});
});
