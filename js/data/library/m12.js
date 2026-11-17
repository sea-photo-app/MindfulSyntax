/**
 * Модуль 12. Финальный проект — дополнительные данные:
 * конспект «что дальше», глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: финальный проект и что дальше",
    points: [
      "Идея проекта умещается в одну фразу и в 50–100 строк. Подходят викторина, генератор историй и трекер привычек.",
      "Пять уровней готовности: 1 MVP работает, 2 очки и уровни, 3 сохранение и подсказки, 4 своя фича, 5 читаемый код, README и тесты.",
      "Данные проекта лежат в списках и словарях: список словарей — это картотека из карточек. Для каждого повторяющегося действия своя функция.",
      "План пишут комментариями: идея, данные, функции, шаги. Потом комментарии заменяют кодом по одному.",
      "MVP — самая простая версия, которая работает от начала до конца. Проверку ответа выносят в функцию без input().",
      "Улучшения добавляют по одному и запускают после каждого. Рекорд хранят в файле, читают через try/except FileNotFoundError.",
      "assert молчит, когда всё верно, и падает с AssertionError, когда нет. Тестируйте границы: 80 процентов, пустую строку, ноль.",
      "README в начале файла: что это, как запустить, что умеет. Константы наверху файла вместо магических чисел.",
      "Что дальше: классы и объекты, JSON и csv, веб и боты, графика. Метод тот же: идея, данные, MVP, уровни, тесты.",
    ],
  },

  glossary: [
    { term: "MVP", definition: "Самая простая версия проекта, которая уже делает главное от начала до конца. Красота и бонусы добавляются потом.", lesson: "m12-l3" },
    { term: "критерии готовности", definition: "Список условий, при выполнении которых проект считается законченным. Они помогают вовремя остановиться.", lesson: "m12-l1" },
    { term: "уровни готовности", definition: "Пять ступеней проекта: работает, очки и уровни, сохранение и подсказки, своя фича, читаемый код с README и тестами.", lesson: "m12-l1" },
    { term: "структура данных", definition: "Способ хранить информацию проекта: список, словарь или список словарей. Выбирается до написания логики.", lesson: "m12-l2" },
    { term: "assert", definition: "Команда-проверка. Если выражение верно, она молчит, а если нет, останавливает программу с AssertionError.", lesson: "m12-l5" },
    { term: "тест", definition: "Короткая проверка, которая вызывает функцию с заранее известными данными и сверяет результат с ожидаемым.", lesson: "m12-l5" },
    { term: "крайний случай", definition: "Необычное значение на границе допустимого: ноль, пустая строка, ровно 80 процентов. Именно там чаще всего прячутся ошибки.", lesson: "m12-l5" },
    { term: "README", definition: "Короткое описание проекта в начале файла: что это, как запустить, что умеет.", lesson: "m12-l6" },
    { term: "константа", definition: "Переменная, которая не меняется во время работы программы. По традиции имя пишут заглавными буквами и держат наверху файла.", lesson: "m12-l6" },
  ],

  recipes: [
    {
      id: "m12-r1",
      title: "Проверка ответа без учёта регистра",
      code: `def check_answer(question, answer):
    return answer.strip().lower() == question["a"]

q = {"q": "Каким словом начинается функция?", "a": "def"}
print(check_answer(q, "  DEF "))
print(check_answer(q, "class"))`,
      explain: "Функция без input() принимает вопрос и ответ и возвращает True или False. Её просто проверять и использовать в игровом цикле.",
      lesson: "m12-l3",
    },
    {
      id: "m12-r2",
      title: "Звание по доле очков",
      code: `def grade(score, total):
    percent = score * 100 // total
    if percent >= 80:
        return "Мастер сада"
    elif percent >= 50:
        return "Садовник"
    return "Росток"

print(grade(9, 10))
print(grade(4, 10))`,
      explain: "Сначала проверяют самое строгое условие. Граница включается знаком >=, иначе ровно 80 процентов не попадёт в «Мастера».",
      lesson: "m12-l4",
    },
    {
      id: "m12-r3",
      title: "Рекорд в файле",
      code: `def load_record(filename):
    try:
        with open(filename) as f:
            return int(f.read())
    except FileNotFoundError:
        return 0

def save_record(filename, score):
    with open(filename, "w") as f:
        f.write(str(score))

save_record("recipe_record.txt", 5)
print(load_record("recipe_record.txt"))`,
      explain: "При первом запуске файла нет, поэтому чтение обёрнуто в try/except. Записываем число строкой, читаем обратно через int().",
      lesson: "m12-l4",
    },
    {
      id: "m12-r4",
      title: "Тесты в одной функции",
      code: `def streak_bonus(streak):
    if streak > 0 and streak % 3 == 0:
        return 1
    return 0

def run_tests():
    assert streak_bonus(3) == 1
    assert streak_bonus(2) == 0
    assert streak_bonus(0) == 0
    print("Тесты пройдены")

run_tests()`,
      explain: "Все проверки живут в run_tests(). Вызывайте её при запуске программы: если что-то сломали, вы узнаете сразу.",
      lesson: "m12-l5",
    },
  ],

  cards: [
    { id: "m12-c1", front: "Что такое MVP?", back: "Самая простая версия проекта, которая работает от начала до конца. Остальное добавляется потом.", lesson: "m12-l3" },
    { id: "m12-c2", front: "Назовите пять уровней готовности проекта.", back: "1 MVP работает; 2 очки и уровни; 3 сохранение и подсказки; 4 своя фича; 5 читаемый код, README и тесты.", lesson: "m12-l1" },
    { id: "m12-c3", front: "Как хранить много вопросов с ответами?", back: "Список словарей: [{\"q\": \"...\", \"a\": \"...\"}, ...].", lesson: "m12-l2" },
    { id: "m12-c4", front: "Что делает assert?", back: "Молчит, если выражение верно; при неверном падает с AssertionError.", lesson: "m12-l5" },
    { id: "m12-c5", front: "Как прочитать файл, которого может не быть?", back: "try: with open(имя) as f: ... except FileNotFoundError: вернуть значение по умолчанию.", lesson: "m12-l4" },
    { id: "m12-c6", front: "Что должно быть в README?", back: "Что это, как запустить, что умеет.", lesson: "m12-l6" },
  ],

  cheats: [
    { code: "# Уровень 1: MVP работает", text: "критерий готовности записывают комментарием", lesson: "m12-l1" },
    { code: "QUESTIONS = [{\"q\": \"...\", \"a\": \"...\"}]", text: "картотека: список словарей", lesson: "m12-l2" },
    { code: "answer.strip().lower() == question[\"a\"]", text: "сравнить ответ без учёта пробелов и регистра", lesson: "m12-l3" },
    { code: "except FileNotFoundError:", text: "файла ещё нет: вернуть значение по умолчанию", lesson: "m12-l4" },
    { code: "assert grade(8, 10) == \"Мастер\"", text: "проверка: молчит, если верно", lesson: "m12-l5" },
    { code: "# README\n# Что это:\n# Как запустить:", text: "табличка проекта в начале файла", lesson: "m12-l6" },
  ],

  exercises: [
    {
      id: "m12-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `QUESTIONS = [
    {"q": "Столица Франции?", "a": "париж"},
    {"q": "Сколько лап у кошки?", "a": "4"},
]
print(len(QUESTIONS))
print(QUESTIONS[1]["a"])`,
      expected: "2\n4",
      options: ["2\n4", "2\nпариж", "1\n4", "4\n2"],
      correct: 0,
      explain: "В списке два словаря. QUESTIONS[1] — второй, его ключ \"a\" равен \"4\".",
      lesson: "m12-l2",
    },
    {
      id: "m12-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `def check_answer(question, answer):
    return answer.strip().lower() == question["a"]

q = {"q": "?", "a": "def"}
print(check_answer(q, " DEF "))`,
      expected: "True",
      options: ["True", "False", "def", "Ошибка"],
      correct: 0,
      explain: "strip() убирает пробелы, lower() делает буквы строчными. Получается \"def\", оно равно ответу.",
      lesson: "m12-l3",
    },
    {
      id: "m12-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def grade(score, total):
    percent = score * 100 // total
    if percent >= 80:
        return "Мастер"
    elif percent >= 50:
        return "Садовник"
    return "Росток"

print(grade(8, 10))
print(grade(4, 10))`,
      expected: "Мастер\nРосток",
      options: ["Мастер\nРосток", "Садовник\nРосток", "Мастер\nСадовник", "Росток\nРосток"],
      correct: 0,
      explain: "8 из 10 — это 80 процентов, граница включена знаком >=, поэтому Мастер. 4 из 10 — 40 процентов: Росток.",
      lesson: "m12-l4",
    },
    {
      id: "m12-e04",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def streak_bonus(streak):
    if streak > 0 and streak % 3 == 0:
        return 1
    return 0

total = 0
for n in [1, 2, 3, 4, 5, 6]:
    total += streak_bonus(n)
print(total)`,
      expected: "2",
      options: ["2", "1", "3", "0"],
      correct: 0,
      explain: "Бонус даёт каждое число, кратное трём: 3 и 6. Всего 2.",
      lesson: "m12-l4",
    },
    {
      id: "m12-e05",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def load_record(filename):
    try:
        with open(filename) as f:
            return int(f.read())
    except FileNotFoundError:
        return 0

print(load_record("no_such_file_12.txt"))`,
      expected: "0",
      options: ["0", "Ошибка FileNotFoundError", "None", "пусто"],
      correct: 0,
      explain: "Файла нет, поэтому срабатывает except и функция возвращает 0.",
      lesson: "m12-l4",
    },
    {
      id: "m12-e06",
      type: "predict",
      level: 3,
      prompt: "Что выведет код?",
      code: `def double(x):
    return x * 2

assert double(2) == 4
assert double(0) == 0
print("ok")`,
      expected: "ok",
      options: ["ok", "AssertionError", "4", "ничего"],
      correct: 0,
      explain: "Обе проверки верны, assert молчит, и программа доходит до print.",
      lesson: "m12-l5",
    },
    {
      id: "m12-e07",
      type: "read",
      level: 1,
      prompt: "Что делает функция make_hint?",
      code: `def make_hint(question):
    word = question["a"]
    return f"Подсказка: слово начинается на {word[0]}, букв: {len(word)}"

print(make_hint({"q": "?", "a": "print"}))`,
      options: [
        "Показывает первую букву ответа и число букв",
        "Показывает весь ответ",
        "Проверяет ответ игрока",
        "Считает очки",
      ],
      correct: 0,
      explain: "word[0] — первая буква, len(word) — длина слова. Игрок получает намёк, но не готовый ответ.",
      lesson: "m12-l4",
    },
    {
      id: "m12-e08",
      type: "read",
      level: 2,
      prompt: "Что выведет код и почему здесь прячется ошибка?",
      code: `def grade(score, total):
    percent = score * 100 // total
    if percent > 80:
        return "Мастер"
    return "Садовник"

print(grade(9, 10))
print(grade(8, 10))`,
      options: [
        "Мастер и Садовник: ровно 80 процентов не больше 80, нужно >=",
        "Мастер и Мастер",
        "Садовник и Садовник",
        "Будет SyntaxError",
      ],
      correct: 0,
      explain: "При 8 из 10 percent равен 80, а условие percent > 80 неверно, поэтому вернётся «Садовник». Тест на границу поймал бы ошибку: нужно >=.",
      lesson: "m12-l5",
    },
    {
      id: "m12-e09",
      type: "read",
      level: 2,
      prompt: "Зачем в этом коде нужен try/except?",
      code: `def load_record(filename):
    try:
        with open(filename) as f:
            return int(f.read())
    except FileNotFoundError:
        return 0

print(load_record("never_created_12.txt"))`,
      options: [
        "Чтобы при первом запуске, когда файла ещё нет, вернуть 0 вместо ошибки",
        "Чтобы ускорить чтение файла",
        "Чтобы файл создался сам",
        "Чтобы не писать int()",
      ],
      correct: 0,
      explain: "open() не создаёт файл при чтении. Без try/except первый запуск упал бы с FileNotFoundError.",
      lesson: "m12-l4",
    },
    {
      id: "m12-e10",
      type: "bug",
      level: 2,
      prompt: "В функции есть ошибка. Найдите строку.",
      lines: [
        "def check_answer(question, answer):",
        "    return answer.strip().lower() = question[\"a\"]",
        "",
        "q = {\"q\": \"?\", \"a\": \"def\"}",
        "print(check_answer(q, \"def\"))",
      ],
      badLine: 1,
      fix: "    return answer.strip().lower() == question[\"a\"]",
      explain: "Для сравнения нужен знак ==. Одиночный = — присваивание, и Python сообщает SyntaxError.",
      lesson: "m12-l3",
    },
    {
      id: "m12-e11",
      type: "bug",
      level: 3,
      prompt: "Игрок ввёл ответ верно, но счёт не растёт. Найдите строку с ошибкой.",
      lines: [
        "def run_quiz(answers, correct):",
        "    score = 0",
        "    for a, c in zip(answers, correct):",
        "        if a == c:",
        "            score = 1",
        "    return score",
        "",
        "print(run_quiz([\"a\", \"b\", \"c\"], [\"a\", \"b\", \"c\"]))",
      ],
      badLine: 4,
      fix: "            score += 1",
      logic: true,
      explain: "score = 1 каждый раз записывает единицу, а не добавляет. Нужно score += 1: правильный вывод 3.",
      lesson: "m12-l3",
    },
    {
      id: "m12-e12",
      type: "fill",
      level: 1,
      prompt: "Допишите проверку ответа.",
      code: `def check_answer(question, answer):
    return answer.___.lower() == question["a"]

print(check_answer({"q": "?", "a": "def"}, "  Def "))`,
      answers: ["strip()"],
      expected: "True",
      explain: "strip() убирает пробелы по краям. Без него «  def » не равно «def».",
      lesson: "m12-l3",
    },
    {
      id: "m12-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите, чтобы сохранить число в файл и прочитать обратно.",
      code: `with open("fill_record_12.txt", "___") as f:
    f.write("7")

with open("fill_record_12.txt") as f:
    print(f.read())`,
      answers: ["w"],
      expected: "7",
      explain: "Режим \"w\" открывает файл для записи (и создаёт его). Потом файл читается как обычно.",
      lesson: "m12-l4",
    },
    {
      id: "m12-e14",
      type: "assemble",
      level: 2,
      prompt: "Соберите программу: функция с тестом и вывод сообщения.",
      pieces: [
        { id: "a", code: "def double(x):" },
        { id: "b", code: "    return x * 2" },
        { id: "c", code: "assert double(3) == 6" },
        { id: "d", code: "print(\"Тест пройден\")" },
      ],
      solution: ["a", "b", "c", "d"],
      explain: "Сначала определяем функцию, затем проверяем её через assert, и только потом печатаем сообщение: функция должна существовать до вызова.",
      lesson: "m12-l5",
    },
  ],
};
