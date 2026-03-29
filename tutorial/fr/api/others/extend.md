# extend



`extend` est une méthode d’ordre supérieur utilisée pour étendre les propriétés ou les méthodes d’une instance.

> En général, il n'est pas recommandé aux utilisateurs d'étendre les propriétés ou les méthodes d'une instance, car cela augmente le coût d'apprentissage. Sauf si des scénarios spécifiques au sein de l'équipe nécessitent un comportement personnalisé de l'instance, il est déconseillé de procéder ainsi.

<o-playground name="extend - étendre l'instance" style="--editor-height: 560px">
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

## Étendre $ fond

Comme jQuery, vous pouvez également étendre les propriétés ou méthodes des instances de base via `fn.extend` ; les propriétés ou méthodes étendues à partir de `fn` seront appliquées à toutes les instances.

<o-playground name="extend - 扩展底层" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Syntaxe de modèle étendue

En étendant des propriétés ou des fonctions via `extend`, vous pouvez augmenter les fonctionnalités de la syntaxe des templates, voire fournir une syntaxe de template exclusive pour les composants. Cependant, il est important de noter qu'il est préférable de **ne pas utiliser** de syntaxes de template non officielles, car elles imposent un certain coût d'apprentissage aux utilisateurs, et une grande quantité de syntaxes de template non officielles peut réduire l'expérience de développement.

### Attributs étendus

Vous pouvez définir des propriétés étendues dans le modèle en utilisant `:`. Nous allons maintenant étendre une propriété `red`, lorsque `red` est `true`, la couleur de la police devient rouge :

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - Propriétés étendues" style="--editor-height: 400px">
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
      <button on:click="addCount">Ajouter Compteur</button>
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

Dans cet exemple, nous avons ajouté une propriété `red` à la syntaxe du modèle ; lorsque `count % 3` n’est pas égal à 0, la couleur de la police devient rouge.

### Méthodes d'extension

Vous pouvez également utiliser la méthode d'extension `extend` pour la rendre disponible dans la syntaxe des modèles. Le nom de la méthode est la partie avant les deux-points. Ici, nous avons étendu une syntaxe de modèle `color`, et les paramètres qui suivent seront transmis à la méthode d'extension définie.

Ici, l'attribut `always` est défini à `true`, ce qui signifie que la méthode définie sera appelée à chaque fois que le composant a besoin de rafraîchir l'interface. Si `always` n'est pas défini, cette fonction de syntaxe de modèle ne sera exécutée qu'une seule fois.

Parmi eux, `options` fournit davantage de paramètres qui vous permettent de développer une syntaxe de modèle plus personnalisée :

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

<o-playground name="extend - Méthodes d'extension" style="--editor-height: 400px">
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
      <button on:click="addCount" color:blue="count % 3">Add Count</button>
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

## Principe de la syntaxe des modèles

Jusqu’à présent, tu devrais déjà comprendre que de nombreuses syntaxes de modèle sur ofa.js sont en réalité étendues via `extend` :

- Les méthodes `class`, `attr` s'exécutent à chaque rafraîchissement de la vue
- Les liaisons de fonctions comme `on`, `one` ne s'exécutent qu'une seule fois

Vous pouvez consulter l'exemple ci-dessous pour mieux comprendre le principe de rendu des modèles d’ofa.js :

<o-playground name="extend - 模板语法原理" style="--editor-height: 480px">
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

