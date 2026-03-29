# classList



Die `classList`-Eigenschaft ist mit der nativen Implementierung identisch. Du kannst [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) verwenden, um Klassen hinzuzufügen, zu entfernen und umzuschalten.

Hier ist ein Beispiel, das zeigt, wie man `classList` verwendet:

<o-playground name="classList - Verwendungsbeispiel" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">Ursprungstext</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Die Eigenschaft `classList` ermöglicht es dir, Klassennamen mühelos hinzuzufügen, zu entfernen und zu wechseln, um den Stil eines Elements dynamisch zu ändern.