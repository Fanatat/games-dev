/* ============================================================
   workshop_board.js — поле «Мастерской украшений»: стеклянные пробирки
   в золотых стойках (образ ref/workshop/concept/01_level), камни —
   спрайты из атласа workshop_assets/gems.webp (tools/ws_cut_gems.py).
   Только рисование, анимация и попадание по касанию; правил здесь нет
   (workshop_rules.js).

   Размеры считаются в долях ширины пробирки tw, раскладка — 1–3 ряда,
   выбирается та, где пробирки крупнее. Пока атлас не загрузился (или не
   загрузится вовсе), камни рисуются цветными кружками.

   Стойка ряда: золотая планка с кольцами вокруг пробирок, по краям ножки
   до стола. Выбранная пробирка выходит из кольца — поднимается и
   наклоняется вправо, светится золотом, её верхние камни (они и полетят)
   приподняты. Камни летят по дуге с весом и подпрыгивают на месте;
   готовая четвёрка вспыхивает перед выдачей; по камням изредка пробегают
   блики; каскад встряхивает поле. Тайные камни — бархатные шарики «?»,
   запертая пробирка — с замком, золотой топаз — с тёплым ореолом. На
   первом уровне подсказывает рука.
   ============================================================ */
const WsBoard = (() => {
  'use strict';

  const CAP = 4;
  const PITCH = 0.78;      // шаг камней по высоте
  const GEM = 0.92;        // размер спрайта (в ячейке атласа 10% прозрачных полей)
  const HEAD = 0.42;       // запас над верхним камнем до кромки
  const SINK = 0.20;       // дно пробирки ниже нижнего камня
  const RISE = 0.55;       // на сколько поднимается выбранная пробирка
  const TILT = 0.13;       // её наклон вправо, рад (~7,5°)
  const LIP = 0.12;        // утолщённая кромка над rimY
  const BAR = 1.1;         // середина планки ниже кромки: муфта между 3-м и 4-м камнем
  const BAR_T = 0.2;       // толщина планки
  const FOOT = 0.16;       // ножки стойки ниже дна пробирок
  const GAP = 0.42;        // зазор между пробирками
  const TRAY_PAD = 0.3;    // планка за крайними пробирками
  const SIDE = TRAY_PAD + 0.24;   // поле ряда с ножкой и лапкой
  const ROW_H = LIP + HEAD + CAP * PITCH + SINK + FOOT;   // ряд без подъёма
  const ROW_GAP = 0.28;   // поднятая пробирка нижнего ряда заходит на верхний — рисуется поверх
  const MAX_TW = 66;
  const SPRITE = 160;      // размер ячейки атласа
  const GOLD = 'Z';        // золотой топаз
  const SEL_MS = 150;      // подъём и возврат выбранной пробирки

  // Оттенки стекла (убранство из шкатулок): тон тела и кромки.
  const TUBES = {
    clear: { tint: '255,250,252', rim: '255,255,255' },
    sea:   { tint: '170,240,230', rim: '215,255,248' },
    rose:  { tint: '255,196,214', rim: '255,226,236' },
    royal: { tint: '210,184,255', rim: '255,232,170' }
  };

  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FONT = 'Nunito, "Arial Rounded MT Bold", Arial, sans-serif';

  let canvas = null, ctx = null, dpr = 1, W = 0, H = 0;
  let atlas = null, atlasReady = false;
  let handImg = null, lockImg = null;   // рука-подсказка и замок с листа (ui_hand, ui_lock); до загрузки — рисунок кодом
  let spriteOf = () => 0, colorOf = () => '#c33';
  let vials = [];
  let hid = [];                   // сколько нижних камней каждой пробирки под бархатом
  let locked = -1;                // запертая пробирка
  let lay = null;                 // { tw, slots: [{cx, rimY, baseY, row}], rows: [{x0, x1, rimY, baseY, from, to}] }
  let selected = -1, tutorial = -1, hint = null, waiting = [];
  let selAt = 0;                  // когда выбрана (подъём)
  let drop = null;                // { v, t0 } — пробирка возвращается в стойку
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
  const ease = (k) => 1 - (1 - k) * (1 - k);

  /* ---------- раскладка ---------- */
  function computeLayout() {
    const n = vials.length;
    if (!n) { lay = { tw: 0, slots: [], rows: [] }; return; }
    let best = null;
    for (let rows = 1; rows <= 3; rows++) {
      const per = Math.ceil(n / rows);
      if (rows > 1 && Math.ceil(n / (rows - 1)) === per) continue;
      const wu = per + (per - 1) * GAP + 2 * SIDE;
      const hu = RISE + rows * ROW_H + (rows - 1) * ROW_GAP + 0.1;
      const tw = Math.min(W / wu, H / hu, MAX_TW);
      if (!best || tw > best.tw * 1.04) best = { rows, per, tw };
    }
    const { rows, tw } = best;
    // Ряды: первые полнее, последний — остаток (по центру).
    const counts = [];
    let left = n;
    for (let r = 0; r < rows; r++) { const c = Math.ceil(left / (rows - r)); counts.push(c); left -= c; }
    // по ширине тесно, по высоте свободно — ряды чуть расходятся
    let gap = ROW_GAP * tw;
    if (rows > 1) gap += Math.max(0, Math.min(0.6 * tw, (H - (RISE + rows * ROW_H + (rows - 1) * ROW_GAP + 0.1) * tw) * 0.35 / (rows - 1)));
    const totalH = (RISE + rows * ROW_H) * tw + (rows - 1) * gap;
    let y = (H - totalH) / 2 + RISE * tw;
    const slots = [], rowInfo = [];
    counts.forEach((c, r) => {
      const rowW = c * tw + (c - 1) * GAP * tw;
      const x0 = (W - rowW) / 2 + tw / 2;
      const rimY = y + LIP * tw;
      const baseY = rimY + (HEAD + CAP * PITCH) * tw;
      const from = slots.length;
      for (let k = 0; k < c; k++) slots.push({ cx: x0 + k * (1 + GAP) * tw, rimY, baseY, row: r });
      rowInfo.push({
        x0: x0 - tw / 2 - TRAY_PAD * tw, x1: x0 + (c - 1) * (1 + GAP) * tw + tw / 2 + TRAY_PAD * tw,
        rimY, baseY, from, to: slots.length
      });
      y += ROW_H * tw + gap;
    });
    lay = { tw, slots, rows: rowInfo };
  }

  function gemPos(v, j) {
    const s = lay.slots[v];
    return { x: s.cx, y: s.baseY - (j + 0.5) * PITCH * lay.tw };
  }

  /* Верхняя группа одинаковых камней — она полетит при переливе. */
  function topGroup(v) {
    const a = vials[v];
    if (!a || !a.length) return 0;
    let k = 0;
    for (let i = a.length - 1; i >= 0 && a[i] === a[a.length - 1]; i--) k++;
    return k;
  }

  /* Насколько пробирка вышла из стойки: 0 — стоит, 1 — поднята и наклонена. */
  function liftOf(v, t) {
    if (v === selected) return reduceMotion ? 1 : ease(Math.min(1, (t - selAt) / SEL_MS));
    if (drop && drop.v === v) {
      const k = reduceMotion ? 1 : (t - drop.t0) / SEL_MS;
      if (k >= 1) { drop = null; return 0; }
      return 1 - ease(k);
    }
    return 0;
  }

  /* Начало возврата так, чтобы он продолжил с текущей высоты lift. */
  function dropStart(lift, t) { return t - (1 - Math.sqrt(Math.max(0, lift))) * SEL_MS; }

  /* Точка пробирки v после подъёма на k (поворот вокруг дна). */
  function xf(v, x, y, k) {
    if (!k) return { x, y };
    const s = lay.slots[v], tw = lay.tw, bot = s.baseY + SINK * tw;
    const a = k * TILT, c = Math.cos(a), sn = Math.sin(a);
    const dx = x - s.cx, dy = y - bot;
    return { x: s.cx + dx * c - dy * sn, y: bot - k * RISE * tw + dx * sn + dy * c };
  }

  function applyXf(v, k) {
    const s = lay.slots[v], tw = lay.tw, bot = s.baseY + SINK * tw;
    ctx.translate(s.cx, bot - k * RISE * tw);
    ctx.rotate(k * TILT);
    ctx.translate(-s.cx, -bot);
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

  /* Тайный камень: сливовый бархатный шарик в золотом ободке с «?». */
  function drawHidden(g, x, y, size, sx) {
    const r = size * 0.4;
    g.save();
    g.translate(x, y);
    g.scale(sx === undefined ? 1 : Math.max(0.05, sx), 1);
    const grd = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    grd.addColorStop(0, '#c77fae');
    grd.addColorStop(0.55, '#7b3f6c');
    grd.addColorStop(1, '#3e1638');
    g.fillStyle = grd;
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f2c75a';
    g.lineWidth = Math.max(1.2, r * 0.12);
    g.stroke();
    g.font = `900 ${Math.round(r * 1.25)}px ${FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(1.5, r * 0.16);
    g.strokeStyle = 'rgba(70,20,60,0.8)';
    g.strokeText('?', 0, r * 0.08);
    g.fillStyle = '#ffd96a';
    g.fillText('?', 0, r * 0.08);
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

  /* Полированное золото: блик сверху, тень снизу. */
  function gold(g, y0, y1) {
    const grd = g.createLinearGradient(0, y0, 0, y1);
    grd.addColorStop(0, '#fff4c0');
    grd.addColorStop(0.22, '#f6d26a');
    grd.addColorStop(0.55, '#e0a83a');
    grd.addColorStop(0.85, '#b47a22');
    grd.addColorStop(1, '#8a5a16');
    return grd;
  }
  const GOLD_EDGE = 'rgba(130,80,20,0.75)';

  /* Муфта стойки вокруг пробирки: короткий золотой цилиндр. Верх — кольцо
     (наружный край R, внутренний — по стеклу), бок — полоса высотой COL_H. */
  const COL_R = 0.63, COL_RY = 0.12, COL_IN = 0.52, COL_INY = 0.09, COL_H = 0.17;

  /* Стойка ряда, задняя часть: тень на столе, ножки, планка между муфтами
     и дальняя половина верха муфт (видна сквозь стекло). */
  function drawRackBack(row) {
    const tw = lay.tw;
    const barY = row.rimY + BAR * tw, t = BAR_T * tw;
    const yT = barY - COL_H * tw / 2;
    const botY = row.baseY + SINK * tw, footY = botY + FOOT * tw * 0.6;
    // тень на столе
    ctx.fillStyle = 'rgba(120,50,80,0.16)';
    ctx.beginPath();
    ctx.ellipse((row.x0 + row.x1) / 2, footY + tw * 0.06, (row.x1 - row.x0) / 2 + tw * 0.3, tw * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    // ножки: от концов планки плавно вниз до лапок
    const r = tw * 0.22;
    [row.x0, row.x1].forEach((x, side) => {
      const dir = side ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(x + dir * (r + tw * 0.06), barY);
      ctx.quadraticCurveTo(x, barY, x, barY + r);
      ctx.lineTo(x, footY - tw * 0.06);
      ctx.lineCap = 'round';
      ctx.strokeStyle = GOLD_EDGE;
      ctx.lineWidth = t * 0.78 + 2;
      ctx.stroke();
      const lg = ctx.createLinearGradient(x - t / 2, 0, x + t / 2, 0);
      lg.addColorStop(0, '#b47a22'); lg.addColorStop(0.35, '#fff0b0'); lg.addColorStop(0.65, '#e8b64a'); lg.addColorStop(1, '#9a6418');
      ctx.strokeStyle = lg;
      ctx.lineWidth = t * 0.78;
      ctx.stroke();
      // лапка
      ctx.fillStyle = gold(ctx, footY - tw * 0.1, footY + tw * 0.1);
      roundRect(ctx, x - tw * 0.24, footY - tw * 0.1, tw * 0.48, tw * 0.2, tw * 0.07);
      ctx.fill();
      ctx.strokeStyle = GOLD_EDGE; ctx.lineWidth = 1; ctx.stroke();
    });
    // планка: только между муфтами (за пробиркой её не видно)
    ctx.save();
    ctx.beginPath();
    ctx.rect(row.x0 - tw, barY - tw, row.x1 - row.x0 + 2 * tw, 2 * tw);
    for (let v = row.from; v < row.to; v++) {
      const cx = lay.slots[v].cx;
      ctx.rect(cx - COL_IN * tw, barY - tw, 2 * COL_IN * tw, 2 * tw);
    }
    ctx.clip('evenodd');
    ctx.fillStyle = gold(ctx, barY - t / 2, barY + t / 2);
    roundRect(ctx, row.x0 + r * 0.5, barY - t / 2, row.x1 - row.x0 - r, t, t * 0.4);
    ctx.fill();
    ctx.strokeStyle = GOLD_EDGE; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
    // дальняя половина верха муфт
    for (let v = row.from; v < row.to; v++) {
      const cx = lay.slots[v].cx;
      ctx.beginPath();
      ctx.ellipse(cx, yT, COL_R * tw, COL_RY * tw, 0, Math.PI, 0);
      ctx.ellipse(cx, yT, COL_IN * tw, COL_INY * tw, 0, 0, Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = '#c8902e';
      ctx.fill();
      ctx.strokeStyle = GOLD_EDGE; ctx.lineWidth = 1; ctx.stroke();
    }
  }

  /* Ближняя половина муфт — поверх стекла стоящих пробирок. */
  function drawRackFront(row) {
    const tw = lay.tw;
    const barY = row.rimY + BAR * tw;
    const yT = barY - COL_H * tw / 2, yB = barY + COL_H * tw / 2;
    const R = COL_R * tw, RY = COL_RY * tw;
    for (let v = row.from; v < row.to; v++) {
      const cx = lay.slots[v].cx;
      // бок муфты: блик посередине, тень к краям
      ctx.beginPath();
      ctx.ellipse(cx, yT, R, RY, 0, 0, Math.PI);
      ctx.lineTo(cx - R, yB);
      ctx.ellipse(cx, yB, R, RY, 0, Math.PI, 0, true);
      ctx.closePath();
      const side = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      side.addColorStop(0, '#9a6418'); side.addColorStop(0.3, '#f2c75a'); side.addColorStop(0.45, '#fff3c0');
      side.addColorStop(0.62, '#e8b64a'); side.addColorStop(1, '#94600f');
      ctx.fillStyle = side;
      ctx.fill();
      ctx.strokeStyle = GOLD_EDGE; ctx.lineWidth = 1; ctx.stroke();
      // ближняя половина верха муфты
      ctx.beginPath();
      ctx.ellipse(cx, yT, R, RY, 0, 0, Math.PI);
      ctx.ellipse(cx, yT, COL_IN * tw, COL_INY * tw, 0, Math.PI, 0, true);
      ctx.closePath();
      ctx.fillStyle = gold(ctx, yT - RY, yT + RY);
      ctx.fill();
      ctx.strokeStyle = GOLD_EDGE; ctx.lineWidth = 1; ctx.stroke();
    }
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

  /* Пробирка v: k — насколько вынута из стойки, ox — дрожь при ошибке. */
  function drawTube(v, t, ox, k) {
    const s = lay.slots[v], tw = lay.tw;
    const cx = s.cx;
    const isWait = waiting.indexOf(v) !== -1;
    const isCue = (hint && hint.from === v) || tutorial === v;
    const fl = flashes.get(v);
    const bot = s.baseY + SINK * tw;
    ctx.save();
    if (ox) ctx.translate(ox, 0);
    if (k) applyXf(v, k);
    if (k) {
      // выбранная: золотое сияние вокруг
      ctx.save();
      tubePath(cx, s.rimY - LIP * tw, s.baseY, tw);
      ctx.closePath();
      ctx.shadowColor = `rgba(255,205,90,${0.95 * k})`;
      ctx.shadowBlur = tw * 0.55;
      ctx.fillStyle = `rgba(255,244,214,${0.16 * k})`;
      ctx.fill();
      ctx.restore();
    }
    // стекло: светлое, чуть сиреневое к правому краю
    tubePath(cx, s.rimY, s.baseY, tw);
    ctx.closePath();
    const body = ctx.createLinearGradient(cx - tw / 2, 0, cx + tw / 2, 0);
    body.addColorStop(0, `rgba(${tube.tint},0.52)`);
    body.addColorStop(0.32, `rgba(${tube.tint},0.22)`);
    body.addColorStop(0.75, `rgba(${tube.tint},0.16)`);
    body.addColorStop(1, 'rgba(200,160,200,0.42)');
    ctx.fillStyle = body;
    ctx.fill();
    if (fl) {
      // готовая четвёрка: золотое сияние изнутри
      const kk = Math.min(1, (t - fl.t0) / fl.dur);
      const a = Math.sin(kk * Math.PI);
      const grd = ctx.createRadialGradient(cx, (s.rimY + s.baseY) / 2, 0, cx, (s.rimY + s.baseY) / 2, tw * 2.1);
      grd.addColorStop(0, `rgba(255,236,160,${0.75 * a})`);
      grd.addColorStop(1, 'rgba(255,236,160,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(cx - tw * 2.2, s.rimY - tw, tw * 4.4, s.baseY - s.rimY + tw * 2);
    }
    // камни; у выбранной верхние (полетят) чуть приподняты и подсвечены
    const a = vials[v];
    const up = k ? topGroup(v) : 0;
    const bob = k && !reduceMotion ? Math.sin(t / 260) * tw * 0.03 : 0;
    for (let j = 0; j < a.length; j++) {
      const p = gemPos(v, j);
      let y = p.y;
      if (j >= a.length - up) {
        y -= tw * 0.1 * k - bob;
        const glow = ctx.createRadialGradient(p.x, y, 0, p.x, y, tw * 0.6);
        glow.addColorStop(0, `rgba(255,226,150,${0.6 * k})`);
        glow.addColorStop(1, 'rgba(255,226,150,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - tw * 0.7, y - tw * 0.7, tw * 1.4, tw * 1.4);
      }
      drawStone(v, j, a[j], p.x, y, t);
    }
    // контур стекла
    tubePath(cx, s.rimY, s.baseY, tw);
    let edge = 'rgba(140,96,132,0.78)';
    let lw = Math.max(1.2, tw * 0.045);
    let glow = 0;
    if (k) { edge = '#e8b64a'; lw = Math.max(1.6, tw * 0.06); glow = 0.3; }
    else if (fl) { edge = '#f2c75a'; lw = Math.max(1.6, tw * 0.07); glow = 0.6; }
    else if (isCue) { edge = `rgba(232,170,60,${0.55 + 0.45 * Math.sin(t / 180) ** 2})`; lw = Math.max(1.6, tw * 0.07); glow = 0.35; }
    else if (isWait) { edge = 'rgba(232,170,60,0.9)'; lw = Math.max(1.4, tw * 0.06); }
    ctx.strokeStyle = edge;
    ctx.lineWidth = lw;
    if (glow) { ctx.shadowColor = 'rgba(255,200,80,0.95)'; ctx.shadowBlur = tw * glow; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    // блики стекла: широкий слева, узкий справа
    const hl = ctx.createLinearGradient(0, s.rimY, 0, bot);
    hl.addColorStop(0, 'rgba(255,255,255,0.85)');
    hl.addColorStop(1, 'rgba(255,255,255,0.15)');
    ctx.fillStyle = hl;
    roundRect(ctx, cx - tw * 0.37, s.rimY + tw * 0.2, tw * 0.1, bot - s.rimY - tw * 0.55, tw * 0.05);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    roundRect(ctx, cx + tw * 0.27, s.rimY + tw * 0.35, tw * 0.05, (bot - s.rimY) * 0.5, tw * 0.025);
    ctx.fill();
    // кромка: толстое кольцо
    ctx.beginPath();
    ctx.ellipse(cx, s.rimY - LIP * tw * 0.4, tw * 0.55, tw * 0.13, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(190,150,185,0.3)';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, tw * 0.09);
    ctx.strokeStyle = 'rgba(140,96,132,0.8)';
    ctx.stroke();
    ctx.lineWidth = Math.max(1, tw * 0.055);
    ctx.strokeStyle = k ? '#fff2c4' : `rgba(${tube.rim},0.95)`;
    ctx.stroke();
    if (v === locked || (unlockAt && unlockAt.v === v)) drawLock(v, cx, t);
    ctx.restore();
  }

  const ready = (im) => !!(im && im.complete && im.naturalWidth);

  /* Замок на запертой пробирке: сливовая вуаль, золотая цепочка и замок. */
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
    ctx.fillStyle = 'rgba(110,50,100,0.38)';
    ctx.fill();
    const y = s.rimY + (s.baseY - s.rimY) * 0.42;
    // цепочка крест-накрест
    ctx.strokeStyle = '#e8b64a';
    ctx.lineWidth = Math.max(1.4, tw * 0.06);
    ctx.setLineDash([tw * 0.1, tw * 0.06]);
    ctx.beginPath();
    ctx.moveTo(cx - tw * 0.55, y - tw * 0.7); ctx.lineTo(cx + tw * 0.55, y + tw * 0.5);
    ctx.moveTo(cx + tw * 0.55, y - tw * 0.7); ctx.lineTo(cx - tw * 0.55, y + tw * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    // замок; при открытии поднимается и гаснет
    const lift = k * tw * 0.3;
    if (ready(lockImg)) {
      const w = tw * 0.62, h = w * lockImg.naturalHeight / lockImg.naturalWidth;
      ctx.shadowColor = 'rgba(90,30,60,0.35)'; ctx.shadowBlur = tw * 0.12; ctx.shadowOffsetY = tw * 0.04;
      ctx.drawImage(lockImg, cx - w / 2, y - h * 0.44 - lift, w, h);
      ctx.restore();
      return;
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = GOLD_EDGE;
    ctx.lineWidth = Math.max(3, tw * 0.13);
    ctx.beginPath(); ctx.arc(cx, y - tw * 0.1 - lift, tw * 0.2, Math.PI, 0); ctx.stroke();
    ctx.strokeStyle = '#f6d26a';
    ctx.lineWidth = Math.max(2, tw * 0.08);
    ctx.stroke();
    ctx.fillStyle = gold(ctx, y - tw * 0.12, y + tw * 0.34);
    roundRect(ctx, cx - tw * 0.32, y - tw * 0.12, tw * 0.64, tw * 0.48, tw * 0.12);
    ctx.fill();
    ctx.strokeStyle = GOLD_EDGE; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#6b2f5e';
    ctx.beginPath(); ctx.arc(cx, y + tw * 0.07, tw * 0.065, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - tw * 0.028, y + tw * 0.07, tw * 0.056, tw * 0.14);
    ctx.restore();
  }

  /* Рука-подсказка (уровень 1): указательный палец касается пробирки. */
  function drawHand(t) {
    if (tutorial < 0 || !lay.slots[tutorial]) return;
    const s = lay.slots[tutorial], tw = lay.tw;
    const k = liftOf(tutorial, t);
    const tip = xf(tutorial, s.cx + tw * 0.08, s.rimY + (s.baseY - s.rimY) * 0.55, k);
    const u = tw * 0.95;
    const cyc = reduceMotion ? 0.5 : (t % 1300) / 1300;
    // нажатие: палец уходит к пробирке и возвращается, в момент касания — круг
    const press = cyc < 0.35 ? Math.sin((cyc / 0.35) * Math.PI) : 0;
    if (cyc > 0.15 && cyc < 0.75) {
      const rk = (cyc - 0.15) / 0.6;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, tw * (0.2 + 0.55 * rk), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.85 * (1 - rk)})`;
      ctx.lineWidth = Math.max(2, tw * 0.07);
      ctx.stroke();
    }
    if (ready(handImg)) {   // палец картинки — в (0.08, 0.06) от её размера, указывает влево-вверх
      const h = tw * 1.45, w = h * handImg.naturalWidth / handImg.naturalHeight;
      const back = u * (0.16 - 0.12 * press);
      ctx.save();
      ctx.shadowColor = 'rgba(90,30,60,0.35)'; ctx.shadowBlur = tw * 0.25; ctx.shadowOffsetY = tw * 0.06;
      ctx.drawImage(handImg, tip.x + back * 0.67 - w * 0.08, tip.y + back * 0.74 - h * 0.06, w, h);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(tip.x, tip.y);
    ctx.rotate(-0.42);
    ctx.translate(0, u * (0.16 - 0.12 * press));
    const shapes = (fn) => {
      roundRect(ctx, -0.13 * u, 0, 0.26 * u, 0.85 * u, 0.13 * u); fn();            // указательный
      roundRect(ctx, -0.2 * u, 0.55 * u, 0.78 * u, 0.62 * u, 0.22 * u); fn();      // ладонь
      for (let i = 0; i < 3; i++) {                                                 // поджатые пальцы
        ctx.beginPath(); ctx.ellipse((0.2 + 0.15 * i) * u, (0.6 + 0.03 * i) * u, 0.11 * u, 0.13 * u, 0, 0, Math.PI * 2); fn();
      }
      ctx.beginPath(); ctx.ellipse(-0.2 * u, 0.86 * u, 0.12 * u, 0.2 * u, -0.5, 0, Math.PI * 2); fn();   // большой
    };
    ctx.shadowColor = 'rgba(90,30,60,0.35)';
    ctx.shadowBlur = tw * 0.25;
    ctx.shadowOffsetY = tw * 0.06;
    ctx.fillStyle = '#6b3a2a';
    ctx.strokeStyle = '#6b3a2a';
    ctx.lineWidth = Math.max(2.5, u * 0.1);
    ctx.lineJoin = 'round';
    shapes(() => { ctx.fill(); ctx.stroke(); });
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fffaf3';
    shapes(() => ctx.fill());
    // ноготь и манжета
    ctx.fillStyle = '#ffd9e2';
    roundRect(ctx, -0.07 * u, 0.06 * u, 0.14 * u, 0.16 * u, 0.06 * u); ctx.fill();
    ctx.fillStyle = '#f39ab7';
    roundRect(ctx, -0.16 * u, 1.08 * u, 0.72 * u, 0.24 * u, 0.08 * u); ctx.fill();
    ctx.strokeStyle = '#6b3a2a'; ctx.lineWidth = Math.max(1.5, u * 0.05); ctx.stroke();
    ctx.restore();
  }

  /* Стрелка подсказки над пробиркой, куда класть. */
  function drawHintArrow(t) {
    if (!hint || !lay.slots[hint.to]) return;
    const s = lay.slots[hint.to], tw = lay.tw;
    const bob = reduceMotion ? 0 : Math.sin(t / 200) * tw * 0.12;
    const x = s.cx, y = s.rimY - LIP * tw - tw * 0.12 + bob;   // остриё
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - tw * 0.36, y - tw * 0.36);
    ctx.lineTo(x - tw * 0.15, y - tw * 0.36);
    ctx.lineTo(x - tw * 0.15, y - tw * 0.72);
    ctx.lineTo(x + tw * 0.15, y - tw * 0.72);
    ctx.lineTo(x + tw * 0.15, y - tw * 0.36);
    ctx.lineTo(x + tw * 0.36, y - tw * 0.36);
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(110,40,80,0.45)';
    ctx.shadowBlur = tw * 0.15;
    ctx.shadowOffsetY = tw * 0.04;
    ctx.fillStyle = gold(ctx, y - tw * 0.72, y);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#fffaf1';
    ctx.lineWidth = Math.max(2, tw * 0.06);
    ctx.stroke();
    ctx.restore();
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
      if (liftOf(gl.v, t)) return true;
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
    if (quakeAt) {
      const k = (t - quakeAt.t0) / 340;
      if (k >= 1) quakeAt = null;
      else {
        const amp = lay.tw * 0.09 * quakeAt.power * (1 - k);
        ctx.translate(Math.sin(k * Math.PI * 9) * amp, Math.cos(k * Math.PI * 7) * amp * 0.5);
      }
    }
    const shakeOf = (v) => {
      const t0 = shakes.get(v);
      if (t0 === undefined) return 0;
      const k = (t - t0) / 380;
      if (k >= 1) { shakes.delete(v); return 0; }
      return Math.sin(k * Math.PI * 6) * lay.tw * 0.13 * (1 - k);
    };
    // ряды: стойка, стоящие пробирки, передний край колец; вынутые — поверх всего
    const out = [];
    lay.rows.forEach(row => {
      drawRackBack(row);
      for (let v = row.from; v < row.to; v++) {
        const k = liftOf(v, t);
        if (k > 0) out.push([v, k]);
        else drawTube(v, t, shakeOf(v), 0);
      }
      drawRackFront(row);
    });
    out.forEach(([v, k]) => drawTube(v, t, shakeOf(v), k));
    drawGlints(t);
    drawFlights(t);
    drawSparks(t);
    drawHintArrow(t);
    drawHand(t);
    const busy = flights.length || shakes.size || selected >= 0 || drop || tutorial >= 0 || hint || bounces.size ||
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
    const pic = (name) => { const im = new Image(); im.onload = request; im.src = opts.atlasUrl.replace(/[^/]*$/, '') + name + '.webp'; return im; };
    handImg = pic('ui_hand');
    lockImg = pic('ui_lock');
    resize();
    // Область поля меняется не только с окном: плашка «тупик», поворот.
    // Холст подстраивается сам, иначе он вылезает на кнопки.
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(() => {
        const box = canvas.parentElement.getBoundingClientRect();
        if (Math.floor(box.width) !== W || Math.floor(box.height) !== H) resize();
      }).observe(canvas.parentElement);
    }
    // шрифт «?» на тайных камнях может догрузиться позже первого кадра
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(request);
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
    unlockAt = null; sparks = []; glints = []; quakeAt = null; drop = null;
    if (relayout) computeLayout();
    request();
  }

  /* Перелив: count верхних камней из from летят по дуге в to (из поднятой
     пробирки — с её наклоном), пробирка возвращается в стойку.
     opts.onGem(k) — k-й камень приземлился (нота); opts.hid — тайные камни
     после хода; opts.reveal — у источника открылся новый верхний камень.
     cb — когда все приземлились (отображение совпадает с новым состоянием). */
  function pour(from, to, count, cb, opts) {
    opts = opts || {};
    const t = now();
    const lift = liftOf(from, t);
    const src = vials[from];
    const moving = src.splice(src.length - count, count);
    if (selected === from) { selected = -1; if (lift) drop = { v: from, t0: dropStart(lift, t) }; }
    if (opts.hid) hid = opts.hid.slice();
    if (opts.reveal && src.length) flips.set(from, t + (reduceMotion ? 0 : 120));
    const base = vials[to].length;
    const step = reduceMotion ? 0 : 80, dur = reduceMotion ? 120 : 330;
    let left = moving.length;
    moving.forEach((gem, k) => {
      const g0 = gemPos(from, src.length + k);
      const p0 = xf(from, g0.x, g0.y - lay.tw * 0.1 * lift, lift);
      const p1 = gemPos(to, base + k);
      flights.push({
        gem, to, t0: t + k * step, dur,
        x0: p0.x, y0: p0.y, x1: p1.x, y1: p1.y,
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

  /* Выбор: новая пробирка выходит из стойки, прежняя возвращается. */
  function select(v) {
    if (v === selected) return;
    const t = now();
    if (selected >= 0 && lay && lay.slots[selected]) drop = { v: selected, t0: dropStart(liftOf(selected, t), t) };
    if (drop && drop.v === v) drop = null;
    selected = v;
    selAt = t;
    request();
  }
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

  /* Касание: по колонке пробирки от поднятой кромки до лапок стойки. */
  function hitTest(clientX, clientY) {
    if (!lay) return -1;
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const tw = lay.tw;
    let best = -1, bestD = Infinity;
    lay.slots.forEach((s, v) => {
      // поднятая пробирка выше на RISE; при наложении на соседний ряд
      // выигрывает та, в чьё стекло касание ближе
      const glassTop = s.rimY - (v === selected ? RISE + LIP : LIP) * tw;
      const top = glassTop - 0.25 * tw, bot = s.baseY + (SINK + FOOT) * tw;
      if (y < top || y > bot) return;
      const dx = Math.abs(x - s.cx);
      if (dx > tw * (0.5 + GAP / 2) + 1) return;
      const d = dx + Math.max(0, glassTop - y, y - (s.baseY + SINK * tw));
      if (d < bestD) { bestD = d; best = v; }
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
