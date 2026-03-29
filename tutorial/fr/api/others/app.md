# Composant o-app

`o-app` est l’un des composants principaux d’ofa.js, utilisé pour configurer et gérer l’ensemble de l’application. Voici quelques attributs et méthodes clés de l’app :

## src



L'attribut `src` est utilisé pour spécifier l'adresse exacte du module de configuration des paramètres de l'application.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



La propriété `current` sert à obtenir l'instance de la page en cours d'affichage. Cela vous permet d'accéder à la page actuellement affichée et d'effectuer des opérations dessus, par exemple mettre à jour son contenu ou exécuter des actions spécifiques.

```javascript
const currentPage = app.current;
```

## goto



La méthode `goto` sert à sauter vers la page spécifiée. Vous pouvez transmettre l’adresse de la page cible, l’application chargera et affichera cette page. C’est une méthode importante pour la navigation dans l’application.

```javascript
app.goto("/page2.html");
```

## replace



La méthode `replace` est similaire à `goto`, mais elle sert à remplacer la page actuelle plutôt que d'ajouter une nouvelle page à la pile. Cela peut être utilisé pour implémenter un remplacement de page plutôt qu'une navigation dans la pile.

```javascript
app.replace("/nouvelle-page.html");
```

## back



La méthode `back` est utilisée pour revenir à la page précédente, permettant une navigation arrière. Cela ramènera l'utilisateur à la page précédente.

```javascript
app.back();
```

## routers



La propriété "routers" contient les informations de configuration des itinéraires de l'application. C'est une propriété importante qui définit les règles et les correspondances d'itinéraire des différentes pages de l'application. La configuration des itinéraires détermine la navigation entre les pages et la façon dont les URL sont traitées.

```javascript
const routeConfig = app.routers;
```