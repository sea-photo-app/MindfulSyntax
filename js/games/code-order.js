/**
 * «Собери код»: перетаскивание строк (и клики для клавиатуры и телефона).
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop, playStone } from "../audio.js";
import { getState } from "../state.js";

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function mountCodeOrder(container, config = {}, { onSolved } = {}) {
  const pieces = config.pieces || [];
  const solution = config.solution || pieces.map((piece) => piece.id);
  const byId = new Map(pieces.map((piece) => [piece.id, piece]));

  let pool = shuffle(pieces.map((piece) => piece.id));
  let target = [];
  let solved = false;

  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("code")} Соберите код</span>
          <h3>${escapeHtml(config.title || "Соберите программу")}</h3>
          <p class="widget__note">Перетащите строки справа налево или просто нажимайте на них.</p>
        </div>
      </div>
      <div class="order-game">
        <div class="order-column">
          <h4>${icon("code")} Строки</h4>
          <div class="order-pool" data-pool aria-label="Доступные строки кода"></div>
        </div>
        <div class="order-column">
          <h4>${icon("check")} Ваша программа</h4>
          <div class="order-target" data-target aria-label="Собранная программа"></div>
        </div>
      </div>
      <div class="order-actions">
        <button class="btn btn--primary btn--small" type="button" data-order-check>Проверить</button>
        <button class="btn btn--ghost btn--small" type="button" data-reset>Сбросить</button>
        <span class="order-feedback" data-feedback role="status" aria-live="polite"></span>
      </div>
    </div>
  `;

  const poolEl = container.querySelector("[data-pool]");
  const targetEl = container.querySelector("[data-target]");
  const feedback = container.querySelector("[data-feedback]");
  const checkButton = container.querySelector("[data-order-check]");
  const resetButton = container.querySelector("[data-reset]");

  function itemHTML(id, where) {
    const piece = byId.get(id);
    if (!piece) return "";
    return `
      <button class="order-item" type="button" draggable="true" data-id="${id}" data-where="${where}">
        <span class="order-item__handle" aria-hidden="true">⠿</span>
        <code>${escapeHtml(piece.code)}</code>
        <span class="order-item__remove" aria-hidden="true">${where === "target" ? "×" : "→"}</span>
      </button>`;
  }

  function render() {
    poolEl.innerHTML = pool.length
      ? pool.map((id) => itemHTML(id, "pool")).join("")
      : `<div class="order-placeholder">Все строки собраны. Проверьте порядок или верните строку назад.</div>`;
    targetEl.innerHTML = target.length
      ? target.map((id) => itemHTML(id, "target")).join("")
      : `<div class="order-placeholder">Сюда будут падать строки. Начните с первой.</div>`;

    [...container.querySelectorAll(".order-item")].forEach((button) => {
      button.addEventListener("click", () => move(button.dataset.id, button.dataset.where));
      button.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", button.dataset.id);
        event.dataTransfer.effectAllowed = "move";
        button.classList.add("is-dragging");
      });
      button.addEventListener("dragend", () => button.classList.remove("is-dragging"));
    });
  }

  function move(id, from) {
    if (solved) return;
    if (from === "pool") {
      pool = pool.filter((item) => item !== id);
      target.push(id);
    } else {
      target = target.filter((item) => item !== id);
      pool.push(id);
    }
    feedback.textContent = "";
    render();
  }

  targetEl.addEventListener("dragover", (event) => {
    event.preventDefault();
    targetEl.classList.add("is-over");
  });
  targetEl.addEventListener("dragleave", () => targetEl.classList.remove("is-over"));
  targetEl.addEventListener("drop", (event) => {
    event.preventDefault();
    targetEl.classList.remove("is-over");
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    if (pool.includes(id)) {
      pool = pool.filter((item) => item !== id);
      target.push(id);
      feedback.textContent = "";
      render();
    }
  });

  poolEl.addEventListener("dragover", (event) => event.preventDefault());
  poolEl.addEventListener("drop", (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    if (target.includes(id)) {
      target = target.filter((item) => item !== id);
      pool.push(id);
      feedback.textContent = "";
      render();
    }
  });

  checkButton.addEventListener("click", () => {
    const correct = target.length === solution.length && target.every((id, index) => id === solution[index]);
    if (correct) {
      solved = true;
      feedback.className = "order-feedback is-ok";
      feedback.textContent = config.explain || "Верный порядок!";
      checkButton.disabled = true;
      if (getState().sound) playDrop();
      onSolved?.();
    } else {
      feedback.className = "order-feedback is-err";
      feedback.textContent =
        target.length < solution.length
          ? "Программа ещё не собрана: перенесите все строки."
          : "Порядок пока другой. Вспомните: сначала значение, потом действие с ним.";
      if (getState().sound) playStone();
    }
  });

  resetButton.addEventListener("click", () => {
    if (solved) return;
    pool = shuffle(pieces.map((piece) => piece.id));
    target = [];
    feedback.textContent = "";
    render();
  });

  render();
}
