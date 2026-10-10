/* ============================================================
   workshop_board.js — поле «Мастерской украшений»: стеклянные пробирки
   на латунных подставках с ореховой вставкой, камни — спрайты из атласа
   workshop_assets/gems.webp (tools/ws_cut_gems.py). Только рисование,
   анимация и попадание по касанию; правил здесь нет (workshop_rules.js).

   Размеры считаются в долях ширины пробирки tw, раскладка — 1–3 ряда,
   выбирается та, где пробирки крупнее. Пока атлас не загрузился (или не
   загрузится вовсе), камни рисуются цветными кружками.

   Сочность (план 10.10, этап 1): камни летят по дуге с весом и
   подпрыгивают на месте, на каждом приземлении — колбэк (нота) и искорка;
   готовая четвёрка вспыхивает перед выдачей; по камням изредка пробегают
   блики; каскад встряхивает поле. Тайные камни — бархатные шарики «?»,
   запертая пробирка — с замком, золотой топаз — с тёплым ореолом.
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
  const GOLD = 'Z';        // золотой топаз

  // Оттенки стекла (убранство из шкатулок): тон тела и кромки.
  const TUBES = {
    clear: { tint: '255,248,235', rim: '255,250,240' },
    sea:   { tint: '150,235,225', rim: '190,255,245' },
    rose:  { tint: '255,190,210', rim: '255,215,228' },
    royal: { tint: '200,170,255', rim: '255,224,150' }
  };

  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let canvas = null, ctx = null, dpr = 1, W = 0, H = 0;
  let atlas = null, atlasReady = false;
  let spriteOf = () => 0, colorOf = () => '#c33';
  let vials = [];
  let hid = [];                   // сколько нижних камней каждой пробирки под бархатом
  let locked = -1;                // запертая пробирка
  let lay = null;                 // { tw, slots: [{cx, rimY, baseY, row}], rows: [{x0, x1, baseY}] }
  let selected = -1, tutorial = -1, hint = null, waiting = [];
  let tube = TUBES.clear;
  let shakes = new Map();         // vial → t0
  let flights = [];               // летящие камни перелива
  let bounces = new Map();        // 'v:j' → t0 приземления
  let flips = new Map();          // vial → t0 открытия тайного камня
  let flashes = new Map();        // vial → { t0, dur } вспышка готовой четвёрки
  let unlockAt = null;            // { v, t0 } — замок открывается
  let sparks = [];                // искорки приземления
  let glints = [];                // блики на камнях { v, j, t0 }
  let quakeAt = null;             // { t0, power } — встряска поля
  let raf = 0, glintTimer = 0;

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
    counts.forEach((c, r) => {
      const rowW = c * tw + (c - 1) * GAP * tw;
      const x0 = (W - rowW) / 2 + tw / 2;
      const rimY = y + LIFT * tw;
      const baseY = rimY + (HEAD + CAP * PITCH) * tw;
      for (let k = 0; k < c; k++) slots.push({ cx: x0 + k * (1 + GAP) * tw, rimY, baseY, row: r });
      rowInfo.push({ x0: x0 - tw / 2 - TRAY_PAD * tw, x1: x0 + (c - 1) * (1 + GAP) * tw + tw / 2 + TRAY_PAD * tw, baseY });
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

  /* Тайный камень: бархатный шарик винного цвета с золотым «?». */
  function drawHidden(g, x, y, size, sx) {
    const r = size * 0.4;
    g.save();
    g.translate(x, y);
    g.scale(sx === undefined ? 1 : Math.max(0.05, sx), 1);
    const grd = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    grd.addColorStop(0, '#9b3a52');
    grd.addColorStop(0.55, '#5e1a2c');
    grd.addColorStop(1, '#2a0812');
    g.fillStyle = grd;
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(240,200,120,0.75)';
    g.lineWidth = Math.max(1, r * 0.08);
    g.stroke();
    g.fillStyle = '#f3d27f';
    g.font = `bold ${Math.round(r * 1.2)}px Georgia, serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('?', 0, r * 0.06);
    g.restore();
  }

  /* Четырёхлучевая звёздочка-блик. */
  function star(g, x, y, r, a) {
    g.save();
    g.globalAlpha = a;
    g.fillStyle = '#fffbe8';
    g.beginPath();
    g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
    g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r);
    g.fill();
    g.globalAlpha = a * 0.5;
    g.beginPath(); g.arc(x, y, r * 0.35, 0, Math.PI * 2); g.fill();
    g.restore();
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
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    roundRect(ctx, x + tw * 0.08, y + tw * 0.2, w, h + LIP * tw, tw * 0.22);
    ctx.fill();
    ctx.fillStyle = brass(ctx, y, y + h);
    roundRect(ctx, x, y, w, h, tw * 0.2);
    ctx.fill();
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
    const wood = ctx.createLinearGradient(0, y + h * 0.36, 0, y + h * 0.66);
    wood.addColorStop(0, '#2a180c');
    wood.addColorStop(1, '#5a3a1f');
    ctx.fillStyle = wood;
    roundRect(ctx, x + tw * 0.3, y + h * 0.36, w - tw * 0.6, h * 0.3, h * 0.12);
    ctx.fill();
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

  /* Смещение и масштаб камня j пробирки v: подпрыгивание после приземления,
     пульс готовой четвёрки. */
  function gemMotion(v, j, t) {
    let dy = 0, sc = 1, sy = 1;
    const b = bounces.get(v + ':' + j);
    if (b !== undefined) {
      const k = (t - b) / 300;
      if (k >= 1) bounces.delete(v + ':' + j);
      else if (k >= 0) {
        // приземление с весом: сплющился, подскочил, второй маленький отскок
        if (k < 0.14) sy = 1 - 0.2 * Math.sin((k / 0.14) * Math.PI);
        else dy = -Math.abs(Math.sin(((k - 0.14) / 0.86) * Math.PI * 1.5)) * (1 - k) * 0.3 * lay.tw;
      }
    }
    const f = flashes.get(v);
    if (f) {
      const k = Math.min(1, (t - f.t0) / f.dur);
      sc = 1 + 0.16 * Math.sin(k * Math.PI) + 0.05 * Math.sin(k * Math.PI * 3 + j);
      dy -= Math.sin(k * Math.PI) * lay.tw * 0.06 * (j + 1) / 2;
    }
    return { dy, sc, sy };
  }

  function drawStone(v, j, gem, x, y, t) {
    const tw = lay.tw, m = gemMotion(v, j, t);
    const size = GEM * tw * m.sc;
    const isHid = j < (hid[v] || 0);
    const fl = flips.get(v);
    if (fl !== undefined && j === vials[v].length - 1) {
      const k = (t - fl) / 360;
      if (k >= 1) flips.delete(v);
      else {
        const sx = Math.abs(Math.cos(k * Math.PI));
        if (k < 0.5) drawHidden(ctx, x, y + m.dy, size, sx);
        else { ctx.save(); ctx.translate(x, y + m.dy); ctx.scale(Math.max(0.05, sx), 1); drawGem(ctx, gem, 0, 0, size); ctx.restore(); }
        return;
      }
    }
    if (isHid) { drawHidden(ctx, x, y + m.dy, size); return; }
    if (gem === GOLD) {
      const glow = ctx.createRadialGradient(x, y + m.dy, 0, x, y + m.dy, tw * 0.7);
      glow.addColorStop(0, 'rgba(255,214,110,0.55)');
      glow.addColorStop(1, 'rgba(255,214,110,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - tw, y + m.dy - tw, tw * 2, tw * 2);
    }
    if (m.sy !== 1) {
      ctx.save(); ctx.translate(x, y + size * 0.4); ctx.scale(1 + (1 - m.sy) * 0.6, m.sy);
      drawGem(ctx, gem, 0, -size * 0.4, size); ctx.restore();
    } else drawGem(ctx, gem, x, y + m.dy, size);
  }

  function drawTube(v, t, ox) {
    const s = lay.slots[v], tw = lay.tw;
    const cx = s.cx + ox;
    const isSel = v === selected;
    const isWait = waiting.indexOf(v) !== -1;
    const isHintFrom = hint && hint.from === v;
    const fl = flashes.get(v);
    // стекло: лёгкий тон тела
    tubePath(cx, s.rimY, s.baseY, tw);
    ctx.closePath();
    const body = ctx.createLinearGradient(cx - tw / 2, 0, cx + tw / 2, 0);
    body.addColorStop(0, `rgba(${tube.tint},0.18)`);
    body.addColorStop(0.3, `rgba(${tube.tint},0.06)`);
    body.addColorStop(0.72, 'rgba(0,0,0,0.16)');
    body.addColorStop(1, `rgba(${tube.tint},0.13)`);
    ctx.fillStyle = body;
    ctx.fill();
    if (fl) {
      // готовая четвёрка: золотое сияние изнутри
      const k = Math.min(1, (t - fl.t0) / fl.dur);
      const a = Math.sin(k * Math.PI);
      const grd = ctx.createRadialGradient(cx, (s.rimY + s.baseY) / 2, 0, cx, (s.rimY + s.baseY) / 2, tw * 2.1);
      grd.addColorStop(0, `rgba(255,236,160,${0.75 * a})`);
      grd.addColorStop(1, 'rgba(255,236,160,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(cx - tw * 2.2, s.rimY - tw, tw * 4.4, s.baseY - s.rimY + tw * 2);
    }
    // камни (выбранная группа рисуется позже, поверх всего)
    const a = vials[v];
    const lifted = isSel ? topGroup(v) : 0;
    for (let j = 0; j < a.length - lifted; j++) {
      const p = gemPos(v, j);
      drawStone(v, j, a[j], p.x + ox, p.y, t);
    }
    // контур и блики стекла
    tubePath(cx, s.rimY, s.baseY, tw);
    let edge = `rgba(${tube.rim},0.42)`;
    let lw = Math.max(1, tw * 0.035);
    if (isSel) { edge = '#ffd77a'; lw = Math.max(1.5, tw * 0.06); }
    else if (fl) { edge = '#fff0b8'; lw = Math.max(1.5, tw * 0.07); }
    else if (isHintFrom) { edge = `rgba(255,215,122,${0.45 + 0.45 * Math.sin(t / 180) ** 2})`; lw = Math.max(1.5, tw * 0.06); }
    else if (isWait) { edge = 'rgba(255,215,122,0.75)'; }
    ctx.strokeStyle = edge;
    ctx.lineWidth = lw;
    if (isSel || isHintFrom || fl) { ctx.shadowColor = 'rgba(255,200,90,0.9)'; ctx.shadowBlur = tw * (fl ? 0.6 : 0.35); }
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
    ctx.beginPath();
    ctx.ellipse(cx, s.rimY, tw / 2, tw * 0.11, 0, 0, Math.PI * 2);
    ctx.strokeStyle = isSel ? '#ffe39b' : `rgba(${tube.rim},0.6)`;
    ctx.lineWidth = Math.max(1, tw * 0.04);
    ctx.stroke();
    if (v === locked || (unlockAt && unlockAt.v === v)) drawLock(v, cx, t);
  }

  /* Замок на запертой пробирке: тёмная вуаль, цепочка и латунный замок. */
  function drawLock(v, cx, t) {
    const s = lay.slots[v], tw = lay.tw;
    let k = 0;
    if (unlockAt && unlockAt.v === v) {
      k = Math.min(1, (t - unlockAt.t0) / 520);
      if (k >= 1) { unlockAt = null; return; }
    }
    ctx.save();
    ctx.globalAlpha = 1 - k;
    tubePath(cx, s.rimY, s.baseY, tw);
    ctx.closePath();
    ctx.fillStyle = 'rgba(20,10,4,0.45)';
    ctx.fill();
    const y = s.rimY + (s.baseY - s.rimY) * 0.42;
    // цепочка крест-накрест
    ctx.strokeStyle = 'rgba(200,160,90,0.85)';
    ctx.lineWidth = Math.max(1.2, tw * 0.05);
    ctx.setLineDash([tw * 0.1, tw * 0.06]);
    ctx.beginPath();
    ctx.moveTo(cx - tw * 0.55, y - tw * 0.7); ctx.lineTo(cx + tw * 0.55, y + tw * 0.5);
    ctx.moveTo(cx + tw * 0.55, y - tw * 0.7); ctx.lineTo(cx - tw * 0.55, y + tw * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    // дужка (при открытии поднимается) и корпус замка
    const lift = k * tw * 0.3;
    ctx.strokeStyle = '#e8c06a';
    ctx.lineWidth = Math.max(2, tw * 0.09);
    ctx.beginPath();
    ctx.arc(cx, y - tw * 0.1 - lift, tw * 0.2, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = brass(ctx, y - tw * 0.12, y + tw * 0.34);
    roundRect(ctx, cx - tw * 0.3, y - tw * 0.12, tw * 0.6, tw * 0.46, tw * 0.08);
    ctx.fill();
    ctx.fillStyle = '#3a2410';
    ctx.beginPath(); ctx.arc(cx, y + tw * 0.06, tw * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - tw * 0.025, y + tw * 0.06, tw * 0.05, tw * 0.14);
    ctx.restore();
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

  /* Полёт камня: дуга вверх и падение с ускорением (вес), лёгкий поворот. */
  function flightPos(f, t) {
    const tw = lay.tw;
    const k = Math.min(1, Math.max(0, (t - f.t0) / f.dur));
    const x = f.x0 + (f.x1 - f.x0) * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    const peak = Math.min(f.y0, f.y1) - tw * 1.1;
    // вверх — замедляясь, вниз — разгоняясь
    const up = 0.42;
    let y;
    if (k < up) { const q = k / up; y = f.y0 + (peak - f.y0) * (1 - (1 - q) * (1 - q)); }
    else { const q = (k - up) / (1 - up); y = peak + (f.y1 - peak) * q * q; }
    return { x, y, k };
  }

  function drawFlights(t) {
    const tw = lay.tw;
    for (const f of flights) {
      if (t < f.t0) continue;
      const p = flightPos(f, t);
      drawGem(ctx, f.gem, p.x, p.y, GEM * tw * (1 + 0.08 * Math.sin(p.k * Math.PI)));
    }
  }

  function drawSparks(t) {
    sparks = sparks.filter(s => {
      const k = (t - s.t0) / s.dur;
      if (k >= 1) return false;
      if (k < 0) return true;
      const d = s.r * (0.3 + 0.9 * k);
      ctx.fillStyle = `rgba(255,236,170,${0.95 * (1 - k)})`;
      ctx.beginPath(); ctx.arc(s.x + s.vx * d, s.y + s.vy * d - k * k * s.r * 0.4, s.size * (1 - k * 0.6), 0, Math.PI * 2); ctx.fill();
      return true;
    });
  }

  function drawGlints(t) {
    const tw = lay.tw;
    glints = glints.filter(gl => {
      const k = (t - gl.t0) / 520;
      if (k >= 1 || !vials[gl.v] || gl.j >= vials[gl.v].length) return false;
      const p = gemPos(gl.v, gl.j);
      star(ctx, p.x - tw * 0.16, p.y - tw * 0.16, tw * 0.26 * Math.sin(k * Math.PI), 0.9 * Math.sin(k * Math.PI));
      return true;
    });
  }

  function addSparks(x, y, n, r) {
    if (reduceMotion) return;
    const t = now();
    for (let i = 0; i < n; i++) {
      const a = -Math.PI * (0.1 + 0.8 * (i / Math.max(1, n - 1))) + (Math.random() - 0.5) * 0.3;
      sparks.push({ x, y, vx: Math.cos(a), vy: Math.sin(a), r, size: Math.max(1.2, lay.tw * 0.045), t0: t, dur: 360 });
    }
  }

  function frame() {
    raf = 0;
    if (!ctx || !lay) return;
    const t = now();
    // приземлившиеся камни переходят в пробирку
    let landed = false;
    flights = flights.filter(f => {
      if (t >= f.t0 + f.dur) {
        vials[f.to].push(f.gem);
        const j = vials[f.to].length - 1;
        if (!reduceMotion) bounces.set(f.to + ':' + j, t);
        const p = gemPos(f.to, j);
        addSparks(p.x, p.y + lay.tw * 0.3, 5, lay.tw * 0.5);
        landed = true;
        f.onLand && f.onLand();
        return false;
      }
      return true;
    });
    for (const [v, f] of flashes) if (t >= f.t0 + f.dur) { flashes.delete(v); f.cb && setTimeout(f.cb, 0); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    let qx = 0, qy = 0;
    if (quakeAt) {
      const k = (t - quakeAt.t0) / 340;
      if (k >= 1) quakeAt = null;
      else {
        const amp = lay.tw * 0.09 * quakeAt.power * (1 - k);
        qx = Math.sin(k * Math.PI * 9) * amp; qy = Math.cos(k * Math.PI * 7) * amp * 0.5;
        ctx.translate(qx, qy);
      }
    }
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
    drawGlints(t);
    drawTutorial(t);
    drawLifted(t, 0);
    drawFlights(t);
    drawSparks(t);
    drawHintArrow(t);
    const busy = flights.length || shakes.size || selected >= 0 || tutorial >= 0 || hint || bounces.size ||
      flips.size || flashes.size || unlockAt || sparks.length || glints.length || quakeAt;
    if (busy || landed) request();
  }

  function request() { if (!raf) raf = requestAnimationFrame(frame); }

  /* Блики: раз в 1–2,5 с случайный открытый камень вспыхивает звёздочкой
     (золотые — чаще). Пока поле не видно, блики не запускаются. */
  function scheduleGlint() {
    clearTimeout(glintTimer);
    if (reduceMotion) return;
    glintTimer = setTimeout(() => {
      if (!document.hidden && canvas && canvas.offsetParent !== null && lay && !flights.length) {
        const all = [], gold = [];
        vials.forEach((a, v) => a.forEach((gem, j) => {
          if (j < (hid[v] || 0) || v === locked) return;
          all.push({ v, j });
          if (gem === GOLD) gold.push({ v, j });
        }));
        const pool = gold.length && Math.random() < 0.5 ? gold : all;
        if (pool.length) { glints.push(Object.assign({ t0: now() }, pool[Math.floor(Math.random() * pool.length)])); request(); }
      }
      scheduleGlint();
    }, 1000 + Math.random() * 1500);
  }

  /* ---------- публичное ---------- */
  function init(canvasEl, opts) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    spriteOf = opts.spriteOf;
    colorOf = opts.colorOf;
    atlas = new Image();
    atlas.onload = () => { atlasReady = true; request(); opts.onAtlas && opts.onAtlas(); };
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
    scheduleGlint();
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

  /* Поле целиком (новая партия, отмена, страховка после анимаций):
     все анимации обрываются. h — тайные камни, lockV — запертая пробирка. */
  function setVials(v, h, lockV) {
    const relayout = !lay || v.length !== vials.length;
    vials = v.map(x => x.slice());
    hid = h ? h.slice() : vials.map(() => 0);
    locked = lockV === undefined ? -1 : lockV;
    flights = [];
    shakes.clear(); bounces.clear(); flips.clear();
    for (const f of flashes.values()) f.cb && setTimeout(f.cb, 0);
    flashes.clear();
    unlockAt = null; sparks = []; glints = []; quakeAt = null;
    if (relayout) computeLayout();
    request();
  }

  /* Перелив: count верхних камней из from летят по дуге в to.
     opts.onGem(k) — k-й камень приземлился (нота); opts.hid — тайные камни
     после хода; opts.reveal — у источника открылся новый верхний камень.
     cb — когда все приземлились (отображение совпадает с новым состоянием). */
  function pour(from, to, count, cb, opts) {
    opts = opts || {};
    const src = vials[from];
    const moving = src.splice(src.length - count, count);
    const wasLifted = selected === from;
    selected = -1;
    if (opts.hid) hid = opts.hid.slice();
    const t = now();
    if (opts.reveal && src.length) flips.set(from, t + (reduceMotion ? 0 : 120));
    const base = vials[to].length;
    const step = reduceMotion ? 0 : 80, dur = reduceMotion ? 120 : 330;
    let left = moving.length;
    moving.forEach((gem, k) => {
      const p0 = gemPos(from, src.length + k);
      const p1 = gemPos(to, base + k);
      flights.push({
        gem, to, t0: t + k * step, dur,
        x0: p0.x, y0: p0.y - (wasLifted ? LIFT * lay.tw * 1.05 : 0), x1: p1.x, y1: p1.y,
        onLand: () => {
          opts.onGem && opts.onGem(k);
          if (--left === 0 && cb) setTimeout(cb, reduceMotion ? 0 : 90);
        }
      });
    });
    request();
  }

  /* Готовая четвёрка вспыхивает (dur мс), затем cb. */
  function flashReady(v, dur, cb) {
    if (!lay || !lay.slots[v]) { cb && cb(); return; }
    flashes.set(v, { t0: now(), dur: reduceMotion ? 60 : dur, cb });
    hid[v] = 0;   // собранная четвёрка показывается целиком, тайные тоже
    const s = lay.slots[v];
    addSparks(s.cx, s.rimY, 8, lay.tw * 0.9);
    request();
  }

  /* Сверка после анимаций: если камни на поле уже совпадают с состоянием,
     обновляются только тайные камни и замок (идущие блики и прыжки не
     обрываются); иначе — setVials. */
  function sync(v, h, lockV) {
    const same = !flights.length && v.length === vials.length &&
      v.every((a, i) => a.length === vials[i].length && a.every((g, j) => g === vials[i][j]));
    if (!same) { setVials(v, h, lockV); return; }
    hid = h ? h.slice() : vials.map(() => 0);
    locked = lockV === undefined ? -1 : lockV;
    request();
  }

  function select(v) { selected = v; request(); }
  function shake(v) { shakes.set(v, now()); request(); }
  function quake(power) { if (!reduceMotion) { quakeAt = { t0: now(), power: power || 1 }; request(); } }
  function showHint(from, to) { hint = { from, to }; request(); }
  function clearHint() { hint = null; request(); }
  function setTutorial(v) { tutorial = v; request(); }
  function setWaiting(list) { waiting = list.slice(); request(); }
  function setLock(v) { locked = v; request(); }
  function unlock(v) { if (locked === v) locked = -1; unlockAt = { v, t0: now() }; request(); }
  function setTube(name) { tube = TUBES[name] || TUBES.clear; request(); }

  /* Забрать камни выданной пробирки: координаты на экране (для полёта к
     карточке) и опустошение пробирки на поле. */
  function takeVial(v) {
    const r = canvas.getBoundingClientRect();
    const out = vials[v].map((gem, j) => {
      const p = gemPos(v, j);
      return { gem, x: r.left + p.x, y: r.top + p.y, size: GEM * lay.tw };
    });
    vials[v] = [];
    hid[v] = 0;
    for (let j = 0; j < CAP; j++) bounces.delete(v + ':' + j);
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
    init, resize, setVials, sync, pour, flashReady, select, shake, quake, showHint, clearHint, setTutorial, setWaiting,
    setLock, unlock, setTube, takeVial, hitTest, vialClientRect,
    drawGem: (g, gem, x, y, size, alpha) => drawGem(g, gem, x, y, size, alpha),
    drawHidden: (g, x, y, size) => drawHidden(g, x, y, size),
    isAnimating: () => flights.length > 0 || flashes.size > 0,
    atlasReady: () => atlasReady,
    layout: () => lay && { tw: lay.tw, rows: lay.rows.length }
  };
})();
