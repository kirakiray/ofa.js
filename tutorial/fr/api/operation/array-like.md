# Ajouter ou supprimer des éléments enfants

Les instances d'éléments possèdent des caractéristiques similaires à celles d’un tableau ; ajouter ou supprimer des nœuds suffit donc à utiliser les quelques méthodes propres aux tableaux. Lors de l’utilisation des méthodes `push`, `unshift`, `pop`, `shift`, `splice`, l’initialisation de la méthode [$](../instance/dollar.md) est automatiquement exécutée en interne, aussi peut-on directement renseigner une chaîne ou un objet d’élément concret.

De même, vous pouvez également utiliser d'autres méthodes de tableau, telles que `forEach`, `map`, `some`, etc.

**Veuillez noter de ne pas ajouter ou supprimer d’éléments enfants sur les éléments comportant une syntaxe de modèle.**

## push



Ajouter un élément enfant à la fin

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">nouveau li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



Ajouter un élément enfant au début du tableau.

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li>Je suis 2</li>
        <li>Je suis 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">nouveau li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



Supprimer le sous-élément depuis la fin.

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li>Je suis 2</li>
        <li>Je suis 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



Supprimer un sous-élément au début du tableau.

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



Vous pouvez supprimer ou remplacer des éléments enfants existants, ou ajouter de nouveaux éléments enfants. Son utilisation est similaire à la méthode `splice` des tableaux.

<o-playground name="array-like - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">nouveau li 1</li>`, `<li style="color:green;">nouveau li 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

