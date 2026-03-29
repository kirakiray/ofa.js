# app



Elemente innerhalb von `o-app`, einschließlich derer in den Shadow-Knoten von `o-page` innerhalb von `o-app` oder in tieferliegenden untergeordneten Komponenten, verweisen mit ihrer `app`-Eigenschaft alle auf diese `o-app`-Elementinstanz.

Im Folgenden ein Beispiel, das zeigt, wie innerhalb eines Elements in `o-app` auf die `app`-Eigenschaft zugegriffen wird:


<o-playground name="app - App-Instanz abrufen" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseite der App
    export const home = "./home.html";
    // Verfügbare Methoden der App
    export const proto = {
      getSomeData(){
        return "Hallo ofa.js App Demo";
      }
    };
    // Konfiguration der Seitenübergangsanimation
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

