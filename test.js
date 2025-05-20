const Snake = require('./src/snake.js');
const Apple = require('./src/apple.js');

let testCounter = 1;
let failureCounter = 0;

// Helper function for assertions
function assert(condition, message) {
  if (!condition) {
    failureCounter++;
    console.error(`Test Failed: ${message}`);
  }
  testCounter++;
}

console.log('--- Running Snake Tests ---');

// Test: Snake Initialization
console.log('\n[Snake Test] Initialization');
let snake = new Snake();
assert(snake.segments.length === 3, 'Initial length should be 3');
assert(snake.direction === 'RIGHT', 'Initial direction should be RIGHT');
assert(snake.head.x === 2 && snake.head.y === 0, 'Initial head position should be {x: 2, y: 0}');
assert(snake.growing === false, 'Initial growing state should be false');

// Test: Snake Movement (Simple)
console.log('\n[Snake Test] Movement - Simple');
snake = new Snake(); // Reset snake
snake.move();
assert(snake.head.x === 3 && snake.head.y === 0, 'Head should move one step RIGHT to {x: 3, y: 0}');
assert(snake.segments.length === 3, 'Length should remain 3 after simple move');
assert(snake.segments[0].x === 3 && snake.segments[0].y === 0, 'First segment should be new head');
assert(snake.segments[1].x === 2 && snake.segments[1].y === 0, 'Second segment should be old head');
assert(snake.segments[2].x === 1 && snake.segments[2].y === 0, 'Third segment should be old second');


// Test: Snake Direction Change
console.log('\n[Snake Test] Direction Change');
snake = new Snake(); // Reset snake
snake.changeDirection('UP');
snake.move();
assert(snake.direction === 'UP', 'Direction should change to UP');
assert(snake.head.x === 2 && snake.head.y === -1, 'Head should move one step UP to {x: 2, y: -1}');

// Test: Snake Direction Change - 180-degree prevention
console.log('\n[Snake Test] Direction Change - 180-degree prevention');
snake = new Snake(); // Initial direction: RIGHT
snake.changeDirection('LEFT'); // Attempt to change to LEFT
snake.move();
assert(snake.direction === 'RIGHT', 'Direction should remain RIGHT (prevented 180-degree turn)');
assert(snake.head.x === 3 && snake.head.y === 0, 'Head should still move RIGHT to {x: 3, y: 0}');

snake.changeDirection('UP'); // Valid change
snake.move(); // Now at {x:3, y:-1}, direction UP
snake.changeDirection('DOWN'); // Attempt 180 degree turn
snake.move();
assert(snake.direction === 'UP', 'Direction should remain UP (prevented 180-degree turn)');
assert(snake.head.x === 3 && snake.head.y === -2, 'Head should still move UP to {x: 3, y: -2}');


// Test: Snake Growth
console.log('\n[Snake Test] Growth');
snake = new Snake(); // Reset snake
snake.grow();
assert(snake.growing === true, 'Growing flag should be true after grow()');
const initialLength = snake.segments.length;
snake.move();
assert(snake.segments.length === initialLength + 1, 'Length should increase by 1 after grow() and move()');
assert(snake.head.x === 3 && snake.head.y === 0, 'Head should move one step RIGHT to {x: 3, y: 0} during growth');
assert(snake.growing === false, 'Growing flag should be reset to false after move()');

// Test: Snake Self-Collision
console.log('\n[Snake Test] Self-Collision');
snake = new Snake(); // Reset snake
// Manually create a collision scenario: H . . S (Head at (0,0), body at (0,0) after moving left from (1,0))
// Initial: [{x:2,y:0}, {x:1,y:0}, {x:0,y:0}] dir: RIGHT
// To make it simple: [{x:1,y:0}, {x:2,y:0}, {x:3,y:0}, {x:4,y:0}] dir: LEFT, head will collide with {x:2,y:0}
snake.segments = [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }];
snake.head = snake.segments[0];
snake.direction = 'RIGHT'; // Move right to collide with (2,0) if it was part of body
// Let's make a clearer collision: H will move to (2,0) which is already segment[1]
// Snake: H(1,0) S(2,0) S(3,0)
// Move RIGHT: New H(2,0) collides with S(2,0)
snake.segments = [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }];
snake.head = snake.segments[0];
snake.direction = 'RIGHT';
// Before move, manually adjust for test:
// Suppose snake is H(2,0), S(1,0), S(0,0), S(2,1), S(2,0) <- last segment makes it collide
// This is complex to setup without a board. Let's use the checkSelfCollision directly
// Head is (2,0). Segments are (2,0), (1,0), (0,0)
// Collision if head exists in the rest of the segments
snake.segments = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]; // Head (2,0) collides with segment[2] (2,0)
snake.head = snake.segments[0];
assert(snake.checkSelfCollision() === true, 'Self-collision should be detected');

snake.segments = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }]; // Default non-colliding
snake.head = snake.segments[0];
assert(snake.checkSelfCollision() === false, 'No self-collision in default setup');

snake.segments = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }]; // Head (0,0), collision at (1,0)
snake.head = snake.segments[0];
assert(snake.checkSelfCollision() === true, 'Self-collision should be detected in complex setup');


console.log('\n--- Snake Tests Complete ---');

console.log('\n--- Running Apple Tests ---');

// Test: Apple Initialization
console.log('\n[Apple Test] Initialization');
let apple = new Apple();
assert(typeof apple.position === 'object' && apple.position.x === -1 && apple.position.y === -1,
      'Initial apple position should be {x: -1, y: -1} or similar placeholder');

// Test: Apple Spawning
console.log('\n[Apple Test] Spawning');
apple = new Apple(); // Reset apple
const boardWidth = 10;
const boardHeight = 5;
const snakeSegmentsForAppleTest = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }];
apple.spawn(boardWidth, boardHeight, snakeSegmentsForAppleTest);

assert(apple.position.x >= 0 && apple.position.x < boardWidth,
      `Apple x-coordinate (${apple.position.x}) should be within [0, ${boardWidth - 1}]`);
assert(apple.position.y >= 0 && apple.position.y < boardHeight,
      `Apple y-coordinate (${apple.position.y}) should be within [0, ${boardHeight - 1}]`);

let overlap = false;
for (const segment of snakeSegmentsForAppleTest) {
  if (apple.position.x === segment.x && apple.position.y === segment.y) {
    overlap = true;
    break;
  }
}
assert(!overlap,
      `Apple position {x:${apple.position.x}, y:${apple.position.y}} should not overlap with snake segments`);

// Test spawning multiple times to ensure it doesn't get stuck (basic check)
console.log('\n[Apple Test] Spawning - Multiple attempts');
let allSpawnsValid = true;
for (let i=0; i<100; i++) { // Try 100 spawns
    apple.spawn(boardWidth, boardHeight, snakeSegmentsForAppleTest);
    if (!(apple.position.x >= 0 && apple.position.x < boardWidth &&
          apple.position.y >= 0 && apple.position.y < boardHeight)) {
        allSpawnsValid = false;
        console.error(`Invalid spawn position at attempt ${i+1}: {x:${apple.position.x}, y:${apple.position.y}}`);
        break;
    }
    overlap = false;
    for (const segment of snakeSegmentsForAppleTest) {
      if (apple.position.x === segment.x && apple.position.y === segment.y) {
        overlap = true;
        allSpawnsValid = false;
        console.error(`Spawn overlap at attempt ${i+1}: {x:${apple.position.x}, y:${apple.position.y}}`);
        break;
      }
    }
    if (!allSpawnsValid) break;
}
assert(allSpawnsValid, 'All apple spawns should be valid and not overlap with snake');


console.log('\n--- Apple Tests Complete ---');

console.log(`\n--- All Basic Tests Executed ---`);
if (failureCounter > 0) {
  console.error(`\nSUMMARY: ${failureCounter} test(s) failed. Please review messages above.`);
} else {
  console.log(`\nSUMMARY: All ${testCounter -1} tests passed!`);
}

// Exit with a non-zero code if any test failed, for CI/CD purposes
process.exit(failureCounter > 0 ? 1 : 0);
