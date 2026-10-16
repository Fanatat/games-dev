/* Звук «Дома картинок»: короткие сэмплы (CC0, см. assets/sfx/CREDITS.md).
   Упрощённый наследник game2/sound.js: WebAudio, загрузка фоном, разблокировка
   первым жестом, пауза при скрытой странице, отдельные выключатели звука и
   вибрации. Ноты закрытых линий идут вверх по пентатонике, пока игрок
   закрывает линии подряд (окно 2,5 с). */
window.Sound = (function () {
  'use strict';

  var BASE = 'assets/sfx/';
  var EVENTS = {
    fill: { files: ['fill_soft_1', 'fill_soft_2', 'fill_soft_3'], vol: 0.45, gap: 35 },
    cross: { files: ['cross_tick_1', 'cross_tick_2'], vol: 0.4, gap: 35 },
    erase: { files: ['erase_slide_1'], vol: 0.35, gap: 50 },
    line: { files: ['line_marimba_D5', 'line_marimba_E5', 'line_marimba_G5', 'line_marimba_A5', 'line_marimba_B5', 'line_marimba_D6'], vol: 0.55, gap: 40 },
    win: { files: ['win_marimba'], vol: 0.7 },
    reward: { files: ['reward_bell'], vol: 0.65 },
    chord: { files: ['reward_chord'], vol: 0.7 },
    unlock: { files: ['unlock_glock'], vol: 0.6 },
    tap: { files: ['ui_tap_1'], vol: 0.45, gap: 40 },
    toggle: { files: ['ui_toggle'], vol: 0.45 },
    back: { files: ['ui_back'], vol: 0.45 },
    hint: { files: ['hint_sparkle'], vol: 0.55 },
    coin: { files: ['reward_bell'], vol: 0.4, gap: 120 },
    note: { files: ['line_marimba_D5', 'line_marimba_E5', 'line_marimba_G5', 'line_marimba_A5', 'line_marimba_B5', 'line_marimba_D6'], vol: 0.5 }
  };
  // Вальс шкатулки на три четверти: [доля, нота D5 E5 G5 A5 B5 D6 = 0..5].
  var WALTZ = [[0, 2], [1, 4], [2, 5], [3, 4], [6, 3], [7, 2], [8, 1], [9, 0], [12, 1], [13, 2], [14, 4], [15, 3], [16, 2], [17, 1], [18, 2]];
  var BEAT = 0.34;
  var COMBO_MS = 2500;

  var ctx = null, master = null;
  var buffers = {};
  var enabled = true, vibration = true;
  var lastAt = {}, lastIdx = {};
  var combo = 0, comboAt = 0;
  var loading = false;

  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    return ctx;
  }

  function loadAll() {
    if (loading || !ctx) return;
    loading = true;
    Object.keys(EVENTS).forEach(function (ev) {
      EVENTS[ev].files.forEach(function (name) {
        fetch(BASE + name + '.mp3').then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.arrayBuffer();
        }).then(function (ab) {
          return new Promise(function (res, rej) { ctx.decodeAudioData(ab, res, rej); });
        }).then(function (buf) { buffers[name] = buf; })
          .catch(function () { /* нет файла — событие молчит, игра идёт */ });
      });
    });
  }

  // Первый жест создаёт и будит контекст (политика автоплея, iOS).
  function unlock() {
    if (!ensureCtx()) return;
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume();
    loadAll();
  }
  ['pointerdown', 'touchend', 'keydown'].forEach(function (t) {
    window.addEventListener(t, unlock, { capture: true, passive: true });
  });
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  function play(ev, opts) {
    opts = opts || {};
    if (!enabled || !ctx || ctx.state !== 'running') return;
    var spec = EVENTS[ev];
    if (!spec) return;
    var now = performance.now();
    if (spec.gap && lastAt[ev] && now - lastAt[ev] < spec.gap) return;
    lastAt[ev] = now;
    var idx = opts.index;
    if (idx === undefined) {
      idx = Math.floor(Math.random() * spec.files.length);
      if (spec.files.length > 1 && idx === lastIdx[ev]) idx = (idx + 1) % spec.files.length;
    }
    lastIdx[ev] = idx;
    var buf = buffers[spec.files[Math.min(idx, spec.files.length - 1)]];
    if (!buf) return;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = 1 + (Math.random() - 0.5) * 0.04;
    var g = ctx.createGain();
    g.gain.value = spec.vol * (opts.vol || 1);
    src.connect(g); g.connect(master);
    src.start(ctx.currentTime + (opts.delay || 0));
  }

  // Нота закрытой линии: каждая следующая в окне COMBO_MS — ступенью выше.
  function line() {
    var now = performance.now();
    combo = (now - comboAt < COMBO_MS) ? Math.min(combo + 1, EVENTS.line.files.length - 1) : 0;
    comboAt = now;
    play('line', { index: combo });
  }

  // Возвращает длительность в мс (0 — звук выключен).
  function waltz() {
    if (!enabled || !ctx || ctx.state !== 'running') return 0;
    WALTZ.forEach(function (n, i) { play('note', { index: n[1], delay: n[0] * BEAT, vol: i % 3 ? 0.75 : 1 }); });
    return Math.round((WALTZ[WALTZ.length - 1][0] + 2) * BEAT * 1000);
  }

  function buzz(ms) {
    if (!vibration || !navigator.vibrate) return;
    try { navigator.vibrate(ms); } catch (e) { /* без вибрации */ }
  }

  return {
    play: play,
    waltz: waltz,
    line: line,
    buzz: buzz,
    setEnabled: function (v) { enabled = !!v; },
    setVibration: function (v) { vibration = !!v; },
    isReady: function () { return !!ctx && ctx.state === 'running'; }
  };
})();
