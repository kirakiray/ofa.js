# app



In `o-app` enthaltene Elemente, einschließlich der Elemente im Schattenknoten von `o-page` innerhalb von `o-app` oder der inneren Unterkomponenten, deren `app`-Eigenschaft auf die Elementinstanz dieses `o-app` verweist.

Das Folgende ist ein Beispiel, das zeigt, wie man innerhalb eines `o-app`-Elements auf die `app`-Eigenschaft zugreift:


<o-playground name="app - App-Instanz abrufen" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // URL der App-Startseite
    export const home = "./home.html";
    // Verfügbare Methoden in der App
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
    // Konfiguration der Seitenwechselanimation
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

