/* ============================================================
   Sound — звук на Web Audio (без аудиофайлов, бандл остаётся крошечным).
   SFX: found (слово найдено), wrong (ошибка), win (победа), gold.
   b24: step (буква в пути), combo (серия находок), star (звезда),
   chapter (глава пройдена), tap (кнопка).
   b24, доп. 24.09 (жалоба основателя: «режут уши»): тембр переделан целиком.
   Было — треугольник/пила на 660–2100 Гц с резким обрывом, это и
   звенело. Стало — мягкий «деревянный» щипок (калимба/маримба):
     • только синусы: основной тон + тихий обертон октавой выше,
       обертон гаснет втрое быстрее — окраска без визга;
     • регистр на октаву-две ниже (C4–C6, потолок ~1 кГц);
     • атака 6–12 мс (без щелчка) и длинный экспоненциальный хвост;
     • мастер: гейн 0.55 → ФНЧ 2,2 кГц → мягкий компрессор, верха
       срезаны даже при наложении нот;
     • ошибка — глухой низкий «бум» 190→120 Гц вместо пилы 150 Гц.
   Пауза: suspend/resume для рекламы (п.4.7) и сворачивания (п.1.3).
   Звук создаётся лениво и только после действия пользователя
   (политика автоплея браузеров).
   ============================================================ */

window.Sound = (function () {
  var ctx = null;
  var muted = false;
  var out = null;   // вход мастер-цепочки (или destination, если узлов нет)

  function ensure() {
    if (!ctx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        ctx = AC ? new AC() : null;
      } catch (e) { ctx = null; }
      if (ctx) out = buildMaster(ctx);
    }
    return ctx;
  }

  // Мастер: гейн → ФНЧ → компрессор → выход. ФНЧ срезает всё, что
  // «сверлит» (выше ~2 кГц); компрессор мягко прижимает наложения.
  function buildMaster(c) {
    try {
      var m = c.createGain();
      m.gain.value = 0.55;
      var lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2200;
      lp.Q.value = 0.5;
      var comp = c.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 20;
      comp.ratio.value = 3;
      comp.attack.value = 0.005;
      comp.release.value = 0.2;
      m.connect(lp); lp.connect(comp); comp.connect(c.destination);
      return m;
    } catch (e) { return c.destination; }
  }

  // Вызывать по действию пользователя (нажатие), чтобы разрешить звук.
  function resumeContext() {
    var c = ensure();
    if (c && c.state === 'suspended') c.resume();
  }

  function live() {
    if (muted) return null;
    var c = ensure();
    if (!c) return null;
    if (c.state === 'suspended') c.resume();
    return c;
  }

  // Один синус с огибающей: мягкая атака, экспоненциальный хвост.
  // glide — частота в конце (для «бума» ошибки), иначе тон ровный.
  function voice(c, freq, dur, vol, t, atk, glide) {
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out || c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  // Щипок: основной тон + обертон октавой выше (тише и короче).
  // delay — сдвиг старта в секундах (часы аудио точнее setTimeout).
  function pluck(freq, dur, vol, delay, atk) {
    var c = live();
    if (!c) return;
    var t = c.currentTime + (delay || 0);
    var a = atk || 0.008;
    voice(c, freq, dur, vol, t, a);
    voice(c, freq * 2, dur * 0.35, vol * 0.18, t, a);
  }

  // Частота ноты: n полутонов от C5.
  var C5 = 523.25;
  function note(n) { return C5 * Math.pow(2, n / 12); }

  // Слово найдено — два тона вверх (G4 → C5), как «тук-тук» калимбы.
  function found() {
    pluck(note(-5), 0.22, 0.11);
    pluck(note(0), 0.32, 0.11, 0.07);
  }
  // b20: золотое слово — светлый отзвук E5 → G5 поверх found().
  function gold() {
    pluck(note(4), 0.3, 0.1, 0.14);
    pluck(note(7), 0.45, 0.1, 0.22);
  }
  // Ошибка — глухой низкий «бум» с опусканием, без жёсткой пилы.
  function wrong() {
    var c = live();
    if (!c) return;
    voice(c, 190, 0.22, 0.2, c.currentTime, 0.012, 120);
  }
  // Победа — мажорное трезвучие C5 E5 G5 и мягкий C6 в конце.
  function win() {
    pluck(note(0), 0.3, 0.18, 0);
    pluck(note(4), 0.3, 0.18, 0.12);
    pluck(note(7), 0.3, 0.18, 0.24);
    pluck(note(12), 0.7, 0.16, 0.38);
  }

  // b24: буква добавлена в путь. Пентатоника от C4 вверх, потолок —
  // E5 (8-я ступень): тихий короткий «тук», не звон.
  var PENTA = [0, 2, 4, 7, 9];
  function step(i) {
    i = Math.max(0, Math.min(i | 0, 7));
    var n = Math.floor(i / 5) * 12 + PENTA[i % 5] - 12;
    pluck(note(n), 0.12, 0.08, 0, 0.006);
  }

  // b24: серия быстрых находок (n ≥ 2) — короткое арпеджио трезвучия,
  // корень поднимается на тон с каждой ступенью (от C5, потолок A5).
  function combo(n) {
    n = n | 0;
    if (n < 2) return;
    if (n > 6) n = 6;
    var root = (n - 2) * 2;
    pluck(note(root), 0.18, 0.11, 0);
    pluck(note(root + 4), 0.18, 0.11, 0.06);
    pluck(note(root + 7), 0.3, 0.11, 0.12);
  }

  // b24: звёзды за уровень — C5, E5, G5 с долгим мягким хвостом.
  var STARS = [0, 4, 7];
  function star(i) {
    pluck(note(STARS[Math.max(0, Math.min(i | 0, 2))]), 0.55, 0.15, 0, 0.01);
  }

  // b24: глава пройдена — восходящий C4 E4 G4 C5 и мягкий аккорд (~1,2 с).
  function chapter() {
    pluck(note(-12), 0.25, 0.15, 0);
    pluck(note(-8), 0.25, 0.15, 0.11);
    pluck(note(-5), 0.25, 0.15, 0.22);
    pluck(note(0), 0.35, 0.15, 0.33);
    pluck(note(-5), 0.9, 0.08, 0.52, 0.02);
    pluck(note(0), 0.9, 0.08, 0.52, 0.02);
    pluck(note(4), 0.9, 0.09, 0.52, 0.02);
  }

  // b24: щелчок кнопки — едва слышный низкий «тук».
  function tap() { pluck(note(-12), 0.06, 0.05, 0, 0.004); }

  // Пауза/возврат звука (реклама, сворачивание).
  function suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); }
  function resume() { if (!muted && ctx && ctx.state === 'suspended') ctx.resume(); }

  function setMuted(m) { muted = !!m; if (muted) suspend(); else resume(); }
  function isMuted() { return muted; }

  function init() {
    // Звук останавливается при сворачивании страницы (п.1.3).
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) suspend(); else resume();
    });
  }

  return {
    init: init, resumeContext: resumeContext,
    found: found, wrong: wrong, win: win, gold: gold,
    step: step, combo: combo, star: star, chapter: chapter, tap: tap,
    suspend: suspend, resume: resume,
    setMuted: setMuted, isMuted: isMuted,
  };
})();
