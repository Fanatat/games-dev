/*
 * workshop_i18n.js — языки «Ювелир Ленд»: window.WsI18n.
 *
 * Ключ словаря — сама русская строка; в коде T('Уровень {n}', { n }) вместо литерала.
 * Русский — исходный язык: при lang 'ru' T() только подставляет значения, сборка ВК
 * от модуля не меняется. Английский — таблица EN ниже; у слов для plural() — пара
 * [один, много] (plural(n, 'ход', 'хода', 'ходов') → 'move' / 'moves').
 * Язык: ?lang=ru|en в адресе, иначе WS_CONFIG.lang: 'ru' | 'en' | 'auto' (первый язык
 * браузера ru* — русский, остальные — английский; так требует CrazyGames), без настроек — 'ru'.
 * apply(root) переводит текст и подписи (aria-label, title, alt) готовой разметки —
 * workshop.html и окон, которые строят модули. Полнота словаря — tools/ws_i18n_keys.py.
 * Покупки за голоса ВК (renderTariffs) не переводятся: вне ВК этих окон нет.
 */
(function (root) {
  'use strict';

  const EN = {
    // название
    'Ювелир Ленд': 'Jewel Atelier', 'Ювелир': 'Jewel', 'Ленд': 'Atelier',
    'Ювелир Ленд в избранном': 'Jewel Atelier is in your favorites',
    'Добавьте игру в избранное — Ювелир Ленд всегда будет под рукой.': 'Add the game to favorites to keep Jewel Atelier close at hand.',
    // заставка и загрузка
    'Загрузка': 'Loading', 'Не удалось загрузить': 'Could not load', 'Проверьте интернет': 'Check your connection', 'Повторить': 'Retry',
    'Играть': 'Play', 'Дальше': 'Next', 'Продолжить': 'Continue',
    'Перекладывайте камни по пробиркам. Четыре одинаковых — заказчица заберёт их сама, а камень встанет в украшение.':
      'Move gems between tubes. Four of a kind go to the customer, and a gem is set into the jewel.',
    // карта
    'Карта уровней': 'Level map', 'Монеты': 'Coins', 'Как играть': 'How to play', 'Без рекламы': 'No ads', 'Лавка': 'Shop',
    'Звук': 'Sound', 'Вибрация включена': 'Vibration on', 'Вибрация выключена': 'Vibration off',
    'Музыка включена': 'Music on', 'Музыка выключена': 'Music off',
    'Монеты — за заказы': 'Coins come from orders',
    '{word}: уровень {n}': '{word}: level {n}',
    'Все изделия готовы — соберите три звезды: уровень {n}': 'All jewels done. Get three stars: level {n}',
    ', пройден, звёзд {n}': ', complete, stars {n}', ', лучший результат {moves}': ', best {moves}',
    ', открыт': ', open', ', закрыт': ', locked', ', сложный заказ': ', hard order',
    'Сначала уровень {n}': 'Level {n} first', 'Глава 2': 'Chapter 2',
    'Шкатулка коллекции «{name}»: ': '{name} collection box: ', 'открыта': 'opened', ', в ней было «{decor}»': ', it held {decor}',
    'можно открыть': 'ready to open', 'пройдите все пять уровней коллекции': 'finish all five levels of the collection',
    'Ещё {n} {levels}': '{n} more {levels}',
    'Шкатулка открыта!': 'Box opened!', ' и новое убранство «{decor}»': ' and new decor: {decor}', 'Красота!': 'Lovely!',
    '«{name}»': '{name}',
    // уровень
    'Уровень': 'Level', 'Уровень {n}': 'Level {n}', 'Уровень {n} · Сложный заказ': 'Level {n} · Hard order',
    'На карту': 'To map', 'Изделие: камни встают в гнёзда по мере выдачи заказов': 'Jewel: gems are set as orders are delivered',
    'Заказы': 'Orders', 'Далее:': 'Next:', 'Далее: {list}': 'Next: {list}', 'Очередь пуста': 'No more orders',
    'Пробирки с камнями': 'Tubes with gems', 'Отменить ход': 'Undo move', 'Подсказка': 'Hint', 'Начать заново': 'Restart',
    'Свободное место': 'Empty spot', 'Заказ: {gem}, четыре камня': 'Order: {gem}, four gems',
    'Срочно! Оплата ×3': 'Rush! Pay ×3', 'Принесёт ключ': 'Brings a key', 'Джекпот +{n}': 'Jackpot +{n}', 'Соберите 4 камня': 'Collect 4 gems',
    'Срочно': 'Rush', 'Срочно: осталось {moves}': 'Rush: {moves} left', 'Не успели': 'Too late',
    'Заказы: {n} из {m}': 'Orders: {n} of {m}', 'до {n}': 'to {n}',
    'Звёзд: {n}': 'Stars: {n}', 'Звёзд: {n}, пока ходов не больше {m}': 'Stars: {n} while moves are {m} or fewer',
    'Ходы: {n}': 'Moves: {n}', 'Ходы: {n} из {m}': 'Moves: {n} of {m}',
    'Теперь — куда положить': 'Now tap where to put them', 'Коснитесь пробирки': 'Tap a tube', 'Следующий заказ': 'Next order',
    'Подсказка: по стрелке': 'Hint: follow the arrow', 'Готово, ждёт заказа': 'Ready, waiting for its order',
    'Сложный заказ: {moves}': 'Hard order: {moves}',
    'Подсказка бесплатно': 'Free hint', 'Подсказка за видео': 'Hint for a video', 'Подсказка за {coins}': 'Hint for {coins}',
    'Тупик': 'Stuck', 'Не собрать': 'Unsolvable', 'Заново': 'Restart', 'Вернуть {moves}': 'Undo {moves}',
    'Нужен ключ': 'Needs a key', 'Пробирка полна': 'Tube is full', 'Нужен такой же': 'Needs a match',
    'Каскад ×{n}!': 'Combo ×{n}!', 'Успели! ×3': 'In time! ×3', 'Заказ готов': 'Order done!', 'Джекпот! +{n}': 'Jackpot! +{n}',
    'Партия вернулась': 'Game restored', 'Отменить — вернёт партию': 'Undo brings it back',
    'Сначала верните ходы': 'Undo moves first', 'Попробуйте другой ход': 'Try another move', 'Мало монет': 'Not enough coins',
    'Видео сейчас нет': 'No video right now', 'Перезапустите игру': 'Restart the game', 'Покупка зачислена': 'Purchase added',
    // новинки и «Сложный заказ»
    'Новое!': 'New!', 'Понятно': 'Got it', 'Сложный заказ': 'Hard order', 'Награда вдвое больше.': 'Double reward.', 'Берусь!': "I'm in!",
    'Сложный заказ · ходов: {n} · награда ×2': 'Hard order · {n} moves · reward ×2',
    'Тайные камни': 'Hidden gems', 'Снимите верхний камень — нижний откроется.': 'Move the top gem to reveal the one below.',
    'Срочный заказ': 'Rush order', 'Успейте за отмеченные ходы — заплатят втрое.': 'Finish within the marked moves for triple pay.',
    'Запертая пробирка': 'Locked tube', 'Откроется, когда выдадите заказ с ключом.': 'Opens when you deliver the order with the key.',
    'Золотой топаз': 'Golden topaz', 'Четыре топаза — сразу +100 монет.': 'Four topazes give +100 coins at once.',
    // ходы кончились
    'Ходы кончились': 'Out of moves', '+5 ходов': '+5 moves',
    'Собрано заказов: {n} из {m}. Докупите ходы, отмените последний ход или начните заново.':
      'Orders done: {n} of {m}. Buy more moves, undo the last move or restart.',
    'Ещё 5 ходов за 50 монет': '5 more moves for 50 coins', 'Ещё {moves} за {coins}': '{moves} more for {coins}',
    'У вас {coins}': 'You have {coins}', 'Пять ходов бесплатно': 'Five free moves', 'Пять ходов за видео': 'Five moves for a video',
    // победа
    'Готово!': 'Done!', 'Корона готова!': 'Crown done!', 'Ходов: {n}': 'Moves: {n}', 'Ходов: {n} — новый рекорд!': 'Moves: {n}, new record!',
    'Ходов: {n} · лучший: {best}': 'Moves: {n} · best: {best}', '★★★ — если уложиться в {moves}': '★★★ in {moves} or fewer',
    'Как у мастера: короче не бывает': 'Master level: the shortest way', 'Три звезды!': 'Three stars!',
    'Коллекция «{name}» собрана!': '{name} collection complete!',
    'Коллекция «{name}» собрана! Шкатулка ждёт': '{name} collection complete! A box awaits',
    'Коллекция «{name}»: {n} из {m}': '{name} collection: {n} of {m}',
    'Открыть шкатулку': 'Open the box', 'На витрину': 'To the showcase', 'Ещё раз': 'Play again', 'Витрина': 'Showcase',
    'Удвоить монеты бесплатно': 'Double coins for free', 'Удвоить монеты за видео': 'Double coins for a video',
    // лавка и шкатулка
    'Закрыть': 'Close', 'Что украсить': 'What to decorate', 'Убранство мастерской': 'Atelier decor', 'Готово': 'Done',
    'Стол': 'Table', 'Стекло': 'Glass', 'Подушка': 'Cushion', 'Тумба': 'Stand',
    ', выбрано': ', selected', ', в Королевском наборе': ', in the Royal set', ', не хватает монет': ', not enough coins',
    ', в шкатулке «{name}»': ', in the {name} box', 'В шкатулке «{name}»': 'In the {name} box', 'Купить: {name}': 'Buy: {name}',
    'Выберите оправу': 'Pick a setting', 'Шкатулка': 'Jewel box', 'Шкатулка: собранные изделия': 'Jewel box: finished jewels',
    'Любимое изделие': 'Favorite jewel', 'Любимое изделие: {name}': 'Favorite jewel: {name}',
    'Любимое изделие: снять отметку': 'Favorite jewel: unmark', 'Сделать любимым': 'Make favorite',
    'В избранное': 'Add to favorites', 'Добавить в избранное': 'Add to favorites',
    ', первая форма': ', first shape', ', вторая форма': ', second shape',
    '{name}. Слева — {left}, справа — {right}.': '{name}. Left: {left}, right: {right}.',
    ', шкатулка открыта': ', box opened', ', любимое': ', favorite', 'Уровень {n}: ещё не собрано': 'Level {n}: not made yet',
    'Собрано изделий: {n} из {m}.': 'Jewels made: {n} of {m}.', '{metal}, уровень {n}.': '{metal}, level {n}.',
    'Золото': 'Gold', 'Розовое золото': 'Rose gold', 'Белое золото': 'White gold',
    // «Как играть»
    'Коснитесь пробирки, потом другой: верхние камни перейдут на такой же камень или в пустую':
      'Tap a tube, then another: top gems move onto a matching gem or into an empty tube',
    'Четыре одинаковых — заказ: камни уходят в украшение': 'Four of a kind fill an order and go into the jewel',
    'Заказы идут по очереди, следующие видны под карточкой': 'Orders come in turn; the next ones are shown below',
    'Готовая четвёрка ждёт, пока придёт её заказ': 'A finished four waits for its order',
    'Меньше ходов — больше звёзд и монет': 'Fewer moves, more stars and coins',
    'Отмена возвращает ход, сколько угодно раз': 'Undo takes back a move, as often as you like',
    'Подсказка показывает ход: на уровнях 1–2 бесплатно, дальше — 25 монет': 'Hint shows a move: free on levels 1–2, then 25 coins',
    'Подсказка показывает ход: на уровнях 1–{free} бесплатно, дальше — {price} монет': 'Hint shows a move: free on levels 1–{free}, then {price} coins',
    'Подсказка показывает ход: {price} монет': 'Hint shows a move: {price} coins',
    'Каждый пятый уровень — сложный заказ: ходов мало. Кончились — +5 ходов за 50 монет':
      'Every fifth level is a hard order with few moves. Out of moves? +5 moves for 50 coins',
    'Каждый пятый уровень — сложный заказ: ходов мало. Кончились — +{n} ходов за {price} монет':
      'Every fifth level is a hard order with few moves. Out of moves? +{n} moves for {price} coins',
    'Условия': 'Terms', 'Конфиденциальность': 'Privacy', 'Пользовательское соглашение': 'Terms of use',
    'Пользовательское соглашение: срок, продление, без автоматического продления': 'Terms of use: duration, renewal, no auto-renewal',
    'Политика конфиденциальности': 'Privacy policy',
    // «Без рекламы» и «Спасибо» (окна есть только при покупках)
    'Без рекламы. 7 дней за 1 голос. 30 дней за 3 голоса и Королевский набор. 365 дней за 9 голосов и Королевский набор. Повторная покупка продлевает срок. Королевский набор остаётся навсегда.':
      'No ads. 7 days for 1 vote. 30 days for 3 votes plus the Royal set. 365 days for 9 votes plus the Royal set. Buying again extends the term. The Royal set is yours forever.',
    'Набор — навсегда': 'Set is forever', 'Спасибо!': 'Thank you!', 'Реклама отключена': 'Ads are off', 'Набор ваш': 'The set is yours',
    // слова для plural(): [один, много]
    'ход': ['move', 'moves'], 'монета': ['coin', 'coins'], 'уровень': ['level', 'levels'], 'день': ['day', 'days'], 'голос': ['vote', 'votes'],
    // камни
    'Рубин': 'Ruby', 'Изумруд': 'Emerald', 'Сапфир': 'Sapphire', 'Аметист': 'Amethyst', 'Бирюза': 'Turquoise',
    'Оникс': 'Onyx', 'Бриллиант': 'Diamond', 'Янтарь': 'Amber', 'Опал': 'Opal', 'Топаз': 'Topaz',
    // коллекции
    'Весна': 'Spring', 'Море': 'Sea', 'Сад': 'Garden', 'Звёзды': 'Stars', 'Осень': 'Autumn', 'Королевский бал': 'Royal Ball',
    'Лунный свет': 'Moonlight', 'Венеция': 'Venice', 'Сакура': 'Sakura', 'Северное сияние': 'Northern Lights',
    'Зимняя сказка': 'Winter Tale', 'Бриллиантовый юбилей': 'Diamond Jubilee',
    // убранство
    'Ореховый стол': 'Walnut table', 'Изумрудный бархат': 'Emerald velvet', 'Винный бархат': 'Wine velvet', 'Синий бархат': 'Navy velvet',
    'Пудровый бархат': 'Blush velvet', 'Чёрный бархат': 'Black velvet', 'Королевский бархат': 'Royal velvet',
    'Прозрачное стекло': 'Clear glass', 'Морское стекло': 'Sea glass', 'Розовое стекло': 'Rose glass', 'Королевское стекло': 'Royal glass',
    'Голубое стекло': 'Sky glass', 'Мятное стекло': 'Mint glass', 'Королевский хрусталь': 'Royal crystal',
    'Бархатная подушка': 'Velvet cushion', 'Лавандовая подушка': 'Lavender cushion', 'Персиковая подушка': 'Peach cushion',
    'Мятная подушка': 'Mint cushion', 'Чёрная подушка': 'Black cushion', 'Королевская подушка': 'Royal cushion',
    'Бархатная тумба': 'Velvet stand', 'Мраморная тумба': 'Marble stand', 'Мятная тумба': 'Mint stand', 'Королевский пьедестал': 'Royal pedestal',
    // подсказки уровней
    'Соберите четыре одинаковых камня — заказ заберёт их сам.': 'Gather four matching gems and the order takes them.',
    'Соберите следующий камень заранее — после выдачи он уйдёт сам: каскад!': 'Prepare the next gems early: they go right after the delivery. Combo!',
    'Новое: тайные камни под бархатом — откроются, когда снимете камень сверху.': 'New: hidden gems under velvet show up when you move the gem above.',
    'Новое: срочный заказ — успейте за отмеченное число ходов и получите тройную плату.': 'New: rush order. Finish within the marked moves for triple pay.',
    'Новое: запертая пробирка — ключ придёт с отмеченным заказом.': 'New: locked tube. The key comes with the marked order.',
    'Новое: золотой топаз — соберите четыре и сорвите джекпот!': 'New: golden topaz. Gather four to hit the jackpot!',
    // изделия
    'Колечко «Капель»': 'Droplet Ring', 'Серьги «Подснежник»': 'Snowdrop Earrings', 'Кулон «Ручеёк»': 'Brook Pendant',
    'Брошь «Первоцвет»': 'Primrose Brooch', 'Браслет «Весенний сад»': 'Spring Garden Bracelet',
    'Кольцо «Жемчужный берег»': 'Pearl Shore Ring', 'Серьги «Волна»': 'Wave Earrings', 'Кулон «Маяк»': 'Lighthouse Pendant',
    'Брошь «Морская звезда»': 'Starfish Brooch', 'Колье «Прибой»': 'Surf Necklace',
    'Кольцо «Роза»': 'Rose Ring', 'Серьги «Пион»': 'Peony Earrings', 'Заколка «Лаванда»': 'Lavender Hairpin',
    'Брошь «Ирис»': 'Iris Brooch', 'Диадема «Сад королевы»': "Queen's Garden Tiara",
    'Кольцо «Полярная звезда»': 'North Star Ring', 'Кулон «Комета»': 'Comet Pendant', 'Запонки «Созвездие»': 'Constellation Cufflinks',
    'Браслет «Млечный путь»': 'Milky Way Bracelet', 'Колье «Звездопад»': 'Starfall Necklace',
    'Кольцо «Золотая листва»': 'Golden Leaf Ring', 'Серьги «Рябина»': 'Rowan Earrings', 'Брошь «Клён»': 'Maple Brooch',
    'Заколка «Жёлудь»': 'Acorn Hairpin', 'Диадема «Листопад»': 'Falling Leaves Tiara',
    'Перстень «Скипетр»': 'Scepter Signet', 'Кулон «Держава»': 'Royal Orb Pendant', 'Колье «Бал»': 'Ballroom Necklace',
    'Браслет «Трон»': 'Throne Bracelet', 'Корона мастера': "Master's Crown",
    'Кольцо «Полумесяц»': 'Crescent Ring', 'Серьги «Лунный камень»': 'Moonstone Earrings', 'Кулон «Ночная фиалка»': 'Night Violet Pendant',
    'Заколка «Сова»': 'Owl Hairpin', 'Колье «Лунная дорожка»': 'Moonpath Necklace',
    'Брошь «Гондола»': 'Gondola Brooch', 'Запонки «Мост вздохов»': 'Rialto Cufflinks', 'Браслет «Карнавал»': 'Carnival Bracelet',
    'Кулон «Муранское стекло»': 'Murano Pendant', 'Диадема «Палаццо»': 'Palazzo Tiara',
    'Серьги «Лепесток»': 'Petal Earrings', 'Кольцо «Ханами»': 'Hanami Ring', 'Заколка «Веер»': 'Fan Hairpin',
    'Брошь «Журавль»': 'Crane Brooch', 'Корона «Сакура в цвету»': 'Cherry Blossom Crown',
    'Кольцо «Полярная ночь»': 'Polar Night Ring', 'Кулон «Аврора»': 'Aurora Pendant', 'Браслет «Сполохи»': 'Northern Glow Bracelet',
    'Запонки «Айсберг»': 'Iceberg Cufflinks', 'Колье «Небесное сияние»': 'Sky Glow Necklace',
    'Брошь «Снежинка»': 'Snowflake Brooch', 'Серьги «Сосулька»': 'Icicle Earrings', 'Кольцо «Иней»': 'Frost Ring',
    'Кулон «Снегурочка»': 'Snow Maiden Pendant', 'Диадема «Снежная королева»': 'Snow Queen Tiara',
    'Заколка «Жемчужная нить»': 'Pearl Strand Hairpin', 'Браслет «Шампанское»': 'Champagne Bracelet', 'Брошь «Вальс»': 'Waltz Brooch',
    'Серьги «Бриллиантовая капля»': 'Diamond Drop Earrings', 'Корона «Королева бриллиантов»': 'Diamond Queen Crown'
  };

  const CY = /[А-Яа-яЁё]/;
  const ATTRS = ['aria-label', 'title', 'alt'];

  function pickLang() {
    try {
      const q = /[?&]lang=(ru|en)\b/.exec(String((root.location && root.location.search) || ''));
      if (q) return q[1];
    } catch (e) { /* нет адреса — дальше по настройкам */ }
    const cfg = root.WS_CONFIG && root.WS_CONFIG.lang;
    if (cfg === 'ru' || cfg === 'en') return cfg;
    if (cfg === 'auto') {
      const nav = root.navigator || {};
      const first = String((nav.languages && nav.languages[0]) || nav.language || '').toLowerCase();
      return first.indexOf('ru') === 0 ? 'ru' : 'en';
    }
    return 'ru';
  }

  const lang = pickLang();
  const missing = [];

  function fill(s, v) {
    return v ? s.replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m)) : s;
  }
  function lookup(s) {
    if (lang === 'ru') return s;
    const e = EN[s];
    if (typeof e === 'string') return e;
    if (Array.isArray(e)) return e[0];
    if (CY.test(s) && missing.indexOf(s) < 0) missing.push(s);
    return s;
  }
  const t = (s, v) => fill(lookup(String(s)), v);

  function plural(n, one, few, many) {
    if (lang === 'en') {
      const e = EN[one];
      if (Array.isArray(e)) return Math.abs(n) === 1 ? e[0] : e[1];
      return lookup(one);
    }
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }

  // перевод строки разметки с сохранением пробелов по краям ('Уровень ' → 'Level ')
  function swap(s) {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
    return m[2] && CY.test(m[2]) ? m[1] + lookup(m[2]) + m[3] : s;
  }

  function apply(el) {
    if (lang === 'ru') return;
    const doc = root.document;
    if (!doc) return;
    const top = el || doc.body;
    if (!top) return;
    const walk = doc.createTreeWalker(top, 4 /* NodeFilter.SHOW_TEXT */);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const p = n.parentNode && n.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE') continue;
      const v = n.nodeValue;
      if (v && CY.test(v)) n.nodeValue = swap(v);
    }
    const els = [top].concat(Array.prototype.slice.call(top.querySelectorAll('[aria-label],[title],[alt]')));
    els.forEach((e) => {
      if (!e.getAttribute) return;
      ATTRS.forEach((a) => { const v = e.getAttribute(a); if (v && CY.test(v)) e.setAttribute(a, swap(v)); });
    });
    doc.documentElement.lang = lang;
    if (CY.test(doc.title)) doc.title = lookup(doc.title.trim());
  }

  root.WsI18n = { lang, t, plural, apply, missing, EN };
  apply();   // разметка страницы выше подключения модулей — сразу, без вспышки русского
})(typeof window !== 'undefined' ? window : this);
