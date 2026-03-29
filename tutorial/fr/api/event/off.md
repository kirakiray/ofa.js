# off



L'utilisation de la méthode `off` permet de désinscrire les gestionnaires d'événements déjà enregistrés, afin d'annuler l'écoute des événements.

Voici un exemple montrant comment utiliser la méthode `off` pour annuler l’écoute d’un événement :

<o-playground name="off - Supprimer l'écouteur d'événements" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">ajouter le compteur</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons enregistré un gestionnaire d'événement de clic `f`, lorsque le bouton est cliqué, le gestionnaire d'événement affichera le nombre de clics dans `#logger`. En utilisant la méthode `off`, nous avons désinscrit l'écoute de l'événement lorsque le nombre de clics atteint 3.