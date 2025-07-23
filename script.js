const gameboard = (function () {
  const cols = 3;
  const rows = 3;
  let board = [];
  //intialize board
  function init() {
    board = [];
    const cellCount = rows * cols;
    for (let i = 0; i < cellCount; i++) {
      board.push(" ");
    }
    console.log("Initial board: ", board);
  }
  function getBoard() {
    return board;
  }
  function setCell(cell, marker) {
    board[cell - 1] = marker;
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

//player factory
function Player(marker, name) {
  return {
    marker: marker,
    name: name,
  };
}

const gameController = (function () {
  let players = [];
  let valid = false;
  function createNewPlayer(player) {
    players.push(player);
  }
  let currentTurn = 0;
  function verifyGame() {
    valid = players.length === 2;
  }
  const winConditions = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  function _checkWin(player) {
    const markerToCheck = player.marker;
    const board = gameboard.getBoard();

    for (const condition of winConditions) {
      const [a, b, c] = condition;

      if (
        board[a] === markerToCheck &&
        board[b] === markerToCheck &&
        board[c] === markerToCheck
      ) {
        return true;
      }
    }

    return false;
  }
  function startGame() {
    if (!valid) {
      console.log("INVALID GAME SETTINGS.");
      return;
    } else {
      //meat and bone of the game
      let gameActive = true;
      let turnsPlayed = 0;
      console.log("Game starts now.");
      players[0].marker === "x" ? (currentTurn = 0) : (currentTurn = 1);
      while (gameActive) {
        console.log(
          `Turn ${turnsPlayed + 1}: ${players[currentTurn].name}'s move.`
        );
        const cell = parseInt(
          prompt(
            `${players[currentTurn].name} chooses where to place their marker. (1-9)`
          )
        );
        if (
          isNaN(cell) ||
          cell < 1 ||
          cell > 9 ||
          gameboard.getBoard()[cell - 1] !== " "
        ) {
          console.log("Invalid move. Try again.");
          continue;
        }

        gameboard.setCell(cell, players[currentTurn].marker);
        displayController.renderBoard();

        if (_checkWin(players[currentTurn])) {
          console.log(`${players[currentTurn].name} wins!`);
          break;
        }

        turnsPlayed++;
        if (turnsPlayed >= 9) {
          console.log("It's a tie!");
          break;
        }

        _nextTurn();
      }
    }
  }

  function _nextTurn() {
    currentTurn == 1 ? (currentTurn = 0) : (currentTurn = 1);
  }
  return {
    createNewPlayer,
    verifyGame,
    startGame,
  };
})();

const displayController = (function () {
  function _make2D(array, rows, cols) {
    let output = [];
    let counter = 0;
    for (let i = 0; i < rows; i++) {
      output.push([]);
      for (let j = 0; j < cols; j++) {
        output[i].push(array[counter]);
        counter++;
      }
    }
    return output;
  }

  function renderBoard() {
    let rows = gameboard.getRows();
    let cols = gameboard.getCols();
    let newBoard = _make2D(gameboard.getBoard(), rows, cols);
    console.log("CURRENT BOARD: ");
    for (let i = 0; i < rows; i++) {
      let rowToRender = "";
      for (let j = 0; j < cols; j++) {
        rowToRender += newBoard[i][j] + " | ";
      }
      console.log(rowToRender);
      console.log("-------------------------");
    }
  }
  return {
    renderBoard,
  };
})();

gameboard.init();
function addPlayer() {
  const name = prompt("Enter player name");
  const marker = prompt("Enter player marker");
  gameController.createNewPlayer(new Player(marker, name));
}
addPlayer();
addPlayer();
gameController.verifyGame();
gameController.startGame();
