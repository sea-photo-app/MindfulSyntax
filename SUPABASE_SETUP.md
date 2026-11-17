# Supabase: запуск аккаунтов и базы

## 1. Почему Supabase

Для MVP до ~100 пользователей подходит **Supabase Free**:

- Postgres, Auth, REST API и RLS в одном месте;
- бесплатный тариф без карты;
- Discord OAuth встроен;
- позже можно перенести базу на российский VPS.

Важно: по умолчанию Supabase размещает данные **вне РФ**. Для публичного запуска
по 152-ФЗ нужен перенос базы в РФ или отдельное правовое решение. Это технический
MVP, а не готовая юридическая схема.

## 2. Создание проекта

1. Зарегистрируйтесь на <https://supabase.com>.
2. Создайте проект, выберите ближайший регион.
3. Откройте **SQL Editor** → **New query**.
4. Откройте файл `supabase/schema.sql` в редакторе, скопируйте **всё содержимое файла**
   (начиная с `-- MindfulSyntax` и до последней `;`) и вставьте в SQL Editor.
   Не вставляйте путь `supabase/schema.sql` — SQL Editor воспримет его как SQL и
   выдаст `syntax error at or near "supabase"`.
5. Нажмите **Run**.
6. В **Project Settings → API** скопируйте:
   - Project URL;
   - anon public key.
7. Вставьте их в `js/supabase-config.js`:

```js
export const SUPABASE_URL = "https://xxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJ...";
```

Никогда не вставляйте `service_role` в браузерный код.

## 3. Auth настройки

В **Authentication → URL Configuration**:

- Site URL: `http://localhost:4175` для проверки;
- Redirect URLs: `http://localhost:4175/**` и будущий домен.

В **Authentication → Providers**:

- Email включён;
- Discord: создайте приложение в Discord Developer Portal, добавьте
  `https://<project>.supabase.co/auth/v1/callback` и включите provider.
- VK: позже через Custom OAuth/OIDC; кнопку пока не включаем.

Для подтверждения email и сброса пароля используются стандартные письма Supabase.
Для реального запуска лучше подключить свой SMTP (Resend, Unisend, Mailgun).

## 4. Если письмо подтверждения не приходит

Встроенная почта Supabase — только демо: очень низкий лимит (примерно 2 письма
в час на проект), и часть писем может не доходить. Для нормальной работы нужен
свой SMTP.

1. Проверьте **Authentication → Users**: возможно, старый аккаунт не удалился,
   и повторная регистрация с тем же email не создаёт нового пользователя.
2. Проверьте **Authentication → Logs**: ошибки `rate limit` или `email`.
3. Проверьте папку «Спам».
4. Быстрый тест: **Authentication → Providers → Email → Confirm email** выключить.
   Тогда вход работает сразу без письма. Для публичного сайта лучше оставить
   подтверждение и подключить SMTP.
5. Свой SMTP: **Authentication → Settings → SMTP Settings**. Подойдёт бесплатный
   Brevo (300 писем/день) или Resend. Укажите host, port 587, логин, SMTP-ключ,
   sender email и сохраните.

Удаление своего аккаунта работает через RPC `delete_own_account` из
`supabase/delete-own-account.sql`; отдельная настройка Supabase не нужна.

## 5. Как работает клиент

- `js/supabase.js` — REST-клиент Auth/PostgREST без SDK.
- `js/account.js` — режим Supabase, если заданы URL и anon key; иначе локальный fallback.
- `js/views/auth.js` — вход, регистрация, Discord, сброс пароля.
- `js/views/reset.js` — восстановление пароля.
- Таблица `profiles`: один JSONB-прогресс на пользователя, RLS разрешает только свои данные.

## 6. Проверка

1. Запустите сайт и откройте `#/register`.
2. Подтвердите email (если включено).
3. Войдите, пройдите урок, перезагрузите страницу — прогресс должен восстановиться.
4. В таблице `profiles` появится запись с вашим `progress`.

## 7. Оператор-физлицо

Вы частное лицо, а не юридическое. В `js/legal-config.js` уже стоит статус
«Физическое лицо»; останется указать ФИО, адрес для обращений и email. ИНН нужен
только если вы самозанятый/ИП; ОГРН для физлица не указывается.

## 8. Бесплатно и по 152-ФЗ

- **Supabase Free** — быстрый бесплатный MVP, но данные вне РФ.
- **Yandex Cloud / VK Cloud** — стартовые гранты, затем платно.
- **Timeweb / Beget** — недорогой российский VPS; там можно поднять PocketBase
  или Postgres и перенести схему.
- Бесплатного «навсегда» российского Postgres с локализацией обычно нет; считайте
  это этапом MVP, а не финальным хостингом.

## 9. Ограничения

- Токен доступа живёт около часа; клиент пока не делает автоматический refresh.
- Удаление пользователя требует включённой опции удаления аккаунта в Supabase.
- Для 100+ пользователей и РФ смотрите Yandex Cloud/Timeweb/Beget + PocketBase/Postgres.
