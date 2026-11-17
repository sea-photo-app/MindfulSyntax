# Сторонние компоненты

Сайт использует два сторонних проекта, оба лежат локально в `vendor/`, поэтому
работает без интернета.

## Pyodide 0.26.4

- Сайт: <https://pyodide.org/>
- Исходный код: <https://github.com/pyodide/pyodide>
- Лицензия: Mozilla Public License 2.0 (MPL-2.0)
- Что используется: `pyodide.mjs`, `pyodide.asm.js`, `pyodide.asm.wasm`,
  `python_stdlib.zip`, `pyodide-lock.json`.
- Назначение: запуск Python в Web Worker.

Текст лицензии MPL-2.0 доступен по адресу
<https://www.mozilla.org/MPL/2.0/>. Исходный код Pyodide распространяется
под той же лицензией; изменения в файлах Pyodide не вносились.

## Three.js r169 (0.169.0)

- Сайт: <https://threejs.org/>
- Исходный код: <https://github.com/mrdoob/three.js>
- Лицензия: MIT
- Что используется: `vendor/three/three.module.js`,
  `vendor/three/addons/loaders/GLTFLoader.js`,
  `vendor/three/addons/utils/BufferGeometryUtils.js`.
- Назначение: 3D-сцена сада, загрузка GLB-моделей из Blender, свет и анимация.

```
The MIT License

Copyright © 2010-2024 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Blender-модели и рендеры

Все 3D-модели сайта (`assets/models/*.glb`), исходники (`assets/blender/*.blend`)
и мобильный рендер (`assets/garden_mobile_render.webp`) — оригинальные работы
проекта, созданные в Blender. Сторонние модели не используются. Лицензия проекта —
MIT; исходники `.blend` включены в репозиторий.

## Шрифты

Внешние шрифты не загружаются. Используются системные семейства: Iowan Old Style,
Palatino, Georgia, Inter, системный sans-serif и моноширинные шрифты ОС.
- three/examples/jsm/loaders/GLTFLoader.js, utils/BufferGeometryUtils.js r169 (MIT), imports rewritten to relative paths
