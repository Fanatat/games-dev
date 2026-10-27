/* Звук: сэмплы Kenney CC0 из Словохода (assets/sfx, лицензии — assets/sfx/CREDITS.md).
   Web Audio, загрузка после первого касания; выход приглушён и смягчён по верхам, как в
   родителе (−10 дБ, полка −8 дБ от 2,5 кГц). Скрытая вкладка, свёрнутый ВК и ролик — звук на паузе.
   Музыка — своя петля assets/music/day.mp3 (tools/make_music.py), грузится через 1,5 с после
   первого касания, вступает плавно, на итоге приглушается; включается отдельно от звуков. */
(function (root) {
  'use strict';
  // Звуки вдвое тише музыки по сравнению с b023 (−6 дБ, решение основателя 27.10): на тихом телефоне
  // динамик теряет низы музыки первыми, а щелчки и звоны оставались громкими.
  var EVENTS = {
    step: { vol: 0.15 }, found: { vol: 0.28 }, wrong: { vol: 0.18 }, win: { vol: 0.25 },
    hint: { vol: 0.22 }, tap: { vol: 0.18 }, reward: { vol: 0.25 }, chapter: { vol: 0.25 },
  };
  var STEPS = [-5, -3, 0, 2, 5, 7, 9, 12];
  var ctx = null, out = null, buffers = {}, enabled = true, loading = false;
  var MUSIC_LOOP = 16 * 4 * 60 / 68, MUSIC_VOL = 0.4, DUCK = 0.35;
  var music = { on: true, buf: null, src: null, gain: null, duck: false, loading: false };

  function base() {
    var s = document.currentScript || document.querySelector('script[src*="sound.js"]');
    return s ? s.src.replace(/src\/sound\.js.*$/, '') : '';
  }
  var BASE = base();

  function unlock() {
    if (ctx) { apply(); return; }
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    var gain = ctx.createGain();
    gain.gain.value = Math.pow(10, -10 / 20);
    var shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf'; shelf.frequency.value = 2500; shelf.gain.value = -8;
    gain.connect(shelf); shelf.connect(ctx.destination);
    out = gain;
    load();
    setTimeout(loadMusic, 1500);
  }

  function loadMusic() {
    if (!ctx || music.loading || !music.on) return;
    music.loading = true;
    fetch(BASE + 'assets/music/day.mp3').then(function (r) { return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (ok, bad) { ctx.decodeAudioData(ab, ok, bad); }); })
      .then(function (b) { music.buf = b; startMusic(); })
      .catch(function () { music.loading = false; });
  }
  function musicLevel() { return MUSIC_VOL * (music.duck ? DUCK : 1); }
  function startMusic() {
    if (!music.on || !ctx || !music.buf || music.src) return;
    var src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = music.buf; src.loop = true;
    src.loopEnd = Math.min(music.buf.duration, MUSIC_LOOP);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(musicLevel(), ctx.currentTime + 3);
    src.connect(g); g.connect(out);
    src.start();
    music.src = src; music.gain = g;
  }
  function stopMusic() {
    if (!music.src) return;
    var src = music.src, g = music.gain, t = ctx.currentTime;
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 0.6);
    src.stop(t + 0.7);
    music.src = null; music.gain = null;
  }
  function setMusic(v) {
    music.on = !!v;
    if (!music.on) return stopMusic();
    if (music.buf) startMusic(); else loadMusic();
  }
  function duck(v) {
    music.duck = !!v;
    if (music.gain) music.gain.gain.setTargetAtTime(musicLevel(), ctx.currentTime, 0.4);
  }

  function load() {
    if (loading) return;
    loading = true;
    Object.keys(EVENTS).forEach(function (name) {
      fetch(BASE + 'assets/sfx/' + name + '.mp3').then(function (r) { return r.arrayBuffer(); })
        .then(function (ab) { return new Promise(function (ok, bad) { ctx.decodeAudioData(ab, ok, bad); }); })
        .then(function (b) { buffers[name] = b; }).catch(function () { /* без звука игра идёт */ });
    });
  }

  function play(name, i) {
    if (!enabled || !ctx || !buffers[name] || document.hidden) return;
    var src = ctx.createBufferSource();
    src.buffer = buffers[name];
    if (name === 'step') src.playbackRate.value = Math.pow(2, STEPS[Math.min(i || 0, STEPS.length - 1)] / 12);
    // ошибка ниже и длиннее шага, чтобы на слух не путать их (план эксперта №6, 0.3 и 4.3)
    if (name === 'wrong') src.playbackRate.value = 0.7;
    var g = ctx.createGain();
    g.gain.value = EVENTS[name].vol;
    src.connect(g); g.connect(out);
    src.start();
  }

  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  /* Пауза всего звука: скрытая вкладка, свёрнутое приложение ВК (VKWebAppViewHide, правила ВК 2.2.5), ролик. */
  var holds = {};
  function apply() {
    if (!ctx) return;
    if (document.hidden || Object.keys(holds).length) { if (ctx.state === 'running') ctx.suspend(); }
    else if (ctx.state === 'suspended') ctx.resume();
  }
  function hold(why, on) { if (on) holds[why] = true; else delete holds[why]; apply(); }
  document.addEventListener('visibilitychange', apply);

  root.Sound = {
    play: play,
    setEnabled: function (v) { enabled = !!v; },
    get enabled() { return enabled; },
    setMusic: setMusic,
    duck: duck,
    hold: hold,
    get held() { return Object.keys(holds); },
    get music() { return { on: music.on, loaded: !!music.buf, playing: !!music.src, duck: music.duck }; },
  };
})(this);
