/**
 * Модуль 4. Циклы — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: циклы",
    points: [
      "for повторяет блок для каждого значения; после заголовка — двоеточие, тело сдвинуто на четыре пробела.",
      "range(5) даёт 0, 1, 2, 3, 4; range(1, 6) — 1…5; range(10, 0, -3) считает вниз с шагом. Правая граница не входит.",
      "while повторяется, пока условие истинно; внутри нужно менять переменную, иначе цикл бесконечен.",
      "for — когда число повторов известно, while — когда важно условие.",
      "break сразу выходит из цикла, continue пропускает остаток текущего шага.",
      "В while меняйте переменную до continue, иначе цикл застрянет.",
      "Вложенный цикл: внутренний проходит целиком на каждом шаге внешнего; повторов тела — произведение.",
      "print(x, end=\"\") не переводит строку, пустой print() переводит.",
      "\"*\" * n повторяет строку n раз — основа узоров из символов.",
    ],
  },

  glossary: [
    { term: "цикл", definition: "Конструкция, которая повторяет блок кода несколько раз, чтобы не копировать строки.", lesson: "m4-l1" },
    { term: "for", definition: "Цикл «для каждого»: берёт значения по очереди и выполняет тело цикла для каждого.", lesson: "m4-l1" },
    { term: "range()", definition: "Создаёт ряд чисел для цикла: range(5) — 0…4. Правая граница в ряд не входит.", lesson: "m4-l1" },
    { term: "тело цикла", definition: "Строки с отступом после for или while. Именно они повторяются.", lesson: "m4-l1" },
    { term: "while", definition: "Цикл «пока»: повторяет блок, пока условие истинно.", lesson: "m4-l2" },
    { term: "бесконечный цикл", definition: "Цикл, условие которого никогда не становится ложным. Песочница останавливает его по таймауту.", lesson: "m4-l2" },
    { term: "break", definition: "Команда немедленного выхода из цикла. Часто стоит внутри if.", lesson: "m4-l5" },
    { term: "continue", definition: "Команда «пропусти остаток шага»: цикл переходит к следующему повтору.", lesson: "m4-l5" },
    { term: "вложенный цикл", definition: "Цикл внутри цикла. Внешний выбирает строку, внутренний проходит столбцы.", lesson: "m4-l6" },
  ],

  recipes: [
    {
      id: "m4-r1",
      title: "Повторить N раз",
      code: `for i in range(4):
    print("Полив", i + 1)`,
      explain: "range(4) даёт 0…3, а i + 1 превращает их в номера с единицы.",
      lesson: "m4-l1",
    },
    {
      id: "m4-r2",
      title: "Копить сумму",
      code: `total = 0

for n in range(1, 6):
    total = total + n

print(total)`,
      explain: "Коробка total стартует с нуля, и каждый шаг добавляет к ней число.",
      lesson: "m4-l1",
    },
    {
      id: "m4-r3",
      title: "Искать и остановиться",
      code: `for n in range(1, 100):
    if n % 9 == 0 and n % 4 == 0:
        print("Нашли", n)
        break`,
      explain: "break выходит из цикла, как только ответ найден — остальные числа не проверяются.",
      lesson: "m4-l5",
    },
    {
      id: "m4-r4",
      title: "Таблица умножения",
      code: `for a in range(1, 4):
    for b in range(1, 4):
        print(a * b, end=" ")
    print()`,
      explain: "Внешний цикл — строки, внутренний — столбцы; пустой print() переводит строку.",
      lesson: "m4-l6",
    },
    {
      id: "m4-r5",
      title: "Лесенка из звёздочек",
      code: `for row in range(1, 5):
    print("*" * row)`,
      explain: "Длина строки зависит от номера шага — отсюда растущий узор.",
      lesson: "m4-l3",
    },
  ],

  cards: [
    { id: "m4-c1", front: "Какие числа даёт range(5)?", back: "0, 1, 2, 3, 4 — пять чисел, правая граница не входит.", lesson: "m4-l1" },
    { id: "m4-c2", front: "Что делает range(1, 10, 3)?", back: "Старт 1, финиш до 10, шаг 3: 1, 4, 7.", lesson: "m4-l1" },
    { id: "m4-c3", front: "Когда выбрать while, а не for?", back: "Когда число повторов заранее неизвестно, а важно условие («пока…»).", lesson: "m4-l2" },
    { id: "m4-c4", front: "Что делать, если while не заканчивается?", back: "Проверить, меняется ли внутри переменная из условия; условие должно когда-нибудь стать ложным.", lesson: "m4-l2" },
    { id: "m4-c5", front: "Чем break отличается от continue?", back: "break выходит из цикла целиком, continue пропускает только текущий шаг.", lesson: "m4-l5" },
    { id: "m4-c6", front: "Сколько раз выполнится тело вложенных циклов range(3) и range(4)?", back: "3 × 4 = 12 раз.", lesson: "m4-l6" },
    { id: "m4-c7", front: "Как напечатать «***» одной командой?", back: "print(\"*\" * 3) — строку можно умножить на число.", lesson: "m4-l3" },
  ],

  cheats: [
    { code: "for i in range(5):", text: "повторить пять раз, i = 0…4", lesson: "m4-l1" },
    { code: "range(1, 6)", text: "числа 1…5, правая граница не входит", lesson: "m4-l1" },
    { code: "while x > 0:", text: "повторять, пока условие истинно", lesson: "m4-l2" },
    { code: "break / continue", text: "выйти из цикла / пропустить шаг", lesson: "m4-l5" },
    { code: "print(x, end=\"\")", text: "печать без переноса строки", lesson: "m4-l6" },
    { code: "\"*\" * 3", text: "строка «***»: повторение символа", lesson: "m4-l3" },
  ],

  exercises: [
    {
      id: "m4-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет цикл?",
      code: `for i in range(3):
    print(i)`,
      expected: "0\n1\n2",
      options: ["1\n2\n3", "0\n1\n2", "0\n1\n2\n3"],
      correct: 1,
      explain: "range(3) — это 0, 1, 2: три числа, начиная с нуля.",
      lesson: "m4-l1",
    },
    {
      id: "m4-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет цикл?",
      code: `for n in range(2, 5):
    print(n * 2)`,
      expected: "4\n6\n8",
      options: ["4\n6\n8", "4\n6\n8\n10", "2\n3\n4"],
      correct: 0,
      explain: "n принимает 2, 3, 4 (пятёрка не входит), и каждое число удваивается.",
      lesson: "m4-l1",
    },
    {
      id: "m4-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет программа?",
      code: `count = 3

while count > 0:
    print(count)
    count = count - 1

print("Старт")`,
      expected: "3\n2\n1\nСтарт",
      options: ["3\n2\n1\nСтарт", "3\n2\n1\n0\nСтарт", "1\n2\n3\nСтарт"],
      correct: 0,
      explain: "Когда count становится 0, условие count > 0 ложно, цикл закончен — 0 не печатается.",
      lesson: "m4-l2",
    },
    {
      id: "m4-e04",
      type: "predict",
      level: 2,
      prompt: "Какое число будет выведено в конце?",
      code: `total = 0

for n in range(1, 5):
    total = total + n

print(total)`,
      expected: "10",
      options: ["4", "10", "15"],
      correct: 1,
      explain: "n принимает 1, 2, 3, 4: 1 + 2 + 3 + 4 = 10. Число 5 не входит.",
      lesson: "m4-l1",
    },
    {
      id: "m4-e05",
      type: "predict",
      level: 2,
      prompt: "Что выведет цикл с continue?",
      code: `for n in range(1, 6):
    if n % 2 == 0:
        continue
    print(n)`,
      expected: "1\n3\n5",
      options: ["2\n4", "1\n3\n5", "1\n2\n3\n4\n5"],
      correct: 1,
      explain: "Чётные числа вызывают continue и пропускают print. Остаются нечётные.",
      lesson: "m4-l5",
    },
    {
      id: "m4-e06",
      type: "predict",
      level: 2,
      prompt: "Что выведет цикл с break?",
      code: `for n in range(10):
    if n == 3:
        break
    print(n)
print("конец")`,
      expected: "0\n1\n2\nконец",
      options: ["0\n1\n2\nконец", "0\n1\n2\n3\nконец", "3\nконец"],
      correct: 0,
      explain: "На n = 3 срабатывает break — цикл прерывается до print. Затем выполняется строка после цикла.",
      lesson: "m4-l5",
    },
    {
      id: "m4-e07",
      type: "predict",
      level: 3,
      prompt: "Что выведут вложенные циклы?",
      code: `for a in range(2):
    for b in range(2):
        print(a, b)`,
      expected: "0 0\n0 1\n1 0\n1 1",
      options: ["0 0\n0 1\n1 0\n1 1", "0 0\n1 0\n0 1\n1 1", "0 0\n1 1"],
      correct: 0,
      explain: "Внешняя a стоит на месте, пока внутренняя b проходит все значения: сначала a = 0 с b = 0 и 1, потом a = 1.",
      lesson: "m4-l6",
    },
    {
      id: "m4-e08",
      type: "read",
      level: 2,
      prompt: "Чему будет равно n после выполнения цикла?",
      code: `n = 1

while n < 20:
    n = n * 2

print(n)`,
      options: ["16", "20", "32"],
      correct: 2,
      explain: "n принимает 1, 2, 4, 8, 16 — всё меньше 20, поэтому удваивается ещё раз до 32. Тогда условие ложно и цикл заканчивается.",
      lesson: "m4-l2",
    },
    {
      id: "m4-e09",
      type: "bug",
      level: 1,
      prompt: "В какой строке ошибка?",
      lines: ["for i in range(3)", "    print(i)"],
      badLine: 0,
      fix: "for i in range(3):",
      explain: "После заголовка for нужно двоеточие.",
      lesson: "m4-l1",
    },
    {
      id: "m4-e10",
      type: "bug",
      level: 1,
      prompt: "Цикл должен напечатать три строки, но тело не принадлежит циклу. В какой строке ошибка?",
      lines: ["for i in range(3):", "print(i)"],
      badLine: 1,
      fix: "    print(i)",
      explain: "Тело цикла обязательно сдвигается на четыре пробела. Без отступа Python не поймёт, что print — часть цикла.",
      lesson: "m4-l1",
    },
    {
      id: "m4-e11",
      type: "bug",
      level: 3,
      prompt: "Нужно вывести числа от 1 до 5, но выводится только до 4. Какая строка виновата?",
      lines: ["# вывести числа от 1 до 5", "for n in range(1, 5):", "    print(n)"],
      logic: true, // код запускается без ошибок, но результат не тот
      badLine: 1,
      fix: "for n in range(1, 6):",
      explain: "Правая граница range() не входит в ряд. Чтобы дошло до 5, нужно range(1, 6).",
      lesson: "m4-l1",
    },
    {
      id: "m4-e12",
      type: "fill",
      level: 1,
      prompt: "Допишите число, чтобы звёздочка была выведена три раза.",
      code: `for i in range(___):
    print("*")`,
      answers: ["3"],
      expected: "*\n*\n*",
      explain: "range(3) даёт три шага — значит, три звёздочки.",
      lesson: "m4-l1",
    },
    {
      id: "m4-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите выражение, чтобы цикл выводил 0, 1, 2 и закончился.",
      code: `n = 0

while n < 3:
    print(n)
    n = ___`,
      answers: ["n + 1", "1 + n"],
      expected: "0\n1\n2",
      explain: "Без увеличения n условие n < 3 всегда истинно. Прибавляем единицу на каждом шаге.",
      lesson: "m4-l2",
    },
    {
      id: "m4-e14",
      type: "assemble",
      level: 2,
      prompt: "Соберите цикл, который рисует лесенку «#», «##», «###».",
      pieces: [
        { id: "a", code: "for row in range(1, 4):" },
        { id: "b", code: "    print(\"#\" * row)" },
      ],
      solution: ["a", "b"],
      explain: "Заголовок цикла, затем тело с отступом: длина строки зависит от row.",
      lesson: "m4-l3",
    },
    {
      id: "m4-e15",
      type: "assemble",
      level: 3,
      prompt: "Соберите вложенные циклы, которые рисуют два ряда по три звёздочки.",
      pieces: [
        { id: "a", code: "for row in range(2):" },
        { id: "b", code: "    for col in range(3):" },
        { id: "c", code: "        print(\"*\", end=\"\")" },
        { id: "d", code: "    print()" },
      ],
      solution: ["a", "b", "c", "d"],
      explain: "Внешний цикл — строки, внутренний — столбцы; пустой print() стоит на уровне внутреннего for и переводит строку.",
      lesson: "m4-l6",
    },
  ],
};
