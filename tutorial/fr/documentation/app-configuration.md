# Configuration de l'application

`app-config.js` Le fichier de configuration prend également en charge davantage d’options de configuration, en plus de l’adresse de la page d’accueil et de l’animation de changement de page, pour contrôler l’état de chargement de l’application, la gestion des erreurs, la logique d’initialisation et les fonctions de navigation.

```javascript
// app-config.js
// Contenu affiché pendant le chargement
export const loading = () => "<div>Loading...</div>";

// Composant affiché en cas d'échec de chargement de la page
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Rappel une fois l'initialisation de l'application terminée
export const ready() {
  console.log("App is ready!");
}

// Méthodes et propriétés ajoutées au prototype de l'application
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="Exemple de configuration de l'application" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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
</o-playground>

## loading - état de chargement

Le composant affiché pendant le chargement de la page, qui peut être un template de chaîne de caractères ou une fonction retournant un template.

```javascript
// Modèle de chaîne simple
export const loading = "<div class='loading'>Chargement...</div>";

// Génération dynamique avec une fonction
export const loading = () => {
  return `<div class='loading'>
    <span>Chargement...</span>
  </div>`;
};
```

Voici une implémentation de loading esthétique et prête à être copiée directement dans votre projet :

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - gestion des erreurs

Composant affiché lors de l’échec du chargement de la page ; la fonction reçoit un objet paramètre contenant `src` (l’adresse de la page ayant échoué) et `error` (le message d’erreur).

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Échec du chargement de la page</p>
    <p>Adresse : ${src}</p>
    <button on:click="back()">Retour</button>
  </div>`;
};
```

## proto - Extension du prototype

Ajoutez des méthodes et des propriétés calculées personnalisées à l’instance de l’application, accessibles dans les composants de page via `this.app`.

```javascript
export const proto = {
  // Méthode personnalisée
  navigateToHome() {
    this.goto("home.html");
  },
  // Propriété calculée
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

Dans la page, appelez :

```html
<template page>
  <button on:click="app.navigateToHome()">Retour à l'accueil</button>
  <p>Est à l'accueil : {{app.isAtHome}}</p>
</template>
```

## ready - callback d'initialisation

Fonction de rappel exécutée après le chargement de la configuration de l'application, où vous pouvez effectuer des opérations d'initialisation. Vous pouvez accéder aux méthodes et propriétés de l'instance de l'application via `this`.

```javascript
export const ready() {
  console.log("L'application est initialisée");
  // peut accéder à this (instance de l'élément o-app)
  console.log(this.current); // obtient l'instance de l'élément o-page de la page actuelle
  // this.someMethod();
}
```

## allowForward - Fonction d'avancement

Contrôle l'activation de la fonction de navigation en avant du navigateur. Lorsque défini sur `true`, les boutons Précédent et Suivant du navigateur peuvent être utilisés pour naviguer.

```javascript
export const allowForward = true;
```

Une fois activé, l'utilisateur peut naviguer à l'aide des boutons Précédent/Suivant du navigateur, et la méthode de navigation `forward()` de l'application prendra également effet.

## Navigation programmatique

En plus d’utiliser des liens `olink`, vous pouvez également appeler des méthodes de navigation dans JavaScript :

```javascript
// Aller à la page spécifiée (ajoute à l'historique)
this.goto("./about.html");

// Remplacer la page actuelle (n'ajoute pas à l'historique)
this.replace("./about.html");

// Retour à la page précédente
this.back();

// Avancer à la page suivante (nécessite allowForward: true)
this.forward();
```

## Historique de routage

L'attribut `routers` permet d'obtenir l'historique de navigation :

```javascript
// Obtenir tout l'historique des routes
const history = app.routers;
// Format de retour: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Obtenir la page actuelle
const currentPage = app.current;
```

## Écouter les changements de route

On peut écouter l’événement `router-change` pour réagir aux changements de route :

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Changement de route :", data.name); // goto, replace, forward, back
  console.log("Adresse de la page :", data.src);
});
```