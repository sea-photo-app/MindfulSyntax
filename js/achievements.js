/**
 * Достижения: маленькие отметки пути, а не соревнование.
 */

import { modules } from "./data/modules.js";
import { getState, earnAchievement, subscribe } from "./state.js";
import { toast } from "./ui.js";
import { playChime } from "./audio.js";

const allLessonIds = modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));

function moduleDone(state, moduleId) {
  const module = modules.find((item) => item.id === moduleId);
  if (!module) return false;
  return module.lessons.every((lesson) => state.doneLessons[lesson.id]);
}

export const achievementDefs = [
  {
    id: "first-lesson",
    title: "Первый шаг",
    desc: "Завершить первый урок",
    icon: "leaf",
    check: (state) => Object.keys(state.doneLessons).length >= 1,
  },
  {
    id: "first-code",
    title: "Первый print",
    desc: "Запустить и решить первое задание с кодом",
    icon: "spark",
    check: (state) =>
      Boolean(state.doneLessons["m1-l2"]) ||
      Object.keys(state.doneSteps).some((key) => key.startsWith("m1-l2")),
  },
  {
    id: "error-friend",
    title: "Ошибка — друг",
    desc: "Пройти урок про ошибки и не испугаться",
    icon: "alert",
    check: (state) => Boolean(state.doneLessons["m1-l3"]),
  },
  {
    id: "ten-lessons",
    title: "Десять тропинок",
    desc: "Завершить десять уроков",
    icon: "map",
    check: (state) => Object.keys(state.doneLessons).length >= 10,
  },
  {
    id: "thirty-lessons",
    title: "Тридцать тропинок",
    desc: "Завершить тридцать уроков",
    icon: "map",
    check: (state) => Object.keys(state.doneLessons).length >= 30,
  },
  {
    id: "fifty-lessons",
    title: "Пятьдесят тропинок",
    desc: "Завершить пятьдесят уроков",
    icon: "bamboo",
    check: (state) => Object.keys(state.doneLessons).length >= 50,
  },
  {
    id: "variables",
    title: "Садовник переменных",
    desc: "Полностью пройти модуль про переменные",
    icon: "bamboo",
    check: (state) => moduleDone(state, "m2"),
  },
  {
    id: "branch",
    title: "Выбор пути",
    desc: "Полностью пройти модуль про ветвление",
    icon: "target",
    check: (state) => moduleDone(state, "m3"),
  },
  {
    id: "loops",
    title: "Победитель циклов",
    desc: "Полностью пройти модуль про циклы",
    icon: "reset",
    check: (state) => moduleDone(state, "m4"),
  },
  {
    id: "lists",
    title: "Хранитель полок",
    desc: "Полностью пройти модуль про списки и словари",
    icon: "book",
    check: (state) => moduleDone(state, "m5"),
  },
  {
    id: "functions",
    title: "Мастер помощников",
    desc: "Полностью пройти модуль про функции",
    icon: "home",
    check: (state) => moduleDone(state, "m6"),
  },
  {
    id: "libraries",
    title: "Друг библиотек",
    desc: "Полностью пройти модуль про библиотеки, pip и зависимости",
    icon: "copy",
    check: (state) => moduleDone(state, "m7"),
  },
  {
    id: "project",
    title: "Собрал игру",
    desc: "Завершить урок сборки игры",
    icon: "play",
    check: (state) => Boolean(state.doneLessons["m8-l1"]),
  },
  {
    id: "debugger",
    title: "Отладчик",
    desc: "Полностью пройти модуль про ошибки",
    icon: "alert",
    check: (state) => moduleDone(state, "m9"),
  },
  {
    id: "files",
    title: "Хранитель файлов",
    desc: "Полностью пройти модуль про текст и файлы",
    icon: "book",
    check: (state) => moduleDone(state, "m10"),
  },
  {
    id: "projects",
    title: "Мастер проектов",
    desc: "Полностью пройти модуль про проекты и разбор кода",
    icon: "home",
    check: (state) => moduleDone(state, "m11"),
  },
  {
    id: "graduate",
    title: "Выпускник сада",
    desc: "Полностью пройти финальный модуль",
    icon: "spark",
    check: (state) => moduleDone(state, "m12"),
  },
  {
    id: "first-practice",
    title: "Первый тренажёр",
    desc: "Решить первое упражнение в тренажёре",
    icon: "target",
    check: (state) => Object.keys(state.practice || {}).length >= 1,
  },
  {
    id: "twenty-practice",
    title: "Двадцать упражнений",
    desc: "Решить двадцать упражнений тренажёра",
    icon: "reset",
    check: (state) => Object.keys(state.practice || {}).length >= 20,
  },
  {
    id: "first-review",
    title: "Вспомнил",
    desc: "Пройти первую карточку повторения",
    icon: "book",
    check: (state) => Object.keys(state.review || {}).length >= 1,
  },
  {
    id: "challenger",
    title: "Финальный садовник",
    desc: "Пройти финальный проект",
    icon: "trophy",
    check: (state) => Boolean(state.challengeDone) || [1, 2, 3, 4, 5].every((level) => state.challengeLevels?.[String(level)]),
  },
  {
    id: "gardener",
    title: "Весь сад",
    desc: "Завершить все уроки курса",
    icon: "spark",
    check: (state) => allLessonIds.every((id) => state.doneLessons[id]),
  },
  {
    id: "drops-100",
    title: "Сто капель",
    desc: "Собрать 100 капель воды",
    icon: "drop",
    check: (state) => state.drops >= 100,
  },
  {
    id: "night",
    title: "Ночной сад",
    desc: "Включить ночной режим",
    icon: "moon",
    check: (state) => state.theme === "night",
  },
  {
    id: "sound",
    title: "Звук воды",
    desc: "Включить тихие звуки сада",
    icon: "sound-on",
    check: (state) => state.sound === true,
  },
];

let checking = false;
let initialized = false;

function check({ silent = false } = {}) {
  if (checking) return;
  checking = true;
  const state = getState();
  for (const def of achievementDefs) {
    if (state.achievements[def.id]) continue;
    let passed = false;
    try {
      passed = Boolean(def.check(state));
    } catch {
      passed = false;
    }
    if (!passed) continue;
    const earned = earnAchievement(def.id);
    if (earned && !silent) {
      toast({ title: `Достижение: ${def.title}`, text: def.desc, iconName: def.icon });
      if (state.sound) playChime();
    }
  }
  checking = false;
}

export function initAchievements() {
  if (initialized) return;
  initialized = true;
  check({ silent: true });
  subscribe(() => check());
}

export function earnedCount() {
  return achievementDefs.filter((def) => getState().achievements[def.id]).length;
}
