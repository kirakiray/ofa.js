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
                        if (command == "complete") {
                            if (capp._loading_resolve) {
                                capp._loading_resolve();
                                capp._loading_resolve = null;
                            }

                            // 第一次加载或者刷新
                            // 刷新的话，把初始数据和上一次的message发送过去
                            // if (capp._last_msg) {
                            //     capp.win.postMessage({
                            //         type: "web-app-post-data",
                            //         data: capp._last_msg
                            //     }, new URL(capp.href).origin);
                            // }
                        } else if (command == "close") {
                            capp.loaded = new Promise(res => capp._loading_resolve = res);
                        }

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

            // 打开窗口的win
            this.win = window.open(href);

            // 接受的的信息
            this.message = null;

            // 窗口是否加载完成的promise
            this.loaded = new Promise(res => this._loading_resolve = res);

            commandApps.add(this);
        }

        get href() {
            return this.win.location.href;
        }

        get closed() {
            return this.win.closed;
        }

        // 发送数据
        async post(data) {
            await this.loaded;

            this.win.postMessage({
                type: "web-app-post-data",
                data
            }, new URL(this.href).origin);

            // 最后一次发送的数据
            // this._last_msg = data;
        }
    }

    // 通过窗口的方式打开 webapp
    return async (href) => {
        return new CommandApp(href);
    }
});