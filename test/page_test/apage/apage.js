define({
    // 页面初始化
    ready(e) {
        console.log("ready => ", this, e);
    },
    // 页面关闭
    destory() {
        console.log("destory => ", this);
    },
    // 页面被激活
    onActive(e) {
        console.log("active => ", this, e);
    },
    proto: {
        get haha() {
            return this.a1 + " " + this.b1;
        },
        gotoSelf() {
            this.navigate({
                src: "./apage.js?new=haha",
                data: {
                    val: "I come form self"
                }
            });
        },
        gotoPage2() {
            this.navigate({
                src: "../apage2 -pack"
            });
        }
    },
    data: {
        a1: "a111111111",
        b1: "b1111111111"
    }
});