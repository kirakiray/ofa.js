define(async () => {
    return (codeText) => {
        // 标签内属性拆分
        let tempCode = codeText;

        // 转义特殊字符
        tempCode = tempCode.replace(/</g, "&lt;");
        tempCode = tempCode.replace(/>/g, "&gt;");

        // 更换回车
        tempCode = tempCode.replace(/\n/g, "<br>");

        // 更换空格
        tempCode = tempCode.replace(/ /g, "&nbsp;");

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
});