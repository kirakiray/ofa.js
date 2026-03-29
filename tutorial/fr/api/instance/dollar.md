# $

La méthode `$` est la fonction centrale d'ofa.js, utilisée pour obtenir et manipuler des instances d'éléments DOM. Voici une présentation détaillée des principales fonctionnalités de `$` :

## Obtenir une instance d'élément

Grâce à la méthode `$`, vous pouvez obtenir la première instance d’élément correspondant au [sélecteur CSS](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Selectors/Selector_list) sur la page et effectuer des opérations dessus. Voici un exemple :

<o-playground name="$ - obtenir l'élément">
  <code path="demo.html">
    <template>
      <div id="target1">texte cible 1</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'changer cible 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans l'exemple ci-dessus, nous avons utilisé le symbole `$` pour sélectionner l'instance d'élément avec l'`id` "target1", et modifié son contenu textuel en définissant la propriété `text`.

## Rechercher les instances d'éléments enfants

L’instance possède également la méthode `$`, qui permet d’obtenir, via la méthode `$` de l’instance, la première instance d’élément enfant correspondant aux critères.

<o-playground name="$ - Trouver des éléments enfants">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>Je suis target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'changer le titre de la cible';
      </script>
    </template>
  </code>
</o-playground>

Veuillez ne pas insérer directement l’instance d’élément obtenue ailleurs ; une telle opération affectera l’élément d’origine. Si vous avez besoin d’en créer une copie, utilisez la méthode [clone](./clone.md).

<o-playground name="$ - propriétés d'instance" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Obtenir les éléments enfants dans un nœud fantôme

On peut obtenir une instance via l'attribut [shadow](./shadow.md), puis utiliser la méthode `$` pour obtenir l'élément souhaité :

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Instanciation directe d'éléments

Vous pouvez initialiser directement un élément natif en tant qu'instance `$` de la manière suivante :

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

Ainsi, vous pouvez facilement convertir des éléments HTML existants en instances de `$` afin d’utiliser les fonctionnalités fournies par `$` pour les manipuler et les traiter.

## Génération d'instances d'éléments

En outre, `$` permet non seulement d’obtenir une instance d’élément existante, mais aussi de créer une nouvelle instance d’élément et de l’ajouter à la page.

### Générer par chaîne de caractères

Vous pouvez utiliser la fonction `$` pour créer une nouvelle instance d'élément à partir d'une chaîne de caractères, comme suit :

<o-playground name="$ - Génération de chaîne" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">ajouter le texte target 1</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la fonction `$` pour créer une nouvelle instance d'élément avec des styles et un contenu texte spécifiés, puis l'ajoutons à l'intérieur d'une instance d'élément existante ayant l'`id` "target1".

### Génération via objet

Vous pouvez également utiliser la fonction `$` pour générer une nouvelle instance d'élément sous forme d'objet, comme suit :

<o-playground name="$ - Génération d'objet" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la fonction `$` pour définir une nouvelle instance d'élément de manière objet, incluant le type de balise, le contenu textuel et les attributs de style, puis nous l'ajoutons à l'intérieur de l'instance d'élément existante ayant l'`id` "target1".