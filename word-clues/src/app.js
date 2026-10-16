/* Экраны P0 (ТЗ §5–§8, G1F-001…005): шкатулка → поле первой истории → итог → атлас.
   Здесь только порядок экранов и тексты; правила поля — logic.js, сохранение — state.js,
   ввод — board.js. Картинки берутся из assets/art/<имя>.webp, пока их нет — значок. */
(function () {
  'use strict';
  var C = window.G1F_CONTENT, L = window.WordLogic, A = window.Analytics, P = window.Platform;
  var S = window.GameState.create(C, P.storage);
  var $ = function (id) { return document.getElementById(id); };
  var TOTAL_SLOTS = 10; // разворот атласа: 3 находки P0 и 7 мест «Скоро»
  var IDLE_MS = 120000, GHOST_MS = 3000, REVEAL_MS = 2600, RESULT_DELAY = 1500;

  var ICONS = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    gear: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    left: '<path d="M14 6l-6 6 6 6"/>',
    right: '<path d="M10 6l6 6-6 6"/>',
    loupe: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/>',
    lock: '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>',
    book: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
    stamp: '<rect x="5" y="5" width="14" height="14" rx="1" stroke-dasharray="2 2"/><path d="M9 14l2-3 2 2 2-3"/>',
    star: '<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
    bulb: '<path d="M9 17h6M10 20h4"/><path d="M12 4a5 5 0 0 0-3 9c.6.5 1 1.3 1 2h4c0-.7.4-1.5 1-2a5 5 0 0 0-3-9z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chat: '<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 9.5h8M8 12.5h5"/>',
  };
  function icon(name) {
    return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- картинки с запасным значком ---------- */
  var missing = {};
  function art(el, name, emoji) {
    el.innerHTML = '';
    el.classList.remove('has-img');
    var ic = document.createElement('span');
    ic.className = 'art-icon'; ic.textContent = emoji || '';
    el.appendChild(ic);
    // В сборке tools/build.py кладёт список готовых картинок (имя → хеш): лишних запросов нет, кэш сбрасывается по хешу.
    var list = window.G1F_ART;
    if (!name || missing[name] || (list && !list[name])) return;
    var img = new Image();
    img.alt = ''; img.decoding = 'async'; img.draggable = false;
    img.onload = function () { el.classList.add('has-img'); };
    img.onerror = function () { missing[name] = true; img.remove(); };
    img.src = 'assets/art/' + name + '.webp' + (list ? '?v=' + list[name] : '');
    el.appendChild(img);
  }
  function initStaticArt() {
    document.querySelectorAll('.art[data-art]').forEach(function (el) { art(el, el.dataset.art, el.dataset.icon); });
  }

  /* ---------- экраны и шторка ---------- */
  var screen = null, sheetKind = null, sheetReturn = null;
  function show(id) {
    closeSheet();
    document.querySelectorAll('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    screen = id;
    document.body.dataset.screen = id;
    var sc = $(id).querySelector('[class$="-scroll"]');
    if (sc) sc.scrollTop = 0;
    if (id === 'scr-field') requestAnimationFrame(function () { window.Board.fit(); });
  }
  function openSheet(kind, html, bind) {
    sheetReturn = document.activeElement;
    sheetKind = kind;
    var el = $('sheet');
    el.innerHTML = '<div class="sheet-grip"></div>' + html;
    el.hidden = false; $('sheet-back').hidden = false;
    if (bind) bind(el);
    var f = el.querySelector('button:not([disabled])');
    if (f) f.focus();
  }
  function closeSheet() {
    if (!sheetKind) return;
    sheetKind = null;
    $('sheet').hidden = true; $('sheet-back').hidden = true; $('sheet').innerHTML = '';
    if (sheetReturn && sheetReturn.focus && document.contains(sheetReturn)) sheetReturn.focus();
    sheetReturn = null;
  }

  var toastTimer = null, toastSeen = {};
  // Одинаковое сообщение не чаще раза в 5 с (ТЗ §4.2).
  function toast(msg) {
    var t = Date.now();
    if (toastSeen[msg] && t - toastSeen[msg] < 5000) return;
    toastSeen[msg] = t;
    var el = $('toast');
    el.textContent = msg; el.hidden = false;
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2200);
  }

  function saveLine(el) {
    if (S.saveOk) { el.textContent = P.persistent ? 'Прогресс сохраняется на этом устройстве' : ''; el.classList.remove('warn'); }
    else { el.textContent = 'Сейчас прогресс не сохраняется'; el.classList.add('warn'); }
  }
  var saveErrorSent = false;
  S.onSave(function (ok) {
    $('field-save').hidden = ok;
    saveLine($('home-save'));
    if (!ok && !saveErrorSent) { saveErrorSent = true; A.event('save_error', { persistent: P.persistent }); }
  });

  /* ---------- настройки ---------- */
  function applySettings() {
    var st = S.data.settings;
    var sysRm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.toggle('rm', !!st.reduced_motion || sysRm);
    document.body.classList.toggle('lt', !!st.large_text);
    window.Sound.setEnabled(st.sound);
    if (screen === 'scr-field') requestAnimationFrame(function () { sizeClueCard(); window.Board.fit(); });
  }
  window.addEventListener('resize', function () { if (screen === 'scr-field') { sizeClueCard(); window.Board.fit(); } });
  function toggleRow(key, title, sub) {
    var on = !!S.data.settings[key];
    return '<button class="opt toggle" data-set="' + key + '" role="switch" aria-checked="' + on + '"><span><b>' + title + '</b><span class="muted">' + sub + '</span></span><span class="sw"></span></button>';
  }
  function openSettings() {
    var build = (document.querySelector('meta[name="g1f-build"]') || {}).content || 'dev';
    var html = '<h3>Настройки</h3>' +
      toggleRow('sound', 'Звук', 'Тихие отклики на буквы и находки') +
      toggleRow('reduced_motion', 'Меньше движения', 'Без волн и покачиваний') +
      toggleRow('large_text', 'Крупный текст', 'Улики и кнопки крупнее') +
      (P.params.has('journal') ? '<button class="opt" id="opt-journal"><span><b>Журнал событий</b><span class="muted">Скачать JSON для разбора плейтеста</span></span></button>' : '') +
      '<button class="opt" id="opt-survey"><span><b>Отзыв о тесте</b><span class="muted">6 коротких вопросов автору игры</span></span></button>' +
      '<button class="opt danger" id="opt-reset"><span><b>Начать заново</b><span class="muted">Сотрёт истории, атлас и лупы</span></span></button>' +
      '<p class="muted small">Сборка ' + esc(build) + ' · ' + esc(C.content_version) + '</p>' +
      '<button class="btn-link" data-close>Закрыть</button>';
    openSheet('settings', html, function (el) {
      el.querySelectorAll('[data-set]').forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.dataset.set, v = !S.data.settings[k];
          S.setSetting(k, v);
          b.setAttribute('aria-checked', v);
          applySettings();
          window.Sound.play('tap');
        });
      });
      var j = el.querySelector('#opt-journal');
      if (j) j.addEventListener('click', function () { A.exportJson(); });
      el.querySelector('#opt-reset').addEventListener('click', confirmReset);
      el.querySelector('#opt-survey').addEventListener('click', function () { showSurvey('settings'); });
    });
  }
  function confirmReset() {
    openSheet('confirm', '<h3>Начать заново?</h3><p>Найденные слова, атлас, марки и лупы будут стёрты на этом устройстве.</p>' +
      '<button class="btn-main danger" id="opt-reset-yes">Стереть и начать</button><button class="btn-link" data-close>Отмена</button>', function (el) {
      el.querySelector('#opt-reset-yes').addEventListener('click', function () {
        A.event('progress_reset', {});
        S.reset();
        applySettings();
        boot();
      });
    });
  }

  /* ---------- шкатулка ---------- */
  function showBox() {
    $('box-note').textContent = C.box_note;
    show('scr-box');
  }

  /* ---------- главная ---------- */
  function homeTarget() {
    var cur = S.curStory();
    if (cur) return { story: cur, mode: 'continue' };
    var id = S.nextStoryId();
    return id ? { story: S.story(id), mode: 'start' } : { story: null, mode: 'done' };
  }
  function showHome() {
    var t = homeTarget();
    $('home-town').textContent = C.town;
    $('home-chapter').textContent = C.chapter_title;
    var btn = $('btn-continue');
    if (t.mode === 'continue') {
      $('home-kicker').textContent = 'Продолжить · ' + t.story.place;
      $('home-question').textContent = t.story.teaser;
      $('home-sub').textContent = t.story.title + ' · найдено ' + S.foundCount() + ' из ' + t.story.clues.length;
      btn.textContent = 'Продолжить историю';
      art($('home-art'), t.story.scene, '🏞️');
    } else if (t.mode === 'start') {
      $('home-kicker').textContent = 'История ' + (t.story.index + 1) + ' из ' + S.stories.length + ' · ' + t.story.place;
      $('home-question').textContent = t.story.teaser;
      $('home-sub').textContent = t.story.title;
      btn.textContent = 'Начать историю';
      art($('home-art'), t.story.scene, '🏞️');
    } else {
      $('home-kicker').textContent = 'Пробная глава пройдена';
      $('home-question').textContent = C.demo_end.question;
      $('home-sub').textContent = C.demo_end.title + '. ' + C.demo_end.text;
      btn.textContent = 'Открыть атлас';
      art($('home-art'), 'bg_town', '🏞️');
    }
    btn.dataset.mode = t.mode;
    var got = S.data.atlas_item_ids.length;
    $('atlas-sub').textContent = 'Находок: ' + got + ' из ' + TOTAL_SLOTS;
    var nx = $('home-next');
    var after = t.story && S.stories[t.story.index + 1];
    if (t.mode !== 'done' && after) {
      nx.hidden = false;
      $('home-next-title').textContent = 'Дальше: ' + after.place;
      $('home-next-sub').textContent = 'Откроется после истории «' + t.story.title + '»';
    } else nx.hidden = true;
    surveySub();
    saveLine($('home-save'));
    show('scr-home');
  }
  function onContinue() {
    var t = homeTarget();
    window.Sound.play('tap');
    if (t.mode === 'continue') openField();
    else if (t.mode === 'start') showIntro(t.story);
    else showAtlas('home');
  }

  /* ---------- вступление ---------- */
  var introStory = null;
  function showIntro(s) {
    introStory = s;
    art($('intro-art'), s.scene, '🏞️');
    $('intro-kicker').textContent = 'История ' + (s.index + 1) + ' из ' + S.stories.length + ' · ' + s.place;
    $('intro-title').textContent = s.title;
    $('intro-text').textContent = s.intro;
    show('scr-intro');
  }
  function beginStory(s) {
    var had = S.cur() && S.cur().story_id === s.id;
    S.startStory(s.id);
    if (!had) A.event('story_start', { story_id: s.id, story_index: s.index });
    openField();
  }

  /* ---------- поле ---------- */
  var F = null; // {story, locked, revealTimer, attempts, ghostTimer}
  var turnTipShown = false;

  function clue(id) { return F.story.clues.filter(function (c) { return c.id === id; })[0]; }
  function selId() { return S.cur() ? S.cur().selected_clue_id : null; }
  function clueIdx(id) { var i = -1; F.story.clues.forEach(function (c, k) { if (c.id === id) i = k; }); return i; }

  function openField() {
    var s = S.curStory();
    if (!s) { showHome(); return; }
    F = { story: s, locked: false, revealTimer: null, attempts: 0, ghostTimer: null };
    $('field-title').textContent = s.title;
    $('field-sub').textContent = s.place;
    art($('scene-bg'), s.scene, '');
    $('scene').dataset.story = s.id;
    renderSceneItems($('scene-items'), s, function (c) { return S.isFound(c.id); }, false);
    show('scr-field');
    sizeClueCard();
    window.Board.render(s, S.cur().found, {
      onSubmit: onSubmit,
      onStep: function (n) { window.Sound.play('step', n - 1); },
      onBack: function (n) { window.Sound.play('step', Math.max(0, n - 1)); },
      onTouch: function () { touched(); },
      locked: function () { return F.locked || !!sheetKind; },
    });
    if (!S.isFound(selId()) && !S.isOpen(selId())) S.select(S.firstUnfound());
    renderClue();
    renderDots();
    renderFoot();
    scheduleGhost();
  }

  // Найденные предметы встают на свободную полосу переднего плана сцены.
  var SLOTS = [[13, 4], [31, 11], [50, 3], [69, 11], [87, 4]];
  function renderSceneItems(box, s, isOn, animate) {
    box.innerHTML = '';
    s.clues.forEach(function (c, i) {
      var el = document.createElement('div');
      el.className = 'scene-item art';
      el.dataset.clue = c.id;
      el.style.left = SLOTS[i][0] + '%';
      el.style.bottom = SLOTS[i][1] + '%';
      art(el, c.img, c.icon);
      if (isOn(c)) {
        el.classList.add('on');
        if (animate) { el.style.animationDelay = (i * 120) + 'ms'; el.classList.add('pop'); }
      }
      box.appendChild(el);
    });
  }
  function revealItem(id) {
    var el = $('scene-items').querySelector('[data-clue="' + id + '"]');
    if (!el) return;
    el.classList.add('on');
    el.style.animationDelay = '0ms';
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  }

  /* Высота карточки — по самой длинной улике и тексту находки этой истории, чтобы
     поле под ней не прыгало при смене улики. Растёт только от «Ещё улики». */
  function sizeClueCard() {
    if (!F) return;
    var card = $('clue-card');
    card.style.minHeight = '';
    var probe = card.cloneNode(true);
    probe.removeAttribute('id');
    probe.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
    probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0;width:' + card.getBoundingClientRect().width + 'px;min-height:0';
    card.parentNode.appendChild(probe);
    var main = probe.querySelector('.clue-main'), rev = probe.querySelector('.clue-reveal');
    var meta = probe.querySelector('.clue-meta'), extra = probe.querySelector('.clue-extra');
    extra.hidden = true;
    var max = 0;
    F.story.clues.forEach(function (c) {
      main.hidden = false; rev.hidden = true;
      probe.querySelector('.clue-text').textContent = c.clue;
      meta.textContent = L.lettersLabel(c.answer.length) + ', начало «' + c.answer.charAt(0) + '» · 5 из 5';
      max = Math.max(max, probe.getBoundingClientRect().height);
      main.hidden = true; rev.hidden = false;
      rev.querySelector('p').textContent = c.reveal;
      max = Math.max(max, probe.getBoundingClientRect().height);
    });
    probe.remove();
    card.style.minHeight = Math.ceil(max) + 'px';
  }

  function navList() {
    return F.story.clues.filter(function (c) { return S.isFound(c.id) || S.isOpen(c.id); });
  }
  function renderDots(flashId) {
    var box = $('dots');
    box.innerHTML = '';
    var sel = selId();
    F.story.clues.forEach(function (c, i) {
      var d = document.createElement('span');
      d.className = 'dot';
      if (S.isFound(c.id)) { d.classList.add('found'); d.style.background = window.Board.COLORS[i % 5]; }
      else if (!S.isOpen(c.id)) d.classList.add('locked');
      if (c.id === sel) d.classList.add('sel');
      if (c.id === flashId) d.classList.add('flash');
      box.appendChild(d);
    });
    box.setAttribute('aria-label', 'Найдено ' + S.foundCount() + ' из ' + F.story.clues.length);
  }

  function renderClue() {
    if (!F || !S.cur()) return;
    var c = clue(selId());
    if (!c) return;
    $('clue-main').hidden = false;
    $('clue-reveal').hidden = true;
    var h = S.hintState(c.id), found = S.isFound(c.id);
    var i = clueIdx(c.id);
    $('clue-text').textContent = c.clue;
    var meta = L.lettersLabel(c.answer.length) + ' · ' + (i + 1) + ' из ' + F.story.clues.length;
    var ans = found || h.path || h.explain;
    if (ans) meta = (found ? 'Найдено: ' : 'Ответ: ') + c.answer + ' · ' + meta;
    else if (h.start) meta = L.lettersLabel(c.answer.length) + ', начало «' + c.answer.charAt(0) + '» · ' + (i + 1) + ' из ' + F.story.clues.length;
    $('clue-meta').textContent = meta;
    var ex = $('clue-extra');
    ex.hidden = !(h.extra || h.explain) || found;
    ex.textContent = c.extra;
    $('clue-card').classList.toggle('done', found);
    $('clue-card').style.setProperty('--clue-color', window.Board.COLORS[i % 5]);
    var list = navList();
    $('clue-prev').disabled = $('clue-next').disabled = list.length < 2;
    // помощь на поле восстанавливается и после перезагрузки
    window.Board.clearHints();
    if (!found) {
      if (h.path || h.explain) window.Board.showPath(c.id, c.path);
      else if (h.start) window.Board.showStart(c.path[0]);
    }
    renderFoot();
  }
  function stepClue(dir) {
    if (F.locked) return;
    var list = navList(), sel = selId();
    var k = 0;
    list.forEach(function (c, i) { if (c.id === sel) k = i; });
    var n = list[(k + dir + list.length) % list.length];
    if (!n || n.id === sel) return;
    selectClue(n.id, 'nav');
  }
  function selectClue(id, how) {
    if (!S.select(id)) return;
    stopReveal();
    A.event('clue_selected', { story_id: F.story.id, clue_id: id, via: how });
    window.Sound.play('tap');
    renderClue(); renderDots();
  }

  function renderFoot() {
    if (!F || !S.cur()) return;
    var id = selId(), h = S.hintState(id), found = S.isFound(id);
    $('loupes').innerHTML = icon('loupe') + '<b>' + S.data.wallet.loupes + '</b>';
    $('loupes').setAttribute('aria-label', 'Лупы: ' + S.data.wallet.loupes);
    $('btn-accept').hidden = found || !(h.path || h.explain);
    $('btn-hint').disabled = found;
    $('hint-badge').hidden = found || h.explain || S.activeMs(id) < S.explainAfter(id);
  }

  /* Попытка слова. Ответ проверяется по буквам против всех улик истории (A04, A05). */
  function onSubmit(path) {
    if (!F || F.locked || !S.cur()) return 'tap';
    var s = F.story, sel = selId();
    var m = L.match(s.grid, s.rows, s.cols, path, s.clues);
    F.attempts++;
    if (!m) {
      A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'wrong', length: path.length, turns: L.turns(path) });
      window.Sound.play('wrong');
      if (!turnTipShown && s.index === 0 && clueIdx(sel) === 2 && L.turns(clue(sel).path) > 0) {
        turnTipShown = true;
        toast('Слово может свернуть за угол — ведите, не отрывая палец');
      } else toast('Попробуем другую цепочку');
      scheduleGhost();
      return 'wrong';
    }
    var id = m.clue.id;
    if (S.isFound(id)) { A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'repeat' }); toast('Это слово уже найдено'); return 'tap'; }
    if (!S.isOpen(id)) { A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'locked' }); toast('Это слово пригодится чуть позже'); return 'tap'; }
    A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'ok', solved_clue_id: id, length: path.length });
    solve(id, m.path, 'trace');
    return 'ok';
  }

  function solve(id, path, how) {
    var s = F.story, sel = selId(), c = clue(id);
    var active = S.activeMs(id);
    var h = S.hintState(id);
    var r = S.found(id, path);
    if (!r || r.already) return;
    window.Board.markFound(id, path);
    window.Board.stopPointer();
    clearTimeout(F.ghostTimer);
    window.Sound.play('found');
    A.event('clue_solved', { story_id: s.id, clue_id: id, method: how, active_ms: Math.round(active), attempts: F.attempts,
      selected_clue_id: sel, hints: Object.keys(h).filter(function (k) { return h[k]; }) });
    F.attempts = 0;
    revealItem(id);
    renderDots(id !== sel ? id : null);
    showReveal(c);
    if (r.complete) {
      F.locked = true;
      var reward = S.complete(); // награда записана до анимации (ТЗ §5, 2–4 мин)
      A.event('story_complete', { story_id: s.id, first: reward.first, stamps: reward.stamps, xp: reward.xp, item: reward.item });
      setTimeout(function () { showResult(s, reward); }, RESULT_DELAY);
    }
  }

  function showReveal(c) {
    stopReveal();
    $('clue-main').hidden = true;
    $('clue-reveal').hidden = false;
    art($('reveal-icon'), c.img, c.icon);
    $('reveal-text').textContent = c.reveal;
    $('clue-card').classList.add('revealing');
    $('btn-accept').hidden = true;
    F.revealTimer = setTimeout(endReveal, REVEAL_MS + (document.body.classList.contains('lt') ? 600 : 0));
  }
  function stopReveal() {
    if (F && F.revealTimer) { clearTimeout(F.revealTimer); F.revealTimer = null; }
    $('clue-card').classList.remove('revealing');
  }
  function endReveal() {
    stopReveal();
    if (!F || F.locked || !S.cur()) return;
    renderClue(); renderDots();
    scheduleGhost();
  }

  /* «Палец» обучения: только первая улика первой истории, через 3 с без действий. */
  function scheduleGhost() {
    if (!F) return;
    clearTimeout(F.ghostTimer);
    window.Board.stopPointer();
    if (F.story.index !== 0 || S.foundCount() > 0) return;
    F.ghostTimer = setTimeout(function () {
      if (screen !== 'scr-field' || sheetKind || window.Board.dragging || !S.cur() || S.foundCount() > 0) return;
      var c = clue(selId());
      if (c) window.Board.pointAt(c.path[0]);
    }, GHOST_MS);
  }

  /* ---------- помощь ---------- */
  function mmss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function priceText(type, id) {
    var h = S.hintState(id);
    if (h[type]) return 'Уже открыто';
    var p = S.hintPrice(type, id);
    if (p === 0) return S.data.free_demo[type] ? 'Впервые бесплатно' : 'Бесплатно';
    return p + ' ' + (p === 1 ? 'лупа' : 'лупы');
  }
  function openHints() {
    if (!F || F.locked || !S.cur()) return;
    var id = selId(), c = clue(id), h = S.hintState(id);
    if (S.isFound(id)) return;
    window.Sound.play('tap');
    A.event('hint_requested', { story_id: F.story.id, clue_id: id, active_ms: Math.round(S.activeMs(id)) });
    var left = S.explainAfter(id) - S.activeMs(id);
    var loupes = S.data.wallet.loupes;
    function opt(type, title, sub, extraCls) {
      var price = S.hintPrice(type, id);
      var dis = (type === 'explain' && left > 0 && !h.explain) || price > loupes;
      var tag = type === 'explain' ? (h.explain ? 'Уже открыто' : left > 0 ? 'через ' + mmss(left) : 'Бесплатно') : type === 'extra' ? (h.extra ? 'Уже открыта' : 'Бесплатно') : priceText(type, id);
      if (price > loupes) tag = 'Нужно ' + price + ' · у вас ' + loupes;
      return '<button class="hint-opt ' + (extraCls || '') + '" data-hint="' + type + '"' + (dis ? ' disabled' : '') + '>' +
        '<b>' + title + '</b><span class="tag">' + esc(tag) + '</span><span class="muted sub">' + sub + '</span></button>';
    }
    var html = '<h3>Подсказка</h3><p class="sheet-clue">' + esc(c.clue) + '</p><div class="hint-grid">' +
      opt('extra', 'Ещё улика', 'Описание конкретнее, без ответа') +
      opt('start', 'Начало', 'Первая буква и её клетка') +
      opt('path', 'Показать путь', 'Ответ и вся цепочка на поле') +
      opt('explain', 'Разобрать вместе', left > 0 && !h.explain ? 'Ответ и путь бесплатно — после ещё ' + mmss(left) + ' раздумий над уликой' : 'Ответ и путь — бесплатно', 'explain') + '</div>' +
      '<p class="muted small">' + icon('loupe') + ' Лупы: ' + loupes + '. Подсказки не влияют на награду за историю.</p>' +
      '<button class="btn-link" data-close>Вернуться к улике</button>';
    openSheet('hints', html, function (el) {
      el.querySelectorAll('[data-hint]').forEach(function (b) {
        b.addEventListener('click', function () { useHint(b.dataset.hint); });
      });
    });
  }
  function useHint(type) {
    var id = selId(), c = clue(id);
    var r = S.useHint(type, id, S.activeMs(id));
    if (!r.ok) {
      if (r.reason === 'loupes') toast('Не хватает луп — «Разобрать вместе» станет бесплатной');
      return;
    }
    A.event(type === 'explain' ? 'free_explain_used' : 'hint_used', { story_id: F.story.id, clue_id: id, hint_type: type,
      price: r.price, free_demo: r.free_demo, active_ms: Math.round(S.activeMs(id)), loupes_left: S.data.wallet.loupes });
    window.Sound.play('hint');
    closeSheet();
    renderClue();
    if (type === 'start') window.Board.showStart(c.path[0]);
    if (type === 'path' || type === 'explain') $('btn-accept').focus();
    else $('board').focus({ preventScroll: true });
  }
  function acceptShown() {
    var id = selId(), c = clue(id), h = S.hintState(id);
    if (!c || S.isFound(id) || !(h.path || h.explain)) return;
    solve(id, c.path, h.explain ? 'explain' : 'path');
  }

  /* ---------- активное время (ТЗ §4.3, §14.1) ---------- */
  var lastInput = Date.now(), lastTick = Date.now(), firstInput = false;
  function touched() {
    lastInput = Date.now();
    if (!firstInput) { firstInput = true; A.event('first_input', { screen: screen }); }
  }
  ['pointerdown', 'keydown'].forEach(function (t) { document.addEventListener(t, touched, true); });
  document.addEventListener('pointermove', function () { if (window.Board.dragging) lastInput = Date.now(); }, true);
  setInterval(function () {
    var t = Date.now(), dt = Math.min(t - lastTick, 1500);
    lastTick = t;
    if (screen !== 'scr-field' || !F || F.locked || sheetKind || document.hidden || t - lastInput > IDLE_MS) return;
    var id = selId();
    if (!id || S.isFound(id)) return;
    var before = S.activeMs(id);
    S.addActive(id, dt);
    if (before < S.explainAfter(id) && S.activeMs(id) >= S.explainAfter(id)) renderFoot();
  }, 1000);

  /* ---------- итог истории ---------- */
  var resultStory = null;
  function showResult(s, reward) {
    resultStory = s;
    var next = S.stories[s.index + 1];
    art($('result-bg'), s.scene, '');
    $('result-scene').dataset.story = s.id;
    renderSceneItems($('result-items'), s, function () { return true; }, true);
    $('result-title').textContent = s.title;
    $('result-ending').textContent = s.ending;
    art($('keepsake-img'), s.keepsake_img, s.keepsake_icon);
    $('keepsake-title').textContent = s.item_title;
    $('keepsake-note').textContent = s.keepsake_note;
    $('reward-line').innerHTML = reward && reward.first
      ? icon('stamp') + '+' + reward.stamps + ' марок · ' + icon('star') + '+' + reward.xp + ' опыта · находка в атласе'
      : 'Награда за эту историю уже получена';
    $('result-question').textContent = s.next_question;
    var end = !next;
    $('demo-end').hidden = !end;
    $('survey-ask').hidden = !end;
    if (end) {
      $('result-question').textContent = C.demo_end.question;
      $('demo-end-title').textContent = C.demo_end.title;
      $('demo-end-text').textContent = C.demo_end.text;
    }
    $('btn-next').textContent = end ? 'Открыть атлас' : 'Следующая история';
    $('btn-next').dataset.end = end ? '1' : '';
    $('btn-res-atlas').hidden = end;
    S.markResultSeen(s.id);
    F = null;
    show('scr-result');
    window.Sound.play(end ? 'chapter' : 'win');
    setTimeout(function () { window.Sound.play('reward'); }, 900);
    $('btn-next').focus({ preventScroll: true });
  }
  function onNext() {
    var s = resultStory;
    var next = s && S.stories[s.index + 1];
    A.event('story_next_clicked', { story_id: s ? s.id : null, next_story_id: next ? next.id : null });
    window.Sound.play('tap');
    if (next) showIntro(next); else showAtlas('result');
  }

  /* ---------- атлас ---------- */
  var atlasFrom = 'home';
  function showAtlas(from) {
    atlasFrom = from || 'home';
    A.event('atlas_open', { from: atlasFrom, items: S.data.atlas_item_ids.length });
    var got = S.data.atlas_item_ids;
    $('atlas-page-sub').textContent = got.length + ' / ' + TOTAL_SLOTS;
    var w = S.data.wallet;
    $('wallet').innerHTML =
      '<span>' + icon('stamp') + '<b>' + w.stamps + '</b> марок</span>' +
      '<span>' + icon('loupe') + '<b>' + w.loupes + '</b> луп</span>' +
      '<span>' + icon('star') + '<b>' + S.data.xp + '</b> опыта</span>';
    var grid = $('atlas-grid');
    grid.innerHTML = '';
    S.stories.forEach(function (s) {
      var has = got.indexOf(s.reward.atlas_item_id) >= 0;
      var el = document.createElement('div');
      el.className = 'slot' + (has ? ' got' : '');
      el.innerHTML = '<span class="slot-img art"></span><b>' + esc(has ? s.item_title : '?') + '</b><span class="muted">' + esc(s.place) + '</span>';
      if (has) art(el.querySelector('.slot-img'), s.keepsake_img, s.keepsake_icon);
      else el.querySelector('.slot-img').innerHTML = icon('lock');
      grid.appendChild(el);
    });
    for (var i = S.stories.length; i < TOTAL_SLOTS; i++) {
      var sl = document.createElement('div');
      sl.className = 'slot soon';
      sl.innerHTML = '<span class="slot-img"></span><b>Скоро</b><span class="muted">Новое место</span>';
      grid.appendChild(sl);
    }
    show('scr-atlas');
  }

  /* ---------- анкета для теста на друзьях ---------- */
  // Сервера у прототипа нет: ответы и выжимка журнала уходят автору одним сообщением
  // в Telegram (ссылка с вписанным текстом), запасной путь — копирование.
  var SV = window.Survey, SURVEY_KEY = 'g1f1.survey.v1', surveyFrom = 'home';
  var survey = { answers: {}, sent: 0 };
  try { var sv0 = JSON.parse(localStorage.getItem(SURVEY_KEY) || 'null'); if (sv0 && sv0.answers) survey = sv0; } catch (e) { /* без черновика */ }
  function surveySave() { try { localStorage.setItem(SURVEY_KEY, JSON.stringify(survey)); } catch (e) { /* не важнее игры */ } }
  function surveyText() {
    return SV.message({ answers: survey.answers, events: A.events, content: C,
      build: (document.querySelector('meta[name="g1f-build"]') || {}).content || 'dev',
      code: String(A.playerKey || '').slice(0, 5).toUpperCase(), env: SV.env(navigator, window) });
  }
  function surveySub() {
    $('survey-sub').textContent = survey.sent ? 'Спасибо! Можно дополнить и отправить ещё раз' : '6 коротких вопросов · 1 минута';
  }
  function renderSurvey() {
    var a = survey.answers, box = $('survey-qs');
    box.innerHTML = '';
    SV.QUESTIONS.forEach(function (q, i) {
      var f = document.createElement('fieldset');
      f.className = 'sq';
      var h = '<legend><span class="sq-n">' + (i + 1) + '</span><span>' + esc(q.title) +
        (q.type === 'many' ? ' <span class="muted small">можно несколько</span>' : '') + '</span></legend>';
      if (q.opts) h += '<div class="chips">' + q.opts.map(function (o, k) {
        var on = q.type === 'many' ? (a[q.id] || []).indexOf(k) >= 0 : a[q.id] === k;
        return '<button type="button" class="chip" data-q="' + q.id + '" data-k="' + k + '" aria-pressed="' + on + '">' + esc(o) + '</button>';
      }).join('') + '</div>';
      var tk = q.type === 'text' ? q.id : q.text ? q.id + '_text' : null;
      if (tk) h += '<textarea class="sq-text" data-t="' + tk + '" rows="' + (q.type === 'text' ? 4 : 2) + '" maxlength="500" placeholder="' +
        esc(q.type === 'text' ? 'Ваш ответ' : q.text) + '">' + esc(a[tk] || '') + '</textarea>';
      f.innerHTML = h;
      box.appendChild(f);
    });
  }
  function onSurveyChip(b) {
    var q = SV.QUESTIONS.filter(function (x) { return x.id === b.dataset.q; })[0], k = +b.dataset.k, a = survey.answers;
    if (q.type === 'many') {
      var list = (a[q.id] || []).filter(function (x) { return x !== k; });
      if (b.getAttribute('aria-pressed') !== 'true') list.push(k);
      a[q.id] = list.sort();
      b.setAttribute('aria-pressed', list.indexOf(k) >= 0);
    } else {
      a[q.id] = k;
      b.parentNode.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
    }
    surveySave();
    window.Sound.play('tap');
  }
  function showSurvey(from) {
    surveyFrom = from || 'home';
    A.event('survey_open', { from: surveyFrom, sent_before: !!survey.sent });
    renderSurvey();
    $('survey-status').textContent = '';
    $('survey-out').hidden = true;
    show('scr-survey');
  }
  function surveyBack() {
    if (surveyFrom === 'result' && resultStory) show('scr-result'); else showHome();
  }
  function showSurveyText(text) {
    var out = $('survey-out');
    out.value = text; out.hidden = false;
    out.focus(); out.select();
  }
  function surveySend(how) {
    var st = $('survey-status');
    if (!SV.answered(survey.answers)) { st.textContent = 'Ответьте хотя бы на один вопрос — тогда будет что отправить.'; return; }
    var text = surveyText(), copied = false;
    var done = function () {
      st.textContent = how === 'tg'
        ? 'Спасибо! Нажмите «Отправить» в Telegram.' + (copied ? ' Если поле сообщения пустое — вставьте текст, он уже скопирован.' : ' Если поле сообщения пустое — скопируйте текст ниже.')
        : copied ? 'Скопировано. Пришлите текст автору в Telegram @' + SV.TG + ' или туда, где вам дали ссылку.' : 'Выделите текст ниже и скопируйте его.';
      if (!copied) showSurveyText(text);
    };
    try {
      navigator.clipboard.writeText(text).then(function () { copied = true; done(); }, done);
    } catch (e) { done(); }
    if (how === 'tg') {
      var url = SV.tgLink(text), w = null;
      try { w = window.open(url, '_blank'); } catch (e) { w = null; }
      if (!w) location.href = url;
    }
    survey.sent = Date.now();
    surveySave();
    surveySub();
    A.event('survey_sent', { how: how, chars: text.length, fun: survey.answers.fun == null ? null : survey.answers.fun + 1 });
    A.flush();
  }

  /* ---------- кнопки ---------- */
  function bind() {
    $('btn-back').innerHTML = icon('back');
    $('btn-atlas-back').innerHTML = icon('back');
    $('btn-settings').innerHTML = icon('gear');
    $('clue-prev').innerHTML = icon('left');
    $('clue-next').innerHTML = icon('right');
    $('hint-ico').innerHTML = icon('bulb');
    $('atlas-icon').innerHTML = icon('book');
    $('survey-icon').innerHTML = icon('chat');
    $('btn-survey-back').innerHTML = icon('back');
    $('btn-accept').innerHTML = icon('check') + '<span>Принять ответ</span>';

    $('btn-open').addEventListener('click', function () {
      window.Sound.play('tap');
      A.event('box_opened', {});
      S.markOpened();
      var s = S.stories[0];
      S.startStory(s.id);
      A.event('story_start', { story_id: s.id, story_index: 0 });
      openField();
    });
    $('btn-continue').addEventListener('click', onContinue);
    $('btn-atlas').addEventListener('click', function () { window.Sound.play('tap'); showAtlas('home'); });
    $('btn-settings').addEventListener('click', function () { window.Sound.play('tap'); openSettings(); });
    $('btn-intro-go').addEventListener('click', function () { window.Sound.play('tap'); beginStory(introStory); });
    $('btn-intro-home').addEventListener('click', showHome);
    $('btn-back').addEventListener('click', function () { S.flush(); showHome(); });
    $('clue-prev').addEventListener('click', function () { stepClue(-1); });
    $('clue-next').addEventListener('click', function () { stepClue(1); });
    $('clue-card').addEventListener('click', function (e) {
      if (F && F.revealTimer && !e.target.closest('.clue-nav')) endReveal();
    });
    $('btn-hint').addEventListener('click', openHints);
    $('btn-accept').addEventListener('click', acceptShown);
    $('btn-next').addEventListener('click', onNext);
    $('btn-res-atlas').addEventListener('click', function () { showAtlas('result'); });
    $('btn-res-home').addEventListener('click', showHome);
    $('btn-atlas-back').addEventListener('click', showHome);
    $('btn-survey').addEventListener('click', function () { window.Sound.play('tap'); showSurvey('home'); });
    $('btn-survey-end').addEventListener('click', function () { window.Sound.play('tap'); showSurvey('result'); });
    $('btn-survey-back').addEventListener('click', surveyBack);
    $('survey-qs').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) onSurveyChip(b); });
    $('survey-qs').addEventListener('input', function (e) {
      var t = e.target.closest('[data-t]');
      if (t) { survey.answers[t.dataset.t] = t.value; surveySave(); }
    });
    $('btn-survey-tg').addEventListener('click', function () { surveySend('tg'); });
    $('btn-survey-copy').addEventListener('click', function () { surveySend('copy'); });
    $('sheet-back').addEventListener('click', closeSheet);
    $('sheet').addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheetKind) { e.preventDefault(); closeSheet(); }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { S.flush(); A.flush(); } });
    window.addEventListener('pagehide', function () { S.flush(); A.flush(); });
  }

  function boot() {
    F = null;
    if (!S.data.opened) showBox();
    else showHome();
    A.event('game_ready', { screen: screen, opened: S.data.opened, completed: S.data.completed_story_ids.length,
      in_progress: S.cur() ? S.cur().story_id : null, persistent: P.persistent });
  }

  A.event('launch', { persistent: P.persistent, w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1 });
  window.Board.mount();
  bind();
  initStaticArt();
  applySettings();
  boot();
  if (!P.persistent) { $('field-save').hidden = false; saveLine($('home-save')); }

  // Для автотестов: состояние и текущий экран, без обхода правил поля.
  window.__g1f = { state: S, get screen() { return screen; }, get sheet() { return sheetKind; },
    content: C, board: window.Board, revealNow: endReveal,
    surveyText: surveyText, get survey() { return survey; } };
})();
