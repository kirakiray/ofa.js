Component({
    tag: "ki-nav",
    hostlink: "./ki-nav-host.css",
    proto: {
        refreshActive() {
            let { pathname } = document.location;

            // 超找拥有这个href的标签
            let target = this.que(`[href="${pathname}"]`);
            if (target) {
                target.class.add("ki_nav_active");
                target.removeAttr("href");
            }
        }
    },
    inited() {
        // 设置到data上
        this.queAll("a").forEach(ele => {
            ele.data.href = ele.attr("href");
        });

        // 刷新激活按钮
        this.refreshActive();
    },
    shadowLink: true
});