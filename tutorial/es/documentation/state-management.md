# Gestión de Estado

## ¿Qué es el estado?

En ofa.js, **estado** se refiere a la propiedad `data` propia del componente o módulo de página. Este estado solo se puede usar en el componente actual y sirve para almacenar y gestionar los datos internos de ese componente.

Cuando varios componentes o páginas necesitan compartir los mismos datos, la práctica tradicional consiste en pasarlos a través de eventos o mediante props capa por capa, lo cual en aplicaciones complejas hace que el código sea difícil de mantener. Por lo tanto, se necesita la **gestión del estado**—mediante la definición de un objeto de estado compartido, se permite que varios componentes o módulos de página accedan y modifiquen estos datos, logrando así la compartición del estado.

> **Consejo**: La gestión del estado es adecuada para escenarios que requieren compartir datos entre componentes y páginas, como información del usuario, carrito de compras, configuración de temas, configuración global, etc.

## Generar objeto de estado

Crea un objeto de estado reactivo mediante `$.stanz({})`. Este método recibe un objeto común como datos iniciales y devuelve un proxy de estado reactivo.

### Uso básico

<o-playground name="Ejemplo de Gestión de Estado" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Dirección de la página de inicio de la aplicación
    export const home = "./list.html";
    // Configuración de animación de cambio de página
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "Peter",
        info: "Cada día es un nuevo comienzo, el sol siempre sale después de la tormenta.",
    },{
        id: 10020,
        name: "Mike",
        info: "La vida es como un océano, solo los de voluntad fuerte pueden llegar a la otra orilla.",
    },{
        id: 10030,
        name: "John",
        info: "El secreto del éxito es persistir en tus sueños y nunca rendirse.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>Directorio de Contactos</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Nombre: {{$data.name}} <button on:click="$host.gotoDetail($data)">Detalles</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // Al destruir el componente, vaciar los datos de estado montados
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Atrás</button> </div>
      <div class="user-info">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">
        Nombre de Usuario: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">ID de Usuario: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // Al destruir el componente, vaciar los datos de estado montados
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Características del objeto de estado

### 1. Actualización responsiva

El objeto de estado creado por `$.stanz()` es reactivo. Cuando los datos del estado cambian, todos los componentes que hacen referencia a esos datos se actualizarán automáticamente.

```javascript
const store = $.stanz({ count: 0 });

// 在组件中
export default {
  data: {
    store: {}
  },
  proto:{
    increment() {
        store.count++; // 所有引用了 store.count 的组件都会自动更新
    }
  },
  attached() {
    // 直接引用状态对象的属性
    this.store = store;
  },
  detached(){
    this.store = {}; // 组件销毁时，清空挂载的状态数据
  }
};
```

### 2. Reactividad profunda

Los objetos de estado admiten reactividad profunda; los cambios en objetos y arrays anidados también son escuchados.

```javascript
const store = $.stanz({
  user: {
    name: "张三",
    settings: {
      theme: "dark"
    }
  },
  list: []
});

// 修改嵌套属性也会触发更新
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新任务" });
```

## Mejores prácticas

### 1. Montar estado en la etapa attached del componente

Se recomienda montar el estado compartido en el ciclo de vida `attached` del componente:

```javascript
export default {
  data: {
    list: []
  },
  attached() {
    // Montar el estado compartido en el data del componente
    this.list = data.list;
  },
  detached() {
    // Cuando el componente se destruye, vaciar los datos de estado montados para evitar fugas de memoria
    this.list = [];
  }
};
```

### 2. Gestionar adecuadamente el ámbito del estado

- **Estado global**: adecuado para datos a los que toda la aplicación necesita acceder (como información del usuario, configuración global)
- **Estado del módulo**: adecuado para datos compartidos dentro de un módulo de funcionalidad específico

```javascript
// Estado de llamada global
export const globalStore = $.stanz({ user: null, theme: "light" });

// Estado utilizado dentro del módulo
const cartStore = $.stanz({ total: 0 });
```

## Gestión del estado dentro del módulo

<o-playground name="Ejemplo de gestión de estado dentro del módulo" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">Add Item</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Add Store Total</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // 组件销毁时，清空挂载的状态数据
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Precauciones

1. **Limpieza de estado**: en el ciclo de vida `detached` del componente, limpia de forma oportuna las referencias a los datos de estado para evitar pérdidas de memoria.

2. **Evita dependencias cíclicas**: los objetos de estado no deben formar referencias cíclicas, ya que podrían causar problemas en el sistema reactivo.

3. **Estructuras de datos grandes**: para estructuras de datos grandes, considera usar propiedades computadas o gestión por fragmentos para evitar costes de rendimiento innecesarios.

4. **Consistencia del estado**: en operaciones asíncronas, presta atención a la consistencia del estado; puedes usar transacciones o actualizaciones por lotes para garantizar la integridad de los datos.

