# Micro-application

Utilisez `o-app` pour l'applicationisation, cette balise représente une micro-application, elle chargera le fichier de configuration `app-config.js`, ce fichier définit l'adresse de la page d'accueil et la configuration de l'animation de changement de page.

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

<o-playground name="Exemple de micro-application" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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

## accueil - adresse de la page d'accueil

Spécifiez le chemin du module de la page d'accueil chargé au démarrage de l'application, prend en charge les chemins relatifs et absolus.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Animation de changement de page

Contrôle l'effet d'animation de transition lors du changement de page, comprenant trois états :

| État | Description |
|------|------|
| `current` | Style après la fin de l'animation de la page actuelle |
| `next` | Style initial à l'entrée de la nouvelle page |
| `previous` | Style cible au départ de l'ancienne page |```javascript
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

## Méthode de passage de paramètres

Dans `o-app`, la navigation de page prend en charge la transmission de paramètres via l'URL Query, et la page cible les reçoit via le paramètre `query` de la fonction du module.

## Navigation de la page

Dans o-app, chaque module de page peut utiliser la balise `<a>` avec l'attribut `olink` pour effectuer la navigation entre les pages. Cette balise déclenche la transition de route de l'application, avec une animation de transition, sans recharger la page entière.

```html
<a href="./about.html" olink>Aller à la page À propos</a>
```

Dans le composant de page, vous pouvez utiliser la méthode `back()` pour revenir à la page précédente :

```html
<template page>
  <button on:click="back()">Retour</button>
</template>
```