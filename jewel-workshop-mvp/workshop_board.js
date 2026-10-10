/* ============================================================
   workshop_board.js — поле «Мастерской украшений»: стеклянные пробирки
   на латунных подставках с ореховой вставкой, камни — спрайты из атласа
   workshop_assets/gems.webp (tools/ws_cut_gems.py). Только рисование,
   анимация и попадание по касанию; правил здесь нет (workshop_rules.js).

   Размеры считаются в долях ширины пробирки tw, раскладка — 1–3 ряда,
   выбирается та, где пробирки крупнее. Пока атлас не загрузился (или не
   загрузится вовсе), камни рисуются цветными кружками.
   ============================================================ */
const WsBoard = (() => {
  'use strict';

  const CAP = 4;
  const PITCH = 0.80;      // шаг камней по высоте
  const GEM = 0.94;        // размер спрайта (в ячейке атласа 10% прозрачных полей)
  const HEAD = 0.45;       // запас над верхним камнем до кромки
  const SINK = 0.36;       // часть пробирки, утопленная в подставку
  const LIP = 0.42;        // высота передней латунной планки
  const LIFT = 0.62;       // на сколько поднимается выбранная группа камней
  const GAP = 0.46;        // зазор между пробирками
  const TRAY_PAD = 0.36;   // поля подставки по бокам
  const ROW_H = LIFT + HEAD + CAP * PITCH + LIP;
  const ROW_GAP = 0.34;
  const MAX_TW = 66;
  const SPRITE = 160;      // размер ячейки атласа

  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let canvas = null, ctx = null, dpr = 1, W = 0, H = 0;
  let atlas = null, atlasReady = false;
  let spriteOf = () => 0, colorOf = () => '#c33';
  let vials = [];
  let lay = null;                 // { tw, slots: [{cx, rimY, baseY, row}], rows: [{x0, x1, baseY}] }
  let selected = -1, tutorial = -1, hint = null, waiting = [];
  let shakes = new Map();         // vial → t0
  let flights = [];               // летящие камни перелива
  let raf = 0;

  function now() { return performance.now(); }

  /* ---------- раскладка ---------- */
  function computeLayout() {
    const n = vials.length;
    if (!n) { lay = { tw: 0, slots: [], rows: [] }; return; }
    let best = null;
    for (let rows = 1; rows <= 3; rows++) {
      const per = Math.ceil(n / rows);
      if (rows > 1 && Math.ceil(n / (rows - 1)) === per) continue;
      const wu = per + (per - 1) * GAP + 2 * TRAY_PAD + 0.3;
      const hu = rows * ROW_H + (rows - 1) * ROW_GAP + 0.3;
      const tw = Math.min(W / wu, H / hu, MAX_TW);
      if (!best || tw > best.tw * 1.04) best = { rows, per, tw };
    }
    const { rows, tw } = best;
    // Ряды: первые полнее, последний — остаток (по центру).
    const counts = [];
    let left = n;
    for (let r = 0; r < rows; r++) { const c = Math.ceil(left / (rows - r)); counts.push(c); left -= c; }
    const totalH = rows * ROW_H * tw + (rows - 1) * ROW_GAP * tw;
    let y = (H - totalH) / 2;
    const slots = [], rowInfo = [];
    let idx = 0;
    counts.forEach((c, r) => {
      const rowW = c * tw + (c - 1) * GAP * tw;
      const x0 = (W - rowW) / 2 + tw / 2;
      const rimY = y + LIFT * tw;
      const baseY = rimY + (HEAD + CAP * PITCH) * tw;
      for (let k = 0; k < c; k++) slots.push({ cx: x0 + k * (1 + GAP) * tw, rimY, baseY, row: r });
      rowInfo.push({ x0: x0 - tw / 2 - TRAY_PAD * tw, x1: x0 + (c - 1) * (1 + GAP) * tw + tw / 2 + TRAY_PAD * tw, baseY });
      idx += c;
      y += (ROW_H + ROW_GAP) * tw;
    });
    lay = { tw, slots, rows: rowInfo };
  }

  function gemPos(v, j) {
    const s = lay.slots[v];
    return { x: s.cx, y: s.baseY - (j + 0.5) * PITCH * lay.tw };
  }

  /* Верхняя группа одинаковых камней — она поднимается при выборе. */
  function topGroup(v) {
    const a = vials[v];
    if (!a || !a.length) return 0;
    let k = 0;
    for (let i = a.length - 1; i >= 0 && a[i] === a[a.length - 1]; i--) k++;
    return k;
  }

  /* ---------- рисование ---------- */
  function drawGem(g, gem, x, y, size, alpha) {
    if (alpha !== undefined) g.globalAlpha = alpha;
    if (atlasReady) {
      g.drawImage(atlas, spriteOf(gem) * SPRITE, 0, SPRITE, SPRITE, x - size / 2, y - size / 2, size, size);
    } else {
      const r = size * 0.4;
      const grd = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
      grd.addColorStop(0, '#fff');
      grd.addColorStop(0.25, colorOf(gem));
      grd.addColorStop(1, '#000');
      g.fillStyle = grd;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    if (alpha !== undefined) g.globalAlpha = 1;
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function brass(g, y0, y1) {
    const grd = g.createLinearGradient(0, y0, 0, y1);
    grd.addColorStop(0, '#fbe7a6');
    grd.addColorStop(0.18, '#e2b85e');
    grd.addColorStop(0.55, '#a8742b');
    grd.addColorStop(0.85, '#6e4817');
    grd.addColorStop(1, '#4a2f0f');
    return grd;
  }

  function drawTrayBack(row) {
    const tw = lay.tw;
    const x = row.x0, w = row.x1 - row.x0;
    const y = row.baseY - 0.95 * tw, h = 0.95 * tw + LIP * tw * 0.5;
    // тень подставки на столе
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    roundRect(ctx, x + tw * 0.08, y + tw * 0.2, w, h + LIP * tw, tw * 0.22);
    ctx.fill();
    // латунная рамка
    ctx.fillStyle = brass(ctx, y, y + h);
    roundRect(ctx, x, y, w, h, tw * 0.2);
    ctx.fill();
    // ореховая вставка
    const inset = tw * 0.1;
    const wood = ctx.createLinearGradient(0, y + inset, 0, y + h);
    wood.addColorStop(0, '#1e120a');
    wood.addColorStop(0.5, '#3b2414');
    wood.addColorStop(1, '#4a2e19');
    ctx.fillStyle = wood;
    roundRect(ctx, x + inset, y + inset, w - inset * 2, h - inset, tw * 0.13);
    ctx.fill();
  }

  function drawTrayFront(row) {
    const tw = lay.tw;
    const x = row.x0 - tw * 0.04, w = row.x1 - row.x0 + tw * 0.08;
    const y = row.baseY, h = LIP * tw;
    ctx.fillStyle = brass(ctx, y, y + h);
    roundRect(ctx, x, y, w, h, tw * 0.14);
    ctx.fill();
    // ореховая полоска-инкрустация по центру планки
    const wood = ctx.createLinearGradient(0, y + h * 0.36, 0, y + h * 0.66);
    wood.addColorStop(0, '#2a180c');
    wood.addColorStop(1, '#5a3a1f');
    ctx.fillStyle = wood;
    roundRect(ctx, x + tw * 0.3, y + h * 0.36, w - tw * 0.6, h * 0.3, h * 0.12);
    ctx.fill();
    // блик по верхней кромке
    ctx.fillStyle = 'rgba(255,245,210,0.55)';
    ctx.fillRect(x + tw * 0.15, y + 1, w - tw * 0.3, Math.max(1, h * 0.07));
  }

  function tubePath(cx, rimY, baseY, tw) {
    const l = cx - tw / 2, r = cx + tw / 2, bot = baseY + SINK * tw;
    ctx.beginPath();
    ctx.moveTo(l, rimY);
    ctx.lineTo(l, bot - tw / 2);
    ctx.arc(cx, bot - tw / 2, tw / 2, Math.PI, 0, true);
    ctx.lineTo(r, rimY);
  }

  function drawTube(v, t, ox) {
    const s = lay.slots[v], tw = lay.tw;
    const cx = s.cx + ox;
    const isSel = v === selected;
    const isWait = waiting.indexOf(v) !== -1;
    const isHintFrom = hint && hint.from === v;
    // стекло: лёгкий тон тела
    tubePath(cx, s.rimY, s.baseY, tw);
    ctx.closePath();
    const body = ctx.createLinearGradient(cx - tw / 2, 0, cx + tw / 2, 0);
    body.addColorStop(0, 'rgba(255,248,235,0.16)');
    body.addColorStop(0.3, 'rgba(255,248,235,0.05)');
    body.addColorStop(0.72, 'rgba(0,0,0,0.16)');
    body.addColorStop(1, 'rgba(255,248,235,0.12)');
    ctx.fillStyle = body;
    ctx.fill();
    // камни (выбранная группа рисуется позже, поверх всего)
    const a = vials[v];
    const lifted = isSel ? topGroup(v) : 0;
    for (let j = 0; j < a.length - lifted; j++) {
      const p = gemPos(v, j);
      drawGem(ctx, a[j], p.x + ox, p.y, GEM * tw);
    }
    // контур и блики стекла
    tubePath(cx, s.rimY, s.baseY, tw);
    let edge = 'rgba(255,240,220,0.42)';
    let lw = Math.max(1, tw * 0.035);
    if (isSel) { edge = '#ffd77a'; lw = Math.max(1.5, tw * 0.06); }
    else if (isHintFrom) { edge = `rgba(255,215,122,${0.45 + 0.45 * Math.sin(t / 180) ** 2})`; lw = Math.max(1.5, tw * 0.06); }
    else if (isWait) { edge = 'rgba(255,215,122,0.75)'; }
    ctx.strokeStyle = edge;
    ctx.lineWidth = lw;
    if (isSel || isHintFrom) { ctx.shadowColor = 'rgba(255,200,90,0.9)'; ctx.shadowBlur = tw * 0.35; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    const hl = ctx.createLinearGradient(0, s.rimY, 0, s.baseY);
    hl.addColorStop(0, 'rgba(255,255,255,0.42)');
    hl.addColorStop(1, 'rgba(255,255,255,0.04)');
    ctx.fillStyle = hl;
    roundRect(ctx, cx - tw * 0.36, s.rimY + tw * 0.22, tw * 0.11, s.baseY - s.rimY - tw * 0.2, tw * 0.05);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    roundRect(ctx, cx + tw * 0.25, s.rimY + tw * 0.4, tw * 0.06, (s.baseY - s.rimY) * 0.55, tw * 0.03);
    ctx.fill();
    // кромка горлышка
    ctx.beginPath();
    ctx.ellipse(cx, s.rimY, tw / 2, tw * 0.11, 0, 0, Math.PI * 2);
    ctx.strokeStyle = isSel ? '#ffe39b' : 'rgba(255,250,240,0.6)';
    ctx.lineWidth = Math.max(1, tw * 0.04);
    ctx.stroke();
  }

  function drawLifted(t, ox) {
    if (selected < 0 || !vials[selected]) return;
    const k = topGroup(selected);
    const a = vials[selected], tw = lay.tw;
    const bob = reduceMotion ? 0 : Math.sin(t / 260) * tw * 0.04;
    for (let j = a.length - k; j < a.length; j++) {
      const p = gemPos(selected, j);
      const y = p.y - LIFT * tw * 1.05 + bob;
      const glow = ctx.createRadialGradient(p.x + ox, y, 0, p.x + ox, y, tw * 0.62);
      glow.addColorStop(0, 'rgba(255,214,140,0.55)');
      glow.addColorStop(1, 'rgba(255,214,140,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(p.x + ox - tw, y - tw, tw * 2, tw * 2);
      drawGem(ctx, a[j], p.x + ox, y, GEM * tw);
    }
  }

  function drawTutorial(t) {
    if (tutorial < 0 || !lay.slots[tutorial]) return;
    const s = lay.slots[tutorial], tw = lay.tw;
    const k = reduceMotion ? 0.5 : (Math.sin(t / 260) + 1) / 2;
    const cy = (s.rimY + s.baseY) / 2;
    ctx.beginPath();
    ctx.ellipse(s.cx, cy, tw * (0.95 + 0.12 * k), (s.baseY - s.rimY) * (0.62 + 0.04 * k), 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,222,140,${0.55 + 0.4 * k})`;
    ctx.lineWidth = Math.max(2, tw * 0.07);
    ctx.setLineDash([tw * 0.22, tw * 0.14]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawHintArrow(t) {
    if (!hint || !lay.slots[hint.to]) return;
    const s = lay.slots[hint.to], tw = lay.tw;
    const bob = reduceMotion ? 0 : Math.sin(t / 200) * tw * 0.12;
    const y = s.rimY - tw * 0.32 + bob, x = s.cx;
    ctx.beginPath();
    ctx.moveTo(x - tw * 0.3, y - tw * 0.3);
    ctx.lineTo(x, y);
    ctx.lineTo(x + tw * 0.3, y - tw * 0.3);
    ctx.strokeStyle = '#ffd77a';
    ctx.lineWidth = Math.max(2, tw * 0.1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = tw * 0.15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawFlights(t) {
    const tw = lay.tw;
    for (const f of flights) {
      if (t < f.t0) continue;
      const k = Math.min(1, (t - f.t0) / f.dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const cx = (f.x0 + f.x1) / 2, cy = Math.min(f.y0, f.y1) - tw * 1.1;
      const x = (1 - e) * (1 - e) * f.x0 + 2 * (1 - e) * e * cx + e * e * f.x1;
      const y = (1 - e) * (1 - e) * f.y0 + 2 * (1 - e) * e * cy + e * e * f.y1;
      drawGem(ctx, f.gem, x, y, GEM * tw);
    }
  }

  function frame() {
    raf = 0;
    if (!ctx || !lay) return;
    const t = now();
    // приземлившиеся камни переходят в пробирку
    let landed = false;
    flights = flights.filter(f => {
      if (t >= f.t0 + f.dur) { vials[f.to].push(f.gem); landed = true; f.onLand && f.onLand(); return false; }
      return true;
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    lay.rows.forEach(drawTrayBack);
    lay.slots.forEach((s, v) => {
      let ox = 0;
      const t0 = shakes.get(v);
      if (t0 !== undefined) {
        const k = (t - t0) / 380;
        if (k >= 1) shakes.delete(v);
        else ox = Math.sin(k * Math.PI * 6) * lay.tw * 0.13 * (1 - k);
      }
      drawTube(v, t, ox);
    });
    lay.rows.forEach(drawTrayFront);
    drawTutorial(t);
    drawLifted(t, 0);
    drawFlights(t);
    drawHintArrow(t);
    const busy = flights.length || shakes.size || selected >= 0 || tutorial >= 0 || hint;
    if (busy || landed) request();
  }

  function request() { if (!raf) raf = requestAnimationFrame(frame); }

  /* ---------- публичное ---------- */
  function init(canvasEl, opts) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    spriteOf = opts.spriteOf;
    colorOf = opts.colorOf;
    atlas = new Image();
    atlas.onload = () => { atlasReady = true; request(); };
    atlas.src = opts.atlasUrl;
    resize();
    // Область поля меняется не только с окном: баннер «не собрать», строка
    // подсказки, поворот. Холст подстраивается сам, иначе он вылезает на кнопки.
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(() => {
        const box = canvas.parentElement.getBoundingClientRect();
        if (Math.floor(box.width) !== W || Math.floor(box.height) !== H) resize();
      }).observe(canvas.parentElement);
    }
  }

  function resize() {
    if (!canvas) return;
    const box = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.floor(box.width));
    H = Math.max(1, Math.floor(box.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    computeLayout();
    request();
  }

  function setVials(v) {
    const relayout = !lay || v.length !== vials.length;
    vials = v.map(x => x.slice());
    flights = [];
    shakes.clear();
    if (relayout) computeLayout();
    request();
  }

  /* Перелив: count верхних камней из from летят по дуге в to. cb — когда
     все приземлились (отображение уже совпадает с новым состоянием). */
  function pour(from, to, count, cb) {
    const src = vials[from];
    const moving = src.splice(src.length - count, count);
    const wasLifted = selected === from;
    selected = -1;
    const t = now();
    const base = vials[to].length;
    const step = reduceMotion ? 0 : 70, dur = reduceMotion ? 120 : 300;
    let left = moving.length;
    moving.forEach((gem, k) => {
      const p0 = gemPos(from, src.length + k);
      const p1 = gemPos(to, base + k);
      flights.push({
        gem, to, t0: t + k * step, dur,
        x0: p0.x, y0: p0.y - (wasLifted ? LIFT * lay.tw * 1.05 : 0), x1: p1.x, y1: p1.y,
        onLand: () => { if (--left === 0 && cb) setTimeout(cb, 0); }
      });
    });
    request();
  }

  function select(v) { selected = v; request(); }
  function shake(v) { shakes.set(v, now()); request(); }
  function showHint(from, to) { hint = { from, to }; request(); }
  function clearHint() { hint = null; request(); }
  function setTutorial(v) { tutorial = v; request(); }
  function setWaiting(list) { waiting = list.slice(); request(); }

  /* Забрать камни выданной пробирки: координаты на экране (для полёта к
     карточке) и опустошение пробирки на поле. */
  function takeVial(v) {
    const r = canvas.getBoundingClientRect();
    const out = vials[v].map((gem, j) => {
      const p = gemPos(v, j);
      return { gem, x: r.left + p.x, y: r.top + p.y, size: GEM * lay.tw };
    });
    vials[v] = [];
    request();
    return out;
  }

  function hitTest(clientX, clientY) {
    if (!lay) return -1;
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const tw = lay.tw;
    let best = -1, bestD = Infinity;
    lay.slots.forEach((s, v) => {
      const top = s.rimY - LIFT * tw, bot = s.baseY + LIP * tw;
      if (y < top || y > bot) return;
      const d = Math.abs(x - s.cx);
      if (d <= tw * (0.5 + GAP / 2) + 1 && d < bestD) { bestD = d; best = v; }
    });
    return best;
  }

  function vialClientRect(v) {
    if (!lay || !lay.slots[v]) return null;
    const r = canvas.getBoundingClientRect();
    const s = lay.slots[v], tw = lay.tw;
    return { left: r.left + s.cx - tw / 2, top: r.top + s.rimY, width: tw, height: s.baseY - s.rimY, gem: GEM * tw };
  }

  return {
    init, resize, setVials, pour, select, shake, showHint, clearHint, setTutorial, setWaiting,
    takeVial, hitTest, vialClientRect, drawGem: (g, gem, x, y, size, alpha) => drawGem(g, gem, x, y, size, alpha),
    isAnimating: () => flights.length > 0,
    atlasReady: () => atlasReady,
    layout: () => lay && { tw: lay.tw, rows: lay.rows.length }
  };
})();
