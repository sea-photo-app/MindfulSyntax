/**
 * Запуск Python: настоящий Pyodide в Web Worker, а если он недоступен —
 * честный демо-режим для простых примеров.
 */

import { virtualRun } from "./virtual-run.js";

const RUN_TIMEOUT = 15000;
const INIT_TIMEOUT = 40000;

const statusListeners = new Set();
let status = "idle";
let worker = null;
let readyPromise = null;
let runSeq = 0;
let pending = null;
let warmStarted = false;

export function onRunnerStatus(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

export function getRunnerStatus() {
  return status;
}

function setStatus(next) {
  if (status === next) return;
  status = next;
  statusListeners.forEach((fn) => fn(status));
}

function teardownWorker() {
  if (worker) {
    try {
      worker.terminate();
    } catch {
      /* noop */
    }
  }
  worker = null;
  readyPromise = null;
}

function fallback(code, inputs, reason) {
  const result = virtualRun(code, inputs);
  if (reason) {
    result.fallbackReason = reason;
  }
  setStatus("demo");
  return result;
}

function shouldUseDemo() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  if (typeof Worker === "undefined") return true;
  return false;
}

function createWorker() {
  try {
    return new Worker(new URL("./pyodide-worker.js", import.meta.url), { type: "module" });
  } catch (error) {
    console.warn("Не удалось создать воркер Python", error);
    return null;
  }
}

function ensureWorker() {
  if (status === "demo") return Promise.reject(new Error("demo"));
  if (readyPromise) return readyPromise;

  const instance = createWorker();
  if (!instance) {
    setStatus("demo");
    return Promise.reject(new Error("worker"));
  }
  worker = instance;

  readyPromise = new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      teardownWorker();
      setStatus("demo");
      reject(new Error("timeout"));
    }, INIT_TIMEOUT);

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    instance.onmessage = (event) => {
      const message = event.data || {};
      if (message.type === "status" && message.state === "loading") {
        setStatus("loading");
        return;
      }
      if (message.type === "status" && message.state === "ready") {
        setStatus("ready");
        finish(resolve, true);
        return;
      }
      if (message.type === "fatal") {
        setStatus("demo");
        finish(reject, new Error(message.message || "fatal"));
        return;
      }
      handleRunMessage(message);
    };

    instance.onerror = (event) => {
      setStatus("demo");
      finish(reject, new Error(event.message || "worker error"));
    };

    instance.postMessage({ type: "init" });
  });

  readyPromise.catch(() => {
    teardownWorker();
  });

  return readyPromise;
}

function handleRunMessage(message) {
  if (message.type === "status") return;
  if (!pending || message.id !== pending.id) return;

  if (message.type === "stdout") {
    pending.stdout += message.text;
    pending.onStdout?.(pending.stdout, pending.stderr);
    return;
  }
  if (message.type === "stderr") {
    pending.stderr += message.text;
    pending.onStderr?.(pending.stdout, pending.stderr);
    return;
  }
  if (message.type === "done" || message.type === "error") {
    clearTimeout(pending.timer);
    const result = {
      mode: "pyodide",
      stdout: pending.stdout,
      stderr: pending.stderr,
      error: null,
      duration: Date.now() - pending.startedAt,
    };
    if (message.type === "error") {
      result.error = {
        name: "Python",
        message: message.message || "Ошибка выполнения",
        raw: message.message || "",
      };
      result.stderr = result.stderr || message.message || "";
    }
    const resolve = pending.resolve;
    pending = null;
    resolve(result);
  }
}

/**
 * Запустить код.
 * @param {string} code
 * @param {{inputs?: string[], onStdout?: Function, onStderr?: Function, timeout?: number}} options
 * @returns {Promise<{mode: string, stdout: string, stderr: string, error: null|object, fallbackReason?: string}>}
 */
export async function runPython(code, options = {}) {
  const inputs = options.inputs || [];

  if (status === "demo" || shouldUseDemo()) {
    const result = virtualRun(code, inputs);
    setStatus("demo");
    return result;
  }

  try {
    await ensureWorker();
  } catch (error) {
    const reason =
      error?.message === "timeout"
        ? "Python не успел загрузиться — возможно, медленная сеть."
        : "Не удалось загрузить Python из интернета.";
    return fallback(code, inputs, reason);
  }

  if (status === "demo" || !worker) {
    return fallback(code, inputs, "Python недоступен — включён демо-режим.");
  }

  if (pending) {
    return {
      mode: "pyodide",
      stdout: "",
      stderr: "",
      error: {
        name: "Busy",
        message: "Предыдущая программа ещё выполняется. Подождите немного.",
        raw: "Busy",
      },
    };
  }

  return new Promise((resolve) => {
    const id = ++runSeq;
    const timer = setTimeout(() => {
      if (!pending || pending.id !== id) return;
      const stdout = pending.stdout;
      const stderr = pending.stderr;
      pending = null;
      teardownWorker();
      setStatus("idle");
      warmStarted = false;
      resolve({
        mode: "pyodide",
        stdout,
        stderr,
        error: {
          name: "TimeoutError",
          message:
            "Программа работала дольше 15 секунд и была остановлена. Похоже, цикл никогда не заканчивается. Проверьте условие выхода.",
          raw: "TimeoutError: выполнение остановлено",
        },
        duration: RUN_TIMEOUT,
      });
    }, options.timeout || RUN_TIMEOUT);

    pending = {
      id,
      stdout: "",
      stderr: "",
      resolve,
      timer,
      startedAt: Date.now(),
      onStdout: options.onStdout,
      onStderr: options.onStderr,
    };

    worker.postMessage({ type: "run", id, code, inputs });
  });
}

/** Заранее прогреваем Python, пока читатель листает теорию. */
export function warmUp() {
  if (warmStarted || status === "ready" || status === "demo") return;
  const connection = navigator.connection;
  if (connection?.saveData) return;
  if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;
  warmStarted = true;
  const start = () => {
    ensureWorker().catch(() => {
      /* демо-режим включится сам */
    });
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 2500 });
  } else {
    setTimeout(start, 1500);
  }
}
