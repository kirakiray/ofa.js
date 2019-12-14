Page({
    // 页面初始化
    ready() {
        console.log("ready => ", this);
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
        },
        gotoSelf() {
            this.navigate({
                url: "./apage -pack"
            });
        }
    },
    data: {
        a1: "a111111111",
        b1: "b1111111111"
    }
});