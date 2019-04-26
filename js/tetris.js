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
        color: '#B996D5'
    },
    SQUARE: {
        columns: [0, 0, 1, 1],
        rows: [0, 1, 0, 1],
        color: '#FFFF00'
    },
    L: {
        columns: [0, 0, 0, 1],
        rows: [0, 1, 2, 2],
        color: '#'
    },
    L_INV: {
        columns: [0, 0, 0, -1],
        rows: [0, 1, 2, 2],
        color: '#EDAAAA'
    },
    T: {
        columns: [0, 0, -1, 1],
        rows: [0, 1, 1, 1],
        color: '#AAEDCD'
    },
    Z: {
        columns: [-1, 0, 0, 1],
        rows: [0, 0, 1, 1],
        color: '#9AC3ED'
    },
    Z_INV: {
        columns: [-1, 0, 0, 1],
        rows: [1, 1, 0, 0],
        color: '#FFC800'
    }
}
//KEYBOARD
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

//FRAME
var frameInterval = 10;

//BLOCKS & ENTITIES
var collider = new Collider(nPiecesWide, nPiecesLong);
var movingPiece = false;
var blocks = [];

//KEYBOARD
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        movingPiece.moveRight();
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        movingPiece.moveLeft();
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
        movingPiece.turnRight();
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
        movingPiece.moveDown();
    }
    else if (e.key == "Space") {
        spacePressed = true;

    }
}
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    else if (e.key == "Space") {
        spacePressed = false;
    }
}

//BLOCK FACTORY
function createBlock() {
    var keys = Object.keys(pieces)
    var randomPiece = pieces[keys[ keys.length * Math.random() << 0]];
    return new Block(randomPiece);
}

var Block = function (type) {
    var cells = [];
    var isMoving = true;
    for (let i = 0; i < 4; i++) {
        cells.push(new Cell(nPiecesWide / 2 + type.columns[i], type.rows[i], type.color));
    }

    return {
        draw: function () {
            cells.forEach(cell => { cell.draw(); });
        },
        moveDown: function () {
            cells.forEach(cell => { cell.moveDown(); });
        },
        moveLeft: function () {
            cells.forEach(cell => { cell.moveLeft(); });
        },
        moveRight: function () {
            cells.forEach(cell => { cell.moveRight(); });
        },
        isMoving: function () {
            return isMoving;
        },
        stop: function() {
            isMoving = false;
        },
        getCells: () => cells

    }
};
//CELL CONSTRUCTOR
var Cell = (function (col, row, color) {
    this.row = row;
    this.col = col;

    return {
        draw: function () {
            ctx.fillStyle = color || '#7cce2b';
            ctx.fillRect(col * cellsize, row * cellsize, cellsize, cellsize);
        },
        moveDown: function () {
            row++;
            drawCanvas();
        },
        moveLeft: function () {
            col--;
            drawCanvas();
        },
        moveRight: function () {
            col++;
            drawCanvas();
        },
        getRow: () => this.row,
        getCol: () => this.col
    };
});

//COLLIDER
function Collider (cols, rows) {
    this.cols = cols;
    this.rows = rows;
    map = new Array(this.cols);
    map.fill(false);

   map.forEach(col => {
       col = new Array(this.rows);
       col.fill(false);
    });

    return {
        canMoveDown: function (block) {
            block.getCells().forEach(cell => {
                if(cell.getRow() === map.length-1 || map[cell.getCol()][cell.getRow()+1]){
                    return false;
                }
            })
            return true;
        },
        canMoveLeft: function () {
        },
        canMoveRight: function () {
        }
    };
}; 

function drawCanvas() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movingPiece.draw();
}

function cicle() {
    movingPiece = movingPiece || createBlock();
    drawCanvas();
    if(collider.canMoveDown(movingPiece)){
        movingPiece.moveDown();
    }

};


var interval = setInterval(cicle, 400);