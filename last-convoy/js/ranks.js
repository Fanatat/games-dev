'use strict';
// Рейтинг «Последнего конвоя» (сборка 15, вариант «Б» основателя 13.10): два топа на своём сервере студии
// (server/convoy_ranks): «Казна» — золото, довезённое доставками за всё время (пал конвой — золото пропало),
// «Походы» — сколько раз конвой доставлен. В ВК игрок узнаётся по подписанной строке запуска (vk_* и sign),
// имя и аватарку сервер берёт у ВК сам. Локально и на стенде вне ВК — выдуманный топ с пометкой «демо»
// (PLATFORM.ranksMode). Доставка сначала ложится в очередь (localStorage) и уходит на сервер, когда есть связь:
// сервер принимает её один раз (по id), поэтому повтор после обрыва ничего не удваивает.
const RANKS = (() => {
  const CFG = {
    url: 'https://api.vanatat.ru/convoy/v1',
    top: 50,
    timeoutMs: 6000,
    cacheMs: 20000,   // топ не перезапрашивается чаще (переключение вкладок туда-обратно)
    queueMax: 20,
  };
  const Q_KEY = 'lastconvoy_ranks_q_v1';
  const BOARDS = {
    gold: { name: 'Казна', hint: 'Золото, довезённое до конца пути. Пал конвой — золото пропало.', unit: 'gold' },
    runs: { name: 'Походы', hint: 'Сколько раз конвой доставлен до конца пути.', unit: 'runs' },
  };
  const $ = (id) => document.getElementById(id);
  const mode = () => (typeof PLATFORM !== 'undefined' && PLATFORM.ranksMode) ? PLATFORM.ranksMode() : null;
  const devQ = () => (typeof PLATFORM !== 'undefined' && PLATFORM.devQuery && PLATFORM.devQuery()) || null;
  const prog = () => (typeof progress !== 'undefined' ? progress : null);
  let board = 'gold', flushing = null, opened = false, seq = 0;
  const cache = {};   // board -> { at, data }

  // ------------------------------------------------------------ очередь доставок
  function readQ() {
    try { const q = JSON.parse(localStorage.getItem(Q_KEY) || '[]'); return Array.isArray(q) ? q : []; } catch (e) { return []; }
  }
  function writeQ(q) {
    try { localStorage.setItem(Q_KEY, JSON.stringify(q.slice(-CFG.queueMax))); } catch (e) { /* без хранилища — только эта сессия */ }
  }
  function newId() {
    const a = new Uint8Array(12);
    try { crypto.getRandomValues(a); } catch (e) { for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256); }
    return Date.now().toString(36) + '_' + Array.from(a, (b) => (b % 36).toString(36)).join('');
  }

  function request(path, opts = {}) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctl && setTimeout(() => ctl.abort(), CFG.timeoutMs);
    const headers = { 'X-Launch-Params': PLATFORM.launchParams() };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(CFG.url + path, {
      method: opts.body ? 'POST' : 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: ctl ? ctl.signal : undefined, credentials: 'omit', cache: 'no-store',
    }).then((r) => r.json().catch(() => ({})).then((data) => ({ status: r.status, data })))
      .catch(() => ({ status: 0, data: {} }))
      .finally(() => { if (timer) clearTimeout(timer); });
  }

  // Отправить очередь по одной. 200 и отказ сервера (4xx, кроме 429) — запись уходит из очереди;
  // нет связи, 429, 5xx — остаётся до следующего раза. Возвращает ответ на последнюю принятую доставку.
  function flush() {
    if (mode() !== 'live') return Promise.resolve(null);
    if (flushing) return flushing;
    flushing = (async () => {
      let last = null;
      for (;;) {
        const q = readQ();
        if (!q.length) break;
        const it = q[0];
        const r = await request('/runs', { body: { id: it.id, level: it.level, gold: it.gold } });
        const keep = r.status === 0 || r.status === 429 || r.status >= 500;
        if (keep) break;
        writeQ(readQ().filter((x) => x.id !== it.id));
        if (r.status === 200) { last = r.data; delete cache.gold; delete cache.runs; }
      }
      return last;
    })().finally(() => { flushing = null; });
    return flushing;
  }

  // Доставка конвоя: золото в казну (личный счёт), в ВК — на сервер. Ответ — { gold, runs, counted, place }
  // или null (не в ВК, нет связи — уйдёт позже).
  function delivered(level, gold) {
    gold = Math.max(0, Math.floor(gold || 0));
    const p = prog();
    if (p) { p.cvTreasury = (p.cvTreasury || 0) + gold; if (typeof saveProgress === 'function') saveProgress(p); }
    delete cache.gold; delete cache.runs;
    const m = mode();
    if (m === 'demo') return Promise.resolve(demoMe());
    if (m !== 'live') return Promise.resolve(null);
    const q = readQ();
    q.push({ id: newId(), level, gold, ts: Date.now() });
    writeQ(q);
    return flush();
  }

  // ------------------------------------------------------------ демо (локально и стенд)
  const DEMO = [
    ['Ратибор К.', 48210, 41], ['Злата М.', 31570, 33], ['Ярослав Б.', 24880, 27], ['Милена С.', 19340, 22],
    ['Остап Г.', 15020, 18], ['Всеслав Д.', 12260, 15], ['Дарина Л.', 9870, 12], ['Богдан Т.', 7610, 10],
    ['Есения Р.', 5930, 8], ['Мирон П.', 4480, 7], ['Любава Н.', 3350, 5], ['Тихон Ж.', 2410, 4],
    ['Вера Ф.', 1700, 3], ['Глеб Ш.', 1120, 2], ['Ульяна О.', 690, 2], ['Савва Е.', 380, 1],
  ];
  function myLocal() {
    const p = prog() || {};
    const runs = Object.values(p.cvBest || {}).reduce((a, b) => a + ((b && b.wins) || 0), 0);
    return { gold: p.cvTreasury || 0, runs };
  }
  function demoBoard(b) {
    const me = myLocal()[b], q = devQ(), k = b === 'gold' ? 1 : 2;
    if (q && q.get('ranks') === 'empty') return { board: b, top: me > 0 ? [{ id: 0, name: 'Ты', photo: '', value: me, me: true }].map((r, i) => ({ ...r, place: i + 1 })) : [], me: me > 0 ? { place: 1, value: me } : null, players: me > 0 ? 1 : 0, demo: true };
    const rows = DEMO.map(([name, g, r], i) => ({ id: -1 - i, name, photo: '', value: k === 1 ? g : r }));
    if (me > 0) rows.push({ id: 0, name: 'Ты', photo: '', value: me, me: true });
    rows.sort((a, c) => c.value - a.value || (a.me ? 1 : 0) - (c.me ? 1 : 0));
    rows.forEach((r, i) => { r.place = i + 1; });
    const mine = rows.find((r) => r.me);
    // в демо топ короче, чтобы было видно и «твою строку под списком»
    const top = rows.slice(0, 12);
    return { board: b, top, me: mine ? { place: mine.place, value: mine.value } : null, players: rows.length, demo: true };
  }
  function demoMe() {
    const g = demoBoard('gold'), r = demoBoard('runs'), m = myLocal();
    return { gold: m.gold, runs: m.runs, place: { gold: g.me ? g.me.place : 0, runs: r.me ? r.me.place : 0 }, demo: true };
  }
  function load(b, force) {
    const c = cache[b];
    if (!force && c && Date.now() - c.at < CFG.cacheMs) return Promise.resolve(c.data);
    const m = mode(), q = devQ();
    if (m === 'demo') {
      const how = q && q.get('ranks');
      const wait = how === 'slow' ? 1500 : 250;
      return new Promise((res) => setTimeout(res, wait)).then(() => {
        if (how === 'fail') return { error: 'net' };
        return (cache[b] = { at: Date.now(), data: demoBoard(b) }).data;
      });
    }
    return flush().then(() => request(`/boards/${b}?top=${CFG.top}`)).then((r) => {
      if (r.status === 200 && r.data && Array.isArray(r.data.top)) return (cache[b] = { at: Date.now(), data: r.data }).data;
      if (r.status === 503) return { error: 'soon' };
      if (r.status === 401 || r.status === 403) return { error: 'auth' };
      return { error: 'net' };
    });
  }

  // ------------------------------------------------------------ экран рейтинга
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fmt = (n) => Math.floor(n || 0).toLocaleString('ru-RU');
  const valueHtml = (b, v) => b === 'gold' ? `<i class="gold-dot"></i>${fmt(v)}` : `<svg class="ico"><use href="#i-wagon"/></svg>${fmt(v)}`;
  function avatar(r) {
    const letter = esc((String(r.name || '?').trim()[0] || '?').toUpperCase());
    const hue = Math.abs(Number(r.id) || 0) * 47 % 360;
    const img = /^https:\/\//.test(r.photo || '') ? `<img src="${esc(r.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '';
    return `<span class="cv-rk-ava" style="--h:${hue}"><b>${letter}</b>${img}</span>`;
  }
  function rowHtml(b, r, mine) {
    const medal = r.place <= 3 ? ` m${r.place}` : '';
    return `<li class="cv-rk-row${mine ? ' me' : ''}${medal}"><span class="cv-rk-place">${r.place}</span>${avatar(r)}` +
      `<span class="cv-rk-name">${mine ? 'Ты' : esc(r.name || 'Игрок')}</span><span class="cv-rk-val">${valueHtml(b, r.value)}</span></li>`;
  }
  function setTabs() {
    for (const t of document.querySelectorAll('.cv-ranks-tabs [data-b]')) {
      const on = t.dataset.b === board;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
    }
    $('cvRanksHint').textContent = BOARDS[board].hint;
  }
  function message(text, retry) {
    $('cvRanksBody').innerHTML = `<div class="cv-rk-msg"><p>${text}</p>${retry ? '<button class="menu-btn secondary small" id="cvRanksRetry">Повторить</button>' : ''}</div>`;
    $('cvRanksMe').innerHTML = '';
    if (retry) $('cvRanksRetry').addEventListener('click', (e) => { if (typeof SFX !== 'undefined') SFX.click(); e.currentTarget.blur(); render(true); });
  }
  function render(force) {
    const b = board, my = ++seq;
    setTabs();
    $('cvRanksBody').innerHTML = '<div class="cv-rk-msg"><i class="cv-rk-spin" aria-hidden="true"></i><p>Загрузка…</p></div>';
    $('cvRanksMe').innerHTML = '';
    load(b, force).then((d) => {
      if (my !== seq || !opened) return;   // пока грузилось, переключили вкладку или закрыли
      if (!d || d.error) {
        if (d && d.error === 'soon') message('Рейтинг скоро заработает. Загляни чуть позже.', true);
        else if (d && d.error === 'auth') message('Рейтинг доступен в игре во ВКонтакте.', false);
        else message('Нет связи с рейтингом.', true);
        return;
      }
      // своя строка: в демо помечена me, в ВК — то же место, что сервер вернул в me (места уникальны)
      const me = d.me, isMine = (r) => !!r.me || (!!me && r.place === me.place);
      $('cvRanksBody').innerHTML = d.top.length
        ? `<ol class="cv-rk-list">${d.top.map((r) => rowHtml(b, r, isMine(r))).join('')}</ol>`
        : '<div class="cv-rk-msg"><p>Пока никто не довёз конвой. Будь первым!</p></div>';
      // аватарка не загрузилась — остаётся буква
      for (const img of $('cvRanksBody').querySelectorAll('img')) img.addEventListener('error', () => img.remove(), { once: true });
      const inTop = d.top.some(isMine);
      const players = d.players ? `Игроков в рейтинге: ${fmt(d.players)}` : '';
      $('cvRanksMe').innerHTML = me
        ? (inTop ? `<p class="cv-rk-note">${players}</p>`
          : `<ol class="cv-rk-list mine">${rowHtml(b, { place: me.place, value: me.value, name: 'Ты', id: 0 }, true)}</ol><p class="cv-rk-note">${players}</p>`)
        : `<p class="cv-rk-note">Доставь конвой — и ты в рейтинге.${players ? ' ' + players : ''}</p>`;
      if (d.demo) $('cvRanksMe').insertAdjacentHTML('beforeend', '<p class="cv-rk-demo">демо: в ВК здесь настоящий рейтинг</p>');
      const meLi = $('cvRanksBody').querySelector('.cv-rk-row.me');
      if (meLi && meLi.scrollIntoView) meLi.scrollIntoView({ block: 'nearest' });
    });
  }
  function open() {
    if (!mode()) return;
    opened = true;
    $('cvRanks').classList.remove('hidden');
    render(false);
  }
  function close() {
    opened = false;
    seq++;
    const el = $('cvRanks');
    if (el) el.classList.add('hidden');
  }
  function boot() {
    const btn = $('cvRanksBtn');
    if (!btn) return;
    btn.classList.toggle('hidden', !mode());
    btn.addEventListener('click', (e) => { if (typeof SFX !== 'undefined') SFX.click(); e.currentTarget.blur(); open(); });
    $('cvRanksClose').addEventListener('click', (e) => { if (typeof SFX !== 'undefined') SFX.click(); e.currentTarget.blur(); close(); });
    $('cvRanks').addEventListener('click', (e) => { if (e.target === e.currentTarget) close(); });   // клик мимо карточки
    document.addEventListener('keydown', (e) => { if (opened && e.key === 'Escape') close(); });
    for (const t of document.querySelectorAll('.cv-ranks-tabs [data-b]')) {
      t.addEventListener('click', (e) => {
        if (typeof SFX !== 'undefined') SFX.click();
        e.currentTarget.blur();
        if (board === t.dataset.b) return;
        board = t.dataset.b;
        render(false);
      });
    }
    // доставки прошлой сессии, не дошедшие до сервера
    setTimeout(() => { flush(); }, 1500);
  }

  return {
    boot, open, close, delivered, flush, mode,
    get opened() { return opened; },
    _queue: readQ, _demo: demoBoard, CFG,
  };
})();
