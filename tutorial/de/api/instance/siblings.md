# siblings



Mit der Eigenschaft `siblings` können Sie ganz einfach alle benachbarten Element-Instanzen des aktuellen Elements abrufen; diese werden als Array zurückgegeben.

<o-playground name="siblings - benachbarte Elemente" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').siblings.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

