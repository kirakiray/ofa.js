# text



La méthode `text` est utilisée pour obtenir ou définir le contenu textuel d'un élément.

## Utilisation directe

Vous pouvez obtenir ou définir directement le contenu textuel d’un élément.

<o-playground name="text - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target1">cible 1</div>
      <div id="target2">texte d'origine</div>
      <br>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').text = `<b style="color:blue;">nouveau texte</b>`;
          \$("#logger").text = $("#target1").text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Utilisation de la syntaxe de modèle

Vous pouvez également utiliser l'attribut `:text` pour définir la valeur de texte correspondante sur l'élément cible. Cela est particulièrement utile dans le rendu des composants.

<o-playground name="text - syntaxe de modèle" style="--editor-height: 450px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./text-demo.html"></l-m>
      <text-demo></text-demo>
      <script>
        setTimeout(()=>{
          \$("text-demo").txt = "changer txt de l'extérieur";
        },1000);
      </script>
    </template>
  </code>
  <code path="text-demo.html" active>
    <template component>
      <div>Texte rendu :
        <span :text="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "text-demo",
          data: {
            txt: "Je suis txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "changer txt";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

