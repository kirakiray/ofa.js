# Comprendre la liaison d'attributs

Dans le contenu précédent, nous avons présenté les bases de l'utilisation de la [liaison de propriétés](./property-binding.md). L'exemple précédent consistait à lier l'attribut value d'un élément natif du navigateur (comme `textarea`). Cette section approfondira l'exploration de la nature de la liaison de propriétés — elle lie en réalité aux propriétés JavaScript de l'instance du composant, et non aux attributs HTML.

## Mécanisme de liaison des propriétés des composants

Dans ofa.js, lorsque nous utilisons la syntaxe `:toProp="fromProp"` dans un composant parent, nous définissons une propriété JavaScript de l'instance du composant enfant, et non un attribut HTML. Cela constitue une différence importante par rapport à la définition directe d'un attribut HTML (comme `attr:toKey="fromKey"`).

L'exemple suivant montre comment transmettre des données à un composant personnalisé via la liaison d'attributs :

<o-playground name="Comprendre la liaison d'attributs" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Nom complet : {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple :- Les données `val` du composant parent sont liées à la propriété `fullName` du composant enfant `<demo-comp>`
- Utiliser la syntaxe `:full-name="val"` pour transmettre la valeur `val` du composant parent à la propriété `fullName` du composant enfant
- Après réception de cette valeur, le composant enfant l’affiche dans le modèle via `{{fullName}}`

## Liaison d'attributs vs Héritage d'attributs de caractéristiques

Il est important de noter que la liaison d'attributs (`:`) et l'héritage des attributs de caractéristiques (`attr:`) présentent les différences clés suivantes :

### Liaison de propriété (`:`)

- Propriétés JavaScript liées à l’instance du composant
- Les données transmises conservent leur type d’origine (chaîne, nombre, booléen, etc.)
- Elles sont directement accessibles et modifiables à l’intérieur du composant, sans même avoir à définir au préalable un `data` dans le composant

### Héritage des attributs de caractéristiques (`attr:`)

- Définir les attributs HTML
- Toutes les valeurs sont converties en chaînes de caractères
- Principalement utilisé pour transmettre des attributs aux éléments DOM sous-jacents
- Nécessite un traitement spécial pour analyser les données complexes
- Doit être défini à l'avance dans le composant avec `attrs` pour recevoir les valeurs d'attribut

Comparaison grammaticale :```html
<!-- Liaison d'attributs : transmettre des valeurs JavaScript, conserver les types de données -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Héritage d'attributs : définir des attributs HTML, toutes les valeurs sont converties en chaînes -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- Chaîne "42" réellement transmise -->
```

## Comparaison des cas et différences

<o-playground name="Comparaison des différences de cas" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Ici, `vone` est une propriété de l'instance du composant, `vtwo` est un attribut HTML, la valeur de l'attribut sera sélectionnée par le sélecteur `[vtwo]` et les styles seront appliqués, tandis que `vone` est une propriété de l'instance du composant, elle ne sera pas sélectionnée par le sélecteur `[vone]`.

## Liaison de données bidirectionnelle

Les composants instanciés prennent également en charge la liaison de données bidirectionnelle, en utilisant la syntaxe `sync:toProp="fromProp"`. La liaison bidirectionnelle permet la synchronisation des données entre le composant parent et le composant enfant ; lorsque les données changent d'un côté, l'autre côté est mis à jour en conséquence.

> Contrairement à Angular et Vue, ofa.js n'a pas besoin d'ajouter de configuration spéciale ou d'opérations supplémentaires aux composants pour prendre en charge nativement la syntaxe de liaison de données bidirectionnelle.

### Exemple de liaison bidirectionnelle

L'exemple ci-dessous montre comment établir une liaison de données bidirectionnelle entre un composant parent et un composant enfant :

<o-playground name="Exemple de liaison bidirectionnelle" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Valeur dans le composant parent : {{val}}</h3>
      <p>Modifier la valeur du composant parent via la zone de saisie :</p>
      <input type="text" sync:value="val" placeholder="Saisissez du texte dans la zone...">
      <p>Modifier la valeur du composant parent via le composant enfant :</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Valeur affichée par le composant enfant : {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="Saisissez dans la zone du composant enfant...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple :- Le `val` du composant parent et le `fullName` du composant enfant réalisent une liaison bidirectionnelle via `sync:full-name="val"`
- Lorsqu’on saisit du contenu dans le champ du composant parent, le composant enfant affiche immédiatement la nouvelle valeur
- Lorsqu’on saisit du contenu dans le champ du composant enfant, le composant parent se met également à jour et affiche la nouvelle valeur

### Différence entre la liaison bidirectionnelle et la liaison de propriété normale

| Caractéristique | Liaison d’attribut normale (`:`) | Liaison bidirectionnelle (`sync:`) |
|------|-------------------|-------------------|
| Flux de données | Unidirectionnel : parent → enfant | Bidirectionnel : parent ↔ enfant |
| Syntaxe | `:prop="value"` | `sync:prop="value"` |
| Modification du composant enfant | N’affecte pas le composant parent | Affecte le composant parent |
| Scénarios applicables | Le composant parent transmet la configuration au composant enfant | Synchronisation des données entre parent et enfant requise |### Remarques

1. **Considérations de performance** : La liaison bidirectionnelle déclenche un nouveau rendu lors des changements de données, elle doit être utilisée avec prudence dans des scénarios complexes.
2. **Contrôle du flux de données** : Un excès de liaisons bidirectionnelles peut rendre le flux de données difficile à suivre, il est recommandé de concevoir judicieusement les modes de communication entre les composants.
3. **Compatibilité des composants** : Tous les composants ne sont pas adaptés à l'utilisation de la liaison bidirectionnelle, il faut tenir compte de l'objectif de conception du composant.