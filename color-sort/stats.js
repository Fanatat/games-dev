/* ============================================================
   stats.js — активное время прохождения (Вариант Б, решение
   основателя 2026-07-17). Считает только АКТИВНОЕ время текущего
   уровня: копится, пока игрок реально взаимодействует; останавливается
   на паузе (реклама/сворачивание — main.js вызывает pause()/resume())
   и на простое без указателя-ввода дольше IDLE_MS (сама себя тушит по
   таймеру, main.js будит её через onInput() на любой тап по игровому
   экрану). Секунды по уровню отдаются наружу только при finishLevel()
   (победа) — main.js кладёт их в объект сейва ЦЕЛИКОМ (levelTimes[]).
   Таймер НИКОГДА не отрисовывается во время игры — только читается на
   экране завершения кампании (антистресс-тон, см. CLAUDE.md).
   ============================================================ */
const Stats = (() => {
  const IDLE_MS = 12000;

  let currentLevel = -1;
  let accumulatedMs = 0;
  let runStart = null;   // timestamp начала текущего «активного» отрезка, null если не идёт
  let idleTimer = null;

  function now() { return performance.now(); }

  function flush() {
    if (runStart !== null) {
      accumulatedMs += now() - runStart;
      runStart = null;
    }
  }
  function clearIdle() {
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
  }
  function armIdle() {
    clearIdle();
    idleTimer = setTimeout(flush, IDLE_MS);
  }

  /* Вход на уровень (в т.ч. повторный после «Назад») — счёт стартует с нуля. */
  function startLevel(idx) {
    flush();
    currentLevel = idx;
    accumulatedMs = 0;
    runStart = now();
    armIdle();
  }

  /* Пауза геймплея (реклама, сворачивание вкладки — main.js pauseGame). */
  function pause() {
    flush();
    clearIdle();
  }
  /* Возврат из паузы — резюмируем, только если уровень реально загружен. */
  function resume() {
    if (currentLevel === -1 || runStart !== null) return;
    runStart = now();
    armIdle();
  }

  /* Любой тап по игровому экрану — если счёт стоял из-за простоя,
     возобновляем; в любом случае переставляем таймер простоя. */
  function onInput() {
    if (currentLevel === -1) return;
    if (runStart === null) runStart = now();
    armIdle();
  }

  /* Победа на уровне — фиксируем итог в секундах, сбрасываем состояние. */
  function finishLevel() {
    flush();
    const seconds = Math.round(accumulatedMs / 1000);
    currentLevel = -1;
    clearIdle();
    return seconds;
  }

  /* Уход с уровня БЕЗ победы (кнопка «Назад») — отбрасываем отрезок,
     чтобы фоновая пауза/резюм на экране меню не досчитывала его. */
  function stop() {
    clearIdle();
    runStart = null;
    accumulatedMs = 0;
    currentLevel = -1;
  }

  return { startLevel, pause, resume, onInput, finishLevel, stop };
})();
