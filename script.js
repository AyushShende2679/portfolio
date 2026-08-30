// script.js — Portfolio core interactions
// Carousel • Typing • Float Cards • Nav • Cursor • Scroll • Preloader

// ── CAROUSEL (phone-frame) ────────────────────────────────────────────
(function () {
  const frames = document.querySelectorAll('.phone-frame');
  frames.forEach(frame => {
    const images = frame.querySelectorAll('.carousel-image');
    const prev   = frame.querySelector('.prev');
    const next   = frame.querySelector('.next');
    const dots   = frame.querySelectorAll('.dot');
    let current  = 0;

    function update() {
      images.forEach(img => img.classList.add('hidden'));
      if (images[current]) images[current].classList.remove('hidden');
      dots.forEach(d => d.classList.remove('active'));
      if (dots[current]) dots[current].classList.add('active');
    }

    if (prev) prev.addEventListener('click', () => { current = (current - 1 + images.length) % images.length; update(); });
    if (next) next.addEventListener('click', () => { current = (current + 1) % images.length; update(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { current = i; update(); }));

    // Autoplay
    let auto = setInterval(() => { current = (current + 1) % images.length; update(); }, 4200);
    frame.addEventListener('mouseenter', () => clearInterval(auto));
    frame.addEventListener('mouseleave', () => { auto = setInterval(() => { current = (current + 1) % images.length; update(); }, 4200); });

    // Touch swipe
    let sx = 0;
    frame.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    frame.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { current = dx < 0 ? (current + 1) % images.length : (current - 1 + images.length) % images.length; update(); }
    });
  });
})();

// ── HERO TYPING EFFECT ────────────────────────────────────────────────
(function () {
  const el = document.getElementById('hero-role');
  if (!el) return;
  const roles = [
    'Systems & Backend Engineer',
    'Java • Spring Boot • C++17',
    'Offline-First • Encryption • DPI',
    'Flutter • Firestore • Kafka'
  ];
  let ri = 0, ci = 0, del = false, txt = '';
  function tick() {
    const full = roles[ri];
    if (!del) {
      txt = full.slice(0, ci + 1);
      ci++;
      if (ci === full.length) { del = true; setTimeout(tick, 1600); return; }
    } else {
      txt = full.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    el.textContent = txt;
    setTimeout(tick, del ? 32 : 78);
  }
  setTimeout(tick, 2700);
})();

// ── FLOAT CARDS — parallax + tilt + live DPI counter ─────────────────
(function () {
  const wrap  = document.getElementById('hero-3d-wrap');
  const cards = document.querySelectorAll('.float-card');
  if (!wrap || cards.length === 0) return;

  // Per-card tilt on hover
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.style.animationPlayState = 'paused');
    card.addEventListener('mouseleave', () => {
      card.style.animationPlayState = 'running';
      card.style.transform = '';
    });
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      const rx = ((y - r.height / 2) / (r.height / 2)) * -7;
      const ry = ((x - r.width  / 2) / (r.width  / 2)) *  7;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px) scale(1.03)`;
    });
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-link');
      if (target) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        card.style.boxShadow = '0 0 28px rgba(124,124,255,0.5)';
        setTimeout(() => card.style.boxShadow = '', 450);
      }
    });
  });

  // Wrap-level magnetic parallax
  wrap.addEventListener('mousemove', e => {
    const r  = wrap.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    cards.forEach((card, i) => {
      if (card.matches(':hover')) return;
      card.style.animationPlayState = 'paused';
      const depth = (i + 1) * 0.55;
      card.style.transform = `translate3d(${nx * depth * 7}px, ${ny * depth * 7}px, 0)`;
    });
  });
  wrap.addEventListener('mouseleave', () => {
    cards.forEach(c => {
      if (!c.matches(':hover')) { c.style.transform = ''; c.style.animationPlayState = 'running'; }
    });
  });

  // DPI counter — realistic-looking simulation
  const dpiEl = document.getElementById('dpi-counter');
  if (dpiEl) {
    let n = 44;
    setInterval(() => {
      n += Math.floor(Math.random() * 3);
      if (n > 92) n = 44;
      dpiEl.textContent = n;
      dpiEl.style.color = 'var(--success)';
      setTimeout(() => dpiEl.style.color = '', 220);
    }, 1800);
  }

  // Sequential card pulse — keeps cards alive without hover
  let hi = 0;
  setInterval(() => {
    const c = cards[hi % cards.length];
    c.style.borderColor = 'rgba(124,124,255,0.42)';
    c.style.boxShadow   = '0 12px 36px rgba(124,124,255,0.20)';
    setTimeout(() => { c.style.borderColor = ''; c.style.boxShadow = ''; }, 700);
    hi++;
  }, 2200);

  // Desktop: random float drift
  if (window.innerWidth >= 769) {
    function boundsFor(card) {
      const wr  = wrap.getBoundingClientRect();
      const cr  = card.getBoundingClientRect();
      const pad = 12, hintH = 34;
      return {
        maxX: Math.max(0, wr.width  - cr.width  - pad * 2),
        maxY: Math.max(0, wr.height - cr.height - pad * 2 - hintH),
        pad
      };
    }
    function moveToRandom(card) {
      const b = boundsFor(card);
      let x, y, tries = 0;
      do {
        x = b.pad + Math.random() * b.maxX;
        y = b.pad + Math.random() * b.maxY;
        tries++;
        let overlap = false;
        for (const other of cards) {
          if (other === card || !other.style.left) continue;
          if (Math.hypot(x - parseFloat(other.style.left), y - parseFloat(other.style.top)) < 145) { overlap = true; break; }
        }
        if (!overlap) break;
      } while (tries < 12);
      card.style.right  = 'auto';
      card.style.bottom = 'auto';
      card.style.left   = x.toFixed(1) + 'px';
      card.style.top    = y.toFixed(1) + 'px';
    }
    setTimeout(() => {
      cards.forEach((c, i) => {
        setTimeout(() => moveToRandom(c), i * 280);
        const interval = 3600 + Math.random() * 2600;
        setInterval(() => {
          if (c.matches(':hover') || document.hidden) return;
          moveToRandom(c);
        }, interval);
      });
    }, 700);
    window.addEventListener('resize', () => cards.forEach(c => moveToRandom(c)));
  }
})();

// ── NAVBAR ───────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const navbar    = document.getElementById('navbar');

if (hamburger && navLinks) {
  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll', navLinks.classList.contains('active'));
  };
  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); } });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks)  navLinks.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
});

// ── SCROLL EVENTS ────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  const aiW = document.getElementById('ai-widget');
  if (aiW) aiW.classList.toggle('scrolled', window.scrollY > 90);
}, { passive: true });

// ── SMOOTH SCROLL ────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── SCROLL-IN OBSERVER — project cards ───────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); 
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => revealObserver.observe(card));

// ── SECTION TRACKER ──────────────────────────────────────────────────
const sections = document.querySelectorAll('section');
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) document.body.setAttribute('data-section', entry.target.id); });
}, { threshold: 0.5 });
sections.forEach(section => scrollObserver.observe(section));

// ── 3D TILT — skill + contact cards ─────────────────────────────────
document.querySelectorAll('.skill-card, .contact-card, .project-info').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const rotX  = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotY  = ((x - rect.width  / 2) / (rect.width  / 2)) *  8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── CUSTOM CURSOR ────────────────────────────────────────────────────
const cursorDot     = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorOutline) {
  window.addEventListener('mousemove', e => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top  = `${e.clientY}px`;
    cursorOutline.animate(
      { left: `${e.clientX}px`, top: `${e.clientY}px` },
      { duration: 180, fill: 'forwards' }
    );
  });

  document.querySelectorAll('a, button, .nav, .project-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

// ── PRELOADER ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const navbarEl  = document.getElementById('navbar');
  const particles = document.getElementById('loader-particles');

  document.body.classList.add('no-scroll');

  // Spawn particles
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.width  = (Math.random() * 5 + 2) + 'px';
    p.style.height = p.style.width;
    p.style.left   = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 2 + 2) + 's';
    p.style.animationDelay    = (Math.random() * 2) + 's';
    if (particles) particles.appendChild(p);
  }

  setTimeout(() => {
    if (preloader) preloader.classList.add('fade-out');
    document.body.classList.remove('no-scroll');
    if (navbarEl) navbarEl.classList.remove('nav-hidden');
    setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 800);
  }, 2300);
});