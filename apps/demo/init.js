define({
    data: {
        // 添加的首页
        home: "pages/main -p"
    },
    proto: {
        // shareHash 的 get 和 set 一定要成对应关系，并且必须同时出现
        // 显示出来的hash
        get shareHash() {
            // 可设置
            console.log("get share hash => ", this.currentPage.src);
            return this.currentPage.src;
        },
        // 通过外部 shareHash 进入的app
        // 用于地址栏直接载入地址用
        set shareHash(hash) {
            if (hash) {
                // 直接添加
                this.router.push(hash);
                // this.router.splice(0, 10, hash);
            }
        }
    },
    // 初始化完成
    ready() {
        load("../../lib/router/address.js").then(init => {
            init();
        });

        // 可通过 location.hash 获取分享数据，并添加到路由
        // 如果在ready添加了router，那么 home 和 set shareHash 将不会被触发
    }
});