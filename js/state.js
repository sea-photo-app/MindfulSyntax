/**
 * Состояние курса и прогресс.
 * Всё хранится в localStorage — без сервера, без аккаунта.
 */

const STORAGE_KEY = "garden-of-code:v1";
const MAX_ERRORS = 30;

const listeners = new Set();
let totalLessons = 0;

const defaults = () => ({
  version: 1,
  theme: null, // null = как в системе
  sound: false,
  doneLessons: {}, // { lessonId: timestamp }
  doneSteps: {}, // { blockId: timestamp }
  drops: 0,
  achievements: {}, // { achievementId: timestamp }
  errors: [], // дневник ошибок
  lastLesson: null,
  challengeDone: false,
  challengeLevels: {}, // { "1": timestamp, … "5": timestamp }
  practice: {}, // { exerciseId: timestamp } — решённые упражнения тренажёра
  review: {}, // { cardId: { box, due } } — карточки повторения (интервалы)
  settings: {
    intro: true,
    lowPower: false,
    hideMapHints: false,
  },
  startedAt: Date.now(),
});

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function load() {
  const base = defaults();
  try {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return base;
    return {
      ...base,
      ...stored,
      doneLessons: stored.doneLessons || {},
      doneSteps: stored.doneSteps || {},
      achievements: stored.achievements || {},
      challengeLevels:
        stored.challengeLevels && typeof stored.challengeLevels === "object" ? stored.challengeLevels : {},
      practice: stored.practice && typeof stored.practice === "object" ? stored.practice : {},
      review: stored.review && typeof stored.review === "object" ? stored.review : {},
      errors: Array.isArray(stored.errors) ? stored.errors.slice(0, MAX_ERRORS) : [],
      settings: { ...base.settings, ...(stored.settings || {}) },
    };
  } catch {
    return base;
  }
}

let state = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Приватный режим или переполненное хранилище — курс продолжит работать без сохранения.
  }
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch (error) {
      console.error("Ошибка подписчика состояния", error);
    }
  });
}

export function configureState({ lessons }) {
  totalLessons = lessons;
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function totalLessonCount() {
  return totalLessons;
}

export function completeLesson(lessonId) {
  if (state.doneLessons[lessonId]) return false;
  state.doneLessons[lessonId] = Date.now();
  state.drops += 10;
  state.lastLesson = lessonId;
  persist();
  return true;
}

export function isLessonDone(lessonId) {
  return Boolean(state.doneLessons[lessonId]);
}

export function completeStep(stepId, drops = 3) {
  if (state.doneSteps[stepId]) return false;
  state.doneSteps[stepId] = Date.now();
  state.drops += drops;
  persist();
  return true;
}

export function isStepDone(stepId) {
  return Boolean(state.doneSteps[stepId]);
}

export function addDrops(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  state.drops += amount;
  persist();
}

export function setTheme(theme) {
  state.theme = theme;
  persist();
}

export function setSound(on) {
  state.sound = Boolean(on);
  persist();
}

export function setLastLesson(lessonId) {
  if (state.lastLesson === lessonId) return;
  state.lastLesson = lessonId;
  persist();
}

export function markChallengeDone() {
  if (state.challengeDone) return false;
  state.challengeDone = true;
  state.drops += 50;
  for (let level = 1; level <= 5; level += 1) {
    state.challengeLevels[String(level)] = state.challengeLevels[String(level)] || Date.now();
  }
  persist();
  return true;
}

export function completeChallengeLevel(level, drops = 8) {
  const key = String(level);
  if (state.challengeLevels[key]) return false;
  state.challengeLevels[key] = Date.now();
  state.drops += drops;
  persist();
  return true;
}

export function isChallengeLevelDone(level) {
  return Boolean(state.challengeLevels[String(level)]);
}

export function earnAchievement(id) {
  if (state.achievements[id]) return false;
  state.achievements[id] = Date.now();
  state.drops += 15;
  persist();
  return true;
}

export function addError(entry) {
  state.errors.unshift({
    id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: Date.now(),
    ...entry,
  });
  state.errors = state.errors.slice(0, MAX_ERRORS);
  persist();
}

export function markExerciseDone(id) {
  if (state.practice[id]) return false;
  state.practice[id] = Date.now();
  persist();
  return true;
}

/** Интервальное повторение: коробки 0..4, паузы в днях. */
const REVIEW_DAYS = [0, 1, 3, 7, 16];
export function reviewCard(id, remembered) {
  const prev = state.review[id]?.box ?? 0;
  const box = remembered ? Math.min(prev + 1, REVIEW_DAYS.length - 1) : 0;
  state.review[id] = { box, due: Date.now() + (remembered ? REVIEW_DAYS[box] : 0) * 86400000 };
  persist();
}

export function clearErrors() {
  state.errors = [];
  persist();
}

export function setSetting(key, value) {
  state.settings = { ...state.settings, [key]: Boolean(value) };
  persist();
}

export function snapshotState() {
  return JSON.parse(JSON.stringify(state));
}

export function replaceState(data) {
  state = {
    ...defaults(),
    ...(data && typeof data === "object" ? data : {}),
    settings: { ...defaults().settings, ...(data?.settings || {}) },
  };
  persist();
}

export function resetProgress() {
  state = defaults();
  // Тему и звук сбрасываем к системным настройкам — это осознанный «новый сад».
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
  persist();
}

export function progressPercent() {
  if (!totalLessons) return 0;
  const done = Object.keys(state.doneLessons).length;
  return Math.min(100, Math.round((done / totalLessons) * 100));
}

export function lessonCount() {
  return Object.keys(state.doneLessons).length;
}

/** Форматирует дату для дневника ошибок. */
export function formatDate(timestamp) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "";
  }
}
