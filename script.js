const board = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;

const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
];

board.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);

function cellClicked() {
    const index = this.getAttribute("data-index");

    if (gameBoard[index] !== "" || !running) return;

    updateCell(this, index, currentPlayer);

    const winLine = checkWinner(gameBoard, currentPlayer);
    if (winLine) {
        statusText.textContent = `${currentPlayer} Wins!`;
        highlightWinningCells(winLine);
        running = false;
    } else if (!gameBoard.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
    } else {
        currentPlayer = "O";
        statusText.textContent = "AI is thinking...";
        setTimeout(aiMove, 600); // slight delay for AI move
    }
}

function updateCell(cell, index, player) {
    gameBoard[index] = player;
    cell.textContent = player;
}

function checkWinner(board, player) {
    for (let condition of winningConditions) {
        if (condition.every(index => board[index] === player)) {
            return condition; // return the winning line
        }
    }
    return null;
}

function highlightWinningCells(winLine) {
    winLine.forEach(index => {
        board[index].classList.add("winner");
    });
}

// -------- AI Move --------
function aiMove() {
    let difficulty = difficultySelect.value;
    let move;

    if (difficulty === "easy") {
        // random move
        let available = gameBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        move = available[Math.floor(Math.random() * available.length)];
    } else {
        // hard: minimax
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === "") {
                gameBoard[i] = "O";
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
    }

    gameBoard[move] = "O";
    board[move].textContent = "O";

    const winLine = checkWinner(gameBoard, "O");
    if (winLine) {
        statusText.textContent = "O Wins!";
        highlightWinningCells(winLine);
        running = false;
    } else if (!gameBoard.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
    } else {
        currentPlayer = "X";
        statusText.textContent = "Your turn!";
    }
}

// -------- Minimax (for Hard mode) --------
function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, "O")) return 1;
    if (checkWinner(board, "X")) return -1;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function restartGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    statusText.textContent = "";
    board.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
}
