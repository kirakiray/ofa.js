# Introduction

## Qu'est-ce que ofa.js ?

ofa.js est un framework front-end Web facile à utiliser, spécialement conçu pour la construction d'applications Web, visant à améliorer l'efficacité de développement et à réduire le seuil d'entrée.

> Si vous êtes **déjà familier** avec HTML, CSS et JavaScript, alors ofa.js est un excellent choix.

## Pourquoi je développe ofa.js

L'intention de conception d'ofa.js est simple : résoudre les problèmes d'**ingénierie** du développement Web sans dépendre d'outils de compilation.

L'ingénierie logicielle consiste à intégrer de manière systématique les normes, les processus, les outils et les méthodes du développement logiciel, afin d'améliorer l'efficacité du développement, la qualité du code et la maintenabilité.

Au cours des dix dernières années, le développement front-end Web a connu une évolution allant d'une croissance initiale désordonnée à une progressive industrialisation. Ce processus s'est inspiré de l'expérience du développement d'applications traditionnelles, en introduisant Node.js et des flux de compilation pour résoudre les problèmes d'industrialisation des projets de grande envergure.

Cependant, lorsque le projet s'est agrandi, les inconvénients de ce modèle ont progressivement été révélés, entraînant le problème des **applications monolithiques** rencontré dans le développement traditionnel, ce qui rend le projet difficile à maintenir et les itérations des besoins d'interaction complexes.

> Une application monolithique (Monolithic Application) fait référence à une application unique, vaste et étroitement couplée, où tous les modules fonctionnels sont concentrés dans un seul dépôt de code. Un changement mineur peut affecter l'ensemble du système, rendant difficile le développement et le déploiement indépendants.

À ce moment-là, il faut décomposer le projet pour réaliser une micro-frontendisation, tout comme les **micro-services**. Mais en raison du traitement de compilation, la micro-frontend devient difficile et fastidieuse ; le déploiement indépendant des modules frontaux nécessite la compilation de chaque petit module, ce qui est très difficile, entraînant pratiquement un arrêt du développement des technologies frontales Web.

Les microservices (Microservices) sont un style d'architecture logicielle qui décompose des applications volumineuses et complexes en plusieurs petits services à granularité fine, déployés et exécutés indépendamment.

À ce moment-là, j'ai commencé à réfléchir : les langages de programmation traditionnels doivent s'adapter à différents matériels et systèmes d'exploitation, ils doivent donc être compilés pour réaliser une différenciation multiplateforme. Mais le développement Web est différent, il est basé sur le navigateur, il n'a pas besoin d'être compilé à l'origine, il peut fonctionner et être déployé indépendamment, et il est naturellement en mode micro-frontend. Alors j'ai réalisé que c'est le processus de compilation qui complique les choses.

Autrement dit, tant que les problèmes d'ingénierie sont résolus et que l'étape de compilation nécessaire est supprimée, le développement front-end est très adapté à la création d'applications à grande échelle, ce qui constitue un modèle natif de micro-frontends. C'est ainsi qu'ofa.js a vu le jour.

## Avantages clés

### Zéro seuil, prêt à l'emploi

Pas besoin de configurer un environnement de développement, d'installer des dépendances ou de configurer un échafaudage. Ouvrez simplement le programme de construction officiel via un navigateur, sélectionnez un répertoire local et commencez à développer. Toutes les opérations de calcul, de données et de stockage sont exécutées localement, sans dépendre de services cloud.

### AI convivial, facile à vérifier

Pas de boîte noire de compilation, le code produit par l'IA peut être déployé et auto-vérifié rapidement ; réduire les couches intermédiaires, éviter le processus de compilation, rend le code plus facile à localiser et à réparer les problèmes.

### Prise en charge native des micro-frontends

ofa.js permet au développement front-end Web d’être découpé, comme avec les micro-services, en plusieurs modules indépendants, chacun pouvant être développé et déployé séparément. Une fois les frontières du front-end Web traditionnel abolies, les technologies front-end franchiront progressivement les limites imposées par les technologies serveur.

## Commencer à utiliser

- Si vous avez des bases en développement, vous pouvez commencer par [Introduction aux scripts](./script-reference.md).
- Si vous êtes débutant, il est recommandé de commencer par [Créer votre première application](./create-first-app.md).