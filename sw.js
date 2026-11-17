/* Кэш Pyodide: первый запуск качает gzip вместо 9.6 МБ wasm. */
const CACHE = "mindfulsyntax-pyodide-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.includes("/vendor/pyodide/")) return;

  const isWasm = url.pathname.endsWith("/pyodide.asm.wasm");
  const isJs = url.pathname.endsWith("/pyodide.asm.js");
  if (!isWasm && !isJs) return;
  if (!("DecompressionStream" in self)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const gzipUrl = `${url.pathname}.gz`;
    const gz = await fetch(gzipUrl);
    if (!gz.ok || !gz.body) return fetch(request);

    const body = gz.body.pipeThrough(new DecompressionStream("gzip"));
    const response = new Response(body, {
      headers: {
        "Content-Type": isWasm ? "application/wasm" : "application/javascript",
        "Cache-Control": "public, max-age=31536000",
      },
    });
    await cache.put(request, response.clone());
    return response;
  })());
});
