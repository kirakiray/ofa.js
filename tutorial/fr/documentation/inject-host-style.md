# Injecter les styles de l'hôte

Dans les Web Components, en raison des limitations des `slot`, il est impossible de définir directement les styles des éléments multi-niveaux à l’intérieur d’un slot. Pour résoudre ce problème, ofa.js fournit le composant `<inject-host>`, qui permet d’injecter des styles dans l’élément hôte depuis l’intérieur du composant, afin de contrôler les styles des éléments multi-niveaux dans le contenu du slot.

> 注意，建议优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 选择器来设置插槽内容的样式。只有在无法满足需求时，才使用 `<inject-host>` 组件。

## Utilisation de base

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Définir le style des éléments enfants directs */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* Il est également possible de définir des styles pour les imbrications multi-niveaux */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Cas

L'exemple ci-dessous montre comment utiliser `<inject-host>` pour définir le style des éléments imbriqués dans un slot. Nous créons deux composants : le composant `user-list` comme conteneur de liste et le composant `user-list-item` comme élément de liste. Grâce à `<inject-host>`, nous pouvons définir le style de `user-list-item` et de ses éléments internes dans le composant `user-list`.

<o-playground name="Injection de styles hôte" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Zhang San</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Li Si</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Âge: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

On peut voir dans les résultats d'exécution :- La couleur de fond du composant `user-list-item` est aqua (définie via le `<inject-host>` du composant `user-list`)
- La couleur du texte du nom est rouge (définie via le `<inject-host>` du composant `user-list` pour le style `user-list-item .item-name`)

## Principe de fonctionnement

Le composant `<inject-host>` injecte le contenu des balises `<style>` qu’il contient dans l’élément hôte du composant. Ainsi, les règles de style injectées peuvent franchir la frontière du composant et s’appliquer aux éléments à l’intérieur des slots.

De cette façon, vous pouvez :- Appliquer des styles aux éléments à n'importe quelle profondeur dans le contenu des slots
- Utiliser des chemins de sélecteurs complets pour garantir que les styles s'appliquent uniquement aux éléments cibles
- Maintenir l'encapsulation des styles du composant tout en permettant une perforation flexible des styles

## Remarques

⚠️ **Risque de pollution de style** : les styles injectés s’appliquent au scope de l’élément hôte et peuvent affecter des éléments d’autres composants. Lors de l’utilisation, respectez impérativement les principes suivants :

1. **Utiliser des sélecteurs spécifiques** : préférez un chemin complet de balises de composants et évitez les sélecteurs trop larges  
2. **Ajouter un préfixe d’espace de noms** : ajoutez un préfixe unique à vos classes de styles pour réduire les risques de conflit avec d’autres composants  
3. **Éviter les sélecteurs universels de balise** : utilisez plutôt des sélecteurs de classe ou d’attribut à la place des sélecteurs de balise  
4. **Réfléchir à la conception du composant** : envisagez d’optimiser la conception du composant pour éviter l’utilisation de `<inject-host>`. Par exemple, combiner sur le composant enfant le sélecteur [::slotted()](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Selectors/::slotted) est souvent plus élégant.

```html
<!-- 推荐 ✅：使用具体的选择器 -->
<!-- Recommandé ✅：utiliser des sélecteurs spécifiques -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 不推荐 ❌：使用过于通用的选择器 -->
<!-- Non recommandé ❌：utiliser des sélecteurs trop génériques -->
<inject-host>
    <style>
        .content {  /* 容易与其他组件冲突 */
            .content {  /* susceptible d'entrer en conflit avec d'autres composants */
            color: red;
        }
    </style>
</inject-host>
```

### Conseils de performance

Étant donné que `<inject-host>` déclenche la réinjection des styles de l'hôte, ce qui peut entraîner un reflow ou un repaint du composant, veuillez l'utiliser avec prudence dans des scénarios de mises à jour fréquentes.  
Si vous avez uniquement besoin de définir des styles pour les éléments de premier niveau à l'intérieur du slot, privilégiez l'utilisation du sélecteur de pseudo-classe [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted). Cela permet d'éviter les coûts de rendu supplémentaires liés à l'injection de type "percée", offrant ainsi de meilleures performances.