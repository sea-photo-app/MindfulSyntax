/**
 * Песочница: свободный Python в браузере.
 */

import { createSandbox } from "../sandbox.js";
import { icon, escapeHtml } from "../ui.js";
import { getState } from "../state.js";

const EXAMPLES = [
  {
    label: "Привет",
    code: `print("Привет, мир!")
print("Это моя песочница.")`,
  },
  {
    label: "Переменные",
    code: `name = "Аня"
age = 12
print(f"Меня зовут {name}, мне {age} лет.")`,
  },
  {
    label: "Вопрос",
    inputs: ["Аня"],
    code: `name = input("Как тебя зовут? ")
print(f"Привет, {name}!")`,
  },
  {
    label: "Условие",
    code: `temperature = 8

if temperature < 10:
    print("Наденьте куртку")
else:
    print("Можно без куртки")`,
  },
  {
    label: "Цикл",
    code: `for day in range(1, 6):
    print("Поливаем бамбук, день", day)`,
  },
  {
    label: "Список",
    code: `products = ["хлеб", "молоко", "чай"]

for product in products:
    print("Купить:", product)`,
  },
  {
    label: "Функция",
    code: `def greet(name):
    return f"Привет, {name}!"

print(greet("Аня"))
print(greet("Киото"))`,
  },
  {
    label: "random",
    code: `import random

for _ in range(3):
    print("Кубик:", random.randint(1, 6))`,
  },
];

const DEFAULT_CODE = `# Это песочница. Пишите код и нажимайте «Запустить».
# Ctrl + Enter тоже запускает.

name = "мир"
print(f"Привет, {name}!")
`;

export function playgroundView() {
  const state = getState();

  const html = `
    <header class="page-head">
      <div class="container page-head__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки">
          <a href="#/">Сад</a><span class="breadcrumb__sep">/</span><span>Песочница</span>
        </nav>
        <span class="kicker">Свободный эксперимент</span>
        <h1>Песочница Python</h1>
        <p>Здесь можно писать что угодно и видеть результат. Никаких оценок. Настоящий Python работает в браузере через Pyodide; первый запуск может занять несколько секунд.</p>
      </div>
    </header>

    <div class="container section section--tight">
      <div class="playground">
        <div>
          <div class="playground__examples" aria-label="Примеры кода">
            ${EXAMPLES.map(
              (example, index) =>
                `<button class="example-chip" type="button" data-example="${index}">${escapeHtml(
                  example.label,
                )}</button>`,
            ).join("")}
          </div>
          <div class="lesson-block" data-playground-editor style="margin-top:14px"></div>
        </div>

        <aside class="playground__side">
          <div class="card">
            <span class="kicker">Как это работает</span>
            <ol class="small" style="margin-top:10px;color:var(--ink-soft)">
              <li>Напишите код в редакторе.</li>
              <li>Нажмите «Запустить» — код выполнится в отдельном потоке.</li>
              <li>Если программа зациклится, она остановится через 15 секунд.</li>
            </ol>
            <div class="info-strip" style="margin-top:14px">
              ${icon("drop")}
              <span>Ответы для <code>input()</code> задаются под редактором — по одному на строку.</span>
            </div>
          </div>

          <div class="card">
            <span class="kicker">Если что-то не так</span>
            <p class="small" style="margin-top:8px;color:var(--ink-soft)">Ошибки объясняются простыми словами прямо под консолью. Все они сохраняются в дневнике.</p>
            <div class="btn-row" style="margin-top:12px">
              <a class="btn btn--ghost btn--small" href="#/journal">${icon("alert")} Дневник</a>
              <button class="btn btn--ghost btn--small" type="button" data-action="open-cheatsheet">${icon("book")} Шпаргалка</button>
            </div>
          </div>

          <div class="card card--paper">
            <span class="kicker">Ваш сад</span>
            <div class="stat-row" style="margin-top:10px;grid-template-columns:1fr 1fr">
              <div class="stat" style="padding:12px"><div class="stat__value">${state.drops}</div><div class="stat__label">капель активности</div></div>
              <div class="stat" style="padding:12px"><div class="stat__value">${Object.keys(state.doneLessons).length}</div><div class="stat__label">уроков</div></div>
            </div>
            <p class="small muted" style="margin-top:10px">Песочница не даёт капель — здесь можно просто пробовать.</p>
          </div>
        </aside>
      </div>
    </div>`;

  function mount(root) {
    const host = root.querySelector("[data-playground-editor]");
    const sandbox = createSandbox({
      code: DEFAULT_CODE,
      minHeight: 380,
      title: "python · свободная песочница",
      lessonId: "playground",
      lessonTitle: "Песочница",
      warm: true,
    });
    host.appendChild(sandbox.element);

    root.querySelectorAll("[data-example]").forEach((button) => {
      button.addEventListener("click", () => {
        const example = EXAMPLES[Number(button.dataset.example)];
        if (!example) return;
        sandbox.setCode(example.code);
        sandbox.focus();
        // Ответы для input() подставляем, чтобы пример сразу запускался.
        const details = sandbox.element.querySelector(".input-values");
        const field = details?.querySelector("textarea");
        if (field) {
          field.value = (example.inputs || []).join("\n");
          details.hidden = !/\binput\s*\(/.test(example.code);
        }
      });
    });
  }

  return { html, mount };
}
