/**
 * Ёлочка из звёздочек: ползунок меняет высоту, вывод и код обновляются.
 */

import { icon, escapeHtml } from "../ui.js";
import { playTick } from "../audio.js";
import { getState } from "../state.js";

export function mountTreeDraw(container, config = {}, { onSolved } = {}) {
  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("bamboo")} Рисуем циклом</span>
          <h3>${escapeHtml(config.title || "Вырастите ёлочку")}</h3>
          <p class="widget__note">${escapeHtml(
            config.note || "Двигайте ползунок — и смотрите, как меняется вывод.",
          )}</p>
        </div>
      </div>
      <div class="tree-stage">
        <div class="console tree-console" data-tree-out aria-live="polite"></div>
        <div class="tree-controls">
          <label>
            Высота: <span class="tree-controls__value" data-height>5</span>
            <input type="range" min="1" max="10" value="5" step="1" data-slider>
          </label>
          <div class="small muted">${escapeHtml(config.hint || "Одна звёздочка — одна строка. Цикл повторяет print().")}</div>
          <div class="shopping__code" data-tree-code style="font-size:.72rem"></div>
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector("[data-slider]");
  const heightLabel = container.querySelector("[data-height]");
  const out = container.querySelector("[data-tree-out]");
  const codeEl = container.querySelector("[data-tree-code]");
  let awarded = false;

  function render(feedback = false) {
    const height = Number(slider.value);
    heightLabel.textContent = String(height);
    const style = config.style || "left";
    const rows = Array.from({ length: height }, (_, index) => {
      const row = index + 1;
      if (style === "left") return "*".repeat(row);
      const stars = "*".repeat(2 * row - 1);
      return " ".repeat(height - row) + stars;
    });
    if (style === "trunk") rows.push(" ".repeat(height - 1) + "|", " ".repeat(height - 1) + "|");
    out.textContent = rows.join("\n");
    codeEl.textContent =
      style === "left"
        ? `for row in range(1, ${height + 1}):\n    print("*" * row)`
        : `for row in range(1, ${height + 1}):\n    print(" " * (${height} - row) + "*" * (2 * row - 1))` +
          (style === "trunk" ? `\nfor _ in range(2):\n    print(" " * ${height - 1} + "|")` : "");

    if (feedback && getState().sound) playTick();
  }

  slider.addEventListener("input", () => {
    render(true);
    if (!awarded) {
      awarded = true;
      onSolved?.();
    }
  });
  render(false);
}
