# Liaison de classes et de styles

Dans ofa.js, vous pouvez gérer dynamiquement les états de l’interface utilisateur en liant des noms de classe, des styles et des attributs de manière flexible. Cela permet à l’interface de s’adapter automatiquement à l’apparence selon les changements des données.

## Liaison de classes

La liaison de classes permet d'ajouter ou de supprimer dynamiquement des classes CSS selon l'état des données. Vous pouvez utiliser la syntaxe `class:className="booleanExpression"` pour lier une classe spécifique.

Lorsque `booleanExpression` est `true`, le nom de classe est ajouté à l'élément ; lorsqu'il est `false`, le nom de classe est supprimé.

### Liaison de classe de base

<o-playground name="Liaison de classe de base" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Basculer l'affichage</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Liaisons de classes multiples

Vous pouvez également lier plusieurs classes simultanément, permettant à l'élément d'avoir différents états visuels selon diverses conditions.

<o-playground name="Liaisons de plusieurs classes" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Inverser les états</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        État actuel - Actif : {{isActive}}, Désactivé : {{isDisabled}}, Surligné : {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Liaison de styles

La liaison de style vous permet de définir directement les valeurs de style en ligne, prenant en charge les mises à jour dynamiques. ofa.js propose deux méthodes de liaison de style :

### Liaison d'attribut de style unique

Utilisez la syntaxe `:style.propertyName` pour lier des propriétés de style spécifiques.

<o-playground name="Liaison d'attribut de style unique" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Basculer la couleur</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Bonjour du code démo ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Liaison d'attributs multi-styles

Vous pouvez également lier plusieurs propriétés de style en une seule fois :

<o-playground name="Liaison de propriétés de style multiples" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Exemple de style dynamique
      </p>
      <button on:click="changeStyles">Changer les styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Liaison d'attributs

En plus de la liaison de classes et de styles, vous pouvez également lier dynamiquement d'autres attributs HTML. ofa.js utilise la syntaxe `attr:nomAttribut` pour réaliser la liaison d'attributs.

### Liaison de propriétés de base

<o-playground name="Liaison de propriétés de base" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Changer la couleur</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "Ceci est un message d'info-bulle",
              val: "Survolez-moi pour voir le titre",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Gestion des attributs booléens

Pour les attributs de type booléen (tels que `disabled`, `hidden`), ofa.js décidera d'ajouter ou non cet attribut en fonction de la véracité de la valeur liée.

<o-playground name="Traitement des attributs booléens" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Fonctions de données dans les balises de style

Vous pouvez utiliser `data(xxx)` dans les styles pour lier les données du composant. Cela est particulièrement adapté aux scénarios où les styles doivent être modifiés dynamiquement en fonction des données du composant.

<o-playground name="Fonction de données dans les balises de style" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p:hover{
          color:red;
        }
      </style>
      <style>
        p {
          font-size: data(size);
          color:green;
          transition: all data(time)s ease;
        }
      </style>
      Taille de police : <input type="number" sync:value="size" placeholder="Ceci est une zone de saisie à liaison bidirectionnelle" />
      <br />
      Temps de transition : <input type="number" step="0.3" min="0" sync:value="time" placeholder="Ceci est une zone de saisie à liaison bidirectionnelle" />
      <p>{{val}} - taille : {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Remarques

Le principe de `data(xxx)` dans `style` est de remplacer l'intégralité du contenu du style. Il est donc préférable de ne placer que les styles liés aux données dans ce style, et de mettre les styles qui n'en ont pas besoin dans un autre style, ce qui améliore les performances.

```html
<!-- ❌ Les p:hover sans data(xxx) seront également rafraîchis -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ Seules les propriétés qui comportent data(xxx) seront re-rendues -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```