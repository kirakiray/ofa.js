define(async (load) => {

    let {
        todoitem
    } = await load("./temp.dcode -inner");

    $.register({
        tag: "todoitem",
        temp: todoitem,
        data: {
            // 任务名
            name: "默认名",
            // 右边的展示时间
            showTime: "0 min",
            // 制定的时间
            time: (new Date().getTime()) / 1000,
            // 是否完成
            doType: "undo"
        },
        attrs: ["name", "time"],
        proto: {
            // 刷新时间显示
            refreshShow() {
                let diffTime = new Date(this.time * 1000).getTime() - new Date().getTime();

                diffTime /= 1000;

                // 显示时间
                let showTime = "";

                if (diffTime < 0) {
                    showTime = "LATE";
                } else if (diffTime <= 60) {
                    showTime = "1 min";
                } else if (diffTime <= 300) {
                    showTime = "5 min";
                } else if (diffTime <= 600) {
                    showTime = "10 min";
                } else if (diffTime <= 1800) {
                    showTime = "30 min";
                } else if (diffTime <= 3600) {
                    showTime = "1 hours";
                } else if (diffTime <= 7200) {
                    showTime = "2 hours";
                } else if (diffTime <= 10800) {
                    showTime = "3 hours";
                } else if (diffTime <= 21600) {
                    showTime = "6 hours";
                } else if (diffTime <= 43200) {
                    showTime = "6 hours";
                } else if (diffTime <= 86400) {
                    showTime = "12 hours";
                } else if (diffTime <= 172800) {
                    showTime = "1 days";
                } else if (diffTime <= 259200) {
                    showTime = "2 days";
                } else if (diffTime <= 604800) {
                    showTime = "1 weeks";
                } else if (diffTime <= 1209600) {
                    showTime = "2 weeks";
                } else if (diffTime <= 2592000) {
                    showTime = "1 months";
                } else {
                    showTime = "1 months later";
                }

                // 修正状态
                let tdtype = 1;

                if (diffTime <= 60) {
                    tdtype = 3;
                } else if (diffTime <= 3600) {
                    tdtype = 2;
                }

                if (this.doType == "done") {
                    tdtype = 4;
                    showTime = "DONE";
                }

                // 修正元素提示素材
                this.showTime = showTime;
                this.attr("tdtype", tdtype);
                this.$mainSelector.attr('title', new Date(this.time * 1000).toLocaleString());
            }
        },
        watch: {
            name(e, val) {
                this.$name.attr("title", val);
            },
            time(e, val) {
                this.refreshShow();
            },
            doType(e, val) {
                if (val == "close") {
                    // 先隐藏动画，再删除
                    this.class.add("hide");
                    setTimeout(() => this.remove(), 300);
                    return;
                }
                this.refreshShow();
            }
        }
    });
});