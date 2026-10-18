/* ============================================================
   vk_platform.js — адаптер ВК Bridge под контракт platform.js.
   Публичный интерфейс БАЙТ-В-БАЙТ идентичен platform.js (те же 7
   методов, те же имена и сигнатуры: init, gameReady, getLang, save,
   load, showInterstitial, showRewarded) — main.js/game.js не знают,
   какая платформа под капотом, ни одной правки в общем коде не
   требуется.

   Источник методов ВК Bridge — сверено с исходниками пакета
   @vkontakte/vk-bridge@3.0.2 (packages/core/src/types/data.ts,
   README пакета; репозиторий VKCOM/vk-bridge на GitHub), НЕ по
   памяти. dev.vk.com напрямую из этой сети недоступен (как и
   Cloudflare Pages — см. стандарты студии), сверка велась через
   npm-пакет и его исходный код.

   Вне ВК-клиента (локальная разработка) vkBridge нет — все методы
   тихо деградируют в mock, игра остаётся живой (тот же принцип,
   что в platform.js).

   РЕШЕНИЕ 2026-07-18 (живой тест основателя нашёл 2 дефекта, оба
   починены здесь):
   1. Кнопка подсказки (#btn-hint) БОЛЬШЕ НЕ прячется превентивно.
      Раньше init() дергал VKWebAppCheckNativeAds и прятал кнопку при
      false/таймауте — на ПК это ложно срабатывало (кнопки не было
      вообще), при этом реклама на ПК реально работала. Метод
      VKWebAppCheckNativeAds исторически нестабилен (баг-репорты
      VKCOM/vk-bridge) — доверять ему для превентивного скрытия
      нельзя. Раз монетизация будет подключена — кнопка теперь ВСЕГДА
      видима на всех точках входа (WebView/Web-iframe/m.vk.com),
      недоступность рекламы обрабатывается РЕАКТИВНО, в момент клика,
      внутри showRewarded() (см. ниже) — не заранее.
   2. showRewarded(): официальный контракт VKWebAppShowNativeAds не
      даёт отдельного сигнала «досмотрено» — только один Promise на
      весь показ (resolve/reject после закрытия, см. типы пакета).
      Это и есть штатное поведение, менять нечего — но на реальном
      мобильном WebView встречается известная нестабильность моста:
      сообщение о закрытии рекламы иногда не долетает обратно в JS,
      пока нативный оверлей рекламы перекрывал WebView (Promise висит
      вечно, ни .then ни .catch). Раньше это оставляло игрока в
      тупике: ролик отыгран, а onRewarded() не вызывался никогда.
      Чиним ДВУМЯ мерами: (а) щедрый таймаут-предохранитель на сам
      показ — если мост завис, всё равно не блокируем игрока вечно;
      (б) по студийному стандарту — недоступная/сорвавшаяся реклама
      выдаёт награду БЕСПЛАТНО, а не оставляет тупик. Итог: подсказка
      выдаётся и при штатном .then() (ролик реально досмотрен), и при
      .catch()/таймауте (мост сглючил или рекламы не было) — тупика
      не остаётся ни в одном сценарии.

   РЕШЕНИЕ 2026-07-18 (продолжение — второй живой тест основателя):
   на ПК подсказка после рекламы видна, на телефоне — ролик закрыт
   штатно, Promise резолвится нормально, но подсветка не появляется.
   Дело НЕ в rewarded-потоке (он уже чинился выше) — дело в ТАЙМИНГЕ
   вызова onRewarded() относительно фактического возврата экрана.
   Board.showHint(from, to) (board.js, общий код — не трогаем) берёт
   t0 = performance.now() СИНХРОННО в момент вызова и отсчитывает
   2200мс РЕАЛЬНОГО времени через requestAnimationFrame. На мобильном
   WebView нативный рекламный оверлей может приостанавливать rAF, пока
   висит поверх страницы; onRewarded() у нас срабатывал СРАЗУ по
   resolve Promise — то есть в тот момент, когда оверлей ТОЛЬКО
   начинает закрываться, а не когда экран уже реально виден. Если
   первый кадр анимации добирается до rAF с опозданием (пока rAF был
   на паузе), t0 давно в прошлом — на первом же реальном кадре t уже
   ≥ 1, и showHint() гасит подсказку, ПОКАЗАВ её ноль раз. На ПК
   нативного оверлея нет, rAF не приостанавливается — поэтому там
   всё видно. Чиним ТОЛЬКО в адаптере: перед вызовом onRewarded()
   ждём подтверждённой видимости страницы (+ пару кадров сверху, чтобы
   рендер-цикл гарантированно ожил) и на всякий случай форсируем
   Board.resize() — если WebView успел поменять размеры (адресная
   строка/safe-area) пока был перекрыт рекламой, подсказка не должна
   рисоваться по устаревшим координатам. Board.resize() — уже
   ПУБЛИЧНЫЙ метод board.js (тот же, что дёргается на window resize/
   orientationchange), просто вызываем его из адаптера — код board.js
   не редактируется. ТРЕБУЕТ ПОДТВЕРЖДЕНИЯ ЖИВЫМ ТЕСТОМ НА ТЕЛЕФОНЕ —
   в песочнице (Playwright) нет способа сымитировать нативный
   рекламный оверлей ВК и его влияние на visibilitychange/rAF, только
   логика и синтетические сценарии проверены здесь.
   ============================================================ */
const Platform = (() => {
  const SAVE_KEY = 'colorsort_save';
  /* Таймаут init подобран под ЖЕЛЕЗНОЕ правило студии: «платформа не
     отвечает» → меню за ≤3 с. Замер живого прогона: при 2500 мс меню
     появлялось за ~3060 мс (загрузка+парс бандла ~560 мс поверх
     таймаута) — впритык ЗА границу. 2000 мс даёт меню за ~2.6 с с
     запасом на медленные устройства, оставаясь в рамках «2–3 с» из
     глобального стандарта. VKWebAppInit — локальное рукопожатие с
     родительским фреймом (обычно <500 мс), поэтому 2000 мс не грозит
     ложным таймаутом на реальном, но медленном соединении ВК. */
  const INIT_TIMEOUT_MS = 2000;
  /* Предохранитель показа rewarded-рекламы — НЕ обычный путь, а
     страховка от зависшего моста (см. журнал выше, п.2). Ролики ВК
     обычно 15–30 с; 40 с — щедрый запас поверх этого плюс время на
     сам показ/закрытие, чтобы не обрубить ЗАКОННО идущий длинный
     ролик, но и не держать игрока в паузе вечно, если мост потерял
     сообщение о закрытии. */
  const REWARD_AD_TIMEOUT_MS = 40000;
  /* Страховка ожидания видимости после закрытия рекламного оверлея
     (см. журнал выше, второе решение). НЕ про сам показ рекламы —
     это отдельная, короткая пауза ПОСЛЕ того, как Promise уже
     разрешился, на случай если document.visibilitychange по какой-то
     причине не придёт (не все нативные оверлеи гарантированно её
     шлют) — тогда просто продолжаем, не блокируя награду вечно. */
  const VISIBILITY_WAIT_TIMEOUT_MS = 3000;
  /* Предохранитель VKWebAppStorageGet/Set — баг основателя 2026-09-07:
     живой лог с реального Android подтвердил, что мост может молчать
     МИНУТАМИ на VKWebAppShowNativeAds (см. журнал у showRewarded) без
     единого события — ни успеха, ни ошибки. load()/save() звали мост
     БЕЗ withTimeout вовсе (в отличие от init()/showRewarded(), у
     которых предохранитель уже был) — тот же класс молчания на
     VKWebAppStorageGet в момент boot() (main.js) вешает игру на экране
     загрузки НАВСЕГДА, без кнопки «Повторить» — «бесконечная загрузка»,
     дважды пойманная основателем живьём (Color Sort b41 и, судя по
     тому же классу отчёта, Нонограммы v45 — то же самое отсутствие
     предохранителя, adapters/vk_bridge.js этой студии). 5с — щедрый
     запас над типичным откликом хранилища ВК (обычно <500мс), но
     конечный, в отличие от «навсегда». */
  const STORAGE_TIMEOUT_MS = 5000;
  /* Предохранитель showInterstitial — тот же класс дыры, что был у
     load()/save() выше, найден по аналогии сессией Нонограмм в СВОЁМ
     коде (adapters/vk_bridge.js, тот же немой мост) и проверен здесь
     же: showInterstitial() звал VKWebAppShowNativeAds БЕЗ withTimeout
     вовсе. Не на пути загрузки (боевого зависания живьём не поймано),
     но при том же молчании моста подвесил бы переход между уровнями
     навсегда — onResume() не пришёл бы, экран остался бы затемнён
     паузой. Интерстишлы короче rewarded (обычно 5-15с, не 15-30с) —
     20с даёт запас над этим, оставаясь конечным. */
  const INTERSTITIAL_TIMEOUT_MS = 20000;

  /* ---------- SHOP_SUPPORTED (ТЗ VK_remove_shop, задача A) ----------
     ЕДИНСТВЕННЫЙ флаг, которым main.js решает, показывать ли витрину/
     косметику (тот же контракт, что и в platform.js). Платежи на ВК не
     подключены и не будут до появления сервера с белым IP и доменом
     (решение Р6) — false. Возврат витрины в будущем = смена этой одной
     константы, код магазина/тем в main.js не удаляется, просто не
     запускается. */
  const SHOP_SUPPORTED = false;

  /* ---------- Сторож объёма сейва (ТЗ №14, этап 3, добор) ----------
     3500 байт — тот же временный студийный бюджет, что уже в бою на
     нонограммах (adapters/vk_bridge.js, VK_SAVE_SIZE_GUARD_BYTES) — НЕ
     подтверждённое требование ВК дословно, консервативный запас под
     реальный лимит VKWebAppStorageSet. main.js замеряет реальный JSON
     перед КАЖДОЙ записью (persist()), не полагается на расчёт «влезет». */
  const SAVE_SIZE_GUARD_BYTES = 3500;

  /* ---------- Плашка номера билда (ТЗ №14, добор — починка 22.08.2026)
     ----------
     Плейсхолдер на диске — build.py подставляет реальное значение
     ('vk-b<счётчик>-<git-хэш>-<дата>') ТОЛЬКО в копию, летящую в
     dist/colorsort_vk/ (тот же приём точечной замены байт, что у
     __YANDEX_BUILD__ в platform.js — исходник на диске не трогается).
     Локальный запуск без сборки покажет плейсхолдер как есть — это
     нормально, значит билд не собирался через build.py. main.js
     (updateBuildBadge) уже читает Platform.BUILD через typeof-гейт —
     раньше на ВК этого поля не было вовсе (undefined, не строка),
     плашка молчала всегда независимо от сборки; main.js трогать не
     нужно, правка живёт ТОЛЬКО здесь и в build.py. */
  const BUILD = 'b66-f8422ad-20261005';

  /* ---------- Единая точка времени (ТЗ №18) ----------
     Симметрично platform.js (Яндекс) — см. комментарий там же. Оба
     адаптера несут ОДИНАКОВЫЙ now(), тракт энергии (main.js/
     retention.js) вызывает Platform.now() платформо-агностично, не
     зная, какой адаптер подключён. */
  let _devTimeWarned = false;
  function now() {
    if (typeof window !== 'undefined' && window.DEV_TIME_OVERRIDE_ENABLED === true
        && typeof window.__devNowMs === 'number') {
      if (!_devTimeWarned) {
        console.warn('[vk_platform] Platform.now() подменено dev_time_override.js:', new Date(window.__devNowMs).toISOString());
        _devTimeWarned = true;
      }
      return window.__devNowMs;
    }
    return Date.now();
  }

  let ready = false; // true только после успешного VKWebAppInit

  function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), ms);
      promise.then(
        (v) => { clearTimeout(timer); resolve(v); },
        (e) => { clearTimeout(timer); reject(e); }
      );
    });
  }

  /* Ждём, пока страница ГАРАНТИРОВАННО видима, и добавляем два тика
     requestAnimationFrame сверху — не просто дождаться флага
     document.visibilityState, а дать рендер-циклу реально возобновить
     работу (флаг может смениться на кадр раньше, чем rAF снова начнёт
     тикать регулярно). Нужно ТОЛЬКО чтобы Board.showHint() (общий
     код) стартовал свой 2200мс wall-clock пульс уже на видимом,
     свежеотрисованном экране — см. журнал наверху. */
  function waitVisibleAndSettled() {
    return new Promise((resolve) => {
      let done = false;
      const finishWait = () => {
        if (done) return;
        done = true;
        document.removeEventListener('visibilitychange', onVisible);
        clearTimeout(fallbackTimer);
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      };
      const onVisible = () => {
        if (document.visibilityState === 'visible') finishWait();
      };
      const fallbackTimer = setTimeout(finishWait, VISIBILITY_WAIT_TIMEOUT_MS);
      if (document.visibilityState === 'visible') {
        finishWait();
      } else {
        document.addEventListener('visibilitychange', onVisible);
      }
    });
  }

  /* ---------- Инициализация ----------
     Обязательный таймаут (шрам Словохода b7): вне ВК-клиента
     VKWebAppInit не отвечает — без таймаута игра вечно висит на
     загрузке БЕЗ ошибок в консоли. При таймауте/ошибке — dev-режим,
     игра обязана дойти до меню. */
  async function init() {
    if (typeof vkBridge === 'undefined') {
      console.warn('[vk_platform] Bridge не найден — dev-режим (mock)');
      return false;
    }
    try {
      await withTimeout(vkBridge.send('VKWebAppInit'), INIT_TIMEOUT_MS);
      ready = true;
      console.log('[vk_platform] VK Bridge инициализирован');
      fetchClientVersion();   // 05.10: версия приложения ВК — в диагностику показа
    } catch (e) {
      console.error('[vk_platform] VKWebAppInit не ответил/ошибка:', e);
      return false;
    }
    // Кнопка подсказки НЕ прячется здесь: VKWebAppCheckNativeAds
    // ненадёжен для превентивной проверки (см. журнал наверху, п.1) —
    // доступность рекламы обрабатывается реактивно, в showRewarded().
    try { armMobileBanner(); } catch (e) { console.warn('[vk_platform] баннер:', e); }
    // Предзагрузка рекламы — в фоне, init её НЕ ждёт (см. preloadAds).
    preloadAds('reward');
    preloadAds('interstitial');
    return true;
  }

  /* ---------- Предзагрузка рекламы ----------
     Как в game1 (b53, где та же жалоба «первое нажатие — ничего, после
     нескольких открывается реклама» ушла именно с этим). Документация ВК
     («Реклама в играх → Необходимые события»): без предзагрузки
     VKWebAppShowNativeAds сначала ЗАГРУЖАЕТ материалы и только потом
     показывает; «проверка необходима для показа рекламы за вознаграждение»;
     загрузка может не удаться при плохой сети — вызывать
     VKWebAppCheckNativeAds по таймеру. Здесь вызов был убран целиком (он
     прятал кнопку подсказки — это правильно не возвращать), а вместе с ним
     пропала и предзагрузка: на телефоне ролик за подсказку не успевал или
     не начинался вовсе.
     Теперь: fire-and-forget после init и после каждого показа своего
     формата. Ничего не ждёт и ни на что не влияет (кнопка видна всегда,
     награда — только по result:true при показе). Ответ «материалов нет»/
     ошибка/молчание — повтор через PRELOAD_RETRY_MS, не больше
     PRELOAD_RETRIES раз подряд.

     05.10 (жалоба основателя: в приложении ВК на телефоне реклама за
     подсказку «грузится — отключите блокировщик», баннер при этом
     работает; как в game1 b56): проверки идут СТРОГО ПО ОДНОЙ и не во
     время показа. Раньше reward и interstitial уходили одновременно, а
     после показа проверка шла, пока мог висеть повтор. У Android-клиента
     ВК известна потеря ответов на одинаковые параллельные запросы
     (VKCOM/vk-bridge#615) и «повторный CheckNativeAds так и висит» (#201).
     Мост промолчал — следующая проверка не раньше PRELOAD_RETRY_MS, чтобы
     не множить зависшие запросы. */
  const PRELOAD_TIMEOUT_MS = 8000;
  const PRELOAD_RETRY_MS = 30000;
  const PRELOAD_RETRIES = 5;
  const preloadState = {};   // формат → { queued, tries, timer, last }
  const checkQueue = [];     // форматы в очереди на CheckNativeAds
  let checkBusy = false;     // CheckNativeAds в полёте
  let checkHold = null;      // пауза очереди после молчания моста
  let showsInFlight = 0;     // ShowNativeAds в полёте — проверки ждут
  function bgTimer(fn, ms) {
    const t = setTimeout(fn, ms);
    if (t && typeof t.unref === 'function') t.unref();   // Node-тесты не должны висеть на повторе
    return t;
  }
  function preloadAds(fmt) {
    if (!ready || typeof vkBridge === 'undefined') return;
    const st = preloadState[fmt] || (preloadState[fmt] = { queued: false, tries: 0, timer: null, last: '' });
    if (st.timer) { clearTimeout(st.timer); st.timer = null; }
    if (st.queued) return;
    st.queued = true;
    checkQueue.push(fmt);
    pumpChecks();
  }
  function pumpChecks() {
    if (checkBusy || checkHold || showsInFlight > 0 || !checkQueue.length) return;
    const fmt = checkQueue.shift();
    const st = preloadState[fmt];
    st.queued = false;
    checkBusy = true;
    let done = false;
    const end = (okNow, why, last) => {
      if (done) return;
      done = true;
      clearTimeout(guard);
      checkBusy = false;
      st.last = last;   // для диагностики показа (adDiag)
      if (okNow) {
        st.tries = 0;
      } else if (st.tries >= PRELOAD_RETRIES) {
        console.warn('[vk_platform] предзагрузка ' + fmt + ': ' + why + ' — повторы исчерпаны, ролик загрузится при показе');
      } else {
        st.tries++;
        st.timer = bgTimer(() => { st.timer = null; preloadAds(fmt); }, PRELOAD_RETRY_MS);
      }
      if (last === 'silent') {
        checkHold = bgTimer(() => { checkHold = null; pumpChecks(); }, PRELOAD_RETRY_MS);
      } else {
        pumpChecks();
      }
    };
    const guard = bgTimer(() => end(false, 'мост молчит', 'silent'), PRELOAD_TIMEOUT_MS);
    let p;
    try { p = vkBridge.send('VKWebAppCheckNativeAds', { ad_format: fmt }); } catch (e) { p = Promise.reject(e); }
    Promise.resolve(p).then(
      (res) => { const ok = !!(res && res.result === true); end(ok, 'материалов пока нет', ok ? 'ok' : 'empty'); },
      (e) => { console.warn('[vk_platform] предзагрузка ' + fmt + ' — ошибка моста:', e); end(false, 'ошибка', 'err' + bridgeErr(e).short); }
    );
  }
  /* Показ занимает канал — проверки ждут ответа моста о показе. Сторож
     показа (REWARD_AD_TIMEOUT_MS) канал НЕ освобождает: на телефоне ролик
     с финальным экраном идёт дольше 40 с (game1 b53), и проверка ушла бы
     поверх идущего показа. Мост не ответил совсем — канал освободится
     через SHOW_HOLD_MAX_MS. Возвращает release(): срабатывает ровно один раз. */
  const SHOW_HOLD_MAX_MS = 120000;
  function holdChecksForShow() {
    showsInFlight++;
    let held = true;
    const release = () => {
      if (!held) return;
      held = false;
      clearTimeout(fallback);
      showsInFlight--;
      pumpChecks();
    };
    const fallback = bgTimer(release, SHOW_HOLD_MAX_MS);
    return release;
  }

  /* ---------- Диагностика показа рекламы (05.10) ----------
     Жалоба основателя: в мобильном приложении ВК реклама за подсказку
     «грузится, потом — отключите блокировщик», хотя блокировщика нет.
     Игроку и в Метрику уходило только слово 'error' — настоящий ответ
     моста (error_type / error_code / error_reason) видела лишь консоль, а
     на телефоне её не открыть. Теперь каждый неудачный показ несёт diag:
     что именно ответил мост, через сколько, чем кончилась предзагрузка и
     какая версия приложения ВК. main.js выводит короткую строку кода в
     уведомлении и шлёт ключ в rewarded_result.err. Формат — общий с
     game1 b56 и game2 v67. */
  let clientVer = '';   // 'android 8.12' — VKWebAppGetClientVersion, фоном после init
  function fetchClientVersion() {
    let p;
    try { p = vkBridge.send('VKWebAppGetClientVersion'); } catch (_) { return; }
    Promise.resolve(p).then((r) => {
      if (r && (r.platform || r.version)) clientVer = String(r.platform || '?') + ' ' + String(r.version || '?');
    }, () => {});
  }
  function launchPlatform() {
    try { return new URLSearchParams(location.search).get('vk_platform') || ''; } catch (_) { return ''; }
  }
  /* Отказ моста ВК: { error_type, error_data: { error_code, error_reason } };
     error_reason бывает строкой или объектом { error_msg }. */
  function bridgeErr(e) {
    let type = '', code = '', reason = '';
    if (e && typeof e === 'object') {
      if (e instanceof Error) reason = e.message;
      type = e.error_type ? String(e.error_type) : '';
      const d = (e.error_data && typeof e.error_data === 'object') ? e.error_data : e;
      if (d.error_code != null) code = String(d.error_code);
      let r = d.error_reason != null ? d.error_reason : (d.error_description || d.error_msg || '');
      if (r && typeof r === 'object') r = r.error_msg || r.error_description || JSON.stringify(r);
      if (r) reason = String(r);
    } else if (e != null) {
      reason = String(e);
    }
    reason = reason.replace(/\s+/g, ' ').trim().slice(0, 48);
    const short = (type ? ':' + type : '') + (code ? ':' + code : '');
    return { type, code, reason, short };
  }
  /* res: 'error' | 'no_result' (ответ без result:true) | 'timeout' |
     'unavailable' (моста нет). startedAt — Date.now() при отправке показа. */
  function adDiag(fmt, startedAt, res, err) {
    const sec = startedAt ? Math.round((Date.now() - startedAt) / 100) / 10 : 0;
    const pre = (preloadState[fmt] && preloadState[fmt].last) || 'none';
    const be = res === 'error' ? bridgeErr(err) : { type: '', code: '', reason: '', short: '' };
    // key — для Метрики: короткий и стабильный ('error:client_error:1', 'timeout', 'no_result')
    const key = res === 'error' ? 'error' + be.short : res;
    const what = res === 'error'
      ? ['ВК', be.type, be.code, be.reason ? '«' + be.reason + '»' : ''].filter(Boolean).join(' ')
      : (res === 'timeout' ? 'ВК молчит' : (res === 'no_result' ? 'ВК: result ≠ true' : 'нет моста ВК'));
    const plat = launchPlatform();
    const text = [what, startedAt ? sec + ' с' : '', ready ? 'пред. ' + pre : '', clientVer || plat].filter(Boolean).join(' · ');
    // app — нативное приложение ВК (не браузер): блокировщика там не бывает
    const app = /^(mobile_(android|iphone|ipad)|android_|iphone_|ipad_)/.test(plat);
    return { fmt, res, type: be.type, code: be.code, reason: be.reason, sec, pre, cv: clientVer, app, key, text };
  }

  /* ---------- Баннер снизу на телефоне в вертикали (ТЗ ads_rework
     2026-10-01, п.1 и правило 6) ----------
     Только мобильные клиенты ВК (vk_platform=mobile_*), только портрет:
     VKWebAppShowBannerAd {banner_location:'bottom'} (dev.vk.com, сверено
     по docs/площадки/vk/Баннерная реклама для VK.txt: «в нижней или
     верхней части экрана, не перекрывая игровой процесс»). В альбоме и на
     ПК баннер не показываем (ПК — решение основателя 2026-09-25, см.
     CHANGELOG ТЗ №24) и прячем при повороте. Правило 7: не до первого
     действия игрока — запуск по первому pointerdown.
     Место под баннер резервирует ЛИБО площадка, ЛИБО игра (урок b50/b51):
     если после показа окно само стало ниже — свой отступ не ставим, иначе
     ставим --vk-banner-reserve-bottom = banner_height (body.bottom,
     style.css) + safe-area. Закрыл игрок крестиком — до следующего запуска
     не переоткрываем. Ошибка/нет рекламы — баннера нет, игра как была. */
  const BANNER_FALLBACK_HEIGHT_PX = 60; // если высота не пришла в ответе
  const BANNER_SELF_RESIZE_PX = 30;     // порог «площадка сама ужала окно»
  const BANNER_SETTLE_MS = 600;
  let bannerWanted = false;     // портрет + мобильный + после первого тапа
  let bannerOn = false;
  let bannerClosedByUser = false;
  let bannerReservePx = 0;
  let platformResizedForBanner = false;
  let bannerBusy = false;
  /* Аудит 2026-10-05, F05: отказ показа не должен порождать цепочку
     повторов без задержки. После отказа/result:false/таймаута повторный
     показ запрещён, пока игрок не повернёт устройство (смена ориентации —
     явное событие жизненного цикла) и не более BANNER_MAX_FAILURES раз за
     сессию. Resize сам по себе (его шлёт и setBannerReserve) не снимает блок. */
  const BANNER_MAX_FAILURES = 3;
  let bannerFailures = 0;
  let bannerShowBlocked = false;

  function isMobileWeb() {
    try {
      return /^mobile/.test(new URLSearchParams(location.search).get('vk_platform') || '');
    } catch (e) { return false; }
  }
  function isPortrait() {
    return window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : window.innerHeight >= window.innerWidth;
  }

  function setBannerReserve(px) {
    const next = Math.max(0, Math.round(px) || 0);
    if (next === bannerReservePx) return;
    bannerReservePx = next;
    document.documentElement.style.setProperty('--vk-banner-reserve-bottom', next + 'px');
    // Поле и частицы меряют себя по resize окна — высота body сменилась
    // без него, поэтому сообщаем сами.
    window.dispatchEvent(new Event('resize'));
  }

  function applyBannerInfo(info) {
    if (platformResizedForBanner) return;
    if (!info || info.result === false) { setBannerReserve(0); return; }
    const h = Number(info.banner_height);
    setBannerReserve(h > 0 ? h : BANNER_FALLBACK_HEIGHT_PX);
  }

  function bannerShowFailed() {
    bannerFailures++;
    bannerShowBlocked = true;
  }

  function syncBanner() {
    if (bannerBusy) return;
    // Повернули в альбом — блок снимается: следующий портрет — новая попытка.
    if (!isPortrait() && bannerFailures < BANNER_MAX_FAILURES) bannerShowBlocked = false;
    const want = bannerWanted && !bannerClosedByUser && isPortrait()
      && !(bannerShowBlocked || bannerFailures >= BANNER_MAX_FAILURES);
    if (want === bannerOn) return;
    bannerBusy = true;
    if (want) {
      const heightBefore = window.innerHeight;
      withTimeout(vkBridge.send('VKWebAppShowBannerAd', { banner_location: 'bottom' }), INTERSTITIAL_TIMEOUT_MS)
        .then((info) => {
          console.log('[vk_platform] баннер показан:', JSON.stringify(info));
          if (info && info.result === false) { bannerShowFailed(); return; }
          bannerOn = true;
          applyBannerInfo(info);
          setTimeout(() => {
            if (heightBefore - window.innerHeight >= BANNER_SELF_RESIZE_PX) {
              platformResizedForBanner = true;
              setBannerReserve(0);
              console.log('[vk_platform] баннер: площадка сама ужала окно, свой отступ снят');
            }
          }, BANNER_SETTLE_MS);
        })
        .catch((e) => { bannerShowFailed(); console.warn('[vk_platform] баннер недоступен:', e); })
        .then(() => { bannerBusy = false; syncBanner(); });
    } else {
      withTimeout(vkBridge.send('VKWebAppHideBannerAd', {}), INTERSTITIAL_TIMEOUT_MS)
        .catch((e) => { console.warn('[vk_platform] баннер: скрыть не удалось:', e); })
        .then(() => {
          bannerOn = false;
          platformResizedForBanner = false;
          setBannerReserve(0);
          bannerBusy = false;
          syncBanner();
        });
    }
  }

  function armMobileBanner() {
    if (!isMobileWeb()) return;
    if (typeof vkBridge.subscribe === 'function') vkBridge.subscribe((e) => {
      const type = e && e.detail && e.detail.type;
      if (type === 'VKWebAppBannerAdUpdated') applyBannerInfo(e.detail.data);
      if (type === 'VKWebAppBannerAdClosedByUser') { bannerClosedByUser = true; bannerOn = false; setBannerReserve(0); }
    });
    const onFirstAction = () => {
      document.removeEventListener('pointerdown', onFirstAction, true);
      bannerWanted = true;
      syncBanner();
    };
    document.addEventListener('pointerdown', onFirstAction, true);
    const rotate = () => syncBanner();
    window.addEventListener('orientationchange', rotate);
    window.addEventListener('resize', rotate);
  }

  /* ---------- Game Ready ----------
     У ВК нет аналога LoadingAPI.ready() — метод-заглушка, чтобы
     main.js вызывал Platform.gameReady() без ветвления по площадке. */
  function gameReady() {}

  /* ---------- Язык ----------
     ВК-билд лочится на русский (вариант A, решение постановки):
     аудитория ВК русскоязычная, карточка игры тоже на русском —
     англ. браузер не должен расходиться с карточкой. */
  function getLang() {
    return 'ru';
  }

  /* ---------- Сохранение ----------
     VKWebAppStorageSet/Get, ключ colorsort_save. ВАЖНО (стандарт
     студии): объект сейва пишется ВСЕГДА ЦЕЛИКОМ — сюда прилетает
     уже готовый fullState из main.js, адаптер его не трогает,
     только сериализует.

     Обёртка {ok, data, error} (ТЗ unify_repo, фаза 4 — найдено живым
     прогоном): main.js (boot()/retryLoadInBackground()) читает
     loadResult.ok безусловно — этот контракт появился на platform.js
     (Яндекс) в ТЗ №2 Фаза 3 позже, чем vk_platform.js в последний раз
     правился, и адаптер остался на старом bare-value/null контракте.
     vk_platform.js не собирался и не запускался как часть main.js до
     unify_repo — расхождение не всплывало. Без этой обёртки
     Platform.load() возвращает null, `loadResult.ok` бросает
     TypeError, boot() падает целиком — игра зависает на экране
     загрузки. Семантика — та же, что в platform.js: ok:true+data:null
     — легитимно пусто (dev-режим/первый запуск), ok:false — вызов не
     удался. */
  async function save(fullState) {
    if (!ready) {
      console.warn('[vk_platform] dev-режим: сейв пропущен', fullState);
      return { ok: true, error: null };
    }
    try {
      await withTimeout(vkBridge.send('VKWebAppStorageSet', {
        key: SAVE_KEY,
        value: JSON.stringify(fullState)
      }), STORAGE_TIMEOUT_MS);
      return { ok: true, error: null };
    } catch (e) {
      console.error('[vk_platform] VKWebAppStorageSet ошибка:', e);
      return { ok: false, error: e };
    }
  }

  async function load() {
    if (!ready) return { ok: true, data: null, error: null };
    const dbg = (typeof window !== 'undefined' && window.__debugLog) || null;
    if (dbg) dbg('[load] отправляю VKWebAppStorageGet в мост');
    try {
      const res = await withTimeout(vkBridge.send('VKWebAppStorageGet', { keys: [SAVE_KEY] }), STORAGE_TIMEOUT_MS);
      if (dbg) dbg('[load] мост ответил');
      const entry = res.keys.find((k) => k.key === SAVE_KEY);
      // Пустая строка — штатный ответ ВК для отсутствующего ключа
      // (первый запуск, не битый сейв) — не пытаемся её парсить.
      if (!entry || !entry.value) return { ok: true, data: null, error: null };
      return { ok: true, data: JSON.parse(entry.value), error: null };
    } catch (e) {
      if (dbg) dbg('[load] ' + (e && e.message === 'timeout' ? `мост НЕ ОТВЕТИЛ за ${STORAGE_TIMEOUT_MS}мс` : 'ошибка: ' + JSON.stringify(e)));
      console.error('[vk_platform] VKWebAppStorageGet/парсинг ошибка:', e);
      return { ok: false, data: null, error: e };
    }
  }

  /* ---------- Реклама ----------
     В отличие от Яндекс SDK, ВК Bridge не даёт отдельного события
     «показ открылся» — один Promise на весь показ (resolve/reject
     после закрытия). onPause вызываем синхронно перед send() —
     функционально то же самое (пауза звука/геймплея перед роликом,
     снятие паузы после), просто без промежуточного колбэка от ВК.

     onBeforeShow (ТЗ shop_gate_and_ads, задача B — найдено сверкой
     контракта, п.2.1/2.2): 3-й необязательный параметр, ЕСТЬ в
     platform.js (Яндекс, ТЗ №1 задача C — onBeforeShow вызывается ПЕРВОЙ
     инструкцией функции, до проверки SDK, см. platform.js), но раньше
     ЗДЕСЬ отсутствовал в сигнатуре — расхождение с собственным
     заявлением файла в шапке («сигнатуры БАЙТ-В-БАЙТ идентичны»).
     main.js передаёт его на ОБЕИХ площадках одинаково (goToNextLevel →
     advDiagMarkCall); функционально не критично — единственный
     потребитель, dev_advdiag.js, DEV-ONLY и вырезается build.py из
     ЛЮБОЙ сборки (Яндекс и ВК), поэтому отсутствие параметра раньше не
     ломало ничего игроку видимого — но контракт обязан совпадать
     буквально, чинится здесь. */
  function showInterstitial(onPause, onResume, onBeforeShow) {
    if (onBeforeShow) onBeforeShow();
    if (!ready) {
      console.warn('[vk_platform] dev: interstitial пропущен');
      if (onResume) onResume();
      return;
    }
    if (onPause) onPause();
    const releaseChecks = holdChecksForShow();   // 05.10: проверки ждут ответа о показе
    const shown = sendAd({ ad_format: 'interstitial' });
    // Следующий ролик — заранее, когда мост ответил про этот (не по сторожу:
    // показ мог ещё идти).
    const afterShow = () => { releaseChecks(); preloadAds('interstitial'); };
    Promise.resolve(shown).then(afterShow, afterShow);
    withTimeout(shown, INTERSTITIAL_TIMEOUT_MS)
      .then(() => { if (onResume) onResume(true); })
      .catch((e) => {
        console.error('[vk_platform] interstitial:', e);
        if (onResume) onResume(false);
      });
  }

  /* Показ рекламы. Синхронный throw моста (ТЗ №26, ревью: onPause уже
     вызван, а onResume не пришёл бы никогда — звук стоял бы до
     перезагрузки) превращаем в отказ Promise: дальше он идёт штатным
     .catch() — onResume, а у rewarded ещё и бесплатная награда. send
     зовём сразу, в том же такте: клиенту ВК может быть нужен жест. */
  function sendAd(params) {
    try {
      return vkBridge.send('VKWebAppShowNativeAds', params);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /* Награда — ТОЛЬКО если мост вернул {result:true} (реклама реально
     показана; ТЗ ads_rework 2026-10-01, правила 1–2). Отказ моста
     (adblock/нет рекламы), {result:false}, пустой ответ, зависший мост
     (таймаут-предохранитель) и отсутствие моста — награды НЕТ: исход
     уходит в onResume(outcome), main.js показывает игроку уведомление.
     Раньше (студийный стандарт «недоступная реклама не тупик») все эти
     исходы выдавали награду бесплатно — это и была дыра «adblock →
     подсказки бесконечно». outcome: 'shown' | 'error' | 'timeout' |
     'unavailable' (нет моста) | 'dev' (только DEV_FREE_REWARD из
     dev_flags.js, которого нет в сборках площадок и стенда). finish() —
     единая точка выхода, settled защищает от двойного вызова (штатный
     ответ ПОСЛЕ того, как уже сработал таймаут-предохранитель). */
  function devFreeReward() {
    return typeof DEV_FREE_REWARD !== 'undefined' && DEV_FREE_REWARD === true;
  }

  function showRewarded(onRewarded, onPause, onResume) {
    // Debug-оверлей (?debug=1, main.js) — см. журнал наверху, п. основателя
    // 2026-09-06. typeof-гейт: main.js объявляет window.__debugLog ТОЛЬКО
    // при активном флаге, адаптер не должен падать в обычной сборке.
    const dbg = (typeof window !== 'undefined' && window.__debugLog) || null;
    if (dbg) dbg('[rewarded] клик получен, ready=' + ready);
    if (!ready) {
      if (devFreeReward()) {
        console.warn('[vk_platform] dev: rewarded → награда выдана (DEV_FREE_REWARD)');
        if (onResume) onResume('dev');
        if (onRewarded) onRewarded();
        return;
      }
      console.warn('[vk_platform] rewarded: моста нет — награды нет');
      if (dbg) dbg('[rewarded] ready=false (нет моста) — награды нет');
      if (onResume) onResume('unavailable', adDiag('reward', 0, 'unavailable'));
      return;
    }
    if (onPause) onPause();
    let settled = false;
    const sendStartedAt = performance.now();
    const startedAt = Date.now();   // 05.10: секунды до ответа — в diag
    const releaseChecks = holdChecksForShow();   // 05.10: проверки ждут ответа о показе
    // Строка раз в 10с, пока ждём мост (баг основателя 2026-09-07: живой
    // лог с Android показал тишину >10с и, самое важное, что основатель
    // ЗАКРЫЛ игру раньше срабатывания 40-секундного предохранителя —
    // без промежуточных отметок непонятно, сколько ещё ждать, человек
    // решает, что игра зависла, и уходит ДО того, как код успевает
    // самостоятельно восстановиться). Формат согласован с сессией
    // Нонограмм — тот же класс бага, общий вид строки для основателя.
    const waitProgressTimer = dbg ? setInterval(() => {
      dbg(`[rewarded] жду ответа моста: ${Math.round((performance.now() - sendStartedAt) / 1000)}с/${REWARD_AD_TIMEOUT_MS / 1000}с`);
    }, 10000) : null;
    // outcome — исход для аналитики (ТЗ №25): 'shown' | 'error' | 'timeout'.
    // Аудит 2026-10-05, F04: сторож (таймаут) снимает зависшую паузу, но НЕ
    // отнимает право на награду: если мост всё же вернёт {result:true} позже,
    // награда выдаётся — ровно один раз (rewardGranted), без второго onResume.
    let rewardGranted = false;
    const grantNow = () => {
      if (rewardGranted) return;
      rewardGranted = true;
      if (!onRewarded) return;
      // На мобильном ВК onRewarded() (внутри — Board.showHint(), общий
      // код) не должен стартовать, пока экран ещё реально перекрыт
      // рекламным оверлеем — см. журнал наверху. Ждём подтверждённой
      // видимости, форсируем пересчёт лэйаута на случай смены
      // размеров вьюпорта за время рекламы, и только потом отдаём
      // награду вызывающей стороне. Два лога раздельно (решение vs.
      // фактический показ) — на живом устройстве через remote-debug
      // будет видно, если когда-нибудь разъедутся снова.
      const waitStartedAt = performance.now();
      waitVisibleAndSettled().then(() => {
        if (typeof Board !== 'undefined' && Board.resize) Board.resize();
        console.log('[vk_platform] rewarded: экран подтверждён видимым через', Math.round(performance.now() - waitStartedAt), 'мс — показываем подсказку');
        onRewarded();
      });
    };
    // 05.10: onResume(outcome, diag) — diag только у исходов без показа (adDiag).
    const finish = (grantReward, reason, outcome, diag) => {
      if (settled) return;
      settled = true;
      if (waitProgressTimer) clearInterval(waitProgressTimer);
      if (diag) console.warn('[vk_platform] rewarded не показана: ' + diag.text);
      // Видимый эффект — строго после onResume(), как в platform.js.
      if (onResume) onResume(outcome, diag);
      console.log('[vk_platform] rewarded завершён:', reason, '| награда:', grantReward);
      if (dbg) dbg('[rewarded] finish: ' + reason + ' | награда=' + grantReward + (diag ? ' | ' + diag.text : ''));
      if (grantReward) grantNow();
    };
    if (dbg) dbg('[rewarded] отправляю VKWebAppShowNativeAds(ad_format=reward) в мост');
    // useWaterfall убран 05.10. Его добавили 2026-09-06 «митигацией
    // симптома» (rewarded молчит на мобильном ВК) — но мост ВК такого
    // ключа не читает: у VKWebAppShowNativeAds параметр называется
    // use_waterfall (snake_case) и по умолчанию уже true (@vkontakte/
    // vk-bridge 3.0.2, packages/core/src/types/data.ts). Запрос — только
    // ad_format, как в game1.
    const adPromise = sendAd({ ad_format: 'reward' });
    // Следующий ролик — заранее, когда мост ответил про этот (как в game1);
    // до ответа проверки стоят (holdChecksForShow).
    const afterShow = () => { releaseChecks(); preloadAds('reward'); };
    Promise.resolve(adPromise).then(afterShow, afterShow);
    const timeoutTimer = setTimeout(() => {
      if (dbg) dbg(`[rewarded] мост НЕ ОТВЕТИЛ за ${REWARD_AD_TIMEOUT_MS}мс — сработал таймаут-предохранитель`);
      console.warn('[vk_platform] rewarded зависла — награды пока нет, ждём позднего ответа:', REWARD_AD_TIMEOUT_MS);
      finish(false, 'таймаут — награды нет', 'timeout', adDiag('reward', startedAt, 'timeout'));
    }, REWARD_AD_TIMEOUT_MS);
    adPromise.then(
      (data) => {
        clearTimeout(timeoutTimer);
        // Контракт ВК: {result:true} — реклама показана, {result:false} —
        // «ошибка при показе». Любой другой ответ — не доказательство показа.
        if (data && data.result === true) {
          if (settled) {
            // Поздний успех после сторожа: пауза уже снята, награду выдаём.
            console.log('[vk_platform] rewarded: поздний result:true после таймаута — выдаём награду один раз');
            if (dbg) dbg('[rewarded] поздний result:true — награда выдана');
            grantNow();
          } else {
            finish(true, 'ролик закрыт (result:true)', 'shown');
          }
        } else {
          finish(false, 'мост ответил без result:true — награды нет: ' + JSON.stringify(data), 'error',
            adDiag('reward', startedAt, 'no_result'));
        }
      },
      (e) => {
        clearTimeout(timeoutTimer);
        // Родной reject vk-bridge — обычный объект вида {error_type,
        // error_data}; таймаут теперь — наш отдельный таймер выше.
        if (dbg) dbg('[rewarded] мост явно отказал: ' + JSON.stringify(e));
        console.warn('[vk_platform] rewarded недоступна — награды нет:', e);
        finish(false, 'явный отказ моста — награды нет', 'error', adDiag('reward', startedAt, 'error', e));
      }
    );
  }

  return { init, gameReady, getLang, save, load, showInterstitial, showRewarded, SHOP_SUPPORTED, SAVE_SIZE_GUARD_BYTES, BUILD, now };
})();
