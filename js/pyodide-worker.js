/**
 * Python в отдельном Web Worker.
 * Отдельный поток — значит бесконечный while не подвесит весь сайт:
 * главный поток может просто остановить воркер по таймауту.
 */

// Pyodide лежит рядом с сайтом: курс работает и без интернета.
const PYODIDE_URL = new URL("../vendor/pyodide/", import.meta.url).href;

let pyodide = null;
let initPromise = null;
let currentRunId = null;

function post(type, payload = {}) {
  self.postMessage({ type, ...payload });
}

function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    post("status", { state: "loading" });
    try {
      const { loadPyodide } = await import(new URL("pyodide.mjs", PYODIDE_URL).href);
      pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
      // batched приходит по строкам и уже декодирован из UTF-8.
      pyodide.setStdout({
        batched: (text) => {
          if (currentRunId !== null) post("stdout", { id: currentRunId, text: `${text}\n` });
        },
      });
      pyodide.setStderr({
        batched: (text) => {
          if (currentRunId !== null) post("stderr", { id: currentRunId, text: `${text}\n` });
        },
      });
      post("status", { state: "ready" });
      return true;
    } catch (error) {
      post("fatal", {
        message:
          error?.message ||
          "Не удалось загрузить Python. Возможно, нет доступа к CDN или браузер слишком старый.",
      });
      throw error;
    }
  })();
  return initPromise;
}

async function prepareInputs(inputs) {
  const values = Array.isArray(inputs) ? inputs.map(String) : [];
  const payload = JSON.stringify(values);
  await pyodide.runPythonAsync(`
import builtins

_garden_inputs = ${payload}

def _garden_input(prompt=""):
    if _garden_inputs:
        value = _garden_inputs.pop(0)
        print(prompt + str(value))
        return str(value)
    raise EOFError("input(): ответы закончились")

builtins.input = _garden_input
`);
}

async function run({ id, code, inputs }) {
  await init();
  currentRunId = id;
  try {
    await prepareInputs(inputs);
    await pyodide.runPythonAsync(code);
    post("done", { id });
  } catch (error) {
    post("error", { id, message: error?.message || String(error) });
  } finally {
    currentRunId = null;
  }
}

self.onmessage = async (event) => {
  const data = event.data || {};
  if (data.type === "init") {
    init().catch(() => {
      /* fatal уже отправлен */
    });
    return;
  }
  if (data.type === "run") {
    try {
      await run(data);
    } catch (error) {
      post("error", { id: data.id, message: error?.message || String(error) });
    }
  }
};
