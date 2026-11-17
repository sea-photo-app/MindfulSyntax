/**
 * «Дневник ошибок»: переводим ошибки Python на человеческий.
 * Задача — не напугать, а объяснить, что случилось и куда смотреть.
 */

const RULES = [
  {
    match: /SyntaxError/i,
    name: "SyntaxError",
    friendly:
      "Python не понял, как записана строка. Чаще всего дело в кавычке, скобке или двоеточии: где-то открыли — и забыли закрыть.",
    tip: "Проверьте кавычки и скобки в строке, на которую указывает ошибка. Каждая открытая скобка должна закрыться.",
  },
  {
    match: /IndentationError|TabError/i,
    name: "IndentationError",
    friendly:
      "Строка стоит с неправильным отступом. В Python отступы — это не украшение, а часть смысла: они показывают, что лежит «внутри» условия или цикла.",
    tip: "Внутри if, for, while и def используйте одинаковые отступы — обычно 4 пробела.",
  },
  {
    match: /NameError/i,
    name: "NameError",
    friendly:
      "Python встретил незнакомое имя. Будто вы попросили коробку с надписью, а такой коробки ещё нет — или она названа чуть иначе.",
    tip: "Проверьте, что переменная создана раньше и написана точно так же: строчные и заглавные буквы важны.",
  },
  {
    match: /ModuleNotFoundError/i,
    name: "ModuleNotFoundError",
    friendly:
      "Python не нашёл библиотеку. Это как прийти в кладовую за инструментом, который ещё не принесли.",
    tip: "Библиотеку нужно установить: pip install имя_библиотеки. На этом сайте random и math уже доступны.",
  },
  {
    match: /ImportError/i,
    name: "ImportError",
    friendly:
      "Не получилось взять что-то из библиотеки. Возможно, название команды внутри неё написано иначе.",
    tip: "Проверьте, что импортируете существующее имя: from math import sqrt.",
  },
  {
    match: /ZeroDivisionError/i,
    name: "ZeroDivisionError",
    friendly:
      "Попытка разделить на ноль. Даже Python разводит руками: на ноль делить нельзя — ни в жизни, ни в коде.",
    tip: "Проверьте, что делитель не равен 0. Можно заранее добавить if.",
  },
  {
    match: /TypeError/i,
    name: "TypeError",
    friendly:
      "Python смешал вещи разных видов: например, попытался сложить число и строку. Это как приклеить ручку к воде.",
    tip: "Приведите значения к одному типу: int(input()) для чисел, str(...) для текста.",
  },
  {
    match: /ValueError/i,
    name: "ValueError",
    friendly:
      "Значение не подошло по смыслу. Например, int() получил текст «привет» и не смог превратить его в число.",
    tip: "Проверьте, что пользователь вводит цифры, если вы ждёте число.",
  },
  {
    match: /IndexError/i,
    name: "IndexError",
    friendly:
      "Вы попросили элемент за пределами списка. Как взять пятую чашку с полки, где стоят только три.",
    tip: "Помните: нумерация начинается с 0, а последний элемент — len(список) - 1.",
  },
  {
    match: /KeyError/i,
    name: "KeyError",
    friendly:
      "В словаре нет такого ярлыка. Вы ищете в картотеке карточку с названием, которого там нет.",
    tip: "Проверьте ключ или используйте .get(ключ, значение_по_умолчанию).",
  },
  {
    match: /AttributeError/i,
    name: "AttributeError",
    friendly:
      "У объекта нет такого свойства или умения. Например, у строки нет метода append — он есть у списка.",
    tip: "Проверьте тип значения: списки и строки умеют разные вещи.",
  },
  {
    match: /UnboundLocalError/i,
    name: "UnboundLocalError",
    friendly:
      "Переменная внутри функции ещё не получила значение, а вы уже пытаетесь её прочитать.",
    tip: "Сначала присвойте значение, потом используйте переменную.",
  },
  {
    match: /EOFError/i,
    name: "EOFError",
    friendly:
      "Программа ждала ввод, но ответы закончились. Функция input() осталась без ответа.",
    tip: "Для input() укажите ответы в поле «Ответы для input()» над кнопкой запуска.",
  },
];

const JS_RULES = [
  {
    match: /out of memory|RangeError/i,
    name: "RangeError",
    friendly:
      "Программа попросила слишком много памяти. Возможно, цикл создаёт бесконечно длинный список.",
    tip: "Ограничьте количество повторений и размер данных.",
  },
];

function firstMatch(list, raw) {
  return list.find((rule) => rule.match.test(raw || ""));
}

/**
 * @param {string} raw — stderr или текст ошибки
 * @returns {{name: string, friendly: string, tip: string, raw: string}}
 */
export function explainPythonError(raw) {
  const text = String(raw || "").trim();
  const rule = firstMatch(RULES, text);
  if (rule) {
    return {
      name: rule.name,
      friendly: rule.friendly,
      tip: rule.tip,
      raw: text,
    };
  }
  return {
    name: "Ошибка",
    friendly:
      "Программа остановилась с ошибкой. Это нормальная часть работы: ошибка подсказывает, где посмотреть.",
    tip: "Прочитайте последнюю строку сообщения — там обычно написано, чего не хватает.",
    raw: text,
  };
}

export function explainJsError(error) {
  const name = error?.name || "Error";
  const message = error?.message || String(error);
  const rule = firstMatch(JS_RULES, `${name} ${message}`);
  return {
    name,
    friendly:
      rule?.friendly ||
      "Что-то пошло не так в самом саду — не в вашем коде. Попробуйте ещё раз или обновите страницу.",
    tip: rule?.tip || "Если повторяется, откройте консоль браузера: там будет подробность.",
    raw: `${name}: ${message}`,
  };
}

/** Достаём номер строки из traceback, если он есть. */
export function extractLineNumber(raw) {
  const matches = [...String(raw || "").matchAll(/line (\d+)/g)];
  if (!matches.length) return null;
  return Number(matches[matches.length - 1][1]);
}

/** Короткое имя ошибки для дневника. */
export function errorName(raw) {
  const text = String(raw || "");
  const last = text.trim().split("\n").filter(Boolean).pop() || "";
  const match = last.match(/^([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception|Warning))/);
  if (match) return match[1];
  const anywhere = text.match(/([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception))/);
  return anywhere ? anywhere[1] : "Ошибка";
}

/** Правила для атласа ошибок в библиотеке. */
export const errorRules = RULES;
