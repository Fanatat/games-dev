/* Чистая логика поля (ТЗ §4.1–4.2): без DOM, работает и в браузере, и в node-тестах.
   Координаты — [строка, столбец] с нуля. Соседство только по стороне. */
(function (root) {
  'use strict';

  function norm(s) {
    return String(s || '').toUpperCase().replace(/Ё/g, 'Е');
  }

  function adjacent(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  }

  // Путь внутри поля, шаги по стороне, без повторного посещения клетки.
  function pathValid(path, rows, cols) {
    if (!path || !path.length) return false;
    var seen = {};
    for (var i = 0; i < path.length; i++) {
      var p = path[i];
      if (p[0] < 0 || p[1] < 0 || p[0] >= rows || p[1] >= cols) return false;
      var k = p[0] + ':' + p[1];
      if (seen[k]) return false;
      seen[k] = true;
      if (i && !adjacent(path[i - 1], p)) return false;
    }
    return true;
  }

  function pathWord(grid, path) {
    return path.map(function (p) { return grid[p[0]].charAt(p[1]); }).join('');
  }

  /* Какой ответ составлен этим путём (по буквам, а не по записанным координатам).
     clues — кандидаты [{id, answer}]. Возвращает {clue, path} где path уже в порядке
     чтения ответа (обратное проведение разворачивается), либо null. */
  function match(grid, rows, cols, path, clues) {
    if (!pathValid(path, rows, cols)) return null;
    var w = norm(pathWord(grid, path));
    var rev = w.split('').reverse().join('');
    for (var i = 0; i < clues.length; i++) {
      var a = norm(clues[i].answer);
      if (a.length !== w.length) continue;
      if (a === w) return { clue: clues[i], path: path.slice() };
      if (a === rev) return { clue: clues[i], path: path.slice().reverse() };
    }
    return null;
  }

  // Все пути, которыми слово читается на поле (в прямом порядке ответа).
  function findPaths(grid, rows, cols, word, limit) {
    word = norm(word);
    limit = limit || 1000;
    var out = [];
    var used = {};
    function dfs(r, c, i, acc) {
      if (out.length >= limit) return;
      if (r < 0 || c < 0 || r >= rows || c >= cols) return;
      var k = r + ':' + c;
      if (used[k] || norm(grid[r].charAt(c)) !== word.charAt(i)) return;
      acc.push([r, c]);
      if (i === word.length - 1) { out.push(acc.slice()); acc.pop(); return; }
      used[k] = true;
      dfs(r - 1, c, i + 1, acc); dfs(r + 1, c, i + 1, acc);
      dfs(r, c - 1, i + 1, acc); dfs(r, c + 1, i + 1, acc);
      used[k] = false;
      acc.pop();
    }
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) dfs(r, c, 0, []);
    return out;
  }

  function turns(path) {
    var t = 0;
    for (var i = 2; i < path.length; i++) {
      var d1 = [path[i - 1][0] - path[i - 2][0], path[i - 1][1] - path[i - 2][1]];
      var d2 = [path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]];
      if (d1[0] !== d2[0] || d1[1] !== d2[1]) t++;
    }
    return t;
  }

  // «4 буквы», «5 букв», «2 буквы» — согласование для подписи длины.
  function lettersLabel(n) {
    var m10 = n % 10, m100 = n % 100;
    var w = (m10 === 1 && m100 !== 11) ? 'буква' : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? 'буквы' : 'букв';
    return n + ' ' + w;
  }

  var api = { norm: norm, adjacent: adjacent, pathValid: pathValid, pathWord: pathWord, match: match,
    findPaths: findPaths, turns: turns, lettersLabel: lettersLabel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WordLogic = api;
})(this);
