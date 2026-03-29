# tag



L'attribut `tag` est utilisé pour obtenir la balise d'un élément, renvoyant une chaîne de caractères en minuscules.

Dans l'exemple ci-dessous, nous démontrons comment utiliser la méthode `tag` pour obtenir la balise d'un élément :

<o-playground name="tag - obtenir le tag">
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

