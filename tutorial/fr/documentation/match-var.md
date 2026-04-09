# Requêtes de style

`match-var` est un composant fonctionnel dans ofa.js utilisé pour la correspondance de styles en fonction des variables CSS. Avec `match-var`, vous pouvez dynamiquement faire correspondre et appliquer différents styles en fonction des valeurs des variables CSS du composant actuel. Cette fonctionnalité est spécifiquement conçue pour la transmission d'états de contexte liés au style, sans nécessiter l'utilisation de JavaScript, ce qui la rend plus pratique à utiliser et adaptée aux besoins de transmission de styles tels que les couleurs de thème.

## Concepts clés

- **match-var** : Composant de correspondance de style, qui détermine s'il faut appliquer le style interne en fonction de la valeur de la variable CSS
- **Correspondance d'attributs** : Définir les variables CSS à faire correspondre et les valeurs attendues via les attributs du composant
- **Application de style** : En cas de correspondance réussie, les styles de la balise `<style>` interne seront appliqués au composant

## Utilisation de base

Le composant `match-var` définit les variables CSS à faire correspondre et les valeurs attendues via des attributs. Lorsque la valeur de la variable CSS du composant correspond à la valeur d'attribut spécifiée, les styles définis en interne sont appliqués.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Attributs

Le composant `match-var` utilise des attributs arbitraires pour définir les règles de correspondance des variables CSS. Le nom de l'attribut correspond au nom de la variable CSS (sans le préfixe `--`), et la valeur de l'attribut est la valeur attendue pour la correspondance.

### Comment ça marche

1. **Prise en charge du navigateur** : Si le navigateur prend en charge la requête `@container style()`, il utilisera directement la capacité native du CSS
2. **Traitement de dégradation** : S'il n'est pas pris en charge, il détectera les changements de valeur des variables CSS par interrogation, et injectera dynamiquement les styles après une correspondance réussie
3. **Rafraîchissement manuel** : Vous pouvez déclencher manuellement la détection de style via la méthode `$.checkMatch()`

## Exemple de base

<o-playground name="Exemple de base" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">Basculer le thème</button> - Thème : {{currentTheme}}
      <div class="container">
        <theme-box>
          Afficher différents styles selon la variable CSS
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Afficher le thème clair
        </theme-box>
        <theme-box style="--theme: dark;">
          Afficher le thème sombre
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Correspondance multicritère

Vous pouvez utiliser plusieurs attributs simultanément pour définir des conditions de correspondance plus complexes, et les styles ne seront appliqués que lorsque toutes les variables CSS correspondent.

```html
<match-var theme="sombre" taille="grande">
  <style>
    :host {
      rembourrage: 20px;
      taille-de-police: 18px;
    }
  </style>
</match-var>
```

## Exemple de correspondance multi-conditions

<o-playground name="Exemple de correspondance d'attributs" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>Thème : {{theme}} <button on:click="changeTheme">Changer le thème</button></div>
      <div>Taille : {{size}} <button on:click="changeSize">Changer la taille</button></div>
      <div class="content">
        <test-card>
          <div>Exemple de correspondance de styles multi-conditions</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch Actualisation manuelle

Dans certains cas, les changements des variables CSS peuvent ne pas être détectés automatiquement ; vous pouvez alors appeler manuellement la méthode `$.checkMatch()` pour déclencher la détection des styles.

> Firefox ne prend pas encore en charge la requête `@container style()`, il est donc nécessaire d'appeler manuellement `$.checkMatch()` ; une fois que la prise en charge native sera disponible dans les navigateurs, le système détectera automatiquement les changements de variables, sans avoir besoin de les déclencher manuellement.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Déclencher manuellement la détection de style
    $.checkMatch();
  }
}
```

## Bonnes pratiques

1. **Privilégier les capacités natives de CSS** : `match-var` utilise en priorité la requête native `@container style()` du navigateur, offrant de meilleures performances dans les navigateurs modernes  
2. **Organiser les styles de manière logique** : regrouper les styles correspondants pour faciliter la maintenance et la compréhension  
3. **Utiliser la liaison data()** : combiner avec la directive `data()` permet de basculer les styles de manière réactive