// Main game file for the Snake game

const Snake = require('./src/snake.js');
const Apple = require('./src/apple.js');

// --- Game Board Setup ---
const BOARD_WIDTH = 20; // Characters
const BOARD_HEIGHT = 10;  // Lines

// --- Initialize Game Objects & State ---
const snake = new Snake();
const apple = new Apple();
let score = 0;
let gameState = 'PLAYING'; // 'PLAYING' or 'GAME_OVER'
let gameInterval;

// Spawn the first apple, ensuring it's not on the snake
apple.spawn(BOARD_WIDTH, BOARD_HEIGHT, snake.segments);

/**
 * Renders the current state of the game board to the terminal.
 */
function renderGameBoard() {
  // Clear the console (Note: behavior might vary across terminals)
  console.clear(); // For Windows: process.stdout.write('\x1Bc'); or require('child_process').execSync('cls');

  if (gameState === 'GAME_OVER') {
    process.stdout.write('\n');
    process.stdout.write('====================\n');
    process.stdout.write('     GAME OVER!     \n');
    process.stdout.write('====================\n');
    process.stdout.write(`\nFinal Score: ${score}\n\n`);
    process.stdout.write('Thanks for playing!\n');
    process.stdout.write('Press Q or Ctrl+C to exit completely.\n');
    return;
  }

  // Create the top border
  let output = '+' + '-'.repeat(BOARD_WIDTH) + '+\n';

  // Build the game board grid
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    output += '|'; // Left border
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let cellCharacter = '.'; // Default to empty space

      // Check for snake head
      if (snake.head.x === x && snake.head.y === y) {
        cellCharacter = 'H';
      } else {
        // Check for snake body (excluding head, which is already checked)
        let isBodySegment = false;
        for (let i = 1; i < snake.segments.length; i++) {
          if (snake.segments[i].x === x && snake.segments[i].y === y) {
            cellCharacter = 'S';
            isBodySegment = true;
            break;
          }
        }
        // If not head or body, check for apple
        if (!isBodySegment && apple.position.x === x && apple.position.y === y) {
          cellCharacter = 'A';
        }
      }
      output += cellCharacter;
    }
    output += '|\n'; // Right border and newline
  }

  // Create the bottom border
  output += '+' + '-'.repeat(BOARD_WIDTH) + '+\n';

  // Print the assembled board
  process.stdout.write(output);
  console.log(`Score: ${score}`); // Display current score
}

// --- Game Loop ---
function gameLoop() {
  if (gameState !== 'PLAYING') {
    return;
  }

  snake.move();

  // Check for apple collision
  if (snake.head.x === apple.position.x && snake.head.y === apple.position.y) {
    snake.grow();
    score++;
    apple.spawn(BOARD_WIDTH, BOARD_HEIGHT, snake.segments);
  }

  // Check for wall collision
  if (
    snake.head.x < 0 ||
    snake.head.x >= BOARD_WIDTH ||
    snake.head.y < 0 ||
    snake.head.y >= BOARD_HEIGHT
  ) {
    gameState = 'GAME_OVER';
  }

  // Check for self-collision
  if (snake.checkSelfCollision()) {
    gameState = 'GAME_OVER';
  }

  renderGameBoard(); // Render the updated state

  if (gameState === 'GAME_OVER') {
    clearInterval(gameInterval);
    renderGameBoard(); // One final render to show game over message
  }
}

// --- Initial Render ---
renderGameBoard();

// --- Handle User Input ---
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (key) => {
  // Exit condition: Ctrl+C or 'q'
  if (key === '\u0003' || key.toLowerCase() === 'q') {
    clearInterval(gameInterval); // Stop the game loop
    process.stdin.setRawMode(false); // Restore terminal to normal mode
    process.stdin.pause();
    process.stdout.write('\x1Bc'); // Clears the screen (ANSI escape code)
    console.log('Game exited. Thanks for playing!');
    process.exit();
  }

  // Only process direction changes if the game is playing
  if (gameState !== 'PLAYING') {
    return;
  }
  
  let newDirection = null;
  switch (key) {
    // Arrow Keys
    case '\u001b[A': // Arrow Up
      newDirection = 'UP';
      break;
    case '\u001b[B': // Arrow Down
      newDirection = 'DOWN';
      break;
    case '\u001b[C': // Arrow Right
      newDirection = 'RIGHT';
      break;
    case '\u001b[D': // Arrow Left
      newDirection = 'LEFT';
      break;
    // WASD Keys
    case 'w':
    case 'W':
      newDirection = 'UP';
      break;
    case 's':
    case 'S':
      newDirection = 'DOWN';
      break;
    case 'a':
    case 'A':
      newDirection = 'LEFT';
      break;
    case 'd':
    case 'D':
      newDirection = 'RIGHT';
      break;
  }

  if (newDirection) {
    snake.changeDirection(newDirection);
    // The game loop will handle re-rendering.
  }
});

// --- Start Game ---
// Initial render is already done above
gameInterval = setInterval(gameLoop, 200); // Start the game loop (5 FPS)

// To see this in action, you would run `node index.js` in your terminal.
// Make sure you have Node.js installed.
// The snake starts at [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }] by default.
// 'H' is head, 'S' is body, 'A' is apple, '.' is empty.
// The apple's position is random.
// Board is 20x10.
// Snake direction is 'RIGHT'.
// Snake head at (2,0) means x=2, y=0 (third column, first row).
// Example:
// +--------------------+
// |..HSA...............| <-- Snake might look like this if H is head, S body, A apple
// |....................|
// |.........A..........| <-- Or apple might be here
// |....................|
// |....................|
// |....................|
// |....................|
// |....................|
// |....................|
// |....................|
// +--------------------+
