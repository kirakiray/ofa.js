# Componente o-page

`o-page` es uno de los componentes principales en ofa.js, representa una página independiente o un módulo de página. A continuación se presentan algunas de las propiedades y métodos clave de `o-page`:

## atributo src

El atributo `src` se utiliza para especificar la dirección específica del módulo de página. Este es el atributo clave que especifica el contenido y comportamiento de la página, indicando a la aplicación desde dónde cargar el contenido de una página específica.

```javascript
const page = this;
```

## método goto

El método `goto` se utiliza para navegar desde la página actual a otra página. En comparación con el método `goto` de `app`, el método `goto` de `page` puede utilizar **direcciones relativas** para navegar a otras páginas.

```javascript
page.goto("./page2.html");
```

## Método replace

El método `replace` se utiliza para reemplazar la página actual por otra. Es similar al método `replace` de `app`, pero realiza la operación de reemplazo dentro de la página.

```javascript
page.replace("./nueva-página.html");
```

## Método back

El método `back` se utiliza para volver a la página anterior. Esto navega al usuario de regreso a la página previa, similar a la operación de retroceso del navegador.

```javascript
page.back();
```