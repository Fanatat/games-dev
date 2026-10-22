/* Ювелир Ленд — тихая фоновая музыка: вальс музыкальной шкатулки (ТЗ аудита CrazyGames, Ж-08).

   Файлов нет: ноты синтезируются в браузере (WebAudio), как и звуки игры (tools/ws_make_sfx.py) —
   затухающие гармоники «гребёнки» шкатулки, мягкий бас «раз-два-три» и лёгкое эхо. 16 тактов 3/4, 76
   ударов в минуту (≈ 38 с); каждый второй проход мелодию тихо дублирует октава выше — цикл ≈ 76 с.
   Громкость заметно ниже эффектов (VOL). Свой AudioContext создаётся только по касанию игрока.

   WsMusic.attach(want) — want() → true, если музыка должна звучать (звук и музыка включены в сейве);
   WsMusic.sync() — сверить с want(), скрытой вкладкой и паузой; WsMusic.setPaused(reason, on) — пауза
   площадки (реклама, оплата, скрытая вкладка) по причинам, как Sound.suspend/resume. */
window.WsMusic = (function () {
  'use strict';

  const BPM = 76, BEAT = 60 / BPM, BAR = 3;
  const VOL = 0.055;          // общий уровень музыки (эффекты — 0,1–0,36 на событие при общем 0,8)
  const AHEAD = 1.2;          // на сколько секунд вперёд расписаны ноты
  // мелодия: [такт, доля, нота MIDI, длительность в долях]; фа мажор, гармония по тактам — CHORDS
  const MEL = [
    [0, 0, 81, 2], [0, 2, 84, 1], [1, 0, 86, 2], [1, 2, 84, 1], [2, 0, 82, 1], [2, 1, 81, 1], [2, 2, 79, 1], [3, 0, 79, 3],
    [4, 0, 81, 1], [4, 1, 84, 1], [4, 2, 89, 1], [5, 0, 88, 2], [5, 2, 84, 1], [6, 0, 86, 1], [6, 1, 82, 1], [6, 2, 79, 1],
    [7, 0, 84, 3], [8, 0, 77, 1], [8, 1, 81, 1], [8, 2, 86, 1], [9, 0, 86, 2], [9, 2, 82, 1], [10, 0, 84, 1], [10, 1, 81, 1],
    [10, 2, 77, 1], [11, 0, 79, 2], [11, 2, 76, 1], [12, 0, 77, 1], [12, 1, 79, 1], [12, 2, 82, 1], [13, 0, 81, 1],
    [13, 1, 79, 1], [13, 2, 76, 1], [14, 0, 77, 2], [14, 2, 81, 1], [15, 0, 77, 3]
  ];
  // бас и аккорд «раз — два-три»: [корень, два звука аккорда]
  const F = [53, 69, 72], Dm = [50, 65, 69], Bb = [46, 62, 65], C = [48, 64, 67], Am = [45, 60, 64];
  const CHORDS = [F, Dm, Bb, C, F, Am, Bb, C, Dm, Bb, F, C, Bb, C, F, F];
  const LOOP = CHORDS.length * BAR * BEAT;

  // события цикла по времени: { t (с от начала цикла), midi, dur (с), vel, kind }
  const EVENTS = [];
  MEL.forEach(([bar, beat, midi, len]) => EVENTS.push({ t: (bar * BAR + beat) * BEAT, midi, dur: len * BEAT, vel: 1, kind: 'mel' }));
  CHORDS.forEach((ch, bar) => {
    EVENTS.push({ t: bar * BAR * BEAT, midi: ch[0], dur: BAR * BEAT, vel: 0.55, kind: 'bass' });
    [1, 2].forEach(beat => [ch[1], ch[2]].forEach(m => EVENTS.push({ t: (bar * BAR + beat) * BEAT, midi: m, dur: BEAT, vel: 0.16, kind: 'pah' })));
  });
  EVENTS.sort((a, b) => a.t - b.t);

  let want = () => false;
  let ctx = null, out = null, bus = null, timer = 0, playing = false;
  let loopAt = 0, idx = 0, loopN = 0;
  const paused = new Set();

  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (e) { ctx = null; return false; }
    out = ctx.createGain();
    out.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 4200;
    bus = ctx.createGain();
    bus.gain.value = 1;
    // лёгкое эхо комнаты: задержка с затухающим повтором
    const dl = ctx.createDelay(1);
    dl.delayTime.value = 0.31;
    const fb = ctx.createGain();
    fb.gain.value = 0.24;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    bus.connect(lp); lp.connect(out);
    bus.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(out);
    out.connect(ctx.destination);
    return true;
  }

  // гребёнка шкатулки: основной тон и негармоничные обертоны с быстрым затуханием; бас — мягче и дольше
  const TIMBRE = {
    mel: [[1, 1, 1.5], [2, 0.32, 0.7], [3, 0.1, 0.35], [4.16, 0.07, 0.2]],
    pah: [[1, 1, 0.9], [2, 0.2, 0.4]],
    bass: [[1, 1, 1.6], [2, 0.25, 0.6]]
  };
  function note(at, ev, vel) {
    const f = hz(ev.midi), parts = TIMBRE[ev.kind];
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vel, at + 0.004);
    g.connect(bus);
    let end = at;
    parts.forEach(([r, a, d]) => {
      const o = ctx.createOscillator(), pg = ctx.createGain();
      o.frequency.value = f * r;
      const life = Math.min(ev.dur + d * 2, d * 5);
      pg.gain.setValueAtTime(a, at);
      pg.gain.exponentialRampToValueAtTime(0.0008, at + life);
      o.connect(pg); pg.connect(g);
      o.start(at); o.stop(at + life + 0.05);
      end = Math.max(end, at + life + 0.05);
    });
    setTimeout(() => { try { g.disconnect(); } catch (e) { /* уже отключён */ } }, (end - ctx.currentTime + 0.5) * 1000);
  }

  function schedule() {
    if (!playing || !ctx) return;
    const horizon = ctx.currentTime + AHEAD;
    for (;;) {
      if (idx >= EVENTS.length) { idx = 0; loopAt += LOOP; loopN++; }
      const ev = EVENTS[idx], at = loopAt + ev.t;
      if (at > horizon) break;
      idx++;
      if (at < ctx.currentTime - 0.05) continue;   // вкладка тормозила — пропущенное не догоняем
      note(at, ev, ev.vel * 0.5);
      if (ev.kind === 'mel' && loopN % 2 === 1) note(at + 0.012, { midi: ev.midi + 12, dur: ev.dur, kind: 'mel' }, 0.12);
    }
  }

  function start() {
    if (playing) return;
    if (!ctx && !build()) return;
    playing = true;
    try { ctx.resume(); } catch (e) { /* старый Safari */ }
    const now = ctx.currentTime;
    out.gain.cancelScheduledValues(now);
    out.gain.setValueAtTime(out.gain.value, now);
    out.gain.linearRampToValueAtTime(VOL, now + 2.5);
    loopAt = now + 0.15; idx = 0; loopN = 0;
    schedule();
    timer = setInterval(schedule, 250);
  }
  function stop() {
    if (!playing) return;
    playing = false;
    clearInterval(timer);
    const now = ctx.currentTime;
    out.gain.cancelScheduledValues(now);
    out.gain.setValueAtTime(out.gain.value, now);
    out.gain.linearRampToValueAtTime(0, now + 0.35);
    setTimeout(() => { if (!playing && ctx) { try { ctx.suspend(); } catch (e) { /* старый Safari */ } } }, 500);
  }

  let gestured = false;
  function sync() {
    const on = gestured && want() && !paused.size && !document.hidden;
    if (on) start(); else stop();
  }
  function attach(fn) {
    want = fn;
    // контекст создаётся только касанием: без него браузер не даст играть и напишет предупреждение
    const go = () => { gestured = true; sync(); };
    ['pointerup', 'touchend', 'keydown'].forEach(t => document.addEventListener(t, go, { passive: true }));
    document.addEventListener('visibilitychange', sync);
  }
  function setPaused(reason, on) {
    if (on) paused.add(reason); else paused.delete(reason);
    sync();
  }
  function state() {
    return { playing, ctx: ctx ? ctx.state : 'none', paused: Array.from(paused), loop: Math.round(LOOP * 10) / 10 };
  }

  return { attach, sync, setPaused, state };
})();
