/**
 * Проверка контента курса в Node + локальный Pyodide.
 * Запуск: node tools/validate-content.mjs [m1 m2 ...]   (без аргументов — все модули)
 *
 * Проверяет:
 *  - структуру урока (id, title, summary, goal, recall, keyIdeas, blocks);
 *  - квизы (correct в пределах options), задания (checks, hints, starter);
 *  - что запускаемые примеры (code без runnable:false) выполняются без ошибок,
 *    а input() получает тестовые ответы;
 *  - честность заданий: starter сам НЕ проходит все проверки.
 * Код возврата 1, если есть ошибки.
 */
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { modules } = await import(pathToFileURL(path.join(root, "js/data/modules.js")).href);
const { evaluateChecks, allPassed, needsRun } = await import(pathToFileURL(path.join(root, "js/checks.js")).href);
const { loadPyodide } = await import(pathToFileURL(path.join(root, "vendor/pyodide/pyodide.mjs")).href);

const only = process.argv.slice(2);
const py = await loadPyodide({ indexURL: path.join(root, "vendor/pyodide") });

const HARNESS = `
import sys, builtins, json

class _Cap:
    def __init__(self): self.parts = []; self.n = 0
    def write(self, t):
        self.n += len(t)
        if self.n > 200000: raise RuntimeError("слишком много вывода (бесконечный цикл?)")
        self.parts.append(t); return len(t)
    def flush(self): pass
    def getvalue(self): return "".join(self.parts)

def _run(code, answers):
    out = _Cap(); err = None; steps = [0]
    it = iter(answers)
    def fake_input(prompt=""):
        out.write(str(prompt)); return next(it, "1")
    def tracer(frame, event, arg):
        steps[0] += 1
        if steps[0] > 400000: raise RuntimeError("слишком много шагов (бесконечный цикл?)")
        return tracer
    builtins.input = fake_input
    old = sys.stdout; sys.stdout = out
    sys.settrace(tracer)
    try:
        exec(compile(code, "<lesson>", "exec"), {"__name__": "__main__"})
    except BaseException as e:
        err = type(e).__name__ + ": " + str(e)
    finally:
        sys.settrace(None); sys.stdout = old
    return json.dumps({"stdout": out.getvalue(), "error": err})
`;
py.runPython(HARNESS);

const ANSWER_SETS = [
  ["Аня", "7", "5", "да", "1", "2", "3"],
  ["7", "5", "3", "2", "1", "4", "6"],
  ["Аня", "Москва", "7", "да", "нет", "5", "3"],
];

async function runOnce(code, answers) {
  py.globals.set("_code", code);
  py.globals.set("_answers", answers);
  return JSON.parse(py.runPython("_run(_code, list(_answers))"));
}

/** Если ответы заданы явно — только они; иначе пробуем несколько наборов (имя/число). */
async function run(code, answers) {
  if (answers) return runOnce(code, answers);
  let last = null;
  for (const set of ANSWER_SETS) {
    last = await runOnce(code, set);
    if (!last.error) return last;
  }
  return last;
}

const errors = [];
const warns = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

let lessonsChecked = 0, tasks = 0, quizzes = 0, examples = 0;
const seenIds = new Set();

for (const mod of modules) {
  if (only.length && !only.includes(mod.id)) continue;
  for (const lesson of mod.lessons) {
    lessonsChecked++;
    const L = lesson.id;
    if (seenIds.has(L)) fail(L, "повторяющийся id");
    seenIds.add(L);
    for (const key of ["title", "summary"]) if (!lesson[key]) fail(L, `нет поля ${key}`);
    if (!lesson.goal) warn(L, "нет goal (цель урока)");
    if (!lesson.recall) warn(L, "нет recall (подсказка для повторения)");
    if (!Array.isArray(lesson.keyIdeas) || lesson.keyIdeas.length !== 3) warn(L, "keyIdeas должно быть ровно 3");
    if (!lesson.minutes) fail(L, "нет minutes");
    const kinds = lesson.blocks.map((b) => b.type);
    if (!kinds.includes("task")) fail(L, "нет ни одного задания (task)");
    if (!kinds.includes("quiz")) warn(L, "нет квиза");
    let idx = 0;
    for (const b of lesson.blocks) {
      idx++;
      const where = `${L} блок ${idx} (${b.type})`;
      if (b.type === "quiz") {
        quizzes++;
        if (!Array.isArray(b.options) || b.options.length < 2) fail(where, "мало options");
        if (!(b.correct >= 0 && b.correct < (b.options || []).length)) fail(where, "correct вне options");
        if (!b.explain) fail(where, "нет explain");
      }
      if (b.type === "code" && b.runnable !== false) {
        examples++;
        const r = await run(b.code);
        if (r.error) fail(where, `пример падает: ${r.error}`);
      }
      if (b.type === "task") {
        tasks++;
        if (!b.checks?.length) fail(where, "нет checks");
        if (!b.hints || b.hints.length < 2) warn(where, "меньше 2 подсказок");
        if (!b.success) warn(where, "нет success");
        if (typeof b.starter !== "string") fail(where, "нет starter");
        // честность: starter не должен проходить все проверки
        const res = b.starter ? await run(b.starter) : { stdout: "", error: null };
        const results = evaluateChecks(b.checks || [], {
          code: b.starter || "",
          result: { stdout: res.stdout, error: res.error ? { message: res.error, raw: res.error } : null },
        });
        if (allPassed(results)) fail(where, "starter уже проходит все проверки (задание засчитается без работы)");
        // решение (необязательное поле solution) должно проходить проверки
        if (b.solution) {
          // как в интерфейсе: если у задания есть inputs, решение запускается именно на них
          const solAnswers = b.inputs?.length ? b.inputs : b.solution.answers;
          if (b.inputs?.length && b.solution.answers && JSON.stringify(b.inputs) !== JSON.stringify(b.solution.answers)) warn(where, "solution.answers не совпадает с inputs");
          const sol = await run(b.solution.code ?? b.solution, solAnswers);
          if (sol.error) fail(where, `solution падает: ${sol.error}`);
          const solRes = evaluateChecks(b.checks, {
            code: b.solution.code ?? b.solution,
            result: { stdout: sol.stdout, error: sol.error ? { message: sol.error, raw: sol.error } : null },
          });
          if (!allPassed(solRes)) fail(where, "solution не проходит checks: " + solRes.filter((x) => !x.ok).map((x) => x.label).join("; "));
        } else {
          warn(where, "нет solution (эталонное решение для проверки честности)");
        }
      }
      if (b.type === "widget" && !b.config) fail(where, "нет config");
    }
  }
}


// ---------- библиотека и тренажёр: js/data/library/mN.js ----------
import fs from "node:fs";
const lessonIds = new Set(modules.flatMap((m) => m.lessons.map((l) => l.id)));
let libs = 0, exCount = 0;
const trim = (t) => String(t || "").replace(/\r\n/g, "\n").trim();
for (const mod of modules) {
  if (only.length && !only.includes(mod.id)) continue;
  const file = path.join(root, `js/data/library/${mod.id}.js`);
  if (!fs.existsSync(file)) { warn(mod.id, "нет js/data/library/" + mod.id + ".js"); continue; }
  libs++;
  const lib = (await import(pathToFileURL(file).href + "?v=" + Date.now())).default;
  const W = (k) => `${mod.id} library.${k}`;
  if (!lib.summary?.points?.length) fail(W("summary"), "нет конспекта");
  for (const [key, min] of [["glossary", 7], ["recipes", 3], ["cards", 5], ["cheats", 5], ["exercises", 13]]) {
    if (!Array.isArray(lib[key]) || lib[key].length < min) warn(W(key), `меньше ${min} записей (${lib[key]?.length ?? 0})`);
  }
  for (const g of lib.glossary || []) { if (!g.term || !g.definition) fail(W("glossary"), "пустой термин"); if (g.lesson && !lessonIds.has(g.lesson)) fail(W("glossary"), `${g.term}: неизвестный урок ${g.lesson}`); }
  for (const r of lib.recipes || []) {
    const res = await run(r.code); if (res.error) fail(W("recipes") + " " + r.id, "код падает: " + res.error);
    if (r.lesson && !lessonIds.has(r.lesson)) fail(W("recipes") + " " + r.id, "неизвестный урок");
  }
  for (const c of lib.cards || []) if (!c.front || !c.back) fail(W("cards"), "пустая карточка " + c.id);
  const ids = new Set();
  for (const e of lib.exercises || []) {
    exCount++;
    const w = W("exercises") + " " + e.id;
    if (ids.has(e.id)) fail(w, "повторяющийся id"); ids.add(e.id);
    if (![1, 2, 3].includes(e.level)) fail(w, "level должен быть 1–3");
    if (e.lesson && !lessonIds.has(e.lesson)) fail(w, "неизвестный урок " + e.lesson);
    if (!e.explain) fail(w, "нет explain");
    if (e.type === "predict" || e.type === "read") {
      if (!e.options?.[e.correct]) fail(w, "correct вне options");
      const res = await run(e.code); if (res.error) fail(w, "код падает: " + res.error);
      if (e.type === "predict") {
        if (trim(res.stdout) !== trim(e.expected)) fail(w, `expected «${trim(e.expected)}» ≠ реальный вывод «${trim(res.stdout)}»`);
        if (e.options?.[e.correct] !== e.expected) fail(w, "options[correct] ≠ expected");
        if (new Set(e.options).size !== e.options.length) fail(w, "повторяющиеся options");
      }
    } else if (e.type === "bug") {
      if (!Array.isArray(e.lines) || !(e.badLine >= 0 && e.badLine < e.lines.length)) fail(w, "badLine вне lines");
      else {
        const bad = await run(e.lines.join("\n"));
        const fixed = e.lines.slice(); fixed[e.badLine] = e.fix;
        const ok = await run(fixed.join("\n")); if (ok.error) fail(w, "после fix код падает: " + ok.error);
        if (!bad.error) {
          // логическая ошибка: допустима только с флагом logic и если исправление меняет вывод
          if (!e.logic) fail(w, "код с ошибкой не падает: если это логическая ошибка, добавьте logic: true");
          else if (trim(bad.stdout) === trim(ok.stdout)) fail(w, "logic-ошибка не меняет вывод — упражнение бессмысленно");
        }
      }
    } else if (e.type === "fill") {
      if ((e.code.match(/___/g) || []).length !== 1) fail(w, "в code должен быть ровно один ___");
      for (const a of e.answers || []) {
        const res = await run(e.code.replace("___", a));
        if (res.error) fail(w, `подстановка «${a}» падает: ${res.error}`);
        else if (trim(res.stdout) !== trim(e.expected)) fail(w, `подстановка «${a}» даёт «${trim(res.stdout)}», ожидалось «${trim(e.expected)}»`);
      }
      if (!e.answers?.length) fail(w, "нет answers");
    } else if (e.type === "assemble") {
      const byId = Object.fromEntries((e.pieces || []).map((p) => [p.id, p.code]));
      if (!e.solution?.every((id) => byId[id] !== undefined)) fail(w, "solution ссылается на неизвестные куски");
      else { const res = await run(e.solution.map((id) => byId[id]).join("\n")); if (res.error) fail(w, "сборка падает: " + res.error); }
    } else fail(w, "неизвестный type " + e.type);
  }
}
// ---------- атлас ошибок ----------
if (!only.length) {
  const atlas = (await import(pathToFileURL(path.join(root, "js/data/library/errors-atlas.js")).href)).default;
  const types = new Set();
  for (const e of atlas) {
    types.add(e.name);
    const res = await run(e.code, ["1"]);
    if (!res.error || !res.error.startsWith(e.name)) fail("atlas " + e.id, `код даёт «${res.error}», а заявлена ${e.name}`);
    if (e.lesson && !lessonIds.has(e.lesson)) fail("atlas " + e.id, "неизвестный урок " + e.lesson);
    if (!e.why || !e.fix) fail("atlas " + e.id, "нет why/fix");
  }
  if (atlas.length < 30) warn("atlas", `меньше 30 записей (${atlas.length})`);
  console.log(`Атлас ошибок: ${atlas.length} записей, ${types.size} типов`);
}

if (libs) console.log(`Библиотек: ${libs}, упражнений: ${exCount}`);

console.log(`Уроков: ${lessonsChecked}, примеров кода: ${examples}, квизов: ${quizzes}, заданий: ${tasks}`);
if (warns.length) console.log(`\nПредупреждения (${warns.length}):\n` + warns.map((w) => "  - " + w).join("\n"));
if (errors.length) { console.log(`\nОШИБКИ (${errors.length}):\n` + errors.map((e) => "  ✗ " + e).join("\n")); process.exit(1); }
console.log("\nОшибок нет.");
