/* ============================================================
   workshop_analytics.js — аналитика «Ювелир Ленд» (релиз 1.0, задача M5/A5).
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
      В Метрику уходят только 18 целей (GOALS: общий набор студии + 8 своих;
      goalsFor() переводит событие игры в цель), остальные события — только
      журнал. Номер счётчика игры (113661736) — в workshop_config.json.

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

  /* В Метрику уходит короткий набор целей (решение 17.10.2026, подключение счётчика 113661736):
     общий набор студии (10 целей, имена одинаковы во всех играх) и 8 своих ключевых моментов игры.
     Остальные события (ftue_step, ad_offer/ad_request/ad_reward/ad_skip, монеты, шкатулка коллекции,
     избранное, grant, rescue, unwinnable, move, delivery…) остаются только в журнале __wsEvents:
     ни целями, ни параметрами визита в Метрику они не идут — подробности (место рекламы, исход, уровень)
     уже лежат в параметрах ключевых целей. */
  var STUDIO_GOALS = [
    'game_loaded', 'first_move', 'level_start', 'level_win', 'level_restart', 'level_quit',
    'rewarded_click', 'rewarded_result', 'interstitial_shown', 'return_day'
  ];
  var OWN_GOALS = [
    'level_lose', 'next_click', 'choice_pick', 'case_open', 'shop_open', 'noads_offer', 'buy_click', 'buy_result'
  ];
  var GOALS = STUDIO_GOALS.concat(OWN_GOALS);

  // Событие игры -> цель Метрики один к одному (параметры события уходят под именем цели).
  var DIRECT = {
    session_start: 'game_loaded', level_start: 'level_start', level_win: 'level_win', restart: 'level_restart',
    level_quit: 'level_quit', level_lose: 'level_lose', next_click: 'next_click', choice_pick: 'choice_pick',
    case_open: 'case_open', shop_open: 'shop_open', noads_offer: 'noads_offer', buy_click: 'buy_click',
    buy_result: 'buy_result'
  };

  // Прежние имена журнала: новое имя события -> имя записи в __wsEvents.
  // Тесты (ws_acceptance.py) и __wsMetrics() ищут win / lose / quit / next.
  var LEGACY = { level_win: 'win', level_lose: 'lose', level_quit: 'quit', next_click: 'next' };

  var REWARD_PLACES = ['win_x2', 'lose_moves', 'hint'];

  // Ключи, которые в Метрику не уходят никогда (личные данные).
  var PII_KEY = /(user|viewer|vk)_?id|^uid$|^id$|first_?name|last_?name|full_?name|user_?name|e_?mail|phone|login|nick|fio|photo|avatar|^sign$|token/i;

  function pick(p, keys) {
    var out = {};
    keys.forEach(function (k) { if (p[k] !== undefined) out[k] = p[k]; });
    return out;
  }

  // Цели Метрики для события игры: [{ goal, params }] (пусто — событие только в журнале).
  function goalsFor(name, p) {
    var out = [];
    if (DIRECT[name]) out.push({ goal: DIRECT[name], params: p });
    if (name === 'session_start' && retDay !== null) out.push({ goal: 'return_day', params: { day: retDay } });
    if (name === 'move' && !firstMoveSent) {
      firstMoveSent = true;                         // первый ход игрока в этом запуске
      out.push({ goal: 'first_move', params: pick(p, ['level']) });
    }
    if (name === 'ad_click' && REWARD_PLACES.indexOf(p.place) !== -1) {
      out.push({ goal: 'rewarded_click', params: pick(p, ['place', 'format', 'level']) });
    }
    if (name === 'ad_result') {
      if (REWARD_PLACES.indexOf(p.place) !== -1) {
        var r = pick(p, ['place', 'outcome', 'ms', 'late', 'level']);
        r.ok = p.outcome === 'shown';
        out.push({ goal: 'rewarded_result', params: r });
      } else if (p.place === 'next' && p.outcome === 'shown') {
        out.push({ goal: 'interstitial_shown', params: pick(p, ['ms', 'level']) });
      }
    }
    return out;
  }

  // Список целей Метрики, которые надо завести в счётчике (JS-событие).
  function goalList() { return GOALS.slice(); }

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
  var firstMoveSent = false;
  var retDay = null;           // return_day: день с установки, если запуск в другой календарный день, чем прошлый
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
      // возврат: день с установки не нулевой и прошлый запуск был в другой календарный день
      // (lastDay — номер дня прошлого запуска из сохранения; 0 или нет — игрок до этой версии)
      var last = Number(cfg.lastDay);
      if (visit.day !== null && visit.day >= 1 && !(isFinite(last) && last > 0 && last === dayNumber())) retDay = visit.day;

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

      if (inited && !enabled) return;                 // не шлём и очередь не копим
      goalsFor(name, p).forEach(function (g) { dispatch({ goal: g.goal, params: cleanParams(g.params) }); });
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
    STUDIO_GOALS: STUDIO_GOALS.slice(), OWN_GOALS: OWN_GOALS.slice(), FTUE_STEPS: FTUE_STEPS.map(function (s) { return s.slice(); })
  };
})();
