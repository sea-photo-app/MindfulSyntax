/**
 * Модуль 7. Библиотеки и зависимости — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: библиотеки и зависимости",
    points: [
      "Библиотека — набор готового кода. import подключает её; функции берут через точку: math.sqrt(16).",
      "Три способа подключения: import math, import math as m, from math import sqrt. Последний убирает имя библиотеки перед функцией.",
      "random: randint(a, b) включает обе границы, choice берёт один элемент, shuffle перемешивает список на месте, sample вытягивает k разных элементов.",
      "Числа random псевдослучайные. random.seed(число) делает цепочку повторяемой: удобно для разборов и тестов.",
      "math: sqrt, pi, floor (вниз), ceil (вверх). round(x, n) встроена в Python и подключения не требует.",
      "statistics.mean — среднее, statistics.median — серединное значение; выбросы сильнее двигают среднее, чем медиану.",
      "datetime: date(год, месяц, день), разность дат — timedelta с полем .days, прибавление — timedelta(days=30).",
      "strftime(\"%d.%m.%Y\") превращает дату в текст: %d день, %m месяц, %Y год.",
      "ModuleNotFoundError — нет такой библиотеки (опечатка или не установлена), AttributeError — нет такой функции внутри.",
      "pip install ставит внешнюю библиотеку, pip freeze показывает установленное, requirements.txt — список зависимостей проекта.",
    ],
  },

  glossary: [
    { term: "библиотека", definition: "Набор готового кода для общей задачи: случайные числа, математика, даты.", lesson: "m7-l1" },
    { term: "import", definition: "Команда подключения библиотеки. После неё функции доступны через точку: random.randint().", lesson: "m7-l1" },
    { term: "стандартная библиотека", definition: "Библиотеки, которые идут вместе с Python: random, math, datetime и другие. Устанавливать их не нужно.", lesson: "m7-l1" },
    { term: "псевдослучайное число", definition: "Число, которое выглядит случайным, но получено по формуле из стартового значения (seed).", lesson: "m7-l3" },
    { term: "seed", definition: "Стартовое значение генератора случайных чисел. С одним seed результат повторяется.", lesson: "m7-l3" },
    { term: "медиана", definition: "Серединное значение набора чисел, выстроенных по порядку. Не так зависит от выбросов, как среднее.", lesson: "m7-l4" },
    { term: "timedelta", definition: "Промежуток времени: например, 30 дней. Получается при вычитании дат или создаётся вручную.", lesson: "m7-l5" },
    { term: "strftime", definition: "Метод даты, который превращает её в текст по шаблону вроде \"%d.%m.%Y\".", lesson: "m7-l5" },
    { term: "pip", definition: "Программа для установки внешних библиотек. Работает в терминале: pip install имя.", lesson: "m7-l2" },
    { term: "зависимость", definition: "Библиотека, без которой код не работает. Их перечисляют в requirements.txt.", lesson: "m7-l2" },
  ],

  recipes: [
    {
      id: "m7-r1",
      title: "Жребий и перемешивание",
      code: `import random

random.seed(7)
names = ["Аня", "Киото", "Мир", "Сад"]
print(random.choice(names))
random.shuffle(names)
print(names)`,
      explain: "choice выбирает одного, shuffle перемешивает весь список. Без seed результат каждый раз новый.",
      lesson: "m7-l3",
    },
    {
      id: "m7-r2",
      title: "Генератор пароля",
      code: `import random

def make_password(length=8):
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    password = ""
    for _ in range(length):
        password += random.choice(chars)
    return password

print(len(make_password()))
print(len(make_password(12)))`,
      explain: "choice берёт случайный символ строки, цикл повторяет выбор length раз.",
      lesson: "m7-l6",
    },
    {
      id: "m7-r3",
      title: "Корень, округление, среднее",
      code: `import math
import statistics

print(math.sqrt(49))
print(math.ceil(4.1), math.floor(4.9))
print(statistics.mean([2, 4, 9]))
print(statistics.median([2, 4, 9]))`,
      explain: "ceil округляет вверх, floor вниз. Среднее считает по всем числам, медиана берёт серединное.",
      lesson: "m7-l4",
    },
    {
      id: "m7-r4",
      title: "Дни до события",
      code: `from datetime import date

today = date(2025, 9, 1)
event = date(2025, 10, 5)
print((event - today).days)
print(event.strftime("%d.%m.%Y"))`,
      explain: "Разность дат — timedelta, у неё есть .days. strftime печатает дату по шаблону.",
      lesson: "m7-l5",
    },
  ],

  cards: [
    { id: "m7-c1", front: "Чем import math отличается от from math import sqrt?", back: "В первом случае пишут math.sqrt(), во втором — просто sqrt().", lesson: "m7-l1" },
    { id: "m7-c2", front: "Входит ли правая граница в random.randint(1, 6)?", back: "Да: шестёрка может выпасть. Это отличие от range().", lesson: "m7-l3" },
    { id: "m7-c3", front: "Что делает random.seed(7)?", back: "Фиксирует старт генератора: результаты random становятся повторяемыми.", lesson: "m7-l3" },
    { id: "m7-c4", front: "Чем floor отличается от ceil?", back: "floor округляет вниз (3.7 → 3), ceil — вверх (3.2 → 4).", lesson: "m7-l4" },
    { id: "m7-c5", front: "Как получить число дней между двумя датами?", back: "(date2 - date1).days", lesson: "m7-l5" },
    { id: "m7-c6", front: "Что означает ModuleNotFoundError?", back: "Python не нашёл такую библиотеку: проверьте имя или установите её через pip.", lesson: "m7-l4" },
    { id: "m7-c7", front: "Зачем нужен requirements.txt?", back: "Это список зависимостей проекта: pip install -r requirements.txt ставит всё сразу.", lesson: "m7-l2" },
  ],

  cheats: [
    { code: "import random", text: "подключить библиотеку", lesson: "m7-l1" },
    { code: "from math import sqrt", text: "взять одну функцию", lesson: "m7-l1" },
    { code: "random.randint(1, 6)", text: "целое число, обе границы входят", lesson: "m7-l3" },
    { code: "random.choice(items)", text: "один случайный элемент", lesson: "m7-l3" },
    { code: "date(2025, 9, 1)", text: "создать дату", lesson: "m7-l5" },
    { code: "pip install requests", text: "установить библиотеку (терминал)", lesson: "m7-l2" },
  ],

  exercises: [
    {
      id: "m7-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `import math

print(math.sqrt(81))`,
      expected: "9.0",
      options: ["9", "9.0", "81"],
      correct: 1,
      explain: "sqrt всегда возвращает число с точкой, даже если корень целый.",
      lesson: "m7-l4",
    },
    {
      id: "m7-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `import math

print(math.floor(5.9), math.ceil(5.1))`,
      expected: "5 6",
      options: ["6 5", "5 6", "5 5"],
      correct: 1,
      explain: "floor округляет вниз до 5, ceil — вверх до 6.",
      lesson: "m7-l4",
    },
    {
      id: "m7-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `import statistics

numbers = [1, 2, 3, 4, 100]
print(statistics.mean(numbers))
print(statistics.median(numbers))`,
      expected: "22\n3",
      options: ["22\n3", "3\n22", "22\n22"],
      correct: 0,
      explain: "Сумма 110, делить на 5 — среднее 22. Серединное значение — 3: сотня почти не влияет на медиану.",
      lesson: "m7-l4",
    },
    {
      id: "m7-e04",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `from datetime import date

a = date(2025, 3, 1)
b = date(2025, 3, 11)
print((b - a).days)`,
      expected: "10",
      options: ["10", "11", "3"],
      correct: 0,
      explain: "Между первым и одиннадцатым числом одного месяца 10 дней.",
      lesson: "m7-l5",
    },
    {
      id: "m7-e05",
      type: "predict",
      level: 3,
      prompt: "Что выведет код?",
      code: `from datetime import date, timedelta

d = date(2025, 1, 30)
print((d + timedelta(days=3)).strftime("%d.%m"))`,
      expected: "02.02",
      options: ["33.01", "02.02", "03.02"],
      correct: 1,
      explain: "30 января плюс три дня: 31 января, 1 февраля, 2 февраля. Дата сама переходит в новый месяц.",
      lesson: "m7-l5",
    },
    {
      id: "m7-e06",
      type: "read",
      level: 1,
      prompt: "Что делает эта строка?",
      code: `import random

print(random.choice(["чай", "кофе", "какао"]))`,
      options: ["Выводит случайный напиток из списка", "Выводит весь список", "Перемешивает список и ничего не показывает"],
      correct: 0,
      explain: "choice выбирает один случайный элемент, а print показывает его.",
      lesson: "m7-l3",
    },
    {
      id: "m7-e07",
      type: "read",
      level: 2,
      prompt: "Какие числа может вывести этот код?",
      code: `import random

n = random.randint(1, 3)
print(n)`,
      options: ["Только 1, 2 или 3", "Только 1 или 2", "Любое число от 0 до 3"],
      correct: 0,
      explain: "randint включает обе границы: возможны 1, 2 и 3.",
      lesson: "m7-l3",
    },
    {
      id: "m7-e08",
      type: "read",
      level: 3,
      prompt: "Что умеет эта функция?",
      code: `import random

def roll_dice(count):
    rolls = []
    for _ in range(count):
        rolls.append(random.randint(1, 6))
    return rolls

print(len(roll_dice(4)))`,
      options: ["Возвращает список из count бросков кубика", "Возвращает сумму бросков", "Возвращает один бросок"],
      correct: 0,
      explain: "В цикле добавляется count случайных чисел от 1 до 6, и возвращается весь список.",
      lesson: "m7-l6",
    },
    {
      id: "m7-e09",
      type: "bug",
      level: 1,
      prompt: "Программа падает с ModuleNotFoundError. В какой строке ошибка?",
      lines: ["import ramdom", "", "print(random.randint(1, 6))"],
      badLine: 0,
      fix: "import random",
      explain: "В имени библиотеки опечатка: random пишется с буквой n. Из-за неё Python не находит нужный ящик.",
      lesson: "m7-l4",
    },
    {
      id: "m7-e10",
      type: "bug",
      level: 2,
      prompt: "Программа падает с AttributeError. В какой строке ошибка?",
      lines: ["import math", "", "print(math.squareroot(9))"],
      badLine: 2,
      fix: "print(math.sqrt(9))",
      explain: "Библиотека math есть, но функции squareroot в ней нет. Корень называется sqrt.",
      lesson: "m7-l4",
    },
    {
      id: "m7-e11",
      type: "bug",
      level: 3,
      prompt: "Программа падает с NameError. В какой строке ошибка?",
      lines: ["from math import sqrt", "", "print(math.sqrt(16))"],
      badLine: 2,
      fix: "print(sqrt(16))",
      explain: "После from math import sqrt имя math не подключено — функция доступна как sqrt без приставки.",
      lesson: "m7-l1",
    },
    {
      id: "m7-e12",
      type: "fill",
      level: 1,
      prompt: "Допишите подключение библиотеки.",
      code: `___ math

print(math.pi > 3)`,
      answers: ["import"],
      expected: "True",
      explain: "Библиотеку подключает слово import.",
      lesson: "m7-l1",
    },
    {
      id: "m7-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите функцию округления вверх.",
      code: `import math

print(math.___(2.1))`,
      answers: ["ceil"],
      expected: "3",
      explain: "ceil округляет вверх: 2.1 становится 3.",
      lesson: "m7-l4",
    },
    {
      id: "m7-e14",
      type: "fill",
      level: 3,
      prompt: "Допишите шаблон, чтобы вывелось «05.07.2025».",
      code: `from datetime import date

print(date(2025, 7, 5).strftime("___"))`,
      answers: ["%d.%m.%Y"],
      expected: "05.07.2025",
      explain: "День, месяц и год с четырьмя цифрами через точки: %d.%m.%Y.",
      lesson: "m7-l5",
    },
    {
      id: "m7-e15",
      type: "assemble",
      level: 2,
      prompt: "Соберите программу: сколько дней до 10 сентября 2025 от 1 сентября.",
      pieces: [
        { id: "a", code: "from datetime import date" },
        { id: "b", code: "start = date(2025, 9, 1)" },
        { id: "c", code: "end = date(2025, 9, 10)" },
        { id: "d", code: "print((end - start).days)" },
      ],
      solution: ["a", "b", "c", "d"],
      explain: "Сначала подключаем date, затем создаём обе даты, и только потом считаем разность.",
      lesson: "m7-l5",
    },
  ],
};
