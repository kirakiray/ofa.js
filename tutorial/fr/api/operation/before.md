# before



La méthode `before` sert à ajouter des éléments devant l’élément cible. Avant l’exécution de l’opération `before`, l’initialisation de la méthode [$](../instance/dollar.md) est automatiquement effectuée, il est donc possible d’indiquer directement une chaîne ou un objet d’élément concret.

**Veuillez noter que vous ne devez pas opérer à l’intérieur des composants de modèle tels que o-fill ou o-if.**

<o-playground name="before - ajouter avant" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li id="target">Je suis 2</li>
        <li>Je suis 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">nouveau li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

