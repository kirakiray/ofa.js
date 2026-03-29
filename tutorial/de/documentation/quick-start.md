# Schnellstart

In diesem Abschnitt wird erklärt, wie Sie schnell mit ofa.js beginnen können. In den folgenden Tutorials werden wir die Erstellung der index.html-Einstiegsdatei überspringen und nur den Code der Seitenmoduldateien zeigen. Sie können direkt auf der Grundlage der Vorlage entwickeln.

## Vorbereitung der Basisdateien

Um ofa.js schnell einzusetzen, erstellst du einfach ein **Seitenmodul** und kombinierst es mit einer Einstiegs-HTML-Datei. Die erforderlichen Kern-Dateien sind:

- `index.html`: Die Einstiegsdatei der Anwendung, die für das Laden des ofa.js-Frameworks und das Einbinden von Seitenmodulen verantwortlich ist
- `demo-page.html`: Die Seitenmoduldatei, die den spezifischen Inhalt, das Styling und die Datenlogik der Seite definiert

### index.html (Anwendungseinstieg)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Beispiel</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

Die Hauptfunktion dieser Datei ist:- Einführung des ofa.js-Frameworks
- Verwendung der `<o-page>`-Komponente zum Laden und Rendern von Seitenmodulen

### demo-page.html (Seitenmodul)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hallo ofa.js Demo-Code",
        },
      };
    };
  </script>
</template>
```

Diese Datei definiert eine einfache Seitenkomponente, die Folgendes enthält:- `<template page>`-Tag, definiert Seitenmodul
- CSS-Stile (Verwendung des `:host`-Selektors von Shadow DOM)
- Datenbindungsausdruck `{{val}}`
- JavaScript-Logik, gibt ein Objekt mit Anfangsdaten zurück


## Online-Demo

Hier ist ein Live-Beispiel im Online-Editor, Sie können den Code direkt bearbeiten und die Auswirkungen sehen:

<o-playground name="Online-Demo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hallo ofa.js Demo-Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Wir definieren Stile durch das `<style>`-Tag innerhalb der Komponente. Diese internen Stile wirken nur innerhalb der Komponente, bieten eine gute Kapselung und beeinflussen keine anderen Elemente auf der Seite.

Hier wird der `:host`-Selektor verwendet, um die Stile des Host-Elements der Komponente zu definieren. Hier setzen wir die Komponente als Block-Level-Element und fügen einen roten Rahmen sowie einen Innenabstand von 10px hinzu.

Mit dem `{{key}}`-Ausdruck kann der entsprechende Wert aus den Komponentendaten auf der Seite gerendert werden.

Jetzt haben Sie erfolgreich Ihre erste ofa.js-Anwendung erstellt! Als nächstes lassen Sie uns tiefer in die Template-Rendering-Syntax und die fortgeschrittenen Funktionen von ofa.js eintauchen.