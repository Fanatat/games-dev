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
        if (bridge) bridge.send('VKWebAppInit').catch(function () { /* вне клиента ВК */ });
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

  // → true, если ролик досмотрен.
  function showRewarded() {
    return send('VKWebAppCheckNativeAds', { ad_format: 'reward' }).then(function (c) {
      if (!c || !c.result) return false;
      return send('VKWebAppShowNativeAds', { ad_format: 'reward' }).then(function (d) { return !!(d && d.result); });
    }).catch(function () { return false; });
  }

  // Закладка ВК и согласие на уведомления — только по нажатию игрока. → true при согласии.
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
    addFavorite: function () { return ask('VKWebAppAddToFavorites'); },
    allowNotify: function () { return ask('VKWebAppAllowNotifications'); },
    // уже в избранном / уведомления уже разрешены (параметры запуска ВК)
    isFavorite: params.get('vk_is_favorite') === '1',
    notifyOn: params.get('vk_are_notifications_enabled') === '1',
    journal: params.has('journal'),
    dayShift: parseInt(params.get('day') || '0', 10) || 0,
    reducedMotionQuery: window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  };
})();
