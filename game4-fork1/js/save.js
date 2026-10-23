// Прогресс кампании — только localStorage, без сохранения середины миссии
// (см. ГДД, «Явно НЕ входит в MVP»).
'use strict';

// Форк «Последний конвой»: свои ключи — прогресс оригинала («Две крепости») не читается и не затирается.
const SAVE_KEY = 'last-convoy-progress-v1';

function defaultProgress() {
  return {
    unlocked: 1, muted: false,
    // Магазин между раундами (см. ПЛАН.md, раунд 3) — валюта копится из
    // убийств за миссию и переносится между сессиями.
    // Фикс дублирования при слиянии (ТЗ_ФИКС_СЛИЯНИЕ_ВАЛЮТЫ.md): вместо
    // одного поля, которое мержится через Math.max (баг — трата "теряется"
    // при слиянии со старым большим облачным балансом), храним два
    // неубывающих счётчика; актуальный баланс — вычисляемое поле, см.
    // recalcShopCurrency().
    shopCurrencyEarned: 0,
    shopCurrencySpent: 0,
    towerA: false, towerB: false, trap: false,
    gearSword: 0, gearShield: 0, gearArmor: 0, // уровни 0-3
    gearLongBlade: 0, // утро: уровень 0-3, дальность удара 55→60→64→68, компенсация за откат facing-фикса
    ownedThemeBlueRed: false, activeTheme: 'classic', // утро: тема оформления — покупка, применяется на весь интерфейс
    ownedCloakRed: false, // утро: плащ героя — покупка, косметика
    cosmeticTime: 'cycle', // cycle | day | night — ТЕКУЩИЙ выбор, не владение
    cosmeticFlag: 'default', // default | gold
    // Ночная правка (баг-репорт всех трёх ревьюеров): владение отдельно от
    // текущего выбора — покупка разблокирует навсегда, cosmeticTime можно
    // свободно переключать между купленными вариантами без потери денег и
    // без потери прежней покупки (было: одно поле на двоих, вторая покупка
    // молча гасила первую, дороги обратно к циклу не было вообще).
    ownedTimeDay: false, ownedTimeNight: false,
    // Раунд 5: музыка (см. ПЛАН.md) — трек по умолчанию бесплатный и всегда
    // "куплен"; DLC — локальная разблокировка-заглушка (см. КОНЦЕПТ_ГДД.md).
    musicTrack2: false, musicTrack3: false,
    // Ночная правка (аудит ревьюера №3): DLC было необратимо навсегда без
    // отмены — владение отдельно от текущего состояния эффекта, тот же
    // паттерн, что и день/ночь.
    dlcHardMode: false, dlcHardModeActive: false, // DLC "Усилить врага"
    dlcPlayerBuff: false, dlcPlayerBuffActive: false, // DLC "Усилить себя" (утренняя правка)
    introSeen: false, // раунд 5: при самом первом запуске игра сразу открывает миссию 1
    trap2: false, towerC: false, startGoldBoost: false, buybackDiscount: false, // раунд 8
    heroAbilityCry: false, // раунд 9
    // Раунд 10: реальные mp3-треки — плейлист боя (порядок/вкл-выкл/шаффл),
    // musicMuted — НЕЗАВИСИМЫЙ от muted (тот теперь только SFX) канал
    // громкости, требование основателя "никогда не смешивать" (см. ГДД).
    musicMuted: false,
    playlist: { order: [...MUSIC_ORDER_DEFAULT], enabled: { battle_theme: true, battle_march: true, battle_pulse: true }, shuffle: false },
    // Раунд 15 (И4): звёзды миссий { [missionId]: 1..3 } — лучший результат
    // (HP своей крепости на победе), сливается поэлементным max, см.
    // mergeProgress; туториал миссии 1 показан (js/tutorial.js).
    missionStars: {},
    // Аудит A09: получен ли разовый рекламный бонус главы { [chapterId]: true }
    chapterBonusClaimed: {},
    tutorialDone: false,
    // r15 И10: разовый тост «эпоха сбрасывается каждую битву» (js/tutorial.js).
    // Булев флаг — при облачном слиянии ИЛИ (показан на любом устройстве —
    // больше не показывается), счётчик начатых миссий — число, слияние max
    // (общий цикл mergeProgress ниже, отдельной ветки не нужно).
    ageResetTipSeen: false,
    missionsStarted: 0,
    // Аудит 05.10 (A03): время последнего изменения «переключаемых» значений
    // (звук, активные DLC, разрушаемые постройки) — при слиянии побеждает
    // более позднее, а не ИЛИ (иначе выключенное включалось, а уничтоженная
    // башня возвращалась). Заполняется автоматически в saveProgress().
    stamps: {},
    // Аудит 05.10 (A04): учёт магазинной валюты по устройствам
    // { id → [заработано, потрачено] }; 'base' — наследие старого формата.
    // shopCurrencyEarned/Spent теперь — суммы по всем записям (производные).
    shopLedger: {},
    // «Последний конвой» (сборка 9): слава копится между походами (число,
    // слияние max), рекорды уровней { [уровень]: {stop, wins, runs} } —
    // поэлементный max; wins>0 у уровня открывает следующий (с учётом
    // календаря, см. convoy.js). Живут в облаке ВК вместе с остальным.
    cvGlory: 0,
    cvBest: {},
    // Сборка 11: награда за вход — последний день, когда забрана (номер дня по Москве), и дней подряд.
    cvDayLast: 0,
    cvDayStreak: 0,
    // Сборка 15: «Казна» — золото, довезённое доставками за всё время (личный счёт рейтинга, слияние max).
    cvTreasury: 0,
  };
}

// Рекорды уровней конвоя: каждое поле каждого уровня — максимум из двух копий.
function mergeBestMap(a, b) {
  const out = {};
  for (const src of [a, b]) {
    if (!src || typeof src !== 'object') continue;
    for (const id of Object.keys(src)) {
      const v = src[id], cur = out[id] || { stop: 0, wins: 0, runs: 0 };
      if (!v || typeof v !== 'object') continue;
      out[id] = { stop: Math.max(cur.stop, v.stop || 0), wins: Math.max(cur.wins, v.wins || 0), runs: Math.max(cur.runs, v.runs || 0) };
    }
  }
  return out;
}

// Поэлементный max двух словарей «id → число» (звёзды миссий): прогресс
// с разных устройств объединяется, лучший результат по каждой миссии
// сохраняется — не сумма (удвоение, как было с валютой) и не затирание.
function mergeMaxMap(a, b) {
  const out = {};
  for (const src of [a, b]) {
    if (!src || typeof src !== 'object') continue;
    for (const id of Object.keys(src)) {
      const v = Number(src[id]);
      if (!Number.isFinite(v)) continue;
      out[id] = Math.max(out[id] || 0, v);
    }
  }
  return out;
}

// CrazyGames Data Module (методичка §7): документация прямо предупреждает —
// не читать/писать window.localStorage напрямую на этой площадке, только
// через PLATFORM.crazyGamesDataGet/Set (SDK.data.getItem/setItem). На
// остальных площадках (yandex/vk/none) — обычный localStorage, как раньше.
// PLATFORM.kind() ещё 'none' в самый первый синхронный момент загрузки
// скрипта (detect() асинхронный) — на этом коротком окне localGet()
// вернёт null вместо реальных данных СrazyGames-игрока; не проблема, эта
// ранняя провизорная загрузка всё равно перезаписывается позже реальным
// syncProgress() (см. game.js, вызывается после PLATFORM.ready).
// Отчёт модерации 23.10 (B1): на CrazyGames-сборке, пока SDK не ответил (kind ещё 'none'), прямой
// localStorage тоже запрещён — прогресс живёт в памяти и сливается с SDK.data в adoptPlatformSave().
const CG_BUILD = window.GAME_PLATFORM === 'crazygames';
function localGetKey(key) {
  if (PLATFORM.kind() === 'crazygames') return PLATFORM.crazyGamesDataGet(key);
  return CG_BUILD ? null : localStorage.getItem(key);
}
function localSetKey(key, json) {
  if (PLATFORM.kind() === 'crazygames') { PLATFORM.crazyGamesDataSet(key, json); return; }
  if (!CG_BUILD) localStorage.setItem(key, json);
}
function localGet() { return localGetKey(SAVE_KEY); }
// На CrazyGames локальная копия и «облако» — одно хранилище (SDK.data). Пока его не удалось прочитать
// (сбой getItem), сейв не пишем: прогресс копится в памяти, pushCloud перечитает и сольёт (отчёт по сб.19).
function localSet(json) {
  if (PLATFORM.kind() === 'crazygames' && cloudReadOk !== true) return;
  localSetKey(SAVE_KEY, json);
}

// ---- Проверка структуры и диапазонов (аудит 05.10, A05) -----------------
// Сейв приходит из localStorage / облака площадки и может быть битым или
// подменённым: playlist:null ломал плеер, unlocked=99 открывал несуществующие
// миссии, отрицательный gearSword лечил врага ударом. sanitizeSaveData()
// возвращает ТОЛЬКО известные поля с допустимыми значениями (остальные
// считаются отсутствующими, дефолты подставляются выше по стеку).
const SAVE_NUM_RANGES = {
  unlocked: [1, () => (typeof MISSIONS !== 'undefined' ? MISSIONS.length : 15), true],
  gearSword: [0, 3, true], gearShield: [0, 3, true], gearArmor: [0, 3, true], gearLongBlade: [0, 3, true],
  missionsStarted: [0, 1e6, true],
  cvGlory: [0, 1e7, true],
  cvDayLast: [0, 1e6, true],
  cvDayStreak: [0, 1e6, true],
  cvTreasury: [0, 1e9, true],
};
const SAVE_STRING_ENUMS = {
  cosmeticTime: ['cycle', 'day', 'night'],
  cosmeticFlag: ['default', 'gold'],
};
const SAVE_MAX_AMOUNT = 1e9;
const SAVE_LEDGER_ID = /^[A-Za-z0-9_-]{1,40}$/;
// «Переключаемые» значения и разрушаемые постройки — слияние по времени, а не ИЛИ.
const STAMPED_TOGGLES = ['muted', 'musicMuted', 'dlcHardModeActive', 'dlcPlayerBuffActive'];
const STAMPED_BUILDINGS = ['towerA', 'towerB', 'towerC', 'trap', 'trap2'];
const STAMPED_KEYS = [...STAMPED_TOGGLES, ...STAMPED_BUILDINGS];

function saneAmount(v) {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= SAVE_MAX_AMOUNT ? v : null;
}

function sanitizeLedger(src) {
  const out = {};
  if (!src || typeof src !== 'object' || Array.isArray(src)) return out;
  let n = 0;
  for (const id of Object.keys(src)) {
    if (!SAVE_LEDGER_ID.test(id) || ++n > 64) continue;
    const e = src[id];
    if (!Array.isArray(e)) continue;
    const earned = saneAmount(e[0]), spent = saneAmount(e[1]);
    if (earned === null || spent === null) continue;
    out[id] = [earned, spent];
  }
  return out;
}

function sanitizePlaylist(src) {
  if (!src || typeof src !== 'object' || Array.isArray(src)) return null;
  const known = MUSIC_ORDER_DEFAULT;
  const order = [];
  if (Array.isArray(src.order)) for (const id of src.order) if (known.includes(id) && !order.includes(id)) order.push(id);
  for (const id of known) if (!order.includes(id)) order.push(id);
  const enabled = {};
  for (const id of known) enabled[id] = !(src.enabled && typeof src.enabled === 'object' && src.enabled[id] === false);
  return { order, enabled, shuffle: src.shuffle === true };
}

function sanitizeSaveData(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const def = defaultProgress();
  const out = {};
  for (const k of Object.keys(def)) {
    if (!Object.prototype.hasOwnProperty.call(raw, k)) continue;
    const v = raw[k], dv = def[k];
    if (k === 'missionStars') {
      const m = {};
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const max = typeof MISSIONS !== 'undefined' ? MISSIONS.length : 15;
        for (const id of Object.keys(v)) {
          const n = Number(id), st = v[id];
          if (Number.isInteger(n) && n >= 1 && n <= max && typeof st === 'number' && Number.isFinite(st) && st >= 1) m[n] = Math.min(3, Math.floor(st));
        }
      }
      out[k] = m;
    } else if (k === 'cvBest') {
      const m = {};
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const int = (x, hi) => (typeof x === 'number' && Number.isFinite(x) ? Math.max(0, Math.min(hi, Math.floor(x))) : 0);
        for (const id of Object.keys(v)) {
          const n = Number(id), b = v[id];
          if (Number.isInteger(n) && n >= 1 && n <= 20 && b && typeof b === 'object') m[n] = { stop: int(b.stop, 10), wins: int(b.wins, 1e6), runs: int(b.runs, 1e6) };
        }
      }
      out[k] = m;
    } else if (k === 'chapterBonusClaimed') {
      const c = {};
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        for (const id of Object.keys(v)) { const n = Number(id); if (Number.isInteger(n) && n >= 1 && n <= 20 && v[id] === true) c[n] = true; }
      }
      out[k] = c;
    } else if (k === 'playlist') {
      const pl = sanitizePlaylist(v);
      if (pl) out[k] = pl;
    } else if (k === 'stamps') {
      const st = {};
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        for (const key of STAMPED_KEYS) if (typeof v[key] === 'number' && Number.isFinite(v[key]) && v[key] > 0) st[key] = v[key];
      }
      out[k] = st;
    } else if (k === 'shopLedger') {
      out[k] = sanitizeLedger(v);
    } else if (typeof dv === 'boolean') {
      if (typeof v === 'boolean') out[k] = v;
    } else if (typeof dv === 'number') {
      if (typeof v !== 'number' || !Number.isFinite(v)) continue;
      const r = SAVE_NUM_RANGES[k];
      if (r) {
        const hi = typeof r[1] === 'function' ? r[1]() : r[1];
        let n = Math.max(r[0], Math.min(hi, v));
        if (r[2]) n = Math.floor(n);
        out[k] = n;
      } else if (v >= 0 && v <= SAVE_MAX_AMOUNT) out[k] = v; // earned/spent: отрицательные и гигантские отбрасываются
    } else if (typeof dv === 'string') {
      if (typeof v !== 'string') continue;
      if (SAVE_STRING_ENUMS[k]) { if (SAVE_STRING_ENUMS[k].includes(v)) out[k] = v; }
      else if (/^[A-Za-z0-9_-]{1,32}$/.test(v)) out[k] = v; // activeTheme: неизвестный id в game.js откатывается на тему по умолчанию
    }
  }
  // Старый формат валюты (до журнала по устройствам) → запись 'base'.
  const hasLedger = out.shopLedger && Object.keys(out.shopLedger).length > 0;
  if (!hasLedger) {
    const legacy = migrateShopCurrency(Object.assign({}, raw));
    const e = saneAmount(legacy.shopCurrencyEarned), s = saneAmount(legacy.shopCurrencySpent);
    if (e !== null || s !== null) out.shopLedger = { base: [e || 0, s || 0] };
  }
  delete out.shopCurrencyEarned; delete out.shopCurrencySpent;
  return out;
}

// ---- Журнал валюты по устройствам (аудит 05.10, A04) --------------------
// Два глобальных счётчика с max не складывали независимые операции двух
// устройств (трата 15 + трата 20 при базе 100 давала 80 вместо 65). Теперь
// каждое устройство ведёт СВОЮ пару неубывающих счётчиков; слияние берёт max
// внутри записи устройства, итог — сумма по всем записям.
const DEVICE_KEY = 'last-convoy-device-v1';
let deviceIdCache = null;
function getDeviceId() {
  if (deviceIdCache) return deviceIdCache;
  let id = null;
  try { id = localGetKey(DEVICE_KEY); } catch (e) { /* хранилище недоступно */ }
  if (!id || !SAVE_LEDGER_ID.test(id) || id === 'base') {
    id = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    try { localSetKey(DEVICE_KEY, id); } catch (e) { /* на эту сессию хватит */ }
  }
  deviceIdCache = id;
  return id;
}

function ledgerTotals(ledger) {
  let earned = 0, spent = 0;
  for (const id of Object.keys(ledger || {})) { earned += ledger[id][0]; spent += ledger[id][1]; }
  return { earned, spent };
}

// Пересчёт актуального баланса — звать после любого earn/spend и после
// слияния/загрузки. Баланс не уходит ниже нуля: «долг» от одновременной траты
// одних и тех же денег на двух устройствах гасится будущими заработками.
function recalcShopCurrency(progress) {
  if (!progress.shopLedger || typeof progress.shopLedger !== 'object') progress.shopLedger = {};
  const t = ledgerTotals(progress.shopLedger);
  progress.shopCurrencyEarned = t.earned;
  progress.shopCurrencySpent = t.spent;
  progress.shopCurrency = Math.max(0, t.earned - t.spent);
  return progress.shopCurrency;
}

function ledgerEntry(progress) {
  if (!progress.shopLedger || typeof progress.shopLedger !== 'object') progress.shopLedger = {};
  const id = getDeviceId();
  if (!progress.shopLedger[id]) progress.shopLedger[id] = [0, 0];
  return progress.shopLedger[id];
}
function shopEarn(progress, amount) {
  if (!(amount > 0)) return;
  ledgerEntry(progress)[0] += amount;
  recalcShopCurrency(progress);
}
function shopSpend(progress, amount) {
  if (!(amount > 0)) return;
  ledgerEntry(progress)[1] += amount;
  recalcShopCurrency(progress);
}

// Миграция старого формата (только shopCurrency, без earned/spent) —
// один раз при первой загрузке после обновления, чтобы не обнулить деньги
// уже играющим (ТЗ_ФИКС_СЛИЯНИЕ_ВАЛЮТЫ.md, п.3).
function migrateShopCurrency(data) {
  if (!data) return data;
  const hasEarned = Object.prototype.hasOwnProperty.call(data, 'shopCurrencyEarned');
  const hasSpent = Object.prototype.hasOwnProperty.call(data, 'shopCurrencySpent');
  if (!hasEarned && !hasSpent && Object.prototype.hasOwnProperty.call(data, 'shopCurrency')) {
    data.shopCurrencyEarned = data.shopCurrency || 0;
    data.shopCurrencySpent = 0;
  }
  return data;
}

// ---- Штампы изменений (аудит 05.10, A03) ---------------------------------
// Вызывающий код менял progress.muted = ... напрямую; чтобы не трогать каждое
// место, saveProgress() сравнивает значения со снимком и ставит время.
let stampBase = null;
function resetStampBase(progress) {
  stampBase = {};
  for (const k of STAMPED_KEYS) stampBase[k] = progress[k];
}
function stampChanges(progress) {
  if (!stampBase) resetStampBase(progress);
  if (!progress.stamps || typeof progress.stamps !== 'object') progress.stamps = {};
  for (const k of STAMPED_KEYS) {
    if (progress[k] !== stampBase[k]) {
      progress.stamps[k] = Math.max(Date.now(), (progress.stamps[k] || 0) + 1);
      stampBase[k] = progress[k];
    }
  }
}

function loadProgress() {
  try {
    const raw = localGet();
    const d = defaultProgress();
    if (!raw) { recalcShopCurrency(d); resetStampBase(d); return d; }
    const clean = sanitizeSaveData(JSON.parse(raw)) || {};
    const merged = Object.assign(d, clean);
    recalcShopCurrency(merged);
    resetStampBase(merged);
    return merged;
  } catch (e) {
    const d = defaultProgress();
    recalcShopCurrency(d);
    resetStampBase(d);
    return d;
  }
}

// ---- Запись: подтверждение, повтор, сообщение игроку (аудит 05.10, A20) --
// Раньше отказ localStorage/облака молча проглатывался — игрок видел
// заработанное, а после перезапуска оно пропадало. Теперь отказ фиксируется,
// облако повторяется с нарастающей паузой, игрок получает один заметный
// тост (не чаще раза в минуту). game.js подписывается через setSaveHooks().
const CLOUD_PUSH_DEBOUNCE_MS = 3000;
const CLOUD_RETRY_DELAYS_MS = [5000, 15000, 45000, 120000, 300000];
const SAVE_NOTICE_MIN_GAP_MS = 60000;
let cloudPushTimer = null;
let cloudRetryTimer = null;
let cloudRetryN = 0;
let cloudInFlight = false;
let cloudDirty = false;
// Прочитано ли облако в этой сессии. false — чтение не удалось (сеть, ещё не
// готов Player, немой мост): НЕЛЬЗЯ писать поверх неизвестного состояния.
let cloudReadOk = null;
let lastSaveNoticeAt = 0;
const saveHooks = { problem: null, replaced: null };
function setSaveHooks(h) { Object.assign(saveHooks, h || {}); }
function reportSaveProblem(kind) {
  const now = Date.now();
  if (now - lastSaveNoticeAt < SAVE_NOTICE_MIN_GAP_MS) return;
  lastSaveNoticeAt = now;
  try { if (saveHooks.problem) saveHooks.problem(kind); } catch (e) { /* уведомление — не критично */ }
}

function replaceProgressInPlace(target, src) {
  for (const k of Object.keys(target)) delete target[k];
  Object.assign(target, src);
}

// Повторное чтение облака + слияние с тем, что накоплено в памяти. true — можно писать.
async function resyncFromCloud(progress) {
  let cloud;
  try { cloud = await PLATFORM.loadCloud(); } catch (e) { return false; }
  if (!cloud || !cloud.ok) return false;
  const merged = mergeProgress(progress, cloud.data);
  replaceProgressInPlace(progress, merged);
  resetStampBase(progress);
  cloudReadOk = true; // до записи: на CrazyGames localSet пишет только после удачного чтения
  writeLocalRaw(progress);
  try { if (saveHooks.replaced) saveHooks.replaced(); } catch (e) { /* UI подтянется при следующем показе */ }
  return true;
}

// B1: SDK площадки ответил после старта игры (PLATFORM.onLateReady). Зовётся синхронно в момент смены
// kind — до любой новой записи: накопленное в памяти сливается с сейвом площадки, а не затирает его.
// Чтение не удалось (сбой SDK.data) — ничего не пишем: cloudReadOk=false, прогресс остаётся в памяти,
// pushCloud повторит чтение с паузами и сольёт (resyncFromCloud).
// false — сейв площадки ещё не прочитан (SDK не ответил или чтение упало): то, что зависит от прежнего
// прогресса (награда за вход), ждёт слияния — иначе max-слияние его съест.
function saveSettled() {
  return !PLATFORM.saveWaiting() && !(PLATFORM.kind() === 'crazygames' && cloudReadOk !== true);
}

function adoptPlatformSave(progress) {
  deviceIdCache = null; // номер устройства — уже из хранилища площадки
  const r = PLATFORM.crazyGamesDataRead(SAVE_KEY);
  let raw = null;
  try { raw = r.ok && r.value ? JSON.parse(r.value) : null; } catch (e) { r.ok = false; }
  if (!r.ok) {
    cloudReadOk = false;
    scheduleCloudPush(progress);
    return;
  }
  const merged = mergeProgress(progress, raw);
  replaceProgressInPlace(progress, merged);
  resetStampBase(progress);
  cloudReadOk = true;
  writeLocalRaw(progress);
  try { if (saveHooks.replaced) saveHooks.replaced(); } catch (e) { /* UI подтянется при следующем показе */ }
}

async function pushCloud(progress) {
  if (cloudInFlight) { cloudDirty = true; return; }
  cloudInFlight = true;
  let ok = false;
  try {
    if (cloudReadOk !== true) ok = (await resyncFromCloud(progress)) && await tryCloudSave(progress);
    else ok = await tryCloudSave(progress);
  } finally { cloudInFlight = false; }
  if (ok) {
    cloudRetryN = 0;
    if (cloudDirty) { cloudDirty = false; scheduleCloudPush(progress); }
    return;
  }
  cloudDirty = false;
  if (++cloudRetryN >= 2) reportSaveProblem('cloud');
  if (cloudRetryN <= CLOUD_RETRY_DELAYS_MS.length) {
    clearTimeout(cloudRetryTimer);
    cloudRetryTimer = setTimeout(() => { cloudRetryTimer = null; pushCloud(progress); }, CLOUD_RETRY_DELAYS_MS[cloudRetryN - 1]);
  }
}
async function tryCloudSave(progress) {
  try {
    const res = await PLATFORM.saveCloud(progress);
    return !(res && res.ok === false);
  } catch (e) { return false; }
}

function scheduleCloudPush(progress) {
  clearTimeout(cloudPushTimer);
  cloudPushTimer = setTimeout(() => {
    cloudPushTimer = null;
    pushCloud(progress);
  }, CLOUD_PUSH_DEBOUNCE_MS);
}

// Немедленный (не отложенный) пуш — вызывается из game.js на pagehide/
// visibilitychange, чтобы не терять последнее изменение при быстром
// закрытии вкладки. Пока облако не прочитано, не пишем: нельзя затереть
// неизвестное (локальная копия при этом уже сохранена).
function flushCloudPush(progress) {
  clearTimeout(cloudPushTimer);
  cloudPushTimer = null;
  if (cloudReadOk !== true) return;
  PLATFORM.saveCloud(progress);
}

function saveProgress(progress) {
  stampChanges(progress);
  try {
    localSet(JSON.stringify(progress));
  } catch (e) { reportSaveProblem('local'); }
  scheduleCloudPush(progress);
}

// ---- Слияние локального и облачного сейва (см. ТЗ_ОБЛАЧНЫЕ_СОХРАНЕНИЯ.md,
// раздел 3) -----------------------------------------------------------

function readLocalRaw() {
  try {
    const raw = localGet();
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function writeLocalRaw(data) {
  try { localSet(JSON.stringify(data)); } catch (e) { reportSaveProblem('local'); }
}

// Правила слияния (обе стороны сначала проходят sanitizeSaveData):
//  - числа (уровни, открытые миссии, счётчики) — максимум;
//  - булевы «владения» (покупки, флаги «показано») — ИЛИ: купленное не пропадает;
//  - «переключаемые» (звук, активные DLC) и разрушаемые постройки — побеждает
//    более позднее изменение по штампу (A03); при равных/отсутствующих штампах
//    переключатель берёт локальное значение, постройка — ИЛИ (не терять покупку);
//  - missionStars — поэлементный максимум;
//  - валюта — журнал по устройствам: максимум внутри записи устройства (A04);
//  - строки/объекты (тема, плейлист) — побеждает локальное устройство.
function mergeProgress(localData, cloudData) {
  const L = sanitizeSaveData(localData) || {};
  const C = sanitizeSaveData(cloudData) || {};
  const merged = defaultProgress();
  const keys = new Set([...Object.keys(L), ...Object.keys(C)]);
  const ls = L.stamps || {}, cs = C.stamps || {};
  for (const k of keys) {
    if (k === 'stamps' || k === 'shopLedger') continue;
    if (k === 'missionStars') { merged[k] = mergeMaxMap(L[k], C[k]); continue; } // раунд 15 (И4)
    if (k === 'cvBest') { merged[k] = mergeBestMap(L[k], C[k]); continue; } // конвой: рекорды уровней
    if (k === 'chapterBonusClaimed') { merged[k] = Object.assign({}, C[k], L[k]); continue; } // А09: полученный бонус не «разполучается»
    const hasLocal = Object.prototype.hasOwnProperty.call(L, k);
    const hasCloud = Object.prototype.hasOwnProperty.call(C, k);
    if (hasLocal && hasCloud) {
      const lv = L[k], cv = C[k];
      if (STAMPED_KEYS.includes(k)) {
        const a = ls[k] || 0, b = cs[k] || 0;
        if (a > b) merged[k] = lv;
        else if (b > a) merged[k] = cv;
        else merged[k] = STAMPED_BUILDINGS.includes(k) ? (lv || cv) : lv;
      }
      else if (typeof lv === 'number' && typeof cv === 'number') merged[k] = Math.max(lv, cv);
      else if (typeof lv === 'boolean' && typeof cv === 'boolean') merged[k] = lv || cv;
      else merged[k] = lv; // строки/объекты (activeTheme, cosmeticTime, playlist...) — побеждает локальное устройство
    } else if (hasLocal) merged[k] = L[k];
    else if (hasCloud) merged[k] = C[k];
  }
  merged.stamps = {};
  for (const k of STAMPED_KEYS) {
    const t = Math.max(ls[k] || 0, cs[k] || 0);
    if (t > 0) merged.stamps[k] = t;
  }
  merged.shopLedger = {};
  for (const src of [L.shopLedger, C.shopLedger]) {
    for (const id of Object.keys(src || {})) {
      const cur = merged.shopLedger[id] || [0, 0];
      merged.shopLedger[id] = [Math.max(cur[0], src[id][0]), Math.max(cur[1], src[id][1])];
    }
  }
  recalcShopCurrency(merged);
  return merged;
}

async function syncProgress() {
  const localRaw = readLocalRaw(); // без дефолтов поверх — дефолты применяются только в mergeProgress
  const cloud = await PLATFORM.loadCloud();
  if (!cloud.ok) {
    // Сеть/мост/Player недоступны — работаем локально. Облако НЕ перезаписываем,
    // пока не удастся его прочитать (cloudReadOk=false → pushCloud сначала
    // перечитывает и сливает, аудит A01/A20).
    cloudReadOk = false;
    const local = Object.assign(defaultProgress(), sanitizeSaveData(localRaw) || {});
    recalcShopCurrency(local);
    resetStampBase(local);
    return local;
  }
  cloudReadOk = true;
  const result = mergeProgress(localRaw, cloud.data); // cloud.data может быть null — mergeProgress уже обрабатывает это как «взять только локальное»
  resetStampBase(result);
  writeLocalRaw(result);
  scheduleCloudPush(result); // не блокируя — покрывает и случай «в облаке пусто, поднимаем локальное наверх»
  return result;
}
