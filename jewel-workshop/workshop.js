/* ============================================================
   workshop.js — «Мастерская украшений» (прототип, форк game3).
   Контроллер эпизода: уровни, заказы, выдача, отмена, подсказка.
   Правила (перелив, выдача, победа) — в workshop_rules.js и не знают о
   DOM; Board рисует поле и анимирует перелив; здесь — ввод и экраны.

   Отличия от game3: нет энергии/рекламы/магазина/ретеншена; победа —
   «выполнено 2 заказа» (а не «отсортировано всё поле»); есть выдача.
   Сохраняется только прогресс по уровням и звук (свой ключ SAVE_KEY);
   НЕЗАВЕРШЁННАЯ партия не сохраняется (ограничение прототипа,
   docs/WORKSHOP.md). Аналитика — только внутренний журнал событий
   (window.__wsEvents) под собственным идентификатором продукта.
   ============================================================ */
(() => {
  'use strict';

  const R = WorkshopRules;
  const LEVELS = WorkshopLevels.LEVELS;
  const PRODUCT_ID = 'jewel_workshop';
  const SAVE_KEY = 'jewel_workshop.v1';   // НЕ пересекается с ключами game3
  const RESTART_ARM_MS = 3000;

  const $ = (id) => document.getElementById(id);

  /* ---------- сохранение: только прогресс и звук ---------- */
  const Store = {
    data: { v: 1, done: {}, muted: false },
    load() {
      try {
        const raw = window.localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const d = JSON.parse(raw);
        if (d && d.v === 1) this.data = { v: 1, done: d.done || {}, muted: !!d.muted };
      } catch (e) { /* приватный режим/нет хранилища — играем без сохранения */ }
    },
    save() {
      try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) { /* ок */ }
    }
  };

  /* ---------- журнал событий (без сети) ---------- */
  window.__wsEvents = [];
  function track(name, data) {
    const e = Object.assign({ product: PRODUCT_ID, event: name, t: Date.now() }, data || {});
    window.__wsEvents.push(e);
    if (window.__wsEvents.length > 300) window.__wsEvents.shift();
  }

  /* ---------- состояние ---------- */
  let levelIdx = 0;
  let L = null;            // исходное описание уровня (не меняется)
  let rs = null;           // рабочее состояние правил (меняется на месте)
  let moveStack = [];      // [{from,to,count}] — только до первой выдачи
  let sel = -1;            // выбранная ёмкость
  let selReady = false;    // выбранная ёмкость — собранная, готова к выдаче
  let pickMode = false;    // собранная ёмкость подходит нескольким заказам — ждём выбор карточки
  let busy = false;        // идёт анимация — ввод игнорируется
  let won = false;         // победа уже зафиксирована (ровно один раз)
  let winCount = 0;        // сколько раз сработала победа за сессию (для проверок)
  let levelWins = 0;       // побед на текущем прохождении уровня — должно быть ровно 0 или 1
  let shownDelivered = 0;  // что показано в счётчике (обновляется после анимации)
  let landing = new Set(); // заказы, у которых идёт анимация выдачи
  let actionCount = 0;     // перелив/выдача — для текста победы
  let session = 0;         // растёт при загрузке уровня/выходе в меню: опоздавшие колбэки анимаций отбрасываются
  let restartArmTimer = null;
  let toastTimer = null;

  /* ---------- экраны ---------- */
  function showScreen(id) {
    ['screen-menu', 'screen-workshop'].forEach(s => $(s).classList.toggle('active', s === id));
  }

  /* ---------- тост ---------- */
  function toast(msg, ms) {
    const el = $('hint-toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), ms || 2600);
  }

  /* ---------- карточки заказов ---------- */
  function drawCardBead(canvas, el) {
    const size = canvas.clientWidth || 72;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, size, size);
    Board.drawBead(g, size / 2, size / 2, size * 0.78, el);
  }

  function renderOrders() {
    const box = $('ws-orders');
    box.innerHTML = '';
    L.orders.forEach((o, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'ws-card';
      card.dataset.i = String(i);
      card.setAttribute('aria-label', 'Заказ ' + (i + 1) + ': четыре одинаковые бусины');
      card.innerHTML = '<canvas class="ws-card-bead"></canvas><span class="ws-card-qty">×4</span><span class="ws-card-state"></span>';
      card.addEventListener('click', () => onCardTap(i));
      box.appendChild(card);
    });
    requestAnimationFrame(redrawCards);
  }
  function redrawCards() {
    $('ws-orders').querySelectorAll('.ws-card').forEach((card, i) => {
      if (L && L.orders[i]) drawCardBead(card.querySelector('canvas'), L.orders[i]);
    });
  }

  function deliverableVials() {
    const res = [];
    rs.vials.forEach((_, i) => { if (R.matchingOrders(rs, i).length) res.push(i); });
    return res;
  }

  function updateOrders() {
    const cards = $('ws-orders').querySelectorAll('.ws-card');
    const dv = deliverableVials();
    const readyOrders = new Set();
    dv.forEach(v => R.matchingOrders(rs, v).forEach(o => readyOrders.add(o)));
    cards.forEach((card, i) => {
      const o = rs.orders[i];
      const isDone = o.done && !landing.has(i);
      card.classList.toggle('done', isDone);
      card.classList.toggle('ready', !o.done && readyOrders.has(i) && !pickMode);
      const pickable = pickMode && sel >= 0 && R.matchingOrders(rs, sel).indexOf(i) !== -1;
      card.classList.toggle('pick', pickable);
      const st = card.querySelector('.ws-card-state');
      st.textContent = isDone ? 'Выдан' : (pickable ? 'Выберите!' : (readyOrders.has(i) && !o.done ? 'Готово к выдаче' : ''));
    });
  }

  function updateCounter(bump) {
    const el = $('ws-counter');
    el.textContent = 'Заказы: ' + shownDelivered + '/' + L.goal;
    if (bump) {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    }
  }

  function updateButtons() {
    const dv = deliverableVials();
    const btn = $('btn-deliver');
    btn.classList.toggle('is-idle', dv.length === 0 || won);
    btn.classList.toggle('is-ready', dv.length > 0 && !won && !busy);
    btn.setAttribute('aria-disabled', dv.length === 0 || won ? 'true' : 'false');
    const showUndo = moveStack.length > 0 && !won;
    $('btn-undo').classList.toggle('hidden', !showUndo);
    const progress = moveStack.length > 0 || rs.delivered > 0;
    $('btn-restart').classList.toggle('hidden', !progress || won);
    if (!progress) disarmRestart();
  }

  function refresh() {
    updateOrders();
    updateButtons();
    updateGuide();
  }

  /* ---------- загрузка уровня ---------- */
  function loadLevel(i) {
    session++;
    levelIdx = i;
    L = LEVELS[i];
    rs = R.makeState(L);
    moveStack = [];
    sel = -1; selReady = false; pickMode = false;
    busy = false; won = false; levelWins = 0;
    landing = new Set();
    shownDelivered = 0;
    actionCount = 0;
    disarmRestart();
    $('win-overlay').classList.add('hidden');
    $('hint-toast').classList.add('hidden');
    $('btn-deliver').classList.remove('attention');
    $('btn-restart').classList.remove('attention');
    $('ws-level-title').textContent = 'Уровень ' + L.id + ' · ' + L.name;
    showScreen('screen-workshop');
    renderOrders();
    updateCounter(false);
    Board.setLevel({ vials: rs.vials });
    Board.setSelected(-1);
    refresh();
    // Раскладка считается по размеру обёртки — после показа экрана.
    requestAnimationFrame(() => { Board.resize(); updateGuide(); });
    track('level_start', { level: L.id });
  }

  /* ---------- выбор/снятие выбора ---------- */
  function clearSelection() {
    sel = -1; selReady = false; pickMode = false;
    Board.setSelected(-1);
  }

  /* ---------- тап по полю ---------- */
  function onTap(clientX, clientY) {
    if (busy || won || !L) return;
    const idx = Board.hitTest(clientX, clientY);
    if (idx === -1) { if (sel !== -1) { clearSelection(); refresh(); } return; }
    Board.clearHint();
    $('btn-deliver').classList.remove('attention');

    if (sel !== -1 && idx === sel) {          // повторный тап — снять выбор
      clearSelection(); refresh(); return;
    }

    if (sel !== -1 && !selReady) {            // выбран источник — пробуем перелив
      const count = R.moveCount(rs.vials[sel], rs.vials[idx]);
      if (count === 0) {
        Sound.playInvalid();
        Board.shake(idx);                     // отказ без наказания; выбор остаётся
        return;
      }
      doPour(sel, idx, count);
      return;
    }

    // Нет выбора, либо выбрана готовая ёмкость, а тап — по другой: начинаем заново.
    if (sel !== -1) clearSelection();
    const vial = rs.vials[idx];
    if (vial.length === 0) { refresh(); return; }
    if (R.isCollected(vial)) {
      if (R.matchingOrders(rs, idx).length === 0) {
        Sound.playInvalid();
        Board.shake(idx);
        toast('На эти бусины нет заказа — ёмкость занята');
        refresh();
        return;
      }
      sel = idx; selReady = true;
      Board.setSelected(idx);
      Sound.playSelect();
      toast('Ёмкость готова. Нажмите «Отдать заказ»', 2200);
      refresh();
      return;
    }
    sel = idx; selReady = false;
    Board.setSelected(idx);
    Sound.playSelect();
    refresh();
  }

  /* ---------- перелив ---------- */
  function doPour(from, to, count) {
    const s = session;
    busy = true;
    clearSelection();
    Sound.playPour((rs.vials[to].length + count) / R.CAP);
    Board.animatePour({
      fromIdx: from, toIdx: to, count,
      onDone: () => {
        if (s !== session) return;
        R.moveInPlace(rs, { from, to });
        moveStack.push({ from, to, count });
        actionCount++;
        busy = false;
        if (R.isCollected(rs.vials[to])) {
          Sound.playLock(0);
          const rect = Board.getVialClientRect(to);
          if (rect) Fx.burst(rect.left + rect.width / 2, rect.top + rect.height * 0.3, Board.COLORS[rs.vials[to][0].color], rect.elSize);
          Board.popVial(to);
        } else {
          Sound.playSettle();
        }
        track('move', { level: L.id, from, to, count });
        refresh();
        afterAction();
      }
    });
  }

  /* ---------- отмена хода (только до выдачи) ---------- */
  function undo() {
    if (!moveStack.length || busy || won || !L) return;
    const s = session;
    const { from, to, count } = moveStack.pop();
    clearSelection();
    Board.clearHint();
    busy = true;
    track('undo', { level: L.id });
    Board.animatePour({
      fromIdx: to, toIdx: from, count,
      onDone: () => {
        if (s !== session) return;
        const moved = rs.vials[to].splice(rs.vials[to].length - count, count);
        rs.vials[from].push(...moved);
        actionCount = Math.max(0, actionCount - 1);
        busy = false;
        Sound.playSettle();
        refresh();
      }
    });
  }

  /* ---------- выдача заказа ---------- */
  function cardRect(i) {
    const card = $('ws-orders').querySelector('.ws-card[data-i="' + i + '"]');
    return card ? card.getBoundingClientRect() : null;
  }
  function flashCard(i) {
    const card = $('ws-orders').querySelector('.ws-card[data-i="' + i + '"]');
    if (!card) return;
    card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
  }

  function requestDeliver(orderIdx) {
    if (busy || won || !L) return;
    let v = -1;
    if (selReady && sel >= 0) {
      v = sel;
    } else {
      const dv = deliverableVials();
      if (dv.length === 0) { toast('Нет готовой ёмкости: соберите 4 одинаковые бусины'); Sound.playInvalid(); return; }
      if (dv.length > 1) { toast('Коснитесь ёмкости, которую хотите отдать'); return; }
      v = dv[0];
    }
    const ms = R.matchingOrders(rs, v);
    if (ms.length === 0) { toast('Для этих бусин нет заказа'); return; }
    let o = orderIdx;
    if (o == null) {
      if (ms.length === 1) o = ms[0];
      else {                                   // подходит нескольким — выбирает игрок
        sel = v; selReady = true; pickMode = true;
        Board.setSelected(v);
        toast('Подходит нескольким заказам — выберите карточку', 3200);
        refresh();
        return;
      }
    }
    if (ms.indexOf(o) === -1) {
      flashCard(o); Sound.playInvalid();
      toast(rs.orders[o].done ? 'Этот заказ уже выполнен' : 'Эти бусины не подходят этому заказу');
      return;
    }
    doDeliver(v, o);
  }

  function onCardTap(i) {
    if (busy || won || !L) return;
    const o = rs.orders[i];
    if (o.done) { toast('Этот заказ уже выполнен'); return; }
    if (selReady && sel >= 0) { requestDeliver(i); return; }
    const hasVial = deliverableVials().some(v => R.matchingOrders(rs, v).indexOf(i) !== -1);
    toast(hasVial ? 'Коснитесь готовой ёмкости, затем «Отдать заказ»' : 'Соберите четыре такие бусины в одной ёмкости');
  }

  function doDeliver(v, o) {
    const s = session;
    const bead = Object.assign({}, rs.vials[v][0]);
    const from = Board.getVialClientRect(v);
    const ok = R.deliverInPlace(rs, { vial: v, order: o });
    if (!ok) return;                           // повторное нажатие: заказ уже выполнен
    busy = true;                               // до конца анимации ввод закрыт
    landing.add(o);
    moveStack = [];                            // после выдачи отмена невозможна
    actionCount++;
    clearSelection();
    Board.clearHint();
    $('hint-toast').classList.add('hidden');
    $('btn-deliver').classList.remove('attention');
    Sound.playReward();
    track('deliver', { level: L.id, vial: v, order: o });
    refresh();
    playJewel(from, bead, cardRect(o), () => {
      if (s !== session) return;
      landing.delete(o);
      shownDelivered = rs.delivered;
      updateCounter(true);
      busy = false;
      refresh();
      flashCard(o);
      afterAction();
    });
  }

  /* ---------- «завершённое украшение»: 4 бусины → ожерелье → к заказчику ---------- */
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function playJewel(fromRect, bead, toRect, done) {
    const cv = $('jewel-canvas');
    if (reducedMotion() || !fromRect || !toRect) { setTimeout(done, 120); return; }
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const g = cv.getContext('2d');
    const origin = cv.getBoundingClientRect();
    const sx = fromRect.left + fromRect.width / 2 - origin.left;
    const sy = fromRect.top + fromRect.height * 0.5 - origin.top;
    const tx = toRect.left + toRect.width / 2 - origin.left;
    const ty = toRect.top + toRect.height * 0.4 - origin.top;
    const cx = W / 2, cy = Math.min(H * 0.5, Math.max(sy, H * 0.35));
    const ringR = Math.max(34, Math.min(W, H) * 0.11);
    const beadSize = Math.max(26, fromRect.elSize);
    const DURATION = 1350;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const t = Math.min(1, (now - t0) / DURATION);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      let ringX = cx, ringY = cy, scale = 1, alpha = 1, spin = 0, gather = 1;
      if (t < 0.35) {                           // A: бусины слетаются из ёмкости на кольцо
        gather = ease(t / 0.35);
        ringX = sx + (cx - sx) * gather; ringY = sy + (cy - sy) * gather;
      } else if (t < 0.7) {                     // B: ожерелье вращается и «пульсирует»
        spin = (t - 0.35) / 0.35;
        scale = 1 + Math.sin(spin * Math.PI) * 0.12;
      } else {                                  // C: уменьшается и летит к карточке заказа
        const k = ease((t - 0.7) / 0.3);
        ringX = cx + (tx - cx) * k; ringY = cy + (ty - cy) * k;
        scale = 1 - 0.72 * k; alpha = 1 - 0.25 * k; spin = 1 + k * 0.5;
      }
      g.globalAlpha = alpha;
      const R0 = ringR * scale * (t < 0.35 ? (0.25 + 0.75 * gather) : 1);
      g.strokeStyle = 'rgba(43,39,35,0.55)';    // нить
      g.lineWidth = Math.max(1.5, beadSize * 0.05) * scale;
      g.beginPath(); g.arc(ringX, ringY, R0, 0, Math.PI * 2); g.stroke();
      for (let k = 0; k < 4; k++) {             // 4 бусины на кольце
        const ang = -Math.PI / 2 + k * (Math.PI / 2) + spin * Math.PI * 0.5;
        const px = ringX + Math.cos(ang) * R0;
        const py = ringY + Math.sin(ang) * R0;
        Board.drawBead(g, px, py, beadSize * scale * (t < 0.35 ? (0.7 + 0.3 * gather) : 1), bead);
      }
      if (t >= 0.35 && t < 0.7) {               // искры в фазе B
        g.fillStyle = 'rgba(255,238,170,0.95)';
        for (let k = 0; k < 6; k++) {
          const a = spin * 6 + k * 1.05;
          const rr = R0 * (1.25 + 0.2 * Math.sin(a * 2));
          g.beginPath(); g.arc(ringX + Math.cos(a) * rr, ringY + Math.sin(a) * rr, 2.6 * scale, 0, Math.PI * 2); g.fill();
        }
      }
      g.globalAlpha = 1;
      if (t < 1) requestAnimationFrame(frame);
      else { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); done(); }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- после любого действия: победа / тупик ---------- */
  function afterAction() {
    if (won) return;
    if (rs.delivered >= L.goal && shownDelivered >= L.goal) { win(); return; }
    if (R.isDeadEnd(rs)) {
      toast('Ходов нет. Отмените ход ↺ или начните заново', 4200);
      $('btn-restart').classList.add('attention');
    } else {
      $('btn-restart').classList.remove('attention');
    }
  }

  function win() {
    if (won) return;                            // победа — ровно один раз
    won = true;
    winCount++; levelWins++;
    busy = true;
    Store.data.done[L.id] = true;
    Store.save();
    track('win', { level: L.id, actions: actionCount });
    $('hint-toast').classList.add('hidden');
    Sound.playWin();
    refresh();
    const s = session;
    setTimeout(() => {
      if (s !== session) return;
      Confetti.burst({ count: 56, durationMs: 2400 });
      const last = levelIdx === LEVELS.length - 1;
      $('ws-win-title').textContent = last ? 'Эпизод пройден!' : 'Заказы выполнены!';
      $('ws-win-text').textContent = 'Выдано заказов: ' + rs.delivered + ' из ' + L.goal + '. Действий: ' + actionCount + '.' +
        (last ? ' Мастерская открыта — спасибо за игру!' : '');
      $('btn-next').textContent = last ? 'В меню' : 'Дальше';
      $('win-overlay').classList.remove('hidden');
    }, 450);
  }

  /* ---------- перезапуск (второй тап подтверждает) ---------- */
  function disarmRestart() {
    clearTimeout(restartArmTimer);
    restartArmTimer = null;
    $('btn-restart').classList.remove('armed');
  }
  function onRestartTap() {
    if (busy || won || !L) return;
    if (restartArmTimer) { disarmRestart(); track('restart', { level: L.id }); loadLevel(levelIdx); return; }
    $('btn-restart').classList.add('armed');
    toast('Нажмите ещё раз: поле и заказы вернутся к началу', RESTART_ARM_MS);
    restartArmTimer = setTimeout(disarmRestart, RESTART_ARM_MS);
  }

  /* ---------- подсказка (бесплатная; решатель считает от текущей позиции) ---------- */
  function onHint() {
    if (busy || won || !L) return;
    const step = R.hint(rs);
    track('hint', { level: L.id, step: step ? step.t : null });
    if (!step) {
      toast('Отсюда заказы уже не выполнить — отмените ход или начните заново', 4200);
      $('btn-restart').classList.add('attention');
      return;
    }
    clearSelection();
    if (step.t === 'move') {
      Board.showHint(step.from, step.to);
      toast('Переложите бусины из одной ёмкости в другую', 2400);
    } else {
      Board.showHint(step.vial, step.vial);
      $('btn-deliver').classList.add('attention');
      toast('Ёмкость собрана — отдайте заказ', 2600);
    }
    refresh();
  }

  /* ---------- встроенная подсказка уровня 1 прямо на поле ---------- */
  function updateGuide() {
    const cap = $('ws-caption');
    if (!L || L.id !== 1 || won) { Board.setTutorial(-1); cap.textContent = ''; return; }
    const step = R.hint(rs);
    if (!step) { Board.setTutorial(-1); cap.textContent = 'Тупик: отмените ход ↺ или начните заново'; return; }
    if (step.t === 'deliver') {
      if (selReady && sel === step.vial) {
        Board.setTutorial(-1);
        cap.textContent = 'Нажмите «Отдать заказ»';
        $('btn-deliver').classList.add('attention');
      } else {
        Board.setTutorial(step.vial);
        cap.textContent = rs.delivered === 0
          ? 'Эта ёмкость уже собрана — коснитесь её, чтобы отдать заказ'
          : 'Ёмкость собрана — коснитесь её';
      }
      return;
    }
    $('btn-deliver').classList.remove('attention');
    const lead = rs.delivered > 0 ? 'Место освободилось! ' : '';
    if (sel === step.from && !selReady) {
      Board.setTutorial(step.to);
      cap.textContent = lead + 'Теперь коснитесь ёмкости, куда переложить';
    } else {
      Board.setTutorial(step.from);
      cap.textContent = lead + 'Коснитесь ёмкости, из которой переложить бусины';
    }
  }

  /* ---------- меню ---------- */
  function renderMenu() {
    const box = $('ws-level-pick');
    box.innerHTML = '';
    LEVELS.forEach((lv, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ws-level-btn' + (Store.data.done[lv.id] ? ' done' : '');
      b.textContent = String(lv.id);
      b.setAttribute('aria-label', 'Уровень ' + lv.id + ': ' + lv.name);
      b.addEventListener('click', () => { Sound.playClick(); loadLevel(i); });
      box.appendChild(b);
    });
  }

  function applyMute() {
    Sound.setMuted(Store.data.muted);
    ['btn-sound', 'btn-sound-game'].forEach(id => {
      $(id).style.opacity = Store.data.muted ? '0.45' : '1';
      $(id).setAttribute('aria-pressed', Store.data.muted ? 'true' : 'false');
    });
  }

  /* ---------- запуск ---------- */
  function init() {
    Store.load();
    Board.init($('board-canvas'));
    Board.setPhoneMultiRow(false);
    Board.setMarks(true);                        // метки цвета на бусинах (цвет не единственный признак)
    Fx.init($('fx-canvas'));
    Fx.setOutline(Board.THEME.outline);
    Confetti.init($('confetti-canvas'));

    // ввод по полю: pointer-события покрывают мышь и касания
    const cv = $('board-canvas');
    let downX = 0, downY = 0;
    cv.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; });
    cv.addEventListener('pointerup', (e) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 12) return; // свайп — не тап
      onTap(e.clientX, e.clientY);
    });

    $('btn-play').addEventListener('click', () => {
      Sound.playClick();
      const next = LEVELS.findIndex(l => !Store.data.done[l.id]);
      loadLevel(next === -1 ? 0 : next);
    });
    $('btn-back').addEventListener('click', () => { Sound.playClick(); session++; busy = false; showScreen('screen-menu'); renderMenu(); });
    $('btn-deliver').addEventListener('click', () => requestDeliver(null));
    $('btn-undo').addEventListener('click', undo);
    $('btn-restart').addEventListener('click', onRestartTap);
    $('btn-hint').addEventListener('click', onHint);
    $('btn-next').addEventListener('click', () => {
      Sound.playClick();
      $('win-overlay').classList.add('hidden');
      if (levelIdx < LEVELS.length - 1) loadLevel(levelIdx + 1);
      else { showScreen('screen-menu'); renderMenu(); }
    });
    $('btn-again').addEventListener('click', () => { Sound.playClick(); loadLevel(levelIdx); });
    ['btn-sound', 'btn-sound-game'].forEach(id => $(id).addEventListener('click', () => {
      Store.data.muted = !Store.data.muted; Store.save(); applyMute();
    }));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) Sound.suspend('hidden'); else Sound.resume('hidden');
    });
    window.addEventListener('resize', () => { if (L) requestAnimationFrame(() => { Board.resize(); redrawCards(); updateGuide(); }); });

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

  // Узкий read-only интерфейс для автотестов (не меняет игру).
  window.__ws = {
    state() {
      return {
        level: L && L.id, vials: rs && rs.vials.map(v => v.map(R.typeKey)),
        orders: rs && rs.orders.map(o => ({ key: R.typeKey(o), done: o.done })),
        delivered: rs && rs.delivered, shown: shownDelivered, goal: L && L.goal,
        won, winCount, levelWins, busy, sel, selReady, pickMode, undoDepth: moveStack.length, actions: actionCount
      };
    },
    vialCenter(i) {
      const r = Board.getVialClientRect(i);
      return r && { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
    },
    productId: PRODUCT_ID, saveKey: SAVE_KEY
  };

  init();
})();
