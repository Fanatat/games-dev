/* ============================================================
   analytics.js — событийная аналитика в Яндекс Метрике (ТЗ №25).
   Тонкая обёртка по K-09: игра зовёт Analytics.event(имя, параметры)
   и о результате не знает — вызов ничего не ждёт, никогда не бросает
   исключение и не меняет поведение игры.

   Отправка включена ТОЛЬКО в сборке площадки: build.py подменяет
   плейсхолдер BUILD_PLATFORM (ниже) на vk или yandex. Из исходников
   плейсхолдер остаётся как есть — события в сеть не уходят, при
   ?debug=1 пишутся в консоль. Собранная игра на localhost тоже молчит.

   Скрипт Метрики грузится асинхронно и только по Analytics.start()
   (main.js зовёт его ПОСЛЕ Platform.gameReady()). События до загрузки
   копятся в очереди в памяти (не больше QUEUE_LIMIT, лишние
   отбрасываются) и уходят после загрузки скрипта. Не загрузился
   (адблок, нет сети) — очередь молча пропадает.

   Персональные данные не отправляются: ни ID пользователя площадки,
   ни имени. Только собственный clientID Метрики.
   ============================================================ */
const Analytics = (() => {
  const COUNTER_ID = 113086303;
  const TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';
  const QUEUE_LIMIT = 50;
  const BUILD_PLATFORM = 'vk';

  // Тестовый хост games-dev — всегда 'dev', чтобы бой никогда не смешался
  // с проверками. Локальный запуск (автотесты, ручные прогоны сборки) не
  // шлёт ничего: иначе каждый прогон засорял бы счётчик.
  function isLocalRun() {
    try {
      const host = location.hostname;
      return !host || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:';
    } catch (e) { return true; }
  }
  function detectPlatform() {
    try {
      if (location.pathname.indexOf('/games-dev/') !== -1) return 'dev';
    } catch (e) { return 'dev'; }
    return BUILD_PLATFORM;
  }

  const enabled = (BUILD_PLATFORM === 'vk' || BUILD_PLATFORM === 'yandex') && !isLocalRun();
  const debug = (() => {
    try { return new URLSearchParams(location.search).get('debug') === '1'; } catch (e) { return false; }
  })();

  let state = 'idle';   // idle → loading → ready | failed
  let queue = [];

  function log(kind, name, params) {
    if (debug) console.log('[analytics]', kind, name, params || {});
  }

  function ym() {
    try { window.ym.apply(null, arguments); } catch (e) { /* аналитика не роняет игру */ }
  }

  // Параметры цели вложены под её имя: {level_win: {level: 3, …}}.
  // Метрика складывает параметры reachGoal в «Параметры визитов», и плоские
  // ключи level/sec разных целей (старт, победа, выход) там слились бы в
  // одну ветку (доработка 27.09). Цель без параметров уходит как есть.
  function send(name, params) {
    if (params) ym(COUNTER_ID, 'reachGoal', name, { [name]: params });
    else ym(COUNTER_ID, 'reachGoal', name);
  }

  function flush() {
    const pending = queue;
    queue = [];
    pending.forEach(e => send(e.name, e.params));
  }

  function event(name, params) {
    try {
      log(enabled ? 'event' : 'event (выкл, не в сборке)', name, params);
      if (!enabled || state === 'failed') return;
      if (state === 'ready') { send(name, params); return; }
      if (queue.length < QUEUE_LIMIT) queue.push({ name, params });
    } catch (e) { /* аналитика не роняет игру */ }
  }

  // build — строка плашки билда (Platform.BUILD), без неё визит несёт 'unknown'.
  function start(build) {
    try {
      if (!enabled || state !== 'idle') return;
      state = 'loading';
      const visitParams = { platform: detectPlatform(), build: String(build || 'unknown') };
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
      const s = document.createElement('script');
      s.async = true;
      s.src = TAG_URL;
      s.onload = () => {
        if (state !== 'loading') return;
        state = 'ready';
        flush();
      };
      s.onerror = () => {
        state = 'failed';
        queue = [];
        log('fail', 'скрипт Метрики не загрузился — аналитика выключена до перезагрузки');
      };
      document.head.appendChild(s);
      ym(COUNTER_ID, 'init', {
        clickmap: false,
        trackLinks: false,
        accurateTrackBounce: true,
        webvisor: false,
        params: visitParams,
      });
      log('start', 'визит', visitParams);
    } catch (e) {
      state = 'failed';
      queue = [];
    }
  }

  return { event, start, COUNTER_ID };
})();
