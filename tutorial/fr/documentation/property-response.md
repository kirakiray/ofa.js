# Réponse d'attributs

Dans la section précédente sur la [liaison de propriétés](./property-binding.md), nous avons présenté un mécanisme simple de réactivité des propriétés, à savoir comment rendre la valeur d’une propriété du composant dans un affichage textuel.

ofa.js supporte non seulement la réactivité des valeurs d'attributs de base, mais aussi le rendu réactif des valeurs d'attributs internes d'objets profondément imbriqués.

<o-playground name="Exemple de données non réactives" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count : {{count}}</p>
      <p style="color: green;">count2 : {{obj.count2}}</p>
      <button on:click="handleAddCount">Augmenter</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Toutes les données liées aux objets d'instance d'ofa.js sont automatiquement converties en données réactives. Les données réactives ne prennent en charge que les types de données de base tels que les chaînes de caractères, les nombres, les booléens, les tableaux et les objets. Pour les types de données complexes comme les fonctions ou les instances de classes, elles doivent être stockées en tant que **propriétés non réactives**, et les changements de ces propriétés ne déclencheront pas le nouveau rendu du composant.

## Données non réactives

Parfois, nous devons stocker des données qui ne nécessitent pas de mise à jour réactive, par exemple des instances de Promise, des objets d'expression régulière ou d'autres objets complexes. Dans ce cas, il est nécessaire d'utiliser des propriétés non réactives. Les modifications de ces propriétés ne déclenchent pas le nouveau rendu du composant et sont adaptées au stockage de données qui ne nécessitent pas de liaison avec la vue.

Les propriétés non réactives sont généralement préfixées d’un underscore `_` devant leur nom, afin de les distinguer des propriétés réactives.

<o-playground name="Exemple de données non réactives" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Augmenter Bleu</button>
      <button on:click="_count2++">Augmenter Vert</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Lorsque vous cliquez sur le bouton `Green增加`, bien que la valeur de `_count2` ait effectivement augmenté, comme il s'agit d'une propriété non réactive, elle ne déclenche pas la mise à jour de la vue ; l'affichage à l'écran reste donc inchangé. Lorsque vous cliquez sur le bouton `Blue增加`, comme `count` est une propriété réactive, elle déclenche le re-rendu complet du composant, ce qui synchronise alors l'affichage de Green.

Les données d’objet non réactives offrent de meilleures performances que les données d’objet réactives, car elles ne déclenchent pas de nouveau rendu du composant.


