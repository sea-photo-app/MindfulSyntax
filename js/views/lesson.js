/**
 * Страница урока: теория, код, квизы, задания и игры.
 */

import {
  getState,
  isStepDone,
  completeStep,
  completeLesson,
  isLessonDone,
  setLastLesson,
  progressPercent,
  lessonCount,
  totalLessonCount,
} from "../state.js";
import { getLessonNeighbors, moduleLessons, moduleProgress } from "../data/modules.js";
import { createSandbox } from "../sandbox.js";
import { evaluateChecks, needsRun, allPassed } from "../checks.js";
import { icon, escapeHtml, toast } from "../ui.js";
import { highlightPython } from "../syntax.js";
import { playDrop, playChime, playStone } from "../audio.js";
import { currentAccount } from "../account.js";
import { mountFindError } from "../games/find-error.js";
import { mountCodeOrder } from "../games/code-order.js";
import { mountVariableBox } from "../games/variable-box.js";
import { mountDialogBuilder } from "../games/dialog-builder.js";
import { mountShoppingList } from "../games/shopping-list.js";
import { mountPipSim } from "../games/pip-sim.js";
import { mountTreeDraw } from "../games/tree-draw.js";
import { mountGuessGame } from "../games/guess-game.js";
import { mountGardenProgress } from "../games/garden-progress.js";
import { mountWithLevels } from "../games/levels.js";

const NOTE_ICONS = {
  analogy: "leaf",
  tip: "bulb",
  warn: "alert",
  water: "drop",
  why: "bulb",
};

const WIDGET_MOUNTS = {
  "find-error": mountFindError,
  "code-order": mountCodeOrder,
  "variable-box": mountVariableBox,
  "dialog-builder": mountDialogBuilder,
  "shopping-list": mountShoppingList,
  "pip-sim": mountPipSim,
  "tree-draw": mountTreeDraw,
  "guess-game": mountGuessGame,
  "garden-progress": mountGardenProgress,
};

function lessonListItem(lesson, currentId, done) {
  return `
    <li>
      <a href="#/lesson/${lesson.id}" class="${done ? "is-done" : ""}" ${
        lesson.id === currentId ? 'aria-current="page"' : ""
      }>
        <span class="lesson-list__status" aria-hidden="true">${done ? "✓" : ""}</span>
        <span>${escapeHtml(lesson.title)}</span>
      </a>
    </li>`;
}

function renderCodeCard(block, index) {
  if (block.runnable !== false) {
    return `<div class="lesson-block" data-sandbox-index="${index}" data-runnable="true"></div>`;
  }
  return `
    <div class="code-card">
      <div class="code-card__bar">
        <span class="code-card__label">python · пример</span>
        <div class="code-card__actions">
          <button class="code-btn" type="button" data-copy-code="${index}">${icon("copy")} Копировать</button>
        </div>
      </div>
      <pre><code>${highlightPython(block.code)}</code></pre>
      ${block.caption ? `<div class="code-card__caption">${block.caption}</div>` : ""}
    </div>`;
}

function renderNote(block) {
  const tone = block.tone || "analogy";
  return `
    <div class="note note--${tone}">
      <span class="note__icon">${icon(NOTE_ICONS[tone] || "leaf")}</span>
      <div class="note__body">
        ${block.title ? `<span class="note__title">${escapeHtml(block.title)}</span>` : ""}
        <div>${block.html}</div>
      </div>
    </div>`;
}

function renderQuiz(block, index, lesson) {
  const stepId = `${lesson.id}:b${index}`;
  const solved = isStepDone(stepId);
  return `
    <div class="quiz" data-quiz data-index="${index}">
      <span class="quiz__label">${icon("bulb")} Проверьте себя</span>
      <p class="quiz__question">${escapeHtml(block.question)}</p>
      <div class="quiz__options">
        ${block.options
          .map(
            (option, optionIndex) => `
          <button class="quiz__option${solved && optionIndex === block.correct ? " is-correct" : ""}" type="button"
            data-option="${optionIndex}" ${solved ? "disabled" : ""}>
            ${escapeHtml(option)}
          </button>`,
          )
          .join("")}
      </div>
      <div class="quiz__explain" ${solved ? "" : "hidden"}>${
        solved ? escapeHtml(block.explain || "") : ""
      }</div>
    </div>`;
}

function renderTask(block, index, lesson) {
  const stepId = `${lesson.id}:b${index}`;
  const done = isStepDone(stepId);
  const checks = block.checks || [];
  const feedback = done
    ? `<div class="task__feedback is-ok" data-task-feedback>${escapeHtml(
        block.success || "Задание засчитано.",
      )}</div>`
    : `<div class="task__feedback" data-task-feedback hidden></div>`;

  return `
    <div class="task${done ? " is-done" : ""}" data-task data-index="${index}" data-step="${stepId}">
      <div class="task__head">
        <div>
          <span class="task__label">${icon("target")} Практика</span>
          <h3>${escapeHtml(block.title || "Ваше задание")}</h3>
        </div>
        <span class="task__done">${icon("check")} Засчитано</span>
      </div>
      <div class="task__prompt">${block.prompt}</div>
      <ul class="task__checks">
        ${checks
          .map(
            (check) => `
          <li class="${done ? "is-ok" : ""}" data-check>${icon("check")}<span>${escapeHtml(
              check.label || "Проверка",
            )}</span></li>`,
          )
          .join("")}
      </ul>
      <div class="lesson-block" data-task-editor></div>
      <div class="task__actions">
        <button class="btn btn--amber btn--small" type="button" data-task-check>
          ${icon("play")} Проверить задание
        </button>
        <span class="small muted">Код запускается здесь же, в песочнице.</span>
      </div>
      <div data-task-feedback-host>${feedback}</div>
      ${
        block.hints?.length
          ? `<details class="task__hints">
          <summary>${icon("bulb")} Подсказки (если застряли)</summary>
          <ul>${block.hints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}</ul>
        </details>`
          : ""
      }
    </div>`;
}

function renderBlock(block, index, lesson) {
  switch (block.type) {
    case "text":
      return `<div class="prose">${block.html}</div>`;
    case "note":
      return renderNote(block);
    case "code":
      return renderCodeCard(block, index);
    case "quiz":
      return renderQuiz(block, index, lesson);
    case "task":
      return renderTask(block, index, lesson);
    case "widget":
      return `<div class="lesson-block" data-widget="${block.widget}" data-index="${index}"></div>`;
    default:
      return "";
  }
}

export function lessonView(lesson, module) {
  if (!currentAccount()) {
    try { sessionStorage.setItem("mindfulsyntax:auth-next", window.location.hash || "#/map"); } catch { /* noop */ }
    if (window.location.hash !== "#/login") window.location.hash = "#/login";
    return { html: "", mount() {} };
  }
  const state = getState();
  const done = isLessonDone(lesson.id);
  const neighbors = getLessonNeighbors(lesson.id);
  const moduleLessonsList = moduleLessons(module.id);
  const moduleDone = moduleLessonsList.filter((item) => state.doneLessons[item.id]).length;
  const lessonInModule = moduleLessonsList.findIndex((item) => item.id === lesson.id) + 1;
  const percent = progressPercent();
  const modulePercent = moduleProgress(module.id, state.doneLessons).percent;

  const blocksHTML = lesson.blocks
    .map((block, index) => `<div class="lesson-block-wrap">${renderBlock(block, index, lesson)}</div>`)
    .join("");

  const html = `
    <div class="container lesson-shell">
      <aside class="lesson-aside" aria-label="Навигация по модулю">
        <div class="lesson-aside__card">
          <a class="breadcrumb" href="#/module/${module.id}">Модуль ${module.number}</a>
          <h2 style="font-size:1.15rem;margin-top:6px">${escapeHtml(module.title)}</h2>
          <div class="progress" style="margin-top:12px">
            <div class="progress__row"><span>Модуль</span><strong>${moduleDone} / ${moduleLessons(module.id).length}</strong></div>
            <div class="progress__track"><span class="progress__fill" style="width:${modulePercent}%"></span></div>
          </div>
        </div>
        <div class="lesson-aside__card">
          <div class="lesson-aside__title">Уроки модуля</div>
          <ul class="lesson-list">
            ${moduleLessons(module.id)
              .map((item) => lessonListItem(item, lesson.id, Boolean(state.doneLessons[item.id])))
              .join("")}
          </ul>
        </div>
        <div class="lesson-aside__card small muted">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span>Весь курс</span><strong style="color:var(--ink)">${lessonCount()} / ${totalLessonCount()}</strong>
          </div>
          <div class="progress__track"><span class="progress__fill" style="width:${percent}%"></span></div>
          <p style="margin-top:10px">${state.drops} капель активности.</p>
          <button class="btn btn--ghost btn--small" type="button" data-action="open-cheatsheet" style="margin-top:8px;width:100%">
            ${icon("book")} Шпаргалка
          </button>
        </div>
      </aside>

      <article class="lesson-main">
        <header class="lesson-head">
          <nav class="breadcrumb" aria-label="Хлебные крошки">
            <a href="#/">Сад</a>
            <span class="breadcrumb__sep">/</span>
            <a href="#/module/${module.id}">${escapeHtml(module.title)}</a>
            <span class="breadcrumb__sep">/</span>
            <span>Урок ${lessonInModule}</span>
          </nav>
          <h1>${escapeHtml(lesson.title)}</h1>
          <p class="lesson-head__summary">${escapeHtml(lesson.summary)}</p>
          ${lesson.goal ? `<p class="lesson-head__goal"><strong>Цель.</strong> ${escapeHtml(lesson.goal)}</p>` : ""}
          <div class="lesson-head__meta">
            <span class="badge badge--bamboo">${icon("leaf")} ${escapeHtml(module.zone)}</span>
            <span class="badge">${icon("book")} ${lesson.minutes} минут</span>
            ${done ? `<span class="badge badge--success">${icon("check")} Урок пройден</span>` : ""}
          </div>
          <div class="lesson-progress progress">
            <div class="progress__row"><span>Прогресс курса</span><strong>${percent}%</strong></div>
            <div class="progress__track"><span class="progress__fill" style="width:${percent}%"></span></div>
          </div>
        </header>

        <div class="lesson-blocks">
          ${blocksHTML}
        </div>

        ${
          lesson.keyIdeas?.length
            ? `<section class="key-ideas">
          <h3>${icon("leaf")} Главное из этого урока</h3>
          <ul>${lesson.keyIdeas.map((idea) => `<li>${escapeHtml(idea)}</li>`).join("")}</ul>
        </section>`
            : ""
        }
        ${
          lesson.recall
            ? `<aside class="lesson-recall">${icon("drop")}<p><strong>Если забудется.</strong> ${escapeHtml(lesson.recall)}</p></aside>`
            : ""
        }

        <section class="lesson-finish${done ? " is-done" : ""}" data-finish>
          ${
            done
              ? `<h2>${icon("check")} Урок пройден</h2>
                 <p>+10 капель активности. Можно идти дальше — или вернуться и перечитать.</p>
                 ${
                   neighbors.next
                     ? `<a class="btn btn--primary btn--small" href="#/lesson/${neighbors.next.id}">Следующий урок ${icon(
                         "arrow",
                       )}</a>`
                     : `<a class="btn btn--amber btn--small" href="#/challenge">Финальный челлендж ${icon("arrow")}</a>`
                 }`
              : `<h2>Закрыть урок?</h2>
                 <p>Отметьте урок пройденным, когда почувствуете, что главное уложилось. Задания можно доделать позже.</p>
                 <button class="btn btn--primary" type="button" data-finish-lesson>${icon("check")} Завершить урок</button>`
          }
        </section>

        <nav class="lesson-nav" aria-label="Соседние уроки">
          ${
            neighbors.prev
              ? `<a href="#/lesson/${neighbors.prev.id}"><span>${icon("arrow-left")} Назад</span><strong>${escapeHtml(
                  neighbors.prev.title,
                )}</strong></a>`
              : `<a class="is-empty" tabindex="-1" aria-hidden="true"><span>Назад</span><strong>—</strong></a>`
          }
          ${
            neighbors.next
              ? `<a href="#/lesson/${neighbors.next.id}"><span>Дальше ${icon("arrow")}</span><strong>${escapeHtml(
                  neighbors.next.title,
                )}</strong></a>`
              : `<a href="#/challenge"><span>Финал ${icon("trophy")}</span><strong>Финальный челлендж</strong></a>`
          }
        </nav>
      </article>
    </div>`;

  function mount(root) {
    setLastLesson(lesson.id);

    // Примеры кода
    lesson.blocks.forEach((block, index) => {
      if (block.type !== "code" || block.runnable === false) return;
      const host = root.querySelector(`[data-sandbox-index="${index}"]`);
      if (!host) return;
      const sandbox = createSandbox({
        code: block.code,
        inputs: block.inputs || [],
        title: block.title || "python · пример",
        minHeight: 150,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        warm: index === 0,
      });
      host.appendChild(sandbox.element);
      host.dataset.mounted = "true";
    });

    // Кнопки копирования у read-only примеров
    root.querySelectorAll("[data-copy-code]").forEach((button) => {
      button.addEventListener("click", async () => {
        const block = lesson.blocks[Number(button.dataset.copyCode)];
        try {
          await navigator.clipboard.writeText(block.code);
          button.innerHTML = `${icon("check")} Скопировано`;
          window.setTimeout(() => {
            button.innerHTML = `${icon("copy")} Копировать`;
          }, 1400);
        } catch {
          toast({ title: "Скопируйте вручную", text: "Браузер не разрешил доступ к буферу.", iconName: "alert" });
        }
      });
    });

    // Квизы
    root.querySelectorAll("[data-quiz]").forEach((quizEl) => {
      const index = Number(quizEl.dataset.index);
      const block = lesson.blocks[index];
      const stepId = `${lesson.id}:b${index}`;
      if (isStepDone(stepId)) return;

      const explain = quizEl.querySelector(".quiz__explain");
      let wrongCount = 0;

      quizEl.querySelectorAll("[data-option]").forEach((optionButton) => {
        optionButton.addEventListener("click", () => {
          const optionIndex = Number(optionButton.dataset.option);
          if (optionIndex === block.correct) {
            quizEl.querySelectorAll("[data-option]").forEach((btn) => {
              btn.disabled = true;
              if (Number(btn.dataset.option) === block.correct) btn.classList.add("is-correct");
            });
            explain.hidden = false;
            explain.textContent = block.explain || "Верно.";
            completeStep(stepId, 3);
            if (getState().sound) playDrop();
          } else {
            wrongCount += 1;
            optionButton.classList.add("is-wrong");
            optionButton.disabled = true;
            explain.hidden = false;
            explain.textContent =
              wrongCount >= 2
                ? "Давайте разберёмся: перечитайте абзац выше и попробуйте ещё раз. Ошибка — это подсказка, а не приговор."
                : "Пока не это. Перечитайте объяснение выше — ответ там есть.";
            if (getState().sound) playStone();
          }
        });
      });
    });

    // Задания
    root.querySelectorAll("[data-task]").forEach((taskEl) => {
      const index = Number(taskEl.dataset.index);
      const block = lesson.blocks[index];
      const stepId = `${lesson.id}:b${index}`;
      const editorHost = taskEl.querySelector("[data-task-editor]");
      const feedbackHost = taskEl.querySelector("[data-task-feedback-host]");
      const checkButton = taskEl.querySelector("[data-task-check]");
      const checkItems = [...taskEl.querySelectorAll("[data-check]")];

      const sandbox = createSandbox({
        code: block.starter || "",
        inputs: block.inputs || [],
        title: "python · задание",
        minHeight: 190,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        warm: index === 0,
      });
      editorHost.appendChild(sandbox.element);

      let busy = false;

      checkButton.addEventListener("click", async () => {
        if (busy) return;
        busy = true;
        const original = checkButton.innerHTML;
        checkButton.disabled = true;
        checkButton.innerHTML = "Проверяю…";

        let result = null;
        if (needsRun(block.checks || [])) {
          result = await sandbox.run();
        }
        const results = evaluateChecks(block.checks || [], {
          code: sandbox.getCode(),
          result,
        });

        checkItems.forEach((item, itemIndex) => {
          item.classList.toggle("is-ok", Boolean(results[itemIndex]?.ok));
        });

        const passed = allPassed(results);
        feedbackHost.innerHTML = "";

        const box = document.createElement("div");
        box.className = `task__feedback ${passed ? "is-ok" : "is-err"}`;
        box.setAttribute("data-task-feedback", "");
        box.setAttribute("role", "status");

        if (passed) {
          box.textContent = block.success || "Задание засчитано. Отлично!";
          taskEl.classList.add("is-done");
          completeStep(stepId, 5);
          if (getState().sound) playDrop();
        } else if (result?.error) {
          box.textContent =
            "Программа остановилась с ошибкой — под консолью есть объяснение простыми словами. Исправьте и проверьте снова.";
          if (getState().sound) playStone();
        } else {
          box.textContent =
            "Пока не всё совпало. Посмотрите на галочки: каждая проверка — маленькая подсказка, что осталось сделать.";
          if (getState().sound) playStone();
        }

        feedbackHost.appendChild(box);
        checkButton.disabled = false;
        checkButton.innerHTML = original;
        busy = false;
      });
    });

    // Игры-виджеты
    root.querySelectorAll("[data-widget]").forEach((host) => {
      const name = host.dataset.widget;
      const index = Number(host.dataset.index);
      const block = lesson.blocks[index];
      const mountFn = WIDGET_MOUNTS[name];
      if (!mountFn) return;
      const stepId = `${lesson.id}:b${index}`;
      const levelStep = (level) => (level > 0 ? `${stepId}:L${level}` : stepId);
      const ctx = {
        onSolved: (level = 0) => {
          if (completeStep(levelStep(level), level > 0 ? 3 : 4)) {
            if (getState().sound) playDrop();
          }
        },
        isDone: (level) => isStepDone(levelStep(level)),
      };
      if (block.config?.levels?.length) {
        mountWithLevels(host, block.config, ctx, mountFn);
      } else {
        mountFn(host, block.config || {}, { onSolved: () => ctx.onSolved(0) });
      }
    });

    // Завершение урока
    const finish = root.querySelector("[data-finish]");
    const finishButton = root.querySelector("[data-finish-lesson]");
    if (finishButton) {
      finishButton.addEventListener("click", () => {
        if (!completeLesson(lesson.id)) return;
        if (getState().sound) playChime();
        toast({
          title: "Урок пройден",
          text: "+10 капель. Счётчик активности вырос.",
          iconName: "drop",
        });
        finish.classList.add("is-done");
        finish.innerHTML = `
          <h2>${icon("check")} Урок пройден</h2>
          <p>+10 капель активности. Можно идти дальше — или вернуться и перечитать.</p>
          ${
            neighbors.next
              ? `<a class="btn btn--primary btn--small" href="#/lesson/${neighbors.next.id}">Следующий урок ${icon(
                  "arrow",
                )}</a>`
              : `<a class="btn btn--amber btn--small" href="#/challenge">Финальный челлендж ${icon("arrow")}</a>`
          }`;
      });
    }
  }

  return { html, mount };
}
