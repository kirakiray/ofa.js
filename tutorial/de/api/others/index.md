# index



Die Eigenschaft `index` wird verwendet, um die Position eines Elements innerhalb seines übergeordneten Elements zu ermitteln. Diese Position wird ab 0 gezählt, d. h. das erste Element hat die Position 0, das zweite die Position 1 usw.

In dem folgenden Beispiel demonstrieren wir, wie die `index`-Eigenschaft verwendet wird, um die Position eines Elements unter seinem übergeordneten Element zu erhalten:

<o-playground name="index - Position abrufen" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li id="target">Ich bin das Ziel</li>
        <li>Ich bin 3</li>
      </ul>
      <div id="logger" style="color: green">Protokoll</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel wählen wir zunächst ein `<li>`-Element mit der `id` „target“. Dann verwenden wir die Eigenschaft `index`, um die Position dieses Elements innerhalb seines übergeordneten Elements `<ul>` abzurufen – es ist das zweite Element, daher hat `index` den Wert 1. Anschließend wird dieser Wert in einem `<div>`-Element mit der `id` „logger“ angezeigt.