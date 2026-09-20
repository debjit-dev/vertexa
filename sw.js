/* =========================================================
   VERTEXA — root-scoped service worker
   Purpose: guarantee that ANY unknown route on ANY static
   host or local dev server (Live Server, GitHub Pages,
   Netlify, IIS, etc.) renders pagenotfound.html, instead of
   whatever bare "not found" response that host returns.
   Only touches page navigations — never asset requests.
   ========================================================= */

const NOT_FOUND_PAGE = "/pagenotfound.html";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && response.status === 404) {
        return fetch(NOT_FOUND_PAGE);
      }
      return response;
    }).catch(() => fetch(NOT_FOUND_PAGE))
  );
});
