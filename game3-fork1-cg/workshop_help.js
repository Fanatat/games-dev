/* workshop_help.js — окно «Как играть» «Ювелир Ленд» (замечание модерации ВК VK-03)
   и постоянные ссылки на поддержку и правовые страницы (VK-R1, разметка — workshop.html).

   Открывается кнопкой «?» на карте (#btn-help) и на уровне (#btn-help-game), закрывается
   крестиком, фоном и Escape. На уровне ввод по полю на паузе: окно закрывает поле целиком,
   клавиши пока оно открыто не доходят до игры (WsHelp.key в начале обработчика workshop.js).
   Правила, сейв, экономика и поле не меняются; флага «прочитано» нет.
   Картинки камней — тем же рисунком, что на поле (WsBoard.drawGem; пока атлас не пришёл —
   запасные цветные шарики). Цены подсказки и ходов берутся из констант workshop.js (attach). */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let api = null, from = '', back = null;

  function isOpen() { const o = $('help-overlay'); return !!o && !o.classList.contains('hidden'); }

  // ---------- картинки ----------
  function tube(g, x, y, w, h, glow) {
    const r = w / 2;
    g.save();
    if (glow) { g.shadowColor = 'rgba(255, 214, 102, 0.95)'; g.shadowBlur = 8; }
    g.beginPath();
    g.moveTo(x, y); g.lineTo(x, y + h - r);
    g.arc(x + r, y + h - r, r, Math.PI, 0, true);
    g.lineTo(x + w, y);
    g.fillStyle = 'rgba(255, 255, 255, 0.55)'; g.fill();
    g.shadowBlur = 0;
    g.lineWidth = 1.6; g.strokeStyle = glow ? '#e0a92e' : '#b98aa3'; g.stroke();
    g.fillStyle = '#e9c27a';
    g.fillRect(x - 2, y - 2, w + 4, 3);
    g.restore();
  }
  function gems(g, x, y, w, h, list) {      // снизу вверх
    const s = w * 0.92, step = Math.min(s * 0.92, (h - 4) / 4);
    list.forEach((k, j) => drawGem(g, k, x + w / 2, y + h - 2 - step * (j + 0.5), s));
  }
  function drawGem(g, k, x, y, s, a) {
    const B = typeof WsBoard !== 'undefined' ? WsBoard : null;      // const в общем скрипте, не window.WsBoard
    if (B && B.drawGem) { try { B.drawGem(g, k, x, y, s, a); return; } catch (e) { /* ниже — запасной */ } }
    g.fillStyle = '#c45a7a'; g.beginPath(); g.arc(x, y, s * 0.4, 0, Math.PI * 2); g.fill();
  }
  function arrow(g, x1, y1, x2, y2, bend) {
    const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - bend;
    g.save();
    g.strokeStyle = '#7b3f6c'; g.lineWidth = 2.4; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(mx, my, x2, y2); g.stroke();
    const a = Math.atan2(y2 - my, x2 - mx), L = 6;
    g.beginPath();
    g.moveTo(x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5)); g.lineTo(x2, y2);
    g.lineTo(x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5)); g.stroke();
    g.restore();
  }
  function card(g, x, y, w, h, faded) {
    g.save();
    g.globalAlpha = faded ? 0.75 : 1;
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, 7); else g.rect(x, y, w, h);
    g.fillStyle = '#fff8f2'; g.fill();
    g.lineWidth = 2; g.strokeStyle = '#e9c27a'; g.stroke();
    g.restore();
  }
  const PICS = {
    move(g) {                                  // верхний камень переходит на такой же
      tube(g, 14, 10, 18, 50); gems(g, 14, 10, 18, 50, ['S', 'R', 'E']);
      tube(g, 64, 10, 18, 50); gems(g, 64, 10, 18, 50, ['A', 'E']);
      drawGem(g, 'E', 23, 9, 15, 0.45);
      arrow(g, 29, 8, 70, 22, 10);
    },
    four(g) {                                  // четвёрка уходит в заказ
      tube(g, 10, 6, 18, 54, true); gems(g, 10, 6, 18, 54, ['R', 'R', 'R', 'R']);
      arrow(g, 33, 30, 54, 30, 6);
      card(g, 58, 12, 32, 40);
      drawGem(g, 'R', 74, 32, 24);
    },
    queue(g) {                                 // заказ сейчас и следующие под ним
      card(g, 26, 2, 44, 38);
      drawGem(g, 'R', 48, 21, 28);
      [['E', 30], ['S', 48], ['A', 66]].forEach(([k, x]) => drawGem(g, k, x, 52, 15, 0.85));
      g.save(); g.strokeStyle = '#b98aa3'; g.lineWidth = 1.2; g.setLineDash([2, 3]);
      g.beginPath(); g.moveTo(22, 44); g.lineTo(74, 44); g.stroke(); g.restore();
    },
    wait(g) {                                  // готовая четвёрка ждёт свой заказ
      tube(g, 10, 6, 18, 54, true); gems(g, 10, 6, 18, 54, ['S', 'S', 'S', 'S']);
      card(g, 50, 8, 36, 34);
      drawGem(g, 'R', 68, 25, 24);
      drawGem(g, 'S', 68, 54, 14, 0.85);
      g.save(); g.fillStyle = '#8d5f4c';
      [36, 41, 46].forEach(x => { g.beginPath(); g.arc(x, 34, 1.8, 0, Math.PI * 2); g.fill(); });
      g.restore();
    }
  };
  function drawPics() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    document.querySelectorAll('#help-overlay canvas.ws-help-pic').forEach((cv) => {
      const f = PICS[cv.dataset.pic];
      if (!f) return;
      const W = 96, H = 64;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const g = cv.getContext('2d');
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      try { f(g); } catch (e) { /* картинка — украшение; текст остаётся */ }
    });
  }

  // ---------- окно ----------
  function texts() {
    if (!api) return;
    const free = api.freeHint, price = api.hintPrice;
    const hint = $('ws-help-hint'), hard = $('ws-help-hard');
    const T = WsI18n.t;
    if (hint) hint.textContent = free > 0 ? T('Подсказка показывает ход: на уровнях 1–{free} бесплатно, дальше — {price} монет', { free, price })
      : T('Подсказка показывает ход: {price} монет', { price });
    if (hard) hard.textContent = T('Каждый пятый уровень — сложный заказ: ходов мало. Кончились — +{n} ходов за {price} монет', { n: api.moreMoves, price: api.morePrice });
  }
  function open(src) {
    const o = $('help-overlay');
    if (!o || isOpen()) return;
    from = src || '';
    back = document.activeElement;
    if (api) { api.sfx('click'); if (from === 'game') api.deselect(); }
    texts();
    o.classList.remove('hidden');
    const list = o.querySelector('.ws-help-list');
    if (list) list.scrollTop = 0;
    o.querySelector('.ws-win-box').scrollTop = 0;
    o.scrollTop = 0;
    drawPics();
    if (api) api.track('help_open', { from, level: api.level() });
    setTimeout(() => { if (isOpen()) $('btn-help-close').focus(); }, 60);
  }
  function close() {
    if (!isOpen()) return;
    if (api) api.sfx('click');
    $('help-overlay').classList.add('hidden');
    if (back && back.focus && document.contains(back)) { try { back.focus(); } catch (e) { /* фокус не важен */ } }
    back = null;
  }
  // клавиши, пока окно открыто: Escape закрывает, остальное до поля не доходит
  function key(ev) {
    if (!isOpen()) return false;
    if (ev.key === 'Escape') { ev.preventDefault(); close(); }
    return true;      // Tab, Enter и пробел работают в самом окне как обычно (без preventDefault)
  }
  function attach(a) {
    api = a;
    const o = $('help-overlay');
    if (!o) return;
    ['btn-help', 'btn-help-game'].forEach((id) => {
      const b = $(id);
      if (b) b.addEventListener('click', () => open(id === 'btn-help' ? 'map' : 'game'));
    });
    $('btn-help-close').addEventListener('click', close);
    o.addEventListener('click', (ev) => { if (ev.target === o) close(); });
    window.addEventListener('resize', () => { if (isOpen()) drawPics(); });
    texts();
  }

  window.WsHelp = { OVERLAYS: ['help-overlay'], attach, key, isOpen, open, close };
})();
