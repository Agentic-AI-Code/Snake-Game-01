// Represents the Apple in the game
class Apple {
  /**
   * Initializes a new Apple object.
   * The position is not set here; it's set by the spawn method.
   */
  constructor() {
    this.position = { x: -1, y: -1 }; // Initial dummy position, will be updated by spawn
  }

  /**
   * Spawns the apple at a random position on the board, ensuring it does not overlap with the snake.
   * @param {number} boardWidth - The width of the game board.
   * @param {number} boardHeight - The height of the game board.
   * @param {Array<Object>} snakeSegments - An array of the snake's segments ({x, y} objects).
   */
  spawn(boardWidth, boardHeight, snakeSegments) {
    let newPosition;
    let positionIsValid = false;

    // Keep generating new positions until a valid one is found
    while (!positionIsValid) {
      newPosition = {
        x: Math.floor(Math.random() * boardWidth),
        y: Math.floor(Math.random() * boardHeight),
      };

      // Check for collision with snake segments
      positionIsValid = true; // Assume valid until a collision is found
      for (const segment of snakeSegments) {
        if (segment.x === newPosition.x && segment.y === newPosition.y) {
          positionIsValid = false; // Collision detected
          break; // No need to check further segments
        }
      }
    }

    this.position = newPosition;
  }
}

module.exports = Apple;
