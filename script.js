// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;

// Initialization
highScoreElement.textContent = highScore;

// Generate food
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food is not on the snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Draw game board
function clearCanvas() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw snake
function drawSnake() {
    ctx.fillStyle = '#27ae60';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Snake head
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
}

// Draw yellow food
function drawFood() {
    ctx.fillStyle = '#f1c40f'; // Yellow color as requested
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Add shine to food
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 6, gridSize - 6);
}

// Move snake
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    } else {
        snake.pop();
    }
}

// Check collisions
function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// Game loop
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
    
    setTimeout(gameLoop, 150);
}

// Start game
function startGame() {
    if (gameRunning && !gamePaused) return;
    
    if (!gameRunning) {
        // New game
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        scoreElement.textContent = score;
        generateFood();
        gameOverElement.style.display = 'none';
    }
    
    gameRunning = true;
    gamePaused = false;
    startBtn.textContent = 'Continue';
    pauseBtn.style.display = 'inline-block';
    
    gameLoop();
}

// Pause game
function pauseGame() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Continue' : 'Pause';
    
    if (!gamePaused) {
        gameLoop();
    }
}

// Restart game
function restartGame() {
    gameRunning = false;
    gamePaused = false;
    gameOverElement.style.display = 'none';
    startBtn.textContent = 'Start Game';
    pauseBtn.style.display = 'inline-block';
    pauseBtn.textContent = 'Pause';
    startGame();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = e.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
});

// Button controls
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);

// Initial setup
clearCanvas();
generateFood();
drawFood(); 