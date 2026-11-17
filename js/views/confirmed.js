import { currentAccount } from "../account.js";
import { icon } from "../ui.js";

export function confirmedView() {
  const account = currentAccount();
  return {
    html: `
      <div class="auth-page">
        <div class="card auth-card confirmed-card">
          <span class="confirmed-card__mark">${icon("check")}</span>
          <span class="kicker">Почта подтверждена</span>
          <h1>Вы успешно зарегистрировались</h1>
          <p class="auth-lead">${account
            ? "Аккаунт подтверждён. Можно перейти в личный кабинет и продолжить курс."
            : "Аккаунт подтверждён. Войдите, чтобы сохранить прогресс и открыть уроки."}</p>
          <div class="btn-row confirmed-card__actions">
            <a class="btn btn--primary" href="${account ? "#/account" : "#/login"}">${account ? "Перейти в аккаунт" : "Войти в аккаунт"}</a>
            <a class="btn btn--ghost" href="#/">На главную</a>
          </div>
        </div>
      </div>`,
    mount() {},
  };
}
