// Воронка событий (раунд 15, П5 — ТЗ_КАЧЕСТВО_CRAZYGAMES_2026-09-25.md).
// До этого внутриигровой аналитики не было: по статистике ВК D1 7,7%, D7 0,
// но где именно уходят игроки — неизвестно.
//
// API: Analytics.track(name, params) — одна строка в месте события.
// События «Последнего конвоя» (поход = уровень, js/convoy.js):
//   mission_start {id, how}, mission_win {id, sec}, mission_lose {id, stop, sec},
//   mission_restart {id}, mission_quit {id, stop}, stop_clear {id, stop},
//   era_up {id, stop}, daily_take {streak}, first_move, rewarded_click {place},
//   ad_reward_ok / ad_reward_fail {screen}, interstitial_shown;
// общие с «Двумя крепостями» (game.js, режим миссий): boot_first_screen,
// menu_shown, shop_open, tutorial_step {n}, crash_*, perf_level_*.
//
// Куда уходит:
//  (a) всегда — журнал #debug (BOOT.event, js/diag.js) и счётчики в
//      localStorage (кроме CrazyGames — там localStorage запрещён,
//      ТЗ_CRAZYGAMES_ИНТЕГРАЦИЯ.md п.4; счётчики живут в памяти);
//  (b) Яндекс Метрика, счётчик METRIKA.id (17.10.2026, общий набор целей
//      студии) — только в собранной игре для ВК или Яндекса
//      (build_release.py вписывает window.GAME_PLATFORM='vk'|'yandex' до
//      первого скрипта) и не на локальной машине. Стенд games-dev — тоже
//      площадка: туда уходит с параметром визита platform='dev'. Внутренние
//      имена переводятся в цели студии таблицей METRIKA_GOALS; чего нет в
//      таблице (menu_shown, crash_*, perf_level_*), в Метрику не уходит.
//      tag.js грузится асинхронно после load окна (не держит документ в
//      «загрузке»), вызовы до загрузки — в очереди (не больше 50), ошибка
//      загрузки (адблок, нет сети) молча выключает отправку. Вебвизора нет;
//  (c) CrazyGames — метрики воронки площадка собирает сама (gameplayStart/
//      Stop уже вызываются, см. PLATFORM.setGameplayActive). Отсюда только
//      штатные вызовы SDK.game: setGameContext/clearGameContext (контекст к
//      отзывам игроков), reportGameCompletedPercentage (прогресс кампании),
//      happytime (редко: финал главы и кампании — «beating a boss»).
//      Метрика в CrazyGames-сборке не включается;
//  (d) ВК — только Метрика (b): VKWebAppTrackEvent требует отдельной
//      настройки MyTracker.
// Любая ошибка внутри глотается — аналитика не имеет права ронять игру.
'use strict';

const ANALYTICS_CONFIG = {
  // Счётчик Яндекс Метрики «Последнего конвоя» (заведён 17.10.2026).
  // 0/null = не отправлять. У родителя «Две крепости» свой номер — не путать.
  yandexMetrikaId: 113661737,
};

// Внутреннее имя → цель Метрики (общий набор студии + свои цели игры) и
// какие параметры с ней уходят. Параметры вложены под имя цели:
// reachGoal('level_win', {level_win: {level: 2, sec: 310}}) — иначе плоские
// level/sec разных целей слились бы в «Параметрах визитов» в одну ветку.
const METRIKA_GOALS = {
  boot_first_screen: ['game_loaded', p => ({ ms: p.ms })],
  first_move: ['first_move', p => ({ level: p.id })],
  mission_start: ['level_start', p => ({ level: p.id, how: p.how })],
  mission_win: ['level_win', p => ({ level: p.id, sec: p.sec })],
  mission_lose: ['level_lose', p => ({ level: p.id, stop: p.stop, sec: p.sec })],
  mission_restart: ['level_restart', p => ({ level: p.id })],
  mission_quit: ['level_quit', p => ({ level: p.id, stop: p.stop })],
  rewarded_click: ['rewarded_click', p => ({ place: p.place })],
  ad_reward_ok: ['rewarded_result', () => ({ ok: true })],
  ad_reward_fail: ['rewarded_result', () => ({ ok: false })],
  interstitial_shown: ['interstitial_shown', null],
  return_day: ['return_day', p => ({ day: p.day })],
  era_up: ['era_up', p => ({ level: p.id, stop: p.stop, age: p.age })],
  tutorial_step: ['tutorial_step', p => ({ n: p.n, skipped: p.skipped })],
  shop_open: ['shop_open', null],
  stop_clear: ['stop_clear', p => ({ level: p.id, stop: p.stop })],
  daily_take: ['daily_take', p => ({ streak: p.streak })],
};

// Только примитивы и без undefined — объект игры в Метрику не уходит.
function metrikaParams(obj) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if ((typeof v === 'number' && isFinite(v)) || typeof v === 'string' || typeof v === 'boolean') out[k] = v;
  }
  return out;
}

// Отправка в Метрику: включение, загрузка tag.js, очередь.
const METRIKA = (() => {
  const id = ANALYTICS_CONFIG.yandexMetrikaId;
  const TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';
  const QUEUE_LIMIT = 50;
  const MOUNT_FALLBACK_MS = 5000; // load окна завис на стороннем ресурсе — грузим не позже
  // Площадка сборки: build_release.py пишет её в index.html до первого скрипта
  // (platform.js потом ставит 'auto' только если пусто). Из исходников — 'none'.
  const build = String(window.GAME_PLATFORM || '');

  // Локальный запуск (автотесты на 127.0.0.1, ручные прогоны, файл, сеть
  // 192.168.x.x) не шлёт ничего: иначе каждый прогон засорял бы счётчик.
  function isLocalRun() {
    try {
      if (location.protocol !== 'https:') return true;
      const h = String(location.hostname || '').toLowerCase();
      if (!h || h === 'localhost' || /\.(localhost|local)$/.test(h)) return true;
      return /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(h);
    } catch (e) { return true; }
  }
  const onTestHost = (() => { try { return location.pathname.indexOf('/games-dev/') !== -1; } catch (e) { return false; } })();
  const enabled = !!id && (build === 'vk' || build === 'yandex') && !isLocalRun();
  const platform = onTestHost ? 'dev' : build;

  let state = enabled ? 'queue' : 'off'; // queue → loading → ready | failed; off — выключено
  let queue = [];
  const sent = []; // последние отправленные (для #debug и тестов)

  function ym(...args) {
    try { window.ym(...args); } catch (e) { /* аналитика не роняет игру */ }
  }
  function send(goal, params) {
    const p = { platform };
    if (params && Object.keys(params).length) p[goal] = params;
    ym(id, 'reachGoal', goal, p);
    if (sent.length >= 20) sent.shift();
    sent.push(goal);
  }
  function mount() {
    if (state !== 'queue') return;
    state = 'loading';
    try {
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
      const s = document.createElement('script');
      s.async = true;
      s.src = TAG_URL;
      s.onload = () => {
        if (state !== 'loading') return;
        state = 'ready';
        const pending = queue; queue = [];
        pending.forEach(e => send(e.goal, e.params));
      };
      s.onerror = () => { state = 'failed'; queue = []; };
      document.head.appendChild(s);
      ym(id, 'init', {
        clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false,
        params: { platform, build: String(window.GAME_BUILD || 'unknown') },
      });
    } catch (e) { state = 'failed'; queue = []; }
  }
  if (enabled) {
    try {
      if (document.readyState === 'complete') setTimeout(mount, 0);
      else {
        window.addEventListener('load', () => setTimeout(mount, 0), { once: true });
        setTimeout(mount, MOUNT_FALLBACK_MS);
      }
    } catch (e) { state = 'failed'; }
  }

  return {
    goal(goal, params) {
      if (state === 'off' || state === 'failed') return;
      if (state === 'ready') { send(goal, params); return; }
      if (queue.length < QUEUE_LIMIT) queue.push({ goal, params });
    },
    info() { return { id, enabled, platform, state, queued: queue.length, sent: sent.slice() }; },
  };
})();

const Analytics = (() => {
  const LS_KEY = 'lastconvoy_funnel_v1';
  const PER_ID = { mission_start: 1, mission_win: 1, mission_lose: 1, mission_restart: 1, mission_quit: 1, era_up: 1, stop_clear: 1 };
  let lastScreen = null;
  let reportedPct = 0;
  const happyDone = {};

  function platformKind() {
    try { if (typeof PLATFORM !== 'undefined') return PLATFORM.kind(); } catch (e) { /* ниже фолбэк */ }
    return window.GAME_PLATFORM || 'none';
  }
  function onCrazyGames() {
    return platformKind() === 'crazygames' || window.GAME_PLATFORM === 'crazygames';
  }
  function cgGame() {
    if (platformKind() !== 'crazygames') return null;
    const sdk = window.CrazyGames && window.CrazyGames.SDK;
    if (!sdk || sdk.environment === 'disabled' || !sdk.game) return null;
    return sdk.game;
  }
  function cgCall(method, ...args) {
    try {
      const g = cgGame();
      if (g && typeof g[method] === 'function') g[method](...args);
    } catch (e) { console.warn('[analytics] CrazyGames', method, e); }
  }

  // ---- (a) счётчики
  let memStore = { v: 1, c: {}, first: {} };
  let loaded = false;
  function store() {
    if (loaded) return memStore;
    loaded = true;
    if (onCrazyGames()) return memStore;
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw && JSON.parse(raw);
      if (parsed && parsed.c) memStore = parsed;
    } catch (e) { /* приватный режим / битые данные — считаем с нуля в памяти */ }
    return memStore;
  }
  function count(key) {
    const s = store();
    s.c[key] = (s.c[key] || 0) + 1;
    if (!s.first[key]) s.first[key] = Date.now();
  }
  function persist() {
    if (onCrazyGames()) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(memStore)); } catch (e) { /* квота/запрет */ }
  }

  // ---- (b) Яндекс Метрика (см. METRIKA выше)
  function metrika(name, params) {
    const m = METRIKA_GOALS[name];
    if (!m) return;
    METRIKA.goal(m[0], m[1] ? metrikaParams(m[1](params || {})) : null);
  }

  // Возврат в другой календарный день: day — номер дня с первого запуска
  // (первый день — 0, следующий — 1 …). Отмечается раз за день при загрузке.
  const DAYS_KEY = 'lastconvoy_days_v1';
  function dayNo(t) { const d = new Date(t); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
  function checkReturnDay() {
    if (onCrazyGames()) return;
    let st = null;
    try { st = JSON.parse(localStorage.getItem(DAYS_KEY) || 'null'); } catch (e) { st = null; }
    const today = dayNo(Date.now());
    if (!st || typeof st.first !== 'number') st = { first: today, last: today };
    else if (st.last !== today) {
      st.last = today;
      track('return_day', { day: Math.max(1, today - st.first) });
    }
    try { localStorage.setItem(DAYS_KEY, JSON.stringify(st)); } catch (e) { /* квота/запрет */ }
  }
  let firstMoveDone = false;

  // ---- (c) CrazyGames
  function missionsTotal() {
    return (typeof MISSIONS !== 'undefined' && MISSIONS.length) || 0;
  }
  function reportProgress(done) {
    const total = missionsTotal();
    if (!total || !(done > 0)) return;
    const pct = Math.max(0, Math.min(100, Math.round(done / total * 100)));
    if (pct <= reportedPct) return; // прогресс только вперёд
    reportedPct = pct;
    cgCall('reportGameCompletedPercentage', pct);
  }
  function unlockedDone() {
    try { if (typeof progress !== 'undefined' && progress && progress.unlocked) return progress.unlocked - 1; } catch (e) { /* нет */ }
    return 0;
  }
  function crazyGames(name, params) {
    if (!cgGame()) return;
    if (name === 'boot_first_screen') {
      // Док: «report the correct percentage on game start».
      reportProgress(unlockedDone());
    } else if (window.CONVOY_PROTOTYPE && /^mission_/.test(name)) {
      // «Последний конвой»: mission_* — походы по уровням (js/convoy.js), а не
      // миссии кампании MISSIONS; прогресс кампании по ним CrazyGames не шлём.
    } else if (name === 'mission_start' && params) {
      cgCall('setGameContext', { mission: params.id });
    } else if (name === 'menu_shown') {
      cgCall('clearGameContext');
    } else if (name === 'mission_win' && params) {
      reportProgress(Math.max(params.id, unlockedDone()));
      const total = missionsTotal();
      const perChapter = (typeof MISSIONS_PER_CHAPTER !== 'undefined' && MISSIONS_PER_CHAPTER) || 0;
      const bossWin = (total && params.id >= total) || (perChapter && params.id % perChapter === 0);
      // happytime — «use sparingly»: только финал главы/кампании и не чаще
      // одного раза за сессию на миссию.
      if (bossWin && !happyDone[params.id]) {
        happyDone[params.id] = true;
        cgCall('happytime');
      }
    }
  }

  function track(name, params) {
    try {
      count(name);
      if (params && PER_ID[name] && params.id != null) count(name + ':' + params.id);
      persist();
      if (typeof BOOT !== 'undefined' && BOOT.event) BOOT.event(name, params);
      metrika(name, params);
      crazyGames(name, params);
    } catch (e) {
      console.warn('[analytics] track failed', name, e);
    }
  }

  // Первый экран отмечает js/diag.js (BOOT.firstScreen) — отдельный вызов в
  // game.js не нужен.
  window.addEventListener('boot:firstscreen', () => {
    track('boot_first_screen', { ms: Math.round(performance.now()) });
    try { checkReturnDay(); } catch (e) { /* аналитика не ломает загрузку */ }
  });

  return {
    track,
    // Из showScreen(): смена экрана -> menu_shown / shop_open (только при
    // переходе, не при повторном показе того же экрана). Сравниваем со своим
    // lastScreen, а не с переменной screen игры: та стартует со значения
    // 'menu', и первый показ меню иначе не засчитывался бы.
    screenShown(name) {
      const was = lastScreen;
      lastScreen = name;
      if (name === was) return;
      if (name === 'menu') track('menu_shown');
      else if (name === 'shop') track('shop_open');
    },
    // Итог рекламы за вознаграждение (зовёт PLATFORM.showBonusAd).
    adReward(ok) { track(ok ? 'ad_reward_ok' : 'ad_reward_fail', { screen: lastScreen }); },
    // Первое действие игрока в бою за сессию (найм, камнепад) — один раз.
    firstMove(params) {
      if (firstMoveDone) return;
      firstMoveDone = true;
      track('first_move', params);
    },
    // Состояние отправки в Метрику: Analytics.metrika() в консоли.
    metrika() { return METRIKA.info(); },
    // Счётчики для отладки: Analytics.stats() в консоли.
    stats() { return JSON.parse(JSON.stringify(store())); },
  };
})();
