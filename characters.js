/**
 * Chiikawa Pixel Art Character Engine & Interactive Actions
 * - Idle 2-frame loop
 * - Petting & Tickle gestures
 * - Pajama Party Synchronized Dance
 * - Whisper / Tâm sự tương tác
 */

class ChiikawaPixelCharacters {
  constructor() {
    this.chiikawaEl = document.getElementById("char-chiikawa");
    this.hachiwareEl = document.getElementById("char-hachiware");
    this.usagiEl = document.getElementById("char-usagi");

    this.states = {
      chiikawa: { current: "idle1", timer: null, petCount: 0 },
      hachiware: { current: "idle1", timer: null, petCount: 0 },
      usagi: { current: "idle1", timer: null, petCount: 0 }
    };

    this.idleTick = 0;
    this.usagiChaosActive = false;
    this.isDancing = false;

    this.renderPixelSprites();
    this.startIdleLoop();
    this.initInteractions();
    this.initTickleGestures();
  }

  // Render thẻ <img> pixel art với integer scaling
  renderPixelSprites() {
    if (this.chiikawaEl) {
      this.chiikawaEl.innerHTML = `
        <div class="pixel-sprite-wrapper" id="wrap-chiikawa">
          <img class="pixel-sprite" id="sprite-chiikawa" src="assets/sprites/chiikawa_idle1.png" alt="Chiikawa" draggable="false">
          <div class="pixel-shadow"></div>
        </div>
      `;
    }
    if (this.hachiwareEl) {
      this.hachiwareEl.innerHTML = `
        <div class="pixel-sprite-wrapper" id="wrap-hachiware">
          <img class="pixel-sprite" id="sprite-hachiware" src="assets/sprites/hachiware_idle1.png" alt="Hachiware" draggable="false">
          <div class="pixel-shadow"></div>
        </div>
      `;
    }
    if (this.usagiEl) {
      this.usagiEl.innerHTML = `
        <div class="pixel-sprite-wrapper" id="wrap-usagi">
          <img class="pixel-sprite" id="sprite-usagi" src="assets/sprites/usagi_idle1.png" alt="Usagi" draggable="false">
          <div class="pixel-shadow"></div>
        </div>
      `;
    }
  }

  // Vòng lặp nhịp thở 2-frame retro chuẩn game 16-bit
  startIdleLoop() {
    setInterval(() => {
      if (this.isDancing) return;
      this.idleTick = (this.idleTick + 1) % 2;
      const frameName = this.idleTick === 0 ? "idle1" : "idle2";

      ["chiikawa", "hachiware", "usagi"].forEach(name => {
        if (this.states[name].current.startsWith("idle")) {
          this.setSpriteFrame(name, frameName, false);
        }
      });
    }, 600);
  }

  setSpriteFrame(charName, frame, restoreIdleAfterMs = 0) {
    const img = document.getElementById(`sprite-${charName}`);
    if (!img) return;

    img.src = `assets/sprites/${charName}_${frame}.png`;
    this.states[charName].current = frame;

    if (restoreIdleAfterMs > 0) {
      if (this.states[charName].timer) clearTimeout(this.states[charName].timer);
      this.states[charName].timer = setTimeout(() => {
        if (!this.isDancing) {
          this.states[charName].current = "idle1";
          img.src = `assets/sprites/${charName}_idle1.png`;
        }
      }, restoreIdleAfterMs);
    }
  }

  initInteractions() {
    this.setupCharacterClick(this.chiikawaEl, () => this.onChiikawaClick());
    this.setupCharacterClick(this.hachiwareEl, () => this.onHachiwareClick());
    this.setupCharacterClick(this.usagiEl, () => this.onUsagiClick());
  }

  setupCharacterClick(el, callback) {
    if (!el) return;
    el.addEventListener("click", () => {
      if (this.isDancing) return;
      callback();
      if (window.chiikawaGames) window.chiikawaGames.petStats();
    });
  }

  // ==========================================
  // CÙ LÉT & VUỐT VE (TICKLE GESTURE)
  // ==========================================
  initTickleGestures() {
    ["chiikawa", "hachiware", "usagi"].forEach(name => {
      const el = document.getElementById(`char-${name}`);
      if (!el) return;

      let lastMove = 0;
      const onMove = (e) => {
        const now = Date.now();
        if (now - lastMove > 100) {
          lastMove = now;
          this.states[name].petCount++;

          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          if (this.states[name].petCount >= 8) {
            this.states[name].petCount = 0;
            this.triggerTickle(name, cx, cy);
          }
        }
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("touchmove", onMove, { passive: true });
    });
  }

  triggerTickle(charName, cx, cy) {
    if (window.chiikawaAudio) window.chiikawaAudio.playSquish();
    if (window.particleEngine) window.particleEngine.spawnHearts(cx, cy, 8);
    if (window.chiikawaGames) window.chiikawaGames.petStats();

    this.bounceElement(`#wrap-${charName}`);

    const bubble = document.getElementById(`bubble-${charName}`);
    if (bubble) {
      const giggleLines = {
        chiikawa: "Hihihi nhột quá à! Bạn xoa đầu Chiikawa hoài nha~ 🤍",
        hachiware: "Purrr~ Thích quá! Xoa lưng xoa tai Hachiware đã ghê! 💙",
        usagi: "PULULU!! YA-HA!! NHỘT QUÁ NHỘT QUÁ!! 💛"
      };
      bubble.textContent = giggleLines[charName] || "Hihi~";
      bubble.classList.add("bubble-visible");
      setTimeout(() => bubble.classList.remove("bubble-visible"), 3000);
    }
  }

  onChiikawaClick() {
    const rect = this.chiikawaEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const isCrying = Math.random() > 0.45;

    if (isCrying) {
      this.setSpriteFrame("chiikawa", "cry", 2200);
      if (window.chiikawaAudio) window.chiikawaAudio.playChiikawaWhimper();
      if (window.particleEngine) window.particleEngine.spawnTears(cx, cy);
      this.bounceElement("#wrap-chiikawa");
    } else {
      this.setSpriteFrame("chiikawa", "happy", 1800);
      if (window.chiikawaAudio) window.chiikawaAudio.playSparkle();
      if (window.particleEngine) window.particleEngine.spawnHearts(cx, cy);
      this.hopElement("#wrap-chiikawa", 20);
    }

    this.showSpeechBubble("chiikawa");
  }

  onHachiwareClick() {
    const rect = this.hachiwareEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    this.setSpriteFrame("hachiware", "cheer", 2000);
    if (window.chiikawaAudio) window.chiikawaAudio.playHachiwareCheer();
    if (window.particleEngine) window.particleEngine.spawnHearts(cx, cy);

    this.hopElement("#wrap-hachiware", 22);
    this.showSpeechBubble("hachiware");
  }

  onUsagiClick() {
    const rect = this.usagiEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    this.setSpriteFrame("usagi", "chaos", 2200);
    if (window.chiikawaAudio) window.chiikawaAudio.playUsagiYaha();
    if (window.particleEngine) window.particleEngine.spawnStars(cx, cy);

    this.hopElement("#wrap-usagi", 35);
    this.showSpeechBubble("usagi");
  }

  hopElement(selector, height = 20) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.remove("pixel-hop");
    void el.offsetWidth;
    el.style.setProperty("--hop-height", `-${height}px`);
    el.classList.add("pixel-hop");
  }

  bounceElement(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.remove("pixel-shake");
    void el.offsetWidth;
    el.classList.add("pixel-shake");
  }

  feedCharacter(charName, foodType) {
    const charEl = document.getElementById(`char-${charName}`);
    if (!charEl) return;

    const rect = charEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    this.setSpriteFrame(charName, "eat", 1800);

    if (window.chiikawaAudio) window.chiikawaAudio.playMunch();
    if (window.particleEngine) {
      window.particleEngine.spawnCrumbs(cx, cy);
      window.particleEngine.spawnHearts(cx, cy, 8);
    }

    this.hopElement(`#wrap-${charName}`, 16);

    const bubble = document.getElementById(`bubble-${charName}`);
    if (bubble) {
      const foodNames = {
        pudding: "Bánh Pudding caramen núng nính",
        onigiri: "Cơm nắm Onigiri rong biển",
        ramen: "Tô mì Ramen Ro- siêu ngon",
        candy: "Kẹo dâu ngọt ngào",
        melon: "Melon Soda kem tuyết mát lạnh",
        taiyaki: "Bánh cá Taiyaki nóng hổi",
        dango: "Bánh Dango 3 màu dẻo bùi",
        meat: "Đùi thịt nướng hảo hạng"
      };
      const text = foodNames[foodType] || "món ngon";
      bubble.textContent = `Yummm! ${text} ngon tuyệt đỉnh luôn! 💖`;
      bubble.classList.add("bubble-visible");
      setTimeout(() => bubble.classList.remove("bubble-visible"), 3500);
    }
  }

  showSpeechBubble(charName, customText = null, duration = 4000) {
    const bubble = document.getElementById(`bubble-${charName}`);
    if (!bubble) return;

    let textToDisplay = customText;
    if (!textToDisplay) {
      const quotes = window.CHIIKAWA_CONFIG ? window.CHIIKAWA_CONFIG.quotes[charName] : [];
      if (!quotes || quotes.length === 0) return;
      textToDisplay = quotes[Math.floor(Math.random() * quotes.length)];
    }

    bubble.textContent = textToDisplay;

    bubble.classList.remove("bubble-visible");
    void bubble.offsetWidth;
    bubble.classList.add("bubble-visible");

    if (bubble.hideTimeout) clearTimeout(bubble.hideTimeout);
    bubble.hideTimeout = setTimeout(() => {
      bubble.classList.remove("bubble-visible");
    }, duration);
  }

  // ==========================================
  // VŨ ĐIỆU PAJAMA PARTIES DANCE
  // ==========================================
  triggerDanceParty() {
    if (this.isDancing) return;
    this.isDancing = true;

    if (window.chiikawaAudio) {
      window.chiikawaAudio.playCelebration();
      if (!window.chiikawaAudio.bgmPlaying) {
        window.chiikawaAudio.startBGM();
      }
    }

    // Các bé đồng loạt nhảy múa lắc lư
    const wraps = ["#wrap-chiikawa", "#wrap-hachiware", "#wrap-usagi"];
    wraps.forEach((w, idx) => {
      const el = document.querySelector(w);
      if (el) el.classList.add("pixel-dancing");
    });

    this.setSpriteFrame("chiikawa", "happy");
    this.setSpriteFrame("hachiware", "cheer");
    this.setSpriteFrame("usagi", "chaos");

    // Bắn mưa tim và sao
    const interval = setInterval(() => {
      if (!this.isDancing) {
        clearInterval(interval);
        return;
      }
      if (window.particleEngine) {
        window.particleEngine.spawnHearts(window.innerWidth * 0.35, window.innerHeight * 0.45, 4);
        window.particleEngine.spawnStars(window.innerWidth * 0.65, window.innerHeight * 0.45, 4);
      }
    }, 300);

    setTimeout(() => {
      this.isDancing = false;
      wraps.forEach(w => {
        const el = document.querySelector(w);
        if (el) el.classList.remove("pixel-dancing");
      });
      this.setSpriteFrame("chiikawa", "idle1");
      this.setSpriteFrame("hachiware", "idle1");
      this.setSpriteFrame("usagi", "idle1");
    }, 6000);
  }

  // Usagi Berserk Tornado
  triggerUsagiChaos() {
    if (this.usagiChaosActive) return;
    this.usagiChaosActive = true;

    if (window.chiikawaAudio) {
      window.chiikawaAudio.playUsagiYaha();
      setTimeout(() => window.chiikawaAudio.playCelebration(), 400);
    }

    const wrap = document.getElementById("wrap-usagi");
    const overlay = document.getElementById("chaos-overlay");
    if (overlay) overlay.classList.add("active");

    this.setSpriteFrame("usagi", "chaos", 3500);
    wrap.classList.add("usagi-tornado");

    const interval = setInterval(() => {
      if (!this.usagiChaosActive) {
        clearInterval(interval);
        return;
      }
      if (window.particleEngine) {
        window.particleEngine.spawnStars(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight * 0.75,
          6
        );
      }
    }, 150);

    setTimeout(() => {
      this.usagiChaosActive = false;
      wrap.classList.remove("usagi-tornado");
      if (overlay) overlay.classList.remove("active");
      this.setSpriteFrame("usagi", "idle1", 0);
    }, 3500);
  }
}

window.ChiikawaPixelCharacters = ChiikawaPixelCharacters;
