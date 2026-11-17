/**
 * «Переменная-коробка»: кладём значение и смотрим, как оно появляется снаружи.
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop } from "../audio.js";
import { getState } from "../state.js";

function isValidName(name) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
}

export function mountVariableBox(container, config = {}, { onSolved } = {}) {
  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("bamboo")} Переменная-коробка</span>
          <h3>${escapeHtml(config.title || "Положите значение в коробку")}</h3>
          <p class="widget__note">${escapeHtml(
            config.note || "Имя — как надпись на коробке. Значение — то, что внутри.",
          )}</p>
        </div>
      </div>
      <div class="var-box__form">
        <label class="field">
          <span>Имя переменной</span>
          <input type="text" data-name value="flower" maxlength="24" autocomplete="off" spellcheck="false">
        </label>
        <label class="field">
          <span>Значение</span>
          <input type="text" data-value value="сакура" maxlength="40" autocomplete="off">
        </label>
        <label class="field">
          <span>Тип</span>
          <select data-type>
            <option value="str">строка</option>
            <option value="int">число</option>
          </select>
        </label>
      </div>
      <div class="var-box__stage" data-stage>
        <div class="var-box__value" data-var-card>
          <span data-var-label>переменная</span>
          <small data-var-type>пока пусто</small>
        </div>
        <div class="var-box__arrow" aria-hidden="true">→</div>
        <div>
          <div class="var-box__drawing" data-drawing>
            <div class="var-box__lid"></div>
            <div class="var-box__body" data-box-body><span data-box-value>?</span></div>
          </div>
        </div>
      </div>
      <div class="order-actions">
        <button class="btn btn--primary btn--small" type="button" data-put>Положить значение</button>
        <span class="order-feedback" data-feedback role="status" aria-live="polite"></span>
      </div>
      <div class="shopping__code" data-code hidden></div>
    </div>
  `;

  const nameInput = container.querySelector("[data-name]");
  const valueInput = container.querySelector("[data-value]");
  const typeSelect = container.querySelector("[data-type]");
  const drawing = container.querySelector("[data-drawing]");
  const boxBody = container.querySelector("[data-box-body]");
  const boxValue = container.querySelector("[data-box-value]");
  const card = container.querySelector("[data-var-card]");
  const cardLabel = container.querySelector("[data-var-label]");
  const cardType = container.querySelector("[data-var-type]");
  const stage = container.querySelector("[data-stage]");
  const feedback = container.querySelector("[data-feedback]");
  const codeEl = container.querySelector("[data-code]");
  // Уровни: goal — "once" (одна коробка), "overwrite" (новое значение в ту же коробку), "two" (две коробки).
  const goal = config.goal || "once";
  const store = {}; // имя → литерал
  let used = false;

  function put() {
    const name = nameInput.value.trim();
    const raw = valueInput.value;
    const type = typeSelect.value;

    if (!isValidName(name)) {
      feedback.className = "order-feedback is-err";
      feedback.textContent =
        "Имя должно начинаться с буквы или _ и содержать только латинские буквы, цифры и _.";
      return;
    }
    if (type === "int" && !/^-?\d+$/.test(raw.trim())) {
      feedback.className = "order-feedback is-err";
      feedback.textContent = "Для типа «число» введите целое число, например 12.";
      return;
    }

    const value = type === "int" ? raw.trim() : raw;
    const literal = type === "int" ? value : `"${value.replaceAll('"', '\\"')}"`;

    feedback.className = "order-feedback is-ok";
    feedback.textContent = "Готово: значение легло в коробку, а снаружи появилось его имя.";

    drawing.classList.add("is-open");
    stage.classList.add("is-animating");
    boxBody.classList.add("is-filled");
    boxValue.textContent = value || "(пусто)";
    cardLabel.textContent = `${name} = ${value || "(пусто)"}`;
    cardType.textContent = type === "int" ? "число" : "строка";
    card.classList.add("is-filled");

    const replaced = name in store && store[name] !== literal;
    store[name] = literal;
    const names = Object.keys(store);
    codeEl.hidden = false;
    codeEl.innerHTML =
      goal === "once"
        ? `<span class="tok-com"># так это выглядит в Python</span>\n${escapeHtml(`${name} = ${literal}\nprint(${name})`)}\n<span class="tok-com"># вывод: ${escapeHtml(value)}</span>`
        : `<span class="tok-com"># коробок: ${names.length}${replaced ? " · значение заменено" : ""}</span>\n${escapeHtml(
            names.map((key) => `${key} = ${store[key]}`).join("\n") + "\n" + names.map((key) => `print(${key})`).join("\n"),
          )}`;

    window.setTimeout(() => {
      drawing.classList.remove("is-open");
      stage.classList.remove("is-animating");
    }, 900);

    const solved = goal === "once" ? true : goal === "overwrite" ? replaced : names.length >= 2;
    if (goal === "overwrite" && !replaced) feedback.textContent = "Теперь положите в ту же коробку другое значение: имя оставьте прежним.";
    if (goal === "two" && names.length < 2) feedback.textContent = "Одна коробка есть. Придумайте другое имя — и положите вторую.";
    if (solved && !used) {
      used = true;
      if (getState().sound) playDrop();
      onSolved?.();
    }
  }

  container.querySelector("[data-put]").addEventListener("click", put);
  [nameInput, valueInput].forEach((field) => {
    field.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        put();
      }
    });
  });
}
