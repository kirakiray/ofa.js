# Attribute übergeben

In ofa.js sind [Attribut-Eigenschaften (Attribute)](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes) eine der gebräuchlichsten Methoden zur Datenübertragung zwischen Komponenten. Man muss nur die erforderlichen Attribute im `attrs`-Objekt der Komponente deklarieren, dann können beim Verwenden der Komponente externe Daten in die Komponente übergeben werden.

## Grundlegende Verwendung

### Empfangsattribute definieren

Bevor Sie eine Komponente verwenden, müssen Sie die gewünschten Eigenschaften im `attrs`-Objekt der Komponente deklarieren. Eigenschaften können Standardwerte erhalten.

<o-playground name="Grundlegende Verwendungsbeispiele" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA Komponentenbeispiel"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS Anwendungsfall"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Vorname: {{first}}</p>
      <p>Vollständiger Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Wichtige Regeln

1. **Typbeschränkung**: Der übergebene Attributwert muss ein String sein; andere Typen werden automatisch in Strings umgewandelt.

2. **Namenskonvertierung**: Da HTML-Attribute Groß- und Kleinschreibung ignorieren, müssen Attribute mit Großbuchstaben im Namen durch `-` getrennt (kebab-case) übergeben werden.
   - Beispiel: `fullName` → `full-name`

3. **Definition erforderlich**: Kann das entsprechende Attribut nicht im `attrs`-Objekt der Komponente gefunden werden, wird das Attribut nicht empfangen. Der gesetzte Wert ist der Standardwert; wenn kein Standardwert gewünscht ist, muss `null` gesetzt werden.

<o-playground name="Beispiel für wichtige Regeln" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="Zhang San" age="25"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "Standardname",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Vorlagensyntax zum Weitergeben von Attributen

In der Komponentenvorlage kann mit der Syntax `attr:toKey="fromKey"` das `fromKey`-Datenfeld der aktuellen Komponente an das `toKey`-Attribut der untergeordneten Komponente übergeben werden.

<o-playground name="Eigenschaftsübergabe Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Vollständiger Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrstufige Weitergabe

Attribute können durch mehrschichtige verschachtelte Komponenten weitergegeben werden.

Wenn eine Komponente von anderen Komponenten abhängig ist, muss das Modul der anderen Komponenten in der Komponente importiert werden.

<o-playground name="Mehrebenen-Übergabebeispiel" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="Top-Level-Daten"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>Äußere Komponente empfängt: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>Innere Komponente empfängt: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

