const STAT = Symbol("stat");

// 定义新类型 xd-page
$.register({
    tag: "xd-page",
    async created() {
        debugger


        return {
            temp: `haha`,
            // attrs: ["src"],
            data: {
                src: "",
            },
            proto: {
                get stat() {
                    return this[STAT];
                }
            },
            watch: {
                src(e, val) {
                    if (this[STAT] != "unload") {
                        throw {
                            target: this,
                            desc: `this page is ${this.stat}!`
                        };
                    }

                    debugger

                    if (!val) {
                        return;
                    }

                    this[STAT] = "loading";

                    // 请求文件
                    debugger
                }
            },
            ready() {
                this[STAT] = "unload";
            }
        };
    }
});