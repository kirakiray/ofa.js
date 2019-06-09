define(async (load) => {
    // 添加样式
    await load("./todilist.css", "./todoitem");

    let {
        todolist,
        todolistInput
    } = await load("./temp.dcode -inner");

    $.register({
        tag: "todolist",
        temp: todolist,
        inited() {
            this.$tabs.on("click", ".tl_tab", (e) => {
                let {
                    delegateTarget
                } = e;

                if (delegateTarget.class.contains("active")) {
                    // 是当前激活的按钮，就不用继续
                    return;
                }

                // 去除之前激活状态
                this.$tabs.que(".active").class.remove("active");

                // 当前按钮添加激活
                delegateTarget.class.add("active");

                // 根据stime和btime定制规则
                let stime = parseInt(delegateTarget.attr("stime"));
                let btime = parseInt(delegateTarget.attr("btime"));

                let nTime = new Date().getTime() / 1000;

                // 遍历
                this.forEach(todoItem => {
                    nTime,
                    stime,
                    btime
                    let diffTime = todoItem.time - nTime;

                    if (diffTime > stime && diffTime < btime) {
                        todoItem.class.remove('hide');
                    } else {
                        todoItem.class.add('hide');
                    }
                });
            });
        },
        attached() {
            this._timer = setInterval(() => {
                this.forEach(e => {
                    e.refreshShow();
                });
            }, 3000);
        },
        detached() {
            clearInterval(this._timer);
        }
    });

    // 顺便封装了 input输入框
    $.register({
        tag: "todolist-input",
        temp: todolistInput,
        data: {
            todoTime: "",
            todoName: ""
        },
        inited() {
            // 点击了提交按钮
            this.$todoSubmit.on("click", e => {
                let {
                    todoTime,
                    todoName
                } = this;

                // 确定没有空值
                if (!todoTime || !todoName) {
                    return;
                }

                // 清空数据
                this.todoTime = "";
                this.todoName = "";

                // 提交事件
                this.emit("clickSubmit", {
                    todoTime,
                    todoName
                });
            });
        }
    });
});