# Template-Rendering

ofa.js bietet eine leistungsstarke Template-Rendering-Engine mit einer umfangreichen Template-Syntax, die Entwicklern hilft, Anwendungen schnell zu erstellen. Zunächst beginnen wir mit der Einführung des am häufigsten verwendeten Text-Renderings.

## Seitendatenbindung

In ofa.js hat jede Seite ein `data`-Objekt, in dem Sie Variablen definieren können, die auf der Seite verwendet werden sollen. Wenn das Rendering der Seite beginnt, werden die Daten aus dem `data`-Objekt automatisch mit der Vorlage verknüpft. Anschließend können Sie in der Vorlage die Syntax `{{Variablenname}}` verwenden, um den Wert der entsprechenden Variable zu rendern.

## Text-Rendering

Text-Rendering ist die grundlegendste Rendering-Methode. Sie können in der Vorlage die Syntax `{{Variablenname}}` verwenden, um den Wert der entsprechenden Variable im `data`-Objekt anzuzeigen.

<o-playground name="Text-Rendering-Beispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
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
</o-playground>

## HTML-Inhalt rendern

Durch Hinzufügen der `:html`-Direktive zu einem Element kann der entsprechende HTML-String aus einer Variable geparst und sicher in das Element eingefügt werden, wodurch die dynamische Darstellung von Rich-Text oder das Einbetten externer HTML-Fragmente erleichtert wird.

<o-playground name="Beispiel für das Rendern von HTML-Inhalten" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hallo ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

