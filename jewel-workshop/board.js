/* ============================================================
   board.js — отрисовка колб и элементов на Canvas + геометрия/анимация.
   Фаза 1: рендер уровня. Фаза 2: хит-тест, подсветка выбора,
   анимация перелива, «дрожание» при недопустимом ходе.
   Правила хода (что можно, что нельзя) — в game.js; board.js только
   знает пиксели и умеет плавно анимировать переход между ними.

   sameType(a, b) объявлена уже сейчас (задел из CLAUDE.md): сравнение
   элементов идёт через ОДНУ функцию, чтобы позже можно было подменить
   правило (напр. графом смешения цветов), не трогая движок.
   ============================================================ */
const Board = (() => {
  const VIAL_CAPACITY = 4;

  const SHAPE = { CIRCLE: 'circle', SQUARE: 'square', DIAMOND: 'diamond' };

  /* Тёплая палитра студии: 3 цвета, разведённые ПО СВЕТЛОТЕ (светлый/
     средний/тёмный), не только по тону — задача 5, живой прогон нашёл,
     что горчичный и сливовый читались почти одинаково темными на
     мобиле/при дальтонизме (яркость по каналу L различалась <25%
     между соседними ступенями). Проверено автотестом (grayscale-лума
     ITU-R 601, тот же, что Pillow .convert('L')): c3→c1 разрыв 37.2%,
     c1→c2 разрыв 26.2% — оба выше порога ≥25%.

     ТЗ №9, задача A: c1 сдвинут #b7502e→#d25c35 (luma601 107→123,
     +15%) — единственный способ найти ОДИН цвет обводки темы,
     проходящий ≥2.0:1 против ВСЕХ трёх заливок и фона поля одновременно
     (см. THEME.outline и отчёт ТЗ №9 — c1 сидел ровно посередине между
     «обводка должна быть темнее c3» и «обводка должна быть светлее
     c2/paper», зазора не было ни при какой обводке без сдвига c1).
     Это МИНИМАЛЬНЫЙ сдвиг: найден перебором как самая узкая правка,
     сохраняющая luma-разрыв c1↔c2 ≥25% (получилось 26.2% — было 32.4%,
     запас сузился, но порог не нарушен). Направление темы (терракота)
     не изменено — c1 остался тем же оттенком, просто светлее. c2/c3 не
     трогались. --accent в style.css (кнопки) от c1 НЕ зависит и
     сохранил старое значение #b7502e — акцент интерфейса и заливка
     фигуры-c1 теперь разные оттенки терракоты (см. отчёт). */
  const COLORS = {
    c1: '#d25c35', // терракота (ТЗ №9: сдвинута светлее ради обводки) — luma≈123
    c2: '#e8bb5c', // светлый горчично-золотой — luma≈190
    c3: '#2c1611'  // тёплый тёмный оксблад/слива (ТЗ №4 задача A — разведена
                    // от Ягодной, см. check_palette.py межтемный ассерт)
  };

  /* ТЗ №4, задача B: THEME — canvas не читает CSS-переменные, поэтому
     обводочные/акцентные цвета канвы держим отдельным мутируемым
     объектом (тот же приём, что уже был у COLORS) — main.js applyTheme()
     подменяет THEME.ink/accent/outline ВМЕСТЕ с COLORS.c1/c2/c3 на
     каждую смену темы. Значения по умолчанию — Тёплая (совпадают с
     style.css :root, но независимы: канва рисуется без DOM-стилей). */
  const THEME = {
    ink: '#2b2723',
    // ТЗ №10, задача C: приведён к style.css --accent (#d25c35, = c1) —
    // держим оба в синхроне, как гласит коммент к THEME выше. Раньше
    // #b7502e совпадал со СТАРЫМ --accent; после правки CSS-токена он бы
    // разошёлся сам по себе, если не тронуть здесь тоже.
    accent: '#d25c35',
    /* ТЗ №9, задача A: единая обводка фигур на тему — раньше outlineFor()
       выбирала ink ИЛИ outlineLight под КАЖДУЮ заливку отдельно (тёмная
       заливка получала белый контур, светлая — чёрный), из-за чего одно
       поле показывало одновременно белые и чёрные обводки — разнобой,
       читался как недоделка. THEME.outline — ОДИН цвет на тему,
       используется для всех фигур без исключения (drawElement).
       Подобран так, чтобы контраст ≥2.0:1 держался разом против ВСЕХ
       трёх заливок И фона поля (см. check_palette.py, отчёт ТЗ №9):
       outline vs c1 2.08:1, vs c2 4.56:1, vs c3 2.09:1, vs board-bg
       6.84:1. */
    outline: '#554e46'
  };

  function hexToRgbString(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  function sameType(a, b) {
    return !!a && !!b && a.color === b.color && a.shape === b.shape;
  }

  let canvas, ctx;
  let level = null;

  // Геометрия последнего кадра — переиспользуется хит-тестом и анимациями.
  let lastLayout = null;
  let vialRects = []; // [{x, y}, ...] по индексу колбы

  // Состояние, влияющее на отрисовку (Фаза 2).
  let selectedIndex = -1;
  let shakeState = null;       // { index, offset }
  let hiddenTopByVial = {};    // { [vialIndex]: скольким верхним элементам не рисоваться (летят) }
  let floatingGroup = null;    // { elements, cx, cy, elSize, elGap } — «летящая» пачка

  // Подсказка (Фаза 5): пульсирующая подсветка пары источник→цель.
  let hintState = null;   // { from, to, pulse }
  let hintRafId = null;

  // ТЗ №22, B2/A2: покадровые анимации колб одним RAF-циклом —
  // «пружинка» собранной колбы (pop), волна победы (wave) и указатель
  // бестекстового обучения (tutorialIndex). Цикл стоит, пока анимаций нет.
  let vialAnims = {};      // { [idx]: { kind: 'pop'|'wave', t0, duration } }
  let tutorialIndex = -1;  // колба, на которую указывает обучение (-1 — нет)
  let tutorialT0 = 0;
  let animRafId = null;

  // Анимация-полировка (Фаза 6): «оседание» приземлившихся элементов.
  let settleState = null; // { vialIndex, count, scale }
  let settleRafId = null;

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
  }

  function setLevel(lvl) {
    level = lvl;
    selectedIndex = -1;
    shakeState = null;
    hiddenTopByVial = {};
    floatingGroup = null;
    if (hintRafId) { cancelAnimationFrame(hintRafId); hintRafId = null; }
    hintState = null;
    if (settleRafId) { cancelAnimationFrame(settleRafId); settleRafId = null; }
    settleState = null;
    vialAnims = {};
    tutorialIndex = -1;
    if (animRafId) { cancelAnimationFrame(animRafId); animRafId = null; }
    lastLayout = null; // раскладка прошлого уровня (другое число колб) больше не годится
    vialRects = [];
    resize();
  }

  // ТЗ №9, задача B (вариант 2 отчёта ТЗ №8 + мягкий край, решение
  // основателя): раньше canvas всегда занимал ВЕСЬ board-wrap
  // (CSS width/height:100%), из-за чего подложка поля была заметно
  // крупнее реального содержимого (ratioH до 2.93× на уровне с одним
  // рядом). Теперь resize() считает раскладку на ПОЛНОЙ доступной
  // площади и ужимает сам <canvas> CSS-размером (inline style) под
  // содержимое + отступ — .board-wrap уже flex/center, ужавшийся canvas
  // центрируется сам. (ТЗ №27: отдельный «сухой» проход measureContentBox
  // убран — computeLayout сам отдаёт contentW/contentH.)

  // БАГ (см. docs/reports/BUG_board_canvas_width_padding_mismatch.md,
  // ТЗ №10 задача A): `* { box-sizing: border-box }` (style.css) значит
  // clientWidth/clientHeight родителя ВКЛЮЧАЮТ его собственный padding
  // (#board-wrap: 12px слева/справа, calc(header-h+16px)/90px сверху/
  // снизу) — content-box, реально доступный детям, у́же. Взятый «в лоб»
  // clientWidth заставлял resize() ставить canvas шире, чем flexbox
  // (min-width:0 на #board-canvas) готов был реально отрисовать: браузер
  // визуально сжимал холст обратно до content-box, а пиксельный буфер
  // (canvas.width) оставался настроен под завышенное число — рассинхрон
  // рисовал грязный обрезанный край. Меряем content-box явно.
  function contentBoxSize(el) {
    const cs = getComputedStyle(el);
    const w = el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    const h = el.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
    return { w, h };
  }

  // Отступ вокруг содержимого (вычисляется в resize(), см. комментарий
  // там) — хранится отдельно от cssW/cssH, потому что draw() тоже обязан
  // знать его: раскладка внутри draw() ведётся В БЮДЖЕТЕ (cssW/cssH минус
  // отступ), а не во всей площади канвы (задача A, ТЗ №10).
  let PAD = 18;

  // Телефон в портрете: окно выше, чем шире, и меньшая сторона < 600 css-px.
  // В iframe площадки innerWidth/innerHeight — размер самого фрейма.
  // «Мастерская украшений»: на телефоне над полем стоят карточки заказов и
  // высота ограничена — выбор рядов отдаём общей оценке (максимум размера
  // колбы), а не принудительным двум рядам. В game3 остаётся true.
  let FORCE_MULTIROW_PHONE = true;
  function setPhoneMultiRow(on) { FORCE_MULTIROW_PHONE = !!on; }

  function isPhonePortrait() {
    const w = window.innerWidth, h = window.innerHeight;
    return h > w && Math.min(w, h) < PHONE_MAX_SIDE;
  }

  function resize() {
    if (!canvas || !level) return;
    // Меряем РОДИТЕЛЯ (board-wrap), не сам canvas: после первого сжатия
    // canvas.clientWidth уже меньше доступной площади — замер по canvas
    // дал бы петлю (каждый resize сжимал бы холст ещё раз).
    const wrap = canvas.parentElement;
    const box = wrap ? contentBoxSize(wrap) : { w: canvas.clientWidth, h: canvas.clientHeight };
    const availW = box.w;
    const availH = box.h;
    if (availW === 0 || availH === 0) return;

    // Пробный проход на ПОЛНОЙ доступной площади — только чтобы оценить
    // масштаб фигур (vw) и вывести отступ. Задача A, ТЗ №10: раньше
    // отступ считался ПОСЛЕ раскладки (contentW + PAD*2) — на раскладках,
    // где ряд упирается в доступную ширину впритык (типичный случай),
    // computeLayout() тут же перевычислялся заново от этого же итогового
    // cssW и СНОВА растягивал колонки на всю ширину, без остатка съедая
    // добавленный отступ (по высоте эффекта не было — там раскладка не
    // упирается в свой предел, слабина остаётся сама). Отступ теперь
    // резервируется КАК БЮДЖЕТ до раскладки (PAD хранится в модульной
    // переменной, draw() читает то же значение) — колонки/ряды заполняют
    // урезанный бюджет, а не полный холст, отступ выживает на обеих осях.
    const opts = { multiRow: FORCE_MULTIROW_PHONE && isPhonePortrait() };
    const probe = computeLayout(availW, availH, level.vials.length, opts);
    PAD = Math.max(18, probe.vw * 0.22); // тот же отступ, что был у варианта 1 в отчёте ТЗ №8
    // ТЗ №27: итоговая раскладка считается ЗДЕСЬ ОДИН РАЗ и запоминается
    // (lastLayout) — draw() её только читает. Раньше draw() считал заново
    // на уже ужатом холсте; когда решение «один ряд или два» зависит от
    // пропорций бюджета, два расчёта могли разойтись (холст ужат под
    // один вариант, а нарисован другой). Один расчёт — расхождению
    // неоткуда взяться.
    const layout = computeLayout(
      Math.max(1, availW - PAD * 2), Math.max(1, availH - PAD * 2), level.vials.length, opts
    );
    lastLayout = layout;
    const cssW = Math.min(availW, layout.contentW + PAD * 2);
    const cssH = Math.min(availH, layout.contentH + PAD * 2);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    // Мягкий край — скругление (статичное, style.css #board-canvas) +
    // растворение (box-shadow цветом --board-bg темы), оба декларативны,
    // JS их не трогает. Радиус НЕ считаем пропорционально размеру: живой
    // прогон (ТЗ №9, задача B) поймал, что крупный радиус (пробовали
    // 12% от меньшей стороны) обрезает угол хит-теста у самой границы
    // padded-зоны колбы на тесных раскладках (Board.hitTest перестаёт
    // видеть пиксели в скруглённом углу) — см. отчёт. Небольшой
    // фиксированный радиус (см. CSS) держит запас против PAD (≥18px в
    // computeLayout выше) с большим отрывом.

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw(cssW, cssH);
  }

  function redraw() {
    if (!canvas || !level) return;
    // Защита от рассинхрона (см. комментарий у resize()/contentBoxSize):
    // redraw() не предполагает, что буфер (canvas.width/height, в
    // девайс-пикселях) уже согласован с реальным CSS-размером холста —
    // сверяет и пересобирает буфер САМ, если разошлось, а не только
    // внутри resize(). Дешёвая проверка (canvas.clientWidth уже читается
    // ниже в любом случае), но закрывает класс багов на будущее, а не
    // только сегодняшний.
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    const expectedW = Math.round(cssW * dpr);
    const expectedH = Math.round(cssH * dpr);
    if (canvas.width !== expectedW || canvas.height !== expectedH) {
      canvas.width = expectedW;
      canvas.height = expectedH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    draw(cssW, cssH);
  }

  // Высота колбы линейно зависит от её ширины (вместимость фиксирована),
  // поэтому коэффициент высчитывается один раз и переиспользуется.
  function vhFromVw(vw) {
    const elSize = vw * 0.74;
    const elGap = elSize * 0.12;
    const tubeTopMargin = elSize * 0.5;
    const tubeBottomMargin = elSize * 0.22;
    return tubeTopMargin + VIAL_CAPACITY * elSize + (VIAL_CAPACITY - 1) * elGap + tubeBottomMargin;
  }
  const VH_PER_VW = vhFromVw(1);

  /* ---------- Раскладка колб по доступной площади (ТЗ №27) ----------
     Правила (решение основателя 2026-09-30):
       - ряды делятся ПОРОВНУ, лишняя колба уходит в верхний ряд
         (5 -> 3+2, 6 -> 3+3, 7 -> 4+3, 8 -> 4+4); ряды центруются, при
         одинаковом шаге колбы нижнего ряда встают между верхними;
       - телефон в портрете (окно выше, чем шире, и меньшая сторона
         < 600 css-px) и 5+ колб -> минимум два ряда: узкий экран никогда
         не даёт «5 в ряд + 1 внизу». Признак берётся от ОКНА, а не от
         свободной области поля: шапка и кнопки на низком телефоне (SE)
         съедают столько высоты, что область поля почти квадратная;
       - альбом, планшет и ПК -> один ряд, если колбы в нём не мельче 85%
         от лучшего варианта; иначе больше рядов (8 колб на планшете
         в портрете лучше 4+4, чем полоска мелких).
     Раньше cols перебирался от vialCount вниз и брался ПЕРВЫЙ, где колба
     не уже 52px — отсюда 5+1 на 6 колбах и «полоска» из 8 колб мелкими
     колбами в альбоме (скрин основателя 2026-09-30).

     Зазоры пропорциональны ширине колбы (а не фиксированные 16/28px), так
     размер колбы решается в замкнутой форме — без перебора:
       по ширине:  vw = W / (cols + (cols-1)*GAP_K)
       по высоте:  vw = H*FILL_H / (rows*VH_PER_VW + (rows-1)*ROW_GAP_K)
     Отступ вокруг (PAD) и подложка — как раньше, см. resize().

     Отказ Яндекса (лэндскейп-обрезание, скрин основателя 2026-09-06): когда
     число колонок выбиралось по ширине, а высота клэмпилась жёстким полом,
     раскладка требовала больше высоты, чем есть, и canvas молча обрезал
     нижний ряд — колбы не видны и не берутся тапом. Инвариант: колба
     каждого варианта числа рядов = min(по ширине, по высоте, MAX_VW), то
     есть влезает по ОБЕИМ осям сразу; выбираем только среди таких вариантов.
     Исключение одно — пол MIN_VW_FLOOR на нереально узком окне. */
  const GAP_K = 0.28;            // зазор между колбами в ряду, в долях ширины колбы
  const ROW_GAP_K = 0.5;         // зазор между рядами, в долях ширины колбы
  const MAX_VW = 130;
  const MIN_VW_FLOOR = 24;       // не даём схлопнуться до нуля на совсем узких экранах
  const FILL_H = 0.96;           // какую долю бюджета по высоте разрешено занять
  const PHONE_MAX_SIDE = 600;    // меньшая сторона окна меньше — «телефон» (граница sw600dp)
  const ONE_ROW_KEEP = 0.85;     // меньше рядов предпочтительно, пока колба не мельче этой доли лучшего

  // Раскладка n колб по rows рядам: поровну, лишние — в верхние ряды.
  function splitRows(n, rows) {
    const base = Math.floor(n / rows);
    const extra = n % rows;
    const counts = [];
    for (let i = 0; i < rows; i++) counts.push(base + (i < extra ? 1 : 0));
    return counts;
  }

  function fitRows(W, H, n, rows) {
    const rowCounts = splitRows(n, rows);
    const cols = rowCounts[0];
    const byW = W / (cols + (cols - 1) * GAP_K);
    const byH = (H * FILL_H) / (rows * VH_PER_VW + (rows - 1) * ROW_GAP_K);
    return { rows, rowCounts, cols, vw: Math.min(byW, byH, MAX_VW) };
  }

  // opts.multiRow — телефон в портрете: 5+ колб раскладываются минимум в
  // два ряда (решает resize() по размеру окна, см. isPhonePortrait()).
  function computeLayout(cssW, cssH, vialCount, opts) {
    const n = Math.max(1, Math.floor(vialCount) || 1);
    const W = Math.max(1, cssW);
    const H = Math.max(1, cssH);

    // Сколько рядов вообще имеет смысл рассматривать: до 4 колб — один,
    // до 10 — два, дальше — до трёх (уровней больше 8 колб пока нет,
    // правило общее на будущее).
    const maxRows = n <= 4 ? 1 : (n <= 10 ? 2 : 3);
    const fits = [];
    for (let rows = 1; rows <= maxRows; rows++) fits.push(fitRows(W, H, n, rows));

    const multiRow = !!(opts && opts.multiRow) && n >= 5;
    const minRows = multiRow ? Math.min(2, maxRows) : 1;
    const allowed = fits.filter(f => f.rows >= minRows);
    const bestVw = Math.max(...allowed.map(f => f.vw));
    const chosen = allowed.find(f => f.vw >= ONE_ROW_KEEP * bestVw);

    const vw = Math.max(MIN_VW_FLOOR, chosen.vw);
    const vh = vhFromVw(vw);
    const elSize = vw * 0.74;
    const elGap = elSize * 0.12;
    const tubeBottomMargin = elSize * 0.22;
    const GAP = vw * GAP_K;
    const ROW_GAP = vw * ROW_GAP_K;
    const contentW = chosen.cols * vw + (chosen.cols - 1) * GAP;
    const contentH = chosen.rows * vh + (chosen.rows - 1) * ROW_GAP;

    return {
      vialCount: n, rows: chosen.rows, rowCounts: chosen.rowCounts, cols: chosen.cols,
      vw, vh, GAP, ROW_GAP, elSize, elGap, tubeBottomMargin,
      contentW, contentH, bestVw, multiRow, budgetW: W, budgetH: H
    };
  }

  // Габариты последнего кадра (ТЗ №8, задача B): холст (весь #board-canvas)
  // против содержимого (bounding box реально нарисованных колб) — числа
  // для diag-вывода (dev_board_diag.js) и для отчёта по подложке доски.
  // НЕ используются самим рендером — только измерение постфактум.
  let lastDiagMetrics = null;

  function draw(cssW, cssH) {
    ctx.clearRect(0, 0, cssW, cssH);
    if (!level) return;

    const vials = level.vials;
    // ТЗ №27: раскладку считает resize() (один раз), здесь она только
    // читается. Число колб в ней обязано совпадать с уровнем: если resize()
    // не отработал (нулевая площадь) после смены уровня, рисовать по
    // раскладке ПРЕДЫДУЩЕГО уровня нельзя — лучше пустой кадр.
    const layout = lastLayout;
    if (!layout || layout.vialCount !== vials.length) return;
    const { rows, rowCounts, vw, vh, GAP, ROW_GAP } = layout;

    const gridH = layout.contentH;
    let y = (cssH - gridH) / 2;
    let maxRowW = 0;

    vialRects = [];
    let vialIndex = 0;
    for (let r = 0; r < rows; r++) {
      const colsInRow = rowCounts[r];
      const rowW = colsInRow * vw + (colsInRow - 1) * GAP;
      maxRowW = Math.max(maxRowW, rowW);
      let x = (cssW - rowW) / 2;

      for (let c = 0; c < colsInRow; c++) {
        const idx = vialIndex;
        vialRects[idx] = { x, y };
        const shakeOffset = (shakeState && shakeState.index === idx) ? shakeState.offset : 0;
        const hintPulse = (hintState && (hintState.from === idx || hintState.to === idx)) ? hintState.pulse : 0;
        const settling = (settleState && settleState.vialIndex === idx) ? settleState : null;
        const anim = vialAnimFrame(idx, layout.elSize);
        const tutorialPulse = tutorialIndex === idx ? 0.5 + 0.5 * Math.sin(((performance.now() - tutorialT0) / 1100) * Math.PI * 2) : 0;
        ctx.save();
        if (anim.scale !== 1 || anim.dy !== 0) {
          // Масштаб от середины ДНА колбы — «пружинит» стоя, не уезжая вбок.
          const ax = x + vw / 2, ay = y + vh;
          ctx.translate(ax, ay + anim.dy);
          ctx.scale(anim.scale, anim.scale);
          ctx.translate(-ax, -ay);
        }
        drawVial(x + shakeOffset, y, vw, vh, vials[idx], layout, {
          isSelected: selectedIndex === idx,
          hiddenCount: hiddenTopByVial[idx] || 0,
          hintPulse: Math.max(hintPulse, tutorialPulse),
          settleCount: settling ? settling.count : 0,
          settleScale: settling ? settling.scale : 1,
          capDrop: anim.capDrop
        });
        ctx.restore();
        if (tutorialIndex === idx) drawTapRing(x + vw / 2, y + vh * 0.62, vw);
        x += vw + GAP;
        vialIndex++;
      }
      y += vh + ROW_GAP;
    }

    lastDiagMetrics = {
      canvasW: cssW, canvasH: cssH,
      contentW: maxRowW, contentH: gridH,
      ratioW: maxRowW > 0 ? cssW / maxRowW : 0,
      ratioH: gridH > 0 ? cssH / gridH : 0
    };

    if (floatingGroup) {
      let fy = floatingGroup.cy;
      for (let i = 0; i < floatingGroup.elements.length; i++) {
        drawElement(floatingGroup.cx, fy, floatingGroup.elSize, floatingGroup.elements[i]);
        fy -= floatingGroup.elSize + floatingGroup.elGap;
      }
    }
  }

  /* ---------- Одна колба ---------- */
  function drawVial(x, y, vw, vh, elements, layout, options) {
    const { isSelected = false, hiddenCount = 0, hintPulse = 0, settleCount = 0, settleScale = 1, capDrop = 0 } = options || {};
    const r = vw * 0.18;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + vh - r);
    ctx.arcTo(x, y + vh, x + r, y + vh, r);
    ctx.lineTo(x + vw - r, y + vh);
    ctx.arcTo(x + vw, y + vh, x + vw, y + vh - r, r);
    ctx.lineTo(x + vw, y);

    ctx.fillStyle = `rgba(${hexToRgbString(THEME.ink)}, 0.05)`;
    ctx.fill();
    if (isSelected) {
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = Math.max(3, vw * 0.05);
    } else if (hintPulse > 0) {
      // Пульсирующая подсветка подсказки — отличима от статичного выбора игрока.
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = Math.max(2, vw * 0.035) + hintPulse * vw * 0.045;
    } else {
      ctx.strokeStyle = THEME.ink;
      ctx.lineWidth = Math.max(2, vw * 0.035);
    }
    ctx.lineJoin = 'round';
    ctx.stroke();

    const { elSize, elGap, tubeBottomMargin } = layout;
    const visibleCount = elements.length - hiddenCount;
    let cy = y + vh - tubeBottomMargin - elSize / 2;
    for (let i = 0; i < visibleCount; i++) {
      const cx = x + vw / 2;
      // Верхний элемент выбранной колбы визуально «приподнят» — как будто уже поднят для перелива.
      const isLiftedTop = isSelected && i === visibleCount - 1;
      // Только что приземлившиеся элементы (Фаза 6) — лёгкий «плюх»-масштаб.
      const isSettling = settleCount > 0 && i >= visibleCount - settleCount;
      const size = isSettling ? elSize * settleScale : elSize;
      drawElement(cx, isLiftedTop ? cy - elSize * 0.32 : cy, size, elements[i]);
      cy -= elSize + elGap;
    }

    // ТЗ №22, B2: собранная колба «закупорена» — пробка цвета её
    // элементов. Постоянный признак «эта колба готова» (раньше его
    // давал только звук), при сборке пробка падает сверху (capDrop).
    if (hiddenCount === 0 && isFullSameType(elements)) {
      const capW = vw * 1.12;
      const capH = Math.max(6, elSize * 0.26);
      const capX = x + (vw - capW) / 2;
      const capY = y - capH * 0.55 - capDrop * elSize;
      const cr = capH * 0.45;
      ctx.beginPath();
      ctx.moveTo(capX + cr, capY);
      ctx.arcTo(capX + capW, capY, capX + capW, capY + capH, cr);
      ctx.arcTo(capX + capW, capY + capH, capX, capY + capH, cr);
      ctx.arcTo(capX, capY + capH, capX, capY, cr);
      ctx.arcTo(capX, capY, capX + capW, capY, cr);
      ctx.closePath();
      ctx.fillStyle = COLORS[elements[0].color];
      ctx.fill();
      ctx.strokeStyle = THEME.outline;
      ctx.lineWidth = Math.max(1.5, elSize * 0.06);
      ctx.stroke();
    }
  }

  function isFullSameType(elements) {
    return elements.length === VIAL_CAPACITY && elements.every(el => sameType(el, elements[0]));
  }

  /* ---------- ТЗ №22: покадровые анимации колб ---------- */
  // Текущий кадр анимации колбы: масштаб, вертикальный сдвиг, высота
  // падающей пробки (в размерах элемента).
  function vialAnimFrame(idx, elSize) {
    const a = vialAnims[idx];
    const none = { scale: 1, dy: 0, capDrop: 0 };
    if (!a) return none;
    const t = (performance.now() - a.t0) / a.duration;
    if (t < 0) return none;
    if (t >= 1) return none;
    if (a.kind === 'pop') {
      // Пробка падает первые 35% времени, затем колба пружинит.
      const capT = Math.min(1, t / 0.35);
      const capDrop = (1 - capT) * (1 - capT) * 1.6;
      const bounceT = Math.max(0, (t - 0.3) / 0.7);
      const scale = 1 + Math.sin(bounceT * Math.PI) * 0.09 * (1 - bounceT * 0.5);
      return { scale, dy: 0, capDrop };
    }
    // wave — колба подпрыгивает один раз.
    return { scale: 1 + Math.sin(t * Math.PI) * 0.04, dy: -Math.sin(t * Math.PI) * elSize * 0.45, capDrop: 0 };
  }

  // «Кольцо тапа» обучения — расходящийся круг поверх колбы.
  function drawTapRing(cx, cy, vw) {
    // Живой прогон (N-34): акцент темы = заливка c1 (THEME.accent ===
    // COLORS.c1), а на уровнях 1–2 все фигуры c1 — акцентное кольцо
    // сливалось с ними. Кольцо — чернилами темы, «палец» — светлая точка
    // с чернильной обводкой: контраст к любой заливке и любой теме.
    const phase = ((performance.now() - tutorialT0) % 1100) / 1100;
    const radius = vw * (0.3 + phase * 0.6);
    ctx.save();
    ctx.globalAlpha = 0.85 * (1 - phase);
    ctx.strokeStyle = THEME.ink;
    ctx.lineWidth = Math.max(3, vw * 0.07);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.92;
    const dot = vw * (0.2 + 0.03 * Math.sin(phase * Math.PI * 2));
    ctx.fillStyle = '#fffaf0';
    ctx.strokeStyle = THEME.ink;
    ctx.lineWidth = Math.max(2, vw * 0.045);
    ctx.beginPath();
    ctx.arc(cx, cy, dot, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function runAnimLoop() {
    if (animRafId) return;
    function frame() {
      const now = performance.now();
      for (const k of Object.keys(vialAnims)) {
        const a = vialAnims[k];
        if (now - a.t0 >= a.duration) {
          delete vialAnims[k];
          if (a.onDone) a.onDone();
        }
      }
      redraw();
      if (Object.keys(vialAnims).length || tutorialIndex >= 0) {
        animRafId = requestAnimationFrame(frame);
      } else {
        animRafId = null;
      }
    }
    animRafId = requestAnimationFrame(frame);
  }

  // Колба только что собрана: пробка падает, колба пружинит.
  function popVial(idx) {
    if (prefersReducedMotion()) { redraw(); return; }
    vialAnims[idx] = { kind: 'pop', t0: performance.now(), duration: 420 };
    runAnimLoop();
  }

  // Волна победы: колбы по очереди подпрыгивают, onDone — после последней.
  function waveVials(onDone) {
    if (!level || prefersReducedMotion()) { if (onDone) onDone(); return; }
    const n = level.vials.length;
    const t0 = performance.now();
    const step = 55;
    for (let i = 0; i < n; i++) {
      vialAnims[i] = { kind: 'wave', t0: t0 + i * step, duration: 340 };
    }
    vialAnims[n - 1].onDone = onDone;
    runAnimLoop();
  }

  function setTutorial(idx) {
    if (tutorialIndex === idx) return;
    tutorialIndex = idx;
    tutorialT0 = performance.now();
    if (idx >= 0) runAnimLoop(); else redraw();
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // Прямоугольник колбы в КЛИЕНТСКИХ координатах (для слоя эффектов fx.js).
  function getVialClientRect(idx) {
    if (!canvas || !lastLayout || !vialRects[idx]) return null;
    const rect = canvas.getBoundingClientRect();
    const r = vialRects[idx];
    return {
      left: rect.left + r.x, top: rect.top + r.y,
      width: lastLayout.vw, height: lastLayout.vh,
      elSize: lastLayout.elSize, elGap: lastLayout.elGap,
      tubeBottomMargin: lastLayout.tubeBottomMargin
    };
  }

  /* ---------- Один элемент (круг, квадрат или ромб в цвете) ----------
     «Мастерская украшений» (форк game3): третья форма — ромб (diamond),
     и по цвету — метка на бусине (MARKS): c1 — точка, c2 — полоска,
     c3 — кольцо. Метка дублирует цвет рисунком, чтобы бусины различались
     без опоры только на цвет (ТЗ §6). В game3 метки выключены. */
  let MARKS = false;
  function setMarks(on) { MARKS = !!on; }

  function drawElement(cx, cy, size, el) { drawBead(ctx, cx, cy, size, el); }

  // Общий рисовальщик: используется и полем (ctx доски), и карточками
  // заказов/анимацией готового украшения (их собственные canvas).
  function drawBead(g, cx, cy, size, el) {
    const fill = COLORS[el.color];
    g.fillStyle = fill;
    g.strokeStyle = THEME.outline; // ТЗ №9, задача A: одна обводка на тему, без per-заливки выбора
    g.lineWidth = Math.max(1.5, size * 0.06);

    if (el.shape === SHAPE.CIRCLE) {
      const radius = size / 2 * 0.9;
      g.beginPath();
      g.arc(cx, cy, radius, 0, Math.PI * 2);
      g.fill();
      g.stroke();
    } else if (el.shape === SHAPE.DIAMOND) {
      const r = size / 2 * 1.02;
      g.beginPath();
      g.moveTo(cx, cy - r);
      g.lineTo(cx + r, cy);
      g.lineTo(cx, cy + r);
      g.lineTo(cx - r, cy);
      g.closePath();
      g.lineJoin = 'round';
      g.fill();
      g.stroke();
    } else {
      const s = size * 0.86;
      const cr = s * 0.18;
      const left = cx - s / 2;
      const top = cy - s / 2;
      g.beginPath();
      g.moveTo(left + cr, top);
      g.lineTo(left + s - cr, top);
      g.arcTo(left + s, top, left + s, top + cr, cr);
      g.lineTo(left + s, top + s - cr);
      g.arcTo(left + s, top + s, left + s - cr, top + s, cr);
      g.lineTo(left + cr, top + s);
      g.arcTo(left, top + s, left, top + s - cr, cr);
      g.lineTo(left, top + cr);
      g.arcTo(left, top, left + cr, top, cr);
      g.closePath();
      g.fill();
      g.stroke();
    }
    if (MARKS) drawMark(g, cx, cy, size, el.color);
  }

  // Метка цвета: светлая на тёмных заливках (c1, c3), тёмная на золотой (c2).
  function drawMark(g, cx, cy, size, color) {
    const light = color === 'c2' ? 'rgba(43,39,35,0.78)' : 'rgba(255,248,235,0.92)';
    g.save();
    g.fillStyle = light;
    g.strokeStyle = light;
    if (color === 'c1') {            // точка
      g.beginPath();
      g.arc(cx, cy, size * 0.11, 0, Math.PI * 2);
      g.fill();
    } else if (color === 'c2') {     // горизонтальная полоска
      const w = size * 0.42, h = size * 0.12;
      g.fillRect(cx - w / 2, cy - h / 2, w, h);
    } else {                         // кольцо
      g.lineWidth = Math.max(1.5, size * 0.07);
      g.beginPath();
      g.arc(cx, cy, size * 0.16, 0, Math.PI * 2);
      g.stroke();
    }
    g.restore();
  }

  /* ---------- Хит-тест: экранные координаты → индекс колбы ---------- */
  function hitTest(clientX, clientY) {
    if (!canvas || !lastLayout || !vialRects.length) return -1;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const pad = 8; // прощаем неточный тап рядом с колбой
    const { vw, vh } = lastLayout;
    // Зоны тапа соседних колб (с pad) могут перекрываться на тесных
    // раскладках — берём колбу, чей центр ближе к точке, а не первую
    // попавшуюся по порядку (ТЗ №27).
    let hit = -1;
    let hitDist = Infinity;
    for (let i = 0; i < vialRects.length; i++) {
      const r = vialRects[i];
      if (x >= r.x - pad && x <= r.x + vw + pad && y >= r.y - pad && y <= r.y + vh + pad) {
        const dx = x - (r.x + vw / 2);
        const dy = y - (r.y + vh / 2);
        const d = dx * dx + dy * dy;
        if (d < hitDist) { hitDist = d; hit = i; }
      }
    }
    return hit;
  }

  /* ---------- Подсветка выбранной колбы-источника ---------- */
  function setSelected(index) {
    selectedIndex = index;
    redraw();
  }

  /* ---------- Недопустимый ход: короткое дрожание колбы-цели ---------- */
  function shake(index) {
    const duration = 300;
    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / duration;
      if (t >= 1) { shakeState = null; redraw(); return; }
      shakeState = { index, offset: Math.sin(t * Math.PI * 5) * (1 - t) * 10 };
      redraw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Анимация перелива: count верхних элементов из fromIdx в toIdx ----------
     Данные ещё НЕ изменены на момент вызова — позиции считаются от текущего
     состояния level.vials. Модель обновляется в onDone (данные — источник
     истины, отрисовка следует за ними). */
  function animatePour({ fromIdx, toIdx, count, duration = 240, onDone }) {
    if (!level || !lastLayout || !vialRects[fromIdx] || !vialRects[toIdx]) {
      if (onDone) onDone();
      return;
    }
    const sourceVial = level.vials[fromIdx];
    const targetVial = level.vials[toIdx];
    const startSlotIndex = sourceVial.length - count;
    const endSlotIndex = targetVial.length;

    const { vw, vh, elSize, elGap, tubeBottomMargin } = lastLayout;
    const srcRect = vialRects[fromIdx];
    const dstRect = vialRects[toIdx];

    const startCx = srcRect.x + vw / 2;
    const startCy = srcRect.y + vh - tubeBottomMargin - elSize / 2 - startSlotIndex * (elSize + elGap);
    const endCx = dstRect.x + vw / 2;
    const endCy = dstRect.y + vh - tubeBottomMargin - elSize / 2 - endSlotIndex * (elSize + elGap);

    const elements = sourceVial.slice(startSlotIndex);
    hiddenTopByVial = { [fromIdx]: count };

    const arcH = elSize * 1.1;
    const t0 = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) * (1 - t); // ease-out — быстро и мягко, антистресс-темп
      const cx = startCx + (endCx - startCx) * eased;
      const cy = startCy + (endCy - startCy) * eased - Math.sin(eased * Math.PI) * arcH;
      floatingGroup = { elements, cx, cy, elSize, elGap };
      redraw();

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        hiddenTopByVial = {};
        floatingGroup = null;
        startSettleAnimation(toIdx, count); // «плюх»-полировка приземления
        if (onDone) onDone();
        redraw();
      }
    }
    requestAnimationFrame(frame);
  }

  // easeOutBack: лёгкий перехлёст за 1.0 перед тем, как осесть — стандартная
  // «пружинка» для приземления, без сторонних либ.
  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /* ---------- «Плюх»: приземлившиеся элементы чуть оседают и пружинят ---------- */
  function startSettleAnimation(vialIndex, count) {
    if (settleRafId) cancelAnimationFrame(settleRafId);
    const duration = 220;
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / duration);
      settleState = { vialIndex, count, scale: 0.6 + 0.4 * easeOutBack(t) };
      redraw();
      if (t < 1) {
        settleRafId = requestAnimationFrame(frame);
      } else {
        settleState = null;
        settleRafId = null;
        redraw();
      }
    }
    settleRafId = requestAnimationFrame(frame);
  }

  /* ---------- Подсказка: пульсирующая подсветка пары источник→цель ---------- */
  function showHint(fromIdx, toIdx) {
    if (hintRafId) cancelAnimationFrame(hintRafId);
    const duration = 2200;
    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / duration;
      if (t >= 1) { hintState = null; hintRafId = null; redraw(); return; }
      hintState = { from: fromIdx, to: toIdx, pulse: 0.5 + 0.5 * Math.sin(t * Math.PI * 6) };
      redraw();
      hintRafId = requestAnimationFrame(frame);
    }
    hintRafId = requestAnimationFrame(frame);
  }

  function clearHint() {
    if (hintRafId) { cancelAnimationFrame(hintRafId); hintRafId = null; }
    if (hintState) { hintState = null; redraw(); }
  }

  // ТЗ №8, задача B: геометрия последнего кадра для diag-вывода
  // (dev_board_diag.js) — снимок, не пересчитывает и не форсирует рендер.
  function getDiagMetrics() {
    return lastDiagMetrics;
  }

  // ТЗ №27: снимок фактической раскладки — для приёмки (tests/
  // board_layout_matrix.py) и диагностики; не пересчитывает ничего.
  function getLayoutSnapshot() {
    if (!lastLayout) return null;
    const L = lastLayout;
    return {
      vialCount: L.vialCount, rows: L.rows, rowCounts: L.rowCounts.slice(),
      vw: L.vw, vh: L.vh, gap: L.GAP, rowGap: L.ROW_GAP, bestVw: L.bestVw, multiRow: L.multiRow,
      budgetW: L.budgetW, budgetH: L.budgetH, pad: PAD
    };
  }

  return {
    init, setLevel, resize, redraw,
    hitTest, setSelected, shake, animatePour, showHint, clearHint,
    popVial, waveVials, setTutorial, getVialClientRect,
    getDiagMetrics, getLayoutSnapshot,
    // computeLayout — диагностический экспорт (перенесено с
    // fix/vk-remove-shop при сведении в main): координаты клика для
    // Playwright-приёмки берутся из того, что реально нарисовано
    // (computeLayout/getDiagMetrics), не калибруются через hitTest.
    // Чистая функция, ничего не меняет в рендере.
    computeLayout,
    sameType, SHAPE, COLORS, THEME, VIAL_CAPACITY,
    drawBead, setMarks, setPhoneMultiRow
  };
})();
