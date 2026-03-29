# Micro-applications

Utilisez `o-app` pour l'applicationisation, cette balise représente une micro-application, elle chargera le fichier de configuration `app-config.js`, qui définit l'adresse de la page d'accueil de l'application et la configuration des animations de changement de page.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// Adresse de la page d'accueil de l'application
export const home = "./home.html";

// Configuration de l'animation de transition de page
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

<o-playground name="Exemple d'application micro" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // URL de la page d'accueil de l'application
    export const home = "./home.html";
    // Configuration de l'animation de changement de page
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html?id=10010" olink>Aller à About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Aller à About (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Retour</button> </div>
      <p>{{val}}</p>
      <p> À propos de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - Adresse de la page d'accueil

Spécifie le chemin du module de la page d'accueil chargée au démarrage de l'application, prenant en charge les chemins relatifs et absolus.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Animation de transition de page

Contrôler les effets d'animation de transition lors du changement de page, comprenant trois états :

| État | Description |
|------|------|
| `current` | Style après la fin de l'animation de la page actuelle |
| `next` | Style de départ lors de l'entrée de la nouvelle page |
| `previous` | Style cible lorsque l'ancienne page quitte |```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## Méthodes de passage de paramètres

Dans `o-app`, la navigation entre pages prend en charge la transmission de paramètres via URL Query, et la page cible reçoit les paramètres via le paramètre `query` de la fonction du module.

## Navigation de la page

Dans l'application o-app, chaque module de page peut utiliser la balise `<a>` avec l'attribut `olink` pour changer de page. Cette balise déclenche le changement de route de l'application, avec une animation de transition, sans rafraîchir la page entière.

```html
<a href="./about.html" olink>Aller à la page À propos</a>
```

Dans les composants de page, vous pouvez utiliser la méthode `back()` pour revenir à la page précédente :

```html
<template page>
  <button on:click="back()">Retour</button>
</template>
```