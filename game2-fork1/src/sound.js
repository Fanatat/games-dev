/* Звук «Дома картинок»: короткие сэмплы (CC0, см. assets/sfx/CREDITS.md).
   Упрощённый наследник game2/sound.js: WebAudio, загрузка фоном, разблокировка
   первым жестом, пауза при скрытой странице, отдельные выключатели звука и
   вибрации. Ноты закрытых линий идут вверх по пентатонике, пока игрок
   закрывает линии подряд (окно 2,5 с). Тихая музыка на три четверти — из тех
   же нот маримбы (свой выключатель), среда комнаты — синтезом, под «Звуками».
   Шкатулка звучит своим тембром (металлический язычок) и своей мелодией;
   сундучок, редкая находка и готовая комната — каждый своим звуком. */
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
  // Вальс шкатулки: своя мелодия на октаву выше музыки, [доля, midi]; бас — на раз.
  var WALTZ = [[0, 86], [1, 90], [2, 93], [3, 95], [5, 93], [6, 91], [7, 90], [8, 88], [9, 90],
    [12, 86], [13, 88], [14, 90], [15, 91], [16, 90], [17, 88], [18, 90], [19, 86], [20, 81], [21, 86]];
  var WALTZ_BASS = [[0, 74], [3, 79], [6, 76], [9, 81], [12, 74], [15, 79], [18, 81], [21, 74]];
  var BEAT = 0.3;
  var COMBO_MS = 2500;
  // Музыка: соль мажор, G–Em–C–D, бас на раз и аккорд на два-три; мелодия — через круг.
  var SAMPLE_MIDI = [74, 76, 79, 81, 83, 86]; // D5 E5 G5 A5 B5 D6 — файлы EVENTS.line
  var M_BEAT = 0.62, M_VOL = 0.3;
  var CHORDS = [[67, [74, 79, 83]], [64, [76, 79, 83]], [72, [76, 79, 84]], [74, [78, 81, 86]]];
  var MELODY = [[0, 83], [2, 81], [3, 79], [6, 76], [7, 79], [8, 84], [9, 81], [12, 86], [14, 83], [15, 79], [17, 81], [18, 79], [20, 76], [21, 74]];

  var ctx = null, master = null;
  var buffers = {};
  var enabled = true, vibration = true, music = true;
  var musicBus = null, mLevel = 1, mNext = 0, mBeat = 0, mDuck = 0;
  var noiseBuf = null, ambRoom = null, ambNext = 0, ambN = 0;
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

  // Металлический язычок шкатулки: синус с быстрым спадом и неровным обертоном.
  function box(midi, at, vol) {
    var f = 440 * Math.pow(2, (midi - 69) / 12);
    [[1, 1, 1.4], [2, 0.14, 0.5], [4.2, 0.2, 0.22]].forEach(function (p) {
      var o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f * p[0];
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol * p[1], at + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, at + p[2]);
      o.connect(g); g.connect(master);
      o.start(at); o.stop(at + p[2] + 0.05);
    });
  }

  // Возвращает длительность в мс (0 — звук выключен).
  function waltz() {
    if (!enabled || !ctx || ctx.state !== 'running') return 0;
    var t0 = ctx.currentTime + 0.05;
    WALTZ.forEach(function (n) { box(n[1], t0 + n[0] * BEAT, 0.2); });
    WALTZ_BASS.forEach(function (n) { box(n[1], t0 + n[0] * BEAT, 0.12); });
    var ms = Math.round((WALTZ[WALTZ.length - 1][0] + 2) * BEAT * 1000);
    mDuck = performance.now() + ms; // музыка притихает, пока играет шкатулка
    return ms;
  }

  // Нота любой высоты: ближайший сэмпл маримбы, переложенный по скорости.
  function tone(midi, at, vol, dest) {
    var best = 0;
    for (var i = 1; i < SAMPLE_MIDI.length; i++) if (Math.abs(SAMPLE_MIDI[i] - midi) < Math.abs(SAMPLE_MIDI[best] - midi)) best = i;
    var buf = buffers[EVENTS.line.files[best]];
    if (!buf) return;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = Math.pow(2, (midi - SAMPLE_MIDI[best]) / 12);
    var g = ctx.createGain();
    g.gain.value = vol;
    src.connect(g); g.connect(dest);
    src.start(at);
  }

  // Звуки событий — у каждого свой: сундучок, редкая находка, готовая комната.
  var CUES = {
    // сундучок: колокольчик и три ноты маримбы вверх
    chest: function (t) {
      play('reward');
      [79, 83, 86].forEach(function (m, i) { tone(m, t + 0.12 + i * 0.09, 0.4, master); });
    },
    // редкое: искры и быстрая лесенка шкатулки до самого верха
    rare: function (t) {
      play('hint');
      [86, 90, 93, 98, 102].forEach(function (m, i) { box(m, t + 0.05 + i * 0.07, 0.17); });
      box(105, t + 0.47, 0.14);
    },
    // готовая комната: аккорд, фраза маримбы и созвучие в конце
    room: function (t) {
      play('chord');
      [[0, 74], [0.16, 79], [0.32, 83], [0.48, 86], [0.86, 79], [0.86, 83], [0.86, 86]].forEach(function (n) {
        tone(n[1], t + 0.25 + n[0], 0.38, master);
      });
    }
  };
  function cue(name) {
    if (!enabled || !ctx || ctx.state !== 'running' || !CUES[name]) return;
    CUES[name](ctx.currentTime);
  }

  // Планировщик музыки: ноты ставятся на 0,8 с вперёд, такт — три доли.
  function musicTick() {
    if (!music || !ctx || ctx.state !== 'running' || !buffers[EVENTS.line.files[0]]) { mNext = 0; return; }
    if (!musicBus) { musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master); }
    musicBus.gain.setTargetAtTime(M_VOL * mLevel * (performance.now() < mDuck ? 0.15 : 1), ctx.currentTime, 0.4);
    if (!mNext || mNext < ctx.currentTime) { mNext = ctx.currentTime + 0.3; mBeat = 0; }
    while (mNext < ctx.currentTime + 0.8) {
      var b = mBeat % 24, ch = CHORDS[Math.floor(b / 3) % 4], pos = b % 3;
      if (pos === 0) tone(ch[0], mNext, 0.5, musicBus);
      else { tone(ch[1][pos - 1], mNext, 0.2, musicBus); tone(ch[1][pos], mNext, 0.2, musicBus); }
      if (Math.floor(mBeat / 24) % 2 === 1) MELODY.forEach(function (n) { if (n[0] === b) tone(n[1], mNext, 0.55, musicBus); });
      mBeat++;
      mNext += M_BEAT;
    }
  }

  function noise() {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  // Щелчок шума через полосовой фильтр — тиканье часов.
  function burst(at, freq, dur, vol) {
    var src = ctx.createBufferSource();
    src.buffer = noise();
    var f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 6;
    var g = ctx.createGain();
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(at, Math.random() * 0.5, dur + 0.02);
  }
  // Свист: синус скользит по высоте — птица в саду, пузырёк в чайнике.
  function chirp(at, f0, f1, dur, vol) {
    var o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f0, at);
    o.frequency.exponentialRampToValueAtTime(f1, at + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(master);
    o.start(at); o.stop(at + dur + 0.02);
  }
  // Среда комнаты: функция ставит звук и возвращает паузу до следующего, с.
  var AMBIENT = {
    // прихожая: часы, тик-так раз в секунду
    r01: function (t, n) { burst(t, n % 2 ? 2300 : 3100, 0.035, 0.5); return 1; },
    // чайная: чайник на огне, редкие пузырьки
    r02: function (t) {
      var k = 1 + Math.floor(Math.random() * 3);
      for (var i = 0; i < k; i++) chirp(t + i * 0.09, 380 + Math.random() * 200, 900 + Math.random() * 300, 0.06, 0.03);
      return 1.6 + Math.random() * 2.4;
    },
    // оранжерея: птицы в саду, два-три свиста
    r03: function (t) {
      var k = 2 + Math.floor(Math.random() * 2), f = 3000 + Math.random() * 900;
      for (var i = 0; i < k; i++) chirp(t + i * 0.13, f, f * 1.35, 0.09, 0.035);
      return 3 + Math.random() * 6;
    }
  };
  function ambientTick() {
    var fn = ambRoom && AMBIENT[ambRoom];
    if (!fn || !enabled || !ctx || ctx.state !== 'running') { ambNext = 0; return; }
    if (!ambNext || ambNext < ctx.currentTime) ambNext = ctx.currentTime + 0.4;
    while (ambNext < ctx.currentTime + 0.6) ambNext += fn(ambNext, ambN++);
  }
  setInterval(function () { musicTick(); ambientTick(); }, 250);

  function setMusic(v) {
    music = !!v;
    // выключили — уже поставленные ноты замолкают вместе с шиной
    if (!music && musicBus) { musicBus.disconnect(); musicBus = null; mNext = 0; }
  }

  function buzz(ms) {
    if (!vibration || !navigator.vibrate) return;
    try { navigator.vibrate(ms); } catch (e) { /* без вибрации */ }
  }

  return {
    play: play,
    cue: cue,
    waltz: waltz,
    line: line,
    buzz: buzz,
    setEnabled: function (v) { enabled = !!v; },
    setVibration: function (v) { vibration = !!v; },
    setMusic: setMusic,
    musicOn: function () { return music; },
    musicLevel: function (x) { mLevel = x; },
    ambient: function (rid) { if (rid !== ambRoom) { ambRoom = rid || null; ambNext = 0; } },
    ambientRoom: function () { return ambRoom; },
    isReady: function () { return !!ctx && ctx.state === 'running'; }
  };
})();
