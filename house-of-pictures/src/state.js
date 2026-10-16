/* Состояние игрока «Дома картинок»: локальный сейв с версией, правила комнат,
   экономика и ежедневные механики. Чистые функции работают и в Node (тесты),
   и в браузере.

   Правила (ТЗ 01 §6, 02 §2, 03):
   - предмет: locked → available → in_progress → choose_variant → restored;
     доступность — prerequisites (r01) или unlock_after (число восстановленных
     предметов комнаты, r02 и дальше);
   - после последней картинки ставится бесплатный вариант A; премиум-варианты
     (premium: true) выбираются, только если куплены;
   - победа записывается ДО анимации и идемпотентна. Каждая награда
     выдаётся по ключу в granted[] — повтор, миграция и заказы не дублируют;
   - день — календарный по Москве (UTC+3), сдвиг для проверок — setDayOffset;
   - «Письмо дня»: n-е письмо открывается на n-й день от daily.start
     (день завершения первой комнаты), нерешённое хранится keep_days дней;
   - «7 встреч»: штамп за первую решённую картинку дня после первой комнаты,
     пропуск дня не обнуляет карточку. */
(function (root) {
  'use strict';

  var SCHEMA_VERSION = 2;
  // Ключ остался от первой версии: сейв v1 читается и мигрирует на месте.
  var STORAGE_KEY = 'hop.save.v1';
  var MAX_ACTIVE_DRAFTS = 3;
  var MAX_LOG = 400;
  var MSK_MS = 3 * 3600 * 1000;
  var DAY_MS = 24 * 3600 * 1000;
  var dayOffset = 0;

  function nowIso() { return new Date().toISOString(); }

  // Календарный день по Москве: в 00:00 МСК начинается новое письмо.
  function dayKey(d) { return new Date((d || new Date()).getTime() + MSK_MS).toISOString().slice(0, 10); }
  function setDayOffset(n) { dayOffset = n | 0; }
  function getDayOffset() { return dayOffset; }
  function today() { return dayKey(new Date(Date.now() + dayOffset * DAY_MS)); }
  function daysBetween(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / DAY_MS); }
  function addDays(a, n) { return new Date(Date.parse(a + 'T00:00:00Z') + n * DAY_MS).toISOString().slice(0, 10); }

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
      current_room: 'r01',
      coins: 0,
      pencils: 0,
      owned_variants: [],
      owned_skus: [],
      granted: [],
      orders: [],
      stamps: { card: 0, days: [] },
      daily: { start: null, opened: [] },
      ads: { day: null, n: 0 },
      rng: seedRng(),
      hints: {},
      glows: [],
      room_choice_pending: null,
      settings: { sound: true, vibration: true, reduced_motion: false },
      log: []
    };
  }

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  // Приводит загруженный объект к текущей схеме. Неизвестные поля сохраняет.
  // C передаётся, чтобы при переходе с v1 выдать награды задним числом.
  function migrate(raw, C) {
    if (!isObj(raw)) return null;
    var from = raw.schema_version | 0;
    var s = emptyState();
    for (var k in raw) if (Object.prototype.hasOwnProperty.call(raw, k)) s[k] = raw[k];
    var base = emptyState();
    if (!isObj(s.settings)) s.settings = base.settings;
    ['completed_puzzles', 'applied_stages', 'completed_rooms', 'seen_variant_choice', 'visits', 'log',
      'owned_variants', 'owned_skus', 'granted', 'orders', 'glows']
      .forEach(function (key) { if (!Array.isArray(s[key])) s[key] = []; });
    ['object_variants', 'drafts', 'story_flags', 'hints'].forEach(function (key) { if (!isObj(s[key])) s[key] = {}; });
    ['stamps', 'daily', 'ads'].forEach(function (key) { if (!isObj(s[key])) s[key] = base[key]; });
    if (!Array.isArray(s.stamps.days)) s.stamps.days = [];
    s.stamps.card = s.stamps.card | 0;
    if (!Array.isArray(s.daily.opened)) s.daily.opened = [];
    if (typeof s.daily.start !== 'string') s.daily.start = null;
    ['coins', 'pencils'].forEach(function (key) { s[key] = Math.max(0, s[key] | 0); });
    if (typeof s.current_room !== 'string') s.current_room = 'r01';
    if (typeof s.rng !== 'number' || !isFinite(s.rng)) s.rng = seedRng();
    s.rng = s.rng >>> 0;
    if (typeof s.room_choice_pending !== 'string') s.room_choice_pending = null;
    s.schema_version = SCHEMA_VERSION;
    if (C && from < 2) backfill(C, s);
    return s;
  }

  // Награды за то, что игрок сделал до появления экономики (v1 → v2).
  function backfill(C, s) {
    var E = C.economy, day = today();
    s.completed_puzzles.forEach(function (pid) {
      if (C.puzzles[pid]) grant(s, 'p:' + pid, E.coins_per_puzzle, 0);
      if (C.puzzles[pid] && C.puzzles[pid].difficulty === 'tutorial') grant(s, 't:tutorial', 0, E.tutorial_pencils);
    });
    s.completed_rooms.forEach(function (rid) { grant(s, 'r:' + rid, E.room_reward.coins, E.room_reward.pencils); });
    if (!s.daily.start && isRoomComplete(C, s, C.daily.after_room)) s.daily.start = day;
    logEvent(s, 'migrate', { from: 1, coins: s.coins, pencils: s.pencils });
  }

  function has(arr, v) { return arr.indexOf(v) !== -1; }
  function add(arr, v) { if (!has(arr, v)) arr.push(v); }

  /* ---------- комнаты и предметы ---------- */

  function roomOrder(C) { return C.room_order || Object.keys(C.rooms); }

  function isRoomUnlocked(C, s, rid) {
    var need = C.rooms[rid].requires;
    return !need || has(s.completed_rooms, need);
  }

  function openRooms(C, s) { return roomOrder(C).filter(function (rid) { return isRoomUnlocked(C, s, rid); }); }

  function isObjectRestored(C, s, oid) {
    var o = C.objects[oid];
    return o.puzzles.every(function (pid) { return has(s.completed_puzzles, pid); });
  }

  // Сколько картинок предмета уже решено — номер стадии в сцене.
  function objectStage(C, s, oid) {
    return C.objects[oid].puzzles.filter(function (pid) { return has(s.completed_puzzles, pid); }).length;
  }

  function isObjectReady(C, s, oid) {
    var o = C.objects[oid];
    if (!isRoomUnlocked(C, s, o.room)) return false;
    if (o.unlock_after !== undefined) return restoredCount(C, s, o.room) >= o.unlock_after;
    return (o.prerequisites || []).every(function (p) { return isObjectRestored(C, s, p); });
  }

  function objectStatus(C, s, oid) {
    var o = C.objects[oid];
    if (isObjectRestored(C, s, oid)) {
      return has(s.seen_variant_choice, oid) ? 'restored' : 'choose_variant';
    }
    if (!isObjectReady(C, s, oid)) return 'locked';
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
      if (p && p.object && !has(s.completed_puzzles, pid) && !has(out, p.object)) out.push(p.object);
    });
    return out;
  }

  function canStartObject(C, s, oid) {
    var st = objectStatus(C, s, oid);
    if (st === 'in_progress') return true;
    if (st !== 'available') return false;
    return activeDraftObjects(C, s).length < MAX_ACTIVE_DRAFTS;
  }

  /* ---------- оформления ---------- */

  function findVariant(C, vid) {
    for (var oid in C.objects) {
      var vs = C.objects[oid].variants;
      for (var i = 0; i < vs.length; i++) if (vs[i].id === vid) return { object: oid, variant: vs[i] };
    }
    return null;
  }

  function isVariantOwned(C, s, vid) {
    var f = findVariant(C, vid);
    if (!f) return false;
    return !f.variant.premium || has(s.owned_variants, vid);
  }

  /* ---------- журнал и награды ---------- */

  // Слушатель журнала (src/track.js шлёт события на сервер). Ошибка слушателя
  // не должна ломать ход игры.
  var eventHook = null;
  function setEventHook(fn) { eventHook = fn; }

  function logEvent(s, type, data) {
    s.log.push({ t: nowIso(), type: type, data: data || null });
    if (s.log.length > MAX_LOG) s.log.splice(0, s.log.length - MAX_LOG);
    if (eventHook) { try { eventHook(type, data || null); } catch (e) { /* журнал важнее */ } }
  }

  function touch(s) { s.revision++; s.updated_at = nowIso(); }

  // Выдача по ключу — ровно один раз. Возвращает список наград для анимации.
  function grant(s, key, coins, pencils) {
    if (has(s.granted, key)) return [];
    s.granted.push(key);
    var out = [];
    if (coins) { s.coins += coins; out.push({ type: 'coins', n: coins, key: key }); }
    if (pencils) { s.pencils += pencils; out.push({ type: 'pencils', n: pencils, key: key }); }
    return out;
  }

  function grantVariants(s, list) {
    var got = [];
    (list || []).forEach(function (vid) { if (!has(s.owned_variants, vid)) { s.owned_variants.push(vid); got.push(vid); } });
    return got;
  }

  /* ---------- щедрость: монеты по полю, сундучки, выбор за комнату ---------- */

  // Случайность живёт в сейве (mulberry32): перезагрузка не перебросит сундучок,
  // а тесты задают s.rng и получают одно и то же.
  function seedRng() { return (Math.random() * 4294967296) >>> 0; }
  function rand(s) {
    var t = s.rng = (s.rng + 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Таблица [[до площади, значение], ...]: первое подходящее.
  function byArea(table, area, dflt) {
    for (var i = 0; i < (table || []).length; i++) if (area <= table[i][0]) return table[i][1];
    return dflt;
  }
  function area(p) { return p.rows.length * p.rows[0].length; }

  // Монеты за поле растут с его площадью (5×5 — 10, 10×10 — 40).
  function puzzleCoins(C, pid) {
    var E = C.economy;
    return byArea(E.coins_by_area, area(C.puzzles[pid]), E.coins_per_puzzle);
  }

  function fnv(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // Монетки, спрятанные в закрашиваемых клетках поля: всегда одни и те же
  // для картинки. Номера клеток r*W+c по возрастанию.
  function fieldCoins(C, pid) {
    var F = C.economy.field_coins, p = C.puzzles[pid];
    if (!F || !p || p.difficulty === 'tutorial') return [];
    var W = p.rows[0].length, n = byArea(F.by_area, area(p), F.max), cells = [], out = [], h = fnv(pid);
    p.rows.forEach(function (row, r) { for (var c = 0; c < W; c++) if (row[c] === '#') cells.push(r * W + c); });
    while (out.length < n && cells.length) {
      h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0;
      out.push(cells.splice(h % cells.length, 1)[0]);
    }
    return out.sort(function (a, b) { return a - b; });
  }

  // Найденные монетки: клетка закрашена на доске (board = null — все разом,
  // при победе). Каждая выдаётся один раз.
  function collectFieldCoins(C, s, pid, board) {
    var p = C.puzzles[pid], F = C.economy.field_coins, got = [];
    if (!p || has(s.completed_puzzles, pid) && board) return got;
    var W = p.rows[0].length;
    fieldCoins(C, pid).forEach(function (cell, i) {
      var r = (cell / W) | 0, c = cell % W;
      if (board && !(board[r] && board[r][c] === 1)) return;
      if (grant(s, 'f:' + pid + ':' + i, F.coins, 0).length) got.push({ r: r, c: c, n: F.coins });
    });
    if (got.length && board) touch(s);
    return got;
  }

  // Бесплатные подсказки: free_hints на поле, обучение — без счёта.
  function freeHintsLeft(C, s, pid) {
    var n = C.economy.free_hints, p = C.puzzles[pid];
    if (n === undefined || !p || p.difficulty === 'tutorial') return Infinity;
    return Math.max(0, n - (s.hints[pid] | 0));
  }

  function useFreeHint(C, s, pid) {
    var left = freeHintsLeft(C, s, pid);
    if (left <= 0) return false;
    if (left !== Infinity) s.hints[pid] = (s.hints[pid] | 0) + 1;
    logEvent(s, 'hint', { puzzle_id: pid, left: left === Infinity ? null : left - 1 });
    touch(s);
    return true;
  }

  function skuVariants(C) {
    var out = [];
    Object.keys(C.skus || {}).forEach(function (k) { (C.skus[k].grants.variants || []).forEach(function (v) { out.push(v); }); });
    return out;
  }

  // Сундучок за готовый предмет: монеты, карандаш или редкое «Сияние» на
  // этом предмете. Раз в комнату (к rare_by-му предмету) сияние гарантировано.
  function openChest(C, s, oid) {
    var K = C.economy.chest, rid = C.objects[oid].room, key = 'c:' + oid;
    if (!K || has(s.granted, key)) return null;
    s.granted.push(key);
    var roll = rand(s), out = { object_id: oid, kind: 'coins', coins: 0, pencils: 0 };
    var guaranteed = !has(s.granted, 'cr:' + rid) && restoredCount(C, s, rid) >= K.rare_by;
    if (guaranteed || roll < K.rare) {
      out.kind = 'rare';
      out.coins = K.rare_coins;
      add(s.glows, oid);
      add(s.granted, 'cr:' + rid);
    } else if (roll < K.rare + K.pencil) {
      out.kind = 'pencil';
      out.pencils = 1;
      out.coins = K.pencil_coins;
    } else {
      out.coins = K.coins_min + 5 * Math.floor(rand(s) * ((K.coins_max - K.coins_min) / 5 + 1));
    }
    s.coins += out.coins;
    s.pencils += out.pencils;
    logEvent(s, 'chest', { object_id: oid, kind: out.kind, coins: out.coins, pencils: out.pencils });
    return out;
  }

  // Награда за комнату на выбор: монеты, карандаши или вещь комнаты.
  // Вещь — самое дешёвое платное за монеты оформление, которого нет ни у
  // игрока, ни в наборах за голоса; если такого нет — «Сияние» на предмете.
  function roomChoices(C, s, rid) {
    var R = C.economy.room_choice, sv = skuVariants(C), best = null, glow = null;
    C.rooms[rid].objects.forEach(function (oid) {
      if (!glow && !has(s.glows, oid)) glow = oid;
      C.objects[oid].variants.forEach(function (v) {
        if (v.premium && v.price_coins && !has(s.owned_variants, v.id) && !has(sv, v.id) &&
          (!best || v.price_coins < best.price_coins)) best = v;
      });
    });
    var third = best ? { variant: best.id } : glow ? { glow: glow } : { coins: R.coins * 2 };
    return [{ coins: R.coins }, { pencils: R.pencils }, third];
  }

  function pickRoomReward(C, s, rid, i) {
    if (s.room_choice_pending !== rid) return null;
    var opt = roomChoices(C, s, rid)[i];
    if (!opt) return null;
    s.room_choice_pending = null;
    var key = 'rc:' + rid;
    if (has(s.granted, key)) { touch(s); return null; }
    s.granted.push(key);
    if (opt.coins) s.coins += opt.coins;
    if (opt.pencils) s.pencils += opt.pencils;
    if (opt.glow) add(s.glows, opt.glow);
    if (opt.variant) {
      var f = findVariant(C, opt.variant);
      add(s.owned_variants, opt.variant);
      s.object_variants[f.object] = opt.variant;
      add(s.seen_variant_choice, f.object);
    }
    logEvent(s, 'room_choice', { room_id: rid, pick: i, coins: opt.coins || 0, pencils: opt.pencils || 0,
      variant_id: opt.variant || null, glow: opt.glow || null });
    touch(s);
    return opt;
  }

  // Самое дешёвое не купленное оформление за монеты на восстановленном
  // предмете, на которое уже хватает, — для значка «Хватает!» в комнате.
  function affordableVariant(C, s, rid) {
    var best = null;
    C.rooms[rid].objects.forEach(function (oid) {
      if (!isObjectRestored(C, s, oid)) return;
      C.objects[oid].variants.forEach(function (v) {
        if (v.premium && v.price_coins && !has(s.owned_variants, v.id) && (!best || v.price_coins < best.price_coins)) best = v;
      });
    });
    return best && s.coins >= best.price_coins ? { variant: best.id, object_id: findVariant(C, best.id).object, price: best.price_coins } : null;
  }

  /* ---------- черновики и победа ---------- */

  function saveDraft(s, pid, board) {
    var empty = board.every(function (row) { return row.every(function (v) { return v === 0; }); });
    if (empty) delete s.drafts[pid];
    else s.drafts[pid] = { board: encodeBoard(board), updated_at: nowIso() };
    touch(s);
  }

  function stampsActive(C, s) {
    return isRoomComplete(C, s, C.daily.after_room) && s.stamps.card < C.stamps.rewards.length;
  }

  // Штамп за первую решённую картинку дня. Полная карточка — подарок.
  function addStamp(C, s, day, out) {
    if (!stampsActive(C, s) || has(s.stamps.days, day)) return;
    s.stamps.days.push(day);
    out.push({ type: 'stamp', n: s.stamps.days.length, of: C.stamps.card_size });
    if (s.stamps.days.length < C.stamps.card_size) return;
    var gift = C.stamps.rewards[s.stamps.card];
    var key = 's:' + s.stamps.card;
    s.stamps.card++;
    s.stamps.days = [];
    if (has(s.granted, key)) return;
    s.granted.push(key);
    var vids = grantVariants(s, gift.variants);
    s.pencils += gift.pencils || 0;
    out.push({ type: 'gift', variants: vids, pencils: gift.pencils || 0, card: s.stamps.card });
  }

  // Победа: идемпотентно. Возвращает, что изменилось, и награды (rewards).
  function completePuzzle(C, s, pid, day) {
    var p = C.puzzles[pid];
    if (!p) throw new Error('unknown puzzle ' + pid);
    if (has(s.completed_puzzles, pid)) return { duplicate: true, rewards: [] };
    day = day || today();
    var E = C.economy, rewards = [];
    var oid = p.object || null, rid = oid ? C.objects[oid].room : null;
    var wasRoomComplete = rid ? isRoomComplete(C, s, rid) : true;
    add(s.completed_puzzles, pid);
    add(s.applied_stages, pid);
    delete s.drafts[pid];
    var objectDone = oid ? isObjectRestored(C, s, oid) : false;
    if (objectDone && !s.object_variants[oid]) s.object_variants[oid] = C.objects[oid].variants[0].id;
    var roomDone = !!rid && !wasRoomComplete && isRoomComplete(C, s, rid);
    if (roomDone) add(s.completed_rooms, rid);

    rewards = rewards.concat(grant(s, 'p:' + pid, puzzleCoins(C, pid), 0));
    // Не найденные по ходу монетки поля (подсказка, карандаш) — при победе.
    var rest = collectFieldCoins(C, s, pid, null).reduce(function (n, f) { return n + f.n; }, 0);
    if (rest) rewards.push({ type: 'coins', n: rest, key: 'f:' + pid });
    delete s.hints[pid];
    if (p.difficulty === 'tutorial') rewards = rewards.concat(grant(s, 't:tutorial', 0, E.tutorial_pencils));
    rewards = rewards.concat(grant(s, 'd:' + day, E.coins_daily_first, 0));
    var chest = null;
    if (objectDone) {
      var ob = E.object_bonus || [];
      rewards = rewards.concat(grant(s, 'o:' + oid, ob[Math.min(ob.length, C.objects[oid].puzzles.length) - 1] || 0, 0));
      chest = openChest(C, s, oid);
    }
    if (roomDone) rewards = rewards.concat(grant(s, 'r:' + rid, E.room_reward.coins, E.room_reward.pencils));
    if (roomDone && E.room_choice && !has(s.granted, 'rc:' + rid)) s.room_choice_pending = rid;
    if (roomDone && rid === C.daily.after_room && !s.daily.start) s.daily.start = day;
    addStamp(C, s, day, rewards);

    logEvent(s, 'puzzle_complete', { puzzle_id: pid, object_id: oid, object_done: objectDone, room_done: roomDone, day: day });
    touch(s);
    return { duplicate: false, object_done: objectDone, room_done: roomDone, object_id: oid, room_id: rid,
      stage: oid ? objectStage(C, s, oid) : 0, rewards: rewards, chest: chest,
      room_choice: s.room_choice_pending === rid && roomDone };
  }

  function chooseVariant(C, s, oid, vid) {
    var o = C.objects[oid];
    if (!isObjectRestored(C, s, oid)) return false;
    if (!o.variants.some(function (v) { return v.id === vid; })) return false;
    if (!isVariantOwned(C, s, vid)) return false;
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

  /* ---------- траты ---------- */

  // Премиум-оформление за монеты: только для восстановленного предмета,
  // сразу ставится в комнату.
  function buyVariant(C, s, vid) {
    var f = findVariant(C, vid);
    if (!f || !f.variant.premium || !f.variant.price_coins) return { ok: false, reason: 'not_for_coins' };
    if (has(s.owned_variants, vid)) return { ok: false, reason: 'owned' };
    if (!isObjectRestored(C, s, f.object)) return { ok: false, reason: 'not_restored' };
    if (s.coins < f.variant.price_coins) return { ok: false, reason: 'coins', need: f.variant.price_coins - s.coins };
    s.coins -= f.variant.price_coins;
    s.owned_variants.push(vid);
    s.object_variants[f.object] = vid;
    add(s.seen_variant_choice, f.object);
    logEvent(s, 'buy_variant', { variant_id: vid, coins: f.variant.price_coins });
    touch(s);
    return { ok: true };
  }

  function buyPencil(C, s) {
    var price = C.economy.pencil_price;
    if (s.coins < price) return { ok: false, reason: 'coins', need: price - s.coins };
    s.coins -= price;
    s.pencils++;
    logEvent(s, 'buy_pencil', { coins: price });
    touch(s);
    return { ok: true };
  }

  function usePencil(s, pid, line) {
    if (s.pencils <= 0) return false;
    s.pencils--;
    logEvent(s, 'use_pencil', { puzzle_id: pid, line: line || null });
    touch(s);
    return true;
  }

  /* ---------- покупки за голоса и реклама ---------- */

  function skuOwnedPart(C, s, sku) {
    var g = C.skus[sku].grants;
    return (g.variants || []).some(function (vid) { return has(s.owned_variants, vid); });
  }

  // Можно ли показывать набор: разовые — пока не куплены; стартовый —
  // пока ни одна его вещь не получена другим путём.
  function canOfferSku(C, s, sku) {
    var d = C.skus[sku];
    if (!d) return false;
    if (d.one_time && has(s.owned_skus, sku)) return false;
    if (d.only_if_none_owned && skuOwnedPart(C, s, sku)) return false;
    return true;
  }

  // Заказ применяется один раз по order_id (подтверждение могло прийти
  // дважды: из окна ВК и при синхронизации с сервером).
  function applyOrder(C, s, orderId, sku) {
    var d = C.skus[sku];
    if (!d) return { ok: false, reason: 'unknown_sku' };
    if (s.orders.some(function (o) { return o.id === orderId; })) return { ok: false, reason: 'duplicate' };
    s.orders.push({ id: String(orderId), sku: sku, t: nowIso() });
    add(s.owned_skus, sku);
    var vids = grantVariants(s, d.grants.variants);
    var pencils = d.grants.pencils || 0;
    s.pencils += pencils;
    // Набор надевает свои вещи на уже восстановленные предметы.
    vids.forEach(function (vid) {
      var f = findVariant(C, vid);
      if (f && isObjectRestored(C, s, f.object)) s.object_variants[f.object] = vid;
    });
    logEvent(s, 'order', { order_id: String(orderId), sku: sku });
    touch(s);
    return { ok: true, variants: vids, pencils: pencils };
  }

  function adsLeft(C, s, day) {
    day = day || today();
    return C.economy.rewarded.per_day - (s.ads.day === day ? s.ads.n : 0);
  }

  // Награда за досмотренный ролик: монеты или карандаш, не больше per_day в день.
  function rewardedGrant(C, s, kind, day) {
    day = day || today();
    if (adsLeft(C, s, day) <= 0) return { ok: false, reason: 'limit' };
    if (s.ads.day !== day) s.ads = { day: day, n: 0 };
    s.ads.n++;
    var R = C.economy.rewarded;
    if (kind === 'pencil') s.pencils += R.pencils; else s.coins += R.coins;
    logEvent(s, 'rewarded', { kind: kind, day: day });
    touch(s);
    return { ok: true, kind: kind, n: kind === 'pencil' ? R.pencils : R.coins };
  }

  /* ---------- письма дня ---------- */

  // Все письма с их положением для игрока на день day:
  // future — ещё не пришло, today — сегодняшнее, open — пришло раньше и ждёт,
  // solved — решено (остаётся в альбоме), expired — не решено и пропало.
  function dailyLetters(C, s, day) {
    day = day || today();
    var start = s.daily.start;
    var since = start ? daysBetween(start, day) : -1;
    return C.daily.letters.map(function (L, i) {
      var st;
      if (has(s.completed_puzzles, L.id)) st = 'solved';
      else if (!start || i > since) st = 'future';
      else if (i === since) st = 'today';
      else if (since - i < C.daily.keep_days) st = 'open';
      else st = 'expired';
      return { id: L.id, index: i, status: st, day: start ? addDays(start, i) : null, opened: has(s.daily.opened, L.id) };
    });
  }

  function todayLetter(C, s, day) {
    var list = dailyLetters(C, s, day);
    for (var i = 0; i < list.length; i++) if (list[i].status === 'today' || (list[i].status === 'solved' && list[i].day === (day || today()))) return list[i];
    return null;
  }

  // Точка на значке «Письма»: есть пришедшее, но ещё не распечатанное письмо.
  function lettersBadge(C, s, day) {
    return dailyLetters(C, s, day).some(function (l) { return (l.status === 'today' || l.status === 'open') && !l.opened; });
  }

  function openLetterEnvelope(s, id) {
    if (has(s.daily.opened, id)) return false;
    s.daily.opened.push(id);
    touch(s);
    return true;
  }

  /* ---------- прочее ---------- */

  function setFlag(s, name, value) {
    s.story_flags[name] = value === undefined ? true : value;
    touch(s);
  }

  function setRoom(C, s, rid) {
    if (!C.rooms[rid] || !isRoomUnlocked(C, s, rid) || s.current_room === rid) return false;
    s.current_room = rid;
    touch(s);
    return true;
  }

  // Сколько дней прошло с прошлого визита (0 — сегодня уже были или визитов не было).
  function daysAway(s, day) {
    var last = s.visits[s.visits.length - 1];
    return last ? Math.max(0, daysBetween(last, day || today())) : 0;
  }

  // Подарок вернувшемуся после долгой паузы — раз в день возвращения.
  function comebackGift(C, s, away, day) {
    var R = C.economy.comeback;
    day = day || today();
    if (!R || away < R.after_days || s.story_flags.comeback_day === day) return null;
    s.story_flags.comeback_day = day;
    s.pencils += R.pencils;
    logEvent(s, 'comeback_gift', { away: away, pencils: R.pencils });
    touch(s);
    return { pencils: R.pencils };
  }

  // Визит засчитывается раз в календарный день (для «записки следующего визита»).
  function registerVisit(s, d) {
    var key = d ? dayKey(d) : today();
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
  function load(storage, C) {
    var raw;
    try { raw = storage.getItem(STORAGE_KEY); } catch (e) { return { state: emptyState(), fresh: true, storage_ok: false }; }
    if (raw === null || raw === undefined) return { state: emptyState(), fresh: true, storage_ok: true };
    try {
      var parsed = JSON.parse(raw);
      var s = migrate(parsed, C);
      if (!s) throw new Error('bad save');
      return { state: s, fresh: false, storage_ok: true, migrated_from: parsed.schema_version | 0 };
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

  /* ---------- облако (сервер «Дома картинок», только в ВК) ---------- */

  // Сейв для облака: без журнала событий и черновиков — они у каждого устройства свои.
  function cloudSave(s) {
    var o = JSON.parse(JSON.stringify(s));
    delete o.log;
    delete o.drafts;
    return o;
  }

  // Продолжать ли облачный сейв вместо своего: где больше решённых картинок,
  // при равенстве — где позже менялся.
  function preferRemote(local, remote) {
    if (!isObj(remote) || !Array.isArray(remote.completed_puzzles)) return false;
    var a = local.completed_puzzles.length, b = remote.completed_puzzles.length;
    if (a !== b) return b > a;
    return String(remote.updated_at || '') > String(local.updated_at || '');
  }

  // Принять облачный сейв. Черновики, журнал и настройки устройства остаются.
  // Купленное, которого нет в облачном сейве, вернёт сверка журнала покупок.
  function adoptRemote(C, local, remote) {
    var s = migrate(JSON.parse(JSON.stringify(remote)), C);
    if (!s) return null;
    s.drafts = local.drafts;
    s.log = local.log;
    s.settings = local.settings;
    return s;
  }

  var api = {
    SCHEMA_VERSION: SCHEMA_VERSION, STORAGE_KEY: STORAGE_KEY, MAX_ACTIVE_DRAFTS: MAX_ACTIVE_DRAFTS,
    emptyState: emptyState, migrate: migrate, dayKey: dayKey, today: today, daysBetween: daysBetween, addDays: addDays,
    setDayOffset: setDayOffset, getDayOffset: getDayOffset,
    roomOrder: roomOrder, isRoomUnlocked: isRoomUnlocked, openRooms: openRooms, setRoom: setRoom,
    isObjectRestored: isObjectRestored, objectStage: objectStage, objectStatus: objectStatus, nextPuzzle: nextPuzzle,
    playableObjects: playableObjects, isRoomComplete: isRoomComplete, restoredCount: restoredCount,
    canStartObject: canStartObject, activeDraftObjects: activeDraftObjects,
    findVariant: findVariant, isVariantOwned: isVariantOwned,
    rand: rand, puzzleCoins: puzzleCoins, fieldCoins: fieldCoins, collectFieldCoins: collectFieldCoins,
    freeHintsLeft: freeHintsLeft, useFreeHint: useFreeHint, openChest: openChest,
    roomChoices: roomChoices, pickRoomReward: pickRoomReward, affordableVariant: affordableVariant,
    saveDraft: saveDraft, completePuzzle: completePuzzle, chooseVariant: chooseVariant,
    closeVariantChoice: closeVariantChoice, buyVariant: buyVariant, buyPencil: buyPencil, usePencil: usePencil,
    canOfferSku: canOfferSku, applyOrder: applyOrder, adsLeft: adsLeft, rewardedGrant: rewardedGrant,
    stampsActive: stampsActive, dailyLetters: dailyLetters, todayLetter: todayLetter, lettersBadge: lettersBadge,
    openLetterEnvelope: openLetterEnvelope,
    setFlag: setFlag, registerVisit: registerVisit, daysAway: daysAway, comebackGift: comebackGift, logEvent: logEvent, setEventHook: setEventHook,
    encodeBoard: encodeBoard, decodeBoard: decodeBoard, load: load, persist: persist,
    cloudSave: cloudSave, preferRemote: preferRemote, adoptRemote: adoptRemote
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HopState = api;
})(this);
