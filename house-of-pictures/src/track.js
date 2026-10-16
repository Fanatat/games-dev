/* События игры на сервер — для отчёта server/app.py --stats (ТЗ 03, раздел 8):
   воронка новичка, активные минуты, интерес к лавке и письмам.
   Источник — тот же журнал, что в сейве (St.logEvent): новых мест разметки нет.
   Работает только вместе с облаком (ВК + адрес API). Очередь — отдельно от
   сейва (hop.events.v1), пакетами раз в 30 с и при уходе со страницы.
   Активное время — вкладка видна и был ввод за последние 60 с; раз в 30 с
   уходит heartbeat {active_ms}. Сессия — новая при каждом запуске и после
   30 мин без ввода. Ни текста писем, ни профиля ВК в событиях нет. */
window.HopTrack = (function () {
  'use strict';

  var QKEY = 'hop.events.v1';
  var QUEUE_MAX = 400;       // сверх — старые выбрасываются (сеть долго лежит)
  var BATCH = 40;
  var SEND_MS = 30000;
  var IDLE_MS = 60000;       // ввод старше — время не активное
  var SESSION_GAP = 30 * 60000;
  var TICK = 1000;

  var St = window.HopState;
  var enabled = !!(window.HopCloud && HopCloud.enabled && St && St.setEventHook);
  var meta = document.querySelector('meta[name="hop-build"]');
  var build = ((meta && meta.getAttribute('content')) || 'dev').slice(0, 48);
  var queue = [];
  var seq = 0;
  var sid = newId();
  var lastInput = Date.now();
  var lastTick = Date.now();
  var active = 0;            // мс активного времени за запуск
  var beatFrom = 0;          // active на момент прошлого heartbeat
  var puzzleFrom = null;     // active на момент puzzle_start
  var sending = false;

  function newId() {
    var a = '';
    for (var i = 0; i < 12; i++) a += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36));
    return a;
  }

  function load() {
    try {
      var q = JSON.parse(localStorage.getItem(QKEY) || '[]');
      if (Array.isArray(q)) queue = q.filter(function (e) { return e && typeof e.id === 'string'; }).slice(-QUEUE_MAX);
    } catch (e) { queue = []; }
  }
  function store() {
    try { localStorage.setItem(QKEY, JSON.stringify(queue)); } catch (e) { /* место кончилось — шлём из памяти */ }
  }

  function add(name, data) {
    var e = { id: sid.slice(0, 6) + Date.now().toString(36) + (seq++).toString(36), sid: sid, at: Date.now(), name: name };
    if (data) e.data = data;
    queue.push(e);
    if (queue.length > QUEUE_MAX) queue.splice(0, queue.length - QUEUE_MAX);
    store();
  }

  // Слушатель журнала. data копируется: журнал в сейве не трогаем.
  function onEvent(type, data) {
    var d = data ? JSON.parse(JSON.stringify(data)) : null;
    if (type === 'puzzle_start') puzzleFrom = active;
    if (type === 'puzzle_complete' && puzzleFrom !== null) {
      d = d || {};
      d.active_ms = Math.round(active - puzzleFrom);
      puzzleFrom = null;
    }
    add(type, d);
  }

  function isActive(now) { return document.visibilityState === 'visible' && now - lastInput < IDLE_MS; }

  function tick() {
    var now = Date.now();
    var dt = Math.min(now - lastTick, 5 * TICK); // спящая вкладка не копит время
    lastTick = now;
    if (isActive(now)) active += dt;
  }

  function beat() {
    var ms = Math.round(active - beatFrom);
    if (ms > 0) { beatFrom = active; add('heartbeat', { active_ms: ms }); }
  }

  // Отправить, что накопилось. keepalive — при уходе со страницы (без ответа).
  function flush(keepalive) {
    if (!enabled || !queue.length) return Promise.resolve(null);
    if (keepalive) {
      HopCloud.events(queue.slice(0, BATCH), build, true);
      return Promise.resolve(null);
    }
    if (sending) return Promise.resolve(null);
    sending = true;
    var part = queue.slice(0, BATCH);
    return HopCloud.events(part, build, false).then(function (r) {
      sending = false;
      if (!r) return null;
      var sent = {};
      part.forEach(function (e) { sent[e.id] = true; });
      queue = queue.filter(function (e) { return !sent[e.id]; });
      store();
      return queue.length >= BATCH ? flush(false) : r;
    }, function () { sending = false; return null; });
  }

  function input() {
    var now = Date.now();
    if (now - lastInput > SESSION_GAP) { beat(); sid = newId(); add('session_resume', { idle_min: Math.round((now - lastInput) / 60000) }); }
    lastInput = now;
  }

  if (enabled) {
    load();
    St.setEventHook(onEvent);
    ['pointerdown', 'keydown', 'wheel'].forEach(function (t) { document.addEventListener(t, input, { capture: true, passive: true }); });
    setInterval(tick, TICK);
    setInterval(function () { beat(); flush(false); }, SEND_MS);
    document.addEventListener('visibilitychange', function () {
      tick();
      if (document.visibilityState === 'hidden') { beat(); flush(true); }
      else lastInput = Date.now();
    });
    window.addEventListener('pagehide', function () { tick(); beat(); flush(true); });
  }

  return {
    enabled: enabled,
    flush: function () { tick(); beat(); return flush(false); },
    pending: function () { return queue.length; },
    activeMs: function () { return active; }
  };
})();
