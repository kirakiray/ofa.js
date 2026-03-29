# tag



Das `tag`-Attribut wird verwendet, um das Tag eines Elements abzurufen und gibt einen Kleinbuchstaben-String zurück.

Im folgenden Beispiel zeigen wir, wie man mit der `tag`-Methode das Tag eines Elements abruft:

<o-playground name="tag - Tag abrufen">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

