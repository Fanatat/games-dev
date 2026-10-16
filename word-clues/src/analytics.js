/* Журнал событий воронки (ТЗ §14.2, G1F-005). Последние 600 событий лежат в браузере
   (настройки → «Журнал», видно при ?journal). Если сборке задан адрес сборщика
   (<meta name="g1f-telemetry">), события пачками уходят туда же: sendBeacon с
   text/plain (без предварительного запроса CORS), каждые 15 с и при сворачивании.
   Не отправленное лежит в очереди и уходит при следующем запуске.
   Без VK ID, имён, IP в теле и введённых строк: только случайный ключ игрока. */
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
    sessionId: sessionId, playerKey: playerKey };
})(this);
