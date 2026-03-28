# Respuesta de atributo

En el anterior [enlace de propiedades](./property-binding.md) presentamos un mecanismo de respuesta de propiedades simple, es decir, cómo renderizar el valor de una propiedad del componente en la visualización de texto.

ofa.js no solo soporta la reactividad de valores de propiedades básicas, sino que también soporta el renderizado reactivo de valores de propiedades internas de objetos multinivel anidados.

<o-playground name="Ejemplo de datos no reactivos" style="--editor-height: 500px">
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
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">增加</button>
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

Todos los datos vinculados a la instancia de ofa.js se convertirán automáticamente en datos reactivos. Los datos reactivos solo admiten tipos de datos básicos como cadenas, números, booleanos, arrays y objetos. Para tipos de datos complejos como funciones o instancias de clases, deben almacenarse como **propiedades no reactivas**, cuyos cambios no provocarán una nueva renderización del componente.

## Datos no reactivos

A veces necesitamos almacenar algunos datos que no requieren actualización reactiva, como instancias de Promise, objetos de expresiones regulares u otros objetos complejos, en estos casos es necesario usar propiedades no reactivas. Los cambios en estas propiedades no provocarán la re-renderización del componente, son adecuadas para almacenar datos que no requieren vinculación con la vista.

Los nombres de las propiedades no reactivas suelen llevar un guion bajo `_` como prefijo, para distinguirlas de las propiedades reactivas.

<o-playground name="Ejemplo de datos no reactivos" style="--editor-height: 500px">
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
      <button on:click="count++">Aumentar Azul</button>
      <button on:click="_count2++">Aumentar Verde</button>
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

Al hacer clic en el botón `Green增加`, aunque el valor de `_count2` de hecho ya se ha incrementado, dado que es una propiedad no reactiva, no se activa la actualización de la vista y, por lo tanto, la visualización en la interfaz no cambia. Al hacer clic en el botón `Blue增加`, como `count` es una propiedad reactiva, se activa el re-renderizado del componente entero, momento en el que se sincroniza y actualiza el contenido mostrado de Green.

Los datos de objetos no reactivos tienen un mejor rendimiento que los datos de objetos reactivos porque los datos no reactivos no desencadenan la re-renderización de componentes.


