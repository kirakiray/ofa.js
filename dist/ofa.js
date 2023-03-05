/*!
 * ofa v3.0.12
 * https://github.com/kirakiray/ofa.js
 * 
 * (c) 2018-2023 YAO
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
    var getType = (value) =>
        objectToString
        .call(value)
        .toLowerCase()
        .replace(/(\[object )|(])/g, "");
    const isFunction = (d) => getType(d).search("function") > -1;
    var isEmptyObj = (obj) => !Object.keys(obj).length;
    const defineProperties = Object.defineProperties;
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const isxdata = (obj) => obj instanceof XData;

    const isDebug = document.currentScript.getAttribute("debug") !== null;

    const nextTick = (() => {
        if (isDebug) {
            let nMap = new Map();
            return (fun, key) => {
                if (!key) {
                    key = getRandomId();
                }

                let timer = nMap.get(key);
                clearTimeout(timer);
                nMap.set(
                    key,
                    setTimeout(() => {
                        fun();
                        nMap.delete(key);
                    })
                );
            };
        }

        let nextTickMap = new Map();

        let pnext = (func) => Promise.resolve().then(() => func());

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
                fun,
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

    // Collects the data returned over a period of time and runs it once as a parameter after a period of time.
    const collect = (func, time) => {
        let arr = [];
        let timer;
        const reFunc = (e) => {
            arr.push({
                ...e
            });
            if (time) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func(arr);
                    arr.length = 0;
                }, time);
            } else {
                nextTick(() => {
                    func(arr);
                    arr.length = 0;
                }, reFunc);
            }
        };

        return reFunc;
    };

    // Enhanced methods for extending objects
    const extend = (_this, proto, descriptor = {}) => {
        Object.keys(proto).forEach((k) => {
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
                        ...descriptor,
                        value,
                    });
                }
            } else {
                Object.defineProperty(_this, k, {
                    ...descriptor,
                    get,
                    set,
                });
            }
        });
    };


    const XDATASELF = Symbol("self");
    const PROXYSELF = Symbol("proxy");
    const WATCHS = Symbol("watchs");
    const CANUPDATE = Symbol("can_update");

    const cansetXtatus = new Set(["root", "sub", "revoke"]);

    const emitUpdate = (target, opts, path, unupdate) => {
        if (path && path.includes(target[PROXYSELF])) {
            console.warn("Circular references appear");
            return;
        }
        let new_path;
        if (!path) {
            new_path = opts.path = [target[PROXYSELF]];
        } else {
            new_path = opts.path = [target[PROXYSELF], ...path];
        }

        // trigger watch callback
        target[WATCHS].forEach((f) => f(opts));

        if (unupdate || target._unupdate) {
            return;
        }

        // Bubbling change events to the parent object
        target.owner &&
            target.owner.forEach((parent) =>
                emitUpdate(parent, opts, new_path.slice())
            );
    };

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

            // status of the object
            let xtatus = status;

            // Attributes that are available for each instance
            defineProperties(this, {
                [XDATASELF]: {
                    value: this,
                },
                [PROXYSELF]: {
                    value: proxy_self,
                },
                // Each object must have an id
                xid: {
                    value: "x_" + getRandomId(),
                },
                _xtatus: {
                    get() {
                        return xtatus;
                    },
                    set(val) {
                        if (!cansetXtatus.has(val)) {
                            throw {
                                target: proxy_self,
                                desc: `xtatus not allowed to be set ${val}`,
                            };
                        }
                        const size = this.owner.size;

                        if (val === "revoke" && size) {
                            throw {
                                target: proxy_self,
                                desc: "the owner is not empty",
                            };
                        } else if (xtatus === "revoke" && val !== "revoke") {
                            if (!size) {
                                fixXDataOwner(this);
                            }
                        } else if (xtatus === "sub" && val === "root") {
                            throw {
                                target: proxy_self,
                                desc: "cannot modify sub to root",
                            };
                        }
                        xtatus = val;
                    },
                },
                // Save all parent objects
                owner: {
                    configurable: true,
                    writable: true,
                    value: new Set(),
                },
                length: {
                    configurable: true,
                    writable: true,
                    value: 0,
                },
                // Save the object of the listener function
                [WATCHS]: {
                    value: new Map(),
                },
                [CANUPDATE]: {
                    writable: true,
                    value: 0,
                },
            });

            let maxNum = -1;
            Object.keys(obj).forEach((key) => {
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
                    defineProperties(this, {
                        [key]: descObj,
                    });
                } else {
                    // Set the function directly
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

                // Adding a parent object to an object
                value.owner.add(this);
            }

            let oldVal;
            const descObj = Object.getOwnPropertyDescriptor(this, key);
            const p_self = this[PROXYSELF];
            try {
                // The case of only set but not get
                oldVal = p_self[key];
            } catch (err) {}

            if (oldVal === value) {
                return true;
            }

            let reval;
            if (descObj && descObj.set) {
                descObj.set.call(p_self, value);
                reval = true;
            } else {
                reval = Reflect.set(this, key, value);
            }

            if (this[CANUPDATE]) {
                // Need bubble processing after changing data
                emitUpdate(this, {
                    xid: this.xid,
                    name: "setData",
                    args: [key, value],
                });
            }

            clearXDataOwner(oldVal, this);

            return reval;
        }

        // Proactively trigger update events
        // Convenient get type data trigger watch
        update(opts = {}) {
            emitUpdate(
                this,
                Object.assign({}, opts, {
                    xid: this.xid,
                    isCustom: true,
                })
            );
        }

        delete(key) {
            // The _ prefix or symbol can be deleted directly
            if (/^_/.test(key) || typeof key === "symbol") {
                return Reflect.deleteProperty(this, key);
            }

            if (!key) {
                return false;
            }

            // Adjustment of internal data, not using proxy objects
            const _this = this[XDATASELF];

            let val = _this[key];
            // Clear the parent on the owner
            clearXDataOwner(val, _this);

            let reval = Reflect.deleteProperty(_this, key);

            // Bubbling behavior after data changes
            emitUpdate(this, {
                xid: this.xid,
                name: "delete",
                args: [key],
            });

            return reval;
        }
    }

    // Proxy Handler for relaying XData
    const xdataHandler = {
        set(target, key, value, receiver) {
            if (typeof key === "symbol") {
                return Reflect.set(target, key, value, receiver);
            }

            // Set properties with _ prefix directly
            if (/^_/.test(key)) {
                if (!target.hasOwnProperty(key)) {
                    defineProperties(target, {
                        [key]: {
                            writable: true,
                            configurable: true,
                            value,
                        },
                    });
                } else {
                    Reflect.set(target, key, value, receiver);
                }
                return true;
            }

            try {
                return target.setData(key, value);
            } catch (e) {
                throw {
                    desc: `failed to set ${key}`,
                    key,
                    value,
                    target: receiver,
                };
            }
        },
        deleteProperty: function(target, key) {
            return target.delete(key);
        },
    };

    // Clear xdata's owner data
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
            Object.values(xdata).forEach((child) => {
                clearXDataOwner(child, xdata[XDATASELF]);
            });
        }
    };

    // Fix xdata's owner data
    const fixXDataOwner = (xdata) => {
        if (xdata._xtatus === "revoke") {
            // Restoration status
            Object.values(xdata).forEach((e) => {
                if (isxdata(e)) {
                    fixXDataOwner(e);
                    e.owner.add(xdata);
                    e._xtatus = "sub";
                }
            });
        }
    };

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
                let f = new Function(`with(this){return ${expr}}`);
                expr = (_this) => {
                    try {
                        return f.call(_this, _this);
                    } catch (e) {}
                };
            }

            if (expr.call(this, this)) {
                arr.push(this);
            }

            Object.values(this).forEach((e) => {
                if (isxdata(e)) {
                    arr.push(...e.seek(expr));
                }
            });

            return arr;
        },
        // watch asynchronous collection version
        watchTick(func, time) {
            return this.watch(collect(func, time));
        },
        // Listening until the expression succeeds
        watchUntil(expr) {
            let isFunc = isFunction(expr);
            if (!isFunc && /[^=><]=[^=]/.test(expr)) {
                throw "cannot use single =";
            }

            return new Promise((resolve) => {
                // Ignore errors
                let exprFun = isFunc ?
                    expr.bind(this) :
                    new Function(`
        try{with(this){
            return ${expr}
        }}catch(e){}`).bind(this);

                let f;
                const wid = this.watchTick(
                    (f = () => {
                        let reVal = exprFun();
                        if (reVal) {
                            this.unwatch(wid);
                            resolve(reVal);
                        }
                    })
                );
                f();
            });
        },
        // Listen to the corresponding key
        watchKey(obj, immediately) {
            if (immediately) {
                Object.keys(obj).forEach((key) => obj[key].call(this, this[key]));
            }

            let oldVal = {};
            Object.keys(obj).forEach((key) => {
                oldVal[key] = this[key];
            });

            return this.watch(
                collect((arr) => {
                    Object.keys(obj).forEach((key) => {
                        let val = this[key];
                        let old = oldVal[key];

                        if (old !== val) {
                            obj[key].call(this, val, {
                                old
                            });
                        } else if (isxdata(val)) {
                            // Whether the current array has changes to this key
                            let hasChange = arr.some((e) => {
                                let p = e.path[1];

                                return p == val;
                            });

                            if (hasChange) {
                                obj[key].call(this, val, {
                                    old
                                });
                            }
                        }

                        oldVal[key] = val;
                    });
                })
            );
        },
        toJSON() {
            let obj = {};

            let isPureArray = true;
            let maxId = 0;

            Object.keys(this).forEach((k) => {
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
                    get: () => xid,
                },
            });

            return obj;
        },
        toString() {
            return JSON.stringify(this.toJSON());
        },
    });


    // Submerged hooks that do not affect the original structure of the data
    [
        "concat",
        "every",
        "filter",
        "find",
        "findIndex",
        "forEach",
        "map",
        "slice",
        "some",
        "indexOf",
        "lastIndexOf",
        "includes",
        "join",
    ].forEach((methodName) => {
        let arrayFnFunc = Array.prototype[methodName];
        if (arrayFnFunc) {
            defineProperties(XData.prototype, {
                [methodName]: {
                    value: arrayFnFunc
                },
            });
        }
    });

    const arraySplice = Array.prototype.splice;

    extend(XData.prototype, {
        splice(index, howmany, ...items) {
            let self = this[XDATASELF];

            // Fix the properties of new objects
            items = items.map((e) => {
                let valueType = getType(e);
                if (valueType == "array" || valueType == "object") {
                    e = createXData(e, "sub");
                    e.owner.add(self);
                }

                return e;
            });

            const b_howmany =
                getType(howmany) == "number" ? howmany : this.length - index;

            // Follow the native split method
            const rmArrs = arraySplice.call(self, index, b_howmany, ...items);

            rmArrs.forEach((e) => clearXDataOwner(e, self));

            emitUpdate(this, {
                xid: this.xid,
                name: "splice",
                args: [index, howmany, ...items],
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
        },
    });

    ["sort", "reverse"].forEach((methodName) => {
        const arrayFnFunc = Array.prototype[methodName];

        if (arrayFnFunc) {
            defineProperties(XData.prototype, {
                [methodName]: {
                    value(...args) {
                        let reval = arrayFnFunc.apply(this[XDATASELF], args);

                        emitUpdate(this, {
                            xid: this.xid,
                            name: methodName,
                        });

                        return reval;
                    },
                },
            });
        }
    });
    const createXEle = (ele) => {
        if (!ele) {
            return null;
        }
        return ele.__xEle__ ? ele.__xEle__ : (ele.__xEle__ = new XEle(ele));
    };

    // Determine if an element is eligible
    const meetTemp = document.createElement("template");
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
        meetTemp.innerHTML = `<${ele.tagName.toLowerCase()} ${Array.from(
    ele.attributes
  )
    .map((e) => e.name + '="' + e.value + '"')
    .join(" ")} />`;
        return !!meetTemp.content.querySelector(expr);
    };

    // Converting strings to elements
    const parseStringToDom = (str) => {
        const pstTemp = document.createElement("div");
        pstTemp.innerHTML = str;
        let childs = Array.from(pstTemp.children);
        return childs.map(function(e) {
            pstTemp.removeChild(e);
            return e;
        });
    };

    // Converting objects to elements
    const parseDataToDom = (objData) => {
        if (!objData.tag) {
            console.error("this data need tag =>", objData);
            throw "";
        }

        let ele = document.createElement(objData.tag);

        // add data
        objData.class && ele.setAttribute("class", objData.class);
        objData.slot && ele.setAttribute("slot", objData.slot);

        const xele = createXEle(ele);

        // merge data
        xele[CANSETKEYS].forEach((k) => {
            if (objData[k]) {
                xele[k] = objData[k];
            }
        });

        // append child elements
        let akey = 0;
        while (akey in objData) {
            let childEle = parseDataToDom(objData[akey]);
            ele.appendChild(childEle);
            akey++;
        }

        return ele;
    };

    //  Converts element attribute horizontal bar to case mode
    const attrToProp = (key) => {
        // Determine if there is a horizontal line
        if (/\-/.test(key)) {
            key = key.replace(/\-[\D]/g, (letter) => letter.substr(1).toUpperCase());
        }
        return key;
    };
    const propToAttr = (key) => {
        if (/[A-Z]/.test(key)) {
            key = key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase());
        }
        return key;
    };

    // object to get the value, optimize the string with multiple '.'
    const getXData = (xdata, key) => {
        if (typeof key === "string" && key.includes(".")) {
            let tar = xdata;
            key.split(".").forEach((k) => {
                tar = tar[k];
            });
            return tar;
        } else {
            return xdata[key];
        }
    };

    // object to set the value, optimize the string with multiple '.'
    const setXData = (xdata, key, value) => {
        if (typeof key === "string" && key.includes(".")) {
            let tar = xdata,
                tarKey = key;
            let key_arr = key.split("."),
                lastid = key_arr.length - 1;
            key_arr.forEach((k, index) => {
                if (index === lastid) {
                    tarKey = k;
                    return;
                }
                tar = xdata[k];
            });

            tar[tarKey] = value;
        } else {
            xdata[key] = value;
        }
    };

    const XEleHandler = {
        get(target, key, receiver) {
            if (typeof key === "string" && !/\D/.test(key)) {
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
            if (typeof key === "string" && !/\D/.test(key)) {
                return {
                    enumerable: true,
                    configurable: true,
                };
            }
            return Reflect.getOwnPropertyDescriptor(target, key);
        },
    };

    const EVENTS = Symbol("events");
    const xSetData = XData.prototype.setData;

    // It can use the keys of set
    const xEleDefaultSetKeys = ["text", "html", "show", "style"];
    const CANSETKEYS = Symbol("cansetkeys");

    class XEle extends XData {
        constructor(ele) {
            super(Object.assign({}, XEleHandler));
            // super(XEleHandler);

            const self = this[XDATASELF];

            self.tag = ele.tagName ? ele.tagName.toLowerCase() : "";

            // self.owner = new WeakSet();
            // XEle is not allowed to have an owner
            // self.owner = null;
            // delete self.owner;
            defineProperties(self, {
                owner: {
                    get() {
                        let par = ele.parentNode;

                        return par ? [createXEle(par)] : [];
                    },
                },
            });

            defineProperties(self, {
                ele: {
                    get: () => ele,
                },
                [EVENTS]: {
                    writable: true,
                    value: "",
                },
            });

            delete self.length;

            if (self.tag == "input" || self.tag == "textarea" || self.tag == "select") {
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
            return !parentNode || parentNode === document ?
                null :
                createXEle(parentNode);
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

            // Covering the old style
            let hasKeys = Array.from(style);
            let nextKeys = Object.keys(d);

            // Clear the unused key
            hasKeys.forEach((k) => {
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
                left: this.ele.offsetLeft,
            };
        }

        get offset() {
            let reobj = {
                top: 0,
                left: 0,
            };

            let tar = this.ele;
            while (tar && tar !== document) {
                reobj.top += tar.offsetTop;
                reobj.left += tar.offsetLeft;
                tar = tar.offsetParent;
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
            return (
                this.ele.offsetWidth +
                parseInt(computedStyle["margin-left"]) +
                parseInt(computedStyle["margin-right"])
            );
        }

        get outerHeight() {
            let computedStyle = getComputedStyle(this.ele);
            return (
                this.ele.offsetHeight +
                parseInt(computedStyle["margin-top"]) +
                parseInt(computedStyle["margin-bottom"])
            );
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
            return Array.from(this.ele.querySelectorAll(expr)).map((e) => {
                return createXEle(e);
            });
        }

        is(expr) {
            return meetsEle(this.ele, expr);
        }

        attr(...args) {
            let [key, value] = args;

            let {
                ele
            } = this;

            if (args.length == 1) {
                if (key instanceof Object) {
                    Object.keys(key).forEach((k) => {
                        ele.setAttribute(k, key[k]);
                    });
                }
                return ele.getAttribute(key);
            }

            if (value === null) {
                ele.removeAttribute(key);
            } else {
                ele.setAttribute(key, value);
            }
        }

        siblings(expr) {
            // Get adjacent elements
            let parChilds = Array.from(this.parent.ele.children);

            // delete self
            let tarId = parChilds.indexOf(this.ele);
            parChilds.splice(tarId, 1);

            // Delete the non-conforming
            if (expr) {
                parChilds = parChilds.filter((e) => {
                    if (meetsEle(e, expr)) {
                        return true;
                    }
                });
            }

            return parChilds.map((e) => createXEle(e));
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
                    pars.some((e) => {
                        if (e === until) {
                            return true;
                        }
                        newPars.push(e);
                    });
                    pars = newPars;
                } else if (getType(until) == "string") {
                    let newPars = [];
                    pars.some((e) => {
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

            // reset data
            Object.keys(this).forEach((key) => {
                if (key !== "tag") {
                    cloneEle[key] = this[key];
                }
            });

            return cloneEle;
        }

        remove() {
            const {
                parent
            } = this;
            parent.splice(parent.indexOf(this), 1);
        }

        // Plugin method extend
        extend(proto) {
            const descObj = Object.getOwnPropertyDescriptors(proto);
            Object.entries(descObj).forEach(([key, obj]) => {
                if (obj.set) {
                    // The extension has set of writable
                    this[CANSETKEYS].add(key);
                }
            });
            extend(this, proto, {
                configurable: true,
            });
        }

        // This api is deprecated, please use CSS Container Query instead.
        // Listening for size changes
        //   initSizeObs(time = 300) {
        //     if (this._initedSizeObs) {
        //       console.warn({
        //         target: this.ele,
        //         desc: "initRect is runned",
        //       });
        //       return;
        //     }
        //     this._initedSizeObs = 1;

        //     let resizeTimer;
        //     // Element Size Correction
        //     const fixSize = () => {
        //       clearTimeout(resizeTimer);

        //       setTimeout(() => {
        //         emitUpdate(
        //           this,
        //           {
        //             xid: this.xid,
        //             name: "sizeUpdate",
        //           },
        //           undefined,
        //           false
        //         );
        //       }, time);
        //     };
        //     fixSize();
        //     if (window.ResizeObserver) {
        //       const resizeObserver = new ResizeObserver((entries) => {
        //         fixSize();
        //       });
        //       resizeObserver.observe(this.ele);

        //       return () => {
        //         resizeObserver.disconnect();
        //       };
        //     } else {
        //       let f;
        //       window.addEventListener(
        //         "resize",
        //         (f = (e) => {
        //           fixSize();
        //         })
        //       );
        //       return () => {
        //         window.removeEventListener("resize", f);
        //       };
        //     }
        //   }
    }

    // Allowed key values to be set
    defineProperties(XEle.prototype, {
        [CANSETKEYS]: {
            // writable: true,
            value: new Set(xEleDefaultSetKeys),
        },
    });

    // Normalize the form component because forms are so commonly used
    // Methods for rendering form elements
    const renderInput = (xele) => {
        let type = xele.attr("type") || "text";
        const {
            ele
        } = xele;

        let d_opts = {
            type: {
                enumerable: true,
                get: () => type,
            },
            name: {
                enumerable: true,
                get: () => ele.name,
            },
            value: {
                enumerable: true,
                get() {
                    return ele.hasOwnProperty("__value") ? ele.__value : ele.value;
                },
                set(val) {
                    // Conversion of input numbers to characters
                    ele.value = ele.__value = val;

                    emitUpdate(xele, {
                        xid: xele.xid,
                        name: "setData",
                        args: ["value", val],
                    });
                },
            },
            disabled: {
                enumerable: true,
                get() {
                    return ele.disabled;
                },
                set(val) {
                    ele.disabled = val;
                },
            },
            // error message
            msg: {
                writable: true,
                value: null,
            },
            [CANSETKEYS]: {
                value: new Set(["value", "disabled", "msg", ...xEleDefaultSetKeys]),
            },
        };

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
                        },
                    },
                    name: {
                        enumerable: true,
                        get() {
                            return ele.name;
                        },
                    },
                });

                // radio or checkbox does not have the property msg
                delete d_opts.msg;

                xele.on("change", (e) => {
                    emitUpdate(xele, {
                        xid: xele.xid,
                        name: "setData",
                        args: ["checked", ele.checked],
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
                        },
                    },
                });
                break;
            case "text":
            default:
                xele.on("input", (e) => {
                    delete ele.__value;

                    emitUpdate(xele, {
                        xid: xele.xid,
                        name: "setData",
                        args: ["value", ele.value],
                    });
                });
                break;
        }

        defineProperties(xele, d_opts);
    };

    class FromXData extends XData {
        constructor(obj, {
            selector,
            delay,
            _target
        }) {
            super(obj, "root");

            this._selector = selector;
            this._target = _target;
            this._delay = delay;

            let isInit = 0;

            let backupData;

            let watchFun = () => {
                const eles = this.eles();
                const obj = getFromEleData(eles, this);

                const objKeys = Object.keys(obj);
                Object.keys(this)
                    .filter((e) => {
                        return !objKeys.includes(e);
                    })
                    .forEach((k) => {
                        delete this[k];
                    });

                Object.assign(this, obj);

                backupData = this.toJSON();

                if (!isInit) {
                    return;
                }

                verifyFormEle(eles);
            };

            let timer;
            this._wid = _target.watch(() => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    watchFun();
                }, this._delay);
            });

            // Data initialization
            watchFun();

            isInit = 1;

            // Reverse data binding
            this.watchTick((e) => {
                let data = this.toJSON();

                Object.entries(data).forEach(([k, value]) => {
                    let oldVal = backupData[k];

                    if (
                        value !== oldVal ||
                        (typeof value == "object" &&
                            typeof oldVal == "object" &&
                            JSON.stringify(value) !== JSON.stringify(oldVal))
                    ) {
                        this.eles(k).forEach((ele) => {
                            switch (ele.type) {
                                case "checkbox":
                                    if (value.includes(ele.value)) {
                                        ele.checked = true;
                                    } else {
                                        ele.checked = false;
                                    }
                                    break;
                                case "radio":
                                    if (ele.value == value) {
                                        ele.checked = true;
                                    } else {
                                        ele.checked = false;
                                    }
                                    break;
                                case "text":
                                default:
                                    ele.value = value;
                                    break;
                            }
                        });
                    }
                });

                backupData = data;
            });
        }

        // Get form elements
        eles(propName) {
            let eles = this._target.all(this._selector);

            if (propName) {
                return eles.filter((e) => e.name === propName);
            }

            return eles;
        }
    }

    // Get form data from an elements
    const getFromEleData = (eles, oldData) => {
        const obj = {};

        eles.forEach((ele) => {
            const {
                name,
                type,
                value
            } = ele;

            switch (type) {
                case "radio":
                    if (ele.checked) {
                        obj[name] = value;
                    }
                    break;
                case "checkbox":
                    let tar_arr =
                        obj[name] || (obj[name] = oldData[name]) || (obj[name] = []);
                    if (ele.checked) {
                        if (!tar_arr.includes(ele.value)) {
                            tar_arr.push(value);
                        }
                    } else if (tar_arr.includes(ele.value)) {
                        // Delete if included
                        tar_arr.splice(tar_arr.indexOf(ele.value), 1);
                    }
                    break;
                case "text":
                default:
                    obj[name] = value;
            }
        });

        return obj;
    };

    const verifyFormEle = (eles) => {
        // Re-run the verification
        eles.forEach((e) => {
            const event = new CustomEvent("verify", {
                bubbles: false,
            });
            event.msg = "";
            event.formData = this;
            event.$target = e;

            e.trigger(event);

            if (!e.hasOwnProperty("msg")) {
                return;
            }

            const {
                msg
            } = event;
            const msg_type = getType(msg);

            // msg can only be Error or a string
            if (msg_type == "string") {
                e.msg = msg || null;
            } else if (msg_type == "error") {
                if (getType(e.msg) !== "error" || e.msg.message !== msg.message) {
                    e.msg = msg;
                }
            } else {
                console.warn({
                    target: e,
                    msg,
                    desc: `msg can only be Error or String`,
                });
            }
        });
    };

    extend(XEle.prototype, {
        // Plug-in methods specifically for forms
        form(opts) {
            const defs = {
                selector: "input,textarea,select",
                delay: 100,
            };

            if (getType(opts) === "string") {
                defs.selector = opts;
            } else {
                Object.assign(defs, opts);
            }

            // Returned object data
            const formdata = new FromXData({}, {
                selector: defs.selector,
                delay: defs.delay,
                _target: this,
            });

            return formdata;
        },
    });

    // rebuild array methods
    [
        "concat",
        "every",
        "filter",
        "find",
        "findIndex",
        "forEach",
        "map",
        "slice",
        "some",
        "indexOf",
        "lastIndexOf",
        "includes",
        "join",
    ].forEach((methodName) => {
        const arrayFnFunc = Array.prototype[methodName];
        if (arrayFnFunc) {
            Object.defineProperty(XEle.prototype, methodName, {
                value(...args) {
                    return arrayFnFunc.apply(
                        Array.from(this.ele.children).map(createXEle),
                        args
                    );
                },
            });
        }
    });

    extend(XEle.prototype, {
        splice(index, howmany, ...items) {
            const {
                ele
            } = this;
            const children = Array.from(ele.children);

            // Delete the corresponding element
            const removes = [];
            let b_index = index;
            let b_howmany =
                getType(howmany) == "number" ? howmany : this.length - index;
            let target = children[b_index];
            while (target && b_howmany > 0) {
                removes.push(target);
                ele.removeChild(target);
                b_index++;
                b_howmany--;
                target = children[b_index];
            }

            // add new elements
            if (items.length) {
                let fragEle = document.createDocumentFragment();
                items.forEach((e) => {
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
                        parseStringToDom(e).forEach((e2) => {
                            fragEle.appendChild(e2);
                        });
                    } else if (type == "object") {
                        fragEle.appendChild(parseDataToDom(e));
                    }
                });

                if (index >= this.length) {
                    // push element at the end
                    ele.appendChild(fragEle);
                } else {
                    // Index to insert
                    ele.insertBefore(fragEle, ele.children[index]);
                }
            }

            // Bubbling behavior after data changes
            emitUpdate(this, {
                xid: this.xid,
                name: "splice",
                args: [index, howmany, ...items],
            });

            return removes;
        },
        sort(sortCall) {
            const selfEle = this.ele;
            const childs = Array.from(selfEle.children).map(createXEle).sort(sortCall);

            rebuildXEleArray(selfEle, childs);

            emitUpdate(this, {
                xid: this.xid,
                name: "sort",
            });
            return this;
        },
        reverse() {
            const selfEle = this.ele;
            const childs = Array.from(selfEle.children).reverse();
            rebuildXEleArray(selfEle, childs);
            emitUpdate(this, {
                xid: this.xid,
                name: "reverse",
            });

            return this;
        },
    });

    // Sorting elements according to sequential arrays
    const rebuildXEleArray = (container, rearray) => {
        const {
            children
        } = container;

        rearray.forEach((e, index) => {
            let ele = e.ele || e;

            const targetChild = children[index];

            if (!targetChild) {
                container.appendChild(ele);
            } else if (ele !== targetChild) {
                container.insertBefore(ele, targetChild);
            }
        });
    };

    const getEventsMap = (target) => {
        return target[EVENTS] ? target[EVENTS] : (target[EVENTS] = new Map());
    };

    const MOUSEEVENT = glo.MouseEvent || Event;
    const TOUCHEVENT = glo.TouchEvent || Event;

    const EventMap = new Map([
        ["click", MOUSEEVENT],
        ["mousedown", MOUSEEVENT],
        ["mouseup", MOUSEEVENT],
        ["mousemove", MOUSEEVENT],
        ["mouseenter", MOUSEEVENT],
        ["mouseleave", MOUSEEVENT],
        ["touchstart", TOUCHEVENT],
        ["touchend", TOUCHEVENT],
        ["touchmove", TOUCHEVENT],
    ]);

    // Trigger native events
    const triggerEvenet = (_this, name, data, options = {}) => {
        let TargeEvent = EventMap.get(name) || CustomEvent;

        const event =
            name instanceof Event ?
            name :
            new TargeEvent(name, {
                bubbles: true,
                cancelable: true,
                ...options,
            });

        event.data = data;

        return _this.ele.dispatchEvent(event);
    };

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
                        path = createXEle(event.target)
                            .parents(null, ele)
                            .map((e) => e.ele);
                        path.unshift(event.target);
                    }

                    path.some((pTarget) => {
                        if (pTarget == ele) {
                            return true;
                        }

                        if (createXEle(pTarget).is(selector)) {
                            event.selector = pTarget;
                            real_callback(event);
                            delete event.selector;
                        }
                    });
                };
            }

            this.ele.addEventListener(name, callback);
            const eid = "e_" + getRandomId();
            getEventsMap(this).set(eid, {
                name,
                selector,
                callback,
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
                };
            } else {
                func = selector;
                selector = (e) => {
                    func(e);
                    this.off(eid);
                };
            }

            eid = this.on(name, selector, callback);

            return eid;
        },
        trigger(name, data, options = {}) {
            return triggerEvenet(this, name, data, options);
        },
        triggerHandler(name, data) {
            return triggerEvenet(this, name, data, {
                bubbles: false,
            });
        },
    });

    // Wrapping common events
    ["click", "focus", "blur"].forEach((name) => {
        extend(XEle.prototype, {
            [name](callback) {
                if (isFunction(callback)) {
                    this.on(name, callback);
                } else {
                    return this.trigger(name, callback);
                }
            },
        });
    });

    // All registered components
    const Components = {};
    const ComponentResolves = {};

    // get component
    const getComp = (name) => {
        name = attrToProp(name);

        // Return directly if you have registration
        if (Components[name]) {
            return Components[name];
        }

        // Creating Mounted Components
        let pms = new Promise((res) => {
            ComponentResolves[name] = res;
        });
        Components[name] = pms;

        return pms;
    };

    // render elements
    const renderXEle = async ({
        xele,
        defs,
        temps,
        _this
    }) => {
        Object.assign(xele, defs.data, defs.attrs);

        defs.created && defs.created.call(xele);

        if (defs.temp) {
            // Add shadow root
            const sroot = _this.attachShadow({
                mode: "open"
            });

            sroot.innerHTML = defs.temp;

            // Rendering elements
            renderTemp({
                host: xele,
                xdata: xele,
                content: sroot,
                temps,
            });

            // Child elements have changes that trigger element rendering
            xele.shadow &&
                xele.shadow.watchTick((e) => {
                    if (e.some((e2) => e2.path.length > 1)) {
                        emitUpdate(xele, {
                            xid: xele.xid,
                            name: "forceUpdate",
                        });
                    }
                }, 10);

            const links = sroot.querySelectorAll("link");
            if (links && links.length) {
                await Promise.all(
                    Array.from(links).map((linkEle) => {
                        return new Promise((resolve, reject) => {
                            if (linkEle.sheet) {
                                resolve();
                            } else {
                                let succeedCall, errCall;
                                linkEle.addEventListener(
                                    "load",
                                    (succeedCall = (e) => {
                                        linkEle.removeEventListener("load", succeedCall);
                                        linkEle.removeEventListener("error", errCall);
                                        resolve();
                                    })
                                );
                                linkEle.addEventListener(
                                    "error",
                                    (errCall = (e) => {
                                        linkEle.removeEventListener("load", succeedCall);
                                        linkEle.removeEventListener("error", errCall);
                                        reject({
                                            desc: "link load error",
                                            ele: linkEle,
                                            target: xele.ele,
                                        });
                                    })
                                );
                            }
                        });
                    })
                );
            }
        }

        defs.ready && defs.ready.call(xele);

        // atributes listening
        if (!isEmptyObj(defs.attrs)) {
            const {
                ele
            } = xele;
            // First determine if there is a value to get
            Object.keys(defs.attrs).forEach((k) => {
                if (ele.hasAttribute(k)) {
                    xele[k] = ele.getAttribute(k);
                }
            });

            xele.watchTick((e) => {
                _this.__set_attr = 1;
                Object.keys(defs.attrs).forEach((key) => {
                    let val = xele[key];
                    if (val === null || val === undefined) {
                        _this.removeAttribute(propToAttr(key));
                    } else {
                        _this.setAttribute(propToAttr(key), xele[key]);
                    }
                });
                delete _this.__set_attr;
            });
        }

        // The watch function triggers
        let d_watch = defs.watch;
        if (!isEmptyObj(d_watch)) {
            xele.watchKey(d_watch, true);
        }
    };

    // The revoke function has been run
    const RUNNDEDREVOKE = Symbol("runned_revoke");

    // Registering component functions
    const register = (opts) => {
        const defs = {
            // Registered component name
            tag: "",
            // Body content string
            temp: "",
            // Keys bound to attributes
            attrs: {},
            // Initialization data after element creation
            data: {},
            // The listener function for the element
            watch: {},
            // Methods merged into the prototype
            proto: {},
            // Function triggered when the component is created (data initialization complete)
            // created() { },
            // Function triggered after component data initialization is complete (initial rendering completed)
            // ready() { },
            // Functions that are added to the document trigger
            // attached() { },
            // Functions triggered by moving out of the document
            // detached() { },
            // The container element is changed
            // slotchange() { }
        };

        Object.assign(defs, opts);

        let temps;

        if (defs.temp) {
            const d = transTemp(defs.temp, defs.tag);
            defs.temp = d.html;
            temps = d.temps;
        }

        // Generate a new XEle class
        let compName = attrToProp(opts.tag);

        // const CustomXEle = Components[compName] = class extends XEle {
        const CustomXEle = class extends XEle {
            constructor(ele) {
                super(ele);

                ele.isCustom = true;
            }

            // Forced view refresh
            forceUpdate() {
                emitUpdate(this, {
                    xid: this.xid,
                    name: "forceUpdate",
                });
            }
            // Recycle all data within the element (prevent garbage collection failure)
            revoke() {
                if (this[RUNNDEDREVOKE]) {
                    return;
                }
                this[RUNNDEDREVOKE] = 1;
                Object.values(this).forEach((child) => {
                    if (!(child instanceof XEle) && isxdata(child)) {
                        clearXDataOwner(child, this[XDATASELF]);
                    }
                });

                removeElementBind(this.shadow.ele);
            }
        };

        extend(CustomXEle.prototype, defs.proto);

        const cansetKeys = getCansetKeys(defs);

        // Extending CANSETKEYS
        defineProperties(CustomXEle.prototype, {
            [CANSETKEYS]: {
                writable: true,
                value: new Set([...xEleDefaultSetKeys, ...cansetKeys]),
            },
        });

        // Registering native components
        const XhearElement = class extends HTMLElement {
            constructor(...args) {
                super(...args);

                this.__xEle__ = new CustomXEle(this);

                const xele = createXEle(this);

                renderXEle({
                    xele,
                    defs,
                    temps,
                    _this: this,
                }).then((e) => {
                    if (this.__x_connected) {
                        this.setAttribute("x-render", 1);
                    } else {
                        this.x_render = 1;
                    }
                });
            }

            connectedCallback() {
                // console.log("connectedCallback => ", this);
                if (this.x_render) {
                    this.setAttribute("x-render", this.x_render);
                }
                this.__x_connected = true;
                if (defs.attached && !this.__x_runned_connected) {
                    nextTick(() => {
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
                    nextTick(() => {
                        if (!this.__x_connected && !this.__x_runnded_disconnected) {
                            this.__x_runnded_disconnected = true;
                            defs.detached.call(createXEle(this));
                        }
                    });
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (this.__set_attr) return;

                createXEle(this)[attrToProp(name)] = newValue;
            }

            static get observedAttributes() {
                return Object.keys(defs.attrs).map((e) => propToAttr(e));
            }
        };

        customElements.define(defs.tag, XhearElement);

        // Setup registration complete
        if (ComponentResolves[compName]) {
            ComponentResolves[compName](CustomXEle);
            delete ComponentResolves[compName];
        } else {
            Components[compName] = Promise.resolve(CustomXEle);
        }
    };

    // Get the settable keys according to defaults
    const getCansetKeys = (defs) => {
        const {
            attrs,
            data,
            watch,
            proto
        } = defs;

        const keys = [
            ...Object.keys(attrs),
            ...Object.keys(data),
            ...Object.keys(watch),
        ];

        const protoDesp = Object.getOwnPropertyDescriptors(proto);
        Object.keys(protoDesp).forEach((keyName) => {
            let {
                set
            } = protoDesp[keyName];

            if (set) {
                keys.push(keyName);
            }
        });

        return keys;
    };

    // Convert temp into a renderable template
    const transTemp = (temp, regTagName) => {
        // Removing commented code
        temp = temp.replace(/<!--.+?-->/g, "");

        // Custom String Conversion
        var textDataArr = temp.match(/{{.+?}}/g);
        textDataArr &&
            textDataArr.forEach((e) => {
                var key = /{{(.+?)}}/.exec(e);
                if (key) {
                    // temp = temp.replace(e, `<span :text="${key[1]}"></span>`);
                    temp = temp.replace(e, `<x-span prop="${encodeURI(key[1])}"></x-span>`);
                }
            });

        const tsTemp = document.createElement("template");
        tsTemp.innerHTML = temp;

        // Fix temp:xxx template on native elements
        let addTemps = [],
            removeRegEles = [];

        Array.from(tsTemp.content.querySelectorAll("*")).forEach((ele) => {
            const bindData = {};

            // Properties that need to be removed
            const needRemoveAttrs = [];

            Array.from(ele.attributes).forEach((attrObj) => {
                let {
                    name,
                    value
                } = attrObj;

                // Template Extraction
                let tempMatch = /^temp:(.+)/.exec(name);
                if (tempMatch) {
                    let [, tempName] = tempMatch;
                    let tempEle = document.createElement("template");
                    tempEle.setAttribute("name", tempName);
                    ele.removeAttribute(name);
                    tempEle.innerHTML = ele.outerHTML;
                    addTemps.push(tempEle);
                    removeRegEles.push(ele);
                    return true;
                }

                let command;
                let target;

                if (/^#/.test(name)) {
                    command = "cmd";
                    target = name.replace(/^#/, "");
                } else if (/^@/.test(name)) {
                    command = "on";
                    target = name.replace(/^@/, "");
                } else if (name.includes(":")) {
                    // Fixed with command separator
                    let m_arr = name.split(":");

                    if (m_arr.length == 2) {
                        // Assign values if the template is correct
                        command = m_arr[0];
                        target = m_arr[1];

                        if (command === "") {
                            // Fix Attribute Binding
                            command = "prop";
                        }
                    } else {
                        // Error in binding identification
                        throw {
                            desc: "template binding mark error",
                            target: ele,
                            expr: name,
                        };
                    }
                }

                if (command) {
                    let data = bindData[command] || (bindData[command] = {});
                    if (command == "on") {
                        data[target] = {
                            name: value,
                        };
                    } else if (target) {
                        data[target] = value;
                    }
                    needRemoveAttrs.push(name);
                }
            });

            if (needRemoveAttrs.length) {
                // ele.setAttribute("bind-data", JSON.stringify(bindData));
                // ele.setAttribute('bind-keys', Object.keys(bindData).join(" "));

                // Restore original properties
                Object.keys(bindData).forEach((bName) => {
                    let data = bindData[bName];
                    if (bName == "cmd") {
                        Object.keys(data).forEach((dName) => {
                            ele.setAttribute(`x-cmd-${dName}`, data[dName]);
                        });
                    } else {
                        ele.setAttribute(`x-${bName}`, JSON.stringify(data));
                    }
                });

                needRemoveAttrs.forEach((name) => ele.removeAttribute(name));
            }
        });

        if (addTemps.length) {
            addTemps.forEach((ele) => {
                tsTemp.content.appendChild(ele);
            });
            removeRegEles.forEach((ele) => {
                tsTemp.content.removeChild(ele);
            });
        }

        // Convert template data
        Array.from(tsTemp.content.querySelectorAll("template")).forEach((e) => {
            e.innerHTML = transTemp(e.innerHTML).html;
        });

        // fix x-cmd-if elements
        wrapIfTemp(tsTemp);

        // get templates
        let temps = new Map();

        Array.from(tsTemp.content.querySelectorAll(`template[name]`)).forEach((e) => {
            temps.set(e.getAttribute("name"), {
                ele: e,
                code: e.content.children[0].outerHTML,
            });
            e.parentNode.removeChild(e);
        });

        // Inspection of the template
        if (temps.size) {
            for (let [key, e] of temps.entries()) {
                const {
                    children
                } = e.ele.content;
                if (children.length !== 1) {
                    throw {
                        name: key,
                        html: e.code,
                        tag: regTagName,
                        desc: "register error, only one element must exist in the template",
                    };
                } else {
                    if (children[0].getAttribute("x-cmd-if")) {
                        throw {
                            name: key,
                            html: e.code,
                            tag: regTagName,
                            desc: "register error, cannot use if on template first element",
                        };
                    }
                }
            }
        }

        return {
            temps,
            html: tsTemp.innerHTML,
        };
    };

    // Wrap the template around the x-cmd-if element
    const wrapIfTemp = (tempEle) => {
        let iEles = tempEle.content.querySelectorAll(
            "[x-cmd-if],[x-cmd-else-if],[x-cmd-else],[x-cmd-await],[x-cmd-then],[x-cmd-catch]"
        );

        iEles.forEach((ele) => {
            if (ele.tagName.toLowerCase() == "template") {
                return;
            }

            let ifTempEle = document.createElement("template");
            [
                "x-cmd-if",
                "x-cmd-else-if",
                "x-cmd-else",
                "x-cmd-await",
                "x-cmd-then",
                "x-cmd-catch",
            ].forEach((name) => {
                let val = ele.getAttribute(name);

                if (val === null) {
                    return;
                }

                ifTempEle.setAttribute(name, val);
                ele.removeAttribute(name);
            });

            ele.parentNode.insertBefore(ifTempEle, ele);
            ifTempEle.content.appendChild(ele);
        });

        // The internal template is also wrapped
        Array.from(tempEle.content.querySelectorAll("template")).forEach(wrapIfTemp);
    };

    // Get all renderable elements that match the expression
    const getCanRenderEles = (root, expr) => {
        let arr = Array.from(root.querySelectorAll(expr));
        if (root instanceof Element && meetsEle(root, expr)) {
            arr.push(root);
        }
        return arr;
    };

    // Remove the original element and add a positioning element
    const postionNode = (e) => {
        let marker = new Comment("x-marker");

        let parent = e.parentNode;
        parent.insertBefore(marker, e);
        parent.removeChild(e);

        return {
            marker,
            parent,
        };
    };

    // Converting expressions to functions
    const exprToFunc = (expr) => {
        return new Function(
            "...$args",
            `
const [$e,$target] = $args;

try{
    with(this){
        ${expr};
    }
}catch(e){
    throw {
        message:e.message || "run error",
        expr:\`${expr.replace(/`/g, "\\`")}\`,
        target:this,
        error:e
    };
}`
        );
    };

    // Clear the expression property and add the data to the element object
    const moveAttrExpr = (ele, exprName, propData) => {
        ele.removeAttribute(exprName);

        let renderedData = ele.__renderData;
        if (!renderedData) {
            renderedData = ele.__renderData = {};

            // Adding rendered data
            ele.setAttribute("x-rendered", "");
        }

        renderedData[exprName] = propData;
    };

    // Binding function listener, added to the record array
    const bindWatch = (data, func, bindings) => {
        let eid = data.watchTick(func);
        bindings.push({
            eid,
            target: data,
        });
    };

    // Get the target data get function
    const renderXdataGetFunc = (expr, xdata) => {
        let runFunc;

        if (regIsFuncExpr.test(expr)) {
            runFunc = exprToFunc("return " + expr).bind(xdata);
        } else {
            runFunc = () => getXData(xdata, expr);
        }

        return runFunc;
    };

    // Watch function binding on the renderer
    // 'expr' is used as the basis for determining xdata or host, not for execution
    const renderInWatch = ({
        xdata,
        host,
        expr,
        watchFun
    }) => {
        const bindings = [];

        // if (host !== xdata) {
        if (!(xdata instanceof XEle)) {
            // Refill rendering within fill
            // xdata is responsible for listening to $index
            // xdata.$data is the item data itself
            // $host is the component data
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
            }
            // else {
            //     throw {
            //         desc: "fill element must use $data $host $item or $index",
            //         target: host,
            //         expr
            //     };
            // }
        } else {
            // host data binding
            bindWatch(xdata, watchFun, bindings);
        }

        return bindings;
    };

    // Expression to value setting
    const exprToSet = ({
        xdata,
        host,
        expr,
        callback,
        isArray
    }) => {
        // Instant-running judgment functions
        let runFunc = renderXdataGetFunc(expr, xdata);

        // Backing up data for comparison
        let backup_val, backup_ids, backup_objstr;

        // Rendering functions that run directly
        const watchFun = (modifys) => {
            const val = runFunc();

            if (isxdata(val)) {
                if (isArray) {
                    // If it is an array, only listen to the array changes
                    let ids = val.map((e) => (e && e.xid ? e.xid : e)).join(",");
                    if (backup_ids !== ids) {
                        callback({
                            val,
                            modifys
                        });
                        backup_ids = ids;
                    }
                } else {
                    // Object Listening
                    let obj_str = val.toJSON();

                    if (backup_val !== val || obj_str !== backup_objstr) {
                        callback({
                            val,
                            modifys
                        });
                        backup_objstr = obj_str;
                    }
                }
            } else if (backup_val !== val) {
                callback({
                    val,
                    modifys
                });
                backup_objstr = null;
            }
            backup_val = val;
        };

        // First execute once
        watchFun();

        return renderInWatch({
            xdata,
            host,
            expr,
            watchFun,
        });
    };

    // Add listening data
    const addBindingData = (target, bindings) => {
        let _binds = target.__bindings || (target.__bindings = []);
        _binds.push(...bindings);
    };

    const regIsFuncExpr = /[\(\)\;\=\>\<\|\!\?\+\-\*\/\&\|\{\}`]/;

    // Element depth loop function
    const elementDeepEach = (ele, callback) => {
        Array.from(ele.childNodes).forEach((target) => {
            callback(target);

            if (target instanceof Element) {
                elementDeepEach(target, callback);
            }
        });
    };

    // Remove data binding relationships based on if statements
    const removeElementBind = (target) => {
        elementDeepEach(target, (ele) => {
            if (ele.isCustom) {
                createXEle(ele).revoke();
            }

            if (ele.__bindings) {
                ele.__bindings.forEach((e) => {
                    let {
                        target,
                        eid
                    } = e;
                    target.unwatch(eid);
                });
            }
        });
    };

    // Adding elements inside a rendered template item
    const addTempItemEle = ({
        temp,
        temps,
        marker,
        parent,
        host,
        xdata
    }) => {
        // add elements
        let targets = parseStringToDom(temp.innerHTML);
        targets.forEach((ele) => {
            parent.insertBefore(ele, marker);
            renderTemp({
                host,
                xdata,
                content: ele,
                temps
            });
        });
        return targets;
    };

    // Delete the elements inside the rendered template item
    const removeTempItemEle = (arr) => {
        arr.forEach((item) => {
            // Removing data binding
            removeElementBind(item);

            item.parentNode.removeChild(item);
        });
    };

    // Logic for rendering components
    // host :body component element; holds the body of the method
    // xdata: rendering target data; host in single-level rendering, concrete data in x-fill mode
    // content: rendering target element
    const renderTemp = ({
        host,
        xdata,
        content,
        temps
    }) => {
        // Event Binding
        getCanRenderEles(content, "[x-on]").forEach((target) => {
            let eventInfo = JSON.parse(target.getAttribute("x-on"));

            let eids = [];

            const $tar = createXEle(target);

            Object.keys(eventInfo).forEach((eventName) => {
                let {
                    name
                } = eventInfo[eventName];

                let eid;

                // Determine if the function
                if (regIsFuncExpr.test(name)) {
                    // Function Binding
                    const func = exprToFunc(name);
                    eid = $tar.on(eventName, (event) => {
                        func.call(xdata, event, $tar);
                    });
                } else {
                    // Function name binding
                    eid = $tar.on(eventName, (event) => {
                        const func = getXData(xdata, name);
                        if (func) {
                            if (isFunction(func)) {
                                func.call(host, event);
                            } else {
                                console.error({
                                    target: xdata,
                                    host,
                                    name,
                                    value: func,
                                    desc: "bind value is not function",
                                });
                            }
                        } else {
                            console.error({
                                target: xdata,
                                host,
                                name,
                                desc: "no binding function",
                            });
                        }
                    });
                }

                eids.push(eid);
            });

            moveAttrExpr(target, "x-on", eventInfo);
        });

        // Attribute Binding
        getCanRenderEles(content, "[x-attr]").forEach((ele) => {
            const attrData = JSON.parse(ele.getAttribute("x-attr"));

            moveAttrExpr(ele, "x-attr", attrData);

            Object.keys(attrData).forEach((attrName) => {
                const bindings = exprToSet({
                    xdata,
                    host,
                    expr: attrData[attrName],
                    callback: ({
                        val
                    }) => {
                        if (val === null || val === undefined) {
                            ele.removeAttribute(attrName);
                        } else {
                            ele.setAttribute(attrName, val);
                        }
                    },
                });

                addBindingData(ele, bindings);
            });
        });

        // class binding
        getCanRenderEles(content, "[x-class]").forEach((ele) => {
            const classListData = JSON.parse(ele.getAttribute("x-class"));

            moveAttrExpr(ele, "x-class", classListData);

            Object.keys(classListData).forEach((className) => {
                const bindings = exprToSet({
                    xdata,
                    host,
                    expr: classListData[className],
                    callback: ({
                        val
                    }) => {
                        // ele.setAttribute(className, val);
                        if (val) {
                            ele.classList.add(className);
                        } else {
                            ele.classList.remove(className);
                        }
                    },
                });

                addBindingData(ele, bindings);
            });
        });

        // Property Binding
        getCanRenderEles(content, "[x-prop]").forEach((ele) => {
            const propData = JSON.parse(ele.getAttribute("x-prop"));
            const xEle = createXEle(ele);

            moveAttrExpr(ele, "x-prop", propData);

            Object.keys(propData).forEach((propName) => {
                const bindings = exprToSet({
                    xdata,
                    host,
                    expr: propData[propName],
                    callback: ({
                        val
                    }) => {
                        propName = attrToProp(propName);

                        try {
                            xEle[propName] = val;
                        } catch (error) {
                            throw {
                                target: ele,
                                host: host.ele,
                                desc: `failed to set property ${propName} (:${propName} or prop:${propName}), did you want to use attr:${propName}?`,
                                error,
                            };
                        }
                    },
                });

                addBindingData(ele, bindings);
            });
        });

        // Two-way data binding
        getCanRenderEles(content, "[x-sync]").forEach((ele) => {
            const propData = JSON.parse(ele.getAttribute("x-sync"));
            const xEle = createXEle(ele);

            Object.keys(propData).forEach((propName) => {
                let hostPropName = propData[propName];
                if (regIsFuncExpr.test(hostPropName)) {
                    throw {
                        desc: "sync only accepts attribute names",
                    };
                }

                const bindings1 = exprToSet({
                    xdata,
                    host,
                    expr: hostPropName,
                    callback: ({
                        val
                    }) => {
                        setXData(xEle, propName, val);
                    },
                });

                const bindings2 = exprToSet({
                    xdata: xEle,
                    host,
                    expr: propName,
                    callback: ({
                        val
                    }) => {
                        setXData(xdata, hostPropName, val);
                    },
                });

                addBindingData(ele, [...bindings1, ...bindings2]);
            });
        });

        // Text Binding
        getCanRenderEles(content, "x-span").forEach((ele) => {
            let expr = decodeURI(ele.getAttribute("prop"));

            let {
                marker,
                parent
            } = postionNode(ele);

            // Changing markup elements to textNode
            const textnode = document.createTextNode("");
            parent.replaceChild(textnode, marker);

            // Data Binding
            const bindings = exprToSet({
                xdata,
                host,
                expr,
                callback: ({
                    val
                }) => {
                    textnode.textContent = val;
                },
            });

            addBindingData(textnode, bindings);
        });

        // Conditional expression element rendering
        getCanRenderEles(content, "[x-cmd-if]").forEach((ele) => {
            const conditionEles = [ele];
            // Pick up the subsequent else-if and else
            let {
                nextElementSibling
            } = ele;
            while (
                nextElementSibling &&
                (nextElementSibling.hasAttribute("x-cmd-else-if") ||
                    nextElementSibling.hasAttribute("x-cmd-else"))
            ) {
                nextElementSibling.parentNode.removeChild(nextElementSibling);
                conditionEles.push(nextElementSibling);
                nextElementSibling = ele.nextElementSibling;
            }

            let all_expr = "";

            // Converting concatenated conditional elements into conditional functions
            const conditions = conditionEles.map((e, index) => {
                let callback;

                const expr =
                    e.getAttribute("x-cmd-else-if") || e.getAttribute("x-cmd-if");

                if (expr) {
                    callback = renderXdataGetFunc(expr, xdata);
                    all_expr += `${index == 0 ? "if" : "else-if"}(${expr})...`;
                }

                return {
                    callback,
                    tempEle: e,
                };
            });

            // Positioning text elements
            let {
                marker,
                parent
            } = postionNode(ele);

            // Generated target elements
            let oldTargetEle = null;
            let oldConditionId = -1;

            const watchFun = (modifys) => {
                let tempEle,
                    conditionId = -1;
                let conditionVal;
                conditions.some((e, index) => {
                    if (e.callback) {
                        conditionVal = !!e.callback();

                        if (conditionVal) {
                            tempEle = e.tempEle;
                            conditionId = index;
                            return true;
                        }
                    } else {
                        // The final else condition
                        tempEle = e.tempEle;
                        conditionId = index;
                    }
                });

                // The value or serial number is different, both can enter the corrected link
                if (oldConditionId !== conditionId) {
                    // Old template destruction
                    if (oldTargetEle) {
                        removeElementBind(oldTargetEle);

                        oldTargetEle.parentNode.removeChild(oldTargetEle);
                        oldTargetEle = null;
                    }

                    // Confirm that templates can be added
                    if (tempEle) {
                        // add element
                        oldTargetEle = parseStringToDom(
                            tempEle.content.children[0].outerHTML
                        )[0];

                        parent.insertBefore(oldTargetEle, marker);

                        // Rerendering
                        renderTemp({
                            host,
                            xdata,
                            content: oldTargetEle,
                            temps
                        });
                    }
                }

                oldConditionId = conditionId;
            };

            // First execute once
            watchFun();

            addBindingData(
                marker,
                renderInWatch({
                    xdata,
                    host,
                    expr: all_expr,
                    watchFun,
                })
            );
        });

        // await element rendering
        getCanRenderEles(content, "[x-cmd-await]").forEach((ele) => {
            let awaitTemp = ele,
                thenTemp,
                catchTemp;
            // Pick up the subsequent else-if and else
            let {
                nextElementSibling
            } = ele;
            while (
                nextElementSibling &&
                (nextElementSibling.hasAttribute("x-cmd-then") ||
                    nextElementSibling.hasAttribute("x-cmd-catch"))
            ) {
                if (nextElementSibling.hasAttribute("x-cmd-then")) {
                    thenTemp = nextElementSibling;
                } else if (nextElementSibling.hasAttribute("x-cmd-catch")) {
                    catchTemp = nextElementSibling;
                }
                nextElementSibling.parentNode.removeChild(nextElementSibling);
                nextElementSibling = ele.nextElementSibling;
            }

            // Add Location
            let {
                marker,
                parent
            } = postionNode(ele);

            let expr = ele.getAttribute("x-cmd-await");

            let beforePms, beforeTargets;
            const bindings = exprToSet({
                xdata,
                host,
                expr,
                callback: ({
                    val
                }) => {
                    // Clear the previous data
                    if (beforeTargets) {
                        removeTempItemEle(beforeTargets);
                        beforeTargets = null;
                    }

                    // add elements
                    beforeTargets = addTempItemEle({
                        temp: awaitTemp,
                        temps,
                        marker,
                        parent,
                        host,
                        xdata,
                    });

                    beforePms = val;

                    val
                        .then((e) => {
                            if (beforePms !== val) {
                                return;
                            }
                            removeTempItemEle(beforeTargets);
                            beforeTargets = null;
                            if (thenTemp) {
                                beforeTargets = addTempItemEle({
                                    temp: thenTemp,
                                    temps,
                                    marker,
                                    parent,
                                    host,
                                    xdata: {
                                        [thenTemp.getAttribute("x-cmd-then")]: e,
                                        $host: host,
                                    },
                                });
                            }
                        })
                        .catch((err) => {
                            if (beforePms !== val) {
                                return;
                            }
                            removeTempItemEle(beforeTargets);
                            beforeTargets = null;
                            if (catchTemp) {
                                beforeTargets = addTempItemEle({
                                    temp: catchTemp,
                                    temps,
                                    marker,
                                    parent,
                                    host,
                                    xdata: {
                                        [catchTemp.getAttribute("x-cmd-catch")]: err,
                                        $host: host,
                                    },
                                });
                            }
                        });
                },
            });

            addBindingData(marker, bindings);
        });

        // Fill Binding
        getCanRenderEles(content, "[x-fill]").forEach((ele) => {
            const fillData = JSON.parse(ele.getAttribute("x-fill"));
            let fillKeys = ele.getAttribute("x-item");
            fillKeys && (fillKeys = JSON.parse(fillKeys));

            const container = ele;

            createXEle(container)._unupdate = 1;

            let [tempName, propName] = Object.entries(fillData)[0];

            let old_xid;

            // Remove the x-fill attribute in advance to prevent double rendering
            moveAttrExpr(ele, "x-fill", fillData);
            moveAttrExpr(ele, "x-item", fillKeys);

            const bindings = exprToSet({
                xdata,
                host,
                expr: propName,
                isArray: 1,
                callback: (d) => {
                    const targetArr = d.val;

                    // Get Template
                    let tempData = temps.get(tempName);

                    if (!tempData) {
                        throw {
                            target: host.ele,
                            desc: `this template was not found`,
                            name: tempName,
                        };
                    }

                    if (!old_xid) {
                        // Completely filled
                        targetArr.forEach((data, index) => {
                            const itemEle = createFillItem({
                                host,
                                data,
                                index,
                                tempData,
                                temps,
                            });

                            if (fillKeys) {
                                initKeyToItem(itemEle, fillKeys, xdata, host);
                            }

                            // Add to container
                            container.appendChild(itemEle.ele);
                        });

                        old_xid = targetArr.xid;
                    } else {
                        const childs = Array.from(container.children);
                        const oldArr = childs.map((e) => e.__fill_item.$data);

                        const holder = Symbol("holder");

                        const afterChilds = [];
                        targetArr.forEach((e, index) => {
                            let oldIndex = oldArr.indexOf(e);
                            if (oldIndex === -1) {
                                let newItem = createFillItem({
                                    host,
                                    data: e,
                                    index,
                                    tempData,
                                    temps,
                                });

                                if (fillKeys) {
                                    initKeyToItem(newItem, fillKeys, xdata, host);
                                }

                                afterChilds.push(newItem.ele);
                            } else {
                                // belongs to the element displacement
                                let targetEle = childs[oldIndex];
                                // update index
                                targetEle.__fill_item.$index = index;
                                afterChilds.push(targetEle);

                                oldArr[oldIndex] = holder;
                            }
                        });

                        // that need to be cleared of data
                        const needRemoves = [];

                        // Delete elements that are not in the data
                        oldArr.forEach((e, i) => {
                            if (e !== holder) {
                                let e2 = childs[i];
                                needRemoves.push(e2);
                                container.removeChild(e2);
                            }
                        });

                        // Removing data binding
                        needRemoves.forEach((e) => removeElementBind(e));

                        // Reconstructing arrays
                        rebuildXEleArray(container, afterChilds);
                    }
                },
            });

            addBindingData(ele, bindings);
        });
    };

    const initKeyToItem = (itemEle, fillKeys, xdata, host) => {
        let fData = itemEle.$item;
        Object.keys(fillKeys).forEach((key) => {
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
                },
            });

            addBindingData(itemEle.ele, itemBindings);
        });
    };

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
                // get self
                return itemData;
            },
            // get $index() {
            //     return this._index;
            // },
            // _index: index
        });

        defineProperties(itemEle, {
            $item: {
                get: () => itemData,
            },
            $data: {
                get: () => data,
            },
        });

        itemEle.ele.__fill_item = itemData;

        renderTemp({
            host,
            xdata: itemData,
            content: itemEle.ele,
            temps
        });

        return itemEle;
    };


    function $(expr) {
        if (expr instanceof Element) {
            return createXEle(expr);
        }

        const exprType = getType(expr);

        // The final element to be returned
        let ele;

        if (exprType == "string") {
            if (!/\<.+\>/.test(expr)) {
                ele = document.querySelector(expr);
            } else {
                ele = parseStringToDom(expr)[0];
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
            return Array.from(document.querySelectorAll(expr)).map((e) =>
                createXEle(e)
            );
        },
        register,
        xdata: (obj) => createXData(obj),
        nextTick,
        fn: XEle.prototype,
        tag: getComp,
    });
    /*!
     * drill.js v4.0.0
     * https://github.com/kirakiray/drill.js
     * 
     * (c) 2018-2023 YAO
     * Released under the MIT License.
     */
    ((glo) => {
        "use strict";
        // functions
        const getRandomId = () => Math.random().toString(32).substr(2);
        const objectToString = Object.prototype.toString;
        const getType = (value) =>
            objectToString
            .call(value)
            .toLowerCase()
            .replace(/(\[object )|(])/g, "");
        const isFunction = (d) => getType(d).search("function") > -1;
        const isEmptyObj = (obj) => !(0 in Object.keys(obj));

        const {
            defineProperties
        } = Object;

        const nextTick = (() => {
            const pnext = (func) => Promise.resolve().then(() => func());

            if (typeof process === "object" && process.nextTick) {
                pnext = process.nextTick;
            }

            return pnext;
        })();

        // Process handling operations for js types
        const processor = new Map();

        // Functions for adding process types
        const addProcess = (name, callback) => {
            processor.set(name, callback);

            defineProperties(glo, {
                [name]: {
                    value: (respone) => {
                        let nowSrc = document.currentScript.src;

                        // Check if there is a record
                        let record = getBag(nowSrc);

                        if (!record) {
                            record = new BagRecord(nowSrc);
                            setBag(nowSrc, record);
                        }

                        // Set the loading status
                        record.status = 1;

                        record.ptype = name;

                        callback({
                            respone,
                            record,
                            relativeLoad(...args) {
                                let repms = new Drill(...args);

                                // Set relative directory
                                repms.__relative__ = nowSrc;

                                return repms;
                            },
                        });
                    },
                },
            });
        };

        // Initial module type: define
        addProcess("define", async ({
            respone,
            record,
            relativeLoad
        }) => {
            // Functions for returning module content
            let getPack;

            if (isFunction(respone)) {
                const exports = {};

                // Run first to return results
                let result = await respone({
                    load: relativeLoad,
                    FILE: record.src,
                    exports,
                });

                if (result === undefined && !isEmptyObj(exports)) {
                    result = exports;
                }

                getPack = (pkg) => {
                    return result;
                };
            } else {
                // Assign the result directly
                getPack = (pkg) => {
                    return respone;
                };
            }

            // Return the getPack function
            record.done(getPack);
        });

        // Initial module type: task
        addProcess("task", async ({
            respone,
            record,
            relativeLoad
        }) => {
            if (!isFunction(respone)) {
                throw "task must be a function";
            }

            record.done(async (pkg) => {
                return await respone({
                    data: pkg.data,
                    load: relativeLoad,
                    FILE: record.src,
                });
            });
        });

        const loaders = new Map();

        // function for adding loaders
        const addLoader = (type, callback) => {
            loaders.set(type, (src) => {
                const record = getBag(src);

                record.type = type;

                return callback({
                    src,
                    record,
                });
            });
        };

        addLoader("js", ({
            src,
            record
        }) => {
            return new Promise((resolve, reject) => {
                // main script element
                let script = document.createElement("script");

                script.type = "text/javascript";
                script.async = true;
                script.src = src;

                // Mounted script element
                record.sourceElement = script;

                script.addEventListener("load", async () => {
                    // Script load completion time
                    record.loadedTime = Date.now();

                    // Determine if a resource has been set to loading or completed status
                    if (record.status == 0) {
                        record.ptype = "script";

                        // No 1 or 2 state, it means it's a normal js file, just execute done
                        record.done((pkg) => {});
                    }

                    resolve();
                });
                script.addEventListener("error", (event) => {
                    // load error
                    reject({
                        desc: "load script error",
                        event,
                    });
                });

                document.head.appendChild(script);
            });
        });

        addLoader("mjs", async ({
            src,
            record
        }) => {
            let d = await import(src);

            record.done(() => d);
        });

        addLoader("wasm", async ({
            src,
            record
        }) => {
            let data = await fetch(src).then((e) => e.arrayBuffer());

            let module = await WebAssembly.compile(data);
            const instance = new WebAssembly.Instance(module);

            record.done(() => instance.exports);
        });

        addLoader("json", async ({
            src,
            record
        }) => {
            let data = await fetch(src);

            data = await data.json();

            record.done(() => data);
        });

        addLoader("css", async ({
            src,
            record
        }) => {
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = src;

            record.sourceElement = link;

            let isAppend = false;

            record.done(async (pkg) => {
                if (pkg.params.includes("-unpull")) {
                    // If there is an unpull parameter, the link element is returned and not added to the head
                    return link;
                }

                // By default it is added to the head and does not return a value
                if (!isAppend) {
                    document.head.appendChild(link);
                    isAppend = true;
                }

                // Wait if not finished loading
                if (!link.sheet) {
                    await new Promise((resolve) => {
                        link.addEventListener("load", (e) => {
                            resolve();
                        });
                    });
                }
            });
        });

        // The following types return utf8 strings
        ["html"].forEach((name) => {
            addLoader(name, async ({
                src,
                record
            }) => {
                let data = await fetch(src).then((e) => e.text());

                record.done(() => data);
            });
        });

        const loadByFetch = async ({
            src,
            record
        }) => {
            let response = await fetch(src);

            if (!response.ok) {
                throw {
                    desc: "fetch " + response.statusText,
                    response,
                };
            }

            // Reset getPack
            record.done(() => response);
        };

        // So the information about the file exists on this object
        const bag = new Map();

        const setBag = (src, record) => {
            let o = new URL(src);
            bag.set(o.origin + o.pathname, record);
        };

        const getBag = (src) => {
            let o = new URL(src);
            return bag.get(o.origin + o.pathname);
        };

        class BagRecord {
            constructor(src) {
                this.src = src;
                // 0 Loading
                // 1 Loaded resources successfully (but dependencies not completed)
                // 2 Loading completed
                // -1 Load failure
                this.status = 0;
                this.bid = "b_" + getRandomId();

                // repository of the getPack function
                this.data = new Promise((res, rej) => {
                    this.__resolve = res;
                    this.__reject = rej;
                });

                this.startTime = Date.now();
            }

            done(data) {
                this.status = 2;
                this.__resolve(data);

                delete this.__resolve;
                delete this.__reject;

                this.doneTime = Date.now();
            }

            fail(err) {
                this.status = -1;
                this.__reject(data);

                delete this.__resolve;
                delete this.__reject;

                this.doneTime = Date.now();
            }
        }

        const notfindLoader = {};

        // Agent resource requests
        async function agent(pkg) {
            let record = getBag(pkg.src);

            if (record) {
                if (record.status == -1) {
                    throw {
                        expr: pkg.url,
                        src: record.src,
                    };
                }

                const getPack = await record.data;

                return await getPack(pkg);
            }

            record = new BagRecord(pkg.src);

            setBag(pkg.src, record);

            // Get loader by suffix name
            let loader = loaders.get(pkg.ftype);

            try {
                if (loader) {
                    // Loading resource
                    await loader(record.src);
                } else {
                    if (!notfindLoader[pkg.ftype]) {
                        // No such loader exists
                        console.warn({
                            desc: "did not find this loader",
                            type: pkg.ftype,
                        });

                        notfindLoader[pkg.ftype] = 1;
                    }

                    // loadByUtf8({
                    await loadByFetch({
                        src: record.src,
                        record,
                    });
                }
            } catch (err) {
                record.fail(err);
            }

            const getPack = await record.data;

            return await getPack(pkg);
        }

        // Save shortcut path in this object
        const pathsMap = new Map();

        class DPackage {
            constructor(str, bag) {
                let [url, ...params] = str.split(" ");
                this.url = url;
                this.params = params;
                this.bag = bag;
            }

            get src() {
                let {
                    url
                } = this;

                // Add the part in front of the shortcut path
                if (/^@.+/.test(url)) {
                    for (let [keyReg, path] of pathsMap) {
                        if (keyReg.test(url)) {
                            url = url.replace(keyReg, path);
                            break;
                        }
                    }
                }

                // If there is a -p parameter, fix the link path
                if (this.params.includes("-p")) {
                    let packName = url.replace(/.+\/(.+)/, "$1");
                    url += `/${packName}.js`;
                }

                let obj = new URL(url, this.relative);
                return obj.href;
            }

            // File type, the type used by the loader, usually takes the path suffix
            get ftype() {
                const urlObj = new URL(this.src);

                // Determine if the parameter has :xxx , correction type
                let type = urlObj.pathname.replace(/.+\.(.+)/, "$1");
                this.params.some((e) => {
                    if (/^:(.+)/.test(e)) {
                        type = e.replace(/^:(.+)/, "$1");
                        return true;
                    }
                });
                return type;
                // return this.url.replace(/.+\.(.+)/, "$1");
            }

            // Get the data passed during the module
            get data() {
                return this.bag[POST_DATA];
            }
            get relative() {
                return this.bag.__relative__ || location.href;
            }
        }

        // Main distribution function
        function buildUp(dBag) {
            dBag.args.forEach((e) => dBag.result.push(undefined));

            // Number of successful requests 
            let count = 0;
            let iserror = false;

            let {
                result
            } = dBag;

            const pendFunc = dBag[DRILL_PENDFUNC];

            // Packaged into distributable objects
            dBag.args.forEach((str, index) => {
                let pkg = new DPackage(str, dBag);

                // Execution completion function
                let done = (data) => {
                    result[index] = data;
                    count++;

                    if (pendFunc) {
                        pendFunc({
                            index,
                            pkg,
                            data,
                        });
                    }

                    if (dBag.args.length === 1) {
                        dBag[DRILL_RESOLVE](data);
                    } else if (count === dBag.args.length && !iserror) {
                        dBag[DRILL_RESOLVE](result);
                    }

                    done = null;
                };

                // If the -link parameter is present, the link is returned directly
                if (pkg.params.includes("-link")) {
                    done(pkg.src);
                } else if (pkg.params.includes("-pkg")) {
                    done(pkg);
                } else {
                    // Proxy Forwarding
                    agent(pkg)
                        .then(done)
                        .catch((err) => {
                            iserror = true;

                            if (err) {
                                console.error({
                                    expr: str,
                                    src: pkg.src,
                                    ...err,
                                });
                            }

                            result[index] = err;

                            dBag[DRILL_REJECT]({
                                expr: str,
                                src: pkg.src,
                                error: err,
                            });

                            done = null;
                        });
                }
            });
        }

        const DRILL_RESOLVE = Symbol("resolve");
        const DRILL_REJECT = Symbol("reject");
        const POST_DATA = Symbol("postData");
        const DRILL_PENDFUNC = Symbol("pendFunc");

        class Drill extends Promise {
            constructor(...args) {
                if (isFunction(args[0])) {
                    super(...args);
                    return this;
                }
                let res, rej;

                super((resolve, reject) => {
                    res = resolve;
                    rej = reject;
                });

                this.id = "d_" + getRandomId();

                defineProperties(this, {
                    [DRILL_RESOLVE]: {
                        value: res,
                    },
                    [DRILL_REJECT]: {
                        value: rej,
                    },
                    // Parameters for load modules
                    args: {
                        value: args,
                    },
                    // The final array of returned results
                    result: {
                        value: [],
                    },
                    // Relative path to load module
                    __relative__: {
                        writable: true,
                        value: "",
                    },
                });

                nextTick(() => buildUp(this));
            }

            pend(func) {
                if (this[DRILL_PENDFUNC]) {
                    throw {
                        desc: "pend has been used",
                        target: this,
                    };
                }
                defineProperties(this, {
                    [DRILL_PENDFUNC]: {
                        value: func,
                    },
                });

                return this;
            }

            // Passing data to the module to be loaded
            post(data) {
                if (this[POST_DATA]) {
                    throw {
                        desc: "post has been used",
                        target: this,
                    };
                }
                defineProperties(this, {
                    [POST_DATA]: {
                        value: data,
                    },
                });

                return this;
            }
        }


        const load = (glo.load = (...args) => new Drill(...args));

        const config = (opts) => {
            let {
                paths
            } = opts;
            if (paths) {
                // Shortcut path
                Object.keys(paths).forEach((k) => {
                    let val = paths[k];

                    // Definitions that do not start/end with @ are not legal
                    if (!/^@.+\/$/.test(k)) {
                        throw {
                            desc: "incorrect definition of paths",
                            key: k,
                        };
                    }

                    if (!/.+\/$/.test(k)) {
                        throw {
                            desc: "incorrect definition of paths",
                            key: k,
                            path: val,
                        };
                    }

                    // pathsMap.set(k, val);
                    pathsMap.set(new RegExp(`^` + k), val);
                });
            }
        };

        const drill = {
            load,
            config,
            // Whether the resource has been loaded
            async has(src) {
                let path = await load(`${src} -link`);

                return !!getBag(path);
            },
            // Delete this resource cache
            async remove(src) {
                let path = await load(`${src} -link`);
                let record = getBag(path);

                // Delete Mounted Elements
                let sele = record.sourceElement;
                if (sele) {
                    sele.parentNode.removeChild(sele);
                }

                // Delete cached data
                bag.delete(path);
            },
            // Secondary development extension method
            ext(callback) {
                callback({
                    bag,
                    addLoader,
                    addProcess,
                });
            },
            bag,
            version: "4.0.0",
            v: 4000000,
        };

        // Global Functions
        defineProperties(glo, {
            drill: {
                value: drill,
            },
        });
    })(typeof globalThis != "undefined" ? globalThis : window);
    // Customized Components
    drill.ext(({
        addProcess
    }) => {
        addProcess("Component", async ({
            respone,
            record,
            relativeLoad
        }) => {
            let result = respone;

            if (isFunction(respone)) {
                result = await respone({
                    load: relativeLoad,
                    FILE: record.src,
                });
            }

            const defaults = await getDefaults(record, relativeLoad, result);

            // Register Component
            register(defaults);

            record.done(async (pkg) => {});
        });
    });

    const getDefaults = async (record, relativeLoad, result) => {
        const defaults = {
            // Static template
            temp: "",
            // static template address
            tempsrc: "",
            // The following are the component data that comes with X shear
            // tag: "",
            data: {},
            attrs: {},
            proto: {},
            watch: {},
            // created() { },
            // ready() { },
            // attached() { },
            // detached() { },
        };

        Object.assign(defaults, result);

        let defineName = new URL(record.src).pathname
            .replace(/.*\/(.+)/, "$1")
            .replace(/\.js$/, "");

        // Component name correction
        if (!defaults.tag) {
            defaults.tag = defineName;
        }

        // Get Template
        if (defaults.temp === "") {
            let {
                tempsrc
            } = defaults;

            // Get temp of the same name as the module
            let temp = await relativeLoad(tempsrc || `./${defineName}.html`);

            defaults.temp = await fixRelativeSource(temp, relativeLoad);
        }

        return defaults;
    };

    // Fix the resource address in temp
    const fixRelativeSource = async (temp, relativeLoad) => {
        // Fix all resource addresses to include content within the template
        let tempEle = document.createElement("template");
        tempEle.innerHTML = temp;

        // Fix all links
        let hrefEles = tempEle.content.querySelectorAll("[href]");
        let srcEles = tempEle.content.querySelectorAll("[src]");
        let hasStyleEle = tempEle.content.querySelectorAll(`[style*="url("]`);

        // All processes
        const pms = [];

        hrefEles &&
            Array.from(hrefEles).forEach((ele) => {
                pms.push(
                    (async () => {
                        let relative_href = await relativeLoad(
                            `${ele.getAttribute("href")} -link`
                        );
                        ele.setAttribute("href", relative_href);
                    })()
                );
            });

        srcEles &&
            Array.from(srcEles).forEach((ele) => {
                pms.push(
                    (async () => {
                        let relative_src = await relativeLoad(
                            `${ele.getAttribute("src")} -link`
                        );
                        ele.setAttribute("src", relative_src);
                    })()
                );
            });

        // Fix style resource address
        hasStyleEle &&
            Array.from(hasStyleEle).forEach((ele) => {
                pms.push(
                    (async () => {
                        ele.setAttribute(
                            "style",
                            await fixStyleUrl(ele.getAttribute("style"), relativeLoad)
                        );
                    })()
                );
            });

        let styles = tempEle.content.querySelectorAll("style");
        styles &&
            Array.from(styles).forEach((style) => {
                pms.push(
                    (async () => {
                        style.innerHTML = await fixStyleUrl(style.innerHTML, relativeLoad);
                    })()
                );
            });

        await Promise.all(pms);

        return tempEle.innerHTML;
    };

    // Fix the resource address on the style string
    const fixStyleUrl = async (styleStr, relativeLoad) => {
        let m_arr = styleStr.match(/url\(.+?\)/g);

        if (m_arr) {
            await Promise.all(
                m_arr.map(async (url) => {
                    let url_str = url.replace(/url\((.+?)\)/, "$1");
                    let n_url = await relativeLoad(`${url_str} -link`);

                    styleStr = styleStr.replace(url, `url(${n_url})`);
                })
            );
        }

        return styleStr;
    };

    drill.ext(({
        addProcess
    }) => {
        addProcess("Page", async ({
            respone,
            record,
            relativeLoad
        }) => {
            let result = respone;

            if (isFunction(respone)) {
                result = await respone({
                    load: relativeLoad,
                    FILE: record.src,
                });
            }

            // Conversion Templates
            const defaults = await getDefaults(record, relativeLoad, result);
            let d = transTemp(defaults.temp);
            defaults.temp = d.html;

            // Get settable keys
            const cansetKeys = getCansetKeys(defaults);

            record.done(async (pkg) => {
                return {
                    defaults,
                    cansetKeys,
                    temps: d.temps
                };
            });
        });
    });

    const PAGESTATUS = Symbol("page_status");

    // Get the o-page on the o-app layer
    const getCurrentPage = (host) => {
        if (host.parent.is("o-app")) {
            return host;
        }

        while (host.host) {
            host = host.host;
            if (host.is("o-page") && host.parent.is("o-app")) {
                return host;
            }
        }
    };

    register({
        tag: "o-page",
        attrs: {
            // Resource Address
            src: null,
        },
        data: {
            // Status of the current page
            // empty: blank state, waiting for the page to be loaded
            // loading : loading
            // loaded: loaded successfully
            // error: loading resource failed
            [PAGESTATUS]: "empty",
        },
        proto: {
            get status() {
                return this[PAGESTATUS];
            },
            get app() {
                let target = getCurrentPage(this);

                if (target) {
                    return target.parent;
                }
                console.warn({
                    desc: `cannot find the app`,
                    target: this,
                });
                return null;
            },
            get query() {
                const searchParams = new URLSearchParams(
                    this.src.replace(/.+(\?.+)/, "$1")
                );

                let obj = {};

                for (const [key, value] of searchParams.entries()) {
                    obj[key] = value;
                }

                return obj;
            },
            // Jump to the corresponding page
            navigateTo(src) {
                let cPage = getCurrentPage(this);

                if (!cPage) {
                    throw {
                        desc: "cannot use navigateTo without in app",
                        target: this,
                    };
                }

                // Find the id of the current page
                const {
                    router
                } = this.app;
                let id = router.findIndex((e) => e._page == cPage);

                router.splice(id + 1, router.length, src);
            },
            // Replacement Jump
            replaceTo(src) {
                let cPage = getCurrentPage(this);

                if (!cPage) {
                    throw {
                        desc: "cannot use replaceTo without in app",
                        target: this,
                    };
                }

                // Find the id of the current page
                const {
                    router
                } = this.app;
                let id = router.findIndex((e) => e._page == cPage);

                router.splice(id, router.length, src);
            },
            // back page
            back() {
                let {
                    app
                } = this;
                app && app.back();
            },
        },
        watch: {
            async src(src) {
                if (!src) {
                    return;
                }
                if (this[PAGESTATUS] !== "empty") {
                    throw {
                        desc: "src can only be set once",
                        target: this,
                    };
                }

                this[PAGESTATUS] = "loading";

                if (this._waiting) {
                    // Waiting to load
                    await this._waiting;
                }

                let defaults;

                // Get rendering data
                try {
                    let data = await load(src);

                    this._realsrc = await load(src + " -link");

                    // Revise modifiable fields
                    const n_keys = new Set([
                        ...Array.from(this[CANSETKEYS]),
                        ...data.cansetKeys,
                    ]);
                    n_keys.delete("src");
                    this[CANSETKEYS] = n_keys;

                    defaults = data.defaults;

                    // Merging data in the prototype chain
                    extend(this, defaults.proto);

                    // Render the element again
                    renderXEle({
                        xele: this,
                        defs: Object.assign({}, defaults, {
                            // o-page does not allow attrs
                            attrs: {},
                        }),
                        temps: data.temps,
                        _this: this.ele,
                    }).then((e) => {
                        this.ele.x_render = 2;
                        this.attr("x-render", 2);
                    });
                } catch (err) {
                    if (glo.ofa) {
                        this.html = ofa.onState.loadError(err);
                        this[PAGESTATUS] = "error";
                    }
                    return;
                }

                this[PAGESTATUS] = "loaded";

                emitUpdate(this, {
                    xid: this.xid,
                    name: "setData",
                    args: ["status", this[PAGESTATUS]],
                });

                defaults.attached &&
                    this.__attached_pms.then(() => defaults.attached.call(this));
                defaults.detached &&
                    this.__detached_pms.then(() => defaults.detached.call(this));
            },
        },
        created() {
            this.__attached_pms = new Promise((res) => (this.__attached_resolve = res));
            this.__detached_pms = new Promise((res) => (this.__detached_resolve = res));
            this.__loaded
        },
        attached() {
            this.__attached_resolve();
        },
        detached() {
            this.__detached_resolve();
        },
    });

    const ROUTERPAGE = Symbol("router_page");

    // All app elements
    const apps = [];

    // Number of waiters waiting to be loaded
    let waitCount = 2;

    register({
        tag: "o-app",
        temp: `<style>:host{display:block}::slotted(o-page){position:absolute;left:0;top:0;width:100%;height:100%}::slotted(o-page[page-area]){transform:translate(0,0);transition:all ease-in-out .25s;z-index:2}::slotted(o-page[page-area=back]){transform:translate(-30%,0);opacity:0;z-index:1}::slotted(o-page[page-area=next]){transform:translate(30%,0);opacity:0;z-index:1}.container{display:flex;flex-direction:column;width:100%;height:100%}.main{position:relative;flex:1}.article{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}</style><style id="initStyle">::slotted(o-page[page-area]){transition:none}</style><div class="container"><div><slot name="header"></slot></div><div class="main"><div class="article" part="body"><slot></slot></div></div></div>`,
        attrs: {
            // Home Address
            home: "",
            // Cite the resource address
            src: "",
        },
        data: {
            router: [],
            // router: [{
            //     path: "",
            //     _page:""
            // }]
            // rect: {
            //     width: "",
            //     height: "",
            // },
            visibility: document.hidden ? 0 : 1,
        },
        watch: {
            async src(src) {
                if (!src || this._loaded_src) {
                    return;
                }
                this._loaded_src = 1;

                // Load the appropriate module and execute
                let m = await load(src);

                m.data && Object.assign(this, m.data);

                if (m.proto) {
                    // Extended Options
                    this.extend(m.proto);
                }

                if (m.ready) {
                    m.ready.call(this);
                }

                if (this.home && !this.router.length) {
                    // When home exists and no other pages are routed, add home
                    this.router.push({
                        path: this.home,
                    });
                }
            },
            home(src) {
                if (!this.src && src && !this.router.length) {
                    this.router.push({
                        path: src,
                    });
                }
            },
            router(router) {
                if (!router.length) {
                    return;
                }
                // Change page routing based on router values
                let backRouter = this._backup_router;
                if (!backRouter) {
                    // Initial Storage
                    backRouter = this._backup_router = [];
                }

                // Pages waiting to be deleted
                const needRemove = backRouter.filter((e) => !router.includes(e));

                // Waiting for the new page to be added
                const needAdd = [];

                let lastIndex = router.length - 1;
                const newRouter = router.map((e, index) => {
                    // Corrected data
                    if (typeof e == "string") {
                        e = createXData({
                            path: e,
                        });

                        e.owner.add(router[XDATASELF]);
                    }

                    if (!e._page) {
                        // Adding page elements
                        let page = (e._page = $({
                            tag: "o-page",
                            src: e.path,
                        }));

                        // Add loading
                        if (glo.ofa && ofa.onState.loading) {
                            page.push(
                                ofa.onState.loading({
                                    src: e.path,
                                })
                            );
                        }

                        let w_resolve;
                        // Add waiting period related properties
                        page._waiting = new Promise((res) => (w_resolve = res));
                        page.__waiter_resolve = w_resolve;
                    }

                    if (e.state && e._page.state === undefined) {
                        let state = e.state;
                        extend(e._page, {
                            get state() {
                                return state;
                            },
                        });
                    }

                    if (!backRouter.includes(e)) {
                        needAdd.push(e);
                    }

                    // fix page-area
                    if (index < lastIndex) {
                        // hide page
                        e._page.attr("page-area", "back");
                    } else if (index == lastIndex) {
                        // current page
                        if (e._page.attr("page-area") === null) {
                            e._page.attr("page-area", "next");
                            // firefox will not work
                            // requestAnimationFrame(() => {
                            //     e._page.attr("page-area", "");
                            // });
                            setTimeout(() => {
                                // If it has been changed, there is no need to modify it again
                                if (e._page.attr("page-area") === "next") {
                                    e._page.attr("page-area", "");
                                }
                            }, 10);
                        } else {
                            e._page.attr("page-area", "");
                        }
                    }

                    // Fix the loading of the waiter
                    if (index + waitCount > lastIndex && e._page.__waiter_resolve) {
                        e._page.__waiter_resolve();
                        delete e._page.__waiter_resolve;
                    }

                    return e;
                });

                // Add page
                needAdd.forEach((e) => {
                    this.push(e._page);
                });

                // delete page
                needRemove.forEach((e) => {
                    e._page.attr("page-area", "next");
                    if (parseFloat(e._page.css.transitionDuration) > 0) {
                        // If the animation deletion is invalid, it will be deleted by setTimeout
                        let timer = setTimeout(() => e._page.remove(), 500);
                        //  If there is an animation, perform an end-of-animation operation
                        e._page.one("transitionend", () => {
                            e._page.remove();
                            clearTimeout(timer);
                        });
                    } else {
                        // No animation directly deleted
                        e._page.remove();
                    }
                });

                // Correction of routing data
                router[XDATASELF].splice(0, 1000, ...newRouter);

                this._backup_router = router.slice();

                // Triggers the activation event of the current page
                router.slice(-1)[0]._page.trigger("activepage");
            },
        },
        proto: {
            get currentPage() {
                return this.router.slice(-1)[0]._page;
            },
            // Back to page
            back() {
                const event = new Event("back", {
                    cancelable: true,
                });
                event.delta = 1;
                this.triggerHandler(event);

                // Block page return behavior when returnValue is false
                if (event.returnValue) {
                    if (this.router.length > 1) {
                        this.router.splice(-1, 1);
                    }
                }
            },
            // get globalData() {
            //   return globalAppData;
            // },
            postback(data) {
                let target;
                if (top !== window) {
                    target = top;
                } else if (opener) {
                    target = opener;
                } else {
                    console.warn("can't use postback");
                    return false;
                }

                target.postMessage({
                        type: "web-app-postback-data",
                        data,
                    },
                    "*"
                );

                return true;
            },
            // Used when you don't want to expose your real address or ensure address uniqueness
            // get shareHash() {
            //     return encodeURIComponent(this.currentPage.src);
            // }
            // set shareHash() {
            //     return encodeURIComponent(this.currentPage.src);
            // }
        },
        ready() {
            window.addEventListener("visibilitychange", (e) => {
                this.visibility = document.hidden ? 0 : 1;
            });

            // The moment it starts, no animation required
            setTimeout(() => {
                this.shadow.$("#initStyle").remove();
            }, 150);
        },
        attached() {
            apps.push(this);
        },
        detached() {
            let id = apps.indexOf(this);
            if (id > -1) {
                apps.splice(id, 1);
            }
        },
    });


    $.fn.extend({
        get page() {
            let host = this;
            while (host && !host.is("o-page")) {
                host = host.host;
            }
            return host;
        },
    });

    let init_ofa = glo.ofa;

    const ofa = {
        v: 3000012,
        version: "3.0.12",
        // Configure the base information
        get config() {
            return drill.config;
        },
        onState: {
            // Content displayed in loading
            loading(e) {
                return `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:14px;color:#aaa;">Loading</div>`;
            },
            // Contents of the load failure display
            loadError(e) {
                return `<div style="text-align:center;"><h2>load Error</h2><div style="color:#aaa;">error expr:${e.expr} <br>error src:${e.src}</div></div>`;
            },
        },
        get apps() {
            return apps.slice();
        },
    };

    defineProperties(glo, {
        ofa: {
            set(val) {
                val(ofa);
            },
            get() {
                return ofa;
            },
        },
    });

    init_ofa && init_ofa(ofa);

    drill.config({
        paths: {
            "@lib/": "https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/lib/",
        },
    });

    glo.$ = $;
})(window);