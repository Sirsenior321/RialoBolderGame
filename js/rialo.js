 // ============================
// RIALO OBJECT
// ============================

function Rialo(x, y, speed, color, size, rialo, slicedRialo1, slicedRialo2, name) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.color = color;
  this.size = size;
  this.xSpeed = randomXSpeed(x);
  this.ySpeed = random(-10.4, -7.4);
  this.rialo = rialo;
  this.slicedRialo1 = slicedRialo1;
  this.slicedRialo2 = slicedRialo2;
  this.name = name;
  this.sliced = false;
  this.visible = true;
}

Rialo.prototype.draw = function () {
  fill(this.color);
  if (this.sliced && this.name !== 'boom') {
    image(this.slicedRialo1, this.x - 25, this.y, this.size, this.size);
    image(this.slicedRialo2, this.x + 25, this.y, this.size, this.size);
  } else {
    image(this.rialo, this.x, this.y, this.size, this.size);
  }
};

Rialo.prototype.update = function () {
  if (this.sliced && this.name !== 'boom') {
    this.x -= this.xSpeed;
    this.y += this.ySpeed;
    this.ySpeed += gravity * 5;
  } else {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.ySpeed += gravity;
  }

  if (this.y > height) this.visible = false;
};

function randomRialo() {
  const x = random(width);
  const y = height;
  const size = noise(frameCount) * 20 + 40;
  const col = color(random(255), random(255), random(255));
  const speed = random(3, 5);
  const idx = round(random(0, rialoList.length - 1));
  const rialo = rialoImgs[idx];
  const slicedRialo1 = slicedRialoImgs[2 * idx];
  const slicedRialo2 = slicedRialoImgs[2 * idx + 1];
  const name = rialoList[idx];

  return new Rialo(x, y, speed, col, size, rialo, slicedRialo1, slicedRialo2, name);
}

function randomXSpeed(x) {
  return x > width / 2 ? random(-2.8, -0.5) : random(0.5, 2.8);
}