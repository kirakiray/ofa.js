# PATH



L'attribut `PATH` est généralement utilisé sur des composants personnalisés ou des composants de page pour obtenir l'adresse du fichier du composant enregistré. Cela peut vous aider, pendant le développement, à connaître l'origine du composant, notamment lorsque vous devez référencer ou charger d'autres fichiers de ressources ; vous pouvez alors utiliser l'attribut `PATH` pour construire le chemin du fichier.

Voici un exemple simple démontrant comment utiliser la propriété `PATH` dans un composant personnalisé :

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

Dans cet exemple, nous avons sélectionné un élément `my-comp` avec un `id` de "myCustomComponent", puis nous avons obtenu le chemin du fichier de ce composant personnalisé via l'attribut `PATH`. Vous pouvez utiliser la variable `componentPath` dans la partie script selon vos besoins, par exemple, pour construire des chemins vers d'autres fichiers de ressources ou pour effectuer d'autres opérations.