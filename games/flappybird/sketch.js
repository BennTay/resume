/**
 * Author: Benn Tay Guobin
 * 
 * Improvements:
 *   - Make the bird talk as he passes each pipe.
 *   - Add music/sound effects.
 *   - Finetune collision.
 *   - Add dying animation (explode, fall to the ground, etc).
 *     idea: Change background to heaven, add halo to bird.
 *   - Confine all text to within the game canvas.
 *
 * Bugs:
 *   - Pressing F allows game to continue even when game is over.
 */

// Bird properties
const birdX = 100,
      birdY = 250,
      fallSpeed = 0,
      birdDiameter = 30,
      birdRadius = 0.5 * birdDiameter,
      maxSpeed = -10;
var bird = new Bird(birdX, birdY, fallSpeed, birdDiameter),
    birdImg1,
    birdImg2;

// Pipe properties
const pipeWidth = 30,
    pipeSpeed = 5,
    gapHeight = 120;
var pipeList = [],
    topPipeImg,
    bottomPipeImg;

// World properties
const gravity = 0.6,
  canvas_width = 900,
  canvas_height = 500;
var backgroundImg;

// Other game properties
var score = 0,
  game_started = false,
  flapButton,
  resetButton;
const startText = 'Press F or click/tap the Flap button to fly!',
      endText = 'Game over!',
      startGameButtonText = 'Flap',
      endGameButtonText = 'Play again',
      tapButtonColor = 'rgba(255, 255, 0, 0.5)',
      releaseButtonColor = 'rgba(0, 0, 0, 0.0)';

function preload() {
  // Bird images
  birdImg1 = loadImage('games/flappybird/images/birdframe1.png');
  birdImg2 = loadImage('games/flappybird/images/birdframe2.png');
  bird.imgSprite = birdImg1;

  // Pipe images
  topPipeImg = loadImage('games/flappybird/images/toppipe.png');
  bottomPipeImg = loadImage('games/flappybird/images/bottompipe.png');

  // Background image
  backgroundImg = loadImage('games/flappybird/images/bg.png');
}

function setup() {
  // Setup canvas
  var canvas = createCanvas(canvas_width, canvas_height);
  canvas.parent('flappybirdholder');

  // Setup text
  textSize(24);

  // Setup button
  flapButton = new Clickable();
  flapButton.locate(700, 300);
  flapButton.text = 'Flap';
  flapButton.resize(150, 150);
  flapButton.color = releaseButtonColor;
  flapButton.onPress = startGameButtonFunction;
  flapButton.onRelease = function() {
    this.color = releaseButtonColor;
  }
}

function draw() {
  // Must come first. Draw the background before drawing the objects on it, otherwise objects will not appear.
  background(backgroundImg);
  if (game_started) {
    updateGameObjects();
    showScore();
  } else {
    generateScreenSaver();
  }
  flapButton.draw();
}

function updateGameObjects() {
  // Update Bird
  bird.fallSpeed += gravity;
  
  if (bird.fallSpeed < 0) {
    bird.imgSprite = birdImg2;
  } else {
    bird.imgSprite = birdImg1;
  }
  
  bird.yPos += bird.fallSpeed;
  bird.draw();

  // Update pipes
  if (frameCount % 80 === 0) {
    pipeList.push(new Pipe(pipeWidth, canvas_height, canvas_width, pipeSpeed, gapHeight, topPipeImg, bottomPipeImg));
  }
  pipeList.forEach(p => {
    p.xPos -= p.speed;
    if (p.xPos < 0 - pipeWidth) {
      pipeList.shift();
    }
    p.draw();
  })  

  // Update score
  if (pipeList.length > 0) {
    let firstPipe = pipeList[0];
    if (firstPipe.xPos === bird.xPos) {
      score++;
    }
  }

  checkCollision();
}

function generateScreenSaver() {
  bird.draw();
  showInstructions(startText);
}

function checkCollision() {
  // Check collision between bird and ground/sky using p5.collide2D
  if (collideLineRect(0, canvas_height, canvas_width, canvas_height, bird.xPos, bird.yPos, birdDiameter, birdDiameter)
    || collideLineRect(0, -35, canvas_width, -35, bird.xPos, bird.yPos, birdDiameter, birdDiameter)) {
    endGame();
  }

  // Check collision between bird and nearest pipe using p5.collide2D
  if (pipeList.length > 0) {
    let p = pipeList[0];
    if (collideRectRect(p.xPos, 0, pipeWidth, p.topComponentHeight, bird.xPos, bird.yPos, birdDiameter, birdDiameter)
      || collideRectRect(p.xPos, p.bottomComponentYPos, pipeWidth, p.bottomComponentHeight, bird.xPos, bird.yPos, birdDiameter, birdDiameter)) {
      endGame();
    }
  }

  // Check if bird has fallen to the ground or flown too high out of canvas
  /*
  if (bird.yPos + birdRadius >= height || bird.yPos <= -35) {
    endGame();
  }
  */

  // Check if the bird has collided with the nearest pipe
  /*
  if (pipeList.length > 0) {
    let p = pipeList[0];
    if (Math.abs(p.xPos + (pipeWidth/2) - bird.xPos) < 0.5 * (pipeWidth + (birdRadius))) {
      if (bird.yPos - birdRadius <= p.topComponentHeight || bird.yPos + birdRadius > p.bottomComponentYPos) {
        endGame();
      }
    }
  }
  */
}

function endGame() {
  showInstructions(endText);
  flapButton.text = endGameButtonText;
  flapButton.onPress = resetGame;
  game_started = false;
}

function resetGame() {
  bird = new Bird(birdX, birdY, fallSpeed, birdDiameter);
  bird.imgSprite = birdImg1;
  pipeList = [];
  score = 0;
  flapButton.color = releaseButtonColor;
  flapButton.text = startGameButtonText;
  flapButton.onPress = startGameButtonFunction;
}

function startGameButtonFunction() {
  game_started = true;
  this.color = tapButtonColor;
  bird.fallSpeed -= 16;
  if (bird.fallSpeed < maxSpeed) {
    bird.fallSpeed = maxSpeed;
  }
}

function keyPressed() {
  if (keyCode === 70) {
    game_started = true;
    bird.fallSpeed -= 16;
    if (bird.fallSpeed < maxSpeed) {
      bird.fallSpeed = maxSpeed;
    }
  }
}

function showScore() {
  text('Score: ' + str(score), 700, 50);
}

function showInstructions(instructionText) {
  text(instructionText, 450, 250);
}

// Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
// Source: https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
function displayFPS() {
  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
}