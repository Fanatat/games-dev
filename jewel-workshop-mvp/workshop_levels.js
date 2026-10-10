/* ============================================================
   workshop_levels.js — уровни «Мастерской украшений» и их СОХРАНЁННЫЕ
   РЕШЕНИЯ (кратчайшие; подобраны tools/ws_design.js и перепроверяются
   tests/ws_rules_test.js на каждом прогоне).

   Камень — буква (таблица GEMS). Ёмкость — камни СНИЗУ ВВЕРХ через пробел,
   «-» — пустая. orders — очередь заказов (у каждого камня ровно один заказ
   на 4 штуки), slots — сколько карточек одновременно на столе.
   Решение — переливы «откуда>куда» через пробел (ёмкости с нуля, слева
   направо, как в массиве vials); выдача автоматическая и в решение не пишется.
   ============================================================ */
(function (root) {
  'use strict';

  /* Камни в порядке появления в уровнях; sprite — номер в атласе
     workshop_assets/gems.webp (tools/ws_cut_gems.py). Янтарь и топаз похожи —
     в одном уровне вместе не встречаются (топаз пока не используется). */
  const GEMS = {
    R: { id: 'ruby',      sprite: 0, name: 'Рубин',    names: 'рубины',    color: '#c8283c' },
    E: { id: 'emerald',   sprite: 1, name: 'Изумруд',  names: 'изумруды',  color: '#1f9a5a' },
    S: { id: 'sapphire',  sprite: 2, name: 'Сапфир',   names: 'сапфиры',   color: '#2856c8' },
    A: { id: 'amethyst',  sprite: 3, name: 'Аметист',  names: 'аметисты',  color: '#8a4cc0' },
    T: { id: 'turquoise', sprite: 4, name: 'Бирюза',   names: 'бирюзу',    color: '#2fb7b0' },
    O: { id: 'onyx',      sprite: 5, name: 'Оникс',    names: 'ониксы',    color: '#2a2a30' },
    D: { id: 'diamond',   sprite: 6, name: 'Бриллиант', names: 'бриллианты', color: '#e8eef4' },
    M: { id: 'amber',     sprite: 7, name: 'Янтарь',   names: 'янтарь',    color: '#e09a2a' },
    P: { id: 'opal',      sprite: 8, name: 'Опал',     names: 'опалы',     color: '#d8c8e8' },
    Z: { id: 'topaz',     sprite: 9, name: 'Топаз',    names: 'топазы',    color: '#e6b84a' }
  };

  const SRC = [
    {
      id: 1, name: 'Первый заказ', slots: 2,
      intent: 'Собрать четыре одинаковых камня: полная ёмкость сама уходит заказчику и освобождается.',
      orders: 'R E',
      vials: ['R R R E', 'E E E R', '-'],
      solution: '0>2 1>0 2>1'
    },
    {
      id: 2, name: 'Три камня', slots: 3,
      intent: 'Пустой ёмкости нет, места хватает только на один заказ: освободившаяся ёмкость нужна для следующего.',
      orders: 'E S R',
      vials: ['S R', 'S S E', 'S R R E', 'E E R'],
      solution: '2>1 3>0 1>3 0>3 0>1 2>3 1>2'
    },
    {
      id: 3, name: 'Очередь у прилавка', slots: 3,
      intent: 'Заказов больше, чем карточек: аметисты пока ждут в очереди. Собранную раньше времени ёмкость никто не заберёт.',
      orders: 'R S E A',
      vials: ['R S S S', 'R E E', 'S A', 'R E A A', 'R E A'],
      solution: '2>4 0>2 1>2 0>1 3>0 3>2 1>3 4>0 4>2 3>4'
    },
    {
      id: 4, name: 'Бирюза', slots: 2,
      intent: 'На столе только два заказа: важно, что собирать сначала, а что пока сложить в сторону.',
      orders: 'S E T A',
      vials: ['-', 'S S E S', 'E A A T', 'T A A E', 'T T E S'],
      solution: '1>0 4>0 1>4 0>1 2>0 2>1 3>2 3>1 0>3 4>2 3>4'
    },
    {
      id: 5, name: 'Ночной оникс', slots: 3,
      intent: 'Пять камней, пустой ёмкости нет; одинокая бирюза подсказывает, с чего начать.',
      orders: 'R A O T S',
      vials: ['S O T', 'T A O O', 'R R A A', 'T', 'R S S R', 'T S A O'],
      solution: '3>0 1>3 5>3 1>5 0>1 0>3 2>3 4>2 4>0 2>4 5>3 5>0 1>5'
    },
    {
      id: 6, name: 'Бриллиант к свадьбе', slots: 2,
      intent: 'Бриллианты нужны последними — их удобно копить на дне, пока не дойдёт очередь.',
      orders: 'O E S R D',
      vials: ['S O R E', 'E R E', 'R O D', 'D O R', 'S O E', 'S S D D'],
      solution: '1>4 1>3 0>1 4>1 0>1 0>4 3>1 3>4 2>3 5>3 0>5 2>0 1>2 4>0 4>5'
    },
    {
      id: 7, name: 'Янтарная брошь', slots: 3,
      intent: 'Шесть камней и три карточки: длинная партия с запасом места после каждой выдачи.',
      orders: 'E O T S A M',
      vials: ['O M O', 'A E O', 'O T S', 'A A T E', 'T S S M', 'A S M', 'E E T M'],
      solution: '1>0 3>1 6>5 6>3 1>6 2>6 3>2 1>3 4>1 4>6 2>4 0>2 0>1 0>2 5>1 5>6 3>5'
    },
    {
      id: 8, name: 'Опаловые серьги', slots: 2,
      intent: 'Опалы приходят четвёртыми: ёмкость под них лучше готовить заранее.',
      orders: 'T R A P S D',
      vials: ['P S', 'D S A R', 'D A T', 'R P P A', 'A S R P', 'D R T', 'T D S T'],
      solution: '5>2 1>5 3>1 4>3 4>5 0>4 3>0 5>3 2>3 1>2 1>4 1>5 4>1 2>4 2>5 6>3 6>1 6>5 3>6'
    },
    {
      id: 9, name: 'Полный прилавок', slots: 3,
      intent: 'Семь камней; три бриллианта уже лежат вместе, но их заказ последний.',
      orders: 'O T S A E R D',
      vials: ['R T E D', 'E A R', 'O T A', 'D D D', 'S O S A', 'R O S', 'T E S T', 'O R E A'],
      solution: '0>3 7>2 0>7 6>0 6>5 7>6 1>7 2>1 0>2 0>7 1>0 4>0 6>1 2>6 4>0 2>4 5>0 5>4 7>5 4>7 0>4'
    },
    {
      id: 10, name: 'Тесная витрина', slots: 2,
      intent: 'Семь камней и две карточки: позиций, из которых уже не выиграть, заметно больше.',
      orders: 'A P O D M S E',
      vials: ['E D E', 'M A A P', 'A E M D', 'A D M S', 'O E', 'O S P S', 'O O D P', 'M P S'],
      solution: '0>4 5>7 6>5 0>6 0>4 1>0 5>0 7>5 7>0 3>0 3>7 5>0 6>3 5>6 2>5 2>7 3>5 1>3 1>7 2>1 2>3 4>1 4>6'
    },
    {
      id: 11, name: 'Большой заказ', slots: 3,
      intent: 'Восемь камней, девять ёмкостей: самая длинная партия.',
      orders: 'O A T S R M E D',
      vials: ['E T', 'O D M O', 'M A A M', 'O S O', 'A S R T', 'R E R', 'T E D D', 'M S E T', 'A D S R'],
      solution: '1>3 2>1 4>0 5>4 7>0 5>7 4>5 8>5 4>8 4>2 0>4 7>0 8>7 6>8 6>0 4>6 7>4 1>7 1>6 3>1 3>4 1>3 8>6 2>8 2>7'
    },
    {
      id: 12, name: 'Мастер-ювелир', slots: 2,
      intent: 'Финал: восемь камней, две карточки и мало места — каждый пятый неверный путь ведёт в тупик.',
      orders: 'P R E A O S D T',
      vials: ['P R A D', 'O A P E', 'S A T T', 'R D S', 'P E S T', 'D R E O', 'E A R S', 'O O P D', 'T'],
      solution: '2>8 4>8 3>4 0>3 2>0 4>2 1>4 6>2 7>3 7>1 5>7 5>4 5>6 3>5 6>3 0>6 0>3 1>0 1>3 1>7 6>3 4>6 0>4'
    }
  ];

  function parseVial(s) { s = s.trim(); return s === '-' ? [] : s.split(/\s+/); }
  function formatVial(v) { return v.length ? v.join(' ') : '-'; }
  function parseMoves(s) {
    return s.trim() ? s.trim().split(/\s+/).map(tok => {
      const m = /^(\d+)>(\d+)$/.exec(tok);
      if (!m) throw new Error('bad solution step ' + tok);
      return { from: +m[1], to: +m[2] };
    }) : [];
  }
  function parseLevel(s) {
    return {
      id: s.id, name: s.name, intent: s.intent || '', slots: s.slots,
      orders: s.orders.trim().split(/\s+/),
      vials: s.vials.map(parseVial),
      solution: parseMoves(s.solution)
    };
  }

  const LEVELS = SRC.map(parseLevel);

  const api = { GEMS, LEVELS, SRC, parseLevel, parseVial, formatVial, parseMoves };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkshopLevels = api;
})(typeof window !== 'undefined' ? window : globalThis);
