let mainParticle; // 메인 파티클
let rings = [];   // 입자 띠들
let isRepelling = false; // 현재 밀어내는 상태인지 여부

function setup() {
  createCanvas(800, 800);
  mainParticle = new Particle(width / 2, height / 2, 30, color(255, 100, 100)); // 메인 파티클
  // 띠 생성
  let numRings = 3; // 띠의 개수
  for (let i = 1; i <= numRings; i++) {
    rings.push(new Ring(mainParticle, i * 100, 12)); // 각 띠의 반지름과 입자 개수 설정
  }
}

function draw() {
  background(30);
  mainParticle.display();
  for (let ring of rings) {
    if (!isRepelling) {
      ring.applyRestoration(); // 복원력 적용
    }
    ring.update();
    ring.display();
  }
}

// 마우스 클릭 시 밀어내는 힘 적용
function mousePressed() {
  isRepelling = true;
  for (let ring of rings) {
    ring.applyRepulsion(mainParticle);
  }
}

// 마우스를 놓으면 복원 모드로 전환
function mouseReleased() {
  isRepelling = false;
}
