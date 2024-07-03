const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.game-status');
const restartButton = document.getElementById('restart');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const pvpButton = document.getElementById('pvp');
const pvcButton = document.getElementById('pvc');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = { X: 0, O: 0 };
let gameMode = 'pvp';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && gameMode === 'pvc' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        scores[currentPlayer]++;
        updateScoreDisplay();
        return;
    }

    if (!gameState.includes('')) {
        gameStatus.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function computerMove() {
    const availableMoves = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const computerChoice = availableMoves[randomIndex];

    const computerCell = document.querySelector(`[data-cell-index="${computerChoice}"]`);
    handleCellPlayed(computerCell, computerChoice);
    handleResultValidation();
}

function setGameMode(mode) {
    gameMode = mode;
    restartGame();
    gameStatus.textContent = `Game mode: ${mode === 'pvp' ? 'Player vs Player' : 'Player vs Computer'}`;
}

gameBoard.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', restartGame);
pvpButton.addEventListener('click', () => setGameMode('pvp'));
pvcButton.addEventListener('click', () => setGameMode('pvc'));