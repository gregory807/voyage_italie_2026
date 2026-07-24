/* Cache de l'enveloppe de l'app. Le contenu du voyage est mis en cache par l'app elle-meme. */
const CACHE = "italie-v1";
const FICHIERS = ["./", "./index.html", "./manifest.json",
  "./couverture.webp",
  "./extra-amalfi.webp",
  "./extra-bolsena.webp",
  "./extra-carte-milan.webp",
  "./extra-monterosso.webp",
  "./extra-navigli.webp",
  "./extra-regina-giovanna.webp",
  "./extra-toscane-village.webp",
  "./extra-varenna-plage.webp",
  "./jour-01.webp",
  "./jour-02.webp",
  "./jour-03.webp",
  "./jour-04.webp",
  "./jour-05.webp",
  "./jour-06.webp",
  "./jour-07.webp",
  "./jour-08.webp",
  "./jour-09.webp",
  "./jour-10.webp",
  "./jour-11.webp",
  "./jour-12.webp",
  "./jour-13.webp",
  "./opt-bellagio.webp",
  "./opt-capri.webp",
  "./opt-sangimignano.webp",
  "./opt-sienne.webp",
  "./opt-sorrento.webp",
  "./opt-valdorcia.webp"];
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
