# Was gehört zu GitHub — und was nicht

Stand: **18.08.2026** · geprüft gegen `raw.githubusercontent.com` und die Live-Seite

---

## 🔴 DRINGEND: Die Website ist NICHT auf dem neuesten Stand

Am 18.08. wurde gemessen, was tatsächlich online liegt. Ergebnis:

| Datei | Online | Lokal | Zustand |
|---|---|---|---|
| `index.html` | altes Gelb `#FFD400`, kein `start-hoch`, kein `fern` | Glut `#FF7A18`, Hochkant-Bild, 3-stufiger Countdown | 🔴 **veraltet** |
| `overlay.html` | ~450 Zeilen, **kein `startFest`, kein `vvy-start`** | 681 Zeilen mit Startauslöser | 🔴 **veraltet** |
| `start-hoch.jpg` / `.webp` | **404 — gar nicht vorhanden** | vorhanden | 🔴 **fehlt** |
| `404.html` | Glut `#FF7A18` | gleich | ✅ aktuell |
| `sw.js` | `vvy-v1`, HTML network-first | gleich | ✅ aktuell |

**Was das praktisch heißt:**

- Die Design-Arbeit vom 17./18.08. sieht niemand — die Seite läuft noch mit
  der alten Farbwelt und dem alten fünfstufigen Countdown.
- 🔴 **Renntagskritisch:** Das Overlay, das Cloud-OBS von
  `you-vs-you.online/overlay.html` lädt, ist die **alte Fassung ohne
  Startauslöser.** Der Anker `jetzt − elapsed` existiert dort nicht.
  Ein Testlauf gegen diese Adresse prüft die falsche Datei.

---

## Jetzt hochladen — genau diese vier Dateien

```
index.html
overlay.html
start-hoch.jpg
start-hoch.webp
```

`github.com/Saza1725/you-vs-you-` → **Add file ▸ Upload files** → alle vier
reinziehen → überschreiben lassen → **Commit changes**.

Danach **~20 Minuten** warten (GitHub Pages braucht bei neuen Bildern
erfahrungsgemäß so lange), dann prüfen:

| Prüfung | Erwartung |
|---|---|
| `https://www.you-vs-you.online/start-hoch.webp` | lädt ein Bild, kein 404 |
| Startseite am Handy hochkant | quadratischer Bildausschnitt, orange Akzente |
| Countdown auf der Startseite | „24 Tage · 19 Std 17 Min", **keine Sekunden** |
| `https://www.you-vs-you.online/overlay.html?demo=1` | Zahlen laufen von selbst |

Wenn die Seite alt aussieht, obwohl der Upload durch ist: einmal hart neu
laden (⌘⇧R). Der Service Worker holt HTML immer frisch, Bilder aber erst
aus dem Zwischenspeicher.

---

## Die vollständige Liste (26 Dateien)

Falls du mal alles neu hochlädst:

```
404.html                 icon-maskable-512.png    sitemap.xml
CNAME                    index.html               start.jpg
apple-touch-icon.png     manifest.webmanifest     start.webp
favicon.ico              musik.mp3                start-hoch.jpg
favicon.svg              og.jpg                   start-hoch.webp
icon-192.png             overlay.html             sw.js
icon-512.png             robots.txt

fonts/oswald-latin.woff2            fonts/rajdhani-600-latin.woff2
fonts/oswald-latin-ext.woff2        fonts/rajdhani-600-latin-ext.woff2
fonts/rajdhani-700-latin.woff2      fonts/rajdhani-700-latin-ext.woff2
```

---

## 🚫 Niemals hochladen

| | Warum |
|---|---|
| 📁 `Claude Projekt/` | Kennwörter, Renndaten, Anleitungen — inklusive `worker.js` |
| 📁 `Videos/` | **305 MB.** Bläht das Repo auf, gehört nicht ins Netz |
| 📁 `sessions/` | Arbeitsnotizen |
| `CLAUDE.md`, `CLAUDE-vorlage.md` | Arbeitsanweisungen, keine Website-Dateien |
| `.DS_Store` | unsichtbare macOS-Datei, nutzlos im Netz |

> ⚠️ Am 18.08. lag eine fremde Datei `index.js` (Trello-MCP-Server) in der
> Wurzel — sie wäre beim nächsten Ordner-Upload mit veröffentlicht worden.
> Sie liegt jetzt unter `Claude Projekt/Alt/trello-mcp-index.js`.
> **Vor jedem Upload einmal prüfen, ob in der Wurzel nur die 26 Dateien
> aus der Liste oben stehen.**

> `worker.js` läuft bei **Cloudflare**, nicht bei GitHub. Wenn sich der
> Worker ändert, wird der Inhalt der Datei im Cloudflare-Editor eingefügt
> und mit **Deploy** ausgerollt — nicht hochgeladen.
