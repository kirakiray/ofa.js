Component(async ({ load }) => {
    const frameApps = new Set();

    window.addEventListener("message", e => {
        if (e.data && e.data.type == 'web-app-postback-data') {
            if (e.data) {
                frameApps.forEach(fapp => {
                    if (fapp.shadow.$("iframe").ele.contentWindow == e.source) {
                        let data = fapp.message = e.data.data;
                        fapp.triggerHandler("message", data);
                    }
                });
            }
        }
    });

    return {
        data: {
            href: "",
            // 返回的message数据
            message: null,
            initial: undefined
        },
        attrs: {
            src: undefined
        },
        watch: {
            src(src) {
                if (!src) {
                    return;
                }
                const urlobj = new URL(src, location.href);

                this.href = urlobj.href;
            }
        },
        proto: {
            async post(data) {
                let iframeEle = this.shadow.$("iframe").ele;

                let result = await this._loaded;
                if (!result) {
                    return;
                }

                iframeEle.contentWindow.postMessage({
                    type: "web-app-post-data",
                    data
                }, new URL(this.href).origin);
            },
            get win() {
                return this.shadow.$("iframe").ele.contentWindow;
            }
        },
        ready() {
            // 是否加载完成
            let iframe_loaded_resolve;
            this._loaded = new Promise(resolve => {
                iframe_loaded_resolve = resolve;
            });
            this._iframe_loaded_resolve = iframe_loaded_resolve;

            this.shadow.$("iframe").on("load", e => {
                this._iframe_loaded_resolve = null;
                iframe_loaded_resolve(true);

                // 添加初始化数据
                let initial = this.attr("initial");
                if (initial && this.initial === undefined) {
                    this.initial = initial;
                }

                // 发送初始化数据
                if (this.initial !== undefined) {
                    this.win.postMessage({
                        type: "web-app-post-init-data",
                        data: this.initial instanceof Object ? this.initial.toJSON() : this.initial
                    }, new URL(this.href).origin);
                }
            });
        },
        attached() {
            frameApps.add(this);
        },
        detached() {
            frameApps.delete(this);
        }
    };
})