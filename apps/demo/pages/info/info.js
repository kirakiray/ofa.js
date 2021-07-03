Page(async ({ load }) => {
    return {
        data: {
            iWidth: "0",
            iHeight: "0",
            screenW: "0",
            screenH: "0",
            ua: ""
        },
        proto: {
            updataInfo() {
                // 设置信息
                this.iWidth = innerWidth;
                this.iHeight = innerHeight;
                this.screenW = screen.width;
                this.screenH = screen.height;
                this.ua = navigator.userAgent;

                // 外框大小
                this.shadow.$("#outerScreen").style.height = screen.height / screen.width * this.shadow.$("#outerScreen").width + "px";

                // 内框调整
                this.shadow.$("#screenEle").style.width = innerWidth / screen.width * this.shadow.$("#outerScreen").width + "px";
                this.shadow.$("#screenEle").style.height = innerHeight / screen.height * this.shadow.$("#outerScreen").height + "px";
            }
        },
        attached() {
            this._app = this.app;
            this._wid = this._app.watchKey({
                rect: () => this.updataInfo()
            });
        },
        detached() {
            this._app.unwatch(this._wid);
        }
    };
})