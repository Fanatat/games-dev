/* Контент «Дома картинок»: комнаты, предметы, головоломки, экономика, письма.
   Источник правды для правил и текстов. Проверка —
   `node tools/validate_content.js` (единственность и решаемость без угадывания).
   Позиции предметов в сцене — доли ширины/высоты квадратной сцены. */
window.HOP_CONTENT = {
  content_version: 2,

  room_order: ['r01', 'r02'],

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
      invitation: {
        title: 'Записка из оранжереи',
        text: 'Спасибо за чай! Оранжерея за садом ещё спит, но скоро и её двери откроются. Заглядывай за письмами каждый день.',
        sign: 'Вера',
        button: 'Скоро'
      },
      next_visit_note: 'Оранжерея скоро откроется. А пока каждый день приходит новое письмо.',
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
    }
  },

  /* Экономика (ТЗ 03). Монеты — за игру, голоса ВК — только за наборы. */
  economy: {
    coins_per_puzzle: 20,
    coins_daily_first: 20,
    room_reward: { coins: 100, pencils: 1 },
    tutorial_pencils: 3,
    pencil_price: 100,
    rewarded: { coins: 40, pencils: 1, per_day: 3, after_room: 'r01' }
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
