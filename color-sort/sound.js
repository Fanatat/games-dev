/* ============================================================
   sound.js — звуки игры. Единственная точка воспроизведения звука.

   ТЗ №24: синтез на осцилляторах (квадратные и синус-«бипы» 700–1800 Гц)
   заменён записанными звуками — капля, стеклянный стук, колокольчик,
   мягкий глухой удар (пак Kenney, CC0). Данные — SFX_DATA из
   sfx_data.js (WAV в base64, генерирует gen_sfx.py), без сети и без
   отдельных файлов в сборке. Высота сэмпла меняется playbackRate —
   нарастание по заполненности и по собранным колбам сохранено.

   AudioContext создаётся на ПЕРВЫЙ жест игрока (pointerdown/keydown,
   фаза захвата — раньше обработчика клика, который зовёт play*()), там
   же декодируются все сэмплы: к моменту клика они уже готовы. Пока
   сэмпл не декодирован или Web Audio нет — просто тишина, игра живая.

   Всё идёт через общую шину: громкость -> лимитер -> выход. Наложение
   звуков (перелив + приземление + колокольчик) не перегружает выход.

   suspend()/resume() — вызываются из pauseGame()/resumeGame() в
   main.js (реклама, сворачивание вкладки). muted проверяется на каждый
   play*() — если звук выключен, ничего не звучит.
   ============================================================ */
const Sound = (() => {
  let ctx = null;
  let bus = null;
  let muted = false;
  const buffers = {};

  const MASTER_GAIN = 0.8;

  function decodeAll() {
    if (typeof SFX_DATA === 'undefined') return;
    Object.keys(SFX_DATA).forEach((name) => {
      try {
        const bin = atob(SFX_DATA[name]);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        // Колбэчная форма — старый Safari не возвращает Promise; у
        // новых браузеров Promise ловим отдельно, чтобы ошибка
        // декодирования не всплыла unhandled rejection.
        const p = ctx.decodeAudioData(bytes.buffer, (buf) => { buffers[name] = buf; }, () => {});
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (e) { /* битый сэмпл — этот звук просто молчит */ }
    });
  }

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null; // нет Web Audio — тихо деградируем, игра живая
      try {
        ctx = new AC();
      } catch (e) {
        return null;
      }
      const gain = ctx.createGain();
      gain.gain.value = MASTER_GAIN;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -8;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.002;
      limiter.release.value = 0.15;
      gain.connect(limiter);
      limiter.connect(ctx.destination);
      bus = gain;
      decodeAll();
    }
    ctx.resume(); // безопасно и при уже 'running' — браузер делает no-op
    return ctx;
  }

  // Первый жест игрока создаёт контекст до клика (см. шапку). Слушатели
  // снимаются после первого срабатывания.
  function onFirstGesture() {
    ensureContext();
    ['pointerdown', 'touchstart', 'keydown'].forEach((t) =>
      window.removeEventListener(t, onFirstGesture, true));
  }
  ['pointerdown', 'touchstart', 'keydown'].forEach((t) =>
    window.addEventListener(t, onFirstGesture, true));

  function setMuted(value) {
    muted = value;
  }

  // suspend()/resume() на AudioContext безопасны в любом состоянии —
  // браузер сам делает их no-op, если действие не требуется. Проверка
  // по .state тут вредна: он обновляется АСИНХРОННО после resume(),
  // из-за чего suspend() мог не срабатывать, если состояние ещё не
  // успело перейти в 'running' к моменту вызова.
  function suspend() {
    if (ctx) ctx.suspend();
  }
  function resume() {
    if (ctx) ctx.resume();
  }

  /* ---------- Один сэмпл (строительный блок всех звуков) ----------
     semis — сдвиг высоты в полутонах (через playbackRate). */
  function play(name, { gain = 0.5, semis = 0, delay = 0 } = {}) {
    if (muted) return;
    const audioCtx = ensureContext();
    if (!audioCtx || !buffers[name]) return;
    const src = audioCtx.createBufferSource();
    src.buffer = buffers[name];
    src.playbackRate.value = Math.pow(2, semis / 12);
    const g = audioCtx.createGain();
    g.gain.value = gain;
    src.connect(g);
    g.connect(bus);
    src.start(audioCtx.currentTime + delay);
  }

  /* ---------- Игровые звуки ---------- */
  /* fillRatio — насколько заполнена колба-ПРИЁМНИК ПОСЛЕ этого перелива
     (0..1, задача 9): выше заполненность → выше капля. ±4 полутона на
     весь диапазон: соседние ступени (capacity=4 → шаг 0.25, два
     полутона) различимы, а капля не уходит в писк. game.js вызывает
     ДО фактического splice — считает по актуальным length'ам. */
  function playPour(fillRatio = 0.5) {
    const r = Math.max(0, Math.min(1, fillRatio));
    play('pour', { gain: 0.55, semis: (r - 0.5) * 8 });
  }
  /* Приземление — стеклянный стук, один из трёх записанных вариантов
     и лёгкий разброс высоты: сотни ходов подряд не звучат одинаково. */
  const SETTLE_VARIANTS = ['settle1', 'settle2', 'settle3'];
  function playSettle() {
    const name = SETTLE_VARIANTS[Math.floor(Math.random() * SETTLE_VARIANTS.length)];
    play(name, { gain: 0.3, semis: Math.random() - 0.5 });
  }
  /* «Колба собрана» (задача 9) — колокольчик ВМЕСТО playSettle для этого
     хода (game.js), не вместе с ним. ТЗ №22, B3: step — сколько колб
     уровня уже было собрано ДО этой (0 — первая). Каждая следующая
     звучит на ступень выше по мажорной гамме, потолок — октава. */
  const LOCK_STEPS = [0, 2, 4, 5, 7, 9, 11, 12];
  function playLock(step = 0) {
    const semis = LOCK_STEPS[Math.max(0, Math.min(LOCK_STEPS.length - 1, step | 0))];
    play('lock', { gain: 0.45, semis });
  }
  // Недопустимый ход — мягкий глухой удар, без жужжания.
  function playInvalid() {
    play('invalid', { gain: 0.6 });
  }
  function playClick() {
    play('click', { gain: 0.5 });
  }

  /* Победные звуки — восходящее арпеджио колокольчиком и финальный
     аккорд длинным колоколом. Три ступени награды:
     уровень < глава (задача 9) < вся кампания. */
  function chime(arpeggio, step, chord, chordGain) {
    arpeggio.forEach((semis, i) => play('lock', { gain: 0.32, semis, delay: i * step }));
    const chordDelay = arpeggio.length * step + 0.03;
    chord.forEach((semis) => play('bell', { gain: chordGain, semis, delay: chordDelay }));
  }
  function playWin() {
    chime([0, 4, 7, 12], 0.08, [0, 7], 0.22);
  }
  function playChapterWin() {
    chime([0, 4, 7, 12, 16], 0.075, [0, 4, 7], 0.2);
  }
  function playFanfare() {
    chime([0, 4, 7, 12, 16, 19], 0.09, [0, 4, 7, 12], 0.2);
  }

  return { setMuted, suspend, resume, playPour, playSettle, playLock, playInvalid, playWin, playChapterWin, playClick, playFanfare };
})();
