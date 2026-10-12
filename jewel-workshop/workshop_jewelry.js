/* ============================================================
   workshop_jewelry.js — изделия «Ювелир Ленд»: оправа из золота
   и камни в ней. Камни встают по порядку выдачи заказов: первый собранный —
   в главное место изделия (у кольца — единственное), следующие — в места
   поменьше (см. GROUPS).

   Рисуется на любом canvas в прямоугольнике box = { x, y, w, h }: полоса
   изделия над заказами, большое изделие в церемонии победы, миниатюры на
   витрине меню, силуэт следующего изделия. Камни рисует переданная
   функция drawGem (WsBoard.drawGem).

   Оправа — картинка с листа (workshop_assets/jw_<изделие>.webp, грузит
   load); места под камни заданы в пикселях картинки (GROUPS). Пока
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

  /* Вторая форма изделия — ключ с «2» на конце (ring2, crown2…). Рисунка кодом у неё нет: пока картинка
     второй формы не загрузилась (или не загрузится), изделие рисуется как первая. */
  const baseOf = (piece) => String(piece).replace(/2$/, '');

  const spread = (n, a, b) => Array.from({ length: n }, (_, i) => (n === 1 ? (a + b) / 2 : a + (b - a) * i / (n - 1)));

  /* Гнёзда и линии оправы для изделия из K камней. Возвращает
     { sockets: [{ u, v, r }], lines: [[u, v, …]] , shapes: [...] } в условных
     координатах; lines — ломаные/кривые металла, shapes — замкнутые формы. */
  function design(piece, K) {
    piece = baseOf(piece);
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
    necklace: [280, 211], hairpin: [262, 206], tiara: [298, 175], cufflinks: [256, 160], crown: [241, 186],
    // вторые формы (лист H, релиз 1.0): jw_<изделие>2.webp
    ring2: [203, 225], earrings2: [295, 201], pendant2: [171, 259], brooch2: [294, 222], bracelet2: [310, 192],
    necklace2: [276, 406], hairpin2: [283, 221], tiara2: [314, 172], cufflinks2: [264, 154], crown2: [318, 231]
  };
  const SPRITE = {};
  const ART_CAP = 1.5;   // крупный план: не больше полутора пикселей экрана на пиксель картинки

  /* Места под камни по рисунку, в пикселях картинки [x, y, r], группами по
     важности. Группа — симметричные места под один и тот же камень (пара
     серёг, боковые лепестки броши). k-й выданный камень встаёт в группу k:
     кольцо получает первый собранный камень, серьги — первый в большие
     капли и второй в верхние. Камни сверх числа групп вспыхивают в главном
     гнезде, отдельно их не видно; если камней меньше, чем групп, лишние
     места не рисуются — там остаётся гладкое золото рисунка.
     sy — сжатие камня по вертикали: оправа кольца видна под углом. */
  const GROUPS = {
    ring: { sy: 0.6, g: [[[89, 42, 35]]] },
    earrings: { g: [[[46, 162, 25.5], [147, 162, 25.5]], [[46, 31, 13], [147, 31, 13]]] },
    pendant: { g: [[[71, 157, 37]], [[71, 56, 8.5]]] },
    brooch: { g: [[[107, 108, 34]], [[107, 30, 16]], [[35, 83, 16], [179, 83, 16]], [[64, 170, 16], [151, 170, 16]]] },
    bracelet: { g: [[[153, 133, 19]], [[108, 133, 15], [198, 133, 15]], [[42, 117, 7], [263, 116, 7]]] },
    necklace: { g: [[[140, 175, 12]], [[103, 172, 10.5], [177, 172, 10.5]], [[68, 161, 10], [212, 161, 10]], [[39, 146, 9], [241, 146, 9]]] },
    hairpin: { g: [[[123, 89, 17]], [[34, 171, 12], [225, 31, 12]]] },
    tiara: { g: [[[150, 78, 19]], [[91, 87, 15], [207, 87, 15]], [[50, 103, 9.5], [247, 103, 9.5]], [[18, 118, 6], [279, 118, 6]]] },
    cufflinks: { g: [[[50, 63, 28], [208, 96, 28]]] },
    crown: { g: [[[120, 152, 13]], [[74, 149, 11], [166, 149, 11]], [[120, 70, 9], [120, 14, 9]], [[52, 30, 8], [188, 30, 8]], [[16, 60, 8], [225, 60, 8]]] },

    /* Вторые формы (лист H): на рисунке только настоящие гладкие круглые гнёзда, лишних нет. Порядок групп —
       от крупного места к мелким. У вторых форм групп может быть меньше, чем у первых (серьги-кольца — по одному
       месту на серьгу, медальон — одно главное и пара на цепочке). */
    ring2: { sy: 0.9, g: [[[94, 71, 43]], [[97, 17, 13], [90, 135, 13]], [[21, 75, 13], [167, 77, 13]], [[34, 46, 13], [160, 46, 13]],
      [[62, 25, 13], [134, 25, 13]], [[29, 104, 13], [155, 106, 13]], [[56, 125, 13], [127, 129, 13]]] },
    earrings2: { g: [[[70, 167, 21], [224, 166, 21]]] },
    pendant2: { g: [[[89, 177, 35]], [[45, 44, 11], [135, 44, 11]]] },
    brooch2: { g: [[[147, 108, 27]], [[37, 31, 14], [257, 31, 14]], [[92, 182, 11.5], [202, 182, 11.5]], [[75, 47, 11], [219, 47, 11]],
      [[54, 94, 11], [241, 94, 11]], [[72, 156, 11], [222, 156, 11]], [[44, 64, 9], [250, 64, 9]]] },
    bracelet2: { g: [[[155, 141, 36]], [[66, 135, 10.5], [244, 135, 10.5]]] },
    necklace2: { g: [[[137, 368, 24]], [[137, 205, 17]], [[137, 271, 14]], [[100, 157, 11.5], [175, 157, 11.5]], [[44, 84, 11.5], [232, 84, 11.5]]] },
    hairpin2: { g: [[[141, 67, 19]], [[51, 93, 13], [232, 93, 13]]] },
    tiara2: { g: [[[157, 65, 24]], [[75, 89, 9.5], [239, 89, 9.5]], [[26, 116, 7], [287, 116, 7]]] },
    cufflinks2: { g: [[[54, 62, 36], [212, 93, 37]]] },
    crown2: { g: [[[159, 167, 34]], [[86, 171, 12.5], [232, 171, 12.5]], [[45, 164, 11], [272, 164, 11]]] }
  };
  const groupsOf = (piece) => GROUPS[ART[piece] ? piece : 'ring'];

  /* Группы мест изделия из K камней в координатах place f: [[{ x, y, r }]]. */
  function artGroups(piece, K, f) {
    const G = groupsOf(piece).g;
    return G.slice(0, Math.max(1, Math.min(K, G.length)))
      .map(grp => grp.map(([x, y, r]) => ({ x: f.x0 + x * f.s, y: f.y0 + y * f.s, r: r * f.s })));
  }
  /* Группа, в которую встаёт k-й выданный камень (сверх числа групп — главная). */
  const groupOf = (k, n) => (k >= 0 && k < n ? k : 0);

  /* Место картинки в box: вписать, крупный план — не больше ART_CAP. */
  function place(piece, box, cap) {
    const a = ART[piece] || ART.ring;
    let s = Math.min(box.w / a[0], box.h / a[1]) * 0.96;
    if (cap) s = Math.min(s, cap);
    return { s, w: a[0] * s, h: a[1] * s, x0: box.x + (box.w - a[0] * s) / 2, y0: box.y + (box.h - a[1] * s) / 2 };
  }
  /* Картинки изделий грузятся по требованию (перф 1.0): первая отрисовка или
     prefetch() запрашивает файл, после загрузки — cb(piece) из load(). */
  let imageBase = '', imageReady = null;
  const loading = new Set();
  function requestArt(piece) {
    if (!imageBase || !ART[piece] || loading.has(piece) || SPRITE[piece] || typeof Image === 'undefined') return;
    loading.add(piece);
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { SPRITE[piece] = im; if (imageReady) imageReady(piece); };
    im.onerror = () => { loading.delete(piece); };
    im.src = imageBase + 'jw_' + piece + '.webp';
  }
  const artOf = (piece) => {
    const p = ART[piece] ? piece : 'ring';
    requestArt(p);
    return SPRITE[p] || null;
  };
  /* Какое изделие рисуется на самом деле: вторая форма без загруженной картинки — первая форма
     (и запрос её картинки: после загрузки перерисуется уже второй формой). */
  const shown = (piece) => {
    if (ART[piece]) requestArt(piece);
    return ART[piece] && !SPRITE[piece] ? baseOf(piece) : piece;
  };
  /* Заранее запросить картинки (уровень скоро начнётся). */
  const prefetch = (list) => { (list || []).forEach(p => requestArt(p)); };

  /* ---------- металл (релиз 1.0, B2) ----------
     Картинки нарисованы в жёлтом золоте. Розовое и белое золото — перекраска
     кодом: пиксели золота (оттенок 5–70°, есть насыщенность) переносятся по
     яркости на палитру металла, остальное (камни рисуются потом, тёмные
     выемки, блики без цвета) остаётся как есть. Готовая картинка кэшируется на
     пару изделие + металл. Где нет canvas (тесты в node) или картинку нельзя
     прочитать — рисуется золото. */
  const METALS = ['gold', 'rose', 'white'];
  const PAL = {
    rose: [[0, 52, 20, 18], [0.3, 122, 58, 48], [0.55, 196, 116, 98], [0.75, 236, 168, 150], [0.9, 255, 214, 200], [1, 255, 242, 236]],
    white: [[0, 36, 40, 48], [0.3, 104, 110, 122], [0.55, 168, 175, 188], [0.75, 214, 219, 228], [0.9, 240, 243, 248], [1, 255, 255, 255]]
  };
  // крапаны и оправа кодом: светлое, среднее, тёмное
  const TRIM = {
    gold: ['#fff6d2', '#e6b552', '#8a561a'],
    rose: ['#ffe9e0', '#e0a08c', '#7c3e30'],
    white: ['#ffffff', '#c9ced8', '#5c6270']
  };
  let trim = TRIM.gold;
  const LUT = {};
  function lut(m) {
    if (LUT[m]) return LUT[m];
    const P = PAL[m], out = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) {
      const l = i / 255;
      let k = 1;
      while (k < P.length - 1 && P[k][0] < l) k++;
      const a = P[k - 1], b = P[k], t = Math.max(0, Math.min(1, (l - a[0]) / ((b[0] - a[0]) || 1)));
      for (let c = 0; c < 3; c++) out[i * 3 + c] = a[c + 1] + (b[c + 1] - a[c + 1]) * t;
    }
    return (LUT[m] = out);
  }
  /* Перекрасить пиксели RGBA (data) из золота в металл m. */
  function recolor(data, m) {
    const T = lut(m);
    for (let i = 0; i < data.length; i += 4) {
      if (!data[i + 3]) continue;
      const r = data[i], gg = data[i + 1], b = data[i + 2];
      const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      if (mx === 0) continue;
      const sat = (mx - mn) / mx;
      let h = 0;
      if (mx !== mn) {
        const d = mx - mn;
        h = mx === r ? ((gg - b) / d) % 6 : mx === gg ? (b - r) / d + 2 : (r - gg) / d + 4;
        h *= 60; if (h < 0) h += 360;
      }
      // вес «золотости»: полный на 15–60° (тёмный красно-коричневый контур — тоже металл),
      // нарастает с 5° и гаснет к 70°; бесцветные блики — наполовину
      const wh = h < 15 ? Math.max(0, (h - 5) / 10) : h <= 60 ? 1 : Math.max(0, (70 - h) / 10);
      const w = mx === mn ? 0.5 : wh * Math.min(1, sat / 0.12 + 0.5);
      if (w <= 0) continue;
      const l = Math.round(0.299 * r + 0.587 * gg + 0.114 * b), j = l * 3;
      data[i] = r + (T[j] - r) * w;
      data[i + 1] = gg + (T[j + 1] - gg) * w;
      data[i + 2] = b + (T[j + 2] - b) * w;
    }
  }
  const TINT = {};
  function offscreen(img) {
    if (typeof document === 'undefined' || !document.createElement) return null;
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width; c.height = img.naturalHeight || img.height;
    const x = c.getContext && c.getContext('2d');
    if (!x) return null;
    x.drawImage(img, 0, 0);
    return { c, x };
  }
  /* Картинка изделия в металле m (кэш); золото и неудача — исходная. */
  function tinted(piece, img, m) {
    if (!m || m === 'gold' || !PAL[m]) return img;
    const key = piece + ':' + m;
    if (!(key in TINT)) {
      try {
        const o = offscreen(img);
        if (o) {
          const d = o.x.getImageData(0, 0, o.c.width, o.c.height);
          recolor(d.data, m);
          o.x.putImageData(d, 0, 0);
        }
        TINT[key] = o ? o.c : null;
      } catch (e) { TINT[key] = null; }
    }
    return TINT[key] || img;
  }
  /* Силуэт изделия: та же картинка, залитая цветом (кэш на пару изделие + цвет). */
  function shadowed(piece, img, color) {
    const key = piece + '#' + color;
    if (!(key in TINT)) {
      try {
        const o = offscreen(img);
        if (o) { o.x.globalCompositeOperation = 'source-in'; o.x.fillStyle = color; o.x.fillRect(0, 0, o.c.width, o.c.height); }
        TINT[key] = o ? o.c : null;
      } catch (e) { TINT[key] = null; }
    }
    return TINT[key];
  }

  /* Загрузить картинки изделий; cb(piece) — после каждой (перерисовать). */
  function load(base, cb) {
    imageBase = base || ''; imageReady = cb || null;
  }

  /* Куда встаёт k-й выданный камень (k = 0..K-1), в координатах canvas:
     для полёта камня в изделие. По рисунку — первое место его группы. */
  function sockets(piece, K, box) {
    piece = shown(piece);
    if (artOf(piece)) {
      const G = artGroups(piece, K, place(piece, box, 0));
      return Array.from({ length: K }, (_, k) => G[groupOf(k, G.length)][0]);
    }
    const f = frame(box);
    return design(piece, K).sockets.map(p => ({ x: f.x0 + p.u * f.s, y: f.y0 + p.v * f.s, r: p.r * f.s }));
  }

  function gold(g, y0, y1, dim) {
    const grd = g.createLinearGradient(0, y0, 0, y1);
    if (dim) { grd.addColorStop(0, 'rgba(255,235,190,0.22)'); grd.addColorStop(1, 'rgba(255,235,190,0.12)'); return grd; }
    if (trim !== TRIM.gold) {
      grd.addColorStop(0, trim[0]); grd.addColorStop(0.35, trim[1]); grd.addColorStop(0.7, trim[2]); grd.addColorStop(1, trim[1]);
      return grd;
    }
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

  /* Золотые крапаны: четыре зубца по диагоналям держат камень. */
  function prongs(g, r) {
    const d = r * 0.7, pr = Math.max(1.1, r * 0.15);
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
      const px = sx * d, py = sy * d;
      const grd = g.createRadialGradient(px - pr * 0.4, py - pr * 0.45, pr * 0.1, px, py, pr);
      grd.addColorStop(0, trim[0]); grd.addColorStop(0.5, trim[1]); grd.addColorStop(1, trim[2]);
      g.fillStyle = grd;
      g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.fill();
    });
  }

  /* Камни по рисунку: группа j — камень gems[j] (по порядку выдачи). Камень
     утоплен в оправу рисунка: мягкая тень под ним и крапаны; пустое место —
     тёмная выемка. opts.pop — { i, k }: i-й выданный камень только что встал
     (сверх числа групп — вспышка в главном гнезде). */
  function setStones(g, G, sy, gems, opts) {
    const pi = opts.pop ? groupOf(opts.pop.i, G.length) : -1;
    G.forEach((grp, j) => {
      const gem = gems && gems[j];
      grp.forEach(({ x, y, r }) => {
        g.save();
        g.translate(x, y);
        g.scale(1, sy);
        if (!gem || !opts.drawGem) {
          const grd = g.createRadialGradient(0, -r * 0.4, r * 0.1, 0, 0, r * 0.9);
          grd.addColorStop(0, 'rgba(64,26,6,0.62)'); grd.addColorStop(1, 'rgba(120,64,20,0.4)');
          g.beginPath(); g.arc(0, 0, r * 0.88, 0, Math.PI * 2);
          g.fillStyle = grd; g.fill();
          g.lineWidth = Math.max(1, r * 0.08);
          g.strokeStyle = 'rgba(255,238,196,0.6)';
          g.stroke();
          g.restore();
          return;
        }
        let size = r * 2.35;
        if (j === pi) {
          const k = opts.pop.k;
          size *= 1 + 0.45 * Math.sin(Math.min(1, k) * Math.PI) * (1 - k * 0.5);
          g.beginPath(); g.arc(0, 0, r * (1.3 + 1.4 * k), 0, Math.PI * 2);
          g.fillStyle = `rgba(255,232,160,${0.5 * (1 - k)})`;
          g.fill();
        }
        const sh = g.createRadialGradient(0, r * 0.18, r * 0.35, 0, r * 0.18, r * 1.2);
        sh.addColorStop(0, 'rgba(74,30,8,0.55)'); sh.addColorStop(1, 'rgba(74,30,8,0)');
        g.fillStyle = sh;
        g.beginPath(); g.arc(0, r * 0.18, r * 1.2, 0, Math.PI * 2); g.fill();
        opts.drawGem(g, gem, 0, 0, size);
        if (r >= 4) prongs(g, r);
        g.restore();
      });
    });
  }

  /* Нарисовать изделие.
     gems — массив длины K: камни по порядку выдачи, null — ещё не выдан
     (у рисунка k-й камень встаёт в группу k, у оправы кодом — в гнездо k);
     opts.ghost — массив типов для пустых гнёзд оправы кодом (бледный намёк,
     какой камень сюда ляжет); opts.silhouette — тёмный силуэт без камней (следующее
     изделие на витрине); opts.drawGem(g, type, x, y, size, alpha);
     opts.pop — { i, k }: i-й выданный камень только что встал (k 0..1);
     opts.closeup — крупный план (окно победы, холст только под изделие); число — предел
     увеличения (по умолчанию 1,9);
     opts.metal — 'gold' | 'rose' | 'white' (перекраска картинки, крапаны в цвет);
     opts.shadow — цвет: силуэт по рисунку (та же картинка, залитая цветом, без камней). */
  function draw(g, piece, K, gems, box, opts) {
    opts = opts || {};
    trim = TRIM[opts.metal] || TRIM.gold;
    try { paint(g, piece, K, gems, box, opts); } finally { trim = TRIM.gold; }
  }
  function paint(g, piece, K, gems, box, opts) {
    piece = shown(piece);
    const sil = !!opts.silhouette || (!!opts.shadow && !artOf(piece)), img = !sil && artOf(piece);
    if (img && opts.shadow) {   // силуэт по рисунку: без камней и тени
      const sh = shadowed(piece, img, opts.shadow);
      if (sh) {
        const f = place(piece, box, opts.closeup ? ART_CAP : 0);
        g.drawImage(sh, f.x0, f.y0, f.w, f.h);
        return;
      }
    }
    if (img) {
      const f = place(piece, box, opts.closeup ? ART_CAP : 0);
      g.save();
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = 'high';
      g.shadowColor = 'rgba(70,24,40,0.35)'; g.shadowBlur = Math.max(2, f.s * 9); g.shadowOffsetY = Math.max(1, f.s * 3);
      g.drawImage(tinted(piece, img, opts.metal), f.x0, f.y0, f.w, f.h);
      g.shadowColor = 'rgba(0,0,0,0)'; g.shadowBlur = 0; g.shadowOffsetY = 0;
      setStones(g, artGroups(piece, K, f), groupsOf(piece).sy || 1, gems, opts);
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

  /* Сколько камней изделия видно (групп мест) при K заказах. */
  const visible = (piece, K) => Math.max(1, Math.min(K, groupsOf(ART[piece] ? piece : baseOf(piece)).g.length));

  return { PIECES, ART, GROUPS, METALS, design, sockets, draw, shine, load, prefetch, recolor, visible, ready: (p) => { requestArt(p); return !!SPRITE[p]; } };
})();
