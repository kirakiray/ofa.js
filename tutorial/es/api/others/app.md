# Componente o-app

`o-app` es uno de los componentes centrales en ofa.js, utilizado para configurar y gestionar toda la aplicación. A continuación, se presentan algunas propiedades y métodos clave de app:

## src



El atributo `src` se utiliza para especificar la dirección específica del módulo de configuración de parámetros de la aplicación.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



La propiedad `current` se utiliza para obtener la instancia de la página que se está mostrando. Esto puede ayudarle a acceder y manipular la página que se está mostrando actualmente, por ejemplo, actualizar su contenido o ejecutar operaciones específicas.

```javascript
const currentPage = app.current;
```

## goto



El método `goto` se utiliza para saltar a una página específica. Puedes pasar la dirección de la página de destino, y la aplicación cargará y mostrará esa página. Este es un método importante para la navegación de la aplicación.

```javascript
app.goto("/page2.html");
```

## replace



El método `replace` es similar a `goto`, pero se utiliza para reemplazar la página actual en lugar de añadir una nueva página a la pila. Esto puede usarse para realizar un reemplazo de página en lugar de una navegación por pila.

```javascript
app.replace("/new-page.html");
```

## back



El método `back` se utiliza para regresar a la página anterior, implementando la operación de retroceso en la navegación de páginas. Esto lleva al usuario de vuelta a la página previa.

```javascript
app.back();
```

## routers



El atributo `routers` contiene la información de configuración de rutas de la aplicación. Es un atributo importante que define las reglas de enrutamiento y el mapeo de cada página dentro de la aplicación. La configuración de rutas determina la navegación entre páginas y cómo se manejan las URL.

```javascript
const routeConfig = app.routers;
```