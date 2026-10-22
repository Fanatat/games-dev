// «Последний конвой»: английские тексты (проход 1 к CrazyGames, 22.10.2026).
// Тексты конвоя написаны по-русски прямо в js/convoy.js и index.html; здесь — их английская пара.
// Ключ — русская строка как есть. {0} {1} {2} — подставляемая часть (число, имя края…), она переносится
// в перевод, а число с запятой («1,5») становится числом с точкой. {gold} {hp} {dmg} {cd} {hull} {squad}
// {rock} — значки описаний карт (Convoy.fmtDesc), их не трогаем.
// Язык конвоя — ru или en (platform.js applyDetectedLanguage): ВК — ru, остальное — по языку площадки.
const CV_I18N = (() => {
  const EN = {
    // --- index.html: заголовок, меню, HUD, окна
    'Последний конвой': 'Last Convoy',
    'ПОСЛЕДНИЙ КОНВОЙ': 'LAST CONVOY',
    'Поверни телефон': 'Rotate your phone',
    'Прочность конвоя': 'Convoy durability',
    'Попутный ветер: прочность +35% до первой доставки': 'Tailwind: +35% durability until your first delivery',
    'Врагов на поле': 'Foes on the field',
    'Пауза (P)': 'Pause (P)',
    'Пауза': 'Pause',
    'Выбери награду': 'Choose a reward',
    'Другие карты (R)': 'Other cards (R)',
    'Другие карты': 'Other cards',
    'Починить конвой': 'Repair the convoy',
    'Золото': 'Gold',
    'Отряд': 'Squad',
    'Камнепад (Пробел)': 'Rockfall (Space)',
    'Камнепад': 'Rockfall',
    'Звук': 'Sound',
    'Музыка': 'Music',
    'Продолжить': 'Continue',
    'В меню': 'Menu',
    'Рассказать друзьям': 'Tell your friends',
    'Рейтинг': 'Leaderboard',
    'В поход': 'Set out',
    'Конвой доставлен!': 'Convoy delivered!',
    'Конвой пал': 'Convoy lost',
    'Ещё поход': 'One more run',
    'Повозки разбиты!': 'Wagons wrecked!',
    'Посмотри рекламу — конвой встанет с половиной прочности, а враги у повозок отлетят.':
      'Watch an ad: the convoy gets back up with half durability and nearby foes are knocked back.',
    'Второй шанс': 'Second chance',
    'Итог': 'Results',
    'Закрыть': 'Close',
    'Казна': 'Treasury',
    'Походы': 'Runs',
    'Награда за вход': 'Daily reward',
    'Заходи каждый день — награда растёт.': 'Come back every day: the reward grows.',
    'Заходи каждый день — награда растёт. Пропуск начнёт круг заново.': 'Come back every day: the reward grows. Miss a day and it starts over.',
    'Забрать': 'Claim',
    'Забрать +{0}': 'Claim +{0}',
    'День {0}': 'Day {0}',

    // --- бойцы отряда (CONVOY.labels)
    'Боец': 'Fighter', 'Ближний бой': 'Melee',
    'Копейщик': 'Spearman', 'Крепкий удар': 'Heavy hit',
    'Стрелок': 'Archer', 'Дальний бой': 'Ranged',
    'Защитник': 'Defender', 'Прочный': 'Sturdy',
    'Щитоносец': 'Shieldbearer', 'Держит удар': 'Takes hits',
    'Бомбометатель': 'Bomber', 'Бьёт по толпе': 'Hits crowds',
    '{0}, цена {1}': '{0}, cost {1}',
    // серии убийств
    'Разгром!': 'Rout!', 'Бойня!': 'Carnage!', 'Неудержимы!': 'Unstoppable!', 'Легенда!': 'Legendary!',

    // --- награды за славу (CONVOY.meta) и «Доблесть»
    'Запас в дорогу': 'Road Supplies', '{gold}+40 на старте': '{gold}+40 at start',
    'Щитоносцы': 'Shieldbearers', 'Новая карта': 'New card',
    'Крепкие борта': 'Sturdy Sides',
    'Новая эпоха': 'New Era',
    'Бомбометатели': 'Bombers',
    'Сноровка': 'Knack', '{cd}камнепад −15%': '{cd}rockfall −15%',
    'Широкий выбор': 'Wide Choice', '4 карты на выбор': '4 cards to choose',
    'Расписной полог': 'Painted Cover', 'Новый полог повозок': 'New wagon cover',
    'Гадальщик': 'Fortune Teller', 'Первая смена карт даром': 'First reroll is free',
    'Знамя похода': 'Convoy Banner', '{dmg}+8% отряду': '{dmg}+8% squad',
    'Доблесть': 'Valor',
    'Доблесть {0}': 'Valor {0}',
    '{dmg}+{0}% урона и здоровья отряду': '{dmg}+{0}% squad damage and health',
    '{dmg}+{0}% — предел урона и здоровья отряду': '{dmg}+{0}% squad damage and health (max)',
    '{dmg}+{0}% — предел, ступень в звание': '{dmg}+{0}% (max), rank only',
    'Каждая ступень: +{0}% урона и здоровья отряду, до +{1}%': 'Each rank: +{0}% squad damage and health, up to +{1}%',
    'Следующая награда за славу': 'Next glory reward',
    'Открыто наград: {0} из {1}': 'Rewards unlocked: {0} of {1}',

    // --- края (CONVOY.levels, CONVOY.lands)
    'Тракт': 'Old Road', 'На тракт': 'To the Old Road', 'Вождь': 'Warchief',
    'Сумрачный лес': 'Gloomwood', 'В Сумрачный лес': 'To Gloomwood', 'Вожак стаи': 'Pack Leader',
    'Гнилые топи': 'Rotten Marsh', 'В Гнилые топи': 'To Rotten Marsh', 'Король-жаба': 'Toad King',
    'Горный перевал': 'Mountain Pass', 'На Горный перевал': 'To Mountain Pass', 'Горный великан': 'Mountain Giant',
    'Красные пески': 'Red Sands', 'В Красные пески': 'To Red Sands', 'Чёрный скорпион': 'Black Scorpion',
    'Ледяной перевал': 'Frost Pass', 'На Ледяной перевал': 'To Frost Pass', 'Ледяной великан': 'Frost Giant',
    'Огненные земли': 'Fire Lands', 'В Огненные земли': 'To Fire Lands', 'Огненный демон': 'Fire Demon',
    'Проклятые руины': 'Cursed Ruins', 'В Проклятые руины': 'To Cursed Ruins', 'Король-лич': 'Lich King',
    'волки бегут быстрее': 'wolves run faster',
    'жабы плюются ядом': 'toads spit venom',
    'голем оглушает ударом': 'golems stun on hit',
    'гноллы лечатся ударами': 'gnolls heal as they hit',
    'йети замедляют': 'yetis slow you down',
    'бесы поджигают': 'imps set things on fire',
    'скелеты встают снова': 'skeletons rise again',
    'Вой': 'Howl', 'Ядовитый плевок': 'Venom Spit', 'Валун': 'Boulder', 'Подкоп': 'Burrow',
    'Ледяное дыхание': 'Frost Breath', 'Огненный дождь': 'Fire Rain', 'Поднять мёртвых': 'Raise Dead',
    'Новый!': 'New!',
    '{0} — откроется {1}, {2}': '{0}: opens {1}, {2}',
    '{0} — доставь конвой: уровень {1}': '{0}: deliver the convoy on level {1}',

    // --- знаки и карты (CONVOY_TAGS, CONVOY_CARDS)
    'Толпа': 'Mob', 'Лук': 'Bow', 'Стража': 'Guard', 'Камень': 'Rock', 'Повозка': 'Wagon',
    'Сочетание': 'Combo',
    'Уже взято: {0}': 'Taken: {0}',
    'Ур. {0}': 'Lv {0}',
    'даром': 'free',
    'Закалка': 'Toughness', 'Острые клинки': 'Sharp Blades', 'Меткость': 'Sharp Aim',
    'Тяжёлая броня': 'Heavy Armor', 'Боевой молот': 'War Hammer',
    'Ремонт': 'Patch Up', 'Обшивка': 'Plating', 'Тяжёлые камни': 'Heavy Rocks',
    'Подкрепление': 'Reinforcements', 'Быстрая тетива': 'Quick String', 'Дешёвый набор': 'Cheap Gear',
    'Копейщики': 'Spearmen', 'Сильны против тяжёлых': 'Strong vs heavies',
    'Держат удар': 'Take hits', 'Бомба по толпе': 'Bombs the crowd',
    'Длинные пики': 'Long Pikes', 'Трофеи': 'Trophies', 'Щиты на борт': 'Side Shields',
    'Быстрый заряд': 'Quick Reload', 'Лавина': 'Avalanche', 'Боевой дух': 'Morale',
    'Двойной обвал': 'Double Fall', 'Военная казна': 'War Chest',
    'Ярость толпы': 'Mob Rage', 'Град стрел': 'Arrow Hail', 'Стена щитов': 'Shield Wall',
    'Камнелом': 'Rockbreaker', 'Золотая жила': 'Gold Vein', 'Баллиста': 'Ballista',
    '{gold}+110, в бою +1/с': '{gold}+110, +1/s in battle',
    '{gold}+150, в бою +2/с': '{gold}+150, +2/s in battle',
    '{cd}{0} → {1} с': '{cd}{0} → {1}s',
    '{gold}за врага {0} → {1}': '{gold}per foe {0} → {1}',
    '{hull}стрелы −30%': '{hull}arrows −30%',
    '{rock}шире, +6 камней': '{rock}wider, +6 rocks',
    '{dmg}+20% всему отряду': '{dmg}+20% whole squad',
    '{rock}бьёт дважды': '{rock}hits twice',
    '{dmg}+{0}% за бойца': '{dmg}+{0}% per fighter',
    '{cd}град стрел раз в {0} с': '{cd}arrow hail every {0}s',
    '{squad}урон по отряду −{0}%': '{squad}squad damage taken −{0}%',
    '{rock}оглушают и отбрасывают': '{rock}stun and knock back',
    '{gold}×{0} с {1}% врагов': '{gold}×{0} from {1}% of foes',
    '{cd}болт насквозь раз в {0} с': '{cd}piercing bolt every {0}s',

    // --- бой: надписи, всплывающие слова, подсказки
    'Последняя стоянка!': 'Final stop!',
    'Стоянка {0}': 'Stop {0}',
    'Стоянка {0} из {1}': 'Stop {0} of {1}',
    'Вожак!': 'Elite!',
    'Подмога!': 'Backup!',
    'Волна отбита!': 'Wave repelled!',
    'Новая эпоха!': 'New era!',
    'Второй шанс!': 'Second chance!',
    '{0} повержен!': '{0} defeated!',
    'Яд!': 'Poison!', 'Горит!': 'Burning!', 'Оглушён!': 'Stunned!', 'Холод!': 'Frozen!',
    '+жизнь': '+life', 'Встал!': 'Risen!',
    'Жила! +{0}': 'Vein! +{0}',
    'Против копий!': 'Vs spears!', 'Против стрел!': 'Vs arrows!', 'Против пехоты!': 'Vs infantry!',
    'Найми!': 'Hire!',
    'Защити повозки!': 'Protect the wagons!',
    'Помощь новичку': 'Beginner boost',
    'Тапни!': 'Tap!', 'Кликни!': 'Click!',
    'Готовим…': 'Loading…',
    'Реклама…': 'Ad…',
    'Реклама недоступна': 'Ad unavailable',
    'Слава ×2': 'Glory ×2',

    // --- итог похода
    'Тапни по толпе — камнепад': 'Tap a crowd: rockfall',
    'Кликни по толпе — камнепад': 'Click a crowd: rockfall',
    'Бойцы впереди, стрелки за ними': 'Fighters in front, archers behind',
    'Чини повозки между стоянками': 'Repair wagons between stops',
    'Врагов повержено': 'Foes defeated',
    'Золота добыто': 'Gold earned',
    'Лучшая серия': 'Best streak',
    'Новый рекорд!': 'New record!',
    'Открыт уровень {0}': 'Level {0} unlocked',
    'Уровень {0} — {1}': 'Level {0}: {1}',
    '{0} откроется {1}': '{0} opens {1}',
    'Совет': 'Tip',
    'Слава за поход': 'Glory this run',
    'Посмотреть рекламу — слава за поход ещё раз': 'Watch an ad to get this run’s glory again',
    'Открыто: {0}': 'Unlocked: {0}',
    '{0}-е место': '#{0}',

    // составное описание карты: «{squad}+2 · Держат удар» — каждая часть переводится сама
    '{0} · {1}': '{0} · {1}',
    // секунды: «12 с» (шаблоны с длинным текстом проверяются раньше)
    '{0} с': '{0}s',
  };

  const CYR = /[А-Яа-яЁё]/;
  const exact = new Map(), tpl = [];
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const [ru, en] of Object.entries(EN)) {
    if (!/\{\d\}/.test(ru)) { exact.set(ru, en); continue; }
    const re = new RegExp('^' + esc(ru).replace(/\\\{(\d)\\\}/g, '(.+?)') + '$');
    const order = [...ru.matchAll(/\{(\d)\}/g)].map(m => Number(m[1]));
    tpl.push({ re, order, en, fixed: ru.replace(/\{\d\}/g, '').length });
  }
  tpl.sort((a, b) => b.fixed - a.fixed);   // «Стоянка {0} из {1}» раньше «Стоянка {0}», «{0} с» — последним
  const num = (s) => s.replace(/(\d),(\d)/g, '$1.$2');
  const cache = new Map();
  let lang = 'ru';

  // Перевод строки на язык конвоя. Нет перевода — строка как есть (в журнале и тестах это видно).
  function t(s) {
    if (lang !== 'en' || typeof s !== 'string' || !s) return s;
    if (!CYR.test(s)) return num(s);
    if (exact.has(s)) return exact.get(s);
    if (cache.has(s)) return cache.get(s);
    let out = s;
    for (const T of tpl) {
      const m = s.match(T.re);
      if (!m) continue;
      const part = {};
      T.order.forEach((k, i) => { part[k] = m[i + 1]; });
      out = T.en.replace(/\{(\d)\}/g, (all, k) => { const v = part[k]; return v == null ? all : CYR.test(v) ? t(v) : num(v); });
      break;
    }
    cache.set(s, out);
    return out;
  }
  // Данные конвоя (CONVOY, CONVOY_TAGS, CONVOY_CARDS): переводим строковые поля на месте, раз при запуске.
  // Функции и геттеры не трогаем — описания карт переводятся при показе (Convoy.fmtDesc).
  function localizeData(obj, seen = new Set()) {
    if (lang !== 'en' || !obj || typeof obj !== 'object' || seen.has(obj)) return;
    seen.add(obj);
    for (const k of Object.keys(obj)) {
      const d = Object.getOwnPropertyDescriptor(obj, k);
      if (!d || !('value' in d)) continue;
      const v = d.value;
      if (typeof v === 'string') { if (CYR.test(v) || /\d,\d/.test(v)) obj[k] = t(v); }
      else if (v && typeof v === 'object') localizeData(v, seen);
    }
  }
  // Разметка index.html: текстовые узлы и подсказки (title, aria-label) с точным совпадением.
  // Элементы с data-i18n переводит I18N.applyToDOM родителя.
  function localizeDOM(root) {
    if (lang !== 'en' || !root) return;
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const raw = n.nodeValue, s = raw.trim();
      if (!s || !CYR.test(s)) continue;
      const v = t(s);
      if (v !== s) n.nodeValue = raw.replace(s, v);
    }
    for (const el of root.querySelectorAll('[title], [aria-label]')) {
      for (const a of ['title', 'aria-label']) {
        const v = el.getAttribute(a);
        if (v && CYR.test(v) && !el.hasAttribute('data-i18n-' + a)) el.setAttribute(a, t(v));
      }
    }
  }
  return {
    t, localizeData, localizeDOM,
    setLang(l) { lang = l === 'en' ? 'en' : 'ru'; cache.clear(); },
    get lang() { return lang; },
    get en() { return lang === 'en'; },
  };
})();
