/* Площадка (P0): только то, что нужно, чтобы игра честно открылась в iframe ВК.
   - Внутри ВК (в адресе есть vk_app_id/sign) подгружается vk-bridge и
     отправляется VKWebAppInit. Никаких покупок, рекламы, друзей и уведомлений
     в P0 нет (ТЗ 01 §4: первые 10 минут без окон).
   - app_id старой game2 не используется: свой app_id выдаёт основатель,
     до тех пор сборка проверяется на стенде как обычная страница.
   - Сейв — только localStorage этого источника; серверный сейв — P1 (T06). */
window.Platform = (function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var inVk = params.has('vk_app_id') && params.has('sign');
  var bridge = null;

  function init() {
    if (!inVk) return;
    var s = document.createElement('script');
    s.src = 'src/vendor/vk-bridge.min.js';
    s.onload = function () {
      bridge = window.vkBridge || null;
      // isEmbedded() — до send(): вне клиента ВК промис send() не завершается (урок game2).
      if (bridge && (!bridge.isEmbedded || bridge.isEmbedded())) {
        bridge.send('VKWebAppInit').catch(function () { /* вне клиента ВК */ });
      }
    };
    document.head.appendChild(s);
  }

  return {
    init: init,
    name: inVk ? 'vk' : 'web',
    journal: params.has('journal'),
    reducedMotionQuery: window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  };
})();
