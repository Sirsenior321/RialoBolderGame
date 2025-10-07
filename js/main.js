 // ============================
// MAIN GAME SCRIPT
// ============================

let cnv;
let score = 0, points = 0;
let lives = 3, x = 0;
let isPlay = false;
let isLogin = false;
let username = "";
let gravity = 0.1;
let sword;
let rialos = [];
let scaleFactor = 1;
let inputBox, startButton;

const rialoList = ['Rethink', 'Rialoo', 'rebuild', 'Riaalo', 'Riallo'];
let rialoImgs = [], slicedRialoImgs = [];
let livesImgs = [], livesImgs2 = [];

let boom, spliced, missed, over, start;
let bg, foregroundImg, rialoLogo, ninjaLogo, scoreImg, newGameImg, rialoImg, gameOverImg;

function preload() {
  boom = loadSound('sounds/boom.mp3');
  spliced = loadSound('sounds/splatter.mp3');
  missed = loadSound('sounds/missed.mp3');
  start = loadSound('sounds/start.mp3');
  over = loadSound('sounds/over.mp3');

  for (let i = 0; i < rialoList.length; i++) {
    rialoImgs[i] = loadImage('images/' + rialoList[i] + '.png');
    slicedRialoImgs[2 * i] = loadImage('images/' + rialoList[i] + '-1.png');
    slicedRialoImgs[2 * i + 1] = loadImage('images/' + rialoList[i] + '-2.png');
  }

  for (let i = 0; i < 3; i++) {
    livesImgs[i] = loadImage('images/x' + (i + 1) + '.png');
    livesImgs2[i] = loadImage('images/xx' + (i + 1) + '.png');
  }

  bg = loadImage('images/background.jpg');
  foregroundImg = loadImage('images/home-mask.png');
  rialoLogo = loadImage('images/rialo.png');
  ninjaLogo = loadImage('images/ninja.png');
  scoreImg = loadImage('images/score.png');
  newGameImg = loadImage('images/new-game.png');
  rialoImg = loadImage('images/rialoMode.png');
  gameOverImg = loadImage('images/game-over.png');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  calculateScale();
  sword = new Sword(color("#FFFFFF"));
  frameRate(60);
}

function draw() {
  clear();
  background(bg);
  push();
  translate((width - 800 * scaleFactor) / 2, (height - 635 * scaleFactor) / 2);
  scale(scaleFactor);

  if (!isLogin) drawLoginScreen();
  else if (!isPlay) drawHomeScreen();
  else game();

  pop();
}

// ----------------------------
// LOGIN SCREEN
// ----------------------------
function drawLoginScreen() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  textStyle(BOLD);
  text("WELCOME TO", 400, 200);

  textSize(100);
  fill(255, 180, 60);
  text("BLADE OF RIALO", 400, 290);

  textSize(25);
  fill(255);
  text("Enter your username to begin", 400, 360);

  if (!inputBox) showLoginScreen();
}

function showLoginScreen() {
  inputBox = createInput('');
  inputBox.position(width / 2 - 100, height / 2 + 40);
  inputBox.size(200);
  inputBox.attribute('placeholder', 'Enter your name');

  startButton = createButton('Start');
  startButton.position(width / 2 - 40, height / 2 + 90);
  startButton.mousePressed(() => {
    username = inputBox.value().trim();
    if (username.length > 0) {
      inputBox.remove();
      startButton.remove();
      isLogin = true;
      start.play();
    } else {
      alert("Please enter a username!");
    }
  });
}

// ----------------------------
// HOME SCREEN
// ----------------------------
function drawHomeScreen() {
  image(foregroundImg, 0, 0, 800, 350);
  image(rialoLogo, 40, 20, 358, 195);
  image(ninjaLogo, 420, 50, 318, 165);
  image(newGameImg, 310, 360, 200, 200);
  image(rialoImg, 365, 415, 90, 90);

  fill(255);
  textSize(28);
  textAlign(CENTER);
  text("Player: " + username, 400, 580);

  cnv.mouseClicked(check);
}

function check() {
  let mx = (mouseX - (width - 800 * scaleFactor) / 2) / scaleFactor;
  let my = (mouseY - (height - 635 * scaleFactor) / 2) / scaleFactor;

  if (!isPlay && mx > 300 && mx < 520 && my > 350 && my < 550) {
    start.play();
    isPlay = true;
  }
}

// ----------------------------
// GAME LOOP
// ----------------------------
function game() {
  clear();
  background(bg);

  if (mouseIsPressed) {
    let localX = (mouseX - (width - 800 * scaleFactor) / 2) / scaleFactor;
    let localY = (mouseY - (height - 635 * scaleFactor) / 2) / scaleFactor;
    sword.swipe(localX, localY);
  }

  if (frameCount % 5 === 0 && noise(frameCount) > 0.69) {
    rialos.push(randomRialo());
  }

  points = 0;
  for (let i = rialos.length - 1; i >= 0; i--) {
    rialos[i].update();
    rialos[i].draw();

    if (!rialos[i].visible) {
      if (!rialos[i].sliced && rialos[i].name !== 'boom') {
        image(livesImgs2[0], rialos[i].x, rialos[i].y - 120, 50, 50);
        missed.play();
        lives--;
      }
      if (lives < 1) gameOver();
      rialos.splice(i, 1);
    } else {
      if (rialos[i].sliced && rialos[i].name === 'boom') {
        boom.play();
        gameOver();
      }
      if (sword.checkSlice(rialos[i]) && rialos[i].name !== 'boom') {
        spliced.play();
        points++;
        rialos[i].update();
        rialos[i].draw();
      }
    }
  }

  sword.update();
  sword.draw();
  score += points;
  drawScore();
  drawLives();
}

function drawLives() {
  image(livesImgs[0], width / scaleFactor - 110, 20);
  image(livesImgs[1], width / scaleFactor - 88, 20);
  image(livesImgs[2], width / scaleFactor - 60, 20);

  if (lives <= 2) image(livesImgs2[0], width / scaleFactor - 110, 20);
  if (lives <= 1) image(livesImgs2[1], width / scaleFactor - 88, 20);
  if (lives === 0) image(livesImgs2[2], width / scaleFactor - 60, 20);
}

function drawScore() {
  image(scoreImg, 10, 10, 40, 40);
  textAlign(LEFT);
  noStroke();
  fill(255, 147, 21);
  textSize(50);
  text(score, 50, 50);
}

// ----------------------------
// GAME OVER + RESTART
// ----------------------------
function gameOver() {
  noLoop();
  over.play();
  clear();
  background(bg);
  image(gameOverImg, 155, 260, 490, 85);
  lives = 0;

  fill(255);
  rect(330, 380, 150, 60, 20);
  fill(0);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Restart", 405, 410);

  cnv.mouseClicked(restartGame);
}

function restartGame() {
  let mx = (mouseX - (width - 800 * scaleFactor) / 2) / scaleFactor;
  let my = (mouseY - (height - 635 * scaleFactor) / 2) / scaleFactor;

  if (mx > 330 && mx < 480 && my > 380 && my < 440) {
    resetGame();
    loop();
    cnv.mouseClicked(check);
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  rialos = [];
  isPlay = true;
}

// ----------------------------
// RESPONSIVE SCALE
// ----------------------------
function calculateScale() {
  let scaleW = windowWidth / 800;
  let scaleH = windowHeight / 635;
  scaleFactor = min(scaleW, scaleH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateScale();
}