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
        isWalker: false, // 기존 입자
      });
    }

    // 랜덤 워커용 추가 파티클
    this.randomParticles = [];
  }

  // 화면에 고르게 랜덤 워커 입자를 배치하는 메서드
  initializeRandomParticles(count) {
    let cols = floor(sqrt(count)); // 입자를 화면에 고르게 분포시키기 위한 열의 수
    let rows = floor(count / cols); // 행의 수
    let xSpacing = width / cols;   // 각 열 간격
    let ySpacing = height / rows;  // 각 행 간격

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (this.randomParticles.length < count) {
          let x = j * xSpacing + xSpacing / 2; // 중심 정렬
          let y = i * ySpacing + ySpacing / 2;
          this.randomParticles.push({
            pos: createVector(x, y),
            originalPos: createVector(x, y),
            force: createVector(0, 0),
            isWalker: true,
          });
        }
      }
    }
  }

  update() {
    for (let p of [...this.particles, ...this.randomParticles]) {
      // 힘을 적용하여 위치 업데이트
      p.pos.add(p.force);
      p.force.mult(0.95); // 힘을 서서히 감소시켜 안정화
    }

    // 충돌 감지 및 해결
    this.resolveCollisions();
  }

  display() {
    for (let p of [...this.particles, ...this.randomParticles]) {
      if (p.isWalker) {
        // 랜덤 워커 입자는 비어 있는 원
        noFill();
        stroke(100, 200, 255);
        strokeWeight(2);
        ellipse(p.pos.x, p.pos.y, 10);
      } else {
        // 기존 입자는 채워진 원
        fill(100, 200, 255);
        noStroke();
        ellipse(p.pos.x, p.pos.y, 10);
      }
    }
  }

  // 입자 간의 충돌 처리
  resolveCollisions() {
    let allParticles = [...this.particles, ...this.randomParticles];
    for (let i = 0; i < allParticles.length; i++) {
      for (let j = i + 1; j < allParticles.length; j++) {
        let p1 = allParticles[i];
        let p2 = allParticles[j];
        let dir = p2.pos.copy().sub(p1.pos);
        let dist = dir.mag();
        let minDist = 10; // 최소 거리 (입자 크기)

        if (dist < minDist) {
          dir.normalize();
          let overlap = minDist - dist;
          p1.force.sub(dir.copy().mult(overlap * 0.5));
          p2.force.add(dir.copy().mult(overlap * 0.5));
        }
      }
    }
  }

  // 랜덤 워커 입자를 제외한 입자들에게만 힘 적용
  applyRepulsion(main, delay, strengthMultiplier) {
    setTimeout(() => {
      for (let p of this.particles) { // 기존 입자만 힘 적용
        let dir = p.pos.copy().sub(main.pos); // 메인 파티클로부터의 방향 벡터
        let distance = dir.mag(); // 거리 계산
        dir.normalize(); // 방향만 남김
        let forceMagnitude = map(distance, 0, width / 2, 10, 50) * strengthMultiplier; // 거리 기반 힘 크기
        p.force = dir.mult(forceMagnitude); // 방향에 따라 힘 적용
      }
    }, delay);
  }

  applyRestoration() {
    for (let p of [...this.particles, ...this.randomParticles]) {
      let dir = p.originalPos.copy().sub(p.pos); // 현재 위치에서 원래 위치로의 방향
      let distance = dir.mag(); // 거리 계산
      dir.normalize(); // 방향만 남김
      let restorationForce = dir.mult(distance * 0.001); // 복원력 크기 (거리 비례)
      p.force.add(restorationForce); // 복원력 추가
    }
  }
}
