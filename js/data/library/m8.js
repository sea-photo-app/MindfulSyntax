/**
 * Модуль 8. Мини-проект «Угадай число» — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: проект «Угадай число»",
    points: [
      "Игра собирается из четырёх частей: секрет (random.randint), ввод (input и int), сравнение (if / elif / else) и повтор (while с счётчиком попыток).",
      "Секрет загадывают один раз до цикла; счётчик попыток увеличивают сразу после ввода.",
      "Игра с одной попыткой — та же игра с лимитом 1. Лимит удобно хранить в переменной.",
      "Уровни сложности лежат в словаре: {\"1\": {\"name\": ..., \"max\": ..., \"tries\": ...}}. Выбор — LEVELS.get(ключ, запасной_уровень).",
      "Очки считает отдельная функция, например calc_score(used, limit) = (limit - used + 1) * 10: она возвращает число, а не печатает.",
      "abs(a - b) — расстояние между числами. Если оно уменьшилось по сравнению с прошлой попыткой — «теплее», выросло — «холоднее».",
      "Оставшиеся попытки — limit - used. Если цикл закончился без победы, сообщите секрет и мягко предложите сыграть ещё.",
      "Красивый вывод: рамка \"=\" * (len(text) + 4), правила в нескольких print, выравнивание в f-строке: {name:<8} влево, {score:>5} вправо, {x:.1f} один знак после точки.",
      "Тестируйте логику без ввода: функция check_guess(secret, guess) возвращает \"win\", \"low\" или \"high\", её вызывают с готовыми значениями и сравнивают с ожидаемым.",
    ],
  },

  glossary: [
    { term: "секрет", definition: "Число, которое загадал компьютер. Создаётся один раз до цикла через random.randint.", lesson: "m8-l1" },
    { term: "счётчик попыток", definition: "Переменная, которая растёт на единицу после каждого ввода. По ней цикл знает, когда остановиться.", lesson: "m8-l1" },
    { term: "лимит попыток", definition: "Наибольшее число ответов, которое игра принимает. Хранится в переменной, поэтому один код подходит для разных режимов.", lesson: "m8-l2" },
    { term: "уровень сложности", definition: "Набор настроек игры: диапазон числа и число попыток. Удобно хранить в словаре.", lesson: "m8-l3" },
    { term: "запасное значение", definition: "Второй аргумент метода .get: его вернут, если ключа в словаре нет. Защищает от неверного ввода.", lesson: "m8-l3" },
    { term: "abs", definition: "Встроенная функция, убирающая знак числа: abs(-5) даёт 5. Нужна для расстояния между числами.", lesson: "m8-l4" },
    { term: "расстояние до секрета", definition: "abs(guess - secret): насколько ответ далёк от секрета. По его изменению строят подсказки «теплее» и «холоднее».", lesson: "m8-l4" },
    { term: "выравнивание в f-строке", definition: "Запись {значение:<8} или {значение:>5} внутри f-строки задаёт ширину поля и прижимает значение влево или вправо.", lesson: "m8-l5" },
    { term: "тест", definition: "Проверка: вызвать функцию с готовыми значениями и сравнить результат с ожидаемым.", lesson: "m8-l6" },
  ],

  recipes: [
    {
      id: "m8-r1",
      title: "Игра с попытками (ядро)",
      code: `secret = 12
limit = 3
used = 0
guess = 0

for answer in [7, 15, 12]:
    guess = answer
    used = used + 1
    if guess == secret:
        print(f"Угадал за {used}!")
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")`,
      explain: "Те же шаги, что в игре: счётчик, сравнение, подсказки и break при победе. Ответы здесь взяты из списка, чтобы пример можно было запустить.",
      lesson: "m8-l1",
    },
    {
      id: "m8-r2",
      title: "Уровни в словаре",
      code: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
}

level = LEVELS.get("9", LEVELS["2"])
print(level["name"], level["max"], level["tries"])`,
      explain: "Неизвестный ключ «9» даёт запасной уровень «2». Настройки лежат в одном месте, и игра их только читает.",
      lesson: "m8-l3",
    },
    {
      id: "m8-r3",
      title: "Теплее или холоднее",
      code: `def warmth(secret, guess, prev_guess):
    now = abs(guess - secret)
    before = abs(prev_guess - secret)
    if now < before:
        return "Теплее"
    elif now > before:
        return "Холоднее"
    else:
        return "Так же"

print(warmth(10, 9, 4))`,
      explain: "Сравниваем расстояние до секрета сейчас и на прошлой попытке. Подсказка нужна со второй попытки.",
      lesson: "m8-l4",
    },
    {
      id: "m8-r4",
      title: "Рамка и тест",
      code: `def banner(text):
    line = "=" * (len(text) + 4)
    print(line)
    print(f"| {text} |")
    print(line)

def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

banner("Тест")
print(check_guess(5, 8) == "high")`,
      explain: "Рамка украшает вывод, а сравнение результата check_guess с ожидаемым словом — самый простой тест без ввода.",
      lesson: "m8-l6",
    },
  ],

  cards: [
    { id: "m8-c1", front: "Где в игре загадывают секрет и почему?", back: "Один раз до цикла. Внутри цикла число менялось бы после каждой попытки.", lesson: "m8-l1" },
    { id: "m8-c2", front: "Как превратить игру на шесть попыток в игру на одну?", back: "Поставить лимит попыток limit = 1 — цикл выполнится один раз.", lesson: "m8-l2" },
    { id: "m8-c3", front: "Как выбрать уровень из словаря и не упасть на неверном ключе?", back: "LEVELS.get(ключ, запасной_уровень) — вернёт запасной уровень.", lesson: "m8-l3" },
    { id: "m8-c4", front: "Как посчитать расстояние между двумя числами?", back: "abs(a - b). Знак не важен: abs(3 - 8) и abs(8 - 3) — оба 5.", lesson: "m8-l4" },
    { id: "m8-c5", front: "Как понять «теплее» или «холоднее»?", back: "Сравнить abs(guess - secret) сейчас и на прошлой попытке: стало меньше — теплее.", lesson: "m8-l4" },
    { id: "m8-c6", front: "Что значит {score:>5} в f-строке?", back: "Поле шириной 5, число прижато вправо. {name:<8} — влево.", lesson: "m8-l5" },
    { id: "m8-c7", front: "Как проверить логику игры без ввода?", back: "Вынести её в функцию check_guess(secret, guess) и вызывать с готовыми значениями, сравнивая с ожидаемым.", lesson: "m8-l6" },
  ],

  cheats: [
    { code: "random.randint(1, 20)", text: "загадать число от 1 до 20", lesson: "m8-l1" },
    { code: "while used < limit:", text: "цикл попыток с лимитом", lesson: "m8-l2" },
    { code: "LEVELS.get(key, LEVELS[\"2\"])", text: "уровень с запасным вариантом", lesson: "m8-l3" },
    { code: "abs(guess - secret)", text: "расстояние до секрета", lesson: "m8-l4" },
    { code: "f\"{name:<8}{score:>5}\"", text: "выровнять значения по колонкам", lesson: "m8-l5" },
    { code: "check_guess(7, 3) == \"low\"", text: "проверить функцию без ввода", lesson: "m8-l6" },
  ],

  exercises: [
    {
      id: "m8-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `print(abs(-5))
print(abs(3 - 8))`,
      expected: "5\n5",
      options: ["5\n5", "-5\n-5", "5\n-5"],
      correct: 0,
      explain: "abs убирает знак: abs(-5) = 5, а 3 - 8 = -5, значит abs даёт тоже 5.",
      lesson: "m8-l4",
    },
    {
      id: "m8-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет код?",
      code: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10},
    "2": {"name": "Трудный", "max": 50},
}

level = LEVELS["2"]
print(level["name"], level["max"])`,
      expected: "Трудный 50",
      options: ["Лёгкий 10", "Трудный 50", "Трудный 10"],
      correct: 1,
      explain: "LEVELS[\"2\"] — вложенный словарь с названием «Трудный» и максимумом 50.",
      lesson: "m8-l3",
    },
    {
      id: "m8-e03",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def calc_score(used, limit):
    return (limit - used + 1) * 10

print(calc_score(1, 6))
print(calc_score(4, 6))`,
      expected: "60\n30",
      options: ["60\n30", "60\n20", "50\n30"],
      correct: 0,
      explain: "Первая: (6 - 1 + 1) * 10 = 60. Вторая: (6 - 4 + 1) * 10 = 30.",
      lesson: "m8-l3",
    },
    {
      id: "m8-e04",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def warmth(secret, guess, prev_guess):
    now = abs(guess - secret)
    before = abs(prev_guess - secret)
    if now < before:
        return "Теплее"
    elif now > before:
        return "Холоднее"
    else:
        return "Так же"

print(warmth(10, 3, 8))
print(warmth(10, 12, 8))`,
      expected: "Холоднее\nТак же",
      options: ["Теплее\nТак же", "Холоднее\nТак же", "Холоднее\nХолоднее"],
      correct: 1,
      explain: "Первая пара: расстояние выросло с 2 до 7. Вторая: расстояние 2 и 2, ничего не изменилось.",
      lesson: "m8-l4",
    },
    {
      id: "m8-e05",
      type: "predict",
      level: 2,
      prompt: "Что выведет код?",
      code: `def banner(text):
    line = "=" * (len(text) + 4)
    print(line)
    print(f"| {text} |")
    print(line)

banner("Сад")`,
      expected: "=======\n| Сад |\n=======",
      options: ["===\n| Сад |\n===", "=======\n| Сад |\n=======", "=======\nСад\n======="],
      correct: 1,
      explain: "В слове три буквы плюс 4 символа даёт линию из 7 знаков. Средняя строка содержит текст между чертами.",
      lesson: "m8-l5",
    },
    {
      id: "m8-e06",
      type: "predict",
      level: 3,
      prompt: "Что выведет код? Обратите внимание на ширину полей.",
      code: `print(f"{'Аня':<6}{25:>4}|")`,
      expected: "Аня     25|",
      options: ["Аня     25|", "Аня25|", "   Аня  25|"],
      correct: 0,
      explain: "Имя занимает 6 позиций и прижато влево (три пробела справа), число — 4 позиции, прижато вправо (два пробела слева). Всего пять пробелов между ними.",
      lesson: "m8-l5",
    },
    {
      id: "m8-e07",
      type: "predict",
      level: 3,
      prompt: "Что выведет код?",
      code: `def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

print(check_guess(7, 3) == "low")
print(check_guess(7, 9) == "low")`,
      expected: "True\nFalse",
      options: ["True\nTrue", "True\nFalse", "False\nFalse"],
      correct: 1,
      explain: "3 меньше семи — функция вернёт «low», сравнение верно. 9 больше — вернёт «high», сравнение с «low» ложно.",
      lesson: "m8-l6",
    },
    {
      id: "m8-e08",
      type: "read",
      level: 1,
      prompt: "Что вернёт get_level(\"9\")?",
      code: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10},
    "2": {"name": "Средний", "max": 20},
}

def get_level(key):
    return LEVELS.get(key, LEVELS["2"])

print(get_level("9")["name"])`,
      options: ["Средний уровень — запасной", "Ошибку KeyError", "Лёгкий уровень"],
      correct: 0,
      explain: "Ключа «9» в словаре нет, поэтому .get вернул второй аргумент — уровень «2».",
      lesson: "m8-l3",
    },
    {
      id: "m8-e09",
      type: "read",
      level: 2,
      prompt: "Сколько раз в этом коде будет выведена подсказка «теплее/холоднее»?",
      code: `secret = 8
guesses = [3, 6, 9]
prev_guess = 0
used = 0

for guess in guesses:
    used = used + 1
    if used > 1:
        print("подсказка")
    prev_guess = guess`,
      options: ["Два раза: со второй попытки", "Три раза", "Ни разу"],
      correct: 0,
      explain: "Условие used > 1 пропускает первую попытку: к ней нечего сравнивать. Подсказка выводится на второй и третьей.",
      lesson: "m8-l4",
    },
    {
      id: "m8-e10",
      type: "bug",
      level: 1,
      prompt: "Программа падает с SyntaxError. В какой строке ошибка?",
      lines: ["secret = 7", "guess = 7", "if guess = secret:", "    print(\"Угадал!\")"],
      badLine: 2,
      fix: "if guess == secret:",
      explain: "Один знак = присваивает значение, а для сравнения нужны два: ==.",
      lesson: "m8-l1",
    },
    {
      id: "m8-e11",
      type: "bug",
      level: 2,
      prompt: "Игрок ввёл «9», а программа упала с KeyError. В какой строке ошибка?",
      lines: [
        "LEVELS = {\"1\": {\"max\": 10}, \"2\": {\"max\": 20}}",
        "key = \"9\"",
        "level = LEVELS[key]",
        "print(level[\"max\"])",
      ],
      badLine: 2,
      fix: "level = LEVELS.get(key, LEVELS[\"2\"])",
      explain: "Квадратные скобки падают, если ключа нет. Метод .get вернёт запасное значение.",
      lesson: "m8-l3",
    },
    {
      id: "m8-e12",
      type: "fill",
      level: 1,
      prompt: "Допишите метод, который вернёт запасное значение.",
      code: `LEVELS = {"1": "лёгкий"}

print(LEVELS.___("5", "запасной"))`,
      answers: ["get"],
      expected: "запасной",
      explain: "Метод .get(ключ, запасное) возвращает запасное значение, если ключа нет.",
      lesson: "m8-l3",
    },
    {
      id: "m8-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите расстояние между числами, чтобы вывелось 6.",
      code: `secret = 4
guess = 10

print(___(guess - secret))`,
      answers: ["abs"],
      expected: "6",
      explain: "abs возвращает число без знака. Здесь разность и так положительная, но при guess меньше секрета без abs получился бы минус.",
      lesson: "m8-l4",
    },
    {
      id: "m8-e14",
      type: "fill",
      level: 3,
      prompt: "Допишите выравнивание, чтобы очки стояли вправо в поле из 5 позиций.",
      code: `score = 60
print(f"[{score:___5}]")`,
      answers: [">"],
      expected: "[   60]",
      explain: "Знак > прижимает значение вправо, число 5 — ширина поля. Три пробела слева дополняют 60 до пяти позиций.",
      lesson: "m8-l5",
    },
    {
      id: "m8-e15",
      type: "assemble",
      level: 2,
      prompt: "Соберите функцию check_guess и вызов.",
      pieces: [
        { id: "a", code: "def check_guess(secret, guess):" },
        { id: "b", code: "    if guess == secret:" },
        { id: "c", code: "        return \"win\"" },
        { id: "d", code: "    return \"no\"" },
        { id: "e", code: "print(check_guess(7, 7))" },
      ],
      solution: ["a", "b", "c", "d", "e"],
      explain: "Заголовок функции, проверка с вложенным return, запасной return с отступом функции и вызов без отступа.",
      lesson: "m8-l6",
    },
  ],
};
