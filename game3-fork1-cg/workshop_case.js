/* Ювелир Ленд — выбор оправы, шкатулка, первые минуты (релиз 1.0, волна B2).

   Подключается ДО workshop.js: окна и кнопки строятся сразу при загрузке (их id
   нужны списку OVERLAYS, по которому прячется баннер), а игра потом передаёт
   узкий интерфейс в attach(api) — см. b2Api() в workshop.js. Игра зовёт крючки
   через b2(): сбой здесь пишется в console.error и игру не ломает.

   S1  Выбор: перед первым запуском уровня, начиная с 4-го, — окно «Выберите
       оправу», две карточки одного изделия (металл, иногда и форма). Выбор —
       Store.data.choice[id] = { metal, shape }; при повторном запуске окна нет.
       С WS_CONFIG.choiceInline (CrazyGames, ТЗ Ж-11) окна нет: левая карточка
       надета сразу, а две кнопки-образца под изделием меняют её до первого хода.
       Главный камень: пустое главное гнездо пульсирует, на заказчицах — корона,
       выдача в главное место — кольцо, искры и свой звук.
   S2  Шкатулка: 12 коллекций × 5 изделий; несобранные — силуэтами. Касание —
       крупный показ с бликом и сердцем «любимое» (одно на игру, Store.data.fav);
       любимое стоит на пьедестале у кнопки «Играть» на карте.
   S3  Первые минуты: после первых трёх побед изделие улетает в кнопку шкатулки;
       у ближайшей неоткрытой шкатулки на карте — её награда; один раз после
       3-й победы — «В избранное» (только где площадка это умеет).

   Сейв: choice, pieces (пишет workshop.js при победе), fav, flags.favAsked.
   События: choice_shown, choice_pick, case_open, piece_view, fav_set, fav_ask,
   fav_result, ftue_step 6–8 (docs/WORKSHOP_ANALYTICS.md).
   Описание — docs/WORKSHOP.md, «Выбор и шкатулка». */
window.WsCase = (function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const T = WsI18n.t;
  const OVERLAYS = ['choice-overlay', 'case-overlay', 'view-overlay', 'favask-overlay'];
  const CHOICE_FROM = 3;     // индекс уровня: окно выбора — с 4-го уровня
  const FLY_WINS = 3;        // первые три победы: изделие улетает в кнопку шкатулки
  const FAV_WINS = 3;        // «В избранное» — после 3-й победы
  // пары металлов по кругу: соседние уровни предлагают разное
  const PAIRS = [['gold', 'rose'], ['rose', 'white'], ['white', 'gold']];
  // вторая форма заметно беднее первой (лист screenshots_out/b2/metals_k8.png):
  // серьги-гвоздики и колье-цепочка теряют почти все камни. Там обе карточки —
  // первая форма разных металлов (docs/WORKSHOP.md, «Выбор и шкатулка»).
  const POOR2 = { earrings: true, necklace: true };
  const METAL = {
    gold: { name: 'Золото', sw: 'radial-gradient(circle at 35% 30%, #fff6d2, #e6b552 50%, #8a561a)' },
    rose: { name: 'Розовое золото', sw: 'radial-gradient(circle at 35% 30%, #ffe9e0, #e0a08c 50%, #7c3e30)' },
    white: { name: 'Белое золото', sw: 'radial-gradient(circle at 35% 30%, #ffffff, #c9ced8 50%, #5c6270)' }
  };
  const SIL = 'rgba(123, 63, 108, 0.32)';   // силуэт несобранного изделия
  const HEART_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.6-4.6-7.6-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.6 2.6c0 5.6-7.6 10.2-7.6 10.2z" fill="#fff"/></svg>';

  let api = null;
  let choice = null;        // открытое окно выбора: { id, level, kind, cards, t0, resume, epoch, tries }
  let mini = null;          // выбор на экране уровня (choiceInline): { id, level, kind, cards, slot, t0, picked }
  let caseFrom = null;      // шкатулка открыта: 'map' | 'win'
  let viewLv = null;        // крупный показ: уровень
  let viewRaf = 0, viewT0 = 0, viewTries = 0;
  let favask = null;        // окно «В избранное»: { level }
  let winTimers = [];
  let menuTimer = 0;
  let pulseKey = '';
  let freshId = 0;          // последнее новое изделие — подсвечено в шкатулке, пока её не откроют
  let caseRetry = 0;

  /* ---------- окна и кнопки: строятся при загрузке ---------- */
  function build() {
    const box = (id, kicker, inner, cls) =>
      '<div id="' + id + '" class="ws-win ws-modal ' + cls + ' hidden" role="dialog" aria-modal="true" aria-labelledby="' + id + '-title">' +
      '<div class="ws-win-box"><div class="ws-win-kicker" id="' + id + '-title">' + kicker + '</div>' + inner + '</div></div>';
    document.body.insertAdjacentHTML('beforeend',
      box('choice-overlay', 'Выберите оправу',
        '<p class="ws-sr" id="ws-choice-sr"></p><div class="ws-choice-cards" id="ws-choice-cards"></div>', 'ws-choice') +
      box('case-overlay', 'Шкатулка',
        '<button id="btn-case-close" class="ws-x" type="button" aria-label="Закрыть"></button>' +
        '<p class="ws-sr" id="ws-case-sr"></p><div class="ws-case-list" id="ws-case-list" role="list"></div>', 'ws-case') +
      box('view-overlay', '',
        '<button id="btn-view-close" class="ws-x" type="button" aria-label="Закрыть"></button>' +
        '<div class="ws-view-stage"><canvas id="ws-view-art" class="ws-view-art" aria-hidden="true"></canvas></div>' +
        '<p class="ws-sr" id="ws-view-sr"></p>' +
        '<button id="btn-fav" class="ws-fav" type="button" aria-pressed="false" aria-label="Любимое изделие"></button>', 'ws-view') +
      box('favask-overlay', 'В избранное',
        '<button id="btn-favask-close" class="ws-x" type="button" aria-label="Закрыть"></button>' +
        '<p class="ws-sr">Добавьте игру в избранное — Ювелир Ленд всегда будет под рукой.</p>' +
        '<div class="ws-favask-pic" aria-hidden="true"></div>' +
        '<button id="btn-favask-ok" class="ws-play ws-favask-ok" type="button" aria-label="Добавить в избранное">' + HEART_SVG + '</button>', 'ws-favask'));

    // карта: шкатулка слева от «Играть», любимое изделие на пьедестале — справа
    const foot = document.querySelector('#screen-menu .ws-map-foot');
    if (foot) {
      foot.insertAdjacentHTML('afterbegin',
        '<button id="btn-case" class="ws-round ws-pic ws-map-case hidden" type="button" aria-label="Шкатулка: собранные изделия"></button>');
      foot.insertAdjacentHTML('beforeend',
        '<button id="btn-fav-map" class="ws-map-fav hidden" type="button" aria-label="Любимое изделие"><canvas class="ws-map-fav-art" aria-hidden="true"></canvas></button>');
    }
    // окно победы: кнопка шкатулки в левом верхнем углу (против счётчика монет)
    const win = document.querySelector('#win-overlay .ws-win-box');
    if (win) win.insertAdjacentHTML('afterbegin',
      '<button id="btn-win-case" class="ws-round ws-pic ws-win-case" type="button" aria-label="Шкатулка"></button>');
    // главное гнездо изделия в шапке уровня
    const stage = document.querySelector('#screen-workshop .ws-stage');
    if (stage) stage.insertAdjacentHTML('beforeend', '<span id="ws-main-pulse" class="ws-main-pulse hidden" aria-hidden="true"></span>' +
      '<span id="ws-choice-mini" class="ws-choice-mini hidden" role="group" aria-label="Выберите оправу"></span>');

    const on = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', (ev) => { if (api) fn(ev); }); };
    on('btn-case', () => openCase('map'));
    on('btn-win-case', () => openCase('win'));
    on('btn-case-close', () => { api.sfx('click'); closeCase(); });
    on('btn-view-close', () => { api.sfx('click'); closeView(); });
    on('btn-fav', toggleFav);
    on('btn-fav-map', () => {
      const lv = levelById(api.Store.data.fav);
      if (!lv) return;
      api.sfx('click');
      openView(lv, 'fav');
    });
    on('btn-favask-close', () => favaskAnswer(false));
    on('btn-favask-ok', () => favaskAnswer(true));
  }

  /* ---------- помощники ---------- */
  const isOpen = (id) => { const el = $(id); return !!el && !el.classList.contains('hidden'); };
  const show = (id) => $(id).classList.remove('hidden');
  const hide = (id) => $(id).classList.add('hidden');
  const anyWin = () => document.querySelectorAll('.ws-win:not(.hidden)').length > 0;
  const passedCount = () => api.LEVELS.reduce((n, l, i) => n + (api.isPassed(i) ? 1 : 0), 0);
  const idxById = (id) => api.LEVELS.findIndex(l => l.id === Number(id));
  function levelById(id) { const i = id ? idxById(id) : -1; return i >= 0 && api.isPassed(i) ? api.LEVELS[i] : null; }
  const formOf = (lv, shape) => (shape === lv.piece ? 1 : 2);
  const REDUCED = () => !!(api && api.REDUCED);
  function later(ms, fn) { winTimers.push(setTimeout(fn, ms)); }
  function clearWinTimers() { winTimers.forEach(clearTimeout); winTimers = []; }

  // холст под CSS-размер (или запасной w×h, пока окно не на виду)
  function canvasOf(cv, w0, h0) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth || w0, h = cv.clientHeight || h0;
    if (cv.width !== Math.round(w * dpr)) cv.width = Math.round(w * dpr);
    if (cv.height !== Math.round(h * dpr)) cv.height = Math.round(h * dpr);
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    return { g, w, h };
  }
  // изделие уровня, как оно лежит в шкатулке; false — картинка ещё не пришла
  function drawLook(cv, lv, w0, h0, closeup) {
    const { g, w, h } = canvasOf(cv, w0, h0);
    const lk = api.look(lv);
    WsJewel.draw(g, lk.shape, lv.orders.length, lk.gems, { x: 2, y: 2, w: w - 4, h: h - 4 },
      { drawGem: api.drawGem, closeup: closeup || true, metal: lk.metal });
    return WsJewel.ready(lk.shape);
  }

  /* ---------- S1: выбор оправы ---------- */
  function choiceCards(lv, idx) {
    const pair = PAIRS[idx % PAIRS.length], s2 = lv.piece + '2';
    if (!POOR2[lv.piece] && WsJewel.ART[s2]) {
      return { kind: 'metal_shape', cards: [{ metal: pair[0], shape: lv.piece }, { metal: pair[1], shape: s2 }] };
    }
    return { kind: 'metal', cards: [{ metal: pair[0], shape: lv.piece }, { metal: pair[1], shape: lv.piece }] };
  }
  const cardName = (lv, kind, c) => T(METAL[c.metal].name) + (kind === 'metal_shape' ? (formOf(lv, c.shape) === 1 ? T(', первая форма') : T(', вторая форма')) : '');

  function openChoice(resume) {
    const L = api.L;
    const c = choiceCards(L, api.levelIdx);
    choice = { id: String(L.id), level: L.id, kind: c.kind, cards: c.cards, t0: Date.now(), resume, epoch: api.epoch, tries: 0 };
    const box = $('ws-choice-cards');
    box.innerHTML = '';
    c.cards.forEach((cd, slot) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-choice-card';
      b.dataset.slot = String(slot);
      b.dataset.metal = cd.metal;
      b.setAttribute('aria-label', cardName(L, c.kind, cd));
      b.innerHTML = '<canvas class="ws-choice-art" aria-hidden="true"></canvas><span class="ws-choice-metal" aria-hidden="true"></span>';
      b.lastChild.style.background = METAL[cd.metal].sw;
      b.addEventListener('click', () => pick(slot));
      box.appendChild(b);
    });
    $('ws-choice-sr').textContent = T('{name}. Слева — {left}, справа — {right}.', { name: T(L.name), left: cardName(L, c.kind, c.cards[0]), right: cardName(L, c.kind, c.cards[1]) });
    hidePulse();
    show('choice-overlay');
    api.track('choice_shown', { level: L.id, kind: c.kind });
    api.syncBanner();
    drawChoice();
    setTimeout(() => { const b = box.querySelector('button'); if (choice && b) b.focus(); }, 60);
  }

  function drawChoice() {
    if (!choice || !api.L) return;
    const L = api.L, cvs = $('ws-choice-cards').querySelectorAll('canvas');
    let ready = true;
    choice.cards.forEach((cd, i) => {
      if (!cvs[i]) return;
      const { g, w, h } = canvasOf(cvs[i], 120, 120);
      WsJewel.draw(g, cd.shape, L.orders.length, L.orders, { x: 3, y: 3, w: w - 6, h: h - 6 },
        { drawGem: api.drawGem, closeup: true, metal: cd.metal });
      if (!WsJewel.ready(cd.shape)) ready = false;
    });
    if (!ready && choice.tries++ < 20) setTimeout(drawChoice, 250);
  }

  function pick(slot) {
    if (!choice) return;
    const c = choice, cd = c.cards[slot];
    if (!cd) return;
    choice = null;
    api.Store.data.choice[c.id] = { metal: cd.metal, shape: cd.shape };
    api.Store.save();
    const lv = api.LEVELS[idxById(c.level)];
    api.track('choice_pick', { level: c.level, metal: cd.metal, shape: lv ? formOf(lv, cd.shape) : 1, slot, ms: Math.min(3600000, Date.now() - c.t0) });
    api.ftueStep(6, 'first_choice');
    hide('choice-overlay');
    api.syncBanner();
    api.sfx('reveal');
    if (c.epoch !== api.epoch || api.screen !== 'game') return;
    api.redrawPiece();
    const cv = $('ws-piece');
    if (cv) {
      const r = cv.getBoundingClientRect();
      api.Fx.sparkle(r.left + r.width / 2, r.top + r.height / 2, Math.min(r.width, r.height) * 0.6);
    }
    if (!c.resume) api.introduce();
    requestAnimationFrame(updatePulse);
  }

  /* ---------- S1 на экране уровня (choiceInline, ТЗ Ж-11): без окна ----------
     Левая карточка надевается сразу (изделие видно с первого кадра), две кнопки-образца под изделием
     меняют оправу до первого хода; первый ход фиксирует выбор и убирает кнопки. */
  function openMini() {
    const L = api.L, c = choiceCards(L, api.levelIdx);
    mini = { id: String(L.id), level: L.id, kind: c.kind, cards: c.cards, slot: 0, t0: Date.now(), picked: false };
    api.Store.data.choice[mini.id] = { metal: c.cards[0].metal, shape: c.cards[0].shape };
    api.Store.save();
    const box = $('ws-choice-mini');
    if (!box) return;
    box.innerHTML = '';
    c.cards.forEach((cd, slot) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-choice-chip' + (slot === 0 ? ' is-on' : '');
      b.dataset.slot = String(slot);
      b.setAttribute('aria-label', cardName(L, c.kind, cd));
      b.setAttribute('aria-pressed', slot === 0 ? 'true' : 'false');
      b.innerHTML = '<canvas aria-hidden="true"></canvas>';
      b.style.setProperty('--sw', METAL[cd.metal].sw);
      b.addEventListener('click', () => pickMini(slot));
      box.appendChild(b);
    });
    box.classList.remove('hidden');
    api.track('choice_shown', { level: L.id, kind: c.kind, inline: true });
    drawMini(0);
  }
  function drawMini(tries) {
    if (!mini || !api.L) return;
    let ready = true;
    $('ws-choice-mini').querySelectorAll('canvas').forEach((cv, i) => {
      const cd = mini.cards[i], { g, w, h } = canvasOf(cv, 40, 40);
      WsJewel.draw(g, cd.shape, api.L.orders.length, [], { x: 1, y: 1, w: w - 2, h: h - 2 }, { drawGem: api.drawGem, closeup: true, metal: cd.metal });
      if (!WsJewel.ready(cd.shape)) ready = false;
    });
    if (!ready && tries < 20) setTimeout(() => drawMini(tries + 1), 250);
  }
  function pickMini(slot) {
    if (!mini || slot === mini.slot) return;
    const cd = mini.cards[slot];
    mini.slot = slot;
    mini.picked = true;
    api.Store.data.choice[mini.id] = { metal: cd.metal, shape: cd.shape };
    api.Store.save();
    $('ws-choice-mini').querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('is-on', i === slot);
      b.setAttribute('aria-pressed', i === slot ? 'true' : 'false');
    });
    api.sfx('reveal');
    api.redrawPiece();
    const cv = $('ws-piece');
    if (cv) {
      const r = cv.getBoundingClientRect();
      api.Fx.sparkle(r.left + r.width / 2, r.top + r.height / 2, Math.min(r.width, r.height) * 0.5);
    }
    requestAnimationFrame(updatePulse);
  }
  // первый ход: выбор зафиксирован (choice_pick — с номером карточки и тем, трогал ли игрок кнопки)
  function move() {
    if (!mini) return;
    const m = mini, cd = m.cards[m.slot], lv = api.LEVELS[idxById(m.level)];
    api.track('choice_pick', { level: m.level, metal: cd.metal, shape: lv ? formOf(lv, cd.shape) : 1, slot: m.slot,
      ms: Math.min(3600000, Date.now() - m.t0), inline: true, touched: m.picked });
    api.ftueStep(6, 'first_choice');
    hideMini();
  }
  function hideMini() {
    mini = null;
    const box = $('ws-choice-mini');
    if (box) { box.classList.add('hidden'); box.innerHTML = ''; }
  }

  /* главное гнездо: пульсирует, пока главный камень не выдан */
  function hidePulse() {
    const el = $('ws-main-pulse');
    if (el) el.classList.add('hidden');
    pulseKey = '';
  }
  function updatePulse() {
    const el = $('ws-main-pulse');
    if (!el || !api) return;
    const on = api.screen === 'game' && !!api.L && !api.won && !choice && !(api.pieceGems && api.pieceGems[0]);
    if (!on) { hidePulse(); return; }
    const st = el.parentElement.getBoundingClientRect(), s = api.socket(0);
    if (!st.width) return;
    const size = Math.max(16, Math.min(46, s.size * 1.3));
    const key = Math.round(s.x - st.left) + ',' + Math.round(s.y - st.top) + ',' + Math.round(size);
    if (key !== pulseKey) {
      pulseKey = key;
      el.style.left = Math.round(s.x - st.left) + 'px';
      el.style.top = Math.round(s.y - st.top) + 'px';
      el.style.width = el.style.height = Math.round(size) + 'px';
    }
    el.classList.remove('hidden');
  }
  // короны на заказчицах: первый выданный заказ ляжет в главное место
  function orders() {
    if (!api || !api.L) return;
    const on = !api.won && !!api.st && Array.isArray(api.st.seq) && api.st.seq.length === 0;
    document.querySelectorAll('#ws-orders .ws-card').forEach(card => {
      const cr = card.querySelector('.ws-crown');
      if (on && !cr && card.dataset.order != null) {
        const s = document.createElement('span');
        s.className = 'ws-crown';
        s.setAttribute('aria-hidden', 'true');
        card.appendChild(s);
      } else if (!on && cr) cr.remove();
    });
    updatePulse();
  }
  function mainGem(s) {
    if (!api) return;
    hidePulse();
    document.querySelectorAll('#ws-orders .ws-crown').forEach(c => c.remove());
    if (!s) return;
    api.Fx.ring(s.x, s.y, s.size * 1.5);
    api.Fx.sparkle(s.x, s.y, s.size * 1.6);
    api.sfx('star', { semis: 12 });
  }

  /* ---------- уровень: начало и уход ---------- */
  function levelStart(resume) {
    clearWinTimers();
    hidePulse();
    if (choice) { choice = null; hide('choice-overlay'); }
    const L = api.L, i = api.levelIdx;
    hideMini();
    if (L && i >= CHOICE_FROM && !api.isPassed(i) && !api.Store.data.choice[String(L.id)]) {
      if (api.cfg.choiceInline) { openMini(); requestAnimationFrame(updatePulse); return false; }
      openChoice(!!resume);
      return true;
    }
    requestAnimationFrame(updatePulse);
    return false;
  }
  function leave() {
    clearWinTimers();
    hidePulse();
    hideMini();
    if (choice) { choice = null; hide('choice-overlay'); api.syncBanner(); }
    const j = $('ws-win-jewel');
    if (j) j.classList.remove('is-flown');
  }
  function piece() { updatePulse(); }

  /* ---------- окно победы: шкатулка, полёт изделия, «В избранное» ---------- */
  function win(r) {
    clearWinTimers();
    hidePulse();
    const e = api.epoch;
    if (r && !r.prevStars && api.L) freshId = api.L.id;
    if (r && !r.prevStars && passedCount() <= FLY_WINS) later(REDUCED() ? 300 : 2200, () => flyToCase(e));
    if (favaskDue()) {
      later(REDUCED() ? 700 : 3400, () => {
        if (e === api.epoch && isOpen('win-overlay') && document.querySelectorAll('.ws-win:not(.hidden)').length === 1 && !api.modalOpen) openFavask();
      });
    }
  }
  function flyToCase(e) {
    if (!api || e !== api.epoch || !isOpen('win-overlay')) return;
    const src = $('ws-win-jewel'), dst = $('btn-win-case');
    const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
    if (!a.width || !a.height || !b.width) return;
    const snap = document.createElement('canvas');
    snap.width = src.width; snap.height = src.height;
    try { snap.getContext('2d').drawImage(src, 0, 0); } catch (err) { return; }
    const ar = a.height / a.width;
    const item = {
      x: a.left + a.width / 2, y: a.top + a.height / 2, size: Math.min(a.width, 260),
      draw: (g, x, y, s) => g.drawImage(snap, x - s / 2, y - s * ar / 2, s, s * ar)
    };
    src.classList.add('is-flown');
    api.Fx.fly([item], { x: b.left + b.width / 2, y: b.top + b.height / 2, size: b.width * 1.5 }, () => {
      src.classList.remove('is-flown');
      if (e !== api.epoch) return;
      api.bump(dst);
      api.sfx('reveal');
    }, { dur: 700, lift: 60, step: 0 });
  }

  /* ---------- S3: «В избранное» — один раз, после 3-й победы ---------- */
  function favaskDue() {
    if (!api || api.Store.data.flags.favAsked || passedCount() < FAV_WINS) return false;
    try { return !!(window.WSPlatform && WSPlatform.supports('favorites')); } catch (e) { return false; }
  }
  function openFavask() {
    if (!favaskDue() || isOpen('favask-overlay')) return false;
    const last = api.L || api.LEVELS.filter((l, i) => api.isPassed(i)).pop();
    favask = { level: last ? last.id : 0, done: false };
    api.Store.data.flags.favAsked = true;
    api.Store.save();
    $('btn-favask-ok').disabled = false;
    show('favask-overlay');
    api.track('fav_ask', { level: favask.level });
    api.syncBanner();
    api.sfx('reveal');
    setTimeout(() => { if (isOpen('favask-overlay')) $('btn-favask-ok').focus(); }, 60);
    return true;
  }
  function favaskAnswer(yes) {
    if (!favask) return;
    const f = favask;
    favask = null;
    hide('favask-overlay');
    api.syncBanner();
    const result = (res) => {
      if (f.done) return;
      f.done = true;
      api.track('fav_result', { level: f.level, result: res });
      if (res === 'added') api.toast(T('Ювелир Ленд в избранном'), 1800);
    };
    if (!yes) { api.sfx('click'); result('closed'); return; }
    api.sfx('click');
    let p;
    try { p = WSPlatform.addToFavorites(); } catch (e) { p = false; }
    Promise.resolve(p).then(v => (v ? 'added' : 'declined'), () => 'declined').then(result);
    setTimeout(() => result('declined'), 30000);   // площадка не ответила
  }

  /* ---------- карта: кнопка шкатулки, любимое, следующая цель ---------- */
  function menu() {
    if (!api) return;
    $('btn-case').classList.toggle('hidden', passedCount() < 1);
    renderFavMap();
    renderGoal();
    clearTimeout(menuTimer);
    if (favaskDue()) {
      menuTimer = setTimeout(() => {
        if (api.screen === 'menu' && !anyWin() && !api.modalOpen) openFavask();
      }, REDUCED() ? 300 : 900);
    }
  }
  // карта перерисовалась (догрузилась картинка, сменился размер) — дорожка новая, цель ставится заново
  function mapDrawn() { if (api) renderGoal(); }
  function renderFavMap() {
    const b = $('btn-fav-map');
    if (!b) return;
    const lv = levelById(api.Store.data.fav);
    b.classList.toggle('hidden', !lv);
    if (!lv) return;
    b.dataset.level = String(lv.id);
    b.setAttribute('aria-label', T('Любимое изделие: {name}', { name: T(lv.name) }));
    const cv = b.querySelector('canvas');
    let n = 0;
    const draw = () => { if (!drawLook(cv, lv, 64, 46, 3) && n++ < 20) setTimeout(draw, 250); };
    requestAnimationFrame(draw);
  }
  function chestEl(ci) {
    const c = api.COLLECTIONS[ci];
    const all = Array.from(document.querySelectorAll('#ws-map-track .ws-chest'));
    const byName = all.find(el => el.dataset.ci === String(ci)) || all.find(el => (el.getAttribute('aria-label') || '').indexOf('«' + c.name + '»') >= 0);
    if (byName) return byName;
    const withLevels = api.COLLECTIONS.map((x, k) => k).filter(k => api.collLevels(k).length);
    return all[withLevels.indexOf(ci)] || null;
  }
  function renderGoal() {
    document.querySelectorAll('#ws-map-track .ws-goal').forEach(el => el.remove());
    const ci = api.COLLECTIONS.findIndex((c, k) => api.collLevels(k).length > 0 && !api.Store.data.chests[k]);
    if (ci < 0) return;
    const el = chestEl(ci);
    if (!el) return;
    const c = api.COLLECTIONS[ci];
    const d = c.decor ? api.decorItem(c.decor[0], c.decor[1]) : null;
    const g = document.createElement('span');
    g.className = 'ws-goal' + (api.collDone(ci) ? ' is-ready' : '');
    g.dataset.ci = String(ci);
    g.setAttribute('aria-hidden', 'true');
    const i = document.createElement('i');
    if (d && d.img) { i.className = 'ws-goal-pic'; i.style.backgroundImage = 'url(workshop_assets/' + d.img + '.webp)'; }
    else if (d) { i.className = 'ws-goal-sw'; i.style.background = d.swatch || '#fff'; }
    else i.className = 'ws-coin-ico';
    g.appendChild(i);
    // шкатулка 6 стоит прямо под лентой «Глава 2» (B3): цель над ней легла бы на ленту — ставим сбоку,
    // в сторону от середины дорожки, если там хватает места
    const line = $('ws-map-ch'), cx = parseFloat(el.style.left) || 0, dy = (parseFloat(el.style.top) || 0) - (line ? parseFloat(line.style.top) || 0 : 0);
    if (line && dy > 0 && dy < 110) {
      const W = (el.parentNode && el.parentNode.clientWidth) || window.innerWidth;
      const left = cx < W / 2 ? cx - 37 - 46 >= 4 : cx + 37 + 46 > W - 4;
      g.classList.add('is-side', left ? 'is-left' : 'is-right');
    }
    el.appendChild(g);
  }

  /* ---------- S2: шкатулка ---------- */
  function openCase(from) {
    if (isOpen('case-overlay')) return;
    caseFrom = from;
    api.sfx('click');
    show('case-overlay');
    renderCase();
    api.track('case_open', { from, pieces: passedCount() });
    api.ftueStep(7, 'first_case');
    api.syncBanner();
    setTimeout(() => { if (isOpen('case-overlay') && !isOpen('view-overlay')) $('btn-case-close').focus(); }, 60);
  }
  function closeCase() {
    if (!isOpen('case-overlay')) return;
    if (viewLv) closeView();
    hide('case-overlay');
    clearTimeout(caseRetry);
    caseFrom = null;
    freshId = 0;
    api.syncBanner();
    if (api.screen === 'menu') renderFavMap();
  }
  function renderCase() {
    const list = $('ws-case-list');
    list.innerHTML = '';
    const draws = [];
    const fav = api.Store.data.fav;
    let lastRow = null, n = 0;
    api.COLLECTIONS.forEach((c, ci) => {
      const lvs = api.collLevels(ci);
      if (!lvs.length) return;
      const row = document.createElement('div');
      row.className = 'ws-case-row';
      row.setAttribute('role', 'listitem');
      row.dataset.ci = String(ci);
      const opened = !!api.Store.data.chests[ci];
      row.setAttribute('aria-label', T('Коллекция «{name}»: {n} из {m}', { name: T(c.name), n: api.collCount(ci), m: lvs.length }) + (opened ? T(', шкатулка открыта') : ''));
      const ico = document.createElement('span');
      ico.className = 'ws-case-box' + (opened ? ' is-open' : '');
      ico.setAttribute('aria-hidden', 'true');
      row.appendChild(ico);
      const tiles = document.createElement('div');
      tiles.className = 'ws-case-tiles';
      lvs.forEach((lv, k) => {
        const i = idxById(lv.id), done = i >= 0 && api.isPassed(i);
        const t = document.createElement('button');
        t.type = 'button';
        t.className = 'ws-case-tile ' + ((ci + k) % 2 ? 't-lilac' : 't-pink') + (done ? ' is-done' : ' is-empty') +
          (done && fav === lv.id ? ' is-fav' : '') + (done && freshId === lv.id ? ' is-new' : '');
        t.dataset.level = String(lv.id);
        t.setAttribute('aria-label', done ? T(lv.name) + (fav === lv.id ? T(', любимое') : '') : T('Уровень {n}: ещё не собрано', { n: lv.id }));
        const cv = document.createElement('canvas');
        cv.setAttribute('aria-hidden', 'true');
        t.appendChild(cv);
        t.addEventListener('click', () => tileTap(lv));
        tiles.appendChild(t);
        draws.push(() => drawTile(cv, lv, done));
        if (done) { lastRow = row; n++; }
      });
      row.appendChild(tiles);
      list.appendChild(row);
    });
    $('ws-case-sr').textContent = T('Собрано изделий: {n} из {m}.', { n, m: api.LEVELS.length });
    const paint = (left) => {
      const ok = draws.map(d => d()).every(Boolean);
      if (!ok && left > 0 && isOpen('case-overlay')) caseRetry = setTimeout(() => paint(left - 1), 300);
    };
    clearTimeout(caseRetry);
    paint(15);
    if (lastRow) list.scrollTop = Math.max(0, lastRow.offsetTop - (list.clientHeight - lastRow.offsetHeight) / 2);
  }
  function drawTile(cv, lv, done) {
    if (!cv.isConnected) return true;
    if (done) return drawLook(cv, lv, 52, 46, 3);
    const { g, w, h } = canvasOf(cv, 52, 46);
    const shape = api.look(lv).shape;
    WsJewel.draw(g, shape, lv.orders.length, [], { x: 3, y: 3, w: w - 6, h: h - 6 }, { closeup: 3, shadow: SIL });
    return WsJewel.ready(shape);
  }
  function tileTap(lv) {
    const i = idxById(lv.id);
    if (i < 0 || !api.isPassed(i)) {
      api.sfx('invalid');
      api.toast(T('Уровень {n}', { n: lv.id }), 1500);
      return;
    }
    api.sfx('click');
    openView(lv, 'case');
  }
  function markFav() {
    const fav = api.Store.data.fav;
    document.querySelectorAll('#ws-case-list .ws-case-tile.is-done').forEach(t => {
      const on = Number(t.dataset.level) === fav;
      t.classList.toggle('is-fav', on);
      const lv = api.LEVELS[idxById(t.dataset.level)];
      if (lv) t.setAttribute('aria-label', T(lv.name) + (on ? T(', любимое') : ''));
    });
  }

  /* крупный показ: изделие на пьедестале, блик, сердце «любимое» */
  function openView(lv, from) {
    viewLv = lv;
    viewTries = 0;
    const lk = api.look(lv);
    // на виду не больше трёх слов: длинное имя («Корона «Сакура в цвету»») — только его часть в кавычках,
    // полное — для чтецов экрана
    const name = T(lv.name);
    const long = name.split(/\s+/).length > 3, q = name.match(/«[^»]+»/);
    $('view-overlay-title').textContent = long && q ? q[0] : name;
    $('ws-view-sr').textContent = (long && q ? name + '. ' : '') + (METAL[lk.metal] ? T('{metal}, уровень {n}.', { metal: T(METAL[lk.metal].name), n: lv.id }) : '');
    show('view-overlay');
    syncFav();
    api.track('piece_view', { level: lv.id, metal: lk.metal, from });
    api.syncBanner();
    viewT0 = performance.now();
    loopView();
    setTimeout(() => { if (viewLv) $('btn-fav').focus(); }, 60);
  }
  function loopView() {
    cancelAnimationFrame(viewRaf);
    const tick = (t) => {
      viewRaf = 0;
      if (!viewLv || !isOpen('view-overlay')) return;
      if (!api.paused) {
        const cv = $('ws-view-art'), lk = api.look(viewLv);
        const { g, w, h } = canvasOf(cv, 280, 200);
        const box = { x: 4, y: 4, w: w - 8, h: h - 8 };
        WsJewel.draw(g, lk.shape, viewLv.orders.length, lk.gems, box, { drawGem: api.drawGem, closeup: true, metal: lk.metal });
        const k = ((t - viewT0) % 2800) / 1100;   // блик раз в 2,8 с
        if (!REDUCED() && k < 1) WsJewel.shine(g, box, k);
        if (REDUCED()) {
          if (!WsJewel.ready(lk.shape) && viewTries++ < 20) setTimeout(loopView, 250);
          return;
        }
      }
      viewRaf = requestAnimationFrame(tick);
    };
    viewRaf = requestAnimationFrame(tick);
  }
  function closeView() {
    if (!viewLv) return;
    viewLv = null;
    cancelAnimationFrame(viewRaf);
    viewRaf = 0;
    hide('view-overlay');
    api.syncBanner();
    if (isOpen('case-overlay')) {
      const t = document.querySelector('#ws-case-list .ws-case-tile.is-fav') || $('btn-case-close');
      setTimeout(() => { if (t && isOpen('case-overlay')) t.focus(); }, 30);
    }
  }
  function syncFav() {
    const on = !!viewLv && api.Store.data.fav === viewLv.id;
    const b = $('btn-fav');
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', on ? T('Любимое изделие: снять отметку') : T('Сделать любимым'));
  }
  function toggleFav() {
    if (!viewLv) return;
    const d = api.Store.data, id = viewLv.id;
    if (d.fav === id) {
      d.fav = null;
      api.Store.save();
      api.sfx('click');
    } else {
      const prev = d.fav ? 1 : 0;
      d.fav = id;
      api.Store.save();
      api.track('fav_set', { level: id, prev });
      api.ftueStep(8, 'first_fav');
      api.sfx('reward');
      const r = $('btn-fav').getBoundingClientRect();
      api.Fx.sparkle(r.left + r.width / 2, r.top + r.height / 2, r.width * 0.8);
    }
    api.bump($('btn-fav'));
    syncFav();
    markFav();
    if (api.screen === 'menu') renderFavMap();
  }

  /* ---------- клавиатура: окна B2 забирают нажатия ---------- */
  function key(ev) {
    if (!api) return false;
    const esc = ev.key === 'Escape';
    if (isOpen('choice-overlay')) {
      if (ev.key === '1' || ev.key === '2') { ev.preventDefault(); pick(Number(ev.key) - 1); }
      return true;
    }
    if (isOpen('favask-overlay')) { if (esc) { ev.preventDefault(); favaskAnswer(false); } return true; }
    if (isOpen('view-overlay')) { if (esc) { ev.preventDefault(); api.sfx('click'); closeView(); } return true; }
    if (isOpen('case-overlay')) { if (esc) { ev.preventDefault(); api.sfx('click'); closeCase(); } return true; }
    return false;
  }

  /* ---------- для тестов: window.__ws.state().b2 ---------- */
  function state() {
    const vis = (id) => { const el = $(id); return !!el && !el.classList.contains('hidden'); };
    const goal = document.querySelector('#ws-map-track .ws-goal');
    return {
      choiceOpen: vis('choice-overlay'),
      choiceMini: !!mini,
      choiceKind: choice ? choice.kind : null,
      choiceCards: choice ? choice.cards.map(c => c.metal + ':' + c.shape) : [],
      caseOpen: vis('case-overlay'),
      caseFrom,
      caseDone: document.querySelectorAll('#ws-case-list .ws-case-tile.is-done').length,
      caseTiles: document.querySelectorAll('#ws-case-list .ws-case-tile').length,
      viewOpen: vis('view-overlay'),
      viewLevel: viewLv ? viewLv.id : 0,
      favaskOpen: vis('favask-overlay'),
      pulse: vis('ws-main-pulse'),
      crowns: document.querySelectorAll('#ws-orders .ws-crown').length,
      caseBtn: vis('btn-case'),
      favMap: vis('btn-fav-map') ? Number($('btn-fav-map').dataset.level) || 0 : 0,
      goal: goal ? Number(goal.dataset.ci) : -1
    };
  }

  function attach(a) { api = a; }

  build();
  return { OVERLAYS, attach, levelStart, piece, orders, mainGem, move, win, menu, mapDrawn, leave, key, state };
})();
