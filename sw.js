/* ================================================================
   YOU VS YOU — Service Worker

   Zweck: Die Seite laedt auch bei wackliger Verbindung und laesst
   sich aufs Startdisplay legen.

   Wichtig fuer den Alltag:
   · Die HTML-Seite wird IMMER zuerst aus dem Netz geholt.
     Aenderungen auf GitHub sind also sofort sichtbar --
     der Cache springt nur ein, wenn gar keine Verbindung besteht.
   · Bilder und Schriften kommen aus dem Cache (die aendern sich nie).
   · Musik, Overlay und alles von fremden Servern (Twitch, Zaehler)
     werden bewusst NICHT angefasst.

   Nach jeder Aenderung an den Dateien die Zahl in CACHE erhoehen.
   Das ist keine Kosmetik: Bilder kommen zuerst aus dem Cache. Wer
   die Seite schon einmal offen hatte, bekommt sonst ewig die alten
   Bilder, egal was auf GitHub liegt. Zahl erhoeht -> alter Cache
   wird beim naechsten Besuch geloescht, alles wird neu geholt.

   v7, 04.09.2026 -- die vier Do-It-Fast-Karten sind unter DEMSELBEN
   Namen ersetzt worden (erst mit alten Titeln, dann in der Ich-Form).
   Ein ueberschriebener Name kommt aus dem alten Vorrat: auf dem
   Bildschirm stand weiter "ZEHN KILO AUF ZEHN KILOMETERN", obwohl auf
   GitHub laengst "MEIN ZIEL WAR DIE STUNDE" lag. Zahl erhoeht, damit
   der alte Vorrat fliegt. Neu im Vorrat: die beiden Karten und
   teaser-2.jpg; teaser.jpg ist raus, den Namen gibt es nicht mehr.

   v4, 25.08.2026 -- neuer Teaser: teaser.mp4 ist jetzt hochkant
   (1080x1832, 44 s, eigene Musik), teaser.jpg neu. Ohne erhoehte
   Zahl saehe jeder, der die Seite schon offen hatte, weiter das
   alte Vorschaubild.

   v3, 24.08.2026 -- Markenzeichen auf der Socke aus start.jpg,
   start.webp, start-hoch.jpg, start-hoch.webp und og.jpg entfernt.
   Zahl erhoeht, damit die alten Bilder aus dem Browserspeicher fliegen.

   v2, 21.08.2026 -- gesaeuberte Startbilder, Hochformat und die
   beiden Figuren aufgenommen.
   v6, 26.08.2026 -- Menuepunkt Training, zweite Anordnung: wer,
   dann Ordner, dann Kacheln. Die beiden Bildkarten kommen mit in
   den Vorrat, die Filme NICHT -- zusammen 20 MB, die soll niemand
   ungefragt laden. Sie haengen an preload="none".
   ================================================================ */

const CACHE = 'vvy-v7';

const ASSETS = [
  './',
  './index.html',
  './404.html',
  './start.webp',
  './start.jpg',
  './start-hoch.webp',
  './start-hoch.jpg',
  './og.jpg',
  './teaser-2.jpg',
  './training-sascha-see.jpg',
  './training-phillip-33.jpg',
  './doitfast-sascha.jpg',
  './doitfast-phillip.jpg',
  /* Die beiden Begleiter. Nur die kleinen WebP -- die PNG sind der
     Rueckfall fuer alte Browser und werden bei Bedarf nachgeladen. */
  './figur-links.webp',
  './figur-rechts.webp',
  './favicon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.webmanifest',
  './fonts/oswald-latin.woff2',
  './fonts/oswald-latin-ext.woff2',
  './fonts/rajdhani-600-latin.woff2',
  './fonts/rajdhani-600-latin-ext.woff2',
  './fonts/rajdhani-700-latin.woff2',
  './fonts/rajdhani-700-latin-ext.woff2'
];

/* ---------- Einbau ---------- */
self.addEventListener('install', ev => {
  ev.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* Einzeln ablegen: eine fehlende Datei darf nicht alles kippen */
    await Promise.all(ASSETS.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

/* ---------- Aufraeumen ---------- */
self.addEventListener('activate', ev => {
  ev.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* ---------- Anfragen ---------- */
self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Fremde Server unberuehrt lassen: Twitch, YouTube, Besuchszaehler, Formspree */
  if (url.origin !== self.location.origin) return;

  /* Musik (Bereichsanfragen) und das Overlay nie zwischenspeichern */
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('overlay.html')) return;

  /* Seitenaufrufe: erst Netz, dann Cache */
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')){
    ev.respondWith((async () => {
      try{
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
        return fresh;
      }catch(_){
        return (await caches.match(req))
            || (await caches.match('./index.html'))
            || new Response('Offline', { status:503, headers:{ 'Content-Type':'text/plain;charset=utf-8' } });
      }
    })());
    return;
  }

  /* Bilder, Schriften, Manifest: erst Cache, dann Netz */
  ev.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try{
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200 && fresh.type === 'basic'){
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
      }
      return fresh;
    }catch(_){
      return new Response('', { status:504 });
    }
  })());
});
