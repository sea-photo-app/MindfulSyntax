/**
 * Собирает js/data/library/errors-atlas.js.
 * Для каждой записи код запускается в Pyodide: реальный тип и сообщение ошибки
 * подставляются автоматически, а если тип не совпал с заявленным — сборка падает.
 * Запуск: node tools/build-atlas.mjs
 */
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { loadPyodide } = await import(pathToFileURL(path.join(root, "vendor/pyodide/pyodide.mjs")).href);
const py = await loadPyodide({ indexURL: path.join(root, "vendor/pyodide") });
py.runPython(`
import json
def _probe(code):
    try:
        exec(compile(code, "<atlas>", "exec"), {"__name__": "__main__"})
    except BaseException as e:
        return json.dumps({"name": type(e).__name__, "msg": str(e)})
    return json.dumps({"name": None, "msg": ""})
`);

// name — тип ошибки; title — как называем по-человечески; why / fix — простым языком.
const SRC = [
  { name: "SyntaxError", title: "Не закрыта кавычка", code: 'print("Привет)', why: "Python открыл текст кавычкой и не нашёл, где он заканчивается.", fix: "Добавьте закрывающую кавычку того же вида: print(\"Привет\").", lesson: "m1-l3" },
  { name: "SyntaxError", title: "Не закрыта скобка", code: 'print("Привет"', why: "Открывающая скобка ждёт пару. Без неё Python не понимает, где команда кончилась.", fix: "Поставьте закрывающую скобку: print(\"Привет\").", lesson: "m1-l3" },
  { name: "SyntaxError", title: "Забыто двоеточие", code: 'if 5 > 3\n    print("да")', why: "После условия (if, elif, else, for, while, def) нужно двоеточие: оно говорит «дальше идёт блок».", fix: "Допишите двоеточие в конце строки: if 5 > 3:", lesson: "m3-l1" },
  { name: "SyntaxError", title: "Один знак равно в условии", code: "if 5 = 5:\n    print(1)", why: "Один = кладёт значение в переменную. Для сравнения нужно два знака ==.", fix: "Замените на сравнение: if 5 == 5:", lesson: "m3-l4" },
  { name: "SyntaxError", title: "print без скобок", code: 'print "Привет"', why: "В Python 3 print — это команда-функция, ей нужны скобки.", fix: "Напишите print(\"Привет\").", lesson: "m1-l3" },
  { name: "IndentationError", title: "Нет отступа после двоеточия", code: 'if True:\nprint("да")', why: "Всё, что относится к if, должно быть сдвинуто вправо: отступ показывает, что лежит «внутри».", fix: "Сдвиньте строку на 4 пробела.", lesson: "m3-l1" },
  { name: "IndentationError", title: "Лишний отступ", code: 'print("a")\n    print("b")', why: "Отступ появляется только внутри блока. Здесь блока нет, а строка сдвинута.", fix: "Уберите лишние пробелы в начале строки.", lesson: "m3-l1" },
  { name: "IndentationError", title: "Отступы не совпадают", code: 'if True:\n        print("a")\n    print("b")', why: "Внутри одного блока все строки должны быть сдвинуты одинаково.", fix: "Используйте одинаковый отступ (4 пробела) для всех строк блока.", lesson: "m3-l1" },
  { name: "NameError", title: "Опечатка в имени переменной", code: 'name = "Аня"\nprint(naem)', why: "Python не знает такой коробки: имя написано иначе, чем при создании.", fix: "Сверьте имя буква в букву: print(name).", lesson: "m2-l1" },
  { name: "NameError", title: "Текст без кавычек", code: "print(Привет)", why: "Без кавычек Python решает, что Привет — это имя переменной.", fix: "Возьмите текст в кавычки: print(\"Привет\").", lesson: "m1-l2" },
  { name: "NameError", title: "Функция вызвана до объявления", code: 'hello()\ndef hello():\n    print("hi")', why: "Python читает файл сверху вниз. На момент вызова слова hello он ещё не встречал.", fix: "Поставьте def выше, а вызов — ниже.", lesson: "m6-l4" },
  { name: "NameError", title: "Опечатка в команде", code: 'pritn("x")', why: "pritn — не команда Python. Он ищет такое имя и не находит.", fix: "Проверьте написание: print.", lesson: "m1-l3" },
  { name: "TypeError", title: "Склейка текста и числа", code: 'print("Возраст: " + 12)', why: "Плюс не знает, как приклеить число к тексту: это разные типы.", fix: "Превратите число в текст: str(12), или используйте f-строку: f\"Возраст: {12}\".", lesson: "m2-l5" },
  { name: "TypeError", title: "Сложение числа и строки", code: 'print(5 + "5")', why: "Число и строка — разные виды данных, складывать их напрямую нельзя.", fix: "Приведите к одному типу: 5 + int(\"5\") или str(5) + \"5\".", lesson: "m2-l5" },
  { name: "TypeError", title: "Сравнение числа и текста", code: 'print(5 < "7")', why: "Больше и меньше работают для чисел с числами и текстов с текстами.", fix: "Преобразуйте одно из значений: int(\"7\").", lesson: "m3-l4" },
  { name: "TypeError", title: "Длина у числа", code: "print(len(5))", why: "len() считает элементы в тексте или списке. У числа 5 нет элементов.", fix: "Передайте строку или список: len(\"5\").", lesson: "m5-l5" },
  { name: "TypeError", title: "Не хватает аргумента", code: "def add(a, b):\n    return a + b\nadd(1)", why: "Функция ждёт два значения, а получила одно.", fix: "Передайте все аргументы: add(1, 2).", lesson: "m6-l5" },
  { name: "TypeError", title: "Лишний аргумент", code: "def show(a):\n    return a\nshow(1, 2)", why: "Функция принимает одно значение, а вы дали два.", fix: "Уберите лишний аргумент или добавьте параметр в def.", lesson: "m6-l5" },
  { name: "TypeError", title: "Имя команды занято переменной", code: 'print = "x"\nprint("a")', why: "Вы положили в имя print текст, и теперь оно уже не команда, а строка.", fix: "Не называйте переменные так же, как команды Python: print, len, sum.", lesson: "m6-l6" },
  { name: "TypeError", title: "Индекс списка — не число", code: 'a = [1, 2]\nprint(a["0"])', why: "Номера в списке — целые числа, а не строки.", fix: "Используйте число: a[0].", lesson: "m5-l1" },
  { name: "TypeError", title: "Число нельзя перебирать", code: "for i in 5:\n    print(i)", why: "Цикл for ждёт набор значений. Число 5 — одно значение, а не набор.", fix: "Используйте range: for i in range(5):", lesson: "m4-l1" },
  { name: "ValueError", title: "Текст нельзя превратить в число", code: 'int("Аня")', why: "В тексте нет цифр, из которых получилось бы число.", fix: "Перед int() убедитесь, что вводятся цифры, или перехватите ошибку через try.", lesson: "m2-l3" },
  { name: "ValueError", title: "Дробное число не из цифр", code: 'float("abc")', why: "float() умеет читать только запись числа: 3.14, 2, -0.5.", fix: "Проверьте ввод до преобразования.", lesson: "m2-l3" },
  { name: "ValueError", title: "Слишком мало значений для распаковки", code: "a, b = [1]", why: "Слева две коробки, а справа только одно значение.", fix: "Сделайте количество значений равным количеству имён.", lesson: "m5-l6" },
  { name: "ValueError", title: "Нет такого значения в списке", code: "[1, 2].remove(3)", why: "remove ищет значение, а числа 3 в списке нет.", fix: "Проверьте условием: if 3 in a: a.remove(3).", lesson: "m5-l4" },
  { name: "IndexError", title: "Номер за пределами списка", code: "a = [1, 2, 3]\nprint(a[3])", why: "В списке из трёх элементов номера идут 0, 1, 2. Номера 3 нет.", fix: "Последний элемент — a[-1] или a[len(a) - 1].", lesson: "m5-l4" },
  { name: "IndexError", title: "Достать из пустого списка", code: "[].pop()", why: "pop забирает последний элемент, а полка пуста.", fix: "Проверьте: if a: a.pop().", lesson: "m5-l4" },
  { name: "KeyError", title: "Нет такого ключа", code: 'd = {"a": 1}\nprint(d["b"])', why: "В картотеке нет карточки с таким именем.", fix: "Используйте d.get(\"b\") или проверьте if \"b\" in d.", lesson: "m5-l6" },
  { name: "ZeroDivisionError", title: "Деление на ноль", code: "print(10 / 0)", why: "Делить на ноль нельзя в математике, а Python не пытается угадать.", fix: "Проверьте делитель: if b != 0:", lesson: "m6-l3" },
  { name: "AttributeError", title: "У строки нет append", code: '"abc".append("d")', why: "append есть у списков. Строка не умеет «дописываться» на месте.", fix: "Для строки используйте склейку: \"abc\" + \"d\".", lesson: "m5-l4" },
  { name: "AttributeError", title: "У списка нет такого метода", code: "[1, 2].add(3)", why: "У списка метод называется append, а не add.", fix: "Используйте append: a.append(3).", lesson: "m5-l4" },
  { name: "ModuleNotFoundError", title: "Библиотеки нет", code: "import nonexistent_garden_tool", why: "Такой библиотеки нет среди установленных: ошибка в названии или её не установили.", fix: "Проверьте написание и установите через pip install, если библиотека сторонняя.", lesson: "m7-l2" },
  { name: "ImportError", title: "Нет такого имени в библиотеке", code: "from math import sqroot", why: "Библиотека есть, но инструмента с таким названием в ней нет.", fix: "Проверьте имя в документации: from math import sqrt.", lesson: "m7-l4" },
  { name: "UnboundLocalError", title: "Локальная переменная без значения", code: "x = 1\ndef f():\n    x = x + 1\nf()", why: "Раз внутри функции есть присваивание x, Python считает x локальной, а у неё ещё нет значения.", fix: "Передайте значение аргументом и верните результат через return.", lesson: "m6-l6" },
  { name: "RecursionError", title: "Функция вызывает сама себя бесконечно", code: "def f():\n    f()\nf()", why: "Функция вызывает себя без остановки, пока не кончится стек вызовов.", fix: "Добавьте условие выхода или замените на цикл.", lesson: "m6-l4" },
  { name: "AssertionError", title: "Проверка не сошлась", code: "assert 1 + 1 == 3", why: "assert проверяет утверждение. Здесь оно ложно — значит, в коде или ожиданиях ошибка.", fix: "Исправьте код или ожидаемое значение.", lesson: null },
  { name: "FileNotFoundError", title: "Файл не найден", code: 'open("nope.txt")', why: "Python ищет файл рядом с программой и не находит его: неверное имя или путь.", fix: "Проверьте имя файла и папку, в которой лежит программа.", lesson: null },
];

const out = [];
for (const [index, entry] of SRC.entries()) {
  const probe = JSON.parse(py.runPython(`_probe(${JSON.stringify(entry.code)})`));
  if (probe.name !== entry.name) {
    console.error(`✗ запись ${index + 1} «${entry.title}»: ожидалась ${entry.name}, получилось ${probe.name}`);
    process.exit(1);
  }
  out.push({ id: `err-${String(index + 1).padStart(2, "0")}`, ...entry, message: probe.msg ? `${probe.name}: ${probe.msg.replace(/\s*\(<atlas>, line \d+\)$/, "")}` : probe.name });
}

const header = `/**
 * Атлас ошибок: ${out.length} записей. ФАЙЛ СОБИРАЕТСЯ АВТОМАТИЧЕСКИ: node tools/build-atlas.mjs
 * (реальные сообщения Python получены запуском кода в Pyodide).
 */
export default `;
fs.writeFileSync(path.join(root, "js/data/library/errors-atlas.js"), header + JSON.stringify(out, null, 2) + ";\n");
console.log(`Атлас собран: ${out.length} записей, ${new Set(out.map((e) => e.name)).size} типов ошибок.`);
