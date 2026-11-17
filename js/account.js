/**
 * Аккаунты: Supabase при наличии конфигурации, локальный режим как fallback.
 * Пароль через Supabase не хранится в проекте; локальный fallback использует PBKDF2.
 */
import { getState, replaceState, snapshotState, subscribe, resetProgress } from "./state.js";
import { POLICY_VERSION } from "./legal-config.js";
import * as sb from "./supabase.js";

const ACCOUNTS_KEY = "mindfulsyntax:accounts:v1";
const SESSION_KEY = "mindfulsyntax:session:v1";
const listeners = new Set();
const serverEnabled = sb.serverConfigured;
let serverAccount = null;
let initialized = false;
let saveTimer = 0;

function notify() {
  const account = currentAccount();
  listeners.forEach((fn) => {
    try { fn(account); } catch (error) { console.error("Ошибка подписчика аккаунта", error); }
  });
}

/* ---------- локальный fallback ---------- */
function readAccounts() {
  try {
    const data = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    return Array.isArray(data.accounts) ? data.accounts : [];
  } catch { return []; }
}
function readLocalSession() {
  try { return localStorage.getItem(SESSION_KEY) || ""; } catch { return ""; }
}
function writeAccounts(accounts) {
  try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ version: 1, accounts })); } catch { /* noop */ }
}
function writeLocalSession(id) {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* noop */ }
}
function safeAccount(account) {
  if (!account) return null;
  return {
    id: account.id,
    email: account.email,
    createdAt: account.createdAt,
    consentAt: account.consentAt,
    policyVersion: account.policyVersion,
  };
}
function localActiveRecord() {
  const id = readLocalSession();
  if (!id) return null;
  return readAccounts().find((account) => account.id === id) || null;
}
function syncLocalProgress() {
  const account = localActiveRecord();
  if (!account) return;
  const accounts = readAccounts();
  const index = accounts.findIndex((item) => item.id === account.id);
  if (index < 0) return;
  accounts[index] = { ...accounts[index], progress: snapshotState() };
  writeAccounts(accounts);
}
function humanAuthError(message) {
  const text = String(message || "");
  if (/invalid login credentials/i.test(text)) return "Неверный email или пароль.";
  if (/email not confirmed/i.test(text)) return "Подтвердите email — проверьте почту.";
  if (/user already registered/i.test(text)) return "Аккаунт с таким email уже существует.";
  if (/password should be at least/i.test(text)) return "Пароль должен быть не короче 8 символов.";
  if (/for security purposes/i.test(text)) return "Слишком много попыток. Подождите минуту.";
  return text || "Не удалось выполнить действие.";
}

function normalizeEmail(value) { return String(value || "").trim().toLowerCase(); }
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email); }

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  if (globalThis.crypto?.subtle) {
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: encoder.encode(salt), iterations: 150000, hash: "SHA-256" },
      key, 256,
    );
    return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let hash = 2166136261;
  for (const char of `${salt}:${password}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}
function makeSalt() {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/* ---------- Supabase ---------- */
function safeServerAccount(user, profile = {}) {
  return {
    id: user.id,
    email: user.email || profile.email || "",
    createdAt: profile.created_at ? Date.parse(profile.created_at) : Date.now(),
    consentAt: profile.consent_at ? Date.parse(profile.consent_at) : Date.now(),
    policyVersion: profile.policy_version || POLICY_VERSION,
  };
}

async function hydrateServer(session) {
  if (!session?.access_token) throw new Error("Нет активной сессии.");
  const user = await sb.getUser(session.access_token);
  if (!user?.id) throw new Error("Сессия устарела.");
  let profile = await sb.getProfile(session.access_token, user.id);
  if (!profile) {
    const now = new Date().toISOString();
    profile = {
      id: user.id,
      email: user.email,
      progress: {},
      consent_at: now,
      policy_version: POLICY_VERSION,
      created_at: now,
    };
    await sb.upsertProfile(session.access_token, profile);
  }
  serverAccount = safeServerAccount(user, profile);
  if (profile.progress) replaceState(profile.progress);
  notify();
  return serverAccount;
}

function scheduleServerSave() {
  if (!serverEnabled || !serverAccount) return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(async () => {
    const session = sb.readSession();
    if (!session?.access_token || !serverAccount) return;
    try {
      await sb.upsertProfile(session.access_token, {
        id: serverAccount.id,
        email: serverAccount.email,
        progress: snapshotState(),
        consent_at: new Date(serverAccount.consentAt).toISOString(),
        policy_version: serverAccount.policyVersion,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn("Не удалось сохранить прогресс на сервере", error);
    }
  }, 650);
}

export function currentAccount() {
  if (serverEnabled) return safeAccount(serverAccount);
  return safeAccount(localActiveRecord());
}

export function subscribeAccount(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function initAccount() {
  if (initialized) return currentAccount();
  initialized = true;
  if (serverEnabled) {
    const auth = sb.consumeAuthHash();
    const recovered = auth?.type === "recovery";
    const session = sb.readSession();
    if (session?.access_token) {
      try {
        await hydrateServer(session);
        if (recovered) window.location.hash = "#/reset";
        else if (auth) window.location.hash = "#/account";
      } catch (error) {
        console.warn("Серверная сессия не восстановлена", error);
        sb.clearSession();
        serverAccount = null;
      }
    }
    subscribe(scheduleServerSave);
  } else {
    const active = localActiveRecord();
    if (readLocalSession() && !active) writeLocalSession("");
    if (active?.progress) replaceState(active.progress);
    subscribe(() => { if (readLocalSession()) syncLocalProgress(); });
  }
  notify();
  return currentAccount();
}

export async function registerAccount({ email, password, consent }) {
  const normalized = normalizeEmail(email);
  if (!validEmail(normalized)) return { ok: false, error: "Введите корректный email." };
  if (String(password || "").length < 8) return { ok: false, error: "Пароль должен быть не короче 8 символов." };
  if (!consent) return { ok: false, error: "Нужно согласие на обработку персональных данных." };

  if (serverEnabled) {
    try {
      const redirectTo = `${location.origin}${location.pathname}#/account`;
      const data = await sb.signUp({ email: normalized, password: String(password), redirectTo });
      if (data?.access_token) {
        const session = sb.saveAuthSession(data);
        await hydrateServer(session);
        return { ok: true, account: currentAccount() };
      }
      return {
        ok: true,
        pending: true,
        message: "Письмо с подтверждением отправлено. Проверьте почту и войдите.",
      };
    } catch (error) {
      return { ok: false, error: humanAuthError(error.message) };
    }
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalized)) {
    return { ok: false, error: "Аккаунт с таким email уже существует на этом устройстве." };
  }
  const salt = makeSalt();
  const passwordHash = await hashPassword(String(password), salt);
  const account = {
    id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: normalized, salt, passwordHash,
    createdAt: Date.now(), consentAt: Date.now(), policyVersion: POLICY_VERSION,
    progress: snapshotState(),
  };
  accounts.push(account);
  writeAccounts(accounts);
  writeLocalSession(account.id);
  notify();
  return { ok: true, account: safeAccount(account) };
}

export async function loginAccount({ email, password }) {
  const normalized = normalizeEmail(email);
  if (serverEnabled) {
    try {
      const data = await sb.signIn({ email: normalized, password: String(password) });
      const session = sb.saveAuthSession(data);
      await hydrateServer(session);
      return { ok: true, account: currentAccount() };
    } catch (error) {
      return { ok: false, error: humanAuthError(error.message) };
    }
  }
  const account = readAccounts().find((item) => item.email === normalized);
  if (!account) return { ok: false, error: "Аккаунт не найден на этом устройстве." };
  const hash = await hashPassword(String(password || ""), account.salt);
  if (hash !== account.passwordHash) return { ok: false, error: "Неверный пароль." };
  writeLocalSession(account.id);
  if (account.progress) replaceState(account.progress);
  notify();
  return { ok: true, account: safeAccount(account) };
}

export async function logoutAccount() {
  if (serverEnabled) {
    const session = sb.readSession();
    if (session?.access_token) await sb.logout(session.access_token);
    sb.clearSession();
    serverAccount = null;
  } else {
    if (readLocalSession()) syncLocalProgress();
    writeLocalSession("");
  }
  notify();
}

export async function deleteAccount() {
  if (serverEnabled) {
    const session = sb.readSession();
    if (!session?.access_token) return { ok: false, error: "Нет активной сессии." };
    try {
      await sb.deleteUser(session.access_token);
    } catch (error) {
      return { ok: false, error: humanAuthError(error.message) };
    }
    sb.clearSession();
    serverAccount = null;
  } else {
    const id = readLocalSession();
    if (id) {
      writeAccounts(readAccounts().filter((account) => account.id !== id));
      writeLocalSession("");
    }
  }
  resetProgress();
  notify();
  return { ok: true };
}

export async function requestPasswordReset(email) {
  if (!serverEnabled) return { ok: false, error: "Сброс пароля доступен только при настроенном сервере." };
  try {
    await sb.recover(normalizeEmail(email), `${location.origin}${location.pathname}#/reset`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message || "Не удалось отправить письмо." };
  }
}

export async function changePassword(password) {
  if (!serverEnabled) return { ok: false, error: "Смена пароля доступна только при настроенном сервере." };
  if (String(password || "").length < 8) return { ok: false, error: "Пароль должен быть не короче 8 символов." };
  const session = sb.readSession();
  if (!session?.access_token) return { ok: false, error: "Ссылка восстановления устарела." };
  try {
    await sb.updatePassword(session.access_token, String(password));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message || "Не удалось сменить пароль." };
  }
}

export function oauthUrl(provider = "discord") {
  return serverEnabled ? sb.oauthUrl(provider) : "";
}

export function policyVersion() { return POLICY_VERSION; }
export function isAccountConsentCurrent(account = currentAccount()) {
  return Boolean(account && account.policyVersion === POLICY_VERSION && account.consentAt);
}
export { POLICY_VERSION, serverEnabled };
