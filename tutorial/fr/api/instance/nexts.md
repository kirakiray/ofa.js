# nexts



En utilisant l'attribut `nexts`, vous pouvez facilement obtenir toutes les instances d'éléments adjacents situés après l'élément actuel, et ces éléments seront renvoyés sous forme de tableau.

<o-playground name="nexts - Éléments suivants" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li id="target">Je suis la cible</li>
        <li>Je suis 3</li>
        <li>Je suis 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'changer le texte');
        },500);
      </script>
    </template>
  </code>
</o-playground>

