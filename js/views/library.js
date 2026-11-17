/**
 * Библиотека сада: словарь, рецепты кода, конспекты модулей и атлас ошибок.
 */
import { loadLibrary } from "../data/library/index.js";
import { modules, getLesson } from "../data/modules.js";
import errorsAtlas from "../data/library/errors-atlas.js";
import { icon, escapeHtml, toast, plural } from "../ui.js";
import { highlightPython } from "../syntax.js";

const TABS = [
  { id: "glossary", label: "Словарь" },
  { id: "recipes", label: "Рецепты кода" },
  { id: "summaries", label: "Конспекты" },
  { id: "errors", label: "Атлас ошибок" },
];

const moduleTitle = (id) => modules.find((m) => m.id === id)?.title || "";
const lessonLink = (id) => {
  const lesson = id && getLesson(id);
  return lesson ? `<a class="lib-ref" href="#/lesson/${lesson.id}">${icon("book")} ${escapeHtml(lesson.title)}</a>` : "";
};

function matches(text, query) {
  return !query || text.toLowerCase().includes(query);
}

function renderGlossary(lib, query, moduleId) {
  const items = lib.glossary.filter(
    (g) => (!moduleId || g.moduleId === moduleId) && matches(`${g.term} ${g.definition}`, query),
  );
  if (!items.length) return empty("Такого термина пока нет.");
  return `<dl class="lib-glossary">${items
    .map(
      (g) => `<div class="lib-term"><dt>${escapeHtml(g.term)}</dt><dd>${escapeHtml(g.definition)} ${lessonLink(g.lesson)}</dd></div>`,
    )
    .join("")}</dl>`;
}

function renderRecipes(lib, query, moduleId) {
  const items = lib.recipes.filter(
    (r) => (!moduleId || r.moduleId === moduleId) && matches(`${r.title} ${r.explain} ${r.code}`, query),
  );
  if (!items.length) return empty("Рецепт не найден.");
  return `<div class="lib-recipes">${items
    .map(
      (r) => `<article class="lib-recipe">
        <header><h3>${escapeHtml(r.title)}</h3><span class="badge badge--bamboo">${escapeHtml(moduleTitle(r.moduleId))}</span></header>
        <pre><code>${highlightPython(r.code)}</code></pre>
        <p>${escapeHtml(r.explain)}</p>
        <div class="lib-recipe__actions">
          <button class="btn btn--ghost btn--small" type="button" data-copy="${escapeHtml(r.id)}">${icon("check")} Скопировать</button>
          ${lessonLink(r.lesson)}
        </div>
      </article>`,
    )
    .join("")}</div>`;
}

function renderSummaries(lib, query, moduleId) {
  const items = lib.summaries.filter(
    (s) => (!moduleId || s.moduleId === moduleId) && matches(`${s.title} ${s.points.join(" ")}`, query),
  );
  if (!items.length) return empty("Конспектов по этому запросу нет.");
  return `<div class="lib-summaries">${items
    .map(
      (s) => `<article class="lib-summary"><h3>${escapeHtml(s.title)}</h3>
      <ol>${s.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol></article>`,
    )
    .join("")}</div>`;
}

function renderErrors(query) {
  const items = errorsAtlas.filter((e) => matches(`${e.name} ${e.title} ${e.message} ${e.why} ${e.fix}`, query));
  if (!items.length) return empty("Такой ошибки в атласе пока нет.");
  return `<div class="lib-errors">${items
    .map(
      (e) => `<article class="lib-error">
        <h3>${icon("alert")} ${escapeHtml(e.title)} <span class="badge">${escapeHtml(e.name)}</span></h3>
        <pre class="lib-error__code"><code>${highlightPython(e.code)}</code></pre>
        <pre class="lib-error__msg"><code>${escapeHtml(e.message)}</code></pre>
        <p><strong>Почему.</strong> ${escapeHtml(e.why)}</p>
        <p><strong>Что сделать.</strong> ${escapeHtml(e.fix)} ${lessonLink(e.lesson)}</p>
      </article>`,
    )
    .join("")}</div>`;
}

function empty(text) {
  return `<div class="empty-state"><h3>Ничего не нашлось</h3><p>${escapeHtml(text)} Попробуйте другое слово или сбросьте фильтр модуля.</p></div>`;
}

export function libraryView() {
  const html = `
    <header class="page-head">
      <div class="container page-head__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки"><a href="#/">Сад</a><span class="breadcrumb__sep">/</span><span>Библиотека</span></nav>
        <span class="kicker">Читальня</span>
        <h1>Библиотека сада</h1>
        <p>Словарь терминов, готовые рецепты кода, конспекты модулей и атлас ошибок. Всё, что хочется быстро перечитать, не открывая урок.</p>
      </div>
    </header>
    <div class="container section section--tight lib">
      <div class="lib-toolbar">
        <label class="lib-search">
          <span class="visually-hidden">Поиск по библиотеке</span>
          ${icon("search")}
          <input type="search" placeholder="Поиск: строка, цикл, SyntaxError…" data-lib-search autocomplete="off">
        </label>
        <label class="lib-select">
          <span class="visually-hidden">Модуль</span>
          <select data-lib-module>
            <option value="">Все модули</option>
            ${modules.map((m) => `<option value="${m.id}">${m.number}. ${escapeHtml(m.title.split(" — ")[0])}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="lib-tabs" role="tablist" aria-label="Разделы библиотеки">
        ${TABS.map((t, i) => `<button class="lib-tab" role="tab" type="button" data-tab="${t.id}" aria-selected="${i === 0}">${t.label}</button>`).join("")}
      </div>
      <p class="lib-count small muted" data-lib-count aria-live="polite"></p>
      <div class="lib-body" data-lib-body role="tabpanel"><div class="empty-state"><h3>Открываем читальню…</h3></div></div>
    </div>`;

  async function mount(root) {
    const lib = await loadLibrary();
    const body = root.querySelector("[data-lib-body]");
    const search = root.querySelector("[data-lib-search]");
    const select = root.querySelector("[data-lib-module]");
    const counter = root.querySelector("[data-lib-count]");
    const tabs = [...root.querySelectorAll("[data-tab]")];
    let tab = "glossary";

    function render() {
      const query = search.value.trim().toLowerCase();
      const moduleId = select.value;
      body.innerHTML = {
        glossary: () => renderGlossary(lib, query, moduleId),
        recipes: () => renderRecipes(lib, query, moduleId),
        summaries: () => renderSummaries(lib, query, moduleId),
        errors: () => renderErrors(query),
      }[tab]();
      const n = body.querySelectorAll(".lib-term, .lib-recipe, .lib-summary, .lib-error").length;
      counter.textContent = n ? `${n} ${plural(n, ["запись", "записи", "записей"])}` : "";
      select.disabled = tab === "errors";
    }

    tabs.forEach((button) =>
      button.addEventListener("click", () => {
        tab = button.dataset.tab;
        tabs.forEach((b) => b.setAttribute("aria-selected", String(b === button)));
        render();
      }),
    );
    search.addEventListener("input", render);
    select.addEventListener("change", render);
    body.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-copy]");
      if (!button) return;
      const recipe = lib.recipes.find((r) => r.id === button.dataset.copy);
      try {
        await navigator.clipboard.writeText(recipe.code);
        toast({ title: "Скопировано", text: "Рецепт в буфере обмена.", iconName: "check" });
      } catch {
        toast({ title: "Не получилось скопировать", text: "Выделите код и скопируйте вручную.", iconName: "alert" });
      }
    });
    render();
  }

  return { html, mount };
}
