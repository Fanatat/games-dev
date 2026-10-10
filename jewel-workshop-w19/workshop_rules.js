/* ============================================================
   workshop_rules.js — ПРАВИЛА «Мастерской украшений» без DOM.
   Чистые функции: одним и тем же кодом играет workshop.js (браузер),
   считает решатель (tools/ws_design.js) и проверяют тесты (node).

   Камень = строка-идентификатор (буква из GEMS). Ёмкость = массив
   камней СНИЗУ ВВЕРХ, вместимость CAP = 4.

   Перелив — как в game3: переносится верхняя группа одинаковых камней,
   сколько поместится; в непустую ёмкость — только на такой же камень.
   - собранная ёмкость НЕ запирается: из неё можно брать камни;
   - выдача АВТОМАТИЧЕСКАЯ: ёмкость из четырёх одинаковых камней сразу
     уходит заказу этого камня, если такой заказ сейчас на столе;
   - заказы идут очередью: на столе `slots` карточек, выполненная
     сменяется следующим заказом из очереди; новый заказ может сразу
     забрать уже собранную ёмкость (цепочка выдач — «каскад»);
   - нужно выполнить ВСЕ заказы; камней на поле ровно на все заказы,
     поэтому победа = пустой стол;
   - отмена работает и через выдачу (состояние целиком — снимок).

   Новинки (этап 5, docs/WORKSHOP.md):
   - тайные камни: hid[v] — сколько НИЖНИХ камней ёмкости скрыто под
     бархатом. Верхний камень всегда открыт: когда верхняя группа уходит,
     новый верхний открывается. На ходы это не влияет (камень остаётся
     собой), только на то, что видит игрок;
   - запертая пробирка: lock = { vial, order } — ёмкость нельзя трогать
     (ни брать, ни класть), пока не выполнен заказ order (на его карточке
     ключ). Открывается сама при этой выдаче.

   Состояние: { vials, orders, slots, next, delivered, hid, lock }:
     orders — типы камней всех заказов по очереди;
     slots  — для каждой карточки на столе индекс заказа или -1;
     next   — индекс следующего заказа в очереди.
   ============================================================ */
(function (root) {
  'use strict';

  const CAP = 4;
  const SEALED = '#';   // только для анализа: «выдача не освобождает ёмкость»

  function isComplete(vial) {
    return vial.length === CAP && vial.every(g => g === vial[0]);
  }

  /* Сколько верхних одинаковых камней из src поместится в dst (как в game3). */
  function moveCount(src, dst) {
    if (!src || !dst || src.length === 0 || dst.length >= CAP) return 0;
    const top = src[src.length - 1];
    if (top === SEALED) return 0;
    if (dst.length > 0 && dst[dst.length - 1] !== top) return 0;
    let count = 0;
    for (let i = src.length - 1; i >= 0 && src[i] === top; i--) count++;
    return Math.min(count, CAP - dst.length);
  }

  function isHomogeneous(vial) { return vial.length > 0 && vial.every(g => g === vial[0]); }

  /* Все переливы. prune — для решателя: перенос ЦЕЛОЙ однородной ёмкости в
     пустую даёт то же состояние с точностью до порядка ёмкостей.
     blocked — запертая ёмкость (или -1): её не трогают. */
  function legalMoves(vials, prune, blocked) {
    const moves = [];
    const b = blocked === undefined ? -1 : blocked;
    for (let i = 0; i < vials.length; i++) {
      if (vials[i].length === 0 || i === b) continue;
      const homo = prune && isHomogeneous(vials[i]);
      let emptyTried = false;
      for (let j = 0; j < vials.length; j++) {
        if (i === j || j === b) continue;
        if (prune && vials[j].length === 0) {
          if (homo || emptyTried) continue;      // все пустые ёмкости равноценны
          emptyTried = true;
        }
        if (moveCount(vials[i], vials[j]) > 0) moves.push({ from: i, to: j });
      }
    }
    return moves;
  }

  function makeState(level) {
    const n = Math.min(level.slots, level.orders.length);
    const slots = [];
    for (let i = 0; i < n; i++) slots.push(i);
    const hid = level.vials.map((v, i) => Math.max(0, Math.min((level.hidden && level.hidden[i]) | 0, v.length - 1)));
    return {
      vials: level.vials.map(v => v.slice()), orders: level.orders.slice(), slots, next: n, delivered: 0,
      hid, lock: level.lock ? { vial: level.lock.vial, order: level.lock.order } : null
    };
  }

  function cloneState(s) {
    return {
      vials: s.vials.map(v => v.slice()), orders: s.orders, slots: s.slots.slice(), next: s.next,
      delivered: s.delivered, hid: s.hid ? s.hid.slice() : s.vials.map(() => 0), lock: s.lock || null
    };
  }

  function activeTypes(s) {
    return s.slots.filter(o => o >= 0).map(o => s.orders[o]);
  }

  /* Заказ o уже выполнен: вышел из очереди и его нет на столе. */
  function isDelivered(s, o) { return o < s.next && s.slots.indexOf(o) === -1; }

  /* Индекс запертой сейчас ёмкости или -1. */
  function lockedVial(s) {
    return s.lock && !isDelivered(s, s.lock.order) ? s.lock.vial : -1;
  }

  function movesOf(s, prune) { return legalMoves(s.vials, prune, lockedVial(s)); }

  /* Ёмкость, которую можно выдать прямо сейчас: первая по порядку собранная,
     для которой есть заказ на столе (карточка — самая левая подходящая). */
  function findDelivery(s) {
    const locked = lockedVial(s);
    for (let v = 0; v < s.vials.length; v++) {
      const vial = s.vials[v];
      if (v === locked || !isComplete(vial) || vial[0] === SEALED) continue;
      const slot = s.slots.findIndex(o => o >= 0 && s.orders[o] === vial[0]);
      if (slot >= 0) return { vial: v, slot, order: s.slots[slot], gem: vial[0] };
    }
    return null;
  }

  /* Выдать заказы, пока есть что выдавать. Меняет s на месте, возвращает
     события по порядку: { vial, slot, order, gem, incoming, unlocked } —
     incoming: заказ, занявший освободившуюся карточку (или -1); unlocked:
     ёмкость, открывшаяся этой выдачей (или -1). opts.keepVial — только
     анализ: камни остаются в ёмкости, она запечатана. */
  function settle(s, opts) {
    const events = [];
    let d;
    while ((d = findDelivery(s))) {
      const wasLocked = lockedVial(s);
      if (opts && opts.keepVial) s.vials[d.vial] = [SEALED, SEALED, SEALED, SEALED];
      else s.vials[d.vial].length = 0;
      if (s.hid) s.hid[d.vial] = 0;
      s.delivered++;
      const incoming = s.next < s.orders.length ? s.next++ : -1;
      s.slots[d.slot] = incoming;
      const unlocked = wasLocked >= 0 && lockedVial(s) === -1 ? wasLocked : -1;
      events.push(Object.assign(d, { incoming, unlocked }));
    }
    return events;
  }

  /* Перелив «на месте» + автоматическая выдача. Возвращает
     { count, deliveries, revealed, movedHidden } или null, если ход нелегален
     (состояние не меняется). revealed — открылся новый верхний камень
     ёмкости-источника; movedHidden — сколько скрытых камней уехало вместе
     с группой (на новом месте они открыты). */
  function moveInPlace(s, mv, opts) {
    if (!mv || mv.from === mv.to) return null;
    const locked = lockedVial(s);
    if (mv.from === locked || mv.to === locked) return null;
    const src = s.vials[mv.from], dst = s.vials[mv.to];
    const n = moveCount(src, dst);
    if (n === 0) return null;
    dst.push(...src.splice(src.length - n, n));
    let revealed = false, movedHidden = 0;
    if (s.hid) {
      const h = s.hid[mv.from];
      movedHidden = Math.max(0, h - src.length);
      let nh = Math.min(h, src.length);
      if (src.length && nh > src.length - 1) { nh = src.length - 1; revealed = true; }
      s.hid[mv.from] = nh;
    }
    return { count: n, deliveries: settle(s, opts), revealed, movedHidden };
  }

  /* Ход на КОПИИ состояния; null — ход нелегален. */
  function applyMove(state, mv, opts) {
    const s = cloneState(state);
    return moveInPlace(s, mv, opts) ? s : null;
  }

  function isWon(s) { return s.delivered >= s.orders.length; }

  /* Тупик: не выиграно и ни одного перелива. */
  function isDeadEnd(s) { return !isWon(s) && movesOf(s).length === 0; }

  /* Ключ состояния: порядок ёмкостей и порядок карточек на столе не важны.
     Запертая ёмкость помечена «!» (её содержимое нельзя смешивать с другими). */
  function stateKey(s) {
    const locked = lockedVial(s);
    const v = s.vials.map((x, i) => (i === locked ? '!' : '') + x.join(',')).sort().join('|');
    return v + '#' + activeTypes(s).sort().join(',') + '#' + s.next;
  }

  /* Оценка «сколько ещё работы» для поиска с эвристикой: камни над нижней
     однородной частью ёмкости + разбитые по нескольким ёмкостям основания. */
  function disorder(s) {
    let h = 0;
    const bases = {};
    for (const v of s.vials) {
      if (!v.length) continue;
      let k = 1;
      while (k < v.length && v[k] === v[0]) k++;
      h += v.length - k;
      if (bases[v[0]] === undefined) bases[v[0]] = k;
      else { h += Math.min(bases[v[0]], k); bases[v[0]] = Math.max(bases[v[0]], k); }
    }
    return h + (s.orders.length - s.delivered);
  }

  /* Кратчайшее решение (BFS по числу переливов). { moves, visited } или
     { moves: null }. opts.cap — предохранитель по числу состояний. */
  function solve(state, opts) {
    opts = opts || {};
    const cap = opts.cap || 300000;
    const start = cloneState(state);
    settle(start, opts);
    if (isWon(start)) return { moves: [], visited: 1 };
    const seen = new Set([stateKey(start)]);
    let frontier = [{ s: start, path: [] }];
    let visited = 1;
    while (frontier.length) {
      const next = [];
      for (const node of frontier) {
        for (const mv of movesOf(node.s, true)) {
          const ns = applyMove(node.s, mv, opts);
          if (!ns) continue;
          const k = stateKey(ns);
          if (seen.has(k)) continue;
          seen.add(k);
          visited++;
          const path = node.path.concat([mv]);
          if (isWon(ns)) return { moves: path, visited };
          if (visited > cap) return { moves: null, visited, capped: true };
          next.push({ s: ns, path });
        }
      }
      frontier = next;
    }
    return { moves: null, visited };
  }

  /* Быстрый поиск ЛЮБОГО решения: лучший-первым по g + w·disorder.
     Решение не обязательно кратчайшее. { moves, visited } / { moves: null[, capped] }. */
  function solveFast(state, opts) {
    opts = opts || {};
    const cap = opts.cap || 60000, w = opts.weight || 2;
    const start = cloneState(state);
    settle(start);
    if (isWon(start)) return { moves: [], visited: 1 };
    const heap = [];
    const push = (n) => {
      heap.push(n);
      let i = heap.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (heap[p].f <= n.f) break; heap[i] = heap[p]; i = p; }
      heap[i] = n;
    };
    const pop = () => {
      const top = heap[0], last = heap.pop();
      if (heap.length) {
        let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1;
          let m = i, mf = last.f;
          if (l < heap.length && heap[l].f < mf) { m = l; mf = heap[l].f; }
          if (r < heap.length && heap[r].f < mf) m = r;
          if (m === i) break;
          heap[i] = heap[m]; i = m;
        }
        heap[i] = last;
      }
      return top;
    };
    const seen = new Set([stateKey(start)]);
    push({ s: start, g: 0, f: w * disorder(start), path: null });
    let visited = 1, seq = 0;
    while (heap.length) {
      const node = pop();
      for (const mv of movesOf(node.s, true)) {
        const ns = applyMove(node.s, mv);
        if (!ns) continue;
        const k = stateKey(ns);
        if (seen.has(k)) continue;
        seen.add(k);
        visited++;
        const path = { mv, prev: node.path };
        if (isWon(ns)) {
          const moves = [];
          for (let p = path; p; p = p.prev) moves.unshift(p.mv);
          return { moves, visited };
        }
        if (visited > cap) return { moves: null, visited, capped: true };
        // seq — устойчивость порядка при равных оценках
        push({ s: ns, g: node.g + 1, f: node.g + 1 + w * disorder(ns) + (seq++) * 1e-9, path });
      }
    }
    return { moves: null, visited };
  }

  /* Полный граф достижимых состояний: сколько всего, сколько безнадёжных
     (победа недостижима), сколько тупиков (нет ходов). Нужен дизайну
     уровней и тестам. */
  function analyze(state, opts) {
    opts = opts || {};
    const cap = opts.cap || 300000;
    const start = cloneState(state);
    settle(start, opts);
    const keys = new Map();
    const nodes = [];      // { won, dead, out: [ids] }
    const queue = [start];
    keys.set(stateKey(start), 0);
    nodes.push({ won: isWon(start), out: [] });
    for (let qi = 0; qi < queue.length; qi++) {
      if (nodes.length > cap) return { states: nodes.length, capped: true };
      const s = queue[qi];
      const node = nodes[qi];
      if (node.won) continue;
      const moves = movesOf(s, true);
      node.dead = moves.length === 0;
      for (const mv of moves) {
        const ns = applyMove(s, mv, opts);
        if (!ns) continue;
        const k = stateKey(ns);
        let id = keys.get(k);
        if (id === undefined) {
          id = nodes.length;
          keys.set(k, id);
          nodes.push({ won: isWon(ns), out: [] });
          queue.push(ns);
        }
        node.out.push(id);
      }
    }
    // Обратный проход: «хорошие» — из которых достижима победа.
    const rev = nodes.map(() => []);
    nodes.forEach((n, i) => n.out.forEach(j => rev[j].push(i)));
    const good = new Uint8Array(nodes.length);
    const stack = [];
    nodes.forEach((n, i) => { if (n.won) { good[i] = 1; stack.push(i); } });
    while (stack.length) {
      const j = stack.pop();
      for (const i of rev[j]) if (!good[i]) { good[i] = 1; stack.push(i); }
    }
    let lost = 0, dead = 0;
    nodes.forEach((n, i) => { if (!good[i]) lost++; if (n.dead) dead++; });
    const startMoves = nodes[0].out.length;
    const startTraps = nodes[0].out.filter(j => !good[j]).length;
    return { states: nodes.length, lost, dead, winnable: !!good[0], startMoves, startTraps, capped: false };
  }

  /* Подсказка: первый шаг кратчайшего решения от ТЕКУЩЕЙ позиции; если
     позиций слишком много для поиска в ширину (просторные уровни) — первый
     шаг быстрого решения. null — отсюда не выиграть. */
  function hint(state, opts) {
    opts = opts || {};
    const r = solve(state, { cap: opts.cap || 25000 });
    if (r.moves) return r.moves.length ? r.moves[0] : null;
    if (!r.capped) return null;
    const f = solveFast(state, { cap: opts.fastCap || 80000 });
    return f.moves && f.moves.length ? f.moves[0] : null;
  }

  /* Можно ли ещё выиграть из позиции. Быстрый поиск находит решение почти
     сразу, если оно есть; безнадёжные позиции тесные и перебираются целиком.
     При переполнении считаем «можно», чтобы не пугать игрока ложной тревогой. */
  function isWinnable(state, opts) {
    const r = solveFast(state, Object.assign({ cap: 60000 }, opts || {}));
    return !!r.moves || !!r.capped;
  }

  const api = {
    CAP, SEALED, isComplete, isHomogeneous, moveCount, legalMoves, movesOf, makeState, cloneState, activeTypes,
    isDelivered, lockedVial, findDelivery, settle, moveInPlace, applyMove, isWon, isDeadEnd, stateKey, disorder,
    solve, solveFast, analyze, hint, isWinnable
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkshopRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
