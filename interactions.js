/**
 * Retro Pixel Interactions & Game Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  const particleEngine = new PixelParticleEngine("particle-canvas");
  window.particleEngine = particleEngine;

  const characters = new ChiikawaPixelCharacters();
  window.chiikawaCharacters = characters;

  const games = new ChiikawaGames();
  window.chiikawaGames = games;

  initDragAndDrop(characters, games);
  initLoveCounter();
  initModals();
  initBGMControl();
  initChaosButton(characters);
  initDockTabs();
  initSkyTapSparkles();
});

// Chạm vào khoảng trống bầu trời tạo bụi sao 8-bit lấp lánh
function initSkyTapSparkles() {
  const handleTap = (clientX, clientY, target) => {
    if (target.closest("button, .btn-icon, .food-item, .pixel-sprite-wrapper, .modal-content, .lucky-balloon, .dock-tab, .cloud-bob")) {
      return;
    }
    if (window.particleEngine && window.particleEngine.spawnSparkles) {
      window.particleEngine.spawnSparkles(clientX, clientY, 5);
    }
  };

  document.addEventListener("click", (e) => {
    handleTap(e.clientX, e.clientY, e.target);
  });

  document.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      handleTap(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }
  }, { passive: true });
}

// ==========================================
// 0. CHUYỂN ĐỔI TAB DOCK RETRO CONSOLE
// ==========================================
function initDockTabs() {
  const tabs = document.querySelectorAll(".dock-tab");
  const panels = document.querySelectorAll(".dock-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");

      if (window.chiikawaAudio) window.chiikawaAudio.playSquish();
    });
  });
}

// ==========================================
// 1. KÉO THẢ THỨC ĂN PIXEL ART (8 MÓN ĂN)
// ==========================================
function initDragAndDrop(characters, games) {
  const foodItems = document.querySelectorAll(".food-item");
  const charElements = [
    { name: "chiikawa", el: document.getElementById("char-chiikawa") },
    { name: "hachiware", el: document.getElementById("char-hachiware") },
    { name: "usagi", el: document.getElementById("char-usagi") }
  ];

  foodItems.forEach(item => {
    let activeClone = null;
    const foodType = item.dataset.food;

    // Desktop Mouse Drag
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);

      const onMouseMove = (moveEvent) => {
        moveDrag(moveEvent.clientX, moveEvent.clientY);
      };

      const onMouseUp = (upEvent) => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        endDrag(upEvent.clientX, upEvent.clientY);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });

    // Mobile Touch Drag
    item.addEventListener("touchstart", (e) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);

      const onTouchMove = (moveEvent) => {
        if (!moveEvent.touches[0]) return;
        if (moveEvent.cancelable) moveEvent.preventDefault();
        moveDrag(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
      };

      const onTouchEnd = (endEvent) => {
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        const lastTouch = endEvent.changedTouches ? endEvent.changedTouches[0] : null;
        if (lastTouch) endDrag(lastTouch.clientX, lastTouch.clientY);
      };

      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    }, { passive: false });

    // Click trực tiếp để cho ăn nhanh
    item.addEventListener("click", () => {
      const randomChar = charElements[Math.floor(Math.random() * charElements.length)].name;
      characters.feedCharacter(randomChar, foodType);
      if (games) games.feedStats(15);
    });

    function startDrag(x, y) {
      if (window.chiikawaAudio) window.chiikawaAudio.playSquish();

      const img = item.querySelector("img");
      if (!img) return;

      activeClone = document.createElement("img");
      activeClone.src = img.src;
      activeClone.className = "dragging-pixel-food";
      document.body.appendChild(activeClone);

      moveDrag(x, y);
    }

    function moveDrag(x, y) {
      if (!activeClone) return;
      activeClone.style.left = `${x}px`;
      activeClone.style.top = `${y}px`;
    }

    function endDrag(x, y) {
      if (!activeClone) return;

      let fed = false;
      charElements.forEach(char => {
        if (!char.el) return;
        const rect = char.el.getBoundingClientRect();
        const padding = 50;
        if (
          x >= rect.left - padding &&
          x <= rect.right + padding &&
          y >= rect.top - padding &&
          y <= rect.bottom + padding
        ) {
          characters.feedCharacter(char.name, foodType);
          if (games) games.feedStats(20);
          fed = true;
        }
      });

      if (activeClone) {
        if (activeClone.parentElement) {
          activeClone.parentElement.removeChild(activeClone);
        }
        activeClone = null;
      }
    }
  });
}

// ==========================================
// 2. ĐẾM NGÀY KHÁM PHÁ (CHIIKAWA TIMER)
// ==========================================
function initLoveCounter() {
  const counterEl = document.getElementById("love-counter-days");
  const detailEl = document.getElementById("love-counter-detail");
  const coupleNamesEl = document.getElementById("couple-names");

  const config = window.CHIIKAWA_CONFIG || {};
  const couple = config.couple || {};

  if (coupleNamesEl) {
    coupleNamesEl.textContent = config.appName || "Thế Giới Chiikawa";
  }

  const startDate = new Date(couple.startDate || "2024-01-01");

  function update() {
    const now = new Date();
    const diffTime = Math.abs(now - startDate);

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const seconds = Math.floor((diffTime / 1000) % 60);

    if (counterEl) counterEl.textContent = `${days}`;
    if (detailEl) detailEl.textContent = `${hours}H ${minutes}M ${seconds}S`;
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 3. QUẢN LÝ MODAL (CHỨNG NHẬN & QUẺ BÓI)
// ==========================================
function initModals() {
  // Modal Bằng Chứng Nhận Retro
  const certBtn = document.getElementById("btn-certificate");
  const certModal = document.getElementById("modal-certificate");
  const certClose = document.getElementById("close-certificate");

  if (certBtn && certModal) {
    certBtn.addEventListener("click", () => {
      populateCertificateData();
      certModal.classList.add("modal-open");

      if (window.chiikawaAudio) window.chiikawaAudio.playCelebration();

      if (typeof confetti === "function") {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    });

    if (certClose) {
      certClose.addEventListener("click", () => certModal.classList.remove("modal-open"));
    }
  }

  // Modal Quẻ Bói / Thư Bí Mật (Omikuji)
  const fortuneBtn = document.getElementById("btn-fortune");
  const fortuneModal = document.getElementById("modal-fortune");
  const fortuneClose = document.getElementById("close-fortune");
  const fortuneCard = document.getElementById("fortune-card");

  if (fortuneBtn && fortuneModal) {
    fortuneBtn.addEventListener("click", () => {
      openFortuneCard();
      fortuneModal.classList.add("modal-open");
      if (window.chiikawaAudio) window.chiikawaAudio.playSparkle();
    });

    if (fortuneClose) {
      fortuneClose.addEventListener("click", () => fortuneModal.classList.remove("modal-open"));
    }

    if (fortuneCard) {
      fortuneCard.addEventListener("click", () => {
        openFortuneCard();
        if (window.chiikawaAudio) window.chiikawaAudio.playSquish();
      });
    }
  }

  // Modal Sổ Tay Khám Phá & Hướng Dẫn Tính Năng
  const guideBtn = document.getElementById("btn-guide-modal");
  const guideModal = document.getElementById("modal-guide");
  const guideClose = document.getElementById("close-guide");
  const guideFootClose = document.getElementById("btn-close-guide-foot");

  if (guideBtn && guideModal) {
    guideBtn.addEventListener("click", () => {
      guideModal.classList.add("modal-open");
      if (window.chiikawaAudio && window.chiikawaAudio.playSparkle) {
        window.chiikawaAudio.playSparkle();
      }
    });

    const closeGuideFn = () => guideModal.classList.remove("modal-open");
    if (guideClose) guideClose.addEventListener("click", closeGuideFn);
    if (guideFootClose) {
      guideFootClose.addEventListener("click", () => {
        closeGuideFn();
        if (window.chiikawaAudio && window.chiikawaAudio.playCelebration) {
          window.chiikawaAudio.playCelebration();
        }
      });
    }
  }

  window.addEventListener("click", (e) => {
    if (e.target === certModal) certModal.classList.remove("modal-open");
    if (e.target === fortuneModal) fortuneModal.classList.remove("modal-open");
    if (e.target === guideModal) guideModal.classList.remove("modal-open");
  });
}

function populateCertificateData() {
  const config = window.CHIIKAWA_CONFIG || {};
  const couple = config.couple || {};
  const cert = config.certificate || {};

  const nameEl = document.getElementById("cert-name");
  const titleEl = document.getElementById("cert-title");
  const subtitleEl = document.getElementById("cert-subtitle");
  const rankEl = document.getElementById("cert-rank");
  const textEl = document.getElementById("cert-text");
  const stampEl = document.getElementById("cert-stamp-text");
  const dateEl = document.getElementById("cert-date");

  if (nameEl) nameEl.textContent = (config.player && config.player.name) || "Nhà Thám Hiểm Chiikawa";
  if (titleEl) titleEl.textContent = cert.title || "GIẤY CHỨNG NHẬN DŨNG SĨ";
  if (subtitleEl) subtitleEl.textContent = cert.subtitle || "Hiệp Hội Thám Hiểm Chiikawa (Cấp 1)";
  if (rankEl) rankEl.textContent = cert.rank || "CẤP ĐỘ 1 (CHỨNG CHỈ XUẤT SẮC)";
  if (textEl) textEl.textContent = cert.officialText || "";
  if (stampEl) stampEl.textContent = cert.stampText || "HIỆP HỘI CHIIKAWA ĐÃ CẤP 💮";

  if (dateEl) {
    const today = new Date();
    dateEl.textContent = `NGÀY CẤP: ${today.toLocaleDateString("vi-VN")}`;
  }
}

function openFortuneCard() {
  const config = window.CHIIKAWA_CONFIG || {};
  const fortunes = config.loveFortunes || [];
  if (fortunes.length === 0) return;

  const card = fortunes[Math.floor(Math.random() * fortunes.length)];
  const titleEl = document.getElementById("fortune-result-title");
  const textEl = document.getElementById("fortune-result-text");

  if (titleEl) titleEl.textContent = card.title;
  if (textEl) textEl.textContent = card.text;
}

// ==========================================
// 4. BẬT/TẮT NHẠC NỀN 8-BIT
// ==========================================
function initBGMControl() {
  const bgmBtn = document.getElementById("btn-bgm-toggle");
  if (!bgmBtn) return;

  bgmBtn.addEventListener("click", () => {
    if (window.chiikawaAudio) {
      const isPlaying = window.chiikawaAudio.toggleBGM();
      if (isPlaying) {
        bgmBtn.classList.add("playing");
        bgmBtn.textContent = "🎵";
        showPixelToast("🎵 Nhạc nền: BẬT");
      } else {
        bgmBtn.classList.remove("playing");
        bgmBtn.textContent = "🔇";
        showPixelToast("🔇 Nhạc nền: TẮT");
      }
    }
  });
}

// ==========================================
// 5. NÚT USAGI CHAOS (TĂNG ĐỘNG BERSERK)
// ==========================================
function initChaosButton(characters) {
  const chaosBtn = document.getElementById("btn-chaos-mode");
  if (!chaosBtn) return;

  chaosBtn.addEventListener("click", () => {
    characters.triggerUsagiChaos();
  });
}

// ==========================================
// 6. THÔNG BÁO RETRO PIXEL TOAST
// ==========================================
function showPixelToast(msg) {
  let toast = document.getElementById("pixel-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "pixel-toast";
    toast.className = "pixel-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  if (toast._timer) clearTimeout(toast._timer);
  const displayTime = Math.max(2800, Math.min(5500, msg.length * 65));
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, displayTime);
}
window.showPixelToast = showPixelToast;

