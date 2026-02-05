# 快速上手

让我们快速开始来写第一个渲染代码。

<o-playground style="--editor-height: 300px">
    <template>
    <div id="target1">
        <p>Hello NoneOS Demo Code</p>
    </div>
    <script>
        let count = 0;
        setInterval(() => {
        $("#target1").text = "change text " + count++;
        }, 500);
    </script>
    </template>
</o-playground>

<l-m src="https://cdn.jsdelivr.net/gh/ofajs/playground/comps/o-playground/o-playground.html"></l-m>