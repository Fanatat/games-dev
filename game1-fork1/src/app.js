/* Экраны (ТЗ §5–§8): шкатулка → поле → итог → главная, атлас, фонари, финал главы.
   Здесь только порядок экранов и отклик; правила поля — logic.js, сохранение — state.js, ввод — board.js.
   Упрощение 2026-10 (docs/УПРОЩЕНИЕ_2026-10.md): на поле две цифры (марки и цена помощи) и четыре кнопки,
   помощь — одна кнопка-лупа, отказ — вздрагивание, обучение — палец, жест поворота и стрелка над лупой. */
(function () {
  'use strict';
  var C = window.G1F_CONTENT, L = window.WordLogic, A = window.Analytics, P = window.Platform;
  var S = window.GameState.create(C, P.storage);
  var $ = function (id) { return document.getElementById(id); };
  var IDLE_MS = 120000, REVEAL_MS = 2600, RESULT_DELAY = 1500;
  /* Палец ведёт всё первое слово: в первый раз — почти сразу, потом после паузы и после одиночного тапа. */
  var GHOST_FIRST_MS = 900, GHOST_MS = 3000;
  var NUDGE_MS = 12000; // столько активного времени на улике — лупа подпрыгивает, первый раз со стрелкой

  var ICONS = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    nomusic: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M3 3l18 18"/>',
    sound: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
    gear: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    left: '<path d="M14 6l-6 6 6 6"/>',
    right: '<path d="M10 6l6 6-6 6"/>',
    lock: '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
  };
  function icon(name) {
    return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
  }
  function plural(n, one, few, many) {
    var a = Math.abs(n) % 100, b = a % 10;
    return a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many;
  }
  function nStamps(n) { return n + ' ' + plural(n, 'марка', 'марки', 'марок'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- картинки с запасным значком ---------- */
  var missing = {};
  function art(el, name, emoji) {
    el.innerHTML = '';
    el.classList.remove('has-img', 'art-wait');
    var ic = document.createElement('span');
    ic.className = 'art-icon'; ic.textContent = emoji || '';
    el.appendChild(ic);
    // В сборке tools/build.py кладёт список готовых картинок (имя → хеш): лишних запросов нет, кэш сбрасывается по хешу.
    var list = window.G1F_ART;
    if (!name || missing[name] || (list && !list[name])) return;
    // пока грузится картинка — пустая бумажная плашка, а значок-эмодзи только если картинки нет
    el.classList.add('art-wait');
    var img = new Image();
    img.alt = ''; img.decoding = 'async'; img.draggable = false;
    img.onload = function () { el.classList.add('has-img'); el.classList.remove('art-wait'); };
    img.onerror = function () { missing[name] = true; img.remove(); el.classList.remove('art-wait'); };
    img.src = artUrl(name);
    el.appendChild(img);
  }
  function artUrl(name) { var list = window.G1F_ART; return 'assets/art/' + name + '.webp' + (list ? '?v=' + list[name] : ''); }
  // Марка — одна валюта игры, везде один значок.
  function stampIco() { return '<img class="st-ico" src="' + artUrl('golden_stamp') + '" alt="" aria-hidden="true">'; }
  // картинки следующей истории — заранее, пока открыт итог
  var preloaded = {};
  function preloadStory(s) {
    if (!s) return;
    var list = window.G1F_ART;
    [s.scene, s.keepsake_img].concat(s.clues.map(function (c) { return c.img; })).forEach(function (n) {
      if (!n || preloaded[n] || missing[n] || (list && !list[n])) return;
      preloaded[n] = new Image();
      preloaded[n].src = artUrl(n);
    });
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
    window.Sound.duck(id === 'scr-result');
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

  /* Надпись о сохранении (P.sync): «в профиле ВК» — только после ответа ВК;
     обычное ожидание сети не пугает, отказ ВК виден. */
  var SYNC_TEXT = {
    device: 'Прогресс сохраняется на этом устройстве',
    pending: 'Прогресс отправляется в профиль ВК…',
    cloud: 'Прогресс сохранён в профиле ВК',
  };
  function saveLine(el) {
    var sync = P.sync, ok = S.saveOk && P.persistent;
    if (sync === 'failed') el.textContent = ok ? 'В профиль ВК не сохранилось — прогресс есть на этом устройстве' : 'Не получилось сохранить в профиле ВК, пробуем ещё';
    else if (!S.saveOk) el.textContent = 'Сейчас прогресс не сохраняется';
    else el.textContent = SYNC_TEXT[sync] || '';
    el.classList.toggle('warn', !ok || sync === 'failed');
  }
  var saveErrorSent = false;
  function onSaveStatus() {
    var ok = S.saveOk && P.persistent;
    $('field-save').hidden = ok;
    saveLine($('home-save'));
    if (!ok && !saveErrorSent) { saveErrorSent = true; A.event('save_error', { persistent: P.persistent, sync: P.sync }); }
  }
  S.onSave(onSaveStatus);
  P.onSync(onSaveStatus);

  /* ---------- настройки ---------- */
  function applySettings() {
    var st = S.data.settings;
    var sysRm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.toggle('rm', !!st.reduced_motion || sysRm);
    document.body.classList.toggle('lt', !!st.large_text);
    window.Sound.setEnabled(st.sound);
    window.Sound.setMusic(st.music);
    ['sound', 'music'].forEach(function (k) {
      $('btn-' + k).innerHTML = tileIcon(k, st[k]);
      $('btn-' + k).setAttribute('aria-checked', !!st[k]);
    });
    if (screen === 'scr-field') requestAnimationFrame(function () { sizeClueCard(); window.Board.fit(); });
  }
  window.addEventListener('resize', function () { if (screen === 'scr-field') { sizeClueCard(); window.Board.fit(); } });
  function toggleRow(key, title) {
    var on = !!S.data.settings[key];
    return '<button class="opt toggle" data-set="' + key + '" role="switch" aria-checked="' + on + '"><span><b>' + title + '</b></span><span class="sw"></span></button>';
  }
  var TILE_ICONS = { sound: ['sound', 'mute'], music: ['music', 'nomusic'] };
  function tileIcon(k, on) { return icon(TILE_ICONS[k][on ? 0 : 1]); }
  function tile(k, title) {
    var on = !!S.data.settings[k];
    return '<button class="tile-btn" data-set="' + k + '" role="switch" aria-checked="' + on + '">' + tileIcon(k, on) + '<span>' + title + '</span></button>';
  }
  function openSettings() {
    var build = (document.querySelector('meta[name="g1f-build"]') || {}).content || 'dev';
    var html = '<h3>Настройки</h3>' +
      '<div class="tile-row">' + tile('sound', 'Звук') + tile('music', 'Музыка') + '</div>' +
      toggleRow('reduced_motion', 'Меньше движения') +
      toggleRow('large_text', 'Крупный текст') +
      (P.dev && P.params.has('journal') ? '<button class="opt" id="opt-journal"><span><b>Журнал событий</b><span class="muted">Скачать JSON для разбора плейтеста</span></span></button>' : '') +
      '<button class="opt danger" id="opt-reset"><span><b>Начать заново</b><span class="muted">Сотрёт весь прогресс</span></span></button>' +
      '<p class="muted small">Версия ' + esc(build) + '</p>' +
      '<button class="btn-link" data-close>Закрыть</button>';
    openSheet('settings', html, function (el) {
      el.querySelectorAll('[data-set]').forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.dataset.set, v = !S.data.settings[k];
          S.setSetting(k, v);
          b.setAttribute('aria-checked', v);
          if (TILE_ICONS[k]) b.querySelector('svg').outerHTML = tileIcon(k, v);
          applySettings();
          window.Sound.play('tap');
        });
      });
      var j = el.querySelector('#opt-journal');
      if (j) j.addEventListener('click', function () { A.exportJson(); });
      el.querySelector('#opt-reset').addEventListener('click', confirmReset);
    });
  }
  function confirmReset() {
    openSheet('confirm', '<h3>Начать заново?</h3><p>Найденные слова, атлас, марки и фонари будут стёрты на этом устройстве.</p>' +
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

  /* ---------- главы: атлас и счёт историй — внутри главы ---------- */
  function chTitle(num) { return 'Глава ' + num + ' · ' + S.chapter(num).title; }
  function storyKicker(s) {
    var n = S.chapterFull(s.chapter) ? S.chapter(s.chapter).slots : S.chapterStories(s.chapter).length;
    return 'История ' + (s.pos + 1) + ' из ' + n + ' · ' + s.place;
  }
  function lastChapter() { return S.stories[S.stories.length - 1].chapter; }
  function curChapter() { var t = homeTarget(); return t.story ? t.story.chapter : lastChapter(); }
  function atlasChip(el, num, got) {
    var n = got === undefined ? S.chapterGot(num) : got;
    el.innerHTML = '<span class="chip-img art"></span><b>' + n + '/' + S.chapter(num).slots + '</b>';
    art(el.querySelector('.chip-img'), 'atlas_cover', '📔');
    el.setAttribute('aria-label', 'Атлас главы ' + num + ': ' + n + ' из ' + S.chapter(num).slots);
  }

  /* ---------- напоминание при возвращении (п. 2.3): одна картинка, что узнали, висящий вопрос ---------- */
  var visitInfo = { first: true, back: false, away: 0 };
  var recapOn = false, recapSent = false;
  function homeRecap(t) {
    var R = recapOn && t.mode !== 'done' && S.lastLearned();
    if (!R) return false;
    art($('home-art'), R.story.scene, '🏞️');
    $('home-kicker').textContent = 'В прошлый раз · ' + R.story.title;
    $('home-question').textContent = R.question;
    $('home-sub').textContent = '';
    $('btn-continue').textContent = 'Продолжить';
    if (!recapSent) { recapSent = true; A.event('recap_shown', { story_id: R.story.id, away_days: visitInfo.away }); }
    return true;
  }

  /* ---------- главная: место, одна главная кнопка, фонарь и атлас плитками ---------- */
  function homeTarget() {
    var cur = S.curStory();
    if (cur) return { story: cur, mode: 'continue' };
    var id = S.nextStoryId();
    return id ? { story: S.story(id), mode: 'start' } : { story: null, mode: 'done' };
  }
  function bar(el, have, of) { el.style.width = Math.min(100, Math.round(100 * have / Math.max(1, of))) + '%'; }
  function showHome() {
    var t = homeTarget();
    $('home-town').textContent = C.town;
    $('home-chapter').textContent = 'Глава ' + (t.story ? t.story.chapter : lastChapter());
    var btn = $('btn-continue');
    if (t.mode === 'continue') {
      $('home-kicker').textContent = storyKicker(t.story);
      $('home-question').textContent = t.story.teaser;
      $('home-sub').textContent = '';
      btn.textContent = 'Продолжить';
      art($('home-art'), t.story.scene, '🏞️');
    } else if (t.mode === 'start') {
      $('home-kicker').textContent = storyKicker(t.story);
      $('home-question').textContent = t.story.teaser;
      $('home-sub').textContent = '';
      btn.textContent = 'История ' + (t.story.pos + 1);
      art($('home-art'), t.story.scene, '🏞️');
    } else {
      var end = S.chapter(lastChapter()).end;
      $('home-kicker').textContent = end.title;
      $('home-question').textContent = end.question;
      $('home-sub').textContent = end.text;
      btn.textContent = 'Атлас';
      art($('home-art'), 'bg_town', '🏞️');
    }
    homeRecap(t);
    $('home-sub').hidden = !$('home-sub').textContent;
    btn.dataset.mode = t.mode;
    var ch = t.story ? t.story.chapter : lastChapter();
    $('atlas-sub').textContent = S.chapterGot(ch) + '/' + S.chapter(ch).slots;
    bar($('atlas-tile-bar'), S.chapterGot(ch), S.chapter(ch).slots);
    renderTownTile();
    renderSecret($('home-secret'), ch);
    saveLine($('home-save'));
    show('scr-home');
  }
  // Плитка фонаря: марки до следующего фонаря шкалой (цель между сессиями); всё горит — сколько фонарей.
  function renderTownTile() {
    var nx = S.nextLantern(), b = $('btn-town');
    if (nx) {
      $('town-tile-num').innerHTML = Math.min(nx.have, nx.cost) + '/' + nx.cost + ' ' + stampIco();
      bar($('town-tile-bar'), nx.have, nx.cost);
      b.setAttribute('aria-label', 'Фонари Тихоречья: ' + Math.min(nx.have, nx.cost) + ' из ' + nx.cost + ' марок до фонаря');
    } else {
      $('town-tile-num').textContent = S.data.lanterns.length + '/' + S.stories.length;
      bar($('town-tile-bar'), S.data.lanterns.length, S.stories.length);
      b.setAttribute('aria-label', 'Фонари Тихоречья: горит ' + S.data.lanterns.length + ' из ' + S.stories.length);
    }
    b.classList.toggle('ready', !!(nx && nx.can));
  }
  function onContinue() {
    var t = homeTarget();
    window.Sound.play('tap');
    if (recapOn) { recapOn = false; A.event('recap_continue', { mode: t.mode }); }
    if (t.mode === 'continue') openField();
    else if (t.mode === 'start') showIntro(t.story);
    else showAtlas('home');
  }

  /* ---------- вступление ---------- */
  var introStory = null;
  function showIntro(s) {
    introStory = s;
    art($('intro-art'), s.scene, '🏞️');
    $('intro-kicker').textContent = (s.pos === 0 && s.chapter > 1 ? chTitle(s.chapter) + ' · ' : '') + storyKicker(s);
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

  function clue(id) { return F.story.clues.filter(function (c) { return c.id === id; })[0]; }
  function selId() { return S.cur() ? S.cur().selected_clue_id : null; }
  function clueIdx(id) { var i = -1; F.story.clues.forEach(function (c, k) { if (c.id === id) i = k; }); return i; }

  function openField() {
    var s = S.curStory();
    if (!s) { showHome(); return; }
    F = { story: s, locked: false, revealTimer: null, attempts: 0, ghostTimer: null };
    $('field-title').textContent = s.title;
    art($('scene-bg'), s.scene, '');
    $('scene').dataset.story = s.id;
    $('scr-field').classList.toggle('evening', !!s.evening);
    renderSceneItems($('scene-items'), s, function (c) { return S.isFound(c.id); }, false);
    show('scr-field');
    sizeClueCard();
    window.Board.render(s, S.cur().found, {
      onSubmit: onSubmit,
      onStep: function (n) { window.Sound.play('step', n - 1); },
      onBack: function (n) { window.Sound.play('step', Math.max(0, n - 1)); },
      onTouch: function () { touched(); },
      onTap: onTap,
      locked: function () { return F.locked || !!sheetKind; },
    });
    if (!S.isFound(selId()) && !S.isOpen(selId())) S.select(S.firstUnfound());
    if (s.secret && !S.isFound(s.secret.clue_id)) window.Board.setGold(s.secret.cell, true);
    if (s.cache && S.cacheDone(s.id)) window.Board.markCache(s.cache.path);
    renderClue();
    renderDots();
    scheduleGhost(tutorialOn() && !S.tipSeen('finger') ? GHOST_FIRST_MS : GHOST_MS);
  }

  // Летящая надпись над полем: «+N», «Бонус!», «Почти!», буква тайного слова.
  function floatText(txt, cls, target) {
    var wrap = $('board-wrap'), el = document.createElement('div');
    el.className = 'float-word ' + (cls || '');
    el.innerHTML = txt;
    wrap.appendChild(el);
    var t = target && target.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    if (t && !document.body.classList.contains('rm')) {
      el.style.setProperty('--dx', Math.round(t.left + t.width / 2 - (w.left + w.width / 2)) + 'px');
      el.style.setProperty('--dy', Math.round(t.top + t.height / 2 - (w.top + 40)) + 'px');
      el.classList.add('fly');
    }
    setTimeout(function () { el.remove(); }, 1500);
  }
  // Марки за слово: буквы слетают с поля в предмет сцены, рядом «+N», счётчик марок подпрыгивает.
  function flyLetters(path, id, stamps) {
    var item = $('scene-items').querySelector('[data-clue="' + id + '"]'), scene = $('scene');
    if (!item) return;
    var t = item.getBoundingClientRect(), sc = scene.getBoundingClientRect();
    if (!document.body.classList.contains('rm')) {
      path.forEach(function (p, i) {
        var r = window.Board.cellRect(p);
        if (!r) return;
        var g = document.createElement('span');
        g.className = 'fly-letter';
        g.textContent = F.story.grid[p[0]][p[1]];
        g.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
        document.body.appendChild(g);
        setTimeout(function () {
          g.style.transform = 'translate(' + Math.round(t.left + t.width / 2 - r.left - r.width / 2) + 'px,' + Math.round(t.top + t.height / 2 - r.top - r.height / 2) + 'px) scale(.3)';
          g.style.opacity = '0';
        }, 30 + i * 45);
        setTimeout(function () { g.remove(); }, 800 + i * 45);
      });
    }
    var plus = document.createElement('span');
    plus.className = 'word-stamps';
    plus.innerHTML = '+' + stamps + ' ' + stampIco();
    plus.style.left = Math.round(t.left + t.width / 2 - sc.left) + 'px';
    plus.style.bottom = Math.round(Math.max(2, Math.min(sc.bottom - t.top + 2, sc.height - 28))) + 'px';
    setTimeout(function () { scene.appendChild(plus); renderStamps(true); }, document.body.classList.contains('rm') ? 0 : 450);
    setTimeout(function () { plus.remove(); }, 2300);
  }
  function pulse(el) { el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }
  function shakeEl(el) {
    if (!el) return;
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    setTimeout(function () { el.classList.remove('shake'); }, 420);
  }
  // Отказ без слов: вздрагивает то, чего не хватает, и звук «нет».
  function refuse(el) { shakeEl(el); window.Sound.play('wrong'); }

  // Найденные предметы встают на свободную полосу переднего плана сцены.
  function slotPos(i, n) {
    var left = n <= 1 ? 50 : 11 + i * (78 / (n - 1));
    return [left, i % 2 ? 11 : 3];
  }
  function renderSceneItems(box, s, isOn, animate) {
    box.innerHTML = '';
    box.dataset.n = s.clues.length;
    s.clues.forEach(function (c, i) {
      var el = document.createElement('div');
      el.className = 'scene-item art';
      el.dataset.clue = c.id;
      var pos = slotPos(i, s.clues.length);
      el.style.left = pos[0] + '%';
      el.style.bottom = pos[1] + '%';
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
      meta.innerHTML = letterCells(c, {});
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
      if (S.isFound(c.id)) { d.classList.add('found'); d.style.background = window.Board.COLORS[i % window.Board.COLORS.length]; }
      else if (!S.isOpen(c.id)) d.classList.add('locked');
      if (c.id === sel) d.classList.add('sel');
      if (c.id === flashId) d.classList.add('flash');
      box.appendChild(d);
    });
    box.setAttribute('aria-label', 'Найдено ' + S.foundCount() + ' из ' + F.story.clues.length);
  }

  // Длина ответа клетками вместо «5 букв»: первая буква — после подсказки, всё слово — после показа или находки.
  function letterCells(c, h, found) {
    var all = found || h.path || h.explain;
    return c.answer.split('').map(function (ch, i) {
      var on = all || (i === 0 && h.start);
      return '<i' + (on ? ' class="on"' : '') + '>' + (on ? ch : '') + '</i>';
    }).join('');
  }
  function renderClue() {
    if (!F || !S.cur()) return;
    var c = clue(selId());
    if (!c) return;
    $('clue-main').hidden = false;
    $('clue-reveal').hidden = true;
    var h = S.hintState(c.id), found = S.isFound(c.id);
    var i = clueIdx(c.id);
    var pic = c.picture && !found && !h.extra;
    $('clue-text').textContent = pic ? '' : c.clue;
    $('clue-text').classList.toggle('pic', !!pic);
    if (pic) {
      var im = document.createElement('span');
      im.className = 'clue-pic art' + (c.silhouette ? ' sil' : '');
      $('clue-text').appendChild(im);
      art(im, c.img, c.icon);
      var cap = document.createElement('span');
      cap.textContent = '?';
      cap.className = 'pic-q';
      $('clue-text').appendChild(cap);
    }
    // Письмо Полины: улика её словами, с подписью
    var letter = c.letter && !found;
    $('clue-card').classList.toggle('letter', !!letter);
    $('clue-card').dataset.letter = letter ? (F.story.letter_label || (F.story.chapter === 1 ? 'Письмо от «П.»' : 'Письмо Полины')) : '';
    $('clue-meta').innerHTML = letterCells(c, h, found);
    $('clue-card').setAttribute('aria-label', (c.double ? 'Двойная улика, ' : '') + L.lettersLabel(c.answer.length) + ', ' + (i + 1) + ' из ' + F.story.clues.length);
    var ex = $('clue-extra');
    ex.hidden = !(h.extra || h.explain) || found;
    $('clue-card').classList.toggle('double', !!c.double);
    ex.textContent = c.extra;
    $('clue-card').classList.toggle('done', found);
    $('clue-card').style.setProperty('--clue-color', window.Board.COLORS[i % window.Board.COLORS.length]);
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

  /* Подвал: марки и кнопка-лупа. На лупе — цена следующего шага помощи; бесплатно — без цифры;
     ответ показан — ✓ «принять»; марок не хватает — в ВК ▶ (ролик), иначе цена красным. */
  function renderStamps(bump) {
    $('stamps-n').textContent = S.data.wallet.stamps;
    $('stamps').setAttribute('aria-label', 'Марки: ' + S.data.wallet.stamps);
    if (bump) pulse($('stamps'));
  }
  function hintView(id) {
    if (!S.cur() || S.isFound(id)) return { mode: 'off' };
    if (S.shown(id)) return { mode: 'accept' };
    var n = S.nextHint(id, S.activeMs(id));
    if (!n) return { mode: 'off' };
    if (n.price <= S.data.wallet.stamps) return { mode: n.price ? 'paid' : 'free', next: n };
    return { mode: P.canAds ? 'ad' : 'short', next: n };
  }
  function renderFoot() {
    if (!F || !S.cur()) return;
    renderStamps();
    var id = selId(), v = hintView(id), b = $('btn-hint'), pr = $('hint-price');
    b.dataset.mode = v.mode;
    b.disabled = v.mode === 'off';
    if (v.mode === 'accept') { pr.innerHTML = icon('check'); b.setAttribute('aria-label', 'Принять ответ'); }
    else if (v.mode === 'free') { pr.innerHTML = ''; b.setAttribute('aria-label', 'Подсказка, бесплатно'); }
    else if (v.mode === 'ad') { pr.innerHTML = icon('play'); b.setAttribute('aria-label', 'Подсказка за ролик'); }
    else if (v.next) { pr.innerHTML = v.next.price + ' ' + stampIco(); b.setAttribute('aria-label', 'Подсказка: ' + nStamps(v.next.price)); }
    else { pr.innerHTML = ''; b.setAttribute('aria-label', 'Подсказка'); }
    b.dataset.step = v.next ? v.next.step : '';
  }

  /* Попытка слова. Ответ проверяется по буквам против всех улик истории (A04, A05). */
  function onSubmit(path) {
    if (!F || F.locked || !S.cur()) return 'tap';
    var s = F.story, sel = selId();
    var m = L.match(s.grid, s.rows, s.cols, path, s.clues);
    F.attempts++;
    if (!m) {
      var word = L.pathWord(s.grid, path);
      if (s.cache && (word === s.cache.answer || word.split('').reverse().join('') === s.cache.answer)) return onCache(path);
      // другая форма ответа (СПИЧКА при ответе СПИЧКИ) — «почти», а не бонус и не тишина
      var near = s.clues.filter(function (c) { return !S.isFound(c.id) && S.isOpen(c.id) && L.nearForm(word, c.answer); })[0];
      if (near) return onNear(word, path, near);
      var b = S.bonusWord(word);
      if (b) return onBonus(word, path, b);
      A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'wrong', length: path.length, turns: L.turns(path) });
      window.Sound.play('wrong');
      shakeEl($('clue-card'));
      scheduleGhost(GHOST_MS);
      // на третьей улике первой истории поворот показываем жестом, а не словами (ТЗ §5)
      if (s.index === 0 && clueIdx(sel) === 2 && L.turns(clue(sel).path) > 0 && S.tip('turn')) {
        tutor('turn');
        window.Board.demoTrace(L.demoPath(path[0], s.rows, s.cols, true), 2);
      }
      return 'wrong';
    }
    var id = m.clue.id;
    // уже найденное или пока закрытое слово — вздрагивает карточка, без надписи
    if (S.isFound(id) || !S.isOpen(id)) {
      A.event('word_attempt', { story_id: s.id, clue_id: sel, result: S.isFound(id) ? 'repeat' : 'locked' });
      refuse($('clue-card'));
      return 'tap';
    }
    A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'ok', solved_clue_id: id, length: path.length });
    solve(id, m.path, 'trace');
    return 'ok';
  }

  function onNear(word, path, c) {
    A.event('word_attempt', { story_id: F.story.id, clue_id: selId(), result: 'near', near_clue_id: c.id, length: path.length });
    window.Sound.play('hint');
    window.Board.flashBonus(path);
    if (c.id !== selId()) selectClue(c.id, 'near');
    shakeEl($('clue-card'));
    floatText('Почти!', 'gold');
    scheduleGhost(GHOST_MS);
    return 'tap';
  }
  function onBonus(word, path, b) {
    var s = F.story;
    if (b.repeat) {
      A.event('word_attempt', { story_id: s.id, clue_id: selId(), result: 'bonus_repeat', length: path.length });
      window.Board.flashBonus(path);
      refuse($('clue-card'));
      return 'tap';
    }
    A.event('bonus_word', { story_id: s.id, clue_id: selId(), length: path.length, count: b.count, value: b.stamps });
    window.Sound.play('found');
    window.Board.flashBonus(path);
    if (!S.data.traced) S.markTraced();
    floatText('Бонус! +' + b.stamps + ' ' + stampIco(), 'bonus', $('stamps'));
    setTimeout(function () { renderFoot(); renderStamps(true); }, 700);
    scheduleGhost(GHOST_MS);
    return 'tap';
  }
  function onCache(path) {
    var s = F.story;
    var r = S.cacheFound();
    if (!r) { window.Board.flashBonus(path); refuse($('clue-card')); return 'tap'; }
    A.event('cache_found', { story_id: s.id, length: path.length, stamps: r.stamps });
    window.Sound.play('found');
    setTimeout(function () { window.Sound.play('reward'); }, 160);
    window.Board.markCache(s.cache.path);
    floatText('Тайник! +' + r.stamps + ' ' + stampIco(), 'gold', $('stamps'));
    setTimeout(function () { renderFoot(); renderStamps(true); }, 700);
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
    hideArrow();
    if (r.secret) {
      window.Board.setGold(null, false);
      A.event('secret_letter', { story_id: s.id, kind: r.secret, count: Object.keys(S.data.secret).length });
      setTimeout(function () { floatText(r.secret, 'gold secret-float'); }, 300);
    }
    if (how === 'trace' && !S.data.traced) S.markTraced();
    clearTimeout(F.ghostTimer);
    window.Sound.play('found');
    setTimeout(function () { window.Sound.play('reward'); }, 140);
    flyLetters(path, id, r.stamps);
    A.event('clue_solved', { story_id: s.id, clue_id: id, method: how, active_ms: Math.round(active), attempts: F.attempts,
      selected_clue_id: sel, hints: Object.keys(h).filter(function (k) { return h[k]; }), value: r.stamps });
    F.attempts = 0;
    revealItem(id);
    renderDots(id !== sel ? id : null);
    showReveal(c);
    if (r.complete) {
      F.locked = true;
      var hs = S.cur().hints, used = Object.keys(hs).some(function (k) { return hs[k].start || hs[k].path || hs[k].explain; });
      var reward = S.complete(); // награда записана до анимации (ТЗ §5, 2–4 мин)
      A.event('story_complete', { story_id: s.id, first: reward.first, stamps: reward.stamps, item: reward.item,
        bonus: reward.bonus, kind: used ? 'hints' : 'no_hints', words: reward.words });
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
    renderFoot();
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
    scheduleGhost(GHOST_MS);
  }

  /* ---------- обучение без слов: три вида, каждый игрок видит один раз (событие tutor) ----------
     finger — палец ведёт всё первое слово первой истории, пока игрок сам не провёл слово;
     turn   — жест поворота на третьей улике первой истории после промаха;
     hint   — стрелка над лупой, когда игрок впервые застрял на улике. */
  function tutor(kind) { A.event('tutor', { kind: kind, story_id: F ? F.story.id : null }); }
  function tutorialOn() { return !!F && F.story.index === 0 && !S.data.traced; }
  function answerDemo() {
    var c = clue(selId());
    if (!c || S.isFound(c.id)) return;
    if (S.tip('finger')) tutor('finger');
    window.Board.demoTrace(c.path, 0);
  }
  function scheduleGhost(ms) {
    if (!F) return;
    clearTimeout(F.ghostTimer);
    window.Board.stopPointer();
    if (!tutorialOn()) return;
    F.ghostTimer = setTimeout(function () {
      if (screen !== 'scr-field' || sheetKind || window.Board.dragging || !S.cur() || F.locked || F.revealTimer) return;
      answerDemo();
    }, ms || GHOST_MS);
  }
  // Одиночный тап по букве в обучении — палец сразу показывает, что слово ведут, а не тыкают.
  function onTap() {
    if (!F || F.locked || !S.cur()) return;
    F.taps = (F.taps || 0) + 1;
    A.event('single_tap', { story_id: F.story.id, clue_id: selId(), taps: F.taps, tutorial: tutorialOn() });
    clearTimeout(F.ghostTimer);
    if (tutorialOn()) answerDemo();
    else shakeEl($('clue-card'));
  }
  function showArrow() {
    var b = $('btn-hint');
    if (b.querySelector('.hint-arrow')) return;
    var a = document.createElement('span');
    a.className = 'hint-arrow';
    a.setAttribute('aria-hidden', 'true');
    b.appendChild(a);
  }
  function hideArrow() { var a = $('btn-hint').querySelector('.hint-arrow'); if (a) a.remove(); $('btn-hint').classList.remove('nudge'); }

  /* ---------- помощь: одна кнопка-лупа, лестница «ещё улика → первая буква → слово целиком» ---------- */
  function onHint() {
    if (!F || F.locked || !S.cur()) return;
    var id = selId(), c = clue(id), v = hintView(id);
    hideArrow();
    if (v.mode === 'off') return;
    if (v.mode === 'accept') { acceptShown(); return; }
    A.event('hint_requested', { story_id: F.story.id, clue_id: id, active_ms: Math.round(S.activeMs(id)), step: v.next.step });
    if (v.mode === 'short') {
      A.event('hint_refused', { story_id: F.story.id, clue_id: id, hint_type: v.next.type, price: v.next.price, stamps: S.data.wallet.stamps });
      refuse($('stamps'));
      shakeEl($('btn-hint'));
      return;
    }
    if (v.mode === 'ad') { watchAd(id); return; }
    applyHint(id, c, S.useHint(id, S.activeMs(id)));
  }
  function applyHint(id, c, r) {
    if (!r.ok) { refuse($('stamps')); return; }
    A.event('hint_used', { story_id: F.story.id, clue_id: id, hint_type: r.type, price: r.price, free: r.free || null,
      active_ms: Math.round(S.activeMs(id)), stamps_left: S.data.wallet.stamps });
    window.Sound.play('hint');
    renderClue();
    if (r.price) floatText('−' + r.price + ' ' + stampIco(), 'muted', $('stamps'));
    if (r.type === 'start') window.Board.showStart(c.path[0]);
    if (r.type === 'path') $('btn-hint').focus({ preventScroll: true });
    else $('board').focus({ preventScroll: true });
  }
  /* Ролик за награду (только ВК): досмотрел — шаг бесплатно, ровно один раз; отказ, таймаут,
     нет ролика — вздрагивает счётчик марок; повторное нажатие во время показа ничего не делает. */
  /* Перед роликом — окно согласия с наградой (правила ВК: rewarded только по явному вызову за обозначенный бонус). */
  var AD_PRIZE = { extra: 'ещё одну подсказку к улике', start: 'первую букву слова на поле', path: 'весь путь слова на поле' };
  function watchAd(id) {
    if (F.adBusy) return;
    var v = hintView(id);
    openSheet('ad', '<h3>Подсказка за ролик</h3><p>Посмотрите короткий ролик — и получите ' + esc(AD_PRIZE[v.next.type] || 'следующую подсказку') +
      ' бесплатно. Марки не тратятся.</p><button class="btn-main" id="ad-go">Смотреть ролик</button><button class="btn-link" data-close>Не сейчас</button>', function (el) {
      el.querySelector('#ad-go').addEventListener('click', function () { closeSheet(); playAd(id); });
    });
  }
  function playAd(id) {
    if (!F || F.adBusy) return;
    F.adBusy = true;
    var field = F, story = F.story.id;
    $('btn-hint').classList.add('busy');
    A.event('ad_reward', { story_id: story, clue_id: id, result: 'start' });
    window.Sound.hold('ad', true);
    P.showRewarded(function () { grant('late'); }).then(function (r) {
      field.adBusy = false;
      window.Sound.hold('ad', false);
      $('btn-hint').classList.remove('busy');
      A.event('ad_reward', { story_id: story, clue_id: id, result: r.reason });
      if (r.ok) grant('watched');
      else refuse($('stamps'));
    });
    var done = false;
    function grant(how) {
      if (done) return;
      done = true;
      // за время ролика игрок мог уйти с поля или найти слово сам — тогда награды нет и ничего не ломается
      if (F !== field || !S.cur() || S.isFound(id) || selId() !== id) return;
      var c = clue(id), r = S.useHint(id, S.activeMs(id), { ad: true });
      if (r.ok) applyHint(id, c, r);
      if (how === 'late') A.event('ad_reward', { story_id: story, clue_id: id, result: 'late' });
    }
  }
  function acceptShown() {
    var id = selId(), c = clue(id);
    if (!c || S.isFound(id) || !S.shown(id)) return;
    solve(id, c.path, 'path');
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
    S.addActive(id, dt);
    // шаг стал бесплатным (застрял 45 / 30 с) — лупа меняет вид сразу
    if (hintView(id).mode !== $('btn-hint').dataset.mode) { renderFoot(); pulse($('btn-hint')); }
    nudge(id);
  }, 1000);
  /* Застрял: лупа подпрыгивает; самый первый раз над ней ещё и стрелка (обучающая подсказка «hint»). */
  function nudge(id) {
    if (tutorialOn() || F.revealTimer || window.Board.dragging || S.shown(id)) return;
    F.nudged = F.nudged || {};
    if (S.activeMs(id) < NUDGE_MS || F.nudged[id]) return;
    F.nudged[id] = 1;
    $('btn-hint').classList.add('nudge');
    if (S.tip('hint')) { tutor('hint'); showArrow(); }
    A.event('nudge_shown', { story_id: F.story.id, clue_id: id, active_ms: Math.round(S.activeMs(id)), stamps: S.data.wallet.stamps });
  }

  /* ---------- итог истории: сцена, находка, «+N», фонарь места, вопрос, «История N» ---------- */
  var resultStory = null;
  function showResult(s, reward) {
    resultStory = s;
    art($('result-bg'), s.scene, '');
    preloadStory(S.stories[s.index + 1]);
    $('result-scene').dataset.story = s.id;
    renderSceneItems($('result-items'), s, function () { return true; }, true);
    $('result-scene').querySelectorAll('.scene-lamp, .lamp-cost').forEach(function (x) { x.remove(); });
    if (S.data.lanterns.indexOf(s.id) >= 0) lampScene(null);
    $('result-scene').classList.remove('lamp-flash');
    $('result-title').textContent = s.title;
    $('result-ending').textContent = s.ending;
    $('result-ending').hidden = true;
    $('btn-ending').hidden = !s.ending;
    $('btn-ending').setAttribute('aria-expanded', 'false');
    art($('keepsake-img'), s.keepsake_img, s.keepsake_icon);
    $('keepsake-title').textContent = s.item_title;
    $('keepsake-note').textContent = s.keepsake_note;
    renderReward(s, reward);
    $('result-question').textContent = s.next_question;
    // Конец главы: полная глава — финал; опубликованная часть кончилась — карточка «продолжение пишется».
    var end = S.isChapterEnd(s), full = end && S.chapterFull(s.chapter), che = S.chapter(s.chapter).end;
    $('demo-end').hidden = !end || full;
    if (end) {
      $('result-question').textContent = che.question;
      $('demo-end-title').textContent = che.title;
      $('demo-end-text').textContent = che.text;
    }
    var nxs = end ? null : S.stories[s.index + 1];
    $('result-question-kicker').textContent = nxs ? 'История ' + (nxs.pos + 1) : 'Вопрос главы';
    $('btn-next').textContent = full ? 'Финал главы' : end ? 'Атлас' : 'История ' + (nxs.pos + 1);
    $('btn-next').dataset.end = end ? '1' : '';
    S.markResultSeen(s.id);
    F = null;
    renderSecret($('result-secret'), s.chapter);
    renderLantern(s);
    atlasChip($('res-atlas-chip'), s.chapter, S.chapterGot(s.chapter) - (reward && reward.item ? 1 : 0));
    show('scr-result');
    var wow = !!(reward && reward.item && s.chapter === 1 && s.pos <= 1);
    $('result-keepsake').classList.toggle('wow', wow);
    if (wow) { A.event('result_wow', { story_id: s.id }); if (s.pos === 0) flyItems(); holdNext(WOW_MS); }
    if (reward && reward.item) flyKeepsake(s.chapter, wow ? WOW_MS - 600 : 1200);
    window.Sound.play(end ? 'chapter' : 'win');
    setTimeout(function () { window.Sound.play('reward'); }, 900);
    $('btn-next').focus({ preventScroll: true });
  }
  // Главная кнопка ждёт конца полёта предметов: «вау» не пролистывают за 2 с.
  var WOW_MS = 2300, holdTimer = null;
  function holdNext(ms) {
    var b = $('btn-next');
    clearTimeout(holdTimer);
    if (document.body.classList.contains('rm')) return;
    b.disabled = true; b.classList.add('hold');
    holdTimer = setTimeout(function () { b.disabled = false; b.classList.remove('hold'); }, ms);
  }
  // Одна сумма: марки за историю и за слова (финал главы — на своём экране).
  function renderReward(s, r) {
    var line = $('reward-line');
    if (!r || !r.first) { line.innerHTML = icon('check'); line.setAttribute('aria-label', 'Награда уже получена'); return; }
    var sum = r.stamps - (r.finale ? r.finale.stamps : 0) + (r.words || 0);
    line.innerHTML = '<span class="rw">+' + sum + ' ' + stampIco() + '</span>';
    line.setAttribute('aria-label', '+' + nStamps(sum));
  }
  // Итог первой истории: все предметы сцены по очереди улетают на первую страницу атласа.
  function flyItems() {
    if (document.body.classList.contains('rm')) return;
    var to = $('res-atlas-chip');
    $('result-items').querySelectorAll('.scene-item').forEach(function (it, i) {
      setTimeout(function () {
        var a = it.getBoundingClientRect(), b = to.getBoundingClientRect();
        if (!a.width || !b.width || screen !== 'scr-result') return;
        var ghost = it.cloneNode(true);
        ghost.className = 'art fly-keep';
        ghost.style.cssText = 'left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px';
        document.body.appendChild(ghost);
        requestAnimationFrame(function () {
          ghost.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.3)';
          ghost.style.opacity = '.4';
        });
        setTimeout(function () { ghost.remove(); pulse(to); window.Sound.play('step', i + 2); }, 800);
      }, 300 + i * 220);
    });
  }
  function flyKeepsake(ch, delay) {
    var from = $('keepsake-img'), to = $('res-atlas-chip');
    if (document.body.classList.contains('rm')) { atlasChip(to, ch); return; }
    setTimeout(function () {
      var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      if (!a.width || !b.width) { atlasChip(to, ch); return; }
      var ghost = from.cloneNode(true);
      ghost.removeAttribute('id');
      ghost.className += ' fly-keep';
      ghost.style.cssText = 'left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px';
      document.body.appendChild(ghost);
      requestAnimationFrame(function () {
        ghost.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.25)';
        ghost.style.opacity = '.3';
      });
      setTimeout(function () {
        ghost.remove();
        atlasChip(to, ch);
        pulse(to);
      }, 800);
    }, delay || 1200);
  }
  // Тайное слово главы: «_ _ _ _ Н _». У каждой главы своё.
  function secretCells(sw) {
    return sw.word.split('').map(function (ch, i) { return '<span class="sl' + (sw.got[i] ? ' on' : '') + '">' + (sw.got[i] || '') + '</span>'; }).join('');
  }
  function renderSecret(el, ch) {
    var sw = ch && S.secretOf(ch);
    if (!sw || !sw.count) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = '<span class="muted">' + esc(sw.title) + '</span><span class="secret-cells">' + secretCells(sw) + '</span>';
  }
  /* Фонарь этого места — выбор игрока: марки на фонарь или на подсказки. Не хватает марок — шкала
     «есть / нужно», нажатие вздрагивает. «Дальше» по-прежнему один тап и марки не трогает. */
  function renderLantern(s) {
    var b = $('btn-lantern'), done = S.data.completed_story_ids.indexOf(s.id) >= 0;
    if (!done || S.data.lanterns.indexOf(s.id) >= 0) { b.hidden = true; return; }
    var cost = S.lanternCost(), have = S.data.wallet.stamps, can = S.canLight(s.id);
    b.hidden = false;
    b.disabled = false;
    b.classList.remove('lit');
    b.classList.toggle('can', can);
    b.setAttribute('aria-label', 'Зажечь фонарь: ' + s.place + ', ' + nStamps(cost) + (can ? '' : ', у вас ' + have));
    b.innerHTML = '<span class="lan-img art"></span><span class="lan-body"><b>' + esc(s.place) + '</b>' +
      '<span class="lan-cost">' + (can ? cost : Math.min(have, cost) + '/' + cost) + ' ' + stampIco() + '</span>' +
      (can ? '' : '<span class="bar"><i style="width:' + Math.round(100 * Math.min(have, cost) / cost) + '%"></i></span>') + '</span>';
    art(b.querySelector('.lan-img'), 'street_lamp', '🏮');
    b.onclick = function () { lightLantern(s, b); };
  }
  function lampScene(cost) {
    var sc = $('result-scene'), lamp = document.createElement('span');
    lamp.className = 'scene-lamp art';
    art(lamp, 'street_lamp', '🏮');
    sc.appendChild(lamp);
    if (!cost) return;
    sc.classList.remove('lamp-flash'); void sc.offsetWidth; sc.classList.add('lamp-flash');
    var el = document.createElement('span');
    el.className = 'lamp-cost';
    el.innerHTML = '−' + cost + ' ' + stampIco();
    sc.appendChild(el);
    setTimeout(function () { el.remove(); }, 1600);
  }
  function lightLantern(s, b) {
    var r = S.light(s.id);
    if (!r) { if (b) refuse(b); return null; }
    A.event('lantern_lit', { story_id: s.id, count: S.data.lanterns.length, stamps: S.data.wallet.stamps, cost: r.cost, from: screen === 'scr-result' ? 'result' : 'town' });
    window.Sound.play('reward');
    if (b) {
      b.classList.add('lit'); b.disabled = true;
      b.innerHTML = '<span class="lan-img art"></span><span class="lan-body"><b>' + esc(s.place) + '</b><span class="lan-cost">' + icon('check') + ' ' + S.data.lanterns.length + '/' + S.stories.length + '</span></span>';
      art(b.querySelector('.lan-img'), 'street_lamp', '🏮');
    }
    if (screen === 'scr-result') lampScene(r.cost);
    if (screen === 'scr-town') renderTown();
    return r;
  }

  /* ---------- фонари Тихоречья: трата марок ---------- */
  /* Основание фонаря (x %, y %) у своего места на картине bg_town. Порядок — порядок историй; главы 3–4 — по берегу и в деревьях, 41 место. */
  var LAMP_SPOTS = [[21, 61], [82, 57], [70, 51], [35, 55], [89, 55], [90, 70], [49, 59], [10, 72], [8, 57], [27, 66],
    [44, 47], [19, 80], [95, 59], [40, 62], [37, 77], [75, 62], [55, 48], [62, 49], [77, 47], [95, 74],
    [32, 72], [84, 72], [44, 90], [50, 86], [57, 88], [32, 90], [26, 88], [13, 90], [6, 88], [49, 44],
    [30, 48], [24, 46], [16, 45], [10, 42], [39, 40], [63, 90], [70, 92], [77, 92], [82, 38], [88, 40], [94, 43]];
  function showTown() {
    A.event('town_open', { count: S.data.lanterns.length });
    renderTown();
    show('scr-town');
  }
  function renderTown() {
    $('town-sub').innerHTML = S.data.lanterns.length + '/' + S.stories.length + ' · ' + S.data.wallet.stamps + ' ' + stampIco();
    var map = $('town-lamps');
    map.innerHTML = '';
    S.stories.forEach(function (st, i) {
      var on = S.data.lanterns.indexOf(st.id) >= 0, done = S.data.completed_story_ids.indexOf(st.id) >= 0;
      var el = document.createElement('span');
      el.className = 'town-lamp' + (on ? ' on' : '') + (done ? '' : ' far');
      el.dataset.story = st.id;
      // мест на карте меньше, чем историй, — не падаем, а ставим фонарь со сдвигом
      var sp = LAMP_SPOTS[i % LAMP_SPOTS.length], k = Math.floor(i / LAMP_SPOTS.length);
      el.style.left = Math.min(96, sp[0] + 3 * k) + '%'; el.style.top = Math.max(30, sp[1] - 6 * k) + '%';
      el.innerHTML = '<span class="tl-lamp art"></span>';
      art(el.querySelector('.tl-lamp'), 'street_lamp', '🏮');
      map.appendChild(el);
    });
    var list = $('town-list');
    list.innerHTML = '';
    S.stories.forEach(function (st) {
      var on = S.data.lanterns.indexOf(st.id) >= 0, done = S.data.completed_story_ids.indexOf(st.id) >= 0;
      var row = document.createElement('div');
      row.className = 'town-row' + (on ? ' on' : '');
      var right = !done ? '<span class="muted" aria-label="После истории">' + icon('lock') + '</span>' :
        on ? '<span class="tag" aria-label="Фонарь горит">' + icon('check') + '</span>' :
        '<button class="btn-small" data-light="' + st.id + '" aria-label="Зажечь фонарь: ' + esc(st.place) + '">' + S.lanternCost() + ' ' + stampIco() + '</button>';
      row.innerHTML = '<b>' + esc(st.place) + '</b>' + right;
      list.appendChild(row);
    });
    list.querySelectorAll('[data-light]').forEach(function (b) {
      b.addEventListener('click', function () { lightLantern(S.story(b.dataset.light), null) || refuse(b); });
    });
  }

  function onNext() {
    var s = resultStory;
    var end = !s || S.isChapterEnd(s), next = s && !end ? S.stories[s.index + 1] : null;
    A.event('story_next_clicked', { story_id: s ? s.id : null, next_story_id: next ? next.id : null });
    window.Sound.play('tap');
    if (next) showIntro(next);
    else if (s && S.chapterFull(s.chapter)) showFinale(s.chapter);
    else showAtlas('result', s ? s.chapter : null);
  }
  // Домик на итоге: на главную. Последняя история главы — сначала финал главы.
  function resultHome() {
    window.Sound.play('tap');
    if (S.finaleUnseen()) { A.event('finale_shown', { chapter: S.finaleUnseen(), from: 'home' }); showFinale(S.finaleUnseen()); return; }
    showHome();
  }

  /* ---------- финал главы (ТЗ §6.2): отдельный экран, заполненная страница атласа ---------- */
  var finaleNext = null, finaleCh = 1;
  function showFinale(num) {
    num = num || 1;
    finaleCh = num;
    var list = S.chapterStories(num), last = list[list.length - 1], end = S.chapter(num).end;
    finaleNext = S.stories[last.index + 1] || null;
    A.event('chapter_finale', { chapter: num, items: S.chapterGot(num), stamps: S.data.wallet.stamps });
    $('finale-kicker').textContent = chTitle(num);
    $('finale-title').textContent = end.title;
    $('finale-text').textContent = end.text;
    $('finale-question').textContent = end.question;
    $('finale-q-label').textContent = finaleNext ? chTitle(finaleNext.chapter) : 'Следующий вопрос';
    $('btn-finale-next').textContent = finaleNext ? 'Глава ' + finaleNext.chapter + ': ' + S.chapter(finaleNext.chapter).title : 'Атлас';
    $('finale-reward').innerHTML = '<span class="rw">+' + S.FINALE.stamps + ' ' + stampIco() + '</span>';
    var g = $('finale-grid');
    g.innerHTML = '';
    list.forEach(function (st, i) {
      var el = document.createElement('span');
      el.className = 'finale-item art';
      el.style.animationDelay = (i * 90) + 'ms';
      if (S.data.atlas_item_ids.indexOf(st.reward.atlas_item_id) >= 0) art(el, st.keepsake_img, st.keepsake_icon);
      g.appendChild(el);
    });
    renderSecret($('finale-secret'), num);
    S.markFinaleSeen(num);
    show('scr-finale');
    window.Sound.play('chapter');
  }

  /* ---------- атлас ---------- */
  var atlasFrom = 'home', atlasCh = 1;
  function showAtlas(from, num) {
    atlasFrom = from || 'home';
    atlasCh = num || (from === 'result' && resultStory ? resultStory.chapter : curChapter());
    A.event('atlas_open', { from: atlasFrom, items: S.data.atlas_item_ids.length, chapter: atlasCh });
    var got = S.data.atlas_item_ids;
    $('atlas-page-sub').textContent = S.chapterGot(atlasCh) + ' / ' + S.chapter(atlasCh).slots;
    var tabs = $('atlas-tabs');
    tabs.innerHTML = S.chapters.map(function (c) {
      return '<button class="chip atlas-tab" data-ch="' + c.num + '" aria-pressed="' + (c.num === atlasCh) + '">Глава ' + c.num +
        ' <b>' + S.chapterGot(c.num) + '/' + S.chapter(c.num).slots + '</b></button>';
    }).join('');
    tabs.querySelectorAll('[data-ch]').forEach(function (b) {
      b.addEventListener('click', function () { window.Sound.play('tap'); showAtlas(atlasFrom, +b.dataset.ch); });
    });
    $('atlas-h').textContent = chTitle(atlasCh);
    $('wallet').innerHTML = '<span aria-label="Марки: ' + S.data.wallet.stamps + '">' + stampIco() + '<b>' + S.data.wallet.stamps + '</b></span>';
    renderSecret($('atlas-secret'), atlasCh);
    var grid = $('atlas-grid');
    grid.innerHTML = '';
    S.chapterStories(atlasCh).forEach(function (s) {
      var has = got.indexOf(s.reward.atlas_item_id) >= 0;
      var el = document.createElement('button');
      el.className = 'slot' + (has ? ' got' : '');
      el.addEventListener('click', function () { openSlot(s, has); });
      el.innerHTML = '<span class="slot-img art"></span><b>' + esc(has ? s.item_title : '?') + '</b><span class="muted">' + esc(s.place) + '</span>';
      if (has) art(el.querySelector('.slot-img'), s.keepsake_img, s.keepsake_icon);
      else el.querySelector('.slot-img').innerHTML = icon('lock');
      grid.appendChild(el);
    });
    for (var i = S.chapterStories(atlasCh).length; i < S.chapter(atlasCh).slots; i++) {
      var sl = document.createElement('button');
      sl.className = 'slot soon';
      sl.addEventListener('click', function () { openSlot(null, false); });
      sl.innerHTML = '<span class="slot-img"></span><b>Скоро</b><span class="muted">Новое место</span>';
      grid.appendChild(sl);
    }
    show('scr-atlas');
  }

  // Карточка атласа: что это за находка или как её получить.
  function openSlot(s, has) {
    window.Sound.play('tap');
    var html;
    if (s && has) html = '<div class="slot-big art" id="slot-big"></div><h3>' + esc(s.item_title) + '</h3>' +
      '<p class="muted">' + esc(s.keepsake_note) + ' · ' + esc(s.place) + '</p><p>Находка из истории «' + esc(s.title) + '».</p>';
    else if (s) html = '<h3>Пока закрыто</h3><p>Находка появится здесь, когда вы разгадаете историю «' + esc(s.title) + '» (' + esc(s.place) + ').</p>';
    else html = '<h3>Скоро</h3><p>Эта история главы ещё пишется. Её место и находка появятся в атласе с обновлением.</p>';
    openSheet('slot', html + '<button class="btn-link" data-close>Закрыть</button>', function (el) {
      if (s && has) art(el.querySelector('#slot-big'), s.keepsake_img, s.keepsake_icon);
    });
  }

  /* ---------- кнопки ---------- */
  function bind() {
    $('btn-back').innerHTML = icon('back');
    $('btn-atlas-back').innerHTML = icon('back');
    $('btn-settings').innerHTML = icon('gear');
    $('btn-res-home').innerHTML = icon('home');
    $('clue-prev').innerHTML = icon('left');
    $('clue-next').innerHTML = icon('right');

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
    ['sound', 'music'].forEach(function (k) {
      $('btn-' + k).addEventListener('click', function () {
        S.setSetting(k, !S.data.settings[k]); applySettings(); window.Sound.play('tap');
        A.event('setting_changed', { key: k, value: S.data.settings[k], via: 'home' });
      });
    });
    $('btn-ending').addEventListener('click', function () {
      var open = $('result-ending').hidden; $('result-ending').hidden = !open;
      this.setAttribute('aria-expanded', open); window.Sound.play('tap');
      if (open) A.event('ending_read', { story_id: resultStory && resultStory.id });
    });
    $('btn-intro-go').addEventListener('click', function () { window.Sound.play('tap'); beginStory(introStory); });
    $('btn-intro-home').addEventListener('click', showHome);
    $('btn-back').addEventListener('click', function () {
      var c = S.cur();   // уход с поля до развязки: в Метрике level_quit
      if (c) A.event('story_leave', { story_id: c.story_id, solved: S.foundCount() });
      S.flush(); showHome();
    });
    $('clue-prev').addEventListener('click', function () { stepClue(-1); });
    $('clue-next').addEventListener('click', function () { stepClue(1); });
    $('clue-card').addEventListener('click', function (e) {
      if (F && F.revealTimer && !e.target.closest('.clue-nav')) endReveal();
    });
    $('btn-hint').addEventListener('click', onHint);
    $('res-atlas-chip').addEventListener('click', function () { showAtlas('result'); });
    $('btn-town').addEventListener('click', function () { window.Sound.play('tap'); showTown(); });
    $('btn-town-back').innerHTML = icon('back');
    $('btn-town-back').addEventListener('click', showHome);
    $('btn-next').addEventListener('click', onNext);
    $('btn-res-home').addEventListener('click', resultHome);
    $('btn-finale-next').addEventListener('click', function () {
      window.Sound.play('tap');
      if (finaleNext) showIntro(finaleNext); else showAtlas('result', finaleCh);
    });
    $('btn-atlas-back').addEventListener('click', showHome);
    $('btn-atlas-home').addEventListener('click', function () { window.Sound.play('tap'); showHome(); });
    $('btn-finale-atlas').addEventListener('click', function () { window.Sound.play('tap'); showAtlas('result', finaleCh); });
    $('btn-finale-home').addEventListener('click', showHome);
    $('sheet-back').addEventListener('click', closeSheet);
    $('sheet').addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheetKind) { e.preventDefault(); closeSheet(); }
    });
    function stash() { S.flush(); P.flush(); A.flush(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stash(); });
    window.addEventListener('pagehide', stash);
    // ВК: приложение свёрнуто — сохранить и замолчать (правила ВК 2.2.5), вернулось — звук назад
    P.onView(function (shown) { if (!shown) stash(); window.Sound.hold('view', !shown); });
  }

  function boot() {
    F = null;
    visitInfo = S.visit();
    if (visitInfo.back) A.event('visit_back', { away_days: visitInfo.away, completed: S.data.completed_story_ids.length });
    if (!S.data.opened) showBox();
    else {
      recapOn = visitInfo.back && visitInfo.away >= 1 && !!S.lastLearned();
      if (S.finaleUnseen()) { A.event('finale_shown', { chapter: S.finaleUnseen(), from: 'boot' }); showFinale(S.finaleUnseen()); }
      else showHome();
    }
    A.event('game_ready', { screen: screen, opened: S.data.opened, completed: S.data.completed_story_ids.length,
      in_progress: S.cur() ? S.cur().story_id : null, persistent: P.persistent });
  }

  function start(env) {
    var restored = !!(env && env.cloud && S.adopt(env.cloud));
    A.event('launch', { persistent: P.persistent, w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1,
      cloud: P.cloud, sync: P.sync, restored: restored });
    if (S.migrated) A.event('save_migrated', { loupes: S.migrated.loupes, stamps: S.migrated.stamps, tiers: S.migrated.tiers });
    window.Board.mount();
    bind();
    initStaticArt();
    applySettings();
    boot();
    if (!P.persistent) { $('field-save').hidden = false; saveLine($('home-save')); }

    // Для автотестов: состояние и текущий экран, без обхода правил поля.
    window.__g1f = { state: S, get screen() { return screen; }, get sheet() { return sheetKind; },
      content: C, board: window.Board, revealNow: endReveal, platform: P.name };
  }
  // В браузере — сразу; в ВК — после VKWebAppInit и чтения облачной копии (≤ 5,5 с).
  if (P.name === 'vk') P.ready.then(start); else start(null);
})();
