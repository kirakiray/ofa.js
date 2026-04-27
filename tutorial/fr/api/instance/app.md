# app



Les éléments à l'intérieur de `o-app`, y compris ceux à l'intérieur du nœud fantôme de `o-page` à l'intérieur de `o-app`, ou les composants enfants internes, leur attribut `app` pointe vers l'instance d'élément de ce `o-app`.

Voici un exemple qui montre comment accéder à la propriété `app` dans un élément à l'intérieur de `o-app` :


<o-playground name="app - Obtenir l'instance de l'application" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    // Méthodes disponibles sur l'application
    export const proto = {
      getSomeData(){
        return "Bonjour ofa.js App Demo";
      }
    };
    // Configuration de l'animation de changement de page
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

