# Firebase Hosting без GitHub

## Бесплатно?

Да, на плане **Spark** Firebase Hosting бесплатен, но есть лимиты:

- около **10 ГБ** хранения;
- около **360 МБ трафика в день**;
- бесплатный SSL и поддомены `*.web.app` и `*.firebaseapp.com`.

Для сайта с Pyodide (~13 МБ Python при первом запуске) 360 МБ/день — небольшой
запас. При активных пользователях быстро упрётесь в лимит; тогда нужен Blaze
(платный) или другой хостинг.

## Важно про РФ

Firebase — Google. В России доступность не гарантирована: у некоторых провайдеров
`*.web.app` открывается только через VPN. После деплоя обязательно проверьте сайт
с мобильного интернета без VPN. Если не открывается — нужен российский хостинг.

## Деплой

```bash
npm install -g firebase-tools
firebase login
cd "/Users/klrt6/Documents/deepseek-harness/default-workspace/python-garden"
firebase init hosting
firebase deploy --only hosting
```

В `firebase init hosting`:

- **Use an existing project** или создайте новый;
- public directory: `.` (корень проекта);
- Configure as a single-page app: **No** (у нас hash-роутер);
- Set up automatic builds with GitHub: **No**;
- Overwrite `index.html`: **No**.

После деплоя:

```text
https://<project-id>.web.app
https://<project-id>.firebaseapp.com
```

## Обновление

```bash
firebase deploy --only hosting
```

## Supabase

После получения адреса Firebase обновите:

**Authentication → URL Configuration**

- Site URL: `https://<project-id>.web.app`
- Redirect URLs:
  - `https://<project-id>.web.app/**`
  - `https://<project-id>.firebaseapp.com/**`
  - `http://127.0.0.1:4175/**`

Иначе подтверждение email и сброс пароля будут вести на localhost.

## Кастомный домен

Firebase Console → **Hosting → Add custom domain**. Домен всё равно нужно купить;
`.dev` не бесплатный.

## Если Firebase не открывается без VPN

Тогда остаются российские варианты:

- **Beget** — есть бесплатный тариф с ограничениями;
- **Timeweb** — бесплатный/дешёвый хостинг;
- **Yandex Cloud** — стартовый грант, дальше платно;
- **VPS Timeweb/Beget** — платно, но стабильно в РФ.

## Закрытость кода

Firebase не публикует GitHub-репозиторий. Но HTML/CSS/JS всё равно отдаются
браузеру, как и на любом статическом хостинге.
