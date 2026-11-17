/**
 * Модуль 9. Ошибки и отладка — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: ошибки и отладка",
    points: [
      "Traceback читают снизу вверх: последняя строка — тип и причина ошибки, самая нижняя запись File — строка, где программа упала.",
      "NameError — Python не знает имя (опечатка или переменная ещё не создана). TypeError — действие не подходит типу, например текст + число. ValueError — тип верный, а значение нет: int(\"abc\").",
      "ZeroDivisionError появляется при делении на ноль: 10 / 0.",
      "try пробует выполнить опасный код, except Тип: говорит, что делать при ошибке этого типа, и программа продолжается.",
      "Ловите конкретный тип ошибки. Голый except: прячет и опечатки, и настоящие баги.",
      "else выполняется, если ошибки не было, а finally — всегда, что бы ни случилось.",
      "Проверка ввода: while True, внутри try с int(input()), при успехе break, в except — подсказка. Диапазон проверяют отдельным if.",
      "assert выражение молчит, если верно, и падает с AssertionError, если нет. Хороший набор тестов: обычное значение, ноль и граничный случай.",
      "Чтобы увидеть сразу все результаты, печатайте «ожидалось / получилось» вместо падения на первом assert.",
    ],
  },

  glossary: [
    { term: "traceback", definition: "Сообщение Python об ошибке: цепочка вызовов, строка, где всё остановилось, тип и причина ошибки. Читают снизу вверх.", lesson: "m9-l1" },
    { term: "NameError", definition: "Ошибка «имя не определено»: Python встретил имя, которого не знает. Чаще всего это опечатка.", lesson: "m9-l2" },
    { term: "TypeError", definition: "Ошибка типа: действие не подходит этим данным, например сложение текста с числом.", lesson: "m9-l2" },
    { term: "ValueError", definition: "Тип подходит, а значение нет. Например, int(\"abc\"): строка есть, а числа в ней нет.", lesson: "m9-l2" },
    { term: "ZeroDivisionError", definition: "Ошибка деления на ноль. Её легко предвидеть и поймать через try / except.", lesson: "m9-l3" },
    { term: "try / except", definition: "Конструкция, которая пробует выполнить код и при ошибке заданного типа выполняет запасной блок, не останавливая программу.", lesson: "m9-l3" },
    { term: "валидация ввода", definition: "Проверка того, что пользователь ввёл подходящее значение. Обычно делается циклом while True с try / except и break при успехе.", lesson: "m9-l4" },
    { term: "assert", definition: "Утверждение: если выражение верно, ничего не происходит, а если нет — программа падает с AssertionError.", lesson: "m9-l5" },
    { term: "граничный случай", definition: "Значение на краю допустимого: ноль, пустая строка, границы диапазона. Именно здесь чаще всего прячутся ошибки.", lesson: "m9-l5" },
  ],

  recipes: [
    {
      id: "m9-r1",
      title: "Безопасное преобразование в число",
      code: `def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(to_int("42"))
print(to_int("сорок два"))`,
      explain: "Функция возвращает число или None, если текст не получилось преобразовать. Программа не падает.",
      lesson: "m9-l3",
    },
    {
      id: "m9-r2",
      title: "Спрашивать, пока не число",
      code: `while True:
    text = input("Введите число: ")
    try:
        number = int(text)
        break
    except ValueError:
        print("Это не число, попробуйте ещё раз")

print("Вы ввели", number)`,
      explain: "Шаблон проверки ввода: цикл повторяется, пока int() не сработает без ошибки.",
      lesson: "m9-l4",
    },
    {
      id: "m9-r3",
      title: "Безопасное деление",
      code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Деление на ноль невозможно"

print(safe_divide(10, 4))
print(safe_divide(3, 0))`,
      explain: "Ловим именно ZeroDivisionError и возвращаем понятное сообщение вместо падения.",
      lesson: "m9-l3",
    },
    {
      id: "m9-r4",
      title: "Мини-тесты «ожидалось / получилось»",
      code: `def check(name, expected, got):
    if expected == got:
        print(f"ОК: {name}")
    else:
        print(f"ОШИБКА: {name} — ожидалось {expected}, получилось {got}")

def double(x):
    return x * 2

check("обычное", 6, double(3))
check("ноль", 0, double(0))
check("минус", -4, double(-2))`,
      explain: "Печатает результат каждой проверки, не останавливаясь на первой ошибке. Удобно, когда тестов много.",
      lesson: "m9-l5",
    },
  ],

  cards: [
    { id: "m9-c1", front: "С какой строки читать traceback?", back: "С последней: там тип и причина ошибки. Потом — нижняя запись File со строкой.", lesson: "m9-l1" },
    { id: "m9-c2", front: "Что значит NameError?", back: "Python не знает такого имени: опечатка или переменная ещё не создана.", lesson: "m9-l2" },
    { id: "m9-c3", front: "Чем ValueError отличается от TypeError?", back: "TypeError — тип не подходит действию. ValueError — тип верный, но значение не годится: int(\"abc\").", lesson: "m9-l2" },
    { id: "m9-c4", front: "Как поймать деление на ноль?", back: "try:\n    a / b\nexcept ZeroDivisionError:\n    ...", lesson: "m9-l3" },
    { id: "m9-c5", front: "Почему не писать голый except?", back: "Он ловит любые ошибки, включая опечатки, и прячет настоящие баги. Указывайте тип.", lesson: "m9-l3" },
    { id: "m9-c6", front: "Как спрашивать число, пока не введут верное?", back: "while True: try: number = int(input()); break; except ValueError: подсказка.", lesson: "m9-l4" },
    { id: "m9-c7", front: "Что делает assert?", back: "Молчит, если выражение верно, и падает с AssertionError, если нет.", lesson: "m9-l5" },
  ],

  cheats: [
    { code: "try: ... except ValueError: ...", text: "поймать ошибку конкретного типа", lesson: "m9-l3" },
    { code: "except ZeroDivisionError:", text: "ловить деление на ноль", lesson: "m9-l3" },
    { code: "else: / finally:", text: "else — если ошибки не было, finally — всегда", lesson: "m9-l3" },
    { code: "while True: ... break", text: "цикл ввода: выйти, когда ответ верный", lesson: "m9-l4" },
    { code: "assert f(2) == 4", text: "тест: падает, если результат не 4", lesson: "m9-l5" },
    { code: "int(\"abc\")  # ValueError", text: "верный тип, но неверное значение", lesson: "m9-l2" },
  ],

  exercises: [
    {
      id: "m9-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `try:
    print(int("12") + 1)
except ValueError:
    print("Ошибка")`,
      expected: "13",
      options: ["13", "Ошибка", "1212"],
      correct: 0,
      explain: "int(\"12\") даёт 12, ошибки нет, поэтому except не срабатывает. Печатается 12 + 1 = 13.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `try:
    print(int("abc"))
except ValueError:
    print("Не число")
print("Дальше")`,
      expected: "Не число\nДальше",
      options: ["Не число\nДальше", "Не число", "abc\nДальше"],
      correct: 0,
      explain: "int(\"abc\") падает с ValueError, поэтому срабатывает except. После блока программа продолжается.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `try:
    x = 10 / 2
except ZeroDivisionError:
    print("ноль")
else:
    print("ок", x)
finally:
    print("конец")`,
      expected: "ок 5.0\nконец",
      options: ["ок 5.0\nконец", "ноль\nконец", "ок 5\nконец"],
      correct: 0,
      explain: "Ошибки нет, поэтому выполняется else, а finally — всегда. Деление через / даёт 5.0.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e04",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `try:
    print("раз")
    print(1 / 0)
    print("два")
except ZeroDivisionError:
    print("стоп")`,
      expected: "раз\nстоп",
      options: ["раз\nстоп", "раз\nдва", "раз\nстоп\nдва"],
      correct: 0,
      explain: "Строка «раз» выполняется до ошибки. На 1 / 0 Python прыгает в except, а «два» пропускается.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e05",
      type: "predict",
      level: 3,
      prompt: "Что выведет код?",
      code: `def safe(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 0

print(safe(9, 3) + safe(1, 0))`,
      expected: "3.0",
      options: ["3.0", "3", "Ошибка"],
      correct: 0,
      explain: "safe(9, 3) даёт 3.0, safe(1, 0) ловит ошибку и возвращает 0. Сумма 3.0 + 0 = 3.0.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e06",
      type: "read",
      level: 1,
      prompt: "Что вернёт функция to_int, если передать «пять»?",
      code: `def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(to_int("5"), to_int("пять"))`,
      options: ["None", "0", "Программа упадёт"],
      correct: 0,
      explain: "int(\"пять\") вызывает ValueError. Он перехвачен, и функция возвращает None.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e07",
      type: "read",
      level: 2,
      prompt: "Что случилось бы, если бы triple(3) вернула 10?",
      code: `def triple(x):
    return x * 3

assert triple(3) == 9
print("ok")`,
      options: [
        "Программа упала бы с AssertionError",
        "Программа вывела бы 10",
        "Ничего: assert только комментарий",
      ],
      correct: 0,
      explain: "assert проверяет утверждение. Если оно неверно, Python останавливает программу с AssertionError.",
      lesson: "m9-l5",
    },
    {
      id: "m9-e08",
      type: "bug",
      level: 1,
      prompt: "Программа падает с NameError. В какой строке ошибка?",
      lines: ["fruit = \"яблоко\"", "print(fruti)"],
      badLine: 1,
      fix: "print(fruit)",
      explain: "В имени опечатка: переменная называется fruit, а не fruti.",
      lesson: "m9-l2",
    },
    {
      id: "m9-e09",
      type: "bug",
      level: 1,
      prompt: "Программа падает с TypeError. В какой строке ошибка?",
      lines: ["age = 12", "print(\"Мне \" + age + \" лет\")"],
      badLine: 1,
      fix: "print(\"Мне \" + str(age) + \" лет\")",
      explain: "Число нельзя склеить с текстом через +. Превратите его в строку: str(age) или используйте f-строку.",
      lesson: "m9-l2",
    },
    {
      id: "m9-e10",
      type: "bug",
      level: 2,
      prompt: "Программа падает с ValueError. В какой строке ошибка?",
      lines: ["text = \"3,5\"", "number = float(text)", "print(number)"],
      badLine: 0,
      fix: "text = \"3.5\"",
      explain: "В Python дробная часть отделяется точкой, а не запятой. float(\"3,5\") не понимает такой текст.",
      lesson: "m9-l2",
    },
    {
      id: "m9-e11",
      type: "bug",
      level: 3,
      prompt: "Программа должна поймать деление на ноль, но падает. В какой строке ошибка?",
      lines: ["try:", "    print(10 / 0)", "except ValueError:", "    print(\"ноль\")"],
      badLine: 2,
      fix: "except ZeroDivisionError:",
      explain: "except ловит только ту ошибку, что в нём названа. Деление на ноль даёт ZeroDivisionError, а не ValueError.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e12",
      type: "bug",
      level: 3,
      logic: true,
      prompt: "Совершеннолетие начинается с 18 лет, а функция для 18 отвечает неверно. Программа не падает — найдите строку с логической ошибкой.",
      lines: ["def is_adult(age):", "    return age > 18", "print(is_adult(18))"],
      badLine: 1,
      fix: "    return age >= 18",
      explain: "На границе 18 условие age > 18 даёт False. Нужно «больше или равно»: >=. Такие ошибки ловят граничные тесты.",
      lesson: "m9-l5",
    },
    {
      id: "m9-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите тип ошибки, чтобы программа вывела «Не число».",
      code: `try:
    number = int("x")
except ___:
    print("Не число")`,
      answers: ["ValueError"],
      expected: "Не число",
      explain: "int(\"x\") вызывает ValueError, значит, именно его и нужно перехватить.",
      lesson: "m9-l3",
    },
    {
      id: "m9-e14",
      type: "fill",
      level: 1,
      prompt: "Допишите ожидаемый результат, чтобы тест прошёл.",
      code: `def triple(x):
    return x * 3

assert triple(2) == ___
print("OK")`,
      answers: ["6"],
      expected: "OK",
      explain: "triple(2) = 2 * 3 = 6. Тест молчит, потому что утверждение верно, и печатается OK.",
      lesson: "m9-l5",
    },
    {
      id: "m9-e15",
      type: "assemble",
      level: 2,
      prompt: "Соберите блок try / except / else, который выведет число.",
      pieces: [
        { id: "a", code: "try:" },
        { id: "b", code: "    n = int(\"7\")" },
        { id: "c", code: "except ValueError:" },
        { id: "d", code: "    print(\"ошибка\")" },
        { id: "e", code: "else:" },
        { id: "f", code: "    print(n)" },
      ],
      solution: ["a", "b", "c", "d", "e", "f"],
      explain: "Порядок: try с опасным действием, except с типом ошибки, затем else для случая без ошибки.",
      lesson: "m9-l3",
    },
  ],
};
