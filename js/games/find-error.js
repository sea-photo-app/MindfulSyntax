/**
 * Игра «Найди ошибку»: клик по строке, где Python запутается.
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop, playStone } from "../audio.js";
import { getState } from "../state.js";

export function mountFindError(container, config = {}, { onSolved } = {}) {
  const lines = config.lines || [];
  // Уровень «несколько ошибок в одном файле»: badLines — все строки, которые нужно найти.
  const badLines = Array.isArray(config.badLines) ? config.badLines : [Number.isInteger(config.badLine) ? config.badLine : 0];
  const found = new Set();

  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("alert")} Найдите ошибку</span>
          <h3>${escapeHtml(config.title || "В какой строке ошибка?")}</h3>
          <p class="widget__note">${badLines.length > 1 ? `В файле ${badLines.length} ошибки. Найдите все строки, в которых Python запутается.` : "Нажмите на строку, в которой Python не поймёт код."}</p>
        </div>
      </div>
      <div class="find-error">
        <div class="find-error__bar">${escapeHtml(config.file || "greeting.py")}</div>
        <div class="find-error__code" role="group" aria-label="Строки кода">
          ${lines
            .map(
              (line, index) => `
            <button class="find-error__line" type="button" data-line="${index}">
              <span class="find-error__num">${index + 1}</span>
              <span class="find-error__text">${escapeHtml(line)}</span>
            </button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="find-error__feedback" hidden aria-live="polite"></div>
    </div>
  `;

  const feedback = container.querySelector(".find-error__feedback");
  const buttons = [...container.querySelectorAll(".find-error__line")];
  let solved = false;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (solved) return;
      const index = Number(button.dataset.line);
      if (badLines.includes(index)) {
        if (found.has(index)) return;
        found.add(index);
        button.classList.add("is-bad");
        button.disabled = true;
        if (found.size < badLines.length) {
          feedback.hidden = false;
          feedback.innerHTML = `<strong>Нашли.</strong> Ещё ${badLines.length - found.size} — ищите дальше. Найдено: ${found.size} из ${badLines.length}.`;
          if (getState().sound) playDrop();
          return;
        }
        solved = true;
        buttons.forEach((item) => {
          item.disabled = true;
        });
        feedback.hidden = false;
        feedback.innerHTML = `<strong>Верно.</strong> ${escapeHtml(config.explain || "")}`;
        if (getState().sound) playDrop();
        onSolved?.();
        return;
      }

      button.classList.add("is-wrong");
      window.setTimeout(() => button.classList.remove("is-wrong"), 380);
      feedback.hidden = false;
      feedback.textContent =
        "Пока не эта строка. Прочитайте код медленно: где открывается скобка или кавычка и не закрывается?";
      if (getState().sound) playStone();
    });
  });
}
