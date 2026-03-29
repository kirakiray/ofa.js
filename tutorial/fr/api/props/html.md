# html



La méthode `html` sert à obtenir ou à définir le code HTML à l’intérieur de l’élément cible.

<o-playground name="html - utilisation directe" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">cible 1</span>
      </div>
      <div id="target2">texte d'origine</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">nouveau texte</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Remarques

`html` est une méthode relativement dangereuse ; si un `script` est inséré, le code JavaScript interne s’exécute automatiquement. Faites attention à prévenir les XSS lors de son utilisation.

## Utilisation de la syntaxe de modèle

Vous pouvez également utiliser l’attribut `:html` pour définir la valeur HTML correspondante sur l’élément cible. Cela est particulièrement utile dans le rendu des composants.

<o-playground name="html - syntaxe de modèle" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>change txt from outside</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>HTML rendu :
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "Je suis txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>changer txt</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

