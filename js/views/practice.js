/**
 * Тренажёр: упражнения всех типов с фильтрами + повторение карточек.
 * Типы: predict (предскажи вывод), read (прочитай код), bug (найди ошибку),
 * fill (допиши строку), assemble (собери код).
 */
import { loadLibrary } from "../data/library/index.js";
import { modules, getLesson } from "../data/modules.js";
import { getState, markExerciseDone, addDrops, reviewCard } from "../state.js";
import { icon, escapeHtml, plural } from "../ui.js";
import { highlightPython } from "../syntax.js";

const TYPE_LABELS = {
  predict: "Предскажи вывод",
  read: "Прочитай код",
  bug: "Найди ошибку",
  fill: "Допиши строку",
  assemble: "Собери код",
};

const PAGE = 12;
const collapse = (text) => String(text).replace(/\s+/g, " ").trim();

/** Детерминированное перемешивание, чтобы порядок кусочков не прыгал между рендерами. */
function shuffled(items, seedText) {
  let seed = [...seedText].reduce((sum, ch) => sum + ch.charCodeAt(0), 7);
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.every((item, i) => item === items[i]) && out.length > 1) out.push(out.shift());
  return out;
}

function exerciseBody(ex) {
  switch (ex.type) {
    case "predict":
    case "read":
      return `<pre><code>${highlightPython(ex.code)}</code></pre>
        <div class="ex-options" role="group" aria-label="Варианты ответа">
          ${ex.options
            .map((option, i) => `<button class="ex-option" type="button" data-option="${i}"><code>${escapeHtml(option)}</code></button>`)
            .join("")}
        </div>`;
    case "bug":
      return `<ol class="ex-lines" role="group" aria-label="Строки кода">
          ${ex.lines
            .map((line, i) => `<li><button class="ex-line" type="button" data-line="${i}"><code>${escapeHtml(line)}</code></button></li>`)
            .join("")}
        </ol>`;
    case "fill": {
      const [before, after] = ex.code.split("___");
      return `<pre class="ex-fill"><code>${escapeHtml(before)}<input class="ex-input" type="text" data-fill aria-label="Пропущенный фрагмент" autocomplete="off" autocapitalize="off" spellcheck="false" size="10">${escapeHtml(after)}</code></pre>
        <button class="btn btn--amber btn--small" type="button" data-check-fill>${icon("check")} Проверить</button>`;
    }
    case "assemble":
      return `<div class="ex-assemble">
          <ol class="ex-answer" data-answer aria-label="Ваша сборка"></ol>
          <div class="ex-pool" data-pool aria-label="Кусочки кода"></div>
        </div>
        <div class="btn-row">
          <button class="btn btn--amber btn--small" type="button" data-check-assemble>${icon("check")} Проверить</button>
          <button class="btn btn--ghost btn--small" type="button" data-reset-assemble>${icon("reset")} Сначала</button>
        </div>`;
    default:
      return "";
  }
}

function exerciseCard(ex, solved) {
  const module = modules.find((m) => m.id === ex.moduleId);
  const lesson = ex.lesson ? getLesson(ex.lesson) : null;
  return `<article class="ex${solved ? " is-solved" : ""}" data-ex="${ex.id}">
    <header class="ex__head">
      <span class="badge badge--bamboo">${TYPE_LABELS[ex.type] || ex.type}</span>
      <span class="ex__level" aria-label="Сложность ${ex.level} из 3" title="Сложность ${ex.level} из 3">${"●".repeat(ex.level)}<span class="ex__level-off">${"●".repeat(3 - ex.level)}</span></span>
      <span class="small muted">${module ? escapeHtml(module.number + ". " + module.title.split(" — ")[0]) : ""}</span>
      ${solved ? `<span class="badge badge--success">${icon("check")} решено</span>` : ""}
    </header>
    <p class="ex__prompt">${escapeHtml(ex.prompt)}</p>
    ${exerciseBody(ex)}
    <div class="ex__feedback" data-feedback aria-live="polite"></div>
    ${lesson ? `<a class="lib-ref" href="#/lesson/${lesson.id}">${icon("book")} Урок: ${escapeHtml(lesson.title)}</a>` : ""}
  </article>`;
}

/** Навешивает поведение на одну карточку упражнения. */
function wireExercise(card, ex, onSolved) {
  const feedback = card.querySelector("[data-feedback]");
  let finished = false;

  function finish(ok, message) {
    feedback.className = `ex__feedback ${ok ? "is-ok" : "is-retry"}`;
    feedback.innerHTML = `<p><strong>${ok ? "Верно." : "Почти."}</strong> ${escapeHtml(message)}</p>`;
    if (ok && !finished) {
      finished = true;
      card.classList.add("is-solved");
      onSolved(ex);
    }
  }
  const explainText = ex.explain;

  if (ex.type === "predict" || ex.type === "read") {
    card.querySelectorAll("[data-option]").forEach((button) =>
      button.addEventListener("click", () => {
        const ok = Number(button.dataset.option) === ex.correct;
        button.classList.add(ok ? "is-right" : "is-wrong");
        if (ok) card.querySelectorAll("[data-option]").forEach((b) => (b.disabled = true));
        finish(ok, ok ? explainText : `Это не тот вариант. Прочитайте код ещё раз, строка за строкой. ${ex.type === "predict" ? "Можно проверить в песочнице." : ""}`);
      }),
    );
  } else if (ex.type === "bug") {
    card.querySelectorAll("[data-line]").forEach((button) =>
      button.addEventListener("click", () => {
        const ok = Number(button.dataset.line) === ex.badLine;
        button.classList.add(ok ? "is-right" : "is-wrong");
        if (ok) {
          card.querySelectorAll("[data-line]").forEach((b) => (b.disabled = true));
          finish(true, `${explainText} Исправленная строка: ${ex.fix}`);
        } else {
          finish(false, "В этой строке всё в порядке. Посмотрите на кавычки, скобки и двоеточия.");
        }
      }),
    );
  } else if (ex.type === "fill") {
    const input = card.querySelector("[data-fill]");
    const check = () => {
      const value = collapse(input.value);
      const ok = ex.answers.some((answer) => collapse(answer) === value);
      finish(ok, ok ? explainText : "Пока не сходится. Проверьте регистр и кавычки — Python чувствителен к ним.");
    };
    card.querySelector("[data-check-fill]").addEventListener("click", check);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") check();
    });
  } else if (ex.type === "assemble") {
    const answer = card.querySelector("[data-answer]");
    const pool = card.querySelector("[data-pool]");
    const order = shuffled(ex.pieces.map((p) => p.id), ex.id);
    let chosen = [];
    const code = (id) => ex.pieces.find((p) => p.id === id).code;
    const draw = () => {
      answer.innerHTML = chosen
        .map((id) => `<li><button class="ex-piece" type="button" data-unpick="${id}"><code>${escapeHtml(code(id))}</code></button></li>`)
        .join("");
      pool.innerHTML = order
        .filter((id) => !chosen.includes(id))
        .map((id) => `<button class="ex-piece" type="button" data-pick="${id}"><code>${escapeHtml(code(id))}</code></button>`)
        .join("");
    };
    card.addEventListener("click", (event) => {
      const pick = event.target.closest("[data-pick]");
      const unpick = event.target.closest("[data-unpick]");
      if (pick) chosen.push(pick.dataset.pick);
      else if (unpick) chosen = chosen.filter((id) => id !== unpick.dataset.unpick);
      else return;
      draw();
    });
    card.querySelector("[data-reset-assemble]").addEventListener("click", () => {
      chosen = [];
      draw();
    });
    card.querySelector("[data-check-assemble]").addEventListener("click", () => {
      const ok = chosen.length === ex.solution.length && chosen.every((id, i) => code(id) === code(ex.solution[i]));
      finish(ok, ok ? explainText : "Порядок пока не сходится. Подумайте, что должно произойти первым.");
    });
    draw();
  }
}

function trainerHTML(lib) {
  return `
    <div class="lib-toolbar">
      <label class="lib-select"><span class="visually-hidden">Модуль</span>
        <select data-f-module><option value="">Все модули</option>
          ${modules.map((m) => `<option value="${m.id}">${m.number}. ${escapeHtml(m.title.split(" — ")[0])}</option>`).join("")}
        </select></label>
      <label class="lib-select"><span class="visually-hidden">Сложность</span>
        <select data-f-level><option value="">Любая сложность</option><option value="1">● лёгкие</option><option value="2">●● средние</option><option value="3">●●● подумать</option></select></label>
      <label class="lib-select"><span class="visually-hidden">Тип</span>
        <select data-f-type><option value="">Все типы</option>
          ${Object.entries(TYPE_LABELS).map(([id, label]) => `<option value="${id}">${label}</option>`).join("")}
        </select></label>
      <label class="lib-select"><span class="visually-hidden">Статус</span>
        <select data-f-status><option value="">Все</option><option value="todo">Нерешённые</option><option value="done">Решённые</option></select></label>
    </div>
    <p class="lib-count small muted" data-count aria-live="polite"></p>
    <div class="ex-list" data-list></div>
    <div class="btn-row" style="justify-content:center;margin-top:18px"><button class="btn btn--ghost" type="button" data-more hidden>Показать ещё</button></div>`;
}

function mountTrainer(host, lib) {
  host.innerHTML = trainerHTML(lib);
  const list = host.querySelector("[data-list]");
  const count = host.querySelector("[data-count]");
  const more = host.querySelector("[data-more]");
  const filters = {
    module: host.querySelector("[data-f-module]"),
    level: host.querySelector("[data-f-level]"),
    type: host.querySelector("[data-f-type]"),
    status: host.querySelector("[data-f-status]"),
  };
  let shown = PAGE;
  let filtered = [];

  const onSolved = (ex) => {
    if (markExerciseDone(ex.id)) {
      addDrops(2);
      updateCount();
    }
  };
  const updateCount = () => {
    const done = lib.exercises.filter((e) => getState().practice[e.id]).length;
    count.textContent = `Найдено: ${filtered.length}. Решено ${done} из ${lib.exercises.length}.`;
  };

  function apply(reset = true) {
    if (reset) shown = PAGE;
    const practice = getState().practice;
    filtered = lib.exercises.filter(
      (e) =>
        (!filters.module.value || e.moduleId === filters.module.value) &&
        (!filters.level.value || String(e.level) === filters.level.value) &&
        (!filters.type.value || e.type === filters.type.value) &&
        (!filters.status.value || (filters.status.value === "done") === Boolean(practice[e.id])),
    );
    const slice = filtered.slice(0, shown);
    list.innerHTML = slice.length
      ? slice.map((e) => exerciseCard(e, Boolean(practice[e.id]))).join("")
      : `<div class="empty-state"><h3>Здесь пока пусто</h3><p>Под эти фильтры упражнений нет. Ослабьте один из фильтров — и тропа снова появится.</p></div>`;
    slice.forEach((ex) => wireExercise(list.querySelector(`[data-ex="${ex.id}"]`), ex, onSolved));
    more.hidden = filtered.length <= shown;
    updateCount();
  }

  Object.values(filters).forEach((select) => select.addEventListener("change", () => apply()));
  more.addEventListener("click", () => {
    shown += PAGE;
    apply(false);
  });
  apply();
}

/* --- Повторение ------------------------------------------------------- */

function mountReview(host, libData) {
  const lib = { ...libData, cards: libData.cards.slice() }; // порядок очереди не трогает общий кэш
  const state = () => getState().review;
  const isDue = (card) => !state()[card.id] || state()[card.id].due <= Date.now();

  function nextDue() {
    const upcoming = lib.cards.map((c) => state()[c.id]?.due).filter((d) => d && d > Date.now());
    return upcoming.length ? Math.min(...upcoming) : null;
  }

  function render() {
    const due = lib.cards.filter(isDue);
    if (!lib.cards.length) {
      host.innerHTML = `<div class="empty-state"><h3>Карточек пока нет</h3><p>Они появятся вместе с уроками.</p></div>`;
      return;
    }
    if (!due.length) {
      const when = nextDue();
      const days = when ? Math.max(1, Math.ceil((when - Date.now()) / 86400000)) : null;
      host.innerHTML = `<div class="empty-state"><h3>На сегодня всё повторено</h3>
        <p>${days ? `Следующие карточки созреют примерно через ${days} ${plural(days, ["день", "дня", "дней"])}.` : "Заходите позже."} А пока можно решить пару упражнений.</p></div>`;
      return;
    }
    const card = due[0];
    const module = modules.find((m) => m.id === card.moduleId);
    host.innerHTML = `<div class="review">
      <p class="small muted">К повторению: ${due.length} из ${lib.cards.length} · ${module ? escapeHtml(module.title.split(" — ")[0]) : ""}</p>
      <div class="review-card">
        <p class="review-card__label">Вспомните</p>
        <h3>${escapeHtml(card.front)}</h3>
        <div class="review-card__back" data-back hidden><pre><code>${highlightPython(card.back)}</code></pre></div>
        <div class="btn-row" data-actions>
          <button class="btn btn--primary" type="button" data-reveal>${icon("bulb")} Показать ответ</button>
        </div>
        <div class="btn-row" data-grade hidden>
          <button class="btn btn--amber" type="button" data-grade-yes>${icon("check")} Вспомнил</button>
          <button class="btn btn--ghost" type="button" data-grade-no>${icon("reset")} Ещё раз</button>
        </div>
      </div>
    </div>`;
    const back = host.querySelector("[data-back]");
    host.querySelector("[data-reveal]").addEventListener("click", () => {
      back.hidden = false;
      host.querySelector("[data-actions]").hidden = true;
      host.querySelector("[data-grade]").hidden = false;
      host.querySelector("[data-grade-yes]").focus();
    });
    host.querySelector("[data-grade-yes]").addEventListener("click", () => {
      reviewCard(card.id, true);
      render();
    });
    host.querySelector("[data-grade-no]").addEventListener("click", () => {
      reviewCard(card.id, false);
      // «Ещё раз» — карточка уйдёт в конец очереди этой сессии.
      lib.cards.push(lib.cards.splice(lib.cards.indexOf(card), 1)[0]);
      render();
    });
  }
  render();
}

export function practiceView() {
  const html = `
    <header class="page-head">
      <div class="container page-head__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки"><a href="#/">Сад</a><span class="breadcrumb__sep">/</span><span>Тренажёр</span></nav>
        <span class="kicker">Спокойная практика</span>
        <h1>Тренажёр</h1>
        <p>Короткие упражнения без оценок: предскажите вывод, найдите ошибку, допишите строку, соберите код. А ещё карточки, которые мягко напоминают о пройденном.</p>
      </div>
    </header>
    <div class="container section section--tight lib">
      <div class="lib-tabs" role="tablist" aria-label="Разделы тренажёра">
        <button class="lib-tab" role="tab" type="button" data-pt="trainer" aria-selected="true">Упражнения</button>
        <button class="lib-tab" role="tab" type="button" data-pt="review" aria-selected="false">Повторение</button>
      </div>
      <div data-pbody role="tabpanel"><div class="empty-state"><h3>Готовим упражнения…</h3></div></div>
    </div>`;

  async function mount(root) {
    const lib = await loadLibrary();
    const body = root.querySelector("[data-pbody]");
    const tabs = [...root.querySelectorAll("[data-pt]")];
    const show = (id) => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.pt === id)));
      (id === "trainer" ? mountTrainer : mountReview)(body, lib);
    };
    tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.pt)));
    show("trainer");
  }

  return { html, mount };
}
