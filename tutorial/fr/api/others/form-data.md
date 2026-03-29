# formData



La méthode `formData` sert à générer un objet de données lié aux éléments de formulaire, rendant ainsi le traitement des éléments de formulaire plus simple et plus efficace. Cette méthode produit un objet contenant les valeurs de tous les éléments de formulaire présents dans l’élément cible, et cet objet reflète en temps réel les modifications des éléments de formulaire.

Dans l’exemple ci-dessous, nous montrons comment utiliser la méthode `formData` pour générer des données d’objet liées à un élément de formulaire :

<o-playground name="formData - 基本使用" style="--editor-height: 500px">
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

Dans cet exemple, nous avons créé un formulaire contenant une zone de saisie de texte, des boutons radio et une zone de texte, et utilisé la méthode `formData` pour créer un objet `data` qui contient les valeurs de ces éléments de formulaire. Nous avons également utilisé la méthode `watch` pour surveiller les changements de données et afficher les données en temps réel sur la page. Lorsque l'utilisateur modifie la valeur d'un élément de formulaire, l'objet `data` est mis à jour en conséquence, rendant le traitement des données très simple et efficace.

## Liaison de données inverse

Les données d’objet générées possèdent également une capacité de liaison inverse, ce qui signifie que lorsque vous modifiez les propriétés de l’objet, les valeurs des éléments de formulaire associées se mettent à jour automatiquement. Cela est très utile lors du traitement des données de formulaire, car vous pouvez facilement mettre en œuvre une liaison de données bidirectionnelle.

Dans l'exemple ci-dessous, nous démontrons comment utiliser les données d'objet générées par la méthode `formData`, ainsi que la manière d'effectuer une liaison de données inverse :

<o-playground name="formData - liaison inverse" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sexe:
          <label>
            homme
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            femme
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
          data.message = "ofa.js is good!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons d'abord créé un formulaire contenant une zone de saisie de texte, des boutons radio et une zone de texte, puis nous avons utilisé la méthode `formData` pour générer un objet de données `data`. Ensuite, en modifiant les propriétés de l'objet `data`, nous avons réalisé une liaison de données bidirectionnelle, c'est-à-dire que les valeurs des éléments du formulaire sont automatiquement mises à jour lorsque les propriétés de l'objet sont modifiées. Cette fonctionnalité de liaison de données bidirectionnelle rend l'interaction avec les données du formulaire plus pratique.

## Écouter un formulaire spécifique

Par défaut, la méthode `formData()` écoute tous les éléments `input`, `select` et `textarea` dans l'élément cible. Mais si vous ne souhaitez écouter que des éléments de formulaire spécifiques, vous pouvez le faire en transmettant un sélecteur CSS.

Dans l’exemple ci-dessous, nous montrons comment écouter un élément de formulaire spécifique en passant un sélecteur CSS :

<o-playground name="formData - 特定表单" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          sexe:
          <label>
            homme
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            femme
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">Cet élément de formulaire n'est pas lié</textarea>
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

Dans cet exemple, nous souhaitons écouter uniquement les éléments de formulaire dont la `class` est "use-it", c'est pourquoi nous avons passé `".use-it"` comme paramètre à la méthode `formData()`. Ainsi, seuls les éléments de formulaire portant ce nom de classe seront écoutés et inclus dans l'objet de données généré. Cela est très utile pour écouter de manière sélective les éléments de formulaire, afin de gérer vos données de formulaire plus précisément.

## Formulaire personnalisé

L'utilisation d'un composant de formulaire personnalisé est très simple : il suffit d'ajouter un **attribut value** au composant personnalisé et de définir une **propriété name**.

<o-playground name="formData - formulaire personnalisé" style="--editor-height: 500px">
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
            value: "Texte par défaut",
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

Lorsque vous utilisez un composant de formulaire personnalisé, vous n'avez qu'à l'ajouter à votre formulaire et définir l'attribut `name` requis. Dans l'exemple ci-dessus, nous utilisons l'élément `<custom-input>` et définissons l'attribut `name` pour utiliser le composant de formulaire personnalisé. Ensuite, nous utilisons la méthode `formData()` pour écouter les valeurs des éléments d'entrée et des composants personnalisés, afin d'obtenir et de traiter les données du formulaire en temps réel. Cette méthode vous permet d'étendre facilement votre formulaire pour inclure des composants de formulaire personnalisés, répondant ainsi à vos besoins spécifiques.

## Utiliser des données de formulaire dans un composant ou une page

Parfois, vous pouvez avoir besoin d'utiliser des données de formulaire dans un composant ou une page, et il est nécessaire de générer des données au moment du cycle de vie `attached` et de les lier au composant.

<o-playground name="formData - Utilisation dans le composant" style="--editor-height: 600px">
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

Grâce au cycle de vie `attached`, une fois le composant prêt, nous avons généré l’objet de données de formulaire `fdata` à l’aide de la méthode `this.shadow.formData()`.

`formData()` est plus adapté aux scénarios de formulaires où la logique d'interaction est relativement simple.