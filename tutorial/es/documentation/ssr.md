# SSR y Renderizado Isomórfico

Si no tienes claro qué es el SSR, significa que actualmente no lo necesitas, así que puedes saltarte este capítulo y volver a él cuando lo necesites en el futuro.

## Renderizado isomórfico

Para mantener la experiencia fluida de CSR, una mejor identificación por parte de los rastreadores web (SEO) y una mayor libertad en la elección del lenguaje de desarrollo del backend, ofa.js ofrece un modo único de renderizado isomórfico (Symphony Client-Server Rendering).

Si desea conocer las definiciones específicas y las diferencias de CSR / SSR / SSG, lea directamente la sección al final de este artículo.

El concepto central del renderizado isomórfico es:- Renderizar el contenido inicial de la página en el servidor para garantizar SEO y velocidad de carga de la primera pantalla
- Gestionar el enrutamiento en el lado del cliente para mantener una experiencia de usuario fluida como en CSR
- Aplicable a cualquier entorno de servidor, logrando una renderización isomórfica real

### Principio de implementación del renderizado isomórfico

El modo de renderizado isomórfico de ofa.js se basa en los siguientes mecanismos:

1. El lado del servidor genera una página HTML completa con una estructura de ejecución universal
2. El lado del cliente carga el motor de ejecución CSR
3. Identifica automáticamente el entorno de ejecución actual y decide la estrategia de renderizado

### Estructura del código de renderizado isomórfico

**Módulo de página CSR original:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>Soy Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Página completa después del renderizado isomórfico encapsulado:**

```html
<!doctype html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Título de la Página</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 页面模块内容插入位置 ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>Soy la Página</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

Por lo tanto, puedes utilizar cualquier lenguaje de desarrollo (Go, Java, PHP, Nodejs, Python, etc.) y cualquier motor de renderizado de plantillas backend (como `html/template` de Go, Smarty/Twig/Blade de PHP, etc.) para incrustar la estructura de código de renderizado isomórfico de ofa.js en la plantilla y así lograr SSR.

* [Caso de SSR con Nodejs](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [Caso de SSR con PHP](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Caso de SSR con Go](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Estructura de la plantilla de renderizado isomórfico

Para implementar el modo de renderizado isomórfico, solo necesitas usar la siguiente estructura de plantilla genérica en el lado del servidor:

```html
<!doctype html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Título de la página</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Insertar dinámicamente el contenido del módulo de página correspondiente -->
  </o-app>
</body>

</html>
```

**Nota:** El HTML devuelto por el servidor debe establecer las cabeceras HTTP correctas: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` es el motor de renderizado isomórfico proporcionado por ofa.js. Determina automáticamente la estrategia de renderizado según el estado de ejecución de la página actual, garantizando la mejor experiencia de usuario en cualquier entorno.

Del mismo modo, SSG también puede aplicar esta estructura para lograr la generación de sitios estáticos.

## ofa.js y SSR y las diferencias con otros frameworks de frontend

La representación Cliente-Servidor de Symphony de ofa.js (en adelante, SCSR) es esencialmente también un modo SSR.

Comparado con las soluciones SSR de frameworks frontend existentes como Vue, React y Angular, la mayor ventaja de ofa.js radica en que **no requiere un acoplamiento obligatorio con Node.js**. Esto significa que cualquier motor de renderizado de plantillas backend (como Smarty de PHP, Jinja2 de Python, Thymeleaf de Java, etc.) puede integrar fácilmente ofa.js para implementar SSR.

## Descripción general de los métodos de renderizado de páginas web

Las aplicaciones web modernas principalmente utilizan cuatro métodos de renderizado: renderizado tradicional con motor de plantillas del lado del servidor, CSR (Client Side Rendering, renderizado del lado del cliente), SSR (Server Side Rendering, renderizado del lado del servidor) y SSG (Static Site Generation, generación de sitios estáticos). Cada método tiene sus ventajas y escenarios de aplicación.

### Renderizado tradicional de motor de plantillas del lado del servidor

En numerosos productos web, los motores de plantillas del lado del servidor siguen siendo el método principal de renderizado de páginas. Lenguajes de backend como Go, PHP, entre otros, utilizan motores de plantillas integrados o de terceros (como `html/template` de Go, o Smarty/Twig/Blade de PHP, etc.) para inyectar datos dinámicos en plantillas HTML, generando así una página HTML completa de una sola vez y enviándola al cliente.

**Ventajas:**- Amigable con SEO, carga rápida en la primera pantalla
- Control del lado del servidor, mayor seguridad
- Requisitos bajos para el stack tecnológico del equipo; los desarrolladores backend pueden completar el desarrollo por sí solos

**Desventaja:**- La experiencia de usuario es deficiente, cada interacción requiere una actualización de la página
- El servidor está bajo mucha presión
- El frontend y el backend tienen un alto acoplamiento, lo que no favorece la colaboración en la división del trabajo

### CSR (Renderizado del lado del cliente)

En el modo CSR, el contenido de la página se renderiza completamente mediante JavaScript del lado del navegador; la [aplicación de página única](./routes.md) de ofa.js es un ejemplo típico de implementación CSR. Este enfoque ofrece una experiencia de usuario fluida, permitiendo completar todas las interacciones sin necesidad de saltos de página. Las aplicaciones de página única (SPA) desarrolladas con React o Vue junto con sus respectivas bibliotecas de enrutamiento (como React Router o Vue Router) son implementaciones CSR típicas.

**Ventajas:**- Experiencia de usuario fluida, cambio de páginas sin recarga
- Alta capacidad de procesamiento del cliente, respuesta rápida

**Desventaja:**- No es favorable para el SEO, los motores de búsqueda tienen dificultades para indexar el contenido

### SSR (Renderizado del lado del servidor)

Al mismo tiempo que se mantiene la experiencia fluida de CSR, cambiar para que el servidor renderice las páginas en tiempo real: cuando el usuario realiza una solicitud, el servidor genera inmediatamente el HTML completo y lo devuelve, logrando una verdadera renderización del lado del servidor.

**Ventajas:**- Amigable con SEO, carga rápida en la primera pantalla
- Admite contenido dinámico

**Desventaja:**- Alta carga en el servidor
- Generalmente requiere un entorno Node.js como entorno de ejecución, o al menos una capa intermedia Node.js
- Todavía se requiere la activación del cliente posterior para lograr una interacción completa

### SSG (Generación de Sitios Estáticos)

Durante la fase de construcción, pre-renderiza todas las páginas en archivos HTML estáticos; después del despliegue, el servidor puede devolverlos directamente al usuario.

**Ventajas:**- Carga rápida en la primera visita, amigable con SEO
- Baja carga del servidor, rendimiento estable
- Alta seguridad

**Desventaja:**- Dificultad para actualizar contenido dinámico
- El tiempo de compilación aumenta con el número de páginas