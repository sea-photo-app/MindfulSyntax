/**
 * Мелкие UI-помощники: иконки, тосты, шторка шпаргалки, анимация появления.
 */

export function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

/** Склонение по числу: plural(12, ["модуль", "модуля", "модулей"]) -> "модулей". */
export function plural(n, forms) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

const NUMBER_WORDS = ["ноль", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать", "двадцать"];

/** Число словом (для небольших чисел), с заглавной буквы при upper = true. */
export function numberWord(n, upper = false) {
  const word = NUMBER_WORDS[n] ?? String(n);
  return upper ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

const toastTimers = new WeakMap();

function dismissToast(node) {
  if (!node || node.classList.contains("is-leaving")) return;
  const timer = toastTimers.get(node);
  if (timer) window.clearTimeout(timer);
  toastTimers.delete(node);
  node.classList.add("is-leaving");
  window.setTimeout(() => node.remove(), 320);
}

export function toast({ title, text = "", iconName = "spark" }) {
  const region = document.getElementById("toast-region");
  if (!region) return;

  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `
    <span class="toast__icon">${icon(iconName)}</span>
    <div class="toast__body">
      <strong>${escapeHtml(title)}</strong>
      ${text ? `<p>${escapeHtml(text)}</p>` : ""}
    </div>
    <button class="toast__close" type="button" aria-label="Закрыть уведомление">×</button>
  `;
  region.appendChild(node);
  node.querySelector(".toast__close")?.addEventListener("click", () => dismissToast(node));
  toastTimers.set(node, window.setTimeout(() => dismissToast(node), 4600));

  // Не даём тостам разрастаться, если пользователь быстро проходит уроки.
  while (region.children.length > 3) {
    const oldest = region.firstElementChild;
    if (!oldest) break;
    dismissToast(oldest);
    if (oldest.classList.contains("is-leaving")) oldest.remove();
  }
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

let lastFocused = null;

export function openDrawer(id = "cheatsheet-drawer") {
  const drawer = document.getElementById(id);
  const backdrop = document.querySelector(".drawer-backdrop");
  if (!drawer) return;
  lastFocused = document.activeElement;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.classList.add("is-locked");
  const focusTarget = drawer.querySelector("input, button, a");
  window.setTimeout(() => focusTarget?.focus(), 60);
}

export function closeDrawers() {
  const drawers = document.querySelectorAll(".drawer.is-open");
  if (!drawers.length) return;
  drawers.forEach((drawer) => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  });
  const backdrop = document.querySelector(".drawer-backdrop");
  if (backdrop) backdrop.hidden = true;
  document.body.classList.remove("is-locked");
  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

export function isDrawerOpen() {
  return Boolean(document.querySelector(".drawer.is-open"));
}

export async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    if (button) {
      const original = button.innerHTML;
      button.innerHTML = icon("check");
      window.setTimeout(() => {
        button.innerHTML = original;
      }, 1400);
    }
  } catch {
    // Буфер обмена может быть закрыт политикой браузера — показываем мягкий тост.
    toast({ title: "Не получилось скопировать", text: "Выделите код и скопируйте вручную.", iconName: "alert" });
  }
}

let observer = null;

export function setupReveal(root = document) {
  if (!("IntersectionObserver" in window)) {
    root.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
    return;
  }
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
  }
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => observer.observe(node));
}

/** Мягкая прокрутка к элементу с учётом высоты шапки. */
export function scrollToId(id) {
  const node = document.getElementById(id);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function unique(array) {
  return [...new Set(array)];
}
