/**
 * Финальный проект: пять уровней готовности.
 * Уровни отмечаются вручную — это проект, а не тест с одним правильным ответом.
 */

import { getState, completeChallengeLevel, markChallengeDone } from "../state.js";
import { createSandbox } from "../sandbox.js";
import { icon, escapeHtml } from "../ui.js";
import { playChime, playDrop } from "../audio.js";

const STARTER = `# Ваш финальный проект.
# Можно взять «Угадай число» или придумать своё:
# викторину, генератор историй, трекер привычек.

import random

secret = random.randint(1, 10)
tries = 0
score = 0

while tries < 5:
    guess = int(input("Твой вариант: "))
    tries = tries + 1

    if guess == secret:
        print("Угадал!")
        score = score + 10
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")

print("Очки:", score)
`;

const LEVELS = [
  {
    n: 1,
    tag: "MVP",
    title: "Работает",
    desc: "Самая простая версия: игра запускается, спрашивает игрока и выдаёт результат. Пусть будет некрасиво — главное, работает.",
    checks: [
      "Есть ввод и вывод: input() и print()",
      "Есть правило или секрет, с которым сравнивается игрок",
      "Программа не падает на обычном сценарии",
    ],
  },
  {
    n: 2,
    tag: "Механика",
    title: "Счёт и попытки",
    desc: "Добавьте счёт, ограничение попыток или уровень сложности. Игрок должен понимать, сколько у него попыток и сколько очков.",
    checks: [
      "Есть счёт или счётчик попыток",
      "Есть условие завершения — не бесконечный цикл",
      "Игрок видит итог: очки, попытки или результат",
    ],
  },
  {
    n: 3,
    tag: "Забота",
    title: "Подсказки и сохранение",
    desc: "Сделайте игру понятнее: подсказки «больше/меньше» или «теплее/холоднее», понятный финал, при желании — рекорд в файле.",
    checks: [
      "Есть подсказки, которые помогают принять решение",
      "Секрет не раскрывается раньше времени",
      "Финал понятен: победа, поражение или предложение сыграть снова",
    ],
  },
  {
    n: 4,
    tag: "Автор",
    title: "Своя фича",
    desc: "Добавьте то, чего не было в примере: уровень, бонус, вторую механику, смешные фразы, выбор темы. Это делает проект вашим.",
    checks: [
      "Есть механика, которой не было в стартовом примере",
      "Она влияет на игру, а не просто лежит в коде",
      "Вы можете объяснить, как она работает",
    ],
  },
  {
    n: 5,
    tag: "Финал",
    title: "README и тесты",
    desc: "Доведите проект до состояния, которое не стыдно показать: README, инструкция запуска и пара проверок, что основные функции работают.",
    checks: [
      "В начале кода есть # README и строка «Что это»",
      "Есть «Как запустить»",
      "Есть минимум два assert или ручные тесты",
    ],
  },
];

function celebrate() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "petal-layer";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 18; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 1.4}s`;
    petal.style.animationDuration = `${3.5 + Math.random() * 2.5}s`;
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
    petal.style.background = Math.random() > 0.5 ? "var(--amber)" : "var(--bamboo)";
    layer.appendChild(petal);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 7000);
}

function levelDone(state, n) {
  return Boolean(state.challengeLevels?.[String(n)]) || Boolean(state.challengeDone);
}

function levelCard(level, state) {
  const done = levelDone(state, level.n);
  const previousDone = level.n === 1 || levelDone(state, level.n - 1);
  const available = done || previousDone;
  return `
    <article class="project-level${done ? " is-done" : ""}" data-level="${level.n}">
      <header class="project-level__head">
        <span class="project-level__num">0${level.n}</span>
        <div class="project-level__title">
          <span class="kicker">Уровень ${level.n} · ${escapeHtml(level.tag)}</span>
          <h3>${escapeHtml(level.title)}</h3>
        </div>
        <span class="project-level__status badge ${done ? "badge--success" : "badge--water"}">
          ${done ? `${icon("check")} готово` : icon("target") + " в работе"}
        </span>
      </header>
      <p>${escapeHtml(level.desc)}</p>
      <ul class="project-level__checks">
        ${level.checks
          .map(
            (check) => `<li class="${done ? "is-ok" : ""}">${icon("check")}<span>${escapeHtml(
              check,
            )}</span></li>`,
          )
          .join("")}
      </ul>
      <div class="project-level__foot">
        <button class="btn ${done ? "btn--ghost" : "btn--amber"} btn--small" type="button"
          data-mark-level="${level.n}" ${done || !available ? "disabled" : ""}>
          ${done ? `${icon("check")} Уровень пройден` : available ? "Отметить уровень" : "Сначала предыдущий"}
        </button>
        <span class="small muted">${done ? "Можно возвращаться и улучшать" : "Отмечайте, когда действительно готово"}</span>
      </div>
    </article>`;
}

export function challengeView() {
  const state = getState();
  const doneLevels = LEVELS.filter((level) => levelDone(state, level.n)).length;
  const done = Boolean(state.challengeDone);

  const html = `
    <header class="page-head">
      <div class="container page-head__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки">
          <a href="#/">Сад</a><span class="breadcrumb__sep">/</span>
          <a href="#/module/m12">Финальный проект</a><span class="breadcrumb__sep">/</span>
          <span>Пять уровней</span>
        </nav>
        <span class="kicker">Вершина сада · проект, а не тест</span>
        <h1>Соберите свой финальный проект</h1>
        <p>Пять уровней: от работающего MVP до README и тестов. Можно взять «Угадай число», викторину, трекер привычек или свою идею. Готового решения нет — есть песочница, критерии и подсказки.</p>
        <div class="lesson-head__meta">
          <span class="badge badge--amber">${icon("trophy")} +50 капель за финал</span>
          <span class="badge">${icon("code")} 45–60 минут</span>
          <span class="badge badge--bamboo" data-project-head-badge>${icon("target")} ${doneLevels} / 5 уровней</span>
          ${done ? `<span class="badge badge--success">${icon("check")} Проект пройден</span>` : ""}
        </div>
      </div>
    </header>

    <div class="container section section--tight">
      ${
        done
          ? `<div class="challenge-success" style="margin-bottom:22px">
        <span class="challenge-success__icon">${icon("trophy")}</span>
        <div>
          <h2>Проект готов. Сад расцвёл.</h2>
          <p>Пять уровней пройдены. Теперь проект можно улучшать сколько угодно: добавить уровни, сохранение, новую механику или красивый вывод.</p>
        </div>
      </div>`
          : ""
      }

      <div class="challenge-layout">
        <div>
          <div class="section-heading" style="margin-bottom:14px">
            <span class="kicker">Пять уровней</span>
            <h2>От MVP до проекта</h2>
            <p>Отмечайте уровень, когда он действительно готов. Это не тест с одним правильным ответом — это ваш проект.</p>
          </div>

          <div class="project-progress">
            <div class="progress__row"><span>Готовность проекта</span><strong data-project-progress-label>${doneLevels} / 5</strong></div>
            <div class="progress__track"><span class="progress__fill" data-project-progress style="width:${(doneLevels / 5) * 100}%"></span></div>
          </div>

          <div class="project-levels" data-project-levels>
            ${LEVELS.map((level) => levelCard(level, state)).join("")}
          </div>

          <div class="lesson-block" data-challenge-editor style="margin-top:24px"></div>

          <div class="btn-row" style="margin-top:14px">
            <a class="btn btn--ghost" href="#/module/m12">${icon("arrow-left")} К урокам финального модуля</a>
            <a class="btn btn--ghost" href="#/library">${icon("book")} Библиотека</a>
          </div>

          <div class="task__feedback" data-challenge-feedback hidden role="status"></div>

          <details class="task__hints" style="margin-top:20px">
            <summary>${icon("bulb")} Подсказки по уровням</summary>
            <ul>
              <li><strong>MVP:</strong> сначала один вопрос и один ответ. Не добавляйте всё сразу.</li>
              <li><strong>Счёт:</strong> заведите <code>score</code> или <code>tries</code> и меняйте его внутри цикла.</li>
              <li><strong>Подсказки:</strong> сравните ответ с секретом и скажите «больше» или «меньше».</li>
              <li><strong>Своя фича:</strong> выберите одну маленькую механику, которую сможете объяснить.</li>
              <li><strong>README:</strong> начните файл с <code># README</code>, опишите идею и запуск, добавьте два <code>assert</code>.</li>
            </ul>
          </details>
        </div>

        <aside class="challenge-side">
          <div class="card card--paper">
            <span class="kicker">Если хочется иначе</span>
            <h3 style="margin-top:6px">Три идеи вместо «Угадай число»</h3>
            <ul class="small" style="margin-top:10px;color:var(--ink-soft)">
              <li><strong>Викторина.</strong> Вопрос, варианты, проверка ответа.</li>
              <li><strong>Тренажёр привычек.</strong> Список дел, отметки, счёт.</li>
              <li><strong>Генератор историй.</strong> Случайные герои, места и события.</li>
            </ul>
            <p class="small muted" style="margin-top:10px">Пять уровней подходят к любой идее. Главное — довести проект до README и проверок.</p>
          </div>
          <div class="card">
            <span class="kicker">Помощь рядом</span>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn--ghost btn--small" type="button" data-action="open-cheatsheet">${icon("book")} Шпаргалка</button>
              <a class="btn btn--ghost btn--small" href="#/journal">${icon("alert")} Дневник</a>
            </div>
            <p class="small muted" style="margin-top:12px">Ошибки в песочнице объясняются под консолью. Если застряли — сузьте задачу до одного уровня.</p>
          </div>
          <div class="card">
            <span class="kicker">Сад</span>
            <p class="small" style="margin-top:8px">Пройдено уроков: <strong>${Object.keys(state.doneLessons).length}</strong>. Капель активности: <strong>${state.drops}</strong>.</p>
            <a class="btn btn--ghost btn--small" href="#/map" style="margin-top:10px">${icon("map")} Карта сада</a>
          </div>
        </aside>
      </div>
    </div>`;

  function mount(root) {
    const editorHost = root.querySelector("[data-challenge-editor]");
    const feedback = root.querySelector("[data-challenge-feedback]");
    const progressLabel = root.querySelector("[data-project-progress-label]");
    const progressFill = root.querySelector("[data-project-progress]");
    const headBadge = root.querySelector("[data-project-head-badge]");
    const levelHost = root.querySelector("[data-project-levels]");

    const sandbox = createSandbox({
      code: STARTER,
      minHeight: 300,
      title: "python · ваш проект",
      lessonId: "challenge",
      lessonTitle: "Финальный проект",
      warm: true,
    });
    editorHost.appendChild(sandbox.element);

    function updateProgress() {
      const current = getState();
      const count = LEVELS.filter((level) => levelDone(current, level.n)).length;
      progressLabel.textContent = `${count} / 5`;
      progressFill.style.width = `${(count / 5) * 100}%`;
      if (headBadge) {
        headBadge.innerHTML = count === 5
          ? `${icon("check")} 5 / 5 уровней`
          : `${icon("target")} ${count} / 5 уровней`;
        headBadge.className = count === 5 ? "badge badge--success" : "badge badge--bamboo";
      }
      return count;
    }

    function refreshGates() {
      const current = getState();
      root.querySelectorAll("[data-level]").forEach((card) => {
        const n = Number(card.dataset.level);
        const done = levelDone(current, n);
        const previousDone = n === 1 || levelDone(current, n - 1);
        const button = card.querySelector("[data-mark-level]");
        if (!button) return;
        button.disabled = done || !previousDone;
        if (done) {
          button.className = "btn btn--ghost btn--small";
          button.innerHTML = `${icon("check")} Уровень пройден`;
        } else if (previousDone) {
          button.className = "btn btn--amber btn--small";
          button.textContent = "Отметить уровень";
        } else {
          button.className = "btn btn--ghost btn--small";
          button.textContent = "Сначала предыдущий";
        }
      });
    }

    function finishProject() {
      const isNew = markChallengeDone();
      if (!root.querySelector(".challenge-success")) {
        const banner = document.createElement("div");
        banner.className = "challenge-success";
        banner.style.marginBottom = "22px";
        banner.innerHTML = `
          <span class="challenge-success__icon">${icon("trophy")}</span>
          <div>
            <h2>Проект готов. Сад расцвёл.</h2>
            <p>Пять уровней пройдены. Теперь проект можно улучшать сколько угодно.</p>
          </div>`;
        root.querySelector(".challenge-layout")?.before(banner);
      }
      if (isNew) {
        playChime();
        celebrate();
      }
      feedback.hidden = false;
      feedback.className = "task__feedback is-ok";
      feedback.textContent = isNew
        ? "Все пять уровней пройдены. +50 капель и достижение «Финальный садовник»."
        : "Все пять уровней пройдены. Проект можно улучшать дальше.";
    }

    levelHost.addEventListener("click", (event) => {
      const button = event.target.closest("[data-mark-level]");
      if (!button || button.disabled) return;
      const n = Number(button.dataset.markLevel);
      const current = getState();
      const previousDone = n === 1 || levelDone(current, n - 1);
      if (!previousDone || levelDone(current, n)) return;

      completeChallengeLevel(n);
      playDrop();
      const card = button.closest("[data-level]");
      card.classList.add("is-done");
      card.querySelectorAll(".project-level__checks li").forEach((item) => item.classList.add("is-ok"));
      const status = card.querySelector(".project-level__status");
      status.className = "project-level__status badge badge--success";
      status.innerHTML = `${icon("check")} готово`;
      updateProgress();
      refreshGates();
      feedback.hidden = false;
      feedback.className = "task__feedback is-ok";
      feedback.textContent = n === 5
        ? "Пятый уровень отмечен. Завершаем проект."
        : `Уровень ${n} отмечен. Можно переходить к следующему.`;
      if (n === 5) finishProject();
    });

    if (done) {
      // Старый прогресс: challengeDone без уровней — показываем все уровни пройденными.
      updateProgress();
    }
    refreshGates();
  }

  return { html, mount };
}
