/* Futuristic portfolio JS: no dependencies, accessible interactions & small particle background */
(function () {
  // --------------------------- Helpers ---------------------------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // --------------------------- DOM refs ---------------------------
  const navToggle = $('#nav-toggle'); // Keep this declaration
  const navList = $('#nav-list');
  const themeToggle = $('#theme-toggle');
  const projectFilter = $('#project-filter');
  const projectGrid = $('#project-grid');
  const modal = $('#project-modal');
  const modalContent = $('#modal-content');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const yearEl = $('#year');

  // --------------------------- Init year ---------------------------
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --------------------------- Nav toggle for mobile ---------------------------
  navToggle &&
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });

  // --------------------------- Smooth scrolling for internal links ---------------------------
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close menu on small screens
      if (navList.classList.contains('show')) {
        navList.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // --------------------------- Theme toggle (simple) ---------------------------
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  let dark =
    localStorage.getItem('futuro-theme') ?? (prefersDark ? 'dark' : 'light');
  const applyTheme = (t) => {
    if (t === 'dark') {
      document.documentElement.style.setProperty('--bg-0', '#08070b');
    } else {
      document.documentElement.style.setProperty('--bg-0', '#f6f7fb');
    }
    try {
      localStorage.setItem('futuro-theme', t);
    } catch (e) {
      console.warn(
        'LocalStorage is not available. Theme preference will not persist.'
      );
    }
    themeToggle &&
      themeToggle.setAttribute('aria-pressed', String(t === 'dark'));
  };
  applyTheme(dark);
  themeToggle &&
    themeToggle.addEventListener('click', () =>
      applyTheme(
        localStorage.getItem('futuro-theme') === 'dark' ? 'light' : 'dark'
      )
    );

  // --------------------------- Project filter & modal contents ---------------------------
  const projectData = {
    'smart-composer': `<h3>Smart Composer</h3><p>A generative music web app using TensorFlow.js. It composes short loops based on mood tags and adapts to user preference over time.</p><p><strong>Tech:</strong> TensorFlow.js · WebAudio · React (prototype)</p>`,
    'ar-gallery': `<h3>AR Gallery</h3><p>Prototype for a WebXR gallery with spatial audio. Drop models into a gallery scene and view them through a phone or headset.</p><p><strong>Tech:</strong> A-Frame · WebXR · Three.js</p>`,
    'holo-kit': `<h3>Holo UI Kit</h3><p>A set of CSS components and web components to create holographic-like UIs for cards, panels and micro-interactions.</p><p><strong>Tech:</strong> Web Components · CSS custom properties</p>`,
    'devops-dash': `<h3>DevOps Dashboard</h3><p>Realtime telemetry dashboard with simulated telemetry for testing visualizations and alerting flows.</p><p><strong>Tech:</strong> Node.js · WebSocket · Charting</p>`,
  };

  // Filter projects
  projectFilter &&
    projectFilter.addEventListener('change', () => {
      const v = projectFilter.value;
      $$('.project-card').forEach((card) => {
        const cat = card.dataset.category || 'all';
        if (v === 'all' || v === cat) card.style.display = '';
        else card.style.display = 'none';
      });
    });

  // Project details modal
  $$('.details-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.project;
      modalContent.innerHTML = projectData[id] || '<p>Details coming soon.</p>';
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'flex';
      setTimeout(() => (modal.style.opacity = '1'), 20);
      trapFocus(modal); // Add focus trapping
      const first = modal.querySelector('.modal-close');
      if (first) first.focus();
    })
  );

  modalClose && modalClose.addEventListener('click', () => closeModal());
  modal &&
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.opacity = '0';
    setTimeout(() => (modal.style.display = 'none'), 180);
  }

  // --------------------------- Contact form (client-side) ---------------------------
  const form = $('#contact-form');
  const feedback = $('#form-feedback');
  const clearBtn = $('#clear-btn');

  clearBtn && clearBtn.addEventListener('click', () => form.reset());

  form &&
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const msg = $('#message').value.trim();
      if (!name || !email || !msg) {
        feedback.textContent = 'Please fill all fields.';
        return;
      }
      feedback.textContent = 'Sending…';
      // Simulate async send (no network call) — replace with real API endpoint when ready
      setTimeout(() => {
        feedback.textContent = 'Thanks! Message received. I will reply soon.';
        form.reset();
      }, 700);
    });

  // --------------------------- Skill bars animate into view ---------------------------
  function animateSkillBars() {
    $$('.progress').forEach((bar) => {
      const val = Number(bar.dataset.value) || 0;
      bar.querySelector('span').style.width = val + '%';
    });
  }
  // Run after tiny timeout to allow paint
  setTimeout(animateSkillBars, 200);

  // --------------------------- Simple particle background using canvas ---------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth),
      h = (canvas.height = window.innerHeight);
    const particles = [];
    const particleCount = Math.round((w * h) / 8000);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    drawParticles();
  }

  // --------------------------- Accessibility improvements: skip to content & keyboard nav ---------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
      if (navList.classList.contains('show')) {
        navList.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
})();

// Removed CSS code. Ensure the CSS is moved to a separate file and linked in the HTML.

<div>
  <div class="holographic-border">
    <h2>Holographic Border Example</h2>
  </div>

  <h1 class="shimmer">Shimmer Gradient Animation</h1>
  <h1 class="glitter-effect">3D Glitter Effect</h1>

  <section
    id="banner"
    class="banner"
    style="background-image: url('../futuristic-portfolio/assets/images/banner-1.jpg')"
  >
    <div class="banner-inner container holographic-border">
      <h1 class="headline">
        Hi — I'm <span class="name">ALFRED SALIM ODHIAMBO</span>
      </h1>
      <p class="subtitle">
        I design & build forward-looking web, AI & XR experiences.
      </p>
      <div class="cta-row">
        <a href="#projects" class="btn btn-primary">View Projects</a>
        <a href="#contact" class="btn btn-ghost">Get in touch</a>
      </div>
    </div>
  </section>

  <canvas id="bg-canvas" aria-hidden="true"></canvas>
</div>
