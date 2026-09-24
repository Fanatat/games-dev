/* ============================================================
   main.js — точка входа.
   Загрузка → init SDK → автоязык → восстановление сейва → меню →
   Game Ready. Игровой цикл (колбы/перелив/победа) — Фазы 1-3.
   Сохранение прогресса через platform.js — Фаза 4.
   Реклама (interstitial с кулдауном, rewarded-подсказка) — Фаза 5.
   Звук (sound.js) и полировка анимаций — Фаза 6.
   Конфетти (confetti.js) и усиленный «вау»-момент победы — точечная
   правка по решению основателя.
   ============================================================ */
(() => {
  /* ---------- Debug-оверлей rewarded-пути (?debug=1 ИЛИ тайный жест) ----------
     Баг основателя 2026-09-06: rewarded-реклама на мобильном ВК ведёт
     себя непрозрачно (молчит/зависает), а с телефона нет chrome://inspect,
     чтобы прочитать console.log вживую. Оверлей печатает ключевые
     события ПРЯМО НА ЭКРАНЕ. НЕ заменяет console.log — vk_platform.js/
     platform.js зовут ОБА: debugLog даёт основателю самому снять
     доказательство на СВОЁМ устройстве и прислать скриншот, без
     необходимости в USB-отладке.

     ПРАВКА 2026-09-07 (живой тест основателя): ?debug=1 в URL
     НЕДОСТИЖИМ внутри мобильного приложения ВК — игра открывается
     внутри самого приложения, адресной строки нет физически, дописать
     параметр некуда. Добавлен ВТОРОЙ путь включения — тайный жест:
     5 быстрых тапов по заголовку игры на главном экране (см. ниже).
     Обычный игрок не тапает заголовок 5 раз подряд за 2с — риск
     случайной активации пренебрежимо мал, а сам заголовок ни на что
     больше не реагирует (не кнопка), так что жест никого не запутает.
     Оба пути ведут к ОДНОЙ И ТОЙ ЖЕ функции (setDebugOverlayEnabled) —
     ?debug=1 остаётся для быстрой проверки с ПК/десктоп-ВК, жест — для
     мобильного приложения, где URL недоступен.

     window.__debugLog — типизированный экспорт для адаптеров платформы
     (typeof-гейт на вызывающей стороне, тот же приём, что devUnlockAll
     ниже) — адаптеры не должны падать, если оверлей выключен. */
  let DEBUG_OVERLAY_ENABLED = (() => {
    try { return new URLSearchParams(location.search).get('debug') === '1'; }
    catch (e) { return false; }
  })();
  let debugOverlayEl = null;
  function debugLog(msg) {
    if (!DEBUG_OVERLAY_ENABLED) return;
    console.log('[debug-overlay]', msg);
    if (!debugOverlayEl) {
      debugOverlayEl = document.createElement('div');
      debugOverlayEl.id = 'debug-overlay';
      Object.assign(debugOverlayEl.style, {
        position: 'fixed', left: '0', right: '0', bottom: '0', maxHeight: '42vh',
        overflowY: 'auto', background: 'rgba(0,0,0,0.86)', color: '#5fdc6a',
        font: '10px/1.35 monospace', padding: '4px 6px', zIndex: '99999',
        whiteSpace: 'pre-wrap', pointerEvents: 'none'
      });
      document.body.appendChild(debugOverlayEl);
    }
    const line = document.createElement('div');
    line.textContent = `[${(performance.now() / 1000).toFixed(2)}s] ${msg}`;
    debugOverlayEl.appendChild(line);
    debugOverlayEl.scrollTop = debugOverlayEl.scrollHeight;
  }
  function setDebugOverlayEnabled(enabled) {
    DEBUG_OVERLAY_ENABLED = enabled;
    if (enabled) {
      window.__debugLog = debugLog;
      debugLog('[debug] оверлей включён');
    } else {
      window.__debugLog = undefined;
      if (debugOverlayEl) { debugOverlayEl.remove(); debugOverlayEl = null; }
    }
  }
  if (DEBUG_OVERLAY_ENABLED) window.__debugLog = debugLog;

  /* Тайный жест включения — см. комментарий выше. Правка 2026-09-07,
     часть 2: раньше слушатель стоял ТОЛЬКО на .game-title (заголовок
     меню) — бесполезно ровно для диагностики «бесконечной загрузки»
     (баг основателя, п.5), потому что goToMenu() вызывается ПОСЛЕ
     Platform.load(): если load() виснет, меню (и .game-title) не
     появляется вообще, жест некуда применить именно тогда, когда он
     нужнее всего. Экран загрузки несёт СВОЙ, отдельный узел с тем же
     текстом (.loading-title, data-i18n="title") — уже в DOM на момент
     выполнения этого кода (main.js — синхронная часть, до async boot()/
     Platform.init()), поэтому вешаем жест на ВСЕ узлы с data-i18n="title"
     разом (сейчас их два: загрузка + меню) — работает даже если игра
     зависла на самом первом экране. */
  (() => {
    const titleEls = document.querySelectorAll('[data-i18n="title"]');
    if (!titleEls.length) return;
    let tapCount = 0;
    let tapResetTimer = null;
    const onTap = () => {
      tapCount++;
      clearTimeout(tapResetTimer);
      tapResetTimer = setTimeout(() => { tapCount = 0; }, 2000);
      if (tapCount >= 5) {
        tapCount = 0;
        clearTimeout(tapResetTimer);
        setDebugOverlayEnabled(!DEBUG_OVERLAY_ENABLED);
      }
    };
    titleEls.forEach((el) => el.addEventListener('click', onTap));
  })();

  const screens = {
    loading: document.getElementById('screen-loading'),
    menu:    document.getElementById('screen-menu'),
    grid:    document.getElementById('screen-grid'),
    shop:    document.getElementById('screen-shop'),
    oformlenie: document.getElementById('screen-oformlenie'), // ТЗ №17
    game:    document.getElementById('screen-game'),
    energyWall: document.getElementById('screen-energy-wall') // ТЗ №15, этап 1
  };

  /* DEV_UNLOCK_ALL — из dev_flags.js, который НЕ грузится в билде
     площадки (build.py вырезает и файл, и тег — см. CLAUDE.md
     «УПАКОВКА»). typeof-проверка: в проде переменной физически нет. */
  const devUnlockAll = typeof DEV_UNLOCK_ALL !== 'undefined' && DEV_UNLOCK_ALL === true;

  /* AdvDiag — из dev_advdiag.js (fix/yandex-adv-p44, п.4.3 ТЗ), который
     НЕ грузится в билде площадки (build.py вырезает файл и тег — см.
     WHITELIST/check_no_advdiag в build.py). typeof-проверка: в проде
     объекта физически нет, вызовы ниже становятся no-op. Сам объект
     молчит, если в URL нет ?advdiag=1 — см. dev_advdiag.js. */
  const advDiag = typeof AdvDiag !== 'undefined' ? AdvDiag : null;
  function advDiagMarkInput() { if (advDiag) advDiag.markInput(); }
  function advDiagMarkCall() { if (advDiag) advDiag.markCall(); }
  function advDiagMarkAdOpen() { if (advDiag) advDiag.markAdOpen(); }

  /* DEV_THEME_TOGGLE_ENABLED — из dev_theme_toggle.js (ТЗ №3, задача C3),
     который грузится ТОЛЬКО в diag-сборке (build.py). typeof-проверка —
     тот же приём, что у devUnlockAll/advDiag выше: в проде и на ВК
     переменной физически нет. Красная линия — см. dev_theme_toggle.js:
     только state.ownedThemes + persist(), платёжного API не касается. */
  const devThemeToggleEnabled = typeof DEV_THEME_TOGGLE_ENABLED !== 'undefined' && DEV_THEME_TOGGLE_ENABLED === true;

  /* DEV_PURCHASE_DIAG_ENABLED — из dev_purchase_diag.js (ТЗ №6, задача F),
     который грузится ТОЛЬКО в diag-сборке (build.py), рядом с
     dev_theme_toggle.js. typeof-гейт — тот же приём, что выше. Красная
     линия — см. dev_purchase_diag.js: подтверждение перед вызовом,
     purchaseToken на экран не выводится. */
  const devPurchaseDiagEnabled = typeof DEV_PURCHASE_DIAG_ENABLED !== 'undefined' && DEV_PURCHASE_DIAG_ENABLED === true;

  const btnPlay     = document.getElementById('btn-play');
  const btnLevels   = document.getElementById('btn-levels');
  const btnGridBack = document.getElementById('btn-grid-back');
  const levelGridEl = document.getElementById('level-grid');
  const btnBack     = document.getElementById('btn-back');
  const btnNext     = document.getElementById('btn-next');
  const btnHint     = document.getElementById('btn-hint');
  const soundBtns   = document.querySelectorAll('#btn-sound, #btn-sound-game');
  const boardCanvas = document.getElementById('board-canvas');
  const boardWrap   = document.getElementById('board-wrap');
  const gameHeader  = document.querySelector('#screen-game .game-header');
  const winOverlay  = document.getElementById('win-overlay');
  const winProgressFill  = document.getElementById('win-progress-fill');
  const winProgressLabel = document.getElementById('win-progress-label');
  const levelIndicator = document.getElementById('level-indicator');
  const hintToast   = document.getElementById('hint-toast');
  const hintLoadingToast = document.getElementById('hint-loading-toast');
  const confettiCanvas = document.getElementById('confetti-canvas');

  /* Экран завершения кампании (после последнего уровня) */
  const campaignOverlay  = document.getElementById('campaign-overlay');
  const btnCampaignMenu  = document.getElementById('btn-campaign-menu');
  const statTotalEl      = document.getElementById('stat-total');
  const statAverageEl    = document.getElementById('stat-average');
  const statFastestEl    = document.getElementById('stat-fastest');
  const statSlowestEl    = document.getElementById('stat-slowest');

  /* Экран завершения ГЛАВЫ (каждые CHAPTER_SIZE уровней, кроме
     последнего уровня массива — там срабатывает финал выше). Легче
     финального: короче конфетти, без фанфары — см. showChapterCompleteOverlay. */
  const CHAPTER_SIZE     = 12;
  const chapterOverlay      = document.getElementById('chapter-overlay');
  const btnChapterNext      = document.getElementById('btn-chapter-next');
  const chapterTitleEl      = document.getElementById('chapter-title');
  const chapterStatTotalEl   = document.getElementById('chapter-stat-total');
  const chapterStatAverageEl = document.getElementById('chapter-stat-average');
  const chapterStatFastestEl = document.getElementById('chapter-stat-fastest');
  const chapterStatSlowestEl = document.getElementById('chapter-stat-slowest');

  /* Сейв: ВСЕГДА полный объект (стандарт студии).
     levelTimes[i] — активное время (сек) на уровень i, пишется при
     победе (Stats.finishLevel, Вариант Б — см. stats.js).
     maxUnlocked — furthest реально пройденный/открытый уровень, ТОЛЬКО
     растёт; отдельно от levelIndex («где игрок сейчас/точка Продолжить»),
     потому что грид позволяет ЗАЙТИ на уже открытый уровень назад —
     если бы замок сетки читался из levelIndex, повторный проход
     раннего уровня откатил бы прогресс и снова запер бы всё дальше. */
  const state = {
    levelIndex: 0,
    onboardingSeen: false,
    muted: false,
    levelTimes: [],
    maxUnlocked: 0,
    // Магазин (ТЗ №2): ownedThemes — id-шники купленных косметических
    // тем ('sea'/'forest'/'berry'), НЕ включает 'default' (та всегда
    // доступна, часть базовой игры). selectedTheme — какая тема сейчас
    // ПРИМЕНЕНА (может отличаться от последней купленной — игрок волен
    // переключаться между уже купленными). Заменяет старое одиночное
    // themeOwned:boolean (миграция — см. boot()).
    ownedThemes: [],
    selectedTheme: 'default',
    // lastChosenTheme (ТЗ №7, задача B): последняя ОСОЗНАННО выбранная
    // игроком тема — пишется ТОЛЬКО из selectTheme() (клик «Применить»
    // в магазине / покупка), НИКОГДА при автоматическом откате
    // (reconcileOwnership на потере владения трогает selectedTheme
    // напрямую через applyTheme(), в обход selectTheme()). Нужна, чтобы
    // купленная тема не «отваливалась» визуально: если владение временно
    // не подтвердилось (ok:true с пустым ответом), а потом подтвердилось
    // вновь, applied-состояние возвращается сюда, а не остаётся на
    // 'default' до следующего ручного клика.
    lastChosenTheme: null,
    // Задача 11 (перенесено из feature/vk-resubmit — общая практика,
    // не привязана к площадке): суточный лимит показов rewarded, защита
    // от накрутки. rewardedDay — календарная дата ('YYYY-MM-DD',
    // ЛОКАЛЬНАЯ, не UTC) последнего засчитанного показа; rewardedCount
    // обнуляется, как только текущая дата отличается от rewardedDay —
    // см. checkRewardedDailyReset(). Добавляет ~20 байт к сейву, лимит
    // (~2236Б, см. память студии) не под угрозой.
    rewardedCount: 0,
    rewardedDay: '',
    // ТЗ №14, этап 2 (модуль удержания, retention.js, перенесён с
    // нонограмм). bonusHints — баланс бесплатных подсказок, начисляется
    // 2-м днём серии входов (RETENTION_CONFIG.callbacks.grantHints),
    // тратится ПЕРВЫМ в обработчике btnHint, до рекламы/суточного
    // лимита. giftedThemes — темы, подаренные модулем (СЕЙЧАС только
    // 'berry', награда 3-го дня серии) — ОТДЕЛЬНО от ownedThemes
    // (решение основателя 22.08): ownedThemes на Яндексе целиком
    // ЗАМЕЩАЕТСЯ ответом Platform.getPurchases() на каждом старте
    // (reconcileOwnership) — если бы подарок жил там же, он исчез бы на
    // первой сверке с платформой (подарок не существует как покупка).
    // Владение темой = default ИЛИ ownedThemes ИЛИ giftedThemes —
    // объединение, не замена (см. isThemeOwned). retention — компактный
    // блок модуля (Retention.encodeState/decodeState), пишется заново в
    // persist() из живого _retentionState, здесь — только последний
    // сохранённый снимок (нужен как место для Object.assign при
    // Platform.load()).
    bonusHints: 0,
    giftedThemes: [],
    retention: null,
    // ТЗ №22, C1: цель дня. dailyDay — UTC-дата 'YYYY-MM-DD' (K-24,
    // из Platform.now()), dailyWins — побед за эти сутки, dailyDone —
    // награда за сутки уже выдана. Старый сейв без полей мигрирует в
    // normalizeState (S-05).
    dailyDay: '',
    dailyWins: 0,
    dailyDone: false
  };

  /* ТЗ №15, этап 1, п.1.1: прогрессия — СНОВА idx<=maxUnlocked, как ДО
     ТЗ №14. Раздатчик уровней (Retention.isLevelOpen) к прогрессии
     отношения больше не имеет — энергия гейтит СТАРТ уровня, не
     ДОСТУПНОСТЬ (см. requestStartLevel/canStartLevel ниже), это две
     независимые вещи. */
  function isLevelUnlocked(idx) {
    return devUnlockAll || idx <= state.maxUnlocked;
  }

  /* ---------- Гейт записи сейва (ТЗ №2, Фаза 3 — блокер модерации) ----------
     Закрыт по умолчанию, открывается в boot() ТОЛЬКО после подтверждённо
     успешного Platform.load() (ok:true — «пусто» или «есть данные»,
     ОБА варианта легитимны). Пока гейт закрыт (load ещё не подтверждён —
     сбой сети/SDK на старте), persist() НИЧЕГО не пишет: полный объект
     сейва с ДЕФОЛТНЫМИ полями иначе мог бы улететь на сервер и стереть
     реальный прогресс игрока (setData всегда пишет целиком). Все точки
     сохранения зовут persist(), не Platform.save() напрямую — единая
     точка контроля. */
  let saveGateOpen = false;
  function persist() {
    if (!saveGateOpen) {
      console.warn('[save] запись пропущена — сейв ещё не подтверждён (гейт закрыт)');
      return;
    }
    const payload = { ...state };
    // ТЗ №14, этап 2: снимок retention.js берётся ЗАНОВО из живого
    // _retentionState на каждую запись — state.retention сам по себе не
    // мутируется (единственный источник истины во время сессии —
    // _retentionState, тот же приём, что main.js нонограмм/saveProgress).
    if (typeof Retention !== 'undefined' && _retentionState) {
      payload.retention = Retention.encodeState(_retentionState);
    }
    // ---------- Сторож объёма (ТЗ №14, этап 3, добор) ----------
    // Замер РЕАЛЬНЫХ байт перед КАЖДОЙ записью — не расчёт «должно
    // влезать» (стандарт студии). Худший случай Color Sort (156/156
    // уровней пройдены, все темы владетые, серия и раздатчик на
    // максимуме) замерен вручную при разработке — 956 байт, кратный
    // запас под оба бюджета площадок (Platform.SAVE_SIZE_GUARD_BYTES:
    // 150000 Яндекс / 3500 ВК). Схема сейва фиксированного размера
    // (максимум 156 уровней, не растёт бесконечно, в отличие от
    // нонограмм-boardStates) — безопасного поля для автоматической
    // эвикции здесь нет, поэтому реакция на превышение — громкий лог,
    // не тихая обрезка прогресса; запись всё равно уходит (отказ от
    // записи гарантированно потерял бы прогресс, попытка — нет).
    if (typeof Platform.SAVE_SIZE_GUARD_BYTES === 'number') {
      const sizeBytes = new Blob([JSON.stringify(payload)]).size;
      if (sizeBytes > Platform.SAVE_SIZE_GUARD_BYTES) {
        console.error(`[save] СЕЙВ ПРЕВЫСИЛ БЮДЖЕТ СТОРОЖА: ${sizeBytes} байт > ${Platform.SAVE_SIZE_GUARD_BYTES} — площадка может отклонить/обрезать запись. При фиксированной схеме (156 уровней максимум) это означает баг, не органический рост данных — чинить причину, не добавлять эвикцию задним числом.`);
      }
    }
    Platform.save(payload);
  }

  const buildBadgeEl = document.getElementById('build-badge');

  /* Плашка номера билда (перенесено из feature/vk-resubmit, задача 14,
     свой аналог для Яндекс-адаптера) — видна ТОЛЬКО когда адаптер
     реально экспортирует Platform.BUILD строкой (Яндекс-сборка,
     build.py подставил плейсхолдер-заглушку — см. platform.js/build.py).
     typeof-гейт — тот же приём, что у getCatalog выше.
     ?nobuild=1 в адресе — ручной способ спрятать плашку перед промо-
     скриншотом, без обращения к платформе. */
  function updateBuildBadge() {
    if (!buildBadgeEl) return;
    if (typeof Platform.BUILD !== 'string') return;
    const hideForScreenshot = new URLSearchParams(location.search).has('nobuild');
    if (hideForScreenshot) return;
    buildBadgeEl.textContent = Platform.BUILD;
    buildBadgeEl.classList.remove('hidden');
  }

  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  /* ТЗ №10, задача E: анимации уважают системную настройку — CSS уже
     гасит сами переходы (@media (prefers-reduced-motion:reduce) в
     style.css), но JS-таймеры (board-fade, см. ниже), которые ждут
     столько же мс, СКОЛЬКО ДЛИТСЯ CSS-переход, не подхватывают это
     автоматически: без проверки холст оставался бы искусственно
     невидимым 200мс ни за что — фейда уже нет, а пауза осталась бы. */
  function prefersReducedMotion() {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- Звук: тумблёр ---------- */
  function applyMuteIcon() {
    soundBtns.forEach(b => b.classList.toggle('muted', state.muted));
    Sound.setMuted(state.muted);
  }
  function toggleSound() {
    state.muted = !state.muted;
    applyMuteIcon();
    persist();
  }
  soundBtns.forEach(b => b.addEventListener('click', toggleSound));

  /* ---------- Магазин: базовая тема + 3 покупаемые (ТЗ №2, модель
     владения переработана ТЗ №6 задача A) ----------
     Реальная покупка (Platform.getCatalog/purchase/consumePurchase/
     getPurchases существуют ТОЛЬКО когда платформа их выставляет —
     typeof-гейт, main.js площадку не знает, см. platform.js
     PURCHASES_ENABLED_YANDEX, дефолт false до статуса «Покупки
     подключены»).

     Источник истины владения — Platform.getPurchases() на каждом
     старте (reconcileOwnership, вызывается из initShop). state.ownedThemes
     в сейве — ТОЛЬКО зеркало для мгновенной отрисовки карточек до того,
     как сеть успела ответить; при расхождении зеркало ПЕРЕЗАПИСЫВАЕТСЯ
     ответом getPurchases() целиком (и добавление, и снятие темы, если
     её больше нет среди покупок). На ok:false (сеть/SDK споткнулись)
     зеркало НЕ трогаем — остаётся последнее известное состояние,
     сверка повторится на следующем старте. Темы — ПОСТОЯННОЕ владение
     (решение студии 05.08): Platform.consumePurchase() для тем в этом
     файле не вызывается НИКОГДА — единственный вызывающий во всём
     игровом архиве при любых флагах — dev_purchase_diag.js, и ТОЛЬКО
     в diag-сборке (ТЗ №6 задача F).

     ОДНА структура данных на все темы (задел под рост ассортимента —
     добавление 4-й темы не требует правки экранов), цвета лежат
     ТОЛЬКО здесь — ни в HTML, ни где-либо ещё не продублированы
     (шрам 27.07: SHOP_ITEMS.theme на ВК и COSMETIC_THEME на Яндексе
     разошлись при одинаковом id — здесь один список, одна площадка).

     ТЗ №4 (задача B, «тема переодевает всю игру»): каждая запись сверх
     colors (фигуры в колбах) несёт canvas — те же по смыслу
     ink/accent/outline, что и у board.js THEME, но ОТДЕЛЬНО: канва не
     читает CSS-переменные (см. board.js THEME/applyTheme).
     ФОН/ПАНЕЛЬ/ТЕКСТ/АКЦЕНТНАЯ КНОПКА/ФОН ПОЛЯ каждой темы заданы
     ТОЛЬКО в style.css ([data-theme="..."] блоки) — НЕ дублируются
     здесь литералами (единственный источник, как и раньше с colors):
     applyTheme() переключает ОДИН атрибут [data-theme] на <html>, и
     весь набор CSS-переменных подхватывается каскадом (задача B3) —
     JS ничего не присваивает поэлементно. check_palette.py при
     проверке B5 читает эти токены прямо из style.css.

     Цвета цветов-фигур (c1/c2/c3) у 'sea'/'forest'/'berry' ПЕРЕСОБРАНЫ
     этим ТЗ (были другие в ТЗ №2/№3): межтемный ассерт ужесточён до
     «различие на ВСЕХ ступенях» (задача A, check_palette.py), а новые
     токены фона поля/панели потребовали заново подобрать luma-цепочку
     каждой темы под собственный --board-bg (проверки B5). 'forest' —
     единственная СВЕТЛАЯ из трёх платных (решение основателя по
     вариантам исполнителя, задача B4), 'sea'/'berry' — тёмные.

     ТЗ №9, задача A: canvas.outlineLight убран, вместо него canvas.outline
     — ОДИН цвет обводки фигур на тему (board.js THEME.outline, см. его
     комментарий). У всех трёх платных тем outline совпадает с ink
     (обе уже были near-black — единственная разумная зона, откуда
     обводка проходит контраст ≥2.0:1 против одновременно тёмной c3 И
     светлых c2/board-bg). c3 каждой темы ПОДНЯТ по светлоте ровно
     настолько, чтобы контраст c3/outline дотянул до ≥2.0:1 (было
     <1.3:1 у всех трёх, объект обводки на самой тёмной заливке не был
     виден вообще) — c1/c2 не трогались, luma-разрывы внутри темы
     остались далеко за порогом ≥25% (см. отчёт ТЗ №9, там же контраст
     outline против каждой заливки/фона поля с числами). */
  const SHOP_THEMES = [
    { id: 'sea', labelKey: 'themeSeaLabel',
      colors: { c1: '#51b2cd', c2: '#d7f4e6', c3: '#1d4378' },
      canvas: { ink: '#030608', accent: '#e8bb5c', outline: '#030608' } },
    { id: 'forest', labelKey: 'themeForestLabel',
      colors: { c1: '#8ac76b', c2: '#e3f5d6', c3: '#174f22' },
      canvas: { ink: '#050b05', accent: '#b7502e', outline: '#050b05' } },
    { id: 'berry', labelKey: 'themeBerryLabel',
      colors: { c1: '#d671a3', c2: '#f5d6db', c3: '#711c71' },
      canvas: { ink: '#080207', accent: '#e8bb5c', outline: '#080207' } }
  ];
  // Снимки ДО любых мутаций Board.COLORS/Board.THEME — единственное
  // определение базовой темы (значения приходят из board.js, не
  // дублируются здесь литералами).
  const DEFAULT_THEME = { ...Board.COLORS };
  const DEFAULT_CANVAS_THEME = { ...Board.THEME };

  const btnShop     = document.getElementById('btn-shop');
  const btnShopBack = document.getElementById('btn-shop-back');
  const shopListEl  = document.getElementById('shop-list');
  let shopProducts = {}; // { [themeId]: продукт из getCatalog() } — цена/название не хардкодим (п.3.8)
  // shopCatalogUsable (ТЗ shop_gate_and_ads, задача A, п.1.2): оптимистично
  // true до первого ответа initShop() — вкладка не мигает скрытием на
  // старте (initShop() не блокирует Game Ready/меню, см. boot()). После
  // ответа каталога — true, ТОЛЬКО если каталог реально получен (ok:true)
  // И в нём нашёлся хотя бы один товар с ценой; иначе витрина скрывается
  // целиком (updateShopButtonVisibility), тем же путём, что на ВК —
  // никаких карточек-заглушек неактивного товара.
  let shopCatalogUsable = true;
  let shopPurchasesRaw = {}; // { [themeId]: сырая запись getPurchases() (несёт purchaseToken) } — ТОЛЬКО для diag-консумирования (ТЗ №6 задача F), игровая логика токен не читает
  let shopBuyInFlight = false; // защита от двойного тапа по «Купить», пока идёт purchase()
  // shopBuyError (ТЗ №7, задача A): { [themeId]: текст } — видимое
  // сообщение в карточке после ok:false у purchase(). По документации
  // Яндекса Promise отклоняется ОДИНАКОВО что при отмене игроком, что
  // при техническом сбое — различимого признака нет (см. отчёт), поэтому
  // сообщение одно, нейтральное, уместное для обоих случаев (задача A,
  // пункт 3). Не пишется при ok:true+data:null (dev-режим без SDK —
  // легитимно недоступно, не отказ, см. buyTheme). Очищается при
  // повторном тапе «Купить» (buyTheme) или уходе с экрана магазина
  // (btnShopBack) — не залипает.
  let shopBuyError = {};

  function themeColors(id) {
    if (id === 'default') return DEFAULT_THEME;
    const theme = SHOP_THEMES.find(th => th.id === id);
    return theme ? theme.colors : DEFAULT_THEME;
  }

  function themeCanvas(id) {
    if (id === 'default') return DEFAULT_CANVAS_THEME;
    const theme = SHOP_THEMES.find(th => th.id === id);
    return theme ? theme.canvas : DEFAULT_CANVAS_THEME;
  }

  /* ТЗ №14, этап 2: владение темой — ОБЪЕДИНЕНИЕ «куплено на площадке»
     (ownedThemes, источник истины — Platform.getPurchases(), см.
     reconcileOwnership) и «подарено модулем удержания» (giftedThemes,
     retention.js, RETENTION_CONFIG.callbacks.grantStyle). Два РАЗНЫХ
     массива нарочно — reconcileOwnership() полностью ПЕРЕЗАПИСЫВАЕТ
     ownedThemes ответом платформы (giftedThemes она не видит и не
     трогает никогда, живёт только здесь). Использовать ВЕЗДЕ, где
     раньше проверялось голое state.ownedThemes.includes(id) — иначе
     подарок либо предлагался бы к повторной покупке в магазине, либо
     откатывался на 'default' первой же сверкой владения. */
  function isThemeOwned(id) {
    return id === 'default' || state.ownedThemes.includes(id) || state.giftedThemes.includes(id);
  }

  /* ТЗ №17: два нейтральных доступа к тем же данным — для кода экрана
     «Оформление», которому про торговлю знать нечего и НЕЛЬЗЯ (см.
     OFORMLENIE-SCOPE ниже: guard сборки ВК валит участок, если тот
     заговорит словарём витрины). THEME_DEFS — тот же массив определений
     тем (цвета/подписи), просто под именем, отражающим, чем он является
     для потребителя: данными о темах, а не каталогом товара.
     paidThemesReachable() — тот же флаг площадки одним выражением
     (заодно снимает его дублирование по файлу). */
  const THEME_DEFS = SHOP_THEMES;

  function paidThemesReachable() {
    return typeof Platform.SHOP_SUPPORTED === 'boolean' && Platform.SHOP_SUPPORTED;
  }

  /* ТЗ №4, задача B3: смена темы — ОДИН атрибут на корневом элементе,
     ничего больше. Для 'default' атрибут снимается — :root в style.css
     уже несёт значения базовой Тёплой темы (задача B1, не переделана),
     переопределять их инлайн-стилями не нужно. Для платных тем —
     [data-theme="sea|forest|berry"] в style.css целиком описывает
     фон/панель/текст/акцент/поле; здесь только переключаем сам атрибут
     + отдельно обновляем Board.COLORS/THEME (канва CSS не читает). */
  function applyTheme(id) {
    const swap = () => {
      Object.assign(Board.COLORS, themeColors(id));
      Object.assign(Board.THEME, themeCanvas(id));
      if (id === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', id);
      }
    };
    /* ТЗ №10, задача E: «перекрашивание без мгновенного скачка, включая
       холст». Токены style.css анимируются сами (CSS-transition на
       элементах), но канва — пиксели, а не CSS-свойства: Board.COLORS/
       THEME правятся мгновенно, следующий draw() покажет новые цвета
       без перехода. Если игровой экран сейчас виден, гасим холст тем же
       board-fade, что уже используют переходы между уровнями
       (goToNextLevel/proceedToLevel) — короткое затемнение прячет
       мгновенную подмену. Если экран игры не активен (обычный путь —
       смена темы с экрана магазина), холст всё равно не виден — фейд
       пропускаем, просто переключаем; следующий показ поля и так
       нарисует уже новую тему. */
    if (screens.game.classList.contains('active')) {
      boardWrap.classList.add('board-fade');
      setTimeout(() => {
        swap();
        Board.redraw();
        requestAnimationFrame(() => boardWrap.classList.remove('board-fade'));
      }, prefersReducedMotion() ? 0 : BOARD_FADE_MS);
    } else {
      swap();
    }
  }

  function selectTheme(id) {
    state.selectedTheme = id;
    state.lastChosenTheme = id; // явный выбор игрока (ТЗ №7, задача B) — см. комментарий у объявления поля
    applyTheme(id);
    persist();
    renderShop();
    renderOformlenie(); // ТЗ №17: экраны выбора и покупки живут отдельно, но зеркалят одно состояние
  }

  /* OFORMLENIE-SCOPE-BEGIN — границы для guard'а сборки
     (check_oformlenie_no_trade_vk в build.py). Внутри этих маркеров живёт
     ВЕСЬ код экрана «Оформление». Guard проверяет ровно этот участок
     собранного main.js и валит сборку ВК, если тут появится словарь
     торговли (в любом виде — хоть в коде, хоть в комментарии) или если
     источником карточек перестанет быть ownedThemeIds().

     Строгость намеренная и до комментариев включительно: участок, которому
     понадобилось РАССКАЗЫВАТЬ про оплату, почти наверняка начал её
     ОБСЛУЖИВАТЬ. Нужен такой код — ему место на отдельном экране Яндекса,
     не здесь. Нейтральные доступы к тем же данным объявлены выше:
     THEME_DEFS и paidThemesReachable(). Двигать маркеры, не поправив
     build.py, нельзя — сборка ВК упадёт. */
  /* ---------- Оформление (ТЗ №17) ---------- */

  /* ЕДИНСТВЕННЫЙ источник карточек экрана. Возвращает id-шники тем,
     которые у игрока ЕСТЬ: базовая (есть у всех и всегда) плюс те из
     THEME_DEFS, что прошли themeAvailableHere.

     КРАСНАЯ ЛИНИЯ ТЗ №17: тема, которой у игрока нет, не попадает на этот
     экран не потому, что «мы договорились её прятать», а потому что
     единственный код, строящий карточки (renderOformlenie), ходит ТОЛЬКО
     сюда — а сюда она не проходит по построению. Ни отметки «нет
     доступа», ни серой карточки, ни display:none: состояние «оформление
     видно, а получить нельзя» здесь невыразимо, а не запрещено
     договорённостью. */
  function ownedThemeIds() {
    return ['default', ...THEME_DEFS.filter(th => themeAvailableHere(th.id)).map(th => th.id)];
  }

  /* Наличие темы, ЗАКОННОЕ НА ЭТОЙ ПЛОЩАДКЕ — уже, чем isThemeOwned.

     isThemeOwned отвечает на вопрос «есть ли тема у игрока по данным
     сейва» (ownedThemes ∪ giftedThemes) и нужен там, где важна
     ЦЕЛОСТНОСТЬ СЕЙВА (normalizeState). Здесь вопрос другой: «мог ли
     игрок получить её ЗДЕСЬ». Разница видна на ВК: платного канала там
     нет вовсе (paidThemesReachable() === false), поэтому ownedThemes на
     ВК не наполняется законным путём — непустым он бывает только у сейва,
     приехавшего с другой площадки или подложенного. Такой сейв мы, как и
     раньше, НЕ правим и НЕ перезаписываем (красная линия прежнего ТЗ по
     чистке ВК — см. гейт в boot()), но и не отрисовываем.

     giftedThemes законны на ОБЕИХ площадках: ягодная тема за серию входов
     приходит от retention.js. Именно это делает подарок 3-го дня видимым
     на ВК (ТЗ №17, раздел E). */
  function themeAvailableHere(id) {
    if (id === 'default') return true;
    const ownedOnPlatform = paidThemesReachable() && state.ownedThemes.includes(id);
    return ownedOnPlatform || state.giftedThemes.includes(id);
  }

  /* Подсказка выбирается по СОСТОЯНИЮ (три состояния ТЗ №17, раздел D).
     Варианты V1..V3 — на выбор основателя одним заходом; активный номер
     здесь один и меняется правкой этой константы, а не логикой.

     Различие площадок — только через paidThemesReachable(). Ключи с
     суффиксом Ya живут в блоке YANDEX-ONLY блоке i18n.js, который
     build.py vk вырезает физически, поэтому на ВК их не существует;
     гейт ниже — вторая линия обороны на случай, если блок когда-нибудь
     туда уедет. */
  /* Копирайт выбран основателем (22.08, ТЗ №17 — из трёх показанных
     отчётом вариантов выбран V1; V2/V3 удалены из i18n.js как решённые,
     см. историю коммитов при необходимости сверить формулировки). */
  function oformlenieHintKey() {
    const haveCount = ownedThemeIds().length;
    const totalHere = 1 + THEME_DEFS.length;
    if (haveCount >= totalHere) return 'oformlenieHintAll';              // состояние 3
    if (haveCount === 1) return paidThemesReachable() ? 'oformlenieHintNoneYa' : 'oformlenieHintNone';
    return paidThemesReachable() ? 'oformlenieHintSomeYa' : 'oformlenieHintSome';
  }

  /* Карточка экрана. НАРОЧНО не переиспользует карточку соседнего
     экрана Яндекса: у той есть ветка, которой здесь не должно
     существовать даже мёртвой.
     Возможных состояния ровно два: «Применить» и отметка «Активна».
     Кнопки «Выключить» нет (поправка основателя) — чтобы сменить
     оформление, игрок жмёт «Применить» у другого.

     Обработчик — onclick (не addEventListener): функция вызывается заново
     на каждый renderOformlenie(), дубли обработчиков накопиться не могут
     (урок нонограмм, тот же приём, что у карточек соседнего экрана). */
  function buildOformlenieCard(id) {
    const isDefault = id === 'default';
    const def = isDefault ? null : THEME_DEFS.find(th => th.id === id);
    if (!isDefault && !def) return null; // незнакомый id из чужого сейва — не рисуем
    const colors = isDefault ? DEFAULT_THEME : def.colors;
    const labelKey = isDefault ? 'themeDefaultLabel' : def.labelKey;

    const card = document.createElement('div');
    card.className = 'picker-item' + (state.selectedTheme === id ? ' active' : '');
    card.dataset.themeId = id;

    const topRow = document.createElement('div');
    topRow.className = 'picker-item-top';

    const vial = document.createElement('div');
    vial.className = 'picker-vial-preview';
    vial.setAttribute('aria-hidden', 'true');
    const shapes = ['circle', 'square', 'circle'];
    ['c1', 'c2', 'c3'].forEach((k, i) => {
      const el = document.createElement('span');
      el.className = `picker-vial-el ${shapes[i]}`;
      el.style.background = colors[k];
      vial.appendChild(el);
    });

    const info = document.createElement('div');
    info.className = 'picker-item-info';
    const labelEl = document.createElement('span');
    labelEl.className = 'picker-item-label';
    labelEl.textContent = t(labelKey);
    info.appendChild(labelEl);

    topRow.appendChild(vial);
    topRow.appendChild(info);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'picker-item-actions';
    if (state.selectedTheme === id) {
      const status = document.createElement('span');
      status.className = 'picker-item-status';
      status.textContent = t('themeActive');
      actionsRow.appendChild(status);
    } else {
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary picker-item-btn';
      btn.textContent = t('themeApply');
      btn.onclick = () => selectTheme(id);
      actionsRow.appendChild(btn);
    }

    card.appendChild(topRow);
    card.appendChild(actionsRow);
    return card;
  }

  function renderOformlenie() {
    const listEl = document.getElementById('oformlenie-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    ownedThemeIds().forEach(id => {
      const card = buildOformlenieCard(id);
      if (card) listEl.appendChild(card);
    });
    const hintEl = document.getElementById('oformlenie-hint');
    if (hintEl) hintEl.textContent = t(oformlenieHintKey());
  }
  /* OFORMLENIE-SCOPE-END */

  /* Dev-переключатель владения (ТЗ №3, задача C3, diag-сборка ТОЛЬКО —
     см. devThemeToggleEnabled выше). КРАСНАЯ ЛИНИЯ: правит ИСКЛЮЧИТЕЛЬНО
     state.ownedThemes + persist(), Platform.purchase/consumePurchase/
     getPurchases здесь не вызываются и не импортируются. */
  function devToggleThemeOwnership(id) {
    const idx = state.ownedThemes.indexOf(id);
    if (idx === -1) {
      state.ownedThemes.push(id);
    } else {
      state.ownedThemes.splice(idx, 1);
      if (state.selectedTheme === id) {
        state.selectedTheme = 'default';
        applyTheme('default');
      }
    }
    persist();
    renderShop();
    renderOformlenie(); // ТЗ №17: dev-смена владения видна и на экране выбора
  }

  /* Карточка одной темы. Обработчики — через onclick (не addEventListener):
     эта функция вызывается заново на каждый renderShop(), а renderShop()
     каждый раз чистит shopListEl.innerHTML и создаёт узлы заново — но
     onclick, в отличие от addEventListener, не может накопить дубли на
     переиспользуемом узле даже если правило когда-нибудь изменится
     (урок нонограмм). */
  function buildShopCard(id, labelKey, colors) {
    const card = document.createElement('div');
    card.className = 'shop-item' + (state.selectedTheme === id ? ' active' : '');
    let buyMessageEl = null; // задача A ТЗ №7 — см. присвоение в ветке «Купить» ниже

    const topRow = document.createElement('div');
    topRow.className = 'shop-item-top';

    const vial = document.createElement('div');
    vial.className = 'shop-vial-preview';
    vial.setAttribute('aria-hidden', 'true');
    const shapes = ['circle', 'square', 'circle'];
    ['c1', 'c2', 'c3'].forEach((k, i) => {
      const el = document.createElement('span');
      el.className = `shop-vial-el ${shapes[i]}`;
      el.style.background = colors[k];
      vial.appendChild(el);
    });

    const info = document.createElement('div');
    info.className = 'shop-item-info';
    const labelEl = document.createElement('span');
    labelEl.className = 'shop-item-label';
    labelEl.textContent = t(labelKey);
    info.appendChild(labelEl);

    topRow.appendChild(vial);
    topRow.appendChild(info);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'shop-item-actions';
    // ТЗ №14, этап 2: isThemeOwned (объединение куплено/подарено), не
    // голое state.ownedThemes.includes(id) — подаренная тема не должна
    // предлагаться к покупке (см. isThemeOwned).
    const owned = isThemeOwned(id);
    const product = shopProducts[id];
    // ТЗ shop_gate_and_ads, задача A, п.1.3: неполный каталог (тема
    // заведена в Консоли не для всех товаров) не должен рисовать
    // карточку-заглушку без возможности купить — карточка просто не
    // попадает на экран (см. return null и фильтр в renderShop()).
    // Витрина целиком уже гарантированно скрыта на этот случай
    // (shopCatalogUsable, initShop()), это — вторая, точечная линия
    // обороны против отдельно потерянного товара при иначе рабочем
    // каталоге.
    if (!owned && !(typeof Platform.getCatalog === 'function' && product)) return null;

    if (owned) {
      if (state.selectedTheme === id) {
        const status = document.createElement('span');
        status.className = 'shop-item-status';
        status.textContent = t('themeActive');
        actionsRow.appendChild(status);
      } else {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary shop-item-btn';
        btn.textContent = t('themeApply');
        btn.onclick = () => selectTheme(id);
        actionsRow.appendChild(btn);
      }
    } else {
      // Гейт в начале функции гарантирует: раз мы сюда дошли, product
      // существует и Platform.getCatalog — функция (иначе buildShopCard
      // вернул null раньше).
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary shop-item-btn';
      btn.textContent = `${t('cosmeticBuy')} · ${product.priceValue} `;
      // Иконка валюты (п.1.13.2) — из самого продукта getCatalog(), не
      // из кода: typeof-гейт на случай, если конкретная сборка SDK её
      // не отдаёт (не должно случиться, но кнопка не должна падать).
      // ТЗ №8, задача A: typeof-гейт проверяет только НАЛИЧИЕ метода,
      // не факт успешной загрузки — битый/недоступный URL раньше
      // рендерился чёрным квадратом (img без интринсик-размера).
      // Лечение: текстовый код валюты встаёт на экран СРАЗУ, иконка
      // подменяет его собой ТОЛЬКО после подтверждённой загрузки
      // (onload + naturalWidth>0) — на onerror/нулевом размере текст
      // просто остаётся, пустого/чёрного блока не бывает ни в одном
      // состоянии.
      if (typeof product.getPriceCurrencyImage === 'function') {
        const codeText = document.createTextNode(product.priceCurrencyCode || '');
        btn.appendChild(codeText);
        const currencyImg = document.createElement('img');
        currencyImg.alt = product.priceCurrencyCode || '';
        currencyImg.className = 'shop-item-currency-icon';
        currencyImg.setAttribute('aria-hidden', 'true');
        currencyImg.onload = () => {
          if (currencyImg.naturalWidth > 0 && codeText.parentNode === btn) {
            btn.replaceChild(currencyImg, codeText);
          }
        };
        currencyImg.src = product.getPriceCurrencyImage('small');
      } else {
        btn.appendChild(document.createTextNode(product.priceCurrencyCode || ''));
      }
      btn.onclick = () => buyTheme(id, product, btn);
      actionsRow.appendChild(btn);
      // Сообщение об отказе покупки (ТЗ №7, задача A) — текстом в
      // самой карточке, не alert()/полноэкранный блок. Скрыт (класс
      // hidden), пока shopBuyError[id] пуст; buyTheme() показывает/
      // прячет его напрямую в DOM (без полного renderShop() — не
      // задело бы disabled-состояние кнопки во время in-flight запроса).
      buyMessageEl = document.createElement('div');
      buyMessageEl.className = 'shop-item-message' + (shopBuyError[id] ? '' : ' hidden');
      buyMessageEl.textContent = shopBuyError[id] || '';
    }

    // Dev-переключатель владения (ТЗ №3, задача C3) — ТОЛЬКО diag-сборка,
    // ТОЛЬКО покупаемые темы (не 'default' — она и так всегда доступна).
    if (devThemeToggleEnabled && id !== 'default') {
      const devBtn = document.createElement('button');
      devBtn.className = 'btn btn-icon';
      devBtn.style.cssText = 'font-size:10px;padding:4px 6px;';
      devBtn.textContent = owned ? 'DEV−' : 'DEV+';
      devBtn.title = 'dev: локальное владение (diag), платёжный API не трогает';
      devBtn.onclick = () => devToggleThemeOwnership(id);
      actionsRow.appendChild(devBtn);
    }

    // Диагностика консумирования (ТЗ №6, задача F) — ТОЛЬКО diag-сборка,
    // ТОЛЬКО реальная покупка (shopPurchasesRaw[id] существует лишь
    // когда getPurchases() вернул её по-настоящему — dev-владение через
    // devToggleThemeOwnership не создаёт запись здесь, консумировать
    // нечего). Кнопка вызывает Platform.consumePurchase() НЕОБРАТИМО —
    // единственное место в игровом архиве (любая сборка), способное это
    // сделать; подтверждение — см. devConsumePurchase.
    if (devPurchaseDiagEnabled && id !== 'default' && shopPurchasesRaw[id]) {
      const diagBtn = document.createElement('button');
      diagBtn.className = 'btn btn-icon';
      diagBtn.style.cssText = 'font-size:10px;padding:4px 6px;';
      diagBtn.textContent = 'DIAG: Consume';
      diagBtn.title = 'diag: Platform.consumePurchase() по-настоящему, необратимо, только для проверки п.1.13.1';
      diagBtn.onclick = () => devConsumePurchase(id);
      actionsRow.appendChild(diagBtn);
    }

    card.appendChild(topRow);
    card.appendChild(actionsRow);
    if (buyMessageEl) card.appendChild(buyMessageEl);
    return card;
  }

  function renderShop() {
    if (!shopListEl) return;
    shopListEl.innerHTML = '';
    // 'default' всегда owned — buildShopCard никогда не вернёт null для неё.
    shopListEl.appendChild(buildShopCard('default', 'themeDefaultLabel', DEFAULT_THEME));
    SHOP_THEMES.forEach(theme => {
      // null — тема не куплена и её нет в полученном каталоге (ТЗ
      // shop_gate_and_ads, задача A, п.1.3): карточка не рисуется вовсе,
      // не заглушка.
      const card = buildShopCard(theme.id, theme.labelKey, theme.colors);
      if (card) shopListEl.appendChild(card);
    });
  }

  /* Ищет .shop-item-message ТЕКУЩЕЙ карточки (card = ближайший предок
     кнопки) — напрямую в DOM, БЕЗ renderShop(): пересборка списка
     карточек посреди in-flight запроса рассинхронила бы disabled-
     состояние кнопки с новым узлом (см. комментарий у shopBuyError). */
  function shopBuyMessageEl(btn) {
    const card = btn.closest('.shop-item');
    return card ? card.querySelector('.shop-item-message') : null;
  }

  /* Покупка отклонена/окно закрыто без результата (ТЗ №7, задача A —
     развитие фолбэка ТЗ №6): отказ ДОЛЖЕН быть виден игроку — мёртвая
     кнопка не годится. По документации Яндекса (sdk-purchases) Promise
     отклоняется ОДИНАКОВО что при отмене игроком («changed their mind
     and closed the payment window»), что при техническом сбое (нет
     товара в Консоли, не авторизован, таймаут, не хватает средств) —
     общий текст без надёжного признака различия (вариант 3 ТЗ, см.
     отчёт). Сообщение — нейтральное, не обвиняющее, уместное для обоих
     случаев: shopBuyError[id] + узел .shop-item-message в самой
     карточке, без alert()/полноэкранных блоков (п.1.16). Очищается тут
     же при повторном тапе «Купить» и в btnShopBack при уходе с экрана.

     ok:true+data:null (dev-режим БЕЗ SDK — покупка физически
     недоступна, а не отказ) остаётся тихим, как и раньше: это не
     событие отказа, сообщать нечего.

     Тема — постоянное владение: Platform.consumePurchase() здесь НЕ
     вызывается (см. комментарий у SHOP_THEMES выше) — покупка остаётся
     в getPurchases() навсегда, владение читается оттуда на каждом
     следующем старте (reconcileOwnership). */
  async function buyTheme(id, product, btn) {
    if (shopBuyInFlight) return;
    shopBuyInFlight = true;
    btn.disabled = true;
    delete shopBuyError[id];
    const msgEl = shopBuyMessageEl(btn);
    if (msgEl) { msgEl.textContent = ''; msgEl.classList.add('hidden'); }
    const result = await Platform.purchase(product.id);
    shopBuyInFlight = false;
    if (result.ok && result.data) {
      if (!state.ownedThemes.includes(id)) state.ownedThemes.push(id);
      selectTheme(id); // купленная тема сразу становится применённой + сейв + перерисовка
      return;
    }
    btn.disabled = false;
    if (!result.ok) {
      const text = t('shopPurchaseNotCompleted');
      shopBuyError[id] = text;
      const el = shopBuyMessageEl(btn);
      if (el) { el.textContent = text; el.classList.remove('hidden'); }
    }
  }

  /* Источник истины владения (ТЗ №6, задача A) — вызывается на каждом
     старте (из initShop). ok:true — ПОЛНАЯ пересборка зеркала
     (state.ownedThemes) из ответа платформы: и довладение (кросс-
     девайсность, задача E — второе устройство узнаёт о покупке даже
     при пустом серверном сейве), и снятие темы, которой в ответе
     больше нет. Если применённая тема перестала быть владеемой —
     откат на 'default', чтобы UI никогда не показывал тему, которой
     игрок не владеет по данным платформы. ok:false (сеть/SDK
     споткнулись) — зеркало НЕ трогаем, оставляем последнее известное
     состояние как есть; следующий старт попробует снова.

     ТЗ №7, задача B: если владение ПОДТВЕРЖДЕНО (тема реально есть в
     ownedFromPlatform), а применена сейчас 'default' — вернуть
     lastChosenTheme. Проверка стоит ПОСЛЕ мёржа зеркала и НЕЗАВИСИМО от
     mirrorChanged (не в обрыве по раннему return выше) — иначе баг
     остаётся: если владение подтверждается ОДИНАКОВО на каждом
     следующем старте (зеркало не меняется, mirrorChanged=false), откат
     назад к купленной теме не сработал бы ни разу после того как
     applied однажды сбросило на 'default' (временный ok:true с пустым
     ответом). lastChosenTheme НЕ трогаем здесь — поле только для
     осознанного выбора (см. selectTheme). */
  async function reconcileOwnership() {
    if (typeof Platform.getPurchases !== 'function') return; // покупки выключены флагом — магазин честно недоступен, сверять нечего
    const res = await Platform.getPurchases();
    if (!res.ok) {
      console.warn('[shop] getPurchases() не удался — зеркало владения оставлено как есть, сверка повторится на следующем старте', res.error);
      return;
    }
    const ownedFromPlatform = [];
    shopPurchasesRaw = {};
    res.data.forEach(purchase => {
      const theme = SHOP_THEMES.find(th => th.id === purchase.productID || `${th.id}_theme` === purchase.productID);
      if (!theme) return;
      if (!ownedFromPlatform.includes(theme.id)) ownedFromPlatform.push(theme.id);
      shopPurchasesRaw[theme.id] = purchase; // ТОЛЬКО для diag-консумирования, см. shopPurchasesRaw
    });
    const mirrorChanged = ownedFromPlatform.length !== state.ownedThemes.length
      || ownedFromPlatform.some(id => !state.ownedThemes.includes(id))
      || state.ownedThemes.some(id => !ownedFromPlatform.includes(id));

    let stateChanged = false;
    if (mirrorChanged) {
      state.ownedThemes = ownedFromPlatform;
      stateChanged = true;
      // ТЗ №14, этап 2: isThemeOwned (куплено ИЛИ подарено), не голое
      // ownedThemes.includes — иначе подаренная тема (giftedThemes,
      // платформа о ней не знает и никогда не будет знать — это не
      // покупка) откатывалась бы на 'default' при КАЖДОЙ сверке с
      // Platform.getPurchases(), даже если игрок её только что получил
      // и она реально применена.
      if (state.selectedTheme !== 'default' && !isThemeOwned(state.selectedTheme)) {
        state.selectedTheme = 'default';
        applyTheme('default');
      }
    }

    if (state.selectedTheme === 'default'
        && state.lastChosenTheme && state.lastChosenTheme !== 'default'
        && (ownedFromPlatform.includes(state.lastChosenTheme) || state.giftedThemes.includes(state.lastChosenTheme))) {
      state.selectedTheme = state.lastChosenTheme;
      applyTheme(state.selectedTheme);
      stateChanged = true;
    }

    if (stateChanged) persist();
  }

  async function initShop() {
    if (typeof Platform.getCatalog !== 'function') { renderShop(); return; }
    const catalogRes = await Platform.getCatalog();
    shopProducts = {};
    if (catalogRes.ok) {
      catalogRes.data.forEach(p => {
        const theme = SHOP_THEMES.find(th => th.id === p.id || `${th.id}_theme` === p.id);
        if (theme) shopProducts[theme.id] = p;
      });
    } else {
      console.warn('[shop] getCatalog() не удался — витрина скрыта целиком', catalogRes.error);
    }
    // ТЗ shop_gate_and_ads, задача A, п.1.2: каталог мог не приехать
    // (сеть/пустой каталог/отказ SDK) даже при включённых покупках —
    // витрина скрывается целиком, а не показывает мёртвые карточки.
    shopCatalogUsable = catalogRes.ok && Object.keys(shopProducts).length > 0;
    updateShopButtonVisibility();
    await reconcileOwnership();
    renderShop();
    renderOformlenie(); // ТЗ №17: сверка владения с площадкой меняет состав экрана выбора
  }

  /* Diag-only (ТЗ №6, задача F) — см. dev_purchase_diag.js. Единственный
     вызывающий Platform.consumePurchase() во всём игровом архиве при
     любых флагах. Подтверждение обязательно (необратимо), токен на
     экран никогда не выводится — только усечённый вид в консоль
     браузера, и то лишь для отладки самого метода. */
  async function devConsumePurchase(id) {
    const purchase = shopPurchasesRaw[id];
    if (!purchase || !purchase.purchaseToken) { console.warn('[diag] нет активной покупки для консумирования:', id); return; }
    const tokenPreview = `${purchase.purchaseToken.slice(0, 6)}…`;
    if (!confirm(`DIAG: консумировать покупку темы «${id}» (${tokenPreview})?\nНеобратимо — покупка исчезнет из getPurchases() навсегда.`)) return;
    const res = await Platform.consumePurchase(purchase.purchaseToken);
    if (!res.ok) { console.error('[diag] consumePurchase не удался:', res.error); return; }
    console.log(`[diag] покупка темы «${id}» консумирована (${tokenPreview})`);
    state.ownedThemes = state.ownedThemes.filter(t => t !== id);
    delete shopPurchasesRaw[id];
    if (state.selectedTheme === id) { state.selectedTheme = 'default'; applyTheme('default'); }
    persist();
    renderShop();
    renderOformlenie(); // ТЗ №17
  }

  /* Видимость самой вкладки «Магазин» — Platform.SHOP_SUPPORTED
     (typeof-гейт, main.js площадку не знает). На ВК-сборке (другой
     адаптер, build.py vk) поля нет — кнопка остаётся hidden. */
  function updateShopButtonVisibility() {
    const supported = typeof Platform.SHOP_SUPPORTED === 'boolean' && Platform.SHOP_SUPPORTED && shopCatalogUsable;
    if (btnShop) btnShop.classList.toggle('hidden', !supported);
    // ТЗ unify_repo, фаза 3: #btn-shop скрытый (display:none) закрывает
    // мышь/тач, но НЕ клавиатурный Tab — с ТЗ №10 экраны всегда
    // display:flex (opacity/pointer-events для кроссфейда), а
    // opacity:0 из tab-порядка не убирает. #screen-shop несёт статичную
    // #btn-shop-back в разметке ВСЕГДА (плюс карточки тем — renderShop()
    // их всё равно строит на ВК, initShop() лишь пропускает сеть) —
    // без inert клавиатурный пользователь дотягивался бы Tab'ом до
    // полностью выключенной витрины. inert снимает фокусируемость со
    // всего поддерева разом, включая узлы, которые появятся позже.
    if (screens.shop) screens.shop.inert = !supported;
  }

  if (btnShop) {
    btnShop.addEventListener('click', () => {
      show('shop');
      renderShop();
    });
  }
  if (btnShopBack) {
    btnShopBack.addEventListener('click', () => {
      shopBuyError = {}; // уход с экрана магазина — сообщение об отказе не залипает (ТЗ №7, задача A)
      goToMenu();
    });
  }

  /* ТЗ №17: навигация «Оформления». addEventListener здесь безопасен и
     уместен — эти две кнопки статичны в разметке (создаются один раз,
     экран их не перерисовывает); накопление обработчиков возможно только
     на пересоздаваемых узлах, а те (карточки тем) сидят на onclick, см.
     buildOformlenieCard. */
  const btnOformlenie     = document.getElementById('btn-oformlenie');
  const btnOformlenieBack = document.getElementById('btn-oformlenie-back');
  if (btnOformlenie) {
    btnOformlenie.addEventListener('click', () => {
      show('oformlenie');
      renderOformlenie();
    });
  }
  if (btnOformlenieBack) {
    btnOformlenieBack.addEventListener('click', goToMenu);
  }

  /* ---------- Модуль удержания (ТЗ №14, этап 2) ----------
     retention.js сам ничего не знает про DOM/Platform/LEVELS (см.
     заголовок файла) — весь мост здесь, тот же приём, что main.js
     нонограмм. Каждая функция начинается с typeof-проверки — на случай,
     если retention.js когда-нибудь перестанет грузиться (не должно
     случиться, файл в белом списке ОБЕИХ сборок, но приём тот же, что у
     AdvDiag/DEV_UNLOCK_ALL выше: типобезопасный no-op, не ReferenceError). */
  let _retentionState = null;

  const RETENTION_CONFIG = (typeof Retention !== 'undefined') ? Retention.mergeConfig({
    // ТЗ №15, этап 1: раздатчик УРОВНЕЙ (ТЗ №14) заменён режимом
    // gateMode:'energy' — тот же модуль, та же обвязка (такт/потолок/
    // пополнение рекламой/серия входов), но накопитель ничего не
    // открывает: это отдельная тратимая валюта (см. заголовок
    // retention.js и п.1.1/1.3 ТЗ №15). Числа —
    // потолок 10, порция 6, такт 6ч (дефолт модуля, не переопределяем)
    // — из ТЗ, свои не придумывались. starterCount модулю больше не
    // нужен в этом режиме (initState его игнорирует при gateMode:
    // 'energy') — не переопределяем, дефолт безвреден.
    gateMode: 'energy',
    dripPerTick: 6,
    accumulatorCap: 10,
    hintsRewardCount: 2, // перенесено с нонограмм вместе с остальным конфигом — свой не придумывался
    callbacks: {
      totalLevels:      function ()  { return LEVELS.length; },
      isCompleted:      function (i) { return typeof state.levelTimes[i] === 'number'; },
      maxReachedIndex:  function ()  { return state.maxUnlocked; },
      grantHints: function (n) {
        state.bonusHints += n;
        persist(); // награда обязана пережить закрытие вкладки сразу после boot()
        renderHintBonusBadge();
        showRetentionToast(t('retentionRewardHints').replace('{n}', n));
      },
      // Награда 3-го дня — решение основателя 22.08: КОНКРЕТНО ягодная
      // тема (не generic id аргументом сверху, как на нонограммах —
      // здесь только один сценарий, придумывать вариативность не
      // просили). giftedThemes, не ownedThemes (см. isThemeOwned) —
      // reconcileOwnership() на Яндексе не должен её съесть.
      //
      // ТЗ №14, этап 3 (добор, решение основателя 22.08 — обратимость
      // авто-помощи): НЕ переключаем тему автоматически (без selectTheme/
      // applyTheme) — только владение + тост. На ВК витрины нет вовсе,
      // поэтому принудительное применение было НЕОБРАТИМЫМ (вернуться к
      // тёплой бумаге нечем) — односторонняя смена облика игры без
      // согласия игрока. Теперь подарок — просто владение (isThemeOwned),
      // применяет его ТОЛЬКО игрок, ТОЛЬКО через магазин (Яндекс) —
      // симметрично тому, как ведёт себя реальная покупка ДО клика
      // «Применить». На ВК магазина нет — подарок останется невидим
      // визуально, пока витрина там не появится; это ОСОЗНАННЫЙ компромисс
      // основателя (одна строка вместо принудительной необратимой смены).
      grantStyle: function () {
        const id = 'berry';
        if (!state.giftedThemes.includes(id)) {
          state.giftedThemes.push(id);
          persist();
        }
        // ТЗ №17: подарку наконец есть куда приземлиться — экран
        // «Оформление» есть на ОБЕИХ площадках, поэтому компромисс,
        // описанный абзацем выше («на ВК подарок останется невидим,
        // пока витрина там не появится»), закрыт: тема видна сразу.
        renderOformlenie();
        showRetentionToast(t('retentionRewardStyle'));
      },
    },
  }) : null;

  let _retentionToastTimer = null;
  function showRetentionToast(text) {
    const el = document.getElementById('retention-reward-toast');
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
    // ТЗ №15: игровой экран несёт двухрядную шапку (.game-header-stacked)
    // — фиксированный top тоста перекрывал бы её (найдено кадром
    // приёмки: тост «Энергия +6!» лёг поверх кнопок «назад»/звук).
    // Отодвигаем тост НИЖЕ реальной высоты шапки (--header-h,
    // syncHeaderSpace её держит в актуальном состоянии для ЭТОГО
    // экрана — единственного места, где такой тост реально всплывает
    // синхронно с высокой шапкой, см. retentionTick/onEnergyWallAdClick).
    // На остальных экранах (меню без шапки, стена с обычной однорядной)
    // — прежнее положение у верхнего края.
    el.classList.toggle('below-header', screens.game.classList.contains('active'));
    requestAnimationFrame(() => el.classList.add('is-visible'));
    if (_retentionToastTimer) clearTimeout(_retentionToastTimer);
    _retentionToastTimer = setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => { el.hidden = true; }, prefersReducedMotion() ? 0 : BOARD_FADE_MS);
    }, 3200);
  }

  // Продвигает накопитель энергии на текущий момент — дёшево вызывать
  // часто (goToMenu/btnLevels/перед стартом уровня), если тактов не
  // набежало — no-op. Реальная выдача — сейв + тост сразу (п.2.4
  // контракта модуля: тихих улучшений не бывает).
  function retentionTick() {
    if (typeof Retention === 'undefined' || !_retentionState) return;
    const before = _retentionState.dripOpened;
    // ТЗ №18: единая точка времени тракта энергии — Platform.now(), не
    // Date.now() напрямую (иначе сценарии времени неподменяемы одной
    // точкой). todayKey() ниже по файлу — про суточный лимит rewarded,
    // не про энергию, её эта правка не касается.
    _retentionState = Retention.applyDripTick(_retentionState, Platform.now(), RETENTION_CONFIG);
    if (_retentionState.dripOpened > before) {
      persist();
      const granted = _retentionState.dripOpened - before;
      renderEnergyIndicator();
      showRetentionToast(t('energyToastGain').replace('{n}', granted));
    }
  }

  function formatClock(d) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  /* Индикатор энергии (ТЗ №15, п.1.4) — ОДНА функция обновляет ВСЕ
     инстансы разом (меню, игровой экран, стена энергии) через
     querySelectorAll по общим классам разметки (см. index.html) —
     не завязана на конкретный id, поэтому новый инстанс достаточно
     просто добавить в разметку той же структурой, без правки JS. */
  function renderEnergyIndicator() {
    if (!_retentionState) return;
    const current = Retention.dripBacklogCount(_retentionState, RETENTION_CONFIG);
    const cap = RETENTION_CONFIG.accumulatorCap;
    const nextAt = Retention.nextUnlockAtMs(_retentionState, RETENTION_CONFIG);
    const pct = Math.max(0, Math.min(100, Math.round((current / cap) * 100)));
    document.querySelectorAll('.energy-bar-fill').forEach(el => { el.style.width = pct + '%'; });
    // ТЗ №21, часть B: приветственный бонус (+40) временно поднимает
    // current выше cap (напр. 47/10) — голая формула «current/cap» и
    // полоса, ушедшая за 100%, выглядели бы как баг. Полоса уже зажата
    // clamp'ом выше; текст выше потолка показываем БЕЗ «/cap» (просто
    // число) — сам факт большого числа поверх полной полосы читается
    // как «запас», не как сломанный счётчик. Саму величину dripOpened
    // это не трогает, только отображение.
    document.querySelectorAll('.energy-value-text').forEach(el => {
      el.textContent = current > cap ? `${current}` : `${current}/${cap}`;
    });
    document.querySelectorAll('.energy-next-text').forEach(el => {
      el.textContent = nextAt == null ? '' : t('energyNextAt').replace('{n}', RETENTION_CONFIG.dripPerTick).replace('{time}', formatClock(new Date(nextAt)));
    });
  }

  // Строка серии входов (главное меню) — видна ПОСТОЯННО (не hidden).
  function renderRetentionStreakLine() {
    const el = document.getElementById('retention-streak-line');
    if (!el || !_retentionState) return;
    const shown = Math.min(_retentionState.streakLen, RETENTION_CONFIG.streakThreshold);
    // ТЗ №22, C2 (N-35): если ЗАВТРАШНИЙ вход что-то даёт — называем
    // что именно. Только отображение: правила серии живут в retention.js.
    const next = _retentionState.streakLen + 1;
    const kind = RETENTION_CONFIG.streakDayReward[String(next)];
    const alreadyGiven = !!(_retentionState.streakRewards && _retentionState.streakRewards[next]);
    let key = 'retentionStreakLine';
    if (kind === 'hints' && !alreadyGiven) key = 'streakTomorrowHints';
    else if (kind === 'style' && !alreadyGiven && !isThemeOwned('berry')) key = 'streakTomorrowStyle';
    el.textContent = t(key)
      .replace('{n}', shown)
      .replace('{m}', RETENTION_CONFIG.streakThreshold)
      .replace('{k}', RETENTION_CONFIG.hintsRewardCount);
  }

  /* ---------- Цель дня (ТЗ №22, C1) ----------
     Близкая цель на сегодня: DAILY_GOAL побед за UTC-сутки (K-24,
     Platform.now() — та же точка времени, что у энергии). Засчитывается
     любая победа, включая повтор. Награда — бесплатные подсказки
     (существующая валюта bonusHints), раз в сутки. Завтра — новая цель:
     это и есть «состояние, которое ждёт игрока» (N-35). */
  const DAILY_GOAL = 3;
  const DAILY_REWARD_HINTS = 2;

  function utcDayKey(ms) {
    return new Date(ms).toISOString().slice(0, 10);
  }

  function checkDailyGoalReset() {
    const today = utcDayKey(Platform.now());
    if (state.dailyDay !== today) {
      state.dailyDay = today;
      state.dailyWins = 0;
      state.dailyDone = false;
    }
  }

  // Засчитывает победу. Возвращает { before, after, rewarded } —
  // экрану победы, чтобы залить новую точку на глазах.
  function registerDailyWin() {
    checkDailyGoalReset();
    const before = Math.min(state.dailyWins, DAILY_GOAL);
    state.dailyWins = Math.min(state.dailyWins + 1, 99);
    const after = Math.min(state.dailyWins, DAILY_GOAL);
    let rewarded = false;
    if (!state.dailyDone && state.dailyWins >= DAILY_GOAL) {
      state.dailyDone = true;
      state.bonusHints += DAILY_REWARD_HINTS;
      rewarded = true;
    }
    return { before, after, rewarded };
  }

  function renderDailyGoal() {
    const el = document.getElementById('daily-goal-line');
    if (!el) return;
    checkDailyGoalReset();
    const n = Math.min(state.dailyWins, DAILY_GOAL);
    el.textContent = state.dailyDone
      ? t('dailyGoalDone')
      : t('dailyGoalLine').replace(/\{m\}/g, DAILY_GOAL).replace('{n}', n);
    el.classList.toggle('done', state.dailyDone);
  }

  function renderWinDaily(result) {
    const pips = document.querySelectorAll('#win-daily-pips span');
    pips.forEach((p, i) => {
      p.classList.toggle('filled', i < result.after);
      p.classList.remove('just-filled');
      if (i >= result.before && i < result.after) {
        void p.offsetWidth; // перезапуск CSS-анимации при повторном показе
        p.classList.add('just-filled');
      }
    });
    const label = document.getElementById('win-daily-label');
    if (label) {
      label.textContent = state.dailyDone
        ? t('dailyGoalDone')
        : t('dailyGoalLine').replace(/\{m\}/g, DAILY_GOAL).replace('{n}', result.after);
    }
  }

  /* Бейдж остатка бесплатных подсказок на кнопке ? (ТЗ №14, этап 3,
     п.3.2 — перенос решения нонограмм ТЗ №03 модуля): скрыт при нуле,
     число БЕЗ знаменателя при значении больше нуля, обновляется сразу
     при каждой мутации state.bonusHints (начисление в grantHints,
     трата в обработчике btnHint) — видимое уменьшение при трате. */
  function renderHintBonusBadge() {
    const el = document.getElementById('hint-bonus-badge');
    if (!el) return;
    if (state.bonusHints > 0) {
      el.textContent = String(state.bonusHints);
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  /* ---------- Стена энергии (ТЗ №15, п.1.1/1.4/1.6) ----------
     Показывается ВМЕСТО старта нового (не пройденного) уровня, если
     энергия на нуле. canStartLevel — единственное место, где решается
     «можно ли начать» (уже пройденные уровни — бесплатный повтор,
     п.1.2, энергию не проверяем вовсе). requestStartLevel — общая
     точка входа для ВСЕХ мест, откуда уровень может начаться (кнопка
     «Играть», тайл сетки, переход «Дальше»/конец главы) — если гейт не
     пройден, запоминает намерение и после успешной рекламы на стене
     автоматически продолжает туда же, куда шёл игрок (п.1.6: «реклама
     пополняет, игра продолжается» — без лишнего клика). */
  function canStartLevel(idx) {
    if (typeof state.levelTimes[idx] === 'number') return true; // уже пройден — бесплатно (п.1.2)
    if (typeof Retention === 'undefined' || !_retentionState) return true; // защита, модуль не инициализирован
    return Retention.dripBacklogCount(_retentionState, RETENTION_CONFIG) > 0;
  }

  let _pendingProceedAfterEnergy = null;

  function renderEnergyWall() {
    if (!_retentionState) return;
    renderEnergyIndicator();
    const nextAt = Retention.nextUnlockAtMs(_retentionState, RETENTION_CONFIG);
    const textEl = document.getElementById('energy-wall-text');
    if (textEl) {
      // nextAt===null на стене структурно не должен наступать (стена
      // только при энергии 0 < потолка), но не молчим, если наступит —
      // безопасный дефолт вместо пустой строки.
      textEl.textContent = nextAt == null ? '' : t('energyWallText').replace('{n}', RETENTION_CONFIG.dripPerTick).replace('{time}', formatClock(new Date(nextAt)));
    }
    // Кнопка несёт data-i18n (applyStrings подставляет её ПРИ СМЕНЕ
    // ЯЗЫКА и перезаписывает textContent сырой строкой с {n}) — подстановку
    // числа делаем здесь, при каждом показе стены, ПОСЛЕ applyStrings.
    const adBtn = document.getElementById('btn-energy-wall-ad');
    if (adBtn) adBtn.textContent = t('energyWallAdBtn').replace('{n}', RETENTION_CONFIG.dripPerTick);
  }

  function requestStartLevel(idx, proceedFn) {
    if (canStartLevel(idx)) { proceedFn(); return; }
    _pendingProceedAfterEnergy = proceedFn;
    renderEnergyWall();
    show('energyWall');
  }

  function onEnergyWallAdClick() {
    Platform.showRewarded(
      // Результат — внутри onRewarded, не в onResume (см. комментарий
      // у onRetentionRewardedClick-эквивалента ТЗ №14 этап 3: адаптеры
      // зовут onResume ДО onRewarded, рендер в onResume читал бы
      // состояние до мутации).
      () => {
        const before = _retentionState.dripOpened;
        _retentionState = Retention.grantDrip(_retentionState, RETENTION_CONFIG, RETENTION_CONFIG.dripPerTick);
        const granted = _retentionState.dripOpened - before;
        renderEnergyIndicator();
        renderEnergyWall();
        if (granted > 0) persist();
        // Автопродолжение — ДО тоста: тост определяет позицию (шапка
        // экрана игры выше шапки стены — below-header) по ТЕКУЩЕМУ
        // активному экрану в момент показа, поэтому обязан идти ПОСЛЕ
        // переключения экрана, иначе берёт положение ещё под стену
        // (поймано кадром приёмки — тост лёг на шапку игры, вычислив
        // below-header, пока стена ещё была активна).
        const proceed = _pendingProceedAfterEnergy;
        _pendingProceedAfterEnergy = null;
        if (proceed && _retentionState.dripOpened > 0) proceed();
        if (granted > 0) showRetentionToast(t('energyToastGain').replace('{n}', granted));
      },
      pauseGame,
      resumeGame
    );
  }
  const btnEnergyWallAd = document.getElementById('btn-energy-wall-ad');
  if (btnEnergyWallAd) btnEnergyWallAd.addEventListener('click', onEnergyWallAdClick);
  const btnEnergyWallBack = document.getElementById('btn-energy-wall-back');
  if (btnEnergyWallBack) {
    btnEnergyWallBack.addEventListener('click', () => {
      _pendingProceedAfterEnergy = null; // ушли со стены сами — автопродолжение не должно сработать позже
      goToMenu();
    });
  }

  // Единая точка возврата в главное меню — обновляет строку серии,
  // индикатор энергии и подбирает такты, набежавшие, пока игрок был на
  // другом экране (дёшево, retentionTick — no-op без набежавших тактов).
  function goToMenu() {
    retentionTick();
    renderRetentionStreakLine();
    renderDailyGoal();
    renderEnergyIndicator();
    leaveLevelHelpers();
    show('menu');
  }

  /* Короткий тап-звук на ЛЮБОЙ кнопке интерфейса (делегирование — не
     привязываемся к конкретным обработчикам, ничего не пропустим).
     Слушатель на document ловит клик уже ПОСЛЕ обработчика самой
     кнопки (порядок всплытия) — toggleSound успевает обновить
     Sound.setMuted до того, как здесь решится, играть ли звук. */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn')) Sound.playClick();
  });

  /* ---------- Резерв под шапку ----------
     Высота .game-header не хардкодится: меряем фактический рендер
     (зависит от масштаба ОС/браузера, шрифта, длины текста уровня),
     прокидываем в CSS-переменную — board-wrap всегда отступает ровно
     на реальную высоту шапки, без риска наложения. */
  function syncHeaderSpace() {
    const activeHeader = screens.game.classList.contains('active') ? gameHeader
      : screens.grid.classList.contains('active') ? screens.grid.querySelector('.game-header')
      : null;
    if (!activeHeader) return;
    const h = Math.ceil(activeHeader.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', h + 'px');
    if (screens.game.classList.contains('active')) Board.resize();
    else layoutGrid();
  }
  window.addEventListener('resize', syncHeaderSpace);
  window.addEventListener('orientationchange', syncHeaderSpace);

  /* ---------- Сетка уровней (прогресс + прыжок на уже открытый) ----------
     Раскладка считается сама, как в Board.computeLayout — плитки
     подбирают наибольший размер, при котором помещается МАКСИМУМ
     строк без переполнения по ширине. Если ни при каком числе колонок
     тайл не дотягивает до MIN_TILE (156 плиток на узком экране) —
     сетка становится выше экрана и скроллится ВНУТРИ #grid-wrap
     (overflow-y:auto в style.css), страница (html,body) по-прежнему
     не скроллится (стандарт студии, шрам ВК-порта: 100vh раздувает
     iframe площадки — см. журнал). Решение основателя (вариант A):
     вертикальный скролл + подмотка к текущему уровню, не карта глав
     и не страницы. */
  function renderGrid() {
    levelGridEl.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
      const unlocked = isLevelUnlocked(i);
      const tile = document.createElement('button');
      tile.className = 'grid-tile' + (unlocked ? '' : ' locked') + (i === state.levelIndex ? ' current' : '');
      if (unlocked) {
        tile.textContent = String(i + 1);
        tile.addEventListener('click', () => {
          // ТЗ №15, этап 1: гейт энергии — уже пройденный тайл (повтор)
          // всегда бесплатен, см. canStartLevel.
          requestStartLevel(i, () => {
            show('game');
            loadLevel(i);
            persist();
          });
        });
      } else {
        tile.disabled = true;
        tile.setAttribute('aria-label', 'locked');
        const lock = document.createElement('span');
        lock.className = 'lock-icon';
        tile.appendChild(lock);
      }
      levelGridEl.appendChild(tile);
    }
    layoutGrid();
  }

  function layoutGrid() {
    if (!screens.grid.classList.contains('active')) return;
    const wrap = document.getElementById('grid-wrap');
    // clientWidth/Height включают padding самого wrap (там резерв под
    // шапку сверху) — вычитаем его, иначе сетка меряет себя по ПОЛНОЙ
    // рамке контейнера и переполняет реальную видимую область (шрам:
    // плитки налезали на шапку и уезжали за нижний край без скролла).
    const cs = getComputedStyle(wrap);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const cssW = wrap.clientWidth - padX;
    const cssH = wrap.clientHeight - padY;
    if (cssW <= 0 || cssH <= 0) return;
    const count = LEVELS.length;
    const GAP = 8;
    // MIN_TILE поднят с 26 до 36 (решение основателя, п.1.8 требований
    // площадки): 26px (~4мм) заметно ниже отраслевых ориентиров
    // 44pt/48dp для минимальной цели касания — риск промаха/усталости
    // пальца на 156 плитках. Шрифт номера уже привязан к tilePx
    // (см. ниже) — с ростом MIN_TILE читаемость растёт вместе с ним,
    // отдельно трогать не нужно.
    const MIN_TILE = 36;
    const MAX_TILE = 60;

    let bestTile = MIN_TILE, bestCols = count, fitsWithoutScroll = false;
    for (let cols = 1; cols <= count; cols++) {
      const rows = Math.ceil(count / cols);
      const tileW = (cssW - GAP * (cols - 1)) / cols;
      const tileH = (cssH - GAP * (rows - 1)) / rows;
      const tile = Math.min(tileW, tileH, MAX_TILE);
      if (tile > bestTile) { bestTile = tile; bestCols = cols; fitsWithoutScroll = true; }
    }

    let tilePx;
    if (fitsWithoutScroll) {
      tilePx = Math.max(MIN_TILE, Math.floor(bestTile));
    } else {
      // Ни одна раскладка не даёт тайл больше MIN_TILE в пределах
      // высоты экрана (156 плиток на узком экране) — подбираем колонки
      // ТОЛЬКО по ширине, высоту не учитываем. Сетка становится выше
      // экрана — это нормально, #grid-wrap скроллит её внутри себя.
      bestCols = Math.min(count, Math.max(1, Math.floor((cssW + GAP) / (MIN_TILE + GAP))));
      tilePx = MIN_TILE;
    }
    levelGridEl.style.gridTemplateColumns = `repeat(${bestCols}, ${tilePx}px)`;
    levelGridEl.style.gridAutoRows = `${tilePx}px`;
    levelGridEl.style.fontSize = Math.max(10, Math.floor(tilePx * 0.4)) + 'px';
  }

  /* Подмотка сетки к текущему уровню — примерно на трети высоты
     контейнера сверху, не впритык к краю (решение основателя, вариант
     A). Считается вручную через getBoundingClientRect (НЕ scrollIntoView
     — шрам Словохода: scrollIntoView молча не срабатывает, если
     контейнер ещё display:none/нулевой высоты). Если высота нулевая —
     это ошибка вызова (экран должен быть уже показан и отрисован),
     проговариваем в консоль, а не проглатываем молча. */
  function scrollGridToCurrent() {
    const wrap = document.getElementById('grid-wrap');
    if (wrap.clientHeight === 0) {
      console.error('[grid] scrollGridToCurrent: контейнер сетки имеет нулевую высоту — подмотка невозможна (вызвано до показа экрана?)');
      return;
    }
    const tiles = levelGridEl.querySelectorAll('.grid-tile');
    const currentTile = tiles[state.levelIndex];
    if (!currentTile) return;
    const wrapRect = wrap.getBoundingClientRect();
    const tileRect = currentTile.getBoundingClientRect();
    const tileCenterInScroll = wrap.scrollTop + (tileRect.top - wrapRect.top) + tileRect.height / 2;
    const targetScrollTop = tileCenterInScroll - wrap.clientHeight / 3;
    const maxScrollTop = wrap.scrollHeight - wrap.clientHeight;
    wrap.scrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
  }

  btnLevels.addEventListener('click', () => {
    // ТЗ №15, этап 1: сетка уровней вернулась к простой разметке —
    // раздатчик здесь больше не живёт (см. index.html), лишние вызовы
    // убраны вместе с ним.
    show('grid');
    syncHeaderSpace();
    renderGrid();
    scrollGridToCurrent();
  });
  btnGridBack.addEventListener('click', () => goToMenu());

  /* ---------- Пауза геймплея/звука ----------
     Единая точка для ДВУХ триггеров: реклама (Фаза 5, колбэки
     onPause/onResume у interstitial и rewarded) и сворачивание вкладки
     (visibilitychange, ниже). В этой игре геймплей ходовой (не
     реалтайм), «пауза геймплея» по факту сводится к паузе звука —
     ничего само по себе не продолжает идти, пока вкладка скрыта. */
  function pauseGame() {
    Sound.suspend();
    Stats.pause();
  }
  function resumeGame() {
    Sound.resume();
    Stats.resume();
  }

  /* ---------- Interstitial между уровнями: двойной кулдаун ----------
     Оба условия вместе, чтобы не докучать рекламой аудитории 35+.
     Каданс — платформенное решение (main.js площадку не знает, см.
     CLAUDE.md): читаем из Platform.AD_LEVELS_INTERVAL/AD_MIN_GAP_MS,
     если адаптер их не экспортирует — дефолт ниже. НИ platform.js, НИ
     vk_platform.js сейчас этих полей не экспортируют (проверено при
     правке ТЗ №15 — прежний комментарий здесь утверждал обратное, про
     ВК-переопределение 4/120с, которого в коде физически нет; убрано
     как устаревшее) — обе площадки идут по общему дефолту.
     ТЗ №15, п.1.5: интервал 3 -> 5 (было «раз в 3 уровня», стало «раз
     в 5») — приводит игру к уже действующему стандарту студии по ВК.
     AD_MIN_GAP_MS (90с) НЕ трогаем — ТЗ прямым текстом.
     Частота НЕ меняется этой правкой (п.4.4 ТЗ fix/yandex-adv-p44) —
     только чистая синхронная проверка счётчиков, без единого await,
     чтобы её можно было безопасно вызывать первой инструкцией в
     обработчике клика (см. goToNextLevel). */
  const AD_LEVELS_INTERVAL = Platform.AD_LEVELS_INTERVAL || 5;
  const AD_MIN_GAP_MS = Platform.AD_MIN_GAP_MS || 90000;
  let levelsSinceAd = 0;
  let lastAdAt = 0;

  function shouldShowInterstitialNow() {
    levelsSinceAd++;
    const now = performance.now();
    const intervalOk = levelsSinceAd >= AD_LEVELS_INTERVAL;
    const cooldownOk = (now - lastAdAt) >= AD_MIN_GAP_MS;
    if (!intervalOk || !cooldownOk) return false;
    levelsSinceAd = 0;
    lastAdAt = now;
    return true;
  }

  /* ---------- Rewarded-подсказка ---------- */
  // ТЗ №22: тост общий для нескольких сообщений — текст выставляется
  // при каждом показе (data-i18n держит только значение по умолчанию).
  function showHintToast(key = 'noMoves', ms = 1800) {
    hintToast.textContent = t(key);
    hintToast.classList.remove('hidden');
    clearTimeout(showHintToast._t);
    showHintToast._t = setTimeout(() => hintToast.classList.add('hidden'), ms);
  }

  /* ---------- ТЗ №22: отклик на ход, обучение, рестарт, помощь ----------
     Game сообщает о событиях хода через hooks (см. Game.init в boot()),
     здесь они превращаются в эффекты (fx.js, Board.popVial), вибрацию
     (Platform.haptic), шаги бестекстового обучения и «зов» кнопок при
     застревании. Правила игры тут не меняются. */
  const btnRestart = document.getElementById('btn-restart');
  const btnUndo = document.getElementById('btn-undo');
  const fxCanvas = document.getElementById('fx-canvas');
  const STUCK_MS = 30000;          // C3: без удачного перелива столько — зовём подсказку
  const TUTORIAL_IDLE_L2_MS = 6000; // A2: на уровне 2 указатель — только при простое
  const RESTART_ARM_MS = 2500;      // A3: окно второго тапа-подтверждения

  function haptic(kind) {
    // Кнопка звука выключает и вибрацию — один «тихий режим» (см. ТЗ №22, «Решено за исполнителя»).
    if (state.muted || typeof Platform.haptic !== 'function') return;
    Platform.haptic(kind);
  }

  let stuckTimer = null;
  let tutorialTimer = null;
  let tutorial = null; // { from, to } — активный указатель обучения

  function clearAttention() {
    btnHint.classList.remove('attention');
    if (btnRestart) btnRestart.classList.remove('attention');
  }

  function armStuckTimer() {
    clearTimeout(stuckTimer);
    stuckTimer = setTimeout(() => {
      if (screens.game.classList.contains('active') && !Game.isSolved()) btnHint.classList.add('attention');
    }, STUCK_MS);
  }

  function startTutorial() {
    if (!screens.game.classList.contains('active') || Game.isSolved()) return;
    const hint = Game.findHint();
    if (!hint) return;
    tutorial = { from: hint.from, to: hint.to };
    Board.setTutorial(hint.from);
  }

  function stopTutorial() {
    clearTimeout(tutorialTimer);
    tutorialTimer = null;
    if (tutorial) { tutorial = null; Board.setTutorial(-1); }
  }

  // Вызывается из loadLevel: обучение — только новичку на уровне 1
  // (N-17: онбординг через сами уровни), на уровне 2 (впервые форма) —
  // лишь если игрок замер.
  function onLevelStarted(idx) {
    stopTutorial();
    clearAttention();
    disarmRestart();
    armStuckTimer();
    const neverCleared = typeof state.levelTimes[idx] !== 'number';
    if (idx === 0 && neverCleared && !state.onboardingSeen) {
      tutorialTimer = setTimeout(startTutorial, 600);
    } else if (idx === 1 && neverCleared) {
      tutorialTimer = setTimeout(startTutorial, TUTORIAL_IDLE_L2_MS);
    }
  }

  // Ушли с уровня (меню/стена) — таймеры помощи не должны сработать позже.
  function leaveLevelHelpers() {
    stopTutorial();
    clearTimeout(stuckTimer);
    clearAttention();
    disarmRestart();
  }

  const gameHooks = {
    onSelect({ index }) {
      haptic('select');
      clearTimeout(tutorialTimer); // игрок действует сам — отложенный указатель не нужен
      if (!tutorial) return;
      Board.setTutorial(index === tutorial.from ? tutorial.to : -1);
    },
    onDeselect() {
      if (tutorial) Board.setTutorial(tutorial.from);
    },
    onInvalid() {
      haptic('invalid');
    },
    onPour({ toIdx, targetLen, element, collected }) {
      stopTutorial();
      clearAttention();
      disarmRestart();
      armStuckTimer();
      const r = Board.getVialClientRect(toIdx);
      if (r && element) {
        const color = Board.COLORS[element.color];
        Fx.setOutline(Board.THEME.outline);
        const cx = r.left + r.width / 2;
        if (collected) {
          Board.popVial(toIdx);
          Fx.burst(cx, r.top, color, r.elSize);
        } else {
          const cy = r.top + r.height - r.tubeBottomMargin - r.elSize / 2 - (targetLen - 1) * (r.elSize + r.elGap);
          Fx.splash(cx, cy + r.elSize * 0.35, color, r.elSize);
        }
      }
      haptic(collected ? 'lock' : 'pour');
    },
    onUndo() {
      clearAttention();
      armStuckTimer();
    },
    onDeadEnd() {
      showDeadEndPrompt();
    },
  };

  function showDeadEndPrompt() {
    showHintToast('deadEnd', 2600);
    if (btnRestart) btnRestart.classList.add('attention');
  }

  let restartArmTimer = null;
  function disarmRestart() {
    clearTimeout(restartArmTimer);
    restartArmTimer = null;
    if (btnRestart) btnRestart.classList.remove('armed');
  }

  function restartLevel() {
    disarmRestart();
    Board.clearHint();
    boardWrap.classList.add('board-fade');
    setTimeout(() => {
      loadLevel(state.levelIndex);
      requestAnimationFrame(() => boardWrap.classList.remove('board-fade'));
    }, prefersReducedMotion() ? 0 : BOARD_FADE_MS);
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      if (Game.isBusy() || Game.isSolved()) return;
      if (!Game.hasMoves()) { disarmRestart(); return; } // поле и так в начальном виде
      if (restartArmTimer) { restartLevel(); return; }
      btnRestart.classList.add('armed');
      showHintToast('restartConfirm', RESTART_ARM_MS);
      restartArmTimer = setTimeout(disarmRestart, RESTART_ARM_MS);
    });
  }

  // Победа: сначала волна колб, затем оверлей (сам учёт победы —
  // сразу, см. showWinOverlay/revealWinOverlay).
  function onLevelWon() {
    leaveLevelHelpers();
    haptic('win');
    showWinOverlay();
  }

  /* Индикатор ожидания rewarded-показа (баг основателя 2026-09-06,
     мобильный ВК): showRewarded() на ВК может не дать НИКАКОГО видимого
     сигнала до REWARD_AD_TIMEOUT_MS (адаптер, до 40с) — известная
     нестабильность моста на части мобильных клиентов (см. журнал
     vk_platform.js). Без индикатора тап по кнопке в этом окне выглядел
     «мёртвым» — игрок не понимал, идёт показ или клик не сработал.
     НЕ автоскрывается по таймеру (в отличие от showHintToast выше) —
     длительность неизвестна заранее, прячется явно из onResume
     (см. вызов ниже) — единственной точки, в которую доходят ВСЕ
     исходы обоих адаптеров, включая «закрыл рекламу без просмотра»
     на Яндексе, где onRewarded вообще не вызывается. */
  function showHintLoadingToast() {
    hintLoadingToast.classList.remove('hidden');
  }
  function hideHintLoadingToast() {
    hintLoadingToast.classList.add('hidden');
  }

  /* ---------- Суточный лимит rewarded (задача 11) ----------
     30 показов/сутки — рекомендация доки ВК, защита от накрутки.
     Сутки — КАЛЕНДАРНЫЕ по локальному времени устройства (не UTC и не
     скользящее окно 24ч) — простая, предсказуемая для игрока модель. */
  const REWARDED_DAILY_LIMIT = 30;
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function checkRewardedDailyReset() {
    const today = todayKey();
    if (state.rewardedDay !== today) {
      state.rewardedDay = today;
      state.rewardedCount = 0;
    }
  }

  /* Баг основателя 2026-09-07 (виден прямо в реальном debug-логе с
     Android): пока первый VKWebAppShowNativeAds(reward) ещё «в полёте»
     (мост может молчать до 40с — REWARD_AD_TIMEOUT_MS), игрок в жизни
     жмёт подсказку ПОВТОРНО («ничего же не происходит») — уходит ВТОРОЙ
     одновременный запрос того же формата. Мост маршрутизирует ответы по
     request_id, но два параллельных запроса — минимум неопределённое
     поведение, а возможно и причина того, что не резолвится НИ ОДИН.
     rewardedInFlight — простой флаг реентерабельности: пока показ уже
     идёт, повторный клик по подсказке молча игнорируется (лог для
     диагностики есть, полноценного UI-сообщения не нужно — индикатор
     «Загрузка рекламы…» и так уже виден). Сбрасывается в onResume —
     той же единственной точке, куда доходят ВСЕ исходы обоих
     адаптеров (см. комментарий у showHintLoadingToast). */
  let rewardedInFlight = false;

  btnHint.addEventListener('click', () => {
    debugLog('[hint] клик по кнопке подсказки');
    if (rewardedInFlight) {
      debugLog('[hint] запрос уже в полёте — игнорирую повторный клик');
      return;
    }
    btnHint.classList.remove('attention');
    const hint = Game.findHint();
    if (!hint) {
      debugLog('[hint] findHint() вернул null — нет доступных ходов, реклама не запрашивается');
      // ТЗ №22, C3: решения от этой позиции нет — вместо тупикового
      // «Нет доступных ходов» показываем выход: рестарт (бесплатный).
      showDeadEndPrompt(); // ролик не показываем зря
      return;
    }
    // ТЗ №14, этап 2/3: баланс бесплатных подсказок (retention.js,
    // награда 2-го дня серии входов) тратится ПЕРВЫМ, до рекламы/
    // суточного лимита — реклама вообще не запрашивается, пока баланс
    // не пуст. Бейдж остатка (renderHintBonusBadge, п.3.2) виден
    // ДО клика (боевое состояние) и уменьшается видимо сразу после траты.
    if (state.bonusHints > 0) {
      debugLog('[hint] бесплатный бонус-баланс (' + state.bonusHints + ' шт.) — реклама не запрашивается');
      state.bonusHints--;
      persist();
      renderHintBonusBadge();
      Board.showHint(hint.from, hint.to);
      return;
    }
    checkRewardedDailyReset();
    if (state.rewardedCount >= REWARDED_DAILY_LIMIT) {
      // Лимит исчерпан — подсказка ВСЁ РАВНО бесплатна, БЕЗ попытки
      // показа рекламы (стандарт п.190: недоступная реклама не тупик;
      // здесь недоступность не техническая, а по лимиту, но принцип
      // тот же). Кнопка НЕ прячется — просто эта конкретная подсказка
      // тихо идёт по бесплатному пути, как при adblock/отсутствии филла.
      // Задача 15: единственный путь исхода rewarded, что решается ЗДЕСЬ,
      // до вызова Platform.showRewarded — адаптер про лимит не знает,
      // поэтому лог тут же, а не в vk_platform.js.
      console.log(`[rewarded] запрос — исчерпан суточный лимит ${state.rewardedCount}/${REWARDED_DAILY_LIMIT}, подсказка выдана бесплатно`);
      debugLog(`[hint] суточный лимит исчерпан (${state.rewardedCount}/${REWARDED_DAILY_LIMIT}) — реклама не запрашивается`);
      Board.showHint(hint.from, hint.to);
      return;
    }
    state.rewardedCount++;
    persist(); // считаем показ сразу, не дожидаясь колбэка рекламы
    debugLog('[hint] иду в Platform.showRewarded()');
    rewardedInFlight = true;
    showHintLoadingToast();
    Platform.showRewarded(
      () => { debugLog('[hint] onRewarded вызван — подсвечиваю ход'); Board.showHint(hint.from, hint.to); }, // награда получена — подсвечиваем ход
      pauseGame,
      // onResume — единственная точка, куда доходят ВСЕ исходы обоих
      // адаптеров (реальный показ, таймаут-фолбэк, И «закрыл без
      // просмотра» на Яндексе, где onRewarded вообще не вызывается) —
      // rewardedInFlight сбрасывается ЗДЕСЬ ЖЕ (не в onRewarded), той
      // же логикой, что и hideHintLoadingToast чуть выше по коду.
      () => { rewardedInFlight = false; hideHintLoadingToast(); resumeGame(); }
    );
  });

  /* ---------- Победа / переход уровней ----------
     pendingWinTransition — что делать по клику «Дальше», решено ЗДЕСЬ,
     в момент победы, а не пересчитано заново в обработчике клика. Это
     не стиль, а необходимость (см. краевой случай ниже, фаза 3): для
     обычного перехода state.levelIndex продвигается уже в
     showWinOverlay(), и если бы btnNext пересчитывал «какой уровень
     следующий» из ТЕКУЩЕГО state.levelIndex в момент клика, он бы
     получил уже сдвинутое значение и промахнулся на один уровень
     вперёд. */
  let pendingWinTransition = null;

  function showWinOverlay() {
    // Активное время уровня (Вариант Б, stats.js) фиксируется РОВНО в
    // момент победы — до этого таймер нигде не показывается игроку.
    const seconds = Stats.finishLevel();
    const finishedIdx = state.levelIndex; // 0-индексный, только что пройденный
    // ТЗ №15, п.1.2: списание строго одно — новый, ЕЩЁ НЕ пройденный
    // уровень завершён. Флаг снят ДО перезаписи levelTimes[finishedIdx]
    // ниже — иначе к моменту проверки уровень уже выглядел бы «пройден»
    // всегда (та же проверка, что canStartLevel/callbacks.isCompleted
    // модуля). Рестарт/повтор уже пройденного уровня сюда не попадает
    // вообще — energy не трогаем.
    const isFirstCompletion = typeof state.levelTimes[finishedIdx] !== 'number';
    state.levelTimes[finishedIdx] = seconds;
    if (isFirstCompletion && typeof Retention !== 'undefined' && _retentionState) {
      _retentionState = Retention.spendEnergy(_retentionState, RETENTION_CONFIG);
      renderEnergyIndicator(); // «расход виден... заметно, не молча» (п.1.4)
    }

    const finishedLevelNumber = finishedIdx + 1;
    const nextIdx = finishedIdx + 1;
    const isChapterEnd = finishedLevelNumber % CHAPTER_SIZE === 0;
    const isCampaignEnd = nextIdx >= LEVELS.length;
    pendingWinTransition = { nextIdx, isChapterEnd, isCampaignEnd, chapterNum: finishedLevelNumber / CHAPTER_SIZE };

    // Полоса прогресса главы: N из 12, N = позиция ВНУТРИ текущей главы
    // (1..12), из levelIndex — новых полей сейва не заводим.
    const posInChapter = ((finishedLevelNumber - 1) % CHAPTER_SIZE) + 1;
    winProgressFill.style.width = (posInChapter / CHAPTER_SIZE * 100) + '%';
    winProgressLabel.textContent = `${posInChapter} ${t('of')} ${CHAPTER_SIZE}`;

    /* КРАЕВОЙ СЛУЧАЙ (задача фаза 3): точка «Продолжить» продвигается
       ЗДЕСЬ, в момент завершения уровня — не по клику «Дальше» и не по
       факту предзагрузки следующего. Иначе выход в меню/перезагрузка
       страницы с этого экрана (до клика «Дальше») вернули бы игрока на
       ТОЛЬКО ЧТО пройденный уровень (state.levelIndex ещё не сдвинут) —
       он решал бы пройденный уровень заново (не «пропуск», но и не
       корректное продолжение). Сдвигаем levelIndex/maxUnlocked и
       сохраняем ПОЛНЫЙ объект одним действием — это и есть «сейв по
       факту завершения уровня». ТОЛЬКО для обычного перехода: глава/
       финал остаются как есть (их продвижение — штатная логика
       goToNextLevel/loadLevel по клику «Дальше» на СВОИХ оверлеях).
       ПЕРЕСМОТРЕНО (задача 8): Board.setLevel(LEVELS[nextIdx]) здесь
       БОЛЬШЕ НЕ ВЫЗЫВАЕТСЯ — раньше следующий уровень отрисовывался
       ПОД оверлеем победы, пока ещё летит конфетти, и игрок видел
       смену поля до того, как понял, что уровень сменился. Канвас
       остаётся на ТОЛЬКО ЧТО пройденном (собранном) уровне до самого
       клика «Дальше»; фактическая смена данных — в loadLevel(), внутри
       goToNextLevel(), с видимым fade-переходом (см. ниже). */
    if (!isChapterEnd && !isCampaignEnd) {
      state.levelIndex = nextIdx;
      state.maxUnlocked = Math.max(state.maxUnlocked, nextIdx);
    }

    // ТЗ №22: обучение пройдено (флаг жил в сейве, но не использовался);
    // цель дня засчитывает победу ДО persist() — одна запись на событие.
    if (finishedIdx === 0) state.onboardingSeen = true;
    const daily = registerDailyWin();
    renderWinDaily(daily);
    if (daily.rewarded) renderHintBonusBadge();

    persist(); // переживает закрытие вкладки отсюда же
    // ТЗ №22, B2: учёт победы выше — сразу; оверлей — после волны колб
    // (~0,4–0,7 с), чтобы собранное поле успело «отпраздновать» само.
    const transition = pendingWinTransition;
    Board.waveVials(() => {
      // Игрок мог уйти в меню во время волны — тогда оверлей не нужен:
      // прогресс уже сохранён, «Играть» продолжит со следующего уровня.
      if (pendingWinTransition !== transition || !screens.game.classList.contains('active')) return;
      winOverlay.classList.remove('hidden');
      Confetti.burst(); // «вау»-момент; сама уважает prefers-reduced-motion
      if (daily.rewarded) {
        showRetentionToast(t('dailyGoalReward').replace('{n}', DAILY_REWARD_HINTS));
      }
    });
  }
  function hideWinOverlay() {
    winOverlay.classList.add('hidden');
  }

  /* Баг-регрессия (docs/reports/BUG_levels_mutate_on_replay.md, ТЗ №5
     задача A1): ходы игрока (game.js splice/push) мутируют vials НА
     МЕСТЕ. Раньше loadLevel передавал ссылку на LEVELS[idx] прямиком —
     мутация уходила в мастер-каталог и оставалась там до перезагрузки
     страницы, второй заход на пройденный уровень показывал его уже
     собранным. Клонируем ТОЛЬКО vials (тот же приём, что game.js
     cloneVials) — формат уровня { vials } больше ничего не содержит
     (levels.js), глубже клонировать нечего: элементы внутри плоские
     {color, shape} и никогда не мутируются на месте, только
     переставляются между колбами. */
  function cloneLevel(lvl) {
    return { vials: lvl.vials.map(v => v.slice()) };
  }

  function loadLevel(idx) {
    state.levelIndex = idx;
    state.maxUnlocked = Math.max(state.maxUnlocked, idx);
    const level = cloneLevel(LEVELS[idx]);
    levelIndicator.textContent = `${t('level')} ${idx + 1}`; // без «/ всего» — общее число уровней игроку не показываем
    syncHeaderSpace();
    hideWinOverlay();
    Board.setLevel(level);
    Game.setLevel(level);
    Stats.startLevel(idx);
    if (typeof Fx !== 'undefined') Fx.clear();
    onLevelStarted(idx);
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  /* 4 цифры экрана завершения кампании: общее, среднее, самый быстрый,
     самый долгий уровень — по всем записанным активным временам. */
  function computeCampaignStats() {
    const times = state.levelTimes.filter(v => typeof v === 'number' && v >= 0);
    const total = times.reduce((a, b) => a + b, 0);
    const average = times.length ? total / times.length : 0;
    const fastest = times.length ? Math.min(...times) : 0;
    const slowest = times.length ? Math.max(...times) : 0;
    return { total, average, fastest, slowest };
  }

  /* Те же 4 цифры, но СРЕЗ ТОЛЬКО по уровням этой главы (CHAPTER_SIZE
     штук) — chapterNum считается от 1 (глава 1 = уровни 1-12). Ничего
     нового в сейве не заводим: и это, и computeCampaignStats читают
     один и тот же state.levelTimes[]. */
  function computeChapterStats(chapterNum) {
    const startIdx = (chapterNum - 1) * CHAPTER_SIZE;
    const endIdx = startIdx + CHAPTER_SIZE;
    const times = state.levelTimes.slice(startIdx, endIdx).filter(v => typeof v === 'number' && v >= 0);
    const total = times.reduce((a, b) => a + b, 0);
    const average = times.length ? total / times.length : 0;
    const fastest = times.length ? Math.min(...times) : 0;
    const slowest = times.length ? Math.max(...times) : 0;
    return { total, average, fastest, slowest };
  }

  function hideChapterOverlay() {
    chapterOverlay.classList.add('hidden');
  }

  /* Экран «Глава N пройдена» — вызывается из btnNext ПЕРЕД переходом на
     следующий уровень (сам win-overlay уровня, showWinOverlay выше, не
     трогаем и не меняем — это отдельный, более лёгкий оверлей поверх
     той же механики паузы/сохранения). Фанфары нет (эксклюзив финала,
     решение постановки), конфетти короче (см. confetti.js opts). */
  function showChapterCompleteOverlay(chapterNum) {
    hideWinOverlay();
    const stats = computeChapterStats(chapterNum);
    chapterTitleEl.textContent = `${t('chapter')} ${chapterNum} ${t('chapterComplete')}`;
    chapterStatTotalEl.textContent = formatTime(stats.total);
    chapterStatAverageEl.textContent = formatTime(stats.average);
    chapterStatFastestEl.textContent = formatTime(stats.fastest);
    chapterStatSlowestEl.textContent = formatTime(stats.slowest);
    chapterOverlay.classList.remove('hidden');
    Sound.playChapterWin(); // задача 9: чуть богаче обычного playWin, короче playFanfare
    Confetti.burst({ count: 18, durationMs: 1200 }); // короче и реже финальных — глава легче
  }

  function showCampaignCompleteOverlay() {
    hideWinOverlay();
    const stats = computeCampaignStats();
    statTotalEl.textContent = formatTime(stats.total);
    statAverageEl.textContent = formatTime(stats.average);
    statFastestEl.textContent = formatTime(stats.fastest);
    statSlowestEl.textContent = formatTime(stats.slowest);
    campaignOverlay.classList.remove('hidden');
    Sound.playFanfare();
    Confetti.burst();
  }
  btnCampaignMenu.addEventListener('click', () => {
    campaignOverlay.classList.add('hidden');
    goToMenu();
  });

  /* ---------- Fade-переход между уровнями (задача 8) ----------
     Смена данных уровня (loadLevel → Board.setLevel) физически
     происходит ПОСРЕДИ короткого fade-out, пока канвас уже невидим —
     игрок не видит момент подмены, только плавное затемнение старого
     поля и появление нового. ТЗ №10, задача E: длительность приведена к
     общему токену игры (style.css --transition-ms=200ms, было 180 —
     число ЗДЕСЬ и там ОБЯЗАНЫ совпадать: JS-таймер решает, когда
     подменить данные, CSS-transition решает, сколько холст реально
     невидим — разойдутся числа, подмена уровня станет видна на
     полупрозрачном холсте). Также используется applyTheme() ниже —
     тот же приём для смены темы, пока игровой экран виден. */
  const BOARD_FADE_MS = 200;

  /* Общий переход «на следующий уровень» — используется и обычным
     btnNext (см. ниже), и кнопкой «Дальше» экрана главы.

     ПЕРЕСТРОЕНО (fix/yandex-adv-p44, п.4.4 требований площадки —
     задержка показа interstitial ≤330мс от действия игрока). Раньше:
     оверлей → fade → setTimeout(180мс) → и только потом реклама —
     сам setTimeout уже выбрасывал за лимит, до вызова рекламы. Теперь:
     проверка кулдауна (чистая синхронная арифметика, см.
     shouldShowInterstitialNow) и, если реклама нужна, её вызов —
     ПЕРВЫЕ инструкции обработчика, без await/setTimeout/анимации/
     отрисовки перед ними. Всё остальное — скрытие оверлеев, fade,
     загрузка следующего уровня, сейв — уходит в proceedToLevel(),
     которая выполняется в колбэке закрытия рекламы (или сразу, если
     реклама в этот раз не положена по кулдауну). Колбэк ошибки показа
     в platform.js уже ведёт в тот же onResume, что и onClose (см.
     showInterstitial) — здесь дополнительно разводить не нужно,
     игрок никогда не застревает (п.4.2.5 ТЗ). */
  function goToNextLevel(nextIdx) {
    function proceedToLevel() {
      // ТЗ №15: раньше эта функция всегда запускалась, уже находясь на
      // игровом экране (переход между уровнями мид-плей). Теперь
      // requestStartLevel мог по дороге показать стену энергии
      // (show('energyWall')) — без этой строки после рекламы игрок
      // остался бы визуально на стене, хотя loadLevel() уже отработал
      // в фоне (найдено кадром приёмки). show() идемпотентен — если
      // экран и так игровой, вызов безвреден.
      show('game');
      hideWinOverlay();
      hideChapterOverlay();
      boardWrap.classList.add('board-fade');
      setTimeout(() => {
        loadLevel(nextIdx);
        // Точка сохранения (Фаза 4): levelIndex обновился — прогресс продвинулся.
        // НЕ сохраняем на каждый ход/кадр — только на переходе уровня и звуке.
        persist();
        // Убираем класс на следующем кадре — иначе браузер может схлопнуть
        // add+remove в один рендер и transition не проиграется.
        requestAnimationFrame(() => boardWrap.classList.remove('board-fade'));
      }, prefersReducedMotion() ? 0 : BOARD_FADE_MS); // ТЗ №10, задача E
    }
    function proceedWithAdCheck() {
      if (shouldShowInterstitialNow()) {
        Platform.showInterstitial(
          () => { advDiagMarkAdOpen(); pauseGame(); }, // onOpen: сюда SDK приходит первым — момент фактического открытия рекламы
          () => { resumeGame(); proceedToLevel(); },   // onClose/onError (см. platform.js) — единая точка продолжения
          advDiagMarkCall                              // ТЗ №1 задача C: наша часть задержки, измеримо и без SDK
        );
      } else {
        proceedToLevel();
      }
    }
    // ТЗ №15, этап 1: гейт энергии — ДО проверки интерстишла (нечего
    // показывать рекламу между уровнями, если следующий уровень вообще
    // не может начаться). canStartLevel — синхронная дешёвая проверка,
    // не нарушает п.4.3/4.4 (задержка показа интерстишла ≤330мс —
    // requestStartLevel не вводит await/setTimeout/анимацию перед ним
    // в основном пути, где энергия есть).
    requestStartLevel(nextIdx, proceedWithAdCheck);
  }

  // Замер задержки показа рекламы (dev-режим, п.4.3 ТЗ): pointerdown
  // срабатывает раньше click — ближе к моменту реального касания/клика.
  btnNext.addEventListener('pointerdown', advDiagMarkInput);
  btnChapterNext.addEventListener('pointerdown', advDiagMarkInput);

  btnNext.addEventListener('click', () => {
    // Решение принято в showWinOverlay() (см. pendingWinTransition
    // выше) — не пересчитываем заново из state.levelIndex, он для
    // обычного перехода уже продвинут к этому моменту.
    const transition = pendingWinTransition;
    pendingWinTransition = null;
    if (!transition) return; // защита: клик без предшествующего showWinOverlay быть не должен
    if (transition.isCampaignEnd) {
      // Кампания пройдена целиком — экран завершения вместо тихого
      // возврата в меню (levelIndex остаётся на последнем уровне,
      // сохранён уже в showWinOverlay). Проверяется ПЕРВЫМ — уровень
      // 156 кратен CHAPTER_SIZE, но здесь это финал, не глава.
      showCampaignCompleteOverlay();
      return;
    }
    if (transition.isChapterEnd) {
      showChapterCompleteOverlay(transition.chapterNum);
      return;
    }
    goToNextLevel(transition.nextIdx);
  });

  btnChapterNext.addEventListener('click', () => {
    goToNextLevel(state.levelIndex + 1);
  });

  /* ---------- Кнопки меню ----------
     «Играть» — единственный вход в игру, ведёт на state.levelIndex
     (бывшее поведение «Продолжить»). Решение основателя: путь,
     стирающий прогресс без подтверждения, из UI убран целиком —
     отдельной кнопки «Продолжить»/сброса больше нет. */
  function playGame() {
    // ТЗ №15, этап 1: гейт энергии — state.levelIndex может указывать
    // на уже пройденный уровень (игрок заходил через сетку на старый
    // тайл) — canStartLevel это учитывает, повтор бесплатен.
    requestStartLevel(state.levelIndex, () => {
      show('game');
      loadLevel(state.levelIndex);
    });
  }
  btnPlay.addEventListener('click', playGame);
  btnBack.addEventListener('click', () => {
    Stats.stop(); // ушли с уровня без победы — незавершённый отрезок не считаем
    goToMenu();
  });

  /* Любой тап по игровому экрану — сигнал активности для таймера
     (Вариант Б, stats.js): выводит счёт из простоя, если он там стоял. */
  screens.game.addEventListener('pointerdown', () => Stats.onInput());

  /* п.1.6.2.7: над полем ПКМ/протяжка не должны открывать системное
     меню браузера (user-select уже погашен в CSS). */
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  /* ---------- Пауза при сворачивании (п.1.3) ---------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseGame();
    } else {
      resumeGame();
    }
  });

  /* ---------- Запуск ---------- */
  /* Приводит только что загрученный/смёрженный state к валидному виду
     (границы уровней, миграция полей) — общая часть между обычным
     стартом и успехом фонового ретрая ниже, не дублируем правила. */
  function normalizeState() {
    // Граничный случай: сейв битый/уровней стало меньше, чем в сейве
    // (или игрок прошёл все уровни — levelIndex остаётся на последнем,
    // это НЕ выходит за границы массива) — подстраховка от краша.
    if (state.levelIndex < 0 || state.levelIndex >= LEVELS.length) {
      state.levelIndex = 0;
    }
    if (!Array.isArray(state.levelTimes)) state.levelTimes = [];
    if (typeof state.maxUnlocked !== 'number' || state.maxUnlocked < state.levelIndex) {
      state.maxUnlocked = state.levelIndex; // сейв старее этого поля — считаем открытым хотя бы то, что уже пройдено
    }
    if (state.maxUnlocked >= LEVELS.length) state.maxUnlocked = LEVELS.length - 1;
    if (typeof state.rewardedCount !== 'number' || state.rewardedCount < 0) state.rewardedCount = 0;
    if (typeof state.rewardedDay !== 'string') state.rewardedDay = '';

    // Миграция магазина (ТЗ №2, Фаза 3 п.4): старый сейв нёс одиночное
    // themeOwned:boolean (только «морская», единственная покупка на тот
    // момент) — сворачиваем в ownedThemes[]/selectedTheme, старое поле
    // в сейв больше не пишем (объект пишется целиком — новых полей
    // достаточно, оставлять «мёртвое» поле незачем).
    if (!Array.isArray(state.ownedThemes)) state.ownedThemes = [];
    const migratingLegacyThemeOwned = state.themeOwned === true; // поле было в сейве ДО merge — проверяем ДО delete
    if (migratingLegacyThemeOwned && !state.ownedThemes.includes('sea')) {
      state.ownedThemes.push('sea');
    }
    delete state.themeOwned;
    if (migratingLegacyThemeOwned) {
      // Старое поведение (до выбора темы существовало только неявно):
      // владеешь — значит применена. БЕЗУСЛОВНО — не через validSelected
      // ниже (баг, живая приёмка ТЗ №3 задача D2): в этом легаси-формате
      // поля selectedTheme в сейве вообще НЕ было, а начальный state.
      // selectedTheme='default' (объявление выше по файлу) переживает
      // Object.assign(state, loadResult.data) НЕТРОНУТЫМ — «selectedTheme
      // === 'default'» ниже тогда ложно читается как «уже валидно
      // выбрано», и applied-по-факту-владения правило не срабатывало.
      state.selectedTheme = 'sea';
    }
    // ТЗ №14, этап 2: giftedThemes (объединение владения — isThemeOwned)
    // ДО валидации selectedTheme ниже, иначе подаренная-и-применённая
    // тема, ещё не отражённая в ownedThemes, ложно считалась бы невалидной
    // и откатывалась на 'default' прямо здесь, до первого reconcile.
    if (!Array.isArray(state.giftedThemes)) state.giftedThemes = [];
    if (typeof state.bonusHints !== 'number' || state.bonusHints < 0) state.bonusHints = 0;

    const validSelected = state.selectedTheme === 'default' || isThemeOwned(state.selectedTheme);
    if (typeof state.selectedTheme !== 'string' || !validSelected) {
      state.selectedTheme = 'default';
    }

    // lastChosenTheme (ТЗ №7, задача B): миграция старого сейва — поля
    // не было. Другого источника правды для истории выбора нет, поэтому
    // если СЕЙЧАС применена купленная тема, считаем её осознанным
    // выбором (restore-логика в reconcileOwnership тогда не откатит уже
    // применённое состояние на 'default' и обратно — no-op).
    if (typeof state.lastChosenTheme !== 'string') state.lastChosenTheme = null;
    if (!state.lastChosenTheme && state.selectedTheme !== 'default' && isThemeOwned(state.selectedTheme)) {
      state.lastChosenTheme = state.selectedTheme;
    }

    // Сейв мог пролежать со вчера — обнулить суточный счётчик rewarded
    // при заходе в новый день. Внутри normalizeState (не отдельным
    // вызовом в boot()), чтобы фоновый ретрай load() ниже тоже это
    // подхватывал при мёрдже реальных данных, а не только первый заход.
    checkRewardedDailyReset();

    // ТЗ №22, C1: миграция цели дня — поля появились в этом ТЗ.
    if (typeof state.dailyDay !== 'string') state.dailyDay = '';
    if (typeof state.dailyWins !== 'number' || state.dailyWins < 0) state.dailyWins = 0;
    if (typeof state.dailyDone !== 'boolean') state.dailyDone = false;
    if (typeof state.onboardingSeen !== 'boolean') state.onboardingSeen = false;
    checkDailyGoalReset();
  }

  /* Инициализация/восстановление retention.js — ОБЩАЯ между обычным
     стартом (boot()) и успехом фонового ретрая (см.
     retryLoadInBackground) — не дублируем правила. isBrandNew — ТОЛЬКО
     если сейва не было вовсе (loadResult.data пуст) — Color Sort
     дефолтит maxUnlocked=0 даже для настоящего новичка, поэтому
     «maxUnlocked<0» (как у нонограмм) здесь не сработал бы отличить
     новичка от игрока, легитимно застрявшего на уровне 0.
     ТЗ №15: с gateMode:'energy' initState() параметр maxReachedIndex
     (и, значит, isBrandNew) больше НЕ ВЛИЯЕТ на итог — энергия всегда
     стартует полной, независимо от прогресса (щедрость, п.1.1). Вызов
     оставлен как есть (передаём честное значение) — модуль сам решает,
     что с ним делать по режиму, main.js в это не лезет. */
  function bootRetention(isBrandNew) {
    if (typeof Retention === 'undefined') return;
    // ТЗ №18: та же единая точка, что в retentionTick() — Platform.now(),
    // не Date.now(). dayKeyFromDate(new Date()) ниже — СЕРИЯ ВХОДОВ
    // (календарный день по местному времени устройства), намеренно
    // отдельный источник времени: этот ТЗ серию не правит, только
    // докладывает о её поведении в сценариях перевода часов (см. отчёт).
    const nowMs = Platform.now();
    const hadValidRetention = Retention.isValidEncoded(state.retention);
    _retentionState = hadValidRetention
      ? Retention.decodeState(state.retention)
      : Retention.initState(isBrandNew ? -1 : state.maxUnlocked, nowMs, RETENTION_CONFIG);
    // ТЗ №21, часть B (решение основателя: +40, одноразово): модерация
    // Яндекса отклонила билд по п.2.9 — прохождение на одной стартовой
    // энергии (потолок 10) занимало у модератора ~2 минуты. Бонус
    // начисляется ТОЛЬКО реально новому игроку (isBrandNew — сейва не
    // было вовсе, см. boot()), ТОЛЬКО в момент первой инициализации
    // retention.js (!hadValidRetention — та же ветка, что initState()
    // выше) и ТОЛЬКО в gateMode:'energy' (у других игр студии этот же
    // модуль работает в gateMode:'unlock', там валюта другая). Дальше
    // одноразовость держится структурой кода САМА: при следующем boot()
    // state.retention уже валиден, initState() сюда не попадёт снова —
    // это подтверждено тестом (см. tests/), не считается самоочевидным.
    if (isBrandNew && !hadValidRetention && RETENTION_CONFIG.gateMode === 'energy') {
      _retentionState = { ..._retentionState, dripOpened: _retentionState.dripOpened + 40 };
      // Сразу persist() — та же дисциплина, что у grantHints/наград
      // серии (см. комментарий ниже про beforeTick): награда обязана
      // пережить закрытие вкладки сразу после boot(), не полагаться на
      // то, что персист случится позже по другому событию.
      persist();
    }
    // ТЗ №18 (сценарий A, найдено при проверке — не новая механика):
    // тик, применённый ЗДЕСЬ (энергия, набежавшая, пока игра была
    // закрыта), раньше нигде не сохранялся сам по себе — задержка
    // расчёта висела ТОЛЬКО в памяти сессии до следующего persist()
    // (по любому другому событию). Разница на экране не видна (рендер
    // идёт из живого _retentionState), но реальный сейв на площадке
    // оставался со СТАРЫМ штампом — если игрок закрывал игру сразу
    // после открытия, ничего не потеряно (тик у него честно
    // пересчитается заново на следующем старте от того же старого
    // штампа), но и ничего не выигрывалось: третий пример студийного
    // принципа «тихих улучшений не бывает» (см. retentionTick) — запись
    // обязана сопровождать реальную выдачу, а не просто рендер.
    const beforeTick = _retentionState.dripOpened;
    _retentionState = Retention.applyDripTick(_retentionState, nowMs, RETENTION_CONFIG);
    if (_retentionState.dripOpened > beforeTick) persist();
    // День засчитывается фактом входа (не прохождением уровня) — один
    // раз на старте сессии.
    const entryResult = Retention.onEnter(_retentionState, Retention.dayKeyFromDate(new Date()), RETENTION_CONFIG);
    _retentionState = entryResult.state;
    if (entryResult.reward === 'hints') RETENTION_CONFIG.callbacks.grantHints(RETENTION_CONFIG.hintsRewardCount);
    else if (entryResult.reward === 'style') RETENTION_CONFIG.callbacks.grantStyle();
    // Бейдж — ЕЩЁ РАЗ безусловно (не только внутри grantHints выше):
    // восстановленный из сейва баланс с ПРОШЛОЙ сессии тоже обязан
    // сразу отражаться, не только свежевыданная награда этой сессии.
    renderHintBonusBadge();
  }

  /* Фоновый повтор Platform.load() после сбоя при старте (ТЗ №2, Фаза 3
     п.3): гейт сейва остаётся закрытым (persist() — no-op), пока одна
     из попыток не вернёт ok:true. Три попытки с растущей паузой — сеть
     обычно отходит за секунды; если нет, сейв остаётся не пишущимся до
     перезагрузки страницы — безопаснее, чем стереть реальный прогресс
     дефолтным состоянием. */
  function retryLoadInBackground(attempt) {
    const delaysMs = [3000, 8000, 20000];
    if (attempt > delaysMs.length) {
      console.error('[save] load() не удался после всех попыток — запись отключена до перезагрузки страницы');
      return;
    }
    setTimeout(async () => {
      const result = await Platform.load();
      if (!result.ok) {
        console.error(`[save] повторная попытка ${attempt} не удалась`, result.error);
        retryLoadInBackground(attempt + 1);
        return;
      }
      if (result.data && typeof result.data.levelIndex === 'number') {
        Object.assign(state, result.data);
        normalizeState();
        if (themeAvailableHere(state.selectedTheme)) applyTheme(state.selectedTheme); // ТЗ №17, см. гейт в boot()
        renderShop();
        renderOformlenie(); // ТЗ №17: поздно приехавший сейв меняет состав владения
      }
      // Гейт — ДО bootRetention(): grantHints/grantStyle внутри неё сами
      // зовут persist() (ТЗ №14, этап 3, добор), с закрытым гейтом эта
      // запись молча пропала бы (см. persist()).
      saveGateOpen = true;
      // Первая попытка load() сорвалась — retention.js до этого момента
      // не инициализирован вовсе (см. boot()), делаем это здесь тем же
      // путём. isBrandNew=false: настоящий новичок получил бы ok:true
      // сразу, а не ошибку сети — этот путь для игроков с реальным
      // прогрессом, которым не повезло с сетью на старте.
      bootRetention(false);
      renderEnergyIndicator(); // игрок мог уже сидеть на меню/игре, пока шёл ретрай — освежаем сразу
      console.log('[save] повторная загрузка успешна — запись сейва разрешена');
    }, delaysMs[attempt - 1]);
  }

  async function boot() {
    Board.init(boardCanvas);
    Confetti.init(confettiCanvas);
    if (typeof Fx !== 'undefined' && fxCanvas) Fx.init(fxCanvas);
    Game.init(boardCanvas, onLevelWon, gameHooks);

    await Platform.init();

    // Автоязык из SDK (п.2.14)
    setLanguage(Platform.getLang());

    // Восстановление прогресса (гостевой сейв платформы, ТОЛЬКО через
    // Platform.load — без localStorage и без прямых вызовов ysdk).
    // {ok, data, error}: ok:true+data:null — легитимно пусто (первый
    // запуск ИЛИ dev-режим без SDK); ok:false — вызов не удался, это
    // НЕ «пусто» — состояние остаётся дефолтным ТОЛЬКО в памяти, гейт
    // сейва не открывается, чтобы полный объект-сейв не стёр реальный
    // прогресс на сервере (см. persist()/retryLoadInBackground).
    const loadResult = await Platform.load();
    let isBrandNewPlayer = false;
    if (loadResult.ok) {
      if (loadResult.data && typeof loadResult.data.levelIndex === 'number') {
        Object.assign(state, loadResult.data);
      } else {
        isBrandNewPlayer = true; // легитимно пусто — первый запуск (ТЗ №14, этап 2)
      }
      saveGateOpen = true;
    } else {
      console.error('[save] load() не удался при старте — играем на дефолтах, запись сейва временно отключена', loadResult.error);
      retryLoadInBackground(1);
    }
    normalizeState(); // включает checkRewardedDailyReset()
    // ТЗ №14, этап 2: retention.js — ТОЛЬКО если load() реально
    // подтвердился (ok:true) — тот же принцип, что у saveGateOpen: не
    // инициализировать поверх состояния, которое ещё может замениться
    // реальными данными (retryLoadInBackground сделает это сам при
    // успехе повторной попытки).
    if (loadResult.ok) bootRetention(isBrandNewPlayer);
    // Задача 15: диагностика — основатель наблюдал подсказки без рекламы
    // и не мог отличить причину. Состояние счётчика на старте — первая
    // подсказка при разборе живого лога устройства.
    console.log(`[rewarded] состояние при старте: ${state.rewardedCount}/${REWARDED_DAILY_LIMIT}, дата последнего засчитанного показа: ${state.rewardedDay || '(нет — ещё не показывали)'}`);
    updateBuildBadge();
    applyMuteIcon();
    // ТЗ VK_remove_shop / unify_repo фаза 2, задача B: витрина выключена
    // флагом — рендер идёт БАЗОВОЙ темой независимо от того, что лежит
    // в сейве (красная линия: сейв при этом НЕ трогаем и НЕ перезаписываем,
    // ownedThemes/selectedTheme остаются как есть, просто не применяются).
    // ТЗ №14, этап 3 (добор): карве-аут giftedThemes из этапа 2 УБРАН —
    // grantStyle больше не переключает тему автоматически (см. комментарий
    // там), правило снова без исключений на обеих площадках.
    // ТЗ №17: гейт был `Platform.SHOP_SUPPORTED` — на ВК не применялась
    // НИКАКАЯ тема, потому что до появления «Оформления» игрок там не мог
    // выбрать её законно. Теперь может (подарок за серию входов), и выбор
    // ОБЯЗАН переживать перезагрузку. Гейт сузился до themeAvailableHere:
    // подаренная тема применяется на обеих площадках, платная — только
    // там, где её реально можно купить. Сейв по-прежнему не трогаем.
    if (themeAvailableHere(state.selectedTheme)) {
      applyTheme(state.selectedTheme); // переживает перезагрузку — реальная покупка/подарок/выбор, не превью
    }
    updateShopButtonVisibility();
    renderOformlenie(); // ТЗ №17: состав экрана известен уже на старте

    goToMenu();
    // ТЗ №22, A1: настоящий новичок (сейва не было) — сразу на уровень 1,
    // без меню: первое действие в первые секунды (N-26), а энергия и
    // серия входов объясняются позже, когда игрок вернётся в меню.
    if (isBrandNewPlayer) playGame();

    // Game Ready — когда игра реально готова к взаимодействию (п.1.19.2)
    Platform.gameReady();

    // Магазин — сеть (getCatalog/getPurchases), не блокируем им Game
    // Ready/меню; UI обновится асинхронно, когда каталог придёт.
    initShop();
  }

  boot();
})();
