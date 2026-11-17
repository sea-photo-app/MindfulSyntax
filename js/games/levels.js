/**
 * Уровни игр. Если у виджета в config есть `levels: [{ label, ...переопределения }]`,
 * вокруг него появляются вкладки «Уровень 1 / 2 / 3». Каждый уровень — это тот же
 * виджет с другим config; уровни меняют механику, а не только числа.
 * Первый уровень засчитывает шаг урока (как раньше), следующие дают отдельные капли.
 */
import { escapeHtml } from "../ui.js";

const DEFAULT_LABELS = ["лёгкий", "средний", "сложный"];

export function mountWithLevels(host, config, ctx, mountFn) {
  const levels = config.levels;
  const base = { ...config };
  delete base.levels;

  host.innerHTML = `
    <div class="levels">
      <div class="levels__bar" role="tablist" aria-label="Уровни игры">
        ${levels
          .map(
            (level, i) => `
          <button class="levels__tab" role="tab" type="button" data-level="${i}" aria-selected="false">
            <span class="levels__num">Уровень ${i + 1}</span>
            <span class="levels__label">${escapeHtml(level.label || DEFAULT_LABELS[i] || "")}</span>
            <span class="levels__done" aria-hidden="true">✓</span>
          </button>`,
          )
          .join("")}
      </div>
      <div class="levels__stage" role="tabpanel"></div>
    </div>`;

  const stage = host.querySelector(".levels__stage");
  const tabs = [...host.querySelectorAll("[data-level]")];

  const markDone = (i) => tabs[i].classList.add("is-done");
  levels.forEach((_, i) => ctx.isDone(i) && markDone(i));

  function open(i) {
    tabs.forEach((tab, index) => tab.setAttribute("aria-selected", String(index === i)));
    stage.innerHTML = "";
    const { label, ...overrides } = levels[i];
    mountFn(stage, { ...base, ...overrides }, {
      onSolved: () => {
        ctx.onSolved(i);
        markDone(i);
      },
    });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => open(Number(tab.dataset.level))));
  // Открываем первый невыполненный уровень — так игра «помнит», где вы остановились.
  const firstOpen = levels.findIndex((_, i) => !ctx.isDone(i));
  open(firstOpen === -1 ? 0 : firstOpen);
}
