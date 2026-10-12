/* ============================================================
   workshop_analytics.js — аналитика «Мастерской украшений» (релиз 1.0, задача M5/A5).
   Схема событий и места вызова — docs/WORKSHOP_ANALYTICS.md.

   Тонкая обёртка по образцу analytics.js (game3, ТЗ №25): игра зовёт
   WSAnalytics.event(имя, параметры) и о результате не знает. Вызов ничего
   не ждёт, никогда не бросает исключение и не меняет поведение игры.

   Что делает event():
   1. Пишет запись в журнал window.__wsEvents в том же формате, что прежний
      track() из workshop.js: { product:'jewel_workshop', event, t, ...параметры }.
      Журнал пишется всегда (в том числе на localhost и без счётчика):
      тесты и window.__wsMetrics() читают его. Для четырёх событий новой
      схемы журнал сохраняет прежние имена (LEGACY), чтобы они работали как раньше.
   2. Если Метрика включена — отправляет reachGoal(цель, { <цель>: параметры }).
      Параметры вложены под имя цели: иначе одноимённые ключи разных целей
      (level, moves) слиплись бы в «Параметрах визитов» (урок game3, 27.09).
      В Метрику уходят только события из схемы (GOAL_EVENTS); служебные
      (move, delivery, stamp, undo…) остаются в журнале.

   Метрика включена, только если одновременно:
     - есть номер счётчика (WS_CONFIG.metrikaId или init({counterId}));
     - страница не localhost / не file: / не локальная сеть.
   Без номера или на localhost — только журнал, сети нет. На стенде
   (путь содержит /games-dev/) счётчик работает, а визит помечен
   platform:'dev', чтобы бой не смешался с проверками.

   Параметры визита (init-параметры Метрики): platform (vk | web | dev),
   build, day (дней с установки), session (номер запуска). Личных данных
   нет: ID пользователя ВК и любые ключи, похожие на ID/имя, не
   отправляются.

   Адрес страницы (ревью 1.0, P0-2). ВК открывает игру по адресу
   index.html?vk_user_id=…&vk_ts=…&sign=… — это ID игрока и подпись запуска.
   Метрика сама берёт адрес страницы (просмотр) и шлёт его адресом-источником
   в каждой цели, поэтому перед init() адрес чистится:
     1. если в адресе (запрос или #) есть параметры запуска (vk_*, sign, sig,
        viewer_id, auth_key, access_token…), history.replaceState оставляет
        только путь страницы. Платформа (workshop_platform.js) свою строку
        запуска к этому моменту уже забрала: она читает её при загрузке
        скрипта, раньше любого init(). Остальным частям игры адрес не нужен
        (?level= читается до init() и только вне сборки vk);
     2. referrer с такими параметрами подменяется на адрес без запроса;
     3. init идёт с defer:true, просмотр — ручной hit с адресом и referrer
        без запроса и #;
     4. если адрес почистить не удалось (нет history, ошибка), Метрика в этом
        запуске выключается: только журнал. Утечка хуже потери визита.

   Скрипт Метрики грузится асинхронно из init(). До готовности тега цели
   копятся в очереди (не больше QUEUE_LIMIT, лишние отбрасываются) и
   уходят после загрузки. Не загрузился (адблок, нет сети) — очередь
   молча пропадает, игра идёт как обычно.
   ============================================================ */
(function () {
  'use strict';

  var PRODUCT_ID = 'jewel_workshop';
  var TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';
  var QUEUE_LIMIT = 50;
  var JOURNAL_LIMIT = 5000;     // как в track() после A3 (эпизод 60 уровней): старые записи вытесняются
  var MAX_PARAMS = 24;
  var T0 = Date.now();

  /* ---------- схема ---------- */

  // События схемы: в Метрику уходят цели с этими именами.
  var GOAL_EVENTS = [
    'session_start', 'ftue_step',
    'level_start', 'level_win', 'level_lose', 'level_quit', 'next_click', 'rescue', 'unwinnable',
    'choice_shown', 'choice_pick', 'case_open', 'piece_view', 'fav_set', 'chest', 'fav_ask', 'fav_result',
    'ad_offer', 'ad_click', 'ad_request', 'ad_result', 'ad_reward', 'ad_skip',
    'shop_open', 'noads_offer', 'buy_click', 'buy_result', 'grant',
    'coin_earn', 'coin_spend'
  ];

  // Прежние имена журнала: новое имя события -> имя записи в __wsEvents.
  // Тесты (ws_acceptance.py) и __wsMetrics() ищут win / lose / quit / next.
  var LEGACY = { level_win: 'win', level_lose: 'lose', level_quit: 'quit', next_click: 'next' };

  var REWARD_PLACES = ['win_x2', 'lose_moves', 'hint'];
  var AD_PLACES = REWARD_PLACES.concat(['next', 'banner']);
  var AD_OUTCOMES = ['shown', 'declined', 'no_ad', 'timeout', 'error', 'closed'];
  var AD_SKIP_REASONS = ['early', 'interval', 'near_reward', 'owner'];
  var MILESTONES = [1, 3, 5, 10, 15, 20, 30, 40, 50, 60];
  var RETURN_DAYS = [1, 3, 7];

  // Ключи, которые в Метрику не уходят никогда (личные данные).
  var PII_KEY = /(user|viewer|vk)_?id|^uid$|^id$|first_?name|last_?name|full_?name|user_?name|e_?mail|phone|login|nick|fio|photo|avatar|^sign$|token/i;

  // Исходы показа по местам: у баннера нет отказа и таймаута, «закрыл» бывает только у баннера.
  function outcomeAllowed(place, outcome) {
    if (AD_PLACES.indexOf(place) === -1 || AD_OUTCOMES.indexOf(outcome) === -1) return false;
    if (place === 'banner') return outcome !== 'declined' && outcome !== 'timeout';
    return outcome !== 'closed';
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // Плоские цели, производные от события (для составных целей-воронок Метрики:
  // шаги воронки не умеют фильтровать по параметрам, поэтому место, номер шага
  // или день зашиты в имя цели). Без параметров: только счётчик.
  function derivedGoals(name, p) {
    var out = [];
    p = p || {};
    if (name === 'ftue_step' && typeof p.step === 'number' && /^[a-z0-9_]{1,24}$/.test(String(p.name || ''))) {
      out.push('ftue_' + pad2(p.step) + '_' + p.name);
    } else if (name === 'level_win' && p.first && MILESTONES.indexOf(p.level) !== -1) {
      out.push('win_lvl_' + pad2(p.level));
    } else if (name === 'session_start') {
      if (p.session === 1) out.push('new_player');
      if (RETURN_DAYS.indexOf(p.day) !== -1) out.push('return_d' + p.day);
    } else if (name === 'ad_result' && outcomeAllowed(p.place, p.outcome)) {
      out.push('ad_' + p.outcome + '_' + p.place);
    } else if ((name === 'ad_offer' || name === 'ad_click' || name === 'ad_reward') && REWARD_PLACES.indexOf(p.place) !== -1) {
      out.push(name + '_' + p.place);
    } else if (name === 'ad_request' && (REWARD_PLACES.indexOf(p.place) !== -1 || p.place === 'next')) {
      out.push('ad_request_' + p.place);
    } else if (name === 'ad_skip' && AD_SKIP_REASONS.indexOf(p.reason) !== -1) {
      out.push('ad_skip_' + p.reason);
    }
    return out;
  }

  // Имя основной цели: возобновлённая партия — не новый старт уровня.
  function mainGoal(name, p) {
    if (name === 'level_start' && p && p.resumed) return 'level_resume';
    return name;
  }

  // Полный список целей Метрики, которые надо создать в интерфейсе (JS-событие).
  function goalList() {
    var set = {};
    var add = function (g) { set[g] = 1; };
    GOAL_EVENTS.forEach(add);
    add('level_resume');
    add('new_player');
    RETURN_DAYS.forEach(function (d) { add('return_d' + d); });
    MILESTONES.forEach(function (l) { add('win_lvl_' + pad2(l)); });
    // шаги FTUE: номера и имена зафиксированы схемой
    FTUE_STEPS.forEach(function (s) { add('ftue_' + pad2(s[0]) + '_' + s[1]); });
    REWARD_PLACES.forEach(function (pl) {
      ['ad_offer_', 'ad_click_', 'ad_request_', 'ad_reward_'].forEach(function (pre) { add(pre + pl); });
    });
    add('ad_request_next');
    AD_PLACES.forEach(function (pl) {
      AD_OUTCOMES.forEach(function (o) { if (outcomeAllowed(pl, o)) add('ad_' + o + '_' + pl); });
    });
    AD_SKIP_REASONS.forEach(function (r) { add('ad_skip_' + r); });
    return Object.keys(set);
  }

  var FTUE_STEPS = [[1, 'first_move'], [2, 'first_delivery'], [3, 'first_win'], [4, 'first_next'], [5, 'third_win'],
    [6, 'first_choice'], [7, 'first_case'], [8, 'first_fav']];   // B2: первый выбор оправы, первая шкатулка, первое любимое

  /* ---------- окружение ---------- */

  function loc() {
    try { return window.location || {}; } catch (e) { return {}; }
  }

  // Локальный запуск (автотесты, ручные прогоны, проверка с телефона по локальной сети) счётчик не засоряет.
  function isLocalRun() {
    try {
      var l = loc();
      var host = String(l.hostname || '');
      if (!host || l.protocol === 'file:') return true;
      if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]') return true;
      if (/\.localhost$/.test(host) || /\.local$/.test(host)) return true;
      if (/^(10\.|192\.168\.|169\.254\.)/.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
      return false;
    } catch (e) { return true; }
  }

  function isStand() {
    try { return String(loc().pathname || '').indexOf('/games-dev/') !== -1; } catch (e) { return false; }
  }

  // ?debug=1 читается до очистки адреса и запоминается.
  var debugFlag = null;
  function isDebug() {
    if (debugFlag !== null) return debugFlag;
    try { return /[?&]debug=1(&|$)/.test(String(loc().search || '')); } catch (e) { return false; }
  }

  // Параметры запуска ВК и подобные — личные данные и подпись игрока: в Метрику не уходят.
  var LAUNCH_PARAM = /(?:^|[?&#;])(?:vk_[A-Za-z0-9_]*|sign|sig|viewer_id|user_id|auth_key|access_token|api_id|api_settings|secret)=/i;

  function hasLaunchParams(text) {
    return LAUNCH_PARAM.test(String(text || ''));
  }

  function bareUrl(u) {
    return String(u || '').split(/[?#]/)[0];
  }

  // Адрес страницы без запроса и # (так его видит Метрика).
  function pageUrl() {
    var l = loc();
    var host = String(l.host || l.hostname || '');
    return String(l.protocol || 'https:') + '//' + host + String(l.pathname || '/');
  }

  function docReferrer() {
    try { return String((document && document.referrer) || ''); } catch (e) { return ''; }
  }

  // Убирает параметры запуска из адреса и referrer. true — в них больше нет
  // ничего личного (или и не было); false — почистить не удалось.
  function scrubLocation() {
    try {
      var l = loc();
      if (hasLaunchParams(l.search) || hasLaunchParams(l.hash)) {
        var h = window.history;
        if (h && typeof h.replaceState === 'function') h.replaceState(h.state === undefined ? null : h.state, '', String(l.pathname || '/'));
      }
      l = loc();
      if (hasLaunchParams(l.search) || hasLaunchParams(l.hash) || hasLaunchParams(l.href)) return false;
      var ref = docReferrer();
      if (hasLaunchParams(ref)) {
        var clean = bareUrl(ref);
        try { Object.defineProperty(document, 'referrer', { configurable: true, get: function () { return clean; } }); } catch (e) { /* ниже проверка */ }
        if (hasLaunchParams(docReferrer())) return false;
      }
      return true;
    } catch (e) { return false; }
  }

  function log(kind, name, params) {
    try { if (isDebug()) console.log('[ws-analytics]', kind, name, params || {}); } catch (e) { /* ок */ }
  }

  // Номер локального дня (целое): дни с 1970-01-01 по часовому поясу игрока.
  function dayNumber(ms) {
    var d = new Date(ms === undefined ? Date.now() : ms);
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  }

  function validCounter(v) {
    var n = typeof v === 'string' && /^\d{1,12}$/.test(v) ? Number(v) : v;
    return typeof n === 'number' && isFinite(n) && n > 0 && Math.floor(n) === n ? n : 0;
  }

  /* ---------- состояние ---------- */

  var inited = false;
  var enabled = false;          // отправка в Метрику разрешена (после init)
  var counterId = 0;
  var tag = 'idle';             // idle -> loading -> ready | failed
  var queue = [];               // [{ goal, params|null }]
  var dropped = 0;
  var sessionStarted = false;
  var visit = { platform: 'web', build: 'unknown', day: null, session: null };

  /* ---------- журнал ---------- */

  function journal(name, data) {
    var arr = window.__wsEvents;
    if (!Array.isArray(arr)) arr = window.__wsEvents = [];
    var e = {};
    // порядок и приоритет полей — как в прежнем track(): параметры перекрывают служебные
    e.product = PRODUCT_ID; e.event = LEGACY[name] || name; e.t = Date.now();
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(function (k) { e[k] = data[k]; });
    }
    arr.push(e);
    if (arr.length > JOURNAL_LIMIT) arr.shift();
  }

  /* ---------- отправка ---------- */

  // В Метрику идут только скаляры и не больше MAX_PARAMS ключей; личные ключи отбрасываются.
  function cleanParams(p) {
    if (!p || typeof p !== 'object') return null;
    var out = {};
    var n = 0;
    Object.keys(p).forEach(function (k) {
      if (n >= MAX_PARAMS) return;
      if (!/^[A-Za-z0-9_]{1,40}$/.test(k) || PII_KEY.test(k)) return;
      var v = p[k];
      if (typeof v === 'number') { if (!isFinite(v)) return; v = Math.round(v * 1000) / 1000; }
      else if (typeof v === 'boolean') v = v ? 1 : 0;
      else if (typeof v === 'string') v = v.slice(0, 64);
      else return;
      out[k] = v; n++;
    });
    return n ? out : null;
  }

  function ym() {
    try { window.ym.apply(null, arguments); } catch (e) { /* аналитика не роняет игру */ }
  }

  function send(item) {
    if (item.params) {
      var wrapped = {};
      wrapped[item.goal] = item.params;
      ym(counterId, 'reachGoal', item.goal, wrapped);
    } else ym(counterId, 'reachGoal', item.goal);
  }

  function flush() {
    var pending = queue;
    queue = [];
    pending.forEach(function (it) { try { send(it); } catch (e) { /* ок */ } });
  }

  function dispatch(item) {
    if (inited && !enabled) return;                 // выключено: сети нет
    if (tag === 'failed') return;
    if (tag === 'ready') { send(item); return; }
    if (queue.length < QUEUE_LIMIT) queue.push(item); else dropped++;
  }

  /* ---------- публичное ---------- */

  function init(opts) {
    try {
      if (inited) return;
      inited = true;
      var cfg = {};
      var wc = window.WS_CONFIG;
      if (wc && typeof wc === 'object') {
        cfg.counterId = wc.metrikaId; cfg.target = wc.target; cfg.build = wc.build;
      }
      if (opts && typeof opts === 'object') {
        Object.keys(opts).forEach(function (k) { if (opts[k] !== undefined && opts[k] !== null) cfg[k] = opts[k]; });
      }
      counterId = validCounter(cfg.counterId);

      var target = cfg.target === 'vk' ? 'vk' : 'web';
      visit.platform = isStand() ? 'dev' : target;
      visit.build = String(cfg.build || 'unknown').slice(0, 64);

      // день с установки: install — номер дня (dayNumber) или метка времени в мс
      var inst = Number(cfg.install);
      if (isFinite(inst) && inst > 0) {
        if (inst > 1e8) inst = dayNumber(inst);       // метка времени -> номер дня
        var days = dayNumber() - inst;
        visit.day = days < 0 ? 0 : Math.min(days, 9999);
      }
      var sess = Number(cfg.sessions);
      if (isFinite(sess) && sess >= 1) visit.session = Math.floor(sess);

      debugFlag = isDebug();
      enabled = counterId > 0 && !isLocalRun();
      var why = counterId ? 'локальный запуск: в Метрику не шлём' : 'нет номера счётчика: только журнал';
      // Адрес чистится только когда Метрика правда включена: иначе он никуда не уходит.
      if (enabled && !scrubLocation()) {
        enabled = false;
        why = 'адрес с параметрами запуска не очищен: в Метрику не шлём';
      }
      if (!enabled) {
        queue = [];
        log('off', why, visit);
        return;
      }
      tag = 'loading';
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
      var s = document.createElement('script');
      s.async = true;
      s.src = TAG_URL;
      s.onload = function () {
        if (tag !== 'loading') return;
        tag = 'ready';
        flush();
      };
      s.onerror = function () {
        tag = 'failed';
        queue = [];
        log('fail', 'скрипт Метрики не загрузился: до перезагрузки только журнал');
      };
      document.head.appendChild(s);
      var vp = {};
      Object.keys(visit).forEach(function (k) { if (visit[k] !== null) vp[k] = visit[k]; });
      // defer: просмотр не уходит сам с адресом из location — его шлёт hit ниже
      // с адресом и referrer без запроса и # (параметры запуска туда не попадут).
      ym(counterId, 'init', {
        defer: true, clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false, params: vp
      });
      var ref = bareUrl(docReferrer());
      ym(counterId, 'hit', pageUrl(), ref ? { referer: ref } : {});
      log('start', 'визит', vp);
    } catch (e) {
      tag = 'failed';
      queue = [];
    }
  }

  function event(name, params) {
    try {
      name = String(name);
      var p = params && typeof params === 'object' ? Object.assign({}, params) : {};

      if (name === 'session_start') {
        if (sessionStarted) return;                   // один раз за запуск
        sessionStarted = true;
        if (p.day === undefined && visit.day !== null) p.day = visit.day;
        if (p.session === undefined && visit.session !== null) p.session = visit.session;
      }
      if (name === 'ftue_step' && p.sec === undefined) p.sec = Math.round((Date.now() - T0) / 1000);

      journal(name, p);
      log(enabled ? 'event' : 'event (журнал)', name, p);

      if (GOAL_EVENTS.indexOf(name) === -1) return;   // служебное событие: только журнал
      if (inited && !enabled) return;                 // не шлём и очередь не копим
      dispatch({ goal: mainGoal(name, p), params: cleanParams(p) });
      derivedGoals(name, p).forEach(function (g) { dispatch({ goal: g, params: null }); });
    } catch (e) { /* аналитика не роняет игру */ }
  }

  function state() {
    return {
      enabled: enabled, tag: tag, counterId: counterId, queued: queue.length, dropped: dropped,
      visit: { platform: visit.platform, build: visit.build, day: visit.day, session: visit.session },
      sessionStarted: sessionStarted
    };
  }

  window.WSAnalytics = {
    init: init, event: event, state: state, goalList: goalList, dayNumber: dayNumber,
    GOAL_EVENTS: GOAL_EVENTS.slice(), FTUE_STEPS: FTUE_STEPS.map(function (s) { return s.slice(); })
  };
})();
