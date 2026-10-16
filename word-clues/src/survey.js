/* Анкета для теста на друзьях (сборка b003+). Бэкенда у прототипа нет, поэтому ответы
   и короткая выжимка журнала собираются в одно текстовое сообщение, которое игрок сам
   отправляет автору в Telegram (или копирует). Здесь — только вопросы и сборка текста,
   без DOM: модуль проверяется в node (tests/unit.test.js). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Survey = factory();
})(this, function () {
  'use strict';

  var TG = 'fanatat';
  var TEXT_MAX = 500; // на один свободный ответ: сообщение должно влезть в ссылку и в 4096 знаков Telegram

  var QUESTIONS = [
    { id: 'fun', type: 'one', title: 'Насколько интересно было разгадывать улики?',
      opts: ['Скучно', 'Так себе', 'Нормально', 'Интересно', 'Очень интересно'] },
    { id: 'next', type: 'one', title: 'Хотелось узнать, что было дальше?',
      opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], text: 'Что именно хотелось узнать?' },
    { id: 'pain', type: 'many', title: 'Что было непонятно или неудобно?',
      opts: ['Как проводить слово', 'Улики слишком сложные', 'Улики слишком лёгкие', 'Мелкие буквы или кнопки',
        'Зачем лупы и подсказки', 'Ничего, всё понятно'], text: 'Что ещё мешало?' },
    { id: 'more', type: 'one', title: 'Если бы историй было сто, играли бы дальше?',
      opts: ['Да, понемногу каждый день', 'Иногда', 'Вряд ли'] },
    { id: 'fill', type: 'one', title: 'Как часто вы играете в филворды и другие игры со словами?',
      opts: ['Часто', 'Иногда', 'Почти никогда'] },
    { id: 'free', type: 'text', title: 'Что понравилось, что раздражало? Пишите как есть' },
  ];

  function mmss(ms) {
    var s = Math.max(0, Math.round((ms || 0) / 1000));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function clip(s) {
    s = String(s || '').replace(/\s+/g, ' ').trim();
    return s.length > TEXT_MAX ? s.slice(0, TEXT_MAX - 1) + '…' : s;
  }
  function answered(a) {
    a = a || {};
    return QUESTIONS.some(function (q) {
      var v = a[q.id];
      return q.type === 'many' ? v && v.length : q.type === 'text' ? !!clip(v) : v != null;
    }) || !!clip(a.next_text) || !!clip(a.pain_text);
  }

  // Ответы: ключ вопроса → номер варианта (one), список номеров (many) или строка (text);
  // уточнения — <ключ>_text.
  function answerLines(a) {
    a = a || {};
    var out = [];
    QUESTIONS.forEach(function (q, i) {
      var v = a[q.id], s;
      if (q.type === 'one') s = v == null ? '—' : q.opts[v] + (q.id === 'fun' ? ' (' + (v + 1) + ' из 5)' : '');
      else if (q.type === 'many') s = v && v.length ? v.map(function (k) { return q.opts[k]; }).join('; ') : '—';
      else s = clip(v) ? '«' + clip(v) + '»' : '—';
      var extra = q.text && clip(a[q.id + '_text']);
      if (extra) s += ' — «' + extra + '»';
      out.push((i + 1) + '. ' + q.title + '\n   ' + s);
    });
    return out;
  }

  // Выжимка журнала: какие истории пройдены, время и попытки по уликам, подсказки, устройство.
  function metrics(events, content, env) {
    events = events || [];
    env = env || {};
    var by = function (name) { return events.filter(function (e) { return e.event_name === name; }); };
    var out = [];
    out.push('Устройство: ' + [env.os, env.browser, env.size, env.touch ? 'касание' : 'мышь'].filter(Boolean).join(' · '));

    var sessions = {};
    events.forEach(function (e) { sessions[e.session_id] = 1; });
    var done = {};
    by('story_complete').forEach(function (e) { done[e.story_id] = 1; });
    var stories = (content && content.stories) || [];
    out.push('Пройдено историй: ' + Object.keys(done).length + ' из ' + stories.length + ' · заходов в игру: ' + Object.keys(sessions).length);

    var opened = by('box_opened')[0], first = by('clue_solved')[0];
    if (opened && first) out.push('От шкатулки до первого слова: ' + mmss(Date.parse(first.timestamp_utc) - Date.parse(opened.timestamp_utc)));
    else if (!opened) out.push('Шкатулку не открыл');
    else out.push('Ни одного слова не найдено');

    var solved = {};
    by('clue_solved').forEach(function (e) { if (!solved[e.clue_id]) solved[e.clue_id] = e; });
    var wrong = {};
    by('word_attempt').forEach(function (e) { if (e.result === 'wrong') wrong[e.clue_id] = (wrong[e.clue_id] || 0) + 1; });
    var HINT = { extra: 'д', start: 'н', path: 'п', explain: 'р' };
    var coded = false;
    stories.forEach(function (s) {
      var total = 0, parts = [], any = false;
      s.clues.forEach(function (c, i) {
        var e = solved[c.id], w = wrong[c.id] || 0;
        if (!e) { if (w) { parts.push((i + 1) + ' не найдено, ошибок ' + w); any = true; } return; }
        any = true;
        total += e.active_ms || 0;
        var p = (i + 1) + ' ' + mmss(e.active_ms);
        if (w) p += ' ош' + w;
        var h = (e.hints || []).map(function (k) { return HINT[k] || k; });
        if (e.method === 'path' || e.method === 'explain') h.push('!');
        if (h.length) { p += ' [' + h.join('') + ']'; coded = true; }
        parts.push(p);
      });
      if (!any) return;
      out.push(s.id + (done[s.id] ? ' ✓ ' : ' … ') + mmss(total) + ': ' + parts.join(' · '));
    });

    if (coded) out.push('[д — ещё улика, н — начало, п — путь, р — разбор, ! — ответ показан]');

    var next = by('story_next_clicked').filter(function (e) { return e.next_story_id; });
    if (done[stories[0] && stories[0].id]) {
      out.push('Сам перешёл к следующей истории: ' + (next.length ? 'да (' + next.length + ')' : 'нет'));
    }
    var w = by('word_attempt').filter(function (e) { return e.result === 'wrong'; }).length;
    out.push('Неверных проведений: ' + w + ' · подсказок взято: ' + by('hint_used').length + ' (+бесплатный разбор: ' + by('free_explain_used').length + ')');
    if (by('save_error').length) out.push('Прогресс не сохранялся (хранилище недоступно)');
    return out;
  }

  function message(o) {
    o = o || {};
    return ['Слова по уликам — отзыв о тесте', 'Сборка ' + (o.build || 'dev') + ' · тестер ' + (o.code || '?'), '']
      .concat(answerLines(o.answers), ['', '— замеры игры —'], metrics(o.events, o.content, o.env))
      .join('\n');
  }

  function tgLink(text) { return 'https://t.me/' + TG + '?text=' + encodeURIComponent(text); }

  // Короткое описание устройства без отпечатка: только ОС, браузер, размер окна.
  function env(nav, win) {
    var ua = (nav && nav.userAgent) || '';
    var os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1) ? 'iOS'
      : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'другая ОС';
    var br = /Telegram/i.test(ua) ? 'Telegram' : /VKClient|vkontakte/i.test(ua) ? 'ВК' : /YaBrowser|YaApp/.test(ua) ? 'Яндекс'
      : /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox|FxiOS/.test(ua) ? 'Firefox'
      : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'браузер';
    return { os: os, browser: br, size: win ? win.innerWidth + '×' + win.innerHeight : '',
      touch: !!(nav && nav.maxTouchPoints > 0) };
  }

  return { QUESTIONS: QUESTIONS, TG: TG, message: message, metrics: metrics, answerLines: answerLines,
    answered: answered, tgLink: tgLink, env: env, mmss: mmss };
});
