/* =============================================================
   main.js — ArthShastra
   Handles: Loader, Navbar, Particle Canvas, Scroll Reveal,
            Hamburger Menu, Smooth Scroll, Basket Bar Animations
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   1. PAGE LOADER
   Hides the splash screen after fonts + content have loaded
--------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader once page is ready (min 1.6s for UX)
  const minDelay = new Promise(resolve => setTimeout(resolve, 1600));
  const pageLoad  = new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve);
  });

  Promise.all([minDelay, pageLoad]).then(() => {
    loader.classList.add('hidden');
  });
}

/* ---------------------------------------------------------------
   2. NAVBAR — scroll state & hamburger toggle
--------------------------------------------------------------- */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobileDrawer');

  if (!navbar) return;

  // Add scrolled class when page has scrolled > 50px
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close drawer on outside click
  document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('open')) {
      if (!navbar.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

// Exposed globally so HTML onclick attributes can call it
function closeDrawer() {
  const drawer    = document.getElementById('mobileDrawer');
  const hamburger = document.getElementById('hamburger');
  if (drawer) drawer.classList.remove('open');
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
}

/* ---------------------------------------------------------------
   3. PARTICLE CANVAS
   Lightweight canvas-based floating particle system for hero
--------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  // Resize canvas to fill viewport
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle class
  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height + canvas.height * 0.5;
      this.size  = Math.random() * 1.8 + 0.4;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha  = 0;
      this.alphaSpeed = Math.random() * 0.008 + 0.003;
      this.maxAlpha   = Math.random() * 0.4 + 0.1;
      this.growing    = true;

      // Color palette: saffron, gold, emerald, sky
      const colors = [
        'rgba(255,107,43,',
        'rgba(245,183,66,',
        'rgba(0,217,165,',
        'rgba(56,189,248,'
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.growing) {
        this.alpha += this.alphaSpeed;
        if (this.alpha >= this.maxAlpha) this.growing = false;
      } else {
        this.alpha -= this.alphaSpeed * 0.6;
      }

      // Reset when off-screen or faded
      if (this.y < -20 || this.alpha <= 0) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // Create initial particle pool (reduce on mobile for performance)
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 40 : 80;
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // Spread initial y
    particles.push(p);
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animate);
  }
  animate();

  // Stop animating when tab is hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      animate();
    }
  });
}

/* ---------------------------------------------------------------
   4. SCROLL REVEAL (IntersectionObserver)
   Adds .visible class to .reveal elements when they enter viewport
--------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate basket bars and fm-bars once visible
        animateBarsInside(entry.target);
        observer.unobserve(entry.target); // fire once only
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* Trigger width animation on bars inside revealed element */
function animateBarsInside(container) {
  // Basket weight bars: read data-w from parent .weight-row
  container.querySelectorAll('.wr-bar').forEach(bar => {
    const row = bar.closest('.weight-row');
    if (row && row.dataset.w) {
      const target = parseFloat(row.dataset.w);
      // Use CSS max-width percentage relative to 50% total width
      const pct = Math.min((target / 50) * 100, 100);
      setTimeout(() => { bar.style.width = pct + '%'; }, 200);
    }
  });

  // Fiscal metric bars: already have inline width set, trigger transition
  container.querySelectorAll('.fm-bar').forEach(bar => {
    const existingWidth = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = existingWidth; }, 100);
  });
}

/* ---------------------------------------------------------------
   5. SMOOTH SCROLL for internal anchor links
   (CSS scroll-behavior handles most, but this adds offset for navbar)
--------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 66;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------------------------------------------------------------
   6. ACTIVE NAV LINK HIGHLIGHTING
   Highlights nav link corresponding to current section in view
--------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = (href === `#${id}`)
            ? 'var(--text-primary)'
            : '';
          link.style.background = (href === `#${id}`)
            ? 'rgba(255,255,255,0.06)'
            : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ---------------------------------------------------------------
   7. BUTTON RIPPLE EFFECT
   Adds a ripple on button click for tactile feedback
--------------------------------------------------------------- */
function initRippleEffects() {
  document.querySelectorAll('.btn, .btn-qz-next, .btn-reset').forEach(btn => {
    btn.classList.add('ripple-host');
    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = (e.clientX - rect.left - 30) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - 30) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ---------------------------------------------------------------
   8. NUMBER COUNTER ANIMATION
   Animates numeric values from 0 to target on scroll reveal
--------------------------------------------------------------- */
function animateCounter(el, target, duration = 1200, decimals = 2) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * ease).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------------------------------------------------------------
   9. TOOLTIP SYSTEM (lightweight, no library)
   Add data-tooltip="..." to any element to get a tooltip
--------------------------------------------------------------- */
function initTooltips() {
  let tip = null;

  document.addEventListener('mouseenter', (e) => {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;

    tip = document.createElement('div');
    tip.className = 'tooltip-bubble';
    tip.textContent = el.dataset.tooltip;

    Object.assign(tip.style, {
      position: 'fixed',
      background: 'rgba(15,23,42,0.95)',
      color: 'rgba(255,255,255,0.88)',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: '500',
      pointerEvents: 'none',
      zIndex: '9000',
      whiteSpace: 'nowrap',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      opacity: '0',
      transition: 'opacity 0.2s ease',
    });
    document.body.appendChild(tip);

    const rect = el.getBoundingClientRect();
    tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
    tip.style.top  = (rect.top - tip.offsetHeight - 8) + 'px';
    requestAnimationFrame(() => { if (tip) tip.style.opacity = '1'; });

  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (tip && e.target.closest('[data-tooltip]')) {
      tip.style.opacity = '0';
      setTimeout(() => { if (tip) { tip.remove(); tip = null; } }, 200);
    }
  }, true);
}

/* ---------------------------------------------------------------
   10. SCROLL PROGRESS BAR (thin bar at very top of page)
--------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0', left: '0',
    height: '2px',
    background: 'linear-gradient(90deg, #FF6B2B, #F5B742)',
    zIndex: '10000',
    width: '0%',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrollTop / docHeight) * 100) + '%';
  }, { passive: true });
}

/* ---------------------------------------------------------------
   INIT — Run everything on DOMContentLoaded
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initParticles();
  initScrollReveal();
  initSmoothScroll();
  initActiveNav();
  initTooltips();
  initScrollProgress();

  // Ripple effects run after a short delay to catch dynamic buttons
  setTimeout(initRippleEffects, 500);
});
