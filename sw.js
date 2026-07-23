/* Cache de l'enveloppe de l'app. Le contenu du voyage est mis en cache par l'app elle-meme. */
const CACHE = "italie-v1";
const FICHIERS = ["./", "./index.html", "./manifest.json",
  "./photos/couverture.webp",
  "./photos/jour-01.webp",
  "./photos/jour-02.webp",
  "./photos/jour-03.webp",
  "./photos/jour-04.webp",
  "./photos/jour-05.webp",
  "./photos/jour-06.webp",
  "./photos/jour-07.webp",
  "./photos/jour-08.webp",
  "./photos/jour-09.webp",
  "./photos/jour-10.webp",
  "./photos/jour-11.webp",
  "./photos/jour-12.webp",
  "./photos/jour-13.webp"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k =>
    Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.hostname.includes("docs.google.com")) return;          // toujours frais, gere par l'app
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && u.origin === location.origin) {
        const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie));
      }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
