# emit



Mit der `emit`-Methode kannst du Ereignisse aktiv auslösen, und die ausgelösten Ereignisse verfügen über einen Bubbling-Mechanismus. Der Bubbling-Mechanismus bedeutet, dass Ereignisse vom inneren Element zum äußeren Element aufsteigen und von innen nach außen auf jeder Ebene ausgelöst werden.

Im Folgenden ein Beispiel, das zeigt, wie die `emit`-Methode verwendet wird, um ein benutzerdefiniertes Ereignis auszulösen und dieses mithilfe des Bubble-Mechanismus an äußere Elemente weiterzugeben:

<o-playground name="emit - Ereignis auslösen" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir für das `<ul>`-Element und das `<li>`-Element jeweils denselben benutzerdefinierten Event-Handler `custom-event` registriert. Wenn wir die `emit`-Methode verwenden, um das Event auszulösen, steigt das Event vom `<li>`-Element zum `<ul>`-Element auf und löst beide Event-Handler aus.

## Benutzerdefinierte Daten

Indem du den `data`-Parameter mitbringst, kannst du benutzerdefinierte Daten an die Ereignisbehandlung übergeben:

<o-playground name="emit - Benutzerdefinierte Daten" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Ich bin das Ziel
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul wird ausgelöst;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target wird ausgelöst;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"Ich bin Daten"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir über den `data`-Parameter benutzerdefinierte Daten an den Ereignishandler übergeben. Der Ereignishandler kann über `event.data` auf die übergebenen Daten zugreifen.

## Ereignis auslösen ohne Bubbling

Wenn du nicht möchtest, dass das Event weitergeleitet wird, kannst du beim Auslösen des Events den Parameter `bubbles: false` mitgeben:

<o-playground name="emit - kein Bubbling" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir ein benutzerdefiniertes Ereignis mit dem Parameter `bubbles: false` ausgelöst. Dieses Ereignis wird nicht an übergeordnete Elemente propagiert, sodass nur der Ereignishandler des `<li>`-Elements ausgelöst wird.

## Durchdringung des Root-Knotens

Standardmäßig durchdringen Events nicht den Shadow DOM von benutzerdefinierten Komponenten. Du kannst jedoch `composed: true` setzen, damit benutzerdefinierte Events den Root-Knoten durchdringen und Elemente außerhalb des Root-Knotens auslösen.

<o-playground name="emit - durchdringt Wurzelknoten" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir eine benutzerdefinierte Komponente `composed-test` erstellt, die ein Element im Shadow DOM und einen Button zur Ereignisauslösung enthält. Standardmäßig durchdringen Ereignisse den Shadow DOM nicht bis zum Wurzelknoten. Durch die Verwendung des Parameters `composed: true` bei der Ereignisauslösung haben wir jedoch erreicht, dass das Ereignis den Wurzelknoten durchdringt und Elemente außerhalb des Wurzelknotens auslöst.