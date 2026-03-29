# Mikro-App

Verwenden Sie `o-app`, um eine Anwendung zu erstellen; dieses Tag steht für eine Mikro-App. Es lädt die Konfigurationsdatei `app-config.js`, in der die Startseiten-Adresse und die Konfiguration für Seitenübergangsanimationen definiert sind.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// Anwendungsstartseitenadresse
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
```

<o-playground name="Mini-App-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    // 页面切换动画配置
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - Startseitenadresse

Gibt den Pfad des Startmoduls an, das beim Start der Anwendung geladen wird, unterstützt relative und absolute Pfade.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Seitenübergangsanimation

Steuern Sie die Übergangsanimation beim Wechseln der Seiten, umfasst drei Zustände:

| Status | Beschreibung |
|------|------|
| `current` | Stil nach Abschluss der Animation der aktuellen Seite |
| `next` | Startstil beim Eintritt der neuen Seite |
| `previous` | Zielstil beim Verlassen der alten Seite |```javascript
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
```

## Parameterübergabe

In `o-app` unterstützt das Seitenwechseln die Übergabe von Parametern über URL Query, und die Zielseite empfängt diese über den `query`-Parameter der Modulfunktion.

## Seitennavigation

In o-app kann jede Seitenkomponente mit einem `<a>`-Tag mit dem Attribut `olink` für Seitenwechsel verwendet werden. Dieses Tag löst einen Routing-Wechsel in der Anwendung aus, führt Übergangsanimationen aus und aktualisiert nicht die gesamte Seite.

```html
<a href="./about.html" olink>Zur Über-Seite springen</a>
```

In der Seitenkomponente kann die Methode `back()` verwendet werden, um zur vorherigen Seite zurückzukehren:

```html
<template page>
  <button on:click="back()">Zurück</button>
</template>
```