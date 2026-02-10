# 列表渲染

## 直接渲染

<o-playground style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <ul>
        <o-fill :value="arr">
          <li>{{$data.val}} - {{$index}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
                arr: [{
                    val: "🍎 苹果",
                },{
                    val: "🍏 绿苹果",
                },{
                    val: "🍐 梨",
                }],
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 模板渲染

<o-playground style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <ul>
        <o-fill :value="arr" name="test-item"></o-fill>
      </ul>
      <template name="test-item">
        <li>{{$data.val}} - {{$index}}</li>
      </template>
      <script>
        export default async () => {
          return {
            data: {
                arr: [{
                    val: "🍎 苹果",
                },{
                    val: "🍏 绿苹果",
                },{
                    val: "🍐 梨",
                }],
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 循环模板渲染

<o-playground style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <ul>
        <o-fill :value="arr" name="test-item"></o-fill>
      </ul>
      <template name="test-item">
        <li>{{$data.val}} - {{$index}}
          <ul>
            <o-fill :value="$data.child" name="test-item"></o-fill>
          </ul>
        </li>
      </template>
      <script>
        export default async () => {
          return {
            data: {
                arr: [{
                    val: "🥬 蔬菜",
                },{
                    val: "🍉 水果",
                    child: [{
                        val: "🍎 苹果",
                        child: [{
                            val: "🍏 绿苹果",
                        }],
                    },{
                        val: "🍐 梨",
                    }]
                },{
                    val: "🌰 坚果",
                }],
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>