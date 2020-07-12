Component({
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
        options: {}
    },
    watch: {
        w(e, width) {
            this.$preview.style.width = width + "px";
        },
        h(e, height) {
            this.$preview.style.height = height + "px";
        },
        options(e, options) {
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
        }
    },
    proto: {
        // 选项切换
        selectChange(e) {
            let { name, value } = e.target.ele;

            // 第一个子元素设置
            this.$("*")[name] = (value == 'null' || value == 'undefined') ? null : value;
        }
    }
});