# Ereignisbindung

In ofa.js ist die Ereignisbindung ein wichtiger Mechanismus zur Implementierung von Benutzerinteraktionen. Sie können Ereignishandler auf verschiedene Weise an Elemente binden, um auf Benutzeraktionen zu reagieren.

## Ereignisse aus proto binden

Dies ist die empfohlene Methode zur Ereignisbindung, geeignet für komplexe Ereignisverarbeitungslogik. Ereignishandlerfunktionen im `proto`-Objekt zu definieren, kann die Codelogik besser organisieren und erleichtert die Wartung und Wiederverwendung.

<o-playground name="Von proto Ereignisse binden" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Funktion direkt ausführen

Für einfache Operationen (wie Zählererhöhung, Statuswechsel usw.) können kurze Ausdrücke direkt in den Ereigniseigenschaften geschrieben werden. Diese Methode ist prägnant und klar, geeignet für die Verarbeitung einfacher Logik.

<o-playground name="Funktion direkt ausführen" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Unterstützte Ereignistypen

ofa.js unterstützt alle Standard-DOM-Events, einschließlich, aber nicht beschränkt auf:

-  Mausereignisse: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout` usw.
-  Tastaturereignisse: `keydown`, `keyup`, `keypress` usw.
-  Formularereignisse: `submit`, `change`, `input`, `focus`, `blur` usw.
-  Touch-Ereignisse: `touchstart`, `touchmove`, `touchend` usw.

ofa.js unterstützt dieselben Ereignistypen wie native DOM-Ereignisse; weitere Details finden Sie in der [MDN-Ereignisdokumentation](https://developer.mozilla.org/de/docs/Web/API/Event).

## Parameter an Ereignishandler übergeben

Sie können auch Parameter an Event-Handler übergeben:

<o-playground name="Parameter an Event-Handler übergeben" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Addiere 5 - Aktuell: {{count}}</button>
      <button on:click="addNumber(10)">Addiere 10 - Aktuell: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Auf das Ereignisobjekt zugreifen

Im Event-Handler kannst du über den `event`-Parameter auf das native Event-Objekt zugreifen:

<o-playground name="Ereignisobjekt zugreifen" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Klicken Sie irgendwo, um die Koordinaten anzuzeigen</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Sie können in Ausdrücken auch den `$event`-Parameter verwenden, um auf das native Ereignisobjekt zuzugreifen, z. B. die Koordinaten des Mausklicks abrufen:

```html
<div class="container" on:click="handleClick($event)">Klicken Sie irgendwo, um die Koordinaten anzuzeigen</div>
```

## Auf benutzerdefinierte Ereignisse lauschen

Neben dem Abhören nativer DOM-Ereignisse können Sie auch ganz einfach benutzerdefinierte Ereignisse abhören, die von Komponenten ausgelöst werden:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

Für eine detaillierte Erläuterung der benutzerdefinierten Ereignisse lesen Sie bitte im Kapitel [Benutzerdefinierte Ereignisse](custom-events.md). Es wird empfohlen, dem Tutorial sequenziell in der vorgesehenen Reihenfolge zu folgen, da sich die folgenden Inhalte auf natürliche Weise erschließen werden; selbstverständlich können Sie auch jederzeit nachschlagen, um sich das Wissen vorab anzueignen.