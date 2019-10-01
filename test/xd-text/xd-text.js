(() => {
    // 存储仓库
    let xdTextData = new Map();

    // 添加注册函数
    const regText = (opts) => {
        let defaults = {
            target: "default",
            data: {}
        };

        Object.assign(defaults, opts);

        // 判断有没有旧的
        let oldWatchData = xdTextData.get(defaults.target);

        if (oldWatchData) {
            debugger
        } else {
            xdTextData.set(defaults.target, defaults);
        }

    }

    // 设置默认数据
    regText({
        data: $.xdata({})
    });

    $.xdtext = {
        set: regText,
        // 获取目标数据
        get(targetName) {
            let tar = xdTextData.get(targetName)
            return tar && tar.data;
        },
        // 删除监听目标数据
        remove(targetName) { }
    };

    // 设置watch函数
    const setWatchFun = (_this) => {
        if (!_this._isAttached) {
            return;
        }

        let targetData = xdTextData.get(_this.target).data;

        let bindFun;
        targetData.watch(_this.key, bindFun = e => {
            let { val } = e;
            if (val === undefined) {
                val = "";
            }
            _this.html = val;
        }, true);

        // 监听对象
        _this._oldWatchObj = {
            key: _this.key,
            targetData,
            bindFun
        };
    }

    // 清除绑定
    const unsetWatchFun = (_this) => {
        let watchObj = _this._oldWatchObj;
        if (watchObj) {
            watchObj.targetData.unwatch(watchObj.key, watchObj.bindFun);
        }
    }

    Component({
        tag: "xd-text",
        data: {
            key: "",
            // _watchBinding: [],
            target: "default",
            // 是否已经添加进页面
            _isAttached: false
        },
        watch: {
            key(e, key) {
                setWatchFun(this);
            }
        },
        attached() {
            this._isAttached = true;

            // 设置监听函数
            setWatchFun(this);
        },
        detached() {
            this._isAttached = false;

            unsetWatchFun(this);
        }
    });
})();