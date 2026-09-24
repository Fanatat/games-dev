/* ============================================================
   sound.js — короткие звуки на Web Audio (без файлов, бандл лёгкий).
   Фаза 6. Единственная точка синтеза звука в игре.

   AudioContext создаётся ЛЕНИВО — на первый реальный вызов play*(),
   который случится не раньше первого клика игрока (браузеры блокируют
   автозапуск звука без пользовательского жеста). Отдельный «анлок»
   не нужен: создание контекста внутри обработчика клика само по себе
   и есть тот жест.

   suspend()/resume() — вызываются из pauseGame()/resumeGame() в
   main.js (реклама, сворачивание вкладки). state.muted проверяется
   на каждый play*() — если звук выключен, просто ничего не звучит.
   ============================================================ */
const Sound = (() => {
  let ctx = null;
  let muted = false;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null; // нет Web Audio — тихо деградируем, игра живая
      ctx = new AC();
    }
    ctx.resume(); // безопасно и при уже 'running' — браузер делает no-op
    return ctx;
  }

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

  /* ---------- Один короткий тон (строительный блок всех звуков) ---------- */
  function tone({ freq, duration, type = 'sine', gain = 0.15, delay = 0, freqEnd = null }) {
    if (muted) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;

    const t0 = audioCtx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration);
    }
    gainNode.gain.setValueAtTime(0, t0);
    gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  /* ---------- Игровые звуки ---------- */
  /* fillRatio — насколько заполнена колба-ПРИЁМНИК ПОСЛЕ этого перелива
     (0..1, задача 9): выше заполненность → выше высота тона. Диапазон
     340-720 Гц подобран так, чтобы даже соседние ступени (перелив по
     одному элементу, capacity=4 → шаг 0.25) были на слух различимы.
     game.js вызывает ДО фактического splice — считает по актуальным
     length'ам источника/цели и count хода, здесь чистая функция от
     готового числа. */
  function playPour(fillRatio = 0.5) {
    const r = Math.max(0, Math.min(1, fillRatio));
    const freq = 340 + r * 380;
    tone({ freq, freqEnd: freq * 0.73, duration: 0.14, type: 'sine', gain: 0.12 });
  }
  function playSettle() {
    tone({ freq: 300, freqEnd: 160, duration: 0.09, type: 'triangle', gain: 0.14 });
  }
  /* «Щелчок-замок» (задача 9) — колба-приёмник только что стала
     ПОЛНОСТЬЮ собрана (заполнена, один тип элементов). Намеренно другой
     тембр, чем playSettle (мягкий triangle-спад): короткий square-клик
     + отдельная более высокая sine-нота следом — звучит как «защёлкнулось»,
     не спутать с обычным приземлением. Вызывается ВМЕСТО playSettle для
     этого хода (game.js), не вместе с ним. */
  // ТЗ №22, B3: step — сколько колб уровня уже было собрано ДО этой
  // (0 — первая). Каждая следующая звучит на тон выше (мажорная гамма
  // от A5), потолок — октава: прогресс по уровню слышен.
  const LOCK_STEPS = [0, 2, 4, 5, 7, 9, 11, 12];
  function playLock(step = 0) {
    const semis = LOCK_STEPS[Math.max(0, Math.min(LOCK_STEPS.length - 1, step | 0))];
    const k = Math.pow(2, semis / 12);
    tone({ freq: 900 * k, duration: 0.035, type: 'square', gain: 0.09 });
    tone({ freq: 880 * k, duration: 0.12, type: 'sine', gain: 0.12, delay: 0.03 });
  }
  function playInvalid() {
    tone({ freq: 180, duration: 0.16, type: 'square', gain: 0.05 });
  }
  function playWin() {
    // Заметная, но короткая «ta-da»: восходящее арпеджио (C5-E5-G5-C6)
    // + финальный мажорный аккорд на более тёплой (triangle) волне.
    // Всё укладывается меньше чем в секунду — антистресс-темп сохранён,
    // просто момент теперь читается как награда, а не тихий бип.
    const arpeggio = [523.25, 659.25, 783.99, 1046.5];
    arpeggio.forEach((freq, i) => {
      tone({ freq, duration: 0.16, type: 'sine', gain: 0.13, delay: i * 0.07 });
    });
    const chordDelay = arpeggio.length * 0.07 + 0.02;
    [523.25, 659.25, 783.99].forEach(freq => {
      tone({ freq, duration: 0.5, type: 'triangle', gain: 0.11, delay: chordDelay });
    });
  }
  function playClick() {
    tone({ freq: 700, duration: 0.05, type: 'sine', gain: 0.07 });
  }
  /* Экран завершения ГЛАВЫ (задача 9) — «чуть богаче» обычного playWin
     (пятая нота в арпеджио, на полтона шире финальный аккорд), но
     короче и тише playFanfare ниже: глава — промежуточная награда,
     не финал кампании. */
  function playChapterWin() {
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1174.66];
    arpeggio.forEach((freq, i) => {
      tone({ freq, duration: 0.15, type: 'sine', gain: 0.13, delay: i * 0.06 });
    });
    const chordDelay = arpeggio.length * 0.06 + 0.02;
    [523.25, 659.25, 783.99, 987.77].forEach(freq => {
      tone({ freq, duration: 0.55, type: 'triangle', gain: 0.1, delay: chordDelay });
    });
  }
  /* Экран завершения ВСЕЙ кампании (не отдельного уровня) — тот же
     язык, что и playWin, но шире и с более длинным финальным
     аккордом: разовый момент заслуживает более заметную награду. */
  function playFanfare() {
    const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    arpeggio.forEach((freq, i) => {
      tone({ freq, duration: 0.18, type: 'sine', gain: 0.13, delay: i * 0.08 });
    });
    const chordDelay = arpeggio.length * 0.08 + 0.02;
    [523.25, 659.25, 783.99, 1046.5].forEach(freq => {
      tone({ freq, duration: 0.8, type: 'triangle', gain: 0.1, delay: chordDelay });
    });
  }

  return { setMuted, suspend, resume, playPour, playSettle, playLock, playInvalid, playWin, playChapterWin, playClick, playFanfare };
})();
