# Закрытый деплой без GitHub

## Важно

Сайт статический: HTML, CSS и JS **всегда** попадают в браузер посетителя.
Кнопка «запретить копирование» этого не меняет. Полностью скрыть клиентский код
нельзя. Можно:

- не публиковать репозиторий;
- минифицировать/обфусцировать JS (замедляет копирование, но не защищает);
- держать приватную логику и контент на сервере (Supabase Edge Functions);
- добавить копирайт и лицензию;
- хранить код в приватном аккаунте хостинга, а не в открытом GitHub.

## Вариант 1: Cloudflare Pages, загрузка папки без Git

Самый простой путь.

1. Зарегистрируйтесь на <https://dash.cloudflare.com>.
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Название проекта: `mindfulsyntax`.
4. Перетащите папку `python-garden` или загрузите её содержимое.
5. **Deploy site**.
6. Получите `https://mindfulsyntax.pages.dev`.
7. Для обновлений: **Create new deployment → Upload assets** и загрузите папку снова.

Код лежит в вашем приватном проекте Cloudflare, публичного GitHub-репозитория нет.
Но помните: посетитель всё равно может открыть исходники страницы в браузере.

### Через Wrangler без GitHub

```bash
cd "/Users/klrt6/Documents/deepseek-harness/default-workspace/python-garden"
npx wrangler login
npx wrangler pages deploy . --project-name mindfulsyntax
```

Первый запуск создаст проект, следующие — обновят его. Git не нужен.

## Вариант 2: Netlify без Git

1. <https://app.netlify.com/drop>.
2. Перетащите папку `python-garden`.
3. Получите `https://имя.netlify.app`.
4. Обновление — снова перетащить папку или:

```bash
npx netlify-cli deploy --dir=. --prod
```

## Вариант 3: Vercel без GitHub

```bash
cd "/Users/klrt6/Documents/deepseek-harness/default-workspace/python-garden"
npx vercel --prod
```

Vercel загрузит папку напрямую, без Git. Для статического сайта framework можно
не выбирать.

## Домен без GitHub

Домен покупается отдельно у регистратора:

- `.dev` — Porkbun, Namecheap, Cloudflare Registrar (~$10–15/год);
- `.ru` — REG.RU, Timeweb, Beget (~200–400 ₽/год).

После покупки в Cloudflare Pages:

**Custom domains → Set up a domain** → введите домен → следуйте DNS-инструкциям.

## Как уменьшить риск копирования

1. **Не публикуйте репозиторий.** Используйте direct upload.
2. **Не кладите service_role key** в браузер.
3. **Приватный контент — на сервере.** Если уроки должны быть закрытыми, храните
   их в Supabase и отдавайте только авторизованным через RLS/Edge Function.
4. **Обфускация JS** — только как небольшая помеха:
   `javascript-obfuscator` или `terser`, но она может сломать ES-модули и динамические импорты.
5. **Лицензия и копирайт.** Добавьте файл `LICENSE` с запретом копирования и
   уведомление в подвале. Это юридическая, а не техническая защита.
6. **Мониторинг клонов.** Иногда помогает DMCA/жалоба хостингу, но не гарантирует.

## Что выбрать

- Нужен быстрый закрытый деплой — **Cloudflare Pages Upload assets**.
- Нужны обновления из терминала — **Wrangler**.
- Нужен максимально простой drag-and-drop — **Netlify Drop**.
- Нужен российский хостинг — **Timeweb/Beget VPS**, но это уже платно.

## После деплоя

Обновите в Supabase:

- Site URL: `https://ваш-домен`;
- Redirect URLs: `https://ваш-домен/**`.

Иначе подтверждение email и сброс пароля будут вести на localhost.
