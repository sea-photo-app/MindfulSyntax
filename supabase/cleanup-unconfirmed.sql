-- Удалить только пользователей, которые ещё не подтвердили email.
-- Профили удалятся каскадно благодаря profiles.id -> auth.users(id).
delete from auth.users
where email_confirmed_at is null
  and created_at < now() - interval '10 minutes';
