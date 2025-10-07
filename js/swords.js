 // ==================================
// SWORD CLASS
// ==================================
function Sword(color) {
  this.trail = [];
  this.color = color;
  this.position = createVector(400, 300);
  this.target = createVector(400, 300);
  this.smooth = 0.3; // controls sword follow speed
}

// ==================================
// DRAW TRAIL
// ==================================
Sword.prototype.draw = function () {
  const total = this.trail.length;
  if (total < 1) return;

  noStroke();
  fill(this.color);

  for (let i = 0; i < total; i++) {
    const size = map(i, 0, total, 2, 27);
    ellipse(this.trail[i].x, this.trail[i].y, size);
  }
};

// ==================================
// UPDATE POSITION
// ==================================
Sword.prototype.update = function () {
  // Move smoothly toward target
  this.position.x = lerp(this.position.x, this.target.x, this.smooth);
  this.position.y = lerp(this.position.y, this.target.y, this.smooth);

  // Add to trail
  this.trail.push(this.position.copy());

  // Limit trail length
  if (this.trail.length > 20) {
    this.trail.splice(0, this.trail.length - 20);
  }
};

// ==================================
// SET TARGET POSITION
// ==================================
Sword.prototype.swipe = function (x, y) {
  this.target.set(x, y);
};

// ==================================
// CHECK COLLISION (SLICE)
// ==================================
Sword.prototype.checkSlice = function (rialo) {
  if (rialo.sliced || this.trail.length < 2) return false;

  const len = this.trail.length;
  const a = this.trail[len - 1];
  const b = this.trail[len - 2];

  const d1 = dist(a.x, a.y, rialo.x, rialo.y);
  const d2 = dist(b.x, b.y, rialo.x, rialo.y);
  const d3 = dist(a.x, a.y, b.x, b.y);

  const sliced = d1 < rialo.size || ((d1 < d3 && d2 < d3) && d3 < width / 4);
  if (sliced) rialo.sliced = true;

  return sliced;
};