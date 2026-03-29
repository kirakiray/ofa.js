# Liaison d'événements

Dans ofa.js, la liaison d'événements est un mécanisme important pour réaliser l'interaction utilisateur. Vous pouvez lier des gestionnaires d'événements aux éléments de plusieurs manières, afin de répondre aux actions de l'utilisateur.

## Lier des événements depuis proto

C'est la méthode recommandée pour la liaison d'événements, adaptée à une logique de traitement d'événements complexe. Définir la fonction de gestion d'événements dans l'objet `proto` permet de mieux organiser la logique du code et facilite la maintenance et la réutilisation.

<o-playground name="Lier un événement depuis proto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Exécuter directement la fonction

Pour des opérations simples (comme l'incrémentation d'un compteur, la bascule d'un état, etc.), vous pouvez écrire directement de courtes expressions dans les attributs d'événement. Cette approche est concise et claire, adaptée au traitement de logiques simples.

<o-playground name="Exécuter la fonction directement" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Types d’événements pris en charge

ofa.js prend en charge tous les événements DOM standard, y compris mais sans se limiter à :

- Événements de souris : `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, etc.
- Événements de clavier : `keydown`, `keyup`, `keypress`, etc.
- Événements de formulaire : `submit`, `change`, `input`, `focus`, `blur`, etc.
- Événements tactiles : `touchstart`, `touchmove`, `touchend`, etc.

ofa.js prend en charge les mêmes types d'événements que les événements DOM natifs ; pour plus de détails, veuillez consulter la [documentation des événements MDN](https://developer.mozilla.org/fr/docs/Web/API/Event).

## Passer des paramètres aux gestionnaires d'événements

Vous pouvez également passer des paramètres aux gestionnaires d'événements :

<o-playground name="Passer des paramètres aux gestionnaires d'événements" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Ajouter 5 - Actuel : {{count}}</button>
      <button on:click="addNumber(10)">Ajouter 10 - Actuel : {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Accéder à l'objet d'événement

Dans le gestionnaire d'événements, vous pouvez accéder à l'objet d'événement natif via le paramètre `event` :

<o-playground name="Accéder à l'objet événement" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Cliquez n'importe où pour voir les coordonnées</div>
      <p>X : {{x}}, Y : {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Vous pouvez également accéder à l’objet d’événement natif via le paramètre `$event` dans l’expression, par exemple pour obtenir les coordonnées d’un clic de souris :

```html
<div class="container" on:click="handleClick($event)">Cliquez n'importe où pour voir les coordonnées</div>
```

## Écouter les événements personnalisés

En plus d'écouter les événements DOM natifs, vous pouvez également facilement écouter les événements personnalisés émis par les composants :

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

Pour approfondir vos connaissances sur les événements personnalisés, veuillez consulter le chapitre [Événements personnalisés](custom-events.md). Il est recommandé de progresser dans l'ordre du tutoriel ; les contenus suivants se développeront naturellement. Bien entendu, vous pouvez également le consulter à tout moment pour une maîtrise préalable.