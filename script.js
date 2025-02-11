let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playerXName = "";
let playerOName = "";
let gameActive = true;
let isSinglePlayer = false;
let difficulty = "easy";

function selectMode(mode) {
    document.getElementById("modeSelection").classList.add("hidden");
    document.getElementById("playerForm").classList.remove("hidden");

    if (mode === "single") {
        isSinglePlayer = true;
        document.getElementById("playerOField").classList.add("hidden");
        document.getElementById("difficultySelection").classList.remove("hidden");
    } else {
        isSinglePlayer = false;
        document.getElementById("playerOField").classList.remove("hidden");
        document.getElementById("difficultySelection").classList.add("hidden");
    }
}

function startGame() {
    playerXName = document.getElementById("playerX").value.trim();
    
    if (isSinglePlayer) {
        playerOName = "البوت 🤖";
        difficulty = document.getElementById("difficulty").value;
    } else {
        playerOName = document.getElementById("playerO").value.trim();
    }

    if (playerXName === "" || (!isSinglePlayer && playerOName === "")) {
        alert("يرجى إدخال أسماء اللاعبين!");
        return;
    }

    document.getElementById("playerForm").classList.add("hidden");
    document.getElementById("gameBoard").classList.remove("hidden");
    updateTurnInfo();
}

function makeMove(index) {
    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        document.getElementsByClassName("cell")[index].textContent = currentPlayer;
        document.getElementsByClassName("cell")[index].classList.add(currentPlayer.toLowerCase());

        if (checkWinner()) {
            document.getElementById("winner").textContent = (`${currentPlayer === "X" ? playerXName : playerOName} فاز باللعبة! 🎉`);
            gameActive = false;
            return;
        }

        if (board.every(cell => cell !== "")) {
            document.getElementById("winner").textContent = "انتهت اللعبة بالتعادل! 🤝";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnInfo();

        if (isSinglePlayer && currentPlayer === "O") {
            setTimeout(botMove, 500);
        }
    }
}

function botMove() {
    let move;
    if (difficulty === "easy") {
        move = getRandomMove();
    } else if (difficulty === "medium") {
        move = getBlockingMove() || getRandomMove();
    } else {
        move = getBestMove();
    }
    
    makeMove(move);
}

function getRandomMove() {
    let emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBlockingMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            if (checkWinner()) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    return null;
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner()) return isMaximizing ? -10 : 10;
    if (board.every(cell => cell !== "")) return 0;
    
    let bestScore = isMaximizing ? -Infinity : Infinity;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {board[i] = isMaximizing ? "O" : "X";
            let score = minimax(board, depth + 1, !isMaximizing);
            board[i] = "";
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }
    
    return bestScore;
}

function updateTurnInfo() {
    document.getElementById("turnInfo").textContent =(` الدور: ${currentPlayer === "X" ? playerXName : playerOName} (${currentPlayer})`);
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]  
    ];
    
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] !== "" && board[a] === board[b] && board[a] === board[c];
    });
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("winner").textContent = "";
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
    });
    updateTurnInfo();
}