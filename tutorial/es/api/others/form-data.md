# formData



`formData` es un método que se utiliza para generar datos de objetos vinculados a elementos de formulario, lo que hace que el procesamiento de elementos de formulario sea más simple y eficiente. Este método genera un objeto que contiene los valores de todos los elementos de formulario dentro del elemento objetivo, y este objeto reflejará en tiempo real los cambios en los elementos del formulario.

En el siguiente ejemplo, demostramos cómo utilizar el método `formData` para generar datos de objeto vinculados a los elementos del formulario:

<o-playground name="formData - uso básico" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sexo:
          <label>
            hombre
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            mujer
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos un formulario que contiene un campo de entrada de texto, botones de opción y un área de texto, y utilizamos el método `formData` para crear un objeto `data` que incluye los valores de estos elementos del formulario. También utilizamos el método `watch` para observar los cambios en los datos y mostrarlos en tiempo real en la página. Cuando el usuario modifica los valores de los elementos del formulario, el objeto `data` se actualiza en consecuencia, lo que hace que el procesamiento de datos sea muy simple y eficiente.

## Enlace de datos bidireccional

Los datos del objeto generado también tienen capacidad de enlace bidireccional, lo que significa que cuando modificas las propiedades del objeto, los valores de los elementos del formulario relacionados también se actualizan automáticamente. Esto es muy útil al manejar datos de formularios, ya que puedes implementar fácilmente el enlace de datos bidireccional.

En el siguiente ejemplo, demostramos cómo usar los datos de objetos generados por el método `formData`, y cómo realizar la vinculación de datos inversa：

<o-playground name="formData - enlace inverso" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sexo:
          <label>
            hombre
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            mujer
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">¡Hola Mundo!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        setTimeout(()=>{
          data.username = "Yao";
          data.sex = "man";
          data.message = "¡ofa.js es genial!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos un formulario que incluye un cuadro de texto, botones de opción y un área de texto, luego utilizamos el método `formData` para generar un objeto de datos `data`. Posteriormente, al modificar las propiedades del objeto `data`, logramos un enlace de datos bidireccional, es decir, los valores de los elementos del formulario se actualizan automáticamente cuando se cambian las propiedades del objeto. Esta funcionalidad de enlace de datos bidireccional hace que la interacción con los datos del formulario sea más conveniente.

## Escuchar un formulario específico

Por defecto, el método `formData()` escuchará todos los elementos `input`, `select` y `textarea` dentro del elemento objetivo. Pero si solo quieres escuchar elementos de formulario específicos, puedes hacerlo pasando un selector CSS.

En el siguiente ejemplo, demostramos cómo escuchar elementos de formulario específicos pasando selectores CSS：

<o-playground name="formData - formulario específico" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          sexo:
          <label>
            hombre
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            mujer
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">Este elemento del formulario no está vinculado</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData(".use-it");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, solo queremos escuchar los elementos de formulario que tengan `class` "use-it", por lo que pasamos `".use-it"` como parámetro al método `formData()`. De esta manera, solo los elementos de formulario con ese nombre de clase serán escuchados e incluidos en el objeto de datos generado. Esto es muy útil para escuchar selectivamente elementos de formulario, para gestionar tus datos de formulario con mayor precisión.

## Formulario personalizado

El uso de componentes de formulario personalizados es muy sencillo, solo necesita agregar un **atributo value** al componente personalizado y establecer el **atributo name**.

<o-playground name="formData - Formulario personalizado" style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <div id="myForm">
        <input type="text" name="username" value="John Doe" />
        <l-m src="./custom-input.html"></l-m>
        <custom-input name="message"></custom-input>
        <div id="logger"></div>
      </div>
      <script>
        const data = $("#myForm").formData("input,custom-input");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
  <code path="custom-input.html">
    <template component>
      <style>
        :host{
          display: block;
        }
        .editor {
          display: inline-block;
          min-width: 200px;
          line-height: 30px;
          height: 30px;
          border: #aaa solid 1px;
          border-radius: 4px;
          padding: 4px;
          font-size: 14px;
        }
      </style>
      <div
        class="editor"
        contenteditable="plaintext-only"
        :text="value"
        on:input="changeText"
      ></div>
      <script>
        export default {
          tag:"custom-input",
          attrs: {
            name: "",
          },
          data: {
            value: "Texto por defecto",
          },
          proto: {
            changeText(e) {
              this.value = $(e.target).text;
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

Cuando utilizas un componente de formulario personalizado, solo necesitas añadirlo a tu formulario y establecer el atributo `name` requerido. En el ejemplo anterior, usamos el componente de formulario personalizado añadiendo el elemento `<custom-input>` y configurando el atributo `name`. Luego, utilizamos el método `formData()` para escuchar los valores de los elementos de entrada y de los componentes personalizados, permitiendo obtener y procesar los datos del formulario en tiempo real. Este enfoque te permite ampliar tu formulario de manera muy conveniente para incluir componentes de formulario personalizados y satisfacer tus necesidades específicas.

## Usar datos de formulario dentro de componentes o páginas

A veces, puede que necesites utilizar datos de formulario dentro de un componente o página, y necesites generar los datos durante el ciclo de vida `attached` y vincularlos al componente.

<o-playground name="formData - Uso en componentes" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./form-data-demo.html"></l-m>
      <form-data-demo></form-data-demo>
    </template>
  </code>
  <code path="form-data-demo.html" active>
    <template component>
      <style>
        :host{
          display: block;
        }
      </style>
      <input type="text" name="username" value="John Doe" />
      <div>{{logtext}}</div>
      <script>
        export default {
          tag:"form-data-demo",
          data: {
            fdata:{},
            logtext: ""
          },
          watch:{
            fdata(data){
              if(data){
                this.logtext = JSON.stringify(data);
              }
            }
          },
          attached(){
            this.fdata = this.shadow.formData();
          }
        };
      </script>
    </template>
  </code>
</o-playground>

A través del ciclo de vida `attached`, una vez que el componente está listo, utilizamos el método `this.shadow.formData()` para generar el objeto de datos del formulario `fdata`.

`formData()` es más adecuado para escenarios de formulario con una lógica de interacción relativamente sencilla.