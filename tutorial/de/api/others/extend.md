# extend



`extend` ist eine Higher-Order-Methode, die zum Erweitern von Eigenschaften oder Methoden einer Instanz verwendet wird.

> In der Regel wird es nicht empfohlen, dass Benutzer die Eigenschaften oder Methoden von Instanzen erweitern, da dies die Lernkosten erhöht. Es sei denn, es gibt spezielle Szenarien innerhalb des Teams, die eine Anpassung des Verhaltens von Instanzen erfordern, wird davon abgeraten.

<o-playground name="extend - Instanz erweitern" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Erweitern Sie $ Unterbau

Ähnlich wie jQuery können Sie auch die Eigenschaften oder Methoden der zugrunde liegenden Instanz über fn.extend erweitern; Eigenschaften oder Methoden, die von fn erweitert werden, werden auf alle Instanzen angewendet.

<o-playground name="extend - Basis erweitern" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li id="target">Ich bin das Ziel</li>
        <li>Ich bin 3</li>
      </ul>
      <div id="logger">Logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js ist gut";
          },
          say(){
            return 'Hallo';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target gut : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Erweiterte Vorlagensyntax

Durch `extend` erweiterte Eigenschaften oder Funktionen können die Funktionalität der Template-Syntax erweitern und Komponenten sogar exklusive Template-Syntax-Sugar bieten. Es sollte jedoch beachtet werden, dass **nicht offizielle** Template-Syntax möglichst **nicht verwendet** wird, da sie für die Anwender mit einem gewissen Lernaufwand verbunden ist und eine große Menge an inoffiziellem Template-Syntax-Sugar die Entwicklungserfahrung beeinträchtigt.

### Erweiterte Attribute

Sie können erweiterte Attribute verwenden, um sie in der Vorlage mit `:` festzulegen. Im Folgenden erweitern wir ein `red`-Attribut. Wenn `red` `true` ist, ändert sich die Schriftfarbe in Rot:

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "rot";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - Erweiterte Eigenschaften" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Zähler erhöhen</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel fügen wir der Vorlagensyntax ein `red`-Attribut hinzu, das die Schriftfarbe auf Rot setzt, wenn `count % 3` nicht 0 ist.

### Erweiterungsmethoden

Du kannst auch über die `extend`-Erweiterungsmethode dafür sorgen, dass sie in der Vorlagen-Syntax verfügbar ist. Der Methodenname ist der Teil vor dem Doppelpunkt. Hier erweitern wir eine `color`-Vorlagen-Syntax; die folgenden Parameter werden an die definierte Erweiterungsmethode übergeben.

Hier wird das Attribut `always` auf `true` gesetzt, was bedeutet, dass die definierte Methode jedes Mal aufgerufen wird, wenn die Komponente die Benutzeroberfläche aktualisieren muss. Wenn `always` nicht gesetzt ist, wird diese Template-Syntax-Funktion nur einmal ausgeführt.

Hierbei bietet `options` weitere Parameter, die Ihnen helfen können, eine stärker anpassbare Template-Syntax zu entwickeln:

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - Erweiterungsmethode" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Zähler erhöhen</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Prinzip der Template-Syntax

Bisher sollten Sie verstanden haben, dass viele der Template-Syntaxen auf ofa.js tatsächlich durch `extend` erweitert werden:

- Die Methoden `class` und `attr` werden bei jedem Aktualisieren der Ansicht ausgeführt
- Funktionsbindungen wie `on` oder `one` werden nur einmal ausgeführt

Sie können sich das folgende Beispiel ansehen, um die Template-Render-Prinzipien von ofa.js besser zu verstehen:

<o-playground name="extend - Template-Syntax-Prinzipien" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

