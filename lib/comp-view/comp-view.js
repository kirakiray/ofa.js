Component(async () => {
    // 转换字符串为仿vscode颜色方案
    function transToHtml(codeText) {
        // 标签内属性拆分
        let tempCode = codeText;

        // 转义特殊字符
        tempCode = tempCode.replace(/</g, "&lt;");
        tempCode = tempCode.replace(/>/g, "&gt;");

        let tagArr = tempCode.match(/&lt;.+?&gt;/g);
        tagArr.forEach(e => {
            // 拆分内部属性
            let tarr = e.match(/&lt;(.+)&gt;/);

            if (tarr) {
                // 抽取标签的内容
                let tagStr = tarr[1];
                let tagStrBackup = tagStr;

                // 内容分行
                let tagStrArr = tagStr.split(" ");

                tagStrArr.forEach((e, i) => {
                    if (i == 0) {
                        // 后标签转换
                        if (/^\//.test(e)) {
                            tagStr = tagStr.replace(/\/(.+)/, `<span style="color:#808080;">/</span><span style="color:#589ad6;">$1</span>`);
                        } else {
                            // 第一个属于tag标签元素
                            tagStr = tagStr.replace(e, `<span style="color:#589ad6;">${e}</span>`);
                        }
                    } else {
                        if (/=/.test(e)) {
                            // 是否带有值
                            let value = e.replace(/(.+)=(.+)/, '<span style="color:#9ddcfd;">$1</span>=<span style="color:#cd9079;">$2</span>');

                            tagStr = tagStr.replace(e, value);
                        } else {
                            // 后面的attributes
                            tagStr = tagStr.replace(e, `<span style="color:#9ddcfd;">${e}</span>`);
                        }
                    }
                });

                // 替换标签的内容
                tempCode = tempCode.replace(tagStrBackup, tagStr);
            }
        });

        // 所有的标签符号转换
        tempCode = tempCode.replace(/&lt;/g, `<span style="color:#808080;">&lt;</span>`);
        tempCode = tempCode.replace(/&gt;/g, `<span style="color:#808080;">&gt;</span>`);

        return tempCode;
    }

    return {
        tag: "comp-view",
        temp: true,
        css: true,
        data: {
            // 当前容器的背景色
            bgcolor: "",
            // 可选背景色选项
            bgcolor_options: ["#fff", "#000", "#33344a"],
            // 预览视图的宽高
            w: "600",
            h: "400",
            // 组件参数
            options: {},
            showSlotInput: false,
            // 显示代码
            codeText: "",
            // 预览区域可用的背景色
            bgs: ["#ffffff", "#000000"],
            // 预览区的背景色
            bg: "#ffffff"
        },
        watch: {
            w(e, width) {
                this.$preview.style.width = width + "px";
            },
            h(e, height) {
                this.$preview.style.height = height + "px";
            },
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
                    codeText = codeText.replace(' xv-ele="1"', "");
                    codeText = codeText.replace(' xv-ele', "");

                    // 去除空属性
                    codeText = codeText.replace(/=""/g, "");
                    codeText = codeText.replace(/=''/g, "");

                    this.$codeEle.html = transToHtml(codeText);
                });
            }
        },
        ready() {
            // 等待加载完成
            this._loaded = new Promise(res => {
                $.nextTick(() => {
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

            // 点击背景按钮切换背景色
            this.$bgTool.on("click", ".bg_btn", e => {
                this.bg = e.target.data.color;
            });
        }
    };
});