# style



L’attribut `style` reste cohérent avec la version native.

Veuillez noter que l'attribut `style` ne peut pas obtenir la valeur réelle du style, mais uniquement les valeurs définies sur l'attribut `style`. Bien que la méthode `style` soit similaire à la [méthode css](./css.md), elle ne permet pas de remplacer l'ensemble des styles. Par rapport à `css`, la méthode `style` a une efficacité d'exécution interne plus élevée.

Voici un exemple montrant comment utiliser `style` :

<o-playground name="style - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">texte d'origine</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

N'oubliez pas que la méthode `style` ne récupère et ne définit que les valeurs de l'attribut `style`, et non les styles calculés réels.

## Utilisation de la syntaxe de modèle

Vous pouvez également définir le style des éléments cibles via la syntaxe de modèle.

<o-playground name="style - Syntaxe des templates" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
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

