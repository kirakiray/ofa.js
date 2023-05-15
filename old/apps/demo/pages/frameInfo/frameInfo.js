Page(async ({load}) => {
    return {
        data: {
            // 帧数
            frameCount: "-",
            // 内存占用
            useMemary: "",
        },
        ready() {
            this._runFrame = true;

            // 计算帧数
            let count = 0;

            const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

            let frameFun;
            requestAnimationFrame(frameFun = () => {
                count++;
                this._runFrame && requestAnimationFrame(frameFun);
            });

            this.rfun = requestAnimationFrame.toString();

            // 设置内存大小
            if (performance.memory)
                this.useMemary = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2);

            // 一秒钟内统计一次
            this._timer = setInterval(() => {
                this.frameCount = count;
                count = 0;
                if (performance.memory) {
                    this.useMemary = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
                }
            }, 1000);
        },
        detached() {
            this._runFrame = false;
            clearInterval(this._timer);
        }
    };
});