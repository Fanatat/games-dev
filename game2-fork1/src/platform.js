/* Площадка: ВК или обычная страница (стенд).
   - Внутри ВК (в адресе есть vk_app_id/sign) подгружается vk-bridge и
     отправляется VKWebAppInit. app_id игры — 54825891.
   - Покупки: VKWebAppShowOrderBox {type: 'item', item: sku}. Голоса списывает
     ВК, право на товар подтверждает наш сервер (колбэк платежей); клиент
     применяет заказ по order_id один раз (HopState.applyOrder).
   - Ролик за награду: только по нажатию игрока, VKWebAppShowNativeAds reward.
   - Вне ВК (стенд) покупки и ролики тестовые: canPay/canAds = false, игра
     показывает «тестовую покупку» без денег. */
window.Platform = (function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var inVk = params.has('vk_app_id') && params.has('sign');
  var bridge = null;
  var ready = null;

  function init() {
    if (!inVk) { ready = Promise.resolve(null); return ready; }
    ready = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = 'src/vendor/vk-bridge.min.js';
      s.onload = function () {
        bridge = window.vkBridge || null;
        // isEmbedded() — до send(): вне клиента ВК промис send() не завершается (урок game2).
        if (bridge && bridge.isEmbedded && !bridge.isEmbedded()) bridge = null;
        if (bridge) {
          // Свернули/вернули игру в клиенте ВК → событие hop-view {hidden} (звук, сейв).
          if (bridge.subscribe) bridge.subscribe(function (e) {
            var type = e && e.detail && e.detail.type;
            if (type === 'VKWebAppViewHide' || type === 'VKWebAppViewRestore') {
              window.dispatchEvent(new CustomEvent('hop-view', { detail: { hidden: type === 'VKWebAppViewHide' } }));
            }
          });
          bridge.send('VKWebAppInit').catch(function () { /* вне клиента ВК */ });
        }
        resolve(bridge);
      };
      s.onerror = function () { resolve(null); };
      document.head.appendChild(s);
    });
    return ready;
  }

  function send(method, data) {
    return (ready || Promise.resolve(null)).then(function (b) {
      if (!b) throw new Error('no_bridge');
      return b.send(method, data);
    });
  }

  // → { ok: true, order_id } | { ok: false, reason: 'cancel' | 'error' }
  function buy(sku) {
    return send('VKWebAppShowOrderBox', { type: 'item', item: sku }).then(function (d) {
      return d && d.success ? { ok: true, order_id: String(d.order_id) } : { ok: false, reason: 'cancel' };
    }, function (e) {
      var code = e && e.error_data && e.error_data.error_code;
      return { ok: false, reason: code === 4 ? 'cancel' : 'error' };
    });
  }

  /* Ролик за награду. → { ok, reason }: ok — досмотрен (reason 'watched');
     иначе reason 'unavailable' (ролика нет или проверка молчит), 'timeout'
     (показ не ответил), 'skipped' (закрыт или ошибка показа), 'busy' (уже идёт).
     Ожидание ограничено, у игрока всегда есть исход:
     - проверка (CheckNativeAds) — AD_CHECK_MS; опоздавший ответ проверки
       отбрасывается, показ после него не начинается — ролик не всплывёт
       внезапно, когда игрок уже ушёл;
     - показ (ShowNativeAds) — AD_SHOW_MS, с запасом на длинный ролик, чтобы не
       обрывать идущий показ. Если показ ответил «досмотрен» уже после этого
       срока, вызывается onLate() — ровно один раз на попытку (промис показа
       завершается один раз, а finish отделяет «вовремя» от «поздно»). Поздний
       успех засчитываем, а не выбрасываем: ролик реально досмотрен и
       засчитан площадкой, задержка ответа — не вина игрока. Двойной награды
       нет: вовремя → только resolve, поздно → только onLate; дневной лимит
       по-прежнему проверяет HopState.rewardedGrant. */
  var AD_CHECK_MS = 8000;
  var AD_SHOW_MS = 120000;
  var adActive = false;
  function showRewarded(onLate) {
    if (adActive) return Promise.resolve({ ok: false, reason: 'busy' });
    adActive = true;
    return new Promise(function (resolve) {
      var settled = false;
      var timer = setTimeout(function () { finish(false, 'unavailable'); }, AD_CHECK_MS);
      function finish(ok, reason) {
        if (settled) return false;
        settled = true;
        adActive = false;
        clearTimeout(timer);
        resolve({ ok: ok, reason: reason });
        return true;
      }
      send('VKWebAppCheckNativeAds', { ad_format: 'reward' }).then(function (c) {
        if (settled) return;
        if (!c || !c.result) { finish(false, 'unavailable'); return; }
        clearTimeout(timer);
        timer = setTimeout(function () { finish(false, 'timeout'); }, AD_SHOW_MS);
        send('VKWebAppShowNativeAds', { ad_format: 'reward' }).then(function (d) {
          var ok = !!(d && d.result);
          if (!finish(ok, ok ? 'watched' : 'skipped') && ok && onLate) onLate();
        }, function () { finish(false, 'skipped'); });
      }, function () { finish(false, 'unavailable'); });
    });
  }

  // Поделиться картинкой: в ВК — редактор истории; вне ВК — системное «Поделиться»
  // с файлом, а где его нет — скачивание. → 'vk' | 'share' | 'download' | 'cancel'.
  function download(dataUrl, name) {
    var a = document.createElement('a');
    a.href = dataUrl; a.download = name || 'picture.png';
    document.body.appendChild(a); a.click(); a.remove();
    return 'download';
  }
  function shareImage(dataUrl, name) {
    if (inVk) {
      return send('VKWebAppShowStoryBox', { background_type: 'image', blob: dataUrl }).then(function () { return 'vk'; }, function (e) {
        var code = e && e.error_data && e.error_data.error_code;
        return code === 4 ? 'cancel' : download(dataUrl, name);
      });
    }
    try {
      var bin = atob(dataUrl.split(',')[1]), arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      var file = new File([arr], name || 'picture.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file] }).then(function () { return 'share'; }, function () { return 'cancel'; });
      }
    } catch (e) { /* нет File или share — скачаем */ }
    return Promise.resolve(download(dataUrl, name));
  }

  // Закладка ВК — только по нажатию игрока. → true при согласии.
  function ask(method) {
    return send(method).then(function (d) { return !!(d && d.result); }).catch(function () { return false; });
  }

  return {
    init: init,
    name: inVk ? 'vk' : 'web',
    canPay: inVk,
    canAds: inVk,
    buy: buy,
    showRewarded: showRewarded,
    shareImage: shareImage,
    addFavorite: function () { return ask('VKWebAppAddToFavorites'); },
    // уже в избранном (параметры запуска ВК)
    isFavorite: params.get('vk_is_favorite') === '1',
    // Инструменты проверки (?journal, ?day=N) — только на стенде: в ВК сейв уходит в облако.
    journal: !inVk && params.has('journal'),
    dayShift: inVk ? 0 : parseInt(params.get('day') || '0', 10) || 0,
    reducedMotionQuery: window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  };
})();
