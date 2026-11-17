/**
 * Песочница: редактор + запуск + понятное объяснение ошибок.
 */

import { CodeEditor } from "./editor.js";
import { runPython, onRunnerStatus, warmUp, getRunnerStatus } from "./runner.js?v=20261118-py";
import { explainPythonError, extractLineNumber, errorName } from "./errors.js";
import { addError, getState } from "./state.js";
import { icon, escapeHtml, copyText } from "./ui.js";
import { playDrop, playStone } from "./audio.js";

const STATUS_TEXT = {
  idle: "Python загрузится при запуске",
  loading: "Загружаю Python…",
  ready: "Python готов",
  demo: "Демо-режим",
};

function needsInputs(code) {
  return /\binput\s*\(/.test(code);
}

export function createSandbox(options = {}) {
  const initialCode = options.code || "";
  const wrap = document.createElement("div");
  wrap.className = "sandbox";
  wrap.innerHTML = `
    <div class="sandbox__bar">
      <span class="sandbox__title">${escapeHtml(options.title || "python")}</span>
      <div class="sandbox__bar-actions">
        <span class="runner-status" data-state="idle">Python не загружен</span>
        <button class="code-btn" type="button" data-sandbox-copy title="Скопировать код">${icon("copy")}<span>Копировать</span></button>
        <button class="code-btn" type="button" data-sandbox-reset title="Вернуть исходный код">${icon("reset")}</button>
      </div>
    </div>
    <div class="sandbox__editor"></div>
    <details class="input-values" hidden>
      <summary>Ответы для input()</summary>
      <div class="input-values__body">
        <textarea rows="3" spellcheck="false" aria-label="Ответы для input(), по одному на строку"></textarea>
        <p>Каждый ответ — с новой строки. Программа получит их по очереди.</p>
      </div>
    </details>
    <div class="sandbox__foot">
      <span class="sandbox__hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> — запустить</span>
      <button class="sandbox__run" type="button" data-sandbox-run>${icon("play")}<span>Запустить</span></button>
    </div>
    <div class="console" hidden aria-live="polite"></div>
  `;

  const editorHost = wrap.querySelector(".sandbox__editor");
  const details = wrap.querySelector(".input-values");
  const inputsField = details.querySelector("textarea");
  const runButton = wrap.querySelector("[data-sandbox-run]");
  const runLabel = runButton.querySelector("span");
  const consoleEl = wrap.querySelector(".console");
  const statusEl = wrap.querySelector(".runner-status");
  const copyButton = wrap.querySelector("[data-sandbox-copy]");
  const resetButton = wrap.querySelector("[data-sandbox-reset]");

  inputsField.value = (options.inputs || []).join("\n");

  let busy = false;
  let lastResult = null;

  const editor = new CodeEditor(editorHost, {
    value: initialCode,
    minHeight: options.minHeight || 150,
    onRun: () => run(),
    onChange: (value) => {
      details.hidden = !needsInputs(value);
      options.onChange?.(value);
    },
  });

  let disposed = false;
  let unsubscribeStatus = null;

  // Начальное состояние берём сразу, а на изменения подписываемся без
  // синхронного вызова — иначе элемент ещё не в документе.
  statusEl.dataset.state = getRunnerStatus();
  statusEl.textContent = STATUS_TEXT[getRunnerStatus()] || getRunnerStatus();
  unsubscribeStatus = onRunnerStatus((status) => {
    if (disposed) return;
    if (!statusEl.isConnected) {
      disposed = true;
      unsubscribeStatus?.();
      return;
    }
    statusEl.dataset.state = status;
    statusEl.textContent = STATUS_TEXT[status] || status;
  });

  details.hidden = !needsInputs(initialCode);
  if ((options.inputs || []).length && needsInputs(initialCode)) {
    details.open = true;
  }

  // Начинаем прогрев сразу, пока читатель листает теорию.
  if (options.warm !== false) {
    const scheduleWarm = () => warmUp();
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(scheduleWarm, { timeout: 1800 });
    } else {
      window.setTimeout(scheduleWarm, 700);
    }
  }

  function readInputs() {
    return inputsField.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  function setBusy(value) {
    busy = value;
    runButton.disabled = value;
    runLabel.textContent = value ? "Выполняю…" : "Запустить";
  }

  function showConsole(contents, { isError = false, note = "" } = {}) {
    consoleEl.hidden = false;
    consoleEl.innerHTML = "";

    if (note) {
      const noteEl = document.createElement("div");
      noteEl.className = "console__line--muted";
      noteEl.textContent = note;
      consoleEl.appendChild(noteEl);
    }

    if (contents) {
      const text = document.createElement("span");
      text.textContent = contents;
      consoleEl.appendChild(text);
    }

    if (!contents && !note && !isError) {
      const empty = document.createElement("span");
      empty.className = "console__line--muted";
      empty.textContent = "(программа завершилась без вывода)";
      consoleEl.appendChild(empty);
    }
  }

  function showError(errorInfo, stdout, mode) {
    const friendly = explainPythonError(errorInfo.raw || errorInfo.message || "");
    const line = extractLineNumber(errorInfo.raw || "");
    const isTimeout = errorInfo.name === "TimeoutError";
    const displayName = isTimeout
      ? "TimeoutError"
      : errorInfo.name && !["Python", "Ошибка"].includes(errorInfo.name)
        ? errorInfo.name
        : errorName(errorInfo.raw || errorInfo.message || friendly.name);

    const box = document.createElement("div");
    box.className = "console-error";
    box.innerHTML = `
      <strong class="console-error__name">${escapeHtml(displayName)}</strong>
      <p class="console-error__friendly">${escapeHtml(isTimeout ? errorInfo.message : friendly.friendly)}</p>
      ${
        isTimeout
          ? ""
          : `<p class="console-error__tip"><b>Подсказка:</b> ${escapeHtml(friendly.tip)}</p>`
      }
      ${line ? `<p class="console-error__line">Строка ${line}</p>` : ""}
      ${
        friendly.raw
          ? `<details class="console-error__details"><summary>Полное сообщение Python</summary><pre>${escapeHtml(
              friendly.raw,
            )}</pre></details>`
          : ""
      }
    `;

    if (stdout) {
      const out = document.createElement("span");
      out.textContent = stdout;
      consoleEl.insertBefore(out, consoleEl.firstChild);
    }
    consoleEl.appendChild(box);
    consoleEl.scrollTop = consoleEl.scrollHeight;

    if (mode !== "demo" && errorInfo.name !== "TimeoutError" && options.lessonId) {
      addError({
        name: displayName,
        friendly: friendly.friendly,
        tip: friendly.tip,
        raw: friendly.raw,
        code: editor.value.slice(0, 4000),
        lessonId: options.lessonId,
        lessonTitle: options.lessonTitle || getState().lastLesson || "",
        line,
      });
    }
    if (getState().sound) playStone();
  }

  async function run() {
    if (busy) return lastResult;
    if (options.warm !== false) warmUp();
    setBusy(true);
    consoleEl.hidden = false;
    consoleEl.innerHTML = `<span class="console__line--muted">Выполняю…</span>`;

    const code = editor.value;
    try {
      const result = await runPython(code, { inputs: readInputs() });
      lastResult = result;

      if (result.error) {
        consoleEl.innerHTML = "";
        if (result.mode === "demo" && result.error.demoLimit) {
          showConsole("", {
            note:
              result.fallbackReason ||
              "Включён демо-режим: он понимает только простые команды без условий и циклов.",
          });
        }
        showError(result.error, result.stdout, result.mode);
      } else {
        const note =
          result.mode === "demo"
            ? "Демо-режим (без настоящего Python): простые команды выполнены."
            : "";
        showConsole(result.stdout, { note });
        if (getState().sound) playDrop();
      }

      options.onResult?.({
        code,
        result,
        mode: result.mode,
      });
      return result;
    } catch (error) {
      console.error(error);
      showConsole("", { note: "Не удалось запустить программу. Попробуйте ещё раз." });
      return null;
    } finally {
      setBusy(false);
    }
  }

  runButton.addEventListener("click", run);

  copyButton.addEventListener("click", () => {
    copyText(editor.value, copyButton);
  });

  resetButton.addEventListener("click", () => {
    editor.value = initialCode;
    details.hidden = !needsInputs(initialCode);
    consoleEl.hidden = true;
    lastResult = null;
    options.onChange?.(editor.value);
  });

  return {
    element: wrap,
    editor,
    run,
    getCode: () => editor.value,
    setCode: (value) => {
      editor.value = value;
      details.hidden = !needsInputs(value);
    },
    focus: () => editor.focus(),
    getResult: () => lastResult,
    destroy: () => {
      disposed = true;
      unsubscribeStatus?.();
    },
  };
}
