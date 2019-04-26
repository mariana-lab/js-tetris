//CANVAS
var canvas = document.getElementById("grid1");
var ctx = canvas.getContext("2d");
var nPiecesWide = 10;
var cellsize = canvas.width / nPiecesWide;
var nPiecesLong = canvas.height / cellsize;
var pieces = {
  LINE: {
    columns: [0, 0, 0, 0],
    rows: [0, 1, 2, 3],
    color: "#B996D5"
  },
  SQUARE: {
    columns: [0, 0, 1, 1],
    rows: [0, 1, 0, 1],
    color: "#FFFF00"
  },
  L: {
    columns: [0, 0, 0, 1],
    rows: [0, 1, 2, 2],
    color: "#"
  },
  L_INV: {
    columns: [0, 0, 0, -1],
    rows: [0, 1, 2, 2],
    color: "#EDAAAA"
  },
  T: {
    columns: [0, 0, -1, 1],
    rows: [0, 1, 1, 1],
    color: "#AAEDCD"
  },
  Z: {
    columns: [-1, 0, 0, 1],
    rows: [0, 0, 1, 1],
    color: "#9AC3ED"
  },
  Z_INV: {
    columns: [-1, 0, 0, 1],
    rows: [1, 1, 0, 0],
    color: "#FFC800"
  }
};
//KEYBOARD
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

//FRAME
var frameInterval = 10;

//KEYBOARD
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
    movingPiece.moveRight();
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
    movingPiece.moveLeft();
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = true;
    movingPiece.turnRight();
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = true;
    checkMovingPiece(); 
    if(collider.canMoveDown(movingPiece)){
        movingPiece.moveDown();
    }
  } else if (e.key == "Space") {
    spacePressed = true;
  }
}
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = false;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = false;
  } else if (e.key == "Space") {
    spacePressed = false;
  }
}

//BLOCK FACTORY
function createBlock() {
  var keys = Object.keys(pieces);
  var type = pieces[keys[(keys.length * Math.random()) << 0]];
  var cells = [];

  for (let i = 0; i < 4; i++) {
    var cell = new Cell(
      nPiecesWide / 2 + type.columns[i],
      type.rows[i],
      type.color
    );
    cell.draw();
    cells.push(cell);
  }

  return new Block(cells);
}

class Block {
  constructor(cells) {
    this._cells = cells;
    this._isMoving = true;
  }
  draw() {
    this._cells.forEach(cell => {
      cell.draw();
    });
  }
  moveDown() {
    this._cells.forEach(cell => {
      cell.moveDown();
    });
  }
  moveLeft() {
    this._cells.forEach(cell => {
      cell.moveLeft();
    });
  }
  moveRight() {
    this._cells.forEach(cell => {
      cell.moveRight();
    });
  }
  stop() {
    this._isMoving = false;
  }
  start() {
    this._isMoving = true;
  }
  get isMoving() {
    return this._isMoving;
  }
  get cells() {
    return this._cells;
  }
  set cells(cells) {
    this._cells = cells;
  }
}
//CELL CONSTRUCTOR
class Cell {
  constructor(col, row, color) {
    this._row = row;
    this._col = col;
    this._color = color;
  }
  draw() {
    ctx.fillStyle = this._color || "#7cce2b";
    ctx.fillRect(
      this._col * cellsize,
      this._row * cellsize,
      cellsize,
      cellsize
    );
  }
  moveDown() {
    this.row++;
    drawCanvas();
  }
  moveLeft() {
    this.col--;
    drawCanvas();
  }
  moveRight() {
    this.col++;
    drawCanvas();
  }
  get row() {
    return this._row;
  }
  get col() {
    return this._col;
  }

  set row(row) {
    this._row = row;
  }
  set col(col) {
    this._col = col;
  }
}

//COLLIDER
class Collider {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this._map = new Array(this.cols);
    this._map.fill(false);
    for (var i = 0; i < this._map.length; i++) {
      this._map[i] = new Array(this.rows);
      this._map[i].fill(false);
    }
  }
  canMoveDown(block) {
    var cells = block.cells;
    for (var i = 0; i < cells.length; i++) {
      if (
        cells[i].row >= this._map[cells[i].col].length - 1 ||
        this._map[cells[i].col][cells[i].row + 1]
      ) {
        return false;
      }
    }
    return true;
  }
  canMoveLeft() {
    return true;
  }
  canMoveRight() {
    return true;
  }
  stop(block) {
    block.stop();
    block.cells.forEach(cell => {
      this._map[cell.col][cell.row] = true;
    });
    console.log(block.isMoving);
  }
  start(block) {
    block.start();
    block.cells.forEach(cell => {
      this._map[cell.col][cell.row] = false;
    });
  }
  get map() {
    return this._map;
  }
}
function checkMovingPiece() {
    movingPiece = movingPiece || createBlock();
  blocks.add(movingPiece);
}
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.forEach(block => block.draw());
}

function moveblocks() {
  //move only moving pieces
  for (const block of blocks) {
    if (!collider.canMoveDown(block) && block.isMoving) {
      console.log("got here 2");

      collider.stop(block);
      movingPiece = false;
      return;
    } else if (!block.isMoving){
        continue;
    }
    else {
      block.moveDown();
    }
  }
}

function cicle() {
  checkMovingPiece();
  drawCanvas();
  moveblocks();
}

//BLOCKS & ENTITIES
var collider = new Collider(nPiecesWide, nPiecesLong);
var movingPiece = false;
const blocks = new Set();
var interval = setInterval(cicle, 400);
