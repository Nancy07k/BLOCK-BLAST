const SHAPES = [
    [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0]
],
[
    [0,1,0],
    [0,1,0],  
    [1,1,0]
],
[
    [0,1,0],
    [0,1,0],
    [0,1,1]
],
[
    [1,1,0],
    [0,1,1],
    [0,0,0]
],
[
    [0,1,1],
    [1,1,0],
    [0,0,0]
],
[
    [1,1,1],
    [0,1,0],
    [0,0,0]
],
[
    [1,1],
    [1,1],
]

]

const COLORS = [
    "#fff",
    "#9b5fe0",
    "#162dd8ff",
    "#60e8d6ff",
    "#4e851bff",
    "#ebd50eff",
    "#d61212ff" 
]
const ROWS = 20;
const COLS = 10;

// 🎵 Add sounds
let lineClearSound = new Audio("lineclear.mp3");
let gameOverSound = new Audio("gameover.mp3");

let canvas = document.querySelector("#tetris");
let scoreboard = document.querySelector("h2");
let ctx = canvas.getContext("2d");
ctx.scale(30,30);


let pieceObj = null;
let grid = generateGrid();
let score = 0;

let isPaused = false;
let gameInterval = null;


function restartGame() {
    grid = generateGrid();
    pieceObj = null;
    score = 0;
    scoreboard.innerHTML = "score: " + score;
    renderGrid();
}

// Restart button listener
document.getElementById("restartBtn").addEventListener("click", restartGame);

// Pause button listener
document.getElementById("pauseBtn").addEventListener("click", function(){
    togglePause();

    // Change symbol depending on state
    let btn = document.getElementById("pauseBtn");
    if(isPaused){
        btn.innerHTML = "▶";   // show play symbol when paused
    } else {
        btn.innerHTML = "⏸";  // show pause symbol when running
    }
});



console.log(grid);
//console.log(pieceObj);
function generateRandomPiece(){
    let ran = Math.floor (Math.random()*7);
    //console.log(SHAPES[ran]);
    let piece = SHAPES[ran];
    let colorIndex = ran+1;
    let x = 4;
    let y = 0;
    return { piece, x, y, colorIndex };

}


gameInterval = setInterval(newGameState, 500);


function newGameState(){
    checkGrid();
    if(pieceObj == null){
        pieceObj = generateRandomPiece();
        renderPiece();
    }
    moveDown();
}

function checkGrid(){
    let count = 0;
    for(let i=0;i<grid.length;i++){
        let allFilled = true;
        for(let j=0;j<grid[i].length;j++){
            if(grid[i][j] == 0){
                allFilled = false;
            }

        }
        if(allFilled){
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            count++;
        }
            if(count > 0){
        lineClearSound.play();   // play sound when line clears
    }

    }
    if(count == 1){
        score+=10;
    }else if(count == 2){
        score+=30;
    }else if(count == 3){
        score+=50;
    }else if(count>3){
        score+=100;
    }
    scoreboard.innerHTML = "score: " + score;
}


function renderPiece(){
    let piece = pieceObj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
                ctx.fillStyle = COLORS [pieceObj.colorIndex];
                ctx.fillRect(pieceObj.x+j,pieceObj.y+i, 1, 1);
            }
        }

    }
}


function moveDown(){
    if(!collision(pieceObj.x,pieceObj.y+1))
       pieceObj.y+=1;
       else{
           for(let i=0;i<pieceObj.piece.length;i++){
            for(let j=0;j<pieceObj.piece[i].length;j++){
                if(pieceObj.piece[i][j] == 1){
                    let p = pieceObj.x+j;
                    let q = pieceObj.y+i;
                    grid[q][p] = pieceObj.colorIndex;
                }
            }
        }
        if(pieceObj.y == 0){
    gameOverSound.play();   // 🎵 play Game Over sound
    alert("Game Over");
    restartGame();          // reset game after alert
}

        pieceObj = null;

        }
    renderGrid();
}
function moveLeft(){
    if(!collision(pieceObj.x-1,pieceObj.y))
       pieceObj.x-=1;
    renderGrid();
}
function moveRight(){
    if(!collision(pieceObj.x+1,pieceObj.y))
       pieceObj.x+=1;
    renderGrid();
}

function rotate(){
    let rotatedPiece = [];
    let piece = pieceObj.piece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
        rotatedPiece[j][i] = piece[i][j];

        }

    }
    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if(!collision(pieceObj.x, pieceObj.y, rotatedPiece))
    pieceObj.piece = rotatedPiece;

    renderGrid()

}
function collision(x, y, piece = pieceObj.piece) {

    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
                let p = x+j;
                let q = y+i;
                if(p>=0 && p<COLS && q>=0 &&  q<ROWS){
                    if(grid[q][p]>0){
                        return true;
                    }

                }else{
                    return true;
                }
            }
        }
    }
    return false;
}
function generateGrid(){
    let grid = [];
    for(let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0);

        }
    }
    return grid;
}

function renderGrid(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            ctx.fillStyle = COLORS[grid[i][j]];
            ctx.fillRect(j,i,1,1)
        }
    }
    renderPiece();
}

function togglePause() {
    if (isPaused) {
        // resume game
        gameInterval = setInterval(newGameState, 500);
        isPaused = false;
    } else {
        // pause game
        clearInterval(gameInterval);
        isPaused = true;
    }
}


document.addEventListener("keydown",function(e){
    let key = e.code;
    console.log(key);
    if(key == "ArrowDown"){
        moveDown();
    }else if (key == "ArrowLeft"){
        moveLeft();
    }else if(key == "ArrowRight"){
        moveRight();
    }else if(key == "ArrowUp"){
        rotate();
    }
})