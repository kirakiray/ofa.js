Component(async (load) => {
    if (!window.hljs) {
        await load("./lib/highlight/highlight.min.js");
    }

    return {
        tag: "o-code",
        temp: true,
        data: {},
        ready() {
            // 获取templte的内容并设置
            let tempCode = this.$("template").html.trim();

            // 转义特殊字符
            tempCode = tempCode.replace(/</g, "&lt;");
            tempCode = tempCode.replace(/>/g, "&gt;");

            this.$codeEle.html = tempCode;

            // 高亮区域的代码
            hljs.highlightBlock(this.$codeEle.ele);
        }
    };
});