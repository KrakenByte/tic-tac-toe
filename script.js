const Player = (marker, name) => ({ marker, name });

const gameBoard = (() => {
  const board = Array(9).fill("");
  const getBoard = () => board;
  const updateBoard = (index, marker) => (board[index] = marker);
  const resetBoard = () => board.fill("");
  return { getBoard, updateBoard, resetBoard };
})();

const displayController = (() => {
  const boardElement = document.querySelector(".board");
  const renderBoard = () => {
    boardElement.innerHTML = "";
    gameBoard.getBoard().forEach((cell, index) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.dataset.index = index;
      div.textContent = cell;
      boardElement.appendChild(div);
    });
  };

  const updateCell = (index, marker) => {
    const cell = boardElement.querySelector(`[data-index='${index}']`);
    if (cell) cell.textContent = marker;
  };

  boardElement.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index !== undefined) gameController.playRound(Number(index));
  });

  return { renderBoard, updateCell };
})();

const gameController = (() => {
  const players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const getPlayers = () => players;

  const createNewPlayer = (player) => {
    if (players.length < 2) players.push(player);
    if (players.length === 2) start();
  };

  const start = () => {
    gameBoard.resetBoard();
    displayController.renderBoard();
    currentPlayerIndex = 0;
    gameOver = false;
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    displayController.renderBoard();
    currentPlayerIndex = 0;
    gameOver = false;
  };

  const playRound = (index) => {
    if (players.length < 2) {
      alert("Please add two players to start the game.");
      return;
    }
    if (gameOver || gameBoard.getBoard()[index] !== "") return;

    const currentPlayer = players[currentPlayerIndex];
    gameBoard.updateBoard(index, currentPlayer.marker);
    displayController.updateCell(index, currentPlayer.marker);

    if (checkWin(currentPlayer.marker)) {
      setTimeout(() => alert(`${currentPlayer.name} wins!!`), 100);
      gameOver = true;
      return;
    }

    if (gameBoard.getBoard().every((cell) => cell !== "")) {
      setTimeout(() => alert("It's a tie!"), 100);
      gameOver = true;
      return;
    }

    currentPlayerIndex = 1 - currentPlayerIndex;
  };

  const checkWin = (marker) => {
    const b = gameBoard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winPatterns.some((pattern) => pattern.every((i) => b[i] === marker));
  };

  return { createNewPlayer, playRound, getPlayers, start, resetGame };
})();

const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (gameController.getPlayers().length >= 2) {
    alert("Two players already added. Please reset to add new players.");
    return;
  }

  const nameInput = form.querySelector("#player-name");
  const markerInput = form.querySelector("input[name='marker']:checked");

  const name = nameInput.value.trim();
  const marker = markerInput?.value;

  if (!name || !marker) {
    alert("Please enter both name and marker.");
    return;
  }

  const markerUsed = gameController
    .getPlayers()
    .some((p) => p.marker.toLowerCase() === marker.toLowerCase());

  if (markerUsed) {
    alert(`Marker '${marker}' is already taken!`);
    return;
  }

  gameController.createNewPlayer(Player(marker, name));
  form.reset();
});

document.querySelector(".start").addEventListener("click", () => {
  if (gameController.getPlayers().length < 2) {
    alert("Please add two players before starting.");
  } else {
    gameController.start();
  }
});

document
  .querySelector(".reset")
  .addEventListener("click", gameController.resetGame);
