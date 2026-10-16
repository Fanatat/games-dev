/* «Дом картинок», P1: прихожая → чайная, письмо дня, «7 встреч», лавка.
   Петля дня: зайти → письмо дня (штамп) → картинка предмета → предмет
   прилетает на место → монеты и карандаши → оформление.
   Интерфейс на значках: плашки монет и карандашей сверху, разделы Дом /
   Письма / Лавка снизу (после прихожей), цена — монета или голоса.

   Сохранение: черновик поля — после каждого жеста (запись в localStorage
   с задержкой ≤300 мс и сразу при уходе со страницы); победа — сразу и ДО
   анимации, повторная победа ничего не выдаёт (HopState.completePuzzle). */
(function () {
  'use strict';

  var C = window.HOP_CONTENT;
  var St = window.HopState;
  var N = window.Nonogram;
  var ART = 'assets/art/';
  var SAVE_DELAY = 300;

  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function icon(name) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'ico');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#i-' + name);
    s.appendChild(u);
    return s;
  }
  function pic(name, cls) {
    var i = h('img', cls || '');
    i.src = name.indexOf('/') === -1 ? ART + name + '.webp' : name;
    i.alt = '';
    i.draggable = false;
    return i;
  }
  function button(cls, label, ico, onClick) {
    var b = h('button', cls);
    b.type = 'button';
    if (ico) b.appendChild(icon(ico));
    if (label) b.appendChild(h('span', '', label));
    b.addEventListener('click', onClick);
    return b;
  }
  // Цена: монета + число или «N голосов».
  function priceTag(kind, n) {
    var t = h('span', 'price price-' + kind);
    if (kind === 'coins') { t.appendChild(pic('coin')); t.appendChild(h('b', '', String(n))); }
    else t.appendChild(h('b', '', n + ' ' + plural(n, 'голос', 'голоса', 'голосов')));
    return t;
  }
  function plural(n, one, few, many) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }

  /* ---------------- хранилище и сейв ---------------- */

  var storage = (function () {
    try {
      var k = '__hop_probe';
      localStorage.setItem(k, '1'); localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
  })();

  // Сдвиг дня для проверки на стенде: ?day=+N или кнопка «+1 день» (журнал).
  var DAY_KEY = 'hop.dev.day';
  (function () {
    var n = Platform.dayShift;
    try { if (!n && Platform.journal) n = +sessionStorage.getItem(DAY_KEY) || 0; } catch (e) { /* нет sessionStorage */ }
    if (n) St.setDayOffset(n);
  })();

  var loaded = St.load(storage, C);
  var S = loaded.state;
  var saveTimer = null;

  function saveNow() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    St.persist(storage, S);
    scheduleCloud();
  }
  function scheduleSave() {
    if (saveTimer) return;
    saveTimer = setTimeout(saveNow, SAVE_DELAY);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) saveNow();
    else {
      if (dayNow !== St.today()) onNewDay();
      syncPurchases();
    }
  });
  window.addEventListener('pagehide', saveNow);

  function log(type, data) { St.logEvent(S, type, data); scheduleSave(); }

  /* ---------------- облако (только ВК с адресом сервера) ----------------
     Сейв уходит на сервер через несколько секунд после изменения и сразу при
     сворачивании. Если другое устройство ушло дальше, его сейв принимается,
     когда игрок дома (не посреди картинки и не в открытой шторке). Купленное
     сверяется с журналом сервера: при запуске, после оплаты и при возврате
     в игру; выдача одна по ключу vk-<номер заказа>. */

  var CLOUD_DELAY = 8000; // сервер пускает игрока 30 раз в минуту
  var cloud = { rev: 0, ready: false, busy: false, dirty: false, timer: null, pending: null, syncing: false, tries: 0 };

  function scheduleCloud() {
    if (!HopCloud.enabled || !cloud.ready) return;
    cloud.dirty = true;
    if (document.hidden) { cloudPush(true); return; }
    if (!cloud.timer) cloud.timer = setTimeout(function () { cloud.timer = null; cloudPush(false); }, CLOUD_DELAY);
  }
  function cloudPush(keepalive) {
    if (!cloud.ready || cloud.busy || cloud.pending || !cloud.dirty) return;
    if (cloud.timer) { clearTimeout(cloud.timer); cloud.timer = null; }
    cloud.busy = true;
    cloud.dirty = false;
    HopCloud.push(St.cloudSave(S), cloud.rev, keepalive).then(function (r) {
      cloud.busy = false;
      if (!r) { cloud.dirty = true; return; } // нет сети — уйдёт со следующим сохранением
      cloud.rev = r.rev;
      if (r.ok) { if (cloud.dirty) scheduleCloud(); return; }
      if (St.preferRemote(S, r.save)) { cloud.pending = r.save; adoptPending(); return; }
      cloud.dirty = true;
      cloudPush(keepalive);
    });
  }
  function adoptPending() {
    if (!cloud.pending || screen === 'puzzle' || !$('sheet').hidden) return;
    var next = St.adoptRemote(C, S, cloud.pending);
    cloud.pending = null;
    if (next) {
      S = next;
      S.content_version = C.content_version;
      S.current_room = curRoom();
      St.registerVisit(S);
      St.logEvent(S, 'cloud_adopted', { completed: S.completed_puzzles.length });
      St.persist(storage, S);
      applySettings();
      rerender();
      toast('Прогресс загружен с другого устройства');
    }
    cloud.dirty = true;
    cloudPush(false);
    syncPurchases();
  }
  function cloudStart() {
    if (!HopCloud.enabled) return;
    HopCloud.load().then(function (r) {
      if (!r) {
        if (++cloud.tries < 4) setTimeout(cloudStart, 20000 * cloud.tries);
        return;
      }
      cloud.rev = r.rev;
      cloud.ready = true;
      if (St.preferRemote(S, r.save)) { cloud.pending = r.save; adoptPending(); }
      cloud.dirty = true;
      cloudPush(false);
      syncPurchases();
    });
  }
  function syncPurchases() {
    if (!HopCloud.enabled || cloud.syncing) return;
    cloud.syncing = true;
    HopCloud.purchases(S.pay_cursor || 0).then(function (rows) {
      cloud.syncing = false;
      if (!rows || !rows.length) return;
      var got = 0, ids = [];
      rows.forEach(function (p) {
        S.pay_cursor = Math.max(S.pay_cursor || 0, +p.id || 0);
        if (p.refund || !C.skus[p.item]) return;
        var r = St.applyOrder(C, S, 'vk-' + String(p.order).replace(/^t/, ''), p.item);
        if (r.ok) got++;
        ids.push(p.id);
      });
      if (got) St.logEvent(S, 'orders_synced', { count: got });
      saveNow();
      HopCloud.confirm(ids);
      if (!got) return;
      Sound.play('chord');
      rerender();
      bump($('hud-pencils'));
      toast(got > 1 ? 'Покупки получены' : 'Покупка получена');
    });
  }

  /* ---------------- настройки ---------------- */

  var rmQuery = Platform.reducedMotionQuery;
  function reducedMotion() { return !!S.settings.reduced_motion || !!(rmQuery && rmQuery.matches); }
  function applySettings() {
    Sound.setEnabled(S.settings.sound !== false);
    Sound.setVibration(S.settings.vibration !== false);
    document.documentElement.classList.toggle('rm', reducedMotion());
  }
  if (rmQuery && rmQuery.addEventListener) rmQuery.addEventListener('change', applySettings);

  var BUILD = (document.querySelector('meta[name="hop-build"]') || {}).content || 'dev';

  /* ---------------- что уже открыто игроку ---------------- */

  function hallDone() { return St.isRoomComplete(C, S, C.daily.after_room); }
  function showCurrencies() { return !!S.story_flags.tutorial_done || S.coins > 0 || S.pencils > 0; }
  function adsOpen() { return St.isRoomComplete(C, S, C.economy.rewarded.after_room); }
  function curRoom() {
    var rid = S.current_room;
    if (!C.rooms[rid] || !St.isRoomUnlocked(C, S, rid)) rid = St.roomOrder(C)[0];
    return rid;
  }

  /* ---------------- экраны, тост, шторка ---------------- */

  var screen = 'home';
  var SCREENS = ['home', 'letters', 'shop', 'puzzle'];
  function showScreen(name) {
    if (screen !== name) hideToast();
    screen = name;
    $('app').setAttribute('data-screen', name);
    $('shell').hidden = name === 'puzzle';
    SCREENS.forEach(function (s) { $('screen-' + s).hidden = s !== name; });
    var tabs = $('tabbar').querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-tab') === name;
      tabs[i].classList.toggle('is-on', on);
      if (on) tabs[i].setAttribute('aria-current', 'page'); else tabs[i].removeAttribute('aria-current');
    }
    if (name === 'letters') renderLetters();
    if (name === 'shop') renderShop();
    renderHud();
    if (name !== 'puzzle') adoptPending();
  }
  // Перерисовать открытый раздел дома (после покупки или смены сейва).
  function rerender() {
    renderHud();
    if (screen === 'home') renderHome();
    else if (screen === 'letters') renderLetters();
    else if (screen === 'shop') renderShop();
  }

  var toastTimer = null;
  function hideToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = null;
    $('toast').classList.remove('is-in');
    $('toast').hidden = true;
  }
  function toast(text, ms) {
    var t = $('toast');
    t.textContent = text;
    t.hidden = false;
    t.classList.remove('is-in');
    void t.offsetWidth;
    t.classList.add('is-in');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-in'); t.hidden = true; }, ms || 3200);
  }

  var sheetOnClose = null;
  function openSheet(node, onClose, cls) {
    closeSheet(true);
    var sh = $('sheet');
    sh.className = 'sheet' + (cls ? ' ' + cls : '');
    sh.innerHTML = '';
    sh.appendChild(node);
    sh.hidden = false;
    $('sheet-backdrop').hidden = false;
    sheetOnClose = onClose || null;
    var f = sh.querySelector('.btn-main, button');
    if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) { /* старые движки */ } }, 30);
  }
  function closeSheet(silent) {
    var sh = $('sheet');
    if (sh.hidden) return;
    sh.hidden = true;
    sh.innerHTML = '';
    $('sheet-backdrop').hidden = true;
    var cb = sheetOnClose;
    sheetOnClose = null;
    if (cb && !silent) cb();
  }
  $('sheet-backdrop').addEventListener('click', function () { Sound.play('back'); closeSheet(); });
  function sheetHead(title, art) {
    var head = h('div', 'sheet-head');
    if (art) head.appendChild(pic(art, 'sheet-art'));
    head.appendChild(h('h2', 'sheet-title', title));
    head.appendChild(button('tile tile-round tile-ghost', '', 'close', function () { Sound.play('back'); closeSheet(); }));
    head.lastChild.setAttribute('aria-label', 'Закрыть');
    return head;
  }

  /* ---------------- плашки валют и разделы ---------------- */

  // Ещё летит к плашкам (значки наград, закрытый сундучок): плашки показывают
  // число без этого, пока значок не долетит.
  var hudHold = { coins: 0, pencils: 0 };
  function holdHud(coins, pencils) {
    hudHold.coins = Math.max(0, hudHold.coins + coins);
    hudHold.pencils = Math.max(0, hudHold.pencils + pencils);
  }

  function renderHud() {
    var cur = showCurrencies();
    $('hud-coins').hidden = !cur;
    $('hud-pencils').hidden = !cur;
    $('hud-coins-n').textContent = String(Math.max(0, S.coins - hudHold.coins));
    $('hud-pencils-n').textContent = String(Math.max(0, S.pencils - hudHold.pencils));
    var tabsOn = hallDone();
    if ($('tabbar').hidden === tabsOn) {
      $('tabbar').hidden = !tabsOn;
      if (tabsOn && !S.story_flags.tabs_seen) { $('tabbar').classList.add('is-new'); St.setFlag(S, 'tabs_seen'); scheduleSave(); }
    }
    $('tab-letters-dot').hidden = !St.lettersBadge(C, S, St.today());
    $('pencil-n').textContent = String(S.pencils);
  }

  function bump(node) {
    if (!node) return;
    node.classList.remove('is-bump'); void node.offsetWidth; node.classList.add('is-bump');
  }

  $('hud-coins').addEventListener('click', function () { openShopFromHud(); });
  $('hud-pencils').addEventListener('click', function () { openShopFromHud(); });
  function openShopFromHud() {
    Sound.play('tap');
    if (!hallDone()) { toast('Лавка откроется, когда оживёт прихожая'); return; }
    showScreen('shop');
  }
  $('tabbar').addEventListener('click', function (e) {
    var t = e.target.closest('.tab');
    if (!t) return;
    var name = t.getAttribute('data-tab');
    $('tabbar').classList.remove('is-new');
    if (name === screen) return;
    Sound.play('tap');
    showScreen(name);
    if (name === 'home') renderHome();
    log('tab', { tab: name });
  });
  $('btn-settings').addEventListener('click', function () { Sound.play('tap'); openSettings(); });

  /* Награды: значок с «+N» взлетает над предметом и летит к своей плашке. */
  function playRewards(rewards, from) {
    var coins = 0, pencils = 0;
    rewards.forEach(function (r) { if (r.type === 'coins') coins += r.n; if (r.type === 'pencils') pencils += r.n; });
    // Одинаковые награды (монеты за картинку и за первую картинку дня) летят одним значком.
    var list = [];
    if (coins) list.push({ type: 'coins', n: coins });
    if (pencils) list.push({ type: 'pencils', n: pencils });
    rewards.forEach(function (r) { if (r.type === 'stamp') list.push(r); });
    if (!list.length) { renderHud(); return; }
    var rm = reducedMotion();
    list.forEach(function (r, i) {
      var target = r.type === 'coins' ? $('hud-coins') : r.type === 'pencils' ? $('hud-pencils') : $('tabbar').querySelector('[data-tab="letters"]');
      var held = !rm && target && target.offsetParent !== null && !!document.body.animate && r.type !== 'stamp';
      if (held) holdHud(r.type === 'coins' ? r.n : 0, r.type === 'pencils' ? r.n : 0);
      var land = function () {
        if (held) holdHud(r.type === 'coins' ? -r.n : 0, r.type === 'pencils' ? -r.n : 0);
        renderHud();
        bump(target);
        if (r.type !== 'stamp') Sound.play('tap');
      };
      if (rm || !target || target.offsetParent === null || !document.body.animate) { land(); return; }
      setTimeout(function () { flyBadge(r, from, target, land); }, i * 260);
    });
    renderHud();
  }

  function flyBadge(r, from, target, done) {
    var b = h('div', 'fx-pop fx-' + r.type);
    b.appendChild(pic(r.type === 'coins' ? 'coin' : r.type === 'pencils' ? 'pencil' : 'stamp'));
    b.appendChild(h('b', '', r.type === 'stamp' ? r.n + '/' + r.of : '+' + r.n));
    $('fx').appendChild(b);
    var fx = from ? from.left + from.width / 2 : innerWidth / 2;
    var fy = from ? from.top + from.height / 3 : innerHeight / 2;
    var t = target.getBoundingClientRect();
    var tx = t.left + t.width / 2, ty = t.top + t.height / 2;
    b.style.left = fx + 'px'; b.style.top = fy + 'px';
    var a = b.animate([
      { transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 },
      { transform: 'translate(-50%,-150%) scale(1.15)', opacity: 1, offset: 0.25 },
      { transform: 'translate(-50%,-150%) scale(1)', opacity: 1, offset: 0.5 },
      { transform: 'translate(calc(-50% + ' + (tx - fx) + 'px), calc(-50% + ' + (ty - fy) + 'px)) scale(.55)', opacity: 0.9 }
    ], { duration: 1100, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'forwards' });
    var fin = function () { b.remove(); done(); };
    a.onfinish = fin; a.oncancel = fin;
  }

  /* ---------------- дом ---------------- */

  function room() { return C.rooms[curRoom()]; }

  function objectThumb(oid) {
    var st = St.objectStage(C, S, oid);
    var w = h('span', 'thumb' + (st === 0 ? ' is-ghost' : ''));
    w.appendChild(pic(Scene.stageSprite(C, S, oid, st)));
    return w;
  }

  function stageDots(oid) {
    var o = C.objects[oid];
    var d = h('span', 'stage-dots');
    if (o.puzzles.length < 2) return d;
    var st = St.objectStage(C, S, oid);
    d.setAttribute('aria-label', st + ' из ' + o.puzzles.length);
    for (var i = 0; i < o.puzzles.length; i++) d.appendChild(h('i', i < st ? 'is-on' : ''));
    return d;
  }

  function puzzleSize(pid) {
    var p = C.puzzles[pid];
    return p.rows[0].length + '×' + p.rows.length;
  }

  function introFlag(rid) { return rid === 'r01' ? 'intro_seen' : 'intro_seen_' + rid; }

  function renderPanel() {
    var panel = $('home-panel');
    panel.innerHTML = '';
    var rid = curRoom(), R = C.rooms[rid];
    var f = S.story_flags;

    if (!f[introFlag(rid)]) {
      var card = h('div', 'card card-letter');
      card.appendChild(h('p', 'card-text', R.intro));
      card.appendChild(h('p', 'card-sign', '— ' + R.intro_sign));
      panel.appendChild(card);
      var first = St.playableObjects(C, S, rid)[0];
      if (first) {
        panel.appendChild(button('btn-main', C.objects[first].verb, 'play', function () {
          St.setFlag(S, introFlag(rid)); log('intro_done', { room_id: rid });
          startObject(first);
        }));
      }
      return;
    }

    if (St.isRoomComplete(C, S, rid)) { renderDonePanel(panel, rid); return; }

    var playable = St.playableObjects(C, S, rid).sort(function (a, b) {
      return (St.objectStatus(C, S, b) === 'in_progress') - (St.objectStatus(C, S, a) === 'in_progress');
    });
    if (!playable.length) {
      // Всё доступное в работе у других предметов — сюда попадать не должны, но без тупика.
      panel.appendChild(h('p', 'card card-text', 'Загляни в письма — там ждёт картинка.'));
      return;
    }
    if (playable.length === 1) {
      var oid = playable[0], o = C.objects[oid];
      var c1 = h('div', 'card card-goal');
      c1.appendChild(objectThumb(oid));
      var tx = h('div', 'card-body');
      tx.appendChild(h('b', 'card-title', o.title));
      tx.appendChild(h('span', 'card-sub', o.pitch));
      c1.appendChild(tx);
      var side = h('span', 'goal-side');
      side.appendChild(h('span', 'size-chip', puzzleSize(St.nextPuzzle(C, S, oid))));
      side.appendChild(stageDots(oid));
      c1.appendChild(side);
      panel.appendChild(c1);
      var cont = St.objectStatus(C, S, oid) === 'in_progress';
      panel.appendChild(button('btn-main', cont ? 'Продолжить' : o.verb, 'play', function () { startObject(oid); }));
      return;
    }
    panel.appendChild(h('h3', 'panel-title', 'Что вернём дальше?'));
    var grid = h('div', 'choice-grid' + (playable.length > 2 ? ' is-compact' : ''));
    grid.style.setProperty('--n', Math.min(playable.length, 4));
    playable.slice(0, 4).forEach(function (oid) {
      var o = C.objects[oid];
      var b = h('button', 'card card-choice');
      b.type = 'button';
      b.setAttribute('data-obj', oid);
      b.appendChild(objectThumb(oid));
      b.appendChild(h('b', 'card-title', o.title));
      b.appendChild(h('span', 'card-sub', o.pitch));
      var meta = h('span', 'choice-meta');
      meta.appendChild(h('span', 'size-chip', puzzleSize(St.nextPuzzle(C, S, oid))));
      if (C.objects[oid].puzzles.length > 1) meta.appendChild(stageDots(oid));
      else if (St.objectStatus(C, S, oid) === 'in_progress') meta.appendChild(h('span', 'wip-chip', 'начато'));
      b.appendChild(meta);
      b.addEventListener('click', function () { startObject(oid); });
      grid.appendChild(b);
    });
    panel.appendChild(grid);
  }

  // Готовая комната: письмо прихожей → дорога дальше → письмо дня.
  function renderDonePanel(panel, rid) {
    var R = C.rooms[rid], f = S.story_flags;
    if (rid === 'r01' && !f.letter_opened) {
      var done = h('div', 'card');
      done.appendChild(h('p', 'card-text', R.final_text));
      panel.appendChild(done);
      panel.appendChild(button('btn-main', 'Открыть письмо', 'letter', function () { openLetter(); }));
      return;
    }
    var next = R.next_room;
    var row = h('div', 'row-actions');
    if (next && C.rooms[next] && St.isRoomUnlocked(C, S, next) && !St.isRoomComplete(C, S, next)) {
      panel.appendChild(roomCard(next));
      row.appendChild(button('btn-main', R.invitation.button || C.rooms[next].title, 'chev', function () { goRoom(next); }));
    } else {
      panel.appendChild(dailyCard());
      var L = todayOpen();
      if (L) row.appendChild(button('btn-main', 'Письмо дня', 'letter', function () { Sound.play('tap'); showScreen('letters'); }));
      else row.appendChild(button('btn-main', 'До / после', 'compare', function () { openBeforeAfter(rid); }));
    }
    if (row.firstChild && row.firstChild.textContent !== 'До / после') {
      var ba = button('tile tile-round', '', 'compare', function () { openBeforeAfter(rid); });
      ba.setAttribute('aria-label', 'До и после');
      row.appendChild(ba);
    }
    if (rid === 'r01') {
      var again = button('tile tile-round', '', 'letter', function () { openLetter(true); });
      again.setAttribute('aria-label', 'Перечитать письмо');
      row.appendChild(again);
    }
    panel.appendChild(row);
  }

  function roomCard(rid) {
    var R = C.rooms[rid];
    var c = h('div', 'card card-goal card-room');
    var t = h('span', 'thumb thumb-room');
    t.appendChild(pic(R.background));
    c.appendChild(t);
    var body = h('div', 'card-body');
    body.appendChild(h('b', 'card-title', R.title));
    body.appendChild(h('span', 'card-sub', St.restoredCount(C, S, rid) + ' из ' + R.objects.length + ' вещей'));
    c.appendChild(body);
    return c;
  }

  function todayOpen() {
    var L = St.todayLetter(C, S, St.today());
    return L && L.status === 'today' ? L : null;
  }

  // Карточка «письмо дня + 7 встреч» для готовой комнаты.
  function dailyCard() {
    var c = h('div', 'card card-daily');
    var L = St.todayLetter(C, S, St.today());
    var env = h('span', 'daily-env' + (L && L.status === 'today' && !L.opened ? ' is-new' : ''));
    env.appendChild(pic(L && L.status === 'solved' ? 'stamp' : 'envelope'));
    c.appendChild(env);
    var body = h('div', 'card-body');
    if (L && L.status === 'today') body.appendChild(h('b', 'card-title', L.opened ? 'Письмо ждёт ответа' : 'Пришло письмо'));
    else if (L) body.appendChild(h('b', 'card-title', 'Новое письмо ' + untilTomorrow()));
    else body.appendChild(h('b', 'card-title', 'Новые письма скоро'));
    body.appendChild(stampsRow(true));
    c.appendChild(body);
    return c;
  }

  // Сколько осталось до московской полуночи.
  function untilTomorrow() {
    var msk = (Date.now() + St.getDayOffset() * 864e5 + 3 * 36e5) % 864e5;
    var hrs = Math.max(1, Math.ceil((864e5 - msk) / 36e5));
    return 'через ' + hrs + ' ч';
  }

  function stampsRow(compact) {
    var size = C.stamps.card_size;
    var row = h('span', 'stamps' + (compact ? ' is-compact' : ''));
    if (!St.stampsActive(C, S) && S.stamps.card >= C.stamps.rewards.length) {
      row.appendChild(pic('gift', 'stamps-gift is-done'));
      row.appendChild(h('span', 'stamps-done', 'Все подарки получены'));
      return row;
    }
    var n = S.stamps.days.length;
    row.setAttribute('aria-label', 'Штампы: ' + n + ' из ' + size);
    for (var i = 0; i < size; i++) {
      var s = h('i', 'stamp' + (i < n ? ' is-on' : ''));
      if (i < n) s.appendChild(pic('stamp'));
      row.appendChild(s);
    }
    row.appendChild(pic('gift', 'stamps-gift'));
    return row;
  }

  // Плашка комнаты считает картинки, а не вещи: каждое поле двигает полосу.
  function roomPictures(rid) {
    var n = 0, done = 0;
    C.rooms[rid].objects.forEach(function (oid) { n += C.objects[oid].puzzles.length; done += St.objectStage(C, S, oid); });
    return { done: done, n: n };
  }

  function renderPill() {
    var rid = curRoom(), R = C.rooms[rid], pc = roomPictures(rid);
    $('room-title').textContent = R.title;
    $('room-count').textContent = pc.done + '/' + pc.n;
    $('room-bar').style.width = Math.round(100 * pc.done / pc.n) + '%';
    $('room-pill').setAttribute('aria-label', 'Комнаты. ' + R.title + ': ' + pc.done + ' из ' + pc.n + ' картинок');
    $('room-pill').classList.toggle('has-more', St.openRooms(C, S).length > 1);
  }

  function renderHome(sceneOpts) {
    var so = sceneOpts || {};
    if (so.afford === undefined) {
      var af = St.affordableVariant(C, S, curRoom());
      so.afford = af ? af.object_id : null;
    }
    Scene.render($('scene'), C, S, curRoom(), so);
    renderPill();
    renderPanel();
    renderHud();
  }

  $('scene').addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t || $('scene').classList.contains('is-busy')) return;
    if (t.hasAttribute('data-letter')) { openLetter(); return; }
    var oid = t.getAttribute('data-obj');
    if (!oid) return;
    var st = St.objectStatus(C, S, oid);
    var rid = curRoom();
    if (st === 'available' || st === 'in_progress') {
      if (!S.story_flags[introFlag(rid)]) { St.setFlag(S, introFlag(rid)); log('intro_done', { room_id: rid }); }
      startObject(oid);
    } else if (st === 'restored' || st === 'choose_variant') {
      Sound.play('tap');
      var img = t.querySelector('img');
      if (img) { img.classList.remove('is-wiggle'); void img.offsetWidth; img.classList.add('is-wiggle'); }
      log('object_tap', { object_id: oid });
      if (C.objects[oid].life && C.objects[oid].life.kind === 'waltz') playWaltz(oid);
      openVariantSheet(oid, { secret: true });
    } else {
      Sound.play('back');
      toast(lockedHint(oid));
    }
  });

  function lockedHint(oid) {
    var o = C.objects[oid];
    if (o.unlock_after !== undefined) {
      var need = o.unlock_after - St.restoredCount(C, S, o.room);
      if (need > 0) return o.title + ': верни ещё ' + need + ' ' + plural(need, 'вещь', 'вещи', 'вещей');
    }
    var miss = (o.prerequisites || []).filter(function (p) { return !St.isObjectRestored(C, S, p); })
      .map(function (p) { return C.objects[p].title.toLowerCase(); });
    return miss.length ? o.title + ': сначала ' + miss.join(' и ') : o.title + ' пока спит';
  }

  /* ---------------- комнаты ---------------- */

  $('room-pill').addEventListener('click', function () { Sound.play('tap'); openRooms(); });

  function openRooms() {
    var node = h('div', 'rooms-sheet');
    node.appendChild(sheetHead('Комнаты'));
    var list = h('div', 'room-list');
    St.roomOrder(C).forEach(function (rid) {
      var R = C.rooms[rid];
      var open = St.isRoomUnlocked(C, S, rid);
      var b = h('button', 'room-card' + (open ? '' : ' is-locked') + (rid === curRoom() ? ' is-here' : ''));
      b.type = 'button';
      b.setAttribute('data-room', rid);
      var t = h('span', 'room-thumb');
      t.appendChild(pic(R.background));
      if (!open) t.appendChild(icon('lock'));
      b.appendChild(t);
      var body = h('span', 'card-body');
      body.appendChild(h('b', 'card-title', R.title));
      var n = St.restoredCount(C, S, rid);
      body.appendChild(h('span', 'card-sub', open ? n + ' из ' + R.objects.length + (St.isRoomComplete(C, S, rid) ? ' ✓' : '')
        : 'Откроется после: ' + C.rooms[R.requires].title));
      var bar = h('span', 'bar');
      var fill = h('i');
      fill.style.width = Math.round(100 * n / R.objects.length) + '%';
      bar.appendChild(fill);
      body.appendChild(bar);
      b.appendChild(body);
      b.addEventListener('click', function () {
        if (!open) { Sound.play('back'); toast('Сначала верни все вещи: ' + C.rooms[R.requires].title); return; }
        closeSheet(true);
        goRoom(rid);
      });
      list.appendChild(b);
    });
    // Следующая комната за последней — честное «скоро».
    var soon = h('div', 'room-card is-locked is-soon');
    var st = h('span', 'room-thumb');
    st.appendChild(icon('lock'));
    soon.appendChild(st);
    var sb = h('span', 'card-body');
    sb.appendChild(h('b', 'card-title', C.soon_room || 'Новая комната'));
    sb.appendChild(h('span', 'card-sub', 'Скоро'));
    soon.appendChild(sb);
    list.appendChild(soon);
    node.appendChild(list);
    openSheet(node, null, 'sheet-rooms');
  }

  function goRoom(rid) {
    Sound.play('tap');
    var changed = St.setRoom(C, S, rid);
    if (changed) log('room_enter', { room_id: rid });
    saveNow();
    if (screen !== 'home') showScreen('home');
    renderHome();
    if (changed) {
      var sc = $('scene');
      sc.classList.remove('is-entering'); void sc.offsetWidth; sc.classList.add('is-entering');
    }
  }

  /* ---------------- поле ---------------- */

  var cur = null; // { pid, oid | null, letter | null, tutorial }

  function solutionOf(pid) {
    return C.puzzles[pid].rows.map(function (r) { return r.split('').map(function (ch) { return ch === '#' ? 1 : 0; }); });
  }

  function startObject(oid) {
    if (!St.canStartObject(C, S, oid)) {
      toast('Сначала закончи начатые вещи');
      return;
    }
    var pid = St.nextPuzzle(C, S, oid);
    if (!pid) return;
    var o = C.objects[oid];
    var n = o.puzzles.length, st = St.objectStage(C, S, oid);
    startPuzzle(pid, { oid: oid, title: o.title + (n > 1 ? ' · ' + (st + 1) + '/' + n : ''), preview: Scene.stageSprite(C, S, oid, st), ghost: st === 0 });
  }

  function startLetter(id) {
    var L = letterById(id);
    startPuzzle(id, { letter: id, title: L.title, preview: ART + 'envelope.webp', ghost: false });
  }

  function startPuzzle(pid, ctx) {
    Sound.play('tap');
    pickCancel();
    cur = { pid: pid, oid: ctx.oid || null, letter: ctx.letter || null, tutorial: pid === 'r01_lamp_01' && !S.story_flags.tutorial_done, step: 0, firstMove: false };
    showScreen('puzzle');
    $('puzzle-title').textContent = ctx.title;
    $('puzzle-size').textContent = puzzleSize(pid);
    var prev = $('puzzle-preview');
    prev.innerHTML = '';
    var t = h('span', 'thumb' + (ctx.ghost ? ' is-ghost' : ''));
    t.appendChild(pic(ctx.preview));
    prev.appendChild(t);
    $('reveal').hidden = true;
    $('reveal').innerHTML = '';
    setToolbarEnabled(true);

    var sol = solutionOf(pid);
    N.render({ width: sol[0].length, height: sol.length, solution: sol }, $('puzzle-container'), onWin, onMove, onLine);
    markFiveLines(sol[0].length, sol.length);
    var d = S.drafts[pid];
    if (d) N.restoreBoard(St.decodeBoard(d.board, sol[0].length, sol.length));
    setMode(1);
    updateUndo();
    $('btn-pencil').hidden = cur.tutorial || !S.story_flags.tutorial_done;
    renderHud();
    renderHintCount();
    renderFieldCoins();
    log('puzzle_start', { puzzle_id: pid, object_id: cur.oid, resumed: !!d });
    coachStart();
    if (!cur.tutorial && !$('btn-pencil').hidden && !S.story_flags.pencil_tip) {
      St.setFlag(S, 'pencil_tip');
      setTimeout(function () {
        if (!cur) return;
        toast('Карандаш открывает целую строку или столбец', 3800);
        bump($('btn-pencil'));
      }, 700);
    }
  }

  // Толстая линия через каждые пять клеток (ТЗ 01 §12).
  function markFiveLines(W, H) {
    var cells = $('puzzle-container').querySelectorAll('.grid-cell');
    for (var i = 0; i < cells.length; i++) {
      var r = +cells[i].dataset.r, c = +cells[i].dataset.c;
      if (c % 5 === 4 && c !== W - 1) cells[i].classList.add('b5r');
      if (r % 5 === 4 && r !== H - 1) cells[i].classList.add('b5b');
    }
  }

  var mode = 1;
  function setMode(m) {
    mode = m;
    N.setMode(m);
    $('mode-fill').classList.toggle('is-on', m === 1);
    $('mode-cross').classList.toggle('is-on', m === 2);
    $('mode-fill').setAttribute('aria-checked', String(m === 1));
    $('mode-cross').setAttribute('aria-checked', String(m === 2));
    coachCheck();
  }
  $('mode-fill').addEventListener('click', function () { pickCancel(); if (mode !== 1) Sound.play('toggle'); setMode(1); });
  $('mode-cross').addEventListener('click', function () { pickCancel(); if (mode !== 2) Sound.play('toggle'); setMode(2); });
  $('btn-undo').addEventListener('click', function () { pickCancel(); N.undo(); });
  $('btn-hint').addEventListener('click', function () { pickCancel(); doHint(); });
  $('btn-home').addEventListener('click', goHomeFromPuzzle);
  $('btn-pencil').addEventListener('click', pencilTap);

  function setToolbarEnabled(on) {
    ['mode-fill', 'mode-cross', 'btn-hint', 'btn-pencil'].forEach(function (id) { $(id).disabled = !on; });
    if (!on) $('btn-undo').disabled = true;
  }
  function updateUndo() { $('btn-undo').disabled = !N.canUndo(); }

  function onMove(kind) {
    if (!cur) return;
    if (kind === 'fill') { Sound.play('fill'); Sound.buzz(8); }
    else if (kind === 'cross') Sound.play('cross');
    else if (kind === 'erase') Sound.play('erase');
    else if (kind === 'undo') Sound.play('back');
    else if (kind === 'pencil') Sound.play('hint');
    if (!cur.firstMove && (kind === 'fill' || kind === 'cross')) {
      cur.firstMove = true;
      log('first_move', { puzzle_id: cur.pid });
    }
    if (!N.isWon()) {
      var board = N.getBoardState();
      if (kind === 'fill' || kind === 'pencil') foundCoins(board);
      St.saveDraft(S, cur.pid, board);
      scheduleSave();
    }
    updateUndo();
    coachCheck();
  }

  // Монетка в клетке: верно закрашенная клетка с монеткой отдаёт её сразу.
  function foundCoins(board) {
    var got = St.collectFieldCoins(C, S, cur.pid, board);
    got.forEach(function (f) {
      var cell = $('puzzle-container').querySelector('.grid-cell[data-r="' + f.r + '"][data-c="' + f.c + '"]');
      if (cell) {
        var spark = h('i', 'cell-coin');
        spark.appendChild(pic('coin'));
        cell.appendChild(spark);
        setTimeout(function () { spark.remove(); }, 1200);
      }
      Sound.play('coin');
      playRewards([{ type: 'coins', n: f.n }], cell ? cell.getBoundingClientRect() : null);
      log('field_coin', { puzzle_id: cur.pid });
    });
    if (got.length) renderFieldCoins();
  }

  function renderFieldCoins() {
    var box = $('puzzle-coins');
    var all = cur ? St.fieldCoins(C, cur.pid) : [];
    box.hidden = !all.length;
    if (!all.length) return;
    var found = all.filter(function (x, i) { return S.granted.indexOf('f:' + cur.pid + ':' + i) !== -1; }).length;
    $('puzzle-coins-n').textContent = found + '/' + all.length;
    box.setAttribute('aria-label', 'Монетки на поле: найдено ' + found + ' из ' + all.length);
    box.classList.toggle('is-all', found === all.length);
  }

  function onLine() { Sound.line(); }

  function goHomeFromPuzzle() {
    if (!cur) return;
    Sound.play('back');
    pickCancel();
    if (!N.isWon()) { St.saveDraft(S, cur.pid, N.getBoardState()); }
    saveNow();
    coachHide();
    var wasLetter = !!cur.letter;
    cur = null;
    showScreen(wasLetter ? 'letters' : 'home');
    if (!wasLetter) renderHome();
  }

  document.addEventListener('keydown', function (e) {
    if (!$('sheet').hidden) {
      if (e.key === 'Escape') { Sound.play('back'); closeSheet(); }
      return;
    }
    if (screen !== 'puzzle' || !cur) return;
    var k = e.key.toLowerCase();
    if (pick && k === 'escape') { pickCancel(); return; }
    if (pick && k === 'enter') { pickConfirm(); return; }
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); pickCancel(); N.undo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === 'x' || k === 'ч') { pickCancel(); setMode(mode === 1 ? 2 : 1); }
    else if (k === 'z' || k === 'я') { pickCancel(); N.undo(); }
    else if (k === 'h' || k === 'р') { pickCancel(); doHint(); }
    else if ((k === 'p' || k === 'з') && !$('btn-pencil').hidden) pencilTap();
    else if (k === 'escape') goHomeFromPuzzle();
  });

  /* ---------------- карандаш: открыть строку или столбец ---------------- */

  var pick = null; // { kind, idx, r, c } | {} — режим выбора линии

  function pencilTap() {
    if (!cur || N.isWon()) return;
    if (pick) { pickCancel(); return; }
    Sound.play('tap');
    if (S.pencils <= 0) { openPencilOffer(); return; }
    pick = {};
    N.setPaused(true);
    $('puzzle-container').classList.add('is-picking');
    $('btn-pencil').classList.add('is-on');
    $('toolbar').hidden = true;
    $('pick-bar').hidden = false;
    $('pick-ok').disabled = true;
    $('pick-text').textContent = 'Выбери строку или столбец';
  }

  function pickSelect(kind, idx) {
    if (!pick) return;
    clearPickMarks();
    pick.kind = kind; pick.idx = idx;
    var box = $('puzzle-container');
    var clue = box.querySelector(kind === 'row' ? '.row-clue[data-row="' + idx + '"]' : '.col-clue[data-col="' + idx + '"]');
    if (clue) clue.classList.add('is-pick');
    var cells = box.querySelectorAll(kind === 'row' ? '.grid-cell[data-r="' + idx + '"]' : '.grid-cell[data-c="' + idx + '"]');
    for (var i = 0; i < cells.length; i++) cells[i].classList.add('is-pick');
    $('pick-text').textContent = (kind === 'row' ? 'Строка ' : 'Столбец ') + (idx + 1);
    $('pick-ok').disabled = false;
    Sound.play('toggle');
  }

  function clearPickMarks() {
    var old = $('puzzle-container').querySelectorAll('.is-pick');
    for (var i = 0; i < old.length; i++) old[i].classList.remove('is-pick');
  }

  function pickCancel() {
    if (!pick) return;
    pick = null;
    clearPickMarks();
    N.setPaused(false);
    $('puzzle-container').classList.remove('is-picking');
    $('btn-pencil').classList.remove('is-on');
    $('toolbar').hidden = false;
    $('pick-bar').hidden = true;
  }

  function pickConfirm() {
    if (!pick || pick.kind === undefined || !cur) return;
    var kind = pick.kind, idx = pick.idx;
    if (N.lineClosed(kind, idx)) { toast('Эта линия уже готова — выбери другую'); return; }
    if (!St.usePencil(S, cur.pid, kind + ':' + idx)) { pickCancel(); openPencilOffer(); return; }
    saveNow();
    pickCancel();
    renderHud();
    flashLine(kind, idx);
    N.revealLine(kind, idx);
  }

  $('pick-cancel').addEventListener('click', function () { Sound.play('back'); pickCancel(); });
  $('pick-ok').addEventListener('click', pickConfirm);
  // Во время выбора поле не принимает ходов (N.setPaused); касание числа или
  // клетки выбирает линию, повторное касание той же клетки — её столбец.
  $('puzzle-container').addEventListener('click', function (e) {
    if (!pick) return;
    var rc = e.target.closest('.row-clue'), cc = e.target.closest('.col-clue'), cell = e.target.closest('.grid-cell');
    if (rc) pickSelect('row', +rc.dataset.row);
    else if (cc) pickSelect('col', +cc.dataset.col);
    else if (cell) {
      var r = +cell.dataset.r, c = +cell.dataset.c;
      if (pick.r === r && pick.c === c) pickSelect(pick.kind === 'row' ? 'col' : 'row', pick.kind === 'row' ? c : r);
      else pickSelect('row', r);
      pick.r = r; pick.c = c;
    }
  });

  function openPencilOffer() {
    var node = h('div', 'offer-sheet');
    node.appendChild(sheetHead('Карандаши закончились', 'pencil'));
    node.appendChild(h('p', 'secret', 'Карандаш открывает целую строку или столбец.'));
    node.appendChild(pencilOffers(function () { closeSheet(true); renderHud(); }));
    openSheet(node, null, 'sheet-offer');
  }

  /* ---------------- обучение действием (лампа) ---------------- */

  // Лампа: ряды 2 и 3 по 5 клеток, столбец 3 — 5 клеток, ряд 4 — одна клетка.
  var COACH = [
    { text: 'Закрась ряд', line: ['row', 1], done: function (b) { return lineFilled(b, 'row', 1); } },
    { text: 'И этот тоже', line: ['row', 2], done: function (b) { return lineFilled(b, 'row', 2); } },
    { text: 'Теперь столбец', line: ['col', 2], done: function (b) { return lineFilled(b, 'col', 2); } },
    { text: 'Пустое — крестиком', target: 'mode-cross', done: function () { return mode === 2; } },
    { text: 'Тут одна клетка. Остальные — ×', line: ['row', 3], done: function (b) { return countIn(b, 'row', 3, 2) >= 2; } },
    { text: 'Назад к кисти', target: 'mode-fill', done: function () { return mode === 1; } },
    { text: 'Дорисуй лампу!', done: function () { return false; }, last: true }
  ];

  function lineCells(b, kind, i) {
    return kind === 'row' ? b[i] : b.map(function (r) { return r[i]; });
  }
  function lineFilled(b, kind, i) {
    var sol = solutionOf(cur.pid);
    var want = lineCells(sol, kind, i), got = lineCells(b, kind, i);
    return want.every(function (v, k) { return !v || got[k] === 1; });
  }
  function countIn(b, kind, i, val) {
    return lineCells(b, kind, i).filter(function (v) { return v === val; }).length;
  }

  function coachStart() {
    coachHide();
    if (!cur || !cur.tutorial) return;
    cur.step = 0;
    log('tutorial_start');
    coachCheck();
  }

  function coachCheck() {
    if (!cur || !cur.tutorial || N.isWon()) return;
    var b = N.getBoardState();
    while (cur.step < COACH.length && COACH[cur.step].done(b)) cur.step++;
    if (cur.step >= COACH.length) { coachHide(); return; }
    coachShow(COACH[cur.step]);
  }

  function coachHide() {
    $('coach').hidden = true;
    var old = document.querySelectorAll('.is-coach');
    for (var i = 0; i < old.length; i++) old[i].classList.remove('is-coach');
  }

  function coachShow(step) {
    coachHide();
    $('coach-text').textContent = step.text;
    $('coach').hidden = false;
    $('coach').classList.toggle('is-down', !!step.target);
    var box = $('puzzle-container');
    if (step.line) {
      var kind = step.line[0], idx = step.line[1];
      var clue = box.querySelector(kind === 'row' ? '.row-clue[data-row="' + idx + '"]' : '.col-clue[data-col="' + idx + '"]');
      if (clue) clue.classList.add('is-coach');
      var sel = kind === 'row' ? '.grid-cell[data-r="' + idx + '"]' : '.grid-cell[data-c="' + idx + '"]';
      var cells = box.querySelectorAll(sel);
      for (var i = 0; i < cells.length; i++) cells[i].classList.add('is-coach');
    }
    if (step.target) $(step.target).classList.add('is-coach');
  }

  /* ---------------- подсказка: бесплатное объяснение ---------------- */

  function doHint() {
    if (!cur || N.isWon()) return;
    Sound.play('hint');
    var errs = N.findErrors();
    if (errs.length) {
      N.applyHint({ r: errs[0].r, c: errs[0].c, action: 'clear' });
      // автокрестики, выведенные из этой ошибки, тоже неверны — убираем разом
      if (N.hasWrongCrosses()) N.revealErrors();
      toast('Эта клетка лишняя — поставила крестик');
      log('hint', { puzzle_id: cur.pid, kind: 'wrong_fill' });
      return;
    }
    if (N.hasWrongCrosses()) {
      N.revealErrors();
      toast('Крестик стоял на картинке — убрала его');
      log('hint', { puzzle_id: cur.pid, kind: 'wrong_cross' });
      return;
    }
    // Ошибки лампа исправляет всегда; новые клетки — три раза на поле, дальше карандаш.
    if (St.freeHintsLeft(C, S, cur.pid) <= 0) {
      Sound.play('back');
      shake($('btn-hint'));
      if (!$('btn-pencil').hidden) { bump($('btn-pencil')); flash($('btn-pencil'), 'is-call'); }
      log('hint_out', { puzzle_id: cur.pid });
      return;
    }
    var d = lineDeduction();
    if (d) {
      flashLine(d.kind, d.idx);
      N.applyHint({ r: d.r, c: d.c, action: 'fill' });
      toast((d.kind === 'row' ? 'Строка ' : 'Столбец ') + (d.idx + 1) + ': эта клетка закрашена при любом раскладе');
      St.useFreeHint(C, S, cur.pid);
      log('hint', { puzzle_id: cur.pid, kind: 'line', line: d.kind + d.idx });
      renderHintCount();
      return;
    }
    var any = N.findHint();
    if (any) {
      N.applyHint(any);
      toast('Вот одна верная клетка');
      St.useFreeHint(C, S, cur.pid);
      log('hint', { puzzle_id: cur.pid, kind: 'cell' });
      renderHintCount();
    }
  }

  function renderHintCount() {
    var n = cur ? St.freeHintsLeft(C, S, cur.pid) : Infinity;
    var b = $('hint-n');
    b.hidden = n === Infinity;
    b.textContent = n === Infinity ? '' : String(n);
    $('btn-hint').classList.toggle('is-out', n === 0);
    $('btn-hint').setAttribute('aria-label', n === Infinity ? 'Подсказка' : 'Подсказка, осталось ' + n);
  }

  function shake(node) {
    if (!node) return;
    node.classList.remove('is-shake'); void node.offsetWidth; node.classList.add('is-shake');
  }
  function flash(node, cls) {
    if (!node) return;
    node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls);
    setTimeout(function () { node.classList.remove(cls); }, 1600);
  }

  // Ищет линию, где по числам и уже поставленным отметкам клетка точно закрашена.
  function lineDeduction() {
    var b = N.getBoardState();
    var sol = solutionOf(cur.pid);
    var cl = N.calcClues(sol);
    var H = sol.length, W = sol[0].length;
    function known(line) { return line.map(function (v) { return v === 1 ? 1 : v === 2 ? 0 : -1; }); }
    var best = null;
    function consider(kind, idx, line, clue) {
      var k = known(line);
      var res = NonogramLogic.solveLine(k, clue);
      if (!res) return;
      var fresh = [];
      for (var i = 0; i < k.length; i++) if (k[i] === -1 && res[i] === 1) fresh.push(i);
      if (fresh.length && (!best || fresh.length > best.n)) {
        var i0 = fresh[0];
        best = { kind: kind, idx: idx, n: fresh.length, r: kind === 'row' ? idx : i0, c: kind === 'row' ? i0 : idx };
      }
    }
    for (var r = 0; r < H; r++) consider('row', r, b[r], cl.rows[r]);
    for (var c = 0; c < W; c++) consider('col', c, b.map(function (row) { return row[c]; }), cl.cols[c]);
    return best;
  }

  function flashLine(kind, idx) {
    var box = $('puzzle-container');
    var clue = box.querySelector(kind === 'row' ? '.row-clue[data-row="' + idx + '"]' : '.col-clue[data-col="' + idx + '"]');
    if (!clue) return;
    clue.classList.remove('is-hinted'); void clue.offsetWidth; clue.classList.add('is-hinted');
    setTimeout(function () { clue.classList.remove('is-hinted'); }, 1600);
  }

  /* ---------------- победа и раскрытие ---------------- */

  function onWin() {
    if (!cur) return;
    pickCancel();
    var pid = cur.pid;
    var res = St.completePuzzle(C, S, pid);
    if (res.duplicate) res = { object_done: false, room_done: false, stage: cur.oid ? St.objectStage(C, S, cur.oid) : 0, rewards: [] };
    if (cur.tutorial) { St.setFlag(S, 'tutorial_done'); log('tutorial_done'); }
    saveNow(); // награда записана до любой анимации
    coachHide();
    setToolbarEnabled(false);
    Sound.play('win');
    var rm = reducedMotion();
    var ctx = { pid: pid, oid: cur.oid, letter: cur.letter, res: res };
    setTimeout(function () { showReveal(ctx); }, rm ? 120 : 620);
  }

  // Картинка из клеток: тёмная для предметов, цветная для писем.
  function pixelCanvas(pid, color) {
    var p = C.puzzles[pid];
    var H = p.rows.length, W = p.rows[0].length, k = 24;
    var cv = document.createElement('canvas');
    cv.width = W * k; cv.height = H * k;
    var g = cv.getContext('2d');
    for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) {
      var ch = color && p.pic ? p.pic[r][c] : p.rows[r][c];
      if (ch === '.') continue;
      g.fillStyle = color && p.palette ? p.palette[ch] : '#3b2c22';
      g.fillRect(c * k, r * k, k, k);
    }
    cv.className = 'reveal-pixels';
    return cv;
  }

  var revealState = null;
  function showReveal(ctx) {
    var box = $('reveal');
    box.innerHTML = '';
    var stage = h('div', 'reveal-stage');
    stage.appendChild(pixelCanvas(ctx.pid));
    var title;
    if (ctx.letter) {
      var col = pixelCanvas(ctx.pid, true);
      col.className = 'reveal-sprite reveal-color';
      stage.appendChild(col);
      title = C.puzzles[ctx.pid].title + '!';
    } else {
      var o = C.objects[ctx.oid], n = o.puzzles.length;
      var img = h('img', 'reveal-sprite');
      img.src = Scene.stageSprite(C, S, ctx.oid, ctx.res.stage);
      img.alt = o.title;
      stage.appendChild(img);
      title = n > 1 && !ctx.res.object_done ? o.title + ' · ' + ctx.res.stage + ' из ' + n : o.title + '!';
    }
    box.appendChild(stage);
    box.appendChild(h('div', 'reveal-title', title));
    box.hidden = false;
    var rm = reducedMotion();
    revealState = ctx;
    ctx.done = false;
    requestAnimationFrame(function () { box.classList.add('is-on'); });
    setTimeout(function () { box.classList.add('to-sprite'); }, rm ? 0 : 380);
    ctx.timer = setTimeout(finishReveal, rm ? 700 : 1500);
  }
  $('reveal').addEventListener('click', function () { finishReveal(); });

  function finishReveal() {
    var rs = revealState;
    if (!rs || rs.done) return;
    rs.done = true;
    clearTimeout(rs.timer);
    var src = $('reveal').querySelector('.reveal-sprite');
    var from = src ? src.getBoundingClientRect() : null;
    $('reveal').classList.remove('is-on', 'to-sprite');
    $('reveal').hidden = true;
    cur = null;
    if (rs.letter) { letterSolved(rs, from); return; }
    if (curRoom() !== C.objects[rs.oid].room) St.setRoom(C, S, C.objects[rs.oid].room);
    showScreen('home');
    // Сначала комната «до» этой картинки, затем полёт и появление.
    renderHome({ hide: rs.oid });
    $('scene').classList.add('is-busy');
    var to = Scene.objectRect($('scene'), rs.oid);
    var rm = reducedMotion();
    var land = function () { arrive(rs); };
    if (rm || !from || !to || !document.body.animate) { land(); return; }
    var fly = h('img', 'fly');
    fly.src = src.src;
    fly.style.left = from.left + 'px';
    fly.style.top = from.top + 'px';
    fly.style.width = from.width + 'px';
    fly.style.height = from.height + 'px';
    document.body.appendChild(fly);
    var sx = to.width / from.width, sy = to.height / from.height;
    var dx = to.left - from.left, dy = to.top - from.top;
    var anim = fly.animate([
      { transform: 'translate(0,0) scale(1)', offset: 0 },
      { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 40) + 'px) scale(' + (1 + sx) / 2 + ',' + (1 + sy) / 2 + ')', offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')', offset: 1 }
    ], { duration: 720, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
    fly.style.transformOrigin = '0 0';
    anim.onfinish = function () { fly.remove(); land(); };
    anim.oncancel = function () { fly.remove(); land(); };
  }

  function arrive(rs) {
    var o = C.objects[rs.oid], res = rs.res, chest = res.chest;
    var fresh = res.object_done ? rs.oid : null;
    renderHome({ fresh: fresh || rs.oid, noGlow: chest && chest.kind === 'rare' ? rs.oid : null });
    Sound.play('reward');
    Sound.buzz(20);
    // Содержимое сундучка придержано на плашках, пока он не откроется.
    if (chest && !reducedMotion()) holdHud(chest.coins, chest.pencils);
    playRewards(res.rewards, Scene.objectRect($('scene'), rs.oid));
    var gift = res.rewards.filter(function (r) { return r.type === 'gift'; })[0];
    if (!res.object_done) {
      var left = o.puzzles.length - res.stage;
      toast(o.title + ': ещё ' + left + ' ' + plural(left, 'картинка', 'картинки', 'картинок'), 3600);
      $('scene').classList.remove('is-busy');
      if (gift) setTimeout(function () { showGift(gift); }, 1600);
      return;
    }
    toast(o.done_text, 4200);
    var newly = St.playableObjects(C, S, o.room).filter(function (oid) { return St.objectStatus(C, S, oid) === 'available'; });
    if (newly.length && !res.room_done) setTimeout(function () { Sound.play('unlock'); }, 600);
    var sheet = function () {
      $('scene').classList.remove('is-busy');
      openVariantSheet(rs.oid, {
        afterReveal: true,
        story: o.done_text,
        onDone: function () {
          if (res.room_done) roomFinale(res.room_id, gift);
          else if (gift) showGift(gift);
        }
      });
    };
    var waltz = o.life && o.life.kind === 'waltz';
    setTimeout(function () { playChest(rs.oid, chest, waltz ? function () { playWaltz(rs.oid); setTimeout(sheet, reducedMotion() ? 300 : 2200); } : sheet); }, reducedMotion() ? 200 : 900);
  }

  // Шкатулка играет вальс: ноты чаще, шкатулка покачивается в такт.
  function playWaltz(oid) {
    var ms = Sound.waltz() || 3000;
    var w = $('scene').querySelector('.obj[data-obj="' + oid + '"]');
    if (w) w.classList.add('is-playing');
    setTimeout(function () {
      var x = $('scene').querySelector('.obj[data-obj="' + oid + '"]');
      if (x) x.classList.remove('is-playing');
    }, ms);
    log('waltz', { object_id: oid });
  }

  // Сундучок над готовым предметом: появляется, вздрагивает, раскрывается,
  // и содержимое летит на плашки. Редкое — золотой сундучок и «Сияние».
  function playChest(oid, chest, done) {
    if (!chest) { done(); return; }
    var rare = chest.kind === 'rare', rm = reducedMotion();
    var rect = Scene.objectRect($('scene'), oid) || $('scene').getBoundingClientRect();
    var finished = false;
    var open = function () {
      if (finished) return;
      finished = true;
      var list = [];
      if (chest.coins) list.push({ type: 'coins', n: chest.coins });
      if (chest.pencils) list.push({ type: 'pencils', n: chest.pencils });
      if (!rm) holdHud(-chest.coins, -chest.pencils);
      Sound.play(rare ? 'chord' : 'reward');
      if (rare) {
        renderHome({ fresh: oid });
        hideToast();
        toast('Сияние! ' + C.objects[oid].title, 2600);
      }
      playRewards(list, rect);
      setTimeout(done, rm ? 300 : rare ? 1500 : 1000);
    };
    log('chest_show', { object_id: oid, kind: chest.kind });
    if (rm || !document.body.animate) { open(); return; }
    var box = h('div', 'fx-chest' + (rare ? ' is-rare' : ''));
    box.appendChild(pic(rare ? 'chest_b' : 'chest_a'));
    box.style.left = (rect.left + rect.width / 2) + 'px';
    box.style.top = (rect.top + rect.height / 2) + 'px';
    $('fx').appendChild(box);
    Sound.play('unlock');
    var a = box.animate([
      { transform: 'translate(-50%,-30%) scale(.3)', opacity: 0, offset: 0 },
      { transform: 'translate(-50%,-90%) scale(1.1)', opacity: 1, offset: 0.25 },
      { transform: 'translate(-50%,-90%) scale(1) rotate(-8deg)', opacity: 1, offset: 0.42 },
      { transform: 'translate(-50%,-90%) scale(1) rotate(8deg)', opacity: 1, offset: 0.56 },
      { transform: 'translate(-50%,-90%) scale(1) rotate(-6deg)', opacity: 1, offset: 0.68 },
      { transform: 'translate(-50%,-90%) scale(1.05) rotate(0)', opacity: 1, offset: 0.8 },
      { transform: 'translate(-50%,-90%) scale(1.6)', opacity: 0, offset: 1 }
    ], { duration: 1300, easing: 'ease-out', fill: 'forwards' });
    var fin = function () { box.remove(); open(); };
    a.onfinish = fin; a.oncancel = fin;
    setTimeout(fin, 2500); // вкладка в фоне: не держать награду
  }

  function roomFinale(rid, gift) {
    log('room_complete', { room_id: rid });
    saveNow();
    renderHome({ fresh: rid === 'r01' ? 'room' : Scene.catSeat(rid) });
    Sound.play('chord');
    var next = function () {
      if (rid !== 'r01') { if (gift) showGift(gift); else showInvitation(rid); }
      else if (gift) showGift(gift);
    };
    if (rid !== 'r01') toast(C.rooms[rid].final_text, 4200);
    // Игрок успел открыть письмо или другую шторку — подарок ждёт, пока она закроется.
    setTimeout(function offer() {
      if (S.room_choice_pending !== rid) { next(); return; }
      if (!$('sheet').hidden) { setTimeout(offer, 700); return; }
      showRoomChoice(rid, next);
    }, reducedMotion() ? 300 : rid === 'r01' ? 900 : 1600);
  }

  // Награда за комнату на выбор из трёх: монеты, карандаши или вещь.
  function showRoomChoice(rid, after) {
    var opts = St.roomChoices(C, S, rid);
    var node = h('div', 'choice-sheet');
    node.appendChild(sheetHead('Выбери подарок', 'chest_b'));
    var grid = h('div', 'reward-grid');
    var picked = false;
    opts.forEach(function (o, i) {
      var b = h('button', 'card reward-card');
      b.type = 'button';
      b.setAttribute('data-pick', String(i));
      var label;
      if (o.coins) { b.appendChild(pic('coin')); label = '+' + o.coins; }
      else if (o.pencils) { b.appendChild(pic('pencil')); label = '+' + o.pencils; }
      else if (o.variant) {
        var f = St.findVariant(C, o.variant);
        b.classList.add('is-thing');
        b.appendChild(pic(f.variant.sprite));
        label = f.variant.title;
      } else {
        b.classList.add('is-thing', 'is-glow');
        b.appendChild(pic(Scene.spriteOf(C, S, o.glow)));
        label = 'Сияние';
      }
      b.appendChild(h('b', '', label));
      b.setAttribute('aria-label', o.coins ? o.coins + ' монет' : o.pencils ? o.pencils + ' карандаша' : label);
      b.addEventListener('click', function () {
        if (picked) return;
        picked = true;
        var from = b.getBoundingClientRect();
        var got = St.pickRoomReward(C, S, rid, i);
        saveNow();
        closeSheet(true);
        if (got && got.variant) {
          var fv = St.findVariant(C, got.variant);
          renderHome({ fresh: fv.object });
          Sound.play('chord');
        } else if (got && got.glow) {
          renderHome({ fresh: got.glow });
          Sound.play('chord');
        } else {
          renderHome();
          if (got) playRewards([{ type: got.coins ? 'coins' : 'pencils', n: got.coins || got.pencils }], from);
        }
        setTimeout(after, reducedMotion() ? 200 : 1200);
      });
      grid.appendChild(b);
    });
    node.appendChild(grid);
    // Закрыли не выбрав — выбор подождёт до следующего входа.
    openSheet(node, function () { if (!picked) after(); }, 'sheet-choice');
    log('room_choice_show', { room_id: rid });
  }

  // Полная карточка «7 встреч»: подарок.
  function showGift(g) {
    Sound.play('chord');
    var node = h('div', 'gift-sheet');
    node.appendChild(sheetHead('Подарок за 7 встреч'));
    var box = h('div', 'gift-box');
    box.appendChild(pic('gift', 'gift-art'));
    node.appendChild(box);
    var items = h('div', 'gift-items');
    g.variants.forEach(function (vid) {
      var f = St.findVariant(C, vid);
      var it = h('div', 'gift-item');
      it.appendChild(pic(f.variant.sprite));
      it.appendChild(h('span', '', f.variant.title));
      items.appendChild(it);
    });
    if (g.pencils) {
      var p = h('div', 'gift-item');
      p.appendChild(pic('pencil'));
      p.appendChild(h('span', '', '+' + g.pencils));
      items.appendChild(p);
    }
    node.appendChild(items);
    var vid0 = g.variants[0];
    node.appendChild(button('btn-main', 'Поставить', 'check', function () {
      var f = St.findVariant(C, vid0);
      closeSheet(true);
      if (f && St.isObjectRestored(C, S, f.object)) {
        St.chooseVariant(C, S, f.object, vid0);
        saveNow();
        goRoom(C.objects[f.object].room);
        renderHome({ fresh: f.object });
      } else renderHome();
    }));
    openSheet(node, function () { renderHome(); }, 'sheet-gift');
    log('gift', { variants: g.variants });
  }

  /* ---------------- оформление ---------------- */

  function variantLock(v) {
    if (!v.premium || St.isVariantOwned(C, S, v.id)) return null;
    if (v.price_coins) return priceTag('coins', v.price_coins);
    var t = h('span', 'price price-lock');
    t.appendChild(pic(v.gift ? 'stamp' : 'gift'));
    return t;
  }

  function openVariantSheet(oid, opts) {
    opts = opts || {};
    var o = C.objects[oid];
    var node = h('div', 'variant-sheet');
    node.appendChild(sheetHead(opts.afterReveal ? 'Какой будет ' + o.title.toLowerCase() + '?' : o.title));
    if (opts.secret) node.appendChild(h('p', 'secret', o.tap_secret));
    // Тост с историей предмета уходит в шторку: поверх неё он закрыл бы заголовок.
    if (opts.story) { hideToast(); node.appendChild(h('p', 'secret', opts.story)); }
    var grid = h('div', 'variant-grid');
    grid.style.setProperty('--n', o.variants.length);
    var action = h('div', 'variant-action');
    var preview = null;

    function rerender() {
      Scene.render($('scene'), C, S, curRoom(), preview ? { preview: { oid: oid, vid: preview } } : undefined);
      renderPill();
    }
    function paint() {
      var curV = S.object_variants[oid];
      var cards = grid.querySelectorAll('.variant');
      for (var i = 0; i < cards.length; i++) {
        var id = cards[i].getAttribute('data-v');
        var on = preview ? id === preview : id === curV;
        cards[i].classList.toggle('is-selected', on);
        cards[i].classList.toggle('is-trying', !!preview && id === preview);
        cards[i].setAttribute('aria-pressed', String(on));
        var lock = cards[i].querySelector('.price');
        var owned = St.isVariantOwned(C, S, id);
        if (lock && owned) lock.remove();
        cards[i].classList.toggle('is-premium', !owned);
        var vv = St.findVariant(C, id).variant;
        cards[i].classList.toggle('is-afford', !owned && !!vv.price_coins && S.coins >= vv.price_coins);
      }
      action.innerHTML = '';
      if (!preview) return;
      var v = St.findVariant(C, preview).variant;
      if (v.price_coins) {
        var buy = h('button', 'btn-buy');
        buy.type = 'button';
        buy.appendChild(h('span', '', 'Купить'));
        buy.appendChild(priceTag('coins', v.price_coins));
        if (S.coins < v.price_coins) buy.classList.add('is-short');
        buy.addEventListener('click', function () {
          var r = St.buyVariant(C, S, v.id);
          if (r.ok) {
            Sound.play('reward');
            preview = null;
            saveNow();
            paint(); rerender(); renderHud(); bump($('hud-coins'));
            var w = Scene.objectRect($('scene'), oid);
            if (w) { var img = $('scene').querySelector('img.spr-obj[data-obj="' + oid + '"]'); if (img) { img.classList.remove('is-wiggle'); void img.offsetWidth; img.classList.add('is-wiggle'); } }
            return;
          }
          if (r.reason === 'coins') { Sound.play('back'); toast('Не хватает ' + r.need + ' ' + plural(r.need, 'монеты', 'монет', 'монет') + '. Монеты — за картинки и письма'); bump($('hud-coins')); }
        });
        action.appendChild(buy);
      } else if (v.sku) {
        var d = C.skus[v.sku];
        var sb = h('button', 'btn-buy btn-buy-sku');
        sb.type = 'button';
        sb.appendChild(pic('gift'));
        sb.appendChild(h('span', '', d.title));
        sb.appendChild(priceTag('votes', d.votes));
        sb.addEventListener('click', function () { buySku(v.sku, function () { preview = null; paint(); rerender(); }); });
        action.appendChild(sb);
      } else if (v.gift) {
        var g = h('div', 'variant-gift');
        g.appendChild(h('span', 'card-sub', 'Подарок за 7 встреч'));
        g.appendChild(stampsRow(true));
        action.appendChild(g);
      }
    }
    o.variants.forEach(function (v) {
      var b = h('button', 'variant');
      b.type = 'button';
      b.setAttribute('data-v', v.id);
      b.appendChild(pic(v.sprite));
      b.appendChild(h('span', 'variant-title', v.title));
      var mark = h('span', 'variant-check');
      mark.appendChild(icon('check'));
      b.appendChild(mark);
      var lock = variantLock(v);
      if (lock) b.appendChild(lock);
      b.addEventListener('click', function () {
        if (St.isVariantOwned(C, S, v.id)) {
          if (S.object_variants[oid] !== v.id || preview) Sound.play('toggle');
          preview = null;
          St.chooseVariant(C, S, oid, v.id);
          scheduleSave();
        } else {
          Sound.play('toggle');
          preview = v.id;
          log('variant_preview', { variant_id: v.id });
        }
        paint();
        rerender();
      });
      grid.appendChild(b);
    });
    node.appendChild(grid);
    node.appendChild(action);
    node.appendChild(button('btn-main', 'Готово', 'check', function () { Sound.play('tap'); closeSheet(); }));
    paint();
    openSheet(node, function () {
      if (St.objectStatus(C, S, oid) === 'choose_variant') St.closeVariantChoice(S, oid);
      saveNow();
      renderHome();
      if (opts.onDone) opts.onDone();
    }, 'sheet-variants');
  }

  /* ---------------- письмо прихожей и приглашения ---------------- */

  function openLetter(reread) {
    Sound.play('tap');
    var node = h('div', 'letter-sheet');
    node.appendChild(sheetHead('Письмо с птичьей печатью'));
    var env = h('button', 'envelope');
    env.type = 'button';
    env.setAttribute('aria-label', 'Распечатать');
    env.appendChild(pic('letter'));
    node.appendChild(env);
    var go = button('btn-main', 'Распечатать', 'letter', function () { showInvitation('r01'); });
    env.addEventListener('click', function () { showInvitation('r01'); });
    node.appendChild(go);
    openSheet(node, function () { renderHome(); }, 'sheet-letter');
    if (!S.story_flags.letter_opened) { St.setFlag(S, 'letter_opened'); log('letter_open'); saveNow(); }
    if (reread) showInvitation('r01');
  }

  function showInvitation(rid) {
    Sound.play('reward');
    var R = C.rooms[rid], inv = R.invitation;
    var node = h('div', 'invite-sheet');
    var card = h('div', 'invite');
    card.appendChild(pic('invitation', 'invite-art'));
    var body = h('div', 'invite-body');
    body.appendChild(h('h2', 'invite-title', inv.title));
    body.appendChild(h('p', 'invite-text', inv.text));
    body.appendChild(h('p', 'invite-sign', '— ' + inv.sign));
    card.appendChild(body);
    node.appendChild(card);
    var next = R.next_room && C.rooms[R.next_room];
    if (next) {
      node.appendChild(button('btn-main', inv.button, 'chev', function () { closeSheet(true); goRoom(R.next_room); }));
    } else {
      node.appendChild(button('btn-main', inv.button || 'Хорошо', 'check', function () { Sound.play('tap'); closeSheet(); }));
    }
    openSheet(node, function () { renderHome(); }, 'sheet-invite');
    St.setFlag(S, 'invitation_seen_' + rid);
    log('invitation_view', { room_id: rid });
    saveNow();
  }

  function openBeforeAfter(rid) {
    rid = rid || curRoom();
    Sound.play('tap');
    var node = h('div', 'ba-sheet');
    node.appendChild(sheetHead('Было и стало'));
    var box = h('div', 'ba');
    var after = h('div', 'scene ba-after');
    var before = h('div', 'scene ba-before');
    box.appendChild(after);
    box.appendChild(before);
    box.appendChild(h('span', 'ba-label ba-label-b', 'До'));
    box.appendChild(h('span', 'ba-label ba-label-a', 'После'));
    var range = h('input', 'ba-range');
    range.type = 'range'; range.min = '0'; range.max = '100'; range.value = '50';
    range.setAttribute('aria-label', 'Сравнить до и после');
    function setCut() { box.style.setProperty('--cut', range.value + '%'); }
    range.addEventListener('input', setCut);
    setCut();
    node.appendChild(box);
    node.appendChild(range);
    openSheet(node, function () { renderHome(); }, 'sheet-ba');
    Scene.render(after, C, S, rid, { interactive: false });
    Scene.render(before, C, S, rid, { interactive: false, before: true });
    log('before_after_open', { room_id: rid });
    if (!reducedMotion()) {
      // Шторка сама проезжает туда-обратно один раз — видно, что её можно двигать.
      var t0 = performance.now();
      (function step(t) {
        if (!document.body.contains(range) || range.dataset.touched) return;
        var k = Math.min(1, (t - t0) / 1600);
        range.value = String(Math.round(50 + 35 * Math.sin(k * Math.PI * 2)));
        setCut();
        if (k < 1) requestAnimationFrame(step);
      })(t0);
      range.addEventListener('pointerdown', function () { range.dataset.touched = '1'; });
    }
  }

  /* ---------------- письма дня ---------------- */

  function letterById(id) { return C.daily.letters.filter(function (L) { return L.id === id; })[0]; }

  function postcard(id, big) {
    var w = h('div', 'postcard' + (big ? ' is-big' : ''));
    var cv = pixelCanvas(id, true);
    cv.className = 'postcard-pic';
    w.appendChild(cv);
    return w;
  }

  // Чтобы вернуться завтра: закладка ВК и напоминание о письме. Только в ВК,
  // только по нажатию; согласился — кнопка больше не показывается.
  function remindRow() {
    if (Platform.name !== 'vk') return null;
    var acts = [];
    if (!Platform.isFavorite && !S.story_flags.fav_added) acts.push(['fav', 'star', 'В избранное', Platform.addFavorite, 'fav_added']);
    if (!Platform.notifyOn && !S.story_flags.notify_ok) acts.push(['notify', 'bell', 'Напомнить', Platform.allowNotify, 'notify_ok']);
    if (!acts.length) return null;
    var row = h('div', 'remind-row');
    acts.forEach(function (a) {
      var b = button('btn-small btn-remind', a[2], a[1], function () {
        Sound.play('tap');
        b.disabled = true;
        a[3]().then(function (ok) {
          log('remind', { kind: a[0], ok: ok });
          if (!ok) { b.disabled = false; return; }
          S.story_flags[a[4]] = true;
          saveNow();
          toast(a[0] === 'fav' ? 'Игра в избранном' : 'Напомним о новом письме');
          if (screen === 'letters') renderLetters();
        });
      });
      b.setAttribute('data-act', a[0]);
      row.appendChild(b);
    });
    return row;
  }

  function renderLetters() {
    var page = $('letters-page');
    page.innerHTML = '';
    page.appendChild(h('h1', 'page-title', 'Письма'));
    var day = St.today();

    if (!S.daily.start) {
      var lock = h('div', 'card card-lock');
      lock.appendChild(pic('envelope', 'lock-art'));
      lock.appendChild(icon('lock'));
      lock.appendChild(h('p', 'card-text', 'Письма начнут приходить, когда оживёт прихожая.'));
      page.appendChild(lock);
      return;
    }

    // «7 встреч»
    var sc = h('section', 'card card-stamps');
    var head = h('div', 'card-head');
    head.appendChild(pic('stamp', 'head-ico'));
    head.appendChild(h('b', 'card-title', '7 встреч'));
    sc.appendChild(head);
    sc.appendChild(stampsRow(false));
    if (St.stampsActive(C, S)) sc.appendChild(h('p', 'card-sub', 'Штамп — за первую картинку дня. Пропуск не сбрасывает.'));
    page.appendChild(sc);

    // Письмо дня
    var list = St.dailyLetters(C, S, day);
    var T = St.todayLetter(C, S, day);
    var tc = h('section', 'card card-today');
    if (T && T.status === 'today') {
      var L = letterById(T.id);
      if (!T.opened) {
        var env = h('button', 'envelope envelope-today');
        env.type = 'button';
        env.setAttribute('aria-label', 'Открыть письмо');
        env.setAttribute('data-letter-id', T.id);
        env.appendChild(pic('envelope'));
        env.addEventListener('click', function () { openDailyLetter(T.id); });
        tc.appendChild(env);
        tc.appendChild(button('btn-main', 'Открыть письмо', 'letter', function () { openDailyLetter(T.id); }));
      } else {
        tc.appendChild(noteBody(L));
        tc.appendChild(button('btn-main', 'Разгадать ' + puzzleSize(T.id), 'play', function () { startLetter(T.id); }));
      }
    } else if (T && T.status === 'solved') {
      var L2 = letterById(T.id);
      tc.appendChild(postcard(T.id, true));
      tc.appendChild(h('b', 'card-title', L2.title));
      var nx = h('p', 'card-sub next-letter');
      nx.appendChild(icon('clock'));
      nx.appendChild(h('span', '', 'Новое письмо ' + untilTomorrow()));
      tc.appendChild(nx);
      var rm = remindRow();
      if (rm) tc.appendChild(rm);
    } else {
      tc.appendChild(pic('envelope', 'lock-art'));
      tc.appendChild(h('p', 'card-text', 'Новые письма скоро. Пока можно ответить на прежние.'));
    }
    page.appendChild(tc);

    // Альбом: решённые — открытки, пришедшие раньше — конверты с остатком дней.
    var older = list.filter(function (l) { return (l.status === 'solved' && (!T || l.id !== T.id)) || l.status === 'open'; }).reverse();
    if (older.length) {
      page.appendChild(h('h2', 'page-sub', 'Альбом'));
      var grid = h('div', 'album');
      older.forEach(function (l) {
        var b = h('button', 'album-item is-' + l.status);
        b.type = 'button';
        b.setAttribute('data-letter-id', l.id);
        var Lx = letterById(l.id);
        if (l.status === 'solved') {
          b.appendChild(postcard(l.id));
          b.setAttribute('aria-label', Lx.title);
          b.addEventListener('click', function () { openPostcard(l.id); });
        } else {
          b.appendChild(pic('envelope'));
          var leftDays = C.daily.keep_days - St.daysBetween(l.day, day);
          b.appendChild(h('span', 'days-left', leftDays + ' дн.'));
          b.setAttribute('aria-label', 'Письмо, осталось ' + leftDays + ' дн.');
          b.addEventListener('click', function () { openDailyLetter(l.id); });
        }
        grid.appendChild(b);
      });
      page.appendChild(grid);
    }
  }

  function noteBody(L) {
    var note = h('div', 'note');
    note.appendChild(h('p', 'card-text', L.text));
    note.appendChild(h('p', 'card-sign', '— ' + L.from));
    return note;
  }

  function openDailyLetter(id) {
    Sound.play('reward');
    var L = letterById(id);
    var first = St.openLetterEnvelope(S, id);
    if (first) { log('daily_open', { id: id }); saveNow(); }
    var node = h('div', 'daily-sheet');
    node.appendChild(sheetHead('Письмо', 'envelope'));
    var card = h('div', 'card card-letter');
    card.appendChild(noteBody(L));
    node.appendChild(card);
    node.appendChild(button('btn-main', 'Разгадать ' + puzzleSize(id), 'play', function () { closeSheet(true); startLetter(id); }));
    openSheet(node, function () { renderLetters(); renderHud(); }, 'sheet-daily');
    renderHud();
  }

  function openPostcard(id, rewards) {
    var L = letterById(id);
    var node = h('div', 'postcard-sheet');
    node.appendChild(sheetHead(L.title));
    node.appendChild(postcard(id, true));
    node.appendChild(noteBody(L));
    node.appendChild(button('btn-main', 'Готово', 'check', function () { Sound.play('tap'); closeSheet(); }));
    openSheet(node, function () {
      renderLetters(); renderHud();
      if (rewards) {
        var gift = rewards.filter(function (r) { return r.type === 'gift'; })[0];
        if (gift) showGift(gift);
      }
    }, 'sheet-postcard');
  }

  function letterSolved(rs, from) {
    showScreen('letters');
    Sound.play('reward');
    Sound.buzz(20);
    log('daily_solved', { id: rs.pid });
    openPostcard(rs.pid, rs.res.rewards);
    playRewards(rs.res.rewards, from);
  }

  /* ---------------- лавка ---------------- */

  function section(title, art) {
    var s = h('section', 'shop-sec');
    var head = h('h2', 'page-sub');
    if (art) head.appendChild(pic(art, 'head-ico'));
    head.appendChild(h('span', '', title));
    s.appendChild(head);
    return s;
  }

  // Карандаши: за монеты, за голоса и за ролик.
  function pencilOffers(after) {
    var grid = h('div', 'offers');
    var one = offer('pencil', '×1', priceTag('coins', C.economy.pencil_price), function () {
      var r = St.buyPencil(C, S);
      if (!r.ok) { Sound.play('back'); toast('Не хватает ' + r.need + ' ' + plural(r.need, 'монеты', 'монет', 'монет')); bump($('hud-coins')); return; }
      Sound.play('reward'); saveNow(); renderHud(); bump($('hud-pencils'));
      if (after) after();
      else if (screen === 'shop') renderShop();
    });
    one.setAttribute('data-offer', 'pencil_coins');
    grid.appendChild(one);
    if (C.skus.pencils_10) {
      var ten = offer('pencil', '×10', priceTag('votes', C.skus.pencils_10.votes), function () { buySku('pencils_10', after); });
      ten.setAttribute('data-offer', 'pencils_10');
      ten.classList.add('is-pack');
      grid.appendChild(ten);
    }
    if (adsOpen()) {
      var left = St.adsLeft(C, S, St.today());
      var R = C.economy.rewarded;
      [['pencil', '+' + R.pencils, 'pencil'], ['coin', '+' + R.coins, 'coins']].forEach(function (a) {
        var tag = h('span', 'price price-ad');
        tag.appendChild(icon('video'));
        tag.appendChild(h('b', '', left + '/' + R.per_day));
        var b = offer(a[0], a[1], tag, function () { watchAd(a[2], after); });
        b.setAttribute('data-offer', 'ad_' + a[2]);
        b.classList.add('is-ad');
        if (left <= 0) b.disabled = true;
        grid.appendChild(b);
      });
    }
    return grid;
  }

  function offer(art, label, price, onClick) {
    var b = h('button', 'offer');
    b.type = 'button';
    var top = h('span', 'offer-art');
    top.appendChild(pic(art));
    top.appendChild(h('b', 'offer-n', label));
    b.appendChild(top);
    b.appendChild(price);
    b.addEventListener('click', function () { Sound.play('tap'); onClick(); });
    return b;
  }

  function renderShop() {
    var page = $('shop-page');
    var y = page.scrollTop;
    page.innerHTML = '';
    page.appendChild(h('h1', 'page-title', 'Лавка'));

    // Сначала то, что покупается за монеты: оформление — цель для монет.
    var s3 = section('Оформление', 'coin');
    var grid = h('div', 'deco-grid');
    St.openRooms(C, S).forEach(function (rid) {
      C.rooms[rid].objects.forEach(function (oid) {
        C.objects[oid].variants.forEach(function (v) { if (v.premium && v.price_coins) grid.appendChild(decoCard(oid, v)); });
      });
    });
    s3.appendChild(grid);
    page.appendChild(s3);

    var s1 = section('Карандаши', 'pencil');
    s1.appendChild(pencilOffers(null));
    page.appendChild(s1);

    var skus = Object.keys(C.skus).filter(function (k) { return C.skus[k].grants.variants && St.canOfferSku(C, S, k); });
    if (skus.length) {
      var s2 = section('Наборы', 'gift');
      skus.forEach(function (k) { s2.appendChild(bundleCard(k)); });
      page.appendChild(s2);
    }
    if (!Platform.canPay) page.appendChild(h('p', 'shop-note', 'Стенд: покупки тестовые, голоса не списываются.'));
    page.scrollTop = y;
  }

  function bundleCard(sku) {
    var d = C.skus[sku];
    var c = h('div', 'card bundle');
    c.setAttribute('data-sku', sku);
    var top = h('div', 'bundle-top');
    top.appendChild(pic('gift', 'bundle-ico'));
    var body = h('div', 'card-body');
    body.appendChild(h('b', 'card-title', d.title));
    body.appendChild(h('span', 'card-sub', d.text));
    top.appendChild(body);
    c.appendChild(top);
    var items = h('div', 'bundle-items');
    (d.grants.variants || []).forEach(function (vid) {
      var f = St.findVariant(C, vid);
      items.appendChild(pic(f.variant.sprite));
    });
    if (d.grants.pencils) {
      var p = h('span', 'bundle-pencils');
      p.appendChild(pic('pencil'));
      p.appendChild(h('b', '', '×' + d.grants.pencils));
      items.appendChild(p);
    }
    c.appendChild(items);
    var b = h('button', 'btn-buy btn-buy-sku');
    b.type = 'button';
    b.appendChild(priceTag('votes', d.votes));
    b.addEventListener('click', function () { buySku(sku); });
    c.appendChild(b);
    return c;
  }

  function decoCard(oid, v) {
    var owned = St.isVariantOwned(C, S, v.id);
    var restored = St.isObjectRestored(C, S, oid);
    var worn = S.object_variants[oid] === v.id;
    var afford = !owned && restored && S.coins >= v.price_coins;
    var b = h('button', 'deco' + (owned ? ' is-owned' : '') + (restored ? '' : ' is-locked') + (worn ? ' is-worn' : '') + (afford ? ' is-afford' : ''));
    b.type = 'button';
    b.setAttribute('data-v', v.id);
    b.appendChild(pic(v.sprite, 'deco-art'));
    b.appendChild(h('span', 'deco-title', v.title));
    if (worn) { var ck = h('span', 'variant-check'); ck.appendChild(icon('check')); b.appendChild(ck); }
    if (owned) b.appendChild(h('span', 'deco-state', worn ? 'Стоит' : 'Есть'));
    else if (!restored) { var l = h('span', 'price price-lock'); l.appendChild(icon('lock')); b.appendChild(l); }
    else b.appendChild(priceTag('coins', v.price_coins));
    b.addEventListener('click', function () {
      if (!restored) { Sound.play('back'); toast('Сначала верни: ' + C.objects[oid].title.toLowerCase()); return; }
      // Примерка в комнате: открываем предмет со шторкой оформлений.
      goRoom(C.objects[oid].room);
      openVariantSheet(oid, {});
      if (!owned) { var card = $('sheet').querySelector('.variant[data-v="' + v.id + '"]'); if (card) card.click(); }
    });
    return b;
  }

  /* Покупка набора за голоса. В ВК — окно оплаты ВК; на стенде — тестовая
     покупка без денег (чтобы проверить выдачу и интерфейс). */
  function buySku(sku, after) {
    var d = C.skus[sku];
    if (!St.canOfferSku(C, S, sku)) { toast('Уже куплено'); return; }
    log('buy_start', { sku: sku });
    if (Platform.canPay) {
      Platform.buy(sku).then(function (r) {
        if (r.ok) grantOrder('vk-' + r.order_id, sku, after);
        else if (r.reason !== 'cancel') toast('Покупка не прошла. Голоса не списаны');
        log('buy_result', { sku: sku, ok: r.ok, reason: r.reason || null });
        // Сдвинуть курсор журнала; если ответ окна потерялся — выдать по журналу.
        setTimeout(syncPurchases, 1500);
      });
      return;
    }
    var node = h('div', 'test-buy');
    node.appendChild(sheetHead(d.title, d.icon === 'pencil' ? 'pencil' : 'gift'));
    node.appendChild(h('p', 'secret', d.text));
    node.appendChild(h('p', 'test-note', 'Тестовая покупка: на стенде голоса не списываются. В ВК здесь откроется окно оплаты.'));
    var b = h('button', 'btn-buy btn-buy-sku');
    b.type = 'button';
    b.appendChild(h('span', '', 'Купить'));
    b.appendChild(priceTag('votes', d.votes));
    b.addEventListener('click', function () { closeSheet(true); grantOrder('test-' + Date.now(), sku, after); });
    node.appendChild(b);
    openSheet(node, null, 'sheet-buy');
  }

  function grantOrder(orderId, sku, after) {
    var r = St.applyOrder(C, S, orderId, sku);
    if (!r.ok) { if (r.reason === 'duplicate') toast('Эта покупка уже получена'); return; }
    saveNow();
    Sound.play('chord');
    renderHud();
    if (r.pencils) bump($('hud-pencils'));
    if (screen === 'shop') renderShop();
    else if (screen === 'home') renderHome();
    var d = C.skus[sku];
    var node = h('div', 'gift-sheet');
    node.appendChild(sheetHead('Спасибо!'));
    var items = h('div', 'gift-items');
    r.variants.forEach(function (vid) {
      var f = St.findVariant(C, vid);
      var it = h('div', 'gift-item');
      it.appendChild(pic(f.variant.sprite));
      it.appendChild(h('span', '', f.variant.title));
      items.appendChild(it);
    });
    if (r.pencils) {
      var p = h('div', 'gift-item');
      p.appendChild(pic('pencil'));
      p.appendChild(h('span', '', '+' + r.pencils));
      items.appendChild(p);
    }
    node.appendChild(items);
    if (r.variants.length) node.appendChild(h('p', 'secret', 'Вещи уже стоят в комнатах. Ещё не возвращённые появятся в своём оформлении.'));
    node.appendChild(button('btn-main', 'Готово', 'check', function () { Sound.play('tap'); closeSheet(); }));
    openSheet(node, function () { if (after) after(); }, 'sheet-gift');
    log('order_applied', { sku: sku, order_id: String(orderId), title: d.title });
  }

  /* Ролик за награду — только по нажатию игрока, не больше 3 в день. */
  function watchAd(kind, after) {
    if (St.adsLeft(C, S, St.today()) <= 0) { toast('На сегодня ролики закончились'); return; }
    var done = function (ok) {
      if (!ok) { toast('Ролик не досмотрен — награды нет'); return; }
      var r = St.rewardedGrant(C, S, kind);
      if (!r.ok) return;
      saveNow();
      Sound.play('reward');
      renderHud();
      bump(kind === 'pencil' ? $('hud-pencils') : $('hud-coins'));
      if (after) after();
      if (screen === 'shop') renderShop();
    };
    log('ad_start', { kind: kind });
    if (Platform.canAds) { Platform.showRewarded().then(done); return; }
    // Стенд: тестовый «ролик» на две секунды.
    var node = h('div', 'ad-test');
    node.appendChild(sheetHead('Ролик (тест)'));
    var bar = h('div', 'ad-bar');
    bar.appendChild(h('i'));
    node.appendChild(bar);
    node.appendChild(h('p', 'test-note', 'На стенде вместо рекламы — пауза в 2 секунды.'));
    openSheet(node, function () { clearTimeout(t); }, 'sheet-ad');
    var t = setTimeout(function () { closeSheet(true); done(true); }, reducedMotion() ? 300 : 2000);
  }

  /* ---------------- возвращение после паузы ---------------- */

  function showWelcome(away) {
    var gift = St.comebackGift(C, S, away);
    var waiting = St.dailyLetters(C, S).filter(function (l) { return l.status === 'today' || l.status === 'open'; }).length;
    var node = h('div', 'welcome-sheet');
    node.appendChild(sheetHead('С возвращением!', 'envelope'));
    var text = away >= 7 ? 'Дом соскучился! Вера сберегла для тебя всё, что пришло.' : 'Финик ждал у двери и встретил тебя мурчанием.';
    if (waiting) text += ' Писем ждёт: ' + waiting + '.';
    node.appendChild(h('p', 'card-text', text));
    if (gift) {
      var items = h('div', 'gift-items');
      var it = h('div', 'gift-item');
      it.appendChild(pic('pencil'));
      it.appendChild(h('span', '', '+' + gift.pencils + ' в подарок'));
      items.appendChild(it);
      node.appendChild(items);
      renderHud();
    }
    if (waiting) node.appendChild(button('btn-main', 'К письмам', 'letter', function () { closeSheet(true); Sound.play('tap'); showScreen('letters'); }));
    else node.appendChild(button('btn-main', 'Домой', 'check', function () { Sound.play('tap'); closeSheet(); }));
    openSheet(node, function () { renderHome(); }, 'sheet-welcome');
    log('welcome_back', { away: away, letters: waiting, gift: !!gift });
    saveNow();
  }

  /* ---------------- новый день ---------------- */

  var dayNow = St.today();
  function onNewDay() {
    dayNow = St.today();
    if (St.registerVisit(S)) log('day_start', { day: dayNow });
    saveNow();
    if (screen === 'home') renderHome();
    else if (screen === 'letters') renderLetters();
    else if (screen === 'shop') renderShop();
    renderHud();
  }

  /* ---------------- настройки ---------------- */

  function openSettings() {
    var node = h('div', 'settings');
    node.appendChild(sheetHead('Настройки'));
    var row = h('div', 'toggles');
    [['sound', 'Звук', 'sound'], ['vibration', 'Вибрация', 'vibro'], ['reduced_motion', 'Меньше движения', 'motion']].forEach(function (t) {
      var key = t[0];
      var wrap = h('label', 'toggle');
      var b = h('button', 'tile tile-round toggle-btn');
      b.type = 'button';
      b.appendChild(icon(t[2]));
      function paint() {
        var on = key === 'reduced_motion' ? !!S.settings[key] : S.settings[key] !== false;
        b.classList.toggle('is-off', !on);
        b.setAttribute('aria-pressed', String(on));
      }
      b.setAttribute('aria-label', t[1]);
      b.addEventListener('click', function () {
        S.settings[key] = key === 'reduced_motion' ? !S.settings[key] : S.settings[key] === false;
        applySettings();
        Sound.play('toggle');
        log('setting', { key: key, value: S.settings[key] });
        saveNow();
        paint();
      });
      paint();
      wrap.appendChild(b);
      wrap.appendChild(h('span', 'toggle-label', t[1]));
      row.appendChild(wrap);
    });
    node.appendChild(row);
    if (Platform.journal) {
      var dev = h('div', 'dev-row');
      dev.appendChild(button('btn-small', 'Журнал', null, exportJournal));
      dev.appendChild(button('btn-small', '+1 день', null, function () {
        var n = St.getDayOffset() + 1;
        St.setDayOffset(n);
        try { sessionStorage.setItem(DAY_KEY, String(n)); } catch (e) { /* нет sessionStorage */ }
        closeSheet(true);
        onNewDay();
        toast('День: ' + St.today());
      }));
      var reset = button('btn-small btn-danger', 'Сбросить прогресс', null, function () {
        if (!reset.dataset.armed) { reset.dataset.armed = '1'; reset.lastChild.textContent = 'Точно сбросить?'; return; }
        storage.removeItem(St.STORAGE_KEY);
        try { sessionStorage.removeItem(DAY_KEY); } catch (e) { /* нет sessionStorage */ }
        location.reload();
      });
      dev.appendChild(reset);
      node.appendChild(dev);
    }
    node.appendChild(h('p', 'build-stamp', 'Сборка ' + BUILD + ' · контент ' + C.content_version + (St.getDayOffset() ? ' · день ' + St.today() : '')));
    openSheet(node, null, 'sheet-settings');
  }

  function exportJournal() {
    var data = JSON.stringify({ build: BUILD, exported_at: new Date().toISOString(), ua: navigator.userAgent, state: S }, null, 2);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = 'hop-journal-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------------- запуск ---------------- */

  function boot() {
    if (loaded.recovered_from_broken) St.logEvent(S, 'save_recovered_from_broken');
    if (loaded.migrated_from) St.logEvent(S, 'save_migrated', { from: loaded.migrated_from });
    S.content_version = C.content_version;
    S.current_room = curRoom();
    var away = St.daysAway(S);
    St.registerVisit(S);
    St.logEvent(S, 'session_start', { build: BUILD, platform: Platform.name, fresh: loaded.fresh, viewport: innerWidth + 'x' + innerHeight, day: St.today() });
    saveNow();
    applySettings();
    Platform.init();
    showScreen('home');
    renderHome();
    var pend = S.room_choice_pending;
    if (pend && C.rooms[pend] && St.isRoomComplete(C, S, pend)) showRoomChoice(pend, function () {});
    else if (away >= 2 && hallDone() && $('sheet').hidden) showWelcome(away);
    cloudStart();
    // Новый день мог наступить, пока вкладка открыта.
    setInterval(function () { if (dayNow !== St.today()) onNewDay(); }, 60000);
  }

  // Для автотестов и наблюдения.
  window.__hop = {
    state: function () { return JSON.parse(JSON.stringify(S)); },
    build: BUILD,
    screen: function () { return screen; },
    currentPuzzle: function () { return cur ? cur.pid : null; },
    today: function () { return St.today(); },
    setDay: function (n) { St.setDayOffset(n); onNewDay(); return St.today(); },
    cloud: function () { return { enabled: HopCloud.enabled, ready: cloud.ready, rev: cloud.rev, pending: !!cloud.pending }; }
  };

  boot();
})();
