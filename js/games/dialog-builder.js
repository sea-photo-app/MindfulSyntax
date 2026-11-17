/**
 * Мини-диалог: пользователь вводит имя, видит, что выведет программа.
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop } from "../audio.js";
import { getState } from "../state.js";

export function mountDialogBuilder(container, config = {}, { onSolved } = {}) {
  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("sound-on")} Диалог</span>
          <h3>${escapeHtml(config.title || "Соберите мини-диалог")}</h3>
          <p class="widget__note">${escapeHtml(
            config.note || "Напишите имя — и посмотрите, что скажет программа.",
          )}</p>
        </div>
      </div>
      <div class="var-box__form dialog-form">
        <label class="field">
          <span>Как тебя зовут?</span>
          <input type="text" data-dialog-name value="Аня" maxlength="30" autocomplete="off">
        </label>
        <label class="field">
          <span>Город</span>
          <input type="text" data-dialog-city value="Москва" maxlength="30" autocomplete="off">
        </label>
        <button class="btn btn--primary btn--small" type="button" data-dialog-run>Поговорить</button>
      </div>
      <div class="shopping__code" data-dialog-code hidden></div>
      <div class="console" data-dialog-out hidden aria-live="polite"></div>
    </div>
  `;

  const nameField = container.querySelector("[data-dialog-name]");
  const cityField = container.querySelector("[data-dialog-city]");
  const codeEl = container.querySelector("[data-dialog-code]");
  const outEl = container.querySelector("[data-dialog-out]");
  let used = false;

  function speak() {
    const name = nameField.value.trim() || "друг";
    const city = cityField.value.trim() || "неизвестном городе";

    codeEl.hidden = false;
    codeEl.innerHTML = `<span class="tok-com"># то же самое кодом</span>\n${escapeHtml(
      `name = input("Как тебя зовут? ")\ncity = input("В каком городе ты живёшь? ")\nprint(f"Привет, {name}!")\nprint(f"Твой город — {city}.")`,
    )}`;

    outEl.hidden = false;
    outEl.innerHTML = "";
    const line1 = document.createElement("span");
    line1.textContent = `Как тебя зовут? ${name}\n`;
    const line2 = document.createElement("span");
    line2.textContent = `В каком городе ты живёшь? ${city}\n`;
    const line3 = document.createElement("span");
    line3.textContent = `Привет, ${name}!\nТвой город — ${city}.\n`;
    outEl.append(line1, line2, line3);

    if (!used) {
      used = true;
      if (getState().sound) playDrop();
      onSolved?.();
    }
  }

  container.querySelector("[data-dialog-run]").addEventListener("click", speak);
  [nameField, cityField].forEach((field) => {
    field.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        speak();
      }
    });
  });
}
