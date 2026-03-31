# emit



En utilisant la méthode `emit`, vous pouvez déclencher activement des événements, et les événements déclenchés possèdent un mécanisme de propagation. Le mécanisme de propagation signifie que l'événement remonte de l'élément interne vers l'élément externe, en déclenchant les événements de l'intérieur vers l'extérieur selon les niveaux hiérarchiques.

Ci-dessous un exemple démontrant comment utiliser la méthode `emit` pour déclencher un événement personnalisé et utiliser le mécanisme de propagation pour transmettre l'événement à un élément externe.

<o-playground name="emit - déclencher un événement" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Je suis la cible
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul est déclenché ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'la cible est déclenchée ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"Je suis les données"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons enregistré le même gestionnaire d'événements personnalisé `custom-event` pour l'élément `<ul>` et l'élément `<li>`. Lorsque nous utilisons la méthode `emit` pour déclencher l'événement, celui-ci remonte de l'élément `<li>` à l'élément `<ul>`, déclenchant ainsi les deux gestionnaires d'événements.

## Données personnalisées

En passant le paramètre `data`, vous pouvez transmettre des données personnalisées au gestionnaire d'événements :

<o-playground name="emit - Données personnalisées" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Je suis la cible
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul est déclenché;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'la cible est déclenchée;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"Je suis les données"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous passons des données personnalisées au gestionnaire d'événements via le paramètre `data`. Le gestionnaire d'événements peut récupérer les données transmises via `event.data`.

## Déclencher un événement sans propagation

Si vous ne souhaitez pas que l'événement se propage, vous pouvez ajouter le paramètre `bubbles: false` lors du déclenchement de l'événement :

<o-playground name="emit - sans bulles" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Je suis la cible
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul est déclenché';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'la cible est déclenchée';
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

Dans cet exemple, nous déclenchons un événement personnalisé avec le paramètre `bubbles: false`. Cet événement ne remonte pas aux éléments parents, seul le gestionnaire d’événements de l’élément `<li>` est donc déclenché.

## Pénétration du nœud racine

Par défaut, les événements ne traversent pas le DOM fantôme des composants personnalisés. Mais vous pouvez permettre aux événements personnalisés de traverser le nœud racine et de déclencher des éléments en dehors du nœud racine en définissant `composed: true`.

<o-playground name="emit - Pénétration du nœud racine" style="--editor-height: 560px">
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
              this.loggerText = "L'événement personnalisé est déclenché ;  =>  " + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"Je suis un événement composé"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons créé un composant personnalisé `composed-test` qui contient un élément dans un DOM fantôme et un bouton qui déclenche un événement. Par défaut, les événements ne traversent pas le DOM fantôme pour atteindre le nœud racine. Cependant, en utilisant le paramètre `composed: true` lors du déclenchement de l'événement, nous avons permis à l'événement de traverser jusqu'au nœud racine, déclenchant ainsi l'élément en dehors du nœud racine.