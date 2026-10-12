/*
 * workshop_platform.js — платформенный слой «Мастерской украшений»: window.WSPlatform.
 *
 * Один файл без зависимостей. Реализация выбирается по window.WS_CONFIG
 * (его вставляет build_workshop.py перед скриптами игры):
 *   platform 'vk'   — VK Bridge (сборка --target vk, пакет dist/workshop-vk/);
 *   platform 'web'  — без площадки: рекламы и покупок нет, сейв в браузере
 *                     (нет WS_CONFIG — например, workshop.html из исходников);
 *   подделка площадки для стенда и тестов — сборка --target web
 *                     (docs/WORKSHOP_PLATFORM.md, раздел 4).
 * Код каждой площадки лежит в своём блоке между маркерами-комментариями;
 * сборка оставляет только блок своей цели (build_workshop.py: STRIP,
 * strip_block) — в пакете ВК нет ни строчки подделки, в пакете стенда — ВК.
 * При загрузке модуль ничего не пишет и никуда не ходит: всё начинается с init().
 *
 * Интерфейс (подробно — docs/WORKSHOP_PLATFORM.md):
 *   kind                          'vk' | 'web' | подделка стенда
 *   init([{saveKey}]) -> Promise  никогда не отклоняется, не дольше timeouts.initMs (8 с);
 *                                 даёт {kind, ok, cloud}
 *   user() -> {id, appId} | null
 *   loadSave() -> Promise<object|null>   сейв, выбранный при init (свежая ревизия)
 *   writeSave(obj) -> boolean            сразу в копию устройства, в облако — пачкой
 *   flush() -> Promise<boolean>          дописать облако сейчас (true — всё записано)
 *   onPause(cb(reason)) / onResume(cb(reason))   reason: view | doc | ad | buy
 *   banner: { show(), hide(), height() -> px, onChange(cb(px)) }
 *   showInterstitial(placement) -> Promise<{shown, reason}>
 *   showRewarded(placement) -> Promise<{rewarded, reason, id}>; onLateReward(cb(placement, id))
 *   catalog() -> Promise<[{id, votes, days, royal, title}]>   ([] — покупок нет)
 *   buy(id) -> Promise<{status: 'paid'|'cancel'|'error', reason}>  НЕ выдача!
 *   purchases(after) -> Promise<{purchases: [...], more}>      журнал сервера
 *   waitPurchases(after[, sec]) -> Promise<{purchases, more}>  опрос после окна покупки
 *   confirm(ids) -> Promise<boolean>                           только статистика
 *   entitlements() -> Promise<{noadsUntil, royal, now} | null>
 *   addToFavorites() -> Promise<boolean>;  supports(name) -> boolean
 *   onEvent(cb(e))  — воронка: ad_request, ad_result, ad_late_reward, buy_request, buy_result, banner
 *   adReady(format) — предзагрузка ролика: true | false | null (не проверяли)
 *   state()         — снимок состояния для отладки
 * Причины reason: ok, off (реклама выключена/нет площадки), busy, interval,
 * after_rewarded, no_ads, closed, timeout, error, unavailable, cancel.
 */
(function (root) {
  'use strict';

  var VERSION = 1;
  var DEFAULT_SAVE_KEY = 'jewel_workshop.v2';
  var MAX_PAGES = 10;                 // страниц журнала покупок за один purchases()
  var CONFIRM_CHUNK = 100;            // строк в одном подтверждении: сервер принимает не больше 100 (CONFIRM_MAX)
  var POLL_STEPS = [0, 2000, 3000, 5000, 8000, 12000];   // паузы опроса после окна покупки (сумма 30 с)

  // Значения по умолчанию; workshop_config.json (через WS_CONFIG) их перекрывает.
  var DEFAULTS = {
    target: '',
    platform: '',
    build: 'dev',
    payServer: '',
    vkAppId: '',
    metrikaId: '',
    timeouts: { bridgeMs: 8000, initMs: 8000, dialogMs: 60000 },
    ads: {
      preload: true,
      banner: { enabled: true, phoneOnly: true, portraitOnly: true, location: 'bottom', layout: '',
                heightType: '', fallbackHeight: 60, maxFailures: 3 },
      interstitial: { enabled: true, minLevels: 6, intervalSec: 180, afterRewardedSec: 180, waitSec: 30 },
      rewarded: { enabled: true, waitSec: 180 }   // ролик ВК 30 с + загрузка; сторож с запасом (ревью 1.0, P1-1)
    },
    pay: { pollSec: 30, orderWaitSec: 600 }
  };

  function noop() {}
  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function num(v, d) { var n = Number(v); return isFinite(n) ? n : d; }
  function merge(a, b) {
    var out = {};
    Object.keys(a || {}).forEach(function (k) { out[k] = isObj(a[k]) ? merge(a[k], {}) : a[k]; });
    Object.keys(b || {}).forEach(function (k) {
      if (b[k] === undefined) return;
      out[k] = isObj(b[k]) && isObj(out[k]) ? merge(out[k], b[k]) : b[k];
    });
    return out;
  }
  function parseQuery(s) {
    var out = {};
    String(s || '').replace(/^\?/, '').split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('=');
      var k = i < 0 ? pair : pair.slice(0, i);
      var v = i < 0 ? '' : pair.slice(i + 1);
      try { k = decodeURIComponent(k.replace(/\+/g, ' ')); v = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { return; }
      if (!(k in out)) out[k] = v;
    });
    return out;
  }
  function errText(e) {
    if (!e) return '';
    var d = e.error_data || {};
    var r = d.error_reason;
    if (isObj(r)) r = r.error_msg || r.error_reason || JSON.stringify(r);
    return String(r || d.error_msg || e.message || e.error_type || e);
  }
  function errCode(e) { return Number(e && e.error_data && e.error_data.error_code); }
  // Отказ рекламы -> причина для игры. Код 20 / «No ads» — роликов нет.
  function adReason(e) {
    if (!e) return 'error';
    if (e.error_type === 'timeout') return 'timeout';
    if (e.error_type === 'no_bridge') return 'off';
    var code = errCode(e);
    var why = errText(e);
    if (code === 20 || /no ad/i.test(why)) return 'no_ads';
    if (code === 4 || /denied|cancel|closed/i.test(why)) return 'closed';
    return 'error';
  }
  function payReason(e) {
    if (!e) return 'error';
    if (e.error_type === 'timeout') return 'timeout';
    if (e.error_type === 'http') return 'http_' + e.status;
    if (e.error_type) return String(e.error_type);
    return 'error';
  }
  function votesWord(n) {
    var m10 = n % 10, m100 = n % 100;
    var w = m10 === 1 && m100 !== 11 ? 'голос' : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'голоса' : 'голосов');
    return n + ' ' + w;
  }
  function normProduct(p) {
    if (!isObj(p) || !p.id) return null;
    return { id: String(p.id), votes: Math.max(0, Math.floor(num(p.votes, 0))), days: Math.max(0, Math.floor(num(p.days, 0))),
             royal: !!p.royal, title: String(p.title || p.title_ru || p.id) };
  }
  function normRow(r) {
    if (!isObj(r) || !isFinite(Number(r.id))) return null;
    return { id: Number(r.id), order: String(r.order == null ? '' : r.order), item: String(r.item || ''),
             days: Math.max(0, Math.floor(num(r.days, 0))), royal: !!r.royal, test: !!r.test,
             claimed: !!r.claimed, refund: !!r.refund, ts: num(r.ts, 0) };
  }
  function normEnt(o) {
    if (!isObj(o)) return null;
    var until = num(o.noads_until != null ? o.noads_until : o.noadsUntil, NaN);
    var at = num(o.now, NaN);
    if (!isFinite(until) || !isFinite(at)) return null;
    return { noadsUntil: Math.max(0, until), royal: !!o.royal, now: at };
  }

  // Окружение по умолчанию — браузер. Тесты подставляют своё через WSPlatform._create(env):
  // cfg, search, bridge, storage, fetch, win, doc — функции-получатели (не функция —
  // значение как есть); setTimeout, clearTimeout, now — сами функции. Блоки
  // площадок читают из env и свои поля (мост ВК, окна подделки); мост по
  // умолчанию берёт из window сама реализация ВК, здесь его нет.
  var GETTERS = ['cfg', 'search', 'bridge', 'storage', 'fetch', 'win', 'doc'];
  function browserEnv() {
    return {
      cfg: function () { return root.WS_CONFIG; },
      search: function () { try { return String((root.location && root.location.search) || ''); } catch (e) { return ''; } },
      storage: function () { try { return root.localStorage || null; } catch (e) { return null; } },
      fetch: function () { return typeof root.fetch === 'function' ? root.fetch.bind(root) : null; },
      setTimeout: function (f, ms) { return root.setTimeout(f, ms); },
      clearTimeout: function (t) { root.clearTimeout(t); },
      now: function () { return Date.now(); },
      win: function () { return root; },
      doc: function () { return root.document || null; }
    };
  }
  function envOf(e) {
    e = e || {};
    var out = browserEnv();
    Object.keys(e).forEach(function (k) { if (e[k] !== undefined) out[k] = e[k]; });
    GETTERS.forEach(function (k) {
      if (!(k in out)) return;
      var v = out[k];
      if (typeof v !== 'function') out[k] = function () { return v; };
    });
    return out;
  }

  /* Сейв без облака (web и подделка стенда): объект целиком под ключом сейва — тот же
     формат, что у прежнего Store в workshop.js, старый сейв читается. */
  function RawSave(core, key) {
    return {
      load: function () {
        var t = core.lsGet(key);
        if (!t) return null;
        try {
          var o = JSON.parse(t);
          if (isObj(o) && isObj(o.d) && 'r' in o && 't' in o) o = o.d;   // конверт копии ВК
          return isObj(o) ? o : null;
        } catch (e) { core.warn('сейв не читается: ' + e); return null; }
      },
      write: function (obj) { return core.lsSet(key, JSON.stringify(obj)); },
      flush: function () { return Promise.resolve(true); },
      setHidden: noop,
      finalize: noop,
      cloud: function () { return false; },
      info: function () { return { key: key }; }
    };
  }

  function createPlatform(envIn) {
    var env = envOf(envIn);
    var cfg = merge(DEFAULTS, isObj(env.cfg()) ? env.cfg() : {});
    var query = parseQuery(env.search());
    var listeners = { pause: [], resume: [], late: [], banner: [], event: [] };
    var pauseSrc = {};
    var initPromise = null, initDone = false, initClosed = false, initInfo = null;
    var queuedSave = null;
    var firstAction = false;
    var bannerH = 0;
    var lastInterstitialAt = 0, lastRewardedAt = 0;
    var rewardedReq = null, interstitialBusy = false, rwSeq = 0;
    var rewardedLate = null;   // запрос, отпущенный сторожем, а ответ площадки ещё не пришёл (ролик может идти)
    var buying = null;

    function warn(msg) { try { if (root.console) root.console.warn('[ws-platform] ' + msg); } catch (e) { /* нет консоли */ } }
    function now() { return env.now(); }
    function later(fn, ms) { return env.setTimeout(fn, Math.max(0, ms || 0)); }
    function cancel(t) { if (t) env.clearTimeout(t); }
    function delay(ms) { return new Promise(function (r) { later(r, ms); }); }
    function on(name, cb) {
      if (typeof cb !== 'function') return noop;
      listeners[name].push(cb);
      return function off() { var i = listeners[name].indexOf(cb); if (i >= 0) listeners[name].splice(i, 1); };
    }
    function emit(name, arg, arg2) {
      listeners[name].slice().forEach(function (cb) { try { cb(arg, arg2); } catch (e) { warn(name + ': ' + e); } });
    }
    function event(e) { emit('event', e); }
    // Обёртка с таймаутом: промис не висит дольше ms. Ответ, пришедший после
    // срока, не теряется — уходит в onLate(data, err) ровно один раз.
    function withTimeout(p, ms, onLate) {
      return new Promise(function (resolve, reject) {
        var done = false;
        var t = later(function () { if (done) return; done = true; reject({ error_type: 'timeout', ms: ms }); }, ms);
        Promise.resolve(p).then(function (d) {
          if (done) { if (onLate) onLate(d, null); return; }
          done = true; cancel(t); resolve(d);
        }, function (e) {
          if (done) { if (onLate) onLate(null, e); return; }
          done = true; cancel(t); reject(e);
        });
      });
    }
    function lsGet(k) { try { var s = env.storage(); return s ? s.getItem(k) : null; } catch (e) { return null; } }
    function lsSet(k, v) { try { var s = env.storage(); if (!s) return false; s.setItem(k, v); return true; } catch (e) { warn('localStorage: ' + e); return false; } }
    function lsDel(k) { try { var s = env.storage(); if (s) s.removeItem(k); } catch (e) { /* ок */ } }

    function anyPaused() { for (var k in pauseSrc) if (pauseSrc[k]) return true; return false; }
    function hiddenNow() { return !!(pauseSrc.view || pauseSrc.doc); }
    // Пауза из нескольких источников: свернули мини-приложение (view), вкладка
    // скрыта (doc), полноэкранная реклама (ad), окно покупки (buy). Игре — одна
    // пауза и одно продолжение; при сворачивании сейв дописывается сразу.
    function setPaused(src, onOff) {
      var was = anyPaused(), wasHidden = hiddenNow();
      pauseSrc[src] = !!onOff;
      var is = anyPaused(), isHidden = hiddenNow();
      if (impl.store && wasHidden !== isHidden) impl.store.setHidden(isHidden);
      if (!was && is) emit('pause', src);
      if (was && !is) emit('resume', src);
    }
    function bannerHeight(h) {
      h = Math.max(0, Math.round(num(h, 0)));
      if (h === bannerH) return;
      bannerH = h;
      try {
        var d = env.doc();
        if (d && d.documentElement && d.documentElement.style) d.documentElement.style.setProperty('--ws-banner-h', h + 'px');
      } catch (e) { /* ок */ }
      emit('banner', h);
      event({ type: 'banner', height: h });
    }
    function fullscreen(src) {
      setPaused(src, true);
      if (!impl.banner) return Promise.resolve();
      return Promise.resolve(impl.banner.suspend()).then(noop, noop);
    }
    function endFullscreen(src) {
      setPaused(src, false);
      if (impl.banner) impl.banner.resume();
      if (impl.afterFullscreen) impl.afterFullscreen();
    }

    var core = {
      env: env, cfg: cfg, query: query, saveKey: DEFAULT_SAVE_KEY,
      now: now, later: later, cancel: cancel, delay: delay, withTimeout: withTimeout, warn: warn,
      lsGet: lsGet, lsSet: lsSet, lsDel: lsDel, event: event, setPaused: setPaused,
      bannerHeight: bannerHeight, fullscreen: fullscreen, endFullscreen: endFullscreen,
      firstAction: function () { return firstAction; },
      initClosed: function () { return initClosed; },
      initDone: function () { return initDone; }
    };

    function pickKind() {
      var k = String(cfg.platform || (cfg.target === 'vk' ? 'vk' : 'web'));
      /* MOCK-ONLY */
      if (query.platform === 'web' || query.platform === 'mock') k = query.platform;   // стенд: ?platform=web
      /* /MOCK-ONLY */
      return KINDS.hasOwnProperty(k) ? k : 'web';   // вырезанная сборкой реализация -> web
    }
    var kind = pickKind();
    var impl = KINDS[kind](core);

    function armLifecycle() {
      var d = env.doc(), w = env.win();
      try {
        if (d && d.addEventListener) {
          d.addEventListener('visibilitychange', function () {
            setPaused('doc', d.visibilityState === 'hidden' || d.hidden === true);
          });
          var first = function () {
            if (firstAction) return;
            firstAction = true;
            if (impl.banner) impl.banner.sync();
          };
          d.addEventListener('pointerdown', first, true);
          d.addEventListener('touchstart', first, true);
        }
        if (w && w.addEventListener) {
          w.addEventListener('pagehide', function () { setPaused('doc', true); });
          w.addEventListener('pageshow', function () { setPaused('doc', !!(d && (d.visibilityState === 'hidden' || d.hidden === true))); });
          var rotate = function () { if (impl.banner) impl.banner.sync(); };
          w.addEventListener('resize', rotate);
          w.addEventListener('orientationchange', rotate);
        }
      } catch (e) { warn('подписки: ' + e); }
    }

    function init(opts) {
      if (initPromise) return initPromise;
      if (isObj(opts) && typeof opts.saveKey === 'string' && opts.saveKey) core.saveKey = opts.saveKey;
      armLifecycle();
      initPromise = new Promise(function (resolve) {
        var finished = false;
        function finish() {
          if (finished) return;
          finished = true;
          initClosed = true;
          if (!impl.store) impl.store = RawSave(core, core.saveKey);
          try { impl.store.finalize(); } catch (e) { warn('сейв: ' + e); }
          initDone = true;
          initInfo = { kind: kind, ok: impl.ok ? !!impl.ok() : true, cloud: !!impl.store.cloud() };
          if (queuedSave) { var o = queuedSave; queuedSave = null; impl.store.write(o); }
          if (impl.banner) impl.banner.sync();
          if (impl.afterInit) { try { impl.afterInit(); } catch (e) { warn('после init: ' + e); } }
          resolve(initInfo);
        }
        var t = later(function () { warn('init: вышел срок ' + cfg.timeouts.initMs + ' мс, идём без площадки'); finish(); },
                      num(cfg.timeouts.initMs, 8000));
        var p;
        try { p = impl.init(); } catch (e) { warn('init: ' + e); p = null; }
        Promise.resolve(p).then(noop, function (e) { warn('init: ' + errText(e)); }).then(function () { cancel(t); finish(); });
      });
      return initPromise;
    }

    function runInterstitial(placement) {
      var ic = cfg.ads.interstitial;
      if (interstitialBusy || rewardedReq || rewardedLate) return Promise.resolve({ shown: false, reason: 'busy' });
      if (!ic.enabled || !impl.requestInterstitial || !impl.supports('interstitial')) return Promise.resolve({ shown: false, reason: 'off' });
      var t = now();
      if (lastInterstitialAt && t - lastInterstitialAt < num(ic.intervalSec, 180) * 1000) return Promise.resolve({ shown: false, reason: 'interval' });
      if (lastRewardedAt && t - lastRewardedAt < num(ic.afterRewardedSec, 180) * 1000) return Promise.resolve({ shown: false, reason: 'after_rewarded' });
      interstitialBusy = true;
      event({ type: 'ad_request', format: 'interstitial', placement: placement });
      return fullscreen('ad').then(function () {
        return withTimeout(impl.requestInterstitial(placement), num(ic.waitSec, 30) * 1000);
      }).then(function (d) {
        if (d && d.result === true) { lastInterstitialAt = now(); return { shown: true, reason: 'ok' }; }
        return { shown: false, reason: 'no_ads' };
      }, function (e) {
        return { shown: false, reason: adReason(e) };
      }).then(function (res) {
        interstitialBusy = false;
        endFullscreen('ad');
        event({ type: 'ad_result', format: 'interstitial', placement: placement, ok: res.shown, reason: res.reason, ms: now() - t });
        return res;
      });
    }

    // Видео за награду со сторожем: игра ждёт не дольше rewarded.waitSec (180 с);
    // поздний result:true того же запроса засчитывается ровно один раз через
    // onLateReward(placement, id), id — тот же, что в ответе. Повторный клик по
    // тому же месту — тот же промис. После сторожа, пока площадка не ответила
    // (ролик может ещё идти, не дольше rewarded.lateSec, по умолчанию = waitSec),
    // пауза и спрятанный баннер держатся, а новые ролики отвечают busy — второй
    // запрос в ВК не уходит (ревью 1.0, P1-1).
    function runRewarded(placement) {
      var rc = cfg.ads.rewarded;
      if (rewardedReq) return rewardedReq.placement === placement ? rewardedReq.promise : Promise.resolve({ rewarded: false, reason: 'busy' });
      if (interstitialBusy || rewardedLate) return Promise.resolve({ rewarded: false, reason: 'busy' });
      if (!rc.enabled || !impl.requestRewarded || !impl.supports('rewarded')) return Promise.resolve({ rewarded: false, reason: 'off' });
      var id = ++rwSeq;
      var t = now();
      var lateDone = false, settled = false, holding = false, lateT = null;
      var waitMs = num(rc.waitSec, 180) * 1000;
      var req = { placement: placement, id: id };
      function release() {                       // ответ после сторожа пришёл или вышел срок ожидания
        if (!holding) return;
        holding = false;
        cancel(lateT);
        if (rewardedLate === req) rewardedLate = null;
        endFullscreen('ad');
      }
      event({ type: 'ad_request', format: 'rewarded', placement: placement });
      req.promise = fullscreen('ad').then(function () {
        return withTimeout(impl.requestRewarded(placement), waitMs, function (d) {
          settled = true;
          if (!lateDone && d && d.result === true) {
            lateDone = true;
            lastRewardedAt = now();
            event({ type: 'ad_late_reward', format: 'rewarded', placement: placement, ms: now() - t });
            emit('late', placement, id);
          }
          release();
        });
      }).then(function (d) {
        settled = true;
        if (d && d.result === true) { lastRewardedAt = now(); return { rewarded: true, reason: 'ok' }; }
        return { rewarded: false, reason: 'closed' };
      }, function (e) {
        var reason = adReason(e);
        if (reason === 'timeout' && !settled) {
          holding = true;
          rewardedLate = req;
          lateT = later(release, num(rc.lateSec, num(rc.waitSec, 180)) * 1000);
        } else settled = true;
        return { rewarded: false, reason: reason };
      }).then(function (res) {
        if (rewardedReq === req) rewardedReq = null;
        if (!holding) endFullscreen('ad');
        event({ type: 'ad_result', format: 'rewarded', placement: placement, ok: res.rewarded, reason: res.reason, ms: now() - t });
        res.id = id;
        return res;
      });
      rewardedReq = req;
      return req.promise;
    }

    function purchases(after) {
      return init().then(function () {
        if (!impl.purchasesPage || !impl.supports('payments')) return { purchases: [], more: false };
        var all = [];
        var cursor = after == null || after === '' ? 0 : after;
        var pages = 0;
        function page() {
          return impl.purchasesPage(cursor).then(function (res) {
            var rows = (res && Array.isArray(res.purchases) ? res.purchases : []).map(normRow).filter(Boolean);
            all = all.concat(rows);
            if (rows.length) cursor = rows[rows.length - 1].id;
            pages++;
            if (res && res.more && rows.length && pages < MAX_PAGES) return page();
            return { purchases: all, more: !!(res && res.more) };
          });
        }
        return page().then(null, function (e) {
          return { purchases: all, more: all.length > 0, error: payReason(e) };
        });
      });
    }

    var api = {
      version: VERSION,
      kind: kind,
      config: cfg,
      init: init,
      user: function () { try { return impl.user ? impl.user() : null; } catch (e) { return null; } },
      loadSave: function () {
        return init().then(function () {
          try { return impl.store.load(); } catch (e) { warn('сейв: ' + e); return null; }
        });
      },
      writeSave: function (obj) {
        if (!isObj(obj)) return false;
        if (!initDone) { queuedSave = obj; init(); return true; }
        try { return impl.store.write(obj) !== false; } catch (e) { warn('запись сейва: ' + e); return false; }
      },
      flush: function () {
        if (!initPromise) return Promise.resolve(true);
        return initPromise.then(function () { return impl.store.flush(); }).then(function (ok) { return ok !== false; }, function () { return false; });
      },
      onPause: function (cb) { return on('pause', cb); },
      onResume: function (cb) { return on('resume', cb); },
      banner: {
        show: function () { if (impl.banner) impl.banner.want(true); },
        hide: function () { if (impl.banner) impl.banner.want(false); },
        height: function () { return bannerH; },
        onChange: function (cb) { return on('banner', cb); }
      },
      showInterstitial: function (placement) {
        return init().then(function () { return runInterstitial(String(placement || '')); });
      },
      showRewarded: function (placement) {
        placement = String(placement || '');
        if (rewardedReq && rewardedReq.placement === placement) return rewardedReq.promise;
        if (initDone) return runRewarded(placement);
        return init().then(function () { return runRewarded(placement); });
      },
      onLateReward: function (cb) { return on('late', cb); },
      catalog: function () {
        return init().then(function () {
          if (!impl.catalog || !impl.supports('payments')) return [];
          return impl.catalog();
        }).then(function (list) {
          return (Array.isArray(list) ? list : []).map(normProduct).filter(Boolean);
        }, function (e) { warn('товары: ' + payReason(e)); return []; });
      },
      buy: function (id) {
        id = String(id || '');
        if (buying) return buying.id === id ? buying.promise : Promise.resolve({ status: 'error', reason: 'busy' });
        var entry = { id: id };
        entry.promise = init().then(function () {
          if (!impl.order || !impl.supports('payments')) return { status: 'error', reason: 'unavailable' };
          event({ type: 'buy_request', item: id });
          return fullscreen('buy').then(function () { return impl.order(id); }).then(function (r) {
            return isObj(r) && (r.status === 'paid' || r.status === 'cancel' || r.status === 'error') ? r : { status: 'error', reason: 'bad_answer' };
          }, function (e) {
            return { status: 'error', reason: payReason(e) };
          }).then(function (r) { endFullscreen('buy'); return r; });
        }).then(function (r) {
          if (buying === entry) buying = null;
          event({ type: 'buy_result', item: id, status: r.status, reason: r.reason });
          return r;
        });
        buying = entry;
        return entry.promise;
      },
      purchases: purchases,
      waitPurchases: function (after, sec) {
        var limit = Math.max(0, num(sec, num(cfg.pay.pollSec, 30))) * 1000;
        var t0 = now();
        var i = 0;
        function step() {
          return purchases(after).then(function (res) {
            if (res.purchases.length || res.error === 'http_401') return res;   // 401: подпись запуска истекла — ждать нечего
            i++;
            if (i >= POLL_STEPS.length || now() - t0 + POLL_STEPS[i] > limit) return res;
            return delay(POLL_STEPS[i]).then(step);
          });
        }
        return step();
      },
      // Порциями по CONFIRM_CHUNK по очереди (ревью 1.0, P2-3); true — все порции приняты.
      confirm: function (ids) {
        var list = (Array.isArray(ids) ? ids : []).map(Number).filter(function (x) { return isFinite(x); });
        if (!list.length) return Promise.resolve(true);
        return init().then(function () {
          if (!impl.confirm || !impl.supports('payments')) return false;
          var all = true, i = 0;
          function next() {
            if (i >= list.length) return all;
            var part = list.slice(i, i + CONFIRM_CHUNK);
            i += CONFIRM_CHUNK;
            return Promise.resolve().then(function () { return impl.confirm(part); })
              .then(function (ok) { if (ok === false) all = false; }, function () { all = false; }).then(next);
          }
          return next();
        }).then(function (ok) { return ok !== false; }, function () { return false; });
      },
      entitlements: function () {
        return init().then(function () {
          if (!impl.entitlements || !impl.supports('payments')) return null;
          return impl.entitlements();
        }).then(normEnt, function () { return null; });
      },
      addToFavorites: function () {
        return init().then(function () {
          if (!impl.favorites || !impl.supports('favorites')) return false;
          return impl.favorites();
        }).then(function (ok) { return ok === true; }, function () { return false; });
      },
      // Лёгкий виброотклик (только победа, решение основателя 12.10.2026): площадка —
      // своим откликом (impl.vibrate); не вышло или площадки нет — Vibration API.
      vibrate: function () {
        function nav() {
          try { var n = (core.env.win() || {}).navigator; if (n && typeof n.vibrate === 'function') n.vibrate(30); } catch (e) { /* нет вибрации */ }
        }
        Promise.resolve().then(function () { return impl.vibrate ? impl.vibrate() : false; })
          .then(function (ok) { if (ok !== true) nav(); }, nav);
      },
      supports: function (name) { try { return !!(impl.supports && impl.supports(String(name))); } catch (e) { return false; } },
      onEvent: function (cb) { return on('event', cb); },
      adReady: function (format) { return impl.adReady ? impl.adReady(format) : null; },
      state: function () {
        return {
          kind: kind, initDone: initDone, info: initInfo, paused: anyPaused(), pause: merge(pauseSrc, {}),
          firstAction: firstAction, bannerHeight: bannerH, lastInterstitialAt: lastInterstitialAt,
          lastRewardedAt: lastRewardedAt, rewardedBusy: !!rewardedReq, rewardedLate: !!rewardedLate,
          interstitialBusy: interstitialBusy,
          impl: impl.state ? impl.state() : null, save: impl.store ? impl.store.info() : null
        };
      },
      _create: createPlatform
    };
    return api;
  }

  /* Площадки нет: игра работает, рекламы и покупок нет, сейв в браузере. */
  function WebKind(core) {
    var impl = {
      store: null,
      init: function () { impl.store = RawSave(core, core.saveKey); return Promise.resolve(); },
      user: function () { return null; },
      supports: function () { return false; },
      banner: null
    };
    return impl;
  }
  // Реализации площадок; блоки площадок ниже добавляют свои.
  var KINDS = { web: WebKind };


  /* MOCK-ONLY */
  /* ---------- Подделка площадки для стенда и тестов (только сборка web) ----------
     Всё с пометкой «тест». Переключатели в адресе страницы:
       ?ads=0     — рекламы нет совсем (supports() = false, причина off);
       ?ads=none  — реклама есть, но роликов нет (причина no_ads, баннера нет);
       ?ads=slow  — ответ о награде приходит после сторожа: игра получает timeout,
                    затем onLateReward(placement);
       ?pay=fail  — покупка заканчивается ошибкой;
       ?platform=web — поведение «без площадки».
     Межстраничная: оверлей «Реклама (тест)» на 2 с с ✕. Видео за награду:
     «Досмотреть» — награда, «Закрыть» — без награды. Баннер — полоса 56 px снизу
     «Баннер (тест)» с ✕, только в узком (≤ 600 px) портретном окне и после
     первого касания. Покупка — окно «Тестовая покупка: <товар> за N голосов —
     Купить / Отмена»; журнал и срок — в localStorage (jewel_workshop.mock_pay):
     документированное исключение из правила «без прямого localStorage»,
     это слой площадки, не игра. */
  var MOCK_BANNER_H = 56;
  var MOCK_BANNER_MAX_W = 600;      // «телефон»: узкое окно
  var MOCK_PAY_KEY = 'jewel_workshop.mock_pay';
  var MOCK_PRODUCTS = [
    { id: 'noads_7d', votes: 1, days: 7, royal: false, title: 'Без рекламы на 7 дней' },
    { id: 'noads_30d', votes: 3, days: 30, royal: true, title: 'Без рекламы на 30 дней + Королевский набор' },
    { id: 'noads_365d', votes: 9, days: 365, royal: true, title: 'Без рекламы на год + Королевский набор' }
  ];
  var MOCK_NO_ADS = { error_type: 'client_error', error_data: { error_code: 20, error_reason: 'No ads (тест)' } };

  function mockDomUi(core) {
    var Z = 2147483000;
    function doc() { return core.env.doc(); }
    function el(tag, css, text) {
      var e = doc().createElement(tag);
      if (css) e.style.cssText = css;
      if (text != null) e.textContent = text;
      return e;
    }
    function drop(e) { if (e && e.parentNode) e.parentNode.removeChild(e); }
    function layer(title, sub) {
      var d = el('div', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:' + Z + ';display:flex;flex-direction:column;' +
        'align-items:center;justify-content:center;gap:14px;padding:24px;box-sizing:border-box;background:rgba(28,18,44,.94);' +
        'color:#fff;font:600 17px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center');
      d.setAttribute('data-ws-mock', 'overlay');
      d.appendChild(el('div', 'font-size:28px;font-weight:800;letter-spacing:.02em', title));
      if (sub) d.appendChild(el('div', 'opacity:.75;font-size:14px;max-width:320px', sub));
      doc().body.appendChild(d);
      return d;
    }
    function button(parent, text, cb, css) {
      var b = el('button', 'min-width:150px;padding:12px 18px;border:0;border-radius:12px;font:700 16px system-ui,sans-serif;' +
        'cursor:pointer;' + (css || 'background:#f2c14e;color:#2a1a3a'), text);
      b.type = 'button';
      b.addEventListener('click', function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); cb(); });
      parent.appendChild(b);
      return b;
    }
    var bannerEl = null;
    return {
      interstitial: function (placement) {
        return new Promise(function (resolve) {
          var d = layer('Реклама (тест)', 'Межстраничная реклама · ' + (placement || 'без места') + ' · закроется сама через 2 с');
          var t = core.later(close, 2000);
          button(d, '✕', close, 'position:absolute;top:12px;right:12px;min-width:0;width:44px;height:44px;padding:0;background:rgba(255,255,255,.15);color:#fff');
          function close() { core.cancel(t); drop(d); resolve('closed'); }
        });
      },
      rewarded: function (placement) {
        return new Promise(function (resolve) {
          var d = layer('Реклама (тест)', 'Видео за награду · ' + (placement || 'без места'));
          button(d, 'Досмотреть', function () { drop(d); resolve('watch'); });
          button(d, 'Закрыть', function () { drop(d); resolve('close'); }, 'background:rgba(255,255,255,.15);color:#fff');
        });
      },
      purchase: function (p) {
        return new Promise(function (resolve) {
          var d = layer('Тестовая покупка', p.title + ' за ' + votesWord(p.votes) + ' · голоса не списываются');
          button(d, 'Купить', function () { drop(d); resolve('buy'); });
          button(d, 'Отмена', function () { drop(d); resolve('cancel'); }, 'background:rgba(255,255,255,.15);color:#fff');
        });
      },
      banner: function (show, onClose) {
        if (!show) { drop(bannerEl); bannerEl = null; return; }
        if (bannerEl) return;
        bannerEl = el('div', 'position:fixed;left:0;right:0;bottom:0;height:' + MOCK_BANNER_H + 'px;z-index:' + (Z - 1) + ';' +
          'display:flex;align-items:center;justify-content:center;background:#3a2c55;color:#fff;' +
          'font:700 15px system-ui,sans-serif;box-shadow:0 -2px 8px rgba(0,0,0,.25)', 'Баннер (тест)');
        bannerEl.setAttribute('data-ws-mock', 'banner');
        button(bannerEl, '✕', function () { onClose(); }, 'position:absolute;right:6px;top:6px;min-width:0;width:44px;height:44px;padding:0;background:transparent;color:#fff');
        doc().body.appendChild(bannerEl);
      }
    };
  }

  function MockKind(core) {
    var cfg = core.cfg;
    var q = core.query;
    var adsMode = String(q.ads == null ? '' : q.ads);
    var payMode = String(q.pay == null ? '' : q.pay);
    var ui = core.env.mockUi || mockDomUi(core);
    var bn = { wanted: false, on: false, closed: false, suspended: 0 };
    var DAY = 86400000;

    function adsOn() { return adsMode !== '0'; }
    function slowMs() { return num(cfg.ads.rewarded.waitSec, 180) * 1000 + 3000; }
    function journal() {
      try {
        var o = JSON.parse(core.lsGet(MOCK_PAY_KEY) || 'null');
        if (isObj(o) && Array.isArray(o.rows)) return o;
      } catch (e) { /* пусто */ }
      return { rows: [] };
    }
    function bannerAllowed() {
      var w = core.env.win() || {};
      var W = w.innerWidth || 0, H = w.innerHeight || 0;
      return adsOn() && adsMode !== 'none' && !!cfg.ads.banner.enabled && W > 0 && W <= MOCK_BANNER_MAX_W && H > W;
    }
    function bannerSync() {
      var want = bn.wanted && core.firstAction() && !bn.closed && bn.suspended === 0 && bannerAllowed();
      if (want === bn.on) return;
      bn.on = want;
      if (want) {
        ui.banner(true, function () { bn.closed = true; bn.on = false; ui.banner(false); core.bannerHeight(0); });
        core.bannerHeight(MOCK_BANNER_H);
      } else {
        ui.banner(false);
        core.bannerHeight(0);
      }
    }

    var impl = {
      store: null,
      init: function () { impl.store = RawSave(core, core.saveKey); return Promise.resolve(); },
      user: function () { return { id: 'test', appId: 'test' }; },
      supports: function (name) {
        switch (name) {
          case 'interstitial': return adsOn() && !!cfg.ads.interstitial.enabled;
          case 'rewarded': return adsOn() && !!cfg.ads.rewarded.enabled;
          case 'banner': return adsOn() && !!cfg.ads.banner.enabled;
          case 'payments': return true;
          case 'favorites': return true;
          default: return false;
        }
      },
      requestInterstitial: function (placement) {
        if (adsMode === 'none') return Promise.reject(MOCK_NO_ADS);
        return ui.interstitial(placement).then(function () {
          if (adsMode === 'slow') return core.delay(slowMs()).then(function () { return { result: true }; });
          return { result: true };
        });
      },
      requestRewarded: function (placement) {
        if (adsMode === 'none') return Promise.reject(MOCK_NO_ADS);
        return ui.rewarded(placement).then(function (answer) {
          if (answer !== 'watch') return { result: false };
          if (adsMode === 'slow') return core.delay(slowMs()).then(function () { return { result: true }; });
          return { result: true };
        });
      },
      adReady: function () { return adsOn() && adsMode !== 'none'; },
      banner: {
        want: function (v) { bn.wanted = !!v; bannerSync(); },
        sync: bannerSync,
        suspend: function () { bn.suspended++; bannerSync(); return Promise.resolve(); },
        resume: function () { bn.suspended = Math.max(0, bn.suspended - 1); bannerSync(); },
        state: function () { return { wanted: bn.wanted, on: bn.on, closed: bn.closed, suspended: bn.suspended }; }
      },
      catalog: function () { return Promise.resolve(MOCK_PRODUCTS.map(function (p) { return merge(p, {}); })); },
      order: function (id) {
        var p = MOCK_PRODUCTS.filter(function (x) { return x.id === id; })[0];
        if (!p) return Promise.resolve({ status: 'error', reason: 'no_item' });
        return ui.purchase(p).then(function (answer) {
          if (answer !== 'buy') return { status: 'cancel', reason: 'cancel' };
          if (payMode === 'fail') return { status: 'error', reason: 'mock_fail' };
          var j = journal();
          var last = j.rows.length ? j.rows[j.rows.length - 1].id : 0;
          var id2 = Math.max(core.now(), last + 1);
          var n = j.rows.length + 1;
          j.rows.push({ id: id2, order: 't-' + n, item: p.id, days: p.days, royal: p.royal, test: true, claimed: false, refund: false, ts: id2 });
          core.lsSet(MOCK_PAY_KEY, JSON.stringify(j));
          return { status: 'paid', reason: 'ok', order: 't-' + n };
        });
      },
      purchasesPage: function (after) {
        var a = num(after, 0);
        var rows = journal().rows.filter(function (r) { return r.id > a; });
        return Promise.resolve({ purchases: rows.slice(0, 50), more: rows.length > 50 });
      },
      confirm: function (ids) {
        var j = journal();
        j.rows.forEach(function (r) { if (ids.indexOf(r.id) >= 0) r.claimed = true; });
        if (j.rows.length) core.lsSet(MOCK_PAY_KEY, JSON.stringify(j));
        return Promise.resolve(true);
      },
      // Тот же расчёт, что у сервера: until = max(until, оплата) + дни; набор — навсегда.
      entitlements: function () {
        var until = 0, royal = false;
        journal().rows.filter(function (r) { return !r.refund; }).sort(function (a, b) { return a.id - b.id; }).forEach(function (r) {
          if (r.days > 0) until = Math.max(until, r.ts) + r.days * DAY;
          if (r.royal) royal = true;
        });
        return Promise.resolve({ noads_until: until, royal: royal, now: core.now() });
      },
      favorites: function () { core.warn('добавлено в избранное (тест)'); return Promise.resolve(true); },
      state: function () { return { ads: adsMode, pay: payMode, banner: { wanted: bn.wanted, on: bn.on, closed: bn.closed } }; }
    };
    return impl;
  }
  KINDS.mock = MockKind;
  /* /MOCK-ONLY */

  root.WSPlatform = createPlatform(null);
})(typeof window !== 'undefined' ? window : this);
