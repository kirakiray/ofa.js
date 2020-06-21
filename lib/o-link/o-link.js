Component({
    tag: "o-link",
    temp: true,
    data: {
        to: ""
    },
    attrs: ["to"],
    proto: {
        // 链接到
        linkTo(e) {
            // 获取相应的page
            let page = this;
            while (!page.is('o-page')) {
                page = page.$host;
                if (!page) {
                    break;
                }
            }

            if (page) {
                // 阻止默认跳转行为
                e.preventDefault();

                if (!this.to) {
                    console.error('o-link must have "to"', this);
                    return;
                }

                // 跳转到相应页面
                page.navigate(this.to);
            }
        }
    },
});