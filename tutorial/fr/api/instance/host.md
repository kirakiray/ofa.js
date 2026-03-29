# host



L'attribut `host` permet d'obtenir l'instance du composant hôte de l'élément. Cela est très utile pour accéder aux données et méthodes de son composant hôte à l'intérieur d'un composant.

Voici un exemple montrant comment utiliser la propriété `host` pour obtenir l’instance du composant hôte :

<o-playground name="host - Obtenir l'hôte" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./user-card.html"></l-m>
      <user-card username="tom"></user-card>
      <script>
        export default async function(){
          return {
            data: {
              greeting: "Bonjour"
            },
            proto: {
              sayHi(){
                return `${this.greeting}, je suis l'hôte !`;
              }
            }
          };
        }
      </script>
    </template>
  </code>
  <code path="user-card.html" active>
    <template component>
      <style>
        :host{display:block;border:1px solid #ddd;padding:12px;margin:8px;border-radius:4px;}
      </style>
      <div>Nom d'utilisateur : {{username}}</div>
      <button on:click="onClick">Dire Bonjour</button>
      <div>Réponse : {{response}}</div>
      <script>
        export default {
          tag: "user-card",
          attrs:{
            username: null
          },
          data: {
            response: "-"
          },
          proto: {
            onClick(){
              this.response = this.host.sayHi();
            }
          },
          ready(){
            console.log("Méthode de l'hôte :", this.host.sayHi());
          },
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons un composant personnalisé `user-card` et, à l’intérieur du composant, accédons à la méthode `sayHi` du composant hôte (page) via `this.host`, réalisant ainsi l’interaction entre le composant et son hôte.

Si l'élément n'est pas dans un composant ou un module de page, la valeur de `host` sera `null`. Par exemple :

<o-playground name="host - pas de host" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Je suis la cible
        </li>
      </ul>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          $("#logger").text = String($("#target").host);
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, l'élément `#target` se trouve sous body, n'est dans aucun composant ou page, donc la valeur de `$("#target").host` est `null`.