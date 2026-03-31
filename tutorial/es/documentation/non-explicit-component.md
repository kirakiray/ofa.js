# Componentes no explícitos

ofa.js incluye dos tipos de componentes no explícitos de forma nativa:

* Componentes de renderizado condicional: `x-if`, `x-else-if`, `x-else`
* Componentes de relleno: `x-fill`

Estos dos componentes tienen funciones idénticas a los componentes `o-if` y `o-fill`, pero ellos mismos no se renderizan realmente en el DOM, sino que renderizan sus elementos internos directamente en las áreas correspondientes.

Por ejemplo:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- El estilo no es rojo, porque el componente o-if existe en el DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- El estilo es rojo, porque el componente x-if no se renderiza en el DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Componente no explícito" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* Selecciona elementos .item de primer nivel hijo para que sean rojos */
            color:red;
        }
        /* Necesita seleccionar elementos .item dentro del componente o-if */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- El estilo no será rojo porque el componente o-if en sí existe en el DOM -->
                <div class="item">No se mostrará en rojo</div>
            </o-if>
            <x-if :value="true">
                <!-- El estilo será rojo porque el componente x-if no se renderiza en el DOM -->
                <div class="item">Se mostrará en rojo</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if Componente de Renderizado Condicional

`x-if` tiene exactamente la misma funcionalidad que [o-if](./conditional-rendering.md) y se utiliza para decidir si se renderiza el contenido en función del valor de verdad de la expresión condicional. La diferencia es que `x-if` en sí mismo no existe como elemento DOM, y su contenido interno se renderiza directamente en el contenedor principal.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>¡Bienvenido de nuevo, usuario!</p>
    </x-if>
</div>
```

`x-if` también puede usarse junto con `x-else-if` y `x-else`:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Panel de administrador</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>Centro de usuario</p>
    </x-else-if>
    <x-else>
        <p>Por favor, inicia sesión</p>
    </x-else>
</div>
```

## Componente de relleno x-fill

`x-fill` tiene la misma funcionalidad que [o-fill](./list-rendering.md), se utiliza para renderizar datos de arrays como múltiples elementos DOM. De manera similar a `x-if`, `x-fill` en sí no se renderiza en el DOM, y su plantilla interna se renderiza directamente en el contenedor padre.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Ejemplo de uso de plantillas con nombre:

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Descripción del rendimiento

Además de las diferencias funcionales, el rendimiento de renderizado de los componentes no explícitos es **mucho peor** que el de los componentes explícitos (`o-if`, `o-fill`). Esto se debe a que los componentes no explícitos no se renderizan realmente en el DOM, requiriendo lógica de renderizado simulada adicional para manejar el posicionamiento y la actualización de los elementos internos.

Además, los componentes no explícitos pueden provocar errores difíciles de detectar: dado que no se integran realmente en el DOM, las operaciones que dependen de la estructura del DOM (como la vinculación de eventos, el cálculo de estilos o las consultas de bibliotecas de terceros) pueden fallar o comportarse de manera anómala.

Por lo tanto, se recomienda **dar prioridad al uso de componentes explícitos** (`o-if`, `o-else-if`, `o-else`, `o-fill`), y utilizar componentes no explícitos solo en escenarios específicos.

## Casos de uso

Aunque los componentes no explícitos tienen un rendimiento inferior, pueden usarse en los siguientes escenarios:

1. **Evitar niveles adicionales de DOM**: cuando no deseas que los elementos `o-if` o `o-fill` formen parte de la estructura DOM.
2. **Herencia de estilos**: cuando necesitas que los elementos internos hereden directamente los estilos del contenedor padre, sin verse afectados por elementos de componentes intermedios.
3. **Limitaciones de selectores CSS**: cuando necesitas usar selectores de hijos directos del padre (como `.container > .item`) para controlar los estilos con precisión, pero no deseas que haya elementos de envoltura adicionales en el medio.