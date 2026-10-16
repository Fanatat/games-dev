/* Звук: сэмплы Kenney CC0 из Словохода (assets/sfx, лицензии — assets/sfx/CREDITS.md).
   Web Audio, загрузка после первого касания; выход приглушён и смягчён по верхам, как в
   родителе (−10 дБ, полка −8 дБ от 2,5 кГц). Скрытая вкладка — звук на паузе. */
(function (root) {
  'use strict';
  var EVENTS = {
    step: { vol: 0.3 }, found: { vol: 0.55 }, wrong: { vol: 0.35 }, win: { vol: 0.5 },
    hint: { vol: 0.45 }, tap: { vol: 0.35 }, reward: { vol: 0.5 }, chapter: { vol: 0.5 },
  };
  var STEPS = [-5, -3, 0, 2, 5, 7, 9, 12];
  var ctx = null, out = null, buffers = {}, enabled = true, loading = false;

  function base() {
    var s = document.currentScript || document.querySelector('script[src*="sound.js"]');
    return s ? s.src.replace(/src\/sound\.js.*$/, '') : '';
  }
  var BASE = base();

  function unlock() {
    if (ctx) { if (ctx.state === 'suspended' && !document.hidden) ctx.resume(); return; }
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
    var g = ctx.createGain();
    g.gain.value = EVENTS[name].vol;
    src.connect(g); g.connect(out);
    src.start();
  }

  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  root.Sound = {
    play: play,
    setEnabled: function (v) { enabled = !!v; },
    get enabled() { return enabled; },
  };
})(this);
