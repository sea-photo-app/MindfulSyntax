/**
 * Регистрирует service worker, который отдаёт сжатые Pyodide wasm/js.
 * Если SW или DecompressionStream недоступны, Pyodide загрузится обычным путём.
 */
let registrationPromise = null;

export function setupPythonCache() {
  if (registrationPromise) return registrationPromise;
  if (!("serviceWorker" in navigator)) {
    registrationPromise = Promise.resolve(false);
    return registrationPromise;
  }
  registrationPromise = navigator.serviceWorker
    .register(new URL("../sw.js", import.meta.url))
    .then(() => navigator.serviceWorker.ready)
    .then(() => true)
    .catch((error) => {
      console.warn("Кэш Pyodide недоступен", error);
      return false;
    });
  return registrationPromise;
}
