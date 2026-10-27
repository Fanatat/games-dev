# games-dev — тестовый стенд браузерных игр

Тестовые сборки игр студии перед выпуском. [Открыть каталог](https://fanatat.github.io/games-dev/).

Это **стенд**: боевые версии игр живут на `play.vanatat.ru` и открываются из VK Игр.
Сборки здесь могут отличаться от боевых контентом, звуком, сохранениями и интеграциями
площадок; реклама, покупки и облачные сохранения работают только внутри площадки.
Наличие страницы не означает публикацию в каталоге.

Папки названы по техническим номерам игр: `gameN` — основная игра, `gameN-forkM` —
прототип на её базе.

| Папка | Игра | Стек | Тестовая сборка | VK Игры |
|---|---|---|---|---|
| game1 | Словоход (филворд) | JavaScript | [открыть](https://fanatat.github.io/games-dev/game1/) | [app54674073](https://vk.com/app54674073) |
| game2 | Кот и японские кроссворды (нонограммы) | JavaScript | [открыть](https://fanatat.github.io/games-dev/game2/) | [app54676906](https://vk.com/app54676906) |
| game3 | Сортировка: Цвет и Форма | JavaScript | [открыть](https://fanatat.github.io/games-dev/game3/) | [app54683949](https://vk.com/app54683949) |
| game4 | Две крепости (лейн-баттлер) | JavaScript, Canvas | [открыть](https://fanatat.github.io/games-dev/game4/) | [app54759696](https://vk.com/app54759696) |
| game5 | Королевская Косынка | Three.js, TypeScript | [открыть](https://fanatat.github.io/games-dev/game5/) | на модерации |
| game7 | Зомби Ленд | Unity WebGL | [открыть](https://fanatat.github.io/games-dev/game7/) · [для ВК](https://fanatat.github.io/games-dev/game7-vk/) | на модерации |
| game9 | Коп Ленд (раннер) | Three.js | [открыть](https://fanatat.github.io/games-dev/game9/) | готовится |
| game10 | Планетки: космическая гармония (физическая головоломка) | TypeScript, PixiJS | [открыть](https://fanatat.github.io/games-dev/game10/) | готовится |
| game1-fork1 | Слова по уликам (прототип) | JavaScript | [открыть](https://fanatat.github.io/games-dev/game1-fork1/) | — |
| game2-fork1 | Дом картинок (прототип) | JavaScript | [открыть](https://fanatat.github.io/games-dev/game2-fork1/) | — |
| game3-fork1 | Мастерская украшений | JavaScript | [открыть](https://fanatat.github.io/games-dev/game3-fork1/) · [для ВК](https://fanatat.github.io/games-dev/game3-fork1-vk/) · [для CrazyGames](https://fanatat.github.io/games-dev/game3-fork1-cg/) | на модерации |
| game4-fork1 | Последний конвой | JavaScript, Canvas | [открыть](https://fanatat.github.io/games-dev/game4-fork1/) | на модерации |

game6 (Godot, CrazyGames) и game8 (Unity, Steam) на стенде не выкладываются.

Старые имена папок (`slovokhod/`, `royal-solitaire/`, `game7-horde/` и др.) удалены 18.10.2026,
после того как тестовые ссылки в кабинетах ВК заменены на новые. Туда не выкладывать.

Версию сборки показывает сама игра (штамп сборки в углу или в настройках).
Обновление сборки — замена папки игры целиком.

## Локально

```bash
git clone --depth 1 https://github.com/Fanatat/games-dev.git
cd games-dev
python3 -m http.server 8000 --bind 127.0.0.1
```

Откройте http://localhost:8000/.

## Сообщить об ошибке

Напишите [@fanatat](https://t.me/fanatat): игра, полный адрес страницы, устройство
и браузер, шаги, ожидаемое и фактическое поведение, снимок экрана и штамп сборки.

Автор: Валерий ([Fanatat](https://github.com/Fanatat)) · [vanatat.ru](https://vanatat.ru/)
