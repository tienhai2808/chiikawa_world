/**
 * 8-Bit Chiptune Retro Audio Synthesizer & Multi-track Jukebox
 */

class ChiikawaPixelAudio {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.currentTrack = 0; // 0: Town, 1: Lullaby, 2: Battle
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // 1. Tiếng chạm / bóp má
  playSquish() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(660, now + 0.04);
    osc.frequency.setValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 2. Chiikawa khóc mếu
  playChiikawaWhimper() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [784, 698, 659, 587];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + idx * 0.06;

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, st);
      osc.frequency.linearRampToValueAtTime(freq - 40, st + 0.08);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.1);
    });
  }

  // 3. Hachiware cổ vũ
  playHachiwareCheer() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const arpeggio = [523, 659, 784, 1046, 1318];

    arpeggio.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + idx * 0.05;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.3, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.14);
    });
  }

  // 4. Usagi nhảy hú "YAHA!"
  playUsagiYaha() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [659, 880, 1174, 1568, 2093];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + idx * 0.035;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.28, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.1);
    });
  }

  // 5. Tiếng ăn nhồm nhoàm
  playMunch() {
    this.ensureContext();
    if (!this.ctx) return;
    for (let i = 0; i < 3; i++) {
      const st = this.ctx.currentTime + i * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(320 - i * 40, st);
      osc.frequency.exponentialRampToValueAtTime(120, st + 0.06);

      gain.gain.setValueAtTime(0.35, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.08);
    }
  }

  // 6. Tiếng nhổ cỏ (Pop sound)
  playWeedPull() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 7. Tiếng gậy Sasumata đập quái vật (Whack impact)
  playMonsterHit() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // 8. Tiếng nhặt xu (8-bit coin)
  playCoin() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 9. Tiếng quay Gacha
  playGacha() {
    this.ensureContext();
    if (!this.ctx) return;
    for (let i = 0; i < 5; i++) {
      const st = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(500 + (i % 2) * 200, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + 0.07);
    }
  }

  // 10. Tiếng chụp ảnh Polaroid (Shutter click)
  playCameraShutter() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // 11. Tiếng hứng được bánh ngon (Catcher good)
  playCatchGood() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.setValueAtTime(1100, now + 0.06);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // 12. Tiếng đụng phải gai / sâu bọ (Catcher bad)
  playCatchBad() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(110, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  // 11. Fanfare chúc mừng
  playCelebration() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const seq = [
      { f: 523, d: 0.1 }, { f: 523, d: 0.1 }, { f: 523, d: 0.1 },
      { f: 659, d: 0.3 }, { f: 784, d: 0.15 }, { f: 659, d: 0.15 }, { f: 784, d: 0.5 }
    ];

    let t = now;
    seq.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(n.f, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d * 0.9);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + n.d);
      t += n.d;
    });
  }

  playSparkle() {
    this.playCoin();
  }

  // ==========================================
  // MULTI-TRACK 8-BIT JUKEBOX
  // ==========================================
  getTrackNames() {
    return ["Chiikawa Town 🌸", "Sweet Lullaby 🌙", "Battle Theme ⚔️"];
  }

  nextTrack() {
    this.currentTrack = (this.currentTrack + 1) % 3;
    if (this.bgmPlaying) {
      this.stopBGM();
      this.startBGM();
    }
    return this.currentTrack;
  }

  toggleBGM() {
    this.ensureContext();
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  startBGM() {
    if (!this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;

    // Track 0: Chiikawa Town
    const track0 = [
      { f: 523.25, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.2 }, { f: 1046.50, d: 0.4 },
      { f: 880.00, d: 0.2 }, { f: 783.99, d: 0.2 }, { f: 659.25, d: 0.4 },
      { f: 587.33, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.4 },
      { f: 880.00, d: 0.2 }, { f: 783.99, d: 0.2 }, { f: 523.25, d: 0.5 }
    ];

    // Track 1: Sweet Lullaby
    const track1 = [
      { f: 392.00, d: 0.4 }, { f: 440.00, d: 0.4 }, { f: 493.88, d: 0.4 }, { f: 587.33, d: 0.6 },
      { f: 493.88, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 329.63, d: 0.6 },
      { f: 293.66, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 392.00, d: 0.8 }
    ];

    // Track 2: Battle Theme (Fast arcade)
    const track2 = [
      { f: 220, d: 0.12 }, { f: 220, d: 0.12 }, { f: 330, d: 0.12 }, { f: 440, d: 0.12 },
      { f: 415, d: 0.12 }, { f: 392, d: 0.12 }, { f: 370, d: 0.12 }, { f: 330, d: 0.24 },
      { f: 293, d: 0.12 }, { f: 330, d: 0.12 }, { f: 440, d: 0.24 }
    ];

    const tracks = [track0, track1, track2];
    const currentMelody = tracks[this.currentTrack] || track0;

    let noteIdx = 0;
    const tick = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      const note = currentMelody[noteIdx];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.currentTrack === 1 ? "sine" : "square";
      osc.frequency.setValueAtTime(note.f, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 0.85);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + note.d);

      noteIdx = (noteIdx + 1) % currentMelody.length;
      this.bgmTimer = setTimeout(tick, note.d * 1000);
    };

    tick();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Tiếng chọc vỡ bong bóng / bóng bay (Bubble Pop)
  playPop() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Nhạc hiệu chuyển đổi thời tiết (Weather Chime)
  playWeatherChime(mode = "sunny") {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    let notes = [];
    if (mode === "sunny") {
      notes = [{ f: 523.25, d: 0.08 }, { f: 659.25, d: 0.08 }, { f: 783.99, d: 0.08 }, { f: 1046.50, d: 0.22 }];
    } else if (mode === "rain") {
      notes = [{ f: 880.00, d: 0.09 }, { f: 698.46, d: 0.09 }, { f: 587.33, d: 0.12 }, { f: 523.25, d: 0.25 }];
    } else if (mode === "sakura") {
      notes = [{ f: 587.33, d: 0.08 }, { f: 659.25, d: 0.08 }, { f: 783.99, d: 0.08 }, { f: 987.77, d: 0.22 }];
    } else {
      // night
      notes = [{ f: 659.25, d: 0.10 }, { f: 880.00, d: 0.10 }, { f: 987.77, d: 0.12 }, { f: 1318.51, d: 0.35 }];
    }

    let t = now;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = mode === "night" ? "sine" : (mode === "rain" ? "triangle" : "square");
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + n.d + 0.02);
      t += n.d * 0.9;
    });
  }
}

window.chiikawaAudio = new ChiikawaPixelAudio();
