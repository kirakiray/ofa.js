# Propiedades del objeto devuelto por el módulo

En ofa.js, ya sea un módulo de página o un módulo de componente, es necesario devolver un objeto mediante `export default async () => {}` para definir la configuración y el comportamiento del módulo. Este documento recopila todas las propiedades que puede contener el objeto devuelto.

## Descripción general de los atributos

| Propiedad | Tipo | Módulo de página | Módulo de componente | Descripción | Documentación relacionada |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ Requerido | Nombre de la etiqueta del componente | [Crear componente](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | Objeto de datos reactivo | [Respuesta de propiedades](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | Definición de atributos del componente | [Heredar atributos](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | Métodos y propiedades computadas | [Propiedades computadas](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | Observadores | [Observadores](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | Se llama cuando el DOM está creado | [Ciclo de vida](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | Se llama al montar en el DOM | [Ciclo de vida](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | Se llama al eliminar del DOM | [Ciclo de vida](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | Se llama cuando la carga está completa | [Ciclo de vida](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ Página padre | ❌ | Se llama cuando la ruta cambia | [Páginas/rutas anidadas](../../documentation/nested-routes.md) |> **Exportación especial**: `export const parent = "./layout.html"` - se utiliza para enrutamiento anidado, especifica la ruta de la página principal (no incluido en el objeto devuelto). Consulte [Páginas/Rutas anidadas](../../documentation/nested-routes.md) para más detalles.

## Atributos principales

### tag



`tag` es el nombre de la etiqueta del componente, **el módulo del componente debe definir este atributo**. El módulo de página no necesita definir `tag`.

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> Nota: El valor de `tag` debe coincidir con el nombre de la etiqueta al usar el componente.

### data



`data` es un objeto de datos reactivo que se utiliza para almacenar el estado de un componente o página. Cuando los datos cambian, la vista se actualiza automáticamente.

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "Zhang San",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> Nota: `data` es un objeto, no una función, a diferencia de Vue.

### attrs



`attrs` se utiliza para definir las propiedades del componente y recibir datos externos. Solo el módulo del componente necesita definir `attrs`.

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // Sin valor por defecto
      disabled: "",     // Con valor por defecto
      size: "medium"    // Con valor por defecto
    }
  };
};
```

Al usar el componente, pase las propiedades:

```html
<my-component title="título" disabled size="large"></my-component>
```

> Reglas importantes:
> - El valor del atributo pasado debe ser una cadena de texto, si no lo es se convertirá automáticamente en cadena
> - Conversión de nombres: `fullName` → `full-name` (formato kebab-case)
> - Las claves de `attrs` y `data` no pueden repetirse

### proto



`proto` se utiliza para definir métodos y propiedades computadas. Las propiedades computadas se definen usando las palabras clave `get` y `set` de JavaScript.

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // Definición de métodos
      increment() {
        this.count++;
      },
      
      // Propiedad calculada (getter)
      get doubleCount() {
        return this.count * 2;
      },
      
      // Propiedad calculada
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

Nota: ofa.js usa las palabras clave `get`/`set` para definir propiedades computadas, en lugar de la opción `computed` de Vue.

### watch



`watch` se utiliza para definir observadores que monitorizan cambios en los datos y ejecutan la lógica correspondiente.

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // Escucha un solo atributo
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // Escucha múltiples atributos
      "count,name"() {
        console.log('count o name ha cambiado');
      }
    }
  };
};
```

La función de callback del listener recibe dos parámetros:- `newValue`：El nuevo valor después del cambio
- `{ watchers }`：El objeto de todos los watchers del componente actual

## Hooks del ciclo de vida

Los hooks del ciclo de vida te permiten ejecutar lógica específica en diferentes etapas del componente.

### ready



El hook `ready` se llama cuando el componente está listo, en ese momento la plantilla del componente ya se ha renderizado, los elementos del DOM ya se han creado, pero es posible que aún no se hayan insertado en el documento.

```javascript
ready() {
  console.log('DOM creado');
  this.initDomElements();
}
```

### attached



El hook `attached` se llama cuando el componente es insertado en el documento, indicando que el componente ya se ha montado en la página.

```javascript
attached() {
  console.log('Montado en el DOM');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached



`detached` gancho se llama cuando el componente se elimina del documento, indicando que el componente está a punto de ser desmontado.

```javascript
detached() {
  console.log('Eliminado del DOM');
  clearInterval(this._timer);
}
```

### loaded



El hook `loaded` se activa después de que el componente, todos sus componentes secundarios y los recursos asincrónicos se hayan cargado completamente.

```javascript
loaded() {
  console.log('Completamente cargado');
}
```

### routerChange



`routerChange` gancho se llama cuando la ruta cambia, se utiliza solo para que la página padre escuche el cambio de página hijo.

```javascript
routerChange() {
  this.refreshActive();
}
```

## Orden de ejecución del ciclo de vida

```
ready → attached → loaded
                 ↓
              detached（cuando se elimina）
```

## Exportación especial：parent

`parent` se utiliza para rutas anidadas, especificando la ruta de la página padre de la página actual. Esta es una exportación independiente, que no se encuentra en el objeto retornado.

```html
<template page>
  <style>:host { display: block; }</style>
  <div>contenido de la subpágina</div>
  <script>
    // Especificar página principal
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## Ejemplo completo

### Módulo de componentes

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>Contador: {{count}}</p>
    <p>Doble: {{doubleCount}}</p>
    <button on:click="increment">Incrementar</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "Título predeterminado"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('contador cambiado a:', newVal);
          }
        },
        ready() {
          console.log('Componente listo');
        },
        attached() {
          console.log('Componente montado');
        },
        detached() {
          console.log('Componente desmontado');
        }
      };
    };
  </script>
</template>
```

### Módulo de página

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('Página lista');
        },
        
        attached() {
          console.log('Página montada');
          console.log('Parámetros de consulta:', query);
        },
        
        detached() {
          console.log('Página desmontada');
        }
      };
    };
  </script>
</template>
```

## Errores comunes

### 1. Clave duplicada en attrs y data

```javascript
// ❌ Error
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // Duplicado con attrs
};

// ✅ Correcto
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // Usar una clave diferente
};
```

### 2. Usar el estilo Vue para definir propiedades computadas

```javascript
// ❌ Incorrecto
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ Correcto
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. Los datos se definen como una función

```javascript
// ❌ Incorrecto
return {
  data() {
    return { count: 0 };
  }
};

// ✅ Correcto
return {
  data: {
    count: 0
  }
};
```

### 4. Posición errónea de la definición del método

```javascript
// ❌ Incorrecto
return {
  methods: {
    handleClick() {}
  }
};

// ✅ Correcto
return {
  proto: {
    handleClick() {}
  }
};
```