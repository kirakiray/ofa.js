# prev



Usando el atributo `prev`, puedes obtener la instancia del elemento hermano anterior del elemento.

<o-playground name="prev - elemento anterior" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">Soy 1</li>
        <li id="target">Soy el objetivo</li>
        <li>Soy 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').prev.text = "cambiar elemento anterior del objetivo";
          \$("#logger1").text = \$('#first') === $('#target').prev
        },500);
      </script>
    </template>
  </code>
</o-playground>

