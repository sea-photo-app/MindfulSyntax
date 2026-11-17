import m1 from "./module-01.js";
import m2 from "./module-02.js";
import m3 from "./module-03.js";
import m4 from "./module-04.js";
import m5 from "./module-05.js";
import m6 from "./module-06.js";
import m7 from "./module-07.js";
import m8 from "./module-08.js";
import m9 from "./module-09.js";
import m10 from "./module-10.js";
import m11 from "./module-11.js";
import m12 from "./module-12.js";

export const modules = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12];

export const lessons = modules.flatMap((module) =>
  module.lessons.map((lesson) => ({
    ...lesson,
    moduleId: module.id,
    moduleNumber: module.number,
    moduleTitle: module.title,
    zone: module.zone,
  })),
);

export function getModule(moduleId) {
  return modules.find((module) => module.id === moduleId) || null;
}

export function getLesson(lessonId) {
  return lessons.find((lesson) => lesson.id === lessonId) || null;
}

export function getLessonNeighbors(lessonId) {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return {
    index,
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

export function moduleLessons(moduleId) {
  return lessons.filter((lesson) => lesson.moduleId === moduleId);
}

export function moduleProgress(moduleId, doneLessons = {}) {
  const list = moduleLessons(moduleId);
  const done = list.filter((lesson) => doneLessons[lesson.id]).length;
  return {
    done,
    total: list.length,
    percent: list.length ? Math.round((done / list.length) * 100) : 0,
  };
}

export function nextLesson(lessonId) {
  return getLessonNeighbors(lessonId).next;
}

export function firstUnfinishedLesson(doneLessons = {}) {
  return lessons.find((lesson) => !doneLessons[lesson.id]) || lessons[lessons.length - 1];
}

export const totals = {
  modules: modules.length,
  lessons: lessons.length,
  minutes: lessons.reduce((sum, lesson) => sum + (lesson.minutes || 5), 0),
};
