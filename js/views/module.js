/**
 * Страница модуля: список уроков и прогресс зоны.
 */

import { getState } from "../state.js";
import { modules, moduleProgress } from "../data/modules.js";
import { icon, escapeHtml } from "../ui.js";
import { gardenMapHTML } from "../map.js";

export function moduleView(module) {
  const state = getState();
  const list = module.lessons;
  const progress = moduleProgress(module.id, state.doneLessons);
  const done = progress.done === progress.total;
  const nextModule = modules.find((item) => item.number === module.number + 1) || null;
  const prevModule = modules.find((item) => item.number === module.number - 1) || null;

  const lessonRows = list
    .map((lesson, index) => {
      const isDone = Boolean(state.doneLessons[lesson.id]);
      return `
        <a class="module-lesson${isDone ? " is-done" : ""}" href="#/lesson/${lesson.id}">
          <span class="module-lesson__num">${isDone ? icon("check") : String(index + 1).padStart(2, "0")}</span>
          <span class="module-lesson__body">
            <strong>${escapeHtml(lesson.title)}</strong>
            <span>${escapeHtml(lesson.summary)}</span>
          </span>
          <span class="module-lesson__meta">
            <span class="badge">${lesson.minutes} мин</span>
            ${isDone ? `<span class="badge badge--success">пройден</span>` : ""}
            ${icon("chevron")}
          </span>
        </a>`;
    })
    .join("");

  const html = `
    <header class="page-head">
      <div class="container page-head__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки">
          <a href="#/">Сад</a><span class="breadcrumb__sep">/</span>
          <a href="#/map">Карта</a><span class="breadcrumb__sep">/</span>
          <span>Модуль ${module.number}</span>
        </nav>
        <div class="module-hero">
          <div>
            <span class="kicker">Модуль ${module.number} · ${escapeHtml(module.zone)}</span>
            <h1>${escapeHtml(module.title)}</h1>
            <p class="lead">${escapeHtml(module.description)}</p>
            <div class="lesson-head__meta">
              <span class="badge badge--bamboo">${icon("leaf")} ${list.length} уроков</span>
              <span class="badge">${icon("book")} ${list.reduce((sum, item) => sum + item.minutes, 0)} минут</span>
              ${done ? `<span class="badge badge--success">${icon("trophy")} Зона пройдена</span>` : ""}
            </div>
            <div class="progress" style="margin-top:22px;max-width:440px">
              <div class="progress__row"><span>Прогресс модуля</span><strong>${progress.done} / ${progress.total}</strong></div>
              <div class="progress__track"><span class="progress__fill" style="width:${progress.percent}%"></span></div>
            </div>
          </div>
          <div class="module-stamp" aria-hidden="true">
            <span class="module-stamp__num">0${module.number}</span>
            <span class="module-stamp__zone">${escapeHtml(module.zone)}</span>
            <span class="module-stamp__line"></span>
            <span class="module-stamp__note">${done ? "зона расцвела" : "зона ждёт воды"}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container section section--tight">
      <div class="module-layout">
        <div>
          <div class="section-heading">
            <span class="kicker">Уроки</span>
            <h2>От простого к чуть более сложному</h2>
            <p class="muted">Один урок — 5–7 минут чтения и практики. Затем сразу небольшая практика.</p>
          </div>
          <div class="module-lessons">
            ${lessonRows}
          </div>
          <div class="lesson-nav" style="margin-top:24px">
            ${
              prevModule
                ? `<a href="#/module/${prevModule.id}"><span>${icon("arrow-left")} Предыдущий модуль</span><strong>${escapeHtml(
                    prevModule.title,
                  )}</strong></a>`
                : `<a class="is-empty" aria-hidden="true" tabindex="-1"><span>Начало</span><strong>—</strong></a>`
            }
            ${
              nextModule
                ? `<a href="#/module/${nextModule.id}"><span>Следующий модуль ${icon("arrow")}</span><strong>${escapeHtml(
                    nextModule.title,
                  )}</strong></a>`
                : `<a href="#/challenge"><span>Финал ${icon("trophy")}</span><strong>Финальный челлендж</strong></a>`
            }
          </div>
        </div>

        <aside class="module-side">
          <div class="card card--paper">
            <span class="kicker">Зона сада</span>
            <h3 style="margin-top:6px">${escapeHtml(module.zone)}</h3>
            <p class="small muted" style="margin-top:6px">${escapeHtml(module.tagline)}</p>
            <div class="mini-map">${gardenMapHTML(state.doneLessons, { compact: true })}</div>
            <a class="btn btn--ghost btn--small" href="#/map" style="width:100%;margin-top:6px">${icon("map")} Вся карта</a>
          </div>
          <div class="card">
            <span class="kicker">Маленькая привычка</span>
            <p class="small" style="margin-top:8px">Не бойтесь запускать код с ошибками. Ошибка — это вопрос Python, а не оценка вас.</p>
            <button class="btn btn--ghost btn--small" type="button" data-action="open-cheatsheet" style="margin-top:12px">
              ${icon("book")} Открыть шпаргалку
            </button>
          </div>
        </aside>
      </div>
    </div>`;

  return { html, mount() {} };
}
