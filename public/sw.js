/**
 * Service Worker do OAB em Blocos — mínimo viável para a Fase 1:
 *
 * - Cacheia o shell do app ("/", "/design", favicon, manifest) na instalação.
 * - Estratégia: rede primeiro, cache como reserva — assim o conteúdo é sempre
 *   atualizado quando há conexão, mas o app abre offline se o aluno já visitou.
 *
 * Em fases futuras: cache de blocos individuais, estratégia stale-while-revalidate
 * para questões, limpeza por idade. Nada disso agora.
 */

const CACHE = "oab-em-blocos-v1";
const SHELL = [
  "/",
  "/design",
  "/manifest.webmanifest",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Falhas individuais não derrubam o SW inteiro.
      Promise.allSettled(SHELL.map((url) => cache.add(url))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nomes = await caches.keys();
      await Promise.all(
        nomes
          .filter((n) => n !== CACHE)
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Só interceptamos GET de mesma origem — Supabase, OAuth, APIs externas
  // seguem direto pela rede.
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Rede primeiro, cache como reserva. Sempre tenta atualizar o cache.
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && res.type === "basic") {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      } catch {
        const cacheado = await caches.match(req);
        if (cacheado) return cacheado;
        // Nada no cache e sem rede: devolve a home se houver, senão falha.
        const home = await caches.match("/");
        if (home) return home;
        return new Response("Sem conexão.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })(),
  );
});
