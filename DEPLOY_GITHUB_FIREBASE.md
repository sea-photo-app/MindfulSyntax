# Приватный GitHub + Firebase Hosting + Supabase

## Итог

- репозиторий **private**;
- деплой из GitHub Actions;
- сайт на бесплатном `*.web.app`;
- Supabase — аккаунты и база;
- свой домен можно подключить позже, но он не бесплатный.

## 1. Создать приватный репозиторий

```bash
cd "/Users/klrt6/Documents/deepseek-harness/default-workspace/python-garden"
git init
git add .
git commit -m "MindfulSyntax"
git branch -M main
```

На GitHub создайте **Private** repository, затем:

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/mindfulsyntax.git
git push -u origin main
```

Проверьте, что repository → **Settings → General → Danger Zone** показывает
**Change visibility → Make public**, то есть репозиторий сейчас private.

## 2. Создать Firebase-проект

1. <https://console.firebase.google.com>.
2. **Add project** → имя `mindfulsyntax`.
3. Google Analytics можно отключить.
4. В проекте откройте **Hosting** → **Get started**.

## 3. Взять service account для GitHub Actions

1. Firebase Console → **Project settings** (шестерёнка) → **Service accounts**.
2. **Generate new private key**.
3. Скачается JSON. Не коммитьте его в репозиторий.

## 4. Добавить secrets в GitHub

Repository → **Settings → Secrets and variables → Actions → New repository secret**:

- `FIREBASE_SERVICE_ACCOUNT` — весь JSON из service account;
- `FIREBASE_PROJECT_ID` — ID проекта Firebase, например `mindfulsyntax-xxxx`.

Workflow уже лежит в `.github/workflows/firebase-hosting.yml`.

## 5. Запушить

```bash
git add .
git commit -m "Deploy to Firebase"
git push
```

GitHub → **Actions** → **Deploy to Firebase Hosting** → дождаться зелёной галочки.

Адрес:

```text
https://<project-id>.web.app
https://<project-id>.firebaseapp.com
```

## 6. Supabase

В Supabase → **Authentication → URL Configuration**:

- Site URL: `https://<project-id>.web.app`
- Redirect URLs:
  - `https://<project-id>.web.app/**`
  - `https://<project-id>.firebaseapp.com/**`
  - `http://127.0.0.1:4175/**`

## 7. Бесплатный домен

Бесплатного `.dev` нет. Не покупайте «бесплатные домены» у Freenom и подобных.

Бесплатный вариант — **сам адрес Firebase**:

```text
https://<project-id>.web.app
```

Это полноценный HTTPS-адрес, его достаточно для запуска.

Если нужен именно свой домен:

- `.dev` — примерно $10–15/год;
- `.ru` — примерно 200–400 ₽/год.

Бесплатные поддомены вроде `is-a-good.dev` или `eu.org` существуют, но это чужой
домен, ручная модерация и риск, что Firebase не примет его как custom domain.
Для бренда лучше купить домен позже.

## 8. Если Firebase не открывается в РФ

Проверьте `*.web.app` с мобильного интернета без VPN. Если не работает —
переносите сайт на российский VPS/хостинг. Репозиторий и GitHub Actions можно
оставить приватными, только изменить шаг деплоя.

## 9. Закрытость

Private repository скрывает код от поиска GitHub. Но HTML/CSS/JS на сайте всё
равно доступны посетителю. Для закрытия уроков используйте Supabase RLS и
серверную выдачу контента.
