/**
 * Карта сада: по одной зоне на модуль (число берётся из данных).
 * Чистый SVG, без внешних картинок — поэтому карта работает и в тёмной теме.
 */

import { modules, moduleProgress } from "./data/modules.js";
import { plural, numberWord } from "./ui.js";

const SHAPES = ["gate", "stones", "fork", "bamboo", "pond", "tea", "store", "lantern", "bridge", "scroll", "workshop", "summit"];

const ICON_BASE = "./assets/map-icons/";
function zoneIcon(shape) {
  return `<image class="zone-icon" href="${ICON_BASE}${shape}.png" x="-43" y="-92" width="86" height="86" preserveAspectRatio="xMidYMid meet"/>`;
}

/** Широкая карта 1200×780: тропа змейкой снизу вверх, три ряда по четыре зоны. */
const WIDE = {
  w: 1200,
  h: 780,
  points: [
    [138, 654], [326, 672], [510, 626], [692, 658], [866, 620], [1020, 522],
    [862, 424], [652, 402], [454, 454], [302, 344], [548, 270], [848, 162],
  ],
};

/** Высокая карта 600×1560 для телефонов: тропа зигзагом вверх. */
const TALL = {
  w: 600,
  h: 1560,
  points: Array.from({ length: 12 }, (_, i) => [i % 2 === 0 ? 165 : 435, 1440 - i * 124]),
};

/** Гладкая тропа через центры зон (Catmull-Rom → кубические кривые Безье). */
function trailPath(points) {
  if (points.length < 2) return "";
  const d = [`M${points[0][0]} ${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d.push(`C${c1.map(Math.round)} ${c2.map(Math.round)} ${p2[0]} ${p2[1]}`);
  }
  return d.join("");
}

function zoneShape(shape) {
  if (shape === "pond") {
    return `
      <ellipse class="zone-fill" cx="0" cy="0" rx="96" ry="58"/>
      <ellipse class="zone-water" cx="-6" cy="-4" rx="70" ry="38" fill="none" stroke-width="1.2"/>
      <path class="zone-line" d="M-36 2c14-10 26 10 40 0s26 10 40 0" fill="none" stroke-width="1.4"/>
      <path class="zone-line" d="M-24 20c12-8 22 8 36 0" fill="none" stroke-width="1.2"/>`;
  }
  if (shape === "bamboo") {
    return `
      <ellipse class="zone-fill" cx="0" cy="8" rx="92" ry="56"/>
      <path class="zone-stem" d="M-44 42V-38M-20 46V-52M6 44V-30M32 42V-48" fill="none" stroke-width="4" stroke-linecap="round"/>
      <path class="zone-line" d="M-44 -16h20M-20 -28h18M32 -20h16M6 -8h16" fill="none" stroke-width="1.4"/>`;
  }
  if (shape === "tea") {
    return `
      <rect class="zone-fill" x="-66" y="-34" width="132" height="78" rx="10"/>
      <path class="zone-line" d="M-78 -34L0 -76l78 42" fill="none" stroke-width="2.4" stroke-linejoin="round"/>
      <rect class="zone-line" x="-18" y="12" width="36" height="32" rx="3" fill="none" stroke-width="1.6"/>
      <circle class="zone-line" cx="48" cy="4" r="13" fill="none" stroke-width="1.5"/>`;
  }
  if (shape === "store") {
    return `
      <rect class="zone-fill" x="-66" y="-30" width="132" height="72" rx="8"/>
      <path class="zone-line" d="M-76 -30L0 -70l76 40" fill="none" stroke-width="2.2"/>
      <path class="zone-line" d="M-42 -6h84M-42 12h84" fill="none" stroke-width="1.4"/>`;
  }
  if (shape === "lantern") {
    return `
      <ellipse class="zone-fill" cx="0" cy="14" rx="78" ry="46"/>
      <path class="zone-line" d="M-14 44V-4M14 44V-4M-24 44h48" fill="none" stroke-width="3"/>
      <rect class="zone-line" x="-22" y="-32" width="44" height="30" rx="3" fill="none" stroke-width="2"/>
      <path class="zone-line" d="M-44 -32L0 -62l44 30z" fill="none" stroke-width="2.2" stroke-linejoin="round"/>
      <circle class="zone-stone" cx="0" cy="-17" r="6"/>`;
  }
  if (shape === "bridge") {
    return `
      <ellipse class="zone-fill" cx="0" cy="12" rx="92" ry="50"/>
      <path class="zone-water" d="M-84 34c16-8 30 8 46 0s30 8 46 0 30 8 46 0 22 6 32 0" fill="none" stroke-width="1.4"/>
      <path class="zone-line" d="M-70 18C-40-26 40-26 70 18" fill="none" stroke-width="4" stroke-linecap="round"/>
      <path class="zone-line" d="M-50 4V28M-24-6V26M0-9V26M24-6V26M50 4V28" fill="none" stroke-width="1.4"/>
      <ellipse class="zone-stone" cx="-60" cy="46" rx="16" ry="9"/>`;
  }
  if (shape === "scroll") {
    return `
      <ellipse class="zone-fill" cx="0" cy="8" rx="86" ry="52"/>
      <rect class="zone-line" x="-46" y="-40" width="92" height="76" rx="8" fill="none" stroke-width="2"/>
      <ellipse class="zone-line" cx="-46" cy="-2" rx="9" ry="38" fill="none" stroke-width="2"/>
      <ellipse class="zone-line" cx="46" cy="-2" rx="9" ry="38" fill="none" stroke-width="2"/>
      <path class="zone-line" d="M-28-18h56M-28 0h56M-28 18h36" fill="none" stroke-width="1.4"/>`;
  }
  if (shape === "workshop") {
    return `
      <rect class="zone-fill" x="-72" y="-28" width="144" height="74" rx="10"/>
      <path class="zone-line" d="M-84-28L-60-62h120l24 34z" fill="none" stroke-width="2.2" stroke-linejoin="round"/>
      <path class="zone-line" d="M-52 46V-6M52 46V-6M-52-6h104" fill="none" stroke-width="3"/>
      <path class="zone-line" d="M-18 24l22-30 12 10-22 30zM22 4l22 22" fill="none" stroke-width="1.6" stroke-linecap="round"/>`;
  }
  if (shape === "summit") {
    return `
      <path class="zone-fill" d="M-98 52L-22-62 12-14 46-52 100 52z"/>
      <path class="zone-line" d="M-22-62L6 52M46-52L22 52" fill="none" stroke-width="1.2"/>
      <circle class="zone-line" cx="0" cy="-8" r="7" fill="none" stroke-width="1.4"/>`;
  }
  if (shape === "fork") {
    return `
      <circle class="zone-fill" cx="0" cy="0" r="74"/>
      <path class="zone-line" d="M0 58C0 20 0 4 0-50M0 6L-42-36M0 6L42-36" fill="none" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  if (shape === "stones") {
    return `
      <ellipse class="zone-fill" cx="0" cy="6" rx="84" ry="50"/>
      <ellipse class="zone-stone" cx="-34" cy="12" rx="20" ry="12"/>
      <ellipse class="zone-stone" cx="2" cy="-4" rx="27" ry="16"/>
      <ellipse class="zone-stone" cx="38" cy="20" rx="16" ry="10"/>
      <path class="zone-line" d="M-52 34c10-4 18 4 28 0s18 4 28 0 18 4 28 0" fill="none" stroke-width="1.2"/>`;
  }
  return `
    <ellipse class="zone-fill" cx="0" cy="6" rx="76" ry="48"/>
    <path class="zone-line" d="M-42 46V-26M42 46V-26M-62 -28H62M-50 -10H50" fill="none" stroke-width="4"/>
    <path class="zone-line" d="M-62 -28c0-12 8-16 18-16h88c10 0 18 4 18 16" fill="none" stroke-width="1.2" opacity=".6"/>`;
}

export const ZONE_SHORT_NAMES = [
  "Ворота", "Каменный сад", "Развилка", "Бамбук", "Пруд", "Чайный домик",
  "Кладовая", "Фонарь игры", "Мостик", "Свиток", "Мастерская", "Вершина",
];

function zonesMarkup(layout, doneLessons) {
  return modules
    .map((module, index) => {
      const [x, y] = layout.points[index] || layout.points[layout.points.length - 1];
      const shape = SHAPES[index] || "stones";
      const progress = moduleProgress(module.id, doneLessons);
      const isDone = progress.done === progress.total;
      const labelY = shape === "summit" ? 66 : 56;
      return `
        <a href="#/module/${module.id}" class="map-zone${isDone ? " is-done" : ""}" data-zone="${module.id}" data-shape="${shape}" data-title="${escapeXml(module.title)}" data-zone-name="${escapeXml(module.zone)}" data-done="${progress.done}" data-total="${progress.total}" aria-label="Модуль ${module.number}. ${escapeXml(module.title)}. Пройдено ${progress.done} из ${progress.total} уроков">
          <g transform="translate(${x} ${y})">
            <g class="zone-ground">
              <ellipse class="zone-shadow" cx="0" cy="33" rx="56" ry="15"/>
              <path class="zone-pad" d="M-56 16 Q0 -8 56 16 Q0 39 -56 16Z"/>
              <path class="zone-contour" d="M-68 21 Q0 -17 68 21"/>
            </g>
            <g class="zone-sketch">${zoneShape(shape)}</g>
            ${zoneIcon(shape)}
            <text class="zone-num" x="0" y="${labelY - 22}" text-anchor="middle">${String(module.number).padStart(2, "0")}</text>
            <text x="0" y="${labelY - 4}" text-anchor="middle">${escapeXml(ZONE_SHORT_NAMES[index] || module.zone)}</text>
            <text class="zone-sub" x="0" y="${labelY + 12}" text-anchor="middle">${progress.done} / ${progress.total}</text>
            <circle class="zone-hit" cx="0" cy="-8" r="88"/>
          </g>
        </a>`;
    })
    .join("");
}

function landscapeMarkup(kind) {
  const isTall = kind === "tall";
  const s = isTall ? 1.0 : 1.0;
  if (isTall) {
    return `
      <g class="map-terrain">
        <g class="terrain-wash">
          <ellipse cx="760" cy="250" rx="290" ry="150" fill="#8aa59a" opacity=".34"/>
          <ellipse cx="260" cy="380" rx="260" ry="170" fill="#b78d62" opacity=".26"/>
          <ellipse cx="890" cy="535" rx="250" ry="130" fill="#7fa49a" opacity=".3"/>
          <ellipse cx="520" cy="690" rx="220" ry="100" fill="#9aae86" opacity=".28"/>
        </g>
        <path class="terrain-ridge terrain-ridge--back" d="M0 520 C140 420 240 500 380 410 C500 335 560 410 720 350 C850 300 920 390 1040 330 L1200 390 V780 H0Z"/>
        <path class="terrain-ridge terrain-ridge--front" d="M0 610 C120 540 230 610 350 530 C480 445 540 530 690 480 C820 435 900 515 1040 455 L1200 500 V780 H0Z"/>
        <path class="terrain-river" d="M1040 680 C900 620 810 650 700 590 C610 540 550 560 470 510 C380 455 300 490 210 430"/>
        <path class="terrain-river-shine" d="M1040 680 C900 620 810 650 700 590 C610 540 550 560 470 510 C380 455 300 490 210 430"/>
        <g class="terrain-forest">
          <circle cx="60" cy="730" r="26"/><circle cx="98" cy="710" r="20"/><circle cx="80" cy="750" r="16"/>
          <circle cx="1130" cy="720" r="24"/><circle cx="1160" cy="695" r="18"/><circle cx="1110" cy="690" r="15"/>
          <circle cx="70" cy="500" r="18"/><circle cx="105" cy="485" r="14"/>
        </g>
      </g>`;
  }
  return `
    <g class="map-terrain">
      <path class="terrain-ridge terrain-ridge--back" d="M0 286 C96 190 188 250 280 178 C380 100 455 170 548 118 C660 56 728 138 828 96 C936 50 1010 112 1100 70 L1200 102 V780 H0Z"/>
      <path class="terrain-ridge terrain-ridge--front" d="M0 380 C110 300 195 345 292 280 C400 208 478 285 592 235 C695 190 770 246 872 208 C975 170 1060 220 1200 165 V780 H0Z"/>
      <path class="terrain-river" d="M1030 660 C940 590 850 620 770 552 C690 484 610 510 540 460 C468 408 402 438 330 390 C252 338 198 372 122 322"/>
      <path class="terrain-river-shine" d="M1035 655 C945 585 855 615 775 547 C695 479 615 505 545 455 C473 403 407 433 335 385 C257 333 203 367 127 317"/>
      <g class="terrain-forest">
        <circle cx="50" cy="710" r="34"/><circle cx="106" cy="688" r="28"/><circle cx="78" cy="742" r="22"/><circle cx="1160" cy="704" r="30"/><circle cx="1190" cy="670" r="21"/><circle cx="1128" cy="746" r="18"/>
        <circle cx="58" cy="558" r="25"/><circle cx="102" cy="540" r="18"/><circle cx="1160" cy="552" r="24"/>
      </g>
      <g class="terrain-bamboo">
        <path d="M748 690V566M770 694V548M792 688V584M814 690V560"/>
        <path d="M748 634h22M748 666h22M770 610h20M770 640h20M792 628h20M814 610h18"/>
      </g>      <g class="terrain-ink-trees">
        <g transform="translate(90 640)"><path d="M0 34V10M-16 18l16-20 16 20M-12 2l12-14 12 14" /></g>
        <g transform="translate(1110 590)"><path d="M0 40V12M-20 22l20-24 20 24M-14 2l14-18 14 18" /></g>
        <g transform="translate(180 220)"><path d="M0 28V8M-13 15l13-17 13 17" /></g>
        <g transform="translate(1030 300)"><path d="M0 32V8M-16 18l16-22 16 22M-10 0l10-12 10 12" /></g>
        <g transform="translate(300 560)"><path d="M0 22V4M-11 12L0-4l11 16" /></g>
        <g transform="translate(930 430)"><path d="M0 26V5M-14 15L0-8l14 23M-8-2l8-10 8 10" /></g>
        <g transform="translate(620 220)"><path d="M0 28V7M-15 17L0-6l15 23" /></g>
        <g transform="translate(1080 740)"><path d="M0 24V5M-12 14L0-5l12 19" /></g>
        <g transform="translate(510 760)"><path d="M0 21V4M-10 12L0-4l10 16" /></g>
        <g transform="translate(805 570)"><path d="M0 20V3M-9 11L0-4l9 15" /></g>
      </g>

      <g class="terrain-mountain">
        <path d="M836 188 L902 58 L945 116 L982 44 L1062 188Z"/>
        <path d="M862 148 L902 72 L932 124 L960 90 L1030 168" class="terrain-snow"/>
      </g>
      <g class="terrain-lines">
        <path d="M0 490 C130 456 230 500 330 466 S520 480 625 440 S820 460 920 420 S1080 440 1200 405"/>
        <path d="M0 540 C120 510 235 552 345 515 S535 535 645 495 S840 515 950 472 S1095 492 1200 460"/>
        <path d="M0 220 C105 188 200 222 305 190 S490 210 600 175 S780 195 890 160 S1060 180 1200 145"/>
      </g>
    </g>`;
}

function mapSvg(kind, layout, doneLessons, { compact }) {
  const uid = `map-${kind}`;
  const used = layout.points.slice(0, Math.max(2, modules.length));
  const trail = trailPath(used);
  const label = `Карта сада: ${numberWord(modules.length)} ${plural(modules.length, ["зона", "зоны", "зон"])}, по одной на каждый модуль курса`;
  const { w, h } = layout;
  const edgeBamboo =
    kind === "wide"
      ? `<path d="M28 770V610M52 770V650M76 770V590M1124 770V600M1150 770V650M1172 770V580" stroke-width="5"/>
         <path d="M28 690h24M28 730h24M52 705h22M1124 680h24M1150 720h20" stroke-width="2"/>`
      : `<path d="M20 1550V1380M44 1550V1420M580 1550V1360M556 1550V1410" stroke-width="5"/>
         <path d="M20 1470h24M20 1510h24M556 1460h24M556 1500h24" stroke-width="2"/>`;
  return `
    <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" class="map-svg map-svg--${kind}${compact ? " map-svg--compact" : ""}">
      <defs>
        <linearGradient id="${uid}-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--map-sky-top)"/>
          <stop offset="100%" stop-color="var(--map-sky-bottom)"/>
        </linearGradient>
        <filter id="${uid}-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#2c2c2a" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${uid}-sky)"/>
      <g class="map-landscape" transform="scale(${w / 1200} ${h / 780})">${landscapeMarkup(kind)}</g>
      <path class="map-path-shadow" d="${trail}" fill="none" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="map-path" d="${trail}" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="map-path-line" d="${trail}" fill="none" stroke-width="2" stroke-dasharray="2 12" stroke-linecap="round"/>
      <g opacity=".5" stroke="var(--bamboo)" fill="none" stroke-linecap="round">${edgeBamboo}</g>
      <g filter="url(#${uid}-soft)">${zonesMarkup(layout, doneLessons)}</g>
    </svg>`;
}

/** Две раскладки одной карты: широкая и вертикальная; CSS показывает нужную. */
export function gardenMapHTML(doneLessons = {}, { compact = false } = {}) {
  return `<div class="map-wrap">${mapSvg("wide", WIDE, doneLessons, { compact })}${mapSvg("tall", TALL, doneLessons, { compact })}</div>`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
