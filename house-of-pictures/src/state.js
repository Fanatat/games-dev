/* Состояние игрока «Дома картинок» (P0): локальный сейв с версией и правила
   комнаты. Чистые функции работают и в Node (тесты), и в браузере.

   Правила (ТЗ 01 §6, 02 §2):
   - предмет: locked → available → in_progress → choose_variant → restored;
   - после последней картинки сразу ставится бесплатный вариант A, выбор B
     не блокирует прогресс (choose_variant — лишь «ещё не смотрел выбор»);
   - победа записывается ДО анимации и идемпотентна: повтор не меняет ничего;
   - черновики хранятся по puzzle_id, до трёх предметов в работе. */
(function (root) {
  'use strict';

  var SCHEMA_VERSION = 1;
  var STORAGE_KEY = 'hop.save.v1';
  var MAX_ACTIVE_DRAFTS = 3;
  var MAX_LOG = 400;

  function nowIso() { return new Date().toISOString(); }

  function dayKey(d) { return (d || new Date()).toISOString().slice(0, 10); }

  function emptyState() {
    return {
      schema_version: SCHEMA_VERSION,
      revision: 0,
      created_at: nowIso(),
      updated_at: null,
      content_version: null,
      completed_puzzles: [],
      applied_stages: [],
      completed_rooms: [],
      object_variants: {},
      seen_variant_choice: [],
      drafts: {},
      story_flags: {},
      visits: [],
      settings: { sound: true, vibration: true, reduced_motion: false },
      log: []
    };
  }

  // Приводит загруженный объект к текущей схеме. Неизвестные поля сохраняет.
  function migrate(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var s = emptyState();
    for (var k in raw) if (Object.prototype.hasOwnProperty.call(raw, k)) s[k] = raw[k];
    if (!s.settings || typeof s.settings !== 'object') s.settings = emptyState().settings;
    ['completed_puzzles', 'applied_stages', 'completed_rooms', 'seen_variant_choice', 'visits', 'log']
      .forEach(function (key) { if (!Array.isArray(s[key])) s[key] = []; });
    ['object_variants', 'drafts', 'story_flags'].forEach(function (key) {
      if (!s[key] || typeof s[key] !== 'object' || Array.isArray(s[key])) s[key] = {};
    });
    s.schema_version = SCHEMA_VERSION;
    return s;
  }

  function has(arr, v) { return arr.indexOf(v) !== -1; }
  function add(arr, v) { if (!has(arr, v)) arr.push(v); }

  /* ---------- правила комнаты ---------- */

  function isObjectRestored(C, s, oid) {
    var o = C.objects[oid];
    return o.puzzles.every(function (pid) { return has(s.completed_puzzles, pid); });
  }

  function objectStatus(C, s, oid) {
    var o = C.objects[oid];
    if (isObjectRestored(C, s, oid)) {
      return has(s.seen_variant_choice, oid) ? 'restored' : 'choose_variant';
    }
    var ready = o.prerequisites.every(function (p) { return isObjectRestored(C, s, p); });
    if (!ready) return 'locked';
    var started = o.puzzles.some(function (pid) { return has(s.completed_puzzles, pid) || s.drafts[pid]; });
    return started ? 'in_progress' : 'available';
  }

  // Следующая нерешённая картинка предмета (стадии последовательны).
  function nextPuzzle(C, s, oid) {
    var o = C.objects[oid];
    for (var i = 0; i < o.puzzles.length; i++) if (!has(s.completed_puzzles, o.puzzles[i])) return o.puzzles[i];
    return null;
  }

  function playableObjects(C, s, rid) {
    return C.rooms[rid].objects.filter(function (oid) {
      var st = objectStatus(C, s, oid);
      return st === 'available' || st === 'in_progress';
    });
  }

  function isRoomComplete(C, s, rid) {
    return C.rooms[rid].objects.every(function (oid) { return isObjectRestored(C, s, oid); });
  }

  function restoredCount(C, s, rid) {
    return C.rooms[rid].objects.filter(function (oid) { return isObjectRestored(C, s, oid); }).length;
  }

  function activeDraftObjects(C, s) {
    var out = [];
    Object.keys(s.drafts).forEach(function (pid) {
      var p = C.puzzles[pid];
      if (p && !has(s.completed_puzzles, pid) && !has(out, p.object)) out.push(p.object);
    });
    return out;
  }

  function canStartObject(C, s, oid) {
    var st = objectStatus(C, s, oid);
    if (st === 'in_progress') return true;
    if (st !== 'available') return false;
    return activeDraftObjects(C, s).length < MAX_ACTIVE_DRAFTS;
  }

  /* ---------- изменения состояния ---------- */

  function logEvent(s, type, data) {
    s.log.push({ t: nowIso(), type: type, data: data || null });
    if (s.log.length > MAX_LOG) s.log.splice(0, s.log.length - MAX_LOG);
  }

  function touch(s) { s.revision++; s.updated_at = nowIso(); }

  function saveDraft(s, pid, board) {
    var empty = board.every(function (row) { return row.every(function (v) { return v === 0; }); });
    if (empty) delete s.drafts[pid];
    else s.drafts[pid] = { board: encodeBoard(board), updated_at: nowIso() };
    touch(s);
  }

  // Победа: идемпотентно. Возвращает, что изменилось (для анимаций).
  function completePuzzle(C, s, pid) {
    var p = C.puzzles[pid];
    if (!p) throw new Error('unknown puzzle ' + pid);
    if (has(s.completed_puzzles, pid)) return { duplicate: true };
    var oid = p.object, rid = C.objects[oid].room;
    var wasRoomComplete = isRoomComplete(C, s, rid);
    add(s.completed_puzzles, pid);
    add(s.applied_stages, pid);
    delete s.drafts[pid];
    var objectDone = isObjectRestored(C, s, oid);
    if (objectDone && !s.object_variants[oid]) s.object_variants[oid] = C.objects[oid].variants[0].id;
    var roomDone = !wasRoomComplete && isRoomComplete(C, s, rid);
    if (roomDone) add(s.completed_rooms, rid);
    logEvent(s, 'puzzle_complete', { puzzle_id: pid, object_id: oid, object_done: objectDone, room_done: roomDone });
    touch(s);
    return { duplicate: false, object_done: objectDone, room_done: roomDone, object_id: oid, room_id: rid };
  }

  function chooseVariant(C, s, oid, vid) {
    var o = C.objects[oid];
    if (!isObjectRestored(C, s, oid)) return false;
    if (!o.variants.some(function (v) { return v.id === vid; })) return false;
    s.object_variants[oid] = vid;
    add(s.seen_variant_choice, oid);
    logEvent(s, 'variant_select', { object_id: oid, variant_id: vid });
    touch(s);
    return true;
  }

  function closeVariantChoice(s, oid) {
    add(s.seen_variant_choice, oid);
    touch(s);
  }

  function setFlag(s, name, value) {
    s.story_flags[name] = value === undefined ? true : value;
    touch(s);
  }

  // Визит засчитывается раз в календарный день (для «записки следующего визита»).
  function registerVisit(s, d) {
    var key = dayKey(d);
    var first = s.visits.length === 0 || s.visits[s.visits.length - 1] !== key;
    if (first) { s.visits.push(key); if (s.visits.length > 60) s.visits.shift(); }
    s.story_flags.session_count = (s.story_flags.session_count || 0) + 1;
    touch(s);
    return first;
  }

  /* ---------- сериализация доски: строка цифр по строкам ---------- */

  function encodeBoard(board) { return board.map(function (row) { return row.join(''); }).join('/'); }

  function decodeBoard(str, W, H) {
    var rows = String(str || '').split('/');
    var out = [];
    for (var r = 0; r < H; r++) {
      out[r] = [];
      for (var c = 0; c < W; c++) {
        var v = rows[r] ? parseInt(rows[r][c], 10) : 0;
        out[r][c] = (v === 1 || v === 2) ? v : 0;
      }
    }
    return out;
  }

  /* ---------- хранилище ---------- */

  // Нечитаемый сейв не затирается молча: сырой текст копируется под ключ
  // <ключ>.broken.<время>, и только потом игра начинается с чистого профиля.
  function load(storage) {
    var raw;
    try { raw = storage.getItem(STORAGE_KEY); } catch (e) { return { state: emptyState(), fresh: true, storage_ok: false }; }
    if (raw === null || raw === undefined) return { state: emptyState(), fresh: true, storage_ok: true };
    try {
      var parsed = JSON.parse(raw);
      var s = migrate(parsed);
      if (!s) throw new Error('bad save');
      return { state: s, fresh: false, storage_ok: true };
    } catch (e) {
      try { storage.setItem(STORAGE_KEY + '.broken.' + Date.now(), raw); } catch (e2) { /* место кончилось — оставляем как есть */ }
      return { state: emptyState(), fresh: true, storage_ok: true, recovered_from_broken: true };
    }
  }

  function persist(storage, s) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(s));
      return true;
    } catch (e) {
      // Переполнение: сначала урезаем журнал, затем пробуем снова.
      try {
        s.log = s.log.slice(-50);
        storage.setItem(STORAGE_KEY, JSON.stringify(s));
        return true;
      } catch (e2) { return false; }
    }
  }

  var api = {
    SCHEMA_VERSION: SCHEMA_VERSION, STORAGE_KEY: STORAGE_KEY, MAX_ACTIVE_DRAFTS: MAX_ACTIVE_DRAFTS,
    emptyState: emptyState, migrate: migrate, dayKey: dayKey,
    isObjectRestored: isObjectRestored, objectStatus: objectStatus, nextPuzzle: nextPuzzle,
    playableObjects: playableObjects, isRoomComplete: isRoomComplete, restoredCount: restoredCount,
    canStartObject: canStartObject, activeDraftObjects: activeDraftObjects,
    saveDraft: saveDraft, completePuzzle: completePuzzle, chooseVariant: chooseVariant,
    closeVariantChoice: closeVariantChoice, setFlag: setFlag, registerVisit: registerVisit, logEvent: logEvent,
    encodeBoard: encodeBoard, decodeBoard: decodeBoard, load: load, persist: persist
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HopState = api;
})(this);
