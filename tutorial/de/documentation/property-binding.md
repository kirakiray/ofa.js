# Eigenschaftsbindung

ofa.js unterstützt das Binden von Daten an Eigenschaften des nach der Instanziierung des Elements erzeugten Objekts, wie z. B. die value- oder checked-Eigenschaft eines input-Elements.

## Unidirektionale Eigenschaftsbindung

Unidirektionale Attributbindung verwendet die Syntax `:toKey="fromKey"`, um Komponentendaten "unidirektional" mit den Attributen eines DOM-Elements zu synchronisieren. Bei Änderungen der Komponentendaten werden die Elementattribute sofort aktualisiert; jedoch werden Änderungen am Element selbst (z. B. Benutzereingaben) nicht zurück in die Komponente geschrieben, wodurch der Datenfluss einfach und kontrollierbar bleibt.

<o-playground name="Einweg-Attribut-Bindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Aktueller Wert: {{val}}</p>
      <input type="text" :value="val" placeholder="Dies ist ein einweg-gebundenes Eingabefeld">
      <p>Hinweis: Direktes Ändern des Inhalts im Eingabefeld ändert den oben angezeigten Wert nicht</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Zweiseitige Attributbindung

Die bidirektionale Eigenschaftsbindung verwendet die `sync:xxx`-Syntax und ermöglicht die bidirektionale Synchronisierung zwischen Komponentendaten und DOM-Elementen. Wenn sich die Komponentendaten ändern, werden die Attribute des DOM-Elements aktualisiert; wenn sich die Attribute des DOM-Elements ändern (z. B. durch Benutzereingaben), werden auch die Komponentendaten synchron aktualisiert.

<o-playground name="Zweirichtungs-Attribut-Bindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Aktueller Wert: {{val}}</p>
      <input type="text" sync:value="val" placeholder="Dies ist ein Eingabefeld mit Zweirichtungs-Bindung">
      <p>Tipp: Änderungen im Eingabefeld aktualisieren den oben angezeigten Wert in Echtzeit</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Zwei-Wege-Datenbindung Merkmale

-  Datenfluss: Komponente ↔ DOM-Element (bidirektional)
-  Komponentendatenänderungen → DOM-Element-Aktualisierung
-  DOM-Element-Änderungen → Komponentendaten-Aktualisierung
-  Geeignet für Szenarien, die Benutzereingaben und Datensynchronisierung erfordern

### Häufige Szenarien für bidirektionale Datenbindung

<o-playground name="Formular-Zwei-Wege-Bindung Beispiel" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Formular-Zwei-Wege-Bindung Beispiel</h3>
      <div class="form-group">
        <label>Textfeld:</label>
        <input type="text" sync:value="textInput" placeholder="Text eingeben">
      </div>
      <div class="form-group">
        <label>Zahlenfeld:</label>
        <input type="number" sync:value="numberInput" placeholder="Zahl eingeben">
      </div>
      <div class="form-group">
        <label>Mehrzeiliger Text:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Mehrzeiligen Text eingeben"></textarea>
      </div>
      <div class="form-group">
        <label>Auswahlfeld:</label>
        <select sync:value="selectedOption">
          <option value="">Bitte auswählen...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Checkbox:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> Ich stimme den Bedingungen zu
        </label>
      </div>
      <div class="preview">
        <h4>Live-Vorschau:</h4>
        <p>Text: {{textInput}}</p>
        <p>Zahl: {{numberInput}}</p>
        <p>Mehrzeiliger Text: {{textareaInput}}</p>
        <p>Auswahl: {{selectedOption}}</p>
        <p>Checkbox-Status: {{isChecked ? 'Ausgewählt' : 'Nicht ausgewählt'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

1. **Performance-Aspekte**: Zwei-Wege-Bindung erzeugt Daten-Listener, deren massenhafter Einsatz die Leistung beeinträchtigen kann  
2. **Datenkonsistenz**: Zwei-Wege-Bindung stellt die Übereinstimmung von Daten und View sicher, doch sollte man auf endless Update-Schleifen achten  
3. **Initialwert setzen**: Stelle sicher, dass die gebundenen Daten sinnvolle Initialwerte besitzen, um undefined-Anzeigeprobleme zu vermeiden  
4. **Event-Konflikte**: Verwende nicht gleichzeitig Zwei-Wege-Bindung und manuelle Event-Behandlung am selben Element, um Konflikte zu verhindern