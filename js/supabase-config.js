/**
 * Публичная конфигурация Supabase.
 * publishable/anon key можно держать в браузере: доступ ограничен RLS.
 * service_role сюда добавлять нельзя.
 */
export const SUPABASE_URL = "https://ufiwzitqjadlrpjnhzks.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_wZI_M3J-PugCiUQTZ8p3-A_cH8KpFXn";

// Включить после настройки Discord provider в Supabase.
export const DISCORD_ENABLED = false;
