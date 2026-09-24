/* ============================================================
   game.js — ввод, правило перелива и условие победы.
   Владеет игровыми ПРАВИЛАМИ (что можно/нельзя) и текущей моделью
   уровня; Board отвечает только за пиксели/анимацию. Переход между
   уровнями (какой уровень следующий, экран меню) — забота main.js;
   game.js лишь сообщает о победе через колбэк.

   ТЗ №22: события хода (выбор, перелив, сборка колбы, отказ, тупик)
   уходят наружу через hooks — эффекты/вибрация/обучение живут в
   main.js, правила остаются здесь.
   ============================================================ */
const Game = (() => {
  let canvas, undoBtn, restartBtn, onWinCallback;
  let hooks = {};
  let level = null;
  let selectedIndex = -1;
  let busy = false;        // идёт анимация — новые тапы игнорируем
  // ТЗ №22, A4: стек ходов уровня (было — только последний ход).
  // Каждый элемент — { from, to, elements }.
  let moveStack = [];
  let solved = false;      // уровень пройден — вход заблокирован до следующего уровня

  function emit(name, payload) {
    if (typeof hooks[name] === 'function') hooks[name](payload);
  }

  function init(canvasEl, onWin, eventHooks) {
    canvas = canvasEl;
    onWinCallback = onWin;
    hooks = eventHooks || {};
    undoBtn = document.getElementById('btn-undo');
    restartBtn = document.getElementById('btn-restart');

    let downX = 0, downY = 0;
    canvas.addEventListener('pointerdown', (e) => {
      downX = e.clientX;
      downY = e.clientY;
    });
    canvas.addEventListener('pointerup', (e) => {
      // Отличаем тап от свайпа/скролла жестом — большое смещение не считаем тапом.
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 12) return;
      onTap(e.clientX, e.clientY);
    });

    if (undoBtn) undoBtn.addEventListener('click', undo);
    updateUndoButton();
  }

  function setLevel(lvl) {
    level = lvl;
    selectedIndex = -1;
    busy = false;
    moveStack = [];
    solved = false;
    Board.setSelected(-1);
    updateUndoButton();
  }

  // Число собранных колб — для «звука прогресса» (ТЗ №22, B3).
  function collectedCount(vials) {
    return vials.filter(isCollected).length;
  }

  // Тупик в строгом смысле: ни одного легального хода (см. C3 ТЗ №22).
  // Дёшево (O(n²)), в отличие от BFS findHint — можно звать после
  // каждого хода. Циклы без выхода ловит уже findHint по кнопке ?.
  function hasNoMoves(vials) {
    return !isLevelSolved(vials) && hintLegalMoves(vials).length === 0;
  }

  /* Победа: КАЖДАЯ колба либо пуста, либо однородна по цвету И форме
     И заполнена до вместимости целиком (недобранная колба — не победа). */
  function isLevelSolved(vials) {
    return vials.every(vial => {
      if (vial.length === 0) return true;
      if (vial.length !== Board.VIAL_CAPACITY) return false;
      const top = vial[0];
      return vial.every(el => Board.sameType(el, top));
    });
  }

  /* Колба «собрана» (заполнена, все элементы одного типа) — залочена:
     из неё нельзя лить (ни игроку тапом, ни подсказке), см. onTap и
     findHint ниже. Решение основателя 2026-07-17 — раньше первый
     ЛЕГАЛЬНЫЙ (но бессмысленный) ход мог указывать «перелей уже
     собранную колбу в пустую». */
  function isCollected(vial) {
    return vial.length === Board.VIAL_CAPACITY && vial.every(el => Board.sameType(el, vial[0]));
  }

  /* Сколько верхних одинаковых элементов из sourceVial поместится в targetVial. */
  function computeMoveCount(sourceVial, targetVial) {
    if (sourceVial.length === 0) return 0;
    if (targetVial.length >= Board.VIAL_CAPACITY) return 0;

    const top = sourceVial[sourceVial.length - 1];
    const targetTop = targetVial[targetVial.length - 1];
    if (targetVial.length > 0 && !Board.sameType(targetTop, top)) return 0;

    let count = 0;
    for (let i = sourceVial.length - 1; i >= 0; i--) {
      if (Board.sameType(sourceVial[i], top)) count++;
      else break;
    }
    return Math.min(count, Board.VIAL_CAPACITY - targetVial.length);
  }

  function onTap(clientX, clientY) {
    if (busy || solved || !level) return;
    const idx = Board.hitTest(clientX, clientY);
    if (idx === -1) return;

    Board.clearHint(); // любое взаимодействие с полем снимает подсказку

    if (selectedIndex === -1) {
      if (level.vials[idx].length === 0) return; // нечего поднимать
      if (isCollected(level.vials[idx])) return; // залочена — уже собрана, из неё не льём
      selectedIndex = idx;
      Board.setSelected(idx);
      emit('onSelect', { index: idx });
      return;
    }

    if (idx === selectedIndex) {
      selectedIndex = -1;
      Board.setSelected(-1);
      emit('onDeselect', { index: idx });
      return;
    }

    const sourceVial = level.vials[selectedIndex];
    const targetVial = level.vials[idx];
    const count = computeMoveCount(sourceVial, targetVial);

    if (count === 0) {
      Sound.playInvalid();
      Board.shake(idx); // лёгкий отказ, без наказания; выбор источника остаётся
      emit('onInvalid', { index: idx });
      return;
    }

    const fromIdx = selectedIndex;
    const toIdx = idx;
    selectedIndex = -1;
    Board.setSelected(-1);
    busy = true;
    // Задача 9: высота тона перелива растёт с заполненностью колбы-цели
    // ПОСЛЕ этого хода — считаем от актуальных length'ов ДО splice (модель
    // ещё не изменена в этот момент, см. комментарий у animatePour в board.js).
    Sound.playPour((targetVial.length + count) / Board.VIAL_CAPACITY);

    Board.animatePour({
      fromIdx, toIdx, count,
      onDone: () => {
        const moved = sourceVial.splice(sourceVial.length - count, count);
        targetVial.push(...moved);
        moveStack.push({ from: fromIdx, to: toIdx, elements: moved.slice() });
        busy = false;
        updateUndoButton();
        // Задача 9: колба-цель только что стала полностью собрана —
        // отдельный «щелчок-замок» ВМЕСТО обычного «оседания».
        // ТЗ №22, B3: высота «щелчка» растёт с числом собранных колб.
        const collected = isCollected(targetVial);
        const collectedNow = collectedCount(level.vials);
        if (collected) {
          Sound.playLock(collectedNow - 1);
        } else {
          Sound.playSettle();
        }
        const won = isLevelSolved(level.vials);
        emit('onPour', { fromIdx, toIdx, count, targetLen: targetVial.length, element: moved[0], collected, collectedNow, won });

        if (won) {
          solved = true;
          updateUndoButton(); // прятать её теперь безусловно (см. toggle ниже)
          Sound.playWin();
          if (onWinCallback) onWinCallback();
        } else if (hasNoMoves(level.vials)) {
          emit('onDeadEnd', {});
        }
      }
    });
  }

  function undo() {
    if (!moveStack.length || busy || solved || !level) return;
    const { from, to, elements } = moveStack.pop();
    const count = elements.length;
    const sourceVial = level.vials[to];   // сейчас элементы здесь
    const targetVial = level.vials[from]; // возвращаем сюда

    selectedIndex = -1;
    Board.setSelected(-1);
    Board.clearHint();
    busy = true;
    updateUndoButton();
    emit('onUndo', {});

    Board.animatePour({
      fromIdx: to, toIdx: from, count,
      onDone: () => {
        const moved = sourceVial.splice(sourceVial.length - count, count);
        targetVial.push(...moved);
        busy = false;
        Sound.playSettle();
      }
    });
  }

  function updateUndoButton() {
    const nothingToUndo = !moveStack.length || solved;
    if (undoBtn) undoBtn.classList.toggle('hidden', nothingToUndo);
    // ТЗ №22, A3: рестарт виден по тому же условию — на нетронутом поле
    // он ничего не делает и только отвлекает новичка на уровне 1.
    if (restartBtn) restartBtn.classList.toggle('hidden', nothingToUndo);
  }

  // ТЗ №22: main.js решает, можно ли сейчас перезапустить уровень
  // (идёт анимация перелива — нельзя, модель ещё не обновлена).
  function isBusy() { return busy; }
  function hasMoves() { return moveStack.length > 0; }
  function isSolved() { return solved; }

  /* ---------- Подсказка: первый ход НАСТОЯЩЕГО кратчайшего BFS-решения ----------
     Решение основателя 2026-07-17 (починка дефекта): раньше отдавали
     первую попавшуюся ЛЕГАЛЬНУЮ пару источник→цель — из-за этого
     подсказка могла предложить «перелей уже собранную колбу в пустую»
     (легальный, но бессмысленный ход) или гонять одиночный элемент
     туда-сюда без продвижения к победе. Теперь — BFS от ТЕКУЩЕЙ позиции
     по настоящим правилам игрока (computeMoveCount, с той же блокировкой
     собранных колб как источника, что и у игрока — см. isCollected/
     onTap выше), возвращаем первый ход кратчайшего найденного решения.
     Такой ход по определению либо ведёт к победе, либо приближает к
     ней, и никогда не трогает уже собранную колбу. Если решения от
     текущей позиции нет (тупик) — null, main.js покажет тост без ролика. */
  function cloneVials(vials) {
    return vials.map(v => v.slice());
  }
  function vialSignature(vial) {
    return vial.map(el => el.color + el.shape[0]).join('');
  }
  function hintStateKey(vials) {
    const sigs = vials.map(vialSignature);
    sigs.sort();
    return sigs.join('|');
  }
  function hintLegalMoves(vials) {
    const moves = [];
    for (let i = 0; i < vials.length; i++) {
      if (vials[i].length === 0 || isCollected(vials[i])) continue; // залочена/пусто — не источник
      for (let j = 0; j < vials.length; j++) {
        if (i === j) continue;
        if (computeMoveCount(vials[i], vials[j]) > 0) moves.push({ from: i, to: j });
      }
    }
    return moves;
  }
  function applyHintMove(vials, move) {
    const next = cloneVials(vials);
    const count = computeMoveCount(next[move.from], next[move.to]);
    const moved = next[move.from].splice(next[move.from].length - count, count);
    next[move.to].push(...moved);
    return next;
  }
  function findHint() {
    if (!level) return null;
    const start = cloneVials(level.vials);
    if (isLevelSolved(start)) return null;

    const visited = new Set([hintStateKey(start)]);
    let frontier = [{ vials: start, firstMove: null }];
    let depth = 0;
    const MAX_DEPTH = 200;
    const VISITED_CAP = 200000;

    while (frontier.length > 0 && depth < MAX_DEPTH) {
      depth++;
      const next = [];
      for (const node of frontier) {
        for (const move of hintLegalMoves(node.vials)) {
          const nv = applyHintMove(node.vials, move);
          const key = hintStateKey(nv);
          if (visited.has(key)) continue;
          const firstMove = node.firstMove || move; // ход из САМОГО начала цепочки
          if (isLevelSolved(nv)) return firstMove;
          visited.add(key);
          next.push({ vials: nv, firstMove });
        }
      }
      frontier = next;
      if (visited.size > VISITED_CAP) break; // защитный предохранитель — тупик по факту
    }
    return null; // решения от текущей позиции не нашли — тупик
  }

  return { init, setLevel, findHint, isBusy, hasMoves, isSolved };
})();
