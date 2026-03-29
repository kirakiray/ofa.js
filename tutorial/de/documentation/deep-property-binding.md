# Verstehen der Attributbindung

In den vorherigen Inhalten wurde die grundlegende Verwendung der [Eigenschaftsbindung](./property-binding.md) bereits vorgestellt. Das vorherige Beispiel diente dazu, die `value`-Eigenschaft eines nativen Browserelements (wie `textarea`) zu binden. In diesem Abschnitt wird das Wesen der Eigenschaftsbindung vertieft untersucht – sie bindet tatsächlich an die JavaScript-Eigenschaft nach der Instanziierung der Komponente, nicht an das HTML-Attribut.

## Mechanismus der Komponenten-Attributbindung

In ofa.js verwenden wir mit der Syntax `:toProp="fromProp"` im Elternkomponente, um die JavaScript-Eigenschaft der Kindkomponenten-Instanz zu setzen, nicht das HTML-Attribut. Dies unterscheidet sich wesentlich vom direkten Setzen eines HTML-Attributs (z. B. `attr:toKey="fromKey"`).

Das folgende Beispiel zeigt, wie Daten über Property-Bindings an benutzerdefinierte Komponenten übergeben werden:

<o-playground name="Eigenschaftsbindung verstehen" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
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
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
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
          margin: 8px;
        }
      </style>
      <p>Vollständiger Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel:- Die Daten `val` in der Elternkomponente werden an die Eigenschaft `fullName` der Kindkomponente `<demo-comp>` gebunden
- Mit der Syntax `:full-name="val"` wird der Wert `val` der Elternkomponente an die Eigenschaft `fullName` der Kindkomponente übergeben
- Nachdem die Kindkomponente diesen Wert empfangen hat, wird er in der Vorlage über `{{fullName}}` angezeigt

## Attribut-Bindung vs Feature-Attribut-Vererbung

Es ist zu beachten, dass Attributbindung (`:`) und Merkmalsattributvererbung (`attr:`) folgende wesentliche Unterschiede aufweisen:

### Attributbindung (`:`)

- An die Komponenteninstanz gebundene JavaScript-Eigenschaften
- Übergebene Daten behalten ihren ursprünglichen Typ (String, Zahl, Boolean, etc.)
- Direkter Zugriff und Modifikation innerhalb der Komponente möglich, ohne dass `data` vorab in der Komponente definiert sein muss

### Feature-Attribut-Vererbung (`attr:`)

-  HTML-Attribute setzen
-  Alle Werte werden in Zeichenketten umgewandelt
-  Hauptsächlich zum Weitergeben von Attributen an das zugrundeliegende DOM-Element
-  Erfordert spezielle Behandlung, um komplexe Daten zu analysieren
-  `attrs` muss vorab innerhalb der Komponente definiert sein, um Attributwerte zu empfangen

Grammatikvergleich:```html
<!-- Attributbindung: JavaScript-Werte übergeben, Datentyp bleibt erhalten -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Attributvererbung: HTML-Attribute setzen, alle Werte werden zu Strings -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- tatsächlich wird String "42" übergeben -->
```

## Fallvergleich Unterschiede

<o-playground name="Fallvergleich Unterschiede" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
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
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "Ich bin Eins",
              valTwo: "Ich bin Zwei",
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
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dabei ist `vone` eine Eigenschaft der Komponenteninstanz, `vtwo` ist ein HTML-Attribut, der Wert des HTML-Attributs wird durch den `[vtwo]`-Selektor ausgewählt und der Stil angewendet, während `vone` eine Eigenschaft der Komponenteninstanz ist und nicht durch den `[vone]`-Selektor ausgewählt wird.

## Bidirektionale Datenbindung

Instanziierte Komponenten unterstützen ebenfalls die bidirektionale Datenbindung mit der Syntax `sync:toProp="fromProp"`. Die bidirektionale Bindung ermöglicht die Synchronisierung von Daten zwischen der übergeordneten und der untergeordneten Komponente. Wenn sich die Daten auf einer Seite ändern, wird die andere Seite entsprechend aktualisiert.

Im Gegensatz zu Angular und Vue bietet ofa.js native Unterstützung für die Zwei-Wege-Datenbindungssyntax, ohne dass spezielle Konfigurationen oder zusätzliche Operationen für Komponenten erforderlich sind.

### Beispiel für bidirektionale Bindung

Das folgende Beispiel zeigt, wie eine bidirektionale Datenbindung zwischen einer übergeordneten und einer untergeordneten Komponente eingerichtet wird:

<o-playground name="Zwei-Wege-Datenbindung Beispiel" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
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
      <h3 style="color:blue;">Wert in der Elternkomponente: {{val}}</h3>
      <p>Den Wert der Elternkomponente über das Eingabefeld ändern:</p>
      <input type="text" sync:value="val" placeholder="Text im Eingabefeld eingeben...">
      <p>Den Wert der Elternkomponente über die Unterkomponente ändern:</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
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
          margin: 8px;
        }
      </style>
      <p>Wert in der Unterkomponente: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="In der Unterkomponente eingeben...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel:- Die `val` der Eltern-Komponente und die `fullName` der Kind-Komponente werden über `sync:full-name="val"` mit einer bidirektionalen Bindung realisiert.
- Wenn Inhalte in das Eingabefeld der Eltern-Komponente eingegeben werden, zeigt die Kind-Komponente sofort den neuen Wert an.
- Wenn Inhalte in das Eingabefeld der Kind-Komponente eingegeben werden, aktualisiert die Eltern-Komponente ebenfalls sofort die Anzeige.

### Unterschiede zwischen bidirektionaler Bindung und normaler Eigenschaftsbindung

| Funktion | Normale Eigenschaftsbindung (`:`) | Zwei-Wege-Bindung (`sync:`) |
|------|-------------------|-------------------|
| Datenfluss | Einweg: Eltern → Kind | Zwei-Wege: Eltern ↔ Kind |
| Syntax | `:prop="value"` | `sync:prop="value"` |
| Änderung durch Kindkomponente | Beeinflusst Elternkomponente nicht | Beeinflusst Elternkomponente |
| Anwendungsfall | Elternkomponente übergibt Konfiguration an Kindkomponente | Benötigt Synchronisierung von Daten zwischen Eltern- und Kindkomponente |### Hinweise

1. **Leistungsaspekte**：Bidirektionale Bindung löst bei Datenänderungen ein erneutes Rendern aus und sollte in komplexen Szenarien mit Vorsicht verwendet werden
2. **Datenflusskontrolle**：Übermäßige bidirektionale Bindung kann dazu führen, dass der Datenfluss schwer nachvollziehbar wird. Es wird empfohlen, die Kommunikation zwischen Komponenten sinnvoll zu gestalten
3. **Komponentenkompatibilität**：Nicht alle Komponenten eignen sich für bidirektionale Bindung; es muss der Verwendungszweck der Komponente berücksichtigt werden