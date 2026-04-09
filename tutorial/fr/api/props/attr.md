# attr



La méthode `attr` sert à obtenir ou définir les attributs des éléments.

## Utilisation directe

Vous pouvez directement utiliser la méthode `attr` pour obtenir ou définir les attributs d'un élément.

<o-playground name="attr - utilisation directe" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div id="target1" test-attr="1">I am target 1</div>
      <div id="target2">I am target 2</div>
      <div id="logger" style="border:blue solid 1px;padding:8px;margin:8px;">logger</div>
      <script>
        $("#logger").text = $("#target1").attr('test-attr');
        setTimeout(()=> {
          $("#target1").attr('test-attr', '2')
          $("#logger").text = $("#target1").attr('test-attr');
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Utilisation de la syntaxe de modèle

Vous pouvez également utiliser la syntaxe `attr:aaa="bbb"` pour définir l'attribut **aaa** de l'élément cible sur la valeur du composant **bbb**. Cette méthode est particulièrement utile pour le rendu de composants.

<o-playground name="attr - syntaxe du template" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./attr-demo.html"></l-m>
      <attr-demo></attr-demo>
      <script>
        setTimeout(()=>{
          \$("attr-demo").txt = "2";
        },1000);
      </script>
    </template>
  </code>
  <code path="attr-demo.html" active>
    <template component>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div attr:test-attr="txt">I am target</div>
      <script>
        export default {
          tag: "attr-demo",
          data: {
            txt: "1"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "2";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

