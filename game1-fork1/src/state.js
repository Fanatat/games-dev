/* Состояние игрока P0 (ТЗ §13.2, SaveV1): прогресс историй, найденные слова, помощь,
   атлас, марки/лупы/опыт. Хранилище подаётся снаружи ({get, set}) — в браузере это
   Platform.storage, в тестах — объект в памяти. Без DOM. */
(function (root) {
  'use strict';

  var KEY = 'g1f1.save.v1';
  var GAME_ID = 'game1-fork1';
  var START_LOUPES = 4;
  var COST = { start: 1, path: 2 };
  var TUTORIAL_SEQUENTIAL = 3; // первые три улики первой истории — по очереди (ТЗ §4.1)
  var IDLE_CAP_MS = 120000;    // активное время: не больше 120 с без действий (ТЗ §14.1)
  /* Экономика круга 3 (план эксперта b009, круг 1): лупы редкие — их тратят на подсказки,
     а не копят; марки приходят чаще и тратятся на фонари и оформление атласа (ТЗ §8.2). */
  var BONUS_STAMPS = 2, BONUS_FULL = 25;           // бонусное слово — только марки; после 25-го в истории — по 1
  var NO_HINT_XP = 5;                              // история без «Начала», «Пути» и «Разбора»
  var GOLDEN_CHANCE = 0.2, GOLDEN = { loupes: 0, stamps: 20 }; // золотая марка: изредка за любую историю (вторая серия, круг 2: и с подсказками); только марки
  var GOLDEN_AT = [4, 8];                          // …и всегда на 5-й и 9-й истории главы (круг 5: награда растёт к концу главы)
  var GUESS = { loupes: 1, stamps: 15 };           // тайное слово угадано до последней буквы
  var PARCELS = { 4: { loupes: 1, stamps: 40 }, 12: { loupes: 1, stamps: 40 } }; // посылка хранителей: 5-я и 13-я истории
  var FINALE = { loupes: 2, stamps: 100 };         // финал главы (ТЗ §6.2)
  var CACHE_REWARD = { loupes: 1, stamps: 15 };
  /* Фонарь дорожает ступенькой (план эксперта №4, круг 1): 30, 35, 40… — марки всегда есть куда деть,
     а 8 фонарей за первые полчаса остаются по силам. */
  var LANTERN_COST = 30, LANTERN_STEP = 10, LANTERN_MAX = 70;
  var BONUS_DROP = 10;                             // каждые 10 бонусных слов — лупа (капля у значка лупы; круг 10: было 5)
  /* «Разобрать вместе» (ТЗ §4.3: «если люди застревают раньше, уменьшить его»): эксперт №6 видел застревания
     Новичка на 54–78 с при запертом разборе, поэтому 45 с вместо 90, а без луп — 30 с. */
  var EXPLAIN_MS = 45000, EXPLAIN_BROKE_MS = 30000;
  var TRIO = 3;                                    // каждые 3 истории — общий секрет маршрута (ТЗ §6.2)
  /* Вторая серия, круг 1 (план эксперта №6): слово — главная награда (+1 марка за букву), серия из трёх слов
     без ошибки и подсказки удваивает марки за слово, пока не ошибся; ошибка ничего не отнимает. */
  var WORD_STAMP = 1, STREAK_AT = 3, STREAK_MULT = 2;
  /* Сундук поля (вторая серия, круг 2, план эксперта №7, п. 1.5 и 4.9): деление за каждое слово улики, два — за любое
     бонус-слово; сундуки на 4, 9 и 15 делениях, внутри — случайный подарок, изредка большой. Редкое слово вне списка
     частых — +3 марки. Список частых слов (bonus_goal) остаётся подсказкой в листе бонус-слов. */
  var RARE_STAMPS = 3, CHESTS_AT = [4, 9, 15], CLUE_PTS = 1, BONUS_PTS = 2;
  var CHEST_POOL = [{ w: 0.30, stamps: 10 }, { w: 0.30, stamps: 15 }, { w: 0.15, loupes: 1 },
    { w: 0.15, stamps: 20, golden: true }, { w: 0.10, stamps: 25, loupes: 1, big: true }];
  /* Места городка растут в три ступени (план эксперта №7, п. 1.1): фонарь → окна → жители. Марки всегда есть куда деть. */
  var TIER_COST = { 2: 80, 3: 160 }, TIERS = 3;
  /* Лупа за марки (вторая серия, круг 3): у Нетерпеливого b022 0 луп при 700 марках — марки идут на подсказки. */
  var LOUPE_PRICE = 40;
  /* Новое для рук (план эксперта №7, п. 1.4), раз в несколько минут:
     с 5-й истории главы — клетки «под пылью»: буква не видна, пока рядом (или через неё) не пройдёт найденное слово;
     сметённая пыль — деление сундука. С 7-й — «спринт»: по кнопке 3 слова за 40 с, успел — сундук. */
  var DUST_POS = 4, DUST_N = { 1: 3, 2: 4 }, DUST_PTS = 1;
  var SPRINT_POS = 6, SPRINT = { words: 3, ms: 40000 };
  /* Награда растёт по маршруту (план эксперта №7, п. 1.3): марки за букву 1 → 1,5 → 2 с номером истории,
     опыт за историю растёт на 2 каждые 3 истории; каждая 3-я история — «большая»: марки и опыт за неё ×2. */
  var RATE_AT = [[10, 2], [4, 1.5], [0, 1]], XP_STEP = 2, BIG_EVERY = 3, BIG_MULT = 2;
  /* Лупам — дело (план эксперта №7, п. 1.2): с 4-й истории на вступлении можно пойти «золотым следом» —
     3 лупы, и марки за слова и за историю ×2. Только до первого слова, один раз за историю. */
  var GOLD_RUN = { cost: 3, from: 3, mult: 2 };
  /* Фонарь — выбор (п. 1.4): сам больше не загорается. Каждые 3 истории — бесплатный фонарь у одного из двух мест,
     у мест разные подарки. Бесплатные фонари не поднимают цену следующих. */
  var LAMP_GIFTS = [{ loupes: 1 }, { stamps: 25 }];
  // Звания каждые ~40–100 опыта, 12 штук (ТЗ §8.3); за звание — марки, не лупы.
  var RANKS = [
    { xp: 0, name: 'Новичок маршрута' }, { xp: 20, name: 'Следопыт' }, { xp: 45, name: 'Знаток улиц' },
    { xp: 75, name: 'Хранитель маршрута' }, { xp: 110, name: 'Картограф' }, { xp: 150, name: 'Старший картограф' },
    { xp: 200, name: 'Летописец Тихоречья' }, { xp: 260, name: 'Хранитель атласа' }, { xp: 330, name: 'Мастер улик' },
    { xp: 410, name: 'Почётный следопыт' }, { xp: 500, name: 'Голос Тихоречья' }, { xp: 600, name: 'Легенда маршрута' },
  ];
  var RANK_STAMPS = 10;
  // Оформление атласа: бумага по умолчанию; после 3-й истории — одна из двух обложек бесплатно
  // (не выбрал — на 4-й истории «Река» надевается сама), вторая за 50 марок.
  // Рамки выдаются сами за горящие фонари: 3 / 6 / 10 (план эксперта №4, круг 1: марки → фонари → рамка).
  var COVERS = [
    { id: 'paper', cost: 0 }, { id: 'river', cost: 0, pick: true }, { id: 'garden', cost: 0, pick: true },
    { id: 'copper', cost: 0, lamps: 3 }, { id: 'silver', cost: 0, lamps: 6 }, { id: 'gold', cost: 0, lamps: 10 },
    { id: 'ember', cost: 0, streak: 7 },
  ];
  var PICK_AFTER = 3, SECOND_PICK_COST = 50, AUTO_COVER = 'river';
  /* Дневник маршрута (план эксперта b009, круг 2): первая разгаданная история дня ставит штамп,
     пять штампов — страница. Пропуск дня ничего не отнимает: штампы не сгорают. */
  var DIARY = [{ stamps: 20 }, { loupes: 1 }, { stamps: 30 }, { loupes: 1 }, { cover: 'copper', stamps: 50 }];
  /* Улика дня (план эксперта №4, круг 2, п. 2.2): одна загадка на календарный день, общая для всех.
     Разгадал — лупа и штамп дневника; дни подряд — серия «🔥 N». Пропуск обнуляет серию, дневник не трогает. */
  var DAILY = { loupes: 1 };
  /* Серия дней — с наградой (жанр Ж10, оценка эксперта №7): 3-й день подряд — сундук, 7-й — рамка «Огонёк»
     (уже есть — большой сундук); дальше каждые 7 дней так же. Пропуск дня обнуляет только серию. */
  var STREAK_CHEST = 3, STREAK_COVER = 7, STREAK_BIG = { stamps: 50, loupes: 1 };
  var DAILY_EPOCH = '2026-01-01';
  var DAILY_DECOYS = 'АЕИОУКЛМНПРСТВДГ';
  function dayKey(t) {
    var d = new Date(t);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function daysBetween(a, b) {
    var p = function (k) { var x = k.split('-'); return Date.UTC(+x[0], x[1] - 1, +x[2]); };
    return Math.round((p(b) - p(a)) / 86400000);
  }
  function rankOf(xp) { var k = 0; RANKS.forEach(function (r, i) { if (xp >= r.xp) k = i; }); return k; }
  function seedOf() { return Math.random().toString(36).slice(2, 10); }
  // Стабильная «случайность»: один и тот же игрок и история — тот же исход, перезагрузка не перебрасывает.
  function chance(seed, id) {
    var h = 2166136261;
    var str = seed + ':' + id;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return (h % 10000) / 10000;
  }

  function blank(contentVersion) {
    return {
      schema_version: 1, revision: 0, game_id: GAME_ID, content_version: contentVersion,
      opened: false, traced: false,
      current: null,
      completed_story_ids: [], atlas_item_ids: [], seen_result_ids: [],
      wallet: { stamps: 0, loupes: START_LOUPES }, xp: 0,
      seed: seedOf(), bonus_total: 0, bonus_drop: 0, golden: 0, lanterns: [], secret: {}, guesses: {}, caches: [], parcels: [],
      streak: 0, lamps_free: 0, lamp_picks: 0, upgrades: {},
      cover: 'paper', covers: ['paper'], seen_new: [], finale: false, finales: [], finales_seen: [],
      diary: [], diary_pages: 0, last_day: null, visits: 0,
      daily: { last: null, streak: 0, best: 0, solved: 0 },
      free_demo: { start: true, path: true },
      settings: { sound: true, music: true, reduced_motion: false, large_text: false },
      updated_at: null,
    };
  }

  function create(content, storage, opts) {
    opts = opts || {};
    var now = opts.now || function () { return Date.now(); };
    var stories = content.stories;
    var byId = {};
    // Главы: номер истории внутри главы (s.pos) и сколько мест у главы в атласе.
    var chapters = content.chapters || [{ num: 1, slots: stories.length }];
    var perCh = {};
    stories.forEach(function (s, i) {
      s.index = i; byId[s.id] = s;
      s.chapter = s.chapter || 1;
      s.pos = perCh[s.chapter] = (perCh[s.chapter] === undefined ? 0 : perCh[s.chapter] + 1);
    });
    var data = null;
    var saveOk = true; // хранилище приняло запись; подтверждение облака ВК — Platform.sync
    var timer = null;
    var listeners = [];

    function parse(raw) {
      var d = null;
      if (raw) { try { d = JSON.parse(raw); } catch (e) { d = null; } }
      return d && d.game_id === GAME_ID && d.schema_version === 1 ? d : null;
    }
    function load() {
      var raw = null;
      try { raw = storage.get(KEY); } catch (e) { saveOk = false; }
      data = normalize(parse(raw) || blank(content.content_version));
    }
    function normalize(d) {
      var b = blank(content.content_version);
      // старые сохранения: кто уже нашёл слово, того протяжке заново не учим
      if (!('traced' in d)) d.traced = !!((d.completed_story_ids && d.completed_story_ids.length) || (d.current && d.current.found && Object.keys(d.current.found).length));
      if (!('finales_seen' in d)) d.finales_seen = (d.finales || []).slice(); // кто уже прошёл главу — финал не показываем заново
      for (var k in b) if (!(k in d)) d[k] = b[k];
      for (var s in b.settings) if (!(s in d.settings)) d.settings[s] = b.settings[s];
      // недоигранная история, которой нет в контенте, — начинаем заново
      if (d.current && !byId[d.current.story_id]) d.current = null;
      // глава пересобрана (новые сетки) — недоигранную историю начинаем заново, награды остаются
      if (d.current && d.current.content_version !== content.content_version) d.current = null;
      if (d.current && !d.current.bonus) d.current.bonus = [];
      if (d.current && !('chests' in d.current)) { d.current.chests = 0; d.current.word_stamps = 0; }
      if (d.current && !('pts' in d.current)) d.current.pts = 0;
      if (d.finale && d.finales.indexOf(1) < 0) d.finales.push(1);
      // рамки теперь за фонари: старым сохранениям выдаём заработанные
      COVERS.forEach(function (c) { if (c.lamps && d.lanterns.length >= c.lamps && d.covers.indexOf(c.id) < 0) d.covers.push(c.id); });
      return d;
    }
    // Вторая копия (облако ВК): берём её, только если она новее локальной.
    function adopt(raw) {
      var d = parse(raw);
      if (!d || (d.revision || 0) <= (data.revision || 0)) return false;
      clearTimeout(timer); timer = null;
      data = normalize(d);
      writeNow();
      return true;
    }

    function writeNow() {
      clearTimeout(timer); timer = null;
      data.revision++;
      data.updated_at = new Date(now()).toISOString();
      try { storage.set(KEY, JSON.stringify(data)); saveOk = true; }
      catch (e) { saveOk = false; }
      listeners.forEach(function (f) { f(saveOk); });
      return saveOk;
    }
    // ТЗ §13.2: объединять частые записи ≤ 500 мс
    function saveSoon() { if (!timer) timer = setTimeout(writeNow, 400); }
    function flush() { if (timer) writeNow(); }

    function story(id) { return byId[id]; }
    function cur() { return data.current; }
    function curStory() { return data.current ? byId[data.current.story_id] : null; }

    function chapter(num) { return chapters.filter(function (c) { return c.num === num; })[0] || { num: num, slots: perCh[num] + 1 }; }
    function chapterStories(num) { return stories.filter(function (s) { return s.chapter === num; }); }
    // Последняя опубликованная история главы; глава «полная», если опубликованы все её места.
    function isChapterEnd(s) { var nx = stories[s.index + 1]; return !nx || nx.chapter !== s.chapter; }
    function chapterFull(num) { return chapterStories(num).length >= chapter(num).slots; }
    function chapterGot(num) {
      return chapterStories(num).filter(function (s) { return data.atlas_item_ids.indexOf(s.reward.atlas_item_id) >= 0; }).length;
    }

    /* Дневник: что даст следующий штамп и стоит ли уже сегодняшний. */
    function diary() {
      var today = dayKey(now()), d = data.diary;
      var done = d.length > 0 && d[d.length - 1] === today;
      var k = d.length; // следующий штамп: сегодня, если ещё не стоит, иначе завтра
      if (k >= DIARY.length) k = 0;
      return { days: d.length, of: DIARY.length, today: done, next: k, gift: diaryGift(k), page: data.diary_pages };
    }
    function diaryGift(k) {
      var g = DIARY[k];
      if (g.cover && data.covers.indexOf(g.cover) >= 0) return { stamps: g.stamps };
      return g.cover ? { cover: g.cover } : { stamps: g.stamps || 0, loupes: g.loupes || 0 };
    }
    function diaryStamp() {
      var today = dayKey(now()), d = data.diary;
      if (d.length && d[d.length - 1] === today) return null;
      if (d.length >= DIARY.length) { data.diary = d = []; data.diary_pages++; }
      var g = diaryGift(d.length);
      d.push(today);
      if (g.cover) data.covers.push(g.cover);
      return { day: d.length, of: DIARY.length, stamps: g.stamps || 0, loupes: g.loupes || 0, cover: g.cover || null };
    }
    function dailyOf(key) {
      var list = content.daily || [];
      if (!list.length) return null;
      var n = daysBetween(DAILY_EPOCH, key), i = ((n % list.length) + list.length) % list.length;
      return list[i];
    }
    function dailyTiles(answer, key) {
      var letters = answer.split(''), pool = DAILY_DECOYS.split('').filter(function (ch) { return answer.indexOf(ch) < 0; });
      var k = answer.length <= 4 ? 2 : 3;
      for (var j = 0; j < k; j++) letters.push(pool[Math.floor(chance(key, 'd' + j) * pool.length)]);
      return letters.map(function (ch, i) { return { ch: ch, r: chance(key, 't' + i) }; })
        .sort(function (a, b) { return a.r - b.r; }).map(function (x) { return x.ch; });
    }
    function streakGiftKind(n) { var k = n % STREAK_COVER; return k === 0 && n ? 'cover' : k === STREAK_CHEST ? 'chest' : null; }
    // Ближайший подарок серии: через сколько разгаданных дней (0 — сегодняшняя разгадка) и какой.
    function streakNext(after) { for (var m = after; m < after + STREAK_COVER + 1; m++) { var k = streakGiftKind(m); if (k) return { in: m - after, kind: k, at: m }; } return null; }
    function streakGift(n, day) {
      var k = streakGiftKind(n);
      if (!k) return null;
      if (k === 'cover' && data.covers.indexOf('ember') < 0) { data.covers.push('ember'); return { kind: 'cover', cover: 'ember', stamps: 0, loupes: 0, day: n }; }
      if (k === 'cover') { data.wallet.stamps += STREAK_BIG.stamps; data.wallet.loupes += STREAK_BIG.loupes; return { kind: 'chest', big: true, streak_big: true, stamps: STREAK_BIG.stamps, loupes: STREAK_BIG.loupes, day: n }; }
      var r = chance(data.seed, 'streak:' + day), acc = 0, g = CHEST_POOL[0];
      for (var i = 0; i < CHEST_POOL.length; i++) { acc += CHEST_POOL[i].w; if (r < acc) { g = CHEST_POOL[i]; break; } }
      data.wallet.stamps += g.stamps || 0; data.wallet.loupes += g.loupes || 0;
      if (g.golden) data.golden++;
      return { kind: 'chest', big: !!g.big, golden: !!g.golden, stamps: g.stamps || 0, loupes: g.loupes || 0, day: n };
    }
    function daily() {
      var today = dayKey(now()), d = data.daily, c = dailyOf(today);
      if (!c) return null;
      var done = d.last === today, alive = done || (!!d.last && daysBetween(d.last, today) === 1);
      return { day: today, clue: c.clue, answer: c.answer, done: done, streak: alive ? d.streak : 0, lost: !alive && d.streak > 0,
        best: d.best, solved: d.solved, tiles: dailyTiles(c.answer, today), loupes: DAILY.loupes,
        misses: d.miss_day === today ? d.miss || 0 : 0,
        next: streakNext(done ? d.streak + 1 : (alive ? d.streak : 0) + 1), ember: data.covers.indexOf('ember') >= 0 };
    }
    function dailySolve(word) {
      var x = daily();
      if (!x || x.done) return { ok: false, done: !!x };
      var d = data.daily;
      if (word !== x.answer) {
        // промахи за сегодня — для карточки «Поделиться» (план эксперта №5, п. 2.2)
        if (d.miss_day !== x.day) { d.miss_day = x.day; d.miss = 0; }
        d.miss++; writeNow();
        return { ok: false };
      }
      d.streak = d.last && daysBetween(d.last, x.day) === 1 ? d.streak + 1 : 1;
      d.best = Math.max(d.best, d.streak); d.last = x.day; d.solved++;
      data.wallet.loupes += DAILY.loupes;
      var dy = diaryStamp();
      if (dy) { data.wallet.stamps += dy.stamps; data.wallet.loupes += dy.loupes; }
      var sg = streakGift(d.streak, x.day);
      writeNow();
      return { ok: true, streak: d.streak, loupes: DAILY.loupes, diary: dy, gift: sg };
    }
    function lastLearned() {
      var ids = data.completed_story_ids, s = ids.length ? byId[ids[ids.length - 1]] : null;
      if (!s) return null;
      return { story: s, question: isChapterEnd(s) ? chapter(s.chapter).end && chapter(s.chapter).end.question || s.next_question : s.next_question };
    }
    // Заход в игру: «с возвращением», если был другой день. Вызывается один раз при запуске.
    function visit() {
      var today = dayKey(now()), prev = data.last_day;
      var r = { first: !prev, back: !!prev && prev !== today, away: prev ? daysBetween(prev, today) : 0 };
      if (prev !== today) { data.last_day = today; data.visits++; writeNow(); }
      return r;
    }

    function nextStoryId() {
      for (var i = 0; i < stories.length; i++) if (data.completed_story_ids.indexOf(stories[i].id) < 0) return stories[i].id;
      return null;
    }

    function startStory(id) {
      var s = byId[id];
      if (!s) throw new Error('нет истории ' + id);
      if (data.current && data.current.story_id === id) return data.current;
      data.current = { story_id: id, content_version: content.content_version, found: {}, selected_clue_id: s.clues[0].id,
        active_ms_by_clue: {}, hints: {}, bonus: [], chests: 0, word_stamps: 0, started_at: new Date(now()).toISOString() };
      writeNow();
      return data.current;
    }

    function isFound(clueId) { return !!(data.current && data.current.found[clueId]); }
    function foundCount() { return data.current ? Object.keys(data.current.found).length : 0; }

    // Открыта ли улика: в первой истории первые три — по очереди, остальные после третьей.
    function isOpen(clueId) {
      var s = curStory();
      if (!s) return false;
      var idx = -1;
      s.clues.forEach(function (c, i) { if (c.id === clueId) idx = i; });
      if (idx < 0) return false;
      if (s.index !== 0) return true;
      var lim = Math.min(TUTORIAL_SEQUENTIAL, s.clues.length);
      for (var i = 0; i < lim; i++) {
        if (i === idx) return true;
        if (!isFound(s.clues[i].id)) return false;
      }
      return true;
    }
    function openClues() {
      var s = curStory();
      return s ? s.clues.filter(function (c) { return isOpen(c.id) && !isFound(c.id); }) : [];
    }
    function firstUnfound() {
      var s = curStory();
      if (!s) return null;
      for (var i = 0; i < s.clues.length; i++) if (!isFound(s.clues[i].id) && isOpen(s.clues[i].id)) return s.clues[i].id;
      return null;
    }

    function select(clueId) {
      if (!data.current || !isOpen(clueId)) return false;
      data.current.selected_clue_id = clueId;
      saveSoon();
      return true;
    }

    // Найдено слово (путь в порядке ответа). Возвращает {already, complete, secret}.
    function found(clueId, path) {
      var c = data.current;
      if (!c) return null;
      if (c.found[clueId]) return { already: true, complete: foundCount() === curStory().clues.length };
      c.found[clueId] = path;
      var h = c.hints[clueId], helped = !!(h && (h.start || h.path || h.explain));
      data.streak = helped ? 0 : (data.streak || 0) + 1;
      var mult = data.streak >= STREAK_AT ? STREAK_MULT : 1;
      var clue = curStory().clues.filter(function (x) { return x.id === clueId; })[0];
      var stamps = Math.round(clue.answer.length * WORD_STAMP * wordRate(curStory())) * mult * (c.gold ? GOLD_RUN.mult : 1);
      data.wallet.stamps += stamps;
      c.word_stamps = (c.word_stamps || 0) + stamps;
      var chest = addPts(CLUE_PTS);
      var complete = foundCount() === curStory().clues.length;
      if (!complete && (c.selected_clue_id === clueId || isFound(c.selected_clue_id))) c.selected_clue_id = firstUnfound();
      // золотая буква тайного слова главы лежит в этом ответе
      var sec = curStory().secret, letter = null, sk = sec && secretKey(curStory().chapter, sec.pos);
      if (sec && sec.clue_id === clueId && !data.secret[sk]) { data.secret[sk] = sec.letter; letter = sec.letter; }
      writeNow(); // каждое найденное слово — сразу на диск (A06)
      return { already: false, complete: complete, secret: letter, stamps: stamps, streak: data.streak, mult: mult,
        series: !helped && data.streak === STREAK_AT, chest: chest };
    }
    // Неверное слово: серия кончается. Возвращает true, если шла серия ×2.
    function miss() {
      var had = (data.streak || 0) >= STREAK_AT;
      if (data.streak) { data.streak = 0; saveSoon(); }
      return had;
    }
    function streak() { return { count: data.streak || 0, on: (data.streak || 0) >= STREAK_AT, mult: STREAK_MULT, at: STREAK_AT }; }

    /* Бонусное слово: настоящее слово поля, не ответ. +2 марки, после 25-го в истории +1
       (круг 5: награды за истории растут, а рамкам атласа нужно остаться целью). Возвращает {ok, repeat, count, stamps} или null, если слова нет в списке истории. */
    function bonusWord(word) {
      var c = data.current, s = curStory();
      if (!c || !s || !s.bonus || s.bonus.indexOf(word) < 0) return null;
      if (c.bonus.indexOf(word) >= 0) return { ok: false, repeat: true, count: c.bonus.length };
      c.bonus.push(word);
      data.bonus_total++;
      var goal = s.bonus_goal || [], common = goal.indexOf(word) >= 0;
      var got = c.bonus.length > BONUS_FULL ? 1 : common ? BONUS_STAMPS : RARE_STAMPS;
      data.wallet.stamps += got;
      var g = goalCount(), chest = addPts(BONUS_PTS);
      data.bonus_drop = (data.bonus_drop || 0) + 1;
      var loupe = data.bonus_drop >= BONUS_DROP;
      if (loupe) { data.bonus_drop = 0; data.wallet.loupes++; }
      writeNow();
      return { ok: true, repeat: false, count: c.bonus.length, stamps: got, loupe: loupe, drop: data.bonus_drop,
        rare: !common, goal: g, of: goal.length, chest: chest, pts: c.pts };
    }
    // Деления сундука поля; перешли порог — сундук со случайным подарком (стабильно для игрока и истории).
    function addPts(n) {
      var c = data.current, before = c.pts || 0;
      c.pts = before + n;
      if (!CHESTS_AT.some(function (x) { return x > before && x <= c.pts; })) return null;
      c.chests = (c.chests || 0) + 1;
      var r = chance(data.seed, c.story_id + ':chest' + c.chests), acc = 0, gift = CHEST_POOL[CHEST_POOL.length - 1];
      for (var i = 0; i < CHEST_POOL.length; i++) { acc += CHEST_POOL[i].w; if (r < acc) { gift = CHEST_POOL[i]; break; } }
      var chest = { stamps: gift.stamps || 0, loupes: gift.loupes || 0, golden: !!gift.golden, big: !!gift.big, n: c.chests };
      data.wallet.stamps += chest.stamps; data.wallet.loupes += chest.loupes;
      if (chest.golden) data.golden++;
      return chest;
    }
    /* Клетки под пылью: стабильно для истории (не для игрока), только на путях улик, не первая буква,
       не золотая клетка, не на пути тайника, на одной улике — не больше одной, у первых двух улик — нет. */
    function dustOf(s) {
      if (!s || (s.chapter === 1 && s.pos < DUST_POS)) return [];
      var ban = {}, out = [], cand = [];
      if (s.secret && s.secret.cell) ban[s.secret.cell.join(',')] = 1;
      if (s.cache) s.cache.path.forEach(function (p) { ban[p.join(',')] = 1; });
      s.clues.forEach(function (c, i) {
        if (i < 2) { c.path.forEach(function (p) { ban[p.join(',')] = 1; }); return; }
        var opts = c.path.slice(1).filter(function (p) { return !ban[p.join(',')]; });
        if (opts.length) cand.push({ i: i, opts: opts });
      });
      cand.sort(function (a, b) { return chance('dust', s.id + ':' + a.i) - chance('dust', s.id + ':' + b.i); });
      cand.forEach(function (x) {
        if (out.length >= (DUST_N[s.chapter] || 4)) return;
        var p = x.opts[Math.floor(chance('dust', s.id + ':c' + x.i) * x.opts.length)], k = p.join(',');
        if (!ban[k]) { out.push(p); ban[k] = 1; }
      });
      return out;
    }
    function dustLeft() {
      var c = data.current, s = curStory();
      if (!c || !s) return [];
      var gone = c.dust || [];
      return dustOf(s).filter(function (p) { return gone.indexOf(p.join(',')) < 0; });
    }
    // Найденное слово сметает пыль на своём пути и в соседних клетках. Возвращает {cells, chest} или null.
    function sweepDust(path) {
      var c = data.current, left = dustLeft();
      if (!c || !left.length || !path) return null;
      var hit = left.filter(function (d) {
        return path.some(function (p) { return Math.abs(p[0] - d[0]) + Math.abs(p[1] - d[1]) <= 1; });
      });
      if (!hit.length) return null;
      c.dust = (c.dust || []).concat(hit.map(function (p) { return p.join(','); }));
      var chest = addPts(DUST_PTS * hit.length);
      writeNow();
      return { cells: hit, chest: chest, left: left.length - hit.length };
    }
    // Спринт: один раз за историю, с 7-й истории главы 1 и во всех следующих главах.
    function sprintAvail() {
      var c = data.current, s = curStory();
      return !!(c && s && !c.sprint && !(s.chapter === 1 && s.pos < SPRINT_POS) && foundCount() < s.clues.length);
    }
    function sprintStart() {
      if (!sprintAvail()) return null;
      data.current.sprint = 'on';
      saveSoon();
      return { words: SPRINT.words, ms: SPRINT.ms };
    }
    // Итог спринта: won — сундук из того же набора подарков, что у сундука поля; не успел — ничего не отнимаем.
    function sprintEnd(won) {
      var c = data.current;
      if (!c || c.sprint !== 'on') return null;
      c.sprint = won ? 'won' : 'lost';
      var chest = null;
      if (won) {
        var r = chance(data.seed, c.story_id + ':sprint'), acc = 0, gift = CHEST_POOL[CHEST_POOL.length - 1];
        for (var i = 0; i < CHEST_POOL.length; i++) { acc += CHEST_POOL[i].w; if (r < acc) { gift = CHEST_POOL[i]; break; } }
        chest = { stamps: gift.stamps || 0, loupes: gift.loupes || 0, golden: !!gift.golden, big: !!gift.big, n: 0, sprint: true };
        data.wallet.stamps += chest.stamps; data.wallet.loupes += chest.loupes;
        if (chest.golden) data.golden++;
      }
      writeNow();
      return { won: !!won, chest: chest };
    }
    function wordRate(s) { for (var i = 0; i < RATE_AT.length; i++) if (s.index >= RATE_AT[i][0]) return RATE_AT[i][1]; return 1; }
    function isBig(s) { return !!s && s.index % BIG_EVERY === BIG_EVERY - 1; }
    // Марки и опыт за историю (без бонусов): с ростом по маршруту и ×2 у большой.
    function storyPay(s) {
      var m = isBig(s) ? BIG_MULT : 1;
      return { stamps: s.reward.first_completion_stamps * m, xp: (s.reward.first_completion_xp + XP_STEP * Math.floor(s.index / BIG_EVERY)) * m,
        big: isBig(s), rate: wordRate(s) };
    }
    function goldAvail(id) {
      var s = byId[id], c = data.current;
      if (!s || s.index < GOLD_RUN.from || data.completed_story_ids.indexOf(id) >= 0 || data.wallet.loupes < GOLD_RUN.cost) return false;
      return !c || c.story_id !== id || (!c.gold && foundCount() === 0);
    }
    // Вызывать после startStory: снимает лупы и включает ×2 для текущей истории.
    function goldStart() {
      var c = data.current;
      if (!c || !goldAvail(c.story_id)) return null;
      data.wallet.loupes -= GOLD_RUN.cost;
      c.gold = true;
      writeNow();
      return { cost: GOLD_RUN.cost, mult: GOLD_RUN.mult };
    }
    function goalCount() {
      var c = data.current, s = curStory();
      if (!c || !s) return 0;
      var goal = s.bonus_goal || [];
      return c.bonus.filter(function (w) { return goal.indexOf(w) >= 0; }).length;
    }
    // Сундук поля: pts — деления, next — следующий сундук (null — все открыты); got / of — частые бонус-слова.
    function bonusGoal() {
      var s = curStory(), n = s && s.bonus_goal ? s.bonus_goal.length : 0, pts = (data.current && data.current.pts) || 0;
      return { got: goalCount(), of: n, pts: pts, chests: CHESTS_AT.slice(), next: CHESTS_AT.filter(function (x) { return x > pts; })[0] || null };
    }
    // Тайник: слово без улики. Награда один раз на историю.
    function cacheFound() {
      var s = curStory();
      if (!s || !s.cache || data.caches.indexOf(s.id) >= 0) return null;
      data.caches.push(s.id);
      data.wallet.loupes += CACHE_REWARD.loupes;
      data.wallet.stamps += CACHE_REWARD.stamps;
      writeNow();
      return { loupes: CACHE_REWARD.loupes, stamps: CACHE_REWARD.stamps };
    }
    function cacheDone(id) { return data.caches.indexOf(id) >= 0; }
    function buyLoupe() {
      if (data.wallet.stamps < LOUPE_PRICE) return null;
      data.wallet.stamps -= LOUPE_PRICE;
      data.wallet.loupes += 1;
      writeNow();
      return { loupes: 1, cost: LOUPE_PRICE };
    }

    // Фонари Тихоречья: за марки зажигается фонарь у пройденного места (видно на картинке городка).
    // фонарь дорожает на 10 за каждый купленный, но не дороже окон: ступени места идут по цене вверх (план №7, п. 1.1)
    function lanternCost() { return Math.min(LANTERN_MAX, LANTERN_COST + LANTERN_STEP * Math.max(0, data.lanterns.length - (data.lamps_free || 0))); }
    function canLight(id) {
      return data.completed_story_ids.indexOf(id) >= 0 && data.lanterns.indexOf(id) < 0 && data.wallet.stamps >= lanternCost();
    }
    // Зажечь фонарь. Возвращает {cost, frame}: frame — рамка атласа, которую фонарь только что принёс (и сразу надел).
    function light(id) {
      if (!canLight(id)) return null;
      var cost = lanternCost();
      data.wallet.stamps -= cost;
      data.lanterns.push(id);
      var frame = lampFrame();
      writeNow();
      return { cost: cost, frame: frame };
    }
    /* Ступени места: 0 — темно, 1 — фонарь, 2 — окна, 3 — жители. */
    function tierOf(id) { return data.upgrades[id] || (data.lanterns.indexOf(id) >= 0 ? 1 : 0); }
    function tierCost(id) { var t = tierOf(id); return t === 0 ? lanternCost() : TIER_COST[t + 1] || null; }
    function canUpgrade(id) {
      var t = tierOf(id), cost = tierCost(id);
      return data.completed_story_ids.indexOf(id) >= 0 && t < TIERS && data.wallet.stamps >= cost;
    }
    // Следующая ступень места. Возвращает {tier, cost, frame} или null.
    function upgrade(id) {
      var t = tierOf(id);
      if (t === 0) { var r = light(id); return r && { tier: 1, cost: r.cost, frame: r.frame }; }
      if (!canUpgrade(id)) return null;
      var cost = tierCost(id);
      data.wallet.stamps -= cost;
      data.upgrades[id] = t + 1;
      writeNow();
      return { tier: t + 1, cost: cost, frame: null };
    }
    // Ближайшая цель городка: самая дешёвая следующая ступень среди пройденных мест (при равной цене — свежее место).
    function nextUpgrade() {
      var best = null;
      data.completed_story_ids.slice().reverse().forEach(function (id) {
        var t = tierOf(id);
        if (t >= TIERS) return;
        var cost = tierCost(id);
        if (!best || cost < best.cost) best = { id: id, tier: t + 1, cost: cost, have: data.wallet.stamps, can: data.wallet.stamps >= cost };
      });
      return best;
    }
    function lampFrame() {
      var frame = null;
      COVERS.forEach(function (c) {
        if (c.lamps && data.lanterns.length >= c.lamps && data.covers.indexOf(c.id) < 0) { data.covers.push(c.id); frame = c.id; }
      });
      if (frame) data.cover = frame;
      return frame;
    }
    /* Бесплатный фонарь раз в 3 истории: два ещё тёмных пройденных места (сначала свежее), у каждого свой подарок.
       Не выбрал — предложение ждёт до следующего итога. */
    function lampOffer() {
      if (trioCount() <= (data.lamp_picks || 0)) return null;
      var dark = data.completed_story_ids.filter(function (id) { return data.lanterns.indexOf(id) < 0; }).reverse().slice(0, 2);
      if (!dark.length) return null;
      var k = data.lamp_picks || 0;
      return { trio: k + 1, places: dark.map(function (id, i) {
        var g = LAMP_GIFTS[(i + k) % LAMP_GIFTS.length];
        return { id: id, gift: { loupes: g.loupes || 0, stamps: g.stamps ? g.stamps + 5 * k : 0 } };
      }) };
    }
    function pickLamp(id) {
      var o = lampOffer(), p = o && o.places.filter(function (x) { return x.id === id; })[0];
      if (!p) return null;
      data.lanterns.push(id);
      data.lamps_free = (data.lamps_free || 0) + 1;
      data.lamp_picks = (data.lamp_picks || 0) + 1;
      data.wallet.loupes += p.gift.loupes; data.wallet.stamps += p.gift.stamps;
      var frame = lampFrame();
      writeNow();
      return { gift: p.gift, frame: frame, trio: o.trio };
    }
    // Ближайшая рамка за фонари: {id, lamps, have} или null, если все получены.
    function nextFrame() {
      var c = COVERS.filter(function (x) { return x.lamps && data.covers.indexOf(x.id) < 0; })[0];
      return c ? { id: c.id, lamps: c.lamps, have: data.lanterns.length } : null;
    }
    function rank() {
      var k = rankOf(data.xp), nx = RANKS[k + 1] || null;
      return { index: k, name: RANKS[k].name, xp: data.xp, from: RANKS[k].xp, next: nx, count: RANKS.length };
    }

    /* Оформление атласа. Возвращает список с состоянием каждого варианта. */
    function pickedFree() { return data.covers.some(function (id) { return COVERS.some(function (c) { return c.id === id && c.pick; }); }); }
    function coverPrice(id) {
      var c = COVERS.filter(function (x) { return x.id === id; })[0];
      if (!c) return null;
      if (c.pick) return pickedFree() ? SECOND_PICK_COST : 0;
      return c.cost;
    }
    function covers() {
      var open = data.completed_story_ids.length >= PICK_AFTER;
      return COVERS.map(function (c) {
        var own = data.covers.indexOf(c.id) >= 0, price = coverPrice(c.id);
        if (c.lamps) return { id: c.id, own: own, on: data.cover === c.id, price: 0, lamps: c.lamps, locked: !own, can: own };
        if (c.streak) return { id: c.id, own: own, on: data.cover === c.id, price: 0, streak: c.streak, locked: !own, can: own };
        return { id: c.id, own: own, on: data.cover === c.id, price: own ? 0 : price, locked: !own && !open,
          can: own || (open && data.wallet.stamps >= price) };
      });
    }
    function canPickCover() { return data.completed_story_ids.length >= PICK_AFTER && !pickedFree(); }
    // Купить (если ещё нет) и надеть. Возвращает {ok, price} или null.
    function setCover(id) {
      var c = covers().filter(function (x) { return x.id === id; })[0];
      if (!c || !c.can) return null;
      var price = c.own ? 0 : c.price;
      if (!c.own) { data.wallet.stamps -= price; data.covers.push(id); }
      data.cover = id;
      writeNow();
      return { ok: true, price: price, bought: !c.own };
    }
    // Разовые знакомства с механикой (ТЗ: «новое» по ходу игры, а не только по номеру истории).
    function markNew(id) { if (data.seen_new.indexOf(id) >= 0) return false; data.seen_new.push(id); saveSoon(); return true; }
    function seenNew(id) { return data.seen_new.indexOf(id) >= 0; }
    function trioCount() { return Math.floor(data.completed_story_ids.length / TRIO); }

    /* Завершение истории: награда атомарно вместе с отметкой первого прохождения (ТЗ §9.1).
       Повторный вызов ничего не начисляет. */
    function complete() {
      var s = curStory();
      if (!s || foundCount() !== s.clues.length) return null;
      var first = data.completed_story_ids.indexOf(s.id) < 0;
      var reward = { stamps: 0, xp: 0, item: null, first: first, loupes: 0, no_hints: false, golden: false,
        parcel: null, rank: null, trio: 0, cover: null, finale: null, diary: null, bonus: data.current.bonus.length,
        words: data.current.word_stamps || 0, chests: data.current.chests || 0 };
      if (first) {
        data.completed_story_ids.push(s.id);
        var h = data.current.hints, used = false;
        Object.keys(h).forEach(function (k) { if (h[k].start || h[k].path || h[k].explain) used = true; });
        var rankBefore = rankOf(data.xp);
        var pay = storyPay(s);
        reward.stamps = reward.base = pay.stamps;
        reward.xp = pay.xp;
        reward.big = pay.big;
        if (data.current.gold) { reward.stamps = reward.base = pay.stamps * GOLD_RUN.mult; reward.gold_run = true; }
        if (!used) { reward.no_hints = true; reward.xp += NO_HINT_XP; }
        // «Ещё улика» бесплатна и опыта не отнимает, но значок «без подсказок» за такую историю не показываем (п. 4.2)
        reward.extra = Object.keys(h).some(function (k) { return h[k].extra; });
        if (GOLDEN_AT.indexOf(s.pos) >= 0 || chance(data.seed, s.id) < GOLDEN_CHANCE) {
          reward.golden = true; reward.loupes += GOLDEN.loupes; reward.stamps += GOLDEN.stamps; data.golden++;
        }
        var pc = PARCELS[s.index];
        if (pc && data.parcels.indexOf(s.id) < 0) {
          data.parcels.push(s.id);
          reward.parcel = { loupes: pc.loupes, stamps: pc.stamps };
          reward.loupes += pc.loupes; reward.stamps += pc.stamps;
        }
        if (isChapterEnd(s) && chapterFull(s.chapter) && data.finales.indexOf(s.chapter) < 0) {
          data.finales.push(s.chapter);
          if (s.chapter === 1) data.finale = true;
          reward.finale = { loupes: FINALE.loupes, stamps: FINALE.stamps };
          reward.loupes += FINALE.loupes; reward.stamps += FINALE.stamps;
        }
        // обложку так и не выбрали — после 4-й истории она надевается сама
        if (data.completed_story_ids.length > PICK_AFTER && !pickedFree()) {
          data.covers.push(AUTO_COVER);
          if (data.cover === 'paper') data.cover = AUTO_COVER;
          reward.cover = AUTO_COVER;
        }
        if (data.completed_story_ids.length % TRIO === 0) reward.trio = data.completed_story_ids.length / TRIO;
        var dy = diaryStamp();
        if (dy) { reward.diary = dy; reward.stamps += dy.stamps; reward.loupes += dy.loupes; }
        data.xp += reward.xp;
        var rankAfter = rankOf(data.xp);
        if (rankAfter > rankBefore) {
          var add = (rankAfter - rankBefore) * RANK_STAMPS;
          reward.rank = { name: RANKS[rankAfter].name, stamps: add };
          reward.stamps += add;
        }
        data.wallet.stamps += reward.stamps;
        data.wallet.loupes += reward.loupes;
        if (data.atlas_item_ids.indexOf(s.reward.atlas_item_id) < 0) {
          data.atlas_item_ids.push(s.reward.atlas_item_id);
          reward.item = s.reward.atlas_item_id;
        }
      }
      data.current = null;
      writeNow();
      return reward;
    }

    /* Тайное слово главы: у главы 1 буквы лежат под номерами 0…5 (старые сохранения), у следующих — «2:0»… */
    function secretKey(ch, pos) { return ch === 1 ? String(pos) : ch + ':' + pos; }
    function secretOf(ch) {
      var c = chapter(ch), w = c.secret_word || (ch === 1 ? content.secret_word : null);
      if (!w) return null;
      var got = {}, n = 0;
      for (var i = 0; i < w.length; i++) { var l = data.secret[secretKey(ch, i)]; if (l) { got[i] = l; n++; } }
      return { word: w, title: c.secret_title || content.secret_title || 'Тайное слово', got: got, count: n, full: n === w.length, guess: data.guesses[ch] || null };
    }
    /* Угадать тайное слово раньше последней буквы: одна попытка, верно — лупа и марки. */
    function canGuess(ch) {
      var sw = secretOf(ch);
      return !!sw && sw.count === sw.word.length - 1 && !data.guesses[ch];
    }
    function guess(ch, word) {
      if (!canGuess(ch)) return null;
      var sw = secretOf(ch), ok = word === sw.word;
      data.guesses[ch] = ok ? 'ok' : 'no';
      var r = { ok: ok, loupes: 0, stamps: 0 };
      if (ok) { r.loupes = GUESS.loupes; r.stamps = GUESS.stamps; data.wallet.loupes += r.loupes; data.wallet.stamps += r.stamps; }
      writeNow();
      return r;
    }

    function hintState(clueId) {
      var c = data.current;
      if (!c) return {};
      return c.hints[clueId] || (c.hints[clueId] = {});
    }
    // Цена помощи сейчас: 0, если это первая демонстрация или уже куплено для этой улики.
    function hintPrice(type, clueId) {
      if (type === 'extra' || type === 'explain') return 0;
      var h = hintState(clueId);
      if (h[type]) return 0;
      if (data.free_demo[type]) return 0;
      return COST[type];
    }
    /* Использовать помощь. type: extra | start | path | explain.
       Возвращает {ok, price} или {ok:false, reason}. */
    function useHint(type, clueId, activeMs) {
      if (!data.current || isFound(clueId)) return { ok: false, reason: 'found' };
      var h = hintState(clueId);
      if (type === 'explain' && (activeMs || 0) < explainAfter(clueId)) return { ok: false, reason: 'early' };
      var price = hintPrice(type, clueId);
      if (price > data.wallet.loupes) return { ok: false, reason: 'loupes', price: price };
      var wasFreeDemo = !h[type] && data.free_demo[type] && price === 0 && COST[type];
      data.wallet.loupes -= price;
      if (wasFreeDemo) data.free_demo[type] = false;
      h[type] = true;
      writeNow();
      return { ok: true, price: price, free_demo: !!wasFreeDemo };
    }
    function explainAfter(clueId) {
      var s = curStory();
      var c = s && s.clues.filter(function (x) { return x.id === clueId; })[0];
      var ms = Math.min((c && c.explain_ms) || EXPLAIN_MS, EXPLAIN_MS);
      return data.wallet.loupes > 0 ? ms : Math.min(ms, EXPLAIN_BROKE_MS);
    }

    function activeMs(clueId) { return (data.current && data.current.active_ms_by_clue[clueId]) || 0; }
    function addActive(clueId, ms) {
      if (!data.current || !clueId || ms <= 0) return 0;
      ms = Math.min(ms, IDLE_CAP_MS);
      var m = data.current.active_ms_by_clue;
      m[clueId] = (m[clueId] || 0) + ms;
      saveSoon();
      return m[clueId];
    }

    function setSetting(k, v) { data.settings[k] = v; writeNow(); }
    function markOpened() { if (!data.opened) { data.opened = true; writeNow(); } }
    function markTraced() { if (!data.traced) { data.traced = true; saveSoon(); } }
    // Финал главы, который начислен, но ещё не показан (нажали «На сегодня всё» на итоге 10-й истории; п. 4.8).
    function finaleUnseen() { return data.finales.filter(function (n) { return data.finales_seen.indexOf(n) < 0; })[0] || null; }
    function markFinaleSeen(n) { if (data.finales_seen.indexOf(n) < 0) { data.finales_seen.push(n); saveSoon(); } }
    function markResultSeen(id) { if (data.seen_result_ids.indexOf(id) < 0) { data.seen_result_ids.push(id); saveSoon(); } }
    function reset() { data = blank(content.content_version); writeNow(); }

    load();
    return {
      KEY: KEY, COST: COST, RANKS: RANKS, LANTERN_COST: LANTERN_COST, LANTERN_STEP: LANTERN_STEP, BONUS_DROP: BONUS_DROP, EXPLAIN_MS: EXPLAIN_MS, EXPLAIN_BROKE_MS: EXPLAIN_BROKE_MS, GOLDEN: GOLDEN, BONUS_STAMPS: BONUS_STAMPS, RARE_STAMPS: RARE_STAMPS, WORD_STAMP: WORD_STAMP, STREAK_AT: STREAK_AT, BONUS_FULL: BONUS_FULL, FINALE: FINALE, DIARY: DIARY,
      chapters: chapters, chapter: chapter, chapterStories: chapterStories, isChapterEnd: isChapterEnd, chapterFull: chapterFull,
      chapterGot: chapterGot, diary: diary, visit: visit, daily: daily, dailySolve: dailySolve, lastLearned: lastLearned, DAILY: DAILY, dayKey: function () { return dayKey(now()); },
      get data() { return data; }, get saveOk() { return saveOk; },
      onSave: function (f) { listeners.push(f); },
      story: story, stories: stories, cur: cur, curStory: curStory, nextStoryId: nextStoryId,
      startStory: startStory, miss: miss, streak: streak, bonusGoal: bonusGoal, lampOffer: lampOffer, pickLamp: pickLamp, isFound: isFound, isOpen: isOpen, openClues: openClues, firstUnfound: firstUnfound,
      foundCount: foundCount, select: select, found: found, complete: complete,
      hintState: hintState, hintPrice: hintPrice, useHint: useHint, explainAfter: explainAfter,
      activeMs: activeMs, addActive: addActive, setSetting: setSetting, markOpened: markOpened, markTraced: markTraced,
      markResultSeen: markResultSeen, reset: reset, flush: flush, save: writeNow, adopt: adopt,
      bonusWord: bonusWord, cacheFound: cacheFound, cacheDone: cacheDone, buyLoupe: buyLoupe, LOUPE_PRICE: LOUPE_PRICE, dustOf: dustOf, dustLeft: dustLeft, sweepDust: sweepDust, wordRate: wordRate, isBig: isBig, storyPay: storyPay, goldAvail: goldAvail, goldStart: goldStart, GOLD_RUN: GOLD_RUN, streakNext: streakNext,
      sprintAvail: sprintAvail, sprintStart: sprintStart, sprintEnd: sprintEnd, SPRINT: SPRINT,
      canLight: canLight, light: light, lanternCost: lanternCost, nextFrame: nextFrame, rank: rank, secretOf: secretOf, canGuess: canGuess, guess: guess, GUESS: GUESS,
      covers: covers, canPickCover: canPickCover, setCover: setCover, markNew: markNew, seenNew: seenNew, trioCount: trioCount,
      tierOf: tierOf, tierCost: tierCost, canUpgrade: canUpgrade, upgrade: upgrade, nextUpgrade: nextUpgrade, TIER_COST: TIER_COST, CHESTS_AT: CHESTS_AT,
      finaleUnseen: finaleUnseen, markFinaleSeen: markFinaleSeen,
    };
  }

  var api = { create: create, KEY: KEY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameState = api;
})(this);
