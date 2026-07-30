self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", () => {
  // No hacemos nada especial, solo necesitamos este listener
  // para que el navegador considere la web instalable.
});