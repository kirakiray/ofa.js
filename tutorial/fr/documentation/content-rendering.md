# Rendu de template

ofa.js fournit un puissant moteur de rendu de modèles, riche en syntaxe de modélisation, permettant aux développeurs de construire rapidement des applications. Commençons par présenter le rendu de texte le plus couramment utilisé.

## Liaison de données de page

Dans ofa.js, chaque page a un objet `data` dans lequel vous pouvez définir les variables dont vous avez besoin dans la page. Lorsque la page commence à être rendue, les données de l'objet `data` sont automatiquement liées au modèle, puis la syntaxe `{{nom de variable}}` est utilisée dans le modèle pour rendre la valeur de la variable correspondante.

## Rendu de texte

Le rendu de texte est la méthode de rendu la plus basique, vous pouvez utiliser la syntaxe `{{nom de variable}}` dans le modèle pour afficher la valeur de la variable correspondante dans l'objet `data`.

<o-playground name="Exemple de rendu de texte" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Rendu du contenu HTML

En ajoutant la directive `:html` à un élément, il est possible de parser une chaîne HTML d'une variable correspondante et de l'insérer en toute sécurité à l'intérieur de l'élément, permettant de réaliser facilement le rendu dynamique de texte enrichi ou l'intégration de fragments HTML externes.

<o-playground name="Exemple de rendu de contenu HTML" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

