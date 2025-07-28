const gameboard = (function () {
  const cols = 3;
  const rows = 3;
  let board = [];

  function init() {
    board = Array(rows * cols).fill(" ");
  }

  function getBoard() {
    return board;
  }

  function setCell(index, marker) {
    board[index] = marker;
  }

  function getCols() {
    return cols;
  }

  function getRows() {
    return rows;
  }

  return {
    init,
    getBoard,
    getCols,
    getRows,
    setCell,
  };
})();

function Player(marker, name) {
  return { marker, name };
}

const gameController = (function () {
  let players = [];
  let currentTurn = 0;
  let valid = false;
  let gameActive = false;

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function createNewPlayer(player) {
    players.push(player);
  }

  function verifyGame() {
    const hasX = players.some((p) => p.marker.toLowerCase() === "x");
    const hasO = players.some((p) => p.marker.toLowerCase() === "o");
    valid = players.length === 2 && hasX && hasO;
  }

  function _checkWin(player) {
    const board = gameboard.getBoard();
    return winConditions.some(
      ([a, b, c]) =>
        board[a] === player.marker &&
        board[b] === player.marker &&
        board[c] === player.marker
    );
  }

  function _nextTurn() {
    currentTurn = currentTurn === 0 ? 1 : 0;
  }

  function handleClick(e) {
    const index = parseInt(e.target.dataset.index);
    const board = gameboard.getBoard();
    if (!gameActive || board[index] !== " ") return;

    const currentPlayer = players[currentTurn];
    gameboard.setCell(index, currentPlayer.marker);
    displayController.updateCell(index, currentPlayer.marker);

    if (_checkWin(currentPlayer)) {
      gameActive = false;
      setTimeout(() => alert(`${currentPlayer.name} wins!`), 10);
      return;
    }

    if (board.every((cell) => cell !== " ")) {
      gameActive = false;
      setTimeout(() => alert("It's a tie!"), 10);
      return;
    }

    _nextTurn();
  }

  function startGame() {
    if (!valid) {
      console.error(
        "INVALID GAME SETTINGS. Ensure there are two players with markers 'X' and 'O'."
      );
      alert(
        "INVALID GAME SETTINGS. Ensure there are two players with markers 'X' and 'O'."
      );
      return;
    }

    gameboard.init();
    displayController.createBoardUI(handleClick);
    gameActive = true;
    currentTurn = players.findIndex((p) => p.marker.toLowerCase() === "x");
  }

  function reset() {
    gameboard.init();
    currentTurn = 0;
    for (let i = 0; i < 9; i++) {
      displayController.updateCell(i, " ");
    }
    gameActive = true;
  }

  return {
    createNewPlayer,
    verifyGame,
    startGame,
    reset,
  };
})();

const displayController = (function () {
  const resetButton = document.querySelector(".reset");
  resetButton.addEventListener("click", gameController.reset);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", function (e) {
    gameController.verifyGame();
    gameController.startGame();
  });

  const addNewPlayerBtn = document.querySelector(".add-player");


  function createBoardUI(clickHandler) {
    const board = document.querySelector(".board");
    board.innerHTML = "";

    for (let i = 0; i < gameboard.getBoard().length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", clickHandler);
      board.appendChild(cell);
    }
  }

  function updateCell(index, value) {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) cell.textContent = value;
  }

  return {
    createBoardUI,
    updateCell,
  };
})();

function addPlayer(name, marker) {
  const name = prompt("Enter player name:");
  const marker = prompt(`Enter marker for ${name} (X or O):`);
  if (name && marker) {
    gameController.createNewPlayer(Player(marker.trim(), name.trim()));
  }
}

//addPlayer();
//addPlayer();
