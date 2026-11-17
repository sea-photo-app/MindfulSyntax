/**
 * Модуль 7. Библиотеки и зависимости — готовые инструменты.
 */

export default {
  id: "m7",
  number: 7,
  title: "Библиотеки и зависимости",
  zone: "Кладовая инструментов",
  tagline: "Пользоваться готовым и не бояться pip install",
  description:
    "Шесть уроков о готовых инструментах: import, random, math и statistics, даты через datetime, pip и requirements.txt. В конце — мини-проект: генератор паролей и бросок кубиков.",
  icon: "book",
  lessons: [
    {
      id: "m7-l1",
      title: "Готовые инструменты",
      minutes: 6,
      summary:
        "Библиотека — это чужие готовые функции, которые можно подключить к своей программе. import открывает ящик с инструментами.",
      goal: "После урока вы сможете подключать библиотеку тремя способами: import, import ... as и from ... import.",
      recall: "Забыли, как подключить? Напишите import имя_библиотеки в начале файла и обращайтесь через точку: имя.функция().",
      keyIdeas: [
        "Библиотека — набор готового кода для общей задачи.",
        "import подключает библиотеку; функции берут через точку: random.randint().",
        "from ... import берёт одну функцию, as даёт короткое имя; random и math уже входят в Python.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Представьте мастерскую. Можно каждый раз вытачивать молоток с нуля — или взять готовый с полки. <strong>Библиотека</strong> — это полка с готовыми инструментами, которые кто-то уже сделал и проверил.</p>
<p>Чтобы взять инструмент, его подключают словом <code>import</code>. Например, <code>import random</code> открывает ящик со случайными числами, а <code>import math</code> — с математикой.</p>`,
        },
        {
          type: "note",
          tone: "analogy",
          title: "Кладовая инструментов",
          html: `<p>Python — это большая кладовая. Каждая библиотека — отдельный ящик с подписью: <code>random</code>, <code>math</code>, <code>datetime</code>. Пока вы не сказали <code>import</code>, ящик закрыт. Открыли — достаёте нужный инструмент через точку: <code>random.randint</code> значит «из ящика random возьми randint».</p>`,
        },
        {
          type: "code",
          code: `import random

dice = random.randint(1, 6)
print("Выпало число от 1 до 6:", 1 <= dice <= 6)

import math

print("Корень из 16:", math.sqrt(16))
print("Пи примерно:", math.pi)`,
          caption:
            "Выведет: Выпало число от 1 до 6: True, затем Корень из 16: 4.0 и Пи примерно: 3.141592653589793. random.randint(1, 6) даёт целое число от 1 до 6 включительно.",
        },
        {
          type: "text",
          html: `<p>Есть три способа подключения. Все они делают одно и то же, отличается только запись:</p>
<ul>
<li><code>import math</code> — открыть весь ящик, брать через <code>math.sqrt</code>;</li>
<li><code>import math as m</code> — то же, но с коротким именем: <code>m.sqrt</code>;</li>
<li><code>from math import sqrt</code> — достать один инструмент и положить его прямо на стол: просто <code>sqrt(16)</code>.</li>
</ul>`,
        },
        {
          type: "code",
          code: `import math as m
from math import sqrt, pi

print(m.sqrt(25))
print(sqrt(36))
print(round(pi, 2))`,
          caption: "Выведет: 5.0, затем 6.0, затем 3.14. Здесь m.sqrt и sqrt — один и тот же инструмент.",
        },
        {
          type: "note",
          tone: "why",
          title: "Почему Python называется Python",
          html: `<p>Не из-за змеи. Создатель языка, Гвидо ван Россум, любил британское комедийное шоу «Летающий цирк Монти Пайтона» и назвал язык в его честь. Змея на логотипе появилась позже. Отсюда же шутливый тон в документации: примеры там часто про спам и яйца — тоже отсылка к скетчам.</p>`,
        },
        {
          type: "note",
          tone: "tip",
          title: "Стандартная библиотека",
          html: `<p><code>random</code> и <code>math</code> — часть стандартной библиотеки Python. Они уже стоят вместе с языком. А вот многие другие библиотеки нужно устанавливать отдельно — об этом урок про pip.</p>`,
        },
        {
          type: "quiz",
          question: "Что делает команда import random?",
          options: [
            "Создаёт случайное число",
            "Подключает библиотеку случайных чисел",
            "Устанавливает библиотеку из интернета",
          ],
          correct: 1,
          explain:
            "import только подключает уже установленную библиотеку. Число создаёт random.randint(), а установкой занимается pip.",
        },
        {
          type: "quiz",
          question: "После from math import sqrt как правильно найти корень из 9?",
          options: ["math.sqrt(9)", "sqrt(9)", "import sqrt(9)"],
          correct: 1,
          explain:
            "from ... import кладёт функцию «на стол»: имя math перед ней уже не нужно. Запись math.sqrt(9) сработала бы после обычного import math.",
        },
        {
          type: "task",
          title: "Бросок кубика",
          prompt: `<p>Подключите библиотеку <code>random</code> и выведите случайное целое число от 1 до 6.</p>`,
          starter: `import random

# Ваш бросок:
dice = ...
print(dice)`,
          checks: [
            { type: "contains", value: ["import random", "random.randint"], label: "Использованы import random и random.randint" },
            { type: "regex", value: "(^|\\D)[1-6](\\D|$)", label: "Выведено целое число от 1 до 6" },
          ],
          hints: [
            "Функция называется random.randint(1, 6).",
            "Результат сохраните в переменную и выведите.",
          ],
          success: "Кубик брошен. Вы только что воспользовались чужим готовым инструментом.",
          solution: `import random

dice = random.randint(1, 6)
print(dice)`,
        },
        {
          type: "task",
          title: "Один инструмент из ящика",
          prompt: `<p>Подключите только <code>sqrt</code> из <code>math</code> через <code>from ... import</code> и выведите корень из 25.</p>`,
          starter: `# Подключите sqrt одной строкой
print(sqrt(25))`,
          checks: [
            { type: "contains", value: ["from math import sqrt"], label: "Использован from math import sqrt" },
            { type: "output", value: ["5.0"], label: "В выводе есть 5.0" },
          ],
          hints: [
            "Строка подключения: from math import sqrt.",
            "Её нужно поставить выше print.",
          ],
          success: "Инструмент на столе. Теперь вместо math.sqrt хватает короткого sqrt.",
          solution: `from math import sqrt

print(sqrt(25))`,
        },
      ],
    },
    {
      id: "m7-l3",
      title: "random в деле",
      minutes: 7,
      summary:
        "randint, choice, shuffle и sample — четыре способа добавить игре случайности. А random.seed делает случайность повторяемой.",
      goal: "После урока вы сможете выбирать, перемешивать и вытягивать случайные значения с помощью random.",
      recall: "Забыли, что есть в random? Число — randint(a, b), один элемент — choice(список), перемешать — shuffle(список), несколько без повторов — sample(список, k).",
      keyIdeas: [
        "randint(a, b) включает обе границы; choice выбирает один элемент, sample — несколько без повторов.",
        "shuffle перемешивает сам список и ничего не возвращает.",
        "Случайность проверяют по формату и диапазону, а random.seed(число) делает результат повторяемым.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>У <code>random</code> много полезных команд. <code>randint(a, b)</code> даёт целое число, <code>choice()</code> выбирает один элемент из списка, <code>shuffle()</code> перемешивает список, а <code>sample(список, k)</code> вытягивает <code>k</code> разных элементов, как билеты в лотерее.</p>`,
        },
        {
          type: "code",
          code: `import random

friends = ["Аня", "Киото", "Мир", "Сад"]
winner = random.choice(friends)
print("Сегодня поливает:", winner)

for _ in range(3):
    print("Кубик:", random.randint(1, 6))`,
          caption:
            "Выведет имя из списка и три числа от 1 до 6 — каждый запуск разные. В цикле for _ переменная не используется: важно лишь повторить три раза.",
        },
        {
          type: "note",
          tone: "tip",
          title: "Обе границы включены",
          html: `<p>В отличие от <code>range()</code>, у <code>randint(1, 6)</code> шестёрка может выпасть. Это частый вопрос новичков: здесь правая граница входит.</p>`,
        },
        {
          type: "code",
          code: `import random

random.seed(7)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))

random.seed(7)
numbers = [1, 2, 3, 4, 5]
random.shuffle(numbers)
print(numbers)

random.seed(7)
print(random.sample(range(1, 11), 3))`,
          caption:
            "Выведет: 3 2 4, затем [5, 1, 4, 2, 3], затем [6, 3, 7]. random.seed(7) каждый раз «заводит» генератор с одной и той же точки, поэтому результат постоянный.",
        },
        {
          type: "note",
          tone: "why",
          title: "Как работает random: числа почти случайные",
          html: `<p>Компьютер не бросает настоящий кубик. Он берёт стартовое число и по хитрой формуле выдаёт «следующие» числа, которые выглядят случайными. Такие числа называют псевдослучайными. Стартовое число и есть <code>seed</code>: тот же seed — та же цепочка. Обычно Python сам выбирает seed по времени, поэтому каждый запуск разный. А в разборах и тестах seed фиксируют, чтобы результат можно было проверить.</p>`,
        },
        {
          type: "note",
          tone: "warn",
          title: "shuffle ничего не возвращает",
          html: `<p><code>random.shuffle(numbers)</code> перемешивает сам список. Запись <code>mixed = random.shuffle(numbers)</code> даст в <code>mixed</code> значение <code>None</code> — результат искать надо в самом списке.</p>`,
        },
        {
          type: "quiz",
          question: "Может ли random.randint(1, 6) вернуть 6?",
          options: ["Да", "Нет, только до 5", "Только если повезёт"],
          correct: 0,
          explain:
            "randint включает обе границы. range() — нет, а randint() — да. Это разные инструменты.",
        },
        {
          type: "quiz",
          question: "Зачем в примере для разбора ставят random.seed(7)?",
          options: [
            "Чтобы ускорить программу",
            "Чтобы случайные числа каждый раз были одинаковыми",
            "Чтобы выпадали только семёрки",
          ],
          correct: 1,
          explain:
            "seed задаёт стартовую точку генератора. С одним и тем же seed цепочка «случайных» чисел повторяется — удобно для проверки.",
        },
        {
          type: "task",
          title: "Случайный комплимент",
          prompt: `<p>Выберите случайную фразу из списка и выведите её. Используйте <code>random.choice()</code>.</p>`,
          starter: `import random

phrases = ["Ты справишься!", "Отличная работа!", "Ещё один шаг!"]
print(...)`,
          checks: [
            { type: "contains", value: ["import random", "random.choice"], label: "Использован random.choice" },
            { type: "output", value: ["!"], label: "Выведена одна из фраз" },
          ],
          hints: [
            "Вызов: random.choice(phrases).",
            "Результат можно сразу передать в print().",
          ],
          success: "Случайность подключена. С ней финальная игра станет по-настоящему живой.",
          solution: `import random

phrases = ["Ты справишься!", "Отличная работа!", "Ещё один шаг!"]
print(random.choice(phrases))`,
        },
        {
          type: "task",
          title: "Перемешать грядки",
          prompt: `<p>Перемешайте список грядок командой <code>random.shuffle()</code> и выведите список после перемешивания.</p>`,
          starter: `import random

beds = ["морковь", "укроп", "редис", "салат"]
# Перемешайте список здесь
print(beds)`,
          checks: [
            { type: "contains", value: ["random.shuffle(beds)"], label: "Список перемешан через random.shuffle" },
            { type: "output", value: ["морковь", "укроп", "редис", "салат"], label: "В выводе остались все четыре грядки" },
          ],
          hints: [
            "Вызов: random.shuffle(beds) — без присваивания.",
            "Поставьте его перед print.",
          ],
          success: "Порядок каждый раз новый, а состав списка прежний.",
          solution: `import random

beds = ["морковь", "укроп", "редис", "салат"]
random.shuffle(beds)
print(beds)`,
        },
        {
          type: "task",
          title: "Лотерейные числа",
          prompt: `<p>Вытяните три разных числа от 1 до 10 с помощью <code>random.sample(range(1, 11), 3)</code> и выведите список.</p>`,
          starter: `import random

lottery = ...
print(lottery)`,
          checks: [
            { type: "contains", value: ["random.sample"], label: "Использован random.sample" },
            { type: "regex", value: "\\[\\d+, \\d+, \\d+\\]", label: "Выведен список из трёх чисел" },
          ],
          hints: [
            "sample принимает набор значений и сколько штук вытянуть.",
            "Набор значений: range(1, 11), штук: 3.",
          ],
          success: "Три разных числа без повторов — как в настоящей лотерее.",
          solution: `import random

lottery = random.sample(range(1, 11), 3)
print(lottery)`,
        },
      ],
    },
    {
      id: "m7-l4",
      title: "math и statistics",
      minutes: 7,
      summary:
        "math считает корни и округляет, statistics находит среднее и медиану. А ошибка в имени библиотеки — просто подсказка.",
      goal: "После урока вы сможете считать корень, округлять вверх и вниз, находить среднее и медиану и разбирать ошибку подключения.",
      recall: "Забыли? math.sqrt — корень, math.pi — число пи, floor — вниз, ceil — вверх, statistics.mean — среднее, statistics.median — серединное значение.",
      keyIdeas: [
        "math даёт sqrt, pi, floor и ceil; round(x, n) встроен в Python и подключения не требует.",
        "statistics.mean считает среднее, statistics.median — серединное значение отсортированного списка.",
        "ModuleNotFoundError — нет такой библиотеки (проверьте имя), AttributeError — нет такой функции внутри.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>В ящике <code>math</code> лежат математические инструменты: <code>sqrt()</code> — корень, <code>pi</code> — число пи, <code>floor()</code> — округление вниз, <code>ceil()</code> — округление вверх. А <code>round(число, знаков)</code> встроена в Python: её подключать не нужно.</p>
<p>Ящик <code>statistics</code> умеет считать по списку: <code>mean()</code> — среднее, <code>median()</code> — серединное значение, когда числа выстроены по порядку.</p>`,
        },
        {
          type: "code",
          code: `import math
import statistics

print(math.sqrt(16))
print(math.floor(3.7), math.ceil(3.2))
print(round(math.pi, 2))

heights = [2, 3, 7, 10, 18]
print(statistics.mean(heights))
print(statistics.median(heights))`,
          caption: "Выведет: 4.0, затем 3 4, затем 3.14, затем 8 и 7. Среднее — сумма делить на количество, медиана — число посередине.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Среднее и медиана",
          html: `<p>Пять кустов выросли до 2, 3, 7, 10 и 18 см. Среднее (8) — «если бы все выросли поровну». Медиана (7) — рост куста, который стоит ровно посередине, если выстроить их по порядку. Один гигант в 18 см тянет среднее вверх, а медиана почти не меняется.</p>`,
        },
        {
          type: "code",
          code: `import mathh

print(math.sqroot(9))`,
          runnable: false,
          caption:
            "Первая строка даст ModuleNotFoundError: No module named 'mathh' — такого ящика нет, опечатка в имени. Если поправить на import math, вторая строка даст AttributeError: module 'math' has no attribute 'sqroot' — ящик есть, но инструмента с таким именем в нём нет (верно: sqrt).",
        },
        {
          type: "note",
          tone: "tip",
          title: "Две ошибки — два вопроса",
          html: `<p><code>ModuleNotFoundError</code> спрашивает: «Правильно ли написано имя ящика? Установлен ли он?» <code>AttributeError</code> спрашивает: «Правильно ли написано имя инструмента внутри?» Обычно это опечатка в одной букве.</p>`,
        },
        {
          type: "quiz",
          question: "Что вернёт math.ceil(3.2)?",
          options: ["3", "4", "3.2"],
          correct: 1,
          explain:
            "ceil округляет вверх до целого: 3.2 становится 4. floor округлил бы вниз до 3.",
        },
        {
          type: "quiz",
          question: "Вы написали math.sqroot(9) и получили AttributeError. Что это значит?",
          options: [
            "Библиотеку math нужно установить через pip",
            "В math нет функции с таким именем — проверьте написание",
            "Нельзя брать корень из девяти",
          ],
          correct: 1,
          explain:
            "AttributeError говорит, что внутри math нет sqroot. Правильное имя — sqrt. Установка тут ни при чём: math уже входит в Python.",
        },
        {
          type: "task",
          title: "Площадь круглой клумбы",
          prompt: `<p>Радиус клумбы — 3 метра. Посчитайте площадь по формуле <code>pi * r ** 2</code> с помощью <code>math.pi</code>, округлите до двух знаков через <code>round</code> и выведите.</p>`,
          starter: `import math

r = 3
area = ...
print(area)`,
          checks: [
            { type: "contains", value: ["math.pi", "round("], label: "Использованы math.pi и round" },
            { type: "output", value: ["28.27"], label: "В выводе есть 28.27" },
          ],
          hints: [
            "Площадь: math.pi * r ** 2.",
            "Округлить: round(площадь, 2).",
          ],
          success: "Клумба посчитана: 28.27 квадратных метров.",
          solution: `import math

r = 3
area = round(math.pi * r ** 2, 2)
print(area)`,
        },
        {
          type: "task",
          title: "Среднее и медиана",
          prompt: `<p>Даны сборы урожая за пять дней в килограммах. Выведите среднее и медиану с помощью <code>statistics</code>.</p>`,
          starter: `import statistics

harvest = [2, 3, 7, 10, 18]
# Выведите среднее и медиану
`,
          checks: [
            { type: "contains", value: ["statistics.mean", "statistics.median"], label: "Использованы statistics.mean и statistics.median" },
            { type: "output", value: ["8", "7"], label: "В выводе есть среднее 8 и медиана 7" },
          ],
          hints: [
            "statistics.mean(harvest) — среднее.",
            "statistics.median(harvest) — медиана. Каждое можно вывести отдельным print.",
          ],
          success: "Среднее 8, медиана 7 — теперь вы видите, как выбросы влияют на среднее.",
          solution: `import statistics

harvest = [2, 3, 7, 10, 18]
print(statistics.mean(harvest))
print(statistics.median(harvest))`,
        },
        {
          type: "task",
          title: "Сколько ящиков нужно",
          prompt: `<p>Нужно перевезти 23 горшка, в один ящик помещается 5. Посчитайте с <code>math.ceil</code>, сколько ящиков понадобится, и выведите число.</p>`,
          starter: `import math

pots = 23
per_box = 5
boxes = ...
print(boxes)`,
          checks: [
            { type: "contains", value: ["math.ceil"], label: "Использован math.ceil" },
            { type: "output", value: ["5"], label: "В выводе есть 5" },
          ],
          hints: [
            "Деление 23 / 5 даёт 4.6 — а ящик неполный всё равно нужен.",
            "Округлите вверх: math.ceil(pots / per_box).",
          ],
          success: "Пять ящиков: четыре полных и один неполный.",
          solution: `import math

pots = 23
per_box = 5
boxes = math.ceil(pots / per_box)
print(boxes)`,
        },
      ],
    },
    {
      id: "m7-l5",
      title: "Даты и время: datetime",
      minutes: 7,
      summary:
        "datetime умеет создавать даты, вычитать их друг из друга, прибавлять дни и красиво печатать результат.",
      goal: "После урока вы сможете создать дату, посчитать дни между датами, прибавить дни и красиво вывести дату.",
      recall: "Забыли? date(год, месяц, день) создаёт дату, разность двух дат — timedelta, у неё есть .days, а strftime(\"%d.%m.%Y\") печатает дату красиво.",
      keyIdeas: [
        "date(2025, 9, 1) создаёт дату; разность двух дат — timedelta, число дней в .days.",
        "Прибавить дни можно через timedelta(days=30).",
        "strftime с шаблоном (%d день, %m месяц, %Y год) превращает дату в красивый текст.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Даты нельзя считать как обычные числа: в месяцах разное количество дней, бывают високосные годы. Библиотека <code>datetime</code> берёт всё это на себя. Из неё нам нужны две вещи: <code>date</code> — сама дата и <code>timedelta</code> — промежуток времени.</p>
<p>Подключаем их записью <code>from datetime import date, timedelta</code>.</p>`,
        },
        {
          type: "code",
          code: `from datetime import date, timedelta

start = date(2025, 9, 1)
finish = date(2025, 12, 31)

gap = finish - start
print("Дней между датами:", gap.days)

later = start + timedelta(days=30)
print("Через 30 дней:", later)`,
          caption: "Выведет: Дней между датами: 121 и Через 30 дней: 2025-10-01. Разность двух дат — timedelta, из неё берём .days.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Календарь на стене",
          html: `<p>Дата — это крестик на стенном календаре. Разность двух дат — «сколько клеточек между крестиками». А timedelta — шаг, на который вы отсчитываете клеточки вперёд или назад.</p>`,
        },
        {
          type: "text",
          html: `<p>По умолчанию дата печатается как <code>2025-10-01</code>. Если нужен привычный вид, используйте <code>strftime()</code> с шаблоном: <code>%d</code> — день, <code>%m</code> — месяц, <code>%Y</code> — год из четырёх цифр.</p>`,
        },
        {
          type: "code",
          code: `from datetime import date

exam = date(2025, 9, 1)
print(exam.strftime("%d.%m.%Y"))
print(exam.strftime("%Y/%m/%d"))

event = date(2025, 9, 15)
days_left = (event - exam).days
print(f"До праздника урожая: {days_left} дн.")`,
          caption: "Выведет: 01.09.2025, затем 2025/09/01, затем «До праздника урожая: 14 дн.».",
        },
        {
          type: "note",
          tone: "warn",
          title: "Месяц — число, а не слово",
          html: `<p>В <code>date(2025, 9, 1)</code> месяц пишут числом без нуля впереди: <code>date(2025, 09, 1)</code> — синтаксическая ошибка. Порядок строгий: сначала год, потом месяц, потом день.</p>`,
        },
        {
          type: "quiz",
          question: "Что даёт date(2025, 9, 15) - date(2025, 9, 1)?",
          options: [
            "Число 14",
            "Промежуток timedelta в 14 дней",
            "Дату 2025-09-14",
          ],
          correct: 1,
          explain:
            "Разность дат — это timedelta. Чтобы получить просто число, берут .days: (… - …).days равно 14.",
        },
        {
          type: "quiz",
          question: "Какой шаблон strftime выведет 01.09.2025?",
          options: ["%Y.%m.%d", "%d.%m.%Y", "%d/%m/%y"],
          correct: 1,
          explain:
            "День, месяц, год через точки — %d.%m.%Y. В первом варианте год стоит первым, в третьем разделитель — косая черта.",
        },
        {
          type: "task",
          title: "Сколько дней до урожая",
          prompt: `<p>Посадка — 1 мая 2025, сбор урожая — 1 сентября 2025. Посчитайте, сколько дней между ними, и выведите число.</p>`,
          starter: `from datetime import date

planting = date(2025, 5, 1)
harvest = date(2025, 9, 1)
# Выведите число дней между датами
`,
          checks: [
            { type: "contains", value: [".days"], label: "Число дней взято через .days" },
            { type: "output", value: ["123"], label: "В выводе есть 123" },
          ],
          hints: [
            "Вычтите одну дату из другой: harvest - planting.",
            "Из результата возьмите .days и передайте в print.",
          ],
          success: "123 дня — столько растениям расти до сбора.",
          solution: `from datetime import date

planting = date(2025, 5, 1)
harvest = date(2025, 9, 1)
print((harvest - planting).days)`,
        },
        {
          type: "task",
          title: "Дата красиво",
          prompt: `<p>Выведите дату 8 марта 2025 в виде <code>08.03.2025</code> с помощью <code>strftime</code>.</p>`,
          starter: `from datetime import date

holiday = date(2025, 3, 8)
print(holiday)`,
          checks: [
            { type: "contains", value: ["strftime"], label: "Использован strftime" },
            { type: "output", value: ["08.03.2025"], label: "В выводе есть 08.03.2025" },
          ],
          hints: [
            "Метод вызывают у даты: holiday.strftime(...).",
            "Шаблон: \"%d.%m.%Y\".",
          ],
          success: "Привычный вид даты: день, месяц, год через точки.",
          solution: `from datetime import date

holiday = date(2025, 3, 8)
print(holiday.strftime("%d.%m.%Y"))`,
        },
        {
          type: "task",
          title: "Когда польём в следующий раз",
          prompt: `<p>Полили 10 сентября 2025. Следующий полив — через 14 дней. Выведите дату следующего полива в виде <code>24.09.2025</code>.</p>`,
          starter: `from datetime import date, timedelta

last = date(2025, 9, 10)
# Прибавьте 14 дней и выведите красиво
`,
          checks: [
            { type: "contains", value: ["timedelta(days=14)", "strftime"], label: "Использованы timedelta(days=14) и strftime" },
            { type: "output", value: ["24.09.2025"], label: "В выводе есть 24.09.2025" },
          ],
          hints: [
            "К дате можно прибавить timedelta: last + timedelta(days=14).",
            "Результат выведите через strftime(\"%d.%m.%Y\").",
          ],
          success: "Календарь посчитал сам — без ручного пересчёта месяцев.",
          solution: `from datetime import date, timedelta

last = date(2025, 9, 10)
nxt = last + timedelta(days=14)
print(nxt.strftime("%d.%m.%Y"))`,
        },
      ],
    },
    {
      id: "m7-l2",
      title: "pip и requirements.txt",
      minutes: 7,
      summary:
        "pip — установщик библиотек. Зависимость — библиотека, без которой код не работает. requirements.txt — список всего, что нужно вашему проекту.",
      goal: "После урока вы сможете объяснить, что такое pip, зависимость и requirements.txt, и записать список библиотек проекта.",
      recall: "Забыли? pip install имя — установить библиотеку, pip freeze — показать установленное, pip install -r requirements.txt — установить всё из списка.",
      keyIdeas: [
        "pip install устанавливает внешнюю библиотеку; это команда терминала, а не Python-код.",
        "Зависимость — библиотека, от которой зависит ваш код.",
        "requirements.txt перечисляет зависимости, чтобы проект повторился на другом компьютере.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Не всё лежит в стандартной библиотеке. Для работы с картинками, сайтами или данными существуют отдельные библиотеки. Их устанавливают командой <code>pip install имя</code>. <code>pip</code> — это «кладовщик», который приносит нужный инструмент с общего склада.</p>
<p>Когда ваш код использует библиотеку, она становится <strong>зависимостью</strong>: код зависит от неё, как рецепт зависит от наличия муки. Если передать проект другому человеку, ему нужно знать, какие библиотеки установить.</p>`,
        },
        {
          type: "code",
          code: `pip install requests
pip freeze
pip install -r requirements.txt`,
          runnable: false,
          caption:
            "Это команды терминала. Первая устанавливает requests, вторая показывает установленные библиотеки с версиями, третья ставит всё из файла-списка.",
        },
        {
          type: "text",
          html: `<p>Для этого существует файл <code>requirements.txt</code> — обычный список:</p>
<pre class="mono">requests
pillow==10.2.0
</pre>
<p>Первая строка — библиотека без указания версии, вторая — с версией. Достаточно выполнить <code>pip install -r requirements.txt</code>, и pip установит всё из списка.</p>`,
        },
        {
          type: "widget",
          widget: "pip-sim",
          config: {
            title: "Симуляция установки",
            note: "Это учебная симуляция: настоящий pip в браузере не запускается, но шаги — те же.",
            levels: [
              { label: "установка" },
              {
                label: "requirements",
                goal: "freeze",
                title: "Запишите зависимости",
                note: "Установите пакет, затем запишите его в requirements.txt.",
              },
              {
                label: "опечатка в имени",
                typo: true,
                goal: "freeze",
                title: "Найдите опечатку",
                note: "Один из вариантов установки написан с ошибкой. Pip поможет понять какой.",
              },
            ],
          },
        },
        {
          type: "note",
          tone: "analogy",
          title: "Список покупок для проекта",
          html: `<p>requirements.txt — как список покупок для рецепта. Передаёте проект другу вместе со списком, и он за одну команду покупает всё нужное, ничего не забыв.</p>`,
        },
        {
          type: "note",
          tone: "warn",
          title: "Это команда терминала, а не Python",
          html: `<p><code>pip install requests</code> пишется в терминале (командной строке), а не внутри программы. В Python-файле после установки вы просто пишете <code>import requests</code>.</p>`,
        },
        {
          type: "quiz",
          question: "Зачем нужен requirements.txt?",
          options: [
            "Чтобы хранить пароли",
            "Чтобы перечислить библиотеки, нужные проекту",
            "Чтобы ускорить программу",
          ],
          correct: 1,
          explain:
            "Это список зависимостей. По нему другой человек или сервер может одной командой установить всё необходимое.",
        },
        {
          type: "quiz",
          question: "Где пишут команду pip install requests?",
          options: [
            "В терминале, в командной строке",
            "Первой строкой Python-файла",
            "В скобках после print",
          ],
          correct: 0,
          explain:
            "pip — программа для терминала. В Python-коде используют import, а установку делают заранее.",
        },
        {
          type: "task",
          title: "Команда установки",
          prompt: `<p>Представьте, что вы пишете инструкцию для проекта. Впишите в комментарий команду, которая устанавливает библиотеку <code>requests</code>.</p>
<p>Проверка смотрит на текст, запускать программу не обязательно.</p>`,
          starter: `# Напишите здесь команду установки requests
# pip install ...
`,
          checks: [
            { type: "contains", value: ["pip install requests"], label: "Команда pip install requests написана" },
          ],
          hints: [
            "Формат: pip install имя_библиотеки.",
            "Имя библиотеки — requests.",
          ],
          success: "Команда записана. Теперь pip не выглядит страшным: это просто «принеси инструмент».",
          solution: `# pip install requests
`,
        },
        {
          type: "task",
          title: "Содержимое requirements.txt",
          prompt: `<p>Выведите программой две строки файла requirements.txt: сначала <code>requests</code>, затем <code>pillow==10.2.0</code> (библиотека с версией).</p>`,
          starter: `print("requests")
# Добавьте вторую строку списка
`,
          checks: [
            { type: "output", value: ["requests", "pillow==10.2.0"], label: "В выводе обе строки списка" },
            { type: "contains", value: ["print("], label: "Использован print" },
          ],
          hints: [
            "Версию указывают двумя знаками равенства: имя==версия.",
            "Нужна вторая команда print с pillow==10.2.0.",
          ],
          success: "Именно так выглядит файл зависимостей: по одной библиотеке в строке.",
          solution: `print("requests")
print("pillow==10.2.0")`,
        },
      ],
    },
    {
      id: "m7-l6",
      title: "Мини-проект: генератор паролей и кубики",
      minutes: 8,
      summary:
        "Собираем две полезные функции из random: генератор пароля нужной длины и бросок нескольких кубиков.",
      goal: "После урока вы сможете написать функции make_password(length) и roll_dice(count) и собрать из них маленькую программу.",
      recall: "Забыли? Пароль — цикл, где к строке дописывается random.choice(символы); кубики — цикл с random.randint(1, 6) и список результатов.",
      keyIdeas: [
        "random.choice работает и со строкой: он выбирает один случайный символ.",
        "Случайный результат собирают в цикле: пароль — строкой через +=, кубики — списком через append.",
        "Функцию со случайностью проверяют по формату: длина, допустимые символы, диапазон чисел.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Строка в Python — это последовательность символов, поэтому <code>random.choice("abc")</code> выберет одну случайную букву. Повторим выбор в цикле и склеим символы — получим пароль. Эту работу удобно спрятать в функцию с параметром <code>length</code>.</p>`,
        },
        {
          type: "code",
          code: `import random

def make_password(length):
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    password = ""
    for _ in range(length):
        password += random.choice(chars)
    return password

random.seed(7)
print(make_password(8))
print(len(make_password(12)))`,
          caption: "Первая строка — пароль из восьми символов (с seed(7) он каждый раз один и тот же), вторая выведет 12: длина второго пароля.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Мешочек с буквами",
          html: `<p>Представьте мешочек с буквенными фишками. <code>random.choice(chars)</code> — это «вытащи одну фишку, не глядя». Цикл повторяет вытягивание нужное число раз, а <code>+=</code> выкладывает фишки в ряд.</p>`,
        },
        {
          type: "code",
          code: `import random

def roll_dice(count):
    rolls = []
    for _ in range(count):
        rolls.append(random.randint(1, 6))
    return rolls

random.seed(7)
rolls = roll_dice(3)
print(rolls)
print("Сумма:", sum(rolls))`,
          caption: "Выведет: [3, 2, 4] и Сумма: 9. Функция возвращает список бросков, а sum складывает их.",
        },
        {
          type: "note",
          tone: "tip",
          title: "Как проверить случайную функцию",
          html: `<p>Точное значение угадать нельзя, поэтому проверяют свойства: у пароля длина 8 и только допустимые символы, у кубика число от 1 до 6. Так проверяют и в этом курсе: по формату, а не по конкретному результату.</p>`,
        },
        {
          type: "quiz",
          question: "Что сделает random.choice(\"abc\")?",
          options: [
            "Вернёт всю строку \"abc\"",
            "Вернёт один случайный символ: a, b или c",
            "Выдаст ошибку, потому что это не список",
          ],
          correct: 1,
          explain:
            "Строка — последовательность символов, поэтому choice выбирает один из них. Ошибки нет.",
        },
        {
          type: "quiz",
          question: "Как проверить, что make_password(8) работает правильно?",
          options: [
            "Сравнить с конкретным паролем из учебника",
            "Убедиться, что длина равна 8 и все символы допустимые",
            "Запустить один раз и посмотреть, что ошибок нет",
          ],
          correct: 1,
          explain:
            "Пароль каждый раз новый. Поэтому проверяем то, что не меняется: длину и набор разрешённых символов.",
        },
        {
          type: "task",
          title: "Генератор пароля",
          prompt: `<p>Допишите функцию <code>make_password(length)</code>: в цикле добавляйте к <code>password</code> случайный символ из <code>chars</code>. Затем выведите пароль из 8 символов.</p>`,
          starter: `import random

def make_password(length):
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    password = ""
    # Добавьте цикл
    return password

print(make_password(8))`,
          checks: [
            { type: "contains", value: ["random.choice", "for "], label: "Пароль собирается циклом из random.choice" },
            { type: "regex", value: "(^|\\s)[a-z0-9]{8}(\\s|$)", label: "Выведен пароль из 8 символов (буквы a-z и цифры)" },
          ],
          hints: [
            "Цикл: for _ in range(length):",
            "Внутри цикла: password += random.choice(chars)",
          ],
          success: "Пароль готов. Каждый запуск даёт новый.",
          solution: `import random

def make_password(length):
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    password = ""
    for _ in range(length):
        password += random.choice(chars)
    return password

print(make_password(8))`,
        },
        {
          type: "task",
          title: "Бросок нескольких кубиков",
          prompt: `<p>Допишите функцию <code>roll_dice(count)</code>, которая возвращает список из <code>count</code> бросков. Выведите результат броска трёх кубиков.</p>`,
          starter: `import random

def roll_dice(count):
    rolls = []
    # Добавьте цикл
    return rolls

print(roll_dice(3))`,
          checks: [
            { type: "contains", value: ["random.randint(1, 6)", "append"], label: "Использованы random.randint(1, 6) и append" },
            { type: "regex", value: "\\[[1-6], [1-6], [1-6]\\]", label: "Выведен список из трёх чисел от 1 до 6" },
          ],
          hints: [
            "Цикл: for _ in range(count):",
            "Внутри: rolls.append(random.randint(1, 6))",
          ],
          success: "Три кубика брошены. Теперь можно играть в настольные игры.",
          solution: `import random

def roll_dice(count):
    rolls = []
    for _ in range(count):
        rolls.append(random.randint(1, 6))
    return rolls

print(roll_dice(3))`,
        },
        {
          type: "task",
          title: "Челлендж: набор для игры",
          prompt: `<p>Соберите программу из трёх частей:</p>
<ol>
<li>Функция <code>make_password(length=10)</code> — пароль по умолчанию из 10 символов (буквы a-z и цифры).</li>
<li>Функция <code>roll_dice(count)</code> — список бросков.</li>
<li>Вывод в формате: <code>Пароль: ...</code>, <code>Кубики: [..., ...]</code> (два кубика) и <code>Сумма: ...</code>.</li>
</ol>`,
          starter: `import random

def make_password(length=10):
    # Ваш код
    return ""

def roll_dice(count):
    # Ваш код
    return []

print("Пароль:", make_password())
`,
          checks: [
            { type: "contains", value: ["def make_password", "def roll_dice", "random.choice", "random.randint", "sum("], label: "Две функции, random.choice, random.randint и sum" },
            { type: "regex", value: "Пароль: [a-z0-9]{10}(\\s|$)", label: "Выведен пароль из 10 символов" },
            { type: "regex", value: "Кубики: \\[[1-6], [1-6]\\]", label: "Выведены два кубика от 1 до 6" },
            { type: "regex", value: "Сумма: ([2-9]|1[0-2])(\\s|$)", label: "Выведена сумма от 2 до 12" },
          ],
          hints: [
            "Внутри функций повторите циклы из предыдущих заданий.",
            "Сохраните броски: rolls = roll_dice(2), затем выведите rolls и sum(rolls).",
            "Строка вывода: print(\"Кубики:\", rolls) даст формат [3, 5].",
          ],
          success: "Проект готов: у вас есть собственный набор функций на основе random.",
          solution: `import random

def make_password(length=10):
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    password = ""
    for _ in range(length):
        password += random.choice(chars)
    return password

def roll_dice(count):
    rolls = []
    for _ in range(count):
        rolls.append(random.randint(1, 6))
    return rolls

print("Пароль:", make_password())
rolls = roll_dice(2)
print("Кубики:", rolls)
print("Сумма:", sum(rolls))`,
        },
      ],
    },
  ],
};
