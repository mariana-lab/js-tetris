//self invoked function only runs once
var Counter = (function(){
    var counter = 0;
    console.log('first: ' + counter);
    return {
        add: function(){
        counter += 1;
        return counter;
        },
        substract:function(){
        counter -= 1;
        return counter;
        }
    }
});

var counter1 = Counter();
var counter2 = Counter();

console.log(counter1.add());
console.log(counter2.add());
console.log(counter2.substract());
console.log(counter2.substract());



//KEYBOARD
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

var Cell = (function (row, col) {
    var row = row * cellsize;
    var col = col * cellsize;

    return {
        draw: function () {
            ctx.beginPath();
            ctx.rect(col * cellsize, row * cellsize, cellsize, cellsize);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        },
        moveDown: function () {
            row++;
        },
        moveLeft: function () {
            col--;
        },
        moveRight: function () {
            col++;
        }
    }
});