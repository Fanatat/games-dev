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
      final_text: 'Финик вернулся домой и устроился на коврике. Письмо на полке приподнялось — его можно открыть.',
      invitation: {
        title: 'Приглашение к чаю',
        text: 'Дорогой хранитель! Спасибо, что вернул свет в прихожую. Приходи к чаю — чайная за зелёной дверью.',
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
      final_text: 'Музыкальная коробочка заиграла старый вальс. Финик дремлет в кресле, а за окном кто-то зажёг фонарик.',
      next_room: 'r03',
      invitation: {
        title: 'Записка из оранжереи',
        text: 'Спасибо за чай! Финик нашёл ключ от оранжереи за садом. Там тепло, только всё заросло. Поможешь?',
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
      intro: 'Здесь бабушка растила лимоны и розы. Начнём со стола для рассады — семена ещё живы.',
      intro_sign: 'Вера',
      final_text: 'Двери оранжереи распахнулись в сад. Финик греется на скамейке, а в пруду отражаются первые фонарики.',
      invitation: {
        title: 'Вечер фонариков',
        text: 'Оранжерея ожила! Здесь и устроим Вечер фонариков. Новые комнаты дома скоро откроются, а письма приходят каждый день.',
        sign: 'Вера',
        button: 'Хорошо'
      },
      next_visit_note: 'Новые комнаты скоро откроются. А пока каждый день приходит новое письмо.',
      layout: {
        r03_herbarium: { x: 0.215, y: 0.43, w: 0.115 },
        r03_glass_door: { x: 0.79, y: 0.605, w: 0.28 },
        r03_hanging_pot: { x: 0.36, y: 0.33, w: 0.15 },
        r03_seed_table: { x: 0.33, y: 0.68, w: 0.30 },
        r03_birdhouse: { x: 0.93, y: 0.76, w: 0.11 },
        r03_bench: { x: 0.64, y: 0.73, w: 0.30 },
        r03_watering_can: { x: 0.13, y: 0.88, w: 0.17 },
        r03_pond: { x: 0.52, y: 0.97, w: 0.42 },
        cat: { x: 0.62, y: 0.635, w: 0.15 }
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
      tap_secret: 'Лампа щёлкает выключателем — и снова светит.'
    },
    r01_shelf: {
      room: 'r01', title: 'Почтовая полка', verb: 'Починить',
      puzzles: ['r01_shelf_01'], prerequisites: ['r01_lamp'],
      pitch: 'Полка для писем — с ней в доме появится почта',
      done_text: 'На полку легло письмо с птичьей печатью. Пока оно запечатано.',
      variants: [
        { id: 'r01_shelf_a', title: 'Светлая берёза', sprite: 'shelf_a' },
        { id: 'r01_shelf_b', title: 'Тёмный орех', sprite: 'shelf_b' },
        { id: 'r01_shelf_c', title: 'Полка с открытками', sprite: 'shelf_c', premium: true, price_coins: 800 }
      ],
      tap_secret: 'Письмо запечатано: на сургуче птица. Где-то она уже встречалась…'
    },
    r01_rug: {
      room: 'r01', title: 'Коврик', verb: 'Соткать',
      puzzles: ['r01_rug_01'], prerequisites: ['r01_lamp'],
      pitch: 'Мягкий коврик у двери — кто-то его очень ждёт',
      done_text: 'Коврик снова мягкий. У двери — свежие кошачьи следы.',
      variants: [
        { id: 'r01_rug_a', title: 'Терракотовый', sprite: 'rug_a' },
        { id: 'r01_rug_b', title: 'Шалфейный', sprite: 'rug_b' },
        { id: 'r01_rug_c', title: 'Звёздный индиго', sprite: 'rug_c', premium: true, price_coins: 120 }
      ],
      tap_secret: 'Следы ведут к зелёной двери. Чей-то хвост мелькнул за ней.'
    },
    r01_flower: {
      room: 'r01', title: 'Оконный цветок', verb: 'Посадить',
      puzzles: ['r01_flower_01'], prerequisites: ['r01_shelf', 'r01_rug'],
      pitch: 'Цветок на подоконник — и к окну кто-то прилетит',
      done_text: 'Цветок раскрылся. За окном села птица — точь-в-точь как на печати письма!',
      variants: [
        { id: 'r01_flower_a', title: 'Белый цветок', sprite: 'flower_a' },
        { id: 'r01_flower_b', title: 'Жёлтый цветок', sprite: 'flower_b' },
        { id: 'r01_flower_c', title: 'Розовый пион', sprite: 'flower_c', premium: true, gift: 'stamps' }
      ],
      tap_secret: 'Птица наклоняет голову и тихо поёт.'
    },

    r02_tea_set: {
      room: 'r02', title: 'Чайный сервиз', verb: 'Собрать',
      puzzles: ['r02_tea_set_01', 'r02_tea_set_02', 'r02_tea_set_03'], unlock_after: 0,
      stage_sprites: ['tea_set_s1', 'tea_set_s2'],
      pitch: 'Чашка, блюдце, чайник — и можно звать гостей',
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
      puzzles: ['r02_table_01', 'r02_table_02', 'r02_table_03'], unlock_after: 0,
      stage_sprites: ['table_s1', 'table_s2'],
      pitch: 'Круглый столик для чая на двоих',
      done_text: 'Столик снова крепко стоит. Салфетка пахнет лавандой.',
      variants: [
        { id: 'r02_table_a', title: 'Кружевная салфетка', sprite: 'table_a' },
        { id: 'r02_table_b', title: 'Терракотовая клетка', sprite: 'table_b' },
        { id: 'r02_table_c', title: 'Вечерняя скатерть', sprite: 'table_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Под салфеткой нашлась крошка печенья. Финик её уже заметил.'
    },
    r02_armchair: {
      room: 'r02', title: 'Кресло', verb: 'Обить',
      puzzles: ['r02_armchair_01', 'r02_armchair_02', 'r02_armchair_03'], unlock_after: 0,
      stage_sprites: ['armchair_s1', 'armchair_s2'],
      pitch: 'Мягкое кресло у окна — на нём кто-то любит спать',
      done_text: 'Кресло снова мягкое. Финик тут же занял его.',
      variants: [
        { id: 'r02_armchair_a', title: 'Шалфейный бархат', sprite: 'armchair_a' },
        { id: 'r02_armchair_b', title: 'Горчичный в цветах', sprite: 'armchair_b' },
        { id: 'r02_armchair_c', title: 'Полночный бархат', sprite: 'armchair_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Финик приоткрыл один глаз и снова уснул.'
    },
    r02_clock: {
      room: 'r02', title: 'Часы', verb: 'Завести',
      puzzles: ['r02_clock_01', 'r02_clock_02', 'r02_clock_03'], unlock_after: 2,
      stage_sprites: ['clock_s1', 'clock_s2'],
      pitch: 'Настенные часы стоят с прошлой зимы',
      done_text: 'Тик-так. Часы пошли и пробили пять — время чая.',
      variants: [
        { id: 'r02_clock_a', title: 'Ореховые', sprite: 'clock_a' },
        { id: 'r02_clock_b', title: 'Шалфейные', sprite: 'clock_b' },
        { id: 'r02_clock_c', title: 'Звёздные', sprite: 'clock_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Маятник качнулся, и где-то в доме откликнулось эхо.'
    },
    r02_window: {
      room: 'r02', title: 'Окно в сад', verb: 'Украсить',
      puzzles: ['r02_window_01', 'r02_window_02', 'r02_window_03'], unlock_after: 2,
      stage_sprites: ['window_s1', 'window_s2'],
      pitch: 'Шторы и витраж — чтобы свет был мягче',
      done_text: 'На витраже — та самая птица с печати. Она смотрит в сад.',
      variants: [
        { id: 'r02_window_a', title: 'Кремовые шторы', sprite: 'window_a' },
        { id: 'r02_window_b', title: 'Пыльная роза', sprite: 'window_b' },
        { id: 'r02_window_c', title: 'Полночные шторы', sprite: 'window_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'В саду качнулась ветка. Кажется, там кто-то ходил с фонариком.'
    },
    r02_sideboard: {
      room: 'r02', title: 'Буфет', verb: 'Расставить',
      puzzles: ['r02_sideboard_01', 'r02_sideboard_02', 'r02_sideboard_03'], unlock_after: 4,
      stage_sprites: ['sideboard_s1', 'sideboard_s2'],
      pitch: 'Буфет для чашек и баночек с вареньем',
      done_text: 'На полке — банка вишнёвого варенья с подписью «Для гостей».',
      variants: [
        { id: 'r02_sideboard_a', title: 'Медовый', sprite: 'sideboard_a' },
        { id: 'r02_sideboard_b', title: 'Голубой', sprite: 'sideboard_b' },
        { id: 'r02_sideboard_c', title: 'Вечерний с золотом', sprite: 'sideboard_c', premium: true, sku: 'theme_tea_evening' }
      ],
      tap_secret: 'Дверца скрипнула: внутри стопка старых открыток.'
    },
    r02_photo: {
      room: 'r02', title: 'Фотография', verb: 'Повесить',
      puzzles: ['r02_photo_01', 'r02_photo_02', 'r02_photo_03'], unlock_after: 4,
      stage_sprites: ['photo_s1', 'photo_s2'],
      pitch: 'Старая фотография дома — каким он был',
      done_text: 'На снимке — этот дом, полный гостей, и сад в фонариках.',
      variants: [
        { id: 'r02_photo_a', title: 'Золочёная рамка', sprite: 'photo_a' },
        { id: 'r02_photo_b', title: 'Ореховая рамка', sprite: 'photo_b' },
        { id: 'r02_photo_c', title: 'Вечерняя рамка', sprite: 'photo_c', premium: true, price_coins: 120 }
      ],
      tap_secret: 'На обороте подпись: «Вечер фонариков. Все в сборе».'
    },
    r02_musicbox: {
      room: 'r02', title: 'Музыкальная шкатулка', verb: 'Починить',
      puzzles: ['r02_musicbox_01', 'r02_musicbox_02', 'r02_musicbox_03'], unlock_after: 7,
      stage_sprites: ['musicbox_s1', 'musicbox_s2'],
      pitch: 'Шкатулка молчит давно. Какую песню она помнит?',
      done_text: 'Шкатулка заиграла вальс. Птичка на крышке закружилась.',
      variants: [
        { id: 'r02_musicbox_a', title: 'Палисандр', sprite: 'musicbox_a' },
        { id: 'r02_musicbox_b', title: 'Кремовая с золотом', sprite: 'musicbox_b' },
        { id: 'r02_musicbox_c', title: 'Полночная', sprite: 'musicbox_c', premium: true, price_coins: 300 }
      ],
      tap_secret: 'Шкатулка играет три ноты и ждёт продолжения.'
    },
    r03_seed_table: {
      room: 'r03', title: 'Стол для рассады', verb: 'Расставить',
      puzzles: ['r03_seed_table_01', 'r03_seed_table_02', 'r03_seed_table_03', 'r03_seed_table_04'], unlock_after: 0,
      stage_sprites: ['seed_table_s1', 'seed_table_s2', 'seed_table_s3'],
      pitch: 'Стол, ящик с землёй, совок — и семена проснутся',
      done_text: 'В ящике проклюнулись первые ростки. Пахнет мокрой землёй.',
      variants: [
        { id: 'r03_seed_table_a', title: 'Медовый', sprite: 'seed_table_a' },
        { id: 'r03_seed_table_b', title: 'Шалфейный', sprite: 'seed_table_b' },
        { id: 'r03_seed_table_c', title: 'Вечерний с огоньками', sprite: 'seed_table_c', premium: true, price_coins: 150 }
      ],
      tap_secret: 'Под столом шуршит — Финик проверяет мешок с семенами.'
    },
    r03_watering_can: {
      room: 'r03', title: 'Лейка', verb: 'Начистить',
      puzzles: ['r03_watering_can_01', 'r03_watering_can_02', 'r03_watering_can_03', 'r03_watering_can_04'], unlock_after: 0,
      stage_sprites: ['watering_can_s1', 'watering_can_s2', 'watering_can_s3'],
      pitch: 'Ведёрко, ручка, носик — будет чем поливать',
      done_text: 'Лейка звякнула и пустила тонкую струйку. Ростки повеселели.',
      variants: [
        { id: 'r03_watering_can_a', title: 'Медная', sprite: 'watering_can_a' },
        { id: 'r03_watering_can_b', title: 'С ромашками', sprite: 'watering_can_b' },
        { id: 'r03_watering_can_c', title: 'Звёздная', sprite: 'watering_can_c', premium: true, price_coins: 120 }
      ],
      tap_secret: 'Из носика выкатилась капля и упала Финику на нос.'
    },
    r03_hanging_pot: {
      room: 'r03', title: 'Подвесное кашпо', verb: 'Повесить',
      puzzles: ['r03_hanging_pot_01', 'r03_hanging_pot_02', 'r03_hanging_pot_03', 'r03_hanging_pot_04'], unlock_after: 0,
      stage_sprites: ['hanging_pot_s1', 'hanging_pot_s2', 'hanging_pot_s3'],
      pitch: 'Крючок, верёвочная сетка, горшок — и плющ повиснет',
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
      puzzles: ['r03_birdhouse_01', 'r03_birdhouse_02', 'r03_birdhouse_03', 'r03_birdhouse_04'], unlock_after: 2,
      stage_sprites: ['birdhouse_s1', 'birdhouse_s2', 'birdhouse_s3'],
      pitch: 'Ящик, крыша, жёрдочка — и прилетит жилец',
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
      puzzles: ['r03_herbarium_01', 'r03_herbarium_02', 'r03_herbarium_03', 'r03_herbarium_04'], unlock_after: 2,
      stage_sprites: ['herbarium_s1', 'herbarium_s2', 'herbarium_s3'],
      pitch: 'Рамка, кленовый лист, папоротник — память о лете',
      done_text: 'Под стеклом — клён и папоротник. На ярлыке бабушкин почерк.',
      variants: [
        { id: 'r03_herbarium_a', title: 'Дубовая рамка', sprite: 'herbarium_a' },
        { id: 'r03_herbarium_b', title: 'Шалфейная рамка', sprite: 'herbarium_b' },
        { id: 'r03_herbarium_c', title: 'Золочёная', sprite: 'herbarium_c', premium: true, price_coins: 150 }
      ],
      tap_secret: 'На ярлыке едва видно: «Собрано к первому Вечеру фонариков».'
    },
    r03_bench: {
      room: 'r03', title: 'Скамейка', verb: 'Починить',
      puzzles: ['r03_bench_01', 'r03_bench_02', 'r03_bench_03', 'r03_bench_04'], unlock_after: 4,
      stage_sprites: ['bench_s1', 'bench_s2', 'bench_s3'],
      pitch: 'Чугунные бока, сиденье, спинка — и можно присесть',
      done_text: 'Скамейка снова стоит крепко. Финик уже занял подушку.',
      variants: [
        { id: 'r03_bench_a', title: 'Терракотовая', sprite: 'bench_a' },
        { id: 'r03_bench_b', title: 'В полоску', sprite: 'bench_b' },
        { id: 'r03_bench_c', title: 'Полночная', sprite: 'bench_c', premium: true, price_coins: 200 }
      ],
      tap_secret: 'Финик потянулся и перевернулся на другой бок.'
    },
    r03_pond: {
      room: 'r03', title: 'Пруд', verb: 'Расчистить',
      puzzles: ['r03_pond_01', 'r03_pond_02', 'r03_pond_03', 'r03_pond_04'], unlock_after: 4,
      stage_sprites: ['pond_s1', 'pond_s2', 'pond_s3'],
      pitch: 'Камни, кувшинка, лягушка — пруд оживает',
      done_text: 'Вода стала прозрачной. На кувшинке сидит лягушка.',
      variants: [
        { id: 'r03_pond_a', title: 'Летний', sprite: 'pond_a' },
        { id: 'r03_pond_b', title: 'Солнечный', sprite: 'pond_b' },
        { id: 'r03_pond_c', title: 'С фонариками', sprite: 'pond_c', premium: true, price_coins: 250 }
      ],
      tap_secret: 'Лягушка квакнула и спряталась под лист кувшинки.'
    },
    r03_glass_door: {
      room: 'r03', title: 'Дверь в сад', verb: 'Открыть',
      puzzles: ['r03_glass_door_01', 'r03_glass_door_02', 'r03_glass_door_03', 'r03_glass_door_04'], unlock_after: 6,
      stage_sprites: ['glass_door_s1', 'glass_door_s2', 'glass_door_s3'],
      pitch: 'Рама, петли, ручка — и дверь откроется в сад',
      done_text: 'Дверь распахнулась, и в оранжерею вошёл тёплый ветер из сада.',
      variants: [
        { id: 'r03_glass_door_a', title: 'Кремовая с розами', sprite: 'glass_door_a' },
        { id: 'r03_glass_door_b', title: 'Шалфейная с вьюнком', sprite: 'glass_door_b' },
        { id: 'r03_glass_door_c', title: 'Полночная с цветами', sprite: 'glass_door_c', premium: true, price_coins: 300 }
      ],
      tap_secret: 'За стеклом мелькнула птица с печатью — и исчезла в листве.'
    }
  },

  /* Экономика (ТЗ 03). Монеты — за игру, голоса ВК — только за наборы. */
  economy: {
    coins_per_puzzle: 20,
    coins_daily_first: 20,
    room_reward: { coins: 100, pencils: 1 },
    tutorial_pencils: 3,
    pencil_price: 100,
    rewarded: { coins: 40, pencils: 1, per_day: 3, after_room: 'r01' },
    // Вернулся после паузы в after_days и больше — карандаш в подарок.
    comeback: { after_days: 3, pencils: 1 }
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
    rewards: [{ variants: ['r01_flower_c'], pencils: 3 }]
  },

  /* «Письмо дня»: по письму в день от daily.start, нерешённое ждёт keep_days.
     pic: '.' — пусто, буква — цвет открытки из palette. */
  daily: {
    after_room: 'r01',
    keep_days: 14,
    letters: [
      {
        id: "d001", title: "Кленовый лист", from: "Вера",
        text: "Доброе утро! В доме снова ходят письма, как в прежние годы. Первое — с клёна у калитки. Его посадили те, кто жил здесь до меня.",
        palette: { a: "#c8643c", b: "#d9a441", c: "#3b2c22" },
        pic: ['...a....', '.a.aa.a.', '.aaaaaa.', 'aaabaaaa', '.aabbaa.', '..abba..', '...c....', '..c.....']
      },
      {
        id: "d002", title: "Рыбка", from: "Финик",
        text: "Мрр. Рыбку не ел. Почти. Под крыльцом нашёл коробку, пахнет свечками. Лапой не открыть. Финик.",
        palette: { a: "#5f7d8c", b: "#d9a441", c: "#3b2c22" },
        pic: ['........', '...bb...', '.aaaaa.b', 'aacaaaab', 'aaaaaaab', '.aaaaa.b', '...bb...', '........']
      },
      {
        id: "d003", title: "Жёлудь", from: "Нина",
        text: "Вера, дуб у сарая сыплет жёлуди! Говорят, прежние хозяева пекли тут ореховое печенье. Найду рецепт — принесу к чаю.",
        palette: { a: "#8a5a3b", b: "#c79a3a", c: "#3b2c22" },
        pic: ['...c....', '..aaaa..', '.aaaaaa.', 'aaaaaaaa', '.bbbbbb.', '.bbbbbb.', '..bbbb..', '...bb...']
      },
      {
        id: "d004", title: "Гриб у старого пня", from: "Почтальон Тимофей",
        text: "Доброго дня! Нашёл у грибного пня письмо без обратного адреса. Марка старая, с фонариком. Передаю как есть.",
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
        text: "Пирог с тыквой удался! Соседка вспомнила: из тыкв тут резали фонари к одному вечеру. Каждый год, в первые холода.",
        palette: { a: "#d07a3e", b: "#a8452e", c: "#3b2c22", d: "#7d9466" },
        pic: ['....cd....', '....c.dd..', '.aabaabaa.', 'aaabaabaaa', 'aaabaabaaa', 'aaabaabaaa', 'aaabaabaaa', '.aabaabaa.', '..aaaaaa..']
      },
      {
        id: "d007", title: "Клубок ниток", from: "Вера",
        text: "В шкафу нашёлся клубок и недовязанная варежка. Чья — не знаю. Довяжу: вдруг её хозяйка однажды заглянет на чай.",
        palette: { a: "#c27a6e", b: "#7b4b5a", c: "#3b2c22" },
        pic: ['...aaaa...', '.aabbaaaa.', '.abaabbaa.', 'aabaaaabba', 'abaabbaaab', 'aabbaaabaa', '.aaabbbaa.', '.abaaaaaa.', '...aaaa..c', '.........c']
      },
      {
        id: "d008", title: "Зонтик", from: "Почтальон Тимофей",
        text: "Дождь, а письма сухие — спасибо зонтику. На почте старики помнят: раз в год в этом доме светились все окна до утра.",
        palette: { a: "#c8643c", b: "#d9a441", c: "#3b2c22" },
        pic: ['....cc....', '..aabbaa..', '.aaabbaaa.', 'aaaabbaaaa', 'aaaabbaaaa', 'a.a.cc.a.a', '....c.....', '....c.....', '....c..c..', '.....cc...']
      },
      {
        id: "d009", title: "Ягоды рябины", from: "Нина",
        text: "Рябина после заморозка сладкая, сварю варенье. Бабушка говорила, гроздья вешали у фонарей, чтобы свет был теплее.",
        palette: { a: "#a8452e", b: "#7d9466", c: "#3b2c22" },
        pic: ['..bb..bb..', '.bbbccbbb.', '...c..c...', '..c....c..', '.aa.aa.aa.', 'aaaaaaaaaa', '.aa.aa.aa.', '..aa..aa..', '.aaaaaaaa.', '..aa..aa..']
      },
      {
        id: "d010", title: "Финик спит", from: "Финик",
        text: "Сплю. Не будить. Снились огоньки в саду и люди с пирогами. Нюхал сарай: там тоже пахнет свечками. Финик.",
        palette: { a: "#c98a4b", b: "#a8452e", c: "#3b2c22", d: "#7d9466" },
        pic: ['............', '.a.a........', '.aaa...aaa..', '.cac.aaaaaa.', '.aaaaabaabaa', '.aaaaabaabaa', '..aaaaaaaaa.', 'babaaaaa....', 'dddddddddddd']
      },
      {
        id: "d011", title: "Сова", from: "Птица с печатью",
        text: "Сова видела их всех. Ей до сих пор снится тот вечер. Спросите у сарая.",
        palette: { a: "#8a5a3b", b: "#d9a441", c: "#3b2c22", d: "#c8643c", e: "#c79a6a" },
        pic: ['a........a', 'aa......aa', '.aaaaaaaa.', 'abbaaaabba', 'abcbaabcba', 'abbaddabba', 'aaaaddaaaa', 'aaeeeeeeaa', '.aeeeeeea.', '..aaaaaa..', '...d..d...']
      },
      {
        id: "d012", title: "Свеча", from: "Вера",
        text: "Ключ из сада подошёл к сараю! Внутри фонари, десятки, в пыли, коробка свечей и список гостей. Есть в нём и мой дедушка.",
        palette: { a: "#d9a441", b: "#c8643c", c: "#3b2c22", d: "#9aa77c", e: "#8a5a3b" },
        pic: ['...a....', '..aba...', '..aba...', '...c....', '.dddddd.', '.dddddd.', '.dddddd.', '.dddddd.', '.dddddd.', 'eeeeeeee', '.eeeeee.']
      },
      {
        id: "d013", title: "Птичий домик", from: "Почтальон Тимофей",
        text: "Вешал вам птичий домик и заметил на крыше сургуч с птицей. Кто-то давно присматривает за домом. По-доброму, думаю.",
        palette: { a: "#c8643c", b: "#7d9466", c: "#3b2c22", d: "#8a5a3b" },
        pic: ['....aa....', '...aaaa...', '..aaaaaa..', '.aaaaaaaa.', 'aaaaaaaaaa', '.bbbbbbbb.', '.bbbccbbb.', '.bbbccbbb.', '.ddbbbbbb.', '.bbbbbbbb.', '....dd....', '....dd....']
      },
      {
        id: "d014", title: "Фонарик", from: "Вера",
        text: "Зажгла первый фонарь — и сад стал как в рассказах. Может, устроим вечер снова? В списке гостей ещё много имён…",
        palette: { a: "#3b2c22", b: "#d9a441", c: "#c8643c" },
        pic: ['....aa....', '...a..a...', '..aaaaaa..', '.acbbbbca.', '.abbbbbba.', '.abbbbbba.', '.abbbbbba.', '.acbbbbca.', '..aaaaaa..', '....aa....']
      },
      {
        id: "d015", title: "Тыквенный пирог", from: "Нина",
        text: "Испекла тыквенный пирог по старому рецепту, с мёдом и корицей. Прочла ваш список гостей: половину фамилий знаю! Начнём с аптеки?",
        palette: { a: "#c98a4b", b: "#c8643c", c: "#8a5a3b", d: "#e8d9b0" },
        pic: ['...d..d...', '....d..d..', '...d..d...', '.aaaaaaaa.', 'abbabbabba', 'aaaaaaaaaa', 'bbbbbbbbbb', '.aaaaaaaa.', 'cccccccccc', '.cccccccc.']
      },
      {
        id: "d016", title: "Корзинка", from: "Финик",
        text: "Мрр. Нашёл корзинку с фонарями. Лёг сверху. Фонари теперь тёплые и в шерсти. Это помощь. Финик.",
        palette: { a: "#8a5a3b", b: "#c79a3a", c: "#c98a4b", d: "#3b2c22" },
        pic: ['...aaaa...', '..a....a..', '.a.c..c.a.', '.a.cccc.a.', '.acdccdca.', 'aaaaaaaaaa', 'bababababa', 'ababababab', '.babababa.', '..aaaaaa..']
      },
      {
        id: "d017", title: "Почтовая сумка", from: "Почтальон Тимофей",
        text: "Доброго дня! Сверил ваш список с почтовой книгой. Первый адрес — аптека на Липовой. Аптекарь Лев там до сих пор и всё помнит.",
        palette: { a: "#3b2c22", b: "#a8452e", c: "#d9a441", d: "#8a5a3b", e: "#e8d9b0" },
        pic: ['..aaaaaa..', '.a......a.', '.a.eeee.a.', 'bbbbbbbbbb', 'bbbbbbbbbb', '.bbbccbbb.', 'dddddddddd', 'dddddddddd', 'dddddddddd', '.dddddddd.']
      },
      {
        id: "d018", title: "Ступка", from: "Аптекарь Лев",
        text: "Здравствуйте, Вера. Мальчишкой я толок в этой ступке лаванду для свечей к вашему вечеру. Ступка цела, руки тоже. Сделаю свечи снова.",
        palette: { a: "#8a5a3b", b: "#5f7d8c", c: "#3b2c22", d: "#7d9466" },
        pic: ['.......aa.', '......aa..', '.....aa...', 'dd..aa.dd.', 'bbbbbbbbbb', 'bbbbbbbbbb', '.bbbbbbbb.', '..bbbbbb..', '...bbbb...', '..cccccc..']
      },
      {
        id: "d019", title: "Перо", from: "Птица с печатью",
        text: "Перо моё. Рука, что писала первое письмо, — не моя. Она сажала клён.",
        palette: { a: "#5f7d8c", b: "#e8d9b0" },
        pic: ['.......aaa', '.....aaaab', '....aaaaba', '...aaaabaa', '..aa.aba..', '..aaaba...', '.aaaba....', '.aaba.....', '.bb.......', 'b.........']
      },
      {
        id: "d020", title: "Лейка", from: "Вера",
        text: "В оранжерее посеяла астры и бархатцы — к вечеру фонарей они должны зацвести. Финик проверяет каждую лунку. Лапами.",
        palette: { a: "#7d9466", b: "#5f7d8c" },
        pic: ['...aaa....', '..a...a...', '..a...a..b', 'aaaaaaa.b.', 'aaaaaaabb.', 'aaaaaaab..', 'aaaaaaa..b', 'aaaaaaa...', '.aaaaa...b']
      },
      {
        id: "d021", title: "Варежка", from: "Внучка Соня",
        text: "Я Соня, внучка Анны из вашего списка. Бабушка узнала по рисунку свою варежку из шкафа. Плакала и смеялась. Говорит: довяжем вместе.",
        palette: { a: "#c27a6e", b: "#e8d9b0", c: "#a8452e" },
        pic: ['..aaaa....', '.aaaaaa...', '.abbabba..', '.aaaaaa.aa', '.aaaaaaaaa', '.abbabbaa.', '.aaaaaaa..', '..cccccc..', '..cbcbcb..', '..cccccc..']
      },
      {
        id: "d022", title: "Ёжик", from: "Финик",
        text: "Мрр. В листьях под яблоней живёт ёжик. Фыркает. Я тоже фыркнул. Теперь друзья. Яблоки он не отдаёт. Финик.",
        palette: { a: "#8a5a3b", b: "#c98a4b", c: "#3b2c22", d: "#a8452e" },
        pic: ['..a.a.a.a..', '..aaaaaaa..', '.aaaddaaa..', 'aaaaddaaab.', 'aaaaaaaabcb', 'aaaaaaabbbb', 'aaaaaaabbbc', '.aaaaaabbb.', '..bb...bb..']
      },
      {
        id: "d023", title: "Почтовый ящик", from: "Почтальон Тимофей",
        text: "Разнёс семь писем по адресам из списка. Три ответа уже в ящике. Дядя Коля с мельницы пишет, что отец часто вспоминал ваш вечер.",
        palette: { a: "#5f7d8c", b: "#8a5a3b", c: "#d9a441", d: "#e8d9b0" },
        pic: ['..aaaaaa..', '.aaaaaaaa.', 'aaaaaaaaaa', 'a.dddddd.a', 'aaaaaaaaaa', 'aaaacaaaaa', 'aaaaaaaaaa', '....bb....', '....bb....', '..bbbbbb..']
      },
      {
        id: "d024", title: "Колосок", from: "Дядя Коля с мельницы",
        text: "Здорово, хозяйка! Отец мой каждый год вёз на ваш вечер мешок муки — на всех пироги. Мельница крутится. Привезу и я, как он.",
        palette: { a: "#c79a3a", b: "#9aa77c" },
        pic: ['....a....', '..a.a.a..', '.aa.a.aa.', '..aaaaa..', '.aa.a.aa.', '..aaaaa..', '.aa.a.aa.', '..aaaaa..', '....b....', '....b.bb.', '....bbb..', '....b....']
      },
      {
        id: "d025", title: "Кружка какао", from: "Нина",
        text: "Рецепт к холодам: какао, ложка мёда, щепотка корицы, сверху зефир. Пила такое на вечере фонарей девчонкой. Грело лучше шарфа.",
        palette: { a: "#c8643c", b: "#8a5a3b", c: "#e8d9b0", d: "#d9a441" },
        pic: ['...c...c....', '....c...c...', '...c...c....', '.aaaaaaaa...', '.abbcbbba...', '.aaaaaaaaaa.', '.aaaaaaaa..a', '.aadadaaa..a', '.aaaaaaaa.a.', '.aaaaaaaaa..', '..aaaaaa....', 'bbbbbbbbbbbb']
      },
      {
        id: "d026", title: "Песочные часы", from: "Птица с печатью",
        text: "Кто написал первым, тот ждал дольше всех. Песок почти пересыпался.",
        palette: { a: "#8a5a3b", b: "#5f7d8c", c: "#d9a441" },
        pic: ['aaaaaaaaaa', '.b......b.', '.bccccccb.', '..bccccb..', '...bccb...', '....bb....', '...bccb...', '..b.cc.b..', '.b.cccc.b.', '.bccccccb.', 'aaaaaaaaaa']
      },
      {
        id: "d027", title: "Росток", from: "Вера",
        text: "Взошли астры! Ряды крошечных ростков под стеклом. Соня принесла семена бархатцев от бабушки — у неё они росли с того самого вечера.",
        palette: { a: "#7d9466", b: "#a8452e", c: "#c8643c" },
        pic: ['.aaa...aa.', 'aaaaa.aaaa', '.aaaa.aaa.', '....aa....', '....a.....', 'bbbbbbbbbb', 'bbbbbbbbbb', '.cccccccc.', '.cccccccc.', '..cccccc..', '..cccccc..']
      },
      {
        id: "d028", title: "Фонарь с ручкой", from: "Почтальон Тимофей",
        text: "Разбирал фонари из сарая и нашёл один с буквами «М.Т.» на ручке. Это мамин. Она была в вашем списке, а я и не знал. Спасибо, Вера.",
        palette: { a: "#3b2c22", b: "#d9a441", c: "#c8643c", d: "#e8d9b0" },
        pic: ['....aaa....', '...a...a...', '...a...a...', '..aaaaaaa..', '.aaaaaaaaa.', '.a.bbbbb.a.', '.a.bbcbb.a.', '.a.bcccb.a.', '.a.bbdbb.a.', '.a.bbdbb.a.', '.aaaaaaaaa.', '..aaaaaaa..']
      },
      {
        id: "d029", title: "Мышка", from: "Финик",
        text: "Поймал мышку. Тряпичную, из сарая. Носил по дому, пока не отобрали. Теперь она на шкафу. Шкаф я тоже поймаю. Мрр. Финик.",
        palette: { a: "#9a8f86", b: "#c27a6e", c: "#3b2c22", e: "#c27a6e" },
        pic: ['..bb........', '.bbbb.......', '.bbbbaaaa...', '..aaaaaaaa..', '.acaaaaaaaa.', 'baaaaaaaaaa.', '.aaaaaaaaaaa', '..aaaaaaaa.e', '..........e.', '......eeee..']
      },
      {
        id: "d030", title: "Свеча в банке", from: "Аптекарь Лев",
        text: "Вера, свечи с лавандой готовы. Ставьте их в банки, как в старину: ветер не задует, дети не обожгутся. Сорок банок хватит?",
        palette: { a: "#c8643c", b: "#d9a441", c: "#8a5a3b", d: "#5f7d8c", e: "#e8d9b0", f: "#3b2c22" },
        pic: ['.cccccccc.', 'd........d', 'd...aa...d', 'd..abba..d', 'd...ba...d', 'd...f....d', 'd..eeee..d', 'd..eeee..d', 'd..eeee..d', 'd..eeee..d', 'dddddddddd', '.dddddddd.']
      },
      {
        id: "d031", title: "Яблоко", from: "Нина",
        text: "Пеку яблоки с орехами. А по секрету: Лев и Коля сорок лет спорили, чей фонарь светил ярче. Вчера встретились в аптеке — и смеялись.",
        palette: { a: "#a8452e", b: "#7d9466", c: "#3b2c22", d: "#c27a6e" },
        pic: ['......c....', '.....c.bb..', '.....cbbb..', '..aaa.aaa..', '.aaaaaaaaa.', 'aadaaaaaaaa', 'adaaaaaaaaa', 'aaaaaaaaaaa', 'aaaaaaaaaaa', '.aaaaaaaaa.', '..aaa.aaa..']
      },
      {
        id: "d032", title: "Месяц", from: "Птица с печатью",
        text: "При молодом месяце сургуч мягче. Спросите клён у калитки, чью руку он помнит.",
        palette: { a: "#d9a441", b: "#e8d9b0" },
        pic: ['...aaaa....', '.aaaa......', '.aaa.......', 'aaa......b.', 'aaa.....bbb', 'aaa......b.', 'aaa........', '.aaa.......', '.aaaaa.....', '..aaaaaaaa.', '....aaaaa..']
      },
      {
        id: "d033", title: "Шарф", from: "Внучка Соня",
        text: "Бабушка учит меня вязать. Варежку довязали! Теперь вяжем шарф для Финика — он сам выбрал нитку и утащил клубок под кровать.",
        palette: { a: "#a8452e", b: "#d9a441", c: "#e8d9b0" },
        pic: ['..aaaaaaaa..', '.aa......aa.', '.aa......aa.', '..aaaaaaaa..', '...bbb.bbb..', '...aaa.aaa..', '...bbb..bbb.', '...aaa..aaa.', '...bbb...bbb', '...aaa...aaa', '...c.c...c.c', '...c.c...c.c']
      },
      {
        id: "d034", title: "Марка с фонариком", from: "Почтальон Тимофей",
        text: "Объехал всю округу: почти все из списка нашлись — кто сам, кто во внуках. А в конторе отыскал марки с фонариком, как на том письме.",
        palette: { a: "#5f7d8c", c: "#3b2c22", d: "#d9a441", e: "#c8643c" },
        pic: ['a.a.a.a.a.a', '.aaaaaaaaa.', 'aa.......aa', '.a...c...a.', 'aa..ccc..aa', '.a.cdddc.a.', 'aa.cdedc.aa', '.a.cdddc.a.', 'aa..ccc..aa', '.a.......a.', 'aaaaaaaaaaa', 'a.a.a.a.a.a']
      },
      {
        id: "d035", title: "Астра", from: "Вера",
        text: "Ночью ударил первый мороз, а в оранжерее зацвели астры. На полях списка нашла дедушкин почерк: «Оставить место тому, кто вернёт свет».",
        palette: { a: "#c27a6e", b: "#d9a441", c: "#7d9466", d: "#9aa77c" },
        pic: ['.....a......', '..a..aa..a..', '...aaaaaaa..', '.aaaabbbaaa.', '..aabbbbbaa.', 'aaaabbbbbaaa', '..aabbbbbaa.', '.aaaabbbaaa.', '...aaaaaa...', '..a..cc.a...', '...dd.c.....', '.....dc.....']
      },
      {
        id: "d036", title: "Тачка", from: "Дядя Коля с мельницы",
        text: "Везу тачку тыкв с огорода — для фонарей. Вырезать научу, отец показывал. Главное: глаза пошире, а улыбку подобрее.",
        palette: { a: "#8a5a3b", b: "#c8643c", c: "#7d9466", d: "#3b2c22", e: "#c79a3a" },
        pic: ['...c.....c...', '..bbb...bbb..', '.bbbbbbbbbbb.', 'aaaaaaaaaaaaa', '.aaaaaaaaaaa.', '..aaaaaaaaaaa', '..ddd....a...', '.dd.dd...a...', '.d.e.d...a...', '.dd.dd.......', '..ddd........']
      },
      {
        id: "d037", title: "Полосатый носок", from: "Финик",
        text: "Мрр. Носок Сони теперь мой. Тёплый, полосатый, пахнет печеньем. Сплю в нём у печки. Вернуть не могу, я занят. Финик.",
        palette: { a: "#a8452e", b: "#e8d9b0", c: "#5f7d8c" },
        pic: ['.aaaaa....', '.bbbbb....', '.aaaaa....', '.bbbbb....', '.aaaaa....', '.bbbbb....', '.aaaaaa...', '.bbbbbbbb.', 'caaaaaaaaa', 'ccbbbbbbbc', '.cccccccc.']
      },
      {
        id: "d038", title: "Пряничный человечек", from: "Нина",
        text: "Пеку пряничных человечков — пробую рецепт, чтобы к вечеру хватило на всех. Глазурь легла ровно. Финик уже унёс одного. За ногу.",
        palette: { a: "#c98a4b", b: "#e8d9b0", c: "#a8452e" },
        pic: ['....aaa....', '...aaaaa...', '...a.a.a...', '...abbba...', '....aaa....', '.aaaaaaaaa.', 'aaaaacaaaaa', '...aaaaa...', '...aacaa...', '...aa.aa...', '..aaa.aaa..', '..aa...aa..']
      },
      {
        id: "d039", title: "Колокольчик", from: "Птица с печатью",
        text: "Когда в сарае звякнет колокольчик, откройте третий ящик. Я подожду.",
        palette: { a: "#c79a3a", b: "#a8452e", c: "#3b2c22", d: "#8a5a3b" },
        pic: ['..bbb.bbb..', '....bbb....', '....aaa....', '...aaaaa...', '...aaaaa...', '..aaaaaaa..', '..aacaaaa..', '..aaaaaaa..', '.aaaaaaaaa.', 'aaaaaaaaaaa', '.....d.....', '....ddd....']
      },
      {
        id: "d040", title: "Горшочек мёда", from: "Аптекарь Лев",
        text: "Для гостей заварю чай с липой и мёдом — от простуды и для доброго разговора. Рецепт моего учителя, он тоже был в вашем списке.",
        palette: { a: "#c98a4b", b: "#d9a441", c: "#e8d9b0", d: "#a8452e" },
        pic: ['...cc..cc...', '..cccccccc..', '...dddddd...', '...aaaaaa...', '..aaaaaaaa..', '.aaaaaaaaaa.', 'aaabbbbbbaaa', 'aaab.bb.baaa', 'aaabbbbbbaaa', '.aaaaaaaaaa.', '..aaaaaaaa..', '...aaaaaa...']
      },
      {
        id: "d041", title: "Валенок", from: "Внучка Соня",
        text: "Бабушка достала валенки и сказала: «Поеду». Двадцать лет никуда не ездила! Шьём ей фонарик из ткани, чтобы нести самой.",
        palette: { a: "#5f6b73", b: "#a8452e", c: "#e8d9b0" },
        pic: ['.aaaaaa....', '.aaaaaa....', '.abcbca....', '.aaaaaa....', '.aaaaaa....', '.aaaaaa....', '.aaaaaa....', '.aaaaaaa...', '.aaaaaaaaa.', 'aaaaaaaaaaa', 'aaaaaaaaaaa', '.aaaaaaaaa.']
      },
      {
        id: "d042", title: "Письмо с сургучом", from: "Почтальон Тимофей",
        text: "В архиве почты нашёлся конверт с той же птицей на сургуче. Адрес — ваш дом. А на обороте: «Открыть в вечер фонарей».",
        palette: { a: "#e8d9b0", b: "#c8a878", c: "#a8452e", d: "#3b2c22" },
        pic: ['aaaaaaaaaaaaaa', '.aaaaaaaaaaaa.', 'a.aaaaaaaaaa.a', 'aa.aaaaaaaa.aa', 'aaa.aaaaaa.aaa', 'aaaa.cccc.aaaa', 'aaaaccdcccaaaa', 'aaaaccccccaaaa', 'aaaaaccccaaaaa', 'bbbbbbbbbbbbbb']
      },
      {
        id: "d043", title: "Лапка", from: "Финик",
        text: "Мрр. На крыльце иней. Я прошёлся. Теперь там мои следы, красиво. Птица на крыше смотрела. Я тоже смотрел. Финик.",
        palette: { a: "#c98a4b", b: "#c27a6e" },
        pic: ['...aa..aa...', '..aaa..aaa..', '..aaa..aaa..', 'aa........aa', 'aaa......aaa', 'aaa..aa..aaa', '.a..bbbb..a.', '...bbbbbb...', '..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '..bbb..bbb..']
      },
      {
        id: "d044", title: "Гирлянда фонариков", from: "Вера",
        text: "Решили всем домом: вечер фонарей будет в первую субботу заморозков. Гирлянды развешаны, конверт ждёт на полке. Приходите и вы.",
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
      object: 'r02_tea_set', stage: 1, title: "Чашка", difficulty: 'easy',
      rows: ['.#.#..', '#.#...', '######', '####.#', '######', '.###..']
    },
    r02_tea_set_02: {
      object: 'r02_tea_set', stage: 2, title: "Блюдце", difficulty: 'easy',
      rows: ['.###.', '##.##', '#.#.#', '##.##', '.###.']
    },
    r02_tea_set_03: {
      object: 'r02_tea_set', stage: 3, title: "Чайник", difficulty: 'normal',
      rows: ['...##...', '..####..', '..######', '#.####.#', '.#####.#', '..######', '..####..', '.######.']
    },
    r02_table_01: {
      object: 'r02_table', stage: 1, title: "Ножка с завитком", difficulty: 'easy',
      rows: ['#####', '.##..', '..#..', '..#.#', '...##']
    },
    r02_table_02: {
      object: 'r02_table', stage: 2, title: "Столешница", difficulty: 'easy',
      rows: ['.#####.', '#######', '.#...#.', '.#...#.', '.#...#.', '.#...#.', '##...##']
    },
    r02_table_03: {
      object: 'r02_table', stage: 3, title: "Салфетка", difficulty: 'normal',
      rows: ['#.#.#', '.###.', '##.##', '.###.', '#.#.#']
    },
    r02_armchair_01: {
      object: 'r02_armchair', stage: 1, title: "Ножки", difficulty: 'easy',
      rows: ['#####', '#####', '.#.#.', '#...#', '#...#']
    },
    r02_armchair_02: {
      object: 'r02_armchair', stage: 2, title: "Спинка", difficulty: 'easy',
      rows: ['..###..', '.#...#.', '#.#.#.#', '#.....#', '#.#.#.#', '#.....#', '#######']
    },
    r02_armchair_03: {
      object: 'r02_armchair', stage: 3, title: "Подушка", difficulty: 'normal',
      rows: ['#.....#', '#######', '.##.##.', '#######', '#.....#']
    },
    r02_clock_01: {
      object: 'r02_clock', stage: 1, title: "Маятник", difficulty: 'easy',
      rows: ['#######', '#..#..#', '#..#..#', '#..#..#', '#.###.#', '#.###.#', '#######']
    },
    r02_clock_02: {
      object: 'r02_clock', stage: 2, title: "Циферблат", difficulty: 'easy',
      rows: ['..######..', '.##.##.##.', '##...#..##', '#....#...#', '##...#..##', '##..##..##', '#..#.....#', '##.......#', '.##.##.##.', '..######..']
    },
    r02_clock_03: {
      object: 'r02_clock', stage: 3, title: "Ключик", difficulty: 'normal',
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
    r02_window_03: {
      object: 'r02_window', stage: 3, title: "Витражная птица", difficulty: 'normal',
      rows: ['..######..', '.##....##.', '#..###...#', '#.##.#..##', '#..######.', '#..######.', '#...####.#', '#....#.#.#', '.########.', '..######..']
    },
    r02_sideboard_01: {
      object: 'r02_sideboard', stage: 1, title: "Дверца", difficulty: 'easy',
      rows: ['##########', '#........#', '#.######.#', '#.#.##.#.#', '#.#.##.#.#', '#.######.#', '#.#.##.#.#', '#.#.##.#.#', '#.######.#', '##########']
    },
    r02_sideboard_02: {
      object: 'r02_sideboard', stage: 2, title: "Ручка", difficulty: 'easy',
      rows: ['...##...', '..####..', '...##...', '.######.', '##....##', '#......#', '##....##', '.######.']
    },
    r02_sideboard_03: {
      object: 'r02_sideboard', stage: 3, title: "Банка варенья", difficulty: 'normal',
      rows: ['..######..', '.########.', '#.#.##.#.#', '..######..', '.########.', '##......##', '##.####.##', '##..##..##', '##......##', '.########.']
    },
    r02_photo_01: {
      object: 'r02_photo', stage: 1, title: "Уголок рамки", difficulty: 'easy',
      rows: ['########', '########', '##......', '##.###..', '##.#.#..', '##.##...', '##......', '##......']
    },
    r02_photo_02: {
      object: 'r02_photo', stage: 2, title: "Домик", difficulty: 'easy',
      rows: ['....##.##.', '...######.', '..######..', '.########.', '##########', '.#......#.', '.#.##.#.#.', '.#.##.#.#.', '.#....#.#.', '##########']
    },
    r02_photo_03: {
      object: 'r02_photo', stage: 3, title: "Цветок", difficulty: 'normal',
      rows: ['...####...', '..##..##..', '.##.##.##.', '.##.##.##.', '..##..##..', '...####...', '....##....', '##..##..##', '.##.##.##.', '..######..']
    },
    r02_musicbox_01: {
      object: 'r02_musicbox', stage: 1, title: "Корпус", difficulty: 'easy',
      rows: ['.########.', '##########', '##########', '#........#', '#.######.#', '#.#.##.#.#', '#.######.#', '#........#', '##########', '.##....##.']
    },
    r02_musicbox_02: {
      object: 'r02_musicbox', stage: 2, title: "Гребёнка", difficulty: 'easy',
      rows: ['##########', '#.######.#', '##########', '#.#.#.#.#.', '#.#.#.#.#.', '#.#.#.#...', '#.#.#.#...', '#.#.#.....', '#.#.......', '#.........']
    },
    r02_musicbox_03: {
      object: 'r02_musicbox', stage: 3, title: "Птичка", difficulty: 'normal',
      rows: ['......##..', '.....####.', '.....##.##', '#...####..', '#.######..', '.#######..', '.######...', '..####....', '..#.#.....', '##########']
    },
    r03_seed_table_01: {
      object: 'r03_seed_table', stage: 1, title: "Стол", difficulty: 'normal',
      rows: ['##########', '##########', '.#......#.', '.#......#.', '.#......#.', '.########.', '.########.', '.#......#.', '.#......#.', '##......##']
    },
    r03_seed_table_02: {
      object: 'r03_seed_table', stage: 2, title: "Ящик с землёй", difficulty: 'normal',
      rows: ['.##.###.##', '##########', '##.###.###', '##########', '#........#', '#..####..#', '#........#', '##########']
    },
    r03_seed_table_03: {
      object: 'r03_seed_table', stage: 3, title: "Совок", difficulty: 'normal',
      rows: ['...###...', '...#.#...', '...###...', '....#....', '.#######.', '#########', '#########', '.#######.', '..#####..', '...###...']
    },
    r03_seed_table_04: {
      object: 'r03_seed_table', stage: 4, title: "Росток", difficulty: 'normal',
      rows: ['###....##', '####..###', '.###.###.', '..##.##..', '...###...', '....#....', '....#....', '....#....', '.#######.', '#########']
    },
    r03_watering_can_01: {
      object: 'r03_watering_can', stage: 1, title: "Корпус лейки", difficulty: 'normal',
      rows: ['..######..', '.##....##.', '.########.', '.########.', '.#......#.', '.########.', '.########.', '.########.', '##########']
    },
    r03_watering_can_02: {
      object: 'r03_watering_can', stage: 2, title: "Ручка", difficulty: 'normal',
      rows: ['...####...', '..##..##..', '.##....##.', '.#......#.', '##########', '##########', '#........#', '##########', '##########', '.########.']
    },
    r03_watering_can_03: {
      object: 'r03_watering_can', stage: 3, title: "Носик с ситечком", difficulty: 'normal',
      rows: ['##........', '###.......', '####......', '.####.....', '..###.####', '...###.###', '....######', '.....#####', '.....#####', '......####']
    },
    r03_watering_can_04: {
      object: 'r03_watering_can', stage: 4, title: "Капля", difficulty: 'normal',
      rows: ['...##...', '...##...', '..####..', '..####..', '.######.', '.######.', '########', '###.####', '.##.###.', '..####..']
    },
    r03_hanging_pot_01: {
      object: 'r03_hanging_pot', stage: 1, title: "Крючок с кольцом", difficulty: 'normal',
      rows: ['...####...', '..##..##..', '..#....##.', '.......##.', '......##..', '.....##...', '..######..', '.###..###.', '.##....##.', '.##....##.', '.###..###.', '..######..']
    },
    r03_hanging_pot_02: {
      object: 'r03_hanging_pot', stage: 2, title: "Узел макраме", difficulty: 'normal',
      rows: ['.....##.....', '.....##.....', '....####....', '....####....', '...##..##...', '..##....##..', '.##.####.##.', '.#..####..#.', '.##......##.', '..##....##..', '...######...', '..########..']
    },
    r03_hanging_pot_03: {
      object: 'r03_hanging_pot', stage: 3, title: "Глиняный горшок", difficulty: 'normal',
      rows: ['.#########.', '###########', '.#########.', '..#.....#..', '.##.....##.', '##.......##', '##.......##', '.##.....##.', '..#######..', '...#####...']
    },
    r03_hanging_pot_04: {
      object: 'r03_hanging_pot', stage: 4, title: "Лист плюща", difficulty: 'normal',
      rows: ['.....#.....', '....###....', '....###....', '.#..###..#.', '.##.###.##.', '.#########.', '##########.', '###########', '.####.####.', '..###.###..', '....#.#....', '.....#.....']
    },
    r03_birdhouse_01: {
      object: 'r03_birdhouse', stage: 1, title: "Столбик", difficulty: 'normal',
      rows: ['##########', '.########.', '..######..', '...####...', '...####...', '...####...', '...####...', '...####...', '..######..', '.###..###.', '###....###', '##......##']
    },
    r03_birdhouse_02: {
      object: 'r03_birdhouse', stage: 2, title: "Крыша", difficulty: 'normal',
      rows: ['.....##.....', '....####....', '...######...', '..########..', '.##########.', '############', '############', '##........##', '#..........#', '#..........#']
    },
    r03_birdhouse_03: {
      object: 'r03_birdhouse', stage: 3, title: "Леток с жёрдочкой", difficulty: 'normal',
      rows: ['.....#.....', '....###....', '...#####...', '..#######..', '.#########.', '###########', '..##...##..', '..#.....#..', '..##...##..', '..#######..', '#########..', '..#######..']
    },
    r03_birdhouse_04: {
      object: 'r03_birdhouse', stage: 4, title: "Малиновка", difficulty: 'normal',
      rows: ['...####.....', '..######....', '..##.###....', '########....', '..######..##', '.#########.#', '.##########.', '.##########.', '..########..', '....####....', '....#..#....', '...##.##....']
    },
    r03_bench_01: {
      object: 'r03_bench', stage: 1, title: "Чугунная ножка", difficulty: 'normal',
      rows: ['############', '############', '.####.......', '..####......', '...####.....', '....###.....', '....###.....', '...###......', '..###...###.', '.###...##.##', '.###....#.##', '..########..']
    },
    r03_bench_02: {
      object: 'r03_bench', stage: 2, title: "Сиденье", difficulty: 'normal',
      rows: ['############', '#.########.#', '############', '............', '############', '#.########.#', '############', '............', '.##......##.', '.##......##.']
    },
    r03_bench_03: {
      object: 'r03_bench', stage: 3, title: "Спинка", difficulty: 'normal',
      rows: ['....####....', '..########..', '.##########.', '##........##', '##.##..##.##', '##.##..##.##', '##.##..##.##', '##.##..##.##', '##........##', '############']
    },
    r03_bench_04: {
      object: 'r03_bench', stage: 4, title: "Подушка", difficulty: 'hard',
      rows: ['....####....', '..########..', '.####..####.', '.###.##.###.', '###.####.###', '##.##..##.##', '##.##..##.##', '###.####.###', '.###.##.###.', '.####..####.', '..########..', '....####....']
    },
    r03_herbarium_01: {
      object: 'r03_herbarium', stage: 1, title: "Рамка", difficulty: 'normal',
      rows: ['#############', '#############', '##.........##', '##.#######.##', '##.#.....#.##', '##.#.....#.##', '##.#.....#.##', '##.#.....#.##', '##.#.....#.##', '##.#######.##', '##.........##', '#############', '#############']
    },
    r03_herbarium_02: {
      object: 'r03_herbarium', stage: 2, title: "Кленовый лист", difficulty: 'normal',
      rows: ['......#......', '.....###.....', '.#...###...#.', '.##.#####.##.', '..#########..', '#############', '.###########.', '..#########..', '...#######...', '..####.####..', '.##...#...##.', '......#......', '......#......']
    },
    r03_herbarium_03: {
      object: 'r03_herbarium', stage: 3, title: "Папоротник", difficulty: 'normal',
      rows: ['......#......', '.....###.....', '....##.##....', '.....#.#.....', '...###.###...', '....##.##....', '..####.####..', '...###.###...', '.#####.#####.', '..####.####..', '######.######', '.#####.#####.', '..###.#.###..', '......#......']
    },
    r03_herbarium_04: {
      object: 'r03_herbarium', stage: 4, title: "Бирка на нитке", difficulty: 'hard',
      rows: ['..####......', '.##..##.....', '.#....##....', '.##....##...', '..##....##..', '.........#..', '........###.', '.......#####', '......###.##', '.....#######', '....#######.', '...#######..', '..#######...', '...#####....']
    },
    r03_pond_01: {
      object: 'r03_pond', stage: 1, title: "Камни у воды", difficulty: 'normal',
      rows: ['..###.####.##.', '.####.####.###', '###.........##', '##...........#', '##..........##', '...........###', '##...##.##...#', '###.........##', '##.........##.', '##...........#', '.####.####.##.', '..###.####.#..']
    },
    r03_pond_02: {
      object: 'r03_pond', stage: 2, title: "Кувшинка", difficulty: 'normal',
      rows: ['......##......', '.....####.....', '..#..####..#..', '..##.####.##..', '...########...', '##.########.##', '.############.', '..##########..', '...########...', '..##########..', '##############', '#######.######', '.######.#####.']
    },
    r03_pond_03: {
      object: 'r03_pond', stage: 3, title: "Лягушка", difficulty: 'normal',
      rows: ['..###....###..', '.##.##..##.##.', '.#.###..###.#.', '.############.', '##############', '#............#', '.############.', '..##########..', '.############.', '###.######.###', '##..######..##', '#####....#####']
    },
    r03_pond_04: {
      object: 'r03_pond', stage: 4, title: "Стрекоза", difficulty: 'hard',
      rows: ['......###......', '.....#####.....', '......###......', '####...#...####', '######.#.######', '.######.######.', '..####.#.####..', '......###......', '..####.#.####..', '.######.######.', '######.#.######', '####...#...####', '.......#.......', '.......#.......']
    },
    r03_glass_door_01: {
      object: 'r03_glass_door', stage: 1, title: "Дверь со стёклами", difficulty: 'normal',
      rows: ['....####....', '..########..', '.##########.', '##...##...##', '##...##...##', '############', '##...##...##', '##...##...##', '############', '##...##...##', '##...##...##', '############', '############', '##........##', '############']
    },
    r03_glass_door_02: {
      object: 'r03_glass_door', stage: 2, title: "Круглая ручка", difficulty: 'normal',
      rows: ['.....###.....', '...#######...', '..##.....##..', '.##..###..##.', '.#..#####..#.', '##.###.###.##', '##.#######.##', '##.#######.##', '.#..#####..#.', '.##..###..##.', '..##.....##..', '...#######...', '.....###.....']
    },
    r03_glass_door_03: {
      object: 'r03_glass_door', stage: 3, title: "Старый ключ", difficulty: 'normal',
      rows: ['..####.........', '.##..##........', '##....##.......', '#..##..#.......', '#.####.#.......', '#.#..#.########', '#.#..#.########', '#.####.#...#.##', '#..##..#...####', '##....##...#.##', '.##..##........', '..####.........']
    },
    r03_glass_door_04: {
      object: 'r03_glass_door', stage: 4, title: "Вьюнок", difficulty: 'hard',
      rows: ['...########...', '..##..##..##..', '.###..##..###.', '##.#..##..#.##', '#...#.##.#...#', '#....####....#', '##############', '#....####....#', '##..#.##.#..##', '.###..##..###.', '..###.##.###..', '....######....', '......##......', '.....##.......']
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
})(window.HOP_CONTENT);
