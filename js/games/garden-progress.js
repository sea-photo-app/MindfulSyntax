/**
 * Бамбуковый прогресс: каждый урок — стебель и вода.
 */

import { icon, escapeHtml } from "../ui.js";
import { getState, progressPercent, lessonCount, totalLessonCount } from "../state.js";

export function mountGardenProgress(container, config = {}) {
  const state = getState();
  const percent = progressPercent();
  const done = lessonCount();
  const total = totalLessonCount();
  const stalks = Math.max(1, Math.min(7, Math.round((percent / 100) * 7)));
  const heights = [24, 38, 52, 66, 82, 100, 118];

  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("bamboo")} Сад растёт</span>
          <h3>${escapeHtml(config.title || "Ваш бамбук")}</h3>
          <p class="widget__note">${escapeHtml(
            config.note || "Каждый пройденный урок поливает сад.",
          )}</p>
        </div>
        <span class="badge badge--bamboo">${percent}%</span>
      </div>
      <div class="garden-widget">
        <div class="bamboo-visual" role="img" aria-label="Бамбук вырос на ${percent} процентов">
          <div class="water-line" style="height:${Math.max(8, percent * 0.36)}%"></div>
          ${Array.from({ length: stalks }, (_, index) => {
            const h = heights[Math.min(index, heights.length - 1)] * (0.7 + percent / 300);
            return `<div class="bamboo-stalk" style="height:${Math.max(18, Math.round(h))}px">
              <span class="bamboo-leaf"></span>
              <span class="bamboo-leaf"></span>
            </div>`;
          }).join("")}
        </div>
        <div>
          <div class="stat" style="background:transparent;border:0;padding:0">
            <div class="stat__value">${done} / ${total}</div>
            <div class="stat__label">уроков пройдено</div>
          </div>
          <div class="stat" style="background:transparent;border:0;padding:12px 0 0">
            <div class="stat__value">${state.drops}</div>
            <div class="stat__label">капель воды</div>
          </div>
          <a class="btn btn--ghost btn--small" href="#/map" style="margin-top:14px">Карта сада</a>
        </div>
      </div>
    </div>
  `;
}
