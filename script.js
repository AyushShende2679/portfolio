// Portfolio interactions: custom cursor, carousel, typing effect, terminal, and animations

// Custom cursor and spotlight follower
(function () {
  const glow = document.querySelector('.cursor-glow');
  const cursorDev = document.querySelector('.cursor-developer');
  const cursorBadge = document.querySelector('.cursor-badge');
  if (!cursorDev) return;

  // Disable on touch devices or if reduced motion is preferred
  if (window.matchMedia('(pointer: coarse)').matches || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (glow) glow.style.display = 'none';
    cursorDev.style.display = 'none';
    return;
  }

  let mouseX = -200, mouseY = -200;
  let curX = -200, curY = -200;
  let isMoving = false;

  window.addEventListener('pointermove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      if (glow) glow.style.opacity = '1';
      cursorDev.style.opacity = '1';
      isMoving = true;
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    if (glow) glow.style.opacity = '0';
    cursorDev.style.opacity = '0';
    isMoving = false;
  });

  // Click feedback
  window.addEventListener('pointerdown', () => {
    cursorDev.classList.add('is-clicked');
  });
  window.addEventListener('pointerup', () => {
    cursorDev.classList.remove('is-clicked');
  });

  // Smooth cursor position interpolation
  function renderCursor() {
    curX += (mouseX - curX) * 0.22;
    curY += (mouseY - curY) * 0.22;

    if (glow) {
      glow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
    cursorDev.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Context-aware badge text on hover
  const interactiveSelector = 'a, button, [role="button"], .project-card, .skill-card, .exp-card, .contact-card, .t-tab, .btn, input, textarea, #ai-trigger';

  document.addEventListener('mouseover', e => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;

    document.body.classList.add('cursor-hovering');

    if (cursorBadge) {
      let badge = '<DEV/>';
      if (target.matches('.btn-primary, .terminal-run, .ai-send')) {
        badge = '>_ EXEC';
      } else if (target.matches('[href*="drive.google"], [href*="resume"], [href*="cv"], .btn-secondary')) {
        badge = 'DOC:GET';
      } else if (target.matches('[href*="github"], .project-card, .project-link')) {
        badge = 'GIT:REPO';
      } else if (target.matches('.t-tab, .terminal-header, .terminal-window')) {
        badge = '$ CLI';
      } else if (target.matches('.skill-card, .tag, .stat-card')) {
        badge = 'SYS:MOD';
      } else if (target.matches('.contact-card, [href^="mailto"], [href*="linkedin"]')) {
        badge = 'NET:LINK';
      } else if (target.matches('.exp-card, .milestone-item')) {
        badge = 'LOG:XP';
      } else if (target.matches('#ai-trigger, .ai-suggestions button')) {
        badge = 'AI:QUERY';
      } else if (target.matches('input, textarea')) {
        badge = 'STD:IN';
      } else if (target.matches('.nav-link, .nav a')) {
        badge = 'NAV:GOTO';
      }
      cursorBadge.textContent = badge;
    }
  });

  document.addEventListener('mouseout', e => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;

    const related = e.relatedTarget ? e.relatedTarget.closest(interactiveSelector) : null;
    if (!related) {
      document.body.classList.remove('cursor-hovering');
      if (cursorBadge) cursorBadge.textContent = '<DEV/>';
    }
  });
})();

// Phone mockup carousel
(function () {
  const frames = document.querySelectorAll('.phone-frame');
  frames.forEach(frame => {
    const images = frame.querySelectorAll('.carousel-image');
    const prev   = frame.querySelector('.prev');
    const next   = frame.querySelector('.next');
    const dots   = frame.querySelectorAll('.dot');
    let current  = 0;

    function update(newIdx) {
      current = (newIdx + images.length) % images.length;
      images.forEach((img, i) => {
        img.classList.toggle('hidden', i !== current);
      });
      dots.forEach((d, i) => {
        const isActive = i === current;
        d.classList.toggle('active', isActive);
        d.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    if (prev) prev.addEventListener('click', () => update(current - 1));
    if (next) next.addEventListener('click', () => update(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => update(i)));

    // Keyboard arrow support
    frame.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); update(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); update(current + 1); }
    });

    // Auto-advance with pause on hover/focus
    let auto = setInterval(() => update(current + 1), 4500);
    const pause = () => clearInterval(auto);
    const resume = () => { clearInterval(auto); auto = setInterval(() => update(current + 1), 4500); };

    frame.addEventListener('mouseenter', pause);
    frame.addEventListener('mouseleave', resume);
    frame.addEventListener('focusin', pause);
    frame.addEventListener('focusout', resume);

    // Touch swipe
    let sx = 0;
    frame.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    frame.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) update(dx < 0 ? current + 1 : current - 1);
    });
  });
})();

// Hero typing effect
(function () {
  const el = document.getElementById('hero-role');
  if (!el) return;
  const roles = [
    'Systems & Backend Engineer',
    'Java 17 • Spring Boot 3 • C++17',
    'Offline-First • Hybrid RSA/AES • DPI',
    'Flutter • Riverpod • Apache Kafka'
  ];
  let ri = 0, ci = 0, del = false, txt = '';
  function tick() {
    const full = roles[ri];
    if (!del) {
      txt = full.slice(0, ci + 1);
      ci++;
      if (ci === full.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      txt = full.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    el.textContent = txt;
    setTimeout(tick, del ? 26 : 65);
  }
  setTimeout(tick, 500);
})();

// Hero terminal tabs
(function () {
  const tabs = document.querySelectorAll('.t-tab');
  const cmdText = document.getElementById('t-cmd-text');
  const cmdOutput = document.getElementById('t-cmd-output');
  if (!tabs.length || !cmdText || !cmdOutput) return;

  const terminalData = {
    stack: {
      cmd: 'cat stack.txt',
      output: 'Java 17 • Spring Boot 3 • C++17 • Flutter • Kafka • Docker'
    },
    benchmark: {
      cmd: './run --benchmark --threads 8 --pcap test.pcap',
      output: 'DPI Throughput: 14.8 Gbps | Dropped: 0 | Latency: 0.12ms | PASS'
    },
    mesh: {
      cmd: 'curl -s https://api.upi-mesh/health',
      output: '{"status":"UP","node":"relay-7","mode":"deferred","idempotency":"SHA256-verified"}'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const key = tab.getAttribute('data-cmd');
      const item = terminalData[key];
      if (item) {
        cmdText.textContent = item.cmd;
        cmdOutput.textContent = item.output;
      }
    });
  });
})();

// Stats counter animation
(function () {
  const statsContainer = document.querySelector('.hero-stats');
  if (!statsContainer) return;

  let animated = false;
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const nums = statsContainer.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const raw = num.textContent.trim();
          num.style.opacity = '0';
          num.style.transform = 'translateY(8px)';
          setTimeout(() => {
            num.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            num.style.opacity = '1';
            num.style.transform = 'translateY(0)';
          }, 150);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(statsContainer);
})();

// Navigation & mobile menu
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const navbar    = document.getElementById('navbar');

if (hamburger && navLinks) {
  const toggleMenu = () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', isActive);
  };
  hamburger.addEventListener('click', toggleMenu);
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    if (navLinks) navLinks.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
});

// Scroll state for navbar
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  const aiW = document.getElementById('ai-widget');
  if (aiW) aiW.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll reveal animations
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); 
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.project-card, .exp-card, .about-glass-box, .skill-card, .contact-card').forEach(card => {
  revealObserver.observe(card);
});

// Section active tracker
const sections = document.querySelectorAll('section[id]');
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) {
      document.body.setAttribute('data-section', entry.target.id);
    }
  });
}, { threshold: 0.4 });
sections.forEach(section => scrollObserver.observe(section));

// Card 3D tilt effect
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.skill-card, .contact-card, .project-info, .meta-card').forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', e => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
          const rotY = ((x - rect.width  / 2) / (rect.width  / 2)) *  5;
          
          card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px)`;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Preloader boot sequence
(function() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const navbarEl    = document.getElementById('navbar');
  const percentEl   = document.getElementById('loaderPercent');
  const fillEl      = document.getElementById('loaderFill');
  const dynamicMsg  = document.getElementById('loaderDynamicMsg');
  const skipBtn     = document.getElementById('loaderSkipBtn');
  const logIds      = ['log1', 'log2', 'log3', 'log4', 'log5'];

  let isDismissed = false;

  function dismissLoader() {
    if (isDismissed) return;
    isDismissed = true;

    if (percentEl) percentEl.textContent = '100%';
    if (fillEl) fillEl.style.width = '100%';
    if (dynamicMsg) dynamicMsg.textContent = 'Systems online. Launching visual shell...';

    // Ensure all logs are visible on completion
    logIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('visible');
    });

    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('no-scroll');
      if (navbarEl) navbarEl.classList.remove('nav-hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 450);
    }, 280);
  }

  // Interactive immediate skip via click or keypress
  if (skipBtn) skipBtn.addEventListener('click', dismissLoader);
  window.addEventListener('keydown', dismissLoader, { once: true });
  preloader.addEventListener('click', dismissLoader);

  // High-speed boot timeline (tight 950ms total sequence)
  const steps = [
    { targetPct: 24, logId: 'log1', delay: 100 },
    { targetPct: 56, logId: 'log2', delay: 280 },
    { targetPct: 76, logId: 'log3', delay: 500 },
    { targetPct: 92, logId: 'log4', delay: 700 },
    { targetPct: 100, logId: 'log5', delay: 920 }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      if (isDismissed) return;
      if (percentEl) percentEl.textContent = `${step.targetPct}%`;
      if (fillEl) fillEl.style.width = `${step.targetPct}%`;
      const logEl = document.getElementById(step.logId);
      if (logEl) logEl.classList.add('visible');

      if (step.targetPct === 100) {
        setTimeout(dismissLoader, 200);
      }
    }, step.delay);
  });

  // Safety fallback if page takes unusually long or fails to trigger
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!isDismissed) dismissLoader();
    }, 1300);
  });
})();