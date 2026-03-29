# Composant o-page

`o-page` est l’un des composants essentiels d’ofa.js, représentant une page indépendante ou un module de page. Voici quelques attributs et méthodes clés de `o-page` :

## Attribut src

L'attribut `src` est utilisé pour spécifier l'adresse spécifique du module de page. C'est un attribut clé pour définir le contenu et le comportement de la page, indiquant à l'application où charger le contenu de la page spécifique.

```javascript
const page = this;
```

## goto (méthode)

La méthode `goto` sert à naviguer depuis la page actuelle vers une autre page. Par rapport à la méthode `goto` de `app`, celle de `page` peut utiliser une **adresse relative** pour naviguer vers d'autres pages.

```javascript
page.goto("./page2.html");
```

## Méthode replace

La méthode `replace` sert à remplacer la page actuelle par une autre. Elle est similaire à la méthode `replace` de l'`app`, mais effectue le remplacement à l'intérieur de la page.

```javascript
page.remplacer("./new-page.html");
```

## méthode back

La méthode `back` est utilisée pour revenir à la page précédente. Cela permet de naviguer vers la page précédente, similaire à l'action de retour du navigateur.

```javascript
page.back();
```