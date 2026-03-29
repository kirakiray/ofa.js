# Slots

Slots sind Platzhalter in Komponenten, um externe Inhalte zu empfangen. Durch die Verwendung von Slots kannst du wiederverwendbare Komponenten erstellen und gleichzeitig den Personen, die die Komponente verwenden, ermöglichen, deren Inhalt anzupassen.

## Standard-Slot

<o-playground name="Standard-Beispiel für Slot" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hallo, OFAJS!</div>
      </demo-comp>
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
      </style>Slot-Inhalt：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Standardinhalt für Slots

Wenn das übergeordnete Element keinen Slot-Inhalt bereitstellt, werden die Elemente innerhalb von `<slot></slot>` als Standardinhalt angezeigt.

<o-playground name="Slot-Standardinhalt-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>Mit Slot-Inhalt:</h3>
      <demo-comp>
        <div>Dies ist benutzerdefinierter Inhalt</div>
      </demo-comp>
      <h3>Ohne Slot-Inhalt (zeigt Standardinhalt an):</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>Slot-Inhalt:
      <span style="color: red;">
        <slot>
          <div>Dies ist Standardinhalt</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Benannte Slots

Wenn eine Komponente mehrere Slot-Positionen benötigt, können benannte Slots verwendet werden, um verschiedene Slots zu unterscheiden. Benannte Slots werden durch `<slot name="xxx">` definiert, und bei der Verwendung wird durch das Attribut `slot="xxx"` angegeben, in welchen Slot der Inhalt eingefügt wird.

<o-playground name="Beispiel für benannte Slots" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hallo, OFAJS!</div>
        <div slot="footer">Footer-Inhalt</div>
      </demo-comp>
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
      </style>Slot-Inhalt:
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrstufige Slot-Übergabe

Slot-Inhalte können über mehrere Komponentenebenen hinweg weitergegeben werden. Nachdem eine Elternkomponente Slot-Inhalte an eine Kindkomponente übermittelt hat, kann die Kindkomponente diese Slot-Inhalte weiter an ihre eigenen Kindkomponenten weitergeben, wodurch eine mehrschichtige Durchreichung der Slots ermöglicht wird.

<o-playground name="Beispiel für mehrstufige Slot-Übergabe" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">Überschrift von der äußersten Ebene</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>Äußere Komponente</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
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
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>Innere Komponente</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Im obigen Beispiel:- Die äußerste Elternkomponente definiert den Inhalt von `slot="header"`
- Die äußere Komponente (outer-comp) empfängt diesen Slot-Inhalt und leitet ihn an die innere Komponente (inner-comp) weiter
- Die innere Komponente rendert schließlich den Slot-Inhalt aus der äußersten Ebene