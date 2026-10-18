/* ============================================================
   workshop.js — «Ювелир Ленд»: контроллер.
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
   Без энергии и таймеров; уровни играются без сети.

   Площадка — WSPlatform (workshop_platform.js): старт, сейв, пауза,
   реклама, покупки. Сейв v4 под ключом SAVE_KEY — формат и проверки в
   workshop_save.js, читается и пишется только через WSPlatform.
   Реклама (настройки WS_CONFIG.ads): баннер внизу на карте и поле
   (телефон, портрет), межстраничная только по «Дальше» после победы,
   видео за награду — «×2», «+5 ходов», подсказка. «Без рекламы» за голоса
   и Королевский набор: выдача только по строкам журнала покупок.
   Аналитика — WSAnalytics (workshop_analytics.js): журнал window.__wsEvents
   и Метрика; сводка __wsMetrics().
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
  const NOADS_FROM_LEVEL = 7;             // предложение «Без рекламы» в окне победы — с 7-го уровня
  const PER_COLL = 5;

  const COLLECTIONS = [
    { name: 'Весна', coins: 100, decor: ['cloth', 'emerald'] },
    { name: 'Море', coins: 150, decor: ['tube', 'sea'] },
    { name: 'Сад', coins: 150, decor: ['cloth', 'wine'] },
    { name: 'Звёзды', coins: 200, decor: ['tube', 'rose'] },
    { name: 'Осень', coins: 200, decor: ['cloth', 'navy'] },
    { name: 'Королевский бал', coins: 300, decor: ['tube', 'royal'] },
    // глава 2 (уровни 31–60): монеты (их тратят в лавке); вещь — только в последней шкатулке (B3, docs/WORKSHOP.md «Экономика»)
    { name: 'Лунный свет', coins: 300, decor: null },
    { name: 'Венеция', coins: 350, decor: null },
    { name: 'Сакура', coins: 350, decor: null },
    { name: 'Северное сияние', coins: 400, decor: null },
    { name: 'Зимняя сказка', coins: 450, decor: null },
    { name: 'Бриллиантовый юбилей', coins: 500, decor: ['pedestal', 'marble'] }
  ];
  /* Убранство мастерской — ОДНА таблица на всё (точка расширения лавки).
     Первый вариант вида — по умолчанию, есть у всех. Остальные — из шкатулки
     коллекции (COLLECTIONS[].decor), из набора (set: 'royal' — Королевский
     набор за покупку «Без рекламы» на 30/365 дней) или из Store.data.owned
     ('<вид>:<id>': 1 — лавка). Как вариант выглядит:
     cloth    — бархат под стойками: velvet [центр, середина, край] и rim (кант),
                у ореха velvet нет; на body ставится класс cloth-<id>;
     tube     — стекло пробирок: tint/rim (r,g,b) для WsBoard.setTube;
     cushion  — подушка изделия на поле, pedestal — тумба на карте: картинка
                workshop_assets/<img>.webp (CSS-переменные --ws-cushion/--ws-pedestal).
     swatch — образец в окне убранства и в шкатулке.
     price  — цена в лавке (монеты, 1000–3000, workshop_shop.js). У каждой вещи ровно
              один источник: шкатулка, лавка (price) или набор (set). */
  const DECOR = {
    cloth: [
      { id: 'walnut', name: 'Ореховый стол', swatch: '#5a3a1f' },
      { id: 'emerald', name: 'Изумрудный бархат', swatch: '#1f6b4d', velvet: ['#3aa27a', '#23795a', '#144a37'] },
      { id: 'wine', name: 'Винный бархат', swatch: '#74203a', velvet: ['#b8406a', '#8a2850', '#4e1430'] },
      { id: 'navy', name: 'Синий бархат', swatch: '#22346a', velvet: ['#4a66b8', '#2e4485', '#18244e'] },
      { id: 'blush', name: 'Пудровый бархат', swatch: '#c26f8c', velvet: ['#eaa6bc', '#c97391', '#8a3c5a'], price: 1400 },
      { id: 'noir', name: 'Чёрный бархат', swatch: '#2b2631', velvet: ['#55505e', '#2f2a36', '#121016'], price: 1800 },
      { id: 'royal', name: 'Королевский бархат', swatch: '#5a2380', set: 'royal',
        velvet: ['#8e4cc0', '#5f2788', '#2e0f4a'], rim: 'rgba(255, 206, 92, 0.95)' }
    ],
    tube: [
      { id: 'clear', name: 'Прозрачное стекло', swatch: '#f4ecdc', tint: '255,250,252', rim: '255,255,255' },
      { id: 'sea', name: 'Морское стекло', swatch: '#8fe0d8', tint: '170,240,230', rim: '215,255,248' },
      { id: 'rose', name: 'Розовое стекло', swatch: '#f2a7bd', tint: '255,196,214', rim: '255,226,236' },
      { id: 'royal', name: 'Королевское стекло', swatch: '#b49cf0', tint: '210,184,255', rim: '255,232,170' },
      { id: 'sky', name: 'Голубое стекло', swatch: '#b4d4fa', tint: '186,216,255', rim: '226,240,255', price: 1000 },
      { id: 'mint', name: 'Мятное стекло', swatch: '#b4eec4', tint: '196,248,212', rim: '230,255,236', price: 1200 },
      { id: 'crystal', name: 'Королевский хрусталь', swatch: '#f3d27a', tint: '255,228,165', rim: '255,198,72', set: 'royal' }
    ],
    cushion: [
      { id: 'classic', name: 'Бархатная подушка', img: 'cushion' },
      { id: 'lavender', name: 'Лавандовая подушка', img: 'cushion_lavender', price: 1500 },
      { id: 'peach', name: 'Персиковая подушка', img: 'cushion_peach', price: 1600 },
      { id: 'mint', name: 'Мятная подушка', img: 'cushion_mint', price: 1700 },
      { id: 'black', name: 'Чёрная подушка', img: 'cushion_black', price: 2500 },
      { id: 'royal', name: 'Королевская подушка', img: 'cushion_royal', set: 'royal' }
    ],
    pedestal: [
      { id: 'classic', name: 'Бархатная тумба', img: 'pedestal' },
      { id: 'marble', name: 'Мраморная тумба', img: 'pedestal_marble' },
      { id: 'mint', name: 'Мятная тумба', img: 'pedestal_mint', price: 3000 },
      { id: 'royal', name: 'Королевский пьедестал', img: 'pedestal_royal', set: 'royal' }
    ]
  };
  const decorItem = (kind, id) => (DECOR[kind] || []).find(d => d.id === id) || null;
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

  /* Звук и вибрация: сбой не должен ломать игру. Вибрация — только лёгкий
     отклик на победу (решение основателя 12.10.2026), выключается кнопкой на
     карте (Store.data.novibe); кнопка видна на сенсорных экранах. */
  function sfx(id, opts) { try { Sound.play(id, opts); } catch (e) { /* без звука */ } }
  function vibrateWin() {
    if (Store.data.novibe) return;
    try { WSPlatform.vibrate(); } catch (e) { /* нет вибрации */ }
  }
  const canVibrate = (() => {
    try { return matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0; } catch (e) { return false; }
  })();

  /* ---------- сохранение ----------
     Формат v4, проверка каждого поля и миграции — workshop_save.js
     (WorkshopSave), договор полей — docs/WORKSHOP.md «Сохранение».
     Сейв читается и пишется только через WSPlatform: loadSave() при старте,
     writeSave() на каждое изменение, flush() в конце уровня и после выдачи
     покупки. Убранство из шкатулок не хранится — выводится из chests. */
  const FTUE_ALL = WSAnalytics.FTUE_STEPS.reduce((m, s) => m | (1 << s[0]), 0);
  function saveCtx() {
    return {
      levels: LEVELS.map(l => l.id), novelty: Object.keys(NOVELTY).concat('hard'), perColl: PER_COLL,
      collections: COLLECTIONS, decor: DECOR, gems: Object.keys(GEMS),
      restoreCur: (c) => !!restoreGame(c), today: WSAnalytics.dayNumber(), ftueAll: FTUE_ALL,
      metals: WsJewel.METALS, shapes: shapesCtx()   // B2: металлы и формы выбора (pieces, choice)
    };
  }
  const intIn = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;

  /* Сейв MVP (ключ OLD_KEY, до слоя площадки) — единственное прямое чтение
     localStorage: из него берётся только «звук выключен», когда своего сейва
     ещё нет. Сам ключ не стирается. */
  function readOldMuted() {
    try {
      const old = JSON.parse(window.localStorage.getItem(OLD_KEY) || 'null');
      return !!(old && typeof old === 'object' && old.muted === true);
    } catch (e) { return false; }
  }

  const Store = {
    ctx: saveCtx(),
    data: null,
    // raw — ответ WSPlatform.loadSave(): null — нового игрока (или сейва нет)
    load(raw) {
      this.ctx = saveCtx();
      this.data = WorkshopSave.normalize(raw, this.ctx, raw == null ? readOldMuted() : false);
    },
    save() {
      try { WSPlatform.writeSave(this.data); } catch (e) { /* сейв не роняет игру */ }
    },
    // записать и сразу дописать облако (конец уровня, выдача покупки)
    flush() {
      this.save();
      try { return WSPlatform.flush(); } catch (e) { return Promise.resolve(false); }
    }
  };
  Store.data = WorkshopSave.fresh(Store.ctx);

  function packState(s) {
    return { v: s.vials.map(v => v.join('')), s: s.slots.slice(), n: s.next, d: s.delivered, hd: s.hid.slice(), q: s.seq.slice() };
  }

  /* Проверка сохранённого состояния: те же камни, что в уровне, ровно по
     четыре на каждый невыданный заказ, карточки и очередь согласованы,
     тайных камней не больше, чем камней под верхним. Порядок выдач q
     (какой камень встал в изделие первым) — перестановка выданных заказов;
     в старом сейве его нет — тогда выданные по порядку очереди. */
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
    const done = [];
    for (let o = 0; o < p.n; o++) if (!active.has(o)) done.push(o);
    let seq = done;
    if (p.q !== undefined) {
      if (!Array.isArray(p.q) || p.q.length !== done.length) return null;
      if (p.q.some(o => !Number.isInteger(o) || done.indexOf(o) === -1) || new Set(p.q).size !== p.q.length) return null;
      seq = p.q.slice();
    }
    const s = {
      vials, orders: lv.orders.slice(), slots: p.s.slice(), next: p.n, delivered: p.d, hid,
      lock: lv.lock ? { vial: lv.lock.vial, order: lv.lock.order } : null, seq
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
      for (const e of c.h.slice(-HIST_SAVE)) {
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
  const owns = (kind, id) => WorkshopSave.owns(Store.data, Store.ctx, kind, id);
  function decorName(kind, id) { const d = decorItem(kind, id); return d ? d.name : id; }

  /* ---------- аналитика: журнал window.__wsEvents и Метрика (WSAnalytics) ----------
     Схема событий — docs/WORKSHOP_ANALYTICS.md §5. */
  function track(name, data) { WSAnalytics.event(name, data); }
  // секунды текущей попытки: пауза площадки (свернули, реклама, оплата) не считается
  const levelSec = () => Math.min(3600, Math.max(0, Math.round(((pauseAt || Date.now()) - levelT0) / 1000)));
  // шаги первых минут: каждый — один раз на игрока (маска flags.ftue в сейве)
  function ftueStep(step, name) {
    const bit = 1 << step;
    if (Store.data.flags.ftue & bit) return;
    Store.data.flags.ftue |= bit;
    Store.save();
    track('ftue_step', { step, name, level: L ? L.id : 0 });
  }
  function coinEarn(src, amount, level) {
    if (amount > 0) track('coin_earn', level ? { src, amount, level } : { src, amount });
  }

  /* ---------- состояние ---------- */
  let levelIdx = 0;
  let L = null;            // уровень (не меняется)
  let st = null;           // состояние правил — всегда уже окончательное
  let view = null;         // что показывают карточки (догоняет st по ходу анимации выдачи)
  let hist = [];           // снимки для отмены: { st, moves, kind, us, ld }
  let moves = 0;           // переливов в текущей линии партии
  let sel = -1;            // выбранная пробирка
  let busy = false;        // идут анимации хода (перелив или выдачи); касания держит только pouring
  /* G1: ход во время выдачи. Поле закрыто для касаний, только пока камни
     перелива летят в пробирку (pouring). Выдачи хода — работа в очереди jobs:
     вспышка, полёт к заказчице, печать, смена карточки; работы идут строго по
     порядку ходов (карточка выдачи — та, что вышла после предыдущей), а игрок
     тем временем ходит дальше. pend — пробирки, чьи выданные камни ещё стоят
     на поле: новый ход в такую пробирку сначала отправляет их заказчице (hurry). */
  let pouring = false;     // камни перелива ещё летят в пробирку
  let jobs = [];           // очередь выдач по ходам: { e, evs: [{ ev, pay, k, state, onArrive }] }
  let jobOn = false;       // работа из очереди сейчас доигрывает
  const pend = new Map();  // пробирка → выдача, чьи камни ещё на поле (state 'wait')
  let tapQueue = [];       // касания во время перелива (до двух — один ход), повторяются после приземления
  let won = false;
  let lost = false;        // «Сложный заказ»: ходы кончились
  let winCount = 0;        // побед за сессию (для проверок)
  let levelWins = 0;       // побед на текущем прохождении уровня — 0 или 1
  let epoch = 0;           // меняется при отмене/рестарте/выходе: опоздавшие колбэки отбрасываются
  let rescueK = null;      // null — победа достижима; число — сколько ходов вернуть; 0 — только «Заново»
  let hintMv = null;
  /* Перф 1.0: поиск (плашка спасения, подсказка) идёт кусочками и отменяется
     ходом, отменой, заново, сменой уровня/экрана и паузой (searchGuard). */
  let searchVersion = 0, checking = false, hintPending = 0, checkDone = null, recheck = false;
  const winCache = new Map();
  let tutorialKey = '', tutorialStep = null;
  function cancelSearch() { searchVersion++; checking = false; hintPending = 0; }
  function searchGuard() {
    const version = searchVersion, e = epoch, m = moves;
    return () => version !== searchVersion || e !== epoch || m !== moves || screen !== 'game' || !!pauseAt || document.hidden;
  }
  function rememberWin(s, value) {
    const key = R.stateKey(s);
    if (winCache.size >= 256 && !winCache.has(key)) winCache.delete(winCache.keys().next().value);
    winCache.set(key, value);
  }
  async function canWin(s, cancelled) {
    const key = R.stateKey(s);
    if (winCache.has(key)) return winCache.get(key);
    const result = await R.solveFastAsync(s, { cancelled, maxMs: 1500 });
    if (!result.capped && !result.cancelled) rememberWin(s, !!result.moves);
    return !!result.moves || !!result.capped;
  }
  let flash = null;        // временная подпись { text, until }
  let flashTimer = null;
  /* Отложенные переходы (выдачи, смена карточки, победа, «Новое!»…) — на часах игры
     WsBoard.clock: на паузе площадки стоят, после возврата доигрывают остаток. */
  const later = (fn, ms) => WsBoard.clock.later(fn, ms);
  const cancelLater = (t) => WsBoard.clock.cancel(t);
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
  let pieceGems = [];      // камни в изделии по порядку выдачи (длина — число заказов, null — ещё нет)
  let pendingUnlock = -1;  // ключ летит к этой пробирке — замок ещё виден
  let justWon = 0;         // id уровня, пройденного последним (значок на карте «выпрыгивает»)
  let modalOpen = false, modalOk = null;
  let winShineTimer = 0;
  let winShineRun = null;  // перезапуск блеска изделия после паузы площадки
  let levelT0 = 0;         // начало попытки (секунды уровня для аналитики; пауза площадки не считается)
  let pauseAt = 0;         // когда площадка поставила игру на паузу (0 — не на паузе)
  let booted = false;      // площадка готова, сейв прочитан, карта показана
  let hintOffered = -1;    // уровень, где подсказка за видео уже предложена (ad_offer раз за уровень)
  let nextBusy = false;    // «Дальше» ждёт межуровневую рекламу — повторное нажатие не считается

  /* ---------- площадка: «Без рекламы», видео за награду, баннер ----------
     Настройки — WS_CONFIG.ads (WSPlatform.config.ads), договор площадки —
     docs/WORKSHOP_PLATFORM.md, места и правила — docs/WORKSHOP.md «Реклама». */
  const VIDEO_NONE = 'Видео сейчас нет';
  let clockSkew = 0;       // часы сервера платежей минус часы устройства (entitlements().now)
  const adsCfg = () => (WSPlatform.config && WSPlatform.config.ads) || {};
  // срок «Без рекламы» идёт (по часам сервера, если он ответил)
  const isOwner = () => Store.data.pay.noadsUntil > Date.now() + clockSkew;
  // владельцу награда «за видео» — сразу, без ролика (ads.rewarded.skipForNoAds, по умолчанию да)
  const ownerSkip = () => isOwner() && (adsCfg().rewarded || {}).skipForNoAds !== false;
  // кнопки «за видео» видны, только когда награду можно получить: ролика нет (площадка
  // проверила заранее, adReady === false) — кнопки нет, появится ролик — вернётся (ADS-15/16)
  const rewardOn = () => booted && (ownerSkip() || (WSPlatform.supports('rewarded') && WSPlatform.adReady('rewarded') !== false));

  const rewardBusy = {};   // место → ролик идёт (повторное нажатие не считается)
  const rewardLate = {};   // место → [{ id, grant, t0, level }]: выдачи ждут позднего подтверждения сторожа (onLateReward)

  /* Видео за награду на месте place (win_x2, lose_moves, hint). grant() выдаёт
     награду и возвращает её размер. Ровно одна выдача на запрос: по ответу
     {rewarded:true}, по позднему подтверждению после таймаута или сразу —
     владельцу «Без рекламы». Нет ролика, таймаут, ошибка — «Видео сейчас нет»;
     закрыл сам — ничего; занято (ждём ответ на прошлый ролик) — ничего.
     Ожидание поздней награды не стирается новым нажатием: каждое — по своему
     id запроса и ровно один раз (ревью 1.0, P1-1). ad_request/ad_result пишет onPlatformEvent. */
  function rewardAd(place, grant) {
    if (rewardBusy[place]) return;
    const level = L ? L.id : 0;
    const owner = ownerSkip();
    track('ad_click', { place, format: owner ? 'owner' : 'reward', level });
    if (owner) {
      const amount = grant();
      track('ad_reward', { place, format: 'owner', ms: 0, late: 0, amount, level });
      return;
    }
    rewardBusy[place] = true;
    const t0 = Date.now();
    refreshAdButtons();
    WSPlatform.showRewarded(place).then((res) => {
      rewardBusy[place] = false;
      if (res.rewarded) {
        const amount = grant();
        track('ad_reward', { place, format: 'reward', ms: Date.now() - t0, late: 0, amount, level });
      } else {
        if (res.reason === 'timeout') (rewardLate[place] = rewardLate[place] || []).push({ id: res.id, grant, t0, level });
        if (res.reason === 'no_ads' || res.reason === 'timeout' || res.reason === 'error') toast(VIDEO_NONE, 1800);
      }
      refreshAdButtons();
    });
  }

  // ролик досмотрен после таймаута сторожа: награда того же запроса (по id), один раз
  function onLateReward(place, id) {
    const jobs = rewardLate[place];
    if (!jobs || !jobs.length) return;
    const i = id == null ? 0 : jobs.findIndex(j => j.id === id);
    if (i < 0) return;
    const job = jobs.splice(i, 1)[0];
    if (!jobs.length) delete rewardLate[place];
    const amount = job.grant();
    track('ad_reward', { place, format: 'reward', ms: Date.now() - job.t0, late: 1, amount, level: job.level });
  }

  // награда монетами, когда её повод уже прошёл (позднее подтверждение)
  function giveCoins(n) {
    Store.data.coins += n;
    shownCoins = Store.data.coins;
    renderCoins(true);
    Store.save();
    toast('+' + coinsWord(n), 1800);
  }

  function refreshAdButtons() {
    if (L && st && screen === 'game') updateButtons();
    $('btn-x2').disabled = !!rewardBusy.win_x2;
    $('btn-more-video').disabled = !!rewardBusy.lose_moves;
  }

  // ролик появился или пропал (событие площадки ad_ready): кнопки «за видео» на виду — по готовности
  function onAdReady() {
    if (!booted) return;
    refreshAdButtons();
    if (lost) $('btn-more-video').classList.toggle('hidden', !rewardOn());
    if (winTok && !winTok.done && !$('win-overlay').classList.contains('hidden')) {
      const on = winTok.amount > 0 && rewardOn();
      $('btn-x2').classList.toggle('hidden', !on);
      $('ws-win-extra').classList.toggle('hidden', !on && $('btn-win-noads').classList.contains('hidden'));
    }
  }

  // события площадки → схема аналитики (ad_request / ad_result, баннер)
  const AD_FORMAT = { rewarded: 'reward', interstitial: 'interstitial' };
  const AD_OUTCOME = { ok: 'shown', closed: 'declined', no_ads: 'no_ad', timeout: 'timeout' };
  function onPlatformEvent(ev) {
    if (!ev || typeof ev !== 'object') return;
    const level = L ? L.id : 0;
    if (ev.type === 'ad_request' && AD_FORMAT[ev.format]) {
      track('ad_request', { place: ev.placement, format: AD_FORMAT[ev.format], level });
    } else if (ev.type === 'ad_result' && AD_FORMAT[ev.format]) {
      track('ad_result', { place: ev.placement, format: AD_FORMAT[ev.format], outcome: AD_OUTCOME[ev.reason] || 'error', ms: ev.ms || 0, late: 0, level });
    } else if (ev.type === 'banner') bannerStat();
    else if (ev.type === 'ad_ready' && ev.format === 'rewarded') onAdReady();
  }

  /* Баннер: только телефон стоя (решает площадка), внизу, на карте и на
     поле. Поле и карта кончаются над ним (--ws-banner-h). Прячется под всеми
     окнами (победа, «Ходы кончились», карточки, убранство, покупка); закрытый
     игроком не возвращается до перезапуска (площадка). */
  const OVERLAYS = ['win-overlay', 'lose-overlay', 'modal-overlay', 'decor-overlay', 'noads-overlay', 'thanks-overlay']
    .concat(window.WsCase ? WsCase.OVERLAYS : [])    // B2: выбор оправы, шкатулка, «В избранное»
    .concat(window.WsHelp ? WsHelp.OVERLAYS : []);   // VK-03: «Как играть»
  let bannerWanted = null;
  let tapped = false;      // первое касание закончилось: баннер не сдвигает экран под пальцем
  function syncBanner() {
    if (!booted) return;
    const want = tapped && !isOwner() && WSPlatform.supports('banner') &&
      OVERLAYS.every(id => $(id).classList.contains('hidden'));
    if (want !== bannerWanted) {
      bannerWanted = want;
      if (want) WSPlatform.banner.show(); else WSPlatform.banner.hide();
    }
    bannerStat();
    if (want) setTimeout(bannerStat, 2500);
  }
  /* G1: место баннера под полем держится весь уровень (--ws-field-banner-h).
     Баннер, ушедший под окно или рекламу, закрытый игроком или пришедший
     посреди уровня, пробирки не двигает: поле ужимается не больше одного раза
     и в тех же рядах. Место считается заново на новом уровне, при повороте и
     заметном resize окна. */
  let fieldBH = -1, lastBH = 0, winResizeAt = 0;
  const bannerNow = () => { try { return WSPlatform.state().bannerHeight || 0; } catch (e) { return 0; } };
  const bannerImpl = () => { try { const s = WSPlatform.state(); return (s.impl && s.impl.banner) || null; } catch (e) { return null; } };
  const portraitNow = () => window.innerHeight > window.innerWidth;
  function bannerExpected() {
    const b = bannerImpl();
    return !!(lastBH && tapped && !isOwner() && WSPlatform.supports('banner') && portraitNow() &&
      !(b && (b.closed || b.blocked || b.selfResized)));
  }
  function fieldBanner(why) {
    const h = bannerNow(), b = bannerImpl();
    if (h) lastBH = h;
    let v = h;
    if (why === 'level') v = h || (bannerExpected() ? lastBH : 0);
    // посреди уровня место только растёт. Отдаётся оно, когда окно само ужалось под баннер ВК (selfResized:
    // место дала площадка) и когда баннер ушёл вместе с поворотом или resize окна, а не крестиком игрока.
    else if (why === 'change' && screen === 'game' && portraitNow() && !(b && b.selfResized) &&
             (performance.now() - winResizeAt > 1500 || (b && b.closed))) v = Math.max(fieldBH, h);
    if (v === fieldBH) return false;
    fieldBH = v;
    document.documentElement.style.setProperty('--ws-field-banner-h', v + 'px');
    return true;
  }

  // ad_result баннера — раз за сессию на исход: shown, closed, no_ad (площадка отказала)
  const bannerSeen = {};
  function bannerStat() {
    let b = null;
    try { const s = WSPlatform.state(); b = s.impl && s.impl.banner; } catch (e) { b = null; }
    if (!b) return;
    const out = (o) => {
      if (bannerSeen[o]) return;
      bannerSeen[o] = true;
      track('ad_result', { place: 'banner', format: 'banner', outcome: o, level: L ? L.id : 0 });
    };
    if (b.on) out('shown');
    if (b.closed) out('closed');
    if (b.failures > 0) out('no_ad');
  }

  /* Пауза площадки (свернули, вкладка скрыта, реклама, окно оплаты): звук,
     блеск в окне победы, CSS-анимации и время уровня стоят. VK-R2 (модерация):
     ввод закрыт (касания поля, кнопки уровня, клавиши), часы игры стоят —
     полёты камней, выдачи, смена карточек, победа и её церемония не идут, а
     после возврата доигрывают с того же места; награды не повторяются (они
     начисляются один раз в своём переходе). Поиск отменяется и после
     возврата начинается заново. */
  function onPause() {
    if (pauseAt) return;
    pauseAt = Date.now();
    if (checking) recheck = true;
    cancelSearch();
    WsBoard.setPaused(true);
    try { Confetti.stop(); } catch (e) { /* без конфетти */ }
    try { Sound.suspend('pause'); } catch (e) { /* без звука */ }
    document.body.classList.add('ws-paused');
    clearInterval(winShineTimer);
  }
  function onResume() {
    if (!pauseAt) return;
    levelT0 += Date.now() - pauseAt;
    pauseAt = 0;
    WsBoard.setPaused(false);
    Fx.request(); Piece.request();
    try { Sound.resume('pause'); } catch (e) { /* без звука */ }
    document.body.classList.remove('ws-paused');
    if (winShineRun && !$('win-overlay').classList.contains('hidden')) winShineRun();
    if (recheck) { recheck = false; if (L && st && screen === 'game' && !won) checkWinnable(); }
  }

  /* ---------- «Без рекламы» и Королевский набор ----------
     Тарифы — WSPlatform.catalog(). Выдача только по журналу сервера:
     purchases(cursor) → выдача (WorkshopSave.applyRows) → сейв → flush() →
     confirm(ids). buy() сам ничего не выдаёт: после «paid» — waitPurchases()
     и тот же порядок. Права сверяются с entitlements() (источник истины,
     возврат снимает права), копия — в Store.data.pay. */
  let catalog = [];
  let payChain = Promise.resolve();
  let noadsFrom = 'map';
  let buyBusy = false;
  let paySyncs = 0;        // завершённых сверок покупок (для проверок: __ws.state().paySyncs)
  /* Оплата прошла, а зачисления ещё нет (ВК сообщил серверу позже опроса): повторная сверка при возврате
     из сворачивания и раз в PAY_RETRY_MS, пока покупка не зачислится (ревью 1.0, P2-1). 401 от сервера —
     подпись запуска истекла (живёт 24 ч): «Перезапустите игру», покупка сохранена на сервере (P2-6). */
  const PAY_RETRY_MS = 3 * 60 * 1000;
  const RESTART_TEXT = 'Перезапустите игру';
  let payPending = false;
  let payRetryTimer = 0;
  const payOn = () => booted && catalog.length > 0 && WSPlatform.supports('payments');

  function paySync(source, fetch) {
    const job = payChain.then(async () => {
      const res = await fetch(Store.data.pay.cursor);
      const rows = res && Array.isArray(res.purchases) ? res.purchases : [];
      const out = WorkshopSave.applyRows(Store.data, rows, Store.ctx);
      out.authLost = !!(res && res.error === 'http_401');
      if (out.ids.length) {
        await Store.flush();               // курсор и права записаны до подтверждения
        await WSPlatform.confirm(out.ids);
        out.grants.forEach(g => track('grant', { product: g.item, days: g.days, royal: g.royal ? 1 : 0, source }));
      }
      const ent = await WSPlatform.entitlements();
      if (ent) {
        clockSkew = ent.now - Date.now();
        if (WorkshopSave.reconcile(Store.data, ent, Store.ctx).changed) await Store.flush();
      }
      applyDecor();
      refreshOwner();
      return out;
    }).catch((e) => {
      try { console.warn('[workshop] покупки: ' + e); } catch (x) { /* нет консоли */ }
      return { ids: [], grants: [], refund: false, royalNew: false };
    }).then((out) => { paySyncs++; return out; });
    payChain = job;
    return job;
  }

  // ждём зачисления: повтор по таймеру (и по возврату в игру — onPlatformResume)
  function payWait() {
    payPending = true;
    if (!payRetryTimer) payRetryTimer = setInterval(() => payRetry(), PAY_RETRY_MS);
  }
  function payDone() {
    payPending = false;
    if (payRetryTimer) { clearInterval(payRetryTimer); payRetryTimer = 0; }
  }
  function payRetry() {
    if (!payPending || buyBusy) return;
    paySync('restore', (c) => WSPlatform.purchases(c)).then((out) => {
      if (!payPending) return;
      if (out.grants.length) { payDone(); toast('Покупка зачислена', 2400); }
      else if (out.authLost) { payDone(); toast(RESTART_TEXT, 3200); }
    });
  }

  function refreshOwner() {
    document.body.classList.toggle('is-owner', isOwner());
    $('btn-noads').classList.toggle('hidden', !payOn());
    refreshAdButtons();
    syncBanner();
  }

  const daysWord = (n) => n + ' ' + plural(n, 'день', 'дня', 'дней');
  const votesWord = (n) => n + ' ' + plural(n, 'голос', 'голоса', 'голосов');

  function renderTariffs() {
    const box = $('ws-tariffs');
    box.innerHTML = '';
    const best = catalog.length > 1 ? catalog.reduce((m, p) => (p.days > m.days ? p : m), catalog[0]) : null;
    catalog.forEach((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-tariff' + (p.royal ? ' is-royal' : '') + (p === best ? ' is-best' : '');
      b.dataset.id = p.id;
      b.setAttribute('aria-label', 'Без рекламы ' + daysWord(p.days) + ' за ' + votesWord(p.votes) +
        (p.royal ? ', Королевский набор навсегда' : '') + '. Повторная покупка продлевает срок');
      b.innerHTML = (p === best ? '<span class="ws-tariff-ribbon">Выгодно</span>' : '') +
        '<span class="ws-tariff-days">' + daysWord(p.days) + '</span><span class="ws-tariff-pic"></span>' +
        '<span class="ws-tariff-price">' + p.votes + ' <small>' + plural(p.votes, 'голос', 'голоса', 'голосов') + '</small></span>';
      b.addEventListener('click', () => buyTariff(p));
      box.appendChild(b);
    });
    const royal = catalog.some(p => p.royal);
    $('ws-noads-note').classList.toggle('hidden', !royal);
    $('ws-noads-sr').textContent = 'Без рекламы. ' + catalog.map(p => daysWord(p.days) + ' за ' + votesWord(p.votes) +
      (p.royal ? ' и Королевский набор' : '')).join('. ') + '. Повторная покупка продлевает срок, само не продлевается.' +
      (royal ? ' Королевский набор остаётся навсегда.' : '') + (isOwner() ? ' Реклама уже отключена до ' + dateWord(Store.data.pay.noadsUntil) + '.' : '');
  }

  const dateWord = (ms) => {
    try { return new Date(ms).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; }
  };

  function openNoads(from) {
    if (!payOn()) return;
    sfx('click');
    noadsFrom = from;
    renderTariffs();
    $('noads-overlay').classList.remove('hidden');
    sel = -1; if (st) WsBoard.select(-1);
    track('noads_offer', { from, level: L ? L.id : 0, owner: isOwner() ? 1 : 0 });
    syncBanner();
    setTimeout(() => { const t = $('ws-tariffs').firstChild; if (t && !$('noads-overlay').classList.contains('hidden')) t.focus(); }, 60);
  }
  function closeNoads() {
    $('noads-overlay').classList.add('hidden');
    syncBanner();
  }

  async function buyTariff(p) {
    if (buyBusy) return;
    buyBusy = true;
    sfx('click');
    const btns = Array.from($('ws-tariffs').children);
    btns.forEach(b => { b.disabled = true; });
    track('buy_click', { product: p.id, price: p.votes, from: noadsFrom });
    const t0 = Date.now();
    let r = { status: 'error', reason: 'error' };
    try { r = await WSPlatform.buy(p.id); } catch (e) { /* buy() не бросает */ }
    const reason = String(r.reason || '');
    // fail — площадка отказала в оплате; error — мост, сеть, таймаут
    const result = r.status === 'paid' ? 'ok' : r.status === 'cancel' ? 'cancel' : /^vk_\d+$|_fail$/.test(reason) ? 'fail' : 'error';
    track('buy_result', { product: p.id, price: p.votes, result, code: result === 'ok' ? '' : reason, ms: Date.now() - t0 });
    if (r.status === 'paid') {
      const out = await paySync('purchase', (c) => WSPlatform.waitPurchases(c));
      if (out.grants.length) { payDone(); closeNoads(); showThanks(out); }
      else if (out.authLost) toast(RESTART_TEXT, 3200);   // покупка в журнале сервера, придёт при запуске
      else { toast('Зачислим чуть позже', 2600); payWait(); }
    } else if (r.status === 'error') toast('Оплата не прошла', 2000);
    btns.forEach(b => { b.disabled = false; });
    buyBusy = false;
  }

  function showThanks(out) {
    const royal = out.grants.some(g => g.royal) || out.royalNew;
    $('ws-thanks-pic').classList.toggle('is-heart', !royal);
    $('ws-thanks-line2').classList.toggle('hidden', !royal);
    $('ws-thanks-sr').textContent = 'Спасибо за покупку! Реклама отключена до ' + dateWord(Store.data.pay.noadsUntil) + '.' +
      (royal ? ' Королевский набор теперь ваш навсегда.' : '');
    $('thanks-overlay').classList.remove('hidden');
    sfx('reward');
    try { Confetti.burst({ count: 50, durationMs: 1800, colors: CONFETTI }); } catch (e) { /* без конфетти */ }
    syncBanner();
    setTimeout(() => { if (!$('thanks-overlay').classList.contains('hidden')) $('btn-thanks-ok').focus(); }, 60);
  }
  function closeThanks() {
    sfx('click');
    $('thanks-overlay').classList.add('hidden');
    syncBanner();
  }

  /* ---------- экраны ---------- */
  function showScreen(id) {
    screen = id === 'screen-workshop' ? 'game' : id === 'screen-start' ? 'start' : 'menu';
    ['screen-start', 'screen-menu', 'screen-workshop'].forEach(s => $(s).classList.toggle('active', s === id));
    WsBoard.setActive(screen === 'game');   // поле рисует кадры только на экране уровня
    if (screen !== 'game') Confetti.stop();
  }

  /* Стартовый экран (п. 4.2.10 правил ВК, решение основателя 12.10.2026): при
     каждом запуске — название, героиня и «Играть»; «Играть» ведёт на карту. */
  function onStart() {
    if (screen !== 'start') return;
    sfx('click');
    showScreen('screen-menu');
    renderMenu();
    syncBanner();
  }

  /* Место тоста (D-2). Тост не закрывает главную кнопку открытого окна (лавка, шкатулка, тарифы, выбор оправы):
     он встаёт над окном, под окном или у верхнего края — где нет кнопок окна. На экране уровня тост встаёт в верхний
     ряд, между кнопкой «назад» с подписью и монетами со звёздами: поле и кнопки внизу он не закрывает. На карте
     остаётся место из CSS (над кнопкой «Играть»). */
  function placeToast(el) {
    ['top', 'bottom', 'left', 'maxWidth', 'marginBottom', 'whiteSpace', 'width'].forEach(k => { el.style[k] = ''; });
    el.classList.remove('is-tight');
    const vw = innerWidth, vh = innerHeight;
    const R = (e) => e.getBoundingClientRect();
    const shown = (e) => { const r = R(e); return !!e && r.width > 0 && r.height > 0; };
    const meet = (a, b, pad) => a.left < b.right + pad && b.left < a.right + pad && a.top < b.bottom + pad && b.top < a.bottom + pad;
    const h = el.offsetHeight, w = el.offsetWidth;   // без масштаба появления
    const banner = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ws-banner-h')) || 0;
    const open = [...document.querySelectorAll('.ws-win:not(.hidden)')].filter(shown).pop();
    if (open) {
      const box = open.querySelector('.ws-win-box') || open, bb = R(box);
      const btns = [...open.querySelectorAll('button, a')].filter(shown).map(R);
      const cands = [bb.top - h - 8, bb.bottom + 8, 8];
      const fits = (t) => t >= 4 && t + h <= vh - banner - 4;
      const free = (t) => { const r = { left: (vw - w) / 2, right: (vw + w) / 2, top: t, bottom: t + h }; return !btns.some(b => meet(r, b, 4)); };
      const top = cands.find(t => fits(t) && free(t));
      el.style.bottom = 'auto'; el.style.marginBottom = '0';
      el.style.top = Math.round(top !== undefined ? top : 8) + 'px';
      return;
    }
    if (screen !== 'game') return;
    const head = document.querySelector('.ws-header');
    if (!head) return;
    const hr = R(head), top = Math.max(4, hr.top + 4);
    if (innerWidth > innerHeight && innerHeight <= 520) {         // телефон лёжа: поле справа, слева заказчицы — тост под ними
      const op = R(document.querySelector('.ws-orders-panel'));
      el.style.bottom = 'auto'; el.style.marginBottom = '0';
      el.style.top = Math.round(op.bottom + 8) + 'px'; el.style.left = Math.round((op.left + op.right) / 2) + 'px';
      el.style.maxWidth = Math.round(op.width) + 'px'; el.style.whiteSpace = 'normal'; el.style.width = 'max-content';
      return;
    }
    // верхний ряд между кнопкой «назад» с подписью и монетами со звёздами; высота тоста зависит от ширины ряда,
    // поэтому ряд пересчитывается по настоящей высоте (до трёх заходов)
    el.style.bottom = 'auto'; el.style.marginBottom = '0';
    el.style.top = Math.round(top) + 'px';
    el.style.whiteSpace = 'normal'; el.style.width = 'max-content';
    let hh = 60;
    for (let pass = 0; pass < 3; pass++) {
      let left = hr.left, right = hr.right;
      ['btn-back', 'ws-level-title', 'ws-moves', 'ws-coins', 'ws-stars'].forEach(id => {
        const e = $(id);
        if (!e || !shown(e)) return;
        const r = R(e);
        if (r.top >= top + hh || r.bottom <= top) return;
        if ((r.left + r.right) / 2 < vw / 2) left = Math.max(left, r.right + 6); else right = Math.min(right, r.left - 6);
      });
      const width = Math.max(96, Math.round(right - left));
      el.classList.toggle('is-tight', width < 170);
      el.style.left = Math.round((left + right) / 2) + 'px';
      el.style.maxWidth = width + 'px';
      const now = el.offsetHeight;
      if (now <= hh) break;
      hh = now;
    }
  }

  function toast(msg, ms) {
    const el = $('hint-toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    placeToast(el);
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
    const now = () => WsBoard.clock.now();   // часы игры: на паузе полёты стоят
    const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

    function init(c) { cv = c; g = cv.getContext('2d'); resize(); }
    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      request();
    }
    function request() { if (!raf && g && !document.hidden && !WsBoard.clock.paused()) raf = requestAnimationFrame(frame); }

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
      if (document.hidden || WsBoard.clock.paused()) return;
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
      if (jobs.length || sparks.length || texts.length || rings.length || drops.length || landed.length) request();   // долетевшее стирается следующим кадром
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
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      jobs = []; sparks = []; texts = []; rings = []; drops = [];
      if (g) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); }
    }
    return { init, resize, request, fly, coins, text, ring, rain, sparkle, clear, drawCoin, drawKey, drawPadlock };
  })();

  const gemItem = (gem, x, y, size) => ({ x, y, size, draw: (g, px, py, s) => WsBoard.drawGem(g, gem, px, py, s) });

  /* ---------- изделие над заказами: камни встают по порядку выдачи ---------- */
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
    function request() { if (!raf && g && !document.hidden) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      if (!L || screen !== 'game' || document.hidden) return;
      const t = WsBoard.clock.now();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      let p = null;
      if (pop) {
        const k = (t - pop.t0) / 520;
        if (k >= 1) pop = null; else p = { i: pop.i, k };
      }
      const lk = playLook();
      WsJewel.draw(g, lk.shape, L.orders.length, pieceGems, box(), { drawGem: WsBoard.drawGem, pop: p, metal: lk.metal });
      b2('piece');
      if (shineAt) {
        const k = (t - shineAt) / 900;
        if (k >= 1) shineAt = 0; else WsJewel.shine(g, box(), k);
      }
      if (pop || shineAt) request();
    }
    /* Куда в изделии встаёт i-й выданный камень, в координатах окна. */
    function socket(i) {
      const r = cv.getBoundingClientRect();
      const s = L && WsJewel.sockets(playLook().shape, L.orders.length, box())[i];
      return s ? { x: r.left + s.x, y: r.top + s.y, size: s.r * 2.35 } : { x: r.left + W / 2, y: r.top + H / 2, size: 20 };
    }
    function set(i, gem) { pieceGems[i] = gem; pop = REDUCED ? null : { i, t0: WsBoard.clock.now() }; request(); }
    function shine() { if (!REDUCED) { shineAt = WsBoard.clock.now(); request(); } }
    function reset() { pop = null; shineAt = 0; request(); }
    return { init, resize, request, socket, set, shine, reset };
  })();

  const seqGems = (s) => s.orders.map((_, k) => (k < s.seq.length ? s.orders[s.seq[k]] : null));
  function resetPiece() {
    pieceGems = seqGems(st);
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

  /* Лица заказчиц: у заказа своё лицо на весь уровень, на виду — без повторов.
     Первые шесть — глава 1 (как было); jade и silver — новые заказчицы главы 2 (уровни 31–60, B3):
     там они встречают первые два заказа, дальше идут прежние. */
  const FACES = ['bride', 'grandma', 'curly', 'lady', 'redhead', 'blonde', 'jade', 'silver'];
  const FACES_CH1 = 6, CH1_LEVELS = 30;
  // героиня окна победы по изделию: невеста — кольца, колье, диадемы и короны; кудрявая —
  // серьги, браслеты и заколки; бабушка — кулоны, броши и запонки
  const HERO = { ring: 'bride', necklace: 'bride', tiara: 'bride', crown: 'bride', earrings: 'curly',
    bracelet: 'curly', hairpin: 'curly', pendant: 'grandma', brooch: 'grandma', cufflinks: 'grandma' };
  let faces = {};
  /* Картинки по требованию (перф 1.0): радостные лица и героиня победы не грузятся
     все при запуске — только то, что скоро понадобится (карточки на столе, уровень). */
  let assetBase = '';
  const prefetched = new Set();
  function prefetchImg(name) {
    if (!assetBase || prefetched.has(name) || typeof Image === 'undefined') return;
    prefetched.add(name);
    const im = new Image();
    im.decoding = 'async';
    im.src = assetBase + name + '.webp';
  }
  function prefetchLevel() {
    if (!L) return;
    WsJewel.prefetch([L.piece, playLook().shape]);          // изделие (и вторая форма, если выбрана)
    prefetchImg('hero_' + (HERO[L.piece] || 'curly'));      // героиня окна победы
  }
  function assignFaces(slots) {
    const used = [];
    const vis = slots.filter(o => o >= 0);
    vis.forEach(o => {
      if (faces[o] !== undefined && used.indexOf(faces[o]) === -1) used.push(faces[o]);
      else delete faces[o];
    });
    const pool = L && L.id > CH1_LEVELS ? FACES.length : FACES_CH1, shift = pool > FACES_CH1 ? FACES_CH1 : 0;
    vis.forEach(o => {
      if (faces[o] !== undefined) return;
      let f = (o + shift) % pool;
      for (let k = 0; k < pool && used.indexOf(f) !== -1; k++) f = (f + 1) % pool;
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
    view.slots.forEach(o => { if (o >= 0) prefetchImg('face_' + FACES[faces[o]] + '_joy'); });   // лицо после выдачи
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
    b2('orders');
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
    flash = { text, until: WsBoard.clock.now() + ms };
    cancelLater(flashTimer);
    flashTimer = later(() => { flash = null; updateGuide(); }, ms);
  }

  function tutorialText() {
    // Уровень 1: кольцо ведёт по кратчайшему решению от текущей позиции.
    // ход ищется один раз на позицию (перф 1.0); ключ с порядком пробирок — ход называет их номера
    const key = st.vials.map(v => v.join('')).join('|') + '#' + st.next + '#' + st.hid.join(',');
    if (key !== tutorialKey) { tutorialKey = key; tutorialStep = R.hint(st); }
    const step = tutorialStep;
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
    else if (flash && WsBoard.clock.now() < flash.until) { text = flash.text; if (tutorial) tutorialText(); }
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
    // монет меньше цены — подсказка за видео: вместо цены значок камеры (у владельца — корона)
    const vid = !hintMv && !won && p > 0 && Store.data.coins < p && rewardOn();
    const lbl = $('ws-hint-label');
    lbl.classList.toggle('is-video', vid);
    lbl.textContent = p && !hintMv && !vid ? String(p) : '';
    $('btn-hint').setAttribute('aria-label', vid ? (ownerSkip() ? 'Подсказка бесплатно' : 'Подсказка за видео')
      : p && !hintMv ? 'Подсказка за ' + coinsWord(p) : 'Подсказка');
    if (vid && hintOffered !== L.id) { hintOffered = L.id; track('ad_offer', { place: 'hint', format: 'reward', level: L.id }); }
  }

  /* ---------- спасение: победа стала недостижимой ---------- */
  const UNDO_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4 12l5 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12h9a5 5 0 0 1 0 10h-2" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  /* Плашка спасения. known — вывод без поиска (null — победа достижима,
     k — вернуть k ходов, 0 — только «Заново»): ход вперёд из непроходимой
     позиции, отмена хода, «Заново» и спасение знают ответ по прежнему rescueK.
     Без known — поиск кусочками (перф 1.0); пока он идёт, checking = true, а
     onHint ждёт checkDone. Неопределённость (лимит поиска) — «достижима», не тупик. */
  function checkWinnable(known) {
    cancelSearch();
    recheck = false; checkDone = null;
    if (won || R.isWon(st)) { rescueK = null; return; }
    if (known !== undefined) { setRescue(known); return; }
    checkDone = searchRescue();
    return checkDone;
  }
  function setRescue(k) {
    if (k !== null && rescueK === null) track('unwinnable', { level: L.id, moves, back: k, dead: R.movesOf(st).length === 0 });
    rescueK = k;
  }
  async function searchRescue() {
    const cancelled = searchGuard();
    checking = true;
    try {
      let k = null;
      if (!await canWin(R.cloneState(st), cancelled)) {
        k = 0;
        for (let i = hist.length - 1; i >= 0 && !cancelled(); i--) {
          if (await canWin(hist[i].st, cancelled)) { k = hist.length - i; break; }
        }
      }
      if (cancelled()) { if (pauseAt && screen === 'game') recheck = true; return; }
      setRescue(k);
    } catch (e) { /* сбой поиска не закрывает игру и не объявляет тупик */ }
    finally {
      if (!cancelled()) { checking = false; updateGuide(); }
    }
  }

  function updateRescue() {
    const box = $('ws-rescue');
    const on = !(rescueK === null || won || lost);
    box.parentElement.classList.toggle('has-rescue', on);   // плашка поверх полоски «следующие» (G1)
    if (!on) { box.classList.add('hidden'); return; }
    const dead = R.movesOf(st).length === 0;
    $('ws-rescue-text').textContent = dead ? 'Тупик' : 'Не собрать';
    const b = $('btn-rescue');
    b.innerHTML = rescueK > 0 ? UNDO_ICON + '<b>' + rescueK + '</b>' : 'Заново';
    b.setAttribute('aria-label', rescueK > 0 ? 'Вернуть ' + movesWord(rescueK) : 'Начать заново');
    box.classList.remove('hidden');
  }

  function onRescue() {
    if (rescueK === null || won || pauseAt) return;
    sfx('click');
    if (rescueK === 0) { restart(); return; }
    const k = rescueK;
    const snap = hist[hist.length - k];
    hist.length = hist.length - k;
    track('rescue', { level: L.id, back: k });
    restoreSnap(snap, null);   // возврат ровно к последней проходимой позиции
  }

  /* ---------- «Сложный заказ»: ходы кончились ---------- */
  // ходы «Сложного заказа» кончились (окно «Ходы кончились» — когда доиграют выдачи)
  const overLimit = () => !!(L && L.hard && !R.isWon(st) && moves >= limitNow());
  function checkLimit() {
    setLost(!won && overLimit());
  }

  function setLost(on) {
    if (on === lost) { if (on) renderLose(); return; }
    lost = on;
    $('lose-overlay').classList.toggle('hidden', !on);
    if (on) {
      sel = -1; WsBoard.select(-1);
      sfx('lose');
      track('level_lose', { level: L.id, moves, limit: limitNow(), delivered: st.delivered, sec: levelSec() });
      renderLose();
      if (rewardOn()) track('ad_offer', { place: 'lose_moves', format: 'reward', level: L.id });
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
    // те же +5 ходов за видео — рядом с покупкой за монеты
    const v = $('btn-more-video');
    v.classList.toggle('hidden', !rewardOn());
    v.disabled = !!rewardBusy.lose_moves;
    v.setAttribute('aria-label', ownerSkip() ? 'Пять ходов бесплатно' : 'Пять ходов за видео');
  }

  function buyMoves() {
    if (!lost) return;
    if (Store.data.coins < MORE_PRICE) { sfx('invalid'); toast('Мало монет', 1600); return; }
    Store.data.coins -= MORE_PRICE;
    shownCoins = Store.data.coins;
    bonusMoves += MORE_MOVES;
    sfx('reward');
    track('buy_moves', { level: L.id, moves, price: MORE_PRICE });
    track('coin_spend', { what: 'moves', amount: MORE_PRICE, balance: Store.data.coins, level: L.id });
    setLost(false);
    updateHud();
    bump($('ws-moves'));
    saveGame();
  }

  /* +5 ходов за видео. Позднее подтверждение, когда окно уже закрыто или
     уровень другой, — те же 50 монет, что стоят ходы: награда не теряется. */
  function moreByVideo() {
    if (!lost) return;
    sfx('click');
    const lvl = L.id, e0 = epoch;
    rewardAd('lose_moves', () => {
      if (lost && L && L.id === lvl && epoch === e0 && screen === 'game') {
        bonusMoves += MORE_MOVES;
        sfx('reward');
        setLost(false);
        updateHud();
        bump($('ws-moves'));
        saveGame();
        return MORE_MOVES;
      }
      giveCoins(MORE_PRICE);
      return MORE_PRICE;
    });
  }

  /* ---------- уровень ---------- */
  const initialUrgent = () => (L.urgent && L.urgent.order < Math.min(L.slots, L.orders.length) ? 0 : null);

  function loadLevel(i, resume) {
    epoch++;
    cancelSearch(); winCache.clear(); tutorialKey = '';
    levelIdx = i;
    levelT0 = Date.now();
    if (pauseAt) pauseAt = levelT0;
    nextBusy = false;
    hintOffered = -1;
    L = LEVELS[i];
    if (resume) {
      st = resume.st; moves = resume.moves; hist = resume.hist; paid = resume.paid;
      urgentSince = resume.us; bonusMoves = resume.bonus; lastDeliv = resume.ld; attemptCoins = resume.ac;
    } else {
      st = R.makeState(L); moves = 0; hist = []; paid = L.orders.map(() => false);
      urgentSince = initialUrgent(); bonusMoves = 0; lastDeliv = 0; attemptCoins = 0;
    }
    sel = -1; busy = false; won = false; levelWins = 0; pendingUnlock = -1;
    resetFlow();
    hintMv = null; flash = null; rescueK = null;
    lost = false;
    faces = {};
    cancelLater(cardTimer); cardJob = null;
    clearInterval(winShineTimer);
    stats = { hints: 0, undos: 0, restarts: 0 };
    Fx.clear();
    shownCoins = Store.data.coins;
    hideToast();
    $('win-overlay').classList.add('hidden');
    $('lose-overlay').classList.add('hidden');
    $('ws-level-n').textContent = String(L.id);
    $('ws-level-name').textContent = L.name;
    document.body.classList.toggle('is-hard', !!L.hard);
    showScreen('screen-workshop');
    WsBoard.select(-1); WsBoard.clearHint(); WsBoard.setTutorial(-1);
    WsBoard.setVials(st.vials, st.hid, R.lockedVial(st));
    fieldBanner('level');
    WsBoard.resize(true);   // число рядов выбирается здесь и держится весь уровень (G1)
    Piece.resize();
    syncView();
    renderOrders();
    resetPiece();
    prefetchLevel();
    if (resume) checkWinnable();
    updateHud();
    checkLimit();
    updateGuide();
    saveGame();
    requestAnimationFrame(() => { WsBoard.resize(true); Piece.resize(); updateGuide(); });
    track('level_start', { level: L.id, hard: L.hard ? 1 : 0, resumed: !!resume, moves });
    syncBanner();
    // B2: перед первым запуском уровня (с 4-го) — окно выбора оправы; «Новое!» — после выбора
    if (!b2('levelStart', !!resume) && !resume) introduce();
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
      later(() => {
        if (e !== epoch) return;
        sfx('novelty');
        showModal({ kicker: 'Новое!', title: n.title, text: n.text, art: NOVELTY_ART[L.novelty], ok: 'Понятно', onOk: hard });
      }, REDUCED ? 0 : 350);
    } else if (L.hard && !isPassed(levelIdx)) later(hard, REDUCED ? 0 : 300);
  }

  /* Вернуть снимок (отмена/спасение/заново): анимации обрываются, всё рисуется заново.
     known — ответ плашки спасения без поиска (см. checkWinnable), undefined — искать. */
  function restoreSnap(snap, known) {
    epoch++;
    cancelSearch();
    st = snap.st;
    moves = snap.moves;
    urgentSince = snap.us === undefined ? initialUrgent() : snap.us;
    lastDeliv = snap.ld || 0;
    sel = -1; busy = false; hintMv = null; flash = null; pendingUnlock = -1;
    resetFlow();
    cancelLater(cardTimer); cardJob = null;
    Fx.clear();
    shownCoins = Store.data.coins;
    hideToast();
    WsBoard.select(-1); WsBoard.clearHint();
    WsBoard.setVials(st.vials, st.hid, R.lockedVial(st));
    syncView();
    renderOrders();
    resetPiece();
    checkWinnable(known);
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
    sfx('invalid');
    WsBoard.shake(idx);
    toast('Нужен ключ', 1600);
    track('invalid', { level: L.id, locked: idx });
  }

  function tapVial(idx) {
    if (!L || won || lost || modalOpen || screen !== 'game' || pauseAt) return;
    // камни ещё летят в пробирку: касание ждёт приземления (одного хода хватает)
    if (pouring) { if (tapQueue.length < 2) tapQueue.push(idx); return; }
    // ход победный или последний на «Сложном заказе»: окно — когда доиграют выдачи
    if (R.isWon(st) || overLimit()) return;
    if (idx < 0 || idx >= st.vials.length) {
      if (sel !== -1) { sel = -1; WsBoard.select(-1); updateGuide(); }
      return;
    }
    // ключ уже выдан, но ещё летит к замку: касание открывает замок сразу
    if (idx === WsBoard.lockedVial() && idx !== R.lockedVial(st)) openLockNow(idx);
    if (idx === R.lockedVial(st)) { lockedTap(idx); return; }
    if (sel === -1) {
      // выданная четвёрка ещё на поле — касание отправляет её заказчице
      if (!st.vials[idx].length) { hurry(idx, epoch); return; }
      sel = idx;
      WsBoard.select(idx);
      sfx('pick');
      updateGuide();
      return;
    }
    if (sel === idx) { sel = -1; WsBoard.select(-1); updateGuide(); return; }
    const count = R.moveCount(st.vials[sel], st.vials[idx]);
    if (count === 0) {
      sfx('invalid');
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
    hurry(to, e);   // в пробирке ещё стоит выданная четвёрка — она улетает к заказчице, место свободно
    // ход из непроходимой позиции: победа по-прежнему недостижима, вернуться нужно к той же
    // последней проходимой позиции (ws) — плашка без поиска
    const known = checking ? undefined : rescueK;
    const ws = known > 0 ? hist[hist.length - known] : null;
    pushHist('move');
    const prevHid = st.hid.slice();
    const before = st.vials[to].length;
    const res = R.moveInPlace(st, { from, to });
    if (!res) { hist.pop(); return; }
    cancelSearch();
    moves++;
    sel = -1;
    hintMv = null;
    WsBoard.clearHint();
    busy = true;
    pouring = true;
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
    ftueStep(1, 'first_move');
    if (res.deliveries.length) ftueStep(2, 'first_delivery');
    const left = urgentLeft();
    if (left !== null && left >= 1 && left <= 2) sfx('tick', { delay: 0.25 });
    // плашка спасения — по правилам сразу после хода, а не после анимаций (поиск — кусочками)
    if (known === null || known === undefined) checkWinnable();
    else { const i = ws ? hist.indexOf(ws) : -1; checkWinnable(i >= 0 ? hist.length - i : 0); }
    saveGame();
    updateHud();
    updateGuide();
    // выданные пробирки до вспышки показывают тайные камни как до хода;
    // четвёрки прежних ходов, ещё стоящие на поле, — как их сейчас рисует поле
    const shown = WsBoard.hidden();
    const boardHid = st.hid.slice();
    pend.forEach((d, v) => { boardHid[v] = shown[v]; });
    res.deliveries.forEach(d => { boardHid[d.vial] = prevHid[d.vial]; });
    const job = { e, evs: res.deliveries.map((ev, k) => ({ ev, pay: pays[k], k, state: 'wait', onArrive: null })) };
    job.evs.forEach(d => pend.set(d.ev.vial, d));
    WsBoard.pour(from, to, count, () => {
      if (e !== epoch) return;
      pouring = false;
      if (job.evs.length) { jobs.push(job); nextJob(); } else settle();
      replayTaps();
    }, {
      onGem: (k) => { if (e === epoch) sfx('gem', { semis: PENTA[Math.min(5, before + k)] }); },
      hid: boardHid,
      reveal: res.revealed
    });
    if (res.revealed) later(() => { if (e === epoch) sfx('reveal'); }, REDUCED ? 0 : 160);
  }

  /* Выдачи по очереди: четвёрка вспыхивает, камни со шлейфом летят к
     карточке, на карточке — печать и монеты, камень встаёт в гнездо
     изделия, на место карточки выходит следующий заказ. Каскад — каждая
     следующая выдача того же хода: «Каскад ×2…», встряска, нота выше. */
  function runDeliveries(job, k) {
    const e = job.e;
    if (e !== epoch) return;
    const d = job.evs[k], ev = d.ev;
    const land = () => {
      if (e !== epoch) return;
      landDelivery(ev, d.pay, k, e);
      if (k === job.evs.length - 1) { swapCard(ev, true); endJob(job); }
      else {
        later(() => {
          if (e !== epoch) return;
          swapCard(ev, false);
          runDeliveries(job, k + 1);
        }, REDUCED ? 60 : 320);
      }
    };
    // печать — когда камни долетели (игрок мог отправить их раньше ходом в эту пробирку)
    const landWhenArrived = () => { if (d.state === 'arrived') land(); else d.onArrive = land; };
    const go = () => {
      if (e !== epoch) return;
      if (d.state !== 'wait') { landWhenArrived(); return; }
      sfx('ready', { semis: 2 * k });
      WsBoard.flashReady(ev.vial, 300, () => {
        if (e !== epoch) return;
        if (d.state === 'wait') flyToCard(d, e);
        landWhenArrived();
      });
    };
    if (k >= 1) { cascadeFx(k); later(go, REDUCED ? 0 : 220); } else go();
  }

  /* Камни выданной пробирки летят к карточке заказа: по очереди выдач или
     раньше — когда игрок ходит в эту пробирку (hurry). */
  function flyToCard(d, e) {
    const ev = d.ev;
    if (pend.get(ev.vial) === d) pend.delete(ev.vial);
    d.state = 'flying';
    const card = cardEl(ev.slot);
    const gemEl = card && card.querySelector('.ws-gem');
    const r = gemEl ? gemEl.getBoundingClientRect() : null;
    const target = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width }
      : { x: window.innerWidth / 2, y: 80, size: 40 };
    const items = WsBoard.takeVial(ev.vial).map(it => gemItem(it.gem, it.x, it.y, it.size));
    sfx('whoosh');
    Fx.fly(items, target, () => {
      if (e !== epoch) return;
      d.state = 'arrived';
      const f = d.onArrive;
      d.onArrive = null;
      if (f) f();
    }, { trail: true, dur: 400, step: 45, lift: 60 });
  }

  function hurry(v, e) {
    const d = pend.get(v);
    if (d) flyToCard(d, e);
  }

  function nextJob() {
    if (jobOn || !jobs.length) return;
    const job = jobs.shift();
    jobOn = true;
    flushCards();
    runDeliveries(job, 0);
  }

  function endJob(job) {
    if (job.e !== epoch) return;
    jobOn = false;
    if (jobs.length) nextJob(); else settle();
  }

  function replayTaps() {
    const q = tapQueue;
    tapQueue = [];
    q.forEach(i => tapVial(i));
  }

  function resetFlow() {
    pouring = false; jobs = []; jobOn = false; pend.clear(); tapQueue = [];
  }

  // ключ выдан, но ещё летит: игрок коснулся запертой пробирки — замок открывается сразу
  function openLockNow(v) {
    if (pendingUnlock === v) pendingUnlock = -1;
    WsBoard.unlock(v);
    sfx('unlock');
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
  }

  function landDelivery(ev, pay, k, e) {
    sfx('deliver', { semis: 2 * k });
    sfx('stamp', { delay: 0.09 });
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
    // камень встаёт в изделие по порядку выдачи: первый — в главное место
    const at = Math.max(0, st.seq.indexOf(ev.order));
    const s = Piece.socket(at);
    const main = at === 0;   // B2: главный камень — крупнее, выше и со своим звуком (b2 mainGem)
    Fx.fly([gemItem(ev.gem, cx, cy, main ? 38 : 30)], s, () => {
      if (e !== epoch) return;
      Piece.set(at, ev.gem);
      sfx('gem', { semis: 12 + 2 * Math.min(k, 3) });
      if (main) b2('mainGem', s);
    }, main ? { dur: 680, lift: 96 } : { dur: 460, lift: 36 });
    if (pay.coins) {
      Fx.text(cx, cy - 8, '+' + pay.coins, { color: '#ffe08a', size: 22 });
      coinsTo(cx, cy, pay.coins, e);
    }
    if (pay.urgent === true) Fx.text(cx, cy - 34, 'Успели! ×3', { color: '#ffb27a', size: 18, delay: 140 });
    else if (pay.urgent === false) Fx.text(cx, cy - 34, 'Не успели', { color: '#e6d6bf', size: 16, delay: 140 });
    if (pay.jackpot) later(() => { if (e === epoch) jackpotFx(pay.jackpot, e); }, REDUCED ? 0 : 250);
    if (ev.unlocked >= 0) keyFx(ev, pay, card, e);
    if (L.id <= 3 && k === 0) setFlash('Заказ готов', 2400);
    track('stamp', { level: L.id, order: ev.order, coins: pay.coins + pay.jackpot + pay.key });
  }

  function jackpotFx(n, e) {
    sfx('jackpot');
    Fx.rain(36);
    const p = boardPoint(0.42);
    Fx.text(p.x, p.y, 'Джекпот! +' + n, { color: '#ffd84a', size: 34, dur: 1600 });
    coinsTo(p.x, p.y, n, e);
  }

  /* Ключ с карточки летит к запертой пробирке; замок открывается при прилёте. */
  function keyFx(ev, pay, card, e) {
    const v = ev.unlocked;
    if (WsBoard.lockedVial() === v) pendingUnlock = v;   // замок ещё нарисован (игрок не открыл его касанием)
    const badge = card && card.querySelector('.ws-key');
    const br = (badge || card) ? (badge || card).getBoundingClientRect() : null;
    const from = br ? { x: br.left + br.width / 2, y: br.top + br.height / 2 } : { x: window.innerWidth / 2, y: 80 };
    const vr = WsBoard.vialClientRect(v);
    const to = vr ? { x: vr.left + vr.width / 2, y: vr.top + vr.height * 0.45, size: vr.width * 0.9 } : { x: window.innerWidth / 2, y: window.innerHeight / 2, size: 30 };
    Fx.fly([{ x: from.x, y: from.y, size: 26, draw: (g, x, y, s) => Fx.drawKey(g, x, y, s) }], to, () => {
      if (e !== epoch) return;
      if (pendingUnlock === v) pendingUnlock = -1;
      if (WsBoard.lockedVial() === v) {
        WsBoard.unlock(v);
        sfx('unlock');
      }
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
    if (defer && !REDUCED) { cancelLater(cardTimer); cardJob = render; cardTimer = later(render, 320); }
    else render();
  }

  function flushCards() {
    if (!cardJob) return;
    cancelLater(cardTimer);
    const j = cardJob;
    cardJob = null;
    j();
  }

  /* Всё доиграло (перелив приземлился, очередь выдач пуста): поле и карточки
     сверяются с правилами, затем победа или «Ходы кончились». */
  function settle() {
    if (pouring || jobOn || jobs.length) return;
    busy = false;
    // поле совпадает с правилами (страховка после анимаций)
    WsBoard.sync(st.vials, st.hid, pendingUnlock >= 0 ? pendingUnlock : R.lockedVial(st));
    const same = view.delivered === st.delivered && view.next === st.next && view.slots.every((o, i) => o === st.slots[i]);
    if (!same && !cardJob) { syncView(); renderOrders(); }
    if (R.isWon(st)) { win(); return; }
    updateHud();
    checkLimit();
    updateGuide();
    saveGame();
  }

  /* ---------- отмена / заново ---------- */
  function undo() {
    if (!L || won || !hist.length || modalOpen || pauseAt) return;
    sfx('click');
    // плашка спасения без поиска: позиция до хода из проходимой — проходима; из
    // непроходимой — на шаг ближе к последней проходимой (k-1), «только заново» остаётся
    const k = checking ? undefined : rescueK;
    const snap = hist.pop();
    stats.undos++;
    track('undo', { level: L.id, kind: snap.kind, depth: hist.length });
    restoreSnap(snap, snap.kind !== 'move' || k === undefined ? undefined : k === null || k === 1 ? null : k > 1 ? k - 1 : 0);
    if (snap.kind === 'restart') toast('Партия вернулась', 1600);
  }

  function restart() {
    if (!L || won || modalOpen || pauseAt || (moves === 0 && st.delivered === 0)) return;
    sfx('click');
    pushHist('restart');
    stats.restarts++;
    track('restart', { level: L.id, moves, delivered: st.delivered });
    restoreSnap({ st: R.makeState(L), moves: 0, us: initialUrgent(), ld: 0 }, null);   // начало уровня проходимо
    toast('Отменить — вернёт партию', 2000);
  }

  /* ---------- подсказка: решатель от текущей позиции, за монеты ----------
     Перф 1.0: ход ищется по кусочкам (R.hintAsync), касания и кадры не стоят.
     Повторное касание, пока ход ищется, ничего не делает (вторая оплата
     невозможна); ход, отмена, заново, смена уровня/экрана и пауза отменяют
     поиск — тогда ничего не списано. Монеты списываются только за найденный
     для текущей позиции ход; подсказка за видео — ход найден ДО ролика. */
  let hintSeq = 0;
  async function onHint() {
    if (!L || won || pouring || lost || modalOpen || hintPending || pauseAt || screen !== 'game' || R.isWon(st) || overLimit()) return;
    const tok = hintPending = ++hintSeq;
    let step = null, cancelled = null;
    try {
      // плашка спасения ещё считается — подсказка ждёт её (без неё нельзя решить, к месту ли подсказка)
      while (checking && checkDone) { await checkDone; if (hintPending !== tok) return; }
      if (rescueK !== null) {
        toast('Сначала верните ходы', 1800);
        bump($('ws-rescue'));
        return;
      }
      if (hintMv) { WsBoard.showHint(hintMv.from, hintMv.to); return; }   // уже оплачена
      const price = hintPrice();
      const video = price > Store.data.coins;
      if (video && !rewardOn()) {
        sfx('invalid');
        toast('Мало монет', 1600);
        return;
      }
      cancelled = searchGuard();
      const key = epoch + ':' + moves;   // позиция меняется только ходом (moves) или снимком (epoch)
      try { step = await R.hintAsync(R.cloneState(st), { cancelled }); }
      catch (e) { step = null; /* нет подсказки — ничего не списано */ }
      if (cancelled() || hintPending !== tok) return;
      hintPending = 0;
      if (!step) {
        stats.hints++;
        track('hint', { level: L.id, from: null, to: null, moves, price: 0, video: video ? 1 : 0 });
        toast('Попробуйте другой ход', 1600);
        return;
      }
      if (video) { hintByVideo(step, key); return; }
      giveHint(price, false, step);
    } finally {
      if (hintPending === tok) hintPending = 0;
      updateButtons();
    }
  }

  // Показать найденную подсказку step; price — списать монеты.
  function giveHint(price, video, step) {
    stats.hints++;
    track('hint', { level: L.id, from: step.from, to: step.to, moves, price, video: video ? 1 : 0 });
    if (price) {
      Store.data.coins -= price;
      shownCoins -= price;
      renderCoins(true);
      const r = $('btn-hint').getBoundingClientRect();
      Fx.text(r.left + r.width / 2, r.top - 6, '−' + price, { color: '#f3c46b', size: 18 });
      track('coin_spend', { what: 'hint', amount: price, balance: Store.data.coins, level: L.id });
      saveGame();
    }
    sfx('click');
    hintMv = step;
    sel = -1;
    WsBoard.select(-1);
    WsBoard.showHint(step.from, step.to);
    updateGuide();
    updateButtons();
    return true;
  }

  /* Подсказка за видео (монет меньше цены). Ход step найден до ролика для
     позиции key: награда выдаёт его без нового поиска, один раз (rewardAd
     вызывает grant один раз). Если подсказка уже не к месту (позиция
     сменилась, другой уровень, победа, позднее подтверждение) — цена
     подсказки монетами. */
  function hintByVideo(step, key) {
    sfx('click');
    const lvl = L.id;
    rewardAd('hint', () => {
      if (L && L.id === lvl && screen === 'game' && st && epoch + ':' + moves === key && !won && !lost && !pouring && !modalOpen &&
        !hintMv && rescueK === null && giveHint(0, true, step)) return 1;
      giveCoins(HINT_PRICE);
      return HINT_PRICE;
    });
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
    coinEarn('win_bonus', bonus, L.id);
    justWon = L.id;
    const ci = collOfIdx(levelIdx);
    const collNew = !prevStars && collDone(ci) && !Store.data.chests[ci];
    // B2: готовое изделие — в шкатулку: металл и форма выбора, камни в порядке выдачи
    const lk = playLook();
    Store.data.pieces[id] = { metal: lk.metal, shape: lk.shape, gems: seqGems(st).filter(Boolean).slice(0, 16) };
    saveGame();
    return { prevBest, prevStars, stars, bonus, collNew, ci };
  }

  function win() {
    if (won) return;                            // ровно один раз
    const r = recordWin();
    track('level_win', {
      level: L.id, moves, stars: r.stars, best: Store.data.best[String(L.id)], par: L.par, hard: L.hard ? 1 : 0,
      hints: stats.hints, undos: stats.undos, restarts: stats.restarts, coins: attemptCoins, sec: levelSec(), first: r.prevStars ? 0 : 1
    });
    coinEarn('orders', attemptCoins - r.bonus, L.id);
    ftueStep(3, 'first_win');
    if (Object.keys(Store.data.stars).length >= 3) ftueStep(5, 'third_win');
    Store.flush();          // конец уровня: облако дописывается сразу
    hideToast();
    setLost(false);
    WsBoard.setTutorial(-1);
    WsBoard.setWaiting([]);
    $('ws-caption').textContent = '';
    updateRescue();
    updateButtons();
    sfx('win');
    vibrateWin();
    const e = epoch;
    // переходы победы — на часах игры: на паузе площадки ждут, после — доигрывают (VK-R2)
    later(() => { if (e === epoch) Piece.shine(); }, REDUCED ? 0 : 420);
    later(() => { if (e === epoch) showWin(r); }, REDUCED ? 100 : 1000);
  }

  /* Церемония: изделие крупно с бликом, звёзды по одной, монеты считаются,
     прогресс коллекции; новая полная коллекция ведёт к шкатулке. */
  function showWin(r) {
    const e = epoch;
    Confetti.burst({ count: r.collNew ? 80 : 55, durationMs: 2400, colors: CONFETTI });
    $('ws-win-kicker').textContent = 'Уровень ' + L.id + (L.hard ? ' · Сложный заказ' : '');
    $('ws-win-title').textContent = L.piece === 'crown' ? 'Корона готова!' : 'Готово!';
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
    renderWinExtra();
    ov.classList.remove('hidden');
    drawWinJewel(0);
    b2('win', r);   // B2: кнопка шкатулки, полёт изделия в неё (первые три победы), «В избранное»
    // звёзды по одной
    for (let i = 0; i < r.stars; i++) {
      later(() => {
        if (e !== epoch) return;
        starEls[i].classList.add('on');
        sfx('star', { semis: [0, 3, 7][i] });
      }, REDUCED ? 0 : 350 + i * 300);
    }
    // монеты попытки считаются вверх
    const total = attemptCoins;
    const t0 = (REDUCED ? 0 : 350 + r.stars * 300 + 150);
    later(() => {
      if (e !== epoch) return;
      const steps = Math.min(14, Math.max(1, Math.ceil(total / 10)));
      for (let s = 1; s <= steps; s++) {
        later(() => {
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
    winShineRun = null;
    if (!REDUCED) {
      let k0 = performance.now();
      const run = () => {
        if (e !== epoch || pauseAt || $('win-overlay').classList.contains('hidden')) return;
        const k = (performance.now() - k0) / 1000;
        if (k <= 1) { drawWinJewel(k); requestAnimationFrame(run); } else drawWinJewel(0);
      };
      // пауза площадки останавливает блеск, продолжение запускает заново
      winShineRun = () => {
        clearInterval(winShineTimer);
        if (e !== epoch || $('win-overlay').classList.contains('hidden')) return;
        winShineTimer = setInterval(() => { k0 = performance.now(); run(); }, 3200);
      };
      setTimeout(() => { k0 = performance.now(); run(); }, 450);
      if (!pauseAt) winShineRun();
    }
  }

  /* Под изделием в окне победы: «×2 за видео» (монеты попытки ещё раз, один
     раз за победу) и значок «Без рекламы» (с 7-го уровня, не чаще раза в день). */
  let winTok = null;
  function renderWinExtra() {
    const amount = attemptCoins;
    winTok = { done: false, amount, level: L.id };
    const x2 = $('btn-x2');
    const canX2 = amount > 0 && rewardOn();
    x2.classList.toggle('hidden', !canX2);
    x2.disabled = !!rewardBusy.win_x2;
    x2.setAttribute('aria-label', ownerSkip() ? 'Удвоить монеты бесплатно' : 'Удвоить монеты за видео');
    if (canX2) track('ad_offer', { place: 'win_x2', format: 'reward', level: L.id });
    const today = WSAnalytics.dayNumber();
    const offer = L.id >= NOADS_FROM_LEVEL && payOn() && !isOwner() && Store.data.flags.noadsOfferDay !== today;
    $('btn-win-noads').classList.toggle('hidden', !offer);
    if (offer) { Store.data.flags.noadsOfferDay = today; Store.save(); }
    $('ws-win-extra').classList.toggle('hidden', !canX2 && !offer);
  }

  function onX2() {
    const tok = winTok;
    if (!tok || tok.done || $('win-overlay').classList.contains('hidden')) return;
    sfx('click');
    rewardAd('win_x2', () => {
      if (tok.done) return 0;
      tok.done = true;
      Store.data.coins += tok.amount;
      track('coin_earn', { src: 'ad_x2', amount: tok.amount, level: tok.level });
      Store.save();
      if (winTok === tok && !$('win-overlay').classList.contains('hidden')) {
        $('btn-x2').classList.add('hidden');
        $('ws-win-extra').classList.toggle('hidden', $('btn-win-noads').classList.contains('hidden'));
        $('ws-win-coins').textContent = '+' + (tok.amount * 2);
        bump($('ws-win-coins').parentElement);
        $('ws-win-bank-n').textContent = String(Store.data.coins);
        bump($('ws-win-bank'));
        sfx('reward');
      }
      shownCoins = Store.data.coins;
      renderCoins(false);
      return tok.amount;
    });
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
    const lk = playLook();
    WsJewel.draw(g, lk.shape, L.orders.length, seqGems(st), box, { drawGem: WsBoard.drawGem, closeup: true, metal: lk.metal });
    if (k > 0 && k < 1) WsJewel.shine(g, box, k);
  }

  async function nextFromWin() {
    if (nextBusy || pauseAt) return;
    sfx('click');
    const mode = $('btn-next').dataset.mode;
    if (mode === 'chest') {
      const ci = collOfIdx(levelIdx);
      leaveToMenu();
      later(() => openChest(ci), REDUCED ? 0 : 350);
    } else if (mode === 'next' && levelIdx < LEVELS.length - 1) {
      track('next_click', { level: L.id, stars: Store.data.stars[String(L.id)] || 0, moves });
      ftueStep(4, 'first_next');
      const from = levelIdx, e0 = epoch;
      nextBusy = true;
      try { await interstitialOnNext(); } catch (err) { /* без рекламы — дальше */ }
      nextBusy = false;
      if (levelIdx === from && epoch === e0 && screen === 'game') loadLevel(from + 1);
    } else leaveToMenu();
  }

  /* Межуровневая реклама — только здесь, по «Дальше» после победы, и только
     когда пройдено не меньше ads.interstitial.minLevels (6) уровней. После
     поражения, «Заново» и выхода в меню её нет. Нет ролика — сразу дальше. */
  async function interstitialOnNext() {
    const level = L.id;
    const ic = adsCfg().interstitial || {};
    const skip = (reason, wait) => track('ad_skip', { place: 'next', format: 'interstitial', reason, wait: wait || 0, level });
    if (isOwner()) { skip('owner'); return; }
    if (Object.keys(Store.data.stars).length < (Number.isFinite(ic.minLevels) ? ic.minLevels : 6)) { skip('early'); return; }
    if (!WSPlatform.supports('interstitial')) return;
    const res = await WSPlatform.showInterstitial('next');
    if (res.reason === 'interval' || res.reason === 'after_rewarded') {
      const ps = WSPlatform.state(), now = Date.now();
      const left = res.reason === 'interval'
        ? ps.lastInterstitialAt + (ic.intervalSec || 0) * 1000 - now
        : ps.lastRewardedAt + (ic.afterRewardedSec || 0) * 1000 - now;
      skip(res.reason === 'interval' ? 'interval' : 'near_reward', Math.max(0, Math.ceil(left / 1000)));
    }
  }

  function leaveToMenu() {
    if (L && !won && screen === 'game') {
      if (R.isWon(st)) {
        const r = recordWin();
        track('level_win', {
          level: L.id, moves, stars: r.stars, best: Store.data.best[String(L.id)], par: L.par, hard: L.hard ? 1 : 0,
          hints: stats.hints, undos: stats.undos, restarts: stats.restarts, coins: attemptCoins, sec: levelSec(),
          first: r.prevStars ? 0 : 1, left: 1
        });
        coinEarn('orders', attemptCoins - r.bonus, L.id);
        ftueStep(3, 'first_win');
        if (Object.keys(Store.data.stars).length >= 3) ftueStep(5, 'third_win');
      } else {
        track('level_quit', { level: L.id, moves, delivered: st.delivered, sec: levelSec(), lost: lost ? 1 : 0 });
        coinEarn('orders', attemptCoins, L.id);
      }
    }
    epoch++;
    cancelSearch();
    busy = false;
    resetFlow();
    sel = -1;
    lost = false;
    pendingUnlock = -1;
    cancelLater(cardTimer); cardJob = null;
    clearInterval(winShineTimer);
    Fx.clear();
    b2('leave');
    shownCoins = Store.data.coins;
    hideToast();
    closeModal(true);
    WsBoard.setTutorial(-1);
    if (L) saveGame();
    Store.flush();          // конец уровня: облако дописывается сразу
    nextBusy = false;
    $('win-overlay').classList.add('hidden');
    $('lose-overlay').classList.add('hidden');
    document.body.classList.remove('is-hard');
    showScreen('screen-menu');
    renderMenu();
    syncBanner();
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
  function chestPic(kind, id) {
    const d = decorItem(kind, id);
    return '<div class="ws-chest is-open ws-chest-big">' +
      (d ? (d.img ? '<span class="ws-chest-prize is-pic" style="background-image:' + decorPic(d) + '"></span>'   // B3: подушка/тумба — картинкой
        : '<span class="ws-chest-prize" style="background:' + (d.swatch || '#fff') + '"></span>') : '') + '</div>';
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
    b2('menu');   // B2: кнопка шкатулки, любимое на пьедестале, следующая цель
  }

  /* ---------- карта (образ — ref/workshop/concept/03_map.jpeg) ----------
     Места на дорожке снизу вверх: пять уровней коллекции, затем её шкатулка.
     Дорожка — синусоида через места; у каждой начатой коллекции на пьедестале
     стоит последнее готовое изделие; героиня — рядом с уровнем кнопки «Играть». */
  const MAP = { step: 80, top: 132, bottom: 150, k: 0.8, phase: 0.6, chGap: 96 };   // chGap — промежуток у границы глав (B3)
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
    const ch2 = slots.findIndex(sl => sl.i === CH1_LEVELS);   // первое место главы 2 (B3): выше него — второй зал
    const gap = ch2 > 0 ? MAP.chGap : 0;
    const H = MAP.top + (slots.length - 1) * MAP.step + MAP.bottom + gap;
    track.style.height = H + 'px';
    const amp = Math.min(W * 0.27, 140);
    const wave = (s) => Math.sin(s * MAP.k + MAP.phase);
    const at = (s) => ({ x: W / 2 + amp * wave(s), y: H - MAP.bottom - s * MAP.step - (gap && s >= ch2 ? gap : 0) });
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
        const lk = look(lv);   // B2: как изделие лежит в шкатулке
        WsJewel.draw(g, lk.shape, lv.orders.length, lk.gems, { x: 2, y: 2, w: w - 4, h: h - 4 }, { drawGem: WsBoard.drawGem, closeup: 3.2, metal: lk.metal });
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
        (done ? ', пройден, звёзд ' + Store.data.stars[lv.id] + (Store.data.best[lv.id] ? ', лучший результат ' + movesWord(Store.data.best[lv.id]) : '') : open ? ', открыт' : ', закрыт') +
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
        me.style.left = (p.x + side * 27) + 'px';   // остриё воткнуто в «плечо» монеты (радиус ~47)
        me.style.top = (p.y - 27) + 'px';
        track.appendChild(me);
      }
    });
    if (gap) mapChapterLine((at(ch2 - 1).y + at(ch2).y) / 2);
    draws.forEach(d => d());
    justWon = 0;
    map.scrollTop = Math.max(0, at(curSlot).y - map.clientHeight * 0.58);
    mapChapterBg();
    b2('mapDrawn');   // B2: цель над шкатулкой живёт в дорожке — после перерисовки ставится заново
  }

  /* ---------- B3: глава 2 на карте ----------
     Граница глав — золотая нить с лентой «Глава 2» на дорожке; выше неё под дорожкой
     второй зал (#ws-map-bg2, bg_map2): слой стоит, как комната главы 1, а его нижний край
     (--cut, workshop_shop.css) идёт за границей при прокрутке. */
  function mapChapterLine(y) {
    const line = document.createElement('div');
    line.className = 'ws-map-ch';
    line.id = 'ws-map-ch';
    line.style.top = y + 'px';
    line.setAttribute('role', 'separator');
    line.setAttribute('aria-label', 'Глава 2');
    line.innerHTML = '<span class="ws-map-ch-label" aria-hidden="true">Глава 2</span>';
    $('ws-map-track').appendChild(line);
  }
  function mapChapterBg() {
    const menu = $('screen-menu'), map = $('ws-map');
    let bg = $('ws-map-bg2');
    if (!bg) {
      bg = document.createElement('div');
      bg.id = 'ws-map-bg2';
      bg.className = 'ws-map-bg2';
      bg.setAttribute('aria-hidden', 'true');
      menu.insertBefore(bg, menu.firstChild);
      map.addEventListener('scroll', mapChapterBg, { passive: true });
    }
    const line = $('ws-map-ch');
    bg.classList.toggle('is-off', !line);
    if (line) bg.style.setProperty('--cut', Math.round(line.getBoundingClientRect().top - menu.getBoundingClientRect().top) + 'px');
  }

  function chestButton(ci) {
    const b = document.createElement('button');
    b.type = 'button';
    const done = collDone(ci), opened = !!Store.data.chests[ci];
    b.className = 'ws-chest' + (opened ? ' is-open' : done ? ' is-ready' : ' is-locked');
    const c = COLLECTIONS[ci];
    b.setAttribute('aria-label', 'Шкатулка коллекции «' + c.name + '»: ' + (opened ? 'открыта' + (c.decor ? ', в ней было «' + decorName(c.decor[0], c.decor[1]) + '»' : '') : done ? 'можно открыть' : 'пройдите все пять уровней коллекции'));
    b.addEventListener('click', () => {
      if (opened) { sfx('click'); openDecor('chest'); return; }
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
    const [kind, id] = c.decor || [null, null];   // decor: null — в шкатулке только монеты
    Store.data.chests[ci] = true;
    Store.data.coins += c.coins;
    if (kind) Store.data.decor[kind] = id;           // новое убранство сразу на столе
    Store.save();
    applyDecor();
    sfx('reward');
    Confetti.burst({ count: 80, durationMs: 2600, colors: CONFETTI });
    track('chest', { collection: ci, coins: c.coins, decor: id });
    coinEarn('chest', c.coins);
    renderMenu();
    showModal({
      kicker: '«' + c.name + '»', title: 'Шкатулка открыта!', coins: c.coins,
      sr: coinsWord(c.coins) + (kind ? ' и новое убранство «' + decorName(kind, id) + '»' : ''),
      pic: chestPic(kind, id), ok: 'Красота!', okIcon: true
    });
    bump($('ws-menu-coins'));
  }

  /* ---------- B3: лавка — единственное окно убранства (workshop_shop.js) ----------
     Выбрать своё и купить за монеты — одно окно «Лавка» (decor-overlay). Здесь только
     связка с игрой: что окну можно трогать (сейв — только через Store). */
  const decorPic = (d) => 'url(workshop_assets/' + d.img + '.webp)';
  const Shop = WsShop.create({
    $, Store, DECOR, COLLECTIONS, decorItem, decorPic,
    owns: (kind, id) => owns(kind, id),
    payOn: () => payOn(),
    openNoads: (from) => openNoads(from),
    applyDecor: () => applyDecor(),
    track: (name, data) => track(name, data),
    toast: (msg, ms) => toast(msg, ms),
    sfx: (name) => sfx(name),
    confetti: () => Confetti.burst({ count: 60, durationMs: 2000, colors: CONFETTI }),
    coinsChanged: () => { shownCoins = Store.data.coins; renderCoins(true); },
    focusBack: () => $('btn-decor').focus()
  });
  function renderDecor() { Shop.render(); }
  function openDecor(from) { Shop.open(from || 'map'); }
  function closeDecor() { Shop.close(); }

  /* Надеть убранство из Store.data.decor (точка расширения лавки: таблица DECOR):
     бархат — класс cloth-<id> и has-cloth с цветами в --ws-cloth-*, стекло —
     WsBoard.setTube({ tint, rim }), подушка и тумба — картинки в --ws-cushion
     и --ws-pedestal (по умолчанию — из workshop.css). */
  function applyDecor() {
    const b = document.body;
    const cloth = decorItem('cloth', Store.data.decor.cloth) || DECOR.cloth[0];
    DECOR.cloth.forEach(d => b.classList.toggle('cloth-' + d.id, !!d.velvet && d === cloth));
    b.classList.toggle('has-cloth', !!cloth.velvet);
    ['1', '2', '3'].forEach((k, i) => {
      if (cloth.velvet) b.style.setProperty('--ws-cloth-' + k, cloth.velvet[i]); else b.style.removeProperty('--ws-cloth-' + k);
    });
    if (cloth.rim) b.style.setProperty('--ws-cloth-rim', cloth.rim); else b.style.removeProperty('--ws-cloth-rim');
    const tube = decorItem('tube', Store.data.decor.tube) || DECOR.tube[0];
    WsBoard.setTube({ tint: tube.tint, rim: tube.rim });
    ['cushion', 'pedestal'].forEach(kind => {
      const d = decorItem(kind, Store.data.decor[kind]) || DECOR[kind][0];
      if (d === DECOR[kind][0]) b.style.removeProperty('--ws-' + kind); else b.style.setProperty('--ws-' + kind, decorPic(d));
    });
  }

  /* Открыть уровень: если именно он сохранён незаконченным — продолжить. */
  function startLevel(i) {
    const cur = restoreGame(Store.data.cur);
    loadLevel(i, cur && cur.idx === i ? cur : null);
  }

  function applyMute() {
    Sound.setMuted(Store.data.muted);
    ['btn-sound', 'btn-sound-game'].forEach(id => { if ($(id)) $(id).setAttribute('aria-pressed', Store.data.muted ? 'true' : 'false'); });
    const v = $('btn-vibro');
    v.classList.toggle('hidden', !canVibrate);
    v.setAttribute('aria-pressed', Store.data.novibe ? 'true' : 'false');
    v.setAttribute('aria-label', Store.data.novibe ? 'Вибрация выключена' : 'Вибрация включена');
  }

  /* ---------- B2: выбор оправы, шкатулка, первые минуты ----------
     Окна, кнопки и события выбора и шкатулки — workshop_case.js (WsCase);
     здесь только вид изделия и узкий интерфейс к игре (b2Api, отдаётся WsCase.attach).
     Вид изделия: { metal, shape, gems }. look(lv) — как оно лежит в шкатулке
     (pieces, иначе выбор, иначе золото и первая форма, камни заказов);
     playLook() — как его собирают сейчас (выбор, иначе прежнее изделие).
     Сбой WsCase не ломает игру: b2() ловит и пишет console.error. */
  function shapesCtx() {
    const out = {};
    LEVELS.forEach(l => { out[String(l.id)] = [l.piece, l.piece + '2'].filter(p => WsJewel.ART[p]); });
    return out;
  }
  function look(lv) {
    const id = String(lv.id), p = Store.data.pieces[id], c = Store.data.choice[id];
    return {
      metal: (p && p.metal) || (c && c.metal) || 'gold',
      shape: (p && p.shape) || (c && c.shape) || lv.piece,
      gems: p && p.gems && p.gems.length ? p.gems : lv.orders
    };
  }
  function playLook() {
    if (!L) return { metal: 'gold', shape: 'ring' };
    const id = String(L.id), c = Store.data.choice[id], p = Store.data.pieces[id];
    return { metal: (c && c.metal) || (p && p.metal) || 'gold', shape: (c && c.shape) || (p && p.shape) || L.piece };
  }
  function b2(name, a, b) {
    const C = window.WsCase;
    if (!C || typeof C[name] !== 'function') return undefined;
    try { return C[name](a, b); } catch (e) { console.error('B2 ' + name, e); return undefined; }
  }
  function b2Api() {
    const api = {
      Store, LEVELS, COLLECTIONS, PER_COLL, REDUCED, Fx,
      collLevels, collDone, collCount, isPassed, isOpen, track, ftueStep, sfx, toast, bump,
      gemItem, drawGem: (g, gem, x, y, s, a) => WsBoard.drawGem(g, gem, x, y, s, a), look, playLook,
      sizeCanvas, introduce, decorItem, decorName, chestPic, seqGems, syncBanner, startLevel,
      socket: (i) => Piece.socket(i), redrawPiece: () => Piece.request(), drawWinJewel, renderMenu,
      levelName: (lv) => lv.name
    };
    Object.defineProperties(api, {
      L: { get: () => L }, levelIdx: { get: () => levelIdx }, screen: { get: () => screen },
      won: { get: () => won }, epoch: { get: () => epoch }, view: { get: () => view },
      pieceGems: { get: () => pieceGems }, st: { get: () => st }, modalOpen: { get: () => modalOpen },
      paused: { get: () => !!pauseAt }
    });
    return api;
  }

  /* ---------- запуск ---------- */
  /* Порядок запуска: интерфейс и обработчики → WSPlatform.init() → сейв →
     карта (новый игрок тоже начинает с карты) → тарифы и восстановление
     покупок по журналу сервера (не задерживают карту). */
  async function init() {
    b2('attach', b2Api());   // B2: workshop_case.js строит окна и кнопки
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
    assetBase = assets;
    WsBoard.init($('board-canvas'), {
      spriteOf: (t) => (GEMS[t] ? GEMS[t].sprite : 0),
      colorOf: (t) => (GEMS[t] ? GEMS[t].color : '#c33'),
      atlasUrl,
      onAtlas: redrawArt
    });
    WsJewel.load(assets, redrawArt);
    Fx.init($('fx-canvas'));
    Piece.init($('ws-piece'));
    Confetti.init($('confetti-canvas'));

    // ввод по полю: pointer-события покрывают мышь и касания
    const cv = $('board-canvas');
    let downX = 0, downY = 0;
    cv.addEventListener('pointerdown', (ev) => { downX = ev.clientX; downY = ev.clientY; });
    cv.addEventListener('pointerup', (ev) => {
      if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 12) return; // свайп — не касание
      tapVial(WsBoard.hitTest(ev.clientX, ev.clientY));
    });
    document.addEventListener('keydown', (ev) => {
      if (pauseAt) return;            // пауза площадки: ввод закрыт (VK-R2)
      if (window.WsHelp && WsHelp.key(ev)) return;   // VK-03: «Как играть» открыто — поле не слушает
      if (b2('key', ev)) return;   // B2: окна выбора, шкатулки, «В избранное»
      if (!$('thanks-overlay').classList.contains('hidden')) {
        if (ev.key === 'Escape' || ev.key === 'Enter') { ev.preventDefault(); closeThanks(); }
        return;
      }
      if (!$('noads-overlay').classList.contains('hidden')) {
        if (ev.key === 'Escape') { ev.preventDefault(); sfx('click'); closeNoads(); }
        return;
      }
      if (Shop.isOpen() && !modalOpen) {
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
    // кнопки окна лавки (главная, крестик, вкладки, фон) — в workshop_shop.js (B3)
    $('btn-noads').addEventListener('click', () => openNoads('map'));
    $('btn-win-noads').addEventListener('click', () => openNoads('win'));
    $('btn-noads-close').addEventListener('click', () => { sfx('click'); closeNoads(); });
    $('noads-overlay').addEventListener('click', (ev) => { if (ev.target === $('noads-overlay')) { sfx('click'); closeNoads(); } });
    $('btn-thanks-ok').addEventListener('click', closeThanks);
    $('btn-x2').addEventListener('click', onX2);
    $('btn-more-video').addEventListener('click', moreByVideo);
    $('ws-menu-coins').addEventListener('click', () => toast('Монеты — за заказы', 1800));
    $('ws-coins').addEventListener('click', () => toast('Монеты — за заказы', 1800));
    ['btn-sound', 'btn-sound-game'].filter(id => $(id)).forEach(id => $(id).addEventListener('click', () => {
      Store.data.muted = !Store.data.muted;
      Store.save();
      applyMute();
      sfx('click');
    }));
    $('btn-vibro').addEventListener('click', () => {
      Store.data.novibe = !Store.data.novibe;
      Store.save();
      applyMute();
      sfx('click');
      vibrateWin();          // включили — сразу тот же лёгкий отклик, что на победе
    });
    $('btn-start').addEventListener('click', onStart);
    // VK-03: «Как играть» — «?» на карте и на уровне; цены — из правил игры, а не из текста
    if (window.WsHelp) WsHelp.attach({ sfx, track, screen: () => screen, level: () => (L ? L.id : 0),
      deselect: () => { sel = -1; if (st) WsBoard.select(-1); },
      hintPrice: HINT_PRICE, freeHint: FREE_HINT_LEVELS, moreMoves: MORE_MOVES, morePrice: MORE_PRICE });
    // пауза — от площадки (вкладка скрыта, свернули, реклама, оплата)
    WSPlatform.onPause(onPause);
    WSPlatform.onResume(onResume);
    // скрытая вкладка: декоративные CSS-анимации всех экранов стоят (перф 1.0)
    document.addEventListener('visibilitychange', () => document.body.classList.toggle('ws-background', document.hidden));
    WSPlatform.onResume((src) => { if (src === 'view' || src === 'doc') payRetry(); });
    WSPlatform.onLateReward(onLateReward);
    WSPlatform.onEvent(onPlatformEvent);
    // любое окно открылось или закрылось — баннер прячется или возвращается
    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => syncBanner());
      OVERLAYS.forEach(id => mo.observe($(id), { attributes: true, attributeFilter: ['class'] }));
    }
    /* G1: ряды пробирок выбираются заново только при новом уровне, повороте или
       заметном resize окна (другая ширина, высота на четверть и больше). Баннер,
       плашки, тосты и полоска «следующие» рядов не меняют. */
    let resizeRaf = 0, fullRelayout = false, winW = window.innerWidth, winH = window.innerHeight;
    const relayout = (full) => {
      if (full) fullRelayout = true;
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const f = fullRelayout;
        fullRelayout = false;
        Fx.resize();
        if (screen === 'game') { WsBoard.resize(f); Piece.resize(); updateGuide(); }
        if (screen === 'menu') renderMap();
        if (!$('win-overlay').classList.contains('hidden')) drawWinJewel(0);
      });
    };
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      const turned = (w > h) !== (winW > winH);
      const big = w !== winW || turned || Math.abs(h - winH) > Math.max(160, winH * 0.25);
      winW = w; winH = h;
      if (big) { winResizeAt = performance.now(); fieldBanner('window'); }
      relayout(big);
    });
    // баннер появился или ушёл: экран стал ниже или выше (--ws-banner-h); поле держит своё место.
    // Сразу после поворота или заметного resize баннер — часть того же изменения окна: ряды выбираются заново.
    WSPlatform.banner.onChange(() => {
      bannerStat();
      const moved = fieldBanner('change');
      relayout(moved && performance.now() - winResizeAt < 1500);
    });
    // баннер — только после первого касания, когда оно уже сработало
    document.addEventListener('click', () => {
      if (tapped) return;
      tapped = true;
      setTimeout(syncBanner, 0);
    }, true);

    // штамп сборки (build_workshop.py подставляет значение в meta)
    const meta = document.querySelector('meta[name="ws-build"]');
    if (meta && meta.content && meta.content !== 'dev') {
      const b = document.createElement('div');
      b.className = 'build-badge';
      b.textContent = meta.content;
      document.body.appendChild(b);
    }

    if (window.WsBoot) WsBoot.wait(25000);   // VK-01: ожидание площадки (до 8 + 8 с) — не отказ загрузки
    try { await WSPlatform.init({ saveKey: SAVE_KEY }); } catch (e) { /* площадка не роняет запуск */ }
    let raw = null;
    try { raw = await WSPlatform.loadSave(); } catch (e) { raw = null; }
    Store.load(raw);
    Store.data.sessions++;
    Store.save();
    /* ?level=N — открыть уровень сразу (проверки и отладка; замок не действует). Только вне пакета ВК
       (ревью 1.0, P2-2): игрок ВК не обходит замок уровней адресом. Читается до WSAnalytics.init — та
       очищает адрес от параметров запуска ВК (P0-2). */
    const startLevel = (window.WS_CONFIG || {}).target === 'vk' ? null : /[?&]level=(\d+)/.exec(location.search);
    WSAnalytics.init({ install: Store.data.install, sessions: Store.data.sessions });
    track('session_start', { coins: Store.data.coins, passed: Object.keys(Store.data.stars).length });
    document.body.classList.toggle('is-owner', isOwner());
    applyDecor();
    applyMute();
    // ?level=N (проверки вне ВК) открывает уровень сразу — без стартового экрана
    if (startLevel && LEVELS[+startLevel[1] - 1]) { showScreen('screen-menu'); renderMenu(); } else showScreen('screen-start');
    booted = true;
    if (window.WsBoot) WsBoot.ready();       // VK-02: стартовый экран готов — заставка уходит сразу
    syncBanner();
    if (startLevel && LEVELS[+startLevel[1] - 1]) loadLevel(+startLevel[1] - 1);
    try { catalog = (await WSPlatform.catalog()) || []; } catch (e) { catalog = []; }
    refreshOwner();
    const out = await paySync('restore', (c) => WSPlatform.purchases(c));
    if (out.grants.length) toast('Покупка зачислена', 2400);
  }

  /* Сводка ритма по журналу событий: пауза между выдачами (в ходах),
     доля «Дальше» после победы, каскады. */
  window.__wsMetrics = () => {
    const ev = window.__wsEvents || [];
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
        won, lost, winCount, levelWins, busy: busy || checking || !!hintPending, sel, moves, undoDepth: hist.length,
        pouring, jobs: jobs.length + (jobOn ? 1 : 0), pend: pend.size, searching: checking || !!hintPending,
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
        decor: Object.assign({}, Store.data.decor),
        booted, owner: isOwner(), noadsUntil: Store.data.pay.noadsUntil, royal: Store.data.pay.royal,
        pay: Object.assign({}, Store.data.pay), owned: Object.assign({}, Store.data.owned),
        flags: Object.assign({}, Store.data.flags), sessions: Store.data.sessions, v: WorkshopSave.VERSION,
        catalog: catalog.length, payOn: payOn(), rewardOn: rewardOn(), paused: !!pauseAt,
        banner: (() => { try { return WSPlatform.state().bannerHeight; } catch (e) { return 0; } })(),
        bannerWanted, rewardBusy: Object.keys(rewardBusy).filter(k => rewardBusy[k]),
        rewardLate: Object.keys(rewardLate), paySyncs, payPending,
        b2: b2('state') || null
      };
    },
    vialCenter(i) {
      const r = WsBoard.vialClientRect(i);
      return r && { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
    },
    solution() { return L ? L.solution.map(m => [m.from, m.to]) : null; },
    layout() { return WsBoard.layout(); },
    // поле как оно нарисовано сейчас (G1: после всех анимаций должно совпасть с правилами)
    board() { return { vials: WsBoard.shown().map(v => v.join('')), hid: WsBoard.hidden(), locked: WsBoard.lockedVial(), anim: WsBoard.isAnimating() }; },
    atlasReady() { return WsBoard.atlasReady(); },
    levels() { return LEVELS.map(l => ({ id: l.id, piece: l.piece, hard: l.hard, limit: l.limit, par: l.par, s3: l.s3, s2: l.s2, novelty: l.novelty })); },
    productId: PRODUCT_ID, saveKey: SAVE_KEY
  };

  // VK-01: запуск упал — не белый экран, а «Не удалось загрузить» и «Повторить» (workshop.html)
  init().catch((e) => { try { console.error(e); } catch (x) { /* без консоли */ } if (window.WsBoot) WsBoot.fail('init'); });
})();
