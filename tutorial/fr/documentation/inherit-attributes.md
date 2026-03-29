# Transférer les attributs de caractéristiques

Dans ofa.js, les [attributs (Attribute)](https://developer.mozilla.org/fr/docs/Web/API/Element/attributes) sont l'un des moyens les plus couramment utilisés pour transmettre des données entre les composants. Il suffit de déclarer les attributs nécessaires dans l'objet `attrs` du composant pour pouvoir transmettre des données externes à l'intérieur du composant lors de l'utilisation du composant.

## Utilisation de base

### Définir les propriétés de réception

Avant d'utiliser un composant, il est nécessaire de déclarer les attributs à recevoir dans l'objet `attrs` du composant. Les attributs peuvent avoir des valeurs par défaut.

<o-playground name="Exemple d'utilisation de base" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="Exemple de composant OFA"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="Cas d'utilisation NoneOS"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Prénom : {{first}}</p>
      <p>Nom complet : {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Règles importantes

1. **Restrictions de type** : la valeur de l’attribut transmise doit être une chaîne de caractères ; les autres types seront automatiquement convertis en chaîne.

2. **Conversion de nommage** : comme les attributs HTML ne tiennent pas compte de la casse, lorsqu’un attribut contient des majuscules, il faut utiliser la séparation par `-` (format kebab-case).
   - Exemple : `fullName` → `full-name`

3. **Définition obligatoire** : si le composant ne définit pas l’attribut correspondant dans l’objet `attrs`, il ne peut pas recevoir cet attribut. La valeur définie est la valeur par défaut ; pour ne pas avoir de valeur par défaut, définir `null`.

<o-playground name="Exemple de règles importantes" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="张三" age="25"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Nom d'utilisateur : {{userName}}</p>
      <p>Âge : {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "Nom par défaut",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Transmission d'Attribut en Syntaxe de Modèle

Dans le template du composant, vous pouvez utiliser la syntaxe `attr:toKey="fromKey"` pour transmettre les données `fromKey` du composant actuel à l'attribut `toKey` du composant enfant.

<o-playground name="Exemple de transmission d'attributs" style="--editor-height: 500px">
  <code path="demo.html" preview>
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
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
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
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Transmission multi-niveaux

Vous pouvez transmettre des attributs couche par couche via des composants imbriqués sur plusieurs niveaux.

Si un composant dépend d'autres composants, il est nécessaire d'importer les modules des autres composants dans le composant.

<o-playground name="Exemple de transmission multi-niveaux" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="Données de niveau supérieur"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>Composant externe reçoit : {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>Composant interne reçoit : {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

