# prev



En utilisant la propriété `prev`, vous pouvez obtenir l'instance de l'élément adjacent précédent.

<o-playground name="prev - élément précédent" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">Je suis 1</li>
        <li id="target">Je suis la cible</li>
        <li>Je suis 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').prev.text = "modifier l'élément précédent de la cible";
          \$("#logger1").text = \$('#first') === $('#target').prev
        },500);
      </script>
    </template>
  </code>
</o-playground>

