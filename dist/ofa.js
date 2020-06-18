/*!
 * ofa v2.5.0
 * https://github.com/kirakiray/ofa.js
 * 
 * (c) 2018-2020 YAO
 * Released under the MIT License.
 */
((glo) => {
    "use strict";
    /*!
     * xhear v5.1.1
     * https://github.com/kirakiray/Xhear#readme
     * 
     * (c) 2018-2020 YAO
     * Released under the MIT License.
     */
    ((glo) => {
        "use strict";
        const getRandomId = () => Math.random().toString(32).substr(2);
        let objectToString = Object.prototype.toString;
        const getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
        const isUndefined = val => val === undefined;
        const isFunction = val => getType(val).includes("function");
        const cloneObject = obj => JSON.parse(JSON.stringify(obj));

        const nextTick = (() => {
            if (document.currentScript.getAttribute("debug") !== null) {
                let nMap = new Map();
                return (fun, key) => {
                    if (!key) {
                        key = getRandomId();
                    }

                    let timer = nMap.get(key);
                    clearTimeout(timer);
                    nMap.set(key, setTimeout(() => {
                        fun();
                        nMap.delete(key);
                    }));
                };
            }

            let inTick = false;

            // 定位对象寄存器
            let nextTickMap = new Map();

            let pnext = setTimeout;

            if (typeof process === "object" && process.nextTick) {
                pnext = process.nextTick;
            }

            return (fun, key) => {
                if (!inTick) {
                    inTick = true;
                    pnext(() => {
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
                    });
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
                args: args.map(e => {
                    if (e instanceof XData) {
                        return e.object;
                    } else if (e instanceof Object) {
                        return cloneObject(e);
                    }
                    return e;
                }),
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

        const hasElement = typeof Element !== "undefined";

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

                    if (/^\_/.test(k) || (hasElement && value instanceof Element)) {
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
                    _this.setData(key, value);
                    return true;
                }

                if (getType(key) === "string") {
                    let oldVal = _this[key];

                    if (value === oldVal) {
                        // 一样还瞎折腾干嘛
                        return true;
                    }

                    if (oldVal instanceof XData) {
                        oldVal = oldVal.object;
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

                    return true;

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
                        _update,
                        _unpush
                    } = this;
                    let {
                        fromKey
                    } = event.trend;
                    if (_update === false || (_unBubble && _unBubble.includes(fromKey))) {
                        event.bubble = false;
                        // return event;
                    }

                    if (_unpush && _unpush.includes(fromKey)) {
                        Object.defineProperty(event, "_unpush", {
                            value: true
                        });
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
             * @param {Boolean} ImmeOpt 是否立刻触发callback
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
                    ImmeOpt = callback;
                    callback = expr;
                    expr = "";
                }

                // 根据参数调整类型
                let watchType;

                if (expr === "") {
                    watchType = "watchSelf";
                } else if (expr instanceof RegExp) {
                    watchType = "watchKeyReg";
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
                    case "watchKeyReg":
                        // 监听key
                        updateMethod = e => {
                            let {
                                trend
                            } = e;
                            if ((watchType === "watchKeyReg" && expr.test(trend.fromKey)) || trend.fromKey == expr) {
                                cacheObj.trends.push(e.trend);

                                if (!cacheObj.cacheOld) {
                                    // 获取旧值
                                    cacheObj._oldVal = e.oldValue instanceof XData ? e.oldValue.object : e.oldValue;
                                    cacheObj.cacheOld = true;
                                }

                                nextTick(() => {
                                    let val = this[expr];

                                    callback.call(callSelf, {
                                        expr,
                                        val,
                                        // old: cacheObj.trends[0].args[1],
                                        old: cacheObj._oldVal,
                                        trends: Array.from(cacheObj.trends)
                                    }, val);

                                    cacheObj.trends.length = 0;
                                    cacheObj._oldVal = cacheObj.cacheOld = false;
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
                    args,
                    _unpush
                } = trend;

                if (_unpush) {
                    // 不同步的就返回
                    return;
                }

                let {
                    _unpull
                } = this;
                let fkey = getFromKey(trend);
                if (_unpull && _unpull.includes(fkey)) {
                    return;
                }

                if (!mid) {
                    throw {
                        text: "Illegal trend data"
                    };
                }

                // 获取相应目标，并运行方法
                let target = this.getTarget(keys);
                let targetSelf = target[XDATASELF];

                if (getXDataProp(targetSelf, MODIFYIDS).includes(mid)) {
                    return false;
                }

                targetSelf._modifyId = mid;
                // target._modifyId = mid;
                targetSelf[name](...args);
                targetSelf._modifyId = null;

                return true;
            }
        }

        const getFromKey = (_this) => {
            let keyOne = _this.keys[0];

            if (isUndefined(keyOne) && (_this.name === "setData" || _this.name === "remove")) {
                keyOne = _this.args[0];
            }

            return keyOne;
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
                    // 元对象数据会被修改，必须深克隆数据
                    let {
                        modify: {
                            name,
                            args,
                            mid
                        },
                        keys
                    } = cloneObject(xevent);
                    let {
                        _unpush
                    } = xevent;
                    // let { modify: { name, args, mid }, keys, _unpush } = xevent;

                    if (_unpush) {
                        Object.defineProperty(this, "_unpush", {
                            value: true
                        });
                    }

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
                return getFromKey(this);

                // let keyOne = this.keys[0];

                // if (isUndefined(keyOne) && (this.name === "setData" || this.name === "remove")) {
                //     keyOne = this.args[0];
                // }

                // return keyOne;
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
                            let obj = this.object;

                            Object.keys(obj).forEach(k => {
                                xdata.setData(k, obj[k]);
                            });
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

                        let oldValue = _this.object;

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

                        emitUpdate(_this, methodName, args, {
                            oldValue
                        });

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
                    let oldValue = _this.object;
                    let oldThis = Array.from(_this);
                    if (isFunction(arg) || !arg) {
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

                    emitUpdate(_this, "sort", args, {
                        oldValue
                    });

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
            if (ele === document) {
                return false;
            }
            let tempEle = document.createElement('template');
            let html = `<${ele.tagName.toLowerCase()} ${Array.from(ele.attributes).map(e => e.name + '="' + e.value + '"').join(" ")} />`

            tempEle.innerHTML = html;
            return !!tempEle.content.querySelector(expr);
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
                    if (expr instanceof Element || expr instanceof DocumentFragment || expr instanceof Document) {
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

        // 设置属性
        const attrsHandler = {
            get: function(target, prop) {
                return target._ele.getAttribute(propToAttr(prop));
            },
            set: function(target, prop, value) {
                if (value === null) {
                    target._ele.removeAttribute(prop);
                } else {
                    target._ele.setAttribute(propToAttr(prop), String(value));
                }

                return true;
            }
        };

        /**
         * 元素 attributes 代理对象
         */
        class Attrs {
            constructor(ele) {
                Object.defineProperties(this, {
                    _ele: {
                        get: () => ele
                    }
                });
            }
        }

        /**
         * 生成代理attrs对象
         * @param {HTMLElement} ele 目标html元素
         */
        const createProxyAttrs = (ele) => {
            let proxyAttrs = ele.__p_attrs;

            if (!proxyAttrs) {
                ele.__p_attrs = proxyAttrs = new Proxy(new Attrs(ele), attrsHandler);
            }

            return proxyAttrs;
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
                        value: this,
                        configurable: true
                    }
                });
                let tagValue = ele.tagName ? ele.tagName.toLowerCase() : '';
                Object.defineProperties(this, {
                    tag: {
                        enumerable: true,
                        value: tagValue
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
                return (!parentNode || parentNode === document) ? null : createXhearProxy(parentNode);
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
                if (getType(d) == "string") {
                    this.ele.style = d;
                    return;
                }

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

            get $shadow() {
                let {
                    shadowRoot
                } = this.ele;
                return shadowRoot && createXhearProxy(shadowRoot);
            }

            get $root() {
                let root = this.ele;
                while (root.parentNode) {
                    root = root.parentNode;
                }
                return root && createXhearProxy(root);
            }

            get $host() {
                let {
                    $root
                } = this;
                return $root && $root.ele.host && createXhearProxy($root.ele.host);
            }

            get attrs() {
                return createProxyAttrs(this.ele);
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

                    // 这里还欠缺冒泡机制的
                    if (targetChild) {
                        let oldVal = _this.getData(key).object;

                        _this.ele.insertBefore(xele.ele, targetChild);
                        _this.ele.removeChild(targetChild);

                        // 冒泡设置
                        emitUpdate(_this, "setData", [key, value], {
                            oldValue: oldVal
                        });
                    } else {
                        _this.ele.appendChild(xele.ele);

                        // 冒泡设置
                        emitUpdate(_this, "setData", [key, value], {
                            oldValue: undefined
                        });
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
                    target && (target = createXhearProxy(target));
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

                return parChilds.map(e => createXhearProxy(e));
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

            // attr(key, value) {
            //     if (!isUndefined(value)) {
            //         this.ele.setAttribute(key, value);
            //     } else if (key instanceof Object) {
            //         Object.keys(key).forEach(k => {
            //             this.attr(k, key[k]);
            //         });
            //     } else {
            //         return this.ele.getAttribute(key);
            //     }
            // }

            // removeAttr(key) {
            //     this.ele.removeAttribute(key);
            //     return this;
            // }

            $(expr) {
                let tar = this.ele.querySelector(expr);
                if (tar) {
                    return createXhearProxy(tar);
                }
            }

            all(expr) {
                return queAllToArray(this.ele, expr).map(tar => createXhearProxy(tar));
            }

            clone() {
                let cloneEle = createXhearProxy(this.ele.cloneNode(true));

                // 数据重新设置
                Object.keys(this).forEach(key => {
                    if (key !== "tag") {
                        cloneEle[key] = this[key];
                    }
                });

                return cloneEle;
            }

            // 根据xv-vd生成xdata实例
            viewData() {
                let xdata = createXData({});

                // 获取所有toData元素
                this.all('[xv-vd]').forEach(xele => {
                    // 获取vd内容
                    let vdvalue = xele.attrs.xvVd;

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

                    xele.attrs.xvVd = null;
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

                        if (set) {
                            // 添加到可设置key权限内
                            xEleDefaultSetKeys.add(k);
                        }
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

        // 分析事件参数
        const anlyEveOpts = (args) => {
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

            return {
                eventName,
                selector,
                callback,
                data
            };
        }

        // 绑定事件on方法抽离
        function onEve(args, onOpts = {
            count: Infinity
        }) {
            let {
                eventName,
                selector,
                callback,
                data
            } = anlyEveOpts(args);

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
                            event.target = createXhearProxy(e.target);
                        }

                        let newKeys = [];

                        let tarEle = e.target;
                        while (tarEle !== e.currentTarget) {
                            let par = tarEle.parentNode;
                            if (!par) {
                                break;
                            }
                            let tarId = Array.from(par.children).indexOf(tarEle);
                            newKeys.unshift(tarId);
                            tarEle = par;
                        }

                        // 重新修正keys
                        event.keys = newKeys;
                    } else {
                        event = new XEvent({
                            type: eventName,
                            target: createXhearProxy(e.target)
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

                    // 次数修正
                    // 计数递减
                    onOpts.count--;
                    if (!onOpts.count) {
                        this.off(eventName, callback);
                    }
                }
                originEve.set(eventName, eventCall);
                this.ele.addEventListener(eventName, eventCall);
            }

            this.addListener({
                type: eventName,
                count: onOpts.count,
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
                            let delegateTarget;
                            if (target.is(selector)) {
                                delegateTarget = target;
                            } else {
                                delegateTarget = target.parents(selector)[0];
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
        }

        XhearEleFn.extend({
            on(...args) {
                onEve.call(this, args);
                return this;
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
                    originEve.delete(eventName);
                }
                return this;
            },
            one(...args) {
                onEve.call(this, args, {
                    count: 1
                });
                return this;
            },
            trigger(type, opts) {
                let event;

                let defaults = {
                    bubbles: true,
                    cancelable: true
                };

                Object.assign(defaults, opts);

                if (type instanceof Event) {
                    event = type;
                } else {
                    let E = EventMap.get(type) || Event;
                    event = new E(type, {
                        bubbles: defaults.bubbles,
                        cancelable: defaults.cancelable
                    });
                }

                // 触发事件
                this.ele.dispatchEvent(event);

                return this;
            }
        });
        // 不影响数据原结构的方法，重新做钩子
        ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
            let arrayFnFunc = Array.prototype[methodName];
            if (arrayFnFunc) {
                Object.defineProperty(XhearEleFn, methodName, {
                    value(...args) {
                        return arrayFnFunc.apply(Array.from(this.ele.children).map(e => createXhearProxy(e)), args);
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

            let c_howmany = howmany;

            while (c_howmany > 0) {
                let childEle = children[index];

                if (!childEle) {
                    break;
                }

                reArr.push(createXhearProxy(childEle));

                // 删除目标元素
                tarele.removeChild(childEle);

                // 数量减少
                c_howmany--;
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

            return reArr;
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
                    let fake_this = Array.from(this.ele.children).map(e => createXhearProxy(e));
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

        // 是否表达式
        const isFunctionExpr = (str) => /[ \|\&\(\)\?\:\!]/.test(str.trim());

        // 获取函数
        const exprToFunc = (expr) => {
            return new Function("$event", `with(this){return ${expr}}`);
        }

        // 嵌入函数监听公用方法
        const embedWatch = ({
            target,
            callback,
            expr
        }) => {
            // 判断expr是否为函数表达式
            if (isFunctionExpr(expr)) {
                let func = exprToFunc(expr);
                target.watch(e => callback(func.call(target[PROXYTHIS])))
            } else {
                // 先设置值，后监听塞入
                target.watch(expr, (e, val) => callback(val));
            }
        }

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
                // ready() {},
                // 添加进document执行的callback
                // attached() {},
                // 删除后执行的callback
                // detached() {}
            };
            Object.assign(defaults, opts);

            // 复制数据
            let attrs = defaults.attrs = defaults.attrs.map(e => attrToProp(e));
            defaults.data = cloneObject(defaults.data);
            defaults.watch = Object.assign({}, defaults.watch);

            // 转换tag
            let tag = defaults.tag = propToAttr(defaults.tag);

            // 自定义元素
            const CustomXhearEle = class extends XhearEle {
                constructor(...args) {
                    super(...args);
                }
            }

            defaults.proto && CustomXhearEle.prototype.extend(defaults.proto);

            // 注册自定义元素
            const XhearElement = class extends HTMLElement {
                constructor() {
                    super();

                    // 删除旧依赖
                    delete this.__xhear__;
                    let _xhearThis = new CustomXhearEle(this);

                    // 设置渲染识别属性
                    Object.defineProperty(this, "xvele", {
                        value: true
                    });
                    Object.defineProperty(_xhearThis, "xvele", {
                        value: true
                    });

                    let xvid = this.xvid = "xv" + getRandomId();

                    let options = Object.assign({}, defaults);

                    // 设置xv-ele
                    nextTick(() => this.setAttribute("xv-ele", ""), xvid);

                    renderEle(this, options);
                    options.ready && options.ready.call(_xhearThis[PROXYTHIS]);

                    options.slotchange && _xhearThis.$shadow.on('slotchange', (e) => options.slotchange.call(_xhearThis[PROXYTHIS], e))

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
                    defaults.attached && defaults.attached.call(createXhearProxy(this));
                }

                disconnectedCallback() {
                    if (this[RUNARRAY]) {
                        return;
                    }
                    defaults.detached && defaults.detached.call(createXhearProxy(this));
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    let xEle = this.__xhear__;
                    name = attrToProp(name);
                    if (newValue != xEle[name]) {
                        xEle.setData(name, newValue);
                    }
                }

                static get observedAttributes() {
                    return attrs.map(e => propToAttr(e));
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

            let {
                temp
            } = defaults;
            let sroot;

            if (temp) {
                // 添加shadow root
                sroot = ele.attachShadow({
                    mode: "open"
                });

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

                // 填充默认内容
                sroot.innerHTML = temp;

                // xv-if 条件转换
                queAllToArray(sroot, `[xv-if]`).forEach(e => {
                    // xv-if 不能和 xv-tar 配合使用
                    if (e.getAttribute("xv-tar")) {
                        console.error({
                            target: e,
                            desc: "xv-if cannot be used with xv-tar"
                        });
                        return;
                    }

                    // 添加定位text
                    var textnode = document.createTextNode("");
                    e.parentNode.insertBefore(textnode, e);

                    // 是否存在
                    let targetEle = e;

                    embedWatch({
                        target: xhearEle,
                        expr: e.getAttribute("xv-if"),
                        callback(val) {
                            if (val) {
                                // 不存在的情况下添加一份
                                if (!targetEle) {
                                    targetEle = e.cloneNode();
                                    textnode.parentNode.insertBefore(targetEle, textnode);
                                }
                            } else {
                                // 不能存在就删除
                                targetEle.parentNode.removeChild(targetEle);
                                targetEle = null;
                            }
                        }
                    });
                });

                // 设置其他 xv-tar
                queAllToArray(sroot, `[xv-tar]`).forEach(tar => {
                    // Array.from(sroot.querySelectorAll(`[xv-tar]`)).forEach(tar => {
                    let tarKey = tar.getAttribute('xv-tar');
                    Object.defineProperty(xhearEle, "$" + tarKey, {
                        get: () => createXhearProxy(tar)
                    });
                });

                // 转换 xv-span 元素
                queAllToArray(sroot, `xv-span`).forEach(e => {
                    // 替换xv-span
                    var textnode = document.createTextNode("");
                    e.parentNode.insertBefore(textnode, e);
                    e.parentNode.removeChild(e);

                    // 函数绑定
                    embedWatch({
                        target: xhearEle,
                        expr: e.getAttribute('xvkey'),
                        callback(val) {
                            textnode.textContent = val;
                        }
                    });
                });

                // xv-show 条件转换
                queAllToArray(sroot, `[xv-show]`).forEach(e => {
                    embedWatch({
                        target: xhearEle,
                        expr: e.getAttribute('xv-show'),
                        callback(val) {
                            if (val) {
                                e.style.display = "";
                            } else {
                                e.style.display = "none";
                            }
                        }
                    });
                });

                // :attribute对子元素属性修正方法
                queAllToArray(sroot, "*").forEach(ele => {
                    let attrbs = Array.from(ele.attributes);
                    let attrOriExpr = '';
                    attrbs.forEach(obj => {
                        let {
                            name,
                            value
                        } = obj;
                        let prop = value;
                        name = attrToProp(name);

                        // 判断prop是否函数表达式
                        const isExpr = isFunctionExpr(prop);

                        // 属性绑定
                        let colonExecs = /^:(.+)/.exec(name);
                        if (colonExecs) {
                            let attr = colonExecs[1];

                            // 判断是否双向绑定
                            let isEachBinding = /^#(.+)/.exec(attr);
                            if (isEachBinding) {
                                attr = isEachBinding[1];
                                isEachBinding = !!isEachBinding;

                                // 函数表达式不能用于双向绑定
                                if (isExpr) {
                                    throw {
                                        desc: "Function expressions cannot be used for sync binding",
                                    };
                                }
                            }

                            if (!isExpr) {
                                // 属性监听
                                let watchCall;
                                if (ele.xvele) {
                                    watchCall = (e, val) => {
                                        if (val instanceof XhearEle) {
                                            val = val.object;
                                        }
                                        createXhearEle(ele).setData(attr, val);
                                    }

                                    if (isEachBinding) {
                                        // 双向绑定
                                        createXhearEle(ele).watch(attr, (e, val) => {
                                            xhearEle.setData(prop, val);
                                        });
                                    }
                                } else {
                                    watchCall = (e, val) => {
                                        ele.setAttribute(attr, val);
                                    };
                                }

                                xhearEle.watch(prop, watchCall)
                            } else {
                                let func = exprToFunc(prop);

                                // 表达式
                                xhearEle.watch(e => {
                                    let val = func.call(xhearEle[PROXYTHIS]);

                                    if (ele.xvele) {
                                        if (val instanceof XhearEle) {
                                            val = val.object;
                                        }
                                        createXhearEle(ele).setData(attr, val);
                                    } else {
                                        ele.setAttribute(attr, val);
                                    }
                                });
                            }

                            // 删除绑定表达属性
                            ele.removeAttribute(colonExecs[0]);
                            attrOriExpr += `${name}=${value},`;
                        }

                        if (attrOriExpr) {
                            attrOriExpr = attrOriExpr.slice(0, -1);
                            ele.setAttribute('xv-binding-expr', attrOriExpr);
                        }

                        // 事件绑定
                        let atExecs = /^@(.+)/.exec(name);
                        if (atExecs) {
                            // 参数分解
                            let [eventName, ...opts] = atExecs[1].split(".") || "";

                            let functionName = "on";
                            if (opts.includes("once")) {
                                functionName = "one";
                            }

                            // 函数表达式的话提前生成函数，属性的话直接绑定
                            let func;
                            if (isExpr) {
                                func = exprToFunc(prop);
                            } else {
                                func = xhearEle[prop];
                            }

                            // 绑定事件
                            createXhearEle(ele)[functionName](eventName, (event, data) => {
                                if (opts.includes("prevent")) {
                                    event.preventDefault();
                                }

                                if (opts.includes("stop")) {
                                    event.bubble = false;
                                }

                                func.call(xhearEle[PROXYTHIS], event, data);
                            });
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
                // 绑定值
                xhearEle.watch(attrName, d => {
                    // 绑定值
                    ele.setAttribute(propToAttr(attrName), d.val);
                });
            });

            // 添加_exkey
            let canSetKey = Object.keys(rData);
            canSetKey.push(...defaults.attrs);
            canSetKey.push(...Object.keys(defaults.watch));
            canSetKey = new Set(canSetKey);
            canSetKey.forEach(k => {
                // 去除私有属性
                if (/^_.+/.test(k)) {
                    canSetKey.delete(k);
                }
            });
            let ck = xhearEle[CANSETKEYS];
            if (!ck) {
                Object.defineProperty(xhearEle, CANSETKEYS, {
                    value: canSetKey
                });
            } else {
                canSetKey.forEach(k => ck.add(k))
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
            Object.keys(rData).forEach(k => {
                let val = rData[k];

                if (!isUndefined(val)) {
                    // xhearEle[k] = val;
                    xhearEle.setData(k, val);
                }
            });

            // 查找是否有link为完成
            let isSetOne = 0;
            if (sroot) {
                let links = queAllToArray(sroot, `link`);
                if (links.length) {
                    Promise.all(links.map(link => new Promise(res => {
                        if (link.sheet) {
                            res();
                        } else {
                            link.onload = () => {
                                res();
                                link.onload = null;
                            };
                        }
                    }))).then(() => nextTick(() => ele.setAttribute("xv-ele", 1), ele.xvid))
                } else {
                    isSetOne = 1;
                }
            } else {
                isSetOne = 1;
            }

            isSetOne && nextTick(() => ele.setAttribute("xv-ele", 1), ele.xvid);

            xhearEle.trigger('renderend', {
                bubbles: false
            });
        }

        const createXhearEle = ele => (ele.__xhear__ || new XhearEle(ele));
        const createXhearProxy = ele => createXhearEle(ele)[PROXYTHIS];

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

            return ele ? createXhearProxy(ele) : null;
        }

        // 扩展函数（只是辅助将内部函数暴露出去而已）
        const ext = (callback) => {
            callback({
                // 渲染shadow的内部方法
                renderEle
            });
        }

        Object.assign($, {
            register,
            nextTick,
            xdata: obj => createXData(obj)[PROXYTHIS],
            v: 5001001,
            version: "5.1.1",
            fn: XhearEleFn,
            isXhear,
            ext,
            all(expr) {
                return queAllToArray(document, expr).map(tar => createXhearProxy(tar));
            },
        });

        glo.$ = $;

    })(window);
    /*!
     * drill.js v3.5.1
     * https://github.com/kirakiray/drill.js
     * 
     * (c) 2018-2020 YAO
     * Released under the MIT License.
     */
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

        // 是否离线
        let offline = false;
        // offline模式下，对文件的特殊处理
        const cacheDress = new Map();

        // 错误处理数据
        let errInfo = {
            // 加载错误之后，再次加载的间隔时间(毫秒)
            time: 100,
            // baseUrl后备仓
            backups: []
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
            if (document.currentScript.getAttribute("debug") !== null) {
                return setTimeout;
            }

            if (typeof process === "object" && process.nextTick) {
                return process.nextTick;
            }

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
            url = url.replace(/(.+)#.+/, "$1");
            url = url.replace(/(.+)\?.+/, "$1");
            let urlArr = url.match(/(.+\/).*/);
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
            return new Promise((res, rej) => {
                // 给主体添加css
                let linkEle = document.createElement('link');
                linkEle.rel = "stylesheet";
                linkEle.href = packData.link;

                let isAddLink = false;

                linkEle.onload = async () => {
                    // import rule 的文件也要缓存起来
                    // 离线模式下不需要这个操作，因为offline模块已经会对内部修改并缓存
                    // let rules = linkEle.sheet.rules ? Array.from(linkEle.sheet.rules) : linkEle.sheet.cssRules ? Array.from(linkEle.sheet.cssRules) : [];
                    document.head.removeChild(linkEle);

                    // // 貌似内部import已经加载完成才会触发onLoad
                    // let relativeLoad = (...args) => {
                    //     return load(toUrlObjs(args, packData.dir));
                    // }

                    // if (!offline) {
                    //     let arr = [];
                    //     rules.forEach(e => {
                    //         if (e instanceof CSSImportRule) {
                    //             arr.push(e.href + ' -unAppend -unCacheSearch');
                    //         }
                    //     });

                    //     // 加载子样式，确保所有样式文件被缓存
                    //     if (arr.length) {
                    //         await relativeLoad(...arr);
                    //     }
                    // }

                    // relativeLoad = null;

                    res(async (e) => {
                        // 在有获取内容的情况下，才重新加入link
                        // 有unAppend参数，代表不需要添加到body内
                        if (!isAddLink && !e.param.includes("-unAppend")) {
                            isAddLink = true;
                            document.head.appendChild(linkEle);
                        }
                        return linkEle
                    });
                }

                linkEle.onerror = (e) => {
                    rej({
                        desc: "load link error",
                        target: linkEle,
                        event: e
                    });
                }

                // 添加到head
                document.head.appendChild(linkEle);
            });
        });

        // loaders添加json支持
        loaders.set("json", async (packData) => {
            let data = await fetch(packData.link);

            // 转换json格式
            data = await data.json();

            return async () => {
                return data;
            }
        });

        // loaders添加wasm支持
        loaders.set("wasm", async (packData) => {
            let data = await fetch(packData.link);

            // 转换arrayBuffer格式
            data = await data.arrayBuffer();

            // 转换wasm模块
            let module = await WebAssembly.compile(data);
            const instance = new WebAssembly.Instance(module);

            return async () => {
                return instance.exports;
            }
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
            let getPack = (urlData) => new Promise(res => {
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

            return new Promise((res, rej) => {
                // 加载完成函数
                iframeEle.addEventListener('load', e => {
                    res(getPack);
                });

                // 错误函数
                iframeEle.addEventListener('error', e => {
                    clearer();
                    rej();
                });

                // 添加到body
                document.body.appendChild(iframeEle);
            });
        });

        // loaders添加js加载方式
        loaders.set("js", (packData) => {
            return new Promise((resolve, reject) => {
                // 主体script
                let script = document.createElement('script');

                //填充相应数据
                script.type = 'text/javascript';
                script.async = true;
                script.src = packData.link;

                // 添加事件
                script.addEventListener('load', async () => {
                    // 根据tempM数据设置type
                    let {
                        tempM
                    } = base;

                    let getPack;

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
                        getPack = await process(packData);
                    } else {
                        throw "no such this processor => " + type;
                    }

                    resolve(getPack);
                });
                script.addEventListener('error', () => {
                    // 加载错误
                    reject();
                });

                // 添加进主体
                document.head.appendChild(script);
            });
        });

        // 对es6 module 支持
        loaders.set("mjs", async packData => {
            let d = await import(packData.link);

            return async () => {
                return d;
            }
        });
        // 直接返回缓存地址的类型
        const returnUrlSets = new Set(["png", "jpg", "jpeg", "bmp", "gif", "webp"]);

        const getLoader = (fileType) => {
            // 立即请求包处理
            let loader = loaders.get(fileType);

            if (!loader) {
                console.log("no such this loader => " + fileType);
                loader = getByUtf8;
            }

            // 判断是否图片
            if (returnUrlSets.has(fileType)) {
                loader = getByUrl;
            }

            return loader;
        }

        // 获取并通过utf8返回数据
        const getByUtf8 = async packData => {
            let data = await fetch(packData.link);

            // 转换text格式
            data = await data.text();

            // 重置getPack
            return async () => {
                return data;
            }
        }

        // 返回内存的地址
        const getByUrl = async packData => {
            // 判断是否已经在缓存内
            if (packData.offlineUrl) {
                return async () => {
                    return packData.offlineUrl;
                }
            }

            let data = await fetch(packData.link);

            let fileBlob = await data.blob();

            let url = URL.createObjectURL(fileBlob);

            return async () => {
                return url;
            }
        }

        const isHttpFront = str => /^http/.test(str);

        let agent = async (urlObj) => {
            // getLink直接返回
            if (urlObj.param && (urlObj.param.includes("-getLink")) && !offline) {
                return Promise.resolve(urlObj.link);
            }

            // 根据url获取资源状态
            let packData = bag.get(urlObj.path);

            if (!packData) {
                packData = {
                    // 加载状态
                    // 1加载中
                    // 2加载错误，重新装载中
                    // 3加载完成
                    // 4彻底加载错误，别瞎折腾了
                    stat: 1,
                    // 路径相关信息
                    dir: urlObj.dir,
                    path: urlObj.path,
                    link: urlObj.link,
                    // 记录装载状态
                    fileType: urlObj.fileType,
                    // 包的getter函数
                    // 包加载完成时候，有特殊功能的，请替换掉async getPack函数
                    // async getPack(urlObj) { }
                };

                // 等待通行的令牌
                packData.passPromise = new Promise((res, rej) => {
                    packData._passResolve = res;
                    packData._passReject = rej;
                });

                // 设置包数据
                bag.set(urlObj.path, packData);

                // 存储错误资源地址
                let errPaths = [packData.link];

                const errCall = (e) => {
                    packData.stat = 4;
                    packData._passReject({
                        desc: `load source error`,
                        link: errPaths,
                        packData
                    });
                }

                while (true) {
                    try {
                        // 文件link中转
                        packData.link = await cacheSource({
                            packData
                        });

                        // 立即请求包处理
                        packData.getPack = (await getLoader(urlObj.fileType)(packData)) || (async () => {});

                        packData.stat = 3;

                        packData._passResolve();
                        break;
                    } catch (e) {
                        // console.error("load error =>", e);

                        packData.stat = 2;
                        if (isHttpFront(urlObj.str)) {
                            // http引用的就别折腾
                            break;
                        }
                        // 查看后备仓
                        let {
                            backups
                        } = errInfo;
                        if (!backups.length) {
                            errCall();
                            break;
                        } else {
                            // 查看当前用了几个后备仓
                            let backupId = (packData.backupId != undefined) ? packData.backupId : (packData.backupId = -1);

                            // 重新加载包
                            if (backupId < backups.length) {
                                // 获取旧的地址
                                let oldBaseUrl = backups[backupId] || base.baseUrl;
                                let frontUrl = location.href.replace(/(.+\/).+/, "$1")

                                if (!isHttpFront(oldBaseUrl)) {
                                    // 补充地址
                                    oldBaseUrl = frontUrl + oldBaseUrl;
                                }

                                // 下一个地址
                                backupId = ++packData.backupId;

                                // 补充下一个地址
                                let nextBaseUrl = backups[backupId];

                                if (!nextBaseUrl) {
                                    // 没有下一个就跳出
                                    errCall();
                                    break;
                                }

                                if (!isHttpFront(nextBaseUrl)) {
                                    nextBaseUrl = frontUrl + nextBaseUrl;
                                }

                                // 替换packData
                                packData.link = packData.link.replace(new RegExp("^" + oldBaseUrl), nextBaseUrl);
                                errPaths.push(packData.link);

                                await new Promise(res => setTimeout(res, errInfo.time));
                            } else {
                                packData.stat = 4;
                                errCall();
                                break;
                            }
                        }
                    }
                }
            }

            // 等待通行证
            await packData.passPromise;

            // 在offline情况下，返回link
            if (urlObj.param && (urlObj.param.includes("-getLink")) && offline) {
                return Promise.resolve(packData.link);
            }

            return await packData.getPack(urlObj);
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
                    let val = oPaths[i];
                    if (/^@.+\/$/.test(i)) {
                        let regStr = "^" + i;

                        // 修正单点
                        val = val.replace(/\/\.\//, "/")

                        // 如果修正相对目录 
                        if (/^\.\./.test(val)) {
                            val = removeParentPath(rootHref + base.baseUrl + val);
                        } else if (/^\//.test(val)) {
                            val = location.origin + val;
                        }

                        let reg = new RegExp(regStr);

                        //属于目录类型
                        dirpaths[i] = {
                            // 正则
                            reg,
                            // 值
                            value: val
                        };
                    } else if (/^\w+$/.test(i)) {
                        //属于资源类型
                        paths.set(i, val);
                    } else {
                        console.warn("this Paths settings do not meet specifications", i);
                    }
                });

                // 后备仓
                if (base.baseUrl && options.backups) {
                    options.backups.forEach(url => errInfo.backups.push(url));
                }
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
                        case "cacheSource":
                            oldFunc = cacheSource;
                            cacheSource = middlewareFunc;
                            break;
                    }
                }
            },
            cacheInfo: {
                k: "d_ver",
                v: ""
            },
            // 是否离线
            get offline() {
                return offline;
            },
            set offline(val) {
                if (offline) {
                    console.error("offline mode has been activated");
                    return;
                }
                offline = val;
            },
            debug: {
                bag
            },
            version: "3.5.1",
            v: 3005001
        };
        // 设置类型加载器的函数
        const setProcessor = (processName, processRunner) => {
            processors.set(processName, async (packData) => {
                let tempData = base.tempM.d;
                // 提前清空
                base.tempM = {};
                return await processRunner(packData, tempData, {
                    // 相对的加载函数
                    relativeLoad(...args) {
                        return load(toUrlObjs(args, packData.dir));
                    }
                });
            });

            // 特定类型记录器
            let processDefineFunc = (d, moduleId) => {
                base.tempM = {
                    type: processName,
                    d,
                    moduleId
                };
            }

            drill[processName] || (drill[processName] = processDefineFunc);
            glo[processName] || (glo[processName] = processDefineFunc);
        }

        // 设置缓存中转器的函数
        const setCacheDress = (cacheType, dressRunner) => {
            cacheDress.set(cacheType, async ({
                file,
                packData
            }) => {
                let newFile = file;

                // 解析为文本
                let backupFileText = await file.text();

                let fileText = await dressRunner({
                    fileText: backupFileText,
                    file,
                    relativeLoad: (...args) => {
                        return load(toUrlObjs(args, packData.dir));
                    }
                });

                if (backupFileText !== fileText) {
                    // 重新生成file
                    newFile = new File([fileText], file.name, {
                        type: file.type
                    });
                }

                return newFile;
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

                    // 等待一次异步操作，确保post数据完整
                    await new Promise(res => nextTick(res))

                    d = await agent(obj).catch(e => {
                        stat = "error";
                        Object.assign(obj, {
                            type: "error",
                            descript: e
                        });
                        hasError.push(obj);
                    });

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
            if (k && v && !param.includes("-unCacheSearch")) {
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
            if (param.includes('-r') || /^.+:\/\//.test(ori)) {
                path = ori;
            } else if (/^\./.test(ori)) {
                if (urlObj.relative) {
                    // 添加相对路径
                    path = ori = urlObj.relative + ori
                    // path = urlObj.relative + ori;
                } else {
                    path = ori.replace(/^\.\//, "");
                }
            } else {
                // 添加相对目录，得出资源地址
                path = base.baseUrl + ori;
            }

            // 判断是否带有 -pack 参数
            if (param.includes('-pack') || param.includes('-p')) {
                let pathArr = path.match(/(.+)\/(.+)/);
                if (pathArr && (2 in pathArr)) {
                    ori = path = `${pathArr[1]}/${pathArr[2]}/${pathArr[2]}`;
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
            ori = ori.replace(/\/\.\//, "/");

            // 修正两点（上级目录）
            if (/\.\.\//.test(path)) {
                path = removeParentPath(path);
                ori = removeParentPath(ori);
            }

            // 添加后缀
            path += "." + fileType;

            // 根据资源地址计算资源目录
            let dir = getDir(path);

            // 写入最终请求资源地址
            let link = search ? (path + "?" + search) : path;

            // 对 -mjs 参数修正
            if (param.includes("-mjs")) {
                fileType = "mjs";
            }

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
        // processors添加普通文件加载方式
        processors.set("file", (packData) => {
            // 直接修改完成状态，什么都不用做
        });

        // 添加define模块支持
        setProcessor("define", async (packData, d, {
            relativeLoad
        }) => {
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
                d = d(relativeLoad, exports, module, {
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

            return async () => {
                return d;
            };
        });

        // 添加task模块支持
        setProcessor("task", (packData, d, {
            relativeLoad
        }) => {
            // 判断d是否函数
            if (!isFunction(d)) {
                throw 'task must be a function';
            }

            let {
                path,
                dir
            } = packData;

            // 修正getPack方法
            return async (urlData) => {
                let reData = await d(relativeLoad, urlData.data, {
                    FILE: path,
                    DIR: dir
                });

                return reData;
            }
        });

        // 添加init模块支持
        setProcessor("init", (packData, d, {
            relativeLoad
        }) => {
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
            return async (urlData) => {
                if (isRun) {
                    return redata;
                }

                // 等待返回数据
                redata = await d(relativeLoad, urlData.data, {
                    FILE: path,
                    DIR: dir
                });

                // 设置已运行
                isRun = 1;

                return redata;
            }
        });

        // 设置 css 缓存中转，对css引用路径进行修正
        setCacheDress("css", async ({
            fileText,
            relativeLoad
        }) => {
            // 获取所有import字符串
            let importArrs = fileText.match(/@import ["'](.+?)["']/g);
            if (importArrs) {
                // 缓存外部样式
                await Promise.all(importArrs.map(async e => {
                    let path = e.replace(/@import ["'](.+?)["']/, "$1");

                    let link = await relativeLoad(`${path} -getLink`);

                    // 修正相应路径
                    fileText = fileText.replace(e, `@import "${link}"`);
                }));
            }

            // 缓存外部资源
            let urlArrs = fileText.match(/url\((.+?)\)/g);
            if (urlArrs) {
                await Promise.all(urlArrs.map(async e => {
                    // 获取资源路径
                    let path = e.replace(/url\((.+?)\)/, "$1").replace(/["']/g, "");

                    // 确定不是协议http|https的才修正
                    if (/(^http:)|(^https:)/.test(path)) {
                        return Promise.resolve("");
                    }

                    let link = await relativeLoad(`${path} -getLink`);

                    // 修正相应路径
                    fileText = fileText.replace(e, `url("${link}")`);
                }));
            }

            return fileText;
        });

        // 对mjs引用路径进行修正
        setCacheDress("mjs", async ({
            fileText,
            relativeLoad
        }) => {
            // import分组获取
            let importsArr = fileText.match(/import .+ from ['"](.+?)['"];/g)

            if (importsArr) {
                await Promise.all(importsArr.map(async e => {
                    let exArr = e.match(/(import .+ from) ['"](.+?)['"];/, "$1");

                    if (exArr) {
                        let path = exArr[2];

                        // 获取对应的链接地址
                        let link = await relativeLoad(`${path} -getLink`);

                        fileText = fileText.replace(e, `${exArr[1]} "${link}"`);
                    }
                }))
            }

            let asyncImports = fileText.match(/import\(.+?\)/g);
            if (asyncImports) {
                await Promise.all(asyncImports.map(async e => {
                    let path = e.replace(/import\(["'](.+?)['"]\)/, "$1");
                    let link = await relativeLoad(`${path} -getLink`);

                    fileText = fileText.replace(e, `import("${link}")`);
                }));
            }

            return fileText;
        });
        const DBNAME = "drill-cache-db";
        const FILESTABLENAME = 'files';

        // 主体Database对象
        let mainDB;
        // 未处理的队列
        let isInitDB = new Promise((initDBResolve, reject) => {
            const indexedDB = glo.indexedDB || glo.webkitIndexedDB || glo.mozIndexedDB || glo.msIndexedDB;

            // 初始化数据库
            if (indexedDB) {
                // 初始打开
                let openRequest = indexedDB.open(DBNAME, drill.cacheInfo.v || 1);
                openRequest.onupgradeneeded = (e) => {
                    // 升级中（初始化中）的db触发事件，db不暴露出去的
                    let db = e.target.result;

                    // 判断是否存在表
                    // 判断是否存在
                    if (!db.objectStoreNames.contains(FILESTABLENAME)) {
                        // 建立存储对象空间
                        db.createObjectStore(FILESTABLENAME, {
                            keyPath: "path"
                        });
                    } else {
                        // 存在的话先删除
                        db.deleteObjectStore(FILESTABLENAME);

                        // 重新创建
                        db.createObjectStore(FILESTABLENAME, {
                            keyPath: "path"
                        });
                    }
                };

                // 初始成功触发的callback
                openRequest.onsuccess = (e) => {
                    // 挂载主体db
                    mainDB = e.target.result;

                    // 确认初始化
                    initDBResolve();
                }
            } else {
                reject("rubish browser no indexDB");
            }
        });

        // 加载离线或者数据库文件数据
        // 每个路径文件，要确保只加载一次
        // blobCall 用于扩展程序二次更改使用
        let cacheSource = async ({
            packData
        }) => {
            // 离线处理
            if (!offline) {
                return packData.link;
            }

            // 等待数据库初始化完成
            await isInitDB;

            // 先从数据库获取数据
            let file = await getFile(packData.path);

            if (!file) {
                // 没有的话就在线下载
                // 请求链接内容
                let p = await fetch(packData.link);

                if (p.status != 200) {
                    // 清空状态
                    // 加载失败，抛出错误
                    throw {
                        type: "cacheSource",
                        desc: "statusError",
                        status: p.status
                    };
                }

                // 生成file前的两个重要数据
                let type = p.headers.get('Content-Type').replace(/;.+/, "");
                let fileName = packData.path.replace(/.+\//, "");

                // 生成file格式
                let blob = await p.blob();

                // 生成file
                file = new File([blob], fileName, {
                    type
                })

                // 存储到数据库中
                await saveFile(packData.path, file);
            }

            // file经由cacheDress中转
            let dresser = cacheDress.get(packData.fileType);
            if (dresser) {
                file = await dresser({
                    file,
                    packData
                });
            }

            // 挂载file文件
            packData.offlineFile = file;

            // 生成url
            let tempUrl = packData.offlineUrl = URL.createObjectURL(file);

            return tempUrl;
        }


        // 获取数据方法
        const getFile = path => new Promise((res, rej) => {
            // 新建事务
            var t = mainDB.transaction([FILESTABLENAME], "readonly");
            let store = t.objectStore(FILESTABLENAME);
            let req = store.get(path);
            req.onsuccess = () => {
                res(req.result && req.result.data);
            }
            req.onerror = (e) => {
                rej();
                console.error(`error load ${path}`, e);
            }
        });

        // 保存数据
        const saveFile = (path, file) => new Promise((res, rej) => {
            // 新建事务
            var t = mainDB.transaction([FILESTABLENAME], "readwrite");
            let store = t.objectStore(FILESTABLENAME);
            let req = store.put({
                path,
                data: file
            });
            req.onsuccess = () => {
                res({
                    stat: 1
                });
                console.log(`save ${path} succeed`);
            };
            req.onerror = (e) => {
                res({
                    stat: 0
                })
                console.error(`save (${path}) error`, e);
            };
        });

        // 挂载主体方法
        Object.defineProperty(base, "main", {
            value: {
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
                },
                get setProcessor() {
                    return setProcessor;
                }
            }
        });

        // init 
        glo.load || (glo.load = drill.load);

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
    const getRandomId = () => Math.random().toString(32).substr(2);
    const getType = value => Object.prototype.toString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = val => getType(val).includes("function");
    // function getQueryVariable(variable, query) {
    //     query = query || location.search.substring(1);
    //     let reVal = null;
    //     query.split("&").some(e => {
    //         var pair = e.split("=");
    //         if (pair[0] == variable) {
    //             reVal = pair[1];
    //             return true;
    //         }
    //     });
    //     return reVal;
    // }

    let globalcss = "";

    const CURRENTS = Symbol("currentPages");
    const APPNAVIGATE = "_navigate";

    // const PAGELOADED = Symbol("pageLoaded");
    const NAVIGATEDATA = Symbol("navigateData");
    const PAGEID = Symbol("pageId");
    const PAGEOPTIONS = Symbol("pageOptions");

    // 默认跳转型路由
    // 跳转路由，跟普通页面跳转的体验一样
    const initJumpRouter = (app) => {
        if (app.router != "router" && app.router != 1) {
            return;
        }

        let nowPageState;

        if (history.state) {
            nowPageState = history.state;

            // 发现历史数据，添加回软路由
            renderHistory(nowPageState.history, app);
            // app.currents.push(...nowPageState.history);
        }

        app.on("navigate", (e, opt) => {
            console.log("navigate => ", e, opt)

            let {
                currentPage
            } = app;
            let {
                animeParam,
                src
            } = currentPage;

            let historyObj = getHistoryObj(app);

            switch (opt.type) {
                case "to":
                    nowPageState = {
                        history: historyObj
                    }
                    // 前进url本来就记录了state，不需要重新记录
                    if (!opt._popstate_forward) {
                        history.pushState(nowPageState, "", `#${src}`);
                    }
                    break;
                case "replace":
                    nowPageState = {
                        history: historyObj
                    }
                    if (!opt._popstate_replace) {
                        history.replaceState(nowPageState, "", `#${src}`);
                    }
                    break;
                case "back":
                    // 不是通过popstate的返回，要重新修正history的路由
                    if (!opt._popstate_back) {
                        navigateBacked = 1;
                        history.go(-opt.delta);
                    }
                    break;
            }

            console.log("navigate =>", opt);
        });

        // 返回动作是否已经执行完成
        let navigateBacked = 0;

        // 监听路由变动
        window.addEventListener("popstate", e => {
            // 对比 nowPageState 缺失是前进还是后退，修正app
            let beforeHistory = (nowPageState && nowPageState.history) || [];
            let nowHistory = (e.state && e.state.history) || [];

            if (location.hash.replace(/^\#/, "") && !e.state) {
                // 直接粘贴链接进入的，重构单级路由前进
                let src = location.hash.replace(/^\#/, "");

                // 递进路由
                app.currents.push({
                    src
                });

                // 修正路由历史
                history.replaceState({
                    history: getHistoryObj(app)
                }, "", `#${src}`);

                // 修正事件
                $.nextTick(() => app.emitHandler("navigate", {
                    type: "to",
                    src,
                    _popstate_forward: true
                }));
                return;
            }

            if (beforeHistory.length > nowHistory.length) {
                if (navigateBacked) {
                    // 通过app.navigate返回的路由，复原 navigateBacked
                    navigateBacked = 0;
                    return;
                }
                // 页面后退
                app[APPNAVIGATE]({
                    type: "back",
                    delta: beforeHistory.length - nowHistory.length,
                    // 标识
                    _popstate_back: true
                });
            } else {
                // 重构多级前进路由
                // 添加到currents队列
                let fList = nowHistory.slice(-(nowHistory.length - beforeHistory.length));

                if (fList.length) {
                    // 页面前进
                    app.currents.push(...fList);

                    // 页面前进
                    let nextPage = nowHistory.slice(-1)[0];

                    // 修正事件
                    $.nextTick(() => app.emitHandler("navigate", {
                        type: "to",
                        src: nextPage.src,
                        _popstate_forward: true
                    }));
                } else {
                    // 跑到这里就有问题了，看看哪里逻辑出问题了
                    debugger
                }
            }

            // 修正 nowPageState
            nowPageState = e.state;
        });


        // 附带在location上的path路径
        let in_path = location.hash.slice(1);
        if (in_path && !history.state) {
            // 当前state没有数据，但是__p参数存在，证明是外部粘贴的地址，进行地址修正
            history.replaceState(null, "", "");
            $.nextTick(() => {
                app[APPNAVIGATE]({
                    // src: decodeURIComponent(in_path)
                    src: in_path
                });
            });
        }
    }

    // 获取待存储的历史数据
    function getHistoryObj(app) {
        let historyObj = [];
        app.currents.object.forEach((e, i) => {
            if (i == 0) {
                return;
            }
            delete e.pageId;

            historyObj.push(e);
        });
        return historyObj;
    }

    // 渲染历史页面
    function renderHistory(hisData, app) {
        // 渲染历史页面
        app.currents.push(...hisData);
        $.nextTick(() => {
            app.currentPages.forEach(page => page.style.transition = "none");
            setTimeout(() => app.currentPages.forEach(page => page.style.transition = ""), 100);
        });
    }

    // 公用路由软路由初始化逻辑
    const fakeRouter = (app) => {
        const HNAME = "o-app-history-" + location.pathname;

        // 虚拟历史路由数组
        let fakeState = sessionStorage.getItem(HNAME);
        if (fakeState) {
            fakeState = JSON.parse(fakeState)
        } else {
            fakeState = {
                // 后退历史
                history: []
            };
        }
        if (fakeState.history.length) {
            // 渲染历史页面
            // app.currents.push(...fakeState.history);
            renderHistory(fakeState.history, app);
        }

        // 监听跳转
        app.on("navigate", (e, opt) => {
            let {
                currentPage
            } = app;
            let {
                animeParam
            } = currentPage;

            switch (opt.type) {
                case "to":
                    fakeState.history.push({
                        src: opt.src,
                        data: opt.data,
                        animeParam
                    });
                    break;
                case "replace":
                    fakeState.history.splice(-1, 1, {
                        src: opt.src,
                        data: opt.data,
                        animeParam
                    });
                    break;
                case "back":
                    fakeState.history.splice(-opt.delta);
                    break;
            }

            sessionStorage.setItem(HNAME, JSON.stringify(fakeState));
        });
    }
    // 滑动型虚拟路由，仿apple系操作
    // 获取相应class的关键有样式
    const getPageAnimeData = (animeName, defaultType) => {
        let fakeDiv = animeName;
        let appendInBody = false;
        if (!(animeName instanceof Element)) {
            appendInBody = true;
            fakeDiv = document.createElement("div");
            // fakeDiv.classList.add("xdpage");
            fakeDiv.setAttribute("o-page-anime", animeName);
            // $("o-app").push(fakeDiv);
            $("body").push(fakeDiv);
        }

        let animeData = {};
        let complteStyle = getComputedStyle(fakeDiv);

        // 提取关键元素
        ["opacity"].forEach(k => {
            animeData[k] = complteStyle[k];
        });

        // transform单独抽取
        let transformData = {
            t: defaultType || "2d"
        };
        if (complteStyle.transform && complteStyle.transform != "none") {
            if (complteStyle.transform == "matrix3d") {
                transformData.t = "3d";
            }

            // 获取关键数据，并转换为数组
            transformData.a = complteStyle.transform.replace(/matrix\((.+)\)/, "$1").split(",").map(e => parseFloat(e.trim()))
        }

        if (transformData.t == "2d" && !transformData.a) {
            // 默认2维数据就是这几个
            transformData.a = [1, 0, 0, 1, 0, 0];
        } else if (transformData.t == "3d" && !transformData.a) {
            transformData.a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }

        // 强行将2d转为3d
        if (transformData.t == "2d") {
            let old_a = transformData.a;
            transformData.t = "3d";
            transformData.a = [old_a[0], old_a[1], 0, 0, old_a[2], old_a[3], 0, 0, 0, 0, 1, 0, old_a[4], old_a[5], 0, 1];
        }

        // 删除样式
        if (appendInBody) {
            fakeDiv.remove();
        }

        // 设置transform数据
        animeData.transform = transformData;

        return animeData;
    }

    // pageParam转css样式对象
    const pageParamToStyle = pageParam => {
        let reobj = Object.assign({}, pageParam);

        // 主要转换transform
        let {
            transform
        } = pageParam;
        switch (transform.t) {
            case "2d":
                reobj.transform = `matrix(${transform.a.join(",")})`;
                break;
            case "3d":
                reobj.transform = `matrix3d(${transform.a.join(",")})`;
                break;
        }

        return reobj;
    }

    // 根据当前页状态、下一步状态和当前进度，计算当前进度pageParam数据
    const animeByPrecent = (nowParam, nextParam, precent) => {
        let pageParam = {};

        Object.keys(nowParam).forEach(k => {
            if (k === "transform") {
                // transform 单独处理
                return;
            }

            // 后缀
            let suffix = nowParam[k].replace(/[\d\.]+(\D*)/, "$1");

            // 带px的修正px
            let now = parseFloat(nowParam[k]);
            let next = parseFloat(nextParam[k]);

            pageParam[k] = (next - now) * precent + now + suffix;
        });

        let now_trans = nowParam.transform;
        let next_trans = nextParam.transform;

        if (now_trans && next_trans) {
            // 确保类型一致
            if (now_trans.t !== next_trans.t) {
                console.error("animeByPrecent transform type unequal");
                return;
            }

            let trans = pageParam.transform = {
                t: now_trans.t,
                a: []
            };

            now_trans.a.forEach((now, i) => {
                let next = next_trans.a[i];
                trans.a.push((next - now) * precent + now);
            });
        }

        return pageParam;
    }

    const getPoint = e => e.changedTouches ? e.changedTouches[0] : e.targetTouches ? e.targetTouches[0] : e.touches[0];

    const initSlideRouter = (app) => {
        if (app.router != "slide") {
            return;
        }

        // 公用软路由初始化
        fakeRouter(app);

        const LEFT = "_left" + getRandomId(),
            RIGHT = "_right" + getRandomId();
        // 在全局加入两个边缘监听元素
        $('head').push(`<style>#${LEFT},#${RIGHT}{position:fixed;z-index:10000;left:0;top:0;width:20px;height:100%;background-color:rgba(255,0,0,0);}#${RIGHT}{left:auto;right:0;}</style>`);

        let leftPannel = $(`<div id="${LEFT}"></div>`);
        // let rightPannel = $(`<div id="${RIGHT}"></div>`);

        $("body").push(leftPannel);
        // $("body").push(rightPannel);

        // slidePage使用的页面元素
        // let prevPage, currentPage;
        // let prevPageBackParam, prevPageActiveParam, currentPageFrontParam, currentPageActiveParam;

        // 需要修正动画的页面
        let needFixPages = [];

        // 构建动画函数
        const buildSlidePage = () => {
            // 清空数据
            needFixPages.length = 0;

            if (app.currents.length <= 1) {
                // 只有首页的情况就没有滑动动画了
                return;
            }

            // 遍历所有页面，提取并设置好编译状态
            let curs = app.currents.map(e => {
                let obj = e.object;
                obj.page = e._page;
                return obj;
            });

            let lastId = curs.length - 1;
            curs.forEach((pageData, index) => {
                let {
                    page
                } = pageData;
                let {
                    animeParam
                } = page;
                let backAnimes = animeParam.back.slice();
                backAnimes.reverse();

                // 当前页动画数据获取
                if (index == lastId) {
                    needFixPages.push({
                        currentAnimeParam: getPageAnimeData(page.animeParam.current),
                        nextAnimeParam: getPageAnimeData(page.animeParam.front),
                        page
                    });
                    return;
                } else {
                    // 相应页面前一页的动画设定
                    let targetAnimeName = lastId - index - 2 < 0 ? animeParam.current : backAnimes[lastId - index - 1];
                    if (targetAnimeName) {
                        needFixPages.push({
                            currentAnimeParam: getPageAnimeData(backAnimes[lastId - index - 2]),
                            nextAnimeParam: getPageAnimeData(targetAnimeName),
                            page
                        });
                    }
                }
            });
        }

        // 监听滑动
        let startX, aWidth = app.width;
        // 前一个触控点，判断方向用的
        let beforePointX;
        leftPannel.on("touchstart", e => {
            e.preventDefault();

            if (!needFixPages.length) return;

            let point = getPoint(e.originalEvent);
            beforePointX = startX = point.clientX;

            needFixPages.forEach(e => {
                // 提前记忆style属性
                e._beforeStyle = e.page.attrs.style;
                // 清空动画，避免影响touchmove的操作
                e.page.style.transition = "none";
            });
        });
        let canBack = false;
        leftPannel.on("touchmove", e => {
            e.preventDefault();

            if (!needFixPages.length) return;

            let point = getPoint(e.originalEvent);
            let tx = point.clientX;

            // 获取百分比
            let percent = Math.abs(tx - startX) / aWidth;

            // 修正实时样式
            needFixPages.forEach(e => {
                let nowPagePram = animeByPrecent(e.currentAnimeParam, e.nextAnimeParam, percent);
                let nowPageStyle = pageParamToStyle(nowPagePram);
                Object.assign(e.page.style, nowPageStyle)
            });

            // 方向连贯的情况下才能下一页
            if ((tx - beforePointX) > 0 && percent > 0.1) {
                canBack = true;
            } else {
                canBack = false;
            }

            beforePointX = tx;
        });
        leftPannel.on("touchend", e => {
            e.preventDefault();

            if (!needFixPages.length) return;

            // 还原style
            needFixPages.forEach(e => {
                // 清空动画和样式，默认情况下会还原操作
                e.page.attrs.style = e._beforeStyle;
            });

            if (canBack) {
                // 直接返回页面
                app.back();
            }
        });

        app.watch("currents", e => {
            setTimeout(() => buildSlidePage(), 100);
        });

        // 启动构建
        setTimeout(() => buildSlidePage(), 100);
    }

    drill.ext(base => {
        let {
            main
        } = base;
        $.ext(({
            renderEle
        }) => {
            const componentBuildDefault = async ({
                defaults,
                packData,
                options,
                relativeLoad
            }) => {
                if (isFunction(options)) {
                    options = options(relativeLoad, {
                        DIR: packData.dir,
                        FILE: packData.path
                    });
                    if (options instanceof Promise) {
                        options = await options;
                    }
                }

                // 合并默认参数
                Object.assign(defaults, options);

                // 获取文件名
                let fileName = packData.path.match(/.+\/(.+)/)[1];
                fileName = fileName.replace(/\.js$/, "");

                // 置换temp
                let temp = "";
                if (defaults.temp) {
                    // 判断是否有标签
                    if (/\</.test(defaults.temp)) {
                        // 拥有换行，是模板字符串
                        temp = defaults.temp;
                    } else {
                        if (defaults.temp === true) {
                            temp = await relativeLoad(`./${fileName}.html`);
                        } else {
                            temp = await relativeLoad(`${defaults.temp}`);
                        }
                    }

                    // 添加css
                    let cssPath = defaults.css;
                    if (cssPath) {
                        let needLoadUrl = `${defaults.css} -getLink`;
                        if (defaults.css === true) {
                            needLoadUrl = `./${fileName}.css -getLink`;
                        }
                        // 缓存文件，并获取地址
                        await relativeLoad(needLoadUrl + " -unAppend");
                        cssPath = await relativeLoad(needLoadUrl);

                        cssPath && (temp = `<link rel="stylesheet" href="${cssPath}">\n` + temp);
                    }

                    if (globalcss) {
                        temp = `<link rel="stylesheet" href="${globalcss}" />` + temp;
                    }
                }

                defaults.temp = temp;
            }

            main.setProcessor("Component", async (packData, d, {
                relativeLoad
            }) => {
                let defaults = {
                    // 默认模板
                    temp: false,
                    // 加载组件样式
                    css: false,
                    // 与组件同域下的样式
                    hostcss: "",
                    // 组件初始化完毕时
                    ready() {},
                };

                await componentBuildDefault({
                    defaults,
                    packData,
                    options: d,
                    relativeLoad
                });

                // ready钩子
                if (defaults.hostcss) {
                    let oldReady = defaults.ready;

                    let hostcssArr = getType(defaults.hostcss) == "string" ? [defaults.hostcss] : defaults.hostcss;;

                    defaults.ready = async function(...args) {
                        // 获取元素域上的主元素
                        let root = this.ele.getRootNode();

                        // 添加hostcss
                        await Promise.all(hostcssArr.map(async hostcss => {
                            hostcss = await relativeLoad(hostcss + " -getLink");

                            // 查找是否已经存在该css
                            let targetCssEle = root.querySelector(`link[href="${hostcss}"]`)

                            if (!targetCssEle) {
                                let linkEle = $(`<link rel="stylesheet" href="${hostcss}">`);
                                if (root === document) {
                                    root.querySelector("head").appendChild(linkEle.ele);
                                } else {
                                    root.appendChild(linkEle.ele);
                                }
                            }
                        }));

                        // 执行ready方法
                        oldReady.apply(this, args);
                    }
                }

                // 注册节点
                $.register(defaults);
            });
            let opageStyle = $(`<style>o-page{display:block;}</style>`);
            $("head").push(opageStyle);

            const PAGE_PREPARING = Symbol("_preparing");
            const PAGE_PREPARING_RESOLVE = Symbol("_preparing_resolve");
            const PAGE_STATE = Symbol("page_state");

            main.setProcessor("Page", async (packData, d, {
                relativeLoad
            }) => {
                let defaults = {
                    // 默认模板
                    temp: true,
                    // 加载组件样式
                    css: false,
                    // 监听属性函数
                    watch: {},
                    // 自有属性
                    data: {},
                    // 页面渲染完成
                    // ready() { },
                    // 页面被关闭时调用
                    // destory() { },
                    // 下面需要搭配 o-app
                    // 页面被激活时调用，搭配o-app使用
                    // onShow() { },
                    // 被放置后台时调用
                    // onHide() { },
                    // ofa app相关animeParam属性
                    // animeParam: {}
                };

                await componentBuildDefault({
                    defaults,
                    packData,
                    options: d,
                    relativeLoad
                });

                return async () => defaults;
            });

            $.register({
                tag: "o-page",
                temp: false,
                proto: {
                    get pageStat() {
                        return this[PAGE_STATE];
                    },
                    get pageId() {
                        return this[PAGEID];
                    },

                    // 获取页面寄宿的app对象
                    get app() {
                        return this.parents("o-app")[0];
                    },
                    set animeParam(param) {
                        this._animeParam = param;
                    },
                    get animeParam() {
                        let animeParam = this._animeParam;

                        if (!animeParam) {
                            let {
                                app
                            } = this;

                            if (app) {
                                animeParam = app.animeParam;
                            }
                        }

                        return animeParam;
                    },
                    get params() {
                        let paramsExprArr = /\?(.+)/.exec(this.src);
                        if (paramsExprArr) {
                            let obj = {};
                            let arr = paramsExprArr[1].split("&");
                            arr.forEach(str => {
                                let [k, v] = str.split("=");
                                if (k && v) {
                                    obj[k] = v;
                                }
                            });
                            return obj;
                        }
                    },
                    // 页面跳转
                    navigate(opts) {
                        let targetPage = this;

                        let app;

                        do {
                            // 修正o-page内嵌o-page找不到app的问题
                            app = targetPage.app;

                            if (!app) {
                                let hostEle = targetPage.$host;
                                if (hostEle && hostEle.is("o-page")) {
                                    targetPage = targetPage.$host;
                                } else {
                                    console.warn("this page no app =>", this);
                                    return;
                                }
                            } else {
                                if (targetPage.ele !== this.ele) {
                                    targetPage.navigate(opts);
                                    return;
                                }
                                break;
                            }

                        } while (targetPage)

                        let defs = {
                            src: ""
                        };

                        switch (getType(opts)) {
                            case "object":
                                Object.assign(defs, opts);
                                break;
                            case "string":
                                defs.src = opts;
                                break;
                        }
                        defs.self = this;

                        if (defs.type !== "back") {
                            let relativeSrc = this.src;

                            if (relativeSrc) {
                                // 去掉后面的参数
                                let urlStrArr = /(.+\/)(.+)/.exec(relativeSrc);
                                let src = defs.src;

                                if (urlStrArr) {
                                    let obj = main.toUrlObjs([src], urlStrArr[1]);
                                    obj && (obj = obj[0]);
                                    src = obj.ori;
                                    obj.search && (src += ".js?" + obj.search);
                                }
                                defs.src = src;
                            }
                        }

                        return app[APPNAVIGATE](defs);
                    },
                    // 页面返回
                    back(delta = 1) {
                        return this.navigate({
                            type: "back",
                            delta
                        });
                    }
                },
                data: {
                    // 当前页面的链接地址
                    src: "",
                    // 当前页面的状态
                    // pageStat: "unload",
                    // [PAGELOADED]: "",
                    // 页面是否展示，主要是在o-app内的关键属性
                    show: true
                },
                attrs: ["src"],
                watch: {
                    async src(e, val) {
                        if (!val) {
                            return;
                        }
                        if (this.pageStat !== "unload" && this.pageStat !== "preparing") {
                            throw {
                                target: this,
                                desc: "o-page can't reset src"
                            };
                        }

                        // 判断是否在准备中
                        if (this[PAGE_PREPARING]) {
                            await this[PAGE_PREPARING];
                        }

                        // 加载页面模块数据
                        this[PAGE_STATE] = "loading";

                        let pageOpts;
                        try {
                            pageOpts = await load(val + " -r");
                        } catch (e) {
                            // 错误页面
                            let errObj = e[0].descript;
                            this[PAGE_STATE] = "error";

                            let errorPath = await load(val + " -r -getLink");

                            renderEle(this.ele, {
                                temp: ofa.get404({
                                    path: errorPath,
                                    src: val
                                }),
                                attrs: [],
                                watch: {}
                            });

                            throw errObj;
                        }

                        this[PAGEOPTIONS] = pageOpts;

                        // 渲染元素
                        renderEle(this.ele, Object.assign({
                            attrs: [],
                            watch: {}
                        }, pageOpts));

                        this[PAGE_STATE] = "finish";

                        let nvdata;
                        if (this[NAVIGATEDATA]) {
                            nvdata = this[NAVIGATEDATA];
                            delete this[NAVIGATEDATA];
                        }

                        // 运行ready
                        pageOpts.ready && pageOpts.ready.call(this, {
                            data: nvdata
                        });
                        this.emit("page-ready");

                        this.watch("show", (e, show) => {
                            if (show) {
                                pageOpts.onShow && pageOpts.onShow.call(this);
                            } else {
                                pageOpts.onHide && pageOpts.onHide.call(this);
                            }
                        }, true)
                    }
                },
                ready() {
                    // 添加pageId
                    this[PAGEID] = getRandomId();
                    this[PAGE_STATE] = "unload";
                },
                detached() {
                    this[PAGE_STATE] = "destory";

                    if (this[PAGEOPTIONS]) {
                        this[PAGEOPTIONS].destory && this[PAGEOPTIONS].destory.call(this);
                        this.emit("page-destory");
                    }
                }
            });

            $.fn.extend({
                get $page() {
                    let {
                        $host
                    } = this;
                    while ($host.$host) {
                        $host = $host.$host;
                    }
                    return $host;
                },
                get $app() {
                    let {
                        $page
                    } = this;
                    if (!$page) {
                        console.warn("no app");
                        return;
                    }
                    return $page.parents("o-app")[0];
                }
            });
            // currents路由提前载入页面的数量
            let preloadLen = 1;

            $.register({
                tag: "o-app",
                data: {
                    // 当前页面的路由数据
                    currents: [],
                    // 默认page数据
                    _animeParam: {
                        // 后退中的page的样式
                        back: ["back"],
                        // 激活中的页面样式
                        current: "active",
                        front: "front",
                    },
                    // _appOptions: {},
                    // 是否已经launched
                    launched: false,
                    // 当前app是否隐藏
                    visibility: document.hidden ? "hide" : "show",
                    // 是否打开路由
                    router: 0,
                    // 屏幕尺寸数据
                    screen: {
                        width: "",
                        height: "",
                        // 旋转角度
                        angle: ""
                    }

                },
                watch: {
                    // 当前app的路由数据
                    currents(e, currents) {
                        // 单个page页面数据如下
                        // let pageData = {
                        //     // 路由地址
                        //     src: "",
                        //     // 路由传递数据（非param）
                        //     data: {},
                        //     // 真正的页面元素，不存在的情况下重新创建
                        //     _page: {},
                        //     对应页面元素的id
                        //     pageId:"",
                        //     // 页面切换动画数据
                        //     animeParam: {}
                        // };

                        if (!currents.length) {
                            return;
                        }

                        // 旧的页面
                        let oldCurrents = e.old;

                        // 最后一页的id
                        let lastId = currents.length - 1;

                        // 页面修正
                        currents.forEach((pageData, index) => {
                            let {
                                animeParam,
                                data,
                                src,
                                _page
                            } = pageData;

                            // 清除下一个状态切换
                            clearTimeout(pageData._nextPageAnimeTimer);

                            let pageEle = _page;
                            // 判断是否有页面元素，没有的话添加页面元素
                            if (!pageEle) {
                                pageData._page = pageEle = $({
                                    tag: "o-page",
                                    src
                                });

                                // 设置传输数据
                                pageEle[NAVIGATEDATA] = data;

                                this.push(pageEle);
                            }

                            // unload状态全部都准备在预加载下
                            if (pageEle.pageStat === "unload" && !pageEle._preparing) {
                                // 属于缓存进来的页面，进行等待操作
                                pageEle[PAGE_STATE] = "preparing";
                                pageEle[PAGE_PREPARING] = new Promise(res => pageEle[PAGE_PREPARING_RESOLVE] = () => {
                                    pageEle[PAGE_PREPARING_RESOLVE] = pageEle[PAGE_PREPARING] = null;
                                    res();
                                });
                            }

                            // 最后一页数据缓存
                            if (index >= (lastId - preloadLen) && pageEle[PAGE_PREPARING]) {
                                pageEle[PAGE_PREPARING_RESOLVE]();
                            }

                            // 修正pageId
                            if (!pageData.pageId) {
                                pageData.pageId = pageEle.pageId;
                            }

                            let {
                                current,
                                front,
                                back
                            } = animeParam || pageEle.animeParam;

                            if (index < lastId) {
                                // 属于前面的页面
                                // pageEle.attrs["o-page-anime"] = index + "-" + lastId;
                                pageEle.attrs["o-page-anime"] = back[lastId - 1 - index] || back.slice(-1)[0];
                                pageEle.show = false;
                            } else if (lastId == index) {
                                // 当前页不存在动画样式的情况下，就是前进式的页面
                                // 当前只有首页的情况，不需要进场动画
                                if (!pageEle.attrs["o-page-anime"] && currents.length != 1) {
                                    pageEle.attrs["o-page-anime"] = front;
                                    pageData._nextPageAnimeTimer = setTimeout(() => {
                                        pageEle.attrs["o-page-anime"] = current;
                                        pageEle.show = true;
                                    }, 50);
                                } else {
                                    // 有动画属性下，直接修正
                                    pageEle.attrs["o-page-anime"] = current;
                                    pageEle.show = true;
                                }
                            }
                        });

                        // 对currents去掉后的页面进行处理
                        if (oldCurrents && oldCurrents.length) {
                            // 不需要的页面
                            let unneedPageData = oldCurrents.filter(e => {
                                return !currents.find(e2 => e2.pageId === e.pageId);
                            });

                            if (unneedPageData && unneedPageData.length) {
                                let unneedPages = this.filter(e => {
                                    return !!unneedPageData.find(e2 => e2.pageId === e.pageId)
                                });

                                if (unneedPages && unneedPages.length) {
                                    // 以动画回退的方式干掉页面
                                    unneedPages.forEach(pageEle => {
                                        let {
                                            front
                                        } = pageEle.animeParam;
                                        pageEle.attrs["o-page-anime"] = front;

                                        // 动画结束后删除
                                        let endfun = e => {
                                            pageEle.ele.removeEventListener("transitionend", endfun);
                                            pageEle.remove();
                                            endfun = null;
                                        };
                                        pageEle.ele.addEventListener("transitionend", endfun);
                                        // 时间候补确保删除
                                        setTimeout(() => endfun && endfun(), 1000);
                                    });
                                }
                            }
                        }
                    }
                },
                attrs: ["router"],
                proto: {
                    // 页面参数，动画的数据存储对象
                    get animeParam() {
                        return this._animeParam;
                    },
                    set animeParam(val) {
                        this._animeParam = val;
                    },
                    // 选中的页面
                    get currentPage() {
                        return this.currents.slice(-1)[0]._page;
                    },
                    // // 处在路由中的页面
                    get currentPages() {
                        return this.currents.map(e => e._page);
                    },
                    // 跳转路由
                    [APPNAVIGATE](opts) {
                        let defaults = {
                            // 当前页面
                            self: "",
                            // 支持类型 to/back
                            type: "to",
                            // back返回的级别
                            delta: 1,
                            // to 跳转的类型
                            src: "",
                            // 跳转到相应pageid的页面
                            // pageid: "",
                            // 相应的page元素
                            // target: "",
                            // 自定义数据
                            data: null,
                            // 切换动画页面
                            // anime: true
                        };

                        Object.assign(defaults, opts);

                        // 防止传File类的数据   
                        defaults.data && (defaults.data = JSON.parse(JSON.stringify(defaults.data)));

                        // 判断self对currents的修正
                        if (defaults.self) {
                            // 查找是否存在currents上
                            let target_id = this.currents.findIndex(e => e._page === defaults.self);
                            if (target_id > -1 && target_id < this.currents.length - 1) {
                                this.currents.splice(target_id + 1);
                            }
                        }

                        return new Promise((resolve, reject) => {
                            switch (defaults.type) {
                                case "to":
                                    this.currents.push({
                                        src: defaults.src,
                                        data: defaults.data
                                    });
                                    break;
                                case "replace":
                                    this.currents.splice(-1, 1, {
                                        src: defaults.src,
                                        data: defaults.data
                                    });
                                    break;
                                case "back":
                                    if (this.currents.length <= 1) {
                                        return;
                                    }
                                    // 干掉相应delta的页，确保必须至少剩一页
                                    if (defaults.delta >= this.currents.length) {
                                        defaults.delta = this.currents.length - 1;
                                    }

                                    this.currents.splice(-defaults.delta);
                                    break;
                            }

                            $.nextTick(() => this.emitHandler("navigate", Object.assign({}, defaults)));
                        })
                    },
                    back(delta = 1) {
                        this.currentPage.back(delta);
                    },
                    // 更新尺寸信息
                    fixSize() {
                        // 修正屏幕数据
                        this.screen.width = screen.width;
                        this.screen.height = screen.height;
                        this.screen.angle = screen.orientation ? screen.orientation.angle : "";
                    }
                },
                ready() {
                    // 判断是否有页面，激活当前页
                    $.nextTick(() => {
                        let readyFun = () => {
                            // this[CURRENTS] = [this.$("o-page")];
                            let firstPage = this.$("o-page");

                            // 设置第一页
                            this.currents = [{
                                // 路由地址
                                src: firstPage.src,
                                // 路由传递数据（非param）
                                data: {},
                                // 真正的页面元素，不存在的情况下重新创建
                                _page: firstPage,
                                // 页面切换动画数据
                                animeParam: firstPage.animeParam,
                                // 页面id
                                pageId: firstPage.pageId
                            }];

                            // 触发事件
                            this.launched = true;

                            readyFun = null;
                        }

                        this.$("o-page") ? readyFun() : this.one("page-ready", readyFun);
                    });

                    // 检查页面状况
                    window.addEventListener("visibilitychange", e => {
                        this.visibility = document.hidden ? "hide" : "show";
                    });

                    // 初始路由前，app必须初始化完成
                    let launchFun = (e, launched) => {
                        if (!launched) {
                            return;
                        }
                        // 注销监听
                        this.unwatch("launched", launchFun);

                        // 初始化路由
                        initSlideRouter(this);
                        initJumpRouter(this);

                        launchFun = null;
                    }
                    this.watch("launched", launchFun);

                    this.fixSize();
                    // 尺寸修改的时候也设置
                    let resizeTimer;
                    window.addEventListener("resize", e => {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(() => this.fixSize(), 500);
                    });
                }
            });
        })
    });

    drill.config({
        paths: {
            "@ofa/": "https://kirakiray.github.io/ofa.js/lib/"
        }
    });

    // 配置全局变量
    const ofa = {
        set globalcss(val) {
            globalcss = val;
        },
        get globalcss() {
            return globalcss;
        },
        drill,
        $,
        get config() {
            return drill.config;
        },
        get offline() {
            return drill.offline;
        },
        set offline(val) {
            this.drill.offline = val;
        },
        // 获取40页面的内容
        get404(e) {
            return `
            <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:300px;">
                <div style="margin-bottom:16px;width:45px;height:45px;font-size:30px;line-height:45px;border-radius:32px;text-align:center;font-weight:bold;background-color:#fb4747;color:#fff;">!</div>
                <div style="font-size:13px;color:#888;text-align:center;">
                Failed to load<br>
                path: <a style="color:#477efd;text-decoration: underline;" href="${e.path}" target="_blank">${e.path}</a> <br>
                src: <span style="color:#477efd;text-decoration: underline;">${e.src}</span>
                </div>
            </div>
            `;
        },
        v: 2005000,
        version: "2.5.0"
    };

    let oldOfa = glo.ofa;

    const runOFA = (f) => getType(f).includes("function") && f();

    Object.defineProperties(glo, {
        ofa: {
            get() {
                return ofa;
            },
            set(val) {
                runOFA(val);
            }
        }
    });

    oldOfa && runOFA(oldOfa);

})(window);