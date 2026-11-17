/**
 * Сборка библиотеки: словарь, рецепты, карточки, конспекты и упражнения
 * из js/data/library/mN.js. Недостающие файлы пропускаются — страница не ломается.
 */
import { modules } from "../modules.js";

const LOADERS = {
  m1: () => import("./m1.js"),
  m2: () => import("./m2.js"),
  m3: () => import("./m3.js"),
  m4: () => import("./m4.js"),
  m5: () => import("./m5.js"),
  m6: () => import("./m6.js"),
  m7: () => import("./m7.js"),
  m8: () => import("./m8.js"),
  m9: () => import("./m9.js"),
  m10: () => import("./m10.js"),
  m11: () => import("./m11.js"),
  m12: () => import("./m12.js"),
};

let cache = null;

export async function loadLibrary() {
  if (cache) return cache;
  const result = { summaries: [], glossary: [], recipes: [], cards: [], cheats: [], exercises: [] };
  await Promise.all(
    modules.map(async (module) => {
      const load = LOADERS[module.id];
      if (!load) return;
      try {
        const lib = (await load()).default;
        const tag = (item) => ({ ...item, moduleId: module.id });
        if (lib.summary) result.summaries.push({ ...lib.summary, moduleId: module.id });
        result.glossary.push(...(lib.glossary || []).map(tag));
        result.recipes.push(...(lib.recipes || []).map(tag));
        result.cards.push(...(lib.cards || []).map(tag));
        result.cheats.push(...(lib.cheats || []).map(tag));
        result.exercises.push(...(lib.exercises || []).map(tag));
      } catch (error) {
        console.warn(`Библиотека модуля ${module.id} недоступна`, error);
      }
    }),
  );
  const order = Object.fromEntries(modules.map((m, i) => [m.id, i]));
  for (const key of ["summaries", "glossary", "recipes", "cards", "cheats", "exercises"]) {
    result[key].sort((a, b) => order[a.moduleId] - order[b.moduleId]);
  }
  cache = result;
  return result;
}
