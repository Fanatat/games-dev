// «Последний конвой» — эпизод-прототип на базе game4 («Две крепости»).
// Поход из двух столкновений: подготовить отряд → защитить конвой → выбрать
// ровно одно усиление → второе столкновение → итог похода.
//
// Что здесь и что в остальном коде:
//  • Здесь — настройки боёв/волн/цен/усилений (CONVOY), собственный шаг боя
//    (Convoy.update вместо update() оригинала), экраны похода и отрисовка
//    конвоя. Бой считают те же updateUnits/spawnUnit/dealDamage (entities.js).
//  • Оригинальный update() НЕ вызывается: в нём живут механики, которых в
//    эпизоде быть не должно — «стена крепости» (fortGuard), овертайм, налёты,
//    золотой штраф за копление, адаптивный ИИ, помощь после поражений,
//    мягкий старт, герой, башни/капканы из магазина.
//  • Герой временно исключён (разрешено ТЗ): world.hero.alive = false всегда,
//    updateHero не вызывается, джойстик/кнопки ручной атаки удаляются из DOM.
//  • Золото за убийства не начисляется — доход только по времени, поэтому
//    усиление «Снабжение» не смешивается с наградой за убийства и сравнение
//    трёх усилений на одинаковых волнах честное.
'use strict';

const CONVOY = {
  startGold: 60,          // стартовое золото в каждом столкновении (перед боем 2 — сбрасывается к нему)
  incomeBase: 6,          // золота в секунду (копится непрерывно, не тиками)
  hp: 600,                // прочность конвоя без усилений
  warnSec: 3,             // предупреждение о волне за N секунд
  spawnGap: 0.45,         // пауза между врагами внутри одной волны, с
  finaleSec: 1.6,         // задержка между концом боя и следующим экраном, с
  classes: ['infantry', 'archer', 'heavy'], // порядок карточек = клавиши 1–3
  // Названия, роль и подсказка карточек. Цена, здоровье и урон — из UNIT_TYPES (data.js).
  labels: {
    infantry: { name: 'Боец', role: 'Ближний бой', tip: 'Дёшев. Бьёт стрелков в 1,5 раза сильнее' },
    archer: { name: 'Стрелок', role: 'Дальний бой', tip: 'Бьёт издалека, но хрупкий' },
    heavy: { name: 'Защитник', role: 'Прочный', tip: 'Держит удар, медленный. Стрелы бьют его слабее' },
  },
  // Свои бойцы держат линию перед конвоем, а не бегут к точке появления врага (entities.js, 'idle').
  // Ключ — роль юнита из UNIT_TYPES; chase — как далеко за линией они выходят навстречу остановившимся врагам.
  holdLine: { melee: 230, ranged: 170, heavy: 250, default: 230, chase: 260 },
  // Вражеские стрелки, подошедшие к конвою на дальность выстрела + siege, бьют конвой, а не ближайшего бойца (entities.js findTarget).
  siege: 220,
  // Усиления: ровно одно между боями. Значения стартовые (ТЗ п.6).
  boosts: {
    supply: { id: 'supply', name: 'Снабжение', big: '+25%', short: '+25% золота в секунду', incomeMult: 1.25 },
    fort: { id: 'fort', name: 'Укрепление', big: '+25%', short: '+25% прочности конвоя', hpMult: 1.25 },
    offense: { id: 'offense', name: 'Наступление', big: '+20%', short: '+20% урона ваших бойцов', dmgMult: 1.2 },
  },
  boostOrder: ['supply', 'fort', 'offense'],
  // Порядок появления внутри волны: тяжёлые первыми, стрелки — позади строя.
  spawnOrder: ['heavy', 'spear', 'infantry', 'archer'],
  battles: [
    {
      n: 1, title: 'Засада у брода', age: 'stone',
      story: 'Разбойники ждут у переправы. Конвой стоит на месте — защитите его. Золото копится само: тратьте его на отряд, пока враг не подошёл.',
      waves: [
        { at: 10, units: { infantry: 3 } },
        { at: 35, units: { infantry: 3 } },
        { at: 60, units: { infantry: 3, archer: 1 } },
        { at: 85, units: { infantry: 4, archer: 1 } },
      ],
    },
    {
      n: 2, title: 'Переправа', age: 'bronze',
      story: 'Конвой прошёл брод, но на переправе враг сильнее: копейщики и тяжёлые бойцы. Одинаковые волны для любого усиления.',
      waves: [
        { at: 10, units: { infantry: 3, archer: 1 } },
        { at: 32, units: { spear: 3, infantry: 2 } },
        { at: 56, units: { infantry: 4, archer: 2 } },
        { at: 80, units: { heavy: 2, infantry: 3 } },
        { at: 105, units: { heavy: 2, archer: 3, infantry: 4 } },
      ],
    },
  ],
};

const ENEMY_NAMES = { infantry: ['боец', 'бойца', 'бойцов'], spear: ['копейщик', 'копейщика', 'копейщиков'], archer: ['лучник', 'лучника', 'лучников'], heavy: ['тяжёлый', 'тяжёлых', 'тяжёлых'] };
function ruPlural(n, forms) {
  const a = n % 100, b = n % 10;
  if (a >= 11 && a <= 14) return forms[2];
  return b === 1 ? forms[0] : (b >= 2 && b <= 4) ? forms[1] : forms[2];
}

const Convoy = (() => {
  const $ = (id) => document.getElementById(id);
  const RUNS_KEY = 'lastconvoy_runs_v1';
  let run = null;       // текущий поход: { id, boost, boostApplied, results, finished }
  let runSeq = 0;
  let cardEls = null;
  const hudCache = {};

  const unitCost = (id) => ageUnitCost(id, 0);
  const fmt = (v) => (Math.round(v * 10) / 10).toString().replace('.', ',');
  const battleDef = (n) => CONVOY.battles[n - 1];
  const boostOf = () => (run && run.boost ? CONVOY.boosts[run.boost] : null);

  // ------------------------------------------------------------ состояние боя
  function incomeRate(m) {
    return CONVOY.incomeBase * (m.convoy.boost && m.convoy.boost.incomeMult ? m.convoy.boost.incomeMult : 1);
  }
  function waveText(units) {
    return CONVOY.spawnOrder.filter(t => units[t]).map(t => `${units[t]} ${ruPlural(units[t], ENEMY_NAMES[t])}`).join(', ');
  }
  function enemiesAlive(world) {
    let n = 0;
    for (const u of world.units) if (u.team === 'enemy' && u.state !== 'dead') n++;
    return n;
  }

  // Создаёт match/world боя n. Усиление применяется здесь — один раз на бой 2
  // (счётчик run.boostApplied проверяют тесты).
  function setupMatch(n, opts = {}) {
    const def = battleDef(n);
    const boost = n === 2 ? boostOf() : null;
    const baseHp = CONVOY.hp;
    const maxHp = Math.round(baseHp * (boost && boost.hpMult ? boost.hpMult : 1));
    const mission = { id: n, chapterId: 1, age: def.age, title: def.title };
    const world = {
      units: [], projectiles: [],
      playerCore: makeCore('player', ARENA.playerCoreX + ARENA.coreWidth, maxHp),
      enemyCore: makeCore('enemy', ARENA.enemyCoreX, 1), // источник врагов: не цель, не рисуется
      hero: makeHero('player'),
      towers: [], enemyTowers: [], traps: [],
      ageStep: { player: 0, enemy: 0 },
      teamAge: { player: def.age, enemy: def.age },
      xp: { player: 0, enemy: 0 },
      volleyShells: [], volleyZone: null,
      spawnCount: { player: 0, enemy: 0 },
      playerCoreDmgMult: 1, enemyAliveCap: 0, fortGuard: null, enemySiege: CONVOY.siege,
      fortHitAt: -Infinity, fortHitDps: 0, fortAbsorbed: 0, clock: 0,
      enemyCoreDmgTakenMult: 1, enemyTowerDmgMult: 1, heroRangedTaken: 0,
      convoy: true,                                  // entities.js: источник врагов не цель
      holdLine: CONVOY.holdLine,                      // entities.js: свои держат линию
      playerDmgMult: boost && boost.dmgMult ? boost.dmgMult : 1, // entities.js spawnUnit
    };
    world.hero.alive = false;
    world.hero.respawnTimer = 1e9;
    if (boost) run.boostApplied += 1;
    const m = {
      missionIndex: n - 1, mission, age: AGES[def.age], world,
      gold: CONVOY.startGold, incomeLevel: 0, incomeAcc: 0, unlockedUnits: CONVOY.classes,
      shake: { mag: 0, x: 0, y: 0 }, particles: [],
      clouds: Array.from({ length: 5 }, () => ({ x: Math.random() * ARENA.width, y: 18 + Math.random() * 55, scale: 0.6 + Math.random() * 0.9, speed: 5 + Math.random() * 9 })),
      resolved: false, elapsed: 0, resultElapsed: 0, farmPulse: 0, shopKills: 0,
      countdown: 0, enemyAge: AGES[def.age], ageBanner: null, ageFlash: 0, bgWarmed: true,
      buffsTriggered: new Set(), currentBattleTrack: null,
      convoy: {
        battle: n, def, boost, baseHp, maxHp,
        waveIdx: 0, queue: [], warned: -1, alertUntil: 0,
        finaleT: -1, outcome: null, headless: !!opts.headless, // headless — симуляции без экранов (tests/convoy_balance.py)
        stats: { bought: { infantry: 0, archer: 0, heavy: 0 }, spent: 0, kills: 0, lost: 0, minHp: maxHp },
      },
    };
    world.onCoreHit = (core) => {
      if (!match || match.world !== world) return;
      shakeScreen(match, 2.5);
      VFX.burst(match, 'chip', core.x + 10, -26, 6, { speed: 130, spread: Math.PI * 1.2, dir: -Math.PI / 2, life: 0.6, size: 3, color: ART.woodChip, gravity: 320, jitter: 22 });
    };
    world.onCoreDestroyed = () => { if (match && match.world === world) finishBattle(false); };
    world.onUnitDeath = (u) => {
      if (match && match.world === world) {
        if (u.team === 'enemy') match.convoy.stats.kills++; else match.convoy.stats.lost++;
        VFX.unitDeath(match, u.x);
      }
    };
    world.onImpact = (x) => VFX.impact(match, x);
    world.onHit = (ref, role) => {
      ref.lastHitRole = role;
      if (role !== 'ranged') VFX.meleeHit(match, ref.x, -34, ref.team !== 'player');
      if (role === 'heavy') VFX.burst(match, 'dust', ref.x, -2, 5, { speed: 90, spread: Math.PI * 0.8, dir: -Math.PI / 2, life: 0.5, size: 4, color: ART.dust, gravity: 40, jitter: 10 });
    };
    return m;
  }

  // ------------------------------------------------------------ шаг боя
  function update(dt) {
    const m = match, C = m.convoy, w = m.world;
    if (!C.outcome) m.elapsed += dt;
    w.clock += dt;
    // деньги: непрерывный доход, только пока бой идёт
    if (!C.outcome) m.gold += incomeRate(m) * dt;

    // волны: выпуск и предупреждение
    if (!C.outcome) {
      const waves = C.def.waves;
      const next = waves[C.waveIdx];
      if (next) {
        if (C.warned < C.waveIdx && next.at - m.elapsed <= CONVOY.warnSec) {
          C.warned = C.waveIdx;
          C.alertUntil = next.at + 1.5;
          SFX.alarm();
        }
        if (m.elapsed >= next.at) {
          let i = 0;
          for (const t of CONVOY.spawnOrder) {
            for (let k = 0; k < (next.units[t] || 0); k++) C.queue.push({ at: m.elapsed + (i++) * CONVOY.spawnGap, type: t });
          }
          C.waveIdx++;
        }
      }
      while (C.queue.length && C.queue[0].at <= m.elapsed) spawnUnit(w, 'enemy', C.queue.shift().type);
    }

    updateUnits(w, dt, () => {});
    if (w.playerCore.hp < C.stats.minHp) C.stats.minHp = w.playerCore.hp;
    updateParticles(m, dt);
    updateShake(m, dt);
    for (const c of m.clouds) { c.x += c.speed * dt; if (c.x > ARENA.width + 90) c.x = -90; }
    if (m.ageBanner) { m.ageBanner.t += dt; if (m.ageBanner.t >= m.ageBanner.life) m.ageBanner = null; }

    // победа: все волны выпущены, очередь пуста, врагов нет, прочность > 0
    if (!C.outcome && C.waveIdx >= C.def.waves.length && !C.queue.length && enemiesAlive(w) === 0 && w.playerCore.hp > 0) finishBattle(true);

    if (C.outcome) {
      C.finaleT += dt;
      if (C.finaleT >= CONVOY.finaleSec && !C.advanced) { C.advanced = true; if (!C.headless) afterBattle(); }
    }
    if (!C.headless) updateHud();
  }

  // Результат боя фиксируется ровно один раз (флаг m.resolved).
  function finishBattle(win) {
    const m = match;
    if (!m || m.resolved) return;
    m.resolved = true;
    const C = m.convoy;
    C.outcome = win ? 'win' : 'lose';
    C.finaleT = 0;
    const hp = Math.max(0, Math.ceil(m.world.playerCore.hp));
    run.results[C.battle - 1] = {
      battle: C.battle, win, sec: Math.round(m.elapsed), hp, maxHp: C.maxHp,
      bought: Object.assign({}, C.stats.bought), spent: C.stats.spent, kills: C.stats.kills, lost: C.stats.lost,
    };
    if (C.headless) return;
    m.ageBanner = { text: win ? 'Столкновение выиграно!' : 'Конвой разбит', t: 0, life: CONVOY.finaleSec, own: win };
    MUSIC.play(win ? 'victory_sting' : 'defeat_sting');
  }

  function afterBattle() {
    const C = match.convoy;
    if (C.outcome === 'win' && C.battle === 1) showPick();
    else showFinal();
  }

  // ------------------------------------------------------------ покупка
  function canAct() { return !!(match && match.convoy && screen === 'match' && !match.resolved); }
  function buy(typeId) {
    if (!canAct() || !CONVOY.classes.includes(typeId)) return false;
    const cost = unitCost(typeId);
    if (match.gold < cost) { deny(typeId); return false; }
    match.gold -= cost;
    const u = spawnUnit(match.world, 'player', typeId);
    const s = match.convoy.stats;
    // бойцы встают в линии не в одну точку: смещение места остановки (entities.js, holdOff)
    if (u) u.holdOff = (s.bought.infantry + s.bought.archer + s.bought.heavy) % 5 * 16;
    s.bought[typeId]++; s.spent += cost;
    pulseCard(typeId, 'bought');
    return true;
  }
  function buyIndex(i) { const id = CONVOY.classes[i]; return id ? buy(id) : false; }
  function deny(typeId) {
    SFX.buyDenied();
    pulseCard(typeId, 'denied');
  }
  function pulseCard(typeId, cls) {
    const el = !match.convoy.headless && cardEls && cardEls[typeId];
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 260);
  }

  // ------------------------------------------------------------ HUD боя
  function setText(id, v) {
    if (hudCache[id] === v) return;
    hudCache[id] = v;
    const el = $(id); if (el) el.textContent = v;
  }
  function buildCards() {
    const box = $('cvCards');
    box.innerHTML = '';
    cardEls = {};
    CONVOY.classes.forEach((id, i) => {
      const t = UNIT_TYPES[id], L = CONVOY.labels[id];
      const dmgMult = match.world.playerDmgMult || 1;
      const dmg = Math.round(t.dmg * dmgMult);
      const btn = document.createElement('button');
      btn.className = 'cv-card';
      btn.dataset.unit = id;
      btn.setAttribute('aria-label', `${L.name}, ${L.role}, цена ${unitCost(id)}`);
      btn.innerHTML =
        `<canvas class="cv-card-icon" width="80" height="88"></canvas>` +
        `<span class="cv-card-body"><span class="cv-card-name">${L.name}</span>` +
        `<span class="cv-card-role">${L.role}</span>` +
        `<span class="cv-card-stats">HP ${t.hp} · урон <b${dmgMult > 1 ? ' class="up"' : ''}>${dmg}</b></span></span>` +
        `<span class="cv-card-cost"><i class="gold-dot"></i>${unitCost(id)}</span>` +
        `<span class="tool-key">${i + 1}</span>`;
      btn.addEventListener('click', () => { buy(id); btn.blur(); });
      box.appendChild(btn);
      drawUnitIcon(btn.querySelector('canvas'), t, match.age);
      cardEls[id] = btn;
    });
  }
  function updateHud() {
    const m = match; if (!m || !m.convoy) return;
    const C = m.convoy, w = m.world;
    const hp = Math.max(0, Math.ceil(w.playerCore.hp));
    const frac = Math.max(0, w.playerCore.hp / w.playerCore.maxHp);
    const fill = $('cvHpFill');
    fill.style.width = (frac * 100).toFixed(1) + '%';
    fill.classList.toggle('low', frac < 0.35);
    setText('cvHpText', `${hp}/${C.maxHp}`);
    setText('cvEnc', `Столкновение ${C.battle}/2`);
    const total = C.def.waves.length;
    const inPrep = C.waveIdx === 0 && !C.outcome;
    const next = C.def.waves[C.waveIdx];
    setText('cvWaveLabel', inPrep ? 'Подготовка' : `Волна ${Math.min(C.waveIdx, total)}/${total}`);
    let timer = '';
    if (!C.outcome) {
      if (next) timer = `следующая через ${Math.max(0, Math.ceil(next.at - m.elapsed))} с`;
      else timer = enemiesAlive(w) + C.queue.length > 0 ? 'добейте врагов' : '';
    }
    setText('cvWaveTimer', timer);
    const dots = $('cvDots');
    if (dots.childElementCount !== total) {
      dots.innerHTML = '';
      for (let i = 0; i < total; i++) dots.appendChild(document.createElement('i'));
    }
    for (let i = 0; i < total; i++) {
      const d = dots.children[i];
      d.classList.toggle('done', i < C.waveIdx);
      d.classList.toggle('next', i === C.waveIdx && !C.outcome);
    }
    // Предупреждение: что именно идёт
    const alert = $('cvAlert');
    const warnWave = C.warned >= 0 ? C.def.waves[C.warned] : null;
    const showAlert = !!(warnWave && !C.outcome && m.elapsed < C.alertUntil);
    alert.classList.toggle('hidden', !showAlert);
    if (showAlert) {
      const left = Math.max(0, Math.ceil(warnWave.at - m.elapsed));
      setText('cvAlertText', left > 0 ? `Волна ${C.warned + 1} через ${left} с: ${waveText(warnWave.units)}` : `Волна ${C.warned + 1} идёт: ${waveText(warnWave.units)}`);
    }
    // Золото
    setText('cvGold', String(Math.floor(m.gold)));
    setText('cvIncome', `+${fmt(incomeRate(m))}/с`);
    // Бейдж усиления
    const badge = $('cvBoostBadge');
    badge.classList.toggle('hidden', !C.boost);
    if (C.boost) setText('cvBoostBadge', `${C.boost.name}: ${C.boost.short}`);
    // Карточки
    if (cardEls) for (const id of CONVOY.classes) cardEls[id].classList.toggle('disabled', m.gold < unitCost(id));
  }

  // ------------------------------------------------------------ экраны
  const SCREENS = { cmenu: 'cvMenu', cbrief: 'cvBrief', cpick: 'cvPick', cresult: 'cvResult' };
  function onScreen(name) {
    for (const [k, id] of Object.entries(SCREENS)) $(id).classList.toggle('hidden', name !== k);
    $('cvHud').classList.toggle('hidden', !(name === 'match' || name === 'paused'));
    if (name in SCREENS && MUSIC.current() !== 'menu') MUSIC.play('menu');
  }

  function newRun() {
    run = { id: ++runSeq, boost: null, boostApplied: 0, results: [], finished: false };
    match = null;
    return run;
  }
  function startRun() {
    newRun();
    showBrief(1);
  }
  function showBrief(n) {
    const def = battleDef(n), b = boostOf();
    $('cvBriefNum').textContent = `Столкновение ${n}/2`;
    $('cvBriefTitle').textContent = def.title;
    $('cvBriefStory').textContent = def.story;
    const kinds = new Set();
    for (const w of def.waves) for (const t of Object.keys(w.units)) kinds.add(t);
    $('cvBriefWaves').textContent = `Волн: ${def.waves.length}. Враги: ${CONVOY.spawnOrder.filter(t => kinds.has(t)).map(t => ENEMY_NAMES[t][2]).join(', ')}.`;
    const bl = $('cvBriefBoost');
    bl.classList.toggle('hidden', !(n === 2 && b));
    if (n === 2 && b) bl.textContent = `Ваше усиление: ${b.name} — ${b.short}.`;
    const rows = CONVOY.classes.map(id => {
      const t = UNIT_TYPES[id], L = CONVOY.labels[id];
      return `<div class="cv-brief-row"><b>${L.name}</b> <span>${L.role}</span> <span class="cv-brief-cost"><i class="gold-dot"></i>${unitCost(id)}</span><em>HP ${t.hp}, урон ${t.dmg}. ${L.tip}.</em></div>`;
    }).join('');
    $('cvBriefClasses').innerHTML = rows;
    $('cvBriefGo').dataset.battle = String(n);
    showScreen('cbrief');
  }
  function startBattle(n, opts = {}) {
    match = setupMatch(n, opts);
    if (!opts.headless) {
      buildCards();
      updateHud();
      hudCache.cvBoostBadge = undefined;
      showScreen('match');
      match.currentBattleTrack = pickNextBattleTrack(null);
      MUSIC.play(match.currentBattleTrack, { force: true });
    }
    return match;
  }

  function showPick() {
    const r = run.results[0];
    $('cvPickSub').textContent = `Конвой выстоял: прочность ${r.hp}/${r.maxHp}. Выберите одно усиление — оно сработает один раз и останется до конца похода.`;
    const box = $('cvPickCards');
    box.innerHTML = '';
    const t = UNIT_TYPES.infantry;
    const lines = {
      supply: `Золото копится быстрее: ${fmt(CONVOY.incomeBase)} → ${fmt(CONVOY.incomeBase * CONVOY.boosts.supply.incomeMult)} в секунду`,
      fort: `Конвой прочнее: ${CONVOY.hp} → ${Math.round(CONVOY.hp * CONVOY.boosts.fort.hpMult)} прочности`,
      offense: `Ваши бойцы бьют сильнее: урон ×${fmt(CONVOY.boosts.offense.dmgMult)} (боец ${t.dmg} → ${Math.round(t.dmg * CONVOY.boosts.offense.dmgMult)})`,
    };
    for (const id of CONVOY.boostOrder) {
      const b = CONVOY.boosts[id];
      const btn = document.createElement('button');
      btn.className = 'cv-pick-card';
      btn.dataset.boost = id;
      btn.innerHTML = `<span class="cv-pick-big">${b.big}</span><span class="cv-pick-name">${b.name}</span><span class="cv-pick-short">${b.short}</span><span class="cv-pick-line">${lines[id]}</span>`;
      btn.addEventListener('click', () => choose(id));
      box.appendChild(btn);
    }
    showScreen('cpick');
  }
  // Ровно одно усиление: повторное нажатие или второй вызов игнорируются.
  function choose(id) {
    if (!run || run.boost || !CONVOY.boosts[id] || screen !== 'cpick') return false;
    run.boost = id;
    SFX.upgrade();
    for (const el of $('cvPickCards').children) { el.disabled = true; el.classList.toggle('chosen', el.dataset.boost === id); }
    showBrief(2);
    return true;
  }

  function showFinal() {
    if (!run || run.finished) return;
    run.finished = true;
    const [r1, r2] = run.results;
    const win = !!(r1 && r1.win && r2 && r2.win);
    const b = boostOf();
    $('cvResultTitle').textContent = win ? 'Конвой доставлен!' : 'Конвой уничтожен';
    $('cvResultTitle').className = win ? 'win' : 'lose';
    $('cvResultSub').textContent = win
      ? 'Поход завершён. Попробуйте другое усиление — враг в бою 2 будет тем же.'
      : (r1 && !r1.win ? 'Конвой разбит уже в первом столкновении.' : 'Конвой разбит на переправе. Попробуйте другое усиление или другой состав отряда.');
    $('cvResultBoost').textContent = b ? `Усиление: ${b.name} — ${b.short}` : 'Усиление не выбрано';
    const rowOf = (r) => {
      if (!r) return '';
      const bought = CONVOY.classes.map(id => `${CONVOY.labels[id].name} ${r.bought[id]}`).join(' · ');
      return `<div class="cv-res-row ${r.win ? 'win' : 'lose'}"><b>Столкновение ${r.battle}: ${r.win ? 'победа' : 'поражение'}</b>` +
        `<span>${r.sec} с · конвой ${r.hp}/${r.maxHp}</span><span>${bought} · потрачено ${r.spent}</span></div>`;
    };
    $('cvResultRows').innerHTML = rowOf(r1) + rowOf(r2);
    saveRunLog(win);
    showScreen('cresult');
  }
  function saveRunLog(win) {
    try {
      const log = JSON.parse(localStorage.getItem(RUNS_KEY) || '[]');
      log.push({ ts: Date.now(), boost: run.boost, win, results: run.results });
      localStorage.setItem(RUNS_KEY, JSON.stringify(log.slice(-50)));
    } catch (e) { /* журнал похода — удобство для тестов, без него игра работает */ }
  }

  function toMenu() { match = null; showScreen('cmenu'); }

  // ------------------------------------------------------------ отрисовка конвоя
  function drawWagon(wx, i, s, hpFrac, t, boostId) {
    const age = match.age;
    ctx.save();
    ctx.translate(wx, ARENA.groundY);
    ctx.scale(s, s);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const ink = 'rgba(26,18,10,.85)';
    // колёса
    for (const dx of [-13, 13]) {
      ctx.fillStyle = age.woodDark; ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(dx, -8, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.2;
      for (let a = 0; a < 3; a++) { const an = a * Math.PI / 3 + 0.3; ctx.beginPath(); ctx.moveTo(dx - Math.cos(an) * 7, -8 - Math.sin(an) * 7); ctx.lineTo(dx + Math.cos(an) * 7, -8 + Math.sin(an) * 7); ctx.stroke(); }
    }
    // кузов
    ctx.fillStyle = age.woodLight; ctx.strokeStyle = ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-23, -26, 46, 13); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1;
    for (let x = -14; x < 23; x += 12) { ctx.beginPath(); ctx.moveTo(x, -26); ctx.lineTo(x, -13); ctx.stroke(); }
    // укрепление: накладные доски и заклёпки
    if (boostId === 'fort') {
      ctx.fillStyle = age.stone; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.rect(-25, -28, 50, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(-25, -17, 50, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e8e2d0';
      for (let x = -21; x <= 21; x += 14) { ctx.beginPath(); ctx.arc(x, -25.5, 1.3, 0, Math.PI * 2); ctx.fill(); }
    }
    // тент
    const torn = hpFrac < 0.5;
    ctx.fillStyle = hpFrac < 0.3 ? '#bba98a' : '#d9c9a3'; ctx.strokeStyle = ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-21, -26); ctx.quadraticCurveTo(-18, -50, 0, -50); ctx.quadraticCurveTo(18, -50, 21, -26); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(80,60,30,.35)'; ctx.lineWidth = 1.2;
    for (const x of [-9, 0, 9]) { ctx.beginPath(); ctx.moveTo(x * 0.9, -26); ctx.quadraticCurveTo(x * 1.05, -44, x * 0.7, -49); ctx.stroke(); }
    if (torn) { ctx.fillStyle = 'rgba(26,18,10,.75)'; ctx.beginPath(); ctx.moveTo(4, -46); ctx.lineTo(11, -38); ctx.lineTo(6, -36); ctx.closePath(); ctx.fill(); }
    // снабжение: мешки на кузове
    if (boostId === 'supply') {
      ctx.fillStyle = '#e0c27a'; ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      for (const [x, y] of [[-15, -29], [-8, -30]]) { ctx.beginPath(); ctx.ellipse(x, y, 5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    }
    // стрелы в тенте/кузове по мере потерь
    ctx.strokeStyle = '#6a4a28'; ctx.lineWidth = 1.6;
    const arrows = hpFrac < 0.8 ? (hpFrac < 0.55 ? (hpFrac < 0.3 ? 3 : 2) : 1) : 0;
    for (let a = 0; a < arrows; a++) {
      const ax = 6 + a * 7 + i * 3, ay = -22 - (a % 2) * 4;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + 11, ay - 8); ctx.stroke();
      ctx.strokeStyle = '#f2e6cf'; ctx.beginPath(); ctx.moveTo(ax + 9, ay - 6.5); ctx.lineTo(ax + 12, ay - 11); ctx.stroke(); ctx.strokeStyle = '#6a4a28';
    }
    // флаг на первой повозке; в бою с усилением «Наступление» — красный вымпел
    if (i === 0) {
      ctx.strokeStyle = age.woodDark; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-17, -26); ctx.lineTo(-17, -66); ctx.stroke();
      const wave = Math.sin(t * 3.2) * 3;
      ctx.fillStyle = boostId === 'offense' ? '#d8402a' : ART.flags.player; ctx.strokeStyle = ink; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-17, -66); ctx.quadraticCurveTo(-8, -68 + wave, 2, -62 + wave); ctx.quadraticCurveTo(-8, -60 + wave, -17, -56); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
  function drawStructures() {
    const m = match, core = m.world.playerCore, C = m.convoy;
    const hpFrac = Math.max(0, core.hp / core.maxHp);
    const t = performance.now() / 1000;
    const flash = core.hitFlash > 0 ? core.hitFlash : 0;
    if (flash > 0) core.hitFlash = Math.max(0, flash - 0.06);
    const s = Math.max(1, Math.min(1.35, VIEW.fig));
    const boostId = C.boost ? C.boost.id : null;
    drawWagon(26, 0, s, hpFrac, t, boostId);
    drawWagon(74, 1, s, hpFrac, t, boostId);
    if (flash > 0) { ctx.save(); ctx.globalAlpha = flash * 0.5; ctx.fillStyle = '#fff'; ctx.fillRect(4, ARENA.groundY - 56 * s, 92, 56 * s); ctx.restore(); }
    // дым на разбитом конвое
    if (hpFrac < 0.3 && core.hp > 0) drawSmoke(50, ARENA.groundY - 40 * s, performance.now(), 3, 'rgba(60,50,45,.55)');
    // шкала прочности над конвоем
    const bw = 94, bh = 7, bx = 4, by = ARENA.groundY - 78 * s;
    ctx.save();
    ctx.fillStyle = 'rgba(26,18,10,.7)'; ctx.fillRect(bx - 1.5, by - 1.5, bw + 3, bh + 3);
    ctx.fillStyle = hpFrac < 0.35 ? '#e0503a' : hpFrac < 0.6 ? '#e8b845' : '#5fc46a';
    ctx.fillRect(bx, by, bw * hpFrac, bh);
    ctx.restore();
  }
  // Сцена меню/брифинга: те же повозки вместо крепостей и героя.
  function drawMenuWagons(t) {
    const fake = { world: { playerCore: { hp: 1, maxHp: 1, hitFlash: 0 } }, age: menuSceneAge() };
    const saved = match;
    match = fake;
    try { drawWagon(26, 0, Math.max(1, Math.min(1.35, VIEW.fig)), 1, t, null); drawWagon(74, 1, Math.max(1, Math.min(1.35, VIEW.fig)), 1, t, null); }
    finally { match = saved; }
  }

  // ------------------------------------------------------------ запуск
  function boot() {
    document.body.classList.add('convoy');
    // Прямое управление героем отключено: убираем джойстик, тач-кнопки героя и старый HUD из DOM.
    for (const id of ['joyBase', 'touchAttack', 'touchSpecial', 'touchPickaxe', 'touchCry', 'btnBuyback', 'heroMini', 'heroReviveBox']) {
      const el = $(id); if (el) el.remove();
    }
    $('cvPause').addEventListener('click', () => { SFX.click(); togglePause(); });
    $('cvMenuPlay').addEventListener('click', () => { SFX.unlock(); SFX.click(); startRun(); });
    $('cvBriefGo').addEventListener('click', (e) => { SFX.click(); startBattle(Number(e.currentTarget.dataset.battle)); });
    $('cvResultAgain').addEventListener('click', () => { SFX.click(); startRun(); });
    $('cvResultMenu').addEventListener('click', () => { SFX.click(); toMenu(); });
    // Потеря фокуса и уход со вкладки ставят бой на паузу; продолжить — только игроку.
    window.addEventListener('blur', () => { if (screen === 'match') showScreen('paused'); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && screen === 'match') showScreen('paused'); });
    showScreen('cmenu');
  }

  return {
    boot, startRun, newRun, showBrief, startBattle, setupMatch, update, updateHud, buy, buyIndex, choose,
    toMenu, onScreen, drawStructures, drawMenuWagons, finishBattle,
    get run() { return run; }, canAct, waveText,
  };
})();
