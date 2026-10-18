/* Журнал событий воронки (ТЗ §14.2, G1F-005). Последние 600 событий лежат в браузере
   (настройки → «Журнал», видно при ?journal). Если сборке задан адрес сборщика
   (<meta name="g1f-telemetry">), события пачками уходят туда же: sendBeacon с
   text/plain (без предварительного запроса CORS), каждые 15 с и при сворачивании.
   Не отправленное лежит в очереди и уходит при следующем запуске.
   Без VK ID, имён, IP в теле и введённых строк: только случайный ключ игрока.

   Яндекс.Метрика (счётчик METRIKA_ID, docs/TELEMETRY.md): то же событие, что ушло в
   журнал, при совпадении с таблицей GOALS уходит ещё и целью reachGoal — свой сборщик
   выше не меняется. Порт game1/analytics.js (Словоход): параметры цели вложены под
   её имя, только числа/строки/true-false; вебвизор, карта кликов, ссылки — выключены.
   Отправка только в собранной игре (мета g1f-build ≠ 'dev', ставит tools/build.py) и
   не на локальном адресе (localhost, file:, 127.x, частные сети, *.local) — автотесты
   и ручной запуск из исходников счётчик не засоряют. Стенд games-dev — тоже площадка:
   шлёт, с параметром визита platform=dev. tag.js грузится асинхронно по событию
   game_ready (игра уже показана); до загрузки цели копятся в очереди (до 50, лишние
   отбрасываются); не загрузился (адблок, нет сети) — цели молча пропадают. До вставки
   tag.js из адреса фрейма убираются sign/vk_* (кроме vk_platform, vk_language), а
   реферер урезается до origin: tag.js читает адрес сам, мимо опций init. */
(function (root) {
  'use strict';
  var KEY = 'g1f1.journal.v1', OUTBOX = 'g1f1.outbox.v1', DAYS = 'g1f1.days';
  var MAX = 600, OUT_MAX = 400, BATCH = 60, SEND_MS = 15000;
  var buf = [];
  try { buf = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { buf = []; }

  function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  var playerKey;
  try { playerKey = localStorage.getItem('g1f1.player') || rid(); localStorage.setItem('g1f1.player', playerKey); }
  catch (e) { playerKey = rid(); }
  var sessionId = rid();
  var meta = document.querySelector('meta[name="g1f-build"]');
  var build = meta ? meta.content : 'dev';
  var tmeta = document.querySelector('meta[name="g1f-telemetry"]');
  var endpoint = root.G1F_TELEMETRY || (tmeta && tmeta.content) || '';
  var t0 = Date.now();
  var timer = null;
  var out = [];
  if (endpoint) { try { out = JSON.parse(localStorage.getItem(OUTBOX) || '[]'); } catch (e) { out = []; } }

  // Дни игрока: номер дня от первого запуска (для D1/D7) и возврат в новый день.
  function dayStr(t) { var d = new Date(t); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayNum(s) { var p = s.split('-'); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5); }
  var today = dayStr(t0), days = null, returned = null;
  try { days = JSON.parse(localStorage.getItem(DAYS) || 'null'); } catch (e) { days = null; }
  if (!days || !days.first) days = { first: today, last: today, n: 1 };
  else if (days.last !== today) {
    returned = { days_since_first: dayNum(today) - dayNum(days.first), days_since_last: dayNum(today) - dayNum(days.last), day_count: days.n + 1 };
    days.last = today; days.n++;
  }
  try { localStorage.setItem(DAYS, JSON.stringify(days)); } catch (e) { /* без дней */ }
  var day = dayNum(today) - dayNum(days.first);

  function persist() {
    timer = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(buf.slice(-MAX)));
      if (endpoint) localStorage.setItem(OUTBOX, JSON.stringify(out.slice(-OUT_MAX)));
    } catch (e) { /* журнал не важнее игры */ }
  }

  /* ---------- Яндекс.Метрика (см. шапку) ---------- */
  var METRIKA_ID = 113661734;   // счётчик «Слова по уликам», заведён 17.10.2026; 0 — отправка выключена
  var TAG_URL = 'https://mc.yandex.ru/metrika/tag.js', YM_QUEUE = 50;
  // Событие журнала → цель Метрики и её параметры (null — цель без параметров).
  // Функция возвращает false — в этот раз цель не отправляется.
  var GOALS = {
    game_ready: ['game_loaded', function (f) { return { completed: f.completed }; }],
    first_input: ['first_move', null],
    story_start: ['level_start', function (f) { return { story: f.story_id, index: f.story_index }; }],
    story_complete: ['level_win', function (f) { return { story: f.story_id, kind: f.kind, first: !!f.first }; }],
    story_leave: ['level_quit', function (f) { return { story: f.story_id, solved: f.solved }; }],
    return_day: ['return_day', function (f) { return { day: f.days_since_first }; }],
    hint_used: ['hint_used', function (f) { return { story: f.story_id, type: f.hint_type }; }],
    daily_solved: ['daily_solved', function (f) { return { streak: f.streak }; }],
    chapter_finale: ['chapter_complete', function (f) { return { chapter: f.chapter }; }],
    lantern_lit: ['lantern_lit', function (f) { return { count: f.count, from: f.from }; }],
    atlas_cover: ['cover_bought', function (f) { return f.bought ? { cover: f.cover, price: f.price } : false; }],
    share_done: ['share_done', function (f) { return f.method && f.method !== 'cancel' ? { from: f.from, method: f.method } : false; }]
  };

  function isLocalRun() {
    try {
      var host = String(location.hostname || '').toLowerCase();
      if (!host || location.protocol === 'file:') return true;
      if (host === 'localhost' || /\.localhost$/.test(host) || /\.local$/.test(host)) return true;
      if (host.charAt(0) === '[' || host.indexOf(':') !== -1) {
        var h6 = host.replace(/^\[|\]$/g, '');
        return h6 === '::1' || /^fe[89ab][0-9a-f]:/.test(h6) || /^f[cd][0-9a-f]{2}:/.test(h6);
      }
      var m = /^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/.exec(host);
      if (!m) return false;
      var a = +m[1], b = +m[2];
      return a === 127 || a === 10 || a === 0 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31) || (a === 169 && b === 254);
    } catch (e) { return true; }
  }
  var ymOff = build === 'dev' ? 'запуск из исходников, не сборка' : !(METRIKA_ID > 0) ? 'счётчик не задан'
    : isLocalRun() ? 'локальный запуск сборки' : '';
  var ymState = ymOff ? 'off' : 'idle', ymQueue = [];   // idle → loading → ready | failed; off — выключено

  function ymPlatform() {
    try { if (location.pathname.indexOf('/games-dev/') !== -1) return 'dev'; } catch (e) { return 'dev'; }
    return root.Platform ? root.Platform.name : 'web';
  }
  function cleanParams(p) {
    var o = null;
    for (var k in p || {}) {
      var v = p[k], t = typeof v;
      if (Object.prototype.hasOwnProperty.call(p, k) && (t === 'number' ? isFinite(v) : (t === 'string' || t === 'boolean'))) { o = o || {}; o[k] = v; }
    }
    return o;
  }
  function ymCall() { try { root.ym.apply(null, arguments); } catch (e) { /* молчим */ } }
  function ymSend(goal, params) {
    if (params) { var o = {}; o[goal] = params; ymCall(METRIKA_ID, 'reachGoal', goal, o); }
    else ymCall(METRIKA_ID, 'reachGoal', goal);
  }
  // Параметры запуска ВК в адресе фрейма: sign, vk_* (кроме vk_platform, vk_language), odr_enabled.
  function stripLaunchParams() {
    try {
      var q = location.search || '';
      if (q.length < 2) return;
      var keep = [], removed = 0;
      q.slice(1).split('&').forEach(function (part) {
        if (!part) return;
        var key = part.split('=')[0];
        try { key = decodeURIComponent(key.replace(/\+/g, ' ')); } catch (e) { /* как есть */ }
        key = key.toLowerCase();
        if (key !== 'vk_platform' && key !== 'vk_language' && (key === 'sign' || key === 'odr_enabled' || key.indexOf('vk_') === 0)) removed++;
        else keep.push(part);
      });
      if (removed) history.replaceState(history.state, '', location.pathname + (keep.length ? '?' + keep.join('&') : '') + location.hash);
    } catch (e) { /* хит и цели всё равно идут с очищенным url */ }
  }
  function ymStart() {
    if (ymState !== 'idle') return;
    ymState = 'loading';
    try {
      var url = location.protocol + '//' + location.host + location.pathname;
      var m = /^(https?:\/\/[^\/?#]+)/.exec(document.referrer || ''), ref = m ? m[1] + '/' : '';
      stripLaunchParams();
      try { if ((document.referrer || '') !== ref) Object.defineProperty(document, 'referrer', { configurable: true, get: function () { return ref; } }); } catch (e) { /* не вышло */ }
      root.ym = root.ym || function () { (root.ym.a = root.ym.a || []).push(arguments); };
      root.ym.l = 1 * new Date();
      ymCall(METRIKA_ID, 'init', { defer: true, url: url, referrer: ref, clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false });
      ymCall(METRIKA_ID, 'hit', url, { referer: ref, title: document.title, params: { platform: ymPlatform(), build: build } });
      var s = document.createElement('script');
      s.async = true;
      s.src = TAG_URL;
      s.onload = function () {
        if (ymState !== 'loading') return;
        ymState = 'ready';
        var q = ymQueue; ymQueue = [];
        q.forEach(function (g) { ymSend(g[0], g[1]); });
      };
      s.onerror = function () { ymState = 'failed'; ymQueue = []; };
      (document.head || document.documentElement).appendChild(s);
    } catch (e) { ymState = 'failed'; ymQueue = []; }
  }
  function metrika(name, fields) {
    var g = GOALS[name];
    if (!g) return;
    var params = g[1] ? g[1](fields) : null;
    if (params === false) return;
    params = cleanParams(params);
    if (root.G1F_DEBUG) console.log('[metrika]', ymOff ? 'выкл: ' + ymOff : ymState, g[0], params || '');
    if (ymState === 'off' || ymState === 'failed') return;
    if (ymState === 'ready') { ymSend(g[0], params); return; }
    if (ymQueue.length < YM_QUEUE) ymQueue.push([g[0], params]);
    if (name === 'game_ready') ymStart();   // tag.js — после показа игры
  }

  function event(name, fields) {
    var e = { event_id: rid(), event_name: name, schema_version: 1, timestamp_utc: new Date().toISOString(),
      t_ms: Date.now() - t0, session_id: sessionId, player_key: playerKey, build_id: build, platform: root.Platform ? root.Platform.name : 'web',
      content_version: root.G1F_CONTENT ? root.G1F_CONTENT.content_version : null, day: day };
    for (var k in fields || {}) e[k] = fields[k];
    buf.push(e);
    if (buf.length > MAX) buf = buf.slice(-MAX);
    if (endpoint) { out.push(e); if (out.length > OUT_MAX) out = out.slice(-OUT_MAX); }
    if (!timer) timer = setTimeout(persist, 500);
    if (root.G1F_DEBUG) console.log('[event]', name, fields || '');
    try { metrika(name, fields || {}); } catch (err) { /* Метрика не роняет игру */ }
    return e;
  }

  // Отправка: пачка уходит, только если браузер принял её в очередь (sendBeacon → true).
  var sent = 0;
  function send() {
    if (!endpoint || !out.length) return;
    var batch = out.slice(0, BATCH), ok = false;
    var body = JSON.stringify({ v: 1, events: batch });
    try {
      if (navigator.sendBeacon) ok = navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain' }));
      else if (root.fetch) { fetch(endpoint, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' }); ok = true; }
    } catch (e) { ok = false; }
    if (ok) { out = out.slice(batch.length); sent += batch.length; persist(); if (out.length) send(); }
  }
  function flush() { persist(); send(); }

  var hiddenAt = 0;
  function onHide(reason) {
    if (hiddenAt) return;
    hiddenAt = Date.now();
    event('session_end', { reason: reason, session_ms: hiddenAt - t0 });
    flush();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) onHide('hidden');
    else if (hiddenAt) { event('session_resume', { away_ms: Date.now() - hiddenAt }); hiddenAt = 0; }
  });
  root.addEventListener('pagehide', function () { onHide('pagehide'); });
  if (endpoint) setInterval(send, SEND_MS);

  function exportJson() {
    persist();
    var blob = new Blob([JSON.stringify({ player_key: playerKey, build: build, events: buf }, null, 1)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'journal-' + playerKey + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  }

  if (returned) event('return_day', returned);

  root.Analytics = { event: event, flush: flush, send: send, exportJson: exportJson, get events() { return buf; },
    get outbox() { return out; }, get sent() { return sent; }, endpoint: endpoint, day: day,
    sessionId: sessionId, playerKey: playerKey, METRIKA_ID: METRIKA_ID, GOALS: GOALS,
    metrika: function () { return { enabled: !ymOff, off: ymOff, state: ymState, queued: ymQueue.length, platform: ymPlatform() }; } };
})(this);
