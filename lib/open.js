// 命令行模式打开app页面
define(async () => {
    const XData = $.xdata({}).constructor;

    // 所有的 command app
    const commandApps = new Set();

    // 监听数据变动
    window.addEventListener("message", event => {
        commandApps.forEach(capp => {
            if (event.source == capp.win) {
                // 目标对象
                if (event && event.data && event.data.type && event.data.type == 'web-app-postback-data') {
                    const data = event.data.data;
                    const command = event.data.command;

                    if (command == "complete" || command == "close") {
                        // 更新关闭状态
                        clearTimeout(capp._m_timer);
                        capp._m_timer = setTimeout(() => {
                            capp.update();

                            if (capp.closed) {
                                commandApps.delete(capp);
                            }
                        }, 500);
                    } else {
                        // 更新数据
                        capp.message = data;
                        if (capp.onmessage) {
                            capp.onmessage(data);
                        }
                    }
                }
            }
        });
    });

    class CommandApp extends XData {
        constructor(href) {
            super({});

            this.href = href;
            this.win = window.open(href);
            this.message = null;

            commandApps.add(this);
        }

        get closed() {
            return this.win.closed;
        }

        // 发送数据
        post(data) {
            this.win.postMessage({
                type: "web-app-post-data",
                data
            }, new URL(this.href).origin);
        }
    }

    // 通过窗口的方式打开 webapp
    return async (href) => {
        return new CommandApp(href);
    }
});