/**
 * Демо-режим на случай, если Pyodide не загрузился (нет интернета, старый браузер).
 * Понимает только самое начало курса: print, переменные, числа, строки,
 * простую арифметику, f-строки и input. Об этом честно сообщается в интерфейсе.
 */

class DemoError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

function decodeString(raw) {
  return raw.replace(/\\(n|t|\\|"|'|r)/g, (_, ch) => {
    if (ch === "n") return "\n";
    if (ch === "t") return "\t";
    if (ch === "r") return "\r";
    return ch;
  });
}

function tokenize(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];

    if (ch === "#") break;
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    // f-строка
    if ((ch === "f" || ch === "F") && (source[i + 1] === '"' || source[i + 1] === "'")) {
      const quote = source[i + 1];
      let j = i + 2;
      let value = "";
      while (j < source.length && source[j] !== quote) {
        if (source[j] === "\\") {
          value += source[j] + (source[j + 1] || "");
          j += 2;
          continue;
        }
        value += source[j];
        j += 1;
      }
      tokens.push({ type: "fstring", value });
      i = j + 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      let value = "";
      while (j < source.length && source[j] !== quote) {
        if (source[j] === "\\") {
          value += source[j] + (source[j + 1] || "");
          j += 2;
          continue;
        }
        value += source[j];
        j += 1;
      }
      tokens.push({ type: "string", value: decodeString(value) });
      i = j + 1;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < source.length && /[0-9._]/.test(source[j])) j += 1;
      const raw = source.slice(i, j).replaceAll("_", "");
      tokens.push({ type: "number", value: Number(raw) });
      i = j;
      continue;
    }

    if (/[A-Za-zА-Яа-я_]/.test(ch)) {
      let j = i;
      while (j < source.length && /[A-Za-zА-Яа-я0-9_]/.test(source[j])) j += 1;
      tokens.push({ type: "name", value: source.slice(i, j) });
      i = j;
      continue;
    }

    const three = source.slice(i, i + 3);
    if (three === "===" || three === "!==") {
      tokens.push({ type: "op", value: three.slice(0, 2) });
      i += 3;
      continue;
    }

    const two = source.slice(i, i + 2);
    if (["**", "//", "==", "!=", "<=", ">="].includes(two)) {
      tokens.push({ type: "op", value: two });
      i += 2;
      continue;
    }

    if ("+-*/%()[],.<>=".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i += 1;
      continue;
    }

    throw new DemoError("SyntaxError", `Демо-режим не понял символ «${ch}».`);
  }
  return tokens;
}

class Parser {
  constructor(tokens, ctx) {
    this.tokens = tokens;
    this.pos = 0;
    this.ctx = ctx;
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset];
  }

  next() {
    return this.tokens[this.pos++];
  }

  isOp(value, offset = 0) {
    const token = this.peek(offset);
    return token && token.type === "op" && token.value === value;
  }

  expectOp(value) {
    if (!this.isOp(value)) {
      throw new DemoError("SyntaxError", `Ожидался символ «${value}».`);
    }
    return this.next();
  }

  atEnd() {
    return this.pos >= this.tokens.length;
  }

  parseProgram() {
    const values = [];
    while (!this.atEnd()) {
      values.push(this.parseExpression());
      if (this.isOp(",")) {
        this.next();
        continue;
      }
      break;
    }
    return values;
  }

  parseExpression() {
    return this.parseComparison();
  }

  parseComparison() {
    let left = this.parseAdd();
    while (this.peek()?.type === "op" && ["==", "!=", "<", ">", "<=", ">="].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseAdd();
      if (op === "==") left = left === right;
      else if (op === "!=") left = left !== right;
      else if (op === "<") left = left < right;
      else if (op === ">") left = left > right;
      else if (op === "<=") left = left <= right;
      else left = left >= right;
    }
    return left;
  }

  parseAdd() {
    let left = this.parseMul();
    while (this.isOp("+") || this.isOp("-")) {
      const op = this.next().value;
      const right = this.parseMul();
      if (op === "+") {
        if (typeof left === "number" && typeof right === "number") left += right;
        else if (typeof left === "string" && typeof right === "string") left += right;
        else if (Array.isArray(left) && Array.isArray(right)) left = [...left, ...right];
        else throw new DemoError("TypeError", "Нельзя сложить значения разных типов.");
      } else {
        if (typeof left !== "number" || typeof right !== "number") {
          throw new DemoError("TypeError", "Вычитание работает только с числами.");
        }
        left -= right;
      }
    }
    return left;
  }

  parseMul() {
    let left = this.parseUnary();
    while (this.isOp("*") || this.isOp("/") || this.isOp("//") || this.isOp("%")) {
      const op = this.next().value;
      const right = this.parseUnary();
      if (op === "*") {
        if (typeof left === "string" && typeof right === "number") left = left.repeat(right);
        else if (typeof left !== "number" || typeof right !== "number") {
          throw new DemoError("TypeError", "Умножение работает с числами (или строкой и числом).");
        } else left *= right;
      } else {
        if (typeof left !== "number" || typeof right !== "number") {
          throw new DemoError("TypeError", "Деление работает только с числами.");
        }
        if (right === 0) throw new DemoError("ZeroDivisionError", "Деление на ноль невозможно.");
        if (op === "/") left /= right;
        if (op === "//") left = Math.floor(left / right);
        if (op === "%") left %= right;
      }
    }
    return left;
  }

  parseUnary() {
    if (this.isOp("-")) {
      this.next();
      return -this.parseUnary();
    }
    if (this.isOp("+")) {
      this.next();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  parsePower() {
    const base = this.parsePostfix();
    if (this.isOp("**")) {
      this.next();
      return base ** this.parseUnary();
    }
    return base;
  }

  parsePostfix() {
    let value = this.parsePrimary();

    while (this.isOp(".")) {
      this.next();
      const nameToken = this.next();
      if (!nameToken || nameToken.type !== "name") {
        throw new DemoError("SyntaxError", "После точки ожидалось имя метода.");
      }
      const method = nameToken.value;
      let args = [];
      if (this.isOp("(")) {
        this.next();
        args = this.parseArgs();
        this.expectOp(")");
      }
      value = this.callMethod(value, method, args);
    }

    if (this.isOp("[")) {
      this.next();
      const index = this.parseExpression();
      this.expectOp("]");
      if (!Array.isArray(value) && typeof value !== "string") {
        throw new DemoError("TypeError", "Индексы работают со списками и строками.");
      }
      const normalized = index < 0 ? value.length + index : index;
      if (normalized < 0 || normalized >= value.length) {
        throw new DemoError("IndexError", "Элемента с таким номером нет.");
      }
      value = value[normalized];
    }

    return value;
  }

  parseArgs() {
    const args = [];
    if (this.isOp(")")) return args;
    while (!this.atEnd()) {
      args.push(this.parseExpression());
      if (this.isOp(",")) {
        this.next();
        continue;
      }
      break;
    }
    return args;
  }

  parsePrimary() {
    const token = this.peek();
    if (!token) throw new DemoError("SyntaxError", "Выражение закончилось слишком рано.");

    if (token.type === "number" || token.type === "string") {
      this.next();
      return token.value;
    }

    if (token.type === "fstring") {
      this.next();
      return this.evaluateFString(token.value);
    }

    if (token.type === "name") {
      this.next();
      if (token.value === "True") return true;
      if (token.value === "False") return false;
      if (token.value === "None") return null;

      if (this.isOp("(")) {
        this.next();
        const args = this.parseArgs();
        this.expectOp(")");
        return this.callFunction(token.value, args);
      }
      if (!this.ctx.vars.has(token.value)) {
        throw new DemoError("NameError", `Имя «${token.value}» не определено.`);
      }
      return this.ctx.vars.get(token.value);
    }

    if (token.type === "op" && token.value === "(") {
      this.next();
      const value = this.parseExpression();
      this.expectOp(")");
      return value;
    }

    if (token.type === "op" && token.value === "[") {
      this.next();
      const items = this.parseArgs();
      this.expectOp("]");
      return items;
    }

    throw new DemoError("SyntaxError", "Демо-режим не понял выражение.");
  }

  evaluateFString(raw) {
    return raw.replace(/\{\{|\}\}|\{([^{}]+)\}/g, (match, expression) => {
      if (match === "{{") return "{";
      if (match === "}}") return "}";
      if (!expression) return "";
      const tokens = tokenize(expression);
      const parser = new Parser(tokens, this.ctx);
      const value = parser.parseExpression();
      return formatValue(value);
    });
  }

  callFunction(name, args) {
    switch (name) {
      case "input": {
        const prompt = args.length ? formatValue(args[0]) : "";
        const value = this.ctx.inputs.shift();
        if (value === undefined) {
          throw new DemoError(
            "EOFError",
            "input() ждёт ответ, но ответы закончились. Укажите их в поле «Ответы для input()».",
          );
        }
        this.ctx.write(prompt + value);
        return String(value);
      }
      case "print": {
        this.ctx.write(args.map((value) => formatValue(value)).join(" "));
        return null;
      }
      case "str":
        return args.length ? formatValue(args[0]) : "";
      case "int": {
        const value = Number.parseInt(args[0], 10);
        if (Number.isNaN(value)) {
          throw new DemoError("ValueError", "int() не смог превратить это в число.");
        }
        return value;
      }
      case "float": {
        const value = Number.parseFloat(args[0]);
        if (Number.isNaN(value)) {
          throw new DemoError("ValueError", "float() не смог превратить это в число.");
        }
        return value;
      }
      case "len":
        return args[0]?.length ?? 0;
      case "sum":
        return (args[0] || []).reduce((a, b) => a + b, 0);
      case "abs":
        return Math.abs(args[0]);
      case "round":
        return args.length > 1 ? Number(args[0].toFixed(args[1])) : Math.round(args[0]);
      case "bool":
        return Boolean(args[0]);
      case "range":
        return Array.from({ length: Math.max(0, Number(args[0])) }, (_, index) => index);
      default:
        throw new DemoError(
          "NameError",
          `Демо-режим не знает функцию «${name}». Для полного Python нужен интернет — включите Pyodide.`,
        );
    }
  }

  callMethod(target, method, args) {
    if (Array.isArray(target)) {
      if (method === "append") {
        target.push(args[0]);
        return null;
      }
      if (method === "remove") {
        const index = target.indexOf(args[0]);
        if (index === -1) throw new DemoError("ValueError", "Такого элемента в списке нет.");
        target.splice(index, 1);
        return null;
      }
      if (method === "pop") {
        return args.length ? target.splice(args[0], 1)[0] : target.pop();
      }
      if (method === "sort") {
        target.sort();
        return null;
      }
    }
    if (typeof target === "string") {
      if (method === "upper") return target.toUpperCase();
      if (method === "lower") return target.toLowerCase();
      if (method === "strip") return target.trim();
      if (method === "title") return target.replace(/\b\w/g, (c) => c.toUpperCase());
    }
    throw new DemoError(
      "AttributeError",
      `У этого значения нет метода «${method}». Демо-режим умеет не всё.`,
    );
  }
}

function formatValue(value) {
  if (value === null || value === undefined) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "string") return value;
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => (typeof item === "string" ? `'${item}'` : formatValue(item))).join(", ")}]`;
  }
  return String(value);
}

export function virtualRun(code, inputs = []) {
  const lines = String(code).split("\n");
  const ctx = {
    vars: new Map(),
    inputs: [...inputs.map(String)],
    write(text) {
      this.output.push(text);
    },
    output: [],
  };

  try {
    for (const rawLine of lines) {
      const line = rawLine.replace(/\s+$/, "");
      if (!line.trim() || line.trim().startsWith("#")) continue;

      if (/^[\t ]+\S/.test(line)) {
        throw new DemoError(
          "DemoLimit",
          "Демо-режим не умеет блоки с отступами (if, for, while, def). Для них нужен настоящий Python.",
        );
      }

      if (/^(if|elif|else|for|while|def|class|try|except|with|import|from)\b/.test(line.trim())) {
        throw new DemoError(
          "DemoLimit",
          "Демо-режим понимает только print, переменные, строки, числа и input. Для условий и циклов нужен настоящий Python.",
        );
      }

      const tokens = tokenize(line);
      if (!tokens.length) continue;
      const parser = new Parser(tokens, ctx);

      // Присваивание: имя = выражение
      if (tokens[0].type === "name" && tokens[1]?.type === "op" && tokens[1].value === "=") {
        const name = tokens[0].value;
        parser.pos = 2;
        const value = parser.parseExpression();
        if (!parser.atEnd()) throw new DemoError("SyntaxError", "Лишние символы после выражения.");
        ctx.vars.set(name, value);
        continue;
      }

      // print(...) как отдельный оператор
      if (tokens[0].type === "name" && tokens[0].value === "print" && tokens[1]?.value === "(") {
        parser.pos = 2;
        const args = parser.parseArgs();
        parser.expectOp(")");
        if (!parser.atEnd()) throw new DemoError("SyntaxError", "Лишние символы после print().");
        ctx.write(args.map((value) => formatValue(value)).join(" "));
        continue;
      }

      // Одиночное выражение — вычисляем, но не выводим (как в Python)
      parser.parseExpression();
    }

    return {
      mode: "demo",
      stdout: ctx.output.join("\n") + (ctx.output.length ? "\n" : ""),
      stderr: "",
      error: null,
    };
  } catch (error) {
    const name = error.name || "Ошибка";
    const friendly =
      name === "DemoLimit"
        ? "Демо-режим не выполняет эту программу: в ней есть условия, циклы или функции."
        : `${error.message}`;
    return {
      mode: "demo",
      stdout: ctx.output.join("\n") + (ctx.output.length ? "\n" : ""),
      stderr: `${name}: ${friendly}`,
      error: {
        name: name === "DemoLimit" ? "Демо-режим" : name,
        message: friendly,
        raw: `${name}: ${error.message}`,
        demoLimit: name === "DemoLimit",
      },
    };
  }
}
