// Ring 클래스 정의
class Ring {
  constructor(center, radius, particleCount) {
    this.center = center; // 중심(메인 파티클)
    this.radius = radius; // 띠의 반지름
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      let angle = (TWO_PI / particleCount) * i; // 입자들의 각도 간격
      let x = this.center.pos.x + cos(angle) * radius;
      let y = this.center.pos.y + sin(angle) * radius;
      this.particles.push({
        pos: createVector(x, y),
        originalPos: createVector(x, y), // 원래 위치 저장
        force: createVector(0, 0), // 외력이 적용될 벡터
      });
    }
  }

  update() {
    for (let p of this.particles) {
      // 힘을 적용하여 위치 업데이트
      p.pos.add(p.force);
      p.force.mult(0.75); // 힘을 서서히 감소시켜 안정화
    }
  }

  display() {
    for (let p of this.particles) {
      fill(100, 200, 255);
      noStroke();
      ellipse(p.pos.x, p.pos.y, 10);
    }
  }

  // 메인 파티클에 의해 밀어내는 힘을 계산하고 적용하는 함수
  applyRepulsion(main) {
    for (let p of this.particles) {
      let dir = p.pos.copy().sub(main.pos); // 메인 파티클로부터의 방향 벡터
      let distance = dir.mag(); // 거리 계산
      dir.normalize(); // 방향만 남김
      let forceMagnitude = map(distance, 0, width / 2, 10, 50); // 거리 기반 힘 크기
      p.force = dir.mult(forceMagnitude); // 방향에 따라 힘 적용
    }
  }

  // 원래 위치로 돌아가는 복원력을 계산하고 적용
  applyRestoration() {
    for (let p of this.particles) {
      let dir = p.originalPos.copy().sub(p.pos); // 현재 위치에서 원래 위치로의 방향
      let distance = dir.mag(); // 거리 계산
      dir.normalize(); // 방향만 남김
      let restorationForce = dir.mult(distance * 0.1); // 복원력 크기 (거리 비례)
      p.force.add(restorationForce); // 복원력 추가
    }
  }
}
