/**
 * Модуль 3. Ветвление — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: ветвление",
    points: [
      "if проверяет условие; если оно истинно, выполняется блок с отступом, иначе — блок else.",
      "После условия ставится двоеточие, а строки блока сдвигаются на четыре пробела.",
      "Сравнение (==, !=, >, <, >=, <=) отвечает True или False.",
      "= кладёт значение в переменную, == спрашивает «равно ли?».",
      "Строки сравниваются точно: регистр и пробелы важны.",
      "elif добавляет ещё одну дорогу; срабатывает только первая подходящая ветка.",
      "and требует обе части истинными, or — хотя бы одну, not переворачивает ответ.",
      "Приоритет: not, затем and, затем or; скобки меняют порядок.",
      "Вложенный if проверяется только если сработал внешний; диапазоны проверяют от узкого к широкому.",
    ],
  },

  glossary: [
    { term: "условие", definition: "Вопрос, на который Python отвечает True или False. От ответа зависит, какая ветка выполнится.", lesson: "m3-l1" },
    { term: "ветвление", definition: "Развилка в программе: в зависимости от условия выполняется один код или другой.", lesson: "m3-l1" },
    { term: "отступ", definition: "Четыре пробела в начале строки. Показывают, что строка входит в блок if, elif или else.", lesson: "m3-l1" },
    { term: "True и False", definition: "Два значения «истина» и «ложь». Именно их возвращают сравнения.", lesson: "m3-l4" },
    { term: "сравнение", definition: "Вопрос про два значения: равны ли, больше ли, меньше ли. Например, age >= 18.", lesson: "m3-l4" },
    { term: "elif", definition: "«А если…»: ещё одно условие в цепочке. Проверяется, только если предыдущие ложны.", lesson: "m3-l2" },
    { term: "and, or, not", definition: "Слова для сложных условий: «и», «или», «не».", lesson: "m3-l5" },
    { term: "вложенное условие", definition: "if внутри другого if. Внутренний вопрос задаётся, только если ответ на внешний «да».", lesson: "m3-l6" },
  ],

  recipes: [
    {
      id: "m3-r1",
      title: "Развилка if / else",
      code: `age = 20

if age >= 18:
    print("Взрослый")
else:
    print("Ребёнок")`,
      explain: "Две дороги: одна для «да», другая для «нет». Не забудьте двоеточия и отступы.",
      lesson: "m3-l1",
    },
    {
      id: "m3-r2",
      title: "Оценка по цепочке elif",
      code: `score = 75

if score >= 90:
    print("Отлично")
elif score >= 60:
    print("Хорошо")
else:
    print("Ещё тренируемся")`,
      explain: "Самое строгое условие — первым. Срабатывает одна первая подходящая ветка.",
      lesson: "m3-l2",
    },
    {
      id: "m3-r3",
      title: "Составное условие",
      code: `age = 20
has_ticket = True

if age >= 16 and has_ticket:
    print("Проходите")
else:
    print("Вход закрыт")`,
      explain: "and пропускает только тех, у кого верны обе части.",
      lesson: "m3-l5",
    },
    {
      id: "m3-r4",
      title: "Вложенный if",
      code: `is_open = True
money = 40

if is_open:
    if money >= 50:
        print("Покупаем")
    else:
        print("Не хватает денег")
else:
    print("Магазин закрыт")`,
      explain: "Второй вопрос задаётся, только если на первый ответ «да».",
      lesson: "m3-l6",
    },
  ],

  cards: [
    { id: "m3-c1", front: "Как записать развилку «если… иначе»?", back: "if условие:  …  else:  … (двоеточия и отступ в четыре пробела)", lesson: "m3-l1" },
    { id: "m3-c2", front: "Чем отличаются = и ==?", back: "= кладёт значение в переменную, == сравнивает и отвечает True или False.", lesson: "m3-l4" },
    { id: "m3-c3", front: "Что выведет print(5 != 5)?", back: "False: 5 равно 5, поэтому «не равно» неверно.", lesson: "m3-l4" },
    { id: "m3-c4", front: "Сколько веток цепочки if / elif / else выполнится?", back: "Только одна: первая с истинным условием, иначе else.", lesson: "m3-l2" },
    { id: "m3-c5", front: "Когда and даёт True?", back: "Только если обе части истинны. or — если истинна хотя бы одна.", lesson: "m3-l5" },
    { id: "m3-c6", front: "Какой порядок у not, and, or?", back: "Сначала not, потом and, потом or. Скобки меняют порядок.", lesson: "m3-l5" },
    { id: "m3-c7", front: "В каком порядке проверять диапазоны в elif?", back: "От самого узкого условия к широкому.", lesson: "m3-l6" },
  ],

  cheats: [
    { code: "if x > 0:", text: "если условие истинно — выполнить блок", lesson: "m3-l1" },
    { code: "elif x == 0:", text: "а если нет, то проверить это", lesson: "m3-l2" },
    { code: "else:", text: "во всех остальных случаях", lesson: "m3-l1" },
    { code: "== != > < >= <=", text: "сравнения, ответ True или False", lesson: "m3-l4" },
    { code: "a and b / a or b / not a", text: "и, или, не", lesson: "m3-l5" },
    { code: "    if y:", text: "вложенное условие: ещё четыре пробела", lesson: "m3-l6" },
  ],

  exercises: [
    {
      id: "m3-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет программа?",
      code: `age = 20

if age >= 18:
    print("Взрослый")
else:
    print("Ребёнок")`,
      expected: "Взрослый",
      options: ["Взрослый", "Ребёнок", "Взрослый\nРебёнок"],
      correct: 0,
      explain: "20 >= 18 истинно, поэтому выполняется блок if, а else пропускается.",
      lesson: "m3-l1",
    },
    {
      id: "m3-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет print?",
      code: `print(7 != 7)`,
      expected: "False",
      options: ["True", "False", "7"],
      correct: 1,
      explain: "!= значит «не равно». 7 равно 7, поэтому ответ False.",
      lesson: "m3-l4",
    },
    {
      id: "m3-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет цепочка условий?",
      code: `score = 75

if score >= 90:
    print("Отлично")
elif score >= 60:
    print("Хорошо")
else:
    print("Ещё тренируемся")`,
      expected: "Хорошо",
      options: ["Отлично", "Хорошо", "Ещё тренируемся", "Хорошо\nЕщё тренируемся"],
      correct: 1,
      explain: "Первое условие ложно, второе истинно. Остальное Python пропускает.",
      lesson: "m3-l2",
    },
    {
      id: "m3-e04",
      type: "predict",
      level: 3,
      prompt: "Что выведут две строки?",
      code: `print(True or False and False)
print((True or False) and False)`,
      expected: "True\nFalse",
      options: ["True\nTrue", "True\nFalse", "False\nFalse", "False\nTrue"],
      correct: 1,
      explain: "Без скобок сначала считается and (False), потом or даёт True. Со скобками or считается первым, и and даёт False.",
      lesson: "m3-l5",
    },
    {
      id: "m3-e05",
      type: "predict",
      level: 2,
      prompt: "Что выведет программа?",
      code: `rain = True
umbrella = False

if rain and not umbrella:
    print("Промокнем")
else:
    print("Сухо")`,
      expected: "Промокнем",
      options: ["Промокнем", "Сухо", "Ошибка"],
      correct: 0,
      explain: "not umbrella даёт True, и вместе с rain условие истинно.",
      lesson: "m3-l5",
    },
    {
      id: "m3-e06",
      type: "predict",
      level: 3,
      prompt: "Что выведет вложенное условие?",
      code: `has_ticket = True
age = 15

if has_ticket:
    if age >= 18:
        print("Проходите")
    else:
        print("Со взрослыми")
else:
    print("Купите билет")`,
      expected: "Со взрослыми",
      options: ["Проходите", "Со взрослыми", "Купите билет"],
      correct: 1,
      explain: "Билет есть, внешний if сработал. Внутри 15 >= 18 ложно, поэтому выполняется внутренний else.",
      lesson: "m3-l6",
    },
    {
      id: "m3-e07",
      type: "read",
      level: 2,
      prompt: "Для score = 95 какая ветка сработает?",
      code: `score = 95

if score >= 60:
    print("Хорошо")
elif score >= 90:
    print("Отлично")
else:
    print("Ещё тренируемся")`,
      options: ["«Хорошо», потому что условие стоит первым", "«Отлично», потому что 95 больше 90", "Обе ветки сразу", "«Ещё тренируемся»"],
      correct: 0,
      explain: "95 >= 60 истинно, и Python останавливается. До второго условия дело не доходит. Строгое условие нужно ставить выше.",
      lesson: "m3-l2",
    },
    {
      id: "m3-e08",
      type: "read",
      level: 2,
      prompt: "Сколько строк выведет эта программа?",
      code: `score = 95

if score >= 90:
    print("Отлично")
if score >= 60:
    print("Хорошо")`,
      options: ["Две строки: оба if проверяются отдельно", "Одну строку", "Ни одной"],
      correct: 0,
      explain: "Это два независимых if, а не цепочка. Оба условия истинны, поэтому выводятся обе фразы. Для выбора одной ветки нужен elif.",
      lesson: "m3-l2",
    },
    {
      id: "m3-e09",
      type: "bug",
      level: 1,
      prompt: "В какой строке ошибка?",
      lines: ["x = 5", "if x = 5:", "    print(\"Пять\")"],
      badLine: 1,
      fix: "if x == 5:",
      explain: "В условии нужно сравнение ==, а не присваивание =.",
      lesson: "m3-l4",
    },
    {
      id: "m3-e10",
      type: "bug",
      level: 1,
      prompt: "Найдите строку, где забыто двоеточие.",
      lines: ["age = 12", "if age < 14", "    print(\"Детский билет\")", "else:", "    print(\"Обычный билет\")"],
      badLine: 1,
      fix: "if age < 14:",
      explain: "После условия if всегда ставится двоеточие.",
      lesson: "m3-l1",
    },
    {
      id: "m3-e11",
      type: "bug",
      level: 3,
      prompt: "Для age = 10 программа должна вывести «Ребёнок», но выводит «Взрослый». Какая строка виновата?",
      lines: ["age = 10", "if age >= 14:", "    print(\"Ребёнок\")", "else:", "    print(\"Взрослый\")"],
      logic: true, // код запускается без ошибок, но отвечает наоборот
      badLine: 1,
      fix: "if age < 14:",
      explain: "Условие перевёрнуто: age >= 14 описывает подростков и взрослых, а не детей. Для ребёнка нужно age < 14.",
      lesson: "m3-l4",
    },
    {
      id: "m3-e12",
      type: "fill",
      level: 1,
      prompt: "Допишите знак сравнения, чтобы вывелось True.",
      code: `print(5 ___ 3)`,
      answers: [">", ">=", "!="],
      expected: "True",
      explain: "5 больше 3, не равно 3 и больше или равно 3 — все эти вопросы дают True.",
      lesson: "m3-l4",
    },
    {
      id: "m3-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите слово, чтобы предупреждение выводилось и при морозе, и при жаре.",
      code: `temp = -3

if temp < 0 ___ temp > 35:
    print("Осторожно")`,
      answers: ["or"],
      expected: "Осторожно",
      explain: "Нужно «хотя бы одно из двух»: or. С and условие было бы ложным: число не может быть и меньше 0, и больше 35.",
      lesson: "m3-l5",
    },
    {
      id: "m3-e14",
      type: "assemble",
      level: 1,
      prompt: "Соберите развилку: если число положительное, вывести «Плюс», иначе «Не плюс».",
      pieces: [
        { id: "a", code: "n = 4" },
        { id: "b", code: "if n > 0:" },
        { id: "c", code: "    print(\"Плюс\")" },
        { id: "d", code: "else:" },
        { id: "e", code: "    print(\"Не плюс\")" },
      ],
      solution: ["a", "b", "c", "d", "e"],
      explain: "Сначала переменная, затем if с отступом, потом else с отступом.",
      lesson: "m3-l1",
    },
    {
      id: "m3-e15",
      type: "assemble",
      level: 2,
      prompt: "Соберите цепочку: сначала «Жарко», потом «Тепло», иначе «Мороз».",
      pieces: [
        { id: "a", code: "temp = 25" },
        { id: "b", code: "if temp > 20:" },
        { id: "c", code: "    print(\"Жарко\")" },
        { id: "d", code: "elif temp > 0:" },
        { id: "e", code: "    print(\"Тепло\")" },
        { id: "f", code: "else:" },
        { id: "g", code: "    print(\"Мороз\")" },
      ],
      solution: ["a", "b", "c", "d", "e", "f", "g"],
      explain: "Условия идут от самого строгого к широкому, elif стоит между if и else.",
      lesson: "m3-l2",
    },
  ],
};
