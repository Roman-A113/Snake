const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var CellSize = 50;
var NumberCells = 15;
var AppleX = 0, AppleY = 0
var PosX = 0, PosY = 0;



var dx = 0, dy = 0
var curEvent = "";
Snake = []
var SnakeX = 0, SnakeY = 0;
var Events = []
var FPS = 10


var Add = 0
var dFPS = 0
var HeadPositionIndex = 0;
var AppleImage = new Image()
AppleImage.src = 'images/apple.png'
var SnakeBodyImage = new Image()
SnakeBodyImage.src = 'images/snake_body.png'

var HeadPositionImages = [new Image(), new Image(), new Image(), new Image()]

HeadPositionImages[0].src = 'images/snake_head_up.png'
HeadPositionImages[1].src = 'images/snake_head_right.png'
HeadPositionImages[2].src = 'images/snake_head_down.png'
HeadPositionImages[3].src = 'images/snake_head_left.png'

canvas.width = CellSize * NumberCells + NumberCells + 2;
canvas.height = canvas.width;

StartGame()
function RandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function UpdateApple() {
    AppleX = RandomNum(0, NumberCells - 1)
    AppleY = RandomNum(0, NumberCells - 1)
    for (let i = 0; i < Snake.length; i++) {
        if (AppleX == Snake[i][0] && AppleY == Snake[i][1]) {
            UpdateApple();
            break;
        }
    }
}

function good(x, y) {
    return (x >= 0 && y >= 0 && x < NumberCells && y < NumberCells);
}


function DrawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = "1";
    for (let i = 1; i < canvas.height; i += (CellSize + 1)) {
        ctx.beginPath()
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    for (let i = 1; i < canvas.width; i += (CellSize + 1)) {
        ctx.beginPath()
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

}



function DrawApple() {
    ctx.drawImage(AppleImage, (CellSize + 1) * AppleX + 2, (CellSize + 1) * AppleY + 2, CellSize - 1, CellSize - 1)
}

function DrawSnake() {
    ctx.fillStyle = 'green'
    for (let i = 0; i < Snake.length; i++) {
        numX = Snake[i][0]
        numY = Snake[i][1]
        if (i == 0) {
            ctx.drawImage(HeadPositionImages[HeadPositionIndex], (CellSize + 1) * numX + 2, (CellSize + 1) * numY + 2, CellSize - 1, CellSize - 1);
            continue;
        }
        ctx.drawImage(SnakeBodyImage, (CellSize + 1) * numX + 2, (CellSize + 1) * numY + 2, CellSize - 1, CellSize - 1);
    }

}


function StartGame() {
    Snake = [[Math.floor(NumberCells / 2), Math.floor(NumberCells / 2)]];
    SnakeX = Math.floor(NumberCells / 2);
    SnakeY = Math.floor(NumberCells / 2);
    dx = 0, dy = 0;
    dFPS = 0
    HeadPositionIndex = 0
    DrawGrid()
    UpdateApple()
    DrawApple()
    DrawSnake()
}


function CheckCollisions(x, y) {
    if (dx == 0 && dy == 0) return false;
    if (!good(x, y)) return true;
    for (let i = 0; i < Snake.length; i++) {
        if (Snake[i][0] == x && Snake[i][1] == y) {
            return true;
        }
    }
    return false
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            if (dx == 0 && dy == 1 && !Events.length) break
            Events.push([0, -1])
            HeadPositionIndex = 0
            break;
        case "ArrowDown":
        case "s":
            if (dx == 0 && dy == -1 && !Events.length) break
            Events.push([0, 1])
            HeadPositionIndex = 2
            break;
        case "ArrowLeft":
        case "a":
            if (dx == 1 && dy == 0 && !Events.length) break
            Events.push([-1, 0])
            HeadPositionIndex = 3
            break;
        case "ArrowRight":
        case "d":
            if (dx == -1 && dy == 0 && !Events.length) break
            Events.push([1, 0])
            HeadPositionIndex = 1
            break;
        default:
            break;
    }
});

function Game() {
    if (Events.length) {
        dx = Events[0][0]
        dy = Events[0][1]
        Events.shift()
    }
    SnakeX += dx
    SnakeY += dy
    if (SnakeX == AppleX && SnakeY == AppleY) {
        Snake.push(Snake.at(-1));
        UpdateApple()
    }
    else if (CheckCollisions(SnakeX, SnakeY)) {
        StartGame();
    }

    Snake.unshift([SnakeX, SnakeY])
    Snake.pop()
    DrawGrid()
    DrawApple()
    DrawSnake()

    setTimeout(() => {
        requestAnimationFrame(Game);
    }, 1000 / (FPS + dFPS));
}
Game()