# Cycle de vie

ofa.js dispose de fonctions de cycle de vie complètes, vous permettant d'exécuter une logique spécifique à différentes étapes du composant. Ces fonctions de crochet vous permettent d'intervenir et d'exécuter les opérations correspondantes à des moments clés tels que la création, le montage, la mise à jour et la destruction du composant.

## Fonctions de hook du cycle de vie

ofa.js fournit les hooks de cycle de vie principaux suivants, classés dans l’ordre d’usage courant :

### attached



Le crochet `attached` est appelé lorsque le composant est inséré dans le document, indiquant que le composant a été monté dans la page. C’est le crochet de cycle de vie le plus utilisé, généralement employé pour effectuer des opérations d’initialisation qui doivent attendre que le composant soit réellement affiché, évitant ainsi des calculs inutiles tant qu’il n’est pas visible. Ce crochet est également idéal pour mesurer les dimensions des éléments, démarrer des animations ou toute autre action dépendant du fait que le composant est déjà rendu dans la page.

- **Moment d’appel** : le composant est ajouté à l’arbre DOM
- **Usage principal** : démarrer des minuteries, ajouter des écouteurs d’événements, exécuter des opérations nécessitant la visibilité

### detached



Le hook `detached` est appelé lorsque le composant est retiré du document, indiquant qu’il va être démonté. Ce hook est approprié pour nettoyer les ressources, comme annuler les minuteries ou supprimer les écouteurs d’événements.

- **Moment d'appel** : le composant est retiré de l'arbre DOM
- **Usage principal** : nettoyer les ressources, annuler les abonnements, supprimer les écouteurs d'événements

### ready



Le hook `ready` est appelé lorsque le composant est prêt, à ce moment le template du composant est déjà rendu, les éléments DOM sont créés, mais ils ne sont peut-être pas encore insérés dans le document. Ce hook est adapté pour effectuer des manipulations DOM ou initialiser des bibliothèques tierces.

- **Moment d'appel** : Le modèle de composant a été rendu, le DOM a été créé
- **Usage principal** : Exécuter des opérations d'initialisation dépendantes du DOM

### loaded



Le hook `loaded` se déclenche lorsque le composant et tous ses composants enfants ainsi que les ressources asynchrones sont entièrement chargés ; à ce moment-là, il est sûr de retirer l’état de chargement ou d’exécuter des opérations ultérieures dépendant de l’arbre complet des composants. S’il n’y a pas de dépendance, il est appelé après le hook `ready`.

- **Moment d'appel** : Quand le composant et tous ses composants enfants sont entièrement chargés
- **Utilisation principale** : Exécuter des opérations qui dépendent d'un arbre de composants complet

## Ordre d'exécution du cycle de vie

Les hooks du cycle de vie du composant s'exécutent dans l'ordre suivant :

2. `ready` - Le composant est prêt (le DOM a été créé)
3. `attached` - Le composant est monté dans le DOM
4. `loaded` - Le composant est entièrement chargé

Quand un composant est retiré du DOM, le hook `detached` est appelé.

## Exemple d'utilisation

L'exemple ci-dessous montre comment utiliser les fonctions de cycle de vie dans un composant :

<o-playground name="Exemple de cycle de vie" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Démonstration du cycle de vie</h3>
      <div class="counter">Compteur : {{count}}</div>
      <button on:click="count += 10">Augmenter de 10</button>
      <button on:click="removeSelf">Supprimer le composant</button>
      <div class="log">
        <h4>Journal du cycle de vie :</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Se supprime du DOM pour déclencher le hook detached
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready : composant prêt, DOM créé");
              console.log("Composant prêt");
            },
            attached() {
              this.addLog("attached : composant monté dans le DOM");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Composant monté");
            },
            detached() {
              this.addLog("detached : composant retiré du DOM");
              // Nettoie le timer pour éviter les fuites mémoire
              clearInterval(this._timer); 
              console.log("Composant démonté");
            },
            loaded() {
              this.addLog("loaded : chargement complet du composant");
              console.log("Composant entièrement chargé");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, vous pouvez observer l'ordre d'exécution et le timing des différents hooks de cycle de vie. Lorsque vous cliquez sur le bouton "Supprimer le composant", vous pouvez voir que le hook `detached` est déclenché.

## Scénarios d'application pratiques

### Opération d'initialisation

Effectuer l'initialisation des données dans le hook `ready` :

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // Manipulation du DOM
      this.initDomElements();
    }
  };
};
```

### Gestion des ressources

Dans le hook `attached`, lancez un minuteur ; dans le hook `detached`, nettoyez les ressources :

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Démarrer le minuteur
      this.timer = setInterval(() => {
        console.log('Tâche planifiée exécutée');
      }, 1000);
    },
    detached() {
      // Nettoyer le minuteur
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Les fonctions de hook du cycle de vie sont un concept essentiel dans le développement des composants ofa.js ; leur utilisation appropriée vous permet de mieux gérer l'état et les ressources des composants, tout en améliorant les performances de l'application.

