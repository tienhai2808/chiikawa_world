/**
 * 8-Bit Pixel Particle & Weather Atmosphere Engine (Canvas 2D)
 * Hỗ trợ 4 chế độ thời tiết chân thực chuẩn Retro Pixel:
 * 1. SUNNY: Nắng vàng ấm áp, cầu vồng, bong bóng xà phòng 7 màu lơ lửng, bụi nắng lấp lánh
 * 2. RAIN: Mưa rào xiên xiên theo gió, bọt nước tóe trên thảm cỏ, u ám dịu mát
 * 3. SAKURA: Gió xuân thổi từng đợt, cánh hoa anh đào & lá cỏ bay lượn
 * 4. NIGHT: Bầu trời đêm lung linh, sao băng vụt qua, đom đóm phát sáng lập lòe
 */

class PixelParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];          // Hạt hiệu ứng bùng nổ (tim, sao, splash, vụn bánh)
    this.ambientParticles = [];   // Hạt thời tiết nền
    this.bubbles = [];            // Bong bóng xà phòng tương tác
    this.shootingStars = [];      // Sao băng ban đêm
    this.weather = "sunny";       // "sunny" | "rain" | "sakura" | "night"
    this.pixelSize = 4;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.windTick = 0;
    this.windForce = 0;
    this.shootingStarTimer = 0;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.initWeather("sunny");
    this.initCanvasInteraction();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.imageSmoothingEnabled = false;
  }

  // Chuyển đổi chế độ thời tiết
  setWeather(mode) {
    if (this.weather === mode) return;
    this.weather = mode;
    this.initWeather(mode);
  }

  getWeather() {
    return this.weather;
  }

  initWeather(mode) {
    this.ambientParticles = [];
    this.bubbles = [];
    this.shootingStars = [];

    if (mode === "sunny") {
      // 1. Bong bóng xà phòng 7 màu bồng bềnh (chậm rãi, êm dịu, không chóng mặt)
      const bubbleCount = Math.min(6, Math.max(4, Math.floor(this.width / 70)));
      for (let i = 0; i < bubbleCount; i++) {
        this.spawnBubble(true);
      }
      // 2. Bụi nắng lấp lánh & hạt bồ công anh
      for (let i = 0; i < 18; i++) {
        this.ambientParticles.push({
          type: "sundust",
          x: Math.random() * this.width,
          y: Math.random() * (this.height * 0.7),
          size: Math.floor(Math.random() * 2) + 2,
          speedY: -(Math.random() * 0.4 + 0.2),
          speedX: Math.random() * 0.6 - 0.3,
          twinkle: Math.random() * Math.PI * 2,
          color: ["#fef08a", "#fde047", "#fef9c3", "#ffffff"][i % 4]
        });
      }
    } else if (mode === "rain") {
      // Mưa rào xiên góc: 50 giọt mưa pixel
      const rainCount = Math.min(55, Math.floor(this.width / 8));
      for (let i = 0; i < rainCount; i++) {
        this.ambientParticles.push({
          type: "raindrop",
          x: Math.random() * (this.width + 120) - 20,
          y: Math.random() * this.height,
          length: Math.floor(Math.random() * 7) + 12,
          speedY: Math.random() * 5 + 14,
          speedX: -(Math.random() * 1.5 + 2.5), // Gió thổi nghiêng sang trái
          color: i % 3 === 0 ? "#7dd3fc" : "#bae6fd"
        });
      }
    } else if (mode === "sakura") {
      // Gió hoa anh đào & lá cỏ
      const petalCount = Math.min(38, Math.floor(this.width / 11));
      for (let i = 0; i < petalCount; i++) {
        this.ambientParticles.push({
          type: "petal",
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.floor(Math.random() * 3) + 3,
          speedY: Math.random() * 0.9 + 0.6,
          speedX: Math.random() * 1.8 + 1.0,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          step: Math.random() * 10,
          color: ["#ffb7b2", "#ffc6ff", "#ffd1dc", "#e2f0cb", "#c7f9cc"][i % 5]
        });
      }
    } else if (mode === "night") {
      // Đom đóm phát sáng lập lòe ở khoảng giữa màn hình
      const fireflyCount = Math.min(22, Math.floor(this.width / 18));
      for (let i = 0; i < fireflyCount; i++) {
        this.ambientParticles.push({
          type: "firefly",
          x: Math.random() * this.width,
          y: Math.random() * (this.height - 180) + 70, // Tập trung ở khoảng giữa
          size: Math.floor(Math.random() * 2) + 3,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.04 + 0.03,
          color: i % 3 === 0 ? "#fef08a" : "#bef264"
        });
      }
    }
  }

  // Sinh bong bóng xà phòng pixel 7 màu (bay chậm rãi, lơ lửng êm ái)
  spawnBubble(randomY = false) {
    const radius = Math.floor(Math.random() * 6) + 11; // 11px đến 17px gọn gàng
    this.bubbles.push({
      x: Math.random() * (this.width - 60) + 30,
      y: randomY ? Math.random() * (this.height * 0.65) + 100 : this.height + 25,
      radius: radius,
      speedY: Math.random() * 0.16 + 0.18, // Tốc độ trôi cực chậm và êm ái (0.18px - 0.34px/frame)
      angle: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.012 + 0.008, // Lắc lư rất nhẹ nhàng
      wobbleDist: Math.random() * 0.5 + 0.3, // Biên độ lắc rất êm, không gây chóng mặt
      hue: Math.floor(Math.random() * 360)
    });
  }

  // Tương tác chạm chọc vỡ bong bóng trên màn hình
  initCanvasInteraction() {
    const handleTap = (clientX, clientY) => {
      // 1. Kiểm tra chạm vào bong bóng xà phòng
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        const dist = Math.hypot(clientX - b.x, clientY - b.y);
        if (dist <= b.radius + 14) {
          // Bụp bong bóng!
          this.popBubble(b.x, b.y, b.radius);
          this.bubbles.splice(i, 1);
          if (window.chiikawaAudio && window.chiikawaAudio.playPop) {
            window.chiikawaAudio.playPop();
          }
          return;
        }
      }

      // 2. Chạm vào đom đóm ban đêm khiến đom đóm hoảng hốt bay nhanh
      if (this.weather === "night") {
        this.ambientParticles.forEach(p => {
          if (p.type === "firefly") {
            const dist = Math.hypot(clientX - p.x, clientY - p.y);
            if (dist < 60) {
              p.vx = (p.x - clientX) * 0.15;
              p.vy = (p.y - clientY) * 0.15;
              this.spawnSparkles(p.x, p.y, 4);
            }
          }
        });
      }

      // 3. Chạm vào khoảng trống tạo cụm sao mini lung linh
      this.spawnSparkles(clientX, clientY, 6);
    };

    this.canvas.addEventListener("click", (e) => handleTap(e.clientX, e.clientY));
    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches[0]) {
        handleTap(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Bùng nổ khi bong bóng vỡ
  popBubble(x, y, radius) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 3 + 1.5;
      this.particles.push({
        type: "bubble-pop",
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: 3,
        life: 1,
        decay: 0.04,
        color: ["#bae6fd", "#fbcfe8", "#fef08a", "#a7f3d0"][i % 4]
      });
    }
  }

  // Giọt mưa rơi xuống chạm đất bắn bọt nước (Splash ripple)
  spawnRainSplash(x, y) {
    for (let i = 0; i < 3; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = Math.random() * 2.5 + 1.2;
      this.particles.push({
        type: "rain-splash",
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.28,
        scale: 2,
        life: 1,
        decay: 0.06,
        color: "#bae6fd"
      });
    }
  }

  // Sao băng lướt qua bầu trời đêm
  spawnShootingStar() {
    this.shootingStars.push({
      x: Math.random() * (this.width * 0.6) + this.width * 0.4,
      y: Math.random() * 80 + 20,
      vx: -(Math.random() * 8 + 12),
      vy: Math.random() * 5 + 6,
      length: Math.random() * 30 + 40,
      life: 1,
      decay: 0.035
    });
  }

  // Cụm sao lấp lánh nhẹ
  spawnSparkles(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 1;
      this.particles.push({
        type: "pixel-star",
        x: Math.floor(x),
        y: Math.floor(y),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: 2,
        life: 1,
        decay: 0.03,
        color: ["#ffea00", "#ffffff", "#bae6fd", "#fbcfe8"][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Bắn chùm tim pixel 8-bit
  spawnHearts(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 3.5 + 2;
      this.particles.push({
        type: "pixel-heart",
        x: Math.floor(x),
        y: Math.floor(y),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        scale: Math.floor(Math.random() * 2) + 2,
        life: 1,
        decay: 0.02,
        color: ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1"][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Bắn chùm sao 8-bit (Usagi)
  spawnStars(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 2.5;
      this.particles.push({
        type: "pixel-star",
        x: Math.floor(x),
        y: Math.floor(y),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: Math.floor(Math.random() * 2) + 2,
        life: 1,
        decay: 0.025,
        color: ["#ffea00", "#ffdd00", "#ffd000", "#ffffff"][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Chiikawa khóc: Nước mắt rơi dạng khối pixel
  spawnTears(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      this.particles.push({
        type: "pixel-tear",
        x: Math.floor(x + dir * 20),
        y: Math.floor(y),
        vx: dir * (Math.random() * 2.5 + 1),
        vy: -(Math.random() * 4 + 2),
        gravity: 0.25,
        scale: 3,
        life: 1,
        decay: 0.025,
        color: "#60a5fa"
      });
    }
  }

  // Vụn bánh pixel khi ăn
  spawnCrumbs(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: "pixel-crumb",
        x: Math.floor(x + (Math.random() * 24 - 12)),
        y: Math.floor(y),
        vx: Math.random() * 3 - 1.5,
        vy: -(Math.random() * 2.5 + 1),
        gravity: 0.22,
        scale: Math.floor(Math.random() * 2) + 2,
        life: 1,
        decay: 0.035,
        color: ["#d97706", "#f59e0b", "#fbbf24"][Math.floor(Math.random() * 3)]
      });
    }
  }

  // Vẽ hình trái tim 8-bit trên ma trận pixel (5x5 matrix)
  drawPixelHeart(ctx, x, y, scale, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    const p = scale;
    const px = Math.floor(x);
    const py = Math.floor(y);

    const coords = [
      [1, 0], [3, 0],
      [0, 1], [1, 1], [2, 1], [3, 1], [4, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [1, 3], [2, 3], [3, 3],
      [2, 4]
    ];

    coords.forEach(([cx, cy]) => {
      ctx.fillRect(px + (cx - 2) * p, py + (cy - 2) * p, p, p);
    });
    ctx.restore();
  }

  // Vẽ ngôi sao 8-bit pixel (5x5 matrix)
  drawPixelStar(ctx, x, y, scale, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    const p = scale;
    const px = Math.floor(x);
    const py = Math.floor(y);

    const coords = [
      [2, 0],
      [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [1, 3], [2, 3], [3, 3],
      [1, 4], [3, 4]
    ];

    coords.forEach(([cx, cy]) => {
      ctx.fillRect(px + (cx - 2) * p, py + (cy - 2) * p, p, p);
    });
    ctx.restore();
  }

  // Vẽ bong bóng xà phòng pixel tròn với viền bước pixel
  drawPixelBubble(ctx, b) {
    ctx.save();
    const bx = Math.floor(b.x);
    const by = Math.floor(b.y);
    const r = Math.floor(b.radius);

    // 1. Thân bóng bán trong suốt
    ctx.fillStyle = `hsla(${b.hue}, 85%, 85%, 0.18)`;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();

    // 2. Viền pixel 7 màu
    ctx.strokeStyle = `hsla(${b.hue}, 90%, 75%, 0.75)`;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Đốm phản quang pixel góc trên trái
    ctx.fillStyle = "#ffffff";
    const highlightSize = Math.max(3, Math.floor(r * 0.28));
    ctx.fillRect(bx - Math.floor(r * 0.6), by - Math.floor(r * 0.6), highlightSize, highlightSize);
    ctx.fillRect(bx - Math.floor(r * 0.35), by - Math.floor(r * 0.65), Math.floor(highlightSize * 0.6), Math.floor(highlightSize * 0.6));

    // 4. Đốm cầu vồng phản quang góc dưới phải
    ctx.fillStyle = `hsla(${(b.hue + 120) % 360}, 90%, 80%, 0.6)`;
    ctx.fillRect(bx + Math.floor(r * 0.4), by + Math.floor(r * 0.35), Math.floor(highlightSize * 0.8), Math.floor(highlightSize * 0.8));

    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.windTick += 0.02;

    const groundY = this.height - 130; // Điểm chạm đất/thảm dã ngoại

    // ==========================================
    // A. VẼ HẠT THỜI TIẾT THEO CHẾ ĐỘ
    // ==========================================

    // 1. MƯA RÀO (Rain)
    if (this.weather === "rain") {
      this.ambientParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Vẽ vệt mưa pixel xiên
        this.ctx.save();
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.length);
        this.ctx.stroke();
        this.ctx.restore();

        // Chạm đất -> Bắn tóe bọt nước (Splash)
        if (p.y > groundY + Math.random() * 50) {
          this.spawnRainSplash(p.x, p.y);
          p.y = -20;
          p.x = Math.random() * (this.width + 120) - 20;
        }
      });
    }

    // 2. NẮNG ẤM (Sunny)
    else if (this.weather === "sunny") {
      // Bụi nắng lơ lửng
      this.ambientParticles.forEach(p => {
        p.y += p.speedY;
        p.twinkle += 0.05;
        p.x += Math.sin(p.twinkle) * 0.4 + p.speedX;

        if (p.y < 0) {
          p.y = this.height * 0.7;
          p.x = Math.random() * this.width;
        }

        const alpha = 0.4 + 0.6 * Math.sin(p.twinkle);
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.1, alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        this.ctx.restore();
      });

      // Bong bóng xà phòng bay lên
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        b.angle += b.wobbleSpeed;
        b.x += Math.sin(b.angle) * b.wobbleDist;
        b.y -= b.speedY;

        this.drawPixelBubble(this.ctx, b);

        if (b.y < -30) {
          b.y = this.height + Math.random() * 50 + 25;
          b.x = Math.random() * (this.width - 60) + 30;
          b.speedY = Math.random() * 0.16 + 0.18;
          b.radius = Math.floor(Math.random() * 6) + 11;
        }
      }
    }

    // 3. GIÓ HOA ANH ĐÀO (Sakura)
    else if (this.weather === "sakura") {
      const gust = Math.sin(this.windTick) * 1.5;
      this.ambientParticles.forEach(p => {
        p.step += 0.03;
        p.y += p.speedY;
        p.x += p.speedX + gust + Math.sin(p.step) * 0.6;
        p.rotation += p.rotSpeed;

        if (p.y > this.height + 15 || p.x > this.width + 25) {
          p.y = -10;
          p.x = Math.random() * (this.width * 0.6);
        }

        this.ctx.save();
        this.ctx.translate(Math.floor(p.x), Math.floor(p.y));
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 1.4);
        this.ctx.restore();
      });
    }

    // 4. ĐÊM SAO & ĐOM ĐÓM (Night)
    else if (this.weather === "night") {
      // Đom đóm phát sáng dập dờn
      this.ambientParticles.forEach(p => {
        p.pulse += p.pulseSpeed;
        p.x += p.vx;
        p.y += p.vy;

        // Giữ đom đóm trong khoảng giữa màn hình
        if (p.x < 10) p.vx = Math.abs(p.vx) + 0.1;
        if (p.x > this.width - 10) p.vx = -Math.abs(p.vx) - 0.1;
        if (p.y < 60) p.vy = Math.abs(p.vy) + 0.1;
        if (p.y > this.height - 180) p.vy = -Math.abs(p.vy) - 0.1;

        // Thay đổi hướng nhẹ nhàng ngẫu nhiên
        if (Math.random() < 0.02) {
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;
          p.vx = Math.max(-1.2, Math.min(1.2, p.vx));
          p.vy = Math.max(-1.2, Math.min(1.2, p.vy));
        }

        const glow = 0.35 + 0.65 * Math.sin(p.pulse);
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.1, glow);

        // Vòng sáng hào quang
        this.ctx.fillStyle = "rgba(254, 240, 138, 0.25)";
        this.ctx.fillRect(Math.floor(p.x - 3), Math.floor(p.y - 3), p.size + 6, p.size + 6);

        // Hạt đom đóm trung tâm
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        this.ctx.restore();
      });

      // Sao băng định kỳ
      this.shootingStarTimer++;
      if (this.shootingStarTimer > 320 && Math.random() < 0.03) {
        this.spawnShootingStar();
        this.shootingStarTimer = 0;
      }

      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const s = this.shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0 || s.x < -50 || s.y > this.height) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, s.life);
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x, s.y);
        this.ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
        this.ctx.stroke();

        // Đầu sao sáng rực
        this.ctx.fillStyle = "#fef08a";
        this.ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 4, 4);
        this.ctx.restore();
      }
    }

    // ==========================================
    // B. VẼ CÁC HẠT HIỆU ỨNG TƯƠNG TÁC (Particles)
    // ==========================================
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.gravity) {
        p.vy += p.gravity;
      }

      p.life -= p.decay;
      const alpha = Math.max(0, p.life);

      if (p.type === "pixel-heart") {
        this.drawPixelHeart(this.ctx, p.x, p.y, p.scale, p.color, alpha);
      } else if (p.type === "pixel-star") {
        this.drawPixelStar(this.ctx, p.x, p.y, p.scale, p.color, alpha);
      } else if (p.type === "bubble-pop" || p.type === "rain-splash") {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.scale, p.scale);
        this.ctx.restore();
      } else if (p.type === "pixel-tear" || p.type === "pixel-crumb") {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = p.color;
        const sz = p.scale * 2;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), sz, sz);
        this.ctx.restore();
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.PixelParticleEngine = PixelParticleEngine;
window.ParticleEngine = PixelParticleEngine;
