# $

Die `$`-Methode ist die Kernfunktion in ofa.js, die zum Abrufen und Manipulieren von DOM-Elementinstanzen verwendet wird. Im Folgenden werden die Hauptfunktionen von `$` im Detail erläutert:

## Instanz eines Elements abrufen

Mit der `$`-Methode können Sie die erste Elementinstanz auf der Seite abrufen, die mit einem [CSS-Selektor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) übereinstimmt, und sie bearbeiten. Hier ist ein Beispiel:

<o-playground name="$ - Element abrufen">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

Im obigen Beispiel haben wir mit dem `$`-Symbol eine Instanz des Elements mit der `id` "target1" ausgewählt und durch Setzen der `text`-Eigenschaft seinen Textinhalt geändert.

## Beispiel zum Finden von Unterelementen

Die Instanz besitzt ebenfalls die `$`-Methode; über die `$`-Methode der Instanz kann man die erste passende untergeordnete Elementinstanz abrufen.

<o-playground name="$ - Unterelemente finden">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>Ich bin target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'Titel des Ziels ändern';
      </script>
    </template>
  </code>
</o-playground>

Bitte fügen Sie die erhaltene Elementinstanz nicht direkt an anderen Stellen ein, da dies das ursprüngliche Element beeinflussen kann. Wenn Sie eine Kopie erstellen müssen, können Sie die [clone](./clone.md)-Methode verwenden.

<o-playground name="$ - Instanz-Eigenschaften" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>Position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>Position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Untergeordnete Elemente innerhalb eines Shadow-Knotens abrufen

Sie können die Instanz über das [shadow](./shadow.md)-Attribut abrufen und dann das gewünschte Element über die `$`-Methode erhalten:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Direkte Instanziierung von Elementen

Sie können native Elemente direkt als `$`-Instanzobjekte initialisieren durch:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

Auf diese Weise können Sie vorhandene HTML-Elemente bequem in `$`-Instanzen umwandeln, um die von `$` bereitgestellten Funktionen zur Manipulation und Verarbeitung zu nutzen.

## Instanz eines Erzeugniselements

Außer, `$` kann nicht nur verwendet werden, um vorhandene Elementinstanzen abzurufen, sondern auch um neue Elementinstanzen zu erstellen und sie zur Seite hinzuzufügen.

### Generierung über String

Sie können mit der `$`-Funktion neue Elementinstanzen aus Zeichenketten erstellen, wie unten gezeigt:

<o-playground name="$ - String-Generierung" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">add target 1 text</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die `$`-Funktion, um eine neue Elementinstanz mit den angegebenen Stilen und dem Textinhalt zu erstellen und sie in eine bestehende Elementinstanz mit der `id` „target1“ einzufügen.

### Durch Objekte generieren

Sie können auch die `$`-Funktion verwenden, um neue Elementinstanzen auf objektorientierte Weise zu generieren, wie folgt:

<o-playground name="$ - Objektgenerierung" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "Text zu target1 hinzufügen",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die `$`-Funktion, um eine neue Elementinstanz über ein Objekt zu definieren, einschließlich des Tag-Typs, des Textinhalts und der Stilattribute, und fügen sie innerhalb der vorhandenen Elementinstanz mit der `id` "target1" hinzu.