/* ============================================================
   workshop_levels.js — три вручную подготовленных уровня «Мастерской
   украшений» + СОХРАНЁННЫЕ РЕШЕНИЯ (кратчайшие, найдены tools/ws_design.js
   и перепроверены tests/ws_rules_test.js на каждом прогоне).

   Запись бусины: <цвет 1-3><форма o|s|d> = круг | квадрат | ромб; ёмкость —
   бусины СНИЗУ ВВЕРХ через пробел, «-» — пустая. Заказ — один образец
   (нужно 4 одинаковые бусины). Цель каждого уровня — любые 2 из 3 заказов.
   Решение: «M<откуда>><куда>» — перелив, «D<ёмкость>#<заказ>» — выдача.
   ============================================================ */
(function (root) {
  'use strict';
  const SHAPES = { o: 'circle', s: 'square', d: 'diamond' };
  function bead(t) { return { color: 'c' + t[0], shape: SHAPES[t[1]] }; }
  function vial(s) { s = s.trim(); return s === '-' ? [] : s.split(/\s+/).map(bead); }
  function move(code) {
    let m = /^M(\d+)>(\d+)$/.exec(code);
    if (m) return { t: 'move', from: +m[1], to: +m[2] };
    m = /^D(\d+)#(\d+)$/.exec(code);
    if (m) return { t: 'deliver', vial: +m[1], order: +m[2] };
    throw new Error('bad solution step ' + code);
  }
  const SRC = [
    {
      id: 1, name: "Первый заказ",
      intent: "Показать выдачу и освобождение ёмкости: готовая ёмкость сразу уходит заказчику, на её месте можно досортировать.",
      vials: ["1o 1o 1o 2s","2s 2s 2s 1o","3o 3o 3o 3o","2d 3d 2d"],
      orders: ["1o","2s","3o"], goal: 2,
      solution: ["D2#2","M0>2","M1>0","D0#0"]
    },
    {
      id: 2, name: "Выбор заказа",
      intent: "Три заказа, нужны два: терракотовые ромбы обязательны, второй заказ — на выбор. Одна пустая ёмкость и место, освободившееся после выдачи, нужны для сортировки.",
      vials: ["1s 2s 2s 1s","-","1o 2s 1o 2s","1s 1s 1d 1d","1d 1d 1o 1o"],
      orders: ["2s","1d","1o"], goal: 2,
      solution: ["M4>1","M3>4","D4#1","M2>4","M2>1","M2>4","M1>2","D2#2"]
    },
    {
      id: 3, name: "Тесная мастерская",
      intent: "Шесть ёмкостей и ни одной пустой, места почти нет: порядок действий решает. Четыре терракотовых квадрата никому не заказаны — их можно сложить в ёмкость-копилку (она закроется навсегда), но тогда места ещё меньше.",
      vials: ["1s 3o 1s","3o 3d 1o","3o 1o 2d 1o","3d 2d 2d 1o","1s 2d 1s","3d 3d 3o"],
      orders: ["3d","2d","3o"], goal: 2,
      solution: ["M0>4","M0>5","M2>1","M4>0","M4>2","M0>4","M2>0","M3>2","M3>0","D0#1","M1>0","M1>3","M5>1","M3>5","D5#0"]
    }
  ];

  const LEVELS = SRC.map(s => ({
    id: s.id, name: s.name, intent: s.intent, goal: s.goal,
    vials: s.vials.map(vial),
    orders: s.orders.map(bead),
    solution: s.solution.map(move)
  }));

  const api = { LEVELS, SRC, bead, vial, move };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkshopLevels = api;
})(typeof window !== 'undefined' ? window : globalThis);
