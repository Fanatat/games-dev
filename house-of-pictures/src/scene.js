/* Сцена комнаты: фон и предметы по раскладке room.layout (доли квадрата).
   Состояние берётся из сейва; сцена ничего не меняет сама, только рисует и
   сообщает о касаниях. Невосстановленная комната приглушена (насыщенность
   фона растёт с числом готовых предметов), невосстановленный предмет —
   бледный силуэт, доступный — силуэт с пульсирующим кольцом. */
window.Scene = (function () {
  'use strict';

  var ART = 'assets/art/';
  var SVGNS = 'http://www.w3.org/2000/svg';

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

  function spriteOf(C, S, oid) {
    var o = C.objects[oid];
    var vid = S.object_variants[oid] || o.variants[0].id;
    var v = o.variants.filter(function (x) { return x.id === vid; })[0] || o.variants[0];
    return ART + v.sprite + '.webp';
  }

  // Знак птицы на стене — простой силуэт (проступает, когда горит лампа).
  function birdSign() {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('class', 'sign');
    var c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('cx', '20'); c.setAttribute('cy', '20'); c.setAttribute('r', '18');
    c.setAttribute('fill', 'none'); c.setAttribute('stroke', 'currentColor'); c.setAttribute('stroke-width', '2');
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
           interactive: false — без кнопок-hotspot (для «до/после»),
           hide: oid — нарисовать этот предмет ещё не восстановленным (пока летит миниатюра),
           fresh: oid | 'room' — проиграть появление предмета / прихода кота. */
  function render(host, C, S, rid, opts) {
    opts = opts || {};
    var room = C.rooms[rid], L = room.layout;
    var St = window.HopState;
    var restored = {};
    room.objects.forEach(function (oid) { restored[oid] = !opts.before && oid !== opts.hide && St.isObjectRestored(C, S, oid); });
    var n = room.objects.filter(function (oid) { return restored[oid]; }).length;
    var complete = n === room.objects.length;

    host.innerHTML = '';
    host.style.setProperty('--life', (n / room.objects.length).toFixed(3));
    host.classList.toggle('is-complete', complete);
    host.classList.toggle('is-lit', !!restored.r01_lamp);
    host.classList.toggle('fresh-lamp', opts.fresh === 'r01_lamp');

    var bg = el('img', 'scene-bg', { src: room.background, alt: '', draggable: 'false' });
    host.appendChild(bg);

    var light = el('div', 'scene-light');
    light.style.setProperty('--lx', (L.light.x * 100) + '%');
    light.style.setProperty('--ly', (L.light.y * 100) + '%');
    light.style.setProperty('--lr', (L.light.r * 100) + '%');
    host.appendChild(light);

    var sign = birdSign();
    var signWrap = el('div', 'spr-sign' + (restored.r01_lamp ? ' is-shown' : ''));
    place(signWrap, L.sign);
    signWrap.appendChild(sign);
    host.appendChild(signWrap);

    // Следы видны после коврика и до прихода кота.
    var pawsOn = restored.r01_rug && !complete;
    L.paws.forEach(function (pt, i) {
      var w = el('div', 'spr-paw' + (pawsOn ? ' is-shown' : '') + (opts.fresh === 'r01_rug' ? ' is-fresh' : ''));
      place(w, { x: pt[0], y: pt[1], w: 0.034 });
      w.style.setProperty('--d', (i * 90) + 'ms');
      w.style.setProperty('--rot', (i % 2 ? 18 : -10) + 'deg');
      w.appendChild(paw());
      host.appendChild(w);
    });

    // Порядок слоёв: коврик (пол) → кот → консоль/лампа → полка → письмо → цветок → птица.
    var order = ['r01_rug', 'r01_lamp', 'r01_shelf', 'r01_flower'];
    order.forEach(function (oid) {
      var st = opts.before ? (C.objects[oid].prerequisites.length ? 'locked' : 'available') : St.objectStatus(C, S, oid);
      if (oid === opts.hide) st = 'in_progress';
      var active = opts.interactive !== false && st !== 'locked';
      var o = C.objects[oid];
      var wrap = el(active ? 'button' : 'div', 'obj obj-' + st + (opts.fresh === oid ? ' is-fresh' : ''), { 'data-obj': oid });
      if (active) {
        wrap.type = 'button';
        wrap.setAttribute('aria-label', (st === 'available' || st === 'in_progress') ? o.verb + ': ' + o.title : o.title);
      }
      place(wrap, L[oid]);
      var img = el('img', 'spr-obj', { src: spriteOf(C, S, oid), alt: '', draggable: 'false', 'data-obj': oid });
      if (!restored[oid]) img.classList.add(st === 'locked' ? 'is-locked' : 'is-ghost');
      wrap.appendChild(img);
      if (active && (st === 'available' || st === 'in_progress')) wrap.appendChild(el('span', 'hs-ring'));
      if (active && st === 'choose_variant') {
        var dot = el('span', 'hs-badge');
        dot.innerHTML = '<svg class="ico"><use href="#i-palette"/></svg>';
        wrap.appendChild(dot);
      }
      host.appendChild(wrap);
      if (oid === 'r01_rug') {
        var cat = el('img', 'spr spr-cat' + (complete ? ' is-shown' : '') + (opts.fresh === 'room' ? ' is-arriving' : ''), { src: ART + 'cat.webp', alt: '', draggable: 'false' });
        place(cat, L.cat);
        host.appendChild(cat);
      }
      if (oid === 'r01_shelf') {
        var ready = complete && !opts.before && !S.story_flags.letter_opened;
        var letter = el(ready && opts.interactive !== false ? 'button' : 'div',
          'spr spr-letter' + (restored.r01_shelf ? ' is-shown' : '') + (opts.fresh === 'r01_shelf' ? ' is-fresh' : '') + (ready ? ' is-ready' : ''));
        if (ready) { letter.setAttribute('data-letter', '1'); letter.setAttribute('aria-label', 'Открыть письмо'); }
        letter.appendChild(el('img', '', { src: ART + 'letter.webp', alt: '', draggable: 'false' }));
        place(letter, L.letter);
        host.appendChild(letter);
      }
    });
    var bird = el('img', 'spr spr-bird' + (restored.r01_flower ? ' is-shown' : '') + (opts.fresh === 'r01_flower' ? ' is-fresh' : ''), { src: ART + 'bird.webp', alt: '', draggable: 'false' });
    place(bird, L.bird);
    host.appendChild(bird);
  }

  // Прямоугольник спрайта предмета на экране (цель полёта миниатюры).
  function objectRect(host, oid) {
    var img = host.querySelector('img.spr-obj[data-obj="' + oid + '"]');
    return img ? img.getBoundingClientRect() : null;
  }

  return { render: render, objectRect: objectRect, spriteOf: spriteOf };
})();
