const STAT = Symbol("stat");

// 定义新类型 xd-page
$.register({
    tag: "xd-page",
    async created() {
        let opts = {
            temp: `haha`,
            attrs: ["src"],
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

                    if (!val) {
                        return;
                    }

                    this[STAT] = "loading";
                }
            },
            ready() {
                this[STAT] = "unload";
            }
        };

        return opts;
    }
});