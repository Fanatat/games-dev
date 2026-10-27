/* Состояние игрока (ТЗ §13.2, SaveV1): прогресс историй, найденные слова, помощь, атлас, марки, фонари.
   Хранилище подаётся снаружи ({get, set}) — в браузере это Platform.storage, в тестах — объект в памяти. Без DOM.
   Упрощение 2026-10 (docs/УПРОЩЕНИЕ_2026-10.md): одна валюта — марки; одна кнопка помощи с лестницей
   «ещё улика → первая буква → слово целиком»; фонарь места — одна ступень. Звания, сундуки, серии, золотые марки,
   посылки, пыль, спринт, обложки, дневник, улика дня и угадывание убраны; старые сохранения переводятся в normalize. */
(function (root) {
  'use strict';

  var KEY = 'g1f1.save.v1';
  var GAME_ID = 'game1-fork1';
  var START_STAMPS = 30;                 // новичку хватает на первую букву с первого захода
  var LADDER = ['extra', 'start', 'path'];
  var PRICE = { extra: 0, start: 10, path: 20 };
  var TUTORIAL_SEQUENTIAL = 3;           // первые три улики первой истории — по очереди (ТЗ §4.1)
  var IDLE_CAP_MS = 120000;              // активное время: не больше 120 с без действий (ТЗ §14.1)
  /* Застрял — следующий шаг помощи бесплатен: 45 с на улике, а если марок на шаг не хватает — 30 с. */
  var FREE_MS = 45000, FREE_BROKE_MS = 30000;
  var WORD_STAMP = 1;                    // марка за каждую букву найденного слова
  var BONUS_STAMPS = 1;                  // бонус-слово поля
  var CACHE_STAMPS = 10;                 // тайник: слово без улики, раз на историю
  var FINALE = { stamps: 100 };          // финал главы (ТЗ §6.2)
  var LANTERN_COST = 50;                 // фонарь у пройденного места: цель между сессиями
  var LOUPE_STAMPS = 10;                 // старые лупы → марки
  var OLD_TIER_COST = { 2: 80, 3: 160 }; // убранные ступени мест (окна, жители): марки возвращаются
  // Поля сохранения, которые были у убранных систем: при загрузке удаляются, чтобы облако ВК (≤ 4096 знаков) не росло.
  var GONE = ['xp', 'golden', 'guesses', 'parcels', 'streak', 'lamps_free', 'lamp_picks', 'upgrades', 'cover', 'covers',
    'diary', 'diary_pages', 'daily', 'bonus_drop', 'seen_new', 'bonus_total'];
  var GONE_CUR = ['chests', 'pts', 'dust', 'sprint', 'gold'];

  function dayKey(t) {
    var d = new Date(t);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function daysBetween(a, b) {
    var p = function (k) { var x = k.split('-'); return Date.UTC(+x[0], x[1] - 1, +x[2]); };
    return Math.round((p(b) - p(a)) / 86400000);
  }

  function blank(contentVersion) {
    return {
      schema_version: 1, simple: 1, revision: 0, game_id: GAME_ID, content_version: contentVersion,
      opened: false, traced: false,
      current: null,
      completed_story_ids: [], atlas_item_ids: [], seen_result_ids: [],
      wallet: { stamps: START_STAMPS },
      lanterns: [], secret: {}, caches: [],
      finale: false, finales: [], finales_seen: [],
      last_day: null, visits: 0, tips: [],
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
    var migrated = null; // что перевели из сохранения до упрощения: {loupes, stamps, tiers}

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
      if (!d.simple) migrate(d);
      for (var k in b) if (!(k in d)) d[k] = b[k];
      for (var s in b.settings) if (!(s in d.settings)) d.settings[s] = b.settings[s];
      // недоигранная история, которой нет в контенте, — начинаем заново
      if (d.current && !byId[d.current.story_id]) d.current = null;
      // глава пересобрана (новые сетки) — недоигранную историю начинаем заново, награды остаются
      if (d.current && d.current.content_version !== content.content_version) d.current = null;
      if (d.current && !d.current.bonus) d.current.bonus = [];
      if (d.finale && d.finales.indexOf(1) < 0) d.finales.push(1);
      return d;
    }
    /* Сохранение до упрощения (b023 и раньше): лупы → по 10 марок, купленные окна и жители — марки назад,
       «Разбор» считается показанным словом. Пройденные истории, атлас, фонари и тайное слово не трогаем. */
    function migrate(d) {
      var w = d.wallet || { stamps: 0 }, loupes = w.loupes || 0, back = 0;
      Object.keys(d.upgrades || {}).forEach(function (id) {
        for (var t = 2; t <= (d.upgrades[id] || 0); t++) back += OLD_TIER_COST[t] || 0;
      });
      d.wallet = { stamps: (w.stamps || 0) + loupes * LOUPE_STAMPS + back };
      GONE.forEach(function (k) { delete d[k]; });
      if (d.current) {
        GONE_CUR.forEach(function (k) { delete d.current[k]; });
        var h = d.current.hints || {};
        Object.keys(h).forEach(function (id) { if (h[id].explain) { h[id].path = true; delete h[id].explain; } });
      }
      d.simple = 1;
      migrated = { loupes: loupes, stamps: loupes * LOUPE_STAMPS + back, tiers: back };
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

    function lastLearned() {
      var ids = data.completed_story_ids, s = ids.length ? byId[ids[ids.length - 1]] : null;
      if (!s) return null;
      return { story: s, question: isChapterEnd(s) ? chapter(s.chapter).end && chapter(s.chapter).end.question || s.next_question : s.next_question };
    }
    // Заход в игру: «в прошлый раз», если был другой день. Вызывается один раз при запуске.
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
        active_ms_by_clue: {}, hints: {}, bonus: [], word_stamps: 0, started_at: new Date(now()).toISOString() };
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

    // Найдено слово (путь в порядке ответа): марка за каждую букву. Возвращает {already, complete, secret, stamps}.
    function found(clueId, path) {
      var c = data.current;
      if (!c) return null;
      if (c.found[clueId]) return { already: true, complete: foundCount() === curStory().clues.length };
      c.found[clueId] = path;
      var clue = curStory().clues.filter(function (x) { return x.id === clueId; })[0];
      var stamps = clue.answer.length * WORD_STAMP;
      data.wallet.stamps += stamps;
      c.word_stamps = (c.word_stamps || 0) + stamps;
      var complete = foundCount() === curStory().clues.length;
      if (!complete && (c.selected_clue_id === clueId || isFound(c.selected_clue_id))) c.selected_clue_id = firstUnfound();
      // золотая буква тайного слова главы лежит в этом ответе
      var sec = curStory().secret, letter = null, sk = sec && secretKey(curStory().chapter, sec.pos);
      if (sec && sec.clue_id === clueId && !data.secret[sk]) { data.secret[sk] = sec.letter; letter = sec.letter; }
      writeNow(); // каждое найденное слово — сразу на диск (A06)
      return { already: false, complete: complete, secret: letter, stamps: stamps };
    }

    /* Бонусное слово: настоящее слово поля, не ответ, +1 марка. Возвращает {ok, repeat, count, stamps} или null. */
    function bonusWord(word) {
      var c = data.current, s = curStory();
      if (!c || !s || !s.bonus || s.bonus.indexOf(word) < 0) return null;
      if (c.bonus.indexOf(word) >= 0) return { ok: false, repeat: true, count: c.bonus.length };
      c.bonus.push(word);
      data.wallet.stamps += BONUS_STAMPS;
      writeNow();
      return { ok: true, repeat: false, count: c.bonus.length, stamps: BONUS_STAMPS };
    }
    // Тайник: слово без улики. Награда один раз на историю.
    function cacheFound() {
      var s = curStory();
      if (!s || !s.cache || data.caches.indexOf(s.id) >= 0) return null;
      data.caches.push(s.id);
      data.wallet.stamps += CACHE_STAMPS;
      writeNow();
      return { stamps: CACHE_STAMPS };
    }
    function cacheDone(id) { return data.caches.indexOf(id) >= 0; }

    // Фонари Тихоречья: за марки зажигается фонарь у пройденного места (видно на картинке городка).
    function lanternCost() { return LANTERN_COST; }
    function canLight(id) {
      return data.completed_story_ids.indexOf(id) >= 0 && data.lanterns.indexOf(id) < 0 && data.wallet.stamps >= LANTERN_COST;
    }
    function light(id) {
      if (!canLight(id)) return null;
      data.wallet.stamps -= LANTERN_COST;
      data.lanterns.push(id);
      writeNow();
      return { cost: LANTERN_COST, count: data.lanterns.length };
    }
    // Ближайший фонарь: самое свежее тёмное пройденное место; {id, cost, have, can} или null — всё горит.
    function nextLantern() {
      var dark = data.completed_story_ids.filter(function (id) { return data.lanterns.indexOf(id) < 0; });
      if (!dark.length) return null;
      var id = dark[dark.length - 1];
      return { id: id, cost: LANTERN_COST, have: data.wallet.stamps, can: data.wallet.stamps >= LANTERN_COST };
    }

    /* Завершение истории: награда атомарно вместе с отметкой первого прохождения (ТЗ §9.1).
       Повторный вызов ничего не начисляет. */
    function complete() {
      var s = curStory();
      if (!s || foundCount() !== s.clues.length) return null;
      var first = data.completed_story_ids.indexOf(s.id) < 0;
      var reward = { stamps: 0, item: null, first: first, finale: null, bonus: data.current.bonus.length,
        words: data.current.word_stamps || 0 };
      if (first) {
        data.completed_story_ids.push(s.id);
        reward.stamps = s.reward.first_completion_stamps;
        if (isChapterEnd(s) && chapterFull(s.chapter) && data.finales.indexOf(s.chapter) < 0) {
          data.finales.push(s.chapter);
          if (s.chapter === 1) data.finale = true;
          reward.finale = { stamps: FINALE.stamps };
          reward.stamps += FINALE.stamps;
        }
        data.wallet.stamps += reward.stamps;
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
      return { word: w, title: c.secret_title || content.secret_title || 'Тайное слово', got: got, count: n, full: n === w.length };
    }

    /* ---------- помощь: одна кнопка, лестница из трёх шагов ---------- */
    function hintState(clueId) {
      var c = data.current;
      if (!c) return {};
      return c.hints[clueId] || (c.hints[clueId] = {});
    }
    // Ответ уже на поле: после третьего шага кнопка помощи становится «принять».
    function shown(clueId) { var h = hintState(clueId); return !!(h.path || h.explain); }
    function freeAfter(clueId, type) {
      return data.wallet.stamps < (PRICE[type || nextStep(clueId)] || 0) ? FREE_BROKE_MS : FREE_MS;
    }
    function nextStep(clueId) {
      var h = hintState(clueId);
      for (var i = 0; i < LADDER.length; i++) if (!h[LADDER[i]]) return LADDER[i];
      return null;
    }
    /* Следующий шаг и его цена сейчас: {type, price, free:'demo'|'stuck'|null, full} или null, если ответ уже показан.
       Первый раз каждый платный шаг бесплатен; застрял дольше FREE_MS — бесплатен. */
    function nextHint(clueId, activeMs) {
      if (!data.current || isFound(clueId)) return null;
      var type = nextStep(clueId);
      if (!type || shown(clueId)) return null;
      var full = PRICE[type], free = null;
      if (full && data.free_demo[type]) free = 'demo';
      else if (full && (activeMs || 0) >= freeAfter(clueId, type)) free = 'stuck';
      return { type: type, price: free ? 0 : full, full: full, free: free, step: LADDER.indexOf(type) + 1 };
    }
    /* Сделать следующий шаг. opts.ad — ролик за награду досмотрен: шаг бесплатно.
       Возвращает {ok, type, price, free} или {ok:false, reason, price}. */
    function useHint(clueId, activeMs, opts) {
      var n = nextHint(clueId, activeMs);
      if (!n) return { ok: false, reason: 'none' };
      var ad = !!(opts && opts.ad), price = ad ? 0 : n.price;
      if (price > data.wallet.stamps) return { ok: false, reason: 'stamps', price: price, type: n.type };
      data.wallet.stamps -= price;
      if (n.free === 'demo' && !ad) data.free_demo[n.type] = false;
      hintState(clueId)[n.type] = true;
      writeNow();
      return { ok: true, type: n.type, price: price, free: ad ? 'ad' : n.free, step: n.step };
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
    // Обучающая подсказка одного вида показывается игроку один раз за всю игру (не больше трёх видов).
    function tip(kind) { if (data.tips.indexOf(kind) >= 0) return false; data.tips.push(kind); saveSoon(); return true; }
    function tipSeen(kind) { return data.tips.indexOf(kind) >= 0; }
    function markTraced() { if (!data.traced) { data.traced = true; saveSoon(); } }
    // Финал главы, который начислен, но ещё не показан (ушли с итога 10-й истории; п. 4.8).
    function finaleUnseen() { return data.finales.filter(function (n) { return data.finales_seen.indexOf(n) < 0; })[0] || null; }
    function markFinaleSeen(n) { if (data.finales_seen.indexOf(n) < 0) { data.finales_seen.push(n); saveSoon(); } }
    function markResultSeen(id) { if (data.seen_result_ids.indexOf(id) < 0) { data.seen_result_ids.push(id); saveSoon(); } }
    function reset() { data = blank(content.content_version); writeNow(); }

    load();
    if (migrated) writeNow();
    return {
      KEY: KEY, PRICE: PRICE, LADDER: LADDER, START_STAMPS: START_STAMPS, FREE_MS: FREE_MS, FREE_BROKE_MS: FREE_BROKE_MS,
      BONUS_STAMPS: BONUS_STAMPS, CACHE_STAMPS: CACHE_STAMPS, WORD_STAMP: WORD_STAMP, FINALE: FINALE, LANTERN_COST: LANTERN_COST,
      chapters: chapters, chapter: chapter, chapterStories: chapterStories, isChapterEnd: isChapterEnd, chapterFull: chapterFull,
      chapterGot: chapterGot, visit: visit, lastLearned: lastLearned, dayKey: function () { return dayKey(now()); },
      get data() { return data; }, get saveOk() { return saveOk; }, get migrated() { return migrated; },
      onSave: function (f) { listeners.push(f); },
      story: story, stories: stories, cur: cur, curStory: curStory, nextStoryId: nextStoryId,
      startStory: startStory, isFound: isFound, isOpen: isOpen, firstUnfound: firstUnfound,
      foundCount: foundCount, select: select, found: found, complete: complete,
      hintState: hintState, nextHint: nextHint, useHint: useHint, shown: shown, freeAfter: freeAfter,
      activeMs: activeMs, addActive: addActive, setSetting: setSetting, markOpened: markOpened, markTraced: markTraced, tip: tip, tipSeen: tipSeen,
      markResultSeen: markResultSeen, reset: reset, flush: flush, save: writeNow, adopt: adopt,
      bonusWord: bonusWord, cacheFound: cacheFound, cacheDone: cacheDone,
      canLight: canLight, light: light, lanternCost: lanternCost, nextLantern: nextLantern, secretOf: secretOf,
      finaleUnseen: finaleUnseen, markFinaleSeen: markFinaleSeen,
    };
  }

  var api = { create: create, KEY: KEY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameState = api;
})(this);
