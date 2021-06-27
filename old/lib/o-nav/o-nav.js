Component({
    tag: "o-nav",
    temp: true,
    data: {
        // 是否显示返回按钮
        back: true,
        // 按钮的颜色
        color: "#000"
    },
    proto: {
        // 点击返回按钮
        clickBack() {
            // 获取相应的page
            let page = this;
            while (!page.is('o-page')) {
                page = page.$host;
                if (!page) {
                    break;
                }
            }

            page.back();
        }
    }
});