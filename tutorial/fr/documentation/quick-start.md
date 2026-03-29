# Démarrage rapide

Cette section présentera comment démarrer rapidement avec ofa.js. Dans les tutoriels suivants, nous ommettrons les étapes de création du fichier d'entrée index.html et ne montrerons que le code des fichiers de modules de page. Vous pouvez développer directement sur la base du modèle.

## Préparer les fichiers de base

Pour démarrer rapidement avec ofa.js, il suffit de créer un **module de page** et de l'associer à un HTML d'entrée ; les fichiers essentiels sont les suivants :

- `index.html` : fichier d’entrée de l’application, chargé de charger le framework ofa.js et d’importer le module de page
- `demo-page.html` : fichier de module de page, définissant le contenu, les styles et la logique de données spécifiques de la page

### index.html (point d'entrée de l'application)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exemple ofa.js</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

La fonction principale de ce fichier est :- Introduction du framework ofa.js
- Utilisation du composant `<o-page>` pour charger et rendre le module de page

### demo-page.html (Module de page)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Bonjour le code de démonstration ofa.js",
        },
      };
    };
  </script>
</template>
```

Ce fichier définit un composant de page simple, contenant :- la balise `<template page>`, définit le module de page
- les styles CSS (le sélecteur `:host` du Shadow DOM)
- l’expression de liaison de données `{{val}}`
- la logique JavaScript, renvoie un objet contenant les données initiales


## Démonstration en ligne

Voici un exemple en direct dans l’éditeur en ligne ; vous pouvez modifier le code et voir le résultat immédiatement :

<o-playground name="Démo en ligne" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
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

Nous définissons les styles via la balise `<style>` à l'intérieur du composant. Ces styles internes ne s'appliquent qu'à l'intérieur du composant, offrant une bonne encapsulation et n'affectant pas les autres éléments de la page.

Le sélecteur `:host` est utilisé pour définir les styles de l'élément hôte du composant ; ici, nous définissons le composant comme un élément de bloc, avec une bordure rouge et un remplissage de 10 px.

En utilisant l'expression `{{key}}`, il est possible d'afficher la valeur correspondante dans les données du composant sur la page.

Vous avez maintenant créé avec succès votre première application ofa.js ! Ensuite, plongeons plus profondément dans la syntaxe de rendu des modèles d'ofa.js et ses fonctionnalités avancées.