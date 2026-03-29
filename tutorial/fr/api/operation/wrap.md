# wrap



La méthode `wrap` est utilisée pour envelopper un élément cible avec une couche d'élément externe. Avant d'exécuter l'opération `wrap`, l'opération d'initialisation de la [méthode $](../instance/dollar.md) est automatiquement exécutée, il est donc possible de saisir directement une chaîne de caractères ou un objet d'élément spécifique.

<o-playground name="wrap - Envelopper un élément" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>Je suis 1</div>
        <div id="target">Je suis 2</div>
        <div>Je suis 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">envelopper</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Remarques

L'élément cible **doit avoir un nœud parent**, sinon l'opération d'enveloppement échouera.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // erreur, pas d’élément parent, impossible d’envelopper
$el.$('#target').wrap("<div>new div</div>"); // correct, il y a un élément parent
```

Veuillez noter qu'il ne faut pas操作 à l'intérieur de composants de modèle tels que o-fill ou o-if.