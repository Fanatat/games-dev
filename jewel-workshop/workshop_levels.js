/* ============================================================
   workshop_levels.js — уровни «Мастерской украшений» и их СОХРАНЁННЫЕ
   РЕШЕНИЯ (кратчайшие; подобраны tools/ws_design.js и перепроверяются
   tests/ws_rules_test.js на каждом прогоне).

   Камень — буква (таблица GEMS). Ёмкость — камни СНИЗУ ВВЕРХ через пробел,
   «-» — пустая. orders — очередь заказов (у каждого камня ровно один заказ
   на 4 штуки), slots — сколько карточек одновременно на столе.
   Решение — переливы «откуда>куда» через пробел (ёмкости с нуля, слева
   направо, как в массиве vials); выдача автоматическая и в решение не пишется.

   Уровни между метками SRC:BEGIN/SRC:END пишет tools/ws_campaign.js (emit).
   piece — изделие (workshop_jewelry.js); par — длина эталонного решения,
   s3/s2 — сколько ходов на три/две звезды; hard — «Сложный заказ» с лимитом
   ходов limit; lock — ёмкость vial заперта до выдачи заказа order (номер в
   очереди); hidden — сколько нижних камней каждой ёмкости под бархатом;
   urgent — срочный заказ: успеть за moves ходов с его появления на столе;
   novelty — на этом уровне впервые показывается новинка.
   ============================================================ */
(function (root) {
  'use strict';

  /* Камни в порядке появления в уровнях; sprite — номер в атласе
     workshop_assets/gems.webp (tools/ws_cut_gems.py). Янтарь и топаз похожи —
     в одном уровне вместе не встречаются. Топаз (Z) — золотой камень-джекпот
     (этап 5): его заказ приносит +100 монет, на поле у него тёплый ореол. */
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
    /* SRC:BEGIN */
    {
      id: 1, name: 'Колечко «Капель»', piece: 'ring', slots: 1,
      intent: 'Соберите четыре одинаковых камня — заказ заберёт их сам.',
      orders: 'R E',
      vials: ['R R R E', 'E E E R', '-'],
      par: 3, s3: 4, s2: 8,
      solution: '0>2 1>0 1>2'
    },
    {
      id: 2, name: 'Серьги «Подснежник»', piece: 'earrings', slots: 2,
      orders: 'M R D',
      vials: ['D D M', 'R R R', 'D M D M', 'R M', '-'],
      par: 7, s3: 9, s2: 14,
      solution: '0>3 2>3 2>0 2>4 0>2 3>4 1>3'
    },
    {
      id: 3, name: 'Кулон «Ручеёк»', piece: 'pendant', slots: 1,
      intent: 'Соберите следующий камень заранее — после выдачи он уйдёт сам: каскад!',
      orders: 'E P T',
      vials: ['T T T P', '-', 'E E E', 'P P E', 'P T'],
      par: 4, s3: 5, s2: 9,
      solution: '3>2 0>3 4>0 3>4'
    },
    {
      id: 4, name: 'Брошь «Первоцвет»', piece: 'brooch', slots: 2,
      orders: 'A O D M',
      vials: ['M D A A', 'O D', 'M M M', 'O O D', '-', 'O D A A'],
      par: 9, s3: 12, s2: 18,
      solution: '0>4 0>1 0>2 1>0 3>0 1>3 5>4 5>0 3>5'
    },
    {
      id: 5, name: 'Браслет «Весенний сад»', piece: 'bracelet', slots: 2,
      orders: 'M D T R',
      vials: ['R T D D', 'R T T M', '-', 'R R D T', 'D M M M'],
      par: 9, s3: 12, s2: 18,
      hard: true, limit: 14,
      solution: '1>2 3>1 4>2 0>4 0>2 1>2 0>1 3>4 1>3'
    },
    {
      id: 6, name: 'Кольцо «Жемчужный берег»', piece: 'ring', slots: 2,
      intent: 'Новое: тайные камни под бархатом — откроются, когда снимете камень сверху.',
      orders: 'D O A T',
      vials: ['T T', 'A A A D', 'O O D', 'T T D D', 'A O O', '-'],
      par: 6, s3: 8, s2: 13,
      hidden: [1, 0, 0, 2, 0, 0], novelty: 'hidden',
      solution: '1>2 2>5 3>5 0>3 4>2 1>4'
    },
    {
      id: 7, name: 'Серьги «Волна»', piece: 'earrings', slots: 2,
      orders: 'O R D T P',
      vials: ['T D', 'D D T D', '-', 'P P P', 'R T R O', 'R R O', 'T P O O'],
      par: 11, s3: 14, s2: 21,
      solution: '1>0 4>2 5>2 4>5 1>4 0>1 0>4 6>2 6>3 4>6 4>5'
    },
    {
      id: 8, name: 'Кулон «Маяк»', piece: 'pendant', slots: 1,
      orders: 'R P T O D',
      vials: ['D D R R', 'D O', '-', 'T T R R', 'O O P P', 'T T', 'D O P P'],
      par: 9, s3: 12, s2: 18,
      solution: '0>2 3>2 3>5 4>2 1>4 0>1 6>2 6>4 1>6'
    },
    {
      id: 9, name: 'Брошь «Морская звезда»', piece: 'brooch', slots: 2,
      orders: 'M P O A D',
      vials: ['A A P', 'P A M M', '-', 'D D O', 'O P P', 'A D M M', 'D O O'],
      par: 10, s3: 13, s2: 19,
      hidden: [1, 0, 0, 1, 0, 0, 1],
      solution: '0>4 1>2 0>1 3>6 5>2 5>3 1>5 4>1 6>4 3>6'
    },
    {
      id: 10, name: 'Колье «Прибой»', piece: 'necklace', slots: 2,
      orders: 'R D P T M',
      vials: ['M P P P', 'M M T D', 'D T R D', 'M P R R', '-', 'T T D R'],
      par: 13, s3: 17, s2: 25,
      hard: true, limit: 19,
      solution: '3>4 5>4 2>5 2>4 0>4 3>4 0>3 1>0 1>2 1>3 5>0 2>5 0>2'
    },
    {
      id: 11, name: 'Кольцо «Роза»', piece: 'ring', slots: 2,
      intent: 'Новое: срочный заказ — успейте за отмеченное число ходов и получите тройную плату.',
      orders: 'P A T O M',
      vials: ['-', 'M M P', 'T A A', 'O O A', 'A O P P', 'T T T P', 'O M M'],
      par: 9, s3: 12, s2: 18,
      urgent: { order: 2, moves: 6 }, novelty: 'urgent',
      solution: '1>0 3>2 4>0 3>4 5>0 6>1 4>6 2>4 2>5'
    },
    {
      id: 12, name: 'Серьги «Пион»', piece: 'earrings', slots: 2,
      orders: 'P O E S R A',
      vials: ['S P E', 'A A E E', 'S O P P', '-', 'R R R', 'S R', 'O O O E', 'A A S P'],
      par: 12, s3: 15, s2: 23,
      solution: '0>3 1>3 2>0 5>4 6>3 2>6 0>3 0>2 2>5 7>3 7>5 1>7'
    },
    {
      id: 13, name: 'Заколка «Лаванда»', piece: 'hairpin', slots: 2,
      orders: 'P O T A E S',
      vials: ['-', 'S S S P', 'A T', 'S E T P', 'E E O O', 'T P', 'A A A P', 'E T O O'],
      par: 13, s3: 17, s2: 25,
      hidden: [0, 2, 1, 0, 0, 0, 2, 0], urgent: { order: 1, moves: 6 },
      solution: '1>0 3>0 2>3 5>0 3>5 6>0 2>6 4>0 3>4 1>3 7>0 7>5 4>7'
    },
    {
      id: 14, name: 'Брошь «Ирис»', piece: 'brooch', slots: 1,
      orders: 'D A M E P O',
      vials: ['A A A', 'P P P A', 'P E M', 'E E', 'E D D D', 'O O O D', '-', 'O M M M'],
      par: 9, s3: 12, s2: 18,
      solution: '1>0 2>6 2>3 1>2 4>1 3>4 5>1 7>6 5>7'
    },
    {
      id: 15, name: 'Диадема «Сад королевы»', piece: 'tiara', slots: 2,
      orders: 'R M D S P',
      vials: ['P R M R', 'S D D R', 'P D M R', 'P P M M', 'S S S D', '-'],
      par: 13, s3: 17, s2: 25,
      hard: true, limit: 20, hidden: [0, 0, 0, 2, 2, 0],
      solution: '0>5 1>5 2>5 0>2 0>5 1>5 4>5 1>4 2>1 2>5 0>2 3>1 2>3'
    },
    {
      id: 16, name: 'Кольцо «Полярная звезда»', piece: 'ring', slots: 2,
      intent: 'Новое: запертая пробирка — ключ придёт с отмеченным заказом.',
      orders: 'M D E S R O',
      vials: ['R S D D', 'S S E D', 'S R E D', 'R O M M', 'O R E M', '-', '-', 'O O E M'],
      par: 17, s3: 22, s2: 31,
      lock: { vial: 6, order: 2 }, novelty: 'lock',
      solution: '0>5 1>5 2>5 1>2 0>1 2>5 0>2 3>0 4>0 4>5 2>4 1>2 7>0 7>5 3>7 4>3 4>7'
    },
    {
      id: 17, name: 'Кулон «Комета»', piece: 'pendant', slots: 2,
      orders: 'A M D R T S',
      vials: ['D D M M', 'T D A', '-', 'R T D', 'T R R A', 'S S', 'T S M M', 'S R A A'],
      par: 14, s3: 18, s2: 26,
      lock: { vial: 5, order: 3 },
      solution: '0>2 3>0 4>1 6>2 1>2 1>0 1>3 7>2 4>7 3>4 7>3 5>6 6>7 4>6'
    },
    {
      id: 18, name: 'Запонки «Созвездие»', piece: 'cufflinks', slots: 2,
      orders: 'M A T S D P',
      vials: ['-', 'A A', 'D P', 'P P A T', 'S S M M', 'D D T M', 'P D M A', 'T S S T'],
      par: 13, s3: 17, s2: 25,
      hidden: [0, 0, 1, 2, 0, 0, 0, 2], urgent: { order: 1, moves: 7 },
      solution: '4>0 5>0 6>1 6>0 7>5 7>4 3>7 3>1 2>3 2>6 5>7 6>5 3>6'
    },
    {
      id: 19, name: 'Браслет «Млечный путь»', piece: 'bracelet', slots: 2,
      orders: 'O T D R S A P',
      vials: ['-', 'A R D T', '-', 'A A D O', 'P P O O', 'S S T T', 'P P S O', 'R R R D', 'A S D T'],
      par: 16, s3: 20, s2: 30,
      lock: { vial: 2, order: 2 },
      solution: '1>0 5>0 7>1 8>0 1>0 1>7 8>0 8>5 1>8 3>1 3>0 3>8 4>1 6>1 6>5 4>6'
    },
    {
      id: 20, name: 'Колье «Звездопад»', piece: 'necklace', slots: 2,
      orders: 'A E O T R S',
      vials: ['O A A A', 'R E T E', 'S T T A', 'T R O E', '-', 'S S R E', 'S R O O'],
      par: 15, s3: 19, s2: 28,
      hard: true, limit: 21, lock: { vial: 5, order: 3 },
      solution: '0>4 2>4 1>4 1>2 1>4 3>4 3>0 3>1 2>3 6>0 5>4 5>1 2>5 6>1 5>6'
    },
    {
      id: 21, name: 'Кольцо «Золотая листва»', piece: 'ring', slots: 2,
      intent: 'Новое: золотой топаз — соберите четыре и сорвите джекпот!',
      orders: 'D A Z R E S',
      vials: ['S S S Z', 'Z Z', 'R E D D', 'E Z D', '-', 'R E D', 'S A A A', 'E R R A'],
      par: 13, s3: 17, s2: 25,
      novelty: 'gold',
      solution: '0>1 2>4 3>4 3>1 2>3 5>4 3>5 6>1 0>6 7>1 7>2 5>7 2>5'
    },
    {
      id: 22, name: 'Серьги «Рябина»', piece: 'earrings', slots: 3,
      orders: 'R S O P T D M',
      vials: ['-', 'M T S S', 'D D O', 'P P P', 'M T T R', 'T O O O', 'M M P S', 'D R', 'D S R R'],
      par: 15, s3: 19, s2: 28,
      hidden: [0, 0, 0, 0, 2, 0, 2, 0, 2],
      solution: '1>0 4>7 1>4 6>0 6>3 1>6 2>1 5>1 4>5 4>6 7>1 2>7 8>1 8>0 7>8'
    },
    {
      id: 23, name: 'Брошь «Клён»', piece: 'brooch', slots: 2,
      orders: 'D P S T O Z A',
      vials: ['-', 'A A S P', 'Z Z P P', 'O O D', 'Z A D', 'A Z S P', 'O O D D', 'T T S S', 'T T'],
      par: 15, s3: 19, s2: 28,
      urgent: { order: 1, moves: 7 },
      solution: '1>0 2>0 3>4 5>0 1>0 5>0 2>5 4>2 4>1 5>4 1>5 6>2 3>6 7>0 7>8'
    },
    {
      id: 24, name: 'Заколка «Жёлудь»', piece: 'hairpin', slots: 2,
      orders: 'R T D E A S',
      vials: ['S D D D', 'S A T R', 'E E', 'E E R R', 'A A A', 'S S D R', '-', 'T T T'],
      par: 10, s3: 13, s2: 19,
      lock: { vial: 2, order: 1 },
      solution: '1>6 1>7 0>7 1>4 0>1 3>6 2>3 5>6 5>7 1>5'
    },
    {
      id: 25, name: 'Диадема «Листопад»', piece: 'tiara', slots: 2,
      orders: 'P R A Z E T',
      vials: ['-', 'T E P R', 'T Z Z R', 'E E E R', 'Z R P P', 'Z A A P', 'T T A A'],
      par: 14, s3: 18, s2: 26,
      hard: true, limit: 20,
      solution: '4>0 1>4 1>0 2>4 5>0 3>0 1>3 4>0 2>4 1>2 5>0 4>5 6>0 2>6'
    },
    {
      id: 26, name: 'Перстень «Скипетр»', piece: 'ring', slots: 2,
      orders: 'T E D A Z P O',
      vials: ['O O D D', 'P Z D D', 'Z Z A T', 'Z A T', 'P E E E', 'O O T', 'A T', 'P P A E', '-'],
      par: 16, s3: 20, s2: 30,
      hidden: [0, 2, 2, 0, 0, 0, 0, 2, 0],
      solution: '0>8 1>8 2>3 3>6 2>3 2>1 4>2 7>2 5>2 0>5 6>2 3>6 1>3 1>4 7>6 4>7'
    },
    {
      id: 27, name: 'Кулон «Держава»', piece: 'pendant', slots: 2,
      orders: 'S M P R O E',
      vials: ['R P S S', 'E R R S', '-', 'P P O M', 'O O P S', 'O E R M', 'E E M M', '-'],
      par: 14, s3: 18, s2: 26,
      lock: { vial: 2, order: 1 },
      solution: '0>7 1>7 4>7 0>4 1>0 3>7 5>7 5>0 1>5 6>7 5>6 3>5 4>3 4>5'
    },
    {
      id: 28, name: 'Колье «Бал»', piece: 'necklace', slots: 3,
      orders: 'O D E R A T M P',
      vials: ['T E D D', 'A R', 'P T T E', 'M T D D', '-', 'M A A', 'P P P O', 'A R O O', 'R R E E', 'M M O'],
      par: 17, s3: 22, s2: 31,
      hidden: [2, 0, 0, 0, 0, 1, 0, 0, 0, 1], urgent: { order: 1, moves: 6 },
      solution: '0>4 2>0 3>4 0>4 2>0 3>0 6>9 2>6 7>2 1>7 1>5 8>4 7>8 5>7 3>5 9>2 5>9'
    },
    {
      id: 29, name: 'Браслет «Трон»', piece: 'bracelet', slots: 2,
      orders: 'T O P Z E S R',
      vials: ['R Z O O', 'E E Z T', 'S E P T', 'S R R P', 'S S P P', 'E Z T T', '-', '-', 'R Z O O'],
      par: 18, s3: 23, s2: 33,
      lock: { vial: 7, order: 2 },
      solution: '0>6 8>6 0>6 8>6 0>8 1>0 1>6 2>0 3>2 3>8 5>0 2>0 1>2 4>0 3>4 5>6 2>5 2>4'
    },
    {
      id: 30, name: 'Корона мастера', piece: 'crown', slots: 2,
      orders: 'S O T P Z A R',
      vials: ['Z T P T', 'R Z O S', 'A A S O', 'R R O T', 'Z Z S S', 'R A A P', '-', 'P P T O'],
      par: 18, s3: 23, s2: 33,
      hard: true, limit: 25, hidden: [0, 0, 0, 0, 2, 0, 0, 2],
      solution: '1>6 2>1 2>6 4>6 0>6 3>6 5>0 5>2 7>3 7>6 0>7 0>6 0>4 1>0 1>4 1>5 3>0 3>5'
    }
    /* SRC:END */
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
    const solution = parseMoves(s.solution);
    const par = s.par || solution.length;
    return {
      id: s.id, name: s.name, intent: s.intent || '', slots: s.slots, piece: s.piece || 'ring',
      orders: s.orders.trim().split(/\s+/),
      vials: s.vials.map(parseVial),
      solution,
      par,
      s3: s.s3 || par + Math.max(1, Math.ceil(par * 0.25)),
      s2: s.s2 || Math.ceil(par * 1.7) + 2,
      hard: !!s.hard,
      limit: s.limit || 0,
      lock: s.lock ? { vial: s.lock.vial, order: s.lock.order } : null,
      hidden: s.hidden ? s.hidden.slice() : null,
      urgent: s.urgent ? { order: s.urgent.order, moves: s.urgent.moves } : null,
      novelty: s.novelty || ''
    };
  }

  const LEVELS = SRC.map(parseLevel);

  const api = { GEMS, LEVELS, SRC, parseLevel, parseVial, formatVial, parseMoves };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkshopLevels = api;
})(typeof window !== 'undefined' ? window : globalThis);
