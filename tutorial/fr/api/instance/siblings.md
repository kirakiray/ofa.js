# siblings



En utilisant la propriété `siblings`, vous pouvez facilement obtenir toutes les instances d'éléments adjacents de l'élément actuel, qui seront retournées sous forme de tableau.

<o-playground name="siblings - Éléments adjacents" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 0</li>
        <li>Je suis 1</li>
        <li id="target">Je suis la cible</li>
        <li>Je suis 3</li>
        <li>Je suis 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').siblings.forEach(e => e.text = 'changer le texte');
        },500);
      </script>
    </template>
  </code>
</o-playground>

