/* ================================================
   BIRTHDAY SURPRISE WEBSITE — script.js
   ================================================ */

'use strict';

/* ---- State ---- */
const state = {
  currentScreen: 1,
  musicPlaying: false,
  letterOpened: false,
  videoPlaying: false
};

/* ---- DOM References ---- */
const screens     = document.querySelectorAll('.screen');
const musicBtn    = document.getElementById('music-btn');
const musicIcon   = document.getElementById('music-icon');
const bgMusic     = document.getElementById('bg-music');
const particlesCV = document.getElementById('particles-canvas');
const imgOverlay  = document.getElementById('img-overlay');
const imgOverlayImg    = document.getElementById('img-overlay-img');
const imgOverlayCaption = document.getElementById('img-overlay-caption');
const imgOverlayClose  = document.getElementById('img-overlay-close');

/* ================================================
   PARTICLES (global floating hearts + sparkles)
   ================================================ */
(function initParticles() {
  const canvas = particlesCV;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const EMOJIS = ['❤', '✨', '🌸', '💕', '⭐'];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 0.8),
      alpha: 0.7 + Math.random() * 0.3,
      size: 10 + Math.random() * 14,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      life: 0,
      maxLife: 200 + Math.random() * 200
    };
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < 22 && Math.random() < 0.04) {
      particles.push(createParticle());
    }

    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.life++;
      const fade = 1 - p.life / p.maxLife;
      ctx.globalAlpha = p.alpha * fade;
      ctx.font = p.size + 'px serif';
      ctx.fillText(p.emoji, p.x, p.y);
    });
    ctx.globalAlpha = 1;

    particles = particles.filter(p => p.life < p.maxLife);
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ================================================
   SCREEN TRANSITION
   ================================================ */
function goToScreen(num) {
  const current = document.getElementById('screen-' + state.currentScreen);
  const next    = document.getElementById('screen-' + num);
  if (!next || state.currentScreen === num) return;

  current.classList.add('exiting');
  setTimeout(() => {
    current.classList.remove('active', 'exiting');
    next.classList.add('active');
    state.currentScreen = num;

    // Scroll to top of new screen
    next.scrollTop = 0;

    // Trigger screen-specific init
    if (num === 2) initScreen2();
    if (num === 3) initScreen3();
    if (num === 4) initScreen4();
    if (num === 5) initScreen5();
    if (num === 6) initScreen6();

    // Update nav dots
    updateNavDots(num);
  }, 500);
}

function updateNavDots(num) {
  document.querySelectorAll('.nav-dot').forEach(dot => {
    dot.classList.remove('active');
    if (parseInt(dot.dataset.target) === num) {
      dot.classList.add('active');
    }
  });
}

// Add event listeners to nav dots
document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    goToScreen(parseInt(dot.dataset.target));
  });
});

/* ================================================
   MUSIC
   ================================================ */
bgMusic.volume = 0.45;

function toggleMusic() {
  if (state.musicPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '🔇';
    state.musicPlaying = false;
  } else {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '🎵';
    state.musicPlaying = true;
  }
}

musicBtn.addEventListener('click', toggleMusic);

function startMusic() {
  musicBtn.classList.remove('hidden');
  bgMusic.play().then(() => {
    state.musicPlaying = true;
    musicIcon.textContent = '🎵';
  }).catch(() => {
    musicIcon.textContent = '🎵';
  });
}

/* ================================================
   SCREEN 1 — GIFT BOX
   ================================================ */
const openBtn = document.getElementById('open-btn');
const giftBox = document.getElementById('gift-box');
const giftSparkles = document.getElementById('gift-sparkles');

openBtn.addEventListener('click', openGift);
giftBox.addEventListener('click', openGift);

function openGift() {
  if (giftBox.classList.contains('opening')) return;

  giftBox.classList.add('opening');
  createGiftSparkles();
  startMusic();

  // Screen shake subtle
  document.body.style.animation = 'none';

  setTimeout(() => goToScreen(2), 1400);
}

function createGiftSparkles() {
  const colors = ['#ff80ab', '#ffd700', '#ce93d8', '#fff', '#ffab40'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const sp = document.createElement('div');
      sp.className = 'sparkle';
      const angle  = Math.random() * 360;
      const dist   = 60 + Math.random() * 100;
      const rad    = angle * Math.PI / 180;
      const tx     = Math.cos(rad) * dist + 'px';
      const ty     = Math.sin(rad) * dist + 'px';
      const size   = 5 + Math.random() * 12;
      sp.style.cssText = `
        left:${70 + Math.random()*20}px;
        top:${70 + Math.random()*20}px;
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        --tx:${tx}; --ty:${ty};
        box-shadow: 0 0 6px currentColor;
      `;
      giftSparkles.appendChild(sp);
      setTimeout(() => sp.remove(), 1000);
    }, i * 30);
  }
}

/* ================================================
   SCREEN 2 — HAPPY BIRTHDAY
   ================================================ */
function initScreen2() {
  startConfetti('confetti-canvas');
  spawnFloatingHearts();
}

document.getElementById('screen2-next-btn').addEventListener('click', () => goToScreen(3));

function spawnFloatingHearts() {
  const hearts = ['❤', '💕', '💖', '🌸', '✨'];
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.cssText = `
        left: ${10 + Math.random() * 80}%;
        bottom: ${10 + Math.random() * 20}%;
        font-size: ${1 + Math.random() * 1.5}rem;
        animation-duration: ${2 + Math.random() * 2}s;
      `;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 4000);
    }, i * 300);
  }
}

/* ---- Confetti engine ---- */
function startConfetti(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let running = true;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  const COLORS = ['#ff80ab','#ffd700','#ce93d8','#80deea','#fff','#ff4081','#69f0ae'];

  function createPiece() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 6,
      w: 8 + Math.random() * 10,
      h: 5 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1
    };
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pieces.length < 160 && Math.random() < 0.5) {
      for (let i = 0; i < 3; i++) pieces.push(createPiece());
    }

    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height * 0.8) p.alpha -= 0.015;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });

    pieces = pieces.filter(p => p.alpha > 0 && p.y < canvas.height + 30);
    requestAnimationFrame(loop);
  }
  loop();

  // Stop after 8s
  setTimeout(() => { running = false; ctx.clearRect(0,0,canvas.width,canvas.height); }, 8000);
}

/* ================================================
   SCREEN 3 — PHOTO MEMORIES
   ================================================ */
function initScreen3() {
  // Stagger card entrance
  const cards = document.querySelectorAll('.polaroid-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'rotate(var(--rot,-2deg)) translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s';
      card.style.opacity = '1';
      card.style.transform = 'rotate(var(--rot,-2deg)) translateY(0)';
    }, i * 80);
  });

  // Click to open overlay
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      const cap = card.dataset.caption;
      imgOverlayImg.src = src;
      imgOverlayCaption.textContent = cap;
      imgOverlay.classList.add('active');
      // Heart burst
      spawnFloatingHearts();
    });
  });
}

imgOverlayClose.addEventListener('click', () => imgOverlay.classList.remove('active'));
imgOverlay.addEventListener('click', (e) => {
  if (e.target === imgOverlay) imgOverlay.classList.remove('active');
});

document.getElementById('screen3-next-btn').addEventListener('click', () => goToScreen(4));

/* ================================================
   SCREEN 4 — VIDEO
   ================================================ */
// Declare these first so initScreen4 can reference them
const video         = document.getElementById('birthday-video');
const playOverlay   = document.getElementById('video-play-overlay');
const videoEndMsg   = document.getElementById('video-end-msg');
const videoHeartsOv = document.getElementById('video-hearts-overlay');

function initScreen4() {
  // Reset video state when entering screen
  video.pause();
  video.currentTime = 0;
  playOverlay.classList.remove('hide', 'hidden');
  playOverlay.style.display = '';
  videoEndMsg.classList.add('hidden');
  stopVideoHearts();
}

function showVideoEndMessage() {
  stopVideoHearts();
  videoEndMsg.classList.remove('hidden');
}

playOverlay.addEventListener('click', () => {
  playOverlay.classList.add('hide');

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Video playing fine
        state.videoPlaying = true;
        startVideoHearts();
      })
      .catch(() => {
        // Video failed to play (missing file / format) — show end message right away
        showVideoEndMessage();
      });
  } else {
    state.videoPlaying = true;
    startVideoHearts();
  }
});

// When video ends naturally
video.addEventListener('ended', showVideoEndMessage);

// If video errors (missing file etc) — show end message
video.addEventListener('error', () => {
  playOverlay.classList.add('hide');
  showVideoEndMessage();
});

let videoHeartsInterval;
function startVideoHearts() {
  const hearts = ['❤', '💕', '🌸'];
  videoHeartsInterval = setInterval(() => {
    const h = document.createElement('span');
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.cssText = `
      position: absolute;
      left: ${10 + Math.random()*80}%;
      bottom: 5%;
      font-size: ${1 + Math.random()}rem;
      animation: float-heart 2s ease forwards;
      pointer-events: none;
    `;
    videoHeartsOv.appendChild(h);
    setTimeout(() => h.remove(), 2100);
  }, 1200);
}
function stopVideoHearts() {
  clearInterval(videoHeartsInterval);
  videoHeartsInterval = null;
}

document.getElementById('screen4-next-btn').addEventListener('click', () => goToScreen(5));

/* ================================================
   SCREEN 5 — LETTER / ENVELOPE (Modal approach)
   ================================================ */
function initScreen5() {
  // Reset when entering screen
  envelope.classList.remove('open');
  closeLetter();
}

const envelope        = document.getElementById('envelope');
const envWrap         = document.getElementById('envelope-wrap');
const letterModalOv   = document.getElementById('letter-modal-overlay');
const letterContent   = document.getElementById('letter-content');
const letterModalClose = document.getElementById('letter-modal-close');
const letterModalFooter = document.getElementById('letter-modal-footer');
const screen5Next     = document.getElementById('screen5-next-btn');

// Tap envelope → open letter modal
envWrap.addEventListener('click', openEnvelope);

function openEnvelope() {
  // Flip flap open
  envelope.classList.add('open');

  // Wait for flap animation then open modal
  setTimeout(() => {
    openLetter();
  }, 500);
}

function openLetter() {
  // Show overlay
  letterModalOv.classList.add('open');

  // Reset lines
  const lines = letterContent.querySelectorAll('.letter-line');
  lines.forEach(l => {
    l.classList.remove('visible');
    l.style.opacity = '0';
  });
  letterModalFooter.style.display = 'none';

  // Animate lines one by one
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, 300 + i * 260);
  });

  // Show "Final Surprise" button after all lines
  const totalDelay = 300 + lines.length * 260 + 500;
  setTimeout(() => {
    letterModalFooter.style.display = 'flex';
    letterModalFooter.style.animation = 'fade-up 0.5s ease forwards';
  }, totalDelay);
}

function closeLetter() {
  letterModalOv.classList.remove('open');
  envelope.classList.remove('open');
  letterModalFooter.style.display = 'none';
  const lines = letterContent.querySelectorAll('.letter-line');
  lines.forEach(l => {
    l.classList.remove('visible');
    l.style.opacity = '0';
  });
}

// Close button inside modal
letterModalClose.addEventListener('click', closeLetter);

// Tap backdrop to close
letterModalOv.addEventListener('click', (e) => {
  if (e.target === letterModalOv) closeLetter();
});

// Final Surprise button
screen5Next.addEventListener('click', () => {
  letterModalOv.classList.remove('open');
  goToScreen(6);
});


/* ================================================
   SCREEN 6 — FIREWORKS
   ================================================ */
function initScreen6() {
  startFireworks();
  startConfetti('final-confetti-canvas');
}

function startFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let rockets = [];
  let particles2 = [];

  const COLORS = ['#ff80ab','#ffd700','#ce93d8','#80deea','#ff4081','#fff','#69f0ae','#ffab40'];

  function createRocket() {
    return {
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height,
      vy: -(8 + Math.random() * 6),
      vx: (Math.random() - 0.5) * 2,
      targetY: canvas.height * (0.1 + Math.random() * 0.5),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      trail: []
    };
  }

  function explode(x, y, color) {
    const count = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles2.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: Math.random() < 0.3 ? COLORS[Math.floor(Math.random() * COLORS.length)] : color,
        size: 2 + Math.random() * 3
      });
    }
  }

  let frame = 0;
  function loop2() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    frame++;
    if (frame % 55 === 0) rockets.push(createRocket());

    // Rockets
    rockets.forEach((r, i) => {
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 10) r.trail.shift();

      r.x += r.vx;
      r.y += r.vy;

      // Draw trail
      r.trail.forEach((t, ti) => {
        ctx.globalAlpha = ti / r.trail.length * 0.6;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (r.y <= r.targetY) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    });

    // Explosion particles
    particles2.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.07; // gravity
      p.vx *= 0.97;
      p.alpha -= 0.018;

      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    particles2 = particles2.filter(p => p.alpha > 0);
    requestAnimationFrame(loop2);
  }
  loop2();
}

/* ================================================
   REPLAY
   ================================================ */
document.getElementById('replay-btn').addEventListener('click', () => {
  // Reset state
  state.letterOpened = false;
  state.videoPlaying = false;

  // Reset video
  video.pause();
  video.currentTime = 0;
  playOverlay.classList.remove('hide', 'hidden');
  playOverlay.style.display = '';
  videoEndMsg.classList.add('hidden');
  stopVideoHearts();

  // Reset envelope
  envelope.classList.remove('open');
  letterPaper.classList.remove('expanding');
  const backdrop = document.querySelector('.letter-backdrop');
  if (backdrop) backdrop.remove();
  const lines = document.querySelectorAll('.letter-line');
  lines.forEach(l => l.classList.remove('visible'));
  screen5Next.classList.add('hidden');

  // Go back to screen 1
  const currentScreen = document.getElementById('screen-' + state.currentScreen);
  currentScreen.classList.remove('active');
  state.currentScreen = 1;
  document.getElementById('screen-1').classList.add('active');
  updateNavDots(1);

  // Reset gift box
  giftBox.classList.remove('opening');
  document.getElementById('gift-sparkles').innerHTML = '';
});

/* ================================================
   HELPER: animate floating hearts on tap
   ================================================ */
document.addEventListener('touchstart', (e) => {
  if (state.currentScreen === 2) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = '❤';
    const touch = e.touches[0];
    h.style.cssText = `
      left:${touch.clientX - 12}px;
      top:${touch.clientY}px;
      position:fixed;
      font-size:1.5rem;
      animation-duration:1.5s;
    `;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1600);
  }
}, { passive: true });
