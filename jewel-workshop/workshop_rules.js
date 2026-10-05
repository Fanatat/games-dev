/* ============================================================
   workshop_rules.js — ПРАВИЛА «Мастерской украшений» без DOM.
   Чистые функции: одним и тем же кодом играет workshop.js (браузер),
   считает решатель (tools/ws_design.js) и проверяют тесты (node).

   Деталь (бусина) = { color: 'c1'|'c2'|'c3', shape: 'circle'|'square'|'diamond' }.
   Ёмкость = массив бусин СНИЗУ ВВЕРХ, вместимость CAP = 4.
   Перемещение между ёмкостями — ТЕ ЖЕ правила, что в game3 (game.js
   computeMoveCount / isCollected): переносится верхняя группа одинаковых
   бусин, пока хватает места; в непустую ёмкость — только на такую же
   (цвет И форма); из собранной (полной однородной) ёмкости не льют.

   Состояние: { vials, orders: [{color, shape, done}], goal, delivered }.
   Выдача (deliver) — отдельное действие: полная однородная ёмкость,
   подходящий невыполненный заказ → ёмкость становится пустой, заказ
   done, delivered++. Победа — delivered >= goal (и только это).
   ============================================================ */
(function (root) {
  'use strict';

  const CAP = 4;

  function sameType(a, b) {
    return !!a && !!b && a.color === b.color && a.shape === b.shape;
  }
  function typeKey(el) { return el.color + ':' + el.shape; }

  /* Ёмкость «собрана»: полная и однородная. Она заперта для переливания
     (как в game3) и готова к выдаче. */
  function isCollected(vial) {
    return vial.length === CAP && vial.every(el => sameType(el, vial[0]));
  }

  /* Сколько верхних одинаковых бусин из src поместится в dst (game3). */
  function moveCount(src, dst) {
    if (src.length === 0) return 0;
    if (dst.length >= CAP) return 0;
    const top = src[src.length - 1];
    const dstTop = dst[dst.length - 1];
    if (dst.length > 0 && !sameType(dstTop, top)) return 0;
    let count = 0;
    for (let i = src.length - 1; i >= 0; i--) {
      if (sameType(src[i], top)) count++; else break;
    }
    return Math.min(count, CAP - dst.length);
  }

  /* Легальные переливания: источник не пуст и не собран. */
  function legalMoves(vials) {
    const moves = [];
    for (let i = 0; i < vials.length; i++) {
      if (vials[i].length === 0 || isCollected(vials[i])) continue;
      for (let j = 0; j < vials.length; j++) {
        if (i !== j && moveCount(vials[i], vials[j]) > 0) moves.push({ t: 'move', from: i, to: j });
      }
    }
    return moves;
  }

  /* Индексы НЕвыполненных заказов, подходящих собранной ёмкости. */
  function matchingOrders(state, vialIdx) {
    const vial = state.vials[vialIdx];
    if (!vial || !isCollected(vial)) return [];
    const res = [];
    state.orders.forEach((o, i) => { if (!o.done && sameType(o, vial[0])) res.push(i); });
    return res;
  }

  function cloneState(s) {
    return {
      vials: s.vials.map(v => v.slice()),
      orders: s.orders.map(o => ({ color: o.color, shape: o.shape, done: !!o.done })),
      goal: s.goal,
      delivered: s.delivered
    };
  }

  function makeState(level) {
    return {
      vials: level.vials.map(v => v.map(el => ({ color: el.color, shape: el.shape }))),
      orders: level.orders.map(o => ({ color: o.color, shape: o.shape, done: false })),
      goal: level.goal,
      delivered: 0
    };
  }

  /* Операции «на месте» меняют переданное состояние (их зовёт интерфейс:
     Board держит ссылки на массивы ёмкостей). Возвращают число перенесённых
     бусин / true / false; при отказе состояние НЕ меняется. */
  function moveInPlace(s, mv) {
    if (mv.from === mv.to || !s.vials[mv.from] || !s.vials[mv.to]) return 0;
    if (isCollected(s.vials[mv.from])) return 0;
    const n = moveCount(s.vials[mv.from], s.vials[mv.to]);
    if (n === 0) return 0;
    const moved = s.vials[mv.from].splice(s.vials[mv.from].length - n, n);
    s.vials[mv.to].push(...moved);
    return n;
  }

  /* opts.keepVial — ТОЛЬКО для анализа («а если бы выдача не освобождала
     ёмкость»): бусины остаются в ёмкости, заказ отмечается. */
  function deliverInPlace(s, mv, opts) {
    const ok = matchingOrders(s, mv.vial);
    if (ok.indexOf(mv.order) === -1) return false; // заказ уже выполнен или не подходит
    s.orders[mv.order].done = true;
    s.delivered++;
    if (!(opts && opts.keepVial)) s.vials[mv.vial].length = 0;
    return true;
  }

  /* Применяют ход к КОПИИ состояния; возвращают null, если ход нелегален. */
  function applyMove(state, mv) {
    const s = cloneState(state);
    return moveInPlace(s, mv) ? s : null;
  }
  function applyDeliver(state, mv, opts) {
    const s = cloneState(state);
    return deliverInPlace(s, mv, opts) ? s : null;
  }
  function apply(state, mv, opts) {
    return mv.t === 'deliver' ? applyDeliver(state, mv, opts) : applyMove(state, mv);
  }

  /* Все выдачи, доступные сейчас. Заказы одного типа взаимозаменяемы, но
     в список попадают все — выбор карточки делает игрок. */
  function deliverMoves(state) {
    const res = [];
    for (let v = 0; v < state.vials.length; v++) {
      for (const o of matchingOrders(state, v)) res.push({ t: 'deliver', vial: v, order: o });
    }
    return res;
  }

  function allMoves(state, opts) {
    const dm = deliverMoves(state);
    return legalMoves(state.vials).concat(dm);
  }

  function isWon(state) { return state.delivered >= state.goal; }

  /* Тупик: ни перелива, ни выдачи, а цель не достигнута. */
  function isDeadEnd(state) {
    return !isWon(state) && allMoves(state).length === 0;
  }

  /* Ключ состояния для поиска: ёмкости взаимозаменяемы по порядку, заказы
     одного типа тоже. */
  function stateKey(s) {
    const v = s.vials.map(vial => vial.map(typeKey).join(',')).sort().join('|');
    const o = s.orders.filter(x => !x.done).map(typeKey).sort().join(',');
    return v + '#' + o + '#' + s.delivered;
  }

  /* Кратчайшее решение (BFS по числу действий: перелив и выдача — по 1).
     Возвращает { moves, states } или { moves: null }. opts.keepVial —
     вариант анализа. opts.cap — предохранитель по числу состояний. */
  function solve(state, opts) {
    opts = opts || {};
    const cap = opts.cap || 400000;
    const start = cloneState(state);
    if (isWon(start)) return { moves: [], visited: 1 };
    const seen = new Map();
    seen.set(stateKey(start), null);
    let frontier = [{ s: start, path: [] }];
    let visited = 1;
    while (frontier.length) {
      const next = [];
      for (const node of frontier) {
        const cand = legalMoves(node.s.vials).concat(deliverMoves(node.s));
        for (const mv of cand) {
          const ns = apply(node.s, mv, opts);
          if (!ns) continue;
          const k = stateKey(ns);
          if (seen.has(k)) continue;
          seen.set(k, 1);
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

  /* Полный обход достижимых состояний: сколько из них выигрышные/тупиковые
     и можно ли победить, выполнив именно заданную пару заказов. Нужен
     дизайну уровней и тестам («выбор между заказами»). */
  function reachability(state, opts) {
    opts = opts || {};
    const cap = opts.cap || 400000;
    const seen = new Map(); // key -> {s, win, dead}
    const stack = [cloneState(state)];
    seen.set(stateKey(stack[0]), true);
    let states = 0, dead = 0, won = 0;
    const pairs = new Set(); // варианты «какие заказы выполнены» в победных состояниях
    while (stack.length) {
      const s = stack.pop();
      states++;
      if (states > cap) return { states, capped: true };
      if (isWon(s)) {
        won++;
        pairs.add(s.orders.map((o, i) => o.done ? i : -1).filter(i => i >= 0).join('+'));
        continue; // после победы дальше не играем
      }
      const cand = legalMoves(s.vials).concat(deliverMoves(s));
      if (cand.length === 0) { dead++; continue; }
      for (const mv of cand) {
        const ns = apply(s, mv, opts);
        if (!ns) continue;
        const k = stateKey(ns);
        if (seen.has(k)) continue;
        seen.set(k, true);
        stack.push(ns);
      }
    }
    return { states, dead, won, winningPairs: Array.from(pairs).sort(), capped: false };
  }

  /* Подсказка: первый шаг кратчайшего решения от ТЕКУЩЕЙ позиции. */
  function hint(state) {
    const r = solve(state);
    return r.moves && r.moves.length ? r.moves[0] : null;
  }

  const api = {
    CAP, sameType, typeKey, isCollected, moveCount, legalMoves, matchingOrders,
    makeState, cloneState, moveInPlace, deliverInPlace, applyMove, applyDeliver, apply, deliverMoves, allMoves,
    isWon, isDeadEnd, stateKey, solve, reachability, hint
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkshopRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
