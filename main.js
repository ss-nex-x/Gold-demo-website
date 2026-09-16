/**
 * AURUM & CO. — HAUTE JOAILLERIE
 * Scroll-Driven 300-Frame Cinematic Hero Engine
 */

const TOTAL_FRAMES = 300;
const FRAME_PATH = (i) => `/ezgif-27fd5a89d62bf8c0-png-split/ezgif-frame-${String(i).padStart(3, '0')}.png`;

// DOM Elements
const heroSection = document.getElementById('hero');
const heroCanvas = document.getElementById('hero-canvas');
const ctx = heroCanvas.getContext('2d');

const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');

const heroTransitionCue = document.getElementById('hero-transition-cue');
const preloader = document.getElementById('preloader');
const preloaderBar = document.getElementById('preloader-bar');
const preloaderPercent = document.getElementById('preloader-percent');
const navbar = document.getElementById('navbar');

const textBlocks = [
  { el: document.getElementById('hero-text-1'), start: 1, peakStart: 12, peakEnd: 48, end: 60 },
  { el: document.getElementById('hero-text-2'), start: 61, peakStart: 75, peakEnd: 115, end: 130 },
  { el: document.getElementById('hero-text-3'), start: 131, peakStart: 145, peakEnd: 195, end: 210 },
  { el: document.getElementById('hero-text-4'), start: 211, peakStart: 224, peakEnd: 256, end: 270 }
];

// Frame Storage & Caching
const images = new Array(TOTAL_FRAMES + 1);
const loadedFlags = new Array(TOTAL_FRAMES + 1).fill(false);
let loadedCount = 0;
let lastRenderedFrame = -1;

// Smooth Scroll / LERP Physics
let targetProgress = 0;
let currentProgress = 0;
const LERP_FACTOR = 0.07; // Butter-smooth sub-frame camera momentum

/* ==========================================================================
   1. HIGH-PERFORMANCE PRELOADER & NEAREST-FRAME FALLBACK
   ========================================================================== */

function getNearestLoadedImage(targetIdx) {
  if (loadedFlags[targetIdx] && images[targetIdx]) return images[targetIdx];

  // Search outward in both directions to find the closest loaded frame
  for (let offset = 1; offset <= TOTAL_FRAMES; offset++) {
    const prev = targetIdx - offset;
    if (prev >= 1 && loadedFlags[prev] && images[prev]) return images[prev];
    const next = targetIdx + offset;
    if (next <= TOTAL_FRAMES && loadedFlags[next] && images[next]) return images[next];
  }
  return null;
}

function loadSingleFrame(index) {
  return new Promise((resolve) => {
    if (images[index]) {
      resolve(images[index]);
      return;
    }
    const img = new Image();
    img.src = FRAME_PATH(index);
    img.onload = () => {
      images[index] = img;
      loadedFlags[index] = true;
      loadedCount++;
      onFrameLoaded(index);
      resolve(img);
    };
    img.onerror = () => {
      // Fallback to relative path if root path fails
      const fallbackImg = new Image();
      fallbackImg.src = `./ezgif-27fd5a89d62bf8c0-png-split/ezgif-frame-${String(index).padStart(3, '0')}.png`;
      fallbackImg.onload = () => {
        images[index] = fallbackImg;
        loadedFlags[index] = true;
        loadedCount++;
        onFrameLoaded(index);
        resolve(fallbackImg);
      };
      fallbackImg.onerror = () => resolve(null);
    };
  });
}

function onFrameLoaded(index) {
  const percent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
  if (preloaderBar) preloaderBar.style.width = `${percent}%`;
  if (preloaderPercent) preloaderPercent.textContent = `${percent}%`;

  // Draw Frame 1 as soon as ready and unlock preloader immediately
  if (index === 1 && lastRenderedFrame === -1) {
    renderCanvasFrame(1);
    setTimeout(dismissPreloader, 200);
  }

  if (loadedCount >= 8) {
    dismissPreloader();
  }
}

function dismissPreloader() {
  if (!preloader || preloader.classList.contains('fade-out')) return;
  preloader.classList.add('fade-out');
  document.body.classList.remove('loading');
}

// Safety timeout: Never leave user blocked
setTimeout(dismissPreloader, 1200);

async function startProgressiveLoading() {
  // Step 1: Load Frame 1 first for instantaneous rendering
  await loadSingleFrame(1);

  // Step 2: Priority batch: first 30 frames
  const priorityPromises = [];
  for (let i = 2; i <= 30; i++) {
    priorityPromises.push(loadSingleFrame(i));
  }
  await Promise.all(priorityPromises);

  // Step 3: Keyframe anchors every 10 frames across the entire sequence
  const keyframePromises = [];
  for (let i = 35; i <= TOTAL_FRAMES; i += 10) {
    keyframePromises.push(loadSingleFrame(i));
  }
  await Promise.all(keyframePromises);

  // Step 4: Stream the remainder in parallel batches
  const remaining = [];
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    if (!loadedFlags[i]) remaining.push(i);
  }

  const CONCURRENCY = 8;
  async function worker() {
    while (remaining.length > 0) {
      const idx = remaining.shift();
      await loadSingleFrame(idx);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  dismissPreloader();
}

/* ==========================================================================
   2. CANVAS RENDERING
   ========================================================================== */

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  heroCanvas.width = Math.round(width * dpr);
  heroCanvas.height = Math.round(height * dpr);
  heroCanvas.style.width = `${width}px`;
  heroCanvas.style.height = `${height}px`;

  particlesCanvas.width = Math.round(width * dpr);
  particlesCanvas.height = Math.round(height * dpr);
  particlesCanvas.style.width = `${width}px`;
  particlesCanvas.style.height = `${height}px`;

  lastRenderedFrame = -1;
  const exactFrame = 1 + currentProgress * (TOTAL_FRAMES - 1);
  renderCanvasFrame(exactFrame);
}

function renderCanvasFrame(exactFrameProgress) {
  const exactFrame = Math.max(1, Math.min(TOTAL_FRAMES, exactFrameProgress));
  const frame1 = Math.floor(exactFrame);
  const frame2 = Math.min(TOTAL_FRAMES, frame1 + 1);
  const fraction = exactFrame - frame1;

  const img1 = getNearestLoadedImage(frame1);
  if (!img1) return;

  const cW = heroCanvas.width;
  const cH = heroCanvas.height;

  ctx.clearRect(0, 0, cW, cH);

  const imgW = img1.naturalWidth || 1920;
  const imgH = img1.naturalHeight || 1080;

  // Responsive scaling: On portrait mobile screens, scale so the centerpiece jewelry is prominent and never clipped horizontally
  const isPortrait = cW < cH;
  let scale;
  if (isPortrait) {
    const coverScale = Math.max(cW / imgW, cH / imgH);
    const fitWidthScale = cW / (imgW * 0.72);
    scale = Math.min(coverScale, Math.max(cW / imgW, fitWidthScale));
  } else {
    scale = Math.max(cW / imgW, cH / imgH) * 1.002;
  }

  const drawW = Math.ceil(imgW * scale);
  const drawH = Math.ceil(imgH * scale);
  const drawX = Math.floor((cW - drawW) / 2);
  const drawY = Math.floor((cH - drawH) / 2);

  // Draw primary base frame
  ctx.globalAlpha = 1.0;
  ctx.drawImage(img1, drawX, drawY, drawW, drawH);

  // Sub-frame optical crossfade: blends adjacent frames seamlessly for 120fps analog fluid rotation
  if (fraction > 0.015 && frame2 !== frame1) {
    const img2 = getNearestLoadedImage(frame2);
    if (img2 && img2 !== img1) {
      ctx.globalAlpha = fraction;
      ctx.drawImage(img2, drawX, drawY, drawW, drawH);
      ctx.globalAlpha = 1.0;
    }
  }

  lastRenderedFrame = exactFrame;
  window.lastRenderedFrame = exactFrame;
}

// Complete the 300-frame sequence across the first 65% of the hero scroll track.
// The remaining 35% provides a generous, peaceful dwell buffer on Frame 300 with all text hidden,
// guaranteeing that Frame 300 is 100% completed and settled well before the main content begins to roll in!
const ANIMATION_END_THRESHOLD = 0.65;

function updateProgressFromScroll() {
  if (!heroSection) return;
  const maxScroll = heroSection.offsetHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  const rawScrollFraction = Math.max(0, Math.min(1, scrollY / maxScroll));

  // Map 0..0.70 to 0.0..1.0 for the 300 frames
  targetProgress = Math.min(1, rawScrollFraction / ANIMATION_END_THRESHOLD);

  // Navbar glassmorphism
  if (scrollY > 80) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}

function calculateCurrentFrame() {
  const targetFrame = Math.round(1 + currentProgress * (TOTAL_FRAMES - 1));
  return Math.max(1, Math.min(TOTAL_FRAMES, targetFrame));
}

function updateHUD(frameIdx, progress) {
  if (heroTransitionCue) {
    if (frameIdx >= 295 || targetProgress >= 0.98) {
      heroTransitionCue.classList.add('active');
    } else {
      heroTransitionCue.classList.remove('active');
    }
  }
}

/* ==========================================================================
   4. CINEMATIC TEXT REVEALS
   ========================================================================== */

function updateCinematicText(frameIdx) {
  textBlocks.forEach(({ el, start, peakStart, peakEnd, end }) => {
    if (!el) return;

    if (frameIdx >= start && frameIdx <= end) {
      let opacity = 0;
      let blur = 10;
      let translateY = 20;
      let scale = 0.96;

      // Special case: Text 1 is immediately visible at Frame 1 on initial load
      if (el.id === 'hero-text-1' && frameIdx <= peakEnd) {
        opacity = 1;
        blur = 0;
        translateY = 0;
        scale = 1;
      } else if (frameIdx < peakStart) {
        // Fade in from below with blur to sharp
        const t = (frameIdx - start) / (peakStart - start);
        opacity = t;
        blur = (1 - t) * 10;
        translateY = (1 - t) * 20;
        scale = 0.96 + t * 0.04;
      } else if (frameIdx <= peakEnd) {
        // Full peak visibility
        opacity = 1;
        blur = 0;
        translateY = 0;
        scale = 1;
      } else {
        // Fade out smoothly upward
        const t = (frameIdx - peakEnd) / (end - peakEnd);
        opacity = 1 - t;
        blur = t * 10;
        translateY = -t * 20;
        scale = 1 + t * 0.03;
      }

      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `blur(${blur.toFixed(1)}px)`;
      el.style.transform = `translate(-50%, calc(-50% + ${translateY.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
      el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      el.classList.add('visible');
    } else {
      el.style.opacity = '0';
      el.style.filter = 'blur(12px)';
      el.style.transform = 'translate(-50%, -40%) scale(0.96)';
      el.style.pointerEvents = 'none';
      el.classList.remove('visible');
    }
  });
}

/* ==========================================================================
   5. GOLD STARDUST PARTICLES
   ========================================================================== */

const particles = [];
const PARTICLE_COUNT = 35;

function initParticles() {
  particles.length = 0;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.6 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.05,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function updateAndDrawParticles() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  pCtx.save();
  pCtx.scale(dpr, dpr);

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.phase += p.pulseSpeed;

    if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;

    const dynamicAlpha = Math.max(0.1, Math.min(0.8, p.alpha + Math.sin(p.phase) * 0.25));

    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(212, 175, 55, ${dynamicAlpha.toFixed(2)})`;
    pCtx.fill();
  });

  pCtx.restore();
}

/* ==========================================================================
   6. MAIN RAF LOOP (Continuous Sync with Scroll Position)
   ========================================================================== */

function animationLoop() {
  // Read exact live scroll position continuously
  updateProgressFromScroll();

  // Smooth LERP camera interpolation with accelerated convergence near the end
  const diff = targetProgress - currentProgress;
  let activeLerp = LERP_FACTOR;
  if (targetProgress >= 0.8) activeLerp = 0.12;
  if (targetProgress >= 0.95) activeLerp = 0.24;

  if (Math.abs(diff) > 0.0001) {
    currentProgress += diff * activeLerp;
  } else {
    currentProgress = targetProgress;
  }

  const exactFrameFloat = 1 + currentProgress * (TOTAL_FRAMES - 1);
  const frameIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(exactFrameFloat)));

  // Continuously render sub-frame optical blend during any motion
  if (Math.abs(diff) > 0.00005 || Math.abs(exactFrameFloat - lastRenderedFrame) > 0.01) {
    renderCanvasFrame(exactFrameFloat);
  }

  // Update HUD and text transitions smoothly every frame
  updateHUD(frameIdx, currentProgress);
  updateCinematicText(frameIdx);

  updateAndDrawParticles();
  requestAnimationFrame(animationLoop);
}

/* ==========================================================================
   8. BOUTIQUE INTERACTIONS
   ========================================================================== */

const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

window.openProductModal = function (title, price, desc, type) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-price').textContent = price;
  document.getElementById('modal-desc').textContent = desc;

  const icon = modal.querySelector('.modal-gem-icon');
  if (icon) {
    if (type === 'necklace') icon.textContent = '✦';
    else if (type === 'ring') icon.textContent = '◆';
    else if (type === 'bracelet') icon.textContent = '◉';
    else icon.textContent = '◈';
  }

  modal.classList.add('open');
};

window.closeProductModal = function () {
  document.getElementById('product-modal')?.classList.remove('open');
};

document.getElementById('product-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') {
    window.closeProductModal();
  }
});

window.openConsultationModal = function () {
  const bespokeSection = document.getElementById('bespoke');
  if (bespokeSection) {
    bespokeSection.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('b-name')?.focus();
  }
};

window.handleConsultationSubmit = function (e) {
  e.preventDefault();
  const name = document.getElementById('b-name').value;
  const location = document.getElementById('b-location').value;
  alert(`Thank you, ${name}. Our Private Client Concierge in ${location.toUpperCase()} will contact you within 24 hours to arrange your atelier appointment.`);
  e.target.reset();
};

/* ==========================================================================
   MOBILE MENU NAVIGATION
   ========================================================================== */

window.toggleMobileMenu = function () {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  const isOpen = menu.classList.contains('active');
  if (isOpen) {
    window.closeMobileMenu();
  } else {
    window.openMobileMenu();
  }
};

window.openMobileMenu = function () {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-toggle-btn');
  if (!menu) return;
  menu.classList.add('active');
  menu.setAttribute('aria-hidden', 'false');
  btn?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeMobileMenu = function () {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-toggle-btn');
  if (!menu) return;
  menu.classList.remove('active');
  menu.setAttribute('aria-hidden', 'true');
  btn?.classList.remove('open');
  document.body.style.overflow = '';
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeMobileMenu();
    window.closeProductModal();
  }
});

/* ==========================================================================
   9. INITIALIZATION (Fail-safe for ES module timing)
   ========================================================================== */

function init() {
  resizeCanvas();
  initParticles();
  updateProgressFromScroll();
  animationLoop();
  startProgressiveLoading();
  window.getCurrentFrame = () => calculateCurrentFrame();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

window.addEventListener('scroll', updateProgressFromScroll, { passive: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
