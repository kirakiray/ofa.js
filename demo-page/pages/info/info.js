Page(async (load) => {
    await load("@ofa/o-nav -p");

    return {
        temp: true,
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
                this.$outerScreen.style.height = screen.height / screen.width * this.$outerScreen.width + "px";

                // 内框调整
                this.$screenEle.style.width = innerWidth / screen.width * this.$outerScreen.width + "px";
                this.$screenEle.style.height = innerHeight / screen.height * this.$outerScreen.height + "px";
            }
        },
        ready() {
            this._app = this.app;
            this._app.watch("inner", this._wfun = () => this.updataInfo(), true);
        },
        destory() {
            this._app.unwatch("inner", this._wfun);
            this._wfun = this._app = null;
        }
    };
})