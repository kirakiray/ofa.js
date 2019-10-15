((glo) => {
    "use strict";
    ((glo) => {
        "use strict";

        const getRandomId = () => Math.random().toString(32).substr(2);
        let objectToString = Object.prototype.toString;
        const getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
        const isUndefined = val => val === undefined;
        const isFunction = val => getType(val).includes("function");
        const cloneObject = obj => JSON.parse(JSON.stringify(obj));

        const nextTick = (() => {
            let inTick = false;

            // 定位对象寄存器
            let nextTickMap = new Map();

            return (fun, key) => {
                if (!inTick) {
                    inTick = true;
                    setTimeout(() => {
                        if (nextTickMap.size) {
                            nextTickMap.forEach(({
                                key,
                                fun
                            }) => {
                                fun();
                                nextTickMap.delete(key);
                            });
                        }

                        nextTickMap.clear();
                        inTick = false;
                    }, 0);
                }

                if (!key) {
                    key = getRandomId();
                }

                nextTickMap.set(key, {
                    key,
                    fun
                });
            };
        })();

        // 触发update事件
        const emitUpdate = (target, name, args, assingData) => {
            let mid;

            if (target._modifyId) {
                mid = target._modifyId;
            } else {
                mid = getRandomId();
            }

            getXDataProp(target, MODIFYIDS).push(mid);
            recyclModifys(target);

            // 事件冒泡
            let event = new XEvent({
                type: "update",
                target: target[PROXYTHIS] || target
            });

            Object.defineProperties(event, {
                trend: {
                    get() {
                        return new XDataTrend(event);
                    }
                }
            });

            assingData && Object.assign(event, assingData);

            // 设置modify数据
            event.modify = {
                name,
                args: cloneObject(args),
                mid
            };

            // 冒泡update
            target.emit(event);
        }

        // 清理modifys
        let recyTimer, recyArr = new Set();
        const recyclModifys = (xobj) => {
            // 不满50个别瞎折腾
            if (xobj[MODIFYIDS].length < 50) {
                return;
            }

            clearTimeout(recyTimer);
            recyArr.add(xobj);
            recyTimer = setTimeout(() => {
                let copyRecyArr = Array.from(recyArr);
                setTimeout(() => {
                    copyRecyArr.forEach(e => recyclModifys(e));
                }, 1000);
                recyArr.forEach(e => {
                    let modifys = e[MODIFYIDS]
                    // 清除掉一半
                    modifys.splice(0, Math.ceil(modifys.length / 2));
                });
                recyArr.clear();
            }, 3000)
        }

        // 清理XData数据
        const clearXData = (xobj) => {
            if (!(xobj instanceof XData)) {
                return;
            }
            let _this = xobj[XDATASELF];
            if (_this) {
                _this.index = undefined;
                _this.parent = undefined;
            }

            // 解除virData绑定
            if (xobj instanceof VirData) {
                let {
                    mappingXData
                } = xobj;
                let tarHostData = mappingXData[VIRDATAHOST].find(e => e.data === _this);
                let {
                    leftUpdate,
                    rightUpdate
                } = tarHostData;
                xobj.off("update", rightUpdate);
                mappingXData.off("update", leftUpdate);
                _this.mappingXData = null;
            }

            // 清除sync
            if (_this[SYNCSHOST]) {
                for (let [oppXdata, e] of _this[SYNCSHOST]) {
                    _this.unsync(oppXdata);
                }
            }

            if (_this[VIRDATAHOST]) {
                _this[VIRDATAHOST].forEach(e => {
                    let {
                        data,
                        leftUpdate,
                        rightUpdate
                    } = e;
                    data.off("update", rightUpdate);
                    _this.off("update", leftUpdate);
                    data.mappingXData = null;
                });
                _this[VIRDATAHOST].splice(0);
            }
            _this[WATCHHOST] && _this[WATCHHOST].clear();
            _this[EVENTS] && _this[EVENTS].clear();
        }

        /**
         * 生成XData数据
         * @param {Object} obj 对象值，是Object就转换数据
         * @param {Object} options 附加信息，记录相对父层的数据
         */
        const createXData = (obj, options) => {
            let redata = obj;
            switch (getType(obj)) {
                case "object":
                case "array":
                    redata = new XData(obj, options);
                    break;
            }

            return redata;
        };

        /**
         * 将 stanz 转换的对象再转化为 children 结构的对象
         * @param {Object} obj 目标对象
         * @param {String} childKey 数组寄存属性
         */
        const toNoStanz = (obj, childKey) => {
            if (obj instanceof Array) {
                return obj.map(e => toNoStanz(e, childKey));
            } else if (obj instanceof Object) {
                let newObj = {};
                let childs = [];
                Object.keys(obj).forEach(k => {
                    if (!/\D/.test(k)) {
                        childs.push(toNoStanz(obj[k], childKey));
                    } else {
                        newObj[k] = toNoStanz(obj[k]);
                    }
                });
                if (childs.length) {
                    newObj[childKey] = childs;
                }
                return newObj;
            } else {
                return obj;
            }
        }

        // common
        const EVENTS = Symbol("events");

        // 获取事件队列
        const getEventsArr = (eventName, tar) => {
            let eventHost = tar[EVENTS];

            if (!eventHost) {
                eventHost = new Map();
                Object.defineProperty(tar, EVENTS, {
                    value: eventHost
                });
            }

            let tarEves = eventHost.get(eventName);
            if (!tarEves) {
                tarEves = [];
                eventHost.set(eventName, tarEves);
            }
            return tarEves;
        };

        /**
         * 转换为事件对象
         * @param {String|XEvent} eventName 事件对象或事件名
         * @param {Object} _this 目标元素
         */
        const transToEvent = (eventName, _this) => {
            let event;
            // 不是实例对象的话，重新生成
            if (!(eventName instanceof XEvent)) {
                event = new XEvent({
                    type: eventName,
                    target: _this[PROXYTHIS] || _this
                });
            } else {
                event = eventName;
                eventName = event.type;
            }
            return event;
        }

        /**
         * 事件触发器升级版，可设置父节点，会模拟冒泡操作
         * @class XEmiter
         * @constructor
         * @param {Object} options 
         */
        class XEmiter {
            constructor(options = {}) {
                Object.defineProperties(this, {
                    // 记录事件用的Map对象
                    // [EVENTS]: {
                    //     value: new Map()
                    // },
                    // 父对象
                    parent: {
                        writable: true,
                        value: options.parent,
                        configurable: true
                    },
                    index: {
                        writable: true,
                        value: options.index,
                        configurable: true
                    }
                });
            }

            /**
             * 注册事件
             * @param {String} type 注册的事件名
             * @param {Function} callback 注册事件的回调函数
             * @param {Object} data 注册事件的自定义数据
             */
            on(type, callback, data) {
                this.addListener({
                    type,
                    data,
                    callback
                });
            }

            /**
             * 注册一次性事件
             * @param {String} type 注册的事件名
             * @param {Function} callback 注册事件的回调函数
             * @param {Object} data 注册事件的自定义数据
             */
            one(type, callback, data) {
                this.addListener({
                    count: 1,
                    type,
                    data,
                    callback
                });
            }

            /**
             * 外部注册事件统一到内部的注册方法
             * @param {Object} opts 注册事件对象参数
             */
            addListener(opts = {}) {
                let {
                    type,
                    data,
                    callback,
                    // 事件可触发次数
                    count = Infinity,
                    eventId
                } = opts;

                if (!type) {
                    throw {
                        desc: "addListener no type",
                        options: opts
                    };
                }

                // 分解id参数
                let spIdArr = type.split('#');
                if (1 in spIdArr) {
                    type = spIdArr[0];
                    eventId = spIdArr[1];
                }

                let evesArr = getEventsArr(type, this);

                if (!isUndefined(eventId)) {
                    // 判断是否存在过这个id的事件注册过
                    // 注册过这个id的把旧的删除
                    Array.from(evesArr).some((opt) => {
                        // 想等值得删除
                        if (opt.eventId === eventId) {
                            let id = evesArr.indexOf(opt);
                            if (id > -1) {
                                evesArr.splice(id, 1);
                            }
                            return true;
                        }
                    });
                }

                callback && evesArr.push({
                    type,
                    data,
                    callback,
                    eventId,
                    count
                });
            }

            /**
             * 注销事件
             * @param {String} eventName 需要注销的事件名
             * @param {Function} callback 注销的事件函数
             */
            off(eventName, callback) {
                if (!eventName) {
                    return;
                }
                if (callback) {
                    let evesArr = getEventsArr(eventName, this);
                    let tarId = evesArr.findIndex(e => e.callback == callback);
                    (tarId > -1) && evesArr.splice(tarId, 1);
                } else {
                    this[EVENTS] && this[EVENTS].delete(eventName);
                }
            }

            /**
             * 触发事件
             * 不会触发冒泡
             * @param {String|XEvent} eventName 触发的事件名
             * @param {Object} emitData 触发事件的自定义数据
             */
            emitHandler(eventName, emitData) {
                let event = transToEvent(eventName, this);
                eventName = event.type;

                let evesArr = getEventsArr(eventName, this);

                // 需要去除的事件对象
                let needRmove = [];

                // 修正currentTarget
                event.currentTarget = this[PROXYTHIS] || this;

                // 触发callback函数
                evesArr.some(e => {
                    e.data && (event.data = e.data);
                    e.eventId && (event.eventId = e.eventId);

                    // 中转确认对象
                    let middleObj = {
                        self: this,
                        event,
                        emitData
                    };

                    let isRun = e.before ? e.before(middleObj) : 1;

                    isRun && e.callback.call(this[PROXYTHIS] || this, event, emitData);

                    e.after && e.after(middleObj);

                    delete event.data;
                    delete event.eventId;

                    e.count--;

                    if (!e.count) {
                        needRmove.push(e);
                    }

                    if (event.cancel) {
                        return true;
                    }
                });

                delete event.currentTarget;

                // 去除count为0的事件记录对象
                needRmove.forEach(e => {
                    let id = evesArr.indexOf(e);
                    (id > -1) && evesArr.splice(id, 1);
                });

                return event;
            }

            /**
             * 触发事件
             * 带有冒泡状态
             * @param {String|XEvent} eventName 触发的事件名
             * @param {Object} emitData 触发事件的自定义数据
             */
            emit(eventName, emitData) {
                let event = this.emitHandler(eventName, emitData);

                // 判断父层并冒泡
                if (event.bubble && !event.cancel) {
                    let {
                        parent
                    } = this;

                    if (parent) {
                        event.keys.unshift(this.index);
                        parent.emit(event, emitData);
                    }
                }
            }
        }

        /**
         * 事件记录对象
         * @class XEvent
         * @constructor
         * @param {String} type 事件名称
         */
        class XEvent extends XEmiter {
            constructor(opt) {
                super();
                this.type = opt.type;
                this.target = opt.target;
                this._bubble = true;
                this._cancel = false;
                this.keys = [];
            }

            get bubble() {
                return this._bubble;
            }
            set bubble(val) {
                if (this._bubble === val) {
                    return;
                }
                this.emitHandler(`set-bubble`, val);
                this._bubble = val;
            }
            get cancel() {
                return this._cancel;
            }
            set cancel(val) {
                if (this._cancel === val) {
                    return;
                }
                this.emitHandler(`set-cancel`, val);
                this._cancel = val;
            }
        }

        // get 可直接获取的正则
        // const GET_REG = /^_.+|^parent$|^index$|^length$|^object$/;
        const GET_REG = /^_.+|^index$|^length$|^object$|^getData$|^setData$/;
        // set 不能设置的Key的正则
        const SET_NO_REG = /^parent$|^index$|^length$|^object$/

        let XDataHandler = {
            get(target, key, receiver) {
                // 私有变量直接通过
                if (typeof key === "symbol" || GET_REG.test(key)) {
                    return Reflect.get(target, key, receiver);
                }

                return target.getData(key);
            },
            set(target, key, value, receiver) {
                // 私有变量直接通过
                // 数组函数运行中直接通过
                if (typeof key === "symbol") {
                    return Reflect.set(target, key, value, receiver);
                }

                return target.setData(key, value)
            }
        };

        const PROXYTHIS = Symbol("proxyThis");

        // 未Proxy时的自身
        const XDATASELF = Symbol("XDataSelf");

        // watch寄存数据
        const WATCHHOST = Symbol("WatchHost");

        // modifyId寄存
        const MODIFYIDS = Symbol("ModifyIDS");

        // sync寄存
        const SYNCSHOST = Symbol("SyncHost");

        // virData寄存器
        const VIRDATAHOST = Symbol("VirDataHost");

        /**
         * 获取对象内置数据
         * 这个操作是为了节省内存用的
         * @param {XData} target 目标元素
         * @param {Symbol} key 需要获取的元素key
         */
        const getXDataProp = (target, key) => {
            let value = target[key];

            if (!value) {
                switch (key) {
                    case WATCHHOST:
                    case SYNCSHOST:
                        value = new Map();
                        break;
                    case MODIFYIDS:
                    case VIRDATAHOST:
                        value = [];
                        break;
                }
                Object.defineProperty(target, key, {
                    value
                });
            }

            return value;
        }

        /**
         * 事件触发器升级版，可设置父节点，会模拟冒泡操作
         * @class
         * @constructor
         * @param {Object} obj 合并到实例上的数据对象
         * @param {Object} opts 合并选项
         * @returns {ArrayLike} 当前实例，会根据XData上的
         */
        class XData extends XEmiter {
            constructor(obj, opts = {}) {
                super(opts);

                let proxyThis = new Proxy(this, XDataHandler);

                // 重新计算当前数据的数组长度
                let length = 0;

                // 数据合并
                Object.keys(obj).forEach(k => {
                    // 值
                    let value = obj[k];

                    if (/^\_/.test(k) || value instanceof Element) {
                        // this[k] = obj[k];
                        Object.defineProperty(this, k, {
                            configurable: true,
                            writable: true,
                            value
                        });
                        return;
                    }

                    if (!/\D/.test(k)) {
                        // 数字key进行length长度计算
                        k = parseInt(k);

                        if (k >= length) {
                            length = k + 1;
                        }
                    }

                    if (value instanceof Object) {
                        this[k] = new XData(value, {
                            parent: this,
                            index: k
                        });
                    } else {
                        this[k] = value;
                    }
                });

                Object.defineProperties(this, {
                    [XDATASELF]: {
                        get: () => this
                    },
                    [PROXYTHIS]: {
                        value: proxyThis
                    },
                    // [WATCHHOST]: {
                    //     value: new Map()
                    // },
                    // [MODIFYIDS]: {
                    //     value: []
                    // },
                    // [SYNCSHOST]: {
                    //     value: new Map()
                    // },
                    _modifyId: {
                        value: null,
                        writable: true
                    },
                    // 当前实例数组长度
                    length: {
                        configurable: true,
                        writable: true,
                        value: length
                    }
                });
            }

            /**
             * 合并数据到实例对象
             * @param {Object} opts 设置当前数据
             */
            setData(key, value) {
                if (SET_NO_REG.test(key)) {
                    console.warn(`you can't set this key in XData => `, key);
                    return false;
                }

                if (/^_.+/.test(key)) {
                    Object.defineProperty(this, key, {
                        configurable: true,
                        writable: true,
                        value
                    })
                    return true;
                }

                let _this = this[XDATASELF];

                // 是否 point key
                if (/\./.test(key)) {
                    let kMap = key.split(".");
                    let lastId = kMap.length - 1;
                    kMap.some((k, i) => {
                        if (i == lastId) {
                            key = k;
                            return true;
                        }
                        _this = _this[k];
                    });
                }

                if (getType(key) === "string") {
                    let oldVal = _this[key];

                    if (value === oldVal) {
                        // 一样还瞎折腾干嘛
                        return;
                    }

                    // 去除旧的依赖
                    if (value instanceof XData) {
                        value = value[XDATASELF];
                        value.remove();

                        value.parent = _this;
                        value.index = key;
                    } else if (value instanceof Object) {
                        // 如果是Object就转换数据
                        value = createXData(value, {
                            parent: _this,
                            index: key
                        });
                    }

                    _this[key] = value;

                    emitUpdate(_this, "setData", [key, value], {
                        oldValue: oldVal
                    });

                } else if (key instanceof Object) {
                    let data = key;
                    Object.keys(data).forEach(key => {
                        let value = data[key];

                        _this.setData(key, value);
                    });

                    return true;
                }
            }

            /**
             * 获取相应数据，相比直接获取，会代理得到数组类型相应的index的值
             * @param {String} keyName 获取当前实例相应 key 的数据
             */
            getData(keyName) {
                let target = this[keyName];

                if (target instanceof XData) {
                    target = target[PROXYTHIS];
                }

                return target;
            }

            /**
             * 删除相应Key或自身
             * @param {String|NUmber|Undefined} key 需要删除的key
             */
            remove(key) {
                if (isUndefined(key)) {
                    // 删除自身
                    let {
                        parent
                    } = this;

                    if (parent) {
                        parent.remove(this.index);
                    } else {
                        clearXData(this);
                    }
                } else {
                    let oldVal = this[key];

                    // 删除子数据
                    if (/\D/.test(key)) {
                        // 非数字
                        delete this[key];

                        clearXData(oldVal);

                        emitUpdate(this, "remove", [key]);
                    } else {
                        // 纯数字，术语数组内元素，通过splice删除
                        this.splice(parseInt(key), 1);
                    }
                }
            }

            /**
             * 从 Set 参考的方法，push的去从版
             * @param {*} value 需要添加的数据
             */
            add(value) {
                !this.includes(value) && this.push(value);
            }

            /**
             * 从 Set 参考的方法
             * @param {*} value 需要删除的数据
             */
            delete(value) {
                let tarId = this.indexOf(value);

                if (tarId > -1) {
                    this.splice(tarId, 1);
                }
            }

            /**
             * 是否包含当前值
             * 同数组方法includes，好歹has只有三个字母，用起来方便
             * @param {*} value 数组内的值
             */
            has(value) {
                return this.includes(value);
            }

            /**
             * 从 Set 参考的方法
             */
            clear() {
                this.splice(0, this.length);
            }

            /**
             * 向前插入数据
             * 当前数据必须是数组子元素
             * @param {Object} data 插入的数据
             */
            before(data) {
                if (/\D/.test(this.index)) {
                    throw {
                        text: `It must be an array element`,
                        target: this,
                        index: this.index
                    };
                }
                this.parent.splice(this.index, 0, data);
                return this;
            }

            /**
             * 向后插入数据
             * 当前数据必须是数组子元素
             * @param {Object} data 插入的数据
             */
            after(data) {
                if (/\D/.test(this.index)) {
                    throw {
                        text: `It must be an array element`,
                        target: this,
                        index: this.index
                    };
                }
                this.parent.splice(this.index + 1, 0, data);
                return this;
            }

            clone() {
                return createXData(cloneObject(this))[PROXYTHIS];
            }

            // 在emitHandler后做中间件
            emitHandler(eventName, emitData) {
                let event = transToEvent(eventName, this);

                // 过滤unBubble和update的数据
                if (event.type === "update") {
                    let {
                        _unBubble,
                        _update
                    } = this;
                    if (_update === false || (_unBubble && _unBubble.includes(event.trend.fromKey))) {
                        event.bubble = false;
                        return event;
                    }
                }

                XEmiter.prototype.emitHandler.call(this, event, emitData);

                return event;
            }

            // 转换为children属性机构的数据
            noStanz(opts = {
                childKey: "children"
            }) {
                return toNoStanz(this.object, opts.childKey);
            }

            /**
             * 转换为普通 object 对象
             * @property {Object} object
             */
            get object() {
                let obj = {};

                let isPureArray = true;

                let {
                    _unBubble = []
                } = this;

                // 遍历合并数组，并判断是否有非数字
                Object.keys(this).forEach(k => {
                    if (/^_/.test(k) || !/\D/.test(k) || _unBubble.includes(k)) {
                        return;
                    }

                    let val = this[k];

                    if (val instanceof XData) {
                        // 禁止冒泡
                        if (val._update === false) {
                            return;
                        }

                        val = val.object;
                    }

                    obj[k] = val;

                    isPureArray = false;
                });
                this.forEach((val, k) => {
                    if (val instanceof XData) {
                        val = val.object;
                    }
                    obj[k] = val;
                });

                // 转换为数组格式
                if (isPureArray) {
                    obj.length = this.length;
                    obj = Array.from(obj);
                }

                return obj;
            }

            get string() {
                return JSON.stringify(this.object);
            }

            /**
             * 获取根节点
             * @property {XData} root
             */
            get root() {
                let root = this;
                while (root.parent) {
                    root = root.parent;
                }
                return root;
            }

            /**
             * 获取前一个相邻数据
             * @property {XData} prev
             */
            get prev() {
                if (!/\D/.test(this.index) && this.index > 0) {
                    return this.parent.getData(this.index - 1);
                }
            }

            /**
             * 获取后一个相邻数据
             * @property {XData} after
             */
            get next() {
                if (!/\D/.test(this.index)) {
                    return this.parent.getData(this.index + 1);
                }
            }

            /**
             * 根据keys获取目标对象
             * @param {Array} keys 深度键数组
             */
            getTarget(keys) {
                let target = this;
                if (keys.length) {
                    keys.forEach(k => {
                        target = target[k];
                    });
                }
                return target;
            }

            /**
             * 查询符合条件的对象
             * @param {String|Function} expr 需要查询的对象特征
             */
            seek(expr) {
                let arg1Type = getType(expr);

                if (arg1Type === "function") {
                    let arr = [];

                    let f = val => {
                        if (val instanceof XData) {
                            let isAgree = expr(val);

                            isAgree && (arr.push(val));

                            // 深入查找是否有符合的
                            let meetChilds = val.seek(expr);

                            arr = [...arr, ...meetChilds];
                        }
                    }

                    // 专门为Xhear优化的操作
                    // 拆分后，Xhear也能为children进行遍历
                    Object.keys(this).forEach(k => {
                        if (/\D/.test(k)) {
                            f(this[k]);
                        }
                    });
                    this.forEach(f);

                    f = null;

                    return arr;
                } else if (arg1Type === "string") {
                    // 判断是否符合条件
                    if (/^\[.+\]$/) {
                        expr = expr.replace(/[\[\]]/g, "");

                        let exprArr = expr.split("=");

                        let fun;

                        if (exprArr.length == 2) {
                            let [key, value] = exprArr;
                            fun = data => data[key] == value;
                        } else {
                            let [key] = exprArr;
                            fun = data => Object.keys(data).includes(key);
                        }

                        return this.seek(fun);
                    }
                }
            }

            /**
             * 监听当前对象的值
             * 若只传callback，就监听当前对象的所有变化
             * 若 keyName，则监听对象的相应 key 的值
             * 若 seek 的表达式，则监听表达式的值是否有变化
             * @param {string} expr 监听键值，可以是 keyName 可以是 seek表达式
             * @param {Function} callback 相应值变动后出发的callback
             * @param {Boolean} ImmeOpt 是否即可触发callback
             */
            watch(expr, callback, ImmeOpt) {
                // 调整参数
                let arg1Type = getType(expr);
                if (arg1Type === "object") {
                    Object.keys(expr).forEach(k => {
                        this.watch(k, expr[k]);
                    });
                    return;
                } else if (/function/.test(arg1Type)) {
                    callback = expr;
                    expr = "";
                }

                // 根据参数调整类型
                let watchType;

                if (expr === "") {
                    watchType = "watchSelf";
                } else if (/\[.+\]/.test(expr)) {
                    watchType = "seekData";
                } else if (/\./.test(expr)) {
                    watchType = "watchPointKey";
                } else {
                    watchType = "watchKey";
                }

                // let targetHostObj = this[WATCHHOST].get(expr);
                // if (!targetHostObj) {
                //     targetHostObj = new Set();
                //     this[WATCHHOST].set(expr, targetHostObj)
                // }

                let targetHostObj = getXDataProp(this, WATCHHOST).get(expr);
                if (!targetHostObj) {
                    targetHostObj = new Set();
                    getXDataProp(this, WATCHHOST).set(expr, targetHostObj)
                }

                let cacheObj = {
                    trends: [],
                    callback,
                    expr
                };

                targetHostObj.add(cacheObj);

                let updateMethod;

                let callSelf = this[PROXYTHIS];
                switch (watchType) {
                    case "watchSelf":
                        // 监听自身
                        updateMethod = e => {
                            cacheObj.trends.push(e.trend);

                            nextTick(() => {
                                callback.call(callSelf, {
                                    trends: Array.from(cacheObj.trends)
                                }, callSelf);

                                cacheObj.trends.length = 0;
                            }, cacheObj);
                        };

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                trends: []
                            }, callSelf);
                        }
                        break;
                    case "watchKey":
                        // 监听key
                        updateMethod = e => {
                            let {
                                trend
                            } = e;
                            if (trend.fromKey == expr) {
                                cacheObj.trends.push(e.trend);

                                nextTick(() => {
                                    let val = this[expr];

                                    callback.call(callSelf, {
                                        expr,
                                        val,
                                        trends: Array.from(cacheObj.trends)
                                    }, val);

                                    cacheObj.trends.length = 0;
                                }, cacheObj);
                            }
                        };

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                expr,
                                val: callSelf[expr],
                                trends: []
                            }, callSelf[expr]);
                        }
                        break;
                    case "watchPointKey":
                        let pointKeyArr = expr.split(".");
                        let firstKey = pointKeyArr[0];
                        let oldVal = this.getTarget(pointKeyArr);

                        updateMethod = e => {
                            let {
                                trend
                            } = e;
                            if (trend.fromKey == firstKey) {
                                oldVal;
                                let newVal;
                                try {
                                    newVal = this.getTarget(pointKeyArr);
                                } catch (e) {}
                                if (newVal !== oldVal) {
                                    cacheObj.trends.push(trend);
                                    nextTick(() => {
                                        newVal = this.getTarget(pointKeyArr);

                                        (newVal !== oldVal) && callback.call(callSelf, {
                                            expr,
                                            old: oldVal,
                                            val: newVal,
                                            trends: Array.from(cacheObj.trends)
                                        }, newVal);

                                        cacheObj.trends.length = 0;
                                    }, cacheObj);
                                }
                            }
                        }

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                expr,
                                val: oldVal
                            }, oldVal);
                        }
                        break;
                    case "seekData":
                        let oldVals = callSelf.seek(expr);
                        updateMethod = e => {
                            nextTick(() => {
                                let tars = callSelf.seek(expr);
                                let isEqual = 1;

                                if (tars.length === oldVals.length) {
                                    tars.some(e => {
                                        if (!oldVals.includes(e)) {
                                            isEqual = 0;
                                            return true;
                                        }
                                    });
                                } else {
                                    isEqual = 0;
                                }

                                // 有变动就触发
                                !isEqual && callback.call(callSelf, {
                                    expr,
                                    old: oldVals,
                                    val: tars
                                }, tars);

                                oldVals = tars;
                            }, cacheObj);
                        };

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                expr,
                                old: oldVals,
                                val: oldVals
                            }, oldVals);
                        }
                        break;
                }

                this.on("update", updateMethod);

                cacheObj.updateMethod = updateMethod;

                return this;
            }

            /**
             * 取消watch监听
             * @param {string} expr 监听值
             * @param {Function} callback 监听callback
             */
            unwatch(expr, callback) {
                // 调整参数
                let arg1Type = getType(expr);
                if (arg1Type === "object") {
                    Object.keys(expr).forEach(k => {
                        this.unwatch(k, expr[k]);
                    });
                    return this;
                } else if (/function/.test(arg1Type)) {
                    callback = expr;
                    expr = "";
                }

                let targetHostObj = getXDataProp(this, WATCHHOST).get(expr);

                if (targetHostObj) {
                    let cacheObj = Array.from(targetHostObj).find(e => e.callback === callback && e.expr === expr);

                    // 清除数据绑定
                    if (cacheObj) {
                        this.off("update", cacheObj.updateMethod);
                        targetHostObj.delete(cacheObj);
                        (!targetHostObj.size) && (getXDataProp(this, WATCHHOST).delete(expr));
                    }
                }

                return this;
            }

            /**
             * 趋势数据的入口，用于同步数据
             * @param {Object} trend 趋势数据
             */
            entrend(trend) {
                let {
                    mid,
                    keys,
                    name,
                    args
                } = trend;

                if (!mid) {
                    throw {
                        text: "Illegal trend data"
                    };
                }

                if (getXDataProp(this, MODIFYIDS).includes(mid)) {
                    return false;
                }

                // 获取相应目标，并运行方法
                let target = this.getTarget(keys);
                let targetSelf = target[XDATASELF];
                targetSelf._modifyId = mid;
                // target._modifyId = mid;
                targetSelf[name](...args);
                targetSelf._modifyId = null;

                return true;
            }
        }

        /**
         * trend数据class，记录趋势数据
         * XData的每次数据变动（值变动或数组变动），都会生成趋势数据
         * @class XDataTrend
         * @constructor
         */
        class XDataTrend {
            constructor(xevent) {
                if (xevent instanceof XEvent) {
                    let {
                        modify: {
                            name,
                            args,
                            mid
                        },
                        keys
                    } = cloneObject(xevent);

                    Object.assign(this, {
                        name,
                        args,
                        mid,
                        keys
                    });
                } else {
                    Object.assign(this, xevent);
                }
            }

            /**
             * 转换后的字符串
             */
            get string() {
                return JSON.stringify(this);
            }

            get finalSetterKey() {
                switch (this.name) {
                    case "remove":
                    case "setData":
                        return this.args[0];
                }
            }

            get fromKey() {
                let keyOne = this.keys[0];

                if (isUndefined(keyOne) && (this.name === "setData" || this.name === "remove")) {
                    keyOne = this.args[0];
                }

                return keyOne;
            }

            set fromKey(keyName) {
                let keyOne = this.keys[0];

                if (!isUndefined(keyOne)) {
                    this.keys[0] = keyName;
                } else if (this.name === "setData" || this.name === "remove") {
                    this.args[0] = keyName;
                }
            }
        }

        /**
         * 根据key值同步数据
         * @param {String} key 要同步的key
         * @param {Trend} e 趋势数据
         * @param {XData} xdata 同步覆盖的数据对象
         */
        const pubSyncByKey = (key, e, xdata) => {
            e.trends.forEach(trend => {
                if (trend.fromKey === key) {
                    xdata.entrend(trend);
                }
            });
        }

        /**
         * 根据key数组同步数据
         * @param {String} keyArr 要同步的key数组
         * @param {Trend} e 趋势数据
         * @param {XData} xdata 同步覆盖的数据对象
         */
        const pubSyncByArray = (keyArr, e, xdata) => {
            e.trends.forEach(trend => {
                if (keyArr.includes(trend.fromKey)) {
                    xdata.entrend(trend);
                }
            });
        }

        /**
         * 根据映射对象同步数据
         * @param {Map} optMap key映射对象
         * @param {Trend} e 趋势数据
         * @param {XData} xdata 同步覆盖的数据对象
         */
        const pubSyncByObject = (optMap, e, xdata) => {
            let cloneTrends = cloneObject(e.trends);
            cloneTrends.forEach(trend => {
                trend = new XDataTrend(trend);
                let {
                    fromKey
                } = trend;
                // 修正key值
                if (!isUndefined(fromKey)) {
                    let mKey = optMap.get(fromKey)
                    if (mKey) {
                        trend.fromKey = mKey;
                        xdata.entrend(trend);
                    }
                }
            });
        }

        /**
         * 转换可以直接设置在XData上的值
         * @param {*} value 如果是XData，转换为普通对象数据
         */
        const getNewSyncValue = (value) => {
            (value instanceof XData) && (value = value.object);
            return value;
        };

        const virDataTrans = (self, target, callback) => {
            Object.keys(self).forEach(key => {
                let val = self[key];

                if (val instanceof Object) {
                    if (!target[key]) {
                        if (target.setData) {
                            target.setData(key, {})
                        } else {
                            target[key] = {};
                        }
                    }

                    let vdata = target[key];

                    virDataTrans(val, vdata, callback);
                } else {
                    let keyValue = callback([key, val], {
                        self,
                        target
                    });
                    if (keyValue) {
                        let [newKey, newValue] = keyValue;
                        target[newKey] = newValue;
                    }
                }
            });
        }

        const entrendByCall = (target, e, callback) => {
            let {
                trend
            } = e;
            if (trend) {
                switch (trend.name) {
                    case "setData":
                        let value = trend.args[1];
                        if (value instanceof Object) {
                            let obj = {};
                            virDataTrans(value, obj, callback);
                            trend.args[1] = obj;
                        } else if (!isUndefined(value)) {
                            trend.args = callback(trend.args, {
                                event: e
                            });
                        }
                        break;
                    default:
                        // 其他数组的话，修正参数
                        trend.args = trend.args.map(value => {
                            let nVal = value;
                            if (value instanceof Object) {
                                nVal = {};
                                virDataTrans(value, nVal, callback);
                            }
                            return nVal;
                        });
                        break;
                }
                target.entrend(trend);
            }
        }

        const SyncMethods = {
            /**
             * 同步数据
             * @param {XData} xdata 需要同步的数据
             */
            sync(xdata, opts, isCoverRight) {
                let optsType = getType(opts);

                let leftFun, rightFun;

                switch (optsType) {
                    case "string":
                        if (isCoverRight) {
                            xdata.setData(opts, getNewSyncValue(this[opts]));
                        }

                        leftFun = e => pubSyncByKey(opts, e, xdata)
                        rightFun = e => pubSyncByKey(opts, e, this)
                        break;
                    case "array":
                        if (isCoverRight) {
                            opts.forEach(key => {
                                xdata.setData(key, getNewSyncValue(this[key]));
                            });
                        }

                        leftFun = e => pubSyncByArray(opts, e, xdata)
                        rightFun = e => pubSyncByArray(opts, e, this)
                        break;
                    case "object":
                        let optMap = new Map(Object.entries(opts));
                        let resOptsMap = new Map(Object.entries(opts).map(arr => arr.reverse()));

                        if (isCoverRight) {
                            Object.keys(opts).forEach(key => {
                                xdata.setData(opts[key], getNewSyncValue(this[key]));
                            });
                        }

                        leftFun = e => pubSyncByObject(optMap, e, xdata)
                        rightFun = e => pubSyncByObject(resOptsMap, e, this)
                        break
                    default:
                        if (isCoverRight) {
                            xdata.setData(this.object);
                        }

                        leftFun = e => e.trends.forEach(trend => xdata.entrend(trend))
                        rightFun = e => e.trends.forEach(trend => this.entrend(trend))
                        break;
                }

                this.watch(leftFun);
                xdata.watch(rightFun);

                let sHost = getXDataProp(this, SYNCSHOST);

                // 把之前的绑定操作清除
                if (sHost.has(xdata)) {
                    this.unsync(xdata);
                }

                // 记录信息
                sHost.set(xdata, {
                    selfWatch: leftFun,
                    oppWatch: rightFun
                });
                getXDataProp(xdata, SYNCSHOST).set(this, {
                    selfWatch: rightFun,
                    oppWatch: leftFun
                });
            },
            /**
             * 取消同步数据
             * @param {XData} xdata 需要取消同步的数据
             */
            unsync(xdata) {
                let syncData = getXDataProp(this, SYNCSHOST).get(xdata);

                if (syncData) {
                    let {
                        selfWatch,
                        oppWatch
                    } = syncData;
                    this.unwatch(selfWatch);
                    xdata.unwatch(oppWatch);
                    getXDataProp(this, SYNCSHOST).delete(xdata);
                    getXDataProp(xdata, SYNCSHOST).delete(this);
                }
            },
            /**
             * 生成虚拟数据
             */
            virData(leftCall, rightCall) {
                // 初始生成数据
                let vdata = new VirData(this[XDATASELF], {});
                let arg1Type = getType(leftCall);
                let mapOpts = leftCall;

                if (arg1Type == "object") {
                    if ("mapKey" in mapOpts) {
                        let mappingOpt = Object.entries(mapOpts.mapKey);
                        let mapping = new Map(mappingOpt);
                        let resMapping = new Map(mappingOpt.map(e => e.reverse()));

                        leftCall = ([key, value]) => {
                            if (mapping.has(key)) {
                                return [mapping.get(key), value];
                            }
                            return [key, value];
                        }
                        rightCall = ([key, value]) => {
                            if (resMapping.has(key)) {
                                return [resMapping.get(key), value];
                            }
                            return [key, value];
                        }
                    } else if ("mapValue" in mapOpts) {
                        let tarKey = mapOpts.key;
                        let mappingOpt = Object.entries(mapOpts.mapValue);
                        let mapping = new Map(mappingOpt);
                        let resMapping = new Map(mappingOpt.map(e => e.reverse()));

                        leftCall = ([key, value]) => {
                            if (key === tarKey && mapping.has(value)) {
                                return [key, mapping.get(value)];
                            }
                            return [key, value];
                        }
                        rightCall = ([key, value]) => {
                            if (key === tarKey && resMapping.has(value)) {
                                return [key, resMapping.get(value)];
                            }
                            return [key, value];
                        }
                    }
                }
                // 转换数据
                virDataTrans(this, vdata, leftCall);

                let leftUpdate, rightUpdate;

                this.on("update", leftUpdate = e => entrendByCall(vdata, e, leftCall));
                vdata.on("update", rightUpdate = e => entrendByCall(this, e, rightCall));

                // 记录信息
                getXDataProp(this, VIRDATAHOST).push({
                    data: vdata,
                    leftUpdate,
                    rightUpdate
                });

                return vdata[PROXYTHIS];
            }
        };

        Object.keys(SyncMethods).forEach(methodName => {
            Object.defineProperty(XData.prototype, methodName, {
                writable: true,
                value: SyncMethods[methodName]
            });
        });

        class VirData extends XData {
            constructor(xdata, ...args) {
                super(...args);
                Object.defineProperty(this, "mappingXData", {
                    writable: true,
                    value: xdata
                });
            }
        }

        // 重构Array的所有方法

        // 不影响数据原结构的方法，重新做钩子
        ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
            let arrayFnFunc = Array.prototype[methodName];
            if (arrayFnFunc) {
                Object.defineProperty(XData.prototype, methodName, {
                    value(...args) {
                        return arrayFnFunc.apply(this, args);
                    }
                });
            }
        });

        // 几个会改变数据结构的方法
        ['pop', 'push', 'reverse', 'splice', 'shift', 'unshift'].forEach(methodName => {
            // 原来的数组方法
            let arrayFnFunc = Array.prototype[methodName];

            if (arrayFnFunc) {
                Object.defineProperty(XData.prototype, methodName, {
                    value(...args) {
                        // 重构新参数
                        let newArgs = [];

                        let _this = this[XDATASELF];

                        args.forEach(val => {
                            if (val instanceof XData) {
                                let xSelf = val[XDATASELF];
                                xSelf.remove();
                                newArgs.push(xSelf);
                            } else {
                                // 转化内部数据
                                let newVal = createXData(val, {
                                    parent: _this
                                });
                                newArgs.push(newVal);
                            }
                        });

                        // pop shift splice 的返回值，都是被删除的数据，内部数据清空并回收
                        let returnVal = arrayFnFunc.apply(_this, newArgs);

                        // 重置index
                        _this.forEach((e, i) => {
                            if (e instanceof XData) {
                                e.index = i;
                            }
                        });

                        // 删除returnVal的相关数据
                        switch (methodName) {
                            case "shift":
                            case "pop":
                                if (returnVal instanceof XData) {
                                    clearXData(returnVal);
                                }
                                break;
                            case "splice":
                                returnVal.forEach(e => {
                                    if (e instanceof XData) {
                                        clearXData(e);
                                    }
                                });
                        }

                        emitUpdate(_this, methodName, args);

                        return returnVal;
                    }
                });
            }
        });

        Object.defineProperties(XData.prototype, {
            sort: {
                value(arg) {
                    let args = [];
                    let _this = this[XDATASELF];
                    let oldThis = Array.from(_this);
                    if (isFunction(arg)) {
                        Array.prototype.sort.call(_this, arg);

                        // 重置index
                        // 记录重新调整的顺序
                        _this.forEach((e, i) => {
                            if (e instanceof XData) {
                                e.index = i;
                            }
                        });
                        let orders = oldThis.map(e => e.index);
                        args = [orders];
                        oldThis = null;
                    } else if (arg instanceof Array) {
                        arg.forEach((aid, id) => {
                            let tarData = _this[aid] = oldThis[id];
                            tarData.index = aid;
                        });
                        args = [arg];
                    }

                    emitUpdate(_this, "sort", args);

                    return this;
                }
            }
        });

        // business function
        // 判断元素是否符合条件
        const meetsEle = (ele, expr) => {
            if (ele === expr) {
                return !0;
            }
            let fadeParent = document.createElement('div');
            if (ele === document) {
                return false;
            }
            fadeParent.appendChild(ele.cloneNode(false));
            return !!fadeParent.querySelector(expr);
        }

        // 转换元素
        const parseStringToDom = (str) => {
            let par = document.createElement('div');
            par.innerHTML = str;
            let childs = Array.from(par.childNodes);
            return childs.filter(function(e) {
                if (!(e instanceof Text) || (e.textContent && e.textContent.trim())) {
                    par.removeChild(e);
                    return e;
                }
            });
        };

        const parseDataToDom = (objData) => {
            if (!objData.tag) {
                console.error("this data need tag =>", objData);
                throw "";
            }

            // 生成element
            let ele = document.createElement(objData.tag);

            // 添加数据
            objData.class && ele.setAttribute('class', objData.class);
            objData.slot && ele.setAttribute('slot', objData.slot);
            objData.text && (ele.textContent = objData.text);
            let {
                data
            } = objData;
            data && Object.keys(data).forEach(k => {
                let val = data[k];
                ele.dataset[k] = val;
            });

            if (ele.xvele) {
                let xhearele = createXhearEle(ele);

                xhearele[CANSETKEYS].forEach(k => {
                    let val = objData[k];
                    if (!isUndefined(val)) {
                        xhearele[k] = val;
                    }
                });
            }

            // 填充子元素
            let akey = 0;
            while (akey in objData) {
                // 转换数据
                let childEle = parseDataToDom(objData[akey]);
                ele.appendChild(childEle);
                akey++;
            }

            return ele;
        }

        const parseToDom = (expr) => {
            let ele;

            if (expr instanceof XhearEle) {
                return expr.ele;
            }

            switch (getType(expr)) {
                case "string":
                    if (/\<.+\>/.test(expr)) {
                        ele = parseStringToDom(expr);
                        ele = ele[0];
                    }
                    break;
                case "object":
                    ele = parseDataToDom(expr);
                    break;
                default:
                    if (expr instanceof Element) {
                        ele = expr;
                    }
            }
            return ele;
        }

        /**
         * 查找元素内相匹配的元素，并以数组形式返回
         * @param {Element} target 目标节点
         * @param {String} expr 表达字符串
         */
        const queAllToArray = (target, expr) => {
            let tars = target.querySelectorAll(expr);
            return tars ? Array.from(tars) : [];
        }

        const isXhear = (target) => target instanceof XhearEle;

        // 将 element attribute 横杠转换为大小写模式
        const attrToProp = key => {
            // 判断是否有横线
            if (/\-/.test(key)) {
                key = key.replace(/\-[\D]/g, (letter) => letter.substr(1).toUpperCase());
            }
            return key;
        }
        const propToAttr = key => {
            if (/[A-Z]/.test(key)) {
                key = key.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase());
            }
            return key;
        }
        // 可setData的key
        const CANSETKEYS = Symbol("cansetkeys");
        const ORIEVE = Symbol("orignEvents");

        // 可直接设置的Key
        const xEleDefaultSetKeys = new Set(["text", "html", "display", "style"]);

        // 可直接设置的Key并且能冒泡
        const xEleDefaultSetKeysCanUpdate = new Set(["text", "html"]);

        // 不可设置的key
        const UnSetKeys = new Set(["parent", "index", "slot"]);

        const XDataSetData = XData.prototype.setData;

        class XhearEle extends XData {
            constructor(ele) {
                super({});
                delete this.parent;
                delete this.index;
                delete this.length;
                Object.defineProperties(ele, {
                    __xhear__: {
                        value: this
                    }
                });
                Object.defineProperties(this, {
                    tag: {
                        enumerable: true,
                        value: ele.tagName.toLowerCase()
                    },
                    ele: {
                        value: ele
                    },
                    [ORIEVE]: {
                        writable: true,
                        // value: new Map()
                        value: ""
                    }
                    // [CANSETKEYS]: {
                    //     value: new Set([])
                    // }
                });
            }

            get parent() {
                let {
                    parentNode
                } = this.ele;
                if (parentNode instanceof DocumentFragment) {
                    return;
                }
                return (!parentNode || parentNode === document) ? null : createXhearEle(parentNode);
            }

            get index() {
                let {
                    ele
                } = this;
                return Array.from(ele.parentNode.children).indexOf(ele);
            }

            get length() {
                return this.ele.children.length;
            }

            get class() {
                return this.ele.classList;
            }

            get data() {
                return this.ele.dataset;
            }

            get css() {
                return getComputedStyle(this.ele);
            }

            get position() {
                return {
                    top: this.ele.offsetTop,
                    left: this.ele.offsetLeft
                };
            }

            get offset() {
                let reobj = {
                    top: 0,
                    left: 0
                };

                let tar = this.ele;
                while (tar && tar !== document) {
                    reobj.top += tar.offsetTop;
                    reobj.left += tar.offsetLeft;
                    tar = tar.offsetParent
                }
                return reobj;
            }

            get width() {
                return parseInt(getComputedStyle(this.ele).width);
            }

            get height() {
                return parseInt(getComputedStyle(this.ele).height);
            }

            get innerWidth() {
                return this.ele.clientWidth;
            }

            get innerHeight() {
                return this.ele.clientHeight;
            }

            get offsetWidth() {
                return this.ele.offsetWidth;
            }

            get offsetHeight() {
                return this.ele.offsetHeight;
            }

            get outerWidth() {
                let computedStyle = getComputedStyle(this.ele);
                return this.ele.offsetWidth + parseInt(computedStyle['margin-left']) + parseInt(computedStyle['margin-right']);
            }

            get outerHeight() {
                let computedStyle = getComputedStyle(this.ele);
                return this.ele.offsetHeight + parseInt(computedStyle['margin-top']) + parseInt(computedStyle['margin-bottom']);
            }

            get text() {
                return this.ele.textContent;
            }

            set text(val) {
                this.ele.textContent = val;
            }

            get html() {
                return this.ele.innerHTML;
            }

            set html(val) {
                this.ele.innerHTML = val;
            }

            get display() {
                return getComputedStyle(this.ele)['display'];
            }

            set display(val) {
                this.ele.style['display'] = val;
            }

            get style() {
                return this.ele.style;
            }

            set style(d) {
                let {
                    style
                } = this;

                // 覆盖旧的样式
                let hasKeys = Array.from(style);
                let nextKeys = Object.keys(d);

                // 清空不用设置的key
                hasKeys.forEach(k => {
                    if (!nextKeys.includes(k)) {
                        style[k] = "";
                    }
                });

                Object.assign(style, d);
            }

            setData(key, value) {
                if (UnSetKeys.has(key)) {
                    console.warn(`can't set this key => `, key);
                    return false;
                }

                key = attrToProp(key);

                let _this = this[XDATASELF];

                // 只有在允许列表里才能进行set操作
                let canSetKey = this[CANSETKEYS];
                if (xEleDefaultSetKeys.has(key)) {
                    let oldVal = _this[key];

                    // 直接设置
                    _this[key] = value;

                    if (xEleDefaultSetKeysCanUpdate.has(key)) {
                        emitUpdate(_this, "setData", [key, value], {
                            oldValue: oldVal
                        });
                    }
                    return true;
                } else if ((canSetKey && canSetKey.has(key)) || /^_.+/.test(key)) {
                    // 直接走xdata的逻辑
                    return XDataSetData.call(_this, key, value);
                } else if (!/\D/.test(key)) {
                    let xele = $(value);

                    let targetChild = _this.ele.children[key];
                    let oldVal = _this.getData(key).object;

                    // 这里还欠缺冒泡机制的
                    if (targetChild) {
                        _this.ele.insertBefore(xele.ele, targetChild);
                        _this.ele.removeChild(targetChild);

                        // 冒泡设置
                        emitUpdate(_this, "setData", [key, value], {
                            oldValue: oldVal
                        });
                    } else {
                        _this.ele.appendChild(xele.ele);
                    }
                }

                return false;
            }

            getData(key) {
                key = attrToProp(key);

                let _this = this[XDATASELF];

                let target;

                if (!/\D/.test(key)) {
                    // 纯数字，直接获取children
                    target = _this.ele.children[key];
                    target && (target = createXhearEle(target));
                } else {
                    target = _this[key];
                }

                if (target instanceof XData) {
                    target = target[PROXYTHIS];
                }

                return target;
            }

            siblings(expr) {
                // 获取父层的所有子元素
                let parChilds = Array.from(this.ele.parentElement.children);

                // 删除自身
                let tarId = parChilds.indexOf(this.ele);
                parChilds.splice(tarId, 1);

                // 删除不符合规定的
                if (expr) {
                    parChilds = parChilds.filter(e => {
                        if (meetsEle(e, expr)) {
                            return true;
                        }
                    });
                }

                return parChilds.map(e => createXhearEle(e));
            }

            empty() {
                this.splice(0, this.length);
                return this;
            }

            parents(expr) {
                let pars = [];
                let tempTar = this.parent;

                if (!expr) {
                    while (tempTar) {
                        pars.push(tempTar);
                        tempTar = tempTar.parent;
                    }
                } else {
                    if (getType(expr) == "string") {
                        while (tempTar) {
                            if (meetsEle(tempTar.ele, expr)) {
                                pars.push(tempTar);
                            }
                            tempTar = tempTar.parent;
                        }
                    } else {
                        if (expr instanceof XhearEle) {
                            expr = expr.ele;
                        }

                        // 从属 element
                        if (expr instanceof Element) {
                            while (tempTar) {
                                if (tempTar.ele == expr) {
                                    return true;
                                }
                                tempTar = tempTar.parent;
                            }
                        }

                        return false;
                    }
                }

                return pars;
            }

            is(expr) {
                return meetsEle(this.ele, expr)
            }

            attr(key, value) {
                if (!isUndefined(value)) {
                    this.ele.setAttribute(key, value);
                } else if (key instanceof Object) {
                    Object.keys(key).forEach(k => {
                        this.attr(k, key[k]);
                    });
                } else {
                    return this.ele.getAttribute(key);
                }
            }

            removeAttr(key) {
                this.ele.removeAttribute(key);
                return this;
            }

            que(expr) {
                let tar = this.ele.querySelector(expr);
                if (tar) {
                    return createXhearEle(tar);
                }
            }

            queAll(expr) {
                return queAllToArray(this.ele, expr).map(tar => createXhearEle(tar));
            }

            queShadow(expr) {
                let {
                    shadowRoot
                } = this.ele;
                if (shadowRoot) {
                    let tar = shadowRoot.querySelector(expr);
                    if (tar) {
                        return createXhearEle(tar);
                    }
                } else {
                    throw {
                        target: this,
                        msg: `it must be a customElement`
                    };
                }
            }

            queAllShadow(expr) {
                let {
                    shadowRoot
                } = this.ele;
                if (shadowRoot) {
                    return queAllToArray(shadowRoot, expr).map(tar => createXhearEle(tar));
                } else {
                    throw {
                        target: this,
                        msg: `it must be a customElement`
                    };
                }
            }

            // 根据xv-vd生成xdata实例
            viewData() {
                let xdata = createXData({});

                // 获取所有toData元素
                this.queAll('[xv-vd]').forEach(xele => {
                    // 获取vd内容
                    let vdvalue = xele.attr('xv-vd');

                    if (xele.xvele) {
                        let syncObj = {};

                        if (/ to /.test(vdvalue)) {
                            // 获取分组
                            let vGroup = vdvalue.split(",");
                            vGroup.forEach(g => {
                                // 拆分 to 两边的值
                                let toGroup = g.split("to");
                                if (toGroup.length == 2) {
                                    let key = toGroup[0].trim();
                                    let toKey = toGroup[1].trim();
                                    xdata[toKey] = xele[key];
                                    syncObj[toKey] = key;
                                }
                            });
                        } else {
                            vdvalue = vdvalue.trim();
                            // 设置同步数据
                            xdata[vdvalue] = xele.value;
                            syncObj[vdvalue] = "value";
                        }

                        // 数据同步
                        xdata.sync(xele, syncObj);
                    } else {
                        // 普通元素
                        let {
                            ele
                        } = xele;

                        if ('checked' in ele) {
                            // 设定值
                            xdata[vd] = ele.checked;

                            // 修正Input
                            xdata.watch(vd, e => {
                                ele.checked = xdata[vd];
                            });
                            ele.addEventListener("change", e => {
                                xdata[vd] = ele.checked;
                            });
                        } else {
                            // 设定值
                            xdata[vd] = ele.value;

                            // 修正Input
                            xdata.watch(vd, e => {
                                ele.value = xdata[vd];
                            });
                            ele.addEventListener("change", e => {
                                xdata[vd] = ele.value;
                            });
                            ele.addEventListener("input", e => {
                                xdata[vd] = ele.value;
                            });
                        }
                    }

                    xele.removeAttr("xv-vd");
                });

                return xdata;
            }
            extend(proto) {
                Object.keys(proto).forEach(k => {
                    // 获取描述
                    let {
                        get,
                        set,
                        value
                    } = Object.getOwnPropertyDescriptor(proto, k);

                    if (value) {
                        Object.defineProperty(this, k, {
                            value
                        });
                    } else {
                        Object.defineProperty(this, k, {
                            get,
                            set
                        });
                    }
                });
                return this;
            }
        }

        const XhearEleFn = XhearEle.prototype;

        const MOUSEEVENT = glo.MouseEvent || Event;
        const TOUCHEVENT = glo.TouchEvent || Event;
        // 修正 Event Class 用的数据表
        const EventMap = new Map([
            ["click", MOUSEEVENT],
            ["mousedown", MOUSEEVENT],
            ["mouseup", MOUSEEVENT],
            ["mousemove", MOUSEEVENT],
            ["mouseenter", MOUSEEVENT],
            ["mouseleave", MOUSEEVENT],
            ["touchstart", TOUCHEVENT],
            ["touchend", TOUCHEVENT],
            ["touchmove", TOUCHEVENT]
        ]);

        XhearEleFn.extend({
            on(...args) {
                let eventName = args[0],
                    selector,
                    callback,
                    data;

                // 判断是否对象传入
                if (getType(eventName) == "object") {
                    let eveOnObj = eventName;
                    eventName = eveOnObj.event;
                    callback = eveOnObj.callback;
                    data = eveOnObj.data;
                    selector = eveOnObj.selector;
                } else {
                    // 判断第二个参数是否字符串，字符串当做selector处理
                    switch (getType(args[1])) {
                        case "string":
                            selector = args[1];
                            callback = args[2];
                            data = args[3];
                            break;
                        default:
                            callback = args[1];
                            data = args[2];
                    }
                }

                let originEve = this[ORIEVE] || (this[ORIEVE] = new Map());

                if (!originEve.has(eventName)) {
                    let eventCall = (e) => {
                        let {
                            _para_x_eve_
                        } = e;

                        let event;
                        if (_para_x_eve_) {
                            event = _para_x_eve_;

                            // 当target不一致时，修正target
                            if (event.target.ele !== e.target) {
                                event.target = createXhearEle(e.target);
                            }

                            let newKeys = [];

                            let tarEle = e.target;
                            while (tarEle !== e.currentTarget) {
                                let par = tarEle.parentNode;
                                let tarId = Array.from(par.children).indexOf(tarEle);
                                newKeys.unshift(tarId);
                                tarEle = par;
                            }

                            // 重新修正keys
                            event.keys = newKeys;
                        } else {
                            event = new XEvent({
                                type: eventName,
                                target: createXhearEle(e.target)
                            });

                            // 事件方法转移
                            event.on("set-bubble", (e2, val) => !val && e.stopPropagation());
                            event.on("set-cancel", (e2, val) => val && e.stopImmediatePropagation());
                            event.preventDefault = e.preventDefault.bind(e);

                            e._para_x_eve_ = event;
                        }

                        // 设置原始事件对象
                        event.originalEvent = e;

                        // 触发事件
                        this.emitHandler(event);

                        // 清空原始事件
                        event.originalEvent = null;
                    }
                    originEve.set(eventName, eventCall);
                    this.ele.addEventListener(eventName, eventCall);
                }

                this.addListener({
                    type: eventName,
                    data,
                    callback
                });

                if (selector) {
                    // 获取事件寄宿对象
                    let eves = getEventsArr(eventName, this);

                    eves.forEach(e => {
                        if (e.callback == callback) {
                            e.before = (opts) => {
                                let {
                                    self,
                                    event
                                } = opts;
                                let target = event.target;

                                // 目标元素
                                let delegateTarget = target.parents(selector)[0];
                                if (!delegateTarget && target.is(selector)) {
                                    delegateTarget = target;
                                }

                                // 判断是否在selector内
                                if (!delegateTarget) {
                                    return 0;
                                }

                                // 通过selector验证
                                // 设置两个关键数据
                                Object.assign(event, {
                                    selector,
                                    delegateTarget
                                });

                                // 返回可运行
                                return 1;
                            }
                            e.after = (opts) => {
                                let {
                                    self,
                                    event
                                } = opts;

                                // 删除无关数据
                                delete event.selector;
                                delete event.delegateTarget;
                            }
                        }
                    });
                }
            },
            off(...args) {
                let eventName = args[0];

                // 获取事件寄宿对象
                let eves = getEventsArr(eventName, this);

                // 继承旧方法
                XData.prototype.off.apply(this, args);

                if (!eves.length) {
                    let originEve = this[ORIEVE] || (this[ORIEVE] = new Map());

                    // 原生函数注册也干掉
                    let oriFun = originEve.get(eventName);
                    oriFun && this.ele.removeEventListener(eventName, oriFun);
                }
            },
            trigger(type) {
                let event;

                if (type instanceof Event) {
                    event = type;
                } else {
                    let E = EventMap.get(type) || Event;
                    event = new E(type, {
                        bubbles: true,
                        cancelable: true
                    });
                }

                // 触发事件
                this.ele.dispatchEvent(event);
            }
        });
        // 不影响数据原结构的方法，重新做钩子
        ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
            let arrayFnFunc = Array.prototype[methodName];
            if (arrayFnFunc) {
                Object.defineProperty(XhearEleFn, methodName, {
                    value(...args) {
                        return arrayFnFunc.apply(Array.from(this.ele.children).map(e => createXhearEle(e)[PROXYTHIS]), args);
                    }
                });
            }
        });

        /**
         * 模拟array splice方法
         * @param {XhearEle} t 目标对象
         * @param {Number} index splice index
         * @param {Number} howmany splice howmany
         * @param {Array} items splice push items
         */
        const XhearEleProtoSplice = (t, index, howmany, items = []) => {
            let _this = t[XDATASELF];

            // 返回的数组
            let reArr = [];

            let tarele = _this.ele;
            let {
                children
            } = tarele;

            while (howmany > 0) {
                let childEle = children[index];

                reArr.push(createXhearEle(childEle));

                // 删除目标元素
                tarele.removeChild(childEle);

                // 数量减少
                howmany--;
            }

            // 定位目标子元素
            let tar = children[index];

            // 添加元素
            if (items.length) {
                let fragment = document.createDocumentFragment();
                items.forEach(e => fragment.appendChild(parseToDom(e)));
                if (index >= 0 && tar) {
                    tarele.insertBefore(fragment, tar)
                } else {
                    tarele.appendChild(fragment);
                }
            }
            emitUpdate(_this, "splice", [index, howmany, ...items]);
        }

        /**
         * 根据数组结构进行排序
         * @param {XhearEle} t 目标对象
         * @param {Array} arr 排序数组结构
         */
        const sortByArray = (t, arr) => {
            let _this = t[XDATASELF];
            let {
                ele
            } = _this;

            let childsBackup = Array.from(ele.children);
            let fragment = document.createDocumentFragment();
            arr.forEach(k => {
                let ele = childsBackup[k];
                if (ele.xvele) {
                    ele[RUNARRAY] = 1;
                }
                fragment.appendChild(ele);
            });
            ele.appendChild(fragment);
            childsBackup.forEach(ele => ele.xvele && (ele[RUNARRAY] = 0));
        }

        // 重置所有数组方法
        XhearEleFn.extend({
            // push就是最原始的appendChild，干脆直接appencChild
            push(...items) {
                let fragment = document.createDocumentFragment();
                items.forEach(item => {
                    let ele = parseToDom(item);
                    fragment.appendChild(ele);
                });
                this.ele.appendChild(fragment);
                emitUpdate(this[XDATASELF], "push", items);
                return this.length;
            },
            splice(index, howmany, ...items) {
                return XhearEleProtoSplice(this, index, howmany, items);
            },
            unshift(...items) {
                XhearEleProtoSplice(this, 0, 0, items);
                return this.length;
            },
            shift() {
                return XhearEleProtoSplice(this, 0, 1);
            },
            pop() {
                return XhearEleProtoSplice(this, this.length - 1, 1);
            },
            reverse() {
                let childs = Array.from(this.ele.children);
                let len = childs.length;
                sortByArray(this, childs.map((e, i) => len - 1 - i));
                emitUpdate(this[XDATASELF], "reverse", []);
            },
            sort(arg) {
                if (isFunction(arg)) {
                    // 新生成数组
                    let fake_this = Array.from(this.ele.children).map(e => createXhearEle(e));
                    let backup_fake_this = Array.from(fake_this);

                    // 执行排序函数
                    fake_this.sort(arg);

                    // 记录顺序
                    arg = [];
                    let putId = getRandomId();

                    fake_this.forEach(e => {
                        let id = backup_fake_this.indexOf(e);
                        // 防止查到重复值，所以查到过的就清空覆盖
                        backup_fake_this[id] = putId;
                        arg.push(id);
                    });
                }

                if (arg instanceof Array) {
                    // 修正新顺序
                    sortByArray(this, arg);
                }

                emitUpdate(this[XDATASELF], "sort", [arg]);
            }
        });
        // 注册数据
        const regDatabase = new Map();

        const RUNARRAY = Symbol("runArray");

        const ATTRBINDINGKEY = "attr" + getRandomId();

        const register = (opts) => {
            let defaults = {
                // 自定义标签名
                tag: "",
                // 正文内容字符串
                temp: "",
                // 和attributes绑定的keys
                attrs: [],
                // 默认数据
                data: {},
                // 直接监听属性变动对象
                watch: {},
                // 原型链上的方法
                // proto: {},
                // 初始化完成后触发的事件
                // inited() {},
                // 添加进document执行的callback
                // attached() {},
                // 删除后执行的callback
                // detached() {}
            };
            Object.assign(defaults, opts);

            // 复制数据
            let attrs = defaults.attrs = defaults.attrs.map(val => propToAttr(val));
            defaults.data = cloneObject(defaults.data);
            defaults.watch = Object.assign({}, defaults.watch);

            // 转换tag
            let tag = defaults.tag = propToAttr(defaults.tag);

            if (defaults.temp) {
                let {
                    temp
                } = defaults;

                // 去除无用的代码（注释代码）
                temp = temp.replace(/<!--.+?-->/g, "");

                // 准换自定义字符串数据
                var textDataArr = temp.match(/{{.+?}}/g);
                textDataArr && textDataArr.forEach((e) => {
                    var key = /{{(.+?)}}/.exec(e);
                    if (key) {
                        temp = temp.replace(e, `<xv-span xvkey="${key[1].trim()}"></xv-span>`);
                    }
                });

                defaults.temp = temp;
            }

            // 注册自定义元素
            let XhearElement = class extends HTMLElement {
                constructor() {
                    super();
                    renderEle(this, defaults);
                    defaults.inited && defaults.inited.call(createXhearEle(this)[PROXYTHIS]);

                    Object.defineProperties(this, {
                        [RUNARRAY]: {
                            writable: true,
                            value: 0
                        }
                    });
                }

                connectedCallback() {
                    if (this[RUNARRAY]) {
                        return;
                    }
                    defaults.attached && defaults.attached.call(createXhearEle(this)[PROXYTHIS]);
                }

                disconnectedCallback() {
                    if (this[RUNARRAY]) {
                        return;
                    }
                    defaults.detached && defaults.detached.call(createXhearEle(this)[PROXYTHIS]);
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    let xEle = this.__xhear__;
                    if (newValue != xEle[name]) {
                        xEle[name] = newValue;
                    }
                }

                static get observedAttributes() {
                    return attrs;
                }
            }

            Object.assign(defaults, {
                XhearElement
            });

            // 设置映射tag数据
            regDatabase.set(defaults.tag, defaults);

            customElements.define(tag, XhearElement);
        }

        const renderEle = (ele, defaults) => {
            // 初始化元素
            let xhearEle = createXhearEle(ele);

            // 合并 proto
            defaults.proto && xhearEle.extend(defaults.proto);

            // 设置值
            Object.defineProperty(ele, "xvele", {
                value: true
            });
            Object.defineProperty(xhearEle, "xvele", {
                value: true
            });

            if (defaults.temp) {
                // 添加shadow root
                let sroot = ele.attachShadow({
                    mode: "open"
                });

                // 填充默认内容
                sroot.innerHTML = defaults.temp;

                // 设置其他 xv-tar
                queAllToArray(sroot, `[xv-tar]`).forEach(tar => {
                    // Array.from(sroot.querySelectorAll(`[xv-tar]`)).forEach(tar => {
                    let tarKey = tar.getAttribute('xv-tar');
                    Object.defineProperty(xhearEle, "$" + tarKey, {
                        get: () => createXhearEle(tar)
                    });
                });

                // 转换 xv-span 元素
                queAllToArray(sroot, `xv-span`).forEach(e => {
                    // 替换xv-span
                    var textnode = document.createTextNode("");
                    e.parentNode.insertBefore(textnode, e);
                    e.parentNode.removeChild(e);

                    // 文本数据绑定
                    var xvkey = e.getAttribute('xvkey');

                    // 先设置值，后监听
                    xhearEle.watch(xvkey, (e, val) => textnode.textContent = val);
                });

                // :attribute对子元素属性修正方法
                queAllToArray(sroot, "*").forEach(ele => {
                    let attrbs = Array.from(ele.attributes);
                    attrbs.forEach(obj => {
                        let {
                            name,
                            value
                        } = obj;
                        let prop = value;
                        name = attrToProp(name);

                        let matchArr = /^:(.+)/.exec(name);
                        if (matchArr) {
                            let attr = matchArr[1];

                            // 判断是否双向绑定
                            let isEachBinding = /^#(.+)/.exec(attr);
                            if (isEachBinding) {
                                attr = isEachBinding[1];
                                isEachBinding = !!isEachBinding;
                            }

                            let watchCall;
                            if (ele.xvele) {
                                watchCall = (e, val) => {
                                    if (val instanceof XhearEle) {
                                        val = val.Object;
                                    }
                                    createXhearEle(ele).setData(attr, val);
                                }

                                // 双向绑定
                                if (isEachBinding) {
                                    createXhearEle(ele).watch(attr, (e, val) => {
                                        xhearEle.setData(prop, val);
                                    });
                                }
                            } else {
                                watchCall = (e, val) => ele.setAttribute(attr, val);
                            }
                            xhearEle.watch(prop, watchCall)
                        }
                    });
                });

                // 需要跳过的元素列表
                let xvModelJump = new Set();

                // 绑定 xv-model
                queAllToArray(sroot, `[xv-model]`).forEach(ele => {
                    if (xvModelJump.has(ele)) {
                        return;
                    }

                    let modelKey = ele.getAttribute("xv-model");

                    switch (ele.tagName.toLowerCase()) {
                        case "input":
                            let inputType = ele.getAttribute("type");
                            switch (inputType) {
                                case "checkbox":
                                    // 判断是不是复数形式的元素
                                    let allChecks = queAllToArray(sroot, `input[type="checkbox"][xv-model="${modelKey}"]`);

                                    // 查看是单个数量还是多个数量
                                    if (allChecks.length > 1) {
                                        allChecks.forEach(checkbox => {
                                            checkbox.addEventListener('change', e => {
                                                let {
                                                    value,
                                                    checked
                                                } = e.target;

                                                let tarData = xhearEle.getData(modelKey);
                                                if (checked) {
                                                    tarData.add(value);
                                                } else {
                                                    tarData.delete(value);
                                                }
                                            });
                                        });

                                        // 添加到跳过列表里
                                        allChecks.forEach(e => {
                                            xvModelJump.add(e);
                                        })
                                    } else {
                                        // 单个直接绑定checked值
                                        xhearEle.watch(modelKey, (e, val) => {
                                            ele.checked = val;
                                        });
                                        ele.addEventListener("change", e => {
                                            let {
                                                checked
                                            } = ele;
                                            xhearEle.setData(modelKey, checked);
                                        });
                                    }
                                    return;
                                case "radio":
                                    let allRadios = queAllToArray(sroot, `input[type="radio"][xv-model="${modelKey}"]`);

                                    let rid = getRandomId();

                                    allRadios.forEach(radioEle => {
                                        radioEle.setAttribute("name", `radio_${modelKey}_${rid}`);
                                        radioEle.addEventListener("change", e => {
                                            if (radioEle.checked) {
                                                xhearEle.setData(modelKey, radioEle.value);
                                            }
                                        });
                                    });
                                    return;
                            }
                            // 其他input 类型继续往下走
                            case "textarea":
                                xhearEle.watch(modelKey, (e, val) => {
                                    ele.value = val;
                                });
                                ele.addEventListener("input", e => {
                                    xhearEle.setData(modelKey, ele.value);
                                });
                                break;
                            case "select":
                                xhearEle.watch(modelKey, (e, val) => {
                                    ele.value = val;
                                });
                                ele.addEventListener("change", e => {
                                    xhearEle.setData(modelKey, ele.value);
                                });
                                break;
                            default:
                                // 自定义组件
                                if (ele.xvele) {
                                    let cEle = ele.__xhear__;
                                    cEle.watch("value", (e, val) => {
                                        xhearEle.setData(modelKey, val);
                                    });
                                    xhearEle.watch(modelKey, (e, val) => {
                                        cEle.setData("value", val);
                                    });
                                } else {
                                    console.warn(`can't xv-model with thie element => `, ele);
                                }
                    }
                });
                xvModelJump.clear();
                xvModelJump = null;
            }

            // watch事件绑定
            xhearEle.watch(defaults.watch);

            // 要设置的数据
            let rData = Object.assign({}, defaults.data);

            // attrs 上的数据
            defaults.attrs.forEach(attrName => {
                // 获取属性值并设置
                // let attrVal = ele.getAttribute(attrName);
                // if (!isUndefined(attrVal) && attrVal != null) {
                //     rData[attrName] = attrVal;
                // }

                // 绑定值
                xhearEle.watch(attrName, d => {
                    // 绑定值
                    ele.setAttribute(attrName, d.val);
                });
            });

            // 添加_exkey
            let canSetKey = Object.keys(rData);
            canSetKey.push(...defaults.attrs);
            canSetKey.push(...Object.keys(defaults.watch));
            canSetKey = new Set(canSetKey);
            Object.defineProperty(xhearEle, CANSETKEYS, {
                value: canSetKey
            });

            // 根据attributes抽取值
            let attributes = Array.from(ele.attributes);
            if (attributes.length) {
                attributes.forEach(e => {
                    // 属性在数据列表内，进行rData数据覆盖
                    let {
                        name
                    } = e;
                    name = attrToProp(name);
                    if (!/^xv\-/.test(name) && !/^:/.test(name) && canSetKey.has(name)) {
                        rData[name] = e.value;
                    }
                });
            }

            // 判断是否有value，进行vaule绑定
            if (canSetKey.has("value")) {
                Object.defineProperty(ele, "value", {
                    get() {
                        return xhearEle.value;
                    },
                    set(val) {
                        xhearEle.value = val;
                    }
                });
            }

            // 合并数据后设置
            canSetKey.forEach(k => {
                let val = rData[k];

                if (!isUndefined(val)) {
                    // xhearEle[k] = val;
                    xhearEle.setData(k, val);
                }
            });
        }

        const createXhearEle = ele => (ele.__xhear__ || new XhearEle(ele));

        // 全局用$
        let $ = (expr) => {
            if (expr instanceof XhearEle) {
                return expr;
            }

            let ele;

            if (getType(expr) === "string" && !/\<.+\>/.test(expr)) {
                ele = document.querySelector(expr);
            } else {
                ele = parseToDom(expr);
            }

            return ele ? createXhearEle(ele)[PROXYTHIS] : null;
        }

        Object.assign($, {
            register,
            nextTick,
            xdata: obj => createXData(obj)[PROXYTHIS],
            versinCode: 5000000,
            fn: XhearEleFn,
            isXhear
        });

        glo.$ = $;

    })(window);
    ((glo) => {
        "use strict";
        // common
        // 处理器（针对js类型）
        const processors = new Map();
        // 加载器（针对文件类型）
        const loaders = new Map();
        // 地址寄存器
        const bag = new Map();

        // 映射资源
        const paths = new Map();

        // 映射目录
        const dirpaths = {};

        // 错误处理数据
        let errInfo = {
            // 每个错误资源的最大错误请求次数
            // 默认错误的时候回再请求3次
            loadNum: 3,
            // 加载错误之后，再次加载的间隔时间(毫秒)
            time: 1000,
            // baseUrl后备仓
            backups: new Set()
        };

        // 基础数据对象
        let base = {
            processors,
            loaders,
            bag,
            paths,
            dirpaths,
            errInfo,
            // 根目录
            baseUrl: "",
            // 临时挂起的模块对象
            tempM: {}
        };

        // function
        // 获取随机id
        const getRandomId = () => Math.random().toString(32).substr(2);
        var objectToString = Object.prototype.toString;
        var getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
        const isFunction = d => getType(d).search('function') > -1;
        var isEmptyObj = obj => !(0 in Object.keys(obj));

        //改良异步方法
        const nextTick = (() => {
            let isTick = false;
            let nextTickArr = [];
            return (fun) => {
                if (!isTick) {
                    isTick = true;
                    setTimeout(() => {
                        for (let i = 0; i < nextTickArr.length; i++) {
                            nextTickArr[i]();
                        }
                        nextTickArr = [];
                        isTick = false;
                    }, 0);
                }
                nextTickArr.push(fun);
            };
        })();

        // 获取文件类型
        const getFileType = url => {
            let lastOri = url.split('/').pop();
            let fileType;
            let sArr = lastOri.match(/(.+)\.(.+)/);
            if (sArr) {
                // 得出文件类型
                fileType = sArr[2];
            }
            return fileType;
        };

        // 获取目录名
        const getDir = url => {
            let urlArr = url.match(/(.+\/).+/);
            return urlArr && urlArr[1];
        };

        //修正字符串路径
        const removeParentPath = (url) => {
            let urlArr = url.split(/\//g);
            let newArr = [];
            urlArr.forEach((e) => {
                if (e == '..' && newArr.length && (newArr.slice(-1)[0] != "..")) {
                    newArr.pop();
                    return;
                }
                newArr.push(e);
            });
            return newArr.join('/');
        };

        // 获取根目录地址
        const rootHref = getDir(document.location.href);

        // loaders添加css
        loaders.set("css", (packData) => {
            // 给主体添加css
            let linkEle = document.createElement('link');
            linkEle.rel = "stylesheet";
            linkEle.href = packData.link;

            linkEle.onload = () => {
                // 设置完成
                packData.stat = 3;
            }

            linkEle.onerror = () => {
                packData.stat = 2;
            }

            // 添加到head
            document.head.appendChild(linkEle);
        });

        // loaders添加json支持
        loaders.set("json", async (packData) => {
            let data;
            try {
                // 请求数据
                data = await fetch(packData.link);
            } catch (e) {
                packData.stat = 2;
                return;
            }
            // 转换json格式
            data = await data.json();

            // 重置getPack
            packData.getPack = async () => {
                return data;
            }

            // 设置完成
            packData.stat = 3;
        });

        // loaders添加wasm支持
        loaders.set("wasm", async (packData) => {
            let data;
            try {
                // 请求数据
                data = await fetch(packData.link);
            } catch (e) {
                packData.stat = 2;
                return;
            }
            // 转换arrayBuffer格式
            data = await data.arrayBuffer();

            // 转换wasm模块
            let module = await WebAssembly.compile(data);
            const instance = new WebAssembly.Instance(module);

            // 重置getPack
            packData.getPack = async () => {
                return instance.exports;
            }

            // 设置完成
            packData.stat = 3;
        });

        // loaders添加iframe辅助线程支持
        loaders.set("frame", async (packData) => {
            // 新建iframe
            let iframeEle = document.createElement("iframe");

            // 设置不可见样式
            Object.assign(iframeEle.style, {
                position: "absolute",
                "z-index": "-1",
                border: "none",
                outline: "none",
                opacity: "0",
                width: "0",
                height: "0"
            });

            // 转换并获取真实链接
            let {
                link,
                path
            } = packData;

            // 更新path
            let newPath = path.replace(/\.frame$/, "/frame.html");

            // 更新link
            let newLink = link.replace(path, newPath);

            // 设置链接
            iframeEle.src = newLink;

            // taskID记录器
            let taskIDs = new Map();

            // 添加计时器，当计算都完成时，计时10秒内，没有传入参数操作，就进行回收进程
            let clearer = () => {
                // 清除对象
                bag.delete(path);

                // 去除iframe
                document.body.removeChild(iframeEle);

                // 去除message监听
                window.removeEventListener("message", messageFun);

                // 快速内存回收
                messageFun = packData = clearer = null;
            };
            packData.timer = setTimeout(clearer, 10000);

            // 设置getPack函数
            packData.getPack = (urlData) => new Promise(res => {
                // 计算taskId
                let taskId = getRandomId();

                // 清除计时器
                clearTimeout(packData.timer);

                // 添加taskID和相应函数
                taskIDs.set(taskId, {
                    res
                });

                // 发送数据过去
                iframeEle.contentWindow.postMessage({
                    type: "drillFrameTask",
                    taskId,
                    data: urlData.data
                }, '*');
            })

            // 在 windows上设置接收器
            let messageFun;
            window.addEventListener("message", messageFun = e => {
                let {
                    data,
                    taskId
                } = e.data;

                // 判断是否在taskID内
                if (taskIDs.has(taskId)) {
                    // 获取记录对象
                    let taskObj = taskIDs.get(taskId);

                    // 去除taskID
                    taskIDs.delete(taskId);

                    // 返回数据
                    taskObj.res(data);
                }

                // 当库存为0时，计时清理函数
                if (!taskIDs.size) {
                    packData.timer = setTimeout(clearer, 10000);
                }
            });

            // 加载完成函数
            iframeEle.addEventListener('load', e => {
                // 设置完成
                packData.stat = 3;
            });

            // 错误函数
            iframeEle.addEventListener('error', e => {
                packData.stat = 2;
            });

            // 添加到body
            document.body.appendChild(iframeEle);
        });

        // loaders添加js加载方式
        loaders.set("js", (packData) => {
            // 主体script
            let script = document.createElement('script');


            //填充相应数据
            script.type = 'text/javascript';
            script.async = true;
            script.src = packData.link;

            // 添加事件
            script.addEventListener('load', () => {
                // 根据tempM数据设置type
                let {
                    tempM
                } = base;

                // type:
                // file 普通文件类型
                // define 模块类型
                // task 进程类型
                let {
                    type,
                    moduleId
                } = tempM;

                // 判断是否有自定义id
                if (moduleId) {
                    bag.get(moduleId) || bag.set(moduleId, packData);
                }

                // 进行processors断定
                // 默认是file类型
                let process = processors.get(type || "file");

                if (process) {
                    process(packData);
                } else {
                    throw "no such this processor => " + type;
                }

                // 清空tempM
                base.tempM = {};
            });
            script.addEventListener('error', () => {
                // 加载错误
                packData.stat = 2;
            });

            // 添加进主体
            document.head.appendChild(script);
        });
        // processors添加普通文件加载方式
        processors.set("file", (packData) => {
            // 直接修改完成状态
            packData.stat = 3;
        });

        // 添加define模块支持
        processors.set("define", async (packData) => {
            let d = base.tempM.d;

            let exports = {},
                module = {
                    exports
                };

            // 根据内容填充函数
            if (isFunction(d)) {
                let {
                    path,
                    dir
                } = packData;

                // 函数类型
                d = d((...args) => {
                    return load(toUrlObjs(args, dir));
                }, exports, module, {
                    FILE: path,
                    DIR: dir
                });
            }

            // Promise函数
            if (d instanceof Promise) {
                // 等待获取
                d = await d;
            }

            // 判断值是否在 exports 上
            if (!d && !isEmptyObj(module.exports)) {
                d = module.exports;
            }

            // 修正getPack方法
            packData.getPack = async () => {
                return d;
            }

            // 修正状态
            packData.stat = 3;
        });

        // 添加task模块支持
        processors.set("task", (packData) => {
            let d = base.tempM.d;

            // 判断d是否函数
            if (!isFunction(d)) {
                throw 'task must be a function';
            }

            let {
                path,
                dir
            } = packData;

            // 修正getPack方法
            packData.getPack = async (urlData) => {
                let reData = await d((...args) => {
                    return load(toUrlObjs(args, dir));
                }, urlData.data, {
                    FILE: path,
                    DIR: dir
                });

                return reData;
            }

            // 修正状态
            packData.stat = 3;
        });

        // 添加init模块支持
        processors.set("init", (packData) => {
            let d = base.tempM.d;

            // 判断d是否函数
            if (!isFunction(d)) {
                throw 'init must be a function';
            }

            let {
                path,
                dir
            } = packData;

            let isRun = 0;
            let redata;

            // 修正getPack方法
            packData.getPack = async (urlData) => {
                if (isRun) {
                    return redata;
                }

                // 等待返回数据
                redata = await d((...args) => {
                    return load(toUrlObjs(args, dir));
                }, urlData.data, {
                    FILE: path,
                    DIR: dir
                });

                // 设置已运行
                isRun = 1;

                return redata;
            }

            // 修正状态
            packData.stat = 3;
        });

        const getLoader = (fileType) => {
            // 立即请求包处理
            let loader = loaders.get(fileType);

            if (!loader) {
                console.log("no such this loader => " + fileType);
                loader = getByUtf8;
            }

            return loader;
        }

        // 获取并通过utf8返回数据
        const getByUtf8 = async packData => {
            let data;
            try {
                // 请求数据
                data = await fetch(packData.link);
            } catch (e) {
                packData.stat = 2;
                return;
            }
            // 转换json格式
            data = await data.text();

            // 重置getPack
            packData.getPack = async () => {
                return data;
            }

            // 设置完成
            packData.stat = 3;
        }

        // 代理加载
        // 根据不同加载状态进行组装
        let agent = (urlObj) => {
            // 根据url获取资源状态
            let packData = bag.get(urlObj.path);

            if (!packData) {
                // 加载状态
                // 1加载中
                // 2加载错误，重新装载中
                // 3加载完成
                // 4彻底加载错误，别瞎折腾了
                let stat = 1;

                packData = {
                    get stat() {
                        return stat;
                    },
                    set stat(d) {
                        // 记录旧状态
                        let oldStat = stat;

                        // set
                        stat = d;

                        // 改动stat的时候触发changes内的函数
                        this.changes.forEach(callback => callback({
                            change: "stat",
                            oldStat,
                            stat
                        }));
                    },
                    dir: urlObj.dir,
                    path: urlObj.path,
                    link: urlObj.link,
                    dir: urlObj.dir,
                    // 改动事件记录器
                    changes: new Set(),
                    // 记录装载状态
                    fileType: urlObj.fileType,
                    // 包的getter函数
                    // 包加载完成时候，有特殊功能的，请替换掉async getPack函数
                    async getPack(urlObj) {}
                };

                // 设置包数据
                bag.set(urlObj.path, packData);

                // 立即请求包处理
                getLoader(urlObj.fileType)(packData);
            }

            return new Promise((res, rej) => {
                // 根据状态进行处理
                switch (packData.stat) {
                    case 2:
                        // 加载错误的重新装载，也加入队列
                    case 1:
                        // 添加状态改动callback，确认加载完成的状态后，进行callback
                        let statChangeCallback;
                        packData.changes.add(statChangeCallback = (d) => {
                            // 获取改动状态
                            let {
                                stat
                            } = d;

                            switch (stat) {
                                case 3:
                                    // 加载完成，运行getPack函数
                                    packData.getPack(urlObj).then(res);

                                    // 清除自身callback
                                    packData.changes.delete(statChangeCallback);
                                    packData = null;
                                    break;
                                case 2:
                                    // 重新装载
                                    // 获取计数器
                                    let loadCount = (packData.loadCount != undefined) ? packData.loadCount : (packData.loadCount = 0);

                                    // 存在次数
                                    if (loadCount < errInfo.loadNum) {
                                        // 递增
                                        packData.loadCount++;

                                        // 重新装载
                                        setTimeout(() => getLoader(packData.fileType)(packData), errInfo.time);
                                    } else {
                                        // 查看有没有后备仓
                                        let {
                                            backups
                                        } = errInfo;

                                        // 确认后备仓
                                        if (backups.size) {
                                            // 查看当前用了几个后备仓
                                            let backupId = (packData.backupId != undefined) ? packData.backupId : (packData.backupId = -1);
                                            if (backupId < backups.size) {
                                                // 转换数组
                                                let barr = Array.from(backups);
                                                let oldBaseUrl = barr[backupId] || packData.dir;

                                                // 递增backupId
                                                backupId = ++packData.backupId;
                                                let newBaseUrl = barr[backupId];

                                                // 修正数据重新载入
                                                packData.loadCount = 1;
                                                packData.link = packData.link.replace(new RegExp("^" + oldBaseUrl), newBaseUrl);

                                                // 重新装载
                                                setTimeout(() => getLoader(packData.fileType)(packData), errInfo.time);
                                                return;
                                            }
                                        }
                                        // 载入不进去啊大佬，别费劲了
                                        packData.stat = 4;
                                    }

                                    break;
                                case 4:
                                    rej("source error");
                                    break;
                            }
                        });
                        break;
                    case 3:
                        nextTick(() => {
                            // 已经加载完成的，直接获取
                            packData.getPack(urlObj).then(res);
                        });
                        break;
                    case 4:
                        // 彻底加载错误的资源，就别瞎折腾了
                        rej("source error");
                        break;
                }
            });

        }

        // 主体加载函数
        let load = (urlObjs) => {
            let pendFunc;
            let p = new Promise((res, rej) => {
                // 要返回的数据
                let reValue = [];

                // 获取原来的长度
                let {
                    length
                } = urlObjs;
                let sum = length;

                // 是否有出错
                let hasError = [];

                urlObjs.forEach(async (obj, i) => {
                    // 载入的状态
                    let stat = "succeed";

                    // 中转加载资源
                    let d;

                    // 判断是否有getPath参数
                    if (obj.param && obj.param.includes("-getPath")) {
                        d = obj.link;
                    } else {
                        d = await agent(obj).catch(e => {
                            stat = "error";
                            Object.assign(obj, {
                                type: "error",
                                descript: e
                            });
                            hasError.push(obj);
                        });
                    }

                    // 设置数据
                    reValue[i] = d;

                    // 触发pending
                    pendFunc && pendFunc({
                        // 当前所处id
                        id: i,
                        // 总数
                        sum,
                        ready: sum - length + 1,
                        stat
                    });

                    // 计时减少
                    length--;

                    if (!length) {
                        if (!hasError.length) {
                            // 单个的话直接返回单个的数据
                            if (sum == 1) {
                                res(d);
                            } else {
                                res(reValue);
                            }
                        } else {
                            // 出错了
                            rej(hasError);
                        }
                        reValue = null;
                    }
                });
            });

            // 挂载两个方法
            p.post = function(data) {
                urlObjs.forEach(e => e.data = data);
                return this;
            };
            p.pend = function(func) {
                pendFunc = func;
                return this;
            };

            return p;
        }

        // 转换出url字符串对象
        let fixUrlObj = (urlObj) => {
            let {
                str
            } = urlObj;

            // 判断是否注册在bag上的直接的id
            if (bag.has(str)) {
                let tarBag = bag.get(str);
                Object.assign(urlObj, {
                    path: tarBag.path,
                    link: tarBag.link,
                    dir: tarBag.dir
                });
                return urlObj;
            }

            // 拆分空格数据
            let ndata = str.split(/\s/).filter(e => e && e);

            let param = ndata.slice(1);

            // 第一个参数是路径名
            let ori = ndata[0];

            // 拆分问号(?)后面的 url param
            let search = ori.match(/(.+)\?(\S+)$/) || "";
            if (search) {
                ori = search[1];
                search = search[2];
            }
            // 判断是否要加版本号
            let {
                k,
                v
            } = drill.cacheInfo;
            if (k && v) {
                search && (search += "&");
                search += k + '=' + v;
            }

            // 查看是否有映射路径
            let tarpath = paths.get(ori);
            if (tarpath) {
                ori = tarpath;
            } else {
                // 查看是否有映射目录
                // 判断是否注册目录
                for (let i in dirpaths) {
                    let tar = dirpaths[i];
                    if (tar.reg.test(ori)) {
                        ori = ori.replace(tar.reg, tar.value);
                        break
                    }
                }
            }

            // 得出fileType
            let fileType = getFileType(ori) || "js";

            // ori去掉后缀
            ori = ori.replace(new RegExp('\\.' + fileType + "$"), "");

            // 主体path
            let path;

            // 判断是否有基于根目录参数
            if (param.indexOf('-r') > -1 || /^.+:\/\//.test(ori)) {
                path = ori;
            } else if (/^\./.test(ori)) {
                if (urlObj.relative) {
                    // 添加相对路径
                    path = urlObj.relative + ori;
                } else {
                    path = ori.replace(/^\.\//, "");
                }
            } else {
                // 添加相对目录，得出资源地址
                path = base.baseUrl + ori;
            }

            // 判断是否带有 -pack 参数
            if (param.includes('-pack')) {
                let pathArr = path.match(/(.+)\/(.+)/);
                if (pathArr && (2 in pathArr)) {
                    ori = path = pathArr[1] + "/" + pathArr[2] + "/" + pathArr[2];
                } else {
                    ori = path = `${path}/${path}`
                }
            }

            // 判断不是协议开头的，加上当前的根目录
            if (!/^.+:\/\//.test(path)) {
                path = rootHref + path;
            }

            // 修正单点
            path = path.replace(/\/\.\//, "/");

            // 修正两点（上级目录）
            if (/\.\.\//.test(path)) {
                path = removeParentPath(path);
            }

            // 添加后缀
            path += "." + fileType;

            // 根据资源地址计算资源目录
            let dir = getDir(path);

            // 写入最终请求资源地址
            let link = search ? (path + "?" + search) : path;

            Object.assign(urlObj, {
                link,
                search,
                ori,
                fileType,
                path,
                dir,
                param
            });

            return urlObj;
        }

        // 轻转换函数
        const toUrlObjs = (args, relative) => {
            // 生成组id
            let groupId = getRandomId();

            // 转化成urlObj
            return args.map((url, id) => fixUrlObj({
                loadId: getRandomId(),
                id,
                str: url,
                groupId,
                relative
            }));
        }
        const drill = {
            load(...args) {
                return load(toUrlObjs(args));
            },
            remove(url) {
                let {
                    path
                } = fixUrlObj({
                    str: url
                });

                if (bag.has(path)) {
                    bag.delete(path);

                    //告示删除成功
                    return !0;
                } else {
                    console.warn(`pack %c${url}`, "color:red", `does not exist`);
                }
            },
            has(url) {
                let {
                    path
                } = fixUrlObj({
                    str: url
                });

                let packData = bag.get(path);

                return packData && packData.stat;
            },
            config(options) {
                options.baseUrl && (base.baseUrl = options.baseUrl);

                //配置paths
                let oPaths = options.paths;
                oPaths && Object.keys(oPaths).forEach(i => {
                    if (/\/$/.test(i)) {
                        //属于目录类型
                        dirpaths[i] = {
                            // 正则
                            reg: new RegExp('^' + i),
                            // 值
                            value: oPaths[i]
                        };
                    } else {
                        //属于资源类型
                        paths.set(i, oPaths[i]);
                    }
                });

                // 后备仓
                if (base.baseUrl && options.backups) {
                    options.backups.forEach(url => {
                        errInfo.backups.add(url);
                    });
                }
            },
            define(d, moduleId) {
                base.tempM = {
                    type: "define",
                    d,
                    moduleId
                };
            },
            task(d, moduleId) {
                base.tempM = {
                    type: "task",
                    d,
                    moduleId
                };
            },
            init(d, moduleId) {
                base.tempM = {
                    type: "init",
                    d,
                    moduleId
                };
            },
            // 扩展开发入口
            ext(f_name, func) {
                if (isFunction(f_name)) {
                    f_name(base);
                } else {
                    // 旧的方法
                    let oldFunc;

                    // 中间件方法
                    let middlewareFunc = (...args) => func(args, oldFunc, base);

                    switch (f_name) {
                        case "fixUrlObj":
                            oldFunc = fixUrlObj;
                            fixUrlObj = middlewareFunc;
                            break;
                        case "load":
                            oldFunc = load;
                            load = middlewareFunc;
                            break;
                        case "agent":
                            oldFunc = agent;
                            agent = middlewareFunc;
                            break;
                    }
                }
            },
            cacheInfo: {
                k: "d_ver",
                v: ""
            },
            debug: {
                bag
            },
            version: 3002002
        };

        // 挂载主体方法
        let mainFunObj = {
            get agent() {
                return agent;
            },
            get load() {
                return load;
            },
            get fixUrlObj() {
                return fixUrlObj;
            },
            get toUrlObjs() {
                return toUrlObjs;
            }
        };
        Object.defineProperty(base, "main", {
            value: mainFunObj
        });

        // init 
        glo.load || (glo.load = drill.load);
        glo.define || (glo.define = drill.define);
        glo.task || (glo.task = drill.task);
        glo.init || (glo.init = drill.init);

        // 初始化版本号
        let cScript = document.currentScript;
        !cScript && (cScript = document.querySelector(['drill-cache']));

        if (cScript) {
            let cacheVersion = cScript.getAttribute('drill-cache');
            cacheVersion && (drill.cacheInfo.v = cacheVersion);
        }

        // 判断全局是否存在变量 drill
        let oldDrill = glo.drill;

        // 定义全局drill
        Object.defineProperty(glo, 'drill', {
            get: () => drill,
            set(func) {
                if (isFunction(func)) {
                    nextTick(() => func(drill));
                } else {
                    console.error('drill type error =>', func);
                }
            }
        });

        // 执行全局的 drill函数
        oldDrill && nextTick(() => oldDrill(drill));
    })(window);

    drill.ext(base => {
        let {
            loaders,
            processors,
            main
        } = base;

        // 设置控件类型
        processors.set("component", async packData => {
            let defaults = {
                // 默认模板
                temp: false,
                // 加载组件样式
                link: false,
                // 与组件同域下的样式
                hostlink: "",
                // 当前模块刚加载的时候
                onload() {},
                // 组件初始化完毕时
                inited() {},
                // 依赖子模块
                use: []
            };

            // load方法
            const load = (...args) => main.load(main.toUrlObjs(args, packData.dir));

            // 合并默认参数
            Object.assign(defaults, base.tempM.d);

            // 获取文件名
            let fileName = packData.path.match(/.+\/(.+)/)[1];
            fileName = fileName.replace(/\.js$/, "");

            // 添加子组件
            if (defaults.use && defaults.use.length) {
                await load(...defaults.use);
            }

            // 执行onload
            await defaults.onload({
                load,
                DIR: packData.dir,
                FILE: packData.path
            });

            // 置换temp
            let temp = "";
            if (defaults.temp) {
                // 判断是否有换行
                if (/\n/.test(defaults.temp)) {
                    // 拥有换行，是模板字符串
                    temp = defaults.temp;
                } else {
                    let path;
                    if (defaults.temp === true) {
                        path = await load(`./${fileName}.html -getPath`)
                    } else {
                        // path = defaults.temp;
                        path = await load(`${defaults.temp} -getPath`);
                    }
                    temp = await fetch(path);
                    temp = await temp.text();
                }

                // 添加link
                let linkPath = defaults.link;
                if (linkPath) {
                    if (defaults.link === true) {
                        linkPath = await load(`./${fileName}.css -getPath`);
                    } else {
                        linkPath = await load(`${defaults.link} -getPath`);
                    }
                    linkPath && (temp = `<link rel="stylesheet" href="${linkPath}">\n` + temp);
                }
            }

            defaults.temp = temp;

            // inited钩子
            if (defaults.hostlink) {
                let oldInited = defaults.inited;

                defaults.inited = async function(...args) {
                    // 添加hostlink
                    // 获取元素域上的主
                    let root = this.ele.getRootNode();

                    let hostlink = await load(defaults.hostlink + " -getPath");

                    // 查找是否已经存在该link
                    let targetLinkEle = root.querySelector(`link[href="${hostlink}"]`)

                    if (!targetLinkEle) {
                        let linkEle = $(`<link rel="stylesheet" href="${hostlink}">`);
                        if (root === document) {
                            root.querySelector("head").appendChild(linkEle.ele);
                        } else {
                            root.appendChild(linkEle.ele);
                        }
                    }

                    // 执行inited方法
                    oldInited.apply(this, args);
                }
            }

            // 注册节点
            $.register(defaults);

            // 设置模块载入完成
            packData.stat = 3;
        });

        // 添加新类型
        drill.Component = (d, moduleId) => {
            base.tempM = {
                type: "component",
                d,
                moduleId
            };
        }

        // 添加新类型
        glo.Component || (glo.Component = drill.Component);
    });

    drill.config({
        paths: {
            "^\\$/": "https://kirakiray.github.io/xdframe_lib/dollar2/"
        }
    });

    // 配置全局变量
    glo.XDFrame = {
        drill,
        $,
        version: 2000000
    };
})(window);