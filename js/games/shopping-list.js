/**
 * Интерактивный список покупок: добавляем, удаляем, смотрим код.
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop, playTick } from "../audio.js";
import { getState } from "../state.js";

export function mountShoppingList(container, config = {}, { onSolved } = {}) {
  // Режимы уровней: "add" — только добавляем; "list" — добавляем и удаляем (как раньше);
  // "dict" — картотека с количеством: словарь «товар → сколько».
  const mode = config.mode || "list";
  let items = ["хлеб", "молоко", "чай"];
  const cart = { хлеб: 1, молоко: 2, чай: 1 };
  let incremented = false;
  let removedOnce = false;
  let addedThree = false;
  let startedWithThree = true;

  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("book")} Список</span>
          <h3>${escapeHtml(config.title || "Список покупок")}</h3>
          <p class="widget__note">${escapeHtml(
            config.note || "Добавляйте и удаляйте — код внизу обновляется вместе со списком.",
          )}</p>
        </div>
        <span class="badge badge--water" data-count></span>
      </div>
      <div class="shopping">
        <div class="shopping__form">
          <input type="text" data-new placeholder="Что купить? Например, сыр" maxlength="30" autocomplete="off">
          <button class="btn btn--primary btn--small" type="button" data-add>${icon("check")} Добавить</button>
        </div>
        <ul class="shopping__list" data-list></ul>
        <div class="shopping__code" data-code></div>
      </div>
    </div>
  `;

  const listEl = container.querySelector("[data-list]");
  const input = container.querySelector("[data-new]");
  const countEl = container.querySelector("[data-count]");
  const codeEl = container.querySelector("[data-code]");

  const quote = (text) => `"${String(text).replaceAll('"', '\\"')}"`;

  function render() {
    const names = mode === "dict" ? Object.keys(cart) : items;
    listEl.innerHTML = names.length
      ? names
          .map((item, index) => {
            const label = mode === "dict" ? `<code>${escapeHtml(item)}: ${cart[item]}</code>` : `<code>[${index}]</code>`;
            const text = mode === "dict" ? `<span>${escapeHtml(item)} × ${cart[item]}</span>` : `<span>${escapeHtml(item)}</span>`;
            const plus = mode === "dict" ? `<button type="button" data-plus="${escapeHtml(item)}" aria-label="Ещё одну: ${escapeHtml(item)}">+</button>` : "";
            const del =
              mode === "add"
                ? ""
                : `<button type="button" data-remove="${mode === "dict" ? escapeHtml(item) : index}" aria-label="Удалить ${escapeHtml(item)}">${icon("close")}</button>`;
            return `<li class="shopping__item">${label}${text}${plus}${del}</li>`;
          })
          .join("")
      : `<li class="shopping__empty">Полка пуста. Добавьте первую покупку.</li>`;

    countEl.textContent = mode === "dict" ? `${names.length} видов` : `${items.length} шт.`;

    const lines =
      mode === "dict"
        ? [
            `cart = {${names.map((name) => `${quote(name)}: ${cart[name]}`).join(", ")}}`,
            "",
            "for name, count in cart.items():",
            '    print(name, "×", count)',
          ]
        : [
            `products = [${items.map(quote).join(", ")}]`,
            ...(mode === "add" ? ["products.append(\"новый товар\")  # так добавляют в конец"] : []),
            "",
            "for product in products:",
            '    print("Купить:", product)',
          ];
    codeEl.textContent = lines.join("\n");

    listEl.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        if (mode === "dict") delete cart[button.dataset.remove];
        else items.splice(Number(button.dataset.remove), 1);
        removedOnce = true;
        if (getState().sound) playTick();
        render();
        checkSolved();
      });
    });
    listEl.querySelectorAll("[data-plus]").forEach((button) => {
      button.addEventListener("click", () => {
        cart[button.dataset.plus] += 1;
        incremented = true;
        if (getState().sound) playDrop();
        render();
        checkSolved();
      });
    });
  }

  function checkSolved() {
    if (mode === "add") {
      if (items.length >= 5) onSolved?.();
    } else if (mode === "dict") {
      if (incremented && removedOnce && Object.keys(cart).length >= 3) onSolved?.();
    } else {
      const addedEnough = items.length > 3 || (startedWithThree && !removedOnce);
      if ((addedThree || addedEnough) && removedOnce) onSolved?.();
    }
  }

  function add() {
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    if (mode === "dict") {
      if (Object.keys(cart).length >= 10 && !(value in cart)) {
        input.value = "";
        return;
      }
      cart[value] = (cart[value] || 0) + 1;
      if (value in cart && cart[value] > 1) incremented = true;
    } else {
      if (items.length >= 12) {
        input.value = "";
        return;
      }
      items.push(value);
      if (items.length >= 6) addedThree = true;
    }
    input.value = "";
    if (getState().sound) playDrop();
    render();
    checkSolved();
    input.focus();
  }

  container.querySelector("[data-add]").addEventListener("click", add);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    }
  });

  render();
}
