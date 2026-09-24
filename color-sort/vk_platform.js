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
  const BUILD = 'b51-35da64a-20260924';

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

  /* ---------- Виброотклик (ТЗ №22, B4) ----------
     Методы — «Документация к играм на VK.txt», раздел «Виброотклик»:
     VKWebAppTapticImpactOccurred / NotificationOccurred /
     SelectionChanged. Огонь-и-забыть: на вебе и старых клиентах мост
     отвечает ошибкой — глотаем её молча, игра от вибрации не зависит.
     kind — общий словарь обоих адаптеров: select/pour/lock/invalid/win. */
  const HAPTIC_VK = {
    select:  ['VKWebAppTapticSelectionChanged', {}],
    pour:    ['VKWebAppTapticImpactOccurred', { style: 'light' }],
    lock:    ['VKWebAppTapticImpactOccurred', { style: 'medium' }],
    invalid: ['VKWebAppTapticNotificationOccurred', { type: 'warning' }],
    win:     ['VKWebAppTapticNotificationOccurred', { type: 'success' }],
  };
  function haptic(kind) {
    if (!ready || typeof vkBridge === 'undefined') return;
    const call = HAPTIC_VK[kind];
    if (!call) return;
    try {
      const p = vkBridge.send(call[0], call[1]);
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) { /* клиент без поддержки — молчим */ }
  }

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
    } catch (e) {
      console.error('[vk_platform] VKWebAppInit не ответил/ошибка:', e);
      return false;
    }
    // Кнопка подсказки НЕ прячется здесь: VKWebAppCheckNativeAds
    // ненадёжен для превентивной проверки (см. журнал наверху, п.1) —
    // доступность рекламы обрабатывается реактивно, в showRewarded().
    try { showDesktopBanner(); } catch (e) { console.warn('[vk_platform] баннер:', e); }
    return true;
  }

  /* ---------- Баннер на ПК (ТЗ №24, R-13 — решение основателя) ----------
     Только десктопный сайт ВК (vk_platform=desktop_*). Дока:
     dev.vk.com/ru/bridge/VKWebAppShowBannerAd и
     dev.vk.com/ru/games/monetization/ad/banners (сверено 2026-09-24).

     Место под баннер отдаёт ПЛОЩАДКА (layout_type:'resize' — «экран игры
     станет меньше на размер баннера»), игра себя не сдвигает и отступов
     не добавляет. Сборка b50 брала overlay/right/vertical и ужимала body
     сама: по доке это карточка в правом нижнем углу поверх игры, и живой
     заход основателя показал сдвинутую игру и карточку, а не колонку во
     всю высоту (тот же итог, что у Нонограмм, ТЗ №10–11).

     Водопад, первый успешный шаг побеждает:
       1. resize + orientation:'vertical' — вертикальный баннер, под
          который площадка ужимает окно. В доке этот набор показан для
          горизонтального телефона («баннер справа»); для ПК живьём не
          подтверждён — Нонограммы (ТЗ №53) на resize баннера не
          получили. Решает живой заход.
       2. banner_location:'bottom' — документированная для ПК полоса во
          всю ширину снизу (тоже resize).
     Отказ обоих — баннера нет, игра как была.

     Диагностика: дословный ответ Bridge и сдвиг окна пишутся в консоль,
     а с #banner в адресе (vk.com/appN#banner) — ещё и в плашку сборки. */
  const BANNER_STEPS = [
    { name: 'resize-vertical', params: { banner_location: 'bottom', layout_type: 'resize', orientation: 'vertical' } },
    { name: 'bottom', params: { banner_location: 'bottom' } },
  ];
  const BANNER_SETTLE_MS = 600;

  function isDesktopWeb() {
    try {
      return /^desktop/.test(new URLSearchParams(location.search).get('vk_platform') || '');
    } catch (e) { return false; }
  }

  function setBannerStatus(text) {
    console.log('[vk_platform] баннер:', text);
    try {
      if (!/banner/.test(location.hash)) return;
      const badge = document.getElementById('build-badge');
      if (!badge) return;
      badge.textContent = BUILD + ' · ' + text;
      badge.classList.remove('hidden');
    } catch (e) { /* диагностика не должна ломать игру */ }
  }

  function describeBanner(step, info, before) {
    const dw = before.w - window.innerWidth;
    const dh = before.h - window.innerHeight;
    return step.name + ' ' + (info.layout_type || '?') + ' ' +
      info.banner_width + '×' + info.banner_height + ' окно −' + dw + '×−' + dh;
  }

  function showDesktopBanner() {
    if (!isDesktopWeb()) return;
    if (typeof vkBridge.subscribe === 'function') vkBridge.subscribe((e) => {
      const type = e && e.detail && e.detail.type;
      if (type === 'VKWebAppBannerAdUpdated' || type === 'VKWebAppBannerAdClosedByUser') {
        console.log('[vk_platform] баннер, событие', type, JSON.stringify(e.detail.data));
      }
    });
    tryBannerStep(0);
  }

  function tryBannerStep(i) {
    const step = BANNER_STEPS[i];
    if (!step) { setBannerStatus('нет баннера'); return; }
    const before = { w: window.innerWidth, h: window.innerHeight };
    withTimeout(vkBridge.send('VKWebAppShowBannerAd', step.params), INTERSTITIAL_TIMEOUT_MS).then((info) => {
      console.log('[vk_platform] баннер ' + step.name + ', ответ:', JSON.stringify(info));
      if (!info || info.result === false) { tryBannerStep(i + 1); return; }
      // Площадка ужимает окно не мгновенно — сдвиг меряем после паузы.
      setTimeout(() => setBannerStatus(describeBanner(step, info, before)), BANNER_SETTLE_MS);
    }).catch((e) => {
      console.warn('[vk_platform] баннер ' + step.name + ' отклонён:', e);
      tryBannerStep(i + 1);
    });
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
    withTimeout(
      vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' }),
      INTERSTITIAL_TIMEOUT_MS
    )
      .then(() => { if (onResume) onResume(true); })
      .catch((e) => {
        console.error('[vk_platform] interstitial:', e);
        if (onResume) onResume(false);
      });
  }

  /* Награда — при штатном .then() (ролик реально досмотрен) И при
     .catch()/таймауте (реклама не показалась, ошибка, или мост
     потерял сообщение о закрытии — известная нестабильность на части
     мобильных клиентов, см. журнал наверху). По студийному стандарту
     недоступная реклама выдаёт награду бесплатно — тупика для игрока
     здесь нет ни в одном исходе. finish() — единая точка выхода,
     settled защищает от двойного вызова (штатный ответ ПОСЛЕ того,
     как уже сработал таймаут-предохранитель). */
  function showRewarded(onRewarded, onPause, onResume) {
    // Debug-оверлей (?debug=1, main.js) — см. журнал наверху, п. основателя
    // 2026-09-06. typeof-гейт: main.js объявляет window.__debugLog ТОЛЬКО
    // при активном флаге, адаптер не должен падать в обычной сборке.
    const dbg = (typeof window !== 'undefined' && window.__debugLog) || null;
    if (dbg) dbg('[rewarded] клик получен, ready=' + ready);
    if (!ready) {
      console.warn('[vk_platform] dev: rewarded → награда выдана');
      if (dbg) dbg('[rewarded] ready=false (dev-режим/нет моста) — награда сразу');
      if (onRewarded) onRewarded();
      if (onResume) onResume();
      return;
    }
    if (onPause) onPause();
    let settled = false;
    const sendStartedAt = performance.now();
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
    const finish = (grantReward, reason) => {
      if (settled) return;
      settled = true;
      if (waitProgressTimer) clearInterval(waitProgressTimer);
      // Видимый эффект — строго после onResume(), как в platform.js.
      if (onResume) onResume();
      console.log('[vk_platform] rewarded завершён:', reason, '| награда:', grantReward);
      if (dbg) dbg('[rewarded] finish: ' + reason + ' | награда=' + grantReward);
      if (grantReward && onRewarded) {
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
      }
    };
    if (dbg) dbg('[rewarded] отправляю VKWebAppShowNativeAds(ad_format=reward, useWaterfall=true) в мост');
    withTimeout(
      // useWaterfall (баг основателя 2026-09-06, п.2: rewarded молчит на
      // мобильном ВК, PC/Яндекс ок): официальный параметр контракта —
      // разрешает площадке подставить interstitial-инвентарь, когда
      // настоящего rewarded-ролика нет в наличии, вместо немедленного
      // отказа/тишины (у ВК исторически заметно уже rewarded-инвентарь,
      // чем interstitial/баннерного — VKCOM/vk-bridge#243, тот же класс
      // жалобы). МИТИГАЦИЯ СИМПТОМА, не подтверждённая причина: живого
      // показа на реальном мобильном ВК-клиенте это НЕ доказывает — от
      // пустого мостового Promise (см. журнал наверху) страхует
      // ТОЛЬКО таймаут-предохранитель ниже.
      vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward', useWaterfall: true }),
      REWARD_AD_TIMEOUT_MS
    )
      .then(() => finish(true, 'ролик закрыт (resolve)'))
      .catch((e) => {
        // Различаем «площадка не ответила за N секунд» (НАШ withTimeout —
        // единственный источник Error с message 'timeout' в этой цепочке)
        // от «мост явно отказал» (родной reject vk-bridge — обычный
        // объект вида {error_type, error_data}, без .message) — вопрос,
        // который с телефона раньше нечем было различить (нет
        // chrome://inspect), теперь виден прямо на экране через ?debug=1.
        const isOwnTimeout = e && e.message === 'timeout';
        if (dbg) {
          dbg(isOwnTimeout
            ? `[rewarded] мост НЕ ОТВЕТИЛ за ${REWARD_AD_TIMEOUT_MS}мс — сработал таймаут-предохранитель`
            : '[rewarded] мост явно отказал: ' + JSON.stringify(e));
        }
        console.warn('[vk_platform] rewarded недоступна/зависла — выдаём подсказку бесплатно:', e);
        finish(true, isOwnTimeout ? 'таймаут — выдано бесплатно' : 'явный отказ моста — выдано бесплатно');
      });
  }

  return { init, gameReady, getLang, save, load, showInterstitial, showRewarded, SHOP_SUPPORTED, SAVE_SIZE_GUARD_BYTES, BUILD, now, haptic };
})();
