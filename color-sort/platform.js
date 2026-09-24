/* ============================================================
   platform.js — ЕДИНСТВЕННАЯ точка контакта с платформой.
   Переиспускается из игры в игру (стандарт студии).
   Методы сверены с живой документацией Яндекса 2026-06-21
   (журнал студии); подтверждены на платформе в филворде и
   нонограммах.

   Вне платформы (локальная разработка) SDK нет — все методы
   тихо деградируют в mock, игра остаётся живой.
   ============================================================ */
const Platform = (() => {
  let ysdk = null;
  let player = null;

  /* ---------- Инициализация ---------- */
  async function init() {
    if (typeof YaGames === 'undefined') {
      console.warn('[platform] SDK не найден — dev-режим (mock)');
      return false;
    }
    try {
      ysdk = await YaGames.init();
      console.log('[platform] SDK инициализирован');
      return true;
    } catch (e) {
      console.error('[platform] Ошибка init SDK:', e);
      return false;
    }
  }

  /* ---------- Game Ready (обязательно, п.1.19.2) ---------- */
  function gameReady() {
    if (ysdk && ysdk.features && ysdk.features.LoadingAPI) {
      ysdk.features.LoadingAPI.ready();
      console.log('[platform] Game Ready отправлен');
    }
  }

  /* ---------- Язык (п.2.14) ---------- */
  function getLang() {
    if (ysdk && ysdk.environment && ysdk.environment.i18n) {
      return ysdk.environment.i18n.lang || 'ru';
    }
    return (navigator.language || 'ru').slice(0, 2);
  }

  /* ---------- Сохранение (п.1.9 / 1.13.3) ----------
     Гостевой прогресс хранится платформой — логин не нужен.
     Лимит setData = 100 / 5 мин → сохраняем по событию.
     ВАЖНО (стандарт студии): объект сейва пишется ВСЕГДА
     ЦЕЛИКОМ со всеми полями. Частичная запись затирает
     остальные поля. */
  async function getPlayerObj() {
    if (!ysdk) return null;
    if (!player) {
      try {
        player = await ysdk.getPlayer({ scopes: false });
      } catch (e) {
        console.error('[platform] getPlayer ошибка:', e);
      }
    }
    return player;
  }

  async function save(fullState) {
    const p = await getPlayerObj();
    if (!p) {
      console.warn('[platform] dev-режим: сейв пропущен', fullState);
      return;
    }
    try {
      await p.setData(fullState, true);
    } catch (e) {
      console.error('[platform] setData ошибка:', e);
    }
  }

  async function load() {
    const p = await getPlayerObj();
    if (!p) return null;
    try {
      return await p.getData();
    } catch (e) {
      console.error('[platform] getData ошибка:', e);
      return null;
    }
  }

  /* ---------- Реклама (п.4.4 / 4.5 / 4.7) ----------
     Пауза звука/геймплея — через колбэки onPause/onResume,
     их подключит main (в Фазе 6 вместе со звуком). */
  function showInterstitial(onPause, onResume) {
    if (!ysdk) { console.warn('[platform] dev: interstitial пропущен'); if (onResume) onResume(); return; }
    ysdk.adv.showFullscreenAdv({
      callbacks: {
        onOpen: () => { if (onPause) onPause(); },
        onClose: (wasShown) => { if (onResume) onResume(wasShown); },
        onError: (e) => { console.error('[platform] interstitial:', e); if (onResume) onResume(false); }
      }
    });
  }

  function showRewarded(onRewarded, onPause, onResume) {
    if (!ysdk) { console.warn('[platform] dev: rewarded → награда выдана'); if (onRewarded) onRewarded(); if (onResume) onResume(); return; }
    let rewarded = false;
    ysdk.adv.showRewardedVideo({
      callbacks: {
        onOpen: () => { if (onPause) onPause(); },
        onRewarded: () => { rewarded = true; },
        onClose: () => {
          if (onResume) onResume();
          if (rewarded && onRewarded) onRewarded(); // видимый эффект — после закрытия
        },
        onError: (e) => { console.error('[platform] rewarded:', e); if (onResume) onResume(); }
      }
    });
  }

  return { init, gameReady, getLang, save, load, showInterstitial, showRewarded };
})();
