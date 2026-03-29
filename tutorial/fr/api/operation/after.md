# after



La méthode `after` sert à ajouter un élément après l’élément cible. Avant l’exécution de l’opération `after`, l’initialisation de la méthode [$](../instance/dollar.md) est automatiquement effectuée, il est donc possible de renseigner directement une chaîne ou un objet représentant l’élément.

**Veuillez noter que vous ne devez pas opérer à l’intérieur des composants de modèle tels que o-fill ou o-if.**

<o-playground name="after - ajouter après" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li id="target">Je suis 2</li>
        <li>Je suis 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">nouveau li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

