/* Яндекс.Метрика «Дома картинок» — цели воронки (счётчик 113661735).

   Образец — game2/analytics.js (родитель форка), счётчик свой. Источник целей —
   тот же журнал игры, что у src/track.js (HopState.addEventHook): новых мест
   разметки почти нет. Прямые вызовы из app.js только там, где журнала нет:
   итог ролика (rewarded_result), возврат в новый день (return_day), уход с
   поля (level_quit).

   Когда шлёт: только в собранной игре (build.py ставит штамп в
   <meta name="hop-build">, в исходниках там «dev») и только на публичном
   https-хосте — ВК (play.vanatat.ru), стенд games-dev. Локальный запуск,
   http:, localhost, частные адреса сети и автотесты (они на localhost) —
   не шлют ничего; с ?debug=1 цели печатаются в консоль.

   Как шлёт: tag.js грузится асинхронно после load окна (или через 5 с) в
   невидимый фрейм metrika.html без query и реферера: адрес ВК-фрейма несёт
   vk_user_id/sign, а служебные запросы tag.js читают адрес своего окна.
   До загрузки цели копятся в очереди (не больше 50), tag.js не загрузился —
   очередь пропадает, игра ничего не замечает. Вебвизор выключен.

   Параметры цели — веткой под её имя, у целей с полем — ещё и под номером
   поля (как в game2): reachGoal('level_win', { level_win: { r01_lamp_01: { sec: 41 } },
   platform, build }). platform: 'vk' | 'stand' | 'web'. */
window.HopMetrika = (function () {
  'use strict';

  var COUNTER_ID = 113661735;
  var TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';
  var FRAME_SRC = 'metrika.html';
  var FRAME_MARK = 'data-metrika-frame';
  var QUEUE_MAX = 50;
  var MOUNT_FALLBACK_MS = 5000;

  var debug = false, enabled = false, offWhy = '';
  var platform = 'web', build = 'dev';
  var state = 'queue'; // queue → loading → ready | failed
  var queue = [];
  var frame = null, win = null, mountTimer = 0;
  var firstMoveSent = false;
  var level = null; // { id, at, won, quitSent } — открытое поле

  function isLocalRun(proto, host) {
    if (proto !== 'https:') return true;
    host = String(host || '').toLowerCase().replace(/^\[|\]$/g, '');
    if (!host || host === 'localhost' || /\.(localhost|local)$/.test(host)) return true;
    if (host === '0.0.0.0' || host === '::' || host === '::1') return true;
    var ip = /^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/.exec(host);
    if (ip) {
      var a = +ip[1], b = +ip[2];
      return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
    }
    return /^(fc|fd)[0-9a-f]{2}:/.test(host) || /^fe80:/.test(host);
  }

  try {
    debug = /(^|[?&])debug=1(&|$)/.test(location.search);
    var meta = document.querySelector('meta[name="hop-build"]');
    build = String((meta && meta.getAttribute('content')) || 'dev').slice(0, 48);
    var q0 = new URLSearchParams(location.search);
    platform = (q0.has('vk_app_id') && q0.has('sign')) ? 'vk' : /\/games-dev\//.test(location.pathname) ? 'stand' : 'web';
    if (!build || build === 'dev') offWhy = 'запуск из исходников';
    else if (isLocalRun(location.protocol, location.hostname)) offWhy = 'локальный запуск';
    enabled = !offWhy;
  } catch (e) { enabled = false; offWhy = 'ошибка окружения'; }

  // Только примитивы: объект игры в Метрику не уходит.
  function clean(params) {
    var out = {};
    if (!params || typeof params !== 'object') return out;
    for (var k in params) {
      if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
      var v = params[k], t = typeof v;
      if (t === 'number') { if (isFinite(v)) out[k] = v; }
      else if (t === 'string' || t === 'boolean') out[k] = v;
    }
    return out;
  }

  function branch(p) {
    var hasLevel = Object.prototype.hasOwnProperty.call(p, 'level');
    var rest = {}, has = false;
    for (var k in p) {
      if (!Object.prototype.hasOwnProperty.call(p, k) || (hasLevel && k === 'level')) continue;
      rest[k] = p[k]; has = true;
    }
    if (!hasLevel) return has ? rest : null;
    var b = {};
    b[String(p.level)] = has ? rest : 1;
    return b;
  }

  function log(name, p, note) {
    if (!debug) return;
    try { console.log('[metrika] ' + name + ' ' + JSON.stringify(p) + (note ? ' (' + note + ')' : '')); } catch (e) { /* не важно */ }
  }

  // Аргументы — через JSON фрейма: tag.js получает объекты своего окна.
  function ym(args) { win.ym.apply(win, win.JSON.parse(JSON.stringify(args))); }

  function send(name, p) {
    try {
      if (navigator.onLine === false) return;
      var params = { platform: platform, build: build };
      var b = branch(p);
      if (b) params[name] = b;
      ym([COUNTER_ID, 'reachGoal', name, params]);
    } catch (e) { /* молча */ }
  }

  function goal(name, params) {
    try {
      if (typeof name !== 'string' || !name) return;
      var p = clean(params);
      if (!enabled) { log(name, p, 'не отправлено: ' + offWhy); return; }
      if (state === 'failed') { log(name, p, 'не отправлено: tag.js не загрузился'); return; }
      if (state === 'ready') { log(name, p); send(name, p); return; }
      if (queue.length >= QUEUE_MAX) { log(name, p, 'очередь полна'); return; }
      log(name, p, 'в очереди');
      queue.push([name, p]);
    } catch (e) { /* аналитика не ломает игру */ }
  }

  function fail(why) {
    state = 'failed';
    queue = [];
    log('—', {}, why);
  }

  function frameIsClean(w) {
    var d = w.document;
    return !!d && !!d.documentElement && d.documentElement.getAttribute(FRAME_MARK) === '1' &&
      !w.location.search && !w.location.hash && !d.referrer && typeof w.ym === 'function';
  }

  function onFrameLoad() {
    try {
      if (state !== 'loading' || win) return;
      var w = frame.contentWindow;
      if (!w || !frameIsClean(w)) { fail('фрейм Метрики не прошёл проверку'); return; }
      win = w;
      var d = w.document;
      var pageUrl = (location.origin || (location.protocol + '//' + location.host)) + location.pathname;
      var m = /^(https?:\/\/[^\/?#]+)/.exec(document.referrer || '');
      var referrer = m ? m[1] + '/' : '';
      ym([COUNTER_ID, 'init', {
        defer: true, url: pageUrl, referrer: referrer,
        clickmap: false, trackLinks: false, accurateTrackBounce: false, webvisor: false, trackHash: false
      }]);
      ym([COUNTER_ID, 'hit', pageUrl, { referer: referrer, title: String(document.title || ''), params: { platform: platform, build: build } }]);
      var s = d.createElement('script');
      s.async = true;
      s.src = TAG_URL;
      s.onload = function () {
        if (state !== 'loading') return;
        state = 'ready';
        var q = queue; queue = [];
        for (var i = 0; i < q.length; i++) send(q[i][0], q[i][1]);
      };
      s.onerror = function () { fail('tag.js не загрузился'); };
      (d.head || d.documentElement).appendChild(s);
    } catch (e) { fail('ошибка фрейма Метрики'); }
  }

  function mountFrame() {
    try {
      if (frame || state !== 'loading') return;
      clearTimeout(mountTimer);
      window.removeEventListener('load', mountFrame);
      var f = document.createElement('iframe');
      f.setAttribute('referrerpolicy', 'no-referrer');
      f.setAttribute('aria-hidden', 'true');
      f.setAttribute('tabindex', '-1');
      f.title = '';
      f.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;border:0;margin:0;padding:0;' +
        'visibility:hidden;pointer-events:none;z-index:-1;';
      f.onload = onFrameLoad;
      f.src = FRAME_SRC;
      frame = f;
      (document.body || document.documentElement).appendChild(f);
    } catch (e) { fail('фрейм Метрики не создан'); }
  }

  function sec() { return level ? Math.round((Date.now() - level.at) / 1000) : 0; }

  // Уход с незаконченного поля: 'back' — вышел в дом/письма или открыл другое поле,
  // 'hide' — свернул или закрыл игру (поле остаётся открытым: вернётся — дорешает).
  // Одна цель на вход в поле, поэтому отток по полю = level_start − level_win.
  function levelQuit(how) {
    try {
      if (level && !level.won && !level.quitSent) {
        level.quitSent = true;
        goal('level_quit', { level: level.id, sec: sec(), how: how || 'back' });
      }
      if (how !== 'hide') level = null;
    } catch (e) { /* молча */ }
  }

  // Журнал игры → цели. Имена событий журнала — из src/app.js и src/state.js.
  function onEvent(type, d) {
    d = d || {};
    switch (type) {
      case 'session_start':
        goal('game_loaded', { new_player: !!d.fresh, load_ms: (window.performance && performance.now) ? Math.round(performance.now()) : 0 });
        break;
      case 'puzzle_start':
        levelQuit('back');
        level = { id: String(d.puzzle_id), at: Date.now(), won: false, quitSent: false };
        goal('level_start', { level: level.id, resumed: !!d.resumed });
        break;
      case 'first_move':
        if (!firstMoveSent) { firstMoveSent = true; goal('first_move', { level: String(d.puzzle_id) }); }
        break;
      case 'puzzle_complete': {
        var same = !!level && level.id === String(d.puzzle_id);
        goal('level_win', { level: String(d.puzzle_id), sec: same ? sec() : 0 });
        if (same) level.won = true;
        if (d.object_done && d.object_id) goal('object_restored', { object: String(d.object_id) });
        break;
      }
      case 'tutorial_done': goal('tutorial_done'); break;
      case 'room_complete': goal('room_complete', { room: String(d.room_id) }); break;
      case 'daily_solved': goal('daily_letter_solved'); break;
      case 'event_complete': goal('lantern_event_done', { id: String(d.id) }); break;
      case 'buy_decor': goal('decor_buy', { kind: 'decor', coins: d.coins }); break;
      case 'buy_variant': goal('decor_buy', { kind: 'variant', coins: d.coins }); break;
      case 'order_applied': goal('purchase', { sku: String(d.sku) }); break;
      case 'ad_start': goal('rewarded_click', { kind: String(d.kind) }); break;
      case 'welcome_back': goal('welcome_back', { away: d.away }); break;
    }
  }

  try {
    if (window.HopState && HopState.addEventHook) HopState.addEventHook(onEvent);
    window.addEventListener('pagehide', function () { levelQuit('hide'); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') levelQuit('hide'); });
    if (enabled) {
      state = 'loading';
      if (document.readyState === 'complete') mountFrame();
      else {
        window.addEventListener('load', mountFrame);
        mountTimer = setTimeout(mountFrame, MOUNT_FALLBACK_MS);
      }
    } else log('—', {}, 'отправка выключена: ' + offWhy);
  } catch (e) { fail('ошибка старта'); }

  return { counter: COUNTER_ID, enabled: enabled, platform: platform, goal: goal, levelQuit: levelQuit };
})();
