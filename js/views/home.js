/**
 * Главная: тихий вход в курс.
 */

import { getState, lessonCount, totalLessonCount, progressPercent } from "../state.js";
import { modules, totals, moduleProgress, firstUnfinishedLesson } from "../data/modules.js";
import { getModule } from "../data/modules.js";
import { icon, escapeHtml, setupReveal, plural, numberWord } from "../ui.js";
import { earnedCount } from "../achievements.js";

function moduleCard(module, state) {
  const progress = moduleProgress(module.id, state.doneLessons);
  const done = progress.done === progress.total;
  return `
    <a class="module-card reveal${done ? " is-done" : ""}" href="#/module/${module.id}">
      <div class="module-card__top">
        <span class="module-card__num">${done ? icon("check") : `0${module.number}`}</span>
        <span class="badge ${done ? "badge--success" : "badge--bamboo"}">${done ? "пройден" : `${progress.done}/${progress.total}`}</span>
      </div>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.tagline)}</p>
      <div class="module-card__foot">
        <span>${escapeHtml(module.zone)}</span>
        <span class="module-card__pct" aria-hidden="true"><i style="width:${progress.percent}%"></i></span>
      </div>
    </a>`;
}

function featureCard(iconName, title, text) {
  return `
    <div class="feature">
      <span class="feature__icon">${icon(iconName)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </div>`;
}

export function homeView() {
  const state = getState();
  const doneCount = lessonCount();
  const percent = progressPercent();
  const next = firstUnfinishedLesson(state.doneLessons);
  const nextModule = next ? getModule(next.moduleId) : null;
  const allDone = doneCount >= totalLessonCount();
  const earned = earnedCount();

  const heroLead = allDone
    ? "Все уроки пройдены. Остался финальный челлендж: собрать свою мини-игру без готового решения."
    : `${numberWord(totals.modules, true)} маленьких ${plural(totals.modules, ["модуль", "модуля", "модулей"])}, тихая песочница и сад, который растёт вместе с вами. Никакого «нужно знать заранее» — только любопытство.`;
  const ctaHref = allDone ? "#/challenge" : next ? `#/lesson/${next.id}` : "#/module/m1";
  const ctaLabel = allDone
    ? "Финальный челлендж"
    : doneCount > 0
      ? "Продолжить путь"
      : "Начать с нуля";

  const html = `
    <section class="hero hero--art" id="hero">
      <div class="hero__art" aria-hidden="true">
        <div class="hero__art-layer hero__art-layer--sunset" style="background-image:url('./assets/hero/sunset-1920.jpg')"></div>
        <div class="hero__art-layer hero__art-layer--night" style="background-image:url('./assets/hero/night-1920.jpg')"></div>
      </div>
      <div class="hero__veil"></div>
      <div class="container hero__inner">
        <span class="hero__kicker"><span class="hero__kicker-mark">py</span> MindfulSyntax · Python в тихом саду</span>
        <h1>${allDone ? "Сад вырос.<br><em>Пора играть.</em>" : "Код, в котором<br><em>можно дышать.</em>"}</h1>
        <p class="hero__lead">${escapeHtml(heroLead)}</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="${ctaHref}">
            ${doneCount > 0 ? icon("play") : icon("leaf")} ${ctaLabel}
          </a>
          <a class="btn btn--ghost" href="#/map">${icon("map")} Карта сада</a>
        </div>
        ${
          next && !allDone
            ? `<p class="hero__next small">${escapeHtml(nextModule?.title || "")} · ${escapeHtml(
                next.title,
              )} · ${next.minutes} мин</p>`
            : ""
        }
        <ul class="hero__meta">
          <li>${icon("book")} ${totals.lessons} ${plural(totals.lessons, ["урок", "урока", "уроков"])}</li>
          <li>${icon("code")} песочница Python</li>
          <li>${icon("target")} ${Math.ceil(totals.minutes / 60)} ${plural(Math.ceil(totals.minutes / 60), ["час", "часа", "часов"])}</li>
          <li>${icon("leaf")} без опыта</li>
        </ul>
      </div>
      <div class="hero__scroll" aria-hidden="true"><span></span>листайте</div>
    </section>

    <section class="container section">
      <div class="section-heading reveal">
        <span class="kicker">Как это работает</span>
        <h2>Сначала простое. Потом — чуть лучше.</h2>
        <p>Каждый модуль — маленькая зона сада. Уроки короткие, практика сразу. Ошибаться можно и нужно.</p>
      </div>
      <div class="how-grid reveal">
        <div class="how-card">
          <h3>Пять минут теории</h3>
          <p>Одна мысль, одна аналогия, один пример. Без «сначала выучите всё».</p>
        </div>
        <div class="how-card">
          <h3>Сразу запускаем</h3>
          <p>Настоящий Python в браузере: пишете код, нажимаете «Запустить», видите результат.</p>
        </div>
        <div class="how-card">
          <h3>Игра закрепляет</h3>
          <p>Соберите код, найдите ошибку, угадайте число. Каждая игра использует только пройденное.</p>
        </div>
      </div>
    </section>

    <section class="container section section--tight" id="modules">
      <div class="section-heading reveal">
        <div class="section-heading__row">
          <div>
            <span class="kicker">Маршрут</span>
            <h2>${numberWord(totals.modules, true)} ${plural(totals.modules, ["зона", "зоны", "зон"])} сада</h2>
          </div>
          <a class="btn btn--ghost btn--small" href="#/map">${icon("map")} Посмотреть карту</a>
        </div>
        <p>Каждый модуль заканчивается маленькой игрой или челленджем.</p>
      </div>
      <div class="module-grid">
        ${modules.map((module) => moduleCard(module, state)).join("")}
      </div>
    </section>

    <section class="container section section--tight">
      <div class="map-teaser reveal">
        <div class="map-teaser__text">
          <span class="kicker">Карта сада</span>
          <h2>Прогресс видно, а не только в цифрах</h2>
          <p>Каждый пройденный модуль расцвечивает свою зону: тропу у ворот, каменный сад, бамбуковую рощу, пруд. Нажмите на зону, чтобы вернуться к урокам.</p>
          <div class="stat-row" style="margin-top:22px">
            <div class="stat"><div class="stat__value">${percent}%</div><div class="stat__label">сад полит</div></div>
            <div class="stat"><div class="stat__value">${state.drops}</div><div class="stat__label">капель активности</div></div>
            <div class="stat"><div class="stat__value">${earned}</div><div class="stat__label">достижений</div></div>
          </div>
          <div class="btn-row" style="margin-top:20px">
            <a class="btn btn--water" href="#/map">${icon("map")} Открыть карту</a>
            <a class="btn btn--ghost" href="#/playground">${icon("code")} Песочница</a>
          </div>
        </div>
        <div class="map-teaser__map map-teaser__map--art">
          <img class="map-preview map-preview--light" src="./assets/hero/map-preview-light.jpg" alt="Карта сада — бумажный свиток с зонами курса" loading="lazy">
          <img class="map-preview map-preview--dark" src="./assets/hero/map-preview-dark.jpg" alt="" aria-hidden="true" loading="lazy">
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="section-heading reveal">
        <span class="kicker">Не только текст</span>
        <h2>Инструменты, которые помогают не потеряться</h2>
      </div>
      <div class="feature-grid reveal">
        ${featureCard(
          "code",
          "Песочница",
          "Настоящий Python через Pyodide. Если интернета нет — простые примеры выполнятся в демо-режиме.",
        )}
        ${featureCard(
          "book",
          "Шпаргалка",
          "Все изученные команды с примерами и поиском. Открывается с любой страницы.",
        )}
        ${featureCard(
          "alert",
          "Дневник ошибок",
          "Сайт переводит SyntaxError и другие ошибки на простой русский и сохраняет историю.",
        )}
        ${featureCard(
          "target",
          "Мини-игры",
          "«Собери код», «Найди ошибку», «Угадай число» и список покупок — без лишних слов.",
        )}
        ${featureCard(
          "sun",
          "День и ночь",
          "Сад меняет свет: тёплый камень днём, влажный мох ночью. Без резкого неона.",
        )}
        ${featureCard(
          "bamboo",
          "Бамбук растёт",
          "Капли воды за задания превращаются в стебли. Прогресс хранится в вашем браузере.",
        )}
      </div>
    </section>

    <section class="container section">
      <div class="cta-panel reveal">
        <div>
          <span class="kicker">${allDone ? "Финал" : "Следующий шаг"}</span>
          <h2>${allDone ? "Соберите свою мини-игру" : "Начните с одной строки"}</h2>
          <p>${
            allDone
              ? "Критерии, подсказки и песочница уже ждут. Готового решения нет — и это отлично."
              : "print(\"Привет\") — уже программа. Не нужно ждать понедельника или особого настроения."
          }</p>
        </div>
        <div class="cta-panel__actions">
          <a class="btn btn--amber" href="${allDone ? "#/challenge" : ctaHref}">
            ${allDone ? icon("trophy") : icon("play")} ${allDone ? "К челленджу" : ctaLabel}
          </a>
          <a class="btn btn--ghost" href="#/map">${icon("map")} Карта</a>
        </div>
      </div>
    </section>
  `;

  async function mount(root) {
    setupReveal(root);

    // Hero is a pre-rendered Blender scene for now: fast, reliable, and theme-aware.
    const prefs = getState().settings || {};
    const calm = Boolean(prefs.lowPower || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    const hero = root.querySelector("#hero");
    if (calm) return () => {};
    const onScroll = () => {
      if (!hero) return;
      const offset = Math.min(window.scrollY, window.innerHeight);
      hero.style.setProperty("--hero-shift", `${offset * 0.16}px`);
    };
    const onPointer = (event) => {
      if (!hero || event.pointerType === "touch") return;
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      hero.style.setProperty("--hero-drift-x", `${x}px`);
      hero.style.setProperty("--hero-drift-y", `${y}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }

  return { html, mount };
}
