/* Логика нонограмм для инструментов и тестов (Node и браузер):
   подсказки, построчный логический решатель, проверка единственности.
   В игре используется для бесплатной подсказки-объяснения. */
'use strict';

function lineClues(line) {
  var out = [], run = 0;
  for (var i = 0; i < line.length; i++) {
    if (line[i]) run++;
    else if (run) { out.push(run); run = 0; }
  }
  if (run) out.push(run);
  return out.length ? out : [0];
}

function clues(solution) {
  var H = solution.length, W = solution[0].length;
  var rows = solution.map(lineClues);
  var cols = [];
  for (var c = 0; c < W; c++) {
    var col = [];
    for (var r = 0; r < H; r++) col.push(solution[r][c]);
    cols.push(lineClues(col));
  }
  return { rows: rows, cols: cols };
}

// Все расстановки блоков clue в строке длины n, совместимые с known
// (-1 неизвестно, 0 пусто, 1 закрашено). Возвращает пересечение:
// массив из 0/1/-1 или null, если расстановок нет.
function solveLine(known, clue) {
  var n = known.length;
  if (clue.length === 1 && clue[0] === 0) clue = [];
  var acc = null, count = 0;
  var cur = new Array(n).fill(0);
  function place(bi, start) {
    if (bi === clue.length) {
      for (var k = start; k < n; k++) if (known[k] === 1) return;
      count++;
      if (!acc) acc = cur.slice();
      else for (var j = 0; j < n; j++) if (acc[j] !== cur[j]) acc[j] = -1;
      return;
    }
    var len = clue[bi];
    var rest = 0;
    for (var b = bi + 1; b < clue.length; b++) rest += clue[b] + 1;
    for (var s = start; s + len + rest <= n; s++) {
      if (s > start && known[s - 1] === 1) break;
      var ok = true;
      for (var x = s; x < s + len; x++) if (known[x] === 0) { ok = false; break; }
      if (!ok) continue;
      if (s + len < n && known[s + len] === 1) continue;
      for (var y = s; y < s + len; y++) cur[y] = 1;
      place(bi + 1, s + len + 1);
      for (var z = s; z < s + len; z++) cur[z] = 0;
    }
  }
  place(0, 0);
  return count ? acc : null;
}

// Построчное распространение до неподвижной точки. steps — число проходов.
function lineSolve(rowClues, colClues, grid) {
  var H = rowClues.length, W = colClues.length;
  grid = grid || Array.from({ length: H }, function () { return new Array(W).fill(-1); });
  var changed = true, passes = 0;
  while (changed) {
    changed = false; passes++;
    for (var r = 0; r < H; r++) {
      var res = solveLine(grid[r], rowClues[r]);
      if (!res) return { grid: grid, contradiction: true, passes: passes };
      for (var c = 0; c < W; c++) if (grid[r][c] === -1 && res[c] !== -1) { grid[r][c] = res[c]; changed = true; }
    }
    for (var c2 = 0; c2 < W; c2++) {
      var col = [];
      for (var r2 = 0; r2 < H; r2++) col.push(grid[r2][c2]);
      var res2 = solveLine(col, colClues[c2]);
      if (!res2) return { grid: grid, contradiction: true, passes: passes };
      for (var r3 = 0; r3 < H; r3++) if (grid[r3][c2] === -1 && res2[r3] !== -1) { grid[r3][c2] = res2[r3]; changed = true; }
    }
  }
  var solved = grid.every(function (row) { return row.every(function (v) { return v !== -1; }); });
  return { grid: grid, solved: solved, contradiction: false, passes: passes };
}

// Число решений (до limit) перебором с распространением.
function countSolutions(rowClues, colClues, limit) {
  limit = limit || 2;
  var found = 0;
  function rec(grid) {
    if (found >= limit) return;
    var st = lineSolve(rowClues, colClues, grid.map(function (r) { return r.slice(); }));
    if (st.contradiction) return;
    if (st.solved) { found++; return; }
    for (var r = 0; r < st.grid.length; r++) for (var c = 0; c < st.grid[0].length; c++) {
      if (st.grid[r][c] === -1) {
        for (var v = 1; v >= 0; v--) {
          var g = st.grid.map(function (row) { return row.slice(); });
          g[r][c] = v;
          rec(g);
        }
        return;
      }
    }
  }
  rec(Array.from({ length: rowClues.length }, function () { return new Array(colClues.length).fill(-1); }));
  return found;
}

function parseRows(rows) {
  return rows.map(function (s) { return s.split('').map(function (ch) { return ch === '#' ? 1 : 0; }); });
}

function report(solution) {
  var cl = clues(solution);
  var ls = lineSolve(cl.rows, cl.cols);
  return {
    width: solution[0].length, height: solution.length,
    filled: solution.reduce(function (a, r) { return a + r.reduce(function (x, y) { return x + y; }, 0); }, 0),
    row_clues: cl.rows, column_clues: cl.cols,
    line_solvable: !!ls.solved, passes: ls.passes,
    solutions: countSolutions(cl.rows, cl.cols, 2),
  };
}

var api = { lineClues: lineClues, clues: clues, solveLine: solveLine, lineSolve: lineSolve,
  countSolutions: countSolutions, parseRows: parseRows, report: report };
if (typeof module !== 'undefined') module.exports = api;
else window.NonogramLogic = api;
