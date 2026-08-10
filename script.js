// DOM Elements
const beginnerButton = document.getElementById('begginer');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const advancedButton = document.getElementById('advanced');
const remainingMinesDisplay = document.getElementById('remaining-mines');
const timerDisplay = document.getElementById('time');
const smileyButton = document.getElementById('recharge-button');
const gameBoard = document.getElementById('minesweepers');

// Game Configuration & State Variables
let rows = 0;
let columns = 0;
let totalMines = 0;
let totalButtons = 0;
let mineMap = {};
let markedButtons = [];
let clickedButtons = [];

let isFirstClick = true;
let timerInterval = null;

smileyButton.disabled = true;

// Difficulty Selection Events
beginnerButton.addEventListener('click', () => {
	setupGame(8, 10, 7);
});

easyButton.addEventListener('click', () => {
	setupGame(9, 14, 15);
});

mediumButton.addEventListener('click', () => {
	setupGame(15, 20, 40);
});

advancedButton.addEventListener('click', () => {
	setupGame(20, 30, 99);
});

function setupGame(r, c, m) {
	rows = r;
	columns = c;
	totalMines = m;
	totalButtons = rows * columns;
	remainingMinesDisplay.innerHTML = totalMines;
	smileyButton.disabled = false;
	hideDifficultyMenu();
	generateBoard();
}

function hideDifficultyMenu() {
	beginnerButton.style.display = 'none';
	easyButton.style.display = 'none';
	mediumButton.style.display = 'none';
	advancedButton.style.display = 'none';
}

// Reset / Restart Game
smileyButton.addEventListener('click', () => {
	mineMap = {};
	markedButtons = [];
	clickedButtons = [];
	isFirstClick = true;

	timerDisplay.innerHTML = '0';
	remainingMinesDisplay.innerHTML = totalMines;
	smileyButton.innerHTML = '<img src="images/live.jpg" alt="cara feliz">';

	clearInterval(timerInterval);

	for (let i = 1; i <= totalButtons; i++) {
		const button = document.getElementById(`bm${i}`);
		button.innerHTML = '';
		button.style =
			'background-color: transparent; height: 50px; width: 50px; margin: -2px; border: 5px solid; border-left-color: #ffffff; border-top-color: #ffffff; border-bottom-color: #bbbbbb; border-right-color: #bbbbbb;';
		button.disabled = false;
	}

	for (let number of generateRandomNumbers(totalMines, 1, totalButtons)) {
		mineMap[`bm${number}`] = true;
	}
});

// Generate HTML Table and Add Event Listeners
function generateBoard() {
	let currentButtonId = 1;
	let tableHtml = '';

	for (let r = 1; r <= rows; r++) {
		tableHtml += '<tr>';
		for (let c = 1; c <= columns; c++) {
			tableHtml += `<td><button id="bm${currentButtonId}"></button></td>`;
			mineMap[`bm${currentButtonId}`] = false;
			currentButtonId++;
		}
		tableHtml += '</tr>';
	}

	gameBoard.innerHTML = tableHtml;

	for (let number of generateRandomNumbers(totalMines, 1, totalButtons)) {
		mineMap[`bm${number}`] = true;
	}

	for (let i = 1; i <= totalButtons; i++) {
		document.getElementById(`bm${i}`).addEventListener('mouseup', e => {
			if (isFirstClick) {
				isFirstClick = false;
				timerInterval = setInterval(() => {
					timerDisplay.innerHTML = parseInt(timerDisplay.innerHTML) + 1;
				}, 1000);
			}

			if (e.button === 0) {
				// Left Click
				if (markedButtons.includes(i)) return;

				if (mineMap[`bm${i}`]) {
					handleGameOver(i);
				} else {
					let adjacentMines = getMinesAroundCount(i);
					if (adjacentMines >= 1) {
						revealTile(i);
					} else {
						floodFill(i);
					}
				}
			} else if (e.button === 2) {
				// Right Click
				if (clickedButtons.includes(i)) return;

				if (!markedButtons.includes(i)) {
					document.getElementById(`bm${i}`).innerHTML =
						'<img src="images/flag.png" alt="bandera">';
					markedButtons.push(i);
					remainingMinesDisplay.innerHTML = parseInt(remainingMinesDisplay.innerHTML) - 1;
				} else {
					markedButtons = markedButtons.filter(buttonId => buttonId !== i);
					document.getElementById(`bm${i}`).innerHTML = '';
					remainingMinesDisplay.innerHTML = parseInt(remainingMinesDisplay.innerHTML) + 1;
				}
			}
		});
	}
}

function handleGameOver(triggeredTileId) {
	const audio = document.getElementById('audio');
	if (audio) audio.play();

	document.body.style = 'background-color: red;';
	document.getElementById(`bm${triggeredTileId}`).style =
		'background-color: red; border-color: red;';

	setTimeout(() => {
		document.body.style = 'background-color: #cccccc;';
	}, 100);

	clearInterval(timerInterval);
	smileyButton.innerHTML = '<img src="images/diedd.jpg" alt="cara muerta DX">';

	for (let a = 1; a <= totalButtons; a++) {
		if (mineMap[`bm${a}`]) {
			if (!markedButtons.includes(a)) {
				document.getElementById(`bm${a}`).innerHTML = '<img src="images/mine.png">';
			}
		}
		document.getElementById(`bm${a}`).disabled = true;
	}

	markedButtons.forEach(number => {
		if (!mineMap[`bm${number}`]) {
			document.getElementById(`bm${number}`).style = 'border-color: red;';
		}
	});
}

function generateRandomNumbers(amount, min, max) {
	let numbers = [];
	for (let i = 1; i <= amount; i++) {
		let number = Math.floor(Math.random() * (max - min + 1)) + min;
		if (!numbers.includes(number)) {
			numbers.push(number);
		} else {
			i--;
		}
	}
	return numbers;
}

// Coordinate Calculations for Adjacent Tiles
function getValidNeighbors(index) {
	let baseZeroIndex = index - 1;
	let r = Math.floor(baseZeroIndex / columns);
	let c = baseZeroIndex % columns;

	let neighbors = [];

	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			if (dr === 0 && dc === 0) continue;

			let newRow = r + dr;
			let newColumn = c + dc;

			if (newRow >= 0 && newRow < rows && newColumn >= 0 && newColumn < columns) {
				let neighborIndex = newRow * columns + newColumn + 1;
				neighbors.push(neighborIndex);
			}
		}
	}

	return neighbors;
}

function getMinesAroundCount(buttonId) {
	let neighbors = getValidNeighbors(buttonId);
	let count = 0;

	for (let neighbor of neighbors) {
		if (mineMap[`bm${neighbor}`]) {
			count++;
		}
	}

	return count;
}

// Flood Fill Algorithm (Stack / BFS Approach)
function floodFill(startTileId) {
	let tileStack = [startTileId];

	while (tileStack.length > 0) {
		let currentTile = tileStack.pop();

		if (clickedButtons.includes(currentTile) || markedButtons.includes(currentTile)) {
			continue;
		}

		revealTile(currentTile);

		if (getMinesAroundCount(currentTile) === 0) {
			let neighbors = getValidNeighbors(currentTile);

			for (let neighbor of neighbors) {
				if (!clickedButtons.includes(neighbor) && !markedButtons.includes(neighbor)) {
					tileStack.push(neighbor);
				}
			}
		}
	}
}

function revealTile(buttonNumber) {
	if (mineMap[`bm${buttonNumber}`]) return;

	if (!clickedButtons.includes(buttonNumber)) {
		document.getElementById(`bm${buttonNumber}`).style = 'border: 2px solid #bbbbbb;';
		let adjacentMines = getMinesAroundCount(buttonNumber);

		if (adjacentMines >= 1) {
			document.getElementById(`bm${buttonNumber}`).innerHTML = adjacentMines;
		} else {
			document.getElementById(`bm${buttonNumber}`).innerHTML = '⠀';
		}

		clickedButtons.push(buttonNumber);
	}

	// Win Condition
	if (clickedButtons.length === totalButtons - totalMines) {
		clearInterval(timerInterval);

		for (let i = 1; i <= totalButtons; i++) {
			document.getElementById(`bm${i}`).disabled = true;

			if (mineMap[`bm${i}`]) {
				if (!markedButtons.includes(i)) {
					document.getElementById(`bm${i}`).innerHTML = '<img src="images/flag.png">';
				}
			}
		}

		alert('¡Has completado el buscaminas!');
	}
}

// Disable Right-Click Context Menu
document.oncontextmenu = () => false;
