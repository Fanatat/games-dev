/* Контент «Дома картинок»: комнаты, предметы, головоломки, экономика, письма.
   Источник правды для правил и текстов. Проверка —
   `node tools/validate_content.js` (единственность и решаемость без угадывания).
   Позиции предметов в сцене — доли ширины/высоты квадратной сцены. */
window.HOP_CONTENT = {
  content_version: 3,

  room_order: ['r01', 'r02', 'r03'],

  rooms: {
    r01: {
      title: 'Прихожая',
      objects: ['r01_lamp', 'r01_shelf', 'r01_rug', 'r01_flower'],
      background: 'assets/art/bg_hallway.webp',
      next_room: 'r02',
      intro: 'В этом доме картинки помнят вещи. Разгадай картинку — и вещь вернётся.',
      intro_sign: 'Вера',
      final_text: 'Финик дома. На полке ждёт письмо.',
      invitation: {
        title: 'Приглашение к чаю',
        text: 'Спасибо за свет! Чайная — за зелёной дверью.',
        sign: 'Вера',
        button: 'Пойти к чаю'
      },
      // Раскладка сцены: x — центр, y — низ спрайта, w — ширина (доли сцены).
      layout: {
        r01_lamp: { x: 0.425, y: 0.438, w: 0.15 },
        r01_shelf: { x: 0.60, y: 0.335, w: 0.25 },
        r01_rug: { x: 0.50, y: 0.875, w: 0.50 },
        r01_flower: { x: 0.865, y: 0.478, w: 0.085 },
        letter: { x: 0.62, y: 0.262, w: 0.075, rot: -7 },
        cat: { x: 0.52, y: 0.835, w: 0.20 },
        bird: { x: 0.915, y: 0.385, w: 0.07 },
        sign: { x: 0.585, y: 0.405, w: 0.05 },
        light: { x: 0.425, y: 0.33, r: 0.42 },
        paws: [[0.40, 0.80], [0.36, 0.775], [0.32, 0.745], [0.285, 0.72], [0.245, 0.695], [0.21, 0.672]]
      },
      // Порядок слоёв: от дальнего к ближнему.
      z: ['r01_shelf', 'r01_lamp', 'r01_flower', 'r01_rug']
    },
    r02: {
      title: 'Чайная',
      requires: 'r01',
      objects: ['r02_tea_set', 'r02_table', 'r02_armchair', 'r02_clock', 'r02_window', 'r02_sideboard', 'r02_photo', 'r02_musicbox'],
      background: 'assets/art/bg_tearoom.webp',
      intro: 'Здесь пили чай всей семьёй. Начнём с чашки — остальное подскажет дом.',
      intro_sign: 'Вера',
      final_text: 'Чайная ожила!',
      next_room: 'r03',
      invitation: {
        title: 'Записка из оранжереи',
        text: 'Финик нашёл ключ от оранжереи. Поможешь?',
        sign: 'Вера',
        button: 'В оранжерею'
      },
      layout: {
        r02_window: { x: 0.68, y: 0.50, w: 0.34 },
        r02_clock: { x: 0.30, y: 0.40, w: 0.13 },
        r02_photo: { x: 0.45, y: 0.32, w: 0.11 },
        r02_sideboard: { x: 0.17, y: 0.80, w: 0.30 },
        r02_musicbox: { x: 0.17, y: 0.475, w: 0.11 },
        r02_armchair: { x: 0.80, y: 0.90, w: 0.32 },
        r02_table: { x: 0.50, y: 0.92, w: 0.34 },
        r02_tea_set: { x: 0.50, y: 0.73, w: 0.20 },
        cat: { x: 0.80, y: 0.76, w: 0.17 }
      },
      z: ['r02_window', 'r02_clock', 'r02_photo', 'r02_sideboard', 'r02_musicbox', 'r02_armchair', 'r02_table', 'r02_tea_set']
    },
    r03: {
      title: 'Оранжерея',
      requires: 'r02',
      objects: ['r03_seed_table', 'r03_watering_can', 'r03_hanging_pot', 'r03_birdhouse', 'r03_herbarium', 'r03_bench', 'r03_pond', 'r03_glass_door'],
      background: 'assets/art/bg_orangery.webp',
      intro: 'Здесь бабушка растила лимоны. Начнём со стола для рассады.',
      intro_sign: 'Вера',
      final_text: 'Сад открыт!',
      invitation: {
        title: 'Вечер фонариков',
        text: 'Оранжерея ожила! Новые комнаты скоро откроются.',
        sign: 'Вера',
        button: 'Хорошо'
      },
      next_visit_note: 'Новые комнаты скоро откроются. А пока каждый день приходит новое письмо.',
      layout: {
        r03_herbarium: { x: 0.215, y: 0.43, w: 0.115 },
        r03_glass_door: { x: 0.82, y: 0.59, w: 0.28 },
        r03_hanging_pot: { x: 0.36, y: 0.33, w: 0.15 },
        r03_seed_table: { x: 0.33, y: 0.68, w: 0.30 },
        r03_birdhouse: { x: 0.93, y: 0.76, w: 0.11 },
        r03_bench: { x: 0.64, y: 0.73, w: 0.30 },
        r03_watering_can: { x: 0.13, y: 0.88, w: 0.17 },
        r03_pond: { x: 0.52, y: 0.99, w: 0.38 },
        cat: { x: 0.62, y: 0.635, w: 0.15 },
        bird: { x: 0.785, y: 0.925, w: 0.075 }
      },
      z: ['r03_herbarium', 'r03_glass_door', 'r03_hanging_pot', 'r03_seed_table', 'r03_birdhouse', 'r03_bench', 'r03_watering_can', 'r03_pond']
    }
  },

  /* Оформления: A и B бесплатные. premium: true — только купленное:
     price_coins — за монеты, sku — в наборе за голоса, gift — подарок «7 встреч». */
  objects: {
    r01_lamp: {
      room: 'r01', title: 'Лампа', verb: 'Зажечь',
      puzzles: ['r01_lamp_01'], prerequisites: [],
      pitch: 'Вернуть в прихожую тёплый свет',
      done_text: 'Свет вернулся. На стене проступил знак птицы.',
      variants: [
        { id: 'r01_lamp_a', title: 'Медовый абажур', sprite: 'lamp_a' },
        { id: 'r01_lamp_b', title: 'Сливочный абажур', sprite: 'lamp_b' },
        { id: 'r01_lamp_c', title: 'Мозаичный абажур', sprite: 'lamp_c', premium: true, price_coins: 300 }
      ],
      tap_secret: 'Щёлк — и лампа снова светит.'
    },
    r01_shelf: {
      room: 'r01', title: 'Почтовая полка', verb: 'Починить',
      puzzles: ['r01_shelf_01'], prerequisites: ['r01_lamp'],
      pitch: 'Полка — и придёт почта',
      done_text: 'На полке — письмо с птичьей печатью.',
      variants: [
        { id: 'r01_shelf_a', title: 'Светлая берёза', sprite: 'shelf_a' },
        { id: 'r01_shelf_b', title: 'Тёмный орех', sprite: 'shelf_b' },
        { id: 'r01_shelf_c', title: 'Полка с открытками', sprite: 'shelf_c', premium: true, price_coins: 800 }
      ],
      tap_secret: 'На сургуче птица. Где-то она встречалась…'
    },
    r01_rug: {
      room: 'r01', title: 'Коврик', verb: 'Соткать',
      puzzles: ['r01_rug_01'], prerequisites: ['r01_lamp'],
      pitch: 'Коврик, которого кто-то ждёт',
      done_text: 'У двери — свежие кошачьи следы.',
      variants: [
        { id: 'r01_rug_a', title: 'Терракотовый', sprite: 'rug_a' },
        { id: 'r01_rug_b', title: 'Шалфейный', sprite: 'rug_b' },
        { id: 'r01_rug_c', title: 'Звёздный индиго', sprite: 'rug_c', premium: true, price_coins: 120 }
      ],
      tap_secret: 'Следы ведут к зелёной двери.'
    },
    r01_flower: {
      room: 'r01', title: 'Оконный цветок', verb: 'Посадить',
      puzzles: ['r01_flower_01'], prerequisites: ['r01_shelf', 'r01_rug'],
      pitch: 'Цветок — и кто-то прилетит',
      done_text: 'За окном села птица — как на печати!',
      variants: [
        { id: 'r01_flower_a', title: 'Белый цветок', sprite: 'flower_a' },
        { id: 'r01_flower_b', title: 'Жёлтый цветок', sprite: 'flower_b' },
        { id: 'r01_flower_c', title: 'Розовый пион', sprite: 'flower_c', premium: true, gift: 'stamps' }
      ],
      tap_secret: 'Птица наклоняет голову и тихо поёт.'
    },

    r02_tea_set: {
      room: 'r02', title: 'Чайный сервиз', verb: 'Собрать',
      life: { kind: 'steam', x: 0.06, y: 0.16 },
      puzzles: ['r02_tea_set_02', 'r02_tea_set_01'], unlock_after: 0,
      stage_sprites: ['tea_set_s2'],
      pitch: 'Чайник — и можно звать гостей',
      done_text: 'Чайник запыхтел паром. Пахнет мятой и малиной.',
      variants: [
        { id: 'r02_tea_set_a', title: 'Белый с кобальтом', sprite: 'tea_set_a' },
        { id: 'r02_tea_set_b', title: 'Шалфейный в горох', sprite: 'tea_set_b' },
        { id: 'r02_tea_set_c', title: 'Вечерний с золотом', sprite: 'tea_set_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Крышечка чайника тихонько звякнула.'
    },
    r02_table: {
      room: 'r02', title: 'Чайный столик', verb: 'Накрыть',
      puzzles: ['r02_table_03', 'r02_table_02'], unlock_after: 0,
      stage_sprites: ['table_s2'],
      pitch: 'Круглый столик для чая на двоих',
      done_text: 'Столик снова крепко стоит. Салфетка пахнет лавандой.',
      variants: [
        { id: 'r02_table_a', title: 'Кружевная салфетка', sprite: 'table_a' },
        { id: 'r02_table_b', title: 'Терракотовая клетка', sprite: 'table_b' },
        { id: 'r02_table_c', title: 'Вечерняя скатерть', sprite: 'table_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Под салфеткой — крошка печенья.'
    },
    r02_armchair: {
      room: 'r02', title: 'Кресло', verb: 'Обить',
      puzzles: ['r02_armchair_01', 'r02_armchair_03'], unlock_after: 0,
      stage_sprites: ['armchair_s2'],
      pitch: 'Кресло, где кто-то спит',
      done_text: 'Финик тут же занял кресло.',
      variants: [
        { id: 'r02_armchair_a', title: 'Шалфейный бархат', sprite: 'armchair_a' },
        { id: 'r02_armchair_b', title: 'Горчичный в цветах', sprite: 'armchair_b' },
        { id: 'r02_armchair_c', title: 'Полночный бархат', sprite: 'armchair_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Финик приоткрыл глаз и уснул.'
    },
    r02_clock: {
      room: 'r02', title: 'Часы', verb: 'Завести',
      life: { kind: 'glint', x: 0.59, y: 0.55 },
      puzzles: ['r02_clock_01', 'r02_clock_03'], unlock_after: 2,
      stage_sprites: ['clock_s2'],
      pitch: 'Часы стоят с прошлой зимы',
      done_text: 'Часы пробили пять — время чая.',
      variants: [
        { id: 'r02_clock_a', title: 'Ореховые', sprite: 'clock_a' },
        { id: 'r02_clock_b', title: 'Шалфейные', sprite: 'clock_b' },
        { id: 'r02_clock_c', title: 'Звёздные', sprite: 'clock_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Маятник качнулся — в доме эхо.'
    },
    r02_window: {
      room: 'r02', title: 'Окно в сад', verb: 'Украсить',
      puzzles: ['r02_window_01', 'r02_window_02'], unlock_after: 2,
      stage_sprites: ['window_s2'],
      pitch: 'Витраж, чтобы свет был мягче',
      done_text: 'На витраже — птица с печати.',
      variants: [
        { id: 'r02_window_a', title: 'Кремовые шторы', sprite: 'window_a' },
        { id: 'r02_window_b', title: 'Пыльная роза', sprite: 'window_b' },
        { id: 'r02_window_c', title: 'Полночные шторы', sprite: 'window_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'В саду мелькнул чей-то фонарик.'
    },
    r02_sideboard: {
      room: 'r02', title: 'Буфет', verb: 'Расставить',
      puzzles: ['r02_sideboard_02', 'r02_sideboard_03'], unlock_after: 4,
      stage_sprites: ['sideboard_s2'],
      pitch: 'Буфет для чашек и варенья',
      done_text: 'На полке — варенье «Для гостей».',
      variants: [
        { id: 'r02_sideboard_a', title: 'Медовый', sprite: 'sideboard_a' },
        { id: 'r02_sideboard_b', title: 'Голубой', sprite: 'sideboard_b' },
        { id: 'r02_sideboard_c', title: 'Вечерний с золотом', sprite: 'sideboard_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Дверца скрипнула: внутри стопка старых открыток.'
    },
    r02_photo: {
      room: 'r02', title: 'Фотография', verb: 'Повесить',
      puzzles: ['r02_photo_01', 'r02_photo_02'], unlock_after: 4,
      stage_sprites: ['photo_s2'],
      pitch: 'Каким был этот дом?',
      done_text: 'На снимке — дом, полный гостей.',
      variants: [
        { id: 'r02_photo_a', title: 'Золочёная рамка', sprite: 'photo_a' },
        { id: 'r02_photo_b', title: 'Ореховая рамка', sprite: 'photo_b' },
        { id: 'r02_photo_c', title: 'Вечерняя рамка', sprite: 'photo_c', premium: true, price_coins: 120 }
      ],
      tap_secret: 'Подпись: «Вечер фонариков. Все в сборе».'
    },
    r02_musicbox: {
      room: 'r02', title: 'Музыкальная шкатулка', verb: 'Починить',
      life: { kind: 'waltz', x: 0.62, y: 0.42 },
      puzzles: ['r02_musicbox_02', 'r02_musicbox_03'], unlock_after: 7,
      stage_sprites: ['musicbox_s2'],
      pitch: 'Какую песню помнит шкатулка?',
      done_text: 'Шкатулка заиграла вальс. Птичка на крышке закружилась.',
      variants: [
        { id: 'r02_musicbox_a', title: 'Палисандр', sprite: 'musicbox_a' },
        { id: 'r02_musicbox_b', title: 'Кремовая с золотом', sprite: 'musicbox_b' },
        { id: 'r02_musicbox_c', title: 'Полночная', sprite: 'musicbox_c', premium: true, price_coins: 300 }
      ],
      tap_secret: 'Шкатулка играет три ноты и ждёт.'
    },
    r03_seed_table: {
      room: 'r03', title: 'Стол для рассады', verb: 'Расставить',
      life: { kind: 'bloom' },
      puzzles: ['r03_seed_table_01', 'r03_seed_table_02', 'r03_seed_table_04'], unlock_after: 0,
      stage_sprites: ['seed_table_s1', 'seed_table_s2'],
      pitch: 'Разбудить спящие семена',
      done_text: 'Проклюнулись первые ростки. Пахнет землёй.',
      variants: [
        { id: 'r03_seed_table_a', title: 'Медовый', sprite: 'seed_table_a' },
        { id: 'r03_seed_table_b', title: 'Шалфейный', sprite: 'seed_table_b' },
        { id: 'r03_seed_table_c', title: 'Вечерний с огоньками', sprite: 'seed_table_c', premium: true, price_coins: 150 }
      ],
      tap_secret: 'Финик шуршит в мешке с семенами.'
    },
    r03_watering_can: {
      room: 'r03', title: 'Лейка', verb: 'Начистить',
      life: { kind: 'bloom' },
      puzzles: ['r03_watering_can_01', 'r03_watering_can_02', 'r03_watering_can_04'], unlock_after: 0,
      stage_sprites: ['watering_can_s1', 'watering_can_s2'],
      pitch: 'Будет чем поливать ростки',
      done_text: 'Лейка пустила струйку. Ростки повеселели.',
      variants: [
        { id: 'r03_watering_can_a', title: 'Медная', sprite: 'watering_can_a' },
        { id: 'r03_watering_can_b', title: 'С ромашками', sprite: 'watering_can_b' },
        { id: 'r03_watering_can_c', title: 'Звёздная', sprite: 'watering_can_c', premium: true, price_coins: 120 }
      ],
      tap_secret: 'Капля упала Финику на нос.'
    },
    r03_hanging_pot: {
      room: 'r03', title: 'Подвесное кашпо', verb: 'Повесить',
      life: { kind: 'bloom' },
      puzzles: ['r03_hanging_pot_01', 'r03_hanging_pot_03', 'r03_hanging_pot_04'], unlock_after: 0,
      stage_sprites: ['hanging_pot_s1', 'hanging_pot_s2'],
      pitch: 'Подвесить зелёный плющ',
      done_text: 'Плющ свесился зелёной косой. Кашпо тихо покачивается.',
      variants: [
        { id: 'r03_hanging_pot_a', title: 'Терракотовое', sprite: 'hanging_pot_a' },
        { id: 'r03_hanging_pot_b', title: 'Белое', sprite: 'hanging_pot_b' },
        { id: 'r03_hanging_pot_c', title: 'Синее с золотом', sprite: 'hanging_pot_c', premium: true, price_coins: 150 }
      ],
      tap_secret: 'Кашпо качнулось — с листьев осыпались капли.'
    },
    r03_birdhouse: {
      room: 'r03', title: 'Скворечник', verb: 'Собрать',
      life: { kind: 'bloom' },
      puzzles: ['r03_birdhouse_01', 'r03_birdhouse_02', 'r03_birdhouse_03'], unlock_after: 2,
      stage_sprites: ['birdhouse_s1', 'birdhouse_s2'],
      pitch: 'Домик — и прилетит жилец',
      done_text: 'В скворечник заглянула малиновка и решила остаться.',
      variants: [
        { id: 'r03_birdhouse_a', title: 'Рыжая крыша', sprite: 'birdhouse_a' },
        { id: 'r03_birdhouse_b', title: 'Голубой', sprite: 'birdhouse_b' },
        { id: 'r03_birdhouse_c', title: 'Звёздный с фонариком', sprite: 'birdhouse_c', premium: true, price_coins: 180 }
      ],
      tap_secret: 'Малиновка высунулась из окошка и свистнула.'
    },
    r03_herbarium: {
      room: 'r03', title: 'Гербарий', verb: 'Собрать',
      life: { kind: 'bloom' },
      puzzles: ['r03_herbarium_01', 'r03_herbarium_02', 'r03_herbarium_03'], unlock_after: 2,
      stage_sprites: ['herbarium_s1', 'herbarium_s2'],
      pitch: 'Память о лете под стеклом',
      done_text: 'Под стеклом — клён. Ярлык бабушкиной рукой.',
      variants: [
        { id: 'r03_herbarium_a', title: 'Дубовая рамка', sprite: 'herbarium_a' },
        { id: 'r03_herbarium_b', title: 'Шалфейная рамка', sprite: 'herbarium_b' },
        { id: 'r03_herbarium_c', title: 'Золочёная', sprite: 'herbarium_c', premium: true, price_coins: 150 }
      ],
      tap_secret: 'Ярлык: «К первому Вечеру фонариков».'
    },
    r03_bench: {
      room: 'r03', title: 'Скамейка', verb: 'Починить',
      life: { kind: 'bloom' },
      puzzles: ['r03_bench_01', 'r03_bench_02', 'r03_bench_03'], unlock_after: 4,
      stage_sprites: ['bench_s1', 'bench_s2'],
      pitch: 'Скамейка, чтобы присесть',
      done_text: 'Скамейка крепка. Финик уже на подушке.',
      variants: [
        { id: 'r03_bench_a', title: 'Терракотовая', sprite: 'bench_a' },
        { id: 'r03_bench_b', title: 'В полоску', sprite: 'bench_b' },
        { id: 'r03_bench_c', title: 'Полночная', sprite: 'bench_c', premium: true, price_coins: 200 }
      ],
      tap_secret: 'Финик перевернулся на другой бок.'
    },
    r03_pond: {
      room: 'r03', title: 'Пруд', verb: 'Расчистить',
      life: { kind: 'bloom' },
      puzzles: ['r03_pond_01', 'r03_pond_02', 'r03_pond_03'], unlock_after: 4,
      stage_sprites: ['pond_s1', 'pond_s2'],
      pitch: 'Пруд с кувшинкой оживёт',
      done_text: 'Вода стала прозрачной. На кувшинке сидит лягушка.',
      variants: [
        { id: 'r03_pond_a', title: 'Летний', sprite: 'pond_a' },
        { id: 'r03_pond_b', title: 'Солнечный', sprite: 'pond_b' },
        { id: 'r03_pond_c', title: 'С фонариками', sprite: 'pond_c', premium: true, price_coins: 250 }
      ],
      tap_secret: 'Лягушка квакнула и спряталась.'
    },
    r03_glass_door: {
      room: 'r03', title: 'Дверь в сад', verb: 'Открыть',
      life: { kind: 'bloom' },
      puzzles: ['r03_glass_door_01', 'r03_glass_door_02', 'r03_glass_door_03'], unlock_after: 6,
      stage_sprites: ['glass_door_s1', 'glass_door_s2'],
      pitch: 'Дверь в сад откроется',
      done_text: 'Дверь распахнулась — из сада тёплый ветер.',
      variants: [
        { id: 'r03_glass_door_a', title: 'Кремовая с розами', sprite: 'glass_door_a' },
        { id: 'r03_glass_door_b', title: 'Шалфейная с вьюнком', sprite: 'glass_door_b' },
        { id: 'r03_glass_door_c', title: 'Полночная с цветами', sprite: 'glass_door_c', premium: true, price_coins: 300 }
      ],
      tap_secret: 'За стеклом мелькнула птица с печати.'
    }
  },

  /* Экономика (ТЗ 03). Монеты — за игру, голоса ВК — только за наборы. */
  economy: {
    coins_per_puzzle: 20,
    // Монеты за поле по площади: до 25 клеток — 10, до 49 — 20, 10×10 — 40.
    coins_by_area: [[25, 10], [36, 15], [49, 20], [64, 25], [81, 30], [100, 40], [1e9, 60]],
    // Монетки в клетках поля: находятся, когда клетку закрасят.
    field_coins: { coins: 5, by_area: [[25, 0], [49, 1], [81, 2]], max: 3 },
    // Готовый предмет: бонус по числу его картинок (1 — 15, 3 — 50) и сундучок
    // (монеты 20–100, карандаш или редкое «Сияние»).
    object_bonus: [15, 30, 50, 60],
    chest: { rare: 0.15, rare_by: 2, rare_coins: 50, pencil: 0.25, pencil_coins: 10, coins_min: 20, coins_max: 100 },
    // Готовая комната: сверх room_reward — выбор из трёх (монеты, карандаши, вещь).
    room_choice: { coins: 150, pencils: 3 },
    // Бесплатные подсказки на поле, дальше — карандаш.
    free_hints: 3,
    coins_daily_first: 20,
    room_reward: { coins: 100, pencils: 1 },
    tutorial_pencils: 3,
    pencil_price: 100,
    rewarded: { coins: 40, pencils: 1, per_day: 3, after_room: 'r01' },
    // Подарок вернувшемуся растёт с паузой: день — монеты, три — монеты и
    // карандаши, неделя — вещь для дома (нет такой — монеты).
    comeback: { tiers: [
      { after_days: 1, coins: 30 },
      { after_days: 3, coins: 60, pencils: 2 },
      { after_days: 7, variant: true, coins: 150, pencils: 3 }
    ] },
    // Наборы за голоса — не раньше 10 минут игры и готовой прихожей.
    paid_after_s: 600,
    // Секрет готовой вещи (первое касание) и все секреты комнаты.
    secrets: { coins: 5, room_coins: 50 }
  },

  /* Наборы за голоса ВК. Цены — тестовые, подтверждает основатель. */
  skus: {
    starter_warm_home: {
      title: 'Тёплый дом', votes: 19, one_time: true, only_if_none_owned: true, icon: 'gift',
      text: 'Мозаичная лампа, звёздный коврик, вечерняя рамка и 3 карандаша',
      grants: { variants: ['r01_lamp_c', 'r01_rug_c', 'r02_photo_c'], pencils: 3 }
    },
    theme_tea_evening: {
      title: 'Вечер в чайной', votes: 35, one_time: true, icon: 'gift',
      text: 'Шесть вечерних вещей для чайной: сервиз, стол, кресло, часы, шторы, буфет',
      grants: { variants: ['r02_tea_set_c', 'r02_table_c', 'r02_armchair_c', 'r02_clock_c', 'r02_window_c', 'r02_sideboard_c'] }
    },
    pencils_10: {
      title: '10 карандашей', votes: 12, icon: 'pencil',
      text: 'Карандаш открывает целую строку или столбец',
      grants: { pencils: 10 }
    }
  },

  /* «7 встреч»: штамп за первую картинку дня, полная карточка — подарок. */
  stamps: {
    card_size: 7,
    // Подарки по дороге к полной карточке.
    steps: { 2: { coins: 50 }, 4: { pencils: 2 } },
    rewards: [{ variants: ['r01_flower_c'], pencils: 3 }]
  },

  /* «Вечер фонариков»: событие на days дней с готовой прихожей. В первый день
     открыто open_first фонариков, дальше по одному в день; все зажжённые — награда. */
  event: {
    id: 'lanterns', title: 'Вечер фонариков', after_room: 'r01', days: 7, open_first: 2,
    text: 'Зажгите пять фонарей — и вечер вернётся.',
    reward: { coins: 200, pencils: 2 },
    lanterns: [
      { id: "e_l1", title: "Медный фонарь", palette: { a: "#3b2c22", b: "#c8643c", c: "#f2c55a" },
        pic: ['...a...', '..aaa..', '.bbbbb.', 'bbcccbb', 'bbcccbb', 'bbbcbbb', '.bbbbb.', '..aaa..', '...a...'] },
      { id: "e_l2", title: "Свеча в банке", palette: { a: "#3b2c22", c: "#f2c55a" },
        pic: ['...a...', '..aaa..', '.aaaaa.', '.a.c.a.', '.acc.a.', '.accca.', '.a.c.a.', '.aaaaa.', '..a.a..'] },
      { id: "e_l3", title: "Фонарь-звезда", palette: { a: "#3b2c22", b: "#d9a441", c: "#fbe7a6" },
        pic: ['....a....', '....b....', '...bbb...', 'bbbbcbbbb', '.bbcccbb.', '..bbcbb..', '.bbb.bbb.', '.bb...bb.'] },
      { id: "e_l4", title: "Тыквенный фонарь", palette: { b: "#d07a3e", c: "#f7d36b", d: "#7d9466" },
        pic: ['....d....', '...dd....', '.bbbbbbb.', 'bbcbbbcbb', 'bbbbbbbbb', 'bbcbcbcbb', '.bbcccbb.', '..bbbbb..'] },
      { id: "e_l5", title: "Фонарик из ткани", palette: { a: "#3b2c22", b: "#7b4b5a", c: "#f2c55a" },
        pic: ['....a....', '...aaa...', '..bbbbb..', '.bbcbcbb.', 'bbbcccbbb', '.bbcbcbb.', '..bbbbb..', '...aaa...', '..a.a.a..'] }
    ]
  },

  /* «Письмо дня»: по письму в день от daily.start, нерешённое ждёт keep_days.
     pic: '.' — пусто, буква — цвет открытки из palette. */
  daily: {
    after_room: 'r01',
    keep_days: 14,
    letters: [
      {
        id: "d001", title: "Кленовый лист", from: "Вера",
        text: "Письма снова ходят. Первое — с клёна, что посадили до меня.",
        palette: { a: "#c8643c", b: "#d9a441", c: "#3b2c22" },
        pic: ['...a....', '.a.aa.a.', '.aaaaaa.', 'aaabaaaa', '.aabbaa.', '..abba..', '...c....', '..c.....']
      },
      {
        id: "d002", title: "Рыбка", from: "Финик",
        text: "Мрр. Рыбку не ел. Почти. Под крыльцом коробка, пахнет свечками.",
        palette: { a: "#5f7d8c", b: "#d9a441", c: "#3b2c22" },
        pic: ['........', '...bb...', '.aaaaa.b', 'aacaaaab', 'aaaaaaab', '.aaaaa.b', '...bb...', '........']
      },
      {
        id: "d003", title: "Жёлудь", from: "Нина",
        text: "Дуб сыплет жёлуди! Тут пекли ореховое печенье. Найду рецепт.",
        palette: { a: "#8a5a3b", b: "#c79a3a", c: "#3b2c22" },
        pic: ['...c....', '..aaaa..', '.aaaaaa.', 'aaaaaaaa', '.bbbbbb.', '.bbbbbb.', '..bbbb..', '...bb...']
      },
      {
        id: "d004", title: "Гриб у пня", from: "Почтальон Тимофей",
        text: "У пня нашёл письмо без адреса. Марка с фонариком.",
        palette: { a: "#c8643c", b: "#d9a441", c: "#b89870", d: "#7d9466" },
        pic: ['...aaaa...', '..abaaaa..', '.aaaabaaa.', 'aabaaaaaba', 'aaaaaaaaaa', '...cccc...', '...cccc...', '...cccc...', '..dccccd..', 'dddddddddd']
      },
      {
        id: "d005", title: "Ключ от сада", from: "Птица с печатью",
        text: "Сад помнит свет. Ключ — под третьим камнем дорожки.",
        palette: { a: "#c79a3a", b: "#3b2c22", c: "#7d9466" },
        pic: ['.cc.cc......', '..ccc.......', '.aaaaa......', 'aab.baaaaaaa', 'aa...aaaaaaa', 'aab.ba...aaa', '.aaaaa...a.a', '..aaa.......']
      },
      {
        id: "d006", title: "Тыква", from: "Нина",
        text: "Пирог с тыквой удался! Из тыкв тут резали фонари.",
        palette: { a: "#d07a3e", b: "#a8452e", c: "#3b2c22", d: "#7d9466" },
        pic: ['....cd....', '....c.dd..', '.aabaabaa.', 'aaabaabaaa', 'aaabaabaaa', 'aaabaabaaa', 'aaabaabaaa', '.aabaabaa.', '..aaaaaa..']
      },
      {
        id: "d007", title: "Клубок ниток", from: "Вера",
        text: "В шкафу — недовязанная варежка. Довяжу: вдруг хозяйка заглянет.",
        palette: { a: "#c27a6e", b: "#7b4b5a", c: "#3b2c22" },
        pic: ['...aaaa...', '.aabbaaaa.', '.abaabbaa.', 'aabaaaabba', 'abaabbaaab', 'aabbaaabaa', '.aaabbbaa.', '.abaaaaaa.', '...aaaa..c', '.........c']
      },
      {
        id: "d008", title: "Зонтик", from: "Почтальон Тимофей",
        text: "На почте помнят: раз в год тут светились все окна.",
        palette: { a: "#c8643c", b: "#d9a441", c: "#3b2c22" },
        pic: ['....cc....', '..aabbaa..', '.aaabbaaa.', 'aaaabbaaaa', 'aaaabbaaaa', 'a.a.cc.a.a', '....c.....', '....c.....', '....c..c..', '.....cc...']
      },
      {
        id: "d009", title: "Ягоды рябины", from: "Нина",
        text: "Сварю рябиновое варенье. Гроздья вешали у фонарей — для тепла.",
        palette: { a: "#a8452e", b: "#7d9466", c: "#3b2c22" },
        pic: ['..bb..bb..', '.bbbccbbb.', '...c..c...', '..c....c..', '.aa.aa.aa.', 'aaaaaaaaaa', '.aa.aa.aa.', '..aa..aa..', '.aaaaaaaa.', '..aa..aa..']
      },
      {
        id: "d010", title: "Финик спит", from: "Финик",
        text: "Сплю. Не будить. Снились огоньки в саду. Сарай пахнет свечками.",
        palette: { a: "#c98a4b", b: "#a8452e", c: "#3b2c22", d: "#7d9466" },
        pic: ['............', '.a.a........', '.aaa...aaa..', '.cac.aaaaaa.', '.aaaaabaabaa', '.aaaaabaabaa', '..aaaaaaaaa.', 'babaaaaa....', 'dddddddddddd']
      },
      {
        id: "d011", title: "Сова", from: "Птица с печатью",
        text: "Сова видела их всех. Спросите у сарая.",
        palette: { a: "#8a5a3b", b: "#d9a441", c: "#3b2c22", d: "#c8643c", e: "#c79a6a" },
        pic: ['a........a', 'aa......aa', '.aaaaaaaa.', 'abbaaaabba', 'abcbaabcba', 'abbaddabba', 'aaaaddaaaa', 'aaeeeeeeaa', '.aeeeeeea.', '..aaaaaa..', '...d..d...']
      },
      {
        id: "d012", title: "Свеча", from: "Вера",
        text: "Ключ подошёл к сараю! Там фонари и список гостей.",
        palette: { a: "#d9a441", b: "#c8643c", c: "#3b2c22", d: "#9aa77c", e: "#8a5a3b" },
        pic: ['...a....', '..aba...', '..aba...', '...c....', '.dddddd.', '.dddddd.', '.dddddd.', '.dddddd.', '.dddddd.', 'eeeeeeee', '.eeeeee.']
      },
      {
        id: "d013", title: "Птичий домик", from: "Почтальон Тимофей",
        text: "На крыше — сургуч с птицей. Кто-то бережёт этот дом.",
        palette: { a: "#c8643c", b: "#7d9466", c: "#3b2c22", d: "#8a5a3b" },
        pic: ['....aa....', '...aaaa...', '..aaaaaa..', '.aaaaaaaa.', 'aaaaaaaaaa', '.bbbbbbbb.', '.bbbccbbb.', '.bbbccbbb.', '.ddbbbbbb.', '.bbbbbbbb.', '....dd....', '....dd....']
      },
      {
        id: "d014", title: "Фонарик", from: "Вера",
        text: "Зажгла первый фонарь — сад как в рассказах. Устроим вечер снова?",
        palette: { a: "#3b2c22", b: "#d9a441", c: "#c8643c" },
        pic: ['....aa....', '...a..a...', '..aaaaaa..', '.acbbbbca.', '.abbbbbba.', '.abbbbbba.', '.abbbbbba.', '.acbbbbca.', '..aaaaaa..', '....aa....']
      },
      {
        id: "d015", title: "Тыквенный пирог", from: "Нина",
        text: "Пирог по старому рецепту готов. Половину гостей из списка знаю!",
        palette: { a: "#c98a4b", b: "#c8643c", c: "#8a5a3b", d: "#e8d9b0" },
        pic: ['...d..d...', '....d..d..', '...d..d...', '.aaaaaaaa.', 'abbabbabba', 'aaaaaaaaaa', 'bbbbbbbbbb', '.aaaaaaaa.', 'cccccccccc', '.cccccccc.']
      },
      {
        id: "d016", title: "Корзинка", from: "Финик",
        text: "Мрр. Нашёл корзинку с фонарями. Лёг сверху. Это помощь.",
        palette: { a: "#8a5a3b", b: "#c79a3a", c: "#c98a4b", d: "#3b2c22" },
        pic: ['...aaaa...', '..a....a..', '.a.c..c.a.', '.a.cccc.a.', '.acdccdca.', 'aaaaaaaaaa', 'bababababa', 'ababababab', '.babababa.', '..aaaaaa..']
      },
      {
        id: "d017", title: "Почтовая сумка", from: "Почтальон Тимофей",
        text: "Первый адрес — аптека на Липовой. Аптекарь Лев всё помнит.",
        palette: { a: "#3b2c22", b: "#a8452e", c: "#d9a441", d: "#8a5a3b", e: "#e8d9b0" },
        pic: ['..aaaaaa..', '.a......a.', '.a.eeee.a.', 'bbbbbbbbbb', 'bbbbbbbbbb', '.bbbccbbb.', 'dddddddddd', 'dddddddddd', 'dddddddddd', '.dddddddd.']
      },
      {
        id: "d018", title: "Ступка", from: "Аптекарь Лев",
        text: "Мальчишкой я толок тут лаванду для свечей. Сделаю снова.",
        palette: { a: "#8a5a3b", b: "#5f7d8c", c: "#3b2c22", d: "#7d9466" },
        pic: ['.......aa.', '......aa..', '.....aa...', 'dd..aa.dd.', 'bbbbbbbbbb', 'bbbbbbbbbb', '.bbbbbbbb.', '..bbbbbb..', '...bbbb...', '..cccccc..']
      },
      {
        id: "d019", title: "Перо", from: "Птица с печатью",
        text: "Перо моё. Но первое письмо писала рука, сажавшая клён.",
        palette: { a: "#5f7d8c", b: "#e8d9b0" },
        pic: ['.......aaa', '.....aaaab', '....aaaaba', '...aaaabaa', '..aa.aba..', '..aaaba...', '.aaaba....', '.aaba.....', '.bb.......', 'b.........']
      },
      {
        id: "d020", title: "Лейка", from: "Вера",
        text: "Посеяла астры к вечеру фонарей. Финик проверяет каждую лунку.",
        palette: { a: "#7d9466", b: "#5f7d8c" },
        pic: ['...aaa....', '..a...a...', '..a...a..b', 'aaaaaaa.b.', 'aaaaaaabb.', 'aaaaaaab..', 'aaaaaaa..b', 'aaaaaaa...', '.aaaaa...b']
      },
      {
        id: "d021", title: "Варежка", from: "Внучка Соня",
        text: "Я Соня, внучка Анны. Бабушка узнала свою варежку из шкафа!",
        palette: { a: "#c27a6e", b: "#e8d9b0", c: "#a8452e" },
        pic: ['..aaaa....', '.aaaaaa...', '.abbabba..', '.aaaaaa.aa', '.aaaaaaaaa', '.abbabbaa.', '.aaaaaaa..', '..cccccc..', '..cbcbcb..', '..cccccc..']
      },
      {
        id: "d022", title: "Ёжик", from: "Финик",
        text: "Мрр. Под яблоней живёт ёжик. Фыркает. Теперь друзья.",
        palette: { a: "#8a5a3b", b: "#c98a4b", c: "#3b2c22", d: "#a8452e" },
        pic: ['..a.a.a.a..', '..aaaaaaa..', '.aaaddaaa..', 'aaaaddaaab.', 'aaaaaaaabcb', 'aaaaaaabbbb', 'aaaaaaabbbc', '.aaaaaabbb.', '..bb...bb..']
      },
      {
        id: "d023", title: "Почтовый ящик", from: "Почтальон Тимофей",
        text: "Разнёс письма по списку. Мельник Коля помнит ваш вечер.",
        palette: { a: "#5f7d8c", b: "#8a5a3b", c: "#d9a441", d: "#e8d9b0" },
        pic: ['..aaaaaa..', '.aaaaaaaa.', 'aaaaaaaaaa', 'a.dddddd.a', 'aaaaaaaaaa', 'aaaacaaaaa', 'aaaaaaaaaa', '....bb....', '....bb....', '..bbbbbb..']
      },
      {
        id: "d024", title: "Колосок", from: "Дядя Коля",
        text: "Отец возил на ваш вечер муку. Привезу и я.",
        palette: { a: "#c79a3a", b: "#9aa77c" },
        pic: ['....a....', '..a.a.a..', '.aa.a.aa.', '..aaaaa..', '.aa.a.aa.', '..aaaaa..', '.aa.a.aa.', '..aaaaa..', '....b....', '....b.bb.', '....bbb..', '....b....']
      },
      {
        id: "d025", title: "Кружка какао", from: "Нина",
        text: "Какао, мёд, корица, зефир — так грелись на вечере фонарей.",
        palette: { a: "#c8643c", b: "#8a5a3b", c: "#e8d9b0", d: "#d9a441" },
        pic: ['...c...c....', '....c...c...', '...c...c....', '.aaaaaaaa...', '.abbcbbba...', '.aaaaaaaaaa.', '.aaaaaaaa..a', '.aadadaaa..a', '.aaaaaaaa.a.', '.aaaaaaaaa..', '..aaaaaa....', 'bbbbbbbbbbbb']
      },
      {
        id: "d026", title: "Песочные часы", from: "Птица с печатью",
        text: "Кто написал первым, ждал дольше всех. Песок почти пересыпался.",
        palette: { a: "#8a5a3b", b: "#5f7d8c", c: "#d9a441" },
        pic: ['aaaaaaaaaa', '.b......b.', '.bccccccb.', '..bccccb..', '...bccb...', '....bb....', '...bccb...', '..b.cc.b..', '.b.cccc.b.', '.bccccccb.', 'aaaaaaaaaa']
      },
      {
        id: "d027", title: "Росток", from: "Вера",
        text: "Взошли астры! Соня принесла бабушкины семена бархатцев.",
        palette: { a: "#7d9466", b: "#a8452e", c: "#c8643c" },
        pic: ['.aaa...aa.', 'aaaaa.aaaa', '.aaaa.aaa.', '....aa....', '....a.....', 'bbbbbbbbbb', 'bbbbbbbbbb', '.cccccccc.', '.cccccccc.', '..cccccc..', '..cccccc..']
      },
      {
        id: "d028", title: "Фонарь с ручкой", from: "Почтальон Тимофей",
        text: "Нашёл в сарае фонарь с буквами «М.Т.». Это мамин.",
        palette: { a: "#3b2c22", b: "#d9a441", c: "#c8643c", d: "#e8d9b0" },
        pic: ['....aaa....', '...a...a...', '...a...a...', '..aaaaaaa..', '.aaaaaaaaa.', '.a.bbbbb.a.', '.a.bbcbb.a.', '.a.bcccb.a.', '.a.bbdbb.a.', '.a.bbdbb.a.', '.aaaaaaaaa.', '..aaaaaaa..']
      },
      {
        id: "d029", title: "Мышка", from: "Финик",
        text: "Поймал тряпичную мышку. Отобрали. Она на шкафу. Поймаю шкаф.",
        palette: { a: "#9a8f86", b: "#c27a6e", c: "#3b2c22", e: "#c27a6e" },
        pic: ['..bb........', '.bbbb.......', '.bbbbaaaa...', '..aaaaaaaa..', '.acaaaaaaaa.', 'baaaaaaaaaa.', '.aaaaaaaaaaa', '..aaaaaaaa.e', '..........e.', '......eeee..']
      },
      {
        id: "d030", title: "Свеча в банке", from: "Аптекарь Лев",
        text: "Свечи готовы. В банках их ветер не задует.",
        palette: { a: "#c8643c", b: "#d9a441", c: "#8a5a3b", d: "#5f7d8c", e: "#e8d9b0", f: "#3b2c22" },
        pic: ['.cccccccc.', 'd........d', 'd...aa...d', 'd..abba..d', 'd...ba...d', 'd...f....d', 'd..eeee..d', 'd..eeee..d', 'd..eeee..d', 'd..eeee..d', 'dddddddddd', '.dddddddd.']
      },
      {
        id: "d031", title: "Яблоко", from: "Нина",
        text: "Лев и Коля сорок лет спорили. Вчера смеялись вместе.",
        palette: { a: "#a8452e", b: "#7d9466", c: "#3b2c22", d: "#c27a6e" },
        pic: ['......c....', '.....c.bb..', '.....cbbb..', '..aaa.aaa..', '.aaaaaaaaa.', 'aadaaaaaaaa', 'adaaaaaaaaa', 'aaaaaaaaaaa', 'aaaaaaaaaaa', '.aaaaaaaaa.', '..aaa.aaa..']
      },
      {
        id: "d032", title: "Месяц", from: "Птица с печатью",
        text: "Спросите клён у калитки, чью руку он помнит.",
        palette: { a: "#d9a441", b: "#e8d9b0" },
        pic: ['...aaaa....', '.aaaa......', '.aaa.......', 'aaa......b.', 'aaa.....bbb', 'aaa......b.', 'aaa........', '.aaa.......', '.aaaaa.....', '..aaaaaaaa.', '....aaaaa..']
      },
      {
        id: "d033", title: "Шарф", from: "Внучка Соня",
        text: "Варежку довязали! Вяжем шарф Финику — он утащил клубок.",
        palette: { a: "#a8452e", b: "#d9a441", c: "#e8d9b0" },
        pic: ['..aaaaaaaa..', '.aa......aa.', '.aa......aa.', '..aaaaaaaa..', '...bbb.bbb..', '...aaa.aaa..', '...bbb..bbb.', '...aaa..aaa.', '...bbb...bbb', '...aaa...aaa', '...c.c...c.c', '...c.c...c.c']
      },
      {
        id: "d034", title: "Марка с фонариком", from: "Почтальон Тимофей",
        text: "Почти все гости нашлись — сами или во внуках.",
        palette: { a: "#5f7d8c", c: "#3b2c22", d: "#d9a441", e: "#c8643c" },
        pic: ['a.a.a.a.a.a', '.aaaaaaaaa.', 'aa.......aa', '.a...c...a.', 'aa..ccc..aa', '.a.cdddc.a.', 'aa.cdedc.aa', '.a.cdddc.a.', 'aa..ccc..aa', '.a.......a.', 'aaaaaaaaaaa', 'a.a.a.a.a.a']
      },
      {
        id: "d035", title: "Астра", from: "Вера",
        text: "В списке приписка дедушки: «Место тому, кто вернёт свет».",
        palette: { a: "#c27a6e", b: "#d9a441", c: "#7d9466", d: "#9aa77c" },
        pic: ['.....a......', '..a..aa..a..', '...aaaaaaa..', '.aaaabbbaaa.', '..aabbbbbaa.', 'aaaabbbbbaaa', '..aabbbbbaa.', '.aaaabbbaaa.', '...aaaaaa...', '..a..cc.a...', '...dd.c.....', '.....dc.....']
      },
      {
        id: "d036", title: "Тачка", from: "Дядя Коля",
        text: "Везу тыквы для фонарей. Научу вырезать — глаза пошире!",
        palette: { a: "#8a5a3b", b: "#c8643c", c: "#7d9466", d: "#3b2c22", e: "#c79a3a" },
        pic: ['...c.....c...', '..bbb...bbb..', '.bbbbbbbbbbb.', 'aaaaaaaaaaaaa', '.aaaaaaaaaaa.', '..aaaaaaaaaaa', '..ddd....a...', '.dd.dd...a...', '.d.e.d...a...', '.dd.dd.......', '..ddd........']
      },
      {
        id: "d037", title: "Полосатый носок", from: "Финик",
        text: "Мрр. Носок Сони теперь мой. Сплю в нём. Я занят.",
        palette: { a: "#a8452e", b: "#e8d9b0", c: "#5f7d8c" },
        pic: ['.aaaaa....', '.bbbbb....', '.aaaaa....', '.bbbbb....', '.aaaaa....', '.bbbbb....', '.aaaaaa...', '.bbbbbbbb.', 'caaaaaaaaa', 'ccbbbbbbbc', '.cccccccc.']
      },
      {
        id: "d038", title: "Пряничный человечек", from: "Нина",
        text: "Пеку пряничных человечков на всех. Финик уже унёс одного.",
        palette: { a: "#c98a4b", b: "#e8d9b0", c: "#a8452e" },
        pic: ['....aaa....', '...aaaaa...', '...a.a.a...', '...abbba...', '....aaa....', '.aaaaaaaaa.', 'aaaaacaaaaa', '...aaaaa...', '...aacaa...', '...aa.aa...', '..aaa.aaa..', '..aa...aa..']
      },
      {
        id: "d039", title: "Колокольчик", from: "Птица с печатью",
        text: "Когда в сарае звякнет колокольчик, откройте третий ящик.",
        palette: { a: "#c79a3a", b: "#a8452e", c: "#3b2c22", d: "#8a5a3b" },
        pic: ['..bbb.bbb..', '....bbb....', '....aaa....', '...aaaaa...', '...aaaaa...', '..aaaaaaa..', '..aacaaaa..', '..aaaaaaa..', '.aaaaaaaaa.', 'aaaaaaaaaaa', '.....d.....', '....ddd....']
      },
      {
        id: "d040", title: "Горшочек мёда", from: "Аптекарь Лев",
        text: "Для гостей заварю чай с липой и мёдом.",
        palette: { a: "#c98a4b", b: "#d9a441", c: "#e8d9b0", d: "#a8452e" },
        pic: ['...cc..cc...', '..cccccccc..', '...dddddd...', '...aaaaaa...', '..aaaaaaaa..', '.aaaaaaaaaa.', 'aaabbbbbbaaa', 'aaab.bb.baaa', 'aaabbbbbbaaa', '.aaaaaaaaaa.', '..aaaaaaaa..', '...aaaaaa...']
      },
      {
        id: "d041", title: "Валенок", from: "Внучка Соня",
        text: "Бабушка сказала: «Поеду»! Двадцать лет никуда не ездила.",
        palette: { a: "#5f6b73", b: "#a8452e", c: "#e8d9b0" },
        pic: ['.aaaaaa....', '.aaaaaa....', '.abcbca....', '.aaaaaa....', '.aaaaaa....', '.aaaaaa....', '.aaaaaa....', '.aaaaaaa...', '.aaaaaaaaa.', 'aaaaaaaaaaa', 'aaaaaaaaaaa', '.aaaaaaaaa.']
      },
      {
        id: "d042", title: "Письмо с сургучом", from: "Почтальон Тимофей",
        text: "В архиве — конверт с птицей: «Открыть в вечер фонарей».",
        palette: { a: "#e8d9b0", b: "#c8a878", c: "#a8452e", d: "#3b2c22" },
        pic: ['aaaaaaaaaaaaaa', '.aaaaaaaaaaaa.', 'a.aaaaaaaaaa.a', 'aa.aaaaaaaa.aa', 'aaa.aaaaaa.aaa', 'aaaa.cccc.aaaa', 'aaaaccdcccaaaa', 'aaaaccccccaaaa', 'aaaaaccccaaaaa', 'bbbbbbbbbbbbbb']
      },
      {
        id: "d043", title: "Лапка", from: "Финик",
        text: "Мрр. На крыльце иней и мои следы. Птица смотрела.",
        palette: { a: "#c98a4b", b: "#c27a6e" },
        pic: ['...aa..aa...', '..aaa..aaa..', '..aaa..aaa..', 'aa........aa', 'aaa......aaa', 'aaa..aa..aaa', '.a..bbbb..a.', '...bbbbbb...', '..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '..bbb..bbb..']
      },
      {
        id: "d044", title: "Гирлянда фонариков", from: "Вера",
        text: "Вечер фонарей — в первую субботу заморозков. Приходите и вы!",
        palette: { a: "#3b2c22", b: "#8a5a3b", c: "#c8643c", d: "#d9a441" },
        pic: ['aaa........aaa', '..aaa....aaa..', '..b.aaaaaa.b..', '.bbb..b...bbb.', '.cdc.bbb..cdc.', '.cdc.cdc..cdc.', '.bbb.cdc..bbb.', '..b..cdc...b..', '.....bbb......', '......b.......']
      }
    ]
  },

  // Матрицы: '#' — закрашено. Подсказки считаются из решения.
  puzzles: {
    r01_lamp_01: {
      object: 'r01_lamp', stage: 1, title: 'Лампа с широким абажуром', difficulty: 'tutorial',
      rows: ['.###.', '#####', '#####', '..#..', '.###.']
    },
    r01_shelf_01: {
      object: 'r01_shelf', stage: 1, title: 'Конверт на почтовой полке', difficulty: 'easy',
      rows: ['#####', '##.##', '#.#.#', '#...#', '#####']
    },
    r01_rug_01: {
      object: 'r01_rug', stage: 1, title: 'Коврик с ромбом', difficulty: 'easy',
      rows: ['#######', '#..#..#', '#.###.#', '###.###', '#.###.#', '#..#..#', '#######']
    },
    r01_flower_01: {
      object: 'r01_flower', stage: 1, title: 'Цветок в горшке', difficulty: 'normal',
      rows: ['..###..', '.##.##.', '..###..', '...#...', '##.#.##', '.#####.', '..###..']
    },
    r02_tea_set_01: {
      object: 'r02_tea_set', stage: 2, title: "Чашка", difficulty: 'normal',
      rows: ['.#.#..', '#.#...', '######', '####.#', '######', '.###..']
    },
    r02_tea_set_02: {
      object: 'r02_tea_set', stage: 1, title: "Блюдце", difficulty: 'normal',
      rows: ['.###.', '##.##', '#.#.#', '##.##', '.###.']
    },
    r02_table_02: {
      object: 'r02_table', stage: 2, title: "Столешница", difficulty: 'normal',
      rows: ['.#####.', '#######', '.#...#.', '.#...#.', '.#...#.', '.#...#.', '##...##']
    },
    r02_table_03: {
      object: 'r02_table', stage: 1, title: "Салфетка", difficulty: 'normal',
      rows: ['#.#.#', '.###.', '##.##', '.###.', '#.#.#']
    },
    r02_armchair_01: {
      object: 'r02_armchair', stage: 1, title: "Ножки", difficulty: 'normal',
      rows: ['#####', '#####', '.#.#.', '#...#', '#...#']
    },
    r02_armchair_03: {
      object: 'r02_armchair', stage: 2, title: "Подушка", difficulty: 'normal',
      rows: ['#.....#', '#######', '.##.##.', '#######', '#.....#']
    },
    r02_clock_01: {
      object: 'r02_clock', stage: 1, title: "Маятник", difficulty: 'normal',
      rows: ['#######', '#..#..#', '#..#..#', '#..#..#', '#.###.#', '#.###.#', '#######']
    },
    r02_clock_03: {
      object: 'r02_clock', stage: 2, title: "Ключик", difficulty: 'normal',
      rows: ['.#####.', '##...##', '##...##', '##...##', '.#####.', '...#...', '...####', '...#...', '...####']
    },
    r02_window_01: {
      object: 'r02_window', stage: 1, title: "Занавеска", difficulty: 'easy',
      rows: ['#######', '##.#.##', '#.....#', '#.....#', '##...##', '##...##', '###.###']
    },
    r02_window_02: {
      object: 'r02_window', stage: 2, title: "Подвязка", difficulty: 'easy',
      rows: ['.######.', '..####..', '##.##.##', '#.####.#', '##.##.##', '..#..#..', '.##..##.', '########']
    },
    r02_sideboard_02: {
      object: 'r02_sideboard', stage: 1, title: "Ручка", difficulty: 'normal',
      rows: ['...##...', '..####..', '...##...', '.######.', '##....##', '#......#', '##....##', '.######.']
    },
    r02_sideboard_03: {
      object: 'r02_sideboard', stage: 2, title: "Банка варенья", difficulty: 'normal',
      rows: ['..######..', '.########.', '###.##.###', '..######..', '.########.', '##......##', '##.####.##', '##..##..##', '##......##', '.########.']
    },
    r02_photo_01: {
      object: 'r02_photo', stage: 1, title: "Уголок рамки", difficulty: 'easy',
      rows: ['########', '########', '##......', '##.###..', '##.#.#..', '##.##...', '##......', '##......']
    },
    r02_photo_02: {
      object: 'r02_photo', stage: 2, title: "Домик", difficulty: 'easy',
      rows: ['....##.##.', '...######.', '..######..', '.########.', '##########', '.#......#.', '.#.##.#.#.', '.#.##.#.#.', '.#....#.#.', '##########']
    },
    r02_musicbox_02: {
      object: 'r02_musicbox', stage: 1, title: "Гребёнка", difficulty: 'normal',
      rows: ['##########', '#.######.#', '##########', '#.#.#.#.#.', '#.#.#.#.#.', '#.#.#.#...', '#.#.#.#...', '#.#.#.....', '#.#.......', '#.........']
    },
    r02_musicbox_03: {
      object: 'r02_musicbox', stage: 2, title: "Птичка", difficulty: 'normal',
      rows: ['.....###..', '.....####.', '.....##.##', '#.#.####..', '#.######..', '.#######..', '.######...', '..####....', '..#.#.....', '##########']
    },
    r03_seed_table_01: {
      object: 'r03_seed_table', stage: 1, title: "Стол", difficulty: 'normal',
      rows: ['##########', '##########', '.#......#.', '.#......#.', '.#......#.', '.########.', '.########.', '.#......#.', '.#......#.', '##......##']
    },
    r03_seed_table_02: {
      object: 'r03_seed_table', stage: 2, title: "Ящик с землёй", difficulty: 'normal',
      rows: ['.##.###.##', '##########', '##.###.###', '##########', '#........#', '#..####..#', '#........#', '##########']
    },
    r03_seed_table_04: {
      object: 'r03_seed_table', stage: 3, title: "Росток", difficulty: 'normal',
      rows: ['###....##', '####..###', '####.####', '..##.##..', '...###...', '....#....', '....#....', '....#....', '.#######.', '#########']
    },
    r03_watering_can_01: {
      object: 'r03_watering_can', stage: 1, title: "Корпус лейки", difficulty: 'normal',
      rows: ['..######..', '.##....##.', '.########.', '.########.', '.#......#.', '.########.', '.########.', '.########.', '##########']
    },
    r03_watering_can_02: {
      object: 'r03_watering_can', stage: 2, title: "Ручка", difficulty: 'normal',
      rows: ['...####...', '..##..##..', '.##....##.', '.#......#.', '##########', '##########', '#........#', '##########', '##########', '.########.']
    },
    r03_watering_can_04: {
      object: 'r03_watering_can', stage: 3, title: "Капля", difficulty: 'normal',
      rows: ['...##...', '...##...', '..####..', '..####..', '.######.', '.######.', '########', '###.####', '.##.###.', '..####..']
    },
    r03_hanging_pot_01: {
      object: 'r03_hanging_pot', stage: 1, title: "Крючок с кольцом", difficulty: 'normal',
      rows: ['..####..', '..#..##.', '......#.', '.....##.', '....##..', '.######.', '.##..##.', '.#....#.', '.##..##.', '..####..']
    },
    r03_hanging_pot_03: {
      object: 'r03_hanging_pot', stage: 2, title: "Глиняный горшок", difficulty: 'normal',
      rows: ['.########.', '##########', '.########.', '.##....##.', '##......##', '##......##', '.##....##.', '..######..', '..######..']
    },
    r03_hanging_pot_04: {
      object: 'r03_hanging_pot', stage: 3, title: "Лист плюща", difficulty: 'normal',
      rows: ['....#....', '...###...', '...###...', '.#.###.#.', '.#######.', '########.', '#########', '.###.###.', '...###...', '....#....']
    },
    r03_birdhouse_01: {
      object: 'r03_birdhouse', stage: 1, title: "Столбик", difficulty: 'normal',
      rows: ['########', '.######.', '..####..', '..####..', '..####..', '..####..', '..####..', '.######.', '###..###', '##....##']
    },
    r03_birdhouse_02: {
      object: 'r03_birdhouse', stage: 2, title: "Крыша", difficulty: 'normal',
      rows: ['....##....', '...####...', '..##..##..', '.########.', '##########', '##########', '#........#', '#........#']
    },
    r03_birdhouse_03: {
      object: 'r03_birdhouse', stage: 3, title: "Леток с жёрдочкой", difficulty: 'normal',
      rows: ['....#....', '...###...', '..#####..', '.#######.', '#########', '..#...#..', '..#...#..', '..#####..', '#######..', '..##.##..']
    },
    r03_bench_01: {
      object: 'r03_bench', stage: 1, title: "Чугунная ножка", difficulty: 'normal',
      rows: ['##########', '##########', '.##....##.', '.##....##.', '..##..##..', '..##..##..', '.##....##.', '.##....##.', '##......##', '#........#']
    },
    r03_bench_02: {
      object: 'r03_bench', stage: 2, title: "Сиденье", difficulty: 'normal',
      rows: ['##########', '##########', '#........#', '##########', '#.######.#', '##########', '.#......#.', '.##....##.']
    },
    r03_bench_03: {
      object: 'r03_bench', stage: 3, title: "Спинка", difficulty: 'normal',
      rows: ['...####...', '.########.', '##......##', '##.#..#.##', '####..####', '####..####', '##......##', '##########']
    },
    r03_herbarium_01: {
      object: 'r03_herbarium', stage: 1, title: "Рамка", difficulty: 'normal',
      rows: ['##########', '#.##..##.#', '##......##', '#..####..#', '#..#..#..#', '#..#..#..#', '#..####..#', '##......##', '#.##..##.#', '##########']
    },
    r03_herbarium_02: {
      object: 'r03_herbarium', stage: 2, title: "Кленовый лист", difficulty: 'normal',
      rows: ['....#....', '...###...', '.#.###.#.', '.#######.', '#########', '.#######.', '..#####..', '.###.###.', '....#....', '....#....']
    },
    r03_herbarium_03: {
      object: 'r03_herbarium', stage: 3, title: "Папоротник", difficulty: 'normal',
      rows: ['....#....', '...###...', '...#.#...', '..##.##..', '..##.##..', '..##.##..', '.###.###.', '####.####', '.###.###.', '....#....']
    },
    r03_pond_01: {
      object: 'r03_pond', stage: 1, title: "Камни у воды", difficulty: 'normal',
      rows: ['.##....###', '####..####', '####.#####', '.##..####.', '..........', '##########', '#..####..#', '##########', '###..###..', '##########']
    },
    r03_pond_02: {
      object: 'r03_pond', stage: 2, title: "Кувшинка", difficulty: 'normal',
      rows: ['....##....', '....##....', '..######..', '#.######.#', '.########.', '..######..', '..######..', '##########', '#####.####']
    },
    r03_pond_03: {
      object: 'r03_pond', stage: 3, title: "Лягушка", difficulty: 'normal',
      rows: ['.###..###.', '.###..###.', '.########.', '##########', '##########', '.########.', '.########.', '##.####.##', '####..####']
    },
    r03_glass_door_01: {
      object: 'r03_glass_door', stage: 1, title: "Дверь со стёклами", difficulty: 'normal',
      rows: ['..####..', '.######.', '#..##..#', '########', '#..##..#', '########', '#..##..#', '########', '########', '########']
    },
    r03_glass_door_02: {
      object: 'r03_glass_door', stage: 2, title: "Круглая ручка", difficulty: 'normal',
      rows: ['....##....', '..######..', '.##.##.##.', '.#.####.#.', '##########', '##########', '.#.####.#.', '.##.##.##.', '..######..', '....##....']
    },
    r03_glass_door_03: {
      object: 'r03_glass_door', stage: 3, title: "Старый ключ", difficulty: 'normal',
      rows: ['.####.....', '##..##....', '#....#####', '#....#####', '##..##.#.#', '.####..#.#']
    }
  }
};

// Письма дня — тоже головоломки: матрица выводится из цветного рисунка.
(function (C) {
  C.daily.letters.forEach(function (L) {
    C.puzzles[L.id] = {
      kind: 'daily', title: L.title, difficulty: 'daily', pic: L.pic, palette: L.palette,
      rows: L.pic.map(function (r) { return r.replace(/[^.]/g, '#'); })
    };
  });
  C.event.lanterns.forEach(function (L) {
    C.puzzles[L.id] = {
      kind: 'event', title: L.title, difficulty: 'daily', pic: L.pic, palette: L.palette,
      rows: L.pic.map(function (r) { return r.replace(/[^.]/g, '#'); })
    };
  });
})(window.HOP_CONTENT);
