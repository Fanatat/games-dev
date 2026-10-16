/* Облако: сейв и журнал покупок на сервере «Дома картинок» (server/app.py).
   Работает только внутри ВК и только если сборка знает адрес API
   (<meta name="hop-api">, tools/build.py --api). Иначе enabled = false и игра
   живёт на localStorage, как на стенде.
   Каждый запрос подписан строкой запуска ВК (X-Launch-Params): сервер
   проверяет sign и узнаёт игрока. Сеть или сервер недоступны — ответ null,
   игра продолжает без облака и попробует позже. */
window.HopCloud = (function () {
  'use strict';

  var meta = document.querySelector('meta[name="hop-api"]');
  var base = ((meta && meta.getAttribute('content')) || '').replace(/\/+$/, '');
  var launch = location.search.replace(/^\?/, '');
  var enabled = !!base && window.Platform && Platform.name === 'vk' && /^https:\/\//.test(base);

  function req(method, path, body, keepalive) {
    if (!enabled) return Promise.resolve(null);
    var opts = { method: method, headers: { 'X-Launch-Params': launch }, cache: 'no-store', credentials: 'omit' };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
      if (keepalive) opts.keepalive = true;
    }
    return fetch(base + path, opts).then(function (r) {
      return r.json().then(function (data) { return { status: r.status, data: data }; },
        function () { return { status: r.status, data: null }; });
    }).catch(function () { return null; });
  }

  // → { rev, save } | null
  function load() {
    return req('GET', '/v1/save').then(function (r) {
      return r && r.status === 200 && r.data ? { rev: r.data.rev | 0, save: r.data.save || null } : null;
    });
  }

  // → { ok: true, rev } | { conflict: true, rev, save } | null
  function push(save, rev, keepalive) {
    return req('POST', '/v1/save', { rev: rev, save: save }, keepalive).then(function (r) {
      if (!r || !r.data) return null;
      if (r.status === 200) return { ok: true, rev: r.data.rev | 0 };
      if (r.status === 409) return { conflict: true, rev: r.data.rev | 0, save: r.data.save || null };
      return null;
    });
  }

  // Журнал покупок после номера after, все страницы (до 10). → [строки] | null
  function purchases(after) {
    var out = [];
    function page(from, left) {
      return req('GET', '/v1/purchases?after=' + encodeURIComponent(String(from))).then(function (r) {
        if (!r || r.status !== 200 || !r.data || !Array.isArray(r.data.purchases)) return out.length ? out : null;
        out = out.concat(r.data.purchases);
        var last = out.length ? out[out.length - 1].id : from;
        return r.data.more && left > 1 ? page(last, left - 1) : out;
      });
    }
    return page(after || 0, 10);
  }

  // Отметка «игра выдала» — только статистика сервера.
  function confirm(ids) {
    if (!ids.length) return Promise.resolve(null);
    return req('POST', '/v1/purchases/confirm', { ids: ids.slice(0, 100) });
  }

  return { enabled: enabled, load: load, push: push, purchases: purchases, confirm: confirm };
})();
