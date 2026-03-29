# Crear componente

En ofa.js, los componentes son el mecanismo central para lograr la reutilización de páginas y la modularidad. Un componente esencialmente es un Web Component personalizado; mediante la definición de plantillas, estilos y lógica, se pueden crear elementos de interfaz de usuario reutilizables.

## Estructura básica del componente

A diferencia de los módulos de página, los módulos de componentes utilizan el atributo `component` en el elemento `<template>`, y declaran el atributo `tag` para especificar el nombre de la etiqueta del componente.

En la posición donde se necesite usar el componente, a través de la etiqueta `l-m` se carga asincrónicamente el módulo del componente, y el sistema completará automáticamente el registro; posteriormente se podrá usar directamente el componente de la misma manera que una etiqueta HTML común.

<o-playground name="Ejemplo Básico de Componente" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "Ejemplo de Componente OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Conceptos centrales de componentes

### tag - Nombre de etiqueta del componente

`tag` es el nombre de etiqueta del componente, **debe coincidir exactamente con la etiqueta usada al emplear el componente**. Por ejemplo, si el `tag` de tu componente se define como `"demo-comp"`, entonces al usarlo en HTML deberás escribir `<demo-comp></demo-comp>`.

### Referencia del Módulo de Componentes

Introduce módulos de componentes a través de la etiqueta `l-m`, y los módulos de componentes se registrarán automáticamente. Esto es similar a usar la etiqueta `script` para importar scripts, pero `l-m` está dedicado específicamente a la carga y registro de módulos de componentes.

> Nota: la etiqueta de referencia `l-m` es una **referencia asíncrona**, adecuada para cargar componentes bajo demanda durante la carga de la página.

## Componente de Referencia Sincronizada

En ciertos escenarios, es posible que necesites cargar componentes de manera síncrona (por ejemplo, para asegurarte de que un componente esté registrado antes de usarlo). En estos casos, puedes utilizar el método `load` junto con la palabra clave `await` para lograr una referencia síncrona.

En los módulos de componentes y los módulos de página, la función `load` se inyecta automáticamente para que los desarrolladores puedan cargar sincrónicamente los recursos necesarios.

<o-playground name="Ejemplo de componente de referencia síncrona" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "Ejemplo de componente OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Referencia asíncrona vs referencia síncrona

| Método de referencia | Palabra clave | Características |
|---------|-------|------|
| Referencia asíncrona | Etiqueta `l-m` | Carga no bloqueante, adecuada para componentes de carga bajo demanda |
| Referencia síncrona | Método `load` con palabra clave `await` | Carga bloqueante, asegura que el componente esté registrado antes de su uso |Las etiquetas `l-m` y el método `load` pueden cargar módulos de componentes; en general, se recomienda usar la etiqueta `l-m` para referenciar componentes de forma asíncrona, logrando así una carga no bloqueante y bajo demanda.