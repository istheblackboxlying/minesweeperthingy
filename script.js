/* 
Student: Zhaoxuan Sun 
Grade:  10
Date: Dec. 11, 2024
Piedmont Hills High School
This creates a 9x9 game board with 10 mines per game.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Define the size of the board and the number of mines
    const boardSize = 9;
    const numMines = 10;

    // Create the game board with mines and adjacent mine counts
    let board = createBoard(boardSize, numMines);
    let gameOver = false; // Track if the game is over

    // Get the board element from the DOM
    const boardElement = document.getElementById('board');

    // Render the initial board
    renderBoard(boardElement, board);

    // Add a click event listener to handle cell revealing
    boardElement.addEventListener('click', (event) => {
        // If the game is over, or the cell is already revealed or flagged, do nothing
        if (gameOver || event.target.classList.contains('revealed') || event.target.classList.contains('flagged')) return;

        // Get the clicked cell and its row and column
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // If the clicked cell contains a mine, the game is over
        if (board[row][col].isMine) {
            gameOver = true;
            revealMines(board, boardElement); // Reveal all mines
            alert('Game Over!');
        } else {
            // Reveal the clicked cell and its adjacent cells if necessary
            revealCell(board, boardElement, row, col);

            // Check if the player has won the game
            if (checkWinGame(board)) {
                gameOver = true;
                alert('You Win!');
            }
        }
    });

    // Add a contextmenu event listener to handle flagging cells
    boardElement.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent the default right-click menu

        // If the game is over or the cell is already revealed, do nothing
        if (gameOver || event.target.classList.contains('revealed')) return;

        // Get the clicked cell and toggle its flag status
        const cell = event.target;
        toggleFlag(cell);
    });
});

// Function to toggle the flag on a cell
function toggleFlag(cell) {
    // If the cell is already flagged, remove the flag
    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        cell.textContent = ''; // Clear the flag icon
    } else {
        // Otherwise, add the flag and display the flag icon
        cell.classList.add('flagged');
        cell.textContent = '🚩';
    }
}

// Function to create the game board
function createBoard(size, numMines) {
    // Initialize a 2D array to represent the board
    let board = Array.from({ length: size }, () => Array.from({ length: size }, () => ({
        isMine: false, // Whether the cell contains a mine
        isRevealed: false, // Whether the cell has been revealed
        adjacentMines: 0 // Number of mines adjacent to the cell
    })));

    // Place mines randomly on the board
    placeMines(board, numMines);

    // Calculate the number of adjacent mines for each cell
    calculateAdjacentMines(board);

    return board;
}

// Function to place mines on the board
function placeMines(board, numMines) {
    const size = board.length;
    let minesPlaced = 0;

    // Randomly place mines until the required number is placed
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        // Ensure the cell doesn't already contain a mine
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

// Function to calculate the number of adjacent mines for each cell
function calculateAdjacentMines(board) {
    const size = board.length;

    // Loop through each cell on the board
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            // Skip cells that contain mines
            if (board[row][col].isMine) continue;

            let count = 0;

            // Check all 8 adjacent cells for mines
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    if (r === 0 && c === 0) continue; // Skip the current cell
                    const newRow = row + r;
                    const newCol = col + c;

                    // Ensure the adjacent cell is within bounds
                    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol].isMine) {
                        count++;
                    }
                }
            }

            // Update the adjacent mines count for the current cell
            board[row][col].adjacentMines = count;
        }
    }
}

// Function to render the board in the DOM
function renderBoard(boardElement, board) {
    boardElement.innerHTML = ''; // Clear the board element
    const size = board.length;

    // Create a cell for each row and column
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            boardElement.appendChild(cell);
        }
    }
}

// Function to reveal a cell and its adjacent cells if necessary
function revealCell(board, boardElement, row, col) {
    // Ensure the cell is within bounds
    if (row < 0 || row >= board.length || col < 0 || col >= board.length) return;

    // Skip already revealed cells
    if (board[row][col].isRevealed) return;

    // Mark the cell as revealed
    board[row][col].isRevealed = true;
    const cell = getCellElement(boardElement, row, col);
    cell.classList.add('revealed');

    // If the cell has no adjacent mines, reveal all adjacent cells
    if (board[row][col].adjacentMines === 0) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue; // Skip the current cell
                revealCell(board, boardElement, row + r, col + c);
            }
        }
    } else {
        // Otherwise, display the number of adjacent mines
        cell.textContent = board[row][col].adjacentMines;
    }
}

// Function to reveal all mines when the game is over
function revealMines(board, boardElement) {
    const size = board.length;

    // Loop through the board and reveal all mines
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col].isMine) {
                const cell = getCellElement(boardElement, row, col);
                cell.classList.add('mine');
            }
        }
    }
}

// Function to get a specific cell element from the DOM
function getCellElement(boardElement, row, col) {
    return boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Function to check if the player has won the game
function checkWinGame(board) {
    const size = board.length;

    // Loop through the board to check if all non-mine cells are revealed
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!board[row][col].isMine && !board[row][col].isRevealed) {
                return false; // If any non-mine cell is not revealed, the game is not won
            }
        }
    }
    return true; // All non-mine cells are revealed
}

