/* Сцена комнаты: фон и предметы по раскладке room.layout (доли квадрата).
   Состояние берётся из сейва; сцена ничего не меняет сама, только рисует и
   сообщает о касаниях. Насыщенность фона растёт с каждой решённой картинкой
   комнаты. Предмет по стадиям: ничего не решено — бледный силуэт (с кольцом,
   если его можно начать); решена часть картинок — цветной спрайт стадии;
   решены все — выбранное оформление. Прихожая дополнительно рисует свет,
   знак птицы, следы, письмо и птицу; кот живёт в прихожей, пока в чайной
   не восстановлено кресло. */
window.Scene = (function () {
  'use strict';

  var ART = 'assets/art/';
  var SVGNS = 'http://www.w3.org/2000/svg';
  // На каком предмете сидит кот в каждой комнате (кот рисуется сразу за ним).
  // Место кота в комнате. Кот живёт в последней комнате, где его место готово
  // (в прихожей — вся комната), и уходит туда сам, когда место появляется.
  var CAT_ON = { r01: 'r01_rug', r02: 'r02_armchair', r03: 'r03_bench' };

  function el(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function place(node, p) {
    node.style.left = (p.x * 100) + '%';
    node.style.top = (p.y * 100) + '%';
    node.style.width = (p.w * 100) + '%';
    if (p.rot) node.style.setProperty('--rot', p.rot + 'deg');
  }

  function variantSprite(C, oid, vid) {
    var o = C.objects[oid];
    var v = o.variants.filter(function (x) { return x.id === vid; })[0] || o.variants[0];
    return ART + v.sprite + '.webp';
  }

  // Спрайт готового предмета в выбранном оформлении.
  function spriteOf(C, S, oid) {
    return variantSprite(C, oid, S.object_variants[oid]);
  }

  // Спрайт предмета на стадии stage (0 — ничего не решено).
  function stageSprite(C, S, oid, stage) {
    var o = C.objects[oid];
    if (stage >= o.puzzles.length) return spriteOf(C, S, oid);
    if (stage > 0 && o.stage_sprites) return ART + o.stage_sprites[stage - 1] + '.webp';
    return variantSprite(C, oid, o.variants[0].id);
  }

  // Знак птицы на стене — простой силуэт (проступает, когда горит лампа).
  function birdSign() {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('class', 'sign');
    var c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('cx', '20'); c.setAttribute('cy', '20'); c.setAttribute('r', '18');
    c.setAttribute('fill', '#fbefd9'); c.setAttribute('fill-opacity', '.7');
    c.setAttribute('stroke', 'currentColor'); c.setAttribute('stroke-width', '3.4');
    var p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', 'M9 23c3-1 5-4 7-7 1.5-2.3 4-3.5 6.4-2.6l3.8-1.6-1.6 3.4c1 2.6.4 5.7-1.7 7.6 2.5.3 5 1.4 7.1 3.2-4.8.4-8.6 0-11.6-1.3-2.9 1.3-6.2 1-9.4-.7z');
    p.setAttribute('fill', 'currentColor');
    svg.appendChild(c); svg.appendChild(p);
    return svg;
  }

  function paw() {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('class', 'paw');
    [[10, 13, 4.2, 3.6], [4.6, 7.6, 2, 2.4], [8.4, 4.6, 2, 2.5], [12.4, 4.8, 2, 2.5], [15.8, 8, 2, 2.4]].forEach(function (a) {
      var e = document.createElementNS(SVGNS, 'ellipse');
      e.setAttribute('cx', a[0]); e.setAttribute('cy', a[1]); e.setAttribute('rx', a[2]); e.setAttribute('ry', a[3]);
      e.setAttribute('fill', 'currentColor');
      svg.appendChild(e);
    });
    return svg;
  }

  /* opts: { before: true } — вид «до» (ничего не восстановлено),
           interactive: false — без кнопок (для «до/после»),
           hide: oid — нарисовать этот предмет на стадию раньше (пока летит миниатюра),
           fresh: oid | 'room' — проиграть появление предмета / прихода кота,
           preview: { oid, vid } — примерка оформления (ещё не куплено),
           noGlow: oid — пока не показывать «Сияние» (сундучок ещё не открыт),
           afford: oid — значок «Хватает!» (монет хватает на оформление). */
  function render(host, C, S, rid, opts) {
    opts = opts || {};
    var room = C.rooms[rid], L = room.layout;
    var St = window.HopState;
    var stage = {}, restored = {}, total = 0, solved = 0;
    room.objects.forEach(function (oid) {
      var n = C.objects[oid].puzzles.length;
      var st = opts.before ? 0 : St.objectStage(C, S, oid);
      if (oid === opts.hide && st > 0) st--;
      stage[oid] = st;
      restored[oid] = st >= n;
      total += n; solved += st;
    });
    var complete = room.objects.every(function (oid) { return restored[oid]; });
    var hall = rid === 'r01';
    // Тепло ступенями: прихожая — с каждой вещью (лампа — четверть), дальше — на 1/3 и 2/3 картинок.
    var steps = hall ? total : 3;
    var warm = opts.before ? 0 : complete ? steps : Math.floor(steps * solved / total);
    var same = host.getAttribute('data-room') === rid;
    var was = host.getAttribute('data-warm');
    if (!opts.before && same && was !== null && +was < warm) host._warmAt = Date.now();
    if (!same) host._warmAt = 0;
    // Кот: в прихожей — после третьей вещи, дальше — на своём месте в последней комнате.
    var catShown = !opts.before && catHome(C, S, opts.hide) === rid;
    var catWas = same ? host.getAttribute('data-cat') : null;

    host.innerHTML = '';
    host.setAttribute('data-room', rid);
    host.setAttribute('data-warm', String(warm));
    host.setAttribute('data-cat', catShown ? '1' : '0');
    host.style.setProperty('--life', (solved / total).toFixed(3));
    host.style.setProperty('--warm', (warm / steps).toFixed(3));
    // Прихожая начинает выцветшей (её «вау» — тепло), следующие комнаты — уже живые.
    host.style.setProperty('--sat0', opts.before || rid === 'r01' ? '.3' : '.6');
    host.classList.toggle('is-warming', !!host._warmAt && Date.now() - host._warmAt < 2200);
    host.classList.toggle('is-complete', complete);
    host.classList.toggle('is-lit', !!restored.r01_lamp);
    host.classList.toggle('fresh-lamp', opts.fresh === 'r01_lamp');

    host.appendChild(el('img', 'scene-bg', { src: room.background, alt: '', draggable: 'false' }));
    host.appendChild(el('div', 'scene-warm'));
    // Оранжерея: свет из сада сквозь стеклянную крышу — с первой минуты.
    if (rid === 'r03' && !opts.before) host.appendChild(el('div', 'scene-sun'));

    if (hall) {
      var light = el('div', 'scene-light');
      light.style.setProperty('--lx', (L.light.x * 100) + '%');
      light.style.setProperty('--ly', (L.light.y * 100) + '%');
      light.style.setProperty('--lr', (L.light.r * 100) + '%');
      host.appendChild(light);

      var signWrap = el('div', 'spr-sign' + (restored.r01_lamp ? ' is-shown' : ''));
      place(signWrap, L.sign);
      signWrap.appendChild(birdSign());
      host.appendChild(signWrap);

      // Следы видны после коврика и до прихода кота.
      var pawsOn = restored.r01_rug && !catShown;
      L.paws.forEach(function (pt, i) {
        var w = el('div', 'spr-paw' + (pawsOn ? ' is-shown' : '') + (opts.fresh === 'r01_rug' ? ' is-fresh' : ''));
        place(w, { x: pt[0], y: pt[1], w: 0.034 });
        w.style.setProperty('--d', (i * 90) + 'ms');
        w.style.setProperty('--rot', (i % 2 ? 18 : -10) + 'deg');
        w.appendChild(paw());
        host.appendChild(w);
      });
    }

    var order = room.z || room.objects;
    order.forEach(function (oid) {
      var o = C.objects[oid];
      var st = opts.before ? (St.isRoomUnlocked(C, S, rid) && (o.unlock_after === 0 || (o.prerequisites && !o.prerequisites.length)) ? 'available' : 'locked')
        : St.objectStatus(C, S, oid);
      if (oid === opts.hide) st = stage[oid] > 0 ? 'in_progress' : 'available';
      var inter = opts.interactive !== false;
      var wrap = el(inter ? 'button' : 'div', 'obj obj-' + st + (opts.fresh === oid ? ' is-fresh' : ''), { 'data-obj': oid });
      if (inter) {
        wrap.type = 'button';
        wrap.setAttribute('aria-label', st === 'locked' ? o.title + ' — пока закрыто'
          : (st === 'available' || st === 'in_progress') ? o.verb + ': ' + o.title : o.title);
      }
      place(wrap, L[oid]);
      var pv = opts.preview && opts.preview.oid === oid && restored[oid];
      var src = pv ? variantSprite(C, oid, opts.preview.vid) : stageSprite(C, S, oid, stage[oid]);
      var img = el('img', 'spr-obj', { src: src, alt: '', draggable: 'false', 'data-obj': oid });
      if (stage[oid] === 0) img.classList.add(st === 'locked' ? 'is-locked' : 'is-ghost');
      else if (!restored[oid]) img.classList.add('is-stage');
      wrap.appendChild(img);
      if (restored[oid] && !opts.before && o.life) wrap.appendChild(lifeFx(o.life, opts.fresh === oid));
      if (inter && (st === 'available' || st === 'in_progress')) wrap.appendChild(el('span', 'hs-ring'));
      if (restored[oid] && !opts.before && (S.glows || []).indexOf(oid) !== -1 && opts.noGlow !== oid) {
        wrap.classList.add('is-glow');
        for (var g = 0; g < 3; g++) wrap.appendChild(el('i', 'glow-spark'));
      }
      if (inter && st === 'choose_variant') {
        var dot = el('span', 'hs-badge');
        dot.innerHTML = '<svg class="ico"><use href="#i-palette"/></svg>';
        wrap.appendChild(dot);
      } else if (inter && opts.afford === oid && st === 'restored') {
        var coin = el('span', 'hs-badge hs-afford');
        coin.appendChild(el('img', '', { src: ART + 'coin.webp', alt: '', draggable: 'false' }));
        wrap.appendChild(coin);
        wrap.setAttribute('aria-label', o.title + ' — хватает на оформление');
      }
      // Секрет не подписан: только что вставшая готовая вещь один раз блестит, когда
      // игрок снова видит сцену (после окна оформления), — и всё.
      if (inter && opts.spark === oid && restored[oid] && o.tap_secret && (S.secrets || []).indexOf(oid) === -1) {
        for (var q = 0; q < 3; q++) wrap.appendChild(el('i', 'hint-spark'));
      }
      if (pv) {
        wrap.classList.add('is-preview');
        wrap.appendChild(el('span', 'pv-label')).textContent = 'Пример';
      }
      host.appendChild(wrap);

      if (oid === CAT_ON[rid] && L.cat) {
        var arriving = catShown && (hall ? catWas === '0' : opts.fresh === CAT_ON[rid]);
        var cat = el('img', 'spr spr-cat' + (catShown ? ' is-shown' : '') + (arriving ? ' is-arriving' : ''),
          { src: ART + 'cat.webp', alt: '', draggable: 'false' });
        place(cat, L.cat);
        host.appendChild(cat);
      }
      if (hall && oid === 'r01_shelf') {
        var ready = complete && !opts.before && !S.story_flags.letter_opened;
        var letter = el(ready && opts.interactive !== false ? 'button' : 'div',
          'spr spr-letter' + (restored.r01_shelf ? ' is-shown' : '') + (opts.fresh === 'r01_shelf' ? ' is-fresh' : '') + (ready ? ' is-ready' : ''));
        if (ready) { letter.setAttribute('data-letter', '1'); letter.setAttribute('aria-label', 'Открыть письмо'); }
        letter.appendChild(el('img', '', { src: ART + 'letter.webp', alt: '', draggable: 'false' }));
        place(letter, L.letter);
        host.appendChild(letter);
      }
    });
    if (hall) {
      var bird = el('img', 'spr spr-bird' + (restored.r01_flower ? ' is-shown' : '') + (opts.fresh === 'r01_flower' ? ' is-fresh' : ''), { src: ART + 'bird.webp', alt: '', draggable: 'false' });
      place(bird, L.bird);
      host.appendChild(bird);
    } else if (L.bird && !opts.before) {
      // Малиновка залетела из сада первой и ждёт у двери — тёплое пятно в пустой комнате.
      var guest = el('img', 'spr spr-bird spr-guest is-shown', { src: ART + 'bird.webp', alt: '', draggable: 'false' });
      place(guest, L.bird);
      host.appendChild(guest);
    }
  }

  // Функция готового предмета: пар над чайником, отблеск маятника, ноты шкатулки, цветы оранжереи.
  var BLOOM = ['#f2b6c6', '#f7d36b', '#c9b6f2'];
  function lifeFx(life, fresh) {
    var box = el('span', 'life life-' + life.kind + (fresh ? ' is-fresh' : ''));
    if (life.x !== undefined) { box.style.left = (life.x * 100) + '%'; box.style.top = (life.y * 100) + '%'; }
    if (life.kind === 'steam') for (var i = 0; i < 3; i++) box.appendChild(el('i'));
    else if (life.kind === 'waltz') ['♪', '♫', '♪'].forEach(function (n) { box.appendChild(el('i')).textContent = n; });
    else if (life.kind === 'glint') box.appendChild(el('i'));
    else if (life.kind === 'bloom') {
      BLOOM.forEach(function (color, k) {
        var f = document.createElementNS(SVGNS, 'svg');
        f.setAttribute('viewBox', '0 0 20 20');
        f.setAttribute('class', 'bloom bloom-' + k);
        for (var p = 0; p < 5; p++) {
          var e = document.createElementNS(SVGNS, 'ellipse');
          e.setAttribute('cx', '10'); e.setAttribute('cy', '5.2'); e.setAttribute('rx', '3.6'); e.setAttribute('ry', '4.8');
          e.setAttribute('fill', color);
          e.setAttribute('transform', 'rotate(' + (p * 72) + ' 10 10)');
          f.appendChild(e);
        }
        var c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('cx', '10'); c.setAttribute('cy', '10'); c.setAttribute('r', '2.8'); c.setAttribute('fill', '#e9a23b');
        f.appendChild(c);
        box.appendChild(f);
      });
    }
    return box;
  }

  // В прихожую кот приходит после третьей вещи — «вау» до третьей минуты.
  var HALL_CAT = 3;
  function hallRestored(C, S, hide) {
    var St = window.HopState;
    return C.rooms.r01.objects.filter(function (oid) { return oid !== hide && St.isObjectRestored(C, S, oid); }).length;
  }

  // Комната, где сейчас кот (null — ещё не пришёл). hide — предмет, который
  // пока рисуется на стадию раньше (летит миниатюра).
  function catHome(C, S, hide) {
    var St = window.HopState, home = null;
    St.roomOrder(C).forEach(function (rid) {
      var seat = CAT_ON[rid];
      if (!seat || !C.objects[seat] || !C.rooms[rid].layout.cat) return;
      var ok = rid === 'r01' ? hallRestored(C, S, hide) >= HALL_CAT : St.isObjectRestored(C, S, seat) && hide !== seat;
      if (ok) home = rid;
    });
    return home;
  }

  // Прямоугольник спрайта предмета на экране (цель полёта миниатюры).
  function objectRect(host, oid) {
    var img = host.querySelector('img.spr-obj[data-obj="' + oid + '"]');
    return img ? img.getBoundingClientRect() : null;
  }

  return { render: render, objectRect: objectRect, spriteOf: spriteOf, stageSprite: stageSprite, variantSprite: variantSprite, catSeat: function (rid) { return CAT_ON[rid]; } };
})();
