# Écouteurs

L'écouteur (Watcher) est une fonctionnalité dans ofa.js utilisée pour surveiller les changements de données et exécuter la logique correspondante. Lorsque les données réactives changent, l'écouteur déclenche automatiquement une fonction de rappel, vous permettant d'exécuter des tâches telles que la transformation de données, des opérations d'effets secondaires ou un traitement asynchrone.

## Utilisation de base

Les observateurs sont définis dans l'objet `watch` du composant, où la clé correspond au nom de la propriété de données à surveiller, et la valeur est la fonction de rappel exécutée lorsque les données changent.

<o-playground name="watchers - utilisation de base" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Paramètres de la fonction de rappel

La fonction de rappel du listener reçoit deux paramètres :- `newValue`：la nouvelle valeur après le changement
- `{watchers}`：l’ensemble des objets observateurs du composant actuel

Après un changement de données, un traitement anti-rebond est effectué avant d'exécuter le callback dans `watch` ; le paramètre `watchers` représente l'ensemble de tous les changements fusionnés au cours de cette période anti-rebond.

Les fonctions dans `watch` sont appelées immédiatement après l'initialisation du composant, afin d'établir l'écoute des données. On peut distinguer s'il s'agit du premier appel en vérifiant si `watchers` possède une longueur.

<o-playground name="watchers - 回调参数" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>Prénom : {{name}}</p>
      <p>Âge : {{age}}</p>
      <input sync:value="name" placeholder="Entrez le prénom" />
      <input sync:value="age" type="number" placeholder="Entrez l’âge" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "Zhang San",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                this.log += `Propriété « ${watcher.name} » passée de « ${watcher.oldValue} » à « ${watcher.value} »\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                this.log += `Propriété « ${watcher.name} » passée de « ${watcher.oldValue} » à « ${watcher.value} »\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Écoute en profondeur

Pour les données imbriquées de type objet ou tableau, la surveillance automatique en profondeur est activée dans watch.

<o-playground name="watchers - écoute profonde" style="--editor-height: 700px">
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
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>Informations utilisateur :</p>
        <p>Nom : {{user.name}}</p>
        <p>Âge : {{user.age}}</p>
        <p>Loisirs : {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">Modifier le nom</button>
        <button on:click="updateAge">Modifier l’âge</button>
        <button on:click="addHobby">Ajouter un loisir</button>
        <button on:click="updateHobby">Modifier un loisir</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "Zhang San",
                age: 25,
                hobbies: ["Basketball", "Football"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // récupère l’un d’eux
                console.log("Modification : ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `Valeur modifiée -> propriété "${watcher.name}" de "${watcher.oldValue}" à "${watcher.value}" <br>`;
                }else{
                  this.log += `Méthode exécutée ${watcher.type} -> nom de la fonction "${watcher.name}"  arguments "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "Li Si";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("Natation");
              },
              updateHobby() {
                this.user.hobbies[0] = "Badminton";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Surveiller plusieurs sources de données

Vous pouvez écouter les changements de plusieurs données simultanément et exécuter la logique correspondante dans la fonction de rappel en fonction des changements de plusieurs données.

<o-playground name="watchers - sources multiples de données" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <p>Largeur : {{rectWidth}}</p>
      <p>Hauteur : {{rectHeight}}</p>
      <p>Aire : {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="Largeur" />
      <input sync:value="rectHeight" type="number" placeholder="Hauteur" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              // "rectWidth,rectHeight"(){
              ["rectWidth,rectHeight"](){
                this.area = (this.rectWidth || 0) * (this.rectheight || 0);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Scénarios d'application pratiques

### 1. Validation des formulaires

<o-playground name="watchers - validation de formulaire" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="Nom d'utilisateur (3-10 caractères)" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="Email" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "Le nom d'utilisateur doit contenir 3-10 caractères";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "Veuillez entrer une adresse email valide";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. Définir le thème

<o-playground name="watchers - définir le thème" style="--editor-height: 800px">
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
      <p>Paramètres : {{settings.theme}}</p>
      <p>État de sauvegarde : {{saveStatus}}</p>
      <button on:click="setLight">Thème clair</button>
      <button on:click="setDark">Thème sombre</button>
      <button on:click="resetSettings">Réinitialiser</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "Enregistré",
            },
            watch: {
              settings(){
                  this.saveStatus = "En cours de sauvegarde...";
                  setTimeout(() => {
                    this.saveStatus = "Enregistré";
                    console.log("Paramètres enregistrés :", this.settings);
                  }, 500);
              }
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notes importantes

- **Évitez de modifier les données surveillées** : Modifier les données surveillées dans le rappel d'un écouteur peut entraîner une boucle infinie. Si vous devez les modifier, assurez-vous d'avoir une condition appropriée.
- **Privilégiez les propriétés calculées** : Si vous devez calculer une nouvelle valeur en fonction de changements dans plusieurs données, il est recommandé d'utiliser les [propriétés calculées](./computed-properties.md) plutôt qu'un écouteur.