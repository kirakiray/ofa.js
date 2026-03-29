# Consulta de estilos

`match-var` es un componente funcional en ofa.js que se utiliza para hacer coincidir estilos según variables CSS. Con `match-var`, puedes coincidir y aplicar dinámicamente diferentes estilos en función del valor de la variable CSS del componente actual. Esta característica está diseñada específicamente para la transmisión de estados relacionados con estilos, no requiere JavaScript, es más conveniente de usar y es adecuada para necesidades de transmisión de estilos como colores de tema.

## Conceptos centrales

- **match-var**: Componente de coincidencia de estilos, determina si aplicar los estilos internos según el valor de la variable CSS
- **Coincidencia de atributos**: Define las variables CSS y los valores esperados a coincidir a través de los atributos del componente
- **Aplicación de estilos**: Cuando la coincidencia es exitosa, los estilos dentro de la etiqueta `<style>` se aplicarán al componente

## Uso básico

El componente `match-var` define las variables CSS que deben coincidir y los valores esperados a través de atributos. Cuando el valor de la variable CSS del componente coincide con el valor del atributo especificado, se aplican los estilos definidos internamente.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Atributos

El componente `match-var` utiliza atributos arbitrarios para definir las reglas de coincidencia de variables CSS. El nombre del atributo corresponde al nombre de la variable CSS (sin el prefijo `--`), y el valor del atributo es el valor esperado para la coincidencia.

### Cómo funciona

1. **Soporte del navegador**: si el navegador admite la consulta `@container style()`, utilizará directamente la capacidad nativa de CSS  
2. **Tratamiento de respaldo**: si no es compatible, detectará los cambios en los valores de las variables CSS mediante sondeo y, tras una coincidencia exitosa, inyectará dinámicamente los estilos  
3. **Actualización manual**: se puede activar manualmente la detección de estilos con el método `$.checkMatch()`

## Ejemplos básicos

<o-playground name="Ejemplo básico" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">Cambiar tema</button> - Tema:{{currentTheme}}
      <div class="container">
        <theme-box>
          Mostrar diferentes estilos según la variable CSS
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Mostrar tema claro
        </theme-box>
        <theme-box style="--theme: dark;">
          Mostrar tema oscuro
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Coincidencia de múltiples condiciones

Puedes usar múltiples atributos simultáneamente para definir condiciones de coincidencia más complejas; los estilos solo se aplicarán cuando coincidan todas las variables CSS.

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## Ejemplo de coincidencia con múltiples condiciones

<o-playground name="Ejemplo de coincidencia de atributos" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>Tema: {{theme}} <button on:click="changeTheme">Cambiar tema</button></div>
      <div>Tamaño: {{size}} <button on:click="changeSize">Cambiar tamaño</button></div>
      <div class="content">
        <test-card>
          <div>Ejemplo de coincidencia de estilos con múltiples condiciones</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch actualización manual

En algunos casos, los cambios en las variables CSS pueden no ser detectados automáticamente. En este caso, se puede llamar manualmente al método `$.checkMatch()` para activar la detección de estilos.

> Actualmente Firefox aún no admite las consultas `@container style()`, por lo que es necesario invocar manualmente `$.checkMatch()`; cuando el navegador admita esta funcionalidad de forma nativa en el futuro, el sistema detectará automáticamente los cambios en las variables y ya no será necesario activarlo manualmente.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Disparar manualmente la detección de estilos
    $.checkMatch();
  }
}
```

## Mejores prácticas

1. **Prioriza las capacidades nativas de CSS**: `match-var` utilizará primero la consulta nativa del navegador `@container style()`, lo que ofrece mejor rendimiento en navegadores modernos
2. **Organiza los estilos de forma adecuada**: agrupa los estilos relacionados para facilitar su mantenimiento y comprensión
3. **Utiliza el enlace con data()**: combinado con la directiva `data()` permite cambiar estilos de forma reactiva