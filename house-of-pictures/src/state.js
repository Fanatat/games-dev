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
      lines: {},
      glows: [],
      room_gifts: [],
      play_s: 0,
      glow_at: 0,
      gold: null,
      secrets: [],
      decor: [],
      event_start: null,
      event_carry: 0,
      settings: { music: true, sound: true, vibration: true, reduced_motion: false },
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
      'owned_variants', 'owned_skus', 'granted', 'orders', 'glows', 'secrets', 'room_gifts', 'decor']
      .forEach(function (key) { if (!Array.isArray(s[key])) s[key] = []; });
    ['object_variants', 'drafts', 'story_flags', 'hints', 'lines'].forEach(function (key) { if (!isObj(s[key])) s[key] = {}; });
    ['stamps', 'daily', 'ads'].forEach(function (key) { if (!isObj(s[key])) s[key] = base[key]; });
    if (!Array.isArray(s.stamps.days)) s.stamps.days = [];
    s.stamps.card = s.stamps.card | 0;
    if (!Array.isArray(s.daily.opened)) s.daily.opened = [];
    if (typeof s.daily.start !== 'string') s.daily.start = null;
    ['coins', 'pencils'].forEach(function (key) { s[key] = Math.max(0, s[key] | 0); });
    if (typeof s.current_room !== 'string') s.current_room = 'r01';
    if (typeof s.rng !== 'number' || !isFinite(s.rng)) s.rng = seedRng();
    s.rng = s.rng >>> 0;
    // Невзятый подарок за комнату был один и затирался следующей комнатой — теперь очередь.
    if (typeof s.room_choice_pending === 'string') add(s.room_gifts, s.room_choice_pending);
    delete s.room_choice_pending;
    s.room_gifts = s.room_gifts.filter(function (rid) { return typeof rid === 'string'; });
    s.decor = s.decor.filter(function (id) { return typeof id === 'string'; });
    s.play_s = Math.max(0, Math.round(+s.play_s || 0));
    // Отсчёт до следующего «Сияния»: старый сейв начинает его с нынешнего времени игры.
    if (typeof raw.glow_at !== 'number' || !isFinite(raw.glow_at)) s.glow_at = s.play_s;
    s.glow_at = Math.max(0, Math.min(Math.round(s.glow_at), s.play_s));
    if (!isObj(s.gold) || typeof s.gold.pid !== 'string') s.gold = null;
    if (typeof s.event_start !== 'string') s.event_start = null;
    s.event_carry = Math.max(0, s.event_carry | 0);
    s.schema_version = SCHEMA_VERSION;
    if (C && from < 2) backfill(C, s);
    if (C) healProgress(C, s);
    return s;
  }

  // Предмет или комната могли стать готовыми без новой победы: картинок у предмета
  // стало меньше (чайная — 2 вместо 3). Отмечаем их так же, как при победе.
  function healProgress(C, s) {
    var day = today(), E = C.economy;
    // Картинки вещи сменились (чайная, 008): вещь, за которую уже была награда
    // или решена снятая картинка, остаётся готовой — новые картинки без монет.
    var retired = C.retired_puzzles || {}, touched = {};
    s.completed_puzzles.forEach(function (pid) { if (retired[pid]) touched[retired[pid]] = true; });
    Object.keys(C.objects).forEach(function (oid) {
      if (isObjectRestored(C, s, oid) || !(touched[oid] || has(s.granted, 'o:' + oid) || has(s.seen_variant_choice, oid))) return;
      C.objects[oid].puzzles.forEach(function (pid) {
        add(s.completed_puzzles, pid);
        add(s.applied_stages, pid);
        add(s.granted, 'p:' + pid);
        delete s.drafts[pid];
      });
      add(s.granted, 'o:' + oid);
      logEvent(s, 'object_healed', { object_id: oid });
    });
    Object.keys(s.drafts).forEach(function (pid) { if (!C.puzzles[pid]) delete s.drafts[pid]; });
    Object.keys(s.lines).forEach(function (pid) { if (!C.puzzles[pid] || has(s.completed_puzzles, pid)) delete s.lines[pid]; });
    Object.keys(C.objects).forEach(function (oid) {
      if (isObjectRestored(C, s, oid) && !s.object_variants[oid]) s.object_variants[oid] = C.objects[oid].variants[0].id;
    });
    roomOrder(C).forEach(function (rid) {
      if (has(s.completed_rooms, rid) || !isRoomUnlocked(C, s, rid) || !isRoomComplete(C, s, rid)) return;
      add(s.completed_rooms, rid);
      grant(s, 'r:' + rid, E.room_reward.coins, E.room_reward.pencils);
      if (E.room_choice && !has(s.granted, 'rc:' + rid)) add(s.room_gifts, rid);
      if (rid === C.daily.after_room && !s.daily.start) s.daily.start = day;
      if (C.event && rid === C.event.after_room) startEvent(C, s, day);
      logEvent(s, 'room_healed', { room_id: rid });
    });
    // Подарок готовой комнаты, затёртый следующей комнатой (до 007), снова ждёт.
    if (E.room_choice) s.completed_rooms.forEach(function (rid) {
      if (C.rooms[rid] && !has(s.granted, 'rc:' + rid)) add(s.room_gifts, rid);
    });
    s.room_gifts = s.room_gifts.filter(function (rid) { return C.rooms[rid] && !has(s.granted, 'rc:' + rid); });
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
  // Монеты за поле: по площади, дальше комната — щедрее (economy.room_coins).
  function puzzleCoins(C, pid) {
    var E = C.economy, p = C.puzzles[pid];
    var n = byArea(E.coins_by_area, area(p), E.coins_per_puzzle);
    var o = p && p.object && C.objects[p.object], R = o && E.room_coins && E.room_coins[o.room];
    if (!R) return n;
    return Math.max(R.min, Math.min(R.max, Math.round(n * R.mult / 5) * 5));
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

  // Монетка за закрытую линию на полях от min_side: каждая строка и столбец —
  // один раз (бит r — строка, H + c — столбец), стёртая и снова закрытая не платит.
  function lineCoinsOn(C, pid) {
    var L = C.economy.line_coins, p = C.puzzles[pid];
    return !!(L && p && p.difficulty !== 'tutorial' && Math.max(p.rows.length, p.rows[0].length) >= L.min_side);
  }

  // Сколько стоит одна линия: крупнее поле — дороже линия (by_side: [сторона, монет]).
  function lineCoinsOf(C, pid) {
    if (!lineCoinsOn(C, pid)) return 0;
    var L = C.economy.line_coins, p = C.puzzles[pid], side = Math.max(p.rows.length, p.rows[0].length), n = L.coins;
    (L.by_side || []).forEach(function (x) { if (side >= x[0]) n = x[1]; });
    return n;
  }

  function closeLine(C, s, pid, kind, idx) {
    if (!lineCoinsOn(C, pid) || has(s.completed_puzzles, pid)) return 0;
    var bit = 1 << (kind === 'row' ? idx : C.puzzles[pid].rows.length + idx), m = s.lines[pid] | 0;
    if (m & bit) return 0;
    s.lines[pid] = m | bit;
    var n = lineCoinsOf(C, pid);
    s.coins += n;
    touch(s);
    return n;
  }

  // Монеты, уже полученные на поле: найденные монетки и закрытые линии.
  function fieldEarned(C, s, pid) {
    var n = 0, m = s.lines[pid] | 0, F = C.economy.field_coins, per = lineCoinsOf(C, pid);
    fieldCoins(C, pid).forEach(function (x, i) { if (has(s.granted, 'f:' + pid + ':' + i)) n += F.coins; });
    for (; m; m &= m - 1) n += per;
    return n;
  }

  // Страховка «Сияния» (не реже раза в 4 минуты игры): если с прошлого прошло
  // field_after_s, в ещё не закрашенной клетке поля (не с монеткой) прячется золотая.
  // Закрасил — монеты, карандаш и сияние на вещи. Ушёл с поля — золотая переедет на следующее.
  function markGlow(s) { s.glow_at = s.play_s || 0; }
  function sinceGlow(s) { return Math.max(0, (s.play_s || 0) - (s.glow_at || 0)); }

  function placeGold(C, s, pid, board) {
    var G = C.economy.glow_pity, p = C.puzzles[pid];
    if (!G || !p || p.difficulty === 'tutorial' || has(s.completed_puzzles, pid)) return null;
    if (s.gold && s.gold.pid === pid) return s.gold;
    if (sinceGlow(s) < G.field_after_s) return null;
    var W = p.rows[0].length, coins = fieldCoins(C, pid), free = [];
    p.rows.forEach(function (row, r) {
      for (var c = 0; c < W; c++) {
        if (row[c] === '#' && !(board && board[r] && board[r][c] === 1) && coins.indexOf(r * W + c) === -1) free.push(r * W + c);
      }
    });
    if (!free.length) return null;
    var cell = free[Math.floor(rand(s) * free.length)];
    s.gold = { pid: pid, r: (cell / W) | 0, c: cell % W };
    touch(s);
    return s.gold;
  }

  // Золотая клетка закрашена (board = null — при победе): награда один раз.
  function collectGold(C, s, pid, board) {
    var g = s.gold, G = C.economy.glow_pity;
    if (!g || !G || g.pid !== pid || board && !(board[g.r] && board[g.r][g.c] === 1)) return null;
    s.gold = null;
    s.coins += G.coins;
    s.pencils += G.pencils;
    var oid = C.puzzles[pid].object || null;
    if (oid) add(s.glows, oid);
    markGlow(s);
    logEvent(s, 'gold_cell', { puzzle_id: pid, object_id: oid, coins: G.coins, pencils: G.pencils });
    touch(s);
    return { r: g.r, c: g.c, coins: G.coins, pencils: G.pencils, object_id: oid };
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
    var G = C.economy.glow_pity, pity = !!G && sinceGlow(s) >= G.chest_after_s;
    var guaranteed = pity || !has(s.granted, 'cr:' + rid) && restoredCount(C, s, rid) >= K.rare_by;
    if (guaranteed || roll < K.rare) {
      out.kind = 'rare';
      out.coins = K.rare_coins;
      add(s.glows, oid);
      markGlow(s);
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

  // Первая невзятая награда за комнату (комнаты — в порядке готовности).
  function pendingGift(C, s) {
    for (var i = 0; i < s.room_gifts.length; i++) {
      var rid = s.room_gifts[i];
      if (C.rooms[rid] && isRoomComplete(C, s, rid) && !has(s.granted, 'rc:' + rid)) return rid;
    }
    return null;
  }

  function pickRoomReward(C, s, rid, i) {
    if (!has(s.room_gifts, rid)) return null;
    var opt = roomChoices(C, s, rid)[i];
    if (!opt) return null;
    s.room_gifts = s.room_gifts.filter(function (r) { return r !== rid; });
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

  /* ---------- уютные покупки ---------- */

  function roomDecor(C, rid) {
    return Object.keys(C.decor || {}).filter(function (id) { return C.decor[id].room === rid; });
  }

  // Места уютных вещей видны с decor_after готовых вещей комнаты.
  function decorOpen(C, s, rid) {
    return !!C.decor && isRoomUnlocked(C, s, rid) && restoredCount(C, s, rid) >= (C.rooms[rid].decor_after | 0);
  }

  // Самая дешёвая не купленная уютная вещь комнаты, на которую уже хватает монет.
  function affordableDecor(C, s, rid) {
    if (!decorOpen(C, s, rid)) return null;
    var best = null;
    roomDecor(C, rid).forEach(function (id) {
      var d = C.decor[id];
      if (!has(s.decor, id) && s.coins >= d.price && (!best || d.price < C.decor[best].price)) best = id;
    });
    return best;
  }

  // Уютная вещь за монеты: сразу встаёт в комнату.
  function buyDecor(C, s, id) {
    var d = (C.decor || {})[id];
    if (!d) return { ok: false, reason: 'unknown' };
    if (has(s.decor, id)) return { ok: false, reason: 'owned' };
    if (!decorOpen(C, s, d.room)) return { ok: false, reason: 'locked' };
    if (s.coins < d.price) return { ok: false, reason: 'coins', need: d.price - s.coins };
    s.coins -= d.price;
    s.decor.push(id);
    logEvent(s, 'buy_decor', { decor_id: id, room_id: d.room, coins: d.price });
    touch(s);
    return { ok: true };
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
    var n = s.stamps.days.length;
    out.push({ type: 'stamp', n: n, of: C.stamps.card_size });
    // Подарки по дороге: на 2-й и 4-й штамп (C.stamps.steps), полная карточка — главный.
    var step = C.stamps.steps && C.stamps.steps[n];
    if (step) grant(s, 'st:' + s.stamps.card + ':' + n, step.coins || 0, step.pencils || 0).forEach(function (r) { r.stamp_step = n; out.push(r); });
    if (n < C.stamps.card_size) return;
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
    if (roomDone) { add(s.completed_rooms, rid); markGlow(s); }

    rewards = rewards.concat(grant(s, 'p:' + pid, puzzleCoins(C, pid), 0));
    // Не найденные по ходу монетки поля (подсказка, карандаш) — при победе.
    var rest = collectFieldCoins(C, s, pid, null).reduce(function (n, f) { return n + f.n; }, 0);
    if (rest) rewards.push({ type: 'coins', n: rest, key: 'f:' + pid });
    // Золотая клетка, закрашенная последней или подсказкой, — тоже при победе.
    var gold = collectGold(C, s, pid, null);
    if (gold) rewards.push({ type: 'coins', n: gold.coins, key: 'g:' + pid }, { type: 'pencils', n: gold.pencils, key: 'g:' + pid });
    delete s.hints[pid];
    var lineBits = s.lines[pid] | 0, lines = 0;
    for (; lineBits; lineBits &= lineBits - 1) lines++;
    delete s.lines[pid];
    if (p.difficulty === 'tutorial') rewards = rewards.concat(grant(s, 't:tutorial', 0, E.tutorial_pencils));
    rewards = rewards.concat(grant(s, 'd:' + day, E.coins_daily_first, 0));
    var chest = null;
    if (objectDone) {
      var ob = E.object_bonus || [];
      rewards = rewards.concat(grant(s, 'o:' + oid, ob[Math.min(ob.length, C.objects[oid].puzzles.length) - 1] || 0, 0));
      chest = openChest(C, s, oid);
    }
    if (roomDone) rewards = rewards.concat(grant(s, 'r:' + rid, E.room_reward.coins, E.room_reward.pencils));
    if (roomDone && E.room_choice && !has(s.granted, 'rc:' + rid)) add(s.room_gifts, rid);
    if (roomDone && rid === C.daily.after_room && !s.daily.start) s.daily.start = day;
    if (roomDone && C.event && rid === C.event.after_room) startEvent(C, s, day);
    addStamp(C, s, day, rewards);
    var eventDone = false;
    if (p.kind === 'event' && C.event && C.event.lanterns.every(function (L) { return has(s.completed_puzzles, L.id); })) {
      var er = grant(s, 'ev:' + C.event.id, C.event.reward.coins || 0, C.event.reward.pencils || 0);
      eventDone = er.length > 0;
      rewards = rewards.concat(er);
      if (eventDone) logEvent(s, 'event_complete', { id: C.event.id, day: day });
    }

    logEvent(s, 'puzzle_complete', { puzzle_id: pid, object_id: oid, object_done: objectDone, room_done: roomDone, day: day, lines: lines });
    touch(s);
    return { duplicate: false, object_done: objectDone, room_done: roomDone, object_id: oid, room_id: rid,
      stage: oid ? objectStage(C, s, oid) : 0, rewards: rewards, chest: chest,
      room_choice: roomDone && has(s.room_gifts, rid), event_done: eventDone, gold: gold };
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

  // Подарок вернувшемуся — раз в день возвращения, растёт с паузой:
  // день — монеты, три дня — монеты и карандаши, неделя — вещь для дома
  // (самое дешёвое не купленное оформление готового предмета; нет такого — монеты).
  function comebackGift(C, s, away, day) {
    var tiers = (C.economy.comeback && C.economy.comeback.tiers) || [], T = null;
    day = day || today();
    tiers.forEach(function (t) { if (away >= t.after_days) T = t; });
    if (!T || s.story_flags.comeback_day === day) return null;
    s.story_flags.comeback_day = day;
    var gift = { coins: 0, pencils: T.pencils || 0, variants: [] };
    var vid = T.variant ? cheapestVariant(C, s) : null;
    if (vid) {
      var f = findVariant(C, vid);
      add(s.owned_variants, vid);
      s.object_variants[f.object] = vid;
      add(s.seen_variant_choice, f.object);
      gift.variants.push(vid);
    } else gift.coins = T.coins || 0;
    s.coins += gift.coins;
    s.pencils += gift.pencils;
    logEvent(s, 'comeback_gift', { away: away, coins: gift.coins, pencils: gift.pencils, variants: gift.variants });
    touch(s);
    return gift;
  }

  function cheapestVariant(C, s) {
    var best = null, sv = skuVariants(C);
    openRooms(C, s).forEach(function (rid) {
      C.rooms[rid].objects.forEach(function (oid) {
        if (!isObjectRestored(C, s, oid)) return;
        C.objects[oid].variants.forEach(function (v) {
          if (v.premium && v.price_coins && !has(s.owned_variants, v.id) && !has(sv, v.id) &&
            (!best || v.price_coins < best.price_coins)) best = v;
        });
      });
    });
    return best ? best.id : null;
  }

  // Накопившиеся письма не сваливаются пачкой: сегодняшнее остаётся картинкой,
  // пришедшие раньше сразу ложатся в альбом открытками.
  function deliverLetters(C, s, day) {
    var got = [];
    dailyLetters(C, s, day).forEach(function (l) {
      if (l.status !== 'open') return;
      add(s.completed_puzzles, l.id);
      add(s.daily.opened, l.id);
      delete s.drafts[l.id];
      got.push(l.id);
    });
    if (got.length) { logEvent(s, 'letters_delivered', { ids: got }); touch(s); }
    return got;
  }

  /* ---------- время игры и платные предложения ---------- */

  // Секунды в игре: тикает, пока вкладка видна и игрок что-то делает.
  function addPlayTime(s, sec) { s.play_s = Math.round((s.play_s || 0) + Math.max(0, Math.min(sec || 0, 30))); }

  // Наборы за голоса — не раньше paid_after_s секунд игры и готовой прихожей
  // (ТЗ: первые 10 минут — никаких платёжных окон).
  function paidOpen(C, s) {
    return (s.play_s || 0) >= (C.economy.paid_after_s || 0) && isRoomComplete(C, s, C.daily.after_room);
  }

  /* ---------- секреты дома ---------- */

  function secretsCount(C, s, rid) {
    var list = (rid ? C.rooms[rid].objects : Object.keys(C.objects)).filter(function (oid) { return !!C.objects[oid].tap_secret; });
    return { n: list.filter(function (oid) { return has(s.secrets, oid); }).length, of: list.length };
  }

  // Первое касание готовой вещи открывает её секрет: монетки. Все секреты
  // комнаты — «Сияние» на всех её вещах и монеты за набор.
  function findSecret(C, s, oid) {
    var o = C.objects[oid];
    if (!o || !o.tap_secret || !isObjectRestored(C, s, oid) || has(s.secrets, oid)) return null;
    var R = C.economy.secrets || {}, rid = o.room, roomSet = null;
    s.secrets.push(oid);
    var rewards = grant(s, 'sec:' + oid, R.coins || 0, 0);
    var room = secretsCount(C, s, rid);
    if (room.n === room.of) {
      rewards = rewards.concat(grant(s, 'secs:' + rid, R.room_coins || 0, 0));
      C.rooms[rid].objects.forEach(function (x) { add(s.glows, x); });
      roomSet = rid;
    }
    var all = secretsCount(C, s);
    logEvent(s, 'secret_found', { object_id: oid, n: all.n, room_set: roomSet });
    touch(s);
    return { n: all.n, of: all.of, room: room, rewards: rewards, room_set: roomSet };
  }

  /* ---------- «Вечер фонариков»: событие на время ---------- */

  // Начинается с готовой прихожей и длится days дней: в первый день открыто
  // open_first фонариков, дальше по одному в день. Нерешённые гаснут с концом события.
  function startEvent(C, s, day) {
    var E = C.event;
    if (!E || s.event_start || !isRoomComplete(C, s, E.after_room)) return false;
    s.event_start = day || today();
    logEvent(s, 'event_start', { id: E.id, day: s.event_start });
    touch(s);
    return true;
  }

  // Вечер кончился, а зажжены не все, — начинается новый на столько же дней (круг 9):
  // зажжённые горят, сверх них открыто столько же, сколько в первый день.
  function renewEvent(C, s, day) {
    var ev = eventInfo(C, s, day);
    if (!ev || !ev.over || ev.complete) return false;
    s.event_start = day || today();
    s.event_carry = ev.done;
    logEvent(s, 'event_renew', { id: ev.id, day: s.event_start, done: ev.done });
    touch(s);
    return true;
  }

  function eventInfo(C, s, day) {
    var E = C.event;
    if (!E || !s.event_start) return null;
    day = day || today();
    var since = Math.max(0, daysBetween(s.event_start, day));
    var open = Math.min(E.lanterns.length, E.open_first + since + (s.event_carry | 0));
    var items = E.lanterns.map(function (L, i) {
      return { id: L.id, title: L.title, status: has(s.completed_puzzles, L.id) ? 'solved' : i < open ? 'open' : 'locked' };
    });
    var done = items.filter(function (x) { return x.status === 'solved'; }).length;
    return { id: E.id, title: E.title, days_left: Math.max(0, E.days - since), over: since >= E.days,
      items: items, done: done, of: items.length, complete: done === items.length,
      waiting: items.filter(function (x) { return x.status === 'open'; }).length };
  }

  // Можно ли зажечь фонарик сейчас.
  function eventOpen(C, s, pid, day) {
    var ev = eventInfo(C, s, day);
    return !!ev && !ev.over && ev.items.some(function (x) { return x.id === pid && x.status === 'open'; });
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
      // Версию читаем до переноса: migrate правит сам сейв, и иначе «перенос» писался бы каждый запуск.
      var from = parsed && typeof parsed === 'object' ? parsed.schema_version | 0 : 0;
      var s = migrate(parsed, C);
      if (!s) throw new Error('bad save');
      var out = { state: s, fresh: false, storage_ok: true };
      if (from < SCHEMA_VERSION) out.migrated_from = from;
      return out;
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
    delete o.lines;
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
    s.lines = local.lines;
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
    lineCoinsOn: lineCoinsOn, lineCoinsOf: lineCoinsOf, closeLine: closeLine, fieldEarned: fieldEarned,
    markGlow: markGlow, sinceGlow: sinceGlow, placeGold: placeGold, collectGold: collectGold,
    freeHintsLeft: freeHintsLeft, useFreeHint: useFreeHint, openChest: openChest,
    roomChoices: roomChoices, pickRoomReward: pickRoomReward, pendingGift: pendingGift, affordableVariant: affordableVariant,
    roomDecor: roomDecor, decorOpen: decorOpen, affordableDecor: affordableDecor, buyDecor: buyDecor,
    saveDraft: saveDraft, completePuzzle: completePuzzle, chooseVariant: chooseVariant,
    closeVariantChoice: closeVariantChoice, buyVariant: buyVariant, buyPencil: buyPencil, usePencil: usePencil,
    canOfferSku: canOfferSku, applyOrder: applyOrder, adsLeft: adsLeft, rewardedGrant: rewardedGrant,
    stampsActive: stampsActive, dailyLetters: dailyLetters, todayLetter: todayLetter, lettersBadge: lettersBadge,
    openLetterEnvelope: openLetterEnvelope,
    setFlag: setFlag, registerVisit: registerVisit, daysAway: daysAway, comebackGift: comebackGift, logEvent: logEvent, setEventHook: setEventHook,
    deliverLetters: deliverLetters, addPlayTime: addPlayTime, paidOpen: paidOpen,
    secretsCount: secretsCount, findSecret: findSecret, startEvent: startEvent, renewEvent: renewEvent, eventInfo: eventInfo, eventOpen: eventOpen,
    encodeBoard: encodeBoard, decodeBoard: decodeBoard, load: load, persist: persist,
    cloudSave: cloudSave, preferRemote: preferRemote, adoptRemote: adoptRemote
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HopState = api;
})(this);
