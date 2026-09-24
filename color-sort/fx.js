/* ============================================================
   fx.js — слой частиц поверх игрового поля (ТЗ №22, B1).
   Отдельный canvas (pointer-events:none) на весь игровой экран, чтобы
   искры не обрезались краем ужатого #board-canvas. Координаты на вход —
   КЛИЕНТСКИЕ (Board.getVialClientRect), слой сам переводит их в свои.

   RAF крутится только пока есть живые частицы. Лимит частиц держит
   кадр дешёвым на слабых телефонах. prefers-reduced-motion выключает
   слой целиком (тот же принцип, что у confetti.js).
   ============================================================ */
const Fx = (() => {
  const MAX_PARTICLES = 160;
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let canvas, ctx, rafId = null, lastT = 0;
  let particles = [];
  let rings = [];
  let outline = '#2b2723';

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
  }

  // Обводка частиц — цвет обводки темы (Board.THEME.outline), чтобы
  // искры цвета элемента читались и на подложке того же тона (N-34).
  function setOutline(color) { if (color) outline = color; }

  function syncSize() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  function toLocal(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function spawn(p) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    particles.push(p);
  }

  /* Сборка колбы: фонтан искр цвета элемента из горла колбы + кольцо.
     size — размер элемента поля (масштаб эффекта следует за полем). */
  function burst(clientX, clientY, color, size) {
    if (!canvas || reduceMotion) return;
    const { x, y } = toLocal(clientX, clientY);
    const s = size || 40;
    const count = 22;
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const v = s * (0.09 + Math.random() * 0.11);
      spawn({
        x, y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        g: s * 0.006,
        size: s * (0.12 + Math.random() * 0.14),
        life: 0, maxLife: 620 + Math.random() * 380,
        color, circle: Math.random() < 0.55,
        rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.3
      });
    }
    rings.push({ x, y, r0: s * 0.3, r1: s * 1.5, life: 0, maxLife: 480, color });
    start();
  }

  /* Приземление перелива: 5–6 мелких брызг в стороны. */
  function splash(clientX, clientY, color, size) {
    if (!canvas || reduceMotion) return;
    const { x, y } = toLocal(clientX, clientY);
    const s = size || 40;
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i / 5 - 0.5) * Math.PI * 1.2;
      const v = s * (0.05 + Math.random() * 0.04);
      spawn({
        x, y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        g: s * 0.005,
        size: s * (0.08 + Math.random() * 0.06),
        life: 0, maxLife: 320 + Math.random() * 120,
        color, circle: true, rot: 0, vrot: 0
      });
    }
    start();
  }

  function start() {
    if (rafId) return;
    lastT = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function frame(now) {
    const dt = Math.min(32, now - lastT);
    lastT = now;
    const step = dt / 16;
    const { w, h } = syncSize();
    ctx.clearRect(0, 0, w, h);

    for (const ring of rings) {
      ring.life += dt;
      const t = Math.min(1, ring.life / ring.maxLife);
      const r = ring.r0 + (ring.r1 - ring.r0) * (1 - (1 - t) * (1 - t));
      ctx.globalAlpha = 0.6 * (1 - t);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = Math.max(1.5, ring.r0 * 0.25 * (1 - t));
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    rings = rings.filter(r => r.life < r.maxLife);

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = outline;
    for (const p of particles) {
      p.life += dt;
      p.vy += p.g * step;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.rot += p.vrot * step;
      const t = p.life / p.maxLife;
      ctx.globalAlpha = t < 0.7 ? 1 : Math.max(0, (1 - t) / 0.3);
      ctx.fillStyle = p.color;
      const sz = p.size * (1 - t * 0.4);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      if (p.circle) ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
      else ctx.rect(-sz / 2, -sz / 2, sz, sz);
      ctx.fill();
      if (sz > 4) ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life < p.maxLife);

    if (particles.length || rings.length) {
      rafId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, w, h);
      rafId = null;
    }
  }

  function clear() {
    particles = [];
    rings = [];
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (canvas) { const { w, h } = syncSize(); ctx.clearRect(0, 0, w, h); }
  }

  // Для приёмки: сколько частиц живо и крутится ли цикл.
  function stats() { return { particles: particles.length, rings: rings.length, running: !!rafId }; }

  return { init, setOutline, burst, splash, clear, stats };
})();
