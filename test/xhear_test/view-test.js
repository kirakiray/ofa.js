(() => {
    let tester = expect(4, 'view test');

    $.register({
        tag: "a-two",
        data: {
            x: "100",
            y: "200",
            test: null,
            test2: "",
            test3: undefined,
        },
        attrs: ["x", "y", "test", "test2"],
        temp: `
        <div style="font-size:12px;">
            <div style="color:#ffcc00;">x:{{x}}</div>
            <div style="color:#8a8aff;">y:{{y}}</div>
            <div x-content></div>
        </div>
        `
    });

    $("body").push(`
        <a-two id="v_target"></a-two>
    `);

    $.nextTick(() => {
        tester.ok($("#v_target").ele.getAttribute("x") === '100', "data attribute1 ok");
        tester.ok($("#v_target").ele.getAttribute("test") === null, "data attribute2 ok");
        tester.ok($("#v_target").ele.getAttribute("test2") === '', "data attribute3 ok");
        tester.ok($("#v_target").ele.getAttribute("test3") === null, "data attribute4 ok");
    });
})();