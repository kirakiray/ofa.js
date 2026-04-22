# Klassen- und Stilbindungen

In ofa.js kannst du eine flexible UI-Zustandsverwaltung durch dynamisches Binden von Klassennamen, Stilen und Attributen erreichen. Dies ermöglicht es der Benutzeroberfläche, ihr Aussehen automatisch an Datenänderungen anzupassen.

## Klassen-Bindung

Klassen-Bindung ermöglicht es dir, CSS-Klassen dynamisch basierend auf dem Datenstatus hinzuzufügen oder zu entfernen. Du kannst die Syntax `class:className="booleanExpression"` verwenden, um bestimmte Klassen zu binden.

Wenn `booleanExpression` `true` ist, wird der Klassenname zum Element hinzugefügt; wenn sie `false` ist, wird der Klassenname entfernt.

### Grundlegende Klassen-Bindung

<o-playground name="Grundlegende Klassenbindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Anzeige umschalten</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Mehrere Klassen-Bindungen

Sie können auch mehrere Klassen gleichzeitig binden, sodass Elemente abhängig von verschiedenen Bedingungen unterschiedliche visuelle Zustände haben.

<o-playground name="Mehrere Klassen-Bindungen" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Aktueller Zustand – Aktiv: {{isActive}}, Deaktiviert: {{isDisabled}}, Hervorgehoben: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Stilbindung

Stil-Bindung ermöglicht es dir, Werte für Inline-Stile direkt zu setzen und unterstützt dynamische Aktualisierungen. ofa.js bietet zwei Arten der Stil-Bindung:

### Einzelne Stil-Attribut-Bindung

Verwenden Sie die Syntax `:style.propertyName`, um bestimmte Stileigenschaften zu binden.

<o-playground name="Einfache Stilattributbindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Toggle Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Mehrstilige Attributbindung

Du kannst auch mehrere Style-Eigenschaften auf einmal binden:

<o-playground name="Mehrere Stil-Attribut-Bindungen" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Dynamisches Styling-Beispiel
      </p>
      <button on:click="changeStyles">Stile ändern</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Attribut-Bindung

Neben Klassen- und Stil-Bindungen können Sie auch andere HTML-Attribute dynamisch binden. ofa.js verwendet die Syntax `attr:attributeName`, um Attributbindungen zu realisieren.

### Grundlegende Attributbindung

<o-playground name="Grundlegende Attribut-Bindung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "Dies ist eine Hinweisinformation",
              val: "Bewege die Maus über mich, um den Titel zu sehen",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Boolesche Attribute

Für boolesche Attribute (wie `disabled`, `hidden`) entscheidet ofa.js basierend auf dem Wahrheitswert des gebundenen Werts, ob das Attribut hinzugefügt wird.

<o-playground name="Boolesche Attributbehandlung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## data() Funktion

In Stilen kann `data(key)` verwendet werden, um Komponentendaten zu binden. Dies eignet sich besonders für Szenarien, in denen das Styling dynamisch basierend auf Komponentendaten geändert werden muss.

<o-playground name="Datenfunktion in Style-Tags" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          font-size: 10px;
          color:red;
          transition: all .3s ease;
        }
      </style>
      <style>
        p:hover {
          font-size: data(size);
          color: green;
          transition: all data(time)s ease;
        }
      </style>
      Hover Schriftgröße: <input type="number" sync:value="size" placeholder="Dies ist ein bidirektional gebundenes Eingabefeld" />
      <br />
      Übergangszeit: <input type="number" step="0.3" min="0" sync:value="time" placeholder="Dies ist ein bidirektional gebundenes Eingabefeld" />
      <p>{{val}} - Größe: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hallo ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

Das `data(key)` innerhalb eines `style`-Tags ersetzt prinzipiell den gesamten Inhalt des Styles. Um wiederholtes Rendern nicht betroffener Stile zu vermeiden, wird empfohlen, Stile mit `data(key)` in ein eigenes `style`-Tag zu setzen, während Stile ohne Datenbindung in ein anderes `style`-Tag ausgelagert werden, um eine bessere Leistung zu erzielen.

```html
<!-- ❌ Ein p:hover ohne data(key) wird ebenfalls aktualisiert -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ Nur Stile mit data(xxx) werden neu gerendert -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```