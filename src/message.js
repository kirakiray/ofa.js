// 关于 o-app 和 上层应用的数据通信相关逻辑
// 全局的app数据
const globalAppData = {
    // 上级传递过来的message数据
    message: null
};

if (opener && !opener.closed) {
    if (document.readyState == "complete") {
        opener.postMessage({
            type: "web-app-postback-data",
            command: "complete"
        }, "*");
    } else {
        let onloadFunc = () => {
            opener.postMessage({
                type: "web-app-postback-data",
                command: "complete"
            }, "*");
            glo.removeEventListener("load", onloadFunc);
            onloadFunc = null;
        };
        glo.addEventListener("load", onloadFunc);
    }

    // 存在更高层的窗口，添加关闭事件通报
    glo.addEventListener("beforeunload", e => {
        opener.postMessage({
            type: "web-app-postback-data",
            command: "close"
        }, "*");
    });
}

glo.addEventListener("message", e => {
    let { data } = e;

    if (!(data && data.type)) {
        return;
    }

    const { type } = data;
    data = data.data;

    if (type == "web-app-post-init-data") {
        globalAppData.initial = data;
        return;
    } else if (type === 'web-app-post-data') {
        globalAppData.message = data;
    } else {
        return;
    }

    apps.forEach(e => {
        e.triggerHandler("message", data);
        emitUpdate(e, {
            xid: e.xid,
            name: "message"
        });
    });
});