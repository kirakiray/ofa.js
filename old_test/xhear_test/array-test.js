(() => {
    let tester = expect(8, 'array test');

    let testEle = $("#array_test");

    let ele = $({
        tag: "test-ele",
        text: 2.5
    });

    testEle.splice(1, 0, ele);

    tester.ok(testEle[1].text == "2.5", "arrar_test[1] ok");
    tester.ok(testEle.length == 4, "splice ok");

    $.nextTick(() => {
        // 替换
        testEle[3] = {
            tag: "div",
            text: "3.5"
        };

        tester.ok(parseFloat(testEle.ele.children[3].innerHTML) == 3.5, "replace arr ok");

        testEle.on('update', e => {
            tester.ok(e.trend.name == "sort", "array sort method update ok");
        });

        testEle.sort((a, b) => {
            return a.text - b.text;
        });

        tester.ok(parseInt(testEle[0].text) == 1, "sort value ok 1");
        tester.ok(parseInt(testEle[1].text) == 2, "sort value ok 2");
        tester.ok(parseFloat(testEle[2].text) == 2.5, "sort value ok 3");
        tester.ok(parseFloat(testEle[3].text) == 3.5, "sort value ok 4");
    });
})();