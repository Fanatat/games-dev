/* ============================================================
   sound.js — звуки игры. Единственная точка воспроизведения звука.

   ТЗ №24: синтез на осцилляторах заменён записанными звуками Kenney
   (CC0). ТЗ №26: звуки и их сведение описаны в манифесте
   assets/audio/manifest.json; tools/process_audio.py пишет из него
   sfx_data.js — SFX_MANIFEST (события: группа, громкость, варианты или
   рецепт, предел копий, разброс) и SFX_DATA (MP3 моно 44,1 кГц в
   base64). Без сети, офлайн и с file://. Код для смены звука не правят.

   Декодирование — сразу при загрузке, в OfflineAudioContext: буферы
   не привязаны к контексту и к первому жесту уже готовы. Сам
   AudioContext создаётся на первый жест с активацией (слушатели в фазе
   захвата — раньше обработчика клика, который зовёт play*()). До жеста
   resume()/start() не зовутся: Chromium на это пишет предупреждение.

   Граф: источник → громкость голоса → группа (ui/sfx/events) → общая
   громкость (master × mute) → лимитер → выход. Наложение звуков
   (перелив + приземление + колокольчик) не перегружает выход.

   Пауза — множество причин: 'ad' (реклама, pauseGame в main.js) и
   'hidden' (вкладка скрыта). Пока есть хоть одна, контекст стоит, а
   play() молчит и НЕ будит контекст: на ВК onPause рекламы синхронен
   внутри клика, и щелчок кнопки раньше запускал звук поверх рекламы
   (правило Яндекса 4.7). Mute хранится в сейве (state.muted, main.js).

   Нет Web Audio, битый сэмпл, сбой декодирования, id файла не из
   SFX_DATA — тишина этого звука, одно предупреждение в консоли, игра
   живая.
   ============================================================ */
const Sound = (() => {
  const MANIFEST = (typeof SFX_MANIFEST !== 'undefined' && SFX_MANIFEST) || { master: 0.8, groups: {}, events: {} };
  const DATA = (typeof SFX_DATA !== 'undefined' && SFX_DATA) || {};
  const EVENTS = MANIFEST.events || {};

  const LEAD_GATE = Math.pow(10, -50 / 20); // −50 dBFS: тише — ещё тишина перед звуком
  const STEAL_FADE = 0.012;  // с: вытеснение старой копии при переполнении
  const MUTE_RAMP = 0.02;    // с: mute/unmute без щелчка
  const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];

  let ctx = null;
  let master = null;
  const groupGains = {};
  let muted = false;
  let masterVolume = typeof MANIFEST.master === 'number' ? MANIFEST.master : 0.8;
  const groupVolumes = Object.assign({ ui: 1, sfx: 1, events: 1 }, MANIFEST.groups);
  const pauseReasons = new Set();

  const buffers = {};
  const leadSec = {};   // runtime-срез тишины в начале буфера (задержка MP3-декодера)
  const failed = [];
  let pending = 0;
  let decodeStarted = false;

  const voices = [];    // {event, src, gain} в порядке запуска: первый — самый старый
  const lastVariant = {};
  const startsByEvent = {}; // запуски буферов по событиям с загрузки (debugState)
  const warnedIds = {};

  // Промисы suspend()/resume()/decodeAudioData старый Safari не
  // возвращает, а у новых их отказ не должен всплыть unhandled rejection.
  function quiet(p) {
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  /* ---------- Декодирование ---------- */
  function toArrayBuffer(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  function findLead(buf) {
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) > LEAD_GATE) return i / buf.sampleRate;
    }
    return 0;
  }

  function decodeAll(decoder) {
    decodeStarted = true;
    const ids = Object.keys(DATA);
    pending = ids.length;
    ids.forEach((id) => {
      let done = false;
      const ok = (buf) => {
        if (done) return;
        done = true;
        buffers[id] = buf;
        leadSec[id] = findLead(buf);
        onDecoded();
      };
      const fail = () => {
        if (done) return;
        done = true;
        failed.push(id);
        onDecoded();
      };
      try {
        // Колбэчная форма — для старого Safari без Promise; у новых
        // браузеров тот же исход приходит и промисом (done-флаг).
        const p = decoder.decodeAudioData(toArrayBuffer(DATA[id]), ok, fail);
        if (p && typeof p.then === 'function') p.then(ok, fail);
      } catch (e) {
        fail();
      }
    });
  }

  /* Id файла, которого нет в SFX_DATA (опечатка в манифесте или в
     подмене страницы прослушивания), — одно предупреждение на id: иначе
     событие молчит без следа (ТЗ №26, ревью). Манифест сверяется при
     загрузке, подмены — при play(). Сбой декодирования предупреждает
     onDecoded(). */
  function knownFile(fileId, eventId) {
    if (Object.prototype.hasOwnProperty.call(DATA, fileId)) return true;
    if (!warnedIds[fileId]) {
      warnedIds[fileId] = true;
      console.warn('[sound] нет файла ' + fileId + ' (событие ' + eventId + ') — звук молчит');
    }
    return false;
  }

  Object.keys(EVENTS).forEach((id) => {
    const ev = EVENTS[id] || {};
    const files = ev.recipe ? [(ev.recipe.arp || {}).file, (ev.recipe.chord || {}).file] : (ev.variants || []);
    files.forEach((f) => knownFile(f, id));
  });

  function onDecoded() {
    pending--;
    if (pending === 0 && failed.length) {
      console.warn('[sound] не декодированы: ' + failed.join(', ') + ' — эти звуки молчат');
    }
  }

  (function decodeAtLoad() {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC) return; // декодируем реальным контекстом при разблокировке
    try {
      decodeAll(new OAC(1, 1, 44100));
    } catch (e) {
      decodeStarted = false;
    }
  })();

  /* ---------- Разблокировка первым жестом ---------- */
  function addGestureListeners() {
    GESTURES.forEach((t) => window.addEventListener(t, onGesture, true));
  }
  function removeGestureListeners() {
    GESTURES.forEach((t) => window.removeEventListener(t, onGesture, true));
  }

  // Слушатели живут, пока контекст не 'running': и до первого запуска,
  // и после паузы или прерывания системой (iOS) — следующий жест будит.
  function syncGestureListeners() {
    if (ctx && ctx.state === 'running') removeGestureListeners();
    else addGestureListeners();
  }

  function buildGraph() {
    master = ctx.createGain();
    master.gain.value = muted ? 0 : masterVolume;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -8;
    limiter.knee.value = 6;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.15;
    master.connect(limiter);
    limiter.connect(ctx.destination);
    Object.keys(groupVolumes).forEach((g) => {
      const node = ctx.createGain();
      node.gain.value = groupVolumes[g];
      node.connect(master);
      groupGains[g] = node;
    });
  }

  function onGesture() {
    // pointerdown пальцем активации не даёт (её дают pointerup/touchend):
    // контекст, созданный без неё, не запустится и выдаст предупреждение.
    const ua = navigator.userActivation;
    if (ua && !ua.isActive) return;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { removeGestureListeners(); return; } // нет Web Audio — тихо деградируем
      try {
        ctx = new AC();
      } catch (e) {
        ctx = null;
        removeGestureListeners();
        return;
      }
      buildGraph();
      ctx.onstatechange = syncGestureListeners;
      if (!decodeStarted) decodeAll(ctx);
      if (pauseReasons.size) quiet(ctx.suspend());
    }
    if (!pauseReasons.size && ctx.state !== 'running') quiet(ctx.resume());
    syncGestureListeners();
  }
  addGestureListeners();

  /* ---------- Громкость, mute, пауза ---------- */
  function rampTo(param, value, seconds) {
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(value, now + seconds);
  }

  // Mute гасит и уже запланированные хвосты победы: рампа общей громкости.
  function setMuted(value) {
    muted = !!value;
    if (master) rampTo(master.gain, muted ? 0 : masterVolume, MUTE_RAMP);
  }

  /* Громкость группы ('ui' | 'sfx' | 'events') или общая ('master') на
     ходу — для страницы прослушивания. В сейв не пишется. */
  function setGroupVolume(group, value) {
    const v = Math.max(0, Number(value) || 0);
    if (group === 'master') {
      masterVolume = v;
      if (master && !muted) rampTo(master.gain, v, MUTE_RAMP);
      return;
    }
    groupVolumes[group] = v;
    if (groupGains[group]) rampTo(groupGains[group].gain, v, MUTE_RAMP);
  }
  function getGroupVolume(group) {
    return group === 'master' ? masterVolume : groupVolumes[group];
  }

  function stopAllVoices() {
    voices.splice(0).forEach((v) => {
      try { v.src.stop(); } catch (e) { /* уже остановлен */ }
      try { v.gain.disconnect(); } catch (e) { /* уже отключён */ }
    });
  }

  function suspend(reason) {
    pauseReasons.add(reason || 'ad');
    stopAllVoices();
    if (ctx) quiet(ctx.suspend());
  }
  // Контекст просыпается, только когда причин паузы не осталось: вкладка
  // вернулась во время рекламы — звук всё ещё стоит.
  function resume(reason) {
    pauseReasons.delete(reason || 'ad');
    if (ctx && !pauseReasons.size) quiet(ctx.resume());
  }

  /* ---------- Голоса ---------- */
  function jitter(amount) {
    return amount ? 1 + (Math.random() * 2 - 1) * amount : 1;
  }

  function stealVoice(v) {
    const i = voices.indexOf(v);
    if (i !== -1) voices.splice(i, 1);
    try {
      rampTo(v.gain.gain, 0, STEAL_FADE);
      v.src.stop(ctx.currentTime + STEAL_FADE + 0.003);
    } catch (e) { /* уже остановлен */ }
  }

  function startVoice(eventId, fileId, group, gain, rate, when, maxVoices) {
    const buf = buffers[fileId];
    if (!buf) {
      knownFile(fileId, eventId);
      return false;
    }
    const own = voices.filter((v) => v.event === eventId);
    while (own.length >= maxVoices) stealVoice(own.shift());
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g);
    g.connect(groupGains[group] || master);
    const voice = { event: eventId, src, gain: g };
    voices.push(voice);
    src.onended = () => {
      const i = voices.indexOf(voice);
      if (i !== -1) voices.splice(i, 1);
      try { g.disconnect(); } catch (e) { /* уже отключён */ }
    };
    src.start(when, leadSec[fileId] || 0);
    startsByEvent[eventId] = (startsByEvent[eventId] || 0) + 1;
    return true;
  }

  // Случайный вариант, но не тот же, что прозвучал в прошлый раз.
  function pickVariant(eventId, list) {
    const choices = list.length > 1 ? list.filter((f) => f !== lastVariant[eventId]) : list;
    const fileId = choices[Math.floor(Math.random() * choices.length)];
    lastVariant[eventId] = fileId;
    return fileId;
  }

  /* play(eventId, opts) — событие из манифеста. opts: semis — сдвиг
     высоты в полутонах (заполненность, номер колбы; отдельно от
     разброса), delay — задержка в секундах по часам аудио, variants /
     recipe / volume — подмена для страницы прослушивания.
     Рецепт: ноты арпеджио через step, аккорд после арпеджио и gap. */
  function play(eventId, opts) {
    const o = opts || {};
    if (muted || pauseReasons.size || !ctx) return false;
    const ev = EVENTS[eventId] || {};
    const group = o.group || ev.group || 'sfx';
    const volume = typeof o.volume === 'number' ? o.volume : (typeof ev.volume === 'number' ? ev.volume : 1);
    const maxVoices = ev.maxVoices || 8;
    const semis = o.semis || 0;
    const when = ctx.currentTime + (o.delay || 0);
    const recipe = o.recipe || (o.variants ? null : ev.recipe);
    if (recipe) {
      let started = false;
      const arp = recipe.arp;
      const chord = recipe.chord;
      arp.semis.forEach((s, i) => {
        started = startVoice(eventId, arp.file, group, volume * arp.volume,
          Math.pow(2, (s + semis) / 12), when + i * arp.step, maxVoices) || started;
      });
      const chordAt = when + arp.semis.length * arp.step + (chord.gap || 0);
      chord.semis.forEach((s) => {
        started = startVoice(eventId, chord.file, group, volume * chord.volume,
          Math.pow(2, (s + semis) / 12), chordAt, maxVoices) || started;
      });
      return started;
    }
    const list = o.variants || ev.variants;
    if (!list || !list.length) return false;
    const j = ev.jitter || {};
    return startVoice(eventId, pickVariant(eventId, list), group, volume * jitter(j.gain),
      Math.pow(2, semis / 12) * jitter(j.pitch), when, maxVoices);
  }

  /* ---------- Игровые звуки ---------- */
  /* fillRatio — насколько заполнена колба-ПРИЁМНИК ПОСЛЕ этого перелива
     (0..1, задача 9): выше заполненность → выше капля. ±4 полутона на
     весь диапазон: соседние ступени (capacity=4 → шаг 0.25, два
     полутона) различимы, а капля не уходит в писк. game.js вызывает
     ДО фактического splice — считает по актуальным length'ам. */
  function playPour(fillRatio = 0.5) {
    const r = Math.max(0, Math.min(1, fillRatio));
    play('pour', { semis: (r - 0.5) * 8 });
  }
  // Приземление — стеклянный стук, один из вариантов манифеста.
  function playSettle() {
    play('settle');
  }
  /* «Колба собрана» (задача 9) — колокольчик ВМЕСТО playSettle для этого
     хода (game.js), не вместе с ним. ТЗ №22, B3: step — сколько колб
     уровня уже было собрано ДО этой (0 — первая). Каждая следующая
     звучит на ступень выше по мажорной гамме, потолок — октава. */
  const LOCK_STEPS = [0, 2, 4, 5, 7, 9, 11, 12];
  function playLock(step = 0) {
    play('lock', { semis: LOCK_STEPS[Math.max(0, Math.min(LOCK_STEPS.length - 1, step | 0))] });
  }
  function playInvalid() { play('invalid'); }
  function playClick() { play('click'); }
  function playSelect() { play('select'); }
  /* Победные звуки — рецепты «арпеджио колокольчиком + аккорд колоколом»,
     три ступени награды: уровень < глава (задача 9) < вся кампания. */
  function playWin() { play('win'); }
  function playChapterWin() { play('chapter_win'); }
  function playFanfare() { play('fanfare'); }
  // ТЗ №26: награда за рекламу или покупку; цель дня — после аккорда победы.
  function playReward() { play('reward'); }
  function playDailyGoal(delaySec = 1.7) { play('daily_goal', { delay: delaySec }); }

  /* Снять копии события — и звучащие (короткое затухание), и ещё не
     начавшиеся: стоп раньше старта, источник не заиграет. main.js гасит
     так отложенный daily_goal перед аккордом главы и фанфарами. */
  function cancel(eventId) {
    voices.filter((v) => v.event === eventId).forEach(stealVoice);
  }

  function debugState() {
    const voicesByEvent = {};
    voices.forEach((v) => { voicesByEvent[v.event] = (voicesByEvent[v.event] || 0) + 1; });
    const leadMs = {};
    Object.keys(leadSec).forEach((id) => { leadMs[id] = Math.round(leadSec[id] * 100000) / 100; });
    return {
      expected: Object.keys(DATA).length,
      decoded: Object.keys(buffers).length,
      failed: failed.slice(),
      contextState: ctx ? ctx.state : 'none',
      pausedReasons: Array.from(pauseReasons),
      muted,
      activeVoices: voices.length,
      voicesByEvent,
      startsByEvent: Object.assign({}, startsByEvent),
      leadMs,
    };
  }

  return {
    setMuted, suspend, resume, play, cancel,
    playPour, playSettle, playLock, playInvalid, playClick, playSelect,
    playWin, playChapterWin, playFanfare, playReward, playDailyGoal,
    setGroupVolume, getGroupVolume, debugState,
  };
})();
