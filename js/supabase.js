/**
 * Минимальный REST-клиент Supabase: auth + profiles.
 * Без SDK, чтобы сайт оставался статическим и офлайн-дружелюбным.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY, DISCORD_ENABLED } from "./supabase-config.js";

const SESSION_KEY = "mindfulsyntax:supabase-session:v1";
export const serverConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function normalizeBase(url) {
  return String(url || "").replace(/\/+$/, "");
}

const BASE = normalizeBase(SUPABASE_URL);

function headers(token = "", extra = {}) {
  const result = {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    ...extra,
  };
  if (token) result.Authorization = `Bearer ${token}`;
  return result;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
      const message = data?.msg || data?.message || data?.error_description || data?.error || `HTTP ${response.status}`;
      throw new Error(message);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  try {
    if (session?.access_token) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* приватный режим */
  }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}

export function saveAuthSession(payload) {
  if (!payload?.access_token) return null;
  const session = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token || "",
    expires_at: Date.now() + (Number(payload.expires_in || 3600) * 1000),
    user: payload.user || null,
  };
  writeSession(session);
  return session;
}

export async function signUp({ email, password, redirectTo }) {
  const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
  const data = await request(`${BASE}/auth/v1/signup${query}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function signIn({ email, password }) {
  const data = await request(`${BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function getUser(token) {
  return request(`${BASE}/auth/v1/user`, { headers: headers(token) });
}

export async function logout(token) {
  if (!token) return;
  try {
    await request(`${BASE}/auth/v1/logout`, { method: "POST", headers: headers(token) });
  } catch {
    /* сессия всё равно очищается локально */
  }
}

export async function recover(email, redirectTo) {
  const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
  return request(`${BASE}/auth/v1/recover${query}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email }),
  });
}

export async function updatePassword(token, password) {
  return request(`${BASE}/auth/v1/user`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({ password }),
  });
}

export async function deleteOwnAccount(token) {
  // RPC работает через Postgres SECURITY DEFINER и удаляет только auth.uid().
  return request(`${BASE}/rest/v1/rpc/delete_own_account`, {
    method: "POST",
    headers: headers(token),
    body: "{}",
  });
}

export async function getProfile(token, id) {
  const data = await request(`${BASE}/rest/v1/profiles?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: headers(token),
  });
  return Array.isArray(data) ? data[0] || null : null;
}

export async function upsertProfile(token, profile) {
  return request(`${BASE}/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: headers(token, { Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(profile),
  });
}

export function oauthUrl(provider = "discord", redirectTo = "") {
  if (provider === "discord" && !DISCORD_ENABLED) return "";
  const redirect = redirectTo || `${location.origin}${location.pathname}`;
  return `${BASE}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirect)}`;
}

/** Supabase кладёт токены в hash после OAuth/подтверждения/recovery. */
export function consumeAuthHash() {
  if (!location.hash) return null;
  // Supabase иногда добавляет токены после уже существующего hash:
  // #/account#access_token=... — берём часть начиная с access_token.
  const raw = location.hash;
  const marker = raw.indexOf("access_token=");
  if (marker < 0) return null;
  const params = new URLSearchParams(raw.slice(marker));
  const access = params.get("access_token");
  if (!access) return null;
  const payload = {
    access_token: access,
    refresh_token: params.get("refresh_token") || "",
    expires_in: params.get("expires_in") || 3600,
    token_type: params.get("token_type") || "bearer",
    type: params.get("type") || "",
    user: null,
  };
  saveAuthSession(payload);
  // Убираем токены из адресной строки; маршрут восстановит initAccount.
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  return payload;
}
