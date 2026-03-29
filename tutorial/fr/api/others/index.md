# index



L'attribut `index` sert à obtenir la position d’un élément parmi ses frères et sœurs. Cette position est comptée à partir de 0 : le premier élément est donc à la position 0, le second à la position 1, et ainsi de suite.

Dans l'exemple ci-dessous, nous démontrons comment utiliser l'attribut `index` pour obtenir la position d'un élément sous son élément parent :

<o-playground name="index - obtenir la position" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li id="target">Je suis la cible</li>
        <li>Je suis 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous sélectionnons d'abord un élément `<li>` dont l'`id` vaut « target ». Ensuite, nous utilisons la propriété `index` pour obtenir la position de cet élément dans son parent `<ul>`, soit le deuxième élément, donc la valeur de `index` est 1. Nous affichons ensuite cette valeur dans un élément `<div>` dont l'`id` vaut « logger ».