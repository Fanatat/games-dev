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

  function blank(contentVersion) {
    return {
      schema_version: 1, revision: 0, game_id: GAME_ID, content_version: contentVersion,
      opened: false,
      current: null,
      completed_story_ids: [], atlas_item_ids: [], seen_result_ids: [],
      wallet: { stamps: 0, loupes: START_LOUPES }, xp: 0,
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

    function load() {
      var raw = null;
      try { raw = storage.get(KEY); } catch (e) { saveOk = false; }
      var d = null;
      if (raw) { try { d = JSON.parse(raw); } catch (e) { d = null; } }
      if (!d || d.game_id !== GAME_ID || d.schema_version !== 1) d = blank(content.content_version);
      var b = blank(content.content_version);
      for (var k in b) if (!(k in d)) d[k] = b[k];
      for (var s in b.settings) if (!(s in d.settings)) d.settings[s] = b.settings[s];
      // недоигранная история, которой нет в контенте, — начинаем заново
      if (d.current && !byId[d.current.story_id]) d.current = null;
      data = d;
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
        active_ms_by_clue: {}, hints: {}, started_at: new Date(now()).toISOString() };
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

    // Найдено слово (путь в порядке ответа). Возвращает {already, complete}.
    function found(clueId, path) {
      var c = data.current;
      if (!c) return null;
      if (c.found[clueId]) return { already: true, complete: foundCount() === curStory().clues.length };
      c.found[clueId] = path;
      var complete = foundCount() === curStory().clues.length;
      if (!complete && (c.selected_clue_id === clueId || isFound(c.selected_clue_id))) c.selected_clue_id = firstUnfound();
      writeNow(); // каждое найденное слово — сразу на диск (A06)
      return { already: false, complete: complete };
    }

    /* Завершение истории: награда атомарно вместе с отметкой первого прохождения (ТЗ §9.1).
       Повторный вызов ничего не начисляет. */
    function complete() {
      var s = curStory();
      if (!s || foundCount() !== s.clues.length) return null;
      var first = data.completed_story_ids.indexOf(s.id) < 0;
      var reward = { stamps: 0, xp: 0, item: null, first: first };
      if (first) {
        data.completed_story_ids.push(s.id);
        reward.stamps = s.reward.first_completion_stamps;
        reward.xp = s.reward.first_completion_xp;
        data.wallet.stamps += reward.stamps;
        data.xp += reward.xp;
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
    function markResultSeen(id) { if (data.seen_result_ids.indexOf(id) < 0) { data.seen_result_ids.push(id); saveSoon(); } }
    function reset() { data = blank(content.content_version); writeNow(); }

    load();
    return {
      KEY: KEY, COST: COST,
      get data() { return data; }, get saveOk() { return saveOk; },
      onSave: function (f) { listeners.push(f); },
      story: story, stories: stories, cur: cur, curStory: curStory, nextStoryId: nextStoryId,
      startStory: startStory, isFound: isFound, isOpen: isOpen, openClues: openClues, firstUnfound: firstUnfound,
      foundCount: foundCount, select: select, found: found, complete: complete,
      hintState: hintState, hintPrice: hintPrice, useHint: useHint, explainAfter: explainAfter,
      activeMs: activeMs, addActive: addActive, setSetting: setSetting, markOpened: markOpened,
      markResultSeen: markResultSeen, reset: reset, flush: flush, save: writeNow,
    };
  }

  var api = { create: create, KEY: KEY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameState = api;
})(this);
