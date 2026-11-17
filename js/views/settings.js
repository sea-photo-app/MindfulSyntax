/**
 * Настройки, локальный аккаунт и юридические ссылки.
 */
import { getState, setSetting, resetProgress, snapshotState } from "../state.js";
import {
  currentAccount,
  logoutAccount,
  deleteAccount,
  subscribeAccount,
  serverEnabled,
  POLICY_VERSION,
} from "../account.js";
import { icon, escapeHtml, toast } from "../ui.js";

function formatDate(timestamp) {
  try {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(timestamp);
  } catch {
    return "";
  }
}

function accountHTML(account) {
  if (account) {
    return `
      <div class="settings-account__head">
        <span class="settings-avatar" aria-hidden="true">${icon("leaf")}</span>
        <div>
          <span class="kicker">${serverEnabled ? "Аккаунт MindfulSyntax" : "Локальный аккаунт"}</span>
          <h2>${escapeHtml(account.email)}</h2>
          <p class="small muted">С ${formatDate(account.createdAt)} · ${serverEnabled ? "прогресс синхронизируется" : "прогресс хранится на этом устройстве"}</p>
        </div>
      </div>
      <p class="settings-note">Вы вошли. Все изменения прогресса автоматически сохраняются в этот аккаунт.</p>
      <div class="btn-row">
        <button class="btn btn--ghost btn--small" type="button" data-logout>Выйти из аккаунта</button>
        <button class="btn btn--danger btn--small" type="button" data-delete-account>Удалить аккаунт</button>
      </div>`;
  }
  return `
    <div class="settings-account__head">
      <span class="settings-avatar" aria-hidden="true">${icon("leaf")}</span>
      <div>
        <span class="kicker">Аккаунт</span>
        <h2>Войдите в сад</h2>
        <p class="small muted">${serverEnabled ? "Уроки и модули открываются после входа. Прогресс сохранится в аккаунте." : "Уроки и модули открываются после входа. Прогресс сохранится в локальном аккаунте."}</p>
      </div>
    </div>
    <div class="btn-row">
      <a class="btn btn--primary btn--small" href="#/login">Войти</a>
      <a class="btn btn--ghost btn--small" href="#/register">Зарегистрироваться</a>
    </div>
    <p class="settings-fineprint">${serverEnabled ? "Данные аккаунта хранятся в облачной базе Supabase. Для публикации в РФ потребуется перенос базы." : "Это локальный аккаунт: данные и хеш пароля остаются в браузере. Для входа с другого устройства нужен сервер и синхронизация."}</p>`;
}

function toggleHTML(key, title, text) {
  const checked = Boolean(getState().settings?.[key]);
  return `
    <label class="settings-toggle">
      <span class="settings-toggle__copy"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(text)}</small></span>
      <input type="checkbox" data-setting="${key}" ${checked ? "checked" : ""} role="switch">
    </label>`;
}

export function settingsView() {
  const account = currentAccount();
  const html = `
    <header class="page-head"><div class="container page-head__inner">
      <span class="kicker">Тихий уголок</span>
      <h1>Настройки</h1>
      <p>Аккаунт, движение, данные и приватность — всё в одном месте.</p>
    </div></header>
    <div class="container section settings-page">
      <div class="settings-grid">
        <section class="card settings-card settings-card--account">
          <div data-account-card>${accountHTML(account)}</div>
        </section>

        <section class="card settings-card">
          <div class="settings-card__head">
            <span class="kicker">Спокойствие</span>
            <h2>Движение и эффекты</h2>
          </div>
          <div class="settings-toggles">
            ${toggleHTML("intro", "Вступительная анимация", "Показывать разворачивание свитка при входе на карту.")}
            ${toggleHTML("lowPower", "Режим слабых устройств", "Без частиц и параллакса; стекло и оформление остаются. Вступительная анимация выключается автоматически.")}
            ${toggleHTML("hideMapHints", "Скрыть подсказки на карте", "Не показывать всплывающие карточки и частицы.")}
          </div>
          <p class="settings-note">Режим слабых устройств также отключает вступительную анимацию.</p>
        </section>

        <section class="card settings-card">
          <div class="settings-card__head">
            <span class="kicker">Ваши данные</span>
            <h2>Прогресс</h2>
          </div>
          <p class="small muted">Экспорт — это JSON-файл с вашим прогрессом. Его можно сохранить как резервную копию.</p>
          <div class="btn-row">
            <button class="btn btn--ghost btn--small" type="button" data-export-progress>${icon("copy")} Экспорт прогресса</button>
            <button class="btn btn--danger btn--small" type="button" data-reset-progress>${icon("reset")} Сбросить прогресс</button>
          </div>
          <p class="settings-fineprint">Сброс затронет уроки, достижения, дневник и настройки. Аккаунт останется.</p>
        </section>

        <section class="card settings-card">
          <div class="settings-card__head">
            <span class="kicker">Документы</span>
            <h2>Приватность</h2>
          </div>
          <p class="small muted">Политика конфиденциальности и согласие на обработку данных по 152-ФЗ.</p>
          <a class="btn btn--ghost btn--small" href="#/privacy">${icon("lock")} Политика конфиденциальности</a>
          <p class="settings-fineprint">Версия политики: ${escapeHtml(POLICY_VERSION)}</p>
        </section>
      </div>
    </div>`;
  return { html, mount: mountSettings };
}

export function mountSettings(root) {
  const accountCard = root.querySelector("[data-account-card]");
  let unsubscribe = () => {};

  const bindAccount = () => {
    const card = root.querySelector("[data-account-card]");
    if (!card) return;
    card.querySelector("[data-logout]")?.addEventListener("click", () => {
      logoutAccount();
      toast({ title: "Вы вышли из аккаунта", text: "Уроки снова откроются после входа.", iconName: "leaf" });
    });
    const deleteButton = card.querySelector("[data-delete-account]");
    deleteButton?.addEventListener("click", async () => {
      if (deleteButton.dataset.armed !== "1") {
        deleteButton.dataset.armed = "1";
        deleteButton.textContent = "Нажмите ещё раз";
        window.setTimeout(() => {
          if (!deleteButton.isConnected) return;
          deleteButton.dataset.armed = "";
          deleteButton.textContent = "Удалить аккаунт";
        }, 5000);
        return;
      }
      deleteButton.disabled = true;
      const result = await deleteAccount();
      deleteButton.disabled = false;
      if (!result.ok) {
        toast({ title: "Не удалось удалить аккаунт", text: result.error, iconName: "alert" });
        deleteButton.dataset.armed = "";
        deleteButton.textContent = "Удалить аккаунт";
        return;
      }
      toast({ title: "Аккаунт и данные удалены", text: "Сессия завершена.", iconName: "reset" });
    });
  };

  const syncSettingsInputs = () => {
    root.querySelectorAll("[data-setting]").forEach((input) => {
      input.checked = Boolean(getState().settings?.[input.dataset.setting]);
    });
  };

  const refreshAccount = () => {
    if (!accountCard) return;
    accountCard.innerHTML = accountHTML(currentAccount());
    bindAccount();
    syncSettingsInputs();
  };

  refreshAccount();
  unsubscribe = subscribeAccount(() => refreshAccount());

  root.querySelectorAll("[data-setting]").forEach((input) => {
    input.addEventListener("change", () => {
      setSetting(input.dataset.setting, input.checked);
      if (input.dataset.setting === "lowPower" && input.checked) {
        setSetting("intro", false);
        const introInput = root.querySelector('[data-setting="intro"]');
        if (introInput) introInput.checked = false;
      }
    });
  });

  root.querySelector("[data-export-progress]")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(snapshotState(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mindfulsyntax-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Прогресс сохранён", text: "JSON-файл скачан.", iconName: "check" });
  });

  const resetButton = root.querySelector("[data-reset-progress]");
  resetButton?.addEventListener("click", () => {
    if (resetButton.dataset.armed !== "1") {
      resetButton.dataset.armed = "1";
      resetButton.innerHTML = `${icon("alert")} Нажмите ещё раз`;
      window.setTimeout(() => {
        if (!resetButton.isConnected) return;
        resetButton.dataset.armed = "";
        resetButton.innerHTML = `${icon("reset")} Сбросить прогресс`;
      }, 5000);
      return;
    }
    resetProgress();
    toast({ title: "Прогресс сброшен", text: "Сад начинается заново.", iconName: "reset" });
    resetButton.dataset.armed = "";
    resetButton.innerHTML = `${icon("reset")} Сбросить прогресс`;
    root.querySelectorAll("[data-setting]").forEach((input) => {
      input.checked = Boolean(getState().settings?.[input.dataset.setting]);
    });
    refreshAccount();
  });

  return () => unsubscribe();
}
