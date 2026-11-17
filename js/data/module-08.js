/**
 * Модуль 8. Мини-проект: игра «Угадай число».
 * Один и тот же код растёт по шагам урок за уроком.
 */

export default {
  id: "m8",
  number: 8,
  title: "Мини-проект: «Угадай число»",
  zone: "Фонарь игры",
  tagline: "Собрать всё пройденное в одну настоящую игру",
  description:
    "Шесть уроков сборки: игра «Угадай число» растёт шаг за шагом. Сначала цикл и подсказки, потом одна попытка, уровни и счёт, «теплее / холоднее», красивый вывод и, наконец, проверка и показ друзьям. Новых команд почти нет — только сборка из знакомых деталей.",
  icon: "spark",
  lessons: [
    {
      id: "m8-l1",
      title: "Собираем игру по шагам",
      minutes: 8,
      summary:
        "Разбираем игру на четыре части: случайный секрет, вопрос, сравнение и повтор. Ничего нового — только знакомые детали, собранные вместе.",
      goal: "После урока вы сможете собрать рабочую игру «Угадай число» с секретом, циклом попыток и подсказками.",
      recall:
        "Забыли порядок? Секрет создаётся до цикла, ввод и сравнение — внутри цикла, итоговое сообщение — после него.",
      keyIdeas: [
        "Большая программа собирается из маленьких знакомых частей.",
        "random.randint создаёт секрет до цикла, а ввод и сравнение живут внутри него.",
        "Счётчик попыток и break делают игру конечной и честной.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Сейчас соберём игру, в которую действительно можно играть: компьютер загадывает число, а человек угадывает. Все детали у вас уже есть:</p>
<ul><li><code>random.randint</code> — загадать число;</li>
<li><code>input</code> и <code>int</code> — спросить игрока;</li>
<li><code>if / elif / else</code> — сравнить и подсказать;</li>
<li><code>while</code> — дать несколько попыток.</li></ul>
<p>В этом модуле одна и та же игра будет расти от урока к уроку. В конце каждого урока вы увидите её полный код на этот момент.</p>`,
        },
        {
          type: "note",
          tone: "analogy",
          title: "Игра как сборка конструктора",
          html: `<p>Представьте конструктор. Каждая деталь — маленькая и понятная: секрет, вопрос, сравнение, повтор. Ни одна не сложна сама по себе. Сложной игра выглядит только в сборе.</p>`,
        },
        {
          type: "text",
          html: `<p><strong>Шаг 1. Секрет.</strong> Компьютер выбирает число от 1 до 20. Игрок его не видит. Чтобы пример выше был предсказуемым, зафиксируем генератор через <code>random.seed(7)</code> — тогда «случайные» числа повторяются.</p>`,
        },
        {
          type: "code",
          code: `import random

random.seed(7)
secret = random.randint(1, 20)
print("Секрет загадан")
print(secret)`,
          caption:
            "Выведет: «Секрет загадан» и число 11 (с seed(7) оно всегда такое). В настоящей игре print(secret) не нужен — игрок не должен видеть секрет.",
        },
        {
          type: "text",
          html: `<p><strong>Шаг 2. Попытки.</strong> Пока попыток меньше шести, спрашиваем число. Если игрок угадал — выходим из цикла.</p>`,
        },
        {
          type: "code",
          code: `tries = 0

while tries < 6:
    guess = int(input("Твой вариант: "))
    tries = tries + 1

    if guess == secret:
        print("Угадал!")
        break`,
          runnable: false,
          caption: "Обратите внимание: tries увеличивается до проверки — так проще считать попытки.",
        },
        {
          type: "text",
          html: `<p><strong>Шаг 3. Подсказки.</strong> Добавляем <code>elif</code> и <code>else</code>. <strong>Шаг 4. Финал.</strong> Сообщаем, что игра окончена.</p>`,
        },
        {
          type: "code",
          inputs: ["7", "12", "15"],
          code: `import random

secret = 12  # для примера; в игре здесь random.randint(1, 20)
tries = 0

while tries < 3:
    guess = int(input("Твой вариант: "))
    tries = tries + 1

    if guess == secret:
        print("Угадал!")
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")

print("Игра окончена.")`,
          caption:
            "Выведет: «Больше», затем «Угадал!» и «Игра окончена.» Секрет здесь равен 12, ответы 7 и 12 уже подготовлены.",
        },
        {
          type: "note",
          tone: "why",
          title: "Почему tries увеличивают до проверки",
          html: `<p>Если угадал с первой попытки, цикл прервётся через <code>break</code> — и строка после проверки уже не выполнится. Поэтому счётчик увеличивают сразу после ввода: к моменту проверки он уже показывает правильное число попыток.</p>`,
        },
        {
          type: "quiz",
          question: "Где в игре должна стоять строка secret = random.randint(1, 20)?",
          options: [
            "До цикла while — один раз",
            "Внутри цикла — перед каждым вводом",
            "После цикла",
          ],
          correct: 0,
          explain:
            "Секрет загадывают один раз. Если поместить строку в цикл, число будет меняться после каждой попытки, и угадать его станет невозможно.",
        },
        {
          type: "quiz",
          question: "Что произойдёт, если забыть строку tries = tries + 1 внутри цикла?",
          options: [
            "Цикл не остановится по числу попыток и будет работать бесконечно",
            "Игра станет проще",
            "Python сам добавит единицу",
          ],
          correct: 0,
          explain:
            "Условие tries < 6 останется истинным всегда. Выручит только break при верном ответе.",
        },
        {
          type: "task",
          title: "Соберите свою версию",
          prompt: `<p>Соберите игру: секрет <code>7</code>, не больше трёх попыток. Спросите число, сравните, выведите <strong>Мало</strong>, <strong>Много</strong> или <strong>Угадал!</strong>. При проверке будут введены 1, 9, 7.</p>`,
          starter: `secret = 7
tries = 0

while tries < 3:
    guess = int(input("Твой вариант: "))
    tries = tries + 1
    # Сравните guess и secret
`,
          inputs: ["1", "9", "7"],
          checks: [
            { type: "contains", value: ["while", "if", "input"], label: "Использованы while, if и input" },
            { type: "output", value: ["Мало", "Много", "Угадал!"], label: "Выведены все три сообщения" },
          ],
          hints: [
            "Если guess == secret — выведите «Угадал!» и break.",
            "Если guess < secret — «Мало», иначе — «Много».",
            "Внутри цикла после ввода и tries = tries + 1 идёт блок if / elif / else.",
          ],
          success: "Игра собрана. Теперь научим её правильно заканчиваться.",
          solution: {
            code: `secret = 7
tries = 0

while tries < 3:
    guess = int(input("Твой вариант: "))
    tries = tries + 1
    if guess == secret:
        print("Угадал!")
        break
    elif guess < secret:
        print("Мало")
    else:
        print("Много")
`,
            answers: ["1", "9", "7"],
          },
        },
        {
          type: "task",
          title: "Сообщение о проигрыше",
          prompt: `<p>Секрет <code>9</code>, три попытки. Добавьте после цикла проверку: если игрок так и не угадал, выведите <strong>Попытки закончились</strong> и <code>f"Было число {secret}"</code>. При проверке введены 1, 2, 3.</p>`,
          starter: `secret = 9
tries = 0
guess = 0

while tries < 3:
    guess = int(input("Твой вариант: "))
    tries = tries + 1
    if guess == secret:
        print("Угадал!")
        break

# Что делать, если попытки закончились?
`,
          inputs: ["1", "2", "3"],
          checks: [
            { type: "output", value: ["Попытки закончились", "Было число 9"], label: "Выведено сообщение о проигрыше и секрет" },
            { type: "notOutput", value: ["Угадал!"], label: "Поздравления нет: игрок не угадал" },
            { type: "contains", value: "f\"", label: "Использована f-строка" },
          ],
          hints: [
            "После цикла проверьте: if guess != secret.",
            "Внутри if выведите два сообщения.",
            "f\"Было число {secret}\" подставит секрет в строку.",
          ],
          success: "Теперь у игры есть и победа, и поражение.",
          solution: {
            code: `secret = 9
tries = 0
guess = 0

while tries < 3:
    guess = int(input("Твой вариант: "))
    tries = tries + 1
    if guess == secret:
        print("Угадал!")
        break

if guess != secret:
    print("Попытки закончились")
    print(f"Было число {secret}")
`,
            answers: ["1", "2", "3"],
          },
        },
        {
          type: "text",
          html: `<p><strong>Код игры на этот момент.</strong> Это основа проекта, к которой мы будем дописывать детали:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `import random

secret = random.randint(1, 20)
tries = 0
guess = 0

while tries < 6:
    guess = int(input("Твой вариант: "))
    tries = tries + 1

    if guess == secret:
        print("Угадал!")
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")

if guess != secret:
    print(f"Попытки закончились. Было число {secret}.")`,
          caption: "Игра версии 1: секрет, шесть попыток, подсказки и сообщение о проигрыше.",
        },
      ],
    },
    {
      id: "m8-l2",
      title: "Челлендж: игра с одной попыткой",
      minutes: 9,
      summary:
        "Режим «один выстрел»: у игрока ровно одна попытка. Собираем его сами, а затем замечаем, что это та же игра с лимитом, равным единице.",
      goal: "После урока вы сможете написать игру с одной попыткой и объяснить, чем она отличается от игры с несколькими попытками.",
      recall:
        "Игра с одной попыткой — это игра с лимитом 1: одно сравнение и сразу итог, цикл можно не писать.",
      keyIdeas: [
        "Игра с одной попыткой — самая короткая версия: ввод, сравнение, результат.",
        "Лимит попыток можно хранить в переменной: limit = 1 или limit = 6 — и один код работает в обоих режимах.",
        "Проверяйте игру маленькими шагами: сначала она запускается, потом играет, потом улучшается.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Челлендж модуля: игра с <strong>одной</strong> попыткой. Компьютер загадывает число от 1 до 10, игрок отвечает один раз, и сразу итог. Такая игра нервная и быстрая — как бросок монеты, только с головой.</p>
<p>Шаблон вы уже знаете: секрет, ввод, сравнение. Цикл здесь даже не нужен — попытка одна.</p>`,
        },
        {
          type: "code",
          inputs: ["5"],
          code: `secret = 7  # в игре: random.randint(1, 10)
guess = int(input("Ваш вариант от 1 до 10: "))

if guess == secret:
    print("Угадал!")
elif guess < secret:
    print("Мало")
else:
    print("Много")`,
          caption: "Выведет «Мало»: ответ 5 меньше секрета 7. Измените 5 на 7 и посмотрите, что изменится.",
        },
        {
          type: "note",
          tone: "water",
          title: "Правило финального челленджа",
          html: `<p>Сначала напишите игру в одну простую версию. Убедитесь, что она запускается. Потом добавьте одну деталь. Потом ещё одну. Так делают настоящие проекты.</p>`,
        },
        {
          type: "text",
          html: `<p>Теперь сравните с игрой из прошлого урока. Если сделать лимит попыток переменной, игра с одной попыткой окажется <strong>частным случаем</strong> той же игры:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `limit = 1   # поменяйте на 6 — получится прежняя игра
tries = 0
guess = 0

while tries < limit:
    guess = int(input("Твой вариант: "))
    tries = tries + 1
    if guess == secret:
        print("Угадал!")
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")`,
          caption: "Цикл с лимитом 1 повторяется один раз. Одна переменная переключает режим игры.",
        },
        {
          type: "quiz",
          question: "Что нужно изменить в игре с шестью попытками, чтобы получилась игра с одной попыткой?",
          options: [
            "Лимит попыток: 6 заменить на 1",
            "Заменить int на float",
            "Убрать random",
          ],
          correct: 0,
          explain: "Цикл while tries < limit с limit = 1 выполнится один раз — получится режим «один выстрел».",
        },
        {
          type: "quiz",
          question: "Что выведет игра с одной попыткой, если секрет 7, а игрок ввёл 12?",
          options: ["Много", "Мало", "Угадал!"],
          correct: 0,
          explain: "12 больше 7, поэтому срабатывает ветка else — «Много».",
        },
        {
          type: "task",
          title: "Одна попытка",
          prompt: `<p>Секрет <code>7</code>. Спросите число один раз и выведите <strong>Угадал!</strong>, <strong>Мало</strong> или <strong>Много</strong>. При проверке будет введено 5.</p>`,
          starter: `secret = 7
guess = int(input("Ваш вариант от 1 до 10: "))
# Сравните guess и secret
`,
          inputs: ["5"],
          checks: [
            { type: "contains", value: ["input", "if"], label: "Использованы input и if" },
            { type: "output", value: ["Мало"], label: "На ответ 5 выведено «Мало»" },
          ],
          hints: [
            "Сначала проверьте равенство guess == secret.",
            "Затем elif guess < secret — «Мало».",
            "Всё остальное — else и «Много».",
          ],
          success: "Игра с одной попыткой готова.",
          solution: {
            code: `secret = 7
guess = int(input("Ваш вариант от 1 до 10: "))
if guess == secret:
    print("Угадал!")
elif guess < secret:
    print("Мало")
else:
    print("Много")
`,
            answers: ["5"],
          },
        },
        {
          type: "task",
          title: "Загадать случайно",
          prompt: `<p>Подключите <code>random</code>, загадайте число от 1 до 10 с помощью <code>random.randint</code> и спросите игрока один раз. Если угадал — <strong>Угадал!</strong>, иначе выведите через f-строку: <code>Не угадал, было N</code>.</p>`,
          starter: `# Подключите random и загадайте число от 1 до 10

guess = int(input("Ваш вариант от 1 до 10: "))
# Угадал или нет?
`,
          inputs: ["5"],
          checks: [
            { type: "contains", value: ["import random", "random.randint(1, 10)", "f\""], label: "Есть import random, randint(1, 10) и f-строка" },
            { type: "regex", value: "Угадал!|Не угадал, было \\d+", label: "Выведен итог: «Угадал!» или «Не угадал, было N»" },
          ],
          hints: [
            "secret = random.randint(1, 10) — до вопроса.",
            "if guess == secret: print(\"Угадал!\")",
            "else: print(f\"Не угадал, было {secret}\")",
          ],
          success: "Теперь секрет каждый раз новый.",
          solution: {
            code: `import random

secret = random.randint(1, 10)
guess = int(input("Ваш вариант от 1 до 10: "))
if guess == secret:
    print("Угадал!")
else:
    print(f"Не угадал, было {secret}")
`,
            answers: ["5"],
          },
        },
        {
          type: "task",
          title: "Придумайте своё правило",
          prompt: `<p>Добавьте правило: если число вне диапазона от 1 до 10, выведите <strong>Вне диапазона</strong> и не сравнивайте с секретом. Секрет <code>7</code>; при проверке введено 15.</p>`,
          starter: `secret = 7
guess = int(input("Ваш вариант от 1 до 10: "))

if guess == secret:
    print("Угадал!")
else:
    print("Не угадал")
`,
          inputs: ["15"],
          checks: [
            { type: "contains", value: ["or"], label: "Использовано условие с or" },
            { type: "output", value: ["Вне диапазона"], label: "На ответ 15 выведено «Вне диапазона»" },
            { type: "notOutput", value: ["Не угадал"], label: "Лишней подсказки нет" },
          ],
          hints: [
            "Проверку диапазона ставьте первой: if guess < 1 or guess > 10.",
            "В этой ветке выводится «Вне диапазона».",
            "Прежнее сравнение переносится в elif.",
          ],
          success: "Теперь у игры есть защита от странных ответов.",
          solution: {
            code: `secret = 7
guess = int(input("Ваш вариант от 1 до 10: "))

if guess < 1 or guess > 10:
    print("Вне диапазона")
elif guess == secret:
    print("Угадал!")
else:
    print("Не угадал")
`,
            answers: ["15"],
          },
        },
        {
          type: "widget",
          widget: "garden-progress",
          config: {
            title: "Ваш сад вырос",
            note: "Каждый пройденный урок — ещё один стебель бамбука и глоток воды.",
          },
        },
        {
          type: "text",
          html: `<p>На отдельной странице челленджа есть критерии, подсказки и песочница. Готового решения там нет: собрать игру нужно самому. Это важная часть обучения — попробовать, ошибиться, поправить.</p>
<p><a class="btn btn--primary" href="#/challenge">Перейти к финальному челленджу <span aria-hidden="true">→</span></a></p>`,
        },
        {
          type: "text",
          html: `<p><strong>Код игры на этот момент.</strong> Версия 2: лимит попыток вынесен в переменную.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `import random

secret = random.randint(1, 10)
limit = 1          # 1 — один выстрел, 6 — обычная игра
tries = 0
guess = 0

while tries < limit:
    guess = int(input("Твой вариант: "))
    tries = tries + 1
    if guess == secret:
        print("Угадал!")
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")

if guess != secret:
    print(f"Не вышло. Было число {secret}.")`,
          caption: "Игра версии 2: лимит — переменная, один код работает в двух режимах.",
        },
      ],
    },
    {
      id: "m8-l3",
      title: "Уровни сложности и счёт",
      minutes: 8,
      summary:
        "Игрок выбирает уровень: лёгкий, средний или трудный. Диапазон и число попыток лежат в словаре, а за победу начисляются очки.",
      goal: "После урока вы сможете хранить настройки уровней в словаре и считать очки отдельной функцией.",
      recall:
        "Настройки уровня — в словаре, выбор — через .get(ключ, запасной_уровень), очки — в функции calc_score(used, limit).",
      keyIdeas: [
        "Словарь уровней хранит диапазон и число попыток — игра берёт их оттуда, а не из «магических» чисел.",
        "level.get(ключ, запасной) защищает от неверного ввода: игра не падает.",
        "Функция calc_score считает очки, и её легко проверить отдельно от игры.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Одинаковая игра быстро надоедает. Добавим <strong>уровни</strong>: на лёгком число от 1 до 10 и пять попыток, на трудном — от 1 до 50 и семь. Различаются только числа, а логика остаётся прежней.</p>
<p>Значит, числа можно вынести в словарь. Ключ — номер уровня, значение — ещё один словарь с названием, максимумом и числом попыток.</p>`,
        },
        {
          type: "code",
          code: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}

level = LEVELS["3"]
print(level["name"])
print(level["max"], level["tries"])`,
          caption: "Выведет: Трудный, затем 50 7. Словарь внутри словаря читается двумя квадратными скобками.",
        },
        {
          type: "note",
          tone: "why",
          title: "Почему уровни лежат в словаре, а не в цепочке if",
          html: `<p>Цепочка if повторяла бы одну и ту же игру три раза с разными числами. Словарь хранит только <em>различия</em>, а сама игра остаётся в одном месте. Захотите четвёртый уровень — добавьте одну строку в словарь, и игра не изменится.</p>`,
        },
        {
          type: "text",
          html: `<p>Как защититься от случайного ответа вроде «9»? Метод <code>.get(ключ, запасное)</code> вернёт запасной уровень, если такого ключа нет. Вы знаете его по модулю 5.</p>`,
        },
        {
          type: "code",
          code: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
}

def get_level(key):
    return LEVELS.get(key, LEVELS["2"])

print(get_level("1")["name"])
print(get_level("9")["name"])`,
          caption: "Выведет: Лёгкий, затем Средний — на неизвестный ключ «9» вернулся запасной уровень.",
        },
        {
          type: "text",
          html: `<p><strong>Счёт.</strong> Чем меньше попыток потрачено, тем больше очков. Самая простая формула: <code>(limit - used + 1) * 10</code>. Угадал с первой попытки при лимите шесть — 60 очков, с последней — 10.</p>`,
        },
        {
          type: "code",
          code: `def calc_score(used, limit):
    return (limit - used + 1) * 10

print(calc_score(1, 6))
print(calc_score(6, 6))`,
          caption: "Выведет 60 и 10. Функция только считает и возвращает — ничего не печатает.",
        },
        {
          type: "quiz",
          question: "Что вернёт get_level(\"7\"), если в словаре LEVELS нет ключа \"7\", а запасной уровень — LEVELS[\"2\"]?",
          options: ["Запасной уровень LEVELS[\"2\"]", "Ошибку KeyError", "Значение None"],
          correct: 0,
          explain: "У .get второй аргумент — значение на случай отсутствия ключа. Квадратные скобки LEVELS[\"7\"] дали бы KeyError, а .get — нет.",
        },
        {
          type: "quiz",
          question: "Почему функции calc_score лучше возвращать очки, а не печатать их?",
          options: [
            "Результат можно проверить, сложить с другими очками и вывести где угодно",
            "Потому что print в функциях запрещён",
            "Чтобы код был длиннее",
          ],
          correct: 0,
          explain: "Возвращённое значение можно прибавить к общему счёту и проверить отдельно. Печать «зашивает» результат в экран.",
        },
        {
          type: "task",
          title: "Выбор уровня",
          prompt: `<p>Допишите функцию <code>get_level(key)</code>: она берёт уровень из <code>LEVELS</code> через <code>.get</code>, а на неизвестный ключ возвращает уровень «2». Ниже уже есть два вызова для проверки.</p>`,
          starter: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}

def get_level(key):
    # верните нужный уровень
    pass

print(get_level("3")["name"])
print(get_level("9")["name"])
`,
          checks: [
            { type: "contains", value: [".get("], label: "Использован метод .get" },
            { type: "output", value: ["Трудный", "Средний"], label: "Ключ «3» даёт «Трудный», неверный ключ — «Средний»" },
          ],
          hints: [
            "Нужна одна строка: return LEVELS.get(...).",
            "Первый аргумент get — key, второй — запасной уровень LEVELS[\"2\"].",
            "return LEVELS.get(key, LEVELS[\"2\"])",
          ],
          success: "Выбор уровня защищён от неверного ввода.",
          solution: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}

def get_level(key):
    return LEVELS.get(key, LEVELS["2"])

print(get_level("3")["name"])
print(get_level("9")["name"])
`,
        },
        {
          type: "task",
          title: "Считаем очки",
          prompt: `<p>Напишите функцию <code>calc_score(used, limit)</code>: она возвращает <code>(limit - used + 1) * 10</code>. Вызовы <code>calc_score(1, 6)</code> и <code>calc_score(6, 6)</code> должны напечатать 60 и 10.</p>`,
          starter: `def calc_score(used, limit):
    # верните очки
    pass

print(calc_score(1, 6))
print(calc_score(6, 6))
`,
          checks: [
            { type: "contains", value: ["def calc_score", "return"], label: "Есть функция calc_score с return" },
            { type: "output", value: ["60", "10"], label: "В выводе есть 60 и 10" },
          ],
          hints: [
            "Тело функции — одна строка с return.",
            "Скобки важны: (limit - used + 1) * 10.",
            "return (limit - used + 1) * 10",
          ],
          success: "Очки считаются. Осталось подключить их к игре.",
          solution: `def calc_score(used, limit):
    return (limit - used + 1) * 10

print(calc_score(1, 6))
print(calc_score(6, 6))
`,
        },
        {
          type: "task",
          title: "Новый уровень «Эксперт»",
          prompt: `<p>Добавьте в словарь уровень <code>"4"</code>: название «Эксперт», максимум 100, восемь попыток. Затем выведите его название и максимум одной строкой через f-строку, например <code>Эксперт: 100</code>.</p>`,
          starter: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}

# Добавьте уровень "4" и выведите его
`,
          checks: [
            { type: "contains", value: ["\"4\"", "f\""], label: "Есть ключ «4» и f-строка" },
            { type: "output", value: ["Эксперт: 100"], label: "Выведено «Эксперт: 100»" },
          ],
          hints: [
            "Добавить ключ можно строкой LEVELS[\"4\"] = {...}.",
            "Внутри фигурных скобок те же ключи: name, max, tries.",
            "print(f\"{LEVELS['4']['name']}: {LEVELS['4']['max']}\")",
          ],
          success: "В игре теперь четыре уровня — и ни строчки логики не поменялось.",
          solution: `LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}

LEVELS["4"] = {"name": "Эксперт", "max": 100, "tries": 8}
level = LEVELS["4"]
print(f"{level['name']}: {level['max']}")
`,
        },
        {
          type: "text",
          html: `<p><strong>Код игры на этот момент.</strong> Версия 3: уровни, функция очков и функция <code>play</code>, которая возвращает набранные очки.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `import random

LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}

def choose_level():
    print("Уровни: 1 - лёгкий, 2 - средний, 3 - трудный")
    key = input("Выберите уровень: ")
    return LEVELS.get(key, LEVELS["2"])

def calc_score(used, limit):
    return (limit - used + 1) * 10

def play(level):
    secret = random.randint(1, level["max"])
    limit = level["tries"]
    used = 0
    while used < limit:
        guess = int(input("Твой вариант: "))
        used = used + 1
        if guess == secret:
            score = calc_score(used, limit)
            print(f"Угадал за {used} попыток! Очки: {score}")
            return score
        elif guess < secret:
            print("Больше")
        else:
            print("Меньше")
    print(f"Попытки закончились. Было число {secret}.")
    return 0

level = choose_level()
total = play(level)
print(f"Всего очков: {total}")`,
          caption: "Игра версии 3: настройки в словаре, очки в функции, игра в функции play.",
        },
      ],
    },
    {
      id: "m8-l4",
      title: "Подсказки «теплее/холоднее» и попытки",
      minutes: 9,
      summary:
        "Учим игру говорить «теплее» и «холоднее»: сравниваем, насколько близко была прошлая попытка. Считаем оставшиеся попытки и красиво проигрываем.",
      goal: "После урока вы сможете сравнить расстояние до секрета с прошлой попыткой через abs и вывести подсказку «теплее» или «холоднее».",
      recall:
        "Расстояние до секрета — abs(guess - secret). Если оно уменьшилось по сравнению с прошлой попыткой — «теплее», выросло — «холоднее».",
      keyIdeas: [
        "abs(a - b) даёт расстояние между числами без знака.",
        "Для подсказки «теплее/холоднее» сравнивают расстояние сейчас и на прошлой попытке.",
        "Остаток попыток считают как limit - used и показывают игроку.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Подсказки «больше» и «меньше» хороши, но игроку полезнее знать, приближается ли он. Для этого надо запомнить, как далеко был прошлый ответ.</p>
<p>Расстояние между двумя числами — это разность без знака. В Python для этого есть встроенная функция <code>abs()</code> — «модуль числа». Она убирает минус:</p>`,
        },
        {
          type: "code",
          code: `print(abs(-5))
print(abs(3 - 8))
print(abs(8 - 3))`,
          caption: "Выведет: 5, 5, 5. Какое число из двух больше — не важно, расстояние одно.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Игра «горячо-холодно»",
          html: `<p>Помните детскую игру, когда прячут предмет? Вы делаете шаг: «теплее» — значит стали ближе, «холоднее» — отдалились. Компьютер делает то же самое: сравнивает расстояние сейчас и в прошлый раз.</p>`,
        },
        {
          type: "code",
          code: `def warmth(secret, guess, prev_guess):
    now = abs(guess - secret)
    before = abs(prev_guess - secret)
    if now < before:
        return "Теплее"
    elif now > before:
        return "Холоднее"
    else:
        return "Так же"

print(warmth(10, 8, 3))
print(warmth(10, 3, 8))
print(warmth(10, 12, 8))`,
          caption:
            "Выведет: Теплее, Холоднее, Так же. В первой паре расстояние уменьшилось с 7 до 2, во второй выросло с 2 до 7, в третьей осталось 2.",
        },
        {
          type: "text",
          html: `<p>Теперь предел попыток. Покажем игроку, сколько попыток осталось: <code>limit - used</code>. Если цикл закончился без победы, сообщим, какое число было загадано. Проигрыш — не наказание, а повод сыграть ещё раз.</p>`,
        },
        {
          type: "code",
          inputs: ["5", "9", "8"],
          code: `secret = 8
limit = 3
used = 0
prev_guess = 0

while used < limit:
    guess = int(input("Ваш вариант: "))
    used = used + 1
    if guess == secret:
        print("Угадал!")
        break
    if used > 1:
        print(warmth(secret, guess, prev_guess))
    prev_guess = guess
    print(f"Осталось попыток: {limit - used}")`,
          runnable: false,
          caption: "Подсказка о тепле нужна со второй попытки — не с чем сравнивать. Функция warmth — из примера выше.",
        },
        {
          type: "quiz",
          question: "Чему равно abs(4 - 10)?",
          options: ["6", "-6", "14"],
          correct: 0,
          explain: "4 - 10 = -6, а abs убирает минус: остаётся 6.",
        },
        {
          type: "quiz",
          question: "Секрет 10. Предыдущая попытка — 6, нынешняя — 9. Что скажет игра?",
          options: ["Теплее", "Холоднее", "Так же"],
          correct: 0,
          explain: "Расстояние было 4, стало 1 — игрок приблизился. Значит, «теплее».",
        },
        {
          type: "task",
          title: "Теплее или холоднее",
          prompt: `<p>Допишите <code>warmth(secret, guess, prev_guess)</code>: сравните <code>abs(guess - secret)</code> и <code>abs(prev_guess - secret)</code>. Ближе — «Теплее», дальше — «Холоднее», одинаково — «Так же». Три вызова снизу проверят функцию.</p>`,
          starter: `def warmth(secret, guess, prev_guess):
    # посчитайте расстояния и верните подсказку
    pass

print(warmth(10, 8, 3))
print(warmth(10, 3, 8))
print(warmth(10, 12, 8))
`,
          checks: [
            { type: "contains", value: ["abs("], label: "Использована функция abs" },
            { type: "output", value: ["Теплее", "Холоднее", "Так же"], label: "Выведены все три подсказки" },
          ],
          hints: [
            "Сначала сохраните два расстояния в переменные now и before.",
            "if now < before: return \"Теплее\"; elif now > before: ...",
            "Ветка else возвращает «Так же».",
          ],
          success: "Игра научилась подсказывать направление.",
          solution: `def warmth(secret, guess, prev_guess):
    now = abs(guess - secret)
    before = abs(prev_guess - secret)
    if now < before:
        return "Теплее"
    elif now > before:
        return "Холоднее"
    else:
        return "Так же"

print(warmth(10, 8, 3))
print(warmth(10, 3, 8))
print(warmth(10, 12, 8))
`,
        },
        {
          type: "task",
          title: "Попытки и проигрыш",
          prompt: `<p>Секрет <code>5</code>, лимит три попытки. После каждого неверного ответа выводите <code>Осталось попыток: N</code> (через f-строку), а когда попытки кончились — <strong>Попытки закончились</strong>. При проверке введено 1, 2, 3.</p>`,
          starter: `secret = 5
limit = 3
used = 0
guess = 0

while used < limit:
    guess = int(input("Ваш вариант: "))
    used = used + 1
    if guess == secret:
        print("Угадал!")
        break
    # сколько попыток осталось?

# попытки закончились?
`,
          inputs: ["1", "2", "3"],
          checks: [
            { type: "output", value: ["Осталось попыток: 2", "Осталось попыток: 0"], label: "Выведен остаток попыток" },
            { type: "output", value: ["Попытки закончились"], label: "Выведено сообщение о проигрыше" },
            { type: "contains", value: "limit - used", label: "Остаток считается как limit - used" },
          ],
          hints: [
            "После проверки победы: print(f\"Осталось попыток: {limit - used}\").",
            "После цикла: if guess != secret.",
            "Внутри этого if выведите «Попытки закончились».",
          ],
          success: "Игрок всегда знает, сколько у него попыток и чем всё кончилось.",
          solution: {
            code: `secret = 5
limit = 3
used = 0
guess = 0

while used < limit:
    guess = int(input("Ваш вариант: "))
    used = used + 1
    if guess == secret:
        print("Угадал!")
        break
    print(f"Осталось попыток: {limit - used}")

if guess != secret:
    print("Попытки закончились")
`,
            answers: ["1", "2", "3"],
          },
        },
        {
          type: "task",
          title: "Градусник",
          prompt: `<p>Напишите функцию <code>temperature(distance)</code>. Расстояние до 2 включительно — «Горячо», до 5 — «Тепло», больше — «Холодно». Вызовы снизу выведут по одному слову.</p>`,
          starter: `def temperature(distance):
    # верните слово по расстоянию
    pass

print(temperature(1))
print(temperature(4))
print(temperature(9))
`,
          checks: [
            { type: "contains", value: ["def temperature", "return"], label: "Есть функция temperature с return" },
            { type: "output", value: ["Горячо", "Тепло", "Холодно"], label: "Выведены три разных слова" },
          ],
          hints: [
            "Проверяйте от самого близкого: if distance <= 2.",
            "Затем elif distance <= 5.",
            "Всё остальное — else.",
          ],
          success: "Теперь можно говорить игроку не только направление, но и температуру.",
          solution: `def temperature(distance):
    if distance <= 2:
        return "Горячо"
    elif distance <= 5:
        return "Тепло"
    else:
        return "Холодно"

print(temperature(1))
print(temperature(4))
print(temperature(9))
`,
        },
        {
          type: "widget",
          widget: "guess-game",
          config: {
            title: "Сыграйте с подсказками",
            levels: [
              { label: "шесть попыток", mode: "many", min: 1, max: 20, maxTries: 6 },
              { label: "теплее / холоднее", title: "Подсказки «теплее» и «холоднее»", mode: "many", min: 1, max: 50, maxTries: 7, hints: "hotcold" },
              { label: "сто чисел", title: "Число от 1 до 100", mode: "many", min: 1, max: 100, maxTries: 8, hints: "hotcold" },
            ],
          },
        },
        {
          type: "text",
          html: `<p><strong>Код игры на этот момент.</strong> Версия 4: в <code>play</code> добавлены подсказки и остаток попыток.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `def warmth(secret, guess, prev_guess):
    now = abs(guess - secret)
    before = abs(prev_guess - secret)
    if now < before:
        return "Теплее"
    elif now > before:
        return "Холоднее"
    else:
        return "Так же"

def play(level):
    secret = random.randint(1, level["max"])
    limit = level["tries"]
    used = 0
    prev_guess = 0
    while used < limit:
        guess = int(input("Твой вариант: "))
        used = used + 1
        if guess == secret:
            score = calc_score(used, limit)
            print(f"Угадал за {used} попыток! Очки: {score}")
            return score
        elif guess < secret:
            print("Больше")
        else:
            print("Меньше")
        if used > 1:
            print(warmth(secret, guess, prev_guess))
        prev_guess = guess
        print(f"Осталось попыток: {limit - used}")
    print(f"Попытки закончились. Было число {secret}.")
    return 0`,
          caption: "Игра версии 4. Остальной код (LEVELS, choose_level, calc_score) остаётся как в прошлом уроке.",
        },
      ],
    },
    {
      id: "m8-l5",
      title: "Красивый вывод и правила игры",
      minutes: 7,
      summary:
        "Рамка из символов, приветствие, правила и аккуратные числа: превращаем набор строк в игру, на которую приятно смотреть.",
      goal: "После урока вы сможете вывести рамку-заголовок, правила игры и выровненные по колонкам строки с помощью print и f-строк.",
      recall:
        "Рамка — \"=\" * (len(text) + 4). Выравнивание в f-строке: {name:<8} — влево, {score:>5} — вправо, {x:.1f} — один знак после точки.",
      keyIdeas: [
        "Повтор символа \"=\" * n и len(text) строят рамку нужной ширины.",
        "Несколько print подряд — самый простой способ показать правила.",
        "В f-строке после двоеточия задают ширину и выравнивание: {name:<8}, {score:>5}.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Игра уже работает, но выглядит как набор строк. Первое впечатление важно: если на экране аккуратный заголовок и ясные правила, играть приятнее. Всё, что нужно, вы уже знаете: <code>print</code>, умножение строки и f-строки.</p>`,
        },
        {
          type: "code",
          code: `def banner(text):
    line = "=" * (len(text) + 4)
    print(line)
    print(f"| {text} |")
    print(line)

banner("Угадай число")
banner("Сад")`,
          caption: "Выведет две рамки. Линия длиннее текста на 4 символа: два пробела и две вертикальные черты.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Рамка как паспарту",
          html: `<p>Картину в музее оформляют паспарту — рамкой вокруг. Она ничего не меняет в картине, но взгляд сразу понимает, где начало и конец. Рамка из символов делает то же самое для вашего заголовка.</p>`,
        },
        {
          type: "text",
          html: `<p><strong>Правила игры.</strong> Несколько <code>print</code> подряд, а числа берём из настроек уровня, чтобы текст не врал. Для пустой строки достаточно <code>print()</code>.</p>`,
        },
        {
          type: "code",
          code: `def show_rules(max_number, limit):
    print("Правила игры:")
    print(f"  1. Я загадал число от 1 до {max_number}.")
    print(f"  2. У вас {limit} попыток.")
    print("  3. После каждой попытки я подскажу направление.")
    print()

show_rules(20, 6)
print("Удачи!")`,
          caption: "Выведет четыре строки правил, пустую строку и «Удачи!».",
        },
        {
          type: "text",
          html: `<p><strong>Форматирование чисел.</strong> После двоеточия в фигурных скобках можно задать вид значения. Знак <code>&lt;</code> — выровнять влево, <code>&gt;</code> — вправо, число — ширину поля, <code>.1f</code> — один знак после точки у дробного числа.</p>`,
        },
        {
          type: "code",
          code: `print(f"{'Аня':<8}{60:>5}")
print(f"{'Мир':<8}{120:>5}")
print(f"{2 / 3:.1f}")`,
          caption: "Выведет две строки с ровной колонкой очков, затем 0.7.",
        },
        {
          type: "note",
          tone: "tip",
          title: "Один перенос — через \\n",
          html: `<p>Знак <code>\\n</code> внутри строки — перенос строки: <code>print("Привет!\\nНачнём?")</code> выведет две строки. Обычно проще написать два <code>print</code>, но иногда \\n удобен внутри одной f-строки.</p>`,
        },
        {
          type: "quiz",
          question: "Какую рамку напечатает banner(\"Сад\")?",
          options: [
            "Линию из 7 знаков =, строку | Сад | и ещё линию из 7 знаков =",
            "Только строку | Сад |",
            "Линию из 3 знаков =",
          ],
          correct: 0,
          explain: "В слове «Сад» три буквы, плюс 4 символа: итого 7. Верхняя и нижняя линии одной длины.",
        },
        {
          type: "quiz",
          question: "Что делает {score:>5} внутри f-строки?",
          options: [
            "Отводит под число 5 позиций и прижимает его вправо",
            "Выводит число больше 5",
            "Умножает число на 5",
          ],
          correct: 0,
          explain: "Знак > — выравнивание вправо, число 5 — ширина поля. Так числа в колонке выстраиваются ровно.",
        },
        {
          type: "task",
          title: "Рамка-заголовок",
          prompt: `<p>Допишите <code>banner(text)</code>: линия из <code>=</code> длиной <code>len(text) + 4</code>, строка <code>| текст |</code> и снова линия. Ниже вызов для слова «Сад».</p>`,
          starter: `def banner(text):
    # линия, строка с текстом, линия
    pass

banner("Сад")
`,
          checks: [
            { type: "contains", value: ["len("], label: "Ширина рамки считается через len" },
            { type: "regex", value: "^=+$", label: "В выводе есть линия из знаков =" },
            { type: "output", value: ["| Сад |"], label: "В выводе строка «| Сад |»" },
          ],
          hints: [
            "line = \"=\" * (len(text) + 4)",
            "Выведите line, потом f\"| {text} |\", потом снова line.",
            "Все три print идут внутри функции.",
          ],
          success: "Заголовок готов — можно вставлять в начало игры.",
          solution: `def banner(text):
    line = "=" * (len(text) + 4)
    print(line)
    print(f"| {text} |")
    print(line)

banner("Сад")
`,
        },
        {
          type: "task",
          title: "Правила игры",
          prompt: `<p>Допишите <code>show_rules(limit, max_number)</code>: выведите строки <strong>Правила игры:</strong>, <code>Я загадал число от 1 до N</code> и <code>У вас M попыток</code>. Числа берите из аргументов через f-строки.</p>`,
          starter: `def show_rules(limit, max_number):
    # выведите три строки правил
    pass

show_rules(6, 20)
`,
          checks: [
            { type: "contains", value: ["f\""], label: "Использована f-строка" },
            { type: "output", value: ["Правила игры:", "Я загадал число от 1 до 20", "У вас 6 попыток"], label: "Выведены все три строки правил" },
          ],
          hints: [
            "Первая строка — обычный print(\"Правила игры:\").",
            "print(f\"Я загадал число от 1 до {max_number}\")",
            "Вторая f-строка про limit: «У вас {limit} попыток».",
          ],
          success: "Правила всегда соответствуют выбранному уровню.",
          solution: `def show_rules(limit, max_number):
    print("Правила игры:")
    print(f"Я загадал число от 1 до {max_number}")
    print(f"У вас {limit} попыток")

show_rules(6, 20)
`,
        },
        {
          type: "task",
          title: "Таблица очков",
          prompt: `<p>Допишите <code>print_row(name, score)</code>: имя выровнено влево в поле шириной 8, очки — вправо в поле шириной 5. Вызов <code>print_row("Аня", 60)</code> выведет ровную строку.</p>`,
          starter: `def print_row(name, score):
    # выведите строку с выравниванием
    pass

print_row("Аня", 60)
print_row("Мир", 120)
`,
          checks: [
            { type: "contains", value: [":<", ":>"], label: "Использованы выравнивание влево и вправо" },
            { type: "regex", value: "Аня\\s+60", label: "Имя и очки стоят в одной строке" },
          ],
          hints: [
            "Внутри функции нужен один print с f-строкой.",
            "{name:<8} — имя, {score:>5} — очки.",
            "print(f\"{name:<8}{score:>5}\")",
          ],
          success: "Таблица очков выстроилась по колонкам.",
          solution: `def print_row(name, score):
    print(f"{name:<8}{score:>5}")

print_row("Аня", 60)
print_row("Мир", 120)
`,
        },
        {
          type: "text",
          html: `<p><strong>Код игры на этот момент.</strong> Версия 5: к игре добавились заголовок и правила. Остальные функции — как раньше.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `def banner(text):
    line = "=" * (len(text) + 4)
    print(line)
    print(f"| {text} |")
    print(line)

def show_rules(level):
    print("Правила игры:")
    print(f"  1. Я загадал число от 1 до {level['max']}.")
    print(f"  2. У вас {level['tries']} попыток.")
    print("  3. После каждой попытки я подскажу направление.")
    print()

banner("УГАДАЙ ЧИСЛО")
level = choose_level()
show_rules(level)
total = play(level)
print(f"Всего очков: {total}")`,
          caption: "Игра версии 5: красивый старт. LEVELS, choose_level, calc_score, warmth и play — из прошлых уроков.",
        },
      ],
    },
    {
      id: "m8-l6",
      title: "Полировка, тестирование, презентация",
      minutes: 9,
      summary:
        "Проверяем игру по чек-листу, учимся тестировать её без ввода через функцию check_guess и собираем итоговый код проекта, который не стыдно показать.",
      goal: "После урока вы сможете проверить функцию готовыми значениями, прогнать игру по чек-листу и показать проект другу.",
      recall:
        "Выносите логику в функции без input и random, вызывайте их с готовыми значениями и печатайте «ожидалось/получилось».",
      keyIdeas: [
        "Функцию без ввода и случайности проверяют готовыми значениями: вызвали, сравнили с ожидаемым.",
        "Чек-лист ловит ошибки, которые видны только в игре: границы, неверный ввод, конец попыток.",
        "Готовый проект — это понятные функции, имена и константы, а не одна длинная простыня.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Игра почти готова. Осталась последняя, самая взрослая часть работы: убедиться, что она не ломается, и привести код в порядок. Настоящие проекты проверяют каждый раз, когда что-то меняют.</p>
<p>Играть вручную долго: нужно угадывать секрет, вводить числа. А вот логику можно проверить мгновенно, если она вынесена в функцию, которая принимает значения и возвращает результат — без <code>input</code> и без <code>random</code>.</p>`,
        },
        {
          type: "code",
          code: `def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

print(check_guess(7, 7))
print(check_guess(7, 3))
print(check_guess(7, 12))`,
          caption: "Выведет: win, low, high. Секрет передан явно — результат всегда один и тот же.",
        },
        {
          type: "text",
          html: `<p>Теперь добавим привычку тестировщика: рядом с результатом печатаем, что <em>ожидали</em>. Если совпало — всё хорошо, если нет — сразу видно, где ошибка.</p>`,
        },
        {
          type: "code",
          code: `def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

def check(name, got, expected):
    if got == expected:
        print(f"OK: {name}")
    else:
        print(f"FAIL: {name}, ожидалось {expected}, получилось {got}")

check("равно секрету", check_guess(7, 7), "win")
check("меньше секрета", check_guess(7, 3), "low")
check("больше секрета", check_guess(7, 12), "high")`,
          caption: "Выведет три строки OK. Если измените ожидаемое слово, увидите строку FAIL с подробностями.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Проверка весов",
          html: `<p>Прежде чем взвешивать продукты, весы проверяют гирей известной массы. Если гиря в 1 кг показывает 1 кг — весам можно верить. Ваши тесты — те же гири: известные значения и известный ответ.</p>`,
        },
        {
          type: "text",
          html: `<p><strong>Чек-лист для игры.</strong> Пройдите его вручную после каждой большой правки:</p>
<ul><li>Игра запускается и показывает заголовок и правила.</li>
<li>Выбор уровня работает; неверный ввод даёт уровень по умолчанию.</li>
<li>Крайние числа секрета (1 и максимум) возможны, секрет не выходит за диапазон.</li>
<li>Победа с первой и с последней попытки даёт разные очки.</li>
<li>После последней попытки игра сообщает о проигрыше и показывает секрет.</li>
<li>«Сыграем ещё?» с ответом «нет» заканчивает игру.</li></ul>
<p><strong>Чистка кода.</strong> Уберите дубли, дайте переменным понятные имена, вынесите числа в словарь уровней или константы и напишите короткие комментарии там, где логика не очевидна.</p>`,
        },
        {
          type: "quiz",
          question: "Почему check_guess(secret, guess) проще тестировать, чем всю игру целиком?",
          options: [
            "Она не просит ввод и не использует случайность: её можно вызвать с готовыми значениями",
            "Потому что она короче",
            "Потому что в ней нет if",
          ],
          correct: 0,
          explain: "Функцию с явными аргументами можно вызывать сколько угодно раз, а ответ предсказуем. Игра с input и random каждый раз разная.",
        },
        {
          type: "quiz",
          question: "Тест вывел «FAIL: мало, ожидалось low, получилось high». Что это значит?",
          options: [
            "Функция вернула не то слово — в логике сравнения есть ошибка",
            "Тест написан красиво",
            "Python сломался",
          ],
          correct: 0,
          explain: "FAIL — это подсказка тестировщика: ожидалось одно, получилось другое. Ищите ошибку в условии функции.",
        },
        {
          type: "task",
          title: "Функция check_guess",
          prompt: `<p>Допишите <code>check_guess(secret, guess)</code>: <strong>win</strong>, если числа равны, <strong>low</strong>, если guess меньше секрета, иначе <strong>high</strong>. Три вызова снизу проверят её.</p>`,
          starter: `def check_guess(secret, guess):
    # верните win, low или high
    pass

print(check_guess(7, 7))
print(check_guess(7, 3))
print(check_guess(7, 12))
`,
          checks: [
            { type: "contains", value: ["def check_guess", "return"], label: "Есть функция check_guess с return" },
            { type: "output", value: ["win", "low", "high"], label: "Выведены win, low и high" },
          ],
          hints: [
            "Сначала проверьте равенство, потом «меньше».",
            "Ветка else возвращает \"high\".",
            "Каждая ветка заканчивается return, а не print.",
          ],
          success: "Теперь логику игры можно проверять за долю секунды.",
          solution: `def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

print(check_guess(7, 7))
print(check_guess(7, 3))
print(check_guess(7, 12))
`,
        },
        {
          type: "task",
          title: "Мини-тестер",
          prompt: `<p>Допишите <code>check(name, got, expected)</code>: при совпадении выведите <code>OK: имя</code>, иначе — <code>FAIL: имя</code>. Последний вызов ниже ошибочный — пусть он покажет FAIL.</p>`,
          starter: `def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

def check(name, got, expected):
    # сравните got и expected
    pass

check("равно", check_guess(7, 7), "win")
check("меньше", check_guess(7, 3), "low")
check("ошибочный", check_guess(7, 9), "low")
`,
          checks: [
            { type: "contains", value: ["got == expected"], label: "Результат сравнивается с ожидаемым" },
            { type: "output", value: ["OK: равно", "OK: меньше", "FAIL: ошибочный"], label: "Два теста прошли, а ошибочный показал FAIL" },
          ],
          hints: [
            "Нужен if got == expected: ... else: ...",
            "В ветке if выведите f\"OK: {name}\".",
            "В ветке else — f\"FAIL: {name}\".",
          ],
          success: "У вашей игры есть свой тестер.",
          solution: `def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"

def check(name, got, expected):
    if got == expected:
        print(f"OK: {name}")
    else:
        print(f"FAIL: {name}")

check("равно", check_guess(7, 7), "win")
check("меньше", check_guess(7, 3), "low")
check("ошибочный", check_guess(7, 9), "low")
`,
        },
        {
          type: "task",
          title: "Похвастаться другу",
          prompt: `<p>Напишите функцию <code>share_text(score, used)</code>, которая возвращает строку <code>Моя игра «Угадай число»: очки 50, ходов 2</code> (числа подставляйте из аргументов). Выведите результат <code>share_text(50, 2)</code>.</p>`,
          starter: `def share_text(score, used):
    # верните строку для друга
    pass

print(share_text(50, 2))
`,
          checks: [
            { type: "contains", value: ["return", "f\""], label: "Функция возвращает f-строку" },
            { type: "output", value: ["Моя игра «Угадай число»: очки 50, ходов 2"], label: "Выведена нужная строка для друга" },
          ],
          hints: [
            "Нужен return, а не print внутри функции.",
            "Подставьте score и used в фигурные скобки.",
            "return f\"Моя игра «Угадай число»: очки {score}, ходов {used}\"",
          ],
          success: "Такую строку можно отправить другу вместе с запуском игры.",
          solution: `def share_text(score, used):
    return f"Моя игра «Угадай число»: очки {score}, ходов {used}"

print(share_text(50, 2))
`,
        },
        {
          type: "text",
          html: `<p><strong>Как показать игру другу.</strong> Запустите её и сыграйте вместе: пусть он сначала угадывает, а вы молчите. Смотрите, где он путается: непонятное правило, слишком мало попыток, странный вывод. Эти места и улучшайте. Напоследок можно придумать свой уровень или режим — вы знаете, как.</p>
<p><strong>Итоговый код проекта.</strong> Он собирает всё из шести уроков в одном файле:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `import random

# Уровни: название, наибольшее число и число попыток
LEVELS = {
    "1": {"name": "Лёгкий", "max": 10, "tries": 5},
    "2": {"name": "Средний", "max": 20, "tries": 6},
    "3": {"name": "Трудный", "max": 50, "tries": 7},
}


def banner(text):
    line = "=" * (len(text) + 4)
    print(line)
    print(f"| {text} |")
    print(line)


def show_rules(level):
    print("Правила игры:")
    print(f"  1. Я загадал число от 1 до {level['max']}.")
    print(f"  2. У вас {level['tries']} попыток.")
    print("  3. После каждой попытки я подскажу: больше или меньше.")
    print()


def choose_level():
    print("Уровни: 1 - лёгкий, 2 - средний, 3 - трудный")
    key = input("Выберите уровень: ")
    return LEVELS.get(key, LEVELS["2"])


def check_guess(secret, guess):
    if guess == secret:
        return "win"
    elif guess < secret:
        return "low"
    else:
        return "high"


def warmth(secret, guess, prev_guess):
    now = abs(guess - secret)
    before = abs(prev_guess - secret)
    if now < before:
        return "Теплее"
    elif now > before:
        return "Холоднее"
    else:
        return "Так же"


def calc_score(used, limit):
    return (limit - used + 1) * 10


def play(level):
    secret = random.randint(1, level["max"])
    limit = level["tries"]
    used = 0
    prev_guess = 0
    while used < limit:
        guess = int(input(f"Попытка {used + 1} из {limit}: "))
        used = used + 1
        result = check_guess(secret, guess)
        if result == "win":
            score = calc_score(used, limit)
            print(f"Угадал за {used} попыток! Очки: {score}")
            return score
        if result == "low":
            print("Больше")
        else:
            print("Меньше")
        if used > 1:
            print(warmth(secret, guess, prev_guess))
        prev_guess = guess
    print(f"Попытки закончились. Было число {secret}.")
    return 0


banner("УГАДАЙ ЧИСЛО")
level = choose_level()
show_rules(level)

total = 0
again = "да"
while again == "да":
    total = total + play(level)
    print(f"Очки: {total}")
    again = input("Сыграем ещё? (да/нет): ")

print(f"Спасибо за игру! Итого очков: {total}")`,
          caption: "Игра версии 6 — проект модуля. Сохраните его в файл и запустите на своём компьютере.",
        },
      ],
    },
  ],
};
