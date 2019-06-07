define(async (load) => {
    await load("./marked.min.js", "./highlight/highlight.min.js", "./highlight/hljs-dark.css", "./github-markdown.css", "./markdown.css");

    // 注册markdown标签
    $.register({
        tag: "markdown",
        data: {
            mdData: "",
            src: ""
        },
        attrs: ["src"],
        watch: {
            async src(e, val) {
                if (val) {
                    // 手动请求元素
                    let readme = await fetch(val);

                    // 读取文本模式
                    readme = await readme.text();

                    // 直接塞入
                    this.mdData = readme;
                }
            },
            mdData(e, context) {
                // 塞入转换的文本
                this.$mdShower.html = marked(context);

                // 高亮
                this.$mdShower.ele.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            }
        },
        temp: `
        <div xv-content style="display:none;"></div>
        <div xv-tar="mdShower" class="markdown-body"></div>
        `,
        inited() {
            let text = this.$content.text;
            
            // 获取content的内容
            this.mdData = text.trim();
        }
    });
});