/* ============================================================
   confetti.js — простая физика конфетти на отдельном canvas поверх
   оверлея победы. Без библиотек, без картинок: кружки и квадраты
   цветами игры, гравитация + вращение. ~2.5с и самоочищается.

   Уважает prefers-reduced-motion: при включённом — конфетти не
   запускается вовсе (не пытаемся показать «скромную статичную
   версию» через силу — победа и так читается через winFlash/winPop
   в style.css, которые уже отключены в той же media-query).
   ============================================================ */
const Confetti = (() => {
  const COLORS = ['#b7502e', '#d9a441', '#7a3b56', '#2b2723'];
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let canvas, ctx, rafId = null;

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
  }

  /* opts.count/opts.durationMs — опциональны, по умолчанию поведение
     ИДЕНТИЧНО прежнему (44 частицы, ~2.6с). Используется экраном главы
     (main.js) для заведомо более лёгкого всплеска — финал остаётся
     единственным с полноразмерным конфетти. */
  function burst(opts) {
    if (!canvas || reduceMotion) return;
    const count = (opts && opts.count) || 44;
    const durationMs = (opts && opts.durationMs) || 2600;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * cssW,
        y: -20 - Math.random() * cssH * 0.6,
        vx: (Math.random() - 0.5) * 2.2,
        vy: 2 + Math.random() * 2.2,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isCircle: Math.random() < 0.5
      });
    }

    if (rafId) cancelAnimationFrame(rafId);
    const t0 = performance.now();
    let lastT = t0;

    function frame(now) {
      const dt = Math.min(32, now - lastT);
      lastT = now;
      const step = dt / 16;
      ctx.clearRect(0, 0, cssW, cssH);

      for (const p of particles) {
        p.vy += 0.025 * step;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.rot += p.vrot * step;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }

      if (now - t0 < durationMs) {
        rafId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, cssW, cssH);
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(frame);
  }

  return { init, burst };
})();
