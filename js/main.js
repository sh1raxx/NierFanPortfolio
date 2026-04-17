'use strict';

/* ──────────────────────────────────────────────
   BOOT SEQUENCE
   ────────────────────────────────────────────── */
const BOOT_MESSAGES = [
  { text: '> SYSTEM BOOT SEQUENCE INITIATED',         delay: 150 },
  { text: '> LOADING YoRHa TACTICAL DATABASE',        delay: 550,  ok: true },
  { text: '> ESTABLISHING BUNKER CONNECTION',          delay: 950,  ok: true },
  { text: '> VERIFYING OPERATOR CREDENTIALS',          delay: 1350, ok: true },
  { text: '> CALIBRATING COMBAT SYSTEMS',              delay: 1750, ok: true },
  { text: '> SYNCHRONIZING TACTICAL DATA',             delay: 2150, ok: true },
  { text: '> MEMORY UNIT INTEGRITY CHECK',             delay: 2550, ok: true },
  { text: '> ALL SYSTEMS NOMINAL',                     delay: 2950, ok: true },
  { text: '> WELCOME, OPERATOR. DESIGNATION CONFIRMED.', delay: 3350 },
];

const SYS_MESSAGES = [
  'DESIGNATION CONFIRMED',
  'SYNCHRONIZATION COMPLETE',
  'TACTICAL DATA UPDATED',
  'OPERATOR AUTHENTICATION VERIFIED',
  'BUNKER CONNECTION STABLE',
  'UNIT STATUS: NOMINAL',
  'MEMORY BACKUP COMPLETE',
  'COMBAT DATA SYNCHRONIZED',
  'EMOTIONAL DATA SUPPRESSED',
];

// Typing roles
const ROLES = [
  'GAME DEVELOPER',
  'SOFTWARE ENGINEER',
  'GAME DESIGNER',
  'GAME PROGRAMMER'
];

const CAREER_START = new Date('2022-01-01');

/* ──────────────────────────────────────────────
   DOM REFS
   ────────────────────────────────────────────── */
const bootScreen      = document.getElementById('boot-screen');
const bootLog         = document.getElementById('boot-log');
const bootProgressBar = document.getElementById('boot-progress-bar');
const bootSkip        = document.getElementById('boot-skip');
const mainContent     = document.getElementById('main-content');
const sysMessage      = document.getElementById('sys-message');

/* ──────────────────────────────────────────────
   BOOT LOGIC
   ────────────────────────────────────────────── */
let bootTimers = [];

function addBootLine(text, ok) {
  const line = document.createElement('div');
  line.className = 'boot-log-line';

  if (typeof ok === 'boolean') {
    const t = document.createElement('span');
    t.textContent = text;
    const s = document.createElement('span');
    s.className   = ok ? 'boot-log-ok' : 'boot-log-err';
    s.textContent = ok ? '[ OK ]' : '[ ERR ]';
    line.appendChild(t);
    line.appendChild(s);
  } else {
    line.textContent = text;
  }

  bootLog.appendChild(line);
}

function startBoot() {
  BOOT_MESSAGES.forEach((msg, i) => {
    const t = setTimeout(() => {
      addBootLine(msg.text, msg.ok);
      bootProgressBar.style.width = `${((i + 1) / BOOT_MESSAGES.length) * 100}%`;

      if (i === BOOT_MESSAGES.length - 1) {
        bootTimers.push(setTimeout(revealMain, 700));
      }
    }, msg.delay);
    bootTimers.push(t);
  });
}

function revealMain() {
  bootScreen.classList.add('fade-out');
  setTimeout(() => {
    bootScreen.style.display = 'none';
    mainContent.classList.remove('hidden');
    initMain();
  }, 780);
}

bootSkip.addEventListener('click', () => {
  bootTimers.forEach(clearTimeout);
  bootTimers = [];
  revealMain();
});

startBoot();

/* ──────────────────────────────────────────────
   MAIN INIT (called after boot)
   ────────────────────────────────────────────── */
function initMain() {
  initClock();
  initCoords();
  initTypingRole();
  initHeroDays();
  initHeroCanvas();
  initScrollAnimations();
  initActiveNav();
  initSysMessages();
  initGameModal();
}

/* ──────────────────────────────────────────────
   CLOCK
   ────────────────────────────────────────────── */
function initClock() {
  const el = document.getElementById('nav-time');

  function tick() {
    const n = new Date();
    const h = String(n.getHours()).padStart(2, '0');
    const m = String(n.getMinutes()).padStart(2, '0');
    const s = String(n.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────
   ANIMATED COORDINATES
   ────────────────────────────────────────────── */
function initCoords() {
  const el = document.getElementById('nav-coords');

  setInterval(() => {
    const lat = (48 + Math.random() * 2).toFixed(4);
    const lon = (2  + Math.random() * 2).toFixed(4);
    el.textContent = `N:${lat} E:${lon}`;
  }, 3500);
}

/* ──────────────────────────────────────────────
   TYPING ROLE ANIMATION
   ────────────────────────────────────────────── */
function initTypingRole() {
  const el       = document.getElementById('hero-role-text');
  let roleIdx    = 0;
  let charIdx    = 0;
  let deleting   = false;
  let paused     = false;

  function type() {
    if (paused) return;

    const current = ROLES[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % ROLES.length;
      }
      setTimeout(type, 35);
    }
  }

  type();
}

/* ──────────────────────────────────────────────
   HERO DAYS COUNTER
   ────────────────────────────────────────────── */
function initHeroDays() {
  const el   = document.getElementById('hero-days');
  const days = Math.floor((Date.now() - CAREER_START) / 86_400_000);
  let   cur  = 0;
  const step = days / (1400 / 16); // ~1.4 s animation

  function tick() {
    cur = Math.min(cur + step, days);
    el.textContent = `${Math.floor(cur).toLocaleString()} DAYS`;
    if (cur < days) requestAnimationFrame(tick);
  }

  setTimeout(tick, 400);
}

/* ──────────────────────────────────────────────
   INTERSECTION OBSERVER — SCROLL ANIMATIONS
   ────────────────────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      // Animate skill bars when their card becomes visible
      if (el.classList.contains('skill-category')) {
        el.querySelectorAll('.skill-bar-fill').forEach(fill => {
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, 120);
        });
      }
    });
  }, { threshold: 0.15 });

  // Skill cards — staggered
  document.querySelectorAll('.skill-category').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  // Project cards — staggered
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  // Generic fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
   ────────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ──────────────────────────────────────────────
   PERIODIC SYSTEM MESSAGES
   ────────────────────────────────────────────── */
function initSysMessages() {
  let sysTimer = null;

  function showNext() {
    const msg = SYS_MESSAGES[Math.floor(Math.random() * SYS_MESSAGES.length)];
    sysMessage.textContent = `> ${msg}`;
    sysMessage.classList.add('show');

    setTimeout(() => {
      sysMessage.classList.remove('show');
      sysTimer = setTimeout(showNext, 9000 + Math.random() * 14000);
    }, 2800);
  }

  sysTimer = setTimeout(showNext, 4000);
}

/* ──────────────────────────────────────────────
   GAME DEMO MODAL
   ────────────────────────────────────────────── */
function initGameModal() {
  const overlay = document.getElementById('game-modal');
  const iframe  = document.getElementById('game-iframe');
  const title   = document.getElementById('game-modal-title');
  const openBtns = document.querySelectorAll('.play-btn[data-game-src]');
  const closeBtn = document.getElementById('game-modal-close');
  if (!overlay || !openBtns.length) return;

  function openModal(src, label) {
    iframe.src = src;
    if (title && label) title.textContent = '> ' + label;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { iframe.src = ''; }, 350);
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.gameSrc, btn.dataset.gameTitle);
    });
  });
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });
}

/* ──────────────────────────────────────────────
   HERO CANVAS — PARTICLE NETWORK + FLOATING KANJI
   ────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');

  // ── Kanji pool (NieR flavor text) ──
  const KANJI = '機械生命体人類栄光戦闘記憶廃墟希望終焉'.split('');

  // ── Config ──
  const PARTICLE_COUNT   = 70;
  const CONNECT_DIST     = 120;
  const KANJI_COUNT      = 8;
  const ACCENT           = { r: 200, g: 169, b: 110 };

  let particles = [];
  let kanjis    = [];
  let W, H;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  // ── Particle class ──
  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.5 + 0.5,
      a:  Math.random() * 0.4 + 0.1,
    };
  }

  // ── Floating kanji ──
  function createKanji() {
    return {
      char: KANJI[Math.floor(Math.random() * KANJI.length)],
      x:    Math.random() * W,
      y:    H + 20,
      vy:   -(Math.random() * 0.3 + 0.15),
      a:    0,
      aMax: Math.random() * 0.08 + 0.03,
      size: Math.random() * 14 + 10,
      life: 0,
      maxLife: 400 + Math.random() * 300,
    };
  }

  function init() {
    resize();
    particles = [];
    kanjis    = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
    for (let i = 0; i < KANJI_COUNT; i++) {
      const k = createKanji();
      k.y = Math.random() * H;        // spread initial positions
      k.life = Math.random() * k.maxLife;
      kanjis.push(k);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ── Draw connections ──
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // ── Draw particles ──
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${p.a})`;
      ctx.fill();
    }

    // ── Draw floating kanji ──
    for (let i = 0; i < kanjis.length; i++) {
      const k = kanjis[i];
      k.y += k.vy;
      k.life++;

      // fade in then out
      const progress = k.life / k.maxLife;
      if (progress < 0.15) {
        k.a = (progress / 0.15) * k.aMax;
      } else if (progress > 0.8) {
        k.a = ((1 - progress) / 0.2) * k.aMax;
      } else {
        k.a = k.aMax;
      }

      ctx.font = `${k.size}px "Rajdhani", sans-serif`;
      ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${k.a})`;
      ctx.fillText(k.char, k.x, k.y);

      // respawn when done
      if (k.life >= k.maxLife || k.y < -30) {
        kanjis[i] = createKanji();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
}
