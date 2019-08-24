(() => {
    let tester = expect(4, 'view test');

    let testEle = $('#view_test');

    // 注册两个自定义元素
    $.register({
        tag: "a-one",
        data: {
            value: "I am a1"
        },
        temp: `
            <div>{{value}}</div>        
            <input xv-module="value" />
            <div xv-content></div>
        `
    });

    $.register({
        tag: "a-two",
        data: {
            x: "100",
            y: "200"
        },
        attrs: ["x", "y"],
        temp: `
        <div style="font-size:12px;">
            <div style="color:#ffcc00;">x:{{x}}</div>
            <div style="color:#8a8aff;">y:{{y}}</div>
            <div xv-content></div>
        </div>
        `
    });

    // 创建viewData
    let vData = testEle.viewData();

    tester.ok(vData.a1 == "I am a1", "vData ok 1");
    tester.ok(vData.a2X == 300, "vData ok 2");
    tester.ok(vData.a2Y == 200, "vData ok 3");

    // 后续变动
    $("a-two").y = 400;
    $.nextTick(() => {
        tester.ok(vData.a2Y == 400, "vData ok 4");
    });
})();