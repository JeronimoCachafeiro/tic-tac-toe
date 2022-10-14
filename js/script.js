// Game Board

const gameBoard = (() => {
  let currentState = ["", "", "", "", "", "", "", "", ""];

  const update = (target) => {
    currentState[target.dataset.index] = target.textContent;
  };

  const init = () => {
    _render();
  };

  const _domSelect = (selector) => document.querySelector(selector);

  const _cacheDom = {
    dom: _domSelect("div"),
  };

  const _addTile = (index) => {
    const _newTile = document.createElement("div");
    _newTile.setAttribute("data-index", index);
    _cacheDom.dom.appendChild(_newTile);
  };

  const _render = () => {
    for (let i = 0; i < currentState.length; i++) {
      _addTile(i);
    }
  };

  return { init, dom: _cacheDom.dom, update, currentState };
})();

// Player

const Player = (mark) => {
  const addMark = (target) => {
    target.textContent = mark;
  };

  return { addMark };
};

const player1 = Player("x");
const player2 = Player("o");

// Game

const game = (() => {
  let _currentTurn = "player1";

  const init = () => {
    gameBoard.init(), checkGameState();
  };

  const _endTurn = () =>
    _currentTurn === "player1"
      ? (_currentTurn = "player2")
      : (_currentTurn = "player1");

  const _playTurn = (target) => {
    if (
      _currentTurn === "player1" &&
      target.matches("div") &&
      target.textContent === ""
    ) {
      player1.addMark(target);
      _endTurn();
      gameBoard.update(target);
    } else if (
      _currentTurn === "player2" &&
      target.matches("div") &&
      target.textContent === ""
    ) {
      player2.addMark(target);
      _endTurn();
      gameBoard.update(target);
    }
  };

  const _endConditions = {
    _victory: () => {
      const board = gameBoard.currentState.toString();
      const patterns = [
        (x = {
          horizontal1: /x,x,x,o?x?,o?x?,o?x?,o?x?,o?x?,o?x?/,
          horizontal2: /o?x?,o?x?,o?x?,x,x,x,o?x?,o?x?,o?x?/,
          horizontal3: /o?x?,o?x?,o?x?,o?x?,o?x?,o?x?,x,x,x/,
          vertical1: /x,o?x?,o?x?,x,o?x?,o?x?,x,o?x?,o?x?/,
          vertical2: /o?x?,x,o?x?,o?x?,x,o?x?,o?x?,x,o?x?/,
          vertical3: /o?x?,o?x?,x,o?x?,o?x?,x,o?x?,o?x?,x/,
          diagonal1: /x,o?x?,o?x?,o?x?,x,o?x?,o?x?,o?x?,x/,
          diagonal2: /o?x?,o?x?,x,o?x?,x,o?x?,x,o?x?,o?x?/,
        }),
        (o = {
          horizontal1: /o,o,o,o?x?,o?x?,o?x?,o?x?,o?x?,o?x?/,
          horizontal2: /o?x?,o?x?,o?x?,o,o,o,o?x?,o?x?,o?x?/,
          horizontal3: /o?x?,o?x?,o?x?,o?x?,o?x?,o?x?,o,o,o/,
          vertical1: /o,o?x?,o?x?,o,o?x?,o?x?,o,o?x?,o?x?/,
          vertical2: /o?x?,o,o?x?,o?x?,o,o?x?,o?x?,o,o?x?/,
          vertical3: /o?x?,o?x?,o,o?x?,o?x?,o,o?x?,o?x?,o/,
          diagonal1: /o,o?x?,o?x?,o?x?,o,o?x?,o?x?,o?x?,o/,
          diagonal2: /o?x?,o?x?,o,o?x?,o,o?x?,o,o?x?,o?x?/,
        }),
      ];

      const _getPatternsArray = (player) => {
        player == "player1" ? (player = 0) : (player = 1);
        const patternsArray = Object.values(patterns[player]);
        return patternsArray;
      };

      const testPatterns = () => {
        const patternsPlayer1 = _getPatternsArray("player1");
        const patternsPlayer2 = _getPatternsArray("player2");

        const player1Wins = () =>
          patternsPlayer1.some((pattern) => pattern.test(board));
        const player2Wins = () =>
          patternsPlayer2.some((pattern) => pattern.test(board));

        if (player1Wins()) {
          console.log("Player1 wins");
        } else if (player2Wins()) {
          console.log("Player2 wins");
        }
      };

      if (testPatterns()) {
        return true;
      }
    },
    _tie: () => {
      const emptyTiles = () => gameBoard.currentState.some((tile) => tile === "");
      if (emptyTiles() === false) {
        return true;
      }
    },
  };

  const checkGameState = () => {
    gameBoard.dom.addEventListener("click", (e) => {
      _playTurn(e.target);
      if (_endConditions._victory()) {
      } else if (_endConditions._tie()) {
        console.log("It's a tie!");
      }
    });
  };

  
  return { init };
})();


game.init();
