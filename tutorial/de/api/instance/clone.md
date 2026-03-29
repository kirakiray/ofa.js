# clone



Mithilfe der `clone`-Methode können Sie eine Kopie einer Elementinstanz klonen und erstellen.

<o-playground name="clone - Element klonen" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red;">Ich bin das Ziel</div>
      <div>Logger:</div>
      <div id="logger"></div>
      <script>
        setTimeout(()=>{
          const tar = $('#target').clone();
          \$('#logger').push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

