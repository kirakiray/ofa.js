Component(async (load) => {
    const transToHtml = await load("../utils/transToHtml");

    return {
        tag: "comp-view",
        temp: true,
        data: {
            // 当前容器的背景色
            bgcolor: "",
            // 可选背景色选项
            bgcolor_options: ["#fff", "#000", "#33344a"],
            // 组件参数
            options: {},
            showSlotInput: false,
            // 显示代码
            codeText: "",
            // 预览区域可用的背景色
            bgs: ["#ffffff", "#000000", "#f3f2f1"],
            // 预览区的背景色
            bg: "#ffffff"
        },
        watch: {
            async options(e, options) {
                if (!options.props) {
                    return;
                }

                await this._loaded;

                // 是否改变插槽的内容
                if (options.slotInput) {
                    // 修正slotInput的value
                    this.$slotInput.ele.value = this._mainEle.text;
                    this.showSlotInput = true;
                } else {
                    this.showSlotInput = false;
                }

                let { props } = options.object;

                let html = '';

                Object.keys(props).forEach(key => {
                    let d = props[key];

                    let { options } = d;

                    let optionsStr = "";

                    options.forEach(e => {
                        optionsStr += `<option value="${e.value}">${e.name || e.value}</option>`;
                    });

                    html += `
                    <div class="p_line">
                        <div class="p_name">${key}</div>
                        <div class="p_input">
                            <select name="${key}">
                                ${optionsStr}
                            </select>
                        </div>
                    </div>
                    `;
                });

                // 清空元素的内容
                this.$propsCon.html = html;
            },
            bgs(e, bgs) {
                if (bgs) {
                    let btn = ``;

                    bgs.forEach(e => {
                        btn += `<div class="bg_btn" data-color="${e}" style="background-color:${e};"></div>`;
                    });

                    this.$bgTool.html = btn;
                } else {
                    this.$bgTool.html = "";
                }
            },
            bg(e, bg) {
                if (bg) {
                    let tar = this.$bgTool.$(`[data-color="${bg}"]`);

                    // 清除掉旧的激活按钮
                    this.$bgTool.all(".active_btn").map(e => e.class.remove("active_btn"));

                    if (tar) {
                        tar.class.add("active_btn");
                    }

                    // 设置背景色
                    this.$preview.style.backgroundColor = bg;
                }
            }
        },
        proto: {
            // 选项切换
            _selectChange(e) {
                let { name, value } = e.target.ele;

                // 第一个子元素设置
                this._mainEle[name] = (value == 'null' || value == 'undefined') ? null : value;

                this._updateCode();
            },
            // slot输入框改动
            _slotInputChange(e) {
                this._mainEle.text = e.target.ele.value;
                this._updateCode();
            },
            // 重新设置外层code
            _updateCode() {
                $.nextTick(() => {
                    let codeText = this._mainEle.ele.outerHTML;

                    // 去除渲染属性
                    codeText = codeText.replace(/ xv-ele="1"/g, "");
                    codeText = codeText.replace(/ xv-ele/g, "");

                    // 去除空属性
                    codeText = codeText.replace(/=""/g, "");
                    codeText = codeText.replace(/=''/g, "");

                    this.$codeEle.html = transToHtml(codeText);
                });
            },
            _init() {
                // 等待加载完成
                this._loaded = new Promise(res => {
                    $.nextTick(() => {
                        if (!this[0]) {
                            console.warn("comp-view must have child elements");
                            return;
                        }

                        if (this[0].xvele) {
                            this._mainEle = this[0];
                            this._updateCode()
                            res();
                            return;
                        }
                        this[0].on("renderend", () => {
                            // 确保获取渲染完成的元素
                            this._mainEle = this[0];
                            this._updateCode();
                            res();
                        });
                    });
                });
            }
        },
        ready() {
            this._init();

            // 点击背景按钮切换背景色
            this.$bgTool.on("click", ".bg_btn", e => {
                this.bg = e.target.data.color;
            });
        },
        slotchange() {
            this._init();
        }
    };
});