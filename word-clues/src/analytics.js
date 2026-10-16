/* Журнал событий первой воронки (ТЗ §14.2, G1F-005). На P0 никуда не отправляется:
   последние 600 событий лежат в браузере, для плейтеста их выгружают в JSON
   (настройки → «Журнал», видно при ?journal). Без VK ID, имён и введённых строк. */
(function (root) {
  'use strict';
  var KEY = 'g1f1.journal.v1';
  var MAX = 600;
  var buf = [];
  try { buf = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { buf = []; }

  function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  var playerKey;
  try { playerKey = localStorage.getItem('g1f1.player') || rid(); localStorage.setItem('g1f1.player', playerKey); }
  catch (e) { playerKey = rid(); }
  var sessionId = rid();
  var meta = document.querySelector('meta[name="g1f-build"]');
  var build = meta ? meta.content : 'dev';
  var t0 = Date.now();
  var timer = null;

  function persist() {
    timer = null;
    try { localStorage.setItem(KEY, JSON.stringify(buf.slice(-MAX))); } catch (e) { /* журнал не важнее игры */ }
  }

  function event(name, fields) {
    var e = { event_id: rid(), event_name: name, schema_version: 1, timestamp_utc: new Date().toISOString(),
      t_ms: Date.now() - t0, session_id: sessionId, player_key: playerKey, build_id: build, platform: 'web',
      content_version: root.G1F_CONTENT ? root.G1F_CONTENT.content_version : null };
    for (var k in fields || {}) e[k] = fields[k];
    buf.push(e);
    if (buf.length > MAX) buf = buf.slice(-MAX);
    if (!timer) timer = setTimeout(persist, 500);
    if (root.G1F_DEBUG) console.log('[event]', name, fields || '');
    return e;
  }

  function exportJson() {
    persist();
    var blob = new Blob([JSON.stringify({ player_key: playerKey, build: build, events: buf }, null, 1)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'journal-' + playerKey + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  }

  root.Analytics = { event: event, flush: persist, exportJson: exportJson, get events() { return buf; }, sessionId: sessionId, playerKey: playerKey };
})(this);
