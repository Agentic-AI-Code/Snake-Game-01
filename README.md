# Node.js Terminal Snake Game

A classic Snake game playable in a Node.js terminal environment. The game is built with simple JavaScript and runs directly in the terminal, using standard input for controls.

## How to Play

### Prerequisites
- Node.js (version 12.x or higher recommended) installed on your system.

### Running the Game
1. Clone this repository or download the source files (`index.js`, `package.json`, and the `src` directory containing `snake.js` and `apple.js`).
2. Navigate to the project directory in your terminal.
3. Run the game using the command:
   ```bash
   node index.js
   ```

### Controls
- **Arrow Up / 'w' / 'W'**: Move Snake Up
- **Arrow Down / 's' / 'S'**: Move Snake Down
- **Arrow Left / 'a' / 'A'**: Move Snake Left
- **Arrow Right / 'd' / 'D'**: Move Snake Right
- **'q' / 'Q' or Ctrl+C**: Quit the game

## Gameplay
- The objective is to guide the snake (represented by 'H' for the head and 'S' for body segments) to eat apples (represented by 'A').
- Each apple consumed increases your score by one and makes the snake grow longer.
- The game board is a fixed size. Avoid colliding with the walls (the borders of the game area).
- Avoid colliding with the snake's own body.
- The game ends if the snake collides with a wall or its own body. Your final score will be displayed.

## How to Run Tests
Basic unit tests are provided to verify the core logic of the `Snake` and `Apple` classes.
To run these tests:
1. Ensure you are in the project's root directory in your terminal.
2. Execute the test script using the command:
   ```bash
   node test.js
   ```
3. The console will output the results of the tests, indicating how many passed or if any failed. If tests fail, it will output a non-zero exit code.

---
Enjoy the game!
