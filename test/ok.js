(function (glo) {
    // base
    let styleEle = document.createElement('style');
    styleEle.innerHTML = `
        body{
            background-color:#1e1e1e;
            -webkit-font-smoothing: antialiased;
            font-family: "FZLanTingHei-R-GBK", STHeiti STXihei, Microsoft Yahei, Arial;
            color:#fff;
            font-size:14px;
            line-height:1.2em;
        }

        .group{
            margin:20px 0;
        }

        .succeed{
            color:#96aa2d;
        }

        .succeed .title{
            color:#5489b6;
        }

        .error{
            color:#d8353b;
        }

        .wran{
            color:#cd8b58;
        }
    `;
    document.head.appendChild(styleEle);

    // function 
    var getDiv = function (text) {
        let ele = document.createElement('div');
        ele.innerHTML = text || "";
        return ele;
    };

    // 断言
    var assertLine = function (ast, text) {
        let ele = getDiv(text);
        if (ast) {
            ele.classList.add('succeed');
        } else {
            ele.classList.add('error');
        }
        return ele;
    };

    // 直接打印
    glo.ok = function (ast, text, errInfo) {
        document.body.appendChild(assertLine(ast, text));
        if (!ast) {
            console.error(text + " => ", errInfo);
        }
    };

    // 指定次数
    glo.expect = function (count, title) {
        // 主体容器
        let mainEle = getDiv();
        mainEle.classList.add('group');
        mainEle.classList.add('wran');
        document.body.appendChild(mainEle);

        // 添加标题
        let titleEle = getDiv("count(" + count + "):" + title);
        titleEle.setAttribute('class', "title");
        // titleEle.style['color'] = ;
        titleEle && (mainEle.appendChild(titleEle));

        return {
            ok: function (ast, text) {
                let lineEle = getDiv(count + " : " + text);
                count--;
                if (count === 0) {
                    mainEle.classList.remove('wran');
                    mainEle.classList.add('succeed');
                } else if (count < 0) {
                    mainEle.classList.remove('succeed');
                    mainEle.classList.add('error');
                }
                (!ast) && lineEle.classList.add('error');
                mainEle.appendChild(lineEle);
            }
        };
    };

    var once_data_obj = {};
    // 只会打印一次，会跟踪文本
    glo.once = function (ast, text) {
        if (!once_data_obj[text]) {
            let ele = assertLine(ast, '<span style="color:white;">once</span> <span style="color:#2fffff;"> => </span>' + text);
            document.body.appendChild(ele);
            once_data_obj[text] = 1;
        } else {
            let ele = assertLine(false, 'repeat => ' + text);
            document.body.appendChild(ele);
        }
    };
})(window);