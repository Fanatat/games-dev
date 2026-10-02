# Тестовый стенд браузерных игр

Здесь можно попробовать семь сборок перед публикацией на площадках.
[Открыть каталог](https://fanatat.github.io/games-dev/).

| Игра | Тестовая сборка | Репозиторий игры | Снимок Git на 28.09.2026 |
|---|---|---|---|
| Словоход | [Открыть](https://fanatat.github.io/games-dev/slovokhod/) | [Код](https://github.com/Fanatat/slovokhod-vk) | `9f73050` |
| Кот и японские кроссворды | [Открыть](https://fanatat.github.io/games-dev/catnonogram/) | [Код](https://github.com/Fanatat/catnonogram-vk) | `9f73050` |
| Сортировка: Цвет и Форма | [Открыть](https://fanatat.github.io/games-dev/color-sort/) | [Код](https://github.com/Fanatat/Color_Sort-Vk) | `9f73050` |
| Две крепости (Lane Battler) | [Открыть](https://fanatat.github.io/games-dev/lane-battle/) | [Код](https://github.com/Fanatat/lane-battle-vk) | `9f73050` |
| Королевская Косынка (Royal Solitaire) | [Открыть](https://fanatat.github.io/games-dev/royal-solitaire/) | [Код](https://github.com/Fanatat/Royal_solitaire) | `9f73050` |
| Game7 (Horde), зомби-экшен на Unity WebGL | [Открыть](https://fanatat.github.io/games-dev/game7-horde/) | закрытый репозиторий | `953e638`, снимок от 30.09.2026 |
| Police Runner, 3D-раннер на Godot 4 | [Открыть](https://fanatat.github.io/games-dev/police-runner/) | закрытый репозиторий | `a8e6244`, этап 2 (b3), 02.10.2026 |

Идентификатор обозначает проверенный снимок репозитория, а не номер релиза игры.
Game7 собрана как dev-сборка Unity WebGL (Gzip, с запасной распаковкой в JS — Pages не отдаёт `Content-Encoding`): показывает счётчик FPS, первая загрузка около 17 МБ.
Police Runner — Web-экспорт Godot 4.7 без потоков: движку нужен HTTPS (по http с другого устройства не запускается), `index.wasm` около 40 МБ без сжатия. Debug-панель — F1 или 5 касаний в левый верхний угол.
Тестовая версия может отличаться от релизной контентом, звуком, сохранениями и
интеграциями площадок. Наличие страницы не подтверждает публикацию в каталоге VK,
Яндекс Игр или CrazyGames. Обновление тестовой сборки — замена папки игры целиком.

## Локально

```bash
git clone https://github.com/Fanatat/games-dev.git
cd games-dev
python3 -m http.server 8000 --bind 127.0.0.1
```

Откройте http://localhost:8000/. Реклама, покупки и облачные сохранения требуют
соответствующей площадки.

## Сообщить об ошибке

Напишите [@fanatat](https://t.me/fanatat): название игры, полный адрес страницы,
устройство и браузер, шаги, ожидаемый результат и фактическое поведение.
Добавьте снимок экрана и идентификатор сборки, если он показан в игре.
