# Application à page unique

Une application à page unique lie le composant `o-app` à la barre d'adresse du navigateur, afin de synchroniser l'URL de la page avec le chemin des pages au sein de l'application. Après avoir activé l'application à page unique :

- Rafraîchir la page permet de conserver l’état actuel de la route
- Copier l’URL de la barre d’adresse et l’ouvrir dans un autre navigateur ou onglet restaure également l’état de l’application
- Les boutons Précédent/Suivant du navigateur fonctionnent normalement

## Utilisation de base

Utilisez le composant officiel `o-router` pour envelopper le composant `o-app`, afin de réaliser une application à page unique.

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>test de routeur</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## Attribut fix-body

Après l’ajout de l’attribut `fix-body`, `o-router` réinitialise automatiquement les styles de `html` et `body`, éliminant les marges et les rembourrages par défaut.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

Cela est particulièrement utile dans les cas suivants :- nécessite que `o-app` remplisse entièrement la fenêtre
- lorsque l’application est le seul contenu de la page

## Exemple



<o-playground name="Exemple d'application monopage" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // URL de la page d'accueil de l'application
    export const home = "./home.html";
    // Configuration de l'animation de transition des pages
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
      <a href="./about.html" olink>Aller à À propos</a>
      <br>
      <br>
      <button on:click="gotoAbout">Bouton Aller à À propos</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Bonjour Démo d'application ofa.js",
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
      <div style="padding: 8px;"> <button on:click="back()">Retour</button> </div>
      <p> À propos de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Bonjour Démo d'application ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Principe de fonctionnement

Applications à page unique implémentées via le mode Hash du navigateur :

1. Lorsqu’un changement de page se produit dans l’application, `o-router` met automatiquement à jour la valeur de hash dans la barre d’adresse (par exemple `#/about.html`)
2. Lorsque l’utilisateur actualise la page ou y accède via l’URL, `o-router` lit la valeur de hash et charge la page correspondante
3. Les boutons Précédent/Suivant du déclenchent une modification du hash, contrôlant ainsi la navigation dans l’application

## Exemple de changement d'URL

Supposons que l'application comporte deux pages `home.html` et `about.html` :

| Opération utilisateur | Changement dans la barre d’adresse |
|---------|-----------|
| Ouvrir l’application | `index.html` → `index.html#/home.html` |
| Naviguer vers la page À propos | `index.html#/home.html` → `index.html#/about.html` |
| Cliquer sur Retour | `index.html#/about.html` → `index.html#/home.html` |
| Actualiser la page | Conserver le hash actuel |## Limites d'utilisation

- Une application monopage ne peut être utilisée qu'avec **un** seul composant `o-app`