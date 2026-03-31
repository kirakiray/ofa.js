# Berechnete Eigenschaften

Berechnete Eigenschaften sind eine Methode, um neue Daten aus reaktiven Daten abzuleiten. Sie werden automatisch aktualisiert, wenn sich die abhängigen Daten ändern. In ofa.js sind berechnete Eigenschaften spezielle Methoden, die im `proto`-Objekt definiert sind und mit den JavaScript-Schlüsselwörtern `get` oder `set` definiert werden.

## Merkmale und Vorteile

- **Cache-Funktion**: Die Ergebnisse berechneter Eigenschaften werden zwischengespeichert und nur neu berechnet, wenn sich die von ihnen abhängigen Daten ändern.
- **Reaktivität**: Berechnete Eigenschaften aktualisieren sich automatisch, wenn die von ihnen abhängigen Daten aktualisiert werden.
- **Deklarativ**: Erzeugt Abhängigkeiten auf deklarative Weise, was den Code klarer und verständlicher macht.

## Berechnete get-Eigenschaften

get-Berechnungseigenschaften dienen dazu, neue Werte aus reaktiven Daten abzuleiten; sie nehmen keine Parameter entgegen und geben lediglich einen Wert zurück, der auf anderen Daten basiert.

<o-playground name="get Berechnete Eigenschaft Beispiel" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Klick Mich - {{count}} - {{countDouble}}</button>
      <p>Der Wert der berechneten Eigenschaft countDouble ist: {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble wird aufgerufen');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Beispiele für praktische Anwendungsszenarien

Computed Properties werden häufig zur Verarbeitung komplexer Datenumwandlungslogik verwendet, zum Beispiel zum Filtern von Arrays, zum Formatieren von Anzeigetext usw.:

<o-playground name="Berechnete Eigenschaften Beispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="Namen filtern...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['Zhang3', 'Li4', 'Wang54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Berechnete Eigenschaften setzen

setter ermöglichen es Ihnen, den zugrunde liegenden Datenzustand durch Zuweisungsoperationen zu ändern. Sie empfangen einen Parameter, der typischerweise verwendet wird, um die ursprünglichen Daten, von denen sie abhängen, rückwirkend zu aktualisieren.

<o-playground name="Set-Berechnete Eigenschaft Beispiel" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>Basiswert: {{count}}</p>
        <p>Doppelter Wert: {{countDouble}}</p>
        <button on:click="resetCount">Zähler zurücksetzen</button>
        <button on:click="setCountDouble">Doppelten Wert auf 10 setzen</button>
        <button on:click="incrementCount">Basiswert erhöhen</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // Sicherstellen, dass count nicht negativ ist
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Berechnete Eigenschaften vs. Methoden

Obwohl Methoden ähnliche Funktionen erfüllen können, besitzen berechnete Eigenschaften eine Cache-Funktionalität: Sie werden nur neu berechnet, wenn sich ihre abhängigen Daten ändern, was die Leistung verbessert.

```javascript
// Verwendung von berechneten Eigenschaften (empfohlen) - mit Cache
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Verwendung einer Methode - wird bei jedem Aufruf ausgeführt
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Hinweise

1. **Vermeiden Sie asynchrone Operationen**: Berechnete Eigenschaften sollten synchron und ohne Nebenwirkungen bleiben. Asynchrone Aufrufe oder direkte Änderungen des Komponentenzustands sind darin verboten.
2. **Abhängigkeitsverfolgung**: Achten Sie darauf, nur von reaktiven Daten abhängig zu sein, da Aktualisierungen sonst unvorhersehbar sein können.
3. **Fehlerschutz**: Wenn innerhalb einer berechneten Eigenschaft zirkuläre Abhängigkeiten oder fehlerhafte Zuweisungen auftreten, kann dies zu Renderfehlern oder sogar Endlosschleifen führen. Stellen Sie sicher, dass Sie Grenzbedingungen im Voraus festlegen und eine ordnungsgemäße Fehlerbehandlung implementieren.

## Praktische Anwendungsbeispiele

Im Folgenden finden Sie ein einfaches Beispiel zur Formularvalidierung, das die Nützlichkeit von berechneten Eigenschaften veranschaulicht:

<o-playground name="Formularvalidierungsbeispiel" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>Einfaches Validierungsbeispiel</h3>
      <input type="text" sync:value="username" placeholder="Benutzernamen eingeben (mind. 3 Zeichen)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Status: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'Benutzername gültig' : 'Benutzername zu kurz';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

