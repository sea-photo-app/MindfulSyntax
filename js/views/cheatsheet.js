/**
 * Шпаргалка: выезжающая панель со всеми изученными командами и поиском.
 */

import { cheatGroups } from "../data/cheatsheet-data.js";
import { icon, escapeHtml, copyText } from "../ui.js";

const flatItems = cheatGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);

function itemHTML(item, index) {
  return `
    <div class="cheat-item">
      <div class="cheat-item__top">
        <code>${escapeHtml(item.code)}</code>
        <button class="copy-btn" type="button" data-copy-index="${index}" aria-label="Скопировать пример ${escapeHtml(
          item.code,
        )}">${icon("copy")}</button>
      </div>
      <p>${escapeHtml(item.desc)}</p>
      ${item.example ? `<pre>${escapeHtml(item.example)}</pre>` : ""}
    </div>`;
}

function render(query = "") {
  const content = document.getElementById("cheatsheet-content");
  if (!content) return;

  const needle = query.trim().toLowerCase();
  const matches = flatItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      if (!needle) return true;
      return [item.code, item.desc, item.example, item.group, item.keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });

  if (!matches.length) {
    content.innerHTML = `<div class="cheat-empty">
      <p>Ничего не нашлось по запросу «${escapeHtml(query)}».</p>
      <p class="small">Попробуйте короче: <code>print</code>, <code>if</code>, <code>список</code>.</p>
    </div>`;
    return;
  }

  const grouped = new Map();
  matches.forEach(({ item, index }) => {
    if (!grouped.has(item.group)) grouped.set(item.group, []);
    grouped.get(item.group).push({ item, index });
  });

  content.innerHTML = [...grouped.entries()]
    .map(
      ([group, items]) => `
      <section class="cheat-group">
        <h3 class="cheat-group__title">${icon("book")} ${escapeHtml(group)}</h3>
        ${items.map(({ item, index }) => itemHTML(item, index)).join("")}
      </section>`,
    )
    .join("");

  content.querySelectorAll("[data-copy-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = flatItems[Number(button.dataset.copyIndex)];
      if (item) copyText(item.example || item.code, button);
    });
  });
}

export function initCheatsheet() {
  render("");
  const search = document.getElementById("cheatsheet-search");
  if (!search) return;
  search.addEventListener("input", () => render(search.value));
  // При открытии панели поиск начинается с чистого листа.
  document.querySelectorAll('[data-action="open-cheatsheet"]').forEach((button) => {
    button.addEventListener("click", () => {
      search.value = "";
      render("");
    });
  });
}

export { render as renderCheatsheet };
