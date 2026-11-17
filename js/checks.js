/**
 * Проверка заданий: статическая (по коду) и динамическая (по выводу).
 * Все формулировки — поддерживающие, без «неверно, подумайте ещё».
 */

export function normalizeOutput(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

export function needsRun(checks = []) {
  return checks.some((check) =>
    ["output", "regex", "notOutput"].includes(check.type),
  );
}

export function evaluateChecks(checks = [], { code = "", result = null } = {}) {
  const stdout = normalizeOutput(result?.stdout);
  const stderr = result?.error ? String(result.error.raw || result.error.message || "") : "";

  return checks.map((check) => {
    let ok = false;
    try {
      if (check.type === "contains") {
        ok = asArray(check.value).every((fragment) => code.includes(fragment));
      } else if (check.type === "notContains") {
        ok = asArray(check.value).every((fragment) => !code.includes(fragment));
      } else if (check.type === "regex") {
        ok = new RegExp(check.value, "m").test(stdout);
      } else if (check.type === "output") {
        ok = asArray(check.value).every((fragment) => stdout.includes(fragment));
      } else if (check.type === "notOutput") {
        ok = asArray(check.value).every((fragment) => !stdout.includes(fragment));
      } else if (check.type === "noError") {
        ok = !stderr && !result?.error;
      } else {
        ok = true;
      }
    } catch {
      ok = false;
    }
    return { check, ok, label: check.label || "Проверка" };
  });
}

export function allPassed(results) {
  return results.length > 0 && results.every((item) => item.ok);
}
