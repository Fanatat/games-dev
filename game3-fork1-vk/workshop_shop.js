/* workshop_shop.js — лавка «Ювелир Ленд» (релиз 1.0, волна B3, план S5).

   Единственное окно убранства (decor-overlay, заголовок «Лавка»): вкладки по видам
   (стол, стекло, подушка, тумба), в каждой — карточки вариантов из таблицы DECOR
   (workshop.js). Карточка:
     своё (по умолчанию, из шкатулки, куплено, из набора) — нажатие надевает;
     в лавке (price)  — нажатие выбирает, главная кнопка становится «купить за N»
                        (недоступна, пока монет меньше цены);
     в шкатулке       — замочек, подсказка «В шкатулке «…»»;
     Королевский набор (set) — корона, открывает «Без рекламы» (только когда покупки
                        на площадке есть; без них вещей набора в окне нет).
   Одна главная кнопка: «готово» (✓) или «купить за N». Крестик и фон закрывают окно.

   Покупка: монеты −price, Store.data.owned['вид:id'] = 1, вещь сразу надета
   (Store.data.decor[вид]); сейв только через Store (save + flush). События:
   shop_open { from, coins }, coin_spend { what:'decor', item:'вид:id', amount, balance }
   (ключ item, а не id: id аналитика не пропускает как личные данные).

   Подключается до workshop.js; workshop.js создаёт окно через WsShop.create(host),
   host — доступ к игре (Store, DECOR, owns, applyDecor, track, …). */
(function () {
  'use strict';

  // вкладки: вид убранства и подпись для чтецов (на экране — только значки)
  const TABS = [['cloth', 'Стол'], ['tube', 'Стекло'], ['cushion', 'Подушка'], ['pedestal', 'Тумба']];
  const ICON = {
    cloth: '<svg viewBox="0 0 24 24"><path d="M2.5 9.5h19l-1.6 3.2H4.1z" fill="#d79a5a" stroke="#8a4a1c" stroke-width="1.3" stroke-linejoin="round"/><path d="M6 12.7v7.3M18 12.7v7.3" stroke="#8a4a1c" stroke-width="2.2" stroke-linecap="round"/><path d="M5 9.5c1-2.6 2.6-3.6 7-3.6s6 1 7 3.6" fill="#f2a7bd" stroke="#b5527a" stroke-width="1.2"/></svg>',
    tube: '<svg viewBox="0 0 24 24"><path d="M8.5 2.8h7" stroke="#b98226" stroke-width="2.4" stroke-linecap="round"/><path d="M9.6 3.6v14.2a2.4 2.4 0 0 0 4.8 0V3.6" fill="rgba(255,255,255,0.75)" stroke="#9a6a8a" stroke-width="1.5"/><path d="M9.6 12.6h4.8v5.2a2.4 2.4 0 0 1-4.8 0z" fill="#f0507f"/></svg>'
  };
  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };

  function create(h) {
    const $ = h.$;
    let open = false, from = 'map', tab = TABS[0][0], pick = null;   // pick — { kind, id } товар лавки, выбранный к покупке

    const coins = () => h.Store.data.coins;
    const casketOf = (kind, id) => h.COLLECTIONS.find(c => c.decor && c.decor[0] === kind && c.decor[1] === id) || null;
    // вариант виден: не из набора, свой, или набор можно купить на площадке
    const visible = (kind, d) => !d.set || h.owns(kind, d.id) || h.payOn();
    // товар лавки, которого ещё нет
    const forSale = (kind, d) => !!d && d.price > 0 && !d.set && !casketOf(kind, d.id) && !h.owns(kind, d.id);
    const pickItem = () => (pick ? h.decorItem(pick.kind, pick.id) : null);

    function renderTabs() {
      const box = $('ws-shop-tabs');
      box.innerHTML = '';
      TABS.forEach(([kind, label]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ws-shop-tab' + (kind === tab ? ' is-on' : '');
        b.id = 'ws-shop-tab-' + kind;
        b.dataset.kind = kind;
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', kind === tab ? 'true' : 'false');
        b.setAttribute('aria-controls', 'ws-shop-panel-' + kind);
        b.setAttribute('aria-label', label);
        const ico = document.createElement('span');
        ico.className = 'ws-decor-ico';
        ico.setAttribute('aria-hidden', 'true');
        if (ICON[kind]) ico.innerHTML = ICON[kind];
        else { ico.classList.add('is-pic'); ico.style.backgroundImage = h.decorPic(h.DECOR[kind][0]); }
        b.appendChild(ico);
        // точка: в этой вкладке есть товар, на который хватает монет
        if (h.DECOR[kind].some(d => forSale(kind, d) && d.price <= coins())) b.insertAdjacentHTML('beforeend', '<span class="ws-shop-dot" aria-hidden="true"></span>');
        b.addEventListener('click', () => {
          if (tab === kind) return;
          h.sfx('click');
          tab = kind;
          pick = null;
          render();
        });
        box.appendChild(b);
      });
    }

    function chip(kind, d) {
      const own = h.owns(kind, d.id), on = h.Store.data.decor[kind] === d.id;
      const sale = forSale(kind, d), poor = sale && d.price > coins();
      const src = casketOf(kind, d.id);
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = d.id;
      b.className = 'ws-decor-chip' + (on ? ' is-on' : '') +
        (own ? ' is-own' : d.set ? ' is-set' : sale ? ' is-shop' + (poor ? ' is-poor' : '') : ' is-locked') +
        (pick && pick.kind === kind && pick.id === d.id ? ' is-pick' : '');
      const sw = document.createElement('span');
      sw.className = 'ws-swatch';
      if (d.img) { sw.classList.add('is-pic'); sw.style.backgroundImage = h.decorPic(d); } else sw.style.background = d.swatch;
      b.appendChild(sw);
      if (on) b.insertAdjacentHTML('beforeend', '<span class="ws-decor-check" aria-hidden="true"></span>');
      else if (!own && d.set) b.insertAdjacentHTML('beforeend', '<span class="ws-decor-crown" aria-hidden="true"></span>');
      else if (sale) b.insertAdjacentHTML('beforeend', '<span class="ws-decor-price" aria-hidden="true"><span class="ws-coin-ico"></span>' + d.price + '</span>');
      else if (!own) b.insertAdjacentHTML('beforeend', '<span class="ws-decor-lock" aria-hidden="true"></span>');
      b.title = d.name;
      b.setAttribute('aria-label', d.name + (on ? ', выбрано' : own ? '' : d.set ? ', в Королевском наборе'
        : sale ? ', ' + d.price + ' ' + plural(d.price, 'монета', 'монеты', 'монет') + (poor ? ', не хватает монет' : '')
        : ', в шкатулке «' + (src ? src.name : '') + '»'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.addEventListener('click', () => tapChip(kind, d));
      return b;
    }

    function tapChip(kind, d) {
      const own = h.owns(kind, d.id);
      if (own) {
        pick = null;
        if (h.Store.data.decor[kind] !== d.id) {
          h.sfx('click');
          h.Store.data.decor[kind] = d.id;
          h.Store.save();
          h.applyDecor();
          h.toast(d.name, 1200);
        }
        render();
        return;
      }
      if (d.set) { close(); h.openNoads('shop'); return; }
      if (forSale(kind, d)) {
        const again = pick && pick.kind === kind && pick.id === d.id;
        pick = again ? null : { kind, id: d.id };
        if (!again && d.price > coins()) { h.sfx('invalid'); h.toast('Мало монет', 1600); } else h.sfx('click');
        render();
        if (pick && d.price <= coins()) $('btn-decor-ok').focus();
        return;
      }
      const src = casketOf(kind, d.id);
      h.sfx('invalid');
      h.toast('В шкатулке «' + (src ? src.name : '') + '»', 2000);
    }

    function renderOk() {
      const ok = $('btn-decor-ok'), d = pickItem();
      const buy = !!d && forSale(pick.kind, d);
      ok.classList.toggle('is-buy', buy);
      $('ws-shop-price').textContent = buy ? String(d.price) : '';
      ok.disabled = buy && d.price > coins();
      ok.setAttribute('aria-label', buy ? 'Купить: ' + d.name + ', ' + d.price + ' ' + plural(d.price, 'монета', 'монеты', 'монет') : 'Готово');
    }

    function render() {
      if (pick && !forSale(pick.kind, pickItem())) pick = null;
      $('ws-shop-coins-n').textContent = String(Math.max(0, coins()));
      renderTabs();
      const box = $('ws-decor');
      box.innerHTML = '';
      TABS.forEach(([kind, label]) => {
        const row = document.createElement('div');
        row.className = 'ws-decor-row ws-shop-grid';
        row.id = 'ws-shop-panel-' + kind;
        row.dataset.kind = kind;
        row.setAttribute('role', 'tabpanel');
        row.setAttribute('aria-label', label);
        row.hidden = kind !== tab;
        h.DECOR[kind].filter(d => visible(kind, d)).forEach(d => row.appendChild(chip(kind, d)));
        box.appendChild(row);
      });
      renderOk();
    }

    // Купить выбранное: только товар лавки, только при достатке монет; сразу надеть.
    function buy() {
      const d = pickItem();
      if (!d || !forSale(pick.kind, d)) { pick = null; render(); return false; }
      if (d.price > coins()) { h.sfx('invalid'); h.toast('Мало монет', 1600); return false; }
      const kind = pick.kind, key = kind + ':' + d.id;
      h.Store.data.coins -= d.price;
      h.Store.data.owned[key] = 1;
      h.Store.data.decor[kind] = d.id;
      h.Store.save();
      h.Store.flush();               // покупка — сразу в облако
      h.applyDecor();
      h.coinsChanged();
      h.track('coin_spend', { what: 'decor', item: key, amount: d.price, balance: h.Store.data.coins });
      h.sfx('reward');
      h.confetti();
      pick = null;
      render();
      h.toast(d.name, 1600);
      return true;
    }

    function main() {
      h.sfx('click');
      if (pick) buy(); else close();
    }

    function openShop(src) {
      from = src || 'map';
      tab = TABS[0][0];
      pick = null;
      render();
      $('decor-overlay').classList.remove('hidden');
      open = true;
      h.track('shop_open', { from, coins: coins() });
      setTimeout(() => { if (open) $('btn-decor-ok').focus(); }, 60);
    }

    function close() {
      if (!open) return;
      open = false;
      pick = null;
      $('decor-overlay').classList.add('hidden');
      h.focusBack();
    }

    $('btn-decor-ok').addEventListener('click', main);
    $('btn-shop-x').addEventListener('click', () => { h.sfx('click'); close(); });
    $('decor-overlay').addEventListener('click', (ev) => { if (ev.target === $('decor-overlay')) { h.sfx('click'); close(); } });

    const api = {
      render, open: openShop, close, buy,
      isOpen: () => open,
      state: () => ({ open, from, tab, pick: pick ? pick.kind + ':' + pick.id : null })
    };
    window.__wsShop = api;           // для проверок (tests/ws_acceptance.py, раздел 14)
    return api;
  }

  window.WsShop = { create, TABS };
})();
