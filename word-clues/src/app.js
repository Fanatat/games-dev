/* Экраны P0 (ТЗ §5–§8, G1F-001…005): шкатулка → поле первой истории → итог → атлас.
   Здесь только порядок экранов и тексты; правила поля — logic.js, сохранение — state.js,
   ввод — board.js. Картинки берутся из assets/art/<имя>.webp, пока их нет — значок. */
(function () {
  'use strict';
  var C = window.G1F_CONTENT, L = window.WordLogic, A = window.Analytics, P = window.Platform;
  var S = window.GameState.create(C, P.storage);
  var $ = function (id) { return document.getElementById(id); };
  var IDLE_MS = 120000, GHOST_MS = 3000, REVEAL_MS = 2600, RESULT_DELAY = 1500;
  // Подталкивание (план эксперта №4, круг 1): 12 с над уликой — пульс «Подсказки»;
  // 15 с без луп — палец бесплатно показывает первую букву, один раз на улику.
  var NUDGE_MS = 12000, BROKE_GHOST_MS = 15000;
  var NEW_BONUS_AT = 8; // после 8-го найденного слова главы — знакомство с бонусными словами

  var ICONS = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    nomusic: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M3 3l18 18"/>',
    sound: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
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
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
    gift: '<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M3 7h18v3H3zM12 7v13M12 7c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1"/>',
    lamp: '<path d="M9 3h6l1 3H8zM8 6h8l-1 8H9zM12 14v7M9 21h6"/>',
    chat: '<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 9.5h8M8 12.5h5"/>',
  };
  function icon(name) {
    return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
  }
  function plural(n, one, few, many) {
    var a = Math.abs(n) % 100, b = a % 10;
    return a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many;
  }
  function nLoupes(n) { return n + ' ' + plural(n, 'лупа', 'лупы', 'луп'); }
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
    // пока грузится картинка — пустая бумажная плашка, а значок-эмодзи только если картинки нет (план эксперта №5, п. 4.2)
    el.classList.add('art-wait');
    var img = new Image();
    img.alt = ''; img.decoding = 'async'; img.draggable = false;
    img.onload = function () { el.classList.add('has-img'); el.classList.remove('art-wait'); };
    img.onerror = function () { missing[name] = true; img.remove(); el.classList.remove('art-wait'); };
    img.src = artUrl(name);
    el.appendChild(img);
  }
  function artUrl(name) { var list = window.G1F_ART; return 'assets/art/' + name + '.webp' + (list ? '?v=' + list[name] : ''); }
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

  var toastTimer = null, toastSeen = {};
  // Одинаковое сообщение не чаще раза в 5 с (ТЗ §4.2).
  function toast(msg) {
    var t = Date.now();
    if (toastSeen[msg] && t - toastSeen[msg] < 5000) return;
    toastSeen[msg] = t;
    var el = $('toast');
    el.textContent = msg; el.hidden = false;
    el.classList.remove('new', 'on'); void el.offsetWidth; el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2200);
  }

  /* Надпись о сохранении (P.sync): «в профиле ВК» — только после ответа ВК;
     обычное ожидание сети не пугает, отказ ВК виден. */
  var SYNC_TEXT = {
    device: 'Прогресс сохраняется на этом устройстве',
    pending: 'Прогресс отправляется в профиль ВК…',
    cloud: 'Прогресс сохранён в профиле ВК',
  };
  function newTip(msg) {
    var el = $('toast');
    el.textContent = msg; el.hidden = false;
    el.classList.add('new');
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; el.classList.remove('new'); }, 4200);
  }

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
  function toggleRow(key, title, sub) {
    var on = !!S.data.settings[key];
    return '<button class="opt toggle" data-set="' + key + '" role="switch" aria-checked="' + on + '"><span><b>' + title + '</b>' + (sub ? '<span class="muted">' + sub + '</span>' : '') + '</span><span class="sw"></span></button>';
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
      toggleRow('reduced_motion', 'Меньше движения', '') +
      toggleRow('large_text', 'Крупный текст', '') +
      (P.params.has('journal') ? '<button class="opt" id="opt-journal"><span><b>Журнал событий</b><span class="muted">Скачать JSON для разбора плейтеста</span></span></button>' : '') +
      '<button class="opt danger" id="opt-reset"><span><b>Начать заново</b><span class="muted">Сотрёт весь прогресс</span></span></button>' +
      '<p class="muted small">Сборка ' + esc(build) + ' · ' + esc(C.content_version) + '</p>' +
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

  /* ---------- главы (план эксперта b009, круг 2): атлас и счёт историй — внутри главы ---------- */
  function chTitle(num) { return 'Глава ' + num + ' · ' + S.chapter(num).title; }
  function chCount(num) { return S.chapterGot(num) + '/' + S.chapter(num).slots; }
  function storyKicker(s) {
    var n = S.chapterFull(s.chapter) ? S.chapter(s.chapter).slots : S.chapterStories(s.chapter).length;
    return 'История ' + (s.pos + 1) + ' из ' + n + ' · ' + s.place;
  }
  function lastChapter() { return S.stories[S.stories.length - 1].chapter; }
  function curChapter() { var t = homeTarget(); return t.story ? t.story.chapter : lastChapter(); }
  function atlasChip(el, num, got) {
    el.innerHTML = icon('book') + '<b>' + (got === undefined ? S.chapterGot(num) : got) + '/' + S.chapter(num).slots + '</b>';
    el.setAttribute('aria-label', 'Атлас главы ' + num + ': ' + (got === undefined ? S.chapterGot(num) : got) + ' из ' + S.chapter(num).slots);
  }

  /* ---------- дневник маршрута: зачем вернуться завтра ---------- */
  var visitInfo = { first: true, back: false, away: 0 };
  function giftText(g) {
    if (g.cover) return (C.covers[g.cover] || 'Рамка') + ' для атласа';
    var out = [];
    if (g.stamps) out.push('+' + nStamps(g.stamps));
    if (g.loupes) out.push('+' + nLoupes(g.loupes));
    return out.join(' · ');
  }
  function renderDiary(el, opts) {
    var d = S.diary();
    var dots = '';
    for (var i = 0; i < d.of; i++) {
      var on = d.days >= d.of ? true : i < d.days;
      dots += '<span class="dd' + (on ? ' on' : '') + '">' + (on ? icon('check') : (i + 1)) + '</span>';
    }
    var line = d.today ? 'Сегодня штамп стоит. Завтра: ' + giftText(d.gift) : 'Первая история сегодня: ' + giftText(d.gift);
    el.innerHTML = '<b>' + (opts && opts.back ? 'С возвращением!' : 'Дневник') + '</b>' +
      '<span class="diary-days">' + dots + '</span><span class="muted">' + esc(line) + '</span>';
    el.hidden = false;
  }

  /* ---------- улика дня (план эксперта №4, круг 2, п. 2.2): загадка на сегодня, плитки букв, серия «🔥 N» ---------- */
  var dailyPick = { day: null, picks: [], shown: null };
  function renderDaily() {
    var el = $('home-daily'), x = S.data.completed_story_ids.length ? S.daily() : null;
    if (!x) { el.hidden = true; return; }
    if (dailyPick.day !== x.day) dailyPick = { day: x.day, picks: [], shown: dailyPick.shown };
    if (dailyPick.shown !== x.day) {
      dailyPick.shown = x.day;
      A.event('daily_shown', { day: x.day, done: x.done, streak: x.streak, lost: x.lost });
    }
    var fire = x.streak ? '<span class="streak" aria-label="Дней подряд: ' + x.streak + '">🔥 ' + x.streak + '</span>' : '';
    var html = '<div class="daily-head"><b>Улика дня</b>' + fire + '</div><p class="daily-clue">' + esc(x.clue) + '</p>';
    if (x.done) {
      html += '<div class="daily-share"><span class="daily-marks" aria-label="Попыток: ' + (x.misses + 1) + '">' + dailyMarks(x) + '</span>' +
        '<button class="chip" id="btn-daily-share">' + icon('share') + 'Поделиться</button></div>' +
        '<p class="daily-done">' + icon('check') + ' <b>' + esc(x.answer) + '</b> · завтра новая</p>';
    } else {
      var p = dailyPick.picks, slots = '', tiles = '';
      for (var i = 0; i < x.answer.length; i++) {
        slots += p[i] != null ? '<button class="ds on" data-ds="' + i + '" aria-label="Убрать букву ' + x.tiles[p[i]] + '">' + x.tiles[p[i]] + '</button>'
          : '<span class="ds"></span>';
      }
      x.tiles.forEach(function (ch, j) {
        tiles += '<button class="dt" data-dt="' + j + '"' + (p.indexOf(j) >= 0 ? ' disabled' : '') + '>' + ch + '</button>';
      });
      html += '<div class="daily-slots" id="daily-slots">' + slots + '</div><div class="daily-tiles">' + tiles + '</div>' +
        '<p class="muted small daily-gain">+' + x.loupes + ' ' + icon('loupe') + (x.lost ? ' · серия начнётся заново' : x.streak ? ' · серия станет ' + (x.streak + 1) : '') + '</p>';
    }
    el.innerHTML = html;
    el.hidden = false;
  }
  // Карточка без ответа, как строка кружков Strands: промахи — ⬜, разгадка — 🟩
  function dailyMarks(x) { return new Array(Math.min(x.misses, 8) + 1).join('⬜') + '🟩'; }
  function shareDaily() {
    var x = S.daily();
    if (!x || !x.done || !C.share || !C.share.daily) return;
    var dm = x.day.split('-');
    var text = C.share.daily.replace('{date}', dm[2] + '.' + dm[1]).replace('{fire}', x.streak ? '🔥 ' + x.streak : '')
      .replace('{marks}', dailyMarks(x)).replace('{clue}', x.clue.replace(/\n/g, ' ')).replace('{n}', String(x.answer.length));
    window.Sound.play('tap');
    A.event('share_open', { from: 'daily', day: x.day, streak: x.streak, tries: x.misses + 1 });
    P.share(text).then(function (how) {
      A.event('share_done', { from: 'daily', method: how || 'cancel' });
      if (how === 'copy') toast('Скопировано — отправьте другу');
    });
  }
  function onDailyClick(e) {
    if (e.target.closest('#btn-daily-share')) { shareDaily(); return; }
    var x = S.daily();
    if (!x || x.done) return;
    var t = e.target.closest('[data-dt],[data-ds]');
    if (!t) return;
    var p = dailyPick.picks;
    if (t.dataset.ds != null) { p.splice(+t.dataset.ds, 1); window.Sound.play('tap'); renderDaily(); return; }
    if (p.length >= x.answer.length) return;
    p.push(+t.dataset.dt);
    window.Sound.play('tap');
    if (p.length < x.answer.length) { renderDaily(); return; }
    var word = p.map(function (j) { return x.tiles[j]; }).join('');
    var r = S.dailySolve(word);
    if (!r.ok) {
      A.event('daily_wrong', { day: x.day, len: word.length });
      renderDaily();
      var sl = $('daily-slots');
      if (sl) sl.classList.add('shake');
      window.Sound.play('wrong');
      setTimeout(function () { dailyPick.picks = []; renderDaily(); }, 650);
      return;
    }
    A.event('daily_solved', { day: x.day, streak: r.streak, loupes: S.data.wallet.loupes, diary: r.diary ? r.diary.day : null });
    window.Sound.play('found');
    renderDaily();
    renderDiary($('home-diary'), { back: visitInfo.back });
    pulse($('home-daily'));
    var gift = '+' + nLoupes(r.loupes) + (r.diary ? ' · дневник: ' + giftText(r.diary) : '');
    toast('Разгадано! ' + gift + (r.streak > 1 ? ' · 🔥 ' + r.streak : ''));
  }

  /* ---------- напоминание при возвращении (п. 2.3): одна картинка, что узнали, висящий вопрос ---------- */
  var recapOn = false, recapSent = false;
  function homeRecap(t) {
    var L = recapOn && t.mode !== 'done' && S.lastLearned();
    if (!L) return false;
    art($('home-art'), L.story.scene, '🏞️');
    $('home-kicker').textContent = 'В прошлый раз · ' + L.story.title;
    $('home-question').textContent = L.question;
    $('home-sub').textContent = '';
    $('btn-continue').textContent = 'Продолжить';
    if (!recapSent) { recapSent = true; A.event('recap_shown', { story_id: L.story.id, away_days: visitInfo.away }); }
    return true;
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
    $('home-chapter').textContent = 'Глава ' + (t.story ? t.story.chapter : lastChapter());
    var btn = $('btn-continue');
    if (t.mode === 'continue') {
      $('home-kicker').textContent = 'Продолжить · ' + t.story.place;
      $('home-question').textContent = t.story.teaser;
      $('home-sub').textContent = 'Найдено ' + S.foundCount() + ' из ' + t.story.clues.length;
      btn.textContent = 'Продолжить историю';
      art($('home-art'), t.story.scene, '🏞️');
    } else if (t.mode === 'start') {
      $('home-kicker').textContent = storyKicker(t.story);
      $('home-question').textContent = t.story.teaser;
      $('home-sub').textContent = t.story.title;
      btn.textContent = 'Начать историю';
      art($('home-art'), t.story.scene, '🏞️');
    } else {
      var end = S.chapter(lastChapter()).end;
      $('home-kicker').textContent = end.title;
      $('home-question').textContent = end.question;
      $('home-sub').textContent = end.text;
      btn.textContent = 'Открыть атлас';
      art($('home-art'), 'bg_town', '🏞️');
    }
    homeRecap(t);
    $('home-sub').hidden = !$('home-sub').textContent;
    btn.dataset.mode = t.mode;
    var ch = t.story ? t.story.chapter : lastChapter();
    $('atlas-sub').textContent = 'Глава ' + ch + ': ' + S.chapterGot(ch) + ' из ' + S.chapter(ch).slots + ' · ' + S.rank().name;
    $('town-tile-sub').textContent = 'Фонарей: ' + S.data.lanterns.length + ' из ' + S.stories.length + ' · марок ' + S.data.wallet.stamps;
    renderSecret($('home-secret'), ch);
    renderDaily();
    if (S.data.completed_story_ids.length) renderDiary($('home-diary'), { back: visitInfo.back });
    else $('home-diary').hidden = true;
    var nx = $('home-next');
    var after = t.story && S.stories[t.story.index + 1];
    if (t.mode !== 'done' && after) {
      nx.hidden = false;
      $('home-next-title').textContent = 'Дальше: ' + after.place;
      $('home-next-sub').textContent = 'Откроется после истории «' + t.story.title + '»';
    } else nx.hidden = true;
    saveLine($('home-save'));
    show('scr-home');
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
    var fresh = s.new_text && (S.data.completed_story_ids.indexOf(s.id) >= 0 || !S.seenNew(s.new));
    $('intro-new').hidden = !fresh;
    $('intro-new').innerHTML = fresh ? '<b class="new-badge">Новое</b> ' + esc(s.new_text) : '';
    if (s.new) S.markNew(s.new);
    $('intro-guess').classList.remove('good');
    renderGuess(s);
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

  // Сколько ответов найдено за главу: пройденные истории целиком плюс текущая.
  function wordsFound() {
    var n = S.foundCount();
    S.data.completed_story_ids.forEach(function (id) { var st = S.story(id); if (st) n += st.clues.length; });
    return n;
  }
  function clue(id) { return F.story.clues.filter(function (c) { return c.id === id; })[0]; }
  // «Нить 1/5 ●●○»: сколько общих секретов маршрута уже собрано и сколько историй до следующего.
  // Считаем собранные, а не текущий: «Нить 6/6» на последнем отрезке читалась как «всё собрано».
  function renderThread() {
    var el = $('scene-thread'), all = C.route_secrets.length, k = S.trioCount();
    if (!all || k >= all) { el.hidden = true; return; }
    var inTrio = S.data.completed_story_ids.length % 3, dots = '';
    for (var i = 0; i < 3; i++) dots += '<i class="' + (i < inTrio ? 'on' : i === inTrio ? 'cur' : '') + '"></i>';
    el.hidden = false;
    el.innerHTML = icon('book') + '<b>Нить ' + k + '/' + all + '</b><span class="th-dots">' + dots + '</span>';
    el.setAttribute('aria-label', 'Нить маршрута: собрано ' + k + ' из ' + all + ', до следующей историй: ' + (3 - inTrio));
  }
  function selId() { return S.cur() ? S.cur().selected_clue_id : null; }
  function clueIdx(id) { var i = -1; F.story.clues.forEach(function (c, k) { if (c.id === id) i = k; }); return i; }

  function openField() {
    var s = S.curStory();
    if (!s) { showHome(); return; }
    F = { story: s, locked: false, revealTimer: null, attempts: 0, ghostTimer: null };
    $('field-title').textContent = s.title;
    $('field-sub').textContent = s.place && s.place !== s.title ? s.place : 'История ' + (s.pos + 1);
    art($('scene-bg'), s.scene, '');
    $('scene').dataset.story = s.id;
    $('scr-field').classList.toggle('evening', !!s.evening);
       renderSceneItems($('scene-items'), s, function (c) { return S.isFound(c.id); }, false);
    renderThread();
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
    renderFoot();
    renderChips();
    scheduleGhost();
  }

  /* Счётчики на поле: находки атласа, бонусные слова, тайник. */
  function renderChips() {
    atlasChip($('chip-atlas'), F ? F.story.chapter : curChapter());
    if (!F || !S.cur()) return;
    var n = S.cur().bonus.length;
    var showBonus = n > 0 || F.story.index >= 3 || S.seenNew('bonus');
    $('chip-bonus').hidden = !showBonus;
    $('chip-bonus').innerHTML = icon('stamp') + '<b>' + n + '</b>';
    $('chip-bonus').setAttribute('aria-label', 'Бонусные слова: ' + n);
    var cache = F.story.cache;
    $('chip-cache').hidden = !cache || S.cacheDone(F.story.id);
    if (cache) $('chip-cache').innerHTML = icon('gift') + '<b>' + cache.answer.length + '</b>';
  }
  // Летящая надпись над полем: бонусное слово, буква, награда.
  function floatText(txt, cls, target) {
    var wrap = $('board-wrap'), el = document.createElement('div');
    el.className = 'float-word ' + (cls || '');
    el.textContent = txt;
    wrap.appendChild(el);
    var t = target && target.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    if (t && !document.body.classList.contains('rm')) {
      el.style.setProperty('--dx', Math.round(t.left + t.width / 2 - (w.left + w.width / 2)) + 'px');
      el.style.setProperty('--dy', Math.round(t.top + t.height / 2 - (w.top + 40)) + 'px');
      el.classList.add('fly');
    }
    setTimeout(function () { el.remove(); }, 1500);
  }
  function pulse(el) { el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }
  function openBonusSheet() {
    if (!F || !S.cur()) return;
    window.Sound.play('tap');
    var c = S.cur();
    var words = c.bonus.length ? c.bonus.map(function (w) { return '<span class="bw">' + esc(w) + '</span>'; }).join('') : '<span class="muted">Пока ни одного</span>';
    var html = '<h3>' + icon('stamp') + ' Бонусные слова: ' + c.bonus.length + '</h3><div class="bonus-words">' + words + '</div>' +
      '<p class="muted small">+' + S.BONUS_STAMPS + ' ' + icon('stamp') + ' за слово</p>' +
      '<button class="btn-link" data-close>Закрыть</button>';
    openSheet('bonus', html);
  }
  function openCacheSheet() {
    if (!F || !F.story.cache) return;
    window.Sound.play('tap');
    openSheet('cache', '<h3>' + icon('gift') + ' Тайник</h3><p>' + 'На поле спрятано слово без улики.' +
      '</p><p class="muted small">' + L.lettersLabel(F.story.cache.answer.length) + ' · +1 ' + icon('loupe') + ' +15 ' + icon('stamp') + '</p><button class="btn-link" data-close>Закрыть</button>');
  }

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
      if (S.isFound(c.id)) { d.classList.add('found'); d.style.background = window.Board.COLORS[i % window.Board.COLORS.length]; }
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
    var pic = c.picture && !found && !h.extra && !h.explain;
    $('clue-text').textContent = pic ? '' : c.clue;
    $('clue-text').classList.toggle('pic', !!pic);
    if (pic) {
      var im = document.createElement('span');
      im.className = 'clue-pic art' + (c.silhouette ? ' sil' : '');
      $('clue-text').appendChild(im);
      art(im, c.img, c.icon);
      var cap = document.createElement('span');
      cap.textContent = c.silhouette ? 'Чей это силуэт?' : 'Что на картинке?';
      $('clue-text').appendChild(cap);
    }
    // Письмо Полины: улика её словами, с подписью (новинка 9-й и 15-й историй)
    var letter = c.letter && !found;
    $('clue-card').classList.toggle('letter', !!letter);
    $('clue-card').dataset.letter = letter ? (F.story.letter_label || (F.story.chapter === 1 ? 'Письмо от «П.»' : 'Письмо Полины')) : '';
    var meta = (c.double ? 'Двойная улика · ' : '') + L.lettersLabel(c.answer.length) + ' · ' + (i + 1) + ' из ' + F.story.clues.length;
    var ans = found || h.path || h.explain;
    if (ans) meta = (found ? 'Найдено: ' : 'Ответ: ') + c.answer + ' · ' + meta;
    else if (h.start) meta = L.lettersLabel(c.answer.length) + ', начало «' + c.answer.charAt(0) + '» · ' + (i + 1) + ' из ' + F.story.clues.length;
    $('clue-meta').textContent = meta;
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
    $('btn-hint').classList.toggle('nudge', !found && !!(F.nudged && F.nudged[c.id]) && !(F.hintSeen && F.hintSeen[c.id]));
    if (!found && F.nudged && F.nudged[c.id] === 2 && !h.start && !h.path && !h.explain) window.Board.pointAt(c.path[0]);
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
    var drop = S.data.bonus_drop || 0, dots = '';
    for (var k = 0; k < S.BONUS_DROP; k++) dots += '<i' + (k < drop ? ' class="on"' : '') + '></i>';
    $('loupes').innerHTML = icon('loupe') + '<b>' + S.data.wallet.loupes + '</b><span class="drop" aria-hidden="true">' + dots + '</span>';
    $('loupes').setAttribute('aria-label', 'Лупы: ' + S.data.wallet.loupes + '. Бонусных слов до новой лупы: ' + (S.BONUS_DROP - drop));
    $('btn-accept').hidden = found || !(h.path || h.explain);
    $('btn-accept').parentNode.classList.toggle('accepting', !$('btn-accept').hidden);
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
      var word = L.pathWord(s.grid, path);
      if (s.cache && (word === s.cache.answer || word.split('').reverse().join('') === s.cache.answer)) return onCache(path);
      var b = S.bonusWord(word);
      if (b) return onBonus(word, path, b);
      A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'wrong', length: path.length, turns: L.turns(path) });
      window.Sound.play('wrong');
      scheduleGhost();
      // на третьей улике первой истории поворот показываем жестом, а не словами (ТЗ §5)
      if (!turnTipShown && s.index === 0 && clueIdx(sel) === 2 && L.turns(clue(sel).path) > 0) {
        turnTipShown = true;
        window.Board.demoTrace(L.demoPath(path[0], s.rows, s.cols, true), 2);
      }
      return 'wrong';
    }
    var id = m.clue.id;
    if (S.isFound(id)) { A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'repeat' }); toast('Это слово уже найдено'); return 'tap'; }
    if (!S.isOpen(id)) { A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'locked' }); toast('Это слово пригодится чуть позже'); return 'tap'; }
    A.event('word_attempt', { story_id: s.id, clue_id: sel, result: 'ok', solved_clue_id: id, length: path.length });
    solve(id, m.path, 'trace');
    return 'ok';
  }

  function onBonus(word, path, b) {
    var s = F.story;
    if (b.repeat) {
      A.event('word_attempt', { story_id: s.id, clue_id: selId(), result: 'bonus_repeat', length: path.length });
      window.Sound.play('tap');
      floatText(word + ' · уже есть', 'muted');
      return 'tap';
    }
    A.event('bonus_word', { story_id: s.id, clue_id: selId(), length: path.length, count: b.count, value: b.stamps });
    window.Sound.play('reward');
    window.Board.flashBonus(path);
    if (!S.data.traced) S.markTraced();
    renderChips();
    renderFoot();
    floatText((b.count === 1 ? 'Бонус!' : word) + ' +' + b.stamps, 'bonus', $('chip-bonus'));
    setTimeout(function () { pulse($('chip-bonus')); }, 700);
    if (b.loupe) {
      A.event('bonus_loupe', { story_id: s.id, loupes: S.data.wallet.loupes });
      setTimeout(function () { floatText('+1 лупа', 'loupe', $('loupes')); pulse($('loupes')); window.Sound.play('found'); }, 900);
    }
    scheduleGhost();
    return 'tap';
  }
  function onCache(path) {
    var s = F.story;
    var r = S.cacheFound();
    if (!r) { floatText(s.cache.answer + ' · уже есть', 'muted'); return 'tap'; }
    A.event('cache_found', { story_id: s.id, length: path.length, value: r.loupes, stamps: r.stamps });
    window.Sound.play('found');
    window.Board.markCache(s.cache.path);
    renderChips();
    floatText('Тайник: +' + nLoupes(r.loupes) + ', +' + nStamps(r.stamps), 'loupe', $('loupes'));
    setTimeout(function () { renderFoot(); pulse($('loupes')); }, 600);
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
    if (r.secret) {
      window.Board.setGold(null, false);
      var gc = window.Board.cellRect(s.secret.cell);
      A.event('secret_letter', { story_id: s.id, kind: r.secret, count: Object.keys(S.data.secret).length });
      setTimeout(function () { floatText('Буква тайного слова: ' + r.secret, 'gold'); }, 300);
    }
    if (how === 'trace' && !S.data.traced) S.markTraced();
    clearTimeout(F.ghostTimer);
    window.Sound.play('found');
    A.event('clue_solved', { story_id: s.id, clue_id: id, method: how, active_ms: Math.round(active), attempts: F.attempts,
      selected_clue_id: sel, hints: Object.keys(h).filter(function (k) { return h[k]; }) });
    F.attempts = 0;
    if (!r.complete && wordsFound() >= NEW_BONUS_AT && !S.seenNew('bonus') && S.markNew('bonus')) {
      A.event('feature_intro', { story_id: s.id, feature: 'bonus', words: wordsFound() });
      renderChips(); pulse($('chip-bonus'));
      setTimeout(function () { newTip(C.stories[3] && C.stories[3].new_text || ''); }, REVEAL_MS);
    }
    revealItem(id);
    renderDots(id !== sel ? id : null);
    showReveal(c);
    if (r.complete) {
      F.locked = true;
      var reward = S.complete(); // награда записана до анимации (ТЗ §5, 2–4 мин)
      A.event('story_complete', { story_id: s.id, first: reward.first, stamps: reward.stamps, xp: reward.xp, item: reward.item,
        bonus: reward.bonus, kind: reward.golden ? 'golden' : reward.no_hints ? 'no_hints' : 'hints', value: reward.loupes });
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

  /* «Палец» обучения без слов: в первой истории, пока игрок ни разу не провёл слово
     сам, через 3 с без действий и сразу после одиночного тапа палец проводит первые
     две буквы ответа выбранной улики и повторяет это, пока игрок не коснётся поля. */
  function tutorialOn() { return !!F && F.story.index === 0 && !S.data.traced; }
  function answerDemo() {
    var c = clue(selId());
    if (c && !S.isFound(c.id)) window.Board.demoTrace(c.path.slice(0, 2), 0);
  }
  function scheduleGhost() {
    if (!F) return;
    clearTimeout(F.ghostTimer);
    window.Board.stopPointer();
    if (!tutorialOn()) return;
    F.ghostTimer = setTimeout(function () {
      if (screen !== 'scr-field' || sheetKind || window.Board.dragging || !S.cur() || F.locked || F.revealTimer) return;
      answerDemo();
    }, GHOST_MS);
  }
  // Одиночный тап по букве: показать, что слово ведут, а не тыкают.
  function onTap(p) {
    if (!F || F.locked || !S.cur()) return;
    F.taps = (F.taps || 0) + 1;
    A.event('single_tap', { story_id: F.story.id, clue_id: selId(), taps: F.taps, tutorial: tutorialOn() });
    clearTimeout(F.ghostTimer);
    if (tutorialOn()) { answerDemo(); return; }
    // дальше — общий жест от нажатой клетки (ответ не подсказывает), не чаще трёх раз за историю
    if (F.taps <= 3) window.Board.demoTrace(L.demoPath(p, F.story.rows, F.story.cols, false), 2);
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
    $('btn-hint').classList.remove('nudge');
    F.hintSeen = F.hintSeen || {}; F.hintSeen[id] = 1;
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
    var html = '<button class="sheet-x" data-close aria-label="Вернуться к улике">×</button><h3>Подсказка</h3><p class="sheet-clue">' + esc(c.clue) + '</p><div class="hint-grid">' +
      opt('extra', 'Ещё улика', 'Конкретнее') +
      opt('start', 'Начало', 'Первая буква') +
      opt('path', 'Показать путь', 'Ответ на поле') +
      opt('explain', 'Разобрать вместе', 'Ответ на поле', 'explain') + '</div>' +
      '<p class="muted small hint-note">' + icon('loupe') + ' ' + loupes + ' · без подсказок +5 ' + icon('star') + '</p>' +
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
    if (type === 'path' || type === 'explain') $('btn-accept').focus({ preventScroll: true });
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
    nudge(id);
  }, 1000);
  /* Подталкивание: игра сама предлагает помощь, а не ждёт 90 с (план эксперта №4, круг 1). */
  function nudge(id) {
    if (tutorialOn() || F.revealTimer || window.Board.dragging) return;
    var ms = S.activeMs(id), h = S.hintState(id);
    F.nudged = F.nudged || {};
    if (ms >= NUDGE_MS && !F.nudged[id] && !h.path && !h.explain) {
      F.nudged[id] = 1;
      if (!(F.hintSeen && F.hintSeen[id])) $('btn-hint').classList.add('nudge');
      A.event('nudge_shown', { story_id: F.story.id, clue_id: id, kind: 'hint', active_ms: Math.round(ms), loupes: S.data.wallet.loupes });
    }
    if (ms >= BROKE_GHOST_MS && !S.data.wallet.loupes && F.nudged[id] !== 2 && !h.start && !h.path && !h.explain) {
      F.nudged[id] = 2;
      var c = clue(id);
      window.Board.stopPointer();
      window.Board.pointAt(c.path[0]);
      A.event('nudge_shown', { story_id: F.story.id, clue_id: id, kind: 'first_letter', active_ms: Math.round(ms), loupes: 0 });
    }
  }

  /* ---------- итог истории ---------- */
  var resultStory = null;
  function showResult(s, reward) {
    resultStory = s;
    art($('result-bg'), s.scene, '');
    preloadStory(S.stories[s.index + 1]);
    $('result-scene').dataset.story = s.id;
    renderSceneItems($('result-items'), s, function () { return true; }, true);
    $('result-scene').querySelectorAll('.scene-lamp, .lamp-cost').forEach(function (x) { x.remove(); });
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
    $('btn-next').textContent = full ? 'Финал главы' : end ? 'Открыть атлас' : 'Узнать · история ' + (nxs.pos + 1);
    $('btn-next').dataset.end = end ? '1' : '';
    $('btn-res-atlas').hidden = end;
    S.markResultSeen(s.id);
    F = null;
    renderSecret($('result-secret'), s.chapter);
    renderLantern(s);
    atlasChip($('res-atlas-chip'), s.chapter, S.chapterGot(s.chapter) - (reward && reward.item ? 1 : 0));
    show('scr-result');
    if (reward && reward.item) flyKeepsake(s.chapter);
    window.Sound.play(end ? 'chapter' : 'win');
    setTimeout(function () { window.Sound.play('reward'); }, 900);
    $('btn-next').focus({ preventScroll: true });
  }
  function chip(ico, txt, cls) { return '<span class="rw ' + (cls || '') + '">' + (ico ? icon(ico) : '') + esc(txt) + '</span>'; }
  function renderReward(s, r) {
    var line = $('reward-line'), big = $('reward-big');
    big.innerHTML = '';
    if (!r || !r.first) { line.innerHTML = 'Награда уже получена'; return; }
    var out = chip('stamp', '+' + s.reward.first_completion_stamps) + chip('star', '+' + r.xp);
    if (r.no_hints) out += chip('check', 'без подсказок', 'good');
    if (r.bonus) out += chip('stamp', r.bonus + ' бонус', 'good');
    line.innerHTML = out;
    big.appendChild(rankBar(r));
    var cards = [];
    if (r.finale) cards.push(['atlas_cover', '📔', 'Финал главы', '+' + nLoupes(r.finale.loupes) + ' · +' + nStamps(r.finale.stamps)]);
    if (r.golden) cards.push(['golden_stamp', '🏅', 'Золотая марка!', '+' + nStamps(S.GOLDEN.stamps) + ' · всего ' + S.data.golden]);
    if (r.parcel) cards.push(['reward_parcel', '🎁', 'Посылка хранителей', '+' + nLoupes(r.parcel.loupes) + ' · +' + nStamps(r.parcel.stamps)]);
    if (r.rank) cards.push(['', '⭐', r.rank.name, 'Новое звание · +' + nStamps(r.rank.stamps)]);
    if (r.trio && C.route_secrets[r.trio - 1]) cards.push(['map', '🧵', 'Нить маршрута ' + r.trio + '/' + C.route_secrets.length, '+1 строчка в атласе']);
    if (r.diary) cards.push(['logbook', '📅', 'Дневник маршрута · день ' + r.diary.day + ' из ' + r.diary.of, giftText(r.diary)]);
    if (r.cover) cards.push(['', '📘', 'Обложка «' + (C.covers[r.cover] || r.cover) + '»', 'Атлас в новой обложке']);
    cards.forEach(function (c, i) {
      var el = document.createElement('div');
      el.className = 'card reward-card';
      el.style.animationDelay = (600 + i * 350) + 'ms';
      el.innerHTML = '<span class="rc-img art"></span><span><b>' + esc(c[2]) + '</b><span class="muted">' + esc(c[3]) + '</span></span>';
      art(el.querySelector('.rc-img'), c[0], c[1]);
      big.appendChild(el);
      if (c[0] === 'golden_stamp') A.event('golden_stamp', { story_id: s.id, count: S.data.golden });
      if (c[0] === 'reward_parcel') A.event('parcel_open', { story_id: s.id, value: r.parcel.loupes, stamps: r.parcel.stamps });
      if (c[0] === 'logbook') A.event('diary_stamp', { story_id: s.id, count: r.diary.day, page: S.data.diary_pages });
    });
    if (r.rank) A.event('rank_up', { story_id: s.id, rank: r.rank.name, value: r.rank.stamps });
    if (r.trio) A.event('route_secret', { story_id: s.id, count: r.trio });
    if (S.canPickCover()) {
      var pick = document.createElement('button');
      pick.className = 'card reward-card cover-pick';
      pick.id = 'btn-cover-pick';
      pick.style.animationDelay = (600 + cards.length * 350) + 'ms';
      pick.innerHTML = '<span class="rc-img cv-swatch cv-river"></span><span><b>Обложка атласа</b><span class="muted">Выберите · бесплатно</span></span>';
      pick.addEventListener('click', function () { openCovers('result'); });
      big.appendChild(pick);
    }
  }
  // Шкала звания: ★ 75 / 110 и название (PLAYBOOK §4.11).
  function rankBar(r) {
    var k = S.rank(), el = document.createElement('div');
    el.className = 'rank-bar' + (r && r.rank ? ' up' : '');
    var pct = k.next ? Math.round(100 * (k.xp - k.from) / (k.next.xp - k.from)) : 100;
    el.innerHTML = icon('star') + '<b>' + k.xp + (k.next ? ' / ' + k.next.xp : '') + '</b><span class="bar"><i style="width:' + pct + '%"></i></span><span class="rank-name">' + esc(k.name) + '</span>';
    el.setAttribute('aria-label', 'Звание: ' + k.name + ', опыт ' + k.xp + (k.next ? ' из ' + k.next.xp : ''));
    return el;
  }

  /* ---------- оформление атласа: на что тратить марки (ТЗ §8.2) ---------- */
  function openCovers(from) {
    window.Sound.play('tap');
    var html = '<h3>Оформление атласа</h3><div class="cover-grid">' + S.covers().map(function (c) {
      var tag = c.on ? icon('check') : c.own ? '' : c.lamps ? c.lamps + ' ' + icon('lamp') : c.locked ? icon('lock') : c.price ? c.price + ' ' + icon('stamp') : 'бесплатно';
      return '<button class="cover-opt' + (c.on ? ' on' : '') + '" data-cover="' + c.id + '"' + (c.can ? '' : ' disabled') + '>' +
        '<span class="cv-swatch cv-' + c.id + '"></span><b>' + esc(C.covers[c.id] || c.id) + '</b><span class="tag">' + tag + '</span></button>';
    }).join('') + '</div><p class="muted small">' + icon('stamp') + ' ' + S.data.wallet.stamps + '</p><button class="btn-link" data-close>Закрыть</button>';
    openSheet('covers', html, function (el) {
      el.querySelectorAll('[data-cover]').forEach(function (b) {
        b.addEventListener('click', function () {
          var r = S.setCover(b.dataset.cover);
          if (!r) return;
          A.event('atlas_cover', { cover: b.dataset.cover, price: r.price, bought: r.bought, stamps: S.data.wallet.stamps });
          window.Sound.play(r.bought ? 'reward' : 'tap');
          closeSheet();
          if (from === 'result') { var p = $('btn-cover-pick'); if (p) p.remove(); renderLantern(resultStory); }
          if (screen === 'scr-atlas') showAtlas(atlasFrom, atlasCh);
        });
      });
    });
  }
  // Находка сама влетает в значок атласа (план эксперта: коллекция на виду).
  function flyKeepsake(ch) {
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
    }, 1200);
  }
  // Тайное слово главы: «_ _ _ _ Н _». У каждой главы своё (круг 5).
  function secretCells(sw) {
    return sw.word.split('').map(function (ch, i) { return '<span class="sl' + (sw.got[i] ? ' on' : '') + '">' + (sw.got[i] || '') + '</span>'; }).join('');
  }
  function renderSecret(el, ch) {
    var sw = ch && S.secretOf(ch);
    if (!sw || !sw.count) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = '<span class="muted">' + esc(sw.title) + '</span><span class="secret-cells">' + secretCells(sw) + '</span>';
  }
  // Угадать тайное слово до последней буквы: на вступлении, одна попытка.
  function renderGuess(s) {
    var box = $('intro-guess'), ch = s.chapter;
    if (!S.canGuess(ch)) { box.hidden = true; return; }
    var sw = S.secretOf(ch), opts = [sw.word].concat(S.chapter(ch).secret_decoys || []);
    if (opts.length < 2) { box.hidden = true; return; }
    if ((String(S.data.seed).charCodeAt(0) + ch) % 2) opts.reverse(); // верное слово не всегда слева
    box.hidden = false;
    box.innerHTML = '<b>' + esc(sw.title) + ': угадаете до последней буквы?</b><span class="secret-cells">' + secretCells(sw) + '</span>' +
      '<span class="guess-opts">' + opts.map(function (w) { return '<button class="btn-small" data-guess="' + esc(w) + '">' + esc(w) + '</button>'; }).join('') + '</span>' +
      '<span class="muted">Одна попытка · верно — +' + nLoupes(S.GUESS.loupes) + ' и +' + nStamps(S.GUESS.stamps) + '</span>';
    box.querySelectorAll('[data-guess]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = S.guess(ch, b.dataset.guess);
        if (!r) return;
        A.event('secret_guess', { story_id: s.id, chapter: ch, ok: r.ok });
        window.Sound.play(r.ok ? 'reward' : 'wrong');
        box.innerHTML = r.ok ? '<b>' + icon('check') + ' Верно: ' + esc(sw.word) + '!</b><span class="muted">+' + nLoupes(r.loupes) + ' · +' + nStamps(r.stamps) + '. Последняя буква — в этой истории.</span>'
          : '<b>Не угадали.</b><span class="muted">Последняя буква — в этой истории, на золотой клетке.</span>';
        box.classList.toggle('good', r.ok);
        pulse(box);
      });
    });
  }
  /* Фонарь у пройденного места: хватает марок — загорается сам в анимации итога (план эксперта №5, п. 1.3:
     зажечь — не выбор, лишний тап убран). Не хватает — карточка показывает, сколько ещё нужно. */
  var lampTimer = 0;
  function renderLantern(s) {
    var b = $('btn-lantern');
    var lit = S.data.lanterns.indexOf(s.id) >= 0;
    clearTimeout(lampTimer); lampTimer = 0;
    renderGoal();
    if (lit || S.data.completed_story_ids.indexOf(s.id) < 0) { b.hidden = true; return; }
    var can = S.canLight(s.id), cost = S.lanternCost();
    b.classList.remove('lit');
    b.onclick = function () { lightLantern(s, b); };
    if (can) {
      b.hidden = true;
      lampTimer = setTimeout(autoLamp, 1100);
      return;
    }
    b.hidden = false;
    b.disabled = true;
    b.innerHTML = '<span class="lan-img art"></span><span><b>Фонарь: ' + esc(s.place) + '</b><span class="muted">' +
      S.data.wallet.stamps + ' / ' + cost + ' ' + icon('stamp') + '</span></span>';
    art(b.querySelector('.lan-img'), 'street_lamp', '🏮');
  }
  // Шкала «фонари → ближайшая рамка атласа»: рамка выдаётся сама, когда фонарей хватает.
  function renderGoal() {
    var g = $('result-goal'), nf = S.nextFrame();
    if (!nf) { g.hidden = true; return; }
    var pct = Math.min(100, Math.round(100 * nf.have / nf.lamps)), name = C.covers[nf.id] || nf.id;
    g.hidden = false;
    g.innerHTML = icon('lamp') + '<b>' + nf.have + ' / ' + nf.lamps + '</b><span class="bar"><i style="width:' + pct + '%"></i></span><span class="rank-name">' + esc(name) + '</span>';
    g.setAttribute('aria-label', 'Фонари: ' + nf.have + ' из ' + nf.lamps + ' до награды «' + name + '»');
  }
  function autoLamp() {
    lampTimer = 0;
    var s = resultStory;
    if (s && screen === 'scr-result' && S.canLight(s.id)) return lightLantern(s, null, 'result_auto');
  }
  function lightLantern(s, b, from) {
    var r = S.light(s.id);
    if (!r) return;
    A.event('lantern_lit', { story_id: s.id, count: S.data.lanterns.length, stamps: S.data.wallet.stamps, cost: r.cost, frame: r.frame, from: from || (screen === 'scr-result' ? 'result' : 'town') });
    window.Sound.play('reward');
    if (b) {
      b.innerHTML = '<span class="lan-img art"></span><span><b>Фонарь горит: ' + esc(s.place) + '</b><span class="muted">фонарей ' + S.data.lanterns.length + ' из ' + S.stories.length + '</span></span>';
      art(b.querySelector('.lan-img'), 'street_lamp', '🏮');
      b.disabled = true; b.classList.add('lit');
    }
    if (screen === 'scr-result') {
      var sc = $('result-scene'), lamp = document.createElement('span');
      lamp.className = 'scene-lamp art';
      art(lamp, 'street_lamp', '🏮');
      sc.appendChild(lamp);
      sc.classList.remove('lamp-flash'); void sc.offsetWidth; sc.classList.add('lamp-flash');
      var cost = document.createElement('span');
      cost.className = 'lamp-cost';
      cost.innerHTML = '−' + r.cost + ' ' + icon('stamp');
      sc.appendChild(cost);
      setTimeout(function () { cost.remove(); }, 1600);
      renderGoal();
      pulse($('result-goal'));
    }
    if (r.frame) frameGift(r.frame);
    if (screen === 'scr-town') renderTown();
    return r;
  }
  // Рамка атласа за фонари: карточка на итоге (или подпись в городке), рамка уже надета.
  function frameGift(id) {
    var name = C.covers[id] || id;
    A.event('atlas_frame', { cover: id, lanterns: S.data.lanterns.length });
    setTimeout(function () { window.Sound.play('reward'); }, 500);
    if (screen !== 'scr-result') { toast(name + ' — атлас в новой рамке'); return; }
    var el = document.createElement('div');
    el.className = 'card reward-card frame-gift';
    el.innerHTML = '<span class="rc-img cv-swatch cv-' + id + '"></span><span><b>' + esc(name) + '</b><span class="muted">' + S.data.lanterns.length + ' фонарей · атлас в новой рамке</span></span>';
    var big = $('reward-big');
    big.insertBefore(el, big.firstChild && big.firstChild.nextSibling);
  }

  /* ---------- фонари Тихоречья: трата марок ---------- */
  var LAMP_SPOTS = [[18, 52], [30, 66], [44, 58], [24, 78], [56, 72], [66, 54], [78, 64], [40, 84], [86, 78], [60, 88],
    [10, 68], [34, 48], [52, 44], [72, 84], [92, 58], [14, 90], [48, 72], [82, 46], [95, 90], [64, 70]];
  function showTown() {
    A.event('town_open', { count: S.data.lanterns.length });
    renderTown();
    show('scr-town');
  }
  function renderTown() {
    $('town-sub').textContent = S.data.lanterns.length + ' / ' + S.stories.length + ' фонарей · ' + S.data.wallet.stamps + ' марок';
    var map = $('town-lamps');
    map.innerHTML = '';
    map.classList.toggle('many', S.stories.length > 10);
    S.stories.forEach(function (st, i) {
      var on = S.data.lanterns.indexOf(st.id) >= 0;
      var el = document.createElement('span');
      el.className = 'town-lamp art' + (on ? ' on' : '');
      // мест на карте меньше, чем историй, — не падаем, а ставим фонарь со сдвигом
      var sp = LAMP_SPOTS[i % LAMP_SPOTS.length], k = Math.floor(i / LAMP_SPOTS.length);
      el.style.left = Math.min(96, sp[0] + 3 * k) + '%'; el.style.top = Math.max(30, sp[1] - 6 * k) + '%';
      art(el, 'street_lamp', '🏮');
      map.appendChild(el);
    });
    var list = $('town-list');
    list.innerHTML = '';
    S.stories.forEach(function (st) {
      var on = S.data.lanterns.indexOf(st.id) >= 0, done = S.data.completed_story_ids.indexOf(st.id) >= 0;
      var row = document.createElement('div');
      row.className = 'town-row' + (on ? ' on' : '');
      // значки вместо слов (план эксперта №5, п. 20): горит — фонарь, ещё не разгадано — замок
      var right = on ? '<span class="tag" aria-label="Горит">' + icon('lamp') + '</span>' : !done ? '<span class="muted" aria-label="После истории">' + icon('lock') + '</span>' :
        '<button class="btn-small" data-light="' + st.id + '"' + (S.canLight(st.id) ? '' : ' disabled') + '>' + S.lanternCost() + ' ' + icon('stamp') + '</button>';
      row.innerHTML = '<b>' + esc(st.place) + '</b>' + right;
      list.appendChild(row);
    });
    list.querySelectorAll('[data-light]').forEach(function (b) {
      b.addEventListener('click', function () { lightLantern(S.story(b.dataset.light), null); });
    });
  }

  function onNext() {
    var s = resultStory;
    if (lampTimer) { clearTimeout(lampTimer); var lr = autoLamp(); if (lr && lr.frame) return; } // рамку не пропустить
    var end = !s || S.isChapterEnd(s), next = s && !end ? S.stories[s.index + 1] : null;
    A.event('story_next_clicked', { story_id: s ? s.id : null, next_story_id: next ? next.id : null });
    window.Sound.play('tap');
    if (next) showIntro(next);
    else if (s && S.chapterFull(s.chapter)) showFinale(s.chapter);
    else showAtlas('result', s ? s.chapter : null);
  }

  /* ---------- «На сегодня всё»: дневник, завтрашний подарок, вопрос и открытка ---------- */
  function showRest() {
    var s = resultStory, d = S.diary();
    var t = homeTarget();
    A.event('session_rest', { story_id: s ? s.id : null, completed: S.data.completed_story_ids.length, diary: d.days, today: d.today });
    $('rest-sub').textContent = 'Разгадано историй: ' + S.data.completed_story_ids.length + ' · ' + S.rank().name;
    renderDiary($('rest-diary'));
    $('rest-question').textContent = s && !S.isChapterEnd(s) ? s.next_question : t.story ? t.story.teaser : S.chapter(lastChapter()).end.question;
    renderPostcard($('rest-postcard'));
    show('scr-rest');
    window.Sound.play('tap');
  }

  /* Открытка-загадка: улика из разгаданной истории, ответ не раскрываем (план эксперта b009, круг 2). */
  function riddle() {
    var ids = S.data.completed_story_ids;
    if (!ids.length || !C.share) return null;
    var st = S.story(ids[ids.length - 1]);
    var c = st.clues[0];
    return { story: st, clue: c, text: C.share.text.replace('{clue}', c.clue.replace(/\n/g, ' ')).replace('{n}', String(c.answer.length)) };
  }
  function renderPostcard(el) {
    var r = riddle();
    el.hidden = !r;
    if (!r) return;
    el.innerHTML = '<span class="pc-img art"></span><span><b>Открытка-загадка</b><span class="muted">«' + esc(r.clue.clue.replace(/\n/g, ' ')) +
      '» — ' + r.clue.answer.length + ' букв</span></span>';
    art(el.querySelector('.pc-img'), 'postcard', '💌');
  }
  function shareRiddle(from) {
    var r = riddle();
    if (!r) return;
    window.Sound.play('tap');
    A.event('share_open', { from: from, story_id: r.story.id });
    P.share(r.text).then(function (how) {
      A.event('share_done', { from: from, method: how || 'cancel' });
      if (how === 'copy') toast('Текст открытки скопирован — отправьте его другу');
    });
  }

  /* ---------- финал главы (ТЗ §6.2): отдельный экран, заполненная страница атласа ---------- */
  var finaleNext = null, finaleCh = 1;
  function showFinale(num) {
    num = num || 1;
    finaleCh = num;
    var list = S.chapterStories(num), last = list[list.length - 1], end = S.chapter(num).end;
    finaleNext = S.stories[last.index + 1] || null;
    A.event('chapter_finale', { chapter: num, items: S.chapterGot(num), stamps: S.data.wallet.stamps, loupes: S.data.wallet.loupes });
    $('finale-kicker').textContent = chTitle(num);
    $('finale-title').textContent = end.title;
    $('finale-text').textContent = end.text;
    $('finale-question').textContent = end.question;
    $('finale-q-label').textContent = finaleNext ? chTitle(finaleNext.chapter) : 'Следующий вопрос';
    $('btn-finale-next').textContent = finaleNext ? 'Глава ' + finaleNext.chapter + ': ' + S.chapter(finaleNext.chapter).title : 'Открыть атлас';
    $('finale-reward').innerHTML = chip('stamp', '+' + S.FINALE.stamps) + chip('loupe', '+' + S.FINALE.loupes) + chip('star', String(S.data.xp));
    var g = $('finale-grid');
    g.innerHTML = '';
    g.dataset.cover = S.data.cover;
    list.forEach(function (st, i) {
      var el = document.createElement('span');
      el.className = 'finale-item art';
      el.style.animationDelay = (i * 90) + 'ms';
      if (S.data.atlas_item_ids.indexOf(st.reward.atlas_item_id) >= 0) art(el, st.keepsake_img, st.keepsake_icon);
      g.appendChild(el);
    });
    renderSecret($('finale-secret'), num);
    show('scr-finale');
    window.Sound.play('chapter');
  }

  /* ---------- атлас ---------- */
  var atlasFrom = 'home', atlasCh = 1;
  function showAtlas(from, num) {
    atlasFrom = from || 'home';
    atlasCh = num || (from === 'field' && F ? F.story.chapter : from === 'result' && resultStory ? resultStory.chapter : curChapter());
    A.event('atlas_open', { from: atlasFrom, items: S.data.atlas_item_ids.length, chapter: atlasCh });
    var got = S.data.atlas_item_ids;
    $('atlas-page-sub').textContent = S.chapterGot(atlasCh) + ' / ' + S.chapter(atlasCh).slots;
    var tabs = $('atlas-tabs');
    tabs.innerHTML = S.chapters.map(function (c) {
      return '<button class="chip atlas-tab" data-ch="' + c.num + '" aria-pressed="' + (c.num === atlasCh) + '">Глава ' + c.num +
        ' <b>' + chCount(c.num) + '</b></button>';
    }).join('');
    tabs.querySelectorAll('[data-ch]').forEach(function (b) {
      b.addEventListener('click', function () { window.Sound.play('tap'); showAtlas(atlasFrom, +b.dataset.ch); });
    });
    $('atlas-h').textContent = chTitle(atlasCh);
    var w = S.data.wallet;
    $('wallet').innerHTML =
      '<span aria-label="Марки">' + icon('stamp') + '<b>' + w.stamps + '</b></span>' +
      '<span aria-label="Лупы">' + icon('loupe') + '<b>' + w.loupes + '</b></span>' +
      (S.data.golden ? '<span class="gold" aria-label="Золотые марки">' + icon('stamp') + '<b>' + S.data.golden + '</b></span>' : '');
    $('atlas-rank').innerHTML = '';
    $('atlas-rank').appendChild(rankBar(null));
    $('scr-atlas').dataset.cover = S.data.cover;
    var trio = S.trioCount(), rs = $('atlas-route');
    rs.hidden = !trio;
    rs.innerHTML = '<b>' + icon('book') + ' Нить маршрута ' + Math.min(trio, C.route_secrets.length) + '/' + C.route_secrets.length + '</b>' +
      C.route_secrets.slice(0, trio).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var grid = $('atlas-grid');
    grid.innerHTML = '';
    S.chapterStories(atlasCh).forEach(function (s) {
      var has = got.indexOf(s.reward.atlas_item_id) >= 0;
      var el = document.createElement('button');
      el.className = 'slot' + (has ? ' got' : '') + (s.index < trio * 3 ? ' linked' : '');
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
    $('clue-prev').innerHTML = icon('left');
    $('clue-next').innerHTML = icon('right');
    $('hint-ico').innerHTML = icon('bulb');
    $('atlas-icon').innerHTML = icon('book');
    $('btn-covers').innerHTML = '<span class="cv-swatch cv-river"></span><span>Оформление</span>';
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
    $('btn-hint').addEventListener('click', openHints);
    $('chip-bonus').addEventListener('click', openBonusSheet);
    $('chip-cache').addEventListener('click', openCacheSheet);
    $('chip-atlas').addEventListener('click', function () { S.flush(); showAtlas('field'); });
    $('res-atlas-chip').addEventListener('click', function () { showAtlas('result'); });
    $('btn-town').addEventListener('click', function () { window.Sound.play('tap'); showTown(); });
    $('btn-town-back').innerHTML = icon('back');
    $('btn-town-back').addEventListener('click', showHome);
    $('btn-accept').addEventListener('click', acceptShown);
    $('btn-next').addEventListener('click', onNext);
    $('home-daily').addEventListener('click', onDailyClick);
    $('btn-res-atlas').addEventListener('click', function () { showAtlas('result'); });
    $('btn-res-home').addEventListener('click', showRest);
    $('btn-rest-home').addEventListener('click', function () { window.Sound.play('tap'); showHome(); });
    $('btn-rest-share').addEventListener('click', function () { shareRiddle('rest'); });
    $('btn-finale-share').addEventListener('click', function () { shareRiddle('finale'); });
    $('btn-finale-next').addEventListener('click', function () {
      window.Sound.play('tap');
      if (finaleNext) showIntro(finaleNext); else showAtlas('result', finaleCh);
    });
    $('btn-atlas-back').addEventListener('click', function () { if (atlasFrom === 'field' && S.cur()) openField(); else showHome(); });
    $('btn-atlas-home').addEventListener('click', function () { window.Sound.play('tap'); showHome(); });
    $('btn-covers').addEventListener('click', function () { openCovers('atlas'); });
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
    P.onHide(stash); // ВК: приложение свёрнуто
  }

  function boot() {
    F = null;
    visitInfo = S.visit();
    if (visitInfo.back) A.event('visit_back', { away_days: visitInfo.away, completed: S.data.completed_story_ids.length, diary: S.diary().days });
    if (!S.data.opened) showBox();
    else {
      recapOn = visitInfo.back && visitInfo.away >= 1 && !!S.lastLearned();
      showHome();
    }
    A.event('game_ready', { screen: screen, opened: S.data.opened, completed: S.data.completed_story_ids.length,
      in_progress: S.cur() ? S.cur().story_id : null, persistent: P.persistent });
  }

  function start(env) {
    var restored = !!(env && env.cloud && S.adopt(env.cloud));
    A.event('launch', { persistent: P.persistent, w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1,
      cloud: P.cloud, sync: P.sync, restored: restored });
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
