# Composant implicite

ofa.js intègre deux types de composants non explicites :

* Composants de rendu conditionnel : `x-if`, `x-else-if`, `x-else`
* Composants de remplissage : `x-fill`

Ces deux composants ont des fonctionnalités identiques à celles des composants `o-if` et `o-fill`, mais ils ne seront pas réellement rendus dans le DOM ; à la place, leurs éléments internes seront directement rendus dans la zone correspondante.

Par exemple :

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- Le style n’est pas rouge, car le composant o-if existe dans le DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- Le style est rouge, car le composant x-if n’est pas rendu dans le DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Composant non explicite" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* sélectionne les éléments .item du premier niveau en rouge */
            color:red;
        }
        /* il faut sélectionner les éléments .item à l’intérieur du composant o-if */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- le style n’est pas rouge car le composant o-if existe dans le DOM -->
                <div class="item">ne s’affichera pas en rouge</div>
            </o-if>
            <x-if :value="true">
                <!-- le style est rouge car le composant x-if n’est pas rendu dans le DOM -->
                <div class="item">s’affiche en rouge</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if Composant de rendu conditionnel

`x-if` a exactement la même fonction que [o-if](./conditional-rendering.md), il est utilisé pour décider si le contenu doit être rendu en fonction de la valeur de vérité d'une expression conditionnelle. La différence est que `x-if` lui-même n'existe pas en tant qu'élément DOM, son contenu interne est directement rendu dans le conteneur parent.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Bienvenue, utilisateur !</p>
    </x-if>
</div>
```

`x-if` peut également être utilisé avec `x-else-if` et `x-else` :

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Panneau d'administration</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>Centre utilisateur</p>
    </x-else-if>
    <x-else>
        <p>Veuillez vous connecter</p>
    </x-else>
</div>
```

## Composant de remplissage x-fill

`x-fill` a exactement la même fonction que [o-fill](./list-rendering.md) : il sert à rendre des données de tableau sous forme de multiples éléments DOM. Comme `x-if`, `x-fill` ne se rend pas lui-même dans le DOM ; son modèle interne est rendu directement dans le conteneur parent.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Exemple d'utilisation de modèles nommés :

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Spécifications de performance

En plus des différences fonctionnelles, les performances de rendu des composants non explicites sont **bien inférieures** à celles des composants explicites (`o-if`, `o-fill`). En effet, les composants non explicites ne sont pas réellement rendus dans le DOM, nécessitant une logique de rendu simulé supplémentaire pour gérer le positionnement et la mise à jour des éléments internes.

De plus, les composants non explicites peuvent introduire des bugs difficiles à détecter : comme ils ne sont pas réellement insérés dans le DOM, les opérations qui dépendent de la structure du DOM (comme la liaison d'événements, le calcul de styles ou les requêtes de bibliothèques tierces) peuvent échouer ou se comporter de manière anormale.

Par conséquent, il est conseillé de **préférer les composants explicites** (`o-if`, `o-else-if`, `o-else`, `o-fill`) et de n'utiliser les composants non explicites que dans des situations spécifiques.

## Scénarios d'utilisation

Bien que les composants implicites aient des performances inférieures, ils peuvent être utilisés dans les scénarios suivants :

1. **Éviter les niveaux DOM supplémentaires** : lorsque vous ne souhaitez pas que les éléments `o-if` ou `o-fill` fassent partie de la structure DOM  
2. **Héritage des styles** : lorsque vous avez besoin que les éléments internes héritent directement des styles du conteneur parent, sans être influencés par des éléments de composants intermédiaires  
3. **Limitations des sélecteurs CSS** : lorsque vous devez utiliser des sélecteurs d’enfant direct du parent (comme `.container > .item`) pour contrôler précisément les styles, sans qu’un élément d’emballage supplémentaire ne s’interpose