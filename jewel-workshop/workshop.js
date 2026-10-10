/* ============================================================
   workshop.js — «Мастерская украшений»: контроллер.
   Экраны, ввод, выдача заказов с эффектами, монеты и звёзды, изделие,
   церемония победы, витрина коллекций со шкатулками, новинки, отмена,
   подсказка, спасение из безнадёжной позиции, сохранение партии.

   Правила — workshop_rules.js (без DOM), уровни — workshop_levels.js,
   поле — workshop_board.js, изделия — workshop_jewelry.js, звуки —
   workshop_sfx.js через неизменённый sound.js game3.

   План 10.10 (docs/WORKSHOP.md):
   - сочность: ноты при укладке камней, вспышка готовой четвёрки, полёт к
     карточке со шлейфом, печать и монеты, вибрация;
   - награды: каскад ×2…×4, монеты за заказ, 1–3 звезды по числу ходов,
     подсказка за монеты (на первых уровнях бесплатно), отмена бесплатно;
   - «Сложный заказ» (каждый 5-й уровень): лимит ходов, награда вдвое;
     ходы кончились — «+5 ходов» за монеты, отмена хода или «Заново»;
   - изделие: каждый выданный заказ вставляет камень в своё гнездо;
   - витрина: коллекции по 5 изделий, собранная коллекция открывает
     шкатулку (монеты и убранство мастерской), уровни открываются по одному;
   - новинки (тайные камни, срочный заказ, запертая пробирка, золотой
     топаз) — с карточкой «Новое!» при первой встрече.
   Без энергии, рекламы, покупок и таймеров. Сеть не нужна.
   Сейвы — собственный ключ SAVE_KEY (осознанное исключение из общей
   абстракции сохранений game3: у форка нет платформенных адаптеров).
   Аналитика — только журнал window.__wsEvents и сводка __wsMetrics().
   ============================================================ */
(() => {
  'use strict';

  const R = WorkshopRules;
  const { LEVELS, GEMS } = WorkshopLevels;
  const PRODUCT_ID = 'jewel_workshop';
  const SAVE_KEY = 'jewel_workshop.v2';   // НЕ пересекается с ключами game3
  const OLD_KEY = 'jewel_workshop.v1';    // сейв MVP: из него берётся только «звук выключен»
  const HIST_MEM = 400;                   // шагов отмены в памяти
  const HIST_SAVE = 60;                   // шагов отмены в сейве
  const GOLD = 'Z';                       // золотой топаз
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FONT = 'Nunito, "Arial Rounded MT Bold", Arial, sans-serif';

  const PENTA = [0, 2, 4, 7, 9, 12];      // ноты укладки: камень выше — нота выше
  const PAY = { order: 10, urgent: 3, jackpot: 100, key: 15, firstWin: 20, star: 10 };
  const HINT_PRICE = 25;
  const FREE_HINT_LEVELS = 2;             // на уровнях 1–2 подсказка бесплатна
  const MORE_MOVES = 5;
  const MORE_PRICE = 50;
  const PER_COLL = 5;

  const COLLECTIONS = [
    { name: 'Весна', coins: 100, decor: ['cloth', 'emerald'] },
    { name: 'Море', coins: 150, decor: ['tube', 'sea'] },
    { name: 'Сад', coins: 150, decor: ['cloth', 'wine'] },
    { name: 'Звёзды', coins: 200, decor: ['tube', 'rose'] },
    { name: 'Осень', coins: 200, decor: ['cloth', 'navy'] },
    { name: 'Королевский бал', coins: 300, decor: ['tube', 'royal'] }
  ];
  const DECOR = {
    cloth: [
      { id: 'walnut', name: 'Ореховый стол' }, { id: 'emerald', name: 'Изумрудный бархат' },
      { id: 'wine', name: 'Винный бархат' }, { id: 'navy', name: 'Синий бархат' }
    ],
    tube: [
      { id: 'clear', name: 'Прозрачное стекло' }, { id: 'sea', name: 'Морское стекло' },
      { id: 'rose', name: 'Розовое стекло' }, { id: 'royal', name: 'Королевское стекло' }
    ]
  };
  const SWATCH = {
    walnut: '#5a3a1f', emerald: '#1f6b4d', wine: '#74203a', navy: '#22346a',
    clear: '#f4ecdc', sea: '#8fe0d8', rose: '#f2a7bd', royal: '#b49cf0'
  };
  // конфетти в цветах бутика: розовый, золото, сирень, белый, мята
  const CONFETTI = ['#ff8fb1', '#ffd23a', '#e9b4ff', '#ffffff', '#8fe3c8', '#ffb347', '#f0618f'];

  const NOVELTY = {
    hidden: { title: 'Тайные камни', text: 'Снимите верхний камень — нижний откроется.' },
    urgent: { title: 'Срочный заказ', text: 'Успейте за отмеченные ходы — заплатят втрое.' },
    lock: { title: 'Запертая пробирка', text: 'Откроется, когда выдадите заказ с ключом.' },
    gold: { title: 'Золотой топаз', text: 'Четыре топаза — сразу +100 монет.' }
  };

  const $ = (id) => document.getElementById(id);
  const gemName = (t) => (GEMS[t] ? GEMS[t].name : t);

  function plural(n, one, few, many) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }
  const movesWord = (n) => n + ' ' + plural(n, 'ход', 'хода', 'ходов');
  const coinsWord = (n) => n + ' ' + plural(n, 'монета', 'монеты', 'монет');

  /* Звук и вибрация: сбой не должен ломать игру. */
  function sfx(id, opts) { try { Sound.play(id, opts); } catch (e) { /* без звука */ } }
  function buzz(pattern) {
    if (REDUCED || Store.data.muted) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* нет вибрации */ }
  }

  /* ---------- сохранение ----------
     { v: 3, coins, muted, best: { id: ходов }, stars: { id: 1..3 }, cur,
       seen: { новинка: true }, chests: { коллекция: true },
       decor: { cloth, tube }, sessions }
     Убранство во владении не хранится: оно выводится из открытых шкатулок. */
  function freshData() {
    return { v: 3, coins: 0, muted: false, best: {}, stars: {}, cur: null, seen: {}, chests: {}, decor: { cloth: 'walnut', tube: 'clear' }, sessions: 0 };
  }
  const intIn = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;

  const Store = {
    data: freshData(),
    load() {
      try {
        const raw = window.localStorage.getItem(SAVE_KEY);
        if (!raw) {
          const old = JSON.parse(window.localStorage.getItem(OLD_KEY) || 'null');
          if (old && typeof old === 'object') this.data.muted = !!old.muted;
          return;
        }
        const d = JSON.parse(raw);
        if (!d || typeof d !== 'object' || d.v !== 3) return;
        const out = freshData();
        out.coins = intIn(d.coins, 0, 1e7) ? d.coins : 0;
        out.muted = !!d.muted;
        out.sessions = intIn(d.sessions, 0, 1e7) ? d.sessions : 0;
        LEVELS.forEach(lv => {
          const k = String(lv.id);
          const b = d.best && d.best[k], s = d.stars && d.stars[k];
          if (intIn(b, 1, 1e5) && intIn(s, 1, 3)) { out.best[k] = b; out.stars[k] = s; }
        });
        if (d.seen && typeof d.seen === 'object') {
          for (const k of Object.keys(NOVELTY).concat('hard')) if (d.seen[k]) out.seen[k] = true;
        }
        this.data = out;
        COLLECTIONS.forEach((c, ci) => { if (d.chests && d.chests[ci] && collDone(ci)) out.chests[ci] = true; });
        if (d.decor && typeof d.decor === 'object') {
          for (const kind of Object.keys(DECOR)) if (owns(kind, d.decor[kind])) out.decor[kind] = d.decor[kind];
        }
        // незаконченная партия хранится упакованной; разворачивается при входе
        out.cur = restoreGame(d.cur) ? d.cur : null;
      } catch (e) { /* приватный режим/нет хранилища/битый сейв — играем с чистого листа */ }
    },
    save() {
      try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) { /* ок */ }
    }
  };

  function packState(s) {
    return { v: s.vials.map(v => v.join('')), s: s.slots.slice(), n: s.next, d: s.delivered, hd: s.hid.slice() };
  }

  /* Проверка сохранённого состояния: те же камни, что в уровне, ровно по
     четыре на каждый невыданный заказ, карточки и очередь согласованы,
     тайных камней не больше, чем камней под верхним. */
  function unpackState(p, lv) {
    if (!p || !Array.isArray(p.v) || !Array.isArray(p.s)) return null;
    const total = lv.orders.length;
    if (p.v.length !== lv.vials.length) return null;
    if (p.s.length !== Math.min(lv.slots, total)) return null;
    if (!Number.isInteger(p.n) || p.n < p.s.filter(o => o >= 0).length || p.n > total) return null;
    if (!Number.isInteger(p.d) || p.d < 0 || p.d >= total) return null;
    const vials = [];
    for (const str of p.v) {
      if (typeof str !== 'string' || str.length > R.CAP) return null;
      const v = str.split('');
      if (v.some(g => lv.orders.indexOf(g) === -1)) return null;
      vials.push(v);
    }
    const active = new Set();
    for (const o of p.s) {
      if (o === -1) continue;
      if (!Number.isInteger(o) || o < 0 || o >= p.n || active.has(o)) return null;
      active.add(o);
    }
    // выданы — заказы до next, которых нет на столе
    const delivered = new Set();
    for (let o = 0; o < p.n; o++) if (!active.has(o)) delivered.add(lv.orders[o]);
    if (delivered.size !== p.d) return null;
    const count = {};
    vials.forEach(v => v.forEach(g => { count[g] = (count[g] || 0) + 1; }));
    for (const t of lv.orders) if ((count[t] || 0) !== (delivered.has(t) ? 0 : R.CAP)) return null;
    let hid = vials.map(() => 0);
    if (p.hd !== undefined) {
      if (!Array.isArray(p.hd) || p.hd.length !== vials.length) return null;
      if (p.hd.some((h, i) => !intIn(h, 0, Math.max(0, vials[i].length - 1)))) return null;
      hid = p.hd.slice();
    }
    const s = {
      vials, orders: lv.orders.slice(), slots: p.s.slice(), next: p.n, delivered: p.d, hid,
      lock: lv.lock ? { vial: lv.lock.vial, order: lv.lock.order } : null
    };
    if (R.findDelivery(s)) return null;      // невыданная готовая ёмкость — сейв не от этой игры
    return s;
  }

  const usOf = (x, m) => (intIn(x, 0, m) ? x : null);

  function restoreGame(c) {
    if (!c || typeof c !== 'object') return null;
    const idx = LEVELS.findIndex(l => l.id === c.id);
    if (idx < 0) return null;
    const lv = LEVELS[idx];
    const s = unpackState(c.st, lv);
    if (!s || !Number.isInteger(c.m) || c.m < 0) return null;
    let h = [];
    if (Array.isArray(c.h)) {
      for (const e of c.h) {
        const hs = e && unpackState(e.st, lv);
        if (!hs || !Number.isInteger(e.m) || e.m < 0) { h = []; break; }
        h.push({ st: hs, moves: e.m, kind: e.k === 'restart' ? 'restart' : 'move', us: usOf(e.us, e.m), ld: intIn(e.ld, 0, e.m) ? e.ld : 0 });
      }
    }
    const paidArr = Array.isArray(c.p) && c.p.length === lv.orders.length ? c.p.map(x => !!x) : lv.orders.map(() => false);
    return {
      idx, st: s, moves: c.m, hist: h, paid: paidArr, us: usOf(c.us, c.m),
      bonus: intIn(c.b, 0, 500) ? c.b : 0, ld: intIn(c.ld, 0, c.m) ? c.ld : 0, ac: intIn(c.ac, 0, 1e6) ? c.ac : 0
    };
  }

  /* Одна ячейка незаконченной партии. Пустой заход в другой уровень её не
     трогает; первый ход в другом уровне — заменяет. */
  function saveGame() {
    if (!L) return;
    if (won || (moves === 0 && hist.length === 0)) {
      if (Store.data.cur && Store.data.cur.id === L.id) Store.data.cur = null;
    } else {
      Store.data.cur = {
        id: L.id, st: packState(st), m: moves,
        h: hist.slice(-HIST_SAVE).map(e => ({ st: packState(e.st), m: e.moves, k: e.kind, us: e.us, ld: e.ld })),
        p: paid.map(x => (x ? 1 : 0)), us: urgentSince, b: bonusMoves, ld: lastDeliv, ac: attemptCoins
      };
    }
    Store.save();
  }

  /* ---------- уровни, коллекции, убранство ---------- */
  const isPassed = (i) => !!Store.data.stars[LEVELS[i].id];
  const isOpen = (i) => i === 0 || isPassed(i - 1);
  const collOfIdx = (i) => Math.floor(i / PER_COLL);
  const collLevels = (ci) => LEVELS.slice(ci * PER_COLL, ci * PER_COLL + PER_COLL);
  const collCount = (ci) => collLevels(ci).filter(l => Store.data.stars[l.id]).length;
  function collDone(ci) { const ls = collLevels(ci); return ls.length > 0 && ls.every(l => Store.data.stars[l.id]); }
  function owns(kind, id) {
    if (!DECOR[kind] || !DECOR[kind].some(d => d.id === id)) return false;
    if (DECOR[kind][0].id === id) return true;
    return COLLECTIONS.some((c, ci) => Store.data.chests[ci] && c.decor[0] === kind && c.decor[1] === id);
  }
  function decorName(kind, id) { const d = DECOR[kind].find(x => x.id === id); return d ? d.name : id; }

  /* ---------- журнал событий (без сети) ---------- */
  window.__wsEvents = [];
  function track(name, data) {
    const e = Object.assign({ product: PRODUCT_ID, event: name, t: Date.now() }, data || {});
    window.__wsEvents.push(e);
    if (window.__wsEvents.length > 2000) window.__wsEvents.shift();
  }

  /* ---------- состояние ---------- */
  let levelIdx = 0;
  let L = null;            // уровень (не меняется)
  let st = null;           // состояние правил — всегда уже окончательное
  let view = null;         // что показывают карточки (догоняет st по ходу анимации выдачи)
  let hist = [];           // снимки для отмены: { st, moves, kind, us, ld }
  let moves = 0;           // переливов в текущей линии партии
  let sel = -1;            // выбранная пробирка
  let busy = false;        // идёт перелив/выдача — поле не принимает касания
  let won = false;
  let lost = false;        // «Сложный заказ»: ходы кончились
  let winCount = 0;        // побед за сессию (для проверок)
  let levelWins = 0;       // побед на текущем прохождении уровня — 0 или 1
  let epoch = 0;           // меняется при отмене/рестарте/выходе: опоздавшие колбэки отбрасываются
  let rescueK = null;      // null — победа достижима; число — сколько ходов вернуть; 0 — только «Заново»
  let hintMv = null;
  let flash = null;        // временная подпись { text, until }
  let flashTimer = null;
  let toastTimer = null;
  let stats = null;        // { hints, undos, restarts } за прохождение
  let screen = 'menu';
  let paid = [];           // заказ уже оплачен в этой попытке (отмена и повторная выдача не платят)
  let urgentSince = null;  // ход, на котором срочный заказ появился на столе
  let bonusMoves = 0;      // докупленные ходы «Сложного заказа»
  let lastDeliv = 0;       // ход последней выдачи (пауза между выдачами — метрика ритма)
  let shownCoins = 0;      // монеты на счётчике (догоняют Store.data.coins по мере полёта)
  let attemptCoins = 0;    // заработано в этой попытке (церемония победы)
  let cardTimer = null, cardJob = null;   // отложенная смена карточки после последней выдачи
  let pieceGems = [];      // камни в гнёздах изделия (по заказам)
  let pendingUnlock = -1;  // ключ летит к этой пробирке — замок ещё виден
  let justWon = 0;         // id уровня, пройденного последним (значок на карте «выпрыгивает»)
  let modalOpen = false, modalOk = null;
  let winShineTimer = 0;

  /* ---------- экраны ---------- */
  function showScreen(id) {
    screen = id === 'screen-menu' ? 'menu' : 'game';
    ['screen-menu', 'screen-workshop'].forEach(s => $(s).classList.toggle('active', s === id));
  }

  function toast(msg, ms) {
    const el = $('hint-toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), ms || 2600);
  }
  function hideToast() { clearTimeout(toastTimer); $('hint-toast').classList.add('hidden'); }

  function gemSpan(t, cls) {
    const s = document.createElement('span');
    s.className = 'ws-gem' + (cls ? ' ' + cls : '');
    s.style.setProperty('--sprite', String(GEMS[t] ? GEMS[t].sprite : 0));
    return s;
  }

  function bump(el) {
    if (!el) return;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }

  /* ---------- эффекты поверх экрана ----------
     Полёты (камни к карточке и в гнездо, монеты к счётчику, ключ к замку),
     всплывающие надписи, кольца, искры, монетный дождь джекпота. */
  const Fx = (() => {
    let cv = null, g = null, dpr = 1, W = 0, H = 0, raf = 0;
    let jobs = [], sparks = [], texts = [], rings = [], drops = [];
    const now = () => performance.now();
    const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

    function init(c) { cv = c; g = cv.getContext('2d'); resize(); }
    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      request();
    }
    function request() { if (!raf && g) raf = requestAnimationFrame(frame); }

    /* items: [{ x, y, size, draw(g, x, y, size, t) }] в координатах окна;
       o: step, dur, lift, trail, sparkle, onEach(k). cb — долетел последний. */
    function fly(items, target, cb, o) {
      o = o || {};
      const t = now();
      const step = REDUCED ? 0 : (o.step === undefined ? 40 : o.step);
      const dur = REDUCED ? 140 : (o.dur || 420);
      const lift = o.lift === undefined ? 70 : o.lift;
      let left = items.length;
      if (!left) { if (cb) cb(); return; }
      items.forEach((it, k) => jobs.push({
        it, t0: t + k * step, dur, lift, trail: !!o.trail && !REDUCED,
        x0: it.x, y0: it.y, s0: it.size, tx: target.x, ty: target.y, ts: target.size || it.size,
        done: () => {
          if (o.onEach) o.onEach(k);
          if (--left === 0) {
            if (o.sparkle !== false) sparkle(target.x, target.y, target.size || 24);
            if (cb) cb();
          }
        }
      }));
      request();
    }
    function posAt(j, k) {
      const e = ease(k);
      const cx = (j.x0 + j.tx) / 2, cy = Math.min(j.y0, j.ty) - j.lift;
      return {
        x: (1 - e) * (1 - e) * j.x0 + 2 * (1 - e) * e * cx + e * e * j.tx,
        y: (1 - e) * (1 - e) * j.y0 + 2 * (1 - e) * e * cy + e * e * j.ty,
        s: j.s0 + (j.ts - j.s0) * e
      };
    }
    function sparkle(x, y, size) {
      if (REDUCED) return;
      const t = now();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        sparks.push({ x, y, vx: Math.cos(a), vy: Math.sin(a), r: size * (0.55 + 0.25 * (i % 2)), t0: t, dur: 420 });
      }
      request();
    }
    /* Всплывающая надпись: выскакивает, поднимается и гаснет. */
    function text(x, y, str, o) {
      o = o || {};
      texts.push({
        x, y, str, color: o.color || '#ffe08a', size: o.size || 22, t0: now() + (o.delay || 0),
        dur: REDUCED ? 800 : (o.dur || 950), rise: REDUCED ? 0 : (o.rise === undefined ? 42 : o.rise)
      });
      request();
    }
    function ring(x, y, r) { if (REDUCED) return; rings.push({ x, y, r, t0: now(), dur: 520 }); request(); }
    function rain(n) {
      if (REDUCED) return;
      const t = now();
      for (let i = 0; i < n; i++) {
        drops.push({ x: Math.random() * W, y: -24 - Math.random() * H * 0.35, vy: 0.3 + Math.random() * 0.3,
          size: 14 + Math.random() * 10, spin: Math.random() * 6, t0: t + Math.random() * 500, dur: 1700 });
      }
      request();
    }
    /* Монета: золотой диск, вращение — сжатием по горизонтали. */
    function drawCoin(gg, x, y, size, spin) {
      const r = size / 2, sx = Math.max(0.18, Math.abs(Math.cos(spin || 0)));
      gg.save();
      gg.translate(x, y); gg.scale(sx, 1);
      const grd = gg.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
      grd.addColorStop(0, '#fff4c2'); grd.addColorStop(0.5, '#f0c04a'); grd.addColorStop(1, '#a8701c');
      gg.fillStyle = grd;
      gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.fill();
      gg.strokeStyle = 'rgba(120,70,10,0.8)'; gg.lineWidth = Math.max(1, r * 0.14);
      gg.beginPath(); gg.arc(0, 0, r * 0.66, 0, Math.PI * 2); gg.stroke();
      gg.restore();
    }
    function goldGrad(gg, s) {
      const grd = gg.createLinearGradient(0, -s / 2, 0, s / 2);
      grd.addColorStop(0, '#fff1bf'); grd.addColorStop(0.5, '#e6b95c'); grd.addColorStop(1, '#a8742b');
      return grd;
    }
    function drawKey(gg, x, y, s) {
      gg.save();
      gg.translate(x, y); gg.rotate(-0.6);
      gg.shadowColor = 'rgba(0,0,0,0.5)'; gg.shadowBlur = s * 0.12;
      gg.strokeStyle = goldGrad(gg, s);
      gg.lineWidth = s * 0.13; gg.lineCap = 'round';
      gg.beginPath(); gg.arc(-s * 0.26, 0, s * 0.19, 0, Math.PI * 2); gg.stroke();
      gg.beginPath(); gg.moveTo(-s * 0.07, 0); gg.lineTo(s * 0.46, 0); gg.stroke();
      gg.beginPath();
      gg.moveTo(s * 0.28, 0); gg.lineTo(s * 0.28, s * 0.16);
      gg.moveTo(s * 0.41, 0); gg.lineTo(s * 0.41, s * 0.2);
      gg.stroke();
      gg.restore();
    }
    function drawPadlock(gg, x, y, s) {
      gg.save();
      gg.translate(x, y);
      gg.shadowColor = 'rgba(0,0,0,0.5)'; gg.shadowBlur = s * 0.1;
      gg.strokeStyle = '#c9c2b4'; gg.lineWidth = s * 0.12;
      gg.beginPath(); gg.arc(0, -s * 0.12, s * 0.24, Math.PI, 0); gg.lineTo(s * 0.24, s * 0.02); gg.moveTo(-s * 0.24, -s * 0.12); gg.lineTo(-s * 0.24, s * 0.02); gg.stroke();
      gg.fillStyle = goldGrad(gg, s);
      const w = s * 0.7, h = s * 0.52;
      gg.beginPath(); gg.rect(-w / 2, -s * 0.02, w, h); gg.fill();
      gg.fillStyle = '#4a2c0c';
      gg.beginPath(); gg.arc(0, s * 0.2, s * 0.07, 0, Math.PI * 2); gg.fill();
      gg.fillRect(-s * 0.025, s * 0.22, s * 0.05, s * 0.13);
      gg.restore();
    }

    function frame() {
      raf = 0;
      const t = now();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      rings = rings.filter(r => {
        const k = (t - r.t0) / r.dur;
        if (k >= 1) return false;
        g.strokeStyle = `rgba(255,224,140,${0.85 * (1 - k)})`;
        g.lineWidth = 3 * (1 - k) + 1;
        g.beginPath(); g.arc(r.x, r.y, r.r * (0.6 + 0.9 * k), 0, Math.PI * 2); g.stroke();
        return true;
      });
      drops = drops.filter(d => {
        const el = t - d.t0;
        if (el < 0) return true;
        const k = el / d.dur;
        if (k >= 1) return false;
        g.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
        drawCoin(g, d.x, d.y + el * d.vy + el * el * 0.00035, d.size, d.spin + el / 110);
        g.globalAlpha = 1;
        return true;
      });
      const landed = [];
      jobs = jobs.filter(j => {
        if (t < j.t0) return true;
        const k = Math.min(1, (t - j.t0) / j.dur);
        if (j.trail) {
          for (let i = 4; i >= 1; i--) {
            const kk = k - i * 0.05;
            if (kk <= 0) continue;
            const p = posAt(j, kk);
            g.globalAlpha = 0.24 * (1 - i / 5);
            j.it.draw(g, p.x, p.y, p.s * (1 - i * 0.08), t);
          }
          g.globalAlpha = 1;
        }
        const p = posAt(j, k);
        const glow = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 0.8);
        glow.addColorStop(0, 'rgba(255,220,150,0.45)');
        glow.addColorStop(1, 'rgba(255,220,150,0)');
        g.fillStyle = glow;
        g.fillRect(p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
        j.it.draw(g, p.x, p.y, p.s, t);
        if (k >= 1) { landed.push(j); return false; }
        return true;
      });
      sparks = sparks.filter(s => {
        const k = (t - s.t0) / s.dur;
        if (k >= 1) return false;
        const d = s.r * (0.4 + 0.9 * k);
        g.fillStyle = `rgba(255,236,170,${0.95 * (1 - k)})`;
        g.beginPath(); g.arc(s.x + s.vx * d, s.y + s.vy * d, 2.6 * (1 - k * 0.5), 0, Math.PI * 2); g.fill();
        return true;
      });
      texts = texts.filter(x => {
        const el = t - x.t0;
        if (el < 0) return true;
        const k = el / x.dur;
        if (k >= 1) return false;
        const sc = k < 0.15 ? 0.6 + 0.6 * (k / 0.15) : k < 0.25 ? 1.2 - 0.2 * ((k - 0.15) / 0.1) : 1;
        g.save();
        g.globalAlpha = k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1;
        g.translate(x.x, x.y - x.rise * k);
        g.scale(sc, sc);
        g.font = `900 ${x.size}px ${FONT}`;
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.lineJoin = 'round';
        g.lineWidth = Math.max(3, x.size * 0.2);
        g.strokeStyle = 'rgba(110,40,80,0.92)';
        g.strokeText(x.str, 0, 0);
        g.fillStyle = x.color;
        g.fillText(x.str, 0, 0);
        g.restore();
        return true;
      });
      landed.forEach(j => j.done());
      if (jobs.length || sparks.length || texts.length || rings.length || drops.length) request();
    }
    /* Монеты от точки к счётчику: n монет делится между 1–8 летящими
       (o.count — сколько именно, o.size, o.lift, o.dur — для церемонии). */
    function coins(from, to, n, onEach, cb, o) {
      o = o || {};
      const cnt = Math.max(1, Math.min(o.count || 8, n, o.count ? n : Math.round(n / 8)));
      const shares = [];
      let rest = n;
      for (let i = 0; i < cnt; i++) { const s = Math.round(rest / (cnt - i)); shares.push(s); rest -= s; }
      const items = shares.map(() => ({
        x: from.x + (Math.random() - 0.5) * (o.spread || 22), y: from.y + (Math.random() - 0.5) * (o.spread || 14) * 0.7, size: o.size || 18,
        draw: (gg, x, y, s, t) => drawCoin(gg, x, y, s, t / 90)
      }));
      fly(items, { x: to.x, y: to.y, size: 16 }, cb, {
        step: o.step || 55, dur: o.dur || 520, lift: o.lift === undefined ? 50 : o.lift, sparkle: false, onEach: (i) => onEach(shares[i], i)
      });
    }
    function clear() {
      jobs = []; sparks = []; texts = []; rings = []; drops = [];
      if (g) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); }
    }
    return { init, resize, fly, coins, text, ring, rain, sparkle, clear, drawCoin, drawKey, drawPadlock };
  })();

  const gemItem = (gem, x, y, size) => ({ x, y, size, draw: (g, px, py, s) => WsBoard.drawGem(g, gem, px, py, s) });

  /* ---------- изделие над заказами: гнездо на каждый заказ ---------- */
  const Piece = (() => {
    let cv = null, g = null, dpr = 1, W = 0, H = 0, raf = 0;
    let pop = null, shineAt = 0;
    function init(c) { cv = c; g = cv.getContext('2d'); }
    function box() { return { x: 2, y: 2, w: Math.max(1, W - 4), h: Math.max(1, H - 4) }; }
    function resize() {
      if (!cv) return;
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(r.width)); H = Math.max(1, Math.floor(r.height));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      request();
    }
    function request() { if (!raf && g) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      if (!L) return;
      const t = performance.now();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      let p = null;
      if (pop) {
        const k = (t - pop.t0) / 520;
        if (k >= 1) pop = null; else p = { i: pop.i, k };
      }
      WsJewel.draw(g, L.piece, L.orders.length, pieceGems, box(), { ghost: L.orders, drawGem: WsBoard.drawGem, pop: p });
      if (shineAt) {
        const k = (t - shineAt) / 900;
        if (k >= 1) shineAt = 0; else WsJewel.shine(g, box(), k);
      }
      if (pop || shineAt) request();
    }
    /* Гнездо заказа i в координатах окна (куда летит камень). */
    function socket(i) {
      const r = cv.getBoundingClientRect();
      const s = L && WsJewel.sockets(L.piece, L.orders.length, box())[i];
      return s ? { x: r.left + s.x, y: r.top + s.y, size: s.r * 2.35 } : { x: r.left + W / 2, y: r.top + H / 2, size: 20 };
    }
    function set(i, gem) { pieceGems[i] = gem; pop = REDUCED ? null : { i, t0: performance.now() }; request(); }
    function shine() { if (!REDUCED) { shineAt = performance.now(); request(); } }
    function reset() { pop = null; shineAt = 0; request(); }
    return { init, resize, request, socket, set, shine, reset };
  })();

  function resetPiece() {
    pieceGems = st.orders.map((t, i) => (R.isDelivered(st, i) ? t : null));
    Piece.reset();
  }

  /* ---------- заказы ---------- */
  function syncView() {
    view = { slots: st.slots.slice(), next: st.next, delivered: st.delivered };
  }

  function cardEl(slot) { return $('ws-orders').children[slot] || null; }

  function keyBadge() {
    const k = document.createElement('span');
    k.className = 'ws-key';
    k.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M11 12h10m-3 0v4m-3-4v3" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
    return k;
  }

  /* Касание заказчицы — подсказка не длиннее трёх слов. */
  function cardTip(o) {
    const t = st.orders[o];
    if (L.urgent && o === L.urgent.order) return 'Срочно! Оплата ×3';
    if (L.lock && o === L.lock.order) return 'Принесёт ключ';
    if (t === GOLD) return 'Джекпот +' + PAY.jackpot;
    return 'Соберите 4 камня';
  }

  /* Лица заказчиц: у заказа своё лицо на весь уровень, на виду — без повторов. */
  const FACES = ['bride', 'grandma', 'curly', 'lady', 'redhead', 'blonde'];
  // героиня окна победы по изделию: невеста — кольца, колье, диадемы и короны; кудрявая —
  // серьги, браслеты и заколки; бабушка — кулоны, броши и запонки
  const HERO = { ring: 'bride', necklace: 'bride', tiara: 'bride', crown: 'bride', earrings: 'curly',
    bracelet: 'curly', hairpin: 'curly', pendant: 'grandma', brooch: 'grandma', cufflinks: 'grandma' };
  let faces = {};
  function assignFaces(slots) {
    const used = [];
    const vis = slots.filter(o => o >= 0);
    vis.forEach(o => {
      if (faces[o] !== undefined && used.indexOf(faces[o]) === -1) used.push(faces[o]);
      else delete faces[o];
    });
    vis.forEach(o => {
      if (faces[o] !== undefined) return;
      let f = o % FACES.length;
      for (let k = 0; k < FACES.length && used.indexOf(f) !== -1; k++) f = (f + 1) % FACES.length;
      faces[o] = f;
      used.push(f);
    });
  }

  /* Заказ — заказчица: портрет в золотой оправе, «4» на нём и пузырь с
     камнем. Джекпот — золотой пузырь с ценой, ключ — значок на пузыре,
     срочный — красный кружок с остатком ходов. */
  function renderOrders(enterSlot) {
    const box = $('ws-orders');
    box.innerHTML = '';
    box.dataset.n = String(view.slots.length);
    assignFaces(view.slots);
    view.slots.forEach((o, i) => {
      const card = document.createElement('div');
      const face = document.createElement('span');
      const bubble = document.createElement('span');
      bubble.className = 'ws-bubble';
      if (o < 0) {
        card.className = 'ws-card is-empty';
        card.setAttribute('aria-label', 'Свободное место');
        face.className = 'ws-face';
      } else {
        const t = st.orders[o];
        card.className = 'ws-card' + (i === enterSlot ? ' is-enter' : '') + (t === GOLD ? ' is-gold' : '');
        card.dataset.gem = t;
        card.dataset.order = String(o);
        card.setAttribute('role', 'img');
        card.setAttribute('aria-label', 'Заказ: ' + gemName(t) + ', четыре камня');
        face.className = 'ws-face f-' + FACES[faces[o]];
        const q = document.createElement('span');
        q.className = 'ws-card-qty';
        q.textContent = '4';
        face.appendChild(q);
        bubble.appendChild(gemSpan(t));
        if (t === GOLD) {
          const tag = document.createElement('span');
          tag.className = 'ws-card-tag';
          tag.innerHTML = '<span class="ws-coin-ico"></span>' + PAY.jackpot;
          bubble.appendChild(tag);
        }
        if (L.lock && o === L.lock.order) bubble.appendChild(keyBadge());
        if (L.urgent && o === L.urgent.order) {
          const rb = document.createElement('span');
          rb.className = 'ws-ribbon';
          card.appendChild(rb);
        }
        card.addEventListener('click', () => { if (!won) toast(cardTip(o), 1600); });
      }
      card.appendChild(face);
      card.appendChild(bubble);
      box.appendChild(card);
    });
    const qBox = $('ws-queue-items');
    qBox.innerHTML = '';
    const queue = [];
    for (let o = view.next; o < st.orders.length; o++) queue.push(o);
    queue.slice(0, 4).forEach(o => {
      const t = st.orders[o];
      const it = document.createElement('span');
      it.className = 'ws-queue-item' + (t === GOLD ? ' is-gold' : '') +
        (L.urgent && o === L.urgent.order ? ' is-urgent' : '') + (L.lock && o === L.lock.order ? ' has-key' : '');
      it.title = gemName(t);
      it.appendChild(gemSpan(t));
      if (L.lock && o === L.lock.order) it.appendChild(keyBadge());
      qBox.appendChild(it);
    });
    if (queue.length > 4) {
      const more = document.createElement('span');
      more.className = 'ws-queue-more';
      more.textContent = '+' + (queue.length - 4);
      qBox.appendChild(more);
    }
    $('ws-queue').classList.toggle('is-empty', queue.length === 0);
    $('ws-queue').setAttribute('aria-label', queue.length ? 'Далее: ' + queue.map(o => gemName(st.orders[o])).join(', ') : 'Очередь пуста');
    updateCounter(false);
    renderUrgent();
  }

  function urgentLeft() {
    if (!L || !L.urgent || urgentSince === null || R.isDelivered(st, L.urgent.order)) return null;
    return L.urgent.moves - (moves - urgentSince);
  }

  function renderUrgent() {
    const rb = document.querySelector('#ws-orders .ws-ribbon');
    if (!rb) return;
    const n = urgentLeft();
    if (n === null) { rb.textContent = '!'; rb.setAttribute('aria-label', 'Срочно'); return; }
    rb.textContent = String(Math.max(0, n));
    rb.setAttribute('aria-label', n > 0 ? 'Срочно: осталось ' + movesWord(n) : 'Не успели');
    rb.classList.toggle('is-hot', n > 0 && n <= 2);
    rb.classList.toggle('is-late', n <= 0);
  }

  function updateCounter(bumpIt) {
    const el = $('ws-counter');
    el.textContent = 'Заказы: ' + view.delivered + ' из ' + st.orders.length;
    if (bumpIt) bump(el);
  }

  const starsFor = (m) => (m <= L.s3 ? 3 : m <= L.s2 ? 2 : 1);
  const limitNow = () => (L && L.hard ? L.limit + bonusMoves : 0);

  function updateHud() {
    if (!L || !st) return;
    const s = starsFor(moves);
    $('ws-stars').querySelectorAll('i').forEach((el, i) => {
      const on = i < s;
      if (!on && el.classList.contains('on')) el.classList.add('lost');
      if (on) el.classList.remove('lost');
      el.classList.toggle('on', on);
    });
    let next = s === 3 ? L.s3 : s === 2 ? L.s2 : 0;
    if (L.hard && next) next = Math.min(next, limitNow());   // за лимит не заманиваем
    $('ws-star-next').textContent = next ? 'до ' + next : '';
    $('ws-stars').setAttribute('aria-label', 'Звёзд: ' + s + (next ? ', пока ходов не больше ' + next : ''));
    // полоска под звёздами: сколько ходов осталось до потери следующей звезды
    const from = s === 3 ? 0 : s === 2 ? L.s3 : L.s2;
    const tier = next ? Math.max(0, Math.min(1, (next - moves) / Math.max(1, next - from))) : 0;
    $('ws-stars').style.setProperty('--tier', tier.toFixed(3));
    const mv = $('ws-moves');
    if (L.hard) {
      const left = Math.max(0, limitNow() - moves);
      mv.textContent = String(left);
      mv.setAttribute('aria-label', 'Ходы: ' + moves + ' из ' + limitNow());
      mv.classList.toggle('is-low', left <= 3);
    } else {
      mv.textContent = 'Ходы: ' + moves;
      mv.removeAttribute('aria-label');
      mv.classList.remove('is-low');
    }
    renderCoins(false);
    renderUrgent();
  }

  function renderCoins(bumpIt) {
    $('ws-coins-n').textContent = String(Math.max(0, shownCoins));
    $('ws-menu-coins-n').textContent = String(Math.max(0, shownCoins));
    if (bumpIt) { bump($('ws-coins')); bump($('ws-menu-coins')); }
  }

  function addCoins(n) {
    if (!n) return;
    Store.data.coins += n;
    attemptCoins += n;
  }

  /* Монеты летят к счётчику; счётчик растёт по мере прилёта. */
  function coinsTo(x, y, n, e) {
    const ico = screen === 'game' ? $('ws-coins') : $('ws-menu-coins');
    const r = ico.getBoundingClientRect();
    let i = 0;
    Fx.coins({ x, y }, { x: r.left + 14, y: r.top + r.height / 2 }, n, (part) => {
      if (e !== epoch) return;
      shownCoins += part;
      renderCoins(true);
      sfx('coin', { semis: Math.min(7, i++) });
    });
  }

  function waitingVials() {
    const act = R.activeTypes(st);
    const locked = R.lockedVial(st);
    const res = [];
    st.vials.forEach((v, i) => { if (i !== locked && R.isComplete(v) && act.indexOf(v[0]) === -1) res.push(i); });
    return res;
  }

  /* ---------- подпись над полем ---------- */
  function setFlash(text, ms) {
    flash = { text, until: performance.now() + ms };
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { flash = null; updateGuide(); }, ms);
  }

  function tutorialText() {
    // Уровень 1: кольцо ведёт по кратчайшему решению от текущей позиции.
    const step = R.hint(st);
    if (!step) { WsBoard.setTutorial(-1); return ''; }
    if (sel === step.from) {
      WsBoard.setTutorial(step.to);
      return 'Теперь — куда положить';
    }
    WsBoard.setTutorial(step.from);
    if (sel >= 0) return 'Коснитесь пробирки';
    return st.delivered > 0 ? 'Следующий заказ' : 'Коснитесь пробирки';
  }

  function updateGuide() {
    if (!L || screen !== 'game') return;
    const cap = $('ws-caption');
    let text = '';
    const tutorial = L.id === 1 && !won && !lost && rescueK === null && !busy;
    if (!tutorial) WsBoard.setTutorial(-1);
    if (won || lost || rescueK !== null) text = '';
    else if (flash && performance.now() < flash.until) { text = flash.text; if (tutorial) tutorialText(); }
    else if (tutorial) text = tutorialText();
    else if (hintMv) text = 'Подсказка: по стрелке';
    else {
      const w = busy ? [] : waitingVials();
      if (w.length) text = 'Готово, ждёт заказа';
      else if (moves === 0 && st.delivered === 0 && L.intent) text = L.intent;
      else if (L.hard && moves === 0) text = 'Сложный заказ: ' + movesWord(limitNow());
    }
    cap.textContent = text;
    WsBoard.setWaiting(busy ? [] : waitingVials());
    updateRescue();
    updateButtons();
  }

  const hintPrice = () => (L.id <= FREE_HINT_LEVELS ? 0 : HINT_PRICE);

  function updateButtons() {
    $('btn-undo').disabled = hist.length === 0 || won;
    $('btn-restart').disabled = won || (moves === 0 && st.delivered === 0);
    const p = hintPrice();
    $('ws-hint-label').textContent = p && !hintMv ? String(p) : '';
    $('btn-hint').setAttribute('aria-label', p && !hintMv ? 'Подсказка за ' + coinsWord(p) : 'Подсказка');
  }

  /* ---------- спасение: победа стала недостижимой ---------- */
  const UNDO_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4 12l5 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12h9a5 5 0 0 1 0 10h-2" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  function checkWinnable() {
    if (won || R.isWon(st)) { rescueK = null; return; }
    if (R.isWinnable(st)) { rescueK = null; return; }
    let k = 0;
    for (let i = hist.length - 1; i >= 0; i--) {
      if (R.isWinnable(hist[i].st)) { k = hist.length - i; break; }
    }
    if (rescueK === null) track('unwinnable', { level: L.id, moves, back: k, dead: R.movesOf(st).length === 0 });
    rescueK = k;
  }

  function updateRescue() {
    const box = $('ws-rescue');
    if (rescueK === null || won || lost) { box.classList.add('hidden'); return; }
    const dead = R.movesOf(st).length === 0;
    $('ws-rescue-text').textContent = dead ? 'Тупик' : 'Не собрать';
    const b = $('btn-rescue');
    b.innerHTML = rescueK > 0 ? UNDO_ICON + '<b>' + rescueK + '</b>' : 'Заново';
    b.setAttribute('aria-label', rescueK > 0 ? 'Вернуть ' + movesWord(rescueK) : 'Начать заново');
    box.classList.remove('hidden');
  }

  function onRescue() {
    if (rescueK === null || won) return;
    sfx('click');
    if (rescueK === 0) { restart(); return; }
    const k = rescueK;
    const snap = hist[hist.length - k];
    hist.length = hist.length - k;
    track('rescue', { level: L.id, back: k });
    restoreSnap(snap);
  }

  /* ---------- «Сложный заказ»: ходы кончились ---------- */
  function checkLimit() {
    setLost(!!(L && L.hard && !won && !R.isWon(st) && moves >= limitNow()));
  }

  function setLost(on) {
    if (on === lost) { if (on) renderLose(); return; }
    lost = on;
    $('lose-overlay').classList.toggle('hidden', !on);
    if (on) {
      sel = -1; WsBoard.select(-1);
      sfx('lose'); buzz(80);
      track('lose', { level: L.id, moves, limit: limitNow(), delivered: st.delivered });
      renderLose();
    }
  }

  function renderLose() {
    $('ws-lose-text').textContent = 'Собрано заказов: ' + st.delivered + ' из ' + st.orders.length +
      '. Докупите ходы, отмените последний ход или начните заново.';
    const dots = $('ws-lose-dots');
    dots.innerHTML = '';
    st.orders.forEach((o, i) => { const d = document.createElement('i'); if (i < st.delivered) d.className = 'on'; dots.appendChild(d); });
    const b = $('btn-more');
    $('ws-more-n').textContent = '+' + MORE_MOVES;
    $('ws-more-price').textContent = String(MORE_PRICE);
    b.setAttribute('aria-label', 'Ещё ' + movesWord(MORE_MOVES) + ' за ' + coinsWord(MORE_PRICE));
    b.disabled = Store.data.coins < MORE_PRICE;
    $('ws-lose-coins').textContent = 'У вас ' + coinsWord(Store.data.coins);
  }

  function buyMoves() {
    if (!lost) return;
    if (Store.data.coins < MORE_PRICE) { sfx('invalid'); toast('Мало монет', 1600); return; }
    Store.data.coins -= MORE_PRICE;
    shownCoins = Store.data.coins;
    bonusMoves += MORE_MOVES;
    sfx('reward'); buzz(20);
    track('buy_moves', { level: L.id, moves, price: MORE_PRICE });
    setLost(false);
    updateHud();
    bump($('ws-moves'));
    saveGame();
  }

  /* ---------- уровень ---------- */
  const initialUrgent = () => (L.urgent && L.urgent.order < Math.min(L.slots, L.orders.length) ? 0 : null);

  function loadLevel(i, resume) {
    epoch++;
    levelIdx = i;
    L = LEVELS[i];
    if (resume) {
      st = resume.st; moves = resume.moves; hist = resume.hist; paid = resume.paid;
      urgentSince = resume.us; bonusMoves = resume.bonus; lastDeliv = resume.ld; attemptCoins = resume.ac;
    } else {
      st = R.makeState(L); moves = 0; hist = []; paid = L.orders.map(() => false);
      urgentSince = initialUrgent(); bonusMoves = 0; lastDeliv = 0; attemptCoins = 0;
    }
    sel = -1; busy = false; won = false; levelWins = 0; pendingUnlock = -1;
    hintMv = null; flash = null; rescueK = null;
    lost = false;
    faces = {};
    clearTimeout(cardTimer); cardJob = null;
    clearInterval(winShineTimer);
    stats = { hints: 0, undos: 0, restarts: 0 };
    Fx.clear();
    shownCoins = Store.data.coins;
    hideToast();
    $('win-overlay').classList.add('hidden');
    $('lose-overlay').classList.add('hidden');
    $('ws-level-title').textContent = 'Уровень ' + L.id;
    $('ws-level-name').textContent = L.name;
    document.body.classList.toggle('is-hard', !!L.hard);
    showScreen('screen-workshop');
    WsBoard.select(-1); WsBoard.clearHint(); WsBoard.setTutorial(-1);
    WsBoard.setVials(st.vials, st.hid, R.lockedVial(st));
    WsBoard.resize();
    Piece.resize();
    syncView();
    renderOrders();
    resetPiece();
    if (resume) checkWinnable();
    updateHud();
    checkLimit();
    updateGuide();
    saveGame();
    requestAnimationFrame(() => { WsBoard.resize(); Piece.resize(); updateGuide(); });
    track('level_start', { level: L.id, resumed: !!resume, moves });
    if (!resume) introduce();
  }

  /* Карточка «Новое!» при первой встрече с новинкой; на «Сложном заказе» —
     условие (пока уровень не пройден). */
  function introduce() {
    const e = epoch;
    const hard = () => {
      if (e !== epoch || !L.hard || isPassed(levelIdx)) return;
      showModal({
        kicker: 'Уровень ' + L.id, title: 'Сложный заказ',
        text: 'Награда вдвое больше.',
        art: drawHardArt, ok: 'Берусь!'
      });
    };
    if (L.novelty && NOVELTY[L.novelty] && !Store.data.seen[L.novelty]) {
      const n = NOVELTY[L.novelty];
      Store.data.seen[L.novelty] = true;
      Store.save();
      track('novelty', { level: L.id, novelty: L.novelty });
      setTimeout(() => {
        if (e !== epoch) return;
        sfx('novelty');
        showModal({ kicker: 'Новое!', title: n.title, text: n.text, art: NOVELTY_ART[L.novelty], ok: 'Понятно', onOk: hard });
      }, REDUCED ? 0 : 350);
    } else if (L.hard && !isPassed(levelIdx)) setTimeout(hard, REDUCED ? 0 : 300);
  }

  /* Вернуть снимок (отмена/спасение/заново): анимации обрываются, всё рисуется заново. */
  function restoreSnap(snap) {
    epoch++;
    st = snap.st;
    moves = snap.moves;
    urgentSince = snap.us === undefined ? initialUrgent() : snap.us;
    lastDeliv = snap.ld || 0;
    sel = -1; busy = false; hintMv = null; flash = null; pendingUnlock = -1;
    clearTimeout(cardTimer); cardJob = null;
    Fx.clear();
    shownCoins = Store.data.coins;
    hideToast();
    WsBoard.select(-1); WsBoard.clearHint();
    WsBoard.setVials(st.vials, st.hid, R.lockedVial(st));
    syncView();
    renderOrders();
    resetPiece();
    checkWinnable();
    updateHud();
    checkLimit();
    updateGuide();
    saveGame();
  }

  function pushHist(kind) {
    hist.push({ st: R.cloneState(st), moves, kind, us: urgentSince, ld: lastDeliv });
    if (hist.length > HIST_MEM) hist.shift();
  }

  /* ---------- касание поля ---------- */
  function lockedTap(idx) {
    sfx('invalid'); buzz(20);
    WsBoard.shake(idx);
    toast('Нужен ключ', 1600);
    track('invalid', { level: L.id, locked: idx });
  }

  function tapVial(idx) {
    if (!L || won || lost || busy || modalOpen || screen !== 'game') return;
    if (idx < 0 || idx >= st.vials.length) {
      if (sel !== -1) { sel = -1; WsBoard.select(-1); updateGuide(); }
      return;
    }
    if (idx === R.lockedVial(st)) { lockedTap(idx); return; }
    if (sel === -1) {
      if (!st.vials[idx].length) return;
      sel = idx;
      WsBoard.select(idx);
      sfx('pick');
      updateGuide();
      return;
    }
    if (sel === idx) { sel = -1; WsBoard.select(-1); updateGuide(); return; }
    const count = R.moveCount(st.vials[sel], st.vials[idx]);
    if (count === 0) {
      sfx('invalid'); buzz(20);
      WsBoard.shake(idx);
      toast(st.vials[idx].length >= R.CAP ? 'Пробирка полна' : 'Нужен такой же', 1500);
      track('invalid', { level: L.id, from: sel, to: idx });
      return;
    }
    doPour(sel, idx, count);
  }

  /* Плата за выдачу: 10 × место в каскаде, срочный вовремя — втрое,
     золотой — джекпот, ключ — бонус. Каждый заказ оплачивается один раз
     за попытку: отмена и повторная выдача монет не дают. */
  function payFor(ev, k) {
    const out = { coins: 0, urgent: null, jackpot: 0, key: 0 };
    if (paid[ev.order]) return out;
    paid[ev.order] = true;
    let c = PAY.order * (k + 1);
    if (L.urgent && ev.order === L.urgent.order) {
      out.urgent = urgentSince === null || moves - urgentSince <= L.urgent.moves;
      if (out.urgent) c *= PAY.urgent;
    }
    out.coins = c;
    if (ev.gem === GOLD) out.jackpot = PAY.jackpot;
    if (ev.unlocked >= 0) out.key = PAY.key;
    addCoins(c + out.jackpot + out.key);
    return out;
  }

  function doPour(from, to, count) {
    const e = epoch;
    flushCards();
    pushHist('move');
    const prevHid = st.hid.slice();
    const before = st.vials[to].length;
    const res = R.moveInPlace(st, { from, to });
    if (!res) { hist.pop(); return; }
    moves++;
    sel = -1;
    hintMv = null;
    WsBoard.clearHint();
    busy = true;
    hideToast();
    // плата и появление срочного заказа — по порядку выдач этого хода
    const pays = res.deliveries.map((ev, k) => {
      const p = payFor(ev, k);
      if (L.urgent && ev.incoming === L.urgent.order) urgentSince = moves;
      return p;
    });
    track('move', { level: L.id, from, to, count, delivered: res.deliveries.length });
    // выдачи пишутся сразу (по правилам), а не по ходу анимации — уход с экрана их не теряет
    res.deliveries.forEach((ev, k) => {
      track('delivery', { level: L.id, gem: ev.gem, order: ev.order, chain: k + 1, move: moves, gap: k === 0 ? moves - lastDeliv : 0 });
    });
    if (res.deliveries.length) lastDeliv = moves;
    const left = urgentLeft();
    if (left !== null && left >= 1 && left <= 2) sfx('tick', { delay: 0.25 });
    saveGame();
    updateHud();
    updateGuide();
    // выданные пробирки до вспышки показывают тайные камни как до хода
    const boardHid = st.hid.slice();
    res.deliveries.forEach(d => { boardHid[d.vial] = prevHid[d.vial]; });
    WsBoard.pour(from, to, count, () => {
      if (e !== epoch) return;
      runDeliveries(res.deliveries, pays, 0, e);
    }, {
      onGem: (k) => { if (e === epoch) sfx('gem', { semis: PENTA[Math.min(5, before + k)] }); },
      hid: boardHid,
      reveal: res.revealed
    });
    if (res.revealed) setTimeout(() => { if (e === epoch) sfx('reveal'); }, REDUCED ? 0 : 160);
  }

  /* Выдачи по очереди: четвёрка вспыхивает, камни со шлейфом летят к
     карточке, на карточке — печать и монеты, камень встаёт в гнездо
     изделия, на место карточки выходит следующий заказ. Каскад — каждая
     следующая выдача того же хода: «Каскад ×2…», встряска, нота выше. */
  function runDeliveries(events, pays, k, e) {
    if (e !== epoch) return;
    if (k >= events.length) { afterAction(); return; }
    const ev = events[k];
    const go = () => {
      if (e !== epoch) return;
      sfx('ready', { semis: 2 * k });
      buzz(15);
      WsBoard.flashReady(ev.vial, 300, () => {
        if (e !== epoch) return;
        const card = cardEl(ev.slot);
        const gemEl = card && card.querySelector('.ws-gem');
        const r = gemEl ? gemEl.getBoundingClientRect() : null;
        const target = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width }
          : { x: window.innerWidth / 2, y: 80, size: 40 };
        const items = WsBoard.takeVial(ev.vial).map(it => gemItem(it.gem, it.x, it.y, it.size));
        sfx('whoosh');
        Fx.fly(items, target, () => {
          if (e !== epoch) return;
          landDelivery(ev, pays[k], k, e);
          if (k === events.length - 1) { swapCard(ev, true); afterAction(); }
          else {
            setTimeout(() => {
              if (e !== epoch) return;
              swapCard(ev, false);
              runDeliveries(events, pays, k + 1, e);
            }, REDUCED ? 60 : 320);
          }
        }, { trail: true, dur: 400, step: 45, lift: 60 });
      });
    };
    if (k >= 1) { cascadeFx(k); setTimeout(go, REDUCED ? 0 : 220); } else go();
  }

  function boardPoint(fy) {
    const r = $('board-wrap').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height * fy };
  }

  function cascadeFx(k) {
    const p = boardPoint(0.3);
    Fx.text(p.x, p.y, 'Каскад ×' + (k + 1) + '!', { color: '#ffd36b', size: 30 + 4 * Math.min(k, 3), dur: 1100 });
    WsBoard.quake(0.6 + 0.3 * k);
    sfx('cascade', { semis: 2 * (k - 1) });
    buzz([30, 30, 30]);
  }

  function landDelivery(ev, pay, k, e) {
    sfx('deliver', { semis: 2 * k });
    sfx('stamp', { delay: 0.09 });
    buzz(25);
    view.delivered++;
    updateCounter(true);
    const card = cardEl(ev.slot);
    let cx = window.innerWidth / 2, cy = 80;
    if (card) {
      card.classList.add('is-done');
      const r = card.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      Fx.ring(cx, cy, r.width * 0.7);
    }
    // камень заказа встаёт в своё гнездо изделия
    const s = Piece.socket(ev.order);
    Fx.fly([gemItem(ev.gem, cx, cy, 30)], s, () => {
      if (e !== epoch) return;
      Piece.set(ev.order, ev.gem);
      sfx('gem', { semis: 12 + 2 * Math.min(k, 3) });
    }, { dur: 460, lift: 36 });
    if (pay.coins) {
      Fx.text(cx, cy - 8, '+' + pay.coins, { color: '#ffe08a', size: 22 });
      coinsTo(cx, cy, pay.coins, e);
    }
    if (pay.urgent === true) Fx.text(cx, cy - 34, 'Успели! ×3', { color: '#ffb27a', size: 18, delay: 140 });
    else if (pay.urgent === false) Fx.text(cx, cy - 34, 'Не успели', { color: '#e6d6bf', size: 16, delay: 140 });
    if (pay.jackpot) setTimeout(() => { if (e === epoch) jackpotFx(pay.jackpot, e); }, REDUCED ? 0 : 250);
    if (ev.unlocked >= 0) keyFx(ev, pay, card, e);
    if (L.id <= 3 && k === 0) setFlash('Заказ готов', 2400);
    track('stamp', { level: L.id, order: ev.order, coins: pay.coins + pay.jackpot + pay.key });
  }

  function jackpotFx(n, e) {
    sfx('jackpot');
    buzz([40, 30, 60]);
    Fx.rain(36);
    const p = boardPoint(0.42);
    Fx.text(p.x, p.y, 'Джекпот! +' + n, { color: '#ffd84a', size: 34, dur: 1600 });
    coinsTo(p.x, p.y, n, e);
  }

  /* Ключ с карточки летит к запертой пробирке; замок открывается при прилёте. */
  function keyFx(ev, pay, card, e) {
    const v = ev.unlocked;
    pendingUnlock = v;
    const badge = card && card.querySelector('.ws-key');
    const br = (badge || card) ? (badge || card).getBoundingClientRect() : null;
    const from = br ? { x: br.left + br.width / 2, y: br.top + br.height / 2 } : { x: window.innerWidth / 2, y: 80 };
    const vr = WsBoard.vialClientRect(v);
    const to = vr ? { x: vr.left + vr.width / 2, y: vr.top + vr.height * 0.45, size: vr.width * 0.9 } : { x: window.innerWidth / 2, y: window.innerHeight / 2, size: 30 };
    Fx.fly([{ x: from.x, y: from.y, size: 26, draw: (g, x, y, s) => Fx.drawKey(g, x, y, s) }], to, () => {
      if (e !== epoch) return;
      if (pendingUnlock === v) pendingUnlock = -1;
      WsBoard.unlock(v);
      sfx('unlock');
      buzz([20, 40, 20]);
      if (pay.key) {
        Fx.text(to.x, to.y - 24, '+' + pay.key, { color: '#ffe08a', size: 20 });
        coinsTo(to.x, to.y, pay.key, e);
      }
      updateGuide();
    }, { dur: 560, lift: 80, step: 0 });
  }

  /* Смена карточки: сразу (внутри каскада) или через 320 мс после
     последней выдачи — чтобы печать успели увидеть. Новый ход дожидаться
     не обязан: flushCards() показывает отложенную смену немедленно. */
  function swapCard(ev, defer) {
    view.slots[ev.slot] = ev.incoming;
    if (ev.incoming >= 0) view.next = ev.incoming + 1;
    const render = () => { cardJob = null; renderOrders(ev.incoming >= 0 ? ev.slot : -1); };
    if (defer && !REDUCED) { clearTimeout(cardTimer); cardJob = render; cardTimer = setTimeout(render, 320); }
    else render();
  }

  function flushCards() {
    if (!cardJob) return;
    clearTimeout(cardTimer);
    const j = cardJob;
    cardJob = null;
    j();
  }

  function afterAction() {
    busy = false;
    // поле совпадает с правилами (страховка после анимаций)
    WsBoard.sync(st.vials, st.hid, pendingUnlock >= 0 ? pendingUnlock : R.lockedVial(st));
    const same = view.delivered === st.delivered && view.next === st.next && view.slots.every((o, i) => o === st.slots[i]);
    if (!same && !cardJob) { syncView(); renderOrders(); }
    if (R.isWon(st)) { win(); return; }
    checkWinnable();
    updateHud();
    checkLimit();
    updateGuide();
    saveGame();
  }

  /* ---------- отмена / заново ---------- */
  function undo() {
    if (!L || won || !hist.length || modalOpen) return;
    sfx('click');
    const snap = hist.pop();
    stats.undos++;
    track('undo', { level: L.id, kind: snap.kind, depth: hist.length });
    restoreSnap(snap);
    if (snap.kind === 'restart') toast('Партия вернулась', 1600);
  }

  function restart() {
    if (!L || won || modalOpen || (moves === 0 && st.delivered === 0)) return;
    sfx('click');
    pushHist('restart');
    stats.restarts++;
    track('restart', { level: L.id, moves, delivered: st.delivered });
    restoreSnap({ st: R.makeState(L), moves: 0, us: initialUrgent(), ld: 0 });
    toast('Отменить — вернёт партию', 2000);
  }

  /* ---------- подсказка: решатель от текущей позиции, за монеты ---------- */
  function onHint() {
    if (!L || won || busy || lost || modalOpen) return;
    if (rescueK !== null) {
      toast('Сначала верните ходы', 1800);
      bump($('ws-rescue'));
      return;
    }
    if (hintMv) { WsBoard.showHint(hintMv.from, hintMv.to); return; }   // уже оплачена
    const price = hintPrice();
    if (price > Store.data.coins) {
      sfx('invalid');
      toast('Мало монет', 1600);
      return;
    }
    const step = R.hint(st);
    stats.hints++;
    track('hint', { level: L.id, from: step && step.from, to: step && step.to, moves, price: step ? price : 0 });
    if (!step) return;
    if (price) {
      Store.data.coins -= price;
      shownCoins -= price;
      renderCoins(true);
      const r = $('btn-hint').getBoundingClientRect();
      Fx.text(r.left + r.width / 2, r.top - 6, '−' + price, { color: '#f3c46b', size: 18 });
      saveGame();
    }
    sfx('click');
    hintMv = step;
    sel = -1;
    WsBoard.select(-1);
    WsBoard.showHint(step.from, step.to);
    updateGuide();
  }

  /* ---------- победа ---------- */
  /* Засчитать прохождение (победа или выход в меню во время последней выдачи):
     лучший результат, звёзды, награда за прохождение и новые звёзды
     (на «Сложном заказе» вдвое). */
  function recordWin() {
    won = true;
    winCount++; levelWins++;
    const id = String(L.id);
    const prevBest = Store.data.best[id] || 0;
    const prevStars = Store.data.stars[id] || 0;
    const stars = starsFor(moves);
    Store.data.best[id] = prevBest ? Math.min(prevBest, moves) : moves;
    Store.data.stars[id] = Math.max(prevStars, stars);
    let bonus = (prevStars ? 0 : PAY.firstWin) + Math.max(0, stars - prevStars) * PAY.star;
    if (L.hard) bonus *= 2;
    addCoins(bonus);
    justWon = L.id;
    const ci = collOfIdx(levelIdx);
    const collNew = !prevStars && collDone(ci) && !Store.data.chests[ci];
    saveGame();
    return { prevBest, prevStars, stars, bonus, collNew, ci };
  }

  function win() {
    if (won) return;                            // ровно один раз
    const r = recordWin();
    track('win', {
      level: L.id, moves, stars: r.stars, best: Store.data.best[String(L.id)], par: L.par, hard: L.hard,
      hints: stats.hints, undos: stats.undos, restarts: stats.restarts, coins: attemptCoins
    });
    hideToast();
    setLost(false);
    WsBoard.setTutorial(-1);
    WsBoard.setWaiting([]);
    $('ws-caption').textContent = '';
    updateRescue();
    updateButtons();
    sfx('win');
    buzz([30, 50, 30, 50, 80]);
    const e = epoch;
    setTimeout(() => { if (e === epoch) Piece.shine(); }, REDUCED ? 0 : 420);
    setTimeout(() => { if (e === epoch) showWin(r); }, REDUCED ? 100 : 1000);
  }

  /* Церемония: изделие крупно с бликом, звёзды по одной, монеты считаются,
     прогресс коллекции; новая полная коллекция ведёт к шкатулке. */
  function showWin(r) {
    const e = epoch;
    Confetti.burst({ count: r.collNew ? 80 : 55, durationMs: 2400, colors: CONFETTI });
    $('ws-win-kicker').textContent = 'Уровень ' + L.id + (L.hard ? ' · Сложный заказ' : '');
    $('ws-win-title').textContent = levelIdx === LEVELS.length - 1 ? 'Корона готова!' : 'Готово!';
    $('ws-win-name').textContent = L.name;
    const starEls = $('ws-win-stars').querySelectorAll('i');
    starEls.forEach(el => el.classList.remove('on'));
    const coinsEl = $('ws-win-coins');
    coinsEl.textContent = '+0';
    let text = 'Ходов: ' + moves;
    if (r.prevBest && moves < r.prevBest) text += ' — новый рекорд!';
    else if (r.prevBest && r.prevBest < moves) text += ' · лучший: ' + r.prevBest;
    $('ws-win-text').textContent = text;
    $('ws-win-tip').textContent = r.stars < 3 ? '★★★ — если уложиться в ' + movesWord(L.s3) : (moves <= L.par ? 'Как у мастера: короче не бывает' : 'Три звезды!');
    // коллекция: пять точек, только что пройденная — с всплеском
    const ci = r.ci, c = COLLECTIONS[ci];
    const dots = $('ws-coll-dots');
    dots.innerHTML = '';
    collLevels(ci).forEach(lv => {
      const d = document.createElement('i');
      if (Store.data.stars[lv.id]) d.className = 'on' + (lv.id === L.id && !r.prevStars ? ' is-new' : '');
      dots.appendChild(d);
    });
    $('ws-coll-text').textContent = collDone(ci)
      ? 'Коллекция «' + c.name + '» собрана!' + (Store.data.chests[ci] ? '' : ' Шкатулка ждёт')
      : 'Коллекция «' + c.name + '»: ' + collCount(ci) + ' из ' + PER_COLL;
    const last = levelIdx === LEVELS.length - 1;
    const nextBtn = $('btn-next');
    nextBtn.dataset.mode = r.collNew ? 'chest' : last ? 'menu' : 'next';
    nextBtn.setAttribute('aria-label', r.collNew ? 'Открыть шкатулку' : last ? 'На витрину' : 'Дальше');
    nextBtn.classList.toggle('is-chest', r.collNew);
    // свой счётчик монет — ровно поверх счётчика в шапке, «+N» под ним
    const ov = $('win-overlay'), hc = $('ws-coins').getBoundingClientRect();
    const flat = innerWidth > innerHeight && innerHeight <= 520;
    ov.style.setProperty('--bank-t', Math.round(hc.top) + 'px');
    ov.style.setProperty('--bank-r', Math.round(innerWidth - hc.right) + 'px');
    ov.style.setProperty('--bank-b', Math.round(hc.bottom) + 'px');
    ov.style.setProperty('--bank-l', Math.round(hc.left) + 'px');
    ov.style.setProperty('--win-top', (flat ? 10 : Math.round(hc.bottom + 46)) + 'px');
    ov.classList.toggle('is-flat', flat);   // лёжа «+N» встаёт левее счётчика, не под ним
    let bank = shownCoins;
    $('ws-win-bank-n').textContent = String(Math.max(0, bank));
    $('ws-win-hero').className = 'ws-win-hero h-' + (HERO[L.piece] || 'curly');
    ov.classList.remove('hidden');
    drawWinJewel(0);
    // звёзды по одной
    for (let i = 0; i < r.stars; i++) {
      setTimeout(() => {
        if (e !== epoch) return;
        starEls[i].classList.add('on');
        sfx('star', { semis: [0, 3, 7][i] });
        buzz(15);
      }, REDUCED ? 0 : 350 + i * 300);
    }
    // монеты попытки считаются вверх
    const total = attemptCoins;
    const t0 = (REDUCED ? 0 : 350 + r.stars * 300 + 150);
    setTimeout(() => {
      if (e !== epoch) return;
      const steps = Math.min(14, Math.max(1, Math.ceil(total / 10)));
      for (let s = 1; s <= steps; s++) {
        setTimeout(() => {
          if (e !== epoch) return;
          coinsEl.textContent = '+' + Math.round(total * s / steps);
          if (s % 2 === 0 || s === steps) sfx('count', { semis: Math.min(12, s) });
          if (s === steps) { bump(coinsEl.parentElement); shownCoins = Store.data.coins; renderCoins(false); }
        }, REDUCED ? 0 : s * 60);
      }
      // ещё не долетевшие монеты (награда за звёзды) — струйкой из изделия в счётчик
      const pend = Store.data.coins - bank;
      const jr = $('ws-win-jewel').getBoundingClientRect(), br = $('ws-win-bank').getBoundingClientRect();
      if (pend > 0 && jr.width && br.width) {
        let k = 0;
        Fx.coins({ x: jr.left + jr.width / 2, y: jr.top + jr.height / 2 }, { x: br.left + 16, y: br.top + br.height / 2 }, pend, (part) => {
          if (e !== epoch) return;
          bank += part;
          $('ws-win-bank-n').textContent = String(bank);
          bump($('ws-win-bank'));
          if (k++ % 2 === 0) sfx('coin', { semis: Math.min(7, k) });
        }, () => { if (e === epoch) $('ws-win-bank-n').textContent = String(Store.data.coins); },
        { count: 10, size: 30, spread: 90, lift: 120, dur: 760, step: 70 });
      }
    }, t0);
    // блик по изделию, пока открыта церемония
    clearInterval(winShineTimer);
    if (!REDUCED) {
      let k0 = performance.now();
      const run = () => {
        if (e !== epoch || $('win-overlay').classList.contains('hidden')) return;
        const k = (performance.now() - k0) / 1000;
        if (k <= 1) { drawWinJewel(k); requestAnimationFrame(run); } else drawWinJewel(0);
      };
      setTimeout(() => { k0 = performance.now(); run(); }, 450);
      winShineTimer = setInterval(() => { k0 = performance.now(); run(); }, 3200);
    }
  }

  function sizeCanvas(cv) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth || 300, h = cv.clientHeight || 150;
    if (cv.width !== Math.round(w * dpr)) cv.width = Math.round(w * dpr);
    if (cv.height !== Math.round(h * dpr)) cv.height = Math.round(h * dpr);
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    return { g, w, h };
  }

  function drawWinJewel(k) {
    const { g, w, h } = sizeCanvas($('ws-win-jewel'));
    const box = { x: 4, y: 4, w: w - 8, h: h - 8 };
    WsJewel.draw(g, L.piece, L.orders.length, L.orders, box, { drawGem: WsBoard.drawGem, closeup: true });
    if (k > 0 && k < 1) WsJewel.shine(g, box, k);
  }

  function nextFromWin() {
    sfx('click');
    const mode = $('btn-next').dataset.mode;
    if (mode === 'chest') {
      const ci = collOfIdx(levelIdx);
      leaveToMenu();
      setTimeout(() => openChest(ci), REDUCED ? 0 : 350);
    } else if (mode === 'next' && levelIdx < LEVELS.length - 1) {
      track('next', { level: L.id });
      loadLevel(levelIdx + 1);
    } else leaveToMenu();
  }

  function leaveToMenu() {
    if (L && !won && screen === 'game') {
      if (R.isWon(st)) { recordWin(); track('win', { level: L.id, moves, par: L.par, left: true }); }
      else track('quit', { level: L.id, moves, delivered: st.delivered });
    }
    epoch++;
    busy = false;
    sel = -1;
    lost = false;
    pendingUnlock = -1;
    clearTimeout(cardTimer); cardJob = null;
    clearInterval(winShineTimer);
    Fx.clear();
    shownCoins = Store.data.coins;
    hideToast();
    closeModal(true);
    WsBoard.setTutorial(-1);
    if (L) saveGame();
    $('win-overlay').classList.add('hidden');
    $('lose-overlay').classList.add('hidden');
    document.body.classList.remove('is-hard');
    showScreen('screen-menu');
    renderMenu();
  }

  /* ---------- окно-карточка (новинка, «Сложный заказ», шкатулка) ---------- */
  const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.6 4.6L19 7.6" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function showModal(o) {
    $('ws-modal-kicker').textContent = o.kicker || '';
    $('ws-modal-title').textContent = o.title || '';
    const txt = $('ws-modal-text');
    txt.textContent = o.text || '';
    txt.classList.toggle('is-coins', !!o.coins);
    if (o.coins) {   // награда: монетка и «+N», подробности — для чтецов
      const ico = Object.assign(document.createElement('span'), { className: 'ws-coin-ico' });
      ico.setAttribute('aria-hidden', 'true');
      txt.append(ico, '+' + o.coins);
      if (o.sr) txt.append(Object.assign(document.createElement('span'), { className: 'ws-sr', textContent: ' ' + o.sr }));
    }
    const ok = $('btn-modal-ok');
    if (o.okIcon) { ok.innerHTML = CHECK_SVG; ok.setAttribute('aria-label', o.ok); } else { ok.textContent = o.ok || 'Понятно'; ok.removeAttribute('aria-label'); }
    ok.classList.toggle('is-icon', !!o.okIcon);
    const pic = $('ws-modal-pic');
    pic.classList.toggle('hidden', !o.pic);
    pic.innerHTML = o.pic || '';
    const art = $('ws-modal-art');
    art.classList.toggle('hidden', !o.art);
    $('modal-overlay').classList.remove('hidden');
    modalOpen = true;
    modalOk = o.onOk || null;
    sel = -1; WsBoard.select(-1);
    if (o.art) { const c = sizeCanvas(art); o.art(c.g, c.w, c.h); }
    setTimeout(() => { if (modalOpen) $('btn-modal-ok').focus(); }, 60);
  }

  function closeModal(silent) {
    if (!modalOpen) return;
    modalOpen = false;
    $('modal-overlay').classList.add('hidden');
    const f = modalOk;
    modalOk = null;
    if (silent) return;
    sfx('click');
    if (f) f();
  }

  const NOVELTY_ART = {
    hidden(g, w, h) {
      const s = Math.min(h * 0.6, w * 0.22), y = h / 2;
      WsBoard.drawHidden(g, w * 0.3, y, s);
      arrow(g, w * 0.42, y, w * 0.58, y);
      WsBoard.drawGem(g, 'A', w * 0.7, y, s);
    },
    urgent(g, w, h) {
      const cw = h * 0.78, ch = h * 0.8, x = (w - cw) / 2, y = (h - ch) / 2;
      roundRect(g, x, y, cw, ch, 10);
      g.fillStyle = '#fbf4e2'; g.fill();
      g.lineWidth = 2; g.strokeStyle = '#b8862f'; g.stroke();
      WsBoard.drawGem(g, 'R', w / 2, y + ch * 0.45, ch * 0.55);
      g.fillStyle = '#c0392b';
      g.fillRect(x - 6, y + ch * 0.78, cw + 12, ch * 0.2);
      hourglass(g, w / 2 - ch * 0.1, y + ch * 0.88, ch * 0.15, '#fff3dc');
      g.fillStyle = '#fff3dc';
      g.font = `900 ${Math.round(ch * 0.16)}px ${FONT}`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('6', w / 2 + ch * 0.1, y + ch * 0.89);
    },
    lock(g, w, h) {
      Fx.drawKey(g, w * 0.34, h / 2, h * 0.5);
      arrow(g, w * 0.45, h / 2, w * 0.56, h / 2);
      Fx.drawPadlock(g, w * 0.68, h / 2, h * 0.55);
    },
    gold(g, w, h) {
      const s = Math.min(h * 0.5, w * 0.18);
      g.save();                                   // овальное свечение, гаснет до краёв холста
      g.translate(w / 2, h / 2); g.scale(2, 1);
      const glow = g.createRadialGradient(0, 0, 0, 0, 0, h * 0.5);
      glow.addColorStop(0, 'rgba(255,214,110,0.55)'); glow.addColorStop(1, 'rgba(255,214,110,0)');
      g.fillStyle = glow; g.fillRect(-w / 4, -h / 2, w / 2, h);
      g.restore();
      for (let i = 0; i < 4; i++) WsBoard.drawGem(g, GOLD, w / 2 + (i - 1.5) * s * 0.95, h / 2 + (i % 2 ? 4 : -4), s);
    }
  };

  function drawHardArt(g, w, h) {
    const glow = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h * 0.6);
    glow.addColorStop(0, 'rgba(255,214,110,0.5)'); glow.addColorStop(1, 'rgba(255,214,110,0)');
    g.fillStyle = glow; g.fillRect(0, 0, w, h);
    hourglass(g, w / 2 - h * 0.42, h * 0.44, h * 0.62, '#b07c22');
    g.font = `900 ${Math.round(h * 0.5)}px ${FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.lineWidth = h * 0.06; g.strokeStyle = '#fff6e0';
    g.strokeText(String(L.limit), w / 2 + h * 0.2, h * 0.46);
    g.fillStyle = '#c2334f';
    g.fillText(String(L.limit), w / 2 + h * 0.2, h * 0.46);
    g.font = `800 ${Math.round(h * 0.15)}px ${FONT}`;
    g.fillStyle = '#6b4a2a';
    g.fillText(plural(L.limit, 'ход', 'хода', 'ходов'), w / 2 + h * 0.2, h * 0.86);
  }

  /* Песочные часы: золотые перекладины, стекло, песок. s — высота. */
  function hourglass(g, x, y, s, rim) {
    const w = s * 0.62, t = s / 2;
    g.save();
    g.translate(x, y);
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(-w * 0.42, -t * 0.9);
    g.bezierCurveTo(-w * 0.42, -t * 0.2, -w * 0.06, -t * 0.12, -w * 0.06, 0);
    g.bezierCurveTo(-w * 0.06, t * 0.12, -w * 0.42, t * 0.2, -w * 0.42, t * 0.9);
    g.lineTo(w * 0.42, t * 0.9);
    g.bezierCurveTo(w * 0.42, t * 0.2, w * 0.06, t * 0.12, w * 0.06, 0);
    g.bezierCurveTo(w * 0.06, -t * 0.12, w * 0.42, -t * 0.2, w * 0.42, -t * 0.9);
    g.closePath();
    g.fillStyle = 'rgba(238,248,252,0.92)'; g.fill();
    g.lineWidth = Math.max(1, s * 0.05); g.strokeStyle = '#7a5a8a'; g.stroke();
    g.fillStyle = '#f0b43c';
    g.beginPath(); g.moveTo(-w * 0.3, t * 0.86); g.quadraticCurveTo(0, t * 0.2, w * 0.3, t * 0.86); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-w * 0.26, -t * 0.5); g.lineTo(w * 0.26, -t * 0.5); g.lineTo(0, -t * 0.14); g.closePath(); g.fill();
    g.strokeStyle = rim; g.lineWidth = s * 0.1;
    g.beginPath(); g.moveTo(-w * 0.55, -t * 0.95); g.lineTo(w * 0.55, -t * 0.95); g.stroke();
    g.beginPath(); g.moveTo(-w * 0.55, t * 0.95); g.lineTo(w * 0.55, t * 0.95); g.stroke();
    g.restore();
  }

  function arrow(g, x0, y0, x1, y1) {
    g.save();
    g.strokeStyle = '#b8862f'; g.fillStyle = '#b8862f'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 - 6, y1); g.stroke();
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - 9, y1 - 6); g.lineTo(x1 - 9, y1 + 6); g.closePath(); g.fill();
    g.restore();
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  // картинка окна шкатулки: открытая шкатулка (chest_open), из неё поднимается образец нового убранства
  function chestPic(id) {
    return '<div class="ws-chest is-open ws-chest-big">' +
      '<span class="ws-chest-prize" style="background:' + (SWATCH[id] || '#fff') + '"></span></div>';
  }


  /* ---------- меню: витрина коллекций и убранство ---------- */
  function nextLevelIdx() {
    const i = LEVELS.findIndex((l, k) => !isPassed(k));
    if (i >= 0) return i;
    const j = LEVELS.findIndex(l => (Store.data.stars[l.id] || 0) < 3);
    return j >= 0 ? j : 0;
  }

  function renderMenu() {
    shownCoins = Store.data.coins;
    renderCoins(false);
    const cur = restoreGame(Store.data.cur);
    let idx, word;
    if (cur) {
      idx = cur.idx;
      word = 'Продолжить';
      $('ws-play-note').textContent = 'Уровень ' + LEVELS[cur.idx].id + ' · ' + LEVELS[cur.idx].name + ' · ' + movesWord(cur.moves);
    } else {
      const all = LEVELS.every((l, i) => isPassed(i));
      idx = nextLevelIdx();
      const nx = LEVELS[idx];
      word = all ? 'Играть' : (Object.keys(Store.data.stars).length ? 'Дальше' : 'Играть');
      $('ws-play-note').textContent = all
        ? 'Все изделия готовы — соберите три звезды: уровень ' + nx.id
        : 'Уровень ' + nx.id + ' · ' + nx.name + (nx.hard ? ' · Сложный заказ' : '');
    }
    $('ws-play-word').textContent = word;
    $('ws-play-n').textContent = String(LEVELS[idx].id);
    $('btn-play').setAttribute('aria-label', word + ': уровень ' + LEVELS[idx].id);
    renderMap(idx);
    renderDecor();
  }

  /* ---------- карта (образ — ref/workshop/concept/03_map.jpeg) ----------
     Места на дорожке снизу вверх: пять уровней коллекции, затем её шкатулка.
     Дорожка — синусоида через места; у каждой начатой коллекции на пьедестале
     стоит последнее готовое изделие; героиня — рядом с уровнем кнопки «Играть». */
  const MAP = { step: 80, top: 132, bottom: 150, k: 0.8, phase: 0.6 };
  const HARD_SVG = '<svg viewBox="0 0 24 24"><path d="M6 3h12M6 21h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M7.5 3.8c0 4.4 4.5 5.6 4.5 8.2s-4.5 3.8-4.5 8.2h9c0-4.4-4.5-5.6-4.5-8.2s4.5-3.8 4.5-8.2z" fill="#fff4f6"/></svg>';
  let mapIdx = 0;          // уровень у героини (перерисовка карты при повороте экрана)

  function smoothPath(p) {   // Катмулл — Ром через точки -> кубические кривые
    const f = (v) => v.toFixed(1);
    let d = 'M' + f(p[0].x) + ' ' + f(p[0].y);
    for (let k = 0; k < p.length - 1; k++) {
      const a = p[k - 1] || p[k], b = p[k], c = p[k + 1], e = p[k + 2] || c;
      d += ' C' + [b.x + (c.x - a.x) / 6, b.y + (c.y - a.y) / 6, c.x - (e.x - b.x) / 6, c.y - (e.y - b.y) / 6, c.x, c.y].map(f).join(' ');
    }
    return d;
  }

  function renderMap(playIdx) {
    if (playIdx == null) playIdx = mapIdx; else mapIdx = playIdx;
    const track = $('ws-map-track'), map = $('ws-map');
    track.innerHTML = '';
    const slots = [];
    COLLECTIONS.forEach((c, ci) => {
      const lv = collLevels(ci);
      if (!lv.length) return;
      lv.forEach((l, k) => slots.push({ i: ci * PER_COLL + k }));
      slots.push({ ci });
    });
    const W = track.clientWidth || Math.min(innerWidth, 480);
    const H = MAP.top + (slots.length - 1) * MAP.step + MAP.bottom;
    track.style.height = H + 'px';
    const amp = Math.min(W * 0.27, 140);
    const wave = (s) => Math.sin(s * MAP.k + MAP.phase);
    const at = (s) => ({ x: W / 2 + amp * wave(s), y: H - MAP.bottom - s * MAP.step });
    const curSlot = Math.max(0, slots.findIndex(sl => sl.i === playIdx));
    const firstOpen = LEVELS.findIndex((l, i) => !isPassed(i));
    const draws = [];

    // дорожка: свечение, кромка, светлое полотно, пройденная часть теплее
    const pts = [];
    for (let s = -2; s <= slots.length; s++) pts.push(at(s));
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'ws-map-path');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('aria-hidden', 'true');
    const full = smoothPath(pts), done = smoothPath(pts.slice(0, curSlot + 3));
    [['glow', full], ['edge', full], ['body', full], ['done', done]].forEach(([cls, d]) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('class', 'p-' + cls);
      p.setAttribute('d', d);
      svg.appendChild(p);
    });
    track.appendChild(svg);

    // пьедесталы: последнее готовое изделие коллекции, напротив самого дальнего изгиба
    COLLECTIONS.forEach((c, ci) => {
      const lv = collLevels(ci).filter(l => Store.data.stars[l.id]).pop();
      if (!lv) return;
      const s0 = ci * (PER_COLL + 1);
      let best = s0;
      for (let s = s0; s < s0 + PER_COLL; s++) if (Math.abs(wave(s)) > Math.abs(wave(best))) best = s;
      const side = wave(best) > 0 ? -1 : 1;
      const ped = document.createElement('div');
      ped.className = 'ws-ped';
      ped.setAttribute('aria-hidden', 'true');
      ped.style.left = (W / 2 + side * amp * 0.92) + 'px';
      ped.style.top = at(best).y + 'px';
      const cv = document.createElement('canvas');
      cv.className = 'ws-ped-art';
      ped.appendChild(cv);
      track.appendChild(ped);
      draws.push(() => {
        const { g, w, h } = sizeCanvas(cv);
        WsJewel.draw(g, lv.piece, lv.orders.length, lv.orders, { x: 2, y: 2, w: w - 4, h: h - 4 }, { drawGem: WsBoard.drawGem, closeup: 3.2 });
      });
    });

    slots.forEach((sl, s) => {
      const p = at(s);
      if (sl.ci != null) {
        const b = chestButton(sl.ci);
        b.style.left = p.x + 'px';
        b.style.top = p.y + 'px';
        track.appendChild(b);
        return;
      }
      const i = sl.i, lv = LEVELS[i];
      const done = isPassed(i), open = isOpen(i);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-node' + (done ? ' is-done' : open ? ' is-next' : ' is-locked') +
        (lv.hard ? ' is-hard' : '') + (lv.id === justWon ? ' is-new' : '') + (i === playIdx ? ' is-current' : '');
      b.style.left = p.x + 'px';
      b.style.top = p.y + 'px';
      const n = document.createElement('span');
      n.className = 'ws-node-n';
      n.textContent = String(lv.id);
      b.appendChild(n);
      if (done) {
        const k3 = Store.data.stars[lv.id];
        const st3 = document.createElement('span');
        st3.className = 'ws-node-stars';
        st3.dataset.n = String(k3);
        for (let k = 0; k < 3; k++) st3.appendChild(Object.assign(document.createElement('i'), { className: k < k3 ? 'on' : '' }));
        b.appendChild(st3);
      }
      if (lv.hard) b.insertAdjacentHTML('beforeend', '<span class="ws-node-hard" aria-hidden="true">' + HARD_SVG + '</span>');
      b.setAttribute('aria-label', 'Уровень ' + lv.id + ': ' + lv.name +
        (done ? ', пройден, звёзд ' + Store.data.stars[lv.id] + ', лучший результат ' + movesWord(Store.data.best[lv.id]) : open ? ', открыт' : ', закрыт') +
        (lv.hard ? ', сложный заказ' : ''));
      b.addEventListener('click', () => {
        if (!isOpen(i)) { sfx('invalid'); toast('Сначала уровень ' + LEVELS[Math.max(0, firstOpen)].id, 1800); return; }
        sfx('click');
        startLevel(i);
      });
      track.appendChild(b);
      if (i === playIdx) {
        // героиня сбоку от значка: у края — к середине, на переходе — против хода дорожки
        const nx = at(s + 1).x;
        const side = Math.abs(p.x - W / 2) > amp * 0.5 ? (p.x > W / 2 ? -1 : 1) : (nx > p.x ? -1 : 1);
        const me = document.createElement('span');
        me.className = 'ws-map-me ' + (side < 0 ? 'is-left' : 'is-right');
        me.setAttribute('aria-hidden', 'true');
        me.style.left = (p.x + side * 64) + 'px';   // остриё булавки — у края значка
        me.style.top = (p.y + 10) + 'px';
        track.appendChild(me);
      }
    });
    draws.forEach(d => d());
    justWon = 0;
    map.scrollTop = Math.max(0, at(curSlot).y - map.clientHeight * 0.58);
  }

  function chestButton(ci) {
    const b = document.createElement('button');
    b.type = 'button';
    const done = collDone(ci), opened = !!Store.data.chests[ci];
    b.className = 'ws-chest' + (opened ? ' is-open' : done ? ' is-ready' : ' is-locked');
    const c = COLLECTIONS[ci];
    b.setAttribute('aria-label', 'Шкатулка коллекции «' + c.name + '»: ' + (opened ? 'открыта, в ней было «' + decorName(c.decor[0], c.decor[1]) + '»' : done ? 'можно открыть' : 'пройдите все пять уровней коллекции'));
    b.addEventListener('click', () => {
      if (opened) { sfx('click'); openDecor(); return; }
      if (!done) {
        sfx('invalid');
        const left = PER_COLL - collCount(ci);
        toast('Ещё ' + left + ' ' + plural(left, 'уровень', 'уровня', 'уровней'), 1800);
        return;
      }
      openChest(ci);
    });
    return b;
  }

  function openChest(ci) {
    if (!collDone(ci) || Store.data.chests[ci]) return;
    const c = COLLECTIONS[ci];
    const [kind, id] = c.decor;
    Store.data.chests[ci] = true;
    Store.data.coins += c.coins;
    Store.data.decor[kind] = id;           // новое убранство сразу на столе
    Store.save();
    applyDecor();
    sfx('reward');
    buzz([30, 40, 30]);
    Confetti.burst({ count: 80, durationMs: 2600, colors: CONFETTI });
    track('chest', { collection: ci, coins: c.coins, decor: id });
    renderMenu();
    showModal({
      kicker: '«' + c.name + '»', title: 'Шкатулка открыта!', coins: c.coins,
      sr: coinsWord(c.coins) + ' и новое убранство «' + decorName(kind, id) + '»',
      pic: chestPic(id), ok: 'Красота!', okIcon: true
    });
    bump($('ws-menu-coins'));
  }

  const DECOR_ICON = {
    cloth: '<svg viewBox="0 0 24 24"><path d="M2.5 9.5h19l-1.6 3.2H4.1z" fill="#d79a5a" stroke="#8a4a1c" stroke-width="1.3" stroke-linejoin="round"/><path d="M6 12.7v7.3M18 12.7v7.3" stroke="#8a4a1c" stroke-width="2.2" stroke-linecap="round"/><path d="M5 9.5c1-2.6 2.6-3.6 7-3.6s6 1 7 3.6" fill="#f2a7bd" stroke="#b5527a" stroke-width="1.2"/></svg>',
    tube: '<svg viewBox="0 0 24 24"><path d="M8.5 2.8h7" stroke="#b98226" stroke-width="2.4" stroke-linecap="round"/><path d="M9.6 3.6v14.2a2.4 2.4 0 0 0 4.8 0V3.6" fill="rgba(255,255,255,0.75)" stroke="#9a6a8a" stroke-width="1.5"/><path d="M9.6 12.6h4.8v5.2a2.4 2.4 0 0 1-4.8 0z" fill="#f0507f"/></svg>'
  };
  let decorOpen = false;

  function renderDecor() {
    const box = $('ws-decor');
    box.innerHTML = '';
    [['cloth', 'Стол'], ['tube', 'Стекло']].forEach(([kind, label]) => {
      const row = document.createElement('div');
      row.className = 'ws-decor-row';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', label);
      const ico = document.createElement('span');
      ico.className = 'ws-decor-ico';
      ico.setAttribute('aria-hidden', 'true');
      ico.innerHTML = DECOR_ICON[kind];
      row.appendChild(ico);
      DECOR[kind].forEach(d => {
        const b = document.createElement('button');
        b.type = 'button';
        const own = owns(kind, d.id), on = Store.data.decor[kind] === d.id;
        b.className = 'ws-decor-chip' + (on ? ' is-on' : '') + (own ? '' : ' is-locked');
        const sw = document.createElement('span');
        sw.className = 'ws-swatch';
        sw.style.background = SWATCH[d.id];
        b.appendChild(sw);
        if (!own) b.insertAdjacentHTML('beforeend', '<span class="ws-decor-lock" aria-hidden="true"></span>');
        b.title = d.name;
        const src = COLLECTIONS.find(c => c.decor[0] === kind && c.decor[1] === d.id);
        b.setAttribute('aria-label', d.name + (on ? ', выбрано' : own ? '' : ', в шкатулке «' + (src ? src.name : '') + '»'));
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.addEventListener('click', () => {
          if (!own) { sfx('invalid'); toast('В шкатулке «' + (src ? src.name : '') + '»', 2000); return; }
          sfx('click');
          Store.data.decor[kind] = d.id;
          Store.save();
          applyDecor();
          renderDecor();
          toast(d.name, 1200);
        });
        row.appendChild(b);
      });
      box.appendChild(row);
    });
  }

  function openDecor() {
    renderDecor();
    $('decor-overlay').classList.remove('hidden');
    decorOpen = true;
    setTimeout(() => { if (decorOpen) $('btn-decor-ok').focus(); }, 60);
  }
  function closeDecor() {
    if (!decorOpen) return;
    decorOpen = false;
    $('decor-overlay').classList.add('hidden');
    $('btn-decor').focus();
  }

  function applyDecor() {
    const b = document.body;
    DECOR.cloth.forEach(d => b.classList.toggle('cloth-' + d.id, d.id !== 'walnut' && Store.data.decor.cloth === d.id));
    WsBoard.setTube(Store.data.decor.tube);
  }

  /* Открыть уровень: если именно он сохранён незаконченным — продолжить. */
  function startLevel(i) {
    const cur = restoreGame(Store.data.cur);
    loadLevel(i, cur && cur.idx === i ? cur : null);
  }

  function applyMute() {
    Sound.setMuted(Store.data.muted);
    ['btn-sound', 'btn-sound-game'].forEach(id => { if ($(id)) $(id).setAttribute('aria-pressed', Store.data.muted ? 'true' : 'false'); });
  }

  /* ---------- запуск ---------- */
  function init() {
    Store.load();
    Store.data.sessions++;
    Store.save();
    track('session_start', { sessions: Store.data.sessions, coins: Store.data.coins, passed: Object.keys(Store.data.stars).length });
    // атлас камней, картинки изделий и руки приходят после запуска: перерисовать то, что на виду
    let artRaf = 0;
    const redrawArt = () => {
      if (artRaf) return;
      artRaf = requestAnimationFrame(() => {
        artRaf = 0;
        if (screen === 'menu') renderMap(); else Piece.request();
        if (!$('win-overlay').classList.contains('hidden')) drawWinJewel(0);
      });
    };
    const atlasUrl = (document.querySelector('link[rel="preload"][as="image"]') || {}).href || 'workshop_assets/gems.webp';
    const assets = atlasUrl.replace(/[^/]*$/, '');
    WsBoard.init($('board-canvas'), {
      spriteOf: (t) => (GEMS[t] ? GEMS[t].sprite : 0),
      colorOf: (t) => (GEMS[t] ? GEMS[t].color : '#c33'),
      atlasUrl,
      onAtlas: redrawArt
    });
    WsJewel.load(assets, redrawArt);
    // радостные лица и героини победы — заранее, чтобы не появлялись с задержкой
    if (typeof Image !== 'undefined') {
      FACES.map(f => 'face_' + f + '_joy').concat(['hero_bride', 'hero_curly', 'hero_grandma'])
        .forEach(n => { new Image().src = assets + n + '.webp'; });
    }
    Fx.init($('fx-canvas'));
    Piece.init($('ws-piece'));
    Confetti.init($('confetti-canvas'));
    applyDecor();

    // ввод по полю: pointer-события покрывают мышь и касания
    const cv = $('board-canvas');
    let downX = 0, downY = 0;
    cv.addEventListener('pointerdown', (ev) => { downX = ev.clientX; downY = ev.clientY; });
    cv.addEventListener('pointerup', (ev) => {
      if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 12) return; // свайп — не касание
      tapVial(WsBoard.hitTest(ev.clientX, ev.clientY));
    });
    document.addEventListener('keydown', (ev) => {
      if (decorOpen && !modalOpen) {
        if (ev.key === 'Escape') { ev.preventDefault(); sfx('click'); closeDecor(); }
        return;
      }
      if (modalOpen) {
        if (ev.key === 'Enter' || ev.key === 'Escape' || ev.key === ' ') { ev.preventDefault(); closeModal(); }
        return;
      }
      if (screen !== 'game' || won) return;
      if (lost) { if (ev.key === 'z' || ev.key === 'я' || ev.key === 'Backspace') undo(); return; }
      if (/^[1-9]$/.test(ev.key)) tapVial(+ev.key - 1);
      else if (ev.key === '0') tapVial(9);
      else if (ev.key === 'Escape') tapVial(-1);
      else if (ev.key === 'z' || ev.key === 'я' || ev.key === 'Backspace') undo();
      else if (ev.key === 'h' || ev.key === 'р') onHint();
    });

    $('btn-play').addEventListener('click', () => {
      sfx('click');
      const cur = restoreGame(Store.data.cur);
      if (cur) loadLevel(cur.idx, cur);
      else loadLevel(nextLevelIdx());
    });
    $('btn-back').addEventListener('click', () => { sfx('click'); leaveToMenu(); });
    $('btn-undo').addEventListener('click', undo);
    $('btn-restart').addEventListener('click', restart);
    $('btn-hint').addEventListener('click', onHint);
    $('btn-rescue').addEventListener('click', onRescue);
    $('btn-next').addEventListener('click', nextFromWin);
    $('btn-again').addEventListener('click', () => { sfx('click'); track('again', { level: L.id }); loadLevel(levelIdx); });
    $('btn-win-menu').addEventListener('click', () => { sfx('click'); leaveToMenu(); });
    $('btn-more').addEventListener('click', buyMoves);
    $('btn-lose-undo').addEventListener('click', undo);
    $('btn-lose-again').addEventListener('click', () => { lost && restart(); });
    $('btn-modal-ok').addEventListener('click', () => closeModal());
    $('btn-decor').addEventListener('click', () => { sfx('click'); openDecor(); });
    $('btn-decor-ok').addEventListener('click', () => { sfx('click'); closeDecor(); });
    $('decor-overlay').addEventListener('click', (ev) => { if (ev.target === $('decor-overlay')) { sfx('click'); closeDecor(); } });
    $('ws-menu-coins').addEventListener('click', () => toast('Монеты — за заказы', 1800));
    $('ws-coins').addEventListener('click', () => toast('Монеты — за заказы', 1800));
    ['btn-sound', 'btn-sound-game'].filter(id => $(id)).forEach(id => $(id).addEventListener('click', () => {
      Store.data.muted = !Store.data.muted;
      Store.save();
      applyMute();
      sfx('click');
    }));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) Sound.suspend('hidden'); else Sound.resume('hidden');
    });
    let resizeRaf = 0;
    window.addEventListener('resize', () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        Fx.resize();
        if (screen === 'game') { WsBoard.resize(); Piece.resize(); updateGuide(); }
        if (screen === 'menu') renderMap();
        if (!$('win-overlay').classList.contains('hidden')) drawWinJewel(0);
      });
    });

    // штамп сборки (build_workshop.py подставляет значение в meta)
    const meta = document.querySelector('meta[name="ws-build"]');
    if (meta && meta.content && meta.content !== 'dev') {
      const b = document.createElement('div');
      b.className = 'build-badge';
      b.textContent = meta.content;
      document.body.appendChild(b);
    }

    applyMute();
    showScreen('screen-menu');
    renderMenu();
    // ?level=N — открыть уровень сразу (проверки и отладка; замок не действует)
    const q = /[?&]level=(\d+)/.exec(location.search);
    if (q && LEVELS[+q[1] - 1]) loadLevel(+q[1] - 1);
  }

  /* Сводка ритма по журналу событий: пауза между выдачами (в ходах),
     доля «Дальше» после победы, каскады. */
  window.__wsMetrics = () => {
    const ev = window.__wsEvents;
    const del = ev.filter(e => e.event === 'delivery');
    const gaps = del.filter(e => e.chain === 1).map(e => e.gap).sort((a, b) => a - b);
    const wins = ev.filter(e => e.event === 'win').length;
    const nexts = ev.filter(e => e.event === 'next').length;
    return {
      deliveries: del.length,
      medianGap: gaps.length ? gaps[Math.floor(gaps.length / 2)] : null,
      maxGap: gaps.length ? gaps[gaps.length - 1] : null,
      wins, nextShare: wins ? +(nexts / wins).toFixed(2) : null,
      levelsPerSession: wins,
      cascades: del.filter(e => e.chain >= 2).length
    };
  };

  // Узкий интерфейс для автотестов (только чтение; игру не меняет).
  window.__ws = {
    state() {
      const typeOf = (o) => (o >= 0 ? st.orders[o] : null);
      return {
        screen, level: L && L.id,
        vials: st && st.vials.map(v => v.join('')),
        slots: st && st.slots.map(typeOf),
        queue: st && st.orders.slice(st.next),
        delivered: st && st.delivered, total: st && st.orders.length,
        view: view && { slots: view.slots.map(typeOf), delivered: view.delivered, next: view.next },
        won, lost, winCount, levelWins, busy, sel, moves, undoDepth: hist.length,
        rescue: rescueK, hint: hintMv, waiting: st ? waitingVials() : [],
        caption: $('ws-caption').textContent,
        best: L ? Store.data.best[L.id] || null : null,
        stars: L ? Store.data.stars[L.id] || 0 : 0,
        liveStars: L ? starsFor(moves) : 0,
        coins: Store.data.coins, shownCoins,
        limit: limitNow(), urgentLeft: st ? urgentLeft() : null,
        hid: st && st.hid.slice(), locked: st ? R.lockedVial(st) : -1,
        pieceGems: pieceGems.slice(), modal: modalOpen,
        modalTitle: modalOpen ? $('ws-modal-title').textContent : '',
        passed: Object.keys(Store.data.stars).length, chests: Object.keys(Store.data.chests).map(Number),
        decor: Object.assign({}, Store.data.decor)
      };
    },
    vialCenter(i) {
      const r = WsBoard.vialClientRect(i);
      return r && { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
    },
    solution() { return L ? L.solution.map(m => [m.from, m.to]) : null; },
    layout() { return WsBoard.layout(); },
    atlasReady() { return WsBoard.atlasReady(); },
    levels() { return LEVELS.map(l => ({ id: l.id, piece: l.piece, hard: l.hard, limit: l.limit, par: l.par, s3: l.s3, s2: l.s2, novelty: l.novelty })); },
    productId: PRODUCT_ID, saveKey: SAVE_KEY
  };

  init();
})();
