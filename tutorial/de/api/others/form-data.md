# formData



Die `formData`-Methode wird verwendet, um ein mit Formularelementen gebundenes Objekt zu erzeugen, wodurch die Verarbeitung von Formularelementen einfacher und effizienter wird. Diese Methode erzeugt ein Objekt, das alle Werte der Formularelemente innerhalb des Zielelements enthält, und dieses Objekt spiegelt in Echtzeit Änderungen an den Formularelementen wider.

Im folgenden Beispiel zeigen wir, wie man mit der `formData`-Methode ein an Formularelemente gebundenes Objekt erzeugt:

<o-playground name="formData - Grundlegende Verwendung" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir ein Formular mit einem Textfeld, Radio-Buttons und einem Textbereich erstellt und die Methode `formData` verwendet, um ein Objekt `data` zu erstellen, das die Werte dieser Formularelemente enthält. Wir haben auch die Methode `watch` verwendet, um Änderungen der Daten zu überwachen und die Daten in Echtzeit auf der Seite anzuzeigen. Wenn der Benutzer die Werte der Formularelemente ändert, wird das Objekt `data` entsprechend aktualisiert, was die Datenverarbeitung sehr einfach und effizient macht.

## Zwei-Wege-Datenbindung

Die generierten Objektdaten haben ebenfalls die Fähigkeit zur umgekehrten Bindung, was bedeutet, dass sich die Werte der zugehörigen Formularelemente automatisch aktualisieren, wenn Sie die Eigenschaften des Objekts ändern. Dies ist sehr nützlich bei der Verarbeitung von Formulardaten, da Sie so problemlos eine bidirektionale Datenbindung implementieren können.

Im folgenden Beispiel demonstrieren wir, wie die mit der `formData`-Methode generierten Objektdaten verwendet werden, sowie wie eine Reverse-Datenbindung durchgeführt wird:

<o-playground name="formData - Rückwärtsbindung" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          Geschlecht:
          <label>
            Mann
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            Frau
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        setTimeout(()=>{
          data.username = "Yao";
          data.sex = "man";
          data.message = "ofa.js ist gut!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst ein Formular mit Texteingabefeld, Optionsfeld und Textbereich und verwenden dann die Methode `formData`, um ein Datenobjekt `data` zu erzeugen. Anschließend realisieren wir durch Ändern der Eigenschaften des `data`-Objekts eine umgekehrte Datenbindung: Die Werte der Formularelemente aktualisieren sich automatisch, sobald sich die Objekteigenschaften ändern. Diese bidirektionale Datenbindung erleichtert die Interaktion mit Formulardaten erheblich.

## Bestimmte Formulare überwachen

Standardmäßig überwacht die Methode `formData()` alle `input`-, `select`- und `textarea`-Elemente innerhalb des Ziel-Elements. Wenn du jedoch nur bestimmte Formularelemente überwachen möchtest, kannst du einen CSS-Selektor übergeben.

In dem folgenden Beispiel demonstrieren wir, wie man durch die Übergabe von CSS-Selektoren bestimmte Formularelemente überwachen kann:

<o-playground name="formData - Spezifisches Formular" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          Geschlecht:
          <label>
            Mann
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            Frau
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">Dieses Formularelement ist nicht gebunden</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData(".use-it");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

在此示例中，我们只希望监听具有 `class` 为 "use-it" 的表单元素，因此我们传递了 `".use-it"` 作为参数给 `formData()` 方法。这样，只有带有该类名的表单元素会被监听和包括在生成的数据对象中。这对于选择性地监听表单元素非常有用，以便更精确地管理你的表单数据。

## Benutzerdefiniertes Formular

Die Verwendung benutzerdefinierter Formularkomponenten ist sehr einfach: Sie müssen lediglich eine **value-Eigenschaft** hinzufügen und das **name-Attribut** setzen.

<o-playground name="formData - Benutzerdefiniertes Formular" style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <div id="myForm">
        <input type="text" name="username" value="John Doe" />
        <l-m src="./custom-input.html"></l-m>
        <custom-input name="message"></custom-input>
        <div id="logger"></div>
      </div>
      <script>
        const data = $("#myForm").formData("input,custom-input");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
  <code path="custom-input.html">
    <template component>
      <style>
        :host{
          display: block;
        }
        .editor {
          display: inline-block;
          min-width: 200px;
          line-height: 30px;
          height: 30px;
          border: #aaa solid 1px;
          border-radius: 4px;
          padding: 4px;
          font-size: 14px;
        }
      </style>
      <div
        class="editor"
        contenteditable="plaintext-only"
        :text="value"
        on:input="changeText"
      ></div>
      <script>
        export default {
          tag:"custom-input",
          attrs: {
            name: "",
          },
          data: {
            value: "Standardtext",
          },
          proto: {
            changeText(e) {
              this.value = $(e.target).text;
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

Wenn du eine benutzerdefinierte Formularkomponente verwendest, musst du sie einfach deinem Formular hinzufügen und das erforderliche `name`-Attribut setzen. Im obigen Beispiel verwenden wir die benutzerdefinierte Formularkomponente, indem wir das `<custom-input>`-Element hinzufügen und das `name`-Attribut setzen. Danach lauschen wir mit der Methode `formData()` auf die Werte der Eingabeelemente und der benutzerdefinierten Komponente, um Formulardaten in Echtzeit zu erfassen und zu verarbeiten. Diese Methode ermöglicht es dir, dein Formular ganz bequem um benutzerdefinierte Formularkomponenten zu erweitern, um deine spezifischen Anforderungen zu erfüllen.

## Formulardaten in Komponenten oder Seiten verwenden

Manchmal müssen Sie möglicherweise Formulardaten innerhalb einer Komponente oder Seite verwenden und die Daten im `attached`-Lebenszyklus erzeugen und an die Komponente binden.

<o-playground name="formData - Verwendung in Komponente" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./form-data-demo.html"></l-m>
      <form-data-demo></form-data-demo>
    </template>
  </code>
  <code path="form-data-demo.html" active>
    <template component>
      <style>
        :host{
          display: block;
        }
      </style>
      <input type="text" name="username" value="John Doe" />
      <div>{{logtext}}</div>
      <script>
        export default {
          tag:"form-data-demo",
          data: {
            fdata:{},
            logtext: ""
          },
          watch:{
            fdata(data){
              if(data){
                this.logtext = JSON.stringify(data);
              }
            }
          },
          attached(){
            this.fdata = this.shadow.formData();
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Über den Lebenszyklus `attached` generieren wir nach dem Bereitstellen der Komponente mit der Methode `this.shadow.formData()` ein Formulardaten-Objekt `fdata`.

`formData()` eignet sich besser für Formularszenarien mit relativ einfacher Interaktionslogik.