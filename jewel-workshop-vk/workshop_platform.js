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

  /* VK-ONLY */
  /* ---------- ВКонтакте (VK Bridge 2.15.12, vk-bridge-2.15.12.min.js) ----------
     Уроки ВК (docs/WORKSHOP_PLATFORM.md, PLAYBOOK §7):
     - каждый вызов моста — через withTimeout (по умолчанию 8000 мс), VKWebAppInit — тоже;
       для рекламы срок — сторож показа (waitSec), для окна покупки — pay.orderWaitSec;
     - VKWebAppViewHide/ViewRestore -> onPause/onResume('view'), на сворачивании сейв пишется сразу;
     - VK Storage: ключ [a-zA-Z0-9_-] до 100 символов; ВК хранит «только первые 4096
       символов, для сериализованной строки — 2236» и лишнее молча режет. Поэтому кусок —
       до VK_CHUNK по весу (ASCII 1, кавычка и обратная косая 2, прочее 6), то есть даже
       экранированный кусок короче 2236. Два слота: заголовки jw_h0 / jw_h1
       «wsv1:<слот>:<кусков>:<FNV-1a>:<ревизия>», куски jw_s0_<n> / jw_s1_<n>. Новая версия
       пишется в слот, где НЕ лежит текущая целая, заголовок — последним: сбой посередине
       оставляет прошлую целую версию. При чтении хэш проверяется, битый слот -> другой слот;
     - копия устройства — localStorage с префиксом учётки vk<app>_<user>.; берётся более
       свежая ревизия; облако не прочиталось и копии нет — ревизия 0 (облако ветерана победит);
     - покупки выдаёт только сервер (журнал по курсору), ответ окна оплаты — не выдача. */
  var VK_CHUNK = 2000;
  var VK_MAX_PARTS = 200;          // 2 слота × 200 + 2 заголовка < 1000 ключей ВК на игрока
  var VK_GET_BATCH = 20;
  var VK_WRITE_DELAY = 3000;
  var VK_RETRY_MAX = 60000;
  var VK_KEY_RE = /^[a-zA-Z0-9_-]{1,100}$/;
  var VK_SLOTS = ['0', '1'];

  function vkHash(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function vkWeight(code) {
    if (code === 34 || code === 92) return 2;          // " и \ экранируются
    if (code < 32 || code >= 127) return 6;            // \uXXXX
    return 1;
  }
  // Куски не тяжелее VK_CHUNK; суррогатная пара (эмодзи) не разрывается.
  function vkPieces(value) {
    var out = [];
    if (!value) return out;
    var start = 0, weight = 0;
    for (var i = 0; i < value.length; i++) {
      var code = value.charCodeAt(i);
      var w = vkWeight(code);
      if (weight + w > VK_CHUNK && i > start && (code < 0xdc00 || code > 0xdfff)) {
        out.push(value.substring(start, i));
        start = i;
        weight = 0;
      }
      weight += w;
    }
    out.push(value.substring(start));
    return out;
  }
  function vkHeadKey(slot) { return 'jw_h' + slot; }
  function vkPartKey(slot, i) { return 'jw_s' + slot + '_' + i; }
  function vkParseHead(value, slot) {
    var m = /^wsv1:([01]):(\d{1,4}):([0-9a-f]{8}):(\d{1,15})$/.exec(String(value || ''));
    if (!m || m[1] !== slot) return null;
    return { slot: slot, count: Number(m[2]), hash: m[3], rev: Number(m[4]) };
  }
  function vkParseEnv(text) {
    try {
      var o = JSON.parse(text);
      if (isObj(o) && isObj(o.d)) return { r: Math.max(0, Math.floor(num(o.r, 0))), t: num(o.t, 0), d: o.d, text: text };
    } catch (e) { /* битый */ }
    return null;
  }

  // Сейв ВК: копия устройства (конверт {r, t, d}) + облако в двух слотах.
  function VkSave(core, localKey, send) {
    var local = null, chosen = null, decided = false, cloudOk = false, unverified = false;
    var rev = 0;
    var slots = null;               // {cur, count:{0,1}, rev:{0,1}}
    var pending = null;             // {text, rev}
    var timer = 0, flushing = false, retryMs = VK_WRITE_DELAY, waiters = [], hidden = false;
    var lastError = '';

    function set(key, value) { return send('VKWebAppStorageSet', { key: key, value: value }); }
    function getMap(keys) {
      var map = {};
      var chain = Promise.resolve();
      for (var i = 0; i < keys.length; i += VK_GET_BATCH) {
        (function (batch) {
          chain = chain.then(function () {
            return send('VKWebAppStorageGet', { keys: batch }).then(function (r) {
              ((r && r.keys) || []).forEach(function (kv) { if (kv && kv.key) map[kv.key] = kv.value || ''; });
            });
          });
        })(keys.slice(i, i + VK_GET_BATCH));
      }
      return chain.then(function () { return map; });
    }
    function readSlot(h) {
      var keys = [];
      for (var i = 0; i < h.count; i++) keys.push(vkPartKey(h.slot, i));
      return getMap(keys).then(function (map) {
        var parts = [];
        for (var j = 0; j < keys.length; j++) {
          if (!map[keys[j]]) { core.warn('облако: нет куска ' + keys[j]); return null; }
          parts.push(map[keys[j]]);
        }
        var text = parts.join('');
        if (vkHash(text) !== h.hash) { core.warn('облако: хэш слота ' + h.slot + ' не сошёлся'); return null; }
        return text;
      });
    }
    // Чтение облака: оба заголовка, затем слоты от свежей ревизии к старой.
    // Сбой моста -> исключение (облако недоступно); битые слоты -> {env: null}.
    function readCloud() {
      var st = { cur: null, count: { '0': 0, '1': 0 }, rev: { '0': -1, '1': -1 }, broken: [] };
      return getMap(VK_SLOTS.map(vkHeadKey)).then(function (map) {
        var heads = VK_SLOTS.map(function (s) { return vkParseHead(map[vkHeadKey(s)], s); }).filter(Boolean);
        heads.forEach(function (h) { st.count[h.slot] = h.count; st.rev[h.slot] = h.rev; });
        heads.sort(function (a, b) { return b.rev - a.rev; });
        var i = 0;
        function next() {
          if (i >= heads.length) return { env: null, state: st };
          var h = heads[i++];
          return readSlot(h).then(function (text) {
            var e = text === null ? null : vkParseEnv(text);
            if (e) { st.cur = h.slot; return { env: e, state: st }; }
            st.broken.push(h.slot);
            return next();
          });
        }
        return next();
      });
    }
    function writeCloud(item) {
      var parts = vkPieces(item.text);
      if (parts.length > VK_MAX_PARTS) return Promise.reject({ error_type: 'too_big' });
      var slot = slots.cur === '0' ? '1' : '0';
      var head = 'wsv1:' + slot + ':' + parts.length + ':' + vkHash(item.text) + ':' + item.rev;
      var chain = Promise.resolve();
      parts.forEach(function (p, i) { chain = chain.then(function () { return set(vkPartKey(slot, i), p); }); });
      return chain.then(function () { return set(vkHeadKey(slot), head); }).then(function () {
        var old = slots.count[slot] || 0;
        slots.cur = slot;
        slots.count[slot] = parts.length;
        slots.rev[slot] = item.rev;
        var tidy = Promise.resolve();    // хвост прошлой версии слота; сбой уборки не мешает
        for (var i = parts.length; i < old; i++) {
          (function (k) { tidy = tidy.then(function () { return set(k, '').then(noop, noop); }); })(vkPartKey(slot, i));
        }
        return tidy;
      });
    }
    function settle(ok) { var w = waiters; waiters = []; w.forEach(function (f) { f(ok); }); }
    function schedule() {
      if (!cloudOk || !pending || flushing) return;
      if (timer) { if (!hidden) return; core.cancel(timer); timer = 0; }
      timer = core.later(run, hidden ? 0 : VK_WRITE_DELAY);
    }
    function run() {
      timer = 0;
      if (flushing) return;
      if (!pending || !cloudOk) { settle(true); return; }
      flushing = true;
      var item = pending;
      pending = null;
      writeCloud(item).then(function () {
        flushing = false;
        retryMs = VK_WRITE_DELAY;
        lastError = '';
        if (pending) { if (waiters.length || hidden) run(); else schedule(); } else settle(true);
      }, function (e) {
        flushing = false;
        lastError = errText(e);
        core.warn('облако: запись не прошла: ' + lastError);
        if (e && e.error_type === 'too_big') { settle(false); return; }   // только копия устройства
        if (!pending) pending = item;
        settle(false);
        timer = core.later(run, retryMs);
        retryMs = Math.min(retryMs * 2, VK_RETRY_MAX);
      });
    }

    var store = {
      begin: function () {
        var t = core.lsGet(localKey);
        local = t ? vkParseEnv(t) : null;
        if (t && !local) core.warn('копия устройства не читается');
      },
      // res — результат readCloud() или null (облако не прочитано).
      decide: function (res) {
        if (decided) return;
        decided = true;
        if (!res) {
          cloudOk = false;
          chosen = local;
          rev = local ? local.r : 0;
          unverified = !local;
          return;
        }
        cloudOk = true;
        slots = res.state;
        var c = res.env;
        rev = Math.max(local ? local.r : 0, c ? c.r : 0, slots.rev['0'], slots.rev['1'], 0);
        if (c && (!local || c.r > local.r || (c.r === local.r && c.t > local.t))) {
          chosen = c;
          core.lsSet(localKey, c.text);
        } else {
          chosen = local;
          if (local && (!c || local.r !== c.r || local.t !== c.t)) {
            // копия устройства свежее облака — дописать облако
            rev = rev + 1;
            var text = JSON.stringify({ r: rev, t: local.t, d: local.d });
            core.lsSet(localKey, text);
            pending = { text: text, rev: rev };
            schedule();
          }
        }
      },
      finalize: function () { if (!decided) store.decide(null); },
      load: function () { return chosen ? JSON.parse(JSON.stringify(chosen.d)) : null; },
      write: function (obj) {
        if (!unverified) rev += 1;
        var t = core.now();
        var text = JSON.stringify({ r: rev, t: t, d: obj });
        chosen = { r: rev, t: t, d: JSON.parse(JSON.stringify(obj)), text: text };
        var ok = core.lsSet(localKey, text);
        if (cloudOk) { pending = { text: text, rev: rev }; schedule(); }
        return ok || cloudOk;
      },
      flush: function () {
        if (!cloudOk || (!pending && !flushing)) return Promise.resolve(true);
        return new Promise(function (resolve) {
          waiters.push(resolve);
          if (!flushing) { core.cancel(timer); timer = 0; run(); }
        });
      },
      setHidden: function (h) { hidden = !!h; if (hidden && cloudOk && (pending || flushing)) store.flush(); },
      cloud: function () { return cloudOk; },
      readCloud: readCloud,
      info: function () {
        return { key: localKey, cloud: cloudOk, rev: rev, unverified: unverified, pending: !!pending,
                 flushing: flushing, slot: slots ? slots.cur : null, error: lastError };
      }
    };
    return store;
  }

  function VkKind(core) {
    var cfg = core.cfg;
    var q = core.query;
    var userId = /^\d{1,20}$/.test(q.vk_user_id || '') ? q.vk_user_id : '';
    var appId = /^\d{1,20}$/.test(q.vk_app_id || '') ? q.vk_app_id : '';
    var vkPlatform = String(q.vk_platform || '');
    var isPhone = /^mobile_/.test(vkPlatform);
    var launch = String(core.env.search() || '').replace(/^\?/, '');
    var initOk = false, favSupport = null;
    var bridgeTimeout = num(cfg.timeouts.bridgeMs, 8000);
    var ready = { reward: null, interstitial: null };
    var preloadQueue = [], preloadBusy = false, showing = false, preloadTries = { reward: 0, interstitial: 0 };

    function bridge() {
      var b = core.env.bridge ? core.env.bridge() : root.vkBridge;
      return b && typeof b.send === 'function' ? b : null;
    }
    function raw(method, params) {
      var b = bridge();
      if (!b) return Promise.reject({ error_type: 'no_bridge' });
      try { return Promise.resolve(b.send(method, params || {})); } catch (e) { return Promise.reject(e); }
    }
    function send(method, params, ms) { return core.withTimeout(raw(method, params), ms || bridgeTimeout); }

    var impl = {
      store: null,
      ok: function () { return initOk; },
      user: function () { return userId ? { id: userId, appId: appId } : null; },
      init: function () {
        var started = core.now();
        var budget = num(cfg.timeouts.initMs, 8000);
        var left = function () { return Math.max(500, Math.min(bridgeTimeout, budget - (core.now() - started) - 100)); };
        impl.store = VkSave(core, 'vk' + (appId || '0') + '_' + (userId || '0') + '.' + core.saveKey, send);
        impl.store.begin();
        var b = bridge();
        if (!b) { core.warn('VK Bridge не загрузился — игра без площадки'); return Promise.resolve(); }
        try {
          if (typeof b.subscribe === 'function') b.subscribe(onBridgeEvent);
        } catch (e) { core.warn('subscribe: ' + e); }
        return send('VKWebAppInit', {}, Math.min(4000, left())).then(function () {
          initOk = true;
        }, function (e) {
          core.warn('VKWebAppInit: ' + errText(e));
        }).then(function () {
          if (!initOk || !userId) return;
          return impl.store.readCloud().then(function (res) {
            if (core.initClosed()) return;          // срок init вышел — облако в этой сессии не трогаем
            impl.store.decide(res);
          }, function (e) {
            core.warn('облако не прочитано: ' + errText(e));
          });
        });
      },
      afterInit: function () {
        if (!initOk) return;
        var b = bridge();
        if (b && typeof b.supportsAsync === 'function') {
          core.withTimeout(b.supportsAsync('VKWebAppAddToFavorites'), bridgeTimeout)
            .then(function (v) { favSupport = v !== false; }, function () { favSupport = true; });
        } else favSupport = true;
        if (cfg.ads.preload) core.later(function () { preload('reward'); preload('interstitial'); }, 1500);
      },
      supports: function (name) {
        if (!initOk) return false;
        var ads = cfg.ads;
        switch (name) {
          case 'interstitial': return !!ads.interstitial.enabled;
          case 'rewarded': return !!ads.rewarded.enabled;
          case 'banner': return !!ads.banner.enabled && (!ads.banner.phoneOnly || isPhone);
          case 'payments': return !!String(cfg.payServer || '') && !!userId && !!q.sign && typeof core.env.fetch() === 'function';
          case 'favorites': return favSupport !== false;
          case 'cloudSave': return impl.store ? impl.store.cloud() : false;
          default: return false;
        }
      },
      requestInterstitial: function () {
        return showAd('interstitial', { ad_format: 'interstitial' });
      },
      requestRewarded: function () {
        return showAd('reward', { ad_format: 'reward', use_waterfall: true });
      },
      afterFullscreen: function () { pump(); },
      adReady: function (format) {
        var f = format === 'rewarded' ? 'reward' : format;
        return ready.hasOwnProperty(f) ? ready[f] : null;
      },
      banner: null,
      catalog: function () {
        return api('GET', '/v1/products').then(function (r) { return (r && r.products) || []; });
      },
      order: function (id) {
        return core.withTimeout(raw('VKWebAppShowOrderBox', { type: 'item', item: id }), num(cfg.pay.orderWaitSec, 600) * 1000)
          .then(function (d) {
            if (d && (d.success === true || d.status === 'success' || d.result === true)) {
              return { status: 'paid', reason: 'ok', order: d.order_id != null ? String(d.order_id) : '' };
            }
            return { status: 'cancel', reason: String((d && d.status) || 'cancel') };
          }, function (e) {
            if (e && e.error_type === 'timeout') return { status: 'error', reason: 'timeout' };
            var code = errCode(e);
            if (code === 4 || /denied|cancel/i.test(errText(e))) return { status: 'cancel', reason: 'cancel' };
            return { status: 'error', reason: e && e.error_type === 'no_bridge' ? 'unavailable' : 'vk_' + (isFinite(code) ? code : 'error') };
          });
      },
      purchasesPage: function (after) {
        return api('GET', '/v1/purchases?after=' + encodeURIComponent(String(after))).then(function (r) {
          return { purchases: (r && r.purchases) || [], more: !!(r && r.more) };
        });
      },
      confirm: function (ids) {
        return api('POST', '/v1/purchases/confirm', { ids: ids }).then(function () { return true; }, function () { return false; });
      },
      entitlements: function () { return api('GET', '/v1/entitlements'); },
      favorites: function () {
        return send('VKWebAppAddToFavorites', {}, num(cfg.timeouts.dialogMs, 60000))
          .then(function (d) { return !!(d && d.result); }, function () { return false; });
      },
      state: function () {
        return { initOk: initOk, userId: userId, appId: appId, vkPlatform: vkPlatform, phone: isPhone,
                 ready: { reward: ready.reward, interstitial: ready.interstitial }, banner: impl.banner ? impl.banner.state() : null };
      }
    };

    // Сервер платежей (server/app.py): игрок — строка запуска ВК в X-Launch-Params.
    function api(method, path, body) {
      var base = String(cfg.payServer || '').replace(/\/+$/, '');
      var f = core.env.fetch();
      if (!base || typeof f !== 'function') return Promise.reject({ error_type: 'no_server' });
      var opts = { method: method, headers: { 'X-Launch-Params': launch }, cache: 'no-store', credentials: 'omit' };
      if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
      var ctl = null;
      try { if (typeof root.AbortController === 'function') { ctl = new root.AbortController(); opts.signal = ctl.signal; } } catch (e) { ctl = null; }
      var p;
      try { p = Promise.resolve(f(base + path, opts)); } catch (e) { return Promise.reject({ error_type: 'network' }); }
      return core.withTimeout(p.then(function (r) {
        if (!r || !r.ok) throw { error_type: 'http', status: r ? r.status : 0 };
        return r.json();
      }, function (e) {
        if (e && e.error_type) throw e;
        throw { error_type: 'network' };
      }), bridgeTimeout).then(null, function (e) {
        if (e && e.error_type === 'timeout' && ctl) { try { ctl.abort(); } catch (x) { /* ок */ } }
        throw e;
      });
    }

    // Реклама: показ строго по одному; предзагрузка (VKWebAppCheckNativeAds) —
    // по одной, не во время показа; отказ — повтор через 30 с, не больше 5 раз.
    function showAd(fmt, params) {
      showing = true;
      var p = raw('VKWebAppShowNativeAds', params);
      p.then(function () { ready[fmt] = null; }, function () { ready[fmt] = null; }).then(function () {
        showing = false;
        preload(fmt);
      });
      return p;
    }
    function preload(fmt) {
      if (!cfg.ads.preload || !initOk) return;
      if (preloadQueue.indexOf(fmt) < 0) preloadQueue.push(fmt);
      pump();
    }
    function pump() {
      if (preloadBusy || showing || !preloadQueue.length) return;
      var fmt = preloadQueue.shift();
      preloadBusy = true;
      var params = fmt === 'reward' ? { ad_format: 'reward', use_waterfall: true } : { ad_format: fmt };
      send('VKWebAppCheckNativeAds', params).then(function (d) {
        ready[fmt] = !!(d && d.result);
      }, function () { ready[fmt] = false; }).then(function () {
        preloadBusy = false;
        if (ready[fmt] === false && preloadTries[fmt] < 5) {
          preloadTries[fmt]++;
          core.later(function () { preload(fmt); }, 30000);
        } else if (ready[fmt]) preloadTries[fmt] = 0;
        pump();
      });
    }

    function onBridgeEvent(e) {
      var type = e && e.detail && e.detail.type;
      var data = e && e.detail && e.detail.data;
      if (type === 'VKWebAppViewHide') core.setPaused('view', true);
      else if (type === 'VKWebAppViewRestore') core.setPaused('view', false);
      else if (type === 'VKWebAppBannerAdUpdated') { if (impl.banner) impl.banner.info(data); }
      else if (type === 'VKWebAppBannerAdClosedByUser') { if (impl.banner) impl.banner.closedByUser(); }
    }

    impl.banner = VkBanner(core, send, function () { return initOk; }, isPhone);
    return impl;
  }

  /* Баннер снизу (game3 vk_platform.js, ТЗ ads_rework): только мобильные клиенты
     (vk_platform=mobile_*) и портрет, не до первого касания игрока. Место под баннер
     резервирует ЛИБО площадка (layout_type 'resize' в ответе или окно само стало
     ниже на 30+ px за 600 мс), ЛИБО игра — по banner_height из ответа и события
     VKWebAppBannerAdUpdated (height()/onChange). Закрыл игрок — до перезапуска не
     показываем. Отказ — новая попытка только после поворота, не больше maxFailures
     за сессию. На время полноэкранной рекламы и окна покупки баннер прячется. */
  function VkBanner(core, send, initOk, isPhone) {
    var bc = core.cfg.ads.banner;
    var wanted = false, on = false, busy = false, closed = false, suspended = 0;
    var failures = 0, blocked = false, selfResized = false, waiters = [];
    var SELF_RESIZE_PX = 30, SETTLE_MS = 600;

    function win() { return core.env.win() || {}; }
    function portrait() {
      var w = win();
      try { if (w.matchMedia) return w.matchMedia('(orientation: portrait)').matches; } catch (e) { /* ниже */ }
      return (w.innerHeight || 0) >= (w.innerWidth || 0);
    }
    function allowed() {
      return initOk() && !!bc.enabled && (!bc.phoneOnly || isPhone) && (!bc.portraitOnly || portrait());
    }
    function applyInfo(info) {
      if (!on || selfResized) return;
      if (!info || info.result === false) { core.bannerHeight(0); return; }
      if (info.layout_type === 'resize') { core.bannerHeight(0); return; }
      var h = Number(info.banner_height);
      core.bannerHeight(h > 0 ? h : num(bc.fallbackHeight, 60));
    }
    function wake() { var w = waiters; waiters = []; w.forEach(function (f) { f(); }); }
    function params() {
      var p = { banner_location: bc.location === 'top' ? 'top' : 'bottom' };
      if (bc.layout === 'resize' || bc.layout === 'overlay') p.layout_type = bc.layout;
      if (bc.heightType === 'regular' || bc.heightType === 'compact') p.height_type = bc.heightType;
      return p;
    }
    function sync() {
      if (busy) return;
      var max = num(bc.maxFailures, 3);
      if (!portrait() && failures < max) blocked = false;     // поворот снимает блок после отказа
      var want = wanted && core.firstAction() && !closed && suspended === 0 && allowed() && !blocked && failures < max;
      if (want === on) { if (!on) wake(); return; }
      busy = true;
      if (want) {
        var before = win().innerHeight || 0;
        send('VKWebAppShowBannerAd', params()).then(function (info) {
          if (info && info.result === false) { failures++; blocked = true; return; }
          on = true;
          selfResized = false;
          applyInfo(info);
          core.later(function () {
            if (on && before - (win().innerHeight || 0) >= SELF_RESIZE_PX) { selfResized = true; core.bannerHeight(0); }
          }, SETTLE_MS);
        }, function (e) {
          failures++;
          blocked = true;
          core.warn('баннер недоступен: ' + errText(e));
        }).then(function () { busy = false; sync(); });
      } else {
        send('VKWebAppHideBannerAd', {}).then(noop, function (e) { core.warn('баннер: скрыть не удалось: ' + errText(e)); })
          .then(function () {
            on = false;
            selfResized = false;
            core.bannerHeight(0);
            busy = false;
            sync();
          });
      }
    }
    return {
      want: function (v) { wanted = !!v; sync(); },
      sync: sync,
      info: applyInfo,
      closedByUser: function () { closed = true; on = false; selfResized = false; core.bannerHeight(0); wake(); },
      suspend: function () {
        suspended++;
        sync();
        if (!on && !busy) return Promise.resolve();
        return core.withTimeout(new Promise(function (r) { waiters.push(r); }), num(core.cfg.timeouts.bridgeMs, 8000)).then(noop, noop);
      },
      resume: function () { suspended = Math.max(0, suspended - 1); sync(); },
      state: function () { return { wanted: wanted, on: on, closed: closed, failures: failures, blocked: blocked, suspended: suspended, selfResized: selfResized }; }
    };
  }

  VkKind.internals = { pieces: vkPieces, hash: vkHash, headKey: vkHeadKey, partKey: vkPartKey, parseHead: vkParseHead,
                       CHUNK: VK_CHUNK, MAX_PARTS: VK_MAX_PARTS, KEY_RE: VK_KEY_RE, weight: vkWeight };
  KINDS.vk = VkKind;
  /* /VK-ONLY */


  root.WSPlatform = createPlatform(null);
  /* VK-ONLY */
  root.WSPlatform._vk = VkKind.internals;
  /* /VK-ONLY */
})(typeof window !== 'undefined' ? window : this);
