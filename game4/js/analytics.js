// Воронка событий (раунд 15, П5 — ТЗ_КАЧЕСТВО_CRAZYGAMES_2026-09-25.md).
// До этого внутриигровой аналитики не было: по статистике ВК D1 7,7%, D7 0,
// но где именно уходят игроки — неизвестно.
//
// API: Analytics.track(name, params) — одна строка в месте события.
// События: boot_first_screen, menu_shown, mission_start {id},
// mission_win {id, sec, coreHpPct}, mission_lose {id, sec}, era_up {id, age},
// tutorial_step {n}, shop_open, ad_reward_ok / ad_reward_fail {screen}.
//
// Куда уходит:
//  (a) всегда — журнал #debug (BOOT.event, js/diag.js) и счётчики в
//      localStorage (кроме CrazyGames — там localStorage запрещён,
//      ТЗ_CRAZYGAMES_ИНТЕГРАЦИЯ.md п.4; счётчики живут в памяти);
//  (b) Яндекс Метрика (счётчик 113661732, 17.10.2026) — цели reachGoal
//      по таблице METRIKA_GOALS ниже: общий набор студии (game_loaded,
//      first_move, level_start, level_win, level_restart, level_quit,
//      rewarded_click, rewarded_result, interstitial_shown, return_day,
//      level_lose) и свои цели игры (era_up, chapter_complete,
//      tutorial_step, shop_open). Событие вне таблицы (crash_*, perf_*,
//      boot-события) в Метрику не уходит — только в (a).
//      Отправка включена ТОЛЬКО в собранной игре для ВК/Яндекса:
//      build_release.py вписывает window.GAME_PLATFORM='vk'|'yandex' (в
//      исходниках 'auto' — молчим), и только на https-хосте, не localhost
//      и не частной сети (автотесты ходят на http://stand.test — молчат).
//      Стенд games-dev (сборка vk) шлёт с параметром platform='dev'.
//      CrazyGames — не шлём: там своя аналитика площадки.
//      tag.js грузится асинхронно после события load окна (иначе висящий
//      mc.yandex.ru держал бы документ в «загрузке»), не позже чем через
//      5 с после старта модуля. До загрузки цели копятся в очереди (до 50,
//      лишние отбрасываются). Не загрузился (адблок, нет сети) — очередь
//      молча пропадает, игра не замечает. Вебвизор и карта кликов выключены.
//      Адрес хита — без query: в ВК там vk_user_id и подпись запуска.
//      Прежнее правило «никаких запросов к сторонним доменам (автопроверка
//      Яндекса)» Метрику не запрещает: mc.yandex.ru — сервис самого Яндекса,
//      на Яндекс-сборке Метрика остаётся (решение 17.10.2026). Чужих
//      счётчиков и сторонних трекеров по-прежнему нет.
//  (c) CrazyGames — метрики воронки площадка собирает сама (gameplayStart/
//      Stop уже вызываются, см. PLATFORM.setGameplayActive). Отсюда только
//      штатные вызовы SDK.game: setGameContext/clearGameContext (контекст к
//      отзывам игроков), reportGameCompletedPercentage (прогресс кампании),
//      happytime (редко: финал главы и кампании — «beating a boss»);
//  (d) ВК — отдельного канала нет (VKWebAppTrackEvent требует MyTracker),
//      ВК-сборка шлёт в Метрику (b).
// Любая ошибка внутри глотается — аналитика не имеет права ронять игру.
'use strict';

const ANALYTICS_CONFIG = {
  // Номер счётчика Яндекс Метрики — единственное место в коде. 0/null = не
  // отправлять. Цели в счётчике заводятся по именам из METRIKA_GOALS.
  yandexMetrikaId: 113661732,
};

// Событие игры -> цель Метрики. Параметры цели уходят вложенными под её
// имя, а у целей миссии — ещё и под номером миссии (как в game2):
//   reachGoal('level_win', { platform, build, level_win: { '3': { sec: 41, coreHpPct: 70 } } })
// В «Параметрах визитов» дерево «цель -> миссия -> параметр»: по каждой
// миссии видны старты, победы, время (кривая сложности) без отдельной цели
// на миссию (лимит Метрики — разумное число целей, у студии не больше 20).
// map(params) -> параметры цели (id миссии превращается в level).
const METRIKA_GOALS = {
  boot_first_screen: { goal: 'game_loaded', map: () => null },
  first_move: { goal: 'first_move' },
  mission_start: { goal: 'level_start' },
  mission_win: { goal: 'level_win' },
  mission_restart: { goal: 'level_restart' },
  mission_quit: { goal: 'level_quit' },
  ad_reward_click: { goal: 'rewarded_click' },
  ad_reward_ok: { goal: 'rewarded_result', map: (p) => ({ ok: true, screen: p && p.screen }) },
  ad_reward_fail: { goal: 'rewarded_result', map: (p) => ({ ok: false, screen: p && p.screen }) },
  interstitial_shown: { goal: 'interstitial_shown' },
  return_day: { goal: 'return_day' },
  mission_lose: { goal: 'level_lose' },       // поражение в миссии
  // Свои цели «Двух крепостей»:
  era_up: { goal: 'era_up' },                 // игрок перешёл в новую эпоху в бою
  chapter_complete: { goal: 'chapter_complete' }, // победа в последней миссии главы
  tutorial_step: { goal: 'tutorial_step' },   // шаг обучения миссии 1 (воронка обучения)
  shop_open: { goal: 'shop_open' },           // вход в магазин
};

const Analytics = (() => {
  const LS_KEY = 'twinforts_funnel_v1';
  const PER_ID = { mission_start: 1, mission_win: 1, mission_lose: 1, era_up: 1 };
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

  // ---- (b) Яндекс Метрика (см. шапку)
  const TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';
  const QUEUE_MAX = 50;
  const MOUNT_FALLBACK_MS = 5000;
  // Локальный/ручной запуск — не шлём: не https, localhost, *.local,
  // частные адреса сети (сборка, открытая с телефона по 192.168.x.x).
  function isLocalRun(proto, host) {
    if (proto !== 'https:') return true;
    host = String(host || '').toLowerCase().replace(/^\[|\]$/g, '');
    if (!host || host === 'localhost' || /\.(localhost|local)$/.test(host)) return true;
    if (host === '0.0.0.0' || host === '::' || host === '::1') return true;
    const ip = /^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/.exec(host);
    if (ip) {
      const x = +ip[1], y = +ip[2];
      return x === 0 || x === 10 || x === 127 || (x === 169 && y === 254) ||
        (x === 172 && y >= 16 && y <= 31) || (x === 192 && y === 168);
    }
    return /^(fc|fd)[0-9a-f]{2}:/.test(host) || /^fe80:/.test(host);
  }
  const ym = {
    id: Number(ANALYTICS_CONFIG.yandexMetrikaId) || 0,
    enabled: false, offWhy: '', platform: 'dev', build: 'unknown',
    state: 'queue', // queue -> loading -> ready | failed
    queue: [], timer: 0, debug: false,
  };
  try {
    ym.debug = /(^|[?&])debug=1(&|$)/.test(location.search);
    const gp = window.GAME_PLATFORM;
    const isBuild = gp === 'vk' || gp === 'yandex';
    const isLocal = isLocalRun(location.protocol, location.hostname);
    const isTestHost = /\/games-dev\//.test(location.pathname);
    ym.platform = (isBuild && !isTestHost) ? gp : 'dev';
    ym.build = String(window.GAME_BUILD || 'unknown');
    if (!isBuild) ym.offWhy = 'не сборка ВК/Яндекса (GAME_PLATFORM=' + gp + ')';
    else if (!(ym.id > 0)) ym.offWhy = 'номер счётчика не задан';
    else if (isLocal) ym.offWhy = 'локальный запуск';
    ym.enabled = !ym.offWhy;
  } catch (e) { ym.enabled = false; ym.offWhy = 'ошибка окружения'; }

  // Только примитивы: объект игры в Метрику не уходит даже по ошибке.
  function cleanParams(p) {
    const out = {};
    if (!p || typeof p !== 'object') return out;
    for (const k of Object.keys(p)) {
      const v = p[k];
      if (typeof v === 'number') { if (isFinite(v)) out[k] = v; }
      else if (typeof v === 'string' || typeof v === 'boolean') out[k] = v;
    }
    return out;
  }
  // id миссии -> level; ветка цели: { '<level>': {…остальное} | 1 } или сами параметры.
  function goalBranch(p) {
    if (p.id != null && p.level == null) { p.level = p.id; delete p.id; }
    const hasLevel = p.level != null;
    const rest = {};
    let has = false;
    for (const k of Object.keys(p)) {
      if (hasLevel && k === 'level') continue;
      rest[k] = p[k]; has = true;
    }
    if (!hasLevel) return has ? rest : null;
    return { [String(p.level)]: has ? rest : 1 };
  }
  function ymCall(...args) {
    try { window.ym(...args); } catch (e) { /* аналитика не роняет игру */ }
  }
  function ymSend(goal, p) {
    try {
      if (navigator.onLine === false) return;
      const params = { platform: ym.platform, build: ym.build };
      const branch = goalBranch(p);
      if (branch) params[goal] = branch;
      ymCall(ym.id, 'reachGoal', goal, params);
    } catch (e) { /* молча */ }
  }
  function ymFlush() {
    const q = ym.queue;
    ym.queue = [];
    for (const [g, p] of q) ymSend(g, p);
  }
  function ymMount() {
    try {
      if (!ym.enabled || ym.state !== 'queue') return;
      clearTimeout(ym.timer);
      ym.state = 'loading';
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
      const s = document.createElement('script');
      s.async = true;
      s.src = TAG_URL;
      s.onload = () => { if (ym.state !== 'loading') return; ym.state = 'ready'; ymFlush(); };
      s.onerror = () => { ym.state = 'failed'; ym.queue = []; if (ym.debug) console.log('[analytics] tag.js не загрузился — Метрика выключена до перезагрузки'); };
      document.head.appendChild(s);
      const params = { platform: ym.platform, build: ym.build };
      ymCall(ym.id, 'init', {
        clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false,
        // Адрес хита без query/hash: в ВК там vk_user_id и подпись запуска.
        url: location.origin + location.pathname,
        referrer: '',
        params,
      });
    } catch (e) { ym.state = 'failed'; ym.queue = []; }
  }
  function metrika(name, params) {
    try {
      const rule = METRIKA_GOALS[name];
      if (!rule) return;
      const p = cleanParams(rule.map ? rule.map(params) : params);
      if (ym.debug) console.log('[analytics] ym ' + rule.goal + ' ' + JSON.stringify(p) + (ym.enabled ? '' : ' (не отправлено: ' + ym.offWhy + ')'));
      if (!ym.enabled || ym.state === 'failed') return;
      if (ym.state === 'ready') { ymSend(rule.goal, p); return; }
      if (ym.queue.length < QUEUE_MAX) ym.queue.push([rule.goal, p]);
    } catch (e) { /* аналитика не роняет игру */ }
  }
  if (ym.enabled) {
    try {
      if (document.readyState === 'complete') setTimeout(ymMount, 0);
      else window.addEventListener('load', () => setTimeout(ymMount, 0), { once: true });
      ym.timer = setTimeout(ymMount, MOUNT_FALLBACK_MS);
    } catch (e) { ym.enabled = false; }
  }

  // Возврат в другой календарный день: day — сколько календарных дней
  // прошло с первого запуска (1 = вернулся назавтра, как D1). Один раз за
  // день. Хранится отдельно от счётчиков; на CrazyGames localStorage нет.
  const DAYS_KEY = 'twinforts_days_v1';
  function dayNum(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
  function checkReturnDay() {
    if (onCrazyGames()) return;
    try {
      const today = dayNum(new Date());
      let rec = null;
      try { rec = JSON.parse(localStorage.getItem(DAYS_KEY) || 'null'); } catch (e) { rec = null; }
      if (!rec || typeof rec.first !== 'number') {
        localStorage.setItem(DAYS_KEY, JSON.stringify({ first: today, last: today }));
        return;
      }
      if (rec.last === today) return;
      rec.last = today;
      localStorage.setItem(DAYS_KEY, JSON.stringify(rec));
      track('return_day', { day: Math.max(1, today - rec.first) });
    } catch (e) { /* приватный режим — без return_day */ }
  }

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
    checkReturnDay();
  });
  let firstMoveDone = false;

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
    // Нажатие кнопки рекламы за вознаграждение (PLATFORM.showBonusAd) и её
    // итог (там же, после ответа SDK).
    adRewardClick() { track('ad_reward_click', { screen: lastScreen }); },
    adReward(ok) { track(ok ? 'ad_reward_ok' : 'ad_reward_fail', { screen: lastScreen }); },
    // Первое действие игрока в бою за сессию (покупка юнита, апгрейд, залп,
    // эпоха) — цель first_move, один раз за загрузку страницы.
    firstMove(kind, missionId) {
      if (firstMoveDone) return;
      firstMoveDone = true;
      track('first_move', { id: missionId, kind });
    },
    // Для автотеста: состояние канала Метрики.
    metrikaState() { return { enabled: ym.enabled, offWhy: ym.offWhy, state: ym.state, platform: ym.platform, queued: ym.queue.length, id: ym.id }; },
    // Счётчики для отладки: Analytics.stats() в консоли.
    stats() { return JSON.parse(JSON.stringify(store())); },
  };
})();
