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
  var RETRY_MS = 2000, RETRY_MAX_MS = 60000; // повтор отказа: 2, 4, 8 … ≤ 60 с
  var FAIL_AFTER = 3;                         // столько отказов подряд — «не удалось сохранить в ВК»

  var bridge = root.vkBridge;
  var vk = false;
  try { vk = !!(bridge && bridge.isEmbedded && bridge.isEmbedded()); } catch (e) { vk = false; }

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

  function onHide(f) {
    if (!vk || typeof bridge.subscribe !== 'function') return;
    bridge.subscribe(function (e) { if (e && e.detail && e.detail.type === 'VKWebAppViewHide') f(); });
  }

  /* Поделиться открыткой-загадкой: ВК — окно записи на стене, иначе системное «Поделиться»,
     иначе копия в буфер. Отдаёт способ ('vk' | 'native' | 'copy') или null, если не вышло/отменили. */
  /* Поделиться (оценка эксперта №7, п. 25: уходил только текст). image — функция, отдающая data:image/png карточки:
     в ВК на телефоне — история с картинкой (VKWebAppShowStoryBox), не вышло или компьютер — запись на стене текстом;
     в браузере — системное «Поделиться» с файлом, если умеет, иначе текстом, иначе копия в буфер. */
  function dataFile(png) {
    try {
      var bin = atob(png.split(',')[1]), arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new File([arr], 'ulika-dnya.png', { type: 'image/png' });
    } catch (e) { return null; }
  }
  function wall(text) {
    try {
      return bridge.send('VKWebAppShowWallPostBox', { message: text })
        .then(function () { return 'vk'; }, function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }
  function share(text, image) {
    var url = location.origin + location.pathname;
    var png = null;
    if (image) { try { png = image(); } catch (e) { png = null; } }
    if (vk) {
      var mobile = /^mobile_/.test(params.get('vk_platform') || '');
      if (png && mobile) {
        var box = { background_type: 'image', blob: png };
        if (params.get('vk_app_id')) box.attachment = { text: 'go_to', type: 'url', url: 'https://vk.com/app' + params.get('vk_app_id') };
        try {
          return bridge.send('VKWebAppShowStoryBox', box).then(function () { return 'vk_story'; }, function () { return wall(text); });
        } catch (e) { return wall(text); }
      }
      return wall(text);
    }
    var file = png && navigator.share && navigator.canShare ? dataFile(png) : null;
    if (file && navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], text: text + ' ' + url }).then(function () { return 'native_image'; }, function () { return null; });
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
    // Переживёт ли прогресс закрытие вкладки: есть устройство или ВК ещё не отказал.
    get persistent() { var s = sync(); return s !== 'none' && (local || s !== 'failed'); },
    get cloud() { return sync() === 'cloud'; }, // копия в ВК подтверждена
    get sync() { return sync(); },
    onSync: function (f) { syncListeners.push(f); },
    ready: ready,
    flush: flush,
    onHide: onHide,
    share: share,
    params: params,
  };
})(this);
