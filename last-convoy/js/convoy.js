// «Последний конвой» — эпизод на базе game4 («Две крепости»).
// Поход-рогалик: конвой идёт через 10 стоянок, на каждой — волна врагов.
// Отбились — выбор одного усиления из трёх карт, переход к следующей стоянке.
// Прочность конвоя и отряд переносятся между стоянками; пал конвой — поход
// окончен, итог и рекорд. Задание: /mnt/disk2/reports/GAME4_КОНВОЙ_ДИАГНОЗ_ДОФАМИН_2026-10-10.md.
//
// Что здесь и что в остальном коде:
//  • Здесь — настройки похода (CONVOY), колода усилений (CONVOY_CARDS), шаг
//    боя (Convoy.update вместо update() оригинала), фазы похода (переход →
//    волна → «отбились» → выбор карты), камнепад, монеты, серии убийств, HUD,
//    итог, журнал попыток и отрисовка конвоя.
//  • Бой считают те же updateUnits/spawnUnit/dealDamage/updateVolley (entities.js).
//    Оригинальный update() НЕ вызывается: «стены крепости», овертайма, налётов,
//    адаптивного ИИ, героя и магазинных башен в эпизоде нет.
//  • Герой исключён: world.hero.alive = false, джойстик и кнопки героя удалены из DOM.
'use strict';

const CONVOY = {
  stops: 10,               // стоянок в походе (= CONVOY.waves.length)
  startGold: 70,
  startSquad: ['infantry', 'infantry'], // отряд на старте похода, сразу на своих местах
  hp: 600,                 // прочность конвоя на старте похода (переносится между стоянками)
  income: 1.5,             // золота в секунду — только пока идёт волна
  killShare: 0.25,         // награда за убийство: доля цены врага…
  killGrowth: 0.05,        // …+5 % за каждую следующую стоянку
  clearBonus: [20, 6],     // за отбитую волну: 20 + 6 × номер стоянки
  unitCap: 16,             // живых бойцов в отряде не больше: потолок — главный ограничитель позднего похода
  // цены своих бойцов в походе (поверх UNIT_TYPES.cost; награда за врага — по UNIT_TYPES): дешёвый Боец
  // не должен быть лучшим бойцом на золото (сим. 10.10: спам «1» обгонял смешанный отряд)
  price: { infantry: 26, archer: 34, heavy: 56, spear: 32, shieldbearer: 50, bomber: 45 },
  squadHeal: 1,            // доля здоровья, которую бойцы получают после отбитой волны
  firstMarchSec: 1.6, marchSec: 2.8, clearSec: 1.6, endSec: 2.2,
  marchSpeed: 260,         // скорость «прокрутки» дороги в переходе, ед. арены/с (пик)
  spawnGap: 0.4,           // пауза между врагами внутри группы, с
  enemySpeed: 1.3,         // враги быстрее, чем в game4: волна доходит за ~8 с
  classes: ['infantry', 'archer', 'heavy'], // порядок карточек = клавиши 1–3; новые бойцы с карт встают следом (4, 5, 6)
  labels: {
    infantry: { name: 'Боец', role: 'Ближний бой' },
    spear: { name: 'Копейщик', role: 'Крепкий удар' },
    archer: { name: 'Стрелок', role: 'Дальний бой' },
    heavy: { name: 'Защитник', role: 'Прочный' },
    shieldbearer: { name: 'Щитоносец', role: 'Держит удар' },
    bomber: { name: 'Бомбометатель', role: 'Бьёт по толпе' },
  },
  // Свои держат линию перед конвоем (entities.js, 'idle'); chase — насколько выходят навстречу.
  holdLine: { melee: 230, spear: 240, ranged: 170, heavy: 250, default: 230, chase: 260 },
  siege: 220,              // вражеские стрелки бьют конвой с дальности выстрела + siege (entities.js findTarget)
  // Камнепад: тап по полю (или Пробел — по самой густой толпе). Число камней, ширина, урон — до карт.
  rock: { cd: 12, shells: 12, width: 140, radius: 26, dmg: 14, fall: 0.45, spread: 0.55, doubleDelay: 0.55 },
  repair: { base: 40, step: 8, heal: 0.25 },   // «Починить» в окне выбора: 40 + 8 × стоянка, +25 % прочности
  reroll: { cost: 25 },                        // «Другие карты»: 25, 50, 100… внутри одного выбора
  rarity: { common: 60, rare: 30, epic: 10 },
  streak: { window: 1.5, goldPer: 2, marks: [[5, 'Разгром!'], [10, 'Бойня!'], [15, 'Неудержимы!'], [20, 'Легенда!']] },
  spawnOrder: ['heavy', 'spear', 'infantry', 'archer'], // тяжёлые первыми, стрелки позади строя
  // Враг отвечает на перекос отряда (как game4 COUNTER_PICK): с fromStop, если одного вида бойцов ≥ share
  // (в отряде от minSquad), доля convert пехоты и стрелков волны становится его контрой.
  counter: { fromStop: 4, minSquad: 6, share: 0.7, convert: 0.4, tipSec: 5 },
  // Этап 2 «Глубина»
  elite: { hp: 3.2, dmg: 1.4 },  // элитный враг (вожак): ×HP, ×урон; награда ×2 (onDeath), крупнее и с красным контуром
  boss: {                        // Вождь на последней стоянке
    slamCd: 5.5, slamWind: 0.75, slamDmg: 24, slamR: 85, // удар по земле: замах (виден круг), урон своим рядом
    summonAt: 0.5, adds: { infantry: 4, archer: 2 },      // на половине здоровья зовёт подмогу
  },
  synergyNeed: 3,                // сочетание открывается после 3 карт одного знака
  hail: { cd: 7, shells: 10, width: 130, dmg: 10, radius: 22 },  // «Град стрел»
  ballista: { cd: 2.2, dmg: 26, range: 620, speed: 720 },        // «Баллиста»
  vein: { chance: 0.15, mult: 4 },                                // «Золотая жила»
  rage: { per: 0.03, max: 0.45 },                                 // «Ярость толпы»
  wall: 0.6,                                                      // «Стена щитов»: доля урона
  breaker: { stun: 1.1, push: 16 },                               // «Камнелом»
  lowHp: 0.3,                    // ниже — красные края экрана и стук сердца
  // Этап 3 «Возврат»: слава за поход копится между походами (localStorage) и открывает постоянные награды.
  // at — сколько славы нужно всего; v — сила награды (newRun, setupMatch, rollOffer, rerollCost, drawWagon).
  glory: { run: 2, perStop: 3, elite: 2, boss: 15, win: 10, killsPer: 25 },
  meta: [
    { id: 'supplies', at: 15, v: 40, icon: 'gold', name: 'Запас в дорогу', desc: '+40 золота в начале похода' },
    { id: 'cardShield', at: 35, icon: { unit: 'shieldbearer' }, name: 'Щитоносцы', desc: 'Карта «Щитоносцы» в колоде усилений' },
    { id: 'hull', at: 60, v: 0.15, icon: 'hull', name: 'Крепкие борта', desc: 'Прочность конвоя +15%' },
    { id: 'cardEra', at: 90, icon: 'era', name: 'Новая эпоха', desc: 'Карта «Новая эпоха» в колоде усилений' },
    { id: 'cardBomb', at: 120, icon: { unit: 'bomber' }, name: 'Бомбометатели', desc: 'Карта «Бомбометатели» в колоде усилений' },
    { id: 'rockCd', at: 155, v: 0.85, icon: 'clock', name: 'Сноровка', desc: 'Камнепад перезаряжается на 15% быстрее' },
    { id: 'cards4', at: 195, icon: 'cards4', name: 'Широкий выбор', desc: 'Четыре карты на выбор вместо трёх' },
    { id: 'skin', at: 240, icon: 'skin', name: 'Расписной полог', desc: 'Повозки в праздничном пологе' },
    { id: 'freeReroll', at: 290, icon: 'reroll', name: 'Гадальщик', desc: 'Первый переброс карт на стоянке — даром' },
    { id: 'banner', at: 350, v: 1.08, icon: 'banner', name: 'Знамя похода', desc: 'Весь отряд +8% урона, золотое знамя над конвоем' },
  ],
  // Волны стоянок. stat — HP и урон врагов (entities.js spawnUnit, world.enemyStatMult);
  // groups — группы внутри волны: at — секунда от начала волны, elite — элитные враги, boss — Вождь.
  waves: [
    { stat: 1.0, groups: [{ at: 0, units: { infantry: 4 } }] },
    { stat: 1.0, groups: [{ at: 0, units: { infantry: 3 } }, { at: 5, units: { infantry: 2, archer: 1 } }] },
    { stat: 1.3, groups: [{ at: 0, units: { infantry: 3, archer: 1 } }, { at: 6, units: { infantry: 3, archer: 1 } }] },
    { stat: 1.45, groups: [{ at: 0, units: { heavy: 1, infantry: 3 } }, { at: 6, units: { infantry: 2, archer: 2 } }] },
    { stat: 1.6, groups: [{ at: 0, units: { infantry: 5, archer: 1 } }, { at: 6, units: { infantry: 5, archer: 2 }, elite: ['heavy'] }] },
    { stat: 1.75, groups: [{ at: 0, units: { spear: 3, infantry: 4, archer: 1 } }, { at: 7, units: { heavy: 3, infantry: 4, archer: 3 } }] },
    { stat: 1.9, groups: [{ at: 0, units: { infantry: 7, archer: 3 } }, { at: 6, units: { heavy: 1, infantry: 7 } }, { at: 12, units: { archer: 3 }, elite: ['heavy'] }] },
    { stat: 2.05, groups: [{ at: 0, units: { spear: 4, infantry: 4, archer: 3 } }, { at: 7, units: { heavy: 3, infantry: 7, archer: 4 } }, { at: 14, units: { heavy: 1 }, elite: ['spear'] }] },
    { stat: 2.2, groups: [{ at: 0, units: { infantry: 8, archer: 4 } }, { at: 6, units: { heavy: 3, infantry: 8 }, elite: ['heavy'] }, { at: 13, units: { heavy: 1, archer: 4 }, elite: ['spear'] }] },
    { stat: 2.35, groups: [{ at: 0, units: { spear: 4, infantry: 7, archer: 3 } }, { at: 8, units: { infantry: 4, archer: 3 }, boss: 'chief' }, { at: 18, units: { heavy: 3, infantry: 6, archer: 3 } }] },
  ],
};

const ENEMY_NAMES = { infantry: ['боец', 'бойца', 'бойцов'], spear: ['копейщик', 'копейщика', 'копейщиков'], archer: ['лучник', 'лучника', 'лучников'], heavy: ['тяжёлый', 'тяжёлых', 'тяжёлых'] };

// Вождь — босс последней стоянки: роль тяжёлого (копейщики бьют его в полтора раза сильнее, data.js
// UNIT_COUNTERS), огромный; удар по земле и подмога — Convoy.updateBoss. Не в UNIT_ORDER: купить нельзя.
UNIT_TYPES.chief = {
  id: 'chief', name: 'Вождь', role: 'heavy',
  cost: 160, hp: 1100, dmg: 34, range: 34, atkInterval: 1.6, speed: 26, heightMult: 1.12,
};
// Бомбометатель игрока (карта «Бомбометатели»): бомба бьёт всех врагов рядом с целью — заметнее, чем у врага в game4.
Object.assign(UNIT_TYPES.bomber, { dmg: 12, splash: 34 });
// Знаки карт: 3 карты одного знака открывают карту-сочетание (CONVOY.synergyNeed).
const CONVOY_TAGS = {
  mob: { name: 'Толпа', color: '#f0a040' },
  bow: { name: 'Лук', color: '#8fd16a' },
  guard: { name: 'Стража', color: '#7fb0ff' },
  rock: { name: 'Камень', color: '#cdbfa6' },
  gold: { name: 'Золото', color: '#ffd35c' },
  wagon: { name: 'Повозка', color: '#e09a6a' },
};
const ruNum = (v) => String(v).replace('.', ',');
function ruPlural(n, forms) {
  const a = n % 100, b = n % 10;
  if (a >= 11 && a <= 14) return forms[2];
  return b === 1 ? forms[0] : (b >= 2 && b <= 4) ? forms[1] : forms[2];
}

// Колода усилений. icon — рисунок карты (Convoy.drawCardIcon): { unit, badge } или имя картинки.
// desc(run) — текст с реальными числами «было → станет». max — сколько раз карту можно взять.
const CONVOY_CARDS = (() => {
  const R = (v) => Math.round(v);
  const cls = (run, id) => run.mods.cls[id];
  const ageK = (run) => ageStatMult(run.ageStep || 0);
  const hpOf = (run, id) => UNIT_TYPES[id].hp * cls(run, id).hp * ageK(run);
  const dmgOf = (run, id) => UNIT_TYPES[id].dmg * cls(run, id).dmg * run.mods.allDmg * ageK(run);
  const owned = (run, id) => CONVOY.classes.includes(id) || run.unlocked.includes(id);
  // карта-сочетание: открывается, когда взято CONVOY.synergyNeed карт знака tag; включает run.syn[flag]
  const synergy = (id, tag, name, flag, big, desc) => ({
    id, rarity: 'synergy', syn: tag, name, max: 1, icon: id, big, desc,
    cond: (run) => (run.tags[tag] || 0) >= CONVOY.synergyNeed,
    apply: (run) => { run.syn[flag] = true; },
  });
  const newUnit = (id, unit, name, desc) => ({
    id, rarity: 'rare', name, max: 1, icon: { unit }, big: 'Новые', desc: () => desc,
    cond: (run) => !owned(run, unit),
    apply: (run, api) => { run.unlocked.push(unit); if (unit === 'spear') run.mods.spear = true; api.freeUnit(unit); },
  });
  const classCard = (id, rarity, unit, stat, mult, name, who, max) => ({
    id, rarity, name, max, icon: { unit, badge: stat },
    big: `+${R((mult - 1) * 100)}%`,
    desc: (run) => stat === 'hp'
      ? `${who}: здоровье ${R(hpOf(run, unit))} → ${R(hpOf(run, unit) * mult)}`
      : `${who}: урон ${R(dmgOf(run, unit))} → ${R(dmgOf(run, unit) * mult)}`,
    cond: (run) => owned(run, unit),
    apply: (run) => { cls(run, unit)[stat === 'hp' ? 'hp' : 'dmg'] *= mult; },
  });
  const cards = [
    classCard('tough', 'common', 'infantry', 'hp', 1.35, 'Закалка', 'Бойцы', 3),
    classCard('blades', 'common', 'infantry', 'dmg', 1.3, 'Острые клинки', 'Бойцы', 3),
    classCard('aim', 'common', 'archer', 'dmg', 1.3, 'Меткость', 'Стрелки', 3),
    classCard('armor', 'common', 'heavy', 'hp', 1.4, 'Тяжёлая броня', 'Защитники', 3),
    classCard('hammer', 'common', 'heavy', 'dmg', 1.35, 'Боевой молот', 'Защитники', 3),
    {
      id: 'treasury', rarity: 'common', name: 'Казна', max: 3, icon: 'gold', big: '+80',
      desc: () => '+80 золота сейчас и +1 в секунду в бою',
      apply: (run, api) => { api.gainGold(80); run.mods.income += 1; },
    },
    {
      id: 'patch', rarity: 'common', name: 'Ремонт', max: 99, icon: 'repair', big: '+35%',
      desc: (run, m) => `Починить конвой: +${R(m.world.playerCore.maxHp * 0.35)} прочности`,
      cond: (run, m) => m.world.playerCore.hp < m.world.playerCore.maxHp * 0.85,
      apply: (run, api) => api.healConvoy(0.35),
    },
    {
      id: 'plating', rarity: 'common', name: 'Обшивка', max: 3, icon: 'hull', big: '+150',
      desc: (run, m) => `Прочность конвоя ${R(m.world.playerCore.maxHp)} → ${R(m.world.playerCore.maxHp + 150)}`,
      apply: (run, api) => api.addConvoyHp(150),
    },
    {
      id: 'heavyRocks', rarity: 'common', name: 'Тяжёлые камни', max: 3, icon: 'rockHeavy', big: '+50%',
      desc: (run) => `Камнепад: урон камня ${R(CONVOY.rock.dmg * run.mods.rockDmg)} → ${R(CONVOY.rock.dmg * run.mods.rockDmg * 1.5)}`,
      apply: (run) => { run.mods.rockDmg *= 1.5; },
    },
    {
      id: 'reinforce', rarity: 'common', name: 'Подкрепление', max: 99, icon: { unit: 'infantry', badge: 'x3' }, big: '+3',
      desc: () => 'Три Бойца бесплатно — сразу в строй',
      apply: (run, api) => { for (let i = 0; i < 3; i++) api.freeUnit('infantry'); },
    },
    {
      id: 'quickBow', rarity: 'rare', name: 'Быстрая тетива', max: 2, icon: { unit: 'archer', badge: 'spd' }, big: '+25%',
      desc: () => 'Стрелки стреляют на 25% чаще',
      apply: (run) => { run.mods.cls.archer.atk *= 0.8; },
    },
    {
      id: 'cheapKit', rarity: 'rare', name: 'Дешёвый набор', max: 1, icon: { unit: 'infantry', badge: 'cost' }, big: '−25%',
      desc: (run, m, api) => `Боец стоит ${api.unitCost('infantry')} → ${R(api.unitCost('infantry') * 0.75)}`,
      apply: (run) => { run.mods.cls.infantry.cost *= 0.75; },
    },
    newUnit('spears', 'spear', 'Копейщики', 'Боец крепче обычного, бьёт тяжёлых в полтора раза сильнее. Первый — сразу в строй'),
    newUnit('shieldbearers', 'shieldbearer', 'Щитоносцы', 'Держат удар: получают на 35% меньше урона. Первый — сразу в строй'),
    newUnit('bombers', 'bomber', 'Бомбометатели', 'Стрелки: бомба ранит всех врагов рядом с целью. Первый — сразу в строй'),
    classCard('spearEdge', 'rare', 'spear', 'dmg', 1.35, 'Длинные пики', 'Копейщики', 2),
    {
      id: 'trophies', rarity: 'rare', name: 'Трофеи', max: 2, icon: 'trophy', big: '+50%',
      desc: () => 'Золото за убийства +50%',
      apply: (run) => { run.mods.goldKill *= 1.5; },
    },
    {
      id: 'shields', rarity: 'rare', name: 'Щиты на борт', max: 2, icon: 'shield', big: '−40%',
      desc: () => 'Стрелы бьют конвой на 40% слабее',
      apply: (run, api) => { run.mods.rangedTaken *= 0.6; api.syncWorld(); },
    },
    {
      id: 'quickRock', rarity: 'rare', name: 'Быстрый заряд', max: 2, icon: 'clock', big: '−30%',
      desc: (run) => `Камнепад: перезарядка ${Math.round(CONVOY.rock.cd * run.mods.rockCd)} → ${Math.round(CONVOY.rock.cd * run.mods.rockCd * 0.7)} с`,
      apply: (run) => { run.mods.rockCd *= 0.7; },
    },
    {
      id: 'avalanche', rarity: 'rare', name: 'Лавина', max: 2, icon: 'avalanche', big: '×1,5',
      desc: () => 'Камнепад шире в полтора раза и на 6 камней больше',
      apply: (run) => { run.mods.rockWidth *= 1.5; run.mods.rockShells += 6; },
    },
    {
      id: 'morale', rarity: 'epic', name: 'Боевой дух', max: 2, icon: 'morale', big: '+20%',
      desc: () => 'Весь отряд: +20% урона',
      apply: (run) => { run.mods.allDmg *= 1.2; },
    },
    {
      id: 'doubleRock', rarity: 'epic', name: 'Двойной обвал', max: 1, icon: 'double', big: '×2',
      desc: () => 'Каждый камнепад обрушивается дважды',
      apply: (run) => { run.mods.rockDouble = true; },
    },
    {
      id: 'warChest', rarity: 'epic', name: 'Военная казна', max: 1, icon: 'gold2', big: '+150',
      desc: () => '+150 золота сейчас и +2 в секунду в бою',
      apply: (run, api) => { api.gainGold(150); run.mods.income += 2; },
    },
    {
      id: 'era', rarity: 'epic', name: 'Новая эпоха', max: 2, icon: 'era', big: '×1,35',
      desc: (run) => `Отряд переходит в ${AGES[AGE_ORDER[(run.ageStep || 0) + 1]].name.toLowerCase()}: здоровье и урон всех бойцов ×1,35`,
      cond: (run) => (run.ageStep || 0) < AGE_ORDER.length - 1,
      apply: (run, api) => api.ageUp(),
    },
    // сочетания: открываются тремя картами одного знака, всегда предлагаются первыми
    synergy('mobRage', 'mob', 'Ярость толпы', 'rage', '+3%',
      () => `Каждый живой боец даёт всему отряду +${R(CONVOY.rage.per * 100)}% урона (до +${R(CONVOY.rage.max * 100)}%)`),
    synergy('arrowHail', 'bow', 'Град стрел', 'hail', `${CONVOY.hail.cd} с`,
      () => `Каждые ${CONVOY.hail.cd} с град из ${CONVOY.hail.shells} стрел сам падает на гущу врагов`),
    synergy('shieldWall', 'guard', 'Стена щитов', 'wall', `−${R((1 - CONVOY.wall) * 100)}%`,
      () => `Весь отряд получает на ${R((1 - CONVOY.wall) * 100)}% меньше урона`),
    synergy('rockBreaker', 'rock', 'Камнелом', 'breaker', 'Оглушение',
      () => `Камни оглушают врагов на ${ruNum(CONVOY.breaker.stun)} с и отбрасывают назад`),
    synergy('goldVein', 'gold', 'Золотая жила', 'vein', `×${CONVOY.vein.mult}`,
      () => `${R(CONVOY.vein.chance * 100)}% врагов приносят вчетверо больше золота`),
    synergy('ballista', 'wagon', 'Баллиста', 'ballista', `${CONVOY.ballista.dmg}`,
      () => `На повозке баллиста: каждые ${ruNum(CONVOY.ballista.cd)} с болт пробивает строй врагов насквозь (${CONVOY.ballista.dmg} урона каждому)`),
  ];
  const TAG_OF = {
    tough: 'mob', blades: 'mob', reinforce: 'mob', cheapKit: 'mob', spears: 'mob', spearEdge: 'mob',
    aim: 'bow', quickBow: 'bow', bombers: 'bow',
    armor: 'guard', hammer: 'guard', shieldbearers: 'guard',
    heavyRocks: 'rock', quickRock: 'rock', avalanche: 'rock', doubleRock: 'rock',
    treasury: 'gold', trophies: 'gold', warChest: 'gold',
    plating: 'wagon', shields: 'wagon', patch: 'wagon',
  };
  for (const c of cards) if (TAG_OF[c.id]) c.tag = TAG_OF[c.id];
  // карты, которые входят в колоду только после открытия за славу (CONVOY.meta)
  const META_OF = { shieldbearers: 'cardShield', era: 'cardEra', bombers: 'cardBomb' };
  for (const c of cards) if (META_OF[c.id]) c.meta = META_OF[c.id];
  return cards;
})();

const Convoy = (() => {
  const $ = (id) => document.getElementById(id);
  const RUNS_KEY = 'lastconvoy_runs_v2';     // журнал попыток (index.html?journal)
  const PLAYER_KEY = 'lastconvoy_player_v1'; // номер игрока плейтеста
  const BEST_KEY = 'lastconvoy_best_v1';     // рекорд: { stop, wins, runs }
  const GLORY_KEY = 'lastconvoy_glory_v1';   // слава: { total } — копится между походами, открывает CONVOY.meta
  const META = Object.fromEntries(CONVOY.meta.map(u => [u.id, u]));
  const JOURNAL_MAX = 500;
  const STOPS = CONVOY.waves.length;
  const TAU = Math.PI * 2;
  const RARITY_NAME = { common: 'Обычная', rare: 'Редкая', epic: 'Эпическая', synergy: 'Сочетание' };
  const CARD_BY_ID = Object.fromEntries(CONVOY_CARDS.map(c => [c.id, c]));
  const SYN_FLAG = { mobRage: 'rage', arrowHail: 'hail', shieldWall: 'wall', rockBreaker: 'breaker', goldVein: 'vein', ballista: 'ballista' };
  // текущий поход: см. newRun()
  let run = null;
  let runSeq = 0;
  let cardEls = null;
  let cardKey = '';
  const hudCache = {};
  const aim = { x: 0, at: -1e9, mouse: false };
  let goldTargetCache = null;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const rnd = () => (run && run.rng ? run.rng() : Math.random());
  const fmtSec = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ------------------------------------------------------------ отряд и цены
  // классы для покупки: базовые (клавиши 1–3) и открытые картами по порядку взятия (4–6)
  function classes() { return run ? CONVOY.classes.concat(run.unlocked) : CONVOY.classes; }
  function unitCost(id) {
    return Math.max(1, Math.round((CONVOY.price[id] || UNIT_TYPES[id].cost) * (run ? run.mods.cls[id].cost : 1)));
  }
  function rockCdMax() { return CONVOY.rock.cd * (run ? run.mods.rockCd : 1); }
  function incomeRate() { return CONVOY.income + (run ? run.mods.income : 0); }
  function repairCost() { return CONVOY.repair.base + CONVOY.repair.step * run.stop; }
  function rerollCost() {
    const free = hasMeta('freeReroll') ? 1 : 0, n = match.convoy.rerolls;
    return n < free ? 0 : CONVOY.reroll.cost * Math.pow(2, n - free);
  }
  function hasMeta(id) { return !!(run && run.meta.includes(id)); }
  function homeX(u) {
    const role = UNIT_TYPES[u.typeId].role;
    return (CONVOY.holdLine[role] || CONVOY.holdLine.default) - (u.holdOff || 0);
  }
  function alive(team) {
    let n = 0;
    for (const u of match.world.units) if (u.team === team && u.state !== 'dead') n++;
    return n;
  }
  function waveText(units) {
    const parts = CONVOY.spawnOrder.filter(t => units[t]).map(t => `${units[t]} ${ruPlural(units[t], ENEMY_NAMES[t])}`);
    if (units.elite) parts.push(`${units.elite} ${ruPlural(units.elite, ['вожак', 'вожака', 'вожаков'])}`);
    if (units.boss) parts.push('Вождь');
    return parts.join(', ');
  }
  function waveTotals(def) {
    const tot = {};
    for (const g of def.groups) {
      for (const [t, n] of Object.entries(g.units)) tot[t] = (tot[t] || 0) + n;
      if (g.elite) tot.elite = (tot.elite || 0) + g.elite.length;
      if (g.boss) tot.boss = 1;
    }
    return tot;
  }
  function enemiesLeft() {
    const C = match.convoy;
    if (C.phase !== 'wave') return 0;
    let n = alive('enemy') + C.queue.length;
    for (let i = C.groupIdx; i < C.def.groups.length; i++) {
      const g = C.def.groups[i];
      for (const v of Object.values(g.units)) n += v;
      n += (g.elite || []).length + (g.boss ? 1 : 0);
    }
    return n;
  }
  // Модификаторы карт — на бойца: при появлении и всем живым после выбора карты.
  function applyMods(u, fresh) {
    const cm = run.mods.cls[u.typeId], t = UNIT_TYPES[u.typeId], age = ageStatMult(run.ageStep);
    const max = Math.round(t.hp * cm.hp * age);
    const frac = fresh ? 1 : u.hp / u.maxHp;
    u.maxHp = max;
    u.hp = Math.max(1, Math.round(max * frac));
    u.baseDmg = cm.dmg * run.mods.allDmg * age;          // без «Ярости толпы» (её множитель — tickSynergies)
    u.dmgMult = u.baseDmg * (1 + (match.convoy.rage || 0));
    u.atkMult = cm.atk;
    u.dmgTaken = run.syn.wall ? CONVOY.wall : 1;          // entities.js dealDamage: «Стена щитов»
  }
  function refreshSquad() {
    for (const u of match.world.units) if (u.team === 'player' && u.state !== 'dead') applyMods(u, false);
  }
  function syncWorld() {
    match.world.convoyRangedTaken = run.mods.rangedTaken < 1 ? run.mods.rangedTaken : 0;
  }

  // ------------------------------------------------------------ журнал и рекорд
  function readLog() {
    try {
      const v = JSON.parse(localStorage.getItem(RUNS_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function playerNo() {
    try { return Number(localStorage.getItem(PLAYER_KEY)) || 1; } catch (e) { return 1; }
  }
  function readBest() {
    try {
      const v = JSON.parse(localStorage.getItem(BEST_KEY) || 'null');
      return v && typeof v === 'object' ? v : { stop: 0, wins: 0, runs: 0 };
    } catch (e) { return { stop: 0, wins: 0, runs: 0 }; }
  }
  function saveRun() {
    const reached = run.win ? STOPS : run.stop;
    const prev = readBest();
    const best = { stop: Math.max(prev.stop || 0, reached), wins: (prev.wins || 0) + (run.win ? 1 : 0), runs: (prev.runs || 0) + 1 };
    run.record = { prev: prev.stop || 0, isNew: reached > (prev.stop || 0) || (run.win && !prev.wins) };
    const g = gloryOf(), was = readGlory().total;
    run.glory = { ...g, prev: was, total: was + g.gain, fresh: CONVOY.meta.filter(u => u.at > was && u.at <= was + g.gain) };
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
      localStorage.setItem(GLORY_KEY, JSON.stringify({ total: run.glory.total }));
      const log = readLog();
      log.push({
        ts: Date.now(), player: playerNo(), stop: reached, win: run.win, cards: run.cards.slice(),
        kills: run.stats.kills, gold: Math.round(run.stats.gold), sec: Math.round(match.elapsed), streak: run.stats.bestStreak,
        rocks: run.stats.rocks, hp: Math.max(0, Math.ceil(match.world.playerCore.hp)), glory: g.gain,
      });
      localStorage.setItem(RUNS_KEY, JSON.stringify(log.slice(-JOURNAL_MAX)));
    } catch (e) { /* без хранилища игра работает, только без рекорда и журнала */ }
  }

  // ------------------------------------------------------------ слава и открытия (этап 3)
  function readGlory() {
    try {
      const v = JSON.parse(localStorage.getItem(GLORY_KEY) || 'null');
      return v && Number.isFinite(v.total) ? v : { total: 0 };
    } catch (e) { return { total: 0 }; }
  }
  function metaOf(total) { return CONVOY.meta.filter(u => total >= u.at).map(u => u.id); }
  // Слава за поход: за сам поход, пройденные стоянки, вожаков, Вождя, доставку и каждых killsPer врагов.
  function gloryOf() {
    const G = CONVOY.glory, s = run.stats;
    const parts = [
      ['стоянки', (run.win ? STOPS : run.stop - 1) * G.perStop], ['вожаки', s.elites * G.elite],
      ['Вождь', s.boss ? G.boss : 0], ['доставка', run.win ? G.win : 0],
      ['враги', Math.floor(s.kills / G.killsPer)], ['поход', G.run],
    ].filter(([, v]) => v > 0);
    return { gain: parts.reduce((a, [, v]) => a + v, 0), parts };
  }

  // ------------------------------------------------------------ поход
  function newMods() {
    const c = () => ({ hp: 1, dmg: 1, atk: 1, cost: 1 });
    return {
      cls: { infantry: c(), spear: c(), archer: c(), heavy: c(), shieldbearer: c(), bomber: c() },
      allDmg: 1, goldKill: 1, income: 0, rangedTaken: 1,
      rockDmg: 1, rockCd: 1, rockWidth: 1, rockShells: 0, rockDouble: false, spear: false,
    };
  }
  function newRun(opts = {}) {
    run = {
      id: ++runSeq, stop: 1, cards: [], mods: newMods(), seq: 0, log: [],
      tags: {}, unlocked: [], ageStep: 0, syn: {}, // знаки карт, открытые бойцы, эпоха отряда, сочетания
      stats: { kills: 0, gold: 0, lost: 0, bought: 0, bestStreak: 0, rocks: 0, elites: 0, veins: 0, boss: false, countered: 0 },
      finished: false, win: false, record: null, glory: null,
      headless: !!opts.headless, policy: opts.policy || null,
      rng: opts.seed ? seededRandom(opts.seed) : null,
      // открытые за славу награды; симулятор передаёт glory (или meta), иначе — свежий игрок
      meta: opts.meta || metaOf(opts.glory != null ? opts.glory : opts.headless ? 0 : readGlory().total),
    };
    if (hasMeta('rockCd')) run.mods.rockCd *= META.rockCd.v;
    if (hasMeta('banner')) run.mods.allDmg *= META.banner.v;
    match = null;
    return run;
  }

  function setupMatch() {
    const age = 'stone';
    const mission = { id: 1, chapterId: 1, age, title: 'Последний конвой' };
    const world = {
      units: [], projectiles: [],
      playerCore: makeCore('player', ARENA.playerCoreX + ARENA.coreWidth, Math.round(CONVOY.hp * (hasMeta('hull') ? 1 + META.hull.v : 1))),
      enemyCore: makeCore('enemy', ARENA.enemyCoreX, 1), // источник врагов: не цель, не рисуется
      hero: makeHero('player'),
      towers: [], enemyTowers: [], traps: [],
      ageStep: { player: 0, enemy: 0 },
      teamAge: { player: age, enemy: age },
      xp: { player: 0, enemy: 0 },
      volleyShells: [], volleyZone: null,
      spawnCount: { player: 0, enemy: 0 },
      playerCoreDmgMult: 1, enemyAliveCap: 0, fortGuard: null, enemySiege: CONVOY.siege,
      enemyStatMult: 1,                  // entities.js spawnUnit: HP и урон врагов стоянки
      fortHitAt: -Infinity, fortHitDps: 0, fortAbsorbed: 0, clock: 0,
      enemyCoreDmgTakenMult: 1, enemyTowerDmgMult: 1, heroRangedTaken: 0,
      convoy: true,                      // entities.js: источник врагов не цель
      holdLine: CONVOY.holdLine,         // entities.js: свои держат линию
      playerDmgMult: 1,
      convoyRangedTaken: 0,              // entities.js dealDamage: «Щиты на борт»
    };
    world.hero.alive = false;
    world.hero.respawnTimer = 1e9;
    const headless = run.headless;
    const m = {
      missionIndex: 0, mission, age: AGES[age], world,
      gold: CONVOY.startGold + (hasMeta('supplies') ? META.supplies.v : 0), incomeLevel: 0, incomeAcc: 0, unlockedUnits: CONVOY.classes,
      shake: { mag: 0, x: 0, y: 0 }, particles: [],
      clouds: Array.from({ length: 5 }, () => ({ x: Math.random() * ARENA.width, y: 18 + Math.random() * 55, scale: 0.6 + Math.random() * 0.9, speed: 5 + Math.random() * 9 })),
      resolved: false, elapsed: 0, resultElapsed: 0, farmPulse: 0, shopKills: 0,
      countdown: 0, enemyAge: AGES[age], ageBanner: null, ageFlash: 0, bgWarmed: true,
      buffsTriggered: new Set(), currentBattleTrack: null,
      bgVariant: bgVariantOf({ id: 1 }),
      convoy: {
        phase: 'march', phaseT: 0, marchLen: CONVOY.firstMarchSec, speed: 0, roll: 0, bgSwapped: true,
        def: null, waveT: 0, groupIdx: 0, queue: [],
        rockCd: 0, rockQueue: [], coins: [], coinChain: 0, coinChainT: 0,
        banner: null, streak: { n: 0, lastT: -9, label: null }, deniedAt: -9,
        offer: null, rerolls: 0, repaired: false, chosen: false, shown: false, win: false,
        props: headless ? [] : makeProps(), dustT: 0,
        boss: null, slam: null, slamT: 0, summoned: false,     // Вождь (updateBoss)
        hailT: 0, ballT: 0, bolts: [], rage: 0, beatT: 0,      // сочетания (tickSynergies), стук сердца
        eraFx: false, vignette: 0, counter: null,               // counter — ответ врага на перекос отряда
        headless,
      },
    };
    world.onCoreHit = (core) => {
      if (!match || match.world !== world || headless) return;
      shakeScreen(match, 2.5);
      VFX.burst(match, 'chip', core.x + 10, -26, 6, { speed: 130, spread: Math.PI * 1.2, dir: -Math.PI / 2, life: 0.6, size: 3, color: ART.woodChip, gravity: 320, jitter: 22 });
    };
    world.onCoreDestroyed = () => { if (match && match.world === world) finish(false); };
    world.onUnitDeath = (u) => { if (match && match.world === world) onDeath(u); };
    world.onImpact = (x) => { if (!headless) VFX.impact(match, x); };
    world.onHit = (ref, role) => {
      ref.lastHitRole = role;
      if (headless) return;
      if (role !== 'ranged') VFX.meleeHit(match, ref.x, -34, ref.team !== 'player');
      if (role === 'heavy') VFX.burst(match, 'dust', ref.x, -2, 5, { speed: 90, spread: Math.PI * 0.8, dir: -Math.PI / 2, life: 0.5, size: 4, color: ART.dust, gravity: 40, jitter: 10 });
    };
    // камень лёг: убитые им падают «полётом», а не на колени (render: deathKind)
    world.onVolleyImpact = (x, kind) => {
      const stone = kind === 'stone';
      for (const u of world.units) if (u.state === 'dead' && u.deathT < 0.05 && Math.abs(u.x - x) <= CONVOY.rock.radius + 4) u.lastHitRole = 'volley';
      // «Камнелом»: камень оглушает и отбрасывает (Вождя — слабее)
      if (stone && run.syn.breaker) {
        for (const u of world.units) {
          if (u.team !== 'enemy' || u.state === 'dead' || Math.abs(u.x - x) > CONVOY.rock.radius + 6) continue;
          const boss = u === match.convoy.boss ? 0.35 : 1;
          u.stunT = Math.max(u.stunT || 0, CONVOY.breaker.stun * boss);
          u.x = Math.min(ARENA.laneMax, u.x + CONVOY.breaker.push * boss);
        }
      }
      if (headless) return;
      VFX.volleyImpact(match, x, kind);
      if (stone) { shakeScreen(match, 3); SFX.rockHit(); } else SFX.hitRanged();
    };
    return m;
  }

  function startRun() {
    newRun();
    match = setupMatch();
    startSquad();
    cardKey = '';
    buildCards();
    for (const k of Object.keys(hudCache)) delete hudCache[k];
    $('cvPick').classList.add('hidden');
    updateHud();
    showScreen('match');
    match.currentBattleTrack = pickNextBattleTrack(null);
    MUSIC.play(match.currentBattleTrack, { force: true });
    return match;
  }
  function startSquad() {
    for (const id of CONVOY.startSquad) {
      const u = spawnPlayer(id);
      if (u) u.x = homeX(u);
    }
  }
  function spawnPlayer(id) {
    const u = spawnUnit(match.world, 'player', id);
    if (!u) return null;
    u.holdOff = (run.seq++ % 6) * 14; // бойцы встают в линии не в одну точку (entities.js, holdOff)
    applyMods(u, true);
    return u;
  }

  // ------------------------------------------------------------ шаг боя
  function update(dt) {
    const m = match, C = m.convoy, w = m.world;
    m.elapsed += dt;
    w.clock += dt;
    C.phaseT += dt;
    if (C.phase !== 'pick') {
      if (C.phase === 'march') updateMarch(dt);
      else if (C.phase === 'wave') updateWave(dt);
      else if (C.phase === 'clear') { if (C.phaseT >= CONVOY.clearSec) openPick(); }
      else if (C.phase === 'end' && C.phaseT >= CONVOY.endSec && !C.shown) { C.shown = true; if (!C.headless) showResult(); }
      if (C.phase === 'wave' || C.phase === 'march' || C.phase === 'clear') C.rockCd = Math.max(0, C.rockCd - dt);
      for (const q of C.rockQueue) { q.t -= dt; if (q.t <= 0) dropRocks(q.x); }
      C.rockQueue = C.rockQueue.filter(q => q.t > 0);
      updateVolley(w, dt, () => {});
      // свои всегда смотрят на врага в логике боя; разворот «домой» — только на шаг ниже
      for (const u of w.units) if (u.team === 'player' && u.state !== 'dead') u.dir = 1;
      if (C.phase === 'wave') tickSynergies(dt);
      updateBolts(dt);
      updateUnits(w, dt, () => {});
      if (C.phase !== 'wave' || alive('enemy') === 0) {
        for (const u of w.units) if (u.team === 'player' && u.state !== 'dead') homeStep(u, dt, C.phase === 'march');
      }
    }
    tickFx(dt);
    if (!C.headless) { tickHeart(dt); updateHud(); }
  }

  // Переход между стоянками: дорога и кусты едут влево, колёса крутятся, отряд шагает на месте.
  function updateMarch(dt) {
    const m = match, C = m.convoy;
    const k = clamp01(C.phaseT / C.marchLen);
    C.speed = Math.sin(Math.PI * k) * CONVOY.marchSpeed;
    C.roll += C.speed * dt / 8;
    if (!C.headless) {
      for (const p of C.props) {
        p.x -= C.speed * (0.75 + p.depth * 0.55) * dt;
        if (p.x < -80) Object.assign(p, newProp(1080 + Math.random() * 60));
      }
      C.dustT -= dt;
      if (C.dustT <= 0 && C.speed > 40) {
        C.dustT = 0.09;
        for (const wx of WAGON_X) VFX.burst(m, 'dust', wx - 14, -2, 1, { speed: 50, spread: 0.8, dir: -Math.PI * 0.85, life: 0.6, size: 4, color: ART.dust, gravity: 10, jitter: 6 });
      }
    }
    if (!C.bgSwapped && C.phaseT >= C.marchLen * 0.35) swapBg(run.stop);
    if (C.phaseT >= C.marchLen) startWave();
  }
  function swapBg(stop) {
    const m = match, C = m.convoy;
    const nv = bgVariantOf({ id: stop });
    if (!C.headless && m.bg) {
      m.bgPrev = m.bg;
      m.bgFadeT0 = performance.now();
      m.bg = bakeArenaBackground(m.age, nv);
    }
    m.bgVariant = nv;
    C.bgSwapped = true;
  }
  function startWave() {
    const m = match, C = m.convoy;
    C.phase = 'wave'; C.phaseT = 0; C.waveT = 0; C.speed = 0;
    const ans = counterWave(CONVOY.waves[run.stop - 1]);
    C.def = ans.def;
    C.counter = ans.into ? { vs: ans.vs, into: ans.into } : null;
    if (C.counter) run.stats.countered++;
    C.groupIdx = 0; C.queue = [];
    m.world.enemyStatMult = C.def.stat;
    C.waveHp = m.world.playerCore.hp;
    if (C.headless) return;
    const last = run.stop === STOPS;
    banner(last ? 'Последняя стоянка!' : `Стоянка ${run.stop}`, waveText(waveTotals(C.def)), last ? 'red' : 'gold', 2.2);
    SFX.alarm();
  }
  // Ответ врага на перекос отряда (CONVOY.counter): копия волны, где часть пехоты и стрелков — контра
  // самого частого вида бойцов (COUNTER_PICK, data.js). Таблица волн не меняется.
  function counterWave(def) {
    const K = CONVOY.counter;
    if (!K || run.stop < K.fromStop) return { def };
    const n = {};
    let tot = 0;
    for (const u of match.world.units) if (u.team === 'player' && u.state !== 'dead') { n[u.typeId] = (n[u.typeId] || 0) + 1; tot++; }
    if (tot < K.minSquad) return { def };
    const vs = Object.keys(n).sort((a, b) => n[b] - n[a])[0];
    const into = COUNTER_PICK[vs] && COUNTER_PICK[vs][0];
    if (!into || n[vs] / tot < K.share) return { def };
    const groups = def.groups.map(g => {
      const units = { ...g.units };
      for (const t of ['infantry', 'archer']) {
        const k = t === into ? 0 : Math.round((units[t] || 0) * K.convert);
        if (!k) continue;
        units[t] -= k;
        units[into] = (units[into] || 0) + k;
        if (!units[t]) delete units[t];
      }
      return { ...g, units };
    });
    return { def: { ...def, groups }, vs, into };
  }
  function updateWave(dt) {
    const m = match, C = m.convoy, w = m.world, def = C.def;
    C.waveT += dt;
    while (C.groupIdx < def.groups.length && def.groups[C.groupIdx].at <= C.waveT) {
      const g = def.groups[C.groupIdx++];
      let i = 0;
      for (const t of CONVOY.spawnOrder) for (let k = 0; k < (g.units[t] || 0); k++) C.queue.push({ at: C.waveT + (i++) * CONVOY.spawnGap, type: t });
      for (const t of g.elite || []) C.queue.push({ at: C.waveT + (i++) * CONVOY.spawnGap + 0.3, type: t, elite: true });
      if (g.boss) C.queue.push({ at: C.waveT + (i++) * CONVOY.spawnGap + 0.8, type: g.boss, boss: true });
    }
    while (C.queue.length && C.queue[0].at <= C.waveT) spawnFoe(C.queue.shift());
    if (C.boss) updateBoss(dt);
    const inc = incomeRate() * dt;
    m.gold += inc;
    run.stats.gold += inc;
    if (C.groupIdx >= def.groups.length && !C.queue.length && alive('enemy') === 0 && w.playerCore.hp > 0) clearWave();
  }
  function spawnFoe(q) {
    const m = match, C = m.convoy, w = m.world;
    let u;
    if (q.boss) {
      u = spawnEliteUnit(w, 'enemy', q.type, 1);
      if (!u) return;
      C.boss = u; C.slamT = CONVOY.boss.slamCd * 0.6; C.summoned = false; C.slam = null;
      if (!C.headless) {
        banner('Вождь!', 'Копейщики бьют его в полтора раза сильнее', 'red', 2.4);
        shakeScreen(m, 7);
        SFX.bossRoar();
        VFX.spawn(m, 'ring', u.x, -40, { size: 180, width: 7, life: 0.7, color: ART.enemy.eliteOutline, glow: ART.enemy.eliteGlow, gravity: 0 });
      }
    } else if (q.elite) {
      u = spawnEliteUnit(w, 'enemy', q.type, CONVOY.elite.hp);
      if (!u) return;
      u.dmgMult *= CONVOY.elite.dmg;
      if (!C.headless) {
        if (!C.banner || C.banner.t > 1.2) banner('Вожак!', 'Крупный враг — двойная награда', 'red', 1.6);
        SFX.elite();
      }
    } else u = spawnUnit(w, 'enemy', q.type);
    if (u) u.speedMult = CONVOY.enemySpeed;
  }
  // Вождь: удар по земле с замахом (круг на земле), на половине здоровья — подмога.
  function updateBoss(dt) {
    const m = match, C = m.convoy, w = m.world, B = CONVOY.boss, u = C.boss;
    if (!u || u.state === 'dead') { C.boss = null; C.slam = null; return; }
    if (!C.summoned && u.hp <= u.maxHp * B.summonAt) {
      C.summoned = true;
      let i = 0;
      for (const [t, n] of Object.entries(B.adds)) for (let k = 0; k < n; k++) C.queue.push({ at: C.waveT + 0.4 + (i++) * CONVOY.spawnGap, type: t });
      C.queue.sort((a, b) => a.at - b.at);
      if (!C.headless) { banner('Вождь зовёт подмогу!', '', 'red', 1.6); SFX.bossRoar(); shakeScreen(m, 5); }
    }
    if (C.slam) {
      C.slam.t += dt;
      u.attackTimer = Math.max(u.attackTimer, 0.2); // на замахе Вождь не бьёт обычным ударом
      if (u.stunT > 0) { C.slam = null; return; }    // оглушили на замахе — удар сорван
      if (C.slam.t >= B.slamWind) {
        const x = C.slam.x;
        for (const f of w.units) {
          if (f.team !== 'player' || f.state === 'dead' || Math.abs(f.x - x) > B.slamR) continue;
          dealDamage(w, { kind: 'unit', ref: f }, B.slamDmg * (u.dmgMult || 1), () => {}, 'heavy', null);
          f.knockback = -10;
          f.x = Math.max(ARENA.laneMin, f.x - 18);
        }
        if (!C.headless) {
          requestHitStop(0.08);
          shakeScreen(m, 11);
          SFX.slam();
          VFX.spawn(m, 'ring', x, -4, { size: B.slamR * 2.2, width: 6, life: 0.45, color: '#ffb08a', gravity: 0 });
          VFX.burst(m, 'dust', x, -2, 16, { speed: 220, spread: Math.PI * 0.9, dir: -Math.PI / 2, life: 0.7, size: 6, color: ART.dust, gravity: 160, jitter: B.slamR * 0.6 });
        }
        C.slam = null;
        C.slamT = B.slamCd;
      }
      return;
    }
    C.slamT -= dt;
    if (C.slamT <= 0 && u.state === 'attack' && !(u.stunT > 0)) {
      C.slam = { t: 0, x: u.x - 40 };
      if (!C.headless) SFX.alarm();
    }
  }
  function clearWave() {
    const m = match, C = m.convoy, w = m.world;
    C.boss = null; C.slam = null; C.bolts = [];
    run.log.push({ stop: run.stop, hp: Math.ceil(w.playerCore.hp), lostHp: Math.round(C.waveHp - w.playerCore.hp), squad: alive('player'), gold: Math.floor(m.gold), sec: Math.round(m.elapsed) });
    if (run.stop >= STOPS) { finish(true); return; }
    C.phase = 'clear'; C.phaseT = 0;
    const bonus = CONVOY.clearBonus[0] + CONVOY.clearBonus[1] * run.stop;
    gainGold(bonus, ARENA.width / 2, ARENA.groundY - 170, 8);
    for (const u of w.units) {
      if (u.team !== 'player' || u.state === 'dead') continue;
      u.hp = Math.min(u.maxHp, u.hp + u.maxHp * CONVOY.squadHeal);
      if (!C.headless) VFX.burst(m, 'spark', u.x, -30 * VIEW.fig, 4, { speed: 70, life: 0.7, size: 2.6, colors: ['#b8f5a0', '#6fd46a', '#fff6c0'], lift: 40, gravity: -20 });
    }
    if (C.headless) return;
    banner('Волна отбита!', `+${bonus} золота · отряд ${CONVOY.squadHeal >= 1 ? 'вылечен' : 'подлечен'}`, 'gold', CONVOY.clearSec + 0.3);
    SFX.waveClear();
  }

  // ------------------------------------------------------------ выбор усиления
  function cardAvailable(card) {
    const have = run.cards.filter(id => id === card.id).length;
    if (have >= card.max) return false;
    if (card.meta && !hasMeta(card.meta)) return false;
    return !card.cond || card.cond(run, match, api);
  }
  function rollRarity() {
    const W = CONVOY.rarity, sum = W.common + W.rare + W.epic;
    let r = rnd() * sum;
    if ((r -= W.common) < 0) return 'common';
    if ((r -= W.rare) < 0) return 'rare';
    return 'epic';
  }
  function rollOffer(exclude = []) {
    const n = hasMeta('cards4') ? 4 : 3;
    let pool = CONVOY_CARDS.filter(c => !c.syn && cardAvailable(c));
    if (pool.length - exclude.length >= n) pool = pool.filter(c => !exclude.includes(c.id));
    const out = [];
    // открытое сочетание — всегда первой картой (и после переброса), пока его не взяли
    const syn = CONVOY_CARDS.filter(c => c.syn && cardAvailable(c));
    if (syn.length) out.push(syn[Math.floor(rnd() * syn.length)]);
    for (let k = out.length; k < n; k++) {
      const rar = rollRarity();
      let cands = pool.filter(c => c.rarity === rar && !out.includes(c));
      if (!cands.length) cands = pool.filter(c => !out.includes(c));
      if (!cands.length) break;
      out.push(cands[Math.floor(rnd() * cands.length)]);
    }
    return out;
  }
  function openPick() {
    const m = match, C = m.convoy;
    C.phase = 'pick'; C.phaseT = 0;
    C.rerolls = 0; C.repaired = false; C.chosen = false;
    C.offer = rollOffer();
    for (const u of m.world.units) if (u.team === 'player' && u.state !== 'dead') { u.state = 'idle'; u.dir = 1; }
    if (C.headless) {
      const id = run.policy && run.policy.pick ? run.policy.pick(api) : (C.offer[0] && C.offer[0].id);
      if (!choose(id) && C.offer[0]) choose(C.offer[0].id);
      return;
    }
    renderPick();
    syncOverlays();
    // следующий фон — заранее, пока игрок думает (bakeArenaBackground — LRU-кэш)
    const next = run.stop + 1;
    setTimeout(() => { try { if (match === m) bakeArenaBackground(m.age, bgVariantOf({ id: next })); } catch (e) { /* прогрев не обязателен */ } }, 80);
  }
  function choose(id) {
    const m = match, C = m && m.convoy;
    if (!C || C.phase !== 'pick' || C.chosen || !C.offer) return false;
    const card = C.offer.find(c => c.id === id);
    if (!card) return false;
    C.chosen = true;
    run.cards.push(card.id);
    if (card.tag) run.tags[card.tag] = (run.tags[card.tag] || 0) + 1;
    card.apply(run, api);
    refreshSquad();
    syncWorld();
    if (C.headless) { startMarch(); return true; }
    if (card.syn) SFX.synergy(); else SFX.upgrade();
    const els = $('cvPickCards').children;
    for (const el of els) { el.disabled = true; el.classList.toggle('chosen', el.dataset.card === id); el.classList.toggle('faded', el.dataset.card !== id); }
    cardKey = '';
    setTimeout(() => { if (match === m && C.phase === 'pick') startMarch(); }, 420);
    return true;
  }
  function startMarch() {
    const m = match, C = m.convoy;
    run.stop++;
    C.phase = 'march'; C.phaseT = 0; C.marchLen = CONVOY.marchSec; C.bgSwapped = false;
    C.offer = null;
    if (C.eraFx) eraFx();
    if (!C.headless) { buildCards(); syncOverlays(); }
  }
  // «Новая эпоха»: числа — сразу (applyMods берёт run.ageStep), вид — на старте перехода, когда окно карт закрыто.
  function ageUp() {
    const m = match, w = m.world;
    run.ageStep = Math.min(AGE_ORDER.length - 1, run.ageStep + 1);
    w.ageStep.player = run.ageStep;
    w.teamAge.player = AGE_ORDER[run.ageStep];
    m.convoy.eraFx = true;
  }
  function eraFx() {
    const m = match, C = m.convoy, w = m.world;
    C.eraFx = false;
    const from = m.age;
    m.age = AGES[w.teamAge.player];
    m.enemyAge = AGES[AGE_ORDER[0]];
    if (C.headless) return;
    startDressWave('player', from.id, 40);
    VFX.ageUp(m, 200, true);
    shakeScreen(m, 9);
    m.ageFlash = 1;
    banner('Новая эпоха!', m.age.name, 'gold', 2.2);
    SFX.upgrade();
    SFX.heroSpecial();
  }
  function repair() {
    const m = match, C = m && m.convoy;
    if (!C || C.phase !== 'pick' || C.chosen || C.repaired) return false;
    const core = m.world.playerCore, cost = repairCost();
    if (core.hp >= core.maxHp || m.gold < cost) { if (!C.headless) SFX.buyDenied(); return false; }
    m.gold -= cost;
    C.repaired = true;
    healConvoy(CONVOY.repair.heal);
    if (!C.headless) SFX.upgrade();
    return true;
  }
  function reroll() {
    const m = match, C = m && m.convoy;
    if (!C || C.phase !== 'pick' || C.chosen) return false;
    const cost = rerollCost();
    if (m.gold < cost) { if (!C.headless) SFX.buyDenied(); return false; }
    m.gold -= cost;
    C.rerolls++;
    C.offer = rollOffer(C.offer.map(c => c.id));
    if (!C.headless) { SFX.click(); renderPick(); }
    return true;
  }
  function healConvoy(frac) {
    const m = match, core = m.world.playerCore;
    core.hp = Math.min(core.maxHp, core.hp + core.maxHp * frac);
    if (!m.convoy.headless) {
      for (const wx of WAGON_X) VFX.burst(m, 'spark', wx, -40, 8, { speed: 90, life: 0.8, size: 2.8, colors: ['#b8f5a0', '#6fd46a', '#fff6c0'], lift: 50, gravity: -10, jitter: 30 });
    }
  }
  function addConvoyHp(n) {
    const core = match.world.playerCore;
    core.maxHp += n;
    core.hp = Math.min(core.maxHp, core.hp + n);
    healConvoy(0);
  }
  function freeUnit(id) {
    const u = spawnPlayer(id);
    if (u && !match.convoy.headless) VFX.burst(match, 'spark', u.x, -30, 6, { speed: 80, life: 0.6, size: 2.6, colors: ART.spark, lift: 30 });
    return u;
  }

  // ------------------------------------------------------------ итог похода
  function finish(win) {
    const m = match;
    if (!m || m.resolved) return;
    m.resolved = true;
    const C = m.convoy;
    C.phase = 'end'; C.phaseT = 0; C.win = win;
    run.finished = true; run.win = win;
    if (C.headless) return;
    saveRun();
    syncOverlays();
    banner(win ? 'Конвой доставлен!' : 'Конвой пал', win ? 'Все 10 стоянок позади' : `Стоянка ${run.stop} из ${STOPS}`, win ? 'gold' : 'red', CONVOY.endSec + 1);
    MUSIC.play(win ? 'victory_sting' : 'defeat_sting');
    if (!win) shakeScreen(m, 8);
  }
  function showResult() {
    const win = run.win, reached = win ? STOPS : run.stop;
    $('cvResultTitle').textContent = win ? 'Конвой доставлен!' : 'Конвой пал';
    $('cvResultTitle').className = win ? 'win' : 'lose';
    $('cvResultSub').textContent = win ? 'Все десять стоянок пройдены.' : `На стоянке ${reached} из ${STOPS}.`;
    $('cvResultTrack').innerHTML = Array.from({ length: STOPS }, (_, i) => {
      const cls = i < reached - 1 || win ? 'done' : i === reached - 1 ? 'fail' : '';
      return `<i class="${cls}">${i + 1}</i>`;
    }).join('');
    const s = run.stats;
    const rows = [
      ['Врагов повержено', s.kills], ['Золота добыто', Math.floor(s.gold)], ['Лучшая серия', s.bestStreak > 1 ? `×${s.bestStreak}` : '—'],
      ['Камнепадов', s.rocks], ['Время похода', fmtSec(match.elapsed)],
    ];
    $('cvResultStats').innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    const counts = {};
    for (const id of run.cards) counts[id] = (counts[id] || 0) + 1;
    $('cvResultCards').innerHTML = Object.keys(counts).length
      ? Object.entries(counts).map(([id, n]) => `<span class="cv-chip r-${CARD_BY_ID[id].rarity}">${CARD_BY_ID[id].name}${n > 1 ? ` ×${n}` : ''}</span>`).join('')
      : '<span class="cv-chip">Усилений не взято</span>';
    const rec = run.record || { prev: 0, isNew: false };
    const best = $('cvResultBest');
    best.className = 'cv-res-best' + (rec.isNew ? ' new' : '');
    best.textContent = rec.isNew ? (win ? 'Первая доставка! Новый рекорд' : `Новый рекорд: стоянка ${reached}`) : `Рекорд: ${rec.prev >= STOPS ? 'конвой доставлен' : `стоянка ${rec.prev}`}`;
    renderResultGlory();
    syncOverlays();
  }
  // Слава за поход: «+N» набегает, полоса до следующей награды заполняется, открытые награды выезжают со звуком.
  function renderResultGlory() {
    const box = $('cvResultGlory'), g = run.glory;
    if (!box) return;
    if (!g) { box.innerHTML = ''; return; }
    const next = CONVOY.meta.find(u => u.at > g.total);
    const floor = CONVOY.meta.filter(u => u.at <= g.total).reduce((a, u) => Math.max(a, u.at), 0);
    const frac = (v) => next ? clamp01((v - floor) / (next.at - floor)) : 1;
    const parts = g.parts.map(([k, v]) => `${k} ${v}`).join(' · ');
    box.innerHTML =
      `<div class="cv-glory-head"><b class="cv-glory-gain">+0</b><span>славы</span><em>${parts}</em></div>` +
      `<div class="cv-glory-bar"><i style="width:${frac(g.prev) * 100}%"></i>` +
      `<span>Всего ${g.total} · ${next ? `до «${next.name}» ещё ${next.at - g.total}` : 'все награды открыты'}</span></div>` +
      (g.prev === 0 ? '<p class="cv-glory-note">Слава копится от похода к походу и открывает постоянные награды.</p>' : '') +
      (g.fresh.length ? `<div class="cv-unlocks">${g.fresh.map((u, i) =>
        `<div class="cv-unlock" style="animation-delay:${0.7 + i * 0.25}s"><canvas width="64" height="64"></canvas>` +
        `<div><b>Открыто: ${u.name}</b><span>${u.desc}</span></div></div>`).join('')}</div>` : '');
    box.querySelectorAll('.cv-unlock canvas').forEach((cv, i) => drawCardIcon(cv, g.fresh[i]));
    const gain = box.querySelector('.cv-glory-gain'), bar = box.querySelector('.cv-glory-bar i'), t0 = performance.now();
    const tick = () => {
      if (!box.contains(gain)) return;
      const k = Math.min(1, (performance.now() - t0) / 700);
      gain.textContent = `+${Math.round(g.gain * k)}`;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(() => { void bar.offsetWidth; bar.style.width = `${frac(g.total) * 100}%`; tick(); });
    if (g.fresh.length) setTimeout(() => { if (box.contains(gain)) SFX.gloryUnlock(); }, 700);
  }
  function toMenu() { match = null; run = null; syncOverlays(); showScreen('cmenu'); }

  // ------------------------------------------------------------ золото, монеты, серии
  function onDeath(u) {
    const m = match, C = m.convoy;
    if (!C.headless) VFX.unitDeath(m, u.x);
    if (u.team !== 'enemy') { run.stats.lost++; return; }
    run.stats.kills++;
    const boss = u === C.boss;
    if (u.elite && !boss) run.stats.elites++;
    let reward = Math.max(1, Math.round((u.cost || UNIT_TYPES[u.typeId].cost) * CONVOY.killShare * (1 + CONVOY.killGrowth * (run.stop - 1)) * run.mods.goldKill * (u.elite ? 2 : 1)));
    const vein = run.syn.vein && rnd() < CONVOY.vein.chance;
    if (vein) { reward *= CONVOY.vein.mult; run.stats.veins++; }
    const y = ARENA.groundY - 52 * VIEW.fig;
    if (!C.headless) {
      if (vein) {
        VFX.floater(m, u.x, -80 * VIEW.fig, `Жила! +${reward}`, '#ffe066');
        VFX.burst(m, 'spark', u.x, -40 * VIEW.fig, 14, { speed: 190, life: 0.6, size: 3.2, colors: ['#ffe066', '#fff6c0', '#f6c94a'], lift: 60 });
        SFX.vein();
      } else VFX.floater(m, u.x, -66 * VIEW.fig, `+${reward}`, ART.hero.gold);
    }
    gainGold(reward, u.x, y, vein ? 10 : undefined);
    if (boss) bossDown(u);
    const big = u.elite || UNIT_TYPES[u.typeId].role === 'heavy';
    if (big && !C.headless) {
      requestHitStop(0.05);
      shakeScreen(m, 4);
      VFX.spawn(m, 'ring', u.x, -30 * VIEW.fig, { size: 80, width: 4, life: 0.35, color: ART.hero.gold, gravity: 0 });
      VFX.burst(m, 'spark', u.x, -36 * VIEW.fig, 10, { speed: 160, life: 0.5, size: 3, colors: ART.spark, lift: 40 });
    }
    // серия: убийства не дальше window секунд друг от друга
    const S = C.streak;
    S.n = m.elapsed - S.lastT <= CONVOY.streak.window ? S.n + 1 : 1;
    S.lastT = m.elapsed;
    if (S.n > run.stats.bestStreak) run.stats.bestStreak = S.n;
    const mark = CONVOY.streak.marks.find(([n]) => n === S.n);
    if (mark) {
      const bonus = S.n * CONVOY.streak.goldPer;
      if (!C.headless) { S.label = { n: S.n, text: mark[1], t: 0, bonus }; SFX.streak(); }
      gainGold(bonus, ARENA.width / 2, ARENA.groundY - 200, 4);
    }
  }
  function bossDown(u) {
    const m = match, C = m.convoy;
    run.stats.boss = true;
    C.boss = null; C.slam = null;
    if (C.headless) return;
    requestHitStop(0.16);
    shakeScreen(m, 14);
    banner('Вождь повержен!', 'Добейте остальных', 'gold', 2.2);
    SFX.bossDown();
    for (let i = 0; i < 3; i++) VFX.spawn(m, 'ring', u.x, -40 * VIEW.fig, { size: 120 + i * 90, width: 6 - i, life: 0.5 + i * 0.15, color: ART.hero.gold, glow: ART.hero.goldGlow, gravity: 0 });
    VFX.burst(m, 'spark', u.x, -50 * VIEW.fig, 30, { speed: 260, life: 0.9, size: 3.6, colors: ART.spark, lift: 80 });
  }
  // Золото приходит монетами: летят к счётчику и засчитываются по прилёте.
  function gainGold(amount, wx, wy, nCoins) {
    const m = match, C = m.convoy;
    if (!(amount > 0)) return;
    run.stats.gold += amount;
    if (C.headless || wx === undefined || C.coins.length > 48) { m.gold += amount; return; }
    const n = nCoins || Math.max(1, Math.min(4, Math.round(amount / 6)));
    const tgt = goldTarget();
    for (let i = 0; i < n; i++) {
      const x0 = wx + (Math.random() - 0.5) * 18, y0 = wy + (Math.random() - 0.5) * 10;
      C.coins.push({
        x0, y0, x1: tgt.x, y1: tgt.y,
        cx: x0 + (Math.random() - 0.5) * 120, cy: y0 - 90 - Math.random() * 70,
        t: -i * 0.06, dur: 0.6 + Math.random() * 0.2, val: amount / n, spin: Math.random() * TAU,
      });
    }
  }
  function goldTarget() {
    const now = performance.now();
    if (goldTargetCache && now - goldTargetCache.at < 500 && goldTargetCache.rev === VIEW.rev) return goldTargetCache;
    const dot = $('cvGoldDot');
    const r = dot && dot.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    const out = { at: now, rev: VIEW.rev, x: ARENA.width / 2, y: ARENA.groundY + 60 };
    if (r && r.width) {
      out.x = VIEW.x0 + (r.left + r.width / 2 - cr.left) / VIEW.k;
      out.y = VIEW.y0 + (r.top + r.height / 2 - cr.top) / VIEW.k;
    }
    goldTargetCache = out;
    return out;
  }
  function tickFx(dt) {
    const m = match, C = m.convoy;
    if (C.headless) return;
    updateParticles(m, dt);
    updateShake(m, dt);
    const drift = C.phase === 'march' ? -C.speed * 0.25 : 0;
    for (const c of m.clouds) {
      c.x += (c.speed + drift) * dt;
      if (c.x > ARENA.width + 90) c.x = -90;
      if (c.x < -100) c.x = ARENA.width + 80;
    }
    let arrived = 0;
    for (const c of C.coins) {
      c.t += dt;
      c.spin += dt * 9;
      if (c.t >= c.dur) { c.done = true; m.gold += c.val; arrived++; }
    }
    if (arrived) {
      C.coins = C.coins.filter(c => !c.done);
      C.coinChain = C.coinChainT > 0 ? C.coinChain + arrived : arrived;
      C.coinChainT = 0.45;
      SFX.coin(Math.min(0.6, C.coinChain * 0.025));
      bumpGold();
    }
    C.coinChainT -= dt;
    if (C.banner) { C.banner.t += dt; if (C.banner.t >= C.banner.life) C.banner = null; }
    if (m.ageFlash > 0) m.ageFlash = Math.max(0, m.ageFlash - dt / 0.5); // вспышка эпохи гаснет (game.js updateR15 в конвое не зовётся)
    const S = C.streak;
    if (S.label) { S.label.t += dt; if (S.label.t >= 1.5) S.label = null; }
  }
  function bumpGold() {
    const el = $('cvGoldBox');
    if (!el) return;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function banner(text, sub, color, life) {
    match.convoy.banner = { text, sub, color, t: 0, life: life || 1.8 };
  }

  // ------------------------------------------------------------ сочетания в бою
  function tickSynergies(dt) {
    const m = match, C = m.convoy, w = m.world, S = run.syn;
    if (S.rage) {
      let n = 0;
      for (const u of w.units) if (u.team === 'player' && u.state !== 'dead') n++;
      const rage = Math.min(CONVOY.rage.max, n * CONVOY.rage.per);
      if (rage !== C.rage) {
        C.rage = rage;
        for (const u of w.units) if (u.team === 'player' && u.state !== 'dead' && u.baseDmg) u.dmgMult = u.baseDmg * (1 + rage);
      }
    }
    if (S.hail) {
      C.hailT -= dt;
      if (C.hailT <= 0) {
        const x = densestEnemyX();
        if (x !== null && x > 150) { C.hailT = CONVOY.hail.cd; dropHail(x); } else C.hailT = 0.5;
      }
    }
    if (S.ballista) {
      C.ballT -= dt;
      if (C.ballT <= 0) {
        const B = CONVOY.ballista, x0 = WAGON_X[1] + 24 * wagonScale();
        let near = null;
        for (const u of w.units) if (u.team === 'enemy' && u.state !== 'dead' && u.x - x0 < B.range && (!near || u.x < near.x)) near = u;
        if (near) {
          C.ballT = B.cd;
          C.bolts.push({ x: x0, x0, y: -50 * wagonScale(), hit: new Set(), dmg: B.dmg * ageStatMult(run.ageStep) });
          if (!C.headless) SFX.ballista();
        } else C.ballT = 0.3;
      }
    }
  }
  function dropHail(x) {
    const w = match.world, H = CONVOY.hail;
    for (let i = 0; i < H.shells; i++) {
      const lx = x + ((i + Math.random()) / H.shells - 0.5) * H.width;
      w.volleyShells.push({
        team: 'player', x: lx, delay: Math.random() * 0.5, t: 0, fall: 0.5 * (0.85 + Math.random() * 0.3),
        sx: lx - (180 + Math.random() * 60), sy: -300 - Math.random() * 40,
        kind: 'arrow', dmg: H.dmg * ageStatMult(run.ageStep), radius: H.radius,
      });
    }
    if (!match.convoy.headless) SFX.hail();
  }
  // Болт баллисты: летит вправо, ранит каждого врага на пути один раз.
  function updateBolts(dt) {
    const m = match, C = m.convoy, w = m.world;
    if (!C.bolts.length) return;
    const B = CONVOY.ballista;
    for (const b of C.bolts) {
      b.x += B.speed * dt;
      for (const u of w.units) {
        if (u.team !== 'enemy' || u.state === 'dead' || b.hit.has(u.id) || Math.abs(u.x - b.x) > 14) continue;
        b.hit.add(u.id);
        dealDamage(w, { kind: 'unit', ref: u }, b.dmg, () => {}, 'ranged', null);
        u.knockback = 6;
        if (!C.headless) VFX.burst(m, 'spark', u.x, -34 * VIEW.fig, 4, { speed: 110, life: 0.3, size: 2.4, colors: ART.spark });
      }
      if (b.x - b.x0 > B.range || b.x > ARENA.laneMax + 40) b.done = true;
    }
    C.bolts = C.bolts.filter(b => !b.done);
  }
  // Конвой при смерти: красные края экрана и стук сердца (чаще, чем ниже прочность).
  function tickHeart(dt) {
    const m = match, C = m.convoy, core = m.world.playerCore;
    const frac = core.hp / core.maxHp;
    const low = C.phase === 'wave' && frac > 0 && frac < CONVOY.lowHp;
    const target = low ? 0.35 + 0.65 * (1 - frac / CONVOY.lowHp) : 0;
    C.vignette += (target - C.vignette) * Math.min(1, dt * 4);
    if (!low) { C.beatT = 0; return; }
    C.beatT -= dt;
    if (C.beatT <= 0) {
      C.beatT = 0.55 + 0.6 * (frac / CONVOY.lowHp);
      C.beatAt = performance.now();
      SFX.heartbeat();
    }
  }

  // ------------------------------------------------------------ камнепад
  function rockReady() {
    const C = match && match.convoy;
    return !!(C && C.phase === 'wave' && C.rockCd <= 0);
  }
  function rockAt(x) {
    const m = match, C = m && m.convoy;
    if (!C || C.phase !== 'wave' || (!C.headless && screen !== 'match')) return false;
    if (C.rockCd > 0) {
      if (!C.headless && m.elapsed - C.deniedAt > 0.6) {
        C.deniedAt = m.elapsed;
        SFX.buyDenied();
        VFX.floater(m, Math.max(140, Math.min(860, x)), -120, `Камнепад через ${Math.ceil(C.rockCd)} с`, '#ffb08a');
      }
      return false;
    }
    x = Math.max(110, Math.min(ARENA.laneMax, x));
    dropRocks(x);
    if (run.mods.rockDouble) C.rockQueue.push({ x, t: CONVOY.rock.doubleDelay });
    C.rockCd = rockCdMax();
    run.stats.rocks++;
    return true;
  }
  function dropRocks(x) {
    const w = match.world, R = CONVOY.rock;
    const n = R.shells + run.mods.rockShells, width = R.width * run.mods.rockWidth;
    w.volleyShells = w.volleyShells || [];
    for (let i = 0; i < n; i++) {
      const lx = x + ((i + Math.random()) / n - 0.5) * width;
      w.volleyShells.push({
        team: 'player', x: lx, delay: Math.random() * R.spread, t: 0, fall: R.fall * (0.85 + Math.random() * 0.3),
        sx: lx - (110 + Math.random() * 50), sy: -330 - Math.random() * 40,
        kind: 'stone', dmg: R.dmg * run.mods.rockDmg, radius: R.radius,
      });
    }
    w.volleyZone = { x, w: width, t: 0, life: R.spread + R.fall * 1.2, team: 'player' };
    if (!match.convoy.headless) SFX.rockLaunch();
  }
  // Пробел / кнопка: по самой густой толпе врагов (±70 от центра).
  function densestEnemyX() {
    const foes = match.world.units.filter(u => u.team === 'enemy' && u.state !== 'dead');
    if (!foes.length) return null;
    let best = null, bestN = -1;
    for (const f of foes) {
      let n = 0, sx = 0;
      for (const g of foes) if (Math.abs(g.x - f.x) <= 70) { n++; sx += g.x; }
      if (n > bestN) { bestN = n; best = sx / n; }
    }
    return best;
  }
  function rockAuto() {
    const C = match && match.convoy;
    if (!C || C.phase !== 'wave') return false;
    const x = densestEnemyX();
    if (x === null) return false;
    return rockAt(x);
  }

  // ------------------------------------------------------------ покупка
  function canBuy() {
    const C = match && match.convoy;
    return !!(C && !match.resolved && (C.headless || screen === 'match'));
  }
  function buy(typeId) {
    if (!canBuy() || !classes().includes(typeId)) return false;
    const m = match;
    if (alive('player') >= CONVOY.unitCap) { deny(typeId, 'Отряд полон'); return false; }
    const cost = unitCost(typeId);
    if (m.gold < cost) { deny(typeId); return false; }
    m.gold -= cost;
    spawnPlayer(typeId);
    run.stats.bought++;
    pulseCard(typeId, 'bought');
    return true;
  }
  function buyIndex(i) { const id = classes()[i]; return id ? buy(id) : false; }
  function key(i) {
    const C = match && match.convoy;
    if (!C) return false;
    if (C.phase === 'pick') return C.offer && C.offer[i] ? choose(C.offer[i].id) : false;
    return buyIndex(i);
  }
  function deny(typeId, text) {
    if (match.convoy.headless) return;
    SFX.buyDenied();
    pulseCard(typeId, 'denied');
    if (text && match.elapsed - match.convoy.deniedAt > 0.6) {
      match.convoy.deniedAt = match.elapsed;
      VFX.floater(match, 160, -110, text, '#ffb08a');
    }
  }
  function pulseCard(typeId, cls) {
    const el = !match.convoy.headless && cardEls && cardEls[typeId];
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 260);
  }

  // Между волнами (и в паузе между группами) свои возвращаются на свои места у конвоя.
  function homeStep(u, dt, marching) {
    const t = UNIT_TYPES[u.typeId], hx = homeX(u), d = hx - u.x;
    if (Math.abs(d) > 2) {
      const step = t.speed * dt;
      u.x += Math.abs(d) <= step ? d : Math.sign(d) * step;
      u.dir = d > 0 ? 1 : -1;
      u.state = 'walk';
      u.walkPhase += dt * t.speed / 12;
    } else {
      u.x = hx; u.dir = 1;
      if (marching) { u.state = 'walk'; u.walkPhase += dt * t.speed / 12; } else u.state = 'idle';
    }
  }

  // ------------------------------------------------------------ HUD
  function setText(id, v) {
    if (hudCache[id] === v) return;
    hudCache[id] = v;
    const el = $(id); if (el) el.textContent = v;
  }
  function setCls(el, cls, on, cacheKey) {
    if (hudCache[cacheKey] === on) return;
    hudCache[cacheKey] = on;
    el.classList.toggle(cls, on);
  }
  function buildCards() {
    const list = classes();
    const age = ageStatMult(run.ageStep);
    const sig = match.age.id + list.map(id => `${id}:${unitCost(id)}:${Math.round(UNIT_TYPES[id].hp * run.mods.cls[id].hp * age)}:${Math.round(UNIT_TYPES[id].dmg * run.mods.cls[id].dmg * run.mods.allDmg * age)}`).join('|');
    if (sig === cardKey && cardEls) return;
    cardKey = sig;
    const box = $('cvCards');
    box.innerHTML = '';
    box.classList.toggle('many', list.length > 4);
    box.classList.toggle('four', list.length === 4);   // четыре вида: плитки на узком экране (style.css)
    cardEls = {};
    list.forEach((id, i) => {
      const t = UNIT_TYPES[id], L = CONVOY.labels[id], cm = run.mods.cls[id];
      const hp = Math.round(t.hp * cm.hp * age), dmg = Math.round(t.dmg * cm.dmg * run.mods.allDmg * age);
      const btn = document.createElement('button');
      btn.className = 'cv-card';
      btn.dataset.unit = id;
      btn.setAttribute('aria-label', `${L.name}, ${L.role}, цена ${unitCost(id)}`);
      btn.innerHTML =
        `<canvas class="cv-card-icon" width="80" height="88"></canvas>` +
        `<span class="cv-card-body"><span class="cv-card-name">${L.name}</span>` +
        `<span class="cv-card-stats"><b${hp > t.hp ? ' class="up"' : ''}>${hp}</b> HP · <b${dmg > t.dmg ? ' class="up"' : ''}>${dmg}</b> урон</span></span>` +
        `<span class="cv-card-cost${cm.cost < 1 ? ' up' : ''}"><i class="gold-dot"></i>${unitCost(id)}</span>` +
        `<span class="tool-key">${i + 1}</span>`;
      btn.addEventListener('click', () => { buy(id); btn.blur(); });
      box.appendChild(btn);
      drawClassIcon(btn.querySelector('canvas'), id);
      cardEls[id] = btn;
    });
    for (const k of Object.keys(hudCache)) if (k.startsWith('card:')) delete hudCache[k];
  }
  function buildTrack() {
    const box = $('cvTrack');
    if (box.childElementCount === STOPS + 1) return;
    box.innerHTML = Array.from({ length: STOPS }, (_, i) => `<i${i === STOPS - 1 ? ' class="last"' : ''}></i>`).join('') + '<b class="cv-track-cart"></b>';
  }
  function updateHud() {
    const m = match; if (!m || !m.convoy || !run) return;
    const C = m.convoy, w = m.world;
    const core = w.playerCore;
    const frac = Math.max(0, core.hp / core.maxHp);
    const fill = $('cvHpFill');
    const wpct = (frac * 100).toFixed(1) + '%';
    if (hudCache.hpw !== wpct) { hudCache.hpw = wpct; fill.style.width = wpct; }
    setCls(fill, 'low', frac < 0.35, 'hplow');
    setText('cvHpText', `${Math.max(0, Math.ceil(core.hp))}/${Math.round(core.maxHp)}`);
    setText('cvStop', run.stop === STOPS && C.phase !== 'march' ? `Последняя стоянка` : `Стоянка ${run.stop}/${STOPS}`);
    // дорожка стоянок: пройденные, текущая, повозка едет в переходе
    buildTrack();
    const track = $('cvTrack');
    const cleared = C.phase === 'wave' || C.phase === 'march' ? run.stop - 1 : C.phase === 'end' && !C.win ? run.stop - 1 : run.stop;
    for (let i = 0; i < STOPS; i++) {
      const el = track.children[i];
      setCls(el, 'done', i < cleared, `tr${i}d`);
      setCls(el, 'now', i === run.stop - 1 && C.phase !== 'march' && !(C.phase === 'end' && C.win), `tr${i}n`);
      setCls(el, 'next', i === run.stop - 1 && C.phase === 'march', `tr${i}x`);
    }
    let pos = run.stop - 1;
    if (C.phase === 'march') pos = run.stop - 2 + clamp01(C.phaseT / C.marchLen);
    const left = (Math.max(0, pos) / (STOPS - 1) * 100).toFixed(1) + '%';
    if (hudCache.cart !== left) { hudCache.cart = left; track.lastElementChild.style.left = left; }
    let status = '';
    if (C.phase === 'wave') { const n = enemiesLeft(); status = `Врагов: ${n}`; }
    else if (C.phase === 'march') status = run.stop === 1 ? 'Конвой выходит в путь…' : 'В пути…';
    else if (C.phase === 'clear') status = 'Волна отбита!';
    else if (C.phase === 'pick') status = 'Выберите усиление';
    setText('cvStatus', status);
    setText('cvGold', String(Math.floor(m.gold)));
    setText('cvIncome', `+${incomeRate()}/с в бою`);
    const squad = alive('player');
    setText('cvSquad', `Отряд ${squad}/${CONVOY.unitCap}`);
    setCls($('cvSquad'), 'full', squad >= CONVOY.unitCap, 'sqfull');
    if (cardEls) for (const id of classes()) {
      const el = cardEls[id];
      if (el) setCls(el, 'disabled', m.gold < unitCost(id) || squad >= CONVOY.unitCap || m.resolved, `card:${id}`);
    }
    // камнепад: заряд и готовность
    const cdMax = rockCdMax();
    const cdFrac = C.phase === 'pick' || C.phase === 'end' ? 1 : clamp01(C.rockCd / cdMax);
    const cdPct = (cdFrac * 100).toFixed(0) + '%';
    if (hudCache.rockcd !== cdPct) { hudCache.rockcd = cdPct; $('cvRockCd').style.height = cdPct; }
    const ready = rockReady();
    const rock = $('cvRock');
    setCls(rock, 'ready', ready, 'rockready');
    setCls(rock, 'off', C.phase !== 'wave', 'rockoff');
    setText('cvRockTime', C.rockCd > 0 && C.phase !== 'pick' && C.phase !== 'end' ? `${Math.ceil(C.rockCd)}` : '');
    // подсказка сверху: первый найм, камнепад, ответ врага
    const tip = tipHtml(ready);
    if (hudCache.tip !== tip) {
      hudCache.tip = tip;
      if (tip) $('cvHint').innerHTML = tip;
      $('cvHint').classList.toggle('hidden', !tip);
    }
    setCls($('cvPause'), 'hidden', C.phase === 'end', 'pausehide');
    // полоса Вождя
    const boss = C.boss && C.boss.state !== 'dead' ? C.boss : null;
    setCls($('cvBoss'), 'hidden', !boss, 'bosshide');
    if (boss) {
      const bp = (Math.max(0, boss.hp / boss.maxHp) * 100).toFixed(1) + '%';
      if (hudCache.bossw !== bp) { hudCache.bossw = bp; $('cvBossFill').style.width = bp; }
      setCls($('cvBoss'), 'slam', !!C.slam, 'bossslam');
    }
    // открытые сочетания — значки под золотом
    const synSig = Object.keys(run.syn).join(',');
    if (hudCache.syn !== synSig) {
      hudCache.syn = synSig;
      $('cvSyn').innerHTML = CONVOY_CARDS.filter(c => c.syn && run.syn[SYN_FLAG[c.id]])
        .map(c => `<span class="cv-syn-chip" style="--tag:${CONVOY_TAGS[c.syn].color}">${c.name}</span>`).join('');
    }
    if (C.phase === 'pick' && !C.chosen) updatePickButtons();
  }

  const PLURAL = { infantry: 'Бойцы', archer: 'Стрелки', heavy: 'Защитники', spear: 'Копейщики', shieldbearer: 'Щитоносцы', bomber: 'Бомбометатели' };
  const COUNTER_WORD = { spear: ['копьями', 'копий'], archer: ['лучниками', 'лучников'], infantry: ['пехотой', 'пехоты'] };
  function tipHtml(ready) {
    const C = match.convoy;
    if (C.phase === 'pick' || C.phase === 'end') return '';
    // обучение: пока не нанят ни один боец
    if (run.stop === 1 && run.stats.bought === 0 && (C.phase !== 'march' || C.phaseT > 0.6))
      return '<b>Наймите бойцов!</b> Кнопки внизу или клавиши 1–3. Золото идёт в бою и за каждого врага.';
    if (C.phase === 'wave' && ready && run.stats.rocks === 0 && alive('enemy') > 0 && C.waveT > 2 && run.stop <= 3)
      return '<b>Камнепад готов!</b> Нажмите на толпу врагов на поле (или Пробел).';
    if (C.phase === 'wave' && C.counter && C.waveT < CONVOY.counter.tipSec) {
      const { vs, into } = C.counter, w = COUNTER_WORD[into];
      const fix = into === 'spear' ? 'Стрелки' : into === 'archer' ? 'Бойцы' : classes().includes('spear') ? 'Копейщики' : 'Защитники';
      return `<b>Враг ответил ${w[0]}!</b> У вас почти одни ${PLURAL[vs]}. Против ${w[1]} хороши ${fix}.`;
    }
    return '';
  }

  // ------------------------------------------------------------ окно выбора карты
  function renderPick() {
    const C = match.convoy;
    $('cvPickTitle').textContent = `Стоянка ${run.stop} пройдена!`;
    // первые походы: подсказка про знаки карт (плашка внизу карты) и сочетания
    const learn = run.stop <= 2 && readBest().runs < 2;
    $('cvPickSub').textContent = `Впереди стоянка ${run.stop + 1}${run.stop + 1 === STOPS ? ' — последняя' : ''}. ` +
      (learn ? 'Три карты одного знака (плашка внизу карты) открывают сильное сочетание.' : 'Выберите одно усиление.');
    $('cvPickCards').classList.toggle('four', C.offer.length > 3);
    const box = $('cvPickCards');
    box.innerHTML = '';
    C.offer.forEach((card, i) => {
      const have = run.cards.filter(id => id === card.id).length;
      const btn = document.createElement('button');
      btn.className = `cv-pick-card r-${card.rarity}`;
      btn.dataset.card = card.id;
      btn.style.animationDelay = `${i * 0.07}s`;
      btn.innerHTML =
        `<span class="cv-pick-rarity">${RARITY_NAME[card.rarity]}</span>` +
        `<canvas class="cv-pick-icon" width="120" height="120"></canvas>` +
        `<span class="cv-pick-big">${card.big}</span>` +
        `<span class="cv-pick-name">${card.name}</span>` +
        `<span class="cv-pick-desc">${card.desc(run, match, api)}</span>` +
        tagLine(card) +
        (have ? `<span class="cv-pick-have">уже есть ×${have}</span>` : '') +
        `<span class="tool-key">${i + 1}</span>`;
      btn.addEventListener('click', () => choose(card.id));
      box.appendChild(btn);
      drawCardIcon(btn.querySelector('canvas'), card);
    });
    for (const k of ['pkRepair', 'pkReroll', 'pkRepairOff', 'pkRerollOff']) delete hudCache[k];
    updatePickButtons();
  }
  // Знак карты: «Толпа ●●○» — сколько будет после этой карты; третья открывает сочетание.
  function tagLine(card) {
    const tag = card.syn || card.tag;
    if (!tag) return '';
    const T = CONVOY_TAGS[tag], need = CONVOY.synergyNeed;
    if (card.syn) return `<span class="cv-pick-tag syn" style="--tag:${T.color}">Знак «${T.name}» собран</span>`;
    const synCard = CONVOY_CARDS.find(c => c.syn === tag);
    const synTaken = synCard && run.cards.includes(synCard.id);
    const now = run.tags[tag] || 0, after = Math.min(need, now + 1);
    const dots = Array.from({ length: need }, (_, k) => `<i class="${k < now ? 'on' : k < after ? 'add' : ''}"></i>`).join('');
    const opens = !synTaken && now < need && after >= need;
    return `<span class="cv-pick-tag${opens ? ' opens' : ''}" style="--tag:${T.color}"><span>${T.name}</span>${synTaken || now >= need ? '' : dots}` +
      `${opens ? `<em>→ ${synCard.name}</em>` : ''}</span>`;
  }
  function updatePickButtons() {
    const m = match, C = m.convoy, core = m.world.playerCore;
    const rc = repairCost(), heal = Math.round(core.maxHp * CONVOY.repair.heal);
    const repairOff = C.repaired || core.hp >= core.maxHp || m.gold < rc;
    setText('cvRepairText', C.repaired ? 'Конвой починен' : core.hp >= core.maxHp ? 'Конвой цел' : `Починить +${heal}`);
    setText('cvRepairCost', C.repaired || core.hp >= core.maxHp ? '' : String(rc));
    setCls($('cvRepair'), 'disabled', repairOff, 'pkRepairOff');
    setText('cvRerollCost', rerollCost() ? String(rerollCost()) : 'даром');
    setCls($('cvReroll'), 'disabled', m.gold < rerollCost(), 'pkRerollOff');
  }

  // ------------------------------------------------------------ экраны
  function onScreen(name) {
    $('cvMenu').classList.toggle('hidden', name !== 'cmenu');
    $('cvHud').classList.toggle('hidden', !(name === 'match' || name === 'paused'));
    syncOverlays();
    if (name === 'cmenu') {
      renderMenu();
      if (MUSIC.current() !== 'menu') MUSIC.play('menu');
    }
  }
  function syncOverlays() {
    const C = match && match.convoy;
    const live = !!(C && screen === 'match');
    $('cvPick').classList.toggle('hidden', !(live && C.phase === 'pick'));
    $('cvHud').classList.toggle('picking', live && C.phase === 'pick');   // низкий экран: место под карты (style.css)
    $('cvResult').classList.toggle('hidden', !(live && C.phase === 'end' && C.shown));
  }
  function canPause() { return !(match && match.convoy && match.convoy.phase === 'end'); }
  function renderMenu() {
    const b = readBest();
    const el = $('cvMenuBest');
    if (!el) return;
    el.classList.toggle('hidden', !b.runs);
    el.textContent = b.wins ? `Рекорд: конвой доставлен · доставок: ${b.wins}` : `Рекорд: стоянка ${b.stop} из ${STOPS}`;
    // дорожка наград за славу: открытые — цветные, закрытые — с порогом; нажатие показывает, что даёт награда
    const total = readGlory().total, have = metaOf(total);
    menuDeco = { skin: have.includes('skin'), banner: have.includes('banner') };
    const box = $('cvMenuGlory');
    if (!box) return;
    const next = CONVOY.meta.find(u => u.at > total);
    const status = (u) => have.includes(u.id) ? `${u.name}: ${u.desc}. Открыто` : `${u.name}: ${u.desc}. Нужно славы: ${u.at} (сейчас ${total})`;
    box.innerHTML = `<div class="cv-meta-track">${CONVOY.meta.map((u, i) =>
      `<button class="cv-meta${have.includes(u.id) ? ' on' : ''}${u === next ? ' next' : ''}" data-i="${i}" aria-label="${status(u)}">` +
      `<canvas width="64" height="64"></canvas>${have.includes(u.id) ? '' : `<em>${u.at}</em>`}</button>`).join('')}</div>` +
      `<p id="cvMenuGloryText"><b>Слава: ${total}</b> · ${next ? `следующая награда — «${next.name}»: ещё ${next.at - total}` : 'все награды открыты'}</p>`;
    box.querySelectorAll('.cv-meta').forEach((btn) => {
      const u = CONVOY.meta[Number(btn.dataset.i)];
      drawCardIcon(btn.querySelector('canvas'), u);
      btn.addEventListener('click', () => { SFX.click(); $('cvMenuGloryText').textContent = status(u); });
    });
  }

  // ------------------------------------------------------------ журнал для наблюдателя (index.html?journal)
  function showJournal() {
    let box = $('cvJournal');
    if (!box) {
      box = document.createElement('div');
      box.id = 'cvJournal';
      box.className = 'cv-journal';
      document.body.appendChild(box);
    }
    const log = readLog();
    const p = playerNo();
    const time = (ts) => new Date(ts).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const rows = log.map((e, i) =>
      `<tr><td>${i + 1}</td><td>${time(e.ts)}</td><td>${e.player || 1}</td><td>${e.win ? 'доставлен' : `пал на ${e.stop}`}</td>` +
      `<td>${e.kills}</td><td>${e.gold}</td><td>×${e.streak || 0}</td><td>${e.rocks || 0}</td><td>${fmtSec(e.sec || 0)}</td><td>${e.glory || 0}</td>` +
      `<td>${(e.cards || []).map(id => (CARD_BY_ID[id] || { name: id }).name).join(', ')}</td></tr>`).reverse().join('');
    box.innerHTML = `<div class="cv-journal-card"><h2>Журнал походов</h2>` +
      `<p>Записей: ${log.length}. Сейчас играет: игрок ${p}.</p>` +
      `<div class="cv-journal-btns"><button class="menu-btn secondary small" id="cvJournalNext">Новый игрок (${p + 1})</button>` +
      `<button class="menu-btn secondary small" id="cvJournalSave">Скачать JSON</button>` +
      `<button class="menu-btn result-main small" id="cvJournalClose">Закрыть</button></div>` +
      `<div class="cv-journal-table"><table><thead><tr><th>#</th><th>Время</th><th>Игрок</th><th>Итог</th><th>Убито</th><th>Золото</th><th>Серия</th><th>Камни</th><th>Длит.</th><th>Слава</th><th>Карты</th></tr></thead>` +
      `<tbody>${rows || '<tr><td colspan="11">Пока пусто</td></tr>'}</tbody></table></div></div>`;
    $('cvJournalNext').addEventListener('click', () => {
      // новый игрок плейтеста начинает с нуля: без славы, наград и рекорда прошлого (журнал остаётся)
      try {
        localStorage.setItem(PLAYER_KEY, String(p + 1));
        localStorage.removeItem(GLORY_KEY);
        localStorage.removeItem(BEST_KEY);
      } catch (e) { /* без хранилища — один игрок */ }
      showJournal();
    });
    $('cvJournalSave').addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(log, null, 1)], { type: 'application/json' }));
      a.download = `last-convoy-journal-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    $('cvJournalClose').addEventListener('click', () => {
      box.remove();
      if (screen === 'cmenu') renderMenu();   // после «Новый игрок» меню показывает нулевую славу
    });
  }

  // ------------------------------------------------------------ отрисовка: конвой и дорога
  const WAGON_X = [52, 140];   // повозки крупнее бойцов: конвой — то, что защищаем
  let menuDeco = {};           // вид повозок в меню: открытые за славу полог и знамя (renderMenu)
  function newProp(x) {
    const r = Math.random();
    const depth = Math.random();
    return { x, kind: r < 0.45 ? 'tuft' : r < 0.75 ? 'stone' : r < 0.92 ? 'bush' : 'post', depth, y: 28 + depth * 60, s: 0.7 + depth * 0.6, seed: Math.random() };
  }
  function makeProps() {
    const out = [];
    for (let i = 0; i < 15; i++) out.push(newProp(-40 + i * 76 + Math.random() * 40));
    return out;
  }
  function drawProps(age) {
    const C = match.convoy;
    const ink = 'rgba(26,18,10,.8)';
    for (const p of C.props) {
      ctx.save();
      ctx.translate(p.x, ARENA.groundY + p.y);
      ctx.scale(p.s, p.s);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      if (p.kind === 'tuft') {
        ctx.strokeStyle = age.grass || '#79a23b'; ctx.lineWidth = 2.2;
        for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 2.5, 0); ctx.quadraticCurveTo(i * 3.5, -6, i * 4.5 + p.seed * 2, -10 - (i % 2) * 3); ctx.stroke(); }
      } else if (p.kind === 'stone') {
        ctx.fillStyle = age.stone || '#9a8c78'; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(0, -4, 8 + p.seed * 5, 5 + p.seed * 2, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(-3, -6, 3, 1.5, 0, 0, TAU); ctx.fill();
      } else if (p.kind === 'bush') {
        ctx.fillStyle = age.grass || '#79a23b'; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(-6, -7, 7, 0, TAU); ctx.arc(5, -8, 8, 0, TAU); ctx.arc(0, -13, 7, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(-6, -7, 7, Math.PI * 0.6, Math.PI * 1.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(5, -8, 8, Math.PI * 1.6, Math.PI * 0.4); ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(0, 0, 13, 3, 0, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = age.woodDark || '#6e4424'; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.rect(-2.5, -22, 5, 22); ctx.fill(); ctx.stroke();
        ctx.fillStyle = age.woodLight || '#b07a44'; ctx.beginPath(); ctx.rect(-6, -22, 12, 4); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }
  }
  function drawWagon(wx, i, s, hpFrac, t, roll, bob, deco) {
    const age = match.age;
    ctx.save();
    ctx.translate(wx, ARENA.groundY - bob);
    ctx.scale(s, s);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const ink = 'rgba(26,18,10,.85)';
    for (const dx of [-13, 13]) {
      ctx.fillStyle = age.woodDark; ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(dx, -8 + bob / s, 8, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.2;
      for (let a = 0; a < 3; a++) {
        const an = a * Math.PI / 3 + 0.3 + roll;
        ctx.beginPath(); ctx.moveTo(dx - Math.cos(an) * 7, -8 + bob / s - Math.sin(an) * 7); ctx.lineTo(dx + Math.cos(an) * 7, -8 + bob / s + Math.sin(an) * 7); ctx.stroke();
      }
    }
    ctx.fillStyle = age.woodLight; ctx.strokeStyle = ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-23, -26, 46, 13); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1;
    for (let x = -14; x < 23; x += 12) { ctx.beginPath(); ctx.moveTo(x, -26); ctx.lineTo(x, -13); ctx.stroke(); }
    if (deco.plating) {
      ctx.fillStyle = age.stone; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.rect(-25, -28, 50, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(-25, -17, 50, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e8e2d0';
      for (let x = -21; x <= 21; x += 14) { ctx.beginPath(); ctx.arc(x, -25.5, 1.3, 0, TAU); ctx.fill(); }
    }
    const torn = hpFrac < 0.5;
    const skin = deco.skin;   // «Расписной полог» (CONVOY.meta): красный полог с золотым узором
    ctx.fillStyle = skin ? (hpFrac < 0.3 ? '#8e3a2a' : '#c0442e') : hpFrac < 0.3 ? '#bba98a' : '#d9c9a3'; ctx.strokeStyle = ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-21, -26); ctx.quadraticCurveTo(-18, -50, 0, -50); ctx.quadraticCurveTo(18, -50, 21, -26); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (skin) {
      ctx.save(); ctx.clip();
      ctx.strokeStyle = '#f2c14a'; ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let k = 0; k <= 8; k++) ctx[k ? 'lineTo' : 'moveTo'](-22 + k * 5.5, k % 2 ? -40 : -34);
      ctx.stroke();
      ctx.fillStyle = '#f2c14a'; ctx.fillRect(-23, -30, 46, 3);
      ctx.fillStyle = '#f7ecd2';
      for (const [x, y] of [[-10, -45], [0, -47], [10, -45]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(80,60,30,.35)'; ctx.lineWidth = 1.2;
    for (const x of [-9, 0, 9]) { ctx.beginPath(); ctx.moveTo(x * 0.9, -26); ctx.quadraticCurveTo(x * 1.05, -44, x * 0.7, -49); ctx.stroke(); }
    if (torn) { ctx.fillStyle = 'rgba(26,18,10,.75)'; ctx.beginPath(); ctx.moveTo(4, -46); ctx.lineTo(11, -38); ctx.lineTo(6, -36); ctx.closePath(); ctx.fill(); }
    if (deco.shields) {
      ctx.fillStyle = '#8a6a3c'; ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      for (const y of [-40, -30]) { ctx.beginPath(); ctx.ellipse(22, y, 4.5, 6, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
    }
    if (deco.sacks) {
      ctx.fillStyle = '#e0c27a'; ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      for (const [x, y] of [[-15, -29], [-8, -30]]) { ctx.beginPath(); ctx.ellipse(x, y, 5, 4, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
    }
    ctx.strokeStyle = '#6a4a28'; ctx.lineWidth = 1.6;
    const arrows = hpFrac < 0.8 ? (hpFrac < 0.55 ? (hpFrac < 0.3 ? 3 : 2) : 1) : 0;
    for (let a = 0; a < arrows; a++) {
      const ax = 6 + a * 7 + i * 3, ay = -22 - (a % 2) * 4;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + 11, ay - 8); ctx.stroke();
      ctx.strokeStyle = '#f2e6cf'; ctx.beginPath(); ctx.moveTo(ax + 9, ay - 6.5); ctx.lineTo(ax + 12, ay - 11); ctx.stroke(); ctx.strokeStyle = '#6a4a28';
    }
    if (i === 1 && deco.ballista) {
      // баллиста на крыше второй повозки: ложе, дуга, болт (когда заряжена)
      ctx.fillStyle = age.woodDark; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.rect(-8, -56, 30, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(2, -51, 5, 6); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#5a3a1c'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(18, -67); ctx.quadraticCurveTo(13, -53, 18, -40); ctx.stroke();
      ctx.strokeStyle = '#efe6d0'; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(18, -67); ctx.lineTo(deco.ballReady ? -6 : 10, -53.5); ctx.lineTo(18, -40); ctx.stroke();
      if (deco.ballReady) {
        ctx.strokeStyle = '#9aa2ad'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(-6, -53.5); ctx.lineTo(26, -53.5); ctx.stroke();
      }
    }
    if (i === 0) {
      ctx.strokeStyle = age.woodDark; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-17, -26); ctx.lineTo(-17, -66); ctx.stroke();
      const wave = Math.sin(t * (deco.marching ? 7 : 3.2)) * 3;
      if (deco.banner) {
        // «Знамя похода» (CONVOY.meta): длинное золотое знамя с раздвоенным концом и навершие
        ctx.lineTo(-17, -74); ctx.stroke();
        ctx.fillStyle = deco.morale ? '#d8402a' : '#e8b845'; ctx.strokeStyle = ink; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-17, -73); ctx.quadraticCurveTo(-4, -76 + wave, 10, -70 + wave); ctx.lineTo(3, -64 + wave * 0.8);
        ctx.lineTo(10, -58 + wave); ctx.quadraticCurveTo(-4, -60 + wave, -17, -57); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = deco.morale ? '#ffd35c' : '#c0442e'; ctx.beginPath(); ctx.arc(-6, -66 + wave * 0.6, 3, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffd35c'; ctx.beginPath(); ctx.arc(-17, -76, 2.6, 0, TAU); ctx.fill(); ctx.stroke();
      } else {
        ctx.fillStyle = deco.morale ? '#d8402a' : ART.flags.player; ctx.strokeStyle = ink; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-17, -66); ctx.quadraticCurveTo(-8, -68 + wave, 2, -62 + wave); ctx.quadraticCurveTo(-8, -60 + wave, -17, -56); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
  }
  function wagonScale() { return Math.max(1.35, Math.min(1.9, VIEW.fig * 1.4)); }
  function drawStructures() {
    const m = match, core = m.world.playerCore, C = m.convoy;
    const hpFrac = Math.max(0, core.hp / core.maxHp);
    const t = performance.now() / 1000;
    if (C.props.length) drawProps(m.age);
    const flash = core.hitFlash > 0 ? core.hitFlash : 0;
    if (flash > 0) core.hitFlash = Math.max(0, flash - 0.06);
    const s = wagonScale();
    const marching = C.phase === 'march' && C.speed > 5;
    const deco = {
      plating: run && run.cards.includes('plating'), shields: run && run.mods.rangedTaken < 1,
      sacks: run && run.mods.income > 0, morale: run && run.cards.includes('morale'), marching,
      skin: hasMeta('skin'), banner: hasMeta('banner'),
      ballista: run && run.syn.ballista, ballReady: C.ballT <= 0.4,
    };
    WAGON_X.forEach((wx, i) => {
      const bob = marching ? Math.abs(Math.sin(t * 11 + i * 1.7)) * 1.6 * (C.speed / CONVOY.marchSpeed) : 0;
      drawWagon(wx, i, s, hpFrac, t, C.roll, bob, deco);
    });
    if (flash > 0) { ctx.save(); ctx.globalAlpha = flash * 0.5; ctx.fillStyle = '#fff'; ctx.fillRect(WAGON_X[0] - 32 * s, ARENA.groundY - 56 * s, WAGON_X[1] - WAGON_X[0] + 64 * s, 56 * s); ctx.restore(); }
    // повреждения видны издалека: дымок над передней повозкой с половины прочности, густой дым над обеими — с трети
    if (core.hp > 0 && hpFrac < 0.55) drawSmoke(WAGON_X[1] + 6 * s, ARENA.groundY - 36 * s, performance.now(), 2, 'rgba(70,62,55,.4)');
    if (core.hp > 0 && hpFrac < 0.3) drawSmoke(WAGON_X[0], ARENA.groundY - 40 * s, performance.now() + 700, 3, 'rgba(50,42,38,.6)');
    const bx = WAGON_X[0] - 24 * s, bw = WAGON_X[1] - WAGON_X[0] + 48 * s, bh = 8, by = ARENA.groundY - 76 * s;
    ctx.save();
    ctx.fillStyle = 'rgba(26,18,10,.7)'; ctx.fillRect(bx - 1.5, by - 1.5, bw + 3, bh + 3);
    ctx.fillStyle = hpFrac < 0.35 ? '#e0503a' : hpFrac < 0.6 ? '#e8b845' : '#5fc46a';
    ctx.fillRect(bx, by, bw * hpFrac, bh);
    ctx.restore();
  }
  // Сцена меню: те же повозки вместо крепостей и героя.
  function drawMenuWagons(t) {
    const fake = { world: { playerCore: { hp: 1, maxHp: 1, hitFlash: 0 } }, age: menuSceneAge() };
    const saved = match;
    match = fake;
    try { WAGON_X.forEach((wx, i) => drawWagon(wx, i, wagonScale(), 1, t, 0, 0, menuDeco)); }
    finally { match = saved; }
  }

  // ------------------------------------------------------------ отрисовка поверх боя
  function drawCoin(x, y, r, spin) {
    const sx = Math.max(0.2, Math.abs(Math.cos(spin)));
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, 1);
    ctx.fillStyle = '#c98a1c'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.fillStyle = '#f6c94a'; ctx.beginPath(); ctx.arc(0, 0, r * 0.74, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(40,24,8,.9)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,250,220,.9)'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.32, r * 0.24, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawText(text, x, y, size, fill, stroke, lw) {
    ctx.font = `${size}px 'Lilita One', 'Fredoka', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = lw; ctx.strokeStyle = stroke;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }
  function drawOverlay() {
    const m = match, C = m.convoy;
    if (!C) return;
    drawBattleFx(m, C);
    // прицел камнепада под курсором мыши
    if (aim.mouse && rockReady() && performance.now() - aim.at < 1500 && screen === 'match') {
      const width = CONVOY.rock.width * run.mods.rockWidth;
      const x = Math.max(110, Math.min(ARENA.laneMax, aim.x));
      const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 140);
      ctx.save();
      ctx.setLineDash([7, 6]);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(255,214,90,${0.55 + 0.35 * pulse})`;
      ctx.fillStyle = 'rgba(255,200,80,.12)';
      ctx.beginPath(); ctx.ellipse(x, ARENA.groundY + 10, width / 2, 14, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,214,90,.9)'; ctx.strokeStyle = 'rgba(40,24,8,.9)'; ctx.lineWidth = 1.5;
      const ay = ARENA.groundY - 70 - pulse * 6;
      ctx.beginPath(); ctx.moveTo(x - 8, ay); ctx.lineTo(x + 8, ay); ctx.lineTo(x, ay + 12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // монеты
    for (const c of C.coins) {
      if (c.t < 0) continue;
      const k = clamp01(c.t / c.dur), e = k * k;
      const x = (1 - e) * (1 - e) * c.x0 + 2 * (1 - e) * e * c.cx + e * e * c.x1;
      const y = (1 - e) * (1 - e) * c.y0 + 2 * (1 - e) * e * c.cy + e * e * c.y1;
      drawCoin(x, y, 7.5 * (1 - 0.25 * k), c.spin);
    }
    ctx.save();
    // большая надпись фазы (стоянка, «Волна отбита!», итог)
    const b = C.banner;
    if (b) {
      const k = b.t / b.life, inT = Math.min(1, b.t / 0.2);
      const alpha = k < 0.78 ? 1 : Math.max(0, 1 - (k - 0.78) / 0.22);
      const sc = (0.55 + 0.45 * (1 - Math.pow(1 - inT, 3))) * (1 + k * 0.05);
      // надпись стоянки — под подсказкой поверх боя, если та видна (низкий экран: иначе подсказка закрывает надпись)
      let y = VIEW.y0 + VIEW.h * 0.3;
      const tip = $('cvHint');
      if (tip && !tip.classList.contains('hidden')) {
        const r = tip.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
        if (r.height) y = Math.min(VIEW.y0 + VIEW.h * 0.45, Math.max(y, VIEW.y0 + (r.bottom - cr.top) / VIEW.k + 40));
      }
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(ARENA.width / 2, y);
      ctx.scale(sc, sc);
      drawText(b.text, 0, 0, 56, b.color === 'red' ? '#ff6a4a' : ART.hero.gold, 'rgba(30,18,8,.92)', 10);
      if (b.sub) drawText(b.sub, 0, 44, 24, '#fff4dc', 'rgba(30,18,8,.92)', 6);
      ctx.restore();
    }
    // серия убийств
    const L = C.streak.label;
    if (L) {
      const k = L.t / 1.5, inT = Math.min(1, L.t / 0.15);
      ctx.globalAlpha = k < 0.7 ? 1 : Math.max(0, 1 - (k - 0.7) / 0.3);
      const sc = 0.6 + 0.55 * (1 - Math.pow(1 - inT, 3)) - 0.1 * inT;
      ctx.save();
      ctx.translate(ARENA.width / 2 + 150, VIEW.y0 + VIEW.h * 0.18 - k * 14);
      ctx.rotate(-0.06);
      ctx.scale(sc, sc);
      drawText(`×${L.n} ${L.text}`, 0, 0, 44, '#ffb347', 'rgba(60,10,0,.92)', 9);
      drawText(`+${L.bonus} золота`, 0, 34, 20, '#fff0b0', 'rgba(30,18,8,.9)', 5);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawBattleFx(m, C) {
    const now = performance.now();
    // замах Вождя: красный круг на земле растёт до удара
    if (C.slam) {
      const k = clamp01(C.slam.t / CONVOY.boss.slamWind), R = CONVOY.boss.slamR;
      ctx.save();
      ctx.fillStyle = `rgba(220,50,30,${0.12 + 0.2 * k})`;
      ctx.strokeStyle = `rgba(255,90,60,${0.6 + 0.4 * Math.sin(now / 50)})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(C.slam.x, ARENA.groundY + 8, R, 15, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(C.slam.x, ARENA.groundY + 8, R * k, 15 * k, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // болты баллисты
    for (const b of C.bolts) {
      const y = ARENA.groundY + b.y;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,240,200,.35)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(b.x - 46, y); ctx.lineTo(b.x - 12, y); ctx.stroke();
      ctx.strokeStyle = '#6a4a28'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(b.x - 22, y); ctx.lineTo(b.x, y); ctx.stroke();
      ctx.fillStyle = '#c9ced6'; ctx.strokeStyle = 'rgba(26,18,10,.9)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(b.x, y - 4); ctx.lineTo(b.x + 9, y); ctx.lineTo(b.x, y + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // оглушённые: звёздочки над головой
    for (const u of m.world.units) {
      if (!(u.stunT > 0) || u.state === 'dead') continue;
      const h = 74 * VIEW.fig * (UNIT_TYPES[u.typeId].heightMult || 1) * (u.elite ? 1.35 : 1);
      for (let k = 0; k < 3; k++) {
        const a = now / 220 + k * TAU / 3;
        const x = u.x + Math.cos(a) * 11, y = ARENA.groundY - h + Math.sin(a) * 3;
        ctx.fillStyle = '#ffe066'; ctx.strokeStyle = 'rgba(40,24,8,.9)'; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let j = 0; j < 10; j++) { const b = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 2 : 4.6; ctx[j ? 'lineTo' : 'moveTo'](x + Math.cos(b) * r, y + Math.sin(b) * r); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    }
    // конвой при смерти: красные края, пульс со стуком сердца
    if (C.vignette > 0.01) {
      const beat = C.beatAt ? Math.max(0, 1 - (now - C.beatAt) / 380) : 0;
      const a = Math.min(0.75, C.vignette * (0.45 + 0.35 * beat));
      const cx = VIEW.x0 + VIEW.w / 2, cy = VIEW.y0 + VIEW.h / 2;
      const g = ctx.createRadialGradient(cx, cy, Math.min(VIEW.w, VIEW.h) * 0.35, cx, cy, Math.max(VIEW.w, VIEW.h) * 0.62);
      g.addColorStop(0, 'rgba(200,20,10,0)');
      g.addColorStop(1, `rgba(200,20,10,${a})`);
      ctx.save(); ctx.fillStyle = g; ctx.fillRect(VIEW.x0, VIEW.y0, VIEW.w, VIEW.h); ctx.restore();
    }
  }

  // ------------------------------------------------------------ иконки карт
  function drawClassIcon(cv, id) {
    const t = UNIT_TYPES[id], age = match ? match.age : AGES.stone;       // в меню матча ещё нет
    if (!ENEMY_SPECIAL_TYPES[id]) { drawUnitIcon(cv, t, age); return; }
    const c = cv.getContext('2d'), u = cv.height / 44;
    c.clearRect(0, 0, cv.width, cv.height);
    drawStickman(c, {
      x: cv.width / 2, y: cv.height - 3 * u, scale: 0.85 * u / RIG_K * (t.heightMult || 1) * 0.92,
      color: ART.player.fill, outline: ART.player.outline, facing: 1, shadow: false,
      walkPhase: Math.PI * 0.4, moving: true, weapon: age.weapon[t.role], roleAccent: ROLE_ACCENT[t.role],
      outfit: id, ageId: age.id,
    });
  }
  function drawCardIcon(cv, card) {
    const c = cv.getContext('2d');
    const W = cv.width, H = cv.height, u = W / 96;
    c.clearRect(0, 0, W, H);
    const ink = '#1a120a';
    const icon = card.icon;
    if (icon && typeof icon === 'object') {
      drawClassIcon(cv, icon.unit);
      if (icon.badge) drawBadge(c, icon.badge, W - 24 * u, H - 24 * u, 17 * u);
      return;
    }
    c.save();
    c.scale(u, u);
    c.lineJoin = 'round'; c.lineCap = 'round';
    const coin = (x, y, r) => {
      c.fillStyle = '#c98a1c'; c.strokeStyle = ink; c.lineWidth = 2.2;
      c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#f6c94a'; c.beginPath(); c.arc(x, y, r * 0.72, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,250,220,.9)'; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.32, r * 0.22, 0, TAU); c.fill();
    };
    const stack = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        c.fillStyle = '#c98a1c'; c.strokeStyle = ink; c.lineWidth = 2;
        c.beginPath(); c.ellipse(x, y - i * 7, 17, 6, 0, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = '#f6c94a'; c.beginPath(); c.ellipse(x, y - i * 7 - 1.5, 13, 4, 0, 0, TAU); c.fill();
      }
    };
    const boulder = (x, y, r, rot) => {
      c.save(); c.translate(x, y); c.rotate(rot || 0);
      c.fillStyle = '#8f8371'; c.strokeStyle = ink; c.lineWidth = 2.4;
      c.beginPath();
      const pts = [[-1, -0.55], [-0.35, -1], [0.55, -0.85], [1, -0.1], [0.7, 0.75], [-0.2, 1], [-0.95, 0.5]];
      pts.forEach(([px, py], i) => (i ? c.lineTo(px * r, py * r) : c.moveTo(px * r, py * r)));
      c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-r * 0.3, -r * 0.4, r * 0.35, r * 0.18, -0.4, 0, TAU); c.fill();
      c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(r * 0.25, r * 0.45, r * 0.45, r * 0.2, 0.3, 0, TAU); c.fill();
      c.restore();
    };
    const fallLines = (x, y, len) => {
      c.strokeStyle = 'rgba(255,214,140,.9)'; c.lineWidth = 3;
      for (const dx of [-8, 0, 8]) { c.beginPath(); c.moveTo(x + dx - 6, y - len); c.lineTo(x + dx, y - 6); c.stroke(); }
    };
    switch (icon) {
      case 'gold': stack(40, 70, 4); coin(66, 52, 14); break;
      case 'gold2': stack(30, 72, 3); stack(62, 72, 5); coin(48, 30, 13); break;
      case 'trophy':
        c.save(); c.translate(48, 50); c.rotate(-0.7);
        c.fillStyle = '#d9dde3'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.moveTo(-4, -40); c.lineTo(4, -40); c.lineTo(4, 14); c.lineTo(-4, 14); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#8a5a2c'; c.beginPath(); c.rect(-12, 14, 24, 6); c.fill(); c.stroke(); c.beginPath(); c.rect(-3, 20, 6, 14); c.fill(); c.stroke();
        c.restore();
        coin(56, 60, 20); break;
      case 'repair':
        c.fillStyle = '#b07a44'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.rect(14, 58, 68, 16); c.fill(); c.stroke();
        c.save(); c.translate(52, 40); c.rotate(0.6);
        c.fillStyle = '#7a5230'; c.beginPath(); c.rect(-4, -6, 8, 46); c.fill(); c.stroke();
        c.fillStyle = '#9aa2ad'; c.beginPath(); c.rect(-16, -18, 32, 14); c.fill(); c.stroke();
        c.restore();
        plus(c, 22, 30, 9); break;
      case 'hull':
        c.fillStyle = '#b07a44'; c.strokeStyle = ink; c.lineWidth = 2.2;
        for (let i = 0; i < 3; i++) { c.beginPath(); c.rect(16, 26 + i * 16, 64, 14); c.fill(); c.stroke(); }
        c.fillStyle = '#e8e2d0';
        for (let i = 0; i < 3; i++) for (const x of [22, 74]) { c.beginPath(); c.arc(x, 33 + i * 16, 2.2, 0, TAU); c.fill(); }
        plus(c, 72, 20, 10); break;
      case 'shield':
        c.fillStyle = '#8a6a3c'; c.strokeStyle = ink; c.lineWidth = 2.4;
        c.beginPath(); c.arc(46, 52, 30, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = '#b8935a'; c.beginPath(); c.arc(46, 52, 20, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = '#9aa2ad'; c.beginPath(); c.arc(46, 52, 7, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = '#6a4a28'; c.lineWidth = 3; c.beginPath(); c.moveTo(56, 44); c.lineTo(84, 20); c.stroke();
        c.strokeStyle = '#f2e6cf'; c.lineWidth = 3; c.beginPath(); c.moveTo(80, 23); c.lineTo(88, 14); c.stroke(); break;
      case 'rockHeavy': fallLines(48, 34, 26); boulder(48, 56, 24, 0.2); plus(c, 76, 24, 9); break;
      case 'clock':
        boulder(48, 54, 22, -0.3);
        c.strokeStyle = '#ffd35c'; c.lineWidth = 4;
        c.beginPath(); c.arc(48, 54, 36, -2.6, 0.9); c.stroke();
        c.fillStyle = '#ffd35c'; c.strokeStyle = ink; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(70, 86); c.lineTo(80, 72); c.lineTo(62, 74); c.closePath(); c.fill(); c.stroke(); break;
      case 'avalanche':
        boulder(26, 30, 11, 0.4); boulder(64, 22, 9, 1.2); boulder(44, 52, 14, 0.1); boulder(74, 60, 12, 2); boulder(22, 70, 10, 0.8); break;
      case 'double': fallLines(32, 30, 20); fallLines(66, 40, 20); boulder(32, 52, 18, 0.3); boulder(66, 62, 18, 1.4); break;
      case 'morale':
        c.strokeStyle = '#6e4424'; c.lineWidth = 4; c.beginPath(); c.moveTo(30, 88); c.lineTo(30, 10); c.stroke();
        c.fillStyle = '#d8402a'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.moveTo(30, 12); c.quadraticCurveTo(54, 4, 80, 18); c.quadraticCurveTo(66, 30, 80, 44); c.quadraticCurveTo(54, 34, 30, 44); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#ffd35c'; c.beginPath(); c.arc(52, 28, 7, 0, TAU); c.fill(); c.stroke(); break;
      case 'era': {
        // солнце эпохи над скрещёнными оружиями
        const g = c.createRadialGradient(48, 40, 4, 48, 40, 40);
        g.addColorStop(0, 'rgba(255,236,150,.95)'); g.addColorStop(1, 'rgba(255,190,60,0)');
        c.fillStyle = g; c.beginPath(); c.arc(48, 40, 40, 0, TAU); c.fill();
        c.strokeStyle = '#ffd35c'; c.lineWidth = 3;
        for (let k = 0; k < 10; k++) { const a = k * TAU / 10; c.beginPath(); c.moveTo(48 + Math.cos(a) * 22, 40 + Math.sin(a) * 22); c.lineTo(48 + Math.cos(a) * 32, 40 + Math.sin(a) * 32); c.stroke(); }
        for (const dir of [-1, 1]) {
          c.save(); c.translate(48, 58); c.rotate(dir * 0.7);
          c.fillStyle = '#7a5230'; c.strokeStyle = ink; c.lineWidth = 2.2;
          c.beginPath(); c.rect(-3, -6, 6, 40); c.fill(); c.stroke();
          c.fillStyle = dir < 0 ? '#9aa2ad' : '#c9873a';
          c.beginPath(); c.moveTo(-9, -6); c.lineTo(0, -30); c.lineTo(9, -6); c.closePath(); c.fill(); c.stroke();
          c.restore();
        }
        break;
      }
      case 'mobRage':
        for (const [x, sc] of [[24, 0.8], [72, 0.8], [48, 1]]) {
          c.fillStyle = '#e8d2b0'; c.strokeStyle = ink; c.lineWidth = 2.2;
          c.beginPath(); c.arc(x, 44 - sc * 6, 11 * sc, 0, TAU); c.fill(); c.stroke();
          c.beginPath(); c.moveTo(x - 12 * sc, 86); c.quadraticCurveTo(x, 50, x + 12 * sc, 86); c.closePath(); c.fill(); c.stroke();
        }
        c.fillStyle = '#d8402a'; c.strokeStyle = ink; c.lineWidth = 2;
        c.beginPath(); c.moveTo(48, 4); c.quadraticCurveTo(62, 18, 54, 26); c.quadraticCurveTo(58, 14, 48, 12); c.quadraticCurveTo(38, 14, 42, 26); c.quadraticCurveTo(34, 18, 48, 4); c.fill(); c.stroke();
        break;
      case 'arrowHail':
        c.strokeStyle = '#6a4a28'; c.lineWidth = 3;
        for (let k = 0; k < 7; k++) {
          const x = 14 + k * 11, y = 16 + (k % 3) * 14;
          c.beginPath(); c.moveTo(x - 10, y - 18); c.lineTo(x, y + 12); c.stroke();
          c.fillStyle = '#d9dde3'; c.strokeStyle = ink; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(x - 3, y + 8); c.lineTo(x + 1.5, y + 18); c.lineTo(x + 4, y + 7); c.closePath(); c.fill(); c.stroke();
          c.strokeStyle = '#6a4a28'; c.lineWidth = 3;
        }
        c.fillStyle = 'rgba(143,209,106,.55)'; c.beginPath(); c.ellipse(48, 84, 36, 6, 0, 0, TAU); c.fill();
        break;
      case 'shieldWall':
        for (const [x, y] of [[26, 54], [70, 54], [48, 46]]) {
          c.fillStyle = '#8a6a3c'; c.strokeStyle = ink; c.lineWidth = 2.4;
          c.beginPath(); c.moveTo(x - 16, y - 22); c.lineTo(x + 16, y - 22); c.lineTo(x + 16, y + 4); c.quadraticCurveTo(x, y + 26, x - 16, y + 4); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = '#7fb0ff'; c.beginPath(); c.arc(x, y - 6, 6, 0, TAU); c.fill(); c.stroke();
        }
        break;
      case 'rockBreaker':
        fallLines(48, 26, 22); boulder(48, 50, 20, 0.4);
        c.fillStyle = '#ffe066'; c.strokeStyle = ink; c.lineWidth = 1.6;
        for (const [x, y] of [[18, 78], [48, 86], [78, 78]]) {
          c.beginPath();
          for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 4 : 9; c[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
          c.closePath(); c.fill(); c.stroke();
        }
        break;
      case 'goldVein':
        boulder(48, 54, 34, 0.1);
        c.fillStyle = '#ffd35c'; c.strokeStyle = '#8a5a10'; c.lineWidth = 1.5;
        for (const [x, y, r] of [[36, 46, 7], [56, 58, 9], [48, 38, 5], [64, 44, 5], [40, 64, 5]]) { c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r, y); c.lineTo(x, y + r); c.lineTo(x - r, y); c.closePath(); c.fill(); c.stroke(); }
        coin(76, 20, 11);
        break;
      case 'ballista':
        c.fillStyle = '#8a5a2c'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.rect(16, 52, 60, 10); c.fill(); c.stroke();
        c.beginPath(); c.rect(40, 62, 10, 22); c.fill(); c.stroke();
        c.strokeStyle = '#5a3a1c'; c.lineWidth = 5;
        c.beginPath(); c.moveTo(70, 22); c.quadraticCurveTo(58, 57, 70, 92); c.stroke();
        c.strokeStyle = '#efe6d0'; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(70, 22); c.lineTo(22, 57); c.lineTo(70, 92); c.stroke();
        c.fillStyle = '#9aa2ad'; c.strokeStyle = ink; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(22, 55); c.lineTo(92, 55); c.lineTo(92, 51); c.lineTo(84, 47); c.lineTo(84, 55); c.stroke();
        c.beginPath(); c.moveTo(84, 49); c.lineTo(94, 53); c.lineTo(84, 57); c.closePath(); c.fill(); c.stroke();
        break;
      // награды за славу (CONVOY.meta)
      case 'cards4':
        [[-0.42, 20], [-0.14, 38], [0.14, 56], [0.42, 74]].forEach(([rot, x], k) => {
          c.save(); c.translate(x, 60); c.rotate(rot);
          c.fillStyle = ['#6e5338', '#3e5a86', '#6a3f8e', '#1f5a52'][k]; c.strokeStyle = ink; c.lineWidth = 2.2;
          c.beginPath(); c.rect(-13, -36, 26, 38); c.fill(); c.stroke();
          c.fillStyle = '#ffd35c'; c.beginPath(); c.arc(0, -20, 5, 0, TAU); c.fill();
          c.restore();
        });
        break;
      case 'skin':
        c.fillStyle = '#b07a44'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.rect(14, 62, 68, 14); c.fill(); c.stroke();
        c.fillStyle = '#c0442e';
        c.beginPath(); c.moveTo(18, 62); c.quadraticCurveTo(22, 16, 48, 16); c.quadraticCurveTo(74, 16, 78, 62); c.closePath(); c.fill(); c.stroke();
        c.save(); c.clip();
        c.strokeStyle = '#f2c14a'; c.lineWidth = 4;
        c.beginPath(); for (let k = 0; k <= 8; k++) c[k ? 'lineTo' : 'moveTo'](14 + k * 9, k % 2 ? 32 : 44); c.stroke();
        c.fillStyle = '#f2c14a'; c.fillRect(12, 52, 72, 5);
        c.restore();
        c.fillStyle = '#5a3a1c'; for (const x of [28, 68]) { c.beginPath(); c.arc(x, 80, 9, 0, TAU); c.fill(); c.stroke(); }
        break;
      case 'reroll':
        c.fillStyle = '#3e5a86'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.rect(34, 28, 28, 40); c.fill(); c.stroke();
        c.fillStyle = '#ffd35c'; c.beginPath(); c.arc(48, 46, 6, 0, TAU); c.fill();
        c.strokeStyle = '#7be07a'; c.lineWidth = 5;
        c.beginPath(); c.arc(48, 48, 36, -2.7, -0.6); c.stroke();
        c.beginPath(); c.arc(48, 48, 36, 0.45, 2.55); c.stroke();
        c.fillStyle = '#7be07a'; c.strokeStyle = ink; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(86, 22); c.lineTo(84, 42); c.lineTo(66, 32); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(10, 74); c.lineTo(12, 54); c.lineTo(30, 64); c.closePath(); c.fill(); c.stroke();
        break;
      case 'banner':
        c.strokeStyle = '#6e4424'; c.lineWidth = 4; c.beginPath(); c.moveTo(26, 90); c.lineTo(26, 10); c.stroke();
        c.fillStyle = '#e8b845'; c.strokeStyle = ink; c.lineWidth = 2.2;
        c.beginPath(); c.moveTo(26, 14); c.quadraticCurveTo(54, 6, 84, 18); c.lineTo(70, 34); c.lineTo(84, 50); c.quadraticCurveTo(54, 40, 26, 50); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#c0442e'; c.beginPath(); c.arc(50, 31, 8, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = '#ffd35c'; c.beginPath(); c.arc(26, 9, 5, 0, TAU); c.fill(); c.stroke();
        break;
      default: boulder(48, 50, 26, 0);
    }
    c.restore();
  }
  function plus(c, x, y, r) {
    c.fillStyle = '#7be07a'; c.strokeStyle = '#1a120a'; c.lineWidth = 2;
    c.beginPath();
    c.moveTo(x - r * 0.35, y - r); c.lineTo(x + r * 0.35, y - r); c.lineTo(x + r * 0.35, y - r * 0.35); c.lineTo(x + r, y - r * 0.35); c.lineTo(x + r, y + r * 0.35);
    c.lineTo(x + r * 0.35, y + r * 0.35); c.lineTo(x + r * 0.35, y + r); c.lineTo(x - r * 0.35, y + r); c.lineTo(x - r * 0.35, y + r * 0.35); c.lineTo(x - r, y + r * 0.35);
    c.lineTo(x - r, y - r * 0.35); c.lineTo(x - r * 0.35, y - r * 0.35); c.closePath(); c.fill(); c.stroke();
  }
  function drawBadge(c, kind, x, y, r) {
    c.save();
    c.lineJoin = 'round'; c.lineCap = 'round';
    const bg = { hp: '#d8402a', dmg: '#e8a23a', spd: '#4aa8ff', cost: '#f6c94a', x3: '#5fb35a' }[kind] || '#888';
    c.fillStyle = bg; c.strokeStyle = '#1a120a'; c.lineWidth = r * 0.16;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = '#fff8e6'; c.strokeStyle = '#fff8e6'; c.lineWidth = r * 0.2;
    if (kind === 'hp') {
      c.beginPath(); c.moveTo(x, y + r * 0.55);
      c.bezierCurveTo(x - r * 0.95, y - r * 0.05, x - r * 0.45, y - r * 0.8, x, y - r * 0.3);
      c.bezierCurveTo(x + r * 0.45, y - r * 0.8, x + r * 0.95, y - r * 0.05, x, y + r * 0.55); c.fill();
    } else if (kind === 'dmg') {
      c.beginPath(); c.moveTo(x - r * 0.5, y + r * 0.5); c.lineTo(x + r * 0.5, y - r * 0.5); c.stroke();
      c.beginPath(); c.moveTo(x - r * 0.55, y + r * 0.1); c.lineTo(x - r * 0.1, y + r * 0.55); c.stroke();
    } else if (kind === 'spd') {
      for (const dx of [-0.3, 0.2]) { c.beginPath(); c.moveTo(x + (dx - 0.2) * r, y - r * 0.45); c.lineTo(x + (dx + 0.2) * r, y); c.lineTo(x + (dx - 0.2) * r, y + r * 0.45); c.stroke(); }
    } else {
      c.font = `${Math.round(r * 1.1)}px 'Lilita One', sans-serif`;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = kind === 'cost' ? '#3a2406' : '#fff8e6';
      c.fillText(kind === 'cost' ? '−' : '×3', x, y + r * 0.05);
    }
    c.restore();
  }

  // ------------------------------------------------------------ день и вечер похода
  // Солнце идёт от утра на первой стоянке к закату на последней (game.js computeDayNight).
  function dayT() {
    if (!match || !match.convoy || !run) return 0.28;
    const C = match.convoy;
    let pos = run.stop - 1;
    if (C.phase === 'march') pos = run.stop - 2 + clamp01(C.phaseT / C.marchLen);
    return 0.12 + 0.76 * clamp01(Math.max(0, pos) / (STOPS - 1));
  }

  // ------------------------------------------------------------ безэкранная симуляция (tests/convoy_sim.py)
  // policy: { tick(api) — каждый шаг, pick(api) → id карты }. Возвращает итог похода.
  function simulate(policy, opts = {}) {
    const saved = match, savedRun = run, wasMuted = SFX.isMuted();
    SFX.setMuted(true); // звуки боя entities.js (удары, выстрелы) в расчёте не нужны
    newRun({ headless: true, policy, seed: opts.seed, meta: opts.meta, glory: opts.glory });
    match = setupMatch();
    startSquad();
    const maxSteps = (opts.maxSec || 1800) * 60;
    let i = 0;
    while (!run.finished && i < maxSteps) {
      if (policy && policy.tick) policy.tick(api);
      update(STEP);
      i++;
    }
    const out = {
      win: run.win, stop: run.win ? STOPS : run.stop, cards: run.cards.slice(), kills: run.stats.kills, lost: run.stats.lost,
      gold: Math.round(run.stats.gold), rocks: run.stats.rocks, streak: run.stats.bestStreak, sec: Math.round(match.elapsed),
      hp: Math.max(0, Math.ceil(match.world.playerCore.hp)), log: run.log, timeout: !run.finished,
      elites: run.stats.elites, veins: run.stats.veins, boss: !!run.stats.boss, syn: Object.keys(run.syn).length, age: run.ageStep, countered: run.stats.countered,
      glory: gloryOf().gain, meta: run.meta.length,
    };
    match = saved; run = savedRun;
    SFX.setMuted(wasMuted);
    return out;
  }

  // Действия для карт и политик симулятора.
  const api = {
    get m() { return match; }, get run() { return run; },
    unitCost, classes, buy, rockAt, rockAuto, rockReady, densestEnemyX, choose, repair, reroll, repairCost, rerollCost,
    gainGold: (n) => gainGold(n, ARENA.width / 2, ARENA.groundY - 170, 6),
    healConvoy, addConvoyHp, freeUnit, syncWorld, alive, enemiesLeft, ageUp,
  };

  // ------------------------------------------------------------ запуск
  function worldX(e) {
    const r = canvas.getBoundingClientRect();
    return VIEW.x0 + (e.clientX - r.left) / VIEW.k;
  }
  function boot() {
    document.body.classList.add('convoy');
    for (const id of ['joyBase', 'touchAttack', 'touchSpecial', 'touchPickaxe', 'touchCry', 'btnBuyback', 'heroMini', 'heroReviveBox']) {
      const el = $(id); if (el) el.remove();
    }
    $('cvPause').addEventListener('click', () => { SFX.click(); togglePause(); });
    $('cvMenuPlay').addEventListener('click', () => { SFX.unlock(); SFX.click(); startRun(); });
    $('cvResultAgain').addEventListener('click', () => { SFX.click(); startRun(); });
    $('cvResultMenu').addEventListener('click', () => { SFX.click(); toMenu(); });
    $('cvRepair').addEventListener('click', (e) => { repair(); e.currentTarget.blur(); });
    $('cvReroll').addEventListener('click', (e) => { reroll(); e.currentTarget.blur(); });
    $('cvRock').addEventListener('click', (e) => { rockAuto() || (match && match.convoy && match.convoy.phase === 'wave' && rockAt(aim.x)); e.currentTarget.blur(); });
    // камнепад — касанием или кликом по полю боя
    canvas.addEventListener('pointerdown', (e) => {
      if (screen !== 'match' || !match || !match.convoy || e.button > 0) return;
      aim.x = worldX(e); aim.at = performance.now(); aim.mouse = e.pointerType === 'mouse';
      if (match.convoy.phase === 'wave') rockAt(aim.x);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      aim.x = worldX(e); aim.at = performance.now(); aim.mouse = true;
    });
    // Потеря фокуса и уход со вкладки ставят бой на паузу; продолжить — только игроку.
    window.addEventListener('blur', () => { if (screen === 'match' && canPause()) showScreen('paused'); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && screen === 'match' && canPause()) showScreen('paused'); });
    showScreen('cmenu');
    if (new URLSearchParams(location.search).has('journal')) showJournal();
  }

  return {
    boot, startRun, newRun, setupMatch, update, updateHud, buy, buyIndex, key, choose, repair, reroll,
    rockAt, rockAuto, rockReady, toMenu, onScreen, canPause, drawStructures, drawMenuWagons, drawOverlay, dayT,
    showJournal, readLog, readBest, simulate, api, waveText, drawCardIcon,
    get run() { return run; },
  };
})();
