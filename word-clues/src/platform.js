/* Граница среды (ТЗ §13.1): остальной код о площадке не знает.
   web — стенд и браузер: localStorage, при его отказе — память вкладки с честным флагом.
   vk  — мини-приложение ВК (vkBridge.isEmbedded()): VKWebAppInit, сохранение дублируется
   в облако ВК (VKWebAppStorage, ключ g1f1_save) — в iframe ВК, особенно на iOS, localStorage
   бывает недоступен или чистится. Чтение облака асинхронное: Platform.ready отдаёт его
   строку, игра берёт более свежую из двух копий (State.adopt). Журнал событий — только локально.
   ?nostore — проверка A20: хранилище «ломается», игра должна честно об этом сказать. */
(function (root) {
  'use strict';
  var params = new URLSearchParams(location.search);
  var mem = {};
  var broken = params.has('nostore');
  var SAVE_KEY = 'g1f1.save.v1';   // ключ State в localStorage
  var CLOUD_KEY = 'g1f1_save';     // в облаке ВК точки в ключе запрещены
  var CLOUD_MAX = 4000;            // ВК: значение до 4096 знаков
  var INIT_MS = 2500, GET_MS = 3000, PUSH_MS = 800;

  var bridge = root.vkBridge;
  var vk = false;
  try { vk = !!(bridge && bridge.isEmbedded && bridge.isEmbedded()); } catch (e) { vk = false; }

  function lsOk() {
    if (broken) return false;
    try { localStorage.setItem('g1f1.probe', '1'); localStorage.removeItem('g1f1.probe'); return true; }
    catch (e) { return false; }
  }
  var local = lsOk();
  var cloudOk = false;
  var pushTimer = null, pushValue = null;

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

  function push() {
    pushTimer = null;
    if (!cloudOk || pushValue == null) return;
    var v = pushValue; pushValue = null;
    if (v.length > CLOUD_MAX) { if (root.G1F_DEBUG) console.warn('[vk] сохранение длиннее', CLOUD_MAX); return; }
    send('VKWebAppStorageSet', { key: CLOUD_KEY, value: v }).catch(function () { /* следующая запись повторит */ });
  }
  function flush() { if (pushTimer) { clearTimeout(pushTimer); push(); } }

  var storage = {
    get: function (k) {
      if (local) return localStorage.getItem(k);
      return k in mem ? mem[k] : null;
    },
    set: function (k, v) {
      if (broken) throw new Error('storage unavailable');
      if (vk && k === SAVE_KEY) { pushValue = v; if (!pushTimer) pushTimer = setTimeout(push, PUSH_MS); }
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
      return { cloud: kv && kv.value ? kv.value : null };
    });
  }).catch(function () { return { cloud: null }; });

  function onHide(f) {
    if (!vk || typeof bridge.subscribe !== 'function') return;
    bridge.subscribe(function (e) { if (e && e.detail && e.detail.type === 'VKWebAppViewHide') f(); });
  }

  /* Поделиться открыткой-загадкой: ВК — окно записи на стене, иначе системное «Поделиться»,
     иначе копия в буфер. Отдаёт способ ('vk' | 'native' | 'copy') или null, если не вышло/отменили. */
  function share(text) {
    var url = location.origin + location.pathname;
    if (vk) {
      try {
        return bridge.send('VKWebAppShowWallPostBox', { message: text })
          .then(function () { return 'vk'; }, function () { return null; });
      } catch (e) { return Promise.resolve(null); }
    }
    if (navigator.share) {
      return navigator.share({ text: text, url: url }).then(function () { return 'native'; }, function () { return null; });
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text + ' ' + url).then(function () { return 'copy'; }, function () { return null; });
    }
    return Promise.resolve(null);
  }

  root.Platform = {
    name: vk ? 'vk' : 'web',
    storage: storage,
    get persistent() { return !broken && (local || (vk && cloudOk)); },
    get cloud() { return vk && cloudOk; },
    ready: ready,
    flush: flush,
    onHide: onHide,
    share: share,
    params: params,
  };
})(this);
