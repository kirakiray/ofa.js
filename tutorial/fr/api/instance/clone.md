# clone



L'utilisation de la méthode `clone` permet de cloner et de générer une copie de l'instance d'un élément.

<o-playground name="clone - cloner un élément" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red;">Je suis la cible</div>
      <div>journal :</div>
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

