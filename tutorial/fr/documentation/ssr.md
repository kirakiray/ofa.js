# SSR et rendu isomorphe

> Si vous ne savez pas ce qu'est le SSR, cela signifie que vous n'en avez pas besoin pour l'instant. Vous pouvez passer ce chapitre et revenir l'étudier plus tard lorsque vous en aurez besoin.

## Rendu isomorphe

Afin de conserver simultanément l’expérience fluide du CSR, une meilleure reconnaissance par les robots d’indexation (SEO) et un choix plus libre du langage de développement backend, ofa.js propose un mode de rendu isomorphe unique (Symphony Client-Server Rendering).

> Pour connaître les définitions et les différences précises entre CSR / SSR / SSG, veuillez lire directement la dernière section de cet article.

Le concept central du rendu isomorphe est :- Rendu initial du contenu côté serveur, garantissant le SEO et la vitesse de chargement de la première page
- Prise en charge du routage côté client, préservant l’expérience utilisateur fluide du CSR
- Compatible avec tout environnement serveur, réalisant un rendu isomorphique véritable

### Principe de mise en œuvre du rendu isomorphe

ofa.js 的 同构渲染模式基于以下机制：

1. Le serveur génère une page HTML complète avec une structure d'exécution universelle
2. Le client charge le moteur d'exécution CSR
3. Reconnaissance automatique de l'environnement d'exécution actuel pour déterminer la stratégie de rendu

### Structure du code de rendu isomorphique

**Module de page CSR original :**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Page complète après encapsulation du rendu isomorphique :**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Titre de la page</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 页面模块内容插入位置 ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>Je suis la Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

Ainsi, vous pouvez utiliser n'importe quel langage de développement (Go, Java, PHP, Nodejs, Python, etc.), n'importe quel moteur de rendu de templates backend (comme `html/template` de Go, Smarty/Twig/Blade de PHP, etc.), pour intégrer la structure de code de rendu isomorphe d'ofa.js dans le template, et ainsi réaliser le SSR.

* [Exemple SSR Nodejs](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [Exemple SSR PHP](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Exemple SSR Go](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Structure de modèle de rendu isomorphe

Pour implémenter le mode de rendu isomorphe, il suffit d’utiliser la structure de modèle universelle suivante côté serveur :

```html
<!doctype html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Titre de la Page</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Contenu du module de page correspondant inséré dynamiquement -->
  </o-app>
</body>

</html>
```

**Note :** Le HTML renvoyé par le serveur doit définir le bon en-tête HTTP : `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` est le moteur d’exécution de rendu isomorphe fourni par ofa.js ; il détermine automatiquement la stratégie de rendu en fonction de l’état d’exécution de la page actuelle, garantissant ainsi la meilleure expérience utilisateur dans n’importe quel environnement.

De la même manière, SSG peut également appliquer cette structure pour générer des sites statiques.

## Différences entre ofa.js et SSR ainsi que d'autres frameworks front-end

Le rendu client-serveur Symphony (ci-après SCSR) de ofa.js est essentiellement un mode SSR.

Comparé aux solutions SSR existantes des frameworks front-end comme Vue, React, Angular, le plus grand avantage d'ofa.js est qu'il **ne nécessite pas de liaison obligatoire à Node.js**. Cela signifie que n'importe quel moteur de rendu de templates backend (comme Smarty pour PHP, Jinja2 pour Python, Thymeleaf pour Java, etc.) peut facilement intégrer ofa.js pour réaliser le SSR.

## Vue d'ensemble des méthodes de rendu de pages web

Les applications web modernes utilisent principalement quatre méthodes de rendu : le rendu côté serveur avec moteur de gabarits traditionnel, le CSR (Client Side Rendering, rendu côté client), le SSR (Server Side Rendering, rendu côté serveur) et le SSG (Static Site Generation, génération de site statique). Chaque méthode présente ses avantages et ses scénarios d’utilisation adaptés.

### Rendu par moteur de template côté serveur traditionnel

Parmi les nombreux produits Web, les moteurs de templates côté serveur restent le moyen de rendu de pages le plus répandu. Les langages backend comme Go et PHP utilisent des moteurs de templates intégrés ou tiers (tels que `html/template` pour Go, Smarty/Twig/Blade pour PHP, etc.) pour injecter des données dynamiques dans des templates HTML, générer des pages HTML complètes en une seule fois et les retourner au client.

**Avantages :**- SEO friendly, chargement rapide de la première page
- Contrôle côté serveur, sécurité relativement élevée
- Faibles exigences pour la pile technologique de l'équipe, les développeurs backend peuvent effectuer le développement de manière indépendante

**Inconvénients :**- Mauvaise expérience utilisateur : chaque interaction nécessite un rafraîchissement de la page
- Forte pression sur le serveur
- Couplage élevé entre le front-end et le back-end, défavorable à la collaboration et à la division du travail

### CSR (rendu côté client)

En mode CSR, le contenu de la page est entièrement rendu par JavaScript côté navigateur, et l'[application à page unique](./routes.md) d'ofa.js en est une mise en œuvre typique. Cette approche offre une expérience utilisateur fluide, permettant de réaliser toutes les interactions sans nécessiter de rechargement de page. Les applications monopages (SPA) développées avec React ou Vue et leurs bibliothèques de routage correspondantes (comme React Router ou Vue Router) sont toutes des exemples classiques de mise en œuvre CSR.

**Avantages :**- Expérience utilisateur fluide, changement de page sans rafraîchissement
- Forte capacité de traitement côté client, réponse rapide

**Inconvénients :**- N'est pas favorable au SEO, les moteurs de recherche ont du mal à indexer le contenu

### SSR（Rendu côté serveur）

En conservant l'expérience fluide du CSR, le rendu des pages est assurée par le serveur en temps réel : lorsque l'utilisateur fait une requête, le serveur génère instantanément le HTML complet et le renvoie, réalisant ainsi un véritable rendu côté serveur.

**Avantages :**- Convivial pour le SEO, chargement rapide de la première écran
- Prise en charge du contenu dynamique

**Inconvénients :**- Forte charge sur le serveur
- Nécessite généralement un environnement Node.js comme runtime, ou au moins une couche intermédiaire Node.js
- Nécessite encore une activation côté client ultérieure pour une interaction complète

### GSS (Génération de Site Statique)

À la phase de construction, toutes les pages sont pré-rendues en fichiers HTML statiques et, après déploiement, peuvent être directement renvoyées aux utilisateurs par le serveur.

**Avantages :**- Chargement initial rapide, convivial pour le SEO
- Faible charge serveur, performance stable
- Haute sécurité

**Inconvénients :**- Difficulté de mise à jour du contenu dynamique
- Temps de construction augmentant avec le nombre de pages