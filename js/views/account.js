/**
 * Страница аккаунта: прогресс, достижения и данные профиля.
 */
import { getState, lessonCount, totalLessonCount, progressPercent } from "../state.js";
import { currentAccount, logoutAccount, serverEnabled } from "../account.js";
import { achievementDefs, earnedCount } from "../achievements.js";
import { getLesson } from "../data/modules.js";
import { icon, escapeHtml, toast } from "../ui.js";

function fmtDate(timestamp) {
  try {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(timestamp);
  } catch {
    return "—";
  }
}

function guestHTML() {
  return `
    <div class="container section account-page">
      <div class="card account-guest">
        <span class="kicker">Личный сад</span>
        <h2>Войдите в личный сад</h2>
        <p>Войдите, чтобы видеть прогресс, достижения и продолжить с последнего урока.</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="#/login">Войти</a>
          <a class="btn btn--ghost" href="#/register">Зарегистрироваться</a>
        </div>
      </div>
    </div>`;
}

export function accountView() {
  const account = currentAccount();
  if (!account) {
    return {
      html: `
        <header class="page-head"><div class="container page-head__inner">
          <span class="kicker">Личный сад</span>
          <h1>Аккаунт</h1>
          <p>Прогресс, достижения и продолжение пути.</p>
        </div></header>
        ${guestHTML()}`,
      mount() {},
    };
  }

  const state = getState();
  const done = lessonCount();
  const total = totalLessonCount();
  const percent = progressPercent();
  const earned = earnedCount();
  const last = state.lastLesson ? getLesson(state.lastLesson) : null;
  const achievements = achievementDefs
    .map((def) => {
      const isEarned = Boolean(state.achievements[def.id]);
      return `
        <div class="achievement ${isEarned ? "is-earned" : "is-locked"}">
          <span class="achievement__icon">${icon(def.icon)}</span>
          <div><strong>${escapeHtml(def.title)}</strong><p>${escapeHtml(def.desc)}</p></div>
        </div>`;
    })
    .join("");

  const html = `
    <header class="page-head account-head"><div class="container page-head__inner">
      <span class="kicker">Личный сад</span>
      <h1>Аккаунт</h1>
      <p>${escapeHtml(account.email)} · с ${escapeHtml(fmtDate(account.createdAt))}</p>
    </div></header>
    <div class="container section account-page">
      <section class="account-overview">
        <div class="card account-progress">
          <span class="kicker">Прогресс</span>
          <div class="account-progress__value">${done}<span> / ${total}</span></div>
          <p>уроков пройдено</p>
          <div class="account-progress__bar"><i style="width:${percent}%"></i></div>
          <div class="account-progress__meta"><span>${percent}% курса</span><span>${state.drops} капель активности</span></div>
        </div>
        <div class="card account-stat">
          <span class="kicker">Достижения</span>
          <strong>${earned}<span> / ${achievementDefs.length}</span></strong>
          <p>получено</p>
        </div>
        <div class="card account-stat">
          <span class="kicker">Продолжить</span>
          ${
            last
              ? `<a class="account-last" href="#/lesson/${last.id}">${escapeHtml(last.title)} ${icon("arrow")}</a>`
              : `<p class="account-empty">Ещё нет пройденных уроков.</p>`
          }
        </div>
      </section>
      <section class="card account-actions">
        <div>
          <span class="kicker">Управление</span>
          <h2>Профиль</h2>
          <p class="small muted">${serverEnabled ? "Аккаунт MindfulSyntax. Прогресс синхронизируется автоматически." : "Локальный аккаунт на этом устройстве. Прогресс сохраняется автоматически."}</p>
        </div>
        <div class="btn-row">
          <a class="btn btn--ghost btn--small" href="#/settings">${icon("gear")} Настройки</a>
          <button class="btn btn--ghost btn--small" type="button" data-account-logout>Выйти</button>
        </div>
      </section>

      <section class="account-achievements">
        <div class="section-heading__row">
          <div><span class="kicker">Отметки пути</span><h2>Достижения</h2></div>
          <span class="badge badge--amber">${earned} из ${achievementDefs.length}</span>
        </div>
        <div class="achievements-grid">${achievements}</div>
      </section>
    </div>`;
  return {
    html,
    mount(root) {
      root.querySelector("[data-account-logout]")?.addEventListener("click", () => {
        logoutAccount();
        toast({ title: "Вы вышли из аккаунта", text: "Уроки снова откроются после входа.", iconName: "leaf" });
        window.location.hash = "#/login";
      });
    },
  };
}
