# Lebenszyklus

ofa.js Komponenten verfügen über vollständige Lifecycle-Hook-Funktionen, die es Ihnen ermöglichen, spezifische Logik in verschiedenen Phasen der Komponente auszuführen. Diese Hook-Funktionen ermöglichen es Ihnen, in kritischen Momenten wie der Erstellung, dem Mounting, der Aktualisierung und der Zerstörung der Komponente einzugreifen und entsprechende Operationen auszuführen.

## Lebenszyklus-Hook-Funktionen

ofa.js bietet die folgenden hauptsächlichen Lebenszyklus-Hook-Funktionen an, geordnet nach der gebräuchlichen Reihenfolge:

### attached



Der `attached`-Hook wird aufgerufen, wenn die Komponente in das Dokument eingefügt wurde und signalisiert, dass die Komponente bereits an die Seite angehängt ist. Es handelt sich um den am häufigsten verwendeten Lifecycle-Hook; er dient in der Regel dazu, Initialisierungen auszuführen, die erst nach dem tatsächlichen Anzeigen der Komponente erfolgen dürfen, und vermeidet unnötige Berechnungen, solange die Komponente noch nicht sichtbar ist. Dieser Hook eignet sich auch hervorragend für Operationen wie die Messung von Elementabmessungen oder das Starten von Animationen, die davon abhängen, dass die Komponente bereits gerendert wurde.

- **Aufrufzeitpunkt**: Wenn die Komponente zum DOM-Baum hinzugefügt wird
- **Hauptzweck**: Timer starten, Event-Listener hinzufügen, Operationen ausführen, die Sichtbarkeit erfordern

### detached



Der `detached`-Hook wird aufgerufen, wenn die Komponente aus dem Dokument entfernt wird und signalisiert, dass die Komponente kurz vor dem Entladen steht. Dieser Hook eignet sich zum Aufräumen von Ressourcen, wie das Löschen von Timern oder das Entfernen von Event-Listenern.

- **Aufrufzeitpunkt**: Komponente wird aus dem DOM-Baum entfernt
- **Hauptzweck**: Ressourcen bereinigen, Abonnements kündigen, Event-Listener entfernen

### ready



`ready` Hook wird aufgerufen, wenn die Komponente bereit ist. Zu diesem Zeitpunkt wurde die Vorlage der Komponente bereits gerendert, DOM-Elemente wurden erstellt, aber möglicherweise noch nicht in das Dokument eingefügt. Dieser Hook eignet sich für DOM-Manipulationen oder das Initialisieren von Bibliotheken von Drittanbietern.

- **Aufrufzeitpunkt**: Nachdem die Komponentenvorlage gerendert wurde und das DOM erstellt ist
- **Hauptverwendungszweck**: Durchführung von DOM-abhängigen Initialisierungsoperationen

### loaded



Der `loaded`-Hook wird ausgelöst, nachdem die Komponente und alle ihre Unterkomponenten sowie asynchrone Ressourcen vollständig geladen sind. Zu diesem Zeitpunkt kann der Ladezustand sicher entfernt oder nachfolgende Operationen ausgeführt werden, die von der vollständigen Komponentenstruktur abhängen. Wenn keine Abhängigkeiten bestehen, wird er nach dem `ready`-Hook aufgerufen.

- **Aufrufzeitpunkt**: Komponente und ihre Unterkomponenten sind vollständig geladen
- **Hauptverwendung**: Ausführung von Operationen, die auf dem vollständigen Komponentenbaum basieren

## Lebenszyklus-Ausführungsreihenfolge

Die Lifecycle-Hooks einer Komponente werden in folgender Reihenfolge ausgeführt:

1. `ready` - Komponente bereit (DOM erstellt)
2. `attached` - Komponente in DOM eingehängt
3. `loaded` - Komponente vollständig geladen

Wenn die Komponente aus dem DOM entfernt wird, wird der `detached`-Hook aufgerufen.

## Verwendungsbeispiel

Das folgende Beispiel zeigt, wie man in einer Komponente Lebenszyklus-Hook-Funktionen verwendet:

<o-playground name="Lebenszyklus-Beispiel" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Lebenszyklus-Demonstration</h3>
      <div class="counter">Zähler: {{count}}</div>
      <button on:click="count += 10">Um 10 erhöhen</button>
      <button on:click="removeSelf">Komponente entfernen</button>
      <div class="log">
        <h4>Lebenszyklus-Protokoll:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Entfernt sich selbst aus dem DOM, um den detached-Hook auszulösen
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: Komponente bereit, DOM erstellt");
              console.log("Komponente ist bereit");
            },
            attached() {
              this.addLog("attached: Komponente im DOM eingehängt");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Komponente eingehängt");
            },
            detached() {
              this.addLog("detached: Komponente aus DOM entfernt");
              // Timer löschen, um Speicherlecks zu verhindern
              clearInterval(this._timer); 
              console.log("Komponente ausgehängt");
            },
            loaded() {
              this.addLog("loaded: Komponente vollständig geladen");
              console.log("Komponente vollständig geladen");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel kannst du die Ausführungsreihenfolge und den Zeitpunkt verschiedener Lifecycle-Hooks beobachten. Wenn du auf die Schaltfläche „Komponente entfernen“ klickst, wird der Hook `detached` ausgelöst.

## Praktische Anwendungsszenarien

### Initialisierungsvorgang

Die Dateninitialisierung im `ready`-Hook vornehmen:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM-Operationen
      this.initDomElements();
    }
  };
};
```

### Ressourcenmanagement

Starten Sie den Timer im `attached`-Hook und räumen Sie die Ressourcen im `detached`-Hook auf:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Timer starten
      this.timer = setInterval(() => {
        console.log('Zeitgesteuerte Aufgabe wird ausgeführt');
      }, 1000);
    },
    detached() {
      // Timer bereinigen
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Die Lebenszyklus-Hook-Funktionen sind ein zentrales Konzept in der ofa.js-Komponentenentwicklung. Ihre korrekte Anwendung hilft dir, den Komponentenzustand und Ressourcen besser zu verwalten und die Leistung deiner Anwendung zu verbessern.

