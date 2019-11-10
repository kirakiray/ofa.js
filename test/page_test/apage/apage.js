Page({
    // 页面初始化
    ready() {
        console.log("onpage => ", this);

        this.$btn.on("click", e => {
            console.log("click haha ");
            this.app.navigate({
                url: "./apage -pack"
            });
        });
    },
    // 页面关闭
    destory() {
        console.log("destory => ", this);
    },
    // 页面被激活
    onActive() { },
    proto: {
        get haha() {
            return this.a1 + " " + this.b1;
        }
    },
    data: {
        a1: "a111111111",
        b1: "b1111111111"
    }
});