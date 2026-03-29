# Événements personnalisés

Dans ofa.js, outre les événements DOM intégrés, il est également possible de créer et d'utiliser des événements personnalisés pour реализовать взаимодействие между компонентами. Les événements personnalisés sont un mécanisme important dans le développement basé sur les composants, ils permettent aux composants de propager des messages ou des changements d'état vers le haut.

## méthode emit - déclencher des événements personnalisés

La méthode `emit` est utilisée pour déclencher des événements personnalisés, afin de notifier les écouteurs externes des changements d'état internes du composant ou des actions de l'utilisateur.

### Utilisation de base

```javascript
// Déclencher un événement personnalisé simple
this.emit('custom-event');

// Déclencher un événement personnalisé avec des données
this.emit('data-changed', {
  data: {
    // Données personnalisées, structure libre selon les besoins
    newValue: 100,
    oldValue: 50
  }
});
```

### Paramètres de la méthode emit

La méthode `emit` accepte deux paramètres :

1. **Nom de l'événement** : chaîne de caractères, désigne le nom de l'événement à déclencher
2. **Objet d'options** (facultatif) : contient les options de configuration de l'événement
   - `data` : données à transmettre
   - `bubbles` : booléen, contrôle si l'événement remonte (par défaut true)
   - `composed` : booléen, contrôle si l'événement peut traverser les limites du Shadow DOM
   - `cancelable` : booléen, contrôle si l'événement peut être annulé

Ensuite, l'élément parent peut utiliser la méthode `on` [(liaison d'événements)](./event-binding.md) pour écouter cet événement personnalisé.

### emit 示例 d'utilisation

<o-playground name="Exemple d'utilisation d'emit" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Cliquer pour déclencher l'événement</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'Le bouton a été cliqué',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - Mécanisme de propagation d'événements

L'attribut `bubbles` contrôle si l'événement remonte aux éléments parents. Lorsqu'il est défini à `true`, l'événement se propage le long de l'arbre DOM. La valeur par défaut est `true`. Si défini à `false`, l'événement ne remontera pas.

### Explication détaillée du mécanisme de bulles

- **Comportement par défaut** : Les événements émis avec `emit` sont par défaut en mode propagation (`bubbles: true`)
- **Chemin de propagation** : L'événement commence à partir de l'élément déclencheur et se propage vers le haut de manière hiérarchique
- **Arrêter la propagation** : Appeler `event.stopPropagation()` dans le gestionnaire d'événements permet d'arrêter la propagation

### Exemple de tri à bulles

<o-playground name="Exemple d'événement personnalisé" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Conteneur externe (écoute l'événement en propagation) : {{bubbledEventCount}} fois</p>
      <p>Composant interne (écoute l'événement direct) : {{directEventCount}} fois</p>
      <p>Données reçues : <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Déclencher un événement non propagé</button>
      <button on:click="triggerBubblingEvent">Déclencher un événement propagé</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Événement non propagé, seul l'écouteur direct le capturera
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Événement non propagé déclenché', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Événement propagé, remonte vers l'élément parent
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Événement propagé déclenché', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - 穿透 Shadow DOM 边界

La propriété `composed` contrôle si un événement peut traverser la frontière du Shadow DOM. C’est particulièrement important pour le développement de Web Components, et sa valeur par défaut est `false`.

### Détails du mécanisme de pénétration

- **Isolation du Shadow DOM** : Par défaut, les événements ne peuvent pas traverser les frontières du Shadow DOM
- **Activation de la traversée** : Définir `composed: true` permet aux événements de traverser les frontières du Shadow DOM
- **Cas d'utilisation** : Lorsqu'un composant doit émettre des événements vers l'environnement hôte, il est nécessaire de définir `composed: true`

### Exemple de pénétration

<o-playground name="Exemple d'événement personnalisé avec données" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Écoute de l'événement : {{bubbledEventCount}} fois</p>
      <p>Données reçues : <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Écoute de l'événement : {{bubbledEventCount}} fois</p>
      <p>Données reçues : <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Déclencher un événement non traversant</button>
      <button on:click="triggerComposedEvent">Déclencher un événement traversant</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Événement non traversant, seul l'auditeur direct le capture
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Événement non traversant déclenché', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Événement traversant, franchit la frontière Shadow DOM
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Événement traversant déclenché', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

