/* ============================================================
   i18n — RU + EN (жанр без текста, английский почти бесплатен)
   Язык берётся из SDK (ysdk.environment.i18n.lang, ISO 639-1),
   фолбэк — ru. Неизвестные языки → en.
   ============================================================ */
const I18N = {
  ru: {
    title: 'Сортировка: Цвет и Форма', // карточное имя (п.5.1.3, решение основателя 2026-07-17)
    play: 'Играть',
    restart: 'Начать сначала',
    level: 'Уровень',
    win: 'Уровень пройден!',
    next: 'Дальше',
    noMoves: 'Нет доступных ходов',
    hintAd: 'Подсказка за рекламу',
    hintAdLoading: 'Загрузка рекламы…',
    campaignWinTitle: 'Поздравляем! Вы прошли все уровни',
    campaignWinNote: 'Следите за обновлениями — скоро добавим новые',
    campaignMenu: 'В меню',
    statTotal: 'Всего',
    statAverage: 'В среднем',
    statFastest: 'Быстрее всего',
    statSlowest: 'Дольше всего',
    levels: 'Уровни',
    chapter: 'Глава',
    chapterComplete: 'пройдена',
    of: 'из',
    shop: 'Магазин',
    themeDefaultLabel: 'Тёплая тема',
    themeSeaLabel: 'Морская тема',
    themeForestLabel: 'Лесная тема',
    themeBerryLabel: 'Ягодная тема',
    themeApply: 'Применить',
    themeActive: 'Активна ✓',
    cosmeticBuy: 'Купить',
    shopPurchaseNotCompleted: 'Покупка не завершена',
    // ТЗ №17 «Оформление»: экран ВЫБОРА уже принадлежащих оформлений
    // (не магазин — покупка живёт отдельным экраном и только на Яндексе).
    // Подсказка выбирается по СОСТОЯНИЮ владения (см. oformlenieHintKey
    // в main.js) — из трёх вариантов копирайта, показанных отчётом ТЗ №17,
    // основатель выбрал V1 (22.08); V2/V3 удалены отсюда как решённые.
    // Чисел/знаменателей в строках нет (запрет ТЗ) — ни «2 из 4», ни
    // точек-индикаторов.
    oformlenie: 'Оформление',
    // Состояние 1 — во владении только стандартная тема. Экран с одной
    // карточкой не должен читаться как поломка: строка объясняет, откуда
    // берутся новые. Общая (ВК-безопасная) редакция — про серию входов,
    // без единого упоминания покупки/магазина/цены.
    oformlenieHintNone: 'Новые оформления открываются за серию входов',
    // Состояние 2 — во владении несколько, но не все.
    oformlenieHintSome: 'Выберите оформление — менять можно когда угодно',
    // Состояние 3 — во владении все доступные на этой площадке.
    oformlenieHintAll: 'Открыты все оформления — выбирайте любое',
    // ТЗ №14, этап 2: модуль удержания (retention.js), перенесён с
    // нонограмм. Серия входов — общая механика, не тронута этапом 1
    // ТЗ №15.
    retentionStreakLine:  'Серия входов: {n} из {m}',
    retentionRewardHints: '+{n} подсказки бесплатно — серия входов!',
    // Награда 3-го дня — конкретная тема (решение основателя 22.08):
    // ягодная тема дарится бесплатно, минуя магазин/IAP.
    retentionRewardStyle: 'Ягодная тема открыта — серия входов!',
    // ТЗ №15, этап 1: энергия — отдельная валюта (не открывает уровни,
    // см. п.1.1 ТЗ). Раздатчик уровней (ТЗ №14) и его строки/подпись
    // удалены вместе с механикой — заменены этим блоком.
    energyLabel:     'Энергия',
    energyNextAt:    'ещё +{n} в {time}',
    energyToastGain: 'Энергия +{n}!',
    energyWallTitle: 'Нет энергии',
    energyWallText:  'Следующая порция (+{n}) — в {time}',
    // п.4.5.1 требований Яндекса (тот же принцип, что у прежней
    // retentionRewardedBtn ТЗ №14 этап 3): подпись обязана однозначно
    // называть И рекламу, И награду.
    energyWallAdBtn: 'Смотреть рекламу за +{n} энергии',
    // ТЗ №22. Рестарт — второй тап подтверждает (R-09).
    restartConfirm:  'Ещё раз — начать заново',
    deadEnd:         'Ходов нет — начните заново',
    // Цель дня (C1) и завтрашняя награда серии (C2, N-35).
    dailyGoalLine:   'Цель дня: пройти {m} уровня — {n}/{m}',
    dailyGoalDone:   'Цель дня выполнена! Завтра — новая',
    dailyGoalReward: 'Цель дня выполнена: +{n} подсказки!',
    streakTomorrowHints: 'Серия входов: {n} из {m} · завтра +{k} подсказки',
    streakTomorrowStyle: 'Серия входов: {n} из {m} · завтра ягодная тема'
  },
  en: {
    title: 'Sort: Color & Shape', // карточное имя (п.5.1.3, решение основателя 2026-07-17)
    play: 'Play',
    restart: 'Restart',
    level: 'Level',
    win: 'Level complete!',
    next: 'Next',
    noMoves: 'No moves available',
    hintAd: 'Hint for an ad',
    hintAdLoading: 'Loading ad…',
    campaignWinTitle: "Congratulations! You've completed all levels",
    campaignWinNote: 'Stay tuned — new levels are on the way',
    campaignMenu: 'To menu',
    statTotal: 'Total',
    statAverage: 'Average',
    statFastest: 'Fastest',
    statSlowest: 'Slowest',
    levels: 'Levels',
    chapter: 'Chapter',
    chapterComplete: 'complete',
    of: 'of',
    shop: 'Shop',
    themeDefaultLabel: 'Warm theme',
    themeSeaLabel: 'Sea theme',
    themeForestLabel: 'Forest theme',
    themeBerryLabel: 'Berry theme',
    themeApply: 'Apply',
    themeActive: 'Active ✓',
    cosmeticBuy: 'Buy',
    shopPurchaseNotCompleted: 'Purchase not completed',
    // ТЗ №17 — см. комментарий у русского блока.
    oformlenie: 'Appearance',
    oformlenieHintNone: 'New looks unlock through a login streak',
    oformlenieHintSome: 'Pick a look — you can change it anytime',
    oformlenieHintAll: 'Every look is unlocked — take your pick',
    retentionStreakLine:  'Login streak: {n} of {m}',
    retentionRewardHints: '+{n} free hints — login streak!',
    retentionRewardStyle: 'Berry theme unlocked — login streak!',
    energyLabel:     'Energy',
    energyNextAt:    'plus {n} more at {time}',
    energyToastGain: '+{n} energy!',
    energyWallTitle: 'Out of energy',
    energyWallText:  'Next refill (+{n}) at {time}',
    energyWallAdBtn: 'Watch an ad for +{n} energy',
    restartConfirm:  'Tap again to restart',
    deadEnd:         'No moves left — restart the level',
    dailyGoalLine:   'Daily goal: clear {m} levels — {n}/{m}',
    dailyGoalDone:   'Daily goal done! A new one tomorrow',
    dailyGoalReward: 'Daily goal done: +{n} hints!',
    streakTomorrowHints: 'Login streak: {n} of {m} · tomorrow +{k} hints',
    streakTomorrowStyle: 'Login streak: {n} of {m} · tomorrow the Berry theme'
  }
};

let currentLang = 'ru';

function setLanguage(lang) {
  // ru/be/kk/uk/uz → русский интерфейс; остальное → en
  const ruFamily = ['ru', 'be', 'kk', 'uk', 'uz'];
  currentLang = ruFamily.includes(lang) ? 'ru' : (I18N[lang] ? lang : 'en');
  document.documentElement.lang = currentLang;
  applyStrings();
}

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.ru[key] || key;
}

function applyStrings() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.title = t('title');
}
