/*!
 * ofa v3.0.0
 * https://github.com/kirakiray/ofa.js
 * 
 * (c) 2018-2021 YAO
 * Released under the MIT License.
 */
((glo) => {
    "use strict";
    // public function
    const getRandomId = () => Math.random().toString(32).substr(2);
    // const getRandomId = (len = 40) => {
    //     return Array.from(crypto.getRandomValues(new Uint8Array(len / 2)), dec => ('0' + dec.toString(16)).substr(-2)).join('');
    // }
    var objectToString = Object.prototype.toString;
    var getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = d => getType(d).search('function') > -1;
    var isEmptyObj = obj => !Object.keys(obj).length;
    const defineProperties = Object.defineProperties;
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const isxdata = obj => obj instanceof XData;

    const isDebug = document.currentScript.getAttribute("debug") !== null;

    // 改良异步方法
    const nextTick = (() => {
        if (isDebug) {
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

        // 定位对象寄存器
        let nextTickMap = new Map();

        let pnext = (func) => Promise.resolve().then(() => func())

        if (typeof process === "object" && process.nextTick) {
            pnext = process.nextTick;
        }

        let inTick = false;
        return (fun, key) => {
            if (!key) {
                key = getRandomId();
            }

            nextTickMap.set(key, {
                key,
                fun
            });

            if (inTick) {
                return;
            }

            inTick = true;

            pnext(() => {
                if (nextTickMap.size) {
                    nextTickMap.forEach(({
                        key,
                        fun
                    }) => {
                        try {
                            fun();
                        } catch (e) {
                            console.error(e);
                        }
                        nextTickMap.delete(key);
                    });
                }

                nextTickMap.clear();
                inTick = false;
            });
        };
    })();

    // 在tick后运行收集的函数数据
    const collect = (func) => {
        let arr = [];
        const reFunc = e => {
            arr.push(e);
            nextTick(() => {
                func(arr);
                arr.length = 0;
            }, reFunc);
        }

        return reFunc;
    }

    // 扩展对象
    const extend = (_this, proto) => {
        Object.keys(proto).forEach(k => {
            // 获取描述
            let {
                get,
                set,
                value
            } = getOwnPropertyDescriptor(proto, k);

            if (value) {
                if (_this.hasOwnProperty(k)) {
                    _this[k] = value;
                } else {
                    Object.defineProperty(_this, k, {
                        value
                    });
                }
            } else {
                Object.defineProperty(_this, k, {
                    get,
                    set
                });
            }
        });
    }

    const startTime = Date.now();
    // 获取高精度的当前时间
    // const getTimeId = () => startTime + performance.now();
    // const getTimeId = () => Date.now().toString(32);
    // const getTimeId = () => performance.now().toString(32);


    const XDATASELF = Symbol("self");
    const WATCHS = Symbol("watchs");
    const CANUPDATE = Symbol("can_update");

    const cansetXtatus = new Set(["root", "sub", "revoke"]);

    const emitUpdate = (target, opts) => {
        // 触发callback
        target[WATCHS].forEach(f => f(opts))

        // 向上冒泡
        target.owner.forEach(parent => emitUpdate(parent, opts));
    }

    class XData {
        constructor(obj, status) {

            let proxy_self;

            if (obj.get) {
                proxy_self = new Proxy(this, {
                    get: obj.get,
                    ownKeys: obj.ownKeys,
                    getOwnPropertyDescriptor: obj.getOwnPropertyDescriptor,
                    set: xdataHandler.set,
                });

                delete obj.get;
                delete obj.ownKeys;
                delete obj.getOwnPropertyDescriptor;
            } else {
                proxy_self = new Proxy(this, xdataHandler);
            }

            // 当前对象所处的状态
            let xtatus = status;

            // 每个对象的专属id
            defineProperties(this, {
                [XDATASELF]: {
                    value: this
                },
                // 每个对象必有的id
                xid: {
                    value: "x_" + getRandomId()
                },
                // 当前所处的状态
                _xtatus: {
                    get() {
                        return xtatus;
                    },
                    set(val) {
                        if (!cansetXtatus.has(val)) {
                            throw {
                                target: proxy_self,
                                desc: `xtatus not allowed to be set ${val}`
                            };
                        }
                        const size = this.owner.size;

                        if (val === "revoke" && size) {
                            throw {
                                target: proxy_self,
                                desc: "the owner is not empty"
                            };
                        } else if (xtatus === "revoke" && val !== "revoke") {
                            if (!size) {
                                fixXDataOwner(this);
                            }
                        } else if (xtatus === "sub" && val === "root") {
                            throw {
                                target: proxy_self,
                                desc: "cannot modify sub to root"
                            };
                        }
                        xtatus = val;
                    }
                },
                // 所有父层对象存储的位置
                // 拥有者对象
                owner: {
                    value: new Set()
                },
                // 数组对象
                length: {
                    configurable: true,
                    writable: true,
                    value: 0
                },
                // 监听函数
                [WATCHS]: {
                    value: new Map()
                },
                [CANUPDATE]: {
                    writable: true,
                    value: 0
                }
            });

            let maxNum = -1;
            Object.keys(obj).forEach(key => {
                let descObj = getOwnPropertyDescriptor(obj, key);
                let {
                    value,
                    get,
                    set
                } = descObj;

                if (key === "get") {
                    return;
                }
                if (!/\D/.test(key)) {
                    key = parseInt(key);
                    if (key > maxNum) {
                        maxNum = key;
                    }
                }
                if (get || set) {
                    // 通过get set 函数设置
                    defineProperties(this, {
                        [key]: descObj
                    });
                } else {
                    // 直接设置函数
                    // this.setData(key, value);
                    proxy_self[key] = value;
                }
            });

            if (maxNum > -1) {
                this.length = maxNum + 1;
            }

            this[CANUPDATE] = 1;

            return proxy_self;
        }

        watch(callback) {
            const wid = "e_" + getRandomId();

            this[WATCHS].set(wid, callback);

            return wid;
        }

        unwatch(wid) {
            return this[WATCHS].delete(wid);
        }

        setData(key, value) {
            let valueType = getType(value);
            if (valueType == "array" || valueType == "object") {
                value = createXData(value, "sub");

                // 设置父层的key
                value.owner.add(this);
            }

            const oldVal = this[key];

            if (oldVal === value) {
                return true;
            }

            let reval = Reflect.set(this, key, value);

            // if (this[CANUPDATE] || this._update === false) {
            if (this[CANUPDATE]) {
                // 改动冒泡
                emitUpdate(this, {
                    xid: this.xid,
                    name: "setData",
                    args: [key, value]
                });
            }

            clearXDataOwner(oldVal, this);

            return reval;
        }

        delete(key) {
            // 确认key是隐藏属性
            if (/^_/.test(key) || typeof key === "symbol") {
                return Reflect.deleteProperty(this, key);
            }

            if (!key) {
                return false;
            }

            // 无proxy自身
            const _this = this[XDATASELF];

            let val = _this[key];
            // 清除owner上的父层
            // val.owner.delete(_this);
            clearXDataOwner(val, _this);

            let reval = Reflect.deleteProperty(_this, key);

            // 改动冒泡
            emitUpdate(this, {
                xid: this.xid,
                name: "delete",
                args: [key]
            });

            return reval;
        }
    }

    // 中转XBody的请求
    const xdataHandler = {
        set(target, key, value, receiver) {
            if (typeof key === "symbol") {
                return Reflect.set(target, key, value, receiver);
            }

            // 确认key是隐藏属性
            if (/^_/.test(key)) {
                if (!target.hasOwnProperty(key)) {
                    defineProperties(target, {
                        [key]: {
                            writable: true,
                            configurable: true,
                            value
                        }
                    })
                } else {
                    Reflect.set(target, key, value, receiver);
                }
                return true;
            }

            return target.setData(key, value);
        },
        deleteProperty: function(target, key) {
            return target.delete(key);
        }
    }

    // 清除xdata的owner数据
    const clearXDataOwner = (xdata, parent) => {
        if (!isxdata(xdata)) {
            return;
        }

        const {
            owner
        } = xdata;
        owner.delete(parent);

        if (!owner.size) {
            xdata._xtatus = "revoke";
            Object.values(xdata).forEach(child => {
                clearXDataOwner(child, xdata[XDATASELF]);
            });
        }
    }

    // 修正xdata的owner数据
    const fixXDataOwner = (xdata) => {
        if (xdata._xtatus === "revoke") {
            // 重新修复状态
            Object.values(xdata).forEach(e => {
                if (isxdata(e)) {
                    fixXDataOwner(e);
                    e.owner.add(xdata);
                    e._xtatus = "sub";
                }
            });
        }
    }

    const createXData = (obj, status = "root") => {
        if (isxdata(obj)) {
            obj._xtatus = status;
            return obj;
        }
        return new XData(obj, status);
    };

    extend(XData.prototype, {
        seek(expr) {
            let arr = [];

            if (!isFunction(expr)) {
                let f = new Function(`with(this){return ${expr}}`)
                expr = _this => {
                    try {
                        return f.call(_this, _this);
                    } catch (e) {}
                };
            }

            if (expr.call(this, this)) {
                arr.push(this);
            }

            Object.values(this).forEach(e => {
                if (isxdata(e)) {
                    arr.push(...e.seek(expr));
                }
            });

            return arr;
        },
        // watch异步收集版本
        watchTick(func) {
            return this.watch(collect(func));
        },
        // 监听直到表达式成功
        watchUntil(expr) {
            if (/[^=]=[^=]/.test(expr)) {
                throw 'cannot use single =';
            }

            return new Promise(resolve => {
                // 忽略错误
                let exprFun = new Function(`
        try{with(this){
            return ${expr}
        }}catch(e){}`).bind(this);

                const wid = this.watch(() => {
                    let reVal = exprFun();
                    if (reVal) {
                        this.unwatch(wid);
                        resolve(reVal);
                    }
                });
            });
        },
        // 转换为json数据
        toJSON() {
            let obj = {};

            let isPureArray = true;
            let maxId = 0;

            Object.keys(this).forEach(k => {
                let val = this[k];

                if (!/\D/.test(k)) {
                    k = parseInt(k);
                    if (k > maxId) {
                        maxId = k;
                    }
                } else {
                    isPureArray = false;
                }

                if (isxdata(val)) {
                    val = val.toJSON();
                }

                obj[k] = val;
            });

            if (isPureArray) {
                obj.length = maxId + 1;
                obj = Array.from(obj);
            }

            const xid = this.xid;
            defineProperties(obj, {
                xid: {
                    get: () => xid
                }
            });

            return obj;
        },
        // 转为字符串
        toString() {
            return JSON.stringify(this.toJSON());
        }
    });

    // 不影响数据原结构的方法，重新做钩子
    ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
        let arrayFnFunc = Array.prototype[methodName];
        if (arrayFnFunc) {
            defineProperties(XData.prototype, {
                [methodName]: {
                    value: arrayFnFunc
                }
            });
        }
    });

    // 原生splice方法
    const arraySplice = Array.prototype.splice;

    extend(XData.prototype, {
        splice(index, howmany, ...items) {
            let self = this[XDATASELF];

            // items修正
            items = items.map(e => {
                let valueType = getType(e);
                if (valueType == "array" || valueType == "object") {
                    e = createXData(e, "sub");
                    e.owner.add(self);
                }

                return e;
            })

            // 套入原生方法
            let rmArrs = arraySplice.call(self, index, howmany, ...items);

            // rmArrs.forEach(e => isxdata(e) && e.owner.delete(self));
            rmArrs.forEach(e => clearXDataOwner(e, self));

            // 改动冒泡
            emitUpdate(this, {
                xid: this.xid,
                name: "splice",
                args: [index, howmany, ...items]
            });

            return rmArrs;
        },
        unshift(...items) {
            this.splice(0, 0, ...items);
            return this.length;
        },
        push(...items) {
            this.splice(this.length, 0, ...items);
            return this.length;
        },
        shift() {
            return this.splice(0, 1)[0];
        },
        pop() {
            return this.splice(this.length - 1, 1)[0];
        }
    });

    ['sort', 'reverse'].forEach(methodName => {
        // 原来的数组方法
        const arrayFnFunc = Array.prototype[methodName];

        if (arrayFnFunc) {
            defineProperties(XData.prototype, {
                [methodName]: {
                    value(...args) {
                        let reval = arrayFnFunc.apply(this[XDATASELF], args)

                        emitUpdate(this, {
                            xid: this.xid,
                            name: methodName
                        });

                        return reval;
                    }
                }
            });
        }
    });
    // 公用方法文件
    // 创建xEle元素
    const createXEle = (ele) => {
        if (!ele) {
            return null;
        }
        return ele.__xEle__ ? ele.__xEle__ : (ele.__xEle__ = new XEle(ele));
    }

    // 判断元素是否符合条件
    const meetTemp = document.createElement('template');
    const meetsEle = (ele, expr) => {
        if (!ele.tagName) {
            return false;
        }
        if (ele === expr) {
            return true;
        }
        if (ele === document) {
            return false;
        }
        meetTemp.innerHTML = `<${ele.tagName.toLowerCase()} ${Array.from(ele.attributes).map(e => e.name + '="' + e.value + '"').join(" ")} />`;
        return !!meetTemp.content.querySelector(expr);
    }

    // 转换元素
    const parseStringToDom = (str) => {
        const pstTemp = document.createElement('div');
        pstTemp.innerHTML = str;
        let childs = Array.from(pstTemp.children);
        return childs.map(function(e) {
            pstTemp.removeChild(e);
            return e;
        });
    };

    // 将对象转为element
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

    // 最基础对象功能
    const XEleHandler = {
        get(target, key, receiver) {
            if (typeof key === 'string' && !/\D/.test(key)) {
                return createXEle(target.ele.children[key]);
            }
            return Reflect.get(target, key, receiver);
        },
        ownKeys(target) {
            let keys = Reflect.ownKeys(target);
            let len = target.ele.children.length;
            for (let i = 0; i < len; i++) {
                keys.push(String(i));
            }
            return keys;
        },
        getOwnPropertyDescriptor(target, key) {
            if (typeof key === 'string' && !/\D/.test(key)) {
                return {
                    enumerable: true,
                    configurable: true,
                }
            }
            return Reflect.getOwnPropertyDescriptor(target, key);
        }
    };

    const EVENTS = Symbol("events");
    const xSetData = XData.prototype.setData;

    // 可直接设置的Key
    const xEleDefaultSetKeys = ["text", "html", "show", "style"];
    const CANSETKEYS = Symbol("cansetkeys");

    class XEle extends XData {
        constructor(ele) {
            super(Object.assign({}, XEleHandler));
            // super(XEleHandler);

            const self = this[XDATASELF];

            self.tag = ele.tagName ? ele.tagName.toLowerCase() : ''

            defineProperties(self, {
                ele: {
                    get: () => ele
                },
                [EVENTS]: {
                    writable: true,
                    value: ""
                },
                // 允许被设置的key值
                // [CANSETKEYS]: {
                //     value: new Set(xEleDefaultSetKeys)
                // }
            });

            delete self.length;

            if (self.tag == "input") {
                renderInput(self);
            }
        }

        setData(key, value) {
            if (!this[CANSETKEYS] || this[CANSETKEYS].has(key)) {
                return xSetData.call(this, key, value);
            }
        }

        get root() {
            return createXEle(this.ele.getRootNode());
        }

        get host() {
            let root = this.ele.getRootNode();
            let {
                host
            } = root;
            return host ? createXEle(host) : null;
        }

        get shadow() {
            return createXEle(this.ele.shadowRoot);
        }

        get parent() {
            let {
                parentNode
            } = this.ele;
            return (!parentNode || parentNode === document) ? null : createXEle(parentNode);
        }

        get index() {
            let {
                parentNode
            } = this.ele;

            if (!parentNode) {
                return null;
            }

            return Array.prototype.indexOf.call(parentNode.children, this.ele);
        }

        get length() {
            return this.ele.children.length;
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

        get class() {
            return this.ele.classList;
        }

        get data() {
            return this.ele.dataset;
        }

        get css() {
            return getComputedStyle(this.ele);
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

        get show() {
            return this.ele.style.display !== "none";
        }

        set show(val) {
            if (val) {
                this.ele.style.display = "";
            } else {
                this.ele.style.display = "none";
            }
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

        get next() {
            const nextEle = this.ele.nextElementSibling;
            return nextEle ? createXEle(nextEle) : null;
        }

        get prev() {
            const prevEle = this.ele.previousElementSibling;
            return prevEle ? createXEle(prevEle) : null;
        }

        $(expr) {
            const target = this.ele.querySelector(expr);
            return target ? createXEle(target) : null;
        }

        all(expr) {
            return Array.from(this.ele.querySelectorAll(expr)).map(e => {
                return createXEle(e);
            })
        }

        is(expr) {
            return meetsEle(this.ele, expr)
        }

        attr(...args) {
            let [key, value] = args;

            let {
                ele
            } = this;

            if (args.length == 1) {
                if (key instanceof Object) {
                    Object.keys(key).forEach(k => {
                        ele.setAttribute(k, key[k]);
                    });
                }
                return ele.getAttribute(key);
            }

            ele.setAttribute(key, value);
        }

        siblings(expr) {
            // 获取相邻元素
            let parChilds = Array.from(this.parent.ele.children);

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

            return parChilds.map(e => createXEle(e));
        }

        parents(expr, until) {
            let pars = [];
            let tempTar = this.parent;

            if (!expr) {
                while (tempTar) {
                    pars.push(tempTar);
                    tempTar = tempTar.parent;
                }
            } else {
                if (getType(expr) == "string") {
                    while (tempTar && tempTar) {
                        if (meetsEle(tempTar.ele, expr)) {
                            pars.push(tempTar);
                        }
                        tempTar = tempTar.parent;
                    }
                }
            }

            if (until) {
                if (until instanceof XEle) {
                    let newPars = [];
                    pars.some(e => {
                        if (e === until) {
                            return true;
                        }
                        newPars.push(e);
                    });
                    pars = newPars;
                } else if (getType(until) == "string") {
                    let newPars = [];
                    pars.some(e => {
                        if (e.is(until)) {
                            return true;
                        }
                        newPars.push(e);
                    });
                    pars = newPars;
                }
            }

            return pars;
        }

        clone() {
            let cloneEle = createXEle(this.ele.cloneNode(true));

            // 数据重新设置
            Object.keys(this).forEach(key => {
                if (key !== "tag") {
                    cloneEle[key] = this[key];
                }
            });

            return cloneEle;
        }
    }

    // 允许被设置的key值
    defineProperties(XEle.prototype, {
        [CANSETKEYS]: {
            // writable: true,
            value: new Set(xEleDefaultSetKeys)
        }
    });
    // 因为表单太常用了，将表单组件进行规范
    // input元素有专用的渲染字段
    const renderInput = (xele) => {
        let type = xele.attr("type") || "text";
        const {
            ele
        } = xele;

        let d_opts = {
            type: {
                enumerable: true,
                get: () => type
            },
            name: {
                enumerable: true,
                get: () => ele.name
            },
            value: {
                enumerable: true,
                get() {
                    return ele.value;
                },
                set(val) {
                    ele.value = val;
                }
            },
            disabled: {
                enumerable: true,
                get() {
                    return ele.disabled;
                },
                set(val) {
                    ele.disabled = val;
                }
            },
            [CANSETKEYS]: {
                value: new Set(["value", "disabled", ...xEleDefaultSetKeys])
            }
        };

        // 根据类型进行设置
        switch (type) {
            case "radio":
            case "checkbox":
                Object.assign(d_opts, {
                    checked: {
                        enumerable: true,
                        get() {
                            return ele.checked;
                        },
                        set(val) {
                            ele.checked = val;
                        }
                    },
                    name: {
                        enumerable: true,
                        get() {
                            return ele.name;
                        }
                    }
                });

                xele.on("change", e => {
                    emitUpdate(xele, {
                        xid: xele.xid,
                        name: "setData",
                        args: ["checked", ele.checked]
                    });
                });

                d_opts[CANSETKEYS].value.add("checked");
                break;
            case "file":
                Object.assign(d_opts, {
                    accept: {
                        enumerable: true,
                        get() {
                            return ele.accept;
                        }
                    }
                });
                break;
            case "text":
            default:
                xele.on("input", e => {
                    // 改动冒泡
                    emitUpdate(xele, {
                        xid: xele.xid,
                        name: "setData",
                        args: ["value", ele.value]
                    });
                });
                break;
        }

        defineProperties(xele, d_opts);
    }

    // extend(XEle.prototype, {
    //     from()
    // });
    // 重造数组方法
    ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
        const arrayFnFunc = Array.prototype[methodName];
        if (arrayFnFunc) {
            Object.defineProperty(XEle.prototype, methodName, {
                value(...args) {
                    return arrayFnFunc.apply(Array.from(this.ele.children).map(createXEle), args);
                }
            });
        }
    });

    extend(XEle.prototype, {
        // 最基础的
        splice(index, howmany, ...items) {
            const {
                ele
            } = this;
            const children = Array.from(ele.children);

            // 删除相应元素
            const removes = [];
            let b_index = index;
            let b_howmany = howmany;
            let target = children[b_index];
            while (target && b_howmany > 0) {
                removes.push(target);
                ele.removeChild(target);
                b_index++;
                b_howmany--;
                target = children[b_index];
            }

            // 新增元素
            if (items.length) {
                let fragEle = document.createDocumentFragment();
                items.forEach(e => {
                    if (e instanceof Element) {
                        fragEle.appendChild(e);
                        return;
                    }

                    if (e instanceof XEle) {
                        fragEle.appendChild(e.ele);
                        return;
                    }

                    let type = getType(e);

                    if (type == "string") {
                        parseStringToDom(e).forEach(e2 => {
                            fragEle.appendChild(e2);
                        });
                    } else if (type == "object") {
                        fragEle.appendChild(parseDataToDom(e));
                    }
                });

                if (index >= this.length) {
                    // 在末尾添加元素
                    ele.appendChild(fragEle);
                } else {
                    // 指定index插入
                    ele.insertBefore(fragEle, ele.children[index]);
                }
            }

            // 改动冒泡
            emitUpdate(this, {
                xid: this.xid,
                name: "splice",
                args: [index, howmany, ...items]
            });

            return removes;
        },
        sort(sortCall) {
            const selfEle = this.ele;
            const childs = Array.from(selfEle.children).map(createXEle).sort(sortCall);

            rebuildXEleArray(selfEle, childs);

            emitUpdate(this, {
                xid: this.xid,
                name: "sort"
            });
            return this;
        },
        reverse() {
            const selfEle = this.ele;
            const childs = Array.from(selfEle.children).reverse();
            rebuildXEleArray(selfEle, childs);
            emitUpdate(this, {
                xid: this.xid,
                name: "reverse"
            });

            return this;
        }
    });

    // 根据先后顺序数组进行元素排序
    const rebuildXEleArray = (container, rearray) => {
        const {
            children
        } = container;

        rearray.forEach((e, index) => {
            let ele = e.ele || e;

            const targetChild = children[index];

            if (!targetChild) {
                // 属于后面新增
                container.appendChild(ele);
            } else if (ele !== targetChild) {
                container.insertBefore(ele, targetChild);
            }
        });
    }
    // DOM自带事件，何必舍近求远
    const getEventsMap = (target) => {
        return target[EVENTS] ? target[EVENTS] : (target[EVENTS] = new Map());
    }

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

    // 触发原生事件
    const triggerEvenet = (_this, name, data, bubbles = true) => {
        let TargeEvent = EventMap.get(name) || CustomEvent;

        const event = name instanceof Event ? name : new TargeEvent(name, {
            bubbles,
            cancelable: true
        });

        event.data = data;

        // 触发事件
        return _this.ele.dispatchEvent(event);
    }

    extend(XEle.prototype, {
        on(name, selector, callback) {
            if (isFunction(selector)) {
                callback = selector;
                selector = undefined;
            } else {
                const real_callback = callback;
                const {
                    ele
                } = this;
                callback = (event) => {
                    let path;
                    if (event.path) {
                        path = event.path;
                    } else {
                        path = createXEle(event.target).parents(null, ele).map(e => e.ele);
                        path.unshift(event.target);
                    }

                    path.some(pTarget => {
                        if (pTarget == ele) {
                            return true;
                        }

                        if (createXEle(pTarget).is(selector)) {
                            event.selector = pTarget;
                            real_callback(event);
                            delete event.selector;
                        }
                    });
                }
            }

            this.ele.addEventListener(name, callback);
            const eid = "e_" + getRandomId()
            getEventsMap(this).set(eid, {
                name,
                selector,
                callback
            });
            return eid;
        },
        off(eid) {
            let d = getEventsMap(this).get(eid);

            if (!d) {
                return false;
            }

            this.ele.removeEventListener(d.name, d.callback);
            this[EVENTS].delete(eid);
            return true;
        },
        one(name, selector, callback) {
            let eid, func;
            if (typeof selector == "string") {
                func = callback;
                callback = (e) => {
                    func(e);
                    this.off(eid);
                }
            } else {
                func = selector;
                selector = (e) => {
                    func(e);
                    this.off(eid);
                }
            }

            eid = this.on(name, selector, callback);

            return eid;
        },
        trigger(name, data) {
            return triggerEvenet(this, name, data);
        },
        triggerHandler(name, data) {
            return triggerEvenet(this, name, data, false);
        }
    });

    // 常用事件封装
    ["click", "focus", "blur"].forEach(name => {
        extend(XEle.prototype, {
            [name](callback) {
                if (isFunction(callback)) {
                    this.on(name, callback);
                } else {
                    // callback 就是 data
                    return this.trigger(name, callback);
                }
            }
        });
    });
    // 注册组件的主要逻辑
    const register = (opts) => {
        const defs = {
            // 注册的组件名
            tag: "",
            // 正文内容字符串
            temp: "",
            // 和attributes绑定的keys
            attrs: {},
            // 默认数据
            data: {},
            // 直接监听属性变动对象
            watch: {},
            // 合并到原型链上的方法
            proto: {},
            // 被创建的时候触发的callback
            // created() { },
            // 初次渲染完成后触发的事件
            // ready() {},
            // 添加进document执行的callback
            // attached() {},
            // 从document删除后执行callback
            // detached() {},
            // 容器元素发生变动
            // slotchange() { }
        };

        Object.assign(defs, opts);

        let temps;

        if (defs.temp) {
            const d = transTemp(defs.temp);
            defs.temp = d.html;
            temps = d.temps;
        }

        // 生成新的XEle class
        const CustomXEle = class extends XEle {
            constructor(ele) {
                super(ele);
            }

            // 强制刷新视图
            forceUpdate() {}
        }

        // 扩展原型
        extend(CustomXEle.prototype, defs.proto);

        const cansetKeys = getCansetKeys(defs);

        // 扩展CANSETKEYS
        defineProperties(CustomXEle.prototype, {
            [CANSETKEYS]: {
                writable: true,
                value: new Set([...xEleDefaultSetKeys, ...cansetKeys])
            }
        });

        // 注册原生组件
        const XhearElement = class extends HTMLElement {
            constructor(...args) {
                super(...args);

                let old_xele = this.__xEle__;
                if (old_xele) {
                    console.warn({
                        target: old_xele,
                        desc: "please re-instantiate the object"
                    });
                }

                this.__xEle__ = new CustomXEle(this);

                const xele = createXEle(this);

                // cansetKeys.forEach(e => xele[CANSETKEYS].add(e));
                Object.assign(xele, defs.data, defs.attrs);

                defs.created && defs.created.call(xele);

                if (defs.temp) {
                    // 添加shadow root
                    const sroot = this.attachShadow({
                        mode: "open"
                    });

                    sroot.innerHTML = defs.temp;

                    // 渲染元素
                    renderTemp({
                        host: xele,
                        xdata: xele,
                        content: sroot,
                        temps
                    });

                    defs.ready && defs.ready.call(xele);
                }
            }

            connectedCallback() {
                // console.log("connectedCallback => ", this);
                this.__x_connected = true;
                if (defs.attached && !this.__x_runned_connected) {
                    nexTick(() => {
                        if (this.__x_connected && !this.__x_runned_connected) {
                            this.__x_runned_connected = true;
                            defs.attached.call(createXEle(this));
                        }
                    });
                }
            }

            // adoptedCallback() {
            //     console.log("adoptedCallback => ", this);
            // }

            disconnectedCallback() {
                // console.log("disconnectedCallback => ", this);
                this.__x_connected = false;
                if (defs.detached && !this.__x_runnded_disconnected) {
                    nexTick(() => {
                        if (!this.__x_connected && !this.__x_runnded_disconnected) {
                            this.__x_runnded_disconnected = true;
                            defs.detached.call(createXEle(this));
                        }
                    });
                }
            }


            attributeChangedCallback(name, oldValue, newValue) {
                xele[attrToProp(name)] = newValue;
            }

            static get observedAttributes() {
                return Object.keys(defs.attrs).map(e => propToAttr(e));
            }
        }

        customElements.define(defs.tag, XhearElement);
    }

    // 根据 defaults 获取可设置的keys
    const getCansetKeys = (defs) => {
        const {
            attrs,
            data,
            watch,
            proto
        } = defs;

        const keys = [...Object.keys(attrs), ...Object.keys(data), ...Object.keys(watch)];

        const protoDesp = Object.getOwnPropertyDescriptors(proto);
        Object.keys(protoDesp).forEach(keyName => {
            let {
                set
            } = protoDesp[keyName];

            if (set) {
                keys.push(keyName);
            }
        });

        return keys;
    }

    // 将temp转化为可渲染的模板
    const transTemp = (temp) => {
        // 去除注释代码
        temp = temp.replace(/<!--.+?-->/g, "");

        // 自定义字符串转换
        var textDataArr = temp.match(/{{.+?}}/g);
        textDataArr && textDataArr.forEach((e) => {
            var key = /{{(.+?)}}/.exec(e);
            if (key) {
                // temp = temp.replace(e, `<span :text="${key[1]}"></span>`);
                temp = temp.replace(e, `<x-span prop="${encodeURI(key[1])}"></x-span>`);
            }
        });

        // 再转换
        const tsTemp = document.createElement("template");
        tsTemp.innerHTML = temp;

        Array.from(tsTemp.content.querySelectorAll("*")).forEach(ele => {
            // 绑定属性
            const bindAttrs = {};
            const bindProps = {};
            const bindSync = {};
            // 绑定事件
            const bindEvent = {};
            // 填充
            const bindFill = [];
            const bindItem = {};

            // if判断
            let bindIf = "";

            let removeKeys = [];
            Array.from(ele.attributes).forEach(attrObj => {
                let {
                    name,
                    value
                } = attrObj;

                // if判断
                const ifExecs = /^if:/.exec(name);
                if (ifExecs) {
                    bindIf = value;
                    removeKeys.push(name);
                    return;
                }

                // 属性绑定
                const attrExecs = /^attr:(.+)/.exec(name);
                if (attrExecs) {
                    bindAttrs[attrExecs[1]] = value;
                    removeKeys.push(name);
                    return;
                }

                const propExecs = /^:(.+)/.exec(name);
                if (propExecs) {
                    bindProps[propExecs[1]] = value;
                    removeKeys.push(name);
                    return;
                }

                const syncExecs = /^sync:(.+)/.exec(name);
                if (syncExecs) {
                    bindSync[syncExecs[1]] = value;
                    removeKeys.push(name);
                    return;
                }

                // 填充绑定
                const fillExecs = /^fill:(.+)/.exec(name);
                if (fillExecs) {
                    bindFill.push(fillExecs[1], value);
                    removeKeys.push(name);
                    return;
                }

                const itemExecs = /^item:(.+)/.exec(name);
                if (itemExecs) {
                    bindItem[itemExecs[1]] = value;
                    removeKeys.push(name);
                    return;
                }

                // 事件绑定
                const eventExecs = /^@(.+)/.exec(name) || /^on:(.+)/.exec(name);
                if (eventExecs) {
                    bindEvent[eventExecs[1]] = {
                        name: value
                    };
                    removeKeys.push(name);
                    return;
                }
            });

            bindIf && (ele.setAttribute("x-if", bindIf));
            !isEmptyObj(bindAttrs) && ele.setAttribute("x-attr", JSON.stringify(bindAttrs));
            !isEmptyObj(bindProps) && ele.setAttribute("x-prop", JSON.stringify(bindProps));
            !isEmptyObj(bindSync) && ele.setAttribute("x-sync", JSON.stringify(bindSync));
            bindFill.length && ele.setAttribute("x-fill", JSON.stringify(bindFill));
            !isEmptyObj(bindItem) && ele.setAttribute("x-item", JSON.stringify(bindItem));
            !isEmptyObj(bindEvent) && ele.setAttribute("x-on", JSON.stringify(bindEvent));
            removeKeys.forEach(name => ele.removeAttribute(name));
        });

        // 将 template 内的页进行转换
        Array.from(tsTemp.content.querySelectorAll("template")).forEach(e => {
            e.innerHTML = transTemp(e.innerHTML).html;
        });

        // 修正 x-if 元素
        wrapIfTemp(tsTemp);

        // 获取模板
        let temps = new Map();

        Array.from(tsTemp.content.querySelectorAll(`template[name]`)).forEach(e => {
            temps.set(e.getAttribute("name"), {
                ele: e,
                code: e.content.children[0].outerHTML
            });
            e.parentNode.removeChild(e);
        })

        // 返回最终结果
        return {
            temps,
            html: tsTemp.innerHTML
        };
    }

    // 给 x-if 元素包裹 template
    const wrapIfTemp = (tempEle) => {
        let iEles = tempEle.content.querySelectorAll("[x-if]");

        iEles.forEach(ele => {
            if (ele.tagName.toLowerCase() == "template") {
                return;
            }

            let ifTempEle = document.createElement("template");
            ifTempEle.setAttribute("x-if", ele.getAttribute("x-if"));
            ele.removeAttribute("x-if");

            ele.parentNode.insertBefore(ifTempEle, ele);
            ifTempEle.content.appendChild(ele);
        });

        // 内部 template 也进行包裹
        Array.from(tempEle.content.querySelectorAll("template")).forEach(wrapIfTemp);
    }
    // 获取所有符合表达式的可渲染的元素
    const getCanRenderEles = (root, expr) => {
        let arr = Array.from(root.querySelectorAll(expr))
        if (root instanceof Element && meetsEle(root, expr)) {
            arr.push(root);
        }
        return arr;
    }

    // 去除原元素并添加定位元素
    const postionNode = e => {
        // let textnode = document.createTextNode("");
        let marker = new Comment("x-marker");

        let parent = e.parentNode;
        parent.insertBefore(marker, e);
        parent.removeChild(e);

        return {
            marker,
            parent
        };
    }

    // 将表达式转换为函数
    const exprToFunc = expr => {
        return new Function("...$args", `
const [$event] = $args;

with(this){
    return ${expr};
}
    `);
    }

    // 清除表达式属性并将数据添加到元素对象内
    const moveAttrExpr = (ele, exprName, propData) => {
        ele.removeAttribute(exprName);

        let renderedData = ele.__renderData;
        if (!renderedData) {
            renderedData = ele.__renderData = {}
            // 增加渲染过后的数据
            ele.setAttribute("x-rendered", "");
        }

        renderedData[exprName] = propData;
    }

    const bindWatch = (data, func, bindings) => {
        let eid = data.watchTick(func);
        bindings.push({
            eid,
            target: data
        });
    }

    // 表达式到值的设置
    const exprToSet = ({
        xdata,
        host,
        expr,
        callback,
        isArray
    }) => {
        // 即时运行的判断函数
        let runFunc;

        if (regIsFuncExpr.test(expr)) {
            // 属于函数
            runFunc = exprToFunc(expr).bind(xdata);
        } else {
            // 值变动
            runFunc = () => xdata[expr];
        }

        // 备份比较用的数据
        let backup_val, backup_ids, backup_objstr;

        // 直接运行的渲染函数
        const watchFun = (e) => {
            const val = runFunc();

            if (isxdata(val)) {
                if (isArray) {
                    // 对象只监听数组变动
                    let ids = val.map(e => (e && e.xid) ? e.xid : e).join(",");
                    if (backup_ids !== ids) {
                        callback({
                            val,
                            modifys: e
                        });
                        backup_ids = ids;
                    }
                } else {
                    // 对象监听
                    let obj_str = val.toJSON();

                    if (backup_val !== val || obj_str !== backup_objstr) {
                        callback({
                            val,
                            modifys: e
                        });
                        backup_objstr = obj_str;
                    }
                }
            } else if (backup_val !== val) {
                callback({
                    val,
                    modifys: e
                });
                backup_objstr = null;
            }
            backup_val = val;
        }

        // 先执行一次
        watchFun();

        // 已绑定的数据
        const bindings = [];

        // if (host !== xdata) {
        if (!(xdata instanceof XEle)) {
            // fill内的再填充渲染
            // xdata负责监听$index
            // xdata.$data为item数据本身
            // $host为组件数据
            if (expr.includes("$host")) {
                if (expr.includes("$index")) {
                    bindWatch(xdata, watchFun, bindings);
                }
                bindWatch(host, watchFun, bindings);
            } else if (expr.includes("$index") || expr.includes("$item")) {
                bindWatch(xdata, watchFun, bindings);
                isxdata(xdata.$data) && bindWatch(xdata.$data, watchFun, bindings);
            } else if (expr.includes("$data")) {
                isxdata(xdata.$data) && bindWatch(xdata.$data, watchFun, bindings);
            } else {
                throw {
                    desc: "fill element must use $data $host $item or $index",
                    target: host,
                    expr
                };
            }
        } else {
            // host数据绑定
            bindWatch(xdata, watchFun, bindings);
        }

        // 返回绑定的关系数据
        return bindings;
    }

    // 添加监听数据
    const addBindingData = (target, bindings) => {
        let _binds = target.__bindings || (target.__bindings = []);
        _binds.push(...bindings);
    }

    const regIsFuncExpr = /[\(\)\;\.\=\>\<]/;

    // 元素深度循环函数
    const elementDeepEach = (ele, callback) => {
        // callback(ele);
        Array.from(ele.childNodes).forEach(target => {
            callback(target);

            if (target instanceof Element) {
                elementDeepEach(target, callback);
            }
        });
    }

    // 根据 if 语句，去除数据绑定关系
    const removeElementBind = (target) => {
        elementDeepEach(target, ele => {
            if (ele.__bindings) {
                ele.__bindings.forEach(e => {
                    let {
                        target,
                        eid
                    } = e;
                    target.unwatch(eid);
                });
            }
        });
    }

    // 渲染组件的逻辑
    // host 主体组件元素；存放方法的主体
    // xdata 渲染目标数据；单层渲染下是host，x-fill模式下是具体的数据
    // content 渲染目标元素
    const renderTemp = ({
        host,
        xdata,
        content,
        temps
    }) => {
        // 事件绑定
        getCanRenderEles(content, "[x-on]").forEach(target => {
            let eventInfo = JSON.parse(target.getAttribute("x-on"));

            let eids = [];

            const $tar = createXEle(target);

            Object.keys(eventInfo).forEach(eventName => {
                let {
                    name
                } = eventInfo[eventName];

                let eid;

                // 判断是否函数
                if (regIsFuncExpr.test(name)) {
                    // 函数绑定
                    const func = exprToFunc(name);
                    eid = $tar.on(eventName, (event) => {
                        // func.call(host, event);
                        func.call(xdata, event);
                    });
                } else {
                    // 函数名绑定
                    eid = $tar.on(eventName, (event) => {
                        // host[name] && host[name].call(host, event);
                        xdata[name] && xdata[name].call(xdata, event);
                    });
                }

                eids.push(eid);
            });

            moveAttrExpr(target, "x-on", eventInfo);
        });

        // 属性绑定
        getCanRenderEles(content, "[x-attr]").forEach(ele => {
            const attrData = JSON.parse(ele.getAttribute('x-attr'));

            moveAttrExpr(ele, "x-attr", attrData);

            Object.keys(attrData).forEach(attrName => {
                const bindings = exprToSet({
                    xdata,
                    host,
                    expr: attrData[attrName],
                    callback: ({
                        val
                    }) => {
                        ele.setAttribute(attrName, val);
                    }
                });

                addBindingData(ele, bindings);
            })
        });

        getCanRenderEles(content, "[x-prop]").forEach(ele => {
            const propData = JSON.parse(ele.getAttribute('x-prop'));
            const xEle = createXEle(ele);

            moveAttrExpr(ele, "x-prop", propData);

            Object.keys(propData).forEach(propName => {
                const bindings = exprToSet({
                    xdata,
                    host,
                    expr: propData[propName],
                    callback: ({
                        val
                    }) => {
                        xEle[propName] = val;
                    }
                });

                addBindingData(ele, bindings);
            });
        });

        // 数据双向绑定
        getCanRenderEles(content, "[x-sync]").forEach(ele => {
            const propData = JSON.parse(ele.getAttribute('x-sync'));
            const xEle = createXEle(ele);

            Object.keys(propData).forEach(propName => {
                let hostPropName = propData[propName];
                if (regIsFuncExpr.test(hostPropName)) {
                    throw {
                        desc: "sync only accepts attribute names"
                    };
                }

                const bindings1 = exprToSet({
                    xdata,
                    host,
                    expr: hostPropName,
                    callback: ({
                        val
                    }) => {
                        xEle[propName] = val;
                    }
                });

                const bindings2 = exprToSet({
                    xdata: xEle,
                    host,
                    expr: propName,
                    callback: ({
                        val
                    }) => {
                        xdata[hostPropName] = val;
                    }
                });

                addBindingData(ele, [...bindings1, ...bindings2]);
            });
        });

        // 文本绑定
        getCanRenderEles(content, 'x-span').forEach(ele => {
            let expr = decodeURI(ele.getAttribute("prop"));

            let {
                marker,
                parent
            } = postionNode(ele);

            // 改为textNode
            const textnode = document.createTextNode("")
            parent.replaceChild(textnode, marker);

            // 数据绑定
            const bindings = exprToSet({
                xdata,
                host,
                expr,
                callback: ({
                    val
                }) => {
                    textnode.textContent = val;
                }
            });

            addBindingData(textnode, bindings);
        });

        // if元素渲染
        getCanRenderEles(content, '[x-if]').forEach(ele => {
            const expr = ele.getAttribute('x-if');

            // 定位文本元素
            let {
                marker,
                parent
            } = postionNode(ele);

            // 生成的目标元素
            let targetEle = null;

            const bindings = exprToSet({
                xdata,
                host,
                expr,
                callback: ({
                    val
                }) => {
                    if (val && !targetEle) {
                        // 添加元素
                        targetEle = $(ele.content.children[0].outerHTML).ele;

                        parent.insertBefore(targetEle, marker);
                        // parent.replaceChild(targetEle, marker);

                        // 重新渲染
                        renderTemp({
                            host,
                            xdata,
                            content: targetEle,
                            temps
                        });
                    } else if (!val && targetEle) {
                        // 去除数据绑定
                        removeElementBind(targetEle);

                        // 删除元素
                        targetEle.parentNode.removeChild(targetEle);
                        // parent.replaceChild(marker, targetEle);

                        targetEle = null;
                    }
                }
            });

            addBindingData(marker, bindings);
        });

        // 填充绑定
        getCanRenderEles(content, '[x-fill]').forEach(ele => {
            const fillData = JSON.parse(ele.getAttribute("x-fill"));
            let fillKeys = ele.getAttribute("x-item");
            fillKeys && (fillKeys = JSON.parse(fillKeys));

            const container = ele;

            let [tempName, propName] = fillData;

            let old_xid;

            // 提前把 x-fill 属性去掉，防止重复渲染
            moveAttrExpr(ele, "x-fill", fillData);
            moveAttrExpr(ele, "x-item", fillKeys);

            const bindings = exprToSet({
                xdata,
                host,
                expr: propName,
                isArray: 1,
                callback: d => {
                    const targetArr = d.val;

                    // 获取模板
                    let tempData = temps.get(tempName);

                    if (!tempData) {
                        throw {
                            target: host.ele,
                            desc: `this template was not found`,
                            name: tempName
                        };
                    }

                    if (!old_xid) {
                        // 完全填充
                        targetArr.forEach((data, index) => {
                            const itemEle = createFillItem({
                                host,
                                data,
                                index,
                                tempData,
                                temps
                            });

                            if (fillKeys) {
                                initKeyToItem(itemEle, fillKeys, xdata, host);
                            }

                            // 添加到容器内
                            container.appendChild(itemEle.ele);
                        });

                        old_xid = targetArr.xid;
                    } else {
                        const childs = Array.from(container.children);
                        const oldArr = childs.map(e => e.__fill_item.$data);

                        const holder = Symbol("holder");

                        const afterChilds = [];
                        targetArr.forEach((e, index) => {
                            let oldIndex = oldArr.indexOf(e);
                            if (oldIndex === -1) {
                                // 属于新增
                                let newItem = createFillItem({
                                    host,
                                    data: e,
                                    index,
                                    tempData,
                                    temps
                                });

                                if (fillKeys) {
                                    initKeyToItem(newItem, fillKeys, xdata, host);
                                }

                                afterChilds.push(newItem.ele);
                            } else {
                                // 属于位移
                                let targetEle = childs[oldIndex];
                                // 更新index
                                targetEle.__fill_item.$index = index;
                                afterChilds.push(targetEle);

                                // 标识已用
                                oldArr[oldIndex] = holder;
                            }
                        });

                        // 需要被清除数据的
                        const needRemoves = [];

                        // 删除不在数据内的元素
                        oldArr.forEach((e, i) => {
                            if (e !== holder) {
                                let e2 = childs[i];
                                needRemoves.push(e2);
                                container.removeChild(e2);
                            }
                        });

                        // 去除数据绑定
                        needRemoves.forEach(e => removeElementBind(e));

                        // 重构数组
                        rebuildXEleArray(container, afterChilds);
                    }
                }
            });

            addBindingData(ele, bindings);
        });
    }

    const initKeyToItem = (itemEle, fillKeys, xdata, host) => {
        let fData = itemEle.$item;
        Object.keys(fillKeys).forEach(key => {
            let expr = fillKeys[key];

            const propName = attrToProp(key);
            let itemBindings = exprToSet({
                xdata,
                host,
                expr,
                callback: ({
                    val
                }) => {
                    fData[propName] = val;
                }
            });

            addBindingData(itemEle.ele, itemBindings);
        });
    }

    // 生成fillItem元素
    // fillKeys 传递的Key
    const createFillItem = ({
        host,
        data,
        index,
        tempData,
        temps
    }) => {
        const itemEle = createXEle(parseStringToDom(tempData.code)[0]);

        const itemData = createXData({
            get $host() {
                return host;
            },
            // $data: data,
            $index: index,
            get $data() {
                return data;
            },
            get $item() {
                // 获取自身
                return itemData;
            }
            // get $index() {
            //     return this._index;
            // },
            // _index: index
        });

        defineProperties(itemEle, {
            $item: {
                get: () => itemData
            },
            $data: {
                get: () => data
            }
        });

        itemEle.ele.__fill_item = itemData;

        renderTemp({
            host,
            xdata: itemData,
            content: itemEle.ele,
            temps
        });

        return itemEle;
    }

    function $(expr) {
        if (expr instanceof Element) {
            return createXEle(expr);
        }

        const exprType = getType(expr);

        // 目标元素
        let ele;

        if (exprType == "string") {
            if (!/\<.+\>/.test(expr)) {
                ele = document.querySelector(expr);
            } else {
                ele = parseStringToDom(expr)[0]
            }
        } else if (exprType == "object") {
            ele = parseDataToDom(expr);
        } else if (expr === document || expr instanceof DocumentFragment) {
            ele = expr;
        }

        if (ele) {
            return createXEle(ele);
        }

        return null;
    }

    Object.assign($, {
        all(expr) {
            return Array.from(document.querySelectorAll(expr)).map(e => createXEle(e));
        },
        register
    });
    /*!
     * drill.js v3.5.5
     * https://github.com/kirakiray/drill.js
     * 
     * (c) 2018-2021 YAO
     * Released under the MIT License.
     */
    ((glo) => {
        "use strict";


        // function
        // 获取随机id
        const getRandomId = () => Math.random().toString(32).substr(2);
        var objectToString = Object.prototype.toString;
        var getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
        const isFunction = d => getType(d).search('function') > -1;
        var isEmptyObj = obj => !(0 in Object.keys(obj));

        //改良异步方法
        const nextTick = (() => {
            const pnext = (func) => Promise.resolve().then(() => func());

            if (typeof process === "object" && process.nextTick) {
                pnext = process.nextTick;
            }

            return pnext;
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



        /**
         * 将相对路径写法改为绝对路径（协议开头）
         * @param {String} path 需要修正的路径
         * @param {String} relativeDir 相对目录
         */
        const getFullPath = (path, relativeDir) => {
            !relativeDir && (relativeDir = getDir(document.location.href));

            let new_path = path;

            // 如果不是协议开头，修正relativeDir
            if (!/^.+:\/\//.test(relativeDir)) {
                relativeDir = getDir(getFullPath(relativeDir));
            }

            // 不是绝对路径（协议+地址）的话进行修正
            if (!/^.+:\/\//.test(path)) {
                if (/^\/.+/.test(path)) {
                    // 基于根目录
                    new_path = location.origin + path;
                } else {
                    // 基于相对路径
                    new_path = relativeDir + path;
                }
            }

            return new_path;
        }

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

        // 资源根路径
        let baseUrl = getDir(location.href);

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
        // loaders添加css
        loaders.set("css", (packData) => {
            return new Promise((res, rej) => {
                // 给主体添加css
                let linkEle = document.createElement('link');
                linkEle.rel = "stylesheet";
                linkEle.href = packData.link;

                let isInit = false;

                linkEle.onload = async () => {
                    res(async (e) => {
                        if (!isInit) {
                            isInit = true;
                            if (e.param.includes("-unAppend")) {
                                document.head.removeChild(linkEle);
                            }
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
                    } = tempM;

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
        // 必须只是 async import 才可以使用
        try {
            eval(`
    loaders.set("mjs", async packData => {
        let d = await import(packData.link);

        return async () => {
            return d;
        }
    });
    `)
        } catch (e) {
            console.warn(`browser does not support asynchronous es module`);
        }
        // 直接返回缓存地址的类型
        const returnUrlSets = new Set(["png", "jpg", "jpeg", "bmp", "gif", "webp"]);

        const getLoader = (fileType) => {
            // 立即请求包处理
            let loader = loaders.get(fileType);

            if (!loader) {
                // console.log("no such this loader => " + fileType);
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

        /**
         * 加载包
         */
        class PackData {
            constructor(props) {
                Object.assign(this, props);

                // 包的getter函数
                // 包加载完成时候，有特殊功能的，请替换掉async getPack函数
                // async getPack(urlObj) { }

                // 加载状态
                // 1加载中
                // 2加载错误，重新装载中
                // 3加载完成
                // 4彻底加载错误，别瞎折腾了
                this.stat = 1;

                // 等待通行的令牌
                this.passPromise = new Promise((res, rej) => {
                    this._passResolve = res;
                    this._passReject = rej;
                });

                // 错误路径地址
                this.errPaths = [];
            }

            // 获取当前path的目录
            get dir() {
                return getDir(this.path);
            }

            // 获取备份path
            get nextLink() {
                // 获取备份path的同时，相当于进入等待重载的状态
                this.stat = 2;

                let backupId = (this._backupId != undefined) ? ++this._backupId : (this._backupId = 0);


                let {
                    backups
                } = errInfo;

                // 获取旧的base
                let oldBase = backups[backupId - 1] || base.baseUrl;

                // 获取下一个backup地址
                let nextBase = backups[backupId];

                if (!nextBase) {
                    return;
                }

                let oldBaseStr = getFullPath(oldBase);
                let nextBaseStr = getFullPath(nextBase);

                this.errPaths.push(this.link);

                let link = this.link.replace(oldBaseStr, nextBaseStr);

                this.link = link;

                return link;
            }

            // 设置成功
            resolve(getPack) {
                this.getPack = getPack;
                this.stat = 3;
                this._passResolve();
            }

            // 通告pack错误
            reject() {
                this.stat = 4;
                this._passReject({
                    desc: `load source error`,
                    link: this.errPaths,
                    packData: this
                });
            }
        }

        let agent = async (urlObj) => {
            // getLink直接返回
            if (urlObj.param && (urlObj.param.includes("-getLink")) && !offline) {
                return Promise.resolve(urlObj.link);
            }

            // 根据url获取资源状态
            let packData = bag.get(urlObj.path);

            if (!packData) {
                packData = new PackData({
                    path: urlObj.path,
                    link: urlObj.link,
                    // 记录装载状态
                    fileType: urlObj.fileType,
                });

                // 设置包数据
                bag.set(urlObj.path, packData);

                // 存储错误资源地址
                while (true) {
                    try {
                        // 文件link中转
                        packData.link = await cacheSource({
                            packData
                        });

                        // 返回获取函数
                        let getPack = (await getLoader(urlObj.fileType)(packData)) || (async () => {});
                        packData.resolve(getPack);
                        break;
                    } catch (e) {
                        packData.stat = 2;
                        if (isHttpFront(urlObj.str)) {
                            // http引用的就别折腾
                            packData.reject();
                            break;
                        }

                        // 获取下一个链接
                        let nextBackupLink = packData.nextLink;

                        if (!nextBackupLink) {
                            packData.reject();
                            break;
                        }

                        // 等待重试
                        await new Promise(res => setTimeout(res, errInfo.time));
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
                            val = removeParentPath(getDir(document.location.href) + base.baseUrl + val);
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
            version: "3.5.5",
            v: 3005005
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
            let processDefineFunc = (d) => {
                base.tempM = {
                    type: processName,
                    d
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
                // 最初的输入文本，千万不能覆盖这个值
                str,
                // 相对目录
                relative
            } = urlObj;

            // 判断是否注册在bag上的直接的id
            if (bag.has(str)) {
                let tarBag = bag.get(str);
                Object.assign(urlObj, {
                    path: tarBag.path,
                    link: tarBag.link,
                });
                return urlObj;
            }

            let
                // 挂载在bag上的链接key
                path,
                // 最终加载的链接
                link,
                // 链接上的search数据
                search,
                // 加载文件的类型
                fileType,
                // 空格拆分后的参数
                param;

            // 拆分空格数据
            [path, ...param] = str.split(/\s/).filter(e => e && e);

            // 抽离search数据
            search = path.match(/(.+)\?(\S+)$/) || "";
            if (search) {
                path = search[1];
                search = search[2];
            }

            // 查看是否有映射路径
            let tarPath = paths.get(path);
            if (tarPath) {
                // 映射路径修正
                path = tarPath;
            } else {
                // 映射目录修正
                for (let i in dirpaths) {
                    let tar = dirpaths[i];
                    if (tar.reg.test(path)) {
                        path = path.replace(tar.reg, tar.value);
                        break
                    }
                }
            }

            // 确保是绝对路径
            if (!/^.+:\/\//.test(path)) {
                // 判断是否有基于根目录参数
                if (param.includes('-r')) {
                    path = getFullPath(path);
                } else if (/^\./.test(path)) {
                    // 获取修正后的地址
                    path = getFullPath(path, relative || base.baseUrl);
                } else {
                    path = getFullPath(path, base.baseUrl);
                }
            }

            // 修正无用单点路径
            path = path.replace(/\/\.\//, "/");

            // 修正两点（上级目录）
            if (/\.\.\//.test(path)) {
                path = removeParentPath(path);
            }

            // 得出fileType
            fileType = getFileType(path);

            if (!fileType) {
                // 空的情况下
                if (!/\/$/.test(path)) {
                    if (param.includes('-p')) {
                        // 带包修正
                        path = path + "/" + path.replace(/.+\/(.+)/, "$1");
                    }

                    // 判断不是 / 结尾的，加上js修正
                    path += ".js";
                    fileType = "js";
                }
            }

            // 写入最终请求资源地址
            link = search ? (path + "?" + search) : path;

            {
                // 判断是否要加版本号
                let {
                    k,
                    v
                } = drill.cacheInfo;
                if (k && v && !param.includes("-unCacheSearch")) {
                    if (link.includes("?")) {
                        link = `${link}&${k}=${v}`;
                    } else {
                        link = `${link}?${k}=${v}`;
                    }
                }
            }

            // 对 -mjs 参数修正
            if (param.includes("-mjs")) {
                fileType = "mjs";
            }

            Object.assign(urlObj, {
                // 真正的访问地址
                link,
                // 后置参数
                search,
                // 加载类型
                fileType,
                // 挂载地址
                path: path.replace(location.origin, ""),
                // 空格参数
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

})(window);