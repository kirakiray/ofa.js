# Benutzerdefinierte Ereignisse

In ofa.js können Sie neben den integrierten DOM-Ereignissen auch benutzerdefinierte Ereignisse erstellen und verwenden, um die Kommunikation zwischen Komponenten zu ermöglichen. Benutzerdefinierte Ereignisse sind ein wichtiger Mechanismus in der komponentenbasierten Entwicklung, da sie es Komponenten ermöglichen, Nachrichten oder Statusänderungen nach oben zu übertragen.

## emit-Methode - Benutzerdefinierte Ereignisse auslösen

Die Methode `emit` wird verwendet, um benutzerdefinierte Ereignisse auszulösen und Zustandsänderungen innerhalb der Komponente oder Benutzeraktionen an externe Beobachter zu melden.

### Grundlegende Verwendung

```javascript
// Ein einfaches benutzerdefiniertes Ereignis auslösen
this.emit('custom-event');

// Ein benutzerdefiniertes Ereignis mit Daten auslösen
this.emit('data-changed', {
  data: {
    // Benutzerdefinierte Daten, beliebige Struktur je nach Anforderungen
    newValue: 100,
    oldValue: 50
  }
});
```

### emit-Methode Parameter

Die `emit`-Methode akzeptiert zwei Parameter:

1. **Ereignisname**: Zeichenkette, die den Namen des auszulösenden Ereignisses angibt
2. **Optionsobjekt** (optional): Enthält Konfigurationsoptionen für das Ereignis
   - `data`: zu übermittelnde Daten
   - `bubbles`: Boolescher Wert, steuert, ob das Ereignis bubblen soll (Standardwert ist true)
   - `composed`: Boolescher Wert, steuert, ob das Ereignis Shadow-DOM-Grenzen überwinden kann
   - `cancelable`: Boolescher Wert, steuert, ob das Ereignis abgebrochen werden kann

Dann kann das übergeordnete Element dieses benutzerdefinierte Ereignis mit der `on`-Methode [(Ereignisbindung)](./event-binding.md) überwachen.

### emit Verwendungsbeispiel

<o-playground name="Emit Verwendungsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Klicken, um Ereignis auszulösen</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'Button wurde geklickt',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - Ereignisblasen-Mechanismus

Das `bubbles`-Attribut steuert, ob ein Ereignis zu übergeordneten Elementen aufsteigt (bubbling). Wenn es auf `true` gesetzt ist, breitet sich das Ereignis im DOM-Baum nach oben aus. Der Standardwert ist `true`. Wenn es auf `false` gesetzt wird, wird das Ereignis nicht aufsteigen.

### Detaillierte Erklärung des Bubble-Mechanismus

- **Standardverhalten**: Mit `emit` ausgelöste Ereignisse haben standardmäßig Blasen aktiviert (`bubbles: true`)
- **Blasenpfad**: Das Ereignis beginnt beim auslösenden Element und verbreitet sich stufenweise nach oben
- **Blasen stoppen**: Der Aufruf von `event.stopPropagation()` im Ereignis-Handler verhindert das Weiterblasen

### Blasensortierungsbeispiel

<o-playground name="Benutzerdefinierte Ereignis-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Äußerer Container (hört Bubbling-Ereignis): {{bubbledEventCount}} mal</p>
      <p>Inneres Komponente (hört direktes Ereignis): {{directEventCount}} mal</p>
      <p>Empfangene Daten: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Nicht-Bubbling-Ereignis auslösen</button>
      <button on:click="triggerBubblingEvent">Bubbling-Ereignis auslösen</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Nicht-Bubbling-Ereignis, wird nur vom direkten Listener erfasst
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Nicht-Bubbling-Ereignis ausgelöst', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Bubbling-Ereignis, wird zum Elternelement hochpropagiert
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Bubbling-Ereignis ausgelöst', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Durchdringung der Shadow DOM-Grenze

Das `composed`-Attribut steuert, ob Ereignisse die Shadow-DOM-Grenze passieren können. Dies ist besonders wichtig für die Web Components-Entwicklung, der Standardwert ist `false`.

### Durchdringungsmechanismus im Detail

- **Shadow DOM-Isolierung**: Standardmäßig können Ereignisse nicht über Shadow DOM-Grenzen hinweggehen
- **Durchdringung aktivieren**: Setzen Sie `composed: true`, um Ereignissen das Durchqueren von Shadow DOM-Grenzen zu ermöglichen
- **Anwendungsfälle**: Wenn eine Komponente Ereignisse an die Host-Umgebung senden muss, muss `composed: true` gesetzt werden

### Durchdringungsbeispiel

<o-playground name="Beispiel für benutzerdefinierte Ereignisse mit Daten" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Ereignis abgehört: {{bubbledEventCount}} mal</p>
      <p>Empfangene Daten: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Ereignis abgehört: {{bubbledEventCount}} mal</p>
      <p>Empfangene Daten: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Nicht-durchdringendes Ereignis auslösen</button>
      <button on:click="triggerComposedEvent">Durchdringendes Ereignis auslösen</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Nicht-durchdringendes Ereignis, wird nur vom direkten Listener erfasst
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Nicht-durchdringendes Ereignis ausgelöst', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Durchdringendes Ereignis, überwindet Shadow-DOM-Grenzen
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Durchdringendes Ereignis ausgelöst', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

