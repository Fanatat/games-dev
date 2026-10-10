/* ============================================================
   workshop_jewelry.js — изделия «Мастерской украшений»: оправа из золота
   и гнёзда под камни. Каждое гнездо принадлежит заказу уровня (гнездо i —
   заказ i в очереди): выдача заказа вставляет камень в его гнездо.

   Рисуется на любом canvas в прямоугольнике box = { x, y, w, h }: полоса
   изделия над заказами, большое изделие в церемонии победы, миниатюры на
   витрине меню, силуэт следующего изделия. Камни рисует переданная
   функция drawGem (WsBoard.drawGem).

   Оправа — картинка с листа (workshop_assets/jw_<изделие>.webp, грузит
   load); гнёзда под K камней заданы в пикселях картинки (seats). Пока
   картинки нет (и в тестах без Image), оправа рисуется кодом: координаты
   в условной рамке 2×1 (u ∈ [0, 2], v ∈ [0, 1]), масштаб — по меньшей
   стороне box.
   ============================================================ */
const WsJewel = (() => {
  'use strict';

  const PIECES = {
    ring: 'Кольцо', earrings: 'Серьги', pendant: 'Кулон', brooch: 'Брошь', bracelet: 'Браслет',
    necklace: 'Колье', hairpin: 'Заколка', tiara: 'Диадема', cufflinks: 'Запонки', crown: 'Корона'
  };

  const spread = (n, a, b) => Array.from({ length: n }, (_, i) => (n === 1 ? (a + b) / 2 : a + (b - a) * i / (n - 1)));

  /* Гнёзда и линии оправы для изделия из K камней. Возвращает
     { sockets: [{ u, v, r }], lines: [[u, v, …]] , shapes: [...] } в условных
     координатах; lines — ломаные/кривые металла, shapes — замкнутые формы. */
  function design(piece, K) {
    const S = [], lines = [], rings = [];
    const sock = (u, v, r) => S.push({ u, v, r });
    switch (piece) {
      case 'ring': {
        rings.push({ u: 1, v: 0.7, rx: 0.34, ry: 0.24, w: 0.075 });
        const d = Math.min(0.27, 1.25 / K), r = d * 0.46;
        spread(K, 1 - d * (K - 1) / 2, 1 + d * (K - 1) / 2).forEach((u, i) => {
          const x = (i - (K - 1) / 2) / Math.max(1, (K - 1) / 2);
          sock(u, 0.36 + 0.09 * x * x, r * (1 - 0.18 * Math.abs(x)));
        });
        if (K > 1) lines.push([S[0].u, S[0].v + 0.04, 1, 0.48, S[K - 1].u, S[K - 1].v + 0.04]);
        break;
      }
      case 'earrings': {
        const nL = Math.ceil(K / 2), nR = K - nL;
        [[0.62, nL], [1.38, nR]].forEach(([u, n]) => {
          if (!n) return;
          lines.push([u - 0.1, 0.12, u - 0.04, 0.02, u + 0.05, 0.06, u, 0.2]);
          const step = Math.min(0.24, 0.66 / n), r = step * 0.44;
          for (let j = 0; j < n; j++) sock(u, 0.32 + j * step, r * (1 + 0.1 * j));
          lines.push([u, 0.2, u, 0.32 + (n - 1) * step]);
        });
        break;
      }
      case 'pendant': {
        lines.push([0.18, 0.02, 0.6, 0.26, 1, 0.3, 1.4, 0.26, 1.82, 0.02]);
        const cv = 0.64, ring = K >= 6 ? 0.24 : (K <= 2 ? 0.1 : 0.19);
        rings.push({ u: 1, v: cv, rx: ring + 0.12, ry: ring + 0.14, w: 0.04 });
        lines.push([1, 0.3, 1, cv - ring - 0.14]);
        const n = K >= 6 ? K - 1 : K;
        if (K >= 6) sock(1, cv, 0.11);
        const r = Math.min(0.12, 0.6 / (n + 1));
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
          sock(1 + Math.cos(a) * ring, cv + Math.sin(a) * ring, n === 1 ? 0.14 : r);
        }
        break;
      }
      case 'brooch': {
        const ring = K <= 3 ? 0.2 : 0.28;
        rings.push({ u: 1, v: 0.52, rx: ring + 0.15, ry: ring + 0.15, w: 0.05 });
        rings.push({ u: 1, v: 0.52, rx: 0.07, ry: 0.07, w: 0.05, fill: true });
        const r = Math.min(0.13, 0.75 / (K + 1));
        for (let i = 0; i < K; i++) {
          const a = -Math.PI / 2 + (i / K) * Math.PI * 2;
          sock(1 + Math.cos(a) * ring, 0.52 + Math.sin(a) * ring, r);
          lines.push([1 + Math.cos(a) * 0.08, 0.52 + Math.sin(a) * 0.08, 1 + Math.cos(a) * (ring - r), 0.52 + Math.sin(a) * (ring - r)]);
        }
        break;
      }
      case 'bracelet': {
        rings.push({ u: 1, v: 0.5, rx: 0.8, ry: 0.3, w: 0.07 });
        const r = Math.min(0.13, 0.75 / K);
        spread(K, Math.PI * 0.86, Math.PI * 0.14).forEach(a => sock(1 + Math.cos(a) * 0.8, 0.5 + Math.sin(a) * 0.3, r));
        break;
      }
      case 'necklace': {
        const at = (t) => ({ u: 0.1 + 1.8 * t, v: 0.06 + 0.56 * (1 - Math.pow(2 * t - 1, 2)) });
        const pts = [];
        for (let i = 0; i <= 12; i++) { const p = at(i / 12); pts.push(p.u, p.v); }
        lines.push(pts);
        const r = Math.min(0.12, 0.7 / K);
        spread(K, 0.22, 0.78).forEach((t, i) => {
          const p = at(t);
          const mid = Math.abs(i - (K - 1) / 2) < 0.6;
          const drop = mid ? 0.2 : 0.1;
          lines.push([p.u, p.v, p.u, p.v + drop - r]);
          sock(p.u, p.v + drop, mid ? r * 1.2 : r);
        });
        break;
      }
      case 'hairpin': {
        lines.push([0.08, 0.7, 1.9, 0.7]);
        lines.push([1.75, 0.66, 1.92, 0.7, 1.75, 0.74]);
        const r = Math.min(0.12, 0.62 / K);
        spread(K, 0.28, 1.35).forEach((u, i) => sock(u, 0.5 + 0.1 * Math.sin(i * 1.7), r));
        lines.push(S.flatMap(s => [s.u, s.v]));
        break;
      }
      case 'tiara': {
        const band = (u) => 0.82 - 0.16 * (1 - Math.pow((u - 1) / 0.9, 2));
        const pts = [];
        for (let i = 0; i <= 12; i++) { const u = 0.1 + 1.8 * i / 12; pts.push(u, band(u)); }
        lines.push(pts);
        const r = Math.min(0.12, 0.7 / K);
        spread(K, 0.4, 1.6).forEach(u => {
          const h = 0.16 + 0.22 * (1 - Math.abs(u - 1) / 0.6);
          const v = band(u) - h;
          lines.push([u - 0.09, band(u), u, v + r, u + 0.09, band(u)]);
          sock(u, v, r);
        });
        break;
      }
      case 'cufflinks': {
        const nL = Math.ceil(K / 2), nR = K - nL;
        [[0.6, nL], [1.4, nR]].forEach(([u, n]) => {
          if (!n) return;
          rings.push({ u, v: 0.5, rx: 0.3, ry: 0.3, w: 0.05, square: true });
          const P = [[[0, 0]], [[-0.12, -0.12], [0.12, 0.12]], [[0, -0.13], [-0.13, 0.11], [0.13, 0.11]],
            [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]]][Math.min(4, n) - 1];
          P.forEach(([du, dv]) => sock(u + du, 0.5 + dv, n === 1 ? 0.16 : 0.1));
        });
        break;
      }
      case 'crown': {
        const nB = Math.floor(K / 2), nP = K - nB;
        const peaks = spread(nP, 0.5, 1.5);
        const top = 0.2, base = 0.6;
        const pts = [0.36, 0.9, 0.36, base];
        peaks.forEach((u, i) => {
          const prev = i === 0 ? 0.36 : (peaks[i - 1] + u) / 2;
          pts.push(prev, i === 0 ? base : base - 0.08, u, top + 0.06 * Math.abs(i - (nP - 1) / 2));
        });
        pts.push(1.64, base, 1.64, 0.9, 0.36, 0.9);
        lines.push(pts);
        const r = Math.min(0.11, 0.6 / nP);
        peaks.forEach((u, i) => sock(u, top + 0.06 * Math.abs(i - (nP - 1) / 2), r));
        spread(nB, 0.62, 1.38).forEach(u => sock(u, 0.76, Math.min(0.1, 0.55 / Math.max(1, nB))));
        break;
      }
      default: return design('ring', K);
    }
    return { sockets: S, lines, rings };
  }

  /* Рамка 2×1 внутри box: масштаб и сдвиг. */
  function frame(box) {
    const s = Math.min(box.w / 2, box.h) * 0.96;
    return { s, x0: box.x + (box.w - 2 * s) / 2, y0: box.y + (box.h - s) / 2 };
  }

  /* Крупный план (окно победы): рамка по самому изделию, а не по полю 2×1.
     У кулона цепочка шире медальона — берём медальон, цепочка уходит за край
     и гаснет (см. draw). Увеличение не больше cap от обычного. */
  function closeFrame(box, d, piece, cap) {
    let u0 = 9, v0 = 9, u1 = -9, v1 = -9;
    const add = (u, v, ru, rv) => { u0 = Math.min(u0, u - ru); u1 = Math.max(u1, u + ru); v0 = Math.min(v0, v - rv); v1 = Math.max(v1, v + rv); };
    d.sockets.forEach(p => add(p.u, p.v, p.r * 1.25, p.r * 1.25));
    d.rings.forEach(r => add(r.u, r.v, r.rx + r.w, r.ry + r.w));
    if (piece === 'pendant') v0 -= 0.12;
    else d.lines.forEach(pts => { for (let i = 0; i < pts.length; i += 2) add(pts[i], pts[i + 1], 0.03, 0.03); });
    const s = Math.min(frame(box).s * cap, box.w * 0.94 / (u1 - u0), box.h * 0.94 / (v1 - v0));
    return { s, x0: box.x + box.w / 2 - (u0 + u1) / 2 * s, y0: box.y + box.h / 2 - (v0 + v1) / 2 * s };
  }

  /* ---------- нарисованные изделия (лист E) ----------
     workshop_assets/jw_<изделие>.webp: размер картинки и гнёзда в её пикселях
     [x, y, r]. Пока картинка не загрузилась (или не загрузится вовсе), изделие
     рисуется оправой кодом (design выше). */
  const ART = {
    ring: [177, 188], earrings: [193, 217], pendant: [143, 230], brooch: [214, 218], bracelet: [303, 180],
    necklace: [280, 211], hairpin: [262, 206], tiara: [298, 175], cufflinks: [256, 160], crown: [241, 186]
  };
  const SPRITE = {};
  const ART_CAP = 1.5;   // крупный план: не больше полутора пикселей экрана на пиксель картинки

  /* K гнёзд вдоль ломаной path с шагом не больше step, по центру пути. */
  function along(path, K, step, rmax) {
    const seg = [];
    let len = 0;
    for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(d); len += d; }
    const d = Math.min(step, len / K), r = Math.min(rmax, d * 0.42);
    const at = (s) => {
      let i = 0;
      while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
      const k = Math.max(0, Math.min(1, s / seg[i]));
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k];
    };
    return Array.from({ length: K }, (_, i) => at(len / 2 + (i - (K - 1) / 2) * d).concat(r));
  }

  /* K гнёзд розеткой вокруг (cx, cy); при K ≥ 6 одно — в центре. */
  function rosette(cx, cy, K, R, rmax, tilt) {
    if (K <= 1) return K ? [[cx, cy, rmax * 1.25]] : [];
    const mid = K >= 6, n = mid ? K - 1 : K;
    const rr = R * (mid ? 1 : K === 2 ? 0.62 : K === 3 ? 0.8 : 0.9);
    const r = Math.min(rmax, rr * Math.sin(Math.PI / n) * 0.82);
    const S = mid ? [[cx, cy, Math.min(rmax, rr / 1.2 - r)]] : [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (tilt || 0) + i * Math.PI * 2 / n;
      S.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, r]);
    }
    return S;
  }

  /* Взять K мест из списка: таблица выбора по K, иначе первые K. */
  const pick = (list, K, table) => (table[K] || list.map((_, i) => i).slice(0, K)).map(i => list[i]);

  function seats(piece, K) {
    switch (piece) {
      case 'ring':
        return along([[16, 116], [22, 80], [46, 50], [88, 40], [130, 48], [154, 76], [161, 112]], K, 34, 16);
      case 'earrings': {
        const nL = Math.ceil(K / 2), side = (x, n) => [
          [[x, 165, 19]],
          [[x, 34, 12], [x, 165, 19]],
          [[x, 34, 12], [x, 98, 10], [x, 165, 19]],
          [[x, 34, 12], [x, 98, 10], [x, 146, 13], [x, 184, 14]]
        ][Math.max(0, Math.min(4, n) - 1)].slice(0, n);
        return side(46, nL).concat(side(147, K - nL));
      }
      case 'pendant':
        return rosette(71.5, 163, K, 30, 17);
      case 'brooch': {
        const P = [[107, 102, 24], [107, 30, 17], [172, 62, 16], [42, 62, 16], [178, 126, 16], [36, 126, 16], [143, 182, 16], [71, 182, 16]];
        return pick(P, K, { 2: [1, 0], 3: [0, 2, 3], 4: [0, 1, 6, 7], 5: [0, 2, 3, 6, 7], 6: [0, 1, 2, 3, 6, 7], 7: [0, 1, 2, 3, 4, 5, 6] });
      }
      case 'bracelet':
        return along([[22, 86], [58, 108], [100, 124], [151, 130], [202, 124], [244, 108], [281, 86]], K, 60, 17);
      case 'necklace':
        return along([[20, 80], [42, 124], [86, 158], [140, 172], [194, 158], [238, 124], [260, 80]], K, 42, 17);
      case 'hairpin':
        return along([[34, 168], [130, 100], [228, 32]], K, 42, 16);
      case 'tiara': {
        const P = [[149, 62, 16], [87, 80, 13], [211, 80, 13], [40, 100, 11], [258, 100, 11], [149, 128, 11], [96, 124, 10], [202, 124, 10]];
        return pick(P, K, { 2: [1, 2], 3: [0, 1, 2], 4: [1, 2, 3, 4], 7: [0, 1, 2, 3, 4, 6, 7] });
      }
      case 'cufflinks': {
        const nL = Math.ceil(K / 2);
        return rosette(52, 66, nL, 24, 18, Math.PI / 4).concat(rosette(201, 96, K - nL, 24, 18, Math.PI / 4));
      }
      case 'crown': {
        const P = [[120, 156, 15], [72, 152, 13], [168, 152, 13], [120, 72, 12], [18, 58, 10], [223, 58, 10], [120, 14, 10], [54, 30, 9], [187, 30, 9]];
        return pick(P, K, {});
      }
      default: return seats('ring', K);
    }
  }

  /* Место картинки в box: вписать, крупный план — не больше ART_CAP. */
  function place(piece, box, cap) {
    const a = ART[piece] || ART.ring;
    let s = Math.min(box.w / a[0], box.h / a[1]) * 0.96;
    if (cap) s = Math.min(s, cap);
    return { s, w: a[0] * s, h: a[1] * s, x0: box.x + (box.w - a[0] * s) / 2, y0: box.y + (box.h - a[1] * s) / 2 };
  }
  const artOf = (piece) => SPRITE[ART[piece] ? piece : 'ring'] || null;
  const artSeats = (piece, K, f) => seats(ART[piece] ? piece : 'ring', K).map(([x, y, r]) => ({ x: f.x0 + x * f.s, y: f.y0 + y * f.s, r: r * f.s }));

  /* Загрузить картинки изделий; cb(piece) — после каждой (перерисовать). */
  function load(base, cb) {
    if (typeof Image === 'undefined') return;
    Object.keys(ART).forEach(p => {
      const im = new Image();
      im.onload = () => { SPRITE[p] = im; if (cb) cb(p); };
      im.src = base + 'jw_' + p + '.webp';
    });
  }

  /* Гнёзда в координатах canvas (для полёта камня в гнездо). */
  function sockets(piece, K, box) {
    if (artOf(piece)) return artSeats(piece, K, place(piece, box, 0));
    const f = frame(box);
    return design(piece, K).sockets.map(p => ({ x: f.x0 + p.u * f.s, y: f.y0 + p.v * f.s, r: p.r * f.s }));
  }

  function gold(g, y0, y1, dim) {
    const grd = g.createLinearGradient(0, y0, 0, y1);
    if (dim) { grd.addColorStop(0, 'rgba(255,235,190,0.22)'); grd.addColorStop(1, 'rgba(255,235,190,0.12)'); return grd; }
    grd.addColorStop(0, '#fff1bf');
    grd.addColorStop(0.35, '#e6b95c');
    grd.addColorStop(0.7, '#a8742b');
    grd.addColorStop(1, '#f2cf7d');
    return grd;
  }

  function strokeLine(g, f, pts) {
    g.beginPath();
    g.moveTo(f.x0 + pts[0] * f.s, f.y0 + pts[1] * f.s);
    if (pts.length === 4) g.lineTo(f.x0 + pts[2] * f.s, f.y0 + pts[3] * f.s);
    else if (pts.length === 6) g.quadraticCurveTo(f.x0 + pts[2] * f.s, f.y0 + pts[3] * f.s, f.x0 + pts[4] * f.s, f.y0 + pts[5] * f.s);
    else if (pts.length === 8) g.bezierCurveTo(f.x0 + pts[2] * f.s, f.y0 + pts[3] * f.s, f.x0 + pts[4] * f.s, f.y0 + pts[5] * f.s, f.x0 + pts[6] * f.s, f.y0 + pts[7] * f.s);
    else for (let i = 2; i < pts.length; i += 2) g.lineTo(f.x0 + pts[i] * f.s, f.y0 + pts[i + 1] * f.s);
    g.stroke();
  }

  /* Гнёзда S = [{ x, y, r }]: золотой ободок и тёмное ложе, камни, вспышка
     у только что вставленного. */
  function stones(g, S, gems, opts, sil) {
    S.forEach(({ x, y, r }, i) => {
      g.beginPath(); g.arc(x, y, r * 1.2, 0, Math.PI * 2);
      g.fillStyle = sil ? 'rgba(20,10,4,0.6)' : gold(g, y - r, y + r);
      g.fill();
      if (!sil && gems && gems[i]) return;
      g.beginPath(); g.arc(x, y, r * 0.92, 0, Math.PI * 2);
      g.fillStyle = sil ? 'rgba(0,0,0,0.5)' : 'rgba(40,20,8,0.85)';
      g.fill();
      if (!sil && opts.ghost && opts.ghost[i] && opts.drawGem) opts.drawGem(g, opts.ghost[i], x, y, r * 2.1, 0.28);
    });
    if (sil || !gems || !opts.drawGem) return;
    S.forEach(({ x, y, r }, i) => {
      if (!gems[i]) return;
      let size = r * 2.35;
      if (opts.pop && opts.pop.i === i) {
        const k = opts.pop.k;
        size *= 1 + 0.45 * Math.sin(Math.min(1, k) * Math.PI) * (1 - k * 0.5);
        g.beginPath(); g.arc(x, y, r * (1.3 + 1.4 * k), 0, Math.PI * 2);
        g.fillStyle = `rgba(255,232,160,${0.5 * (1 - k)})`;
        g.fill();
      }
      opts.drawGem(g, gems[i], x, y, size);
    });
  }

  /* Нарисовать изделие.
     gems — массив длины K: тип камня в гнезде или null (пустое гнездо);
     opts.ghost — массив типов для пустых гнёзд (бледный намёк, какой камень
     сюда ляжет); opts.silhouette — тёмный силуэт без камней (следующее
     изделие на витрине); opts.drawGem(g, type, x, y, size, alpha);
     opts.pop — { i, k } гнездо, в которое только что лёг камень (k 0..1);
     opts.closeup — крупный план (окно победы, холст только под изделие); число — предел
     увеличения (по умолчанию 1,9). */
  function draw(g, piece, K, gems, box, opts) {
    opts = opts || {};
    const sil = !!opts.silhouette, img = !sil && artOf(piece);
    if (img) {
      const f = place(piece, box, opts.closeup ? ART_CAP : 0);
      g.save();
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = 'high';
      g.shadowColor = 'rgba(70,24,40,0.35)'; g.shadowBlur = Math.max(2, f.s * 9); g.shadowOffsetY = Math.max(1, f.s * 3);
      g.drawImage(img, f.x0, f.y0, f.w, f.h);
      g.shadowColor = 'rgba(0,0,0,0)'; g.shadowBlur = 0; g.shadowOffsetY = 0;
      stones(g, artSeats(piece, K, f), gems, opts, false);
      g.restore();
      return;
    }
    const d = design(piece, K);
    const f = opts.closeup ? closeFrame(box, d, piece, typeof opts.closeup === 'number' ? opts.closeup : 1.9) : frame(box);
    const lw = Math.max(1.2, f.s * 0.045);
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    if (!sil) { g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = f.s * 0.06; g.shadowOffsetY = f.s * 0.02; }
    const metal = sil ? 'rgba(20,10,4,0.55)' : gold(g, f.y0, f.y0 + f.s);
    g.strokeStyle = metal;
    g.fillStyle = metal;
    d.rings.forEach(r => {
      g.lineWidth = Math.max(1.2, r.w * f.s);
      g.beginPath();
      if (r.square) {
        const x = f.x0 + (r.u - r.rx) * f.s, y = f.y0 + (r.v - r.ry) * f.s, w = 2 * r.rx * f.s, h = 2 * r.ry * f.s, rr = w * 0.22;
        g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr);
        g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.closePath();
      } else {
        g.ellipse(f.x0 + r.u * f.s, f.y0 + r.v * f.s, r.rx * f.s, r.ry * f.s, 0, 0, Math.PI * 2);
      }
      if (r.fill) g.fill(); else g.stroke();
    });
    g.lineWidth = lw;
    d.lines.forEach(pts => strokeLine(g, f, pts));
    g.shadowBlur = 0; g.shadowOffsetY = 0;
    stones(g, d.sockets.map(p => ({ x: f.x0 + p.u * f.s, y: f.y0 + p.v * f.s, r: p.r * f.s })), gems, opts, sil);
    if (sil) {
      g.fillStyle = 'rgba(255,230,180,0.55)';
      g.font = `900 ${Math.round(f.s * 0.34)}px Nunito, "Arial Rounded MT Bold", Arial, sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('?', f.x0 + f.s, f.y0 + f.s * 0.52);
    }
    if (opts.closeup && piece === 'pendant') {   // цепочка гаснет к краям холста
      g.globalCompositeOperation = 'destination-in';
      const fade = g.createLinearGradient(box.x, 0, box.x + box.w, 0);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.16, '#000');
      fade.addColorStop(0.84, '#000'); fade.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = fade;
      g.fillRect(box.x - 8, box.y - 8, box.w + 16, box.h + 16);
      const top = g.createLinearGradient(0, box.y, 0, box.y + box.h * 0.12);   // и к верхнему краю
      top.addColorStop(0, 'rgba(0,0,0,0)'); top.addColorStop(1, '#000');
      g.fillStyle = top;
      g.fillRect(box.x - 8, box.y - 8, box.w + 16, box.h + 16);
    }
    g.restore();
  }

  /* Блик, пробегающий по изделию (k 0..1): рисуется только поверх уже
     нарисованного (source-atop), холст изделия должен быть прозрачным. */
  function shine(g, box, k) {
    g.save();
    g.globalCompositeOperation = 'source-atop';
    const x = box.x - box.w * 0.4 + box.w * 1.8 * k;
    const grd = g.createLinearGradient(x - box.h * 0.6, box.y, x + box.h * 0.2, box.y + box.h);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(0.5, 'rgba(255,252,235,0.75)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(box.x, box.y, box.w, box.h);
    g.restore();
  }

  return { PIECES, ART, design, seats, sockets, draw, shine, load };
})();
