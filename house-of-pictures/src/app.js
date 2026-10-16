/* «Дом картинок», P0: одна прихожая из четырёх предметов.
   Петля: дом → выбрать предмет → решить картинку → предмет прилетает на своё
   место → выбрать оформление → следующий предмет. Финал: кот, письмо,
   приглашение к чаю, честный конец демо, записка для следующего визита.

   Сохранение: черновик поля — после каждого жеста (запись в localStorage
   с задержкой ≤300 мс и сразу при уходе со страницы); победа — сразу и ДО
   анимации, повторная победа ничего не выдаёт (HopState.completePuzzle). */
(function () {
  'use strict';

  var C = window.HOP_CONTENT;
  var St = window.HopState;
  var N = window.Nonogram;
  var RID = 'r01';
  var SAVE_DELAY = 300;

  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function icon(name) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'ico');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#i-' + name);
    s.appendChild(u);
    return s;
  }
  function button(cls, label, ico, onClick) {
    var b = h('button', cls);
    b.type = 'button';
    if (ico) b.appendChild(icon(ico));
    if (label) b.appendChild(h('span', '', label));
    b.addEventListener('click', onClick);
    return b;
  }

  /* ---------------- хранилище и сейв ---------------- */

  var storage = (function () {
    try {
      var k = '__hop_probe';
      localStorage.setItem(k, '1'); localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
  })();

  var loaded = St.load(storage);
  var S = loaded.state;
  var saveTimer = null;

  function saveNow() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    St.persist(storage, S);
  }
  function scheduleSave() {
    if (saveTimer) return;
    saveTimer = setTimeout(saveNow, SAVE_DELAY);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) saveNow(); });
  window.addEventListener('pagehide', saveNow);

  function log(type, data) { St.logEvent(S, type, data); scheduleSave(); }

  /* ---------------- настройки ---------------- */

  var rmQuery = window.Platform.reducedMotionQuery;
  function reducedMotion() { return !!S.settings.reduced_motion || !!(rmQuery && rmQuery.matches); }
  function applySettings() {
    Sound.setEnabled(S.settings.sound !== false);
    Sound.setVibration(S.settings.vibration !== false);
    document.documentElement.classList.toggle('rm', reducedMotion());
  }
  if (rmQuery && rmQuery.addEventListener) rmQuery.addEventListener('change', applySettings);

  var BUILD = (document.querySelector('meta[name="hop-build"]') || {}).content || 'dev';

  /* ---------------- экраны, тост, лист ---------------- */

  var screen = 'home';
  function showScreen(name) {
    if (screen !== name) hideToast();
    screen = name;
    $('app').setAttribute('data-screen', name);
    $('screen-home').hidden = name !== 'home';
    $('screen-puzzle').hidden = name !== 'puzzle';
  }

  var toastTimer = null;
  function hideToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = null;
    $('toast').classList.remove('is-in');
    $('toast').hidden = true;
  }
  function toast(text, ms) {
    var t = $('toast');
    t.textContent = text;
    t.hidden = false;
    t.classList.remove('is-in');
    void t.offsetWidth;
    t.classList.add('is-in');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-in'); t.hidden = true; }, ms || 3200);
  }

  var sheetOnClose = null;
  function openSheet(node, onClose, cls) {
    closeSheet(true);
    var sh = $('sheet');
    sh.className = 'sheet' + (cls ? ' ' + cls : '');
    sh.innerHTML = '';
    sh.appendChild(node);
    sh.hidden = false;
    $('sheet-backdrop').hidden = false;
    sheetOnClose = onClose || null;
    var f = sh.querySelector('.btn-main, button');
    if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) { /* старые движки */ } }, 30);
  }
  function closeSheet(silent) {
    var sh = $('sheet');
    if (sh.hidden) return;
    sh.hidden = true;
    sh.innerHTML = '';
    $('sheet-backdrop').hidden = true;
    var cb = sheetOnClose;
    sheetOnClose = null;
    if (cb && !silent) cb();
  }
  $('sheet-backdrop').addEventListener('click', function () { Sound.play('back'); closeSheet(); });
  function sheetHead(title) {
    var head = h('div', 'sheet-head');
    head.appendChild(h('h2', 'sheet-title', title));
    head.appendChild(button('tile tile-round tile-ghost', '', 'close', function () { Sound.play('back'); closeSheet(); }));
    head.lastChild.setAttribute('aria-label', 'Закрыть');
    return head;
  }

  /* ---------------- дом ---------------- */

  var room = C.rooms[RID];

  function thumb(oid, ghost) {
    var w = h('span', 'thumb' + (ghost ? ' is-ghost' : ''));
    var img = h('img');
    img.src = Scene.spriteOf(C, S, oid);
    img.alt = '';
    w.appendChild(img);
    return w;
  }

  function renderProgress() {
    var host = $('room-progress');
    host.innerHTML = '';
    room.objects.forEach(function (oid) {
      host.appendChild(thumb(oid, !St.isObjectRestored(C, S, oid)));
    });
    host.setAttribute('aria-label', 'Восстановлено ' + St.restoredCount(C, S, RID) + ' из ' + room.objects.length);
  }

  function puzzleSize(pid) {
    var p = C.puzzles[pid];
    return p.rows[0].length + '×' + p.rows.length;
  }

  function nextVisitPending() {
    var f = S.story_flags;
    return !!(f.room_done_session && (f.session_count || 0) > f.room_done_session && !f.next_visit_seen);
  }

  function renderPanel() {
    var panel = $('home-panel');
    panel.innerHTML = '';
    var f = S.story_flags;

    if (!f.intro_seen) {
      var card = h('div', 'card card-letter');
      card.appendChild(h('p', 'card-text', room.intro));
      card.appendChild(h('p', 'card-sign', '— ' + room.intro_sign));
      panel.appendChild(card);
      var lamp = C.objects.r01_lamp;
      panel.appendChild(button('btn-main', lamp.verb, 'play', function () {
        St.setFlag(S, 'intro_seen'); log('intro_done');
        startObject('r01_lamp');
      }));
      return;
    }

    if (nextVisitPending()) {
      var note = h('div', 'card card-letter');
      note.appendChild(h('p', 'card-text', room.next_visit_note));
      panel.appendChild(note);
      panel.appendChild(button('btn-main', 'Хорошо', 'check', function () {
        St.setFlag(S, 'next_visit_seen'); log('next_visit_note_read'); saveNow(); renderHome();
      }));
      return;
    }

    if (St.isRoomComplete(C, S, RID)) {
      var done = h('div', 'card');
      if (!f.letter_opened) {
        done.appendChild(h('p', 'card-text', room.final_text));
        panel.appendChild(done);
        panel.appendChild(button('btn-main', 'Открыть письмо', 'letter', function () { openLetter(); }));
      } else {
        done.appendChild(h('p', 'card-text', room.demo_end));
        panel.appendChild(done);
        var row = h('div', 'row-actions');
        row.appendChild(button('btn-main', 'До / после', 'compare', openBeforeAfter));
        var again = button('tile tile-round', '', 'letter', function () { openLetter(true); });
        again.setAttribute('aria-label', 'Перечитать письмо');
        row.appendChild(again);
        panel.appendChild(row);
      }
      return;
    }

    var playable = St.playableObjects(C, S, RID).sort(function (a, b) {
      return (St.objectStatus(C, S, b) === 'in_progress') - (St.objectStatus(C, S, a) === 'in_progress');
    });
    if (playable.length === 1) {
      var oid = playable[0], o = C.objects[oid];
      var c1 = h('div', 'card card-goal');
      c1.appendChild(thumb(oid, true));
      var tx = h('div', 'card-body');
      tx.appendChild(h('b', 'card-title', o.title));
      tx.appendChild(h('span', 'card-sub', o.pitch));
      c1.appendChild(tx);
      c1.appendChild(h('span', 'size-chip', puzzleSize(St.nextPuzzle(C, S, oid))));
      panel.appendChild(c1);
      var cont = St.objectStatus(C, S, oid) === 'in_progress';
      panel.appendChild(button('btn-main', cont ? 'Продолжить' : o.verb, 'play', function () { startObject(oid); }));
      return;
    }
    panel.appendChild(h('h3', 'panel-title', 'Что вернём дальше?'));
    var grid = h('div', 'choice-grid');
    playable.forEach(function (oid) {
      var o = C.objects[oid];
      var b = h('button', 'card card-choice');
      b.type = 'button';
      b.setAttribute('data-obj', oid);
      b.appendChild(thumb(oid, true));
      b.appendChild(h('b', 'card-title', o.title));
      b.appendChild(h('span', 'card-sub', o.pitch));
      var meta = h('span', 'choice-meta');
      meta.appendChild(h('span', 'size-chip', puzzleSize(St.nextPuzzle(C, S, oid))));
      if (St.objectStatus(C, S, oid) === 'in_progress') meta.appendChild(h('span', 'wip-chip', 'начато'));
      b.appendChild(meta);
      b.addEventListener('click', function () { startObject(oid); });
      grid.appendChild(b);
    });
    panel.appendChild(grid);
  }

  function renderHome(sceneOpts) {
    $('room-title').textContent = room.title;
    Scene.render($('scene'), C, S, RID, sceneOpts);
    renderProgress();
    renderPanel();
  }

  $('scene').addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t || $('scene').classList.contains('is-busy')) return;
    if (t.hasAttribute('data-letter')) { openLetter(); return; }
    var oid = t.getAttribute('data-obj');
    if (!oid) return;
    var st = St.objectStatus(C, S, oid);
    if (st === 'available' || st === 'in_progress') {
      if (!S.story_flags.intro_seen) { St.setFlag(S, 'intro_seen'); log('intro_done'); }
      startObject(oid);
    } else if (st === 'restored' || st === 'choose_variant') {
      Sound.play('tap');
      var img = t.querySelector('img');
      if (img) { img.classList.remove('is-wiggle'); void img.offsetWidth; img.classList.add('is-wiggle'); }
      log('object_tap', { object_id: oid });
      openVariantSheet(oid, { secret: true });
    }
  });

  $('btn-settings').addEventListener('click', function () { Sound.play('tap'); openSettings(); });

  /* ---------------- поле ---------------- */

  var cur = null; // { pid, oid, tutorial }

  function solutionOf(pid) {
    return C.puzzles[pid].rows.map(function (r) { return r.split('').map(function (ch) { return ch === '#' ? 1 : 0; }); });
  }

  function startObject(oid) {
    if (!St.canStartObject(C, S, oid)) {
      toast('Сначала закончи начатые вещи');
      return;
    }
    var pid = St.nextPuzzle(C, S, oid);
    if (!pid) return;
    Sound.play('tap');
    var p = C.puzzles[pid], o = C.objects[oid];
    cur = { pid: pid, oid: oid, tutorial: pid === 'r01_lamp_01' && !S.story_flags.tutorial_done, step: 0, firstMove: false };
    showScreen('puzzle');
    $('puzzle-title').textContent = o.title;
    $('puzzle-size').textContent = puzzleSize(pid);
    var prev = $('puzzle-preview');
    prev.innerHTML = '';
    prev.appendChild(thumb(oid, true));
    $('reveal').hidden = true;
    $('reveal').innerHTML = '';
    setToolbarEnabled(true);

    var sol = solutionOf(pid);
    N.render({ width: sol[0].length, height: sol.length, solution: sol }, $('puzzle-container'), onWin, onMove, onLine);
    markFiveLines(sol[0].length, sol.length);
    var d = S.drafts[pid];
    if (d) N.restoreBoard(St.decodeBoard(d.board, sol[0].length, sol.length));
    setMode(1);
    updateUndo();
    log('puzzle_start', { puzzle_id: pid, object_id: oid, resumed: !!d });
    coachStart();
  }

  // Толстая линия через каждые пять клеток (ТЗ 01 §12).
  function markFiveLines(W, H) {
    var cells = $('puzzle-container').querySelectorAll('.grid-cell');
    for (var i = 0; i < cells.length; i++) {
      var r = +cells[i].dataset.r, c = +cells[i].dataset.c;
      if (c % 5 === 4 && c !== W - 1) cells[i].classList.add('b5r');
      if (r % 5 === 4 && r !== H - 1) cells[i].classList.add('b5b');
    }
  }

  var mode = 1;
  function setMode(m) {
    mode = m;
    N.setMode(m);
    $('mode-fill').classList.toggle('is-on', m === 1);
    $('mode-cross').classList.toggle('is-on', m === 2);
    $('mode-fill').setAttribute('aria-checked', String(m === 1));
    $('mode-cross').setAttribute('aria-checked', String(m === 2));
    coachCheck();
  }
  $('mode-fill').addEventListener('click', function () { if (mode !== 1) Sound.play('toggle'); setMode(1); });
  $('mode-cross').addEventListener('click', function () { if (mode !== 2) Sound.play('toggle'); setMode(2); });
  $('btn-undo').addEventListener('click', function () { N.undo(); });
  $('btn-hint').addEventListener('click', doHint);
  $('btn-home').addEventListener('click', goHomeFromPuzzle);

  function setToolbarEnabled(on) {
    ['mode-fill', 'mode-cross', 'btn-hint'].forEach(function (id) { $(id).disabled = !on; });
    if (!on) $('btn-undo').disabled = true;
  }
  function updateUndo() { $('btn-undo').disabled = !N.canUndo(); }

  function onMove(kind) {
    if (!cur) return;
    if (kind === 'fill') { Sound.play('fill'); Sound.buzz(8); }
    else if (kind === 'cross') Sound.play('cross');
    else if (kind === 'erase') Sound.play('erase');
    else if (kind === 'undo') Sound.play('back');
    if (!cur.firstMove && (kind === 'fill' || kind === 'cross')) {
      cur.firstMove = true;
      log('first_move', { puzzle_id: cur.pid });
    }
    if (!N.isWon()) {
      St.saveDraft(S, cur.pid, N.getBoardState());
      scheduleSave();
    }
    updateUndo();
    coachCheck();
  }

  function onLine() { Sound.line(); }

  function goHomeFromPuzzle() {
    if (!cur) return;
    Sound.play('back');
    if (!N.isWon()) { St.saveDraft(S, cur.pid, N.getBoardState()); }
    saveNow();
    coachHide();
    cur = null;
    showScreen('home');
    renderHome();
  }

  document.addEventListener('keydown', function (e) {
    if (!$('sheet').hidden) {
      if (e.key === 'Escape') { Sound.play('back'); closeSheet(); }
      return;
    }
    if (screen !== 'puzzle' || !cur) return;
    var k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); N.undo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === 'x' || k === 'ч') setMode(mode === 1 ? 2 : 1);
    else if (k === 'z' || k === 'я') N.undo();
    else if (k === 'h' || k === 'р') doHint();
    else if (k === 'escape') goHomeFromPuzzle();
  });

  /* ---------------- обучение действием (лампа) ---------------- */

  // Лампа: ряды 2 и 3 по 5 клеток, столбец 3 — 5 клеток, ряд 4 — одна клетка.
  var COACH = [
    { text: 'Закрась ряд', line: ['row', 1], done: function (b) { return lineFilled(b, 'row', 1); } },
    { text: 'И этот тоже', line: ['row', 2], done: function (b) { return lineFilled(b, 'row', 2); } },
    { text: 'Теперь столбец', line: ['col', 2], done: function (b) { return lineFilled(b, 'col', 2); } },
    { text: 'Пустое — крестиком', target: 'mode-cross', done: function () { return mode === 2; } },
    { text: 'Тут одна клетка. Остальные — ×', line: ['row', 3], done: function (b) { return countIn(b, 'row', 3, 2) >= 2; } },
    { text: 'Назад к кисти', target: 'mode-fill', done: function () { return mode === 1; } },
    { text: 'Дорисуй лампу!', done: function () { return false; }, last: true }
  ];

  function lineCells(b, kind, i) {
    return kind === 'row' ? b[i] : b.map(function (r) { return r[i]; });
  }
  function lineFilled(b, kind, i) {
    var sol = solutionOf(cur.pid);
    var want = lineCells(sol, kind, i), got = lineCells(b, kind, i);
    return want.every(function (v, k) { return !v || got[k] === 1; });
  }
  function countIn(b, kind, i, val) {
    return lineCells(b, kind, i).filter(function (v) { return v === val; }).length;
  }

  function coachStart() {
    coachHide();
    if (!cur || !cur.tutorial) return;
    cur.step = 0;
    log('tutorial_start');
    coachCheck();
  }

  function coachCheck() {
    if (!cur || !cur.tutorial || N.isWon()) return;
    var b = N.getBoardState();
    while (cur.step < COACH.length && COACH[cur.step].done(b)) cur.step++;
    if (cur.step >= COACH.length) { coachHide(); return; }
    coachShow(COACH[cur.step]);
  }

  function coachHide() {
    $('coach').hidden = true;
    var old = document.querySelectorAll('.is-coach');
    for (var i = 0; i < old.length; i++) old[i].classList.remove('is-coach');
  }

  function coachShow(step) {
    coachHide();
    $('coach-text').textContent = step.text;
    $('coach').hidden = false;
    $('coach').classList.toggle('is-down', !!step.target);
    var box = $('puzzle-container');
    if (step.line) {
      var kind = step.line[0], idx = step.line[1];
      var clue = box.querySelector(kind === 'row' ? '.row-clue[data-row="' + idx + '"]' : '.col-clue[data-col="' + idx + '"]');
      if (clue) clue.classList.add('is-coach');
      var sel = kind === 'row' ? '.grid-cell[data-r="' + idx + '"]' : '.grid-cell[data-c="' + idx + '"]';
      var cells = box.querySelectorAll(sel);
      for (var i = 0; i < cells.length; i++) cells[i].classList.add('is-coach');
    }
    if (step.target) $(step.target).classList.add('is-coach');
  }

  /* ---------------- подсказка: бесплатное объяснение ---------------- */

  function doHint() {
    if (!cur || N.isWon()) return;
    Sound.play('hint');
    var errs = N.findErrors();
    if (errs.length) {
      N.applyHint({ r: errs[0].r, c: errs[0].c, action: 'clear' });
      // автокрестики, выведенные из этой ошибки, тоже неверны — убираем разом
      if (N.hasWrongCrosses()) N.revealErrors();
      toast('Эта клетка лишняя — поставила крестик');
      log('hint', { puzzle_id: cur.pid, kind: 'wrong_fill' });
      return;
    }
    if (N.hasWrongCrosses()) {
      N.revealErrors();
      toast('Крестик стоял на картинке — убрала его');
      log('hint', { puzzle_id: cur.pid, kind: 'wrong_cross' });
      return;
    }
    var d = lineDeduction();
    if (d) {
      flashLine(d.kind, d.idx);
      N.applyHint({ r: d.r, c: d.c, action: 'fill' });
      toast((d.kind === 'row' ? 'Строка ' : 'Столбец ') + (d.idx + 1) + ': эта клетка закрашена при любом раскладе');
      log('hint', { puzzle_id: cur.pid, kind: 'line', line: d.kind + d.idx });
      return;
    }
    var any = N.findHint();
    if (any) {
      N.applyHint(any);
      toast('Вот одна верная клетка');
      log('hint', { puzzle_id: cur.pid, kind: 'cell' });
    }
  }

  // Ищет линию, где по числам и уже поставленным отметкам клетка точно закрашена.
  function lineDeduction() {
    var b = N.getBoardState();
    var sol = solutionOf(cur.pid);
    var cl = N.calcClues(sol);
    var H = sol.length, W = sol[0].length;
    function known(line) { return line.map(function (v) { return v === 1 ? 1 : v === 2 ? 0 : -1; }); }
    var best = null;
    function consider(kind, idx, line, clue) {
      var k = known(line);
      var res = NonogramLogic.solveLine(k, clue);
      if (!res) return;
      var fresh = [];
      for (var i = 0; i < k.length; i++) if (k[i] === -1 && res[i] === 1) fresh.push(i);
      if (fresh.length && (!best || fresh.length > best.n)) {
        var i0 = fresh[0];
        best = { kind: kind, idx: idx, n: fresh.length, r: kind === 'row' ? idx : i0, c: kind === 'row' ? i0 : idx };
      }
    }
    for (var r = 0; r < H; r++) consider('row', r, b[r], cl.rows[r]);
    for (var c = 0; c < W; c++) consider('col', c, b.map(function (row) { return row[c]; }), cl.cols[c]);
    return best;
  }

  function flashLine(kind, idx) {
    var box = $('puzzle-container');
    var clue = box.querySelector(kind === 'row' ? '.row-clue[data-row="' + idx + '"]' : '.col-clue[data-col="' + idx + '"]');
    if (!clue) return;
    clue.classList.remove('is-hinted'); void clue.offsetWidth; clue.classList.add('is-hinted');
    setTimeout(function () { clue.classList.remove('is-hinted'); }, 1600);
  }

  /* ---------------- победа и раскрытие ---------------- */

  function onWin() {
    if (!cur) return;
    var pid = cur.pid, oid = cur.oid;
    var res = St.completePuzzle(C, S, pid);
    if (cur.tutorial) { St.setFlag(S, 'tutorial_done'); log('tutorial_done'); }
    if (res.room_done) St.setFlag(S, 'room_done_session', S.story_flags.session_count || 1);
    saveNow(); // награда записана до любой анимации
    coachHide();
    setToolbarEnabled(false);
    Sound.play('win');
    var rm = reducedMotion();
    setTimeout(function () { showReveal(pid, oid, res); }, rm ? 120 : 620);
  }

  function pixelCanvas(pid) {
    var sol = solutionOf(pid);
    var H = sol.length, W = sol[0].length, k = 24;
    var cv = document.createElement('canvas');
    cv.width = W * k; cv.height = H * k;
    var g = cv.getContext('2d');
    g.fillStyle = '#3b2c22';
    for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) if (sol[r][c]) g.fillRect(c * k, r * k, k, k);
    cv.className = 'reveal-pixels';
    return cv;
  }

  var revealState = null;
  function showReveal(pid, oid, res) {
    var box = $('reveal');
    box.innerHTML = '';
    var stage = h('div', 'reveal-stage');
    stage.appendChild(pixelCanvas(pid));
    var img = h('img', 'reveal-sprite');
    img.src = Scene.spriteOf(C, S, oid);
    img.alt = C.objects[oid].title;
    stage.appendChild(img);
    box.appendChild(stage);
    box.appendChild(h('div', 'reveal-title', C.objects[oid].title + '!'));
    box.hidden = false;
    var rm = reducedMotion();
    revealState = { pid: pid, oid: oid, res: res, done: false };
    requestAnimationFrame(function () { box.classList.add('is-on'); });
    setTimeout(function () { box.classList.add('to-sprite'); }, rm ? 0 : 380);
    revealState.timer = setTimeout(finishReveal, rm ? 700 : 1500);
  }
  $('reveal').addEventListener('click', function () { finishReveal(); });

  function finishReveal() {
    var rs = revealState;
    if (!rs || rs.done) return;
    rs.done = true;
    clearTimeout(rs.timer);
    var src = $('reveal').querySelector('.reveal-sprite');
    var from = src ? src.getBoundingClientRect() : null;
    $('reveal').classList.remove('is-on', 'to-sprite');
    $('reveal').hidden = true;
    cur = null;
    showScreen('home');
    // Сначала комната «до» этого предмета, затем полёт и появление.
    renderHome({ hide: rs.oid });
    $('scene').classList.add('is-busy');
    var to = Scene.objectRect($('scene'), rs.oid);
    var rm = reducedMotion();
    var land = function () { arrive(rs); };
    if (rm || !from || !to || !document.body.animate) { land(); return; }
    var fly = h('img', 'fly');
    fly.src = src.src;
    fly.style.left = from.left + 'px';
    fly.style.top = from.top + 'px';
    fly.style.width = from.width + 'px';
    fly.style.height = from.height + 'px';
    document.body.appendChild(fly);
    var sx = to.width / from.width, sy = to.height / from.height;
    var dx = to.left - from.left, dy = to.top - from.top;
    var anim = fly.animate([
      { transform: 'translate(0,0) scale(1)', offset: 0 },
      { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 40) + 'px) scale(' + (1 + sx) / 2 + ',' + (1 + sy) / 2 + ')', offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')', offset: 1 }
    ], { duration: 720, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
    fly.style.transformOrigin = '0 0';
    anim.onfinish = function () { fly.remove(); land(); };
    anim.oncancel = function () { fly.remove(); land(); };
  }

  function arrive(rs) {
    renderHome({ fresh: rs.oid });
    Sound.play('reward');
    Sound.buzz(20);
    toast(C.objects[rs.oid].done_text, 4200);
    var newly = St.playableObjects(C, S, RID).filter(function (oid) { return St.objectStatus(C, S, oid) === 'available'; });
    if (newly.length && !rs.res.room_done) setTimeout(function () { Sound.play('unlock'); }, 600);
    setTimeout(function () {
      $('scene').classList.remove('is-busy');
      openVariantSheet(rs.oid, {
        afterReveal: true,
        story: C.objects[rs.oid].done_text,
        onDone: function () { if (rs.res.room_done) roomFinale(); }
      });
    }, reducedMotion() ? 400 : 1400);
  }

  function roomFinale() {
    log('room_complete', { room_id: RID });
    saveNow();
    renderHome({ fresh: 'room' });
    Sound.play('chord');
  }

  /* ---------------- оформление ---------------- */

  function openVariantSheet(oid, opts) {
    opts = opts || {};
    var o = C.objects[oid];
    var node = h('div', 'variant-sheet');
    node.appendChild(sheetHead(opts.afterReveal ? 'Какой будет ' + o.title.toLowerCase() + '?' : o.title));
    if (opts.secret) node.appendChild(h('p', 'secret', o.tap_secret));
    // Тост с историей предмета уходит в шторку: поверх неё он закрыл бы заголовок.
    if (opts.story) { hideToast(); node.appendChild(h('p', 'secret', opts.story)); }
    var grid = h('div', 'variant-grid');
    function paint() {
      var curV = S.object_variants[oid];
      var cards = grid.querySelectorAll('.variant');
      for (var i = 0; i < cards.length; i++) {
        var on = cards[i].getAttribute('data-v') === curV;
        cards[i].classList.toggle('is-selected', on);
        cards[i].setAttribute('aria-pressed', String(on));
      }
    }
    o.variants.forEach(function (v) {
      var b = h('button', 'variant');
      b.type = 'button';
      b.setAttribute('data-v', v.id);
      var im = h('img');
      im.src = 'assets/art/' + v.sprite + '.webp';
      im.alt = '';
      b.appendChild(im);
      b.appendChild(h('span', 'variant-title', v.title));
      var mark = h('span', 'variant-check');
      mark.appendChild(icon('check'));
      b.appendChild(mark);
      b.addEventListener('click', function () {
        if (S.object_variants[oid] !== v.id) Sound.play('toggle');
        St.chooseVariant(C, S, oid, v.id);
        scheduleSave();
        paint();
        Scene.render($('scene'), C, S, RID);
        renderProgress();
      });
      grid.appendChild(b);
    });
    node.appendChild(grid);
    node.appendChild(button('btn-main', 'Готово', 'check', function () { Sound.play('tap'); closeSheet(); }));
    paint();
    openSheet(node, function () {
      if (St.objectStatus(C, S, oid) === 'choose_variant') St.closeVariantChoice(S, oid);
      saveNow();
      renderHome();
      if (opts.onDone) opts.onDone();
    }, 'sheet-variants');
  }

  /* ---------------- письмо, приглашение, конец демо ---------------- */

  function openLetter(reread) {
    Sound.play('tap');
    var node = h('div', 'letter-sheet');
    node.appendChild(sheetHead('Письмо с птичьей печатью'));
    var env = h('button', 'envelope');
    env.type = 'button';
    env.setAttribute('aria-label', 'Распечатать');
    var im = h('img');
    im.src = 'assets/art/letter.webp';
    im.alt = '';
    env.appendChild(im);
    node.appendChild(env);
    var go = button('btn-main', 'Распечатать', 'letter', showInvitation);
    env.addEventListener('click', showInvitation);
    node.appendChild(go);
    openSheet(node, function () { renderHome(); }, 'sheet-letter');
    if (!S.story_flags.letter_opened) { St.setFlag(S, 'letter_opened'); log('letter_open'); saveNow(); }
    if (reread) showInvitation();
  }

  function showInvitation() {
    Sound.play('reward');
    var inv = room.invitation;
    var node = h('div', 'invite-sheet');
    var card = h('div', 'invite');
    var im = h('img', 'invite-art');
    im.src = 'assets/art/invitation.webp';
    im.alt = '';
    card.appendChild(im);
    var body = h('div', 'invite-body');
    body.appendChild(h('h2', 'invite-title', inv.title));
    body.appendChild(h('p', 'invite-text', inv.text));
    body.appendChild(h('p', 'invite-sign', '— ' + inv.sign));
    card.appendChild(body);
    node.appendChild(card);
    node.appendChild(button('btn-main', 'Пойти к чаю', 'play', showDemoEnd));
    openSheet(node, function () { renderHome(); }, 'sheet-invite');
    log('invitation_view');
  }

  function showDemoEnd() {
    Sound.play('tap');
    var node = h('div', 'demo-end');
    node.appendChild(sheetHead(room.next_room_title));
    var door = h('div', 'door-closed');
    door.appendChild(icon('lock'));
    node.appendChild(door);
    node.appendChild(h('p', 'card-text', room.demo_end));
    var row = h('div', 'row-actions');
    row.appendChild(button('btn-main', 'До / после', 'compare', openBeforeAfter));
    var home = button('tile tile-round', '', 'home', function () { Sound.play('back'); closeSheet(); });
    home.setAttribute('aria-label', 'Домой');
    row.appendChild(home);
    node.appendChild(row);
    openSheet(node, function () { renderHome(); }, 'sheet-demo');
    if (!S.story_flags.demo_end_seen) { St.setFlag(S, 'demo_end_seen'); log('demo_end'); saveNow(); }
  }

  function openBeforeAfter() {
    Sound.play('tap');
    var node = h('div', 'ba-sheet');
    node.appendChild(sheetHead('Было и стало'));
    var box = h('div', 'ba');
    var after = h('div', 'scene ba-after');
    var before = h('div', 'scene ba-before');
    box.appendChild(after);
    box.appendChild(before);
    var lblB = h('span', 'ba-label ba-label-b', 'До');
    var lblA = h('span', 'ba-label ba-label-a', 'После');
    box.appendChild(lblB); box.appendChild(lblA);
    var range = h('input', 'ba-range');
    range.type = 'range'; range.min = '0'; range.max = '100'; range.value = '50';
    range.setAttribute('aria-label', 'Сравнить до и после');
    function setCut() { box.style.setProperty('--cut', range.value + '%'); }
    range.addEventListener('input', setCut);
    setCut();
    node.appendChild(box);
    node.appendChild(range);
    openSheet(node, function () { renderHome(); }, 'sheet-ba');
    Scene.render(after, C, S, RID, { interactive: false });
    Scene.render(before, C, S, RID, { interactive: false, before: true });
    log('before_after_open');
    if (!reducedMotion()) {
      // Шторка сама проезжает туда-обратно один раз — видно, что её можно двигать.
      var t0 = performance.now();
      (function step(t) {
        if (!document.body.contains(range) || range.dataset.touched) return;
        var k = Math.min(1, (t - t0) / 1600);
        range.value = String(Math.round(50 + 35 * Math.sin(k * Math.PI * 2)));
        setCut();
        if (k < 1) requestAnimationFrame(step);
      })(t0);
      range.addEventListener('pointerdown', function () { range.dataset.touched = '1'; });
    }
  }

  /* ---------------- настройки ---------------- */

  function openSettings() {
    var node = h('div', 'settings');
    node.appendChild(sheetHead('Настройки'));
    var row = h('div', 'toggles');
    [['sound', 'Звук', 'sound'], ['vibration', 'Вибрация', 'vibro'], ['reduced_motion', 'Меньше движения', 'motion']].forEach(function (t) {
      var key = t[0];
      var wrap = h('label', 'toggle');
      var b = h('button', 'tile tile-round toggle-btn');
      b.type = 'button';
      b.appendChild(icon(t[2]));
      function paint() {
        var on = key === 'reduced_motion' ? !!S.settings[key] : S.settings[key] !== false;
        b.classList.toggle('is-off', !on);
        b.setAttribute('aria-pressed', String(on));
      }
      b.setAttribute('aria-label', t[1]);
      b.addEventListener('click', function () {
        S.settings[key] = key === 'reduced_motion' ? !S.settings[key] : S.settings[key] === false;
        applySettings();
        Sound.play('toggle');
        log('setting', { key: key, value: S.settings[key] });
        saveNow();
        paint();
      });
      paint();
      wrap.appendChild(b);
      wrap.appendChild(h('span', 'toggle-label', t[1]));
      row.appendChild(wrap);
    });
    node.appendChild(row);
    if (Platform.journal) {
      var dev = h('div', 'dev-row');
      dev.appendChild(button('btn-small', 'Журнал', null, exportJournal));
      var reset = button('btn-small btn-danger', 'Сбросить прогресс', null, function () {
        if (!reset.dataset.armed) { reset.dataset.armed = '1'; reset.lastChild.textContent = 'Точно сбросить?'; return; }
        storage.removeItem(St.STORAGE_KEY);
        location.reload();
      });
      dev.appendChild(reset);
      node.appendChild(dev);
    }
    node.appendChild(h('p', 'build-stamp', 'Сборка ' + BUILD + ' · контент ' + C.content_version));
    openSheet(node, null, 'sheet-settings');
  }

  function exportJournal() {
    var data = JSON.stringify({ build: BUILD, exported_at: new Date().toISOString(), ua: navigator.userAgent, state: S }, null, 2);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = 'hop-journal-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------------- запуск ---------------- */

  function boot() {
    if (loaded.recovered_from_broken) St.logEvent(S, 'save_recovered_from_broken');
    S.content_version = C.content_version;
    St.registerVisit(S);
    St.logEvent(S, 'session_start', { build: BUILD, platform: Platform.name, fresh: loaded.fresh, viewport: innerWidth + 'x' + innerHeight });
    saveNow();
    applySettings();
    Platform.init();
    showScreen('home');
    renderHome();
  }

  // Для автотестов и наблюдения: только чтение.
  window.__hop = {
    state: function () { return JSON.parse(JSON.stringify(S)); },
    build: BUILD,
    screen: function () { return screen; },
    currentPuzzle: function () { return cur ? cur.pid : null; }
  };

  boot();
})();
