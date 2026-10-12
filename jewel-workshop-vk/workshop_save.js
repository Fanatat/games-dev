/* ============================================================
   workshop_save.js — формат сохранения «Мастерской украшений» (v4).

   Чистые функции без DOM и хранилища. Читает и пишет сейв workshop.js
   через WSPlatform (loadSave / writeSave / flush); здесь — только данные:
   - fresh(ctx)            — сейв нового игрока;
   - normalize(d, ctx, m)  — проверка КАЖДОГО поля отдельно: битое поле
                             получает значение по умолчанию, остальные
                             сохраняются; v3 → v4 без потерь; m — «звук
                             выключен» из сейва MVP (ключ jewel_workshop.v1),
                             когда своего сейва нет;
   - owns()                — вариант убранства во владении (по умолчанию,
                             шкатулка коллекции или owned);
   - applyRows()           — выдача покупок по строкам журнала сервера;
   - reconcile()           — права по entitlements() (источник истины).
   Договор полей — docs/WORKSHOP_RELEASE_PLAN.md §4 и docs/WORKSHOP.md.
   Проверка: node tests/ws_save_test.js.

   ctx собирает workshop.js из своих таблиц:
     levels      — id уровней кампании по порядку;
     novelty     — ключи окон «Новое!» и 'hard';
     perColl     — уровней в коллекции; collections — [{ decor: [вид, id] }];
     decor       — { вид: [{ id, set? }] }, первый вариант вида — по умолчанию;
     gems        — буквы камней (для pieces.gems);
     restoreCur  — function(cur) -> true, если незаконченная партия цела;
     today       — номер дня установки для нового игрока (WSAnalytics.dayNumber());
     ftueAll     — маска всех шагов первых минут (для игроков из v3 с победами);
     metals      — металлы оправы (B2, необязательно): pieces/choice с другим
                   металлом получают null (золото);
     shapes      — { id уровня: [форма 1, форма 2] } (B2, необязательно):
                   форма не из списка уровня — null (первая форма).
   ============================================================ */
(function (root) {
  'use strict';

  var VERSION = 4;
  var DAY = 86400000;
  var ID = /^[a-z][a-z0-9_]{0,31}$/;                           // металл, форма, вариант убранства
  var OWNED = /^[a-z][a-z0-9_]{0,15}:[a-z][a-z0-9_]{0,31}$/;  // '<вид>:<id>'
  var MAX_OWNED = 500;
  var MAX_GEMS = 16;
  var BIG = 9e15;                                              // курсор и сроки — мс/номера строк

  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function intIn(x, lo, hi) { return typeof x === 'number' && Math.floor(x) === x && x >= lo && x <= hi; }
  function numIn(x, lo, hi) { return typeof x === 'number' && isFinite(x) && x >= lo && x <= hi; }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function idOrNull(x) { return typeof x === 'string' && ID.test(x) ? x : null; }
  // B2: металл и форма изделия; при ctx.metals / ctx.shapes — только из списка, иначе null
  function metalOf(x, ctx) { var m = idOrNull(x); return m && (!ctx.metals || ctx.metals.indexOf(m) >= 0) ? m : null; }
  function shapeOf(x, ctx, k) {
    var f = idOrNull(x);
    return f && (!ctx.shapes || (isObj(ctx.shapes) && Array.isArray(ctx.shapes[k]) && ctx.shapes[k].indexOf(f) >= 0)) ? f : null;
  }

  function fresh(ctx) {
    var decor = {};
    Object.keys(ctx.decor).forEach(function (k) { decor[k] = ctx.decor[k][0].id; });
    return {
      v: VERSION, coins: 0, muted: false, novibe: false, best: {}, stars: {}, cur: null, seen: {}, chests: {}, sessions: 0,
      decor: decor, owned: {}, pieces: {}, choice: {}, fav: null,
      pay: { cursor: 0, noadsUntil: 0, royal: false },
      install: intIn(ctx.today, 1, 1e6) ? ctx.today : 0,
      flags: { favAsked: false, noadsOfferDay: 0, ftue: 0 }
    };
  }

  function levelKeys(ctx) { return ctx.levels.map(String); }

  function collDone(data, ctx, ci) {
    var ids = ctx.levels.slice(ci * ctx.perColl, ci * ctx.perColl + ctx.perColl);
    return ids.length > 0 && ids.every(function (id) { return !!data.stars[String(id)]; });
  }

  function findItem(ctx, kind, id) {
    var list = ctx.decor[kind];
    if (!list) return null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function owns(data, ctx, kind, id) {
    var list = ctx.decor[kind];
    if (!list || !findItem(ctx, kind, id)) return false;
    if (list[0].id === id) return true;
    for (var ci = 0; ci < ctx.collections.length; ci++) {
      var c = ctx.collections[ci].decor;
      if (data.chests[ci] && c && c[0] === kind && c[1] === id) return true;
    }
    return data.owned[kind + ':' + id] === 1;
  }

  // Каждое поле — в своей защите: исключение в одном не теряет остальные.
  function field(fn) { try { fn(); } catch (e) { /* поле остаётся по умолчанию */ } }

  function normalize(d, ctx, oldMuted) {
    var out = fresh(ctx);
    if (d == null) { out.muted = oldMuted === true; return out; }
    if (!isObj(d) || (d.v !== 3 && d.v !== VERSION)) return out;   // чужой формат — с чистого листа
    var keys = levelKeys(ctx);

    field(function () { if (intIn(d.coins, 0, 1e7)) out.coins = d.coins; });
    field(function () { out.muted = d.muted === true; });
    field(function () { out.novibe = d.novibe === true; });   // вибрация выключена (поле с 12.10.2026, без смены версии)
    field(function () { if (intIn(d.sessions, 0, 1e7)) out.sessions = d.sessions; });
    field(function () {      // звёзды — прогресс: битые «лучшие ходы» его не отнимают
      if (!isObj(d.stars)) return;
      keys.forEach(function (k) { if (intIn(d.stars[k], 1, 3)) out.stars[k] = d.stars[k]; });
    });
    field(function () {
      if (!isObj(d.best)) return;
      keys.forEach(function (k) { if (out.stars[k] && intIn(d.best[k], 1, 1e5)) out.best[k] = d.best[k]; });
    });
    field(function () {
      if (!isObj(d.seen)) return;
      ctx.novelty.forEach(function (k) { if (has(d.seen, k) && d.seen[k]) out.seen[k] = true; });
    });
    field(function () {
      if (!isObj(d.chests)) return;
      ctx.collections.forEach(function (c, ci) { if (d.chests[ci] && collDone(out, ctx, ci)) out.chests[ci] = true; });
    });
    field(function () {      // до decor: от owned зависит владение
      if (!isObj(d.owned)) return;
      var n = 0;
      Object.keys(d.owned).forEach(function (k) {
        if (n < MAX_OWNED && OWNED.test(k) && (d.owned[k] === 1 || d.owned[k] === true)) { out.owned[k] = 1; n++; }
      });
    });
    field(function () {
      if (!isObj(d.decor)) return;
      Object.keys(ctx.decor).forEach(function (kind) {
        var id = d.decor[kind];
        if (typeof id === 'string' && owns(out, ctx, kind, id)) out.decor[kind] = id;
      });
    });
    field(function () {
      if (!isObj(d.pieces)) return;
      keys.forEach(function (k) {
        var p = d.pieces[k];
        if (!isObj(p) || !out.stars[k]) return;      // изделие в шкатулке — только у пройденного уровня
        var gems = Array.isArray(p.gems) ? p.gems.filter(function (g) { return ctx.gems.indexOf(g) >= 0; }).slice(0, MAX_GEMS) : [];
        out.pieces[k] = { metal: metalOf(p.metal, ctx), shape: shapeOf(p.shape, ctx, k), gems: gems };
      });
    });
    field(function () {
      if (!isObj(d.choice)) return;
      keys.forEach(function (k) {
        var c = d.choice[k];
        if (!isObj(c)) return;
        var metal = metalOf(c.metal, ctx), shape = shapeOf(c.shape, ctx, k);
        if (metal || shape) out.choice[k] = { metal: metal, shape: shape };
      });
    });
    // любимое — только пройденный уровень (его изделие лежит в шкатулке)
    field(function () { if (intIn(d.fav, 1, 1e6) && keys.indexOf(String(d.fav)) >= 0 && out.stars[String(d.fav)]) out.fav = d.fav; });
    field(function () {
      if (!isObj(d.pay)) return;
      if (numIn(d.pay.cursor, 0, BIG)) out.pay.cursor = d.pay.cursor;
      if (numIn(d.pay.noadsUntil, 0, BIG)) out.pay.noadsUntil = d.pay.noadsUntil;
      out.pay.royal = d.pay.royal === true;
    });
    field(function () { if (intIn(d.install, 1, 1e6)) out.install = d.install; });
    field(function () {
      var f = d.flags;
      if (isObj(f)) {
        out.flags.favAsked = f.favAsked === true;
        if (intIn(f.noadsOfferDay, 0, 1e6)) out.flags.noadsOfferDay = f.noadsOfferDay;
        if (intIn(f.ftue, 0, 0xffff)) out.flags.ftue = f.ftue;
      }
      // Из v3: кто уже побеждал, первые минуты прошёл — шаги не повторяются в воронке.
      if (d.v === 3 && Object.keys(out.stars).length) out.flags.ftue |= (ctx.ftueAll || 0);
    });
    // незаконченная партия хранится упакованной; разворачивается при входе в уровень
    field(function () { if (ctx.restoreCur(d.cur)) out.cur = d.cur; });
    return out;
  }

  /* ---------- Королевский набор и другие наборы (set в таблице убранства) ---------- */

  function setItems(ctx, set) {
    var out = [];
    Object.keys(ctx.decor).forEach(function (kind) {
      ctx.decor[kind].forEach(function (it) { if (it.set === set) out.push([kind, it.id]); });
    });
    return out;
  }

  // Кладёт варианты набора в owned; wear — сразу надеть. true — что-то было новым.
  function grantSet(data, ctx, set, wear) {
    var fresh_ = false;
    setItems(ctx, set).forEach(function (ki) {
      var k = ki[0] + ':' + ki[1];
      if (data.owned[k] !== 1) { data.owned[k] = 1; fresh_ = true; }
      if (wear) data.decor[ki[0]] = ki[1];
    });
    return fresh_;
  }

  // Снимает варианты набора; надетое возвращается к умолчанию. true — что-то снято.
  function revokeSet(data, ctx, set) {
    var gone = false;
    setItems(ctx, set).forEach(function (ki) {
      var k = ki[0] + ':' + ki[1];
      if (has(data.owned, k)) { delete data.owned[k]; gone = true; }
      if (data.decor[ki[0]] === ki[1] && !owns(data, ctx, ki[0], ki[1])) data.decor[ki[0]] = ctx.decor[ki[0]][0].id;
    });
    return gone;
  }

  function hasSet(data, ctx, set) {
    var items = setItems(ctx, set);
    return items.length > 0 && items.every(function (ki) { return data.owned[ki[0] + ':' + ki[1]] === 1; });
  }

  /* Выдача по строкам журнала (WSPlatform.purchases): строки с id больше
     data.pay.cursor по возрастанию. Обычная строка продлевает срок «без
     рекламы» (до = max(до, оплата) + дни — как у сервера) и, если в ней набор,
     кладёт его в owned и надевает при первом получении. Строка возврата
     ничего не выдаёт — права пересчитывает reconcile() по entitlements().
     Курсор сдвигается в том же объекте, что и выдача: записанный сейв не
     выдаст строку второй раз, а обрыв до записи повторит выдачу целиком.
     Возвращает { ids, grants: [{ id, item, days, royal }], refund, royalNew }. */
  function applyRows(data, rows, ctx) {
    var res = { ids: [], grants: [], refund: false, royalNew: false };
    var cur = data.pay.cursor;
    (Array.isArray(rows) ? rows : []).filter(function (r) { return isObj(r) && numIn(r.id, 0, BIG); })
      .sort(function (a, b) { return a.id - b.id; })
      .forEach(function (r) {
        if (r.id <= cur) return;                     // уже выдано
        cur = r.id;
        res.ids.push(r.id);
        if (r.refund) { res.refund = true; return; }
        var days = intIn(r.days, 0, 1e5) ? r.days : 0;
        if (days > 0) data.pay.noadsUntil = Math.max(data.pay.noadsUntil, numIn(r.ts, 0, BIG) ? r.ts : 0) + days * DAY;
        if (r.royal) {
          if (grantSet(data, ctx, 'royal', !data.pay.royal)) res.royalNew = true;
          data.pay.royal = true;
        }
        res.grants.push({ id: r.id, item: String(r.item || ''), days: days, royal: !!r.royal });
      });
    data.pay.cursor = cur;
    return res;
  }

  /* Права по entitlements() — источник истины: срок как у сервера (возврат его
     сокращает), набор есть — восстановить (новое устройство, потерянный сейв),
     набора нет — снять. ent == null (нет сети, нет покупок) — ничего не меняет.
     Возвращает { changed, restored, revoked }. */
  function reconcile(data, ent, ctx) {
    var res = { changed: false, restored: false, revoked: false };
    if (!isObj(ent) || !numIn(ent.noadsUntil, 0, BIG)) return res;
    if (data.pay.noadsUntil !== ent.noadsUntil) { data.pay.noadsUntil = ent.noadsUntil; res.changed = true; }
    if (ent.royal) {
      if (!hasSet(data, ctx, 'royal')) { grantSet(data, ctx, 'royal', !data.pay.royal); res.restored = res.changed = true; }
      if (!data.pay.royal) { data.pay.royal = true; res.changed = true; }
    } else {
      if (revokeSet(data, ctx, 'royal')) res.revoked = res.changed = true;
      if (data.pay.royal) { data.pay.royal = false; res.revoked = res.changed = true; }
    }
    return res;
  }

  var api = {
    VERSION: VERSION, DAY: DAY,
    fresh: fresh, normalize: normalize, owns: owns, collDone: collDone, findItem: findItem,
    setItems: setItems, grantSet: grantSet, revokeSet: revokeSet, hasSet: hasSet,
    applyRows: applyRows, reconcile: reconcile
  };
  root.WorkshopSave = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
