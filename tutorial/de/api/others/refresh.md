# refresh



Die Methode `refresh` wird verwendet, um die Rendering-Ansicht der Komponente aktiv zu aktualisieren. Manchmal, wenn die Daten auf der Komponente nicht aktualisiert werden, kann diese Methode verwendet werden, um die Ansicht der Komponente zu aktualisieren.

Geeignet für Szenarien, in denen eine manuelle Aktualisierung von [nicht-reaktiven Daten](../../documentation/property-response.md) erforderlich ist.

<o-playground name="refresh - Ansicht aktualisieren" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">Aktualisieren</button>
      <script>
        export default {
          tag: "refresh-demo",
          data: {
            _count: 0,
          },
          attached() {
            this._timer = setInterval(() => {
              this._count++;
            }, 200);
          },
        };
      </script>
    </template>
  </code>
</o-playground>

