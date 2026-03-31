# Anwendungskonfiguration

Die `app-config.js`-Konfigurationsdatei unterstützt neben der Startseitenadresse und der Seitenübergangsanimation auch weitere Konfigurationsoptionen zur Steuerung des Ladezustands der Anwendung, der Fehlerbehandlung, der Initialisierungslogik und der Navigationsfunktionen.

```javascript
// app-config.js
// Wird angezeigt während des Ladens
export const loading = () => "<div>Loading...</div>";

// Komponente, die angezeigt wird, wenn das Laden der Seite fehlschlägt
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Callback nach erfolgreicher Initialisierung der Anwendung
export const ready() {
  console.log("App is ready!");
}

// Methoden und Eigenschaften, die zum Anwendungsprototyp hinzugefügt werden
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="Anwendungskonfigurationsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseiten-Adresse der Anwendung
    export const home = "./home.html";
    // Konfiguration für Seitenwechsel-Animation
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
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
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
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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

## loading - Ladezustand

Eine Komponente, die während des Seitenladevorgangs angezeigt wird; kann eine String-Vorlage oder eine Funktion sein, die eine Vorlage zurückgibt.

```javascript
// Einfache String-Vorlage
export const loading = "<div class='loading'>Loading...</div>";

// Dynamische Generierung mit Funktion
export const loading = () => {
  return `<div class='loading'>
    <span>Lädt...</span>
  </div>`;
};
```

Hier ist eine ansprechende und sofort in Ihr Projekt einsetzbare Loading-Implementierung:

```javascript
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
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - Fehlerbehandlung

Die Komponente, die bei einem fehlgeschlagenen Seitenladevorgang angezeigt wird. Die Funktion erhält ein Objekt-Argument mit `src` (Adresse der fehlgeschlagenen Seite) und `error` (Fehlermeldung).

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Seitenladefehler</p>
    <p>Adresse: ${src}</p>
    <button on:click="back()">Zurück</button>
  </div>`;
};
```

## proto - Prototyperweiterung

Fügen Sie der Anwendungsinstanz benutzerdefinierte Methoden und berechnete Eigenschaften hinzu, die in Seitenkomponenten über `this.app` zugänglich sind.

```javascript
export const proto = {
  // Benutzerdefinierte Methoden
  navigateToHome() {
    this.goto("home.html");
  },
  // Berechnete Eigenschaften
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

Auf der Seite aufrufen:

```html
<template page>
  <button on:click="app.navigateToHome()">Zurück zur Startseite</button>
  <p>Auf der Startseite: {{app.isAtHome}}</p>
</template>
```

## ready - Initialisierungs-Callback

Eine Callback-Funktion, die nach dem Laden der Anwendungskonfiguration ausgeführt wird. Hier können Initialisierungsvorgänge durchgeführt werden. Auf die Methoden und Eigenschaften der Anwendungsinstanz kann über `this` zugegriffen werden.

```javascript
export const ready() {
  console.log("Anwendung wurde initialisiert");
  // Zugriff auf this (o-app Elementinstanz) ist möglich
  console.log(this.current); // Aktuelle o-page Elementinstanz abrufen
  // this.someMethod();
}
```

## allowForward - Vorwärtsfunktion

Steuert, ob die Vorwärts-Funktion des Browsers aktiviert ist. Wenn auf `true` gesetzt, können die Zurück- und Vorwärts-Schaltflächen des Browsers zur Navigation verwendet werden.

```javascript
export const allowForward = true;
```

Wenn aktiviert, können Benutzer über die Vorwärts-/Rückwärts-Buttons des Browsers navigieren, und die Navigationsmethode `forward()` der Anwendung wird ebenfalls wirksam.

## Programmatische Navigation

Neben der Verwendung von `olink`-Links können Sie auch Navigationsmethoden in JavaScript aufrufen:

```javascript
// Zu einer bestimmten Seite springen (zum Verlauf hinzufügen)
this.goto("./about.html");

// Aktuelle Seite ersetzen (nicht zum Verlauf hinzufügen)
this.replace("./about.html");

// Zur vorherigen Seite zurückgehen
this.back();

// Zur nächsten Seite vorwärts gehen (erfordert allowForward: true)
this.forward();
```

## Routing-Verlauf

Über die Eigenschaft `routers` kann man den Browserverlauf abrufen:

```javascript
// Alle Routenverläufe abrufen
const history = app.routers;
// Rückgabeformat: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Aktuelle Seite abrufen
const currentPage = app.current;
```

## Überwachung von Routenänderungen

Sie können auf Routenänderungen reagieren, indem Sie auf das `router-change`-Ereignis hören:

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Routing-Änderung:", data.name); // goto, replace, forward, back
  console.log("Seitenadresse:", data.src);
});
```