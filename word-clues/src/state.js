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
  /* Экономика круга 2 (план эксперта b007, круг 1): лупы и тратятся, и приходят. */
  var BONUS_PER_LOUPE = 3, BONUS_LOUPES_MAX = 3; // каждые 3 бонусных слова — лупа, не больше 3 луп за историю
  var NO_HINT_XP = 5, NO_HINT_LOUPES = 1;         // история без «Начала», «Пути» и «Разбора»
  var GOLDEN_CHANCE = 0.4, GOLDEN_LOUPES = 2;     // золотая марка: изредка за историю без подсказок
  var PARCELS = { 4: { loupes: 3, stamps: 30 }, 9: { loupes: 5, stamps: 50 } }; // посылки после 5-й и 10-й историй
  var CACHE_REWARD = { loupes: 2, stamps: 10 };
  var LANTERN_COST = 30, LANTERN_LOUPES = 1;
  var RANKS = [
    { xp: 0, name: 'Новичок маршрута', loupes: 0 },
    { xp: 30, name: 'Следопыт', loupes: 2 },
    { xp: 60, name: 'Следопыт 2-го ранга', loupes: 2 },
    { xp: 100, name: 'Хранитель маршрута', loupes: 3 },
  ];
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
      seed: seedOf(), bonus_total: 0, golden: 0, lanterns: [], secret: {}, caches: [], parcels: [],
      free_demo: { start: true, path: true },
      settings: { sound: true, reduced_motion: false, large_text: false },
      updated_at: null,
    };
  }

  function create(content, storage, opts) {
    opts = opts || {};
    var now = opts.now || function () { return Date.now(); };
    var stories = content.stories;
    var byId = {};
    stories.forEach(function (s, i) { s.index = i; byId[s.id] = s; });
    var data = null;
    var saveOk = true;
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
      for (var k in b) if (!(k in d)) d[k] = b[k];
      for (var s in b.settings) if (!(s in d.settings)) d.settings[s] = b.settings[s];
      // недоигранная история, которой нет в контенте, — начинаем заново
      if (d.current && !byId[d.current.story_id]) d.current = null;
      // глава пересобрана (новые сетки) — недоигранную историю начинаем заново, награды остаются
      if (d.current && d.current.content_version !== content.content_version) d.current = null;
      if (d.current && !d.current.bonus) { d.current.bonus = []; d.current.bonus_loupes = 0; }
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

    function nextStoryId() {
      for (var i = 0; i < stories.length; i++) if (data.completed_story_ids.indexOf(stories[i].id) < 0) return stories[i].id;
      return null;
    }

    function startStory(id) {
      var s = byId[id];
      if (!s) throw new Error('нет истории ' + id);
      if (data.current && data.current.story_id === id) return data.current;
      data.current = { story_id: id, content_version: content.content_version, found: {}, selected_clue_id: s.clues[0].id,
        active_ms_by_clue: {}, hints: {}, bonus: [], bonus_loupes: 0, started_at: new Date(now()).toISOString() };
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
      var complete = foundCount() === curStory().clues.length;
      if (!complete && (c.selected_clue_id === clueId || isFound(c.selected_clue_id))) c.selected_clue_id = firstUnfound();
      // золотая буква тайного слова главы лежит в этом ответе
      var sec = curStory().secret, letter = null;
      if (sec && sec.clue_id === clueId && !data.secret[sec.pos]) { data.secret[sec.pos] = sec.letter; letter = sec.letter; }
      writeNow(); // каждое найденное слово — сразу на диск (A06)
      return { already: false, complete: complete, secret: letter };
    }

    /* Бонусное слово: настоящее слово поля, не ответ. +1 марка; каждые 3 — лупа (до 3 за историю).
       Возвращает {ok, repeat, count, loupe} или null, если слова нет в списке истории. */
    function bonusWord(word) {
      var c = data.current, s = curStory();
      if (!c || !s || !s.bonus || s.bonus.indexOf(word) < 0) return null;
      if (c.bonus.indexOf(word) >= 0) return { ok: false, repeat: true, count: c.bonus.length };
      c.bonus.push(word);
      data.bonus_total++;
      data.wallet.stamps += 1;
      var loupe = false;
      if (c.bonus.length % BONUS_PER_LOUPE === 0 && c.bonus_loupes < BONUS_LOUPES_MAX) {
        c.bonus_loupes++; data.wallet.loupes++; loupe = true;
      }
      writeNow();
      return { ok: true, repeat: false, count: c.bonus.length, loupe: loupe };
    }
    function bonusLeft() {
      var c = data.current;
      if (!c || c.bonus_loupes >= BONUS_LOUPES_MAX) return 0;
      return BONUS_PER_LOUPE - (c.bonus.length % BONUS_PER_LOUPE);
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

    // Фонари Тихоречья: за марки зажигается фонарь у пройденного места, +1 лупа.
    function canLight(id) {
      return data.completed_story_ids.indexOf(id) >= 0 && data.lanterns.indexOf(id) < 0 && data.wallet.stamps >= LANTERN_COST;
    }
    function light(id) {
      if (!canLight(id)) return null;
      data.wallet.stamps -= LANTERN_COST;
      data.wallet.loupes += LANTERN_LOUPES;
      data.lanterns.push(id);
      writeNow();
      return { loupes: LANTERN_LOUPES, cost: LANTERN_COST };
    }
    function rank() { var k = rankOf(data.xp); return { index: k, name: RANKS[k].name, next: RANKS[k + 1] || null }; }

    /* Завершение истории: награда атомарно вместе с отметкой первого прохождения (ТЗ §9.1).
       Повторный вызов ничего не начисляет. */
    function complete() {
      var s = curStory();
      if (!s || foundCount() !== s.clues.length) return null;
      var first = data.completed_story_ids.indexOf(s.id) < 0;
      var reward = { stamps: 0, xp: 0, item: null, first: first, loupes: 0, no_hints: false, golden: false,
        parcel: null, rank: null, bonus: data.current.bonus.length };
      if (first) {
        data.completed_story_ids.push(s.id);
        var h = data.current.hints, used = false;
        Object.keys(h).forEach(function (k) { if (h[k].start || h[k].path || h[k].explain) used = true; });
        var rankBefore = rankOf(data.xp);
        reward.stamps = s.reward.first_completion_stamps;
        reward.xp = s.reward.first_completion_xp;
        if (!used) {
          reward.no_hints = true;
          reward.xp += NO_HINT_XP;
          reward.loupes += NO_HINT_LOUPES;
          if (chance(data.seed, s.id) < GOLDEN_CHANCE) { reward.golden = true; reward.loupes += GOLDEN_LOUPES; data.golden++; }
        }
        var pc = PARCELS[s.index];
        if (pc && data.parcels.indexOf(s.id) < 0) {
          data.parcels.push(s.id);
          reward.parcel = { loupes: pc.loupes, stamps: pc.stamps };
          reward.loupes += pc.loupes; reward.stamps += pc.stamps;
        }
        data.xp += reward.xp;
        var rankAfter = rankOf(data.xp);
        if (rankAfter > rankBefore) {
          var add = 0;
          for (var k = rankBefore + 1; k <= rankAfter; k++) add += RANKS[k].loupes;
          reward.rank = { name: RANKS[rankAfter].name, loupes: add };
          reward.loupes += add;
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
      return (c && c.explain_ms) || 90000;
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
    function markResultSeen(id) { if (data.seen_result_ids.indexOf(id) < 0) { data.seen_result_ids.push(id); saveSoon(); } }
    function reset() { data = blank(content.content_version); writeNow(); }

    load();
    return {
      KEY: KEY, COST: COST, RANKS: RANKS, LANTERN_COST: LANTERN_COST, BONUS_PER_LOUPE: BONUS_PER_LOUPE,
      get data() { return data; }, get saveOk() { return saveOk; },
      onSave: function (f) { listeners.push(f); },
      story: story, stories: stories, cur: cur, curStory: curStory, nextStoryId: nextStoryId,
      startStory: startStory, isFound: isFound, isOpen: isOpen, openClues: openClues, firstUnfound: firstUnfound,
      foundCount: foundCount, select: select, found: found, complete: complete,
      hintState: hintState, hintPrice: hintPrice, useHint: useHint, explainAfter: explainAfter,
      activeMs: activeMs, addActive: addActive, setSetting: setSetting, markOpened: markOpened, markTraced: markTraced,
      markResultSeen: markResultSeen, reset: reset, flush: flush, save: writeNow, adopt: adopt,
      bonusWord: bonusWord, bonusLeft: bonusLeft, cacheFound: cacheFound, cacheDone: cacheDone,
      canLight: canLight, light: light, rank: rank,
    };
  }

  var api = { create: create, KEY: KEY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameState = api;
})(this);
