/* Граница среды (ТЗ §13.1): остальной код о площадке не знает.
   web — стенд и браузер: localStorage, при его отказе — память вкладки с честным флагом.
   vk  — мини-приложение ВК (vkBridge.isEmbedded()): VKWebAppInit, сохранение дублируется
   в облако ВК (VKWebAppStorage, ключ g1f1_save) — в iframe ВК, особенно на iOS, localStorage
   бывает недоступен или чистится. Чтение облака асинхронное: Platform.ready отдаёт его
   строку, игра берёт более свежую из двух копий (State.adopt). Журнал событий — только локально.
   Облако считается сохранённым только после ответа VKWebAppStorageSet (Platform.sync):
   последняя неподтверждённая ревизия ждёт успеха и повторяется сама — по таймеру с растущей
   паузой, при возврате сети и вкладки; в полёте не больше одного запроса, новая ревизия
   заменяет ждущую. Слишком длинное для ВК сохранение — громкий отказ, локальная копия остаётся.
   ?nostore — проверка A20: хранилище «ломается», игра должна честно об этом сказать (только вне ВК). */
(function (root) {
  'use strict';
  var params = new URLSearchParams(location.search);
  var mem = {};
  var broken;
  var SAVE_KEY = 'g1f1.save.v1';   // ключ State в localStorage
  var CLOUD_KEY = 'g1f1_save';     // в облаке ВК точки в ключе запрещены
  var CLOUD_MAX = 4000;            // ВК: значение до 4096 знаков
  var INIT_MS = 2500, GET_MS = 3000, PUSH_MS = 800;
  var RETRY_MS = 2000, RETRY_MAX_MS = 60000; // повтор отказа: 2, 4, 8 … ≤ 60 с
  var FAIL_AFTER = 3;                         // столько отказов подряд — «не удалось сохранить в ВК»

  var bridge = root.vkBridge;
  var vk = false;
  try { vk = !!(bridge && bridge.isEmbedded && bridge.isEmbedded()); } catch (e) { vk = false; }
  // Инструменты проверки (?nostore, ?journal) — только на стенде и в автотестах, в ВК их нет.
  var dev = !vk;
  broken = dev && params.has('nostore');

  function lsOk() {
    if (broken) return false;
    try { localStorage.setItem('g1f1.probe', '1'); localStorage.removeItem('g1f1.probe'); return true; }
    catch (e) { return false; }
  }
  var local = lsOk();
  var cloudOk = false;     // облако ВК прочитано — писать туда можно
  var last = null;         // последнее сохранение, отданное игрой
  var confirmed = null;    // последнее сохранение, которое ВК подтвердил
  var pending = null;      // ждёт подтверждения ВК (держится и во время запроса, и после отказа)
  var inflight = false, fails = 0, pushTimer = null;
  var syncSeen = null, syncListeners = [];
  if (local) { try { last = localStorage.getItem(SAVE_KEY); } catch (e) { last = null; } }

  function withTimeout(p, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }
  function send(method, data) {
    try { return withTimeout(bridge.send(method, data || {}), method === 'VKWebAppInit' ? INIT_MS : GET_MS); }
    catch (e) { return Promise.reject(e); }
  }

  /* Где сейчас прогресс: device — на устройстве; pending — ждёт отправки в ВК;
     cloud — подтверждён ВК; failed — в ВК сохранить не удалось; none — нигде. */
  function sync() {
    if (broken) return 'none';
    if (!(vk && cloudOk)) return local ? 'device' : 'none';
    if (last == null || last === confirmed) return 'cloud';
    if (last.length > CLOUD_MAX || fails >= FAIL_AFTER) return 'failed';
    return pending != null || !local ? 'pending' : 'device';
  }
  function notify() {
    var s = sync();
    if (s === syncSeen) return;
    syncSeen = s;
    syncListeners.forEach(function (f) { try { f(s); } catch (e) { console.error(e); } });
  }

  function schedule(ms) { if (!pushTimer && !inflight) pushTimer = setTimeout(push, ms); }
  function push() {
    clearTimeout(pushTimer); pushTimer = null;
    if (!cloudOk || inflight || pending == null) return;
    var v = pending;
    inflight = true;
    send('VKWebAppStorageSet', { key: CLOUD_KEY, value: v }).then(function (r) {
      if (r && r.result === false) { failed(new Error('result false')); return; }
      inflight = false; fails = 0; confirmed = v;
      if (pending === v) pending = null; else schedule(PUSH_MS); // пока летел запрос, пришла ревизия новее
      notify();
    }, failed);
  }
  function failed(e) {
    inflight = false; fails++;
    if (fails === FAIL_AFTER) console.warn('[vk] облако не принимает сохранение, повторяем', e && e.message || e);
    schedule(Math.min(RETRY_MAX_MS, RETRY_MS * Math.pow(2, fails - 1)));
    notify();
  }
  function queue(v) {
    var wasBig = last != null && last.length > CLOUD_MAX;
    last = v;
    if (v.length > CLOUD_MAX) {
      pending = null; clearTimeout(pushTimer); pushTimer = null;
      if (!wasBig) console.warn('[vk] сохранение длиннее', CLOUD_MAX, 'знаков — в облако ВК не уходит');
    } else {
      pending = v;
      schedule(PUSH_MS);
    }
    notify();
  }
  // Сбросить ждущую ревизию сейчас (сворачивание, возврат сети или вкладки), не дожидаясь паузы.
  function flush() { if (pending != null && !inflight) push(); }

  var storage = {
    get: function (k) {
      if (local) return localStorage.getItem(k);
      return k in mem ? mem[k] : null;
    },
    set: function (k, v) {
      if (broken) throw new Error('storage unavailable');
      if (vk && k === SAVE_KEY) queue(v);
      if (local) { localStorage.setItem(k, v); return; }
      mem[k] = v;
      if (!(vk && cloudOk && k === SAVE_KEY)) throw new Error('storage not persistent');
    },
  };

  // Готовность среды: в web — сразу; в ВК — инициализация и чтение облачной копии.
  var ready = !vk ? Promise.resolve({ cloud: null }) : send('VKWebAppInit').then(function () {
    return send('VKWebAppStorageGet', { keys: [CLOUD_KEY] }).then(function (r) {
      cloudOk = true;
      var kv = (r && r.keys || []).filter(function (x) { return x.key === CLOUD_KEY; })[0];
      confirmed = kv && kv.value ? kv.value : null;
      if (pending != null) schedule(PUSH_MS);
      notify();
      return { cloud: confirmed };
    });
  }).catch(function () { return { cloud: null }; });

  if (vk) {
    if (root.addEventListener) root.addEventListener('online', flush);
    var doc = root.document;
    if (doc && doc.addEventListener) doc.addEventListener('visibilitychange', function () { if (!doc.hidden) flush(); });
  }

  // Приложение ВК свёрнуто / снова на экране: f(false) на VKWebAppViewHide, f(true) на VKWebAppViewRestore.
  function onView(f) {
    if (!vk || typeof bridge.subscribe !== 'function') return;
    bridge.subscribe(function (e) {
      var t = e && e.detail && e.detail.type;
      if (t === 'VKWebAppViewHide') f(false);
      else if (t === 'VKWebAppViewRestore') f(true);
    });
  }

  /* Ролик за награду (VKWebAppShowNativeAds, ad_format reward) — только по нажатию игрока, только в ВК.
     Образец — game2-fork1/src/platform.js. → {ok, reason}: watched | busy | unavailable | timeout | skipped.
     - проверка (CheckNativeAds) ждёт AD_CHECK_MS; опоздавший ответ отбрасывается, показ после него не начинается;
     - показ ждёт AD_SHOW_MS с запасом на длинный ролик. «Досмотрен» после срока — onLate() ровно один раз;
     - второй вызов, пока идёт первый, — сразу busy: двойной награды не бывает.
     Сроки можно сократить для автотестов (window.G1F_AD_MS = {check, show}). */
  var AD_CHECK_MS = 8000, AD_SHOW_MS = 120000;
  var adActive = false;
  function showRewarded(onLate) {
    if (!vk) return Promise.resolve({ ok: false, reason: 'unavailable' });
    if (adActive) return Promise.resolve({ ok: false, reason: 'busy' });
    adActive = true;
    var ms = root.G1F_AD_MS || {};
    return new Promise(function (resolve) {
      var settled = false;
      var timer = setTimeout(function () { finish(false, 'unavailable'); }, ms.check || AD_CHECK_MS);
      function finish(ok, reason) {
        if (settled) return false;
        settled = true;
        adActive = false;
        clearTimeout(timer);
        resolve({ ok: ok, reason: reason });
        return true;
      }
      function call(method) {
        try { return Promise.resolve(bridge.send(method, { ad_format: 'reward' })); } catch (e) { return Promise.reject(e); }
      }
      call('VKWebAppCheckNativeAds').then(function (c) {
        if (settled) return;
        if (!c || !c.result) { finish(false, 'unavailable'); return; }
        clearTimeout(timer);
        timer = setTimeout(function () { finish(false, 'timeout'); }, ms.show || AD_SHOW_MS);
        call('VKWebAppShowNativeAds').then(function (d) {
          var ok = !!(d && d.result);
          if (!finish(ok, ok ? 'watched' : 'skipped') && ok && onLate) onLate();
        }, function () { finish(false, 'skipped'); });
      }, function () { finish(false, 'unavailable'); });
    });
  }

  // Скопировать текст (адрес поддержки): в ВК — VKWebAppCopyText, в браузере — буфер обмена. → Promise
  function copyText(text) {
    try {
      if (vk) return Promise.resolve(bridge.send('VKWebAppCopyText', { text: text }));
      if (root.navigator && navigator.clipboard) return navigator.clipboard.writeText(text);
    } catch (e) { return Promise.reject(e); }
    return Promise.reject(new Error('no clipboard'));
  }

  root.Platform = {
    name: vk ? 'vk' : 'web',
    storage: storage,
    // Переживёт ли прогресс закрытие вкладки: есть устройство или ВК ещё не отказал.
    get persistent() { var s = sync(); return s !== 'none' && (local || s !== 'failed'); },
    get cloud() { return sync() === 'cloud'; }, // копия в ВК подтверждена
    get sync() { return sync(); },
    onSync: function (f) { syncListeners.push(f); },
    ready: ready,
    flush: flush,
    onView: onView,
    canAds: vk,
    showRewarded: showRewarded,
    copyText: copyText,
    params: params,
    dev: dev,
  };
})(this);
