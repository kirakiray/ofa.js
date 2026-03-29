# root



Usando el atributo `root` se puede obtener el nodo raíz del elemento.

En la página, el nodo raíz de los elementos comunes es una instancia de `document`.

<o-playground name="root - nodo raíz" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">I am target</li>
      </ul>
      <div id="logger" style="padding:16px;color:green;"></div>
      <script>
        setTimeout(()=>{
          $('#logger').text = $("#target").root.ele === document;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Elementos dentro de nodos de sombra

Dado que los elementos dentro del componente están aislados del entorno externo, la propiedad `root` de los elementos dentro del nodo sombra es el nodo raíz sombra.


<o-playground name="root - nodo de sombra" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-root.html"></l-m>
      <test-root></test-root>
      <script>
        setTimeout(()=>{
          $("test-root").shadow.$("#target").text = 'cambiar objetivo desde fuera - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-root.html" active>
    <template component>
        <ul>
            <li>elemento 1</li>
            <li id="target">elemento 2</li>
            <li>elemento 3</li>
        </ul>
        <h3>registrador1:</h3>
        <div id="logger1" style="color:red;">{{l1}}</div>
        <h3>registrador2:</h3>
        <div id="logger2" style="color:green;">{{l2}}</div>
        <script>
            export default {
                tag:"test-root",
                data:{
                    l1:"",
                    l2:""
                },
                ready(){
                    this.l1 = this.shadow.$("#target").root === this.shadow;
                    this.l2 = this.root.ele === document;
                }
            };
        </script>
    </template>
  </code>
</o-playground>

