# SSR und Isomorphic Rendering

> Wenn Sie nicht wissen, was SSR ist, bedeutet das, dass Sie es derzeit nicht benötigen. Sie können dieses Kapitel überspringen und später darauf zurückkommen, wenn Sie es brauchen.

## Isomorphes Rendering

Um sowohl das flüssige CSR-Erlebnis beizubehalten, eine bessere Erkennung durch Maschinen-Crawler (SEO) zu ermöglichen als auch eine freiere Wahl der Backend-Entwicklungssprache zu bieten, bietet ofa.js einen einzigartigen isomorphen Rendering-Modus (Symphony Client-Server Rendering).

> Wenn Sie die genauen Definitionen und Unterschiede von CSR / SSR / SSG verstehen möchten, lesen Sie bitte direkt den letzten Abschnitt dieses Artikels.

Die Kernidee des isomorphen Renderings ist:- Rendern Sie die ursprüngliche Seite auf dem Server, um SEO und Ladegeschwindigkeit beim ersten Bildschirm zu gewährleisten
- Übernehmen Sie die Routing-Verarbeitung auf der Client-Seite, um ein flüssiges CSR-Benutzererlebnis zu bewahren
- Geeignet für jede Serverumgebung, echtes isomorphes Rendering verwirklichen

### Prinzip der isomorphen Rendering-Implementierung

Das isomorphe Render-Modell von ofa.js basiert auf folgenden Mechanismen:

1. Der Server generiert eine vollständige HTML-Seite mit einer universellen Laufzeitstruktur
2. Der Client lädt die CSR-Laufzeit-Engine
3. Automatische Erkennung der aktuellen Laufzeitumgebung zur Bestimmung der Rendering-Strategie

### Isomorphe Rendering-Code-Struktur

**Ursprüngliches CSR-Seitenmodul:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>Ich bin Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Vollständige Seite nach der Kapselung für isomorphes Rendering:**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Seitenmodul-Inhalt Einfügeposition ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

Sie können also eine beliebige Entwicklungssprache (Go, Java, PHP, Nodejs, Python usw.) und eine beliebige serverseitige Template-Rendering-Engine (z. B. Gos `html/template`, PHPs Smarty/Twig/Blade usw.) verwenden, indem Sie die isomorphe Render-Code-Struktur von ofa.js in das Template einbetten, um SSR zu erreichen.

* [Nodejs SSR Beispiel](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR Beispiel](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR Beispiel](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Isomorphes Rendering-Vorlagenstruktur

Um das isomorphe Rendering-Modell zu implementieren, verwenden Sie auf der Serverseite einfach die folgende allgemeine Template-Struktur:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seitentitel</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Dynamisch den Inhalt des entsprechenden Seitenmoduls einfügen -->
  </o-app>
</body>

</html>
```

**Hinweis:** Der vom Server zurückgegebene HTML-Code muss den korrekten HTTP-Header gesetzt haben: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` ist die von ofa.js bereitgestellte isomorphe Rendering-Laufzeit-Engine. Sie erkennt automatisch die Rendering-Strategie basierend auf dem aktuellen Seitenstatus und stellt sicher, dass in jeder Umgebung die bestmögliche Benutzererfahrung geboten wird.

Auch SSG kann diese Struktur verwenden, um statische Website-Generierung zu implementieren.

## Unterschiede zwischen ofa.js, SSR und anderen Frontend-Frameworks

Das Symphony Client-Server Rendering (im Folgenden SCSR) von ofa.js ist im Wesentlichen ebenfalls ein SSR-Modus.

Im Vergleich zu SSR-Lösungen bestehender Frontend-Frameworks wie Vue, React und Angular liegt der größte Vorteil von ofa.js darin, **dass keine zwingende Bindung an Node.js erforderlich ist**. Das bedeutet, dass jede serverseitige Template-Rendering-Engine (wie z.B. Smarty für PHP, Jinja2 für Python, Thymeleaf für Java usw.) ofa.js problemlos integrieren kann, um SSR zu realisieren.

## Überblick über Webseiten-Rendering-Methoden

Moderne Webanwendungen verfügen über vier Haupt-Renderverfahren: traditionelles serverseitiges Template-Engine-Rendering, CSR (Client-Side-Rendering, clientseitiges Rendern), SSR (Server-Side-Rendering, serverseitiges Rendern) und SSG (Static Site Generation, statische Website-Generierung). Jede Methode hat ihre eigenen Vorteile und Einsatzszenarien.

### Traditionelle serverseitige Template-Engine-Rendering

Unter den zahlreichen Web-Produkten ist die serverseitige Template-Engine nach wie vor das vorherrschende Mittel zur Seiten-Rendering. Back-End-Sprachen wie Go oder PHP nutzen eingebaute oder Drittanbieter-Template-Engines (z. B. Gos `html/template`, PHPs Smarty/Twig/Blade usw.), um dynamische Daten in HTML-Templates einzuspeisen, in einem Schritt eine vollständige HTML-Seite zu erzeugen und an den Client zurückzugeben.

**Vorteile:**- SEO-freundlich, schnelles Laden des ersten Bildschirms
- Serverseitige Steuerung, hohe Sicherheit
- Geringere Anforderungen an den Tech-Stack des Teams, Backend-Entwickler können die Entwicklung unabhängig abschließen

**Nachteile:**- Schlechte Benutzererfahrung, jede Interaktion erfordert eine Seitenaktualisierung
- Hohe Belastung des Servers
- Hohe Kopplung zwischen Frontend und Backend, ungünstig für Arbeitsteilung und Zusammenarbeit

### CSR (Client-seitiges Rendering)

Im CSR-Modus wird der Seiteninhalt vollständig durch clientseitiges JavaScript gerendert. Die [Single-Page-Anwendung](./routes.md) von ofa.js ist eine typische CSR-Implementierung. Diese Methode bietet ein flüssiges Nutzererlebnis, bei dem alle Interaktionen ohne Seitenwechsel abgeschlossen werden können. Single-Page-Anwendungen (SPAs), die mit React oder Vue in Kombination mit den entsprechenden Routing-Bibliotheken (wie React Router oder Vue Router) entwickelt wurden, sind ebenfalls typische CSR-Implementierungen.

**Vorteile:**- Die Benutzererfahrung ist flüssig, Seitenwechsel erfolgen ohne Neuladen
- Starke Client-seitige Verarbeitungsleistung, schnelle Reaktionszeiten

**Nachteile:**- Nachteilig für SEO, Suchmaschinen haben Schwierigkeiten, den Inhalt zu indexieren

### SSR (Server-Side Rendering)

Während die flüssige CSR-Erfahrung beibehalten wird, wird die Seite nun in Echtzeit vom Server gerendert: Wenn ein Benutzer eine Anfrage stellt, generiert der Server sofort vollständiges HTML und liefert es zurück, um echtes serverseitiges Rendering zu erreichen.

**Vorteile:**- SEO-freundlich, schnelles Laden der ersten Ansicht
- Unterstützung für dynamische Inhalte

**Nachteile:**- Hohe Serverbelastung
- Erfordert in der Regel eine Node.js-Umgebung als Laufzeitumgebung oder zumindest eine Node.js-Zwischenschicht
- Eine vollständige Interaktion erfordert immer noch eine nachfolgende Client-Aktivierung

### SSG (Statische Seitengenerierung)

Alle Seiten werden in der Build-Phase als statische HTML-Dateien vorgerendert und können nach dem Deployment direkt vom Server an die Benutzer zurückgegeben werden.

**Vorteile:**-  Schnelle Ladezeit beim ersten Aufruf, SEO-freundlich
-  Geringe Serverlast, stabile Leistung
-  Hohe Sicherheit

**Nachteile:**- Schwierigkeiten bei der Aktualisierung dynamischer Inhalte
- Die Bauzeit nimmt mit der Anzahl der Seiten zu