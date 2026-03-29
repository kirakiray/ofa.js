# Características de los datos de ejemplo

La instancia de objeto obtenida o creada a través de `$` posee las características completas de datos de stanz, ya que la instancia de `$` hereda de stanz. Esto significa que puedes utilizar los métodos y características de manipulación de datos proporcionados por `stanz` para operar y monitorear los datos del objeto de instancia.

> El siguiente ejemplo utiliza elementos regulares, ya que los componentes personalizados suelen traer datos ya registrados, mientras que los elementos regulares normalmente solo contienen información de etiqueta, por lo que son más adecuados para la demostración.

## watch



Las instancias pueden observar cambios en los valores mediante el método `watch`; incluso si se modifica el valor de un subobjeto del objeto, el cambio también puede ser detectado en el método `watch` del objeto.

A continuación se muestra un ejemplo que demuestra cómo utilizar la instancia `$` y el método `watch`:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "Soy aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "Soy bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "cambiar bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们首先创建了一个 `$` 实例对象 `target`，然后使用 `watch` 方法来监听它的变动。即使我们改动了对象的子对象的值，例如 `target.bbb.child.val` 的值，在 `watch` 方法中都能监听到这些变动并更新 `logger` 元素的内容。这展示了 `$` 实例对象的强大特性，使你能够轻松监控对象的变化。

## watchTick



Los métodos `watchTick` y `watch` tienen funcionalidades similares, pero `watchTick` incluye una operación de throttling interna, ejecutándose una sola vez bajo un único hilo, por lo que puede escuchar cambios en los datos de manera más eficiente en escenarios con mayores requisitos de rendimiento.

A continuación se muestra un ejemplo que demuestra cómo utilizar el método `watchTick` de la instancia `$`:

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch ejecutado：' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick ejecutado：' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos un objeto instancia `$` llamado `target`. Luego, utilizamos los métodos `watch` y `watchTick` para observar los cambios del objeto. El método `watch` se ejecuta inmediatamente cuando los datos cambian, mientras que el método `watchTick` se ejecuta una sola vez en un solo hilo, por lo que puede limitar la frecuencia de las operaciones de observación. Puedes elegir utilizar el método `watch` o `watchTick` según tus necesidades para observar los cambios en los datos.

## unwatch



El método `unwatch` se utiliza para cancelar la escucha de datos, y puede revocar los escuchas de `watch` o `watchTick` registrados anteriormente.

Aquí hay un ejemplo que demuestra cómo usar el método `unwatch` de la instancia `$`:

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos una instancia del objeto `$` llamada `target`, y luego utilizamos los métodos `watch` y `watchTick` para registrar dos escuchas respectivamente. Posteriormente, pasamos los valores de retorno de las escuchas previamente guardados `tid1` y `tid2` a través del método `unwatch` para cancelar estas dos escuchas. Esto significa que los cambios de propiedad en el primer `setTimeout` no activarán ninguna escucha, ya que las escuchas han sido canceladas.

## Valor no observable

En la instancia `$`, los nombres de propiedades que comienzan con guion bajo `_` indican que estos valores no serán observados por los métodos `watch` o `watchTick`. Esto es muy útil para algunas propiedades temporales o privadas, ya que puedes modificarlas libremente sin desencadenar la observación.

Dentro de la plantilla, esto se conoce como [datos no reactivos](../../documentation/state-management.md).

A continuación se presenta un ejemplo que demuestra cómo usar valores de atributos que comienzan con un guión bajo para evitar ser monitoreados：

<o-playground name="stanz - 非响应式数据" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos una instancia del objeto `$` llamada `target`, y luego utilizamos el método `watch` para monitorear los cambios en los valores de las propiedades. En el `setTimeout`, intentamos modificar el valor de la propiedad `_aaa`, pero este cambio no activará el monitoreo. Esto es útil para situaciones en las que es necesario actualizar el valor de una propiedad sin desencadenar el monitoreo.

## Características básicas

设置在实例上的对象数据将被转换为 Stanz 实例，这种 Stanz 实例允许进行监听。

```javascript
const obj = {
  val: "Soy obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

También podemos usar `$.stanz` para crear un dato Stanz que no esté vinculado a una instancia.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

Estos ejemplos demuestran las características básicas de configurar datos de objetos como instancias de Stanz para su observación.

Para ver más características completas, consulta [stanz](https://github.com/ofajs/stanz).