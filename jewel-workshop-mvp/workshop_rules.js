/* ============================================================
   workshop_rules.js — ПРАВИЛА «Мастерской украшений» (MVP) без DOM.
   Чистые функции: одним и тем же кодом играет workshop.js (браузер),
   считает решатель (tools/ws_design.js) и проверяют тесты (node).

   Камень = строка-идентификатор ('ruby', 'emerald', …). Ёмкость = массив
   камней СНИЗУ ВВЕРХ, вместимость CAP = 4.

   Перелив — как в game3: переносится верхняя группа одинаковых камней,
   сколько поместится; в непустую ёмкость — только на такой же камень.
   Отличия MVP от прототипа (по разбору docs/WORKSHOP.md, 08.10):
   - собранная ёмкость НЕ запирается: из неё можно брать камни;
   - выдача АВТОМАТИЧЕСКАЯ: ёмкость из четырёх одинаковых камней сразу
     уходит заказу этого камня, если такой заказ сейчас на столе;
   - заказы идут очередью: на столе `slots` карточек, выполненная
     сменяется следующим заказом из очереди; новый заказ может сразу
     забрать уже собранную ёмкость (цепочка выдач);
   - нужно выполнить ВСЕ заказы; камней на поле ровно на все заказы,
     поэтому победа = пустой стол;
   - отмена работает и через выдачу (состояние целиком — снимок).

   Состояние: { vials, orders, slots, next, delivered }:
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
     пустую даёт то же состояние с точностью до порядка ёмкостей. */
  function legalMoves(vials, prune) {
    const moves = [];
    for (let i = 0; i < vials.length; i++) {
      if (vials[i].length === 0) continue;
      const homo = prune && isHomogeneous(vials[i]);
      let emptyTried = false;
      for (let j = 0; j < vials.length; j++) {
        if (i === j) continue;
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
    return { vials: level.vials.map(v => v.slice()), orders: level.orders.slice(), slots, next: n, delivered: 0 };
  }

  function cloneState(s) {
    return { vials: s.vials.map(v => v.slice()), orders: s.orders, slots: s.slots.slice(), next: s.next, delivered: s.delivered };
  }

  function activeTypes(s) {
    return s.slots.filter(o => o >= 0).map(o => s.orders[o]);
  }

  /* Ёмкость, которую можно выдать прямо сейчас: первая по порядку собранная,
     для которой есть заказ на столе (карточка — самая левая подходящая). */
  function findDelivery(s) {
    for (let v = 0; v < s.vials.length; v++) {
      const vial = s.vials[v];
      if (!isComplete(vial) || vial[0] === SEALED) continue;
      const slot = s.slots.findIndex(o => o >= 0 && s.orders[o] === vial[0]);
      if (slot >= 0) return { vial: v, slot, order: s.slots[slot], gem: vial[0] };
    }
    return null;
  }

  /* Выдать заказы, пока есть что выдавать. Меняет s на месте, возвращает
     события по порядку: { vial, slot, order, gem, incoming } — incoming:
     заказ, занявший освободившуюся карточку (или -1). opts.keepVial —
     только анализ: камни остаются в ёмкости, она запечатана. */
  function settle(s, opts) {
    const events = [];
    let d;
    while ((d = findDelivery(s))) {
      if (opts && opts.keepVial) s.vials[d.vial] = [SEALED, SEALED, SEALED, SEALED];
      else s.vials[d.vial].length = 0;
      s.delivered++;
      const incoming = s.next < s.orders.length ? s.next++ : -1;
      s.slots[d.slot] = incoming;
      events.push(Object.assign(d, { incoming }));
    }
    return events;
  }

  /* Перелив «на месте» + автоматическая выдача. Возвращает
     { count, deliveries } или null, если ход нелегален (состояние не меняется). */
  function moveInPlace(s, mv, opts) {
    if (!mv || mv.from === mv.to) return null;
    const src = s.vials[mv.from], dst = s.vials[mv.to];
    const n = moveCount(src, dst);
    if (n === 0) return null;
    dst.push(...src.splice(src.length - n, n));
    return { count: n, deliveries: settle(s, opts) };
  }

  /* Ход на КОПИИ состояния; null — ход нелегален. */
  function applyMove(state, mv, opts) {
    const s = cloneState(state);
    return moveInPlace(s, mv, opts) ? s : null;
  }

  function isWon(s) { return s.delivered >= s.orders.length; }

  /* Тупик: не выиграно и ни одного перелива. */
  function isDeadEnd(s) { return !isWon(s) && legalMoves(s.vials).length === 0; }

  /* Ключ состояния: порядок ёмкостей и порядок карточек на столе не важны. */
  function stateKey(s) {
    const v = s.vials.map(x => x.join(',')).sort().join('|');
    return v + '#' + activeTypes(s).sort().join(',') + '#' + s.next;
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
        for (const mv of legalMoves(node.s.vials, true)) {
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
      const moves = legalMoves(s.vials, true);
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

  /* Подсказка: первый шаг кратчайшего решения от ТЕКУЩЕЙ позиции; null —
     отсюда не выиграть. */
  function hint(state, opts) {
    const r = solve(state, opts);
    return r.moves && r.moves.length ? r.moves[0] : null;
  }

  /* Можно ли ещё выиграть из позиции (с предохранителем: при переполнении
     считаем «можно», чтобы не пугать игрока ложной тревогой). */
  function isWinnable(state, opts) {
    const r = solve(state, Object.assign({ cap: 60000 }, opts || {}));
    return !!r.moves || !!r.capped;
  }

  const api = {
    CAP, SEALED, isComplete, isHomogeneous, moveCount, legalMoves, makeState, cloneState, activeTypes,
    findDelivery, settle, moveInPlace, applyMove, isWon, isDeadEnd, stateKey, solve, analyze, hint, isWinnable
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkshopRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
