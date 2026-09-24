/**
 * Chiikawa Pixel World - Mini-Games & Activity Engine
 * 1. Tamagotchi Stats (Love, Hunger, Energy, Coins)
 * 2. Kỳ Thi Nhổ Cỏ (草むしり検定 - Weeding Mini-Game)
 * 3. Thảo Phạt Quái Vật (討伐 - Whack-a-Monster)
 * 4. Lucky Gacha (Vòng Quay Quả Cầu Bảo Bối)
 * 5. Polaroid Photo Booth (Chụp ảnh kỷ niệm & tải ảnh)
 * 6. Day / Night Cycle Switcher
 */

class ChiikawaGames {
  constructor() {
    this.stats = {
      love: 90,
      hunger: 70,
      energy: 85,
      coins: 15
    };

    this.isNight = false;
    this.weedingTimer = null;
    this.weedingTimeLeft = 25;
    this.weedingScore = 0;
    this.monsterTimer = null;
    this.monsterTimeLeft = 25;
    this.monsterScore = 0;

    this.initStats();
    this.initWeedingGame();
    this.initMonsterGame();
    this.initCatcherGame();
    this.initDanceParty();
    this.initGacha();
    this.initPhotoBooth();
    this.initDayNightToggle();
    this.initJukebox();
  }

  // ==========================================
  // 1. TAMAGOTCHI STATS SYSTEM
  // ==========================================
  initStats() {
    this.updateStatsUI();

    // Tự động tiêu hao nhẹ sau mỗi 15s để khuyến khích người chơi chăm sóc
    setInterval(() => {
      this.stats.hunger = Math.max(10, this.stats.hunger - 1);
      this.stats.energy = Math.max(10, this.stats.energy - 1);
      this.updateStatsUI();
    }, 15000);
  }

  updateStatsUI() {
    const loveBar = document.getElementById("bar-love");
    const hungerBar = document.getElementById("bar-hunger");
    const energyBar = document.getElementById("bar-energy");
    const coinCount = document.getElementById("val-coins");

    if (loveBar) loveBar.style.width = `${this.stats.love}%`;
    if (hungerBar) hungerBar.style.width = `${this.stats.hunger}%`;
    if (energyBar) energyBar.style.width = `${this.stats.energy}%`;
    if (coinCount) coinCount.textContent = `${this.stats.coins}`;
  }

  addCoins(amount) {
    this.stats.coins += amount;
    this.updateStatsUI();
    if (window.chiikawaAudio) window.chiikawaAudio.playCoin();
  }

  feedStats(amount = 20) {
    this.stats.hunger = Math.min(100, this.stats.hunger + amount);
    this.stats.love = Math.min(100, this.stats.love + 5);
    this.updateStatsUI();
  }

  petStats() {
    this.stats.love = Math.min(100, this.stats.love + 8);
    this.updateStatsUI();
  }

  // ==========================================
  // 2. KỲ THI NHỔ CỎ (WEEDING CHALLENGE)
  // ==========================================
  initWeedingGame() {
    const btn = document.getElementById("btn-game-weeding");
    const modal = document.getElementById("modal-weeding");
    const closeBtn = document.getElementById("close-weeding");
    const startBtn = document.getElementById("btn-start-weeding");
    const field = document.getElementById("weeding-field");

    if (!btn || !modal) return;

    btn.addEventListener("click", () => {
      modal.classList.add("modal-open");
      this.resetWeedingUI();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("modal-open");
        this.stopWeedingGame();
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.startWeedingGame();
      });
    }
  }

  resetWeedingUI() {
    const startBtn = document.getElementById("btn-start-weeding");
    const resultBox = document.getElementById("weeding-result");
    const field = document.getElementById("weeding-field");
    const timerEl = document.getElementById("weeding-timer");
    const scoreEl = document.getElementById("weeding-score");

    if (startBtn) startBtn.style.display = "block";
    if (resultBox) resultBox.style.display = "none";
    if (field) field.innerHTML = "";
    if (timerEl) timerEl.textContent = "25s";
    if (scoreEl) scoreEl.textContent = "0";
  }

  startWeedingGame() {
    const startBtn = document.getElementById("btn-start-weeding");
    const resultBox = document.getElementById("weeding-result");
    const field = document.getElementById("weeding-field");
    const timerEl = document.getElementById("weeding-timer");
    const scoreEl = document.getElementById("weeding-score");

    if (startBtn) startBtn.style.display = "none";
    if (resultBox) resultBox.style.display = "none";
    if (field) field.innerHTML = "";

    this.weedingScore = 0;
    this.weedingTimeLeft = 25;
    if (scoreEl) scoreEl.textContent = "0";

    if (window.chiikawaAudio) window.chiikawaAudio.playSparkle();

    // Spawn cỏ liên tục
    const spawnInterval = setInterval(() => {
      if (this.weedingTimeLeft <= 0) {
        clearInterval(spawnInterval);
        return;
      }
      this.spawnWeed(field);
    }, 650);

    // Đồng hồ đếm ngược
    this.weedingTimer = setInterval(() => {
      this.weedingTimeLeft--;
      if (timerEl) timerEl.textContent = `${this.weedingTimeLeft}s`;

      if (this.weedingTimeLeft <= 0) {
        this.endWeedingGame();
      }
    }, 1000);
  }

  spawnWeed(field) {
    if (!field) return;
    const weed = document.createElement("div");
    weed.className = "pixel-weed-item";

    // 70% cỏ thường, 20% cỏ vàng, 10% cỏ độc
    const rand = Math.random();
    let type = "normal";
    let pts = 10;
    let coins = 1;
    let imgSrc = "assets/sprites/weed_normal.png";

    if (rand > 0.85) {
      type = "golden";
      pts = 30;
      coins = 3;
      imgSrc = "assets/sprites/weed_golden.png";
    } else if (rand > 0.72) {
      type = "danger";
      pts = -15;
      coins = 0;
      imgSrc = "assets/sprites/weed_danger.png";
    }

    weed.innerHTML = `<img src="${imgSrc}" class="weed-img" draggable="false">`;

    // Tọa độ ngẫu nhiên trong sân cỏ
    const maxX = Math.max(10, (field.clientWidth || 280) - 50);
    const maxY = Math.max(10, (field.clientHeight || 180) - 50);
    weed.style.left = `${Math.floor(Math.random() * maxX)}px`;
    weed.style.top = `${Math.floor(Math.random() * maxY)}px`;

    // Click để nhổ
    weed.addEventListener("click", () => {
      if (window.chiikawaAudio) window.chiikawaAudio.playWeedPull();

      this.weedingScore = Math.max(0, this.weedingScore + pts);
      const scoreEl = document.getElementById("weeding-score");
      if (scoreEl) scoreEl.textContent = `${this.weedingScore}`;

      if (coins > 0) this.addCoins(coins);

      // Hiệu ứng biến mất
      weed.style.transform = "scale(0) translateY(-10px)";
      setTimeout(() => {
        if (weed.parentElement) weed.parentElement.removeChild(weed);
      }, 150);
    });

    field.appendChild(weed);

    // Tự tàn sau 3s nếu không nhổ
    setTimeout(() => {
      if (weed.parentElement) {
        weed.parentElement.removeChild(weed);
      }
    }, 3200);
  }

  endWeedingGame() {
    this.stopWeedingGame();

    const resultBox = document.getElementById("weeding-result");
    const resultRank = document.getElementById("weeding-rank-text");
    const resultCoins = document.getElementById("weeding-earned-coins");

    let rank = "CHỨNG NHẬN CẤP 5 (NGƯỜI MỚI)";
    if (this.weedingScore >= 180) rank = "CHỨNG NHẬN CẤP 1 (BẬC THẦY NHỔ CỎ) 👑";
    else if (this.weedingScore >= 100) rank = "CHỨNG NHẬN CẤP 3 (CHĂM CHỈ)";

    const bonusCoins = Math.floor(this.weedingScore / 15);
    this.addCoins(bonusCoins);

    if (resultRank) resultRank.textContent = rank;
    if (resultCoins) resultCoins.textContent = `+${bonusCoins} XU THÙ LAO!`;
    if (resultBox) resultBox.style.display = "block";

    if (window.chiikawaAudio) window.chiikawaAudio.playCelebration();
    if (typeof confetti === "function") {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  }

  stopWeedingGame() {
    if (this.weedingTimer) {
      clearInterval(this.weedingTimer);
      this.weedingTimer = null;
    }
  }

  // ==========================================
  // 3. THẢO PHẠT QUÁI VẬT (MONSTER HUNT)
  // ==========================================
  initMonsterGame() {
    const btn = document.getElementById("btn-game-monster");
    const modal = document.getElementById("modal-monster");
    const closeBtn = document.getElementById("close-monster");
    const startBtn = document.getElementById("btn-start-monster");
    const holes = document.querySelectorAll(".monster-hole");

    if (!btn || !modal) return;

    btn.addEventListener("click", () => {
      modal.classList.add("modal-open");
      this.resetMonsterUI();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("modal-open");
        this.stopMonsterGame();
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.startMonsterGame(holes);
      });
    }
  }

  resetMonsterUI() {
    const startBtn = document.getElementById("btn-start-monster");
    const resultBox = document.getElementById("monster-result");
    const timerEl = document.getElementById("monster-timer");
    const scoreEl = document.getElementById("monster-score");

    if (startBtn) startBtn.style.display = "block";
    if (resultBox) resultBox.style.display = "none";
    if (timerEl) timerEl.textContent = "25s";
    if (scoreEl) scoreEl.textContent = "0";

    document.querySelectorAll(".monster-hole").forEach(h => h.innerHTML = "");
  }

  startMonsterGame(holes) {
    const startBtn = document.getElementById("btn-start-monster");
    const resultBox = document.getElementById("monster-result");
    const timerEl = document.getElementById("monster-timer");
    const scoreEl = document.getElementById("monster-score");

    if (startBtn) startBtn.style.display = "none";
    if (resultBox) resultBox.style.display = "none";

    this.monsterScore = 0;
    this.monsterTimeLeft = 25;
    if (scoreEl) scoreEl.textContent = "0";

    // Quái vật thò đầu lên
    const spawnInterval = setInterval(() => {
      if (this.monsterTimeLeft <= 0) {
        clearInterval(spawnInterval);
        return;
      }
      this.popMonster(holes);
    }, 750);

    this.monsterTimer = setInterval(() => {
      this.monsterTimeLeft--;
      if (timerEl) timerEl.textContent = `${this.monsterTimeLeft}s`;

      if (this.monsterTimeLeft <= 0) {
        this.endMonsterGame();
      }
    }, 1000);
  }

  popMonster(holes) {
    if (!holes || holes.length === 0) return;
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    if (randomHole.querySelector(".monster-sprite-pop")) return; // Đã có quái

    const monster = document.createElement("img");
    monster.src = "assets/sprites/monster_normal.png";
    monster.className = "monster-sprite-pop";
    monster.draggable = false;

    let hit = false;
    monster.addEventListener("click", () => {
      if (hit) return;
      hit = true;

      monster.src = "assets/sprites/monster_hit.png";
      if (window.chiikawaAudio) window.chiikawaAudio.playMonsterHit();

      this.monsterScore += 25;
      const scoreEl = document.getElementById("monster-score");
      if (scoreEl) scoreEl.textContent = `${this.monsterScore}`;

      this.addCoins(2);

      // Usagi hú phụ họa
      if (window.chiikawaCharacters) {
        window.chiikawaCharacters.setSpriteFrame("usagi", "chaos", 1000);
      }

      setTimeout(() => {
        if (monster.parentElement) monster.parentElement.removeChild(monster);
      }, 400);
    });

    randomHole.appendChild(monster);

    // Tự thụt xuống sau 1.2s nếu không bị đập
    setTimeout(() => {
      if (!hit && monster.parentElement) {
        monster.parentElement.removeChild(monster);
      }
    }, 1200);
  }

  endMonsterGame() {
    this.stopMonsterGame();

    const resultBox = document.getElementById("monster-result");
    const resultRank = document.getElementById("monster-rank-text");
    const resultCoins = document.getElementById("monster-earned-coins");

    const bonusCoins = Math.floor(this.monsterScore / 10);
    this.addCoins(bonusCoins);

    let title = "CHIẾN BINH TẬP SỰ 🛡️";
    if (this.monsterScore >= 250) title = "THỢ SĂN THẢO PHẠT HUYỀN THOẠI ⚔️";
    else if (this.monsterScore >= 120) title = "DŨNG SĨ DIỆT QUÁI CỪ KHÔI 🌟";

    if (resultRank) resultRank.textContent = title;
    if (resultCoins) resultCoins.textContent = `+${bonusCoins} XU THÙ LAO!`;
    if (resultBox) resultBox.style.display = "block";

    if (window.chiikawaAudio) window.chiikawaAudio.playCelebration();
    if (typeof confetti === "function") {
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
    }
  }

  stopMonsterGame() {
    if (this.monsterTimer) {
      clearInterval(this.monsterTimer);
      this.monsterTimer = null;
    }
  }

  // ==========================================
  // 4. LUCKY LOVE GACHA
  // ==========================================
  initGacha() {
    const btn = document.getElementById("btn-feature-gacha");
    const modal = document.getElementById("modal-gacha");
    const closeBtn = document.getElementById("close-gacha");
    const spinBtn = document.getElementById("btn-spin-gacha");
    const resultBox = document.getElementById("gacha-reward-card");

    if (!btn || !modal) return;

    btn.addEventListener("click", () => {
      modal.classList.add("modal-open");
      if (resultBox) resultBox.style.display = "none";
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("modal-open"));
    }

    if (spinBtn) {
      spinBtn.addEventListener("click", () => {
        if (this.stats.coins < 5) {
          alert("Em cần 5 Xu để quay Gacha nhé! Hãy chơi trò Nhổ Cỏ hoặc Thảo Phạt để kiếm thêm xu nha 🌸");
          return;
        }

        this.stats.coins -= 5;
        this.updateStatsUI();

        if (window.chiikawaAudio) window.chiikawaAudio.playGacha();

        // Animation quả cầu xoay
        const machine = document.getElementById("gacha-capsule-anim");
        if (machine) {
          machine.classList.add("gacha-spinning");
          spinBtn.disabled = true;

          setTimeout(() => {
            machine.classList.remove("gacha-spinning");
            spinBtn.disabled = false;
            this.revealGachaReward();
          }, 1500);
        }
      });
    }
  }

  revealGachaReward() {
    const config = window.CHIIKAWA_CONFIG || {};
    const rewards = config.gachaRewards || [];
    if (rewards.length === 0) return;

    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    const card = document.getElementById("gacha-reward-card");
    const titleEl = document.getElementById("gacha-item-title");
    const descEl = document.getElementById("gacha-item-desc");
    const rarityEl = document.getElementById("gacha-item-rarity");

    if (titleEl) titleEl.textContent = reward.name;
    if (descEl) descEl.textContent = reward.desc;
    if (rarityEl) {
      rarityEl.textContent = reward.rarity;
      rarityEl.className = `gacha-rarity-badge rarity-${reward.rarity.toLowerCase()}`;
    }

    if (card) {
      card.style.display = "block";
      card.classList.remove("gacha-pop");
      void card.offsetWidth;
      card.classList.add("gacha-pop");
    }

    if (window.chiikawaAudio) window.chiikawaAudio.playCelebration();
    if (typeof confetti === "function") {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  }

  // ==========================================
  // 5. POLAROID PHOTO BOOTH
  // ==========================================
  initPhotoBooth() {
    const btn = document.getElementById("btn-feature-camera");
    const modal = document.getElementById("modal-camera");
    const closeBtn = document.getElementById("close-camera");
    const downloadBtn = document.getElementById("btn-download-polaroid");

    if (!btn || !modal) return;

    btn.addEventListener("click", () => {
      this.generatePolaroid();
      modal.classList.add("modal-open");
      if (window.chiikawaAudio) window.chiikawaAudio.playCameraShutter();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("modal-open"));
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        this.downloadPolaroidImage();
      });
    }
  }

  generatePolaroid() {
    const captionEl = document.getElementById("polaroid-caption");
    const dateEl = document.getElementById("polaroid-date");

    if (captionEl) {
      captionEl.textContent = "Chiikawa & Những Người Bạn ✨";
    }
    if (dateEl) {
      const today = new Date();
      dateEl.textContent = today.toLocaleDateString("vi-VN") + " 🌟 Nantoka Nare!";
    }
  }

  downloadPolaroidImage() {
    const card = document.getElementById("polaroid-card-box");
    if (!card) return;

    // Vẽ canvas và tải ảnh
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 460;
    const ctx = canvas.getContext("2d");

    // Nền Polaroid trắng
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 400, 460);

    // Khung ảnh bên trong
    ctx.fillStyle = "#ffd3e2";
    ctx.fillRect(20, 20, 360, 320);

    // Chữ kỷ niệm
    ctx.fillStyle = "#2b201e";
    ctx.font = "bold 20px 'Chakra Petch', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Chiikawa • Hachiware • Usagi", 200, 380);

    ctx.font = "16px 'Chakra Petch', monospace";
    ctx.fillStyle = "#0284c7";
    ctx.fillText("Kỷ niệm ngày hội thảo nguyên ✨", 200, 415);

    // Tải xuống
    const link = document.createElement("a");
    link.download = "chiikawa_ky_niem.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    if (window.chiikawaAudio) window.chiikawaAudio.playCelebration();
  }

  // ==========================================
  // 6. HỆ THỐNG THỜI TIẾT 4 MÙA (WEATHER SYSTEM) & TƯƠNG TÁC BẦU TRỜI
  // ==========================================
  initDayNightToggle() {
    this.initWeatherSystem();
  }

  initWeatherSystem() {
    this.weatherModes = ["sunny", "rain", "sakura", "night"];
    this.weatherIcons = { sunny: "☀️", rain: "🌧️", sakura: "🌸", night: "🌙" };
    this.currentWeatherIndex = 0;
    this.currentWeather = "sunny";

    const toggleBtn = document.getElementById("btn-toggle-daynight");
    const celestialBody = document.getElementById("celestial-body");

    const onSwitch = (e) => {
      if (e) e.stopPropagation();
      this.cycleWeather();
    };

    if (toggleBtn) toggleBtn.addEventListener("click", onSwitch);
    if (celestialBody) celestialBody.addEventListener("click", onSwitch);

    // Khởi tạo bóng bay thư báo & tương tác mây pixel
    this.initLuckyBalloon();
    this.initFluffyClouds();
  }

  cycleWeather() {
    this.currentWeatherIndex = (this.currentWeatherIndex + 1) % this.weatherModes.length;
    const mode = this.weatherModes[this.currentWeatherIndex];
    this.setWeather(mode);
  }

  setWeather(mode) {
    this.currentWeather = mode;
    this.currentWeatherIndex = this.weatherModes.indexOf(mode);
    if (this.currentWeatherIndex === -1) this.currentWeatherIndex = 0;
    this.isNight = (mode === "night");

    // Xóa và cập nhật class body
    document.body.classList.remove("weather-sunny", "weather-rain", "weather-sakura", "weather-night", "night-theme");
    document.body.classList.add(`weather-${mode}`);
    if (mode === "night") {
      document.body.classList.add("night-theme");
    }

    // Cập nhật icon trên nút HUD
    const toggleBtn = document.getElementById("btn-toggle-daynight");
    if (toggleBtn) {
      toggleBtn.textContent = this.weatherIcons[mode] || "☀️";
    }

    // Cập nhật particle engine
    if (window.particleEngine && window.particleEngine.setWeather) {
      window.particleEngine.setWeather(mode);
    }

    // Phát âm thanh chuyển thời tiết
    if (window.chiikawaAudio && window.chiikawaAudio.playWeatherChime) {
      window.chiikawaAudio.playWeatherChime(mode);
    }

    // Thông báo Toast phong cách Retro
    const toastMessages = {
      sunny: "☀️ Nắng ấm dã ngoại & Cầu vồng rực rỡ!",
      rain: "🌧️ Trời đổ mưa rào mát rượi tí tách!",
      sakura: "🌸 Gió xuân thổi cánh hoa anh đào bay lượn!",
      night: "🌙 Đêm sao lung linh & Đom đóm phát sáng!"
    };
    if (window.showPixelToast) {
      window.showPixelToast(toastMessages[mode] || "Thời tiết thay đổi!");
    }

    // Cập nhật phản ứng thoại nhân vật
    const charComments = {
      sunny: {
        chiikawa: "Cầu vồng đẹp quá đi à! 🌈",
        hachiware: "Thời tiết dã ngoại chuẩn luôn! ☀️",
        usagi: "YAHA!! ĐI CHƠI NÀO!! 🌻"
      },
      rain: {
        chiikawa: "Trời mưa rồi... mát ghê! ☔",
        hachiware: "Mưa tí tách nghe vui tai lắm! 🌧️",
        usagi: "PULULU! TẮM MƯA ĐÊ!! ⚡"
      },
      sakura: {
        chiikawa: "Nhiều cánh hoa bay quá nè! 🌸",
        hachiware: "Gió thổi bay mát rượi luôn! 🍃",
        usagi: "URAAA! BẮT CÁNH HOA NÈ!! 🌸"
      },
      night: {
        chiikawa: "Đêm nay nhiều sao ghê á... ✨",
        hachiware: "Nhìn kìa, có đom đóm bay kìa! 🌟",
        usagi: "YAHA! QUẨY XUYÊN ĐÊM LUÔN!! 🌙"
      }
    };
    const c = charComments[mode];
    if (c && window.chiikawaCharacters) {
      if (c.chiikawa) window.chiikawaCharacters.showSpeechBubble("chiikawa", c.chiikawa, 3200);
      if (c.hachiware) window.chiikawaCharacters.showSpeechBubble("hachiware", c.hachiware, 3200);
      if (c.usagi) window.chiikawaCharacters.showSpeechBubble("usagi", c.usagi, 3200);
    }
  }

  initLuckyBalloon() {
    const balloon = document.getElementById("lucky-balloon");
    if (!balloon) return;

    const onPop = (e) => {
      if (balloon.classList.contains("popped")) return;
      e.stopPropagation();

      const rect = balloon.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      balloon.classList.add("popped");

      // Bùng nổ hạt tim và sao 8-bit
      if (window.particleEngine) {
        window.particleEngine.spawnHearts(cx, cy, 14);
        window.particleEngine.spawnStars(cx, cy, 10);
      }

      // Phát âm thanh pop & mừng
      if (window.chiikawaAudio) {
        if (window.chiikawaAudio.playPop) window.chiikawaAudio.playPop();
        setTimeout(() => {
          if (window.chiikawaAudio.playCelebration) window.chiikawaAudio.playCelebration();
        }, 120);
      }

      // Cộng xu thù lao (+3 Xu)
      this.addCoins(3);

      // Lấy bức thư ngẫu nhiên
      const config = window.CHIIKAWA_CONFIG || {};
      const notes = config.loveNotes || [
        "💌 [Thư từ Hachiware]: 'Nantoka nare!' Cùng nhau cố gắng nhé! (+3 Xu) 🪙"
      ];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];

      if (window.showPixelToast) {
        window.showPixelToast(randomNote);
      }

      // Nhân vật reo vui
      if (window.chiikawaCharacters) {
        window.chiikawaCharacters.showSpeechBubble("chiikawa", "Oa! Thư từ thảo nguyên nè! 💌", 3000);
        window.chiikawaCharacters.showSpeechBubble("hachiware", "Có thêm 3 Xu thù lao nữa nè! 🪙", 3000);
      }

      // Hồi sinh bóng bay sau 14 giây
      setTimeout(() => {
        balloon.classList.remove("popped");
      }, 14000);
    };

    balloon.addEventListener("click", onPop);
    balloon.addEventListener("touchstart", onPop, { passive: true });
  }

  initFluffyClouds() {
    const cloudBobs = document.querySelectorAll(".cloud-bob");
    cloudBobs.forEach(cloud => {
      const onTouchCloud = (e) => {
        e.stopPropagation();
        const rect = cloud.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        if (window.chiikawaAudio && window.chiikawaAudio.playSquish) {
          window.chiikawaAudio.playSquish();
        }

        if (window.particleEngine) {
          if (this.currentWeather === "rain") {
            window.particleEngine.spawnRainSplash(cx, cy);
          } else {
            window.particleEngine.spawnSparkles(cx, cy, 6);
          }
        }

        if (window.chiikawaCharacters) {
          const cloudPraise = [
            "Bé mây mềm như kẹo bông gòn vậy á! ☁️",
            "Mây bay êm đềm quá em ơi~ ✨",
            "Chạm vào mây thấy mát lạnh luôn! 🤍"
          ];
          const msg = cloudPraise[Math.floor(Math.random() * cloudPraise.length)];
          window.chiikawaCharacters.showSpeechBubble("chiikawa", msg, 2500);
        }
      };

      cloud.addEventListener("click", onTouchCloud);
      cloud.addEventListener("touchstart", onTouchCloud, { passive: true });
    });
  }

  // ==========================================
  // 7. MULTI-TRACK JUKEBOX SWITCHER
  // ==========================================
  initJukebox() {
    const jukeBtn = document.getElementById("btn-jukebox-next");
    if (!jukeBtn) return;

    jukeBtn.addEventListener("click", () => {
      if (window.chiikawaAudio) {
        const nextId = window.chiikawaAudio.nextTrack();
        const names = window.chiikawaAudio.getTrackNames();
        jukeBtn.textContent = "📻";
        if (window.showPixelToast) {
          window.showPixelToast("📻 " + names[nextId]);
        }
        window.chiikawaAudio.playSquish();
      }
    });
  }

  // ==========================================
  // 8. MINI-GAME HỨNG BÁNH PUDDING (CATCHER)
  // ==========================================
  initCatcherGame() {
    const btn = document.getElementById("btn-game-catcher");
    const modal = document.getElementById("modal-catcher");
    const closeBtn = document.getElementById("close-catcher");
    const startBtn = document.getElementById("btn-start-catcher");
    const arena = document.getElementById("catcher-arena");
    const basket = document.getElementById("catcher-basket");
    const leftBtn = document.getElementById("btn-catcher-left");
    const rightBtn = document.getElementById("btn-catcher-right");

    if (!btn || !modal) return;

    this.catcherScore = 0;
    this.catcherTimeLeft = 25;
    this.catcherTimer = null;
    this.catcherBasketX = 140;
    this.catcherActive = false;
    this.fallingItems = [];

    btn.addEventListener("click", () => {
      modal.classList.add("modal-open");
      this.resetCatcherUI();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("modal-open");
        this.stopCatcherGame();
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.startCatcherGame();
      });
    }

    // Điều khiển giỏ hứng bằng cảm ứng & chuột
    if (arena && basket) {
      const updateBasket = (clientX) => {
        if (!this.catcherActive) return;
        const rect = arena.getBoundingClientRect();
        let relX = clientX - rect.left - 24;
        relX = Math.max(0, Math.min(arena.clientWidth - 50, relX));
        this.catcherBasketX = relX;
        basket.style.left = `${this.catcherBasketX}px`;
      };

      arena.addEventListener("mousemove", (e) => updateBasket(e.clientX));
      const onTouch = (e) => {
        if (e.touches && e.touches[0]) {
          if (e.cancelable) e.preventDefault();
          updateBasket(e.touches[0].clientX);
        }
      };
      arena.addEventListener("touchstart", onTouch, { passive: false });
      arena.addEventListener("touchmove", onTouch, { passive: false });
    }

    // Nút trái phải trên mobile
    if (leftBtn) {
      leftBtn.addEventListener("click", () => {
        this.catcherBasketX = Math.max(0, this.catcherBasketX - 35);
        if (basket) basket.style.left = `${this.catcherBasketX}px`;
      });
    }
    if (rightBtn) {
      rightBtn.addEventListener("click", () => {
        const arenaW = arena ? arena.clientWidth : 320;
        this.catcherBasketX = Math.min(arenaW - 50, this.catcherBasketX + 35);
        if (basket) basket.style.left = `${this.catcherBasketX}px`;
      });
    }

    // Bàn phím máy tính
    window.addEventListener("keydown", (e) => {
      if (!this.catcherActive) return;
      if (e.key === "ArrowLeft") {
        this.catcherBasketX = Math.max(0, this.catcherBasketX - 25);
        if (basket) basket.style.left = `${this.catcherBasketX}px`;
      } else if (e.key === "ArrowRight") {
        const arenaW = arena ? arena.clientWidth : 320;
        this.catcherBasketX = Math.min(arenaW - 50, this.catcherBasketX + 25);
        if (basket) basket.style.left = `${this.catcherBasketX}px`;
      }
    });
  }

  resetCatcherUI() {
    const startBtn = document.getElementById("btn-start-catcher");
    const resultBox = document.getElementById("catcher-result");
    const timerEl = document.getElementById("catcher-timer");
    const scoreEl = document.getElementById("catcher-score");
    const arena = document.getElementById("catcher-arena");

    if (startBtn) startBtn.style.display = "block";
    if (resultBox) resultBox.style.display = "none";
    if (timerEl) timerEl.textContent = "25s";
    if (scoreEl) scoreEl.textContent = "0";

    // Xóa vật phẩm đang rơi
    if (arena) {
      arena.querySelectorAll(".falling-treat").forEach(t => t.remove());
    }
  }

  startCatcherGame() {
    const startBtn = document.getElementById("btn-start-catcher");
    const resultBox = document.getElementById("catcher-result");
    const timerEl = document.getElementById("catcher-timer");
    const arena = document.getElementById("catcher-arena");

    if (startBtn) startBtn.style.display = "none";
    if (resultBox) resultBox.style.display = "none";

    this.catcherScore = 0;
    this.catcherTimeLeft = 25;
    this.catcherActive = true;

    if (window.chiikawaAudio) window.chiikawaAudio.playSparkle();

    // Rơi vật phẩm liên tục
    const spawnTimer = setInterval(() => {
      if (!this.catcherActive || this.catcherTimeLeft <= 0) {
        clearInterval(spawnTimer);
        return;
      }
      this.dropTreat(arena);
    }, 550);

    // Vòng lặp thời gian
    this.catcherTimer = setInterval(() => {
      this.catcherTimeLeft--;
      if (timerEl) timerEl.textContent = `${this.catcherTimeLeft}s`;

      if (this.catcherTimeLeft <= 0) {
        this.endCatcherGame();
      }
    }, 1000);
  }

  dropTreat(arena) {
    if (!arena) return;

    const treats = [
      { src: "assets/sprites/food_pudding.png", pts: 15, coin: 1, type: "good" },
      { src: "assets/sprites/food_onigiri.png", pts: 10, coin: 1, type: "good" },
      { src: "assets/sprites/food_ramen.png", pts: 25, coin: 2, type: "good" },
      { src: "assets/sprites/food_candy.png", pts: 12, coin: 1, type: "good" },
      { src: "assets/sprites/catcher_hazard.png", pts: -20, coin: 0, type: "hazard" }
    ];

    const itemData = treats[Math.floor(Math.random() * treats.length)];
    const el = document.createElement("img");
    el.src = itemData.src;
    el.className = "falling-treat";
    el.draggable = false;

    const maxX = arena.clientWidth - 35;
    let posX = Math.floor(Math.random() * maxX);
    let posY = -35;
    const speed = Math.random() * 2.5 + 2.5;

    el.style.left = `${posX}px`;
    el.style.top = `${posY}px`;
    arena.appendChild(el);

    const fallInterval = setInterval(() => {
      if (!this.catcherActive || !el.parentElement) {
        clearInterval(fallInterval);
        if (el.parentElement) el.remove();
        return;
      }

      posY += speed;
      el.style.top = `${posY}px`;

      // Kiểm tra va chạm với giỏ (ở đáy sân)
      const basketY = arena.clientHeight - 45;
      if (posY >= basketY - 15 && posY <= basketY + 25) {
        if (Math.abs(posX - this.catcherBasketX) < 38) {
          // Trúng giỏ!
          clearInterval(fallInterval);
          el.remove();

          if (itemData.type === "good") {
            if (window.chiikawaAudio) window.chiikawaAudio.playCatchGood();
            this.catcherScore += itemData.pts;
            if (itemData.coin > 0) this.addCoins(itemData.coin);
          } else {
            if (window.chiikawaAudio) window.chiikawaAudio.playCatchBad();
            this.catcherScore = Math.max(0, this.catcherScore + itemData.pts);
          }

          const scoreEl = document.getElementById("catcher-score");
          if (scoreEl) scoreEl.textContent = `${this.catcherScore}`;
          return;
        }
      }

      // Rơi khỏi đáy
      if (posY > arena.clientHeight + 10) {
        clearInterval(fallInterval);
        if (el.parentElement) el.remove();
      }
    }, 25);
  }

  endCatcherGame() {
    this.stopCatcherGame();

    const resultBox = document.getElementById("catcher-result");
    const resultRank = document.getElementById("catcher-rank-text");
    const resultCoins = document.getElementById("catcher-earned-coins");

    const bonusCoins = Math.floor(this.catcherScore / 15);
    this.addCoins(bonusCoins);

    let rank = "BÉ HỨNG BÁNH NHIỆT TÌNH! 🍰";
    if (this.catcherScore >= 200) rank = "THẦN HỨNG BÁNH CHIIKAWA 👑";
    else if (this.catcherScore >= 100) rank = "TAY SĂN BÁNH CỰ PHÁCH! 🍮";

    if (resultRank) resultRank.textContent = rank;
    if (resultCoins) resultCoins.textContent = `+${bonusCoins} XU THÙ LAO!`;
    if (resultBox) resultBox.style.display = "block";

    if (window.chiikawaAudio) window.chiikawaAudio.playCelebration();
    if (typeof confetti === "function") {
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
    }
  }

  stopCatcherGame() {
    this.catcherActive = false;
    if (this.catcherTimer) {
      clearInterval(this.catcherTimer);
      this.catcherTimer = null;
    }
  }

  // ==========================================
  // 9. NÚT VŨ ĐIỆU PAJAMA PARTIES DANCE
  // ==========================================
  initDanceParty() {
    const btn = document.getElementById("btn-feature-dance");
    if (!btn) return;

    btn.addEventListener("click", () => {
      if (window.chiikawaCharacters) {
        window.chiikawaCharacters.triggerDanceParty();
      }
    });
  }
}

window.ChiikawaGames = ChiikawaGames;
