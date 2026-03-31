# Propriétés calculées

Les propriétés calculées sont un moyen de dériver de nouvelles données à partir de données réactives, elles se mettent à jour automatiquement en fonction des changements des données dont elles dépendent. Dans ofa.js, les propriétés calculées sont des méthodes spéciales définies dans l'objet `proto`, utilisant les mots-clés `get` ou `set` de JavaScript pour leur définition.

## Caractéristiques et avantages

- **Mise en cache** : le résultat d’une propriété calculée est mis en cache et n’est recalculé que lorsque ses données dépendantes changent
- **Réactivité** : lorsque les données dépendantes sont mises à jour, la propriété calculée se met à jour automatiquement
- **Déclaratif** : les dépendances sont créées de manière déclarative, rendant le code plus clair et plus lisible

## get propriété calculée

La propriété calculée get sert à dériver une nouvelle valeur à partir de données réactives ; elle n’accepte aucun paramètre et ne renvoie qu’une valeur calculée à partir d’autres données.

<o-playground name="exemple de propriété calculée get" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Cliquez-moi - {{count}} - {{countDouble}}</button>
      <p>La valeur de la propriété calculée countDouble est : {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble a été accédé');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Exemples de scénarios d'application réels

Les propriétés calculées sont souvent utilisées pour gérer des logiques de transformation de données complexes, telles que filtrer des tableaux, formater le texte affiché, etc. :

<o-playground name="Exemple de propriété calculée" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="Filtrer les noms...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['Zhang3', 'Li4', 'Wang54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set propriété calculée

set Les propriétés calculées vous permettent de modifier l’état des données sous-jacentes via une opération d’assignation. Elles reçoivent un paramètre, généralement utilisé pour mettre à jour en retour les données d’origine dont elles dépendent.

<o-playground name="Exemple de propriété calculée set" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>Valeur de base : {{count}}</p>
        <p>Valeur doublée : {{countDouble}}</p>
        <button on:click="resetCount">Réinitialiser le compteur</button>
        <button on:click="setCountDouble">Définir la valeur doublée à 10</button>
        <button on:click="incrementCount">Augmenter la valeur de base</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // assure que count ne soit pas négatif
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Propriétés calculées vs Méthodes

Bien que les méthodes puissent également réaliser des fonctions similaires, les propriétés calculées ont une caractéristique de mise en cache : elles ne sont réévaluées que lorsque les données dont elles dépendent changent, ce qui offre de meilleures performances.

```javascript
// Utiliser une propriété calculée (recommandé) - avec mise en cache
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Utiliser une méthode - s'exécute à chaque appel
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Remarques

1. **Éviter les opérations asynchrones** : Les propriétés calculées doivent rester synchrones et sans effets secondaires, il est interdit d'effectuer des appels asynchrones ou de modifier directement l'état du composant à l'intérieur.  
2. **Suivi des dépendances** : Veillez à ne dépendre que de données réactives, sinon les mises à jour seront imprévisibles.  
3. **Protection contre les erreurs** : Si une dépendance circulaire ou une affectation anormale survient à l'intérieur d'une propriété calculée, cela peut entraîner un échec de rendu, voire une boucle infinie. Il est essentiel de définir des conditions limites à l'avance et de bien gérer les exceptions.

## Exemples d'applications pratiques

Voici un exemple simple de validation de formulaire qui illustre l’utilité des propriétés calculées :

<o-playground name="Exemple de validation de formulaire" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>Exemple de validation simple</h3>
      <input type="text" sync:value="username" placeholder="Entrez un nom d'utilisateur (au moins 3 caractères)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Statut: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'Nom d'utilisateur valide' : 'Le nom d'utilisateur est trop court';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

