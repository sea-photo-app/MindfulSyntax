/**
 * Шпаргалка: только то, что действительно было в уроках.
 * Поиск идёт по команде, описанию и примеру.
 */

export const cheatGroups = [
  {
    id: "output",
    title: "Вывод",
    items: [
      {
        code: "print()",
        desc: "Показать значение на экране. Несколько частей можно разделить запятой.",
        example: 'print("Привет", name)',
        keywords: "вывод печать экран",
      },
      {
        code: 'f"…{переменная}…"',
        desc: "f-строка: вставить значение прямо в текст.",
        example: 'print(f"Привет, {name}!")',
        keywords: "строка шаблон подстановка",
      },
    ],
  },
  {
    id: "variables",
    title: "Переменные и типы",
    items: [
      {
        code: "name = значение",
        desc: "Положить значение в переменную. Один знак = — присваивание.",
        example: 'city = "Киото"',
        keywords: "переменная присваивание коробка",
      },
      {
        code: "int() / float() / str()",
        desc: "Превратить значение в число, дробное число или строку.",
        example: "age = int(input(\"Сколько лет? \"))",
        keywords: "тип преобразование число строка",
      },
      {
        code: "type(значение)",
        desc: "Узнать тип значения: int, float, str и другие.",
        example: 'print(type("42"))',
        keywords: "тип проверка",
      },
    ],
  },
  {
    id: "input",
    title: "Ввод",
    items: [
      {
        code: "input()",
        desc: "Задать вопрос и получить ответ. Ответ всегда строка.",
        example: 'name = input("Как тебя зовут? ")',
        keywords: "ввод вопрос пользователь",
      },
      {
        code: "int(input())",
        desc: "Спросить число и сразу превратить ответ в целое число.",
        example: 'guess = int(input("Число: "))',
        keywords: "ввод число",
      },
    ],
  },
  {
    id: "conditions",
    title: "Условия",
    items: [
      {
        code: "if условие:",
        desc: "Выполнить блок, если условие истинно. Не забыть двоеточие и отступ.",
        example: "if age >= 18:\n    print(\"Взрослый\")",
        keywords: "если условие ветвление",
      },
      {
        code: "else:",
        desc: "Выполнить блок, если условие выше оказалось ложным.",
        example: "else:\n    print(\"Рано\")",
        keywords: "иначе",
      },
      {
        code: "elif условие:",
        desc: "Проверить дополнительное условие, если предыдущие ложны.",
        example: "elif score >= 60:\n    print(\"Хорошо\")",
        keywords: "иначе если цепочка",
      },
      {
        code: "==  !=  >  <  >=  <=",
        desc: "Сравнения. Два знака == — вопрос «равно?», один = — присваивание.",
        example: "if guess == secret:",
        keywords: "сравнение равно больше меньше",
      },
    ],
  },
  {
    id: "loops",
    title: "Циклы",
    items: [
      {
        code: "for i in range(n):",
        desc: "Повторить блок n раз. i принимает значения от 0 до n − 1.",
        example: "for i in range(5):\n    print(i)",
        keywords: "цикл повтор for range",
      },
      {
        code: "while условие:",
        desc: "Повторять, пока условие истинно. Внутри нужно менять условие.",
        example: "while count > 0:\n    count = count - 1",
        keywords: "цикл пока while",
      },
      {
        code: "break",
        desc: "Немедленно выйти из цикла.",
        example: "if guess == secret:\n    break",
        keywords: "выход прервать цикл",
      },
    ],
  },
  {
    id: "lists",
    title: "Списки",
    items: [
      {
        code: "список = [элемент, …]",
        desc: "Полка значений по порядку. Индексы начинаются с 0.",
        example: 'products = ["хлеб", "чай"]',
        keywords: "список массив полка",
      },
      {
        code: "список.append(x)",
        desc: "Добавить элемент в конец списка.",
        example: 'products.append("сыр")',
        keywords: "добавить список",
      },
      {
        code: "список.remove(x)",
        desc: "Удалить первый элемент с таким значением.",
        example: 'products.remove("сыр")',
        keywords: "удалить список",
      },
      {
        code: "len(список)",
        desc: "Узнать количество элементов.",
        example: "print(len(products))",
        keywords: "длина количество",
      },
    ],
  },
  {
    id: "dicts",
    title: "Словари",
    items: [
      {
        code: "{ключ: значение}",
        desc: "Картотека с ярлыками. Доступ по ключу.",
        example: 'person = {"имя": "Аня", "возраст": 12}',
        keywords: "словарь картотека ключ",
      },
      {
        code: "словарь[ключ]",
        desc: "Получить значение по ключу. Если ключа нет — KeyError.",
        example: 'print(person["имя"])',
        keywords: "словарь доступ",
      },
      {
        code: "словарь.get(ключ, запасное)",
        desc: "Мягко получить значение: если ключа нет, вернётся запасное.",
        example: 'person.get("рост", "не указан")',
        keywords: "словарь get безопасно",
      },
    ],
  },
  {
    id: "functions",
    title: "Функции",
    items: [
      {
        code: "def имя(аргументы):",
        desc: "Создать функцию-помощника. Тело — с отступом.",
        example: "def greet(name):\n    return f\"Привет, {name}!\"",
        keywords: "функция помощник def",
      },
      {
        code: "return значение",
        desc: "Вернуть результат из функции и завершить её.",
        example: "def double(x):\n    return x * 2",
        keywords: "возврат результат",
      },
      {
        code: "имя(аргументы)",
        desc: "Вызвать функцию. Без вызова она только описана.",
        example: 'print(greet("Аня"))',
        keywords: "вызов функция",
      },
    ],
  },
  {
    id: "libraries",
    title: "Библиотеки и зависимости",
    items: [
      {
        code: "import random",
        desc: "Подключить библиотеку целиком.",
        example: "import random\nprint(random.randint(1, 6))",
        keywords: "импорт библиотека",
      },
      {
        code: "from math import sqrt",
        desc: "Взять из библиотеки только нужную функцию.",
        example: "from math import sqrt\nprint(sqrt(16))",
        keywords: "импорт from",
      },
      {
        code: "random.randint(a, b)",
        desc: "Случайное целое от a до b включительно.",
        example: "dice = random.randint(1, 6)",
        keywords: "случайное число",
      },
      {
        code: "random.choice(список)",
        desc: "Случайный элемент списка.",
        example: 'random.choice(["Аня", "Киото"])',
        keywords: "случайный выбор",
      },
      {
        code: "pip install имя",
        desc: "Установить внешнюю библиотеку (в терминале, не в Python-файле).",
        example: "pip install requests",
        keywords: "установка pip зависимость",
      },
      {
        code: "requirements.txt",
        desc: "Список зависимостей проекта. Устанавливается через pip install -r requirements.txt.",
        example: "requests\npillow==10.2.0",
        keywords: "зависимости список requirements",
      },
    ],
  },
  {
    id: "errors",
    title: "Ошибки — что они значат",
    items: [
      {
        code: "SyntaxError",
        desc: "Python не понял запись: чаще всего кавычка, скобка или двоеточие.",
        example: 'print("Привет"  # нет скобки',
        keywords: "синтаксис ошибка",
      },
      {
        code: "IndentationError",
        desc: "Неправильный отступ. Внутри if, for, while и def нужен одинаковый отступ.",
        example: "if True:\nprint(\"нет отступа\")",
        keywords: "отступ ошибка",
      },
      {
        code: "NameError",
        desc: "Незнакомое имя: переменная не создана или написана иначе.",
        example: "print(age)  # age ещё нет",
        keywords: "имя переменная ошибка",
      },
      {
        code: "TypeError",
        desc: "Смешаны разные типы: например, строка и число.",
        example: '"Мне " + 12',
        keywords: "тип ошибка",
      },
      {
        code: "IndexError",
        desc: "Индекс за пределами списка. На полке из трёх элементов нет индекса 3.",
        example: "[1, 2, 3][5]",
        keywords: "индекс список ошибка",
      },
      {
        code: "KeyError",
        desc: "В словаре нет такого ключа. Используйте get() для мягкой проверки.",
        example: 'person["рост"]',
        keywords: "ключ словарь ошибка",
      },
    ],
  },
];
