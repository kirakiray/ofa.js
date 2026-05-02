# Mikro-App

Verwenden Sie `o-app` für die Applikation, dieses Tag repräsentiert eine Mikro-App, die die Konfigurationsdatei `app-config.js` lädt, welche die Startseitenadresse und die Seitenwechsel-Animationseinstellungen der App definiert.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// Startseite-URL der App
export const home = "./home.html";

// Konfiguration der Seitenwechsel-Animation
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

<o-playground name="Micro-App-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseiten-Adresse der App
    export const home = "./home.html";
    // Konfiguration der Seitenübergangs-Animation
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
      <a href="./about.html?id=10010" olink>Zu About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Zu About (10030)</a>
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
      <div style="padding: 8px;"> <button on:click="back()">Zurück</button> </div>
      <p>{{val}}</p>
      <p> Über <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (von ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - Startseitenadresse

Geben Sie den Pfad des Startmoduls an, das beim Start der Anwendung geladen wird. Es werden relative und absolute Pfade unterstützt.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Seitenwechsel-Animation

Steuert die Übergangsanimationseffekte beim Seitenwechsel, die drei Zustände umfassen:

| Zustand | Beschreibung |
|---------|--------------|
| `current` | Stil nach Abschluss der Animation der aktuellen Seite |
| `next` | Ausgangsstil beim Eintritt der neuen Seite |
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

In der `o-app` unterstützt die Seiten Navigation die Übergabe von Parametern über URL-Query. Die Zielseite empfängt diese über den Parameter `query` der Modulfunktion.

## Seitennavigation

In der o-app kann jedes Seitenmodul ein `<a>`-Tag mit dem `olink`-Attribut verwenden, um zwischen Seiten zu wechseln. Dieses Tag löst das Routing der App aus, zeigt eine Übergangsanimation und lädt die gesamte Seite nicht neu.

```html
<a href="./about.html" olink>Zur Über-Seite springen</a>
```

In der Seitenkomponente kann die Methode `back()` verwendet werden, um zur vorherigen Seite zurückzukehren:

```html
<template page>
  <button on:click="back()">Zurück</button>
</template>
```