import { currentAccount, requestPasswordReset, changePassword, serverEnabled } from "../account.js";
import { toast, icon } from "../ui.js";

export function resetView() {
  const account = currentAccount();
  if (!serverEnabled) {
    return {
      html: `
        <div class="auth-page"><div class="card auth-card">
          <span class="kicker">Восстановление</span>
          <h1>Сброс пароля</h1>
          <p class="auth-lead">Сброс пароля появится после подключения Supabase. Сейчас аккаунт локальный.</p>
          <p class="auth-switch"><a href="#/login">Вернуться ко входу</a></p>
        </div></div>`,
      mount() {},
    };
  }
  const html = `
    <div class="auth-page">
      <div class="card auth-card">
        <span class="kicker">Восстановление</span>
        <h1>${account ? "Новый пароль" : "Сброс пароля"}</h1>
        <p class="auth-lead">${account
          ? "Введите новый пароль для аккаунта."
          : "Укажите email — мы отправим ссылку для восстановления."}</p>
        ${account ? `
          <form class="settings-form auth-form" data-reset-password>
            <label>Новый пароль<input type="password" name="password" autocomplete="new-password" placeholder="Не короче 8 символов" minlength="8" required></label>
            <p class="settings-error" data-reset-error role="alert"></p>
            <button class="btn btn--primary" type="submit">Сменить пароль</button>
          </form>` : `
          <form class="settings-form auth-form" data-reset-email>
            <label>Email<input type="email" name="email" autocomplete="email" placeholder="you@example.ru" required></label>
            <p class="settings-error" data-reset-error role="alert"></p>
            <button class="btn btn--primary" type="submit">Отправить ссылку</button>
          </form>`}
        <p class="auth-switch"><a href="#/login">Вернуться ко входу</a></p>
      </div>
    </div>`;
  return {
    html,
    mount(root) {
      const error = root.querySelector("[data-reset-error]");
      root.querySelector("[data-reset-email]")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = new FormData(event.currentTarget).get("email");
        const result = await requestPasswordReset(email);
        if (!result.ok) {
          if (error) error.textContent = result.error;
          return;
        }
        toast({ title: "Письмо отправлено", text: "Проверьте почту и перейдите по ссылке.", iconName: "check" });
      });
      root.querySelector("[data-reset-password]")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = new FormData(event.currentTarget).get("password");
        const result = await changePassword(password);
        if (!result.ok) {
          if (error) error.textContent = result.error;
          return;
        }
        toast({ title: "Пароль обновлён", text: "Теперь можно войти.", iconName: "check" });
        window.location.hash = "#/login";
      });
      if (!serverEnabled) {
        if (error) error.textContent = "Сервер ещё не настроен. Сброс пароля появится после подключения Supabase.";
      }
    },
  };
}
