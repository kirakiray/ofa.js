(async () => {
    drill.config({
        baseUrl: "js/"
    });

    // 等待载入 XD组件包 todolist
    await load("components/todolist -pack");

    // 获取组件
    let todolist = $(".mainList");
    let mainInput = $('.listInput');

    // 获取数据
    let beforeDataStr = localStorage.getItem("_todolist_datas");
    if (beforeDataStr) {
        // 存在数据的话，填充初始数据
        let data = JSON.parse(beforeDataStr);

        // 添加关键字
        data.forEach(e => {
            e.xvele = 1;
        });

        // 还原数据
        todolist.extend(data);
    }

    // 监听数据变动
    todolist.watch(e => {
        // 转换普通 object
        let data = todolist.object;

        // 设置length，转换Array
        data.length = todolist.length;
        data = Array.from(data);

        // 去除无用字段
        data.forEach(e => {
            delete e.showTime;
            delete e.xvele;
        });

        // 防止数据重复记录
        let dataStr = JSON.stringify(data);

        if (beforeDataStr === dataStr) {
            return;
        }

        beforeDataStr = dataStr;

        // 存储到localstorage
        localStorage.setItem("_todolist_datas", dataStr);

        console.log('保存的数据 => ', data);
    });

    // 监听输入设施
    mainInput.on("clickSubmit", (e, data) => {
        let time = parseInt(data.todoTime) + new Date().getTime() / 1000;
        if (!todolist.length) {
            // 添加队列
            todolist.push({
                tag: "todoitem",
                name: data.todoName,
                time: time,
                xvele: 1
            });
        } else {
            // 插入的id位置
            let slotId = -1;
            todolist.find((item, i) => {
                if (time > item.time) {
                    slotId = i;
                } else {
                    return true;
                }
            });
            slotId++;

            // 插入相应位置
            todolist.splice(slotId, 0, {
                tag: "todoitem",
                name: data.todoName,
                time: time,
                xvele: 1
            });
        }
    });
})();