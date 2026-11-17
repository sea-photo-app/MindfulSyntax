# Деплой MindfulSyntax: домен, хостинг, Supabase

## Коротко

- **Бесплатный .dev навсегда** — не существует. `.dev` стоит примерно **$10–15 в год**.
- Для проверки бесплатно используйте поддомен хостинга: `*.pages.dev`, `*.netlify.app`, `*.vercel.app` или `*.github.io`.
- Лучший бесплатный старт для этого статического сайта — **Cloudflare Pages**.
- Домен `.dev` покупайте у **Porkbun**, **Namecheap** или **Cloudflare Registrar**.
- `.ru` для РФ — **REG.RU**, **Timeweb**, **Beget**.

## 1. Сначала выложить сайт без домена

Сайт статический: сборка не нужна, `index.html` лежит в корне.

### Вариант A: Cloudflare Pages

1. Зарегистрируйтесь на <https://dash.cloudflare.com>.
2. Создайте пустой репозиторий на GitHub.
3. В папке проекта:

```bash
cd "/Users/klrt6/Documents/deepseek-harness/default-workspace/python-garden"
git init
git add .
git commit -m "MindfulSyntax"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/mindfulsyntax.git
git push -u origin main
```

4. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
5. Выберите репозиторий.
6. Настройки сборки:
   - Framework preset: **None**
   - Build command: оставить пустым
   - Build output directory: `/`
7. **Save and Deploy**.
8. Получите адрес вида `https://mindfulsyntax.pages.dev`.

### Вариант B: Netlify

1. <https://app.netlify.com/drop>.
2. Перетащите папку `python-garden`.
3. Получите `https://random-name.netlify.app`.
4. Позже подключите домен в **Domain settings**.

### Вариант C: GitHub Pages

1. Запушьте репозиторий на GitHub.
2. Repository → **Settings** → **Pages**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Получите `https://логин.github.io/репозиторий/`.

## 2. Бесплатный домен: что реально бывает

| Вариант | Цена | Подходит |
|---|---:|---|
| `*.pages.dev` | бесплатно | тест, портфолио |
| `*.netlify.app` | бесплатно | тест |
| `*.vercel.app` | бесплатно | тест |
| `*.github.io` | бесплатно | тест |
| `имя.dev` | ~$10–15/год | нормальный запуск |
| `имя.ru` | ~200–400 ₽/год | запуск в РФ |

Чего избегать:

- Freenom и «бесплатные домены» из рекламы — часто отбирают домен или не дают
  управлять DNS.
- Обещаний «бесплатный .dev навсегда» — легального постоянного варианта нет.
- Vercel даёт бесплатный `.dev` только в **платном Pro**, а не на Free.

Актуальные цены на `.dev`: <https://tldes.com/dev>.

## 3. Купить .dev

### Porkbun

1. <https://porkbun.com> → поиск нужного имени.
2. Проверьте цену **продления**, не только первого года.
3. Включите бесплатный WHOIS Privacy.
4. Оплатите картой.
5. Домен появится в **Account → Domains**.

### Namecheap

1. <https://www.namecheap.com> → поиск.
2. Добавьте **WhoisGuard** (обычно бесплатно).
3. Оплатите.

### Cloudflare Registrar

1. <https://dash.cloudflare.com> → **Domain Registration**.
2. Перенесите или зарегистрируйте домен.
3. Cloudflare продаёт по себестоимости, без наценки; нужен аккаунт Cloudflare.

## 4. Подключить домен к Cloudflare Pages

1. Купите домен.
2. В Cloudflare Pages откройте проект → **Custom domains** → **Set up a domain**.
3. Введите `mindfulsyntax.dev` и `www.mindfulsyntax.dev`.
4. Если домен уже в Cloudflare — DNS создастся автоматически.
5. Если домен у другого регистратора:
   - смените nameservers на выданные Cloudflare;
   - или добавьте CNAME, который покажет Cloudflare.
6. Дождитесь статуса **Active** и HTTPS-сертификата.

`.dev` входит в HSTS preload: сайт обязан работать по HTTPS. Cloudflare Pages
выдаёт сертификат автоматически, поэтому это нормально.

## 5. Настроить Supabase под домен

В Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://mindfulsyntax.dev`
- **Redirect URLs**:
  - `https://mindfulsyntax.dev/**`
  - `http://127.0.0.1:4175/**` — для локальной проверки

Если оставить только localhost, письма подтверждения будут вести на localhost.

## 6. Discord

1. <https://discord.com/developers/applications> → **New Application**.
2. **OAuth2 → Redirects** → добавьте:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. Скопируйте Client ID и Client Secret.
4. Supabase → **Authentication → Providers → Discord** → включите и вставьте ID/Secret.
5. В `js/supabase-config.js` поставьте:

```js
export const DISCORD_ENABLED = true;
```

## 7. VK

VK подключается позже как Custom OAuth/OIDC. Для него нужны:
приложение VK, callback URL Supabase и настройка provider. До этого кнопку VK не показываем.

## 8. Проверка после деплоя

1. Откройте `https://ваш-домен/#/register`.
2. Зарегистрируйтесь с реальным email.
3. Подтвердите письмо.
4. Войдите.
5. Пройдите урок, перезагрузите страницу — прогресс должен сохраниться.
6. Проверьте таблицу `profiles` в Supabase.

## 9. Юридическое

Домен и хостинг сами по себе не решают 152-ФЗ. Supabase Free хранит данные вне РФ.
Для публичного запуска с персональными данными нужен российский хостинг/база или
отдельное правовое решение. Для физлица в политике укажите ФИО, адрес и email.
