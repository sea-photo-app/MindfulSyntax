/**
 * Лёгкий редактор Python: textarea + подсвеченный слой.
 * Без CodeMirror и Monaco — чтобы сайт оставался быстрым и понятным.
 */

import { highlightPython } from "./syntax.js";

export class CodeEditor {
  constructor(host, options = {}) {
    this.host = host;
    this.minHeight = options.minHeight || 150;
    this.onRun = options.onRun || null;
    this.onChange = options.onChange || null;

    host.classList.add("editor");
    host.innerHTML = `
      <div class="editor__gutter" aria-hidden="true"></div>
      <div class="editor__area">
        <pre class="editor__highlight" aria-hidden="true"><code></code></pre>
        <textarea class="editor__input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="${options.ariaLabel || "Редактор кода Python"}"></textarea>
      </div>
    `;

    this.gutter = host.querySelector(".editor__gutter");
    this.area = host.querySelector(".editor__area");
    this.pre = host.querySelector(".editor__highlight");
    this.code = this.pre.querySelector("code");
    this.input = host.querySelector(".editor__input");

    this.input.value = options.value || "";
    this.input.wrap = "off";

    this._onInput = () => this.refresh();
    this._onScroll = () => {
      this.pre.scrollLeft = this.input.scrollLeft;
      this.pre.scrollTop = this.input.scrollTop;
    };
    this._onFocus = () => host.classList.add("is-focused");
    this._onBlur = () => host.classList.remove("is-focused");
    this._onKeyDown = (event) => this.handleKeyDown(event);

    this.input.addEventListener("input", this._onInput);
    this.input.addEventListener("scroll", this._onScroll);
    this.input.addEventListener("focus", this._onFocus);
    this.input.addEventListener("blur", this._onBlur);
    this.input.addEventListener("keydown", this._onKeyDown);

    this.refresh();
  }

  get value() {
    return this.input.value;
  }

  set value(next) {
    this.input.value = next;
    this.refresh();
  }

  get lineCount() {
    return Math.max(1, this.input.value.split("\n").length);
  }

  lineHeight() {
    const value = Number.parseFloat(getComputedStyle(this.input).lineHeight);
    return Number.isFinite(value) ? value : 23;
  }

  refresh() {
    const value = this.input.value;
    this.code.innerHTML = highlightPython(value) + "\n";
    const lines = value.split("\n").length;
    const gutterLines = Math.max(lines, Math.floor(this.minHeight / this.lineHeight()));
    this.gutter.innerHTML = Array.from({ length: gutterLines }, (_, index) => index + 1).join("<br>");

    const height = Math.max(this.minHeight, lines * this.lineHeight() + 30);
    this.input.style.height = `${height}px`;
    this.pre.style.height = `${height}px`;

    this.onChange?.(value);
  }

  handleKeyDown(event) {
    const { input } = this;

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      this.onRun?.();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const value = input.value;

      if (event.shiftKey) {
        const before = value.slice(0, start);
        const lineStart = before.lastIndexOf("\n") + 1;
        const segment = value.slice(lineStart, start);
        const remove = Math.min(4, (segment.match(/ +$/) || [""])[0].length);
        if (remove > 0) {
          input.setRangeText("", start - remove, start, "end");
        }
      } else {
        input.setRangeText("    ", start, end, "end");
      }
      this.refresh();
      return;
    }

    if (event.key === "Enter") {
      const start = input.selectionStart;
      const value = input.value;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const indentMatch = currentLine.match(/^[ \t]*/);
      let indent = indentMatch ? indentMatch[0] : "";
      if (currentLine.trimEnd().endsWith(":")) indent += "    ";
      if (indent) {
        event.preventDefault();
        input.setRangeText(`\n${indent}`, input.selectionStart, input.selectionEnd, "end");
        this.refresh();
      }
    }
  }

  focus() {
    this.input.focus();
  }

  destroy() {
    this.input.removeEventListener("input", this._onInput);
    this.input.removeEventListener("scroll", this._onScroll);
    this.input.removeEventListener("focus", this._onFocus);
    this.input.removeEventListener("blur", this._onBlur);
    this.input.removeEventListener("keydown", this._onKeyDown);
  }
}
