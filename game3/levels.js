/* ============================================================
   levels.js — данные уровней. РАНТАЙМ-ФАЙЛ (входит в игровой архив).
   В игре уровни только ЧИТАЮТСЯ, никакой генерации/солвера здесь.

   Формат уровня: { vials: [...] }
   vials — массив колб. Колба — массив элементов СНИЗУ ВВЕРХ
   (индекс 0 = дно колбы). Пустой массив = пустая колба-буфер.
   Элемент: { color: 'c1'|'c2'|'c3', shape: 'circle'|'square' }.
   Заполненные колбы — СЛУЧАЙНАЯ СМЕСЬ слоёв (не один тип на колбу).

   156 уровней. Уровни 1-2 — ДВА ОБУЧАЮЩИХ, вшиты вручную
   (T=1/1 ход и T=2 одноцветный-разноформенный/2 хода — учат «тап
   источник → тап цель» и «форма считается наравне с цветом» без
   единого слова текста, см. buildTutorialLevel в gen_levels.js).
   Уровни 3+ — вторая модель сложности («теснота + раздроблённость»
   вместо «число ходов», решение основателя), офлайн-скриптом
   gen_levels.js (студийный инструмент, НЕ входит в игровой архив).
   Метод: T заполненных колб получают случайно тасованную смесь юнитов
   T типов (T*4 юнитов на T колб по CAPACITY каждая) + E пустых
   колб-буферов; раскладки, где случайно получилась уже однородная
   (=«собранная») колба, бракуются на этапе генерации. Решаемость — НЕ
   по построению (см. шапку gen_levels.js) — проверяется независимым
   BFS-солвером на настоящих правилах игрока; нерешаемые раскладки
   бракуются и генерируются заново. T растёт 3→6, E падает 3→1-2 по
   кампании (буферов меньше = теснее, не длиннее решение — см. урок в
   gen_levels.js о том, почему «число ходов» — ложная цель для этого
   правила перелива).
   Максимум колб на экране (самый тяжёлый уровень хвоста): 8.
   Перегенерировать: node gen_levels.js (детерминированный сид 20260717).
   ============================================================ */
const LEVELS = [
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      []
    ]
  },
  {
    "vials": [
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      []
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "circle"
        }
      ]
    ]
  },
  {
    "vials": [
      [
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "square"
        },
        {
          "color": "c3",
          "shape": "circle"
        }
      ],
      [
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        },
        {
          "color": "c2",
          "shape": "square"
        }
      ],
      [
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c2",
          "shape": "circle"
        },
        {
          "color": "c3",
          "shape": "square"
        },
        {
          "color": "c1",
          "shape": "circle"
        }
      ]
    ]
  }
];
