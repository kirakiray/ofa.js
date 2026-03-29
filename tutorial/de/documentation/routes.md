# Einzelseitenanwendung

Single-Page-Anwendungen binden die `o-app`-Komponente an die Browser-Adressleiste, um die Webseiten-URL mit dem Seitenpfad innerhalb der Anwendung synchron zu halten. Nach Aktivierung der Single-Page-Anwendung:

- Das Neuladen der Seite behält den aktuellen Routing-Zustand bei
- Wenn Sie die URL aus der Adressleiste kopieren und in einem anderen Browser oder Tab öffnen, wird der Anwendungszustand ebenfalls wiederhergestellt
- Die Vor-/Zurück-Schaltflächen des Browsers funktionieren einwandfrei

## Grundlegende Verwendung

Verwenden Sie die offizielle `o-router`-Komponente, um die `o-app`-Komponente zu umschließen, um eine Single-Page-Anwendung zu implementieren.

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Router-Test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body-Attribut

Nach dem Hinzufügen des `fix-body`-Attributs setzt `o-router` automatisch die Stile von `html` und `body` zurück und entfernt die Standard-margin und -padding.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

Dies ist besonders nützlich in den folgenden Szenarien:- `o-app` muss den Viewport vollständig ausfüllen
- Wenn die Anwendung der einzige Inhalt der Seite ist

## Beispiel

<o-playground name="Single Page Application Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // Startseiten-URL der Anwendung
    export const home = "./home.html";
    // Konfiguration für Seitenwechselanimationen
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
};
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Zu About gehen</a>
      <br>
      <br>
      <button on:click="gotoAbout">Zu About gehen (Button)</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Zurück</button> </div>
      <p> Über <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Funktionsweise

Single-Page-Anwendung basierend auf dem Browser-Hash-Modus implementieren:

1. Wenn innerhalb der Anwendung zwischen Seiten gewechselt wird, aktualisiert `o-router` automatisch den Hash-Wert in der Adressleiste (z. B. `#/about.html`)
2. Wenn der Nutzer die Seite neu lädt oder über die URL darauf zugreift, liest `o-router` den Hash-Wert und lädt die entsprechende Seite
3. Die Vorwärts-/Zurück-Buttons des Browsers lösen eine Hash-Änderung aus und steuern so die Seitennavigation innerhalb der Anwendung

## URL-Änderungsbeispiele

Angenommen, die Anwendung verfügt über zwei Seiten `home.html` und `about.html`:

| Benutzeroperation | Adressleistenänderung |
|---------|-----------|
| App öffnen | `index.html` → `index.html#/home.html` |
| Zur Infoseite navigieren | `index.html#/home.html` → `index.html#/about.html` |
| Zurück klicken | `index.html#/about.html` → `index.html#/home.html` |
| Seite aktualisieren | Der aktuelle Hash bleibt unverändert |## Nutzungsbeschränkungen

- Ein Single-Page-Application kann nur mit **einer** `o-app`-Komponente verwendet werden