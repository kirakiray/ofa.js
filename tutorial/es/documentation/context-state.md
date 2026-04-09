# Estado de contexto

El estado de contexto es un mecanismo en ofa.js para compartir datos entre componentes. A través del patrón de proveedor (Provider) y consumidor (Consumer), se puede lograr la transferencia de datos entre componentes padre e hijo, y entre componentes de diferentes niveles, sin necesidad de pasar a través de props capa por capa.

## Conceptos centrales

- **o-provider**: proveedor de datos, define los datos que deben compartirse
- **o-consumer**: consumidor de datos, obtiene los datos del proveedor más cercano
- **watch:xxx**: escucha los cambios en los datos del consumidor y los vincula a las propiedades del componente o módulo de página

## o-provider Proveedor

El componente `o-provider` se utiliza para definir proveedores de datos compartidos. Se identifica a sí mismo mediante el atributo `name` y define los datos que se compartirán a través de atributos (como `custom-a="value"`).

```html
<o-provider name="userInfo" custom-name="Zhang San" custom-age="25">
  ...
</o-provider>
```

### Atributos

- `name`: el nombre único del proveedor, utilizado para que los consumidores encuentren el proveedor correspondiente

### Características

1. **Paso automático de atributos**: todos los atributos no reservados del provider se transmiten como datos compartidos
2. **Actualización reactiva**: cuando cambian los datos del provider, el consumer correspondiente que utiliza ese provider y tenga el mismo name se actualiza automáticamente
3. **Búsqueda jerárquica**: el consumer busca los datos del name correspondiente comenzando desde el provider más cercano ascendente

## o-consumer Consumidor

El componente `o-consumer` se utiliza para consumir (usar) los datos del proveedor. Especifica el nombre del proveedor que se desea consumir mediante el atributo `name`.

```html
<o-consumer name="userInfo"></o-consumer>
```

### Atributos

- `name`: Nombre del proveedor a consumir

### Características

1. **Obtención automática de datos**: el consumer obtendrá automáticamente los datos correspondientes al nombre del provider superior más cercano
2. **Fusión de propiedades**: si múltiples providers con el mismo nombre tienen una propiedad, la propiedad del provider más cercano al consumer tiene prioridad
3. **Observación de propiedades**: se puede observar cambios en propiedades específicas mediante `watch:xxx`

## Escuchar cambios en los datos

Puedes escuchar los cambios en los datos del proveedor mediante `watch:xxx`:

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## Ejemplos básicos

<o-playground name="Ejemplo básico" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>ID de usuario: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      Avatar {{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      Usuario-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider Proveedor raíz

`o-root-provider` es un proveedor global a nivel raíz; su ámbito abarca todo el documento. Incluso sin un proveedor padre, los consumidores pueden obtener los datos del proveedor raíz.

```html
<!-- Definir proveedor de raíz global -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Se puede consumir en cualquier parte de la página -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### Características

1. **Ámbito global**: Los datos del proveedor raíz están disponibles en toda la página
2. **Prioridad**: Cuando existen simultáneamente un provider y un root-provider con el mismo nombre, tiene prioridad el provider más cercano al consumidor
3. **Removible**: Después de eliminar el root-provider, el consumidor volverá a buscar otros providers

## Ejemplo de root-provider

<o-playground name="Ejemplo de root-provider" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>Tema: {{theme}}</div>
        <div>Idioma: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Encabezado - Tema: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Contenido - Idioma: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Ejemplo de prioridad

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- Aquí👇 el custom-value obtenido es "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- Aquí👇 el custom-value obtenido es "root" -->
<o-consumer name="test"></o-consumer>

```

### Ejemplo de demostración de prioridad

<o-playground name="Ejemplo de demostración de prioridad" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>Valor en el Provider padre: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>Valor del Provider raíz: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        Valor en el componente hijo: {{customValue}} (el más cercano es el provider {{customValue}})
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## Método getProvider(name)

`getProvider(name)` es un método de instancia que se utiliza para obtener el elemento proveedor correspondiente al nombre. Busca hacia arriba en el DOM el proveedor ancestro más cercano; si no lo encuentra, devuelve el root-provider.

### Uso del método getProvider(nombre) dentro de componentes o módulos de página

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

## Ejemplo de getProvider

<o-playground name="Ejemplo de getProvider" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="ZhangShan" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Obtener datos del Provider</button>
      <div>Nombre actual: {{currentName}}</div>
      <div>Edad actual: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Modificar datos del Provider</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider encontrado:", provider);
                console.log("Nombre:", provider.customName);
                console.log("Edad:", provider.customAge);
                alert(`Datos del Provider: ${provider.customName}, ${provider.customAge} años`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "LiSi";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Obteniendo el proveedor desde el elemento

```javascript
// Obtener el proveedor superior del elemento actual
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("Proveedor encontrado:", provider.customName);
}

// Obtener directamente el proveedor raíz global
const globalProvider = $.getRootProvider("globalConfig");
```

### Escenarios de uso

1. **Obtención manual de datos**: se utiliza en escenarios que requieren acceso directo a los datos del proveedor  
2. **A través de Shadow DOM**: busca el proveedor superior dentro del Shadow DOM  
3. **Manejo de eventos**: obtiene el proveedor correspondiente en la devolución de llamada del evento

## Despacho de eventos

El provider puede emitir eventos a todos los consumers que lo consumen:

```html
<o-provider name="test" id="myProvider" custom-value="Hola">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// Despachar evento
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hola Mundo" }
});
</script>
```

## Ejemplo de distribución de eventos

<o-playground name="Ejemplo de envío de eventos" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["Bienvenido a la sala de chat"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>Sala de chat</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="Escribe un mensaje...">
      <button on:click="sendMessage">Enviar</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Mejores prácticas

1. **Nombrado apropiado**: Utilice nombres significativos para el proveedor y el consumidor para facilitar el seguimiento y el mantenimiento.
2. **Evitar el uso excesivo**: El estado de contexto es adecuado para compartir datos entre componentes; para componentes padre-hijo normales se recomienda usar props.
3. **Proveedor raíz para configuración global**: Temas, idiomas, estados globales, etc., son adecuados para usar con root-provider.
4. **Limpieza oportuna**: Cuando se elimina un proveedor, el consumidor elimina automáticamente los datos, no es necesario manejarlo manualmente.