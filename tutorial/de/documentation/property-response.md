# Attributantwort

Im vorherigen Abschnitt [Attribut-Binding](./property-binding.md) haben wir den einfachen Mechanismus der Attribut-Reaktivität vorgestellt, also wie man den Wert einer Komponenteneigenschaft in einer Textanzeige rendert.

ofa.js unterstützt nicht nur die Reaktivität von grundlegenden Eigenschaftswerten, sondern auch das reaktive Rendering von inneren Eigenschaftswerten von mehrschichtig verschachtelten Objekten.

<o-playground name="Beispiel für nicht-reaktive Daten" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">Erhöhen</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Alle Daten, die an ein ofa.js-Instanzobjekt gebunden werden, werden automatisch in reaktive Daten umgewandelt. Reaktive Daten unterstützen nur primitive Datentypen wie Strings, Zahlen, boolesche Werte, Arrays und Objekte. Für komplexe Datentypen wie Funktionen oder Klasseninstanzen müssen diese als **nicht-reaktive Eigenschaften** gespeichert werden, da Änderungen an diesen Eigenschaften keine erneute Komponentenrenderierung auslösen.

## Nicht-responsive Daten

Manchmal müssen wir Daten speichern, die nicht reaktiv aktualisiert werden müssen, wie beispielsweise Promise-Instanzen, reguläre Ausdrücke oder andere komplexe Objekte. In solchen Fällen müssen nicht-reaktive Eigenschaften verwendet werden. Änderungen an diesen Eigenschaften lösen kein erneutes Rendern der Komponente aus und eignen sich daher für die Speicherung von Daten, die keine Verknüpfung mit der Ansicht erfordern.

Die Benennung nicht-reaktiver Eigenschaften erfolgt in der Regel durch das Voranstellen eines Unterstrichs `_` vor den Eigenschaftsnamen, um sie von reaktiven Eigenschaften zu unterscheiden.

<o-playground name="Nicht-reaktives Datenbeispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blau erhöhen</button>
      <button on:click="_count2++">Grün erhöhen</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Beim Klicken der Schaltfläche `Green增加` ist der Wert von `_count2` zwar tatsächlich erhöht worden, da es sich jedoch um eine nicht-reaktive Eigenschaft handelt, wird keine Aktualisierung der Ansicht ausgelöst, und die Anzeige in der Benutzeroberfläche bleibt daher unverändert. Beim Klicken der Schaltfläche `Blue增加` hingegen handelt es sich bei `count` um eine reaktive Eigenschaft, wodurch eine vollständige Neurenderung der Komponente ausgelöst wird und erst dann der Inhalt von Green synchron aktualisiert wird.

Nicht-reaktive Objektdaten haben eine bessere Leistung als reaktive Objektdaten, da nicht-reaktive Daten keine erneute Renderung der Komponente auslösen.


