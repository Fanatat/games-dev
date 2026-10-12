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
  // Реклама (сборка 9, ВК): второй шанс раз за поход — половина прочности, враги у повозок
  // отлетают и стоят оглушённые; межэкранная — между походами, не чаще раза в gapSec.
  ads: { reviveHp: 0.5, reviveRadius: 320, revivePush: 150, reviveStun: 2.5, gapSec: 150 },
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
    { id: 'supplies', at: 15, v: 40, icon: 'gold', name: 'Запас в дорогу', desc: '{gold}+40 на старте' },
    { id: 'cardShield', at: 35, icon: { unit: 'shieldbearer' }, name: 'Щитоносцы', desc: 'Новая карта' },
    { id: 'hull', at: 60, v: 0.15, icon: 'hull', name: 'Крепкие борта', desc: '{hull}+15%' },
    { id: 'cardEra', at: 90, icon: 'era', name: 'Новая эпоха', desc: 'Новая карта' },
    { id: 'cardBomb', at: 120, icon: { unit: 'bomber' }, name: 'Бомбометатели', desc: 'Новая карта' },
    { id: 'rockCd', at: 155, v: 0.85, icon: 'clock', name: 'Сноровка', desc: '{cd}камнепад −15%' },
    { id: 'cards4', at: 195, icon: 'cards4', name: 'Широкий выбор', desc: '4 карты на выбор' },
    { id: 'skin', at: 240, icon: 'skin', name: 'Расписной полог', desc: 'Новый полог повозок' },
    { id: 'freeReroll', at: 290, icon: 'reroll', name: 'Гадальщик', desc: 'Первая смена карт даром' },
    { id: 'banner', at: 350, v: 1.08, icon: 'banner', name: 'Знамя похода', desc: '{dmg}+8% отряду' },
  ],
  // «Доблесть» — награды после последней: каждая ступень +per к урону и здоровью отряда (newRun);
  // первая стоит cost славы сверх from, каждая следующая на step дороже — хвост без конца, но всё медленнее.
  valor: { from: 350, cost: 100, step: 25, per: 0.03 },
  // Уровни похода: доставка конвоя на уровне открывает следующий. Те же 10 стоянок и роли врагов,
  // другой край (фон bg_rN, враги — js/sprites.js REGION_ENEMY), враги крепче (stat × к волне), слава × glory.
  // tint — цвет плитки, пока фона края нет или он грузится.
  levels: [
    { id: 1, name: 'Тракт', go: 'На тракт', boss: 'Вождь', stat: 1, glory: 1, tint: '#6f8f4e' },
    { id: 2, name: 'Сумрачный лес', go: 'В Сумрачный лес', boss: 'Вожак стаи', stat: 1.02, glory: 1.5, tint: '#2c3b2a' },
    { id: 3, name: 'Гнилые топи', go: 'В Гнилые топи', boss: 'Король-жаба', stat: 1.07, glory: 2, tint: '#3d4a2c' },
    { id: 4, name: 'Горный перевал', go: 'На Горный перевал', boss: 'Горный великан', stat: 1.1, glory: 2.5, tint: '#6b6458' },
    { id: 5, name: 'Красные пески', go: 'В Красные пески', boss: 'Чёрный скорпион', stat: 1.15, glory: 3, tint: '#a5683a' },
    { id: 6, name: 'Ледяной перевал', go: 'На Ледяной перевал', boss: 'Ледяной великан', stat: 1.2, glory: 3.5, tint: '#7f98aa' },
    { id: 7, name: 'Огненные земли', go: 'В Огненные земли', boss: 'Огненный демон', stat: 1.22, glory: 4, tint: '#6b2a1c' },
    { id: 8, name: 'Проклятые руины', go: 'В Проклятые руины', boss: 'Король-лич', stat: 1.18, glory: 4.5, tint: '#3a3446' },
  ],
  // Особенности краёв (сборка 11, вариант «А» основателя 12.10): у врагов края своё свойство (trait), у вожака —
  // свой особый удар (boss) сверх удара по земле и подмоги. trait.units — роли врагов, которые его несут
  // (кто они на рисунке — js/sprites.js REGION_ENEMY). Урон яда, огня и особых ударов — × силе врага (dmgMult).
  // Особый удар: замах wind с (видно, куда ляжет), потом раз в cd с; оглушили на замахе — сорван.
  lands: {
    2: { trait: { id: 'pack', desc: 'волки бегут быстрее', units: ['infantry', 'spear'], speed: 1.15 },
      boss: { id: 'howl', name: 'Вой', cd: 11, wind: 0.7, sec: 3, speed: 1.25, dmg: 1.1 } },
    3: { trait: { id: 'venom', desc: 'жабы плюются ядом', units: ['archer'], dps: 2, sec: 3 },
      boss: { id: 'spit', name: 'Ядовитый плевок', cd: 8, wind: 0.9, r: 70, sec: 4, dps: 5 } },
    4: { trait: { id: 'stun', desc: 'голем оглушает ударом', units: ['heavy'], stun: 0.7 },
      boss: { id: 'boulder', name: 'Валун', cd: 8, wind: 1, r: 60, dmg: 30, stun: 1.2 } },
    5: { trait: { id: 'leech', desc: 'гноллы лечатся ударами', units: ['infantry', 'spear', 'heavy'], share: 0.4 },
      boss: { id: 'burrow', name: 'Подкоп', cd: 10, wind: 1.1, r: 75, dmg: 26 } },
    6: { trait: { id: 'frost', desc: 'йети замедляют', units: ['archer', 'heavy'], sec: 1.8 },
      boss: { id: 'breath', name: 'Ледяное дыхание', cd: 9, wind: 0.9, len: 230, stun: 1.6, dmg: 10 } },
    7: { trait: { id: 'burn', desc: 'бесы поджигают', units: ['archer'], dps: 2.5, sec: 3 },
      boss: { id: 'meteor', name: 'Огненный дождь', cd: 11, wind: 1, n: 4, r: 42, dmg: 18, dps: 4, sec: 3 } },
    8: { trait: { id: 'undead', desc: 'скелеты встают снова', units: ['infantry', 'spear'], chance: 0.15, hp: 0.4, delay: 1.4 },
      boss: { id: 'raise', name: 'Поднять мёртвых', cd: 13, wind: 0.9, n: 2 } },
  },
  // Календарь: на выходе открыты уровни 1..open, следующий — в первую пятницу (weekday 5) не раньше чем
  // через gap дней после выхода, дальше по одному каждые gap дней; полночь по Москве (tz +3).
  // Играть уровень можно, когда он открыт календарём и конвой доставлен на предыдущем.
  // release — день выхода в ВК: поставить при выпуске (до него на стенде считается от этой даты).
  calendar: { release: '2026-10-12', open: 2, gap: 7, weekday: 5, tz: 3 },
  // Награда за вход (сборка 11): слава за первый заход в меню в новые сутки (полночь по Москве).
  // Дни подряд идут по кругу из семи; пропуск суток начинает круг заново. Окно — после первой славы.
  daily: [3, 4, 5, 6, 8, 10, 15],
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
  const dec = (v) => ruNum(Math.round(v * 10) / 10);
  const cls = (run, id) => run.mods.cls[id];
  // золото за врага-бойца на этой стоянке (как в onDeath) — для «Трофеев»
  const killGold = (run, k) => Math.max(1, R(UNIT_TYPES.infantry.cost * CONVOY.killShare * (1 + CONVOY.killGrowth * (run.stop - 1)) * run.mods.goldKill * k));
  const atkSec = (run, id) => UNIT_TYPES[id].atkInterval * cls(run, id).atk;
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
    id, rarity: 'rare', name, max: 1, icon: { unit }, big: '', desc: () => desc,
    cond: (run) => !owned(run, unit),
    apply: (run, api) => { run.unlocked.push(unit); if (unit === 'spear') run.mods.spear = true; api.freeUnit(unit); },
  });
  // В описаниях {hp} {dmg} {gold} {cd} {hull} {squad} {rock} — значки (fmtDesc): сердце, меч, монета, часы,
  // повозка, отряд, валун. Значок — в начале строки, дальше число или 1–2 слова.
  const classCard = (id, rarity, unit, stat, mult, name, max) => ({
    id, rarity, name, max, icon: { unit, badge: stat },
    big: `+${R((mult - 1) * 100)}%`,
    desc: (run) => stat === 'hp'
      ? `{hp}${R(hpOf(run, unit))} → ${R(hpOf(run, unit) * mult)}`
      : `{dmg}${R(dmgOf(run, unit))} → ${R(dmgOf(run, unit) * mult)}`,
    cond: (run) => owned(run, unit),
    apply: (run) => { cls(run, unit)[stat === 'hp' ? 'hp' : 'dmg'] *= mult; },
  });
  const cards = [
    classCard('tough', 'common', 'infantry', 'hp', 1.35, 'Закалка', 3),
    classCard('blades', 'common', 'infantry', 'dmg', 1.3, 'Острые клинки', 3),
    classCard('aim', 'common', 'archer', 'dmg', 1.3, 'Меткость', 3),
    classCard('armor', 'common', 'heavy', 'hp', 1.4, 'Тяжёлая броня', 3),
    classCard('hammer', 'common', 'heavy', 'dmg', 1.35, 'Боевой молот', 3),
    {
      id: 'treasury', rarity: 'common', name: 'Казна', max: 3, icon: 'gold', big: '+80',
      desc: () => '{gold}+80, в бою +1/с',
      apply: (run, api) => { api.gainGold(80); run.mods.income += 1; },
    },
    {
      id: 'patch', rarity: 'common', name: 'Ремонт', max: 99, icon: 'repair', big: '+35%',
      desc: (run, m) => `{hull}+${R(m.world.playerCore.maxHp * 0.35)}`,
      cond: (run, m) => m.world.playerCore.hp < m.world.playerCore.maxHp * 0.85,
      apply: (run, api) => api.healConvoy(0.35),
    },
    {
      id: 'plating', rarity: 'common', name: 'Обшивка', max: 3, icon: 'hull', big: '+150',
      desc: (run, m) => `{hull}${R(m.world.playerCore.maxHp)} → ${R(m.world.playerCore.maxHp + 150)}`,
      apply: (run, api) => api.addConvoyHp(150),
    },
    {
      id: 'heavyRocks', rarity: 'common', name: 'Тяжёлые камни', max: 3, icon: 'rockHeavy', big: '+50%',
      desc: (run) => `{dmg}${R(CONVOY.rock.dmg * run.mods.rockDmg)} → ${R(CONVOY.rock.dmg * run.mods.rockDmg * 1.5)}`,
      apply: (run) => { run.mods.rockDmg *= 1.5; },
    },
    {
      id: 'reinforce', rarity: 'common', name: 'Подкрепление', max: 99, icon: { unit: 'infantry', badge: 'x3' }, big: '+3',
      desc: () => '{squad}+3 бойца',
      apply: (run, api) => { for (let i = 0; i < 3; i++) api.freeUnit('infantry'); },
    },
    {
      id: 'quickBow', rarity: 'rare', name: 'Быстрая тетива', max: 2, icon: { unit: 'archer', badge: 'spd' }, big: '+25%',
      desc: (run) => `{cd}${dec(atkSec(run, 'archer'))} → ${dec(atkSec(run, 'archer') * 0.8)} с`,
      apply: (run) => { run.mods.cls.archer.atk *= 0.8; },
    },
    {
      id: 'cheapKit', rarity: 'rare', name: 'Дешёвый набор', max: 1, icon: { unit: 'infantry', badge: 'cost' }, big: '−25%',
      desc: (run, m, api) => `{gold}${api.unitCost('infantry')} → ${R(api.unitCost('infantry') * 0.75)}`,
      apply: (run) => { run.mods.cls.infantry.cost *= 0.75; },
    },
    newUnit('spears', 'spear', 'Копейщики', 'Сильны против тяжёлых'),
    newUnit('shieldbearers', 'shieldbearer', 'Щитоносцы', 'Держат удар'),
    newUnit('bombers', 'bomber', 'Бомбометатели', 'Бомба по толпе'),
    classCard('spearEdge', 'rare', 'spear', 'dmg', 1.35, 'Длинные пики', 2),
    {
      id: 'trophies', rarity: 'rare', name: 'Трофеи', max: 2, icon: 'trophy', big: '+50%',
      desc: (run) => `{gold}за врага ${killGold(run, 1)} → ${killGold(run, 1.5)}`,
      apply: (run) => { run.mods.goldKill *= 1.5; },
    },
    {
      id: 'shields', rarity: 'rare', name: 'Щиты на борт', max: 2, icon: 'shield', big: '−40%',
      desc: () => '{hull}стрелы −40%',
      apply: (run, api) => { run.mods.rangedTaken *= 0.6; api.syncWorld(); },
    },
    {
      id: 'quickRock', rarity: 'rare', name: 'Быстрый заряд', max: 2, icon: 'clock', big: '−30%',
      desc: (run) => `{cd}${Math.round(CONVOY.rock.cd * run.mods.rockCd)} → ${Math.round(CONVOY.rock.cd * run.mods.rockCd * 0.7)} с`,
      apply: (run) => { run.mods.rockCd *= 0.7; },
    },
    {
      id: 'avalanche', rarity: 'rare', name: 'Лавина', max: 2, icon: 'avalanche', big: '×1,5',
      desc: () => '{rock}шире, +6 камней',
      apply: (run) => { run.mods.rockWidth *= 1.5; run.mods.rockShells += 6; },
    },
    {
      id: 'morale', rarity: 'epic', name: 'Боевой дух', max: 2, icon: 'morale', big: '+20%',
      desc: () => '{dmg}+20% всему отряду',
      apply: (run) => { run.mods.allDmg *= 1.2; },
    },
    {
      id: 'doubleRock', rarity: 'epic', name: 'Двойной обвал', max: 1, icon: 'double', big: '×2',
      desc: () => '{rock}бьёт дважды',
      apply: (run) => { run.mods.rockDouble = true; },
    },
    {
      id: 'warChest', rarity: 'epic', name: 'Военная казна', max: 1, icon: 'gold2', big: '+150',
      desc: () => '{gold}+150, в бою +2/с',
      apply: (run, api) => { api.gainGold(150); run.mods.income += 2; },
    },
    {
      id: 'era', rarity: 'epic', name: 'Новая эпоха', max: 2, icon: 'era', big: '×1,35',
      desc: (run) => `${AGES[AGE_ORDER[(run.ageStep || 0) + 1]].name}: {hp}{dmg}+${R((AGE_UP.statMult - 1) * 100)}%`,
      cond: (run) => (run.ageStep || 0) < AGE_ORDER.length - 1,
      apply: (run, api) => api.ageUp(),
    },
    // сочетания: открываются тремя картами одного знака, всегда предлагаются первыми
    synergy('mobRage', 'mob', 'Ярость толпы', 'rage', '+3%',
      () => `{dmg}+${R(CONVOY.rage.per * 100)}% за бойца`),
    synergy('arrowHail', 'bow', 'Град стрел', 'hail', `${CONVOY.hail.cd} с`,
      () => `{cd}град стрел раз в ${CONVOY.hail.cd} с`),
    synergy('shieldWall', 'guard', 'Стена щитов', 'wall', `−${R((1 - CONVOY.wall) * 100)}%`,
      () => `{squad}урон по отряду −${R((1 - CONVOY.wall) * 100)}%`),
    synergy('rockBreaker', 'rock', 'Камнелом', 'breaker', '',
      () => '{rock}оглушают и отбрасывают'),
    synergy('goldVein', 'gold', 'Золотая жила', 'vein', `×${CONVOY.vein.mult}`,
      () => `{gold}×${CONVOY.vein.mult} с ${R(CONVOY.vein.chance * 100)}% врагов`),
    synergy('ballista', 'wagon', 'Баллиста', 'ballista', `${CONVOY.ballista.dmg}`,
      () => `{cd}болт насквозь раз в ${ruNum(CONVOY.ballista.cd)} с`),
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
  const LEVEL_KEY = 'lastconvoy_level_v1';   // выбранный в меню уровень
  const LEVELS = CONVOY.levels;
  const META = Object.fromEntries(CONVOY.meta.map(u => [u.id, u]));
  const JOURNAL_MAX = 500;
  const STOPS = CONVOY.waves.length;
  const TAU = Math.PI * 2;
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
    if (units.boss) parts.push(level().boss);
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
  // Рекорд уровня и слава (сборка 9) — в общем сейве progress (save.js): он
  // уходит в облако ВК и сливается с другими устройствами (max по полям).
  // Прежние ключи плейтеста (lastconvoy_best_v1[_lN], lastconvoy_glory_v1)
  // один раз переносятся в progress при старте — migrateLegacy().
  const bestKey = (lvl) => (lvl > 1 ? `${BEST_KEY}_l${lvl}` : BEST_KEY);
  const prog = () => (typeof progress !== 'undefined' && progress ? progress : null);
  function readBest(lvl = 1) {
    const p = prog(), v = p && p.cvBest && p.cvBest[lvl];
    return v ? { stop: v.stop || 0, wins: v.wins || 0, runs: v.runs || 0 } : { stop: 0, wins: 0, runs: 0 };
  }
  function migrateLegacy() {
    const p = prog();
    if (!p) return;
    let moved = false;
    try {
      const g = JSON.parse(localStorage.getItem(GLORY_KEY) || 'null');
      if (g && Number.isFinite(g.total)) { p.cvGlory = Math.max(p.cvGlory || 0, Math.floor(g.total)); moved = true; }
      localStorage.removeItem(GLORY_KEY);
      for (let lvl = 1; lvl <= 20; lvl++) {
        const b = JSON.parse(localStorage.getItem(bestKey(lvl)) || 'null');
        if (b && typeof b === 'object') {
          const c = readBest(lvl);
          if (!p.cvBest) p.cvBest = {};
          p.cvBest[lvl] = { stop: Math.max(c.stop, b.stop || 0), wins: Math.max(c.wins, b.wins || 0), runs: Math.max(c.runs, b.runs || 0) };
          moved = true;
        }
        localStorage.removeItem(bestKey(lvl));
      }
    } catch (e) { /* без хранилища переносить нечего */ }
    if (moved) saveProgress(p);
  }
  // ------------------------------------------------------------ календарь уровней
  // Время: в ВК — vk_ts из параметров запуска (часы устройства не открывают уровни раньше), иначе часы
  // устройства. На стенде ?day=9 сдвигает «сегодня» на 9 дней вперёд — проверить, как откроется уровень.
  const DAY = 864e5, HOUR = 36e5;
  const plural = (n, one, few, many) => n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many;
  const clock = (() => {
    let at = Date.now();
    try {
      const q = new URLSearchParams(location.search), ts = Number(q.get('vk_ts'));
      if (ts > 1e9) at = ts * 1000;
      else if (Number(q.get('day'))) at += Number(q.get('day')) * DAY;
    } catch (e) { /* без адреса — часы устройства */ }
    return { at, perf: performance.now() };
  })();
  const nowMs = () => clock.at + performance.now() - clock.perf;
  // Когда календарь открывает уровень id (мс UTC); 0 — открыт с выхода.
  function levelOpenAt(id) {
    const K = CONVOY.calendar;
    if (id <= K.open) return 0;
    const [y, m, d] = K.release.split('-').map(Number);
    const first = Date.UTC(y, m - 1, d) - K.tz * HOUR + K.gap * DAY;         // полночь по Москве + gap дней
    const dow = new Date(first + K.tz * HOUR).getUTCDay();
    return first + ((K.weekday - dow + 7) % 7) * DAY + (id - K.open - 1) * K.gap * DAY;
  }
  const calendarOpen = (id) => nowMs() >= levelOpenAt(id);
  // «через 9 дней» / «через 5 ч» до открытия уровня календарём
  function untilText(id) {
    const ms = levelOpenAt(id) - nowMs();
    if (ms < HOUR) return 'совсем скоро';
    if (ms < DAY) return `через ${Math.ceil(ms / HOUR)} ч`;
    const n = Math.ceil(ms / DAY);
    return `через ${n} ${plural(n, 'день', 'дня', 'дней')}`;
  }
  const openDate = (id) => new Date(levelOpenAt(id) + CONVOY.calendar.tz * HOUR)
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  // Открыто уровней: первый всегда, каждый следующий — после доставки на предыдущем, если его открыл календарь.
  function levelsOpen() {
    let n = 1;
    while (n < LEVELS.length && readBest(n).wins > 0 && calendarOpen(n + 1)) n++;
    return n;
  }
  function pickedLevel() {
    let v = 0;
    try { v = Number(localStorage.getItem(LEVEL_KEY)) || 0; } catch (e) { /* без хранилища — последний открытый */ }
    const open = levelsOpen();
    return v >= 1 && v <= open ? v : open;
  }
  function pickLevel(n) {
    try { localStorage.setItem(LEVEL_KEY, String(n)); } catch (e) { /* выбор живёт до перезагрузки */ }
    Sprites.setRegion(n);
  }
  const level = () => LEVELS[(run ? run.level : 1) - 1] || LEVELS[0];
  function saveRun() {
    const reached = run.win ? STOPS : run.stop;
    const prev = readBest(run.level);
    const best = { stop: Math.max(prev.stop || 0, reached), wins: (prev.wins || 0) + (run.win ? 1 : 0), runs: (prev.runs || 0) + 1 };
    run.record = { prev: prev.stop || 0, isNew: reached > (prev.stop || 0) || (run.win && !prev.wins) };
    // первая доставка открывает следующий уровень — он же становится выбранным
    const nextL = run.win && !prev.wins ? LEVELS[run.level] : null;
    run.unlock = nextL && calendarOpen(nextL.id) ? nextL : null;
    run.soon = nextL && !run.unlock ? nextL : null;            // доставили, а край ещё закрыт календарём
    const g = gloryOf(), was = readGlory().total;
    run.glory = { ...g, start: was, prev: was, total: was + g.gain, fresh: freshOf(was, was + g.gain) };
    const p = prog();
    if (p) {
      if (!p.cvBest) p.cvBest = {};
      p.cvBest[run.level] = best;
      p.cvGlory = run.glory.total;
      saveProgress(p);
    }
    try {
      if (run.unlock) localStorage.setItem(LEVEL_KEY, String(run.unlock.id));
      const log = readLog();
      log.push({
        ts: Date.now(), player: playerNo(), stop: reached, win: run.win, cards: run.cards.slice(),
        kills: run.stats.kills, gold: Math.round(run.stats.gold), sec: Math.round(match.elapsed), streak: run.stats.bestStreak,
        rocks: run.stats.rocks, hp: Math.max(0, Math.ceil(match.world.playerCore.hp)), glory: g.gain, level: run.level,
      });
      localStorage.setItem(RUNS_KEY, JSON.stringify(log.slice(-JOURNAL_MAX)));
    } catch (e) { /* без хранилища игра работает, только без рекорда и журнала */ }
  }

  // ------------------------------------------------------------ слава и открытия (этап 3)
  function readGlory() {
    const p = prog();
    return { total: p && Number.isFinite(p.cvGlory) ? p.cvGlory : 0 };
  }
  // ------------------------------------------------------------ награда за вход (сборка 11)
  const dayNo = () => Math.floor((nowMs() + CONVOY.calendar.tz * HOUR) / DAY);
  // Что дать сегодня: null — уже забрано (или ещё ни одного похода); иначе день круга и слава.
  function dailyOffer() {
    const p = prog(), today = dayNo();
    if (!p || !(readGlory().total > 0) || (p.cvDayLast || 0) >= today) return null;
    const streak = p.cvDayLast === today - 1 ? (p.cvDayStreak || 0) + 1 : 1;
    const D = CONVOY.daily, i = (streak - 1) % D.length;
    return { today, streak, i, glory: D[i] };
  }
  function renderDaily() {
    const o = screen === 'cmenu' ? dailyOffer() : null, el = $('cvDaily');
    if (!el) return;
    el.classList.toggle('hidden', !o);
    if (!o) return;
    const D = CONVOY.daily, star = '<svg class="ico"><use href="#i-star"/></svg>';
    $('cvDailyTrack').innerHTML = D.map((g, k) =>
      `<div class="${k < o.i ? 'done' : k === o.i ? 'now' : ''}${k === D.length - 1 ? ' big' : ''}"><small>День ${k + 1}</small><b>+${g}${star}</b></div>`).join('');
    setText('cvDailyText', o.streak > 1 ? `Ты заходишь ${o.streak} ${plural(o.streak, 'день', 'дня', 'дней')} подряд — награда растёт.` : 'Заходи каждый день — награда растёт. Пропуск начнёт круг заново.');
    $('cvDailyTake').innerHTML = `Забрать +${o.glory} ${star}`;
  }
  function takeDaily() {
    const o = dailyOffer(), p = prog();
    if (!o || !p) { renderDaily(); return; }
    p.cvGlory = (p.cvGlory || 0) + o.glory;
    p.cvDayLast = o.today;
    p.cvDayStreak = o.streak;
    saveProgress(p);
    SFX.coin(0.3);
    renderDaily();
    renderMenu();
  }

  function metaOf(total) { return CONVOY.meta.filter(u => total >= u.at).map(u => u.id); }
  // Ступень «Доблести» по всей славе: n — сколько ступеней, floor/next — слава начала текущей и следующей.
  function valorOf(total) {
    const V = CONVOY.valor;
    let n = 0, floor = V.from, cost = V.cost;
    while (total >= floor + cost) { floor += cost; n++; cost += V.step; }
    return { n, floor, next: floor + cost };
  }
  // Слава за поход: за сам поход, пройденные стоянки, вожаков, Вождя, доставку и каждых killsPer врагов.
  function gloryOf() {
    const G = CONVOY.glory, s = run.stats;
    const parts = [
      ['стоянки', (run.win ? STOPS : run.stop - 1) * G.perStop], ['вожаки', s.elites * G.elite],
      [level().boss, s.boss ? G.boss : 0], ['доставка', run.win ? G.win : 0],
      ['враги', Math.floor(s.kills / G.killsPer)], ['поход', G.run],
    ].map(([k, v]) => [k, Math.round(v * level().glory)]).filter(([, v]) => v > 0);
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
      id: ++runSeq, stop: 1, level: opts.level || 1, cards: [], mods: newMods(), seq: 0, log: [],
      tags: {}, unlocked: [], ageStep: 0, syn: {}, // знаки карт, открытые бойцы, эпоха отряда, сочетания
      stats: { kills: 0, gold: 0, lost: 0, bought: 0, bestStreak: 0, rocks: 0, elites: 0, veins: 0, boss: false, countered: 0 },
      finished: false, win: false, record: null, glory: null,
      headless: !!opts.headless, policy: opts.policy || null,
      rng: opts.seed ? seededRandom(opts.seed) : null,
      // открытые за славу награды; симулятор передаёт glory (или meta), иначе — свежий игрок
      meta: opts.meta || metaOf(opts.glory != null ? opts.glory : opts.headless ? 0 : readGlory().total),
      valor: valorOf(opts.glory != null ? opts.glory : opts.headless ? 0 : readGlory().total).n,
    };
    if (hasMeta('rockCd')) run.mods.rockCd *= META.rockCd.v;
    if (hasMeta('banner')) run.mods.allDmg *= META.banner.v;
    if (run.valor) {
      const k = 1 + run.valor * CONVOY.valor.per;
      run.mods.allDmg *= k;
      for (const cm of Object.values(run.mods.cls)) cm.hp *= k;
    }
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
        rockCd: 0, rockQueue: [], coins: [], coinChain: 0, coinChainT: 0, coinSum: 0,
        banner: null, streak: { n: 0, lastT: -9, label: null }, deniedAt: -9,
        offer: null, rerolls: 0, repaired: false, chosen: false, shown: false, win: false,
        props: headless ? [] : makeProps(), dustT: 0,
        boss: null, slam: null, slamT: 0, summoned: false,     // Вождь (updateBoss)
        spec: null, specT: 0, pools: [], risers: [], tipAt: -9, // особенности края (land): особый удар вожака, лужи, встающие
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
    world.onCoreDestroyed = () => { if (match && match.world === world) coreDown(); };
    world.onUnitDeath = (u) => { if (match && match.world === world) onDeath(u); };
    world.onImpact = (x) => { if (!headless) VFX.impact(match, x); };
    world.onStrike = (a, ref, kind) => { if (match && match.world === world) onStrike(a, ref, kind); };
    world.onHit = (ref, role) => {
      ref.lastHitRole = role;
      if (headless) return;
      if (role !== 'ranged' && role !== 'dot') VFX.meleeHit(match, ref.x, -34, ref.team !== 'player');
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

  function startRun(lvl) {
    newRun({ level: lvl || pickedLevel() });
    Sprites.setRegion(run.level);
    match = setupMatch();
    startSquad();
    cardKey = '';
    buildCards();
    for (const k of Object.keys(hudCache)) delete hudCache[k];
    $('cvPick').classList.add('hidden');
    updateHud();
    showScreen('match');
    // у каждого края свой трек на весь поход (луп); пока не готов — трек Тракта или старый боевой
    match.currentBattleTrack = 'cv_land_' + run.level;
    MUSIC.play(match.currentBattleTrack, { force: true });
    // ВК грузит ролик по проверке: заранее, чтобы к «Второму шансу» он успел прийти
    if (PLATFORM.rewardedPossible()) PLATFORM.checkRewardedAvailable();
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
    if (C.revive) return;   // ждём ответа на «Второй шанс» — бой стоит
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
      // Конвой пал — бой замирает: раньше за итогом враги продолжали бить отряд, который тянуло «домой» (как в тире).
      const lost = C.phase === 'end' && !C.win;
      if (lost) {
        for (const u of w.units) {
          if (u.state === 'dead') u.deathT = Math.min(1, u.deathT + dt / 0.6);
          else { u.state = 'idle'; u.attackTimer = 0; }
        }
        w.projectiles.length = 0;
        C.bolts && (C.bolts.length = 0);
      } else {
      updateVolley(w, dt, () => {});
      // свои всегда смотрят на врага в логике боя; разворот «домой» — только на шаг ниже
      for (const u of w.units) if (u.team === 'player' && u.state !== 'dead') u.dir = 1;
      if (C.phase === 'wave') tickSynergies(dt);
      tickStatus(dt);
      updateBolts(dt);
      updateUnits(w, dt, () => {});
      }
      if (!lost && (C.phase !== 'wave' || alive('enemy') === 0)) {
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
    m.world.enemyStatMult = C.def.stat * level().stat;
    C.waveHp = m.world.playerCore.hp;
    if (C.headless) return;
    const last = run.stop === STOPS;
    const sub = last ? `${level().boss}!` : run.stop === 1 && land() ? `${level().name}: ${land().trait.desc}` : run.stop === 1 && run.level > 1 ? level().name : '';
    banner(last ? 'Последняя стоянка!' : `Стоянка ${run.stop}`, sub, last ? 'red' : 'gold', 2.2);
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
    if (C.groupIdx >= def.groups.length && !C.queue.length && !C.risers.length && alive('enemy') === 0 && w.playerCore.hp > 0) clearWave();
  }
  function spawnFoe(q) {
    const m = match, C = m.convoy, w = m.world;
    let u;
    if (q.boss) {
      u = spawnEliteUnit(w, 'enemy', q.type, 1);
      if (!u) return;
      C.boss = u; C.slamT = CONVOY.boss.slamCd * 0.6; C.summoned = false; C.slam = null;
      C.spec = null; C.specT = land() ? land().boss.cd * 0.45 : 0;
      if (!C.headless) {
        banner(`${level().boss}!`, land() ? land().boss.name : '', 'red', 2.4);
        shakeScreen(m, 7);
        SFX.bossRoar();
        MUSIC.play('cv_boss');
        VFX.spawn(m, 'ring', u.x, -40, { size: 180, width: 7, life: 0.7, color: ART.enemy.eliteOutline, glow: ART.enemy.eliteGlow, gravity: 0 });
      }
    } else if (q.elite) {
      u = spawnEliteUnit(w, 'enemy', q.type, CONVOY.elite.hp);
      if (!u) return;
      u.dmgMult *= CONVOY.elite.dmg;
      if (!C.headless) {
        if (!C.banner || C.banner.t > 1.2) banner('Вожак!', '×2', 'red', 1.6, true);
        SFX.elite();
      }
    } else u = spawnUnit(w, 'enemy', q.type);
    if (u) u.speedMult = CONVOY.enemySpeed * traitSpeed(u);
  }
  // Вождь: удар по земле с замахом (круг на земле), на половине здоровья — подмога.
  function updateBoss(dt) {
    const m = match, C = m.convoy, w = m.world, B = CONVOY.boss, u = C.boss;
    if (!u || u.state === 'dead') { C.boss = null; C.slam = null; C.spec = null; return; }
    if (!C.summoned && u.hp <= u.maxHp * B.summonAt) {
      C.summoned = true;
      let i = 0;
      for (const [t, n] of Object.entries(B.adds)) for (let k = 0; k < n; k++) C.queue.push({ at: C.waveT + 0.4 + (i++) * CONVOY.spawnGap, type: t });
      C.queue.sort((a, b) => a.at - b.at);
      if (!C.headless) { banner('Подмога!', '', 'red', 1.6); SFX.bossRoar(); shakeScreen(m, 5); C.roarAt = m.elapsed; }
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
          C.smashAt = m.elapsed; // только рисунок: поза «удар по земле» (bossPose)
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
    if (C.spec) { tickSpec(u, dt); return; }
    C.slamT -= dt;
    C.specT -= dt;
    const L = land();
    if (L && C.specT <= 0 && C.slamT > 0.8 && !(u.stunT > 0) && u.x < ARENA.laneMax - 120) { startSpec(u, L.boss); return; }
    if (C.slamT <= 0 && u.state === 'attack' && !(u.stunT > 0)) {
      C.slam = { t: 0, x: u.x - 40 };
      if (!C.headless) SFX.alarm();
    }
  }
  // Поза рисунка Вождя (js/sprites.js): замах удара по земле, сам удар, рык подмоги; иначе обычные позы.
  function bossPose(u, t) {
    const C = match.convoy;
    if (!C || C.boss !== u) return null;
    if (C.slam || C.spec) return 'raise';
    if (C.smashAt !== undefined && t - C.smashAt < 0.45) return 'smash';
    if (C.roarAt !== undefined && t - C.roarAt < 1.4) return 'roar';
    return null;
  }
  // ------------------------------------------------------------ особенности краёв (CONVOY.lands)
  function land() { return run && CONVOY.lands[run.level] || null; }
  function traitSpeed(u) {
    const T = land() && land().trait;
    return T && T.id === 'pack' && T.units.includes(u.typeId) && u !== match.convoy.boss ? T.speed : 1;
  }
  // Подпись над бойцом при эффекте края — не чаще раза в 1,2 с, чтобы было понятно, что с ним.
  function landTip(u, text, color) {
    const m = match, C = m.convoy;
    if (C.headless || m.elapsed - C.tipAt < 1.2) return;
    C.tipAt = m.elapsed;
    VFX.floater(m, u.x, -92 * VIEW.fig, text, color);
  }
  // Удар врага дошёл (entities.js world.onStrike): свойство края.
  function onStrike(a, ref, kind) {
    const T = land() && land().trait;
    if (!T || a.team !== 'enemy' || kind !== 'unit' || ref.team !== 'player' || ref.state === 'dead') return;
    if (!T.units.includes(a.typeId) || a === match.convoy.boss) return;
    if (T.id === 'venom' || T.id === 'burn') {
      addDot(ref, T.id, T.dps * (a.dmgMult || 1), T.sec);
      landTip(ref, T.id === 'venom' ? 'Яд!' : 'Горит!', T.id === 'venom' ? '#9be35a' : '#ff9a3c');
    } else if (T.id === 'stun') {
      ref.stunT = Math.max(ref.stunT || 0, T.stun);
      landTip(ref, 'Оглушён!', '#ffe066');
    } else if (T.id === 'frost') {
      ref.slowT = Math.max(ref.slowT || 0, T.sec);
      landTip(ref, 'Холод!', '#9fd8ff');
    } else if (T.id === 'leech' && a.hp < a.maxHp) {
      a.hp = Math.min(a.maxHp, a.hp + UNIT_TYPES[a.typeId].dmg * (a.dmgMult || 1) * T.share);
      landTip(a, '+жизнь', '#ff6b6b');
    }
  }
  // Яд и огонь: урон по чуть-чуть, раз в 0,5 с (dealDamage с ролью 'dot' — без звука удара).
  function addDot(u, kind, dps, sec) {
    const d = u.dot;
    if (d && d.kind === kind) { d.t = Math.max(d.t, sec); d.dps = Math.max(d.dps, dps); return; }
    u.dot = { kind, dps, t: sec, acc: 0, tick: 0 };
  }
  function tickStatus(dt) {
    const m = match, C = m.convoy, w = m.world;
    for (const p of C.pools) {
      p.t -= dt;
      for (const u of w.units) if (u.team === 'player' && u.state !== 'dead' && Math.abs(u.x - p.x) <= p.r) addDot(u, p.kind, p.dps, 0.6);
    }
    if (C.pools.length) C.pools = C.pools.filter(p => p.t > 0);
    for (const u of w.units) {
      if (u.state === 'dead') continue;
      if (u.slowT > 0) u.slowT = Math.max(0, u.slowT - dt);
      if (u.frozeT > 0) u.frozeT = Math.max(0, u.frozeT - dt);
      if (u.howl && (u.howlT -= dt) <= 0) { u.speedMult /= u.howl.speed; u.dmgMult /= u.howl.dmg; u.howl = null; }
      const d = u.dot;
      if (!d) continue;
      d.t -= dt; d.acc += d.dps * dt; d.tick += dt;
      if (d.tick >= 0.5 || d.t <= 0) {
        const n = d.acc;
        d.tick = 0; d.acc = 0;
        if (n > 0) dealDamage(w, { kind: 'unit', ref: u }, n, () => {}, 'dot');
      }
      if (d.t <= 0) u.dot = null;
    }
    if (!C.risers.length) return;
    for (const r of C.risers) if ((r.t -= dt) <= 0) raiseFoe(r);
    C.risers = C.risers.filter(r => r.t > 0);
  }
  // Встающий скелет: там, где упал, с долей здоровья; золота за него почти нет.
  function raiseFoe(r) {
    const m = match, C = m.convoy;
    if (C.phase !== 'wave') return;
    const u = spawnUnit(m.world, 'enemy', r.type);
    if (!u) return;
    u.x = Math.max(ARENA.laneMin + 40, Math.min(ARENA.laneMax - 6, r.x));
    u.risen = true; u.cost = 1;
    u.hp = Math.max(1, Math.round(u.maxHp * r.hp));
    u.speedMult = CONVOY.enemySpeed;
    if (C.headless) return;
    VFX.burst(m, 'spark', u.x, -20 * VIEW.fig, 10, { speed: 120, life: 0.7, size: 3, colors: ['#c9a7ff', '#8a6bd6', '#e8e0ff'], lift: 50, gravity: -10 });
    landTip(u, 'Встал!', '#c9a7ff');
  }

  // Особый удар вожака края: цель выбирается на замахе и видна на земле, потом удар.
  function specTarget(u, S) {
    const w = match.world;
    const mine = w.units.filter(f => f.team === 'player' && f.state !== 'dead');
    if (S.id === 'howl' || S.id === 'raise' || S.id === 'breath') return u.x;
    if (!mine.length) return null;
    if (S.id === 'boulder' || S.id === 'burrow') return Math.min(...mine.map(f => f.x));   // по задним — стрелкам у повозок
    // плевок и огненный дождь — по самой густой кучке своих
    let best = mine[0].x, bn = -1;
    for (const f of mine) {
      const n = mine.filter(g => Math.abs(g.x - f.x) <= (S.r || 60)).length;
      if (n > bn) { bn = n; best = f.x; }
    }
    return best;
  }
  function startSpec(u, S) {
    const m = match, C = m.convoy, w = m.world;
    const x = specTarget(u, S);
    if (x == null) { C.specT = 1.5; return; }
    let xs = null;
    if (S.id === 'meteor') {
      const mine = w.units.filter(f => f.team === 'player' && f.state !== 'dead').map(f => f.x);
      xs = Array.from({ length: S.n }, (_, i) => i === 0 ? x : mine[Math.floor(rnd() * mine.length)] + (rnd() - 0.5) * 60);
    }
    C.spec = { S, t: 0, x, xs, from: u.x };
    if (C.headless) return;
    VFX.floater(m, u.x, -150 * VIEW.fig, `${S.name}!`, '#ffd0a0');
    SFX.alarm();
  }
  function hurtArea(x, r, dmg, fn) {
    const w = match.world;
    for (const f of w.units) {
      if (f.team !== 'player' || f.state === 'dead' || Math.abs(f.x - x) > r) continue;
      if (dmg > 0) dealDamage(w, { kind: 'unit', ref: f }, dmg, () => {}, 'heavy', null);
      if (fn && f.state !== 'dead') fn(f);
    }
  }
  function tickSpec(u, dt) {
    const m = match, C = m.convoy, w = m.world, sp = C.spec, S = sp.S, k = u.dmgMult || 1;
    sp.t += dt;
    u.attackTimer = Math.max(u.attackTimer, 0.2);       // на замахе обычным ударом не бьёт
    if (u.stunT > 0) { C.spec = null; C.specT = S.cd * 0.5; return; }  // оглушили — сорван
    if (sp.t < S.wind) return;
    const fx = !C.headless;
    if (S.id === 'howl') {
      for (const e of w.units) {
        if (e.team !== 'enemy' || e.state === 'dead') continue;
        if (!e.howl) { e.howl = S; e.speedMult = (e.speedMult || 1) * S.speed; e.dmgMult = (e.dmgMult || 1) * S.dmg; }
        e.howlT = S.sec;
      }
      C.roarAt = m.elapsed;
      if (fx) { SFX.bossRoar(); shakeScreen(m, 6); VFX.spawn(m, 'ring', u.x, -40, { size: 260, width: 6, life: 0.6, color: '#ff6a4a', gravity: 0 }); }
    } else if (S.id === 'spit') {
      C.pools.push({ x: sp.x, r: S.r, t: S.sec, life: S.sec, dps: S.dps * k, kind: 'venom' });
      if (fx) { SFX.hitRanged(); VFX.burst(m, 'spark', sp.x, -6, 14, { speed: 140, spread: Math.PI * 0.9, dir: -Math.PI / 2, life: 0.6, size: 3.4, colors: ['#9be35a', '#5fa83a', '#d8ff9a'], gravity: 260 }); }
    } else if (S.id === 'boulder') {
      hurtArea(sp.x, S.r, S.dmg * k, (f) => { f.stunT = Math.max(f.stunT || 0, S.stun); });
      if (fx) { SFX.slam(); shakeScreen(m, 9); requestHitStop(0.06); VFX.spawn(m, 'ring', sp.x, -4, { size: S.r * 2.2, width: 6, life: 0.45, color: '#c9b79a', gravity: 0 }); VFX.burst(m, 'dust', sp.x, -2, 16, { speed: 200, spread: Math.PI * 0.9, dir: -Math.PI / 2, life: 0.7, size: 6, color: ART.dust, gravity: 160, jitter: S.r * 0.6 }); }
    } else if (S.id === 'burrow') {
      u.x = Math.max(w.playerCore.x + 70, sp.x + 14);
      hurtArea(u.x, S.r, S.dmg * k, (f) => { f.x = Math.max(ARENA.laneMin, f.x - 16); });
      if (fx) { SFX.slam(); shakeScreen(m, 9); VFX.burst(m, 'dust', u.x, -2, 22, { speed: 240, spread: Math.PI * 0.9, dir: -Math.PI / 2, life: 0.8, size: 7, color: '#c99a5a', gravity: 160, jitter: 30 }); }
    } else if (S.id === 'breath') {
      for (const f of w.units) {
        if (f.team !== 'player' || f.state === 'dead' || f.x > u.x || f.x < u.x - S.len) continue;
        dealDamage(w, { kind: 'unit', ref: f }, S.dmg * k, () => {}, 'dot', null);
        if (f.state !== 'dead') { f.stunT = Math.max(f.stunT || 0, S.stun); f.frozeT = S.stun; }
      }
      if (fx) { SFX.hitRanged(); VFX.burst(m, 'spark', u.x - S.len / 2, -40, 22, { speed: 160, life: 0.8, size: 3.4, colors: ['#e8f6ff', '#9fd8ff', '#ffffff'], jitter: S.len / 2, gravity: 30 }); }
    } else if (S.id === 'meteor') {
      for (const x of sp.xs) {
        hurtArea(x, S.r, S.dmg * k, (f) => addDot(f, 'burn', S.dps * k, S.sec));
        if (fx) VFX.burst(m, 'spark', x, -6, 12, { speed: 170, spread: Math.PI * 0.9, dir: -Math.PI / 2, life: 0.6, size: 3.6, colors: ['#ffb347', '#ff6a2a', '#ffe08a'], gravity: 260 });
      }
      if (fx) { SFX.slam(); shakeScreen(m, 8); }
    } else if (S.id === 'raise') {
      for (let i = 0; i < S.n; i++) raiseFoe({ x: u.x - 60 - i * 26, type: 'infantry', hp: 1 });
      C.roarAt = m.elapsed;
      if (fx) { SFX.bossRoar(); VFX.spawn(m, 'ring', u.x, -40, { size: 220, width: 6, life: 0.6, color: '#b48aff', gravity: 0 }); }
    }
    C.spec = null;
    C.specT = S.cd;
  }

  function clearWave() {
    const m = match, C = m.convoy, w = m.world;
    C.boss = null; C.slam = null; C.bolts = []; C.spec = null; C.pools = []; C.risers = [];
    run.log.push({ stop: run.stop, hp: Math.ceil(w.playerCore.hp), lostHp: Math.round(C.waveHp - w.playerCore.hp), squad: alive('player'), gold: Math.floor(m.gold), sec: Math.round(m.elapsed) });
    if (run.stop >= STOPS) { finish(true); return; }
    C.phase = 'clear'; C.phaseT = 0;
    const bonus = CONVOY.clearBonus[0] + CONVOY.clearBonus[1] * run.stop;
    gainGold(bonus, ARENA.width / 2, ARENA.groundY - 170, 8);
    for (const u of w.units) {
      if (u.team !== 'player' || u.state === 'dead') continue;
      u.hp = Math.min(u.maxHp, u.hp + u.maxHp * CONVOY.squadHeal);
      u.dot = null; u.slowT = 0;                 // яд, огонь и холод края сходят вместе с ранами
      if (!C.headless) VFX.burst(m, 'spark', u.x, -30 * VIEW.fig, 4, { speed: 70, life: 0.7, size: 2.6, colors: ['#b8f5a0', '#6fd46a', '#fff6c0'], lift: 40, gravity: -20 });
    }
    if (C.headless) return;
    banner('Волна отбита!', `+${bonus}`, 'gold', CONVOY.clearSec + 0.3, true);
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
    SFX.era();
  }
  function repair() {
    const m = match, C = m && m.convoy;
    if (!C || C.phase !== 'pick' || C.chosen || C.repaired) return false;
    const core = m.world.playerCore, cost = repairCost();
    if (core.hp >= core.maxHp || m.gold < cost) { if (!C.headless) SFX.buyDenied(); return false; }
    m.gold -= cost;
    C.repaired = true;
    healConvoy(CONVOY.repair.heal);
    if (!C.headless) SFX.repair();
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

  // ------------------------------------------------------------ реклама (сборка 9)
  // Повозка пала: раз за поход — предложение «Второй шанс» за ролик; бой замирает до ответа.
  // Без рекламы площадки (стенд вне ВК, отказ ВК) — сразу итог, как раньше.
  let lastAdAt = performance.now();   // первая межэкранная — не раньше gapSec от запуска
  let runsEnded = 0;                   // походов, дошедших до итога в этой сессии
  function coreDown() {
    const C = match.convoy;
    if (C.revive || match.resolved) return;
    if (C.headless || run.revived || !PLATFORM.rewardedPossible()) { finish(false); return; }
    run.revived = true;
    C.revive = { state: 'check' };
    renderRevive();
    syncOverlays();
    SFX.alarm();
    // Сборка 11 (тест основателя в ВК 12.10): ВК ответил «ролика нет» — игра молча ушла на итог, и
    // предложения никто не увидел. Проверка заодно грузит ролик, поэтому спрашиваем второй раз; предложение
    // показываем в любом случае, а если ролик так и не придёт — по нажатию пишем «Реклама недоступна».
    const ask = () => PLATFORM.checkRewardedAvailable();
    ask().then((ok) => ok === false ? new Promise((res) => setTimeout(res, 1200)).then(ask) : ok).then(() => {
      if (!match || match.convoy !== C || !C.revive) return;
      C.revive.state = 'offer';
      renderRevive();
    });
  }
  function renderRevive() {
    const C = match && match.convoy, r = C && C.revive, btn = $('cvReviveAd');
    if (!r || !btn) return;
    btn.disabled = r.state !== 'offer';
    btn.querySelector('span').textContent = r.state === 'check' ? 'Готовим…' : r.state === 'ad' ? 'Реклама…' : r.state === 'none' ? 'Реклама недоступна' : 'Второй шанс';
  }
  function declineRevive() {
    const C = match && match.convoy;
    if (!C || !C.revive) return;
    C.revive = null;
    syncOverlays();
    finish(false);
  }
  function acceptRevive() {
    const C = match && match.convoy;
    if (!C || !C.revive || C.revive.state !== 'offer') return;
    C.revive.state = 'ad';
    renderRevive();
    PLATFORM.showBonusAd().then((r) => {
      if (!match || match.convoy !== C || !C.revive) return;
      if (!r.shown) {
        C.revive.state = 'none';
        renderRevive();
        setTimeout(() => { if (match && match.convoy === C) declineRevive(); }, 1400);
        return;
      }
      lastAdAt = performance.now();
      revive();
    });
  }
  function revive() {
    const m = match, C = m.convoy, core = m.world.playerCore, A = CONVOY.ads;
    C.revive = null;
    core.hp = Math.max(1, Math.round(core.maxHp * A.reviveHp));
    for (const u of m.world.units) {
      if (u.team !== 'enemy' || u.state === 'dead' || u.x - core.x > A.reviveRadius) continue;
      const boss = u === C.boss ? 0.35 : 1;
      u.stunT = Math.max(u.stunT || 0, A.reviveStun * boss);
      u.x = Math.min(ARENA.laneMax, u.x + A.revivePush * boss);
    }
    healConvoy(0);
    VFX.burst(m, 'spark', core.x + 40, -40, 26, { speed: 160, life: 1, size: 3.2, colors: ['#fff6c0', '#ffd35c', '#b8f5a0'], lift: 60, gravity: -10, jitter: 60 });
    shakeScreen(m, 5);
    banner('Второй шанс!', '', 'gold', 1.8);
    SFX.unlock();
    SFX.revive();
    syncOverlays();
    updateHud();
  }
  // Межэкранная — только при переходе с итога (в новый поход или в меню), не после первого похода
  // сессии и не чаще раза в CONVOY.ads.gapSec (считая и ролики за награду).
  function betweenRunsAd() {
    const due = runsEnded >= 2 && performance.now() - lastAdAt >= CONVOY.ads.gapSec * 1000;
    if (!due || !PLATFORM.supportsInterstitial()) return Promise.resolve(false);
    return PLATFORM.showInterstitial().then((shown) => { if (shown) lastAdAt = performance.now(); return shown; });
  }
  // «Слава ×2» на итоге: ролик — и слава похода начисляется ещё раз (раз за поход).
  function doubleGlory() {
    const g = run && run.glory, btn = $('cvGloryX2');
    if (!g || run.doubled || !btn || btn.disabled) return;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Реклама…';
    PLATFORM.showBonusAd().then((r) => {
      if (!run || run.glory !== g) return;
      if (!r.shown) {
        btn.querySelector('span').textContent = 'Реклама недоступна';
        setTimeout(() => { btn.disabled = false; btn.querySelector('span').textContent = 'Слава ×2'; }, 1600);
        return;
      }
      lastAdAt = performance.now();
      run.doubled = true;
      const was = g.total;
      g.prev = was;
      g.total = was + g.gain;
      g.gain *= 2;
      g.fresh = freshOf(g.start, g.total);                   // открытия обеих половин
      const p = prog();
      if (p) { p.cvGlory = Math.max(p.cvGlory || 0, g.total); saveProgress(p); }
      renderResultGlory(true);
    });
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
    runsEnded++;
    saveRun();
    syncOverlays();
    banner(win ? 'Конвой доставлен!' : 'Конвой пал', '', win ? 'gold' : 'red', CONVOY.endSec + 1);
    MUSIC.play(win ? 'cv_victory' : 'cv_defeat');
    if (!win) shakeScreen(m, 8);
  }
  // Итог похода: маршрут с отметкой, три значка-цифры, иконки взятых карт, слава до следующей награды.
  function showResult() {
    const win = run.win, reached = win ? STOPS : run.stop;
    $('cvResultTitle').textContent = win ? 'Конвой доставлен!' : 'Конвой пал';
    $('cvResultTitle').className = win ? 'win' : 'lose';
    $('cvResult').classList.toggle('celebrate', win);
    const track = $('cvResultTrack');
    track.innerHTML = Array.from({ length: STOPS }, (_, i) =>
      `<i class="${win || i < reached - 1 ? 'done' : i === reached - 1 ? 'fail' : ''}${i === STOPS - 1 ? ' last' : ''}"></i>`).join('');
    track.title = `Стоянка ${reached} из ${STOPS}`;
    const s = run.stats;
    $('cvResultStats').innerHTML =
      `<span class="cv-res-stat kills" title="Врагов повержено"><svg class="ico"><use href="#i-foe"/></svg><b data-n="${s.kills}">0</b></span>` +
      `<span class="cv-res-stat gold" title="Золота добыто"><i class="gold-dot"></i><b data-n="${Math.floor(s.gold)}">0</b></span>` +
      (s.bestStreak > 1 ? `<span class="cv-res-stat streak" title="Лучшая серия"><svg class="ico"><use href="#i-burst"/></svg><b>×${s.bestStreak}</b></span>` : '');
    const counts = {};
    for (const id of run.cards) counts[id] = (counts[id] || 0) + 1;
    const ids = Object.keys(counts), cardsBox = $('cvResultCards');
    cardsBox.innerHTML = ids.map(id => `<span class="cv-res-card r-${CARD_BY_ID[id].rarity}" title="${CARD_BY_ID[id].name}">` +
      `<canvas width="64" height="64"></canvas>${counts[id] > 1 ? `<em>×${counts[id]}</em>` : ''}</span>`).join('');
    cardsBox.querySelectorAll('canvas').forEach((cv, i) => drawCardIcon(cv, CARD_BY_ID[ids[i]]));
    const rec = run.record || { prev: 0, isNew: false };
    const best = $('cvResultBest');
    best.textContent = 'Новый рекорд!';
    best.classList.toggle('hidden', !rec.isNew);
    renderResultGlory();
    // доставили, и следующий уровень открыт — главная кнопка ведёт туда
    const next = win && LEVELS[run.level] && levelsOpen() > run.level ? LEVELS[run.level] : null;
    run.next = next ? next.id : run.level;
    $('cvResultAgain').textContent = next ? next.go : 'Ещё поход';
    if (run.unlock) {
      const row = document.createElement('div');
      row.className = 'cv-unlock cv-unlock-level';
      row.style.animationDelay = '0.4s';
      row.innerHTML = `<canvas width="170" height="110"></canvas><div><b>Открыт уровень ${run.unlock.id}</b><span>${run.unlock.name}</span></div>`;
      $('cvResultGlory').prepend(row);
      drawLevelThumb(row.querySelector('canvas'), run.unlock.id);
      Sprites.preload(run.unlock.id);
    } else if (run.soon) {
      const row = document.createElement('div');
      row.className = 'cv-unlock cv-unlock-level soon';
      row.style.animationDelay = '0.4s';
      row.innerHTML = `<canvas width="170" height="110"></canvas><div><b>Уровень ${run.soon.id} — ${untilText(run.soon.id)}</b>` +
        `<span>${run.soon.name} откроется ${openDate(run.soon.id)}</span></div>`;
      $('cvResultGlory').prepend(row);
      drawLevelThumb(row.querySelector('canvas'), run.soon.id);
    }
    countUp($('cvResultStats'));
    if (PLATFORM.supportsInterstitial()) PLATFORM.preloadInterstitial();
    syncOverlays();
  }
  // Числа итога набегают от нуля за 0,6 с (как слава) — итог «засчитывается» на глазах.
  function countUp(box) {
    const els = [...box.querySelectorAll('b[data-n]')], t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / 600), e = 1 - (1 - k) * (1 - k);
      for (const el of els) if (box.contains(el)) el.textContent = String(Math.round(Number(el.dataset.n) * e));
      if (k < 1 && els.some(el => box.contains(el))) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  // Слава за поход: «+N ★» набегает, шкала до следующей награды (её значок в конце), открытые награды выезжают со звуком.
  function renderResultGlory(doubled) {
    const box = $('cvResultGlory'), g = run.glory;
    if (!box) return;
    if (!g) { box.innerHTML = ''; return; }
    const next = CONVOY.meta.find(u => u.at > g.total);
    // все награды открыты — шкала до следующей ступени «Доблести»
    const v = valorOf(g.total), top = next ? next.at : v.next;
    const floor = next ? CONVOY.meta.filter(u => u.at <= g.total).reduce((a, u) => Math.max(a, u.at), 0) : v.floor;
    const frac = (x) => clamp01((x - floor) / (top - floor));
    const x2 = g.gain > 0 && !run.doubled && PLATFORM.rewardedPossible();
    box.innerHTML =
      '<div class="cv-glory-top"><b class="cv-glory-gain" title="Слава за поход"><span>+0</span><svg class="ico"><use href="#i-star"/></svg></b>' +
      (x2 ? '<button class="cv-ad-btn" id="cvGloryX2" title="Посмотреть рекламу — слава за поход ещё раз"><svg class="ico"><use href="#i-play"/></svg><span>Слава ×2</span></button>' : '') + '</div>' +
      `<div class="cv-glory-row"><div class="cv-glory-bar"><i style="width:${frac(g.prev) * 100}%"></i>` +
      `<span>${g.total} / ${top}</span></div>` +
      (next ? `<canvas class="cv-glory-next" width="64" height="64" title="${next.name}: ${plainDesc(next.desc)}"></canvas>` : '') + '</div>' +
      g.fresh.map((u, i) => `<div class="cv-unlock" style="animation-delay:${0.7 + i * 0.25}s"><canvas width="64" height="64"></canvas>` +
        `<div><b>Открыто: ${u.name}</b><span>${fmtDesc(u.desc)}</span></div></div>`).join('');
    if (next) drawCardIcon(box.querySelector('.cv-glory-next'), next);
    box.querySelectorAll('.cv-unlock canvas').forEach((cv, i) => drawCardIcon(cv, g.fresh[i]));
    if (x2) box.querySelector('#cvGloryX2').addEventListener('click', (e) => { SFX.click(); doubleGlory(); e.currentTarget.blur(); });
    const gain = box.querySelector('.cv-glory-gain span'), bar = box.querySelector('.cv-glory-bar i'), t0 = performance.now();
    const from = doubled ? g.gain / 2 : 0;
    const tick = () => {
      if (!box.contains(gain)) return;
      const k = Math.min(1, (performance.now() - t0) / 700);
      gain.textContent = `+${Math.round(from + (g.gain - from) * k)}`;
      if (k < 1) requestAnimationFrame(tick);
      else if (g.gain > 0) gain.parentNode.classList.add('pop');
    };
    requestAnimationFrame(() => { void bar.offsetWidth; bar.style.width = `${frac(g.total) * 100}%`; tick(); });
    if (g.fresh.length) setTimeout(() => { if (box.contains(gain)) SFX.gloryUnlock(); }, 700);
  }
  function toMenu() { match = null; run = null; Sprites.setRegion(pickedLevel()); syncOverlays(); showScreen('cmenu'); }

  // ------------------------------------------------------------ золото, монеты, серии
  function onDeath(u) {
    const m = match, C = m.convoy;
    if (!C.headless) VFX.unitDeath(m, u.x);
    if (u.team !== 'enemy') { run.stats.lost++; return; }
    run.stats.kills++;
    const T = land() && land().trait;   // «Нежить»: скелет встаёт снова (раз), если не вожак
    if (T && T.id === 'undead' && !u.risen && !u.elite && T.units.includes(u.typeId) && rnd() < T.chance) C.risers.push({ x: u.x, type: u.typeId, t: T.delay, hp: T.hp });
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
    banner(`${level().boss} повержен!`, '', 'gold', 2.2);
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
      const got = C.coins.reduce((a, c) => a + (c.done ? c.val : 0), 0);
      C.coinSum = (C.coinChainT > 0 ? C.coinSum || 0 : 0) + got;
      C.coins = C.coins.filter(c => !c.done);
      C.coinChain = C.coinChainT > 0 ? C.coinChain + arrived : arrived;
      C.coinChainT = 0.45;
      SFX.coin(Math.min(0.6, C.coinChain * 0.025));
      bumpGold(C.coinSum);
    }
    C.coinChainT -= dt;
    if (C.banner) { C.banner.t += dt; if (C.banner.t >= C.banner.life) C.banner = null; }
    if (m.ageFlash > 0) m.ageFlash = Math.max(0, m.ageFlash - dt / 0.5); // вспышка эпохи гаснет (game.js updateR15 в конвое не зовётся)
    const S = C.streak;
    if (S.label) { S.label.t += dt; if (S.label.t >= 1.5) S.label = null; }
  }
  function bumpGold(sum) {
    const el = $('cvGoldBox');
    if (!el) return;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    const tag = $('cvGoldGain');
    if (!tag || !(sum >= 1)) return;
    tag.textContent = `+${Math.round(sum)}`;
    tag.classList.remove('show'); void tag.offsetWidth; tag.classList.add('show');
  }
  // coin — перед подписью рисуется монета (подпись — сумма золота)
  function banner(text, sub, color, life, coin) {
    match.convoy.banner = { text, sub, color, t: 0, life: life || 1.8, coin: !!coin };
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
        VFX.floater(m, Math.max(140, Math.min(860, x)), -120, `${Math.ceil(C.rockCd)} с`, '#ffb08a');
        shake('cvRock');
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
    if (alive('player') >= CONVOY.unitCap) { deny(typeId, 'cvSquad'); return false; }
    const cost = unitCost(typeId);
    if (m.gold < cost) { deny(typeId, 'cvGoldBox'); return false; }
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
  // Отказ: плитка и то, чего не хватает (золото или место в отряде), вздрагивают — без надписи над полем.
  function deny(typeId, whyId) {
    if (match.convoy.headless) return;
    SFX.buyDenied();
    pulseCard(typeId, 'denied');
    shake(whyId);
  }
  function shake(id) {
    const el = id && $(id);
    if (!el) return;
    el.classList.remove('deny'); void el.offsetWidth; el.classList.add('deny');
    clearTimeout(el._denyT);
    el._denyT = setTimeout(() => el.classList.remove('deny'), 340);
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
  // Плитка найма (макет UI_МАКЕТЫ/КОНВОЙ_UI.md): портрет и цена на ленте; ▲ — вид усилен картами.
  // Имя и роль — только в title/aria-label: в бою игрок смотрит на картинки, а не читает.
  function buildCards() {
    const list = classes();
    const age = ageStatMult(run.ageStep);
    const sig = match.age.id + list.map(id => `${id}:${unitCost(id)}:${Math.round(UNIT_TYPES[id].hp * run.mods.cls[id].hp * age)}:${Math.round(UNIT_TYPES[id].dmg * run.mods.cls[id].dmg * run.mods.allDmg * age)}`).join('|');
    if (sig === cardKey && cardEls) return;
    cardKey = sig;
    const box = $('cvCards');
    box.innerHTML = '';
    cardEls = {};
    list.forEach((id, i) => {
      const L = CONVOY.labels[id], cm = run.mods.cls[id], cost = unitCost(id);
      const up = cm.hp > 1 || cm.dmg * run.mods.allDmg > 1 || cm.atk < 1;
      const btn = document.createElement('button');
      btn.className = 'cv-card';
      btn.dataset.unit = id;
      btn.title = `${L.name} — ${L.role.toLowerCase()}`;
      btn.setAttribute('aria-label', `${L.name}, цена ${cost}`);
      btn.innerHTML =
        `<canvas class="cv-card-icon" width="88" height="88"></canvas>` +
        (up ? '<span class="cv-card-up" aria-hidden="true">▲</span>' : '') +
        `<span class="cv-card-cost${cm.cost < 1 ? ' cheap' : ''}"><i class="gold-dot"></i>${cost}</span>` +
        `<span class="tool-key">${i + 1}</span>`;
      btn.addEventListener('click', () => { buy(id); btn.blur(); });
      box.appendChild(btn);
      drawClassIcon(btn.querySelector('canvas'), id);
      cardEls[id] = btn;
    });
    for (const k of Object.keys(hudCache)) if (k.startsWith('card')) delete hudCache[k];
    delete hudCache.lesson;
  }
  // Маршрут: 10 точек, текущая — крупная с номером (data-n), последняя — Вождь; повозка едет на марше.
  function buildTrack() {
    const box = $('cvTrack');
    if (box.childElementCount === STOPS + 1) return;
    box.innerHTML = Array.from({ length: STOPS }, (_, i) => `<i data-n="${i + 1}"${i === STOPS - 1 ? ' class="last"' : ''}></i>`).join('') +
      '<b class="cv-track-cart"><svg class="ico"><use href="#i-wagon"/></svg></b>';
  }
  function updateHud() {
    const m = match; if (!m || !m.convoy || !run) return;
    const C = m.convoy, w = m.world;
    const core = w.playerCore;
    const frac = Math.max(0, core.hp / core.maxHp);
    const fill = $('cvHpFill');
    const sx = frac.toFixed(3);
    if (hudCache.hpw !== sx) { hudCache.hpw = sx; fill.style.transform = `scaleX(${sx})`; }
    setCls(fill, 'low', frac < 0.35, 'hplow');
    setText('cvHpText', String(Math.max(0, Math.ceil(core.hp))));
    setText('cvStop', `Стоянка ${run.stop} из ${STOPS}`);
    buildTrack();
    const track = $('cvTrack');
    const cleared = C.phase === 'wave' || C.phase === 'march' ? run.stop - 1 : C.phase === 'end' && !C.win ? run.stop - 1 : run.stop;
    for (let i = 0; i < STOPS; i++) {
      const el = track.children[i];
      setCls(el, 'done', i < cleared, `tr${i}d`);
      setCls(el, 'now', i === run.stop - 1 && C.phase !== 'march' && !(C.phase === 'end' && C.win), `tr${i}n`);
      setCls(el, 'next', i === run.stop - 1 && C.phase === 'march', `tr${i}x`);
    }
    setCls(track, 'moving', C.phase === 'march', 'trmove');
    if (C.phase === 'march') {
      const pos = Math.max(0, run.stop - 2 + clamp01(C.phaseT / C.marchLen)) / (STOPS - 1);
      const left = `calc(.93em + (100% - 1.98em) * ${pos.toFixed(3)})`;
      if (hudCache.cart !== left) { hudCache.cart = left; track.lastElementChild.style.left = left; }
    }
    const wave = C.phase === 'wave';
    setCls($('cvStatus'), 'hidden', !wave, 'foeshide');
    if (wave) setText('cvFoes', String(enemiesLeft()));
    setText('cvGold', String(Math.floor(m.gold)));
    const squad = alive('player'), full = squad >= CONVOY.unitCap;
    setText('cvSquadN', `${squad}/${CONVOY.unitCap}`);
    setCls($('cvSquad'), 'full', full, 'sqfull');
    if (cardEls) for (const id of classes()) {
      const el = cardEls[id];
      if (!el) continue;
      setCls(el, 'disabled', full || m.resolved, `card:${id}`);
      setCls(el, 'poor', m.gold < unitCost(id), `cardp:${id}`);
    }
    // камнепад: шторка перезарядки, секунды, готовность
    const cdMax = rockCdMax();
    const cdFrac = C.phase === 'pick' || C.phase === 'end' ? 1 : clamp01(C.rockCd / cdMax);
    const cdPct = (cdFrac * 100).toFixed(0) + '%';
    if (hudCache.rockcd !== cdPct) { hudCache.rockcd = cdPct; $('cvRockCd').style.height = cdPct; }
    const ready = rockReady();
    const rock = $('cvRock');
    setCls(rock, 'ready', ready, 'rockready');
    setCls(rock, 'off', C.phase !== 'wave', 'rockoff');
    setText('cvRockTime', C.rockCd > 0 && C.phase !== 'pick' && C.phase !== 'end' ? `${Math.ceil(C.rockCd)}` : '');
    updatePointer(ready);
    setCls($('cvPause'), 'hidden', C.phase === 'end', 'pausehide');
    // полоса Вождя
    const boss = C.boss && C.boss.state !== 'dead' ? C.boss : null;
    setCls($('cvBoss'), 'hidden', !boss, 'bosshide');
    if (boss) {
      const bp = (Math.max(0, boss.hp / boss.maxHp) * 100).toFixed(1) + '%';
      if (hudCache.bossw !== bp) { hudCache.bossw = bp; $('cvBossFill').style.width = bp; }
      if (hudCache.bossn !== level().boss) { hudCache.bossn = level().boss; $('cvBoss').querySelector('.cv-boss-name').textContent = hudCache.bossn; }
      setCls($('cvBoss'), 'slam', !!C.slam, 'bossslam');
    }
    // собранные сочетания — значки под полосой прочности, имя во всплывающей подсказке
    const synSig = Object.keys(run.syn).join(',');
    if (hudCache.syn !== synSig) {
      hudCache.syn = synSig;
      const list = CONVOY_CARDS.filter(c => c.syn && run.syn[SYN_FLAG[c.id]]);
      $('cvSyn').innerHTML = list.map(c => `<canvas width="56" height="56" title="${c.name}" style="--tag:${CONVOY_TAGS[c.syn].color}"></canvas>`).join('');
      $('cvSyn').querySelectorAll('canvas').forEach((cv, i) => drawCardIcon(cv, list[i]));
    }
    if (C.phase === 'pick' && !C.chosen) updatePickButtons();
  }

  // Обучение действием: облачко из 1–2 слов со стрелкой над нужной плиткой (.cv-point), плитка светится.
  // Камнепад в первый раз — стрелка и кольцо прямо на поле, над толпой (drawOverlay → C.lesson).
  const COUNTER_TIP = { spear: 'Против копий!', archer: 'Против стрел!', infantry: 'Против пехоты!' };
  function lesson(ready) {
    const C = match.convoy;
    if (C.phase === 'pick' || C.phase === 'end' || match.resolved) return null;
    if (run.stop === 1 && run.stats.bought === 0 && (C.phase !== 'march' || C.phaseT > 0.6))
      return { unit: classes()[0], text: 'Найми!' };
    if (C.phase === 'wave' && ready && run.stats.rocks === 0 && alive('enemy') > 0 && C.waveT > 2 && run.stop <= 3)
      return { rock: true };
    if (C.phase === 'wave' && C.counter && C.waveT < CONVOY.counter.tipSec) {
      const into = C.counter.into;
      const unit = into === 'spear' ? 'archer' : into === 'archer' ? 'infantry' : classes().includes('spear') ? 'spear' : 'heavy';
      return { unit, text: COUNTER_TIP[into] };
    }
    return null;
  }
  let pointEl = null;
  function updatePointer(ready) {
    const C = match.convoy, L = lesson(ready);
    C.lesson = L && L.rock ? 'rock' : null;
    const target = L && !L.rock && cardEls ? cardEls[L.unit] : null;
    const sig = L ? (L.rock ? 'rock' : `${cardKey}|${L.unit}|${L.text}`) : '';
    if (!pointEl) {
      pointEl = document.createElement('div');
      pointEl.className = 'cv-point hidden';
      pointEl.setAttribute('aria-live', 'polite');
      pointEl.innerHTML = '<div class="cv-point-in"><span class="cv-point-bubble"></span><i class="cv-point-arrow"></i></div>';
      $('cvHud').appendChild(pointEl);
    }
    if (hudCache.lesson !== sig) {
      hudCache.lesson = sig;
      if (cardEls) for (const [id, el] of Object.entries(cardEls)) el.classList.toggle('hint', !!target && id === L.unit);
      $('cvRock').classList.toggle('hint', !!(L && L.rock));
      pointEl.querySelector('.cv-point-bubble').textContent = target ? L.text : '';
      pointEl.classList.toggle('hidden', !target);
      delete hudCache.pointAt;
    }
    if (!target) return;
    const r = target.getBoundingClientRect(), h = $('cvHud').getBoundingClientRect();
    const at = `${Math.round(r.left + r.width / 2 - h.left)},${Math.round(r.top - h.top - 4)}`;
    if (hudCache.pointAt === at) return;
    hudCache.pointAt = at;
    const [x, y] = at.split(',');
    pointEl.style.left = `${x}px`; pointEl.style.top = `${y}px`;
  }

  // ------------------------------------------------------------ окно выбора карты
  // Карточка награды: самоцвет редкости (у сочетания — лента), иконка с крупным числом, имя, одна строка, знак.
  function renderPick() {
    const C = match.convoy;
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
        '<span class="cv-pick-shine"></span>' +
        (card.rarity === 'synergy' ? '<span class="cv-pick-ribbon">Сочетание</span>' : '<i class="cv-gem" aria-hidden="true"></i>') +
        '<span class="cv-pick-art"><canvas class="cv-pick-icon" width="120" height="120"></canvas>' +
        (card.big ? `<b class="cv-pick-big">${card.big}</b>` : '') + '</span>' +
        `<span class="cv-pick-name">${card.name}</span>` +
        `<span class="cv-pick-desc">${fmtDesc(card.desc(run, match, api))}</span>` +
        tagLine(card) +
        (have ? `<span class="cv-pick-have" title="Уже взято: ${have}">Ур. ${have + 1}</span>` : '') +
        `<span class="tool-key">${i + 1}</span>`;
      btn.addEventListener('click', () => choose(card.id));
      box.appendChild(btn);
      drawCardIcon(btn.querySelector('canvas'), card);
    });
    for (const k of ['pkRepair', 'pkRepairHide', 'pkReroll', 'pkRepairOff', 'pkRerollOff', 'pkRerollFree']) delete hudCache[k];
    updatePickButtons();
  }
  const DESC_ICON = {
    hp: '<svg class="ico"><use href="#i-heart"/></svg>', dmg: '<svg class="ico"><use href="#i-dmg"/></svg>',
    gold: '<i class="gold-dot"></i>', cd: '<svg class="ico"><use href="#i-clock"/></svg>', hull: '<svg class="ico"><use href="#i-wagon"/></svg>',
    squad: '<svg class="ico"><use href="#i-squad"/></svg>', rock: '<svg class="ico"><use href="#i-rock"/></svg>',
  };
  function fmtDesc(s) { return s.replace(/\{(\w+)\}/g, (all, k) => DESC_ICON[k] || all); }
  function plainDesc(s) { return s.replace(/\{\w+\}/g, ''); }   // для title: без значков
  // Знак карты: «Толпа ●●○» — сколько будет после этой карты; третья открывает сочетание.
  function tagLine(card) {
    const tag = card.syn || card.tag;
    if (!tag) return '';
    const T = CONVOY_TAGS[tag], need = CONVOY.synergyNeed;
    if (card.syn) return `<span class="cv-pick-tag syn" style="--tag:${T.color}"><span>${T.name}</span>${'<i class="on"></i>'.repeat(need)}</span>`;
    const synCard = CONVOY_CARDS.find(c => c.syn === tag);
    const synTaken = synCard && run.cards.includes(synCard.id);
    const now = run.tags[tag] || 0, after = Math.min(need, now + 1);
    const dots = Array.from({ length: need }, (_, k) => `<i class="${k < now ? 'on' : k < after ? 'add' : ''}"></i>`).join('');
    const opens = !synTaken && now < need && after >= need;
    return `<span class="cv-pick-tag${opens ? ' opens' : ''}" style="--tag:${T.color}"><span>${T.name}</span>${synTaken || now >= need ? '' : dots}` +
      `${opens ? `<em>→ ${synCard.name}</em>` : ''}</span>`;
  }
  // «Другие карты» — цена или «даром»; починка видна, только пока конвой ранен и на этой стоянке не чинился.
  function updatePickButtons() {
    const m = match, C = m.convoy, core = m.world.playerCore;
    const rc = repairCost(), heal = Math.round(core.maxHp * CONVOY.repair.heal);
    setCls($('cvRepair'), 'hidden', !!C.repaired || core.hp >= core.maxHp, 'pkRepairHide');
    setCls($('cvRepair'), 'disabled', m.gold < rc, 'pkRepairOff');
    setText('cvRepairText', `+${heal}`);
    setText('cvRepairCost', String(rc));
    const cost = rerollCost();
    setText('cvRerollCost', cost ? String(cost) : 'даром');
    setCls($('cvRerollBox'), 'free', !cost, 'pkRerollFree');
    setCls($('cvReroll'), 'disabled', m.gold < cost, 'pkRerollOff');
  }

  // ------------------------------------------------------------ экраны
  function onScreen(name) {
    $('cvMenu').classList.toggle('hidden', name !== 'cmenu');
    $('cvHud').classList.toggle('hidden', !(name === 'match' || name === 'paused'));
    syncOverlays();
    renderDaily();
    if (name === 'cmenu') {
      renderMenu();
      MUSIC.play('cv_menu'); // тот же трек уже звучит — play() ничего не делает
    }
  }
  function syncOverlays() {
    const C = match && match.convoy;
    const live = !!(C && screen === 'match');
    $('cvPick').classList.toggle('hidden', !(live && C.phase === 'pick'));
    $('cvHud').classList.toggle('picking', live && C.phase === 'pick');   // низкий экран: место под карты (style.css)
    $('cvResult').classList.toggle('hidden', !(live && C.phase === 'end' && C.shown));
    $('cvRevive').classList.toggle('hidden', !(live && C.revive));
  }
  function canPause() { return !(match && match.convoy && (match.convoy.phase === 'end' || match.convoy.revive)); }
  // Меню: рекорд одной плашкой и следующая награда за славу — иконка, имя, шкала, точки всех наград.
  function renderMenu() {
    Sprites.setRegion(pickedLevel());
    renderLevels();
    const el = $('cvMenuBest');
    if (!el) return;
    el.classList.add('hidden');   // рекорд — на плитке своего уровня
    const total = readGlory().total, have = metaOf(total);
    menuDeco = { skin: have.includes('skin'), banner: have.includes('banner') };
    const box = $('cvMenuGlory');
    if (!box) return;
    const next = CONVOY.meta.find(u => u.at > total);
    const floor = CONVOY.meta.filter(u => u.at <= total).reduce((a, u) => Math.max(a, u.at), 0);
    const pips = CONVOY.meta.map(u => `<i class="${have.includes(u.id) ? 'on' : u === next ? 'next' : ''}" title="${u.name}"></i>`).join('');
    const shown = next || CONVOY.meta[CONVOY.meta.length - 1];
    box.innerHTML =
      `<div class="cv-next"${next ? ' title="Следующая награда за славу"' : ''}><canvas class="cv-next-ico" width="96" height="96"></canvas><div class="cv-next-body">` +
      (next
        ? `<b class="cv-next-name">${next.name}</b><span class="cv-next-desc">${fmtDesc(next.desc)}</span>` +
          `<div class="cv-glory-bar"><i style="width:${clamp01((total - floor) / (next.at - floor)) * 100}%"></i>` +
          `<span>${total} / ${next.at} <svg class="ico"><use href="#i-star"/></svg></span></div>`
        : valorRow(total)) +
      `<div class="cv-pips" aria-label="Открыто наград: ${have.length} из ${CONVOY.meta.length}">${pips}</div></div></div>`;
    drawCardIcon(box.querySelector('canvas'), shown);
  }

  function freshOf(from, to) {
    const out = CONVOY.meta.filter(u => u.at > from && u.at <= to);
    const a = valorOf(from).n, b = valorOf(to).n, per = CONVOY.valor.per;
    if (b > a) out.push({ id: 'valor', icon: 'banner', name: `Доблесть ${b}`, desc: `{dmg}+${Math.round(b * per * 100)}% урона и здоровья отряду` });
    return out;
  }
  // После всех наград — «Доблесть»: ступень, прибавка отряду и шкала до следующей ступени.
  function valorRow(total) {
    const v = valorOf(total), V = CONVOY.valor;
    const name = v.n ? `Доблесть ${v.n}` : 'Доблесть', pct = Math.round(v.n * V.per * 100);
    return `<b class="cv-next-name">${name}</b><span class="cv-next-desc">` +
      (v.n ? `${fmtDesc('{dmg}')}+${pct}% урона и здоровья отряду` : `Каждая ступень: +${Math.round(V.per * 100)}% урона и здоровья отряду`) + '</span>' +
      `<div class="cv-glory-bar"><i style="width:${clamp01((total - v.floor) / (v.next - v.floor)) * 100}%"></i>` +
      `<span>${total} / ${v.next} <svg class="ico"><use href="#i-star"/></svg></span></div>`;
  }

  // Плитки уровней в меню: край (фон и его враг), номер, рекорд; закрытый — замок. Нажатие выбирает уровень.
  // Видны открытые уровни и один следующий: «доставь конвой» или тёмный «откроется через N дней».
  function renderLevels() {
    const box = $('cvMenuLevels');
    if (!box) return;
    const open = levelsOpen(), cur = pickedLevel();
    box.innerHTML = LEVELS.slice(0, open + 1).map(L => {
      const b = readBest(L.id), locked = L.id > open, soon = locked && !calendarOpen(L.id);
      const fresh = !locked && L.id > 1 && !b.runs;
      const rec = soon ? `<svg class="ico"><use href="#i-lock"/></svg><small>${untilText(L.id)}</small>`
        : locked ? '<svg class="ico"><use href="#i-lock"/></svg>'
          : b.wins ? `<svg class="ico"><use href="#i-wagon"/></svg>×${b.wins}` : b.runs ? `${b.stop}/${STOPS}` : fresh ? 'Новый!' : '';
      const title = soon ? `${L.name} — откроется ${untilText(L.id)}, ${openDate(L.id)}`
        : locked ? `${L.name} — доставь конвой: уровень ${L.id - 1}` : CONVOY.lands[L.id] ? `${L.name} — ${CONVOY.lands[L.id].trait.desc}` : L.name;
      return `<button class="cv-level${L.id === cur ? ' on' : ''}${locked ? ' locked' : ''}${soon ? ' soon' : ''}${fresh ? ' fresh' : ''}" data-l="${L.id}" title="${title}" aria-label="${title}"` +
        `${locked ? ' aria-disabled="true"' : ''}><canvas width="168" height="96"></canvas><b class="cv-level-n">${L.id}</b>` +
        `${rec ? `<span class="cv-level-rec">${rec}</span>` : ''}</button>`;
    }).join('');
    const on = box.querySelector('.cv-level.on');
    if (on && box.scrollWidth > box.clientWidth) box.scrollLeft = on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2;
    box.querySelectorAll('.cv-level').forEach(btn => {
      const n = Number(btn.dataset.l), cv = btn.querySelector('canvas');
      drawLevelThumb(cv, n);
      btn.addEventListener('click', () => {
        if (n > levelsOpen()) {
          SFX.buyDenied();
          btn.classList.remove('deny'); void btn.offsetWidth; btn.classList.add('deny');
          return;
        }
        SFX.click();
        pickLevel(n);
        renderLevels();
      });
    });
  }
  // Значок уровня: фон края, его враг (тяжёлый) у правого края; пока картинки грузятся — перерисуется.
  function drawLevelThumb(cv, n) {
    const c = cv.getContext('2d'), W = cv.width, H = cv.height;
    c.clearRect(0, 0, W, H);
    const bgOk = Sprites.drawBgThumb(c, n, 0, 0, W, H);
    if (!bgOk) { c.fillStyle = (LEVELS[n - 1] || LEVELS[0]).tint; c.fillRect(0, 0, W, H); Sprites.onBg(n, () => drawLevelThumb(cv, n)); }
    if (!Sprites.drawIcon(c, 'heavy', true, W * 0.74, H - 4, W * 0.42, H * 0.82, 0, n)) Sprites.onReady('heavy', true, () => drawLevelThumb(cv, n), n);
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
        localStorage.removeItem(LEVEL_KEY);
      } catch (e) { /* без хранилища — один игрок */ }
      // слава, рекорды и открытые уровни (на стенде без облака; в ВК облако вернёт их при слиянии)
      const pr = prog();
      if (pr) { pr.cvGlory = 0; pr.cvBest = {}; saveProgress(pr); }
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
    const art = Sprites.bg('bg_r1');                     // на рисованном фоне столбики и кусты чужие
    for (const p of C.props) {
      if (art && p.kind !== 'tuft' && p.kind !== 'stone') continue;
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
    // новый облик: кузов и колёса — рисунки (js/sprites.js); знаки карт ниже рисуются поверх, как раньше
    const art = Sprites.wagonSet(deco.skin);
    if (art) ctx.scale(1.1, 1.1);                          // рисунок повозки чуть выше бойца, вместе со знаками карт
    const state = art ? drawWagonArt(i, hpFrac, roll, bob / s, deco) : null;
    if (state === 'wreck') { ctx.restore(); return; }    // от обломков остаются только обломки
    if (!art) {
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
    }
    if (deco.plating && art) {
      // «Обшивка» на рисунке: железная полоса с заклёпками по верху кузова
      ctx.fillStyle = '#8e99a4'; ctx.strokeStyle = '#2c3138'; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.rect(-24, -23.5, 44, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e4e8ec';
      for (let x = -20; x <= 16; x += 6) { ctx.beginPath(); ctx.arc(x, -22, 0.8, 0, TAU); ctx.fill(); }
    } else if (deco.plating && !art) {
      ctx.fillStyle = age.stone; ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.rect(-25, -28, 50, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(-25, -17, 50, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e8e2d0';
      for (let x = -21; x <= 21; x += 14) { ctx.beginPath(); ctx.arc(x, -25.5, 1.3, 0, TAU); ctx.fill(); }
    }
    if (!art) {
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
    }
    if (deco.shields && art) {
      // щиты на борту: дерево, железный обод и умбон — как у стражи
      for (const x of [-11, 4]) {
        ctx.fillStyle = '#9a6634'; ctx.strokeStyle = '#2c3138'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, -17, 5.2, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#a7b0b9'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(x, -17, 4.3, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#cfd6dc'; ctx.beginPath(); ctx.arc(x, -17, 1.5, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x - 1.6, -18.6, 1.4, 0, TAU); ctx.fill();
      }
    } else if (deco.shields) {
      ctx.fillStyle = '#8a6a3c'; ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      for (const y of [-40, -30]) { ctx.beginPath(); ctx.ellipse(22, y, 4.5, 6, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
    }
    if (deco.sacks && art) {
      // мешки с добычей у задка, перевязаны
      for (const [x, y, r] of [[-27, -11, 4.6], [-22, -9, 4]]) {
        ctx.fillStyle = '#c9a66a'; ctx.strokeStyle = '#3a2814'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(x, y, r * 0.85, r, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 1.6, y - r + 0.4); ctx.lineTo(x, y - r - 2.4); ctx.lineTo(x + 1.6, y - r + 0.4); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#7a5a2a'; ctx.beginPath(); ctx.moveTo(x - 1.8, y - r + 0.8); ctx.lineTo(x + 1.8, y - r + 0.8); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(x - 1.3, y - 1, 1.3, 2, 0, 0, TAU); ctx.fill();
      }
    } else if (deco.sacks) {
      ctx.fillStyle = '#e0c27a'; ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      for (const [x, y] of [[-15, -29], [-8, -30]]) { ctx.beginPath(); ctx.ellipse(x, y, 5, 4, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
    }
    ctx.strokeStyle = '#6a4a28'; ctx.lineWidth = 1.6;
    const arrows = art ? 0 : hpFrac < 0.8 ? (hpFrac < 0.55 ? (hpFrac < 0.3 ? 3 : 2) : 1) : 0; // у рисунка стрелы — в кадре «битая»
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
    if (i === 0 && art) {
      // флаг конвоя (или золотое «Знамя похода») на древке у задней повозки, полотно колышется
      const wave = Math.sin(t * (deco.marching ? 7 : 3.2));
      Sprites.drawFlag(ctx, deco.banner ? 'banner' : 'flag', -18, -44, deco.banner ? 40 : 32, wave);
    } else if (i === 0) {
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
  // Рисунок повозки в единицах drawWagon (как у прежней: ширина ≈ 58, верх полога ≈ −50).
  // Задняя (i = 0) бьётся позже передней: целая → битая → обломки; колёса крутятся на ходу.
  function drawWagonArt(i, hpFrac, roll, lift, deco) {
    const L = 58, r = 9.5;
    const state = i === 1 ? (hpFrac >= 0.6 ? 'whole' : hpFrac >= 0.15 ? 'damaged' : 'wreck')
      : (hpFrac >= 0.4 ? 'whole' : hpFrac > 0 ? 'damaged' : 'wreck');
    const flash = match.world.playerCore.hitFlash || 0;
    if (state === 'wreck') { Sprites.drawWagonBody(ctx, deco.skin, 'wreck', 0, lift, L * 0.95, flash); return state; }
    Sprites.drawWagonBody(ctx, deco.skin, state, 0, -r * 0.85, L, flash);
    for (const dx of [-L * 0.27, L * 0.27]) Sprites.drawWheel(ctx, dx, -r + lift, r, roll);
    return state;
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
    if (flash > 0 && !Sprites.wagonSet(deco.skin)) { ctx.save(); ctx.globalAlpha = flash * 0.5; ctx.fillStyle = '#fff'; ctx.fillRect(WAGON_X[0] - 32 * s, ARENA.groundY - 56 * s, WAGON_X[1] - WAGON_X[0] + 64 * s, 56 * s); ctx.restore(); }
    // повреждения видны издалека: дымок над передней повозкой с половины прочности, густой дым над обеими — с трети
    if (core.hp > 0 && hpFrac < 0.55) drawSmoke(WAGON_X[1] + 6 * s, ARENA.groundY - 36 * s, performance.now(), 2, 'rgba(70,62,55,.4)');
    if (core.hp > 0 && hpFrac < 0.3) drawSmoke(WAGON_X[0], ARENA.groundY - 40 * s, performance.now() + 700, 3, 'rgba(50,42,38,.6)');
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
    // новый облик: монета-рисунок, вращение — сжатием по ширине
    if (Sprites.prop('coin')) {
      ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1); Sprites.drawProp(ctx, 'coin', 0, 0, r * 2.3); ctx.restore();
      return;
    }
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
    // обучение камнепаду: кольцо и стрелка над самой густой толпой, «Тапни!» / «Кликни!»
    if (C.lesson === 'rock' && screen === 'match') {
      const x = densestEnemyX();
      if (x !== null) {
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 160), gy = ARENA.groundY;
        ctx.strokeStyle = `rgba(255,214,90,${0.55 + 0.45 * pulse})`; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(x, gy + 8, 48 + pulse * 8, 13 + pulse * 2, 0, 0, TAU); ctx.stroke();
        const ay = gy - 100 * VIEW.fig - 20 - pulse * 10;
        ctx.fillStyle = '#ffd35c'; ctx.strokeStyle = 'rgba(30,18,8,.95)'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x - 9, ay - 24); ctx.lineTo(x + 9, ay - 24); ctx.lineTo(x + 9, ay); ctx.lineTo(x + 20, ay);
        ctx.lineTo(x, ay + 22); ctx.lineTo(x - 20, ay); ctx.lineTo(x - 9, ay); ctx.closePath(); ctx.fill(); ctx.stroke();
        drawText(coarsePointer() ? 'Тапни!' : 'Кликни!', x, ay - 44, 30, '#fff4dc', 'rgba(30,18,8,.92)', 7);
      }
    }
    // большая надпись фазы (стоянка, «Волна отбита!», итог); у наград — монета перед суммой
    const b = C.banner;
    if (b) {
      const k = b.t / b.life, inT = Math.min(1, b.t / 0.2);
      const alpha = k < 0.78 ? 1 : Math.max(0, 1 - (k - 0.78) / 0.22);
      const sc = (0.55 + 0.45 * (1 - Math.pow(1 - inT, 3))) * (1 + k * 0.05);
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(ARENA.width / 2, VIEW.y0 + VIEW.h * 0.3);
      ctx.scale(sc, sc);
      drawText(b.text, 0, 0, 56, b.color === 'red' ? '#ff6a4a' : ART.hero.gold, 'rgba(30,18,8,.92)', 10);
      if (b.sub && b.coin) coinText(b.sub, 48, 32, '#fff4dc');
      else if (b.sub) drawText(b.sub, 0, 46, 28, '#fff4dc', 'rgba(30,18,8,.92)', 6);
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
      coinText(`+${L.bonus}`, 36, 24, '#fff0b0');
      ctx.restore();
    }
    ctx.restore();
  }
  // Монета и число по центру строки (награда в объявлениях).
  function coinText(text, y, size, fill) {
    ctx.font = `${size}px 'Lilita One', 'Fredoka', sans-serif`;
    const r = size * 0.36, gap = size * 0.22, tw = ctx.measureText(text).width, x0 = -(2 * r + gap + tw) / 2;
    drawCoin(x0 + r, y, r, 0);
    drawText(text, x0 + 2 * r + gap + tw / 2, y, size, fill, 'rgba(30,18,8,.92)', Math.max(4, size * 0.22));
  }
  let coarseMq = null;
  function coarsePointer() {
    if (!coarseMq) coarseMq = window.matchMedia('(hover: none) and (pointer: coarse)');
    return coarseMq.matches && !aim.mouse;
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
    drawLandFx(m, C, now);
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

  // Особенности краёв: лужи яда, замах особого удара вожака, яд/огонь/холод на своих.
  const SPEC_COLOR = { spit: '120,220,80', boulder: '200,180,150', burrow: '210,150,80', meteor: '255,130,40', breath: '160,215,255', howl: '255,90,60', raise: '180,140,255' };
  function groundRing(x, R, k, rgb, now) {
    ctx.save();
    ctx.fillStyle = `rgba(${rgb},${0.12 + 0.22 * k})`;
    ctx.strokeStyle = `rgba(${rgb},${0.6 + 0.4 * Math.sin(now / 50)})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(x, ARENA.groundY + 8, R, 15, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, ARENA.groundY + 8, R * k, 15 * k, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawLandFx(m, C, now) {
    for (const p of C.pools) {
      const a = Math.min(1, p.t / 0.6) * 0.55;
      ctx.save();
      ctx.fillStyle = `rgba(110,190,60,${a})`;
      ctx.beginPath(); ctx.ellipse(p.x, ARENA.groundY + 8, p.r, 14, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = `rgba(200,255,140,${a * 0.8})`;
      for (let i = 0; i < 4; i++) {
        const bx = p.x + Math.sin(i * 2.1 + now / 400) * p.r * 0.6, by = ARENA.groundY + 6 - ((now / 9 + i * 40) % 22);
        ctx.beginPath(); ctx.arc(bx, by, 2.4, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    const sp = C.spec;
    if (sp) {
      const S = sp.S, k = clamp01(sp.t / S.wind), rgb = SPEC_COLOR[S.id];
      if (S.id === 'breath') {
        ctx.save();
        ctx.fillStyle = `rgba(${rgb},${0.1 + 0.25 * k})`;
        ctx.fillRect(sp.x - S.len, ARENA.groundY - 90 * VIEW.fig, S.len * k, 96 * VIEW.fig);
        ctx.restore();
      } else if (S.id === 'howl' || S.id === 'raise') {
        groundRing(sp.from, 60 + 60 * k, k, rgb, now);
      } else {
        for (const x of sp.xs || [sp.x]) groundRing(x, S.r, k, rgb, now);
        if (S.id === 'boulder' || S.id === 'meteor') {   // падает с неба к концу замаха
          for (const x of sp.xs || [sp.x]) {
            const y = ARENA.groundY - 340 * (1 - k) - 14;
            ctx.save();
            ctx.fillStyle = S.id === 'boulder' ? '#8b7d6b' : '#ff8a2a';
            ctx.strokeStyle = S.id === 'boulder' ? 'rgba(40,30,20,.9)' : 'rgba(255,230,140,.9)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x, y, S.id === 'boulder' ? 16 : 10, 0, TAU); ctx.fill(); ctx.stroke();
            ctx.restore();
          }
        }
      }
    }
    // на своих: яд — зелёные пузырьки, огонь — искры, холод — голубой налёт, вой — красные отблески у врагов
    for (const u of m.world.units) {
      if (u.state === 'dead') continue;
      const h = 74 * VIEW.fig * (UNIT_TYPES[u.typeId].heightMult || 1);
      if (u.frozeT > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(170,220,255,.35)'; ctx.strokeStyle = 'rgba(230,248,255,.8)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(u.x - 16, ARENA.groundY - h, 32, h, 6) : ctx.rect(u.x - 16, ARENA.groundY - h, 32, h);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      const d = u.dot, cold = u.slowT > 0, howl = !!u.howl;
      if (!d && !cold && !howl) continue;
      const col = d ? (d.kind === 'venom' ? '#9be35a' : '#ffa23c') : cold ? '#a8dcff' : '#ff6a4a';
      ctx.save();
      ctx.fillStyle = col;
      for (let i = 0; i < 3; i++) {
        const ph = ((now / 700) + i / 3) % 1;
        const x = u.x + Math.sin(i * 2.4 + now / 300) * 9, y = ARENA.groundY - h * (0.35 + 0.6 * ph);
        ctx.globalAlpha = 0.85 * (1 - ph);
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }

  // ------------------------------------------------------------ иконки карт
  function drawClassIcon(cv, id) {
    const t = UNIT_TYPES[id], age = match ? match.age : AGES.stone;       // в меню матча ещё нет
    // новый облик: боец-рисунок в снаряжении отряда; пока картинка грузится — прежний значок, потом перерисовка
    cv._icon = id;
    if (Sprites.artId(id, false)) {
      const c = cv.getContext('2d');
      c.clearRect(0, 0, cv.width, cv.height);
      const tier = run && match && match.convoy ? run.ageStep || 0 : 0;
      if (Sprites.drawIcon(c, id, false, cv.width / 2, cv.height * 0.97, cv.width * 0.96, cv.height * 0.94, tier)) return;
      Sprites.onReady(id, false, () => { if (cv._icon === id) drawClassIcon(cv, id); });
    }
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
    cv._icon = null;
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
        // новый облик: Боец в снаряжении, которое даст карта (линейка p1_heroes_tier2/3)
        const next = 'guard_t' + Math.min(3, (run ? run.ageStep || 0 : 0) + 2);
        if (window.CONVOY_PROTOTYPE && Sprites.drawPortrait(c, next, 48, H / u - 2, 80, H / u - 6)) break;
        cv._icon = 'era';
        Sprites.onPortrait(() => { if (cv._icon === 'era') drawCardIcon(cv, card); });
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
      case 'rock': fallLines(50, 30, 22); boulder(48, 60, 26, 0.2); break;
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
    newRun({ headless: true, policy, seed: opts.seed, meta: opts.meta, glory: opts.glory, level: opts.level });
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

  // Плитки звука и музыки: перечёркнуты, когда выключены (состояние — progress из game.js).
  function syncSound() {
    const off = { sfx: !!progress.muted, music: !!progress.musicMuted };
    for (const b of document.querySelectorAll('.cv-snd')) {
      const o = off[b.dataset.snd];
      b.classList.toggle('off', o);
      b.setAttribute('aria-pressed', String(!o));
    }
  }

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
    drawCardIcon($('cvRockIco'), { icon: 'rock' });
    $('cvPause').addEventListener('click', () => { SFX.click(); togglePause(); });
    $('cvResume').addEventListener('click', () => { SFX.click(); togglePause(); });
    $('cvPauseHome').addEventListener('click', () => { SFX.click(); $('btnToMenuFromPause').click(); });
    $('cvDailyTake').addEventListener('click', (e) => { SFX.click(); takeDaily(); e.currentTarget.blur(); });
    const share = $('cvShare');
    share.classList.toggle('hidden', !PLATFORM.canShare());
    share.addEventListener('click', (e) => { SFX.click(); e.currentTarget.blur(); PLATFORM.share(); });
    for (const b of document.querySelectorAll('.cv-snd')) {
      b.addEventListener('click', (e) => {
        SFX.unlock();
        if (b.dataset.snd === 'music') toggleMusicMuted(); else toggleSfxMuted();
        syncSound();
        e.currentTarget.blur();
      });
    }
    syncSound();
    $('cvMenuPlay').addEventListener('click', () => { SFX.unlock(); SFX.click(); startRun(); });
    // переход с итога: сначала (иногда) межэкранная реклама, потом новый поход или меню
    let leaving = false;
    const leaveResult = (go) => {
      if (leaving) return;
      leaving = true;
      betweenRunsAd().then(() => { leaving = false; go(); });
    };
    $('cvResultAgain').addEventListener('click', () => {
      SFX.click();
      const lvl = run && run.next;
      leaveResult(() => { if (lvl) pickLevel(lvl); startRun(lvl); });
    });
    $('cvResultMenu').addEventListener('click', () => { SFX.click(); leaveResult(toMenu); });
    $('cvReviveAd').addEventListener('click', (e) => { SFX.click(); acceptRevive(); e.currentTarget.blur(); });
    $('cvReviveNo').addEventListener('click', (e) => { SFX.click(); declineRevive(); e.currentTarget.blur(); });
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
    migrateLegacy();
    showScreen('cmenu');
    if (new URLSearchParams(location.search).has('journal')) showJournal();
  }
  // Облако прочиталось позже (resync в save.js) — меню перерисовывается со свежей славой и уровнями.
  function refreshMenu() { if (screen === 'cmenu') { renderMenu(); renderDaily(); } }

  return {
    boot, startRun, newRun, setupMatch, update, updateHud, buy, buyIndex, key, choose, repair, reroll,
    rockAt, rockAuto, rockReady, toMenu, onScreen, canPause, drawStructures, drawMenuWagons, drawOverlay, dayT,
    showJournal, readLog, readBest, simulate, api, waveText, drawCardIcon, bossPose,
    refreshMenu,
    get run() { return run; },
  };
})();
