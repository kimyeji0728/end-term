// Particle 클래스 정의
class Particle {
  constructor(x, y, size, col) {
    this.pos = createVector(x, y);
    this.size = size;
    this.col = col;
  }

  display() {
    fill(this.col);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
