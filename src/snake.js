// Represents the Snake in the game
class Snake {
  /**
   * Initializes a new Snake object.
   * @param {Array<Object>} initialSegments - The initial segments of the snake. Defaults to a standard starting position.
   * @param {string} initialDirection - The initial direction of the snake. Defaults to 'RIGHT'.
   */
  constructor(initialSegments = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }], initialDirection = 'RIGHT') {
    this.segments = [...initialSegments]; // Array of {x, y} objects
    this.direction = initialDirection; // 'UP', 'DOWN', 'LEFT', 'RIGHT'
    this.head = this.segments[0];
    this.growing = false; // Flag to indicate if the snake should grow in the next move
  }

  /**
   * Moves the snake one step in its current direction.
   * If the 'growing' flag is true, the snake extends; otherwise, it moves.
   */
  move() {
    // Determine new head position
    let newHead;
    switch (this.direction) {
      case 'UP':
        newHead = { x: this.head.x, y: this.head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: this.head.x, y: this.head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: this.head.x - 1, y: this.head.y };
        break;
      case 'RIGHT':
        newHead = { x: this.head.x + 1, y: this.head.y };
        break;
      default:
        return; // Should not happen
    }

    // Add new head to the beginning of the segments
    this.segments.unshift(newHead);
    this.head = newHead;

    // If not growing, remove the tail segment
    if (this.growing) {
      this.growing = false; // Reset the flag after growing
    } else {
      this.segments.pop();
    }
  }

  /**
   * Sets a flag to make the snake grow on its next move.
   */
  grow() {
    this.growing = true;
  }

  /**
   * Checks if the snake's head has collided with any part of its body.
   * @returns {boolean} True if a collision occurs, false otherwise.
   */
  checkSelfCollision() {
    // Start checking from the segment after the head
    for (let i = 1; i < this.segments.length; i++) {
      if (this.head.x === this.segments[i].x && this.head.y === this.segments[i].y) {
        return true; // Collision detected
      }
    }
    return false; // No collision
  }

  /**
   * Changes the snake's direction of movement.
   * Prevents the snake from immediately reversing its direction.
   * @param {string} newDirection - The new direction ('UP', 'DOWN', 'LEFT', 'RIGHT').
   */
  changeDirection(newDirection) {
    const oppositeDirections = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    };

    // Prevent changing to the opposite direction or the same direction
    if (newDirection === this.direction || newDirection === oppositeDirections[this.direction]) {
      return;
    }

    this.direction = newDirection;
  }
}

module.exports = Snake;
