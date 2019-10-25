Page({
    // 页面初始化
    onLoad(d) { },
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