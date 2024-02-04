document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const context = canvas.getContext('2d');

    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;

    const COLORS = [
        '#000000', // Empty cell
        '#FF0000', // I
        '#00FF00', // J
        '#0000FF', // L
        '#FFA500', // O
        '#FFFF00', // S
        '#800080', // T
        '#FF00FF'  // Z
    ];

    const PIECES = [
        { shape: [[1, 1, 1, 1]], color: 1 },     // I
        { shape: [[1, 1, 1], [0, 1, 0]], color: 2 }, // J
        { shape: [[1, 1, 1], [1, 0, 0]], color: 3 }, // L
        { shape: [[1, 1], [1, 1]], color: 4 }, // O
        { shape: [[0, 1, 1], [1, 1, 0]], color: 5 }, // S
        { shape: [[1, 1, 1], [0, 1, 0]], color: 6 }, // T
        { shape: [[1, 1, 0], [0, 1, 1]], color: 7 }  // Z
    ];

    let board, currentPiece, gameInterval;

    function createEmptyBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function drawBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col !== 0) {
                    context.fillStyle = COLORS[col];
                    context.fillRect(colIndex * BLOCK_SIZE, rowIndex * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    context.strokeStyle = '#000';
                    context.strokeRect(colIndex * BLOCK_SIZE, rowIndex * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    function drawPiece() {
        currentPiece.shape.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col !== 0) {
                    context.fillStyle = COLORS[currentPiece.color];
                    const x = currentPiece.x + colIndex;
                    const y = currentPiece.y + rowIndex;
                    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    context.strokeStyle = '#000';
                    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    function moveDown() {
        currentPiece.y++;
        if (collision()) {
            currentPiece.y--;
            mergePiece();
            currentPiece = generateRandomPiece();
            if (collision()) {
                // Game over
                alert('Game Over!');
                resetGame();
            }
        }
    }

    function moveLeft() {
        currentPiece.x--;
        if (collision()) {
            currentPiece.x++;
        }
    }

    function moveRight() {
        currentPiece.x++;
        if (collision()) {
            currentPiece.x--;
        }
    }

    function rotate() {
        const rotatedPiece = rotatePiece(currentPiece.shape);
        if (!collision(rotatedPiece)) {
            currentPiece.shape = rotatedPiece;
        }
    }

    function rotatePiece(piece) {
        const size = piece.length;
        const newPiece = Array.from({ length: size }, () => Array(size).fill(0));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newPiece[i][j] = piece[size - j - 1][i];
            }
        }

        return newPiece;
    }

    function collision(piece = currentPiece.shape) {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (
                    piece[i][j] !== 0 &&
                    (board[currentPiece.y + i] && board[currentPiece.y + i][currentPiece.x + j]) !== 0
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function mergePiece() {
        currentPiece.shape.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col !== 0) {
                    const x = currentPiece.x + colIndex;
                    const y = currentPiece.y + rowIndex;
                    board[y][x] = currentPiece.color;
                }
            });
        });
        checkLines();
    }

    function checkLines() {
        for (let i = ROWS - 1; i >= 0; i--) {
            if (board[i].every(col => col !== 0)) {
                board.splice(i, 1);
                board.unshift(Array(COLS).fill(0));
            }
        }
    }

    function generateRandomPiece() {
        const randomIndex = Math.floor(Math.random() * PIECES.length);
        const piece = JSON.parse(JSON.stringify(PIECES[randomIndex])); // Clone the piece
        piece.x = Math.floor((COLS - piece.shape[0].length) / 2); // Center the piece horizontally
        piece.y = 0; // Start at the top
        return piece;
    }

    function startGame() {
        board = createEmptyBoard();
        currentPiece = generateRandomPiece();
        gameInterval = setInterval(update, 500);
    }

    function pauseGame() {
        clearInterval(gameInterval);
    }

    function resumeGame() {
        gameInterval = setInterval(update, 500);
    }

    function resetGame() {
        clearInterval(gameInterval);
        startGame();
    }

    function update() {
        moveDown();
        drawBoard();
        drawPiece();
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
                rotate();
                break;
        }
        drawBoard();
        drawPiece();
    });

    startGame();  // Automatically start the game when the page loads
});
