(function () {
    // 成功后是否显示面板数据
    var showSucceedPannel = false;

    var showSuccess = document.currentScript.getAttribute("show-success");

    if (showSuccess == "1" || showSuccess == "true") {
        showSucceedPannel = true;
    }

    // 判断是否支持指定语法
    function isSupportExpr(expr) {
        var bol = "?";

        try {
            var a = new Function(expr);
            bol = true;
        } catch (err) {
            bol = false;
        }
        return bol;
    }

    // 面板数据信息
    var supportLet = isSupportExpr("const a = 1; var b = 2;");

    // 是否只是async function 
    var supportAsyncFunc = isSupportExpr("var a = async function(){}");

    // 是否支持Proxy api
    var hasProxy = !!window.Proxy;

    // 是否支持自定义组件
    var hasCustomEle = !!window.customElements && !!window.customElements.define;

    // 查找页面内的指定元素
    setTimeout(function () {
        var canrunEle = document.querySelector("can-run-ofa");

        var event = new Event('loaded');

        var support = supportLet && supportAsyncFunc && hasProxy && hasCustomEle;

        canrunEle.info = event.data = {
            support: support,
            supportLet: supportLet,
            supportAsyncFunc: supportAsyncFunc,
            hasProxy: hasProxy,
            hasCustomEle: hasCustomEle
        };

        canrunEle.setAttribute("support", support ? 1 : 0);

        canrunEle.dispatchEvent(event)
    }, 1);

})();