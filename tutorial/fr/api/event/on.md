# on



En utilisant la méthode `on`, vous pouvez enregistrer des gestionnaires d'événements pour l'élément cible. Cela vous permet de capturer et de répondre facilement aux interactions de l'utilisateur.

Voici un exemple montrant comment utiliser la méthode `on` pour enregistrer un gestionnaire d’événement de clic sur un élément bouton :

<o-playground name="événement on - click" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">ajouter au compteur</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la méthode `on` pour ajouter un gestionnaire d'événement de clic à l'élément bouton. Lorsque l'utilisateur clique sur le bouton, le gestionnaire d'événement est déclenché, le compteur est incrémenté et le résultat est affiché sur la page.

## Utilisation de la syntaxe de modèle

Vous pouvez également utiliser la syntaxe des modèles pour lier des méthodes à l’élément cible.

<o-playground name="on - Syntaxe des modèles" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Ajouter Compteur</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
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

Dans cet exemple, nous avons lié une méthode appelée `addCount` à l’élément bouton à l’aide de `on:click`. Lorsque l’utilisateur clique sur le bouton, cette méthode est appelée, la valeur du compteur est incrémentée et affichée sur la page. Cette approche vous permet d’associer des gestionnaires d’événements aux méthodes du composant, réalisant ainsi des interactions plus complexes.

## event



Après l'enregistrement de l'événement, la fonction déclenchée recevra un paramètre event, ce qui est cohérent avec le comportement natif :

<o-playground name="paramètres d'événement on" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">ajouter le compteur</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

