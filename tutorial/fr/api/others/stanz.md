# Caractéristiques des données d'exemple

Les objets d’instance obtenus ou créés via `$` possèdent l’intégralité des caractéristiques de données de stanz, car l’instance `$` hérite de stanz. Cela signifie que vous pouvez utiliser les méthodes et propriétés de manipulation de données fournies par `stanz` pour manipuler et écouter les données de l’objet d’instance.

> Les exemples suivants utilisent des éléments conventionnels, car les composants personnalisés ont généralement des données déjà enregistrées, tandis que les éléments conventionnels ne contiennent généralement que des informations de balisage, ce qui les rend plus adaptés à la démonstration.

## watch



Les instances peuvent écouter les changements de valeur via la méthode `watch` ; même si la valeur d’un sous-objet de l’objet est modifiée, le changement peut être détecté dans la méthode `watch` de l’objet.

Voici un exemple montrant comment utiliser l’instance `$` et la méthode `watch` :

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "Je suis aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "Je suis bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "changer bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons d’abord une instance `$` appelée `target`, puis utilisons la méthode `watch` pour surveiller ses modifications. Même si nous modifions la valeur d’un sous-objet, par exemple `target.bbb.child.val`, la méthode `watch` détecte ces changements et met à jour le contenu de l’élément `logger`. Cela illustre la puissance de l’instance `$`, qui vous permet de surveiller facilement les changements d’un objet.

## watchTick



`watchTick` et la méthode `watch` ont des fonctions similaires, mais `watchTick` inclut une opération de throttling interne ; il s’exécute une seule fois dans un thread unique, ce qui permet d’écouter les changements de données plus efficacement dans certains scénarios à forte exigence de performance.

Ci-dessous un exemple démontrant comment utiliser la méthode `watchTick` d'une instance `$` :

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch exécuté : ' + count1 + ' fois';
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick exécuté : ' + count2 + ' fois';
        });
        setTimeout(() => {
          target.aaa = "Je suis aaa";
          target.bbb = "Je suis bbb";
          target.ccc = "Je suis ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons d'abord créé une instance d'objet `$` appelée `target`. Ensuite, nous avons utilisé la méthode `watch` et la méthode `watchTick` pour surveiller les modifications de l'objet. La méthode `watch` s'exécute immédiatement lorsque les données changent, tandis que la méthode `watchTick` s'exécute une seule fois dans un seul thread, ce qui permet de limiter la fréquence des opérations de surveillance. Vous pouvez choisir d'utiliser la méthode `watch` ou `watchTick` pour surveiller les changements de données en fonction de vos besoins.

## unwatch



La méthode `unwatch` sert à annuler l’écoute des données ; elle permet de révoquer l’écoute précédemment enregistrée par `watch` ou `watchTick`.

Voici un exemple montrant comment utiliser la méthode `unwatch` de l'instance `$` :

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons d'abord créé une instance d'objet `$` appelée `target`, puis utilisé les méthodes `watch` et `watchTick` pour enregistrer deux écouteurs respectivement. Ensuite, nous avons passé les valeurs de retour précédemment enregistrées `tid1` et `tid2` des écouteurs à la méthode `unwatch` pour annuler ces deux écouteurs. Cela signifie que le changement de propriété dans le premier `setTimeout` ne déclenchera aucun écouteur, car les écouteurs ont été annulés.

## Valeurs non surveillées

Dans l'instance `$`, les noms d'attributs commençant par un tire-bas `_` indiquent que ces valeurs ne seront pas surveillées par les méthodes `watch` ou `watchTick`. Cela est très utile pour certains attributs temporaires ou privés, vous pouvez les modifier à volonté sans déclencher la surveillance.

Dans le modèle, ceci est appelé une [donnée non réactive](../../documentation/state-management.md).

Voici un exemple montrant comment utiliser des valeurs d’attribut commençant par un soulignement pour éviter d’être écouté :

<o-playground name="stanz - Données non réactives" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "Je suis aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "modifier aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons une instance `$` appelée `target`, puis utilisons la méthode `watch` pour écouter les changements de valeur des propriétés. Dans `setTimeout`, nous tentons de modifier la valeur de la propriété `_aaa`, mais ce changement ne déclenche pas l'écoute. Cela est très utile pour les cas où l'on souhaite mettre à jour une valeur de propriété sans déclencher l'écoute.

## Caractéristiques de base

Les données d'objet définies sur l'instance seront converties en instance Stanz, et cette instance Stanz peut être surveillée.

```javascript
const obj = {
  val: "Je suis obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

Nous pouvons également utiliser `$.stanz` pour créer des données Stanz qui ne sont pas liées à une instance.

```javascript
const data = $.stanz({
  val: "Je suis val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "changer val";
```

Ces exemples illustrent les caractéristiques de base de la configuration des données d'objet en tant qu'instances Stanz pour l'écoute.

Pour plus de fonctionnalités complètes, veuillez consulter [stanz](https://github.com/ofajs/stanz).