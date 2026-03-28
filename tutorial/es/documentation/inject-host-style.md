# Inyectar estilos del host

En Web Components, debido a las limitaciones de las ranuras `slot`, no es posible establecer directamente los estilos de elementos en múltiples niveles dentro de la ranura. Para resolver este problema, ofa.js proporciona el componente `<inject-host>`, que permite inyectar estilos en el elemento host desde dentro del componente, logrando así el control de estilos para elementos en múltiples niveles dentro del contenido de la ranura.

> Nota: se recomienda utilizar con prioridad el selector [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) para aplicar estilos al contenido del slot. Solo cuando esto no satisfaga los requisitos, emplee el componente `<inject-host>`.

## Uso básico

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Establecer estilos para elementos hijos directos de primer nivel */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* También se pueden establecer estilos para anidamientos de múltiples niveles */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Caso

El siguiente ejemplo muestra cómo utilizar `<inject-host>` para aplicar estilos a elementos anidados dentro de un slot. Creamos dos componentes: el componente `user-list` como contenedor de la lista y el componente `user-list-item` como elemento de la lista. Mediante `<inject-host>`, podemos establecer estilos para `user-list-item` y sus elementos internos dentro del componente `user-list`.

<o-playground name="Inyectar estilos de host" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>张三</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">李四</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Edad: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En los resultados de ejecución se puede ver:- El color de fondo del componente `user-list-item` es aqua (configurado a través de `<inject-host>` del componente `user-list`)
- El color del texto del nombre es rojo (configurado a través de `<inject-host>` del componente `user-list` con el estilo `user-list-item .item-name`)

## Cómo funciona

El componente `<inject-host>` inyectará el contenido de las etiquetas `<style>` que contiene internamente en el elemento host del componente. De esta manera, las reglas de estilo inyectadas pueden atravesar los límites del componente y afectar a los elementos dentro del slot.

De esta manera, puedes:- Aplicar estilos a elementos de cualquier profundidad dentro del contenido del slot
- Utilizar rutas completas de selectores para garantizar que los estilos solo afecten al elemento objetivo
- Mantener el encapsulado de estilos del componente mientras se logra una flexibilidad de penetración de estilos

## Precauciones

⚠️ **Riesgo de contaminación de estilos**: dado que los estilos inyectados actúan dentro del ámbito del elemento huésped, pueden afectar a elementos de otros componentes. Al utilizarlos, sigue estrictamente los principios siguientes:

1. **Usar selectores específicos**: Intenta utilizar rutas completas de etiquetas de componentes, evitando selectores demasiado amplios.
2. **Agregar prefijos de espacio de nombres**: Añade prefijos únicos a tus clases de estilo para reducir la posibilidad de conflictos con otros componentes.
3. **Evitar selectores de etiquetas genéricas**: Intenta usar nombres de clase o selectores de atributos en lugar de selectores de etiquetas.
4. **Reflexionar sobre el diseño del componente**: Considera si es posible evitar el uso de `<inject-host>` optimizando el diseño del componente. Por ejemplo, usar el selector [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) en combinación con componentes hijos suele ser más elegante.

```html
<!-- Recomendado ✅: Usar selectores específicos -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- No recomendado ❌: Usar selectores demasiado genéricos -->
<inject-host>
    <style>
        .content {  /* propenso a conflictos con otros componentes */
            color: red;
        }
    </style>
</inject-host>
```

### Consejos de rendimiento

由于 `<inject-host>` puede déclenche el reinyecto de estilos del host, lo que puede causar reflujo o repintado del componente, úselo con precaución en escenarios de actualización frecuente.  
若仅需为插槽内第一级元素设置样式，优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 伪类选择器，可避免穿透式注入带来的额外渲染开销，从而获得更佳性能。