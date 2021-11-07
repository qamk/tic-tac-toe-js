// Global variables (sad face)
let inputText;


// Module: listening for events
const eventListener = (() => {
  const onClick = (obj, callback) => {
    obj.addEventListener('click', callback);
  }

  return { onClick };
})();


// Module: Event callbacks
// const eventCallbacks = (() => {

// })();

// Module: Creating DOM elements
const domEditor = ( () => {
  const messageParentNode = document.getElementById('game_messages');
  const boardParentNode = document.getElementById('game_board');
  // const eventListenerObj = eventListener;

  const createTextInput = () => {
    const newInput = document.createElement('input');
    const inputId = 'game_input';
    const newButton = document.createElement('button');

    newInput.type = 'text'; newInput.classList = 'game-input'; newInput.id = inputId
    
    newButton.setAttribute('data-input', inputId);
    newButton.classList = 'game-button add';
    newButton.textContent = 'Add Player';

    // eventListenerObj.onClick(newButton, callback);

    messageParentNode.appendChild(newInput);
    messageParentNode.appendChild(newButton);
    return newButton;
  }
  
  const createTextMessage = (message) => {
    const newText = document.createElement('p');
    newText.classList = 'game-text'; newText.textContent = message;

    messageParentNode.appendChild(newText);
  }

  const removeMessageChildren = () => {
    const numChildren = messageParentNode.childNodes.length - 1;
    for (let i=0; i<numChildren; i++) {
      console.log('i: ', i, 'num child: ', numChildren)
      messageParentNode.removeChild(messageParentNode.lastElementChild);
    }

  }

  const getBoardChildren = () => {
    let children = boardParentNode.children;
    return children;
  }

  return { createTextInput, createTextMessage, removeMessageChildren, getBoardChildren }
})();

// Module: Determines scans the board for a winner
const boardScanner = ( () => {
  let currentBoard; let boardSize; let marks; let win = false;

  const _getCurrentBoard = board => currentBoard = board;

  const _setBoardSize = () => boardSize = currentBoard.length;

  const _setMarks = () => {
    let flatBoard = [];
    currentBoard.forEach( group => flatBoard = flatBoard.concat(group));
    marks = new Set(flatBoard);
    marks.delete(undefined);
    console.log('current board... ', currentBoard,'flatboard... ', flatBoard, 'marks... ', marks);
  }

  const _empty = (list) => list.length == 0;

  const _checkBoard = (board) => {
    result = board.map( _hasIdenticalCells );
    console.log('checking board...', result)
    return _interpretScan(result);
  }

  const _interpretScan = (list) => {
    let result = list.filter( (val) => val !== false );
    return (!_empty(result) || result[0]);
  }

  const _hasIdenticalCells = (group) => {
    // let marks = new Set(group);
    let winner;
    console.log('identical cells... group...', group);
    for ( let mark of marks ) {
      let parity = group.every( cell => cell === mark );
      console.log('mark ', mark, 'parity ', parity)
      winner = parity && mark;
      if (winner) { break }
    }
    console.log('result...', winner);
    return winner;
  }

  const _rowWinner = () => {
    console.log('finding a row winner...');
  
    return _checkBoard(currentBoard);
  }

  const _columnWinner = () => {
    console.log('finding a column winner...')
    let transformedBoard = [];

    for (let i=0; i<=boardSize; i++) {
      transformedBoard.push(
        [currentBoard[0][i], currentBoard[1][i], currentBoard[2][i]]
        )
    }

    return _checkBoard(transformedBoard);
  }

  const _diagonalWinner = () => {
    console.log('finding a diagonal winner...')
    let diagonal = [[], []];

    for (let i=0; i<boardSize; i++) {
      diagonal[0].push(currentBoard[i][i]);
      diagonal[1].push(currentBoard[i][boardSize-1-i]);
    }
    console.log('diagonal...', diagonal)
    return _checkBoard(diagonal);
  }

  const _draw = () => {
    let anyEmptyRow = currentBoard.map( group => group.some( cell => cell === undefined ) );
    let movePossible = anyEmptyRow.filter( row => row === true );
    console.log('move possible? ', movePossible, 'an empty row ', anyEmptyRow);
    return _empty(movePossible);
  }

  const findWinner = (board) => {
    _getCurrentBoard(board);
    _setBoardSize();
    _setMarks();

    if (marks.size !== 2) { return }; // Two different players must have moved
    console.log('finding a winner... ', 'marks...', marks);
    boardSize = currentBoard.length;

    win = _rowWinner() || _columnWinner() || _diagonalWinner() || _draw() || false;
    console.log('win...', win);

    return win;
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
    if (cells[row][column] !== undefined) {return false}

    cells[row][column] = mark;
    
    return true
  }

  const getCells = () => cells;

  return { addMark, getCells };

})();

// Player Factory
const Player = (name, mark) => {

  return { name, mark };
}


const gameMessages = (() => {
  const winMessage = (player) => `${player.name} wins with ${player.mark}!`;
  const moveMessage = (player) => `${player.name} to move with ${player.mark}:`;
  const playerPrompt = (mark) => `Please enter a name for player ${mark}`;
  const cannotMove = (player) => `${player.name} you cannot move there`;

  return { winMessage, moveMessage, playerPrompt, cannotMove };
})();

// Module: set up for the game
const gameSetUp = (() => {
  let marks = ['O', 'X'];
  let players = [];
  const gameMessagesObj = gameMessages;
  const domEditorObj = domEditor;
  const eventListenerObj = eventListener;

  const _lastItem = (list) => {
    const lastIndex = list.length - 1;
    return list[lastIndex];
  }

  const _setUpDom = (text, callback = false) => {
    domEditorObj.createTextMessage(text);
    if (callback) {
      let button = domEditorObj.createTextInput();
      eventListenerObj.onClick(button, _setPlayers);
    }
  }

  const _setPlayers = (event) => {
    let dataInput = event.target.dataset.input
    let name = _getInputText(dataInput);
    if (!name) { return }
    let mark = marks.pop();
    let newPlayer = Player(name, mark);
    players.push(newPlayer);
    domEditorObj.removeMessageChildren();
    console.log('new player: ', newPlayer, 'marks: ', marks)
    if (players.length == 2) { return }
    
    setCallback();
  }

  const _getInputText = (id) => {
    const input = document.getElementById(id);
    if (!input.value) { return false }
    console.log('input: ', input, 'value: ', input.value);
    return input.value;
  }

  const setCallback = () => {
    let mark = _lastItem(marks);
    let message = gameMessagesObj.playerPrompt(mark);
    _setUpDom(message, _setPlayers);
  }

  const setUpCells = (callback) => {
    let cells = domEditorObj.getBoardChildren();

    for (let cell of cells) {
      eventListenerObj.onClick(cell, callback);
    }
  }

  return { setCallback, setUpCells, players }
})();

// Factory: Plays the game by handling the main modules/factories
const Game = () => {
  let gameOver;
  let players = [];
  let activePlayer;
  const gameMessagesObj = gameMessages;
  const boardScannerObj = boardScanner;
  const gameBoardObj = gameBoard;
  const gameSetUpObj = gameSetUp;
  const domEditorObj = domEditor; // is this bad design (should Game know about domEditor)?
  
  const _setPlayerInfo = () => gameSetUpObj.setCallback();
  const _getPlayers = () => {
    console.log('setup complete.... players: ', gameSetUpObj.players);
    players = gameSetUpObj.players;
    activePlayer = players[0];
  }
  const _setCellEvent = () => gameSetUpObj.setUpCells(_makeMove);
  const _getCells = () => gameBoardObj.getCells();
  const _swapActivePlayer = () => {
    const inactivePlayer = players[0] == activePlayer ? players[1] : players[0];
    console.log('inactive player: ', inactivePlayer)
    activePlayer = inactivePlayer;
  }

  const _scanBoard = () => {
    cells = _getCells()
    gameOver = boardScannerObj.findWinner(cells);
    gameOver && _congratualteMessgage();
  }
  
  // Might refactor
  const _congratualteMessgage = () => {
    winMessage = gameMessagesObj.winMessage(activePlayer);
    domEditorObj.removeMessageChildren();
    domEditorObj.createTextMessage(winMessage);
  }

  const _moveMessage = (player) => {
    const message = gameMessagesObj.moveMessage(player);
    console.log('message', message);
    domEditorObj.createTextMessage(message);
  }
  const _invalidMoveMessage = (player) => {
    const message = gameMessagesObj.cannotMove(player);
    domEditorObj.createTextMessage(message);
  }

  const _makeMove = (event) => {
    domEditorObj.removeMessageChildren();
    if (gameOver) { return }
    activePlayer || _getPlayers();
    const cell = event.target;
    const cellPos = +cell.dataset.position;
    const boardUpdated = gameBoardObj.addMark(activePlayer.mark, cellPos);
    console.log('position: ', cellPos,'board updated: ', boardUpdated, 'board state', _getCells())
    if (!boardUpdated) {
      _invalidMoveMessage(activePlayer);
      return;
    }
    cell.innerHTML = activePlayer.mark; // Set cell value
    _swapActivePlayer();
    console.log('active player: ', activePlayer)
    activePlayer && _moveMessage(activePlayer);
    _scanBoard();
  }

  const start = () => {
    _setPlayerInfo();
    _setCellEvent();
    _moveMessage(activePlayer);
  }



  return { start }
}

function playGame(event) {
  const button = event.target;
  const newGame = Game();
  button.disabled = true;
  newGame.start();

}

const startButton = document.getElementById('start');
startButton.addEventListener('click', playGame);