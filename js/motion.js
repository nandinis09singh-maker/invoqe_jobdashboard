/* CareerFlow — shared motion (put in js/motion.js, include on every page except index.html) */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Styles (injected, so no extra CSS file is needed) ---------- */
  const css = `
  html { scroll-behavior: smooth; }
  @keyframes cfIn   { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes cfShake{ 0%,100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
  body { animation: cfIn .5s ease both; }
  body.cf-leave { opacity: 0; transform: translateY(-8px); transition: opacity .22s ease, transform .22s ease; }

  .cf-reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
  .cf-reveal.cf-visible { opacity: 1; transform: none; }

  a, button, input, select, textarea { transition: transform .2s ease, box-shadow .25s ease, background-color .2s ease, color .2s ease, border-color .2s ease; }
  input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 3px rgba(79,70,229,.15); }
  button:active, .btn-primary:active { transform: scale(.97); }
  .btn-primary:hover, .btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(79,70,229,.25); }

  .stat-card, .application { transition: transform .25s ease, box-shadow .25s ease, background-color .2s ease; }
  .stat-card { cursor: pointer; }
  .stat-card:hover { box-shadow: 0 16px 36px rgba(79,70,229,.14); }
  .stat-card.cf-active { box-shadow: 0 0 0 2px #5137ed; }
  .application:hover { background: #fafaff; transform: translateX(4px); }
  .cf-err { animation: cfShake .35s ease; }
  .nav-links a, .user-chip { transition: color .2s ease, transform .2s ease; }
  .user-chip:hover { transform: translateY(-1px); }
  .user-chip:hover .profile { transform: scale(1.08); }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
    .cf-reveal { opacity: 1; transform: none; }
  }`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  document.addEventListener('DOMContentLoaded', () => {
    if (reduce) return;

    /* ---------- Scroll reveal (staggered) ---------- */
    const targets = document.querySelectorAll('.heading, main > div, main > form, .stat-card, .application, #wordmark');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('cf-visible');
        io.unobserve(el);
        // drop helper classes afterwards so hover effects stay snappy
        setTimeout(() => { el.classList.remove('cf-reveal', 'cf-visible'); el.style.transitionDelay = ''; }, 1000);
      });
    }, { threshold: 0.12 });
    targets.forEach((el, i) => {
      el.classList.add('cf-reveal');
      el.style.transitionDelay = (i % 5) * 80 + 'ms';
      io.observe(el);
    });

    /* ---------- Count-up numbers ---------- */
    document.querySelectorAll('.stat-number').forEach(el => {
      const end = parseInt(el.textContent, 10);
      if (isNaN(end)) return;
      const t0 = performance.now(), dur = 900;
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });

    /* ---------- Subtle 3D tilt on stat cards ---------- */
    document.querySelectorAll('.stat-card').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });

    /* ---------- Stat cards filter the applications list ---------- */
    const rows = document.querySelectorAll('.application');
    const map = { 'total': null, 'in review': '.review', 'interview': '.interview', 'offer': '.offer' };
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.querySelector('.stat-label').textContent.trim().toLowerCase();
        const sel = map[key];
        document.querySelectorAll('.stat-card').forEach(c => c.classList.toggle('cf-active', c === card && sel));
        rows.forEach(r => {
          const show = !sel || r.querySelector(sel);
          r.style.display = show ? '' : 'none';
          if (show) { r.style.animation = 'none'; r.offsetHeight; r.style.animation = 'cfIn .45s ease both'; }
        });
      });
    });

    /* ---------- Fade between pages ---------- */
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const h = a.getAttribute('href');
      if (!h || h[0] === '#' || /^(https?:|mailto:|tel:)/.test(h)) return;
      e.preventDefault();
      document.body.classList.add('cf-leave');
      setTimeout(() => { location.href = h; }, 220);
    });
    addEventListener('pageshow', () => document.body.classList.remove('cf-leave'));

    /* ---------- Smooth (inertial) scrolling with Lenis ---------- */
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
    s.onload = () => {
      if (!window.Lenis) return;
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    };
    document.head.appendChild(s);
  });
})();
