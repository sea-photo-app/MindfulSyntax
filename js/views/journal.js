/**
 * Дневник ошибок: история и объяснения простыми словами.
 */

import { getState, clearErrors, formatDate } from "../state.js";
import { icon, escapeHtml, toast } from "../ui.js";

export function journalView() {
  const state = getState();
  const errors = state.errors || [];

  const html = `
    <header class="page-head">
      <div class="container page-head__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки">
          <a href="#/">Сад</a><span class="breadcrumb__sep">/</span><span>Дневник ошибок</span>
        </nav>
        <span class="kicker">Ошибки — это подсказки</span>
        <h1>Дневник ошибок</h1>
        <p>Здесь хранятся последние ошибки из песочницы. Мы переводим их на простой русский и подсказываем, куда посмотреть. Это не список провалов, а карта мест, где вы уже побывали.</p>
      </div>
    </header>

    <div class="container section section--tight" style="max-width:900px">
      <div class="section-heading__row" style="margin-bottom:18px">
        <span class="badge badge--water">${errors.length} ${errors.length === 1 ? "запись" : "записей"}</span>
        ${
          errors.length
            ? `<button class="btn btn--ghost btn--small" type="button" data-clear-journal>${icon("reset")} Очистить дневник</button>`
            : ""
        }
      </div>

      <div data-journal-body>
        ${
          errors.length
            ? `<div class="journal-list">
          ${errors
            .map(
              (entry) => `
            <article class="journal-item">
              <div class="journal-item__top">
                <span class="journal-item__name">${icon("alert")} ${escapeHtml(entry.name || "Ошибка")}</span>
                <span class="journal-item__time">${formatDate(entry.at)}${entry.lessonTitle ? ` · ${escapeHtml(entry.lessonTitle)}` : ""}</span>
              </div>
              <p class="journal-item__friendly"><strong>Что случилось:</strong> ${escapeHtml(entry.friendly || "")}</p>
              <p class="journal-item__friendly" style="margin-top:6px"><strong>Что попробовать:</strong> ${escapeHtml(entry.tip || "")}</p>
              ${entry.raw ? `<div class="journal-item__raw">${escapeHtml(entry.raw.slice(0, 500))}</div>` : ""}
              ${
                entry.code
                  ? `<details><summary>Код, который запускался</summary><div class="journal-item__raw">${escapeHtml(
                      entry.code,
                    )}</div></details>`
                  : ""
              }
            </article>`,
            )
            .join("")}
        </div>`
            : `<div class="empty-state">
          <h3>Пока пусто — и это хорошо</h3>
          <p>Когда в песочнице случится ошибка, она появится здесь с объяснением. Ошибки не удаляются автоматически, пока вы не очистите дневник.</p>
          <div class="btn-row" style="justify-content:center;margin-top:16px">
            <a class="btn btn--primary btn--small" href="#/playground">${icon("code")} В песочницу</a>
            <button class="btn btn--ghost btn--small" type="button" data-action="open-cheatsheet">${icon("book")} Шпаргалка</button>
          </div>
        </div>`
        }
      </div>

      <div class="card card--paper" style="margin-top:22px">
        <span class="kicker">Как читать ошибку</span>
        <ol class="small" style="margin-top:10px;color:var(--ink-soft)">
          <li>Посмотрите на <strong>последнюю строку</strong>: там имя ошибки, например <code>SyntaxError</code>.</li>
          <li>Найдите <strong>номер строки</strong> — он часто указан прямо в сообщении.</li>
          <li>Проверьте кавычки, скобки и отступы. Это три самые частые причины.</li>
          <li>Исправьте одну вещь и запустите снова. Так проще понять, что помогло.</li>
        </ol>
      </div>
    </div>`;

  function mount(root) {
    const clearButton = root.querySelector("[data-clear-journal]");
    if (!clearButton) return;
    clearButton.addEventListener("click", () => {
      clearErrors();
      const body = root.querySelector("[data-journal-body]");
      if (body) {
        body.innerHTML = `<div class="empty-state"><h3>Дневник очищен</h3><p>Новые ошибки снова начнут появляться здесь — и это нормально.</p><a class="btn btn--primary btn--small" href="#/playground" style="margin-top:12px">В песочницу</a></div>`;
      }
      clearButton.disabled = true;
      toast({ title: "Дневник очищен", text: "История ошибок удалена.", iconName: "reset" });
    });
  }

  return { html, mount };
}
