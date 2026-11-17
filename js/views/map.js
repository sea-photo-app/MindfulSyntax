/**
 * Карта сада: визуальный прогресс и вход в модули.
 */

import { getState, lessonCount, totalLessonCount, progressPercent } from "../state.js";
import { modules, moduleProgress, firstUnfinishedLesson } from "../data/modules.js";
import { icon, escapeHtml, plural, numberWord } from "../ui.js";
import { gardenMapHTML, ZONE_SHORT_NAMES } from "../map.js";

export function mapView() {
  const state = getState();
  const percent = progressPercent();
  const next = firstUnfinishedLesson(state.doneLessons);

  const legend = modules
    .map((module) => {
      const progress = moduleProgress(module.id, state.doneLessons);
      const isDone = progress.done === progress.total;
      return `
        <a class="map-legend__item${isDone ? " is-done" : ""}" href="#/module/${module.id}">
          <span class="map-legend__swatch" aria-hidden="true"></span>
          <span><strong>${escapeHtml(module.title)}</strong><br><span class="small muted">${escapeHtml(
            module.zone,
          )}</span></span>
          <span class="map-legend__meta">${progress.done}/${progress.total}</span>
        </a>`;
    })
    .join("");

  const html = `
    <div class="map-intro" data-map-intro aria-hidden="true">
      <canvas class="map-intro__canvas" width="1280" height="720"></canvas>
      <img class="map-intro__match" alt="" aria-hidden="true">
    </div>
    <section class="map-hero">
      <div class="map-hero__art" aria-hidden="true"></div>
      <div class="map-hero__veil" aria-hidden="true"></div>
      <div class="container map-hero__inner">
        <nav class="breadcrumb map-hero__crumb" aria-label="Хлебные крошки">
          <a href="#/">Сад</a><span class="breadcrumb__sep">/</span><span>Карта</span>
        </nav>
        <span class="kicker map-hero__kicker">${numberWord(modules.length, true)} ${plural(modules.length, ["зона", "зоны", "зон"])} · путь сада</span>
        <h1>Карта сада</h1>
        <p>Каждый модуль — зона. Пройденные зоны расцветают. Нажмите на любую, чтобы вернуться к урокам.</p>
        <div class="map-hero__stats">
          <div><strong>${percent}%</strong><span>сад полит</span></div>
          <div><strong>${lessonCount()} / ${totalLessonCount()}</strong><span>уроков</span></div>
          <div><strong>${state.drops}</strong><span>капель</span></div>
        </div>
      </div>
    </section>

    <div class="container section section--tight">
      <div class="map-shell">
        <div class="map-main">
          <div class="map-canvas">
            <span class="map-rod map-rod--left" aria-hidden="true"></span>
            <span class="map-rod map-rod--right" aria-hidden="true"></span>
            <span class="map-stain map-stain--one" aria-hidden="true"></span>
            <span class="map-stain map-stain--two" aria-hidden="true"></span>
            <span class="map-stain map-stain--three" aria-hidden="true"></span>
            <span class="map-crease map-crease--one" aria-hidden="true"></span>
            <span class="map-crease map-crease--two" aria-hidden="true"></span>
            <div class="map-cartouche" aria-hidden="true"><span>道</span><strong>карта сада</strong><em>свиток пути · 12 зон</em></div>
            ${gardenMapHTML(state.doneLessons)}
            <div class="map-tip" data-map-tip aria-hidden="true"></div>
            <div class="map-stamp" aria-hidden="true">道</div>
            <div class="map-compass" aria-hidden="true">
              <svg viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" stroke-opacity=".45"/>
                <path d="M9 22h26M22 9v2M22 33v2" fill="none" stroke="currentColor" stroke-opacity=".35"/>
                <path d="M22 32V15M22 15l-3.5 4.5M22 15l3.5 4.5" fill="none" stroke="var(--map-vermilion)" stroke-width="1.5" stroke-linecap="round"/>
                <text x="22" y="8.5" text-anchor="middle" font-size="8" font-family="Georgia, serif" fill="var(--map-vermilion)">N</text>
              </svg>
            </div>
            <div class="map-scale" aria-hidden="true"><span></span><em>10 минут пути</em></div>
          </div>
          <div class="map-edge" aria-hidden="true"></div>
          <div class="map-table-objects" aria-hidden="true">
            <span class="table-stone"><img src="./assets/table-props/stone.png" alt=""></span>
            <span class="table-cup"><img src="./assets/table-props/cup.png" alt=""></span>
          </div>
          <p class="small muted map-hint">На телефоне карта идёт снизу вверх — просто листайте страницу.</p>
        </div>
        <aside class="map-legend" aria-label="Зоны сада">
          <div class="map-legend__head">
            <span class="kicker">Маршрут</span>
            <h3>Зоны и модули</h3>
          </div>
          ${legend}
          <div class="progress" style="margin-top:8px">
            <div class="progress__row"><span>Весь сад</span><strong>${percent}%</strong></div>
            <div class="progress__track"><span class="progress__fill" style="width:${percent}%"></span></div>
          </div>
          ${
            next
              ? `<a class="btn btn--primary btn--small" href="#/lesson/${next.id}" style="width:100%;margin-top:8px">Продолжить: ${escapeHtml(
                  next.title,
                )}</a>`
              : `<a class="btn btn--amber btn--small" href="#/challenge" style="width:100%;margin-top:8px">${icon(
                  "trophy",
                )} Финальный челлендж</a>`
          }
        </aside>
      </div>

      <div class="info-strip" style="margin-top:20px">
        ${icon("leaf")}
        <span>Сад растёт от ваших действий: уроки добавляют воду, задания — капли, а пройденные зоны меняют цвет. Сбросить прогресс можно только вручную в настройках браузера, очистив данные сайта.</span>
      </div>
    </div>`;

  const PARTICLE_STYLES = {
    gate: { kind: "petal", colors: ["#d8a66a", "#f1d6b0", "#b95e3d"] },
    stones: { kind: "dust", colors: ["#b4a58b", "#d8c7aa", "#7f7461"] },
    fork: { kind: "leaf", colors: ["#8ba66f", "#c2a15d", "#e0c99a"] },
    bamboo: { kind: "leaf", colors: ["#7ca06b", "#a9c18b", "#d8e1b8"] },
    pond: { kind: "water", colors: ["#7fb8b0", "#b6d8d1", "#d8ece6"] },
    tea: { kind: "steam", colors: ["#f4e6cf", "#e8d4b8", "#fff5e5"] },
    store: { kind: "dust", colors: ["#d8ad67", "#f2dfb4", "#b78643"] },
    bridge: { kind: "water", colors: ["#9ac4c0", "#d6e6df", "#75a8a5"] },
    scroll: { kind: "ink", colors: ["#4a2c1b", "#2b1a10", "#9b5a38"] },
    workshop: { kind: "spark", colors: ["#f0a34f", "#ffd27a", "#c25d2e"] },
    summit: { kind: "snow", colors: ["#f3efe4", "#d7e4e8", "#b8c8d0"] },
  };

  function spawnParticles(zone) {
    if (document.documentElement.dataset.power === "low") return;
    if (document.documentElement.classList.contains("hide-map-hints") ||
        document.documentElement.classList.contains("map-hints-off")) return;
    const cfg = PARTICLE_STYLES[zone.dataset.shape];
    if (!cfg) return;
    const canvas = zone.closest(".map-canvas");
    const icon = zone.querySelector(".zone-icon") || zone;
    if (!canvas || !icon) return;
    const cr = canvas.getBoundingClientRect();
    const ir = icon.getBoundingClientRect();
    const cx = ir.left + ir.width / 2 - cr.left;
    const cy = ir.top + ir.height / 2 - cr.top;
    const count = cfg.kind === "steam" ? 6 : cfg.kind === "spark" ? 10 : 9;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("i");
      p.className = `map-particle map-particle--${cfg.kind}`;
      p.style.left = `${cx + (Math.random() - 0.5) * 34}px`;
      p.style.top = `${cy + (Math.random() - 0.5) * 24}px`;
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 48}px`);
      p.style.setProperty("--dy", `${-22 - Math.random() * 40}px`);
      p.style.setProperty("--r", `${Math.random() * 180 - 90}deg`);
      p.style.setProperty("--size", `${4 + Math.random() * 6}px`);
      p.style.background = cfg.colors[i % cfg.colors.length];
      p.style.color = cfg.colors[i % cfg.colors.length];
      p.style.animationDuration = `${cfg.kind === "steam" ? 1.7 : cfg.kind === "spark" ? 1.05 : 1.4}s`;
      p.style.animationDelay = `${i * 12}ms`;
      canvas.append(p);
      setTimeout(() => p.remove(), 2100);
    }
  }

  function mount(root) {
    const canvas = root.querySelector(".map-canvas");
    const tip = root.querySelector("[data-map-tip]");
    const intro = root.querySelector("[data-map-intro]");
    const introMatch = intro?.querySelector(".map-intro__match");
    const preferences = getState().settings || {};
    const hintsOff = Boolean(preferences.hideMapHints);
    root.classList.toggle("map-no-hints", hintsOff);
    let introTimer = 0;
    if (intro) {
      if (
        !preferences.intro ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ) {
        intro.remove();
      } else {
        const INTRO_FRAMES = 108;
        const mobileIntro = window.matchMedia?.("(max-width: 720px)").matches;
        const introTheme = document.documentElement.dataset.theme === "night" ? "dark" : "light";
        const introFolder = `intro-${mobileIntro ? "mobile-" : ""}${introTheme}-jpg`;
        if (mobileIntro && introMatch) {
          introMatch.src = introTheme === "dark"
            ? "./assets/hero/map-preview-mobile-dark.jpg"
            : "./assets/hero/map-preview-mobile-light.jpg";
        }
        const images = [];
        let stopped = false;
        let started = false;
        let lastFrame = null;
        const load = (i) => {
          const img = new Image();
          img.onload = () => { images[i] = img; };
          img.onerror = () => { images[i] = null; };
          img.src = `./assets/table-props/${introFolder}/frame_${String(i + 1).padStart(4, "0")}.jpg`;
          return img;
        };
        const startIntro = () => {
          if (started || stopped || !intro.isConnected) return;
          started = true;
          const surface = intro.querySelector(".map-intro__canvas");
          const ctx = surface?.getContext("2d");
          if (!ctx) { intro.remove(); return; }
          if (mobileIntro) {
            surface.width = 720;
            surface.height = 1560;
          }
          const startedAt = performance.now();
          let raf = 0;
          const tick = (now) => {
            if (stopped) return;
            const index = Math.min(INTRO_FRAMES - 1, Math.floor(((now - startedAt) / 1000) * 24));
            const img = images[index];
            if (img && img.complete && img.naturalWidth) {
              ctx.drawImage(img, 0, 0, surface.width, surface.height);
              lastFrame = img;
            } else if (lastFrame) {
              // Не ждём следующие кадры: показываем последний загруженный.
              ctx.drawImage(lastFrame, 0, 0, surface.width, surface.height);
            }
            if (index < INTRO_FRAMES - 1) {
              raf = requestAnimationFrame(tick);
            } else {
              introTimer = window.setTimeout(() => {
                const target = root.querySelector(".map-canvas");
                const targetTop = target
                  ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - 92)
                  : window.scrollY;
                const startY = window.scrollY;
                const startAt = performance.now();
                const match = introMatch;
                if (mobileIntro && target && match) {
                  if (surface) {
                    surface.style.transition = "opacity 0.18s ease";
                    surface.style.opacity = "0";
                  }
                  intro.style.backgroundImage = "none";
                  intro.style.background = "#080604";
                  const r = target.getBoundingClientRect();
                  match.style.left = `${r.left}px`;
                  match.style.top = "92px";
                  match.style.width = `${r.width}px`;
                  match.style.height = `${r.height}px`;
                  match.classList.add("is-visible");
                }
                const duration = 1300;
                const previousBehavior = document.documentElement.style.scrollBehavior;
                document.documentElement.style.scrollBehavior = "auto";
                intro.style.transition = "none";
                const step = (now) => {
                  if (stopped) return;
                  const t = Math.min(1, (now - startAt) / duration);
                  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                  window.scrollTo(0, startY + (targetTop - startY) * eased);
                  intro.style.opacity = String(1 - eased);
                  if (t < 1) {
                    requestAnimationFrame(step);
                  } else {
                    intro.remove();
                    document.documentElement.style.scrollBehavior = previousBehavior;
                    introTimer = 0;
                  }
                };
                requestAnimationFrame(step);
                introTimer = window.setTimeout(() => {
                  if (intro.isConnected) intro.remove();
                  document.documentElement.style.scrollBehavior = previousBehavior;
                }, 2200);
              }, 140);
            }
          };
          raf = requestAnimationFrame(tick);
          intro._introStop = () => { stopped = true; cancelAnimationFrame(raf); };
        };
        // Первый кадр показываем сразу; остальные догружаются в фоне.
        images[0] = load(0);
        if (images[0].complete && images[0].naturalWidth) startIntro();
        else images[0].addEventListener("load", startIntro, { once: true });
        for (let i = 1; i < INTRO_FRAMES; i += 1) load(i);
      }
    }
    if (!canvas || !tip) return () => { intro?._introStop?.(); window.clearTimeout(introTimer); };

    root.querySelectorAll(".map-zone").forEach((zone) => {
      zone.addEventListener("pointerenter", (event) => {
        if (zone.dataset.shape === "lantern") return;
        if (!event.relatedTarget || !zone.contains(event.relatedTarget)) spawnParticles(zone);
      });
      zone.addEventListener("focus", () => {
        if (zone.dataset.shape !== "lantern") spawnParticles(zone);
      });
    });

    const tipMarkup = (zone) => {
      const title = zone.dataset.title || "";
      const zoneName = zone.dataset.zoneName || "";
      const done = zone.dataset.done || "0";
      const total = zone.dataset.total || "0";
      const doneAll = done === total;
      return `
        <span class="map-tip__kicker">${escapeHtml(zoneName)}</span>
        <strong>${escapeHtml(title)}</strong>
        <span class="map-tip__meta">${done} / ${total} уроков${doneAll ? " · зона пройдена" : ""}</span>`;
    };

    // Warm the tooltip content once, so the first hover doesn't force layout.
    root.querySelectorAll(".map-zone").forEach((zone) => {
      tip.innerHTML = tipMarkup(zone);
      tip.style.visibility = "hidden";
      tip.style.left = "0px";
      tip.style.top = "0px";
      zone._tipSize = { width: tip.offsetWidth, height: tip.offsetHeight };
      tip.classList.remove("is-visible");
      tip.style.visibility = "";
    });

    const show = (zone, event) => {
      if (hintsOff) return;
      tip.innerHTML = tipMarkup(zone);
      tip.classList.add("is-visible");
      tip.setAttribute("aria-hidden", "false");
      const rect = canvas.getBoundingClientRect();
      const icon = zone.querySelector(".zone-icon") || zone;
      const ir = icon.getBoundingClientRect();
      const width = zone._tipSize?.width || tip.offsetWidth;
      const height = zone._tipSize?.height || tip.offsetHeight;
      const gap = 14;
      let left = ir.right - rect.left + gap;
      let top = ir.top - rect.top + ir.height / 2 - height / 2;
      if (left + width > rect.width - 12) {
        left = ir.left - rect.left - width - gap;
      }
      if (left < 12) {
        left = Math.max(12, Math.min(rect.width - width - 12, ir.left - rect.left + ir.width / 2 - width / 2));
        top = ir.top - rect.top - height - gap;
      }
      top = Math.max(12, Math.min(rect.height - height - 12, top));
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    };

    const hideTip = () => {
      tip.classList.remove("is-visible");
      tip.setAttribute("aria-hidden", "true");
    };

    canvas.addEventListener("pointerover", (event) => {
      const zone = event.target.closest(".map-zone");
      if (zone) show(zone, event);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!tip.classList.contains("is-visible")) return;
      if (!event.target.closest(".map-zone")) hideTip();
    });
    canvas.addEventListener("pointerout", (event) => {
      const zone = event.target.closest(".map-zone");
      if (!zone) return;
      const next = event.relatedTarget;
      if (!next || !next.closest?.(".map-zone")) hideTip();
    });
    canvas.addEventListener("focusin", (event) => {
      const zone = event.target.closest(".map-zone");
      if (zone) show(zone);
    });
    canvas.addEventListener("focusout", () => {
      hideTip();
    });

    let themeSnapshot = null;

    const onThemeChange = (event) => {
      if (!canvas || intro?.isConnected) return;
      if (document.documentElement.dataset.power === "low") return;
      if (window.matchMedia?.("(max-width: 720px)").matches) return;
      const from = event.detail?.from === "night" ? "dark" : "light";
      themeSnapshot?.remove();
      const snapshot = document.createElement("img");
      snapshot.className = "map-theme-snapshot";
      snapshot.alt = "";
      snapshot.setAttribute("aria-hidden", "true");
      snapshot.src = from === "dark"
        ? "./assets/hero/map-preview-dark.jpg"
        : "./assets/hero/map-preview-light.jpg";
      canvas.append(snapshot);
      themeSnapshot = snapshot;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => snapshot.classList.add("is-fading"));
      });
      window.setTimeout(() => {
        if (snapshot.isConnected) snapshot.remove();
        if (themeSnapshot === snapshot) themeSnapshot = null;
      }, 700);
    };

    document.addEventListener("themechange", onThemeChange);

    return () => {
      document.removeEventListener("themechange", onThemeChange);
      themeSnapshot?.remove();
      intro?._introStop?.();
      window.clearTimeout(introTimer);
      canvas.replaceChildren?.();
    };
  }

  return { html, mount };
}
