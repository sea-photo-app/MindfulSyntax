/**
 * Мини-подсветка Python без внешних библиотек.
 * Возвращает безопасный HTML: всё, что не является токеном, экранируется.
 */

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
  "match", "case",
]);

const BUILTINS = new Set([
  "print", "input", "len", "range", "int", "str", "float", "bool", "list",
  "dict", "set", "tuple", "type", "sum", "min", "max", "abs", "round",
  "enumerate", "zip", "sorted", "open", "reversed", "isinstance", "help",
  "random", "math", "append", "remove", "pop", "split", "join", "lower",
  "upper", "format", "keys", "values", "items",
]);

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function span(cls, text) {
  return `<span class="${cls}">${escapeHtml(text)}</span>`;
}

export function highlightPython(code) {
  const src = String(code);
  let out = "";
  let i = 0;
  let expectFunctionName = false;

  while (i < src.length) {
    const ch = src[i];

    // Комментарий до конца строки
    if (ch === "#") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      out += span("tok-com", src.slice(i, stop));
      i = stop;
      continue;
    }

    // Строки: обычные, тройные, с экранированием
    if (ch === '"' || ch === "'") {
      const quote = ch;
      const triple = src.slice(i, i + 3) === quote.repeat(3);
      const marker = triple ? quote.repeat(3) : quote;
      let j = i + marker.length;
      while (j < src.length) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src.startsWith(marker, j)) {
          j += marker.length;
          break;
        }
        j += 1;
      }
      out += span("tok-str", src.slice(i, Math.min(j, src.length)));
      i = Math.min(j, src.length);
      continue;
    }

    // Числа
    if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(src[i - 1] || "")) {
      let j = i;
      while (j < src.length && /[0-9._]/.test(src[j])) j += 1;
      out += span("tok-num", src.slice(i, j));
      i = j;
      continue;
    }

    // Имена: ключевые слова, встроенные функции, имена функций
    if (/[A-Za-zА-Яа-я_]/.test(ch)) {
      let j = i;
      while (j < src.length && /[A-Za-zА-Яа-я0-9_]/.test(src[j])) j += 1;
      const word = src.slice(i, j);

      let lookahead = j;
      while (lookahead < src.length && /[ \t]/.test(src[lookahead])) lookahead += 1;
      const isCall = src[lookahead] === "(";

      if (KEYWORDS.has(word)) {
        out += span("tok-kw", word);
        expectFunctionName = word === "def" || word === "class";
      } else if (expectFunctionName) {
        out += span("tok-fn", word);
        expectFunctionName = false;
      } else if (BUILTINS.has(word)) {
        out += span("tok-builtin", word);
      } else if (isCall) {
        out += span("tok-fn", word);
      } else {
        out += escapeHtml(word);
      }
      i = j;
      continue;
    }

    // Операторы и пунктуация
    if (/[+\-*/%=<>!&|^~:.,()[\]{}]/.test(ch)) {
      out += span("tok-op", ch);
      i += 1;
      continue;
    }

    out += escapeHtml(ch);
    i += 1;
  }

  return out;
}
