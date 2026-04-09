# unwrap



La méthode `unwrap` sert à supprimer l'élément d'emballage externe de l'élément cible.

<o-playground name="unwrap - retirer l'enveloppe" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Remarques

L’élément cible **doit posséder un nœud parent**, sinon l’opération de suppression de l’enveloppe (unwrap) ne peut pas être exécutée.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // erreur, pas d'élément parent, impossible de unwrap
$el.$('#target').unwrap(); // correct, supprime l'élément qui englobe
```

Lorsque l'élément cible possède d'autres éléments frères, il n'est pas non plus possible d'exécuter unwrap.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>Je suis un nœud frère</div>
</div>
`);

$el.$('#target').unwrap(); // Erreur, car il possède d'autres nœuds adjacents
```

**Veuillez noter de ne pas manipuler à l’intérieur des composants de modèle tels que o-fill ou o-if.**