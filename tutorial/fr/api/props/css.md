# css



La méthode `css` sert à obtenir ou à définir le style de l’élément cible.

## Utilisation directe

Vous pouvez directement utiliser la méthode `css` pour obtenir ou définir les styles d'un élément.

<o-playground name="css - utilisation directe" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">texte d'origine</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## Paramétrage complet

En obtenant l'objet `css`, vous pouvez directement définir les valeurs de style sur l'élément.

<o-playground name="css - Configuration complète" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">texte original</div>
      <br>
      <h4>journal</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

En utilisant les fonctionnalités de l'objet `css`, vous pouvez ajuster rapidement les styles de l'élément cible.

## Utilisation de la syntaxe de modèle

Vous pouvez également définir le style des éléments cibles via la syntaxe de modèle.

<o-playground name="css - syntaxe de modèle" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">Je suis la cible</div>
      <script>
        export default {
          tag: "css-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Astuces pour configurer le CSS

Vous pouvez modifier une propriété de style spécifique d'un élément via `$ele.css = {...$ele.css, color:'red'}` sans affecter les autres propriétés de style. Cette méthode permet de modifier une seule propriété sans avoir à réécrire l'ensemble des styles.

### Exemple

```javascript
const monElement = $("#monElement");

monElement.css = { ...monElement.css, color: 'rouge' };
```

Dans l'exemple ci-dessus, en utilisant `{ ...myElement.css, color: 'red' }`, nous avons uniquement modifié la couleur de l'élément tout en conservant les autres propriétés de style inchangées. C'est une astuce très pratique qui permet de modifier de manière flexible les styles des éléments.