// Module: Creating DOM elements
const domEditor = ( () => {
  const parentNode = document.getElementById('game_messages');

  const createTextInput = () => {
    const newInput = document.createElement('input');
    newInput.type = 'text'; newInput.classList = 'game-input';

    parentNode.appendChild(newInput)
  }
  
  const createTextMessage = (message) => {
    const newText = document.createElement('p');
    newText.classList = 'game-text'; newText.innerText(message);

    parentNode.appendChild(newText);
  }

  const removeChildren = () => {
    let children = parentNode.children;
    for (let child of children) child.remove;
  }

  return { createTextInput, createTextMessage, removeChildren }
})();

// Module: Determines scans the board for a winner
const boardScanner = ( () => {
  let currentBoard; let boardSize; let marks; let win = false;

  const _getCurrentBoard = board => currentBoard = board;

  const _setBoardSize = () => boardSize = currentBoard.length;

  const _setMarks = () => {
    let flatBoard = [];
    currentBoard.forEach( group => flatBoard.concat(group) )
    marks = new Set(flatBoard);
    marks.delete(undefined);
  }

  const _empty = (list) => list.length == 0;

  const _checkBoard = (board) => {
    result = board.map( _hasIdenticalCells );
    return _interpretScan(result);
  }

  const _interpretScan = (list) => {
    let result = list.filter( (val) => val !== false );
    return (_empty(result) || result[0]);
  }

  const _hasIdenticalCells = (group) => {
    let marks = new Set(group);
    let winner;
    for ( let mark of marks ) {
      let parity = group.every( cell => cell === mark );
      winner = parity && mark;
    }
    return winner;
  }

  const _rowWinner = () => {
  
    return _checkBoard(currentBoard);
  }

  const _columnWinner = () => {
    let transformedBoard = [];

    for (let i=0; i<=boardSize; i++) {
      transformedBoard.push(
        [currentBoard[0][i], currentBoard[1][i], currentBoard[2][i]]
        )
    }

    return _checkBoard(transformedBoard);
  }

  const _diagonalWinner = () => {
    let diagonal = [];

    for (let i=0; i<=boardSize; i++) {
      diagonal.push(currentBoard[i][i]);
    }
    
    return _checkBoard(diagonal);
  }

  const findWinner = (board) => {
    _getCurrentBoard(currentBoard);
    _setBoardSize;
    _setMarks;
    if (marks.length != 2) { return }; // Two different players must have moved

    boardSize = currentBoard.length;

    win = _rowWinner() || _columnWinner() || _diagonalWinner() || false;
  }

  return { findWinner };
})();

// Game Board module to control interactions with the board
const gameBoard = ( () => {
  let cells = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];

  const _divmod = numerator => [Math.floor(numerator / 3), numerator % 3]

  const addMark = (mark, pos) => {
    let row; let column;
    [ row, column ] = _divmod(pos);
    cells[row][column] = mark;
  }

  const getCells = () => cells

  return { addMark, getCells };

})();

// Player Factory
const Player = (name, mark) => {

  return { name, mark };
}


const gameMessages = (() => {
  const winMessage = (player) => `${player.name} wins!`;
  const moveMessage = (player) => `${player.name} to move with ${player.mark}:`;
  const playerPrompt = (mark) => `Please enter a name for player ${mark}`;

  return { winMessage, moveMessage, playerPrompt };
})();

const Game = () => {
  let gameOver;
  const gameMessagesObj = gameMessages;
  const boardScannerObj = boardScanner;
  const domEditorObj = domEditor;
  const gameBoardObj = gameBoard;

  const _setPlayers = () => {
    
  }
}