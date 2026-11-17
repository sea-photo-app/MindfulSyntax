/**
 * Модуль 10. Текст и файлы — дополнительные данные:
 * конспект, глоссарий, рецепты, карточки, шпаргалка, упражнения тренажёра.
 */

export default {
  summary: {
    title: "Конспект: текст и файлы",
    points: [
      "Методы строк вызывают через точку: upper(), lower(), title(), strip(). Они возвращают новую строку, а исходная не меняется.",
      "replace(\"старое\", \"новое\") заменяет все совпадения, find(\"часть\") возвращает позицию или -1, count(\"часть\") считает совпадения.",
      "split() режет строку на список (по пробелам или по заданному разделителю), \", \".join(список) склеивает список строк обратно.",
      "Формат в f-строке задают после двоеточия: {x:.2f} — два знака после запятой, {s:<10} влево, {s:>10} вправо, {s:^10} по центру.",
      "with open(\"имя.txt\", encoding=\"utf-8\") as f: открывает файл и сам закрывает его. Режимы: \"r\" читать, \"w\" писать заново, \"a\" дописывать.",
      "f.read() даёт весь текст, f.readline() одну строку, for line in f: перебирает строки. На конце строки стоит \\n, его убирают через strip().",
      "write не переносит строку сам: добавляйте \\n. Писать можно только строки, числа превращают через str() или f-строку.",
      "Режим \"w\" стирает файл сразу при открытии, поэтому для добавления берите \"a\".",
      "CSV — текст с запятыми: line.strip().split(\",\") даёт значения строки таблицы, числа получают через int() или float().",
    ],
  },

  glossary: [
    { term: "метод строки", definition: "Готовое действие, которое вызывают через точку: text.upper(). Метод возвращает новую строку, исходная остаётся прежней.", lesson: "m10-l1" },
    { term: "strip", definition: "Метод, который убирает пробелы и переводы строки по краям текста. Незаменим при чтении файлов.", lesson: "m10-l1" },
    { term: "split", definition: "Метод, который режет строку на список частей по заданному разделителю. Без аргумента режет по пробелам.", lesson: "m10-l2" },
    { term: "join", definition: "Метод, который склеивает список строк в одну. Разделитель стоит перед точкой: \", \".join(items).", lesson: "m10-l2" },
    { term: "формат в f-строке", definition: "Правила показа значения после двоеточия в {}: число знаков (.2f), ширина и выравнивание (<10, >10, ^10).", lesson: "m10-l3" },
    { term: "open", definition: "Функция, которая открывает файл и возвращает объект для чтения или записи. Обычно используется вместе с with.", lesson: "m10-l4" },
    { term: "with", definition: "Блок, который сам закрывает файл, когда работа внутри закончена, даже если произошла ошибка.", lesson: "m10-l4" },
    { term: "режим файла", definition: "Второй аргумент open: \"r\" читать, \"w\" писать заново (стирает старое), \"a\" дописывать в конец.", lesson: "m10-l5" },
    { term: "перевод строки \\n", definition: "Невидимый символ, который означает «перейти на новую строку». write не добавляет его сам, а при чтении он остаётся в конце строки.", lesson: "m10-l5" },
    { term: "CSV", definition: "Простой формат таблицы: одна запись на строке, значения разделены запятыми.", lesson: "m10-l6" },
    { term: "FileNotFoundError", definition: "Ошибка «файл не найден»: неверное имя или папка. Её можно поймать через try/except.", lesson: "m10-l4" },
  ],

  recipes: [
    {
      id: "m10-r1",
      title: "Очистить и привести ввод к одному виду",
      code: `raw = "  Привет, САД!  "
clean = raw.strip().lower()
print(clean)
print(clean.replace("сад", "мир"))`,
      explain: "strip убирает пробелы по краям, lower делает буквы строчными, replace меняет слово. Так сравнивают ответы, не думая о регистре.",
      lesson: "m10-l1",
    },
    {
      id: "m10-r2",
      title: "Прочитать строки файла в список",
      code: `with open("items.txt", "w", encoding="utf-8") as f:
    f.write("чай\\nмёд\\nхлеб\\n")

items = []
with open("items.txt", encoding="utf-8") as f:
    for line in f:
        items.append(line.strip())

print(items)`,
      explain: "Цикл по файлу берёт строки по одной, strip убирает \\n, а append складывает их в список.",
      lesson: "m10-l4",
    },
    {
      id: "m10-r3",
      title: "Дописать запись в журнал",
      code: `def log(text):
    with open("log.txt", "a", encoding="utf-8") as f:
        f.write(text + "\\n")

with open("log.txt", "w", encoding="utf-8") as f:
    pass

log("старт")
log("готово")

with open("log.txt", encoding="utf-8") as f:
    print(f.read())`,
      explain: "Режим \"a\" добавляет запись в конец, а \\n разделяет записи. Первый блок очищает файл, чтобы пример можно было запускать много раз.",
      lesson: "m10-l5",
    },
    {
      id: "m10-r4",
      title: "Сумма столбца из CSV",
      code: `with open("sales.csv", "w", encoding="utf-8") as f:
    f.write("чай,120\\nмёд,300\\nхлеб,45\\n")

total = 0
with open("sales.csv", encoding="utf-8") as f:
    for line in f:
        name, price = line.strip().split(",")
        total = total + int(price)

print("Итого:", total)`,
      explain: "Каждая строка разбирается по запятой, число превращается через int, а сумма копится в total.",
      lesson: "m10-l6",
    },
  ],

  cards: [
    { id: "m10-c1", front: "Как убрать пробелы по краям строки?", back: "text.strip()", lesson: "m10-l1" },
    { id: "m10-c2", front: "Как разбить строку на слова?", back: "words = text.split()", lesson: "m10-l2" },
    { id: "m10-c3", front: "Как склеить список через запятую?", back: "\", \".join(items)", lesson: "m10-l2" },
    { id: "m10-c4", front: "Как показать число с двумя знаками после запятой?", back: "f\"{x:.2f}\"", lesson: "m10-l3" },
    { id: "m10-c5", front: "Как безопасно открыть файл для чтения?", back: "with open(\"a.txt\", encoding=\"utf-8\") as f:", lesson: "m10-l4" },
    { id: "m10-c6", front: "Чем \"w\" отличается от \"a\"?", back: "\"w\" стирает файл и пишет заново, \"a\" дописывает в конец", lesson: "m10-l5" },
  ],

  cheats: [
    { code: "text.strip().lower()", text: "убрать пробелы и сделать буквы строчными", lesson: "m10-l1" },
    { code: "text.replace(\"a\", \"b\")", text: "заменить все «a» на «b»", lesson: "m10-l1" },
    { code: "text.split(\",\")", text: "разбить строку на список по запятой", lesson: "m10-l2" },
    { code: "f\"{name:<8}{price:>6.2f}\"", text: "колонки: влево 8, вправо 6 с двумя знаками", lesson: "m10-l3" },
    { code: "with open(\"f.txt\") as f:", text: "открыть файл на чтение (закроется сам)", lesson: "m10-l4" },
    { code: "open(\"f.txt\", \"a\")  /  f.write(s + \"\\n\")", text: "дописать строку в конец файла", lesson: "m10-l5" },
  ],

  exercises: [
    {
      id: "m10-e01",
      type: "predict",
      level: 1,
      prompt: "Что выведет программа?",
      code: `print("  сад ".strip().upper())`,
      expected: "САД",
      options: ["САД", "  САД ", "сад", "Сад"],
      correct: 0,
      explain: "Сначала strip убирает пробелы по краям, потом upper делает буквы заглавными.",
      lesson: "m10-l1",
    },
    {
      id: "m10-e02",
      type: "predict",
      level: 1,
      prompt: "Что выведет программа?",
      code: `print("банан".replace("а", "о"))`,
      expected: "бонон",
      options: ["бонон", "банан", "бананоо", "ббнн"],
      correct: 0,
      explain: "replace меняет все буквы «а» на «о»: б-о-н-о-н.",
      lesson: "m10-l1",
    },
    {
      id: "m10-e03",
      type: "read",
      level: 2,
      prompt: "Что останется в переменной word после выполнения кода?",
      code: `word = "чай"
big = word.upper()
print(word)
print(big)`,
      options: [
        "word останется «чай», а «ЧАЙ» будет в big",
        "word станет «ЧАЙ»",
        "Обе переменные будут «ЧАЙ»",
        "Код упадёт с ошибкой",
      ],
      correct: 0,
      explain: "Методы строк не меняют исходную строку, а возвращают новую. Её мы сохранили в big.",
      lesson: "m10-l1",
    },
    {
      id: "m10-e04",
      type: "predict",
      level: 1,
      prompt: "Что выведет программа?",
      code: `print("a b c".split())`,
      expected: "['a', 'b', 'c']",
      options: ["['a', 'b', 'c']", "a b c", "['a b c']", "abc"],
      correct: 0,
      explain: "split без аргумента режет по пробелам и возвращает список строк.",
      lesson: "m10-l2",
    },
    {
      id: "m10-e05",
      type: "fill",
      level: 1,
      prompt: "Допишите разделитель, чтобы получилось a-b-c.",
      code: `print(___.join(["a", "b", "c"]))`,
      answers: ["\"-\"", "'-'"],
      expected: "a-b-c",
      explain: "Разделитель — это строка перед точкой: \"-\".join(...).",
      lesson: "m10-l2",
    },
    {
      id: "m10-e06",
      type: "bug",
      level: 2,
      prompt: "Найдите строку с ошибкой: нужно склеить слова через запятую.",
      lines: [
        "words = [\"чай\", \"мёд\"]",
        "text = words.join(\", \")",
        "print(text)",
      ],
      badLine: 1,
      fix: "text = \", \".join(words)",
      explain: "join — метод разделителя, а не списка: \", \".join(words).",
      lesson: "m10-l2",
    },
    {
      id: "m10-e07",
      type: "predict",
      level: 1,
      prompt: "Что выведет программа?",
      code: `print(f"{3.14159:.2f}")`,
      expected: "3.14",
      options: ["3.14", "3.1", "3.142", "3"],
      correct: 0,
      explain: ".2f оставляет два знака после запятой.",
      lesson: "m10-l3",
    },
    {
      id: "m10-e08",
      type: "fill",
      level: 2,
      prompt: "Допишите знак выравнивания, чтобы слово было прижато влево в 8 символов.",
      code: `print(f"{'чай':___8}|")`,
      answers: ["<"],
      expected: "чай     |",
      explain: "Знак < прижимает текст влево, остаток ширины заполняется пробелами.",
      lesson: "m10-l3",
    },
    {
      id: "m10-e09",
      type: "assemble",
      level: 2,
      prompt: "Соберите программу, которая печатает строку таблицы с ровными колонками.",
      pieces: [
        { id: "a", code: "name = \"чай\"" },
        { id: "b", code: "price = 120" },
        { id: "c", code: "print(f\"{name:<6}{price:>5}\")" },
      ],
      solution: ["a", "b", "c"],
      explain: "Сначала значения, потом печать: в f-строке имена уже должны существовать.",
      lesson: "m10-l3",
    },
    {
      id: "m10-e10",
      type: "predict",
      level: 2,
      prompt: "Что выведет программа?",
      code: `with open("a.txt", "w", encoding="utf-8") as f:
    f.write("Роза\\nЛилия\\n")

with open("a.txt", encoding="utf-8") as f:
    print(f.readline().strip())`,
      expected: "Роза",
      options: ["Роза", "Лилия", "Роза\\nЛилия", "Ошибку"],
      correct: 0,
      explain: "readline читает одну первую строку. strip убирает \\n на конце.",
      lesson: "m10-l4",
    },
    {
      id: "m10-e11",
      type: "read",
      level: 2,
      prompt: "Сколько раз сработает тело цикла for?",
      code: `with open("b.txt", "w", encoding="utf-8") as f:
    f.write("раз\\nдва\\nтри\\n")

with open("b.txt", encoding="utf-8") as f:
    for line in f:
        print(line.strip())`,
      options: ["3 раза: по разу на строку", "1 раз", "9 раз", "Ни разу"],
      correct: 0,
      explain: "Цикл по файлу берёт по одной строке. В файле три строки, значит, три повторения.",
      lesson: "m10-l4",
    },
    {
      id: "m10-e12",
      type: "bug",
      level: 2,
      prompt: "Найдите строку с ошибкой: в файл пытаются записать число.",
      lines: [
        "with open(\"n.txt\", \"w\", encoding=\"utf-8\") as f:",
        "    f.write(5)",
      ],
      badLine: 1,
      fix: "    f.write(str(5))",
      explain: "write принимает только строки. Число сначала превращают через str() или f-строку.",
      lesson: "m10-l5",
    },
    {
      id: "m10-e13",
      type: "fill",
      level: 2,
      prompt: "Допишите режим, чтобы «мёд» добавился в конец, а «чай» остался в файле.",
      code: `with open("t.txt", "w", encoding="utf-8") as f:
    f.write("чай\\n")
with open("t.txt", ___, encoding="utf-8") as f:
    f.write("мёд\\n")
with open("t.txt", encoding="utf-8") as f:
    print(f.read().strip())`,
      answers: ["\"a\"", "'a'"],
      expected: "чай\nмёд",
      explain: "Режим \"a\" дописывает в конец. \"w\" стёр бы «чай».",
      lesson: "m10-l5",
    },
    {
      id: "m10-e14",
      type: "predict",
      level: 3,
      prompt: "Что выведет программа?",
      code: `with open("c.txt", "w", encoding="utf-8") as f:
    f.write("первая\\n")
with open("c.txt", "w", encoding="utf-8") as f:
    f.write("вторая\\n")
with open("c.txt", encoding="utf-8") as f:
    print(f.read().strip())`,
      expected: "вторая",
      options: ["вторая", "первая", "первая\\nвторая", "Ошибку"],
      correct: 0,
      explain: "Второе открытие в режиме \"w\" очистило файл, осталась только последняя запись.",
      lesson: "m10-l5",
    },
    {
      id: "m10-e15",
      type: "predict",
      level: 3,
      prompt: "Что выведет программа?",
      code: `row = "a,2,3"
p = row.split(",")
print(int(p[1]) + int(p[2]))`,
      expected: "5",
      options: ["5", "23", "a23", "Ошибку"],
      correct: 0,
      explain: "p = ['a', '2', '3']. Значения с индексами 1 и 2 превращены в числа и сложены: 2 + 3.",
      lesson: "m10-l6",
    },
  ],
};
