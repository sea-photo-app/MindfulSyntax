/**
 * Сад кода — точка входа.
 * Простой hash-роутер, состояние, тема и звук. Без сборщика.
 */

import {
  configureState,
  getState,
  subscribe,
  progressPercent,
  setTheme,
  setSound,
  lessonCount,
} from "./state.js";
import { modules, totals, getModule, getLesson } from "./data/modules.js";
import { initAchievements } from "./achievements.js";
import { setSoundEnabled, playTick } from "./audio.js";
import { icon, toast, setupReveal, openDrawer, closeDrawers, isDrawerOpen } from "./ui.js";
import { homeView } from "./views/home.js";
import { moduleView } from "./views/module.js?v=20261117c";
import { lessonView } from "./views/lesson.js";
import { mapView } from "./views/map.js";
import { playgroundView } from "./views/playground.js";
import { journalView } from "./views/journal.js";
import { challengeView } from "./views/challenge.js";
import { libraryView } from "./views/library.js";
import { practiceView } from "./views/practice.js";
import { initCheatsheet, renderCheatsheet } from "./views/cheatsheet.js";
import { settingsView, mountSettings } from "./views/settings.js";
import { privacyView } from "./views/privacy.js";
import { resetView } from "./views/reset.js";
import { accountView } from "./views/account.js";
import { initAccount, currentAccount, subscribeAccount, logoutAccount } from "./account.js";
import { loginView, registerView } from "./views/auth.js";

const main = document.getElementById("main");

configureState({ lessons: totals.lessons });
const SAFE_MODE = new URLSearchParams(window.location.search).get("safe") === "1";
if (SAFE_MODE) document.documentElement.dataset.safe = "1";

initAchievements();
initCheatsheet();
if (!SAFE_MODE) await initAccount();

let cleanup = null;
let currentRoute = "";

/* --- Тема --------------------------------------------------------------- */

const themeButton = document.querySelector('[data-action="toggle-theme"]');
const themeIcon = themeButton?.querySelector("[data-theme-icon] use");
const metaTheme = document.querySelector('meta[name="theme-color"]');

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

let themeTransitionTimer = 0;

function applyTheme(theme, { persist = false, animate = false } = {}) {
  const changed = document.documentElement.dataset.theme !== theme;
  const preference = getState().settings || {};
  if (animate && changed && !preference.lowPower && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("theme-changing");
    window.clearTimeout(themeTransitionTimer);
    themeTransitionTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-changing");
    }, 1000);
  }
  document.dispatchEvent(new CustomEvent("themechange", {
    detail: { from: document.documentElement.dataset.theme, to: theme }
  }));
  document.documentElement.dataset.theme = theme;
  if (metaTheme) metaTheme.setAttribute("content", theme === "night" ? "#0b0e0c" : "#efe6ef");
  if (themeIcon) themeIcon.setAttribute("href", theme === "night" ? "#i-sun" : "#i-moon");
  if (themeButton) {
    themeButton.setAttribute("aria-pressed", String(theme === "night"));
    themeButton.setAttribute("aria-label", theme === "night" ? "Включить светлый вечерний режим" : "Включить ночной режим");
  }
  if (persist) setTheme(theme);
}

function applyPreferences() {
  const settings = getState().settings || {};
  const reduced = Boolean(
    settings.lowPower ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  document.documentElement.dataset.motion = reduced ? "reduced" : "";
  document.documentElement.dataset.power = settings.lowPower ? "low" : "";
  document.documentElement.classList.toggle("hide-map-hints", Boolean(settings.hideMapHints || settings.lowPower));
}

const initialTheme = getState().theme || systemTheme();
applyTheme(initialTheme);
applyPreferences();

/* --- Звук --------------------------------------------------------------- */

const soundButton = document.querySelector('[data-action="toggle-sound"]');
const soundIcon = soundButton?.querySelector("[data-sound-icon] use");

function syncSoundUI() {
  const on = Boolean(getState().sound);
  if (soundIcon) soundIcon.setAttribute("href", on ? "#i-sound-on" : "#i-sound-off");
  if (soundButton) {
    soundButton.setAttribute("aria-pressed", String(on));
    soundButton.setAttribute("aria-label", on ? "Выключить звук сада" : "Включить звук сада");
  }
}

setSoundEnabled(Boolean(getState().sound));
syncSoundUI();

/* --- Прогресс в шапке --------------------------------------------------- */

function syncProgress() {
  const percent = progressPercent();
  document.querySelectorAll("[data-progress-label]").forEach((node) => {
    node.textContent = `${percent}%`;
  });
  document.querySelectorAll("[data-progress-fill]").forEach((node) => {
    node.style.width = `${percent}%`;
  });
  const pill = document.querySelector(".level-pill");
  if (pill) pill.setAttribute("aria-label", `Прогресс курса: ${percent}%. Пройдено ${lessonCount()} уроков.`);
}

syncProgress();

const accountLink = document.querySelector("[data-account-link]");
const accountMobile = document.querySelector("[data-account-mobile]");

function syncAccountUI() {
  const account = currentAccount();
  if (account) {
    if (accountLink) {
      accountLink.href = "#/account";
      accountLink.setAttribute("aria-label", `Аккаунт ${account.email}`);
      accountLink.title = account.email;
      accountLink.classList.add("is-auth");
    }
    if (accountMobile) {
      accountMobile.href = "#/account";
      accountMobile.lastChild.textContent = "Аккаунт";
    }
  } else {
    if (accountLink) {
      accountLink.href = "#/login";
      accountLink.setAttribute("aria-label", "Войти в аккаунт");
      accountLink.title = "Войти в аккаунт";
      accountLink.classList.remove("is-auth");
    }
    if (accountMobile) {
      accountMobile.href = "#/login";
      accountMobile.lastChild.textContent = "Войти";
    }
  }
}

syncAccountUI();
subscribeAccount(syncAccountUI);

subscribe(() => {
  syncProgress();
  syncSoundUI();
  applyPreferences();
  const state = getState();
  if (state.theme) applyTheme(state.theme);
});

/* --- Роутер ------------------------------------------------------------- */

const TITLES = {
  home: "MindfulSyntax — Python в тихом саду",
  map: "Карта сада — MindfulSyntax",
  playground: "Песочница Python — MindfulSyntax",
  journal: "Дневник ошибок — MindfulSyntax",
  challenge: "Финальный челлендж — MindfulSyntax",
  library: "Библиотека сада — MindfulSyntax",
  practice: "Тренажёр — MindfulSyntax",
  settings: "Настройки — MindfulSyntax",
  privacy: "Политика конфиденциальности — MindfulSyntax",
  login: "Вход — MindfulSyntax",
  register: "Регистрация — MindfulSyntax",
  reset: "Сброс пароля — MindfulSyntax",
  logout: "Выход — MindfulSyntax",
  account: "Аккаунт — MindfulSyntax",
};

function notFound() {
  return {
    html: `<header class="page-head"><div class="container page-head__inner">
      <span class="kicker">Тихая тропинка</span>
      <h1>Здесь нет такой страницы</h1>
      <p>Возможно, ссылка устарела. Вернитесь в сад — там всё на месте.</p>
      <div class="btn-row" style="margin-top:18px"><a class="btn btn--primary" href="#/">${icon("home")} В сад</a></div>
    </div></header>`,
    mount() {},
  };
}

function resolveRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean);

  if (!parts.length) return { view: homeView, key: "home", title: TITLES.home };
  if (parts[0] === "map") return { view: mapView, key: "map", title: TITLES.map };
  if (parts[0] === "playground") return { view: playgroundView, key: "playground", title: TITLES.playground };
  if (parts[0] === "journal") return { view: journalView, key: "journal", title: TITLES.journal };
  if (parts[0] === "library") return { view: libraryView, key: "library", title: TITLES.library };
  if (parts[0] === "practice") return { view: practiceView, key: "practice", title: TITLES.practice };
  if (parts[0] === "challenge") return { view: challengeView, key: "challenge", title: TITLES.challenge };
  if (parts[0] === "settings") return { view: settingsView, key: "settings", title: TITLES.settings, mount: mountSettings };
  if (parts[0] === "privacy") return { view: privacyView, key: "privacy", title: TITLES.privacy };
  if (parts[0] === "account") return { view: accountView, key: "account", title: TITLES.account };
  if (parts[0] === "login") return { view: loginView, key: "login", title: TITLES.login };
  if (parts[0] === "register") return { view: registerView, key: "register", title: TITLES.register };
  if (parts[0] === "reset") return { view: resetView, key: "reset", title: TITLES.reset };
  if (parts[0] === "logout") return {
    view: () => ({
      html: '<div class="container section"><div class="card"><h1>Выходим…</h1><p>Аккаунт отключён на этом устройстве.</p></div></div>',
      mount() { logoutAccount(); window.setTimeout(() => { window.location.hash = "#/login"; }, 80); },
    }),
    key: "logout",
    title: TITLES.logout,
  };

  if (parts[0] === "module" && parts[1]) {
    const module = getModule(parts[1]);
    if (module) {
      return {
        view: () => moduleView(module),
        key: "module",
        title: `${module.title} — MindfulSyntax`,
      };
    }
  }

  if (parts[0] === "lesson" && parts[1]) {
    const lesson = getLesson(parts[1]);
    if (lesson) {
      const module = getModule(lesson.moduleId);
      return {
        view: () => lessonView(lesson, module),
        key: "lesson",
        title: `${lesson.title} — MindfulSyntax`,
      };
    }
  }

  return { view: notFound, key: "404", title: "Страница не найдена — MindfulSyntax" };
}

function setActiveNav(key) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.dataset.nav === key || (key === "lesson" && link.dataset.nav === "home");
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function closeMobileNav() {
  const mobile = document.getElementById("mobile-nav");
  const toggle = document.querySelector('[data-action="toggle-nav"]');
  if (!mobile) return;
  mobile.hidden = true;
  mobile.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Открыть меню");
}

function renderRoute({ scroll = true } = {}) {
  const route = resolveRoute();
  if (!main) return;

  if ((route.key === "lesson" || route.key === "module") && !currentAccount()) {
    try { sessionStorage.setItem("mindfulsyntax:auth-next", window.location.hash || "#/map"); } catch { /* noop */ }
    if (window.location.hash !== "#/login") {
      window.location.hash = "#/login";
      return;
    }
  }

  if (typeof cleanup === "function") {
    try {
      cleanup();
    } catch (error) {
      console.warn("Не удалось освободить прошлую сцену", error);
    }
  }
  cleanup = null;

  closeDrawers();
  closeMobileNav();

  const { html, mount } = route.view();
  main.innerHTML = html;
  document.title = route.title;
  setActiveNav(route.key);
  currentRoute = route.key;
  document.documentElement.dataset.route = route.key;

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  try {
    const maybeCleanup = mount?.(main);
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
  } catch (error) {
    console.error("Ошибка монтирования страницы", error);
    main.innerHTML = `<div class="container section"><div class="card"><h1>Страница споткнулась</h1><p>Попробуйте обновить её. Если ошибка повторяется, откройте другую страницу — состояние курса сохранено.</p><a class="btn btn--primary" href="#/">В сад</a></div></div>`;
  }

  syncHeaderSurface();
  setupReveal(main);
  main.focus({ preventScroll: true });
}

window.addEventListener("hashchange", () => renderRoute());
window.addEventListener("beforeunload", () => {
  if (typeof cleanup === "function") cleanup();
});

if (!window.location.hash) {
  history.replaceState(null, "", "#/");
}
renderRoute({ scroll: false });
window.__mindfulSettled = true;

/* --- Шапка: мобильное меню и прокрутка ---------------------------------- */

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === "toggle-theme") {
      const next = document.documentElement.dataset.theme === "night" ? "day" : "night";
      applyTheme(next, { persist: true, animate: true });
      if (getState().sound) playTick();
      // Если 3D-герой на экране, пересоберём сцену под новый свет.
      if (currentRoute === "home" && document.getElementById("garden-canvas") && window.innerWidth > 720) {
        const scrollY = window.scrollY;
        renderRoute({ scroll: false });
window.__mindfulSettled = true;
        window.scrollTo({ top: scrollY, behavior: "auto" });
      }
    } else if (action === "toggle-sound") {
      const next = !getState().sound;
      setSound(next);
      setSoundEnabled(next);
      if (next) playTick();
      toast({
        title: next ? "Звук включён" : "Звук выключен",
        text: next ? "Тихие капли и деревянный ток." : "Теперь сад беззвучный.",
        iconName: next ? "sound-on" : "sound-off",
      });
    } else if (action === "toggle-nav") {
      const mobile = document.getElementById("mobile-nav");
      if (!mobile) return;
      const isOpen = !mobile.hidden;
      mobile.hidden = isOpen;
      mobile.classList.toggle("is-open", !isOpen);
      actionButton.setAttribute("aria-expanded", String(!isOpen));
      actionButton.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
    } else if (action === "open-cheatsheet") {
      closeMobileNav();
      openDrawer("cheatsheet-drawer");
      const search = document.getElementById("cheatsheet-search");
      if (search) {
        search.value = "";
        renderCheatsheet("");
      }
    } else if (action === "close-drawers") {
      closeDrawers();
    }
    return;
  }

  // Закрыть мобильное меню по клику на ссылку
  if (event.target.closest("#mobile-nav a")) {
    closeMobileNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isDrawerOpen()) closeDrawers();
    closeMobileNav();
    return;
  }

  if (event.key === "Tab" && isDrawerOpen()) {
    const drawer = document.querySelector(".drawer.is-open");
    const focusable = drawer?.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function syncHeaderSurface() {
  const headerEl = document.getElementById("site-header");
  headerEl?.classList.toggle("is-scrolled", window.scrollY > 12);
  const surface = currentRoute === "map" ? document.querySelector(".map-hero") : document.getElementById("hero");
  const overHero = (currentRoute === "home" || currentRoute === "map") && surface && surface.getBoundingClientRect().bottom > 88;
  headerEl?.classList.toggle("is-over-hero", Boolean(overHero));
}
const onScroll = () => syncHeaderSurface();
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* --- Мелкие улучшения --------------------------------------------------- */

// После перехода по внутренней ссылке убираем фокус с меню.
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#/"]');
  if (!link) return;
  const mobile = document.getElementById("mobile-nav");
  if (mobile && !mobile.hidden) closeMobileNav();
});

// Первое посещение: мягкая подсказка, без модальных окон.
try {
  const seen = localStorage.getItem("garden-of-code:seen-intro");
  if (!seen && !window.location.hash.includes("lesson")) {
    localStorage.setItem("garden-of-code:seen-intro", "1");
  }
} catch {
  /* noop */
}

// Экспортируем для отладки в консоли (не влияет на интерфейс).
window.__garden = { modules, totals, currentRoute: () => currentRoute };
