/**
 * Отдельные страницы входа и регистрации.
 */
import { currentAccount, loginAccount, registerAccount, oauthUrl, serverEnabled } from "../account.js";
import { toast, icon } from "../ui.js";

const NEXT_KEY = "mindfulsyntax:auth-next";

export function authNext() {
  try {
    return sessionStorage.getItem(NEXT_KEY) || "#/account";
  } catch {
    return "#/account";
  }
}

function goAfterAuth() {
  const next = authNext();
  try { sessionStorage.removeItem(NEXT_KEY); } catch { /* noop */ }
  window.location.hash = next && next.startsWith("#/") ? next : "#/account";
}

function authShell({ title, kicker, text, form, switchText, switchLabel, switchHref }) {
  return `
    <div class="auth-page">
      <div class="auth-page__art" aria-hidden="true">
        <div class="auth-page__layer auth-page__layer--sunset"></div>
        <div class="auth-page__layer auth-page__layer--night"></div>
      </div>
      <div class="auth-page__veil" aria-hidden="true"></div>
      <div class="card auth-card">
        <span class="kicker">${kicker}</span>
        <h1>${title}</h1>
        <p class="auth-lead">${text}</p>
        ${form}
        ${oauthUrl("discord") ? `<div class="auth-oauth"><span>или</span><button class="btn btn--ghost auth-oauth__btn" type="button" data-oauth-discord>Войти через Discord</button></div>` : ""}
        <p class="auth-switch">${switchText} <a href="${switchHref}">${switchLabel}</a></p>
      </div>
    </div>`;
}

function bindOAuth(root) {
  root.querySelector("[data-oauth-discord]")?.addEventListener("click", () => {
    window.location.href = oauthUrl("discord");
  });
}

export function loginView() {
  const wantsLesson = /^#\/(lesson|module)\//.test(authNext());
  const html = authShell({
    kicker: "Тихий вход",
    title: "Войти в сад",
    text: wantsLesson
      ? "Чтобы открыть урок или модуль, войдите в аккаунт или зарегистрируйтесь."
      : serverEnabled ? "Войдите, чтобы открыть уроки и синхронизировать прогресс." : "Войдите, чтобы открыть уроки и сохранить прогресс.",
    form: `
      <form class="settings-form auth-form" data-auth-login novalidate>
        <label>Email<input type="email" name="email" autocomplete="email" placeholder="you@example.ru" required></label>
        <label>Пароль<input type="password" name="password" autocomplete="current-password" placeholder="Пароль" required></label>
        <p class="settings-error" data-auth-error role="alert"></p>
        <button class="btn btn--primary" type="submit">Войти</button>
      </form>`,
    switchText: "Нет аккаунта?",
    switchLabel: "Зарегистрироваться",
    switchHref: "#/register",
  });
  return {
    html,
    mount(root) {
      if (currentAccount()) {
        goAfterAuth();
        return;
      }
      bindOAuth(root);
      const form = root.querySelector("[data-auth-login]");
      const error = root.querySelector("[data-auth-error]");
      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (error) error.textContent = "";
        const data = new FormData(form);
        const result = await loginAccount({ email: data.get("email"), password: data.get("password") });
        if (!result.ok) {
          if (error) error.textContent = result.error;
          return;
        }
        toast({ title: "С возвращением", text: "Открываем урок.", iconName: "leaf" });
        goAfterAuth();
      });
    },
  };
}

export function registerView() {
  const wantsLesson = /^#\/(lesson|module)\//.test(authNext());
  const html = authShell({
    kicker: "Новый садовник",
    title: "Регистрация",
    text: wantsLesson
      ? "Создайте аккаунт, чтобы открыть урок и сохранить прогресс."
      : serverEnabled ? "Аккаунт MindfulSyntax сохранит прогресс в базе и откроет уроки." : "Аккаунт хранится локально на этом устройстве. Прогресс сохранится в нём.",
    form: `
      <form class="settings-form auth-form" data-auth-register novalidate>
        <label>Email<input type="email" name="email" autocomplete="email" placeholder="you@example.ru" required></label>
        <label>Пароль<input type="password" name="password" autocomplete="new-password" placeholder="Не короче 8 символов" minlength="8" required></label>
        <label class="settings-consent">
          <input type="checkbox" name="consent" required>
          <span>Я принимаю <a href="#/privacy">Политику конфиденциальности</a> и даю согласие на обработку персональных данных.</span>
        </label>
        <p class="settings-error" data-auth-error role="alert"></p>
        <button class="btn btn--primary" type="submit">Создать аккаунт</button>
      </form>`,
    switchText: "Уже есть аккаунт?",
    switchLabel: "Войти",
    switchHref: "#/login",
  });
  return {
    html,
    mount(root) {
      if (currentAccount()) {
        goAfterAuth();
        return;
      }
      bindOAuth(root);
      const form = root.querySelector("[data-auth-register]");
      const error = root.querySelector("[data-auth-error]");
      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (error) error.textContent = "";
        const data = new FormData(form);
        const result = await registerAccount({
          email: data.get("email"),
          password: data.get("password"),
          consent: data.get("consent") === "on",
        });
        if (!result.ok) {
          if (error) error.textContent = result.error;
          return;
        }
        if (result.pending) {
          if (error) {
            error.className = "settings-note";
            error.textContent = result.message || "Проверьте почту и подтвердите email.";
          }
          return;
        }
        toast({ title: "Аккаунт создан", text: "Открываем урок.", iconName: "leaf" });
        goAfterAuth();
      });
    },
  };
}
