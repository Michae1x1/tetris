// canvas and context setup
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('next-piece');
const nextPieceCtx = nextPieceCanvas.getContext('2d');
const holdPieceCanvas = document.getElementById('hold-piece');
const holdPieceCtx = holdPieceCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');


// game constants
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const COLORS = [
    null,
    '#ff0000',  // I - red
    '#00ff00',  // J - green
    '#0000ff',  // L - blue
    '#ffff00',  // O - yellow
    '#ff00ff',  // S - magenta
    '#00ffff',  // T - cyan
    '#ff8000'   // Z - orange
];

// game State
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let paused = false;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let board = createBoard();
let currentPiece = null;
let nextPiece = null;
let heldPiece = null;
let canHold = true;
let highScore = parseInt(localStorage.getItem('tetrisHighScore')) || 0;
let highScores = JSON.parse(localStorage.getItem('tetrisHighScores')) || [];

// tetris Pieces
const PIECES = [
    [ // I
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [ // J
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [ // L
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    [ // O
        [4, 4],
        [4, 4]
    ],
    [ // S
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    [ // T
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    [ // Z
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];



// high score functions
function updateHighScores(finalScore) {
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('tetrisHighScore', highScore);
        highScoreElement.textContent = highScore;
    }

    highScores.push({
        score: finalScore,
        date: new Date().toLocaleDateString()
    });
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5); // keep only top 5 scores
    localStorage.setItem('tetrisHighScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    const highScoresList = document.getElementById('high-scores-list');
    highScoresList.innerHTML = highScores
        .map((score, index) => `
            <div>${index + 1}. ${score.score.toLocaleString()} (${score.date})</div>
        `)
        .join('');
}

// Game Board Functions
function createBoard() {
    return Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(0));
}

function createPiece() {
    const piece = JSON.parse(JSON.stringify(PIECES[Math.floor(Math.random() * PIECES.length)]));
    return {
        pos: {x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2), y: 0},
        matrix: piece
    };
}

// Drawing Functions
function drawBoard() {
    // clear the canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
        ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, i * BLOCK_SIZE);
        ctx.stroke();
    }
    
    // draw the board pieces
    drawMatrix(board, {x: 0, y: 0}, ctx);
    
    // draw the ghost piece
    if (currentPiece) {
        const ghost = getGhostPosition(currentPiece);
        drawGhostPiece(ghost.matrix, ghost.pos);
    }
    
    // draw the current piece
    if (currentPiece) {
        drawMatrix(currentPiece.matrix, currentPiece.pos, ctx);
    }
}

function drawMatrix(matrix, offset, context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const color = COLORS[value];
                const xPos = (x + offset.x) * BLOCK_SIZE;
                const yPos = (y + offset.y) * BLOCK_SIZE;
                
                // first draw a black border for separation
                context.strokeStyle = '#000000';
                context.lineWidth = 3;
                context.strokeRect(
                    xPos,
                    yPos,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                
                // draw slightly smaller neon border inside
                context.shadowBlur = 8;
                context.shadowColor = color;
                context.strokeStyle = color;
                context.lineWidth = 2;
                context.strokeRect(
                    xPos + 2,
                    yPos + 2,
                    BLOCK_SIZE - 4,
                    BLOCK_SIZE - 4
                );
                
                // add white inner highlight for definition
                context.shadowBlur = 0;
                context.strokeStyle = '#ffffff';
                context.lineWidth = 1;
                context.strokeRect(
                    xPos + 4,
                    yPos + 4,
                    BLOCK_SIZE - 8,
                    BLOCK_SIZE - 8
                );
                
                // reset shadow
                context.shadowBlur = 0;
            }
        });
    });
}

function drawGhostPiece(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const xPos = (x + offset.x) * BLOCK_SIZE;
                const yPos = (y + offset.y) * BLOCK_SIZE;
                
                // slightly dimmer shadow for ghost piece
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.64)';
                
                // draw ghost piece outline
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.64)';
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    xPos + 2,
                    yPos + 2,
                    BLOCK_SIZE - 4,
                    BLOCK_SIZE - 4
                );
                
                ctx.shadowBlur = 0;
            }
        });
    });
}

function drawNextPiece() {
    nextPieceCtx.fillStyle = '#000';
    nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    
    if (nextPiece) {
        // calculate the bounding box of the piece
        const width = nextPiece.matrix[0].length * BLOCK_SIZE;
        const height = nextPiece.matrix.length * BLOCK_SIZE;
        
        // calculate center position
        const offset = {
            x: Math.floor((nextPieceCanvas.width - width) / (2 * BLOCK_SIZE)),
            y: Math.floor((nextPieceCanvas.height - height) / (2 * BLOCK_SIZE))
        };
        
        drawMatrix(nextPiece.matrix, offset, nextPieceCtx);
    }
}

function drawHeldPiece() {
    holdPieceCtx.fillStyle = '#000';
    holdPieceCtx.fillRect(0, 0, holdPieceCanvas.width, holdPieceCanvas.height);
    
    if (heldPiece) {
        const width = heldPiece[0].length * BLOCK_SIZE;
        const height = heldPiece.length * BLOCK_SIZE;
        
        const offset = {
            x: Math.floor((holdPieceCanvas.width - width) / (2 * BLOCK_SIZE)),
            y: Math.floor((holdPieceCanvas.height - height) / (2 * BLOCK_SIZE))
        };
        
        drawMatrix(heldPiece, offset, holdPieceCtx);
    }
}

// piece movement and collision
function getGhostPosition(piece) {
    const ghost = {
        pos: { x: piece.pos.x, y: piece.pos.y },
        matrix: piece.matrix
    };
    
    while (!collision(board, ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--;
    
    return ghost;
}

function merge(board, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + piece.pos.y][x + piece.pos.x] = value;
            }
        });
    });
}

function rotate(matrix) {
    const N = matrix.length;
    const rotated = matrix.map((row, i) => 
        row.map((val, j) => matrix[N - 1 - j][i])
    );
    return rotated;
}

function collision(board, piece) {
    const [matrix, pos] = [piece.matrix, piece.pos];
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== 0 &&
                (board[y + pos.y] &&
                board[y + pos.y][x + pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Game Mechanics
function clearLines() {
    let linesCleared = 0;
    outer: for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        linesCleared++;
        y++;
    }
    
    if (linesCleared > 0) {
        // scoring system based on number of lines cleared
        const scoreMultiplier = [0, 100, 300, 500, 800][linesCleared];
        score += scoreMultiplier * level;
        lines += linesCleared;
        
        // level up every 10 lines
        const newLevel = Math.floor(lines / 10) + 1;
        if (newLevel > level) {
            level = newLevel;
            levelElement.textContent = level;
            // increase speed with level
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        }
        
        scoreElement.textContent = score;
    }
}

function holdPiece() {
    if (!canHold || gameOver || paused) return;
    
    
    if (heldPiece === null) {
        heldPiece = currentPiece.matrix;
        resetPiece();
    } else {
        const temp = currentPiece.matrix;
        currentPiece.matrix = heldPiece;
        heldPiece = temp;
        currentPiece.pos.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.matrix[0].length / 2);
        currentPiece.pos.y = 0;
    }
    
    canHold = false;
    drawHeldPiece();
}

function playerDrop() {
    currentPiece.pos.y++;
    if (collision(board, currentPiece)) {
        currentPiece.pos.y--;
        merge(board, currentPiece);
        clearLines();
        resetPiece();
        return;
    }
    dropCounter = 0;
}

function playerMove(dir) {
    currentPiece.pos.x += dir;
    if (collision(board, currentPiece)) {
        currentPiece.pos.x -= dir;
    } 
}

function playerRotate() {
    const pos = currentPiece.pos.x;
    let offset = 1;
    const matrix = rotate(currentPiece.matrix);
    currentPiece.matrix = matrix;
    
    while (collision(board, currentPiece)) {
        currentPiece.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > matrix[0].length) {
            currentPiece.matrix = rotate(rotate(rotate(matrix)));
            currentPiece.pos.x = pos;
            return;
        }
    }
}

function hardDrop() {
    while (!collision(board, currentPiece)) {
        currentPiece.pos.y++;
    }
    currentPiece.pos.y--;
    playerDrop();
}

// game state Management
function resetPiece() {
    currentPiece = nextPiece || createPiece();
    nextPiece = createPiece();
    drawNextPiece();
    canHold = true;
    
    if (collision(board, currentPiece)) {
        gameOver = true;
        gameOverElement.style.display = 'block';
        finalScoreElement.textContent = score;
        updateHighScores(score);
    }
}

function resetGame() {
    // reset board and game state
    board = createBoard();
    score = 0;
    level = 1;
    lines = 0;
    
    // reset UI elements
    scoreElement.textContent = score;
    levelElement.textContent = level;
    gameOver = false;
    paused = false;
    gameOverElement.style.display = 'none';
    
    // reset game mechanics
    dropInterval = 1000;
    dropCounter = 0;
    lastTime = 0;
    
    // reset pieces
    heldPiece = null;
    canHold = true;
    nextPiece = createPiece();
    resetPiece();
    
    // force an initial draw of all elements
    drawBoard();
    drawNextPiece();
    drawHeldPiece();
    
    // ensure that the game loop is running
    requestAnimationFrame(update);
}

heldPiece = null;
    canHold = true;
    nextPiece = createPiece();
    resetPiece();
    
    drawBoard();
    drawNextPiece();
    drawHeldPiece();
    
    requestAnimationFrame(update);


    function pauseGame() {
        paused = !paused;
        if (!paused) {
            lastTime = 0;
            requestAnimationFrame(update);
        } else {
            // draw pause message
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // set up text style for "RESUME"
            ctx.font = 'bold 24px "Courier New"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff00';
            ctx.fillStyle = '#00ff00';
            
            // draw text
            ctx.fillText('RESUME', canvas.width / 2, canvas.height / 2);
            
            // reset shadow effect
            ctx.shadowBlur = 0;
        }
    }

function showStartScreen() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-wrapper').style.display = 'none';
    displayHighScores();
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-wrapper').style.display = 'block';
    resetGame();
}

function update(time = 0) {
    if (gameOver || paused) return;

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        playerDrop();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    
    requestAnimationFrame(update);
}

// event Listeners
document.addEventListener('keydown', event => {
    if (gameOver) return;

    switch(event.key) {
        case 'ArrowLeft':
            if (!paused) playerMove(-1);
            break;
        case 'ArrowRight':
            if (!paused) playerMove(1);
            break;
        case 'ArrowDown':
            if (!paused) playerDrop();
            break;
        case 'ArrowUp':
            if (!paused) playerRotate();
            break;
        case ' ':
            if (!paused) hardDrop();
            break;
        case 'Alt':
        case 'AltLeft':
        case 'AltRight':
            event.preventDefault();
            if (!paused) holdPiece();
            break;
        case 'p':
        case 'P':
            pauseGame();
            break;
    }
});


// initialize game
document.getElementById('start-button').addEventListener('click', startGame);
displayHighScores();
showStartScreen();