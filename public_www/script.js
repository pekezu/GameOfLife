var canvas;
var ctx;
var running = 0;
var interval;
var grid = [];
var shadowGrid = [];
var gridSideInPixels = 0;
var edgeCells = 22;
var cellSideInPixels = 0;
var bColor1 = "lightgreen";
var bColor2 = "red";

window.onload = function () {
    canvas = document.getElementById("mycanvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = bColor1;

    gridSideInPixels = canvas.width;
    cellSideInPixels = gridSideInPixels / edgeCells;
    createGrid();

    canvas.addEventListener('click', (evt) => {
        clickAlive(findCell(evt).id);
    });
}

function setEdgeCells(){
    var val=document.getElementById("edgeCells").value;
    console.log(val);
    edgeCells=val;
    cellSideInPixels = gridSideInPixels / edgeCells;
    clearCanvas();
    if(running) startGame();
    startGame();
}

function copyEdges() {
    for (let i = 0; i < edgeCells; i++) {
        for (let j = 0; j < edgeCells; j++) {
            let ind = j * edgeCells + i;
            if (i === 0) {
                grid[ind].alive = grid[ind + (edgeCells - 1)].alive;
            }
            if (i === (edgeCells - 1)) {
                grid[ind].alive = grid[ind - (edgeCells - 1)].alive;
            }
            if (j === 0) {
                grid[ind].alive = grid[(edgeCells * edgeCells - (edgeCells - i))].alive;
            }
            if (j === (edgeCells - 1)) {
                grid[ind].alive = grid[i].alive;
            }
        }
    }
}

function clickAlive(id) {
    if (grid[id].alive) {
        grid[id].alive = false;
    } else {
        grid[id].alive = true;
    }
    paintCell(id);
}

function startGame() {
    var button=document.getElementById("mybutton");
    if (running) {
        running = 0;
        clearInterval(interval);
        button.textContent="Start";
    } else {
        running = 1;
        interval = setInterval(checkLives, 500);
        button.textContent="Stop";

//Start point of life
        var center = edgeCells*Math.floor(edgeCells/2)+Math.floor(edgeCells/2);
        grid[center -1].alive = true;
        grid[center].alive = true;
        grid[center + 1].alive = true;
    }
}

function checkLives() {
    copyEdges();
    for (let i = 1; i < edgeCells - 1; i++) {
        for (let j = 1; j < edgeCells - 1; j++) {
            let ind = j * edgeCells + i;
            shadowGrid[ind].alive = aliveOrDead(ind);
        }
    }

    for (let i = 0; i < grid.length; i++) {
        grid[i].alive = shadowGrid[i].alive;
        paintCell(i);
    }
}

function aliveOrDead(id) {
    let x = grid[id].ix;
    let y = grid[id].iy;
    let alive = grid[id].alive;
    let aliveCount = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            let ind = j * edgeCells + i;
            if (grid[ind].alive) {
                aliveCount++;
            }
        }
    }
    if (alive && (aliveCount === 3 || aliveCount === 4)) {
        return true;
    }
    if (!alive && aliveCount === 3) {
        return true;
    }
    var time = new Date().getMilliseconds();
    return false;
}

function paintCell(id) {
    if (!grid[id].alive) {
        ctx.fillStyle = bColor1;
        ctx.fillRect(grid[id].xMin + 1, grid[id].yMin + 1, cellSideInPixels - 2, cellSideInPixels - 2);
    } else {
        ctx.fillStyle = bColor2;
        ctx.fillRect(grid[id].xMin + 1, grid[id].yMin + 1, cellSideInPixels - 2, cellSideInPixels - 2);
    }
}

function findCell(e) {
    for (let i = 0; i < grid.length; i++) {
        let evt = getMousePos(e);
        if (evt.x > grid[i].xMin && evt.x <= grid[i].xMax && evt.y > grid[i].yMin && evt.y <= grid[i].yMax) {
            return { id: grid[i].id };
        }
    }
}

function createGrid() {
    let currentX = 0;
    let currentY = 0;
    let i3 = 0;
    for (let i = 0; i < edgeCells; i++) {
        for (let i2 = 0; i2 < edgeCells; i2++) {
            draw(currentX, currentY, currentX + cellSideInPixels, currentY + cellSideInPixels);
            grid[i3] = { id: i3, ix: i2, iy: i, xMin: currentX, xMax: currentX + cellSideInPixels, yMin: currentY, yMax: currentY + cellSideInPixels, alive: false }
            shadowGrid[i3] = { id: i3, ix: i2, iy: i, xMin: currentX, xMax: currentX + cellSideInPixels, yMin: currentY, yMax: currentY + cellSideInPixels, alive: false }
            currentX = currentX + cellSideInPixels;
            i3++;
        }
        currentX = 0;
        currentY = currentY + cellSideInPixels;
    }
}

function draw(x1, y1, x2, y2) {
    if (canvas.getContext) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, 500, 500);
    grid = [];
    shadowGrid=[];
    createGrid();
}

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let tempX = Math.floor(evt.clientX - rect.left);
    let tempY = Math.floor(evt.clientY - rect.top);
    return {
        x: tempX,
        y: tempY
    }
}

function canvasMouseMove(evt) {
    let mousePos = getMousePos(evt);
    mousePos = { x: evt.x, y: evt.y };
}