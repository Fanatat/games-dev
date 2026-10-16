/* Поле букв (ТЗ §4.1). Схема ввода — из board.js Словохода (game1@0a8abe3): жест
   начинается на клетке, движение слушается на window, клетка под пальцем — через
   elementFromPoint, pointercancel гасит жест без проверки, второй палец не мешает.
   Отличия форка: найденные клетки снова доступны (слова пересекаются), шаг назад на
   предыдущую клетку снимает последнюю букву, проверку слова делает app.js по буквам.
   Найденные слова и текущий путь рисуются линиями в SVG поверх сетки.
   Клавиатура: стрелки — клетка, пробел — начать/добавить, Enter — проверить, Escape — сброс. */
(function (root) {
  'use strict';
  var COLORS = ['#356851', '#B5652E', '#3F6E8C', '#8A5A9E', '#7A7B2E'];
  var boardEl, wrapEl, svgEl, story = null, cells = [], h = {};
  var dragging = false, path = [], found = {}, hintPaths = {}, cursor = null, kbSelecting = false;
  var MAX_CELL = 64;

  function mount() {
    boardEl = document.getElementById('board');
    wrapEl = document.getElementById('board-wrap');
    svgEl = document.getElementById('board-lines');
    boardEl.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    boardEl.addEventListener('keydown', onKey);
    boardEl.addEventListener('focus', function () { if (!cursor) setCursor([0, 0]); });
    boardEl.addEventListener('blur', function () { setCursor(null); });
    // жест по полю не должен прокручивать страницу или выделять текст
    boardEl.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    window.addEventListener('resize', fit);
    // карточка улики выросла (дополнительная улика, крупный текст) — поле подстраивается
    if (window.ResizeObserver) new ResizeObserver(function () { fit(); }).observe(document.getElementById('clue-card'));
  }

  function render(s, foundPaths, handlers) {
    story = s; h = handlers || {}; found = {}; hintPaths = {}; path = []; dragging = false; cursor = null;
    boardEl.style.gridTemplateColumns = 'repeat(' + s.cols + ', 1fr)';
    boardEl.style.gridTemplateRows = 'repeat(' + s.rows + ', 1fr)';
    boardEl.innerHTML = '';
    cells = [];
    for (var r = 0; r < s.rows; r++) {
      cells.push([]);
      for (var c = 0; c < s.cols; c++) {
        var el = document.createElement('div');
        el.className = 'cell';
        el.dataset.r = r; el.dataset.c = c;
        el.textContent = s.grid[r].charAt(c);
        boardEl.appendChild(el);
        cells[r].push(el);
      }
    }
    for (var id in foundPaths) markFound(id, foundPaths[id], true);
    fit();
  }

  /* Размер клетки. В портрете поле берёт место первым: сцена сжимается до своей
     min-height, остальные блоки — по факту. В альбомной сетке у поля своя колонка.
     Во время жеста не перекладываем — линия не должна прыгать под пальцем. */
  var pendingFit = false;
  function fit() {
    if (!story || !wrapEl || wrapEl.offsetParent === null) return;
    if (dragging || kbSelecting) { pendingFit = true; return; }
    pendingFit = false;
    var cs = getComputedStyle(wrapEl);
    var padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    var w = wrapEl.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var field = wrapEl.parentNode, fcs = getComputedStyle(field);
    var gap = parseFloat(getComputedStyle(boardEl).rowGap) || 4;
    var byW = (w - gap * (story.cols - 1)) / story.cols;
    var byH = function (h) { return (h - gap * (story.rows - 1)) / story.rows; };
    var cell;
    if (fcs.display === 'grid') cell = Math.min(byW, byH(wrapEl.clientHeight - padY), MAX_CELL);
    else {
      var used = 0, sceneMin = 0;
      Array.prototype.forEach.call(field.children, function (ch) {
        if (ch === wrapEl) return;
        var s = getComputedStyle(ch);
        if (s.display === 'none' || s.position === 'absolute') return;
        var isScene = ch.classList.contains('scene');
        if (isScene) sceneMin = parseFloat(s.minHeight) || 0;
        used += (isScene ? 0 : ch.getBoundingClientRect().height) + parseFloat(s.marginTop) + parseFloat(s.marginBottom);
      });
      var free = field.clientHeight - parseFloat(fcs.paddingTop) - parseFloat(fcs.paddingBottom) - used - padY;
      // сцене — около пятой части высоты, если клетки остаются от 46 px; иначе только её минимум
      var roomy = Math.min(byW, byH(free - Math.max(sceneMin, Math.min(field.clientHeight * 0.2, 170))), MAX_CELL);
      cell = roomy >= 46 ? roomy : Math.min(byW, byH(free - sceneMin), MAX_CELL);
    }
    cell = Math.floor(cell);
    cell = Math.max(cell, 28);
    var bw = cell * story.cols + gap * (story.cols - 1);
    var bh = cell * story.rows + gap * (story.rows - 1);
    boardEl.style.width = bw + 'px';
    boardEl.style.height = bh + 'px';
    boardEl.style.fontSize = Math.round(cell * 0.5) + 'px';
    drawLines();
  }

  /* ---------- линии ---------- */
  function center(p) {
    var el = cells[p[0]][p[1]];
    var wr = wrapEl.getBoundingClientRect(), r = el.getBoundingClientRect();
    return [r.left - wr.left + r.width / 2, r.top - wr.top + r.height / 2, r.width];
  }
  function poly(pts, cls, color, width) {
    if (!pts.length) return '';
    var pp = pts.map(function (p) { var c = center(p); return c[0].toFixed(1) + ',' + c[1].toFixed(1); });
    if (pts.length === 1) {
      var c0 = center(pts[0]);
      return '<circle class="' + cls + '" cx="' + c0[0] + '" cy="' + c0[1] + '" r="' + (width / 2) + '" fill="' + color + '"/>';
    }
    return '<polyline class="' + cls + '" points="' + pp.join(' ') + '" stroke="' + color + '" stroke-width="' + width + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function drawLines() {
    if (!story || !cells.length) return;
    var wr = wrapEl.getBoundingClientRect();
    svgEl.setAttribute('width', wr.width); svgEl.setAttribute('height', wr.height);
    svgEl.setAttribute('viewBox', '0 0 ' + wr.width + ' ' + wr.height);
    var cw = cells[0][0].getBoundingClientRect().width;
    var out = '';
    var idx = clueIndex();
    for (var id in hintPaths) out += poly(hintPaths[id], 'line-hint', '#D59C45', cw * 0.42);
    for (var fid in found) out += poly(found[fid], 'line-found', COLORS[idx[fid] % COLORS.length], cw * 0.36);
    if (path.length) out += poly(path.map(function (p) { return [p.r, p.c]; }), 'line-active', '#2B352F', cw * 0.3);
    svgEl.innerHTML = out;
  }
  function clueIndex() {
    var m = {};
    story.clues.forEach(function (c, i) { m[c.id] = i; });
    return m;
  }

  function markFound(id, p, silent) {
    found[id] = p;
    delete hintPaths[id];
    p.forEach(function (q, i) {
      var el = cells[q[0]][q[1]];
      el.classList.add('found');
      el.classList.remove('hint-start');
      if (!silent && !document.body.classList.contains('rm')) {
        el.style.animationDelay = (i * 40) + 'ms';
        el.classList.remove('wave'); void el.offsetWidth; el.classList.add('wave');
      }
    });
    drawLines();
  }

  /* ---------- подсказки на поле ---------- */
  function showStart(p) {
    clearStart();
    var el = cells[p[0]][p[1]];
    el.classList.add('hint-start');
  }
  function clearStart() {
    boardEl.querySelectorAll('.hint-start').forEach(function (e) { e.classList.remove('hint-start'); });
  }
  function showPath(id, p) { hintPaths[id] = p; drawLines(); }
  function clearHints() { hintPaths = {}; clearStart(); stopPointer(); drawLines(); }

  var pointerEl = null;
  // «Палец» обучения: пульс на первой клетке, весь ответ не рисуем (ТЗ §5).
  function pointAt(p) {
    stopPointer();
    pointerEl = document.createElement('div');
    pointerEl.className = 'finger';
    var c = center(p);
    pointerEl.style.left = c[0] + 'px'; pointerEl.style.top = c[1] + 'px';
    wrapEl.appendChild(pointerEl);
  }
  function stopPointer() { if (pointerEl) { pointerEl.remove(); pointerEl = null; } }

  /* ---------- жест ---------- */
  function cellOf(t) {
    var el = t && t.closest ? t.closest('.cell') : null;
    return el && boardEl.contains(el) ? el : null;
  }
  // Попадание только во внутренние 80% клетки: на стыке углов не перескакиваем по диагонали.
  function cellAt(x, y) {
    var el = document.elementFromPoint(x, y);
    el = el && el.classList && el.classList.contains('cell') && boardEl.contains(el) ? el : null;
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var mx = r.width * 0.1, my = r.height * 0.1;
    if (x < r.left + mx || x > r.right - mx || y < r.top + my || y > r.bottom - my) return null;
    return el;
  }
  function onDown(e) {
    if (!story || h.locked && h.locked()) return;
    if (dragging && e.isPrimary === false) return;
    var el = cellOf(e.target);
    if (!el) return;
    e.preventDefault();
    stopPointer();
    if (h.onTouch) h.onTouch();
    dragging = true;
    kbSelecting = false;
    clearActive();
    path = [];
    add(el);
  }
  function onMove(e) {
    if (!dragging || e.isPrimary === false) return;
    e.preventDefault();
    var el = cellAt(e.clientX, e.clientY);
    if (el) extend(el);
  }
  function onCancel() {
    if (!dragging) return;
    dragging = false;
    clearActive(); path = []; drawLines();
    if (pendingFit) fit();
  }
  function onUp(e) {
    if (!dragging || (e && e.isPrimary === false)) return;
    dragging = false;
    submit();
    if (pendingFit) fit();
  }
  function submit() {
    var p = path.map(function (q) { return [q.r, q.c]; });
    var els = path.map(function (q) { return q.el; });
    path = [];
    var res = p.length >= 2 && h.onSubmit ? h.onSubmit(p) : 'tap';
    clearActive(els);
    if (res === 'wrong') flashWrong(els);
    drawLines();
  }
  function flashWrong(els) {
    els.forEach(function (el) { el.classList.add('wrong'); });
    if (!document.body.classList.contains('rm')) boardEl.classList.add('shake');
    setTimeout(function () {
      els.forEach(function (el) { el.classList.remove('wrong'); });
      boardEl.classList.remove('shake');
    }, 380);
  }
  function clearActive(els) {
    (els || Array.prototype.slice.call(boardEl.querySelectorAll('.cell.active'))).forEach(function (el) { el.classList.remove('active'); });
  }
  function add(el) {
    path.push({ r: +el.dataset.r, c: +el.dataset.c, el: el });
    el.classList.add('active');
    if (h.onStep) h.onStep(path.length);
    drawLines();
  }
  function extend(el) {
    var r = +el.dataset.r, c = +el.dataset.c;
    var last = path[path.length - 1];
    if (!last || (last.r === r && last.c === c)) return;
    var prev = path[path.length - 2];
    if (prev && prev.r === r && prev.c === c) { // шаг назад
      var x = path.pop();
      x.el.classList.remove('active');
      if (h.onBack) h.onBack(path.length);
      drawLines();
      return;
    }
    for (var i = 0; i < path.length; i++) if (path[i].r === r && path[i].c === c) return; // клетка уже в пути
    if (Math.abs(last.r - r) + Math.abs(last.c - c) !== 1) return; // только по стороне
    add(el);
  }

  /* ---------- клавиатура ---------- */
  function setCursor(p) {
    boardEl.querySelectorAll('.cursor').forEach(function (e) { e.classList.remove('cursor'); });
    cursor = p;
    if (p && cells[p[0]]) cells[p[0]][p[1]].classList.add('cursor');
  }
  function onKey(e) {
    if (!story) return;
    var d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (d) {
      e.preventDefault();
      var cur = cursor || [0, 0];
      var n = [Math.max(0, Math.min(story.rows - 1, cur[0] + d[0])), Math.max(0, Math.min(story.cols - 1, cur[1] + d[1]))];
      setCursor(n);
      if (kbSelecting) extend(cells[n[0]][n[1]]);
      return;
    }
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (h.onTouch) h.onTouch();
      stopPointer();
      var cc = cursor || [0, 0];
      if (!kbSelecting) { clearActive(); path = []; kbSelecting = true; add(cells[cc[0]][cc[1]]); }
      else extend(cells[cc[0]][cc[1]]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (kbSelecting) { kbSelecting = false; submit(); if (pendingFit) fit(); }
    } else if (e.key === 'Escape') {
      if (kbSelecting) { e.preventDefault(); kbSelecting = false; clearActive(); path = []; drawLines(); if (pendingFit) fit(); }
    }
  }

  root.Board = { mount: mount, render: render, fit: fit, markFound: markFound, showStart: showStart, clearStart: clearStart,
    showPath: showPath, clearHints: clearHints, pointAt: pointAt, stopPointer: stopPointer, redraw: drawLines,
    get dragging() { return dragging || kbSelecting; }, COLORS: COLORS };
})(this);
