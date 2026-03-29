# style

The `style` attribute remains consistent with the native implementation.

Note: the `style` attribute can only retrieve values explicitly set on it, not the actual computed styles. Although the `style` method resembles the [css method](./css.md), it cannot perform a full style override. Compared with `css`, the `style` method is more efficient internally.

Here is an example demonstrating how to use `style`:

<o-playground name="style - direct usage" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Please remember that the `style` method only gets and sets values on the `style` attribute, not the actual computed styles.

## Template Syntax Usage

You can also use template syntax to set the style of the target element.

<o-playground name="style - Template Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

