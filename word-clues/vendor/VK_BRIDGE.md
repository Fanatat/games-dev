# vk-bridge.min.js — справка об источнике

Стандарт студии: чужой SDK в сборке только со справкой. Файл взят без правок из
`game_studio/game1/vendor/vk-bridge.min.js` (Словоход, живёт в ВК); его происхождение
подробно проверено в `game_studio/game3-fork1/VK_SDK_SPRAVKA.md`.

| Параметр | Значение |
|---|---|
| Пакет | `@vkontakte/vk-bridge` 3.0.2, `package/dist/browser.min.js` |
| Размер | 4428 байт — норма для тонкого браузерного бандла |
| SHA256 | `827ba6f457cd9e73519b58b2c66564caf138645202f1bba37dca0b567f601bb4` |

Проверка: `sha256sum vendor/vk-bridge.min.js`. Версию не поднимать «на latest»: новая
версия — новая справка и прогон теста `VK` (tests/e2e.js).
