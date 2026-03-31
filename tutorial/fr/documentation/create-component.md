# Créer un composant

Dans ofa.js, les composants sont le mécanisme central pour la réutilisation de pages et la modularisation. Un composant est essentiellement un Web Component personnalisé ; en définissant un modèle, des styles et une logique, on peut créer des éléments d’interface réutilisables.

## Structure de base d'un composant

Contrairement aux modules de page, les modules de composants utilisent l’attribut `component` pour l’élément `<template>` et déclarent l’attribut `tag` pour spécifier le nom de la balise du composant.

À l'endroit où le composant doit être utilisé, chargez de manière asynchrone le module du composant via la balise `l-m` ; le système procèdera automatiquement à l'enregistrement. Vous pourrez ensuite utiliser le composant directement comme une balise HTML ordinaire.

<o-playground name="Exemple de base du composant" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "Exemple de composant OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Concepts fondamentaux des composants

### tag - nom de la balise du composant

`tag` est le nom de balise du composant, **il doit correspondre exactement au nom de balise utilisé pour le composant**. Par exemple, si le `tag` de votre composant est défini comme `"demo-comp"`, alors lors de son utilisation en HTML, vous devez écrire `<demo-comp></demo-comp>`.

### Référence du module de composant

En utilisant la balise `l-m` pour importer un module de composant, le module de composant enregistre automatiquement le composant. Cela est similaire à l'utilisation de la balise `script` pour importer un script, mais `l-m` est spécifiquement conçu pour le chargement et l'enregistrement des modules de composants.

> Remarque : le tag de référence `l-m` est une **référence asynchrone**, adaptée au chargement à la demande des composants lors du chargement de la page.

## Composant de référence synchrone

Dans certains scénarios, vous pourriez avoir besoin de charger les composants de manière synchrone (par exemple, pour vous assurer qu'un composant est enregistré avant de l'utiliser). Dans ce cas, vous pouvez utiliser la méthode `load` avec le mot-clé `await` pour réaliser un référencement synchrone.

Dans les modules de composants et les modules de page, la fonction `load` est automatiquement injectée, permettant aux développeurs de charger de manière synchrone les ressources nécessaires.

<o-playground name="Exemple de composant de référence synchrone" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "Exemple de composant OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Référence asynchrone vs Référence synchrone

| Mode de citation | Mot-clé | Caractéristiques |
|---------|-------|------|
| Chargement asynchrone | Tag `l-m` | Chargement non bloquant, adapté au chargement à la demande des composants |
| Chargement synchrone | Méthode `load` avec le mot-clé `await` | Chargement bloquant, garantit que le composant est enregistré avant utilisation |Les références de balises `l-m` et la méthode `load` peuvent toutes deux charger des modules de composants. Dans la plupart des cas, il est recommandé d'utiliser la balise `l-m` pour référencer les composants de manière asynchrone, afin de réaliser un chargement non bloquant et à la demande.