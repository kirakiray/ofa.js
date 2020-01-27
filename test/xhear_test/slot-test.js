(() => {
    let tester = expect(5, 'slot test');

    $.register({
        tag: "stag-test",
        temp: `
        <br>
        <br>
            <div><span>stag-test测试 也是shadow ele</span></div>
            <slot name="top" style="color:red"></slot>
            <slot style="color:green"></slot>
            <div xv-tar="shaEle"></div>
        <br>
        <br>
        `
    });

    // 添加进去看看
    $("#slot_test").push(`
    <stag-test xv-ele>
        <div>我是内容哈哈哈</div>
        <span slot="top">我是要被塞到顶部的元素</span>
    </stag-test>
    `);

    let stag = $('#slot_test stag-test');

    // stag.watch(e => {
    //     throw "slot elements can not emit watch";
    // });

    // 查找多少div
    let div = stag.queAll("div");

    // 查找多少span
    let span = stag.queAll("span");

    let shadowDiv = stag.queAllShadow("div");

    tester.ok(div.length == 1, "length ok 1");
    tester.ok(span.length == 1, "length ok 2");

    tester.ok(shadowDiv.length == 2, "length ok 4");

    // 向 slot top 添加新元素
    stag.push(`<div slot="top">new top text</div>`);

    // // 查找多少div
    tester.ok(stag.queAll("div").length == 2, "length ok 3");
    tester.ok(stag.queAllShadow("div").length == 2, "length ok 5");
})();