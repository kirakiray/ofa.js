Page(async () => {
    return {
        // 页面初始化
        ready() {
            console.log("ready => ", this);
        },
        // 页面关闭
        destory() {
            console.log("destory => ", this);
        },
        // 页面被激活
        onShow(e) {
            console.log("onShow apage2 => ", this, e);
        },
        proto: {
            get haha() {
                return this.a1 + " " + this.b1;
            },
            gotoSelf() {
                this.navigate({
                    type: "replace",
                    src: "../apage -pack"
                });
            },
            test2() {
                this.navigate({
                    src: "../apage -pack"
                });

                setTimeout(() => {
                    this.navigate({
                        src: "./apage2"
                    });
                }, 1000);
            }
        },
        data: {
            a1: "a111111111",
            b1: "b1111111111"
        },
        css: true
    };
});