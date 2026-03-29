# ele



Grâce à la propriété `ele`, vous pouvez obtenir l'[élément Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) réel de l'instance, vous permettant ainsi d'utiliser les propriétés ou méthodes natives.

<o-playground name="ele - 获取元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">Je suis la cible</li>
      </ul>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=>{
          var ele = $("#target").ele;
          ele.innerHTML = '<b>changer la cible</b>';
          \$("#logger").text = ele.clientWidth;
        },500);
      </script>
    </template>
  </code>
</o-playground>

