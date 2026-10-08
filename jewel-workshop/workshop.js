/* ============================================================
   workshop.js — «Мастерская украшений» (MVP форка game3).
   Контроллер: экраны, ввод, анимации выдачи, отмена, подсказка,
   спасение из безнадёжной позиции, сохранение партии.

   Правила — workshop_rules.js (без DOM), уровни — workshop_levels.js,
   поле — workshop_board.js. Здесь только то, что видит и делает игрок.

   Решения MVP (docs/WORKSHOP.md, разбор 08.10):
   - выдача автоматическая: четыре одинаковых камня уходят заказу сами;
   - отмена без ограничений, в том числе через выдачу; «Заново» тоже
     отменяется, поэтому подтверждение не нужно;
   - если победа стала недостижимой (даже когда ходы ещё есть), игра
     сразу говорит об этом и предлагает вернуть нужное число ходов;
   - незавершённая партия сохраняется и продолжается после перезапуска.
   Сейвы — собственный ключ SAVE_KEY (осознанное исключение из общей
   абстракции сохранений game3: у прототипа нет платформенных адаптеров).
   Аналитика — только внутренний журнал window.__wsEvents, без сети.
   ============================================================ */
(() => {
  'use strict';

  const R = WorkshopRules;
  const { LEVELS, GEMS } = WorkshopLevels;
  const PRODUCT_ID = 'jewel_workshop';
  const SAVE_KEY = 'jewel_workshop.v1';   // НЕ пересекается с ключами game3
  const HIST_MEM = 400;                   // шагов отмены в памяти
  const HIST_SAVE = 60;                   // шагов отмены в сейве
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const $ = (id) => document.getElementById(id);
  const gemName = (t) => (GEMS[t] ? GEMS[t].name : t);

  function plural(n, one, few, many) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }
  const movesWord = (n) => n + ' ' + plural(n, 'ход', 'хода', 'ходов');

  /* ---------- сохранение ----------
     { v: 2, done: { id: лучший результат в ходах }, muted, cur: партия|null }
     Партия: { id, st, m, h: [{ st, m, k }] }, st: { v: ['RRE', …], s, n, d }. */
  const Store = {
    data: { v: 2, done: {}, muted: false, cur: null },
    load() {
      try {
        const raw = window.localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const d = JSON.parse(raw);
        if (!d || typeof d !== 'object') return;
        // v1 — прототип из трёх других уровней: его прогресс к новым уровням не относится.
        if (d.v === 1) { this.data.muted = !!d.muted; return; }
        if (d.v !== 2) return;
        this.data.muted = !!d.muted;
        if (d.done && typeof d.done === 'object') {
          for (const k of Object.keys(d.done)) {
            const lv = LEVELS.find(l => String(l.id) === k);
            const best = d.done[k];
            if (lv && Number.isInteger(best) && best >= lv.solution.length) this.data.done[k] = best;
          }
        }
        // незаконченная партия хранится упакованной; разворачивается при входе
        this.data.cur = restoreGame(d.cur) ? d.cur : null;
      } catch (e) { /* приватный режим/нет хранилища/битый сейв — играем с чистого листа */ }
    },
    save() {
      try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) { /* ок */ }
    }
  };

  function packState(s) { return { v: s.vials.map(v => v.join('')), s: s.slots.slice(), n: s.next, d: s.delivered }; }

  /* Проверка сохранённого состояния: те же камни, что в уровне, ровно по
     четыре на каждый невыданный заказ, карточки и очередь согласованы. */
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
    const s = { vials, orders: lv.orders.slice(), slots: p.s.slice(), next: p.n, delivered: p.d };
    if (R.findDelivery(s)) return null;      // невыданная готовая ёмкость — сейв не от этой игры
    return s;
  }

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
        h.push({ st: hs, moves: e.m, kind: e.k === 'restart' ? 'restart' : 'move' });
      }
    }
    return { idx, st: s, moves: c.m, hist: h };
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
        h: hist.slice(-HIST_SAVE).map(e => ({ st: packState(e.st), m: e.moves, k: e.kind }))
      };
    }
    Store.save();
  }

  /* ---------- журнал событий (без сети) ---------- */
  window.__wsEvents = [];
  function track(name, data) {
    const e = Object.assign({ product: PRODUCT_ID, event: name, t: Date.now() }, data || {});
    window.__wsEvents.push(e);
    if (window.__wsEvents.length > 500) window.__wsEvents.shift();
  }

  /* ---------- состояние ---------- */
  let levelIdx = 0;
  let L = null;            // уровень (не меняется)
  let st = null;           // состояние правил — всегда уже окончательное
  let view = null;         // что показывают карточки (догоняет st по ходу анимации выдачи)
  let hist = [];           // снимки для отмены: { st, moves, kind: 'move'|'restart' }
  let moves = 0;           // переливов в текущей линии партии
  let sel = -1;            // выбранная пробирка
  let busy = false;        // идёт перелив/выдача — поле не принимает касания
  let won = false;
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

  /* ---------- эффекты поверх экрана: камни летят к карточке ---------- */
  const Fx = (() => {
    let cv = null, g = null, dpr = 1, W = 0, H = 0, raf = 0;
    let jobs = [], sparks = [];
    function init(c) { cv = c; g = cv.getContext('2d'); resize(); }
    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    function request() { if (!raf) raf = requestAnimationFrame(frame); }
    /* items: [{ gem, x, y, size }] в координатах окна; cb — когда долетел последний. */
    function fly(items, target, cb) {
      const t = performance.now();
      const step = REDUCED ? 0 : 60, dur = REDUCED ? 160 : 540;
      let left = items.length;
      if (!left) { cb(); return; }
      items.forEach((it, k) => jobs.push(Object.assign({}, it, {
        t0: t + k * step, dur, tx: target.x, ty: target.y, ts: target.size,
        done: () => { if (--left === 0) { sparkle(target); cb(); } }
      })));
      request();
    }
    function sparkle(p) {
      if (REDUCED) return;
      const t = performance.now();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        sparks.push({ x: p.x, y: p.y, vx: Math.cos(a), vy: Math.sin(a), r: p.size * (0.55 + 0.25 * (i % 2)), t0: t, dur: 420 });
      }
      request();
    }
    function frame() {
      raf = 0;
      const t = performance.now();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const landed = [];
      jobs = jobs.filter(j => {
        if (t < j.t0) return true;
        const k = Math.min(1, (t - j.t0) / j.dur);
        const e = 1 - Math.pow(1 - k, 3);
        const cx = j.x, cy = Math.min(j.y, j.ty) - 60;
        const x = (1 - e) * (1 - e) * j.x + 2 * (1 - e) * e * cx + e * e * j.tx;
        const y = (1 - e) * (1 - e) * j.y + 2 * (1 - e) * e * cy + e * e * j.ty;
        const size = j.size + (j.ts - j.size) * e;
        const glow = g.createRadialGradient(x, y, 0, x, y, size * 0.8);
        glow.addColorStop(0, 'rgba(255,220,150,0.45)');
        glow.addColorStop(1, 'rgba(255,220,150,0)');
        g.fillStyle = glow;
        g.fillRect(x - size, y - size, size * 2, size * 2);
        WsBoard.drawGem(g, j.gem, x, y, size);
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
      landed.forEach(j => j.done());
      if (jobs.length || sparks.length) request();
    }
    function clear() {
      jobs = []; sparks = [];
      if (g) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); }
    }
    return { init, resize, fly, clear };
  })();

  /* ---------- заказы ---------- */
  function syncView() {
    view = { slots: st.slots.slice(), next: st.next, delivered: st.delivered };
  }

  function cardEl(slot) { return $('ws-orders').children[slot] || null; }

  function renderOrders(enterSlot) {
    const box = $('ws-orders');
    box.innerHTML = '';
    view.slots.forEach((o, i) => {
      const card = document.createElement('div');
      if (o < 0) {
        card.className = 'ws-card is-empty';
        card.setAttribute('aria-label', 'Свободное место');
      } else {
        const t = st.orders[o];
        card.className = 'ws-card' + (i === enterSlot ? ' is-enter' : '');
        card.dataset.gem = t;
        card.setAttribute('role', 'img');
        card.setAttribute('aria-label', 'Заказ: ' + gemName(t) + ', четыре камня');
        card.appendChild(gemSpan(t));
        const q = document.createElement('span');
        q.className = 'ws-card-qty';
        q.textContent = '×4';
        card.appendChild(q);
        card.addEventListener('click', () => {
          if (!won) toast('Соберите четыре камня «' + gemName(t) + '» в одной пробирке — заказчик заберёт их сам');
        });
      }
      box.appendChild(card);
    });
    const queue = st.orders.slice(view.next);
    const qBox = $('ws-queue-items');
    qBox.innerHTML = '';
    queue.slice(0, 4).forEach(t => {
      const it = document.createElement('span');
      it.className = 'ws-queue-item';
      it.title = gemName(t);
      it.appendChild(gemSpan(t));
      qBox.appendChild(it);
    });
    if (queue.length > 4) {
      const more = document.createElement('span');
      more.className = 'ws-queue-more';
      more.textContent = '+' + (queue.length - 4);
      qBox.appendChild(more);
    }
    $('ws-queue').classList.toggle('is-empty', queue.length === 0);
    $('ws-queue').setAttribute('aria-label', queue.length ? 'Далее: ' + queue.map(gemName).join(', ') : 'Очередь пуста');
    updateCounter(false);
  }

  function updateCounter(bump) {
    const el = $('ws-counter');
    el.textContent = 'Заказы: ' + view.delivered + ' из ' + st.orders.length;
    if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    $('ws-moves').textContent = 'Ходов: ' + moves;
  }

  function waitingVials() {
    const act = R.activeTypes(st);
    const res = [];
    st.vials.forEach((v, i) => { if (R.isComplete(v) && act.indexOf(v[0]) === -1) res.push(i); });
    return res;
  }

  /* ---------- подпись над полем ---------- */
  const TIPS = {
    2: 'Пустой пробирки нет. Соберите первый заказ — пробирка освободится.',
    3: 'Заказов больше, чем карточек: следующий ждёт в очереди «Далее».',
    4: 'Камни, собранные раньше своего заказа, подождут его в пробирке.'
  };

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
      return 'Теперь коснитесь пробирки, куда положить: пустой или с таким же камнем сверху';
    }
    WsBoard.setTutorial(step.from);
    if (sel >= 0) return 'Коснитесь подсвеченной пробирки';
    return st.delivered > 0
      ? 'Пробирка освободилась! Соберите следующий заказ'
      : 'Коснитесь подсвеченной пробирки — верхние камни поднимутся';
  }

  function updateGuide() {
    if (!L || screen !== 'game') return;
    const cap = $('ws-caption');
    let text = '';
    const tutorial = L.id === 1 && !won && rescueK === null && !busy;
    if (!tutorial) WsBoard.setTutorial(-1);
    if (won || rescueK !== null) text = '';
    else if (flash && performance.now() < flash.until) { text = flash.text; if (tutorial) tutorialText(); }
    else if (tutorial) text = tutorialText();
    else if (hintMv) text = 'Подсказка: перенесите камни из подсвеченной пробирки к стрелке';
    else {
      const w = busy ? [] : waitingVials();
      if (w.length) text = 'Готово: ' + w.map(v => gemName(st.vials[v][0]) + ' ×4').join(', ') + ' — заказ пока в очереди';
      else if (moves === 0 && st.delivered === 0 && TIPS[L.id]) text = TIPS[L.id];
    }
    cap.textContent = text;
    WsBoard.setWaiting(busy ? [] : waitingVials());
    updateRescue();
    updateButtons();
  }

  function updateButtons() {
    $('btn-undo').disabled = hist.length === 0 || won;
    $('btn-restart').disabled = won || (moves === 0 && st.delivered === 0);
  }

  /* ---------- спасение: победа стала недостижимой ---------- */
  function checkWinnable() {
    if (won || R.isWon(st)) { rescueK = null; return; }
    if (R.isWinnable(st)) { rescueK = null; return; }
    let k = 0;
    for (let i = hist.length - 1; i >= 0; i--) {
      if (R.isWinnable(hist[i].st)) { k = hist.length - i; break; }
    }
    if (rescueK === null) track('unwinnable', { level: L.id, moves, back: k, dead: R.legalMoves(st.vials).length === 0 });
    rescueK = k;
  }

  function updateRescue() {
    const box = $('ws-rescue');
    if (rescueK === null || won) { box.classList.add('hidden'); return; }
    const dead = R.legalMoves(st.vials).length === 0;
    $('ws-rescue-text').textContent = dead ? 'Ходов больше нет.' : 'Так все заказы уже не собрать.';
    $('btn-rescue').textContent = rescueK > 0 ? 'Вернуть ' + movesWord(rescueK) : 'Начать заново';
    box.classList.remove('hidden');
  }

  function onRescue() {
    if (rescueK === null || won) return;
    Sound.playClick();
    if (rescueK === 0) { restart(); return; }
    const k = rescueK;
    const snap = hist[hist.length - k];
    hist.length = hist.length - k;
    track('rescue', { level: L.id, back: k });
    restoreSnap(snap);
  }

  /* ---------- уровень ---------- */
  function loadLevel(i, resume) {
    epoch++;
    levelIdx = i;
    L = LEVELS[i];
    if (resume) { st = resume.st; moves = resume.moves; hist = resume.hist; }
    else { st = R.makeState(L); moves = 0; hist = []; }
    sel = -1; busy = false; won = false; levelWins = 0;
    hintMv = null; flash = null; rescueK = null;
    stats = { hints: 0, undos: 0, restarts: 0 };
    Fx.clear();
    hideToast();
    $('win-overlay').classList.add('hidden');
    $('ws-level-title').textContent = 'Уровень ' + L.id;
    $('ws-level-name').textContent = L.name;
    showScreen('screen-workshop');
    WsBoard.select(-1); WsBoard.clearHint(); WsBoard.setTutorial(-1);
    WsBoard.setVials(st.vials);
    WsBoard.resize();
    syncView();
    renderOrders();
    if (resume) checkWinnable();
    updateGuide();
    saveGame();
    requestAnimationFrame(() => { WsBoard.resize(); updateGuide(); });
    track('level_start', { level: L.id, resumed: !!resume, moves });
  }

  /* Вернуть снимок (отмена/спасение): анимации обрываются, всё рисуется заново. */
  function restoreSnap(snap) {
    epoch++;
    st = snap.st;
    moves = snap.moves;
    sel = -1; busy = false; hintMv = null; flash = null;
    Fx.clear();
    hideToast();
    WsBoard.select(-1); WsBoard.clearHint();
    WsBoard.setVials(st.vials);
    syncView();
    renderOrders();
    checkWinnable();
    updateGuide();
    saveGame();
  }

  function pushHist(kind) {
    hist.push({ st: R.cloneState(st), moves, kind });
    if (hist.length > HIST_MEM) hist.shift();
  }

  /* ---------- касание поля ---------- */
  function tapVial(idx) {
    if (!L || won || busy || screen !== 'game') return;
    if (idx < 0 || idx >= st.vials.length) {
      if (sel !== -1) { sel = -1; WsBoard.select(-1); updateGuide(); }
      return;
    }
    if (sel === -1) {
      if (!st.vials[idx].length) return;
      sel = idx;
      WsBoard.select(idx);
      Sound.playSelect();
      updateGuide();
      return;
    }
    if (sel === idx) { sel = -1; WsBoard.select(-1); updateGuide(); return; }
    const count = R.moveCount(st.vials[sel], st.vials[idx]);
    if (count === 0) {
      Sound.playInvalid();
      WsBoard.shake(idx);
      toast(st.vials[idx].length >= R.CAP
        ? 'Пробирка полна: в ней уже четыре камня'
        : 'Класть можно только на такой же камень или в пустую пробирку', 2200);
      track('invalid', { level: L.id, from: sel, to: idx });
      return;
    }
    doPour(sel, idx, count);
  }

  function doPour(from, to, count) {
    const e = epoch;
    pushHist('move');
    const fill = (st.vials[to].length + count) / R.CAP;
    const res = R.moveInPlace(st, { from, to });
    moves++;
    sel = -1;
    hintMv = null;
    WsBoard.clearHint();
    busy = true;
    hideToast();
    Sound.playPour(fill);
    track('move', { level: L.id, from, to, count, delivered: res.deliveries.length });
    // выдачи пишутся сразу (по правилам), а не по ходу анимации — уход с экрана их не теряет
    res.deliveries.forEach((ev, k) => track('delivery', { level: L.id, gem: ev.gem, order: ev.order, chain: k + 1 }));
    checkWinnable();
    saveGame();
    updateCounter(false);
    updateGuide();
    WsBoard.pour(from, to, count, () => {
      if (e !== epoch) return;
      Sound.playSettle();
      runDeliveries(res.deliveries, 0, e);
    });
  }

  /* Выдачи по очереди: камни слетают к карточке, на карточке — печать,
     на её место выходит следующий заказ. Цепочки показываются по одной. */
  function runDeliveries(events, k, e) {
    if (e !== epoch) return;
    if (k >= events.length) { afterAction(); return; }
    const ev = events[k];
    const card = cardEl(ev.slot);
    const gemEl = card && card.querySelector('.ws-gem');
    const r = gemEl ? gemEl.getBoundingClientRect() : null;
    const items = WsBoard.takeVial(ev.vial);
    Sound.playLock(k);
    const target = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width }
      : { x: window.innerWidth / 2, y: 80, size: 50 };
    Fx.fly(items, target, () => {
      if (e !== epoch) return;
      Sound.playReward();
      view.delivered++;
      updateCounter(true);
      const c = cardEl(ev.slot);
      if (c) c.classList.add('is-done');
      if (L.id <= 3) setFlash('Заказ «' + gemName(ev.gem) + ' ×4» выполнен — пробирка свободна', 2600);
      else if (k === 1) setFlash('Сразу два заказа!', 2000);
      setTimeout(() => {
        if (e !== epoch) return;
        view.slots[ev.slot] = ev.incoming;
        if (ev.incoming >= 0) view.next = ev.incoming + 1;
        renderOrders(ev.incoming >= 0 ? ev.slot : -1);
        runDeliveries(events, k + 1, e);
      }, REDUCED ? 60 : 340);
    });
  }

  function afterAction() {
    busy = false;
    WsBoard.setVials(st.vials);      // поле совпадает с правилами (страховка после анимаций)
    const same = view.delivered === st.delivered && view.next === st.next && view.slots.every((o, i) => o === st.slots[i]);
    if (!same) { syncView(); renderOrders(); }
    if (R.isWon(st)) { win(); return; }
    updateGuide();
  }

  /* ---------- отмена / заново ---------- */
  function undo() {
    if (!L || won || !hist.length) return;
    Sound.playClick();
    const snap = hist.pop();
    stats.undos++;
    track('undo', { level: L.id, kind: snap.kind, depth: hist.length });
    restoreSnap(snap);
    if (snap.kind === 'restart') toast('Партия до «Заново» возвращена', 1800);
  }

  function restart() {
    if (!L || won || (moves === 0 && st.delivered === 0)) return;
    Sound.playClick();
    pushHist('restart');
    stats.restarts++;
    track('restart', { level: L.id, moves, delivered: st.delivered });
    restoreSnap({ st: R.makeState(L), moves: 0 });
    toast('Начали заново. Передумали — «Отменить» вернёт партию', 2600);
  }

  /* ---------- подсказка (бесплатная; решатель от текущей позиции) ---------- */
  function onHint() {
    if (!L || won || busy) return;
    if (rescueK !== null) {
      toast('Отсюда уже не выиграть — сначала верните ходы', 2400);
      const box = $('ws-rescue');
      box.classList.remove('pulse'); void box.offsetWidth; box.classList.add('pulse');
      return;
    }
    const step = R.hint(st);
    stats.hints++;
    track('hint', { level: L.id, from: step && step.from, to: step && step.to, moves });
    if (!step) return;
    Sound.playClick();
    hintMv = step;
    sel = -1;
    WsBoard.select(-1);
    WsBoard.showHint(step.from, step.to);
    updateGuide();
  }

  /* ---------- победа ---------- */
  /* Засчитать прохождение (победа или выход в меню во время последней выдачи). */
  function recordWin() {
    won = true;
    winCount++; levelWins++;
    const id = String(L.id);
    const prev = Store.data.done[id];
    Store.data.done[id] = prev ? Math.min(prev, moves) : moves;
    saveGame();
    return prev;
  }

  function win() {
    if (won) return;                            // ровно один раз
    const prev = recordWin();
    const best = Store.data.done[String(L.id)];
    const optimal = L.solution.length;
    track('win', { level: L.id, moves, best, optimal, perfect: moves === optimal, hints: stats.hints, undos: stats.undos, restarts: stats.restarts });
    hideToast();
    WsBoard.setTutorial(-1);
    WsBoard.setWaiting([]);
    $('ws-caption').textContent = '';
    updateRescue();
    updateButtons();
    const last = levelIdx === LEVELS.length - 1;
    if (last) Sound.playChapterWin(); else Sound.playWin();
    const e = epoch;
    setTimeout(() => {
      if (e !== epoch) return;
      Confetti.burst({ count: last ? 70 : 50, durationMs: 2400 });
      $('ws-win-title').textContent = last ? 'Все двенадцать уровней пройдены!' : 'Все заказы выполнены!';
      let text = 'Ходов: ' + moves + '.';
      if (prev && prev < moves) text += ' Ваш лучший результат — ' + prev + '.';
      else if (prev && moves < prev) text += ' Новый рекорд!';
      $('ws-win-text').textContent = text;
      $('ws-win-master').textContent = moves === optimal
        ? '★ Идеально: короче не бывает'
        : 'Мастер справится за ' + movesWord(optimal);
      $('btn-next').textContent = last ? 'В меню' : 'Дальше';
      $('win-overlay').classList.remove('hidden');
      drawNecklace($('ws-win-jewel'), st.orders);
    }, REDUCED ? 100 : 500);
  }

  /* Ожерелье из камней выполненных заказов: цепочка-дуга, в центре — подвеска. */
  function drawNecklace(cv, types) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth || 300, h = cv.clientHeight || 130;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const x0 = w * 0.06, x1 = w * 0.94, y0 = h * 0.1, sag = h * 0.62;
    const at = (t) => {
      const x = x0 + (x1 - x0) * t;
      const y = y0 + sag * (1 - Math.pow(2 * t - 1, 2));
      return { x, y };
    };
    g.beginPath();
    for (let i = 0; i <= 60; i++) { const p = at(i / 60); if (i) g.lineTo(p.x, p.y); else g.moveTo(p.x, p.y); }
    g.strokeStyle = '#a8742b';
    g.lineWidth = 2.4;
    g.setLineDash([4, 2.5]);
    g.stroke();
    g.setLineDash([]);
    const n = types.length;
    const mid = (n - 1) / 2;
    types.forEach((t, i) => {
      const u = 0.18 + 0.64 * (n === 1 ? 0.5 : i / (n - 1));
      const p = at(u);
      const center = Math.abs(i - mid) < 0.6;
      const size = Math.min(w / (n + 1.6), 44) * (center ? 1.25 : 1);
      g.fillStyle = '#c99a45';
      g.beginPath(); g.arc(p.x, p.y - size * 0.42, 2.4, 0, Math.PI * 2); g.fill();
      WsBoard.drawGem(g, t, p.x, p.y + size * 0.08, size);
    });
  }

  function leaveToMenu() {
    if (L && !won && screen === 'game') {
      if (R.isWon(st)) { recordWin(); track('win', { level: L.id, moves, optimal: L.solution.length, left: true }); }
      else track('quit', { level: L.id, moves, delivered: st.delivered });
    }
    epoch++;
    busy = false;
    sel = -1;
    Fx.clear();
    hideToast();
    WsBoard.setTutorial(-1);
    if (L) saveGame();
    $('win-overlay').classList.add('hidden');
    showScreen('screen-menu');
    renderMenu();
  }

  /* ---------- меню ---------- */
  // Камень на плитке уровня: новый для этого уровня, а если новых нет —
  // тот, что реже всего показывался на прошлых плитках (без повторов подряд).
  function featuredGems() {
    const seen = new Set(), shown = {};
    return LEVELS.map(lv => {
      const fresh = lv.orders.filter(t => !seen.has(t));
      lv.orders.forEach(t => seen.add(t));
      let pick = fresh[fresh.length - 1];
      if (!pick) {
        for (let k = lv.orders.length - 1; k >= 0; k--) {
          const t = lv.orders[k];
          if (!pick || (shown[t] || 0) < (shown[pick] || 0)) pick = t;
        }
      }
      shown[pick] = (shown[pick] || 0) + 1;
      return pick;
    });
  }

  function nextLevelIdx() {
    const i = LEVELS.findIndex(l => !Store.data.done[l.id]);
    return i === -1 ? 0 : i;
  }

  function renderMenu() {
    const box = $('ws-level-pick');
    box.innerHTML = '';
    const feat = featuredGems();
    const nextIdx = LEVELS.findIndex(l => !Store.data.done[l.id]);
    LEVELS.forEach((lv, i) => {
      const best = Store.data.done[lv.id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-level' + (best ? ' is-done' : '') + (i === nextIdx ? ' is-next' : '');
      b.appendChild(gemSpan(feat[i]));
      const n = document.createElement('span');
      n.className = 'ws-level-n';
      n.textContent = String(lv.id);
      b.appendChild(n);
      const perfect = best && best <= lv.solution.length;
      if (perfect) {
        const s = document.createElement('span');
        s.className = 'ws-star';
        s.textContent = '★';
        b.appendChild(s);
      }
      b.setAttribute('aria-label', 'Уровень ' + lv.id + ': ' + lv.name +
        (best ? ', пройден, лучший результат ' + movesWord(best) + (perfect ? ', идеально' : '') : ''));
      b.addEventListener('click', () => { Sound.playClick(); startLevel(i); });
      box.appendChild(b);
    });
    const cur = restoreGame(Store.data.cur);
    if (cur) {
      $('btn-play').textContent = 'Продолжить';
      $('ws-play-note').textContent = 'Уровень ' + LEVELS[cur.idx].id + ' · ' + movesWord(cur.moves);
    } else {
      $('btn-play').textContent = 'Играть';
      const all = LEVELS.every(l => Store.data.done[l.id]);
      const nx = LEVELS[nextLevelIdx()];
      $('ws-play-note').textContent = all ? 'Все уровни пройдены — попробуйте пройти их идеально' : 'Уровень ' + nx.id + ' · ' + nx.name;
    }
  }

  /* Открыть уровень: если именно он сохранён незаконченным — продолжить. */
  function startLevel(i) {
    const cur = restoreGame(Store.data.cur);
    loadLevel(i, cur && cur.idx === i ? cur : null);
  }

  function applyMute() {
    Sound.setMuted(Store.data.muted);
    ['btn-sound', 'btn-sound-game'].forEach(id => $(id).setAttribute('aria-pressed', Store.data.muted ? 'true' : 'false'));
  }

  /* ---------- запуск ---------- */
  function init() {
    Store.load();
    WsBoard.init($('board-canvas'), {
      spriteOf: (t) => (GEMS[t] ? GEMS[t].sprite : 0),
      colorOf: (t) => (GEMS[t] ? GEMS[t].color : '#c33'),
      atlasUrl: (document.querySelector('link[rel="preload"][as="image"]') || {}).href || 'workshop_assets/gems.webp'
    });
    Fx.init($('fx-canvas'));
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
      if (screen !== 'game' || won) return;
      if (/^[1-9]$/.test(ev.key)) tapVial(+ev.key - 1);
      else if (ev.key === 'Escape') tapVial(-1);
      else if (ev.key === 'z' || ev.key === 'я' || ev.key === 'Backspace') undo();
      else if (ev.key === 'h' || ev.key === 'р') onHint();
    });

    $('btn-play').addEventListener('click', () => {
      Sound.playClick();
      const cur = restoreGame(Store.data.cur);
      if (cur) loadLevel(cur.idx, cur);
      else loadLevel(nextLevelIdx());
    });
    $('btn-back').addEventListener('click', () => { Sound.playClick(); leaveToMenu(); });
    $('btn-undo').addEventListener('click', undo);
    $('btn-restart').addEventListener('click', restart);
    $('btn-hint').addEventListener('click', onHint);
    $('btn-rescue').addEventListener('click', onRescue);
    $('btn-next').addEventListener('click', () => {
      Sound.playClick();
      if (levelIdx < LEVELS.length - 1) loadLevel(levelIdx + 1);
      else leaveToMenu();
    });
    $('btn-again').addEventListener('click', () => { Sound.playClick(); loadLevel(levelIdx); });
    $('btn-win-menu').addEventListener('click', () => { Sound.playClick(); leaveToMenu(); });
    ['btn-sound', 'btn-sound-game'].forEach(id => $(id).addEventListener('click', () => {
      Store.data.muted = !Store.data.muted;
      Store.save();
      applyMute();
      Sound.playClick();
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
        if (screen === 'game') { WsBoard.resize(); updateGuide(); }
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
    renderMenu();
    const q = /[?&]level=(\d+)/.exec(location.search);
    if (q && LEVELS[+q[1] - 1]) loadLevel(+q[1] - 1);
  }

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
        won, winCount, levelWins, busy, sel, moves, undoDepth: hist.length,
        rescue: rescueK, hint: hintMv, waiting: st ? waitingVials() : [],
        caption: $('ws-caption').textContent, best: L ? Store.data.done[L.id] || null : null
      };
    },
    vialCenter(i) {
      const r = WsBoard.vialClientRect(i);
      return r && { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
    },
    solution() { return L ? L.solution.map(m => [m.from, m.to]) : null; },
    layout() { return WsBoard.layout(); },
    atlasReady() { return WsBoard.atlasReady(); },
    productId: PRODUCT_ID, saveKey: SAVE_KEY
  };

  init();
})();
