/**
 * Модуль 9. Ошибки и отладка.
 * Traceback, частые ошибки, try/except, проверка ввода, простые тесты и проект «Безопасный калькулятор».
 */

export default {
  id: "m9",
  number: 9,
  title: "Ошибки и отладка",
  zone: "Мостик через ручей",
  tagline: "Читать ошибки, ловить их и проверять свой код",
  description:
    "Шесть уроков о том, что делать, когда код ломается. Учимся читать traceback, узнавать частые ошибки, ловить их через try/except, не пускать в программу неверный ввод и проверять функции тестами. В конце — челлендж «Найди 5 ошибок» и проект «Безопасный калькулятор».",
  icon: "alert",
  lessons: [
    {
      id: "m9-l1",
      title: "Как читать traceback",
      minutes: 7,
      summary:
        "Когда программа падает, Python показывает цепочку вызовов. Учимся читать её снизу вверх: тип ошибки, сообщение и строка, где всё случилось.",
      goal: "После урока вы сможете по traceback найти тип ошибки, её сообщение и строку, в которой программа упала.",
      recall:
        "Забыли, с чего начать? Читайте traceback с последней строки: там тип и сообщение, а чуть выше — номер строки.",
      keyIdeas: [
        "Traceback — это не приговор, а подробная подсказка, где и почему программа упала.",
        "Последняя строка называет тип ошибки и причину, строки выше показывают путь к ней.",
        "Номер строки в самой нижней записи File указывает, где Python остановился.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Рано или поздно любая программа падает. Это нормально: даже опытные разработчики видят ошибки каждый день. Важно уметь читать то, что показывает Python, — и тогда ошибка превращается в подсказку.</p>
<p>Такое сообщение называется <strong>traceback</strong> («трассировка», след выполнения). Вот программа, которая упадёт:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `def average(total, count):
    return total / count

print("Старт")
print(average(10, 0))`,
          caption: "Этот код упадёт на пятой строке: функции передали ноль в качестве count.",
        },
        {
          type: "text",
          html: `<p>Сначала Python напечатает «Старт» — до ошибки всё выполнялось. А потом покажет вот это:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `Старт
Traceback (most recent call last):
  File "main.py", line 5, in <module>
    print(average(10, 0))
  File "main.py", line 2, in average
    return total / count
ZeroDivisionError: division by zero`,
          caption:
            "Читаем снизу вверх: последняя строка — тип и причина, выше — функция average и строка 2, ещё выше — вызов в строке 5.",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Хлебные крошки в лесу",
          html: `<p>Traceback похож на тропинку из хлебных крошек. Начало тропинки — это ваш вызов, а последняя крошка лежит ровно там, где Python споткнулся. Идти по ней нужно от конца: именно там лежит причина.</p>`,
        },
        {
          type: "text",
          html: `<p>Разберём части:</p>
<ul><li><code>File "main.py", line 5, in &lt;module&gt;</code> — файл, номер строки и место: <code>&lt;module&gt;</code> значит «основная часть программы».</li>
<li>Следующая строка с отступом — сам код из этой строки.</li>
<li><code>in average</code> — ошибка случилась внутри функции <code>average</code>.</li>
<li><code>ZeroDivisionError: division by zero</code> — тип ошибки, двоеточие и сообщение.</li></ul>
<p>Чем ниже запись <code>File</code>, тем ближе она к месту поломки. Обычно достаточно посмотреть на последнюю строку и на самую нижнюю запись <code>File</code>.</p>`,
        },
        {
          type: "note",
          tone: "why",
          title: "Почему ошибки полезны",
          html: `<p>Ошибка, которая сразу падает с понятным сообщением, — это хорошо. Хуже всего, когда программа молча даёт неверный ответ: её никто не заметит. Python нарочно останавливается и называет причину, чтобы вы исправили код, пока он ещё маленький.</p>`,
        },
        {
          type: "quiz",
          question: "С какой строки traceback лучше начинать чтение?",
          options: ["С первой строки Traceback", "С последней строки — там тип и сообщение", "С любой, они одинаковые"],
          correct: 1,
          explain:
            "В последней строке Python называет тип ошибки и причину. Затем смотрим на нижнюю запись File, чтобы найти строку.",
        },
        {
          type: "text",
          html: `<p>Теперь запустим исправленную версию: в качестве <code>count</code> передадим не ноль, а четвёрку.</p>`,
        },
        {
          type: "code",
          code: `def average(total, count):
    return total / count

print("Старт")
print(average(10, 4))
print("Конец")`,
          caption: "Выведет: Старт, 2.5 и Конец. Ошибки нет — traceback не появился.",
        },
        {
          type: "task",
          title: "Почините падающую программу",
          prompt: `<p>Программа должна вывести среднее: <code>10</code> разделить на <code>4</code>. Сейчас она падает с <code>ZeroDivisionError</code>. Найдите в traceback нужную строку и исправьте число в вызове.</p>`,
          starter: `def average(total, count):
    return total / count

print("Старт")
print(average(10, 0))`,
          checks: [
            { type: "noError", label: "Программа выполняется без ошибок" },
            { type: "output", value: ["Старт", "2.5"], label: "В выводе есть «Старт» и «2.5»" },
          ],
          hints: [
            "Ошибка в вызове average(10, 0): второй аргумент не может быть нулём.",
            "Замените 0 на 4.",
          ],
          success: "Ошибка найдена и исправлена: traceback привёл прямо к нужной строке.",
          solution: `def average(total, count):
    return total / count

print("Старт")
print(average(10, 4))`,
        },
        {
          type: "text",
          html: `<p>Теперь разберём ошибку иначе: она в том, что имя написано неверно. Вот traceback для такой программы:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print("Число:", cnt)
NameError: name 'cnt' is not defined`,
          caption: "Тип — NameError, имя — cnt, строка — 3. Python говорит: «Я не знаю такого имени».",
        },
        {
          type: "quiz",
          question: "В traceback написано line 3, in <module> — что это значит?",
          options: [
            "Ошибка в третьей строке основной части программы",
            "Ошибка внутри модуля math",
            "Программа выполнилась три раза",
          ],
          correct: 0,
          explain:
            "<module> означает основную часть программы, а не функцию. Номер после line — строка, где всё остановилось.",
        },
        {
          type: "task",
          title: "Прочитайте traceback сами",
          prompt: `<p>Python показал такую ошибку:</p>
<pre>Traceback (most recent call last):
  File "main.py", line 3, in &lt;module&gt;
    print("Число:", cnt)
NameError: name 'cnt' is not defined</pre>
<p>Выведите двумя командами <code>print</code>: сначала тип ошибки, потом имя, которого Python не знает.</p>`,
          starter: `# Первая строка: тип ошибки
# Вторая строка: имя, которого нет
`,
          checks: [
            { type: "output", value: ["NameError", "cnt"], label: "В выводе есть тип ошибки и имя" },
          ],
          hints: [
            "Тип ошибки стоит в последней строке до двоеточия.",
            "Имя написано в кавычках в сообщении: 'cnt'.",
          ],
          success: "Вы прочитали traceback как профессионал: тип, сообщение, причина.",
          solution: `print("NameError")
print("cnt")`,
        },
      ],
    },
    {
      id: "m9-l2",
      title: "Частые ошибки: NameError, TypeError, ValueError",
      minutes: 8,
      summary:
        "Три ошибки встречаются чаще всего. Учимся узнавать их по сообщению и сразу понимать, что исправить.",
      goal: "После урока вы сможете по сообщению узнать NameError, TypeError и ValueError и исправить код.",
      recall:
        "NameError — имя не найдено, TypeError — не тот тип данных, ValueError — тип верный, а значение не подходит.",
      keyIdeas: [
        "NameError значит, что Python не знает такого имени: проверьте опечатку и порядок строк.",
        "TypeError появляется, когда действие не подходит типу: например, текст плюс число.",
        "ValueError означает, что тип верный, но значение не годится: int(\"abc\").",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Ошибок в Python много, но три из них вы будете видеть чаще остальных. У каждой есть «почерк» — по сообщению можно сразу понять, что случилось.</p>
<p><strong>NameError</strong> — Python встретил имя, которое он не знает. Обычно опечатка или переменная ещё не создана.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `name = "Аня"
print("Привет,", nam)`,
          caption: "Упадёт: NameError: name 'nam' is not defined. Исправление: написать name.",
        },
        {
          type: "text",
          html: `<p><strong>TypeError</strong> — действие не подходит этому типу данных. Классика: склеить текст с числом через <code>+</code>.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `age = 25
print("Возраст: " + age)`,
          caption: "Упадёт: TypeError: can only concatenate str (not \"int\") to str. Исправление: f\"Возраст: {age}\".",
        },
        {
          type: "text",
          html: `<p><strong>ValueError</strong> — тип подходит, но значение нет. Функция <code>int()</code> умеет превращать текст в число, но не любой.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `number = int("двадцать")
print(number)`,
          caption: "Упадёт: ValueError: invalid literal for int() with base 10: 'двадцать'. Нужны цифры: \"20\".",
        },
        {
          type: "note",
          tone: "analogy",
          title: "Врач и симптомы",
          html: `<p>Сообщение об ошибке — как жалоба пациента. Врач не гадает: услышал «болит горло» — смотрит горло. Услышали «not defined» — ищите опечатку в имени, «can only concatenate» — проверяйте типы, «invalid literal» — смотрите, что за текст попал в <code>int()</code>.</p>`,
        },
        {
          type: "note",
          tone: "tip",
          title: "Чем TypeError отличается от ValueError",
          html: `<p>В <code>int("abc")</code> тип правильный — это строка, а <code>int()</code> умеет работать со строками. Но значение «abc» не похоже на число. Поэтому Python говорит <code>ValueError</code>, а не <code>TypeError</code>.</p>`,
        },
        {
          type: "code",
          code: `name = "Аня"
age = 25
print("Привет,", name)
print("Возраст: " + str(age))
print(f"Через год: {age + 1}")
number = int("20")
print(number + 1)`,
          caption: "Выведет: Привет, Аня; Возраст: 25; Через год: 26; 21. Все три ошибки здесь исправлены.",
        },
        {
          type: "text",
          html: `<p>Все такие ошибки собраны с примерами в разделе <a href="#/library">Библиотека</a> — найдите там «Атлас ошибок». Если увидели незнакомое сообщение, загляните туда: у каждой записи есть причина и способ исправить.</p>`,
        },
        {
          type: "quiz",
          question: "Что покажет Python: print(\"Баллы: \" + 10)?",
          options: ["NameError", "TypeError", "ValueError"],
          correct: 1,
          explain:
            "Текст нельзя сложить с числом через +. Это TypeError. Исправление: \"Баллы: \" + str(10) или f-строка.",
        },
        {
          type: "quiz",
          question: "Какая ошибка будет у int(\"3.5\")?",
          options: ["NameError", "TypeError", "ValueError"],
          correct: 2,
          explain:
            "Тип подходит (строка), но int() не понимает «3.5» как целое число. Для такого текста нужна float().",
        },
        {
          type: "task",
          title: "Исправьте три ошибки",
          prompt: `<p>В программе спрятаны три ошибки: <code>NameError</code>, <code>TypeError</code> и <code>ValueError</code>. Исправляйте по одной: запускайте, читайте сообщение, правьте. В конце должны получиться три строки: <strong>Привет, Аня</strong>, <strong>Через год вам будет 13</strong> и <strong>20</strong>.</p>`,
          starter: `name = "Аня"
age = 12
print("Привет, " + nme)
print("Через год вам будет " + age + 1)
number = int("двадцать")
print(number)`,
          checks: [
            { type: "noError", label: "Программа выполняется без ошибок" },
            { type: "output", value: ["Привет, Аня", "Через год вам будет 13", "20"], label: "Выведены все три строки" },
          ],
          hints: [
            "В первой строке опечатка в имени: переменная называется name.",
            "Во второй — число складывается с текстом. Посчитайте age + 1 отдельно и превратите в строку (str или f-строка).",
            "В третьей int() получил слово. Дайте ему цифры: \"20\".",
          ],
          success: "Три ошибки исправлены. Вы научились узнавать их по сообщению.",
          solution: `name = "Аня"
age = 12
print("Привет, " + name)
print("Через год вам будет " + str(age + 1))
number = int("20")
print(number)`,
        },
        {
          type: "task",
          title: "Сумма двух чисел",
          prompt: `<p>Программа спрашивает два числа и должна вывести <strong>Сумма: 7</strong>. Сейчас она падает с <code>TypeError</code>. Исправьте последнюю строку. При проверке вводятся 3 и 4.</p>`,
          starter: `a = int(input("Первое число: "))
b = int(input("Второе число: "))
total = a + b
print("Сумма: " + total)`,
          inputs: ["3", "4"],
          checks: [
            { type: "noError", label: "Программа выполняется без ошибок" },
            { type: "output", value: ["Сумма: 7"], label: "Выведено «Сумма: 7»" },
          ],
          hints: [
            "total — число, а «Сумма: » — текст. Плюсом их не склеить.",
            "Используйте f-строку: f\"Сумма: {total}\" или str(total).",
          ],
          success: "TypeError побеждён: числа и текст теперь вежливо сосуществуют.",
          solution: {
            code: `a = int(input("Первое число: "))
b = int(input("Второе число: "))
total = a + b
print(f"Сумма: {total}")`,
            answers: ["3", "4"],
          },
        },
      ],
    },
    {
      id: "m9-l3",
      title: "try / except — ловим ошибки",
      minutes: 8,
      summary:
        "Иногда ошибку можно предвидеть. Блок try / except позволяет попробовать опасное действие и вежливо ответить, если оно не получилось.",
      goal: "После урока вы сможете перехватить ошибку конкретного типа через try / except и не уронить программу.",
      recall:
        "try — попробуй, except Тип — что делать при ошибке этого типа, else — если ошибки не было, finally — выполнить в любом случае.",
      keyIdeas: [
        "try пробует выполнить код, а except называет тип ошибки и говорит, что делать дальше.",
        "Ловите конкретный тип (ValueError, ZeroDivisionError), а не любую ошибку подряд.",
        "else выполняется, если ошибки не было, а finally — всегда, что бы ни случилось.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>До сих пор ошибка останавливала программу. Но бывают ошибки, которые можно предвидеть: человек введёт слово вместо числа, а другой поделит на ноль. Для этого есть конструкция <code>try / except</code> — «попробуй / а если не вышло».</p>`,
        },
        {
          type: "note",
          tone: "analogy",
          title: "Страховочная сетка под канатом",
          html: `<p>Гимнаст идёт по канату — это блок <code>try</code>. Под ним натянута сетка — это <code>except</code>. Если всё хорошо, сетка не понадобится. Если оступился — сетка ловит, и представление продолжается.</p>`,
        },
        {
          type: "code",
          code: `try:
    number = int("abc")
    print("Число:", number)
except ValueError:
    print("Это не число")

print("Программа идёт дальше")`,
          caption:
            "Выведет: «Это не число» и «Программа идёт дальше». Строка с print(\"Число:\") не выполнится: ошибка случилась раньше.",
        },
        {
          type: "text",
          html: `<p>Как это работает: Python выполняет блок <code>try</code> строка за строкой. Как только возникает ошибка, он прыгает в <code>except</code> с подходящим типом. Если тип совпал — выполняется блок <code>except</code> и программа продолжается. Если тип не совпал, ошибка летит дальше, как обычно.</p>
<p>Ещё один частый случай — деление на ноль.</p>`,
        },
        {
          type: "code",
          code: `a = 10
b = 0

try:
    print(a / b)
except ZeroDivisionError:
    print("На ноль делить нельзя")`,
          caption: "Выведет: «На ноль делить нельзя». Без try здесь был бы traceback с ZeroDivisionError.",
        },
        {
          type: "quiz",
          question: "Что произойдёт после ошибки внутри try, если подходящий except есть?",
          options: [
            "Программа остановится с traceback",
            "Выполнится except, и программа пойдёт дальше",
            "Выполнится остаток try, а потом except",
          ],
          correct: 1,
          explain:
            "Остаток блока try пропускается, Python сразу переходит в подходящий except, а затем продолжает программу.",
        },
        {
          type: "text",
          html: `<p>К <code>try / except</code> можно добавить ещё два блока. <code>else</code> выполняется, если ошибки не было. <code>finally</code> — всегда, даже после ошибки. Используют его редко, но полезно знать.</p>`,
        },
        {
          type: "code",
          code: `try:
    n = int("5")
except ValueError:
    print("Не число")
else:
    print("Получилось:", n)
finally:
    print("Проверка закончена")`,
          caption: "Выведет: «Получилось: 5» и «Проверка закончена». Попробуйте заменить «5» на «пять» и сравните.",
        },
        {
          type: "note",
          tone: "why",
          title: "Почему не голый except",
          html: `<p>Запись <code>except:</code> без типа ловит вообще всё — в том числе опечатки вроде <code>NameError</code>. Тогда программа молча говорит «не число», хотя на самом деле вы просто ошиблись в имени. Конкретный тип ловит только ожидаемую беду, а настоящие ошибки по-прежнему видны.</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `try:
    number = int(text)   # опечатка: переменной text нет
except:
    print("Это не число")   # скрывает NameError!`,
          caption: "Плохой пример: голый except спрятал настоящую ошибку. Правильно — except ValueError.",
        },
        {
          type: "quiz",
          question: "Почему лучше писать except ValueError, а не просто except?",
          options: [
            "Так программа работает быстрее",
            "Ловится только ожидаемая ошибка, а остальные не прячутся",
            "Python запрещает except без типа",
          ],
          correct: 1,
          explain:
            "Голый except глушит любые ошибки, включая опечатки. Конкретный тип оставляет настоящие баги на виду.",
        },
        {
          type: "task",
          title: "Поймайте ValueError",
          prompt: `<p>Превратите текст в число, но так, чтобы программа не падала. Если текст не число — выведите <strong>Не число</strong>. Допишите блок <code>except</code> с нужным типом ошибки.</p>`,
          starter: `text = "двенадцать"

try:
    number = int(text)
    print(number)
# допишите except`,
          checks: [
            { type: "contains", value: "except ValueError", label: "Есть except ValueError" },
            { type: "output", value: ["Не число"], label: "В выводе есть «Не число»" },
            { type: "noError", label: "Программа не падает" },
          ],
          hints: [
            "После блока try идёт строка except ValueError: с двоеточием.",
            "Внутри except с отступом напишите print(\"Не число\").",
          ],
          success: "Ошибка поймана: программа вежливо ответила и не упала.",
          solution: `text = "двенадцать"

try:
    number = int(text)
    print(number)
except ValueError:
    print("Не число")`,
        },
        {
          type: "task",
          title: "Безопасное деление",
          prompt: `<p>Допишите функцию <code>divide(a, b)</code>. Она возвращает частное, а при делении на ноль — текст <strong>Деление на ноль</strong>. Ловите именно <code>ZeroDivisionError</code>. Две строки вызова уже стоят.</p>`,
          starter: `def divide(a, b):
    return a / b

print(divide(10, 2))
print(divide(5, 0))`,
          checks: [
            { type: "contains", value: ["try", "except ZeroDivisionError"], label: "Использованы try и except ZeroDivisionError" },
            { type: "output", value: ["5.0", "Деление на ноль"], label: "Выведены 5.0 и «Деление на ноль»" },
          ],
          hints: [
            "Внутри функции поместите return a / b в блок try.",
            "В except ZeroDivisionError: сделайте return \"Деление на ноль\".",
          ],
          success: "Функция стала безопасной: на ноль делить можно, программа не упадёт.",
          solution: `def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Деление на ноль"

print(divide(10, 2))
print(divide(5, 0))`,
        },
      ],
    },
    {
      id: "m9-l4",
      title: "Валидация ввода — пока не введут число",
      minutes: 8,
      summary:
        "Пользователь вводит что угодно. Цикл while True с try / except спрашивает снова, пока не получит верный ответ, а проверка диапазона отсеивает странные числа.",
      goal: "После урока вы сможете спрашивать у пользователя число в цикле, пока он не введёт его правильно и в нужном диапазоне.",
      recall:
        "Шаблон: while True, внутри try с int(input()), при удаче break, в except — подсказка и новый круг.",
      keyIdeas: [
        "Цикл while True + try / except ValueError спрашивает снова, пока ввод не станет числом.",
        "break выходит из цикла только тогда, когда ответ уже верный.",
        "Диапазон проверяют отдельным if после того, как текст стал числом.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Любая программа, которая спрашивает число, ломается при слове «много» или пустой строке. Это не вина человека — так бывает у всех. Задача программы: вежливо попросить ещё раз.</p>
<p>Нужен шаблон из трёх частей: бесконечный цикл, <code>try</code> с преобразованием и <code>break</code> при успехе.</p>`,
        },
        {
          type: "note",
          tone: "analogy",
          title: "Охранник у входа",
          html: `<p>Охранник не пускает человека без билета и каждый раз повторяет: «Покажите билет». Он не злится и не уходит. Как только билет показан — пропускает. Наш цикл ведёт себя так же: просит, пока ответ не подойдёт.</p>`,
        },
        {
          type: "code",
          inputs: ["abc", "7"],
          code: `while True:
    text = input("Введите число: ")
    try:
        number = int(text)
        break
    except ValueError:
        print("Это не число, попробуйте ещё раз")

print("Вы ввели", number)`,
          caption:
            "Ответы «abc» и «7»: сначала «Это не число…», потом «Вы ввели 7». Если int() сработал, break выходит из цикла.",
        },
        {
          type: "text",
          html: `<p>Теперь добавим диапазон. Цикл тот же, но после <code>try</code> проверяем: число в нужных границах? Заодно вынесем всё в функцию — её удобно использовать много раз.</p>`,
        },
        {
          type: "code",
          inputs: ["abc", "150", "25"],
          code: `def ask_number(low, high):
    while True:
        text = input(f"Число от {low} до {high}: ")
        try:
            number = int(text)
        except ValueError:
            print("Нужно число")
            continue
        if low <= number <= high:
            return number
        print("Вне диапазона")

age = ask_number(1, 100)
print("Принято:", age)`,
          caption:
            "Ответы «abc», «150», «25»: «Нужно число», «Вне диапазона» и «Принято: 25». Функция возвращает число только после успеха.",
        },
        {
          type: "quiz",
          question: "Где в шаблоне стоит break?",
          options: [
            "В блоке except — когда ошибка",
            "В блоке try после успешного int() — когда ввод верный",
            "Перед циклом",
          ],
          correct: 1,
          explain:
            "break в try срабатывает только если int() прошёл без ошибки. При ошибке Python уходит в except, и цикл идёт на новый круг.",
        },
        {
          type: "quiz",
          question: "Что делает continue в блоке except?",
          options: [
            "Завершает цикл",
            "Пропускает остаток круга и спрашивает снова",
            "Игнорирует ошибку навсегда",
          ],
          correct: 1,
          explain:
            "continue начинает новый круг цикла сразу, поэтому проверка диапазона ниже не выполняется для неверного текста.",
        },
        {
          type: "task",
          title: "Спрашивать, пока не число",
          prompt: `<p>Сейчас программа падает на слове «abc». Оберните ввод в цикл <code>while True</code> с <code>try / except ValueError</code>. При ошибке выведите <strong>Это не число</strong>, при успехе — <strong>Принято: число</strong>. При проверке будут введены abc, x, 42.</p>`,
          starter: `text = input("Введите число: ")
number = int(text)
print("Принято:", number)`,
          inputs: ["abc", "x", "42"],
          checks: [
            { type: "contains", value: ["while True", "except ValueError", "break"], label: "Использованы while True, except ValueError и break" },
            { type: "output", value: ["Это не число", "Принято: 42"], label: "Есть подсказка об ошибке и итог «Принято: 42»" },
          ],
          hints: [
            "Всё, что спрашивает и превращает в число, перенесите внутрь while True.",
            "После number = int(text) поставьте break; в except напечатайте подсказку.",
            "Строку print(\"Принято:\", number) оставьте после цикла, без отступа.",
          ],
          success: "Теперь программа выдержит любой неверный ввод.",
          solution: {
            code: `while True:
    text = input("Введите число: ")
    try:
        number = int(text)
        break
    except ValueError:
        print("Это не число")

print("Принято:", number)`,
            answers: ["abc", "x", "42"],
          },
        },
        {
          type: "task",
          title: "Возраст от 1 до 120",
          prompt: `<p>Добавьте проверку диапазона. Если текст не число — <strong>Нужно число</strong> (уже сделано). Если число меньше 1 или больше 120 — выведите <strong>Вне диапазона</strong> и спросите снова. Если всё хорошо — <strong>Возраст принят: 30</strong>. При проверке введены abc, 200, -5, 30.</p>`,
          starter: `while True:
    text = input("Ваш возраст: ")
    try:
        age = int(text)
    except ValueError:
        print("Нужно число")
        continue
    # проверьте диапазон и при успехе выйдите из цикла

print("Возраст принят:", age)`,
          inputs: ["abc", "200", "-5", "30"],
          checks: [
            { type: "output", value: ["Нужно число", "Вне диапазона", "Возраст принят: 30"], label: "Выведены подсказки и итог «Возраст принят: 30»" },
            { type: "contains", value: "break", label: "Цикл завершается через break" },
          ],
          hints: [
            "Нужно условие: 1 <= age <= 120 — тогда break.",
            "Иначе (else) выведите «Вне диапазона». Цикл сам пойдёт на следующий круг.",
          ],
          success: "Ввод проверен дважды: тип и диапазон. Надёжно!",
          solution: {
            code: `while True:
    text = input("Ваш возраст: ")
    try:
        age = int(text)
    except ValueError:
        print("Нужно число")
        continue
    if 1 <= age <= 120:
        break
    print("Вне диапазона")

print("Возраст принят:", age)`,
            answers: ["abc", "200", "-5", "30"],
          },
        },
      ],
    },
    {
      id: "m9-l5",
      title: "Как тестировать свой код",
      minutes: 8,
      summary:
        "Тест — это проверка функции на примерах с заранее известным ответом. assert останавливает программу, если ответ не совпал, а печать «ожидалось / получилось» показывает разницу.",
      goal: "После урока вы сможете проверить свою функцию тремя проверками, включая граничный случай, и понять, где она ошибается.",
      recall:
        "assert выражение — молчит, если верно, и падает с AssertionError, если нет. Проверяйте обычный случай, ноль и границу.",
      keyIdeas: [
        "Тест — вызов функции с готовым значением и сравнение с ожидаемым ответом.",
        "assert молчит при верном результате и падает с AssertionError при неверном.",
        "Самые интересные тесты — граничные случаи: ноль, границы диапазона, пустое значение.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Как узнать, что функция работает правильно? Запустить один раз и посмотреть — этого мало. Лучше записать несколько проверок, которые можно повторять после каждой правки. Это и есть <strong>тесты</strong>.</p>
<p>Простейший тест — слово <code>assert</code> («утверждаю»). Если утверждение верно, ничего не происходит. Если нет — программа останавливается с <code>AssertionError</code>.</p>`,
        },
        {
          type: "note",
          tone: "analogy",
          title: "Проба блюда",
          html: `<p>Повар пробует суп до того, как нести гостям. Он знает, каким должен быть вкус — это «ожидалось». Он пробует — это «получилось». Если не совпало, подсаливает и пробует снова. Тесты — то же самое для кода.</p>`,
        },
        {
          type: "code",
          code: `def double(x):
    return x * 2

assert double(2) == 4
assert double(0) == 0
assert double(-3) == -6
print("Все проверки прошли")`,
          caption: "Выведет: «Все проверки прошли». Если хотя бы один assert неверен, до print дело не дойдёт.",
        },
        {
          type: "text",
          html: `<p>А что, если проверка не прошла? Вот как выглядит такая ошибка:</p>`,
        },
        {
          type: "code",
          runnable: false,
          code: `assert double(2) == 5, "double(2) должно быть 4"`,
          caption:
            "Упадёт: AssertionError: double(2) должно быть 4. Текст после запятой — ваше пояснение, оно выводится в traceback.",
        },
        {
          type: "text",
          html: `<p>Когда проверок много, удобнее не падать на первой, а видеть все результаты. Напишем маленькую функцию, которая печатает «ожидалось / получилось».</p>`,
        },
        {
          type: "code",
          code: `def check(name, expected, got):
    if expected == got:
        print(f"ОК: {name}")
    else:
        print(f"ОШИБКА: {name} — ожидалось {expected}, получилось {got}")

def discount(price):
    if price > 1000:
        return price * 0.9
    return price

check("дёшево", 500, discount(500))
check("дорого", 1800.0, discount(2000))
check("граница 1000", 900.0, discount(1000))`,
          caption:
            "Выведет: ОК, ОК и «ОШИБКА: граница 1000 — ожидалось 900.0, получилось 1000». Скидка должна быть и при 1000, значит, нужно >=.",
        },
        {
          type: "note",
          tone: "tip",
          title: "Какие случаи проверять",
          html: `<p>Хорошая тройка тестов: обычное значение, ноль (или пустое) и граница. Ошибки чаще всего прячутся на границах: «больше» вместо «больше или равно» легко пропустить глазами, а тест его ловит.</p>`,
        },
        {
          type: "quiz",
          question: "Что делает assert, если выражение верно?",
          options: ["Печатает «ОК»", "Ничего — программа идёт дальше", "Останавливает программу"],
          correct: 1,
          explain: "assert молчит, пока всё хорошо. Громко он говорит только при ошибке.",
        },
        {
          type: "quiz",
          question: "Какой тест самый ценный для функции is_adult(age): age >= 18?",
          options: ["is_adult(30)", "is_adult(18)", "is_adult(100)"],
          correct: 1,
          explain: "18 — граница. Именно на ней легко перепутать > и >=, а на 30 и 100 функция сработает в любом случае.",
        },
        {
          type: "task",
          title: "Три проверки для square",
          prompt: `<p>Функция <code>square(x)</code> возводит число в квадрат. Допишите три проверки в таком виде: <code>assert square(0) == 0</code>, <code>assert square(3) == 9</code>, <code>assert square(-4) == 16</code>.</p>`,
          starter: `def square(x):
    return x * x

# допишите три assert здесь

print("Все проверки прошли")`,
          checks: [
            { type: "contains", value: ["assert square(0) == 0", "assert square(3) == 9", "assert square(-4) == 16"], label: "Записаны три проверки assert" },
            { type: "output", value: ["Все проверки прошли"], label: "Все проверки проходят" },
          ],
          hints: [
            "Одна проверка — одна строка: assert square(3) == 9.",
            "Не забудьте про ноль и отрицательное число — это важные случаи.",
          ],
          success: "Три проверки на месте — функцию можно смело править.",
          solution: `def square(x):
    return x * x

assert square(0) == 0
assert square(3) == 9
assert square(-4) == 16

print("Все проверки прошли")`,
        },
        {
          type: "task",
          title: "Найдите ошибку по тесту",
          prompt: `<p>Функция <code>is_adult(age)</code> должна возвращать <code>True</code> для 18 и больше. Тесты уже написаны, и один из них падает с <code>AssertionError</code>. Исправьте функцию, а не тесты.</p>`,
          starter: `def is_adult(age):
    return age > 18

assert is_adult(30) == True
assert is_adult(18) == True
assert is_adult(10) == False

print("Тесты прошли")`,
          checks: [
            { type: "noError", label: "Все тесты проходят без ошибок" },
            { type: "output", value: ["Тесты прошли"], label: "Выведено «Тесты прошли»" },
          ],
          hints: [
            "Тест с числом 18 падает: 18 > 18 — это False.",
            "Нужно «больше или равно»: >=.",
          ],
          success: "Тест нашёл граничную ошибку, а вы её исправили.",
          solution: `def is_adult(age):
    return age >= 18

assert is_adult(30) == True
assert is_adult(18) == True
assert is_adult(10) == False

print("Тесты прошли")`,
        },
        {
          type: "task",
          title: "Напишите функцию и тесты",
          prompt: `<p>Напишите функцию <code>is_even(n)</code>: она возвращает <code>True</code> для чётного числа и <code>False</code> для нечётного. Потом добавьте три <code>assert</code> вида <code>assert is_even(0) == True</code> — ноль, нечётное и отрицательное число.</p>`,
          starter: `# напишите функцию is_even и три assert

print("Тесты пройдены")`,
          checks: [
            { type: "contains", value: ["def is_even", "assert is_even(0)"], label: "Есть функция и проверка с нулём" },
            { type: "output", value: ["Тесты пройдены"], label: "Все тесты проходят" },
          ],
          hints: [
            "Число чётное, если n % 2 == 0. Верните результат сравнения.",
            "Проверьте is_even(0), is_even(7) и is_even(-4).",
          ],
          success: "Функция и три теста — маленький, но настоящий набор проверок.",
          solution: `def is_even(n):
    return n % 2 == 0

assert is_even(0) == True
assert is_even(7) == False
assert is_even(-4) == True

print("Тесты пройдены")`,
        },
      ],
    },
    {
      id: "m9-l6",
      title: "Челлендж: найди и исправь 5 ошибок + безопасный калькулятор",
      minutes: 8,
      summary:
        "Сначала тренируем глаз: ищем ошибки в чужом коде на трёх уровнях. Потом собираем проект модуля — калькулятор, который не падает от неверного ввода и деления на ноль.",
      goal: "После урока вы сможете найти типичные ошибки в коде и собрать защищённую программу с try / except, проверкой деления на ноль и циклом ввода.",
      recall:
        "Читайте traceback с конца, ловите конкретный тип ошибки, проверяйте деление на ноль и спрашивайте ввод в цикле, пока он не станет верным.",
      keyIdeas: [
        "Опытный взгляд замечает типичные ошибки: пропущенное двоеточие, = вместо ==, незакрытая скобка, неверные типы.",
        "Безопасная программа продумывает плохие случаи: неверный ввод и деление на ноль.",
        "Тесты и защитные проверки вместе делают код надёжным.",
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Это проектный урок. Сначала разомнёмся: найдём ошибки в чужом коде. Потом соберём калькулятор, который не боится ни слов вместо чисел, ни нуля в делителе.</p>`,
        },
        {
          type: "widget",
          widget: "find-error",
          config: {
            title: "Найдите строку с ошибкой",
            file: "sum.py",
            lines: [
              "numbers = [3, 5, 8]",
              "total = 0",
              "for n in numbers:",
              "total = total + n",
              "print(total)",
            ],
            badLine: 3,
            levels: [
              { label: "одна ошибка" },
              {
                label: "три ошибки",
                title: "Три ошибки в калькуляторе",
                file: "calc.py",
                lines: [
                  "def add(a, b):",
                  "    return a + b",
                  "def divide(a, b):",
                  "    if b = 0:",
                  '        return "Деление на ноль"',
                  "    return a / b",
                  "print(add(2, 3)",
                  "print(divide(8, 2))",
                  "print(dvide(1, 0))",
                ],
                badLines: [3, 6, 8],
                explain:
                  "В строке 4 стоит = вместо ==: для сравнения нужны два знака. В строке 7 не закрыта скобка. В строке 9 опечатка в имени функции: dvide вместо divide (NameError).",
              },
              {
                label: "несколько в одном файле",
                title: "Пять ошибок в одном файле",
                file: "calc_full.py",
                lines: [
                  "# Калькулятор",
                  "def ask_number(text):",
                  "    while True:",
                  "        try:",
                  "            return int(input(text))",
                  "        except ValueError",
                  '            print("Нужно число")',
                  'a = ask_number("Первое: ")',
                  'b = ask_number("Второе: ")',
                  'print("Сумма: " + (a + b))',
                  "if b = 0:",
                  '    print("Делить на ноль нельзя")',
                  "else:",
                  'print("Частное:", a / b)',
                  'print("Конец)',
                ],
                badLines: [5, 9, 10, 13, 14],
                explain:
                  "Пять ошибок: нет двоеточия после except ValueError (строка 6); текст плюс число в строке 10 даёт TypeError; = вместо == в строке 11; после else в строке 14 нет отступа; в строке 15 не закрыта кавычка. Комментарий и остальные строки в порядке.",
              },
            ],
            explain:
              "В строке 4 после for нет отступа: тело цикла должно быть сдвинуто. Правильно: четыре пробела перед total = total + n.",
          },
        },
        {
          type: "quiz",
          question: "Какой ошибкой закончится программа, если в строке if b = 0: поставить один знак =?",
          options: ["SyntaxError", "NameError", "ZeroDivisionError"],
          correct: 0,
          explain:
            "Python не понимает присваивание там, где нужно условие. Он остановится ещё до запуска программы с SyntaxError.",
        },
        {
          type: "text",
          html: `<h3>Проект: «Безопасный калькулятор»</h3>
<p>Калькулятор должен пережить всё: «abc» вместо числа, неизвестное действие и деление на ноль. Соберём его из трёх частей: ввод в цикле, безопасные вычисления и проверки. Начнём с первой части — деления.</p>`,
        },
        {
          type: "task",
          title: "Шаг 1. Безопасное деление",
          prompt: `<p>Напишите функцию <code>safe_divide(a, b)</code>. Если <code>b</code> равно нулю — верните текст <strong>Деление на ноль невозможно</strong>. Иначе верните частное. В решении используйте <code>try / except ZeroDivisionError</code>.</p>`,
          starter: `def safe_divide(a, b):
    # ваш код здесь
    pass

print(safe_divide(8, 2))
print(safe_divide(5, 0))`,
          checks: [
            { type: "contains", value: ["try", "except ZeroDivisionError"], label: "Использованы try и except ZeroDivisionError" },
            { type: "output", value: ["4.0", "Деление на ноль невозможно"], label: "Выведены 4.0 и сообщение о нуле" },
          ],
          hints: [
            "Положите return a / b в try, а return с сообщением — в except ZeroDivisionError.",
            "Не забудьте убрать pass.",
          ],
          success: "Деление на ноль больше не роняет программу.",
          solution: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Деление на ноль невозможно"

print(safe_divide(8, 2))
print(safe_divide(5, 0))`,
        },
        {
          type: "task",
          title: "Шаг 2. Ввод числа в цикле",
          prompt: `<p>Напишите функцию <code>ask_number(text)</code>: она спрашивает число в цикле <code>while True</code> и при ошибке <code>ValueError</code> выводит <strong>Нужно число</strong>. Верните число после успешного ввода. При проверке введены abc, 8.</p>`,
          starter: `def ask_number(text):
    # цикл while True + try / except ValueError
    return int(input(text))

x = ask_number("Число: ")
print("Принято:", x)`,
          inputs: ["abc", "8"],
          checks: [
            { type: "contains", value: ["while True", "except ValueError"], label: "Есть цикл и обработка ValueError" },
            { type: "output", value: ["Нужно число", "Принято: 8"], label: "Выведены «Нужно число» и «Принято: 8»" },
          ],
          hints: [
            "Внутри while True поставьте try: return int(input(text)).",
            "В except ValueError: выведите «Нужно число» — цикл сам повторится.",
          ],
          success: "Функция ввода готова: теперь её можно использовать везде.",
          solution: {
            code: `def ask_number(text):
    while True:
        try:
            return int(input(text))
        except ValueError:
            print("Нужно число")

x = ask_number("Число: ")
print("Принято:", x)`,
            answers: ["abc", "8"],
          },
        },
        {
          type: "task",
          title: "Шаг 3. Собираем калькулятор",
          prompt: `<p>Соберите всё вместе. Функция <code>ask_number</code> должна работать как в шаге 2, а <code>calculate(a, op, b)</code> — выполнять <code>+</code>, <code>-</code>, <code>*</code> и <code>/</code>. Деление защитите от нуля: верните <strong>Деление на ноль невозможно</strong>. Для неизвестного действия — <strong>Неизвестная операция</strong>. При проверке введены abc, 10, /, 0.</p>`,
          starter: `def ask_number(text):
    # цикл while True + try / except ValueError
    return int(input(text))

def calculate(a, op, b):
    if op == "+":
        return a + b
    # допишите "-", "*" и "/" (с защитой от нуля)
    return "Неизвестная операция"

a = ask_number("Первое число: ")
op = input("Действие (+ - * /): ")
b = ask_number("Второе число: ")
print("Результат:", calculate(a, op, b))`,
          inputs: ["abc", "10", "/", "0"],
          checks: [
            { type: "contains", value: ["while True", "except ValueError"], label: "Ввод числа защищён циклом и except ValueError" },
            { type: "output", value: ["Нужно число", "Деление на ноль невозможно"], label: "Выведены «Нужно число» и сообщение о нуле" },
            { type: "notOutput", value: ["Неизвестная операция"], label: "Действие «/» распознано" },
          ],
          hints: [
            "Для каждого действия добавьте свой if op == ...: return ... или цепочку elif.",
            "Для «/» внутри проверьте b == 0 или используйте try / except ZeroDivisionError.",
            "ask_number берите из шага 2: он выводит «Нужно число» при ошибке.",
          ],
          success: "Калькулятор готов: он переживёт и слова вместо чисел, и ноль в делителе.",
          solution: {
            code: `def ask_number(text):
    while True:
        try:
            return int(input(text))
        except ValueError:
            print("Нужно число")

def calculate(a, op, b):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        try:
            return a / b
        except ZeroDivisionError:
            return "Деление на ноль невозможно"
    return "Неизвестная операция"

a = ask_number("Первое число: ")
op = input("Действие (+ - * /): ")
b = ask_number("Второе число: ")
print("Результат:", calculate(a, op, b))`,
            answers: ["abc", "10", "/", "0"],
          },
        },
        {
          type: "task",
          title: "Шаг 4. Тесты для калькулятора",
          prompt: `<p>Проект не готов, пока он не проверен. Допишите несколько <code>assert</code> для <code>calculate</code>: сложение, деление и деление на ноль. Минимум три проверки, например <code>assert calculate(6, "/", 0) == "Деление на ноль невозможно"</code>.</p>`,
          starter: `def calculate(a, op, b):
    if op == "+":
        return a + b
    elif op == "/":
        if b == 0:
            return "Деление на ноль невозможно"
        return a / b
    return "Неизвестная операция"

# допишите assert здесь

print("Тесты прошли")`,
          checks: [
            { type: "contains", value: ["assert calculate("], label: "Есть проверки assert calculate(...)" },
            { type: "output", value: ["Тесты прошли"], label: "Все тесты проходят" },
          ],
          hints: [
            "Например: assert calculate(2, \"+\", 3) == 5.",
            "Не забудьте граничный случай: деление на ноль и неизвестное действие.",
          ],
          success: "Проект защищён: код делает то, что обещает, и это проверено.",
          solution: `def calculate(a, op, b):
    if op == "+":
        return a + b
    elif op == "/":
        if b == 0:
            return "Деление на ноль невозможно"
        return a / b
    return "Неизвестная операция"

assert calculate(2, "+", 3) == 5
assert calculate(6, "/", 3) == 2.0
assert calculate(6, "/", 0) == "Деление на ноль невозможно"
assert calculate(1, "?", 1) == "Неизвестная операция"

print("Тесты прошли")`,
        },
        {
          type: "code",
          inputs: ["abc", "12", "/", "4"],
          code: `def ask_number(text):
    while True:
        try:
            return int(input(text))
        except ValueError:
            print("Нужно число")

def calculate(a, op, b):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        try:
            return a / b
        except ZeroDivisionError:
            return "Деление на ноль невозможно"
    return "Неизвестная операция"

a = ask_number("Первое число: ")
op = input("Действие (+ - * /): ")
b = ask_number("Второе число: ")
print("Результат:", calculate(a, op, b))`,
          caption:
            "Готовый проект с ответами abc, 12, /, 4: «Нужно число», затем «Результат: 3.0». Сохраните его в файл и покажите друзьям — попробуйте сломать его сами.",
        },
      ],
    },
  ],
};
