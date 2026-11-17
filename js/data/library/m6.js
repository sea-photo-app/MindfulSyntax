/**
 * Модуль 6. Функции — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: функции",
    points: [
      "Функция — набор шагов с именем. def создаёт её, имя со скобками запускает: hello().",
      "def только описывает функцию. Пока её не вызвали, тело не выполняется; вызов должен стоять после def.",
      "Тело функции сдвинуто на четыре пробела. Строка без отступа уже не входит в функцию.",
      "Параметр — имя в скобках при def, аргумент — значение при вызове. Аргументы подставляются по порядку.",
      "Не хватает аргументов — TypeError; имя не определено или вызов выше def — NameError.",
      "return отдаёт значение туда, где функцию вызвали, и завершает её; print только показывает на экране.",
      "Функция без return возвращает None.",
      "Переменные внутри функции локальные: снаружи их не видно. Результат наружу передают через return.",
      "Значение по умолчанию: def greet(name, greeting=\"Привет\"). Именованный аргумент: greet(name=\"Аня\").",
    ],
  },

  glossary: [
    { term: "функция", definition: "Набор шагов с именем. Один раз описали через def — потом вызывают сколько нужно.", lesson: "m6-l1" },
    { term: "def", definition: "Слово, которым создают функцию. Само по себе описание функцию не запускает.", lesson: "m6-l4" },
    { term: "вызов", definition: "Просьба выполнить функцию: имя и скобки, например make_tea(). Только вызов запускает тело.", lesson: "m6-l4" },
    { term: "параметр", definition: "Имя в скобках при def — «кармашек» для данных, которые придут при вызове.", lesson: "m6-l5" },
    { term: "аргумент", definition: "Значение, которое передают функции при вызове. Оно попадает в параметр.", lesson: "m6-l5" },
    { term: "return", definition: "Возвращает значение из функции и завершает её. Это результат, который можно сохранить и использовать.", lesson: "m6-l2" },
    { term: "None", definition: "Значение «ничего». Его возвращает функция, в которой нет return.", lesson: "m6-l2" },
    { term: "локальная переменная", definition: "Переменная, созданная внутри функции. Снаружи её не видно, обращение даёт NameError.", lesson: "m6-l6" },
    { term: "значение по умолчанию", definition: "Запасное значение параметра: greeting=\"Привет\". Используется, если аргумент не передали.", lesson: "m6-l7" },
  ],

  recipes: [
    {
      id: "m6-r1",
      title: "Функция с повторяющимся действием",
      code: `def water():
    print("Берём лейку")
    print("Поливаем грядку")

water()
water()`,
      explain: "Шаги описаны один раз, а выполняются при каждом вызове.",
      lesson: "m6-l4",
    },
    {
      id: "m6-r2",
      title: "Функция, которая возвращает результат",
      code: `def bouquet_price(count, price):
    return count * price

total = bouquet_price(6, 45)
print(total)
print(total + 30)`,
      explain: "return отдаёт число, его можно сохранить в переменную и считать дальше.",
      lesson: "m6-l2",
    },
    {
      id: "m6-r3",
      title: "Значение по умолчанию",
      code: `def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

print(greet("Аня"))
print(greet("Борис", "Здравствуйте"))
print(greet(greeting="Добрый вечер", name="Вера"))`,
      explain: "Если второй аргумент не передали, берётся «Привет». Именами можно менять порядок.",
      lesson: "m6-l7",
    },
    {
      id: "m6-r4",
      title: "Безопасное деление",
      code: `def divide(a, b):
    if b == 0:
        return "Нельзя делить на ноль"
    return a / b

print(divide(9, 3))
print(divide(5, 0))`,
      explain: "Проверка b == 0 стоит до деления, поэтому программа не падает.",
      lesson: "m6-l3",
    },
  ],

  cards: [
    { id: "m6-c1", front: "Что делает def?", back: "Описывает функцию, но не запускает её. Запускает вызов: имя().", lesson: "m6-l4" },
    { id: "m6-c2", front: "Чем параметр отличается от аргумента?", back: "Параметр — имя в def, аргумент — значение при вызове.", lesson: "m6-l5" },
    { id: "m6-c3", front: "Чем return отличается от print?", back: "print показывает значение на экране, return отдаёт его программе.", lesson: "m6-l2" },
    { id: "m6-c4", front: "Что вернёт функция без return?", back: "None — «ничего».", lesson: "m6-l2" },
    { id: "m6-c5", front: "Что будет, если вызвать локальную переменную снаружи функции?", back: "NameError: Python не знает такого имени вне функции.", lesson: "m6-l6" },
    { id: "m6-c6", front: "Как задать значение по умолчанию?", back: "В def: def tea(name, sugar=1). Такие параметры идут после обязательных.", lesson: "m6-l7" },
  ],

  cheats: [
    { code: "def hello():", text: "создать функцию (описание)", lesson: "m6-l4" },
    { code: "hello()", text: "вызвать функцию", lesson: "m6-l4" },
    { code: "def add(a, b):", text: "функция с двумя параметрами", lesson: "m6-l5" },
    { code: "return a + b", text: "вернуть результат", lesson: "m6-l2" },
    { code: "def f(x, y=2):", text: "значение по умолчанию", lesson: "m6-l7" },
    { code: "f(y=5, x=1)", text: "именованные аргументы", lesson: "m6-l7" },
  ],

  exercises: [
    {
      id: "m6-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `def double(x):
    return x * 2

print(double(4))`,
      expected: "8",
      options: ["4", "8", "double(4)"],
      correct: 1,
      explain: "Функция возвращает 4 * 2 = 8, а print показывает это значение.",
      lesson: "m6-l2",
    },
    {
      id: "m6-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `def hi(name):
    print("Привет,", name)

hi("Аня")`,
      expected: "Привет, Аня",
      options: ["Привет, name", "Привет, Аня", "Ничего"],
      correct: 1,
      explain: "Аргумент «Аня» попадает в параметр name, и print выводит его после приветствия.",
      lesson: "m6-l5",
    },
    {
      id: "m6-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def add(a, b):
    return a + b

print(add(2, 3) * 2)`,
      expected: "10",
      options: ["5", "10", "23"],
      correct: 1,
      explain: "Вызов add(2, 3) заменяется на 5, затем 5 * 2 = 10.",
      lesson: "m6-l2",
    },
    {
      id: "m6-e04",
      type: "predict",
      level: 2,
      prompt: "Что выведет последняя строка?",
      code: `def show(x):
    print(x)

result = show(5)
print(result)`,
      expected: "5\nNone",
      options: ["5\n5", "5\nNone", "None\nNone"],
      correct: 1,
      explain: "Первая 5 — от print внутри функции. Return в функции нет, поэтому result равен None.",
      lesson: "m6-l2",
    },
    {
      id: "m6-e05",
      type: "predict",
      level: 3,
      prompt: "Что выведет код?",
      code: `x = 10

def f():
    x = 5
    return x + 1

print(f(), x)`,
      expected: "6 10",
      options: ["6 6", "6 10", "11 10"],
      correct: 1,
      explain: "Внутри f своя локальная x = 5, поэтому возвращается 6. Глобальная x остаётся 10.",
      lesson: "m6-l6",
    },
    {
      id: "m6-e06",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def tea(name, sugar=1):
    return f"{name}-{sugar}"

print(tea("чай"), tea("кофе", 0))`,
      expected: "чай-1 кофе-0",
      options: ["чай-1 кофе-1", "чай-1 кофе-0", "чай-0 кофе-0"],
      correct: 1,
      explain: "В первом вызове берётся значение по умолчанию 1, во втором оно заменено на 0.",
      lesson: "m6-l7",
    },
    {
      id: "m6-e07",
      type: "read",
      level: 2,
      prompt: "Что делает функция?",
      code: `def is_even(n):
    return n % 2 == 0

print(is_even(4))`,
      options: ["Проверяет, чётное ли число", "Делит число на два", "Выводит число"],
      correct: 0,
      explain: "n % 2 == 0 — это проверка чётности. Функция возвращает True или False.",
      lesson: "m6-l2",
    },
    {
      id: "m6-e08",
      type: "read",
      level: 2,
      prompt: "Что вернёт power(3) для этой функции?",
      code: `def power(x, p=2):
    return x ** p

print(power(3))`,
      options: ["6", "9", "27"],
      correct: 1,
      explain: "p по умолчанию равно 2, значит 3 ** 2 = 9.",
      lesson: "m6-l7",
    },
    {
      id: "m6-e09",
      type: "bug",
      level: 1,
      prompt: "Программа падает с IndentationError. В какой строке ошибка?",
      lines: ["def hello():", "print(\"Привет\")", "", "hello()"],
      badLine: 1,
      fix: "    print(\"Привет\")",
      explain: "Тело функции должно быть сдвинуто на четыре пробела. Без отступа Python не понимает, что строка внутри функции.",
      lesson: "m6-l4",
    },
    {
      id: "m6-e10",
      type: "bug",
      level: 2,
      prompt: "Программа падает с TypeError: не хватает аргумента. В какой строке ошибка?",
      lines: ["def area(w, h):", "    return w * h", "", "print(area(4))"],
      badLine: 3,
      fix: "print(area(4, 5))",
      explain: "Функции нужны два аргумента, а передан один. Добавьте второй — например, 5.",
      lesson: "m6-l5",
    },
    {
      id: "m6-e11",
      type: "bug",
      level: 3,
      prompt: "Программа падает с NameError. В какой строке ошибка?",
      lines: ["def count():", "    total = 5", "", "count()", "print(total)"],
      badLine: 4,
      fix: "print(count())",
      explain: "total — локальная переменная и снаружи не видна. Чтобы получить значение, функция должна вернуть его через return total, а снаружи — вывести результат вызова.",
      lesson: "m6-l6",
    },
    {
      id: "m6-e12",
      type: "fill",
      level: 1,
      prompt: "Допишите return, чтобы функция удваивала число.",
      code: `def double(x):
    return ___

print(double(6))`,
      answers: ["x * 2", "x + x", "2 * x"],
      expected: "12",
      explain: "Удвоить значит умножить на два или сложить с самим собой.",
      lesson: "m6-l2",
    },
    {
      id: "m6-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите значение по умолчанию для приветствия.",
      code: `def greet(name, greeting="___"):
    return f"{greeting}, {name}!"

print(greet("Аня"))`,
      answers: ["Привет"],
      expected: "Привет, Аня!",
      explain: "Значение по умолчанию подставится, если при вызове передать только имя.",
      lesson: "m6-l7",
    },
    {
      id: "m6-e14",
      type: "fill",
      level: 3,
      prompt: "Допишите имя параметра в именованном аргументе.",
      code: `def intro(name, age):
    print(f"{name}, {age} лет")

intro(age=7, ___="Аня")`,
      answers: ["name"],
      expected: "Аня, 7 лет",
      explain: "Именованный аргумент указывает параметр по имени, поэтому порядок можно менять.",
      lesson: "m6-l7",
    },
    {
      id: "m6-e15",
      type: "assemble",
      level: 2,
      prompt: "Соберите функцию divide с проверкой деления на ноль и вызов.",
      pieces: [
        { id: "a", code: "def divide(a, b):" },
        { id: "b", code: "    if b == 0:" },
        { id: "c", code: "        return \"Нельзя\"" },
        { id: "d", code: "    return a / b" },
        { id: "e", code: "print(divide(8, 2))" },
      ],
      solution: ["a", "b", "c", "d", "e"],
      explain: "Заголовок, проверка с вложенным return, основной return на уровне if и вызов в конце уже без отступа.",
      lesson: "m6-l3",
    },
  ],
};
