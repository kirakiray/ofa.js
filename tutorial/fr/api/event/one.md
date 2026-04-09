# one



En utilisant la méthode `one`, vous pouvez enregistrer un gestionnaire d’événement unique pour l’élément cible, ce qui signifie que le gestionnaire sera automatiquement désactivé après la première déclenchement et ne se déclenchera plus.

Voici un exemple démontrant comment utiliser la méthode `one` pour enregistrer un gestionnaire d'événement de clic sur un élément de bouton：

<o-playground name="one - click événement unique" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la méthode `one` pour attacher un gestionnaire d’événement de clic à l’élément bouton. Lorsque l’utilisateur clique sur le bouton, le gestionnaire d’événement se déclenche, mais ne se déclenchera plus par la suite, car il a été désactivé.

## Utilisation de la syntaxe de modèle

Vous pouvez également utiliser la syntaxe des modèles pour lier des gestionnaires d’événements ponctuels à l’élément cible.

<o-playground name="one - Syntaxe des modèles" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Ajouter le compteur</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons lié une méthode appelée `addCount` à l'élément bouton en utilisant `one:click`. Lorsque l'utilisateur clique sur le bouton, cette méthode sera appelée, mais ne se déclenchera plus par la suite, car c'est un gestionnaire d'événements à usage unique.